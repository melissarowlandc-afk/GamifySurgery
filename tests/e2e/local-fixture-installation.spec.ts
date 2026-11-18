import { expect, test, type Page } from "@playwright/test";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import {
  createLevelOneVisualFixture, createLevelTwoVisualFixture, expectLocalFixtureContent, expectFacilityRenderer,
  installLevelOneVisualState, installLevelTwoVisualState, installRememberedLocalAccess,
  resumeLocalCampaign, seedLocalProfileOnce, type MutableVisualGameState,
} from "./helpers";
import { readDurableLocalState } from "./ui-density-helpers";

const SOURCE_ID = "campaign.fixture-installation.original";
const NAME = "Fixture Installation Clinic";
const EVENT_ID = "event.fixture-installation.guidance";
const REMOVED_DOORS = ["door.visual.exam.front", "door.visual.xray.control"];

function composeGuidance(state: MutableVisualGameState) {
  state.doors = state.doors.filter(door => !REMOVED_DOORS.includes(door.id));
  state.events.push({ id: EVENT_ID, type: "success_message", facilityTick: state.facilityTick,
    encounterId: null, message: "A patient requested a more comfortable Examination Room. Upgrade Examination Room.",
    priority: "informational", definitionId: "alert.patient.room-upgrade-requested", alertCategory: "guidance",
    alertVariantId: "fixture.room-upgrade-guidance", target: { kind: "room", id: "room.visual.examination" } });
}

function content(state: { facilityLevel: number; clinicalXp: number; cash: number;
  rooms: Array<{ id: string }>; doors: Array<{ id: string }>; events: Array<{ id: string }> }) {
  return { level: state.facilityLevel, xp: state.clinicalXp, cash: state.cash,
    roomIds: state.rooms.map(row => row.id).sort(), doorIds: state.doors.map(row => row.id).sort(),
    injectedEvents: state.events.filter(row => row.id === EVENT_ID) };
}

async function head(page: Page, campaignId: string) {
  return page.evaluate(async id => {
    const modulePath = "/src/session/localJournal.ts";
    const { IndexedDbJournalStorage } = await import(/* @vite-ignore */ modulePath);
    return new IndexedDbJournalStorage().head(`local|guest|${encodeURIComponent(id)}`);
  }, campaignId);
}

async function commitSourceJournal(page: Page, profile: unknown) {
  // Real validated journal API; no write to the active legacy profile and no
  // surviving test owner that could compete with the mounted fixture.
  const committed = await page.evaluate(async sourceProfile => {
    const journalPath = "/src/session/localProfileJournal.ts";
    const { LocalProfileJournal } = await import(/* @vite-ignore */ journalPath);
    const errors: string[] = [];
    const journal = await LocalProfileJournal.create(sourceProfile, null,
      (error: unknown) => errors.push(String(error)), () => {});
    try { return { durable: await journal.durable(), errors }; }
    finally { journal.stop(); }
  }, profile);
  expect(committed).toEqual({ durable: true, errors: [] });
}

