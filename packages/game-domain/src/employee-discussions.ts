import type { SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import type {
  CurrentEmployeeDiscussionQuestion,
  DomainContext,
  EmployeeDiscussionListItem,
  EmployeeDiscussionLists,
  EmployeeDiscussionState,
  GameState,
} from "./types";

export const EMPLOYEE_DISCUSSION_FIRST_DELAY_MINUTES = 30;
export const EMPLOYEE_DISCUSSION_INTERVAL_MINUTES = 180;

export function isEmployeeDiscussionCase(
  clinicalCase: SyntheticClinicalCase,
): boolean {
  return clinicalCase.participant?.kind === "employee_discussion";
}

export function employeeDiscussionCaseIsRuntimeSafe(
  clinicalCase: SyntheticClinicalCase,
): boolean {
  return (
    isEmployeeDiscussionCase(clinicalCase) &&
    clinicalCase.decisionNodes.length > 0 &&
    clinicalCase.decisionNodes.every(
      (node) =>
        node.resultGateAfter === null &&
        node.answerChoices.every((choice) => choice.serviceRequest === null),
    )
  );
}

export function getEmployeeDiscussions(
  state: GameState,
): Record<string, EmployeeDiscussionState> {
  return state.employeeDiscussions ?? {};
}

function toListItem(
  discussion: EmployeeDiscussionState,
): EmployeeDiscussionListItem {
  const statusLabel =
    discussion.lifecycle === "waiting_unopened"
      ? "Team discussion waiting"
      : discussion.lifecycle === "active_traveling"
        ? `Walking to ${discussion.employeeDisplayName}`
        : discussion.lifecycle === "active_action_required"
          ? "Discussion action required"
          : discussion.lifecycle === "feedback_pending"
            ? "Review discussion feedback"
            : discussion.lifecycle === "resolved_summary_available"
              ? "Discussion complete - summary available"
              : discussion.lifecycle === "cancelled"
                ? "Discussion cancelled"
                : "Discussion filed";
  return {
    discussionId: discussion.id,
    employeeId: discussion.employeeId,
    employeeDisplayName: discussion.employeeDisplayName,
    lifecycle: discussion.lifecycle,
    statusLabel,
    actionRequired:
      discussion.lifecycle === "waiting_unopened" ||
      discussion.lifecycle === "active_action_required" ||
      discussion.lifecycle === "feedback_pending" ||
      discussion.lifecycle === "resolved_summary_available",
    createdAtFacilityTick: discussion.createdAtFacilityTick,
  };
}

export function getEmployeeDiscussionLists(
  state: GameState,
): EmployeeDiscussionLists {
  const discussions = Object.values(getEmployeeDiscussions(state));
  const byCreated = (
    left: EmployeeDiscussionState,
    right: EmployeeDiscussionState,
  ) =>
    left.createdAtFacilityTick - right.createdAtFacilityTick ||
    left.id.localeCompare(right.id);
  const byResolved = (
    left: EmployeeDiscussionState,
    right: EmployeeDiscussionState,
  ) =>
    (right.resolvedAtFacilityTick ?? -1) -
      (left.resolvedAtFacilityTick ?? -1) ||
    right.createdAtFacilityTick - left.createdAtFacilityTick ||
    left.id.localeCompare(right.id);
  return {
    waiting: discussions
      .filter((discussion) => discussion.lifecycle === "waiting_unopened")
      .sort(byCreated)
      .map(toListItem),
    active: discussions
      .filter((discussion) =>
        [
          "active_traveling",
          "active_action_required",
          "feedback_pending",
          "resolved_summary_available",
        ].includes(discussion.lifecycle),
      )
      .sort(byCreated)
      .map(toListItem),
    resolved: discussions
      .filter((discussion) =>
        discussion.lifecycle === "resolved" ||
        discussion.lifecycle === "cancelled",
      )
      .sort(byResolved)
      .map(toListItem),
  };
}

export function getCurrentEmployeeDiscussionQuestion(
  state: GameState,
  discussionId: string,
  context: DomainContext,
): CurrentEmployeeDiscussionQuestion | null {
  const discussion = getEmployeeDiscussions(state)[discussionId];
  if (!discussion ||
      (discussion.lifecycle !== "active_action_required" && discussion.lifecycle !== "active_traveling")) {
    return null;
  }
  const node = discussion.frozenCase.decisionNodes[discussion.currentNodeIndex];
  if (!node) return null;
  return {
    discussionId: discussion.id,
    employeeId: discussion.employeeId,
    employeeDisplayName: discussion.employeeDisplayName,
    caseDisplayName: discussion.frozenCase.displayName,
    presentation: discussion.frozenCase.presentation,
    node,
    questionNumber: discussion.currentNodeIndex + 1,
    questionCount: discussion.frozenCase.decisionNodes.length,
    syntheticDisclaimer: context.clinicalRelease.disclaimer,
  };
}

export function getEmployeeDiscussionBasicBlockedReason(
  state: GameState,
  discussionId: string,
): string | null {
  const discussion = getEmployeeDiscussions(state)[discussionId];
  if (!discussion) return "This team discussion no longer exists.";
  if (discussion.lifecycle !== "waiting_unopened") return null;
  const employee = state.employees.find(
    (candidate) => candidate.id === discussion.employeeId,
  );
  if (!employee) return `${discussion.employeeDisplayName} is no longer available.`;
  if (employee.facilityTask) return `${employee.displayName} is busy with another clinic task.`;
  return null;
}
