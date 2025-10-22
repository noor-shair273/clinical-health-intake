export const formCodeParamSchema = {
  $id: "https://chi.local/schemas/http/param-form-code.json",
  type: "object",
  additionalProperties: false,
  required: ["formCode"],
  properties: {
    formCode: { type: "string", pattern: "^[a-z][a-z0-9_\\-]*$" }
  }
} as const;