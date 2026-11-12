import { expect, it } from "vitest";
import { cloneTickState } from "./tickStateClone";
import { cloneIncrementalTickState } from "./incrementalTickClone";
import { createDiagnosticWorkload } from "../../../tests/fixtures/diagnostic-workload";
import { freezeEvidence } from "./game-evidence-json";

it("preserves tick-clone JSON bytes and private operational ownership on the account-scale public fixture", () => {
  const { state } = createDiagnosticWorkload();
  const before = JSON.stringify(state), expected = cloneTickState(state), actual = cloneIncrementalTickState(freezeEvidence(state));
  expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));
  expect(actual.environment).not.toBe(state.environment); expect(actual.employees[0]).not.toBe(state.employees[0]);
  expect(actual.encounters).not.toBe(state.encounters); expect(actual.operationReceipts).not.toBe(state.operationReceipts);
  expect(actual.events).not.toBe(state.events); expect(actual.events[0]).toBe(state.events[0]);
  for (const [id, encounter] of Object.entries(actual.encounters)) {
    expect(encounter).not.toBe(state.encounters[id]); expect(encounter.frozenCase).toBe(state.encounters[id]!.frozenCase);
  }
  expect(JSON.stringify(state)).toBe(before);
});
