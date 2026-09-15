import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getOccupiedTiles,
  getRoomNavigationAnchor,
  getRoomNavigableTiles,
  isEmployeeAssignedToOperationalRoom,
  serializeGameState,
  type GameState,
} from "../src";

let operationSequence = 0;

function move(
  state: GameState,
  destination: { x: number; y: number },
): GameState {
  return gameReducer(state, {
    type: "MOVE_FOUNDER",
    operationId: `founder.move.${operationSequence++}`,
    destination,
  });
}

function tick(state: GameState): GameState {
  return gameReducer(state, {
    type: "ADVANCE_TICK",
    operationId: `founder.tick.${operationSequence++}`,
  });
}

function founderRoomNavigation(state: GameState) {
  const room = state.rooms.find((candidate) =>
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.protectedRoomDefinitionIds.includes(
      candidate.roomDefinitionId,
    ),
  );
  expect(room).toBeDefined();
  const definition =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find(
      (candidate) => candidate.id === room!.roomDefinitionId,
    );
  expect(definition).toBeDefined();
  return { room: room!, definition: definition! };
}

function legalFounderRoomDestinations(state: GameState) {
  const { room, definition } = founderRoomNavigation(state);
  return getRoomNavigableTiles(room, definition, state.doors).filter(
    (point) =>
      point.x !== state.environment.founderLocation.x ||
      point.y !== state.environment.founderLocation.y,
  );
}

