import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE, prototypeBalanceReleaseSchema } from "@gamify-surgery/balance-config";
import {
  createInitialGameState, createPixelAppearance, deserializeGameState, getFacilityProgressionStatus,
  planDiagnosticOrder, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState,
  type ClinicVisitState, type DomainContext, type GameState, type LevelFourCompletionState,
  type PediatricFamilyState, type ServiceOperationState,
} from "../src";
import { pending, timingFixture } from "./diagnostic-timing-fixtures";

const emptyCompletion: LevelFourCompletionState = {
  version: "level-four-completion.v1", pediatricVisitWithParent: null,
  woundOstomyCareVisit: null, acknowledgedAtFacilityTick: null,
};

function levelFourContext(): DomainContext {
  const balance = structuredClone(PROTOTYPE_BALANCE_RELEASE);
  balance.facility.maximumPlayableLevel = 4;
  const exam = balance.facility.roomDefinitions.find((definition) => definition.id === "room.examination")!;
  for (const id of ["room.mri", "room.pediatric_waiting", "room.pediatric_examination", "room.wound_ostomy"]) {
    if (balance.facility.roomDefinitions.some((room) => room.id === id)) continue;
    balance.facility.roomDefinitions.push({ ...exam, id, unlockFacilityLevel: 4, navigation: undefined });
  }
  const role = balance.facility.staffRoleDefinitions.find((definition) => definition.id === "staff.glp1_np")!;
  if (!balance.facility.staffRoleDefinitions.some((definition) => definition.id === "staff.app")) balance.facility.staffRoleDefinitions.push({ ...role, id: "staff.app", unlockFacilityLevel: 4,
    requiredRoomDefinitionIds: [], requiredAnyRoomDefinitionIds: ["room.examination", "room.minor_procedure", "room.pediatric_examination", "room.wound_ostomy"] });
  return { ...PROTOTYPE_DOMAIN_CONTEXT, balanceRelease: prototypeBalanceReleaseSchema.parse(balance) };
}

function clinicOperation(kind: ClinicVisitState["kind"]): ServiceOperationState {
  const incomeByKind = { adult_appointment: "income.app_consult", pediatric_consult: "income.pediatric_consult",
    wound_care: "income.wound_care", ostomy_support: "income.ostomy_support", mri: "income.mri" } as const;
  const pediatric = kind === "pediatric_consult";
  return {
    id: `operation.schema.${kind}`, incomeLineId: incomeByKind[kind], catalogVersion: 1,
    actorKind: "visitor", actorId: `visitor.schema.${kind}`, displayName: "Schema-only visitor",
    appearance: { ...createPixelAppearance("schema", "patient", kind, "patient"), stillId: pediatric ? "level3-roster-v2.025" : "future.adult.schema" },
    clinicVisit: { version: "clinic-visit.v1", kind, demographics: { ageYears: pediatric ? 9 : 40, sexLabel: "Female" },
      ...(pediatric ? { pediatricFamilyId: "family.schema.child" } : {}) },
    status: "waiting_for_resources", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 200,
    startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null, quoteFee: 80,
    phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds: [],
    providerReservation: null, location: { x: 35, y: 29 }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null,
  };
}

