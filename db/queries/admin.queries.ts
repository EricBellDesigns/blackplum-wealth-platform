/**
 * @file Defines the queries for users
 */
import {Admin} from "@/db/models";

export async function getAdmin(id: string) {
  try {
    // Request a Admin record by id property
    return Admin.query().findById(id);
  }
  catch (e) {
    console.error(e.message);
    console.error(`Couldn't retrieve Admin with ID = ${id} from the database.`);
  }
}

export async function getAdminByEmail(email: string) {
  try {
    // Request an Admin record by email property
    return Admin.query().findOne({email});
  }
  catch (e) {
    console.error(e.message);
    console.error(`Couldn't retrieve Admin with email = ${email} from the database.`);
  }
}
