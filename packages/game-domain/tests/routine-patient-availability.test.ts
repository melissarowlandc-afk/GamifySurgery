import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  canAdmitPatient,
  createInitialGameState,
  getRoutinePatientAvailability,
  isEmployeeDiscussionCase,
  selectRoutineClinicalCase,
  type ConceptReviewEvidence,
  type DomainContext,
  type EmployeeDiscussionState,
  type EncounterState,
  type GameState,
} from "../src";

const NOW = 10_000;
const initialState = createInitialGameState();
const templateEncounter = Object.values(initialState.encounters)[0]!;
const templateCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
  (clinicalCase) => clinicalCase.routineEligible && !isEmployeeDiscussionCase(clinicalCase),
)!;
const templateNode = templateCase.decisionNodes[0]!;

function caseFor(id: string, conceptIds: readonly string[]): SyntheticClinicalCase {
  return {
    ...templateCase,
    id,
    routineEligible: true,
    earliestFacilityStage: 1,
    requiredCapabilityIds: [],
    decisionNodes: conceptIds.map((conceptId, index) => ({
      ...templateNode,
      id: `node.${id}.${index}`,
      primaryConceptId: conceptId,
    })),
  };
}

function contextFor(cases: readonly SyntheticClinicalCase[]): DomainContext {
  return {
    ...PROTOTYPE_DOMAIN_CONTEXT,
    clinicalRelease: { ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease, cases: [...cases] },
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
  state.nextRoutineArrivalTick = 10;
  state.paused = false;
  state.encounters = {};
  state.employeeDiscussions = {};
  state.rooms = [];
  state.doors = [];
  state.employees = [];
  return state;
}

function reviewed(state: GameState, conceptId: string, dueAtMs: number): void {
  const templateHistory = Object.values(initialState.learningHistories)[0]!;
  state.learningHistories[conceptId] = {
    conceptId,
    card: { ...templateHistory.card, dueAtMs, lastReviewAtMs: 1, reps: 1 },
    reviews: [{} as ConceptReviewEvidence],
  };
}

function activeEncounter(
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
    id: "discussion.availability",
    clinicalReleaseId: initialState.clinicalReleaseId,
    frozenCase: clinicalCase,
    employeeId: "employee.availability",
    employeeDisplayName: "Fixture colleague",
    employeeAppearance: templateEncounter.patientAppearance,
    lifecycle: "active_action_required",
    createdAtFacilityTick: 0,
    firstOpenedAtTick: 1,
    resolvedAtFacilityTick: null,
    cancellationReason: null,
    currentNodeIndex: 0,
    answers: [],
    steps: [],
  };
}

function freezeDeep(value: unknown): void {
  if (value === null || typeof value !== "object") return;
  for (const child of Object.values(value)) freezeDeep(child);
  Object.freeze(value);
}

