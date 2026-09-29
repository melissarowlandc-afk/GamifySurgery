import { describe, expect, it } from "vitest";
import {
  CHARACTER_STILL_DIRECTIONS,
  getAllCharacterStillEntries,
  getCharacterStill,
  getCharacterStillEntry,
  getClipboardStill,
  resolveCharacterStillAssetUrl,
} from "./characterStillRegistry";

describe("characterStillRegistry", () => {
  it("exposes every packaged identity and cardinal still without fallback", () => {
    const entries = getAllCharacterStillEntries();
    expect(entries).toHaveLength(128);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(128);
    for (const entry of entries) {
      for (const posture of ["stand", "sit"] as const) {
        for (const direction of CHARACTER_STILL_DIRECTIONS) {
          const asset = getCharacterStill(entry.id, posture, direction);
          expect(asset?.width).toBe(160);
          expect(asset?.height).toBe(320);
          expect(asset?.url).toBe(`art/characters/gs026-stills-v1/${entry.id}/${posture}-${direction}.png`);
        }
      }
    }
    const seatedAssets = entries.flatMap((entry) => CHARACTER_STILL_DIRECTIONS.map((direction) => entry.poses.sit[direction]));
    expect(seatedAssets).toHaveLength(512);
    for (const asset of seatedAssets) {
      expect(Number.isFinite(asset.anchors.seatContactY)).toBe(true);
      expect(asset.anchors.seatContactY).toBeGreaterThan(0);
      expect(asset.anchors.seatContactY).toBeLessThan(asset.anchors.floorY);
    }
    expect(getCharacterStill("missing-character", "stand", "south")).toBeUndefined();
    expect(getCharacterStillEntry("missing-character")).toBeUndefined();
  });

  it("keeps optional clipboard and demographic fields explicit", () => {
    const entries = getAllCharacterStillEntries();
    expect(entries.filter((entry) => entry.clipboard)).toHaveLength(30);
    expect(getClipboardStill("founder.01")?.url).toContain("clipboard-south.png");
    expect(getClipboardStill("patient.adult.001")).toBeUndefined();
    expect(getCharacterStillEntry("gs022-new-person-001")).toMatchObject({
      cohort: "patientPublic20",
      category: "patient-or-general-population",
      intendedAge: 28,
      intendedSex: "Female",
      displayGender: "Woman",
    });
    expect(getCharacterStillEntry("gs022-new-employee-001")).toMatchObject({
      cohort: "employee20",
      category: "employee",
      role: "staff.receptionist",
    });
    expect(getCharacterStillEntry("patient.adult.001")).not.toHaveProperty("intendedAge");
  });

  it("resolves relative public paths through the configured base path", () => {
    const asset = getCharacterStill("patient.adult.001", "sit", "south");
    expect(asset).toBeDefined();
    expect(resolveCharacterStillAssetUrl(asset!, "/GamifySurgery/")).toBe(
      "/GamifySurgery/art/characters/gs026-stills-v1/patient.adult.001/sit-south.png",
    );
  });
});
