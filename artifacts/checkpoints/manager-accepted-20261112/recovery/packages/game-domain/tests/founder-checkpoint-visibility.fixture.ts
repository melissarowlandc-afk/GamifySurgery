import original from "../../../tests/fixtures/founder-qa-attendance-20261110.json";
import rebound from "../../../tests/fixtures/founder-consult-rebound-l4-20261110.json";
import current from "../../../tests/fixtures/level-five-integration-checkpoints-20261012.json";
import { createLevelFiveIntegrationQaState } from "../../../tests/fixtures/level-five-integration-qa";
import { createLevelFiveLaunchQaState } from "../../../tests/fixtures/level-five-launch";
import { deserializeGameState, PROTOTYPE_DOMAIN_CONTEXT, type EncounterState, type GameState } from "../src";
import { qaAttendanceCommand, qaAttendanceTick } from "./founder-qa-attendance.fixture";

export const CHECKPOINT_SOURCES = ["original", "rebound", "current"] as const;
export const CHECKPOINT_ENTRIES = ["integration-l4", "launch-unmet"] as const;

export function checkpointInputEncounters(source: typeof CHECKPOINT_SOURCES[number]): Readonly<GameState["encounters"]> {
  return (source === "original" ? original : source === "rebound" ? rebound : current["integration-l4"])
    .encounters as unknown as Readonly<GameState["encounters"]>;
}

/** Exact public journey snapshots; no admissions, answer bot or synthetic patient states. */
export function chartVisibilityCheckpoint(source: typeof CHECKPOINT_SOURCES[number], entry: typeof CHECKPOINT_ENTRIES[number]): GameState {
  if (source === "current") return entry === "launch-unmet" ? createLevelFiveLaunchQaState(entry)
    : createLevelFiveIntegrationQaState(entry, PROTOTYPE_DOMAIN_CONTEXT);
  const state = deserializeGameState(JSON.stringify(source === "original" ? original : rebound));
  state.campaignId = entry === "launch-unmet" ? "campaign.qa.level-five-launch-m10.launch-unmet"
    : "campaign.qa.level-five-integration-m9.integration-l4";
  if (entry === "launch-unmet") state.clinicalXp = 749;
  return state;
}

export function closeCheckpointChart(state: GameState): GameState {
  return state.openChartEncounterId ? qaAttendanceCommand(state, { type: "CLOSE_CHART", encounterId: state.openChartEncounterId }) : state;
}

export function patientFolder(encounter: EncounterState): "waiting" | "active" | "resolved" | null {
  if (encounter.lifecycle === "waiting_unopened") return encounter.checkInStatus === "checked_in" ? "waiting" : null;
  if (encounter.lifecycle === "resolved") return "resolved";
  return "active";
}

export { qaAttendanceCommand as checkpointCommand, qaAttendanceTick as checkpointTick };
