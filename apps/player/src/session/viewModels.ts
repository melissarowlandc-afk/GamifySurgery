import {
  PROTOTYPE_DOMAIN_CONTEXT,
  getAnswerChoiceServicePreview,
  getFacilityProgressionStatus,
  getFacilityClock,
  getCurrentQuestion,
  getEmergencyGlp1Status,
  getEncounterSettlement,
  getLearningSummary,
  getNextRoomUpgradeCost,
  getOperatingExpensePerFacilityHour,
  getPatientLists,
  getPendingPatientLocation,
  getPendingResultEta,
  getRotatedFootprint,
  getRoomDefinition,
  getRoomInstanceFootprint,
  getRoomResaleValue,
  getStaffRoleDefinition,
  getWorkloadSnapshot,
  rotateDirection,
  type EncounterState,
  type GameState,
  type PatientListItem,
  type RoomOrientation,
} from "@gamify-surgery/game-domain";
import type { FacilityViewModel } from "../facility";
import { createMessageBoardView } from "./alertViewModels";
import type {
  ChartView,
  DevelopmentView,
  EmergencyGlp1View,
  MessageBoardItemView,
  PatientFolder,
  PatientTabView,
  ProgressionView,
  ResourceBarView,
  RoomBuildOptionView,
  SelectedRoomBuildView,
  StaffRoleGroupView,
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
  staffRoles: StaffRoleGroupView[];
  messages: MessageBoardItemView[];
  selectedRoomBuild: SelectedRoomBuildView | null;
  emergencyGlp1: EmergencyGlp1View;
  development: DevelopmentView;
  workloadStatus: string;
}

function signedCurrency(value: number): string {
  const sign = value >= 0 ? "+" : "-";
  return `${sign}$${Math.abs(value).toLocaleString()}`;
}

