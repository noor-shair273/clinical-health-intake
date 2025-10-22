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

router.post("/", createFormController);
router.post("/:formCode/draft", createDraftController);
router.post("/:formCode/publish", publishVersionController);
router.get("/:formCode", getFormController);
router.get("/:formCode/versions", listVersionsController);
router.put("/:formCode/draft/dsl", updateDraftDslController);
router.get("/:formCode/schema", getTreeAndDepsController);
router.post("/:formCode/validate", validateSubmissionController);
router.post("/:formCode/submit", acceptSubmissionController);

export default router;
