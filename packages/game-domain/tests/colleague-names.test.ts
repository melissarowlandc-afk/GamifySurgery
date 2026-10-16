import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { createLevelFourRoomsQaState } from "../../../tests/fixtures/level-four-rooms";
import { createAppAppointmentsQaState } from "../../../tests/fixtures/app-appointments";
import { createLevelFiveStateQaState } from "../../../tests/fixtures/level-five-state";
import {
  COLLEAGUE_NAMES, COLLEAGUE_NAME_EDITORIAL_WEIGHT, PROTOTYPE_DOMAIN_CONTEXT, STAFF_CHARACTER_STILLS,
  createGeneratedPatientActorIdentity, createInitialGameState, createPatientDisplayName, createPatientPixelAppearance,
  createPediatricFamily, createStaffDisplayName, deserializeGameState, gameReducer, getNamePresentationProfile,
  getPatientAppearanceSelectionContext, getPresentColleagueDisplayNames, selectColleagueDisplayName,
  selectStaffStillId, serializeGameState, type ColleagueNameSelectionContext, type DomainContext,
  scheduleGiftRetailDemand, startServiceOperation,
} from "../src";

const names = new Set(COLLEAGUE_NAMES.map(name => `${name.given} ${name.family}`));
const profile = { ageYears: 50, sexLabel: "Female" as const };
const encounterId = "encounter.colleague";
function selectedSeed(key: string, selectionProfile = profile): string {
  for (let index = 0; index < 1_000; index++) {
    const seed = `colleague.test.${index}`;
    if (selectColleagueDisplayName(seed, key, selectionProfile)) return seed;
  }
  throw new Error("No colleague draw in seeded sample");
}
function newState(seed = "colleague.names") {
  const state = createInitialGameState(undefined, { campaignSeed: seed, createdAtRealMs: 0 });
  state.encounters = {};
  return state;
}
const template = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(c => c.routineEligible && !c.participant && !c.pediatricProfile)!;
function admit(seed: string, overrides: Partial<SyntheticClinicalCase> = {}, displayName?: string) {
  const clinicalCase: SyntheticClinicalCase = { ...template, patientDisplayName: "{patientName}", prototypeDemographics: profile,
    approvedInstantiationProfiles: undefined, patientPresentationRevision: undefined, requiredCapabilityIds: [], earliestFacilityStage: 0, ...overrides };
  const context: DomainContext = { ...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
    cases: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.map(c => c.id === clinicalCase.id ? clinicalCase : c) } };
  const state = gameReducer(newState(seed), { type: "ADMIT_PATIENT", operationId: "colleague.admit", encounterId,
    caseId: clinicalCase.id, patientDisplayName: displayName as never, arrivalClass: "routine" }, context);
  expect(state.operationReceipts["colleague.admit"]?.status).toBe("applied");
  return { state, context, encounter: state.encounters[encounterId]! };
}

