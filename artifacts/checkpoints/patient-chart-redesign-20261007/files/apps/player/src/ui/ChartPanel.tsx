import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import "@fontsource/atkinson-hyperlegible/latin-400.css";
import "@fontsource/atkinson-hyperlegible/latin-700.css";
import { PixelAvatar } from "./PixelAvatar";
import type {
  AnswerChoiceView,
  ChartClinicalReviewView,
  ChartDecisionStepView,
  ChartPendingPhaseView,
  ChartView,
} from "./types";
import "./clinicalReview.css";
import "./chartSheet.css";

interface ChartPanelProps {
  chart: ChartView | null;
  onClose: () => void;
  onSubmitAnswer: (choiceId: string) => void;
  onFlagQuestion: (decisionNodeId: string) => void;
  onAcknowledgeTerminalFeedback: () => void;
  onToggleSummary: () => void;
  onFileChart: () => void;
}

/** Width that fits the two-column chart with a 2x2 answer grid. */
const CHART_PREFERRED_WIDTH = 1040;
/** Gap kept between the floating chart and the play-area edges. */
const CHART_EDGE_GAP = 8;
/** Matches the stylesheet's phone breakpoint, where the chart is a full sheet. */
const CHART_PHONE_MAX_WIDTH = 760;

interface ChartPrimaryAction {
  label: string;
  run: () => void;
  tutorialAnchor?: string;
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

/**
 * Floats the chart over the play area at its content height. It is centered
 * on the desk when the desk is wide enough, otherwise it starts at the desk's
 * left edge (keeping the patient list visible) and extends right, then left.
 * Height grows upward from the desk bottom over the map only when needed.
 */
function useChartPlacement(
  sheetRef: RefObject<HTMLElement | null>,
  active: boolean,
): CSSProperties | undefined {
  const [placement, setPlacement] = useState<CSSProperties>();

  useLayoutEffect(() => {
    const sheet = sheetRef.current;
    if (!active || !sheet) {
      return;
    }
    const desk = document.querySelector<HTMLElement>(".desk-workspace");
    const area = desk?.closest<HTMLElement>("main") ?? desk;
    if (!desk || !area) {
      return;
    }

    const place = () => {
      if (window.innerWidth <= CHART_PHONE_MAX_WIDTH) {
        setPlacement(undefined);
        return;
      }
      const deskRect = desk.getBoundingClientRect();
      const areaRect = area.getBoundingClientRect();
      const minLeft = areaRect.left + CHART_EDGE_GAP;
      const maxRight = areaRect.right - CHART_EDGE_GAP;
      const width = Math.min(CHART_PREFERRED_WIDTH, maxRight - minLeft);
      const preferredLeft =
        deskRect.width >= width
          ? deskRect.left + (deskRect.width - width) / 2
          : deskRect.left;
      const left = Math.max(minLeft, Math.min(preferredLeft, maxRight - width));
      const next = {
        left: Math.round(left),
        width: Math.round(width),
        bottom: Math.round(Math.max(0, window.innerHeight - deskRect.bottom)),
        maxHeight: Math.round(
          Math.max(160, deskRect.bottom - areaRect.top - CHART_EDGE_GAP),
        ),
      };
      setPlacement((current) =>
        current &&
        current.left === next.left &&
        current.width === next.width &&
        current.bottom === next.bottom &&
        current.maxHeight === next.maxHeight
          ? current
          : next,
      );
    };

    place();
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(place);
    observer?.observe(desk);
    observer?.observe(area);
    observer?.observe(document.documentElement);
    window.addEventListener("resize", place);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", place);
    };
  }, [active, sheetRef]);

  return placement;
}

function displayReviewStatus(status: string): string {
  return status.replaceAll("_", " ");
}

function outcomeClass(title?: string): "is-correct" | "is-incorrect" | "is-neutral" {
  return title === "Correct"
    ? "is-correct"
    : title === "Incorrect"
      ? "is-incorrect"
      : "is-neutral";
}

function outcomeTitle(title?: string): string {
  return title === "Correct"
    ? "Correct ✓"
    : title === "Incorrect"
      ? "Incorrect ✕"
      : title ?? "Teaching feedback";
}

