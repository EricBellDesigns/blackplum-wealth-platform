import {NextApiRequest, NextApiResponse} from "next";
import nextConnect from "next-connect";
import {Investor} from "@/db/models";
import {base64Decode, decodePasswordResetToken, generatePassword, hashUser} from "@/utils/password.utils";
import dayjs from "dayjs";

// Initialize Next.js API router
const router = nextConnect();

router.post(async (req: NextApiRequest, res: NextApiResponse) => {
  // Retrieve required "email" URL parameter
  const {email, password, reset_code} = req.body;

  // Decode properties passed in password reset token
  const {ident, today, hash} = decodePasswordResetToken(reset_code);

  // Check if the link in not out of date
  const todayDecoded = base64Decode(today);
  const then = dayjs(todayDecoded);
  const now = dayjs();
  const hoursSince = now.diff(then, "hours");

  // Display error if password reset token is older than 2 hours
  if (hoursSince > 2) {
    return res.status(400).json({error: "Password reset token has expired!"});
  }

  // Retrieve investor given encoded user id
  const investorId = base64Decode(ident);

  try {
    // Retrieve investor using decoded id
    const investor = await Investor.query().findOne({id: investorId, email});

    // Check if user record exists
    if (!investor) {
      return res.status(400).json({error: "Account not found!"});
    }

    // Hash again all the data to compare it with link
    // The link in invalid when:
    // 1. If the lastLoginDate is changed, user has already logged in
    // 2. If the salt is changed, the user has already changed the password
    const hashedUser = hashUser(today, investor);

    if (hashedUser !== hash) {
      return res.status(400).json({error: "Password reset token is invalid!"});
    } else {
      // Hash Password before storing it in the database
      const hashedPassword = await generatePassword(password);

      // Update password in the database
      const updatedInvestor = await Investor.query().patchAndFetchById(investorId, {
        password: hashedPassword,
        // password_changed_at: new Date() // Set to current date and time
      });

      // Respond with 200 status code and updated investor record
      return res.status(200).json(updatedInvestor);
    }
  } catch (e) {
    const error = e.message;
    console.error(error);
    return res.status(400).json({error});
  }
});

export default router;
