import {Model} from "objection";

export default class Investor extends Model {
  static get tableName() {
    return "investors";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "email", "password", "residency_status", "investing_experience"],
      properties: {
        id: {type: "string", format: "uuid"},
        name: {type: "string", maxLength: 255},
        email: {type: "string", maxLength: 255},
        password: {type: "string", maxLength: 60},
        residency_status: {
          type: "string",
          maxLength: 30,
          enum: [
            "individual_california_resident",
            "entity_california_resident",
            "non_california_resident",
          ]
        },
        investing_experience: {
          type: "string",
          maxLength: 32,
          enum: ["experienced_trust_deed_investor", "new_trust_deed_investor"],
        },
        investing_experience_years: {type: "integer"},
        confirmation_code: {type: "string", maxLength: 16},
        confirmed: {type: "boolean", default: false},
        created_at: {type: "string", format: "date-time"},
        updated_at: {type: "string", format: "date-time"}
      }
    };
  }
}
