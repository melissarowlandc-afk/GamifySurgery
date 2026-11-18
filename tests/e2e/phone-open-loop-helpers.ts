import { expect, type Browser, type BrowserContext, type Page } from "@playwright/test";
import type { GameState } from "@gamify-surgery/game-domain";
import type {} from "../../apps/player/src/qa/cloudSavesQa";
import { FakeCloudServer } from "../../apps/player/src/session/cloud/fakeTransport";
import { CLOUD_RENEW_MS, CloudSyncError, type CloudFailureCode, type CloudTransport } from "../../apps/player/src/session/cloud/transport";
import { STORAGE_RETRY_DELAYS_MS } from "../../apps/player/src/session/cloud/storageRetry";
import { CLOUD_QA_STARTUP_WAIT_MS, CLOUD_QA_WAIT_MS, snapshot, status } from "./cloud-qa-helpers";

export type PhoneLoopLayout = "phone" | "desktop";
type RpcMethod = keyof CloudTransport;
export const PHONE_LOOP_ACCOUNT = "qa-account-a";
export const PHONE_LOOP_RETRY_BUDGET_MS = 5 * 60_000;
// runFor executes every due callback, including repeated intervals. Keep the
// fake backend at most one third of the 15 s renew interval ahead: 60 steps
// per unchanged five-minute budget, rather than 1,200 round trips.
const VISIBLE_CLOCK_STEP_MS = CLOUD_RENEW_MS / 3;
const BACKGROUND_PREPARE_MS = Math.min(CLOUD_RENEW_MS, ...STORAGE_RETRY_DELAYS_MS);

export interface PhoneLoopObservation {
  documentId: string;
  origin: string;
  path: string;
  at: number;
  sequence: number;
  monotonicAt: number;
  reason: string;
  campaignId: string | null;
  route: "loading" | "playing" | "entry" | "other";
  phase: string | null;
  accountPhase: string | null;
  entryHeading: string | null;
  failure: string | null;
  hasState: boolean;
  canExecute: boolean;
  pending: boolean;
  afterFirstPlaying: boolean;
  backgroundReturnStarted: boolean;
  loadingVisible: boolean;
  loadingAppearances: number;
  loadingReturns: number;
  reopenAttempts: number;
  operationalWorkers: number;
  newOperationalWorkers: number;
  shellRemoved: boolean;
  unplayableSeen: boolean;
  choiceDialogSeen: boolean;
}

export interface PhoneLoopServerObservation extends PhoneLoopObservation {
  observedServerAt: number;
  observedMonotonicAt: number;
  serverLeaseExpiresAt: number | null;
  serverLeaseExpired: boolean;
}

declare global {
  interface Window {
    __phoneOpenLoop?: {
      documentId: string;
      samples: PhoneLoopObservation[];
      sample(reason: string, force?: boolean): PhoneLoopObservation;
      beginBackgroundReturn(): PhoneLoopObservation;
    };
    __phoneOpenLoopRecord?: (value: PhoneLoopObservation) => Promise<void>;
    __phoneLoopFrozenTimer?: { timer: number; fires: number };
  }
}

/** Observe the real renderer and operational worker, without replacing a game
 * session, shortening a production retry, or writing browser storage. The
 * MutationObserver records DOM commits; the clock-driven sampler also records
 * public QA phases which need not change visible text. Sticky counters retain
 * a brief loader/remount even when the final screenshot looks healthy. */
