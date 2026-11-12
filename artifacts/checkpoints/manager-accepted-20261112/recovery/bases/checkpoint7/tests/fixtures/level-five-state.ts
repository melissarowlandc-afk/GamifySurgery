import { PROTOTYPE_BALANCE_RELEASE, prototypeBalanceReleaseSchema } from "@gamify-surgery/balance-config";
import {
  PROTOTYPE_DOMAIN_CONTEXT, createInspectionAccumulators, createLevelFiveState, gameReducer,
  getDisplayedClinicSatisfaction, getRoomStaffCapacity, INSPECTION_CATEGORY_WEIGHTS,
  validateDomainContext, type DomainContext, type ExecutiveEffectQuote, type GameCommand,
  type GameState, type InspectionReportState, type InspectionRunState, type InspectorStillId,
} from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaState } from "./level-four-rooms";
import { placeLevelFiveRoomsQaRooms } from "./level-five-rooms";
import { prepareLevelFiveExecutiveQaState, LEVEL_FIVE_EXECUTIVE_QA_PREFIX } from "./level-five-executive";
import { prepareLevelFiveSupportQaState, LEVEL_FIVE_SUPPORT_QA_CAMPAIGN_ID } from "./level-five-support";
import { prepareLevelFiveGiftQaState, LEVEL_FIVE_GIFT_QA_PREFIX } from "./level-five-gift-retail";
import { createLevelFourReadyForFiveQaState, prepareLevelFiveProgressionQaState,
  LEVEL_FIVE_PROGRESSION_QA_PREFIX, LEVEL_FIVE_PROGRESSION_QA_SCENARIOS, type LevelFiveProgressionQaScenario } from "./level-five-progression";
import { createLevelFiveInspectionQaState, LEVEL_FIVE_INSPECTION_QA_PREFIX, LEVEL_FIVE_INSPECTION_QA_SCENARIOS, type LevelFiveInspectionQaScenario } from "./level-five-inspection";
import { createLevelFiveInspectorsQaState, LEVEL_FIVE_INSPECTORS_QA_PREFIX, LEVEL_FIVE_INSPECTORS_QA_SCENARIOS, type LevelFiveInspectorsQaScenario } from "./level-five-inspectors";
import { createLevelFiveReportQaState, LEVEL_FIVE_REPORT_QA_PREFIX, LEVEL_FIVE_REPORT_QA_SCENARIOS, type LevelFiveReportQaScenario } from "./level-five-report-card";
import { createLevelFiveEconomyQaState, LEVEL_FIVE_ECONOMY_QA_SCENARIOS, type LevelFiveEconomyQaScenario } from "./level-five-economy-qa";
import { LEVEL_FIVE_ECONOMY_QA_PREFIX } from "./level-five-economy";
import { createLevelFiveIntegrationQaState, LEVEL_FIVE_INTEGRATION_QA_SCENARIOS, LEVEL_FIVE_INTEGRATION_QA_PREFIX,
  type LevelFiveIntegrationQaScenario } from "./level-five-integration-qa";

/** Synthetic state-contract previews, not earned gameplay, clinical approval or live rooms. */
export const LEVEL_FIVE_QA_SCENARIOS = [
  "pre-goal", "eligible", "management", "management-completed", "preparing", "running",
  "actors", "report", "finish", "finish-acknowledged", "incomplete", "cancelled",
  "rooms", "support", "executive", "executive-look2", "executive-hire", "executive-visits",
  "gift", "gift-queue", "gift-suppliers",
  ...LEVEL_FIVE_PROGRESSION_QA_SCENARIOS,
  ...LEVEL_FIVE_INSPECTION_QA_SCENARIOS,
  ...LEVEL_FIVE_INSPECTORS_QA_SCENARIOS,
  ...LEVEL_FIVE_REPORT_QA_SCENARIOS,
  ...LEVEL_FIVE_ECONOMY_QA_SCENARIOS,
  ...LEVEL_FIVE_INTEGRATION_QA_SCENARIOS,
] as const;
export type LevelFiveQaScenario = typeof LEVEL_FIVE_QA_SCENARIOS[number];
export const LEVEL_FIVE_STATE_QA_CAMPAIGN_PREFIX = "campaign.qa.level-five-state-m1";

