import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

const SCREENSHOT_DIRECTORY = ".local-dev/alerts-ui-results";

interface HarnessItem {
  id: string;
  message: string;
  sortKey: number;
  category?: "guidance" | "ambient_flavor" | "action_required";
  priority?: "informational" | "flavor" | "action_required";
  actionLabel?: string;
  targetType?: "patient";
  targetId?: string;
}

async function mountHarness(
  page: Page,
  items: HarnessItem[],
  maximumVisibleItems = 30,
): Promise<void> {
  await page.goto("/");
  await page.evaluate(() => {
    document.body.innerHTML = '<div id="harness"></div>';
    const style = document.createElement("style");
    style.textContent = `
      html, body { width: 100%; height: 760px; margin: 0; }
      #harness { width: min(420px, calc(100vw - 24px)); height: 650px; padding: 12px; }
      #harness .event-message-board {
        display: flex;
        height: 500px;
        max-height: 500px;
        flex-direction: column;
      }
      #harness .message-board-feed {
        height: 420px;
        flex: 0 0 420px;
      }
    `;
    document.head.append(style);
  });
  await page.evaluate(async () => {
    const ReactModule = await import("/node_modules/.vite/deps/react.js");
    const ReactDomClientModule = await import(
      "/node_modules/.vite/deps/react-dom_client.js"
    );
    const createRoot = ReactDomClientModule.createRoot ??
      ReactDomClientModule.default.createRoot;
    const { EventMessageBoard } = await import(
      "/src/ui/EventMessageBoard.tsx"
    );
    const React = ReactModule.default;
    const host = document.querySelector<HTMLElement>("#harness")!;
    let root = createRoot(host);
    const render = (
      nextItems: HarnessItem[],
      nextMaximumVisibleItems = 30,
    ) => {
      root.render(
        React.createElement(EventMessageBoard, {
          items: nextItems,
          maximumVisibleItems: nextMaximumVisibleItems,
          mode: "ticker",
          onAction: () => undefined,
        }),
      );
    };
    Object.assign(window, {
      __messageBoardHarness: {
        render,
        remount: (
          nextItems: HarnessItem[],
          nextMaximumVisibleItems = 30,
        ) => {
          root.unmount();
          host.replaceChildren();
          root = createRoot(host);
          render(nextItems, nextMaximumVisibleItems);
        },
      },
    });
  });
  await page.evaluate(
    ({ nextItems, nextMaximumVisibleItems }) => {
      (
        window as typeof window & {
          __messageBoardHarness: {
            render: (items: HarnessItem[], maximum: number) => void;
          };
        }
      ).__messageBoardHarness.render(
        nextItems,
        nextMaximumVisibleItems,
      );
    },
    { nextItems: items, nextMaximumVisibleItems: maximumVisibleItems },
  );
  await expect(page.locator(".event-message-board")).toBeVisible();
  await expect(page.locator(".message-board-feed")).toHaveCSS(
    "overflow-y",
    "auto",
  );
}

async function renderItems(
  page: Page,
  items: HarnessItem[],
  maximumVisibleItems = 30,
): Promise<void> {
  await page.evaluate(
    ({ nextItems, nextMaximumVisibleItems }) => {
      (
        window as typeof window & {
          __messageBoardHarness: {
            render: (items: HarnessItem[], maximum: number) => void;
          };
        }
      ).__messageBoardHarness.render(
        nextItems,
        nextMaximumVisibleItems,
      );
    },
    { nextItems: items, nextMaximumVisibleItems: maximumVisibleItems },
  );
}

function historyItems(count: number): HarnessItem[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `history-${index}`,
    message: `History message ${index} with enough copy to occupy a stable feed row.`,
    sortKey: index,
    category: "guidance" as const,
    priority: "informational" as const,
  }));
}

