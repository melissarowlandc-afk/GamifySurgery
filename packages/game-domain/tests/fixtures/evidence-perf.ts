import { readFileSync } from "node:fs";
import { createInitialGameState, deserializeGameState, type GameState } from "../../src";
import {
  createGameEvidenceCheckpoint, importGameEvidence, type GameEvidenceCheckpoint, type GameEvidenceRecord,
} from "./game-evidence-legacy";
import { freezeEvidence } from "./game-evidence-json-legacy";

/** Fixed operational state isolates HISTORY scaling from a growing facility.
 * The padding is a valid, finance/learning-neutral journal, not a claim that
 * this synthetic prefix was earned by the integration driver. Measured work
 * always executes the actual command/reducer/evidence boundary. */
export function evidencePerfCheckpoint(level: 1 | 5, history: number): GameEvidenceCheckpoint {
  let state: GameState;
  if (level === 5) {
    const fixtures = JSON.parse(readFileSync(new URL("../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
    state = deserializeGameState(JSON.stringify(fixtures["integration-running"]));
  } else {
    state = createInitialGameState(undefined, { campaignId: "campaign.perf.level1", campaignSeed: "evidence.perf.level1", createdAtRealMs: 0 });
    state.facilityLevel = 1;
  }
  state.paused = false;
  const checkpoint = createGameEvidenceCheckpoint(state), records: GameEvidenceRecord[] = [...checkpoint.evidence.records];
  const finance = { facilityTick: state.facilityTick, cashCents: state.cashCents,
    operatingAccrualSixtiethCents: state.operatingAccrualSixtiethCents,
    totalOperatingExpenses: state.totalOperatingExpenses, nextFinancialPostingTick: state.nextFinancialPostingTick };
  let previous: string | null = null;
  for (let sequence = 1; sequence <= history; sequence++) {
    const id = `e${(records.length + 1).toString(36)}`;
    records.push({ id, kind: "transition", origin: "observed-transition", value: { sequence, previous,
      command: { type: "SET_SIMULATION_SPEED", speed: state.simulationSpeed, operationId: `perf.prefix.${sequence}` },
      before: finance, after: finance, cashDeltaCents: "0", learningChanges: [] } });
    previous = id;
  }
  const result = freezeEvidence({ snapshot: { ...checkpoint.snapshot, head: { sequence: history, transitionId: previous } },
    evidence: { ...checkpoint.evidence, records } });
  importGameEvidence(result.snapshot, result.evidence);
  return result;
}
