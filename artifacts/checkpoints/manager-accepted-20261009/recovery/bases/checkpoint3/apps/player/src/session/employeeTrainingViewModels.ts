import { EMPLOYEE_TRAINING_SESSION_MINUTES } from "@gamify-surgery/balance-config";
import {
  getEmployeeTrainingQuote,
  type DomainContext,
  type GameState,
  PROTOTYPE_DOMAIN_CONTEXT,
} from "@gamify-surgery/game-domain";
import type { EmployeeTrainingView } from "../ui/types";
import { formatFacilityDuration } from "./facilityDuration";

const ROLE_BENEFIT_PREFIXES: Readonly<Record<string, string>> = {
  "staff.receptionist": "Reduces wait penalties",
  "staff.imaging_technician": "Reduces scan time",
  "staff.periop_nurse": "Reduces prep time",
  "staff.endoscopy_nurse": "Reduces procedure time",
  "staff.endoscopist": "Reduces procedure time",
  "staff.phlebotomist": "Reduces draw time",
  "staff.evs_worker": "Improves cleaning",
  "staff.laboratory_technician": "Reduces lab work time",
  "staff.surgeon": "Reduces OR/QI time",
  "staff.or_nurse": "Reduces OR time",
  "staff.pharmacist": "Cuts supply costs",
  "staff.repair_person": "Reduces repair time",
  "staff.radiologist": "Reduces reading time",
};

const trainingMoneyFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
const trainingPercentFormatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

/** Short product copy derived from the same percentage/fee as the runtime. */
export function employeeTrainingBenefitLabel(
  roleId: string,
  percent: number,
  baseConsultPayment = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment.glp1AutomationPayment,
): string {
  if (percent === 0) return "Base performance";
  if (roleId === "staff.glp1_np") {
    const amount = baseConsultPayment * percent / 100;
    return `Adds $${trainingMoneyFormatter.format(amount)} per consult`;
  }
  const prefix = ROLE_BENEFIT_PREFIXES[roleId];
  const percentLabel = trainingPercentFormatter.format(percent);
  return prefix ? `${prefix} ${percentLabel}%` : "Base performance";
}

export function createEmployeeTrainingView(
  state: GameState,
  employeeId: string,
  context: DomainContext = PROTOTYPE_DOMAIN_CONTEXT,
): EmployeeTrainingView {
  const quote = getEmployeeTrainingQuote(state, employeeId, context);
  const employee = state.employees.find((candidate) => candidate.id === employeeId);
  const roleId = employee?.staffRoleDefinitionId ?? "";
  const session = employee?.training;
  const sessionDurationMinutes = !session || session.stage === "queued"
    ? null
    : session.roomUpgradeWork
      ? session.roomUpgradeWork.durationMinutes
      : EMPLOYEE_TRAINING_SESSION_MINUTES;
  const labels: Record<EmployeeTrainingView["status"], string> = {
    idle: `Level ${quote.currentLevel}`,
    queued: "Queued · working",
    walking: "Walking to training",
    training: `Training · ${formatFacilityDuration(quote.minutesRemaining ?? sessionDurationMinutes ?? EMPLOYEE_TRAINING_SESSION_MINUTES)} left`,
    returning: "Returning to work",
    max_level: "Level 5 · fully trained",
  };
  const benefitLabel = (percent: number) => employeeTrainingBenefitLabel(
    roleId,
    percent,
    context.balanceRelease.environment.glp1AutomationPayment,
  );
  return {
    level: quote.currentLevel,
    nextLevel: quote.targetLevel,
    cost: quote.cost,
    costLabel: quote.cost === null ? null : `$${quote.cost.toLocaleString("en-US")}`,
    canTrain: quote.canTrain,
    blockedReason: quote.blockedReason,
    status: quote.status,
    statusLabel: labels[quote.status],
    minutesRemaining: quote.minutesRemaining,
    sessionDurationMinutes,
    currentBenefitLabel: benefitLabel(quote.currentBenefit?.percent ?? 0),
    nextBenefitLabel: quote.nextBenefit ? benefitLabel(quote.nextBenefit.percent) : null,
    incrementBenefitLabel: quote.nextBenefit ? benefitLabel(quote.nextBenefit.incrementalPercent) : null,
  };
}
