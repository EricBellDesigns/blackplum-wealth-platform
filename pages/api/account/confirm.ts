import {NextApiRequest, NextApiResponse} from "next";
import nextConnect from "next-connect";
import {Investor} from "@/db/models";

// Initialize Next.js API router
const router = nextConnect();

router.get(async (req: NextApiRequest, res: NextApiResponse) => {
  // Retrieve optional "code" URL parameter
  const {code: confirmation_code} = req.query;

  // Determine if account is confirmed
  let isConfirmed: boolean;

  try {
    // Confirm the associated account
    await Investor.query().findOne({confirmation_code}).patch({
      confirmed: true
    });

    // Account was successfully confirmed
    isConfirmed = true;
  } catch (e) {
    console.error(e);
    // Account couldn't be confirmed
    isConfirmed = false;
  }

  // Prepare URL parameters to attach
  const params = `?confirmed=${isConfirmed}`;

  // Redirect investor to login page
  return res.redirect("/login" + params);
});

export default router;
