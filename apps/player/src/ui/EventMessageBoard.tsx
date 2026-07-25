import { useMemo } from "react";
import type {
  MessageBoardItemView,
  MessageBoardPriority,
  MessageBoardTargetType,
} from "./types";

interface EventMessageBoardProps {
  items: MessageBoardItemView[];
  onAction?: (
    itemId: string,
    target?: { type: MessageBoardTargetType; id?: string },
  ) => void;
  maximumVisibleItems?: number;
  mode?: "recent_log" | "ticker";
}

const PRIORITY_LABELS: Record<MessageBoardPriority, string> = {
  critical: "Critical alert",
  action_required: "Action needed",
  informational: "Clinic update",
  flavor: "Around the clinic",
};

const PRIORITY_ICONS: Record<MessageBoardPriority, string> = {
  critical: "!!",
  action_required: "!",
  informational: "i",
  flavor: "*",
};

const PRIORITY_RANK: Record<MessageBoardPriority, number> = {
  critical: 0,
  action_required: 1,
  informational: 2,
  flavor: 3,
};

function getPriority(item: MessageBoardItemView): MessageBoardPriority {
  if (item.priority) {
    return item.priority;
  }
  if (item.kind === "alert") {
    return "action_required";
  }
  if (item.kind === "joke") {
    return "flavor";
  }
  return "informational";
}

/**
 * Bounded, text-first operational feed. Random selection, deduplication keys,
 * persistence, and condition resolution live in the domain. This component
 * applies only display priority and prevents repeated input IDs from stacking.
 */
export function EventMessageBoard({
  items,
  onAction,
  maximumVisibleItems = 30,
  mode = "recent_log",
}: EventMessageBoardProps) {
  const { liveItems, recentItems } = useMemo(() => {
    const newestById = new Map<
      string,
      { item: MessageBoardItemView; inputIndex: number }
    >();
    items.forEach((item, inputIndex) => {
      newestById.set(item.id, { item, inputIndex });
    });

    let candidates = [...newestById.values()];
    const hasCritical = candidates.some(
      ({ item }) => getPriority(item) === "critical",
    );
    if (hasCritical) {
      candidates = candidates.filter(
        ({ item }) => getPriority(item) !== "flavor",
      );
    }

    candidates.sort((left, right) => {
      const leftPriority = getPriority(left.item);
      const rightPriority = getPriority(right.item);
      const priorityDifference =
        PRIORITY_RANK[leftPriority] - PRIORITY_RANK[rightPriority];
      if (priorityDifference !== 0) {
        return priorityDifference;
      }
      if (
        left.item.sortKey !== undefined ||
        right.item.sortKey !== undefined
      ) {
        return (
          (right.item.sortKey ?? Number.NEGATIVE_INFINITY) -
          (left.item.sortKey ?? Number.NEGATIVE_INFINITY)
        );
      }
      return right.inputIndex - left.inputIndex;
    });

    const visibleLimit =
      mode === "ticker"
        ? Math.min(5, Math.max(1, maximumVisibleItems))
        : Math.max(1, maximumVisibleItems);
    return {
      liveItems: candidates.slice(0, visibleLimit).map(({ item }) => item),
      recentItems: candidates
        .slice(0, Math.max(visibleLimit, maximumVisibleItems))
        .map(({ item }) => item),
    };
  }, [items, maximumVisibleItems, mode]);

  return (
    <aside
      className={`panel event-message-board is-${mode}`}
      aria-labelledby="event-board-title"
    >
      <div className="panel-heading">
        <span id="event-board-title">
          {mode === "ticker" ? "Alerts & events" : "Clinic messages"}
        </span>
        <small>{mode === "ticker" ? "Live" : "Priority, then newest"}</small>
      </div>
      <div
        className="message-board-feed"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {liveItems.length === 0 ? (
          <p className="empty-state">
            Clinic events and helpful alerts will appear here.
          </p>
        ) : (
          liveItems.map((item) => {
            const priority = getPriority(item);
            const target =
              item.targetType === undefined
                ? undefined
                : { type: item.targetType, id: item.targetId };
            return (
              <article
                className={`message-board-item is-${priority}${
                  item.persistent ? " is-persistent" : ""
                }`}
                key={item.id}
                role={priority === "critical" ? "alert" : undefined}
              >
                <span
                  className="message-board-priority-icon"
                  aria-hidden="true"
                >
                  {PRIORITY_ICONS[priority]}
                </span>
                <div className="message-board-item-copy">
                  <div className="message-board-item-heading">
                    <strong>
                      {item.title ?? PRIORITY_LABELS[priority]}
                    </strong>
                    {item.timeLabel ? <time>{item.timeLabel}</time> : null}
                  </div>
                  <p>{item.message}</p>
                  {item.actionLabel && onAction ? (
                    <button
                      className="text-button message-board-action"
                      type="button"
                      onClick={() => onAction(item.id, target)}
                    >
                      {item.actionLabel}
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })
        )}
      </div>
      {mode === "ticker" && recentItems.length > 0 ? (
        <details className="message-board-history">
          <summary>Recent events ({recentItems.length})</summary>
          <ol>
            {recentItems.map((item) => {
              const priority = getPriority(item);
              return (
                <li key={`history.${item.id}`}>
                  <span className="message-board-log-priority">
                    {PRIORITY_ICONS[priority]}{" "}
                    {PRIORITY_LABELS[priority]}
                  </span>
                  <span>{item.title ?? item.message}</span>
                  {item.timeLabel ? <time>{item.timeLabel}</time> : null}
                </li>
              );
            })}
          </ol>
        </details>
      ) : null}
    </aside>
  );
}
