import { Form } from "../models/form.model";
import { FormStatus } from "../enums/formStatus";
import { FormVersion } from "../models/formVersion.model";
import mongoose from "mongoose";
import { validateDslOrThrow } from "../dsl/dsl.validator";

/** Create a new form (unique code) */
export async function createForm(input: { code: string; title: string; createdBy?: string }) {
    const doc = await Form.create({
        code: input.code,
        title: input.title,
        createdBy: input.createdBy,
    });
    return doc;
}

/** Helper: get next version number for a form */
async function getNextVersionNumber(formId: mongoose.Types.ObjectId) {
    const last = await FormVersion.findOne({ formId }).sort({ version: -1 }).select("version");
    return (last?.version ?? 0) + 1;
}

/** Create a new draft version; optionally clone from last published/draft */
export async function createDraftVersion(
    formCode: string,
    dsl: any = {}
) {
    // 1. Get the form
    const form = await Form.findOne({ code: formCode });
    if (!form) throw new Error("Form not found");

    const formId = form._id as mongoose.Types.ObjectId;

    // 2. Get next version number
    const version = await getNextVersionNumber(formId);

    // 3. Create new draft version
    const draft = await FormVersion.create({
        formId,
        version,
        status: FormStatus.Draft,
        dsl: dsl ?? {},
    });

    return { form, version: draft };
}

/** Publish a draft version; archives any existing published version
 * NOTE: On single-node Mongo (no replica set), transactions are not supported.
 * We do two updates, relying on a partial unique index to guarantee 1 published/version.
 */
export async function publishVersion(formCode: string, versionNumber: number) {
    const form = await Form.findOne({ code: formCode });
    if (!form) throw new Error("Form not found");

    const target = await FormVersion.findOne({ formId: form._id, version: versionNumber });
    if (!target) throw new Error("Version not found");
    if (target.status !== FormStatus.Draft) {
        const error: any = new Error("Only draft versions can be published");
        error.statusCode = 400; // Bad Request
        throw error;
    }

    // 1) Archive any currently published (idempotent)
    await FormVersion.updateMany(
        { formId: form._id, status: FormStatus.Published },
        { $set: { status: FormStatus.Archived } }
    );

    // 2) Publish target
    try {
        const updated = await FormVersion.findOneAndUpdate(
            { _id: target._id, status: FormStatus.Draft },
            { $set: { status: FormStatus.Published, publishedAt: new Date() } },
            { new: true }
        );
        if (!updated) throw new Error("Failed to publish (status changed concurrently)");
        return { form, version: updated };
    } catch (err: any) {
        // If partial unique index blocks (race), surface a friendly error
        if (err?.code === 11000) {
            err.statusCode = 409; // Conflict
            err.message = "Publish conflict: another version is already published";
            throw err;
        }
        throw err;
    }
}

/** Convenience getters (handy for controllers) */
export async function getFormByCode(code: string) {
    return Form.findOne({ code });
}

export async function listVersions(formCode: string) {
    const form = await Form.findOne({ code: formCode });
    if (!form) throw new Error("Form not found");
    return FormVersion.find({ formId: form._id }).sort({ version: -1 });
}

export async function updateDraftDsl(formCode: string, dsl: any) {
  const form = await Form.findOne({ code: formCode });
if (!form) {
    const err: any = new Error("Form not found");
    err.statusCode = 404;
    throw err;
  }
  // Find the draft version (latest by version)
  const draft = await FormVersion.findOne({ formId: form._id, status: FormStatus.Draft })
    .sort({ version: -1 });

  if (!draft) {
     const err: any = new Error("No draft version to update");
    err.statusCode = 409; // Conflict
    throw err;
  };

  // Validate DSL
  validateDslOrThrow(dsl);

  draft.dsl = dsl;
  await draft.save();

  return { form, version: draft };
}