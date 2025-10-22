export const submissionBodySchema = {
  $id: "https://chi.local/schemas/http/submission.json",
  type: "object",
  additionalProperties: true
} as const;

export const submitBodySchema = {
  $id: "https://chi.local/schemas/http/submit.json",
  type: "object",
  additionalProperties: true,

} as const;
