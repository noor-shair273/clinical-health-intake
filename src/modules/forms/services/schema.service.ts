import crypto from "node:crypto";
import { Form } from "../models/form.model";
import { FormVersion } from "../models/formVersion.model";
import { FormStatus } from "../enums/formStatus";
import { buildTree } from "../schema/normalizer";
import { buildDeps } from "../schema/schema.deps";
import type { SchemaPayload } from "../schema/schema.types";

/** Deterministic hash of the tree for caching/diff */
function hashTree(tree: any): string {
  const json = JSON.stringify(tree, Object.keys(tree).sort());
  return crypto.createHash("sha256").update(json).digest("hex");
}

export async function getSchemaTreeAndDeps(
  formCode: string,
  opts?: { version?: number; status?: "draft" | "published" | "archived" }
): Promise<SchemaPayload> {
  const form = await Form.findOne({ code: formCode });
  if (!form) {
    const e: any = new Error("Form not found");
    e.statusCode = 404;
    throw e;
  }

  let versionDoc: any;
  if (opts?.version != null) {
    versionDoc = await FormVersion.findOne({ formId: form._id, version: opts.version });
  } else if (opts?.status) {
    versionDoc = await FormVersion.findOne({ formId: form._id, status: opts.status }).sort({ version: -1 });
  } else {
    versionDoc = await FormVersion.findOne({ formId: form._id, status: FormStatus.Published }).sort({ version: -1 });
  }
  if (!versionDoc) {
    const e: any = new Error("Form version not found");
    e.statusCode = 404;
    throw e;
  }

  // 1) Normalize to a render/validate-ready tree
  const tree = buildTree(versionDoc.dsl?.fields || []);

  // 2) Reverse-dependency index by code (for reactive UI/validation)
  const deps = buildDeps(tree);

  // 3) Meta
  const payload: SchemaPayload = {
    meta: {
      form: { code: form.code, title: form.title },
      version: { version: versionDoc.version, status: versionDoc.status },
      schemaVersion: "1.0",
      hash: hashTree(tree),
      generatedAt: new Date().toISOString(),
    },
    tree,
    index: { deps },
  };

  return payload;
}
