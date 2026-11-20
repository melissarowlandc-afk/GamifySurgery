import { describe, expect, it } from "vitest";
import {
  PEDIATRIC_CLINIC_CASES, QUESTION_PROGRAM_BATCH5_RETAINED_CASES, type SyntheticClinicalCase,
} from "@gamify-surgery/clinical-content";
import { FOUNDER_CONSULT_POLICY } from "@gamify-surgery/balance-config";
import approved from "../../../tests/fixtures/kids-reviewers-acceptance.json";
import { createPediatricAppointmentsQaState } from "../../../tests/fixtures/pediatric-appointments";
import { createLevelFourRoomsQaContext } from "../../../tests/fixtures/level-four-rooms";
import {
  deserializeGameState, getPediatricClinicFamilyContext, isEmployeeOperational, pediatricFamilyForActor,
  pediatricStillEligibleEntries, serializeGameState, startServiceOperation, type DomainContext, type GameState,
} from "../src";
import { advanceEngProcedure, engCommand, engProcedureClinic, engTick } from "./eng-i01-live-procedure.fixture";

const context = createLevelFourRoomsQaContext();
const allCases = new Map([...PEDIATRIC_CLINIC_CASES, ...QUESTION_PROGRAM_BATCH5_RETAINED_CASES,
  ...context.clinicalRelease.cases].map(row => [row.id, row] as const));
const liveCases = context.clinicalRelease.cases.filter(row => row.pediatricProfile && row.procedureContext?.mode === "live");
const clinicCases = [...allCases.values()].filter(row => row.pediatricProfile && row.requiredClinicalSetting === "clinic"
  && getPediatricClinicFamilyContext(row));
const visitCases = clinicCases.filter(row => row.routineEligible);
const approvedLooks = new Map(approved.children.map(row => [row.id, row]));
const authoredFamily = (row: SyntheticClinicalCase) => getPediatricClinicFamilyContext(row)!;
const deserialize = (state: GameState, ctx: DomainContext) => deserializeGameState(serializeGameState(state), ctx);
const seeds = Array.from({ length: 32 }, (_, index) => `kids.public.look.${index}`);
const nameIn = (text: string, childName: string) => text.replaceAll("{patientName}", childName);

function questionMeaning(clinicalCase: SyntheticClinicalCase, childName: string) {
  return clinicalCase.decisionNodes.map(node => ({ id: node.id, variant: node.questionVariantId, stem: nameIn(node.stem, childName),
    answers: node.answerChoices.map(choice => [choice.id, nameIn(choice.label, childName), choice.isCorrect]).sort() }));
}

function clinicContext(clinicalCase: SyntheticClinicalCase): DomainContext {
  return { ...context, clinicalRelease: { ...context.clinicalRelease,
    cases: [...context.clinicalRelease.cases.filter(row => row.tutorialEligible && row.id !== clinicalCase.id), clinicalCase] } };
}

function checkLook(stillId: string | undefined, clinicalCase: SyntheticClinicalCase) {
  const { ageYears, sexLabel } = authoredFamily(clinicalCase).prototypeDemographics;
  const look = approvedLooks.get(stillId ?? "");
  expect(look, `Unapproved look ${stillId} for ${clinicalCase.id}`).toBeDefined();
  expect(look!.sex).toBe(sexLabel);
  expect(ageYears).toBeGreaterThanOrEqual(look!.minimumAge);
  expect(ageYears).toBeLessThanOrEqual(look!.maximumAge);
  expect(pediatricStillEligibleEntries(sexLabel, ageYears).some(row => row.stillId === stillId)).toBe(true);
}

function checkFamily(state: GameState, clinicalCase: SyntheticClinicalCase, kind: "encounter" | "service_visitor", id: string) {
  const family = pediatricFamilyForActor(state, kind, id);
  expect(family, `Real family was created for ${clinicalCase.id}`).toBeDefined();
  expect(state.retailExternalActors.find(actor => actor.id === family!.parentActorId)?.displayName).toBe(authoredFamily(clinicalCase).parentName);
}

function readyClinic() {
  let state = createPediatricAppointmentsQaState(context);
  state = engCommand(state, { type: "SET_PAUSED", paused: false }, context);
  state.serviceAppointmentsEnabled = false;
  for (let minute = 0; minute < 80 && state.employees.some(employee => !isEmployeeOperational(state, employee.id, context)); minute++) {
    state = engTick(state, context);
  }
  expect(state.employees.every(employee => isEmployeeOperational(state, employee.id, context))).toBe(true);
  return state;
}

