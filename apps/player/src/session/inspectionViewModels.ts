import { createInspectionReport, getExecutivePreparationQuote, getInspectionBookingBlockedReason, inspectionScoreLabel,
  PROTOTYPE_DOMAIN_CONTEXT, type GameState, type InspectionReportState } from "@gamify-surgery/game-domain";
import type { FacilityInspectionView, InspectionReportView } from "../ui/types";
import { facilityTimeLabel } from "./managementViewModels";

const categoryNames = {
  cleanliness: "Cleanliness", rooms_built: "Rooms built / usable", room_upgrades: "Room upgrades",
  staffing_coverage: "Staffing coverage", employee_training: "Employee training", staff_morale: "Staff morale",
  patient_satisfaction: "Patient satisfaction", wait_flow: "Wait / flow", finances: "Finances", clinical_answer_accuracy: "Game answer accuracy",
} as const;

export function inspectionReportView(report: InspectionReportState): InspectionReportView {
  return { runId: report.runId, outcome: report.outcome,
    rawTotalScore: report.rawTotalScore,
    totalLabel: report.rawTotalScore === null ? "No prestige score" : `${inspectionScoreLabel(report.rawTotalScore)}/100 · ${report.recognition}`,
    scoreLabel: report.rawTotalScore === null ? "—" : inspectionScoreLabel(report.rawTotalScore),
    recognitionLabel: report.recognition ? report.recognition[0]!.toUpperCase() + report.recognition.slice(1) : null,
    windowLabel: `${report.observedActiveMinutes}/${report.requiredActiveMinutes} active min`,
    sampleLabel: `${report.qualifyingScoredPatientCount}/${report.minimumQualifyingScoredPatients} qualifying scored completions`,
    sampleStatusLabel: report.outcome === "completed" ? "Valid full-window sample" : report.outcome === "cancelled" ? "Cancelled · no prestige earned"
      : report.observedActiveMinutes < report.requiredActiveMinutes ? "Provisional · window still in progress" : "Incomplete · not enough qualifying patients",
    categories: report.categories.map(category => ({ ...category, label: categoryNames[category.id],
      scoreLabel: category.score === null ? "No sample yet" : inspectionScoreLabel(category.score),
      pointsLabel: category.weightedPoints === null ? `—/${category.weightPercent}` : `${inspectionScoreLabel(category.weightedPoints)}/${category.weightPercent}` })) };
}

/** The same domain evidence and preparation terms feed both presentations. */
export function createFacilityInspectionView(state: GameState): FacilityInspectionView {
  const inspection = state.levelFive?.inspection;
  const status = inspection?.status ?? "locked";
  const run = inspection?.run;
  const preparation = inspection?.preparation;
  const quote = preparation ?? getExecutivePreparationQuote(state, PROTOTYPE_DOMAIN_CONTEXT);
  const bookingDisabledReason = getInspectionBookingBlockedReason(state);
  const finished = state.levelFive?.progress.gameFinished;
  const statusLabel = status === "preparing" ? `Preparing · ${Math.max(0, preparation!.endsAtFacilityTick - state.facilityTick)} active min left`
    : status === "running" ? `Inspection running · ${run!.accumulators.observedActiveMinutes}/${run!.durationMinutes} active min`
      : status === "locked" ? "Inspection locked" : status === "ready" ? "Ready to book" : `Inspection ${status}`;
  return { status, statusLabel, bookingDisabledReason,
    preparationLabel: `${quote.rawDurationMinutes} raw → ${quote.durationMinutes} active min preparation${quote.executiveQuote ? ` · Executive tier ${quote.executiveQuote.employeeTrainingLevel}, ${quote.executiveQuote.reductionPercent}% saved` : " · no Executive required"}`,
    canCancel: status === "preparing" || status === "running",
    bookingLabel: status === "locked" ? "Book inspection · Locked" : inspection?.lastReport || status === "cancelled" ? "Book another inspection" : "Book inspection",
    sampleLabel: run ? `${run.accumulators.qualifyingCompletedEncounterIds.length}/20 qualifying scored completions` : "Five 10-hour operating days · at least 20 qualifying scored completions",
    ...(run ? { provisionalReport: inspectionReportView(createInspectionReport(run, state.facilityTick)) } : {}),
    ...(inspection?.lastReport ? { lastReport: inspectionReportView(inspection.lastReport) } : {}),
    ...(inspection?.latestCompletedReport ? { latestLabel: inspectionScoreLabel(inspection.latestCompletedReport.rawTotalScore!) } : {}),
    ...(inspection?.bestCompletedReport ? { bestLabel: inspectionScoreLabel(inspection.bestCompletedReport.rawTotalScore!) } : {}),
    firstCompletionRecorded: Boolean(finished),
    ...(finished ? { finish: {
      headline: "Congratulations. Your reward is a report card and the opportunity to improve it.",
      lines: ["The inspectors have left. Their recommendations have moved in.", "You may now chase a perfect score. The invoices will chase you."],
      finishedLabel: `Game finished ${facilityTimeLabel(state, finished.finishedAtFacilityTick)}`,
      acknowledged: state.levelFive!.progress.finishPageAcknowledgedAtFacilityTick !== null,
      report: inspectionReportView(finished.firstCompletedReport),
    } } : {}) };
}
