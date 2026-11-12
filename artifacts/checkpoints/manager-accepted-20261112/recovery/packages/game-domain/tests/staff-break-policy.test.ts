import { describe, expect, it } from "vitest";
import {
  advanceEmployeeMovement, advanceLevelThreeSupport, createInitialGameState,
  deserializeGameState, gameReducer, getBestOperationalStaffRoomMoraleBonus,
  getEmployeeEffectiveMorale, getFounderOfficeMoraleBonus, serializeGameState,
  getRoomDefinition, getRoomNavigationAnchor,
  type GameState, type ServiceOperationState,
} from "../src";
import { createBreakBenefitClinic } from "../../../tests/fixtures/break-room-benefit";
import { createLevelFiveStateQaContext } from "../../../tests/fixtures/level-five-state";

const context = createLevelFiveStateQaContext();
const tuning = context.balanceRelease.environment.levelThreeSupport;
type Kind = "break" | "gym";

function fixture(kind: Kind = "break", level: 3 | 4 | 5 = kind === "gym" ? 5 : 3, role?: string) {
  const state = createBreakBenefitClinic(level, kind === "gym" ? "gym" : "break", context, "staff-break-regression");
  const chosen = state.employees.find(employee => employee.staffRoleDefinitionId === (role ?? (level === 3 ? "staff.or_nurse" : "staff.receptionist")))!;
  state.employees = [chosen];
  chosen.location = { ...chosen.path.at(-1)! }; chosen.pathIndex = chosen.path.length - 1;
  chosen.morale = 75; chosen.lastBreakAtFacilityTick = null; chosen.facilityTask = null;
  chosen.nextIdleActionAtFacilityTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = state.nextFinancialPostingTick = state.nextEmployeeDiscussionTick = state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = state.environment.nextWaterCoolerDrainTick = state.environment.nextAmbientPedestrianTick = Number.MAX_SAFE_INTEGER;
  state.environment.founderActivity = null;
  state.retailNextOpportunityTicks[`employee:${chosen.id}`] = Number.MAX_SAFE_INTEGER;
  const coffee = new Set(state.rooms.filter(room => room.roomDefinitionId === "room.coffee_kiosk").map(room => room.id));
  state.rooms = state.rooms.filter(room => !coffee.has(room.id)); state.doors = state.doors.filter(door => !coffee.has(door.roomId));
  return state;
}

function support(state: GameState, count = 1) {
  for (let i = 0; i < count; i++) {
    state.facilityTick++; advanceLevelThreeSupport(state, context); advanceEmployeeMovement(state, context);
  }
}
function tick(state: GameState) {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: `staff.break.tick.${state.facilityTick}`, advancedAtRealMs: state.createdAtRealMs + (state.facilityTick + 1) * 1000 }, context);
}
function care(state: GameState, nextPhase = false) {
  const employee = state.employees[0]!;
  const phase = { id: "needed-care", roomDefinitionId: "room.ambulatory_or", durationMinutes: 120, staffRoleDefinitionIds: [employee.staffRoleDefinitionId] };
  const operation: ServiceOperationState = {
    id: "staff.break.care", incomeLineId: "income.ambulatory_operation", catalogVersion: 1,
    actorKind: "visitor", actorId: "staff.break.care", displayName: "Queued care", appearance: null,
    status: nextPhase ? "waiting_for_next_phase" : "waiting_for_resources", createdAtFacilityTick: state.facilityTick,
    waitDeadlineFacilityTick: Number.MAX_SAFE_INTEGER, startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
    quoteFee: 1300, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null,
    reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
    location: { x: 32, y: 22 }, path: [{ x: 32, y: 22 }], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, cancellationReason: null,
    frozenOperationPhases: nextPhase ? [{ ...phase, id: "previous", staffRoleDefinitionIds: [] }, phase] : [phase],
  };
  state.serviceOperations.push(operation);
}

