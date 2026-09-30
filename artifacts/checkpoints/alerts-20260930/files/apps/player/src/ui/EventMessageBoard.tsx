import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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

interface FeedScrollSnapshot {
  anchorId: string | null;
  orderedIds: string[];
  offsets: Map<string, number>;
  scrollHeight: number;
  scrollTop: number;
}

const NEW_ROW_EMPHASIS_MS = 2_000;
const NEWEST_SCROLL_TOLERANCE_PX = 8;

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
 * Compact, text-first operational feed. Event production, persistence, and
 * condition resolution live in the domain. The UI keeps one chronological,
 * scrollable list and prevents repeated input IDs from stacking.
 * Attention markers deliberately do not change a row's position:
 * newer clinic events push every older row down in the same way.
 */
export function EventMessageBoard({
  items,
  onAction,
  maximumVisibleItems = 30,
  mode = "recent_log",
}: EventMessageBoardProps) {
  const feedRef = useRef<HTMLDivElement | null>(null);
  // Seed every supplied ID, including rows outside the current display cap.
  // A remount therefore treats restored history as history rather than news.
  const knownIdsRef = useRef(new Set(items.map((item) => item.id)));
  const emphasisTimersRef = useRef(
    new Map<string, number>(),
  );
  const readingHistoryRef = useRef(false);
  const scrollSnapshotRef = useRef<FeedScrollSnapshot | null>(null);
  const [emphasizedIds, setEmphasizedIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [offscreenNewCount, setOffscreenNewCount] = useState(0);
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

  const captureScrollSnapshot = useCallback(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const feedTop = feed.getBoundingClientRect().top;
    const rows = [
      ...feed.querySelectorAll<HTMLElement>("[data-message-id]"),
    ];
    const offsets = new Map<string, number>();
    let anchorId: string | null = null;
    for (const row of rows) {
      const id = row.dataset.messageId;
      if (!id) continue;
      const bounds = row.getBoundingClientRect();
      const offset = bounds.top - feedTop;
      offsets.set(id, offset);
      if (anchorId === null && bounds.bottom > feedTop + 1) {
        anchorId = id;
      }
    }
    scrollSnapshotRef.current = {
      anchorId,
      orderedIds: rows.flatMap((row) =>
        row.dataset.messageId ? [row.dataset.messageId] : [],
      ),
      offsets,
      scrollHeight: feed.scrollHeight,
      scrollTop: feed.scrollTop,
    };
  }, []);

  const restoreScrollAnchor = useCallback(
    (snapshot: FeedScrollSnapshot) => {
      const feed = feedRef.current;
      if (!feed) return;
      const currentRows = new Map(
        [...feed.querySelectorAll<HTMLElement>("[data-message-id]")].flatMap(
          (row) =>
            row.dataset.messageId ? [[row.dataset.messageId, row] as const] : [],
        ),
      );
      const anchorIndex = snapshot.anchorId
        ? snapshot.orderedIds.indexOf(snapshot.anchorId)
        : -1;
      const candidates = anchorIndex >= 0
        ? [
            snapshot.orderedIds[anchorIndex],
            ...Array.from(
              { length: snapshot.orderedIds.length - 1 },
              (_, distance) => distance + 1,
            ).flatMap((distance) => [
              snapshot.orderedIds[anchorIndex + distance],
              snapshot.orderedIds[anchorIndex - distance],
            ]),
          ]
        : snapshot.orderedIds;
      const survivorId = candidates.find(
        (id): id is string => Boolean(id && currentRows.has(id)),
      );
      if (survivorId) {
        const priorOffset = snapshot.offsets.get(survivorId);
        const row = currentRows.get(survivorId)!;
        if (priorOffset !== undefined) {
          const currentOffset =
            row.getBoundingClientRect().top -
            feed.getBoundingClientRect().top;
          feed.scrollTop += currentOffset - priorOffset;
          return;
        }
      }
      const maximumScrollTop = Math.max(
        0,
        feed.scrollHeight - feed.clientHeight,
      );
      feed.scrollTop = Math.max(
        0,
        Math.min(
          maximumScrollTop,
          snapshot.scrollTop +
            (feed.scrollHeight - snapshot.scrollHeight),
        ),
      );
    },
    [],
  );

  const handleFeedScroll = useCallback(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const readingHistory =
      feed.scrollTop > NEWEST_SCROLL_TOLERANCE_PX;
    readingHistoryRef.current = readingHistory;
    if (!readingHistory) setOffscreenNewCount(0);
    captureScrollSnapshot();
  }, [captureScrollSnapshot]);

  useLayoutEffect(() => {
    const currentInputIds = new Set(items.map((item) => item.id));
    const genuinelyNewIds = [...currentInputIds].filter(
      (id) => !knownIdsRef.current.has(id),
    );
    for (const id of currentInputIds) knownIdsRef.current.add(id);
    const visibleIds = new Set(listItems.map((item) => item.id));
    const mountedNewIds = genuinelyNewIds.filter((id) => visibleIds.has(id));
    const priorSnapshot = scrollSnapshotRef.current;
    if (readingHistoryRef.current && priorSnapshot) {
      restoreScrollAnchor(priorSnapshot);
    }
    if (mountedNewIds.length > 0) {
      if (readingHistoryRef.current && priorSnapshot) {
        setOffscreenNewCount(
          (current) => current + mountedNewIds.length,
        );
      } else if (feedRef.current) {
        feedRef.current.scrollTop = 0;
      }
      setEmphasizedIds((current) => {
        const next = new Set(current);
        for (const id of mountedNewIds) next.add(id);
        return next;
      });
      for (const id of mountedNewIds) {
        const existingTimer = emphasisTimersRef.current.get(id);
        if (existingTimer !== undefined) window.clearTimeout(existingTimer);
        const timer = window.setTimeout(() => {
          emphasisTimersRef.current.delete(id);
          setEmphasizedIds((current) => {
            if (!current.has(id)) return current;
            const next = new Set(current);
            next.delete(id);
            return next;
          });
        }, NEW_ROW_EMPHASIS_MS);
        emphasisTimersRef.current.set(id, timer);
      }
    }
    captureScrollSnapshot();
  }, [captureScrollSnapshot, items, listItems, restoreScrollAnchor]);

  useEffect(
    () => () => {
      for (const timer of emphasisTimersRef.current.values()) {
        window.clearTimeout(timer);
      }
      emphasisTimersRef.current.clear();
    },
    [],
  );

  const jumpToNewest = useCallback(() => {
    const feed = feedRef.current;
    if (!feed) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    feed.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth",
    });
    readingHistoryRef.current = false;
    setOffscreenNewCount(0);
    window.requestAnimationFrame(captureScrollSnapshot);
  }, [captureScrollSnapshot]);

  return (
    <aside
      className={`panel event-message-board is-${mode}`}
      aria-labelledby="event-board-title"
    >
      <div className="panel-heading">
        <span id="event-board-title">
          {mode === "ticker" ? "Alerts & events" : "Clinic messages"}
        </span>
        {offscreenNewCount > 0 ? (
          <button
            className="message-board-new-indicator"
            type="button"
            onClick={jumpToNewest}
            title="Jump to newest"
          >
            {offscreenNewCount} new {offscreenNewCount === 1 ? "message" : "messages"}
          </button>
        ) : (
          <small>{mode === "ticker" ? "Live" : "Newest first"}</small>
        )}
      </div>
      <div
        ref={feedRef}
        className="message-board-feed"
        role="log"
        tabIndex={0}
        aria-live="polite"
        aria-relevant="additions"
        onScroll={handleFeedScroll}
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
            const isNewMessage = emphasizedIds.has(item.id);
            return (
              <article
                className={`message-board-item is-${priority} is-category-${category}${
                  hasAttentionMarker ? " has-attention-marker" : ""
                }${item.persistent ? " is-persistent" : ""}${
                  isNewMessage ? " is-new-message" : ""
                }`}
                key={item.id}
                role={priority === "critical" ? "alert" : undefined}
                data-message-category={category}
                data-attention-marker={hasAttentionMarker}
                data-message-id={item.id}
                data-new-message={isNewMessage}
              >
                {isNewMessage ? (
                  <span className="message-board-new-token" aria-hidden="true">
                    New
                  </span>
                ) : null}
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
                    <span className="message-board-compact-action-copy">
                      {item.message}
                    </span>
                    <span className="message-board-compact-action-label">
                      {item.actionLabel}
                    </span>
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
