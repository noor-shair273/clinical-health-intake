
import { Router } from "express";
import {
  createFormController,
  createDraftController,
  publishVersionController,
  getFormController,
  listVersionsController,
  updateDraftDslController,
} from "./controllers/form.controller";
import { getTreeAndDepsController } from "./controllers/schema.controller";
import {
  validateSubmissionController,
  acceptSubmissionController,
} from "./controllers/submission.controller";


import { createFormBodySchema } from "./http-schemas/createForm.schema.js";
import { formCodeParamSchema as _unused } from "./http-schemas/path.schema";
import { createDraftBodySchema } from "./http-schemas/createDraft.schema";
import { publishBodySchema } from "./http-schemas/publish.schema.js";
import { getFormParamsSchema } from "./http-schemas/getForm.schema";
import { listVersionsParamsSchema } from "./http-schemas/listVersions.schema";
import { updateDraftDslBodySchema } from "./http-schemas/update-draft-dsl.schema";
import { getSchemaParamsSchema, getSchemaQuerySchema } from "./http-schemas/getSchema.schema";
import { submissionBodySchema, submitBodySchema } from "./http-schemas/validate-submit.schema";
import { validateRequest } from "../../middleware/validateRequest";
import { listVersionsQuerySchema } from "./http-schemas/listVersionsQuery.schema";
import { updateDraftDslParamsSchema } from "./http-schemas/updateDraftDsl.params.schema";
export const router = Router();

/**
 * POST /forms
 * body: { code, title, createdBy? }
 */
router.post(
  "/",
  validateRequest({ body: createFormBodySchema }),
  createFormController
);

/**
 * POST /forms/:formCode/draft
 * params: { formCode }
 * body: { dsl? }  // optional on create; change to required if you prefer
 */
router.post(
  "/:formCode/draft",
  validateRequest({
    params: getFormParamsSchema,
    body: createDraftBodySchema,
  }),
  createDraftController
);

/**
 * POST /forms/:formCode/publish
 * params: { formCode }
 * body: { version: number }
 */
router.post(
  "/:formCode/publish",
  validateRequest({
    params: getFormParamsSchema,
    body: publishBodySchema,
  }),
  publishVersionController
);

/**
 * GET /forms/:formCode
 * params: { formCode }
 */
router.get(
  "/:formCode",
  validateRequest({ params: getFormParamsSchema }),
  getFormController
);

/**
 * GET /forms/:formCode/versions?page=1&pageSize=10
 * params: { formCode }
 * query: { page?, pageSize? }
 */
router.get(
  "/:formCode/versions",
  validateRequest({
    params: listVersionsParamsSchema,
    query: listVersionsQuerySchema,
  }),
  listVersionsController
);


/**
 * PUT /forms/:formCode/versions/:version/dsl
 * params: { formCode, version }
 * body: { dsl }
 */
router.put(
  "/:formCode/versions/:version/dsl",
  validateRequest({
    params: updateDraftDslParamsSchema,
    body: updateDraftDslBodySchema,
  }),
  updateDraftDslController
);
/**
 * GET /forms/:formCode/schema
 * params: { formCode }
 * query:  { version?  }
 */
router.get(
  "/:formCode/schema",
  validateRequest({
    params: getSchemaParamsSchema,
    query: getSchemaQuerySchema,
  }),
  getTreeAndDepsController
);

/**
 * POST /forms/:formCode/validate
 * params: { formCode }
 * body:   dynamic (validated by domain validator against normalized schema)
 */
router.post(
  "/:formCode/validate",
  validateRequest({
    params: getFormParamsSchema,
    body: submissionBodySchema, // transport-level only (domain validation happens in controller/service)
  }),
  validateSubmissionController
);

/**
 * POST /forms/:formCode/submit
 * params: { formCode }
 * body:   dynamic (plus optional idempotencyKey, etc.)
 */
router.post(
  "/:formCode/submit",
  validateRequest({
    params: getFormParamsSchema,
    body: submitBodySchema, // transport-level only; full validation in controller
  }),
  acceptSubmissionController
);

export default router;

