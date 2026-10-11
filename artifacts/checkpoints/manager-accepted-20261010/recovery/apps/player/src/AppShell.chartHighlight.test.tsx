import { act, type ComponentProps } from "react";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "./session/viewModels";
import { AppShell } from "./AppShell";
import type { FacilityCanvasProps } from "./facility/FacilityCanvas";
import type { ChartView, PatientFolder, PatientTabView } from "./ui/types";
import { TestDocument, TestElement, findTestElement } from "./mobile/testDom";

let mapProps: FacilityCanvasProps;
vi.mock("./facility", () => ({ FacilityCanvas: (props: FacilityCanvasProps) => {
  mapProps = props;
  return <div data-testid="facility-canvas">Map fixture</div>;
} }));

type ShellProps = ComponentProps<typeof AppShell>;
const noop = () => undefined;
const patient = (id: string, folder: PatientFolder, selected = false): PatientTabView => ({
  id, folder, name: id, subtitle: "Fixture", statusLabel: "Fixture", actionRequired: false, selected, satisfactionPercent: 100,
});
function fixture(overrides: Partial<ShellProps> = {}): ShellProps {
  const view = createPrototypePlayerView(createInitialGameState(), null, false, null);
  return new Proxy({ ...view, paused: false, simulationSpeed: 1, employeeDiscussion: null,
    buildMode: false, managementMode: false, buildUndoCount: 0, buildExitBlockedReason: null, buildExitBlockedIssues: [],
    placementOrientation: 0, campaigns: [], systemNotices: [], questionReviewFlags: [], tutorialsEnabled: false,
    tutorialTargetEncounterId: null, tutorialStep: null, announcement: "", ...overrides,
  }, { get(target, key) { return Reflect.has(target, key) ? Reflect.get(target, key) : typeof key === "string" && key.startsWith("on") ? noop : undefined; } }) as ShellProps;
}

