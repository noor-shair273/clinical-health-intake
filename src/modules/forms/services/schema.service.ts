import { Form } from "../models/form.model";
import { FormVersion } from "../models/formVersion.model";
import { FormStatus } from "../enums/formStatus";
import { buildTree } from "../schema/normalizer";
import { buildDeps } from "../schema/schema.deps";
import type { SchemaPayload } from "../schema/schema.types";

export async function getSchemaTreeAndDeps(
  formCode: string,
  opts?: { version?: number; }
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
      generatedAt: new Date().toISOString(),
    },
    tree,
    index: { deps },
  };

  return payload;
}
