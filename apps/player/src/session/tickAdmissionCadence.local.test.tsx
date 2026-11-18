import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { appendLocalCampaign, createFreshProfile } from "./prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";
import { SessionActions } from "./sessionActions";
import { cloudCodec, CloudCodecWorker } from "./cloud/codecWorker";
import { MessageChannelCloudCodecWorker } from "./cloud/codecWorkerMessageTestSupport";
import { NUMERIC_EPSILON, PULSES, TICK_MS, cadenceState, nativeWorkIdle, replayWalking, scheduler } from "./cloud/tickAdmissionCadenceTestSupport";

afterEach(async () => { await cleanupPhoneTests(); vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it('B-012 "two steps and then stop": local-only 1x clock admits twenty ticks without forcing a disk save', async () => {
  // Same symptom contract as account play; this control must not acquire the
  // account queued-work defect or require any particular journaling policy.
  const env = phoneTestDom();
  vi.stubGlobal("indexedDB", new IDBFactory()); vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  Object.assign(env.browser, scheduler);
  Object.assign(env.doc, { visibilityState: "visible" });
  const worker = new MessageChannelCloudCodecWorker(), codec = new CloudCodecWorker(() => worker);
  const clockActions = vi.spyOn(SessionActions.prototype, "tick"); // Observe; the original action still runs.
  vi.spyOn(cloudCodec, "run").mockImplementation(task => codec.run(task));
  const { profile, campaign } = appendLocalCampaign(createFreshProfile(), cadenceState().founder, "Public cadence clinic", 0, "public-cadence-local", false);
  campaign.state = { ...cadenceState(), campaignId: campaign.campaignId, campaignSeed: campaign.state.campaignSeed };
  let session!: PrototypeSession;
  function Clinic() { session = usePrototypeSession({ profile, notice: "Public synthetic cadence fixture." }); return <p>{session.state.facilityTick}</p>; }
  vi.useFakeTimers({ toFake: ["Date", "setTimeout", "clearTimeout", "setInterval", "clearInterval"] });
  vi.setSystemTime(1_800_000_000_000);
  try {
    await env.render(<Clinic />);
    await nativeWorkIdle(() => codec.health.inFlight.length > 0 || session.localPreparation === "checking");
    await act(async () => {});
    expect(session.localPreparation).toBe("ready");
    expect(session.state).toMatchObject({ paused: false, simulationSpeed: 1 });
    const initial = session.state.facilityTick, initialPulses = clockActions.mock.calls.length, ticks = [0];
    for (let second = 1; second <= PULSES; second++) {
      await act(async () => { await vi.advanceTimersByTimeAsync(TICK_MS); await nativeWorkIdle(() => codec.health.inFlight.length > 0); });
      expect(session.localPreparation).toBe("ready");
      expect(session.state).toMatchObject({ paused: false, simulationSpeed: 1 });
      ticks.push(session.state.facilityTick - initial);
    }
    const increments = ticks.slice(1).map((tick, index) => tick - ticks[index]!);
    const pulses = clockActions.mock.calls.length - initialPulses;
    const motion = replayWalking(ticks);
    console.info("B012_LOCAL", JSON.stringify({ pulses, admittedTicks: ticks.at(-1), increments, motion }));
    expect.soft(pulses).toBe(PULSES);
    expect.soft(ticks.at(-1)).toBe(PULSES);
    expect.soft(increments).toEqual(Array(PULSES).fill(1));
    expect.soft(motion.maxUnplannedPauseMs).toBeLessThanOrEqual(motion.frameMs + NUMERIC_EPSILON);
  } finally { await env.render(null); await nativeWorkIdle(() => codec.health.inFlight.length > 0); codec.dispose(); }
}, 120_000);
