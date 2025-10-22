export const publishBodySchema = {
  $id: "https://chi.local/schemas/http/publish.json",
  type: "object",
  additionalProperties: false,
  required: ["version"],
  properties: {
    version: { type: "integer", minimum: 1 }
  }
} as const;