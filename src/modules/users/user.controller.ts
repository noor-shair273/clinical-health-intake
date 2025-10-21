import { Request, Response } from "express";
import { validate } from "../../utils/validate";
import { createUserSchema } from "./user.schema";
import * as UserService from "./user.service";

export async function createUserController(req: Request, res: Response) {
  validate(createUserSchema, req.body);
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Email already exists" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}
