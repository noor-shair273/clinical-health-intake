import type { NormalizedNode } from "./schema.types.js";

function collectVarRefs(logic: any, out: Set<string>) {
  if (!logic || typeof logic !== "object") return;
  for (const [k, v] of Object.entries(logic)) {
    if (k === "var" && typeof v === "string") {
      out.add(v);
    } else if (Array.isArray(v)) {
      v.forEach(x => collectVarRefs(x, out));
    } else if (v && typeof v === "object") {
      collectVarRefs(v, out);
    }
  }
}

/**
 * Reverse dependency map:
 * deps["smoker"] = ["cigarettes_per_day"]
 */
export function buildDeps(tree: NormalizedNode[]): Record<string, string[]> {
  const deps: Record<string, string[]> = {};

  const visit = (n: NormalizedNode) => {
    const refs = new Set<string>();
    collectVarRefs(n.logic?.show_if, refs);
    collectVarRefs(n.logic?.required_if, refs);
    for (const r of refs) {
      (deps[r] ||= []).push(n.code);
    }
    n.children?.forEach(visit);
  };

  tree.forEach(visit);
  return deps;
}
