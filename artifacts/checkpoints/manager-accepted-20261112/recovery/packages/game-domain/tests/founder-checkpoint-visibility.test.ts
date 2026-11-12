import { describe, expect, it } from "vitest";
import { deserializeGameState, getPatientLists, serializeGameState, type GameState } from "../src";
import { CHECKPOINT_ENTRIES, CHECKPOINT_SOURCES, chartVisibilityCheckpoint, checkpointCommand as command,
  checkpointInputEncounters, checkpointTick as tick, closeCheckpointChart, patientFolder } from "./founder-checkpoint-visibility.fixture";

function expectEveryChartInItsFolder(state: GameState) {
  const lists = getPatientLists(state);
  for (const encounter of Object.values(state.encounters)) {
    const occurrences = (["waiting", "active", "resolved"] as const).flatMap(folder =>
      lists[folder].filter(row => row.encounterId === encounter.id).map(() => folder));
    expect(occurrences, `${encounter.id} ${encounter.lifecycle}`).toEqual(patientFolder(encounter) ? [patientFolder(encounter)] : []);
  }
}

describe("real checkpoint charts across load and ticks", () => {
  for (const source of CHECKPOINT_SOURCES) it.each(CHECKPOINT_ENTRIES)(`preserves ${source} %s patients and openability`, entry => {
    let state = chartVisibilityCheckpoint(source, entry);
    const initial = structuredClone(checkpointInputEncounters(source));
    expect(Object.keys(state.encounters).sort()).toEqual(Object.keys(initial).sort());
    for (const [id, old] of Object.entries(initial)) {
      expect(state.encounters[id]).toMatchObject({ patientDisplayName: old.patientDisplayName,
        lifecycle: old.lifecycle, checkInStatus: old.checkInStatus, currentNodeIndex: old.currentNodeIndex });
      expect(state.encounters[id]!.frozenCase).toEqual(old.frozenCase);
      expect(state.encounters[id]!.answers).toEqual(old.answers);
    }
    const inFlight = Object.values(initial).filter(e => e.resolutionReason === null);
    const loaded = structuredClone(state.encounters);
    state = deserializeGameState(serializeGameState(state));
    expect(state.encounters).toEqual(loaded);
    expectEveryChartInItsFolder(state);
    state = closeCheckpointChart(state); // Exactly the density helper's ordinary close action.
    state = command(state, { type: "SET_PAUSED", paused: false });
    for (let minute = 0; minute <= 120; minute++) {
      if (minute) state = tick(state);
      expectEveryChartInItsFolder(state);
      for (const old of inFlight) {
        const current = state.encounters[old.id]!;
        expect(current, old.patientDisplayName).toBeDefined();
        expect(current.frozenCase).toEqual(old.frozenCase);
        expect(current.answers).toEqual(old.answers);
        expect(current.resolutionReason).toBeNull(); // No answer or departure commitment occurred.
        expect(getPatientLists(state).active.some(row => row.encounterId === old.id) ||
          getPatientLists(state).waiting.some(row => row.encounterId === old.id)).toBe(true);
      }
      if ([0, 10, 120].includes(minute)) {
        state = deserializeGameState(serializeGameState(state));
        const lists = getPatientLists(state);
        for (const row of [...lists.waiting, ...lists.active]) {
          const opened = command(state, { type: "OPEN_CHART", encounterId: row.encounterId });
          expect(opened.openChartEncounterId).toBe(row.encounterId);
          expect(opened.encounters[row.encounterId]!.frozenCase).toEqual(state.encounters[row.encounterId]!.frozenCase);
        }
      }
    }
    if (source === "original") {
      expect(inFlight.map(e => e.patientDisplayName)).toEqual(["Sophia Young", "Leah Lane"]);
      expect(state.encounters[inFlight[0]!.id]!.lifecycle).toBe("active_action_required");
      expect(state.encounters[inFlight[1]!.id]!.lifecycle).toBe("active_pending_result");
    }
  });

  it.each(CHECKPOINT_ENTRIES)("reproduces the legitimate empty active list after filing the rebound %s summary", entry => {
    const loaded = chartVisibilityCheckpoint("rebound", entry);
    const summary = loaded.encounters[loaded.openChartEncounterId!]!;
    expect(summary.patientDisplayName).toBe("Lily Clay");
    expect(summary.resolutionReason).toBe("completed");
    expect(summary.answers).toHaveLength(summary.frozenCase.decisionNodes.length);
    expect(summary.terminalFeedback?.acknowledged).toBe(true);
    expect(getPatientLists(loaded)).toMatchObject({ waiting: [], active: [{ encounterId: summary.id }] });
    const closed = closeCheckpointChart(loaded);
    expect(getPatientLists(closed)).toMatchObject({ waiting: [], active: [] });
    expect(getPatientLists(closed).resolved).toHaveLength(11);
    expect(closed.encounters[summary.id]!.patientMovement?.kind).toBe("leaving_after_resolution");
  });

  it.each(CHECKPOINT_ENTRIES)("keeps a filed, departing %s chart open read-only without recalling either actor", entry => {
    let state = chartVisibilityCheckpoint("rebound", entry);
    const id = state.openChartEncounterId!;
    state = closeCheckpointChart(state);
    const departure = structuredClone(state.encounters[id]!.patientMovement);
    const founder = structuredClone(state.environment.founderActivity);
    state = command(state, { type: "OPEN_CHART", encounterId: id });
    expect(state.openChartEncounterId).toBe(id);
    expect(state.encounters[id]!.patientMovement).toEqual(departure);
    expect(state.environment.founderActivity).toEqual(founder);
    state = command(state, { type: "SET_PAUSED", paused: false });
    state = deserializeGameState(serializeGameState(state));
    state = tick(state, 120);
    expect(state.openChartEncounterId).toBe(id);
    expect(state.encounters[id]!.patientLocation).toBeNull();
    expect(state.encounters[id]!.lifecycle).toBe("resolved");
    expect(getPatientLists(state).resolved.some(row => row.encounterId === id)).toBe(true);
    expect(state.environment.founderActivity?.kind).not.toBe("attend_encounter");
  });

  it("holds an open completed summary until actual close, before the discharge starts", () => {
    let state = chartVisibilityCheckpoint("rebound", "launch-unmet");
    const id = state.openChartEncounterId!;
    state = command(state, { type: "OPEN_CHART", encounterId: id });
    state = command(state, { type: "SET_PAUSED", paused: false });
    state = tick(state, 60);
    expect(state.openChartEncounterId).toBe(id);
    expect(state.encounters[id]!.lifecycle).toBe("resolved_summary_available");
    expect(state.encounters[id]!.patientMovement).toBeNull();
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: id });
  });
});
