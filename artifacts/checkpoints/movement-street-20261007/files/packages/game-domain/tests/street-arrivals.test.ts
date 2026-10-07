import { describe, expect, it } from "vitest";
import {
  advanceRetailOperations,
  createInitialGameState,
  findRouteFromDisplacedLocationOffscreen,
  gameReducer,
  PROTOTYPE_DOMAIN_CONTEXT,
  type GameState,
  type GridPoint,
  type PendingResult,
} from "../src";

// Owner direction, 2026-10-07: everyone starts off-screen and walks along the
// sidewalk into the building, and walks the sidewalk all the way off-screen
// when leaving. Nobody appears at the front door or beside a patient.

const { gridWidth, gridHeight, characterTravelTilesPerTick } = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
const offMap = (point: GridPoint) => point.x < 0 || point.x >= gridWidth;
const step = (from: GridPoint, to: GridPoint) => Math.abs(to.x - from.x) + Math.abs(to.y - from.y);

let sequence = 0;

function streetState(): GameState {
  const state = createInitialGameState(undefined, { campaignId: `street.${sequence++}`, campaignSeed: "retail-operations", createdAtRealMs: 0 });
  state.facilityLevel = 2;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.encounters = {};
  state.rooms.push(
    { id: "room.street.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.street.coffee", roomDefinitionId: "room.coffee_kiosk", x: 30, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.street.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.street.ultrasound.south", roomId: "room.street.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.street.ultrasound", roomId: "room.street.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.street.coffee", roomId: "room.street.coffee", side: "east", offset: 1, exterior: false },
    { id: "door.street.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  state.retailNextOpportunityTicks["founder:founder"] = Number.MAX_SAFE_INTEGER;
  return state;
}

function tick(state: GameState): GameState {
  return gameReducer(state, { type: "ADVANCE_TICK", operationId: `street.tick.${sequence++}` });
}

describe("street arrivals and departures", () => {
  it("walks a walk-in shopper in along the sidewalk, through the kiosk, and back off-screen", () => {
    let state = streetState();
    state.nextExternalRetailOpportunityTick = state.facilityTick + 1;
    let visitorId: string | null = null;
    for (let guard = 0; guard < 3_000 && !visitorId; guard += 1) {
      state = tick(state);
      visitorId = state.retailExternalActors.find((actor) => actor.kind === "retail_visitor")?.id ?? null;
      if (state.facilityTick >= state.nextExternalRetailOpportunityTick - 1 && !visitorId) state.nextExternalRetailOpportunityTick = state.facilityTick + 1;
    }
    expect(visitorId).not.toBeNull();
    // First observed off-map, not at the door or on the edge tile.
    expect(offMap(state.retailExternalActors.find((actor) => actor.id === visitorId)!.location!)).toBe(true);
    const operation = state.retailOperations.find((candidate) => candidate.actorId === visitorId)!;
    const first = operation.path[0]!;
    expect(offMap(first)).toBe(true);
    expect(first.y).toBe(gridHeight);
    // Every leg of the walk-in is a cardinal neighbour, so the walk is visible.
    operation.path.slice(1).forEach((point, index) => expect(step(operation.path[index]!, point)).toBe(1));

    const seen: GridPoint[] = [];
    let lastPath: GridPoint[] = [];
    for (let guard = 0; guard < 400; guard += 1) {
      const actor = state.retailExternalActors.find((candidate) => candidate.id === visitorId)!;
      if (actor.lifecycle === "departed") break;
      if (actor.location) seen.push({ ...actor.location });
      if (actor.path.length) lastPath = actor.path;
      state = tick(state);
    }
    const actor = state.retailExternalActors.find((candidate) => candidate.id === visitorId)!;
    expect(actor.lifecycle).toBe("departed");
    expect(state.retailOperations.find((candidate) => candidate.actorId === visitorId)?.status).toBe("completed");
    seen.slice(1).forEach((point, index) => expect(step(seen[index]!, point)).toBeLessThanOrEqual(characterTravelTilesPerTick));
    expect(offMap(lastPath.at(-1)!)).toBe(true);
    expect(lastPath.at(-1)!.y).toBe(gridHeight);
  });

  it("walks a patient's companion in from the street instead of placing it on the patient's tile", () => {
    const state = streetState();
    const source = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find((candidate) => candidate.earliestFacilityStage <= 1 && candidate.requiredCapabilityIds.length === 0 && candidate.decisionNodes.length > 1)!;
    Object.assign(state, gameReducer(state, { type: "ADMIT_PATIENT", operationId: "street.admit", encounterId: "encounter.street", caseId: source.id, patientDisplayName: "Street Patient", arrivalClass: "routine" }));
    const encounter = state.encounters["encounter.street"]!;
    const pending: PendingResult = { operationId: "pending.street", gateId: "gate", originatingNodeIndex: 0, resultTypeId: "service.basic_labs", pendingLabel: "Waiting", resultNarrative: "Ready", routeId: "route.endoscopy.in_house", routeDisplayName: "In-house endoscopy", scheduledAtTick: 0, serviceDurationTicks: 500, durationTicks: 500, dueTick: 500, deliveredAtTick: null, offsiteReturnStartedAtTick: null, offsiteTravel: null, patientTravel: null, patientRemainsOnsite: true, timingPhases: [{ id: "external", durationTicks: 500, resourceBound: false, startsAtTick: 0, endsAtTick: 500 }] };
    encounter.lifecycle = "active_pending_result";
    encounter.pendingResult = pending;
    encounter.patientLocation = { x: 35, y: 25 };
    encounter.patientMovement = null;
    state.retailNextOpportunityTicks["encounter:encounter.street"] = Number.MAX_SAFE_INTEGER;

    advanceRetailOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    const companion = state.retailExternalActors.find((actor) => actor.kind === "companion")!;
    expect(companion.lifecycle).toBe("arriving");
    expect(offMap(companion.location!)).toBe(true);

    const seen: GridPoint[] = [{ ...companion.location! }];
    for (let guard = 0; guard < 80 && companion.lifecycle === "arriving"; guard += 1) {
      state.facilityTick += 1;
      advanceRetailOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
      seen.push({ ...companion.location! });
    }
    // The patient is inside a care room, so the companion waits on a public
    // tile inside the building rather than on the patient's own tile.
    expect(companion.lifecycle).toBe("onsite");
    expect(offMap(companion.location!)).toBe(false);
    expect(companion.location!.y).toBeLessThan(gridHeight);
    expect(companion.location).not.toEqual(encounter.patientLocation);
    seen.slice(1).forEach((point, index) => expect(step(seen[index]!, point)).toBeLessThanOrEqual(characterTravelTilesPerTick));
    expect(seen.some((point) => point.y === gridHeight && !offMap(point))).toBe(true);

    encounter.lifecycle = "resolved";
    state.facilityTick += 1;
    advanceRetailOperations(state, PROTOTYPE_DOMAIN_CONTEXT);
    expect(companion.lifecycle).toBe("departing");
    expect(offMap(companion.path.at(-1)!)).toBe(true);
    expect(companion.path.at(-1)!.y).toBe(gridHeight);
  });

  it("leaves along the sidewalk from a street position instead of returning to the door", () => {
    const state = streetState();
    expect(findRouteFromDisplacedLocationOffscreen(state, PROTOTYPE_DOMAIN_CONTEXT, { x: -2, y: gridHeight })).toEqual([{ x: -2, y: gridHeight }]);
    const fromSidewalk = findRouteFromDisplacedLocationOffscreen(state, PROTOTYPE_DOMAIN_CONTEXT, { x: 10, y: gridHeight });
    expect(fromSidewalk[0]).toEqual({ x: 10, y: gridHeight });
    expect(fromSidewalk.at(-1)).toEqual({ x: -2, y: gridHeight });
    expect(fromSidewalk).toHaveLength(13);
    const fromRight = findRouteFromDisplacedLocationOffscreen(state, PROTOTYPE_DOMAIN_CONTEXT, { x: gridWidth + 1, y: gridHeight });
    expect(fromRight).toEqual([{ x: gridWidth + 1, y: gridHeight }]);
  });
});
