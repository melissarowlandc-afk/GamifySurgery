import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  getFacilityAccessValidation,
  getFacilityProgressionStatus,
  type GameState,
} from "@gamify-surgery/game-domain";

export type TutorialActionId =
  | "open-first-chart"
  | "focus-first-chart"
  | "acknowledge-step"
  | "advance-first-result"
  | "open-ready-chart"
  | "acknowledge-feedback"
  | "resolve-chart"
  | "open-second-chart"
  | "enter-build-mode"
  | "select-exam-room"
  | "exit-build-mode"
  | "level-up";

export type TutorialTarget =
  | "waiting-patient"
  | "chart"
  | "answer-choices"
  | "existing-patient"
  | "facility-clock"
  | "chart-feedback"
  | "encounter-summary"
  | "flip-chart"
  | "resolve-chart"
  | "alerts"
  | "waiting-actions"
  | "goals"
  | "build-mode"
  | "exam-room-option"
  | "facility-placement"
  | "room-selection"
  | "door-tool"
  | "exit-build-mode"
  | "level-up";

export interface TutorialActionView {
  id: TutorialActionId;
  label: string;
}

export interface TutorialStepView {
  id:
    | "welcome"
    | "first-patient-arriving"
    | "open-first-chart"
    | "first-patient-walking-to-care"
    | "reopen-first-chart"
    | "chart-tour"
    | "first-decision"
    | "off-site-result"
    | "results-ready"
    | "follow-up-decision"
    | "reopen-first-feedback"
    | "first-feedback"
    | "first-encounter-summary"
    | "flip-first-chart"
    | "resolve-first-chart"
    | "between-tutorial-patients"
    | "second-patient"
    | "second-patient-arriving"
    | "open-second-chart"
    | "second-first-decision"
    | "second-plan-feedback"
    | "second-sendout-wait"
    | "second-result-ready"
    | "second-follow-up-decision"
    | "second-final-feedback"
    | "reopen-second-chart"
    | "second-decision"
    | "reopen-second-feedback"
    | "second-feedback"
    | "resolve-second-chart"
    | "alerts-tour"
    | "goals-tour"
    | "enter-build-mode"
    | "select-exam-room"
    | "place-exam-room"
    | "select-exam-room-for-door"
    | "place-exam-room-door"
    | "exit-build-mode"
    | "remaining-goals"
    | "advance-level"
    | "level-one-ready"
    | "level-one-first-arrival"
    | "level-one-service-drill"
    | "level-one-sendout-wait"
    | "level-one-result-ready"
    | "level-one-returned-result";
  eyebrow: string;
  title: string;
  body: string;
  note?: string;
  flavor?: string;
  target: TutorialTarget;
  targetSelector: string;
  /** A larger interface region that the coach must not cover. */
  avoidSelector?: string;
  patientEncounterId?: string;
  primaryAction?: TutorialActionView;
  secondaryAction?: TutorialActionView;
}

interface TutorialViewInput {
  state: GameState;
  tutorialsEnabled: boolean;
  introDismissed: boolean;
  acknowledgedStepIds: ReadonlySet<string>;
  buildMode: boolean;
  selectedRoomDefinitionId: string | null;
  selectedRoomInstanceId?: string | null;
  summaryVisible?: boolean;
}

function step(
  value: TutorialStepView,
): TutorialStepView {
  return value;
}

function formatMinutes(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  if (safe < 60) {
    return `${safe} min`;
  }
  const hours = Math.floor(safe / 60);
  const remainder = safe % 60;
  return remainder === 0
    ? `${hours} hr`
    : `${hours} hr ${remainder} min`;
}

