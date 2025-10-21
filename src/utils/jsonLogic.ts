import jsonLogic from "json-logic-js";

/**
 * Safely evaluate JSON Logic
 * Returns true if logic is not provided
 */
export function evaluateLogic(logic: any, data: any): boolean {
  if (!logic) return true;
  try {
    return jsonLogic.apply(logic, data);
  } catch (error) {
    console.error("Invalid JSON Logic:", logic, error);
    return false;
  }
}