async function mount(props: ShellProps, reducedMotion = false) {
  vi.useFakeTimers();
  const doc = new TestDocument();
  const host = doc.createElement("div"); doc.body.appendChild(host);
  const browser = Object.assign(new EventTarget(), {
    document: doc, innerWidth: 1280, innerHeight: 900,
    location: { href: "http://127.0.0.1:5184/", search: "" }, navigator: { webdriver: false },
    localStorage: { getItem: () => null, setItem: vi.fn() },
    matchMedia: vi.fn(() => Object.assign(new EventTarget(), { matches: reducedMotion })),
    HTMLElement: TestElement, HTMLIFrameElement: class extends TestElement {},
    requestAnimationFrame: (callback: FrameRequestCallback) => setTimeout(() => callback(0), 0),
    cancelAnimationFrame: clearTimeout, setTimeout, clearTimeout,
  });
  doc.defaultView = browser;
  vi.stubGlobal("window", browser); vi.stubGlobal("document", doc);
  vi.stubGlobal("HTMLElement", TestElement); vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(host as unknown as HTMLElement);
  await act(async () => root.render(<AppShell {...props} />));
  const row = (id: string) => findTestElement(host, (element) => element.attributes["data-patient-chart-id"] === id)!;
  const byClass = (className: string) => findTestElement(host, (element) => element.attributes.class === className)!;
  const highlight = (id: string) => findTestElement(row(id), (element) => element.attributes.class === "patient-chart-highlight");
  const request = async (id: string) => { await act(async () => mapProps.onHighlightPatientChart!(id)); };
  const advance = async (ms: number) => { await act(async () => vi.advanceTimersByTime(ms)); };
  const unmount = async () => { await act(async () => root.unmount()); };
  return { doc, root, host, row, byClass, highlight, request, advance, unmount };
}

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe("desktop chart rail map locator", () => {
  it.each(["waiting", "active"] as const)("scrolls and highlights the matching %s row for two seconds without opening a chart or changing the clock", async (folder) => {
    const open = vi.fn(); const move = vi.fn(); const pause = vi.fn(); const save = vi.fn();
    const env = await mount(fixture({ patients: [patient("target", folder), patient("other", "active")],
      onOpenPatient: open, onMoveFounder: move, onTogglePause: pause, onSaveAndPause: save }));
    const scroller = env.byClass("patient-live-folders");
    scroller.getBoundingClientRect = () => ({ x: 0, y: 100, left: 0, top: 100, right: 200, bottom: 300, width: 200, height: 200 });
    env.row("target").getBoundingClientRect = () => ({ x: 0, y: 440, left: 0, top: 440, right: 200, bottom: 512, width: 200, height: 72 });
    const focus = env.doc.activeElement;
    const facility = mapProps.viewModel;
    await env.request("target");
    expect(scroller.scrollTop).toBe(212);
    expect(env.highlight("target")).toBeDefined(); expect(env.highlight("other")).toBeUndefined();
    expect(env.doc.activeElement).toBe(focus);
    expect(mapProps.viewModel.selectedPatientInstanceId).toBeNull();
    expect(mapProps.viewModel.facilityTick).toBe(facility.facilityTick);
    expect(mapProps.viewModel.paused).toBe(facility.paused);
    expect(env.host.textContent).toContain("Open a patient chart to place it here.");
    for (const action of [open, move, pause, save]) expect(action).not.toHaveBeenCalled();
    await env.advance(1_999); expect(env.highlight("target")).toBeDefined();
    await env.advance(1); expect(env.highlight("target")).toBeUndefined();
    await env.unmount();
  });

  it("keeps an already open chart on the clinical desk while locating another patient", async () => {
    const chart: ChartView = { id: "open", patientName: "Open Patient", patientDetails: "Fixture", statusLabel: "Fixture",
      presentation: "The current chart stays here.", answerChoices: [], terminalFeedbackNeedsAcknowledgment: false,
      summaryAvailable: false, summaryVisible: false, canFile: false, readOnly: true };
    const open = vi.fn(); const close = vi.fn();
    const env = await mount(fixture({ chart, patients: [patient("open", "active", true), patient("waiting", "waiting")], onOpenPatient: open, onCloseChart: close }));
    await env.request("open");
    expect(env.highlight("open")).toBeDefined();
    await env.request("waiting");
    expect(env.highlight("waiting")).toBeDefined(); expect(env.highlight("open")).toBeUndefined();
    expect(env.row("open").attributes["aria-current"]).toBe("page");
    expect(env.doc.body.textContent).toContain("The current chart stays here.");
    expect(open).not.toHaveBeenCalled(); expect(close).not.toHaveBeenCalled();
    await env.unmount();
  });

  it("expands the inline Resolved drawer and scrolls its matching filed row without opening a dialog", async () => {
    const open = vi.fn(); const env = await mount(fixture({ patients: [patient("filed", "resolved")], onOpenPatient: open }));
    const drawer = env.byClass("resolved-chart-drawer"); const live = env.byClass("patient-live-folders");
    drawer.getBoundingClientRect = () => ({ x: 0, y: 100, left: 0, top: 100, right: 200, bottom: 300, width: 200, height: 200 });
    env.row("filed").getBoundingClientRect = () => ({ x: 0, y: 460, left: 0, top: 460, right: 200, bottom: 520, width: 200, height: 60 });
    const dialogsBefore = env.doc.body.textContent;
    expect(env.byClass("resolved-cabinet-button").attributes["aria-expanded"]).toBe("false");
    await env.request("filed");
    expect(env.byClass("resolved-cabinet-button").attributes["aria-expanded"]).toBe("true");
    expect(drawer.attributes.hidden).toBeUndefined(); expect(drawer.scrollTop).toBe(220); expect(live.scrollTop).toBe(0);
    expect(env.highlight("filed")).toBeDefined(); expect(open).not.toHaveBeenCalled();
    expect(env.doc.body.textContent).toBe(dialogsBefore.replace("Open", "Close"));
    await env.unmount();
  });

  it("does nothing new for an unavailable chart ID", async () => {
    const env = await mount(fixture({ patients: [patient("waiting", "waiting")] }));
    await env.request("not-in-rail");
    expect(env.highlight("waiting")).toBeUndefined();
    expect(env.byClass("resolved-cabinet-button").attributes["aria-expanded"]).toBe("false");
    expect(env.byClass("patient-live-folders").scrollTop).toBe(0);
    await env.unmount();
  });

  it("scrolls upward only when needed and restarts the pulse and timeout on another click of the same patient", async () => {
    const env = await mount(fixture({ patients: [patient("target", "waiting")] }));
    const scroller = env.byClass("patient-live-folders"); scroller.scrollTop = 300;
    scroller.getBoundingClientRect = () => ({ x: 0, y: 100, left: 0, top: 100, right: 200, bottom: 300, width: 200, height: 200 });
    env.row("target").getBoundingClientRect = () => ({ x: 0, y: 40, left: 0, top: 40, right: 200, bottom: 112, width: 200, height: 72 });
    await env.request("target"); expect(scroller.scrollTop).toBe(240);
    const pulse = env.highlight("target"); await env.advance(1_500);
    env.row("target").getBoundingClientRect = () => ({ x: 0, y: 120, left: 0, top: 120, right: 200, bottom: 192, width: 200, height: 72 });
    await env.request("target"); expect(env.highlight("target")).not.toBe(pulse); expect(scroller.scrollTop).toBe(240);
    await env.advance(500); expect(env.highlight("target")).toBeDefined();
    await env.advance(1_500); expect(env.highlight("target")).toBeUndefined();
    await env.unmount();
  });

  it("uses a static reduced-motion highlight with the same two-second lifetime", async () => {
    const css = readFileSync(new URL("./styles/global.css", import.meta.url), "utf8");
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.patient-chart-highlight\s*\{\s*animation: none;/);
    expect(css).toMatch(/\.patient-chart-highlight\s*\{[^}]*border: 3px solid[^}]*pointer-events: none;[^}]*animation: patient-chart-highlight-pulse/s);
    const env = await mount(fixture({ patients: [patient("target", "active")] }), true);
    await env.request("target"); expect(env.highlight("target")).toBeDefined();
    await env.advance(2_000); expect(env.highlight("target")).toBeUndefined();
    await env.unmount();
  });
});
