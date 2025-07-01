/**
 * @file Defines the queries for investors
 */
import {Investor} from "@/db/models";

export async function getInvestor(id: string) {
  try {
    // Request an Investor record by id property
    return Investor.query().findById(id);
  }
  catch (e) {
    console.error(e.message);
    console.error(`Couldn't retrieve Investor with ID = ${id} from the database.`);
  }
}

export async function getInvestorByEmail(email: string) {
  try {
    // Request a Investor record by email property
    return Investor.query().findOne({email});
  }
  catch (e) {
    console.error(e.message);
    console.error(`Couldn't retrieve Investor with email = ${email} from the database.`);
  }
}
