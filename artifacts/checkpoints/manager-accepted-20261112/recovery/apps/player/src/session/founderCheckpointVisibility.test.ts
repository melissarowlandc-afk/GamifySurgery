import { describe, expect, it } from "vitest";
import { getPatientLists, type GameState } from "@gamify-surgery/game-domain";
import { CHECKPOINT_ENTRIES, CHECKPOINT_SOURCES, chartVisibilityCheckpoint, checkpointCommand as command,
  checkpointTick as tick, closeCheckpointChart, patientFolder } from "../../../../packages/game-domain/tests/founder-checkpoint-visibility.fixture";
import { createPrototypePlayerView } from "./viewModels";

function expectChartsProjected(state: GameState) {
  const view = createPrototypePlayerView(state, state.openChartEncounterId, false, null);
  const lists = getPatientLists(state);
  expect(view.patients.map(row => row.id).sort()).toEqual(Object.values(lists).flat().map(row => row.encounterId).sort());
  for (const row of view.patients) expect(row.folder).toBe(patientFolder(state.encounters[row.id]!));
  for (const id of Object.keys(state.encounters)) expect(view.facility.patients!.filter(p => p.instanceId === id).length).toBeLessThanOrEqual(1);
  return view;
}

describe("headless integration-l4 / launch-unmet patient sheets", () => {
  for (const source of CHECKPOINT_SOURCES) it.each(CHECKPOINT_ENTRIES)(`projects every ${source} %s chart across reload and ticks`, entry => {
    let state = chartVisibilityCheckpoint(source, entry);
    const initial = expectChartsProjected(state);
    expect(initial.chart?.id).toBe(state.openChartEncounterId);
    state = closeCheckpointChart(state);
    state = command(state, { type: "SET_PAUSED", paused: false });
    for (let minute = 0; minute <= 120; minute++) {
      if (minute) state = tick(state);
      if (![0, 1, 5, 10, 30, 60, 120].includes(minute)) continue;
      const view = expectChartsProjected(state);
      for (const row of view.patients.filter(p => p.folder !== "resolved")) {
        const opened = command(state, { type: "OPEN_CHART", encounterId: row.id });
        const chart = createPrototypePlayerView(opened, opened.openChartEncounterId, false, null).chart;
        expect(chart?.id).toBe(row.id);
        expect(chart?.readOnly).toBe(false);
      }
    }
  });

  it.each(CHECKPOINT_ENTRIES)("shows the rebound %s patient's filed chart while the actor leaves", entry => {
    let state = chartVisibilityCheckpoint("rebound", entry);
    const id = state.openChartEncounterId!;
    state = closeCheckpointChart(state);
    const filed = expectChartsProjected(state);
    expect(filed.patients.filter(p => p.folder !== "resolved")).toHaveLength(0);
    expect(filed.patients.filter(p => p.folder === "resolved")).toHaveLength(11);
    state = command(state, { type: "OPEN_CHART", encounterId: id });
    state = command(state, { type: "SET_PAUSED", paused: false });
    for (let minute = 0; minute <= 120; minute++) {
      if (minute) state = tick(state);
      if (![0, 10, 60, 120].includes(minute)) continue;
      const view = expectChartsProjected(state);
      expect(view.chart).toMatchObject({ id, readOnly: true });
      expect(view.patients.find(p => p.id === id)?.folder).toBe("resolved");
      expect(state.environment.founderActivity?.kind).not.toBe("attend_encounter");
      if (minute === 120) expect(view.facility.patients!.some(p => p.instanceId === id)).toBe(false);
    }
  });
});
