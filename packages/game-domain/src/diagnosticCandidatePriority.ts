import type { DiagnosticResourceChoice } from "./types";

type Candidate = { resource: DiagnosticResourceChoice | null; starts: number; homeMismatch: number };

/** Same dominance test as candidates.some(other), indexed by the three exact
 * fields used by that test. Keep source order and candidate identities intact.
 * Cartesian staff combinations must not add a second quadratic ranking pass. */
export function preferAvailableHomeStaff<T extends Candidate>(candidates: readonly T[], exempt: (resource: DiagnosticResourceChoice) => boolean): T[] {
  const key = (resource: DiagnosticResourceChoice) => JSON.stringify([resource.roomInstanceId, resource.stationId, resource.provider?.kind ?? null]);
  const groups = new Map<string, Map<number, number>>();
  for (const candidate of candidates) {
    if (!candidate.resource || Number.isNaN(candidate.starts) || Number.isNaN(candidate.homeMismatch)) continue;
    const id = key(candidate.resource), group = groups.get(id) ?? new Map<number, number>();
    const prior = group.get(candidate.homeMismatch);
    group.set(candidate.homeMismatch, prior === undefined ? candidate.starts : Math.min(prior, candidate.starts));
    groups.set(id, group);
  }
  const lowerStarts = new Map<string, Map<number, number>>();
  for (const [id, group] of groups) {
    const thresholds = new Map<number, number>();
    let minimum: number | undefined;
    for (const mismatch of [...group.keys()].sort((a, b) => a - b)) {
      if (minimum !== undefined) thresholds.set(mismatch, minimum);
      minimum = minimum === undefined ? group.get(mismatch)! : Math.min(minimum, group.get(mismatch)!);
    }
    lowerStarts.set(id, thresholds);
  }
  return candidates.filter(candidate => {
    if (!candidate.resource || exempt(candidate.resource)) return true;
    const start = lowerStarts.get(key(candidate.resource))?.get(candidate.homeMismatch);
    return start === undefined || !(start <= candidate.starts);
  });
}