function decisionProgress(heading: string): { index: number; total: number } | null {
  const match = /(\d+)\s+of\s+(\d+)\s*$/i.exec(heading);
  if (!match) return null;
  const index = Number(match[1]);
  const total = Number(match[2]);
  return total > 1 && total <= 12 && index >= 1 && index <= total
    ? { index, total }
    : null;
}

function ClockIcon() {
  return (
    <svg className="cs-clock" viewBox="0 0 12 12" aria-hidden="true">
      <circle cx="6" cy="6" r="4.8" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 3.2v3l1.9 1.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
      <path d="M3 1v12" stroke="currentColor" strokeWidth="2" />
      <path d="M4 2h8l-2 3 2 3H4z" fill="currentColor" />
    </svg>
  );
}

function PhaseList({ phases }: { phases: ChartPendingPhaseView[] }) {
  return (
    <ol className="cs-phases">
      {phases.map((phase, index) => (
        <li
          className={phase.complete ? "is-complete" : undefined}
          key={`${phase.label}.${index}`}
        >
          <span>
            {phase.label} <small>({phase.location})</small>
          </span>
          <span className="cs-phase-progress">
            {phase.progressLabel}
            {phase.delayLabel ? ` · ${phase.delayLabel}` : ""}
          </span>
        </li>
      ))}
    </ol>
  );
}

function ResultCard({ step }: { step: ChartDecisionStepView }) {
  const phases = step.resultPhases ?? [];
  return (
    <div className="cs-result">
      <div className="cs-card-head">
        <strong>{step.resultHeading ?? "Result"}</strong>
        {step.etaLabel ? <span className="cs-chip">{step.etaLabel}</span> : null}
      </div>
      <p>{phases.length > 0 && step.resultSummary ? step.resultSummary : step.resultBody}</p>
      {phases.length > 0 ? <PhaseList phases={phases} /> : null}
    </div>
  );
}

function ActionRow({
  primary,
  children,
  className = "",
}: {
  primary: ChartPrimaryAction | null;
  children?: ReactNode;
  className?: string;
}) {
  if (!primary && !children) return null;
  return (
    <div className={`cs-actions ${className}`.trim()}>
      {children}
      {primary ? (
        <button
          className="cs-button is-primary cs-primary-action"
          data-tutorial-anchor={primary.tutorialAnchor}
          type="button"
          onClick={primary.run}
        >
          {primary.label}
          <kbd aria-hidden="true">⏎</kbd>
        </button>
      ) : null}
    </div>
  );
}

