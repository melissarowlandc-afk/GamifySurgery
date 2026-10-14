import { useEffect, useRef } from "react";
import { PixelAvatar } from "../ui/PixelAvatar";
import { employeeDiscussionChartView } from "../ui/EmployeeDiscussionPanel";
import type { AnswerChoiceView, ChartClinicalReviewView, ChartDecisionStepView, ChartPendingPhaseView, ChartView, EmployeeDiscussionView } from "../ui/types";

interface MobileChartProps {
  chart: ChartView;
  onClose: () => void;
  onSubmitAnswer: (choiceId: string) => void;
  onFlagQuestion: (decisionNodeId: string) => void;
  onAcknowledgeTerminalFeedback: () => void;
  onToggleSummary: () => void;
  onFileChart: () => void;
}

/** Same legacy compatibility and action precedence as the desktop chart. */
export function mobileChartSteps(chart: ChartView): ChartDecisionStepView[] {
  if (chart.decisionSteps?.length) return chart.decisionSteps;
  if (!chart.questionPrompt && !chart.pendingLabel && !chart.feedbackBody && !chart.teachingPoint) return [];
  return [{ id: `${chart.id}.current`, heading: chart.statusLabel, statusLabel: chart.etaLabel,
    questionPrompt: chart.questionPrompt, answerChoices: chart.answerChoices, resultHeading: chart.pendingLabel ? "Pending" : undefined,
    resultBody: chart.pendingLabel, etaLabel: chart.etaLabel, feedbackTitle: chart.feedbackTitle, feedbackBody: chart.feedbackBody,
    teachingPoint: chart.teachingPoint, exhibit: chart.exhibit, current: true,
    complete: chart.questionPrompt === undefined && chart.pendingLabel === undefined }];
}

function Phases({ phases }: { phases: ChartPendingPhaseView[] }) {
  return <ol className="mobile-chart-phases">{phases.map((phase, index) => <li key={`${phase.label}.${index}`}>
    <strong>{phase.label} <small>({phase.location})</small></strong>
    <span>{phase.progressLabel}{phase.delayLabel ? ` · ${phase.delayLabel}` : ""}{phase.complete ? " ✓" : ""}</span>
  </li>)}</ol>;
}

