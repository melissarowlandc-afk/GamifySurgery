import { writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState, pediatricRoomAtPoint, serializeGameState, type GameState } from "../src";
import { createAppAppointmentsQaState } from "../../../tests/fixtures/app-appointments";
import { createPediatricAppointmentsQaState } from "../../../tests/fixtures/pediatric-appointments";
import { createMriAppointmentsQaState } from "../../../tests/fixtures/mri-appointments";
import { createWoundOstomyAppointmentsQaState } from "../../../tests/fixtures/wound-ostomy-appointments";
import { createPediatricChartsQaState, PEDIATRIC_CHARTS_QA_ENCOUNTER_ID } from "../../../tests/fixtures/pediatric-charts";
import { m9Apply, m9Minute, m9PumpChart, m9Until } from "../../../tests/fixtures/level-four-integration";
// Hosted CI runners run long simulations up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

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
  const care = (state: GameState) => JSON.parse(JSON.stringify({
    cashCents: state.cashCents, expenses: state.totalOperatingExpenses, clinicalXp: state.clinicalXp,
    histories: state.learningHistories, intents: state.reviewIntents, settlements: state.settlements,
    operations: state.serviceOperations.map(op => ({ ...op, resourceWaitReason: op.resourceWaitReason ?? null })),
    receipts: state.serviceIncomeReceipts, families: state.pediatricFamilies, completion: state.levelFourCompletion,
    parents: state.retailExternalActors.filter(actor => actor.pediatricFamilyId).map(actor => ({ ...actor, movementWaitReason: actor.movementWaitReason ?? null })),
  }));
  expect(restored).toEqual(continuous);
  expect(care(restored)).toEqual(care(continuous));
  for (let i = 0; i < minutes; i++) {
    continuous = m9Minute(continuous); restored = m9Minute(restored);
    if (pumpChart) { continuous = m9PumpChart(continuous); restored = m9PumpChart(restored); }
    expect(restored, `full-state reload divergence at ${initial.facilityTick} + ${i + 1}`).toEqual(continuous);
    expect(care(restored), `care reload divergence at ${initial.facilityTick} + ${i + 1}`).toEqual(care(continuous));
  }
  return restored;
}

describe("Level 4 M9 save/reload integration matrix", () => {
  for (const [name, line, fixture] of services) {
    it.each(phases)(`${name}: preserves full state and care/fees through %s reload`, phase => {
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
        `${JSON.stringify({ service: name, phase, checkpointTick: state.facilityTick, operationId: id, careComparedMinutes: 200, rootEquality: "PASS",
          receipts: result.serviceIncomeReceipts.filter(receipt => receipt.actorId === actorId) }, null, 2)}\n`);
    }, hostedTime(30_000));
  }

  it("resumes local MRI reading with continuous full state and one additive $5 receipt", () => {
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
  }, hostedTime(30_000));

  it("DEFECT-M9-1: preserves a real APP's saved idle deadline during an in-care reload", () => {
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

  it.each([0, 20, 50, 80, Number.MAX_SAFE_INTEGER])(
    "DEFECT-M9-1: preserves valid staff, encounter and retail idle deadline %s across repeated reloads",
    deadline => {
      let state = createAppAppointmentsQaState();
      state.facilityTick = 50;
      const encounter = Object.values(createInitialGameState().encounters)[0]!;
      state.encounters[encounter.id] = encounter;
      encounter.nextIdleActionAtFacilityTick = deadline;
      state.employees[0]!.nextIdleActionAtFacilityTick = deadline;
      state.retailNextOpportunityTicks["employee:app.0"] = deadline;
      const frozen = structuredClone(encounter.frozenCase);

      for (let reload = 0; reload < 3; reload++) {
        state = deserializeGameState(serializeGameState(state));
        expect(state.encounters[encounter.id]!.nextIdleActionAtFacilityTick).toBe(deadline);
        expect(state.employees[0]!.nextIdleActionAtFacilityTick).toBe(deadline);
        expect(state.retailNextOpportunityTicks["employee:app.0"]).toBe(deadline);
        expect(state.encounters[encounter.id]!.frozenCase).toEqual(frozen);
      }
    },
  );

  it.each([
    ["missing", undefined], ["null", null], ["negative", -1], ["fractional", 0.5],
    ["unsafe", Number.MAX_SAFE_INTEGER + 1], ["string", "20"], ["nonfinite", Infinity],
  ] as const)("DEFECT-M9-1: repairs %s legacy idle deadlines", (_label, deadline) => {
    const state = createAppAppointmentsQaState();
    state.facilityTick = 50;
    const encounter = Object.values(createInitialGameState().encounters)[0]!;
    state.encounters[encounter.id] = encounter;
    const raw = JSON.parse(serializeGameState(state));
    raw.encounters[encounter.id].nextIdleActionAtFacilityTick = deadline;
    raw.employees[0].nextIdleActionAtFacilityTick = deadline;
    raw.retailNextOpportunityTicks["employee:app.0"] = deadline;

    const restored = deserializeGameState(JSON.stringify(raw));
    const fallback = state.facilityTick + PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.idleActionMinimumMinutes;
    expect(restored.encounters[encounter.id]!.nextIdleActionAtFacilityTick).toBe(fallback);
    expect(restored.employees[0]!.nextIdleActionAtFacilityTick).toBe(fallback);
    expect(restored.retailNextOpportunityTicks).not.toHaveProperty("employee:app.0");
  });
});
