import { describe, expect, it } from "vitest";
import {
  getFacilityAccessValidation, getRoomDefinition, pediatricPairAtReservation,
  pediatricRoomAtPoint, type DomainContext, type GameState,
} from "../src";
import {
  acceptedWork, actorRows, command, doorRemodelFixture, EXAM, must, NORTH,
  pairedFixture, replacementDoor, routeProblems, serviceFixture, SOUTH, tick,
  travelBound, type Blocker,
} from "./build-mode-door-remodel.fixture";

function removePaused(state: GameState, doorId: string, ctx?: DomainContext) {
  const before = acceptedWork(state), positions = actorRows(state).map(actor => [actor.id, actor.point]);
  const result = command(state, { type: "REMOVE_DOOR", doorId }, ctx);
  expect(result.receipt?.status, `B-015: paused remodeling must permit this interior door edit. ${result.receipt?.message}`).toBe("applied");
  expect(result.state.doors.some(door => door.id === doorId)).toBe(false);
  expect(result.state.paused).toBe(true);
  expect(acceptedWork(result.state), "Retain accepted work/assignments/priority/quotes instead of clearing blockers").toBe(before);
  expect(actorRows(result.state).map(actor => [actor.id, actor.point]), "The paused edit cannot advance or teleport people").toEqual(positions);
  return result.state;
}

function frozenServiceWork(state: GameState, ids: string[]) {
  return ids.map(id => {
    const op = state.serviceOperations.find(op => op.id === id)!;
    return { id, created: op.createdAtFacilityTick, phases: structuredClone(op.frozenOperationPhases),
      fee: op.quoteFee, tasks: op.periopNurseAttention!.tasks.map(task => task.durationMinutes) };
  });
}

function finishServiceWork(state: GameState, context: DomainContext, ids: string[], frozen: ReturnType<typeof frozenServiceWork>, earliestFinish: number) {
  const bound = frozen.reduce((sum, row) => sum + row.phases!.reduce((n, phase) => n + phase.durationMinutes, 0) + row.tasks.reduce((a, b) => a + b, 0), 0) + ids.length * travelBound(state, context);
  const procedureOrder = [ids[0]!];
  for (let minute = 0; minute < bound; minute++) {
    const before = state; state = tick(state, context);
    expect(routeProblems(before, state, context)).toEqual([]);
    for (const row of frozen) {
      const op = state.serviceOperations.find(op => op.id === row.id)!;
      expect({ created: op.createdAtFacilityTick, phases: op.frozenOperationPhases, fee: op.quoteFee,
        tasks: op.periopNurseAttention!.tasks.map(task => task.durationMinutes) }).toEqual({ created: row.created, phases: row.phases, fee: row.fee, tasks: row.tasks });
      if (op.phaseIndex === 1 && op.status === "in_service" && !procedureOrder.includes(op.id)) procedureOrder.push(op.id);
      if (op.id === ids[0] && op.phaseIndex > 1) expect(state.facilityTick).toBeGreaterThanOrEqual(earliestFinish);
    }
    if (ids.every(id => state.serviceOperations.find(op => op.id === id)!.status === "completed")) break;
  }
  expect(procedureOrder).toEqual(ids);
  for (const id of ids) {
    const op = state.serviceOperations.find(op => op.id === id)!;
    expect(op.status, `No stuck accepted queue after ${bound} derived ticks`).toBe("completed");
    expect(op.periopNurseAttention!.tasks.every(task => task.remainingMinutes === 0 && task.completedAtFacilityTick !== null)).toBe(true);
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(id))).toHaveLength(1);
  }
}

