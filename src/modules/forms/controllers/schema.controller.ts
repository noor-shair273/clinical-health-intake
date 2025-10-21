import { Request, Response } from "express";
import { getSchemaTreeAndDeps } from "../services/schema.service.js";

export async function getTreeAndDepsController(req: Request, res: Response) {
  const { formCode } = req.params;
  const { version, status } = req.query as { version?: string; status?: "draft" | "published" | "archived" };

  const data = await getSchemaTreeAndDeps(formCode, {
    version: version ? Number(version) : undefined,
    status,
  });

  // Optional: set ETag from hash for caching
  res.setHeader("ETag", data.meta.hash);

  return res.json({ success: true, data });
}
