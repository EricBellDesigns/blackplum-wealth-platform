import path from "path";
import nextConnect from "next-connect";
import multer from "multer";
import {NextApiRequest, NextApiResponse} from "next";
import {getNextServerSession} from "pages/api/auth/[...nextauth]";
import {Offering, OfferingPicture, setupDb} from "@/db/models";
import {formatValidationErrors, parseFormData} from "@/utils/validation.utils";
import {S3Client} from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import OfferingDocument from "@/db/models/offering-document.model";

const {AWS_ACCESS_KEY, AWS_SECRET_KEY, AWS_REGION, AWS_BUCKET_S3} = process.env;

// Configure S3 connection
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  }
});

// Initialize Knex instance
const knex = setupDb();

interface MulterFile {
  id?: string;
  key: string // Available using S3
  location: string // Available using S3
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  name: string;
  size: number;
}

interface NextApiUploadRequest extends NextApiRequest {
  files: {
    pictures_to_add: MulterFile[];
    documents_to_add: MulterFile[];
  }
}

function getFileExtension(mimeType: string) {
  const parts = mimeType.split("/");
  if (parts.length === 2) {
    return parts[1];
  }
}

// Initialize "multer" to handle uploading files
const storage = multerS3({
  s3: s3,
  bucket: AWS_BUCKET_S3,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  acl: "public-read-write",
  key: function (req, file, cb) {
    // Determine file type and give it an appropriate name
    if (file.fieldname === "pictures_to_add") {
      // Save the uploaded file with "property-[timestamp]" filename
      const filename = `property-${Date.now()}.${getFileExtension(file.mimetype)}`;
      cb(null, path.join("pictures", filename));
    } else if (file.fieldname === "documents_to_add") {
      // Save the uploaded file with its original filename
      cb(null, path.join("documents", file.originalname));
    }
  }
});

const upload = multer({
  storage,
  limits: {fieldSize: 500 * 1024 * 1024} // Max upload size 500 MB
});

// Initialize Next.js API router
const router = nextConnect();

// Handle retrieving an Offering record
router.get(async (req: NextApiUploadRequest, res: NextApiResponse) => {
  // Retrieve authentication session
  const session = await getNextServerSession(req, res);
  console.log("\n\n************###");
  console.log("Admin Session:");
  console.log(session);
  console.log("###************\n\n");

  // Get offering id if passed in the url
  const {offeringId} = req.query;

  try {
    // Retrieve a list of all offerings
    const offering = await Offering.query()
      .findById(offeringId)
      .withGraphFetched("admin")
      .withGraphFetched("pictures")
      .withGraphFetched("documents");

    // Respond with 200 status code and updated user record
    return res.status(200).json(offering);
  } catch (error: any) {
    console.log(error);
    // Format validation errors
    const validationErrors = formatValidationErrors(error);

    // Respond with 400 status code and error messages
    return res.status(400).json(validationErrors);
  }
});

// Handle editing an Offering record
router
  .use(upload.fields([
    {name: "pictures_to_add", maxCount: 30},
    {name: "documents_to_add", maxCount: 30}
  ]))
  .put(async (req: NextApiUploadRequest, res: NextApiResponse) => {
    // Retrieve authentication session
    const session = await getNextServerSession(req, res);

    // Retrieve logged in admin id
    const adminId = session.user.id;

    // Get offering id if passed in the url
    const {offeringId} = req.query;

    // Parse form data passed in request body
    const formData = req.body;

    // Retrieve pictures and documents to delete
    const picturesToDelete = JSON.parse(formData.pictures_to_delete);
    const documentsToDelete = JSON.parse(formData.documents_to_delete);

    // Parse form data object
    let payload = parseFormData(formData, Offering);

    // Get upload pictures and documents to add passed in the http request
    const {pictures_to_add, documents_to_add} = req.files;

    // Convert possible undefined values to empty array
    const picturesToAdd = pictures_to_add || [];
    const documentsToAdd = documents_to_add || [];

    // Retrieve the current pictures associated with the given offering
    const offeringPictures = await OfferingPicture.query()
      .where({offering_id: offeringId});

    // Ensure the listing will have at least 1 picture
    if (!(picturesToAdd.length > 0 || offeringPictures.length > picturesToDelete.length)) {
      return res.status(400).json({
        pictures: [{message: "Please upload one or more pictures."}]
      });
    }

    // Initialize array of promises
    const promises = [];

    // Include the admin associated with the listing in payload
    payload["admin_id"] = adminId;

    // Start SQL transaction
    const trx = await knex.transaction();

    try {
      // Update the Offering record in the database
      const offering = await Offering.query(trx).patchAndFetchById(offeringId, payload);

      // Check if user uploaded any new pictures
      if (picturesToAdd.length > 0) {
        // Iterate over an array of uploaded new pictures
        for (const pictureToAdd of picturesToAdd) {
          // Attempt to insert Offering Picture record
          const promise = OfferingPicture.query(trx).insert({
            path: pictureToAdd.location,
            offering_id: offering.id,
            size: pictureToAdd.size
          });
          // Append a new promise to array of promises
          promises.push(promise);
        }
      }

      // Check if user deleted any pictures
      if (picturesToDelete.length > 0) {
        // Iterate over an array of deleted pictures
        for (const pictureToDelete of picturesToDelete) {
          // Attempt to delete the Offering Picture record
          const promise = OfferingPicture.query(trx).deleteById(pictureToDelete.id);
          // Append a new promise to array of promises
          promises.push(promise);
        }
      }

      // Check if user uploaded any new documents
      if (documentsToAdd.length > 0) {
        // Iterate over an array of uploaded new documents
        for (const documentToAdd of documentsToAdd) {
          // Attempt to insert Offering Document record
          const promise = OfferingDocument.query(trx).insert({
            path: documentToAdd.location,
            filename: documentToAdd.originalname,
            offering_id: offering.id,
            size: documentToAdd.size
          });
          // Append a new promise to array of promises
          promises.push(promise);
        }
      }

      // Check if user deleted any documents
      if (documentsToDelete.length > 0) {
        // Iterate over an array of deleted documents
        for (const documentToDelete of documentsToDelete) {
          // Attempt to delete the Offering Document record
          const promise = OfferingDocument.query(trx).deleteById(documentToDelete.id);
          // Append a new promise to array of promises
          promises.push(promise);
        }
      }

      // Execute all aggregated promises
      await Promise.all(promises);

      // Commit the transaction if all operations were successful
      await trx.commit();

      // Respond with 200 status code and updated user record
      return res.status(200).json(offering);
    } catch (error: any) {
      // Rollback the transaction if any error occurs
      await trx.rollback();

      // Format validation errors
      const validationErrors = formatValidationErrors(error);

      // Respond with 400 status code and error messages
      return res.status(400).json(validationErrors);
    }
  });

// Handle deleting an Offering record
router.delete(async (req: NextApiUploadRequest, res: NextApiResponse) => {
  // Retrieve authentication session
  const session = await getNextServerSession(req, res);

  // Get offering id if passed in the url
  const {offeringId} = req.query;

  try {
    // Delete a list of all offerings
    const numDeleted = await Offering.query().deleteById(offeringId);

    // Respond with 200 status code and updated user record
    return res.status(200).json(numDeleted);
  } catch (error: any) {
    console.log(error);
    // Format validation errors
    const validationErrors = formatValidationErrors(error);

    // Respond with 400 status code and error messages
    return res.status(400).json(validationErrors);
  }
});

export default router;

export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
};
