import { describe, expect, it } from "vitest";
import { deserializeGameState, gameReducer, getRoomDefinition, getRoomNavigationAnchor, serializeGameState } from "@gamify-surgery/game-domain";
import { serviceQueueFixture } from "../../../../packages/game-domain/tests/service-queue-waiting.fixture";
import { createPrototypePlayerView } from "../session/viewModels";
import { serviceVisitorWaitingSupport } from "./serviceVisitorWaitingPresentation";

describe("restroom recovery presentation", () => {
  it.each(["visitor", "encounter"] as const)("shows the repaired %s in a real waiting seat after reopen and one tick", kind => {
    const fixture = serviceQueueFixture("room.ultrasound", kind);
    let state = fixture.state;
    const front = state.rooms[0]!;
    const bathroom = { id: "bathroom.reopen", roomDefinitionId: "room.bathroom", x: front.x + 5, y: front.y + 1,
      orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 };
    state.rooms.push(bathroom);
    state.doors.push({ id: "bathroom.reopen.west", roomId: bathroom.id, side: "west", offset: 1, exterior: false });
    const inside = getRoomNavigationAnchor(bathroom, getRoomDefinition(bathroom.roomDefinitionId)!);
    fixture.operation.location = inside; fixture.operation.path = [inside]; fixture.operation.pathIndex = 0;
    if (kind === "encounter") state.encounters[fixture.operation.actorId]!.patientLocation = inside;
    state = deserializeGameState(serializeGameState(state));
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: "restroom.presentation.reopen" });
    const view = createPrototypePlayerView(state, null, false, null).facility;
    const actor = kind === "visitor" ? view.serviceVisitors!.find(row => row.instanceId === fixture.operation.id)!
      : view.patients!.find(row => row.instanceId === fixture.operation.actorId)!;
    expect(actor.location).not.toEqual(inside);
    expect(actor.location?.x).toBeLessThan(33);
    expect(actor.moving).toBe(false);
    if (kind === "visitor") expect(serviceVisitorWaitingSupport(view, actor)).toMatchObject({ supportRole: "waiting-seat", supportRoomInstanceId: "waiting" });
    else expect(actor.supportRole).toBe("waiting-seat");
  });
});
