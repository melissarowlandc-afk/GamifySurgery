import { describe, expect, it, vi } from "vitest";
import { createInitialGameState, gameReducer } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene, type FacilitySceneBridge } from "../../facility/FacilityScene";
import { MobileMapPresentationPolicy, mobileCanvasSize, mobileMapIsCovered } from "./presentationPolicy";
import { syncRouteMotion, sampleRouteMotion } from "../../facility/routeMotion";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));

function harness(mobile = true) {
  const policy = new MobileMapPresentationPolicy();
  const bridge: FacilitySceneBridge = { mobileInput: mobile, mobilePresentation: policy,
    viewModel: createPrototypePlayerView(createInitialGameState(), null, false, null).facility, onPlaceRoom: vi.fn() };
  // Exercise the real update/gate/resync and real route sampling, replacing
  // only browser graphics/layout adapters. No timer or reducer is mocked.
  const scene = new FacilityScene(bridge) as any;
  scene.cameras = { main: { setVisible: vi.fn() } };
  for (const method of ["ensureMobileAtlases", "syncMobileInputMode", "applyMobileGestures", "refreshLayout",
    "drawMobileBuildPreview", "reportSelectedRoomRect", "drawCharacters", "reportAlertPinPositions", "drawEarningsPopups"])
    scene[method] = vi.fn();
  return { scene, bridge, policy };
}

