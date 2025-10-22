import { Request, Response } from "express";
import { validateSubmission, acceptSubmission } from "../services/submission.service.js";

export async function validateSubmissionController(req: Request, res: Response) {
  const { formCode } = req.params;
  const submission = req.body;

  const result = await validateSubmission(formCode, submission);
  return res.status(200).json({
    success: true,
    form: { id: result.form._id, code: result.form.code },
    version: { id: result.version._id, version: result.version.version },
    valid: result.valid,
    errors: result.errors,
  });
}

export async function acceptSubmissionController(req: Request, res: Response) {
  const { formCode } = req.params;
  const submission = req.body;

  const result = await acceptSubmission(formCode, submission);
  // acceptSubmission throws 400 with details if invalid
  return res.status(201).json({
    success: true,
    submissionId: result.submissionId,
  });
}
