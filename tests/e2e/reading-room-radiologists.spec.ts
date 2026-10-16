import { mkdirSync } from "node:fs";
import { expect, test } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  deserializeGameState,
  gameReducer,
  serializeGameState,
} from "@gamify-surgery/game-domain";
import { getRadiologistReadingStation } from "../../packages/game-domain/src/reading-stations";
import { getProfile, PROFILE_KEY, startClinic } from "./helpers";

// Owner request (2026-10-07): hired radiologists sit at the four approved
// Reading Room desks. Hires four through the real HIRE_STAFF reducer, puts
// each on their workstation anchor, then checks seating and captures it.
// Run against a separate server, never the owner's 4173 origin, e.g.
// GAMIFY_E2E_EXTERNAL_SERVER=1 GAMIFY_E2E_BASE_URL=http://127.0.0.1:5175

const OUT = "artifacts/screenshots/reading-room-radiologists";

test("seats hired radiologists at the four Reading Room desks", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "One desktop capture.");
  test.setTimeout(120_000);
  mkdirSync(OUT, { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await startClinic(page, "Reading Reviewer", "Reading Room Readers");
  const profile = await getProfile(page);
  const index = profile.campaigns.findIndex((candidate) => candidate.campaignId === profile.activeCampaignId);
  let state = deserializeGameState(profile.campaigns[index]!.serializedState);
  state.paused = true; state.facilityLevel = 3; state.cash = 20_000; state.cashCents = 2_000_000;
  state.encounters = {}; state.serviceOperations = [];
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  // Same connected layout as the domain's reading-stations test: a hallway
  // from the Front Desk's west door up to the Reading Room's west door.
  state.rooms.push(
    { id: "room.readers", roomDefinitionId: "room.reading", x: 33, y: 20, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...Array.from({ length: 9 }, (_, i) => ({ id: `room.readers.hall.${i}`, roomDefinitionId: "room.hallway", x: 32, y: 20 + i, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.readers", roomId: "room.readers", side: "west", offset: 1, exterior: false },
    { id: "door.front.readers", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  for (let i = 1; i <= 4; i += 1) {
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: `hire.reader.${i}`, employeeId: `reader.${i}`, staffRoleDefinitionId: "staff.radiologist" });
  }
  expect(state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist")).toHaveLength(4);
  for (const employee of state.employees) {
    const station = getRadiologistReadingStation(state, employee, PROTOTYPE_DOMAIN_CONTEXT);
    if (!station) continue;
    employee.location = { ...station.location }; employee.path = []; employee.pathIndex = 0;
  }
  profile.campaigns[index] = { ...profile.campaigns[index]!, serializedState: serializeGameState(state) };
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: PROFILE_KEY, value: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await page.getByRole("button", { name: "Resume Reading Room Readers" }).click();
  await page.addStyleTag({ content: ".facility-pause-indicator,.tutorial-overlay,.modal-backdrop { visibility:hidden !important; }" });
  await page.waitForFunction(() => Boolean((document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame?.scene?.getScene("facility-scene")));

  const seated = await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    return scene.bridge.viewModel.staff
      .filter((staff: any) => staff.staffRoleDefinitionId === "staff.radiologist")
      .map((staff: any) => `${staff.supportRole}:${staff.supportId}`).sort();
  });
  expect(seated).toEqual([
    "reading-radiologist:northeast", "reading-radiologist:northwest",
    "reading-radiologist:southeast", "reading-radiologist:southwest",
  ]);

  await page.evaluate(() => {
    const scene = (document.querySelector("[data-testid='facility-canvas']") as any).__facilityGame.scene.getScene("facility-scene");
    scene.applyCamera({ ...scene.cameraView, zoom: 1.8, panX: 0, panY: 0 }); scene.refreshLayout(true);
    const l = scene.layout, room = scene.bridge.viewModel.rooms.find((r: any) => r.instanceId === "room.readers");
    const cx = l.originX + (room.tileX + 2) * l.tileSize, cy = l.originY + (room.tileY + 1.7) * l.tileSize;
    scene.applyCamera({ ...scene.cameraView, panX: scene.cameraView.panX + scene.scale.width / 2 - cx, panY: scene.cameraView.panY + scene.scale.height / 2 - cy });
    scene.refreshLayout(true);
  });
  await page.waitForTimeout(1500);
  await page.getByTestId("facility-canvas").screenshot({ path: `${OUT}/four-readers.png`, animations: "disabled" });
  expect(errors).toEqual([]);
});
