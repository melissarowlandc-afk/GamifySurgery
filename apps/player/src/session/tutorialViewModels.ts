import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
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
  | "chart-feedback"
  | "resolve-chart"
  | "goals"
  | "build-mode"
  | "exam-room-option"
  | "facility-placement"
  | "exit-build-mode"
  | "level-up";

export interface TutorialActionView {
  id: TutorialActionId;
  label: string;
}

export interface TutorialStepView {
  id:
    | "welcome"
    | "open-first-chart"
    | "reopen-first-chart"
    | "chart-tour"
    | "first-decision"
    | "off-site-result"
    | "results-ready"
    | "follow-up-decision"
    | "reopen-first-feedback"
    | "first-feedback"
    | "resolve-first-chart"
    | "second-patient"
    | "reopen-second-chart"
    | "second-decision"
    | "reopen-second-feedback"
    | "second-feedback"
    | "resolve-second-chart"
    | "goals-tour"
    | "enter-build-mode"
    | "select-exam-room"
    | "place-exam-room"
    | "exit-build-mode"
    | "remaining-goals"
    | "advance-level"
    | "level-one-ready";
  eyebrow: string;
  title: string;
  body: string;
  note?: string;
  flavor?: string;
  target: TutorialTarget;
  targetSelector: string;
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
}

function hasAcknowledged(
  state: GameState,
  acknowledgedStepIds: ReadonlySet<string>,
  stepId: TutorialStepView["id"],
): boolean {
  return acknowledgedStepIds.has(`${state.campaignId}:${stepId}`);
}

