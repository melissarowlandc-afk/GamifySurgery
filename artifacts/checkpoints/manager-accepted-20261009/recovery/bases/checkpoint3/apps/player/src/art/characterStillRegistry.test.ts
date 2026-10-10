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
import ownerApproval from "../../../../tools/character-mapping/future-roster20-v5/owner-approval.json";
import v6aApproval from "../../../../tools/character-mapping/patient-gapfill-v6a/owner-approval.json";
import v6bApproval from "../../../../tools/character-mapping/patient-gapfill-v6b/owner-approval.json";
import v6dApproval from "../../../../tools/character-mapping/staff-gapfill-v6d/owner-approval.json";
import v6cApproval from "../../../../tools/character-mapping/patient-gapfill-v6c/owner-approval.json";

describe("characterStillRegistry", () => {
  it("exposes every packaged identity and cardinal still without fallback", () => {
    expect(characterStillRegistry.counts).toEqual({ identities: 318, cardinalPoses: 2544, clipboardPoses: 30, assets: 2574 });
    const entries = getAllCharacterStillEntries();
    expect(entries).toHaveLength(318);
    expect(new Set(entries.map((entry) => entry.id)).size).toBe(318);
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
                  : entry.cohort === "futureRoster20V5"
                    ? "future-roster20-v5"
                    : entry.cohort === "patientGapfillV6a"
                      ? "patient-gapfill-v6a"
                      : entry.cohort === "patientGapfillV6b"
                        ? "patient-gapfill-v6b"
                        : entry.cohort === "patientGapfillV6c"
                          ? "patient-gapfill-v6c"
                          : entry.cohort === "staffGapfillV6d"
                            ? "staff-gapfill-v6d"
                            : "gs026-stills-v1";
          expect(asset?.url).toBe(`art/characters/${assetRoot}/${entry.id}/${posture}-${direction}.png`);
        }
      }
    }
    const seatedAssets = entries.flatMap((entry) => CHARACTER_STILL_DIRECTIONS.map((direction) => entry.poses.sit[direction]));
    expect(seatedAssets).toHaveLength(1272);
    for (const asset of seatedAssets) {
      expect(Number.isFinite(asset.anchors.seatContactY)).toBe(true);
      expect(asset.anchors.seatContactY).toBeGreaterThan(0);
      expect(asset.anchors.seatContactY).toBeLessThan(asset.anchors.floorY);
    }
    expect(getCharacterStill("missing-character", "stand", "south")).toBeUndefined();
    expect(getCharacterStillEntry("missing-character")).toBeUndefined();
  });

  it("renders all twenty v6a patients with the exact manager-accepted bytes and authored contacts", () => {
    expect(v6aApproval).toMatchObject({ status: "approved", approvedBy: "GamifySurgery manager (Claude Code)", authorizedBy: "owner" });
    const entries = getAllCharacterStillEntries().filter(entry => entry.cohort === "patientGapfillV6a");
    const patients = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-gapfill-v6a");
    expect(entries).toHaveLength(20); expect(patients).toHaveLength(20);
    expect(entries.map(entry => entry.id)).toEqual(patients.map(entry => entry.stillId));
    const acceptedPoses = v6aApproval.acceptedPoses as Record<string, Record<string, string>>;
    const contacts = v6aApproval.acceptedContacts as Record<string, Record<string, number>>;
    const hashes: string[] = [];
    for (const patient of patients) {
      const entry = getCharacterStillEntry(patient.stillId)!;
      const number = patient.stillId.split(".").at(-1)!;
      expect(entry).toMatchObject({ category: "patient-or-general-population", intendedAge: patient.intendedAge, intendedSex: patient.compatibleSexLabel, displayGender: patient.compatibleSexLabel === "Female" ? "Woman" : "Man" });
      expect(entry.role).toBeUndefined(); expect(entry.clipboard).toBeUndefined();
      for (const posture of ["stand", "sit"] as const) for (const direction of CHARACTER_STILL_DIRECTIONS) {
        const asset = getCharacterStill(entry.id, posture, direction)!;
        expect(asset.sha256).toBe(acceptedPoses[number]![`${posture}-${direction}`]);
        expect(asset.anchors).toMatchObject({ bodyAxisX: 80, floorY: 287 });
        if (posture === "sit") expect(asset.anchors).toMatchObject({ seatContactY: contacts[number]![direction], seatContactStatus: "owner-delegated-manager-approved-authored-contact" });
        expect(resolveCharacterStillAssetUrl(asset, "/GamifySurgery/")).toBe(`/GamifySurgery/art/characters/patient-gapfill-v6a/${entry.id}/${posture}-${direction}.png`);
        hashes.push(asset.sha256);
      }
    }
    expect(new Set(hashes).size).toBe(160);
  });

  it("renders all twenty v6b patients with the exact manager-accepted bytes and authored contacts", () => {
    expect(v6bApproval).toMatchObject({ status: "approved", approvedBy: "GamifySurgery manager (Claude Code)", authorizedBy: "owner" });
    const entries = getAllCharacterStillEntries().filter(entry => entry.cohort === "patientGapfillV6b");
    const patients = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-gapfill-v6b");
    expect(entries).toHaveLength(20); expect(patients).toHaveLength(20);
    expect(entries.map(entry => entry.id)).toEqual(patients.map(entry => entry.stillId));
    const acceptedPoses = v6bApproval.acceptedPoses as Record<string, Record<string, string>>;
    const contacts = v6bApproval.acceptedContacts as Record<string, Record<string, number>>;
    const hashes: string[] = [];
    for (const patient of patients) {
      const entry = getCharacterStillEntry(patient.stillId)!;
      const number = patient.stillId.split(".").at(-1)!;
      expect(entry).toMatchObject({ category: "patient-or-general-population", intendedAge: patient.intendedAge, intendedSex: patient.compatibleSexLabel, displayGender: patient.compatibleSexLabel === "Female" ? "Woman" : "Man" });
      expect(entry.role).toBeUndefined(); expect(entry.clipboard).toBeUndefined();
      for (const posture of ["stand", "sit"] as const) for (const direction of CHARACTER_STILL_DIRECTIONS) {
        const asset = getCharacterStill(entry.id, posture, direction)!;
        expect(asset.sha256).toBe(acceptedPoses[number]![`${posture}-${direction}`]);
        expect(asset.anchors).toMatchObject({ bodyAxisX: 80, floorY: 287 });
        if (posture === "sit") expect(asset.anchors).toMatchObject({ seatContactY: contacts[number]![direction], seatContactStatus: "owner-delegated-manager-approved-authored-contact" });
        expect(resolveCharacterStillAssetUrl(asset, "/GamifySurgery/")).toBe(`/GamifySurgery/art/characters/patient-gapfill-v6b/${entry.id}/${posture}-${direction}.png`);
        hashes.push(asset.sha256);
      }
    }
    expect(new Set(hashes).size).toBe(160);
  });

  it("renders every accepted patient-gapfill-v6c pose with its exact approved hash, URL and authored contact", () => {
    expect(v6cApproval).toMatchObject({ status: "approved", approvedBy: "GamifySurgery manager (Claude Code)", authorizedBy: "owner" });
    const entries = getAllCharacterStillEntries().filter(entry => entry.cohort === "patientGapfillV6c");
    const designs = PATIENT_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "patient-gapfill-v6c");
    expect(entries).toHaveLength(19); expect(designs).toHaveLength(19);
    expect(entries.map(entry => entry.id)).toEqual(designs.map(entry => entry.stillId));
    const acceptedPoses = v6cApproval.acceptedPoses as Record<string, Record<string, string>>;
    const contacts = v6cApproval.acceptedContacts as Record<string, Record<string, number>>;
    const hashes: string[] = [];
    for (const entry of entries) {
      const number = entry.id.split(".").at(-1)!;
      expect(entry.category).toBe("patient-or-general-population"); expect(entry.clipboard).toBeUndefined();
      expect(entry.role).toBeUndefined();
      for (const posture of ["stand", "sit"] as const) for (const direction of CHARACTER_STILL_DIRECTIONS) {
        const asset = getCharacterStill(entry.id, posture, direction)!;
        expect(asset.sha256).toBe(acceptedPoses[number]![`${posture}-${direction}`]);
        expect(asset.anchors).toMatchObject({ bodyAxisX: 80, floorY: 287 });
        if (posture === "sit") expect(asset.anchors).toMatchObject({ seatContactY: contacts[number]![direction], seatContactStatus: "owner-delegated-manager-approved-authored-contact" });
        expect(resolveCharacterStillAssetUrl(asset, "/GamifySurgery/")).toBe(`/GamifySurgery/art/characters/patient-gapfill-v6c/${entry.id}/${posture}-${direction}.png`);
        hashes.push(asset.sha256);
      }
    }
    expect(new Set(hashes).size).toBe(152);
  });

  it("renders every accepted staff-gapfill-v6d pose with its exact approved hash, URL and authored contact", () => {
    expect(v6dApproval).toMatchObject({ status: "approved", approvedBy: "GamifySurgery manager (Claude Code)", authorizedBy: "owner" });
    const entries = getAllCharacterStillEntries().filter(entry => entry.cohort === "staffGapfillV6d");
    const designs = STAFF_CHARACTER_STILLS.filter(entry => entry.sourceCohort === "staff-gapfill-v6d");
    expect(entries).toHaveLength(14); expect(designs).toHaveLength(14);
    expect(entries.map(entry => entry.id)).toEqual(designs.map(entry => entry.stillId));
    const acceptedPoses = v6dApproval.acceptedPoses as Record<string, Record<string, string>>;
    const contacts = v6dApproval.acceptedContacts as Record<string, Record<string, number>>;
    const hashes: string[] = [];
    for (const entry of entries) {
      const number = entry.id.split(".").at(-1)!;
      expect(entry.category).toBe("employee"); expect(entry.clipboard).toBeUndefined();
      const design = designs.find(design => design.stillId === entry.id)!;
      expect(entry.eligibleStaffRoleDefinitionIds).toEqual(design.eligibleStaffRoleDefinitionIds); expect(entry.role).toBe(design.eligibleStaffRoleDefinitionIds[0]);
      for (const posture of ["stand", "sit"] as const) for (const direction of CHARACTER_STILL_DIRECTIONS) {
        const asset = getCharacterStill(entry.id, posture, direction)!;
        expect(asset.sha256).toBe(acceptedPoses[number]![`${posture}-${direction}`]);
        expect(asset.anchors).toMatchObject({ bodyAxisX: 80, floorY: 287 });
        if (posture === "sit") expect(asset.anchors).toMatchObject({ seatContactY: contacts[number]![direction], seatContactStatus: "owner-delegated-manager-approved-authored-contact" });
        expect(resolveCharacterStillAssetUrl(asset, "/GamifySurgery/")).toBe(`/GamifySurgery/art/characters/staff-gapfill-v6d/${entry.id}/${posture}-${direction}.png`);
        hashes.push(asset.sha256);
      }
    }
    expect(new Set(hashes).size).toBe(112);
  });

  it("registers the GS-033 batch with all 160 exact approved pose hashes and authored contacts", () => {
    const entries = getAllCharacterStillEntries().filter(entry => entry.cohort === "futureRoster20V5");
    expect(entries).toHaveLength(20);
    expect(entries.filter(entry => entry.role === "staff.radiologist")).toHaveLength(12);
    expect(entries.filter(entry => entry.plannedStaffRole)).toHaveLength(4);
    expect(entries.filter(entry => entry.category === "patient-or-general-population")).toHaveLength(4);
    const approvedPoseHashes = ownerApproval.acceptedPoses as Record<string, Record<string, string>>;
    const hashes: string[] = [];
    for (const entry of entries) {
      const number = entry.id.split(".").at(-1)!;
      expect(entry.clipboard).toBeUndefined();
      for (const posture of ["stand", "sit"] as const) for (const direction of CHARACTER_STILL_DIRECTIONS) {
        const asset = getCharacterStill(entry.id, posture, direction)!;
        expect(asset.sha256).toBe(approvedPoseHashes[number]![`${posture}-${direction}`]);
        expect(asset.anchors).toMatchObject({ bodyAxisX: 80, floorY: 287 });
        if (posture === "sit") expect(asset.anchors).toMatchObject({ seatContactStatus: "owner-approved-authored-contact" });
        expect(resolveCharacterStillAssetUrl(asset, "/GamifySurgery/")).toBe(`/GamifySurgery/art/characters/future-roster20-v5/${entry.id}/${posture}-${direction}.png`);
        hashes.push(asset.sha256);
      }
      if (entry.plannedStaffRole) {
        expect(entry.eligibleStaffRoleDefinitionIds).toEqual([]);
        expect(entry.role).toBeUndefined();
      }
    }
    expect(new Set(hashes).size).toBe(160);
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
