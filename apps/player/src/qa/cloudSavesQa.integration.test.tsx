import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IDBFactory, IDBKeyRange } from "fake-indexeddb";
import { QaApp } from "./cloudSavesQa";
import { FakeCloudServer } from "../session/cloud/fakeTransport";
import { CLOUD_RENEW_MS, CloudSyncError, type CloudCommitRequest, type CloudFrozenOperation, type CloudTransport } from "../session/cloud/transport";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { testElementProps } from "../mobile/testDom";
import { CloudGameSession } from "../session/cloud/gameSession";
import { IndexedDbCloudCache, type CloudCacheEntry } from "../session/cloud/cache";
import { cloudCodec, CloudCodecWorker } from "../session/cloud/codecWorker";
import { FakeCloudCodecWorker } from "../session/cloud/codecWorkerTestSupport";
import { deferred, TestCloudClock } from "../session/cloud/syncTestSupport";
import { CloudSyncCoordinator } from "../session/cloud/coordinator";
import { loadCloudEvidenceCheckpoint } from "../session/cloud/codecEvidence";
import { IndexedDbCloudEntryStore } from "../session/cloud/entryStorage";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div>Fixture map</div> }));
vi.mock("../mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Fixture map</div> }));
const codecs: CloudCodecWorker[] = [];
afterEach(async () => { await cleanupPhoneTests(); for (const codec of codecs.splice(0)) codec.dispose(); vi.restoreAllMocks(); });

async function fixture(layout: "phone" | "desktop") {
  const env = phoneTestDom(), values = new Map<string, string>(), server = new FakeCloudServer(), transport = server.transport("qa-account-a");
  const intervals = new Map<number, { callback(): void; ms: number }>(), commits: CloudFrozenOperation[] = [];
  let intervalId = 0, unavailable = false;
  const holds = new Map<string, Promise<void>>();
  // Include native structured cloning, not just the pure inline codec. The
  // guarded account runtime contains proxies that cannot cross postMessage.
  const worker = new FakeCloudCodecWorker(), codec = new CloudCodecWorker(() => worker); worker.release(); codecs.push(codec);
  vi.spyOn(cloudCodec, "run").mockImplementation(task => codec.run(task));
  vi.stubGlobal("indexedDB", new IDBFactory()); vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  Object.assign(env.browser.location, { search: `?layout=${layout}&prototype-tools=0&account=qa-account-a&device-campaigns=1`,
    origin: "http://127.0.0.1:5184", href: `http://127.0.0.1:5184/cloud-saves-qa.html?layout=${layout}` });
  vi.stubGlobal("location", env.browser.location);
  vi.stubGlobal("navigator", { onLine: true });
  Object.assign(env.doc, { visibilityState: "visible" });
  Object.assign(env.browser, { setInterval: (callback: () => void, ms: number) => { const id = ++intervalId; intervals.set(id, { callback, ms }); return id; },
    clearInterval: vi.fn((id: number) => intervals.delete(id)),
    localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key), key: (index: number) => [...values.keys()][index] ?? null, get length() { return values.size; } } });
  const browser = env.browser as unknown as Window;
  browser.__cloudQaAuthenticate = async () => {};
  browser.__cloudQaCall = async (_account, method, args) => {
    if (method === "commit") commits.push(structuredClone(args[0] as CloudFrozenOperation));
    if (unavailable) return { error: { code: "network" } };
    await holds.get(method);
    // A browser binding and its remote response cross task boundaries. Do not
    // collapse admission, list publication and IDB work into one act commit.
    await new Promise<void>(resolve => setImmediate(resolve));
    try { return { value: await (transport[method as keyof CloudTransport] as (...args: unknown[]) => Promise<unknown>)(...args) }; }
    catch (error) { return { error: { code: error instanceof CloudSyncError ? error.code : "network" } }; }
  };
  await env.render(<QaApp />);
  await vi.waitFor(async () => { await act(async () => {}); expect(env.button("Resume Synthetic clinic 1").attributes.disabled).toBeUndefined(); }, { timeout: 5_000 });
  await env.click("Resume Synthetic clinic 1");
  const playing = () => vi.waitFor(async () => { await act(async () => {});
    expect(browser.__cloudQa?.status()).toMatchObject({ hasState: true, canExecute: true, failure: null, needsReload: false });
  }, { timeout: 5_000 });
  await playing();
  await vi.waitFor(async () => { await act(async () => {}); expect(browser.__cloudQa?.status().pending).toBe(false); });
  return { env, server, browser, playing, intervals, commits, hold: (method: string, wait: Promise<void>) => { holds.set(method, wait); }, unavailable: (value: boolean) => { unavailable = value; } };
}

