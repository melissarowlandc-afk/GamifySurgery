import { afterEach, describe, expect, it, vi } from "vitest";
import { gameReducer, getAnswerChoiceServicePreview, type GameState, type ServiceOperationState } from "@gamify-surgery/game-domain";
import { timingFixture } from "../../../../packages/game-domain/tests/diagnostic-timing-fixtures";
import { diagnosticChoiceTimingPresentation } from "../session/diagnosticTimingPresentation";
import { MobileChart, MobileTeamDiscussion } from "../mobile/MobileChart";
import { ChartPanel } from "./ChartPanel";
import { EmployeeDiscussionPanel } from "./EmployeeDiscussionPanel";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./testDomHarness";
import type { ChartDecisionStepView, ChartView, EmployeeDiscussionView } from "./types";

vi.mock("react-dom", async (importOriginal) => ({
  ...await importOriginal<typeof import("react-dom")>(),
  createPortal: (children: unknown) => children,
}));

afterEach(cleanupPhoneTests);

const actions = () => ({ onClose: vi.fn(), onSubmitAnswer: vi.fn(), onFlagQuestion: vi.fn(),
  onAcknowledgeTerminalFeedback: vi.fn(), onToggleSummary: vi.fn(), onFileChart: vi.fn() });

type Layout = "phone" | "desktop";

function mountChart(layout: Layout) {
  const env = phoneTestDom(), callbacks = actions();
  return { ...env, callbacks,
    renderChart: (chart: ChartView | null) => env.render(layout === "phone"
      ? chart ? <MobileChart chart={chart} {...callbacks} /> : null
      : <ChartPanel chart={chart} {...callbacks} />),
    waits: () => allElements(env.element, (element) =>
      element.attributes.class === (layout === "phone" ? "mobile-answer-wait" : "cs-wait"))
      .map((element) => ({ text: element.textContent, detail: element.attributes.title })),
    choices: () => allElements(env.element, (element) => element.tagName === "BUTTON" &&
      element.attributes.class?.split(" ").includes(layout === "phone" ? "mobile-answer" : "cs-answer") === true),
  };
}

function sampleChart(overrides: Partial<ChartView> = {}): ChartView {
  return { id: "snapshot.chart", patientName: "Fixture patient", patientDetails: "Fixture details", statusLabel: "Action required",
    presentation: "Fixture presentation.", answerChoices: [], terminalFeedbackNeedsAcknowledgment: false,
    summaryAvailable: false, summaryVisible: false, canFile: false, readOnly: false,
    decisionSteps: [{ id: "snapshot.question", heading: "Fixture decision", questionPrompt: "Choose a fixture test.",
      current: true, complete: false, questionVariantId: "snapshot.variant",
      answerChoices: [
        { id: "busy", label: "Busy fixture test", selected: false, disabled: false, etaLabel: "90 min", detailLabel: "60 min queue plus work" },
        { id: "idle", label: "Idle fixture test", selected: false, disabled: false, etaLabel: "30 min", detailLabel: "30 min work" },
      ] }], ...overrides };
}

function changedWaits(chart: ChartView): ChartView {
  return { ...chart, decisionSteps: chart.decisionSteps!.map((step) => ({ ...step, answerChoices: step.answerChoices.map((choice) =>
    ({ ...choice, etaLabel: "5 min", detailLabel: "Changed runtime forecast" })) })) };
}