async function installLoopObservation(page: Page, layout: PhoneLoopLayout, recordObservation: (value: PhoneLoopObservation) => void) {
  await page.exposeBinding("__phoneOpenLoopRecord", (_source, value: PhoneLoopObservation) => { recordObservation(value); });
  await page.addInitScript(({ shellSelector }) => {
    const documentId = crypto.randomUUID();
    const samples: PhoneLoopObservation[] = [];
    let firstPlaying = false, originalShell: Element | null = null, backgroundReturnStarted = false;
    let previouslyLoading = false, previouslyReopening = false;
    let loadingAppearances = 0, loadingReturns = 0, reopenAttempts = 0;
    let operationalWorkers = 0, newOperationalWorkers = 0;
    let shellRemoved = false, unplayableSeen = false, choiceDialogSeen = false;
    let lastSignature = "";
    const visible = (node: Element | null) => Boolean(node && !node.closest("[hidden], [aria-hidden='true']") &&
      node.getClientRects().length && getComputedStyle(node).display !== "none" && getComputedStyle(node).visibility !== "hidden");
    const sample = (reason: string, force = false): PhoneLoopObservation => {
      const view = window.__cloudQa?.status();
      const shell = document.querySelector(shellSelector);
      const loading = [...document.querySelectorAll(".loading-screen, [role='region'][aria-label='Loading clinic']")].some(visible);
      const dialog = [...document.querySelectorAll("dialog[open], [role='dialog']")].some(visible);
      const playable = Boolean(view?.hasState && view.canExecute && visible(shell) && !shell?.closest("[inert]") && !loading);
      const afterFirstPlaying = firstPlaying;
      if (loading && !previouslyLoading) {
        loadingAppearances++;
        if (firstPlaying) loadingReturns++;
      }
      previouslyLoading = loading;
      choiceDialogSeen ||= dialog;
      // A full opening phase is forbidden after play, even if an overlay is
      // dismissed too quickly for a final toBeHidden() assertion to catch it.
      const reopening = loading || ["connecting", "checking", "opening"].includes(view?.phase ?? "");
      if (firstPlaying) {
        if (reopening && !previouslyReopening) reopenAttempts++;
        shellRemoved ||= Boolean(originalShell && (!originalShell.isConnected || shell !== originalShell));
        unplayableSeen ||= Boolean(view && !view.canExecute);
      }
      previouslyReopening = reopening;
      if (!firstPlaying && playable) { firstPlaying = true; originalShell = shell; }
      const row: PhoneLoopObservation = {
        documentId, origin: location.origin, path: location.pathname, at: Date.now(),
        sequence: samples.length, monotonicAt: performance.now(), reason,
        campaignId: window.__cloudQa?.snapshot().state?.campaignId ?? null,
        route: loading ? "loading" : playable ? "playing" : document.querySelector("main[data-entry-state]") ? "entry" : "other",
        phase: view?.phase ?? null, accountPhase: view?.accountPhase ?? null, entryHeading: view?.entryHeading ?? null, failure: view?.failure ?? null,
        hasState: view?.hasState ?? false, canExecute: view?.canExecute ?? false, pending: view?.pending ?? false,
        afterFirstPlaying, backgroundReturnStarted, loadingVisible: loading, loadingAppearances, loadingReturns, reopenAttempts,
        operationalWorkers, newOperationalWorkers, shellRemoved, unplayableSeen, choiceDialogSeen,
      };
      const { at: _at, reason: _reason, sequence: _sequence, monotonicAt: _monotonicAt, ...changing } = row;
      const signature = JSON.stringify(changing);
      if (force || signature !== lastSignature) {
        lastSignature = signature; samples.push(row);
        void window.__phoneOpenLoopRecord?.(row).catch(() => { /* local samples remain available for assertions */ });
      }
      return row;
    };
    window.__phoneOpenLoop = { documentId, samples, sample, beginBackgroundReturn() {
      backgroundReturnStarted = true;
      return sample("background-return-start", true);
    } };
    const NativeWorker = window.Worker;
    window.Worker = class extends NativeWorker {
      constructor(url: string | URL, options?: WorkerOptions) {
        super(url, options);
        // Same public worker URL used by cloud-saves.spec.ts. Codec workers
        // are legitimate background work and are not engine/session reopens.
        if (String(url).includes("operationalEngine.worker")) {
          operationalWorkers++;
          if (firstPlaying) newOperationalWorkers++;
          sample("operational-worker-created", true);
        }
      }
    } as typeof Worker;
    new MutationObserver(records => {
      if (firstPlaying && originalShell) for (const record of records) for (const node of record.removedNodes) {
        if (node === originalShell || node.contains(originalShell)) shellRemoved = true;
      }
      sample("dom-commit");
    }).observe(document, { subtree: true, childList: true, attributes: true, characterData: true });
    for (const event of ["focus", "online", "pageshow"]) window.addEventListener(event, () => sample(event, true));
    document.addEventListener("visibilitychange", () => sample(`visibility:${document.visibilityState}`, true));
    setInterval(() => sample("phase-sample"), 25);
    sample("document-start", true);
  }, { shellSelector: layout === "phone" ? ".mobile-shell" : ".game-shell" });
}

/** Same disposable bridge as cloud-recovery.spec.ts. It lets capabilities and
 * lease handshakes succeed while selected campaign RPCs fail. There is no HTTP
 * cloud endpoint to intercept: all RPCs use the existing exposed QA binding. */