describe.each(["phone", "desktop"] as const)("%s actual disposable QA entry", layout => {
  it("keeps standalone focus bursts cheap and checkpoints a hidden/pagehide/freeze boundary only once", async () => {
    const clock = new TestCloudClock(); vi.spyOn(Date, "now").mockImplementation(clock.wallNow); vi.spyOn(performance, "now").mockImplementation(clock.monotonicNow);
    const f = await fixture(layout), qa = () => f.browser.__cloudQa!;
    await act(async () => { expect(await qa().command({ type: "SET_SIMULATION_SPEED", speed: 2 })).toBe(true); });
    const scans = vi.spyOn(IndexedDbCloudCache.prototype, "accountEntries"), writes = vi.spyOn(IndexedDbCloudCache.prototype, "write"), codec = vi.spyOn(cloudCodec, "run");
    const reconnect = vi.spyOn(CloudGameSession.prototype, "reconnect"); codec.mockClear();
    const count = f.server.operationCount("qa-account-a"), calls = f.server.calls.length;
    await act(async () => {
      for (let i = 0; i < 30; i++) {
        f.env.browser.dispatchEvent(new Event("focus")); f.env.browser.dispatchEvent(new Event("pageshow"));
        f.env.doc.dispatchEvent(new Event("resume")); f.env.doc.dispatchEvent(new Event("visibilitychange"));
      }
    });
    expect(f.server.calls).toHaveLength(calls); expect(scans).not.toHaveBeenCalled(); expect(writes).not.toHaveBeenCalled(); expect(codec).not.toHaveBeenCalled(); expect(reconnect).not.toHaveBeenCalled();
    await act(async () => {
      Object.assign(f.env.doc, { visibilityState: "hidden" }); f.env.doc.dispatchEvent(new Event("visibilitychange"));
      f.env.browser.dispatchEvent(new Event("pagehide")); f.env.doc.dispatchEvent(new Event("freeze"));
    });
    await vi.waitFor(async () => { await act(async () => {}); expect(qa().status().pending).toBe(false); });
    expect(f.server.operationCount("qa-account-a")).toBe(count + 1);
    codec.mockClear(); scans.mockClear(); writes.mockClear();
    clock.advance(10_000);
    await act(async () => {
      Object.assign(f.env.doc, { visibilityState: "visible" }); f.env.doc.dispatchEvent(new Event("visibilitychange"));
      f.env.browser.dispatchEvent(new Event("focus")); f.env.browser.dispatchEvent(new Event("pageshow")); f.env.doc.dispatchEvent(new Event("resume"));
    });
    await f.playing();
    await vi.waitFor(() => expect(f.server.calls.at(-1)?.method).toBe("renew"));
    expect(codec).not.toHaveBeenCalled(); expect(scans).not.toHaveBeenCalled(); expect(writes).not.toHaveBeenCalled(); expect(reconnect).not.toHaveBeenCalled();
    expect(f.server.operationCount("qa-account-a")).toBe(count + 1);
  });

  it.each([false, true])("shows an immediate fence only for an expired lease=%s while foreground transport takes 20 seconds", async expired => {
    const clock = new TestCloudClock(); vi.spyOn(Date, "now").mockImplementation(clock.wallNow); vi.spyOn(performance, "now").mockImplementation(clock.monotonicNow);
    const f = await fixture(layout), qa = () => f.browser.__cloudQa!;
    await act(async () => { expect(await qa().command({ type: "SET_PAUSED", paused: false })).toBe(true); });
    // A normal hidden checkpoint finishes first, then iOS suspends its monotonic
    // clock. This also exercises the phone's real visible status presentation.
    await act(async () => { Object.assign(f.env.doc, { visibilityState: "hidden" }); f.env.doc.dispatchEvent(new Event("visibilitychange")); });
    await vi.waitFor(async () => { await act(async () => {}); expect(qa().status().pending).toBe(false); });
    const gate = deferred(); f.hold("head", gate.promise);
    let checked = false, checking!: Promise<boolean>;
    clock.wall += expired ? 65_000 : 10_000;
    await act(async () => {
      Object.assign(f.env.doc, { visibilityState: "visible" }); f.env.browser.dispatchEvent(new Event("focus"));
      checking = qa().foreground().then(ok => { checked = true; return ok; });
    });
    const notices = () => allElements(f.env.doc.body, node => node.attributes["aria-label"] === "Clinic status");
    try {
      expect(checked).toBe(false);
      if (expired) {
        expect(qa().status().canExecute).toBe(false); expect(qa().snapshot().state!.paused).toBe(true);
        expect(notices()).toHaveLength(1); expect(notices()[0]!.textContent).toContain("Your clinic needs a connection check to continue.");
        expect(allElements(notices()[0]!, node => node.tagName === "BUTTON").map(node => node.textContent)).toEqual(["Retry"]);
      } else {
        expect(qa().status().canExecute).toBe(true); expect(qa().snapshot().state!.paused).toBe(false); expect(notices()).toHaveLength(0);
      }
      clock.advance(20_000);
      const tick = qa().snapshot().state!.facilityTick;
      // No visible visibilitychange was sent above: focus must refresh the
      // hook's visible flag, otherwise its real tick timer stays stopped.
      await act(async () => { for (const timer of [...f.intervals.values()]) if (timer.ms < 60_000) timer.callback(); });
      expect(qa().snapshot().state!.facilityTick).toBe(tick + (expired ? 0 : 1));
      await act(async () => { expect(await qa().command({ type: "ADVANCE_TICK" })).toBe(!expired); });
      expect(qa().snapshot().state!.facilityTick).toBe(tick + (expired ? 0 : 2));
      expect(checked).toBe(false);
    } finally { gate.resolve(); }
    await act(async () => { expect(await checking).toBe(true); });
    await f.playing(); expect(notices()).toHaveLength(0);
  });

  it("uploads offline progress once and keeps its unsubmitted frozen ancestor locally without an account archive", async () => {
    const clock = new TestCloudClock(); vi.spyOn(Date, "now").mockImplementation(clock.wallNow); vi.spyOn(performance, "now").mockImplementation(clock.monotonicNow);
    const f = await fixture(layout), qa = () => f.browser.__cloudQa!, id = qa().snapshot().state!.campaignId;
    const initial = structuredClone(f.server.account("qa-account-a").campaigns.get(id)!.confirmed);
    f.unavailable(true);
    await act(async () => { expect(await qa().command({ type: "SET_SIMULATION_SPEED", speed: 2 })).toBe(true); expect(await qa().checkpoint()).toBe(false); });
    const frozen = structuredClone(f.commits.at(-1)!);
    await act(async () => { await qa().checkAuthority(); });
    await act(async () => { expect(await qa().command({ type: "ADVANCE_TICK" })).toBe(false); });
    await act(async () => { await qa().focus(); }); // Same reconnect action as the visible Retry button.
    await vi.waitFor(async () => { await act(async () => {}); expect(qa().status()).toMatchObject({ canExecute: true, pending: true, failure: "network" }); });
    await act(async () => { expect(await qa().command({ type: "SET_SIMULATION_SPEED", speed: 4 })).toBe(true); });
    const newest = qa().snapshot().state!;
    expect(newest.paused).toBe(true); expect(f.server.operationCount("qa-account-a")).toBe(1);
    f.unavailable(false); clock.advance(CLOUD_RENEW_MS);
    const pulse = vi.spyOn(CloudSyncCoordinator.prototype, "pulse");
    await act(async () => { for (const timer of [...f.intervals.values()]) timer.callback(); await Promise.all(pulse.mock.results.map(result => result.value)); });
    await f.playing();
    await vi.waitFor(async () => { await act(async () => {}); expect(qa().status().pending).toBe(false); });
    const unique = new Map<string, CloudFrozenOperation>();
    for (const attempt of f.commits) {
      if (unique.has(attempt.operationId)) expect(attempt).toEqual(unique.get(attempt.operationId));
      else unique.set(attempt.operationId, attempt);
    }
    expect(unique.get(frozen.operationId)).toEqual(frozen); expect(unique.size).toBe(2);
    const requests = [...unique.values()].map(operation => JSON.parse(operation.requestText) as CloudCommitRequest)
      .sort((a, b) => Number(BigInt(a.expectedRevision) - BigInt(b.expectedRevision)));
    const speeds: number[] = [];
    for (const request of requests) {
      expect(request.expectedRevision).toBe("1"); expect(request.evidence.fromRecord).toBe(initial.evidence.records.length);
      const records = [...initial.evidence.records, ...request.evidence.records]; expect(request.evidence.toRecord).toBe(records.length);
      const loaded = await loadCloudEvidenceCheckpoint({ ...initial, snapshot: request.snapshot,
        evidence: { header: initial.evidence.header, records }, revision: "2", expectedRevision: "2",
        expectedCampaignId: id, expectedBaselineId: initial.baselineId }); speeds.push(loaded.state.simulationSpeed);
      expect(new Set(records.map(row => row.id)).size).toBe(records.length);
    }
    expect(speeds).toEqual([2, 4]);
    expect(qa().snapshot().state).toEqual(newest); expect(f.server.usageCount("qa-account-a")).toBe(0);
    const journals = await new IndexedDbCloudEntryStore({ backendId: "disposable-fake-cloud-qa", accountId: "qa-account-a" }).entries();
    const retained = journals.map(row => (row.value as { device?: CloudCacheEntry })?.device?.recovery?.inFlight)
      .find(operation => operation?.operationId === frozen.operationId);
    expect(retained).toEqual(frozen);
    // A third operation was an import of the speed-2 ancestor as an archived
    // campaign, not a replay or cadence checkpoint. The speed-4 copy includes it.
    expect(f.server.operationCount("qa-account-a")).toBe(2);
    expect(f.server.account("qa-account-a").campaigns.size).toBe(1);
    expect([...f.server.account("qa-account-a").operations.values()].map(row => row.receipt.revision)).toEqual(["1", "2"]);
    const account = f.server.account("qa-account-a").campaigns.get(id)!.confirmed;
    expect(account.snapshot.uncompressedSha256).toBe(requests[1]!.snapshot.uncompressedSha256);
    expect(f.server.account("qa-account-a").operations.has(frozen.operationId)).toBe(false);
    clock.advance(CLOUD_RENEW_MS); pulse.mockClear();
    await act(async () => { for (const timer of [...f.intervals.values()]) timer.callback(); await Promise.all(pulse.mock.results.map(result => result.value)); });
    expect(f.server.operationCount("qa-account-a")).toBe(2); expect(qa().snapshot().state).toEqual(newest);
  });
  it("rejects a QA handle replaced during reconnect, and atomically prepares a durably paused copy that stays paused on reopen", async () => {
    const f = await fixture(layout), stale = f.browser.__cloudQa!;
    await act(async () => { expect(await stale.command({ type: "SET_PAUSED", paused: false })).toBe(true); });
    f.unavailable(true);
    await act(async () => { await stale.focus(); });
    await vi.waitFor(async () => { await act(async () => {}); expect(f.browser.__cloudQa!.status()).toMatchObject({ canExecute: true, failure: "network" }); });
    // The former e2e helper captured this handle, ignored a refused final
    // pause, and could mistake its fenced UI overlay for a persisted pause.
    await act(async () => { expect(await stale.command({ type: "SET_PAUSED", paused: true })).toBe(false); });
    expect(stale.snapshot().state!.paused).toBe(true); expect(f.browser.__cloudQa!.snapshot().state!.paused).toBe(false);
    const apparentWinner = stale.snapshot().state!;
    // This is legitimate running play, despite the former owner's UI overlay.
    await act(async () => { for (const timer of [...f.intervals.values()]) timer.callback(); await f.browser.__cloudQa!.commands([]); });
    expect(f.browser.__cloudQa!.snapshot().state!.facilityTick).toBe(apparentWinner.facilityTick + 1);
    const tick = f.browser.__cloudQa!.snapshot().state!.facilityTick;
    let saved: ReturnType<typeof stale.snapshot>["state"] = null;
    await act(async () => { saved = await f.browser.__cloudQa!.commands([
      { type: "SET_SIMULATION_SPEED", speed: 4 }, { type: "SET_PAUSED", paused: false },
      ...Array.from({ length: 3 }, (_, index) => ({ type: "ADVANCE_TICK" as const, advancedAtRealMs: index })),
      { type: "SET_PAUSED", paused: true },
    ]); });
    expect(saved).not.toBeNull(); expect(saved).toMatchObject({ paused: true, facilityTick: tick + 3, simulationSpeed: 4 });
    f.unavailable(false);
    await f.env.render(null); await f.env.render(<QaApp />); await f.playing();
    expect(f.browser.__cloudQa!.snapshot().state).toEqual(saved);
    const pulse = vi.spyOn(CloudSyncCoordinator.prototype, "pulse");
    await act(async () => { for (const timer of [...f.intervals.values()]) timer.callback(); await Promise.all(pulse.mock.results.map(result => result.value)); });
    expect(f.browser.__cloudQa!.snapshot().state).toEqual(saved);
  });
  it.each([
    [() => new DOMException("private checkpoint bytes", "DataCloneError"), "codec", "worker_data_clone"],
    [() => new TypeError("private checkpoint bytes"), "unexpected", "type_error"],
  ] as const)("classifies an unexpected copy-opening failure and permits retry (%#)", async (failure, kind, code) => {
    const f = await fixture(layout), entries = vi.spyOn(IndexedDbCloudCache.prototype, "accountEntries").mockRejectedValue(failure());
    await f.env.render(null); await f.env.render(<QaApp />);
    await vi.waitFor(async () => { await act(async () => {});
      expect(f.browser.__cloudQa?.status().openingFailure).toEqual({ stage: "copies", kind, code });
    });
    expect(f.browser.__cloudQa!.status().hasState).toBe(false);
    expect(f.env.element.textContent).toContain("Your saved copies have been kept");
    entries.mockRestore();
    await vi.waitFor(async () => { await act(async () => {}); expect(f.env.button("Resume Synthetic clinic 1").attributes.disabled).toBeUndefined(); });
    await f.env.click("Resume Synthetic clinic 1"); await f.playing();
    expect(f.browser.__cloudQa!.status().openingFailure).toBeNull();
  });
  it("classifies a failed automatic open without exposing saved bytes and clears the diagnostic on successful manual retry", async () => {
    const f = await fixture(layout);
    f.server.faults.push({ method: "load", at: "before", error: new CloudSyncError("protocol") });
    await f.env.render(null); await f.env.render(<QaApp />);
    await vi.waitFor(async () => { await act(async () => {});
      expect(f.browser.__cloudQa?.status().openingFailure).toEqual({ stage: "copies", kind: "sync", code: "protocol" });
    });
    expect(f.browser.__cloudQa!.status().hasState).toBe(false);
    await vi.waitFor(async () => { await act(async () => {}); expect(f.env.button("Resume Synthetic clinic 1").attributes.disabled).toBeUndefined(); });
    await f.env.click("Resume Synthetic clinic 1"); await f.playing();
    expect(f.browser.__cloudQa!.status().openingFailure).toBeNull();
  });

  it.each([false, true])("a fresh app instance reopens its last clinic and uploads (Save & Close=%s)", async closeFirst => {
    const f = await fixture(layout);
    await act(async () => { expect(await f.browser.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 })).toBe(true); });
    if (closeFirst) {
      await f.env.click("Save & Close");
      await vi.waitFor(async () => { await act(async () => {}); expect(f.browser.__cloudQa?.status().phase).toBe("closed"); });
    }
    const expected = f.browser.__cloudQa!.snapshot().state;
    await f.env.render(null); await f.env.render(<QaApp />);
    // No Resume, Retry, Open here, or campaign-list interaction on relaunch.
    await f.playing();
    expect(f.browser.__cloudQa!.snapshot().state).toEqual(expected);
    await vi.waitFor(async () => { await act(async () => {}); expect(f.browser.__cloudQa!.status().pending).toBe(false); });
    expect(allElements(f.env.doc.body, node => node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
    expect(f.server.usageCount("qa-account-a")).toBe(0);
  });

  it("keeps an explicit campaign-screen choice across a fresh app instance, until manual Resume", async () => {
    const f = await fixture(layout);
    if (layout === "phone") await f.env.click("More clinic options");
    await f.env.click("Account campaign screen");
    await vi.waitFor(async () => { await act(async () => {}); expect(f.env.button("Resume Synthetic clinic 1").attributes.disabled).toBeUndefined(); });
    await f.env.render(null); await f.env.render(<QaApp />);
    await vi.waitFor(async () => { await act(async () => {}); expect(f.env.button("Resume Synthetic clinic 1").attributes.disabled).toBeUndefined(); });
    expect(f.browser.__cloudQa!.status().hasState).toBe(false);
    await f.env.click("Resume Synthetic clinic 1"); await f.playing();
  });

  it("automatically resumes its newer retained projection and confirms it without closing", async () => {
    const f = await fixture(layout), close = vi.spyOn(CloudGameSession.prototype, "saveAndClose");
    await act(async () => { expect(await f.browser.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 })).toBe(true); });
    const expected = f.browser.__cloudQa!.snapshot().state;
    await act(async () => { await f.browser.__cloudQa!.retainAndReopenOlderCache(); });
    await f.playing();
    expect(f.browser.__cloudQa!.snapshot().state).toEqual(expected);
    await vi.waitFor(async () => { await act(async () => {}); expect(f.browser.__cloudQa!.status().pending).toBe(false); });
    expect(close).not.toHaveBeenCalled();
    expect(allElements(f.env.doc.body, node => node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
  });

  it("offers one Open here action after dismissing Save & Close in the current document", async () => {
    const f = await fixture(layout);
    await f.env.click("Save & Close");
    await vi.waitFor(async () => { await act(async () => {}); expect(f.env.element.textContent).toContain("Safe to close this tab"); });
    await f.env.click("Not now");
    const notices = allElements(f.env.doc.body, node => node.attributes["aria-label"] === "Clinic status");
    expect(notices).toHaveLength(1);
    const buttons = allElements(notices[0]!, node => node.tagName === "BUTTON");
    expect(buttons.map(button => button.textContent)).toEqual(["Open here"]);
    await f.env.clickElement(buttons[0]!); await f.playing();
  });

  it("automatically reopens Save & Close when the suspended app foregrounds, without a fresh document", async () => {
    const f = await fixture(layout);
    await f.env.click("Save & Close");
    await vi.waitFor(async () => { await act(async () => {}); expect(f.browser.__cloudQa?.status().phase).toBe("closed"); });
    const oldCloseLease = f.browser.__cloudQa!.closeLease;
    const expected = f.browser.__cloudQa!.snapshot().state;
    await act(async () => {
      Object.assign(f.env.doc, { visibilityState: "hidden" }); f.env.doc.dispatchEvent(new Event("visibilitychange"));
      Object.assign(f.env.doc, { visibilityState: "visible" }); f.env.doc.dispatchEvent(new Event("visibilitychange"));
      f.env.browser.dispatchEvent(new Event("pageshow")); f.env.doc.dispatchEvent(new Event("resume"));
    });
    await f.playing();
    expect(f.browser.__cloudQa!.snapshot().state).toEqual(expected);
    expect(await oldCloseLease()).toBe(false); // Old document owner cannot release the new lease.
    expect(allElements(f.env.doc.body, node => node.attributes.class?.includes("cloud-dialog") === true)).toHaveLength(0);
  });

  it("exports a verified prior revision through the rendered account menu after a focus event", async () => {
    const f = await fixture(layout);
    await act(async () => {
      await f.browser.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 });
      expect(await f.browser.__cloudQa!.checkpoint()).toBe(true);
    });
    const id = f.browser.__cloudQa!.snapshot().state!.campaignId, row = f.server.account("qa-account-a").campaigns.get(id)!;
    const prior = structuredClone(row.prior!);
    await f.env.click("Save & Close");
    await vi.waitFor(async () => { await act(async () => {}); expect(f.browser.__cloudQa!.status().phase).toBe("closed"); });
    row.confirmed = { ...row.confirmed, snapshot: { ...row.confirmed.snapshot, uncompressedSha256: "0".repeat(64) } };
    const corrupt = structuredClone(row.confirmed), operationCount = f.server.operationCount("qa-account-a");
    // Retain this context's valid same-revision cache as well. It must remain
    // protected, but cannot mask the corrupt account head or prevent recovery.
    await f.env.render(null); await f.env.render(<QaApp />);
    await vi.waitFor(async () => { await act(async () => {}); expect(f.browser.__cloudQa?.status()).toMatchObject({ phase: "readonly", failure: "prior-recovery", canExecute: false }); }, { timeout: 2_000 });
    const reads = f.server.calls.length;
    await act(async () => { f.env.browser.dispatchEvent(new Event("focus")); });
    expect(f.server.calls).toHaveLength(reads);
    if (layout === "phone") await f.env.click("More clinic options");
    const menus = allElements(f.env.doc.body, node => node.tagName === "DETAILS" && node.attributes.class?.split(" ").includes("cloud-account") === true);
    expect(menus).toHaveLength(1);
    // Direct child summary: Older copies has its own nested disclosure.
    expect(menus[0]!.childNodes.filter(node => node.tagName === "SUMMARY").map(node => node.textContent)).toEqual(["Account & privacy"]);
    let exported: Blob | null = null;
    vi.spyOn(URL, "createObjectURL").mockImplementation(blob => { exported = blob as Blob; return "blob:verified-recovery"; });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const create = f.env.doc.createElement.bind(f.env.doc), clicked = vi.fn();
    vi.spyOn(f.env.doc, "createElement").mockImplementation(name => {
      const element = create(name); if (name === "a") Object.assign(element, { click: clicked }); return element;
    });
    const download = allElements(menus[0]!, node => node.tagName === "BUTTON" && node.textContent === "Download device recovery copy")[0]!;
    await act(async () => { await (testElementProps(download).onClick as () => Promise<void>)(); });
    await vi.waitFor(async () => { await act(async () => {}); expect(clicked).toHaveBeenCalledOnce(); });
    expect(await (exported as Blob | null)?.text()).toContain(prior.snapshot.uncompressedSha256);
    expect(f.browser.__cloudQa!.status()).toMatchObject({ phase: "readonly", failure: "prior-recovery", canExecute: false });
    expect(row.confirmed).toEqual(corrupt); expect(row.prior).toEqual(prior); expect(f.server.operationCount("qa-account-a")).toBe(operationCount);
  });
});
