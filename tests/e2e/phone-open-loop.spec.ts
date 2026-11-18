import { test, expect, type Browser, type TestInfo } from "@playwright/test";
import { loadCloudEvidenceCheckpoint } from "../../apps/player/src/session/cloud/codecEvidence";
import { CLOUD_QA_WAIT_MS, CLOUD_QA_STARTUP_WAIT_MS, expectAccountSaved, expectPlaying, openAndContinue, snapshot, status } from "./cloud-qa-helpers";
import { advanceSyntheticClinic, expectNoReopen, lifecycleBurst, loopTrace, PHONE_LOOP_ACCOUNT, PHONE_LOOP_RETRY_BUDGET_MS, phoneLoopRig, type PhoneLoopLayout } from "./phone-open-loop-helpers";

// Blind regression contract, derived from the owner's release-40 phone report:
// "it is loading and saying that saving is offline then it is going back to the
// loading screen, then loading and cycling through this. Took about 23 seconds
// to load in the first time. My phone is getting hot"
// No private saves, clinical content changes, hosted service or real accounts.
const symptom = 'owner phone symptom "loading / saving is offline / going back to loading"';
// Round 3 candidate phone B/D: one 60-step, 300,000 ms page-time advance
// took 217,297 ms real time. Evidence: .local-dev/manager/out/pl3-5184/
// phone-open-loop-phone-owne-eb967-e-session-with-zero-reopens-desktop-chrome/trace.zip,
// clockEvents visible-advance-start/end (resource cd76bed5fe1c2f8f2a7b00b99bf8b3ba6e732029).
// Scale only outer test deadlines; fake time, rounds and inner checks stay fixed.
const MEASURED_ADVANCE_REAL_MS = 217_297;
const ADVANCE_REAL_HEADROOM_FACTOR = 2;
const OPENING_TEST_ADVANCE_COUNT = 2;
const PARTIAL_SERVICE_ADVANCE_COUNT = 4; // Three outage rounds plus recovery.
const BACKGROUND_TEST_ADVANCE_COUNT = 1; // Hidden wall-time jump is instantaneous.
const TWO_DEVICE_STARTUP_RESERVE_MS = 6 * CLOUD_QA_STARTUP_WAIT_MS; // Two entries, four campaign opens.
const PARTIAL_SERVICE_STARTUP_RESERVE_MS = 3 * CLOUD_QA_STARTUP_WAIT_MS; // Entry, initial open, offline reopen.
const BACKGROUND_STARTUP_RESERVE_MS = 2 * CLOUD_QA_STARTUP_WAIT_MS; // Entry and initial open.
const NON_ADVANCE_RESERVE_MS = 5 * CLOUD_QA_WAIT_MS; // Commands, checkpoints, assertions and evidence/cleanup.
const testTimeBudget = (advanceCount: number, startupReserveMs: number) =>
  advanceCount * MEASURED_ADVANCE_REAL_MS * ADVANCE_REAL_HEADROOM_FACTOR + startupReserveMs + NON_ADVANCE_RESERVE_MS;
const NEWER_ACCOUNT_TEST_TIMEOUT_MS = testTimeBudget(OPENING_TEST_ADVANCE_COUNT, TWO_DEVICE_STARTUP_RESERVE_MS);
const PARTIAL_SERVICE_TEST_TIMEOUT_MS = testTimeBudget(PARTIAL_SERVICE_ADVANCE_COUNT, PARTIAL_SERVICE_STARTUP_RESERVE_MS);
const BACKGROUND_TEST_TIMEOUT_MS = testTimeBudget(BACKGROUND_TEST_ADVANCE_COUNT, BACKGROUND_STARTUP_RESERVE_MS);
test.setTimeout(PARTIAL_SERVICE_TEST_TIMEOUT_MS); // Cover fixture setup before each case selects its own budget.

