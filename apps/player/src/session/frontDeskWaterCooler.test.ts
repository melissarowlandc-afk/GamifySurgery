import { createInitialGameState } from "@gamify-surgery/game-domain";
import { describe, expect, it } from "vitest";

import { createPrototypePlayerView } from "./viewModels";

describe("Front Desk water cooler presentation", () => {
  it("keeps the interactive cooler on the rear-right Front Desk tile", () => {
    const state = createInitialGameState();
    const frontDesk = state.rooms.find(
      (room) => room.roomDefinitionId === "room.front_desk",
    );
    if (!frontDesk) throw new Error("Starter Front Desk is missing.");

    const cooler = createPrototypePlayerView(state, null, false, null).facility
      .waterCooler;
    expect(cooler?.location).toEqual({
      x: frontDesk.x + 4,
      y: frontDesk.y,
    });
  });
});
