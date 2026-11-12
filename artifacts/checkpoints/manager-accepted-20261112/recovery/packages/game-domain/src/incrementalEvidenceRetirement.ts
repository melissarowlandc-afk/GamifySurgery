import type { EvidenceJson, EvidenceObject } from "./game-evidence-json";
import type { GameState } from "./types";
import { isImmutableEvidenceJson } from "./incrementalEvidenceValues";
import { mayContainEvidence } from "./incrementalEvidenceOwnership";

type Project = (value: EvidenceJson, path: string[], previous?: EvidenceJson, projection?: EvidenceJson) => EvidenceJson;
type OwnsFact = (path: readonly string[]) => unknown;
const object = (value: unknown): value is EvidenceObject => value !== null && typeof value === "object" && !Array.isArray(value);
const retiredCollections = ["serviceOperations", "retailOperations", "retailExternalActors", "retailOrders"] as const;

/** The retirement boundary only prunes these collection records; subsequent
 * finalization updates summaries, rooms, guidance, events and receipts, not
 * removed records. Hold shallow ordered row references, project immutable facts
 * now in the original traversal order, and copy/project ONLY removed rows later.
 * No eligibility predicate is duplicated here.
 */
export function captureRetirementEvidence(state: GameState, previous: GameState, projection: EvidenceObject,
  ownsFact: OwnsFact, project: Project): { materializeRemoved(after: GameState): EvidenceObject } {
  const current = state as unknown as EvidenceObject, old = previous as unknown as EvidenceObject;
  const encounters = Object.entries(state.encounters);
  const collections = retiredCollections.map(root => ({ root, rows: state[root].slice() }));
  const visit = (value: EvidenceJson, path: string[], prior?: EvidenceJson, projected?: EvidenceJson): void => {
    if (value === prior && projected !== undefined) return;
    if (value === undefined || typeof value === "function" || typeof value === "symbol") return;
    if (!mayContainEvidence(path)) return;
    if (ownsFact(path)) { project(value, path, prior, projected); return; }
    if (Array.isArray(value)) {
      const before = Array.isArray(prior) ? prior : undefined, paired = Array.isArray(projected) ? projected : undefined;
      let unchanged: WeakSet<object> | undefined;
      for (let i = 0; i < value.length; i++) {
        const child = value[i]!;
        if (before && paired && child !== null && typeof child === "object" && child !== before[i] && isImmutableEvidenceJson(child)) {
          if (!unchanged) {
            unchanged = new WeakSet();
            for (let j = 0; j < before.length; j++) {
              const row = before[j];
              if (row !== null && typeof row === "object" && paired[j] !== undefined) unchanged.add(row);
            }
          }
          if (unchanged.has(child)) continue;
        }
        visit(child, [...path, String(i)], before?.[i], paired?.[i]);
      }
    } else if (object(value)) {
      const before = object(prior) ? prior : undefined, paired = object(projected) ? projected : undefined;
      for (const key of Object.keys(value)) visit(value[key]!, [...path, key], before?.[key], paired?.[key]);
    }
  };
  for (const root of Object.keys(current)) visit(current[root]!, [root], old[root], projection[root]);
  return {
    materializeRemoved(after) {
      const result: EvidenceObject = { encounters: Object.fromEntries(encounters
        .filter(([id]) => !Object.hasOwn(after.encounters, id))
        .map(([id, row]) => [id, project(row as unknown as EvidenceJson, ["encounters", id],
          previous.encounters[id] as unknown as EvidenceJson | undefined,
          object(projection.encounters) ? projection.encounters[id] : undefined)])) };
      for (const { root, rows } of collections) {
        const present = new Set(after[root].map(row => row.id)), before = previous[root];
        const projected = Array.isArray(projection[root]) ? projection[root] : undefined;
        result[root] = rows.flatMap((row, index) => {
          if (present.has(row.id)) return [];
          const oldIndex = before.findIndex(candidate => candidate.id === row.id);
          return [project(row as unknown as EvidenceJson, [root, String(index)],
            before[oldIndex] as unknown as EvidenceJson | undefined, projected?.[oldIndex])];
        });
      }
      return result;
    },
  };
}