async function attachEvidence(info: TestInfo, rig: Awaited<ReturnType<typeof phoneLoopRig>>) {
  const pages = await Promise.all([...rig.histories].map(async ([page, samples]) => ({
    url: page.url(), navigations: rig.navigations.get(page), samples,
    // Keep the synchronous document history too, even if a failed test ends
    // before its final exposed-binding notifications reach the runner.
    currentDocumentSamples: await page.evaluate(() => window.__phoneOpenLoop?.samples ?? []).catch(() => []),
  })));
  await info.attach("phone-loop-routes-and-rpcs.json", {
    body: JSON.stringify({ requests: rig.requests, clockEvents: rig.clockEvents, pages }, null, 2), contentType: "application/json",
  });
}

async function newerAccountOpening(browser: Browser, baseURL: string, layout: PhoneLoopLayout, capacityFlagged: boolean, info: TestInfo) {
  const rig = await phoneLoopRig(browser, baseURL, layout);
  let releaseRead: () => void = () => {};
  try {
    // Device 1 plays and uploads a real synthetic campaign. Device 2 opens
    // that same campaign, plays earlier progress and then loses connectivity.
    const device1 = await rig.page("device-1", 1);
    await openAndContinue(device1);
    const baseline = await advanceSyntheticClinic(device1, 2, 1);
    expect(await device1.evaluate(() => window.__cloudQa!.checkpoint())).toBe(true);
    await expectAccountSaved(device1);
    expect(await device1.evaluate(() => window.__cloudQa!.closeLease())).toBe(true);

    const device2 = await rig.page("device-2", 0, true);
    await openAndContinue(device2);
    expect((await snapshot(device2)).state).toEqual(baseline);
    if (capacityFlagged) rig.failMethods(device2, ["commit"], "capacity");
    else rig.failAll(device2, "network");
    const older = await advanceSyntheticClinic(device2, 2, 1);
    expect((await snapshot(device2)).pending).toBe(true);
    if (capacityFlagged) {
      // C: create the persisted capacity flag through a real failed checkpoint,
      // not by manufacturing cache bytes or bypassing the journal/coordinator.
      expect(await device2.evaluate(() => window.__cloudQa!.checkpoint())).toBe(false);
      await expect.poll(() => status(device2), { timeout: CLOUD_QA_WAIT_MS }).toMatchObject({
        failure: "capacity", pending: true, localDurable: true, canExecute: true,
      });
      rig.failAll(device2, "network");
    }

    // Device 1 advances further while device 2 is offline. Actual commands,
    // codecs, journal, worker and checkpoint RPC produce the newer account head.
    await device1.reload();
    await expectPlaying(device1); await expectAccountSaved(device1);
    const newer = await advanceSyntheticClinic(device1, 4, 3);
    expect(newer.campaignId).toBe(older.campaignId);
    expect(newer.facilityTick).toBeGreaterThan(older.facilityTick);
    expect(await device1.evaluate(() => window.__cloudQa!.checkpoint())).toBe(true);
    await expectAccountSaved(device1);
    const account = structuredClone(await rig.server.transport(PHONE_LOOP_ACCOUNT).load(newer.campaignId));
    const verified = await loadCloudEvidenceCheckpoint({ ...account, expectedRevision: account.revision,
      expectedCampaignId: account.campaignId, expectedBaselineId: account.baselineId });
    expect(verified.state).toEqual(newer);
    expect(await device1.evaluate(() => window.__cloudQa!.closeLease())).toBe(true);

    // Observe the entire opening document, including its first loader. Hold a
    // real read only until the loading surface is observed; no Retry, takeover,
    // recovery choice, Resume click or QA reopen call is allowed after reload.
    const heldRead = new Promise<void>(resolve => { releaseRead = resolve; });
    rig.server.faults.push({ method: "head", at: "before", wait: heldRead });
    rig.recover(device2);
    await device2.reload({ waitUntil: "domcontentloaded" });
    const openingDocumentId = (await loopTrace(device2)).latest.documentId;
    const openingNavigations = rig.navigations.get(device2);
    await expect(device2.getByRole("region", { name: "Loading clinic", exact: true })).toBeVisible({ timeout: CLOUD_QA_WAIT_MS });
    releaseRead();
    await expectPlaying(device2); await expectAccountSaved(device2);
    expect((await snapshot(device2)).state).toEqual(newer);
    expect((await snapshot(device2)).state!.campaignId).toBe(baseline.campaignId);
    await expect(device2.getByRole("dialog")).toHaveCount(0);
    expect((await status(device2)).openingFailure).toBeNull();

    // A/C: the old journal must still decode as the exact older playable copy.
    // A retained copy may have its own campaign ID; no other state may change.
    const retained = await device2.evaluate(() => window.__cloudQa!.retainedCopies());
    const backups = await Promise.all(retained.map(async row => {
      const copy = row.value.copy;
      return loadCloudEvidenceCheckpoint({ ...copy, expectedRevision: copy.revision,
        expectedCampaignId: copy.campaignId, expectedBaselineId: copy.baselineId });
    }));
    const backup = backups.find(row => row.state.facilityTick === older.facilityTick && row.state.simulationSpeed === older.simulationSpeed);
    expect(backup, "The older offline journal must be retained, rather than silently overwritten").toBeDefined();
    expect(backup!.state).toEqual({ ...older, campaignId: backup!.state.campaignId });
    expect(await rig.server.transport(PHONE_LOOP_ACCOUNT).load(newer.campaignId)).toEqual(account);

    // Continue observing after play: healthy focus/online/visibility events
    // cannot send the owner back into the reported loading/offline/loading loop.
    await lifecycleBurst(device2);
    await expectNoReopen(device2, layout);
    for (let interval = 0; interval < 2; interval++) {
      await rig.advanceRetryBudget(device2);
      await expectNoReopen(device2, layout);
    }
    const trace = await expectNoReopen(device2, layout);
    expect(trace.latest.loadingAppearances, "One loading appearance for the complete automatic opening").toBe(1);
    expect(trace.latest.documentId).toBe(openingDocumentId);
    expect(rig.navigations.get(device2)).toBe(openingNavigations);
    expect((await snapshot(device2)).state).toEqual(newer);
  } finally {
    releaseRead();
    try { await attachEvidence(info, rig); } finally { await rig.close(); }
  }
}

