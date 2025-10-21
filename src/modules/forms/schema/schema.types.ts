// Core normalized node used by clients
export type JsonLogic = any;

export interface NormalizedNode {
  id: string;                   // stable id (usually path or parent.path+code)
  code: string;                 // globally-unique code (as per your decision)
  path: string;                 // e.g. "children[].child_name"
  parentPath: string | null;
  type: string;                 // "text" | "number" | "group" | "group_repeat" | ...
  label?: string;
  order: number;                // authoring/render order among siblings
  required?: boolean;

  logic: {
    show_if: JsonLogic | null;
    required_if: JsonLogic | null;
  };

  // optional helpers (clients may ignore)
  options?: Array<{ value: string | number | boolean; label: string }> | null;
  constraints?: { min_repeat?: number; max_repeat?: number };

  // flags (clients may ignore)
  isContainer: boolean;
  isRepeatable: boolean;
  hasShowIf: boolean;
  hasRequiredIf: boolean;

  children: NormalizedNode[] | null;
}

export interface SchemaPayload {
  meta: {
    form: { code: string; title?: string };
    version: { version: number; status: string };
    schemaVersion: string;
    hash: string;
    generatedAt: string;
  };
  tree: NormalizedNode[];
  index: {
    deps: Record<string, string[]>;   // reverse-deps by code
  };
}
