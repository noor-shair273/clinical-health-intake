# Form Normalization

## Purpose
Form normalization converts the authoring DSL (nested JSON structure) into a consistent runtime format that is used by clients for:

- Rendering the form in the correct order
- Handling conditional visibility and required behavior
- Supporting nested and repeatable fields
- Validating submissions in a predictable manner

Normalization outputs two key elements:
- `tree`: a structured representation of form fields in display order
- `index.deps`: a reverse dependency map showing which fields depend on the value of other fields

---

## Normalized Response Structure
```json
{
  "meta": {
    "form": { "code": "chi-intake", "title": "Clinical Health Intake" },
    "version": { "version": 1, "status": "published", "updatedAt": "2025-10-21T18:00:00Z" },
    "schemaVersion": "1.0"
  },
  "tree": [/* array of normalized nodes */],
  "index": {
    "deps": { /* reverse dependency map */ }
  }
}
```

---

## NormalizedNode Structure
```ts
type NormalizedNode = {
  code: string;            // Globally unique identifier for the field
  path: string;            // Full path representing the field location, e.g., "children[].child_name"
  parentPath: string | null;
  type: string;            // text, number, select, checkbox, group, group_repeat, etc.
  label?: string;
  order: number;           // Rendering order within its level
  required?: boolean;

  logic: {
    show_if: JsonLogic | null;     // Controls conditional visibility
    required_if: JsonLogic | null; // Controls conditional requiredness
  };

  options?: Array<{ value: any; label: string }> | null;
  constraints?: { min_repeat?: number; max_repeat?: number };

  isContainer: boolean;    // True if this node contains child fields
  isRepeatable: boolean;   // True only for group_repeat
  children: NormalizedNode[] | null;
};
```

---

## index.deps (Reverse Dependency Map)

This structure indicates which fields must be re-evaluated when a specific field changes.

```json
{
  "deps": {
    "country": ["other_country"],
    "smoker": ["cigarettes_per_day"],
    "child_age": ["vaccination_date", "school_name"]
  }
}
```

Example interpretation:
- If the value of `smoker` changes, the field `cigarettes_per_day` must be re-evaluated to determine visibility or required status.
