import { act } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import type { PrototypeShellProps } from "../shellContract";
import type { ChartView, NeedsYouItemView } from "../ui/types";
import MobileShell, { direMobileNeed, mobileNeeds } from "./MobileShell";
import { MobileTopBar } from "./MobileTopBar";
import { inlineDesktopPortals } from "./desktopPanelAdapters";
import { TestDocument, TestElement, findTestElement, testElementProps } from "./testDom";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Live map</div> }));
const noop = () => undefined;
function fixture(overrides: Partial<PrototypeShellProps> = {}): PrototypeShellProps {
  const state = createInitialGameState();
  const view = createPrototypePlayerView(state, null, false, null);
  return new Proxy({ ...view, paused: false, simulationSpeed: 1, employeeDiscussion: null,
    buildMode: false, managementMode: false, buildUndoCount: 0, buildExitBlockedReason: null, buildExitBlockedIssues: [],
    placementOrientation: 0, campaigns: [], systemNotices: [], questionReviewFlags: [], tutorialsEnabled: false,
    tutorialTargetEncounterId: null, tutorialStep: null, announcement: "", ...overrides,
  }, { get(target, key) { return Reflect.has(target, key) ? Reflect.get(target, key) : typeof key === "string" && key.startsWith("on") ? noop : undefined; } }) as PrototypeShellProps;
}
const patientChart: ChartView = {
  id: "fixture-chart", patientName: "Fixture Person", patientDetails: "Fixture", statusLabel: "Action required",
  presentation: "Fixture story.", questionPrompt: "Choose a fixture action.", answerChoices: [
    { id: "choice-z", label: "First frozen choice", disabled: false, selected: false, etaLabel: "Fixture wait" },
    { id: "choice-a", label: "Second frozen choice", disabled: false, selected: false },
  ], terminalFeedbackNeedsAcknowledgment: false, summaryAvailable: false, summaryVisible: false, canFile: false, readOnly: false,
};

function setupBrowser(width = 390) {
  const doc = new TestDocument();
  const rootElement = doc.createElement("div"); doc.body.appendChild(rootElement);
  const viewport = doc.createElement("meta"); viewport.content = "width=device-width, initial-scale=1.0";
  doc.querySelector = ((selector: string) => selector === 'meta[name="viewport"]' ? viewport : null) as typeof doc.querySelector;
  const entries: unknown[] = [null]; let index = 0;
  const browser = Object.assign(new EventTarget(), {
    document: doc, innerWidth: width, innerHeight: 844,
    location: { href: "http://127.0.0.1:5184/?layout=phone&prototype-tools=1", search: "?layout=phone&prototype-tools=1" },
    navigator: { webdriver: true }, localStorage: { getItem: () => null, setItem: vi.fn() },
    matchMedia: () => Object.assign(new EventTarget(), { matches: false }),
    HTMLElement: TestElement, HTMLIFrameElement: class extends TestElement {},
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(0), 0),
    cancelAnimationFrame: (timer: ReturnType<typeof setTimeout>) => clearTimeout(timer), setTimeout, clearTimeout,
    history: {
      get state() { return entries[index]; },
      pushState(state: unknown) { entries.splice(index + 1); entries.push(state); index += 1; },
      replaceState(state: unknown) { entries[index] = state; },
      go(delta: number) { index = Math.max(0, index + delta); queueMicrotask(() => browser.dispatchEvent(new Event("popstate"))); },
      back() { this.go(-1); },
    },
  });
  doc.defaultView = browser;
  vi.stubGlobal("window", browser); vi.stubGlobal("document", doc);
  vi.stubGlobal("HTMLElement", TestElement); vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const findButton = (label: string) => {
    const element = findTestElement(rootElement, (node) => node.tagName === "BUTTON" &&
      (node.attributes["aria-label"] === label || node.textContent === label));
    if (!element) throw new Error(`Button missing: ${label}`);
    return element;
  };
  const click = async (label: string) => { await act(async () => { (testElementProps(findButton(label)).onClick as () => void)(); }); };
  return { browser, doc, rootElement, viewport, click, findButton };
}

