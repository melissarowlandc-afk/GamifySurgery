import { createHash } from "node:crypto";
import { mkdirSync, readFileSync } from "node:fs";
import { expect, test } from "@playwright/test";

import {
  getProfile,
  PROFILE_KEY,
  setFastFacilitySpeed,
  startClinic,
  waitForFirstPatientReady,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("renders the isolated rebuilt Front Desk with founder seated behind a checked-in patient", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The Front Desk reference capture uses one controlled desktop viewport.",
  );
  await page.setViewportSize({ width: 1806, height: 1014 });
  await startClinic(page, "Dr. Rowan Vale", "Vale Surgical Clinic");
  const initialTutorialDismiss = page.getByRole("button", {
    name: "Turn Off Tutorials",
  });
  if (await initialTutorialDismiss.isVisible()) {
    await initialTutorialDismiss.click();
  }
  const initialResumeTime = page.getByRole("button", {
    name: "Resume facility time",
  });
  if (await initialResumeTime.isVisible()) await initialResumeTime.click();
  await setFastFacilitySpeed(page);
  await waitForFirstPatientReady(page);
  // Stop the running source session before touching its persisted profile.
  // Otherwise its debounced autosave can overwrite this controlled paused
  // state while the test is navigating to the isolated capture.
  const pauseSourceTime = page.getByRole("button", {
    name: "Pause facility time",
  });
  if (await pauseSourceTime.isVisible()) await pauseSourceTime.click();
  await expect(
    page.getByRole("button", { name: "Resume facility time" }),
  ).toBeVisible();

  const profile = await getProfile(page);
  const active = profile.campaigns.find(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (!active) throw new Error("Active visual campaign is missing.");
  const state = JSON.parse(active.serializedState) as {
    paused?: boolean;
    nextRoutineArrivalTick?: number;
    environment: { founderLocation: { x: number; y: number }; founderActivity: unknown; ambientPedestrians?: unknown[] };
    rooms: Array<{
      id: string;
      roomDefinitionId: string;
      x: number;
      y: number;
    }>;
    encounters: Record<string, { patientLocation?: { x: number; y: number }; assignedRoomInstanceId?: string | null; lifecycle?: string; patientMovement?: unknown; pendingResult?: unknown }>;
  };
  const frontDesk = state.rooms.find(
    (room) => room.roomDefinitionId === "room.front_desk",
  );
  if (!frontDesk) throw new Error("Front Desk is missing from visual state.");
  const staffAnchor = { x: frontDesk.x + 2, y: frontDesk.y + 1 };
  const publicAnchor = { x: frontDesk.x + 2, y: frontDesk.y + 3 };
  state.environment.founderLocation = staffAnchor;
  state.environment.founderActivity = null;
  state.environment.ambientPedestrians = [];
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  // Freeze the controlled composition before persisting it. The capture must
  // prove D3 on the public side of the counter, never a moving simulation
  // frame that has reassigned the patient to a waiting or staff-adjacent tile.
  state.paused = true;
  const [[controlledEncounterId, patient], ...otherEncounterEntries] =
    Object.entries(state.encounters);
  if (patient) {
    patient.patientLocation = publicAnchor;
    patient.assignedRoomInstanceId = "room.instance.founder_desk";
    // An action-ready serialized encounter does not enter the automatic
    // waiting-anchor allocator during the single capture frame, so the
    // public-side anchor remains a deterministic visual proof.
    patient.lifecycle = "active_action_required";
    patient.patientMovement = null;
    patient.pendingResult = null;
    expect(patient.patientLocation).toEqual(publicAnchor);
  }
  // The controlled capture has exactly one public-side patient, not a live
  // arrival procession or an incidental passerby.
  for (const [, encounter] of otherEncounterEntries) {
    encounter.lifecycle = "resolved";
    encounter.patientMovement = null;
    encounter.pendingResult = null;
  }
  active.serializedState = JSON.stringify(state);
  // This capture deliberately proves the room itself, not tutorial overlay
  // placement. Tutorial behavior has its own focused browser coverage.
  profile.tutorialsEnabled = false;
  await page.evaluate(
    ({ profileKey, nextProfile }) => {
      window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    },
    { profileKey: PROFILE_KEY, nextProfile: profile },
  );
  // Load the controlled profile in a second page. Navigating the source page
  // would fire its page-hide saver and could overwrite localStorage with the
  // pre-controlled live state between this write and the capture.
  const capturePage = await page.context().newPage();
  await capturePage.setViewportSize({ width: 1806, height: 1014 });
  await capturePage.goto("/?prototype-tools=0");
  const resume = capturePage.getByRole("button", {
    name: "Resume Vale Surgical Clinic",
  });
  if (await resume.isVisible()) await resume.click();
  const turnOffTutorials = capturePage.getByRole("button", {
    name: "Turn Off Tutorials",
  });
  if (await turnOffTutorials.isVisible()) await turnOffTutorials.click();
  const facility = capturePage.locator(".facility-frame");
  await expect(facility).toBeVisible();
  // Re-read the persisted campaign after the application has hydrated it.
  // This is a state-level proof that the real rendered scene is still paused
  // with the public patient at Front Desk D3, rather than a screenshot-only
  // convention that can silently drift on a simulation tick.
  const hydratedProfile = await getProfile(capturePage);
  const hydratedCampaign = hydratedProfile.campaigns.find(
    (campaign) => campaign.campaignId === hydratedProfile.activeCampaignId,
  );
  if (!hydratedCampaign) throw new Error("Hydrated visual campaign is missing.");
  const hydratedState = JSON.parse(hydratedCampaign.serializedState) as {
    paused?: boolean;
    facilityTick?: number;
    environment: { founderLocation?: { x: number; y: number } };
    encounters: Record<string, {
      patientLocation?: { x: number; y: number };
      patientMovement?: unknown;
      lifecycle?: string;
    }>;
  };
  expect(hydratedState.paused).toBe(true);
  expect(hydratedState.environment.founderLocation).toEqual(staffAnchor);
  expect(
    controlledEncounterId
      ? hydratedState.encounters[controlledEncounterId]?.patientLocation
      : undefined,
  ).toEqual(publicAnchor);
  // The campaign remains genuinely paused. Hide only its informational banner
  // in the visual proof so it cannot mask the rear wall at closer Level 0
  // framing; pause behavior is verified independently.
  await capturePage.addStyleTag({
    content: ".facility-pause-indicator { visibility: hidden !important; }",
  });
  // This is the owner-facing proof: the ordinary full application at the
  // relaunch-scale viewport, before a developer zoom crop is applied.
  await capturePage.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/front-desk-v4-shell-normal.png`,
    animations: "disabled",
  });
  const normalExteriorProof = `${SCREENSHOT_DIRECTORY}/front-desk-v4-shell-normal.png`;
  const normalExteriorDigest = createHash("sha256")
    .update(readFileSync(normalExteriorProof))
    .digest("hex");
  // The entrance-oriented default view begins at the southern camera clamp.
  // Drag the world downward toward the northern map view, rather than upward
  // into that clamp. World-anchored sidewalk/curb/planters must therefore
  // leave the viewport below the room; a fixed viewport band would not.
  const canvas = capturePage.getByTestId("facility-canvas");
  const canvasBox = await canvas.boundingBox();
  if (!canvasBox) throw new Error("Facility canvas bounds are unavailable.");
  const panX = canvasBox.x + canvasBox.width * 0.18;
  const panStartY = canvasBox.y + canvasBox.height * 0.2;
  const panEndY = canvasBox.y + canvasBox.height * 0.75;
  await capturePage.mouse.move(panX, panStartY);
  await capturePage.mouse.down();
  await capturePage.mouse.move(panX, panEndY, { steps: 12 });
  await capturePage.mouse.up();
  await capturePage.waitForTimeout(150);
  const pannedExteriorProof = `${SCREENSHOT_DIRECTORY}/front-desk-exterior-panned.png`;
  await capturePage.screenshot({
    path: pannedExteriorProof,
    animations: "disabled",
  });
  const pannedExteriorDigest = createHash("sha256")
    .update(readFileSync(pannedExteriorProof))
    .digest("hex");
  // A matching digest would mean either the drag clamped or the visual band
  // is still screen-pinned. This is deliberately an actual-app proof rather
  // than a helper-only coordinate assertion.
  expect(pannedExteriorDigest).not.toBe(normalExteriorDigest);
  await capturePage.mouse.move(panX, panEndY);
  await capturePage.mouse.down();
  await capturePage.mouse.move(panX, panStartY, { steps: 12 });
  await capturePage.mouse.up();
  await capturePage.waitForTimeout(100);
  // A viewport-local detail proof retains the same fresh-session camera as
  // normal play. It must show the entire shell from its deep rear frame to
  // the south entrance rather than hiding clipped art behind a capture zoom.
  await facility.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/front-desk-v4-shell-detail.png`,
    animations: "disabled",
  });
  await facility.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/front-desk-grounded-occupied.png`,
    animations: "disabled",
  });
  await capturePage.close();

  // The vacant proof changes actual persisted actor state: it does not hide a
  // chair or founder with CSS. The logical B3 anchor is therefore genuinely
  // vacant when the full application redraws the Front Desk.
  state.environment.founderLocation = {
    x: frontDesk.x + 1,
    y: frontDesk.y + 3,
  };
  if (patient) {
    patient.lifecycle = "resolved";
    patient.patientMovement = null;
    patient.pendingResult = null;
  }
  active.serializedState = JSON.stringify(state);
  await page.evaluate(
    ({ profileKey, nextProfile }) => {
      window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    },
    { profileKey: PROFILE_KEY, nextProfile: profile },
  );
  const vacantPage = await page.context().newPage();
  await vacantPage.setViewportSize({ width: 1806, height: 1014 });
  await vacantPage.goto("/?prototype-tools=0");
  const resumeVacant = vacantPage.getByRole("button", {
    name: "Resume Vale Surgical Clinic",
  });
  if (await resumeVacant.isVisible()) await resumeVacant.click();
  const vacantTutorialDismiss = vacantPage.getByRole("button", {
    name: "Turn Off Tutorials",
  });
  if (await vacantTutorialDismiss.isVisible()) await vacantTutorialDismiss.click();
  const vacantFacility = vacantPage.locator(".facility-frame");
  await expect(vacantFacility).toBeVisible();
  const vacantProfile = await getProfile(vacantPage);
  const vacantCampaign = vacantProfile.campaigns.find(
    (campaign) => campaign.campaignId === vacantProfile.activeCampaignId,
  );
  if (!vacantCampaign) throw new Error("Vacant visual campaign is missing.");
  const vacantState = JSON.parse(vacantCampaign.serializedState) as {
    environment: { founderLocation?: { x: number; y: number } };
  };
  expect(vacantState.environment.founderLocation).not.toEqual(staffAnchor);
  await vacantPage.addStyleTag({
    content: ".facility-pause-indicator { visibility: hidden !important; }",
  });
  await vacantFacility.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/front-desk-grounded-vacant.png`,
    animations: "disabled",
  });
  await vacantPage.close();
});
