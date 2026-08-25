import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  getAnswerChoiceServicePreview,
  getFacilityAccessValidation,
  getFacilityProgressionStatus,
  type GameState,
} from "@gamify-surgery/game-domain";

export type TutorialActionId =
  | "open-first-chart"
  | "focus-first-chart"
  | "complete-tutorial"
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
  | "facility-entrance"
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
    | "dismiss-first-feedback"
    | "first-encounter-summary"
    | "flip-first-chart"
    | "resolve-first-chart"
    | "reopen-first-summary"
    | "between-tutorial-patients"
    | "second-patient"
    | "second-patient-arriving"
    | "open-second-chart"
    | "second-first-decision"
    | "second-plan-feedback"
    | "reopen-second-plan-feedback"
    | "enact-second-plan"
    | "second-sendout-wait"
    | "second-result-ready"
    | "second-follow-up-decision"
    | "second-final-feedback"
    | "dismiss-second-feedback"
    | "reopen-second-summary"
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
    | "level-one-resume-time"
    | "level-one-await-first-arrival";
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
      targetSelector:
        "[data-tutorial-anchor='enter-build-mode']",
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
        targetSelector:
          "[data-tutorial-anchor='facility-surface']",
      });
    }
    return null;
  }

  if (
    examRoom &&
    buildMode &&
    facilityAccess.unreachableRoomIds.includes(examRoom.id)
  ) {
    if (selectedRoomInstanceId !== examRoom.id) {
      if (!acknowledged("select-exam-room-for-door")) {
        return step({
          id: "select-exam-room-for-door",
          eyebrow: "Level 0 tutorial · Door access",
          title: "Select the new Examination Room",
          body:
            "Click the room you just placed. Its renovation tools will open on the desk.",
          flavor:
            "Four walls have been acquired. Access remains aspirational.",
          target: "room-selection",
          targetSelector:
            "[data-tutorial-anchor='facility-surface']",
        });
      }
      return null;
    }
    if (!acknowledged("place-exam-room-door")) {
      return step({
        id: "place-exam-room-door",
        eyebrow: "Level 0 tutorial · Door access",
        title: "Add a zero-cost door",
        body:
          "Toggle Place Door, then click an emphasized eligible wall. Doors connect rooms to reachable rooms or hallways. Remove Door similarly highlights the doors you can click to remove.",
        note:
          "Done / Save opens a modal listing every problem that must be corrected.",
        flavor:
          "The clinic has discovered that walls are excellent at preventing healthcare.",
        target: "door-tool",
        targetSelector: "[data-tutorial-anchor='place-door']",
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
        "Use Done / Save. Facility time returns to its previous pause state.",
      target: "exit-build-mode",
      targetSelector: "[data-tutorial-anchor='build-done']",
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

  /*
   * Keep the arrival explanation on screen until the player acknowledges it.
   * Character travel is deliberately brief at the shared walking speed, so
   * deriving this bubble solely from the live movement kind could replace it
   * before the player had time to read or acknowledge it.
   */
  if (
    first.firstOpenedAtTick === null &&
    !acknowledged("first-patient-arriving")
  ) {
    return step({
      id: "first-patient-arriving",
      eyebrow: "Level 0 tutorial · Arrival",
      title: "Your first patient is entering the clinic",
      body:
        "Patients arrive through the entrance. Their chart becomes available after they reach the Front Desk and check in.",
      flavor:
        "The clinic has acquired both a patient and a reason to look busy.",
      target: "facility-entrance",
      targetSelector: "[data-tutorial-anchor='facility-entrance']",
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

  if (first.answers.length === 0) {
    if (state.openChartEncounterId !== TUTORIAL_ENCOUNTER_ID) {
      if (acknowledged("reopen-first-chart")) {
        return null;
      }
      return step({
        id: "reopen-first-chart",
        eyebrow: "Level 0 tutorial · Patient chart",
        title: "Reopen the first patient chart",
        body:
          "The patient remains in Existing Patients. Reopen the highlighted chart to make the pending decision.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
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
        targetSelector:
          "[data-tutorial-anchor='current-answer-choices']",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    return null;
  }

  if (first.lifecycle !== "resolved") {
    const feedbackOutstanding =
      !acknowledged("first-feedback") ||
      !first.terminalFeedback?.acknowledged;
    if (state.openChartEncounterId !== TUTORIAL_ENCOUNTER_ID) {
      if (feedbackOutstanding) {
        if (acknowledged("reopen-first-feedback")) {
          return null;
        }
        return step({
          id: "reopen-first-feedback",
          eyebrow: "Level 0 tutorial · Decision feedback",
          title: "Reopen the chart to review the result",
          body:
            "The scored decision is saved. Reopen the highlighted Existing Patient chart to read the feedback.",
          target: "existing-patient",
          targetSelector:
            ".patient-folder.is-active .patient-tab.is-tutorial-target",
          patientEncounterId: TUTORIAL_ENCOUNTER_ID,
        });
      }
      if (acknowledged("reopen-first-summary")) {
        return null;
      }
      return step({
        id: "reopen-first-summary",
        eyebrow: "Level 0 tutorial · Encounter complete",
        title: "Reopen the completed chart",
        body:
          "The completed encounter remains in Existing Patients until you review its summary and file it.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
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
        targetSelector:
          "[data-tutorial-anchor='current-decision-feedback']",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (!first.terminalFeedback?.acknowledged) {
      if (!acknowledged("dismiss-first-feedback")) {
        return step({
          id: "dismiss-first-feedback",
          eyebrow: "Level 0 tutorial · Continue",
          title: "Dismiss the completed decision",
          body:
            "Use the real Dismiss button to continue to the encounter summary.",
          target: "chart-feedback",
          targetSelector:
            "[data-tutorial-anchor='decision-feedback-action']",
          patientEncounterId: TUTORIAL_ENCOUNTER_ID,
        });
      }
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
        targetSelector:
          "[data-tutorial-anchor='encounter-summary']",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (!summaryVisible && !acknowledged("flip-first-chart")) {
      return step({
        id: "flip-first-chart",
        eyebrow: "Level 0 tutorial · Learning summary",
        title: "Flip for More Disease Information",
        body:
          "Use the real chart button to read the brief disease and management summary on the back.",
        target: "flip-chart",
        targetSelector: "[data-tutorial-anchor='flip-chart']",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      });
    }
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
        targetSelector: "[data-tutorial-anchor='resolve-chart']",
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
        "Facility time keeps moving between patients. The GLP-1 consult is one useful waiting-time action; you can also review goals, respond to alerts, and handle visible clinic tasks.",
      flavor:
        "Silence in a clinic is either a gift or a scheduling problem.",
      target: "waiting-actions",
      targetSelector: ".emergency-glp1-panel",
    });
  }

  if (!second) {
    return null;
  }

  if (
    second.firstOpenedAtTick === null &&
    !acknowledged("second-patient-arriving")
  ) {
    return step({
      id: "second-patient-arriving",
      eyebrow: "Level 0 tutorial · Second patient",
      title: `${second.patientDisplayName} is entering the clinic`,
      body:
        "Watch the clinic entrance. This patient will demonstrate a plan that consumes facility time and unlocks a later decision.",
      flavor:
        "The quiet interval has concluded due to incoming healthcare.",
      target: "facility-entrance",
      targetSelector: "[data-tutorial-anchor='facility-entrance']",
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

  if (second.answers.length === 0) {
    if (state.openChartEncounterId !== SECOND_TUTORIAL_ENCOUNTER_ID) {
      if (acknowledged("reopen-second-chart")) {
        return null;
      }
      return step({
        id: "reopen-second-chart",
        eyebrow: "Level 0 tutorial · Patient chart",
        title: `Reopen ${second.patientDisplayName}'s chart`,
        body:
          "The patient remains in Existing Patients. Reopen the highlighted chart to make the pending decision.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (!acknowledged("second-first-decision")) {
      const correctChoice =
        second.frozenCase.decisionNodes[0]?.answerChoices.find(
          (choice) => choice.isCorrect,
        );
      const duration = correctChoice
        ? getAnswerChoiceServicePreview(
            state,
            SECOND_TUTORIAL_ENCOUNTER_ID,
            correctChoice.id,
          )?.durationTicks
        : null;
      return step({
        id: "second-first-decision",
        eyebrow: "Level 0 tutorial · Timed care",
        title: "Choose the first plan",
        body: `A displayed duration${
          duration === null || duration === undefined
            ? ""
            : `, such as ${formatMinutes(duration)},`
        } uses the facility clock. Pause freezes it; 2× and 4× make those facility minutes pass faster.`,
        note:
          "Several choices may take time. The duration describes workflow, not whether an answer is correct.",
        target: "answer-choices",
        targetSelector:
          "[data-tutorial-anchor='current-answer-choices']",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    return null;
  }

  const secondFirstStep = second.steps[0];
  if (secondFirstStep?.status === "feedback_pending") {
    if (state.openChartEncounterId !== SECOND_TUTORIAL_ENCOUNTER_ID) {
      if (acknowledged("reopen-second-plan-feedback")) {
        return null;
      }
      return step({
        id: "reopen-second-plan-feedback",
        eyebrow: "Level 0 tutorial · Timed care",
        title: "Reopen the chart to review the plan",
        body:
          "The decision is saved. Reopen the highlighted chart to review it before the patient leaves for testing.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (!acknowledged("second-plan-feedback")) {
      return step({
        id: "second-plan-feedback",
        eyebrow: "Level 0 tutorial · Enact the plan",
        title: "Review the answer before care begins",
        body:
          "After reading the feedback, use the real Enact Plan button. The patient will physically leave for the timed service.",
        target: "chart-feedback",
        targetSelector:
          "[data-tutorial-anchor='current-decision-feedback']",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (!acknowledged("enact-second-plan")) {
      return step({
        id: "enact-second-plan",
        eyebrow: "Level 0 tutorial · Enact the plan",
        title: "Send the patient for the timed service",
        body:
          "Select the real Enact Plan button. Facility time and physical movement begin only after you enact the plan.",
        target: "chart-feedback",
        targetSelector:
          "[data-tutorial-anchor='decision-feedback-action']",
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
    if (
      state.openChartEncounterId !== SECOND_TUTORIAL_ENCOUNTER_ID &&
      !acknowledged("second-result-ready")
    ) {
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
        targetSelector:
          "[data-tutorial-anchor='current-answer-choices']",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    return null;
  }

  if (
    second.answers.length > 1 &&
    second.lifecycle !== "resolved"
  ) {
    const finalFeedbackOutstanding =
      !acknowledged("second-final-feedback") ||
      !second.terminalFeedback?.acknowledged;
    if (state.openChartEncounterId !== SECOND_TUTORIAL_ENCOUNTER_ID) {
      if (finalFeedbackOutstanding) {
        if (acknowledged("reopen-second-feedback")) {
          return null;
        }
        return step({
          id: "reopen-second-feedback",
          eyebrow: "Level 0 tutorial · Final feedback",
          title: "Reopen the chart to review the final decision",
          body:
            "The completed decision is saved. Reopen the highlighted chart to finish the encounter.",
          target: "existing-patient",
          targetSelector:
            ".patient-folder.is-active .patient-tab.is-tutorial-target",
          patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
        });
      }
      if (acknowledged("reopen-second-summary")) {
        return null;
      }
      return step({
        id: "reopen-second-summary",
        eyebrow: "Level 0 tutorial · Complete",
        title: "Reopen the completed chart",
        body:
          "The completed chart remains in Existing Patients until you file it.",
        target: "existing-patient",
        targetSelector:
          ".patient-folder.is-active .patient-tab.is-tutorial-target",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (!acknowledged("second-final-feedback")) {
      return step({
        id: "second-final-feedback",
        eyebrow: "Level 0 tutorial · Final feedback",
        title: "Review the final decision",
        body:
          "The last answer completes the encounter. Read its explanation before filing the chart.",
        target: "chart-feedback",
        targetSelector:
          "[data-tutorial-anchor='current-decision-feedback']",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      });
    }
    if (!second.terminalFeedback?.acknowledged) {
      if (!acknowledged("dismiss-second-feedback")) {
        return step({
          id: "dismiss-second-feedback",
          eyebrow: "Level 0 tutorial · Continue",
          title: "Dismiss the final decision",
          body:
            "Use the real Dismiss button to finish the encounter summary.",
          target: "chart-feedback",
          targetSelector:
            "[data-tutorial-anchor='decision-feedback-action']",
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
        targetSelector: "[data-tutorial-anchor='resolve-chart']",
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
    const acknowledged = (id: TutorialStepView["id"]): boolean =>
      acknowledgedStepIds.has(`${state.campaignId}:${id}`);
    const remaining = Math.max(
      0,
      state.nextRoutineArrivalTick - state.facilityTick,
    );
    if (state.paused) {
      if (acknowledged("level-one-resume-time")) {
        return null;
      }
      return step({
        id: "level-one-resume-time",
        eyebrow: "Level 0 tutorial · Complete",
        title: "Resume facility time to begin Level 1",
        body:
          "Routine patients arrive only while facility time advances. Use the real Resume control, then watch the clinic entrance.",
        note: `${formatMinutes(remaining)} until the next planned arrival.`,
        flavor:
          "You have leveled up. The patients did not become simpler.",
        target: "facility-clock",
        targetSelector: ".pause-button",
      });
    }
    return step({
      id: "level-one-await-first-arrival",
      eyebrow: "Level 1 guide · First routine patient",
      title: "Your first Level 1 patient is on the way",
      body:
        "Facility time is running. Watch the clinic entrance for the next patient.",
      note: `${formatMinutes(remaining)} until the next planned arrival.`,
      flavor:
        "You have leveled up. The patients did not become simpler.",
      target: "facility-clock",
      targetSelector: ".facility-time-chip",
      primaryAction: {
        id: "complete-tutorial",
        label: "Complete tutorial",
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
        "Toggle Place Door, then click an emphasized eligible wall. The door must connect the Examination Room to the Front Desk, another reachable room, or a hallway. Remove Door highlights the doors you can click to remove.",
      note:
        "If no wall is eligible, move the room until one wall touches a reachable space. The exact reason Build Mode cannot close appears beside Done / Save.",
      flavor:
        "The clinic has discovered that walls are excellent at preventing healthcare.",
      target: "door-tool",
      targetSelector: "[data-build-tool=\"place-door\"]",
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
