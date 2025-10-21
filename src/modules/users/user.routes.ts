import { Router } from "express";
import { createUserController } from "./user.controller";

const router = Router();

router.post("/", createUserController); // POST /users

export default router;
