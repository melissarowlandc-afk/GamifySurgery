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
    expect(ordinaryActionMarkup).not.toContain(
      "message-board-priority-icon",
    );
  });

  it.each([
    "guidance",
    "success",
    "ambient_flavor",
    "walkout_review",
  ] as const)(
    "shows %s messages without a visible category token",
    (category) => {
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
      expect(markup).not.toContain(
        "message-board-priority-icon",
      );
      expect(markup).not.toContain("has-attention-marker");
    },
  );

  it("does not show an exclamation marker on a non-actionable item", () => {
    const markup = renderItem({
      id: "misclassified-marker",
      category: "success",
      priority: "informational",
      showAttentionMarker: true,
      message: "A room was upgraded.",
    });

    expect(markup).toContain('data-attention-marker="false"');
    expect(markup).not.toContain("message-board-priority-icon");
  });

  it("retains actionable message buttons without a category label", () => {
    const markup = renderItem({
      id: "focus-patient",
      category: "action_required",
      priority: "action_required",
      showAttentionMarker: true,
      message: "Open Taylor's chart.",
      actionLabel: "Open Taylor",
      targetType: "patient",
      targetId: "encounter.taylor",
    });

    expect(markup).toContain(
      'class="message-board-compact-action"',
    );
    expect(markup).toContain('title="Open Taylor"');
    expect(markup).toContain("Open Taylor&#x27;s chart.");
    expect(markup).not.toContain(">Action needed<");
  });

  it("lets newer flavor move ahead of older actionable rows", () => {
    const markup = renderToStaticMarkup(
      <EventMessageBoard
        items={[
          {
            id: "flavor",
            category: "ambient_flavor",
            priority: "flavor",
            sortKey: 99,
            message: "The printer has opinions.",
          },
          {
            id: "action",
            category: "action_required",
            priority: "action_required",
            sortKey: 1,
            message: "A patient needs a decision.",
          },
        ]}
        mode="ticker"
      />,
    );

    expect(markup.indexOf("The printer has opinions.")).toBeLessThan(
      markup.indexOf("A patient needs a decision."),
    );
  });

  it("keeps a resolved actionable row in chronological place without an exclamation point", () => {
    const markup = renderToStaticMarkup(
      <EventMessageBoard
        items={[
          {
            id: "older-resolved-action",
            category: "guidance",
            priority: "informational",
            showAttentionMarker: false,
            sortKey: 10,
            message: "Taylor's chart no longer needs attention.",
          },
          {
            id: "newer-flavor",
            category: "ambient_flavor",
            priority: "flavor",
            sortKey: 20,
            message: "The printer has opinions.",
          },
        ]}
        mode="ticker"
      />,
    );

    expect(markup).toContain(
      "Taylor&#x27;s chart no longer needs attention.",
    );
    expect(markup.indexOf("The printer has opinions.")).toBeLessThan(
      markup.indexOf(
        "Taylor&#x27;s chart no longer needs attention.",
      ),
    );
    expect(markup).not.toContain("message-board-priority-icon");
  });

  it("does not hide flavor while a critical alert is active", () => {
    const markup = renderToStaticMarkup(
      <EventMessageBoard
        items={[
          {
            id: "critical",
            category: "action_required",
            priority: "critical",
            showAttentionMarker: true,
            sortKey: 10,
            message: "A patient is leaving.",
          },
          {
            id: "flavor",
            category: "ambient_flavor",
            priority: "flavor",
            sortKey: 9,
            message: "The clipboard remains missing.",
          },
        ]}
        mode="ticker"
      />,
    );

    expect(markup).toContain("A patient is leaving.");
    expect(markup).toContain("The clipboard remains missing.");
  });

  it("mixes flavor chronologically with routine clinic messages", () => {
    const markup = renderToStaticMarkup(
      <EventMessageBoard
        items={[
          {
            id: "older-guidance",
            category: "guidance",
            priority: "informational",
            sortKey: 10,
            message: "Advertising can improve arrivals.",
          },
          {
            id: "middle-flavor",
            category: "ambient_flavor",
            priority: "flavor",
            sortKey: 20,
            message: "The printer has become slow with confidence.",
          },
          {
            id: "newer-success",
            category: "success",
            priority: "informational",
            sortKey: 30,
            message: "The water cooler is ready.",
          },
        ]}
        mode="ticker"
      />,
    );

    expect(markup.indexOf("The water cooler is ready.")).toBeLessThan(
      markup.indexOf("The printer has become slow with confidence."),
    );
    expect(
      markup.indexOf("The printer has become slow with confidence."),
    ).toBeLessThan(markup.indexOf("Advertising can improve arrivals."));
  });

  it("keeps recent messages in the one compact scrolling feed", () => {
    const items = Array.from({ length: 10 }, (_, index) => ({
      id: `event-${index + 1}`,
      category: "ambient_flavor" as const,
      priority: "flavor" as const,
      message: `Clinic update ${index + 1}.`,
    }));
    const markup = renderToStaticMarkup(
      <EventMessageBoard
        items={items}
        mode="ticker"
        maximumVisibleItems={7}
      />,
    );

    expect(markup).toContain("Clinic update 1.");
    expect(markup).toContain("Clinic update 10.");
    expect(markup).not.toContain("<details");
    expect(markup).not.toContain("Recent events");
  });
});