export async function phoneLoopRig(browser: Browser, baseURL: string, layout: PhoneLoopLayout) {
  const origin = new URL(baseURL).origin;
  if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(origin)) throw new Error("Phone-loop QA requires a disposable loopback server.");
  let clockOffsetMs = 0;
  const server = new FakeCloudServer(() => Date.now() + clockOffsetMs);
  server.setAccess(PHONE_LOOP_ACCOUNT, { snapshotSaves: true });
  const transport = server.transport(PHONE_LOOP_ACCOUNT), contexts: BrowserContext[] = [];
  const authenticated = new Map<Page, string | null>();
  const failures = new Map<Page, Map<RpcMethod, CloudFailureCode>>(), unavailable = new Map<Page, CloudFailureCode>();
  const histories = new Map<Page, PhoneLoopServerObservation[]>(), navigations = new Map<Page, number>();
  const deviceNames = new Map<Page, string>();
  const requests: {
    device: string; method: RpcMethod; result: "started" | "success" | CloudFailureCode; at: number; completedAt?: number;
    failureSource?: "auth" | "injected" | "backend";
  }[] = [];
  const clockEvents: {
    event: string; device: string; serverAt: number; realAt: number; browserAt?: number;
    durationMs?: number; stepMs?: number; steps?: number; maxStepSkewMs?: number; requestIndex: number;
  }[] = [];
  const markClock = (tab: Page, event: string, details: Partial<(typeof clockEvents)[number]> = {}) => {
    clockEvents.push({ event, device: deviceNames.get(tab)!, serverAt: server.now(), realAt: Date.now(), requestIndex: requests.length, ...details });
  };
  const browserNow = (tab: Page) => tab.evaluate(() => Date.now());
  const drainRpcs = async (tab: Page) => {
    const pending = () => requests.filter(call => call.device === deviceNames.get(tab) && call.result === "started").length;
    if (pending()) await expect.poll(pending, { timeout: CLOUD_QA_WAIT_MS }).toBe(0);
    // Let the binding reply and the page's promise continuations run before
    // advancing again; an async renewal cannot be left behind the fake server.
    await tab.evaluate(() => Promise.resolve());
  };
  const page = async (device: string, deviceCampaigns = 0, controlledTime = false) => {
    const context = await browser.newContext({
      viewport: layout === "phone" ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
      isMobile: layout === "phone", hasTouch: layout === "phone", acceptDownloads: true,
    });
    contexts.push(context);
    const tab = await context.newPage(), history: PhoneLoopServerObservation[] = [];
    deviceNames.set(tab, device);
    histories.set(tab, history); navigations.set(tab, 0);
    tab.on("framenavigated", frame => { if (frame === tab.mainFrame()) navigations.set(tab, navigations.get(tab)! + 1); });
    if (controlledTime) await tab.clock.install();
    await tab.exposeBinding("__cloudQaAuthenticate", ({ page }, account: string | null) => { authenticated.set(page, account); });
    await tab.exposeBinding("__cloudQaCall", async ({ page }, account: string, method: RpcMethod, args: unknown[]) => {
      const call: (typeof requests)[number] = { device, method, result: "started", at: server.now() };
      requests.push(call);
      const unauthenticated = account !== PHONE_LOOP_ACCOUNT || authenticated.get(page) !== account;
      const failure = unauthenticated ? "auth" :
        unavailable.get(page) ?? failures.get(page)?.get(method);
      if (failure) {
        call.result = failure; call.failureSource = unauthenticated ? "auth" : "injected";
        call.completedAt = server.now(); return { error: { code: failure } };
      }
      try {
        const action = transport[method];
        if (typeof action !== "function" || method === "prepare" || method === "prepareImport") throw new CloudSyncError("protocol");
        const value = await (action as (...args: unknown[]) => Promise<unknown>)(...args);
        call.result = "success"; return { value };
      } catch (error) {
        const code = error instanceof CloudSyncError ? error.code : "network";
        call.result = code; call.failureSource = "backend"; return { error: { code } };
      } finally { call.completedAt = server.now(); }
    });
    await installLoopObservation(tab, layout, value => {
      // Observe the disposable backend's actual lease at receipt of this
      // ordered page notification. Do not infer expiry from a UI error label
      // or leave a once-expired flag true after a fresh lease is acquired.
      const observedServerAt = server.now();
      const campaign = value.campaignId ? server.account(PHONE_LOOP_ACCOUNT).campaigns.get(value.campaignId) : undefined;
      history.push({ ...value, observedServerAt, observedMonotonicAt: performance.now(), serverLeaseExpiresAt: campaign?.expiry ?? null,
        serverLeaseExpired: Boolean(campaign?.token && campaign.expiry <= observedServerAt) });
    });
    await tab.goto(`${baseURL.replace(/\/$/, "")}/cloud-saves-qa.html?layout=${layout}&prototype-tools=0&account=${PHONE_LOOP_ACCOUNT}&device-campaigns=${deviceCampaigns}`);
    await expect.poll(async () => Boolean((await snapshot(tab)).state) ||
      await tab.getByRole("heading", { name: "Your campaigns", exact: true }).isVisible(), { timeout: CLOUD_QA_STARTUP_WAIT_MS }).toBe(true);
    return tab;
  };
  return {
    server, page, requests, histories, navigations, clockEvents,
    async serverTrace(tab: Page) {
      const trace = await loopTrace(tab);
      const currentRows = () => histories.get(tab)!.filter(row => row.documentId === trace.latest.documentId);
      // Match page samples to backend facts by sequence, rather than assuming
      // that a final healthy lease describes an earlier checking projection.
      await expect.poll(() => currentRows().some(row => row.sequence === trace.latest.sequence), { timeout: CLOUD_QA_WAIT_MS }).toBe(true);
      return { ...trace, serverSamples: currentRows().filter(row => row.sequence <= trace.latest.sequence).sort((a, b) => a.sequence - b.sequence) };
    },
    failAll(tab: Page, code: CloudFailureCode | null) { if (code) unavailable.set(tab, code); else unavailable.delete(tab); },
    failMethods(tab: Page, methods: readonly RpcMethod[], code: CloudFailureCode) {
      const map = failures.get(tab) ?? new Map<RpcMethod, CloudFailureCode>();
      for (const method of methods) map.set(method, code);
      failures.set(tab, map);
    },
    recover(tab: Page) { unavailable.delete(tab); failures.delete(tab); markClock(tab, "rpc-recovery-enabled"); },
    async advanceRetryBudget(tab: Page) {
      const before = await browserNow(tab);
      clockOffsetMs = before - Date.now();
      markClock(tab, "visible-advance-start", { browserAt: before, durationMs: PHONE_LOOP_RETRY_BUDGET_MS, stepMs: VISIBLE_CLOCK_STEP_MS });
      let advancedMs = 0, steps = 0, maxStepSkewMs = 0;
      while (advancedMs < PHONE_LOOP_RETRY_BUDGET_MS) {
        const stepMs = Math.min(VISIBLE_CLOCK_STEP_MS, PHONE_LOOP_RETRY_BUDGET_MS - advancedMs);
        const stepStart = await browserNow(tab);
        // The backend leads by at most one small step, rather than five
        // minutes. runFor fires EVERY due timer, including periodic renewals.
        clockOffsetMs = stepStart + stepMs - Date.now();
        maxStepSkewMs = Math.max(maxStepSkewMs, Math.abs(server.now() - stepStart));
        await tab.clock.runFor(stepMs);
        await drainRpcs(tab);
        // runFor consumes real execution time too. Re-align at each boundary
        // so that IPC/worker time cannot accumulate into artificial lease age.
        const stepEnd = await browserNow(tab);
        clockOffsetMs = stepEnd - Date.now();
        advancedMs += stepMs; steps++;
      }
      markClock(tab, "visible-advance-end", {
        browserAt: await browserNow(tab), durationMs: advancedMs, stepMs: VISIBLE_CLOCK_STEP_MS, steps, maxStepSkewMs,
      });
    },
    async backgroundForFiveMinutes(tab: Page) {
      // Freeze timers BEFORE the hidden interval. The tiny preparation step is
      // visible time; the background wall-clock jump remains exactly 5 min.
      const freezeAt = await browserNow(tab) + BACKGROUND_PREPARE_MS;
      clockOffsetMs = freezeAt - Date.now();
      await tab.clock.pauseAt(freezeAt);
      await drainRpcs(tab);
      await tab.evaluate(() => {
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
        Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
        document.dispatchEvent(new Event("visibilitychange"));
        const probe = { timer: 0, fires: 0 };
        probe.timer = window.setInterval(() => { probe.fires++; }, 1_000);
        window.__phoneLoopFrozenTimer = probe;
        window.__phoneOpenLoop!.sample("background-timers-frozen", true);
      });
      const hiddenAt = await browserNow(tab);
      clockOffsetMs = hiddenAt - Date.now();
      markClock(tab, "hidden-start", { browserAt: hiddenAt, durationMs: PHONE_LOOP_RETRY_BUDGET_MS });
      const returnedAt = hiddenAt + PHONE_LOOP_RETRY_BUDGET_MS;
      clockOffsetMs = returnedAt - Date.now();
      // setSystemTime changes wall time without firing queued callbacks. With
      // the clock paused, even the probe/renew/retry intervals remain frozen.
      await tab.clock.setSystemTime(returnedAt);
      // A suspended page cannot run a status sampler. Keep timing/probe
      // evidence here; the first explicit health sample is at return entry.
      // Real DOM observations remain enabled, including while hidden.
      const timerFires = await tab.evaluate(() => window.__phoneLoopFrozenTimer!.fires);
      const observedReturnAt = await browserNow(tab);
      markClock(tab, "hidden-jump-complete", { browserAt: observedReturnAt, durationMs: observedReturnAt - hiddenAt });
      return { hiddenAt, returnedAt: observedReturnAt, timerFires };
    },
    async returnFromBackground(tab: Page) {
      // Establish the boundary before visibility/focus handlers can re-check
      // authority. Re-align after paused IPC so server and page dates agree.
      clockOffsetMs = await browserNow(tab) - Date.now();
      const returnStart = await tab.evaluate(() => {
        const marker = window.__phoneOpenLoop!.beginBackgroundReturn();
        clearInterval(window.__phoneLoopFrozenTimer!.timer);
        delete window.__phoneLoopFrozenTimer;
        Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
        Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
        document.dispatchEvent(new Event("visibilitychange"));
        window.dispatchEvent(new Event("focus"));
        window.__phoneOpenLoop!.sample("background-return-visible", true);
        return marker;
      });
      await tab.clock.resume();
      markClock(tab, "visible-return", { browserAt: await browserNow(tab) });
      await tab.evaluate(async () => { await window.__cloudQa!.foreground(); });
      return returnStart;
    },
    async close() { await Promise.all(contexts.map(context => context.close())); },
  };
}

