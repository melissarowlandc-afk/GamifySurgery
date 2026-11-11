import { describe, expect, it } from "vitest";
import { createLevelFourIntegrationState } from "../../../tests/fixtures/level-four-integration";
import { createEarlyLevelFourEconomyState } from "../../../tools/economy-audit/level-four-simulation";
import { LevelFiveIntegrationJourney } from "../../../tests/fixtures/level-five-integration";
import { createLevelFiveStateQaContext } from "../../../tests/fixtures/level-five-state";
import { PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, getAppAppointmentHomes, getPatientLists,
  pediatricFamilyForActor, pediatricPairAtReservation, serializeGameState } from "../src";
import { clinicCaseMatchesLine } from "../src/clinic-consult-topics";
import { clinicFounderPath } from "../src/clinic-consults";
import { answerConsult, consultCommand, consultTick } from "./founder-consults.fixture";

const context = { ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
  cases: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => c.tutorialEligible ||
    c.decisionNodes.every(n => !n.resultGateAfter && n.answerChoices.every(a => !a.serviceRequest))) } };

describe("pediatric and wound/ostomy patient consults", () => {
  it("makes both specialties noticeable in a fresh public Level 5 clinic without adding a question stream, including reload", () => {
    const ctx = createLevelFiveStateQaContext();
    const initial = createEarlyLevelFourEconomyState("founder-consult.measure", ctx);
    initial.facilityLevel = 5; initial.nextRoutineArrivalTick = ctx.balanceRelease.arrivals.routineBaseIntervalMinutes;
    const journey = new LevelFiveIntegrationJourney(ctx, initial);
    const seen = new Set<string>(), ticks = { pediatric: [] as number[], wound_ostomy: [] as number[] };
    for (let minute = 0; minute < 600; minute++) {
      journey.pump(); journey.tick();
      for (const e of Object.values(journey.state.encounters)) if (!seen.has(e.id)) {
        seen.add(e.id);
        if (e.consult?.kind === "pediatric" || e.consult?.kind === "wound_ostomy") ticks[e.consult.kind].push(e.waiting.arrivedAtTick);
      }
      if (minute === 349) journey.state = deserializeGameState(serializeGameState(journey.state), ctx);
    }
    expect(seen.size).toBe(9); // The original scored clock, shared by every type.
    for (const times of Object.values(ticks)) {
      expect(times.length).toBeGreaterThanOrEqual(1); expect(times.length).toBeLessThanOrEqual(2);
      expect(times[0]).toBeLessThanOrEqual(300);
      for (let i = 1; i < times.length; i++) expect(times[i]! - times[i - 1]!).toBeGreaterThanOrEqual(300);
    }
  });
  it.each(["income.pediatric_consult", "income.wound_care", "income.ostomy_support"])("hands off %s without a new person or family, then releases its clinic", lineId => {
    let state = createLevelFourIntegrationState(`specialty-consult.${lineId}`, context);
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    for (const key of Object.keys(state.nextServiceAppointmentTicks)) state.nextServiceAppointmentTicks[key] = Number.MAX_SAFE_INTEGER;
    for (const home of getAppAppointmentHomes(state, context, lineId)) state.nextServiceAppointmentTicks[`${lineId}:${home}`] = 1;
    for (let i = 0; i < 300 && !state.serviceOperations.some(op => op.incomeLineId === lineId && op.status === "in_service"); i++) state = consultTick(state, 1, context);
    const original = state.serviceOperations.find(op => op.incomeLineId === lineId && op.status === "in_service")!;
    expect(original).toBeTruthy();
    expect(state.routineArrivalSequence).toBe(0);
    const physical = { name: original.displayName, appearance: structuredClone(original.appearance), location: structuredClone(original.location) };
    const family = pediatricFamilyForActor(state, "service_visitor", original.id);
    const parent = family && structuredClone(state.retailExternalActors.find(actor => actor.id === family.parentActorId)!);
    const familyCount = Object.keys(state.pediatricFamilies ?? {}).length;
    state.nextRoutineArrivalTick = state.facilityTick + 1;
    state = consultTick(state, 1, context); state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    const op = state.serviceOperations.find(op => op.id === original.id)!;
    const id = op.consultEncounterId!;
    expect(id).toBeTruthy();
    const e = state.encounters[id]!;
    expect(clinicCaseMatchesLine(e.frozenCase, lineId)).toBe(true);
    expect(e.patientDisplayName).toBe(physical.name); expect(e.patientAppearance).toEqual(physical.appearance);
    expect(e.patientLocation).toEqual(physical.location);
    const lists = getPatientLists(state);
    expect([...lists.waiting, ...lists.active].find(row => row.encounterId === id)?.actionRequired).toBe(true);
    if (family) {
      expect(Object.keys(state.pediatricFamilies!)).toHaveLength(familyCount);
      expect(pediatricFamilyForActor(state, "encounter", id)?.id).toBe(family.id);
      expect(pediatricPairAtReservation(state, state.pediatricFamilies![family.id]!)).toBe(true);
      const actual = state.retailExternalActors.find(actor => actor.id === parent!.id)!;
      expect([actual.displayName, actual.appearance, actual.location]).toEqual([parent!.displayName, parent!.appearance, parent!.location]);
    }
    state = deserializeGameState(serializeGameState(state), context);
    state = consultTick(state, 110, context);
    expect(state.serviceOperations.find(op => op.id === original.id)!.completedAtFacilityTick).toBeNull();
    state = consultCommand(state, { type: "OPEN_CHART", encounterId: id }, context);
    const chair = clinicFounderPath(state, state.encounters[id]!, context).at(-1)!;
    state = consultTick(state, 90, context);
    expect(state.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: id });
    expect(state.environment.founderLocation).toEqual(chair);
    expect(state.employees.find(employee => employee.id === e.consult!.providerEmployeeId)!.location).not.toEqual(chair);
    state = answerConsult(state, id, context);
    state = consultCommand(state, { type: "CLOSE_CHART", encounterId: id }, context);
    state = consultTick(state, 130, context);
    expect(state.serviceOperations.find(op => op.id === original.id)!.status).toBe("completed");
    expect(state.serviceIncomeReceipts.filter(row => row.transactionKey.includes(original.id))).toHaveLength(1);
    const saved = serializeGameState(state);
    const reopened = deserializeGameState(saved, context);
    expect(reopened.encounters[id]).toEqual(state.encounters[id]);
    expect(reopened.serviceOperations.find(row => row.id === original.id)).toEqual(state.serviceOperations.find(row => row.id === original.id));
    expect(reopened.pediatricFamilies).toEqual(state.pediatricFamilies);
    expect(reopened.lastServiceAppointmentTicks).toEqual(state.lastServiceAppointmentTicks);
    // The fixture also contains legacy retail rows with omitted optional nulls.
    // After their ordinary normalization, a second full round-trip is exact.
    expect(JSON.parse(serializeGameState(deserializeGameState(serializeGameState(reopened), context)))).toEqual(JSON.parse(serializeGameState(reopened)));
  });
});