describe("routine patient availability explanation", () => {
  it("explains paused time before any admission opportunity", () => {
    const state = clinic();
    state.paused = true;
    expect(getRoutinePatientAvailability(state, NOW, contextFor([caseFor("new", ["concept.new"])])))
      .toMatchObject({ reason: "paused", nextReviewAtRealMs: null });
  });

  it("uses the actual workload limit, including pending encounters", () => {
    const state = clinic();
    const context = contextFor([caseFor("new", ["concept.new"])]);
    const first = activeEncounter(caseFor("active", ["concept.active"]));
    const second = activeEncounter(caseFor("pending", ["concept.pending"]), "active_pending_result");
    state.encounters[first.id] = first;
    state.encounters[second.id] = second;
    expect(canAdmitPatient(state, "routine", context)).toBe(false);
    expect(getRoutinePatientAvailability(state, NOW, context))
      .toMatchObject({ reason: "at_capacity", pendingEncounterCount: 1 });
    delete state.encounters[first.id];
    expect(canAdmitPatient(state, "routine", context)).toBe(true);
    expect(getRoutinePatientAvailability(state, NOW, context).reason).toBe("available");
  });

  it.each(["new", "due"])("keeps %s cases available and separates the scheduled arrival interval", (kind) => {
    const state = clinic();
    const candidate = caseFor(kind, [`concept.${kind}`]);
    if (kind === "due") reviewed(state, "concept.due", NOW);
    const context = contextFor([candidate]);
    expect(selectRoutineClinicalCase(state, [candidate], NOW)).not.toBeNull();
    expect(getRoutinePatientAvailability(state, NOW, context).reason).toBe("available");
    state.nextRoutineArrivalTick = state.facilityTick + 30;
    expect(getRoutinePatientAvailability(state, NOW, context))
      .toMatchObject({ reason: "arrival_scheduled", nextReviewAtRealMs: null });
  });

  it("waits for every learned concept in a mixed case, while unrevised cards remain unseen", () => {
    const state = clinic();
    const candidate = caseFor("mixed", ["concept.early", "concept.later", "concept.unseen"]);
    reviewed(state, "concept.early", 20_000);
    reviewed(state, "concept.later", 50_000);
    reviewed(state, "concept.unseen", 90_000);
    state.learningHistories["concept.unseen"]!.reviews = [];
    const context = contextFor([candidate]);
    expect(selectRoutineClinicalCase(state, [candidate], NOW)).toBeNull();
    expect(getRoutinePatientAvailability(state, NOW, context))
      .toMatchObject({ reason: "reviews_scheduled", nextReviewAtRealMs: 50_000 });
    expect(selectRoutineClinicalCase(state, [candidate], 50_000)).not.toBeNull();
    expect(getRoutinePatientAvailability(state, 50_000, context).reason).toBe("available");
  });

  it("takes the earliest complete-case date and excludes active, capability and stage blocked cases", () => {
    const state = clinic();
    const mixed = caseFor("mixed", ["concept.early", "concept.later"]);
    const standalone = caseFor("standalone", ["concept.standalone"]);
    const active = caseFor("active", ["concept.active"]);
    const missingCapability = { ...caseFor("gated", ["concept.gated"]), requiredCapabilityIds: ["capability.ultrasound"] };
    const futureStage = { ...caseFor("future-stage", ["concept.future-stage"]), earliestFacilityStage: 2 as const };
    reviewed(state, "concept.early", 20_000);
    reviewed(state, "concept.later", 50_000);
    reviewed(state, "concept.standalone", 40_000);
    reviewed(state, "concept.active", 15_000);
    reviewed(state, "concept.gated", 12_000);
    reviewed(state, "concept.future-stage", 11_000);
    const encounter = activeEncounter(active);
    state.encounters[encounter.id] = encounter;
    expect(getRoutinePatientAvailability(state, NOW, contextFor([mixed, standalone, active, missingCapability, futureStage])))
      .toMatchObject({ reason: "reviews_scheduled", nextReviewAtRealMs: 40_000 });
  });

  it("reserves every concept in an unresolved frozen encounter, including later decisions", () => {
    const state = clinic();
    const candidate = caseFor("candidate", ["concept.later"]);
    const encounter = activeEncounter(caseFor("existing", ["concept.first", "concept.later"]), "active_pending_result");
    state.encounters[encounter.id] = encounter;
    const context = contextFor([candidate]);
    expect(selectRoutineClinicalCase(state, [candidate], NOW)).toBeNull();
    expect(getRoutinePatientAvailability(state, NOW, context))
      .toMatchObject({ reason: "in_progress", pendingEncounterCount: 1, nextReviewAtRealMs: null });
    encounter.resolutionReason = "completed";
    encounter.lifecycle = "resolved_summary_available";
    expect(getRoutinePatientAvailability(state, NOW, context).reason).toBe("available");
  });

  it.each(["active_action_required", "resolved_summary_available", "resolved", "cancelled"] as const)
    ("applies the existing %s team-discussion concept reservation", (lifecycle) => {
      const state = clinic();
      const candidate = caseFor("candidate", ["concept.shared"]);
      const discussion = discussionFor(caseFor("discussion", ["concept.shared"]));
      discussion.lifecycle = lifecycle;
      state.employeeDiscussions = { [discussion.id]: discussion };
      const remainsActive = lifecycle !== "resolved" && lifecycle !== "cancelled";
      expect(getRoutinePatientAvailability(state, NOW, contextFor([candidate])))
        .toMatchObject({ reason: remainsActive ? "in_progress" : "available", activeDiscussionCount: remainsActive ? 1 : 0 });
    });

  it("does not show a future date belonging to an active discussion", () => {
    const state = clinic();
    reviewed(state, "concept.shared", 20_000);
    reviewed(state, "concept.other", 40_000);
    const discussion = discussionFor(caseFor("discussion", ["concept.shared"]));
    state.employeeDiscussions = { [discussion.id]: discussion };
    expect(getRoutinePatientAvailability(state, NOW, contextFor([
      caseFor("shared", ["concept.shared"]), caseFor("other", ["concept.other"]),
    ]))).toMatchObject({ reason: "reviews_scheduled", nextReviewAtRealMs: 40_000 });
  });

  it("distinguishes absent operational capabilities from unavailable patient content", () => {
    const state = clinic();
    const gated = { ...caseFor("gated", ["concept.gated"]), requiredCapabilityIds: ["capability.ultrasound"] };
    expect(getRoutinePatientAvailability(state, NOW, contextFor([gated])))
      .toMatchObject({ reason: "capabilities_unavailable", nextReviewAtRealMs: null });
    const discussionCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(isEmployeeDiscussionCase)!;
    expect(getRoutinePatientAvailability(state, NOW, contextFor([
      { ...caseFor("discussion-only", ["concept.discussion"]), participant: discussionCase.participant },
      { ...caseFor("later-only", ["concept.later"]), earliestFacilityStage: 2 },
      { ...caseFor("not-routine", ["concept.not-routine"]), routineEligible: false },
    ]))).toMatchObject({ reason: "content_unavailable", nextReviewAtRealMs: null });
  });

  it("keeps outside service and retail visitors separate from educational workload and eligibility", () => {
    const state = clinic();
    const context = contextFor([caseFor("review", ["concept.review"])]);
    reviewed(state, "concept.review", 40_000);
    const beforeVisitors = getRoutinePatientAvailability(state, NOW, context);
    state.serviceOperations.push({
      id: "service.outside", incomeLineId: "income.xray", catalogVersion: 1,
      actorKind: "visitor", actorId: "visitor.service", displayName: "Outside visitor",
      appearance: templateEncounter.patientAppearance, status: "waiting_for_resources",
      createdAtFacilityTick: 0, waitDeadlineFacilityTick: 100,
      startedAtFacilityTick: null, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
      quoteFee: 0, phaseIndex: 0, phaseStartedAtFacilityTick: null, phaseEndsAtFacilityTick: null,
      reservedRoomInstanceIds: [], reservedEmployeeIds: [], providerReservation: null,
      location: null, path: [], pathIndex: 0, lastMovedAtFacilityTick: 0, cancellationReason: null,
    });
    state.retailExternalActors.push({
      id: "visitor.retail", kind: "retail_visitor", displayName: "Retail visitor",
      appearance: templateEncounter.patientAppearance, linkedServiceOperationId: null,
      linkedEncounterId: null, lifecycle: "onsite", location: null, path: [], pathIndex: 0,
      lastMovedAtFacilityTick: 0, activeRetailOperationId: null,
    });
    expect(getRoutinePatientAvailability(state, NOW, context)).toEqual(beforeVisitors);
    expect(beforeVisitors).toMatchObject({ reason: "reviews_scheduled", activeEncounterCount: 0, nextReviewAtRealMs: 40_000 });
  });

  it("reads frozen inputs without changing learning histories, scheduling, events or encounters", () => {
    const state = clinic();
    reviewed(state, "concept.review", 40_000);
    const context = structuredClone(contextFor([caseFor("review", ["concept.review"])]));
    const stateBefore = structuredClone(state);
    const contextBefore = structuredClone(context);
    freezeDeep(state);
    freezeDeep(context);
    expect(getRoutinePatientAvailability(state, NOW, context).reason).toBe("reviews_scheduled");
    expect(state).toEqual(stateBefore);
    expect(context).toEqual(contextBefore);
  });

  it.each([-1, 0.5, Number.MAX_SAFE_INTEGER + 1])("rejects an invalid real-time timestamp %s", (timestamp) => {
    expect(() => getRoutinePatientAvailability(clinic(), timestamp, contextFor([]))).toThrow("valid timestamp");
  });
});
