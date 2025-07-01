import {NextApiRequest, NextApiResponse} from "next";
import nextConnect from "next-connect";
import {Investor} from "@/db/models";
import {getPasswordResetToken} from "@/utils/password.utils";
import {sendPasswordResetLink} from "@/utils/mailer.utils";

// Initialize Next.js API router
const router = nextConnect();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  // Retrieve required "email" URL parameter
  const {email} = req.body;

  // Check if user with the given email address exists (lowercase)
  const investor = await Investor.query().findOne({email: email.toLowerCase()});
  if (!investor) {
    return res.status(400).json({error: "User with the given email doesn't exist!"});
  } else {
    // Generate Password Reset link
    const resetCode = getPasswordResetToken(investor);

    // Send email with password reset link
    sendPasswordResetLink(email, resetCode);

    // Respond with 200 status code and password reset code
    return res.status(200).json(resetCode);
  }
});

export default router;