describe("founder map movement", () => {
  it("releases matching attendance to the Front Desk and immediately enables an awaiting check-in", () => {
    let state = createInitialGameState(undefined, {
      campaignId: "campaign.founder-return-check-in",
      campaignSeed: "founder-return-check-in",
      createdAtRealMs: 0,
    });
    state.nextRoutineArrivalTick = 100_000;
    const active = Object.values(state.encounters)[0]!;
    const frontDesk = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
    const definition = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find((room) => room.id === "room.front_desk")!;
    const desk = getRoomNavigationAnchor(frontDesk, definition, "staff");
    const visitor = { x: frontDesk.x + 4, y: frontDesk.y + 3 };
    active.checkInStatus = "checked_in";
    active.lifecycle = "active_action_required";
    active.patientMovement = null;
    active.patientLocation = { ...visitor };
    active.assignedRoomInstanceId = "room.instance.exam.test";
    state.openChartEncounterId = active.id;
    state.attendedEncounterId = active.id;
    state.environment.founderLocation = { ...visitor };
    state.environment.founderActivity = {
      kind: "attend_encounter",
      targetId: active.id,
      path: [{ ...visitor }],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: Number.MAX_SAFE_INTEGER,
    };
    const waiting = JSON.parse(JSON.stringify(active)) as typeof active;
    waiting.id = "encounter.awaiting-desk";
    waiting.lifecycle = "waiting_unopened";
    waiting.checkInStatus = "awaiting_staff";
    waiting.checkInWaitingSinceTick = state.facilityTick;
    waiting.patientLocation = { x: frontDesk.x + 3, y: frontDesk.y + 3 };
    waiting.patientMovement = null;
    waiting.assignedRoomInstanceId = frontDesk.id;
    waiting.waitingDestination = null;
    state.encounters[waiting.id] = waiting;

    state = gameReducer(state, { type: "CLOSE_CHART", operationId: "founder.return.close", encounterId: active.id });
    expect(state.environment.founderActivity?.kind).toBe("return_to_front_desk");
    for (let index = 0; index < 10 && state.environment.founderActivity; index += 1) state = tick(state);
    expect(state.environment.founderLocation).toEqual(desk);
    expect(state.environment.founderActivity).toBeNull();
    expect(state.encounters[waiting.id]!.checkInStatus).toBe("checked_in");
  });

  it("preserves every automatic founder kind through saves and drops unknown legacy kinds", () => {
    const automaticKinds = ["attend_encounter", "return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"] as const;
    for (const kind of automaticKinds) {
      const state = createInitialGameState();
      const location = { ...state.environment.founderLocation };
      state.environment.founderActivity = {
        kind,
        targetId: `auto.${kind}`,
        path: [location],
        pathIndex: 0,
        lastMovedAtFacilityTick: state.facilityTick,
        workMinutesRemaining: 7,
      };
      expect(deserializeGameState(serializeGameState(state)).environment.founderActivity).toEqual(state.environment.founderActivity);
    }
    const parsed = JSON.parse(serializeGameState(createInitialGameState())) as { environment: { founderActivity: unknown } };
    parsed.environment.founderActivity = {
      kind: "obsolete_auto_idle",
      targetId: "legacy",
      path: [{ x: 36, y: 29 }],
      pathIndex: 0,
      lastMovedAtFacilityTick: 0,
      workMinutesRemaining: 1,
    };
    expect(deserializeGameState(JSON.stringify(parsed)).environment.founderActivity).toBeNull();
  });

  it("chooses a deterministic legal low-priority target when a receptionist covers the desk", () => {
    const prepare = () => {
      const state = createInitialGameState(undefined, { campaignId: "campaign.founder-auto-idle", campaignSeed: "founder-auto-idle", createdAtRealMs: 0 });
      state.facilityLevel = 1;
      state.nextRoutineArrivalTick = 100_000;
      state.rooms.push(
        { id: "auto.waiting", roomDefinitionId: "room.waiting", x: 29, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
        { id: "auto.periop", roomDefinitionId: "room.periop_recovery", x: 34, y: 25, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
        { id: "auto.hall", roomDefinitionId: "room.hallway", x: 28, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
      );
      state.doors.push(
        { id: "auto.waiting-east", roomId: "auto.waiting", side: "east", offset: 1, exterior: false },
        { id: "auto.waiting-west", roomId: "auto.waiting", side: "west", offset: 0, exterior: false },
        { id: "auto.periop-south", roomId: "auto.periop", side: "south", offset: 1, exterior: false },
      );
      const encounter = Object.values(state.encounters)[0]!;
      const frontDesk = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
      const definition = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find((room) => room.id === "room.front_desk")!;
      const desk = getRoomNavigationAnchor(frontDesk, definition, "staff");
      const visitor = { x: frontDesk.x + 4, y: frontDesk.y + 3 };
      encounter.checkInStatus = "checked_in";
      encounter.lifecycle = "active_action_required";
      encounter.patientMovement = null;
      encounter.patientLocation = { x: frontDesk.x + 3, y: frontDesk.y + 3 };
      encounter.assignedRoomInstanceId = "room.instance.exam.test";
      state.openChartEncounterId = encounter.id;
      state.environment.founderLocation = { ...visitor };
      state.environment.founderActivity = { kind: "attend_encounter", targetId: encounter.id, path: [{ ...visitor }], pathIndex: 0, lastMovedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
      state.employees.push({ id: "employee.covering-desk", staffRoleDefinitionId: "staff.receptionist", displayName: "Covering Desk", appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1 as const, homeRoomInstanceId: frontDesk.id, location: desk, path: [desk], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 100_000, facilityTask: null });
      return { state, encounter, desk };
    };
    const first = prepare();
    const second = prepare();
    expect(isEmployeeAssignedToOperationalRoom(first.state, "employee.covering-desk", PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const closed = gameReducer(first.state, { type: "CLOSE_CHART", operationId: "founder.auto-idle.close-a", encounterId: first.encounter.id });
    const replay = gameReducer(second.state, { type: "CLOSE_CHART", operationId: "founder.auto-idle.close-b", encounterId: second.encounter.id });
    expect(closed.environment.founderActivity).toEqual(replay.environment.founderActivity);
    expect(closed.environment.founderActivity).not.toBeNull();
    expect(closed.environment.founderActivity?.kind).toMatch(/wander_facility|sit_in_chair|visit_bathroom/);
    expect(closed.environment.founderActivity?.path.at(-1)).not.toEqual(first.desk);
    expect(closed.environment.founderActivity?.path.at(-1)).not.toEqual(first.encounter.patientLocation);
  });

  it("uses a connected Bathroom primary anchor only while that endpoint is unoccupied", () => {
    const context = JSON.parse(JSON.stringify(PROTOTYPE_DOMAIN_CONTEXT)) as typeof PROTOTYPE_DOMAIN_CONTEXT;
    const frontDefinition = context.balanceRelease.facility.roomDefinitions.find((room) => room.id === "room.front_desk")!;
    frontDefinition.navigation = {
      ...frontDefinition.navigation!,
      waitingAnchors: [],
      publicWaitingArea: false,
    };
    const prepare = (occupyBathroom: boolean) => {
      const state = createInitialGameState(context, { campaignId: "campaign.founder-bathroom", campaignSeed: "founder-bathroom", createdAtRealMs: 0 });
      state.facilityLevel = 1;
      state.nextRoutineArrivalTick = 100_000;
      const frontDesk = state.rooms.find((room) => room.roomDefinitionId === "room.front_desk")!;
      const bathroom = { id: "auto.bathroom", roomDefinitionId: "room.bathroom", x: frontDesk.x + 5, y: frontDesk.y + 1, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 };
      state.rooms.push(bathroom);
      state.doors.push({ id: "auto.bathroom-door", roomId: bathroom.id, side: "west", offset: 0, exterior: false });
      const bathroomDefinition = context.balanceRelease.facility.roomDefinitions.find((room) => room.id === "room.bathroom")!;
      const bathroomAnchor = getRoomNavigationAnchor(bathroom, bathroomDefinition);
      const desk = getRoomNavigationAnchor(frontDesk, frontDefinition, "staff");
      const encounter = Object.values(state.encounters)[0]!;
      encounter.checkInStatus = "checked_in";
      encounter.lifecycle = "active_action_required";
      encounter.patientMovement = null;
      encounter.patientLocation = { x: frontDesk.x + 3, y: frontDesk.y + 3 };
      encounter.assignedRoomInstanceId = "room.instance.exam.test";
      if (occupyBathroom) {
        const occupant = JSON.parse(JSON.stringify(encounter)) as typeof encounter;
        occupant.id = "encounter.bathroom-occupant";
        occupant.lifecycle = "waiting_unopened";
        occupant.patientLocation = bathroomAnchor;
        occupant.patientMovement = null;
        occupant.assignedRoomInstanceId = bathroom.id;
        occupant.waitingDestination = { roomInstanceId: bathroom.id, location: bathroomAnchor, kind: "standing" };
        state.encounters[occupant.id] = occupant;
      }
      state.openChartEncounterId = encounter.id;
      state.environment.founderLocation = { x: frontDesk.x + 4, y: frontDesk.y + 3 };
      state.environment.founderActivity = { kind: "attend_encounter", targetId: encounter.id, path: [{ ...state.environment.founderLocation }], pathIndex: 0, lastMovedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
      state.employees.push({ id: "employee.bathroom-coverage", staffRoleDefinitionId: "staff.receptionist", displayName: "Bathroom Coverage", appearance: state.founder.appearance, hiredAtFacilityTick: 0, salaryPerExpenseInterval: 0, morale: 100, trainingLevel: 1 as const, homeRoomInstanceId: frontDesk.id, location: desk, path: [desk], pathIndex: 0, lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 100_000, facilityTask: null });
      return { state, encounter, bathroomAnchor };
    };
    const available = prepare(false);
    const selected = gameReducer(available.state, { type: "CLOSE_CHART", operationId: "founder.bathroom.available", encounterId: available.encounter.id }, context);
    expect(selected.environment.founderActivity).toMatchObject({ kind: "visit_bathroom" });
    expect(selected.environment.founderActivity?.path.at(-1)).toEqual(available.bathroomAnchor);
    const occupied = prepare(true);
    const excluded = gameReducer(occupied.state, { type: "CLOSE_CHART", operationId: "founder.bathroom.occupied", encounterId: occupied.encounter.id }, context);
    expect(excluded.environment.founderActivity?.kind).not.toBe("visit_bathroom");
  });

  it("lets a newer manual route survive a later close for a different attendance target", () => {
    let state = createInitialGameState();
    const active = Object.values(state.encounters)[0]!;
    active.checkInStatus = "checked_in";
    active.lifecycle = "active_action_required";
    active.patientMovement = null;
    state.openChartEncounterId = active.id;
    const destination = legalFounderRoomDestinations(state)[0]!;
    state = move(state, destination);
    state = gameReducer(state, { type: "CLOSE_CHART", operationId: "founder.manual-survives-close", encounterId: active.id });
    expect(state.environment.founderActivity?.kind).toBe("walk_to_point");
    expect(state.environment.founderActivity?.path.at(-1)).toEqual(destination);
  });

  it("lets player work commands replace automatic idling but protects explicit work", () => {
    const automatic = (state: GameState) => {
      const location = { ...state.environment.founderLocation };
      state.environment.founderActivity = {
        kind: "wander_facility",
        targetId: "auto.idle",
        path: [location],
        pathIndex: 0,
        lastMovedAtFacilityTick: state.facilityTick,
        workMinutesRemaining: 10,
      };
    };
    let state = createInitialGameState();
    const location = { ...state.environment.founderLocation };
    state.environment.litterItems.push({ id: "litter.auto", roomId: "room.instance.founder_desk", location, spawnedAtFacilityTick: 0 });
    automatic(state);
    state = gameReducer(state, { type: "COLLECT_LITTER", operationId: "auto.collect", litterId: "litter.auto" });
    expect(state.environment.founderActivity?.kind).toBe("collect_litter");
    state.environment.waterCoolerFillPercent = 0;
    automatic(state);
    state = gameReducer(state, { type: "REFILL_WATER_COOLER", operationId: "auto.refill" });
    expect(state.environment.founderActivity?.kind).toBe("refill_water");
    const employee = {
      id: "employee.auto-praise",
      staffRoleDefinitionId: "staff.receptionist",
      displayName: "Auto Praise",
      appearance: state.founder.appearance,
      hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 0,
      morale: 100,
      trainingLevel: 1 as const,
      homeRoomInstanceId: "room.instance.founder_desk",
      location,
      path: [location],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: 100_000,
      facilityTask: null,
    };
    state.employees.push(employee);
    automatic(state);
    state = gameReducer(state, { type: "PRAISE_EMPLOYEE", operationId: "auto.praise", employeeId: employee.id });
    expect(state.environment.founderActivity?.kind).toBe("praise_employee");
    const blocked = move(state, legalFounderRoomDestinations(state)[0]!);
    expect(blocked.environment.founderActivity?.kind).toBe("praise_employee");
  });

  it("lets a map click replace every automatic founder plan", () => {
    for (const kind of ["attend_encounter", "return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"] as const) {
      let state = createInitialGameState(undefined, {
        campaignId: `campaign.founder-${kind}-override`,
        campaignSeed: `founder-${kind}-override`,
        createdAtRealMs: 0,
      });
      state.encounters = {};
      state.nextRoutineArrivalTick = 100_000;
      const destination = legalFounderRoomDestinations(state)[0]!;
      state.environment.founderActivity = {
        kind,
        targetId: `auto.${kind}`,
        path: [{ ...state.environment.founderLocation }, destination],
        pathIndex: 0,
        lastMovedAtFacilityTick: state.facilityTick,
        workMinutesRemaining: 0,
      };
      state = move(state, destination);
      expect(state.environment.founderActivity?.kind).toBe("walk_to_point");
    }
  });

  it("persists a legal floor destination and advances at the shared speed", () => {
    let state = createInitialGameState(undefined, {
      campaignId: "campaign.founder-map-movement",
      campaignSeed: "founder-map-movement",
      createdAtRealMs: 0,
    });
    state.encounters = {};
    state.nextRoutineArrivalTick = 100_000;
    state.environment.nextLitterSpawnTick = 100_000;
    const destination = legalFounderRoomDestinations(state)[0]!;

    state = move(state, destination);
    expect(state.environment.founderActivity).toMatchObject({
      kind: "walk_to_point",
      pathIndex: 0,
      workMinutesRemaining: 0,
    });
    expect(
      state.environment.founderActivity?.path.at(-1),
    ).toEqual(destination);

    state = deserializeGameState(serializeGameState(state));
    expect(state.environment.founderActivity?.kind).toBe(
      "walk_to_point",
    );

    const initialIndex =
      state.environment.founderActivity!.pathIndex;
    state = tick(state);
    expect(
      state.environment.founderActivity!.pathIndex - initialIndex,
    ).toBeLessThanOrEqual(
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility
        .characterTravelTilesPerTick,
    );

    for (let index = 0; index < 10; index += 1) {
      if (!state.environment.founderActivity) {
        break;
      }
      state = tick(state);
    }
    expect(state.environment.founderLocation).toEqual(destination);
    expect(state.environment.founderActivity).toBeNull();
  });

  it("retargets ordinary walking but does not interrupt facility work", () => {
    let state = createInitialGameState();
    const destinations = legalFounderRoomDestinations(state);
    expect(destinations.length).toBeGreaterThanOrEqual(2);
    const firstDestination = destinations[0]!;
    const secondDestination = destinations[1]!;
    state = move(state, firstDestination);
    state = move(state, secondDestination);
    expect(
      state.environment.founderActivity?.path.at(-1),
    ).toEqual(secondDestination);

    const location = { ...state.environment.founderLocation };
    state.environment.founderActivity = {
      kind: "collect_litter",
      targetId: "litter.busy",
      path: [location],
      pathIndex: 0,
      lastMovedAtFacilityTick: state.facilityTick,
      workMinutesRemaining: 2,
    };
    const blocked = move(state, firstDestination);
    expect(
      blocked.operationReceipts[Object.keys(blocked.operationReceipts).at(-1)!],
    ).toMatchObject({
      status: "rejected",
      message:
        "The founder is already completing another facility interaction.",
    });
    expect(blocked.environment.founderActivity?.kind).toBe(
      "collect_litter",
    );
  });

  it("walks through the entrance to a clicked sidewalk point", () => {
    let state = createInitialGameState();
    const destination = {
      x: 30,
      y: PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.gridHeight,
    };
    state = move(state, destination);

    expect(
      state.environment.founderActivity?.path.at(-1),
    ).toEqual(destination);
    expect(
      state.environment.founderActivity?.path,
    ).toContainEqual({ x: 35, y: 32 });
  });

  it("uses the nearest legal floor tile for furniture clicks and rejects empty land", () => {
    let state = createInitialGameState();
    const { room, definition } = founderRoomNavigation(state);
    const navigable = getRoomNavigableTiles(room, definition, state.doors);
    const navigableKeys = new Set(
      navigable.map((point) => `${point.x},${point.y}`),
    );
    const blockedFixtureTile = getOccupiedTiles(room, definition).find(
      (point) => !navigableKeys.has(`${point.x},${point.y}`),
    );
    expect(blockedFixtureTile).toBeDefined();
    state = move(state, blockedFixtureTile!);
    const resolvedDestination =
      state.environment.founderActivity?.path.at(-1);
    expect(resolvedDestination).toBeDefined();
    expect(resolvedDestination).not.toEqual(blockedFixtureTile);
    expect(
      Math.abs(resolvedDestination!.x - blockedFixtureTile!.x) +
        Math.abs(resolvedDestination!.y - blockedFixtureTile!.y),
    ).toBe(1);

    const rejected = move(state, { x: 0, y: 0 });
    expect(
      rejected.operationReceipts[
        Object.keys(rejected.operationReceipts).at(-1)!
      ]?.status,
    ).toBe("rejected");
  });
});
