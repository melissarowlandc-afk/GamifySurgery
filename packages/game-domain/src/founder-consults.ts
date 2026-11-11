import { FOUNDER_CONSULT_POLICY } from "@gamify-surgery/balance-config";
import { VARIETY3_ADULT_CONTEXTS, type SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { normalizePatientAppearanceForSex } from "./appearance";
import { getClinicalCaseEligibilityIssue, getPediatricClinicFamilyContext } from "./clinical-case-eligibility";
import { selectRoutineClinicalCase } from "./clinical-selection";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { getProcedureStaffStandingSpots } from "./procedural-staffing";
import { getCurrentCapabilities, getRoomDefinition } from "./selectors";
import { waitingOccupiedPointKeys } from "./waiting-destinations";
import type { DomainContext, EncounterState, FounderConsultState, GameState, ServiceOperationState } from "./types";

// These existing concepts explicitly ask about visible endoscopic findings or
// endoscopic treatment. Post-biopsy pathology/referral cases are not intra-op
// scenarios. No clinical prose or relationships are manufactured here.
const endoscopicFindingConcepts = new Set([
  "concept.colonic-lipoma.endoscopic-recognition.v3",
  "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis.v2",
  "concept.peptic-ulcer-bleeding.high-risk-stigmata-endoscopic-hemostasis",
  "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
  "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality",
]);

export function procedureConsultKind(clinicalCase: SyntheticClinicalCase): "endoscopy" | "operation" | null {
  if (clinicalCase.participant || clinicalCase.pediatricProfile || clinicalCase.decisionNodes.some(node =>
    node.resultGateAfter || node.answerChoices.some(choice => choice.serviceRequest))) return null;
  if (clinicalCase.requiredClinicalSetting === "ambulatory_surgery") return "operation";
  return ["endoscopy", "outpatient_endoscopy"].includes(clinicalCase.requiredClinicalSetting) &&
    endoscopicFindingConcepts.has(clinicalCase.decisionNodes[0]!.primaryConceptId) ? "endoscopy" : null;
}

/** Presentation coverage from existing authored profiles, not a case/concept
 * reservation. No demographic value or new medical variant is invented. */
export function procedureConsultPresentations(state: GameState, context: DomainContext, lineId: string) {
  const kind = ["income.endoscopy", "income.advanced_endoscopy"].includes(lineId) ? "endoscopy"
    : ["income.ambulatory_operation", "income.ambulatory_operation_extended"].includes(lineId) ? "operation" : null;
  if (!kind) return [];
  const unique = new Map<string, { sexLabel: "Female" | "Male"; ageYears: number }>();
  for (const c of context.clinicalRelease.cases) {
    if (!kind || !c.routineEligible || c.earliestFacilityStage > state.facilityLevel || procedureConsultKind(c) !== kind) continue;
    for (const profile of c.approvedInstantiationProfiles?.length ? c.approvedInstantiationProfiles : [{ prototypeDemographics: c.prototypeDemographics }]) {
      const d = profile.prototypeDemographics ?? c.prototypeDemographics;
      if ((d?.sexLabel === "Female" || d?.sexLabel === "Male") && d.ageYears !== undefined && d.ageYears >= 18) unique.set(`${d.sexLabel}:${d.ageYears}`, { sexLabel: d.sexLabel, ageYears: d.ageYears });
    }
  }
  return [...unique.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, value]) => value);
}

/** Choose only a published profile whose existing patient art survives reload. */
export function compatibleConsultProfile(clinicalCase: SyntheticClinicalCase, operation: ServiceOperationState): string | null | undefined {
  if (!operation.appearance) return undefined;
  if (clinicalCase.pediatricProfile) {
    const family = getPediatricClinicFamilyContext(clinicalCase);
    if (!family || family.childName !== operation.displayName || family.childStillId !== operation.appearance.stillId) return undefined;
  }
  const profiles = clinicalCase.approvedInstantiationProfiles?.length
    ? [...clinicalCase.approvedInstantiationProfiles].sort((a, b) => a.id.localeCompare(b.id))
    : [{ id: null, prototypeDemographics: clinicalCase.prototypeDemographics }];
  for (const profile of profiles) {
    const fixed = VARIETY3_ADULT_CONTEXTS.find(row => row.caseId === clinicalCase.id && row.profileId === profile.id);
    if (fixed && (fixed.patientName !== operation.displayName || fixed.patientStillId !== operation.appearance.stillId)) continue;
    const demographics = profile.prototypeDemographics ?? clinicalCase.prototypeDemographics;
    if (!demographics?.sexLabel || demographics.ageYears === undefined) continue;
    if (operation.clinicVisit && (operation.clinicVisit.demographics.ageYears !== demographics.ageYears ||
        operation.clinicVisit.demographics.sexLabel !== demographics.sexLabel)) continue;
    const normalized = normalizePatientAppearanceForSex(operation.appearance, demographics.sexLabel, demographics.ageYears, "consult.compatibility");
    if (normalized.stillId === operation.appearance.stillId) return profile.id;
  }
  return undefined;
}