for (const layout of ["desktop", "phone"] as const) {
  for (const level of [1, 2] as const) {
    test(`Level ${level} fixture content survives either original journal commit ordering (${layout})`, async ({ browser, baseURL }, testInfo) => {
      // Four cold real-game openings/reloads, plus an explicit source journal
      // transaction. No timing window, sleeps, IDB deletion or precedence override.
      test.setTimeout(5 * 100_000);
      const observations: unknown[] = [];
      const results: ReturnType<typeof content>[] = [];
      try {
        for (const originalCommitted of [false, true]) {
          const context = await browser.newContext({ viewport: layout === "phone"
            ? { width: 390, height: 844 } : { width: 1440, height: 1000 },
          isMobile: layout === "phone", hasTouch: layout === "phone" });
          try {
            const page = await context.newPage();
            const nativeCanvas = page.locator(layout === "phone"
              ? ".mobile-facility-map canvas" : ".facility-host canvas");
            await installRememberedLocalAccess(page);
            await page.addInitScript(value => localStorage.setItem("gamify-surgery.presentation-layout.v1", value), layout);
            // This document mounts no application, so the source journal cannot
            // bind in the "not committed" ordering, however slow the browser is.
            await page.route("**/fixture-installation-bootstrap.html", route => route.fulfill({
              contentType: "text/html", body: "<!doctype html><title>Synthetic fixture bootstrap</title>",
            }));
            const source = createInitialGameState(undefined, { campaignId: SOURCE_ID,
              campaignSeed: "fixture-installation-source", createdAtRealMs: 1_800_000_000_000 });
            source.paused = true;
            const profile = { schemaVersion: 2, nextCampaignNumber: 2, activeCampaignId: SOURCE_ID,
              tutorialsEnabled: false, campaigns: [{ campaignId: SOURCE_ID, name: NAME,
                status: "resumable" as const, createdAtRealMs: 1_800_000_000_000,
                updatedAtRealMs: 1_800_000_000_000, serializedState: JSON.stringify(source) }] };
            await seedLocalProfileOnce(page, profile);
            await page.goto(new URL("/fixture-installation-bootstrap.html", baseURL!).href);
            expect(await head(page, SOURCE_ID)).toBeNull();
            const originalProfile = await page.evaluate(async () => {
              const storagePath = "/src/session/prototypeStorage.ts";
              const { loadPrototypeProfile } = await import(/* @vite-ignore */ storagePath);
              return loadPrototypeProfile().profile;
            });
            if (originalCommitted) {
              await commitSourceJournal(page, originalProfile);
            }
            const originalHead = await head(page, SOURCE_ID);
            if (originalCommitted) expect(originalHead).not.toBeNull();
            else expect(originalHead).toBeNull();
            expect(content(await readDurableLocalState(page))).toEqual(content(source));
            const wanted = level === 1
              ? createLevelOneVisualFixture(structuredClone(source) as unknown as MutableVisualGameState)
              : createLevelTwoVisualFixture(structuredClone(source) as unknown as MutableVisualGameState);
            if (level === 1) composeGuidance(wanted);
            const expected = content(wanted as Parameters<typeof content>[0]);
            expect({ level: expected.level, xp: expected.xp, cash: expected.cash }).toEqual(level === 1
              ? { level: 1, xp: 64, cash: 2_460 } : { level: 2, xp: 0, cash: 12_345 });
            observations.push({ layout, level, originalCommitted, originalHead, expected });

            const installed = level === 1
              ? await installLevelOneVisualState(page, composeGuidance)
              : await installLevelTwoVisualState(page);
            await expect(nativeCanvas).toBeVisible();
            await expectFacilityRenderer(page);
            expect(installed.campaignId).not.toBe(SOURCE_ID);
            const first = content(await readDurableLocalState(page));
            expect(first).toEqual(expected);
            if (level === 1) {
              expect(first.doorIds.filter(id => REMOVED_DOORS.includes(id))).toEqual([]);
              expect(first.injectedEvents).toHaveLength(1);
              if (layout === "desktop") await expect(page.locator(`[data-message-id="${EVENT_ID}"]`)).toContainText(
                "A patient requested a more comfortable Examination Room. Upgrade Examination Room.");
            }
            // Opposite ordering: explicitly complete the original journal only
            // after the fresh fixture's first opening. A late old commit must
            // not displace its content or redirect the subsequent reload.
            if (!originalCommitted) await commitSourceJournal(page, originalProfile);
            const preservedOriginalHead = await head(page, SOURCE_ID);
            expect(preservedOriginalHead).not.toBeNull();
            if (originalCommitted) expect(preservedOriginalHead).toEqual(originalHead);
            expect(content(await readDurableLocalState(page))).toEqual(expected);
            // The once-only seed is already consumed. This is ordinary recovery
            // of the fixture's committed journal, including its injected content.
            await page.reload();
            await resumeLocalCampaign(page, NAME);
            await expect(nativeCanvas).toBeVisible();
            await expectFacilityRenderer(page);
            await expectLocalFixtureContent(page, installed);
            const reopened = content(await readDurableLocalState(page));
            expect(reopened).toEqual(expected);
            expect(reopened).toEqual(first);
            expect(await head(page, SOURCE_ID)).toEqual(preservedOriginalHead);
            observations.push({ originalCommitted, installedId: installed.campaignId, first, reopened,
              preservedOriginalHead, fixtureHead: await head(page, installed.campaignId) });
            results.push(reopened);
          } finally { await context.close(); }
        }
        expect(results).toHaveLength(2);
        expect(results[1]).toEqual(results[0]);
      } finally {
        await testInfo.attach("fixture-commit-orderings.json", {
          body: Buffer.from(JSON.stringify(observations, null, 2)), contentType: "application/json",
        });
      }
    });
  }
}
