import { afterEach, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { operationalSessionFixture } from "./operationalSessionTestSupport";
import { CloudCodecError } from "./codecJson";
import { CloudSyncError } from "./transport";
import { prepareJournal } from "./journalCodec";
import { cloudCampaignStorageKey } from "../accountStorageKey";
import { cloudStatusText } from "../../ui/CloudSaveControls";
import { syncHarness } from "./syncTestSupport";

afterEach(() => vi.restoreAllMocks());
async function fixture() {
  const f = await operationalSessionFixture();
  const run = f.coordinator.codec.run.bind(f.coordinator.codec);
  const control = { capacity: true };
  vi.spyOn(f.coordinator.codec, "run").mockImplementation(task => {
    if (control.capacity && task.kind === "journalWarm") return Promise.reject(new CloudCodecError("capacity", "Synthetic snapshot limit."));
    return run(task);
  });
  return { ...f, control };
}

it("keeps durable journal play and exact local recovery after a derived cloud snapshot exceeds capacity", async () => {
  const f = await fixture();
  try {
    await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "capacity.before" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(true);
    expect(await f.session.checkpointNow("purchase")).toBe(false);
    expect(f.coordinator.view).toMatchObject({ phase: "ready", failure: "capacity", canExecute: true, localDurable: true });
    expect(cloudStatusText(f.session.syncView)).toBe("This clinic has reached the cloud save size limit. Progress is saving on this device.");
    const current = await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 4, operationId: "capacity.after" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(current).not.toBeNull(); expect(await f.session.durable()).toBe(true);
    const recovered = await prepareJournal(f.cache.journal!, cloudCampaignStorageKey(f.scope), f.coordinator.codec, { local: true, encode: false });
    expect(JSON.stringify(recovered!.state)).toBe(JSON.stringify(current));
    expect(f.server.operationCount(f.scope.accountId)).toBe(0);
    f.clock.advance(20_000); await f.coordinator.pulse();
    expect(f.coordinator.view).toMatchObject({ failure: "capacity", canExecute: true });
    f.control.capacity = false;
    expect(await f.session.checkpointNow("purchase")).toBe(true);
    expect(f.coordinator.view.failure).toBeNull();
  } finally { f.session.dispose(); }
});

it("Save & Close never claims cloud confirmation at capacity and the local clinic remains available", async () => {
  const f = await fixture();
  try {
    await f.session.executeAsync({ type: "SET_SIMULATION_SPEED", speed: 2, operationId: "capacity.close" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(true);
    expect(await f.session.saveAndClose(PROTOTYPE_DOMAIN_CONTEXT)).toBe(false);
    expect(f.coordinator.view).toMatchObject({ phase: "ready", failure: "capacity", canExecute: true, localDurable: true });
    expect(f.server.operationCount(f.scope.accountId)).toBe(0);
  } finally { f.session.dispose(); }
});

it("capacity does not bypass writer fencing or an expired lease", async () => {
  const f = await fixture();
  try {
    f.coordinator.reportPreparationFailure(new CloudCodecError("capacity", "Synthetic limit."));
    expect(f.session.canExecute).toBe(true);
    f.coordinator.reportLocalFailure(new CloudSyncError("writer"));
    expect(f.coordinator.view).toMatchObject({ phase: "conflict", failure: "writer", canExecute: false });
    expect(await f.session.executeAsync({ type: "SET_PAUSED", paused: false, operationId: "capacity.fenced" }, PROTOTYPE_DOMAIN_CONTEXT)).toBeNull();
  } finally { f.session.dispose(); }
});

it("keeps an already durable journal playable when the upload path reports capacity", async () => {
  const f = await fixture();
  try {
    await f.session.executeAsync({ type: "SET_PAUSED", paused: false, operationId: "capacity.upload" }, PROTOTYPE_DOMAIN_CONTEXT);
    expect(await f.session.durable()).toBe(true);
    f.coordinator.reportLocalFailure(new CloudSyncError("capacity"));
    expect(f.coordinator.view).toMatchObject({ phase: "ready", failure: "capacity", canExecute: true, localDurable: true });
    f.clock.advance(120_000);
    expect(f.coordinator.view.canExecute).toBe(false);
  } finally { f.session.dispose(); }
});

it("classifies non-journal codec capacity honestly while keeping it fenced", async () => {
  const f = await syncHarness();
  try {
    await f.coordinator.open(); await f.coordinator.startWriter(); f.coordinator.resume();
    f.coordinator.reportLocalFailure(new CloudCodecError("capacity", "Synthetic limit."));
    expect(f.coordinator.view).toMatchObject({ phase: "capacity", failure: "capacity", canExecute: false });
  } finally { f.coordinator.dispose(); }
});
