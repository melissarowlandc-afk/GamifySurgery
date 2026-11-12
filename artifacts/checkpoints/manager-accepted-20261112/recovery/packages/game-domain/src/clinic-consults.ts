import { FOUNDER_CONSULT_POLICY } from "@gamify-surgery/balance-config";
import { clinicCaseMatchesLine, clinicConsultKindForLine } from "./clinic-consult-topics";
import { compatibleConsultProfile, founderConsultClockKey, sourceConsultOperation } from "./founder-consults";
import { getClinicalCaseEligibilityIssue, getPediatricClinicFamilyContext } from "./clinical-case-eligibility";
import { selectRoutineClinicalCase } from "./clinical-selection";
import { getDoorCells } from "./doors";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { pathToPediatricSupport, pediatricFamilyForActor } from "./pediatric-family";
import { getCurrentCapabilities, getRoomDefinition } from "./selectors";
import { getRoomCareAnchor } from "./spatial";
import type { DomainContext, EmployeeState, EncounterState, GameState, ServiceOperationState } from "./types";

const same = (a: { x: number; y: number } | null | undefined, b: { x: number; y: number } | null | undefined) => Boolean(a && b && a.x === b.x && a.y === b.y);
export const isClinicFounderConsult = (encounter: EncounterState) => ["app", "pediatric", "wound_ostomy"].includes(encounter.consult?.kind ?? "");

/** Existing published presentations, without choosing/reserving a question. */
export function clinicConsultPresentations(state: GameState, context: DomainContext, lineId: string) {
  if (!["income.app_consult", "income.wound_care", "income.ostomy_support"].includes(lineId)) return [];
  const unique = new Map<string, { sexLabel: "Female" | "Male"; ageYears: number }>();
  for (const c of context.clinicalRelease.cases) {
    if (!clinicCaseMatchesLine(c, lineId) || c.earliestFacilityStage > state.facilityLevel) continue;
    for (const p of c.approvedInstantiationProfiles?.length ? c.approvedInstantiationProfiles : [{ prototypeDemographics: c.prototypeDemographics }]) {
      const d = p.prototypeDemographics ?? c.prototypeDemographics;
      if ((d?.sexLabel === "Female" || d?.sexLabel === "Male") && d.ageYears !== undefined && d.ageYears >= 18) unique.set(`${d.sexLabel}:${d.ageYears}`, { sexLabel: d.sexLabel, ageYears: d.ageYears });
    }
  }
  return [...unique.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([, d]) => d);
}

export function selectClinicConsult(state: GameState, context: DomainContext, atRealMs: number, activeDiscussionConceptIds: ReadonlySet<string>, specialtyOnly = false) {
  const capabilities = new Set(getCurrentCapabilities(state, context));
  const lastAssigned = (kind: NonNullable<ReturnType<typeof clinicConsultKindForLine>>) => state.lastServiceAppointmentTicks[founderConsultClockKey(kind)] ??
    Math.max(-1, ...Object.values(state.encounters).filter(e => e.consult?.kind === kind).map(e => e.waiting.arrivedAtTick));
  const candidates = state.serviceOperations.filter(op => {
    const kind = clinicConsultKindForLine(op.incomeLineId);
    return kind && (specialtyOnly ? kind !== "app" && (lastAssigned(kind) < 0 ||
      state.facilityTick - lastAssigned(kind) >= FOUNDER_CONSULT_POLICY.specialtyConsultMinimumIntervalMinutes) : kind === "app");
  }).sort((a, b) => (specialtyOnly ? lastAssigned(clinicConsultKindForLine(a.incomeLineId)!) - lastAssigned(clinicConsultKindForLine(b.incomeLineId)!) : 0) ||
    a.createdAtFacilityTick - b.createdAtFacilityTick || a.id.localeCompare(b.id));
  for (const operation of candidates) {
    if (operation.actorKind !== "visitor" || operation.consultEncounterId || operation.status !== "in_service" ||
        operation.providerReservation?.kind !== "employee") continue;
    const roomId = operation.reservedRoomInstanceIds[0];
    if (!roomId) continue;
    capabilities.add("capability.staff.app");
    const parent = operation.clinicVisit?.kind === "pediatric_consult"
      ? state.retailExternalActors.find(actor => actor.id === pediatricFamilyForActor(state, "service_visitor", operation.id)?.parentActorId) : undefined;
    const pool = context.clinicalRelease.cases.filter(c => clinicCaseMatchesLine(c, operation.incomeLineId) &&
      (!c.pediatricProfile || getPediatricClinicFamilyContext(c)?.parentName === parent?.displayName) &&
      getClinicalCaseEligibilityIssue(state, c, context, capabilities) === null && compatibleConsultProfile(c, operation) !== undefined &&
      c.decisionNodes.every(n => !activeDiscussionConceptIds.has(n.primaryConceptId)));
    const selection = selectRoutineClinicalCase(state, pool, atRealMs);
    if (selection) return { operation, roomId, kind: clinicConsultKindForLine(operation.incomeLineId)!, selection, profileId: compatibleConsultProfile(selection.clinicalCase, operation)! };
  }
  return null;
}

