// Frozen pre-Milestone-A oracle; only import paths differ. Do not optimize.
/** Portable JSON helpers; deliberately independent of browser, Node and persistence. */
export type EvidenceJson = null | boolean | number | string | EvidenceJson[] | { [key: string]: EvidenceJson };
export type EvidenceObject = { [key: string]: EvidenceJson };
export interface EvidencePatch { path: string[]; present: boolean; value?: EvidenceJson }

export class GameEvidenceError extends Error {
  constructor(readonly code: string) { super(`Game evidence contract failed: ${code}.`); this.name = "GameEvidenceError"; }
}

export const jsonCopy = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
export function jsonObject(value: unknown): value is EvidenceObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
export function evidenceJsonText(value: EvidenceJson): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(evidenceJsonText).join(",")}]`;
  return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${evidenceJsonText(value[key]!)}`).join(",")}}`;
}
export const jsonEqual = (a: EvidenceJson, b: EvidenceJson): boolean => evidenceJsonText(a) === evidenceJsonText(b);

/** Arrays are replaced as ordered units; object properties are patched without JSON-pointer escaping ambiguities. */
export function evidencePatches(base: EvidenceJson, current: EvidenceJson, path: string[] = []): EvidencePatch[] {
  if (jsonEqual(base, current)) return [];
  if (!jsonObject(base) || !jsonObject(current)) return [{ path, present: true, value: current }];
  return [...new Set([...Object.keys(base), ...Object.keys(current)])].flatMap(key =>
    !Object.hasOwn(current, key) ? [{ path: [...path, key], present: false }]
      : !Object.hasOwn(base, key) ? [{ path: [...path, key], present: true, value: current[key]! }]
        : evidencePatches(base[key]!, current[key]!, [...path, key]));
}

export function applyEvidencePatches(base: EvidenceJson, patches: readonly EvidencePatch[]): EvidenceJson {
  let value = jsonCopy(base);
  const seen = new Set<string>();
  for (const patch of patches) {
    if (!Array.isArray(patch.path) || patch.path.some(key => typeof key !== "string") || typeof patch.present !== "boolean" ||
      patch.present !== Object.hasOwn(patch, "value")) throw new GameEvidenceError("patch-shape");
    const key = JSON.stringify(patch.path);
    if (seen.has(key)) throw new GameEvidenceError("duplicate-patch");
    seen.add(key);
    if (patch.path.length === 0) {
      if (!patch.present) throw new GameEvidenceError("deleted-root");
      value = jsonCopy(patch.value!); continue;
    }
    let parent = value;
    for (const part of patch.path.slice(0, -1)) {
      if (!jsonObject(parent) || !Object.hasOwn(parent, part)) throw new GameEvidenceError("patch-parent");
      parent = parent[part]!;
    }
    if (!jsonObject(parent)) throw new GameEvidenceError("patch-parent");
    const property = patch.path.at(-1)!;
    if (patch.present) Object.defineProperty(parent, property, { value: jsonCopy(patch.value!), enumerable: true, writable: true, configurable: true });
    else if (!Object.hasOwn(parent, property)) throw new GameEvidenceError("patch-delete");
    else delete parent[property];
  }
  return value;
}

export function freezeEvidence<T>(value: T): T {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) freezeEvidence(child);
    Object.freeze(value);
  }
  return value;
}
