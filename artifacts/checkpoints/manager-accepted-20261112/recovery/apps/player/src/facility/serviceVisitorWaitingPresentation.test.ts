import { describe, expect, it } from "vitest";
import { gameReducer } from "@gamify-surgery/game-domain";
import { serviceQueueFixture } from "../../../../packages/game-domain/tests/service-queue-waiting.fixture";
import { createPrototypePlayerView } from "../session/viewModels";
import { serviceVisitorWaitingSupport } from "./serviceVisitorWaitingPresentation";

describe("service queue facility presentation", () => {
  it.each(["visitor", "encounter"] as const)("projects the %s's real waiting-room location and seated support", (kind) => {
    let { state, checkIn } = serviceQueueFixture("room.ultrasound", kind);
    for (let index = 0; index < 20; index++) state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `waiting.render.${index}` });
    const facility = createPrototypePlayerView(state, null, false, null).facility;
    const actor = kind === "visitor" ? facility.serviceVisitors!.find((row) => row.instanceId === "queued")!
      : facility.patients!.find((row) => row.instanceId === "waiting.actor")!;
    expect(actor.location).toEqual(state.serviceOperations.find((row) => row.id === "queued")!.location);
    expect(actor.location).not.toEqual(checkIn);
    expect(actor.moving).toBe(false);
    if (kind === "visitor") expect(serviceVisitorWaitingSupport(facility, actor)).toEqual({ supportRole: "waiting-seat", supportRoomInstanceId: "waiting" });
    else expect(actor.supportRole).toBe("waiting-seat");
  });

  it("does not attach walking, standing-overflow or clinical actors to waiting chairs", () => {
    const { state } = serviceQueueFixture();
    const facility = createPrototypePlayerView(state, null, false, null).facility;
    const chair = facility.founderChairs!.find((candidate) => candidate.roomInstanceId === "waiting")!;
    expect(serviceVisitorWaitingSupport(facility, { location: chair.location, moving: true })).toBeUndefined();
    expect(serviceVisitorWaitingSupport(facility, { location: chair.location, moving: false, supportRole: "ultrasound-patient" })).toBeUndefined();
    expect(serviceVisitorWaitingSupport(facility, { location: { x: 32, y: 24 }, moving: false })).toBeUndefined();
  });
});
