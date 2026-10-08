import { describe, expect, it } from "vitest";
import {
  deserializeGameState, findCareAwareFacilityPath, findDeterministicFacilityPath, gameReducer,
  getEmployeeTrainingAvailability, getEmployeeTrainingPlaces, getEmployeeTrainingQuote,
  getEmployeeTrainingProjection, getFacilityAccessValidation, getQueuedEmployeeTrainingDepartures,
  getGlp1NursePractitionerStation, getRoomDefinition, isRoomOperationalForFacilityWork,
  PROTOTYPE_DOMAIN_CONTEXT, requestEmployeeTraining, serializeGameState,
  type GameState, type GridPoint,
} from "../src";
import { addTrainingEmployee, advanceTrainingMinutes, reachTrainingStage, trainingFixture } from "./employee-training-fixtures";

const SUITE = "room.training-access.suite";
const COLLECTION = "room.training-access.collection";
const NPS = ["employee.training-access.np.1", "employee.training-access.np.2"];

/** Ordinary door-connected layout: public hall -> phlebotomy -> telehealth. */
function telehealthTrainingFixture(orientation: 0 | 270 = 0) {
  const state = trainingFixture();
  state.rooms.push(
    { id: COLLECTION, roomDefinitionId: "room.phlebotomy", x: 29, y: 29,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: SUITE, roomDefinitionId: "room.glp1_telehealth_suite", x: orientation === 0 ? 26 : 27, y: 29,
      orientation, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...[29, 30].map((y) => ({ id: `room.training-access.hall.${y}`, roomDefinitionId: "room.hallway",
      x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.training-access.collection", roomId: COLLECTION, side: "east", offset: 1, exterior: false },
    { id: "door.training-access.suite", roomId: SUITE, side: "east", offset: 1, exterior: false },
  );
  const nps = NPS.map((id) => addTrainingEmployee(state, id, "staff.glp1_np", SUITE));
  for (const np of nps) {
    np.displayName = np.id === NPS[0] ? "Jordan Lee" : "Alex Lane";
    np.location = getGlp1NursePractitionerStation(state, np, PROTOTYPE_DOMAIN_CONTEXT)!;
    np.path = [{ ...np.location }];
  }
  state.environment.glp1AutomationSlots = nps.map((np) => ({
    suiteRoomInstanceId: SUITE, employeeId: np.id, nextPayoutTick: 3,
  }));
  addTrainingEmployee(state, "employee.training-access.control");
  return state;
}

function assertUnpaidRefusal(state: GameState, employeeId: string, reason: string) {
  const cashBefore = state.cash;
  expect(getEmployeeTrainingQuote(state, employeeId)).toMatchObject({ canTrain: false, blockedReason: reason });
  expect(requestEmployeeTraining(state, employeeId)).toEqual({ applied: false, message: reason });
  expect(state.cash).toBe(cashBefore);
  expect(state.employees.find((employee) => employee.id === employeeId)?.training).toBeUndefined();
}

function assertContinuousPath(path: GridPoint[], start: GridPoint, finish: GridPoint) {
  expect(path[0]).toEqual(start);
  expect(path.at(-1)).toEqual(finish);
  for (let index = 1; index < path.length; index++) {
    const previous = path[index - 1]!;
    const current = path[index]!;
    expect(Math.abs(previous.x - current.x) + Math.abs(previous.y - current.y)).toBe(1);
  }
  expect(path.some((point) => point.x >= 29 && point.x <= 31 && point.y >= 29 && point.y <= 30)).toBe(true);
}

describe("employee training reachability", () => {
  it("lets both onsite telehealth NPs train through the suite's real connected doors", () => {
    let state = telehealthTrainingFixture();
    expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, unreachableRoomIds: [] });
    expect(isRoomOperationalForFacilityWork(state, SUITE)).toBe(true);
    expect(isRoomOperationalForFacilityWork(state, "room.test.training")).toBe(true);
    expect(getEmployeeTrainingQuote(state, "employee.training-access.control").canTrain).toBe(true);
    expect(state.employees.filter((employee) => NPS.includes(employee.id)).map((employee) => employee.location))
      .toEqual([{ x: 28, y: 30 }, { x: 26, y: 30 }]);
    const place = getEmployeeTrainingPlaces(state)[0]!;
    for (const npId of NPS) {
      const np = state.employees.find((employee) => employee.id === npId)!;
      // Reproduction: room-level access and physical routing agree, but the
      // original training guard forbids the intervening phlebotomy room.
      expect(findDeterministicFacilityPath(np.location, place.location, state.rooms, state.doors,
        (id) => getRoomDefinition(id)).length).toBeGreaterThan(0);
      expect(findCareAwareFacilityPath(state, PROTOTYPE_DOMAIN_CONTEXT, np.location, place.location,
        new Set([SUITE]))).toEqual([]);
      expect(getEmployeeTrainingQuote(state, npId)).toMatchObject({ canTrain: true, blockedReason: null });
      state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId: npId, operationId: `train.access.${npId}` });
      expect(state.operationReceipts[`train.access.${npId}`]?.status).toBe("applied");
    }
    expect(state.cash).toBe(24_700);
  });

  it.each([0, 270] as const)("walks both NPs to separate seats and back to their %i-degree workstations after reload", (orientation) => {
    let state = telehealthTrainingFixture(orientation);
    const homes = NPS.map((id) => ({ ...state.employees.find((employee) => employee.id === id)!.location }));
    for (const employeeId of NPS) {
      state = gameReducer(state, { type: "TRAIN_EMPLOYEE", employeeId, operationId: `training-cycle.${employeeId}` });
      expect(state.employees.find((employee) => employee.id === employeeId)?.training?.stage).toBe("queued");
    }
    state = deserializeGameState(serializeGameState(state));
    for (let tick = 1; tick <= 3; tick++) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `training-cycle.tick.${tick}` });
      if (tick < 3) expect(state.employees.filter((employee) => NPS.includes(employee.id))
        .every((employee) => employee.training?.stage === "queued")).toBe(true);
    }
    expect(state.environment.glp1AutomationConsultationsCompleted).toBe(2);
    for (let index = 0; index < NPS.length; index++) {
      const np = state.employees.find((employee) => employee.id === NPS[index])!;
      expect(np.training?.stage).toBe("walking_to_training");
      const place = getEmployeeTrainingPlaces(state).find((candidate) => candidate.employeeId === np.id)!;
      assertContinuousPath(np.path, homes[index]!, place.location);
      expect(getEmployeeTrainingAvailability(state, np).kind).toBe("returning_at");
      expect(getEmployeeTrainingProjection(state, np, PROTOTYPE_DOMAIN_CONTEXT)?.homeLocation).toEqual(homes[index]);
    }
    expect(new Set(state.employees.filter((employee) => NPS.includes(employee.id)).map((employee) => employee.training?.placeId)).size).toBe(2);
    state = deserializeGameState(serializeGameState(state));
    for (const npId of NPS) reachTrainingStage(state, npId, "training");
    for (let minute = 0; minute < 60 && state.employees.some((employee) => employee.training?.stage === "training"); minute++) {
      advanceTrainingMinutes(state);
    }
    for (let index = 0; index < NPS.length; index++) {
      const np = state.employees.find((employee) => employee.id === NPS[index])!;
      expect(np.training?.stage).toBe("returning");
      expect(np.trainingLevel).toBe(2);
      assertContinuousPath(np.path.slice(np.pathIndex), np.location, homes[index]!);
    }
    for (let minute = 0; minute < 60 && state.employees.some((employee) => employee.training); minute++) advanceTrainingMinutes(state);
    for (let index = 0; index < NPS.length; index++) {
      const np = state.employees.find((employee) => employee.id === NPS[index])!;
      expect(np.training).toBeNull();
      expect(np.trainingLevel).toBe(2);
      expect(np.homeRoomInstanceId).toBe(SUITE);
      expect(np.location).toEqual(homes[index]);
    }
    expect(state.cash).toBe(24_800); // Two payments, then the two completed consultations.
  });

  it("uses public circulation when a corridor route also exists", () => {
    const state = telehealthTrainingFixture();
    state.rooms.push(...[26, 27, 28, 29, 30, 31].map((x) => ({
      id: `room.training-access.north-hall.${x}`, roomDefinitionId: "room.hallway", x, y: 28,
      orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
    })));
    state.doors.push({ id: "door.training-access.suite-public", roomId: SUITE, side: "north", offset: 0, exterior: false });
    requestEmployeeTraining(state, NPS[0]!);
    state.facilityTick = 3;
    advanceTrainingMinutes(state);
    const np = state.employees.find((employee) => employee.id === NPS[0])!;
    expect(np.training?.stage).toBe("walking_to_training");
    expect(np.path.some((point) => point.x >= 29 && point.x <= 31 && point.y >= 29 && point.y <= 30)).toBe(false);
  });

  it("can walk out from a current tile blocked by a workstation mask without moving the employee in the quote", () => {
    const state = telehealthTrainingFixture();
    const np = state.employees.find((employee) => employee.id === NPS[0])!;
    const blockedStart = { x: 27, y: 29 };
    np.location = { ...blockedStart };
    np.path = [{ ...blockedStart }];
    expect(getEmployeeTrainingQuote(state, np.id).canTrain).toBe(true);
    expect(np.location).toEqual(blockedStart);
    requestEmployeeTraining(state, np.id);
    state.facilityTick = 3;
    advanceTrainingMinutes(state);
    const place = getEmployeeTrainingPlaces(state).find((candidate) => candidate.employeeId === np.id)!;
    expect(np.location).toEqual(blockedStart);
    assertContinuousPath(np.path, blockedStart, place.location);
  });

  it.each(NPS)("refuses %s when the suite has no actual exit, even if its assigned home is known", (npId) => {
    const state = telehealthTrainingFixture();
    state.doors = state.doors.filter((door) => door.roomId !== SUITE);
    expect(isRoomOperationalForFacilityWork(state, "room.test.training")).toBe(true);
    expect(getEmployeeTrainingQuote(state, "employee.training-access.control").canTrain).toBe(true);
    const np = state.employees.find((employee) => employee.id === npId)!;
    assertUnpaidRefusal(state, npId, `${np.displayName} cannot reach a Training Room from the GLP-1 Telehealth Suite. Restore a usable door and hallway route.`);
  });

  it("checks the employee's actual current area rather than substituting their reachable home station", () => {
    const state = telehealthTrainingFixture();
    state.rooms.push({ id: "room.training-access.isolated", roomDefinitionId: "room.glp1_telehealth_suite",
      x: 10, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const np = state.employees.find((employee) => employee.id === NPS[0])!;
    np.location = { x: 12, y: 11 };
    np.path = [{ ...np.location }];
    expect(isRoomOperationalForFacilityWork(state, SUITE)).toBe(true);
    assertUnpaidRefusal(state, np.id, "Jordan Lee cannot reach a Training Room from the GLP-1 Telehealth Suite. Restore a usable door and hallway route.");
  });

  it("does not use grass re-entry to escape a suite whose only door opens onto an isolated hallway", () => {
    const state = telehealthTrainingFixture();
    state.doors = state.doors.filter((door) => door.roomId !== SUITE);
    state.rooms.push({ id: "room.training-access.isolated-hall", roomDefinitionId: "room.hallway",
      x: 25, y: 30, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "door.training-access.isolated-hall", roomId: SUITE, side: "west", offset: 1, exterior: false });
    assertUnpaidRefusal(state, NPS[0]!, "Jordan Lee cannot reach a Training Room from the GLP-1 Telehealth Suite. Restore a usable door and hallway route.");
  });

  it("requires a real return path when the employee is in the corridor but their home suite is disconnected", () => {
    const state = telehealthTrainingFixture();
    state.doors = state.doors.filter((door) => door.roomId !== SUITE);
    const np = state.employees.find((employee) => employee.id === NPS[0])!;
    np.location = { x: 32, y: 28 };
    np.path = [{ ...np.location }];
    assertUnpaidRefusal(state, np.id, "Jordan Lee cannot return from training to their assigned GLP-1 Telehealth Suite. Restore its door connection.");
  });

  it("keeps a paid employee queued if their home loses access before departure", () => {
    const state = telehealthTrainingFixture();
    const np = state.employees.find((employee) => employee.id === NPS[0])!;
    expect(requestEmployeeTraining(state, np.id).applied).toBe(true);
    np.location = { x: 32, y: 28 };
    np.path = [{ ...np.location }];
    state.doors = state.doors.filter((door) => door.roomId !== SUITE);
    expect(getQueuedEmployeeTrainingDepartures(state, PROTOTYPE_DOMAIN_CONTEXT, 3)).toEqual([]);
    state.facilityTick = 3;
    advanceTrainingMinutes(state);
    expect(np.training?.stage).toBe("queued");
    expect(state.cash).toBe(24_850);
    expect(getEmployeeTrainingPlaces(state).every((place) => place.employeeId === null)).toBe(true);
  });

  it("names a missing Training Room before payment", () => {
    const state = telehealthTrainingFixture();
    state.rooms = state.rooms.filter((room) => room.roomDefinitionId !== "room.training");
    state.doors = state.doors.filter((door) => door.id !== "door.test.training");
    assertUnpaidRefusal(state, NPS[0]!, "Build a Training Room before requesting training.");
  });

  it("names inaccessible Training Rooms separately from the employee's current-area access", () => {
    const state = telehealthTrainingFixture();
    state.doors = state.doors.filter((door) => door.id !== "door.test.training");
    assertUnpaidRefusal(state, NPS[0]!, "No Training Room has usable access to the clinic. Add a door connection to the Front Desk through rooms or hallways.");
  });

  it("names an accessible Training Room's out-of-service condition", () => {
    const state = telehealthTrainingFixture();
    state.rooms.find((room) => room.id === "room.test.training")!.maintenance = {
      status: "out_of_service", completedUses: 0, dueAtFacilityTick: 0, outOfServiceAtFacilityTick: 0, appliedUseKeys: [],
    };
    assertUnpaidRefusal(state, NPS[0]!, "Every accessible Training Room is out of service. Repair a Training Room before requesting training.");
  });

  it("names a missing home assignment even if the current location can reach training", () => {
    const state = telehealthTrainingFixture();
    const np = state.employees.find((employee) => employee.id === NPS[0])!;
    np.homeRoomInstanceId = null;
    np.location = { x: 32, y: 28 };
    np.path = [{ ...np.location }];
    assertUnpaidRefusal(state, np.id, "Jordan Lee needs an assigned home room before training.");
  });
});
