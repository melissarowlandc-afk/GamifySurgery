import { writeFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import * as clinicalSelection from "../src/clinical-selection";
import type { GameState } from "../src";
import { createLevelFourIntegrationState, m9Minute, m9DeferAppDemand } from "../../../tests/fixtures/level-four-integration";
// Hosted CI runners run long simulations up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

describe("Level 4 M9 defect regressions", () => {
  it("DEFECT-M9-2: unrelated APP/retail RNG traffic cannot change a scored selection with identical clinical inputs", () => {
    let on = createLevelFourIntegrationState("level-four-m9-fairness");
    on.nextRoutineArrivalTick = 1;
    let off = m9DeferAppDemand(structuredClone(on));
    const id = "encounter.auto.4.15";
    const select = clinicalSelection.selectRoutineClinicalCase;
    type Capture = { state: GameState; cases: Parameters<typeof select>[1]; at: number; selected: NonNullable<ReturnType<typeof select>> };
    const captured: Partial<Record<"on" | "off", Capture>> = {};
    let side: "on" | "off" = "on";
    const observer = vi.spyOn(clinicalSelection, "selectRoutineClinicalCase").mockImplementation((state, cases, at) => {
      const selected = select(state, cases, at);
      if (selected && `encounter.auto.${state.facilityLevel}.${state.routineArrivalSequence}` === id) captured[side] = { state: structuredClone(state), cases, at, selected };
      return selected;
    });
    try {
      for (let minute = 0; minute < 900; minute++) {
        side = "on"; on = m9Minute(on);
        side = "off"; off = m9Minute(m9DeferAppDemand(off));
      }
    } finally { observer.mockRestore(); }
    expect(on.encounters[id]!.waiting.arrivedAtTick).toBe(off.encounters[id]!.waiting.arrivedAtTick);
    for (const side of ["on", "off"] as const) {
      const call = captured[side]!;
      expect(call).toBeDefined();
      const extraTraffic = { ...call.state, serviceOperationSequence: call.state.serviceOperationSequence + 1009,
        retailOperationSequence: call.state.retailOperationSequence + 1013 };
      const replay = select(extraTraffic, call.cases, call.at)!;
      expect([replay.clinicalCase.id, replay.selectedConceptId, replay.kind]).toEqual([
        call.selected.clinicalCase.id, call.selected.selectedConceptId, call.selected.kind]);
      expect(call.selected.clinicalCase.id).toBe((side === "on" ? on : off).encounters[id]!.frozenCase.id);
    }
    if (process.env.LEVEL_FOUR_M9_REPORT === "1") writeFileSync(new URL("../../../.local-dev/level4-m9/defect-2-trace.json", import.meta.url),
      `${JSON.stringify({ on: captured.on?.selected.clinicalCase.id, off: captured.off?.selected.clinicalCase.id,
        identicalInputReplays: 2, tick: on.facilityTick }, null, 2)}\n`);
  }, hostedTime(90_000));
});
