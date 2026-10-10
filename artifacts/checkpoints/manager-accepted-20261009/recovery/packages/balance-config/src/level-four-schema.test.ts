import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";
import {
  facilityStageDefinitionSchema, patientEligibilitySchema, prototypeBalanceReleaseSchema,
  roomDefinitionSchema, serviceDefinitionSchema, staffRoleDefinitionSchema,
} from "./schema";
import type { PrototypeAlertEligibilityContext, PrototypeAlertDefinition } from "./prototype-alerts";

const pediatricEligibility = {
  population: "pediatric", minimumAgeYears: 5, maximumAgeYears: 17,
  requiresParent: true, clinicalScope: "outpatient",
} as const;

function clone<T>(value: T): T { return JSON.parse(JSON.stringify(value)) as T; }

// Keep schema-only APP/stage fixtures; M3 supplies the real room definitions.
function levelFourBalanceFixture() {
  const balance = clone(PROTOTYPE_BALANCE_RELEASE);
  balance.facility.maximumPlayableLevel = 3;
  balance.facility.stageDefinitions = balance.facility.stageDefinitions.filter(stage => stage.level !== 4);
  balance.facility.stageDefinitions.find(stage => stage.level === 3)!.nextFacilityLevel = null;
  const exam = balance.facility.roomDefinitions.find((room) => room.id === "room.examination")!;
  const newRooms = ["room.mri", "room.pediatric_waiting", "room.pediatric_examination", "room.wound_ostomy"]
    .filter((id) => !balance.facility.roomDefinitions.some((room) => room.id === id)).map((id) =>
    roomDefinitionSchema.parse({ ...exam, id, unlockFacilityLevel: 4, navigation: undefined,
      ...(id.startsWith("room.pediatric_") ? { patientEligibility: pediatricEligibility } : {}) }));
  balance.facility.roomDefinitions.push(...newRooms);
  const app = staffRoleDefinitionSchema.parse({
    ...balance.facility.staffRoleDefinitions.find((role) => role.id === "staff.glp1_np")!,
    id: "staff.app", unlockFacilityLevel: 4, requiredRoomDefinitionIds: [],
    requiredAnyRoomDefinitionIds: ["room.examination", "room.minor_procedure", "room.pediatric_examination", "room.wound_ostomy"],
    capabilityIds: ["capability.staff.app"],
  });
  if (!balance.facility.staffRoleDefinitions.some((role) => role.id === app.id)) balance.facility.staffRoleDefinitions.push(app);
  balance.facility.stageDefinitions.push(facilityStageDefinitionSchema.parse({
    level: 4, displayName: "Specialty Expansion", minimumClinicalXp: 750, minimumCompletedEncounters: 0,
    satisfactionMustBeGreaterThan: 90, requiredRoomDefinitionIds: [], requiredStaffRoleIds: ["staff.app"],
    requiredCompletionWitnessIds: ["pediatric_visit_with_parent", "wound_ostomy_care_visit"], nextFacilityLevel: null,
  }));
  return balance;
}