function step(
  value: TutorialStepView,
): TutorialStepView {
  return value;
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
}: TutorialViewInput): TutorialStepView | null {
  if (!tutorialsEnabled) {
    return null;
  }

  if (state.facilityLevel >= 1) {
    if (
      hasAcknowledged(
        state,
        acknowledgedStepIds,
        "level-one-ready",
      )
    ) {
      return null;
    }
    return step({
      id: "level-one-ready",
      eyebrow: "Level 0 tutorial · Complete",
      title: "Welcome to the actual clinic loop",
      body:
        "Level 1 adds repeatable patients, rooms, staffing, and queue pressure. The tutorial is finished; liability continues.",
      flavor:
        "You have leveled up. The patients did not become simpler.",
      target: "goals",
      targetSelector: ".goals-panel",
      primaryAction: {
        id: "acknowledge-step",
        label: "Begin Level 1",
      },
    });
  }

  const first = state.encounters[TUTORIAL_ENCOUNTER_ID];
  if (!first) {
    return null;
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
        body:
          "The patient tab is not decoration. Open it to see the presentation and make the first scored decision. Each scored decision updates exactly one learning concept.",
        note:
          "Facility time continues unless you pause it. Tutorial patients will not leave while you read.",
        target: "waiting-patient",
        targetSelector: ".patient-folder.is-waiting .patient-tab",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
        primaryAction: {
          id: "open-first-chart",
          label: "Open first chart",
        },
        secondaryAction: {
          id: "focus-first-chart",
          label: "Show me where",
        },
      });
    }
    return step({
      id: "open-first-chart",
      eyebrow: "Level 0 tutorial · Step 1",
      title: "Click the highlighted patient tab",
      body:
        "New arrivals wait on the left. The exclamation point means the chart needs your attention.",
      target: "waiting-patient",
      targetSelector:
        ".patient-folder.is-waiting .patient-tab.is-tutorial-target",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      primaryAction: {
        id: "open-first-chart",
        label: "Open Pixel Patient",
      },
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
        primaryAction: {
          id: "open-first-chart",
          label: "Reopen chart",
        },
      });
    }
    if (
      !hasAcknowledged(state, acknowledgedStepIds, "chart-tour")
    ) {
      return step({
        id: "chart-tour",
        eyebrow: "Level 0 tutorial · Step 2",
        title: "This is the patient chart",
        body:
          "The portrait and identity are on the left, the presentation is in the middle, and the current decision is on the right. Read across the chart before choosing.",
        note:
          "This first patient is deliberately artificial so you can learn the interface without a clinical penalty.",
        target: "chart",
        targetSelector: ".chart-panel .chart-workspace",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
        primaryAction: {
          id: "acknowledge-step",
          label: "Show me the decision",
        },
      });
    }
    return step({
      id: "first-decision",
      eyebrow: "Level 0 tutorial · Step 3",
      title: "Choose the answer supported by the chart",
      body:
        "Click one multiple-choice answer. The answer order changes, so read the labels instead of memorizing a button position.",
      flavor:
        "A bold new era of clicking the thing the chart explicitly says has begun.",
      target: "answer-choices",
      targetSelector:
        ".chart-step-column.is-current .answer-list",
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
      note: `${remaining} clinic hour${remaining === 1 ? "" : "s"} remain. Use the tutorial button below so you do not have to wait in real time.`,
      target: "existing-patient",
      targetSelector: ".patient-folder.is-active",
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      primaryAction: {
        id: "advance-first-result",
        label: "Advance to result",
      },
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
        primaryAction: {
          id: "open-ready-chart",
          label: "Open returned chart",
        },
      });
    }
    return step({
      id: "follow-up-decision",
      eyebrow: "Level 0 tutorial · Step 6",
      title: "The new result created a second decision",
      body:
        "The chart keeps the earlier presentation and decision visible, then adds the next step to the right. Choose the action that matches the returned result.",
      target: "answer-choices",
      targetSelector:
        ".chart-step-column.is-current .answer-list",
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
        primaryAction: {
          id: "open-first-chart",
          label: "Review feedback",
        },
      });
    }
    if (
      !first.terminalFeedback?.acknowledged ||
      !hasAcknowledged(
        state,
        acknowledgedStepIds,
        "first-feedback",
      )
    ) {
      return step({
        id: "first-feedback",
        eyebrow: "Level 0 tutorial · Step 7",
        title: "Review the answer feedback",
        body:
          "Correct or not, the explanation closes the learning loop. Continue once you have read it.",
        target: "chart-feedback",
        targetSelector:
          ".chart-step-column.is-current .chart-step-feedback",
        patientEncounterId: TUTORIAL_ENCOUNTER_ID,
        primaryAction: {
          id: first.terminalFeedback?.acknowledged
            ? "acknowledge-step"
            : "acknowledge-feedback",
          label: "Continue",
        },
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
      patientEncounterId: TUTORIAL_ENCOUNTER_ID,
      primaryAction: {
        id: "resolve-chart",
        label: "Resolve chart",
      },
    });
  }

  const second = state.encounters[SECOND_TUTORIAL_ENCOUNTER_ID];
  if (!second) {
    return null;
  }

  if (
    second.lifecycle === "waiting_unopened" &&
    second.firstOpenedAtTick === null
  ) {
    return step({
      id: "second-patient",
      eyebrow: "Level 0 tutorial · Step 9",
      title: "A second patient has arrived",
      body:
        "This patient repeats the same chart workflow with prototype clinical content: open, decide, read feedback, and resolve.",
      flavor:
        "Repetition is how expertise forms and how software demos become suspiciously long.",
      target: "waiting-patient",
      targetSelector:
        ".patient-folder.is-waiting .patient-tab.is-tutorial-target",
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      primaryAction: {
        id: "open-second-chart",
        label: "Open second chart",
      },
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
        primaryAction: {
          id: "open-second-chart",
          label: "Reopen chart",
        },
      });
    }
    return step({
      id: "second-decision",
      eyebrow: "Level 0 tutorial · Step 10",
      title: "Make the scored clinical decision",
      body:
        "Choose one answer. This decision updates only the single concept named by this question, not every idea mentioned in the case.",
      target: "answer-choices",
      targetSelector:
        ".chart-step-column.is-current .answer-list",
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
        primaryAction: {
          id: "open-second-chart",
          label: "Review feedback",
        },
      });
    }
    if (
      !second.terminalFeedback?.acknowledged ||
      !hasAcknowledged(
        state,
        acknowledgedStepIds,
        "second-feedback",
      )
    ) {
      return step({
        id: "second-feedback",
        eyebrow: "Level 0 tutorial · Step 11",
        title: "Read the teaching feedback",
        body:
          "The feedback explains the tested point and records the result in this campaign's learning history.",
        target: "chart-feedback",
        targetSelector:
          ".chart-step-column.is-current .chart-step-feedback",
        patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
        primaryAction: {
          id: second.terminalFeedback?.acknowledged
            ? "acknowledge-step"
            : "acknowledge-feedback",
          label: "Continue",
        },
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
      patientEncounterId: SECOND_TUTORIAL_ENCOUNTER_ID,
      primaryAction: {
        id: "resolve-chart",
        label: "Resolve chart",
      },
    });
  }

  if (second.lifecycle !== "resolved") {
    return null;
  }

  const examRoomBuilt = state.rooms.some(
    (room) => room.roomDefinitionId === "room.examination",
  );
  const progression = getFacilityProgressionStatus(state);

  if (!examRoomBuilt && !buildMode) {
    if (
      !hasAcknowledged(state, acknowledgedStepIds, "goals-tour")
    ) {
      return step({
        id: "goals-tour",
        eyebrow: "Level 0 tutorial · Step 13",
        title: "Patient care funded your next objective",
        body:
          "The Goals panel is the source of truth for level progress. Level 0 requires enough Learning XP, satisfaction above 90%, two completed patients, and one examination room.",
        note:
          "Completed boxes stay checked. The next unfinished item tells you what to do.",
        target: "goals",
        targetSelector: ".goals-panel",
        primaryAction: {
          id: "acknowledge-step",
          label: "Show me construction",
        },
      });
    }
    return step({
      id: "enter-build-mode",
      eyebrow: "Level 0 tutorial · Step 14",
      title: "Enter Build Mode",
      body:
        "Build Mode pauses facility time so patients do not age into fossils while you remodel. Use the prominent mode button on the right.",
      flavor:
        "Architecture: medicine's least reimbursable procedure.",
      target: "build-mode",
      targetSelector: ".build-mode-trigger",
      primaryAction: {
        id: "enter-build-mode",
        label: "Enter Build Mode",
      },
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
        primaryAction: {
          id: "select-exam-room",
          label: "Select Examination Room",
        },
      });
    }
    return step({
      id: "place-exam-room",
      eyebrow: "Level 0 tutorial · Step 16",
      title: "Connect the room door to the clinic",
      body:
        "Move the outlined room beside the Front Desk. The marked door must touch a connected doorway or hallway. Rotate changes both the footprint and the door side.",
      note:
        "A valid outline confirms the room can be built. Click the facility to place it.",
      target: "facility-placement",
      targetSelector: ".facility-host",
    });
  }

  if (examRoomBuilt && buildMode) {
    return step({
      id: "exit-build-mode",
      eyebrow: "Level 0 tutorial · Step 17",
      title: "Construction complete — exit Build Mode",
      body:
        "Use the same mode button to leave construction. Facility time returns to the pause state it had before you started building.",
      target: "exit-build-mode",
      targetSelector: ".build-mode-toggle",
      primaryAction: {
        id: "exit-build-mode",
        label: "Exit Build Mode",
      },
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
      primaryAction: {
        id: "level-up",
        label: "Advance to Level 1",
      },
    });
  }

  if (examRoomBuilt) {
    return step({
      id: "remaining-goals",
      eyebrow: "Level 0 tutorial · Goals",
      title: "One or more goals still need attention",
      body:
        "Check the always-visible Goals panel. If XP or completed encounters remain, continue treating arriving patients; if satisfaction is low, avoid additional delays and mistakes.",
      target: "goals",
      targetSelector: ".goals-panel",
    });
  }

  return null;
}