export async function advanceSyntheticClinic(page: Page, speed: 2 | 4, ticks: number): Promise<GameState> {
  return page.evaluate(async ({ speed, ticks }) => {
    const before = window.__cloudQa!.snapshot().state!.facilityTick;
    const state = await window.__cloudQa!.commands([
      { type: "SET_SIMULATION_SPEED", speed }, { type: "SET_PAUSED", paused: false },
      ...Array.from({ length: ticks }, (_, index) => ({ type: "ADVANCE_TICK" as const, advancedAtRealMs: index })),
      { type: "SET_PAUSED", paused: true },
    ]);
    if (!state || !state.paused || state.facilityTick !== before + ticks) throw new Error("Synthetic journal requires every command accepted, with the clinic paused afterwards.");
    return state;
  }, { speed, ticks });
}

export async function lifecycleBurst(page: Page) {
  await page.evaluate(async () => {
    const qa = window.__cloudQa!;
    for (let i = 0; i < 4; i++) {
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "hidden" });
      document.dispatchEvent(new Event("visibilitychange"));
      Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
      document.dispatchEvent(new Event("visibilitychange"));
      window.dispatchEvent(new Event("focus"));
      window.dispatchEvent(new Event("online"));
    }
    await qa.foreground(); // Drain the same foreground path used by the events.
    window.__phoneOpenLoop!.sample("lifecycle-burst-settled", true);
  });
}

