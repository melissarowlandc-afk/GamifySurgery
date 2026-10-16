import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  isEmployeeDiscussionCase,
  type ConceptReviewEvidence,
  type DomainContext,
  type EmployeeDiscussionState,
  type EncounterState,
  type GameState,
} from "@gamify-surgery/game-domain";
import { PatientLists } from "../ui/PatientLists";
import type { EmployeeDiscussionTabView, PatientTabView } from "../ui/types";
import { createPatientAvailabilityGuidance } from "./patientAvailabilityViewModel";
import { createPrototypePlayerView } from "./viewModels";

const NOW = Date.UTC(2026, 9, 7, 12, 0);
const initialState = createInitialGameState();
const templateEncounter = Object.values(initialState.encounters)[0]!;
const templateCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
  (clinicalCase) => clinicalCase.routineEligible && !isEmployeeDiscussionCase(clinicalCase),
)!;

function caseFor(id: string, concepts = [`concept.${id}`]): SyntheticClinicalCase {
  return {
    ...templateCase,
    id,
    routineEligible: true,
    earliestFacilityStage: 1,
    requiredCapabilityIds: [],
    decisionNodes: concepts.map((conceptId, index) => ({
      ...templateCase.decisionNodes[0]!,
      id: `node.${id}.${index}`,
      primaryConceptId: conceptId,
    })),
  };
}

function contextFor(cases: SyntheticClinicalCase[]): DomainContext {
  return {
    ...PROTOTYPE_DOMAIN_CONTEXT,
    clinicalRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease, cases },
    balanceRelease: {
      ...PROTOTYPE_DOMAIN_CONTEXT.balanceRelease,
      workload: { ...PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.workload, baseRoutineLimit: 2 },
    },
  };
}

function clinic(): GameState {
  const state = createInitialGameState();
  state.facilityLevel = 1;
  state.facilityTick = 10;
  state.nextRoutineArrivalTick = 20;
  state.paused = false;
  state.encounters = {};
  state.employeeDiscussions = {};
  state.rooms = [];
  state.doors = [];
  state.employees = [];
  return state;
}

function encounterFor(
  clinicalCase: SyntheticClinicalCase,
  lifecycle: EncounterState["lifecycle"] = "active_action_required",
): EncounterState {
  return {
    ...structuredClone(templateEncounter),
    id: `encounter.${clinicalCase.id}`,
    frozenCase: clinicalCase,
    lifecycle,
    resolutionReason: null,
    checkInStatus: "checked_in",
    patientMovement: null,
  };
}

function discussionFor(clinicalCase: SyntheticClinicalCase): EmployeeDiscussionState {
  return {
    id: "discussion.availability", clinicalReleaseId: initialState.clinicalReleaseId,
    frozenCase: clinicalCase, employeeId: "employee.availability", employeeDisplayName: "Fixture colleague",
    employeeAppearance: templateEncounter.patientAppearance, lifecycle: "active_action_required",
    createdAtFacilityTick: 0, firstOpenedAtTick: 1, resolvedAtFacilityTick: null,
    cancellationReason: null, currentNodeIndex: 0, answers: [], steps: [],
  };
}

function reviewed(state: GameState, conceptId: string, dueAtMs: number): void {
  const templateHistory = Object.values(initialState.learningHistories)[0]!;
  state.learningHistories[conceptId] = {
    conceptId,
    card: { ...templateHistory.card, dueAtMs, lastReviewAtMs: NOW - 1, reps: 1 },
    reviews: [{} as ConceptReviewEvidence],
  };
}