export function selectProcedureConsult(state: GameState, context: DomainContext, atRealMs: number, activeDiscussionConceptIds: ReadonlySet<string>) {
  for (const operation of [...state.serviceOperations].sort((a, b) => a.createdAtFacilityTick - b.createdAtFacilityTick || a.id.localeCompare(b.id))) {
    if (operation.actorKind !== "visitor" || operation.consultEncounterId || operation.status !== "in_service" ||
        operation.phaseStartedAtFacilityTick === null || state.facilityTick - operation.phaseStartedAtFacilityTick < FOUNDER_CONSULT_POLICY.procedureEarliestWorkMinutes) continue;
    const phase = operation.frozenOperationPhases?.[operation.phaseIndex];
    const kind = phase?.roomDefinitionId === "room.endoscopy" ? "endoscopy"
      : phase?.roomDefinitionId === "room.ambulatory_or" ? "operation" : null;
    const roomId = operation.reservedRoomInstanceIds.find(id => state.rooms.some(room => room.id === id && room.roomDefinitionId === phase?.roomDefinitionId));
    if (!kind || !roomId) continue;
    // The actual staffed, reserved procedure proves its own installed capability
    // even when temporary busyness hides that capability from general arrivals.
    const capabilities = new Set(getCurrentCapabilities(state, context));
    for (const id of kind === "endoscopy" ? ["capability.endoscopy", "capability.periop_recovery"]
      : ["capability.ambulatory_or", "capability.staff.or_nurse", "capability.periop_recovery"]) capabilities.add(id);
    const pool = context.clinicalRelease.cases.filter(c => c.routineEligible && procedureConsultKind(c) === kind &&
      getClinicalCaseEligibilityIssue(state, c, context, capabilities) === null && compatibleConsultProfile(c, operation) !== undefined &&
      c.decisionNodes.every(n => !activeDiscussionConceptIds.has(n.primaryConceptId)));
    const selection = selectRoutineClinicalCase(state, pool, atRealMs);
    if (selection) return { operation, roomId, kind, selection, profileId: compatibleConsultProfile(selection.clinicalCase, operation)! } as const;
  }
  return null;
}

export function sourceConsultOperation(state: GameState, encounter: EncounterState): ServiceOperationState | undefined {
  return encounter.consult && state.serviceOperations.find(op => op.id === encounter.consult!.serviceOperationId &&
    op.consultEncounterId === encounter.id && op.actorKind === "encounter" && op.actorId === encounter.id);
}

export function serviceConsultBlocksPhase(state: GameState, operation: ServiceOperationState): boolean {
  const encounter = operation.consultEncounterId ? state.encounters[operation.consultEncounterId] : undefined;
  return Boolean(encounter?.consult && encounter.consult.serviceOperationId === operation.id &&
    encounter.consult.closedAtFacilityTick === null && encounter.consult.phaseIndex === operation.phaseIndex);
}