export function levelFiveQaScenario(value: string): LevelFiveQaScenario {
  if (value === "") return "pre-goal";
  if (!LEVEL_FIVE_QA_SCENARIOS.includes(value as LevelFiveQaScenario)) throw new Error(`Unknown Level 5 QA scenario: ${value}`);
  return value as LevelFiveQaScenario;
}
export const levelFiveQaCampaignId = (scenario: LevelFiveQaScenario, founderTier = 1) => scenario.startsWith("integration-") ? `${LEVEL_FIVE_INTEGRATION_QA_PREFIX}.${scenario}` : scenario.startsWith("economy") ? `${LEVEL_FIVE_ECONOMY_QA_PREFIX}.${scenario}` : scenario === "rooms"
  ? `campaign.qa.level-five-rooms-m2.tier${founderTier}` : LEVEL_FIVE_REPORT_QA_SCENARIOS.includes(scenario as LevelFiveReportQaScenario) ? `${LEVEL_FIVE_REPORT_QA_PREFIX}.${scenario}` : scenario.startsWith("inspectors") ? `${LEVEL_FIVE_INSPECTORS_QA_PREFIX}.${scenario}` : scenario.startsWith("inspection-") ? `${LEVEL_FIVE_INSPECTION_QA_PREFIX}.${scenario}` : scenario === "support" ? LEVEL_FIVE_SUPPORT_QA_CAMPAIGN_ID : scenario.startsWith("gift") ? `${LEVEL_FIVE_GIFT_QA_PREFIX}.${scenario}` : scenario.startsWith("executive") ? `${LEVEL_FIVE_EXECUTIVE_QA_PREFIX}.${scenario}` : LEVEL_FIVE_PROGRESSION_QA_SCENARIOS.includes(scenario as LevelFiveProgressionQaScenario) ? `${LEVEL_FIVE_PROGRESSION_QA_PREFIX}.${scenario}` : `${LEVEL_FIVE_STATE_QA_CAMPAIGN_PREFIX}.${scenario}`;

/** Disposable clone of the shipped release; QA changes campaign state only. */
export function createLevelFiveStateQaContext(): DomainContext {
  const balance = structuredClone(PROTOTYPE_BALANCE_RELEASE);
  return validateDomainContext({ ...PROTOTYPE_DOMAIN_CONTEXT, balanceRelease: prototypeBalanceReleaseSchema.parse(balance) });
}

function apply(state: GameState, command: GameCommand, context: DomainContext): GameState {
  const result = gameReducer(state, command, context);
  const receipt = result.operationReceipts[command.operationId];
  if (receipt?.status !== "applied") throw new Error(`Level 5 fixture ${command.operationId}: ${receipt?.message}`);
  return result;
}

function partialClinic(context: DomainContext): GameState {
  let state = createLevelFourRoomsQaState(context);
  state.facilityLevel = 5;
  for (const x of [42, 43]) state = apply(state, { type: "PLACE_ROOM", operationId: `level5.hall.${x}`,
    roomId: `room.level5.hall.${x}`, roomDefinitionId: "room.hallway", x, y: 26, orientation: 0 }, context);
  for (const [id, definition, x, y, offset] of [
    ["exam", "room.examination", 23, 24, 2], ["waiting", "room.waiting", 38, 23, 2], ["bathroom", "room.bathroom", 42, 24, 0],
  ] as const) {
    state = apply(state, { type: "PLACE_ROOM", operationId: `level5.place.${id}`, roomId: `room.level5.${id}`,
      roomDefinitionId: definition, x, y, orientation: 0 }, context);
    state = apply(state, { type: "PLACE_DOOR", operationId: `level5.door.${id}`, doorId: `door.level5.${id}`,
      roomId: `room.level5.${id}`, side: "south", offset }, context);
  }
  const role = context.balanceRelease.facility.staffRoleDefinitions.find(role => role.id === "staff.receptionist")!;
  state = apply(state, { type: "HIRE_STAFF", operationId: "level5.hire.reception", employeeId: "employee.level5.reception",
    staffRoleDefinitionId: role.id }, context);
  state = apply(state, { type: "SET_EMPLOYEE_SALARY", operationId: "level5.salary.reception", employeeId: "employee.level5.reception",
    salaryPerExpenseInterval: role.salaryPerExpenseInterval + Math.ceil((85 - role.baseMorale) / role.moralePerSalaryStep) * role.salaryAdjustmentStep }, context);
  state.levelFive = createLevelFiveState();
  return state;
}

