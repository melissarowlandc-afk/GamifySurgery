import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createInitialGameState, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext, createLevelFourRoomsQaState, LEVEL_FOUR_ROOMS_QA_PLACEMENTS,
  placeLevelFourRoomsQaRooms } from "../../../../tests/fixtures/level-four-rooms";
import { getApprovedPlacementOrientations } from "../facility/roomVisualLayout";
import { getApprovedRoomPresentation } from "../facility/approvedRoomPresentation";
import { createPrototypePlayerView } from "./viewModels";

describe("M3 Build catalog and actual room presentation", () => {
  const normalBalance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
  beforeEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = createLevelFourRoomsQaContext().balanceRelease; });
  afterEach(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = normalBalance; });
  it("keeps L0-L3 locked and previews all four at L3", () => {
    for (const level of [0, 1, 2, 3] as const) {
      const state = createInitialGameState();
      state.facilityLevel = level;
      const view = createPrototypePlayerView(state, null, false, null, true);
      for (const site of LEVEL_FOUR_ROOMS_QA_PLACEMENTS) expect(view.roomOptions.some((room) => room.id === site.roomDefinitionId)).toBe(false);
      if (level === 3) expect(view.lockedRoomOptions.filter((room) => room.unlockLabel === "Unlocks at Facility Level 4").map((room) => room.id).sort())
        .toEqual(LEVEL_FOUR_ROOMS_QA_PLACEMENTS.map((site) => site.roomDefinitionId).sort());
    }
  });

  it("offers ordinary placement at synthetic Level 4 with truthful categories, costs, footprints and caps", () => {
    const state = createLevelFourRoomsQaState();
    const view = createPrototypePlayerView(state, null, false, null, true);
    const expected = [
      ["room.mri", "diagnostics", "$2,400", "$8 upkeep / hr", "4 × 4 tiles", "0 / 1 built"],
      ["room.pediatric_waiting", "patient", "$600", "$1 upkeep / hr", "4 × 4 tiles", "0 / 2 built"],
      ["room.pediatric_examination", "patient", "$600", "$2 upkeep / hr", "3 × 3 tiles", "0 / 4 built"],
      ["room.wound_ostomy", "services", "$1,000", "$2 upkeep / hr", "3 × 3 tiles", "0 / 2 built"],
    ] as const;
    for (const [id, category, costLabel, upkeepLabel, footprintLabel, builtCountLabel] of expected) {
      expect(view.roomOptions.find((room) => room.id === id)).toMatchObject({ category, costLabel, upkeepLabel, footprintLabel, builtCountLabel, enabled: true });
      expect(getApprovedPlacementOrientations(id)).toEqual([0]);
      expect(getApprovedRoomPresentation(id)?.orientations[0]?.footprint).toEqual(id === "room.mri" || id === "room.pediatric_waiting" ? [4, 4] : [3, 3]);
    }
  });

  it("shows inspector/owned-room upgrades with accepted benefits and zero pediatric upkeep uplift", () => {
    const context = createLevelFourRoomsQaContext();
    const state = placeLevelFourRoomsQaRooms(createLevelFourRoomsQaState(context), context);
    const view = createPrototypePlayerView(state, null, false, null, true);
    for (const site of LEVEL_FOUR_ROOMS_QA_PLACEMENTS) {
      const owned = view.ownedRooms.find((room) => room.id === site.roomId)!;
      expect(owned).toMatchObject({ upgradeable: true, maxUpgradeLevel: 5, canUpgrade: true, accessProblem: false });
      expect(owned.benefit?.currentLabel).toBe("Baseline");
      expect(owned.benefit?.nextLabel).toBe(site.roomDefinitionId.startsWith("room.pediatric_") ? "+2 points" : "+6%");
      expect(owned.benefit?.upkeepLabel).toBe(site.roomDefinitionId.startsWith("room.pediatric_") ? undefined : "Upkeep +$1/hr");
    }
    expect(view.roomOptions.find((room) => room.id === "room.mri")).toMatchObject({ enabled: false, atMaximum: true, blockedReason: "Maximum 1 built." });
  });
});
