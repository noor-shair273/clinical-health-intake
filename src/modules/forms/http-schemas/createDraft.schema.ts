export const createDraftBodySchema = {
  $id: "https://chi.local/schemas/http/create-draft.json",
  type: "object",
  additionalProperties: false,
  required: ["dsl"],
  properties: {
    dsl: { $ref: "https://chi.local/schemas/form-dsl.json#" }
  }
} as const;