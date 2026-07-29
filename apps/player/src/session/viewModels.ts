import {
  PROTOTYPE_DOMAIN_CONTEXT,
  TUTORIAL_ENCOUNTER_ID,
  getAnswerChoiceServicePreview,
  getClinicSatisfaction,
  getFacilityProgressionStatus,
  getFacilityClock,
  getCurrentQuestion,
  getEmergencyGlp1Status,
  getEncounterSettlement,
  getEncounterPatientLocation,
  getLearningSummary,
  getNextRoomUpgradeCost,
  getOperatingExpensePerFacilityHour,
  getPatientLists,
  getPendingOffsitePatientTravel,
  getPendingPatientRoutePresentation,
  getPendingResultEta,
  getRotatedFootprint,
  getRoomDefinition,
  getRoomInstanceFootprint,
  getRoomResaleValue,
  getStaffRoleDefinition,
  getWorkloadSnapshot,
  validateDoorPlacement,
  type CardinalDirection,
  type EncounterState,
  type GameState,
  type GridPoint,
  type PatientListItem,
  type RoomOrientation,
} from "@gamify-surgery/game-domain";
import type { FacilityViewModel } from "../facility";
import { createMessageBoardView } from "./alertViewModels";
import type {
  AdvertisingView,
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
  advertising: AdvertisingView;
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

function movementPresentation(
  path: GridPoint[] | undefined,
  pathIndex: number | undefined,
): {
  moving: boolean;
  direction: "front" | "side" | "back";
  path?: GridPoint[];
  pathIndex?: number;
} {
  if (!path || path.length < 2 || pathIndex === undefined) {
    return {
      moving: false,
      direction: "front",
      ...(path ? { path } : {}),
      ...(pathIndex === undefined ? {} : { pathIndex }),
    };
  }
  const current = path[Math.min(pathIndex, path.length - 1)];
  const next = path[Math.min(pathIndex + 1, path.length - 1)];
  if (!current || !next || (current.x === next.x && current.y === next.y)) {
    return {
      moving: false,
      direction: "front",
      path,
      pathIndex,
    };
  }
  return {
    moving: true,
    path,
    pathIndex,
    direction:
      next.x !== current.x
        ? "side"
        : next.y < current.y
          ? "back"
          : "front",
  };
}

function formatFacilityDuration(value: number): string {
  if (value >= 60 && value % 60 === 0) {
    const hours = value / 60;
    return `${hours} hour${hours === 1 ? "" : "s"}`;
  }
  return `${value} min`;
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
  const encounter = state.encounters[item.encounterId];
  const arrivalLabel =
    item.arrivalClass === "tutorial"
      ? "Tutorial patient"
      : item.arrivalClass === "progression_critical"
        ? "Progression patient"
        : "Routine patient";
  const pendingMinutes =
    encounter?.lifecycle === "active_pending_result" &&
    encounter.pendingResult &&
    encounter.patientMovement === null
      ? Math.max(
          0,
          encounter.pendingResult.dueTick - state.facilityTick,
        )
      : null;
  const pendingStatus =
    pendingMinutes === null
      ? null
      : `${
          encounter?.pendingResult?.pendingLabel ?? "Result pending"
        } · returns in ${formatFacilityDuration(pendingMinutes)}`;

  return {
    id: item.encounterId,
    folder,
    name: item.patientDisplayName,
    subtitle: arrivalLabel,
    statusLabel: pendingStatus ?? item.statusLabel,
    actionRequired: item.actionRequired,
    selected: selectedEncounterId === item.encounterId,
    satisfactionPercent: item.patientSatisfaction,
    patienceLabel: `Satisfaction: ${item.patientSatisfaction}% · Waiting: ${item.waitingMinutes} min`,
    avatar: encounter?.patientAppearance,
    sortKey: encounter?.waiting.arrivedAtTick,
  };
}

function encounterStatus(encounter: EncounterState): string {
  if (encounter.patientMovement) {
    switch (encounter.patientMovement.kind) {
      case "arriving_for_check_in":
        return "Walking to Check-In";
      case "walking_to_care":
        return "Walking to Examination";
      case "walking_to_waiting":
        return "Walking to Waiting Area";
      case "departing_for_offsite_testing":
        return "Leaving for Testing";
      case "returning_from_offsite_testing":
        return "Returning to Clinic";
      case "idle_within_room":
        break;
      case "leaving_after_resolution":
      case "leaving_after_walkout":
        return "Leaving Clinic";
    }
  }
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
      return encounter.resolutionReason === "walkout"
        ? "Walked out"
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
  if (encounter.resolutionReason === "walkout") {
    return {
      id: encounter.id,
      patientName: encounter.patientDisplayName,
      patientDetails: `Final satisfaction: ${encounter.finalPatientSatisfaction ?? encounter.patientSatisfaction}%`,
      statusLabel: "Walked out",
      presentation: "The patient left before the encounter was completed.",
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
  const currentStep =
    encounter.steps[encounter.currentNodeIndex] ?? null;
  const showInterimFeedback =
    currentStep?.status === "feedback_pending" &&
    lastAnswer !== undefined;
  const feedbackBody = terminalFeedback
    ? (terminalFeedback.correction ?? lastAnswer?.explanation)
    : showInterimFeedback
      ? lastAnswer.explanation
      : undefined;
  const feedbackTitle =
    lastAnswer?.correct === true
      ? "Correct"
      : lastAnswer
        ? "Incorrect"
        : undefined;
  const terminalOutcome = terminalFeedback?.outcome ?? null;
  const terminalConsequence =
    terminalOutcome?.narrative ?? terminalFeedback?.consequence ?? null;
  const intermediateFeedbackNeedsAcknowledgment =
    currentStep?.status === "feedback_pending";
  const terminalFeedbackNeedsAcknowledgment =
    (terminalFeedback !== null && !terminalFeedback.acknowledged) ||
    intermediateFeedbackNeedsAcknowledgment;
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
      const isCurrentNode =
        step.nodeIndex === encounter.currentNodeIndex;
      const decisionAvailableDuringMovement =
        encounter.patientMovement === null ||
        encounter.patientMovement.kind === "walking_to_care";
      const isCurrent =
        isCurrentNode &&
        encounter.lifecycle !== "resolved" &&
        (encounter.lifecycle === "resolved_summary_available" ||
          (encounter.lifecycle === "active_action_required" &&
            decisionAvailableDuringMovement));
      const questionIsVisible =
        step.status !== "action_required" || isCurrent;
      const answer = step.answer;
      const result = step.result;
      const visibleResult =
        step.status === "feedback_pending" ? null : result;
      const resultDelivered =
        visibleResult !== null &&
        visibleResult.deliveredAtTick !== null;
      return {
        id: step.decisionNodeId,
        heading: `Decision ${step.nodeIndex + 1} of ${
          encounter.frozenCase.decisionNodes.length
        }`,
        statusLabel:
          step.status === "action_required" && !isCurrent
            ? "Patient en route"
            : step.status === "result_pending"
            ? "Patient off-site"
            : step.status === "feedback_pending"
              ? "Review feedback"
            : step.status === "action_required"
              ? undefined
              : "Complete",
        questionPrompt: questionIsVisible ? node.stem : undefined,
        answerChoices: questionIsVisible ? node.answerChoices.map((choice) => {
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
                : formatFacilityDuration(preview.durationTicks),
            detailLabel:
              preview?.routeDisplayName ??
              (choice.serviceRequest
                ? "Service route unavailable"
                : undefined),
          };
        }) : [],
        resultHeading:
          visibleResult === null
            ? undefined
            : resultDelivered
              ? "Result returned"
              : visibleResult.pendingLabel,
        resultBody:
          visibleResult === null
            ? undefined
            : resultDelivered
              ? visibleResult.resultNarrative
              : `${visibleResult.routeDisplayName}. The patient will return when the result is ready.`,
        etaLabel:
          visibleResult && !resultDelivered
            ? `${formatFacilityDuration(
                Math.max(
                  0,
                  visibleResult.dueTick - state.facilityTick,
                ),
              )} remaining`
            : undefined,
        feedbackTitle:
          answer === null
            ? undefined
            : answer.correct
              ? "Correct"
              : "Incorrect",
        feedbackBody: answer?.explanation,
        rewardLabel: answer
          ? `Decision XP: +${
              answer.correct
                ? encounter.id === TUTORIAL_ENCOUNTER_ID
                  ? PROTOTYPE_DOMAIN_CONTEXT.balanceRelease
                      .clinicalSettlement
                      .firstTutorialCorrectDecisionXp
                  : PROTOTYPE_DOMAIN_CONTEXT.balanceRelease
                      .clinicalSettlement
                      .clinicalXpPerCorrectFirstAnswer
                : PROTOTYPE_DOMAIN_CONTEXT.balanceRelease
                    .clinicalSettlement
                    .clinicalXpPerIncorrectFirstAnswer
            }`
          : undefined,
        nextActionLabel:
          answer && step.status === "feedback_pending"
            ? result
              ? `${
                  answer.correct ? "Next" : "Corrected plan"
                }: ${result.routeDisplayName} will begin after you continue.`
              : step.nodeIndex ===
                  encounter.frozenCase.decisionNodes.length - 1
                ? "Next: review the encounter outcome, then close the chart."
                : "Next: continue to the following clinical decision."
            : undefined,
        collapsedResultLabel: answer
          ? `${
              answer.correct ? "Correct" : "Incorrect"
            } — ${
              resultDelivered && visibleResult
                ? visibleResult.resultNarrative
                : (node.answerChoices.find(
                    (choice) => choice.id === answer.answerChoiceId,
                  )?.label ?? "Decision recorded")
            }`
          : undefined,
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
    ageLabel: encounter.frozenCase.prototypeDemographics
      ? `${encounter.frozenCase.prototypeDemographics.ageYears} years`
      : undefined,
    sexLabel:
      encounter.frozenCase.prototypeDemographics?.sexLabel,
    chiefComplaint: encounter.frozenCase.chiefComplaint,
    patientSatisfactionLabel: `${encounter.patientSatisfaction}%`,
    vitals: encounter.frozenCase.prototypeVitalSigns
      ? [
          {
            id: "heart-rate",
            label: "HR",
            value: `${encounter.frozenCase.prototypeVitalSigns.heartRateBpm}`,
            icon: "heart" as const,
          },
          {
            id: "blood-pressure",
            label: "BP",
            value: `${encounter.frozenCase.prototypeVitalSigns.systolicBloodPressureMmHg}/${encounter.frozenCase.prototypeVitalSigns.diastolicBloodPressureMmHg}`,
            icon: "pressure" as const,
          },
          {
            id: "temperature",
            label: "Temp",
            value: `${encounter.frozenCase.prototypeVitalSigns.temperatureF.toFixed(1)} °F`,
            icon: "temperature" as const,
          },
          {
            id: "oxygen",
            label: "SpO₂",
            value: `${encounter.frozenCase.prototypeVitalSigns.oxygenSaturationPercent}%`,
            icon: "oxygen" as const,
          },
        ]
      : undefined,
    statusLabel: encounterStatus(encounter),
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
        : `${formatFacilityDuration(pendingEta)} remaining`,
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
    terminalOutcomeTitle: terminalConsequence ? "What happened" : undefined,
    terminalOutcomeBody: terminalConsequence ?? undefined,
    terminalOutcomeSeverity: terminalOutcome?.severity,
    terminalFeedbackNeedsAcknowledgment,
    summaryAvailable,
    summaryVisible: summaryAvailable && summaryVisible,
    summaryBody: learningSummary ?? undefined,
    canFile,
    readOnly,
    avatar: encounter.patientAppearance,
    presentationHeading: "History of present illness",
    decisionSteps,
    reward: settlement
      ? {
          heading: `Decisions Correct: ${settlement.correctAnswers}/${
            settlement.correctAnswers + settlement.incorrectAnswers
          }`,
          moneyLabel: `Encounter Payment: ${signedCurrency(
            settlement.netCashDelta,
          )}`,
          xpLabel: `Encounter XP: +${settlement.clinicalXpAwarded}`,
        }
      : undefined,
    primaryActionLabel: terminalFeedbackNeedsAcknowledgment
      ? intermediateFeedbackNeedsAcknowledgment
        ? encounter.pendingResult
          ? lastAnswer?.correct
            ? "Enact Plan"
            : "Enact Corrected Plan"
          : "Enact Plan"
        : "Dismiss"
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
  const advertisingLevels =
    PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.advertising.levels;
  const currentAdvertising =
    advertisingLevels.find((level) => level.level === state.advertisingLevel) ??
    advertisingLevels[0]!;
  const advertisingFrequencyLabel = (intervalPercent: number): string => {
    const increasePercent = Math.round(10_000 / intervalPercent - 100);
    return increasePercent <= 0
      ? "Normal arrival frequency"
      : `About +${increasePercent}% arrival frequency`;
  };
  const effectiveSatisfaction = getClinicSatisfaction(state);
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
        "Ready now; one consult per facility hour.",
      cooldownLabel:
        emergencyGlp1Status.cooldownRemainingTicks > 0
          ? `${emergencyGlp1Status.cooldownRemainingTicks} min cooldown`
          : "Hourly consult ready",
      cooldownProgressPercent: Math.max(
        0,
        Math.min(
          100,
          100 -
            (emergencyGlp1Status.cooldownRemainingTicks /
              Math.max(
                1,
                PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.emergencyGlp1
                  .cooldownMinutes,
              )) *
              100,
        ),
      ),
      flavorMessage:
        state.emergencyGlp1.lastFlavorMessage ?? undefined,
    },
    advertising: {
      currentLevel: currentAdvertising.level,
      currentDisplayName: currentAdvertising.displayName,
      hourlyCostLabel:
        currentAdvertising.hourlyCost === 0
          ? "$0/hr"
          : `$${currentAdvertising.hourlyCost}/hr`,
      arrivalFrequencyLabel: advertisingFrequencyLabel(
        currentAdvertising.arrivalIntervalMultiplierPercent,
      ),
      canDecrease:
        advertisingLevels.some(
          (level) => level.level < currentAdvertising.level,
        ),
      canIncrease:
        advertisingLevels.some(
          (level) => level.level > currentAdvertising.level,
        ),
      levels: advertisingLevels.map((level) => ({
        level: level.level,
        displayName: level.displayName,
        hourlyCostLabel:
          level.hourlyCost === 0 ? "$0/hr" : `$${level.hourlyCost}/hr`,
        arrivalFrequencyLabel: advertisingFrequencyLabel(
          level.arrivalIntervalMultiplierPercent,
        ),
        selected: level.level === currentAdvertising.level,
      })),
    },
    resourceBar: {
      moneyLabel: `$${state.cash.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      moneyDeltaLabel: `${signedCurrency(hourlyOperatingDelta)}/hr`,
      xpLabel: state.clinicalXp.toLocaleString(),
      satisfactionLabel:
        effectiveSatisfaction === null ? "—" : `${effectiveSatisfaction}%`,
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
      simulationSpeed: state.simulationSpeed,
      realMillisecondsPerFacilityMinuteAt1x:
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.clock
          .realMillisecondsPerFacilityMinuteAt1x,
      patientTravelTilesPerFacilityMinute:
        PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility
          .patientTravelTilesPerTick,
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
      founder: {
        displayName: state.founder.displayName,
        appearance: state.founder.appearance,
        location: state.environment.founderLocation,
        ...movementPresentation(
          state.environment.founderActivity?.path,
          state.environment.founderActivity?.pathIndex,
        ),
        activityLabel:
          state.environment.founderActivity?.kind === "collect_litter"
            ? "Picking up litter"
            : state.environment.founderActivity?.kind === "refill_water"
              ? "Refilling water cooler"
              : state.environment.founderActivity?.kind ===
                  "praise_employee"
                ? "Praising employee"
                : undefined,
      },
      litterItems: state.environment.litterItems.map((item) => ({
        instanceId: item.id,
        roomInstanceId: item.roomId,
        location: item.location,
      })),
      waterCooler: {
        location: (() => {
          const front = state.rooms.find((room) =>
            facilityBalance.protectedRoomDefinitionIds.includes(
              room.roomDefinitionId,
            ),
          );
          return front
            ? { x: front.x, y: front.y + 1 }
            : state.environment.founderLocation;
        })(),
        fillPercent: state.environment.waterCoolerFillPercent,
        needsRefill:
          state.environment.waterCoolerFillPercent <=
          PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.environment
            .waterCoolerLowThreshold,
      },
      patients: Object.values(state.encounters)
        .filter(
          (encounter) =>
            encounter.lifecycle !== "resolved" ||
            encounter.patientMovement !== null,
        )
        .map((encounter) => {
          const location = getEncounterPatientLocation(
            state,
            encounter.id,
          );
          const offsiteTravel = getPendingOffsitePatientTravel(
            state,
            encounter.id,
          );
          const pendingFacilityRoute =
            getPendingPatientRoutePresentation(state, encounter.id);
          const presentationPath =
            encounter.patientMovement?.path ??
            pendingFacilityRoute?.path;
          const presentationPathIndex =
            encounter.patientMovement?.pathIndex ??
            pendingFacilityRoute?.pathIndex;
          return {
            instanceId: encounter.id,
            displayName: encounter.patientDisplayName,
            status:
              encounter.patientMovement?.kind ===
                  "leaving_after_resolution" ||
                encounter.patientMovement?.kind ===
                  "leaving_after_walkout"
                ? ("active" as const)
                : encounter.lifecycle === "waiting_unopened"
                ? ("waiting" as const)
                : encounter.lifecycle === "active_pending_result"
                  ? ("off-site" as const)
                  : encounter.lifecycle === "active_action_required"
                    ? ("action-ready" as const)
                    : ("active" as const),
            appearance: encounter.patientAppearance,
            ...movementPresentation(
              presentationPath,
              presentationPathIndex,
            ),
            ...(location ? { location } : {}),
            ...(offsiteTravel ? { offsiteTravel } : {}),
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
                cleanliness: room.cleanliness ?? 100,
                upgradeAvailable:
                  getNextRoomUpgradeCost(state, room.id) !== null,
              },
            ]
          : [];
      }),
      doors: state.doors.map((door) => ({
        instanceId: door.id,
        roomInstanceId: door.roomId,
        side: door.side,
        offset: door.offset,
        exterior: door.exterior,
      })),
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
          ...movementPresentation(employee.path, employee.pathIndex),
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
                  // Doors are placed separately after the room footprint.
                  doorSide: null,
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
          upkeepLabel: `$${definition.upkeepPerExpenseInterval.toLocaleString()} upkeep / hr · ${ownedCount} built`,
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
          salaryLabel: `$${role.salaryPerExpenseInterval.toLocaleString()} salary / hr`,
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
            salaryLabel: `$${employee.salaryPerExpenseInterval.toLocaleString()}/hr`,
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
      const nextUpgradeLevel =
        upgradeCost === null ? undefined : room.upgradeLevel + 1;
      const resaleValue = getRoomResaleValue(state, room.id);
      const protectedRoom =
        facilityBalance.protectedRoomDefinitionIds.includes(
          room.roomDefinitionId,
        );
      const footprint =
        getRoomInstanceFootprint(state, room.id) ?? {
          width: definition.width,
          height: definition.height,
        };
      const sideLengths: Record<CardinalDirection, number> = {
        north: footprint.width,
        east: footprint.height,
        south: footprint.width,
        west: footprint.height,
      };
      const sides: CardinalDirection[] = [
        "north",
        "east",
        "south",
        "west",
      ];
      const doorSlots = sides.flatMap((side) =>
        Array.from({ length: sideLengths[side] }, (_, offset) => {
          const validation = validateDoorPlacement(
            {
              id: `door.preview.${room.id}.${side}.${offset}`,
              roomId: room.id,
              side,
              offset,
              exterior: false,
            },
            state.rooms,
            state.doors,
            (definitionId) => getRoomDefinition(definitionId),
            facilityBalance.gridWidth,
            facilityBalance.gridHeight,
            new Set(
              facilityBalance.protectedRoomDefinitionIds,
            ),
          );
          const normalizedOffset =
            sideLengths[side] <= 1
              ? 0.5
              : offset / (sideLengths[side] - 1);
          const positionLabel =
            side === "north" || side === "south"
              ? normalizedOffset < 0.34
                ? "left"
                : normalizedOffset > 0.66
                  ? "right"
                  : "center"
              : normalizedOffset < 0.34
                ? "top"
                : normalizedOffset > 0.66
                  ? "bottom"
                  : "middle";
          return {
            id: `${side}.${offset}`,
            side,
            offset,
            label: `${side[0]!.toUpperCase()}${side.slice(
              1,
            )} wall · ${positionLabel}`,
            enabled: validation.valid,
            blockedReason: validation.reason ?? undefined,
          };
        }),
      );
      const upgradeImprovements =
        nextUpgradeLevel === undefined
          ? []
          : [
              `Room finish and fixed fixtures advance to Level ${nextUpgradeLevel}.`,
              ...(definition.workloadLimitContributionPerUpgradeLevel > 0
                ? [
                    `Routine workload capacity +${definition.workloadLimitContributionPerUpgradeLevel}.`,
                  ]
                : []),
              ...(definition.serviceDurationReductionPercentPerUpgradeLevel >
              0
                ? [
                    `Room service time ${definition.serviceDurationReductionPercentPerUpgradeLevel}% faster.`,
                  ]
                : []),
              ...(PROTOTYPE_DOMAIN_CONTEXT.balanceRelease
                .patientSatisfaction.roomUpgradeBonusPerLevel > 0
                ? [
                    `Completed-encounter satisfaction +${PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction.roomUpgradeBonusPerLevel} (clinic upgrade bonus capped at +${PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction.maximumRoomUpgradeBonus}).`,
                  ]
                : []),
              ...(definition.upkeepPerUpgradeLevel > 0
                ? [
                    `Hourly upkeep +$${definition.upkeepPerUpgradeLevel}.`,
                  ]
                : []),
            ];
      return {
        id: room.id,
        displayName: definition.displayName,
        upgradeLevel: room.upgradeLevel,
        nextUpgradeLevel,
        upgradeCostLabel:
          upgradeCost === null
            ? undefined
            : `$${upgradeCost.toLocaleString()}`,
        upgradeImprovements,
        resaleValueLabel:
          resaleValue === null
            ? undefined
            : `$${resaleValue.toLocaleString()} refund`,
        canUpgrade:
          upgradeCost !== null && state.cash >= upgradeCost,
        canSell: !protectedRoom,
        canMove: !protectedRoom,
        canRotate: !protectedRoom,
        doors: state.doors
          .filter((door) => door.roomId === room.id)
          .map((door) => ({
            id: door.id,
            label: door.exterior
              ? "Public entrance"
              : `${door.side[0]!.toUpperCase()}${door.side.slice(
                  1,
                )} wall door`,
            removable: !door.exterior,
          })),
        doorSlots,
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
      fastForwardLabel: `Fast-forward ${PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.development.fastForwardTickCount} min`,
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
