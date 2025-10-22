import { NormalizedNode } from "./schema.types";

export interface NormalizedField {
  code: string;
  type: string;
  label?: string;
  required?: boolean;
  required_if?: any;
  show_if?: any;
  options?: any[];
  children?: NormalizedField[] | null;
  min_repeat?: number;
  max_repeat?: number;
}

export function normalizeDsl(fields: any[]): NormalizedField[] {
  if (!Array.isArray(fields)) throw new Error("DSL must have a 'fields' array");

  const normalize = (list: any[]): NormalizedField[] =>
    list.map(field => ({
      code: field.code,
      type: field.type,
      label: field.label,
      required: field.required,
      required_if: field.required_if,
      show_if: field.show_if,
      options: field.options,
      min_repeat: field.min_repeat,
      max_repeat: field.max_repeat,
      children: field.fields ? normalize(field.fields) : null,
    }));

  return normalize(fields);
}


/**
 * Normalize authoring DSL fields -> NormalizedNode tree (array).
 * - Preserves order
 * - Builds stable id/path/parentPath
 * - Keeps JSON-Logic as-is (clients can evaluate)
 */
export function buildTree(fields: any[], parentPath: string | null = null): NormalizedNode[] {
  return (fields || []).map((f: any, index: number) => {
    const isRepeat = f.type === "group_repeat";
    const isContainer = f.type === "group" || f.type === "group_repeat";

    // parentPath affects this node’s path if nested; children of repeat use [] in their own path
    const path = parentPath ? `${parentPath}.${f.code}` : f.code;

    const node: NormalizedNode = {
      id: parentPath ? `${parentPath}.${f.code}` : f.code,
      code: f.code,
      path,
      parentPath,
      type: f.type,
      label: f.label,
      order: index,
      required: !!f.required,
      logic: {
        show_if: f.show_if ?? null,
        required_if: f.required_if ?? null,
      },
      options: Array.isArray(f.options)
        ? f.options.map((o: any) =>
            (o && typeof o === "object" && "value" in o)
              ? { value: o.value, label: o.label ?? String(o.value) }
              : { value: o, label: String(o) }
          )
        : null,
      constraints: {
        ...(f.min_repeat !== undefined ? { min_repeat: f.min_repeat } : {}),
        ...(f.max_repeat !== undefined ? { max_repeat: f.max_repeat } : {}),
      },
      isContainer,
      isRepeatable: isRepeat,
      hasShowIf: !!f.show_if,
      hasRequiredIf: !!f.required_if,
      children: null,
    };

    if (isContainer) {
      // For repeatables, children show [] in their path base to indicate array pattern
      const childParentPath = isRepeat ? `${f.code}[]` : node.path;
      node.children = buildTree(f.fields || [], childParentPath);
    }

    return node;
  });
}