import type { Request, Response, NextFunction } from "express";
import type { ErrorObject } from "ajv";
import { ajv } from "../lib/ajv";

type JsonSchema = Record<string, any>;

interface ValidateSpec {
  body?: JsonSchema;
  query?: JsonSchema;
  params?: JsonSchema;
}

type ValidatorFn = ((data: any) => boolean) & { errors?: ErrorObject[] | null };

export function validateRequest(spec: ValidateSpec) {
  const validators: Partial<Record<keyof ValidateSpec, ValidatorFn>> = {};

  if (spec.body) {
    validators.body = ajv.compile(spec.body);
  }
  if (spec.query) {
    validators.query = ajv.compile(spec.query);
  }
  if (spec.params) {
    validators.params = ajv.compile(spec.params);
  }

  return (req: Request, res: Response, next: NextFunction) => {
    try {
      for (const key of Object.keys(validators) as (keyof ValidateSpec)[]) {
        const validateFn = validators[key];
        const data = req[key] ?? {};

        if (validateFn && !validateFn(data)) {
          const details = (validateFn.errors || []).map((err: ErrorObject) => ({
            path: err.instancePath || "/",
            message: err.message || "Invalid request",
            keyword: err.keyword,
            params: err.params
          }));

          return res.status(400).json({
            success: false,
            error: "ValidationError",
            details
          });
        }
      }
      return next();
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: "InternalServerError",
        message: error?.message || "Unexpected validation error"
      });
    }
  };
}
