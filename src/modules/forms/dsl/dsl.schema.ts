export const dslSchema = {
  $id: "https://chi.local/schemas/form-dsl.json",
  $schema: "https://json-schema.org/draft/2020-12/schema",
  type: "object",
  required: ["fields"],
  additionalProperties: false,
  properties: {
    fields: {
      type: "array",
      minItems: 1,
      items: { $ref: "#/$defs/field" }
    }
  },
  $defs: {
    jsonLogic: {
      type: ["object", "boolean"],
      additionalProperties: true
    },
    option: {
      type: "object",
      required: ["value", "label"],
      additionalProperties: false,
      properties: {
        value: { type: ["string", "number", "boolean"] },
        label: { type: "string" }
      }
    },
    field: {
      type: "object",
      required: ["code", "type", "label"],
      additionalProperties: true,
      properties: {
        code: { type: "string", pattern: "^[a-z][a-z0-9_]*$" },
        type: {
          enum: [
            "text",
            "number",
            "select",
            "checkbox",
            "radio",
            "date",
            "group",
            "group_repeat"
          ]
        },
        label: { type: "string" },
        help: { type: "string" },
        required: { type: "boolean" },
        required_if: { $ref: "#/$defs/jsonLogic" },
        show_if: { $ref: "#/$defs/jsonLogic" },

        // choice fields
        options: { type: "array", minItems: 1, items: { $ref: "#/$defs/option" } },

        // groups
        fields: { type: "array", items: { $ref: "#/$defs/field" } },

        // repeatable groups
        min_repeat: { type: "integer", minimum: 0 },
        max_repeat: { type: "integer", minimum: 1 }
      },
      allOf: [
        // if select/radio -> options required
        {
          if: { properties: { type: { const: "select" } }, required: ["type"] },
          then: { required: ["options"] }
        },
        {
          if: { properties: { type: { const: "radio" } }, required: ["type"] },
          then: { required: ["options"] }
        },
        // if group/group_repeat -> fields required
        {
          if: { properties: { type: { const: "group" } }, required: ["type"] },
          then: { required: ["fields"] }
        },
        {
          if: { properties: { type: { const: "group_repeat" } }, required: ["type"] },
          then: { required: ["fields"] }
        }
      ]
    }
  }
} as const;
