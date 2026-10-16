import { describe, expect, it } from "vitest";
import { employeeTrainingBenefitLabel } from "./employeeTrainingViewModels";
import { characterBitmapLayers } from "../art/characterBitmapArt";
import { getCharacterStillEntry } from "../art/characterStillRegistry";
import { createPixelAppearance, staffStillEligibleEntries } from "@gamify-surgery/game-domain";

describe("APP approved art and distinct training presentation", () => {
  it("labels the APP revenue percentage without a GLP-1 consult amount", () => {
    expect(employeeTrainingBenefitLabel("staff.app", 20, 50)).toBe("Increases APP appointment revenue 20%");
    expect(employeeTrainingBenefitLabel("staff.app", 10, 500)).toBe("Increases APP appointment revenue 10%");
    expect(employeeTrainingBenefitLabel("staff.glp1_np", 20, 50)).toBe("Adds $10 per consult");
  });

  it("keeps the selected APP identity for standing, walking hops and seated cardinals", () => {
    for (const row of staffStillEligibleEntries("staff.app")) {
      const appearance = { ...createPixelAppearance("APP", "staff", row.stillId, "app"), stillId: row.stillId };
      expect(getCharacterStillEntry(row.stillId)).toMatchObject({ role: "staff.app", eligibleStaffRoleDefinitionIds: ["staff.app"] });
      for (const [cardinal, direction, movingRight] of [["north", "back", false], ["south", "front", false], ["east", "side", true], ["west", "side", false]] as const) {
        const standing = characterBitmapLayers(appearance, direction, "idle", movingRight)!;
        const walking = characterBitmapLayers(appearance, direction, "walk-a", movingRight)!;
        const seated = characterBitmapLayers(appearance, direction, "seated", movingRight)!;
        expect(standing.actor.stillId).toBe(row.stillId);
        expect(walking.actor.asset).toEqual(standing.actor.asset);
        expect(seated.actor.asset.url).toContain(`/sit-${cardinal}.png`);
      }
    }
  });
});
