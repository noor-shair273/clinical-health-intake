export const listVersionsParamsSchema = {
  $id: "https://chi.local/schemas/http/list-versions.params.json",
  type: "object",
  additionalProperties: false,
  required: ["formCode"],
  properties: {
    formCode: { type: "string", pattern: "^[a-z][a-z0-9_\\-]*$" }
  }
} as const;