function preparedVisit(clinicalCase: SyntheticClinicalCase) {
  const declared = clinicalCase.procedureContext;
  if (declared?.mode === "live") {
    const prepared = engProcedureClinic(declared.kind, clinicalCase);
    return { ...prepared, line: declared.allowedIncomeLineIds[0]! };
  }
  const state = readyClinic();
  const ctx = clinicContext(clinicalCase), line = "income.pediatric_consult";
  const id = startServiceOperation(state, line, "visitor", ctx);
  expect(id, `A staffed public pediatric clinic starts ${clinicalCase.id}`).toBeTruthy();
  return { state, context: ctx, line, id: id! };
}

function checkVisit(state: GameState, id: string, clinicalCase: SyntheticClinicalCase) {
  const op = state.serviceOperations.find(row => row.id === id)!;
  const source = authoredFamily(clinicalCase);
  expect(op.displayName).toBe(source.childName);
  expect(op.clinicVisit?.demographics).toEqual(source.prototypeDemographics);
  if (clinicalCase.procedureContext?.mode === "live") {
    expect(op.procedureContext?.familyId).toBe(clinicalCase.procedureContext.familyId);
    expect(op.procedureContext?.pediatricFamilyContext).toMatchObject({ profileId: source.profileId, parentName: source.parentName,
      childName: source.childName, parentRelationship: source.parentRelationship });
  }
  checkFamily(state, clinicalCase, "service_visitor", id);
  checkLook(op.appearance?.stillId, clinicalCase);
  return op;
}

function checkVariety(stills: Set<string>, caseId: string) {
  expect(stills.size, `Seeded appearances for ${caseId} are still pinned: ${[...stills].join(", ")}`).toBeGreaterThan(1);
  expect([...stills].some(id => id.startsWith("pediatric-variety-")), `${caseId} can reach the approved additions`).toBe(true);
}

describe("authored pediatric identities and compatible child looks", () => {
  it("has public authored fixtures for outpatient, endoscopy and OR presentations", () => {
    expect(clinicCases.length).toBeGreaterThan(1);
    expect(visitCases.length).toBeGreaterThan(1);
    expect(new Set(liveCases.map(row => row.procedureContext?.mode === "live" && row.procedureContext.kind))).toEqual(new Set(["endoscopy", "operation"]));
  });

  it.each(clinicCases.map(row => [row.id, row] as const))("admits %s with more than one compatible look across seeds", (_id, clinicalCase) => {
    const baseline = createPediatricAppointmentsQaState(context), ctx = clinicContext(clinicalCase);
    const stills = new Set<string>();
    const source = authoredFamily(clinicalCase);
    for (const seed of seeds) {
      const encounterId = "encounter.kids.public";
      const state = engCommand({ ...baseline, campaignSeed: seed },
        { type: "ADMIT_PATIENT", encounterId, caseId: clinicalCase.id, patientDisplayName: source.childName, arrivalClass: "routine" }, ctx);
      const encounter = state.encounters[encounterId]!;
      expect(encounter.patientDisplayName).toBe(source.childName);
      expect(encounter.frozenCase).toMatchObject({ id: clinicalCase.id, patientDisplayName: source.childName,
        prototypeDemographics: source.prototypeDemographics, selectedInstantiationProfileId: source.profileId,
        presentation: nameIn(clinicalCase.presentation, source.childName) });
      expect(questionMeaning(encounter.frozenCase, source.childName)).toEqual(questionMeaning(clinicalCase, source.childName));
      checkFamily(state, clinicalCase, "encounter", encounterId);
      checkLook(encounter.patientAppearance.stillId, clinicalCase);
      stills.add(encounter.patientAppearance.stillId!);
    }
    checkVariety(stills, clinicalCase.id);
  });

  it.each([...visitCases, ...liveCases].map(row => [row.id, row] as const))("schedules %s with more than one compatible look across seeds", (_id, clinicalCase) => {
    const { state: template, context: ctx, line } = preparedVisit(clinicalCase);
    const stills = new Set<string>();
    for (const seed of seeds) {
      const state = structuredClone(template);
      state.campaignSeed = seed;
      // A fresh arrival at the same ready clinic, with no prior patient names
      // or reservations. startServiceOperation is the real appointment factory.
      state.serviceOperations = [];
      state.pediatricFamilies = {};
      state.retailExternalActors = [];
      const id = startServiceOperation(state, line, "visitor", ctx);
      expect(id, `Could not schedule ${clinicalCase.id} with ${seed}`).toBeTruthy();
      stills.add(checkVisit(state, id!, clinicalCase).appearance!.stillId!);
    }
    checkVariety(stills, clinicalCase.id);
  });
});