export async function loopTrace(page: Page) {
  return page.evaluate(() => {
    const monitor = window.__phoneOpenLoop!;
    return { latest: monitor.sample("assertion", true), samples: [...monitor.samples] };
  });
}

export async function expectNoReopen(page: Page, layout: PhoneLoopLayout) {
  // Offline-save status is allowed. Unlike expectPlaying(), this assertion
  // deliberately allows that status button while requiring command authority.
  await expect.poll(() => status(page), { timeout: CLOUD_QA_WAIT_MS }).toMatchObject({ hasState: true, canExecute: true, needsReload: false });
  await expect(page.locator(layout === "phone" ? ".mobile-shell" : ".game-shell")).toBeVisible();
  await expect(page.getByRole("region", { name: "Loading clinic", exact: true, includeHidden: true })).toBeHidden();
  const trace = await loopTrace(page);
  expect(trace.samples.some(row => row.route === "playing"), "The observer must have seen the real clinic before guarding reopens").toBe(true);
  expect(trace.latest.operationalWorkers, "A real operational engine worker must have been observed").toBeGreaterThan(0);
  expect(trace.latest, "Owner symptom: a final healthy screen must not conceal a prior loading/offline/loading cycle").toMatchObject({
    loadingReturns: 0, reopenAttempts: 0, newOperationalWorkers: 0, shellRemoved: false, unplayableSeen: false, choiceDialogSeen: false,
  });
  expect(trace.samples.filter(row => row.afterFirstPlaying && (row.loadingVisible || ["connecting", "checking", "opening"].includes(row.phase ?? ""))),
    "Every observed route/phase after first playing must stay out of full opening").toEqual([]);
  return trace;
}
