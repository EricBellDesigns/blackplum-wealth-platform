import {hash} from "bcrypt";
import nextConnect from "next-connect";
import {NextApiRequest, NextApiResponse} from "next";
import {formatValidationErrors} from "@/utils/validation.utils";
import {Investor} from "@/db/models";
import {getInvestorByEmail} from "@/db/queries/investor.queries";
import {generateConfirmationCode, generatePassword} from "@/utils/password.utils";
import {sendConfirmationEmail} from "@/utils/mailer.utils";

// Initialize Next.js API router
const router = nextConnect();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  const {email, password, ...payload} = req.body;
  const exists = await getInvestorByEmail(email);

  // Check if investor with the given email address already exists
  if (exists) {
    // Respond with 400 status code and "User already exists" error message
    return res.status(400).json({error: "User already exists!"});
  } else {
    try {
      // Hash Password before storing it in the database
      const hashedPassword = await generatePassword(password);

      // Generate random confirmation code
      const confirmationCode = generateConfirmationCode();

      // Create investor payload to insert in the database
      const investorPayload = Object.assign({}, payload, {
        password: hashedPassword,
        email: email.toLowerCase(),
        confirmation_code: confirmationCode
      });

      // Attempt to create a new investor record
      const investor = await Investor.query().insert(investorPayload);

      // Send confirmation email
      sendConfirmationEmail(email, confirmationCode);

      console.log(`\nSuccessfully saved investor in the DB!`);
      // Respond with 200 status code and updated investor record
      return res.status(200).json(investor);
    } catch (error: any) {
      // Format validation errors
      const validationErrors = formatValidationErrors(error);

      // Respond with 400 status code and error messages
      return res.status(400).json(validationErrors);
    }
  }
});

export default router;
