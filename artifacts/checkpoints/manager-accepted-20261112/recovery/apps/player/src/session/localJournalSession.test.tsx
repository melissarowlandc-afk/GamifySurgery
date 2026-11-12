import { act } from "react";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { appendLocalCampaign, createFreshProfile, selectLocalCampaign, PROTOTYPE_PROFILE_KEY } from "./prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "./usePrototypeSession";
import { IndexedDbJournalStorage } from "./localJournal";
import { recoverLocalProfile } from "./localProfileJournal";
import { cloudCodec, CloudCodecWorker } from "./cloud/codecWorker";
import { FakeCloudCodecWorker } from "./cloud/codecWorkerTestSupport";

afterEach(async () => { await cleanupPhoneTests(); vi.restoreAllMocks(); vi.unstubAllGlobals(); });
describe("real local session with incremental IDB durability", () => {
  it("switches two local campaigns, saves/pauses durably and restores both without full-profile action writes", async () => {
    const env = phoneTestDom(), factory = new IDBFactory(); vi.stubGlobal("indexedDB", factory); vi.stubGlobal("IDBKeyRange", IDBKeyRange);
    Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
    Object.assign(env.doc, { visibilityState: "visible" });
    const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker); worker.release();
    vi.spyOn(cloudCodec, "run").mockImplementation(task => codec.run(task));
    const first = appendLocalCampaign(createFreshProfile(), createInitialGameState().founder, "First clinic", 0, "first", false);
    const second = appendLocalCampaign(first.profile, createInitialGameState().founder, "Second clinic", 1, "second", false);
    const profile = selectLocalCampaign(second.profile, first.campaign.campaignId);
    profile.campaigns.forEach(row => { row.state.paused = true; });
    let session!: PrototypeSession;
    const writes = vi.spyOn(env.browser.localStorage, "setItem");
    function Game() { session = usePrototypeSession({ profile, notice: "Legacy source." }); return <p>{session.state.campaignId}</p>; }
    await act(async () => { env.root.render(<Game />); });
    const setSpeed = async (speed: 1 | 2 | 4) => {
      await vi.waitFor(async () => { await act(async () => { session.setSimulationSpeed(speed); }); expect(session.state.simulationSpeed).toBe(speed); });
    };
    try {
      await setSpeed(2);
      await act(async () => { session.switchCampaign(second.campaign.campaignId); }); await setSpeed(4);
      await act(async () => { session.switchCampaign(first.campaign.campaignId); });
      const requestSession = session; await setSpeed(1);
      let result;
      await act(async () => { result = await session.saveAndPauseDurably(); }); expect(result).toMatchObject({ ok: true });
      expect(session.state.paused).toBe(true);
      // An async App callback holds its original render. Read the committed
      // profile through the ref-backed handoff, rather than that stale render.
      expect(requestSession.profile).not.toBe(session.profile);
      expect(requestSession.saveForFirstShiftReplay()!.campaigns.find(row => row.campaignId === first.campaign.campaignId)!.state).toEqual(session.state);
      const restored = await recoverLocalProfile(profile, null, new IndexedDbJournalStorage());
      expect(restored.campaigns.find(row => row.campaignId === first.campaign.campaignId)!.state).toEqual(session.state);
      expect(restored.campaigns.find(row => row.campaignId === second.campaign.campaignId)!.state.simulationSpeed).toBe(4);
      expect(writes.mock.calls.filter(([key]) => key === PROTOTYPE_PROFILE_KEY)).toHaveLength(0);
      expect(worker.messages.filter(m => m.task.kind === "journalBind").every(m => m.task.kind === "journalBind" && !m.task.input.seed.profile?.hasOwnProperty("serializedState"))).toBe(true);
    } finally { await act(async () => { env.root.unmount(); }); codec.dispose(); }
  });
});
