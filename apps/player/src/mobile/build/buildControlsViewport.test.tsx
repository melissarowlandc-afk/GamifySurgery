import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import type { FacilityCanvasProps } from "../../facility";
import { createPrototypePlayerView } from "../../session/viewModels";
import MobileShell from "../MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../screenTestUtils";
import { TestElement } from "../testDom";
import { mobileBuildControlInsets, observeMobileBuildControls } from "./buildControlsViewport";

const capture = vi.hoisted(() => ({ map: null as FacilityCanvasProps | null }));
vi.mock("../../facility", () => ({ FacilityCanvas: (props: FacilityCanvasProps) => { capture.map = props; return <div data-testid="facility-canvas">Map</div>; } }));
afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); capture.map = null; });

function rect(left: number, top: number, right: number, bottom: number) {
  return { x: left, y: top, left, top, right, bottom, width: right - left, height: bottom - top };
}

it.each([
  { name: "portrait with Save & Close protruding above the footer", width: 390, height: 844,
    workspace: rect(0, 120, 390, 746), hud: rect(0, 0, 390, 120), navigation: rect(0, 746, 390, 844), strip: rect(4, 698, 102, 742) },
  { name: "short portrait with a tall blueprint and safe areas", width: 390, height: 480,
    workspace: rect(12, 100, 378, 402), hud: rect(12, 20, 378, 100), navigation: rect(12, 402, 378, 460), strip: rect(16, 354, 114, 398) },
  { name: "landscape with navigation on the left", width: 844, height: 390,
    workspace: rect(76, 60, 824, 370), hud: rect(20, 10, 824, 60), navigation: rect(0, 60, 76, 370), strip: rect(4, 300, 72, 366) },
])("C1 D2: keeps the phone build anchors in the unobstructed viewport at every ghost position: $name", async geometry => {
  const env = phoneTestDom(); Object.assign(env.browser, { innerWidth: geometry.width, innerHeight: geometry.height });
  const originalRect = TestElement.prototype.getBoundingClientRect;
  vi.spyOn(TestElement.prototype, "querySelector").mockImplementation(function (this: TestElement, selector?: string) {
    return allElements(this, node => selector?.startsWith(".") === true && (node.attributes.class ?? "").split(" ").includes(selector.slice(1)))[0] as never ?? null;
  });
  vi.spyOn(TestElement.prototype, "getBoundingClientRect").mockImplementation(function (this: TestElement) {
    const classes = (this.attributes.class ?? "").split(" ");
    for (const [name, bounds] of [["mobile-workspace", geometry.workspace], ["mobile-top-bar", geometry.hud],
      ["mobile-navigation", geometry.navigation], ["mobile-session-strip", geometry.strip]] as const) if (classes.includes(name)) return bounds;
    if (classes.includes("mobile-shell")) return rect(0, 0, geometry.width, geometry.height);
    if (classes.includes("mobile-build-controls")) {
      // Captured tray/obstruction geometry from the failing browser, with the
      // real positioning layer's CSS insets applied by this DOM-only harness.
      const bottom = geometry.workspace.bottom - (Number.parseFloat(String(this.style.bottom)) || 0);
      const height = Math.min(354, Number.parseFloat(String(this.style.maxHeight)) || Infinity);
      return rect(geometry.workspace.left + (Number.parseFloat(String(this.style.left)) || 0), bottom - height,
        geometry.workspace.right - (Number.parseFloat(String(this.style.right)) || 0), bottom);
    }
    return originalRect.call(this);
  });
  const state = createInitialGameState(); state.paused = true; state.encounters = {}; state.facilityLevel = 3;
  state.rooms.push({ id: "c1.viewport", roomDefinitionId: "room.waiting", x: 15, y: 10, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  const view = createPrototypePlayerView(state, null, false, "room.waiting", true, "c1.viewport");
  const props = phoneFixture({ ...view, buildMode: true, paused: true, movingRoomInstanceId: "c1.viewport",
    remodelBlueprint: { active: true, busy: false, valid: false, reason: null, invalidRoomIds: [], steps: [], undoCount: 0,
      rooms: [{ id: "c1.viewport", name: "Waiting Room" }], begin: vi.fn(), editRoom: vi.fn(), undo: vi.fn(), cancel: vi.fn(), apply: vi.fn(() => true) },
    mobileBuildActions: { previewPlacement: () => ({ valid: true, reason: null, cost: 0 }), previewHallway: () => ({ cells: [], buildCells: [], cost: 0, reason: null }),
      previewDoor: () => ({ valid: false, reason: "unused", cost: 0 }), commitHallway: () => false },
  });
  await env.render(<MobileShell {...props} />);
  const tray = env.find(node => (node.attributes.class ?? "").split(" ").includes("mobile-build-controls"));
  const bottomLimit = geometry.strip.right > geometry.workspace.left ? geometry.strip.top : geometry.workspace.bottom;
  for (const point of [{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 0, y: 100 }, { x: 100, y: 100 }, { x: 15, y: 10 }]) {
    await act(async () => capture.map!.mobileBuild!.onIntent({ kind: "ghost", point }));
    const confirm = env.find(node => node.attributes["data-phone-build-confirm"] === "placement");
    expect(confirm.textContent).toContain("Stage move"); expect(confirm.attributes.disabled).toBeUndefined();
    const bounds = tray.getBoundingClientRect();
    expect(bounds.bottom, "Stage move / Rotate / Cancel must clear the session strip, not only the footer").toBeLessThanOrEqual(bottomLimit);
    expect(bounds.top, "the expanded tray must not cover the HUD").toBeGreaterThanOrEqual(geometry.workspace.top);
    expect(bounds.left).toBeGreaterThanOrEqual(geometry.workspace.left); expect(bounds.right).toBeLessThanOrEqual(geometry.workspace.right);
    expect(env.button("Save & Close")).toBeDefined();
    for (const label of ["Room catalog", "Done", "Cancel blueprint", "Apply remodel"]) expect(env.button(label)).toBeDefined();
  }
});

it("updates all tray anchors and the map/sheet reservation when session links or the visible viewport change, then detaches observers", () => {
  const env = phoneTestDom();
  const shell = env.doc.createElement("div"), workspace = env.doc.createElement("div"), controls = env.doc.createElement("aside");
  const hud = env.doc.createElement("header"), navigation = env.doc.createElement("footer"), strip = env.doc.createElement("div");
  shell.setAttribute("class", "mobile-shell"); workspace.setAttribute("class", "mobile-workspace");
  shell.appendChild(hud); shell.appendChild(workspace); shell.appendChild(navigation); workspace.appendChild(controls); navigation.appendChild(strip);
  shell.querySelector = ((selector: string) => ({ ".mobile-top-bar": hud, ".mobile-navigation": navigation, ".mobile-session-strip": strip })[selector] ?? null) as never;
  workspace.getBoundingClientRect = () => rect(12, 120, 378, 746);
  hud.getBoundingClientRect = () => rect(12, 20, 378, 120);
  navigation.getBoundingClientRect = () => rect(12, 746, 378, 824);
  let stripTop = 698;
  strip.getBoundingClientRect = () => rect(16, stripTop, 114, 742);
  controls.getBoundingClientRect = () => {
    const bottom = 746 - Number.parseFloat(String(controls.style.bottom));
    return rect(12, bottom - 200, 378, bottom);
  };
  const viewport = Object.assign(new EventTarget(), { offsetLeft: 20, offsetTop: 30, width: 350, height: 740 });
  Object.assign(env.browser, { visualViewport: viewport });
  let resized!: () => void;
  const observe = vi.fn(), disconnect = vi.fn();
  vi.stubGlobal("ResizeObserver", class { constructor(callback: () => void) { resized = callback; } observe = observe; disconnect = disconnect; });
  const height = vi.fn(), stop = observeMobileBuildControls(controls as unknown as HTMLElement, height);
  expect(controls.style.bottom).toBe("48px"); expect(controls.style.left).toBe("8px"); expect(controls.style.right).toBe("8px");
  expect(height).toHaveBeenLastCalledWith(248); expect(observe).toHaveBeenCalledTimes(5);
  stripTop = 650; resized();
  expect(controls.style.bottom).toBe("96px"); expect(height).toHaveBeenLastCalledWith(296);
  viewport.height = 500; viewport.dispatchEvent(new Event("resize"));
  expect(controls.style.bottom).toBe("216px"); expect(controls.style.maxHeight).toBe("410px");
  stop(); expect(disconnect).toHaveBeenCalledOnce();
  viewport.height = 400; viewport.dispatchEvent(new Event("scroll")); env.browser.dispatchEvent(new Event("resize"));
  expect(controls.style.bottom).toBe("216px");
});

it("uses the actual obstruction edge for tall bottom navigation and for a right-side navigation band", () => {
  expect(mobileBuildControlInsets(rect(0, 100, 390, 700), rect(0, 0, 390, 1400), undefined,
    rect(0, 700, 390, 1400), rect(4, 652, 102, 696))).toMatchObject({ left: 0, bottom: 48, maxHeight: 552 });
  expect(mobileBuildControlInsets(rect(0, 60, 844, 370), rect(0, 0, 844, 390), undefined,
    rect(768, 60, 844, 370), rect(740, 300, 840, 366))).toMatchObject({ left: 0, right: 104, bottom: 0, maxHeight: 310 });
});