async function firstVisibleRow(page: Page) {
  return page.locator(".message-board-feed").evaluate((feed) => {
    const feedTop = feed.getBoundingClientRect().top;
    const row = [...feed.querySelectorAll<HTMLElement>("[data-message-id]")]
      .find((candidate) => candidate.getBoundingClientRect().bottom > feedTop + 1);
    return row
      ? {
          id: row.dataset.messageId!,
          offset: row.getBoundingClientRect().top - feedTop,
          viewportTop: row.getBoundingClientRect().top,
        }
      : null;
  });
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("new rows are finite, genuinely new, and preserve history position", async ({
  page,
}) => {
  const history = historyItems(40);
  await mountHarness(page, history, 30);

  const feed = page.locator(".message-board-feed");
  await expect(feed.locator(".message-board-item")).toHaveCount(30);
  await expect(feed.locator(".is-new-message")).toHaveCount(0);
  await expect(page.locator(".message-board-new-indicator")).toHaveCount(0);

  // Rows supplied on mount but initially outside the cap are still known.
  await renderItems(page, history, 40);
  await expect(feed.locator(".message-board-item")).toHaveCount(40);
  await expect(feed.locator(".is-new-message")).toHaveCount(0);
  const feedMetrics = await feed.evaluate((element) => ({
    clientHeight: element.clientHeight,
    scrollHeight: element.scrollHeight,
  }));
  expect(feedMetrics.scrollHeight).toBeGreaterThan(feedMetrics.clientHeight);

  await feed.hover();
  await page.mouse.wheel(0, 230);
  await expect.poll(() => feed.evaluate((element) => element.scrollTop)).toBeGreaterThan(8);
  await page.waitForTimeout(150);
  const anchorBefore = await firstVisibleRow(page);
  expect(anchorBefore).not.toBeNull();
  await page.clock.install();

  const actionable: HarnessItem = {
    id: "new-action",
    message: "Taylor may leave soon. Open the chart now.",
    sortKey: 100,
    category: "action_required",
    priority: "action_required",
    actionLabel: "Open chart",
    targetType: "patient",
    targetId: "encounter.taylor",
  };
  await renderItems(page, [...history, actionable], 40);

  const newRow = feed.locator('[data-message-id="new-action"]');
  await expect(newRow).toHaveAttribute("data-new-message", "true");
  await expect(newRow.locator(".message-board-new-token")).toHaveText("New");
  await expect(newRow.locator(".message-board-compact-action-label")).toHaveText(
    "Open chart",
  );
  await expect(page.locator(".message-board-new-indicator")).toContainText(
    "1 new message",
  );
  const anchorAfter = await firstVisibleRow(page);
  expect(anchorAfter?.id).toBe(anchorBefore?.id);
  expect(Math.abs((anchorAfter?.offset ?? 0) - (anchorBefore?.offset ?? 0))).toBeLessThanOrEqual(1);
  expect(Math.abs((anchorAfter?.viewportTop ?? 0) - (anchorBefore?.viewportTop ?? 0))).toBeLessThanOrEqual(1);

  const tokenBounds = await newRow.locator(".message-board-new-token").boundingBox();
  const copyBounds = await newRow.locator(".message-board-compact-action-copy").boundingBox();
  expect(tokenBounds).not.toBeNull();
  expect(copyBounds).not.toBeNull();
  expect((copyBounds?.x ?? 0) + (copyBounds?.width ?? 0)).toBeLessThanOrEqual(
    tokenBounds?.x ?? 0,
  );

  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/event-message-board-lifecycle.png`,
    animations: "disabled",
  });

  await page.clock.fastForward(2_001);
  await expect(newRow).toHaveAttribute("data-new-message", "false");
  const anchorAfterExpiry = await firstVisibleRow(page);
  expect(anchorAfterExpiry?.id).toBe(anchorBefore?.id);
  expect(Math.abs((anchorAfterExpiry?.viewportTop ?? 0) - (anchorBefore?.viewportTop ?? 0))).toBeLessThanOrEqual(1);

  await renderItems(page, [
    ...history,
    { ...actionable, message: "Taylor still needs the same chart opened." },
  ], 40);
  await expect(newRow).toHaveAttribute("data-new-message", "false");
  await expect(page.locator(".message-board-new-indicator")).toContainText(
    "1 new message",
  );

  const beforeRemoval = await firstVisibleRow(page);
  await renderItems(
    page,
    [...history.filter((item) => item.id !== "history-39"), actionable],
    40,
  );
  const afterRemoval = await firstVisibleRow(page);
  expect(afterRemoval?.id).toBe(beforeRemoval?.id);
  expect(Math.abs((afterRemoval?.viewportTop ?? 0) - (beforeRemoval?.viewportTop ?? 0))).toBeLessThanOrEqual(1);

  await renderItems(page, history, 40);
  await renderItems(page, [...history, actionable], 40);
  await expect(newRow).toHaveAttribute("data-new-message", "false");
  await expect(page.locator(".message-board-new-indicator")).toContainText(
    "1 new message",
  );

  await page.locator(".message-board-new-indicator").click();
  await expect.poll(() => feed.evaluate((element) => element.scrollTop)).toBe(0);
  await expect(page.locator(".message-board-new-indicator")).toHaveCount(0);

  await feed.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect.poll(() => feed.evaluate((element) => element.scrollTop)).toBeGreaterThan(8);
  const trimmedAnchor = await firstVisibleRow(page);
  const arrivals = Array.from({ length: 20 }, (_, index) => ({
    id: `arrival-${index}`,
    message: `New arrival ${index}`,
    sortKey: 200 + index,
    category: "ambient_flavor" as const,
    priority: "flavor" as const,
  }));
  await renderItems(page, [...history, actionable, ...arrivals], 30);
  const afterTrim = await firstVisibleRow(page);
  expect(afterTrim).not.toBeNull();
  expect(await feed.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect(trimmedAnchor).not.toBeNull();
  await expect(
    feed.locator(`[data-message-id="${trimmedAnchor?.id}"]`),
  ).toHaveCount(0);
  const boundedScroll = await feed.evaluate((element) => ({
    maximum: element.scrollHeight - element.clientHeight,
    top: element.scrollTop,
  }));
  expect(boundedScroll.top).toBeLessThanOrEqual(boundedScroll.maximum);

  await feed.evaluate((element) => {
    element.scrollTop = 0;
    element.dispatchEvent(new Event("scroll"));
  });
  await expect.poll(() => feed.evaluate((element) => element.scrollTop)).toBe(0);
  await expect(page.locator(".message-board-new-indicator")).toHaveCount(0);

  await page.evaluate(
    ({ nextItems }) => {
      (
        window as typeof window & {
          __messageBoardHarness: {
            remount: (items: HarnessItem[], maximum: number) => void;
          };
        }
      ).__messageBoardHarness.remount(nextItems, 30);
    },
    { nextItems: [...history, actionable, ...arrivals] },
  );
  await expect(page.locator(".is-new-message")).toHaveCount(0);
  await expect(page.locator(".message-board-new-indicator")).toHaveCount(0);
});

test("reduced motion removes arrival animation and uses an immediate jump", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  const history = historyItems(35);
  await mountHarness(page, history, 35);
  const feed = page.locator(".message-board-feed");
  await feed.hover();
  await feed.focus();
  await page.keyboard.press("PageDown");
  await expect.poll(() => feed.evaluate((element) => element.scrollTop)).toBeGreaterThan(8);
  await page.clock.install();
  await renderItems(page, [
    ...history,
    {
      id: "reduced-new",
      message:
        "Taylor may leave soon because the chart has been waiting for attention.",
      sortKey: 100,
      category: "action_required",
      priority: "action_required",
      actionLabel: "Open chart",
      targetType: "patient",
      targetId: "encounter.taylor",
    },
  ], 35);
  const newRow = feed.locator('[data-message-id="reduced-new"]');
  await expect(newRow).toHaveCSS("animation-name", "none");

  await feed.evaluate((element) => {
    const original = element.scrollTo.bind(element);
    element.scrollTo = ((options: ScrollToOptions) => {
      (window as typeof window & { __lastScrollBehavior?: ScrollBehavior })
        .__lastScrollBehavior = options.behavior;
      original(options);
    }) as typeof element.scrollTo;
  });
  await page.locator(".message-board-new-indicator").click();
  await expect.poll(() =>
    page.evaluate(() =>
      (window as typeof window & { __lastScrollBehavior?: ScrollBehavior })
        .__lastScrollBehavior,
    ),
  ).toBe("auto");
  await expect(newRow).toBeInViewport();
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/event-message-board-new-row-phone.png`,
    animations: "disabled",
  });
});
