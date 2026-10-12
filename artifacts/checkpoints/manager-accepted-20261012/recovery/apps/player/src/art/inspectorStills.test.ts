import { describe, expect, it } from "vitest";
import { INSPECTOR_CHARACTER_STILLS } from "@gamify-surgery/game-domain";
import approval from "../../../../artifacts/character-statics/inspector-v6f/runtime-approval.json";
import { CHARACTER_STILL_DIRECTIONS, getCharacterStillEntry, getCharacterStill, resolveCharacterStillAssetUrl } from "./characterStillRegistry";
import { characterBitmapLayers, characterStandingBitmapDescriptors } from "./characterBitmapArt";
import { isInspectorBitmapAsset } from "../mobile/performance/inspectorAssets";

describe("manager-accepted inspector v6f stills", () => {
  it("binds all eighty exact poses and forty contacts to the inspector-only registry role", () => {
    const hashes = new Set<string>();
    for (const row of INSPECTOR_CHARACTER_STILLS) {
      const entry = getCharacterStillEntry(row.stillId)!;
      expect(entry).toMatchObject({ cohort: "inspectorV6f", category: "inspection-presentation", role: "inspection-agent", eligibleStaffRoleDefinitionIds: [] });
      const number = row.stillId.split(".")[1]! as keyof typeof approval.approvedPoses;
      for (const posture of ["stand", "sit"] as const) for (const direction of CHARACTER_STILL_DIRECTIONS) {
        const pose = getCharacterStill(row.stillId, posture, direction)!;
        expect(pose.sha256).toBe(approval.approvedPoses[number][`${posture}-${direction}`]); hashes.add(pose.sha256);
        expect(pose.anchors).toMatchObject({ bodyAxisX: 80, floorY: 287 });
        if (posture === "sit") expect(pose.anchors.seatContactY).toBe(approval.approvedContacts[number][direction]);
        expect(resolveCharacterStillAssetUrl(pose, "/GamifySurgery/")).toBe(`/GamifySurgery/art/characters/inspector-v6f/${row.stillId}/${posture}-${direction}.png`);
      }
    }
    expect(hashes.size).toBe(80);
  });
  it("uses clipboard-bearing standing cardinals for the existing hop motion in both asset paths", () => {
    for (const row of INSPECTOR_CHARACTER_STILLS) {
      const appearance = { version: "pixel-avatar.v1" as const, stillId: row.stillId, bodyShape: "average" as const,
        hairStyle: "short" as const, hairShade: 3 as const, faceStyle: "round" as const, skinTone: 1 as const,
        outfitStyle: "plain" as const, outfitShade: 1 as const, accessory: "none" as const };
      expect(characterStandingBitmapDescriptors(appearance).every(isInspectorBitmapAsset)).toBe(true);
      for (const [direction, right, cardinal] of [["front", false, "south"], ["back", false, "north"], ["side", true, "east"], ["side", false, "west"]] as const) {
        const layer = characterBitmapLayers(appearance, direction, "walk-a", right)!;
        expect(layer.actor.asset.sha256).toBe(getCharacterStill(row.stillId, "stand", cardinal)!.sha256);
        expect(layer.actor.flipX).toBe(false);
      }
    }
  });
});
