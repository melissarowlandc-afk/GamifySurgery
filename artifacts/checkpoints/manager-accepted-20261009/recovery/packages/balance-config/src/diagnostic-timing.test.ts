import { describe, expect, it } from "vitest";

import { getApprovedRoomNavigation } from "./approved-room-layouts";
import {
  DIAGNOSTIC_PROFILE_TIMING_MAPPINGS,
  DIAGNOSTIC_RADIOLOGIST_ROLE_ID,
  DIAGNOSTIC_READING_ROOM_DEFINITION_ID,
  DIAGNOSTIC_READING_WORKSTATIONS,
  DIAGNOSTIC_SERVICE_TIMING_RULES,
  DIAGNOSTIC_TIMING_RESOURCES,
  DIAGNOSTIC_TIMING_TABLE,
  DIAGNOSTIC_TIMING_VERSION,
  getDiagnosticTimingProfileMapping,
  getDiagnosticTimingRuleForProfile,
  getDiagnosticTimingRuleForService,
} from "./diagnostic-timing";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";

describe("versioned owner-approved diagnostic timing", () => {
  it("separates approved result phases from existing acquisition and care duration inputs", () => {
    expect(DIAGNOSTIC_TIMING_VERSION).toBe("diagnostic-timing.v1");
    expect(DIAGNOSTIC_TIMING_TABLE).toEqual({
      version: DIAGNOSTIC_TIMING_VERSION,
      bladderScan: {
        offsiteTotalMinutes: 30,
        onsiteAcquisitionMinutes: 5,
        requiresInterpretation: false,
      },
      imaging: {
        offsiteInterpretationMinutes: 30,
        onsiteInterpretationMinutes: 5,
        acquisitionDurationSource: "existing_route",
        offsiteTotalIncludesInterpretation: true,
      },
      collectedLab: {
        offsiteTotalMinutes: 120,
        onsiteCollectionMinutes: 15,
        offsiteProcessingMinutes: 60,
        onsiteProcessingMinutes: 15,
      },
      pathology: {
        offsiteProcessingMinutes: 60,
        onsiteProcessingMinutes: 30,
        acquisitionDurationSource: "existing_procedure",
      },
      endoscopy: {
        careDurationSource: "approved_operation",
        visualResultAt: "procedure_complete",
        pathologyRequired: "only_if_specimen_collected",
        recoveryIndependentOfResult: true,
      },
      roomUpgradeDurationScaling: "none",
    });
  });

  it("classifies every current service and every testing profile including distractors by exact ID", () => {
    const serviceIds = PROTOTYPE_BALANCE_RELEASE.services.map((service) => service.id);
    const profileIds = PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map((profile) => profile.id);
    expect(Object.keys(DIAGNOSTIC_SERVICE_TIMING_RULES).sort()).toEqual([...serviceIds].sort());
    expect(Object.keys(DIAGNOSTIC_PROFILE_TIMING_MAPPINGS).sort()).toEqual([...profileIds].sort());

    for (const profile of PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles) {
      const mapping = getDiagnosticTimingProfileMapping(profile.id)!;
      if (mapping.previewServiceId !== null) {
        expect(serviceIds, profile.id).toContain(mapping.previewServiceId);
        expect(mapping.rule.family, profile.id).toBe(
          getDiagnosticTimingRuleForService(mapping.previewServiceId)?.family,
        );
      }
      if (profile.serviceId !== null) {
        expect(mapping.previewServiceId, profile.id).toBe(profile.serviceId);
      }
    }
  });

  it("maps the approved simple imaging and collected-lab families without converting tissue molecular work", () => {
    for (const serviceId of [
      "service.ultrasound", "service.venous_duplex", "service.endoanal_ultrasound",
      "service.xray", "service.contrast_swallow", "service.resting_abi",
      "service.ct", "service.carotid_cta", "service.mesenteric_cta",
      "service.hs.noncontrast-abdominal-ct",
    ]) {
      expect(getDiagnosticTimingRuleForService(serviceId)).toEqual({ family: "imaging" });
    }
    for (const serviceId of [
      "service.basic_labs", "service.genetic_testing", "service.hiv_hcv_serology",
      "service.primary_aldosteronism_screen",
    ]) {
      expect(getDiagnosticTimingRuleForService(serviceId)).toEqual({ family: "collected_lab", specimen: "blood" });
    }
    expect(getDiagnosticTimingRuleForService("service.h_pylori_urea_breath"))
      .toEqual({ family: "collected_lab", specimen: "breath" });
    expect(getDiagnosticTimingRuleForProfile("timing.test.genetic"))
      .toEqual({ family: "collected_lab", specimen: "blood" });
    for (const serviceId of ["service.tumor_mmr_ihc", "service.gist_eus_core_molecular"]) {
      expect(getDiagnosticTimingRuleForService(serviceId))
        .toEqual({ family: "retained", reason: "tissue_molecular" });
    }
    expect(getDiagnosticTimingRuleForProfile("timing.test.pathology_review"))
      .toEqual({ family: "retained", reason: "tissue_molecular" });
    expect(getDiagnosticTimingRuleForService("service.interventional-radiology.percutaneous-transhepatic-biopsy"))
      .toEqual({ family: "biopsy" });
    expect(getDiagnosticTimingRuleForProfile("timing.test.advanced_diagnostic"))
      .toEqual({ family: "retained", reason: "specialist" });
  });

  it("retains specialist and planned waits and mixed workup remainders instead of authorizing new work", () => {
    for (const profileId of [
      "timing.test.mri", "timing.test.nuclear_imaging", "timing.test.bone_marrow",
      "timing.test.ercp", "timing.test.therapeutic_ercp",
    ]) {
      expect(getDiagnosticTimingRuleForProfile(profileId))
        .toEqual({ family: "retained", reason: "specialist" });
    }
    for (const profileId of [
      "timing.test.overnight_protocol", "timing.test.four_hour_protocol",
      "timing.test.twenty_four_hour_protocol", "timing.test.dexamethasone_suppression",
    ]) {
      expect(getDiagnosticTimingRuleForProfile(profileId))
        .toEqual({ family: "retained", reason: "planned_protocol" });
    }
    for (const serviceId of [
      "service.anal_lesion_biopsy_staging", "service.ibc_biopsy_and_staging",
      "service.diagnostic_breast_imaging", "service.endoscopy.eus-ercp-sampling",
    ]) {
      expect(getDiagnosticTimingRuleForService(serviceId)).toEqual({ family: "component_workup" });
    }
    expect(getDiagnosticTimingProfileMapping("timing.test.biopsy")?.previewServiceId).toBeNull();
    expect(getDiagnosticTimingProfileMapping("timing.test.genetic")?.previewServiceId).toBe("service.genetic_testing");
    expect(getDiagnosticTimingRuleForService("service.endoscopy"))
      .toEqual({ family: "endoscopy", result: "by_disposition" });
    for (const serviceId of ["service.colonoscopy", "service.bidirectional_endoscopy"]) {
      expect(getDiagnosticTimingRuleForService(serviceId))
        .toEqual({ family: "endoscopy", result: "by_disposition" });
    }
    expect(getDiagnosticTimingRuleForService("service.upper_endoscopy_duodenal_biopsy"))
      .toEqual({ family: "endoscopy", result: "pathology" });
  });

  it("does not infer new rules from similar labels, ID substrings or object prototype keys", () => {
    for (const id of ["service.ct.future", "service.genetic_tissue", "CT", "constructor", "toString"]) {
      expect(getDiagnosticTimingRuleForService(id)).toBeUndefined();
    }
    for (const id of ["timing.test.ultrasound_future", "timing.test.genetic_tissue", "constructor", "__proto__"]) {
      expect(getDiagnosticTimingProfileMapping(id)).toBeUndefined();
      expect(getDiagnosticTimingRuleForProfile(id)).toBeUndefined();
    }
  });

  it("requires a real operational room and staff pair for each single-employee queue", () => {
    const { facility } = PROTOTYPE_BALANCE_RELEASE;
    for (const resource of Object.values(DIAGNOSTIC_TIMING_RESOURCES)) {
      const room = facility.roomDefinitions.find((candidate) => candidate.id === resource.roomDefinitionId)!;
      const role = facility.staffRoleDefinitions.find((candidate) => candidate.id === resource.staffRoleDefinitionId)!;
      expect(room.capabilityIds).toContain(resource.roomCapabilityId);
      expect(role.capabilityIds).toContain(resource.staffCapabilityId);
      expect(role.requiredRoomDefinitionIds).toContain(room.id);
      expect(resource.maximumConcurrentJobsPerEmployee).toBe(1);
    }
    expect(DIAGNOSTIC_TIMING_RESOURCES.interpretation.maximumEmployeesPerRoom)
      .toBe(DIAGNOSTIC_READING_WORKSTATIONS.length);
    expect(DIAGNOSTIC_TIMING_RESOURCES.interpretation.patientPresent).toBe(false);
    expect(DIAGNOSTIC_TIMING_RESOURCES.processing.patientPresent).toBe(false);
    expect(DIAGNOSTIC_TIMING_RESOURCES.collection.patientPresent).toBe(true);
    expect(getDiagnosticTimingRuleForService("service.bladder_scan"))
      .toEqual({ family: "bladder_scan" });
  });
});