function createLevelZeroBuildTutorialStepView(
  input: TutorialViewInput,
): TutorialStepView | null {
  const {
    state,
    acknowledgedStepIds,
    buildMode,
    selectedRoomDefinitionId,
    selectedRoomInstanceId = null,
  } = input;
  const acknowledged = (id: TutorialStepView["id"]): boolean =>
    (id === "alerts-tour" &&
      state.alertHumor.alertsTutorialAcknowledgedAtTick !== null) ||
    acknowledgedStepIds.has(`${state.campaignId}:${id}`);
  const examRoom = state.rooms.find(
    (room) => room.roomDefinitionId === "room.examination",
  );
  const examRoomBuilt = examRoom !== undefined;
  const progression = getFacilityProgressionStatus(state);
  const facilityAccess = getFacilityAccessValidation(state);

  if (!examRoomBuilt && !buildMode) {
    if (acknowledged("enter-build-mode")) {
      return null;
    }
    return step({
      id: "enter-build-mode",
      eyebrow: "Level 0 tutorial · Build Mode",
      title: "Enter Build Mode",
      body:
        "A patient would prefer not to discuss private health information at the Front Desk. Enter Build Mode and add an Examination Room.",
      note:
        "Build Mode pauses facility time so patients do not age into fossils while you remodel.",
      flavor: "Architecture: medicine's least reimbursable procedure.",
      target: "build-mode",
      targetSelector: ".build-mode-trigger",
    });
  }

  if (!examRoomBuilt && buildMode) {
    if (!acknowledged("select-exam-room")) {
      return step({
        id: "select-exam-room",
        eyebrow: "Level 0 tutorial · Build Mode",
        title: "Select the Examination Room",
        body:
          "The room card shows its price and footprint. Select it to attach a placement outline to your pointer.",
        target: "exam-room-option",
        targetSelector:
          "[data-room-definition-id='room.examination']",
      });
    }
    if (selectedRoomDefinitionId !== "room.examination") {
      return null;
    }
    if (!acknowledged("place-exam-room")) {
      return step({
        id: "place-exam-room",
        eyebrow: "Level 0 tutorial · Build Mode",
        title: "Place the room beside the clinic",
        body:
          "Move the outlined room beside the Front Desk. Rooms may connect directly to other rooms or to hallways.",
        note:
          "A valid outline confirms the footprint can be built. Click the facility to place it; you will add its door next.",
        target: "facility-placement",
        targetSelector: ".facility-host",
      });
    }
    return null;
  }

  if (
    examRoom &&
    buildMode &&
    facilityAccess.unreachableRoomIds.includes(examRoom.id)
  ) {
    if (!acknowledged("select-exam-room-for-door")) {
      return step({
        id: "select-exam-room-for-door",
        eyebrow: "Level 0 tutorial · Door access",
        title: "Select the new Examination Room",
        body:
          "Click the room you just placed. Its renovation tools will open on the desk.",
        flavor: "Four walls have been acquired. Access remains aspirational.",
        target: "room-selection",
        targetSelector: ".facility-host",
      });
    }
    if (selectedRoomInstanceId !== examRoom.id) {
      return null;
    }
    if (!acknowledged("place-exam-room-door")) {
      return step({
        id: "place-exam-room-door",
        eyebrow: "Level 0 tutorial · Door access",
        title: "Add a zero-cost door",
        body:
          "Choose Place Door, then select a valid shared wall. Doors connect rooms to reachable rooms or hallways.",
        note:
          "Done / Save and Return opens a modal listing every problem that must be corrected.",
        flavor:
          "The clinic has discovered that walls are excellent at preventing healthcare.",
        target: "door-tool",
        targetSelector: ".selected-room-inspector .door-tool",
        avoidSelector: ".door-slot-grid",
      });
    }
    return null;
  }

  if (examRoomBuilt && buildMode) {
    if (acknowledged("exit-build-mode")) {
      return null;
    }
    return step({
      id: "exit-build-mode",
      eyebrow: "Level 0 tutorial · Build Mode",
      title: "Construction complete — exit Build Mode",
      body:
        "Use Done / Save and Return. Facility time returns to its previous pause state.",
      target: "exit-build-mode",
      targetSelector: ".build-mode-toggle",
    });
  }

  if (examRoomBuilt && progression.eligible) {
    if (acknowledged("advance-level")) {
      return null;
    }
    return step({
      id: "advance-level",
      eyebrow: "Level 0 tutorial · Final step",
      title: "All Level 0 goals are complete",
      body:
        "Select Advance to Level 1 in the Goals panel. The game will never promote you automatically.",
      flavor:
        "The bureaucracy accepts your progress. Try not to look surprised.",
      target: "level-up",
      targetSelector: ".goals-panel .level-up-button",
    });
  }

  if (examRoomBuilt && !acknowledged("remaining-goals")) {
    return step({
      id: "remaining-goals",
      eyebrow: "Level 0 tutorial · Goals",
      title: "One or more goals still need attention",
      body:
        "Check the Goals panel. Continue answering questions for XP, and keep satisfaction above the requirement.",
      target: "goals",
      targetSelector: ".goals-panel",
    });
  }

  return null;
}

