import { ClinicPresentationGate } from "./ClinicPresentationGate";
import { CloudSaveControls, type CloudShellSave } from "./CloudSaveControls";
import { Profiler, StrictMode, act, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContinuousLoading, LOADING_SURFACE_ID } from "./ContinuousLoading";
import { LoadingRest, useLoadingFlow } from "./LoadingFlowContext";
import { LoadingScreen } from "./LoadingScreen";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./testDomHarness";
import type { LoadingPhase } from "./loadingFlow";
import { testElementProps, type TestElement } from "../mobile/testDom";

vi.mock("../feedback/TesterFeedback", () => ({ ProblemReportButton: () => <a href="#report">Send a problem report</a> }));
afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); });

function surface(env: ReturnType<typeof phoneTestDom>) { return env.doc.getElementById(LOADING_SURFACE_ID)!; }
function visible(env: ReturnType<typeof phoneTestDom>) {
  const host = surface(env);
  return host?.attributes.hidden === undefined ? "loading" : env.element.textContent;
}
function bar(host: TestElement) { return allElements(host, node => node.attributes.role === "progressbar")[0]!; }
function Request({ phase }: { phase: LoadingPhase }) { return <LoadingScreen phase={phase} status={`Stage ${phase}`} onRetry={() => {}} />; }

describe.each(["phone", "desktop"])("%s continuous loading surface", layout => {
  it.each(["remembered account", "submitted sign-in", "local reload", "cloud reopen", "expired lease"])("covers every stage in %s with one monotonic bar and no remount", async () => {
    const env = phoneTestDom(); Object.assign(env.browser.location, { search: `?layout=${layout}` });
    const seen: string[] = [], values: number[] = [];
    const render = (child: ReactNode) => env.render(<StrictMode><ContinuousLoading>
      <Profiler id="screens" onRender={() => { const host = surface(env); if (host) { seen.push(visible(env)); const progress = host.attributes["data-loading-progress"]; if (progress) values.push(Number(progress)); } }}>{child}</Profiler>
    </ContinuousLoading></StrictMode>);
    await render(<Request key="auth" phase="auth" />);
    const host = surface(env), progress = bar(host), brand = allElements(host, node => node.attributes["data-testid"] === "intro-tagline")[0]!;
    for (const phase of ["access", "selection", "copies", "hydrate", "journal", "engine", "art", "frame"] as const) {
      // Unmount the old request before the next one: an async routing gap must
      // retain the same section, brand, bar, value and opaque loading screen.
      await render(<main>Transient chooser or empty shell</main>);
      expect(visible(env)).toBe("loading");
      await render(<><main>Transient notices</main><Request key={phase} phase={phase} /></>);
      expect(surface(env)).toBe(host); expect(bar(host)).toBe(progress);
      expect(allElements(host, node => node.attributes["data-testid"] === "intro-tagline")[0]).toBe(brand);
      expect(Number(progress.attributes["aria-valuenow"])).toBeLessThan(100);
      expect(allElements(host, node => node.tagName === "BUTTON")).toHaveLength(0);
    }
    expect(seen.every(screen => screen === "loading")).toBe(true);
    await render(<main>Playable clinic<LoadingRest /></main>);
    expect(visible(env)).toBe("Playable clinic"); expect(surface(env)).toBe(host);
    expect(bar(host).attributes["aria-valuenow"]).toBe("100");
    expect(values.every((value, i) => i === 0 || value >= values[i - 1]!)).toBe(true);
  });
});

it("adopts the preboot section without replacing it or its chosen tagline", async () => {
  const env = phoneTestDom(), boot = env.doc.createElement("section");
  boot.setAttribute("id", LOADING_SURFACE_ID); boot.setAttribute("data-loading-tagline", "A cut above the rest."); env.doc.body.appendChild(boot);
  await env.render(<ContinuousLoading><Request phase="auth" /></ContinuousLoading>);
  expect(surface(env)).toBe(boot); expect(boot.attributes["data-loading-managed"]).toBe("true");
  expect(allElements(env.doc.body, node => node.attributes.id === LOADING_SURFACE_ID)).toHaveLength(1);
});

it("offers one real failure action and the context-preserving problem-report path", async () => {
  const env = phoneTestDom(), retry = vi.fn();
  await env.render(<ContinuousLoading><LoadingScreen status="Checking" phase="copies" failure="Could not check your save." onRetry={retry} /></ContinuousLoading>);
  const host = surface(env), buttons = allElements(host, node => node.tagName === "BUTTON");
  expect(buttons.map(node => node.textContent)).toEqual(["Try again"]);
  expect(host.textContent).toContain("Send a problem report"); expect(host.textContent).toContain("Could not check your save");
  await act(async () => { (testElementProps(buttons[0]!).onClick as () => void)(); }); expect(retry).toHaveBeenCalledOnce();
});

