import { describe, expect, it } from "vitest";
import {
  CHARACTER_STILL_DIRECTIONS,
  characterStillRegistry,
  getAllCharacterStillEntries,
  getCharacterStill,
  getCharacterStillEntry,
  getClipboardStill,
  resolveCharacterStillAssetUrl,
} from "./characterStillRegistry";
import { PATIENT_CHARACTER_STILLS, STAFF_CHARACTER_STILLS } from "@gamify-surgery/game-domain";

describe("characterStillRegistry", () => {
  it("exposes every packaged identity and cardinal still without fallback", () => {
    expect(characterStillRegistry.counts).toEqual({ identities: 225, cardinalPoses: 1800, clipboardPoses: 30, assets: 1830 });
    const entries = getAllCharacterStillEntries();
    expect(entries).toHaveLength(225);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(225);
    for (const entry of entries) {
      for (const posture of ["stand", "sit"] as const) {
        for (const direction of CHARACTER_STILL_DIRECTIONS) {
          const asset = getCharacterStill(entry.id, posture, direction);
          expect(asset?.width).toBe(160);
          expect(asset?.height).toBe(320);
          const assetRoot = entry.cohort === "employeeCoverage"
            ? "gs026-employee-expansion-v1"
            : entry.cohort === "level3RosterV2"
              ? "level3-roster-v2"
              : entry.cohort === "patientWomen20V3"
                ? "patient-women20-v3"
                : entry.cohort === "patientDemographics20V4"
                  ? "patient-demographics20-v4"
                  : "gs026-stills-v1";
          expect(asset?.url).toBe(`art/characters/${assetRoot}/${entry.id}/${posture}-${direction}.png`);
        }
      }
    }
    const seatedAssets = entries.flatMap((entry) => CHARACTER_STILL_DIRECTIONS.map((direction) => entry.poses.sit[direction]));
    expect(seatedAssets).toHaveLength(900);
    for (const asset of seatedAssets) {
      expect(Number.isFinite(asset.anchors.seatContactY)).toBe(true);
      expect(asset.anchors.seatContactY).toBeGreaterThan(0);
      expect(asset.anchors.seatContactY).toBeLessThan(asset.anchors.floorY);
    }
    expect(getCharacterStill("missing-character", "stand", "south")).toBeUndefined();
    expect(getCharacterStillEntry("missing-character")).toBeUndefined();
  });

  it("renders all twenty approved demographic-gap identities with complete unique poses and authored contacts", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-demographics20-v4");
    expect(additions).toHaveLength(20);
    const poseHashes: string[] = [];
    for (const patient of additions) {
      const entry = getCharacterStillEntry(patient.stillId);
      expect(entry).toMatchObject({ id: patient.stillId, cohort: "patientDemographics20V4", category: "patient-or-general-population", intendedSex: patient.compatibleSexLabel, intendedAge: patient.intendedAge, displayGender: patient.compatibleSexLabel === "Female" ? "Woman" : "Man" });
      expect(entry?.clipboard).toBeUndefined();
      for (const direction of CHARACTER_STILL_DIRECTIONS) {
        const standing = getCharacterStill(patient.stillId, "stand", direction)!;
        const seated = getCharacterStill(patient.stillId, "sit", direction)!;
        expect(standing).toBeDefined(); expect(seated).toBeDefined();
        expect(standing.anchors).toMatchObject({ bodyAxisX: 80, floorY: 287 });
        expect(seated.anchors).toMatchObject({ bodyAxisX: 80, floorY: 287, seatContactStatus: "owner-approved-authored-contact" });
        expect(seated.anchors.seatContactY).toBeGreaterThan(standing.visibleBounds.y);
        expect(seated.anchors.seatContactY).toBeLessThan(seated.anchors.floorY);
        expect(resolveCharacterStillAssetUrl(seated, "/GamifySurgery/")).toBe(`/GamifySurgery/art/characters/patient-demographics20-v4/${patient.stillId}/sit-${direction}.png`);
        poseHashes.push(standing.sha256, seated.sha256);
      }
    }
    expect(new Set(poseHashes).size).toBe(160);
  });

  it("renders all twenty approved women identities with age/sex metadata and four authored seated contacts", () => {
    const additions = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-women20-v3");
    expect(additions).toHaveLength(20);
    for (const patient of additions) {
      const entry = getCharacterStillEntry(patient.stillId);
      expect(entry).toMatchObject({ id: patient.stillId, cohort: "patientWomen20V3", category: "patient-or-general-population", intendedSex: "Female", intendedAge: patient.intendedAge, displayGender: "Woman" });
      expect(entry?.clipboard).toBeUndefined();
      for (const direction of CHARACTER_STILL_DIRECTIONS) {
        const standing = getCharacterStill(patient.stillId, "stand", direction)!;
        const seated = getCharacterStill(patient.stillId, "sit", direction)!;
        expect(standing).toBeDefined(); expect(seated).toBeDefined();
        expect(seated.anchors.seatContactY).toBeGreaterThan(standing.visibleBounds.y);
        expect(seated.anchors.seatContactY).toBeLessThan(seated.anchors.floorY);
        expect(resolveCharacterStillAssetUrl(seated, "/GamifySurgery/")).toBe(`/GamifySurgery/art/characters/patient-women20-v3/${patient.stillId}/sit-${direction}.png`);
      }
    }
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
    expect(getCharacterStillEntry("gs026-employee-001")).toMatchObject({
      cohort: "employeeCoverage",
      category: "employee",
      role: "staff.periop_nurse",
    });
    expect(getCharacterStillEntry("level3-roster-v2.020")).toMatchObject({
      cohort: "level3RosterV2",
      category: "patient-or-general-population",
      intendedAge: 38,
      intendedSex: "Male",
    });
    expect(getCharacterStillEntry("level3-roster-v2.021")).toMatchObject({
      cohort: "level3RosterV2",
      category: "future-pediatric-presentation",
      intendedVisualAge: 6,
      currentClinicalEligibility: "excluded-until-future-approved-pediatric-release",
    });
    expect(getCharacterStillEntry("level3-roster-v2.001")).toMatchObject({
      cohort: "level3RosterV2",
      category: "future-staff-presentation",
      role: "staff.radiologist",
      availability: "level4-locked",
    });
    for (const staff of STAFF_CHARACTER_STILLS) {
      const entry = getCharacterStillEntry(staff.stillId);
      expect(entry, `missing renderable staff still ${staff.stillId}`).toBeDefined();
      for (const direction of CHARACTER_STILL_DIRECTIONS) {
        expect(entry?.poses.stand[direction]).toBeDefined();
        expect(entry?.poses.sit[direction]).toBeDefined();
      }
    }
  });

  it("resolves relative public paths through the configured base path", () => {
    const asset = getCharacterStill("patient.adult.001", "sit", "south");
    expect(asset).toBeDefined();
    expect(resolveCharacterStillAssetUrl(asset!, "/GamifySurgery/")).toBe(
      "/GamifySurgery/art/characters/gs026-stills-v1/patient.adult.001/sit-south.png",
    );
  });
});
