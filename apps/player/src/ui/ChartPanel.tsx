import { PixelAvatar } from "./PixelAvatar";
import type {
  ChartDecisionStepView,
  ChartView,
} from "./types";

interface ChartPanelProps {
  chart: ChartView | null;
  onClose: () => void;
  onSubmitAnswer: (choiceId: string) => void;
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
    <div className="chart-reward-banner" role="status">
      <strong>{reward.heading ?? "Rewards earned"}</strong>
      <span>
        {[reward.moneyLabel, reward.xpLabel, reward.satisfactionLabel]
          .filter(Boolean)
          .join("  |  ")}
      </span>
    </div>
  );
}

export function ChartPanel({
  chart,
  onClose,
  onSubmitAnswer,
  onAcknowledgeTerminalFeedback,
  onToggleSummary,
  onFileChart,
}: ChartPanelProps) {
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
  const hasQuestion = steps.some((step) => Boolean(step.questionPrompt));
  const showTimelineGuide = steps.length > 1 || hasQuestion;

  return (
    <aside
      className={`chart-panel chart-drawer${
        showingBack ? " is-showing-back" : ""
      }`}
      aria-label={`${chart.patientName} chart`}
      aria-live="polite"
    >
      <div className="chart-titlebar chart-drawer-titlebar">
        <div>
          <span className="eyebrow">Patient chart</span>
          <h2>{chart.patientName}</h2>
          <p>{chart.patientDetails}</p>
        </div>
        <div className="chart-title-actions">
          <span className="chart-title-status">{chart.statusLabel}</span>
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
          ) : (
            <div className="chart-workspace">
              <section className="chart-identity-column">
                <PixelAvatar
                  avatar={chart.avatar}
                  label={`${chart.patientName} portrait`}
                  size="large"
                />
                <h3>{chart.patientName}</h3>
                <p>{chart.patientDetails}</p>
                <span className="chart-state-badge">
                  {chart.statusLabel}
                </span>
              </section>

              <section className="chart-presentation-column">
                <span className="eyebrow">
                  {chart.presentationHeading ?? "Presentation"}
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
                {showTimelineGuide ? (
                  <p
                    className={`chart-timeline-guide ${
                      steps.length > 1
                        ? "is-history-guide"
                        : "is-option-guide"
                    }`}
                    id={`chart-timeline-guide-${chart.id}`}
                  >
                    {steps.length > 1
                      ? "Decision history"
                      : "Current decision"}
                    <span aria-hidden="true">
                      {steps.length > 1
                        ? "← scroll between steps →"
                        : "scroll for all options ↓"}
                    </span>
                  </p>
                ) : null}
                <div
                  className={`chart-decision-timeline${
                    steps.length > 1 ? " has-multiple-steps" : ""
                  }`}
                  aria-label="Encounter decisions and results"
                  aria-describedby={
                    showTimelineGuide
                      ? `chart-timeline-guide-${chart.id}`
                      : undefined
                  }
                  tabIndex={showTimelineGuide ? 0 : undefined}
                >
                  {steps.length === 0 ? (
                    <section className="chart-step-column is-empty">
                      <h3>Encounter complete</h3>
                      <p>No further clinical decisions are waiting.</p>
                    </section>
                  ) : (
                    steps.map((step, index) => (
                      <section
                        className={`chart-step-column${
                          step.current ? " is-current" : ""
                        }${step.complete ? " is-complete" : ""}`}
                        key={step.id}
                      >
                        <div className="chart-step-heading">
                          <span>Step {index + 1}</span>
                          {step.statusLabel ? (
                            <small>{step.statusLabel}</small>
                          ) : null}
                        </div>
                        <h3>{step.heading}</h3>

                        {step.resultBody ? (
                          <div className="chart-result-card">
                            <strong>
                              {step.resultHeading ?? "Result"}
                            </strong>
                            <p>{step.resultBody}</p>
                            {step.etaLabel ? (
                              <small>{step.etaLabel}</small>
                            ) : null}
                          </div>
                        ) : null}

                        {step.questionPrompt ? (
                          <>
                            <p className="question-prompt">
                              {step.questionPrompt}
                            </p>
                            <div className="answer-list">
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
                                  <span
                                    className="choice-box"
                                    aria-hidden="true"
                                  />
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
                          <div className="chart-step-feedback">
                            <strong>
                              {step.feedbackTitle ?? "Teaching feedback"}
                            </strong>
                            <p>{step.feedbackBody}</p>
                          </div>
                        ) : null}
                      </section>
                    ))
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
                className="button button-secondary"
                type="button"
                onClick={onToggleSummary}
                aria-pressed={showingBack}
              >
                {showingBack ? "Return to chart front" : "Flip chart over"}
              </button>
            ) : null}

            {chart.terminalFeedbackNeedsAcknowledgment ? (
              <button
                className="button button-primary"
                type="button"
                onClick={onAcknowledgeTerminalFeedback}
              >
                {chart.primaryActionLabel ?? "Continue"}
              </button>
            ) : chart.canFile ? (
              <button
                className="button button-primary"
                type="button"
                onClick={onFileChart}
              >
                {chart.readOnly ? "Close resolved chart" : "Resolve chart"}
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
