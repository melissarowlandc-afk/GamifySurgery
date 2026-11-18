import { expect, test } from "@playwright/test";
import { expectAccountSaved, expectPlaying, snapshot, CLOUD_QA_STARTUP_WAIT_MS, CLOUD_QA_WAIT_MS } from "./cloud-qa-helpers";
import {
  animationFrames, finishLoadingRecorder, installLoadingRecorder, returningCloudRig,
  type Layout, type LoadingRecording,
} from "./remodel-loading-helpers";

test.setTimeout(180_000);
test.beforeEach(({}, info) => {
  test.skip(!["desktop-chrome", "phone-chrome"].includes(info.project.name), "The loading symptom must be exercised on desktop and native phone.");
});

function assertContinuousLoading(recording: LoadingRecording, expectedOrigin: string) {
  expect(recording.origin).toBe(expectedOrigin);
  expect(recording.overflow, "The recorder must not truncate the opening").toBe(false);
  const samples = recording.samples.filter(sample => sample.armed);
  expect(samples.length).toBeGreaterThan(0);
  expect(samples.some(sample => sample.source === "mutation")).toBe(true);
  expect(samples.some(sample => sample.source === "raf")).toBe(true);
  const firstClinic = samples.findIndex(sample => sample.screen === "clinic");
  expect(firstClinic, "Automatic entry must reach a playable clinic without clicking Resume or a recovery choice").toBeGreaterThan(0);
  const opening = samples.slice(0, firstClinic);
  const violations = opening.filter(sample => sample.screen !== "loading" || sample.loadingCount !== 1 ||
    !sample.fullScreen || sample.forbidden.length !== 0 || sample.bars.length !== 1 || sample.bars[0]!.percent === null);
  expect(violations, "Every app sample before play must show only one full-screen loading screen and its bar; no list/sign-in/entry/error/blank flash").toEqual([]);
  let previousValue = -Infinity, previousPercent = -Infinity;
  for (const sample of opening) {
    const bar = sample.bars[0]!;
    expect(bar.value).not.toBeNull();
    expect(bar.percent).not.toBeNull();
    expect(bar.percent!).toBeGreaterThanOrEqual(0);
    expect(bar.percent!).toBeLessThanOrEqual(100);
    expect(bar.value!, `aria-valuenow regressed at ${sample.at}ms (${sample.source})`).toBeGreaterThanOrEqual(previousValue);
    expect(bar.percent!, `The visible bar shrank at ${sample.at}ms (${sample.source})`).toBeGreaterThanOrEqual(previousPercent);
    previousValue = bar.value!; previousPercent = bar.percent!;
  }
  expect(new Set(opening.map(sample => sample.bars[0]!.percent)).size, "An opening must visibly advance the bar").toBeGreaterThan(1);
  const afterPlay = samples.slice(firstClinic);
  expect(afterPlay.filter(sample => sample.source === "raf").length).toBeGreaterThanOrEqual(60);
  expect(afterPlay.filter(sample => sample.loadingCount > 0), "Loading must never reappear after the clinic is shown").toEqual([]);
  expect(afterPlay.filter(sample => sample.forbidden.length > 0 || sample.screen === "blank/unknown"), "The playable clinic must not flash an entry/error/blank screen").toEqual([]);
}

for (const variant of ["opening", "slow opening", "reload", "slow reload"] as const) {
  test(`'B-007' a returning one-campaign player sees continuous increasing loading during ${variant}, then the clinic stays visible`, async ({ page, context, baseURL }, info) => {
    const layout: Layout = info.project.name === "phone-chrome" ? "phone" : "desktop";
    const rig = await returningCloudRig(context, page, layout);
    // Setup alone may use Resume. Every recorded opening below must auto-open;
    // the assertion path has no chooser/sign-in/recovery button helper.
    let returning = page;
    if (!variant.includes("reload")) {
      await page.close();
      returning = await context.newPage();
    }
    await installLoadingRecorder(returning);
    let release = () => {};
    const reads = rig.server.calls.filter(call => call.method === "head").length;
    if (variant.startsWith("slow")) {
      const held = new Promise<void>(resolve => { release = resolve; });
      // Existing fake-transport fault hook holds the REAL automatic-open head
      // request. No CSS hiding, route substitution, clock mocking or UI delay.
      rig.server.faults.push({ method: "head", at: "before", wait: held });
    }
    let failure: unknown;
    try {
      if (variant.includes("reload")) await returning.reload();
      else await returning.goto(rig.url);
      if (variant.startsWith("slow")) {
        await expect.poll(() => rig.server.calls.filter(call => call.method === "head").length, { timeout: CLOUD_QA_STARTUP_WAIT_MS }).toBeGreaterThan(reads);
        await expect(returning.getByRole("region", { name: "Loading clinic", exact: true })).toBeVisible({ timeout: CLOUD_QA_WAIT_MS });
        await animationFrames(returning, 90);
        expect((await snapshot(returning)).canExecute, "The held automatic-open request actually delays play").toBe(false);
        release();
      }
      await expectPlaying(returning);
      await expect(returning.getByTestId("facility-canvas").locator("canvas")).toBeVisible();
      expect((await snapshot(returning)).state!.campaignId).toBe(rig.campaignId);
      await expectAccountSaved(returning);
      await animationFrames(returning, 90);
    } catch (error) { failure = error; }
    finally { release(); }
    // Preserve high-frequency evidence even when an intermediate screen stalls
    // auto-entry, rather than returning just a last-frame locator timeout.
    const recording = await finishLoadingRecorder(returning);
    await info.attach("B-007-visible-screen-recording.json", { body: JSON.stringify(recording, null, 2), contentType: "application/json" });
    assertContinuousLoading(recording, new URL(baseURL!).origin);
    if (failure) throw failure;
  });
}
