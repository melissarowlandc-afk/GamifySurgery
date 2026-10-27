import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";
import { EventMessageBoard } from "./EventMessageBoard";

afterEach(cleanupPhoneTests);

describe("Alerts scroll ownership", () => {
  it.each([false, true])("preserves history and jumps to newest on the active scroll surface (whole panel: %s)", async scrollWholePanel => {
    const env = phoneTestDom();
    const history = Array.from({ length: 6 }, (_, index) => ({ id: `history-${index}`, message: `History ${index}`, sortKey: index }));
    await env.render(<EventMessageBoard items={history} mode="ticker" scrollWholePanel={scrollWholePanel} />);
    const board = env.find(node => node.tagName === "ASIDE");
    const feed = env.find(node => node.attributes.role === "log");
    const container = scrollWholePanel ? board : feed;
    const other = scrollWholePanel ? feed : board;
    expect(container.attributes.tabindex).toBe("0");
    expect(other.attributes.tabindex).toBeUndefined();
    expect(testElementProps(other).onScroll).toBeUndefined();

    const rows = () => allElements(container, node => Boolean(node.attributes["data-message-id"]))
      .map(row => Object.assign(row, { dataset: { messageId: row.attributes["data-message-id"]! } }));
    container.querySelectorAll = rows;
    Object.assign(container, { scrollTop: 80, scrollHeight: 240, clientHeight: 120 });
    other.scrollTop = 17;
    for (const row of rows()) {
      row.getBoundingClientRect = () => {
        const top = rows().indexOf(row) * 40 - container.scrollTop;
        return { x: 0, y: top, left: 0, top, right: 390, bottom: top + 40, width: 390, height: 40 };
      };
    }
    await act(async () => { (testElementProps(container).onScroll as () => void)(); });
    await env.render(<EventMessageBoard items={[...history, { id: "new", message: "New event", sortKey: 6 }]} mode="ticker" scrollWholePanel={scrollWholePanel} />);
    // The same surviving row stays at the same position after a row is prepended.
    expect(container.scrollTop).toBe(120);
    expect(other.scrollTop).toBe(17);
    const scrollTo = vi.spyOn(container, "scrollTo");
    await env.click("1 new message");
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    expect(other.scrollTop).toBe(17);
  });
});
