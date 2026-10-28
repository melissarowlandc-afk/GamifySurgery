import { act, StrictMode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { importGameEvidence, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState, type GameState } from "@gamify-surgery/game-domain";
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
import { deferred, syncFixture, TestCloudClock } from "./syncTestSupport";
import { decompressCloudText } from "./codecCompression";
import { CloudCodecWorker } from "./codecWorker";
import { FakeCloudCodecWorker } from "./codecWorkerTestSupport";
import { logicalJsonText } from "./codecJson";

afterEach(async () => { vi.restoreAllMocks(); await cleanupPhoneTests(); });
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
  it("does not queue an unchanged canonical metadata projection after reopening", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    const metadata = f.session.metadata;
    // The wire codec sorts keys; profile projections build those same fields
    // in a different order, including nested tutorial objects.
    const projected = { campaignId: metadata.campaignId, name: metadata.name, status: metadata.status,
      createdAtRealMs: metadata.createdAtRealMs, updatedAtRealMs: metadata.updatedAtRealMs + 1000,
      tutorial: { guidance: metadata.tutorial.guidance ? { version: metadata.tutorial.guidance.version,
        mode: metadata.tutorial.guidance.mode, exposedTopicIds: metadata.tutorial.guidance.exposedTopicIds } : null,
        introDismissed: metadata.tutorial.introDismissed, dailyRoutineTipAcknowledgments: metadata.tutorial.dailyRoutineTipAcknowledgments,
        dailyRoutinePause: metadata.tutorial.dailyRoutinePause } };
    expect(logicalJsonText(JSON.parse(JSON.stringify({ ...projected, updatedAtRealMs: 0 })))).toBe(logicalJsonText(JSON.parse(JSON.stringify({ ...metadata, updatedAtRealMs: 0 }))));
    f.session.updateMetadata(projected);
    expect(f.session.syncView.pending).toBe(false);
    await f.session.durable(); f.clock.advance(15_000); await f.coordinator.pulse();
    expect(f.server.operationCount("account-a")).toBe(0);
    f.session.updateMetadata({ ...projected, name: "Renamed clinic" });
    expect(f.session.syncView.pending).toBe(true); expect(await f.session.checkpointNow("purchase")).toBe(true);
    expect(f.server.operationCount("account-a")).toBe(1);
  });
  it("keeps remount timestamp-only projections quiet and dates actual accepted progress", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    f.session.updateMetadata({ ...f.session.metadata, updatedAtRealMs: f.session.metadata.updatedAtRealMs + 1000 });
    expect(f.session.syncView.pending).toBe(false);
    vi.spyOn(Date, "now").mockReturnValue(f.session.metadata.updatedAtRealMs + 2000);
    f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "dated.progress" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(true);
    expect(f.coordinator.pendingCandidate?.campaign.updatedAtRealMs).toBe(Date.now());
  });
  it("re-encodes and uploads accepted commands after a worker is lost, before reopening the command gate", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    const lost = new FakeCloudCodecWorker(), recovered = new FakeCloudCodecWorker(); recovered.release();
    const codec = new CloudCodecWorker(vi.fn().mockReturnValueOnce(lost).mockReturnValueOnce(recovered));
    vi.spyOn(f.coordinator, "codec", "get").mockReturnValue(codec);
    f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "worker.accepted" }, PROTOTYPE_DOMAIN_CONTEXT);
    const saving = f.session.durable(); await Promise.resolve();
    lost.onerror?.({ preventDefault() {} } as ErrorEvent);
    expect(await saving).toBe(false);
    expect(f.coordinator.view).toMatchObject({ canExecute: false, failure: "processing" });
    expect(await f.session.reconnect()).toBe(true);
    expect(f.session.state.simulationSpeed).toBe(2); expect(f.session.canExecute).toBe(true);
    expect(f.coordinator.view.pending).toBe(false); expect(f.coordinator.confirmedRevision).toBe("2");
    codec.dispose();
  });
  it("keeps real ticks and commands running while a routine worker checkpoint is in progress", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker);
    vi.spyOn(f.coordinator, "codec", "get").mockReturnValue(codec);
    f.session.execute({ type: "SET_PAUSED", paused: false, operationId: "live.resume" }, PROTOTYPE_DOMAIN_CONTEXT);
    await Promise.resolve();
    expect(worker.messages[0]?.task.kind).toBe("encode");
    expect(f.session.canExecute).toBe(true); expect(f.session.state.paused).toBe(false);
    expect(f.session.syncView).toMatchObject({ canExecute: true, pending: true, localDurable: false });
    const tick = f.session.state.facilityTick;
    expect(f.session.execute({ type: "ADVANCE_TICK", operationId: "live.tick", advancedAtRealMs: f.clock.wall }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    expect(f.session.state.facilityTick).toBe(tick + 1);
    worker.release(); expect(await f.session.durable()).toBe(true);
    expect(f.session.canExecute).toBe(true); expect(f.session.state.paused).toBe(false);
    const gate = deferred();
    f.server.faults.push({ method: "commit", at: "after", wait: gate.promise });
    const saving = f.session.checkpointNow("ordinary");
    await vi.waitFor(() => expect(f.coordinator.view.phase).toBe("saving"));
    expect(f.session.canExecute).toBe(true); expect(f.session.state.paused).toBe(false);
    expect(f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "live.speed" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
    const recovery = JSON.parse(f.session.exportRecovery());
    expect(importGameEvidence(recovery.checkpoint.snapshot, recovery.checkpoint.evidence).simulationSpeed).toBe(2);
    expect(recovery.pendingRecovery).not.toBeNull();
    await f.session.durable(); gate.resolve(); expect(await saving).toBe(true);
    expect(f.session.state.simulationSpeed).toBe(2); expect(f.session.canExecute).toBe(true);
    expect(worker.messages.map(message => message.task.kind)).toEqual(expect.arrayContaining(["encode", "candidate", "freeze", "verify"]));
    codec.dispose();
  });
  it("keeps new scored receipts with the matching snapshot when an answer arrives during encoding", async () => {
    const f = await fixture(scoredPatientFixture()); await f.coordinator.startWriter(); f.coordinator.resume();
    const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker), stage = vi.spyOn(f.coordinator, "stage");
    vi.spyOn(f.coordinator, "codec", "get").mockReturnValue(codec);
    f.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "receipt.speed" }, PROTOTYPE_DOMAIN_CONTEXT);
    await Promise.resolve();
    const encounter = Object.values(f.session.state.encounters)[0]!, node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
    const receipt = { receipt_id: "00000000-0000-4000-8000-000000000002", kind: "question" as const, occurred_at: new Date(f.clock.wall).toISOString() };
    expect(f.session.execute({ type: "SUBMIT_ANSWER", encounterId: encounter.id, decisionNodeId: node.id,
      answerChoiceId: node.answerChoices[0]!.id, reviewedAtMs: f.clock.wall, operationId: "receipt.answer" }, PROTOTYPE_DOMAIN_CONTEXT, () => receipt)).not.toBeNull();
    worker.release(); expect(await f.session.durable()).toBe(true);
    expect(stage.mock.calls[0]?.[0].usageQuestions).toEqual([]);
    expect(stage.mock.calls.at(-1)?.[0].usageQuestions).toEqual([receipt]);
    expect(f.server.operationCount("account-a")).toBe(0);
    expect(await f.session.checkpointNow("hidden")).toBe(true); expect(f.server.usageCount("account-a")).toBe(1);
    codec.dispose();
  });
  it.each(["visibilitychange", "pagehide"])("checkpoints on %s without pausing or waiting for the interval", async event => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    const env = phoneTestDom();
    Object.assign(env.doc, { visibilityState: "visible" });
    Object.assign(env.browser, { setInterval: () => 1, clearInterval: vi.fn() });
    const state = f.session.state, profile = { ...createFreshProfile(), activeCampaignId: state.campaignId, tutorialsEnabled: false,
      tutorialGuidanceByCampaign: { [state.campaignId]: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] } },
      campaigns: [{ campaignId: state.campaignId, name: "Visible clinic", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable" as const, state }] };
    function Game() { const session = usePrototypeSession({ profile, notice: "Verified." }, f.session); return <p>{session.state.facilityTick}</p>; }
    await env.render(<AuthAccountContext.Provider value="account-a"><Game /></AuthAccountContext.Provider>);
    await act(async () => {
      f.session.execute({ type: "SET_PAUSED", paused: false, operationId: `lifecycle.${event}` }, PROTOTYPE_DOMAIN_CONTEXT);
      await f.session.durable();
    });
    const checkpoint = vi.spyOn(f.session, "checkpointNow"), pause = vi.spyOn(f.coordinator, "pause");
    expect(f.server.operationCount("account-a")).toBe(0);
    await act(async () => {
      if (event === "visibilitychange") { Object.assign(env.doc, { visibilityState: "hidden" }); env.doc.dispatchEvent(new Event(event)); }
      else env.browser.dispatchEvent(new Event(event));
      await checkpoint.mock.results[0]?.value;
    });
    expect(checkpoint).toHaveBeenCalledExactlyOnceWith(event === "visibilitychange" ? "hidden" : "pagehide");
    expect(pause).not.toHaveBeenCalled(); expect(f.session.state.paused).toBe(false); expect(f.session.canExecute).toBe(true);
    expect(f.server.operationCount("account-a")).toBe(1);
    expect(env.browser.localStorage.setItem).not.toHaveBeenCalled();
  });
  it("Save & Close pauses immediately while an earlier worker encode is still pending", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker);
    vi.spyOn(f.coordinator, "codec", "get").mockReturnValue(codec);
    f.session.execute({ type: "SET_PAUSED", paused: false, operationId: "closing.resume" }, PROTOTYPE_DOMAIN_CONTEXT);
    await Promise.resolve();
    const closing = f.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT);
    expect(f.session.state.paused).toBe(true); expect(f.session.canExecute).toBe(false);
    expect(f.session.execute({ type: "ADVANCE_TICK", operationId: "closing.tick" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
    expect(f.server.calls.some(call => call.method === "release")).toBe(false);
    worker.release(); expect(await closing).toBe(true); expect(f.server.calls.at(-1)?.method).toBe("release"); codec.dispose();
  });
  it("requires a fresh projection when reopening a closed session with a different account revision", async () => {
    const f = await fixture(); await f.coordinator.startWriter(); f.coordinator.resume();
    expect(await f.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
    const otherCoordinator = new CloudSyncCoordinator({ scope: f.coordinator.scope, transport: f.server.transport("account-a"), cache: new MemoryCloudCache(), clock: f.clock, enabled: true });
    await otherCoordinator.open(); const other = await CloudGameSession.create(otherCoordinator);
    await otherCoordinator.startWriter(); otherCoordinator.resume();
    other.execute({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "other.speed" }, PROTOTYPE_DOMAIN_CONTEXT);
    await other.durable(); await other.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.coordinator.focus()).toBe(false); // Save & Close stays closed.
    expect(await f.coordinator.open()).toBe(true);
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
