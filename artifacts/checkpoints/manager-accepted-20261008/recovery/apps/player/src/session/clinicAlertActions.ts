import {
  PROTOTYPE_DOMAIN_CONTEXT,
  findCareAwareFacilityPath,
  getAvailableEmployeeHomeRoom,
  getEmergencyGlp1Status,
  getCurrentQuestion,
  getCurrentEmployeeDiscussionQuestion,
  getNextRoomUpgradeCost,
  getRoomDefinition,
  getRoomStaffCapacity,
  getRoutinePatientAvailability,
  getStaffRoleDefinition,
  getWaterCoolerApproachLocation,
  getWorkloadSnapshot,
  evaluateGuidanceTipCandidates,
  getEmployeeTrainingQuote,
  getEmployeeDiscussionBlockedReason,
  getFacilityProgressionStatus,
  hasAutoTrashCoverage,
  hasAutoWaterCoverage,
  isEmployeeAssignedToOperationalRoom,
  isRoomOperationalForFacilityWork,
  upcomingOperatingPostingIsUnderfunded,
  type GameCommand,
  type GameState,
} from "@gamify-surgery/game-domain";
import type { ClinicAlertAction } from "../ui/types";

export type ClinicAlertCommand = {
  [T in GameCommand["type"]]: Omit<Extract<GameCommand, { type: T }>, "operationId">;
}[GameCommand["type"]];

export function hasInstalledTelehealthCoverage(state: GameState): boolean {
  return state.employees.some((employee) => employee.staffRoleDefinitionId === "staff.glp1_np" &&
    isEmployeeAssignedToOperationalRoom(state, employee.id));
}

/** The existing intake cap and eligible local content gate optional advertising. */
export function canRecommendAdvertising(state: GameState): boolean {
  if (state.facilityLevel < 1 || state.advertisingLevel !== 0 || getWorkloadSnapshot(state).atRoutineCapacity) return false;
  const reason = getRoutinePatientAvailability({ ...state, paused: false }, Date.now()).reason;
  return reason === "available" || reason === "arrival_scheduled";
}

function quotedCostProblem(state: GameState, actual: number, expected?: number): string | null {
  if (expected !== undefined && expected !== actual) return "The price changed. Use the updated button.";
  return state.cash < actual ? "There is not enough cash for this purchase." : null;
}

function founderProblem(state: GameState): string | null {
  if (state.openChartEncounterId && getCurrentQuestion(state, state.openChartEncounterId) ||
    state.openEmployeeDiscussionId && getCurrentEmployeeDiscussionQuestion(state, state.openEmployeeDiscussionId, PROTOTYPE_DOMAIN_CONTEXT)) return "Finish the open patient or team question before sending the founder away.";
  const activity = state.environment.founderActivity;
  if (state.environment.pendingFounderConsult || (activity &&
    !["walk_to_point", "return_to_front_desk", "wander_facility", "sit_in_chair", "visit_bathroom"].includes(activity.kind))) {
    return "The founder is already doing required work. Finish that first.";
  }
  if (state.serviceOperations.some((operation) => operation.status !== "completed" && operation.status !== "cancelled" &&
    operation.providerReservation?.kind === "founder")) return "The founder is reserved for a patient service.";
  if (Object.values(state.encounters).some((encounter) => encounter.pendingResult?.deliveredAtTick === null && encounter.pendingResult.providerReservation?.kind === "founder")) return "The founder is reserved for a patient service.";
  return null;
}