function CompletionRow({
  chart,
  primary,
  showingBack,
  onToggleSummary,
}: {
  chart: ChartView;
  primary: ChartPrimaryAction | null;
  showingBack: boolean;
  onToggleSummary: () => void;
}) {
  const reward = chart.reward;
  const rewardLabels = [
    reward?.moneyLabel,
    reward?.xpLabel,
    reward?.satisfactionLabel,
  ].filter((label): label is string => Boolean(label));

  return (
    <ActionRow primary={primary} className="is-completion">
      {rewardLabels.length > 0 ? (
        <div
          className="cs-reward"
          data-tutorial-anchor="encounter-summary"
          role="status"
        >
          <strong>{reward?.heading ?? "Rewards earned"}</strong>
          {rewardLabels.map((label) => (
            <span className="cs-chip" key={label}>
              {label}
            </span>
          ))}
        </div>
      ) : null}
      <span className="cs-spacer" />
      {chart.summaryAvailable ? (
        <button
          className="cs-button is-secondary"
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
    </ActionRow>
  );
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
                  {source.organizationOrJournal} · {source.year ?? "undated"}
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

function AnswerGrid({
  choices,
  current,
  onSubmitAnswer,
}: {
  choices: AnswerChoiceView[];
  current: boolean;
  onSubmitAnswer: (choiceId: string) => void;
}) {
  const showKeys = current && choices.length <= 9;
  return (
    <div
      className="cs-answers is-open"
      data-tutorial-anchor={current ? "current-answer-choices" : undefined}
    >
      {choices.map((choice, index) => (
        <button
          className="cs-answer"
          type="button"
          key={choice.id}
          onClick={() => onSubmitAnswer(choice.id)}
          disabled={choice.disabled}
        >
          {showKeys ? (
            <kbd className="cs-key" aria-hidden="true">
              {index + 1}
            </kbd>
          ) : (
            <span className="cs-key is-blank" aria-hidden="true" />
          )}
          <span className="cs-answer-label">{choice.label}</span>
          {choice.etaLabel ? (
            <span className="cs-wait" title={choice.detailLabel}>
              <ClockIcon />
              <span className="cs-wait-label">{choice.etaLabel}</span>
              {choice.detailLabel ? (
                <span className="cs-sr-only cs-wait-detail">. {choice.detailLabel}</span>
              ) : null}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  );
}

function AnsweredChoices({
  choices,
  feedbackTitle,
  showAll,
  onToggleShowAll,
}: {
  choices: AnswerChoiceView[];
  feedbackTitle?: string;
  showAll: boolean;
  onToggleShowAll: () => void;
}) {
  const outcome = outcomeClass(feedbackTitle);
  const revealedKeys = choices.filter((choice) => choice.revealedCorrect);
  const keyId =
    outcome === "is-incorrect" && revealedKeys.length === 1
      ? revealedKeys[0]!.id
      : null;
  const visible = choices.filter(
    (choice) => showAll || choice.selected || choice.id === keyId,
  );
  const hiddenCount = choices.length - visible.length;

  return (
    <>
      <div className="cs-answers is-answered">
        {visible.map((choice) => {
          const state = choice.selected
            ? `is-picked ${outcome}`
            : choice.id === keyId
              ? "is-key"
              : "is-other";
          const tag = choice.selected
            ? outcome === "is-correct"
              ? "Your answer ✓"
              : outcome === "is-incorrect"
                ? "Your answer ✕"
                : "Your answer"
            : choice.id === keyId
              ? "Correct answer"
              : undefined;
          return (
            <div className={`cs-answer-row ${state}`} key={choice.id}>
              <span>{choice.label}</span>
              {tag ? <span className="cs-tag">{tag}</span> : null}
            </div>
          );
        })}
      </div>
      {hiddenCount > 0 || showAll ? (
        <button className="cs-link" type="button" onClick={onToggleShowAll}>
          {showAll ? "Hide other choices" : `Show all ${choices.length} choices`}
        </button>
      ) : null}
    </>
  );
}

function FeedbackCard({
  step,
  children,
}: {
  step: ChartDecisionStepView;
  children?: ReactNode;
}) {
  return (
    <div
      className={`cs-feedback ${outcomeClass(step.feedbackTitle)}`}
      data-tutorial-anchor={step.current ? "current-decision-feedback" : undefined}
      role="status"
    >
      <div className="cs-card-head">
        <strong>{outcomeTitle(step.feedbackTitle)}</strong>
        {step.rewardLabel ? (
          <span className="cs-chip">{step.rewardLabel}</span>
        ) : null}
      </div>
      <p>{step.feedbackBody}</p>
      {step.nextActionLabel ? (
        <p className="cs-next">{step.nextActionLabel}</p>
      ) : null}
      {children}
    </div>
  );
}

function PastDecision({
  step,
  duplicateResultBody,
  defaultOpen,
  showAll,
  onToggleShowAll,
}: {
  step: ChartDecisionStepView;
  duplicateResultBody?: string;
  defaultOpen: boolean;
  showAll: boolean;
  onToggleShowAll: () => void;
}) {
  const outcome = outcomeClass(step.feedbackTitle);
  const shortHeading = step.heading.replace(/\s+of\s+\d+\s*$/i, "");
  const summaryLabel =
    step.collapsedResultLabel ??
    step.feedbackTitle ??
    (step.complete ? "Completed" : step.statusLabel ?? "In progress");
  const showResult =
    Boolean(step.resultBody) && step.resultBody !== duplicateResultBody;

  return (
    <details className="cs-past" open={defaultOpen || undefined}>
      <summary>
        <span className={`cs-mark ${outcome}`} aria-hidden="true">
          {outcome === "is-correct" ? "✓" : outcome === "is-incorrect" ? "✕" : "•"}
        </span>
        <span className="cs-past-heading">{shortHeading}</span>
        <span className="cs-past-label">{summaryLabel}</span>
      </summary>
      <div className="cs-past-body">
        {showResult ? <ResultCard step={step} /> : null}
        {step.questionPrompt ? (
          <p className="cs-past-prompt">{step.questionPrompt}</p>
        ) : null}
        {step.answerChoices.some((choice) => choice.selected) ? (
          <AnsweredChoices
            choices={step.answerChoices}
            feedbackTitle={step.feedbackTitle}
            showAll={showAll}
            onToggleShowAll={onToggleShowAll}
          />
        ) : null}
        {step.feedbackBody ? <FeedbackCard step={step} /> : null}
      </div>
    </details>
  );
}

function CurrentDecision({
  step,
  duplicateResultBody,
  showAll,
  onToggleShowAll,
  onSubmitAnswer,
  onFlagQuestion,
  footer,
}: {
  step: ChartDecisionStepView;
  duplicateResultBody?: string;
  showAll: boolean;
  onToggleShowAll: () => void;
  onSubmitAnswer: (choiceId: string) => void;
  onFlagQuestion: (decisionNodeId: string) => void;
  footer?: ReactNode;
}) {
  const progress = decisionProgress(step.heading);
  const answered = step.answerChoices.some((choice) => choice.selected);
  const showResult =
    Boolean(step.resultBody) && step.resultBody !== duplicateResultBody;

  return (
    <section className="cs-step is-current" aria-label={step.heading}>
      {showResult ? <ResultCard step={step} /> : null}
      <div className="cs-step-row">
        <span className="cs-eyebrow">{step.heading}</span>
        {progress ? (
          <span className="cs-pips" aria-hidden="true">
            {Array.from({ length: progress.total }, (_, index) => (
              <span
                className={index < progress.index ? "is-on" : undefined}
                key={index}
              />
            ))}
          </span>
        ) : null}
        {step.statusLabel ? (
          <span className="cs-step-status">{step.statusLabel}</span>
        ) : null}
        {step.questionPrompt && step.questionVariantId ? (
          <button
            className={`cs-flag${
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
            <FlagIcon />
          </button>
        ) : null}
      </div>

      {step.questionPrompt ? (
        <>
          <p className="cs-prompt">{step.questionPrompt}</p>
          {answered ? (
            <AnsweredChoices
              choices={step.answerChoices}
              feedbackTitle={step.feedbackTitle}
              showAll={showAll}
              onToggleShowAll={onToggleShowAll}
            />
          ) : (
            <>
              <AnswerGrid
                choices={step.answerChoices}
                current
                onSubmitAnswer={onSubmitAnswer}
              />
              {step.answerChoices.some((choice) => !choice.disabled) &&
              step.answerChoices.length <= 9 ? (
                <p className="cs-hint" aria-hidden="true">
                  Press 1–{step.answerChoices.length} to answer
                  {step.answerChoices.some((choice) => choice.detailLabel)
                    ? " · hover a wait time for its breakdown"
                    : ""}
                </p>
              ) : null}
            </>
          )}
        </>
      ) : null}

      {step.feedbackBody ? (
        <FeedbackCard step={step}>{footer}</FeedbackCard>
      ) : (
        footer
      )}
    </section>
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
  const sheetRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedChoices, setExpandedChoices] = useState<Record<string, boolean>>({});
  const placement = useChartPlacement(sheetRef, chart !== null);

  const steps = chart ? getDecisionSteps(chart) : [];
  const currentStep = steps.find((step) => step.current);
  const showingBack = Boolean(chart?.summaryAvailable && chart.summaryVisible);
  const primary: ChartPrimaryAction | null = !chart
    ? null
    : chart.terminalFeedbackNeedsAcknowledgment
      ? {
          label: chart.primaryActionLabel ?? "Continue",
          run: chart.primaryActionClosesChart
            ? onClose
            : onAcknowledgeTerminalFeedback,
          tutorialAnchor: "decision-feedback-action",
        }
      : chart.canFile
        ? {
            label:
              chart.primaryActionLabel ??
              (chart.readOnly ? "Close Resolved Chart" : "Resolve Completed Chart"),
            run: onFileChart,
            tutorialAnchor: "resolve-chart",
          }
        : chart.pendingLabel
          ? { label: chart.primaryActionLabel ?? "Return to clinic", run: onClose }
          : null;
  const currentChoices =
    currentStep &&
    !currentStep.answerChoices.some((choice) => choice.selected)
      ? currentStep.answerChoices
      : [];
  const attentionKey = currentStep?.feedbackBody
    ? `${currentStep.id}.feedback`
    : chart?.pendingLabel
      ? `${chart.id}.pending`
      : null;

  // Bring new feedback or a new waiting card into view inside the one scroll.
  useEffect(() => {
    if (!attentionKey) return;
    const frame = window.requestAnimationFrame(() => {
      scrollRef.current
        ?.querySelector<HTMLElement>(".cs-step.is-current .cs-feedback, .cs-away")
        ?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [attentionKey]);

  // 1–9 answer, Enter runs the primary action, Esc closes. Facility time is
  // never paused by the chart; pausing stays a player choice.
  const keyState = useRef({ currentChoices, primary, onClose, onSubmitAnswer, showingBack });
  keyState.current = { currentChoices, primary, onClose, onSubmitAnswer, showingBack };
  const chartOpen = chart !== null;
  useEffect(() => {
    if (!chartOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))
      ) {
        return;
      }
      if (document.querySelector("[aria-modal='true']")) return;
      const state = keyState.current;
      if (event.key === "Escape") {
        event.preventDefault();
        state.onClose();
        return;
      }
      if (/^[1-9]$/.test(event.key) && !state.showingBack) {
        const choice = state.currentChoices[Number(event.key) - 1];
        if (choice && !choice.disabled) {
          event.preventDefault();
          state.onSubmitAnswer(choice.id);
        }
        return;
      }
      if (event.key === "Enter" && state.primary) {
        if (target?.closest("button, a, summary, [role='button']")) return;
        event.preventDefault();
        state.primary.run();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [chartOpen]);

  if (!chart) {
    return null;
  }

  const toggleChoices = (stepId: string) =>
    setExpandedChoices((current) => ({ ...current, [stepId]: !current[stepId] }));
  const satisfactionLabel = chart.patientSatisfactionLabel
    ? /^satisfaction\b/i.test(chart.patientSatisfactionLabel)
      ? chart.patientSatisfactionLabel
      : `Satisfaction ${chart.patientSatisfactionLabel}`
    : undefined;
  const demographics =
    chart.subtitleLabel ?? [chart.ageLabel, chart.sexLabel].filter(Boolean).join(" · ");
  const isTeamDiscussion = chart.subjectKind === "team_discussion";
  const visibleStatusLabel = /^Question \d+ of \d+$/i.test(chart.statusLabel)
    ? "Clinical decision"
    : chart.statusLabel;
  const statusTone =
    visibleStatusLabel === "Action required"
      ? "is-action"
      : /complete|resolved/i.test(visibleStatusLabel)
        ? "is-done"
        : chart.pendingLabel
          ? "is-waiting"
          : "is-neutral";
  const currentUpdate = currentStep
    ? currentStep.currentUpdate ?? chart.presentationUpdate
    : undefined;
  const isComplete =
    chart.canFile ||
    chart.summaryAvailable ||
    Boolean(
      chart.reward &&
        (chart.reward.moneyLabel ||
          chart.reward.xpLabel ||
          chart.reward.satisfactionLabel),
    );
  const pendingPhases = chart.pendingPhases ?? [];

  // Actions live with the content they act on: the feedback card, the
  // waiting card, or the completion row. There is no separate bottom bar.
  const completion = isComplete ? (
    <CompletionRow
      chart={chart}
      primary={primary}
      showingBack={showingBack}
      onToggleSummary={onToggleSummary}
    />
  ) : null;
  const waitingCard = chart.pendingLabel ? (
    <div className="cs-away" role="status">
      <div className="cs-card-head">
        <strong>
          {chart.pendingPatientIsAway === false
            ? "Patient is in clinic"
            : "Patient is away"}
        </strong>
        {chart.etaLabel ? <span className="cs-chip">{chart.etaLabel}</span> : null}
      </div>
      <p>
        {pendingPhases.length > 0 && chart.pendingSummary
          ? chart.pendingSummary
          : chart.pendingLabel}
      </p>
      {pendingPhases.length > 0 ? <PhaseList phases={pendingPhases} /> : null}
      {completion ?? <ActionRow primary={primary} />}
    </div>
  ) : null;
  const outcomeStrip = chart.terminalOutcomeBody ? (
    <section
      className={`cs-outcome is-${chart.terminalOutcomeSeverity ?? "minor"}`}
    >
      <strong>{chart.terminalOutcomeTitle ?? "What happened"}</strong>
      <span>{chart.terminalOutcomeBody}</span>
    </section>
  ) : null;
  // The outcome strip sits just above whichever actions close out the step.
  const stepFooter = (
    <>
      {outcomeStrip}
      {waitingCard ? null : completion ?? <ActionRow primary={primary} />}
    </>
  );

  const sheet = (
    <aside
      ref={sheetRef}
      className={`chart-sheet${showingBack ? " is-showing-back" : ""}`}
      aria-label={`${chart.patientName} ${isTeamDiscussion ? "team discussion" : "chart"}`}
      data-placed={placement ? "true" : undefined}
      style={placement}
    >
      <header className="cs-head">
        <PixelAvatar
          className="cs-avatar"
          avatar={chart.avatar}
          label={`${chart.patientName} portrait`}
          size="small"
        />
        <h2 className="cs-name">{chart.patientName}</h2>
        {demographics ? (
          <span className="cs-demographics">{demographics}</span>
        ) : null}
        {chart.chiefComplaint ? (
          <span className="cs-complaint">
            {chart.chiefComplaint}
          </span>
        ) : null}
        {satisfactionLabel ? (
          <span className="cs-satisfaction">{satisfactionLabel}</span>
        ) : null}
        <span className="cs-spacer" />
        <span className={`cs-status ${statusTone}`}>
          {statusTone === "is-action" ? "! " : ""}
          {visibleStatusLabel}
        </span>
        <button
          className="cs-close"
          type="button"
          onClick={onClose}
          aria-label={isTeamDiscussion ? "Close team discussion" : "Close patient chart"}
          title="Close (Esc)"
        >
          ✕
        </button>
      </header>

      <div className="cs-scroll" ref={scrollRef} key={`${chart.id}.${showingBack ? "back" : "front"}`}>
        {showingBack ? (
          <div className="cs-back">
            {chart.clinicalReview ? (
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
            )}
            {completion}
          </div>
        ) : (
          <div className="cs-body">
            <section
              className="cs-story"
              aria-label={isTeamDiscussion ? "Discussion scenario" : "Patient presentation"}
            >
              {chart.vitals && chart.vitals.length > 0 ? (
                <ul className="cs-vitals" aria-label="Vital signs">
                  {chart.vitals.map((vital) => (
                    <li key={vital.id}>
                      <b>{vital.label}</b> {vital.value}
                    </li>
                  ))}
                </ul>
              ) : null}
              <p className="cs-presentation">{chart.presentation}</p>
              {currentUpdate ? (
                <div className="cs-update" data-testid="chart-current-update">
                  <span className="cs-eyebrow">Current update</span>
                  <p>{currentUpdate}</p>
                </div>
              ) : null}
            </section>

            <section className="cs-decisions" aria-label="Encounter decisions and results">
              {steps.length === 0 ? (
                <div className="cs-empty">
                  <strong>Encounter complete</strong>
                  <p>No further clinical decisions are waiting.</p>
                </div>
              ) : (
                steps.map((step) =>
                  step.current ? (
                    <CurrentDecision
                      key={step.id}
                      step={step}
                      duplicateResultBody={chart.pendingLabel}
                      showAll={Boolean(expandedChoices[step.id])}
                      onToggleShowAll={() => toggleChoices(step.id)}
                      onSubmitAnswer={onSubmitAnswer}
                      onFlagQuestion={onFlagQuestion}
                      footer={step.feedbackBody ? stepFooter : undefined}
                    />
                  ) : (
                    <PastDecision
                      key={step.id}
                      step={step}
                      duplicateResultBody={chart.pendingLabel}
                      defaultOpen={
                        !step.complete &&
                        !chart.pendingLabel &&
                        Boolean(step.resultBody)
                      }
                      showAll={Boolean(expandedChoices[step.id])}
                      onToggleShowAll={() => toggleChoices(step.id)}
                    />
                  ),
                )
              )}
              {waitingCard}
              {currentStep?.feedbackBody ? null : stepFooter}
            </section>
          </div>
        )}
      </div>
    </aside>
  );

  // Portal to <body> so the sheet layers above the map and side columns
  // instead of inside the desk's stacking context. Server renders stay inline.
  return typeof document === "undefined" ? sheet : createPortal(sheet, document.body);
}