function signedPercent(value: number): string {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value}% satisfaction`;
}

function formatFacilityHours(value: number): string {
  return `${value} in-game hour${value === 1 ? "" : "s"}`;
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
  state: GameState,
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
        : `Patience: ${item.patienceRemainingTicks} in-game hour${
            item.patienceRemainingTicks === 1 ? "" : "s"
          }`,
    avatar: state.encounters[item.encounterId]?.patientAppearance,
    sortKey: state.encounters[item.encounterId]?.waiting.arrivedAtTick,
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

  const decisionSteps = encounter.steps
    .filter((step) => step.status !== "locked")
    .map((step) => {
      const node = encounter.frozenCase.decisionNodes[step.nodeIndex];
      if (!node) {
        return null;
      }
      const isCurrent =
        step.nodeIndex === encounter.currentNodeIndex &&
        encounter.lifecycle !== "resolved";
      const answer = step.answer;
      const result = step.result;
      const resultDelivered = result?.deliveredAtTick !== null;
      return {
        id: step.decisionNodeId,
        heading:
          step.nodeIndex === 0
            ? "Initial decision"
            : `Follow-up decision ${step.nodeIndex}`,
        statusLabel:
          step.status === "result_pending"
            ? "Patient off-site"
            : step.status === "action_required"
              ? "Action required"
              : "Complete",
        questionPrompt: node.stem,
        answerChoices: node.answerChoices.map((choice) => {
          const preview =
            isCurrent && answer === null
              ? getAnswerChoiceServicePreview(
                  state,
                  encounter.id,
                  choice.id,
                )
              : null;
          return {
            id: choice.id,
            label: choice.label,
            selected: answer?.answerChoiceId === choice.id,
            disabled:
              answer !== null ||
              !isCurrent ||
              terminalFeedbackNeedsAcknowledgment ||
              readOnly,
            etaLabel:
              preview?.durationTicks === null ||
              preview?.durationTicks === undefined
                ? undefined
                : formatFacilityHours(preview.durationTicks),
            detailLabel:
              preview?.routeDisplayName ??
              (choice.serviceRequest
                ? "Service route unavailable"
                : undefined),
          };
        }),
        resultHeading:
          result === null
            ? undefined
            : resultDelivered
              ? "Result returned"
              : result.pendingLabel,
        resultBody:
          result === null
            ? undefined
            : resultDelivered
              ? result.resultNarrative
              : `${result.routeDisplayName}. The patient will return when the result is ready.`,
        etaLabel:
          result && !resultDelivered
            ? `${Math.max(0, result.dueTick - state.facilityTick)} in-game hour${
                Math.max(0, result.dueTick - state.facilityTick) === 1
                  ? ""
                  : "s"
              } remaining`
            : undefined,
        feedbackTitle:
          answer === null
            ? undefined
            : answer.correct
              ? "Correct"
              : "Corrective feedback",
        feedbackBody: answer?.explanation,
        current: isCurrent,
        complete: step.status === "completed",
      };
    })
    .filter((step) => step !== null);
  const settlement = getEncounterSettlement(state, encounter.id);

  return {
    id: encounter.id,
    patientName: encounter.patientDisplayName,
    patientDetails:
      encounter.arrivalClass === "tutorial"
        ? "Tutorial patient"
        : "Clinic patient",
    statusLabel: question
      ? `Question ${question.questionNumber} of ${question.questionCount}`
      : encounterStatus(encounter),
    presentation: encounter.frozenCase.presentation,
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
    terminalOutcomeTitle: terminalOutcome ? "What happened" : undefined,
    terminalOutcomeBody: terminalOutcome?.narrative,
    terminalOutcomeSeverity: terminalOutcome?.severity,
    terminalFeedbackNeedsAcknowledgment,
    summaryAvailable,
    summaryVisible: summaryAvailable && summaryVisible,
    summaryBody: learningSummary ?? undefined,
    canFile,
    readOnly,
    avatar: encounter.patientAppearance,
    presentationHeading: "Presentation",
    decisionSteps,
    reward: settlement
      ? {
          heading: "Encounter rewards",
          moneyLabel: signedCurrency(settlement.netCashDelta),
          xpLabel: `+${settlement.clinicalXpAwarded} Learning XP`,
          satisfactionLabel: signedPercent(settlement.satisfactionDelta),
        }
      : undefined,
    primaryActionLabel: terminalFeedbackNeedsAcknowledgment
      ? "Continue to summary"
      : encounter.lifecycle === "active_pending_result"
        ? "Return to clinic"
        : undefined,
  };
}

export function createPrototypePlayerView(
  state: GameState,
  selectedEncounterId: string | null,
  summaryVisible: boolean,
  selectedRoomDefinitionId: string | null,
  buildMode = false,
  selectedRoomInstanceId: string | null = null,
  placementOrientation: RoomOrientation = 0,
  camera: FacilityViewModel["camera"] = {
    zoom: 1,
    panX: 0,
    panY: 0,
  },
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
  const clock = getFacilityClock(state);
  const emergencyGlp1Status = getEmergencyGlp1Status(state);
  const hourlyOperatingDelta = getOperatingExpensePerFacilityHour(state);
  const xpRequirement = progressionStatus.requirements.find(
    (requirement) => requirement.id === "progression.clinical_xp",
  );
  const xpProgressPercent = xpRequirement
    ? Math.min(
        100,
        (xpRequirement.current / Math.max(1, xpRequirement.required)) * 100,
      )
    : 100;
  const workloadStatus = workload.overRoutineCapacity
    ? "Routine workload is above its target."
    : workload.atRoutineCapacity
      ? "Routine arrivals pause until capacity is available."
      : `${workload.routineLimit - workload.occupancy} routine workload slot${
          workload.routineLimit - workload.occupancy === 1 ? "" : "s"
        } available.`;

  const patients = [
    ...lists.waiting.map((item) =>
      toPatientTab(state, item, "waiting", selectedEncounterId),
    ),
    ...lists.active.map((item) =>
      toPatientTab(state, item, "active", selectedEncounterId),
    ),
    ...lists.resolved.map((item) =>
      toPatientTab(state, item, "resolved", selectedEncounterId),
    ),
  ];

  return {
    emergencyGlp1: {
      visible: emergencyGlp1Status.cashEligible,
      enabled: emergencyGlp1Status.eligible,
      paymentLabel: `+$${emergencyGlp1Status.payment}`,
      statusLabel:
        emergencyGlp1Status.blockedReason ??
        "Ready now; does not advance facility time.",
      useCountLabel: `Today: ${emergencyGlp1Status.usesToday}/${emergencyGlp1Status.dailyUseCap}`,
      flavorMessage:
        state.emergencyGlp1.lastFlavorMessage ?? undefined,
    },
    resourceBar: {
      moneyLabel: `$${state.cash.toLocaleString()}`,
      moneyDeltaLabel: `${signedCurrency(hourlyOperatingDelta)}/hr`,
      xpLabel: state.clinicalXp.toLocaleString(),
      satisfactionLabel: `${state.satisfaction}%`,
      facilityTimeLabel: clock.displayLabel,
      workloadLabel: `${workload.occupancy}/${workload.routineLimit}`,
      workloadStatusLabel: workload.atRoutineCapacity
        ? "At routine capacity"
        : "Capacity available",
      facilityLevelLabel: `Level ${state.facilityLevel}`,
      levelLabel: `Level ${state.facilityLevel}`,
      xpProgressLabel: xpRequirement
        ? `${Math.min(
            xpRequirement.current,
            xpRequirement.required,
          )}/${xpRequirement.required} XP`
        : "Maximum prototype level",
      xpProgressPercent,
      moneyHourlyDeltaLabel: `${signedCurrency(hourlyOperatingDelta)}/hr`,
      dayTimeLabel: clock.displayLabel,
      goals: progressionStatus.requirements.map((requirement) => ({
        id: requirement.id,
        label: requirement.label,
        complete: requirement.met,
        progressLabel: `${Math.min(
          requirement.current,
          requirement.required,
        )}/${requirement.required}`,
      })),
      contentNoticeLabel:
        "DEMONSTRATION CONTENT ONLY — not clinically approved or medical advice.",
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
      buildMode,
      selectedRoomInstanceId,
      camera,
      gridColumns: facilityBalance.gridWidth,
      gridRows: facilityBalance.gridHeight,
      patientCounts: {
        waiting: lists.waiting.length,
        active: lists.active.length,
        actionReady: lists.active.filter((item) => item.actionRequired).length,
        resolved: lists.resolved.length,
      },
      patients: Object.values(state.encounters)
        .filter((encounter) => encounter.lifecycle !== "resolved")
        .map((encounter) => {
          const location = getPendingPatientLocation(state, encounter.id);
          return {
            instanceId: encounter.id,
            displayName: encounter.patientDisplayName,
            status:
              encounter.lifecycle === "waiting_unopened"
                ? ("waiting" as const)
                : encounter.lifecycle === "active_pending_result"
                  ? ("off-site" as const)
                  : encounter.lifecycle === "active_action_required"
                    ? ("action-ready" as const)
                    : ("active" as const),
            appearance: encounter.patientAppearance,
            ...(location ? { location } : {}),
          };
        }),
      rooms: state.rooms.flatMap((room) => {
        const definition = getRoomDefinition(room.roomDefinitionId);
        const footprint = getRoomInstanceFootprint(state, room.id);
        return definition
          ? [
              {
                instanceId: room.id,
                definitionId: room.roomDefinitionId,
                displayName: definition.displayName,
                tileX: room.x,
                tileY: room.y,
                width: footprint?.width ?? definition.width,
                height: footprint?.height ?? definition.height,
                isFounderRoom: initialRoomInstanceIds.has(room.id),
                kind: definition.kind,
                orientation: room.orientation,
                doorSide: room.doorSide,
                upgradeLevel: room.upgradeLevel,
              },
            ]
          : [];
      }),
      staff: state.employees.map((employee) => {
        const role = getStaffRoleDefinition(
          employee.staffRoleDefinitionId,
        );
        return {
          instanceId: employee.id,
          displayName: employee.displayName,
          roleDisplayName:
            role?.displayName ?? employee.staffRoleDefinitionId,
          homeRoomInstanceId: employee.homeRoomInstanceId,
          appearance: employee.appearance,
          salaryPerExpenseInterval:
            employee.salaryPerExpenseInterval,
          morale: employee.morale,
          trainingLevel: employee.trainingLevel,
          location: employee.location,
          path: employee.path,
          pathIndex: employee.pathIndex,
        };
      }),
      placement: selectedRoomDefinitionId
        ? (() => {
            const definition = getRoomDefinition(
              selectedRoomDefinitionId,
            );
            const footprint = definition
              ? getRotatedFootprint(definition, placementOrientation)
              : null;
            return definition
              ? {
                  definitionId: definition.id,
                  displayName: definition.displayName,
                  width: footprint?.width ?? definition.width,
                  height: footprint?.height ?? definition.height,
                  kind: definition.kind,
                  orientation: placementOrientation,
                  doorSide:
                    definition.defaultDoorSide === null
                      ? null
                      : rotateDirection(
                          definition.defaultDoorSide,
                          placementOrientation,
                        ),
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
        const ownedCount = state.rooms.filter(
          (room) => room.roomDefinitionId === definition.id,
        ).length;
        const owned = ownedCount > 0;
        const atMaximum =
          definition.maximumInstances !== null &&
          ownedCount >= definition.maximumInstances;
        const requirementsMet =
          definition.requiredRoomDefinitionIds.every((requiredId) =>
            placedRoomDefinitionIds.has(requiredId),
          );
        const affordable = state.cash >= definition.constructionCost;
        const blockedReason = atMaximum
          ? `Maximum ${definition.maximumInstances} built.`
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
          upkeepLabel: `$${definition.upkeepPerExpenseInterval.toLocaleString()} upkeep / clinic day · ${ownedCount} built`,
          owned,
          selected: selectedRoomDefinitionId === definition.id,
          enabled:
            !atMaximum &&
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
        const hiredCount = state.employees.filter(
          (employee) => employee.staffRoleDefinitionId === role.id,
        ).length;
        const hired = hiredCount > 0;
        const atMaximum = hiredCount >= role.maximumEmployees;
        const requirementsMet = role.requiredRoomDefinitionIds.every(
          (requiredId) => placedRoomDefinitionIds.has(requiredId),
        );
        const affordable = state.cash >= role.hiringCost;
        const blockedReason = atMaximum
          ? `Maximum ${role.maximumEmployees} hired.`
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
          displayName: `${role.displayName} ${hiredCount}/${role.maximumEmployees}`,
          costLabel: `$${role.hiringCost.toLocaleString()} hire`,
          salaryLabel: `$${role.salaryPerExpenseInterval.toLocaleString()} salary / clinic day`,
          hired,
          enabled:
            !atMaximum &&
            requirementsMet &&
            affordable,
          blockedReason,
        };
      }),
    staffRoles: facilityBalance.staffRoleDefinitions
      .filter((role) => role.unlockFacilityLevel <= state.facilityLevel)
      .map((role) => {
        const employees = state.employees.filter(
          (employee) => employee.staffRoleDefinitionId === role.id,
        );
        const requirementsMet = role.requiredRoomDefinitionIds.every(
          (requiredId) => placedRoomDefinitionIds.has(requiredId),
        );
        const affordable = state.cash >= role.hiringCost;
        const atMaximum = employees.length >= role.maximumEmployees;
        const blockedReason = atMaximum
          ? `Maximum ${role.maximumEmployees} hired.`
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
          currentCount: employees.length,
          maximumCount: role.maximumEmployees,
          hiringCostLabel: `$${role.hiringCost.toLocaleString()}`,
          employees: employees.map((employee) => ({
            id: employee.id,
            displayName: employee.displayName,
            roleDisplayName: role.displayName,
            salaryLabel: `$${employee.salaryPerExpenseInterval.toLocaleString()}/day`,
            moraleLabel: `${employee.morale}%`,
            moralePercent: employee.morale,
            avatar: employee.appearance,
            canDecreaseSalary:
              employee.salaryPerExpenseInterval >
              role.minimumSalaryPerExpenseInterval,
            canIncreaseSalary:
              employee.salaryPerExpenseInterval <
              role.maximumSalaryPerExpenseInterval,
          })),
          canHire: !atMaximum && requirementsMet && affordable,
          blockedReason,
        };
      }),
    messages: createMessageBoardView(state),
    selectedRoomBuild: (() => {
      if (!selectedRoomInstanceId) {
        return null;
      }
      const room = state.rooms.find(
        (candidate) => candidate.id === selectedRoomInstanceId,
      );
      const definition = room
        ? getRoomDefinition(room.roomDefinitionId)
        : null;
      if (!room || !definition) {
        return null;
      }
      const upgradeCost = getNextRoomUpgradeCost(state, room.id);
      const resaleValue = getRoomResaleValue(state, room.id);
      const protectedRoom =
        facilityBalance.protectedRoomDefinitionIds.includes(
          room.roomDefinitionId,
        );
      return {
        id: room.id,
        displayName: definition.displayName,
        upgradeLevel: room.upgradeLevel,
        upgradeCostLabel:
          upgradeCost === null
            ? undefined
            : `$${upgradeCost.toLocaleString()}`,
        resaleValueLabel:
          resaleValue === null
            ? undefined
            : `$${resaleValue.toLocaleString()} refund`,
        canUpgrade:
          upgradeCost !== null && state.cash >= upgradeCost,
        canSell: !protectedRoom,
        blockedReason: protectedRoom
          ? "The Front Desk is the clinic's permanent entrance and cannot be sold."
          : upgradeCost !== null && state.cash < upgradeCost
            ? `Need $${(
                upgradeCost - state.cash
              ).toLocaleString()} more to upgrade.`
            : undefined,
      };
    })(),
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
      addMoneyLabel: `Add $${PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.development.addMoneyAmount}`,
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