function pediatricSaveFixture(childKind: PediatricFamilyState["child"]["kind"] = "encounter") {
  const context = levelFourContext();
  const state = createInitialGameState(context, { campaignId: "campaign.schema.l4", campaignSeed: "schema.l4", createdAtRealMs: 0 });
  state.facilityLevel = 4;
  state.facilityTick = 100;
  state.paused = true;
  state.pediatricFamilies = {};
  state.levelFourCompletion = structuredClone(emptyCompletion);
  const encounter = Object.values(state.encounters)[0]!;
  encounter.frozenCase = { ...encounter.frozenCase, id: "case.schema.child", tutorialEligible: false, earliestFacilityStage: 4,
    pediatricProfile: { version: "pediatric-patient-profile.v1", requiresParent: true, clinicalScope: "outpatient" },
    prototypeDemographics: { ageYears: 9, sexLabel: "Female" }, prototypeVitalSigns: undefined,
    approvedInstantiationProfiles: undefined, selectedInstantiationProfileId: undefined, patientPresentationRevision: undefined };
  encounter.patientAppearance = { ...createPixelAppearance("schema", "patient", "child", "patient"), stillId: "level3-roster-v2.025" };
  encounter.pediatricFamilyId = "family.schema.child";
  encounter.patientLocation = { x: 35, y: 29 };
  encounter.patientMovement = null;
  const operation = clinicOperation("pediatric_consult");
  if (childKind === "service_visitor") { state.encounters = {}; state.serviceOperations = [operation]; }
  const family: PediatricFamilyState = {
    version: "pediatric-family.v1", id: "family.schema.child", child: { kind: childKind, id: childKind === "encounter" ? encounter.id : operation.id },
    parentActorId: "companion.schema.parent", phase: "waiting",
    reservation: { roomInstanceId: "room.instance.founder_desk", childLocation: { x: 35, y: 29 }, parentLocation: { x: 36, y: 29 }, childSeatId: null, parentSeatId: null },
  };
  state.pediatricFamilies[family.id] = family;
  state.retailExternalActors.push({
    id: family.parentActorId, kind: "companion", displayName: "Schema-only parent",
    appearance: { ...createPixelAppearance("schema", "patient", "parent", "patient"), stillId: "future.parent.schema" },
    linkedEncounterId: childKind === "encounter" ? encounter.id : null, linkedServiceOperationId: childKind === "service_visitor" ? operation.id : null,
    lifecycle: "onsite", location: { x: 36, y: 29 }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0,
    activeRetailOperationId: null, pediatricFamilyId: family.id,
  });
  return { state, context, family, encounter, operation };
}

