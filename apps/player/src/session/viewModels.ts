import {
  PROTOTYPE_DOMAIN_CONTEXT,
  getFacilityProgressionStatus,
  getCurrentQuestion,
  getLearningSummary,
  getPatientLists,
  getPendingResultEta,
  getRoomDefinition,
  getStaffRoleDefinition,
  getWorkloadSnapshot,
  type EncounterState,
  type GameState,
  type PatientListItem,
} from "@gamify-surgery/game-domain";
import type { FacilityViewModel } from "../facility";
import type {
  ChartView,
  DevelopmentView,
  PatientFolder,
  PatientTabView,
  ProgressionView,
  ResourceBarView,
  RoomBuildOptionView,
  StaffHireOptionView,
} from "../ui";

export interface PrototypePlayerView {
  resourceBar: ResourceBarView;
  patients: PatientTabView[];
  chart: ChartView | null;
  facility: FacilityViewModel;
  progression: ProgressionView;
  roomOptions: RoomBuildOptionView[];
  staffOptions: StaffHireOptionView[];
  development: DevelopmentView;
  workloadStatus: string;
}

function signedCurrency(value: number): string {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}$${Math.abs(value).toLocaleString()}`;
}

function formatLearningCardStatus(
  state: GameState,
  conceptId: string,
): string {
  const history = state.learningHistories[conceptId];
  const latestReview = history?.reviews.at(-1);
  if (!history || !latestReview) {
    return "New · no campaign review";
  }
  const interval =
    history.card.scheduledDays > 0
      ? `${history.card.scheduledDays} day${
          history.card.scheduledDays === 1 ? "" : "s"
        }`
      : "short learning step";
  const due = new Intl.DateTimeFormat(undefined, {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(history.card.dueAtMs));
  return `${latestReview.rating} · ${interval} · due ${due}`;
}

function toPatientTab(
  item: PatientListItem,
  folder: PatientFolder,
  selectedEncounterId: string | null,
): PatientTabView {
  const arrivalLabel =
    item.arrivalClass === "tutorial"
      ? "Tutorial patient"
      : item.arrivalClass === "progression_critical"
        ? "Progression patient"
        : "Routine patient";

  return {
    id: item.encounterId,
    folder,
    name: item.patientDisplayName,
    subtitle: arrivalLabel,
    statusLabel: item.statusLabel,
    actionRequired: item.actionRequired,
    selected: selectedEncounterId === item.encounterId,
    patienceLabel:
      item.patienceRemainingTicks === null
        ? undefined
        : `Patience: ${item.patienceRemainingTicks} ticks`,
  };
}

function encounterStatus(encounter: EncounterState): string {
  switch (encounter.lifecycle) {
    case "waiting_unopened":
      return "Waiting";
    case "active_action_required":
      return "Action required";
    case "active_pending_result":
      return "Result pending";
    case "resolved_summary_available":
      return "Encounter complete";
    case "resolved":
      return encounter.resolutionReason === "left_before_seen"
        ? "Left before being seen"
        : "Resolved";
  }
}

function createChartView(
  state: GameState,
  encounterId: string | null,
  summaryVisible: boolean,
): ChartView | null {
  if (encounterId === null) {
    return null;
  }
  const encounter = state.encounters[encounterId];
  if (!encounter) {
    return null;
  }

  // A patient who was never opened must not reveal the unseen question,
  // answers, explanation, outcome, or learning summary.
  if (encounter.resolutionReason === "left_before_seen") {
    return {
      id: encounter.id,
      patientName: encounter.patientDisplayName,
      patientDetails: "No encounter content was opened.",
      statusLabel: "Left before being seen",
      presentation: "Patient left before being seen.",
      answerChoices: [],
      terminalFeedbackNeedsAcknowledgment: false,
      summaryAvailable: false,
      summaryVisible: false,
      canFile: true,
      readOnly: true,
    };
  }

  const question = getCurrentQuestion(state, encounter.id);
  const pendingEta = getPendingResultEta(state, encounter.id);
  const learningSummary = getLearningSummary(state, encounter.id);
  const lastAnswer = encounter.answers.at(-1);
  const answerForQuestion = question
    ? encounter.answers.find(
        (answer) => answer.decisionNodeId === question.node.id,
      )
    : undefined;
  const resultCopy =
    encounter.deliveredResultNarratives.length === 0
      ? ""
      : ` ${encounter.deliveredResultNarratives.join(" ")}`;
  const terminalFeedback = encounter.terminalFeedback;
  const showInterimFeedback =
    encounter.lifecycle === "active_pending_result" && lastAnswer !== undefined;
  const feedbackBody = terminalFeedback
    ? (terminalFeedback.correction ?? lastAnswer?.explanation)
    : showInterimFeedback
      ? lastAnswer.explanation
      : undefined;
  const feedbackTitle =
    lastAnswer?.correct === true
      ? "Correct"
      : lastAnswer
        ? "Corrective feedback"
        : undefined;
  const terminalOutcome = terminalFeedback?.outcome ?? null;
  const terminalFeedbackNeedsAcknowledgment =
    terminalFeedback !== null && !terminalFeedback.acknowledged;
  const summaryAvailable = learningSummary !== null;
  const readOnly = encounter.lifecycle === "resolved";
  const canFile =
    readOnly ||
    (encounter.lifecycle === "resolved_summary_available" &&
      terminalFeedback?.acknowledged === true);

  return {
    id: encounter.id,
    patientName: encounter.patientDisplayName,
    patientDetails: "Synthetic tutorial patient",
    statusLabel: question
      ? `Question ${question.questionNumber} of ${question.questionCount}`
      : encounterStatus(encounter),
    presentation: `${encounter.frozenCase.presentation}${resultCopy}`,
    pendingLabel:
      encounter.lifecycle === "active_pending_result"
        ? `${encounter.pendingResult?.pendingLabel ?? "Result pending"} via ${
            encounter.pendingResult?.routeDisplayName ?? "approved route"
          }`
        : undefined,
    etaLabel:
      pendingEta === null
        ? undefined
        : `${pendingEta} facility tick${pendingEta === 1 ? "" : "s"} remaining`,
    questionPrompt: question?.node.stem,
    answerChoices:
      question?.node.answerChoices.map((choice) => ({
        id: choice.id,
        label: choice.label,
        selected: answerForQuestion?.answerChoiceId === choice.id,
        disabled:
          answerForQuestion !== undefined ||
          terminalFeedbackNeedsAcknowledgment ||
          readOnly,
      })) ?? [],
    feedbackTitle,
    feedbackBody,
    terminalOutcomeTitle: terminalOutcome
      ? "Synthetic terminal outcome"
      : undefined,
    terminalOutcomeBody: terminalOutcome?.narrative,
    terminalOutcomeSeverity: terminalOutcome?.severity,
    terminalFeedbackNeedsAcknowledgment,
    summaryAvailable,
    summaryVisible: summaryAvailable && summaryVisible,
    summaryBody: learningSummary ?? undefined,
    canFile,
    readOnly,
  };
}

export function createPrototypePlayerView(
  state: GameState,
  selectedEncounterId: string | null,
  summaryVisible: boolean,
  selectedRoomDefinitionId: string | null,
): PrototypePlayerView {
  const lists = getPatientLists(state);
  const workload = getWorkloadSnapshot(state);
  const progressionStatus = getFacilityProgressionStatus(state);
  const facilityBalance =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  const initialRoomInstanceIds = new Set(
    facilityBalance.initialRooms.map((room) => room.id),
  );
  const placedRoomDefinitionIds = new Set(
    state.rooms.map((room) => room.roomDefinitionId),
  );
  const hiredStaffRoleIds = new Set(
    state.employees.map((employee) => employee.staffRoleDefinitionId),
  );
  const lastSettlement = state.settlements.at(-1);
  const workloadStatus = workload.overRoutineCapacity
    ? "Routine workload is above its target."
    : workload.atRoutineCapacity
      ? "Routine arrivals pause until capacity is available."
      : `${workload.routineLimit - workload.occupancy} routine workload slot${
          workload.routineLimit - workload.occupancy === 1 ? "" : "s"
        } available.`;

  const patients = [
    ...lists.waiting.map((item) =>
      toPatientTab(item, "waiting", selectedEncounterId),
    ),
    ...lists.active.map((item) =>
      toPatientTab(item, "active", selectedEncounterId),
    ),
    ...lists.resolved.map((item) =>
      toPatientTab(item, "resolved", selectedEncounterId),
    ),
  ];

  return {
    resourceBar: {
      moneyLabel: `$${state.cash.toLocaleString()}`,
      moneyDeltaLabel: lastSettlement
        ? `Last case ${signedCurrency(lastSettlement.netCashDelta)}`
        : "No settlement yet",
      xpLabel: state.clinicalXp.toLocaleString(),
      satisfactionLabel: `${state.satisfaction}%`,
      facilityTimeLabel: `Hour ${state.facilityTick}`,
      workloadLabel: `${workload.occupancy}/${workload.routineLimit}`,
      workloadStatusLabel: workload.atRoutineCapacity
        ? "At routine capacity"
        : "Capacity available",
      facilityLevelLabel: `Level ${state.facilityLevel}`,
    },
    patients,
    chart: createChartView(
      state,
      selectedEncounterId,
      summaryVisible,
    ),
    facility: {
      facilityTitle: progressionStatus.displayName,
      facilityTick: state.facilityTick,
      paused: state.paused,
      gridColumns: facilityBalance.gridWidth,
      gridRows: facilityBalance.gridHeight,
      patientCounts: {
        waiting: lists.waiting.length,
        active: lists.active.length,
        actionReady: lists.active.filter((item) => item.actionRequired).length,
        resolved: lists.resolved.length,
      },
      rooms: state.rooms.flatMap((room) => {
        const definition = getRoomDefinition(room.roomDefinitionId);
        return definition
          ? [
              {
                instanceId: room.id,
                definitionId: room.roomDefinitionId,
                displayName: definition.displayName,
                tileX: room.x,
                tileY: room.y,
                width: definition.width,
                height: definition.height,
                isFounderRoom: initialRoomInstanceIds.has(room.id),
              },
            ]
          : [];
      }),
      staff: state.employees.map((employee) => {
        const role = getStaffRoleDefinition(
          employee.staffRoleDefinitionId,
        );
        const requiredHomeRoom = role?.requiredRoomDefinitionIds
          .map((requiredDefinitionId) =>
            state.rooms.find(
              (room) =>
                room.roomDefinitionId === requiredDefinitionId,
            ),
          )
          .find((room) => room !== undefined);
        return {
          instanceId: employee.id,
          displayName: employee.displayName,
          roleDisplayName:
            role?.displayName ?? employee.staffRoleDefinitionId,
          homeRoomInstanceId: requiredHomeRoom?.id ?? null,
        };
      }),
      placement: selectedRoomDefinitionId
        ? (() => {
            const definition = getRoomDefinition(
              selectedRoomDefinitionId,
            );
            return definition
              ? {
                  definitionId: definition.id,
                  displayName: definition.displayName,
                  width: definition.width,
                  height: definition.height,
                }
              : null;
          })()
        : null,
    },
    progression: {
      facilityLevelLabel: `Level ${state.facilityLevel}`,
      nextLevelLabel:
        progressionStatus.nextFacilityLevel === null
          ? null
          : `Level ${progressionStatus.nextFacilityLevel}`,
      goals: progressionStatus.requirements.map((requirement) => ({
        id: requirement.id,
        label: requirement.label,
        complete: requirement.met,
        progressLabel: `${Math.min(
          requirement.current,
          requirement.required,
        )}/${requirement.required}`,
      })),
      canLevelUp: progressionStatus.eligible,
      prototypeComplete:
        progressionStatus.nextFacilityLevel === null &&
        progressionStatus.requirements.every(
          (requirement) => requirement.met,
        ),
    },
    roomOptions: facilityBalance.roomDefinitions
      .filter(
        (definition) =>
          definition.constructionCost > 0 &&
          definition.unlockFacilityLevel <= state.facilityLevel,
      )
      .map((definition) => {
        const owned = placedRoomDefinitionIds.has(definition.id);
        const requirementsMet =
          definition.requiredRoomDefinitionIds.every((requiredId) =>
            placedRoomDefinitionIds.has(requiredId),
          );
        const affordable = state.cash >= definition.constructionCost;
        const blockedReason = owned
          ? undefined
          : !requirementsMet
            ? `Requires ${definition.requiredRoomDefinitionIds
                .filter(
                  (requiredId) =>
                    !placedRoomDefinitionIds.has(requiredId),
                )
                .map(
                  (requiredId) =>
                    getRoomDefinition(requiredId)?.displayName ??
                    requiredId,
                )
                .join(", ")}.`
            : !affordable
              ? `Need $${(
                  definition.constructionCost - state.cash
                ).toLocaleString()} more.`
              : undefined;
        return {
          id: definition.id,
          displayName: definition.displayName,
          footprintLabel: `${definition.width} × ${definition.height} tiles`,
          costLabel: `$${definition.constructionCost.toLocaleString()}`,
          upkeepLabel: `$${definition.upkeepPerExpenseInterval.toLocaleString()} upkeep / expense cycle`,
          owned,
          selected: selectedRoomDefinitionId === definition.id,
          enabled:
            !owned &&
            requirementsMet &&
            affordable,
          blockedReason,
        };
      }),
    staffOptions: facilityBalance.staffRoleDefinitions
      .filter(
        (role) => role.unlockFacilityLevel <= state.facilityLevel,
      )
      .map((role) => {
        const hired = hiredStaffRoleIds.has(role.id);
        const requirementsMet = role.requiredRoomDefinitionIds.every(
          (requiredId) => placedRoomDefinitionIds.has(requiredId),
        );
        const affordable = state.cash >= role.hiringCost;
        const blockedReason = hired
          ? undefined
          : !requirementsMet
            ? `Requires ${role.requiredRoomDefinitionIds
                .filter(
                  (requiredId) =>
                    !placedRoomDefinitionIds.has(requiredId),
                )
                .map(
                  (requiredId) =>
                    getRoomDefinition(requiredId)?.displayName ??
                    requiredId,
                )
                .join(", ")}.`
            : !affordable
              ? `Need $${(
                  role.hiringCost - state.cash
                ).toLocaleString()} more.`
              : undefined;
        return {
          id: role.id,
          displayName: role.displayName,
          costLabel: `$${role.hiringCost.toLocaleString()} hire`,
          salaryLabel: `$${role.salaryPerExpenseInterval.toLocaleString()} salary / expense cycle`,
          hired,
          enabled:
            !hired &&
            requirementsMet &&
            affordable,
          blockedReason,
        };
      }),
    development: {
      campaignIdLabel:
        state.campaignId.length > 20
          ? `${state.campaignId.slice(0, 17)}…`
          : state.campaignId,
      learningHistoryLabel: `${Object.values(
        state.learningHistories,
      ).filter((history) => history.reviews.length > 0).length} reviewed / ${
        Object.keys(state.learningHistories).length
      } available`,
      reviewCountLabel: `${state.reviewIntents.length} scored`,
      fastForwardLabel: `Fast-forward ${PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.development.fastForwardTickCount} hours`,
      learningCards:
        PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.map((concept) => ({
          conceptId: concept.id,
          conceptLabel: concept.displayName,
          statusLabel: formatLearningCardStatus(state, concept.id),
        })),
    },
    workloadStatus,
  };
}
