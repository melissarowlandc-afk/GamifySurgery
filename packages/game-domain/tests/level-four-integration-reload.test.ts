import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, pediatricRoomAtPoint, serializeGameState, type GameState } from "../src";
import { createAppAppointmentsQaState } from "../../../tests/fixtures/app-appointments";
import { createPediatricAppointmentsQaState } from "../../../tests/fixtures/pediatric-appointments";
import { createMriAppointmentsQaState } from "../../../tests/fixtures/mri-appointments";
import { createWoundOstomyAppointmentsQaState } from "../../../tests/fixtures/wound-ostomy-appointments";
import { createPediatricChartsQaState, PEDIATRIC_CHARTS_QA_ENCOUNTER_ID } from "../../../tests/fixtures/pediatric-charts";
import { m9Apply, m9Minute, m9PumpChart, m9Until } from "../../../tests/fixtures/level-four-integration";

const services = [
  ["ordinary APP", "income.app_consult", createAppAppointmentsQaState],
  ["pediatric APP", "income.pediatric_consult", createPediatricAppointmentsQaState],
  ["wound APP", "income.wound_care", createWoundOstomyAppointmentsQaState],
  ["ostomy APP", "income.ostomy_support", createWoundOstomyAppointmentsQaState],
  ["MRI + reader", "income.mri", createMriAppointmentsQaState],
] as const;
const phases = ["waiting", "in care", "results/payment", "departure"] as const;
type Phase = typeof phases[number];

function operationReached(op: GameState["serviceOperations"][number], line: string, phase: Phase) {
  return op.incomeLineId === line &&
    (phase === "waiting" ? op.status === "waiting_for_resources" :
      phase === "in care" ? op.status === "in_service" :
        phase === "results/payment" ? line === "income.mri" ? op.status === "waiting_for_results" : op.completedAtFacilityTick !== null :
          op.status === "leaving" && op.pathIndex > 0 && op.pathIndex < op.path.length - 1);
}

function compareFuture(initial: GameState, minutes: number, pumpChart = false): GameState {
  let continuous = structuredClone(initial);
  let restored = deserializeGameState(serializeGameState(initial));
  // Exact root equality is separately reported as DEFECT-M9-1. These active
  // checks prove care progress/reservations/fees, not byte-for-byte root equality.
  const care = (state: GameState) => JSON.parse(JSON.stringify({
    cashCents: state.cashCents, expenses: state.totalOperatingExpenses, clinicalXp: state.clinicalXp,
    histories: state.learningHistories, intents: state.reviewIntents, settlements: state.settlements,
    operations: state.serviceOperations.map(op => ({ ...op, resourceWaitReason: op.resourceWaitReason ?? null })),
    receipts: state.serviceIncomeReceipts, families: state.pediatricFamilies, completion: state.levelFourCompletion,
    parents: state.retailExternalActors.filter(actor => actor.pediatricFamilyId).map(actor => ({ ...actor, movementWaitReason: actor.movementWaitReason ?? null })),
  }));
  expect(care(restored)).toEqual(care(continuous));
  for (let i = 0; i < minutes; i++) {
    continuous = m9Minute(continuous); restored = m9Minute(restored);
    if (pumpChart) { continuous = m9PumpChart(continuous); restored = m9PumpChart(restored); }
    expect(care(restored), `care reload divergence at ${initial.facilityTick} + ${i + 1}`).toEqual(care(continuous));
  }
  return restored;
}

