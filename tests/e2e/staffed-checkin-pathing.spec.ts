import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  PROFILE_KEY,
  getActiveState,
  getProfile,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
} from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";
const STARTER_EXAMINATION_ID = "room.instance.starter_examination";
const EXAMINATION_BED = { x: 36, y: 27 };
const EXAMINATION_STOOL = { x: 35, y: 27 };

type Point = { x: number; y: number };

interface EncounterSnapshot {
  id: string;
  checkInStatus: "approaching" | "awaiting_staff" | "checked_in";
  lifecycle: string;
  patientSatisfaction: number;
  patientLocation: Point | null;
  patientMovement: {
    kind: string;
    destinationRoomInstanceId?: string | null;
    path?: Point[];
  } | null;
  assignedRoomInstanceId: string | null;
  waitingDestination: { kind: string; point: Point; roomInstanceId?: string } | null;
  unstaffedCheckInOverdueApplied: boolean;
}

interface StateSnapshot {
  facilityTick: number;
  paused: boolean;
  nextRoutineArrivalTick: number;
  openChartEncounterId: string | null;
  encounters: Record<string, EncounterSnapshot>;
  events: Array<{ definitionId?: string; target?: { kind?: string; id?: string } }>;
  environment: {
    founderLocation: Point;
    founderActivity: {
      kind: string;
      targetId?: string;
      path?: Point[];
    } | null;
  };
}

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

function activeEncounter(state: StateSnapshot): EncounterSnapshot {
  const encounter = Object.values(state.encounters)[0];
  if (!encounter) throw new Error("Expected the new clinic's initial encounter.");
  return encounter;
}

function at(point: Point | null | undefined, expected: Point): boolean {
  return point?.x === expected.x && point.y === expected.y;
}

async function activeSnapshot(page: Page): Promise<StateSnapshot> {
  return (await getActiveState(page)) as unknown as StateSnapshot;
}

async function pollState<T>(
  page: Page,
  predicate: (state: StateSnapshot) => T | false,
): Promise<T> {
  const deadline = Date.now() + 20_000;
  while (Date.now() < deadline) {
    const state = await activeSnapshot(page);
    const result = predicate(state);
    if (result !== false) return result;
    await page.waitForTimeout(50);
  }
  throw new Error("Timed out waiting for the requested persisted state.");
}

async function reopenPausedCampaignWithLiveBridge(page: Page, clinicName: string): Promise<void> {
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${clinicName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as (HTMLDivElement & {
      __facilityGame?: unknown;
    }) | null;
    return Boolean(host?.__facilityGame);
  });
}

async function installUnstaffedMinuteSixtyFixture(page: Page): Promise<{ encounterId: string; satisfaction: number }> {
  const profile = await getProfile(page);
  const activeIndex = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (activeIndex < 0) throw new Error("Missing active campaign.");
  const active = profile.campaigns[activeIndex]!;
  const state = JSON.parse(active.serializedState) as StateSnapshot;
  const encounter = activeEncounter(state);
  state.facilityTick = 60;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.events = [];
  state.environment.founderLocation = { ...EXAMINATION_BED };
  state.environment.founderActivity = null;
  encounter.checkInStatus = "awaiting_staff";
  encounter.lifecycle = "waiting_unopened";
  encounter.patientMovement = null;
  encounter.patientLocation = { x: 36, y: 30 };
  encounter.assignedRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.unstaffedCheckInOverdueApplied = false;
  // This is an ordinary persisted awaiting-check-in state at exactly 60
  // elapsed facility minutes. The browser still runs the next reducer tick.
  (encounter as unknown as Record<string, unknown>).checkInWaitingSinceTick = 0;
  (encounter as unknown as Record<string, unknown>).feedAttentionKind = null;
  (encounter as unknown as Record<string, unknown>).feedAttentionStartedAtTick = null;
  profile.campaigns[activeIndex] = {
    ...active,
    serializedState: JSON.stringify(state),
  };
  await page.addInitScript(
    ({ profileKey, nextProfile }) => {
      window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    },
    { profileKey: PROFILE_KEY, nextProfile: profile },
  );
  return { encounterId: encounter.id, satisfaction: encounter.patientSatisfaction };
}

