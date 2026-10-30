import { describe, expect, it, vi } from "vitest";
import { MemoryCloudCache } from "./cache";
import { CloudSyncCoordinator } from "./coordinator";
import { CLOUD_CHECKPOINT_MS, CLOUD_RENEW_MS, CloudSyncError, type CloudCommitRequest, type CloudFrozenOperation } from "./transport";
import { deferred, syncHarness, type TestCloudClock } from "./syncTestSupport";
import { sha256Utf8 } from "./codecJson";

async function playing() {
  const h = await syncHarness();
  expect(await h.coordinator.open()).toBe(true);
  expect(await h.coordinator.startWriter()).toBe(true);
  expect(h.coordinator.resume()).toBe(true);
  const first = h.command(h.prepared.checkpoint, { type: "SET_PAUSED", paused: false, operationId: "game.resume" });
  return { ...h, first };
}
const question = (id: number) => ({ kind: "question" as const, receipt_id: `00000000-0000-4000-8000-${String(id).padStart(12, "0")}`, occurred_at: "2027-01-15T08:00:00.000Z" });
function advance(clock: TestCloudClock, ms: number) { clock.advance(ms); }
async function pulseFor(h: Awaited<ReturnType<typeof playing>>, ms: number) {
  while (ms > 0) { const part = Math.min(ms, CLOUD_RENEW_MS); advance(h.clock, part); await h.coordinator.pulse(); ms -= part; }
}
describe("shared cloud coordinator durable and fenced protocol", () => {
  it("keeps pending visible until a server acknowledgment is durable on this device", async () => {
    const h = await playing(), gate = deferred(); await h.coordinator.stage(await h.candidate(h.first));
    const write = h.cache.write.bind(h.cache); let acknowledging = false;
    vi.spyOn(h.cache, "write").mockImplementation(async (entry, expected) => {
      if (entry.confirmed.revision === "2") { acknowledging = true; await gate.promise; }
      return write(entry, expected);
    });
    const saving = h.coordinator.checkpoint();
    await vi.waitFor(() => expect(acknowledging).toBe(true));
    expect(h.coordinator.view.pending).toBe(true); expect(h.coordinator.confirmedRevision).toBe("1");
    gate.resolve(); expect(await saving).toBe(true);
    expect(h.coordinator.view.pending).toBe(false); expect(h.coordinator.confirmedRevision).toBe("2");
  });
  it("rechecks its own suspended writer after a backward clock jump without requiring takeover", async () => {
    const h = await playing();
    h.clock.wall -= 10_000;
    expect(h.coordinator.view).toMatchObject({ canExecute: false, phase: "paused", failure: "clock" });
    expect(h.coordinator.resume()).toBe(false);
    expect(await h.coordinator.retry()).toBe(true);
    expect(h.coordinator.view.canExecute).toBe(false);
    expect(h.coordinator.resume()).toBe(true);
    expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
  });

  it("does not recover a suspended writer after another device takes it over", async () => {
    const h = await playing(); h.clock.wall -= 10_000;
    expect(h.coordinator.view.canExecute).toBe(false);
    const other = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId),
      cache: new MemoryCloudCache(), clock: h.clock, enabled: true });
    expect(await other.open()).toBe(true); expect(await other.startWriter(true)).toBe(true);
    expect(await h.coordinator.retry()).toBe(false);
    expect(h.coordinator.view).toMatchObject({ canExecute: false, failure: "writer" });
    other.dispose();
  });

  it("defaults OFF and makes no cache or transport call", async () => {
    const h = await syncHarness();
    const transport = h.server.transport(h.scope.accountId), cache = new MemoryCloudCache();
    const coordinator = new CloudSyncCoordinator({ scope: h.scope, cache, transport });
    expect(await coordinator.open()).toBe(false); expect(await coordinator.startWriter()).toBe(false);
    await coordinator.pulse(); expect(await coordinator.checkpoint()).toBe(false);
    expect(coordinator.view.phase).toBe("off"); expect(h.server.calls).toEqual([]); expect(cache.records.size).toBe(0);
  });
  it("opens read-only, verifies the save, and requires explicit acquisition and Resume", async () => {
    const h = await syncHarness();
    expect(await h.coordinator.open()).toBe(true); expect(h.coordinator.view.canExecute).toBe(false);
    expect(h.server.calls.some(call => call.method === "acquire")).toBe(false);
    expect(await h.coordinator.startWriter()).toBe(true); expect(h.coordinator.view.canExecute).toBe(false);
    expect(h.coordinator.resume()).toBe(true); expect(h.coordinator.view.canExecute).toBe(true);
    expect(h.server.calls.some(call => call.method === "commit")).toBe(false);
  });
  it("keeps commands enabled while the candidate is verified and committed locally", async () => {
    const h = await playing(), candidate = await h.candidate(h.first);
    const staging = h.coordinator.stage(candidate);
    expect(h.coordinator.view.canExecute).toBe(true);
    expect(await staging).toBe(true); expect(h.coordinator.view.canExecute).toBe(true);
    const saved = await h.cache.read(h.scope);
    expect(saved?.entry.recovery?.inFlight).toBeNull(); expect(saved?.entry.recovery?.following).toEqual(candidate);
    expect(h.server.operationCount(h.scope.accountId)).toBe(0);
  });
  it("freezes before sending and acknowledges only the covered work, rebasing one following state", async () => {
    const h = await playing(), gate = deferred();
    await h.coordinator.stage(await h.candidate(h.first, h.confirmed, [question(1)]));
    h.server.faults.push({ method: "commit", at: "after", wait: gate.promise });
    const saving = h.coordinator.checkpoint();
    await vi.waitFor(() => expect(h.server.operationCount(h.scope.accountId)).toBe(1));
    const before = await h.cache.read(h.scope), operation = before!.entry.recovery!.inFlight!;
    expect(await sha256Utf8(operation.requestText)).toBe(operation.requestSha256);
    const second = h.command(h.first, { type: "ADVANCE_TICK", advancedAtRealMs: h.clock.wall, operationId: "game.tick" });
    await h.coordinator.stage(await h.candidate(second, h.confirmed, [question(1), question(2)]));
    // A third candidate replaces the one following state, never the frozen request.
    const third = h.command(second, { type: "SET_PAUSED", paused: true, operationId: "game.pause" });
    await h.coordinator.stage(await h.candidate(third, h.confirmed, [question(1), question(2)]));
    expect((await h.cache.read(h.scope))?.entry.recovery?.inFlight).toEqual(operation);
    gate.resolve(); expect(await saving).toBe(true);
    const middle = await h.cache.read(h.scope);
    expect(middle?.entry.confirmed.revision).toBe("2");
    expect(middle?.entry.recovery?.following?.evidence.fromRecord).toBe(h.first.evidence.records.length);
    expect(middle?.entry.recovery?.following?.usageQuestions).toEqual([question(2)]);
    expect(await h.coordinator.checkpoint("purchase")).toBe(true);
    expect(h.coordinator.view.pending).toBe(false); expect(h.coordinator.confirmed?.revision).toBe("3");
    expect(h.coordinator.confirmed?.evidence.records.length).toBe(third.evidence.records.length);
    expect(h.server.usageCount(h.scope.accountId)).toBe(2);
  });
  it("recovers a lost server acknowledgment by querying the same operation without replay/upload", async () => {
    const h = await playing();
    await h.coordinator.stage(await h.candidate(h.first, h.confirmed, [question(1)]));
    h.server.faults.push({ method: "commit", at: "after", error: new CloudSyncError("network") });
    expect(await h.coordinator.checkpoint()).toBe(false);
    const id = (await h.cache.read(h.scope))!.entry.recovery!.inFlight!.operationId;
    expect(h.coordinator.confirmed?.revision).toBe("1");
    expect(await h.coordinator.retry()).toBe(true);
    expect(h.server.calls.filter(call => call.method === "commit")).toHaveLength(1);
    expect(h.server.calls.some(call => call.method === "operation" && call.operationId === id)).toBe(true);
    expect(h.coordinator.confirmed?.revision).toBe("2"); expect(h.server.usageCount(h.scope.accountId)).toBe(1);
    expect(h.coordinator.view.canExecute).toBe(false); expect(h.coordinator.resume()).toBe(true);
  });
  it("retries identical bytes after failure before server commit", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError("network") });
    expect(await h.coordinator.checkpoint()).toBe(false);
    const frozen = (await h.cache.read(h.scope))!.entry.recovery!.inFlight!;
    expect(await h.coordinator.retry()).toBe(true);
    const calls = h.server.calls.filter(call => call.method === "commit");
    expect(calls).toHaveLength(2); expect(calls[0]?.operationId).toBe(calls[1]?.operationId);
    expect(calls[1]?.requestSha256).toBe(frozen.requestSha256); expect(h.server.operationCount(h.scope.accountId)).toBe(1);
  });
  it("preserves frozen work through refresh and resolves a committed receipt under the original writer", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "after", error: new CloudSyncError("network") });
    await h.coordinator.checkpoint(); h.coordinator.dispose("sign-out");
    const next = new CloudSyncCoordinator({ scope: h.scope, transport: h.server.transport(h.scope.accountId), cache: h.cache, clock: h.clock, enabled: true });
    expect(await next.open()).toBe(true); expect(next.view.phase).toBe("paused");
    expect(await next.retry()).toBe(true); expect(next.confirmed?.revision).toBe("2");
    expect(next.view.canExecute).toBe(false); expect(next.resume()).toBe(true);
    expect(h.server.calls.filter(call => call.method === "commit")).toHaveLength(1);
  });
  it("reacquires an expired lease only after a missing outcome and an unchanged base/generation", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError("network") });
    await h.coordinator.checkpoint(); const old = (await h.cache.read(h.scope))!.entry.recovery!.inFlight!;
    advance(h.clock, 61_000); expect(h.coordinator.view.canExecute).toBe(false);
    expect(await h.coordinator.retry()).toBe(true);
    const calls = h.server.calls.filter(call => call.method === "commit");
    expect(calls[1]?.operationId).not.toBe(old.operationId); expect(h.coordinator.confirmed?.revision).toBe("2");
    expect(h.coordinator.view.canExecute).toBe(false);
  });
  it("never blindly retries an expired operation ID", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "after", error: new CloudSyncError("network") });
    await h.coordinator.checkpoint(); const id = (await h.cache.read(h.scope))!.entry.recovery!.inFlight!.operationId;
    h.server.expireOperation(h.scope.accountId, id);
    expect(await h.coordinator.retry()).toBe(false); expect(h.coordinator.view.failure).toBe("operation-expired");
    expect(h.server.calls.filter(call => call.method === "commit")).toHaveLength(1); expect(h.coordinator.exportRecovery()).not.toBeNull();
  });
  it("supports explicit takeover, fences old save/release, and keeps the old unsent branch", async () => {
    const desktop = await playing(); await desktop.coordinator.stage(await desktop.candidate(desktop.first));
    const phone = new CloudSyncCoordinator({ scope: desktop.scope, cache: new MemoryCloudCache(), transport: desktop.server.transport(desktop.scope.accountId), clock: desktop.clock, enabled: true });
    expect(await phone.open()).toBe(true); expect(await phone.startWriter()).toBe(false);
    expect(await phone.startWriter(true)).toBe(true); expect(phone.resume()).toBe(true);
    expect(await desktop.coordinator.checkpoint()).toBe(false); expect(desktop.coordinator.view.phase).toBe("conflict");
    expect(desktop.coordinator.view.canExecute).toBe(false); expect(desktop.coordinator.exportRecovery()).not.toBeNull();
    expect(await desktop.coordinator.saveAndClose()).toBe(false);
    expect((await desktop.server.transport(desktop.scope.accountId).head(desktop.scope.campaignId)).writerActive).toBe(true);
    expect(await desktop.coordinator.retry()).toBe(false); expect(desktop.coordinator.resume()).toBe(false);
  });
  it("pauses after at most 30 s grace and caps grace by the remaining confirmed lease", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    advance(h.clock, 45_000);
    h.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError("network") });
    await h.coordinator.checkpoint(); expect(h.coordinator.view.canExecute).toBe(true);
    advance(h.clock, 14_999); expect(h.coordinator.view.canExecute).toBe(true);
    advance(h.clock, 1); expect(h.coordinator.view.canExecute).toBe(false); expect(h.coordinator.view.phase).toBe("paused");
  });
  it("does not restart the grace deadline after repeated failures", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError("network") });
    await h.coordinator.checkpoint(); advance(h.clock, 30_001); await h.coordinator.pulse();
    expect(h.coordinator.view.canExecute).toBe(false); expect(h.coordinator.exportRecovery()).not.toBeNull();
  });
  it.each(["backward", "monotonic-forward", "sleep"])("never extends a lease after a %s clock discontinuity", async kind => {
    const h = await playing();
    if (kind === "backward") h.clock.wall -= 10_000;
    else if (kind === "monotonic-forward") h.clock.mono += 10_000;
    else advance(h.clock, 65_000);
    await h.coordinator.pulse(); expect(h.coordinator.view.canExecute).toBe(false); expect(h.coordinator.resume()).toBe(false);
  });
  it("keeps an unexpired lease through forward-only iOS suspension without extending its original deadline", async () => {
    const h = await playing(); h.clock.wall += 20_000;
    expect(h.coordinator.view).toMatchObject({ canExecute: true, failure: null });
    // No fresh server proof or renewal. Either original clock deadline still
    // expires authority; accepting this suspension cannot add lease time.
    h.clock.wall += 40_000;
    expect(h.coordinator.view).toMatchObject({ canExecute: false, failure: "lease-expired" });
    expect(h.coordinator.resume()).toBe(false);
  });
  it("renews every 15 s and never checkpoints a clean writer", async () => {
    const h = await playing(); advance(h.clock, 14_999); await h.coordinator.pulse();
    expect(h.server.calls.filter(call => call.method === "renew")).toHaveLength(0);
    advance(h.clock, 1); await h.coordinator.pulse();
    expect(h.server.calls.filter(call => call.method === "renew")).toHaveLength(1);
    advance(h.clock, 15_000); await h.coordinator.pulse();
    expect(h.server.calls.filter(call => call.method === "renew")).toHaveLength(2);
    expect(h.server.calls.filter(call => call.method === "commit")).toHaveLength(0);
  });
  it("does not regain authority from a renewal response delayed beyond the old lease", async () => {
    const h = await playing(), gate = deferred();
    h.server.faults.push({ method: "renew", at: "after", wait: gate.promise });
    advance(h.clock, 15_000); const renewal = h.coordinator.pulse();
    await vi.waitFor(() => expect(h.server.calls.some(call => call.method === "renew")).toBe(true));
    advance(h.clock, 61_000); expect(h.coordinator.view.canExecute).toBe(false);
    gate.resolve(); await renewal; expect(h.coordinator.resume()).toBe(false);
  });
  it("revalidates focus after an upload already in progress and automatically restores authority", async () => {
    const h = await playing(), gate = deferred(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "after", wait: gate.promise });
    const upload = h.coordinator.checkpoint(); await vi.waitFor(() => expect(h.server.operationCount(h.scope.accountId)).toBe(1));
    const focus = h.coordinator.focus(); expect(h.coordinator.view.canExecute).toBe(false);
    gate.resolve(); expect(await upload).toBe(true); expect(await focus).toBe(true);
    expect(h.coordinator.view.canExecute).toBe(true);
  });
  it("fences two simultaneous takeovers against the generation they both observed", async () => {
    const h = await playing();
    const other = () => new CloudSyncCoordinator({ scope: h.scope, cache: new MemoryCloudCache(),
      transport: h.server.transport(h.scope.accountId), clock: h.clock, enabled: true });
    const a = other(), b = other(); expect(await a.open()).toBe(true); expect(await b.open()).toBe(true);
    const outcomes = await Promise.all([a.startWriter(true), b.startWriter(true)]);
    expect(outcomes.filter(Boolean)).toHaveLength(1); expect(h.coordinator.exportRecovery()).toBeNull();
    advance(h.clock, 15_000); await h.coordinator.pulse(); expect(h.coordinator.view.canExecute).toBe(false);
  });
  it("a delayed old release cannot release a new phone writer", async () => {
    const h = await playing(), gate = deferred(); h.server.faults.push({ method: "release", at: "before", wait: gate.promise });
    const closing = h.coordinator.saveAndClose();
    await vi.waitFor(() => expect(h.server.calls.some(call => call.method === "release")).toBe(true));
    const phone = new CloudSyncCoordinator({ scope: h.scope, cache: new MemoryCloudCache(), transport: h.server.transport(h.scope.accountId), clock: h.clock, enabled: true });
    expect(await phone.open()).toBe(true); expect(await phone.startWriter(true)).toBe(true);
    gate.resolve(); expect(await closing).toBe(false);
    expect((await h.server.transport(h.scope.accountId).head(h.scope.campaignId)).writerActive).toBe(true);
  });
  it.each(["scored-answer", "purchase", "pause", "mode-exit", "campaign-switch"] as const)("does not schedule an early upload for a staged %s", async reason => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first), reason);
    advance(h.clock, 9_999); await h.coordinator.pulse(); expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    advance(h.clock, 1); await h.coordinator.pulse(); expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    advance(h.clock, 4_999); await h.coordinator.pulse(); expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    advance(h.clock, 1); await h.coordinator.pulse(); expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    await pulseFor(h, CLOUD_CHECKPOINT_MS - 15_000); expect(h.server.operationCount(h.scope.accountId)).toBe(1);
  });
  it("checkpoints dirty work after five minutes, renews with no snapshots, and stays quiet when clean", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    await pulseFor(h, CLOUD_CHECKPOINT_MS - 1); expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    advance(h.clock, 1); await h.coordinator.pulse(); expect(h.server.operationCount(h.scope.accountId)).toBe(1);
    expect(h.server.calls.filter(call => call.method === "renew")).toHaveLength(20);
    expect(h.coordinator.view.canExecute).toBe(true);
    for (let index = 0; index < 20; index++) { advance(h.clock, 15_000); await h.coordinator.pulse(); }
    expect(h.server.operationCount(h.scope.accountId)).toBe(1);
  });
  it("gives work arriving during an upload a fresh five-minute interval after acknowledgment", async () => {
    const h = await playing(), gate = deferred(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "after", wait: gate.promise });
    const saving = h.coordinator.checkpoint("hidden");
    await vi.waitFor(() => expect(h.server.operationCount(h.scope.accountId)).toBe(1));
    const second = h.command(h.first, { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "interval.following" });
    await h.coordinator.stage(await h.candidate(second)); gate.resolve(); expect(await saving).toBe(true);
    expect(h.coordinator.view.pending).toBe(true);
    await pulseFor(h, CLOUD_CHECKPOINT_MS - 1); expect(h.server.operationCount(h.scope.accountId)).toBe(1);
    advance(h.clock, 1); await h.coordinator.pulse(); expect(h.server.operationCount(h.scope.accountId)).toBe(2);
  });
  it("stops play on a corrupted worker-verified candidate rather than treating it as an offline grace period", async () => {
    const h = await playing(), candidate = await h.candidate(h.first);
    const snapshot = { ...candidate.snapshot, uncompressedSha256: "0".repeat(64) };
    expect(await h.coordinator.stage({ ...candidate, snapshot })).toBe(false);
    expect(h.coordinator.view).toMatchObject({ phase: "blocked", failure: "corrupt", canExecute: false });
    expect(h.server.operationCount(h.scope.accountId)).toBe(0); expect(h.coordinator.exportRecovery()).not.toBeNull();
  });
  it("awaits the confirmed checkpoint before releasing on Save & Close", async () => {
    const h = await playing(), gate = deferred(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "after", wait: gate.promise });
    const closing = h.coordinator.saveAndClose();
    await vi.waitFor(() => expect(h.server.operationCount(h.scope.accountId)).toBe(1));
    expect(h.server.calls.some(call => call.method === "release")).toBe(false); expect(h.coordinator.view.canExecute).toBe(false);
    gate.resolve(); expect(await closing).toBe(true); expect(h.coordinator.view.phase).toBe("closed");
    expect(h.coordinator.confirmed?.revision).toBe("2"); expect(h.server.calls.at(-1)?.method).toBe("release");
  });
  it("coalesces repeated Save & Close calls and prevents Resume or new work during release", async () => {
    const h = await playing(), gate = deferred(); h.server.faults.push({ method: "release", at: "before", wait: gate.promise });
    const first = h.coordinator.saveAndClose(), second = h.coordinator.saveAndClose();
    expect(first).toBe(second); expect(h.coordinator.resume()).toBe(false); expect(h.coordinator.view.canExecute).toBe(false);
    await vi.waitFor(() => expect(h.server.calls.filter(call => call.method === "release")).toHaveLength(1));
    expect(await h.coordinator.stage(await h.candidate(h.first))).toBe(false);
    gate.resolve(); expect(await first).toBe(true); expect(await second).toBe(true);
    expect(h.coordinator.view.pending).toBe(false);
  });
  it.each(["before-commit", "after-commit", "corrupt"] as const)("pauses on local durability failure (%s), retaining new bytes", async fault => {
    const h = await playing(), cache = h.cache as MemoryCloudCache;
    cache.fault = fault;
    expect(await h.coordinator.stage(await h.candidate(h.first))).toBe(false);
    expect(h.coordinator.view.canExecute).toBe(false); expect(h.coordinator.view.localDurable).toBe(false);
    expect(h.coordinator.exportRecovery()).not.toBeNull(); expect(h.server.operationCount(h.scope.accountId)).toBe(0);
    if (fault !== "corrupt") { expect(await h.coordinator.retry()).toBe(true); expect(h.coordinator.confirmed?.revision).toBe("2"); }
  });
  it("rejects a pending evidence/capacity overflow without replacing the prior durable record", async () => {
    const h = await playing(), candidate = await h.candidate(h.first), before = await h.cache.read(h.scope);
    const huge = { ...candidate, usageQuestions: [{ ...question(1), occurred_at: "x".repeat(1_000_001) }] };
    expect(await h.coordinator.stage(huge)).toBe(false); expect(h.coordinator.view.phase).toBe("capacity");
    expect((await h.cache.read(h.scope))?.entry).toEqual(before?.entry); expect(h.coordinator.exportRecovery()).toContain("x".repeat(100));
  });
  it.each(["auth", "revoked", "deleted", "disabled", "protocol", "notice", "capacity", "throttled"] as const)("preserves pending work on %s failure without local fallback", async code => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError(code) });
    expect(await h.coordinator.checkpoint()).toBe(false); expect(h.coordinator.confirmed?.revision).toBe("1");
    expect(h.coordinator.exportRecovery()).not.toBeNull();
    if (code !== "throttled") expect(h.coordinator.view.canExecute).toBe(false);
  });
  it("ignores a late response after sign-out; cache and new-account state remain scoped", async () => {
    const h = await playing(), gate = deferred(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "after", wait: gate.promise });
    const upload = h.coordinator.checkpoint(); await vi.waitFor(() => expect(h.server.operationCount(h.scope.accountId)).toBe(1));
    h.coordinator.dispose("sign-out"); gate.resolve(); expect(await upload).toBe(false);
    expect(h.coordinator.confirmed?.revision).toBe("1"); expect((await h.cache.read(h.scope))?.entry.recovery?.inFlight).not.toBeNull();
    expect(await h.cache.read({ ...h.scope, accountId: "account-b" })).toBeNull();
    expect(h.coordinator.view.canExecute).toBe(false);
  });
  it("refreshes admission before retry and cannot recreate a deletion-blocked campaign", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.setAccess(h.scope.accountId, { deletionRequested: true });
    expect(await h.coordinator.retry()).toBe(false); expect(h.coordinator.view.failure).toBe("deleted");
    expect(h.server.calls.some(call => call.method === "commit")).toBe(false); expect(h.coordinator.exportRecovery()).not.toBeNull();
  });
  it("requires reauthentication as the SAME account and an explicit Resume", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    h.server.faults.push({ method: "commit", at: "before", error: new CloudSyncError("auth") }); await h.coordinator.checkpoint();
    h.server.setAccess(h.scope.accountId, { accountId: "account-b" }); expect(await h.coordinator.retry()).toBe(false);
    expect(h.coordinator.view.phase).toBe("auth");
    h.server.setAccess(h.scope.accountId, { accountId: h.scope.accountId }); expect(await h.coordinator.retry()).toBe(true);
    expect(h.coordinator.view.canExecute).toBe(false); expect(h.coordinator.resume()).toBe(true);
  });
  it("keeps a recovery copy before explicitly adopting a newer account save", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first));
    expect(await h.coordinator.useAccountSave(async () => { throw new Error("download failed"); })).toBe(false);
    expect(h.coordinator.exportRecovery()).not.toBeNull();
    let recovery = "";
    expect(await h.coordinator.useAccountSave(async bytes => { recovery = bytes; })).toBe(true);
    expect(JSON.parse(recovery).recovery.following).not.toBeNull(); expect(h.coordinator.exportRecovery()).toBeNull();
    expect(h.coordinator.view.phase).toBe("readonly"); expect(h.coordinator.view.canExecute).toBe(false);
  });
  it("rejects conflicting operation-ID reuse without duplicate evidence or count", async () => {
    const h = await playing(); await h.coordinator.stage(await h.candidate(h.first, h.confirmed, [question(1)]));
    h.server.faults.push({ method: "commit", at: "after", error: new CloudSyncError("network") }); await h.coordinator.checkpoint();
    const operation = (await h.cache.read(h.scope))!.entry.recovery!.inFlight!;
    const changed = JSON.parse(operation.requestText) as CloudCommitRequest; changed.campaign.name = "Changed request";
    const text = JSON.stringify(changed), altered: CloudFrozenOperation = { ...operation, requestText: text, requestSha256: await sha256Utf8(text) };
    await expect(h.server.transport(h.scope.accountId).commit(altered)).rejects.toMatchObject({ code: "corrupt" });
    expect(h.server.operationCount(h.scope.accountId)).toBe(1); expect(h.server.usageCount(h.scope.accountId)).toBe(1);
  });
});
