import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  formatFounderBreakSeatTargetId,
  gameReducer,
  getFounderBreakSeatClaim,
  isFounderSeatOccupied,
  listFounderSeats,
  serializeGameState,
  type GameState,
} from "../src";

// Owner request (2026-10-07): the founder may sit in any free public seat, and
// waiting patients do not stand while a waiting chair is free.

let sequence = 0;
const tick = (state: GameState) => gameReducer(state, { type: "ADVANCE_TICK", operationId: `reseat.tick.${sequence++}` });

function fixture(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.reseat", campaignSeed: "reseat", createdAtRealMs: 0 });
  state.encounters = {};
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms.push(
    { id: "waiting", roomDefinitionId: "room.waiting", x: 29, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "hall", roomDefinitionId: "room.hallway", x: 28, y: 28, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
  );
  state.doors.push(
    { id: "waiting-east", roomId: "waiting", side: "east", offset: 1, exterior: false },
    { id: "waiting-west", roomId: "waiting", side: "west", offset: 0, exterior: false },
  );
  return state;
}

function addWaitingPatient(
  state: GameState,
  id: string,
  location: { x: number; y: number },
  reservation: NonNullable<GameState["encounters"][string]["waitingDestination"]>,
) {
  const sample = Object.values(createInitialGameState().encounters)[0]!;
  state.encounters[id] = {
    ...(JSON.parse(JSON.stringify(sample)) as typeof sample),
    id,
    checkInStatus: "checked_in",
    lifecycle: "waiting_unopened",
    patientLocation: { ...location },
    patientMovement: null,
    waitingDestination: reservation,
    assignedRoomInstanceId: reservation.roomInstanceId,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER,
  };
  return state.encounters[id]!;
}

const WAITING_CHAIRS = [{ x: 30, y: 28 }, { x: 31, y: 28 }, { x: 29, y: 29 }, { x: 32, y: 29 }];
const FRONT_DESK_CHAIR = { x: 37, y: 31 };
const FRONT_DESK_STANDING = { x: 36, y: 31 };

function fillEveryChair(state: GameState) {
  WAITING_CHAIRS.forEach((chair, index) =>
    addWaitingPatient(state, `encounter.seated.${index}`, chair, { roomInstanceId: "waiting", location: chair, kind: "chair" }));
  addWaitingPatient(state, "encounter.seated.desk", FRONT_DESK_CHAIR, { roomInstanceId: "room.instance.founder_desk", location: FRONT_DESK_CHAIR, kind: "chair" });
}

describe("waiting patients take a free chair", () => {
  it("a standing patient walks to a chair as soon as one frees up", () => {
    let state = fixture();
    fillEveryChair(state);
    const standing = addWaitingPatient(state, "encounter.standing", FRONT_DESK_STANDING, {
      roomInstanceId: "room.instance.founder_desk", location: FRONT_DESK_STANDING, kind: "standing",
    });
    state = tick(state);
    expect(state.encounters[standing.id]!.waitingDestination?.kind).toBe("standing");

    delete state.encounters["encounter.seated.1"];
    state = tick(state);
    const moved = state.encounters[standing.id]!;
    expect(moved.waitingDestination).toEqual({ roomInstanceId: "waiting", location: WAITING_CHAIRS[1], kind: "chair" });
    expect(moved.patientMovement?.kind).toBe("idle_within_room");
    for (let index = 0; index < 30 && state.encounters[standing.id]!.patientMovement; index += 1) state = tick(state);
    expect(state.encounters[standing.id]!.patientLocation).toEqual(WAITING_CHAIRS[1]);
    expect(state.encounters[standing.id]!.assignedRoomInstanceId).toBe("waiting");
  });

  it("hallway overflow moves on a short cadence while every chair is taken", () => {
    let state = fixture();
    fillEveryChair(state);
    addWaitingPatient(state, "encounter.standing.desk", FRONT_DESK_STANDING, {
      roomInstanceId: "room.instance.founder_desk", location: FRONT_DESK_STANDING, kind: "standing",
    });
    const hall = addWaitingPatient(state, "encounter.hall", { x: 28, y: 28 }, { roomInstanceId: "hall", location: { x: 28, y: 28 }, kind: "public_wander" });
    hall.nextIdleActionAtFacilityTick = 0;
    state = tick(state);
    const next = state.encounters[hall.id]!;
    expect(next.waitingDestination?.kind).toBe("public_wander");
    const wait = next.nextIdleActionAtFacilityTick - state.facilityTick;
    expect(wait).toBeGreaterThanOrEqual(1);
    expect(wait).toBeLessThanOrEqual(4);
  });
});

describe("founder seats", () => {
  it("offers the patient-side Front Desk chair but not its standing spot or desk", () => {
    const state = fixture();
    const desk = listFounderSeats(state, PROTOTYPE_DOMAIN_CONTEXT).filter((seat) => seat.roomInstanceId === "room.instance.founder_desk");
    expect(desk).toEqual([expect.objectContaining({ kind: "front_desk_public", location: FRONT_DESK_CHAIR })]);

    const seated = gameReducer(state, { type: "SEAT_FOUNDER_IN_CHAIR", operationId: "seat.desk-public", roomInstanceId: "room.instance.founder_desk", location: FRONT_DESK_CHAIR });
    expect(seated.environment.founderActivity).toMatchObject({ kind: "sit_in_chair", explicitSeat: true });
    expect(seated.environment.founderActivity?.path.at(-1)).toEqual(FRONT_DESK_CHAIR);

    const standing = gameReducer(state, { type: "SEAT_FOUNDER_IN_CHAIR", operationId: "seat.desk-standing", roomInstanceId: "room.instance.founder_desk", location: FRONT_DESK_STANDING });
    expect(standing.operationReceipts["seat.desk-standing"]?.status).toBe("rejected");
  });

  it("names Break Room seats, keeps an employee's seat occupied, and saves the founder's claim", () => {
    const state = fixture();
    state.rooms.push({ id: "break", roomDefinitionId: "room.staff_break", x: 20, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const breakSeats = listFounderSeats(state, PROTOTYPE_DOMAIN_CONTEXT).filter((seat) => seat.kind === "break");
    expect(breakSeats.map((seat) => seat.seatId)).toContain("massage");
    const massage = breakSeats.find((seat) => seat.seatId === "massage")!;
    expect(massage.targetId).toBe(formatFounderBreakSeatTargetId("break", "massage"));

    const employee = state.employees[0];
    if (employee) {
      employee.facilityTask = { kind: "take_break", targetId: "break", seatId: "massage", startedAtFacilityTick: 0, workMinutesRemaining: 10 };
      expect(isFounderSeatOccupied(state, massage)).toBe(true);
      const rejected = gameReducer(state, { type: "SEAT_FOUNDER_IN_CHAIR", operationId: "seat.break-taken", roomInstanceId: "break", location: massage.location, seatId: "massage" });
      expect(rejected.operationReceipts["seat.break-taken"]?.status).toBe("rejected");
      employee.facilityTask = null;
    }

    state.environment.founderActivity = {
      kind: "sit_in_chair", targetId: massage.targetId, path: [massage.location], pathIndex: 0,
      lastMovedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER, explicitSeat: true,
    };
    state.environment.founderLocation = { ...massage.location };
    expect(getFounderBreakSeatClaim(state)).toEqual({ roomId: "break", seatId: "massage" });
    expect(getFounderBreakSeatClaim(deserializeGameState(serializeGameState(state)))).toEqual({ roomId: "break", seatId: "massage" });
  });
});