afterEach(() => vi.unstubAllGlobals());
describe("MobileShell foundation", () => {
  it.each([360, 390, 412, 768, 844, 1100])("renders the map, clock controls and all five tabs at width %i", (width) => {
    vi.stubGlobal("window", { innerWidth: width, location: { search: "" }, navigator: { webdriver: false } });
    const markup = renderToStaticMarkup(<MobileShell {...fixture()} />);
    expect(markup).toContain('class="mobile-shell"');
    expect(markup).toContain("Live map");
    for (const label of ["Clinic", "Patients", "Alerts", "Manage", "Build", "Facility time", "Pause facility time", "More clinic options", "Recenter facility", "Goals"]) expect(markup).toContain(label);
    expect(markup).not.toContain("Zoom facility");
  });
  it("uses live folder/Needs-you counts for tab badges, including save failures", () => {
    const need: NeedsYouItemView = { id: "blocked", kind: "resource", title: "Setup needed", why: "Fixture", sortKey: 0, action: { kind: "show_goals" }, actionLabel: "Goals" };
    const props = fixture({ patients: [
      { id: "waiting", folder: "waiting", name: "Waiting", subtitle: "Fixture", statusLabel: "Waiting", actionRequired: true, selected: false, satisfactionPercent: 100 },
      { id: "active", folder: "active", name: "Existing", subtitle: "Fixture", statusLabel: "Working", actionRequired: false, selected: false, satisfactionPercent: 100 },
    ], needsYou: [need], systemNotices: [{ id: "save-failure", message: "Fixture storage failed", targetType: "save" }] });
    const markup = renderToStaticMarkup(<MobileShell {...props} />);
    expect(markup).toContain('aria-label="Patients, 1 waiting"');
    expect(markup).toContain('aria-label="Alerts, 2 Needs you"');
    expect(mobileNeeds(props).map((need) => need.kind)).toEqual(["save", "resource"]);
    expect(direMobileNeed([need])).toBeUndefined();
    expect(direMobileNeed(mobileNeeds(props))?.kind).toBe("save");
  });
  it("cycles the existing speed actions and keeps their mode locks", async () => {
    const change = vi.fn(); const env = setupBrowser(); const { createRoot } = await import("react-dom/client");
    const root = createRoot(env.rootElement as unknown as HTMLElement);
    for (const speed of [1, 2, 4] as const) {
      await act(async () => root.render(<MobileTopBar {...fixture({ simulationSpeed: speed, onSimulationSpeedChange: change })} onCash={noop} onMore={noop} />));
      await env.click(`Facility speed ${speed}x. Cycle speed`);
    }
    await act(async () => root.unmount());
    expect(change.mock.calls).toEqual([[2], [4], [1]]);
    const markup = renderToStaticMarkup(<MobileTopBar {...fixture({ buildMode: true, paused: true })} onCash={noop} onMore={noop} />);
    expect(markup).toMatch(/class="mobile-pause"[^>]*disabled/);
    expect(markup).toMatch(/class="mobile-play"[^>]*disabled/);
    expect(markup).toMatch(/class="mobile-speed"[^>]*disabled/);
    expect(markup).toContain("Exit Build Mode to resume.");
  });
  it("keeps all CSS scoped, with 44px targets and safe-area insets, and leaves index.html unchanged", () => {
    const css = readFileSync(new URL("./mobileShell.css", import.meta.url), "utf8");
    const selectors = css.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/([^{}]+)\{/g);
    for (const [_, selector] of selectors) if (!selector!.trim().startsWith("@")) {
      for (const part of selector!.trim().split(",")) expect(part.trim()).toMatch(/^\.mobile-shell(?:\s|\s*$)/);
    }
    expect(css).toContain("min-height: 44px");
    for (const area of ["top", "bottom", "left", "right"]) expect(css).toContain(`safe-area-inset-${area}`);
    expect(readFileSync(new URL("../../index.html", import.meta.url), "utf8")).toContain('content="width=device-width, initial-scale=1.0"');
  });
  it("hosts desktop portals inline without changing their contents or handlers", async () => {
    const { createPortal } = await import("react-dom"); const doc = new TestDocument();
    const action = vi.fn(); const content = <button onClick={action}>Existing action</button>;
    const hosted = inlineDesktopPortals(createPortal(content, doc.body as unknown as HTMLElement));
    expect(hosted).toEqual(content);
  });
  it("reaches every panel, preserves chart choice IDs/order and keeps the top bar visible while answering", async () => {
    const env = setupBrowser(); const { createRoot } = await import("react-dom/client");
    const root = createRoot(env.rootElement as unknown as HTMLElement);
    const open = vi.fn(); const answer = vi.fn(); const pause = vi.fn();
    let props = fixture({ onOpenPatient: open, onSubmitAnswer: answer, onTogglePause: pause, patients: [{
      id: "fixture-chart", folder: "waiting", name: "Fixture Person", subtitle: "Fixture", statusLabel: "Waiting", actionRequired: true, selected: false, satisfactionPercent: 100,
    }] });
    await act(async () => root.render(<MobileShell {...props} />));
    expect(env.viewport.content).toContain("viewport-fit=cover");
    await env.click("Patients, 1 waiting");
    expect(env.rootElement.textContent).toContain("Existing Patients");
    const patient = findTestElement(env.rootElement, (node) => node.tagName === "BUTTON" && node.attributes.class?.includes("mobile-patient-card") === true && node.textContent.includes("Fixture Person"))!;
    await act(async () => { (testElementProps(patient).onClick as () => void)(); });
    expect(open).toHaveBeenCalledWith("fixture-chart"); expect(pause).not.toHaveBeenCalled();
    props = fixture({ ...props, chart: patientChart });
    await act(async () => root.render(<MobileShell {...props} />));
    const chartNode = findTestElement(env.rootElement, (node) => node.attributes.class === "mobile-chart");
    expect(chartNode).toBeDefined(); expect(chartNode?.parentNode?.attributes.class).toBe("mobile-sheet-body");
    expect(env.rootElement.textContent.indexOf("First frozen choice")).toBeLessThan(env.rootElement.textContent.indexOf("Second frozen choice"));
    const choice = findTestElement(env.rootElement, (node) => node.tagName === "BUTTON" && node.textContent.includes("First frozen choice"))!;
    await act(async () => { (testElementProps(choice).onClick as () => void)(); });
    expect(answer).toHaveBeenCalledWith("choice-z");
    expect(env.findButton("Pause facility time")).toBeDefined();
    await act(async () => root.unmount());
    expect(env.viewport.content).toBe("width=device-width, initial-scale=1.0");
  });
  it("uses session entry/exit actions for Manage and Build and honors a blocked Build exit", async () => {
    const env = setupBrowser(); const { createRoot } = await import("react-dom/client"); const root = createRoot(env.rootElement as unknown as HTMLElement);
    const enterManage = vi.fn(); const exitManage = vi.fn(); const enterBuild = vi.fn(); const exitBuild = vi.fn(); const pause = vi.fn();
    let props = fixture({ onEnterManagementMode: enterManage, onExitManagementMode: exitManage, onEnterBuildMode: enterBuild, onExitBuildMode: exitBuild, onTogglePause: pause });
    await act(async () => root.render(<MobileShell {...props} />));
    await env.click("Manage"); expect(enterManage).toHaveBeenCalledOnce(); expect(pause).not.toHaveBeenCalled();
    props = fixture({ ...props, managementMode: true, paused: true }); await act(async () => root.render(<MobileShell {...props} />));
    expect(env.rootElement.textContent).toContain("Employees"); expect(env.rootElement.textContent).toContain("Services"); expect(env.rootElement.textContent).toContain("Money");
    await env.click("Services"); expect(env.rootElement.textContent).toContain("Services");
    await env.click("Money"); expect(env.rootElement.textContent).toContain("Net / hr");
    await env.click("Net per game hour"); expect(env.rootElement.textContent).toContain("Recent service payments");
    await env.click("Back to money");
    await env.click("Clinic"); expect(exitManage).toHaveBeenCalledOnce();
    props = fixture({ ...props, managementMode: false, paused: false }); await act(async () => root.render(<MobileShell {...props} />));
    await env.click("Build"); expect(enterBuild).toHaveBeenCalledOnce();
    props = fixture({ ...props, buildMode: true, paused: true, buildExitBlockedReason: "Fixture access issue", buildExitBlockedIssues: ["Fixture access issue"] });
    await act(async () => root.render(<MobileShell {...props} />));
    expect(env.rootElement.textContent).toContain("New Rooms");
    await env.click("Clinic"); expect(exitBuild).toHaveBeenCalledOnce();
    expect(env.rootElement.textContent).toContain("New Rooms"); // No presentation bypass while session still reports Build.
    expect(env.findButton("Resume facility time").attributes.disabled).toBe("");
    await act(async () => root.unmount());
  });
  it("More exposes Help, Campaigns, Advertising, tools, layout and Save; Back closes the top sheet", async () => {
    const env = setupBrowser(); const { createRoot } = await import("react-dom/client"); const root = createRoot(env.rootElement as unknown as HTMLElement);
    const save = vi.fn(() => ({ ok: true as const, profileCharacters: 0 }));
    const props = fixture({ onSaveAndPause: save }); await act(async () => root.render(<MobileShell {...props} />));
    await env.click("More clinic options");
    for (const text of ["Help", "Campaigns (0)", "Restart Campaign", "Advertising", "Prototype tools", "Phone layout", "Desktop layout", "Save & Close"]) expect(env.rootElement.textContent).toContain(text);
    await env.click("Save & Close"); expect(save).toHaveBeenCalledOnce();
    expect(env.rootElement.textContent).toContain("Safe to close this tab");
    await act(async () => { env.browser.history.back(); });
    expect(env.rootElement.textContent).not.toContain("Safe to close this tab");
    await act(async () => root.unmount());
  });
  it("reaches Alerts and Goals through the guarded action result", async () => {
    const env = setupBrowser(); const { createRoot } = await import("react-dom/client"); const root = createRoot(env.rootElement as unknown as HTMLElement);
    const action = vi.fn(() => ({ ok: false, reason: "Fixture guard refused" })); const advance = vi.fn();
    const props = fixture({ onClinicAlertAction: action, onLevelUp: advance,
      needsYou: [{ id: "fixture-goal", kind: "resource", title: "Fixture setup", why: "Fixture requirement", sortKey: 0, action: { kind: "show_goals" }, actionLabel: "Show goals" }],
      messages: [{ id: "fixture-event", message: "Fixture clinic event", sortKey: 1 }],
      progression: { ...fixture().progression, canLevelUp: true, nextLevelLabel: "Level 1" },
    });
    await act(async () => root.render(<MobileShell {...props} />)); await env.click("Alerts, 1 Needs you");
    expect(env.rootElement.textContent).toContain("Around the clinic"); expect(env.rootElement.textContent).toContain("Fixture clinic event");
    await env.click("Show goals"); expect(env.rootElement.textContent).toContain("Fixture guard refused");
    expect(env.rootElement.textContent).not.toContain("Advance to Level 1");
    action.mockReturnValue({ ok: true, reason: "" }); await env.click("Show goals");
    await env.click("Advance to Level 1"); expect(advance).toHaveBeenCalledOnce();
    await act(async () => { env.browser.history.back(); }); expect(env.rootElement.textContent).toContain("Fixture clinic event");
    await act(async () => root.unmount());
  });
  it("stages setup navigation across Build/Management exactly once per mode entry", async () => {
    const env = setupBrowser(); const { createRoot } = await import("react-dom/client"); const root = createRoot(env.rootElement as unknown as HTMLElement);
    const exitBuild = vi.fn(); const enterManage = vi.fn(); const hire = vi.fn();
    let props = fixture({ buildMode: true, paused: true, onExitBuildMode: exitBuild, onEnterManagementMode: enterManage, onHireStaff: hire,
      progression: { ...fixture().progression, goals: [{ id: "progression.endoscopy_completion", label: "Fixture goal", complete: false, progressLabel: "0/1" }],
        endoscopySetupRequirements: [{ id: "fixture-staff", label: "Fixture staff", detail: "Fixture", met: false, action: { target: "staff", id: "staff.receptionist", label: "Hire" } }] },
    });
    await act(async () => root.render(<MobileShell {...props} />)); await env.click("Goals 0/1");
    await env.click("Hire");
    expect(exitBuild).toHaveBeenCalledOnce(); expect(enterManage).not.toHaveBeenCalled();
    props = fixture({ ...props, buildMode: false, paused: false }); await act(async () => root.render(<MobileShell {...props} />));
    expect(enterManage).toHaveBeenCalledOnce();
    props = fixture({ ...props, managementMode: true, paused: true }); await act(async () => root.render(<MobileShell {...props} />));
    expect(enterManage).toHaveBeenCalledOnce(); expect(hire).not.toHaveBeenCalled();
    await act(async () => root.unmount());
  });
  it("Help pauses/restores through the existing actions and unlocks on a layout unmount", async () => {
    const env = setupBrowser(); const { createRoot } = await import("react-dom/client"); const root = createRoot(env.rootElement as unknown as HTMLElement);
    const pause = vi.fn(); const lock = vi.fn(); let props = fixture({ onTogglePause: pause, onReferencePauseLockedChange: lock });
    await act(async () => root.render(<MobileShell {...props} />)); await env.click("More clinic options"); await env.click("Help");
    expect(pause).toHaveBeenCalledOnce(); expect(lock).toHaveBeenLastCalledWith(true);
    props = fixture({ ...props, paused: true }); await act(async () => root.render(<MobileShell {...props} />));
    expect(env.findButton("Resume facility time").attributes.disabled).toBe("");
    await act(async () => root.unmount());
    expect(pause).toHaveBeenCalledTimes(2); expect(lock).toHaveBeenLastCalledWith(false);
  });
  it("keeps Restart reachable, protects mode entry while its confirmation is open and restores on Cancel", async () => {
    const env = setupBrowser(); const { createRoot } = await import("react-dom/client"); const root = createRoot(env.rootElement as unknown as HTMLElement);
    const pause = vi.fn(); const restart = vi.fn(); let props = fixture({ onTogglePause: pause, onRestart: restart });
    await act(async () => root.render(<MobileShell {...props} />)); await env.click("More clinic options"); await env.click("Restart Campaign");
    expect(pause).toHaveBeenCalledOnce();
    props = fixture({ ...props, paused: true }); await act(async () => root.render(<MobileShell {...props} />));
    expect(env.findButton("Manage").attributes.disabled).toBe(""); expect(env.findButton("Resume facility time").attributes.disabled).toBe("");
    await env.click("Keep playing"); expect(pause).toHaveBeenCalledTimes(2); expect(restart).not.toHaveBeenCalled();
    await act(async () => root.unmount()); expect(pause).toHaveBeenCalledTimes(2);
  });
});