describe("staff Break Room and gym policy", () => {
  it.each(["break", "gym"] as const)("offers short %s visits below 100 effective morale, including 90-99", kind => {
    for (const effective of [79, 80, 89, 90, 99, 100]) {
      const state = fixture(kind), employee = state.employees[0]!;
      employee.morale = effective - getFounderOfficeMoraleBonus(state);
      expect(getEmployeeEffectiveMorale(state, employee)).toBe(effective);
      support(state);
      if (effective === 100) expect(employee.facilityTask).toBeNull();
      else expect(employee.facilityTask).toMatchObject({ kind: "take_break", workMinutesRemaining: 15,
        roomUpgradeBreakBenefit: { baselineMoraleGain: 5, moraleGain: 5 } });
    }
  });

  it.each(["break", "gym"] as const)("uses 480 minutes below 90 and 960 at 90-99 for %s, based on effective morale", kind => {
    for (const [effective, cooldown] of [[89, 480], [90, 960], [99, 960]] as const) {
      const state = fixture(kind), employee = state.employees[0]!;
      employee.morale = effective - getFounderOfficeMoraleBonus(state);
      employee.lastBreakAtFacilityTick = state.facilityTick;
      state.facilityTick += cooldown - 2;
      support(state); expect(employee.facilityTask).toBeNull();
      support(state); expect(employee.facilityTask?.kind).toBe("take_break");
    }
  });

  it("re-evaluates the cooldown tier when effective morale crosses 90", () => {
    const state = fixture("gym"), employee = state.employees[0]!;
    employee.lastBreakAtFacilityTick = state.facilityTick;
    state.facilityTick += 480;
    employee.morale = 90 - getFounderOfficeMoraleBonus(state);
    support(state); expect(employee.facilityTask).toBeNull();
    employee.morale--;
    support(state); expect(employee.facilityTask?.kind).toBe("take_break");
  });

  it.each(["break", "gym"] as const)("earns one full %s award and shares the 480-minute cooldown", kind => {
    const state = fixture(kind), employee = state.employees[0]!;
    support(state);
    for (let i = 0; i < 150 && employee.facilityTask; i++) support(state);
    expect(employee.morale).toBe(80);
    const completedAt = employee.lastBreakAtFacilityTick!;
    employee.morale = 60;
    support(state, completedAt + 479 - state.facilityTick);
    expect(employee.facilityTask).toBeNull();
    support(state);
    expect(employee.facilityTask?.kind).toBe("take_break");
  });

  it.each([
    ["break", "outbound", false], ["break", "seated", true],
    ["gym", "outbound", true], ["gym", "seated", false],
  ] as const)("interrupts %s %s for care, frees the seat and throttles retries", (kind, stage, nextPhase) => {
    const state = fixture(kind), employee = state.employees[0]!;
    support(state);
    if (stage === "seated") for (let i = 0; i < 100 && employee.pathIndex < employee.path.length - 1; i++) support(state);
    expect(employee.facilityTask?.kind).toBe("take_break");
    const morale = employee.morale;
    care(state, nextPhase); support(state);
    expect(employee.facilityTask).toBeNull(); expect(employee.morale).toBe(morale);
    expect(employee.lastBreakAtFacilityTick).toBe(state.facilityTick);
    expect(state.employees.filter(row => row.facilityTask?.kind === "take_break")).toHaveLength(0);
    const interruptedAt = state.facilityTick;
    state.serviceOperations = [];
    support(state, interruptedAt + 479 - state.facilityTick);
    expect(employee.facilityTask).toBeNull();
    support(state); expect(employee.facilityTask?.kind).toBe("take_break");
  });

  it("interrupts a receptionist's gym trip for check-in without partial credit", () => {
    const state = fixture("gym"), employee = state.employees[0]!;
    support(state);
    const encounter = structuredClone(Object.values(createInitialGameState(context).encounters)[0]!);
    encounter.checkInStatus = "awaiting_staff"; encounter.patientMovement = null;
    state.encounters[encounter.id] = encounter;
    support(state);
    expect(employee.facilityTask).toBeNull(); expect(employee.morale).toBe(75);
    expect(employee.lastBreakAtFacilityTick).toBe(state.facilityTick);
    const home = state.rooms.find(room => room.id === employee.homeRoomInstanceId)!;
    expect(employee.path.at(-1)).toEqual(getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId, context)!, "staff"));
  });

  it("lets a receptionist rest after check-in while the patient waits for a clinician", () => {
    const state = fixture("gym"), employee = state.employees[0]!;
    const encounter = structuredClone(Object.values(createInitialGameState(context).encounters)[0]!);
    encounter.checkInStatus = "checked_in"; encounter.patientMovement = null; encounter.lifecycle = "waiting_unopened";
    state.encounters[encounter.id] = encounter;
    support(state);
    expect(employee.facilityTask?.kind).toBe("take_break");
    expect(employee.morale).toBe(75);
  });

  it("preempts a break for a concrete legacy pending-result staff reservation", () => {
    const state = fixture("break", 4, "staff.imaging_technician"), employee = state.employees[0]!;
    support(state); expect(employee.facilityTask?.kind).toBe("take_break");
    const encounter = structuredClone(Object.values(createInitialGameState(context).encounters)[0]!);
    encounter.checkInStatus = "checked_in"; encounter.patientMovement = null;
    encounter.pendingResult = {
      operationId: "break.legacy.resource", gateId: "legacy.gate", originatingNodeIndex: 0,
      resultTypeId: "test.legacy.imaging", pendingLabel: "Pending imaging", resultNarrative: "Ready",
      routeId: "test.legacy.imaging", routeDisplayName: "Legacy imaging", scheduledAtTick: state.facilityTick,
      serviceDurationTicks: 60, durationTicks: 60, dueTick: state.facilityTick + 60, deliveredAtTick: null,
      offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null, patientRemainsOnsite: true,
      timingPhases: [], resourceReservations: [], imagingTechnicianId: employee.id,
    };
    state.encounters[encounter.id] = encounter;
    support(state);
    expect(employee.facilityTask).toBeNull(); expect(employee.morale).toBe(75);
    expect(employee.lastBreakAtFacilityTick).toBe(state.facilityTick);
  });

  it.each(["break", "gym"] as const)("loads and finishes a legacy 30-minute %s task with its frozen +5", kind => {
    let state = fixture(kind); state.employees[0]!.morale = 60;
    support(state);
    const accepted = state.employees[0]!.facilityTask!;
    accepted.workMinutesRemaining = 30;
    accepted.roomUpgradeBreakBenefit!.baselineMoraleGain = 5;
    accepted.roomUpgradeBreakBenefit!.moraleGain = 5;
    state = deserializeGameState(serializeGameState(state), context);
    expect(state.employees[0]!.facilityTask?.workMinutesRemaining).toBe(30);
    for (let i = 0; i < 150 && state.employees[0]!.facilityTask; i++) support(state);
    expect(state.employees[0]!.morale).toBe(65);
    const at = state.employees[0]!.lastBreakAtFacilityTick;
    state = deserializeGameState(serializeGameState(state), context); support(state, 5);
    expect(state.employees[0]).toMatchObject({ morale: 65, lastBreakAtFacilityTick: at, facilityTask: null });
  });

  it.each(["break", "gym"] as const)("preserves the quoted +12 of an already-accepted preview %s task", kind => {
    let state = fixture(kind); state.employees[0]!.morale = 60;
    support(state);
    const quote = state.employees[0]!.facilityTask!.roomUpgradeBreakBenefit!;
    quote.baselineMoraleGain = quote.moraleGain = 12;
    state = deserializeGameState(serializeGameState(state), context);
    for (let i = 0; i < 150 && state.employees[0]!.facilityTask; i++) support(state);
    expect(state.employees[0]!.morale).toBe(72);
  });

  it("loads and abandons an already-walking legacy gym task for newly queued care", () => {
    let state = fixture("gym"); support(state);
    state.employees[0]!.facilityTask!.workMinutesRemaining = 30;
    state.employees[0]!.facilityTask!.roomUpgradeBreakBenefit!.baselineMoraleGain = 5;
    state.employees[0]!.facilityTask!.roomUpgradeBreakBenefit!.moraleGain = 5;
    state = deserializeGameState(serializeGameState(state), context);
    care(state); support(state);
    expect(state.employees[0]).toMatchObject({ morale: 75, facilityTask: null, lastBreakAtFacilityTick: state.facilityTick });
  });

  it("still rejects a saved gym duration above the supported legacy bound", () => {
    const state = fixture("gym"); support(state);
    state.employees[0]!.facilityTask!.workMinutesRemaining = 31;
    expect(() => deserializeGameState(serializeGameState(state), context)).toThrow(/gym break contract/);
  });
});

