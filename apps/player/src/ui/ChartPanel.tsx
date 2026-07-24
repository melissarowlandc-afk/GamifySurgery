import type { ChartView } from "./types";

interface ChartPanelProps {
  chart: ChartView | null;
  onClose: () => void;
  onSubmitAnswer: (choiceId: string) => void;
  onAcknowledgeTerminalFeedback: () => void;
  onToggleSummary: () => void;
  onFileChart: () => void;
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

  return (
    <aside
      className="chart-panel"
      aria-label={`${chart.patientName} chart`}
      aria-live="polite"
    >
      <div className="chart-titlebar">
        <div>
          <span className="eyebrow">Synthetic patient chart</span>
          <h2>{chart.patientName}</h2>
          <p>{chart.patientDetails}</p>
        </div>
        <button
          className="icon-button"
          type="button"
          onClick={onClose}
          aria-label="Close patient chart"
        >
          ×
        </button>
      </div>

      <div className="prototype-warning" role="note">
        Demonstration content only — not clinically approved and not medical
        advice.
      </div>

      <div className="chart-status">
        <strong>{chart.statusLabel}</strong>
        {chart.etaLabel ? <span>{chart.etaLabel}</span> : null}
      </div>

      <section className="chart-section">
        <h3>Presentation</h3>
        <p>{chart.presentation}</p>
      </section>

      {chart.pendingLabel ? (
        <section className="chart-section pending-result">
          <h3>Pending</h3>
          <p>{chart.pendingLabel}</p>
        </section>
      ) : null}

      {chart.questionPrompt ? (
        <section className="chart-section">
          <h3>Decision</h3>
          <p className="question-prompt">{chart.questionPrompt}</p>
          <div className="answer-list">
            {chart.answerChoices.map((choice) => (
              <button
                className={`answer-choice${choice.selected ? " is-selected" : ""}`}
                type="button"
                key={choice.id}
                onClick={() => onSubmitAnswer(choice.id)}
                disabled={choice.disabled}
              >
                <span className="choice-box" aria-hidden="true" />
                {choice.label}
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {chart.terminalOutcomeBody ? (
        <section
          className={`chart-section terminal-outcome is-${chart.terminalOutcomeSeverity ?? "minor"}`}
        >
          <span className="eyebrow">
            {chart.terminalOutcomeSeverity === "major"
              ? "Major simulated outcome"
              : "Simulated outcome"}
          </span>
          <h3>{chart.terminalOutcomeTitle ?? "What happened"}</h3>
          <p>{chart.terminalOutcomeBody}</p>
        </section>
      ) : null}

      {chart.feedbackBody ? (
        <section className="chart-section feedback-panel">
          <h3>{chart.feedbackTitle ?? "Teaching feedback"}</h3>
          <p>{chart.feedbackBody}</p>
        </section>
      ) : null}

      {chart.terminalFeedbackNeedsAcknowledgment ? (
        <button
          className="button button-primary button-wide"
          type="button"
          onClick={onAcknowledgeTerminalFeedback}
        >
          I understand — continue
        </button>
      ) : null}

      {chart.summaryAvailable ? (
        <section className="chart-section summary-panel">
          <button
            className="button button-secondary"
            type="button"
            onClick={onToggleSummary}
            aria-expanded={chart.summaryVisible}
          >
            {chart.summaryVisible
              ? "Hide learning summary"
              : "Flip chart: learning summary"}
          </button>
          {chart.summaryVisible ? (
            <div className="summary-copy">
              <h3>Diagnosis &amp; management summary</h3>
              <p>{chart.summaryBody}</p>
            </div>
          ) : null}
        </section>
      ) : null}

      {chart.canFile ? (
        <button
          className="button button-primary button-wide"
          type="button"
          onClick={onFileChart}
        >
          {chart.readOnly ? "Close resolved chart" : "File in Resolved"}
        </button>
      ) : null}
    </aside>
  );
}
