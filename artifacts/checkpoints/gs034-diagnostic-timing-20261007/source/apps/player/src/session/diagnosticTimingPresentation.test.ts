import { describe, expect, it } from "vitest";
import type { DiagnosticOrderPhase, DiagnosticOrderPlan, getAnswerChoiceServicePreview } from "@gamify-surgery/game-domain";
import { diagnosticChoiceTimingPresentation, diagnosticPendingPresentation, type DiagnosticTimingView } from "./diagnosticTimingPresentation";

const duration = (value: number) => `${value} min`;
const phase = (id: string, kind: DiagnosticOrderPhase["kind"], minutes: number, end: number,
  overrides: Partial<DiagnosticOrderPhase> = {}): DiagnosticOrderPhase => ({
  id, componentId: null, kind, mode: "local", patientPresent: kind !== "pathology", durationMinutes: minutes,
  dependsOn: [], requirement: null, resource: null, operationPhaseId: null, serviceOperationId: null,
  status: "pending", remainingMinutes: minutes, startedAtTick: null, completedAtTick: null,
  forecast: { readyAtTick: end - minutes, startsAtTick: end - minutes, endsAtTick: end, queueMinutes: 0,
    walkingMinutes: 0, patientPath: [], employeePaths: [], founderPath: [], tilesPerTick: 1 }, ...overrides,
});
const plan = (): DiagnosticOrderPlan => ({
  version: "diagnostic-order.v1", timingVersion: "diagnostic-timing.v1", orderId: "order.test", encounterId: "encounter.test",
  createdAtTick: 100, execution: "supported", sources: [],
  phases: [phase("procedure", "procedure", 45, 145), phase("recovery", "recovery", 60, 205),
    phase("pathology", "pathology", 60, 235, { mode: "external", forecast: { readyAtTick: 145, startsAtTick: 175,
      endsAtTick: 235, queueMinutes: 30, walkingMinutes: 0, patientPath: [], employeePaths: [], founderPath: [], tilesPerTick: 1 } })],
  resultReady: { afterPhaseIds: ["procedure"], forecastAtTick: 145, reachedAtTick: null },
  visualResultReady: { afterPhaseIds: ["procedure"], forecastAtTick: 145, reachedAtTick: null },
  careComplete: { afterPhaseIds: ["recovery"], forecastAtTick: 205, reachedAtTick: null },
});
const preview = (frozen = plan()): ReturnType<typeof getAnswerChoiceServicePreview> => ({
  kind: "test", answerChoiceId: "test", serviceId: null, serviceDisplayName: "Test", routeId: null,
  routeDisplayName: null, timingProfileId: null, durationTicks: 135, diagnosticTiming: frozen,
});
const timing = (overrides: Partial<DiagnosticTimingView> = {}): DiagnosticTimingView => ({
  orderId: "order.test", blocked: false, totalRemainingTicks: 60, resultReady: false, resultRemainingTicks: 30,
  visualResultReady: false, visualResultRemainingTicks: 30, careComplete: false, careRemainingTicks: 60,
  phases: [ { id: "recovery", kind: "recovery", label: "Recovery", mode: "local", durationMinutes: 60,
    status: "active", queueMinutes: 0, walkingMinutes: 0, remainingTicks: 60 },
    { id: "pathology", kind: "pathology", label: "Pathology", mode: "external", durationMinutes: 60,
      status: "active", queueMinutes: 0, walkingMinutes: 0, remainingTicks: 30 } ], ...overrides,
});