function inspectionRun(state: GameState, context: DomainContext): InspectionRunState {
  const definitions = context.balanceRelease.facility.roomDefinitions.filter(room => room.buildable && room.unlockFacilityLevel <= 5);
  // A canonical missing-room denominator, not rooms inserted into the campaign.
  const capacityShape = { ...state, rooms: definitions.map((room, index) => ({
    id: `room.denominator.${index}`, roomDefinitionId: room.id, x: 0, y: 0,
    orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const,
  })) };
  const baselineStaffPositions = context.balanceRelease.facility.staffRoleDefinitions.flatMap(role => {
    const capacity = getRoomStaffCapacity(capacityShape, role.id);
    return Object.entries(capacity.slotsByRoomInstanceId).flatMap(([roomId, count]) => {
      const room = capacityShape.rooms.find(room => room.id === roomId)!;
      return Array.from({ length: count }, (_, index) => ({ id: `position.${room.roomDefinitionId}.${role.id}.${index + 1}`,
        roomDefinitionId: room.roomDefinitionId, staffRoleDefinitionId: role.id }));
    });
  });
  const accumulators = createInspectionAccumulators();
  accumulators.observedActiveMinutes = 10;
  accumulators.observedRoomMinutes = state.rooms.length * 10;
  accumulators.cleanRoomMinutes = accumulators.observedRoomMinutes;
  accumulators.cleanlinessSum = accumulators.observedRoomMinutes * 100;
  accumulators.minimumCleanliness = 100;
  accumulators.staffMoraleMeanSum = 850;
  return {
    version: "facility-inspection-run.v1", id: "inspection.qa.level5.first", ruleVersion: "inspection-rules.v1",
    balanceReleaseId: state.balanceReleaseId, clinicalReleaseId: state.clinicalReleaseId,
    startedAtFacilityTick: 160, durationMinutes: 3000, endsAtFacilityTick: 3160, lastObservedAtFacilityTick: 170,
    requiredRoomDefinitionIds: definitions.map(room => room.id),
    upgradeableRooms: definitions.filter(room => room.maximumUpgradeLevel > 1).map(room => ({ roomDefinitionId: room.id, maximumLevel: room.maximumUpgradeLevel as 2 | 3 | 4 | 5 })),
    baselineStaffPositions, accumulators,
  };
}

function syntheticReport(state: GameState, outcome: "completed" | "incomplete", lowScore: boolean): InspectionReportState {
  const scores = lowScore ? Array<number>(10).fill(12) : [90, 80, 75, 85, 70, 90, 95, 80, 90, 90];
  const categories = Object.entries(INSPECTION_CATEGORY_WEIGHTS).map(([id, weightPercent], index) => ({
    id: id as keyof typeof INSPECTION_CATEGORY_WEIGHTS, weightPercent, score: scores[index]!, weightedPoints: scores[index]! * weightPercent / 100,
    formula: "Synthetic M1 fixture category fraction x 100; not measured gameplay evidence.",
    rawValues: { numerator: scores[index]!, denominator: 100 }, missingItems: [],
    improvementHint: "Synthetic report metadata for load/reload QA; use the inspection-report-card scenario for reducer-earned evidence.",
  }));
  return {
    version: "facility-inspection-report.v1", runId: "inspection.qa.level5.first", ruleVersion: "inspection-rules.v1",
    balanceReleaseId: state.balanceReleaseId, clinicalReleaseId: state.clinicalReleaseId,
    startedAtFacilityTick: 160, endedAtFacilityTick: 3160, outcome, observedActiveMinutes: 3000,
    requiredActiveMinutes: 3000, qualifyingScoredPatientCount: outcome === "completed" ? 20 : 19, minimumQualifyingScoredPatients: 20,
    categories, rawTotalScore: outcome === "completed" ? (lowScore ? 12 : 85) : null,
    recognition: outcome === "completed" ? (lowScore ? "improving" : "prestige") : null,
  };
}

