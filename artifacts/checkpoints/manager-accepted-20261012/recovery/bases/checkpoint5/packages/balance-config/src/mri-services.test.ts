import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE, getDiagnosticTimingProfileMapping, getDiagnosticTimingRuleForService,
  getServiceIncomeForRoute, getServiceIncomeLine, MRI_SERVICE_CONTRACTS, mriServiceContract } from "./index";

describe("M6 ordinary adult MRI contracts", () => {
  it("maps only the three exact services to the scanner, technician and additive-reading family", () => {
    expect(MRI_SERVICE_CONTRACTS.map(row => row.serviceId)).toEqual(["service.mri", "service.mrcp", "service.extremity_mri"]);
    for (const contract of MRI_SERVICE_CONTRACTS) {
      const route = PROTOTYPE_BALANCE_RELEASE.services.find(row => row.id === contract.serviceId)!.routes.find(row => row.id === contract.onsite)!;
      expect(route).toMatchObject({ requiredCapabilityId: "capability.mri_machine", requiredCapabilityIds: ["capability.staff.imaging_technician"],
        resourceRequirements: [{ roomDefinitionId: "room.mri", staffRoleDefinitionId: "staff.imaging_technician" }], providerRequirement: null });
      expect(route.timingPhases.map(row => row.durationTicks)).toEqual([60, 30]);
      expect(getServiceIncomeForRoute(route.id)?.id).toBe("income.mri");
      expect(getDiagnosticTimingRuleForService(contract.serviceId)).toEqual({ family: "imaging", onsiteReadRequiresLocalAcquisition: true });
    }
    for (const id of ["service.breast_mri", "service.pelvic_mri", "service.liver_mri", "service.hepatobiliary_contrast_mrcp", "service.imaging.repeat-mri-mrcp", "service.future.mri", "MRI"]) {
      expect(mriServiceContract(id)).toBeUndefined();
      expect(PROTOTYPE_BALANCE_RELEASE.services.find(row => row.id === id)?.routes.some(route => route.patientTravel?.destinationRoomDefinitionId === "room.mri")).not.toBe(true);
    }
    expect(getDiagnosticTimingProfileMapping("timing.test.mri")?.previewServiceId).toBeNull();
    expect(getDiagnosticTimingProfileMapping("timing.test.mrcp")?.previewServiceId).toBe("service.mrcp");
  });

  it("retains the seed cadence/fee, one scanner and one physical post per modality", () => {
    const line = getServiceIncomeLine("income.mri")!;
    expect(line).toMatchObject({ fee: 240, operation: { arrivalCadenceMinutes: 240, phases: [{ durationMinutes: 60 }] } });
    const facility = PROTOTYPE_BALANCE_RELEASE.facility;
    expect(facility.roomDefinitions.find(row => row.id === "room.mri")).toMatchObject({ maximumInstances: 1, upkeepPerExpenseInterval: 8 });
    const tech = facility.staffRoleDefinitions.find(row => row.id === "staff.imaging_technician")!;
    expect(tech.requiredAnyRoomDefinitionIds).toEqual(["room.ultrasound", "room.xray", "room.ct", "room.mri"]);
    expect(tech.maximumEmployees).toBe(4);
    expect(line.fee * 60 / line.operation!.arrivalCadenceMinutes! - tech.salaryPerExpenseInterval - 8).toBe(34);
    expect(facility.maximumPlayableLevel).toBe(4);
  });
});
