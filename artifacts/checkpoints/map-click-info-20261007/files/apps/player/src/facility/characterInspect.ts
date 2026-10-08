import type { FacilityCharacterRef } from "./types";

/** How long the map info box stays up after a click, and its fade-out. */
export const INSPECT_BOX_VISIBLE_MS = 5000;
export const INSPECT_BOX_FADE_MS = 400;

/** Character container keys → the character the info box describes. */
export function characterRefFromKey(key: string): FacilityCharacterRef | null {
  if (key === "character:founder") return { kind: "founder", id: "founder" };
  const match = /^character:(staff|patient|service-visitor|retail-retail_visitor|retail-companion|ambient):(.+)$/.exec(key);
  if (!match) return null;
  const kind = match[1] === "retail-retail_visitor"
    ? "retail-visitor"
    : match[1] === "retail-companion" ? "companion" : match[1] as FacilityCharacterRef["kind"];
  return { kind, id: match[2]! };
}
