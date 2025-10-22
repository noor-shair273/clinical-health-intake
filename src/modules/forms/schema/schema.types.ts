export type JsonLogic = any;

export interface NormalizedNode {
  id: string;
  code: string;
  path: string;
  parentPath: string | null;
  type: string;
  label?: string;
  order: number;
  required?: boolean;

  logic: {
    show_if: JsonLogic | null;
    required_if: JsonLogic | null;
  };

  options?: Array<{ value: string | number | boolean; label: string }> | null;
  constraints?: { min_repeat?: number; max_repeat?: number };

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
    generatedAt: string;
  };
  tree: NormalizedNode[];
  index: {
    deps: Record<string, string[]>;
  };
}
