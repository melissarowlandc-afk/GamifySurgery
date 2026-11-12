import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { GameState } from "@gamify-surgery/game-domain";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import { cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { createFreshProfile, loadPrototypeProfile, savePrototypeProfileResult, PROTOTYPE_PROFILE_KEY, type LocalPrototypeProfile } from "../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../session/usePrototypeSession";
import { PlaytimeTracker } from "./playtimeTracker";
import { UsageOutbox, USAGE_OUTBOX_KEY } from "./usageOutbox";
import { scoredEmployeeFixture, scoredPatientFixture } from "./usageTestFixtures";
import type { UsageReceipt, UsageTransport } from "./usageTypes";

const testContext = vi.hoisted(() => ({ tracker: null as PlaytimeTracker | null }));
vi.mock("./UsageProvider", () => ({ useUsageTracking: () => testContext.tracker }));
const accountId = "11111111-1111-4111-8111-111111111111";
afterEach(async () => { await cleanupPhoneTests(); testContext.tracker?.stop(); testContext.tracker = null; });

function profileFor(state: GameState): LocalPrototypeProfile {
  return { ...createFreshProfile(), tutorialsEnabled: false, activeCampaignId: state.campaignId,
    campaigns: [{ campaignId: state.campaignId, name: "Synthetic usage clinic", createdAtRealMs: Date.now(), updatedAtRealMs: Date.now(), status: "resumable", state }] };
}

async function sessionFixture(employee = false) {
  vi.useFakeTimers(); vi.setSystemTime(Date.UTC(2026, 9, 13, 12));
  const env = phoneTestDom(); const stored = new Map<string, string>();
  const writes: { key: string; value: string }[] = [];
  let failCampaign = false, failQueue = false, uuidSequence = 0;
  const storage = { getItem: (key: string) => stored.get(key) ?? null, removeItem: (key: string) => stored.delete(key),
    setItem: (key: string, value: string) => {
      if ((failCampaign && key.startsWith(PROTOTYPE_PROFILE_KEY)) || (failQueue && key.startsWith(USAGE_OUTBOX_KEY))) throw new Error("Blocked for crash recovery check");
      stored.set(key, value); writes.push({ key, value });
    } };
  Object.assign(env.browser.localStorage, storage); Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
  const received = new Map<string, UsageReceipt>();
  const transport: UsageTransport = { access: vi.fn(async () => ({ admitted: true, notice_accepted: true, deletion_requested: false })),
    acceptNotice: vi.fn(async () => undefined), requestDeletion: vi.fn(async () => undefined),
    ingest: vi.fn(async (receipts: readonly UsageReceipt[]) => {
      for (const receipt of receipts) {
        if (received.has(receipt.receipt_id)) expect(received.get(receipt.receipt_id)).toEqual(receipt);
        else received.set(receipt.receipt_id, receipt);
      }
      return receipts.map((r) => r.receipt_id);
    }) };
  const createTracker = () => new PlaytimeTracker(new UsageOutbox(accountId, storage, Date.now), transport,
    { monotonic: () => 0, wall: Date.now }, () => `00000000-0000-4000-8000-${String(++uuidSequence).padStart(12, "0")}`);
  testContext.tracker = createTracker(); await testContext.tracker.refreshAccess();
  const initial = profileFor(employee ? scoredEmployeeFixture() : scoredPatientFixture());
  expect(savePrototypeProfileResult(initial, accountId).ok).toBe(true);
  let current!: PrototypeSession;
  function Game({ loaded }: { loaded?: LocalPrototypeProfile }) {
    current = usePrototypeSession(loaded ? { profile: loaded, notice: "Synthetic restored clinic." } : undefined);
    return <p>{current.state.campaignId}</p>;
  }
  const render = (key = "original", loaded?: LocalPrototypeProfile) => env.render(
    <AuthAccountContext.Provider key={key} value={accountId}><Game loaded={loaded} /></AuthAccountContext.Provider>);
  await render("original", initial);
  const submit = async (correct = true) => {
    const subject = employee ? Object.values(current.state.employeeDiscussions!)[0]! : Object.values(current.state.encounters)[0]!;
    const node = subject.frozenCase.decisionNodes[subject.currentNodeIndex]!;
    const answer = node.answerChoices.find((c) => c.isCorrect === correct)!.id;
    await act(async () => { employee ? current.answerEmployeeDiscussion(answer) : current.submitAnswer(answer); });
  };
  return { env, stored, writes, transport, received, createTracker, render, submit, current: () => current,
    failCampaign: (fail: boolean) => { failCampaign = fail; }, failQueue: (fail: boolean) => { failQueue = fail; } };
}

describe("usage at the real shared scored save boundary", () => {
  for (const employee of [false, true]) for (const correct of [false, true]) {
    it(`atomically stages a ${correct ? "right" : "wrong"} ${employee ? "employee" : "patient"} answer and queues exactly one count`, async () => {
      const f = await sessionFixture(employee); const activity = vi.spyOn(testContext.tracker!, "activity");
      await f.submit(correct); await f.submit(correct); expect(activity).toHaveBeenCalledTimes(1);
      const questions = [...new Map([...f.received, ...testContext.tracker!.outbox.batch().map((r) => [r.receipt_id, r] as const)]).values()];
      expect(questions).toHaveLength(1); expect(questions[0]!.kind).toBe("question");
      expect(Object.keys(questions[0]!).sort()).toEqual(["kind", "occurred_at", "receipt_id"]);
      const atomic = f.writes.filter((w) => w.key.startsWith(PROTOTYPE_PROFILE_KEY))
        .map((w) => JSON.parse(w.value)).find((p) => p.pendingUsageQuestions?.length === 1);
      expect(atomic).toBeDefined();
      const savedGame = JSON.parse(atomic.campaigns[0].serializedState);
      const subject = employee ? Object.values(savedGame.employeeDiscussions)[0] : Object.values(savedGame.encounters)[0];
      expect((subject as { steps: { answer: unknown }[] }).steps[0]!.answer).not.toBeNull();
      expect(atomic.pendingUsageQuestions[0]).toEqual(questions[0]);
      await testContext.tracker!.flush(); expect(f.transport.ingest).toHaveBeenCalledTimes(1);
      await f.render("reloaded"); await testContext.tracker!.flush();
      // A staged receipt replay is legal; its immutable identity contributes zero twice.
      expect([...f.received.values()]).toEqual(questions);
    });
  }

  it("does not upload an uncommitted answer even when status callbacks fire; a later successful save commits it once", async () => {
    const f = await sessionFixture(); f.failCampaign(true); await f.submit();
    await act(async () => { await testContext.tracker!.refreshAccess(); });
    expect(testContext.tracker!.outbox.batch()).toEqual([]);
    f.failCampaign(false); await act(async () => { f.current().saveAndPause(); });
    expect(testContext.tracker!.outbox.batch()).toHaveLength(1);
  });

  it("recovers the same receipt after the game save succeeds but the separate queue write fails", async () => {
    const f = await sessionFixture(); f.failQueue(true); await f.submit();
    const persisted = loadPrototypeProfile(accountId).profile;
    const receipt = persisted.pendingUsageQuestions![0]!; expect(receipt).toBeDefined();
    expect(testContext.tracker!.outbox.status().storageAvailable).toBe(false);
    await f.env.render(null); testContext.tracker!.stop(); f.failQueue(false);
    testContext.tracker = f.createTracker(); await testContext.tracker.refreshAccess();
    await f.render("recovered");
    await testContext.tracker.flush(); expect([...f.received.values()]).toEqual([receipt]);
  });

  it("baselines an already scored restored campaign without adding retrospective counts", async () => {
    const f = await sessionFixture(); await f.submit(); await testContext.tracker!.flush();
    const restored = loadPrototypeProfile(accountId).profile;
    delete restored.pendingUsageQuestions;
    await f.env.render(null); testContext.tracker!.stop();
    testContext.tracker = f.createTracker(); await testContext.tracker.refreshAccess();
    await f.render("historical", restored); await testContext.tracker.flush();
    expect(testContext.tracker.outbox.batch()).toEqual([]); expect(f.transport.ingest).toHaveBeenCalledTimes(1);
  });
});
