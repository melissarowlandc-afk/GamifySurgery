import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { LoadingFlow } from "./loadingFlow";

const flows: LoadingFlow[] = [];
const flow = (boot = true) => { const value = new LoadingFlow(boot); flows.push(value); return value; };
beforeEach(() => vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] }));
afterEach(() => { flows.forEach(row => row.dispose()); flows.length = 0; vi.useRealTimers(); });

it("does not erase a real preparation failure when independent art/frame work advances", async () => {
  const value = flow(), retry = vi.fn();
  value.request("journal", { active: true, phase: "hydrate", status: "Preparing", failure: "Device saving could not start.", onRetry: retry });
  value.advance("frame");
  expect(value.getSnapshot()).toMatchObject({ failure: "Device saving could not start.", selectedId: "journal", canRetry: true });
  await vi.advanceTimersByTimeAsync(30_000);
  expect(value.getSnapshot().failure).toBe("Device saving could not start.");
  value.retry(); expect(retry).toHaveBeenCalledOnce();
});

it("holds one continuous opening through auth, access, selection and hydration render gaps", async () => {
  const value = flow(), snapshots = [value.getSnapshot()]; value.subscribe(() => snapshots.push(value.getSnapshot()));
  for (const phase of ["auth", "access", "selection", "copies", "hydrate", "art", "frame"] as const) {
    value.request("branch", { active: true, status: phase, phase });
    value.remove("branch"); await Promise.resolve();
    expect(value.getSnapshot().active).toBe(true); expect(value.getSnapshot().progress).toBeLessThan(100);
  }
  value.rest("actual-ready-frame", true); await Promise.resolve();
  expect(value.getSnapshot()).toMatchObject({ active: false, visible: false, progress: 100, epoch: 0 });
  const values = snapshots.map(row => row.progress); expect(values).toEqual([...values].sort((a, b) => a - b));
});

it("coalesces branch cleanup/registration and never exposes a stale ready clinic", async () => {
  const value = flow();
  value.request("opening", { active: true, status: "Opening", phase: "hydrate" });
  value.rest("old-clinic", true); value.remove("opening");
  value.request("new-clinic-frame", { active: true, status: "Artwork", phase: "art" });
  value.rest("old-clinic", false); await Promise.resolve();
  expect(value.getSnapshot()).toMatchObject({ active: true, progress: 92, visible: true });
  value.remove("new-clinic-frame"); value.rest("new-clinic", true); await Promise.resolve();
  expect(value.getSnapshot().active).toBe(false);
});

it("never rewinds on late stages, retries or a post-open upload", () => {
  const value = flow(), retry = vi.fn();
  value.request("open", { active: true, status: "Opening", phase: "hydrate", failure: "Failed", onRetry: retry });
  const progress = value.getSnapshot().progress;
  value.request("old-auth", { active: true, status: "Connecting", phase: "auth" });
  value.retry(); expect(retry).toHaveBeenCalledOnce();
  expect(value.getSnapshot().progress).toBe(progress);
  value.advance("engine", true); expect(value.getSnapshot().progress).toBe(91);
});

it("debounces a short in-play check but starts a submitted sign-in immediately", async () => {
  const value = flow(false);
  value.request("resume", { active: true, status: "Checking", phase: "copies" });
  expect(value.getSnapshot().visible).toBe(false);
  value.remove("resume"); value.rest("clinic", true); await Promise.resolve();
  await vi.advanceTimersByTimeAsync(500); expect(value.getSnapshot().visible).toBe(false);
  value.begin("auth"); expect(value.getSnapshot()).toMatchObject({ visible: true, phase: "auth", epoch: 2 });
});

it("surfaces a bounded failure and advances only when real work progresses", async () => {
  const value = flow();
  value.request("access", { active: true, status: "Account", phase: "access" });
  await vi.advanceTimersByTimeAsync(30_000);
  expect(value.getSnapshot()).toMatchObject({ timedOut: true, visible: true });
  expect(value.getSnapshot().progress).toBe(20);
  value.advance("copies"); expect(value.getSnapshot()).toMatchObject({ timedOut: false, failure: null, progress: 40 });
});
