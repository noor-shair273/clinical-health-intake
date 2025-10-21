export const createUserSchema = {
  type: "object",
  required: ["email", "name"],
  additionalProperties: false,
  properties: {
    email: { type: "string", format: "email" },
    name: { type: "string", minLength: 2 },
    role: { type: "string", enum: ["admin", "clinician", "patient"] }
  }
} as const;
