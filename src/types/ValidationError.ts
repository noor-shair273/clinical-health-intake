export interface ValidationErrorType extends Error {
  isValidationError: boolean;
  errors?: Array<{ field: string; message?: string }>;
}
