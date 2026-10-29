import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { MobileTopBar } from "./MobileTopBar";
import { cleanupPhoneTests, phoneFixture, phoneTestDom } from "./screenTestUtils";
import { showCommandProblem } from "../diagnostics/problemDiagnostics";

afterEach(async () => { showCommandProblem(null); vi.restoreAllMocks(); await cleanupPhoneTests(); });
it("releases its duplicate-tap latch after a refused command even without a paused/locked prop change", async () => {
  const env = phoneTestDom(), onTogglePause = vi.fn(); let now = 0; vi.spyOn(Date, "now").mockImplementation(() => now);
  await env.render(<MobileTopBar {...phoneFixture({ paused: true, onTogglePause })} onCash={() => {}} onMore={() => {}} />);
  await env.click("Resume facility time"); await env.click("Resume facility time"); expect(onTogglePause).toHaveBeenCalledOnce();
  now = 500; await env.click("Resume facility time"); expect(onTogglePause).toHaveBeenCalledTimes(2);
});
it("shows a rejected command visibly above an open sheet and does not let timer ticks dismiss it", async () => {
  const env = phoneTestDom(); await env.render(<MobileTopBar {...phoneFixture()} onCash={() => {}} onMore={() => {}} />);
  await act(async () => showCommandProblem("The action is unavailable. Try again."));
  expect(env.element.textContent).toContain("The action is unavailable. Try again.");
  expect(env.find(node => node.attributes["aria-label"] === "Action could not be completed")).toBeDefined();
  await env.click("Dismiss"); expect(env.element.textContent).not.toContain("The action is unavailable");
});
