import type { EvidenceJson } from "./game-evidence-json";
import { isImmutableEvidenceJson } from "./incrementalEvidenceValues";

/** Ownership paths distinguish field names, not numeric array positions.
 * Pair immutable source rows with their projection from THIS exact prior
 * state. This never trusts record IDs from another checkpoint/branch.
 */
export function projectEvidenceArray(value: EvidenceJson[], previous: EvidenceJson | undefined, projection: EvidenceJson | undefined,
  project: (child: EvidenceJson, index: number, prior: EvidenceJson | undefined, projected: EvidenceJson | undefined) => EvidenceJson): EvidenceJson[] {
  const old = Array.isArray(previous) ? previous : undefined, priorProjection = Array.isArray(projection) ? projection : undefined;
  let rows: WeakMap<object, EvidenceJson> | undefined;
  return value.map((child, index) => {
    const before = old?.[index], projected = priorProjection?.[index];
    if (child === before && projected !== undefined) return projected;
    if (old && priorProjection && child !== null && typeof child === "object" && isImmutableEvidenceJson(child)) {
      if (!rows) {
        rows = new WeakMap();
        for (let i = 0; i < old.length; i++) {
          const source = old[i], paired = priorProjection[i];
          if (source !== null && typeof source === "object" && paired !== undefined) rows.set(source, paired);
        }
      }
      const paired = rows.get(child);
      if (paired !== undefined) return paired;
    }
    return project(child, index, before, projected);
  });
}
