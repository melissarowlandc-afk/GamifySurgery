import { act } from "react";
import { setImmediate as nativeTurn } from "node:timers/promises";
import { vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, type GridPoint } from "@gamify-surgery/game-domain";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import { phoneTestDom, cleanupPhoneTests } from "../mobile/screenTestUtils";
import { createFreshProfile } from "../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../session/usePrototypeSession";
import { operationalSessionFixture } from "../session/cloud/operationalSessionTestSupport";
import { CadencePort, cadenceState, observeCodecWork } from "../session/cloud/tickAdmissionCadenceTestSupport";
import { createPrototypePlayerView } from "../session/viewModels";
import { FacilityCanvas } from "./FacilityCanvas";
import { motionGames } from "./visibleMotionPhaser.fixture";
import { getRouteTilesPerSecond, type RouteMotionTrack } from "./routeMotion";

export const MOTION_KEY = "character:staff:public-motion-clock";
export const BALANCE = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
export const TICK_MS = BALANCE.clock.realMillisecondsPerFacilityMinuteAt1x;
export const TILES = BALANCE.facility.characterTravelTilesPerTick;
export const EPSILON = Number.EPSILON * 1_000_000; // Existing cadence test arithmetic allowance.
export const ACTIVE_SECONDS = 60;
// Adjacent cardinal segments, sufficiently long at the supported 2x speed.
export const LONG_WALK = Array.from({ length: TILES * ACTIVE_SECONDS * 2 * 3 + 1 },
  (_, index) => ({ x: index + 2, y: 4 }));

/** Real clock -> hook/SessionActions -> operational client/processor -> journal.
 * A public presentation route is advanced by the admitted facilityTick, as in
 * tickAdmissionCadenceTestSupport; no projection is issued for a refused tick.
 * All storage/codec work is real in-memory work. No per-pulse durability call. */
