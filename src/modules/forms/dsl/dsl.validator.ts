import Ajv from "ajv/dist/2020"; ;
import addFormats from "ajv-formats";
import { dslSchema } from "./dsl.schema";
import { ValidationErrorType } from "../../../types/ValidationError";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validateDslSchema = ajv.compile(dslSchema);

// --- helpers ---
function collectFieldCodes(tree: any[]): Set<string> {
  const codes = new Set<string>();
  const walk = (nodes: any[]) => {
    for (const n of nodes || []) {
      if (typeof n.code === "string") {
        const c = n.code;
        if (codes.has(c)) {
          const err: ValidationErrorType = new Error("Validation failed") as ValidationErrorType;
          err.name = "ValidationError";
          err.isValidationError = true;
          err.errors = [{ field: c, message: "duplicate field code" }];
          throw err;
        }
        codes.add(c);
      }
      if (Array.isArray(n.fields)) walk(n.fields);
    }
  };
  walk(tree);
  return codes;
}

function referencedCodesFromLogic(obj: any, out = new Set<string>()) {
  if (!obj || typeof obj !== "object") return out;
  for (const [k, v] of Object.entries(obj)) {
    if (k === "var" && (typeof v === "string")) out.add(v);
    else if (Array.isArray(v)) v.forEach((x) => referencedCodesFromLogic(x, out));
    else if (v && typeof v === "object") referencedCodesFromLogic(v, out);
  }
  return out;
}

function checkLogicReferencesExist(dsl: any, codes: Set<string>) {
  const errs: Array<{ field: string; message?: string }> = [];
  const walk = (nodes: any[]) => {
    for (const n of nodes || []) {
      const refs = new Set<string>();
      referencedCodesFromLogic(n?.show_if, refs);
      referencedCodesFromLogic(n?.required_if, refs);
      for (const r of refs) {
        if (!codes.has(r)) errs.push({ field: n.code, message: `references unknown field '${r}'` });
      }
      if (Array.isArray(n.fields)) walk(n.fields);
    }
  };
  walk(dsl.fields || []);
  return errs;
}

// --- main entry ---
export function validateDslOrThrow(dsl: any) {
  const ok = validateDslSchema(dsl);
  if (!ok) {
    const error: ValidationErrorType = new Error("Validation failed") as ValidationErrorType;
    error.name = "ValidationError";
    error.isValidationError = true;
    error.errors = validateDslSchema.errors?.map((e) => ({
      field: e.instancePath?.replace(/^\//, "") || (e.params as any)?.missingProperty,
      message: e.message
    }));
    throw error;
  }

  // semantic checks
  const codes = collectFieldCodes(dsl.fields || []);
  const refErrs = checkLogicReferencesExist(dsl, codes);
  if (refErrs.length) {
    const error: ValidationErrorType = new Error("Validation failed") as ValidationErrorType;
    error.name = "ValidationError";
    error.isValidationError = true;
    error.errors = refErrs;
    throw error;
  }
}