function Exhibit({ exhibit }: { exhibit: NonNullable<ChartDecisionStepView["exhibit"]> }) {
  return <figure className="mobile-chart-exhibit">
    {exhibit.kind === "table" ? <div className="mobile-table-scroll" tabIndex={0} role="region" aria-label={exhibit.caption}>
      <table><caption>{exhibit.caption}</caption><thead><tr><td aria-hidden="true" />
        {exhibit.columnHeaders.map((header, index) => <th scope="col" key={index}>{header}</th>)}
      </tr></thead><tbody>{exhibit.cells.map((cells, index) => <tr key={index}>
        <th scope="row">{exhibit.rowHeaders[index]}</th>{cells.map((cell, column) => <td key={column}>{cell}</td>)}
      </tr>)}</tbody></table>
    </div> : exhibit.kind === "keyValue" ? <>
      {exhibit.caption ? <figcaption>{exhibit.caption}</figcaption> : null}
      <dl>{exhibit.items.map((item, index) => <div key={index}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
    </> : <><figcaption>{exhibit.title}</figcaption><p>{exhibit.body}</p></>}
  </figure>;
}

function WaitEstimate({ choice }: { choice: AnswerChoiceView }) {
  return choice.etaLabel || choice.detailLabel ? <span className="mobile-answer-wait">
    {choice.etaLabel ? <span>Wait estimate: {choice.etaLabel}</span> : null}
    {choice.detailLabel ? <small>{choice.detailLabel}</small> : null}
  </span> : null;
}

function Decision({ step, chart, onSubmitAnswer, onFlagQuestion }: Pick<MobileChartProps, "chart" | "onSubmitAnswer" | "onFlagQuestion"> & { step: ChartDecisionStepView }) {
  const answered = step.answerChoices.some((choice) => choice.selected);
  return <div className="mobile-decision-content">
    {step.resultBody && step.resultBody !== chart.pendingLabel ? <div className="mobile-chart-result" role="status">
      <strong>{step.resultHeading ?? "Result"}</strong>{step.etaLabel ? <span>{step.etaLabel}</span> : null}
      <p>{step.resultPhases?.length && step.resultSummary ? step.resultSummary : step.resultBody}</p>
      {step.resultPhases?.length ? <Phases phases={step.resultPhases} /> : null}
    </div> : null}
    {step.exhibit ? <Exhibit exhibit={step.exhibit} /> : null}
    <div className="mobile-decision-heading"><h3>{step.heading}</h3>{step.statusLabel ? <span>{step.statusLabel}</span> : null}
      {step.current && step.questionPrompt && step.questionVariantId ? <button type="button" className="mobile-question-flag"
        disabled={step.flaggedForDeveloperReview} onClick={() => onFlagQuestion(step.id)}
        aria-label={step.flaggedForDeveloperReview ? "Question flagged for developer review" : "Flag this question for developer review"}>
        {step.flaggedForDeveloperReview ? "Flagged" : "Flag for review"}
      </button> : null}
    </div>
    {step.questionPrompt ? <p className="mobile-question">{step.questionPrompt}</p> : null}
    {step.questionPrompt ? <div className="mobile-answers" data-tutorial-anchor={step.current ? "current-answer-choices" : undefined}>
      {step.answerChoices.map((choice) => <div className="mobile-answer-item" key={choice.id}>
        <button type="button" className={`mobile-answer${choice.selected ? " is-selected" : ""}${choice.revealedCorrect ? " is-correct" : ""}`}
          data-phone-anchor={step.current ? "choice" : undefined} data-choice-id={choice.id} disabled={choice.disabled || !step.current || answered || chart.readOnly}
          onClick={() => onSubmitAnswer(choice.id)}>
          <span>{choice.label}</span>
          {choice.selected ? <strong className="mobile-answer-tag">Your answer{step.feedbackTitle === "Correct" ? " ✓" : step.feedbackTitle === "Incorrect" ? " ✕" : ""}</strong>
            : answered && choice.revealedCorrect ? <strong className="mobile-answer-tag">Correct answer</strong> : null}
          <WaitEstimate choice={choice} />
        </button>
        {answered && choice.rationale ? <details className="mobile-choice-rationale"><summary>Why this choice</summary><p>{choice.rationale}</p></details> : null}
      </div>)}
    </div> : null}
    {step.feedbackBody || step.teachingPoint ? <section className={`mobile-feedback${step.feedbackTitle === "Incorrect" ? " is-incorrect" : ""}`}
      role="status" data-phone-anchor="feedback" data-tutorial-anchor={step.current ? "current-decision-feedback" : undefined}>
      <h4>{step.feedbackTitle ?? "Teaching feedback"}{step.rewardLabel ? ` · ${step.rewardLabel}` : ""}</h4>
      {step.feedbackBody ? <p>{step.feedbackBody}</p> : null}
      {step.teachingPoint && step.teachingPoint !== step.feedbackBody ? <><strong>Teaching point</strong><p>{step.teachingPoint}</p></> : null}
      {step.nextActionLabel ? <p>{step.nextActionLabel}</p> : null}
    </section> : null}
  </div>;
}

function Sources({ review }: { review: ChartClinicalReviewView }) {
  const claims = new Map(review.claims.map((claim) => [claim.id, claim]));
  return <details className="mobile-chart-sources">
    <summary>Sources &amp; Clinical Review ({review.sources.length})</summary>
    <p>Content version {review.contentVersion}</p>
    <p>Clinical review: {review.reviewStatus.replaceAll("_", " ")}</p>
    <p>Last clinician review: {review.lastClinicianReview ?? "None recorded"}</p>
    <ol>{review.sources.map((source) => <li key={source.id}>
      <a href={source.href} target="_blank" rel="noopener noreferrer">{source.title}</a>
      <span>{source.organizationOrJournal} · {source.year ?? "undated"}</span>
      <small>{source.reuseStatus}</small><small>Last source check: {source.lastChecked}</small>
      <details><summary>Supported claims ({source.supportedClaimIds.filter((id) => claims.has(id)).length})</summary>
        <ul>{source.supportedClaimIds.map((id) => { const claim = claims.get(id); return claim ? <li key={id}><code>{id}</code><p>{claim.statement}</p></li> : null; })}</ul>
      </details>
    </li>)}</ol>
    <p>AI-assisted draft content. Automated checks do not constitute clinical approval.</p>
  </details>;
}

export function MobileChart(props: MobileChartProps) {
  const { chart, onClose, onAcknowledgeTerminalFeedback, onFileChart, onToggleSummary } = props;
  const steps = mobileChartSteps(chart);
  const current = steps.find((step) => step.current);
  const feedbackStep = steps.find((step) => step.current && (step.feedbackBody || step.teachingPoint))
    ?? steps.find((step) => !step.complete && (step.feedbackBody || step.teachingPoint));
  const summary = chart.summaryAvailable && chart.summaryVisible;
  const scrollRef = useRef<HTMLDivElement>(null);
  const attentionKey = feedbackStep ? `${feedbackStep.id}.feedback` : chart.pendingLabel ? `${chart.id}.pending` : null;
  useEffect(() => {
    if (!attentionKey) return;
    const frame = window.requestAnimationFrame(() => scrollRef.current?.querySelector<HTMLElement>(".mobile-decision.is-current .mobile-feedback, .mobile-decision.is-past[open] .mobile-feedback, .mobile-chart-pending")?.scrollIntoView({ block: "nearest" }));
    return () => window.cancelAnimationFrame(frame);
  }, [attentionKey]);
  const primary = chart.terminalFeedbackNeedsAcknowledgment
    ? { label: chart.primaryActionLabel ?? "Continue", run: chart.primaryActionClosesChart ? onClose : onAcknowledgeTerminalFeedback, anchor: "decision-feedback-action" }
    : chart.canFile ? { label: chart.primaryActionLabel ?? (chart.readOnly ? "Close Resolved Chart" : "Resolve Completed Chart"), run: onFileChart, anchor: "resolve-chart" }
      : { label: chart.primaryActionLabel ?? (chart.pendingLabel ? "Return to clinic" : "Close chart"), run: onClose, anchor: undefined };
  const demographics = chart.subtitleLabel ?? ([chart.ageLabel, chart.sexLabel].filter(Boolean).join(" · ") || chart.patientDetails);
  const rewardLabels = [chart.reward?.moneyLabel, chart.reward?.xpLabel, chart.reward?.satisfactionLabel].filter(Boolean);
  return <article className="mobile-chart" data-phone-anchor="chart" aria-label={`${chart.patientName} ${chart.subjectKind === "team_discussion" ? "team discussion" : "chart"}`}>
    <div className="mobile-chart-scroll" ref={scrollRef} key={`${chart.id}.${summary ? "summary" : "front"}`}>
      <header className="mobile-chart-identity">
        <PixelAvatar avatar={chart.avatar} label={`${chart.patientName} portrait`} size="small" />
        <div><h3>{chart.patientName}</h3><p>{demographics}</p>{chart.chiefComplaint ? <strong>{chart.chiefComplaint}</strong> : null}</div>
        <p className="mobile-chart-status">{chart.statusLabel}{chart.etaLabel ? ` · ${chart.etaLabel}` : ""}</p>
        {chart.patientSatisfactionLabel ? <p>Satisfaction {chart.patientSatisfactionLabel.replace(/^Satisfaction:?\s*/i, "")}</p> : null}
        {chart.executiveComfortLabel ? <p>{chart.executiveComfortLabel}</p> : null}
      </header>
      {summary ? <section aria-label="Diagnosis and management summary" className="mobile-learning-summary" data-phone-anchor="summary">
        <h3>{chart.clinicalReview?.diagnosisName ?? "Diagnosis & management"}</h3>
        {chart.clinicalReview?.sections.length ? chart.clinicalReview.sections.map((section) => <section key={section.id}><h4>{section.heading}</h4><p>{section.body}</p></section>) : <p>{chart.summaryBody}</p>}
      </section> : <>
        <section className="mobile-chart-story" aria-label={chart.subjectKind === "team_discussion" ? "Discussion scenario" : "Patient presentation"}>
          <p>{chart.presentation}</p>
          {chart.vitals?.length ? <dl className="mobile-vitals" aria-label="Vital signs">{chart.vitals.map((vital) => <div key={vital.id}><dt>{vital.label}</dt><dd>{vital.value}</dd></div>)}</dl> : null}
          {(current?.currentUpdate ?? chart.presentationUpdate) ? <div className="mobile-chart-update"><strong>Current update</strong><p>{current?.currentUpdate ?? chart.presentationUpdate}</p></div> : null}
        </section>
        {steps.map((step) => step.current ? <section className="mobile-decision is-current" key={step.id} aria-label={step.heading}><Decision {...props} step={step} /></section>
          : <details className="mobile-decision is-past" key={step.id} open={!step.complete && !chart.pendingLabel && Boolean(step.feedbackBody || step.teachingPoint || step.resultBody) || undefined}>
            <summary>{step.heading} · {step.collapsedResultLabel ?? step.feedbackTitle ?? (step.complete ? "Completed" : step.statusLabel ?? "In progress")}</summary>
            <Decision {...props} step={step} />
          </details>)}
        {!steps.length ? <p>No further clinical decisions are waiting.</p> : null}
        {chart.pendingLabel ? <section className="mobile-chart-pending" role="status">
          <h3>{chart.pendingPatientIsAway === false ? "Patient is in clinic" : "Patient is away"}</h3>
          <p>{chart.pendingPhases?.length && chart.pendingSummary ? chart.pendingSummary : chart.pendingLabel}</p>
          {chart.etaLabel ? <p>Wait estimate: {chart.etaLabel}</p> : null}
          {chart.pendingPhases?.length ? <Phases phases={chart.pendingPhases} /> : null}
        </section> : null}
        {chart.terminalOutcomeBody ? <section className="mobile-chart-outcome"><h3>{chart.terminalOutcomeTitle ?? "What happened"}</h3><p>{chart.terminalOutcomeBody}</p></section> : null}
      </>}
      {rewardLabels.length ? <section className="mobile-chart-reward" role="status" data-phone-anchor="summary" data-tutorial-anchor="encounter-summary">
        <strong>{chart.reward?.heading ?? "Rewards earned"}</strong>{rewardLabels.map((label) => <span key={label}>{label}</span>)}
      </section> : null}
      {chart.summaryAvailable && chart.clinicalReview ? <Sources review={chart.clinicalReview} /> : null}
    </div>
    <footer className="mobile-chart-actions">
      {chart.summaryAvailable ? <button type="button" onClick={onToggleSummary} aria-pressed={summary} data-phone-anchor="summary-toggle" data-tutorial-anchor="flip-chart">
        {summary ? "Return to chart front" : "More disease information"}
      </button> : null}
      <button type="button" className="mobile-primary" onClick={primary.run} data-phone-anchor="primary" data-tutorial-anchor={primary.anchor}>{primary.label}</button>
    </footer>
  </article>;
}

export function MobileTeamDiscussion({ discussion, onAnswer, onAcknowledge, onFile, onClose }: {
  discussion: EmployeeDiscussionView; onAnswer: (id: string) => void; onAcknowledge: () => void; onFile: () => void; onClose: () => void;
}) {
  return <MobileChart chart={employeeDiscussionChartView(discussion)} onClose={onClose} onSubmitAnswer={onAnswer}
    onFlagQuestion={() => {}} onAcknowledgeTerminalFeedback={onAcknowledge} onToggleSummary={() => {}} onFileChart={onFile} />;
}
