import { useMemo } from "react";
import type {
  MessageBoardCategory,
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

interface CategoryPresentation {
  label: string;
  icon: string;
}

const CATEGORY_PRESENTATION: Record<
  MessageBoardCategory,
  CategoryPresentation
> = {
  action_required: {
    label: "Action needed",
    icon: "ACT",
  },
  guidance: {
    label: "Guidance",
    icon: "TIP",
  },
  success: {
    label: "Success",
    icon: "OK",
  },
  ambient_flavor: {
    label: "Around the clinic",
    icon: "...",
  },
  walkout_review: {
    label: "Patient review",
    icon: "REV",
  },
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

function getCategory(item: MessageBoardItemView): MessageBoardCategory {
  if (item.category) {
    return item.category;
  }
  if (
    item.priority === "critical" ||
    item.priority === "action_required" ||
    item.kind === "alert"
  ) {
    return "action_required";
  }
  if (item.kind === "positive") {
    return "success";
  }
  if (item.priority === "flavor" || item.kind === "joke") {
    return "ambient_flavor";
  }
  return "guidance";
}

function getPresentation(item: MessageBoardItemView): CategoryPresentation {
  if (item.showAttentionMarker === true) {
    return {
      label: "Attention required",
      icon: "!",
    };
  }
  return CATEGORY_PRESENTATION[getCategory(item)];
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

    const historyCandidates = [...newestById.values()].sort(
      (left, right) =>
        (right.item.sortKey ?? right.inputIndex) -
        (left.item.sortKey ?? left.inputIndex),
    );
    let candidates = [...historyCandidates];
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
        ? Math.min(7, Math.max(1, maximumVisibleItems))
        : Math.max(1, maximumVisibleItems);
    return {
      liveItems: candidates.slice(0, visibleLimit).map(({ item }) => item),
      recentItems: historyCandidates
        .slice(0, Math.max(30, visibleLimit, maximumVisibleItems))
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
            const category = getCategory(item);
            const presentation = getPresentation(item);
            const hasAttentionMarker = item.showAttentionMarker === true;
            const target =
              item.targetType === undefined
                ? undefined
                : { type: item.targetType, id: item.targetId };
            if (mode === "ticker") {
              return (
                <article
                  className={`message-board-item is-${priority} is-category-${category}${
                    hasAttentionMarker ? " has-attention-marker" : ""
                  }${item.persistent ? " is-persistent" : ""}`}
                  key={item.id}
                  role={priority === "critical" ? "alert" : undefined}
                  data-message-category={category}
                  data-attention-marker={hasAttentionMarker}
                >
                  <span
                    className="message-board-priority-icon"
                    aria-label={presentation.label}
                    title={presentation.label}
                  >
                    {presentation.icon}
                  </span>
                  {item.actionLabel && onAction ? (
                    <button
                      className="message-board-compact-action"
                      type="button"
                      onClick={() => onAction(item.id, target)}
                    >
                      {item.message}
                    </button>
                  ) : (
                    <span className="message-board-compact-copy">
                      {item.message}
                    </span>
                  )}
                </article>
              );
            }
            return (
              <article
                className={`message-board-item is-${priority} is-category-${category}${
                  hasAttentionMarker ? " has-attention-marker" : ""
                }${item.persistent ? " is-persistent" : ""}`}
                key={item.id}
                role={priority === "critical" ? "alert" : undefined}
                data-message-category={category}
                data-attention-marker={hasAttentionMarker}
              >
                <span
                  className="message-board-priority-icon"
                  aria-label={presentation.label}
                  title={presentation.label}
                >
                  {presentation.icon}
                </span>
                <div className="message-board-item-copy">
                  <div className="message-board-item-heading">
                    <strong>
                      {item.title ?? presentation.label}
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
              const category = getCategory(item);
              const presentation = getPresentation(item);
              const target =
                item.targetType === undefined
                  ? undefined
                  : { type: item.targetType, id: item.targetId };
              return (
                <li key={`history.${item.id}`}>
                  <span className="message-board-log-priority">
                    {presentation.icon} {presentation.label}
                  </span>
                  {item.actionLabel && onAction ? (
                    <button
                      className="message-board-history-action"
                      type="button"
                      data-message-category={category}
                      onClick={() => onAction(item.id, target)}
                    >
                      {item.message}
                    </button>
                  ) : (
                    <span data-message-category={category}>
                      {item.message}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </details>
      ) : null}
    </aside>
  );
}