describe("Level 4 additive save foundation", () => {
  it.each([0, 1, 2, 3] as const)("retains an old Level %i campaign, with empty specialty defaults and unchanged learning/finance/actors", (level) => {
    const baseline = deserializeGameState(serializeGameState(createInitialGameState(undefined, {
      campaignId: `legacy.level.${level}`, campaignSeed: `legacy.level.${level}`, createdAtRealMs: 0,
    })));
    baseline.facilityLevel = level;
    for (const schemaVersion of [5, 6, 7, 8, 9]) {
      const old = JSON.parse(serializeGameState(baseline));
      old.schemaVersion = schemaVersion;
      delete old.pediatricFamilies; delete old.levelFourCompletion;
      const restored = deserializeGameState(JSON.stringify(old));
      expect(restored.facilityLevel).toBe(level);
      expect(restored.pediatricFamilies).toBeUndefined();
      expect(restored.levelFourCompletion).toBeUndefined();
      const savedKeys = Object.keys(JSON.parse(serializeGameState(restored)));
      expect(savedKeys).not.toContain("pediatricFamilies");
      expect(savedKeys).not.toContain("levelFourCompletion");
      for (const key of ["rooms", "doors", "employees", "encounters", "founder", "cashCents", "clinicalXp", "learningHistories", "reviewIntents",
        "settlements", "serviceIncomeReceipts", "operationReceipts", "schedulerPins", "salaryEconomyVersion", "events"] as const) {
        expect(restored[key], `schema ${schemaVersion}: ${key}`).toEqual(baseline[key]);
      }
    }
  });

  it("accepts Level 4 in the shipped balance and still rejects it in a capped legacy context", () => {
    const fixture = pediatricSaveFixture();
    const capped = structuredClone(fixture.context);
    capped.balanceRelease.facility.maximumPlayableLevel = 3;
    expect(() => deserializeGameState(serializeGameState(fixture.state), capped)).toThrow(/incomplete or invalid/);
    expect(deserializeGameState(serializeGameState(fixture.state)).facilityLevel).toBe(4);
    expect(deserializeGameState(serializeGameState(fixture.state), fixture.context).facilityLevel).toBe(4);
    const live = createInitialGameState(); live.facilityLevel = 3;
    expect(getFacilityProgressionStatus(live)).toMatchObject({ maximumPlayableLevel: 4, nextFacilityLevel: 4 });
  });

  it.each(["encounter", "service_visitor"] as const)("round-trips a %s family, explicit demographics, known child still and parent identity twice", (childKind) => {
    const fixture = pediatricSaveFixture(childKind);
    for (let reload = 0; reload < 2; reload++) {
      const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
      expect(restored.pediatricFamilies).toEqual(fixture.state.pediatricFamilies);
      expect(restored.retailExternalActors).toEqual(fixture.state.retailExternalActors);
      const child = childKind === "encounter" ? restored.encounters[fixture.encounter.id]!.patientAppearance : restored.serviceOperations[0]!.appearance;
      expect(child).toEqual(childKind === "encounter" ? fixture.encounter.patientAppearance : fixture.operation.appearance);
      if (childKind === "encounter") {
        expect(restored.encounters[fixture.encounter.id]!.frozenCase).toEqual(JSON.parse(JSON.stringify(fixture.encounter.frozenCase)));
        expect(restored.encounters[fixture.encounter.id]!.frozenCase.prototypeVitalSigns).toBeUndefined();
      } else expect(restored.serviceOperations[0]!.clinicVisit).toEqual(fixture.operation.clinicVisit);
      expect(restored.clinicalXp).toBe(fixture.state.clinicalXp);
      expect(restored.learningHistories).toEqual(fixture.state.learningHistories);
      fixture.state = restored;
    }
  });

  it("round-trips all four future rooms, APP identity/salary, and the three adult clinic visit kinds without family defaults", () => {
    const { state, context } = pediatricSaveFixture();
    state.encounters = {}; state.retailExternalActors = []; state.pediatricFamilies = {};
    state.serviceOperations = [clinicOperation("adult_appointment"), clinicOperation("wound_care"), clinicOperation("ostomy_support")];
    for (const [index, roomDefinitionId] of ["room.mri", "room.pediatric_waiting", "room.pediatric_examination", "room.wound_ostomy"].entries()) {
      state.rooms.push({ id: `room.schema.${index}`, roomDefinitionId, x: 2 + index * 4, y: 2, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    }
    const role = context.balanceRelease.facility.staffRoleDefinitions.find((definition) => definition.id === "staff.app")!;
    state.employees.push({ id: "employee.schema.app", staffRoleDefinitionId: "staff.app", displayName: "Saved APP",
      appearance: { ...createPixelAppearance("schema", "staff", "app", "patient"), stillId: "future.app.schema" },
      hiredAtFacilityTick: 0, salaryPerExpenseInterval: role.salaryPerExpenseInterval, morale: 75, trainingLevel: 1,
      homeRoomInstanceId: null, location: { ...state.environment.founderLocation }, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 200 });
    const restored = deserializeGameState(serializeGameState(state), context);
    expect(restored.rooms.map((room) => [room.id, room.roomDefinitionId])).toEqual(state.rooms.map((room) => [room.id, room.roomDefinitionId]));
    expect(restored.employees[0]).toMatchObject({ id: "employee.schema.app", displayName: "Saved APP", salaryPerExpenseInterval: role.salaryPerExpenseInterval,
      morale: 75, trainingLevel: 1, appearance: { stillId: "future.app.schema" } });
    expect(restored.serviceOperations.map((operation) => operation.clinicVisit)).toEqual(state.serviceOperations.map((operation) => operation.clinicVisit));
    expect(restored.pediatricFamilies).toEqual({});
    expect(restored.levelFourCompletion).toEqual(emptyCompletion);
  });

  it.each(["income.wound_care", "income.ostomy_support"] as const)("retains durable %s and pediatric evidence/acknowledgement after all live histories are retired", (incomeLineId) => {
    const { state, context } = pediatricSaveFixture();
    state.levelFourCompletion = { version: "level-four-completion.v1",
      pediatricVisitWithParent: { incomeLineId: "income.pediatric_consult", serviceOperationId: "retired.pediatric.operation", encounterId: null,
        parentActorId: "retired.parent", completedAtFacilityTick: 20 },
      woundOstomyCareVisit: { incomeLineId, serviceOperationId: null, encounterId: "retired.wound.encounter", completedAtFacilityTick: 30 },
      acknowledgedAtFacilityTick: 50 };
    state.encounters = {}; state.serviceOperations = []; state.serviceIncomeReceipts = []; state.pediatricFamilies = {}; state.retailExternalActors = [];
    const before = JSON.stringify(state.levelFourCompletion);
    let restored = deserializeGameState(serializeGameState(state), context);
    restored = deserializeGameState(serializeGameState(restored), context);
    expect(JSON.stringify(restored.levelFourCompletion)).toBe(before);
    expect(restored.events).toEqual(state.events);
    expect(restored.cashCents).toBe(state.cashCents);
  });

  it("retains frozen pre-MRI diagnostic plans, receipt quotes and stable actor identities", () => {
    const fixture = timingFixture();
    const quote = planDiagnosticOrder(fixture.state, { orderId: "order.schema.legacy", encounterId: fixture.encounter.id,
      serviceId: "service.basic_labs", patientOrigin: fixture.encounter.patientLocation! }, fixture.context);
    if (quote.kind !== "planned") throw new Error(quote.reason);
    fixture.encounter.pendingResult = pending(quote.plan);
    fixture.state.serviceIncomeReceipts.push({ id: "receipt.schema.saved", transactionKey: "transaction.schema.saved", incomeLineId: "income.prescription",
      catalogVersion: 1, routeId: null, actorKind: "patient", actorId: fixture.encounter.id,
      grossAmount: 25, stockCost: 15, netCashDelta: 10, completedAtFacilityTick: 0 });
    const restored = deserializeGameState(serializeGameState(fixture.state), fixture.context);
    expect(restored.encounters[fixture.encounter.id]!.pendingResult!.diagnosticTiming).toEqual(quote.plan);
    expect(restored.serviceIncomeReceipts).toEqual(fixture.state.serviceIncomeReceipts);
    expect(restored.encounters[fixture.encounter.id]!.patientAppearance).toEqual(fixture.encounter.patientAppearance);
  });

  it.each([
    ["future version", (raw: any) => { raw.levelFourCompletion.version = "level-four-completion.v2"; }],
    ["partial completion", (raw: any) => { delete raw.levelFourCompletion.pediatricVisitWithParent; }],
    ["unearned acknowledgement", (raw: any) => { raw.levelFourCompletion.acknowledgedAtFacilityTick = 10; }],
    ["malformed family", (raw: any) => { raw.pediatricFamilies = []; }],
    ["future family version", (raw: any) => { raw.pediatricFamilies["family.schema.child"].version = "pediatric-family.v2"; }],
    ["missing parent", (raw: any) => { raw.retailExternalActors = []; }],
    ["duplicate family", (raw: any) => { const family = raw.pediatricFamilies["family.schema.child"]; raw.pediatricFamilies["family.duplicate"] = { ...family, id: "family.duplicate" }; }],
    ["outside parent place", (raw: any) => { raw.pediatricFamilies["family.schema.child"].reservation.parentLocation.x = 0; }],
    ["shared contact", (raw: any) => { const reservation = raw.pediatricFamilies["family.schema.child"].reservation; reservation.parentLocation = reservation.childLocation; }],
    ["orphan family link", (raw: any) => { raw.pediatricFamilies = {}; }],
    ["missing child demographics", (raw: any) => { delete Object.values<any>(raw.encounters)[0].frozenCase.prototypeDemographics; }],
    ["missing frozen child art", (raw: any) => { delete Object.values<any>(raw.encounters)[0].patientAppearance.stillId; }],
  ])("rejects %s rather than dropping new state", (_label, mutate) => {
    const fixture = pediatricSaveFixture(); const raw = JSON.parse(serializeGameState(fixture.state)); mutate(raw);
    expect(() => deserializeGameState(JSON.stringify(raw), fixture.context)).toThrow();
  });

  it.each([
    ["unknown clinic version", (operation: any) => { operation.clinicVisit.version = "clinic-visit.v2"; }],
    ["mismatched income", (operation: any) => { operation.incomeLineId = "income.wound_care"; }],
    ["adult age", (operation: any) => { operation.clinicVisit.demographics.ageYears = 40; }],
    ["missing visit parent", (operation: any) => { delete operation.clinicVisit.pediatricFamilyId; }],
    ["unknown visit kind", (operation: any) => { operation.clinicVisit.kind = "wound_procedure"; }],
  ])("rejects %s on a saved pediatric appointment", (_label, mutate) => {
    const fixture = pediatricSaveFixture("service_visitor"); const raw = JSON.parse(serializeGameState(fixture.state)); mutate(raw.serviceOperations[0]);
    expect(() => deserializeGameState(JSON.stringify(raw), fixture.context)).toThrow();
  });
});
