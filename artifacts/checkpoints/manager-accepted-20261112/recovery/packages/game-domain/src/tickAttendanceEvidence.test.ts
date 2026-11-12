import { expect, it } from "vitest";
import { applyGameEvidenceCommand, createGameEvidenceCheckpoint } from "./game-evidence";
import { createDiagnosticWorkload } from "../../../tests/fixtures/diagnostic-workload";

it("retains evidence receipts from a busy founder's discarded attendance retry", () => {
  const { state, chartId } = createDiagnosticWorkload();
  state.environment.pendingFounderConsult = { kind: "encounter", targetId: chartId,
    nodeId: state.encounters[chartId]!.frozenCase.decisionNodes[0]!.id };
  state.environment.founderActivity = { kind: "praise_employee", targetId: state.employees[0]!.id,
    path: [state.environment.founderLocation], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: 50 };
  const result = applyGameEvidenceCommand(createGameEvidenceCheckpoint(state), {
    type: "ADVANCE_TICK", operationId: "attendance.evidence.regression", advancedAtRealMs: 1800000000000,
  });
  expect(result.checkpoint.evidence.records.some(record => record.kind === "operation" &&
    (record.value as { operationId?: string }).operationId === "system.open-chart-attendance-retry")).toBe(true);
});
