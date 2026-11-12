import { describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { CloudGameSession } from "./gameSession";
import { CloudSyncError, CLOUD_RENEW_MS } from "./transport";
import { deferred, syncHarness } from "./syncTestSupport";
import { CLOUD_CHECK_TIMEOUT_MS } from "./checkDeadline";

async function playing() {
  const h = await syncHarness();
  expect(await h.coordinator.open()).toBe(true);
  expect(await h.coordinator.startWriter()).toBe(true);
  expect(h.coordinator.resume()).toBe(true);
  const session = await CloudGameSession.create(h.coordinator);
  return { ...h, session };
}

describe("upload, authority check and close ordering", () => {
  it.each([false, true])("does not let an older renewal fence a recovery that has just finished checking (pending upload=%s)", async pending => {
    const h = await playing(), renewal = deferred(), started = deferred();
    const receipt = deferred();
    let uploading: Promise<boolean> | undefined;
    if (pending) {
      h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "before.recovery" }, PROTOTYPE_DOMAIN_CONTEXT);
      await h.session.prepareRecoveryCopy();
      h.server.faults.push({ method: "commit", at: "after", wait: receipt.promise });
      uploading = h.session.checkpointNow("ordinary");
      await vi.waitFor(() => expect(h.server.operationCount(h.scope.accountId)).toBe(1));
    }
    h.server.faults.push({ method: "renew", at: "before", wait: renewal.promise, error: new CloudSyncError("revision") });
    h.clock.advance(CLOUD_RENEW_MS);
    const pulse = h.coordinator.pulse();
    await vi.waitFor(() => expect(h.server.calls.filter(row => row.method === "renew")).toHaveLength(1));
    let releaseWhenResumed = false;
    const unsubscribe = h.coordinator.subscribe(() => {
      if (releaseWhenResumed && h.coordinator.view.canExecute) { releaseWhenResumed = false; started.resolve(); renewal.resolve(); }
    });
    try {
      releaseWhenResumed = true;
      const recovering = h.session.reconnect();
      receipt.resolve();
      await started.promise;
      await Promise.all([recovering, pulse, uploading]);
      expect(h.session.syncView).toMatchObject({ canExecute: true, pending: false, failure: null, phase: "ready" });
      expect(h.session.execute({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "after.recovery" }, PROTOTYPE_DOMAIN_CONTEXT)).not.toBeNull();
      expect(h.server.operationCount(h.scope.accountId)).toBe(pending ? 1 : 0);
    } finally { receipt.resolve(); renewal.resolve(); unsubscribe(); h.session.dispose(); }
  });
  it("keeps Save & Close closed when an older renewal replies after the background upload and release", async () => {
    const h = await playing(), renewal = deferred(), receipt = deferred();
    h.server.faults.push({ method: "renew", at: "before", wait: renewal.promise, error: new CloudSyncError("revision") });
    h.clock.advance(CLOUD_RENEW_MS);
    const pulse = h.coordinator.pulse();
    await vi.waitFor(() => expect(h.server.calls.some(row => row.method === "renew")).toBe(true));
    h.session.execute({ type: "SET_PAUSED", paused: false, operationId: "before.close" }, PROTOTYPE_DOMAIN_CONTEXT);
    await h.session.prepareRecoveryCopy();
    h.server.faults.push({ method: "commit", at: "after", wait: receipt.promise });
    const uploading = h.session.checkpointNow("ordinary");
    await vi.waitFor(() => expect(h.server.operationCount(h.scope.accountId)).toBe(1));
    const unsubscribe = h.coordinator.subscribe(() => { if (h.coordinator.view.phase === "closed") renewal.resolve(); });
    try {
      const closing = h.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT);
      expect(h.session.canExecute).toBe(false);
      receipt.resolve();
      expect(await closing).toBe(true);
      await Promise.all([pulse, uploading]);
      expect(h.session.syncView).toMatchObject({ phase: "closed", canExecute: false, pending: false, failure: null });
      expect((await h.server.transport(h.scope.accountId).head(h.scope.campaignId)).writerActive).toBe(false);
      expect(h.server.calls.filter(row => row.method === "release")).toHaveLength(1);
      const restored = await CloudGameSession.create(h.coordinator);
      expect(restored.state.paused).toBe(true);
      expect(restored.state.operationReceipts["before.close"]).toBeTruthy();
      restored.detach();
    } finally { renewal.resolve(); receipt.resolve(); unsubscribe(); h.session.dispose(); }
  });
  it.each(["admission", "head"] as const)("cancels an earlier %s check when Save & Close finishes, without reopening or acquiring again", async stage => {
    const h = await playing(), held = deferred();
    const reopen = vi.fn(async () => true);
    h.session.detach();
    const session = await CloudGameSession.create(h.coordinator, undefined, reopen);
    session.execute({ type: "SET_PAUSED", paused: true, operationId: `paused.before.${stage}` }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await session.checkpointNow("purchase")).toBe(true);
    h.server.faults.push({ method: stage === "admission" ? "capabilities" : "head", at: "before", wait: held.promise });
    const original = h.server.calls.length;
    const checking = session.reconnect();
    await vi.waitFor(() => expect(h.server.calls.slice(original).some(row => row.method === (stage === "admission" ? "capabilities" : "head"))).toBe(true));
    try {
      const closed = await session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT);
      expect({ closed, view: session.syncView }).toMatchObject({ closed: true, view: { phase: "closed", failure: null } });
      held.resolve();
      expect(await checking).toBe(false);
      expect(reopen).not.toHaveBeenCalled();
      expect(session.syncView).toMatchObject({ phase: "closed", canExecute: false, pending: false, failure: null });
      expect(h.server.calls.filter(row => row.method === "acquire")).toHaveLength(1);
      expect((await h.server.transport(h.scope.accountId).head(h.scope.campaignId)).writerActive).toBe(false);
    } finally { held.resolve(); session.dispose(); }
  });
  it("ignores the deadline and late reply of a check cancelled by a completed close", async () => {
    const h = await playing(), held = deferred();
    h.session.execute({ type: "SET_PAUSED", paused: true, operationId: "paused.before.cancelled-deadline" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await h.session.checkpointNow("purchase")).toBe(true);
    h.server.faults.push({ method: "head", at: "before", wait: held.promise });
    const original = h.server.calls.length;
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    try {
      const checking = h.session.reconnect();
      await vi.waitFor(() => expect(h.server.calls.slice(original).some(row => row.method === "head")).toBe(true));
      expect(await h.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(true);
      await vi.advanceTimersByTimeAsync(CLOUD_CHECK_TIMEOUT_MS + 1);
      expect(await checking).toBe(false);
      expect(h.session.syncView).toMatchObject({ phase: "closed", canExecute: false, pending: false, failure: null });
      held.resolve();
      await vi.advanceTimersByTimeAsync(0);
      expect(h.session.syncView).toMatchObject({ phase: "closed", canExecute: false, pending: false, failure: null });
      expect(h.server.calls.filter(row => row.method === "acquire")).toHaveLength(1);
    } finally { held.resolve(); vi.useRealTimers(); h.session.dispose(); }
  });
});
