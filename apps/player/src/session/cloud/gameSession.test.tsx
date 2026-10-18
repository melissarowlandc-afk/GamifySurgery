import { act, StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, type GameState } from "@gamify-surgery/game-domain";
import { AuthAccountContext } from "../../auth/AuthAccountContext";
import { cleanupPhoneTests, phoneTestDom } from "../../mobile/screenTestUtils";
import { scoredPatientFixture } from "../../playtime/usageTestFixtures";
import { createFreshProfile } from "../prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../usePrototypeSession";
import { MemoryCloudCache } from "./cache";
import { codecTestCampaign } from "./codecTestSupport";
import { prepareCloudEvidenceImport, loadCloudEvidenceCheckpoint } from "./codecEvidence";
import { CloudSyncCoordinator } from "./coordinator";
import { FakeCloudServer } from "./fakeTransport";
import { CloudGameSession } from "./gameSession";
import { syncFixture, TestCloudClock } from "./syncTestSupport";
import { decompressCloudText } from "./codecCompression";

afterEach(cleanupPhoneTests);
async function pendingText(session: CloudGameSession): Promise<string> {
  return (await Promise.all((session.coordinator.pendingCandidate?.evidence.records ?? []).map(row => decompressCloudText(row.content)))).join("\n");
}
async function fixture(state?: GameState) {
  const initial = await syncFixture(), source = state ? serializeGameState(state) : initial.prepared.sourceRecovery.text;
  const metadata = codecTestCampaign(source); metadata.tutorial.guidance = { version: 2, mode: "off", exposedTopicIds: [] };
  const prepared = await prepareCloudEvidenceImport({ serializedState: source, campaign: metadata, operationId: "import.runtime" });
  const confirmed = { ...initial.confirmed, campaignId: metadata.campaignId, baselineId: prepared.envelope.baselineId, snapshot: prepared.snapshot, evidence: prepared.packedEvidence };
  const clock = new TestCloudClock(), server = new FakeCloudServer(() => clock.wall), cache = new MemoryCloudCache();
  server.seed("account-a", confirmed);
  const coordinator = new CloudSyncCoordinator({ scope: { backendId: "synthetic", accountId: "account-a", campaignId: confirmed.campaignId },
    transport: server.transport("account-a"), cache, clock, enabled: true });
  expect(await coordinator.open()).toBe(true);
  const session = await CloudGameSession.create(coordinator);
  return { session, coordinator, server, cache, clock, prepared, confirmed };
}
describe("cloud commands through the shared domain evidence boundary", () => {
  it("requires a fresh session projection when focus loads a different account revision", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    expect(await f.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const otherCoordinator = new CloudSyncCoordinator({ scope: f.coordinator.scope, transport: f.server.transport("account-a"), cache: new MemoryCloudCache(), clock: f.clock, enabled: true });
    await otherCoordinator.open(); const other = await CloudGameSession.create(otherCoordinator);
    await otherCoordinator.startWriter(); otherCoordinator.resume();
    other.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "other.speed" }, PROTOTYPE_DOMAIN_CONTEXT);
    await other.durable(); await other.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.coordinator.focus()).toBe(true);
    expect(f.session.needsReload).toBe(true); expect(f.session.canExecute).toBe(false);
    expect(f.coordinator.view.failure).toBe("account-save-changed");
    const fresh = await CloudGameSession.create(f.coordinator);
    expect(fresh.state.simulationSpeed).toBe(4);
  });
  it("keeps player Build Undo and its history label while saving a new revision with reverted receipts", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    const env = phoneTestDom(), writes = vi.fn(); Object.assign(env.browser.localStorage, { setItem: writes });
    Object.assign(env.doc, { visibilityState: "visible" });
    Object.assign(env.browser, { setInterval: () => 1, clearInterval: vi.fn() });
    const state = f.session.state;
    const profile = { ...createFreshProfile(), activeCampaignId: state.campaignId, tutorialsEnabled: false,
      tutorialGuidanceByCampaign: { [state.campaignId]: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] } },
      campaigns: [{ campaignId: state.campaignId, name: "Undo clinic", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable" as const, state }] };
    let current!: PrototypeSession;
    function Game() { current = usePrototypeSession({ profile, notice: "Verified." }, f.session); return <p>{current.buildUndoLabel}</p>; }
    await env.render(<AuthAccountContext.Provider value="account-a"><Game /></AuthAccountContext.Provider>);
    await act(async () => { current.enterBuildMode(); await f.session.durable(); });
    const before = serializeGameState(current.state);
    await act(async () => { current.beginPlacement("room.hallway"); });
    await act(async () => { expect(current.placeRoom(34, 27)).toBe(true); await f.session.durable(); await f.coordinator.checkpoint(); });
    expect(current.buildUndoCount).toBe(1); expect(current.buildUndoLabel).toBeTruthy();
    const revision = f.coordinator.confirmed!.revision;
    await act(async () => { current.undoBuildAction(); await f.session.durable(); await f.coordinator.checkpoint(); });
    expect(current.buildUndoCount).toBe(0); expect(current.buildUndoLabel).toBeNull();
    expect(serializeGameState(current.state)).toBe(before);
    expect(BigInt(f.coordinator.confirmed!.revision)).toBeGreaterThan(BigInt(revision));
    const saved = f.coordinator.confirmed!, loaded = await loadCloudEvidenceCheckpoint({ ...saved, expectedRevision: saved.revision,
      expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId });
    expect(JSON.parse(serializeGameState(loaded.state))).toEqual(JSON.parse(before));
    expect(loaded.checkpoint.evidence.records.some(row => row.kind === "build-reversion")).toBe(true);
    await act(async () => { expect(current.mobileBuildActions.commitHallway([{ x: 34, y: 27 }, { x: 35, y: 27 }])).toBe(true); await f.session.durable(); });
    expect(current.buildUndoCount).toBe(1);
    expect(current.systemNotices.some(notice => notice.targetType === "save")).toBe(false);
    await act(async () => { current.undoBuildAction(); await f.session.durable(); await f.coordinator.checkpoint(); });
    expect(serializeGameState(current.state)).toBe(before);
    expect(writes).not.toHaveBeenCalled();
  });
  it("blocks actual commands/ticks in read-only, sync pause and revoked states", async () => {
    const f = await fixture(), before = serializeGameState(f.session.state);
    expect(f.session.execute({ type: "ADVANCE_TICK", operationId: "blocked.tick", advancedAtRealMs: f.clock.wall }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(serializeGameState(f.session.state)).toBe(before);
    expect(await f.coordinator.startWriter()).toBe(true); expect(f.coordinator.resume()).toBe(true);
    f.session.execute({ type: "SET_PAUSED", paused: false, operationId: "resume" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(true);
    const tick = f.session.state.facilityTick;
    f.server.setAccess("account-a", { admitted: false }); f.clock.advance(15_000); await f.coordinator.pulse();
    expect(f.session.state.paused).toBe(true);
    expect(f.session.execute({ type: "ADVANCE_TICK", operationId: "revoked.tick", advancedAtRealMs: f.clock.wall }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(f.session.state.facilityTick).toBe(tick); expect(await pendingText(f.session)).toContain('"operationId":"resume"');
  });
  it("coalesces synchronous command sequences and captures each command exactly once", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    f.session.execute({ type: "SET_PAUSED", paused: false, operationId: "resume" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(f.session.syncView).toMatchObject({ pending: true, localDurable: false });
    f.session.execute({ type: "ADVANCE_TICK", operationId: "tick", advancedAtRealMs: f.clock.wall }, PROTOTYPE_DOMAIN_CONTEXT);
    f.session.execute({ type: "SET_PAUSED", paused: true, operationId: "pause" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(true);
    expect(f.coordinator.pendingCandidate?.evidence.toRecord).toBeGreaterThan(f.confirmed.evidence.records.length);
    expect(await f.coordinator.checkpoint()).toBe(true);
    const saved = f.coordinator.confirmed!;
    const loaded = await loadCloudEvidenceCheckpoint({ ...saved, expectedRevision: saved.revision,
      expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId });
    expect(loaded.state.facilityTick).toBe(1); expect(loaded.state.paused).toBe(true);
    const transitions = loaded.checkpoint.evidence.records.filter(row => row.kind === "transition");
    expect(transitions).toHaveLength(3);
    f.session.execute({ type: "ADVANCE_TICK", operationId: "tick", advancedAtRealMs: f.clock.wall }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(f.session.state.facilityTick).toBe(1); expect(f.coordinator.view.pending).toBe(false);
  });
  it("stages a real scored answer and its opaque count together, with no historical or replay count", async () => {
    const f = await fixture(scoredPatientFixture()); await f.coordinator.startWriter(); f.coordinator.resume();
    const state = f.session.state, encounter = Object.values(state.encounters)[0]!, node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
    let minted = 0;
    const receiptFactory = () => { minted++; return { receipt_id: "00000000-0000-4000-8000-000000000001", kind: "question" as const, occurred_at: new Date(f.clock.wall).toISOString() }; };
    const command = { type: "SUBMIT_ANSWER" as const, encounterId: encounter.id, decisionNodeId: node.id,
      answerChoiceId: node.answerChoices[0]!.id, reviewedAtMs: f.clock.wall, operationId: "answer.1" };
    f.session.execute(command, PROTOTYPE_DOMAIN_CONTEXT, receiptFactory);
    expect(await f.session.durable()).toBe(true); expect(minted).toBe(1);
    expect(f.coordinator.pendingCandidate?.usageQuestions).toHaveLength(1); expect(f.server.usageCount("account-a")).toBe(0);
    expect(await f.coordinator.checkpoint()).toBe(true); expect(f.server.usageCount("account-a")).toBe(1);
    f.session.execute(command, PROTOTYPE_DOMAIN_CONTEXT, receiptFactory);
    expect(minted).toBe(1); expect(f.coordinator.view.pending).toBe(false);
  });
  it("pauses after a failed local write, preserves the new command and never calls a cloud save", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume(); f.cache.fault = "before-commit";
    f.session.execute({ type: "SET_PAUSED", paused: false, operationId: "unsent.resume" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(false); expect(f.session.canExecute).toBe(false); expect(f.session.state.paused).toBe(true);
    expect(await pendingText(f.session)).toContain('"operationId":"unsent.resume"'); expect(f.server.operationCount("account-a")).toBe(0);
  });
  it("Save & Close first finishes local persistence, then saves a paused snapshot and releases", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    f.session.execute({ type: "SET_PAUSED", paused: false, operationId: "resume" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const saved = f.coordinator.confirmed!, loaded = await loadCloudEvidenceCheckpoint({ ...saved, expectedRevision: saved.revision,
      expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId });
    expect(loaded.state.paused).toBe(true); expect(f.server.calls.at(-1)?.method).toBe("release");
  });
  it("guards commands through usePrototypeSession, including direct replacement paths, without touching local keys", async () => {
    const f = await fixture(); await f.coordinator.startWriter();
    const env = phoneTestDom(), writes = vi.fn(); Object.assign(env.browser.localStorage, { setItem: writes });
    Object.assign(env.doc, { visibilityState: "visible" });
    const intervals: (() => void)[] = [];
    Object.assign(env.browser, { setInterval: (fn: () => void) => { intervals.push(fn); return intervals.length; }, clearInterval: vi.fn() });
    const state = f.session.state, profile = { ...createFreshProfile(), activeCampaignId: state.campaignId, tutorialsEnabled: false,
      tutorialGuidanceByCampaign: { [state.campaignId]: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] } },
      campaigns: [{ campaignId: state.campaignId, name: "Synthetic account clinic", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable" as const, state }] };
    let current!: PrototypeSession;
    function Game() { current = usePrototypeSession({ profile, notice: "Verified account save." }, f.session); return <p>{current.state.facilityTick}</p>; }
    await env.render(<StrictMode><AuthAccountContext.Provider value="account-a"><Game /></AuthAccountContext.Provider></StrictMode>);
    expect(current.cloudSyncView?.canExecute).toBe(false); expect(writes).not.toHaveBeenCalled();
    await act(async () => { current.togglePause(); await f.session.durable(); });
    expect(current.state.paused).toBe(false);
    await act(async () => { f.server.setAccess("account-a", { admitted: false }); f.clock.advance(15_000); await f.coordinator.pulse(); });
    const before = serializeGameState(current.state);
    await act(async () => { current.addMoney(); current.hireStaff("staff.janitor"); current.undoBuildAction(); for (const fn of intervals) fn(); });
    expect(serializeGameState(current.state)).toBe(before); expect(current.state.paused).toBe(true);
    await act(async () => { expect(current.clearLocalCampaigns()).toBe(false); expect(current.saveAndPause().ok).toBe(false); });
    expect(writes).not.toHaveBeenCalled();
  });
});
