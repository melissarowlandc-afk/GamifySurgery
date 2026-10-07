import type {
  DiagnosticOrderPhase,
  getAnswerChoiceServicePreview,
  getDiagnosticOrderTiming,
} from "@gamify-surgery/game-domain";

type ChoicePreview = ReturnType<typeof getAnswerChoiceServicePreview>;
export type DiagnosticTimingView = NonNullable<ReturnType<typeof getDiagnosticOrderTiming>>;
type DurationFormatter = (minutes: number) => string;

const phaseLabels: Record<DiagnosticOrderPhase["kind"], string> = {
  collection: "Collection",
  acquisition: "Image acquisition",
  preparation: "Preparation",
  procedure: "Procedure",
  recovery: "Recovery",
  interpretation: "Interpretation",
  laboratory_processing: "Laboratory processing",
  pathology: "Pathology",
  retained: "Remaining outside work",
  patient_departure: "Travel to outside service",
  patient_return: "Return to Front Desk",
};

/** Format the shared quote; never add phase durations to obtain another total. */
export function diagnosticChoiceTimingPresentation(
  preview: ChoicePreview,
  now: number,
  formatDuration: DurationFormatter,
): { etaLabel?: string; detailLabel?: string } {
  if (!preview) return {};
  if (preview.kind === "no_test") return { etaLabel: "No test wait" };
  const etaLabel = preview.durationTicks == null ? undefined : formatDuration(preview.durationTicks);
  const plan = "diagnosticTiming" in preview ? preview.diagnosticTiming : undefined;
  if (!plan) return { etaLabel, detailLabel: "Estimated test wait (game time)" };
  const estimateAvailable = preview.durationTicks != null;
  const details = plan.phases.filter((phase) => phase.status !== "cancelled" &&
    (estimateAvailable || (phase.kind !== "patient_departure" && phase.kind !== "patient_return"))).map((phase) => {
    if (phase.kind === "patient_departure" || phase.kind === "patient_return") {
      return `${phaseLabels[phase.kind]} ${formatDuration(phase.forecast.walkingMinutes)}`;
    }
    const delays = estimateAvailable ? [
      ...(phase.forecast.queueMinutes > 0 ? [`${formatDuration(phase.forecast.queueMinutes)} queue`] : []),
      ...(phase.forecast.walkingMinutes > 0 ? [`${formatDuration(phase.forecast.walkingMinutes)} walking`] : []),
    ] : [];
    return `${phaseLabels[phase.kind]} ${formatDuration(phase.durationMinutes)} ${phase.mode === "local" ? "onsite" : "offsite"}${delays.length ? ` (${delays.join(", ")})` : ""}`;
  });
  const result = Math.max(0, plan.resultReady.forecastAtTick - now);
  const visual = plan.visualResultReady ? Math.max(0, plan.visualResultReady.forecastAtTick - now) : null;
  if (visual !== null && preview.durationTicks !== null && visual < preview.durationTicks) {
    details.push(`Visual findings estimated at ${formatDuration(visual)}`);
  }
  if (preview.durationTicks !== null && result < preview.durationTicks && result !== visual) {
    details.push(`Result estimated at ${formatDuration(result)}`);
  }
  const introduction = estimateAvailable
    ? "Estimated total (game time; includes queues and walking)."
    : "Waiting for compatible room or staff capacity; the time estimate is unavailable. Work durations (game time):";
  return { etaLabel, detailLabel: `${introduction} ${details.join("; ")}.` };
}

/** Reached result clocks control prose visibility; forecasts only describe waits. */
export function diagnosticPendingPresentation(
  timing: DiagnosticTimingView,
  resultNarrative: string,
  formatDuration: DurationFormatter,
) {
  const unfinished = timing.phases.filter((phase) => phase.status !== "completed" && phase.status !== "cancelled");
  const pathology = timing.phases.filter((phase) => phase.kind === "pathology" && phase.status !== "cancelled");
  const pathologyPending = pathology.some((phase) => phase.status !== "completed");
  const externalPatientWork = unfinished.some((phase) => phase.mode === "external" &&
    ["collection", "acquisition", "procedure", "retained"].includes(phase.kind));
  const heading = timing.resultReady ? "Result available"
    : timing.visualResultReady ? "Visual findings available" : "Diagnostic work in progress";
  const clauses = [timing.resultReady
    ? resultNarrative || "The result is available."
    : timing.visualResultReady ? "Visual findings are available; the complete result is pending." : "The result is pending."];
  if (!timing.careComplete) {
    clauses.push("Patient care and return are still in progress. The next decision waits for care completion.");
  } else if (!timing.resultReady) {
    clauses.push("Patient care is complete; awaiting the result.");
  } else if (pathologyPending) {
    clauses.push("Patient care is complete; collected pathology continues separately.");
  }
  if (timing.blocked) clauses.push("Waiting for compatible room or staff capacity; the full time estimate is unavailable.");
  const phasesToShow = timing.phases.filter((phase) => phase.status !== "cancelled" &&
    (phase.status !== "completed" || phase.kind === "pathology"));
  const phaseDetails = phasesToShow.map((phase) => {
    const location = phase.mode === "local" ? "onsite" : "offsite";
    if (phase.status === "completed") return `${phase.label} (${location}): complete`;
    const progress = phase.remainingTicks === null ? "waiting for capacity"
      : `${formatDuration(phase.remainingTicks)} remaining`;
    const delays = phase.remainingTicks !== null ? [
      ...(phase.queueMinutes > 0 ? [`${formatDuration(phase.queueMinutes)} queue`] : []),
      ...(phase.walkingMinutes > 0 ? [`${formatDuration(phase.walkingMinutes)} walking`] : []),
    ] : [];
    return `${phase.label} (${location}): ${progress}${delays.length ? ` (${delays.join(", ")})` : ""}`;
  });
  if (phaseDetails.length) clauses.push(`Game time: ${phaseDetails.join("; ")}.`);
  return {
    heading,
    body: clauses.join(" "),
    etaLabel: timing.blocked || timing.totalRemainingTicks === null || unfinished.length === 0 ? undefined
      : `${formatDuration(timing.totalRemainingTicks)} remaining (game time)`,
    hasPendingWork: unfinished.length > 0,
    pathologyPending,
    statusLabel: timing.resultReady && !timing.careComplete ? "Result available; care in progress"
      : timing.blocked ? "Diagnostic work waiting for capacity"
      : timing.visualResultReady && !timing.resultReady ? "Visual findings available; result pending"
      : timing.resultReady && pathologyPending ? "Result available; pathology in progress"
      : timing.resultReady ? "Result available"
      : timing.careComplete && !timing.resultReady ? "Awaiting result processing"
      : externalPatientWork ? "External service in progress"
      : "Diagnostic care in progress",
  };
}

/** The owner's fixed diagnostic phase times do not receive generic room speed boosts. */
export function roomUsesFixedDiagnosticTiming(roomDefinitionId: string): boolean {
  return ["room.xray", "room.ultrasound", "room.ct", "room.imaging_control", "room.minor_procedure",
    "room.phlebotomy", "room.endoscopy", "room.periop_recovery", "room.ambulatory_or", "room.laboratory", "room.reading"]
    .includes(roomDefinitionId);
}