export async function motionFixture(options: { mobile?: boolean; local?: boolean; speed?: 1 | 2; timerSlowdown?: number } = {}) {
  const realNow = performance.now.bind(performance), codecBusy = observeCodecWork(), ports: CadencePort[] = [];
  const seed = cadenceState(); seed.encounters = {}; seed.openChartEncounterId = seed.attendedEncounterId = null;
  seed.simulationSpeed = options.speed ?? 1;
  seed.nextFinancialPostingTick = seed.nextEmployeeDiscussionTick = seed.nextExternalRetailOpportunityTick = Number.MAX_SAFE_INTEGER;
  const f = await operationalSessionFixture({ createPort: () => { const port = new CadencePort(); ports.push(port); return port; } }, seed);
  await f.session.durable(); // Setup only.
  const busy = () => codecBusy() || ports.some(port => port.outstanding.size > 0) || f.session.commandPending;
  const idle = async () => {
    const deadline = realNow() + 10_000;
    let quiet = 0;
    while (quiet < 3) {
      await nativeTurn(); quiet = busy() ? 0 : quiet + 1;
      if (realNow() > deadline) throw Error("Motion harness: already-started native I/O did not settle.");
    }
  };
  await idle();
  const env = phoneTestDom(), raf = new Map<number, FrameRequestCallback>(); let sequence = 0;
  const createElement = env.doc.createElement.bind(env.doc);
  vi.spyOn(env.doc, "createElement").mockImplementation((...args: Parameters<typeof createElement>) => {
    const element = createElement(...args);
    Object.assign(element, { clientWidth: options.mobile ? 390 : 1_100, clientHeight: options.mobile ? 844 : 560 });
    return element;
  });
  vi.useFakeTimers({ toFake: ["Date", "performance", "setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
  vi.setSystemTime(f.clock.wall);
  const wallAtZero = f.clock.wall;
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.defineProperty(env.doc, "hidden", { configurable: true, get: () => (env.doc as unknown as Document).visibilityState === "hidden" });
  Object.assign(env.browser, { performance: globalThis.performance,
    setInterval: (work: () => void, ms: number) => setInterval(work, ms * (options.timerSlowdown ?? 1)), clearInterval,
    setTimeout, clearTimeout,
    requestAnimationFrame: (work: FrameRequestCallback) => { raf.set(++sequence, work); return sequence; },
    cancelAnimationFrame: (id: number) => raf.delete(id), devicePixelRatio: 1 });
  // EventTarget is the minimal DOM host; browsers invoke these native handler
  // properties automatically. The installed VisibilityHandler owns their code.
  for (const type of ["blur", "focus"]) env.browser.addEventListener(type, () => (env.browser as any)[`on${type}`]?.());
  vi.stubGlobal("ResizeObserver", class { observe() {} disconnect() {} });
  const profile = { ...createFreshProfile(), activeCampaignId: seed.campaignId, tutorialsEnabled: false,
    tutorialGuidanceByCampaign: { [seed.campaignId]: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] } },
    campaigns: [{ ...f.session.metadata, state: f.session.state }] };
  const presentation = { path: LONG_WALK, index: undefined as number | undefined, moving: true, covered: false,
    campaignId: seed.campaignId, rooms: undefined as any, doors: undefined as any, actor: {} as Record<string, unknown> };
  let current!: PrototypeSession;
  function Game() {
    current = usePrototypeSession({ profile, notice: "Public motion-clock fixture" }, options.local ? undefined : f.session);
    const state = current.state;
    const projected = createPrototypePlayerView(state, null, false, null).facility;
    const index = Math.min(presentation.path.length - 1, presentation.index ?? state.facilityTick * TILES);
    const model = { ...projected, campaignId: presentation.campaignId, buildMode: current.buildMode,
      founder: { ...projected.founder, location: undefined, path: [], moving: false },
      staff: [{ instanceId: "public-motion-clock", displayName: "Public walker", roleDisplayName: "Staff", homeRoomInstanceId: null,
        appearance: projected.founder.appearance, location: presentation.path[index], path: presentation.path,
        pathIndex: index, moving: presentation.moving && index < presentation.path.length - 1, direction: "side" as const, ...presentation.actor }],
      patients: [], serviceVisitors: [], retailExternalActors: [], ambientPedestrians: [], inspectors: [],
      ...(presentation.rooms ? { rooms: presentation.rooms } : {}), ...(presentation.doors ? { doors: presentation.doors } : {}) };
    return <FacilityCanvas viewModel={model} mobileInput={options.mobile} mobileMapCovered={presentation.covered} onPlaceRoom={() => true} />;
  }
  const render = () => env.render(<AuthAccountContext.Provider value={f.scope.accountId}><Game /></AuthAccountContext.Provider>);
  await render();
  const game = motionGames.at(-1)!, scene = game.config.scene as any;
  const advance = async (ms: number, draw = true, settleNativeWork = true) => {
    // Native hashing/storage is not accelerated by fake timers. Let already-
    // started work finish at each facility deadline even between rare draws.
    let remaining = ms;
    while (remaining > EPSILON) {
      const slice = Math.min(remaining, TICK_MS / current.state.simulationSpeed);
      await act(async () => {
        // Persisted real timestamps are integer Date.now milliseconds, even
        // when high-resolution rAF/monotonic timestamps have fractional ms.
        f.clock.wall = wallAtZero + Math.floor(performance.now() + slice);
        f.clock.mono = performance.now() + slice;
        await vi.advanceTimersByTimeAsync(slice); if (settleNativeWork && busy()) await idle();
      });
      remaining -= slice;
    }
    if (draw) {
      const callbacks = [...raf.values()]; raf.clear();
      await act(async () => { for (const callback of callbacks) callback(performance.now()); await Promise.resolve(); });
    }
  };
  const frames = async (count: number, fps = 60) => {
    const start = performance.now();
    for (let i = 0; i < count; i++) await advance(start + (i + 1) * 1_000 / fps - performance.now());
  };
  const event = async (type: string, hidden?: boolean) => {
    if (hidden !== undefined) Object.assign(env.doc, { visibilityState: hidden ? "hidden" : "visible" });
    await act(async () => { (type === "pagehide" || type === "blur" || type === "focus" ? env.browser : env.doc).dispatchEvent(new Event(type)); await idle(); });
  };
  return { ...f, env, game, scene, presentation, ports, idle, render, advance, frames, event,
    current: () => current,
    action: async (work: (session: PrototypeSession) => unknown) => { await act(async () => { await work(current); await idle(); }); },
    track: () => scene.routeMotionTracks.get(MOTION_KEY) as RouteMotionTrack | undefined,
    progress: () => { const track = scene.routeMotionTracks.get(MOTION_KEY) as RouteMotionTrack | undefined; return track ? track.progress - track.sourceOffset : 0; },
    drawn: () => game.draws.get(MOTION_KEY),
    serialized: () => serializeGameState(current.state),
    get speed() { return getRouteTilesPerSecond(TILES, TICK_MS, current.state.simulationSpeed); },
    async dispose() { await cleanupPhoneTests(); f.session.dispose(); f.coordinator.dispose(); motionGames.length = 0; vi.restoreAllMocks(); },
  };
}

export type MotionFixture = Awaited<ReturnType<typeof motionFixture>>;
export const pointOnSegments = (point: GridPoint, path: readonly GridPoint[]) => path.some((a, index) => {
  const b = path[Math.min(index + 1, path.length - 1)]!;
  return Math.abs((point.x - a.x) * (b.y - a.y) - (point.y - a.y) * (b.x - a.x)) < EPSILON &&
    point.x >= Math.min(a.x, b.x) - EPSILON && point.x <= Math.max(a.x, b.x) + EPSILON &&
    point.y >= Math.min(a.y, b.y) - EPSILON && point.y <= Math.max(a.y, b.y) + EPSILON;
});