describe("shared diagnostic timing presentation", () => {
  it("uses the quoted total while showing overlapping work, queue delays and earlier visual findings", () => {
    const view = diagnosticChoiceTimingPresentation(preview(), 100, duration);
    expect(view.etaLabel).toBe("135 min");
    expect(view.detailLabel).toContain("includes queues and walking");
    expect(view.detailLabel).toContain("Recovery 60 min onsite");
    expect(view.detailLabel).toContain("Pathology 60 min offsite (30 min queue)");
    expect(view.detailLabel).toContain("Visual findings estimated at 45 min");
    expect(view.detailLabel).not.toContain("Result estimated");
  });

  it("shows patient walking and an earlier complete result without guessing from a choice label", () => {
    const frozen = plan();
    frozen.visualResultReady = null;
    frozen.phases.push(phase("return", "patient_return", 0, 210, { forecast: {
      readyAtTick: 205, startsAtTick: 210, endsAtTick: 210, queueMinutes: 0, walkingMinutes: 5,
      patientPath: [], employeePaths: [], founderPath: [], tilesPerTick: 1,
    } }));
    const view = diagnosticChoiceTimingPresentation(preview(frozen), 100, duration);
    expect(view.detailLabel).toContain("Return to Front Desk 5 min");
    expect(view.detailLabel).toContain("Result estimated at 45 min");
  });

  it("shows frozen work durations without nominal queues or walking when capacity has no return estimate", () => {
    const frozen = plan();
    frozen.phases[0]!.forecast.queueMinutes = 73;
    frozen.phases[0]!.forecast.walkingMinutes = 7;
    frozen.phases.push(phase("return", "patient_return", 0, 240, { forecast: {
      readyAtTick: 235, startsAtTick: 240, endsAtTick: 240, queueMinutes: 0, walkingMinutes: 5,
      patientPath: [], employeePaths: [], founderPath: [], tilesPerTick: 1,
    } }));
    const view = diagnosticChoiceTimingPresentation({ kind: "test", answerChoiceId: "test", serviceId: null,
      serviceDisplayName: "Test", routeId: null, routeDisplayName: null, timingProfileId: null,
      diagnosticTiming: frozen, durationTicks: null }, 100, duration);
    expect(view.etaLabel).toBeUndefined();
    expect(view.detailLabel).toContain("time estimate is unavailable");
    expect(view.detailLabel).toContain("Procedure 45 min onsite");
    expect(view.detailLabel).not.toMatch(/Estimated total|\d+ min (queue|walking)|Return to Front Desk|estimated at/);
  });

  it("preserves legacy quotes, no-test labels and unavailable estimates", () => {
    const legacy = { kind: "test" as const, answerChoiceId: "test", serviceId: null, serviceDisplayName: "Test",
      routeId: null, routeDisplayName: null, timingProfileId: "timing.test.upper_endoscopy", durationTicks: 120 };
    expect(diagnosticChoiceTimingPresentation(legacy, 100, duration)).toEqual({ etaLabel: "120 min", detailLabel: "Estimated test wait (game time)" });
    expect(diagnosticChoiceTimingPresentation({ kind: "test", answerChoiceId: "test", serviceId: null, serviceDisplayName: "Test",
      routeId: null, routeDisplayName: null, timingProfileId: null, diagnosticTiming: null, durationTicks: null }, 100, duration).etaLabel).toBeUndefined();
    expect(diagnosticChoiceTimingPresentation({ kind: "no_test", answerChoiceId: "observe", serviceId: null,
      serviceDisplayName: null, routeId: null, routeDisplayName: null, durationTicks: null, timingProfileId: null }, 100, duration))
      .toEqual({ etaLabel: "No test wait" });
  });

  it("shows an actual early result while keeping recovery, pathology and the next-decision gate separate", () => {
    const view = diagnosticPendingPresentation(timing({ resultReady: true, resultRemainingTicks: 0, visualResultReady: true }),
      "Existing visual result narrative.", duration);
    expect(view.heading).toBe("Result available");
    expect(view.body).toContain("Existing visual result narrative.");
    expect(view.body).toContain("The next decision waits for care completion");
    expect(view.body).toContain("Recovery (onsite): 60 min remaining");
    expect(view.body).toContain("Pathology (offsite): 30 min remaining");
    expect(view.etaLabel).toBe("60 min remaining (game time)");
  });

  it("does not reveal biopsy prose at a visual milestone or from an elapsed forecast", () => {
    const visual = diagnosticPendingPresentation(timing({ visualResultReady: true }), "Unreleased biopsy findings.", duration);
    expect(visual.body).toContain("Visual findings are available");
    expect(visual.body).not.toContain("Unreleased biopsy findings");
    const forecastOnly = diagnosticPendingPresentation(timing({ resultRemainingTicks: 0, visualResultRemainingTicks: 0 }),
      "Unreleased biopsy findings.", duration);
    expect(forecastOnly.heading).toBe("Diagnostic work in progress");
    expect(forecastOnly.body).not.toContain("Unreleased biopsy findings");
  });

  it("suppresses a finite full ETA when capacity is missing and retains already-ready results", () => {
    const blocked = timing({ blocked: true, totalRemainingTicks: null, resultReady: true, resultRemainingTicks: 0 });
    blocked.phases[1]!.remainingTicks = null;
    blocked.phases[1]!.status = "queued";
    blocked.phases[1]!.queueMinutes = 73;
    blocked.phases[1]!.walkingMinutes = 7;
    const view = diagnosticPendingPresentation(blocked, "Existing returned finding.", duration);
    expect(view.etaLabel).toBeUndefined();
    expect(view.body).toContain("Existing returned finding.");
    expect(view.body).toContain("full time estimate is unavailable");
    expect(view.body).toContain("Pathology (offsite): waiting for capacity");
    expect(view.body).not.toMatch(/73 min queue|7 min walking/);
  });

  it("keeps collected background pathology visible after patient care and clinical delivery", () => {
    const background = timing({ resultReady: true, resultRemainingTicks: 0, careComplete: true, careRemainingTicks: 0, totalRemainingTicks: 30 });
    background.phases[0]!.status = "completed";
    background.phases[0]!.remainingTicks = 0;
    const view = diagnosticPendingPresentation(background, "Existing returned visual finding.", duration);
    expect(view.hasPendingWork).toBe(true);
    expect(view.pathologyPending).toBe(true);
    expect(view.body).toContain("collected pathology continues separately");
    expect(view.body).not.toContain("next decision waits");
    expect(view.etaLabel).toBe("30 min remaining (game time)");
  });

  it("shows completed pathology without retaining a pending countdown", () => {
    const completed = timing({ resultReady: true, careComplete: true, totalRemainingTicks: 0 });
    completed.phases.forEach((entry) => { entry.status = "completed"; entry.remainingTicks = 0; });
    const view = diagnosticPendingPresentation(completed, "Existing result.", duration);
    expect(view.hasPendingWork).toBe(false);
    expect(view.pathologyPending).toBe(false);
    expect(view.etaLabel).toBeUndefined();
    expect(view.body).toContain("Pathology (offsite): complete");
  });
});
