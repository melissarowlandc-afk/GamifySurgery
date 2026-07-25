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
  | "facility-clock"
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
  buildMode,
  selectedRoomDefinitionId,
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
          `${pendingSendout.patientDisplayName} moved to Existing Patients while the off-site service runs. Keep the clinic clock running; you may treat other patients while you wait.`,
        note:
          `${remaining} in-game hour${remaining === 1 ? "" : "s"} remain. At normal prototype speed, each in-game hour takes about 30 real seconds.`,
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
        `${remaining} in-game hour${remaining === 1 ? "" : "s"} until the next planned arrival. Level 1 adds repeatable patients, queue pressure, rooms, and staffing.`,
      flavor:
        "You have leveled up. The patients did not become simpler.",
      target: "facility-clock",
      targetSelector: state.paused
        ? ".pause-button"
        : ".facility-time-chip",
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
          id: "focus-first-chart",
          label: "Show the patient tab",
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
      body:
        "The portrait is on the left, the presentation is in the middle, and the current decision is on the right. Click the real answer supported by the chart; answer order changes.",
      note:
        "This first patient is deliberately artificial so you can learn the interface without a clinical penalty.",
      flavor:
        "A bold new era of clicking the thing the chart explicitly says has begun.",
      target: "answer-choices",
      targetSelector:
        ".chart-step-column.is-current .answer-list",
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
        `${remaining} in-game hour${remaining === 1 ? "" : "s"} remain. This first training result returns automatically in about four real seconds; normal Level 1 send-outs follow facility time.`,
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
        "The chart keeps the earlier presentation and decision visible, then adds the next step to the right. Choose the action that matches the returned result.",
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
      body:
        "Choose one answer. This decision updates only the single concept named by this question, not every idea mentioned in the case.",
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

  const examRoomBuilt = state.rooms.some(
    (room) => room.roomDefinitionId === "room.examination",
  );
  const progression = getFacilityProgressionStatus(state);

  if (!examRoomBuilt && !buildMode) {
    return step({
      id: "enter-build-mode",
      eyebrow: "Level 0 tutorial · Step 13",
      title: "Your remaining goal needs an examination room",
      body:
        "The Goals panel tracks XP, satisfaction, completed patients, and construction. Your remaining objective is an examination room, so click the real Enter Build Mode button.",
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
        "Check the always-visible Goals panel. If XP or completed encounters remain, continue treating arriving patients; if satisfaction is low, avoid additional delays and mistakes.",
      target: "goals",
      targetSelector: ".goals-panel",
    });
  }

  return null;
}
