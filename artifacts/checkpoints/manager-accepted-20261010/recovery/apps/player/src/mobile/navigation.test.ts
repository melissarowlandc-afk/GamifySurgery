import { describe, expect, it, vi } from "vitest";
import { MobileNavigator } from "./navigation";

function browserHistory() {
  const target = new EventTarget();
  const history = { state: null as unknown, pushState: vi.fn((state) => { history.state = state; }),
    replaceState: vi.fn((state) => { history.state = state; }), back: vi.fn(), go: vi.fn() };
  return { target, history, browser: Object.assign(target, { history }) as unknown as Parameters<MobileNavigator["connect"]>[0] };
}
describe("mobile tab and sheet navigation", () => {
  it("replaces the root tab and stacks full-screen/bottom sheets above it", () => {
    const nav = new MobileNavigator();
    nav.selectTab("patients"); nav.open("chart"); nav.open("more");
    expect(nav.getSnapshot()).toEqual({ tab: "patients", sheets: ["patients", "chart", "more"] });
    nav.closeTop();
    expect(nav.getSnapshot().sheets).toEqual(["patients", "chart"]);
    nav.selectTab("alerts");
    expect(nav.getSnapshot()).toEqual({ tab: "alerts", sheets: ["alerts"] });
    nav.closeTop();
    expect(nav.getSnapshot()).toEqual({ tab: "clinic", sheets: [] });
  });
  it("browser Back closes only the top sheet and preserves other history state", () => {
    const nav = new MobileNavigator(); const { target, history, browser } = browserHistory();
    history.state = { existing: "preserve" }; const disconnect = nav.connect(browser);
    nav.selectTab("patients"); nav.open("goals");
    expect(history.pushState.mock.calls[0]?.[0]).toMatchObject({ existing: "preserve" });
    target.dispatchEvent(new Event("popstate"));
    expect(nav.getSnapshot()).toEqual({ tab: "patients", sheets: ["patients"] });
    target.dispatchEvent(new Event("popstate"));
    expect(nav.getSnapshot()).toEqual({ tab: "clinic", sheets: [] });
    disconnect();
  });
  it("keeps a guarded chart/build sheet until the session confirms closure", () => {
    const nav = new MobileNavigator("build"); const { target, browser, history } = browserHistory();
    nav.connect(browser); nav.beforeClose = vi.fn(() => false);
    target.dispatchEvent(new Event("popstate"));
    expect(nav.beforeClose).toHaveBeenCalledWith("build");
    expect(nav.getSnapshot().sheets).toEqual(["build"]);
    expect(history.pushState).toHaveBeenCalledTimes(2);
    nav.dismiss("build");
    expect(nav.getSnapshot()).toEqual({ tab: "clinic", sheets: [] });
    expect(history.back).toHaveBeenCalledOnce();
  });
  it("does not close a second sheet when UI dismissal receives its matching popstate", () => {
    const nav = new MobileNavigator("patients"); const { target, browser } = browserHistory();
    const unsubscribe = vi.fn(); nav.subscribe(unsubscribe); const disconnect = nav.connect(browser);
    nav.open("chart"); nav.closeTop(); target.dispatchEvent(new Event("popstate"));
    expect(nav.getSnapshot().sheets).toEqual(["patients"]);
    disconnect(); target.dispatchEvent(new Event("popstate"));
    expect(nav.getSnapshot().sheets).toEqual(["patients"]);
    expect(unsubscribe).toHaveBeenCalledTimes(2);
  });
  it("does not add another Back entry when React StrictMode reconnects effects", () => {
    const nav = new MobileNavigator(); const { browser, history } = browserHistory();
    const disconnect = nav.connect(browser); nav.open("chart"); disconnect(); nav.connect(browser);
    expect(history.pushState).toHaveBeenCalledOnce();
    expect(nav.getSnapshot().sheets).toEqual(["chart"]);
  });
  it("waits for native Back before pushing a newly selected root screen", () => {
    const nav = new MobileNavigator(); const { browser, history, target } = browserHistory(); nav.connect(browser);
    nav.selectTab("patients"); nav.open("chart"); nav.dismiss("chart"); nav.selectTab("clinic"); nav.selectTab("manage");
    expect(history.pushState).toHaveBeenCalledTimes(2);
    target.dispatchEvent(new Event("popstate")); // Chart's requested Back, then the queued root Back.
    expect(history.pushState).toHaveBeenCalledTimes(2);
    target.dispatchEvent(new Event("popstate"));
    expect(history.pushState).toHaveBeenCalledTimes(3);
    expect(nav.getSnapshot()).toEqual({ tab: "manage", sheets: ["manage"] });
    target.dispatchEvent(new Event("popstate"));
    expect(nav.getSnapshot()).toEqual({ tab: "clinic", sheets: [] });
  });
});
