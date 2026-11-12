import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import * as clinicalSelection from "../src/clinical-selection";
import { selectClinicConsult } from "../src/clinic-consults";
import { compatibleConsultProfile, procedureConsultKind, selectProcedureConsult } from "../src/founder-consults";
import { clinicCaseMatchesLine } from "../src/clinic-consult-topics";
import { getClinicalCaseEligibilityIssue, getPediatricClinicFamilyContext } from "../src/clinical-case-eligibility";
import { createPreLevelFiveLaunchContext } from "../../../tests/fixtures/level-five-launch";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState, gameReducer,
  getFacilityProgressionStatus, getRoomResaleValue, getServiceIncomeTotalsCents,
  getCurrentCapabilities, pediatricFamilyForActor,
  pediatricRoomAtPoint, serializeGameState, type GameState,
} from "../src";
import { createLevelThreeReadyQaState } from "../../../tests/fixtures/level-four-progression";
import {
  createLevelFourIntegrationState, M9_PEDIATRIC_CASE_ID, M9_ROOMS, m9Apply, m9Learning,
  m9Minute, m9PumpChart, m9SellRoom, m9ShortChartContext, m9Until, m9DeferAppDemand,
} from "../../../tests/fixtures/level-four-integration";
// Hosted CI runners run these full-campaign checks up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

const scratch = new URL("../../../.local-dev/level4-m9/", import.meta.url);
function report(name: string, value: unknown) {
  if (process.env.LEVEL_FOUR_M9_REPORT === "1") writeFileSync(new URL(`${name}.json`, scratch), `${JSON.stringify(value, null, 2)}\n`);
}
function pairAndReservationProblems(state: GameState): string[] {
  const problems: string[] = [];
  const rooms = new Set(state.rooms.map(room => room.id));
  const employees = new Set(state.employees.map(employee => employee.id));
  const claimedEmployees = new Map<string, string>();
  for (const op of state.serviceOperations) {
    for (const id of [...op.reservedRoomInstanceIds, ...op.transitionHeldRoomInstanceIds ?? []])
      if (!rooms.has(id)) problems.push(`${op.id}: orphan room ${id}`);
    for (const id of op.reservedEmployeeIds) {
      if (!employees.has(id)) problems.push(`${op.id}: orphan employee ${id}`);
      const prior = claimedEmployees.get(id);
      if (prior && prior !== op.id) problems.push(`${id}: reserved by ${prior} and ${op.id}`);
      claimedEmployees.set(id, op.id);
    }
    if (op.providerReservation?.kind === "employee" && !employees.has(op.providerReservation.employeeId))
      problems.push(`${op.id}: orphan provider ${op.providerReservation.employeeId}`);
  }
  for (const family of Object.values(state.pediatricFamilies ?? {})) {
    // Departed tombstones intentionally outlive archived actors; only live
    // reservations and families require current actors (persistence.ts:238).
    if (family.phase === "departed" && !family.reservation) continue;
    const child = family.child.kind === "encounter" ? state.encounters[family.child.id]?.patientLocation :
      state.serviceOperations.find(op => op.id === family.child.id)?.location;
    const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
    if (!parent) { problems.push(`${family.id}: missing parent`); continue; }
    if ((child == null) !== (parent.location == null) || pediatricRoomAtPoint(state, PROTOTYPE_DOMAIN_CONTEXT, child ?? null)?.id !==
      pediatricRoomAtPoint(state, PROTOTYPE_DOMAIN_CONTEXT, parent.location)?.id) problems.push(`${family.id}: split rooms`);
    if (family.reservation && !rooms.has(family.reservation.roomInstanceId)) problems.push(`${family.id}: orphan pair room`);
    if (family.reservation?.parentSeatId?.startsWith("kid")) problems.push(`${family.id}: parent on child-only stool`);
  }
  for (const encounter of Object.values(state.encounters))
    for (const id of [encounter.assignedRoomInstanceId, encounter.queuedCareRoomInstanceId])
      if (id && !rooms.has(id)) problems.push(`${encounter.id}: orphan scored room ${id}`);
  for (const employee of state.employees) {
    if (employee.homeRoomInstanceId && !rooms.has(employee.homeRoomInstanceId)) problems.push(`${employee.id}: orphan home`);
    if (employee.training?.roomInstanceId && !rooms.has(employee.training.roomInstanceId)) problems.push(`${employee.id}: orphan training room`);
  }
  return problems;
}

