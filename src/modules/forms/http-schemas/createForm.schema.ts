export const createFormBodySchema = {
  $id: "https://chi.local/schemas/http/create-form.json",
  type: "object",
  additionalProperties: false,
  required: ["code", "title"],
  properties: {
    code:  { type: "string", pattern: "^[a-z][a-z0-9_\\-]*$" },
    title: { type: "string", minLength: 1, maxLength: 200 },
    createdBy: { type: "string", nullable: true }
  }
} as const;