describe("patient availability guidance", () => {
  it("preserves Level 0 and hides guidance when Waiting contains a patient or discussion", () => {
    const state = clinic();
    const candidate = caseFor("new");
    const context = contextFor([candidate]);
    state.facilityLevel = 0;
    expect(createPatientAvailabilityGuidance(state, NOW, context)).toBeNull();
    state.facilityLevel = 1;
    const encounter = encounterFor(candidate, "waiting_unopened");
    state.encounters[encounter.id] = encounter;
    expect(createPatientAvailabilityGuidance(state, NOW, context)).toBeNull();
    state.encounters = {};
    const discussion = discussionFor(candidate);
    discussion.lifecycle = "waiting_unopened";
    state.employeeDiscussions = { [discussion.id]: discussion };
    expect(createPatientAvailabilityGuidance(state, NOW, context)).toBeNull();
  });

  it("offers resume and capacity next steps without promising arrival times", () => {
    const state = clinic();
    const context = contextFor([caseFor("new")]);
    state.paused = true;
    expect(createPatientAvailabilityGuidance(state, NOW, context)).toBe(
      "The clinic is paused. Resume facility time when you're ready to continue.",
    );
    state.paused = false;
    for (const id of ["first", "second"]) {
      const encounter = encounterFor(caseFor(id));
      state.encounters[encounter.id] = encounter;
    }
    expect(createPatientAvailabilityGuidance(state, NOW, context)).toBe(
      "New visits are paused while the clinic is at capacity. Continue current visits to make room.",
    );
  });

  it("keeps normal quiet intervals calm even when an arrival attempt is due", () => {
    const state = clinic();
    const context = contextFor([caseFor("new")]);
    const expected = "No new patients waiting. Keep the clinic running for the next eligible visit.";
    expect(createPatientAvailabilityGuidance(state, NOW, context)).toBe(expected);
    state.nextRoutineArrivalTick = state.facilityTick;
    expect(createPatientAvailabilityGuidance(state, NOW, context)).toBe(expected);
  });

  it("points a blocked pending visit to Existing Patients without a new test-duration promise", () => {
    const state = clinic();
    const candidate = caseFor("shared");
    const encounter = encounterFor(candidate, "active_pending_result");
    state.encounters[encounter.id] = encounter;
    expect(createPatientAvailabilityGuidance(state, NOW, contextFor([candidate]))).toBe(
      "Some patients are waiting on tests. Keep the clinic running and check Existing Patients when results return.",
    );
    encounter.lifecycle = "active_action_required";
    expect(createPatientAvailabilityGuidance(state, NOW, contextFor([candidate])))
      .toContain("Continue any available chart in Existing Patients");
  });

  it("names a blocking team discussion without inventing a patient test", () => {
    const state = clinic();
    const candidate = caseFor("shared");
    const discussion = discussionFor(candidate);
    state.employeeDiscussions = { [discussion.id]: discussion };
    expect(createPatientAvailabilityGuidance(state, NOW, contextFor([candidate]))).toBe(
      "A team discussion is still in progress. Continue it in Existing Patients.",
    );
  });

  it("labels the complete-case review date as real-world eligibility and allows pausing", () => {
    const state = clinic();
    const candidate = caseFor("mixed", ["concept.early", "concept.later", "concept.new"]);
    reviewed(state, "concept.early", NOW + 15 * 60_000);
    const completeCaseDate = NOW + 2 * 60 * 60_000;
    reviewed(state, "concept.later", completeCaseDate);
    const expectedDate = new Intl.DateTimeFormat(undefined, {
      dateStyle: "short", timeStyle: "short",
    }).format(new Date(completeCaseDate));
    expect(createPatientAvailabilityGuidance(state, NOW, contextFor([candidate]))).toBe(
      `Next review eligibility: ${expectedDate} (real-world time). You can pause the clinic and return later; arrival timing can vary.`,
    );
  });

  it("explains unavailable rooms/staff and unavailable level content without an advertising suggestion", () => {
    const state = clinic();
    const gated = { ...caseFor("gated"), requiredCapabilityIds: ["capability.ultrasound"] };
    const gatedGuidance = createPatientAvailabilityGuidance(state, NOW, contextFor([gated]));
    expect(gatedGuidance).toContain("current rooms and staff");
    expect(gatedGuidance).toContain("Goals");
    const unavailableGuidance = createPatientAvailabilityGuidance(state, NOW, contextFor([]));
    expect(unavailableGuidance).toContain("Check Existing Patients and Goals");
    expect(`${gatedGuidance} ${unavailableGuidance}`).not.toMatch(/advertis|guarantee|arriv.*at \d/i);
  });

  it("projects the new property without mutating the campaign and preserves Level 0", () => {
    const state = createInitialGameState();
    state.facilityLevel = 1;
    state.paused = true;
    state.encounters = {};
    state.openChartEncounterId = null;
    state.attendedEncounterId = null;
    const before = structuredClone(state);
    expect(createPrototypePlayerView(state, null, false, null).patientAvailabilityGuidance)
      .toContain("The clinic is paused");
    expect(state).toEqual(before);
    state.facilityLevel = 0;
    expect(createPrototypePlayerView(state, null, false, null).patientAvailabilityGuidance).toBeNull();
  });
});

describe("empty Waiting folder guidance rendering", () => {
  const guidance = "Quiet clinic guidance.";
  const onOpen = () => undefined;

  it("renders one static paragraph in Waiting and preserves the Existing Patients empty state", () => {
    const markup = renderToStaticMarkup(createElement(PatientLists, {
      patients: [], onOpen, availabilityGuidance: guidance,
    }));
    const waiting = markup.match(/<section class="patient-folder is-waiting is-empty">([\s\S]*?)<\/section>/)?.[1];
    const existing = markup.match(/<section class="patient-folder is-active is-empty">([\s\S]*?)<\/section>/)?.[1];
    expect(waiting).toContain(`<p class="empty-state patient-availability-guidance">${guidance}</p>`);
    expect(existing).toContain("<p class=\"empty-state\">No charts</p>");
    expect(markup.split(guidance)).toHaveLength(2);
    expect(markup).not.toMatch(/aria-live|role="(?:alert|status)"/);
  });

  it("keeps the original empty text when no guidance is supplied", () => {
    const markup = renderToStaticMarkup(createElement(PatientLists, { patients: [], onOpen }));
    expect(markup.match(/<p class="empty-state">No charts<\/p>/g)).toHaveLength(2);
    expect(markup).not.toContain(guidance);
  });

  it("never replaces a waiting chart or discussion with availability guidance", () => {
    const patient: PatientTabView = {
      id: "patient.waiting", folder: "waiting", name: "Fixture patient", subtitle: "",
      statusLabel: "Waiting", actionRequired: true, selected: false, satisfactionPercent: 100,
    };
    const discussion: EmployeeDiscussionTabView = {
      subjectKind: "employee-discussion", id: "discussion.waiting", employeeId: "employee.fixture",
      folder: "waiting", name: "Fixture colleague", roleLabel: "Colleague", statusLabel: "Discussion waiting",
      actionRequired: true, selected: false,
    };
    for (const props of [{ patients: [patient] }, { patients: [], discussions: [discussion] }]) {
      const markup = renderToStaticMarkup(createElement(PatientLists, {
        ...props, onOpen, availabilityGuidance: guidance,
      }));
      expect(markup).toContain("Fixture");
      expect(markup).not.toContain(guidance);
    }
  });
});
