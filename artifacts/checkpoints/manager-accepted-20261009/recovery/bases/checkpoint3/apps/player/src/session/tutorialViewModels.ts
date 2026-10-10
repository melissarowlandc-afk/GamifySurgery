import {
  SECOND_TUTORIAL_ENCOUNTER_ID,
  TUTORIAL_ENCOUNTER_ID,
  getFacilityAccessValidation,
  getFacilityProgressionStatus,
  getCurrentQuestion,
  getEmergencyGlp1Status,
  getRoomDefinition,
  isRoomOperationalForFacilityWork,
  type EncounterState,
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
  | "level-up"
  | "open-management";

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
  | "level-up"
  | "management";

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
  | "level-one-await-first-arrival"
  | "sendout-management"
  | "sendout-trash"
  | "sendout-water";
  eyebrow: string;
  title: string;
  body: string;
  note?: string;
  /** Stable mechanical topics shared with contextual guidance. */
  topicIds?: string[];
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
  /** A persisted pause owner means the operations-card sequence already started. */
  dailyRoutineTipsStarted?: boolean;
  buildMode: boolean;
  selectedRoomDefinitionId: string | null;
  selectedRoomInstanceId?: string | null;
  summaryVisible?: boolean;
  managementMode?: boolean;
  doorToolActive?: boolean;
  buildExitBlockedIssues?: string[];
  exposedTopicIds?: readonly string[];
}

function formatMinutes(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  return safe < 60 ? `${safe} min` : `${Math.floor(safe / 60)} hr${safe % 60 ? ` ${safe % 60} min` : ""}`;
}