/** Repair optional cross-links from interrupted/partial snapshots on a tick. */
export function reconcileFounderConsultSources(state: GameState): void {
  for (const operation of state.serviceOperations) {
    if (!operation.consultEncounterId || state.encounters[operation.consultEncounterId]) continue;
    if (["completed", "cancelled"].includes(operation.status)) continue;
    if (operation.actorKind === "encounter" && operation.actorId === operation.consultEncounterId) {
      operation.actorKind = "visitor"; operation.actorId = operation.id;
      const family = operation.clinicVisit?.pediatricFamilyId ? state.pediatricFamilies?.[operation.clinicVisit.pediatricFamilyId] : undefined;
      if (family) {
        family.child = { kind: "service_visitor", id: operation.id };
        const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId);
        if (parent) { parent.linkedEncounterId = null; parent.linkedServiceOperationId = operation.id; }
      }
    }
    delete operation.consultEncounterId;
  }
  for (const encounter of Object.values(state.encounters)) {
    if (!encounter.consult) continue;
    const source = sourceConsultOperation(state, encounter);
    if (source && !["completed", "cancelled"].includes(source.status) && encounter.resolutionReason !== null) {
      encounter.lastSatisfactionDecayAtTick = state.facilityTick;
    }
    if (encounter.consult.closedAtFacilityTick !== null) continue;
    if (!source || source.cancelledAtFacilityTick !== null || ["completed", "cancelled"].includes(source.status)) {
      // Preserve the scored case for ordinary care attendance. An absent or
      // cancelled source must not leave a resource/attendance hold behind.
      delete encounter.consult;
      if (encounter.assignedRoomInstanceId && !state.rooms.some(room => room.id === encounter.assignedRoomInstanceId)) encounter.assignedRoomInstanceId = null;
    } else if (["app", "pediatric", "wound_ostomy"].includes(encounter.consult.kind)) {
      const roomId = source.reservedRoomInstanceIds.find(id => state.rooms.some(room => room.id === id));
      if (roomId) {
        encounter.consult.roomInstanceId = roomId;
        encounter.assignedRoomInstanceId = roomId;
        if (source.providerReservation?.kind === "employee") encounter.consult.providerEmployeeId = source.providerReservation.employeeId;
      } else if (!state.rooms.some(room => room.id === encounter.consult!.roomInstanceId)) encounter.assignedRoomInstanceId = null;
    }
  }
}

/** A second provider spot is a stand, never the operating employee's contact. */
export function founderProcedureConsultPath(state: GameState, encounter: EncounterState, context: DomainContext) {
  const source = sourceConsultOperation(state, encounter), room = state.rooms.find(room => room.id === encounter.consult?.roomInstanceId);
  const definition = room && getRoomDefinition(room.roomDefinitionId, context);
  if (!source || !room || !definition) return [];
  const occupied = waitingOccupiedPointKeys(state, encounter.id);
  occupied.delete(`${state.environment.founderLocation.x},${state.environment.founderLocation.y}`);
  const allowed = new Set([room.id, ...(source.periopBedReservation ? [source.periopBedReservation.roomInstanceId] : [])]);
  return getProcedureStaffStandingSpots(room, definition, state.doors, "provider")
    .filter(spot => !occupied.has(`${spot.anchor.x},${spot.anchor.y}`))
    .map(spot => findRouteFromDisplacedLocationToPoint(state, context, state.environment.founderLocation, spot.anchor, allowed))
    .filter(path => path.length > 0).sort((a, b) => a.length - b.length)[0] ?? [];
}

export function normalizeFounderConsult(value: unknown, facilityTick: number): FounderConsultState | undefined {
  if (value === undefined) return undefined;
  const raw = value as Record<string, unknown>;
  if (!raw || typeof raw !== "object" || Array.isArray(raw) || raw.version !== "founder-consult.v1" ||
      Object.keys(raw).some(k => !["version", "kind", "serviceOperationId", "roomInstanceId", "phaseIndex", "providerEmployeeId", "closedAtFacilityTick"].includes(k)) ||
      !["endoscopy", "operation", "app", "pediatric", "wound_ostomy"].includes(String(raw.kind)) ||
      typeof raw.serviceOperationId !== "string" || !raw.serviceOperationId || typeof raw.roomInstanceId !== "string" || !raw.roomInstanceId ||
      !Number.isSafeInteger(raw.phaseIndex) || (raw.phaseIndex as number) < 0 ||
      !(raw.providerEmployeeId === null || typeof raw.providerEmployeeId === "string") ||
      !(raw.closedAtFacilityTick === null || Number.isSafeInteger(raw.closedAtFacilityTick) && (raw.closedAtFacilityTick as number) >= 0 && (raw.closedAtFacilityTick as number) <= facilityTick)) {
    throw new Error("The saved founder consult is invalid.");
  }
  return { ...raw } as unknown as FounderConsultState;
}

/** Namespaced demand clocks use the existing validated service-clock record. */
export const founderConsultClockKey = (kind: FounderConsultState["kind"]) => `founder_consult.${kind}`;
