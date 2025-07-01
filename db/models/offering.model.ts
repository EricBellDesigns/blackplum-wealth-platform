import {Model} from "objection";
import {Admin, OfferingPicture} from "@/db/models";
import OfferingDocument from "@/db/models/offering-document.model";

export default class Offering extends Model {
  static get tableName() {
    return "offerings";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: [
        "admin_id",
        "title",
        "offering_type",
        "target_funding_date",
        "minimum_investment",
        "total_capital_investment",
        "monthly_pmt_to_investor",
        "investor_yield",
        "gross_protective_equity",
        "property_address",
        "property_type",
        "occupancy",
        "market_value",
        "borrower_credit_score",
        "loan_type",
        "lien_position",
        "payment_type",
        "loan_term",
      ], // Specify required fields
      properties: {
        id: {type: "string", format: "uuid"},
        admin_id: {type: "string", format: "uuid"},
        title: {type: "string", maxLength: 255},
        offering_type: {type: "string", maxLength: 255},
        target_funding_date: {type: "string", format: "date"},
        minimum_investment: {type: "number"},
        total_capital_investment: {type: "number"},
        monthly_pmt_to_investor: {type: "number"},
        investor_yield: {type: "number"},
        gross_protective_equity: {type: "number"},
        exit_strategy: {type: "string", maxLength: 1020},
        property_address: {type: "string", maxLength: 255},
        property_type: {type: "string", maxLength: 10},
        occupancy: {type: "string", maxLength: 20},
        market_value: {type: "number"},
        apn: {type: "string", maxLength: 20},
        county: {type: "string", maxLength: 255},
        year_built: {type: "integer"},
        square_footage: {type: "number"},
        lot_size: {type: "string", maxLength: 255},
        bedrooms: {type: "integer"},
        bathrooms: {type: "integer"},
        exterior: {type: "string", maxLength: 1020},
        zoning: {type: "string", maxLength: 1020},
        existing_first_mortgage: {type: "boolean"},
        borrower_credit_score: {type: "integer"},
        loan_type: {type: "string", maxLength: 20},
        lien_position: {type: "string", maxLength: 3},
        payment_type: {type: "string", maxLength: 15},
        loan_term: {type: "string", maxLength: 255},
        prepaid_interest: {type: "string", maxLength: 255},
        guaranteed_interest: {type: "string", maxLength: 255},
        createdAt: {type: "string", format: "date-time"},
        updatedAt: {type: "string", format: "date-time"}
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    return {
      admin: {
        relation: Model.BelongsToOneRelation,
        modelClass: Admin,
        join: {
          from: "offerings.admin_id",
          to: "admins.id"
        }
      },
      pictures: {
        relation: Model.HasManyRelation,
        modelClass: OfferingPicture,
        join: {
          from: "offerings.id",
          to: "offering_pictures.offering_id"
        }
      },
      documents: {
        relation: Model.HasManyRelation,
        modelClass: OfferingDocument,
        join: {
          from: "offerings.id",
          to: "offering_documents.offering_id"
        }
      }
    };
  }
}
