import { NormalizedField } from "../schema/normalizer";
import { evaluateLogic } from "../../../utils/jsonLogic";

export interface SubmissionError {
  field: string;
  message: string;
}

/** Helper: test ISO-like date strings that can be parsed */
function isValidDateString(v: any): boolean {
  if (typeof v !== "string" || !v.trim()) return false;
  const t = Date.parse(v);
  return Number.isFinite(t);
}

/** Helper: get allowed option values for choice fields */
function getOptionValues(field: NormalizedField): Set<string | number | boolean> {
  const vals = new Set<string | number | boolean>();
  if (Array.isArray(field.options)) {
    for (const o of field.options) {
      // tolerate either {value,label} or raw literals (defensive)
      const val = (o && typeof o === "object" && "value" in o) ? (o as any).value : o;
      vals.add(val as any);
    }
  }
  return vals;
}

export function validateFields(fields: NormalizedField[], data: any, path = ""): SubmissionError[] {
  const errors: SubmissionError[] = [];

  for (const field of fields) {
    const fullPath = path + field.code;
    const value = data?.[field.code];
    const isVisible = evaluateLogic(field.show_if, data);

    // Skip validation entirely if field is hidden
    if (!isVisible) continue;

    // Required / required_if
    const isRequired =
      !!field.required ||
      (!!field.required_if && evaluateLogic(field.required_if, data));

    // Required presence
    const isMissing = value === undefined || value === null || value === "";
    if (isRequired && isMissing) {
      errors.push({ field: fullPath, message: `${field.label || field.code} is required` });
      continue; // no type checks if missing
    }

    // If not provided and not required, skip type checks
    if (isMissing) continue;

    // Type-specific validation (only if value exists)
    switch (field.type) {
      case "text": {
        if (typeof value !== "string") {
          errors.push({ field: fullPath, message: "Must be a string" });
        }
        break;
      }

      case "number": {
        if (typeof value !== "number" || Number.isNaN(value)) {
          errors.push({ field: fullPath, message: "Must be a number" });
        }
        break;
      }

      case "date": {
        if (!isValidDateString(value)) {
          errors.push({ field: fullPath, message: "Must be a valid date string (ISO/parsable)" });
        }
        break;
      }

      case "checkbox": {
        if (typeof value !== "boolean") {
          errors.push({ field: fullPath, message: "Must be a boolean" });
        }
        break;
      }

      case "radio":
      case "select": {
        const allowed = getOptionValues(field);
        // single-value select/radio only (multi-select not in DSL yet)
        if (!allowed.size) {
          // If no options defined, we can only enforce primitive types
          const isPrimitive =
            ["string", "number", "boolean"].includes(typeof value) && !Number.isNaN(value);
          if (!isPrimitive) {
            errors.push({ field: fullPath, message: "Invalid value" });
          }
        } else {
          // Ensure submitted value is one of the declared options
          if (!allowed.has(value)) {
            errors.push({
              field: fullPath,
              message: `Must be one of: ${Array.from(allowed).join(", ")}`
            });
          }
        }
        break;
      }

      case "group": {
        if (typeof value !== "object" || Array.isArray(value)) {
          errors.push({ field: fullPath, message: "Must be an object" });
          break;
        }
        if (field.children?.length) {
          errors.push(...validateFields(field.children, value, `${fullPath}.`));
        }
        break;
      }

      case "group_repeat": {
        if (!Array.isArray(value)) {
          errors.push({ field: fullPath, message: "Must be an array" });
          break;
        }

        if (field.min_repeat !== undefined && value.length < field.min_repeat) {
          errors.push({ field: fullPath, message: `Must have at least ${field.min_repeat} entries` });
        }
        if (field.max_repeat !== undefined && value.length > field.max_repeat) {
          errors.push({ field: fullPath, message: `Must not exceed ${field.max_repeat} entries` });
        }

        if (field.children?.length) {
          value.forEach((item: any, index: number) => {
            errors.push(...validateFields(field.children!, item, `${fullPath}[${index}].`));
          });
        }
        break;
      }

      default: {
        // Unknown type — do not fail hard; flag as warning-style error
        errors.push({ field: fullPath, message: `Unknown field type '${field.type}'` });
      }
    }
  }

  return errors;
}