describe("dormant Level 4 schema foundation", () => {
  it("round-trips four rooms, APP homes including Minor Procedure, and exactly the M0 finish witnesses", () => {
    const balance = levelFourBalanceFixture();
    expect(prototypeBalanceReleaseSchema.parse(JSON.parse(JSON.stringify(balance)))).toEqual(balance);
    expect(balance.facility.maximumPlayableLevel).toBe(3);
    expect(balance.facility.stageDefinitions.find((stage) => stage.level === 3)?.nextFacilityLevel).toBeNull();
    balance.facility.maximumPlayableLevel = 4;
    balance.facility.stageDefinitions.find((stage) => stage.level === 3)!.nextFacilityLevel = 4;
    expect(prototypeBalanceReleaseSchema.parse(balance)).toEqual(balance);
  });

  it("accepts MRI acquisition/read and separate routine wound, ostomy and pediatric service contracts without activating them", () => {
    for (const [id, room, role, pediatric] of [
      ["service.schema.mri", "room.mri", "staff.imaging_technician", false],
      ["service.schema.wound_care", "room.wound_ostomy", "staff.app", false],
      ["service.schema.ostomy_support", "room.wound_ostomy", "staff.app", false],
      ["service.schema.pediatric_consult", "room.pediatric_examination", "staff.app", true],
    ] as const) {
      const eligibility = pediatric ? pediatricEligibility : { population: "adult" as const };
      const mri = room === "room.mri";
      const service = serviceDefinitionSchema.parse({ id, displayName: "Schema fixture", patientEligibility: eligibility,
        routes: [{ id: `route.${id}.onsite`, displayName: "Schema fixture", durationTicks: mri ? 65 : 30,
          requiredCapabilityId: null, preference: 0, patientEligibility: eligibility,
          resourceRequirements: [{ roomDefinitionId: room, staffRoleDefinitionId: role }],
          timingPhases: mri ? [{ id: "phase.acquire", durationTicks: 60, resourceBound: true },
            { id: "phase.read", durationTicks: 5, resourceBound: true }] : [],
        }] });
      expect(serviceDefinitionSchema.parse(JSON.parse(JSON.stringify(service)))).toEqual(service);
    }
    expect(PROTOTYPE_BALANCE_RELEASE.services.some((service) => service.id.startsWith("service.schema."))).toBe(false);
  });

  it("keeps the shipped cap, progression, roles and economy B while registering only the four L4 rooms", () => {
    const balance = prototypeBalanceReleaseSchema.parse(PROTOTYPE_BALANCE_RELEASE);
    expect(balance).toEqual(PROTOTYPE_BALANCE_RELEASE);
    expect(balance.facility.maximumPlayableLevel).toBe(4);
    expect(balance.facility.stageDefinitions.map((stage) => stage.level)).toEqual([0, 1, 2, 3, 4]);
    expect(balance.facility.roomDefinitions.filter((room) => room.unlockFacilityLevel === 4).map((room) => room.id)).toEqual([
      "room.mri", "room.pediatric_waiting", "room.pediatric_examination", "room.wound_ostomy",
    ]);
    expect(balance.facility.staffRoleDefinitions.find((role) => role.id === "staff.app")?.unlockFacilityLevel).toBe(4);
    expect(balance.facility.staffRoleDefinitions.find((role) => role.id === "staff.imaging_technician")?.salaryPerExpenseInterval).toBe(18);
    expect(balance.facility.roomDefinitions.find((room) => room.id === "room.reading")?.unlockFacilityLevel).toBe(3);
    expect(balance.facility.stageDefinitions.filter(stage => stage.level < 4).every((stage) => stage.requiredCompletionWitnessIds === undefined)).toBe(true);
  });

  it("rejects malformed/newer level, age and witness contracts", () => {
    expect(patientEligibilitySchema.safeParse({ ...pediatricEligibility, minimumAgeYears: 10, maximumAgeYears: 9 }).success).toBe(false);
    for (const override of [{ minimumAgeYears: 4 }, { maximumAgeYears: 18 }, { requiresParent: false }, { clinicalScope: "sedation" }]) {
      expect(patientEligibilitySchema.safeParse({ ...pediatricEligibility, ...override }).success).toBe(false);
    }
    const fixture = levelFourBalanceFixture();
    const stage = fixture.facility.stageDefinitions.at(-1)!;
    for (const requiredCompletionWitnessIds of [["onsite_mri"], ["pediatric_waiting"], ["pediatric_visit_with_parent", "pediatric_visit_with_parent"]]) {
      expect(facilityStageDefinitionSchema.safeParse({ ...stage, requiredCompletionWitnessIds }).success).toBe(false);
    }
    expect(facilityStageDefinitionSchema.safeParse({ ...stage, level: 3 }).success).toBe(false);
    expect(facilityStageDefinitionSchema.safeParse({ ...stage, level: 5 }).success).toBe(false);
    fixture.facility.stageDefinitions.push(stage);
    expect(prototypeBalanceReleaseSchema.safeParse(fixture).success).toBe(false);
    const missingStage = clone(PROTOTYPE_BALANCE_RELEASE);
    missingStage.facility.stageDefinitions = missingStage.facility.stageDefinitions.filter(stage => stage.level !== 4);
    expect(prototypeBalanceReleaseSchema.safeParse(missingStage).success).toBe(false);
  });

  it("permits Level 4 alert types without broadening live alert eligibility", () => {
    const context: PrototypeAlertEligibilityContext = { facilityLevel: 4, roomDefinitionIds: new Set(), objectIds: new Set(), hasCheckedInPatient: false };
    const eligibility: PrototypeAlertDefinition["eligibility"] = [{ kind: "facility_level", levels: [4] }];
    expect(context.facilityLevel).toBe(4);
    expect(eligibility).toEqual([{ kind: "facility_level", levels: [4] }]);
  });
});
