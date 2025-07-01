import {Model} from "objection";

export default class Admin extends Model {
  static get tableName() {
    return "admins";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "email", "password"], // Specify required fields
      properties: {
        id: {type: "string", format: "uuid"},
        name: {type: "string", maxLength: 255},
        email: {type: "string", maxLength: 255, format: "email"},
        password: {type: "string", minLength: 6, maxLength: 60},
        created_at: {type: "string", format: "date-time"},
        updated_at: {type: "string", format: "date-time"}
      },
    };
  }
}
