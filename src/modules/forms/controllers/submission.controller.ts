import { Request, Response } from "express";
import { validateSubmission, acceptSubmission } from "../services/submission.service.js";

/** POST /forms/:formCode/validate */
export async function validateSubmissionController(req: Request, res: Response) {
  const { formCode } = req.params;
  const submission = req.body;

  const result = await validateSubmission(formCode, submission);
  // Return 200 with validity + errors (do not throw for business validation)
  return res.status(200).json({
    success: true,
    form: { id: result.form._id, code: result.form.code },
    version: { id: result.version._id, version: result.version.version },
    valid: result.valid,
    errors: result.errors,
  });
}

/** POST /forms/:formCode/submit */
export async function acceptSubmissionController(req: Request, res: Response) {
  const { formCode } = req.params;
  const submission = req.body;
  // optionally pick submittedBy from headers/auth if you have it
  const submittedBy = (req as any).user?.id || req.header("x-submitted-by") || undefined;

  const result = await acceptSubmission(formCode, submission, submittedBy);
  // acceptSubmission throws 400 with details if invalid
  return res.status(201).json({
    success: true,
    submissionId: result.submissionId,
  });
}
