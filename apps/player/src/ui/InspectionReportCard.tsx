import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import type { InspectionReportView } from "./types";
import "./inspectionReportCard.css";

type Category = InspectionReportView["categories"][number];
const rawName = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1 $2").replaceAll("_", " ");

function ScoreBar({ category }: { category: Category }) {
  return <span className="inspection-score-bar" role="meter" aria-label={`${category.label} score`}
    aria-valuemin={0} aria-valuemax={100} aria-valuenow={category.score ?? undefined}
    aria-valuetext={category.score === null ? "No sample yet" : `${category.scoreLabel} out of 100`}
    style={{ "--inspection-score": `${Math.max(0, Math.min(100, category.score ?? 0))}%` } as CSSProperties}>
    <span />
  </span>;
}

function CategoryArithmetic({ category }: { category: Category }) {
  return <div className="inspection-category-arithmetic">
    <p className="inspection-category-status">{category.score === null ? "No sample yet" : category.score === 100 && !category.missingItems.length ? "Full category score" : "Room to improve"}</p>
    <p><strong>Formula</strong> · {category.formula}</p>
    <dl>{Object.entries(category.rawValues).map(([name, value]) => <div key={name}><dt>{rawName(name)}</dt><dd>{String(value)}</dd></div>)}</dl>
    <p><strong>Weighted contribution</strong> · {category.score === null ? "Waiting for a sample" : `${category.score} × ${category.weightPercent}% = ${category.weightedPoints} points`}.</p>
    <p><strong>How to improve</strong> · {category.improvementHint}</p>
    {category.missingItems.length ? <details className="inspection-missing-items"><summary>Missing items &amp; review · {category.missingItems.length}</summary>
      <ul>{category.missingItems.map(item => <li key={item.id}>{item.reason}</li>)}</ul>
    </details> : null}
  </div>;
}

/** Frozen domain arithmetic in both shells. Phone opens one tile's detail at a time. */
export function InspectionReportCard({ report, compact = false, provisional = false, bestLabel, latestLabel, onDetailBackChange }: {
  report: InspectionReportView; compact?: boolean; provisional?: boolean; bestLabel?: string; latestLabel?: string;
  onDetailBackChange?: (handler: (() => void) | null) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const previousDetail = useRef<string | null>(null);
  useEffect(() => { setExpandedId(null); }, [report.runId]);
  const closeDetail = useCallback(() => setExpandedId(null), []);
  useEffect(() => {
    onDetailBackChange?.(compact && expandedId ? closeDetail : null);
    return () => onDetailBackChange?.(null);
  }, [compact, expandedId, closeDetail, onDetailBackChange]);
  const expanded = report.categories.find(category => category.id === expandedId);
  useEffect(() => {
    if (!compact) return;
    if (expandedId) detailHeading.current?.focus();
    else if (previousDetail.current) tileRefs.current[previousDetail.current]?.focus();
    previousDetail.current = expandedId;
  }, [compact, expandedId]);
  return <section className={`inspection-report-card${compact ? " is-compact" : ""}`} aria-label={provisional ? "Provisional inspection report card" : "Inspection report card"}>
    <header className="inspection-report-heading">
      <div><span className="inspection-report-eyebrow">{provisional ? "Provisional report" : "Inspection report card"}</span>
        <p className="inspection-report-total"><strong>{report.scoreLabel}</strong><span>/100</span>
          <b>{report.recognitionLabel ?? "No prestige score"}</b></p></div>
      {bestLabel ? <div className="inspection-report-best"><small>Best prestige</small><strong>{bestLabel}/100</strong>
        {latestLabel ? <small>Latest {latestLabel}/100</small> : null}</div> : null}
    </header>
    <p className="inspection-report-sample"><strong>{report.sampleStatusLabel}</strong><span>{report.windowLabel} · {report.sampleLabel}</span></p>
    {compact && expanded ? <section className="inspection-category-detail" aria-label={`${expanded.label} arithmetic and improvement`}>
      <button type="button" onClick={() => setExpandedId(null)}>← Back to report card</button>
      <h3 ref={detailHeading} tabIndex={-1}>{expanded.label} · {expanded.scoreLabel}/100</h3><ScoreBar category={expanded} />
      <p>{expanded.pointsLabel} points · {expanded.weightPercent}% weight</p>
      <CategoryArithmetic category={expanded} />
    </section> : <div className="inspection-category-grid">{report.categories.map(category => compact ?
      <button type="button" key={category.id} className="inspection-category-tile" aria-expanded="false"
        ref={node => { tileRefs.current[category.id] = node; }}
        aria-label={`${category.label} · ${category.scoreLabel}/100 · ${category.pointsLabel} points · arithmetic and how to improve`}
        onClick={() => setExpandedId(category.id)}>
        <strong>{category.label}</strong><ScoreBar category={category} />
        <span><b>{category.scoreLabel}/100</b><small>{category.pointsLabel} pts</small></span>
      </button> : <details key={category.id} className="inspection-category-row">
        <summary><strong>{category.label}</strong><ScoreBar category={category} />
          <span>{category.scoreLabel}/100</span><small>{category.pointsLabel} points · {category.weightPercent}% weight</small></summary>
        <CategoryArithmetic category={category} />
      </details>)}</div>}
    <details className="inspection-report-math"><summary>Total arithmetic &amp; scoring rules</summary>
      <p>{report.categories.map(category => category.weightedPoints === null ? "—" : String(category.weightedPoints)).join(" + ")}
        {report.outcome === "completed" ? ` = ${report.rawTotalScore} raw → ${report.scoreLabel}/100 displayed` : " · provisional categories earn no prestige yet"}.</p>
      <p>Each contribution is category score × weight ÷ 100. Weights total 100%. Calculations retain raw fractions; the total is floored to two decimals.</p>
      <p>Improving below 80 · Prestige from 80 · Distinguished from 95 · Perfect only at an exact 100 with all requirements met.</p>
      <p>Best prestige keeps the highest raw completed score. A lower, equal, incomplete or cancelled attempt keeps the earlier best. No pass score is required to finish the game.</p>
      <p>Game answer accuracy compares stored game keys. The report does not approve clinical content.</p>
    </details>
  </section>;
}
