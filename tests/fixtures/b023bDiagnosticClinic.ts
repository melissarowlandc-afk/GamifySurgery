import { readFileSync } from "node:fs";
import {
  createInitialGameState, createLevelFiveState, deserializeGameState, findCareAwareFacilityPath, gameReducer, getDefaultDoorOffset,
  getRadiologistReadingStation, getRoomDefinition, getRoomNavigationAnchor, PROTOTYPE_DOMAIN_CONTEXT,
  serializeGameState, startServiceOperation, validateDoorPlacement,
  type DoorState, type EmployeeState, type GameState, type GridPoint, type PlacedRoom,
} from "@gamify-surgery/game-domain";

const context = PROTOTYPE_DOMAIN_CONTEXT;
const never = Number.MAX_SAFE_INTEGER;
export const FIRST_READER = "b023b.reader.near";
export const SECOND_READER = "b023b.reader.far";
export const ISOLATED_READER = "b023b.reader.isolated";
export const READING_SHORTCUT: DoorState = {
  id: "b023b.door.reading-shortcut", roomId: "b023b.reading.far", side: "north", offset: 0, exterior: false,
};

export function createB023bDiagnosticClinic() {
  // Retain one authentic FSRS card and its filed chart from the public QA journey.
  const publicSave = JSON.parse(readFileSync(new URL("./level-five-economy-checkpoint-20261012.json", import.meta.url), "utf8")) as GameState;
  const chart = Object.values(publicSave.encounters).find(encounter =>
    encounter.lifecycle === "resolved" && encounter.patientLocation === null && !encounter.pediatricFamilyId && !encounter.consult &&
    encounter.steps.some(step => step.answer && publicSave.learningHistories[step.primaryConceptId]?.reviews.length));
  const review = chart?.steps.find(step => step.answer && publicSave.learningHistories[step.primaryConceptId]?.reviews.length);
  if (!chart || !review) throw new Error("The public checkpoint must supply a filed chart with a real review.");
  const conceptId = review.primaryConceptId;

  let state = createInitialGameState(context, {
    campaignId: "campaign.b023b.synthetic", campaignSeed: "b023b.route-pressure", createdAtRealMs: publicSave.createdAtRealMs,
  });
  state.facilityLevel = 5;
  state.levelFive = createLevelFiveState();
  state.facilityTick = publicSave.facilityTick;
  state.encounters = { [chart.id]: chart };
  state.learningHistories = { [conceptId]: publicSave.learningHistories[conceptId]! };
  state.cash = 100_000;
  state.cashCents = 10_000_000;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = never;
  state.nextFinancialPostingTick = never;
  state.nextEmployeeDiscussionTick = never;
  state.nextExternalRetailOpportunityTick = never;
  state.environment.nextAmbientPedestrianTick = never;
  state.environment.nextLitterSpawnTick = never;
  state.environment.nextWaterCoolerDrainTick = never;

  function room(id: string, kind: string, x: number, y: number): PlacedRoom {
    const placed = { id: `b023b.${id}`, roomDefinitionId: `room.${kind}`, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 } satisfies PlacedRoom;
    state.rooms.push(placed);
    return placed;
  }

  // Put door-owned fixtures before the corridor in the ordinary staff reads.
  const north = ["examination", "pediatric_examination", "pediatric_waiting", "wound_ostomy",
    "founder_office", "executive_office", "examination", "pediatric_waiting", "wound_ostomy", "periop_recovery",
    "examination", "pediatric_examination", "examination", "examination", "examination", "examination", "examination"];
  let x = 4;
  const northRooms = north.map((kind, index) => {
    const definition = getRoomDefinition(`room.${kind}`)!;
    const built = room(`north.${index}`, kind, x, 26 - definition.height);
    x += definition.width;
    return built;
  });
  const isolated = room("isolated", "hallway", 9, 12);
  room("isolated-extension", "hallway", 10, 12);
  const mri = room("mri", "mri", 38, 27);
  const near = room("reading.near", "reading", 44, 27);
  const far = room("reading.far", "reading", 52, 27);
  near.upgradeLevel = 5;
  for (let x = 4; x <= 59; x++) room(`hall.${x}`, "hallway", x, 26);
  room("entry", "hallway", 35, 27);

  const front = state.rooms[0]!;
  const facility = context.balanceRelease.facility;
  const protectedRooms = new Set(facility.protectedRoomDefinitionIds);
  function door(placed: PlacedRoom, side: DoorState["side"], offset?: number) {
    const definition = getRoomDefinition(placed.roomDefinitionId)!;
    const offsets = offset === undefined ? [getDefaultDoorOffset(placed, definition, side), ...Array.from({ length: definition.width }, (_, i) => i)] : [offset];
    for (const slot of offsets) {
      const candidate = { id: `door.${placed.id}`, roomId: placed.id, side, offset: slot, exterior: false };
      if (validateDoorPlacement(candidate, state.rooms, state.doors, getRoomDefinition, facility.gridWidth, facility.gridHeight, protectedRooms).valid) {
        state.doors.push(candidate);
        placed.doorSide = side;
        return;
      }
    }
    throw new Error(`No legal ${side} door for ${placed.id}.`);
  }
  door(front, "north", 2);
  for (const placed of northRooms) door(placed, "south");
  door(mri, "north");
  door(near, "north");
  door(far, "north", 3);

  function employee(id: string, role: string, home: PlacedRoom, location: GridPoint, readingStationId?: string): EmployeeState {
    return { id, staffRoleDefinitionId: `staff.${role}`, displayName: id, appearance: state.founder.appearance,
      hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 100, morale: 100, trainingLevel: 1,
      homeRoomInstanceId: home.id, location, path: [location], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick,
      lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: never, facilityTask: null, ...(readingStationId ? { readingStationId } : {}) };
  }
  state.employees = [
    employee("b023b.technician", "imaging_technician", mri, getRoomNavigationAnchor(mri, getRoomDefinition(mri.roomDefinitionId)!, "staff")),
    employee(FIRST_READER, "radiologist", near, { x: 44, y: 26 }, "northwest"),
    employee(SECOND_READER, "radiologist", far, { x: 47, y: 26 }, "northwest"),
    // An assigned candidate on real floor with no exit to its reading seat.
    employee(ISOLATED_READER, "radiologist", near, { x: isolated.x, y: isolated.y }, "northeast"),
    employee("b023b.reader.isolated-far", "radiologist", far, { x: isolated.x + 1, y: isolated.y }, "northeast"),
  ];
  const visitId = startServiceOperation(state, "income.mri", "visitor", context);
  if (!visitId) throw new Error("Synthetic clinic could not start its scheduled MRI.");
  for (let minute = 0; minute < 40; minute++) {
    if (state.serviceOperations.find(operation => operation.id === visitId)?.status === "in_service") {
      // Start the window with the second reader walking back to an assigned seat.
      const returning = state.employees.find(employee => employee.id === SECOND_READER)!;
      const station = getRadiologistReadingStation(state, returning, context)!;
      returning.location = { x: 39, y: 26 };
      returning.path = findCareAwareFacilityPath(state, context, returning.location, station.location, new Set([far.id]));
      returning.pathIndex = 0;
      returning.lastMovedAtFacilityTick = state.facilityTick;
      state.openChartEncounterId = chart.id;
      return { state: deserializeGameState(serializeGameState(state)), visitId, chartId: chart.id, conceptId };
    }
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `b023b.arrival.${minute}`, advancedAtRealMs: state.createdAtRealMs + (state.facilityTick + 1) * 1000 }, context);
  }
  throw new Error("Synthetic MRI visitor did not reach acquisition.");
}