const bindingCases = [visitCases[0]!, ...liveCases];

function bindVisit(clinicalCase: SyntheticClinicalCase, useAlternate: boolean) {
  const { state: arrival, context: ctx, id } = preparedVisit(clinicalCase);
  const source = authoredFamily(clinicalCase);
  const op = checkVisit(arrival, id, clinicalCase);
  // Exercise old saves even once new arrivals select a wider pool. Change
  // only the saved cosmetic identity, keeping the authored chart and family.
  const still = useAlternate ? pediatricStillEligibleEntries(source.prototypeDemographics.sexLabel,
    source.prototypeDemographics.ageYears).find(row => row.stillId !== source.childStillId && row.stillId.startsWith("level3-roster-v2."))!.stillId
    : source.childStillId;
  op.appearance!.stillId = still;
  if (op.procedureContext?.pediatricFamilyContext) op.procedureContext.pediatricFamilyContext.childStillId = still;
  let state = deserialize(arrival, ctx);
  expect(state.serviceOperations.find(row => row.id === id)?.appearance?.stillId).toBe(still);
  if (clinicalCase.procedureContext?.mode === "live") {
    state = advanceEngProcedure(state, ctx, id);
  } else {
    for (let minute = 0; minute < 400 && state.serviceOperations.find(row => row.id === id)?.status !== "in_service"; minute++) state = engTick(state, ctx);
  }
  const active = state.serviceOperations.find(row => row.id === id)!;
  expect(active).toMatchObject({ status: "in_service", appearance: { stillId: still } });
  expect(state.openChartEncounterId).toBeNull();
  state.nextRoutineArrivalTick = state.facilityTick;
  const allowedMinutes = FOUNDER_CONSULT_POLICY.procedureEarliestWorkMinutes + 8;
  for (let minute = 0; minute < allowedMinutes && !state.serviceOperations.find(row => row.id === id)?.consultEncounterId; minute++) {
    state = engTick(state, ctx);
  }
  const linked = state.serviceOperations.find(row => row.id === id)!;
  expect(linked.consultEncounterId, `${clinicalCase.id}: active visit with compatible saved look ${still} must bind its real chart`).toBeTruthy();
  const encounterId = linked.consultEncounterId!;
  state = engCommand(state, { type: "OPEN_CHART", encounterId }, ctx);
  const encounter = state.encounters[encounterId]!;
  expect(encounter.consult?.serviceOperationId).toBe(id);
  expect(encounter.patientAppearance.stillId).toBe(still);
  expect(encounter.patientDisplayName).toBe(source.childName);
  expect(encounter.frozenCase).toMatchObject({ id: clinicalCase.id, prototypeDemographics: source.prototypeDemographics,
    selectedInstantiationProfileId: source.profileId });
  expect(questionMeaning(encounter.frozenCase, source.childName)).toEqual(questionMeaning(clinicalCase, source.childName));
  const reloaded = deserialize(state, ctx);
  expect(reloaded.encounters[encounterId]).toEqual(encounter);
  expect(reloaded.serviceOperations.find(row => row.id === id)?.appearance?.stillId).toBe(still);
  checkFamily(reloaded, clinicalCase, "encounter", encounterId);
}

describe("pediatric consults bind the saved child and preserve frozen charts", () => {
  it.each(bindingCases.map(row => [row.id, row] as const))("binds and reloads %s with a compatible non-pinned look", (_id, clinicalCase) => {
    bindVisit(clinicalCase, true);
  });

  it.each(bindingCases.map(row => [row.id, row] as const))("legacy saved-look control binds and reloads %s", (_id, clinicalCase) => {
    bindVisit(clinicalCase, false);
  });
});
