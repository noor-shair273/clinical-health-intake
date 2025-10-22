export const updateDraftDslBodySchema = {
  $id: "https://chi.local/schemas/http/update-draft-dsl.json",
  type: "object",
  additionalProperties: false,
  required: ["dsl"],
  properties: {
    dsl: { $ref: "https://chi.local/schemas/form-dsl.json#" }
  }
} as const;