/** UI admission/quotes are advisory; every click repeats them before the reducer. */
export function getClinicAlertActionProblem(state: GameState, action: ClinicAlertAction): string | null {
  if (action.tip) {
    const candidate = evaluateGuidanceTipCandidates(state).find((item) => item.id === action.tip!.id && item.targetKey === action.tip!.targetKey);
    if (!candidate?.action || Object.entries(candidate.action).some(([key, value]) => (action as unknown as Record<string, unknown>)[key] !== value)) {
      return "This tip no longer applies. The clinic has changed.";
    }
  }
  switch (action.kind) {
    case "show_goals": return null;
    case "level_up": return getFacilityProgressionStatus(state).eligible ? null : "The next level's requirements are not yet met.";
    case "enable_appointments": return state.serviceAppointmentsEnabled ? "Scheduled appointments are already enabled." : null;
    case "open_discussion": return getEmployeeDiscussionBlockedReason(state, action.discussionId) ??
      (!["waiting_unopened", "active_action_required"].includes(state.employeeDiscussions?.[action.discussionId]?.lifecycle ?? "") ? "That team discussion has ended." : null);
    case "train_employee": {
      const quote = getEmployeeTrainingQuote(state, action.employeeId);
      return !quote.canTrain ? quote.blockedReason : quote.cost !== action.expectedCost ? "The training price changed. Use the updated button." : null;
    }
    case "raise_salary": {
      const employee = state.employees.find((item) => item.id === action.employeeId);
      const role = employee ? getStaffRoleDefinition(employee.staffRoleDefinitionId) : null;
      if (!employee || !role) return "That employee has left the clinic.";
      if (employee.salaryPerExpenseInterval !== action.fromSalary || action.salary !== Math.min(role.maximumSalaryPerExpenseInterval, action.fromSalary + role.salaryAdjustmentStep)) return "The salary changed. Use the updated button.";
      return upcomingOperatingPostingIsUnderfunded({ ...state, employees: state.employees.map((item) => item.id === employee.id ? { ...item, salaryPerExpenseInterval: action.salary } : item) }, PROTOTYPE_DOMAIN_CONTEXT) ? "Fund the next payroll before raising salary." : null;
    }
    case "praise_employee": {
      const employee = state.employees.find((item) => item.id === action.employeeId);
      if (!employee || employee.training || employee.facilityTask) return "That employee is unavailable for praise.";
      return founderProblem(state);
    }
    case "save_and_pause": return null;
    case "open_chart": {
      const encounter = state.encounters[action.encounterId];
      return !encounter || encounter.lifecycle === "resolved" || encounter.resolutionReason !== null
        ? "That visit has ended." : encounter.checkInStatus !== "checked_in" ? "The patient has not checked in yet." : null;
    }
    case "hire_staff": {
      const role = getStaffRoleDefinition(action.roleId);
      if (!role || role.unlockFacilityLevel > state.facilityLevel) return "That role is not unlocked.";
      if (action.requiresMissingCoverage && state.employees.some((employee) => employee.staffRoleDefinitionId === action.roleId && isEmployeeAssignedToOperationalRoom(state, employee.id))) return "This role already has installed coverage.";
      const home = getAvailableEmployeeHomeRoom(state, action.roleId);
      if (!home || !isRoomOperationalForFacilityWork(state, home.id) ||
        state.employees.filter((employee) => employee.staffRoleDefinitionId === action.roleId).length >= getRoomStaffCapacity(state, action.roleId).capacity) {
        return "This role needs an operational room with a free staff place.";
      }
      return quotedCostProblem(state, role.hiringCost, action.expectedCost);
    }
    case "upgrade_room": {
      const cost = getNextRoomUpgradeCost(state, action.roomId);
      if (cost === null) return "That room has no next upgrade.";
      if (!isRoomOperationalForFacilityWork(state, action.roomId)) return "Restore this room's access or maintenance first.";
      const quoteProblem = quotedCostProblem(state, cost, action.expectedCost);
      if (quoteProblem) return quoteProblem;
      return state.cash - cost < PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1.lowCashAlertThreshold || upcomingOperatingPostingIsUnderfunded(state, PROTOTYPE_DOMAIN_CONTEXT)
        ? "Keep the operating cash buffer funded before an optional upgrade." : null;
    }
    case "place_room": {
      const room = getRoomDefinition(action.definitionId);
      if (!room?.buildable || room.unlockFacilityLevel > state.facilityLevel) return "That room is not available to build.";
      if (room.maximumInstances !== null && state.rooms.filter((candidate) => candidate.roomDefinitionId === room.id).length >= room.maximumInstances) return "The clinic already has the maximum number of this room.";
      if (room.requiredRoomDefinitionIds.some((id) => !state.rooms.some((candidate) => candidate.roomDefinitionId === id))) return "Build this room's required supporting rooms first.";
      return quotedCostProblem(state, room.constructionCost, action.expectedCost);
    }
    case "restore_access": {
      const room = state.rooms.find((candidate) => candidate.id === action.roomId);
      if (!room) return "That room no longer exists.";
      if (isRoomOperationalForFacilityWork(state, room.id)) return "This room is already operational.";
      if (room.maintenance?.status === "out_of_service") return "This room needs repair coverage, rather than a new door.";
      return null;
    }
    case "set_advertising": {
      if (action.fromLevel !== undefined && state.advertisingLevel !== action.fromLevel) return "Advertising changed. Use the updated button.";
      if (Math.abs(state.advertisingLevel - action.level) !== 1 ||
        !PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.advertising.levels.some((level) => level.level === action.level)) return "That advertising step is no longer available.";
      if (action.level > state.advertisingLevel && (!canRecommendAdvertising(state) || state.cash < PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1.lowCashAlertThreshold ||
        upcomingOperatingPostingIsUnderfunded({ ...state, advertisingLevel: action.level }, PROTOTYPE_DOMAIN_CONTEXT))) return "Advertising needs spare capacity, eligible arrivals and funded operating costs.";
      return null;
    }
    case "emergency_consult": {
      if (hasInstalledTelehealthCoverage(state)) return "Installed NP coverage handles telehealth income.";
      const status = getEmergencyGlp1Status(state);
      return status.eligible ? null : "An emergency consultation is not currently eligible.";
    }
    case "refill_water": {
      if (state.environment.waterCoolerFillPercent > PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.waterCoolerLowThreshold) return "The cooler no longer needs a refill.";
      if (hasAutoWaterCoverage(state)) return "Receptionist coverage is handling the cooler.";
      const busy = founderProblem(state);
      if (busy) return busy;
      const point = getWaterCoolerApproachLocation(state);
      return point && findCareAwareFacilityPath(state, PROTOTYPE_DOMAIN_CONTEXT, state.environment.founderLocation, point).length > 0 ? null : "The founder cannot reach the cooler.";
    }
    case "collect_litter": {
      const litter = state.environment.litterItems.find((item) => item.id === action.litterId);
      if (!litter) return "That litter has already been collected.";
      if (hasAutoTrashCoverage(state, litter.id)) return "EVS coverage is handling this litter.";
      const busy = founderProblem(state);
      if (busy) return busy;
      // COLLECT_LITTER first relocates inaccessible legacy litter, then checks
      // the legal route. Do not preempt that save-compatible reconciliation.
      return null;
    }
  }
}