function encounterStep(input: TutorialViewInput, encounter: EncounterState, second: boolean): TutorialStepView | null {
  const { state } = input;
  const eyebrow = second ? "Timed visit" : "First visit";
  const base = { eyebrow, patientEncounterId: encounter.id };
  const open = state.openChartEncounterId === encounter.id;
  const pending = encounter.lifecycle === "active_pending_result";
  const firstChoice = encounter.answers.length === 0;
  const closed = (id: TutorialStepView["id"], title: string, body: string): TutorialStepView => ({
    ...base, id, title, body, target: "existing-patient",
    targetSelector: ".patient-folder.is-active .patient-tab.is-tutorial-target",
    topicIds: ["patient-folders"],
  });
  if (encounter.lifecycle === "resolved") return null;
  if (encounter.firstOpenedAtTick === null) {
    if (encounter.checkInStatus !== "checked_in") {
      return { ...base, id: second ? "second-patient-arriving" : "first-patient-arriving",
        title: second ? "Another patient. Naturally." : "Incoming paperwork",
        body: state.paused ? "Resume when you're ready for the patient to check in."
          : "Charts appear in Waiting after check-in. Time runs while you read; Pause is allowed.",
        target: state.paused ? "facility-clock" : "facility-entrance",
        targetSelector: state.paused ? ".pause-button" : "[data-tutorial-anchor='facility-entrance']",
        topicIds: ["patient-folders", "pause-speed"] };
    }
    return { ...base, id: second ? "open-second-chart" : "open-first-chart",
      title: second ? "Another patient. Naturally." : `Meet ${encounter.patientDisplayName}`,
      body: second ? `Open ${encounter.patientDisplayName} in Waiting.` : "Open the marked chart in Waiting. The exclamation point means they need you.",
      target: "waiting-patient", targetSelector: ".patient-folder.is-waiting .patient-tab.is-tutorial-target",
      topicIds: ["patient-folders"] };
  }

  // Frozen historical visits can have any number of nodes. Inspect the actual
  // feedback/physical lifecycle, never today's authored question count.
  const feedbackPending = encounter.steps.some((item) => item.status === "feedback_pending");
  if (feedbackPending) {
    if (!open) return closed(second ? "reopen-second-plan-feedback" : "reopen-first-feedback",
      "Your plan is saved", "Reopen the unfinished chart in Existing Patients to review and enact the plan.");
    const label = encounter.pendingResult && encounter.answers.at(-1)?.correct === false ? "Enact Corrected Plan" : "Enact Plan";
    return { ...base, id: second ? "enact-second-plan" : "first-feedback", title: "Make it happen",
      body: `Read the feedback, then ${label}. Choosing records the answer; enacting starts the patient's next step.`,
      target: "chart-feedback", targetSelector: "[data-tutorial-anchor='decision-feedback-action']",
      avoidSelector: ".chart-sheet, .chart-panel", topicIds: ["plan-enactment"] };
  }
  if (pending) {
    // This pointer is a single optional exposure in the existing coach location.
    // It never captures pause or waits for a read receipt.
    if (!state.paused && !open && encounter.patientLocation === null && encounter.patientMovement === null &&
      !(input.exposedTopicIds ?? []).includes("management")) {
      return { ...base, id: "sendout-management", title: "While they're away",
        body: "Management handles staff and income, and pauses the clinic. Apparently overhead needs supervision.",
        target: "management", targetSelector: ".management-mode-trigger", topicIds: ["management"] };
    }
    const remaining = Math.max(0, (encounter.pendingResult?.dueTick ?? state.facilityTick) - state.facilityTick);
    return { ...base, id: second ? "second-sendout-wait" : "off-site-result", title: "Patient away. Chart stays.",
      body: state.paused ? "Resume to let the visit continue. The chart stays in Existing Patients."
        : "Wait for the return marker in Existing Patients; the next question is still locked. 2× and 4× run the clinic faster.",
      note: remaining > 0 ? `${formatMinutes(remaining)} on the current estimate; physical return and check-in still apply.`
        : "Care, return and check-in must finish before the next decision.",
      target: "facility-clock", targetSelector: state.paused ? ".pause-button" : ".facility-time-chip",
      topicIds: ["patient-folders", "returned-result", "pause-speed"] };
  }
  if (encounter.lifecycle === "resolved_summary_available") {
    if (!open) return closed(second ? "reopen-second-feedback" : "reopen-first-feedback",
      "Finish the visit", "Your answer is saved. Reopen the chart in Existing Patients to read the feedback and file it.");
    const acknowledged = encounter.terminalFeedback?.acknowledged;
    return { ...base, id: acknowledged ? (second ? "resolve-second-chart" : "resolve-first-chart")
        : (second ? "second-final-feedback" : "first-feedback"),
      title: "Finish the visit",
      body: acknowledged ? second ? "Read the feedback, then Resolve Completed Chart to file the visit."
        : "Read the feedback and rewards. Money funds the clinic; XP tracks progress. Resolve Completed Chart files the visit."
        : encounter.answers.at(-1)?.correct === false
          ? "The feedback shows the correction. Your answer stays recorded; Dismiss and close chart still files the visit."
          : second ? "Read the feedback, then Dismiss and close chart to file the visit."
          : "Read the feedback and rewards. Money funds the clinic; XP tracks progress. Dismiss and close chart files the visit.",
      target: acknowledged ? "resolve-chart" : "chart-feedback",
      targetSelector: acknowledged ? "[data-tutorial-anchor='resolve-chart']" : "[data-tutorial-anchor='decision-feedback-action']",
      avoidSelector: ".chart-sheet, .chart-panel", topicIds: ["terminal-filing"] };
  }
  if (!open) return closed(firstChoice ? (second ? "reopen-second-chart" : "reopen-first-chart")
      : (second ? "second-result-ready" : "results-ready"),
    firstChoice ? "Your unfinished chart" : "They're back",
    firstChoice ? "Your unfinished chart is in Existing Patients. Reopen it when ready."
      : `Open ${encounter.patientDisplayName} in Existing Patients. The exclamation point asks for your next decision.`);
  if (getCurrentQuestion(state, encounter.id)) {
    return { ...base, id: firstChoice ? (second ? "second-first-decision" : "first-decision")
        : (second ? "second-follow-up-decision" : "follow-up-decision"),
      title: firstChoice ? (second ? "This plan takes time" : "Make the decision") : "New findings, next decision",
      body: firstChoice ? (second ? "Test choices show game-time estimates. Those are waits, not hints. Choose using the clinical information."
        : "Read the presentation, then choose. The answer is recorded; the chart will explain the result.")
        : "Read the new update, then choose. Your earlier decision is still there if you need it.",
      target: "answer-choices", targetSelector: "[data-tutorial-anchor='current-answer-choices']",
      avoidSelector: ".chart-sheet, .chart-panel", topicIds: [firstChoice ? "chart-decisions" : "returned-result"] };
  }
  return { ...base, id: second ? "second-sendout-wait" : "first-patient-walking-to-care",
    title: "The visit is moving", body: state.paused ? "Resume to let care and patient movement continue."
      : "The chart stays in Existing Patients while care and patient movement finish.",
    target: "facility-clock", targetSelector: state.paused ? ".pause-button" : ".facility-time-chip", topicIds: ["pause-speed"] };
}

