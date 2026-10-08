import type { NeedsYouItemView } from "./types";

export function NeedsYouTray({ items, onAction, failures = {}, compact = false }: {
  items: NeedsYouItemView[];
  onAction?: (item: NeedsYouItemView) => void;
  failures?: Readonly<Record<string, string>>;
  compact?: boolean;
}) {
  const visible = items.slice(0, 3);
  return (
    <section className={`needs-you-zone${compact ? " is-compact" : ""}`} aria-label="Needs you">
      <div className="clinic-zone-label"><span>Needs you</span><small>{items.length > 3 ? `+${items.length - 3} other actionable problems` : ""}</small></div>
      <div className="needs-you-cards">
        {visible.length === 0 ? <p className="needs-you-calm">All quiet. Nothing needs you right now.</p> : visible.map((item) => (
          <article className={`needs-you-card is-${item.kind}`} key={item.id} data-need-id={item.id}>
            <strong>{item.title}</strong>
            <p>{item.why}</p>
            {item.deadline ? <div className="needs-you-deadline">
              <meter min={0} max={Math.max(1, item.deadline.windowMinutes)} value={item.deadline.minutesLeft} aria-label={item.deadline.label} />
              <small>{item.deadline.minutesLeft} min · {item.deadline.label}</small>
            </div> : null}
            <button className="clinic-fix-button" type="button" onClick={() => onAction?.(item)} disabled={!onAction}>{item.actionLabel}</button>
            {failures[item.id] ? <p className="clinic-action-failure" role="status">{failures[item.id]}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