/** Parked idle staff are allowed; active work must move, count down, or see its actual blocker advance. */
function actorProgress(state: GameState): Map<string, string> {
  const values = new Map<string, string>();
  const remaining = (end: number | null | undefined) => end == null ? null : Math.max(0, end - state.facilityTick);
  const employeeProgress = state.employees.map(employee => [employee.id, employee.location, employee.pathIndex,
    employee.training?.stage, employee.training?.remainingMinutes, employee.trainingLevel, employee.facilityTask?.workMinutesRemaining]);
  const operationProgress = state.serviceOperations.filter(op => op.status !== "completed" && op.status !== "cancelled")
    .map(op => [op.id, op.status, op.location, op.pathIndex, op.phaseIndex, remaining(op.phaseEndsAtFacilityTick),
      op.diagnosticTiming?.phases.map(phase => [phase.status, phase.remainingMinutes])]);
  const resourceRooms = (op: GameState["serviceOperations"][number]): string[] => {
    if (op.incomeLineId === "income.app_consult") return ["room.examination"];
    if (op.incomeLineId === "income.pediatric_consult") return ["room.pediatric_examination"];
    if (["income.wound_care", "income.ostomy_support"].includes(op.incomeLineId)) return ["room.wound_ostomy"];
    if (op.incomeLineId === "income.mri") return ["room.mri", "room.reading"];
    return op.frozenOperationPhases?.map(phase => phase.roomDefinitionId).filter((id): id is string => id !== null) ?? [];
  };
  for (const op of state.serviceOperations) {
    if (op.location === null || ["completed", "cancelled"].includes(op.status)) continue;
    const queued = ["waiting_for_resources", "waiting_for_next_phase", "waiting_for_results"].includes(op.status);
    const definitions = resourceRooms(op);
    const relatedRooms = state.rooms.filter(room => definitions.includes(room.roomDefinitionId));
    const roomIds = new Set(relatedRooms.map(room => room.id));
    const blockers = state.serviceOperations.filter(other => other.id !== op.id &&
      (other.createdAtFacilityTick <= op.createdAtFacilityTick || other.status === "in_service") &&
      (resourceRooms(other).some(definition => definitions.includes(definition)) ||
        other.diagnosticPhaseWork?.orderId === op.diagnosticTiming?.orderId && Boolean(op.diagnosticTiming)));
    const blockerIds = new Set(blockers.map(other => other.id));
    const relatedEmployees = state.employees.filter(employee => op.clinicVisit && employee.staffRoleDefinitionId === "staff.app" || roomIds.has(employee.homeRoomInstanceId ?? "") ||
      employee.facilityTask?.targetId && roomIds.has(employee.facilityTask.targetId));
    for (const employee of relatedEmployees) if (employee.facilityTask?.targetId) blockerIds.add(employee.facilityTask.targetId);
    const employeeIds = new Set(relatedEmployees.map(employee => employee.id));
    values.set(op.id, JSON.stringify([op.status, op.location, op.pathIndex, op.phaseIndex, remaining(op.phaseEndsAtFacilityTick),
      op.diagnosticTiming?.phases.map(phase => [phase.status, phase.remainingMinutes]),
      queued ? [employeeProgress.filter(row => employeeIds.has(row[0] as string)),
        operationProgress.filter(row => blockerIds.has(row[0] as string)),
        relatedRooms.map(room => [room.id, room.maintenance])] : null]));
  }
  for (const employee of [...state.employees, ...state.departingEmployees ?? []]) {
    if (employee.pathIndex >= employee.path.length - 1 && !employee.training && !employee.facilityTask) continue;
    values.set(employee.id, JSON.stringify([employee.location, employee.pathIndex, employee.training?.stage,
      employee.training?.remainingMinutes, employee.trainingLevel, employee.facilityTask?.workMinutesRemaining,
      employee.facilityTask?.targetId ? operationProgress.filter(row => row[0] === employee.facilityTask!.targetId) : null]));
  }
  for (const encounter of Object.values(state.encounters)) {
    if (!encounter.patientLocation) continue;
    values.set(encounter.id, JSON.stringify([encounter.lifecycle, encounter.checkInStatus, encounter.currentNodeIndex,
      encounter.answers.length, encounter.patientLocation, encounter.patientMovement?.pathIndex,
      encounter.pendingResult ? remaining(encounter.pendingResult.dueTick) : null,
      encounter.patientMovement?.destinationRoomInstanceId, state.openChartEncounterId]));
  }
  for (const family of Object.values(state.pediatricFamilies ?? {})) {
    if (family.phase === "departed") continue;
    const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
    values.set(family.parentActorId, JSON.stringify([family.phase, parent?.location, family.movement?.pathIndex,
      values.get(family.child.id)]));
  }
  for (const actor of state.retailExternalActors) {
    if (actor.pediatricFamilyId || actor.lifecycle === "departed" ||
      actor.pathIndex >= actor.path.length - 1 && !actor.activeRetailOperationId) continue;
    values.set(actor.id, JSON.stringify([actor.lifecycle, actor.location, actor.pathIndex,
      actor.activeRetailOperationId ? values.get(actor.activeRetailOperationId) : null]));
  }
  const founder = state.environment.founderActivity;
  if (founder && (founder.pathIndex < founder.path.length - 1 || founder.workMinutesRemaining > 0))
    values.set("founder", JSON.stringify([state.environment.founderLocation, founder.kind, founder.pathIndex,
      founder.workMinutesRemaining, values.get(founder.targetId)]));
  for (const actor of state.environment.ambientPedestrians)
    if (actor.pathIndex < actor.path.length - 1) values.set(actor.id, JSON.stringify([actor.pathIndex]));
  return values;
}

