import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInitialGameState, deserializeGameState, gameReducer,
  getFacilityProgressionStatus, getRoomResaleValue, getServiceIncomeTotalsCents,
  pediatricRoomAtPoint, serializeGameState, type GameState,
} from "../src";
import { createLevelThreeReadyQaState } from "../../../tests/fixtures/level-four-progression";
import {
  createLevelFourIntegrationState, M9_PEDIATRIC_CASE_ID, M9_ROOMS, m9Apply, m9Learning,
  m9Minute, m9PumpChart, m9SellRoom, m9ShortChartContext, m9Until, m9DeferAppDemand,
} from "../../../tests/fixtures/level-four-integration";

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
    const relatedEmployees = state.employees.filter(employee => roomIds.has(employee.homeRoomInstanceId ?? "") ||
      employee.facilityTask?.targetId && roomIds.has(employee.facilityTask.targetId));
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
  }, 120_000);

  it("earns both Level 4 witnesses from real care, then keeps terminal completion through sale/reload without repeats", () => {
    let state = createLevelFourIntegrationState("level-four-m9-terminal");
    state.clinicalXp = 750;
    state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
    state = m9Until(state, value => getFacilityProgressionStatus(value).terminalComplete);
    expect(state.levelFourCompletion?.pediatricVisitWithParent?.serviceOperationId).toBeTruthy();
    expect(state.levelFourCompletion?.woundOstomyCareVisit?.serviceOperationId).toBeTruthy();
    for (const witness of [state.levelFourCompletion!.pediatricVisitWithParent!, state.levelFourCompletion!.woundOstomyCareVisit!])
      expect(state.serviceOperations.find(op => op.id === witness.serviceOperationId)?.completedAtFacilityTick).toBe(witness.completedAtFacilityTick);
    const completion = structuredClone(state.levelFourCompletion);
    const learning = structuredClone(m9Learning(state));
    state = m9Apply(state, { type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: false }, "m9.terminal.demand-off");
    state = m9SellRoom(state, M9_ROOMS.wound, "m9.terminal.sell");
    for (let reload = 0; reload < 3; reload++) {
      state = deserializeGameState(serializeGameState(state));
      for (let i = 0; i < 20; i++) state = m9Minute(state);
      const cash = state.cashCents;
      state = gameReducer(state, { type: "LEVEL_UP", operationId: `m9.terminal.no-five.${reload}` });
      expect(state.cashCents).toBe(cash);
      expect(state.facilityLevel).toBe(4);
      expect(state.levelFourCompletion).toEqual(completion);
      expect(m9Learning(state)).toEqual(learning);
      expect(getFacilityProgressionStatus(state)).toMatchObject({ eligible: false, nextFacilityLevel: null, terminalComplete: true });
      expect(state.events.filter(event => event.id === "event.facility-level-4-complete")).toHaveLength(1);
      expect(state.events.find(event => event.id === "event.facility-level-4-complete")?.reward).toBeUndefined();
    }
    report("terminal", { completion, roomSold: M9_ROOMS.wound, reloads: 3, closingTick: state.facilityTick });
  }, 30_000);

  it("preserves scored arrival count/times for 24 hours with APPs on/off (case identity: DEFECT-M9-2)", () => {
    let on = createLevelFourIntegrationState("level-four-m9-fairness");
    on.nextRoutineArrivalTick = 1;
    let off = m9DeferAppDemand(structuredClone(on));
    const onArrivals = new Map<string, unknown>(), offArrivals = new Map<string, unknown>();
    for (let minute = 0; minute < 1440; minute++) {
      on = m9Minute(on); off = m9Minute(m9DeferAppDemand(off));
      for (const [state, arrivals] of [[on, onArrivals], [off, offArrivals]] as const)
        for (const encounter of Object.values(state.encounters)) if (!arrivals.has(encounter.id))
          arrivals.set(encounter.id, [encounter.frozenCase.id, encounter.arrivalClass, encounter.waiting.arrivedAtTick]);
    }
    report("arrival-fairness", { hours: 24, mode: "APP clocks deferred only; global/MRI demand stays on", on: [...onArrivals], off: [...offArrivals],
      mriReceipts: { on: on.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.mri").length,
        off: off.serviceIncomeReceipts.filter(receipt => receipt.incomeLineId === "income.mri").length } });
    expect(onArrivals.size).toBeGreaterThan(1);
    // DEFECT-M9-2 below covers the failing full case-identity comparison. This
    // separate passing assertion proves cadence/count only, not case fairness.
    expect([...onArrivals].map(([id, tuple]) => [id, (tuple as unknown[])[2]]))
      .toEqual([...offArrivals].map(([id, tuple]) => [id, (tuple as unknown[])[2]]));
    expect(m9Learning(on)).toEqual(m9Learning(off));
    for (const line of ["income.app_consult", "income.pediatric_consult", "income.wound_care", "income.ostomy_support"])
      expect(on.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === line), line).toBe(true);
    expect(off.serviceAppointmentsEnabled).toBe(true);
    expect(off.serviceIncomeReceipts.some(receipt => ["income.app_consult", "income.pediatric_consult", "income.wound_care", "income.ostomy_support"].includes(receipt.incomeLineId))).toBe(false);
    expect(on.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === "income.mri")).toBe(true);
    expect(off.serviceIncomeReceipts.some(receipt => receipt.incomeLineId === "income.mri")).toBe(true);
  }, 120_000);
});
