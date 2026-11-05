import { createInitialGameState, getRoomDefinition } from "@gamify-surgery/game-domain";

export function restrictedOfficeFixture(careId = "room.ambulatory_or") {
  const state = createInitialGameState(); state.facilityLevel = 3; state.cash = 10_000; state.cashCents = 1_000_000; state.encounters = {};
  const front = state.rooms[0]!; front.x = 10; front.y = 24;
  const care = { id: "restricted.care", roomDefinitionId: careId, x: 15, y: 24, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 };
  const size = getRoomDefinition(careId)!;
  const office = { ...care, id: "surgeon.office", roomDefinitionId: "room.surgeon_office", x: 15 + size.width };
  state.rooms.push(care, office);
  state.doors.push(
    { id: "front.to.care", roomId: front.id, side: "east", offset: 0, exterior: false },
    { id: "office.to.care", roomId: office.id, side: "west", offset: 0, exterior: false },
  );
  return { state, front, care, office };
}
