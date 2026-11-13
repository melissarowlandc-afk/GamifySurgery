import type { GameState, LateProgressionState } from "./types";

// Historical editorial XP goals. Keep these fixed when future goals change:
// an already-earned goal in an older campaign remains earned after loading.
const legacyClinicalXp = { 3: 500, 4: 750, 5: 2000 } as const;
// Fixed round-one thresholds, used only to retain already-earned save goals.
const roundOneLevelFourXp = 790;
const roundOneLevelFiveEncounters = 330;
type LateLevel = keyof typeof legacyClinicalXp;
type ProgressState = Pick<GameState, "facilityLevel" | "clinicalXp" | "levelFive"> &
  Partial<Pick<GameState, "encounters" | "retiredEncounterSummary">>;
type CurrentPolicy = Extract<LateProgressionState, { version: "late-progression.v2" }>;

function completedEncounters(state: ProgressState): number {
  return (state.retiredEncounterSummary?.completedCount ?? 0) + Object.values(state.encounters ?? {})
    .filter(encounter => encounter.resolutionReason === "completed").length;
}

/** Upgrade once, before commands can cross a previously earned threshold. */
export function upgradeLateProgressionState(state: ProgressState, policy: LateProgressionState): CurrentPolicy {
  if (policy.version === "late-progression.v2") return policy;
  let credit = policy.preservedClinicalXpGoal;
  if (state.facilityLevel === 4 && credit?.facilityLevel !== 4 && state.clinicalXp >= roundOneLevelFourXp) {
    credit = { facilityLevel: 4, minimumClinicalXp: roundOneLevelFourXp };
  }
  return {
    version: "late-progression.v2",
    preservedClinicalXpGoal: credit,
    preservedCompletedEncounterGoal: state.facilityLevel === 5 &&
      (completedEncounters(state) >= roundOneLevelFiveEncounters || state.levelFive?.progress.inspectionUnlocked)
      ? { facilityLevel: 5, minimumCompletedEncounters: completedEncounters(state) >= roundOneLevelFiveEncounters
        ? roundOneLevelFiveEncounters : 0 } : null,
  };
}

export function createLateProgressionState(state: ProgressState): LateProgressionState {
  const level = state.facilityLevel as LateLevel;
  const minimum = legacyClinicalXp[level];
  const earnedXp = Math.max(
    state.clinicalXp,
    level === 5 ? state.levelFive?.progress.inspectionUnlocked?.clinicalXp ?? 0 : 0,
  );
  const legacy: LateProgressionState = {
    version: "late-progression.v1",
    preservedClinicalXpGoal: minimum !== undefined && earnedXp >= minimum
      ? { facilityLevel: level, minimumClinicalXp: minimum }
      : null,
  };
  // Levels 0-3 retain their existing policy and progression behavior.
  return state.facilityLevel >= 4 ? upgradeLateProgressionState(state, legacy) : legacy;
}

function policyForState(state: GameState): LateProgressionState {
  return state.lateProgression?.version === "late-progression.v2" ? state.lateProgression
    : readLateProgressionState(state.lateProgression, state) ?? createLateProgressionState(state);
}

export function getProgressionClinicalXpGoal(
  state: GameState,
  minimum: number,
): { required: number; met: boolean } {
  const policy = policyForState(state);
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

export function getProgressionCompletedEncounterGoal(state: GameState, minimum: number): { required: number; met: boolean } {
  const policy = policyForState(state);
  const credit = policy.version === "late-progression.v2" ? policy.preservedCompletedEncounterGoal : null;
  const required = state.facilityLevel === 5 && credit ? Math.min(minimum, credit.minimumCompletedEncounters) : minimum;
  return { required, met: Boolean(state.levelFive?.progress.inspectionUnlocked) || completedEncounters(state) >= required };
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
  const modern = policy.version === "late-progression.v2";
  if ((policy.version !== "late-progression.v1" && !modern) || Object.keys(policy).length !== (modern ? 3 : 2) ||
    (modern && !("preservedCompletedEncounterGoal" in policy)) ||
    !("preservedClinicalXpGoal" in policy)) return invalid();
  const credit = policy.preservedClinicalXpGoal;
  let preservedClinicalXpGoal: LateProgressionState["preservedClinicalXpGoal"] = null;
  if (credit !== null) {
    if (!credit || typeof credit !== "object" || Array.isArray(credit)) return invalid();
    const goal = credit as Record<string, unknown>;
    const level = goal.facilityLevel;
    if (Object.keys(goal).length !== 2 || (level !== 3 && level !== 4 && level !== 5) || level > state.facilityLevel ||
      (goal.minimumClinicalXp !== legacyClinicalXp[level] && !(modern && level === 4 && goal.minimumClinicalXp === roundOneLevelFourXp))) return invalid();
    preservedClinicalXpGoal = { facilityLevel: level, minimumClinicalXp: goal.minimumClinicalXp as number };
  }
  if (!modern) {
    const legacy: LateProgressionState = { version: "late-progression.v1", preservedClinicalXpGoal };
    return state.facilityLevel >= 4 ? upgradeLateProgressionState(state, legacy) : legacy;
  }
  const volume = policy.preservedCompletedEncounterGoal;
  let preservedCompletedEncounterGoal: CurrentPolicy["preservedCompletedEncounterGoal"] = null;
  if (volume !== null) {
    if (!volume || typeof volume !== "object" || Array.isArray(volume)) return invalid();
    const goal = volume as Record<string, unknown>;
    if (Object.keys(goal).length !== 2 || goal.facilityLevel !== 5 || state.facilityLevel !== 5 ||
      (goal.minimumCompletedEncounters !== roundOneLevelFiveEncounters &&
        !(goal.minimumCompletedEncounters === 0 && state.levelFive?.progress.inspectionUnlocked))) return invalid();
    preservedCompletedEncounterGoal = { facilityLevel: 5, minimumCompletedEncounters: goal.minimumCompletedEncounters as number };
  }
  return { version: "late-progression.v2", preservedClinicalXpGoal, preservedCompletedEncounterGoal };
}
