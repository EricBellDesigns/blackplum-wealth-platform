import {Model} from "objection";

export default class OfferingPicture extends Model {
  static get tableName() {
    return "offering_pictures";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["offering_id", "path"],
      properties: {
        id: {type: "string", format: "uuid"},
        offering_id: {type: "string", format: "uuid"},
        path: {type: "string", maxLength: 255},
        size: {type: "integer"},
        created_at: {type: "string", format: "date-time"},
        updated_at: {type: "string", format: "date-time"}
      }
    };
  }
}