function busyUltrasoundQuestion() {
  const fixture = timingFixture();
  const { state, context, encounter } = fixture;
  const ultrasound = fixture.addRoom("room.ultrasound", "staff.imaging_technician");
  const technician = state.employees.find((employee) => employee.staffRoleDefinitionId === "staff.imaging_technician")!;
  technician.facilityTask = { kind: "perform_service", targetId: "wait-snapshot.busy-ultrasound",
    startedAtFacilityTick: 0, workMinutesRemaining: Number.MAX_SAFE_INTEGER };
  // Existing accepted work occupies the installed resource until tick 60.
  state.serviceOperations.push({
    id: "wait-snapshot.busy-ultrasound", incomeLineId: "income.ultrasound", catalogVersion: 1,
    actorKind: "visitor", actorId: "wait-snapshot.visitor", displayName: "Fixture visitor", appearance: null,
    status: "in_service", createdAtFacilityTick: 0, waitDeadlineFacilityTick: 100,
    startedAtFacilityTick: 0, completedAtFacilityTick: null, cancelledAtFacilityTick: null,
    quoteFee: 0, phaseIndex: 0, phaseStartedAtFacilityTick: 0, phaseEndsAtFacilityTick: 60,
    phaseFlowVersion: 1, frozenOperationPhases: [{ id: "fixture.acquisition", roomDefinitionId: "room.ultrasound",
      durationMinutes: 60, staffRoleDefinitionIds: ["staff.imaging_technician"] }],
    reservedRoomInstanceIds: [ultrasound.room.id], reservedEmployeeIds: [technician.id], providerReservation: null,
    location: ultrasound.anchor, path: [ultrasound.anchor], pathIndex: 0,
    lastMovedAtFacilityTick: 0, cancellationReason: null,
  } satisfies ServiceOperationState);
  const clinicalCase = context.clinicalRelease.cases.find((entry) => entry.decisionNodes.some((node) =>
    node.questionVariantId === "question.colon-cancer.preoperative-cross-sectional-staging.v4.r4"))!;
  expect(clinicalCase).toBeDefined();
  encounter.frozenCase = structuredClone(clinicalCase);
  const index = encounter.frozenCase.decisionNodes.findIndex((node) =>
    node.questionVariantId === "question.colon-cancer.preoperative-cross-sectional-staging.v4.r4");
  encounter.currentNodeIndex = index;
  encounter.lifecycle = "active_action_required";
  encounter.arrivalClass = "routine"; encounter.checkInStatus = "checked_in";
  encounter.terminalFeedback = null;
  encounter.steps = encounter.frozenCase.decisionNodes.map((node, nodeIndex) => ({
    nodeIndex, decisionNodeId: node.id, questionVariantId: node.questionVariantId, primaryConceptId: node.primaryConceptId,
    status: nodeIndex < index ? "completed" : nodeIndex === index ? "action_required" : "locked", answer: null, result: null,
  }));
  state.paused = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.nextEmployeeDiscussionTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.environment.nextAmbientPedestrianTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  const node = encounter.frozenCase.decisionNodes[index]!;
  const previews = (current: GameState) => node.answerChoices.map((choice) =>
    getAnswerChoiceServicePreview(current, encounter.id, choice.id, context)!);
  const chart = (current: GameState): ChartView => {
    const step: ChartDecisionStepView = {
      id: node.id, questionVariantId: node.questionVariantId, heading: "Fixture decision", questionPrompt: "Choose a fixture test.",
      current: true, complete: false,
      answerChoices: node.answerChoices.map((choice) => ({ id: choice.id, label: choice.id, selected: false, disabled: false,
        ...diagnosticChoiceTimingPresentation(getAnswerChoiceServicePreview(current, encounter.id, choice.id, context),
          current.facilityTick, (minutes) => `${minutes} min`) })),
    };
    return { id: encounter.id, patientName: "Fixture patient", patientDetails: "Fixture details", statusLabel: "Action required",
      presentation: "Fixture presentation.", answerChoices: [], decisionSteps: [step],
      terminalFeedbackNeedsAcknowledgment: false, summaryAvailable: false, summaryVisible: false, canFile: false, readOnly: false };
  };
  const advance = () => {
    let current = state;
    for (let tick = 0; tick < 5; tick++) {
      const operationId = `wait-snapshot.tick.${tick}`;
      current = gameReducer(current, { type: "ADVANCE_TICK", operationId }, context);
      expect(current.operationReceipts[operationId]?.status).toBe("applied");
    }
    return current;
  };
  return { state, chart, advance, previews };
}

