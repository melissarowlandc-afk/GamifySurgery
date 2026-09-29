import { describe, expect, it } from "vitest";
import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import {
  CHARACTER_STILL_VISIBLE_HEIGHT_CAP,
  characterBitmapLayers,
  characterBitmapRegistration,
  characterStandingBitmapDescriptors,
  characterWalkingBitmapDescriptors,
  characterStillDirection,
  characterStillScaleForAppearance,
} from "./characterBitmapArt";
import { getAllCharacterStillEntries } from "./characterStillRegistry";

const appearance = (stillId: string, roleStyle: PixelAppearanceDescriptor["roleStyle"] = "patient") => ({
  version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", hairShade: 0,
  faceStyle: "round", outfitStyle: "plain", outfitShade: 0, accessory: "none", roleStyle, stillId,
}) as PixelAppearanceDescriptor;

describe("GS-026 individual character still resolver", () => {
  it("maps all four directions without mirroring", () => {
    expect(characterStillDirection("front")).toBe("south");
    expect(characterStillDirection("back")).toBe("north");
    expect(characterStillDirection("side", true)).toBe("east");
    expect(characterStillDirection("side", false)).toBe("west");
    const entry = getAllCharacterStillEntries()[0]!;
    for (const [direction, movingRight, cardinal] of [
      ["front", false, "south"], ["back", false, "north"], ["side", true, "east"], ["side", false, "west"],
    ] as const) {
      const layer = characterBitmapLayers(appearance(entry.id), direction, "idle", movingRight)!.actor;
      expect(layer.asset).toBe(entry.poses.stand[cardinal]);
      expect(layer.flipX).toBe(false);
    }
  });

  it("keeps every walking phase on the same directional standing still", () => {
    const subject = appearance("patient.adult.017");
    const ids = (["walk-a", "walk-neutral", "walk-b"] as const).map((pose) => characterBitmapLayers(subject, "side", pose, true)!.actor.atlas.id);
    expect(new Set(ids).size).toBe(1);
    expect(characterBitmapLayers(subject, "side", "seated", true)!.actor.atlas.id).not.toBe(ids[0]);
  });

  it("keeps all 128 identities on directional standing stills even when a walk frame is requested", () => {
    for (const entry of getAllCharacterStillEntries()) {
      const subject = appearance(entry.id, entry.category === "founder" ? "founder" : "patient");
      for (const [direction, movingRight, cardinal] of [
        ["front", false, "south"], ["back", false, "north"],
        ["side", true, "east"], ["side", false, "west"],
      ] as const) {
        for (let frame = 0; frame < 8; frame += 1) {
          const actor = characterBitmapLayers(subject, direction, "walk-neutral", movingRight, undefined, frame)!.actor;
          expect(actor.asset).toBe(entry.poses.stand[cardinal]);
          expect(actor.flipX).toBe(false);
        }
      }
    }
    expect(characterWalkingBitmapDescriptors(appearance("patient.adult.039"))).toHaveLength(32);
  });

  it("uses seated cardinals, founder clipboard South, and uniform 160x320 registration", () => {
    const entry = getAllCharacterStillEntries().find((candidate) => candidate.id === "founder.01")!;
    const founder = appearance(entry.id, "founder");
    const seated = characterBitmapLayers(founder, "back", "exam-table")!;
    expect(seated.actor.asset).toBe(entry.poses.sit.north);
    expect(Number.isFinite(characterBitmapRegistration(seated).seatContactY)).toBe(true);
    expect(characterBitmapLayers(founder, "side", "interaction", true)!.actor.asset).toBe(entry.clipboard);
    expect(characterBitmapRegistration(seated).cell).toEqual({ width: 160, height: 320 });
  });

  it("uses a known legacy patient identity but leaves unknown art unresolved", () => {
    expect(characterBitmapLayers({ ...appearance("future.unknown"), patientIdentityId: "patient.adult.001" }, "front", "idle")).toBeUndefined();
    expect(characterBitmapLayers({ ...appearance("patient.adult.001"), stillId: undefined, patientIdentityId: "patient.adult.001" }, "front", "idle")!.actor.stillId).toBe("patient.adult.001");
    expect(characterBitmapLayers(appearance("future.unknown"), "front", "idle")).toBeUndefined();
  });

  it("resolves every registry identity to all eight cardinal poses", () => {
    for (const entry of getAllCharacterStillEntries()) {
      const subject = appearance(entry.id);
      for (const pose of ["idle", "seated"] as const) {
        expect(characterBitmapLayers(subject, "front", pose)).toBeDefined();
        expect(characterBitmapLayers(subject, "back", pose)).toBeDefined();
        expect(characterBitmapLayers(subject, "side", pose, true)).toBeDefined();
        expect(characterBitmapLayers(subject, "side", pose, false)).toBeDefined();
      }
    }
  });

  it("prefetches exactly four standing cardinals for a selected live identity", () => {
    const selected = appearance("founder.11", "founder");
    const descriptors = characterStandingBitmapDescriptors(selected);
    expect(descriptors).toHaveLength(4);
    expect(new Set(descriptors.map((asset) => asset.id)).size).toBe(4);
    expect(descriptors.every((asset) => asset.relativePath?.includes("/stand-") === true)).toBe(true);
    expect(characterStandingBitmapDescriptors(appearance("future.unknown"))).toEqual([]);
  });

  it("caps only oversized identities from standing South and keeps one factor across every pose", () => {
    for (const id of ["founder.01", "founder.11", "founder.18", "patient.adult.040", "gs022-new-employee-001"] as const) {
      const subject = appearance(id, id.startsWith("founder.") ? "founder" : "patient");
      const entry = getAllCharacterStillEntries().find((candidate) => candidate.id === id)!;
      const south = entry.poses.stand.south;
      const nativeVisibleHeight = south.anchors.floorY - south.visibleBounds.y;
      const factor = characterStillScaleForAppearance(subject);
      expect(factor).toBeCloseTo(Math.min(1, CHARACTER_STILL_VISIBLE_HEIGHT_CAP / nativeVisibleHeight), 10);
      expect(nativeVisibleHeight * factor).toBeLessThanOrEqual(CHARACTER_STILL_VISIBLE_HEIGHT_CAP + 0.000001);
      for (const [direction, movingRight, pose] of [
        ["front", false, "idle"], ["back", false, "idle"],
        ["side", true, "walk-neutral"], ["side", false, "walk-neutral"],
        ["front", false, "seated"], ["back", false, "exam-table"],
      ] as const) {
        expect(characterBitmapLayers(subject, direction, pose, movingRight)).toBeDefined();
        expect(characterStillScaleForAppearance(subject)).toBe(factor);
      }
    }
  });
});