for (const layout of ["phone", "desktop"] as const) {
  test(`${layout}: ${symptom} — A: older offline journal opens the newer account head automatically, once`, async ({ browser, baseURL }, info) => {
    test.setTimeout(NEWER_ACCOUNT_TEST_TIMEOUT_MS);
    // Owner symptom: "loading ... saving is offline ... going back to the
    // loading screen ... cycling". A must not turn stale-device selection into
    // repeated opening, and must preserve the losing journal as a hidden backup.
    await newerAccountOpening(browser, baseURL!, layout, false, info);
  });

  test(`${layout}: ${symptom} — B/D: partially reachable service keeps one playable session with zero reopens`, async ({ browser, baseURL }, info) => {
    test.setTimeout(PARTIAL_SERVICE_TEST_TIMEOUT_MS);
    // Owner symptom: "loading ... saving is offline ... going back to the
    // loading screen ... My phone is getting hot". Repeated foreground and
    // background retries must never remount/recreate the already playable game.
    const rig = await phoneLoopRig(browser, baseURL!, layout);
    try {
      const page = await rig.page("local-clinic", 1, true);
      await openAndContinue(page);
      await expect.poll(async () => (await status(page)).operationalEngineHealth?.operationalEngine,
        { timeout: CLOUD_QA_STARTUP_WAIT_MS }).toBe("worker");
      await expectNoReopen(page, layout);
      const initial = (await snapshot(page)).state!;
      const initialHead = structuredClone(await rig.server.transport(PHONE_LOOP_ACCOUNT).load(initial.campaignId));
      const start = rig.requests.length;
      const failedReads = () => rig.requests.slice(start).filter(call => ["list", "head", "load"].includes(call.method) && call.result === "network").length;

      // Keep capabilities, acquire, renew and receipt lookup reachable. Fail
      // campaign reads/downloads plus writes, so pending progress cannot
      // accidentally be acknowledged before the service recovers. navigator
      // stays online: this is deliberately not an all-requests-offline fixture.
      rig.failMethods(page, ["list", "head", "load", "commit"], "network");
      expect(await page.evaluate(() => navigator.onLine)).toBe(true);
      expect(await page.evaluate(() => window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 2 }))).toBe(true);
      expect(await page.evaluate(() => window.__cloudQa!.checkpoint())).toBe(false);
      const pendingAtOpen = (await snapshot(page)).state!;
      // Establish the playable LOCAL session through the actual opening path
      // while reads are unavailable. A previously healthy online lease alone
      // could keep renewing without ever exercising a campaign download/retry.
      // This is the one intentional setup reopen, before the B/D guard starts
      // at first playing in the new document. No later reopen is permitted.
      await page.reload();
      const documentId = (await loopTrace(page)).latest.documentId;
      const initialNavigations = rig.navigations.get(page);
      await expect.poll(() => status(page), { timeout: CLOUD_QA_STARTUP_WAIT_MS }).toMatchObject({ hasState: true, canExecute: true });
      await expectNoReopen(page, layout);
      expect((await snapshot(page)).state).toEqual(pendingAtOpen);
      await lifecycleBurst(page);
      await expect.poll(failedReads, { timeout: CLOUD_QA_WAIT_MS }).toBeGreaterThan(0);
      await expectNoReopen(page, layout);

      let betweenRetries: Awaited<ReturnType<typeof snapshot>>["state"] = null;
      for (let round = 0; round < 3; round++) {
        await expectNoReopen(page, layout);
        const readsBeforeClock = failedReads();
        // No focus/reconnect call during this interval: the new failed read
        // proves an actual production background retry ran, rather than a
        // vacuous clock advance which never exercised the failing path.
        await rig.advanceRetryBudget(page);
        await expect.poll(failedReads, { timeout: CLOUD_QA_WAIT_MS }).toBeGreaterThan(readsBeforeClock);
        await expectNoReopen(page, layout);
        expect((await snapshot(page)).pending).toBe(true);
        if (round === 0) {
          // Issue a new command BETWEEN retry intervals, while reads still
          // fail. Its exact state must survive both later retries and upload.
          expect(await page.evaluate(() => window.__cloudQa!.command({ type: "SET_SIMULATION_SPEED", speed: 4 }))).toBe(true);
          betweenRetries = (await snapshot(page)).state!;
          expect(betweenRetries.campaignId).toBe(initial.campaignId);
          expect(Object.keys(betweenRetries.operationReceipts).length).toBeGreaterThan(Object.keys(initial.operationReceipts).length);
        } else expect((await snapshot(page)).state).toEqual(betweenRetries);
      }
      expect(betweenRetries).not.toBeNull();
      expect(await rig.server.transport(PHONE_LOOP_ACCOUNT).load(initial.campaignId)).toEqual(initialHead);
      const outageCalls = rig.requests.slice(start);
      expect(outageCalls.some(call => call.method === "capabilities" && call.result === "success"), "Capability/handshake succeeds during the read outage").toBe(true);
      expect(outageCalls.filter(call => call.method === "capabilities").every(call => call.result === "success")).toBe(true);

      // Recover only the RPCs. Do not click Retry, reopen, reload or manufacture
      // an online/focus event: a background interval must upload pending work.
      rig.recover(page);
      await rig.advanceRetryBudget(page);
      await expect.poll(() => status(page), { timeout: CLOUD_QA_WAIT_MS }).toMatchObject({
        hasState: true, canExecute: true, pending: false, localDurable: true, failure: null, needsReload: false,
      });
      await expectNoReopen(page, layout);
      expect((await snapshot(page)).state).toEqual(betweenRetries);
      const saved = await rig.server.transport(PHONE_LOOP_ACCOUNT).load(initial.campaignId);
      expect(saved.revision).not.toBe(initialHead.revision);
      const verified = await loadCloudEvidenceCheckpoint({ ...saved, expectedRevision: saved.revision,
        expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId });
      expect(verified.state).toEqual(betweenRetries);

      // D: independent counters for loading/checking entries, engine creation,
      // shell detachment and whole-document navigation all remain exactly zero
      // after first playing. Phase/route history is attached even on failure.
      const trace = await expectNoReopen(page, layout);
      expect(trace.latest.documentId).toBe(documentId);
      expect(rig.navigations.get(page)).toBe(initialNavigations);
      expect(trace.latest.reopenAttempts).toBe(0);
      expect(trace.latest.newOperationalWorkers).toBe(0);
      expect(trace.latest.loadingReturns).toBe(0);
      expect(trace.latest.shellRemoved).toBe(false);
    } finally {
      try { await attachEvidence(info, rig); } finally { await rig.close(); }
    }
  });

  test(`${layout}: ${symptom} — C: capacity-flagged older journal opens the newer account head and retains its backup`, async ({ browser, baseURL }, info) => {
    test.setTimeout(NEWER_ACCOUNT_TEST_TIMEOUT_MS);
    // Owner symptom: "loading ... saving is offline ... going back to the
    // loading screen ... cycling". A real capacity-failed old journal must not
    // cause storage/revision conflict or prevent automatic newer-head opening.
    await newerAccountOpening(browser, baseURL!, layout, true, info);
  });
}

