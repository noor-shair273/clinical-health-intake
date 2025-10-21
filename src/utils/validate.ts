import Ajv from "ajv";
import addFormats from "ajv-formats";
import { ValidationErrorType } from "../types/ValidationError";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

export function validate(schema: any, data: any) {
  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    const error: ValidationErrorType = new Error("Validation failed") as ValidationErrorType;
    error.name = "ValidationError";
    error.isValidationError = true;
    error.errors = validate.errors?.map(err => ({
      field: err.instancePath?.replace(/^\//, "") || (err.params as any).missingProperty,
      message: err.message,
    }));
    throw error;
  }
}
