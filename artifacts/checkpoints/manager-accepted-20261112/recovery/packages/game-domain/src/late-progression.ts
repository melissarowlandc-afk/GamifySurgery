import type { GameState, LateProgressionState } from "./types";

// Historical editorial XP goals. Keep these fixed when future goals change:
// an already-earned goal in an older campaign remains earned after loading.
const legacyClinicalXp = { 3: 500, 4: 750, 5: 2000 } as const;
type LateLevel = keyof typeof legacyClinicalXp;
type ProgressState = Pick<GameState, "facilityLevel" | "clinicalXp" | "levelFive">;

export function createLateProgressionState(state: ProgressState): LateProgressionState {
  const level = state.facilityLevel as LateLevel;
  const minimum = legacyClinicalXp[level];
  const earnedXp = Math.max(
    state.clinicalXp,
    level === 5 ? state.levelFive?.progress.inspectionUnlocked?.clinicalXp ?? 0 : 0,
  );
  return {
    version: "late-progression.v1",
    preservedClinicalXpGoal: minimum !== undefined && earnedXp >= minimum
      ? { facilityLevel: level, minimumClinicalXp: minimum }
      : null,
  };
}

export function getProgressionClinicalXpGoal(
  state: GameState,
  minimum: number,
): { required: number; met: boolean } {
  const policy = state.lateProgression ?? createLateProgressionState(state);
  let credit = policy.preservedClinicalXpGoal?.facilityLevel === state.facilityLevel
    ? policy.preservedClinicalXpGoal
    : null;
  // An inspection unlock is itself a durable witness, including saves produced
  // between earning the old goal and the first load under the new policy.
  if (state.facilityLevel === 5 && state.levelFive?.progress.inspectionUnlocked &&
    state.levelFive.progress.inspectionUnlocked.clinicalXp < minimum) {
    credit ??= { facilityLevel: 5, minimumClinicalXp: legacyClinicalXp[5] };
  }
  const required = credit ? Math.min(minimum, credit.minimumClinicalXp) : minimum;
  const earnedUnlock = state.facilityLevel === 5 && Boolean(state.levelFive?.progress.inspectionUnlocked);
  return { required, met: credit !== null || earnedUnlock || state.clinicalXp >= required };
}

export function readLateProgressionState(
  value: unknown,
  state: ProgressState,
): LateProgressionState | undefined {
  if (value === undefined) {
    return state.facilityLevel >= 3 ? createLateProgressionState(state) : undefined;
  }
  const invalid = (): never => { throw new Error("The saved late progression policy is invalid."); };
  if (!value || typeof value !== "object" || Array.isArray(value)) return invalid();
  const policy = value as Record<string, unknown>;
  if (Object.keys(policy).length !== 2 || policy.version !== "late-progression.v1" ||
    !("preservedClinicalXpGoal" in policy)) return invalid();
  const credit = policy.preservedClinicalXpGoal;
  if (credit === null) return { version: "late-progression.v1", preservedClinicalXpGoal: null };
  if (!credit || typeof credit !== "object" || Array.isArray(credit)) return invalid();
  const goal = credit as Record<string, unknown>;
  const level = goal.facilityLevel;
  if (Object.keys(goal).length !== 2 || (level !== 3 && level !== 4 && level !== 5) ||
    level > state.facilityLevel || goal.minimumClinicalXp !== legacyClinicalXp[level]) return invalid();
  return {
    version: "late-progression.v1",
    preservedClinicalXpGoal: { facilityLevel: level, minimumClinicalXp: legacyClinicalXp[level] },
  };
}
