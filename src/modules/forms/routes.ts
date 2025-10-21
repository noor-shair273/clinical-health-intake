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
const router = Router();

router.post("/", createFormController); // POST /forms
router.post("/:formCode/draft", createDraftController); // POST /forms/:formCode/draft
router.post("/:formCode/publish", publishVersionController); // POST /forms/:formCode/publish
router.get("/:formCode", getFormController); // GET /forms/:formCode
router.get("/:formCode/versions", listVersionsController); // GET /forms/:formCode/versions
router.put("/:formCode/draft/dsl", updateDraftDslController); 
router.get("/:formCode/schema-min", getTreeAndDepsController);


// Validate against published version (does not save)
router.post("/:formCode/validate", validateSubmissionController);

// Validate and save (creates Submission)
router.post("/:formCode/submit", acceptSubmissionController);

export default router;
