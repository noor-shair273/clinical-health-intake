import { Request, Response } from "express";
import { getSchemaTreeAndDeps } from "../services/schema.service.js";

export async function getTreeAndDepsController(req: Request, res: Response) {
  const { formCode } = req.params;
  const { version } = req.query as { version?: string; };

  const data = await getSchemaTreeAndDeps(formCode, {
    version: version ? Number(version) : undefined,
  });

  return res.json({ success: true, data });
}