describe("approved four-workstation Level 3 reading room", () => {
  it("publishes the approved reading upgrades without new progression requirements", () => {
    const { facility } = PROTOTYPE_BALANCE_RELEASE;
    const room = facility.roomDefinitions.find((candidate) => candidate.id === DIAGNOSTIC_READING_ROOM_DEFINITION_ID)!;
    const role = facility.staffRoleDefinitions.find((candidate) => candidate.id === DIAGNOSTIC_RADIOLOGIST_ROLE_ID)!;
    expect(room).toMatchObject({
      unlockFacilityLevel: 3, width: 4, height: 4,
      constructionCost: 1800, upkeepPerExpenseInterval: 6,
      maximumInstances: 4, maximumUpgradeLevel: 5, upgradeCosts: [450, 675, 990, 1350],
      workloadLimitContribution: 0,
      upkeepPerUpgradeLevel: 0,
      workloadLimitContributionPerUpgradeLevel: 0,
      serviceDurationReductionPercentPerUpgradeLevel: 0,
    });
    expect(role).toMatchObject({
      unlockFacilityLevel: 3, hiringCost: 300, salaryPerExpenseInterval: 18,
      minimumSalaryPerExpenseInterval: 12, maximumSalaryPerExpenseInterval: 34,
      salaryAdjustmentStep: 2, baseMorale: 75, maximumEmployees: 4,
      requiredRoomDefinitionIds: [DIAGNOSTIC_READING_ROOM_DEFINITION_ID],
    });
    for (const stage of facility.stageDefinitions) {
      expect(stage.requiredRoomDefinitionIds).not.toContain(room.id);
      expect(stage.requiredStaffRoleIds).not.toContain(role.id);
    }
  });

  it("keeps four distinct stable posts with original cardinal proof contacts", () => {
    expect(DIAGNOSTIC_READING_WORKSTATIONS.map((station) => [station.id, station.facing, station.staffAnchor]))
      .toEqual([
        ["northwest", "south", { x: 1, y: 1 }],
        ["northeast", "west", { x: 3, y: 1 }],
        ["southeast", "north", { x: 2, y: 2 }],
        ["southwest", "east", { x: 0, y: 2 }],
      ]);
    expect(new Set(DIAGNOSTIC_READING_WORKSTATIONS.map((station) => `${station.staffAnchor.x},${station.staffAnchor.y}`)).size).toBe(4);
    for (const station of DIAGNOSTIC_READING_WORKSTATIONS) {
      expect(station.chairGround.x).toBe(station.seatContact.x);
      expect(station.chairGround.y - station.seatContact.y).toBeCloseTo(0.375);
    }
  });

  it("connects all sixteen perimeter door segments to each post without using solid furniture as transit", () => {
    const navigation = getApprovedRoomNavigation(DIAGNOSTIC_READING_ROOM_DEFINITION_ID)!;
    const key = (point: { x: number; y: number }) => `${point.x},${point.y}`;
    const blocked = new Set(navigation.blockedTiles.map(key));
    const endpoints = new Set(navigation.endpointOnlyTiles.map(key));
    expect(blocked).toEqual(new Set(["1,1", "2,1", "1,2", "2,2"]));
    expect(navigation.allowedDoorSlots).toBeUndefined();
    const doors = Array.from({ length: 4 }, (_, offset) => [
      { x: offset, y: 0 }, { x: 3, y: offset },
      { x: offset, y: 3 }, { x: 0, y: offset },
    ]).flat();
    expect(doors).toHaveLength(16);

    for (const door of doors) {
      expect(blocked.has(key(door))).toBe(false);
      for (const station of DIAGNOSTIC_READING_WORKSTATIONS) {
        const target = key(station.staffAnchor);
        if (blocked.has(target)) expect(endpoints.has(target)).toBe(true);
        const frontier = [door];
        const visited = new Set<string>();
        while (frontier.length > 0) {
          const current = frontier.shift()!;
          if (visited.has(key(current))) continue;
          visited.add(key(current));
          if (key(current) === target) break;
          for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]] as const) {
            const next = { x: current.x + dx, y: current.y + dy };
            if (next.x < 0 || next.y < 0 || next.x >= 4 || next.y >= 4) continue;
            if (blocked.has(key(next)) && key(next) !== target) continue;
            frontier.push(next);
          }
        }
        expect(visited.has(target), `door ${key(door)} -> ${station.id}`).toBe(true);
      }
    }
  });
});
