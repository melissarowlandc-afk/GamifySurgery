import { getServiceIncomeLine, getEmployeeTrainingPercent } from "@gamify-surgery/balance-config";
import { PROTOTYPE_DOMAIN_CONTEXT } from "./context";
import { getAppAppointmentTrainingFee } from "./employee-training-effects";
import { getRoomDefinition, isEmployeeAssignedToOperationalRoom, isRoomOperationalForFacilityWork } from "./selectors";
import { getOccupiedTiles } from "./spatial";
import type { DomainContext, EmployeeState, GameState, ServiceOperationState } from "./types";

export const APP_APPOINTMENT_INCOME_LINE_ID = "income.app_consult";
export const PEDIATRIC_APPOINTMENT_INCOME_LINE_ID = "income.pediatric_consult";
export const WOUND_OSTOMY_APPOINTMENT_INCOME_LINE_IDS = ["income.wound_care", "income.ostomy_support"];
const clinicKindByIncome = {
  [APP_APPOINTMENT_INCOME_LINE_ID]: "adult_appointment", [PEDIATRIC_APPOINTMENT_INCOME_LINE_ID]: "pediatric_consult",
  "income.wound_care": "wound_care", "income.ostomy_support": "ostomy_support",
} as const;
export const APP_APPOINTMENT_INCOME_LINE_IDS = Object.keys(clinicKindByIncome);

export function appAppointmentKind(lineId: string) {
  return Object.entries(clinicKindByIncome).find(([id]) => id === lineId)?.[1];
}

export function appAppointmentRoomDefinitionId(lineId: string): string {
  if (WOUND_OSTOMY_APPOINTMENT_INCOME_LINE_IDS.includes(lineId)) return "room.wound_ostomy";
  return lineId === PEDIATRIC_APPOINTMENT_INCOME_LINE_ID ? "room.pediatric_examination" : "room.examination";
}

export function isAppAppointment(operation: ServiceOperationState): boolean {
  return Boolean(operation.clinicVisit && operation.clinicVisit.kind === appAppointmentKind(operation.incomeLineId));
}

/** The owner left the procedure row inert; routine care/support are active. */
export function pendingAppClinicService(lineId: string): string | null {
  if (lineId === "income.wound_procedure") return "Wound procedures are deferred";
  return null;
}

/** One demand stream per service at each durable, operational clinic home post.
 * Breaks, training and other work pause dispatch, not installed demand.
 */
export function getAppAppointmentHomes(state: GameState, context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT, lineId = APP_APPOINTMENT_INCOME_LINE_ID): string[] {
  if (state.facilityLevel < 4) return [];
  return state.rooms.filter(room => room.roomDefinitionId === appAppointmentRoomDefinitionId(lineId) &&
    isRoomOperationalForFacilityWork(state, room.id, context) && state.employees.some(employee =>
      employee.staffRoleDefinitionId === "staff.app" && employee.homeRoomInstanceId === room.id &&
      isEmployeeAssignedToOperationalRoom(state, employee.id, context)))
    .map(room => room.id).sort();
}

export function getAppStandbyLabel(state: GameState, employee: EmployeeState): string {
  const home = state.rooms.find(room => room.id === employee.homeRoomInstanceId);
  if (home?.roomDefinitionId === "room.pediatric_examination") return "Ready for pediatric appointments";
  if (home?.roomDefinitionId === "room.wound_ostomy") return "Ready for wound/ostomy appointments";
  if (home?.roomDefinitionId === "room.minor_procedure") return "Ready for minor procedures";
  return "Ready for appointments in clinic";
}

/** Includes physical occupants after a care reservation is released. */
export function getScoredExaminationRoomIds(state: GameState, context: DomainContext): Set<string> {
  const rooms = state.rooms.filter(room => ["room.examination", "room.pediatric_examination"].includes(room.roomDefinitionId));
  const ids = new Set<string>();
  for (const encounter of Object.values(state.encounters)) {
    if (encounter.lifecycle !== "resolved") for (const id of [encounter.assignedRoomInstanceId,
      encounter.queuedCareRoomInstanceId, encounter.patientMovement?.destinationRoomInstanceId]) if (id) ids.add(id);
    if (!encounter.patientLocation) continue;
    for (const room of rooms) {
      const definition = getRoomDefinition(room.roomDefinitionId, context)!;
      if (getOccupiedTiles(room, definition).some(point => Math.floor(encounter.patientLocation!.x + .5) === point.x && Math.floor(encounter.patientLocation!.y + .5) === point.y)) ids.add(room.id);
    }
  }
  return ids;
}

