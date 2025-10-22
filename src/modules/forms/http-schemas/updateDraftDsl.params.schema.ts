export const updateDraftDslParamsSchema = {
  $id: "https://chi.local/schemas/http/update-draft-dsl.params.json",
  type: "object",
  required: ["formCode", "version"],
  additionalProperties: false,
  properties: {
    formCode: { type: "string", pattern: "^[a-z][a-z0-9_\\-]*$" },
    version: { type: "integer", minimum: 1 }
  }
} as const;