function buildStep(input: TutorialViewInput): TutorialStepView {
  const { state, buildMode } = input;
  const base = { eyebrow: "First room", topicIds: ["exam-placement", "exam-access"] };
  const exam = state.rooms.find((room) => room.roomDefinitionId === "room.examination");
  const access = getFacilityAccessValidation(state);
  if (!exam) {
    const price = getRoomDefinition("room.examination")!.constructionCost;
    if (state.cash < price) {
      const consult = getEmergencyGlp1Status(state);
      return { ...base, id: "remaining-goals", title: "Overhead has arrived",
        body: consult.eligible ? `The exam costs $${price}; you have $${state.cash.toFixed(2)}. The available emergency consult pays $${consult.payment}.`
          : `The exam costs $${price}; you have $${state.cash.toFixed(2)}. ${consult.blockedReason ?? "Wait for an eligible paid consult."}`,
        target: "waiting-actions", targetSelector: ".emergency-glp1-panel", topicIds: ["paid-consult"] };
    }
    if (!buildMode) return { ...base, id: "enter-build-mode", title: "Buy some privacy",
      body: "Both visits are filed. Build an Examination Room; its card shows the price. The Front Desk has heard enough.",
      target: "build-mode", targetSelector: "[data-tutorial-anchor='enter-build-mode']" };
    if (input.selectedRoomDefinitionId !== "room.examination") return { ...base, id: "select-exam-room", title: "Place the exam room",
      body: "Select Examination Room. Its card shows the price and footprint.", target: "exam-room-option",
      targetSelector: "[data-room-definition-id='room.examination']" };
    return { ...base, id: "place-exam-room", title: "Place the exam room",
      body: "Place it beside a reachable room. Doors need a shared wall.", target: "facility-placement",
      targetSelector: "[data-tutorial-anchor='facility-surface']" };
  }
  if (!isRoomOperationalForFacilityWork(state, exam.id)) {
    return { ...base, id: "place-exam-room-door", title: "Let people in",
      body: !buildMode ? "Enter Build to repair the Examination Room's access. Its existing room and purchase stay saved."
        : input.doorToolActive ? "Doors is ready. Click an eligible shared wall. Four walls alone remain a storage decision."
          : "Select Doors, then click an eligible shared wall. If none is available, move the room beside reachable space.",
      target: buildMode ? "door-tool" : "build-mode",
      targetSelector: buildMode ? "[data-tutorial-anchor='place-door']" : "[data-tutorial-anchor='enter-build-mode']" };
  }
  if (buildMode) return { ...base, id: "exit-build-mode", title: "A functioning room. Suspicious.",
    body: !access.valid ? (input.buildExitBlockedIssues?.[0] ?? access.issues[0] ?? access.reason ?? "Repair the listed access problems before Done / Save.")
      : "Use Done / Save to return to the clinic. Any remaining access problems are listed there.",
    target: "exit-build-mode", targetSelector: "[data-tutorial-anchor='build-done']" };
  const progression = getFacilityProgressionStatus(state);
  return { id: progression.eligible ? "advance-level" : "remaining-goals", eyebrow: "Open for business",
    title: progression.eligible ? "Open for business" : "The goals have the details",
    body: progression.eligible ? "Your first-shift goals are complete. Advance to Level 1 when ready. Promotion still requires clicking."
      : "Check the remaining goals. Mistakes still count as completed introductory visits.",
    target: progression.eligible ? "level-up" : "goals", targetSelector: progression.eligible ? ".goals-panel .level-up-button" : ".goals-panel",
    topicIds: ["manual-advancement"] };
}

/** Native game state drives every beat; old acknowledgments are exposure only. */
export function createTutorialStepView(input: TutorialViewInput): TutorialStepView | null {
  if (!input.tutorialsEnabled || input.state.facilityLevel >= 1 || input.managementMode) return null;
  const { state } = input;
  if (input.buildMode && [TUTORIAL_ENCOUNTER_ID, SECOND_TUTORIAL_ENCOUNTER_ID].some((id) => state.encounters[id]?.lifecycle !== "resolved")) {
    const access = getFacilityAccessValidation(state);
    return {id: "exit-build-mode", eyebrow: "First visit", title: access.valid ? "Back to the visit" : "Make the layout reachable",
      body: access.valid ? "Done / Save returns to your unfinished visits. Build pauses the clinic; the chart stays saved."
        : input.buildExitBlockedIssues?.[0] ?? access.issues[0] ?? access.reason ?? "Fix the listed access problems before returning to the clinic.",
      target: "exit-build-mode", targetSelector: "[data-tutorial-anchor='build-done']", topicIds: ["exam-access"]};
  }
  for (const [id, second] of [[TUTORIAL_ENCOUNTER_ID, false], [SECOND_TUTORIAL_ENCOUNTER_ID, true]] as const) {
    const encounter = state.encounters[id];
    if (!encounter) {
      return { id: "between-tutorial-patients", eyebrow: second ? "Timed visit" : "First visit", title: "Your first shift",
        body: state.paused ? "Resume when you're ready for the next patient." : "See a patient. Get paid. Build a room. The paperwork was already here.",
        target: "facility-clock", targetSelector: state.paused ? ".pause-button" : ".facility-time-chip", topicIds: ["pause-speed"] };
    }
    if (encounter.lifecycle !== "resolved") return encounterStep(input, encounter, second);
  }
  return buildStep(input);
}
