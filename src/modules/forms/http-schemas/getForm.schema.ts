export const getFormParamsSchema = {
  $id: "https://chi.local/schemas/http/get-form.params.json",
  type: "object",
  additionalProperties: false,
  required: ["formCode"],
  properties: {
    formCode: { type: "string", pattern: "^[a-z][a-z0-9_\\-]*$" }
  }
} as const;