test(`phone: ${symptom} — E: phone backgrounded 5 minutes then returns`, async ({ browser, baseURL }, info) => {
  test.setTimeout(BACKGROUND_TEST_TIMEOUT_MS);
  // Owner symptom: "loading ... saving is offline ... going back to the
  // loading screen ... My phone is getting hot". Unlike A-D's visible-page
  // intervals, this case deliberately freezes timers while the phone sleeps.
  const rig = await phoneLoopRig(browser, baseURL!, "phone");
  try {
    const page = await rig.page("backgrounded-phone", 1, true);
    await openAndContinue(page);
    const before = await expectNoReopen(page, "phone");
    const documentId = before.latest.documentId, initialNavigations = rig.navigations.get(page);
    const initial = (await snapshot(page)).state!;
    const initialHead = structuredClone(await rig.server.transport(PHONE_LOOP_ACCOUNT).load(initial.campaignId));

    // Leave real, durable, unacknowledged commands for the foreground return.
    // Only writes fail during setup/sleep; reads and lease RPCs stay available.
    rig.failMethods(page, ["commit"], "network");
    const pendingAtHide = await advanceSyntheticClinic(page, 4, 2);
    expect(await page.evaluate(() => window.__cloudQa!.checkpoint())).toBe(false);
    await expect.poll(() => status(page), { timeout: CLOUD_QA_WAIT_MS }).toMatchObject({ pending: true, localDurable: true });
    expect((await rig.server.transport(PHONE_LOOP_ACCOUNT).head(initial.campaignId)).writerActive, "E setup: the visible clinic starts with an active lease").toBe(true);

    const suspension = await rig.backgroundForFiveMinutes(page);
    expect(suspension.returnedAt - suspension.hiddenAt, "E: the hidden wall-clock jump is exactly five minutes").toBe(PHONE_LOOP_RETRY_BUDGET_MS);
    expect(suspension.timerFires, "E: no page interval runs during the frozen hidden interval").toBe(0);
    expect(await page.evaluate(() => ({ visibility: document.visibilityState, hidden: document.hidden }))).toEqual({ visibility: "hidden", hidden: true });
    expect((await snapshot(page)).state).toEqual(pendingAtHide);
    expect((await snapshot(page)).pending).toBe(true);
    expect(await rig.server.transport(PHONE_LOOP_ACCOUNT).load(initial.campaignId)).toEqual(initialHead);
    expect((await rig.server.transport(PHONE_LOOP_ACCOUNT).head(initial.campaignId)).writerActive, "E setup: the five-minute frozen suspension really expires the server lease").toBe(false);

    rig.recover(page);
    const returnStart = await rig.returnFromBackground(page);
    // Return events and ordinary retries must reconcile the expired lease and
    // upload the pending journal. No Retry/Resume/reload or QA reopen is used.
    await rig.advanceRetryBudget(page);
    await expect.poll(() => status(page), { timeout: CLOUD_QA_WAIT_MS }).toMatchObject({
      hasState: true, canExecute: true, pending: false, localDurable: true, needsReload: false,
    });
    await expect(page.locator(".mobile-shell")).toBeVisible();
    await expect(page.getByRole("region", { name: "Loading clinic", exact: true, includeHidden: true })).toBeHidden();
    const trace = await rig.serverTrace(page);
    expect(trace.latest.loadingReturns, "E: no loading-screen return, including during suspension/recovery").toBe(0);
    expect(trace.latest.shellRemoved, "E: the same clinic shell remains mounted").toBe(false);
    expect(trace.latest.newOperationalWorkers, "E: recovery preserves the existing operational worker").toBe(0);
    expect(trace.latest.documentId, "E: recovery preserves the document").toBe(documentId);
    expect(rig.navigations.get(page), "E: recovery does not navigate the document").toBe(initialNavigations);
    expect((await snapshot(page)).state, "E: every pending player command survives the return").toEqual(pendingAtHide);
    const saved = await rig.server.transport(PHONE_LOOP_ACCOUNT).load(initial.campaignId);
    expect(saved.revision, "E: the account acknowledges the pending progress after return").not.toBe(initialHead.revision);
    const verified = await loadCloudEvidenceCheckpoint({ ...saved, expectedRevision: saved.revision,
      expectedCampaignId: saved.campaignId, expectedBaselineId: saved.baselineId });
    expect(verified.state).toEqual(pendingAtHide);

    // Recorded manager decision: only a genuine expired-lease return may
    // briefly gate commands without replacing the clinic. Keep every sample;
    // use actual backend lease facts, not a permanently latched expiry flag.
    expect(trace.serverSamples.map(row => row.sequence), "E: every page observation has backend lease evidence")
      .toEqual(trace.samples.map(row => row.sequence));
    const afterPlaying = trace.serverSamples.filter(row => row.afterFirstPlaying);
    const checkingOrUnplayable = afterPlaying.filter(row => row.phase === "checking" || !row.canExecute);
    const unplayable = afterPlaying.filter(row => !row.canExecute);
    const firstUnplayable = unplayable[0], lastUnplayable = unplayable.at(-1);
    const resumed = lastUnplayable ? afterPlaying.find(row => row.sequence > lastUnplayable.sequence && row.canExecute) : undefined;
    // Conservatively measure the entire first-loss -> final-resumption span,
    // including any playable gaps. An unclosed span cannot pass as zero.
    // The runner's monotonic clock keeps running while page timers are frozen;
    // neither the five-minute wall-time jump nor pause/resume can hide a stall.
    const unplayableSpanMs = firstUnplayable ? resumed ? resumed.observedMonotonicAt - firstUnplayable.observedMonotonicAt : null : 0;
    await info.attach("phone-loop-E-return-metrics.json", {
      body: JSON.stringify({ returnStart, checkingOrUnplayable, unplayableSpanMs }, null, 2), contentType: "application/json",
    });
    expect(checkingOrUnplayable.filter(row => !row.backgroundReturnStarted || row.sequence < returnStart.sequence),
      "E: checking/unplayable samples occur only after returnFromBackground starts").toEqual([]);
    expect(checkingOrUnplayable.filter(row => !row.serverLeaseExpired || row.serverLeaseExpiresAt === null || row.observedServerAt < row.serverLeaseExpiresAt),
      "E: checking/unplayable samples occur only while the actual server lease is expired").toEqual([]);
    expect(unplayableSpanMs, "E: every unplayable span closes with resumed command authority").not.toBeNull();
    expect(unplayableSpanMs!, "E: the observed unplayable span has a valid monotonic duration").toBeGreaterThanOrEqual(0);
    expect(unplayableSpanMs!, "E: total unplayable span after first playing is at most 1000 ms").toBeLessThanOrEqual(1_000);
    expect(afterPlaying.filter(row => row.loadingVisible), "E: zero loading appearances after first playing").toEqual([]);
  } finally {
    try { await attachEvidence(info, rig); } finally { await rig.close(); }
  }
});
