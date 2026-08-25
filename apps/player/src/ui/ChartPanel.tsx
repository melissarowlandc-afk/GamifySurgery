import { useEffect, useRef } from "react";
import { PixelAvatar } from "./PixelAvatar";
import type {
  ChartClinicalReviewView,
  ChartDecisionStepView,
  ChartView,
} from "./types";
import "./clinicalReview.css";

interface ChartPanelProps {
  chart: ChartView | null;
  onClose: () => void;
  onSubmitAnswer: (choiceId: string) => void;
  onFlagQuestion: (decisionNodeId: string) => void;
  onAcknowledgeTerminalFeedback: () => void;
  onToggleSummary: () => void;
  onFileChart: () => void;
}

function getDecisionSteps(chart: ChartView): ChartDecisionStepView[] {
  if (chart.decisionSteps && chart.decisionSteps.length > 0) {
    return chart.decisionSteps;
  }

  if (
    !chart.questionPrompt &&
    !chart.pendingLabel &&
    !chart.feedbackBody
  ) {
    return [];
  }

  return [
    {
      id: `${chart.id}.current`,
      heading: chart.statusLabel,
      statusLabel: chart.etaLabel,
      questionPrompt: chart.questionPrompt,
      answerChoices: chart.answerChoices,
      resultHeading: chart.pendingLabel ? "Pending" : undefined,
      resultBody: chart.pendingLabel,
      etaLabel: chart.etaLabel,
      feedbackTitle: chart.feedbackTitle,
      feedbackBody: chart.feedbackBody,
      current: true,
      complete:
        chart.questionPrompt === undefined && chart.pendingLabel === undefined,
    },
  ];
}

function RewardBanner({ chart }: { chart: ChartView }) {
  const reward = chart.reward;
  if (
    !reward ||
    (!reward.moneyLabel &&
      !reward.xpLabel &&
      !reward.satisfactionLabel)
  ) {
    return null;
  }

  return (
    <div
      className="chart-reward-banner"
      data-tutorial-anchor="encounter-summary"
      role="status"
    >
      <strong>{reward.heading ?? "Rewards earned"}</strong>
      {[reward.moneyLabel, reward.xpLabel, reward.satisfactionLabel]
        .filter((label): label is string => Boolean(label))
        .map((label) => (
          <span key={label}>{label}</span>
        ))}
    </div>
  );
}

function displayReviewStatus(status: string): string {
  return status.replaceAll("_", " ");
}