describe("Level 4 M9 integrated launch", () => {
  it("takes one fresh campaign through the ordinary Level 1 -> 2 -> 3 -> 4 reducers with fixture-earned earlier gates", () => {
    // Compress earlier already-tested play with the accepted progression fixture;
    // retain the fresh campaign/founder, real builds, hires, gates and advances.
    let state = createInitialGameState(undefined, { campaignId: "campaign.m9.fresh", campaignSeed: "m9.fresh", createdAtRealMs: 0 });
    const earned = createLevelThreeReadyQaState();
    state.encounters = structuredClone(earned.encounters);
    state.facilityTick = earned.facilityTick;
    state.nextFinancialPostingTick = earned.nextFinancialPostingTick;
    state.cash = 30000; state.cashCents = 3000000;
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    const apply = (command: Parameters<typeof m9Apply>[1], id: string) => { state = m9Apply(state, command, `fresh.${id}`); };
    // Ordinary Level-0 graduation, using the existing two completed tutorial fixtures.
    apply({ type: "PLACE_ROOM", roomId: "room.m9.fresh.exam", roomDefinitionId: "room.examination", x: 34, y: 26 }, "exam");
    apply({ type: "PLACE_DOOR", doorId: "door.m9.fresh.exam", roomId: "room.m9.fresh.exam", side: "south", offset: 1 }, "exam.door");
    apply({ type: "LEVEL_UP" }, "graduate");
    expect(state.facilityLevel).toBe(1);
    for (let x = 23; x <= 32; x++) apply({ type: "PLACE_ROOM", roomId: `room.fresh.hall.${x}`,
      roomDefinitionId: "room.hallway", x, y: 27 }, `hall.${x}`);
    for (let x = 23; x <= 32; x++) apply({ type: "PLACE_ROOM", roomId: `room.fresh.hall.upper.${x}`,
      roomDefinitionId: "room.hallway", x, y: 26 }, `hall.upper.${x}`);
    apply({ type: "PLACE_ROOM", roomId: "room.fresh.hall.front", roomDefinitionId: "room.hallway", x: 32, y: 28 }, "hall.front");
    apply({ type: "PLACE_DOOR", doorId: "door.fresh.front", roomId: "room.instance.founder_desk", side: "west", offset: 0 }, "front.door");
    for (const [definition, id, x, y, offset] of [
      ["room.ultrasound", "us", 23, 23, 2], ["room.minor_procedure", "minor", 28, 23, 1],
      ["room.waiting", "waiting", 23, 28, 2], ["room.bathroom", "bathroom", 29, 28, 1],
    ] as const) {
      apply({ type: "PLACE_ROOM", roomId: `room.fresh.${id}`, roomDefinitionId: definition, x, y }, id);
      apply({ type: "PLACE_DOOR", doorId: `door.fresh.${id}`, roomId: `room.fresh.${id}`, side: id === "waiting" || id === "bathroom" ? "north" : "south", offset }, `${id}.door`);
    }
    apply({ type: "HIRE_STAFF", employeeId: "employee.fresh.tech", staffRoleDefinitionId: "staff.imaging_technician" }, "tech");
    state.clinicalXp = 150;
    expect(getFacilityProgressionStatus(state).eligible).toBe(true);
    apply({ type: "LEVEL_UP" }, "to-two");
    expect(state.facilityLevel).toBe(2); expect(state.clinicalXp).toBe(0);
    state.clinicalXp = 300;
    // Existing Level-2 progression receipt shape, not a new clinical fixture.
    state.serviceIncomeReceipts.push({ id: "receipt.fresh.scope", transactionKey: "receipt.fresh.scope", incomeLineId: "income.endoscopy",
      catalogVersion: 1, routeId: "route.colonoscopy.in_house", actorKind: "patient", actorId: Object.keys(state.encounters)[0]!,
      grossAmount: 450, stockCost: 0, netCashDelta: 450, completedAtFacilityTick: 10 });
    expect(getFacilityProgressionStatus(state).eligible).toBe(true);
    apply({ type: "LEVEL_UP" }, "to-three");
    expect(state.facilityLevel).toBe(3); expect(state.clinicalXp).toBe(0);
    apply({ type: "PLACE_ROOM", roomId: "room.fresh.pharmacy", roomDefinitionId: "room.pharmacy", x: 31, y: 23 }, "pharmacy");
    apply({ type: "PLACE_DOOR", doorId: "door.fresh.pharmacy", roomId: "room.fresh.pharmacy", side: "south", offset: 1 }, "pharmacy.door");
    apply({ type: "HIRE_STAFF", employeeId: "employee.fresh.pharmacist", staffRoleDefinitionId: "staff.pharmacist" }, "pharmacist");
    state.clinicalXp = earned.clinicalXp;
    expect(getFacilityProgressionStatus(state).requirements.find(goal => goal.id === "progression.clinical_xp")?.met).toBe(false);
    state.clinicalXp = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.stageDefinitions.find(stage => stage.level === 3)!.minimumClinicalXp;
    state.serviceIncomeReceipts.push(...structuredClone(earned.serviceIncomeReceipts));
    const before = structuredClone(state);
    expect(getFacilityProgressionStatus(state).eligible).toBe(true);
    apply({ type: "LEVEL_UP" }, "to-four");
    expect(state.facilityLevel).toBe(4); expect(state.clinicalXp).toBe(0);
    for (const key of ["campaignId", "founder", "rooms", "employees", "cashCents", "encounters", "serviceIncomeReceipts", "learningHistories"] as const)
      expect(state[key], key).toEqual(before[key]);
    expect(state.events.filter(event => event.type === "facility_level_advanced").map(event => event.id)).toHaveLength(4);
    expect(gameReducer(state, { type: "LEVEL_UP", operationId: "fresh.to-four" })).toBe(state);
    expect(deserializeGameState(serializeGameState(state)).facilityLevel).toBe(4);
  });

  it("loads a frozen synthetic pre-M3 Level 3 save, advances once without replay/rehire, and creates no phantom specialty state", () => {
    const fixtureUrl = new URL("../../../tests/fixtures/level-four-legacy-pre-m3.json", import.meta.url);
    const raw = JSON.parse(readFileSync(fixtureUrl, "utf8"));
    expect(raw.facilityLevel).toBe(3);
    expect(raw.pediatricFamilies).toBeUndefined(); expect(raw.levelFourCompletion).toBeUndefined();
    const state = deserializeGameState(JSON.stringify(raw));
    const before = structuredClone(state);
    expect(getFacilityProgressionStatus(state).eligible).toBe(true);
    const advanced = m9Apply(state, { type: "LEVEL_UP" }, "m9.legacy.advance");
    expect(advanced.facilityLevel).toBe(4); expect(advanced.clinicalXp).toBe(0);
    for (const key of ["cashCents", "rooms", "employees", "encounters", "settlements", "serviceIncomeReceipts", "learningHistories", "reviewIntents"] as const)
      expect(advanced[key], key).toEqual(before[key]);
    const restored = deserializeGameState(serializeGameState(advanced));
    expect(restored.rooms.some(room => ["room.mri", "room.pediatric_examination", "room.pediatric_waiting", "room.wound_ostomy"].includes(room.roomDefinitionId))).toBe(false);
    expect(restored.pediatricFamilies).toBeUndefined(); expect(restored.levelFourCompletion?.pediatricVisitWithParent).toBeFalsy();
    expect(restored.levelFourCompletion?.woundOstomyCareVisit).toBeFalsy();
    expect(restored.events.filter(event => event.type === "facility_level_advanced")).toHaveLength(1);
    expect(gameReducer(restored, { type: "LEVEL_UP", operationId: "m9.legacy.advance" })).toBe(restored);
  });

  it("runs a mixed real Level 4 clinic for 24 hours with chart arrivals, training, upgrade, mid-care sale, queues and ledger invariants", () => {
    const context = m9ShortChartContext();
    let state = createLevelFourIntegrationState("level-four-m9-mixed", context);
    state.nextRoutineArrivalTick = 1;
    // One explicit admitted real draft guarantees pediatric scored coverage;
    // Normal admission stays enabled; the two-case pool and real FSRS still
    // decide when another scored encounter is eligible.
    state = m9Apply(state, { type: "ADMIT_PATIENT", encounterId: "encounter.m9.pediatric", caseId: M9_PEDIATRIC_CASE_ID,
      patientDisplayName: "Noah Bennett", arrivalClass: "routine" }, "m9.mixed.pediatric", context);
    const opening = structuredClone(state);
    const openingTotals = getServiceIncomeTotalsCents(state);
    const seenReceipts = new Map<string, string>();
    const receiptCounts: Record<string, number> = {};
    const stuck: string[] = [], reservationProblems: string[] = [];
    const progress = new Map<string, { value: string; tick: number }>();
    const trainingStages = new Set<string>(), scoredIds = new Set<string>();
    let largestQueue = 0, trained = false, upgraded = false, soldId: string | null = null;
    let saleRefund = 0, commandCosts = 0, scheduledLearningChanges = 0;
    for (let minute = 0; minute < 24 * 60; minute++) {
      const learningBefore = structuredClone(m9Learning(state));
      state = m9Minute(state, context);
      if (JSON.stringify(m9Learning(state)) !== JSON.stringify(learningBefore)) scheduledLearningChanges++;
      for (let decision = 0; decision < 3; decision++) state = m9PumpChart(state, context);
      for (const encounter of Object.values(state.encounters)) scoredIds.add(encounter.id);
      const app = state.employees.find(employee => employee.id === "employee.economy.wound")!;
      if (app.training) trainingStages.add(app.training.stage);
      if (app.trainingLevel === 2 && !app.training) trainingStages.add("returned");
      const wound = state.serviceOperations.find(op => op.incomeLineId === "income.wound_care" && op.status === "in_service");
      if (!trained && wound && minute > 60) {
        const cash = state.cashCents;
        state = m9Apply(state, { type: "TRAIN_EMPLOYEE", employeeId: app.id }, "m9.mixed.train", context);
        commandCosts += cash - state.cashCents; trained = true;
      }
      if (!upgraded && minute >= 240) {
        const cash = state.cashCents;
        state = m9Apply(state, { type: "UPGRADE_ROOM", roomId: M9_ROOMS.wound }, "m9.mixed.upgrade", context);
        commandCosts += cash - state.cashCents; upgraded = true;
      }
      const pediatric = state.serviceOperations.find(op => op.clinicVisit?.kind === "pediatric_consult" && op.status === "in_service" &&
        op.reservedRoomInstanceIds.includes(M9_ROOMS.pediatric));
      if (!soldId && minute >= 480 && pediatric) {
        soldId = pediatric.id;
        saleRefund = Math.round(getRoomResaleValue(state, M9_ROOMS.pediatric, context)! * 100);
        state = m9SellRoom(state, M9_ROOMS.pediatric, "m9.mixed.sale", context);
      }
      largestQueue = Math.max(largestQueue, state.serviceOperations.filter(op => ["waiting_for_resources", "waiting_for_next_phase"].includes(op.status)).length);
      reservationProblems.push(...pairAndReservationProblems(state).map(problem => `${state.facilityTick}: ${problem}`));
      const active = actorProgress(state);
      for (const [id, value] of active) {
        const prior = progress.get(id);
        if (!prior || prior.value !== value) progress.set(id, { value, tick: state.facilityTick });
        else if (state.facilityTick - prior.tick === 61) stuck.push(`${id}: no progress ${prior.tick}-${state.facilityTick}`);
      }
      for (const id of progress.keys()) if (!active.has(id)) progress.delete(id);
      for (const receipt of state.serviceIncomeReceipts) {
        const prior = seenReceipts.get(receipt.transactionKey);
        if (prior) expect(JSON.stringify(receipt)).toBe(prior);
        else {
          seenReceipts.set(receipt.transactionKey, JSON.stringify(receipt));
          receiptCounts[receipt.incomeLineId] = (receiptCounts[receipt.incomeLineId] ?? 0) + 1;
        }
      }
      expect(new Set(state.serviceIncomeReceipts.map(receipt => receipt.transactionKey)).size).toBe(state.serviceIncomeReceipts.length);
      const income = getServiceIncomeTotalsCents(state).netCashDeltaCents - openingTotals.netCashDeltaCents;
      const settlement = state.settlements.reduce((sum, receipt) => sum + Math.round(receipt.netCashDelta * 100), 0) -
        opening.settlements.reduce((sum, receipt) => sum + Math.round(receipt.netCashDelta * 100), 0);
      expect(state.cashCents, `cash ledger at ${state.facilityTick}`).toBe(opening.cashCents + income + settlement -
        Math.round((state.totalOperatingExpenses - opening.totalOperatingExpenses) * 100) - commandCosts + saleRefund);
    }
    const summary = { hours: 24, closingTick: state.facilityTick, receiptCounts, scoredIds: [...scoredIds], trainingStages: [...trainingStages],
      largestQueue, soldVisitId: soldId, stuck, reservationProblems, scheduledLearningChanges,
      openingCashCents: opening.cashCents, closingCashCents: state.cashCents, commandCosts, saleRefund,
      totalOperatingExpenses: state.totalOperatingExpenses, serviceTotals: getServiceIncomeTotalsCents(state) };
    report("mixed-clinic", summary);
    report("mixed-clinic-state", state);
    expect(trained && upgraded && soldId !== null).toBe(true);
    expect(trainingStages).toEqual(new Set(["queued", "walking_to_training", "training", "returning", "returned"]));
    expect(largestQueue).toBeGreaterThan(0);
    expect(scoredIds.size).toBeGreaterThanOrEqual(2);
    for (const line of ["income.mri", "income.radiologist_in_house_read", "income.app_consult", "income.pediatric_consult", "income.wound_care", "income.ostomy_support"])
      expect(receiptCounts[line], line).toBeGreaterThan(0);
    expect(scheduledLearningChanges).toBe(0);
    expect(reservationProblems).toEqual([]); expect(stuck).toEqual([]);
  }, hostedTime(120_000));

  it("retains real witnesses and historical terminal completion at explicit legacy cap 4", () => {
    const context = createPreLevelFiveLaunchContext();
    let state = createLevelFourIntegrationState("level-four-m9-terminal", context);
    state.clinicalXp = 750;
    state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    state = m9Until(state, value => getFacilityProgressionStatus(value, context).terminalComplete, context);
    expect(state.levelFourCompletion?.pediatricVisitWithParent?.serviceOperationId).toBeTruthy();
    expect(state.levelFourCompletion?.woundOstomyCareVisit?.serviceOperationId).toBeTruthy();
    for (const witness of [state.levelFourCompletion!.pediatricVisitWithParent!, state.levelFourCompletion!.woundOstomyCareVisit!])
      expect(state.serviceOperations.find(op => op.id === witness.serviceOperationId)?.completedAtFacilityTick).toBe(witness.completedAtFacilityTick);
    const completion = structuredClone(state.levelFourCompletion);
    const learning = structuredClone(m9Learning(state));
    state = m9Apply(state, { type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: false }, "m9.terminal.demand-off", context);
    state = m9SellRoom(state, M9_ROOMS.wound, "m9.terminal.sell", context);
    for (let reload = 0; reload < 3; reload++) {
      state = deserializeGameState(serializeGameState(state), context);
      for (let i = 0; i < 20; i++) state = m9Minute(state, context);
      const cash = state.cashCents;
      state = gameReducer(state, { type: "LEVEL_UP", operationId: `m9.terminal.no-five.${reload}` }, context);
      expect(state.cashCents).toBe(cash);
      expect(state.facilityLevel).toBe(4);
      expect(state.levelFourCompletion).toEqual(completion);
      expect(m9Learning(state)).toEqual(learning);
      expect(getFacilityProgressionStatus(state, context)).toMatchObject({ eligible: false, nextFacilityLevel: null, terminalComplete: true });
      expect(state.events.filter(event => event.id === "event.facility-level-4-complete")).toHaveLength(1);
      expect(state.events.find(event => event.id === "event.facility-level-4-complete")?.reward).toBeUndefined();
    }
    report("terminal", { completion, roomSold: M9_ROOMS.wound, reloads: 3, closingTick: state.facilityTick });
  }, hostedTime(30_000));

  it("preserves arrival count/times and flow-explained scored selections for 24 hours with APPs on/off", () => {
    let on = createLevelFourIntegrationState("level-four-m9-fairness");
    on.nextRoutineArrivalTick = 1;
    let off = m9DeferAppDemand(structuredClone(on));
    type SelectionCall = {
      state: GameState; cases: Parameters<typeof clinicalSelection.selectRoutineClinicalCase>[1]; at: number;
      selected: NonNullable<ReturnType<typeof clinicalSelection.selectRoutineClinicalCase>>;
    };
    const calls = { on: new Map<string, SelectionCall>(), off: new Map<string, SelectionCall>() };
    const onArrivals = new Map<string, readonly [string, string, number]>(), offArrivals = new Map<string, readonly [string, string, number]>();
    const ended = { on: new Map<string, { encounter: GameState["encounters"][string]; tick: number }>(),
      off: new Map<string, { encounter: GameState["encounters"][string]; tick: number }>() };
    let side: "on" | "off" = "on";
    const select = clinicalSelection.selectRoutineClinicalCase;
    // Observe genuine pre-admission inputs, after tick-internal walking/decay.
    // A previous-tick or post-admission approximation misses walkout commitment.
    const observer = vi.spyOn(clinicalSelection, "selectRoutineClinicalCase").mockImplementation((state, cases, at) => {
      const selected = select(state, cases, at);
      if (selected && selected.clinicalCase.participant?.kind !== "employee_discussion") {
        const id = `encounter.auto.${state.facilityLevel}.${state.routineArrivalSequence}`;
        expect(calls[side].has(id), `duplicate selection for ${side}/${id}`).toBe(false);
        calls[side].set(id, { state: structuredClone(state), cases, at, selected });
      }
      return selected;
    });
    try {
      for (let minute = 0; minute < 1440; minute++) {
        side = "on"; on = m9Minute(on);
        side = "off"; off = m9Minute(m9DeferAppDemand(off));
        // Preserve the actual earlier departure witness before retirement.
        // A held consult can outlive its counterpart's entire retained chart.
        for (const [state, history] of [[on, ended.on], [off, ended.off]] as const)
          for (const e of Object.values(state.encounters)) if (!history.has(e.id) &&
            (e.resolutionReason !== null || e.patientMovement?.kind === "leaving_after_walkout")) history.set(e.id, { encounter: structuredClone(e), tick: state.facilityTick });
        for (const [state, arrivals, observed] of [[on, onArrivals, calls.on], [off, offArrivals, calls.off]] as const)
          for (const encounter of Object.values(state.encounters)) if (!arrivals.has(encounter.id)) {
            expect(observed.has(encounter.id), `unobserved arrival ${encounter.id}`).toBe(true);
            arrivals.set(encounter.id, [encounter.frozenCase.id, encounter.arrivalClass, encounter.waiting.arrivedAtTick]);
          }
      }
    } finally {
      observer.mockRestore();
    }
    expect(onArrivals.size).toBeGreaterThan(1);
    expect(onArrivals.size).toBe(offArrivals.size);
    expect([...onArrivals].map(([id, tuple]) => [id, tuple[1], tuple[2]]))
      .toEqual([...offArrivals].map(([id, tuple]) => [id, tuple[1], tuple[2]]));
    expect([...calls.on.keys()]).toEqual([...onArrivals.keys()]);
    expect([...calls.off.keys()]).toEqual([...offArrivals.keys()]);

    const concepts = (clinicalCase: SelectionCall["cases"][number]) => [...new Set(clinicalCase.decisionNodes.map(node => node.primaryConceptId))];
    const reserves = (encounter: GameState["encounters"][string]) => encounter.resolutionReason === null &&
      encounter.patientMovement?.kind !== "leaving_after_walkout";
    const reservation = (encounter: GameState["encounters"][string] | undefined) => encounter && reserves(encounter) ? concepts(encounter.frozenCase).sort() : [];
    const pools = ({ state, cases, at }: SelectionCall) => {
      const active = new Set(Object.values(state.encounters).flatMap(reservation));
      const compatible = [...cases].sort((a, b) => a.id.localeCompare(b.id)).filter(clinicalCase => concepts(clinicalCase).every(id => {
        const history = state.learningHistories[id];
        return !active.has(id) && (!history?.reviews.length || history.card.dueAtMs <= at);
      }));
      const available = [...new Set(compatible.flatMap(concepts))].sort((a, b) => a.localeCompare(b));
      const due = available.filter(id => state.learningHistories[id]?.reviews.length && state.learningHistories[id]!.card.dueAtMs <= at);
      const earliest = Math.min(...due.map(id => state.learningHistories[id]!.card.dueAtMs));
      return { active: [...active].sort(), cases: compatible.map(clinicalCase => clinicalCase.id),
        kind: due.length ? "due_review" : "new_concept",
        concepts: due.length ? due.filter(id => state.learningHistories[id]!.card.dueAtMs === earliest) :
          available.filter(id => !state.learningHistories[id]?.reviews.length) };
    };
    const result = (selected: ReturnType<typeof select>) => selected && [selected.clinicalCase.id, selected.selectedConceptId, selected.kind];
    const explainedIdentities = new Set<string>();
    const flowDifferences: { id: string; tick: number; witnesses: { encounterId: string; cause: string }[] }[] = [];
    const sourceContext = (call: SelectionCall) => {
      const discussions = new Set(Object.values(call.state.employeeDiscussions ?? {}).filter(d => !["resolved", "cancelled"].includes(d.lifecycle))
        .flatMap(d => d.frozenCase.decisionNodes.map(n => n.primaryConceptId)));
      const offer = selectClinicConsult(call.state, PROTOTYPE_DOMAIN_CONTEXT, call.at, discussions, true)
        ?? selectProcedureConsult(call.state, PROTOTYPE_DOMAIN_CONTEXT, call.at, discussions)
        ?? selectClinicConsult(call.state, PROTOTYPE_DOMAIN_CONTEXT, call.at, discussions);
      if (!offer) return null;
      const op = offer.operation;
      expect(op.actorKind).toBe("visitor"); expect(op.status).toBe("in_service");
      expect(op.reservedRoomInstanceIds).toContain(offer.roomId);
      expect(result(offer.selection)).toEqual(result(call.selected));
      const capabilities = new Set(getCurrentCapabilities(call.state));
      for (const id of offer.kind === "endoscopy" ? ["capability.endoscopy", "capability.periop_recovery"]
        : offer.kind === "operation" ? ["capability.ambulatory_or", "capability.staff.or_nurse", "capability.periop_recovery"] : ["capability.staff.app"]) capabilities.add(id);
      const parent = call.state.retailExternalActors.find(actor => actor.id === pediatricFamilyForActor(call.state, "service_visitor", op.id)?.parentActorId);
      // Every admitted candidate must belong to this actual person's published
      // context. No arbitrary pool difference can use the APP exception.
      const expected = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => c.routineEligible &&
        (["endoscopy", "operation"].includes(offer.kind) ? procedureConsultKind(c) === offer.kind : clinicCaseMatchesLine(c, op.incomeLineId)) &&
        (!c.pediatricProfile || getPediatricClinicFamilyContext(c)?.parentName === parent?.displayName) &&
        getClinicalCaseEligibilityIssue(call.state, c, PROTOTYPE_DOMAIN_CONTEXT, capabilities) === null &&
        compatibleConsultProfile(c, op) !== undefined && c.decisionNodes.every(n => !discussions.has(n.primaryConceptId)));
      expect(call.cases.map(c => c.id)).toEqual(expected.map(c => c.id));
      expect(op.providerReservation).not.toBeNull();
      return op.id;
    };
    let identicalInputs = 0, identicalIdentities = 0;
    let replayedInputs = 0;
    for (const [id, arrival] of onArrivals) {
      const left = calls.on.get(id)!, right = calls.off.get(id)!;
      const label = `${id} at tick ${arrival[2]}`;
      // RNG purposes, learning and the underlying clinical release remain
      // identical. An actual in-care consult can narrow the candidate pool to
      // that existing person's published context, as the owner now requires.
      const common = (call: SelectionCall) => [call.state.campaignSeed, call.state.randomGeneratorVersion,
        call.state.routineArrivalSequence, call.state.facilityTick, call.at, call.state.learningHistories];
      expect(common(left), label).toEqual(common(right));
      for (const call of [left, right]) {
        const unrelatedTraffic = { ...call.state, serviceOperationSequence: call.state.serviceOperationSequence + 1009,
          retailOperationSequence: call.state.retailOperationSequence + 1013 };
        expect(result(select(unrelatedTraffic, call.cases, call.at)), `unrelated RNG traffic: ${label}`).toEqual(result(call.selected));
      }
      replayedInputs++;
      for (const call of [left, right]) for (const c of call.cases) expect(c, c.id).toEqual(PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(original => original.id === c.id));
      expect(result(left.selected)?.[0], label).toBe(arrival[0]);
      expect(result(right.selected)?.[0], label).toBe(offArrivals.get(id)![0]);
      if (JSON.stringify(left.cases) !== JSON.stringify(right.cases)) {
        const a = sourceContext(left), b = sourceContext(right);
        expect(a || b, `candidate pool changed without a real consult source: ${label}`).toBeTruthy();
        for (const [call, source] of [[left, a], [right, b]] as const) if (!source) {
          const expected = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(c => !c.participant && c.routineEligible &&
            getClinicalCaseEligibilityIssue(call.state, c, PROTOTYPE_DOMAIN_CONTEXT) === null).sort((a, b) => a.id.localeCompare(b.id));
          expect(call.cases.map(c => c.id), label).toEqual(expected.map(c => c.id));
        }
        flowDifferences.push({ id, tick: arrival[2], witnesses: [{ encounterId: a ?? b!, cause: "actual in-care patient presentation restricts the consult pool" }] });
        if (arrival[0] !== offArrivals.get(id)![0]) explainedIdentities.add(id);
        else identicalIdentities++;
        continue;
      }
      const leftPools = pools(left), rightPools = pools(right);
      if (JSON.stringify(leftPools) === JSON.stringify(rightPools)) {
        identicalInputs++;
        expect(result(left.selected), `identical selection inputs: ${label}`).toEqual(result(right.selected));
      } else {
        const witnesses: { encounterId: string; cause: string }[] = [];
        const leftCounterfactual = { ...left.state, encounters: { ...left.state.encounters } };
        const rightCounterfactual = { ...right.state, encounters: { ...right.state.encounters } };
        for (const encounterId of new Set([...Object.keys(left.state.encounters), ...Object.keys(right.state.encounters)])) {
          const a = left.state.encounters[encounterId] ?? ended.on.get(encounterId)?.encounter;
          const b = right.state.encounters[encounterId] ?? ended.off.get(encounterId)?.encounter;
          // An archived terminal chart and a retained terminal chart both
          // reserve nothing. Their retirement timing is not a selection input.
          if (JSON.stringify(reservation(a)) === JSON.stringify(reservation(b))) continue;
          if (!a || !b) throw new Error(`Unmatched live flow witness ${encounterId}: ${label}`);
          if (!left.state.encounters[encounterId]) expect(ended.on.get(encounterId)!.tick, label).toBeLessThanOrEqual(left.state.facilityTick);
          if (!right.state.encounters[encounterId]) expect(ended.off.get(encounterId)!.tick, label).toBeLessThanOrEqual(right.state.facilityTick);
          for (const [encounter, captured] of [[a, calls.on.get(encounterId)], [b, calls.off.get(encounterId)]] as const) {
            expect(captured, `unobserved flow witness ${encounterId}`).toBeDefined();
            expect([encounter.frozenCase.id, concepts(encounter.frozenCase)], label)
              .toEqual([captured!.selected.clinicalCase.id, concepts(captured!.selected.clinicalCase)]);
          }
          expect([a.arrivalClass, a.waiting.arrivedAtTick, a.walkoutThreshold], label)
            .toEqual([b.arrivalClass, b.waiting.arrivedAtTick, b.walkoutThreshold]);
          if (a.frozenCase.id !== b.frozenCase.id) {
            // A prior, independently explained identity can reserve a different
            // concept later. It cannot bootstrap its own explanation.
            expect(explainedIdentities.has(encounterId), `unexplained prior identity ${encounterId}: ${label}`).toBe(true);
            witnesses.push({ encounterId, cause: "prior flow-explained selection" });
          } else {
            expect(concepts(a.frozenCase), label).toEqual(concepts(b.frozenCase));
            expect(reserves(a), `walkout reservation boundary: ${encounterId}`).not.toBe(reserves(b));
            const live = reserves(a) ? a : b, leaving = reserves(a) ? b : a;
            expect(leaving.resolutionReason === "walkout" || leaving.patientMovement?.kind === "leaving_after_walkout", label).toBe(true);
            expect(leaving.patientSatisfaction, label).toBeLessThanOrEqual(leaving.walkoutThreshold);
            if (live.consult?.closedAtFacilityTick === null) {
              const captured = reserves(a) ? left.state : right.state;
              const source = captured.serviceOperations.find(op => op.id === live.consult!.serviceOperationId);
              expect(source).toMatchObject({ actorKind: "encounter", actorId: live.id, consultEncounterId: live.id, status: "in_service" });
              expect(source!.reservedRoomInstanceIds).toContain(live.consult.roomInstanceId);
              expect(live.waiting.patienceExempt).toBe(true);
              witnesses.push({ encounterId, cause: "ongoing staffed consult retains its live concept" });
            } else {
              expect(live.patientSatisfaction, label).toBeGreaterThan(live.walkoutThreshold);
              witnesses.push({ encounterId, cause: "different walkout commitment" });
            }
          }
          leftCounterfactual.encounters[encounterId] = b;
          rightCounterfactual.encounters[encounterId] = a;
        }
        expect(witnesses.length, `missing patient-flow explanation: ${label}`).toBeGreaterThan(0);
        // Swapping only witnessed encounters must account for the entire pool
        // and the actual selector result, in both directions.
        expect(pools({ ...left, state: leftCounterfactual }), label).toEqual(rightPools);
        expect(pools({ ...right, state: rightCounterfactual }), label).toEqual(leftPools);
        expect(result(select(leftCounterfactual, left.cases, left.at)), label).toEqual(result(right.selected));
        expect(result(select(rightCounterfactual, right.cases, right.at)), label).toEqual(result(left.selected));
        flowDifferences.push({ id, tick: arrival[2], witnesses });
        if (left.selected.clinicalCase.id !== right.selected.clinicalCase.id) explainedIdentities.add(id);
      }
      if (left.selected.clinicalCase.id === right.selected.clinicalCase.id) identicalIdentities++;
    }
    expect(identicalInputs).toBeGreaterThan(0);
    // The prior release control's blanket on/off identity comparison predates
    // same-patient consults. Retain its 24-arrival proof and replay every set of
    // identical selection inputs; physical patient contexts are proved above.
    if (process.env.LEVEL_FOUR_M9_RELEASE_CONTROL === "1") {
      expect([onArrivals.size, offArrivals.size, replayedInputs]).toEqual([24, 24, 24]);
      if (flowDifferences.length === 0) expect([identicalInputs, identicalIdentities]).toEqual([24, 24]);
    }
    report("arrival-fairness", { hours: 24, mode: "APP clocks deferred only; global/MRI demand stays on", on: [...onArrivals], off: [...offArrivals],
      identicalInputs, identicalIdentities, replayedInputs, flowDifferences,
      mriReceipts: { on: on.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.mri").length,
        off: off.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.mri").length } });
    expect(m9Learning(on)).toEqual(m9Learning(off));
    for (const line of ["income.app_consult", "income.pediatric_consult", "income.wound_care", "income.ostomy_support"]) {
      if (on.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === line)) continue;
      const queued = on.serviceOperations.find(op => op.incomeLineId === line && ["arriving", "waiting_for_resources"].includes(op.status));
      const held = on.serviceOperations.find(op => (op.incomeLineId === line ||
        queued?.clinicVisit?.requestedRoomInstanceId && op.reservedRoomInstanceIds.includes(queued.clinicVisit.requestedRoomInstanceId)) &&
        op.consultEncounterId && on.encounters[op.consultEncounterId]?.consult?.closedAtFacilityTick === null && op.status === "in_service");
      // Wound and ostomy share one real room/provider: a held wound consult
      // legitimately queues ostomy work too. Both demand and its blocker exist.
      expect(held, `${line}: no receipt or actual held clinic`).toBeDefined();
      expect(held!.completedAtFacilityTick).toBeNull();
      expect(held!.providerReservation?.kind).toBe("employee");
      expect(on.employees.some(employee => employee.facilityTask?.targetId === held!.id)).toBe(true);
    }
    expect(off.serviceAppointmentsEnabled).toBe(true);
    expect(off.serviceIncomeReceipts.some(receipt => ["income.app_consult", "income.pediatric_consult", "income.wound_care", "income.ostomy_support"].includes(receipt.incomeLineId))).toBe(false);
    expect(on.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === "income.mri")).toBe(true);
    expect(off.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === "income.mri")).toBe(true);
  }, hostedTime(120_000));
});