describe("owner-requested colleague Easter-egg names", () => {
  it("contains 81 unique names, with the exact unusual spellings and no contact data", () => {
    expect(COLLEAGUE_NAMES).toHaveLength(81);
    expect(names.size).toBe(81);
    expect(COLLEAGUE_NAMES.filter(n => n.group === "attending")).toHaveLength(46);
    expect(COLLEAGUE_NAMES.filter(n => n.group === "resident")).toHaveLength(35);
    expect(COLLEAGUE_NAMES).toContainEqual({ given: "O. William", family: "Brown", sex: "male", group: "attending" });
    expect(COLLEAGUE_NAMES).toContainEqual({ given: "Pragathi", family: "Pathanjeli", sex: "female", group: "resident" });
    for (const name of COLLEAGUE_NAMES) expect(Object.keys(name).sort()).toEqual(["family", "given", "group", "sex"]);
    expect(readFileSync(new URL("../src/colleagueNames.ts", import.meta.url), "utf8")).not.toMatch(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  });

  it.each([[30, "Female", "resident"], [30, "Male", "resident"], [50, "Female", "attending"], [50, "Male", "attending"]] as const)
  ("uses the configured rate for age %i, %s (%s)", (ageYears, sexLabel, group) => {
    let selected = 0;
    const seen = new Set<string>();
    for (let index = 0; index < 10_000; index++) {
      const name = selectColleagueDisplayName(`rate.${index}`, `actor.${index}`, { ageYears, sexLabel });
      if (!name) continue;
      selected++; seen.add(name);
      expect(COLLEAGUE_NAMES.find(n => `${n.given} ${n.family}` === name)).toMatchObject({ group, sex: sexLabel.toLowerCase() });
    }
    expect(COLLEAGUE_NAME_EDITORIAL_WEIGHT).toBe(0.05);
    expect(selected / 10_000).toBeGreaterThan(COLLEAGUE_NAME_EDITORIAL_WEIGHT - 0.01);
    expect(selected / 10_000).toBeLessThan(COLLEAGUE_NAME_EDITORIAL_WEIGHT + 0.01);
    expect(seen.size).toBe(COLLEAGUE_NAMES.filter(n => n.group === group && n.sex === sexLabel.toLowerCase()).length);
  });

  it("checks age boundaries and refuses children, unknown sex and unsupported ages", () => {
    for (const ageYears of [25, 35, 40, 65]) {
      const eligible = { ageYears, sexLabel: "Female" as const };
      expect(names.has(selectColleagueDisplayName(selectedSeed("bounds", eligible), "bounds", eligible)!)).toBe(true);
    }
    const seed = selectedSeed("bounds");
    for (const ageYears of [0, 5, 17, 18, 24, 36, 39, 66, 90, NaN, Infinity, undefined]) {
      expect(selectColleagueDisplayName(seed, "bounds", { ageYears, sexLabel: "Female" })).toBeUndefined();
    }
    for (const sexLabel of [undefined, "Not specified"] as const) expect(selectColleagueDisplayName(seed, "bounds", { ageYears: 50, sexLabel })).toBeUndefined();
    expect(selectColleagueDisplayName(seed, "bounds", { ...profile, constrained: true })).toBeUndefined();
  });

  it("uses authored staff bands without inventing an age or overriding an explicit age", () => {
    // The original art briefs describe a young male receptionist and a
    // middle-aged female NP. Exact clinical ages are deliberately absent.
    for (const [number, sexLabel, ageBand] of [["002", "Male", "young_adult"], ["019", "Female", "middle_aged"]] as const) {
      const presentation = getNamePresentationProfile({ stillId: `gs022-new-employee-${number}` });
      expect(presentation).toEqual({ sexLabel, ageBand });
      const seed = selectedSeed("staff.band");
      const name = selectColleagueDisplayName(seed, "staff.band", presentation);
      expect(COLLEAGUE_NAMES.find(n => `${n.given} ${n.family}` === name)?.group).toBe(ageBand === "middle_aged" ? "attending" : "resident");
      expect(selectColleagueDisplayName(seed, "staff.band", { ...presentation, ageYears: 80 })).toBeUndefined();
    }
    expect(getNamePresentationProfile({ stillId: "gs022-new-employee-001" })).toEqual({});
  });

  it("uses each compatible colleague once and falls back when all are present", () => {
    const seed = selectedSeed("patient:occupied"), occupied: string[] = [];
    for (let i = 0; i < COLLEAGUE_NAMES.filter(n => n.group === "attending" && n.sex === "female").length; i++) {
      const name = createPatientDisplayName(seed, "occupied", "Female", [], { ...profile, occupiedDisplayNames: occupied });
      expect(names.has(name)).toBe(true); expect(occupied).not.toContain(name); occupied.push(name);
    }
    expect(createPatientDisplayName(seed, "occupied", "Female", [], { ...profile, occupiedDisplayNames: occupied })).toBe(createPatientDisplayName(seed, "occupied", "Female"));
  });

  it("preserves pre-change seeded names and the existing tutorial fixture", () => {
    expect(Array.from({ length: 8 }, (_, i) => ({ patient: createPatientDisplayName("fixture.colleague", `actor.${i}`, i % 2 ? "Female" : "Male"),
      staff: createStaffDisplayName("fixture.colleague", `actor.${i}`) }))).toEqual([
      { patient: "Malcolm Jordan", staff: "Jules" }, { patient: "Eva Jordan", staff: "Finley" }, { patient: "Silas Bell", staff: "Sam" },
      { patient: "Priya Keene", staff: "Parker" }, { patient: "Malcolm Salem", staff: "Robin" }, { patient: "Maeve Lowell", staff: "Dakota" },
      { patient: "Ethan Ingram", staff: "Jordan" }, { patient: "Lucia Collins", staff: "Jules" },
    ]);
    const state = createInitialGameState(undefined, { campaignId: "campaign.fixture.colleague", campaignSeed: "fixture.colleague", createdAtRealMs: 0 });
    expect(state.encounters["encounter.synthetic.tutorial"]).toMatchObject({ patientDisplayName: "Liam Jarvis",
      frozenCase: { prototypeDemographics: { ageYears: 33, sexLabel: "Male" } }, patientAppearance: { bodyShape: "tall", hairStyle: "curly", hairShade: 2,
        faceStyle: "long", outfitStyle: "checked", outfitShade: 1, accessory: "badge", skinTone: 1, headVariant: 1, bodyVariant: 1,
        patientIdentityId: "patient.adult.033", stillId: "level3-roster-v2.020" } });
    for (let i = 0; i < 100; i++) {
      const seed = `fallback.${i}`, legacy = createPatientDisplayName(seed, "patient", "Female");
      expect(createPatientDisplayName(seed, "patient", "Female", [], { ageYears: 38 })).toBe(legacy);
      if (!selectColleagueDisplayName(seed, "patient:patient", profile)) expect(createPatientDisplayName(seed, "patient", "Female", [], profile)).toBe(legacy);
    }
  });

  it("uses the chart sex even when an optional profile disagrees", () => {
    const name = createPatientDisplayName(selectedSeed("patient:sex"), "sex", "Female", [], { ageYears: 50, sexLabel: "Male" });
    expect(COLLEAGUE_NAMES.find(n => `${n.given} ${n.family}` === name)?.sex).toBe("female");
  });

  it("uses frozen patient demographics and preserves saved names, appearance and questions", () => {
    const seed = selectedSeed(`patient:${encounterId}`), { state, encounter, context } = admit(seed);
    expect(encounter.patientDisplayName).toBe(selectColleagueDisplayName(seed, `patient:${encounterId}`, profile));
    expect(encounter.frozenCase.prototypeDemographics).toEqual(profile);
    const saved = deserializeGameState(serializeGameState(state), context).encounters[encounterId]!;
    expect(saved.patientDisplayName).toBe(encounter.patientDisplayName);
    expect(saved.frozenCase).toEqual(encounter.frozenCase); expect(saved.patientAppearance).toEqual(encounter.patientAppearance);
    // A pre-feature saved entity with this same seed must keep its old name,
    // even though a newly generated entity now qualifies for the Easter egg.
    encounter.patientDisplayName = createPatientDisplayName(seed, encounterId, "Female");
    encounter.frozenCase.patientDisplayName = encounter.patientDisplayName;
    expect(deserializeGameState(serializeGameState(state), context).encounters[encounterId]!.patientDisplayName).toBe(encounter.patientDisplayName);
  });

  it("leaves authored, explicitly requested and Spanish interpreter profiles on their existing name path", () => {
    const seed = selectedSeed(`patient:${encounterId}`), normal = createPatientDisplayName(seed, encounterId, "Female");
    expect(admit(seed, { patientDisplayName: "Authored Person" }).encounter.patientDisplayName).toBe(normal);
    expect(admit(seed, {}, "Requested Person").encounter.patientDisplayName).toBe("Requested Person");
    expect(admit(seed, { presentation: "{patientName} requests Spanish interpretation." }).encounter.patientDisplayName).toBe(normal);
    expect(admit(seed, { decisionNodes: template.decisionNodes.map(n => ({ ...n, primaryConceptId: "concept.statistics-ethics.qualified-interpreter" })) }).encounter.patientDisplayName).toBe(normal);
  });

  it("does not rename a pediatric child or its authored parent", () => {
    const state = newState(), child = { ...Object.values(createInitialGameState().encounters)[0]!, id: "pediatric.fixed", patientDisplayName: "Fixed Child" };
    const family = createPediatricFamily(state, child, "encounter", { displayName: "Fixed Parent", sexLabel: "Female" });
    expect(child.patientDisplayName).toBe("Fixed Child");
    expect(state.retailExternalActors.find(a => a.id === family.parentActorId)?.displayName).toBe("Fixed Parent");
    expect(createPediatricFamily(state, child, "encounter")).toBe(family);
  });

  it("uses verified staff art ages/sex and leaves named or unknown staff art alone", () => {
    const registry = JSON.parse(readFileSync(new URL("../../../apps/player/src/art/characterStillRegistry.generated.json", import.meta.url), "utf8"));
    let checked = 0;
    for (const staff of STAFF_CHARACTER_STILLS) {
      const row = registry.characters.find((item: { id: string }) => item.id === staff.stillId);
      if (row?.intendedAge === undefined || row?.intendedSex === undefined) continue;
      expect(getNamePresentationProfile(staff)).toEqual({ ageYears: row.intendedAge, sexLabel: row.intendedSex }); checked++;
    }
    expect(checked).toBe(38);
    for (const stillId of ["level3-roster-v2.001", "level3-roster-v2.002", "level3-roster-v2.003", "level3-roster-v2.004", "gs022-new-employee-001", "unknown"]) expect(getNamePresentationProfile({ stillId })).toEqual({});
  });

  it("freezes a compatible colleague at hire, preserves requested names and excludes other roles", () => {
    let state = createLevelFourRoomsQaState();
    state = gameReducer(state, { type: "PLACE_ROOM", operationId: "name.exam", roomId: "name.exam", roomDefinitionId: "room.examination", x: 28, y: 24, orientation: 0 });
    state = gameReducer(state, { type: "PLACE_DOOR", operationId: "name.door", doorId: "name.door", roomId: "name.exam", side: "south", offset: 1 });
    let candidate: { id: string; name: string; presentation: ColleagueNameSelectionContext } | undefined;
    for (let i = 0; i < 1_000; i++) {
      const id = `colleague.staff.${i}`, presentation = getNamePresentationProfile({ stillId: selectStaffStillId(state.campaignSeed, id, "staff.app") });
      const name = selectColleagueDisplayName(state.campaignSeed, `staff:${id}`, presentation);
      if (name) { candidate = { id, name, presentation }; break; }
    }
    expect(candidate).toBeDefined();
    const command = { type: "HIRE_STAFF" as const, operationId: "name.hire", employeeId: candidate!.id, staffRoleDefinitionId: "staff.app" };
    const hired = gameReducer(state, command);
    expect(hired.operationReceipts[command.operationId]?.status).toBe("applied");
    expect(hired.employees[0]!.displayName).toBe(candidate!.name);
    expect(getNamePresentationProfile(hired.employees[0]!.appearance)).toEqual(candidate!.presentation);
    expect(deserializeGameState(serializeGameState(hired)).employees[0]!.displayName).toBe(candidate!.name);
    expect(gameReducer(state, { ...command, displayName: "Fixed Employee" }).employees[0]!.displayName).toBe("Fixed Employee");
    state.founder.displayName = candidate!.name;
    const occupied = gameReducer(state, command).employees[0]!.displayName;
    expect(occupied).not.toBe(candidate!.name); expect(names.has(occupied)).toBe(true);
  });

  it("covers shoppers and companions without changing their seeded appearance or fallback names", () => {
    const state = newState(); let selected = 0;
    for (let i = 0; i < 500; i++) {
      const id = `retail.name.${i}`, actor = createGeneratedPatientActorIdentity(state, id);
      expect(actor.appearance).toEqual(createPatientPixelAppearance(state.campaignSeed, id, {}, "patient", getPatientAppearanceSelectionContext(state)));
      const expected = selectColleagueDisplayName(state.campaignSeed, `patient:${id}`, getNamePresentationProfile(actor.appearance));
      if (expected) {
        selected++; expect(actor.displayName).toBe(expected); state.founder.displayName = expected;
        expect(getPresentColleagueDisplayNames(state)).toContain(expected);
        expect(createGeneratedPatientActorIdentity(state, id).displayName).not.toBe(expected); state.founder.displayName = "Founder";
      } else expect(actor.displayName).toBe(createPatientDisplayName(state.campaignSeed, id));
    }
    expect(selected).toBeGreaterThan(0);
  });

  it("uses the same compatible pool for a service visitor and respects a staff reservation", () => {
    const state = createAppAppointmentsQaState();
    const id = `service-operation.${state.serviceOperationSequence}`;
    let expected: string | undefined;
    for (let i = 0; i < 1_000; i++) {
      state.campaignSeed = `service.colleague.${i}`;
      const appearance = createPatientPixelAppearance(state.campaignSeed, id, {}, "patient", getPatientAppearanceSelectionContext(state));
      expected = selectColleagueDisplayName(state.campaignSeed, `patient:${id}`, getNamePresentationProfile(appearance));
      if (expected) break;
    }
    expect(expected).toBeDefined();
    // A colleague already hired in another role must be reserved for this draw.
    state.employees[0]!.displayName = expected!;
    expect(startServiceOperation(state, "income.app_consult", "visitor", PROTOTYPE_DOMAIN_CONTEXT)).toBe(id);
    const operation = state.serviceOperations.find(op => op.id === id)!;
    expect(operation.displayName).not.toBe(expected);
    expect(names.has(operation.displayName)).toBe(true);
    const presentation = getNamePresentationProfile(operation.appearance);
    expect(operation.clinicVisit?.demographics).toEqual(presentation);
    expect(operation.displayName).toBe(selectColleagueDisplayName(state.campaignSeed, `patient:${id}`, presentation, [expected!]));
  });

  it("uses the pool for gift shoppers and reserves an already-visible patient's name", () => {
    const state = createLevelFiveStateQaState("gift");
    const id = "gift-visitor.0";
    let expected: string | undefined;
    for (let i = 0; i < 1_000; i++) {
      state.campaignSeed = `gift.colleague.${i}`;
      const seed = `${state.campaignSeed}|gift-retail.v1`;
      const appearance = createPatientPixelAppearance(seed, id, {}, "patient");
      expected = selectColleagueDisplayName(seed, `patient:${id}`, getNamePresentationProfile(appearance));
      if (expected) break;
    }
    expect(expected).toBeDefined();
    const patient = Object.values(createInitialGameState().encounters)[0]!;
    state.encounters[patient.id] = { ...patient, patientDisplayName: expected! };
    state.giftRetailDemand!.nextOpportunityAtFacilityTick = state.facilityTick;
    scheduleGiftRetailDemand(state, PROTOTYPE_DOMAIN_CONTEXT, () => ({ x: 35, y: 21 }), () => "gift.started");
    const shopper = state.retailExternalActors.find(actor => actor.id === id)!;
    expect(shopper).toBeDefined();
    expect(shopper.displayName).not.toBe(expected);
    expect(names.has(shopper.displayName)).toBe(true);
    const presentation = getNamePresentationProfile(shopper.appearance);
    expect(shopper.giftOnlyVisit).toMatchObject(presentation);
    expect(shopper.displayName).toBe(selectColleagueDisplayName(`${state.campaignSeed}|gift-retail.v1`, `patient:${id}`, presentation, [expected!]));
  });
});
