import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { EventMessageBoard } from "./EventMessageBoard";
import type { MessageBoardItemView } from "./types";

function renderItem(item: MessageBoardItemView): string {
  return renderToStaticMarkup(
    <EventMessageBoard
      items={[item]}
      onAction={vi.fn()}
      mode="ticker"
    />,
  );
}

describe("EventMessageBoard", () => {
  it("reserves the exclamation treatment for explicitly marked items", () => {
    const attentionMarkup = renderItem({
      id: "needs-attention",
      priority: "action_required",
      category: "action_required",
      showAttentionMarker: true,
      message: "A patient needs a decision.",
    });
    const ordinaryActionMarkup = renderItem({
      id: "ordinary-action",
      priority: "action_required",
      category: "action_required",
      showAttentionMarker: false,
      message: "Advertising can improve arrivals.",
    });

    expect(attentionMarkup).toContain("has-attention-marker");
    expect(attentionMarkup).toContain('data-attention-marker="true"');
    expect(attentionMarkup).toContain(">!</span>");
    expect(ordinaryActionMarkup).not.toContain(
      "has-attention-marker",
    );
    expect(ordinaryActionMarkup).toContain(
      'data-attention-marker="false"',
    );
    expect(ordinaryActionMarkup).toContain(">ACT</span>");
  });

  it.each([
    ["guidance", "TIP"],
    ["success", "OK"],
    ["ambient_flavor", "..."],
    ["walkout_review", "REV"],
  ] as const)(
    "uses a terse non-exclamation token for %s messages",
    (category, token) => {
      const markup = renderItem({
        id: category,
        category,
        priority:
          category === "ambient_flavor" ? "flavor" : "informational",
        message: `Message in ${category}.`,
      });

      expect(markup).toContain(
        `data-message-category="${category}"`,
      );
      expect(markup).toContain(`>${token}</span>`);
      expect(markup).not.toContain("has-attention-marker");
    },
  );

  it("keeps the complete message in compact recent-event history", () => {
    const markup = renderToStaticMarkup(
      <EventMessageBoard
        items={[
          {
            id: "longer-history-line",
            category: "ambient_flavor",
            priority: "flavor",
            title: "Short title",
            message:
              "The complete dry clinic update remains readable in history.",
          },
        ]}
        mode="ticker"
      />,
    );

    expect(markup).toContain(
      "The complete dry clinic update remains readable in history.",
    );
  });
});
