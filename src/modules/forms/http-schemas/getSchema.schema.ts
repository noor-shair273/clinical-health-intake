export const getSchemaParamsSchema = {
  $id: "https://chi.local/schemas/http/get-schema.params.json",
  type: "object",
  additionalProperties: false,
  required: ["formCode"],
  properties: {
    formCode: { type: "string", pattern: "^[a-z][a-z0-9_\\-]*$" }
  }
} as const;

export const getSchemaQuerySchema = {
  $id: "https://chi.local/schemas/http/get-schema.query.json",
  type: "object",
  additionalProperties: false,
  properties: {
    version: { type: "integer", minimum: 1 }
  }
} as const;