function createLevelZeroTutorialStepView(
  input: TutorialViewInput,
): TutorialStepView | null {
  const {
    state,
    introDismissed,
    acknowledgedStepIds,
    summaryVisible = false,
  } = input;
  const acknowledged = (id: TutorialStepView["id"]): boolean =>
    (id === "alerts-tour" &&
      state.alertHumor.alertsTutorialAcknowledgedAtTick !== null) ||
    acknowledgedStepIds.has(`${state.campaignId}:${id}`);
  const first = state.encounters[TUTORIAL_ENCOUNTER_ID];
  if (!first) {
    return null;
  }

  if (!acknowledged("first-patient-arriving")) {
    return step({
      id: "first-patient-arriving",
      eyebrow: "Level 0 tutorial · Arrival",
      title: "Your first patient is walking to check-in",
      body:
        "Patients begin outside the clinic. Their chart becomes available after they reach the Front Desk and check in.",
      flavor:
        "The clinic has acquired both a patient and a reason to look busy.",
      target: "facility-clock",
      targetSelector: ".facility-time-chip",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (first.firstOpenedAtTick === null) {
    if (first.patientMovement?.kind === "arriving_for_check_in") {
      return null;
    }
    const openingId = introDismissed ? "open-first-chart" : "welcome";
    if (acknowledged(openingId)) {
      return null;
    }
    return step({
      id: openingId,
      eyebrow: "Level 0 tutorial · Step 1",
      title: "Open your first patient chart",
      body: "",
      target: "waiting-patient",
      targetSelector:
        ".patient-folder.is-waiting .patient-tab.is-tutorial-target",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (!acknowledged("first-decision")) {
    return step({
      id: "first-decision",
      eyebrow: "Level 0 tutorial · Step 2",
      title: "Read across the chart, then choose",
      body: "",
      flavor:
        "A bold new era of clicking the thing the chart explicitly says has begun.",
      target: "answer-choices",
      targetSelector: ".chart-step-column.is-current .answer-list",
      avoidSelector: ".chart-panel",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (first.answers.length === 0) {
    return null;
  }

  if (!acknowledged("first-feedback")) {
    return step({
      id: "first-feedback",
      eyebrow: "Level 0 tutorial · Decision feedback",
      title: "Review the decision result",
      body:
        "The chart locks your answer, explains the result, shows the XP earned, and states what happens next.",
      flavor:
        "You solved this tutorial patient. Your clinical decision making is truly godlike.",
      target: "chart-feedback",
      targetSelector: ".chart-step-feedback",
      avoidSelector: ".chart-panel",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (!first.terminalFeedback?.acknowledged) {
    return null;
  }

  if (!acknowledged("first-encounter-summary")) {
    return step({
      id: "first-encounter-summary",
      eyebrow: "Level 0 tutorial · Encounter complete",
      title: "Review the encounter summary",
      body:
        "Decisions Correct, Encounter Payment, and Encounter XP are recorded separately. This first tutorial encounter awards 20 XP.",
      target: "encounter-summary",
      targetSelector: ".chart-reward-banner",
      avoidSelector: ".chart-panel",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (!acknowledged("flip-first-chart")) {
    return step({
      id: "flip-first-chart",
      eyebrow: "Level 0 tutorial · Learning summary",
      title: "Flip for More Disease Information",
      body:
        "Use the real chart button to read the brief disease and management summary on the back.",
      target: "flip-chart",
      targetSelector: ".chart-flip-button",
      avoidSelector: ".chart-panel",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (first.lifecycle !== "resolved") {
    if (!summaryVisible) {
      return null;
    }
    if (!acknowledged("resolve-first-chart")) {
      return step({
        id: "resolve-first-chart",
        eyebrow: "Level 0 tutorial · File the chart",
        title: "Resolve Completed Chart",
        body:
          "Select the real Resolve Completed Chart button to move this encounter into the Resolved filing cabinet.",
        target: "resolve-chart",
        targetSelector: ".chart-resolve-button",
        avoidSelector: ".chart-panel",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    return null;
  }

  const second = state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID];
  if (!acknowledged("between-tutorial-patients")) {
    return step({
      id: "between-tutorial-patients",
      eyebrow: "Level 0 tutorial · Between patients",
      title: "Use quiet moments around the clinic",
      body:
        "Facility time keeps moving between patients. You can review goals, respond to alerts, clean visible litter, refill an empty water cooler, or use the GLP-1 consult when it is available.",
      flavor:
        "Silence in a clinic is either a gift or a scheduling problem.",
      target: "waiting-actions",
      targetSelector: ".patient-rail-column",
    });
  }

  if (!second) {
    return null;
  }

  if (!acknowledged("second-patient-arriving")) {
    return step({
      id: "second-patient-arriving",
      eyebrow: "Level 0 tutorial · Second patient",
      title: `${second.patientDisplayName} is walking to check-in`,
      body:
        "This patient will demonstrate a plan that consumes facility time and unlocks a later decision.",
      flavor:
        "The quiet interval has concluded due to incoming healthcare.",
      target: "facility-clock",
      targetSelector: ".facility-time-chip",
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (second.firstOpenedAtTick === null) {
    if (second.patientMovement?.kind === "arriving_for_check_in") {
      return null;
    }
    if (acknowledged("open-second-chart")) {
      return null;
    }
    return step({
      id: "open-second-chart",
      eyebrow: "Level 0 tutorial · Step 3",
      title: "Open the second patient chart",
      body:
        "The chart is available now that the patient has checked in.",
      target: "waiting-patient",
      targetSelector:
        ".patient-folder.is-waiting .patient-tab.is-tutorial-target",
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (!acknowledged("second-first-decision")) {
    return step({
      id: "second-first-decision",
      eyebrow: "Level 0 tutorial · Timed care",
      title: "Choose the first plan",
      body:
        "A duration such as 10 minutes means ten minutes on the facility clock. Pause freezes it; 2× and 4× make those facility minutes pass faster.",
      note:
        "Several choices may take time. The duration describes workflow, not whether an answer is correct.",
      target: "answer-choices",
      targetSelector: ".chart-step-column.is-current .answer-list",
      avoidSelector: ".chart-panel",
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (second.answers.length === 0) {
    return null;
  }

  const secondFirstStep = second.steps[0];
  if (secondFirstStep?.status === "feedback_pending") {
    if (!acknowledged("second-plan-feedback")) {
      return step({
        id: "second-plan-feedback",
        eyebrow: "Level 0 tutorial · Enact the plan",
        title: "Review the answer before care begins",
        body:
          "After reading the feedback, use the real Enact Plan button. The patient will physically leave for the timed service.",
        target: "chart-feedback",
        targetSelector: ".chart-step-feedback",
        avoidSelector: ".chart-panel",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    return null;
  }

  if (second.lifecycle === "active_pending_result") {
    const remaining = Math.max(
      0,
      (second.pendingResult?.dueTick ?? state.facilityTick) -
        state.facilityTick,
    );
    if (!acknowledged("second-sendout-wait")) {
      return step({
        id: "second-sendout-wait",
        eyebrow: "Level 0 tutorial · Facility time",
        title: "The patient is away for the timed service",
        body:
          "The chart remains in Existing Patients while the patient travels, completes the service, returns, and checks in. The next decision is not available before that return.",
        note: `${formatMinutes(remaining)} remain on the facility clock.`,
        flavor:
          "The patient has left the building. The chart, naturally, remains.",
        target: "facility-clock",
        targetSelector: ".facility-time-chip",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    return null;
  }

  if (second.currentNodeIndex > 0 && second.answers.length === 1) {
    if (!acknowledged("second-result-ready")) {
      return step({
        id: "second-result-ready",
        eyebrow: "Level 0 tutorial · Result returned",
        title: "The returning patient is ready",
        body:
          "The same chart now has one exclamation point. Open it to review the returned result and continue.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (
      state.openChartEncounterId === SECOND_TUTORIAL_ENCOUNTER_ID &&
      !acknowledged("second-follow-up-decision")
    ) {
      return step({
        id: "second-follow-up-decision",
        eyebrow: "Level 0 tutorial · Follow-up decision",
        title: "The result unlocked the next decision",
        body:
          "The previous decision remains reviewable in its collapsed row. Make the newly available decision.",
        target: "answer-choices",
        targetSelector: ".chart-step-column.is-current .answer-list",
        avoidSelector: ".chart-panel",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    return null;
  }

  if (second.answers.length > 1) {
    if (!second.terminalFeedback?.acknowledged) {
      if (!acknowledged("second-final-feedback")) {
        return step({
          id: "second-final-feedback",
          eyebrow: "Level 0 tutorial · Final feedback",
          title: "Review the final decision",
          body:
            "The last answer completes the encounter. Read its explanation, then use the real Dismiss button.",
          target: "chart-feedback",
          targetSelector: ".chart-step-feedback",
          avoidSelector: ".chart-panel",
          patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
        });
      }
      return null;
    }
    if (!acknowledged("resolve-second-chart")) {
      return step({
        id: "resolve-second-chart",
        eyebrow: "Level 0 tutorial · Complete",
        title: "Resolve the second chart",
        body:
          "File the completed chart when you are finished reviewing it.",
        flavor:
          "The chart is signed. Medico-legally, time may resume.",
        target: "resolve-chart",
        targetSelector: ".chart-resolve-button",
        avoidSelector: ".chart-panel",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
  }

  if (second.lifecycle !== "resolved") {
    return null;
  }

  if (!acknowledged("alerts-tour")) {
    return step({
      id: "alerts-tour",
      eyebrow: "Level 0 tutorial · Alerts and Events",
      title: "Alerts explain what the clinic needs",
      body:
        "This feed reports clinic updates. An exclamation point marks something that requires attention; selecting a patient alert opens the relevant chart.",
      flavor:
        "The clinic has begun communicating through small rectangles. Management.",
      target: "alerts",
      targetSelector: ".event-message-board",
    });
  }

  return createLevelZeroBuildTutorialStepView(input);
}

/**
 * Derives the next tutorial bubble entirely from durable game state plus a
 * small set of UI-only acknowledgments. Gameplay actions advance the tutorial;
 * the tutorial never owns a second copy of campaign progress.
 */
export function createTutorialStepView({
  state,
  tutorialsEnabled,
  introDismissed,
  acknowledgedStepIds,
  buildMode,
  selectedRoomDefinitionId,
  selectedRoomInstanceId = null,
  summaryVisible = false,
}: TutorialViewInput): TutorialStepView | null {
  if (!tutorialsEnabled) {
    return null;
  }

  if (state.facilityLevel >= 1) {
    const routineEncounters = Object.values(state.encounters)
      .filter((encounter) => encounter.arrivalClass === "routine")
      .sort(
        (left, right) =>
          left.waiting.arrivedAtTick - right.waiting.arrivedAtTick ||
          left.id.localeCompare(right.id),
      );
    const firstRoutineEncounter = routineEncounters[0] ?? null;
    const serviceTutorialEncounter = routineEncounters.find(
      (encounter) =>
        encounter.frozenCase.decisionNodes.some(
          (node) => node.resultGateAfter !== null,
        ),
    );
    const pendingSendout =
      serviceTutorialEncounter?.lifecycle === "active_pending_result" &&
      serviceTutorialEncounter.currentNodeIndex === 0
        ? serviceTutorialEncounter
        : null;
    const returnedResult =
      serviceTutorialEncounter?.lifecycle ===
        "active_action_required" &&
      serviceTutorialEncounter.currentNodeIndex === 1 &&
      serviceTutorialEncounter.deliveredResultNarratives.length > 0
        ? serviceTutorialEncounter
        : null;
    const openServiceDrill =
      serviceTutorialEncounter?.id === state.openChartEncounterId &&
      serviceTutorialEncounter.lifecycle === "active_action_required" &&
      serviceTutorialEncounter.answers.length === 0 &&
      serviceTutorialEncounter.frozenCase.id.startsWith(
        "case.synthetic.",
      )
        ? serviceTutorialEncounter
        : null;
    const serviceFeedbackPending =
      serviceTutorialEncounter?.steps[
        serviceTutorialEncounter.currentNodeIndex
      ]?.status === "feedback_pending"
        ? serviceTutorialEncounter
        : null;

    if (serviceFeedbackPending) {
      if (state.openChartEncounterId !== serviceFeedbackPending.id) {
        return step({
          id: "level-one-service-drill",
          eyebrow: "Level 1 guide · Decision feedback",
          title: "Reopen the chart to continue the service plan",
          body:
            "The scored answer is locked. Reopen the highlighted Existing Patient chart to review the explanation.",
          target: "existing-patient",
          targetSelector:
            ".patient-folder.is-active .patient-tab.is-tutorial-target",
          patientEncounterId: serviceFeedbackPending.id,
        });
      }
      return step({
        id: "level-one-service-drill",
        eyebrow: "Level 1 guide · Decision feedback",
        title: "Review the result before care continues",
        body:
          "The chart shows whether the decision was correct, the XP earned, and the plan that will occur next. Click the real chart button when you are ready.",
        target: "chart-feedback",
        targetSelector:
          ".chart-action-buttons .button.button-primary",
        avoidSelector: ".chart-panel",
        patientEncounterId: serviceFeedbackPending.id,
      });
    }

    if (
      pendingSendout
    ) {
      const remaining = Math.max(
        0,
        (pendingSendout.pendingResult?.dueTick ?? state.facilityTick) -
          state.facilityTick,
      );
      return step({
        id: "level-one-sendout-wait",
        eyebrow: "Level 1 guide · New mechanic",
        title: "Send-out testing takes facility time",
        body:
          `${pendingSendout.patientDisplayName} moved to Existing Patients while the off-site service runs. Keep the clinic clock running; you may treat someone else while you wait.`,
      note:
          `${formatMinutes(remaining)} remain on the facility clock.`,
        flavor:
          "The patient has left the building. The chart, naturally, remains.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: pendingSendout.id,
      });
    }

    if (returnedResult) {
      if (state.openChartEncounterId !== returnedResult.id) {
        return step({
          id: "level-one-result-ready",
          eyebrow: "Level 1 guide · Result returned",
          title: "The send-out result is ready",
          body:
            `${returnedResult.patientDisplayName} now has an exclamation point in Existing Patients. Click that real patient tab to review the result and continue the encounter.`,
          target: "existing-patient",
          targetSelector:
            ".patient-folder.is-active .patient-tab.is-tutorial-target",
          patientEncounterId: returnedResult.id,
        });
      }
      return step({
        id: "level-one-returned-result",
        eyebrow: "Level 1 guide · Result returned",
        title: "The result added the next chart step",
        body:
          "The earlier decision stays visible, and the returned result appears beside the newly unlocked question. Answer using the real choices in the chart.",
        flavor:
          "The lab has converted waiting into another decision.",
        target: "answer-choices",
        targetSelector:
          ".chart-step-column.is-current .answer-list",
        avoidSelector: ".chart-panel",
        patientEncounterId: returnedResult.id,
      });
    }

    if (openServiceDrill) {
      return step({
        id: "level-one-service-drill",
        eyebrow: "Level 1 guide · Practice workflow",
        title: "This artificial patient demonstrates service routing",
        body:
          "The token wording is intentionally simple: this encounter exists to teach ordering a test, waiting for its return, and acting on the result. Test choices show their facility-time estimate.",
        note:
          "Choose through the real answer buttons. The guide will not select or fast-forward anything for you.",
        target: "answer-choices",
        targetSelector:
          ".chart-step-column.is-current .answer-list",
        avoidSelector: ".chart-panel",
        patientEncounterId: openServiceDrill.id,
      });
    }

    if (
      firstRoutineEncounter?.lifecycle === "waiting_unopened" &&
      firstRoutineEncounter.firstOpenedAtTick === null
    ) {
      if (
        firstRoutineEncounter.patientMovement?.kind ===
        "arriving_for_check_in"
      ) {
        return step({
          id: "level-one-first-arrival",
          eyebrow: "Level 1 guide · First routine patient",
          title: "A patient is walking to check-in",
          body:
            "Patients now enter through the sidewalk and front door. The Waiting chart becomes actionable after check-in.",
          target: "facility-clock",
          targetSelector: ".facility-time-chip",
          patientEncounterId: firstRoutineEncounter.id,
        });
      }
      if (
        firstRoutineEncounter.patientMovement?.kind ===
        "walking_to_care"
      ) {
        return step({
          id: "level-one-service-drill",
          eyebrow: "Level 1 guide · Patient movement",
          title: "The patient is walking to the care area",
          body:
            "The chart remains open, but the first decision unlocks only after the patient reaches care.",
          target: "chart",
          targetSelector: ".chart-panel",
          avoidSelector: ".chart-panel",
          patientEncounterId: firstRoutineEncounter.id,
        });
      }
      return step({
        id: "level-one-first-arrival",
        eyebrow: "Level 1 guide · First routine patient",
        title: "Level 1 patients arrive through the Waiting list",
        body:
          "This begins the repeatable clinic loop. Click the highlighted patient tab itself; after this first arrival, ordinary patient handling is up to you.",
        target: "waiting-patient",
        targetSelector:
          ".patient-folder.is-waiting .patient-tab.is-tutorial-target",
        patientEncounterId: firstRoutineEncounter.id,
      });
    }

    if (firstRoutineEncounter) {
      return null;
    }

    const remaining = Math.max(
      0,
      state.nextRoutineArrivalTick - state.facilityTick,
    );
    if (
      acknowledgedStepIds.has(
        `${state.campaignId}:level-one-ready`,
      )
    ) {
      return null;
    }
    return step({
      id: "level-one-ready",
      eyebrow: "Level 0 tutorial · Complete",
      title: state.paused
        ? "Resume facility time to begin Level 1"
        : "Your first Level 1 patient is on the way",
      body:
        state.paused
          ? "Routine patients arrive only while facility time advances. Click the real Resume control above, then watch the Waiting list."
          : "Facility time is running. A routine patient will appear in Waiting when the arrival interval elapses.",
      note:
        `${formatMinutes(remaining)} until the next planned arrival.`,
      flavor:
        "You have leveled up. The patients did not become simpler.",
      target: "facility-clock",
      targetSelector: state.paused
        ? ".pause-button"
        : ".facility-time-chip",
      primaryAction: {
        id: "acknowledge-step",
        label: "Close tutorial",
      },
    });
  }

  return createLevelZeroTutorialStepView({
    state,
    tutorialsEnabled,
    introDismissed,
    acknowledgedStepIds,
    buildMode,
    selectedRoomDefinitionId,
    selectedRoomInstanceId,
    summaryVisible,
  });

  /*
   * Legacy Level 0 derivation retained temporarily below for audit history.
   * The milestone-driven implementation above is now authoritative.
   *
  const first = state.encounters[TUTORIAL_ENCOUNTER_ID];
  if (!first) {
    return null;
  }

  if (
    first.patientMovement?.kind === "arriving_for_check_in"
  ) {
    return step({
      id: "first-patient-arriving",
      eyebrow: "Level 0 tutorial · Arrival",
      title: "Your first patient is walking to check-in",
      body:
        "Watch the patient enter at the front desk. The chart becomes available after check-in.",
      flavor:
        "The clinic has acquired both a patient and a reason to look busy.",
      target: "facility-clock",
      targetSelector: ".facility-time-chip",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (
    first.patientMovement?.kind === "walking_to_care"
  ) {
    return step({
      id: "first-patient-walking-to-care",
      eyebrow: "Level 0 tutorial · Patient movement",
      title: "The patient is walking to the care area",
      body:
        "The clinical decision unlocks when the patient reaches the destination. Normal walking does not reduce patient satisfaction.",
      flavor:
        "Healthcare has briefly become a pathfinding problem.",
      target: "chart",
      targetSelector: ".chart-panel",
      avoidSelector: ".chart-panel",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (
    first.lifecycle === "waiting_unopened" &&
    first.firstOpenedAtTick === null
  ) {
    if (!introDismissed) {
      return step({
        id: "welcome",
        eyebrow: "Level 0 tutorial · Step 1",
        title: "Open your first patient chart",
        body: "",
        target: "waiting-patient",
        targetSelector: ".patient-folder.is-waiting .patient-tab",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    return step({
      id: "open-first-chart",
      eyebrow: "Level 0 tutorial · Step 1",
      title: "Open your first patient chart",
      body: "",
      target: "waiting-patient",
      targetSelector:
        ".patient-folder.is-waiting .patient-tab.is-tutorial-target",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (
    first.lifecycle === "active_action_required" &&
    first.currentNodeIndex === 0 &&
    first.answers.length === 0
  ) {
    if (state.openChartEncounterId !== TUTORIAL_ENCOUNTER_ID) {
      return step({
        id: "reopen-first-chart",
        eyebrow: "Level 0 tutorial · Step 2",
        title: "Reopen Pixel Patient's chart",
        body:
          "Closing a chart does not lose the patient. It slides into Existing Patients until you are ready to continue.",
        flavor:
          "The chart has respectfully declined to diagnose itself.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    return step({
      id: "first-decision",
      eyebrow: "Level 0 tutorial · Step 3",
      title: "Read across the chart, then choose",
      body: "",
      flavor:
        "A bold new era of clicking the thing the chart explicitly says has begun.",
      target: "answer-choices",
      targetSelector:
        ".chart-step-column.is-current .answer-list",
      avoidSelector: ".chart-panel",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (
    first.steps[first.currentNodeIndex]?.status ===
    "feedback_pending"
  ) {
    if (state.openChartEncounterId !== TUTORIAL_ENCOUNTER_ID) {
      return step({
        id: "reopen-first-feedback",
        eyebrow: "Level 0 tutorial · Decision feedback",
        title: "Reopen the chart to continue",
        body:
          "The submitted decision is saved. Reopen Pixel Patient from Existing Patients to review the result.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    return step({
      id: "first-feedback",
      eyebrow: "Level 0 tutorial · Decision feedback",
      title: "Read what your decision did",
      body:
        "The result, explanation, XP, and next step are shown in the chart. Click the real Continue button when you are ready.",
      target: "chart-feedback",
      targetSelector:
        ".chart-action-buttons .button.button-primary",
      avoidSelector: ".chart-panel",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (first.lifecycle === "active_pending_result") {
    const remaining = Math.max(
      0,
      (first.pendingResult?.dueTick ?? state.facilityTick) -
        state.facilityTick,
    );
    return step({
      id: "off-site-result",
      eyebrow: "Level 0 tutorial · Step 4",
      title: "The patient left for an off-site result",
      body:
        "Pending patients move to Existing Patients while facility time passes. When the result returns, the chart receives a new exclamation point and the next decision unlocks.",
      note:
        `${formatMinutes(remaining)} remain. This short training result returns after a brief pause.`,
      target: "existing-patient",
      targetSelector:
        ".patient-folder.is-active .patient-tab.is-tutorial-target",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (
    first.lifecycle === "active_action_required" &&
    first.currentNodeIndex > 0 &&
    first.answers.length === 1
  ) {
    if (state.openChartEncounterId !== TUTORIAL_ENCOUNTER_ID) {
      return step({
        id: "results-ready",
        eyebrow: "Level 0 tutorial · Step 5",
        title: "The result is ready",
        body:
          "The exclamation point moved to Pixel Patient in Existing Patients. Reopen that chart to make the follow-up decision.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    return step({
      id: "follow-up-decision",
      eyebrow: "Level 0 tutorial · Step 6",
      title: "The new result created a second decision",
      body:
        "The returned result appears beside the earlier decision. Choose the next action.",
      target: "answer-choices",
      targetSelector:
        ".chart-step-column.is-current .answer-list",
      avoidSelector: ".chart-panel",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (first.lifecycle === "resolved_summary_available") {
    if (state.openChartEncounterId !== TUTORIAL_ENCOUNTER_ID) {
      return step({
        id: "reopen-first-feedback",
        eyebrow: "Level 0 tutorial · Step 7",
        title: "Reopen the chart to finish the learning loop",
        body:
          "Pixel Patient remains in Existing Patients until you review the answer feedback and resolve the chart.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (!first.terminalFeedback?.acknowledged) {
      return step({
        id: "first-feedback",
        eyebrow: "Level 0 tutorial · Step 7",
        title: "Read the feedback, then use the chart button",
        body:
          "The explanation closes the learning loop. When you have read it, click the real Continue to summary button at the bottom of the chart.",
        target: "chart-feedback",
        targetSelector:
          ".chart-action-buttons .button.button-primary",
        avoidSelector: ".chart-panel",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    return step({
      id: "resolve-first-chart",
      eyebrow: "Level 0 tutorial · Step 8",
      title: "Resolve the completed chart",
      body:
        "You can flip the chart for its learning summary, then select Resolve chart to file it and clear the active queue.",
      flavor:
        "You solved this nonsensical tutorial patient. Your clinical decision making is truly godlike.",
      target: "resolve-chart",
      targetSelector:
        ".chart-action-buttons .button.button-primary",
      avoidSelector: ".chart-panel",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
    });
  }

  const second = state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID];
  if (!second) {
    return step({
      id: "between-tutorial-patients",
      eyebrow: "Level 0 tutorial · Between patients",
      title: "The clinic is quiet for a moment",
      body:
        "Wait for the next patient to walk into the clinic. Facility time continues while the game is running.",
      flavor:
        "Enjoy this rare operational condition while it remains available.",
      target: "facility-clock",
      targetSelector: ".facility-time-chip",
    });
  }

  if (second.patientMovement?.kind === "arriving_for_check_in") {
    return step({
      id: "second-patient",
      eyebrow: "Level 0 tutorial · Between patients",
      title: "The next patient is walking to check-in",
      body:
        "Watch the patient enter. Their chart becomes actionable after check-in.",
      flavor:
        "The quiet interval has concluded due to incoming healthcare.",
      target: "facility-clock",
      targetSelector: ".facility-time-chip",
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (second.patientMovement?.kind === "walking_to_care") {
    return step({
      id: "second-decision",
      eyebrow: "Level 0 tutorial · Patient movement",
      title: "Morgan Thread is walking to care",
      body:
        "The chart remains open. The decision unlocks when the patient reaches the destination.",
      target: "chart",
      targetSelector: ".chart-panel",
      avoidSelector: ".chart-panel",
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (
    second.lifecycle === "waiting_unopened" &&
    second.firstOpenedAtTick === null
  ) {
    return step({
      id: "second-patient",
      eyebrow: "Level 0 tutorial · Step 9",
      title: "A second patient has arrived",
      body: "Open the highlighted patient chart.",
      flavor:
        "Repetition is how expertise forms and how software demos become suspiciously long.",
      target: "waiting-patient",
      targetSelector:
        ".patient-folder.is-waiting .patient-tab.is-tutorial-target",
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (
    second.lifecycle === "active_action_required" &&
    second.answers.length === 0
  ) {
    if (
      state.openChartEncounterId !== SECOND_TUTORIAL_ENCOUNTER_ID
    ) {
      return step({
        id: "reopen-second-chart",
        eyebrow: "Level 0 tutorial · Step 10",
        title: "Reopen Morgan Thread's chart",
        body:
          "The patient is still active. Reopen the chart from Existing Patients to make the pending decision.",
        flavor:
          "Closing the tab successfully moved the question somewhere else.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    return step({
      id: "second-decision",
      eyebrow: "Level 0 tutorial · Step 10",
      title: "Make the scored clinical decision",
      body: "Choose the answer supported by the chart.",
      target: "answer-choices",
      targetSelector:
        ".chart-step-column.is-current .answer-list",
      avoidSelector: ".chart-panel",
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (second.lifecycle === "resolved_summary_available") {
    if (
      state.openChartEncounterId !== SECOND_TUTORIAL_ENCOUNTER_ID
    ) {
      return step({
        id: "reopen-second-feedback",
        eyebrow: "Level 0 tutorial · Step 11",
        title: "Reopen the chart to review the result",
        body:
          "Morgan Thread remains in Existing Patients until the teaching feedback is reviewed and the chart is filed.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (!second.terminalFeedback?.acknowledged) {
      return step({
        id: "second-feedback",
        eyebrow: "Level 0 tutorial · Step 11",
        title: "Read the feedback, then continue in the chart",
        body:
          "The feedback explains the tested point and records it in this campaign's learning history. Click the real Continue to summary button when ready.",
        target: "chart-feedback",
        targetSelector:
          ".chart-action-buttons .button.button-primary",
        avoidSelector: ".chart-panel",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    return step({
      id: "resolve-second-chart",
      eyebrow: "Level 0 tutorial · Step 12",
      title: "File the second chart",
      body:
        "Select Resolve chart. Completed charts move into the Resolved filing cabinet, newest first.",
      flavor:
        "The chart is signed. Medico-legally, time may resume.",
      target: "resolve-chart",
      targetSelector:
        ".chart-action-buttons .button.button-primary",
      avoidSelector: ".chart-panel",
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
    });
  }

  if (second.lifecycle !== "resolved") {
    return null;
  }

  const examRoom = state.rooms.find(
    (room) => room.roomDefinitionId === "room.examination",
  );
  const examRoomBuilt = examRoom !== undefined;
  const progression = getFacilityProgressionStatus(state);
  const facilityAccess = getFacilityAccessValidation(state);

  if (!examRoomBuilt && !buildMode) {
    return step({
      id: "enter-build-mode",
      eyebrow: "Level 0 tutorial · Step 13",
      title: "Your remaining goal needs an examination room",
      body:
        "A patient would prefer not to discuss private health information at the front desk. Check the Goals panel, then enter Build Mode and add an Examination Room.",
      note:
        "Build Mode pauses facility time so patients do not age into fossils while you remodel.",
      flavor:
        "Architecture: medicine's least reimbursable procedure.",
      target: "build-mode",
      targetSelector: ".build-mode-trigger",
    });
  }

  if (!examRoomBuilt && buildMode) {
    if (selectedRoomDefinitionId !== "room.examination") {
      return step({
        id: "select-exam-room",
        eyebrow: "Level 0 tutorial · Step 15",
        title: "Select the Examination Room",
        body:
          "The room card shows its price and footprint. Select it to attach a placement outline to your pointer.",
        target: "exam-room-option",
        targetSelector:
          "[data-room-definition-id='room.examination']",
      });
    }
    return step({
      id: "place-exam-room",
      eyebrow: "Level 0 tutorial · Step 16",
      title: "Place the room beside the clinic",
      body:
        "Move the outlined room beside the Front Desk. Rooms may connect directly to other rooms or to hallways.",
      note:
        "A valid outline confirms the footprint can be built. Click the facility to place it; you will add its door next.",
      target: "facility-placement",
      targetSelector: ".facility-host",
    });
  }

  if (
    examRoom &&
    buildMode &&
    facilityAccess.unreachableRoomIds.includes(examRoom.id)
  ) {
    if (selectedRoomInstanceId !== examRoom.id) {
      return step({
        id: "select-exam-room-for-door",
        eyebrow: "Level 0 tutorial · Step 17",
        title: "Select the new Examination Room",
        body:
          "Click the room you just placed. Its renovation tools will open on the desk.",
        flavor:
          "Four walls have been acquired. Access remains aspirational.",
        target: "room-selection",
        targetSelector: ".facility-host",
      });
    }
    return step({
      id: "place-exam-room-door",
      eyebrow: "Level 0 tutorial · Step 18",
      title: "Add a zero-cost door",
      body:
        "Choose an enabled wall slot in Doors. The door must connect the Examination Room to the Front Desk, another reachable room, or a hallway.",
      note:
        "If every slot is blocked, move the room until one wall touches a reachable space. The exact reason Build Mode cannot close appears beside Done / Save and Return.",
      flavor:
        "The clinic has discovered that walls are excellent at preventing healthcare.",
      target: "door-tool",
      targetSelector: ".selected-room-inspector .door-tool",
      avoidSelector: ".door-slot-grid",
    });
  }

  if (examRoomBuilt && buildMode) {
    return step({
      id: "exit-build-mode",
      eyebrow: "Level 0 tutorial · Step 19",
      title: "Construction complete — exit Build Mode",
      body:
        "Use the same mode button to leave construction. Facility time returns to the pause state it had before you started building.",
      target: "exit-build-mode",
      targetSelector: ".build-mode-toggle",
    });
  }

  if (examRoomBuilt && progression.eligible) {
    return step({
      id: "advance-level",
      eyebrow: "Level 0 tutorial · Final step",
      title: "All Level 0 goals are complete",
      body:
        "Select Advance to Level 1 in the Goals panel. Leveling is deliberate; the game will never quietly promote you while you are still looking at the clinic.",
      flavor:
        "The bureaucracy accepts your progress. Try not to look surprised.",
      target: "level-up",
      targetSelector: ".goals-panel .level-up-button",
    });
  }

  if (examRoomBuilt) {
    return step({
      id: "remaining-goals",
      eyebrow: "Level 0 tutorial · Goals",
      title: "One or more goals still need attention",
      body:
        "Check the Goals panel. Continue answering questions for XP, and keep satisfaction above the requirement.",
      target: "goals",
      targetSelector: ".goals-panel",
    });
  }

  return null;
  */
}
