import path from "path";
import multer from "multer";
import multerS3 from "multer-s3";
import nextConnect from "next-connect";
import {S3Client} from "@aws-sdk/client-s3";
import {NextApiRequest, NextApiResponse} from "next";
import {getNextServerSession} from "pages/api/auth/[...nextauth]";
import {Offering, OfferingPicture, setupDb} from "@/db/models";
import {formatValidationErrors, parseFormData} from "@/utils/validation.utils";
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
    pictures: MulterFile[];
    documents: MulterFile[];
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
    if (file.fieldname === "pictures") {
      // Save the uploaded file with "property-[timestamp]" filename
      const filename = `property-${Date.now()}.${getFileExtension(file.mimetype)}`;
      cb(null, path.join("pictures", filename));
    } else if (file.fieldname === "documents") {
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

router.get(async (req: NextApiUploadRequest, res: NextApiResponse) => {
  // Retrieve authentication session
  const session = await getNextServerSession(req, res);

  // Retrieve optional page URL parameters
  let {page} = req.query;

  // Set page number to 1 if page parameter isn't provided or is < 1
  page = page && page >= 0 ? page : 0;
  const pageSize = 6;

  try {
    // Retrieve a list of paginated offerings
    const offeringsResult = await Offering.query()
      .withGraphFetched("[admin, pictures, documents]")
      .orderBy("updated_at", "desc")
      .page(page, pageSize);

    // Retrieve paginated values
    const offerings = offeringsResult.results;
    const totalNum = offeringsResult.total;

    // Respond with 200 status code and updated user record
    return res.status(200).json({offerings, pageSize, totalNum});
  } catch (error: any) {
    console.log(error);
    // Format validation errors
    const validationErrors = formatValidationErrors(error);

    // Respond with 400 status code and error messages
    return res.status(400).json(validationErrors);
  }
});

router
  .use(upload.fields([
    {name: "pictures", maxCount: 30},
    {name: "documents", maxCount: 30}
  ]))
  .post(async (req: NextApiUploadRequest, res: NextApiResponse) => {
    // Retrieve authentication session
    const session = await getNextServerSession(req, res);
    console.log("\n\n************###");
    console.log("Admin Session:");
    console.log(session);
    console.log(req.files);
    console.log("###************\n\n");

    // Retrieve logged in admin id
    const adminId = session.user.id;

    // Parse form data passed in request body
    const formData = req.body;
    let payload = parseFormData(formData, Offering);

    // Get upload pictures and documents passed in the http request
    const {pictures, documents} = req.files;

    // Check if user uploaded any pictures
    if (!pictures || pictures.length === 0) {
      return res.status(400).json({
        pictures: [{message: "Please upload one or more pictures."}]
      });
    }

    // Initialize array of promises
    const promises = [];

    // Include the admin associated with the listing in payload
    payload["admin_id"] = adminId;

    console.log("\n\n------------");
    console.log(payload);
    console.log("------------\n\n");

    // Start SQL transaction
    const trx = await knex.transaction();

    try {
      // Create a new Offering record in the database
      const offering = await Offering.query(trx).insert(payload);

      // Check if user uploaded any pictures
      if (pictures) {
        // Iterate over an array of uploaded pictures
        for (const picture of pictures) {
          // Attempt to insert Offering Picture record
          const promise = OfferingPicture.query(trx).insert({
            path: picture.location,
            offering_id: offering.id,
            size: picture.size
          });
          // Append a new promise to array of promises
          promises.push(promise);
        }
      }

      // Check if user uploaded any documents
      if (documents) {
        // Iterate over an array of uploaded documents
        for (const document of documents) {
          // Attempt to insert Offering Document record
          const promise = OfferingDocument.query(trx).insert({
            path: document.location,
            filename: document.originalname,
            offering_id: offering.id,
            size: document.size
          });
          // Append a new promise to array of promises
          promises.push(promise);
        }
      }

      // Execute all Offering Picture promises
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

      console.log("\n\n============");
      console.log(validationErrors);
      console.log("============\n\n");

      // Respond with 400 status code and error messages
      return res.status(400).json(validationErrors);
    }
  });

export default router;

// Export config to set size limit for files
export const config = {
  api: {
    bodyParser: false // Disallow body parsing, consume as stream
  }
};