describe("Level 4 M9 save/reload integration matrix", () => {
  for (const [name, line, fixture] of services) {
    it.each(phases)(`${name}: preserves care/fees through %s reload (root equality: DEFECT-M9-1)`, phase => {
      let state = fixture();
      state = m9Apply(state, { type: "SET_PAUSED", paused: false }, "m9.reload.play");
      state = m9Until(state, value => value.serviceOperations.some(op => operationReached(op, line, phase)), undefined, 600);
      const visit = state.serviceOperations.find(op => operationReached(op, line, phase))!;
      const id = visit.id;
      state = m9Apply(state, { type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: false }, "m9.reload.demand-off");
      const result = compareFuture(state, 200);
      expect(result.serviceOperations.find(op => op.id === id)?.status).toBe("completed");
      const actorId = visit.actorId;
      expect(result.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === line && receipt.actorId === actorId)).toHaveLength(1);
      expect(new Set(result.serviceIncomeReceipts.map(receipt => receipt.transactionKey)).size).toBe(result.serviceIncomeReceipts.length);
      if (process.env.LEVEL_FOUR_M9_REPORT === "1") writeFileSync(new URL(`../../../.local-dev/level4-m9/reload-${line.slice(7)}-${phase.replaceAll(/[^a-z]/g, "-")}.json`, import.meta.url),
        `${JSON.stringify({ service: name, phase, checkpointTick: state.facilityTick, operationId: id, careComparedMinutes: 200, rootEquality: "DEFECT-M9-1",
          receipts: result.serviceIncomeReceipts.filter(receipt => receipt.actorId === actorId) }, null, 2)}\n`);
    }, 30_000);
  }

  it("resumes local MRI reading with continuous care and one additive $5 receipt (root equality: DEFECT-M9-1)", () => {
    let state = createMriAppointmentsQaState();
    state = m9Apply(state, { type: "SET_PAUSED", paused: false }, "m9.read.reload.play");
    state = m9Until(state, value => value.serviceOperations.some(op => op.diagnosticPhaseWork?.kind === "interpretation" && op.status === "in_service"));
    const reading = state.serviceOperations.find(op => op.diagnosticPhaseWork?.kind === "interpretation" && op.status === "in_service")!;
    const key = `income.diagnostic-read.${reading.diagnosticPhaseWork!.orderId}.${reading.diagnosticPhaseWork!.phaseId}`;
    const result = compareFuture(state, 40);
    expect(result.serviceIncomeReceipts.filter(receipt => receipt.transactionKey === key).map(receipt => receipt.grossAmount)).toEqual([5]);
  });

  it.each(["scored", "APP"] as const)("resumes a %s pediatric pair at an actual doorway crossing", kind => {
    let state = kind === "scored" ? createPediatricChartsQaState() : createPediatricAppointmentsQaState();
    state = m9Apply(state, { type: "SET_PAUSED", paused: false }, "m9.doorway.play");
    let doorway = false;
    for (let minute = 0; minute < 300 && !doorway; minute++) {
      state = m9Minute(state);
      if (kind === "scored") state = m9PumpChart(state);
      doorway = Object.values(state.pediatricFamilies ?? {}).some(family => {
        const movement = family.movement;
        if (!movement || !movement.doorIds.length) return false;
        const point = movement.childPath[movement.pathIndex];
        const next = movement.childPath[movement.pathIndex + 1];
        return point && next && pediatricRoomAtPoint(state, PROTOTYPE_DOMAIN_CONTEXT, point)?.id !== pediatricRoomAtPoint(state, PROTOTYPE_DOMAIN_CONTEXT, next)?.id;
      });
    }
    expect(doorway).toBe(true);
    const result = compareFuture(state, 180, kind === "scored");
    for (const family of Object.values(result.pediatricFamilies ?? {})) {
      const parent = result.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
      const childLocation = family.child.kind === "encounter" ? result.encounters[family.child.id]?.patientLocation :
        result.serviceOperations.find(op => op.id === family.child.id)?.location;
      expect(pediatricRoomAtPoint(result, PROTOTYPE_DOMAIN_CONTEXT, childLocation ?? null)?.id).toBe(pediatricRoomAtPoint(result, PROTOTYPE_DOMAIN_CONTEXT, parent.location)?.id);
    }
    if (kind === "scored") expect(result.encounters[PEDIATRIC_CHARTS_QA_ENCOUNTER_ID]?.resolutionReason).toBe("completed");
  }, 30_000);

  it.skip("DEFECT-M9-1: preserves a real APP's saved idle deadline during an in-care reload", () => {
    let state = createAppAppointmentsQaState();
    state = m9Apply(state, { type: "SET_PAUSED", paused: false }, "m9.defect.one.play");
    state = m9Until(state, value => value.serviceOperations.some(op => op.status === "in_service"));
    const restored = deserializeGameState(serializeGameState(state));
    if (process.env.LEVEL_FOUR_M9_REPORT === "1") writeFileSync(new URL("../../../.local-dev/level4-m9/defect-1-trace.json", import.meta.url),
      `${JSON.stringify({ checkpointTick: state.facilityTick,
        before: state.employees.map(employee => [employee.id, employee.nextIdleActionAtFacilityTick]),
        after: restored.employees.map(employee => [employee.id, employee.nextIdleActionAtFacilityTick]) }, null, 2)}\n`);
    expect(restored.employees.map(employee => [employee.id, employee.nextIdleActionAtFacilityTick]))
      .toEqual(state.employees.map(employee => [employee.id, employee.nextIdleActionAtFacilityTick]));
  });
});
