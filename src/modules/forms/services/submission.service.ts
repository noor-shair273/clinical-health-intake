import { Form } from "../models/form.model";
import { FormVersion } from "../models/formVersion.model";
import { Submission } from "../models/submission.model";
import { FormStatus } from "../enums/formStatus";
import { normalizeDsl } from "../schema/normalizer";
import { validateFields } from "./validator";

type ValidationResult = {
  form: any;
  version: any;
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
};

/** Load published version + validate against it */
export async function validateSubmission(
  formCode: string,
  submission: any
): Promise<ValidationResult> {
  const form = await Form.findOne({ code: formCode });
  if (!form) {
    const err: any = new Error("Form not found");
    err.statusCode = 404;
    throw err;
  }

  const version = await FormVersion.findOne({
    formId: form._id,
    status: FormStatus.Published,
  }).sort({ version: -1 });

  if (!version) {
    const err: any = new Error("No published form version");
    err.statusCode = 409;
    throw err;
  }

  const normalized = normalizeDsl(version.dsl?.fields || []);
  const errors = validateFields(normalized, submission);

  return { form, version, valid: errors.length === 0, errors };
}

/** Validate then save a submission (reject on validation errors) */
export async function acceptSubmission(
  formCode: string,
  submission: any,
) {
  const result = await validateSubmission(formCode, submission);

  if (!result.valid) {
    const err: any = new Error("Submission is invalid");
    err.statusCode = 400;
    err.errors = result.errors;
    throw err;
  }

  const doc = await Submission.create({
    formId: result.form._id,
    formVersionId: result.version._id,
    answers: submission
  });

  return {
    success: true,
    submissionId: doc._id,
  };
}