describe("B-015 paused interior-door editing, D-2026-11-18-10", () => {
  for (const blocker of ["staff-home", "queued", "assigned", "occupant", "inbound"] as Blocker[]) for (const only of [false, true]) {
    it(`B-015 permits removing ${only ? "the ONLY" : "a spare"} door with ${blocker}, without advancing time or discarding the blocker`, () => {
      let state = must(doorRemodelFixture(blocker, only), { type: "SET_PAUSED", paused: true });
      const doorId = only ? SOUTH : NORTH;
      state = removePaused(state, doorId);
      const access = getFacilityAccessValidation(state);
      if (only) {
        expect(access.valid).toBe(false);
        expect(access.unreachableRoomIds).toContain(EXAM);
        expect(access.issues.join(" ")).toContain(getRoomDefinition("room.examination")!.displayName);
      } else expect(access.valid).toBe(true);
    });
  }

  it("B-015 repairs both lanes of real pediatric paired travel after replacing the only door", () => {
    const fixture = pairedFixture(), { context, familyId, childId } = fixture;
    let state = must(fixture.state, { type: "SET_PAUSED", paused: true }, context);
    const target = structuredClone(state.pediatricFamilies![familyId]!.reservation!);
    const old = state.doors.filter(door => door.roomId === target.roomInstanceId);
    expect(old).toHaveLength(1);
    state = removePaused(state, old[0]!.id, context);
    expect(getFacilityAccessValidation(state, context).unreachableRoomIds).toContain(target.roomInstanceId);
    const replacement = replacementDoor(state, target.roomInstanceId, old, context);
    state = must(state, { type: "PLACE_DOOR", doorId: replacement.id, roomId: replacement.roomId, side: replacement.side, offset: replacement.offset }, context);
    expect(state.pediatricFamilies![familyId]!.reservation).toEqual(target);
    state = must(state, { type: "SET_PAUSED", paused: false }, context);
    const bound = travelBound(state, context);
    for (let minute = 0; minute < bound; minute++) {
      const before = state; state = tick(state, context);
      const family = state.pediatricFamilies![familyId]!, parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
      expect(routeProblems(before, state, context)).toEqual([]);
      expect(family.movement?.doorIds.every(id => state.doors.some(door => door.id === id)) ?? true).toBe(true);
      expect(pediatricRoomAtPoint(state, context, state.encounters[childId]!.patientLocation)?.id).toBe(pediatricRoomAtPoint(state, context, parent.location)?.id);
      if (pediatricPairAtReservation(state, family)) break;
    }
    expect(pediatricPairAtReservation(state, state.pediatricFamilies![familyId]!), `No stranded family after ${bound} travel-derived ticks`).toBe(true);
    expect(state.pediatricFamilies![familyId]!.reservation).toEqual(target);
  });

  it("B-015 preserves active resources, frozen nursing/care timing and FIFO accepted procedure work across a doorless intermediate", () => {
    const fixture = serviceFixture(), { context, ids, roomId } = fixture;
    let state = must(fixture.state, { type: "SET_PAUSED", paused: true }, context);
    const frozen = frozenServiceWork(state, ids);
    const running = state.serviceOperations.find(op => op.id === ids[0])!, earliestFinish = running.phaseEndsAtFacilityTick!;
    const doors = state.doors.filter(door => door.roomId === roomId);
    for (const door of doors) state = removePaused(state, door.id, context);
    expect(getFacilityAccessValidation(state, context).unreachableRoomIds).toContain(roomId);
    const replacement = replacementDoor(state, roomId, doors, context);
    state = must(state, { type: "PLACE_DOOR", doorId: replacement.id, roomId, side: replacement.side, offset: replacement.offset }, context);
    state = must(state, { type: "SET_PAUSED", paused: false }, context);
    finishServiceWork(state, context, ids, frozen, earliestFinish);
  });

  it("B-015 fixture control: unedited real paired and procedure travel can reach their normal destinations", () => {
    const paired = pairedFixture(); let state = paired.state;
    const bound = travelBound(state, paired.context);
    for (let minute = 0; minute < bound && !pediatricPairAtReservation(state, state.pediatricFamilies![paired.familyId]!); minute++) {
      const before = state; state = tick(state, paired.context);
      expect(routeProblems(before, state, paired.context)).toEqual([]);
    }
    expect(pediatricPairAtReservation(state, state.pediatricFamilies![paired.familyId]!)).toBe(true);
    const service = serviceFixture();
    expect(service.state.serviceOperations.find(op => op.id === service.ids[0])).toMatchObject({ status: "in_service", phaseIndex: 1 });
    finishServiceWork(service.state, service.context, service.ids, frozenServiceWork(service.state, service.ids),
      service.state.serviceOperations.find(op => op.id === service.ids[0])!.phaseEndsAtFacilityTick!);
  });
});