export function scoredPatientNeedsExamRoom(state: GameState, lineId = APP_APPOINTMENT_INCOME_LINE_ID): boolean {
  if (WOUND_OSTOMY_APPOINTMENT_INCOME_LINE_IDS.includes(lineId)) return false;
  const encounter = state.openChartEncounterId ? state.encounters[state.openChartEncounterId] : undefined;
  return Boolean(encounter && Boolean(encounter.frozenCase.pediatricProfile) === (lineId === PEDIATRIC_APPOINTMENT_INCOME_LINE_ID) &&
    ["waiting_unopened", "active_action_required", "resolved_summary_available"].includes(encounter.lifecycle) &&
    !encounter.assignedRoomInstanceId && !encounter.queuedCareRoomInstanceId &&
    encounter.patientMovement?.kind !== "walking_to_care");
}

/** Freeze the actual provider's bonus at care start; reroutes never compound it. */
export function bindAppAppointmentRevenue(state: GameState, operation: ServiceOperationState): void {
  if (!isAppAppointment(operation) || operation.appAppointmentRevenue || operation.providerReservation?.kind !== "employee") return;
  const providerId = operation.providerReservation.employeeId;
  const employee = state.employees.find(row => row.id === providerId);
  if (!employee || employee.staffRoleDefinitionId !== "staff.app") return;
  const baseFee = operation.quoteFee;
  const fee = getAppAppointmentTrainingFee(baseFee, employee);
  operation.appAppointmentRevenue = { version: "app-appointment-revenue.v1", providerEmployeeId: employee.id,
    baseFee, trainingLevel: employee.trainingLevel, trainingPercent: getEmployeeTrainingPercent("staff.app", employee.trainingLevel), fee };
  operation.quoteFee = fee;
}

/** Strict optional marker. Legacy clinic visits retain their already accepted fee. */
export function normalizeAppAppointmentRevenue(value: unknown, visit: ServiceOperationState["clinicVisit"], quoteFee: unknown): ServiceOperationState["appAppointmentRevenue"] {
  if (value === undefined) return undefined;
  const invalid = (): never => { throw new Error("The saved APP appointment revenue is invalid."); };
  if (!value || typeof value !== "object" || Array.isArray(value)) return invalid();
  const raw = value as Record<string, unknown>;
  if (Object.keys(raw).some(key => !["version", "providerEmployeeId", "baseFee", "trainingLevel", "trainingPercent", "fee"].includes(key)) ||
    !Object.values(clinicKindByIncome).some(kind => kind === visit?.kind) || raw.version !== "app-appointment-revenue.v1" ||
    typeof raw.providerEmployeeId !== "string" || !raw.providerEmployeeId ||
    typeof raw.trainingLevel !== "number" || !Number.isInteger(raw.trainingLevel) || raw.trainingLevel < 1 || raw.trainingLevel > 5 ||
    typeof raw.baseFee !== "number" || !Number.isFinite(raw.baseFee) || raw.baseFee < 0 ||
    raw.trainingPercent !== getEmployeeTrainingPercent("staff.app", raw.trainingLevel as EmployeeState["trainingLevel"]) ||
    raw.fee !== Math.round(raw.baseFee * (1 + (raw.trainingPercent as number) / 100) * 100) / 100 || raw.fee !== quoteFee) return invalid();
  return { version: "app-appointment-revenue.v1", providerEmployeeId: raw.providerEmployeeId,
    baseFee: raw.baseFee, trainingLevel: raw.trainingLevel as EmployeeState["trainingLevel"], trainingPercent: raw.trainingPercent as number, fee: raw.fee as number };
}

/** Durable care evidence only; no XP, FSRS, scored encounter or retail order. */
export function recordWoundOstomyVisitCompletion(state: GameState, operation: ServiceOperationState): void {
  if ((operation.incomeLineId !== "income.wound_care" && operation.incomeLineId !== "income.ostomy_support") ||
    !isAppAppointment(operation) ||
    operation.providerReservation?.kind !== "employee" || !state.employees.some(employee =>
      employee.id === (operation.providerReservation?.kind === "employee" ? operation.providerReservation.employeeId : null) &&
      employee.staffRoleDefinitionId === "staff.app") || !operation.reservedRoomInstanceIds.some(id =>
      state.rooms.some(room => room.id === id && room.roomDefinitionId === "room.wound_ostomy"))) return;
  state.levelFourCompletion ??= { version: "level-four-completion.v1", pediatricVisitWithParent: null,
    woundOstomyCareVisit: null, acknowledgedAtFacilityTick: null };
  state.levelFourCompletion.woundOstomyCareVisit ??= { serviceOperationId: operation.id, encounterId: null,
    incomeLineId: operation.incomeLineId, completedAtFacilityTick: state.facilityTick };
}

export function appAppointmentFeeRange(state: GameState, lineId = APP_APPOINTMENT_INCOME_LINE_ID): [number, number] {
  const base = getServiceIncomeLine(lineId)!.fee;
  const fees = state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.app")
    .map(employee => getAppAppointmentTrainingFee(base, employee));
  return fees.length ? [Math.min(...fees), Math.max(...fees)] : [base, base];
}
