export const createFormSchema = {
  type: "object",
  required: ["code", "title"],
  additionalProperties: false,
  properties: {
    code: { type: "string", pattern: "^[a-z][a-z0-9_-]*$" },
    title: { type: "string", minLength: 1 },
    createdBy: { type: "string" }
  }
} as const;

export const createDraftSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dsl: { type: "object" } 
  }
} as const;

export const publishSchema = {
  type: "object",
  required: ["version"],
  additionalProperties: false,
  properties: {
    version: { type: "number", minimum: 1 }
  }
} as const;