describe.each(["phone", "desktop"] as const)("%s question wait snapshot", (layout) => {
  it("keeps every choice's estimate and breakdown fixed while a busy ultrasound queue advances", async () => {
    const fixture = busyUltrasoundQuestion();
    const { renderChart, waits } = mountChart(layout);
    const before = fixture.chart(fixture.state);
    const beforePreviews = fixture.previews(fixture.state);
    await renderChart(before);
    const displayed = waits();
    expect(displayed).toHaveLength(before.decisionSteps![0]!.answerChoices.length);
    const afterState = fixture.advance();
    expect(afterState.facilityTick).toBe(fixture.state.facilityTick + 5);
    expect(afterState.serviceOperations.find((operation) => operation.id === "wait-snapshot.busy-ultrasound"))
      .toMatchObject({ status: "in_service", phaseEndsAtFacilityTick: 60, cancellationReason: null });
    const afterPreviews = fixture.previews(afterState);
    const busyIndex = beforePreviews.findIndex((preview) => "serviceId" in preview && preview.serviceId === "service.ultrasound");
    expect(busyIndex).toBeGreaterThanOrEqual(0);
    expect(afterPreviews[busyIndex]!.durationTicks).toBe(beforePreviews[busyIndex]!.durationTicks! - 5);
    expect(afterPreviews.some((preview, index) => index !== busyIndex && preview.durationTicks === beforePreviews[index]!.durationTicks)).toBe(true);
    await renderChart(fixture.chart(afterState));
    expect(waits()).toEqual(displayed);
  });

  it("refreshes waits on close/reopen, chart change and a new question", async () => {
    const env = mountChart(layout);
    const first = sampleChart(), later = changedWaits(first);
    await env.renderChart(first);
    const openingWaits = env.waits();
    await env.renderChart(later);
    expect(env.waits()).toEqual(openingWaits);
    await env.renderChart(null);
    await env.renderChart(later);
    expect(env.waits()).not.toEqual(openingWaits);
    expect(env.waits().every((wait) => wait.text.includes("5 min"))).toBe(true);
    await env.renderChart({ ...first, id: "other.chart" });
    expect(env.waits()).toEqual(openingWaits);
    await env.renderChart({ ...later, id: "other.chart", decisionSteps: later.decisionSteps!.map((step) =>
      ({ ...step, questionVariantId: "new.variant" })) });
    expect(env.waits().every((wait) => wait.text.includes("5 min"))).toBe(true);
  });

  it("waits for visible choices, preserves live order/action gates and handles legacy question identity", async () => {
    const env = mountChart(layout);
    const first = sampleChart(), step = first.decisionSteps![0]!;
    // Exercise the legacy top-level adapter, including asynchronous mode checks.
    const legacy = { ...first, decisionSteps: undefined, questionPrompt: step.questionPrompt, answerChoices: step.answerChoices };
    await env.renderChart({ ...legacy, answerChoicesPending: true, answerChoices: [] });
    expect(env.waits()).toEqual([]);
    await env.renderChart(legacy);
    const openingWaits = env.waits();
    const changed = { ...legacy, answerChoices: [...legacy.answerChoices].reverse().map((choice) =>
      ({ ...choice, disabled: choice.id === "busy", etaLabel: "5 min", detailLabel: "Changed forecast" })) };
    await env.renderChart(changed);
    expect(env.waits()).toEqual([...openingWaits].reverse());
    expect(env.choices()[0]!.textContent).toContain("Idle fixture test");
    expect(env.choices()[1]!.attributes.disabled).toBe("");
    await env.clickElement(env.choices()[0]!);
    expect(env.callbacks.onSubmitAnswer).toHaveBeenCalledExactlyOnceWith("idle");
    const answered = { ...changed, answerChoices: changed.answerChoices.map((choice) =>
      ({ ...choice, disabled: true, selected: choice.id === "idle" })) };
    await env.renderChart(answered);
    expect(env.element.textContent).toContain("Your answer");
    expect(env.choices().every((button) => button.attributes.disabled !== undefined)).toBe(true);
    await env.renderChart({ ...changed, questionPrompt: "A different legacy question with the same step ID." });
    expect(env.waits().every((wait) => wait.text.includes("5 min"))).toBe(true);
  });

  it("keeps pending result clocks live and never manufactures a missing estimate", async () => {
    const env = mountChart(layout);
    const first = sampleChart({ pendingLabel: "Accepted result: 20 min remaining", etaLabel: "20 min" });
    first.decisionSteps![0]!.answerChoices.push({ id: "no-wait", label: "No test", selected: false, disabled: false });
    await env.renderChart(first);
    const openingWaits = env.waits();
    const later = changedWaits(first);
    await env.renderChart({ ...later, pendingLabel: "Accepted result: 10 min remaining", etaLabel: "10 min" });
    expect(env.waits()).toEqual(openingWaits);
    expect(env.waits()).toHaveLength(2);
    expect(env.element.textContent).toContain("Accepted result: 10 min remaining");
    expect(env.element.textContent).not.toContain("Accepted result: 20 min remaining");
  });

  it("applies the same snapshot to team discussions and refreshes their next question", async () => {
    const env = phoneTestDom(), onAnswer = vi.fn();
    const discussion: EmployeeDiscussionView = { id: "snapshot.discussion", employeeName: "Fixture colleague", roleLabel: "Fixture role",
      status: "question", finalStep: false, presentation: "Fixture scenario.", reviewStatus: "needs clinician review",
      question: "First fixture question?", choices: sampleChart().decisionSteps![0]!.answerChoices };
    const render = (view: EmployeeDiscussionView) => env.render(layout === "phone"
      ? <MobileTeamDiscussion discussion={view} onAnswer={onAnswer} onAcknowledge={() => {}} onFile={() => {}} onClose={() => {}} />
      : <EmployeeDiscussionPanel discussion={view} onAnswer={onAnswer} onAcknowledge={() => {}} onFile={() => {}} onClose={() => {}} />);
    await render(discussion);
    const original = env.element.textContent;
    const later = { ...discussion, choices: discussion.choices!.map((choice) => ({ ...choice, etaLabel: "5 min", detailLabel: "Updated forecast" })) };
    await render(later);
    expect(env.element.textContent).toBe(original);
    await render({ ...later, question: "Next fixture question?" });
    expect(env.element.textContent).toContain("5 min");
    expect(env.element.textContent).not.toContain("90 min");
  });
});
