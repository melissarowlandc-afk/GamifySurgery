import { describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { CloudGameSession } from "./gameSession";
import { CloudSyncError, CLOUD_LEASE_MS, CLOUD_RENEW_MS } from "./transport";
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
  it.each(["foreground-rejection", "foreground-receipt", "heartbeat-head"] as const)(
    "stays playable when an own save overtakes a %s response", async timing => {
      const h = await playing(), held = deferred(), receipt = deferred();
      const initialExpiry = h.clock.wall + CLOUD_LEASE_MS;
      const first = { type: "SET_SIMULATION_SPEED", speed: 2, operationId: "during.check.first" } as const;
      const second = { type: "SET_SIMULATION_SPEED", speed: 4, operationId: "during.check.second" } as const;
      const heartbeat = timing === "heartbeat-head";
      const failed: string[] = [];
      const unsubscribe = h.coordinator.subscribe(() => {
        const { failure } = h.coordinator.view;
        if (failure) failed.push(failure);
      });
      let saving: Promise<boolean> | undefined;
      let checking: Promise<unknown> | undefined;
      try {
        if (heartbeat) {
          h.session.execute(first, PROTOTYPE_DOMAIN_CONTEXT);
          h.server.faults.push({ method: "commit", at: "after", wait: receipt.promise });
          saving = h.session.checkpointNow("purchase");
          await vi.waitFor(() => expect(h.server.operationCount(h.scope.accountId)).toBe(1));
          h.server.faults.push({ method: "renew", at: "before", error: new CloudSyncError("revision") });
          h.server.faults.push({ method: "head", at: "after", wait: held.promise });
          h.clock.advance(CLOUD_RENEW_MS);
          checking = h.session.pulse();
          await vi.waitFor(() => expect(h.server.faults).toHaveLength(0));
          receipt.resolve();
          expect(await saving).toBe(true);
        } else {
          h.coordinator.markBackground();
          h.clock.advance(10_000);
          h.server.faults.push(timing === "foreground-rejection"
            ? { method: "renew", at: "before", wait: held.promise, error: new CloudSyncError("revision") }
            : { method: "renew", at: "after", wait: held.promise });
          checking = h.session.foreground();
          await vi.waitFor(() => expect(h.server.faults).toHaveLength(0));
        }
        expect(h.session.execute(second, PROTOTYPE_DOMAIN_CONTEXT)?.operationReceipts[second.operationId]?.status).toBe("applied");
        expect(await h.session.checkpointNow("purchase")).toBe(true);
        const revision = heartbeat ? "3" : "2";
        expect(h.coordinator.confirmedRevision).toBe(revision);
        held.resolve();
        await checking;
        while (h.clock.wall <= initialExpiry) {
          h.clock.advance(CLOUD_RENEW_MS);
          await h.session.pulse();
        }
        expect(h.session.syncView).toMatchObject({ revision, failure: null, pending: false, canExecute: true });
        expect(failed).toEqual([]);
        expect(h.server.calls.filter(call => call.method === "acquire")).toHaveLength(1);
        expect(h.server.operationCount(h.scope.accountId)).toBe(heartbeat ? 2 : 1);
      } finally {
        held.resolve(); receipt.resolve(); await Promise.allSettled([saving, checking]);
        unsubscribe(); h.session.dispose();
      }
    },
  );

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
