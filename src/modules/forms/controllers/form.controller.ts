import { Request, Response } from "express";
import * as FormService from "../services/form.service";
import { validate } from "../../../utils/validate";
import { createFormSchema, createDraftSchema, publishSchema } from "../schema/form.schema";

export async function createFormController(req: Request, res: Response) {
  validate(createFormSchema, req.body);
  const form = await FormService.createForm(req.body);
  res.status(201).json({ success: true, data: form });
}

export async function createDraftController(req: Request, res: Response) {
  validate(createDraftSchema, req.body);
  const { formCode } = req.params;
  const draft = await FormService.createDraftVersion(formCode, req.body.dsl);
  res.status(201).json({ success: true, data: draft });
}

export async function publishVersionController(req: Request, res: Response) {
  validate(publishSchema, req.body);
  const { formCode } = req.params;
  const { version } = req.body;
  const result = await FormService.publishVersion(formCode, version);
  res.status(200).json({ success: true, data: result });
}

export async function getFormController(req: Request, res: Response) {
  const { formCode } = req.params;
  const form = await FormService.getFormByCode(formCode);
  if (!form) return res.status(404).json({ success: false, message: "Form not found" });
  res.json({ success: true, data: form });
}

export async function listVersionsController(req: Request, res: Response) {
  const { formCode } = req.params;
  const versions = await FormService.listVersions(formCode);
  res.json({ success: true, data: versions });
}

export async function updateDraftDslController(req: Request, res: Response) {
  // body is arbitrary JSON (validated by DSL schema in service)
  const { formCode } = req.params;
  const result = await FormService.updateDraftDsl(formCode, req.body);
  res.status(200).json({ success: true, data: result });
}
