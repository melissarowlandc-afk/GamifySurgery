import { readFileSync } from "node:fs";
// Entirely synthetic. Uses shipped geometry/content and fresh initializer data;
// never reads an owner export or the private profiling backup.
import {
  createInitialGameState, deserializeGameState, gameReducer, getDefaultDoorOffset, getNewPeriopServiceOperationPhases,
  getCurrentCapabilities, hasOutstandingDiagnosticWork, getRoomDefinition, getRoomNavigationAnchor, getStaffRoleDefinition, planDiagnosticOrder,
  PROTOTYPE_DOMAIN_CONTEXT, validateDoorPlacement,
  type DoorState, type EmployeeState, type EncounterState, type GameState, type ServiceOperationState,
} from "@gamify-surgery/game-domain";
import { getServiceIncomeLine } from "@gamify-surgery/balance-config";

export function createDiagnosticWorkload(): { state: GameState; chartId: string } {
  let state = createInitialGameState(PROTOTYPE_DOMAIN_CONTEXT, {
    campaignId: "campaign.synthetic.diagnostic-workload", campaignSeed: "diagnostic-workload", createdAtRealMs: 0,
  });
  const template = Object.values(state.encounters)[0]!;
  state.facilityLevel = 3; state.facilityTick = 6760; state.paused = false;
  state.cash = 100_000; state.cashCents = 10_000_000;
  state.serviceAppointmentsEnabled = false; state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  const front = { ...state.rooms[0]!, id: "room.instance.founder_desk", roomDefinitionId: "room.front_desk", x: 3, y: 28, orientation: 0 as const, doorSide: null };
  state.rooms = [front]; state.doors = [{ id: "synthetic.exterior", roomId: front.id, side: "south", offset: 2, exterior: true }];
  for (let x = 3; x <= 68; x++) state.rooms.push({ id: `synthetic.hall.${x}`, roomDefinitionId: "room.hallway", x, y: 26, orientation: 0, doorSide: null, upgradeLevel: 1 });
  for (let y = 21; y < 26; y++) state.rooms.push({ id: `synthetic.spine.${y}`, roomDefinitionId: "room.hallway", x: 68, y, orientation: 0, doorSide: null, upgradeLevel: 1 });
  for (let x = 3; x < 8; x++) state.rooms.push({ id: `synthetic.entry.${x}`, roomDefinitionId: "room.hallway", x, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1 });
  const definitions = ["examination", "waiting", "bathroom", "phlebotomy", "xray", "endoscopy", "periop_recovery", "ambulatory_or", "laboratory", "reading", "training", "staff_break", "evs_closet", "maintenance_workshop", "imaging_control", "ultrasound", "ct", "glp1_telehealth_suite", "pharmacy"];
  let x = 3;
  for (const name of definitions) {
    const definition = getRoomDefinition(`room.${name}`)!;
    state.rooms.push({ id: `synthetic.room.${name}`, roomDefinitionId: definition.id, x, y: 26 - definition.height, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    x += definition.width;
  }
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  const addDoor = (door: DoorState) => {
    if (!validateDoorPlacement(door, state.rooms, state.doors, getRoomDefinition, facility.gridWidth, facility.gridHeight, new Set(facility.protectedRoomDefinitionIds)).valid) return false;
    state.doors.push(door); return true;
  };
  for (const room of state.rooms.filter(room => room.roomDefinitionId !== "room.hallway")) {
    const definition = getRoomDefinition(room.roomDefinitionId)!;
    const side = room === front ? "north" : "south";
    let added = false;
    for (const offset of [getDefaultDoorOffset(room, definition, side), ...Array.from({ length: definition.width }, (_, i) => i)]) {
      if (addDoor({ id: `synthetic.door.${state.doors.length}`, roomId: room.id, side, offset, exterior: false })) { added = true; break; }
    }
    if (!added) throw new Error(`Synthetic room has no valid circulation door: ${room.roomDefinitionId}`);
  }
  outer: for (const room of state.rooms) for (const side of ["north", "east", "south", "west"] as const) for (let offset = 0; offset < 6; offset++) {
    if (state.doors.length === 41) break outer;
    addDoor({ id: `synthetic.door.${state.doors.length}`, roomId: room.id, side, offset, exterior: false });
  }
  if (state.doors.length !== 41) throw new Error("Synthetic workload requires 41 legal doors");
  // Aggregate role mix from the profiling report's approved read-only probe;
  // all employee records below are freshly generated synthetic records.
  const staff = [["receptionist", 1, "front_desk"], ["imaging_technician", 2, "xray"], ["phlebotomist", 1, "phlebotomy"],
    ["periop_nurse", 2, "periop_recovery"], ["endoscopist", 2, "endoscopy"], ["endoscopy_nurse", 2, "endoscopy"],
    ["glp1_np", 6, "glp1_telehealth_suite"], ["evs_worker", 1, "evs_closet"], ["pharmacist", 1, "pharmacy"],
    ["or_nurse", 1, "ambulatory_or"], ["surgeon", 1, "ambulatory_or"], ["radiologist", 4, "reading"],
    ["repair_person", 1, "maintenance_workshop"]] as const;
  state.employees = [];
  for (const [role, count, home] of staff) for (let i = 0; i < count; i++) {
    const definitionId = `staff.${role}`, roleDefinition = getStaffRoleDefinition(definitionId);
    if (!roleDefinition) throw new Error(`Unknown synthetic staff role ${definitionId}`);
    const room = home === "front_desk" ? front : state.rooms.find(room => room.id === `synthetic.room.${home}`)!;
    const location = getRoomNavigationAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "staff");
    state.employees.push({ id: `synthetic.employee.${state.employees.length}`, staffRoleDefinitionId: definitionId, displayName: `Synthetic employee ${state.employees.length}`,
      appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 80, trainingLevel: 1,
      homeRoomInstanceId: room.id, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null } satisfies EmployeeState);
  }
  const anchor = getRoomNavigationAnchor(front, getRoomDefinition(front.roomDefinitionId)!);
  state.environment.founderLocation = anchor; state.environment.founderActivity = null; state.environment.pendingFounderConsult = null;
  state.encounters = {};
  const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(entry => entry.id === "case.esophageal-dysphagia.bread-sticking")!;
  for (let i = 0; i < 3; i++) {
    const encounter: EncounterState = { ...structuredClone(template), id: `synthetic.encounter.${i}`, patientDisplayName: `Synthetic patient ${i}`,
      frozenCase: structuredClone(clinicalCase), arrivalClass: "routine", lifecycle: "active_action_required", checkInStatus: "checked_in",
      patientLocation: anchor, patientMovement: null, assignedRoomInstanceId: null, pendingResult: null, currentNodeIndex: 0,
      steps: clinicalCase.decisionNodes.map((node, nodeIndex) => ({ nodeIndex, decisionNodeId: node.id, questionVariantId: node.questionVariantId,
        primaryConceptId: node.primaryConceptId, status: nodeIndex ? "locked" : "action_required", answer: null, result: null })) };
    state.encounters[encounter.id] = encounter;
  }

  state.serviceOperations = [];
  for (let i = 0; i < 9; i++) {
    const line = ["income.ambulatory_operation", "income.endoscopy", "income.endoscopy", "income.endoscopy", "income.endoscopy", "income.advanced_endoscopy", "income.xray", "income.ultrasound", "income.collection"][i]!;
    const phases = getNewPeriopServiceOperationPhases(line) ?? getServiceIncomeLine(line)!.operation!.phases;
    state.serviceOperations.push({ id: `synthetic.service.${i}`, incomeLineId: line, catalogVersion: 1, actorKind: "visitor", actorId: `synthetic.visitor.${i}`,
      displayName: `Synthetic queued service ${i}`, appearance: state.founder.appearance, status: "waiting_for_resources", createdAtFacilityTick: state.facilityTick,
      waitDeadlineFacilityTick: state.facilityTick + 600, startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
      quoteFee: 80, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null, reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
      location: anchor, path: [], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick, cancellationReason: null,
      frozenOperationPhases: JSON.parse(JSON.stringify(phases)) as ServiceOperationState["frozenOperationPhases"] } satisfies ServiceOperationState);
  }
  // Construct an already operating clinic using the real reducer, rather than
  // timing an artificial simultaneous start of nine independent service chains.
  // Keep queued work alongside dispatched/walking phases, as in the report.
  for (let i = 0; i < 12; i++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `synthetic.setup.${i}`, advancedAtRealMs: 1800000000000 + i * 1000 });
  for (let i = 0; i < 2; i++) {
    const encounter = state.encounters[`synthetic.encounter.${i}`]!;
      const quote = planDiagnosticOrder(state, { orderId: `synthetic.order.${i}`, encounterId: encounter.id, serviceId: i ? "service.colonoscopy" : "service.endoscopy", resultKind: "visual" });
      if (quote.kind !== "planned") throw new Error(`Synthetic outstanding diagnostic order unavailable: ${quote.reason}; capabilities ${[...getCurrentCapabilities(state)].join(",")}`);
      encounter.lifecycle = "active_pending_result";
      encounter.pendingResult = { operationId: `synthetic.pending.${i}`, gateId: "synthetic.gate", originatingNodeIndex: 0,
        resultTypeId: "service.endoscopy", pendingLabel: "Synthetic queued work", resultNarrative: "Synthetic fixture result", routeId: "synthetic.route", routeDisplayName: "Synthetic onsite work",
        scheduledAtTick: state.facilityTick, serviceDurationTicks: 60, durationTicks: 60, dueTick: state.facilityTick + 60,
        deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null, diagnosticTiming: quote.plan };
  }
  // Public retained QA history supplies authentic FSRS/audit payload at account
  // save scale. No private state, copied owner names, invented reviews or byte
  // padding. Keep current operational geometry/actors/orders independent.
  const retained = JSON.parse(readFileSync(new URL("./level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"))["integration-lower-repeat"];
  const history = deserializeGameState(JSON.stringify(retained));
  const clockOffset = history.facilityTick - state.facilityTick;
  const historyClock = <T,>(value: T, key = ""): T => {
    if (typeof value === "number" && (key === "facilityTick" || key === "dueTick" || key.endsWith("AtTick") || key.endsWith("FacilityTick"))) return Math.max(0, value - clockOffset) as T;
    if (value === null || typeof value !== "object" || key === "frozenCase") return value;
    if (Array.isArray(value)) return value.map(entry => historyClock(entry)) as T;
    return Object.fromEntries(Object.entries(value).map(([field, entry]) => [field, historyClock(entry, field)])) as T;
  };
  const filed = Object.fromEntries(Object.entries(history.encounters).filter(([, encounter]) =>
    (encounter.lifecycle === "resolved" || encounter.lifecycle === "resolved_summary_available") &&
    encounter.patientLocation === null && encounter.patientMovement === null &&
    (!encounter.pendingResult?.diagnosticTiming || !hasOutstandingDiagnosticWork(encounter.pendingResult.diagnosticTiming))));
  state.encounters = { ...historyClock(filed), ...state.encounters };
  state.serviceOperations.push(...historyClock(history.serviceOperations.filter(operation => (operation.status === "completed" || operation.status === "cancelled") && operation.clinicVisit?.pediatricFamilyId === undefined)));
  state.learningHistories = { ...state.learningHistories, ...historyClock(history.learningHistories) };
  state.schedulerPins = history.schedulerPins;
  state.reviewIntents = historyClock(history.reviewIntents);
  state.settlements = historyClock(history.settlements);
  state.serviceIncomeReceipts = historyClock(history.serviceIncomeReceipts);
  state.events = historyClock(history.events);
  for (const [key, value] of Object.entries(history)) if (key.endsWith("Sequence") && typeof value === "number") {
    (state as unknown as Record<string, unknown>)[key] = Math.max(value, Number((state as unknown as Record<string, unknown>)[key] ?? 0));
  }
  state.openChartEncounterId = "synthetic.encounter.2"; state.attendedEncounterId = null;
  // Setup-only canonicalization, using the ordinary legacy/public fixture adapter.
  return { state: deserializeGameState(JSON.stringify(state)), chartId: state.openChartEncounterId };
}
