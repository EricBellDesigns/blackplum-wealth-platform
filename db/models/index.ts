/**
 * @file Exports Objection Base model
 */

import knex from "knex";
import knexfile from "../../knexfile";
import {Model} from "objection";
// Database model imports
import Investor from "@/db/models/investor.model";
import Admin from "@/db/models/admin.model";
import Offering from "@/db/models/offering.model";
import OfferingPicture from "@/db/models/offering-picture.model";

const {NODE_ENV: environment} = process.env;

export function setupDb() {
  const db = knex(knexfile[environment]);
  Model.knex(db);
  return db;
}

// Bind Model class to a knex instance
setupDb();

export {Investor, Admin, Offering, OfferingPicture};
