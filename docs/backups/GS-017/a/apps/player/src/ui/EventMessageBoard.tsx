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

/**
 * Compact, text-first operational feed. Random selection, deduplication keys,
 * persistence, and condition resolution live in the domain. The UI keeps one
 * chronological, scrollable list and prevents repeated input IDs from
 * stacking. Attention markers deliberately do not change a row's position:
 * newer clinic events push every older row down in the same way.
 */
export function EventMessageBoard({
  items,
  onAction,
  maximumVisibleItems = 30,
  mode = "recent_log",
}: EventMessageBoardProps) {
  const listItems = useMemo(() => {
    const newestById = new Map<
      string,
      { item: MessageBoardItemView; inputIndex: number }
    >();
    items.forEach((item, inputIndex) => {
      newestById.set(item.id, { item, inputIndex });
    });

    const historyCandidates = [...newestById.values()].sort(
      (left, right) => {
        const timeDifference =
          (right.item.sortKey ?? right.inputIndex) -
          (left.item.sortKey ?? left.inputIndex);
        return timeDifference !== 0
          ? timeDifference
          : right.inputIndex - left.inputIndex;
      },
    );
    const candidates = historyCandidates;

    // The ticker's former seven-row limit was paired with a second collapsed
    // history control. Keep the same compact viewport in CSS, but retain the
    // recent items inside this one scrollable list instead of making older
    // entries inaccessible.
    const listLimit =
      mode === "ticker"
        ? Math.max(30, maximumVisibleItems)
        : Math.max(1, maximumVisibleItems);
    return candidates.slice(0, listLimit).map(({ item }) => item);
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
        <small>{mode === "ticker" ? "Live" : "Newest first"}</small>
      </div>
      <div
        className="message-board-feed"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {listItems.length === 0 ? (
          <p className="empty-state">
            Clinic events and helpful alerts will appear here.
          </p>
        ) : (
          listItems.map((item) => {
            const priority = getPriority(item);
            const category = getCategory(item);
            const hasAttentionMarker =
              item.showAttentionMarker === true &&
              (priority === "critical" ||
                priority === "action_required");
            const target =
              item.targetType === undefined
                ? undefined
                : { type: item.targetType, id: item.targetId };
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
                {hasAttentionMarker ? (
                  <span
                    className="message-board-priority-icon"
                    aria-label="Attention required"
                    title="Attention required"
                  >
                    !
                  </span>
                ) : null}
                {item.actionLabel && onAction ? (
                  <button
                    className="message-board-compact-action"
                    type="button"
                    onClick={() => onAction(item.id, target)}
                    title={item.actionLabel}
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
          })
        )}
      </div>
    </aside>
  );
}