function ClinicalReviewBack({
  review,
  fallbackSummary,
}: {
  review: ChartClinicalReviewView;
  fallbackSummary?: string;
}) {
  const claimsById = new Map(
    review.claims.map((claim) => [claim.id, claim]),
  );

  return (
    <section
      className="chart-back-content clinical-review-back"
      aria-label={`${review.diagnosisName} diagnosis and management summary`}
    >
      <div className="chart-back-stamp" aria-hidden="true">
        Learning summary
      </div>
      <span className="eyebrow">Back of chart</span>
      <h3>{review.diagnosisName}</h3>
      <div className="clinical-summary-sections">
        {review.sections.map((section) => (
          <section key={section.id}>
            <h4>{section.heading}</h4>
            <p>{section.body}</p>
          </section>
        ))}
        {review.sections.length === 0 && fallbackSummary ? (
          <p>{fallbackSummary}</p>
        ) : null}
      </div>

      <details className="clinical-source-review">
        <summary>
          Sources &amp; Clinical Review ({review.sources.length})
        </summary>
        <div className="clinical-review-metadata">
          <span>Content version {review.contentVersion}</span>
          <span>
            Clinical review: {displayReviewStatus(review.reviewStatus)}
          </span>
          <span>
            Last clinician review:{" "}
            {review.lastClinicianReview ?? "None recorded"}
          </span>
        </div>
        <ol className="clinical-source-list">
          {review.sources.map((source) => {
            const supportedClaims = source.supportedClaimIds
              .map((claimId) => claimsById.get(claimId))
              .filter(
                (
                  claim,
                ): claim is ChartClinicalReviewView["claims"][number] =>
                  claim !== undefined,
              );
            return (
              <li key={source.id}>
                <a
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {source.title}
                </a>
                <span>
                  {source.organizationOrJournal} · {source.year}
                </span>
                <span>{source.reuseStatus}</span>
                <span>Last source check: {source.lastChecked}</span>
                <details>
                  <summary>
                    Supported claims ({supportedClaims.length})
                  </summary>
                  <ul>
                    {supportedClaims.map((claim) => (
                      <li key={claim.id}>
                        <code>{claim.id}</code>
                        <span>{claim.statement}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ol>
        <p className="clinical-review-notice">
          AI-assisted draft content. Automated checks do not constitute
          clinical approval.
        </p>
      </details>
    </section>
  );
}

function DecisionStepContent({
  step,
  onSubmitAnswer,
  onFlagQuestion,
}: {
  step: ChartDecisionStepView;
  onSubmitAnswer: (choiceId: string) => void;
  onFlagQuestion: (decisionNodeId: string) => void;
}) {
  return (
    <>
      {step.resultBody ? (
        <div className="chart-result-card">
          <strong>{step.resultHeading ?? "Result"}</strong>
          <p>{step.resultBody}</p>
          {step.etaLabel ? <small>{step.etaLabel}</small> : null}
        </div>
      ) : null}

      {step.questionPrompt ? (
        <>
          <div className="question-prompt-row">
            <p className="question-prompt">{step.questionPrompt}</p>
            {step.questionVariantId ? (
              <button
                className={`question-review-flag${
                  step.flaggedForDeveloperReview ? " is-flagged" : ""
                }`}
                type="button"
                onClick={() => onFlagQuestion(step.id)}
                disabled={step.flaggedForDeveloperReview}
                aria-label={
                  step.flaggedForDeveloperReview
                    ? "Question flagged for developer review"
                    : "Flag this question for developer review"
                }
                title={
                  step.flaggedForDeveloperReview
                    ? "Flagged for developer review"
                    : "Flag question for developer review"
                }
              >
                <span
                  className="question-review-flag-mark"
                  aria-hidden="true"
                />
                <span>
                  {step.flaggedForDeveloperReview
                    ? "Flagged"
                    : "Flag question"}
                </span>
              </button>
            ) : null}
          </div>
          <div
            className="answer-list"
            data-tutorial-anchor={
              step.current ? "current-answer-choices" : undefined
            }
          >
            {step.answerChoices.map((choice) => (
              <button
                className={`answer-choice${
                  choice.selected ? " is-selected" : ""
                }`}
                type="button"
                key={choice.id}
                onClick={() => onSubmitAnswer(choice.id)}
                disabled={choice.disabled}
              >
                <span className="choice-box" aria-hidden="true" />
                <span className="answer-choice-copy">
                  <strong>{choice.label}</strong>
                  {choice.detailLabel ? (
                    <small>{choice.detailLabel}</small>
                  ) : null}
                </span>
                {choice.etaLabel ? (
                  <span className="answer-choice-eta">
                    {choice.etaLabel}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </>
      ) : null}

      {step.feedbackBody ? (
        <div
          className={`chart-step-feedback${
            step.feedbackTitle === "Correct"
              ? " is-correct"
              : step.feedbackTitle === "Incorrect"
                ? " is-incorrect"
                : ""
          }`}
          data-tutorial-anchor={
            step.current ? "current-decision-feedback" : undefined
          }
          role="status"
        >
          <strong>
            {step.feedbackTitle === "Correct"
              ? "Correct ✓"
              : step.feedbackTitle === "Incorrect"
                ? "Incorrect ✕"
                : step.feedbackTitle ?? "Teaching feedback"}
          </strong>
          <p>{step.feedbackBody}</p>
          {step.rewardLabel ? (
            <span className="chart-decision-reward">
              {step.rewardLabel}
            </span>
          ) : null}
          {step.nextActionLabel ? (
            <span className="chart-decision-next">
              {step.nextActionLabel}
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export function ChartPanel({
  chart,
  onClose,
  onSubmitAnswer,
  onFlagQuestion,
  onAcknowledgeTerminalFeedback,
  onToggleSummary,
  onFileChart,
}: ChartPanelProps) {
  const panelRef = useRef<HTMLElement>(null);
  const visibleFeedbackStepId =
    chart?.decisionSteps?.find(
      (step) => step.current && Boolean(step.feedbackBody),
    )?.id ?? null;

  useEffect(() => {
    if (!visibleFeedbackStepId) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      panelRef.current
        ?.querySelector<HTMLElement>(
          ".chart-step-column.is-current .chart-step-feedback",
        )
        ?.scrollIntoView({
          block: "nearest",
          inline: "nearest",
        });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [visibleFeedbackStepId]);

  if (!chart) {
    return null;
  }

  const steps = getDecisionSteps(chart);
  const showingBack = chart.summaryAvailable && chart.summaryVisible;
  const hasReward = Boolean(
    chart.reward &&
      (chart.reward.moneyLabel ||
        chart.reward.xpLabel ||
        chart.reward.satisfactionLabel),
  );
  const hasActionBar =
    hasReward ||
    chart.summaryAvailable ||
    chart.terminalFeedbackNeedsAcknowledgment ||
    chart.canFile ||
    Boolean(chart.pendingLabel);
  const visibleStatusLabel = /^Question \d+ of \d+$/i.test(
    chart.statusLabel,
  )
    ? "Clinical decision"
    : chart.statusLabel;
  const satisfactionLabel = chart.patientSatisfactionLabel
    ? /^satisfaction\b/i.test(chart.patientSatisfactionLabel)
      ? chart.patientSatisfactionLabel
      : `Satisfaction ${chart.patientSatisfactionLabel}`
    : undefined;
  const headerDetails = [
    chart.ageLabel,
    chart.sexLabel,
    ...(chart.vitals?.map((vital) => `${vital.label} ${vital.value}`) ??
      []),
  ].filter(Boolean);
  const titleStatusLabel =
    visibleStatusLabel === "Action required"
      ? "! Action required"
      : visibleStatusLabel;

  return (
    <aside
      ref={panelRef}
      className={`chart-panel chart-drawer paper-chart${
        showingBack ? " is-showing-back" : ""
      }`}
      aria-label={`${chart.patientName} chart`}
      aria-live="polite"
    >
      <span className="paper-chart-stack is-left" aria-hidden="true" />
      <span className="paper-chart-stack is-right" aria-hidden="true" />
      <span className="paper-chart-clip" aria-hidden="true">
        <span />
      </span>
      <div className="chart-titlebar chart-drawer-titlebar">
        <div>
          <span className="eyebrow">Patient chart</span>
          <h2>{chart.patientName}</h2>
          <p className="chart-demographic-line">{headerDetails.join(" · ")}</p>
        </div>
        <div className="chart-title-actions">
          <span className="chart-title-status">{titleStatusLabel}</span>
          <button
            className="icon-button"
            type="button"
            onClick={onClose}
            aria-label="Close patient chart"
          >
            Close
          </button>
        </div>
      </div>

      <div className="chart-flip-stage">
        <div
          className={`chart-card-face ${
            showingBack ? "is-back" : "is-front"
          }`}
          key={showingBack ? "back" : "front"}
        >
          {showingBack ? (
            chart.clinicalReview ? (
              <ClinicalReviewBack
                review={chart.clinicalReview}
                fallbackSummary={chart.summaryBody}
              />
            ) : (
              <section
                className="chart-back-content"
                aria-label="Diagnosis and management summary"
              >
                <div className="chart-back-stamp" aria-hidden="true">
                  Learning summary
                </div>
                <span className="eyebrow">Back of chart</span>
                <h3>Diagnosis &amp; management</h3>
                <p>{chart.summaryBody}</p>
              </section>
            )
          ) : (
            <div className="chart-workspace">
              <section className="chart-identity-column">
                <PixelAvatar
                  avatar={chart.avatar}
                  label={`${chart.patientName} portrait`}
                  size="large"
                />
                {satisfactionLabel ? (
                  <span className="chart-confidence-badge">
                    {satisfactionLabel}
                  </span>
                ) : null}
              </section>

              <section className="chart-presentation-column">
                {chart.chiefComplaint ? (
                  <div className="chart-clinical-section">
                    <span className="eyebrow">Chief complaint</span>
                    <p>{chart.chiefComplaint}</p>
                  </div>
                ) : null}
                <span className="eyebrow">
                  {chart.presentationHeading ?? "HPI & presentation"}
                </span>
                <p>{chart.presentation}</p>
                {chart.pendingLabel ? (
                  <div className="chart-pending-card">
                    <strong>Patient is away</strong>
                    <span>{chart.pendingLabel}</span>
                    {chart.etaLabel ? <small>{chart.etaLabel}</small> : null}
                  </div>
                ) : null}
              </section>

              <div className="chart-decision-region">
                <div
                  className={`chart-decision-timeline chart-decision-stack${
                    steps.length > 1 ? " has-multiple-steps" : ""
                  }`}
                  aria-label="Encounter decisions and results"
                >
                  {steps.length === 0 ? (
                    <section className="chart-step-column is-empty">
                      <h3>Encounter complete</h3>
                      <p>No further clinical decisions are waiting.</p>
                    </section>
                  ) : (
                    steps.map((step) =>
                      step.complete && !step.current ? (
                        <details
                          className="chart-completed-decision"
                          key={step.id}
                        >
                          <summary>
                            <span>
                              {step.heading.replace(/\s+of\s+\d+$/i, "")}{" "}
                              Result
                              {" — "}
                              {step.collapsedResultLabel ??
                                step.feedbackTitle ??
                                "Completed"}
                            </span>
                          </summary>
                          <div className="chart-completed-decision-body">
                            <DecisionStepContent
                              step={step}
                              onSubmitAnswer={onSubmitAnswer}
                              onFlagQuestion={onFlagQuestion}
                            />
                          </div>
                        </details>
                      ) : (
                        <section
                          className={`chart-step-column${
                            step.current ? " is-current" : ""
                          }`}
                          key={step.id}
                        >
                          {step.current && chart.presentationUpdate ? (
                            <div
                              className="chart-current-update chart-decision-update"
                              data-testid="chart-current-update"
                            >
                              <span className="eyebrow">Current update</span>
                              <p>{chart.presentationUpdate}</p>
                            </div>
                          ) : null}
                          <div className="chart-step-heading">
                            <span>{step.heading}</span>
                            {step.statusLabel ? (
                              <small>{step.statusLabel}</small>
                            ) : null}
                          </div>
                          <DecisionStepContent
                            step={step}
                            onSubmitAnswer={onSubmitAnswer}
                            onFlagQuestion={onFlagQuestion}
                          />
                        </section>
                      ),
                    )
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {chart.terminalOutcomeBody && !showingBack ? (
        <section
          className={`chart-terminal-strip is-${
            chart.terminalOutcomeSeverity ?? "minor"
          }`}
        >
          <strong>{chart.terminalOutcomeTitle ?? "What happened"}</strong>
          <span>{chart.terminalOutcomeBody}</span>
        </section>
      ) : null}

      {hasActionBar ? (
        <footer className="chart-action-bar">
          <RewardBanner chart={chart} />
          <div className="chart-action-buttons">
            {chart.summaryAvailable ? (
              <button
                className="button button-secondary chart-flip-button"
                data-tutorial-anchor="flip-chart"
                type="button"
                onClick={onToggleSummary}
                aria-pressed={showingBack}
              >
                {showingBack
                  ? "Return to chart front"
                  : "Flip for More Disease Information"}
              </button>
            ) : null}

            {chart.terminalFeedbackNeedsAcknowledgment ? (
              <button
                className="button button-primary chart-resolve-button"
                data-tutorial-anchor="decision-feedback-action"
                type="button"
                onClick={onAcknowledgeTerminalFeedback}
              >
                {chart.primaryActionLabel ?? "Continue"}
              </button>
            ) : chart.canFile ? (
              <button
                className="button button-primary"
                data-tutorial-anchor="resolve-chart"
                type="button"
                onClick={onFileChart}
              >
                {chart.readOnly
                  ? "Close Resolved Chart"
                  : "Resolve Completed Chart"}
              </button>
            ) : chart.pendingLabel ? (
              <button
                className="button button-primary"
                type="button"
                onClick={onClose}
              >
                {chart.primaryActionLabel ?? "Return to clinic"}
              </button>
            ) : null}
          </div>
        </footer>
      ) : null}
    </aside>
  );
}
