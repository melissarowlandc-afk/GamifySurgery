import type { MessageBoardItemView, NeedsYouItemView } from "../ui/types";

export function mobileClinicFeed(items: readonly MessageBoardItemView[]): MessageBoardItemView[] {
  const latest = new Map<string, { item: MessageBoardItemView; index: number }>();
  items.forEach((item, index) => latest.set(item.id, { item, index }));
  return [...latest.values()].sort((left, right) =>
    (right.item.sortKey ?? right.index) - (left.item.sortKey ?? left.index) || right.index - left.index,
  ).slice(0, 30).map(({ item }) => item);
}

export function MobileAlerts({ needs, items, failures, onNeedAction, onFeedAction }: {
  needs: NeedsYouItemView[];
  items: MessageBoardItemView[];
  failures: Readonly<Record<string, string>>;
  onNeedAction: (need: NeedsYouItemView) => void;
  onFeedAction: (item: MessageBoardItemView) => void;
}) {
  const feed = mobileClinicFeed(items);
  return <div className="mobile-alerts" data-phone-anchor="alerts">
    <section className="mobile-needs" aria-label="Needs you" data-needs-state={needs.length ? "actionable" : "quiet"}>
      <h3>Needs you</h3>
      {!needs.length ? <p className="mobile-empty" role="status">All quiet.</p> : null}
      {needs.map((need) => <article className={`mobile-need-card is-${need.kind}`} key={need.id} data-need-id={need.id}>
        <h4><span className="mobile-attention" aria-label="Attention required">!</span> {need.title}</h4>
        <p>{need.why}</p>
        {need.timeLabel ? <small>{need.timeLabel}</small> : null}
        {need.deadline ? <div className="mobile-need-deadline">
          <meter min={0} max={Math.max(1, need.deadline.windowMinutes)} value={need.deadline.minutesLeft} aria-label={need.deadline.label} />
          <span>{need.deadline.minutesLeft} min · {need.deadline.label}</span>
        </div> : null}
        <button type="button" className="mobile-primary" onClick={() => onNeedAction(need)}>{need.actionLabel}</button>
        {failures[need.id] ? <p className="mobile-action-failure" role="status">{failures[need.id]}</p> : null}
      </article>)}
    </section>
    <section className="mobile-clinic-feed" aria-label="Around the clinic">
      <h3>Around the clinic <small>Newest first</small></h3>
      <div role="log" aria-live="polite" aria-relevant="additions">
        {!feed.length ? <p className="mobile-empty">Clinic events and helpful alerts will appear here.</p> : null}
        {feed.map((item) => <article className={`mobile-feed-row${item.rowKind === "day_summary" ? " is-day-summary" : ""}`}
          key={item.id} data-message-id={item.id} data-row-kind={item.rowKind ?? "event"}>
          <div className="mobile-feed-byline"><strong>{item.rowKind === "tip" ? "Tip · " : ""}{item.speaker ?? (item.rowKind === "resolved" ? "Handled" : "Front Desk")}</strong>
            {item.timeLabel ? <time>{item.timeLabel}</time> : null}</div>
          {item.title ? <h4>{item.title}</h4> : null}
          <p>{item.message}</p>
          {item.daySummary?.reviewLine ? <p>Review of the day: “{item.daySummary.reviewLine}”</p> : null}
          {item.daySummary?.partial ? <small>Totals from retained records in this older campaign.</small> : null}
          {item.actionLabel && (item.action || item.targetType) ? <button type="button" onClick={() => onFeedAction(item)}>{item.actionLabel}</button> : null}
          {failures[item.id] ? <p className="mobile-action-failure" role="status">{failures[item.id]}</p> : null}
        </article>)}
      </div>
    </section>
  </div>;
}
