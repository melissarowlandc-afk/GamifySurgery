import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  gameReducer,
  deserializeGameState,
  PROTOTYPE_DOMAIN_CONTEXT,
  serializeGameState,
  type GameState,
} from "@gamify-surgery/game-domain";
import { createPediatricAppointmentsQaState } from "../../../../tests/fixtures/pediatric-appointments";
import { createLevelFourRoomsQaContext } from "../../../../tests/fixtures/level-four-rooms";
import { createPrototypePlayerView } from "../session/viewModels";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";

const context = createLevelFourRoomsQaContext();
const originalBalance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; });
afterAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = originalBalance; });

describe("M5 pediatric route rendering", () => {
  it("samples the real QA fixture through arrivals, care, departure and reload at 4x", () => {
    let state: GameState = { ...createPediatricAppointmentsQaState(context), paused: false, simulationSpeed: 4 };
    const bridge: FacilitySceneBridge = {
      viewModel: createPrototypePlayerView(state, null, false, null).facility,
      onPlaceRoom: () => false,
    };
    // Only Phaser construction is stubbed. Exercise the scene's actual route
    // interpolation, compaction and hop sampling for every projected actor.
    let scene = new FacilityScene(bridge) as any;
    const motionCalls = [vi.spyOn(scene, "getCharacterRouteMotionPresentation")];
    let reloaded = false;
    let paddedFamilyRouteSeen = false;
    let samples = 0;
    for (let tick = 0; tick < 180; tick++) {
      state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `peds.render.tick.${tick}` }, context);
      if (!reloaded && state.serviceOperations.some(row => row.clinicVisit?.kind === "pediatric_consult" && row.status === "in_service")) {
        state = deserializeGameState(serializeGameState(state), context);
        scene = new FacilityScene(bridge) as any;
        motionCalls.push(vi.spyOn(scene, "getCharacterRouteMotionPresentation"));
        reloaded = true;
      }
      bridge.viewModel = createPrototypePlayerView(state, null, false, null).facility;
      const actors = [
        ["founder", bridge.viewModel.founder],
        ...bridge.viewModel.staff.map(actor => [`staff:${actor.instanceId}`, actor] as const),
        ...(bridge.viewModel.serviceVisitors ?? []).map(actor => [`visit:${actor.actorId}`, actor] as const),
        ...(bridge.viewModel.retailExternalActors ?? []).map(actor => [`parent:${actor.instanceId}`, actor] as const),
      ] as const;
      for (let frame = 0; frame < 16; frame++) {
        scene.frameDeltaMilliseconds = bridge.viewModel.realMillisecondsPerFacilityMinuteAt1x / 4 / 16;
        for (const [key, actor] of actors) {
          if (key.startsWith("parent:") && actor.path?.some((point, index) =>
            index > 0 && point.x === actor.path![index - 1]!.x && point.y === actor.path![index - 1]!.y)) paddedFamilyRouteSeen = true;
          const presentation = scene.getCharacterRoutePresentation(key, actor);
          if (presentation.location) {
            expect(Number.isFinite(presentation.location.x), `${key}, tick ${tick}, frame ${frame}`).toBe(true);
            expect(Number.isFinite(presentation.location.y), `${key}, tick ${tick}, frame ${frame}`).toBe(true);
          }
          samples++;
        }
      }
    }
    expect(paddedFamilyRouteSeen).toBe(true);
    expect(reloaded).toBe(true);
    expect(samples).toBeGreaterThan(8_000);
    for (const calls of motionCalls) expect(calls.mock.results.filter(result => result.type === "throw")).toEqual([]);
    expect(state.serviceIncomeReceipts.some(row => row.incomeLineId === "income.pediatric_consult")).toBe(true);
  });

  it("isolates an unexpected actor failure and continues sampling the next actor", () => {
    const state = createPediatricAppointmentsQaState(context);
    const bridge: FacilitySceneBridge = {
      viewModel: { ...createPrototypePlayerView(state, null, false, null).facility, paused: false },
      onPlaceRoom: () => false,
    };
    const scene = new FacilityScene(bridge) as any;
    const input = { location: { x: 6, y: 5 }, moving: true, path: [{ x: 6, y: 5 }, { x: 7, y: 5 }], pathIndex: 0 };
    const stale = { lift: 1 };
    scene.routeMotionTracks.set("broken-parent", { path: [] });
    scene.characterHopStates.set("broken-parent", stale);
    vi.spyOn(scene, "getCharacterRouteMotionPresentation").mockImplementationOnce(() => { throw new TypeError("bad actor route"); });
    expect(scene.getCharacterRoutePresentation("broken-parent", input)).toMatchObject({ location: input.location, moving: false });
    expect(scene.routeMotionTracks.has("broken-parent")).toBe(false);
    expect(scene.characterHopStates.has("broken-parent")).toBe(false);
    scene.frameDeltaMilliseconds = 16;
    expect(scene.getCharacterRoutePresentation("next-child", input).location.x).toBeGreaterThanOrEqual(6);
    expect(scene.routeMotionTracks.has("next-child")).toBe(true);
  });
});