describe("ongoing staff-room morale without a saved-format change", () => {
  it.each([3, 4, 5] as const)("pays busy staff once at the Level %s operating-day boundary, including reload", level => {
    let state = fixture(level === 5 ? "gym" : "break", level);
    const employee = state.employees[0]!; employee.morale = 90;
    employee.facilityTask = { kind: "perform_service", targetId: "already-assigned-care", startedAtFacilityTick: state.facilityTick, workMinutesRemaining: 1000 };
    state.facilityTick = 599;
    state = deserializeGameState(serializeGameState(state), context);
    const before = state.employees[0]!.morale;
    state = tick(state);
    expect(state.employees[0]!.morale).toBe(before + 1);
    const once = serializeGameState(state);
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "staff.break.tick.599", advancedAtRealMs: state.createdAtRealMs + 600_000 }, context);
    expect(serializeGameState(state)).toBe(once);
    state = deserializeGameState(once, context); state = tick(state);
    expect(state.employees[0]!.morale).toBe(before + 1);
  });

  it("uses only the best operational upgraded room, without stacking a gym and Break Room", () => {
    const state = createBreakBenefitClinic(5, "both", context, "staff-room-best");
    const room = state.rooms.find(row => row.roomDefinitionId === "room.staff_break")!;
    const gym = state.rooms.find(row => row.roomDefinitionId === "room.staff_gym")!;
    room.upgradeLevel = 3; gym.upgradeLevel = 5;
    expect(getBestOperationalStaffRoomMoraleBonus(state, context)).toBe(5);
    state.doors = state.doors.filter(door => door.roomId !== gym.id);
    expect(getBestOperationalStaffRoomMoraleBonus(state, context)).toBe(3);
    state.doors = state.doors.filter(door => door.roomId !== room.id);
    expect(getBestOperationalStaffRoomMoraleBonus(state, context)).toBe(0);
    room.upgradeLevel = 5; state.facilityLevel = 2;
    expect(getBestOperationalStaffRoomMoraleBonus(state, context)).toBe(0);
  });

  it("clamps morale and stops future daily awards after the room loses access", () => {
    let state = fixture(); state.employees[0]!.morale = 99; state.facilityTick = 599;
    state = tick(state); expect(state.employees[0]!.morale).toBe(100);
    const room = state.rooms.find(row => row.roomDefinitionId === "room.staff_break")!;
    state.doors = state.doors.filter(door => door.roomId !== room.id);
    state.employees[0]!.morale = 90; state.facilityTick = 1199;
    state = tick(state); expect(state.employees[0]!.morale).toBe(90);
  });

  it("replays break travel, reward, cooldown and daily morale identically across reload", () => {
    const run = (reload: boolean) => {
      let state = deserializeGameState(serializeGameState(fixture()), context);
      for (let i = 0; i < 610; i++) {
        state = tick(state);
        if (reload && [4, 18, 300, 599].includes(i)) state = deserializeGameState(serializeGameState(state), context);
      }
      return { tick: state.facilityTick, cash: state.cashCents, employees: state.employees.map(employee => ({ morale: employee.morale,
        lastBreak: employee.lastBreakAtFacilityTick, location: employee.location, path: employee.path, pathIndex: employee.pathIndex, task: employee.facilityTask })) };
    };
    expect(run(true)).toEqual(run(false));
    expect(tuning.breakDurationMinutes).toBe(15);
  });
});