test("staffed check-in makes the chart immediate and coordinates the shared examination route", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Canonical desktop Chromium proof only.");
  testInfo.setTimeout(90_000);
  await startClinic(page, "Check-In Proof Founder", "Check-In Proof Clinic");
  expect(new URL(page.url()).origin).toBe("http://127.0.0.1:4173");

  // Freeze the genuinely fresh arrival before it can reach the desk. Reloading
  // under the opt-in bridge keeps the campaign/reducer journey intact while
  // allowing a read-only check of the live Phaser projection after chart open.
  await page.getByRole("button", { name: "Pause facility time" }).click();
  await reopenPausedCampaignWithLiveBridge(page, "Check-In Proof Clinic");
  const approaching = await activeSnapshot(page);
  expect(activeEncounter(approaching).checkInStatus).toBe("approaching");
  await expect(page.locator(".patient-folder.is-waiting .patient-tab")).toHaveCount(0);

  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await pollState(page, (state) => activeEncounter(state).checkInStatus === "checked_in" && state);
  await page.getByRole("button", { name: "Pause facility time" }).click();
  const checkedIn = await activeSnapshot(page);
  const checkedInEncounter = activeEncounter(checkedIn);
  expect(checkedInEncounter.checkInStatus).toBe("checked_in");
  expect(checkedIn.openChartEncounterId).toBeNull();
  const chartTab = await waitForFirstPatientReady(page);

  await chartTab.click();
  await expect(page.locator(".chart-panel")).toBeVisible();
  await waitForDecisionChoices(page);
  await page.screenshot({
    path: `${SCREENSHOTS}/staffed-checkin-chart-route-desktop.png`,
    fullPage: false,
    animations: "disabled",
  });

  const opened = await pollState(page, (state) => {
    const encounter = activeEncounter(state);
    return state.openChartEncounterId === encounter.id &&
      encounter.patientMovement?.destinationRoomInstanceId ===
        STARTER_EXAMINATION_ID && state;
  });
  const openedEncounter = activeEncounter(opened);
  expect(openedEncounter.patientMovement?.destinationRoomInstanceId).toBe(
    STARTER_EXAMINATION_ID,
  );
  expect(
    openedEncounter.patientMovement?.kind === "walking_to_care" ||
      at(openedEncounter.patientLocation, EXAMINATION_BED),
  ).toBe(true);
  expect(openedEncounter.patientMovement?.path?.at(-1) ?? openedEncounter.patientLocation).toEqual(EXAMINATION_BED);
  expect(opened.environment.founderActivity).toMatchObject({
    kind: "attend_encounter",
    targetId: openedEncounter.id,
  });
  expect(opened.environment.founderActivity?.path?.at(-1)).toEqual(EXAMINATION_STOOL);

  // This inspects the renderer's live read-only view projection; it never
  // writes or dispatches through the Phaser bridge.
  const liveRoute = await page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as (HTMLDivElement & {
      __facilityGame: { scene: { getScene: (key: string) => { bridge: { viewModel: { patients: Array<{ location: Point; moving: boolean; path: Point[] }>; founder: { location: Point; moving: boolean; path: Point[] } } } } } };
    });
    const model = host.__facilityGame.scene.getScene("facility-scene").bridge.viewModel;
    return { patient: model.patients[0], founder: model.founder };
  });
  expect(liveRoute.patient.location).toBeTruthy();
  expect(liveRoute.founder.location).toBeTruthy();

  await page.getByRole("button", { name: "Close patient chart" }).click();
  const closed = await pollState(page, (state) => {
    const encounter = activeEncounter(state);
    return state.openChartEncounterId === null &&
      (encounter.patientMovement?.kind === "walking_to_waiting" ||
        encounter.waitingDestination !== null) && state;
  });
  const closedEncounter = activeEncounter(closed);
  expect(closedEncounter.patientMovement?.destinationRoomInstanceId).not.toBe(STARTER_EXAMINATION_ID);
  expect(closedEncounter.waitingDestination).toBeTruthy();
  expect(
    closed.environment.founderActivity === null ||
      closed.environment.founderActivity.kind === "return_to_front_desk",
  ).toBe(true);

});

test("unattended check-in waits through minute sixty then emits one Front Desk alert", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "Canonical desktop Chromium proof only.");
  testInfo.setTimeout(90_000);
  await startClinic(page, "Unstaffed Proof Founder", "Unstaffed Proof Clinic");
  expect(new URL(page.url()).origin).toBe("http://127.0.0.1:4173");
  await page.getByRole("button", { name: "Pause facility time" }).click();
  const fixture = await installUnstaffedMinuteSixtyFixture(page);
  await page.goto("/?prototype-tools=0");
  await page.getByRole("button", { name: "Resume Unstaffed Proof Clinic" }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();

  const minuteSixty = await activeSnapshot(page);
  expect(minuteSixty.facilityTick).toBe(60);
  expect(activeEncounter(minuteSixty).checkInStatus).toBe("awaiting_staff");
  expect(minuteSixty.events.filter((event) => event.definitionId === "alert.patient.check-in-unattended")).toHaveLength(0);
  expect(activeEncounter(minuteSixty).patientSatisfaction).toBe(fixture.satisfaction);
  await expect(page.locator(".patient-folder.is-waiting .patient-tab")).toHaveCount(0);

  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  const overdue = await pollState(page, (state) => {
    const encounter = state.encounters[fixture.encounterId];
    return state.facilityTick >= 61 && encounter?.unstaffedCheckInOverdueApplied === true && state;
  });
  await page.getByRole("button", { name: "Pause facility time" }).click();
  const overdueEncounter = overdue.encounters[fixture.encounterId]!;
  const overdueEvents = overdue.events.filter(
    (event) => event.definitionId === "alert.patient.check-in-unattended",
  );
  expect(overdueEvents).toHaveLength(1);
  expect(overdueEvents[0]?.target).toEqual({ kind: "room", id: "room.instance.founder_desk" });
  expect(overdueEncounter.checkInStatus).toBe("awaiting_staff");
  expect(overdueEncounter.patientSatisfaction).toBeLessThan(fixture.satisfaction);
  await expect(page.locator(".patient-folder.is-waiting .patient-tab")).toHaveCount(0);
  const alertText = await page.locator(".event-message-board").innerText();
  expect(alertText).toMatch(/Front Desk/i);
  expect(alertText).not.toMatch(/Open chart/i);

  // Use a fresh page in the same browser context: the fixture's init script
  // intentionally remains on the setup page, so a same-page reload would
  // re-install minute sixty instead of testing the persisted post-tick save.
  const verifyPage = await page.context().newPage();
  await verifyPage.goto("/?prototype-tools=0");
  await verifyPage.getByRole("button", { name: "Resume Unstaffed Proof Clinic" }).click();
  const afterReload = await activeSnapshot(verifyPage);
  expect(afterReload.events.filter((event) => event.definitionId === "alert.patient.check-in-unattended")).toHaveLength(1);
  await verifyPage.close();
});