export function clinicFounderPath(state: GameState, encounter: EncounterState, context: DomainContext) {
  const room = state.rooms.find(room => room.id === encounter.consult?.roomInstanceId);
  const definition = room && getRoomDefinition(room.roomDefinitionId, context);
  if (!room || !definition) return [];
  return room.roomDefinitionId === "room.pediatric_examination"
    ? pathToPediatricSupport(state, context, state.environment.founderLocation, room, "stool:clinician")
    : findRouteFromDisplacedLocationToPoint(state, context, state.environment.founderLocation,
        getRoomCareAnchor(room, definition, "clinician"), new Set([room.id]));
}

/** The APP keeps ownership of this visit while temporarily vacating its stool. */
export function vacateClinicProvider(state: GameState, encounter: EncounterState, context: DomainContext): boolean {
  const source = sourceConsultOperation(state, encounter);
  const provider = state.employees.find(employee => employee.id === encounter.consult?.providerEmployeeId);
  const room = state.rooms.find(room => room.id === encounter.consult?.roomInstanceId);
  const definition = room && getRoomDefinition(room.roomDefinitionId, context);
  if (!source || !provider || !room || !definition) return false;
  const paths = state.doors.filter(door => door.roomId === room.id).flatMap(door => {
    const cells = getDoorCells(door, room, definition);
    if (!cells || state.employees.some(other => other.id !== provider.id && same(other.location, cells.outside)) ||
        same(state.environment.founderLocation, cells.outside)) return [];
    const path = findRouteFromDisplacedLocationToPoint(state, context, provider.location, cells.outside, new Set([room.id]));
    return path.length ? [path] : [];
  }).sort((a, b) => a.length - b.length);
  if (!paths.length) return false;
  provider.path = paths[0]!; provider.pathIndex = 0; provider.lastMovedAtFacilityTick = state.facilityTick;
  return true;
}

export function returnClinicProvider(state: GameState, encounter: EncounterState, context: DomainContext): void {
  const provider = state.employees.find(employee => employee.id === encounter.consult?.providerEmployeeId);
  const room = state.rooms.find(room => room.id === encounter.consult?.roomInstanceId);
  const definition = room && getRoomDefinition(room.roomDefinitionId, context);
  if (!provider || !room || !definition) return;
  const path = room.roomDefinitionId === "room.pediatric_examination"
    ? pathToPediatricSupport(state, context, provider.location, room, "stool:clinician")
    : findRouteFromDisplacedLocationToPoint(state, context, provider.location, getRoomCareAnchor(room, definition, "clinician"), new Set([room.id]));
  if (path.length) { provider.path = path; provider.pathIndex = 0; provider.lastMovedAtFacilityTick = state.facilityTick; }
}

export function releaseClinicConsult(state: GameState, encounter: EncounterState, context: DomainContext): void {
  if (!isClinicFounderConsult(encounter) || !encounter.consult || encounter.consult.closedAtFacilityTick !== null) return;
  const source = sourceConsultOperation(state, encounter);
  encounter.consult.closedAtFacilityTick = state.facilityTick;
  if (source) source.phaseEndsAtFacilityTick = Math.min(source.phaseEndsAtFacilityTick ?? state.facilityTick, state.facilityTick);
  returnClinicProvider(state, encounter, context);
}

/** No two providers may occupy the same seat during either half of the exchange. */
export function clinicEmployeeWaitsForSeat(state: GameState, employee: EmployeeState): boolean {
  const encounter = Object.values(state.encounters).find(e => isClinicFounderConsult(e) && e.consult?.providerEmployeeId === employee.id &&
    sourceConsultOperation(state, e)?.id === employee.facilityTask?.targetId);
  return Boolean(encounter && employee.pathIndex < employee.path.length - 1 && same(employee.path.at(-1), state.environment.founderLocation));
}

export function clinicFounderWaitsForSeat(state: GameState): boolean {
  const activity = state.environment.founderActivity;
  const encounter = activity?.kind === "attend_encounter" ? state.encounters[activity.targetId] : undefined;
  return Boolean(encounter && isClinicFounderConsult(encounter) && activity && activity.pathIndex < activity.path.length - 1 &&
    state.employees.some(employee => employee.id === encounter.consult?.providerEmployeeId && same(employee.location, activity.path.at(-1))));
}

/** Diagnostic feedback may close the chart implicitly. That also ends the APP consult. */
export function reconcileClinicConsultClosures(state: GameState, context: DomainContext): void {
  for (const encounter of Object.values(state.encounters)) {
    if (!isClinicFounderConsult(encounter) || encounter.consult?.closedAtFacilityTick !== null || state.openChartEncounterId === encounter.id) continue;
    if (encounter.answers.length > 0) releaseClinicConsult(state, encounter, context);
  }
}
