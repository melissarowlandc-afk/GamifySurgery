import { act, useEffect, useState, type ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { App } from "../App";
import { TestDocument, TestElement, findTestElement } from "./testDom";

const evidence = vi.hoisted(() => ({ mobileImports: 0, sessionMounts: 0, sessionCleanups: 0, clockStarts: 0 }));
vi.mock("../AppShell", () => ({ AppShell: (props: { facility: { tick: number } }) =>
  <section data-shell="desktop" data-tick={props.facility.tick}>Desktop</section> }));
vi.mock("./MobileShell", () => {
  evidence.mobileImports += 1;
  return { default: (props: { facility: { tick: number } }) => <section data-shell="phone" data-tick={props.facility.tick}>Phone</section> };
});
vi.mock("../auth/AuthGate", () => ({ AuthGate: ({ children }: { children: ReactNode }) => children }));
vi.mock("../ui", () => ({ OpeningSequence: ({ onResumeCampaign }: { onResumeCampaign: (id: string) => void }) => {
  useEffect(() => onResumeCampaign("fixture"), []);
  return null;
} }));
vi.mock("../session/tutorialTiming", () => ({ getTutorialClockMultiplier: () => 1 }));
vi.mock("../session", () => ({
  loadPrototypeProfile: () => ({ profile: {} }),
  getActiveCampaign: () => ({ campaignId: "fixture", campaignSeed: "fixture" }),
  selectLocalCampaign: (profile: unknown) => profile,
  savePrototypeProfileResult: () => ({ ok: true }),
  appendLocalCampaign: vi.fn(), archiveLocalCampaign: vi.fn(), restoreLocalCampaign: vi.fn(),
  describePrototypeStorageFailure: () => "Save failed",
  usePrototypeSession: () => {
    const [tick, setTick] = useState(0);
    useEffect(() => {
      evidence.sessionMounts += 1; evidence.clockStarts += 1;
      const timer = setInterval(() => setTick((value) => value + 1), 1000);
      return () => { clearInterval(timer); evidence.sessionCleanups += 1; };
    }, []);
    return new Proxy({
      state: { tick, paused: false, simulationSpeed: 1, openChartEncounterId: null },
      profile: {}, summaryVisible: false, buildMode: false, managementMode: false, tutorialsEnabled: false,
      campaigns: [], questionReviewFlags: [], systemNotices: [],
    }, { get(target, key) { return Reflect.has(target, key) ? Reflect.get(target, key) : () => undefined; } });
  },
  createPrototypePlayerView: (state: { tick: number }) => ({
    facility: { tick: state.tick, realMillisecondsPerFacilityMinuteAt1x: 1000 },
    resourceBar: {}, chart: null, patients: [],
  }),
}));

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });
describe("one App session across shell changes", () => {
  it("renders AppShell without importing mobile, then retains the same running clock across pointer/resize/orientation switches", async () => {
    vi.useFakeTimers();
    const doc = new TestDocument(); const rootElement = doc.createElement("div"); doc.body.appendChild(rootElement);
    const pointer = Object.assign(new EventTarget(), { matches: false });
    const browser = Object.assign(new EventTarget(), {
      document: doc, innerWidth: 390, innerHeight: 844, location: { search: "" },
      localStorage: { getItem: () => null }, matchMedia: () => pointer,
      HTMLElement: TestElement, HTMLIFrameElement: class extends TestElement {},
    });
    doc.defaultView = browser;
    vi.stubGlobal("window", browser); vi.stubGlobal("document", doc);
    vi.stubGlobal("HTMLElement", TestElement); vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const { createRoot } = await import("react-dom/client");
    const root = createRoot(rootElement as unknown as HTMLElement);
    const current = () => findTestElement(rootElement, (node) => Boolean(node.attributes["data-shell"]));
    await act(async () => root.render(<App />));
    expect(current()?.attributes["data-shell"]).toBe("desktop");
    expect(evidence.mobileImports).toBe(0);
    expect(evidence.sessionMounts).toBe(1);
    await act(async () => vi.advanceTimersByTime(1000));
    expect(current()?.attributes["data-tick"]).toBe("1");

    pointer.matches = true;
    await act(async () => { pointer.dispatchEvent(new Event("change")); });
    expect(current()?.attributes["data-shell"]).toBe("phone");
    expect(evidence.mobileImports).toBe(1);
    expect(current()?.attributes["data-tick"]).toBe("1");
    await act(async () => vi.advanceTimersByTime(1000));
    expect(current()?.attributes["data-tick"]).toBe("2");

    browser.innerWidth = 1200;
    await act(async () => { browser.dispatchEvent(new Event("resize")); });
    expect(current()?.attributes["data-shell"]).toBe("desktop");
    browser.innerWidth = 844;
    await act(async () => { browser.dispatchEvent(new Event("orientationchange")); });
    expect(current()?.attributes["data-shell"]).toBe("phone");
    expect(current()?.attributes["data-tick"]).toBe("2");
    expect(evidence.sessionMounts).toBe(1);
    expect(evidence.clockStarts).toBe(1);
    expect(evidence.sessionCleanups).toBe(0);
    await act(async () => root.unmount());
    expect(evidence.sessionCleanups).toBe(1);
  });
});
