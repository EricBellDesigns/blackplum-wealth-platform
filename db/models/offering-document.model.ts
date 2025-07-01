import {Model} from "objection";

export default class OfferingDocument extends Model {
  static get tableName() {
    return "offering_documents";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["offering_id", "filename", "path"],
      properties: {
        id: {type: "string", format: "uuid"},
        offering_id: {type: "string", format: "uuid"},
        filename: {type: "string", maxLength: 255},
        path: {type: "string", maxLength: 255},
        size: {type: "integer"},
        created_at: {type: "string", format: "date-time"},
        updated_at: {type: "string", format: "date-time"}
      }
    };
  }
}