export function createLevelFiveStateQaState(scenario: LevelFiveQaScenario = "pre-goal", context = createLevelFiveStateQaContext()): GameState {
  if (scenario.startsWith("integration-")) return createLevelFiveIntegrationQaState(scenario as LevelFiveIntegrationQaScenario, context);
  if (LEVEL_FIVE_ECONOMY_QA_SCENARIOS.includes(scenario as LevelFiveEconomyQaScenario)) return createLevelFiveEconomyQaState(scenario as LevelFiveEconomyQaScenario, context);
  if (LEVEL_FIVE_REPORT_QA_SCENARIOS.includes(scenario as LevelFiveReportQaScenario)) return createLevelFiveReportQaState(scenario as LevelFiveReportQaScenario, context);
  if (scenario.startsWith("inspectors")) return createLevelFiveInspectorsQaState(scenario as LevelFiveInspectorsQaScenario, context);
  if (scenario.startsWith("inspection-")) return createLevelFiveInspectionQaState(scenario as LevelFiveInspectionQaScenario, context);
  if (scenario === "l4-ready") return createLevelFourReadyForFiveQaState(context);
  let state = partialClinic(context);
  state.campaignId = levelFiveQaCampaignId(scenario);
  state.campaignSeed = `level-five-state-m1.${scenario}`;
  state.facilityTick = 100;
  state.clinicalXp = scenario === "pre-goal" || scenario === "rooms" || scenario === "support" || scenario.startsWith("executive") || scenario.startsWith("gift") ? 1999 : 2000;
  const foundation = state.levelFive!;
  if (scenario !== "pre-goal" && scenario !== "rooms" && scenario !== "support" && !scenario.startsWith("executive") && !scenario.startsWith("gift") && !scenario.startsWith("goals")) {
    foundation.progress.inspectionUnlocked = { version: "level-five-inspection-unlock.v1", earnedAtFacilityTick: 100,
      clinicalXp: 2000, displayedSatisfaction: getDisplayedClinicSatisfaction(state, context),
      averageStaffMorale: state.employees.reduce((total, employee) => total + employee.morale, 0) / state.employees.length,
      employedStaffCount: state.employees.length };
    foundation.inspection.status = "ready";
  }
  if (scenario === "management" || scenario === "management-completed") {
    const completed = scenario === "management-completed";
    const effects: ExecutiveEffectQuote = { version: "executive-effect-quote.v1", staffMoralePoints: 1.25,
      visitorSatisfactionPoints: 1.25, inspectionPreparationReductionPercent: 6.25, supplierReductionPercent: 1.25 };
    // Future employee/home IDs are frozen schema examples only: no fake paid hire/room/task.
    state.facilityTick = completed ? 632 : 612;
    foundation.management.round = { version: "daily-management-round.v1", id: "round.qa.level5.day2", dayNumber: 2,
      employeeId: "employee.qa.level5.future-executive", officeRoomInstanceId: "room.qa.level5.future-executive-office",
      status: completed ? "completed" : "working", acceptedAtFacilityTick: 602, employeeTrainingLevel: 2,
      officeUpgradeLevel: 1, rawDurationMinutes: 30, durationMinutes: 30, remainingWorkMinutes: completed ? 0 : 20,
      lastProgressAtFacilityTick: state.facilityTick, completedAtFacilityTick: completed ? 632 : null,
      effectsAppliedAtFacilityTick: completed ? 632 : null, reservedContactId: completed ? null : "contact.executive.desk", effects };
    if (completed) {
      foundation.management.lastCompletedDayNumber = 2;
      foundation.management.activeTerms = { version: "daily-management-terms.v1", roundId: "round.qa.level5.day2", dayNumber: 2,
        employeeId: foundation.management.round.employeeId, officeRoomInstanceId: foundation.management.round.officeRoomInstanceId,
        employeeTrainingLevel: 2, completedAtFacilityTick: 632, expiresAtFacilityTick: 1200, effects: structuredClone(effects) };
    }
  }
  if (scenario === "preparing") {
    foundation.inspection.status = "preparing";
    foundation.inspection.preparation = { version: "inspection-preparation.v1", runId: "inspection.qa.level5.first",
      bookedAtFacilityTick: 100, rawDurationMinutes: 60, durationMinutes: 60, endsAtFacilityTick: 160, executiveQuote: null };
    state.facilityTick = 120;
  }
  if (scenario === "running" || scenario === "actors") {
    state.facilityTick = 170;
    foundation.inspection.status = "running";
    foundation.inspection.run = inspectionRun(state, context);
    if (scenario === "actors") {
      foundation.inspectionPresentation = { version: "inspection-presentation.v1", runId: foundation.inspection.run.id,
        seed: "inspection.qa.level5.presentation", actors: Array.from({ length: 10 }, (_, index) => ({
          id: `inspector.qa.level5.${index + 1}`, stillId: `inspector-v6f.${String(index + 1).padStart(3, "0")}` as InspectorStillId,
          phase: "stationary", location: { x: 25 + index, y: 26 }, path: [], pathIndex: 0,
          lastMovedAtFacilityTick: 170, targetRoomInstanceId: null, observingUntilFacilityTick: 175 + index,
        })) };
    }
  }
  if (["report", "finish", "finish-acknowledged", "incomplete"].includes(scenario)) {
    state.facilityTick = 3160;
    const report = syntheticReport(state, scenario === "incomplete" ? "incomplete" : "completed", scenario !== "report");
    foundation.inspection.status = report.outcome;
    foundation.inspection.lastReport = report;
    if (report.outcome === "completed") {
      foundation.inspection.latestCompletedReport = structuredClone(report);
      foundation.inspection.bestCompletedReport = structuredClone(report);
      foundation.progress.gameFinished = { version: "level-five-game-finished.v1", firstCompletedInspectionRunId: report.runId,
        finishedAtFacilityTick: 3160, completionNoticeId: "event.qa.level5.game-finished", firstCompletedReport: structuredClone(report) };
      if (scenario !== "finish") foundation.progress.finishPageAcknowledgedAtFacilityTick = 3160;
    }
  }
  if (scenario === "cancelled") foundation.inspection.status = "cancelled";
  if (scenario === "rooms") state = placeLevelFiveRoomsQaRooms(state, context);
  if (scenario === "support") state = prepareLevelFiveSupportQaState(state, context);
  if (scenario === "gift" || scenario === "gift-queue" || scenario === "gift-suppliers") state = prepareLevelFiveGiftQaState(state, context, scenario);
  if (scenario === "executive" || scenario === "executive-look2" || scenario === "executive-hire" || scenario === "executive-visits") state = prepareLevelFiveExecutiveQaState(state, context, scenario);
  if (scenario.startsWith("goals")) state = prepareLevelFiveProgressionQaState(state, context, scenario as LevelFiveProgressionQaScenario);
  state.nextFinancialPostingTick = Math.floor(state.facilityTick / context.balanceRelease.economy.postingIntervalMinutes + 1) * context.balanceRelease.economy.postingIntervalMinutes;
  state.paused = true;
  return state;
}