/** Navigation intents stay in the shell; physical/economic fixes use commands. */
export function clinicAlertCommand(action: ClinicAlertAction, employeeId: string): ClinicAlertCommand | null {
  switch (action.kind) {
    case "open_chart": return { type: "OPEN_CHART", encounterId: action.encounterId };
    case "collect_litter": return { type: "COLLECT_LITTER", litterId: action.litterId };
    case "refill_water": return { type: "REFILL_WATER_COOLER" };
    case "hire_staff": return { type: "HIRE_STAFF", employeeId, staffRoleDefinitionId: action.roleId };
    case "upgrade_room": return { type: "UPGRADE_ROOM", roomId: action.roomId };
    case "set_advertising": return { type: "SET_ADVERTISING_LEVEL", level: action.level };
    case "emergency_consult": return { type: "RUN_EMERGENCY_GLP1_CONSULTATION" };
    case "raise_salary": return { type: "SET_EMPLOYEE_SALARY", employeeId: action.employeeId, salaryPerExpenseInterval: action.salary };
    case "praise_employee": return { type: "PRAISE_EMPLOYEE", employeeId: action.employeeId };
    case "enable_appointments": return { type: "SET_SERVICE_APPOINTMENTS_ENABLED", enabled: true };
    case "level_up": return { type: "LEVEL_UP" };
    case "open_discussion": return { type: "OPEN_EMPLOYEE_DISCUSSION", discussionId: action.discussionId };
    default: return null;
  }
}
