import { describe, expect, it } from "vitest";
import { type SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import approved from "../../../tests/fixtures/kids-reviewers-acceptance.json";
import { createLevelFourRoomsQaState } from "../../../tests/fixtures/level-four-rooms";
import {
  COLLEAGUE_NAME_EDITORIAL_WEIGHT, PROTOTYPE_DOMAIN_CONTEXT, createDeterministicRandom,
  createPatientDisplayName, createStaffDisplayName, deserializeGameState, getNamePresentationProfile,
  procedureConsultKind, selectStaffStillId, serializeGameState, type DomainContext, type GameState,
} from "../src";
import { engCommand, engTick } from "./eng-i01-live-procedure.fixture";

const context = PROTOTYPE_DOMAIN_CONTEXT;
const attendings = new Set([...approved.legacyAttendingNames, ...approved.reviewers.map(row => row.name)]);
const residents = new Map(approved.residentCameos.map(row => [row.name, row.sex]));
const sexLabels = ["Female", "Male"] as const;
const role = "staff.app";
const cameoRate = 0.01; // Existing editorial frequency, not a demographic or medical weight.
const template = context.clinicalRelease.cases.find(row => row.routineEligible && !row.participant && !row.pediatricProfile
  && row.requiredClinicalSetting === "clinic" && !row.procedureContext && !procedureConsultKind(row))!;

function patientCase(ageYears: number, sexLabel: typeof sexLabels[number]) {
  const clinicalCase: SyntheticClinicalCase = { ...template, patientDisplayName: "{patientName}", requiredCapabilityIds: [],
    prototypeDemographics: { ageYears, sexLabel }, approvedInstantiationProfiles: undefined,
    patientPresentationRevision: undefined, earliestFacilityStage: 0 };
  const ctx: DomainContext = { ...context, clinicalRelease: { ...context.clinicalRelease,
    cases: [...context.clinicalRelease.cases.filter(row => row.tutorialEligible && row.id !== clinicalCase.id)
      .map(row => ({ ...row, routineEligible: false })), clinicalCase] } };
  return { clinicalCase, ctx };
}

function admit(state: GameState, ageYears: number, sexLabel: typeof sexLabels[number], patientDisplayName: string) {
  const { clinicalCase, ctx } = patientCase(ageYears, sexLabel);
  const encounterId = "encounter.reviewer-cameo.public";
  const next = engCommand(state, { type: "ADMIT_PATIENT", encounterId, caseId: clinicalCase.id, arrivalClass: "routine",
    patientDisplayName }, ctx);
  return { state: next, encounter: next.encounters[encounterId]!, ctx };
}

function clinic() {
  let state = createLevelFourRoomsQaState();
  state = engCommand(state, { type: "PLACE_ROOM", roomId: "room.reviewers.exam", roomDefinitionId: "room.examination", x: 28, y: 24 }, context);
  return engCommand(state, { type: "PLACE_DOOR", roomId: "room.reviewers.exam", doorId: "door.reviewers.exam", side: "south", offset: 1 }, context);
}

// Choose small, deterministic sets of commands that exercise the historically
// rare cameo branch. This selects input IDs from the released stream only.
// Expected names/outcomes below never depend on the current selector's result.
function historicalDraw(seed: string, key: string) {
  return createDeterministicRandom(seed, "colleague_names.editorial.v1", key).nextUint32() / 0x1_0000_0000 < cameoRate;
}

function hireCases(group: "middle" | "resident") {
  const baseline = clinic();
  const eligible = [];
  for (let index = 0; index < 8_000 && eligible.length < 8; index++) {
    const employeeId = `reviewer-cameo.public.staff.${index}`;
    if (!historicalDraw(baseline.campaignSeed, `staff:${employeeId}`)) continue;
    const { ageYears, ageBand, sexLabel } = getNamePresentationProfile({ stillId: selectStaffStillId(baseline.campaignSeed, employeeId, role) });
    if (!sexLabel || sexLabel === "Not specified") continue;
    const member = ageYears === undefined ? ageBand === (group === "middle" ? "middle_aged" : "young_adult")
      : group === "middle" ? ageYears >= 40 && ageYears <= 65 : ageYears >= 25 && ageYears <= 35;
    if (!member) continue;
    const hired = engCommand(baseline, { type: "HIRE_STAFF", employeeId, staffRoleDefinitionId: role }, context);
    eligible.push(hired.employees.find(employee => employee.id === employeeId)!);
  }
  expect(eligible.length, `Public hire sample exercises ${group} identity inputs`).toBeGreaterThan(0);
  return eligible;
}

describe("attendings review the clinic and resident cameos remain", () => {
  it("keeps attending identities out of new real patient admissions", () => {
    const baseline = clinic();
    const encounterId = `encounter.auto.${baseline.facilityLevel}.${baseline.routineArrivalSequence}`;
    const seeds = Array.from({ length: 3_000 }, (_, index) => `reviewer-cameo.patient.${index}`)
      .filter(seed => historicalDraw(seed, `patient:${encounterId}`)).slice(0, 8);
    expect(seeds).toHaveLength(8);
    const patients = seeds.flatMap(campaignSeed => sexLabels.map(sex => {
      const { ctx } = patientCase(50, sex);
      const state = engTick({ ...baseline, campaignSeed, paused: false, nextRoutineArrivalTick: baseline.facilityTick + 1 }, ctx);
      const patient = state.encounters[encounterId];
      expect(patient, "A normal clock minute admits the public test patient").toBeDefined();
      return patient!;
    }));
    expect(patients.every(patient => patient.frozenCase.prototypeDemographics?.ageYears === 50)).toBe(true);
    expect(patients.map(patient => patient.patientDisplayName).filter(name => attendings.has(name)), "New admissions still drew attending cameo names").toEqual([]);
  });

  it("keeps attending identities out of new real hires", () => {
    const employees = hireCases("middle");
    expect(employees.map(employee => employee.displayName).filter(name => attendings.has(name)), "New hires still drew attending cameo names").toEqual([]);
  });

  it("retains compatible resident cameos on new hires and the original rare rate at patient age boundaries", () => {
    expect(hireCases("resident").some(employee => residents.has(employee.displayName))).toBe(true);
    expect(COLLEAGUE_NAME_EDITORIAL_WEIGHT).toBe(cameoRate);
    const draws = 50_000;
    const tolerance = 4 * Math.sqrt(cameoRate * (1 - cameoRate) / draws);
    const counts = { patients: 0, staff: 0 };
    const mismatches: string[] = [];
    for (let index = 0; index < draws; index++) {
      const seed = `resident-cameo.public.${index}`, id = `public.${index}`;
      const sexLabel = sexLabels[index % 2]!;
      const ageYears = index % 4 < 2 ? 25 : 35;
      const patient = createPatientDisplayName(seed, id, sexLabel, [], { ageYears });
      const staff = createStaffDisplayName(seed, id, [], { ageYears, sexLabel });
      for (const [kind, name] of [["patients", patient], ["staff", staff]] as const) {
        const sex = residents.get(name);
        if (sex) {
          counts[kind]++;
          if (sex !== sexLabel) mismatches.push(name);
        }
      }
      if (index < 2_000) for (const outsideAge of [24, 36]) {
        expect(residents.has(createPatientDisplayName(seed, id, sexLabel, [], { ageYears: outsideAge }))).toBe(false);
        expect(residents.has(createStaffDisplayName(seed, id, [], { ageYears: outsideAge, sexLabel }))).toBe(false);
      }
    }
    expect(mismatches).toEqual([]);
    for (const [path, count] of Object.entries(counts)) expect(Math.abs(count / draws - cameoRate), `${path}: ${count}/${draws}`).toBeLessThanOrEqual(tolerance);
  });

  it("preserves legacy saved attending names, appearance and frozen questions for patient and staff", () => {
    const names = approved.legacyAttendingNames;
    const start = engCommand(clinic(), { type: "HIRE_STAFF", employeeId: "reviewer-cameo.legacy.staff", staffRoleDefinitionId: role, displayName: names[0]! }, context);
    const saved = admit(start, 50, "Female", names.find(name => name.endsWith(" Ivascu"))!);
    expect(saved.encounter.patientDisplayName).toBe(names.find(name => name.endsWith(" Ivascu")));
    expect(saved.state.employees[0]!.displayName).toBe(names[0]);
    const loaded = deserializeGameState(serializeGameState(saved.state), saved.ctx);
    expect(loaded.encounters[saved.encounter.id]).toEqual(saved.encounter);
    expect(loaded.employees[0]).toEqual(saved.state.employees[0]);
  });
});
