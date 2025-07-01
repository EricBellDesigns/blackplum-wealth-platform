import {ValidationError} from "objection";

interface FieldErrorObject {
  message: string
  keyword: string,
  params: Object
}

export function parseFormData(formData, Model) {
  // Get jsonSchema associated with given Model
  const jsonSchema = Model.jsonSchema;

  // Initialize the parsedFormData object
  const parsedFormData = {};

  // Iterate over the model's JSON schema properties
  for (const propertyName in jsonSchema.properties) {
    const value = formData[propertyName];

    // Check if the value is null, undefined, or an empty string
    if (value !== null && value !== undefined && value !== "") {
      // Convert the value to the appropriate type based on the JSON schema
      if (jsonSchema.properties[propertyName].type === "integer") {
        parsedFormData[propertyName] = parseInt(value);
      } else if (jsonSchema.properties[propertyName].type === "number") {
        parsedFormData[propertyName] = parseFloat(value);
      } else if (jsonSchema.properties[propertyName].type === "boolean") {
        parsedFormData[propertyName] = (value === "true");
      } else {
        parsedFormData[propertyName] = value;
      }
    }
  }

  return parsedFormData;
}

export function formatValidationErrors(error: any) {
  console.log("\n\n************");
  console.log("errorsObject:");
  console.log(typeof error);
  console.log(error.data);
  console.log("************\n\n");

  // Check if the error is a validation error
  if (error instanceof ValidationError) {
    const validationErrors = {};

    // Capture validation data
    const errorsObject = error.data;

    // Iterate through the error details and extract error messages
    for (const field of Object.keys(errorsObject)) {
      validationErrors[field] = errorsObject[field].map((errorObject: FieldErrorObject) => {
        let validationError = errorObject.message;

        // Customize required error message
        if (errorObject.keyword === "required") {
          validationError = `This field is required.`;
        }

        // Return validation error
        return {message: validationError};
      });
    }

    // Return formatted validation errors
    return validationErrors;
  } else {
    // Return original error message
    return {"non_field_errors": [{"message": error.message}]};
  }
}