it("reuses the surface above a restored native chart and leaves report-dialog focus alone", async () => {
  const env = phoneTestDom(); let changed!: () => void;
  const disconnected = vi.fn();
  vi.stubGlobal("MutationObserver", class { constructor(callback: () => void) { changed = callback; } observe() {} disconnect = disconnected; });
  let dialogs: unknown[] = [];
  Object.assign(env.doc, { querySelectorAll: () => dialogs });
  await env.render(<ContinuousLoading><Request phase="art" /></ContinuousLoading>);
  const host = surface(env), barBefore = bar(host), chart = env.doc.createElement("dialog");
  chart.setAttribute("open", ""); env.doc.body.appendChild(chart); dialogs = [chart];
  const heading = env.doc.createElement("h2"); chart.appendChild(heading); heading.focus();
  await act(async () => changed());
  expect(host.parentNode).toBe(chart); expect(bar(host)).toBe(barBefore);
  const report = env.doc.createElement("dialog"), field = env.doc.createElement("input");
  Object.assign(report, { classList: { contains: (name: string) => name === "problem-report-dialog" } });
  report.appendChild(field); env.doc.body.appendChild(report); dialogs.push(report); field.focus();
  await act(async () => changed());
  expect(env.doc.activeElement).toBe(field); expect(host.parentNode).toBe(chart);
  await env.render(<ContinuousLoading><main>Clinic<LoadingRest /></main></ContinuousLoading>);
  expect(host.attributes.hidden).toBe(""); expect(host.parentNode).toBe(env.doc.body);
  expect(env.doc.activeElement).toBe(heading);
  expect(disconnected).toHaveBeenCalled();
});

it("does not flash a short routine check and starts submitted intents immediately", async () => {
  vi.useFakeTimers(); const env = phoneTestDom();
  let begin!: () => void;
  function Intent() { const flow = useLoadingFlow()!; begin = () => flow.begin("auth"); return null; }
  const render = (checking: boolean) => env.render(<ContinuousLoading><Intent /><LoadingRest ready={!checking} /><LoadingScreen active={checking} phase="copies" status="Checking" /></ContinuousLoading>);
  await render(false); expect(surface(env).attributes.hidden).toBe("");
  await render(true); await act(async () => { await vi.advanceTimersByTimeAsync(399); });
  expect(surface(env).attributes.hidden).toBe(""); await render(false); expect(surface(env).attributes.hidden).toBe("");
  await act(async () => { begin(); env.root.render(<ContinuousLoading><LoadingScreen phase="auth" status="Connecting" immediate /></ContinuousLoading>); });
  expect(surface(env).attributes.hidden).toBeUndefined();
});

it.each(["capacity", "storage", "blocked", "closed"] as const)("reveals a real %s resting error instead of leaving it hidden under loading", async phase => {
  vi.useFakeTimers(); const env = phoneTestDom();
  const view = { phase, canExecute: false, localDurable: phase !== "storage", pending: false, revision: "1", confirmedAtMs: 1,
    failure: phase === "blocked" ? "corrupt" : phase === "closed" ? "writer" : phase };
  const save = { campaignName: "Public clinic", view, onRetry: vi.fn(), onSaveAndClose: vi.fn() } as unknown as CloudShellSave;
  await env.render(<ContinuousLoading><CloudSaveControls save={save} showCloseButton={false} /></ContinuousLoading>);
  expect(surface(env).attributes.hidden).toBe("");
  await act(async () => { await vi.advanceTimersByTimeAsync(400); });
  expect(surface(env).attributes.hidden).toBe("");
  expect(allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic status")).toHaveLength(1);
  expect(save.onRetry).not.toHaveBeenCalled();
});

it("does not offer a no-op recovery when local presentation code has not created a canvas", async () => {
  vi.useFakeTimers(); const env = phoneTestDom();
  await env.render(<ContinuousLoading><ClinicPresentationGate campaignId="public.fixture" authorized /></ContinuousLoading>);
  await act(async () => { await vi.advanceTimersByTimeAsync(30_000); });
  const host = surface(env); expect(host.textContent).toContain("taking longer than expected");
  expect(allElements(host, node => node.tagName === "BUTTON")).toHaveLength(0);
  expect(host.textContent).toContain("Send a problem report");
});

it("shows a working connection-check action for an unexplained closed command gate after its short hold", async () => {
  vi.useFakeTimers(); const env = phoneTestDom(), retry = vi.fn(async () => true);
  const save = { campaignName: "Public clinic", view: { phase: "ready", canExecute: false, localDurable: true, pending: false,
    revision: "1", confirmedAtMs: 1, failure: null }, onRetry: retry, onSaveAndClose: vi.fn() } as unknown as CloudShellSave;
  await env.render(<ContinuousLoading><CloudSaveControls save={save} showCloseButton={false} /></ContinuousLoading>);
  expect(surface(env).attributes.hidden).toBeUndefined();
  await act(async () => { await vi.advanceTimersByTimeAsync(400); });
  expect(surface(env).attributes.hidden).toBe("");
  const notices = allElements(env.doc.body, node => node.attributes["aria-label"] === "Clinic status");
  expect(notices).toHaveLength(1); expect(notices[0]!.textContent).toContain("connection check");
  const button = allElements(notices[0]!, node => node.tagName === "BUTTON")[0]!;
  await act(async () => { (testElementProps(button).onClick as () => void)(); });
  expect(retry).toHaveBeenCalledOnce();
});