describe("phone presentation policy", () => {
  it.each(["patients", "alerts", "manage"])("covers %s but keeps every bottom sheet's exposed map running", tab => {
    expect(mobileMapIsCovered(tab, null)).toBe(true);
    expect(mobileMapIsCovered(tab, "full")).toBe(true);
    expect(mobileMapIsCovered(tab, "bottom")).toBe(false);
  });
  it("keeps Clinic, inspector and the Build catalog/controls rendering", () => {
    expect(mobileMapIsCovered("clinic", null)).toBe(false);
    expect(mobileMapIsCovered("clinic", "bottom")).toBe(false);
    expect(mobileMapIsCovered("build", "bottom")).toBe(false);
    expect(mobileMapIsCovered("build", null)).toBe(false);
    expect(mobileMapIsCovered("clinic", "full")).toBe(true);
    expect(mobileMapIsCovered("clinic", "bottom", true)).toBe(true);
  });
  it("skips all frame drawing while the actual reducer keeps advancing the same state", () => {
    const { scene, bridge, policy } = harness();
    policy.setCovered(true);
    let state = createInitialGameState();
    let control = structuredClone(state);
    for (let frame = 0; frame < 60; frame++) {
      if (frame % 15 === 0) {
        const command = { type: "ADVANCE_TICK" as const, operationId: `mb7.tick.${frame}` };
        state = gameReducer(state, command); control = gameReducer(control, command);
        bridge.viewModel = createPrototypePlayerView(state, null, false, null).facility;
      }
      scene.update(frame * 16, 16);
    }
    expect(state.facilityTick).toBe(4); expect(state).toEqual(control);
    expect(scene.drawCharacters).not.toHaveBeenCalled(); expect(scene.reportAlertPinPositions).not.toHaveBeenCalled();
    expect(scene.drawEarningsPopups).not.toHaveBeenCalled(); expect(scene.refreshLayout).not.toHaveBeenCalled();
    expect(scene.cameras.main.setVisible).toHaveBeenCalledWith(false);
    expect(scene.characterRestClockMilliseconds).toBe(0);
  });
  it("resyncs a stale route to the current authoritative sample on the first reveal frame, dropping its huge delta", () => {
    const { scene, bridge, policy } = harness();
    const path = Array.from({ length: 12 }, (_, x) => ({ x, y: 3 }));
    scene.routeMotionTracks.set("actor", syncRouteMotion(undefined, { path, pathIndex: 0, location: path[0] }));
    scene.earningsPopupState = { campaignId: "old", observedTransactionKeys: [], activePopups: [] };
    const destroy = vi.fn(); scene.earningsPopupTexts.set("old", { destroy });
    policy.setCovered(true); scene.update(0, 16);
    bridge.viewModel = { ...bridge.viewModel, facilityTick: 250 };
    policy.setCovered(false);
    let visibleSample: unknown;
    scene.drawCharacters.mockImplementation(() => {
      visibleSample = scene.getCharacterRoutePresentation("actor", { path, pathIndex: 8, location: path[8], moving: true });
    });
    scene.update(30_000, 30_000);
    const reloadTrack = syncRouteMotion(undefined, { path, pathIndex: 8, location: path[8],
      lookaheadPathNodes: bridge.viewModel.characterTravelTilesPerFacilityMinute });
    expect(visibleSample).toMatchObject(sampleRouteMotion(reloadTrack!, path[8]));
    expect(scene.characterRestClockMilliseconds).toBe(0);
    expect(scene.refreshLayout).toHaveBeenCalledWith(true); expect(scene.reportAlertPinPositions).toHaveBeenCalledOnce();
    expect(destroy).toHaveBeenCalledOnce(); expect(scene.earningsPopupState).toBeUndefined();
    expect(scene.cameras.main.setVisible).toHaveBeenLastCalledWith(true);
    scene.update(30_016, 16); expect(scene.characterRestClockMilliseconds).toBe(16);
  });
  it("remembers a hidden page even when no frames arrived and resyncs exactly once", () => {
    const policy = new MobileMapPresentationPolicy();
    policy.setPageHidden(true); expect(policy.beginFrame()).toEqual({ draw: false, resync: false });
    policy.setCovered(true); policy.setPageHidden(false); expect(policy.beginFrame().draw).toBe(false);
    policy.setCovered(false); expect(policy.beginFrame()).toEqual({ draw: true, resync: true });
    expect(policy.beginFrame()).toEqual({ draw: true, resync: false });
  });
  it("ignores a supplied gate on desktop and retains all 60 frame calls", () => {
    const { scene, policy } = harness(false); policy.setCovered(true); policy.setPageHidden(true);
    for (let frame = 0; frame < 60; frame++) scene.update(frame * 16, 16);
    expect(scene.drawCharacters).toHaveBeenCalledTimes(60); expect(scene.reportAlertPinPositions).toHaveBeenCalledTimes(60);
    expect(scene.drawEarningsPopups).toHaveBeenCalledTimes(60); expect(scene.ensureMobileAtlases).not.toHaveBeenCalled();
    expect(scene.cameras.main.setVisible).not.toHaveBeenCalled();
  });
  it.each([[390, 600], [360, 500], [412, 720], [844, 260], [768, 820]])("retains CSS-pixel pointer-to-tile mapping at %sx%s on DPR 1/2/3 phones", (width, height) => {
    const { scene } = harness();
    scene.layout = { originX: -47, originY: -80, tileSize: 31 };
    scene.bridge.viewModel.gridColumns = 40; scene.bridge.viewModel.gridRows = 32;
    for (const devicePixelRatio of [1, 1.5, 2, 3, 4]) {
      const size = mobileCanvasSize(width + .8, height + .2, devicePixelRatio);
      expect(size.width).toBe(width); expect(size.height).toBe(height);
      expect(size.pixelRatio).toBe(Math.min(devicePixelRatio, 2));
      // ScaleManager/baseSize remain CSS-sized. The physical backing bitmap
      // is changed only after its resize; pointer displayScale stays logical.
      const css = { x: -47 + 7.5 * 31, y: -80 + 5.5 * 31 };
      const pointer = { x: css.x * size.width / width, y: css.y * size.height / height };
      expect(scene.gridPointAtPointer(pointer)).toEqual({ x: 7, y: 5 });
      expect(size.backingWidth).toBe(Math.round(width * Math.min(devicePixelRatio, 2)));
    }
  });
});
