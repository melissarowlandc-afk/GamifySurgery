import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";

import {
  getActiveState,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
  waitForFirstPatientReady,
} from "./helpers";

const SCREENSHOTS = "artifacts/screenshots";
const CLINIC_NAME = "GS-016 Fresh Clinic";

type RoomSnapshot = {
  id: string;
  roomDefinitionId: string;
  x: number;
  y: number;
};

type DoorSnapshot = {
  id: string;
  roomId: string;
  side: string;
  offset: number;
};

type ClinicalState = Awaited<ReturnType<typeof getActiveState>> & {
  openChartEncounterId: string | null;
  encounters: Record<string, {
    id: string;
    resolutionReason: "completed" | "walkout" | null;
    currentNodeIndex: number;
    frozenCase: {
      decisionNodes: Array<{
        answerChoices: Array<{ label: string; isCorrect: boolean }>;
      }>;
    };
  }>;
  rooms: RoomSnapshot[];
  doors: DoorSnapshot[];
};

test.beforeAll(() => mkdirSync(SCREENSHOTS, { recursive: true }));

async function state(page: Page): Promise<ClinicalState> {
  return await getActiveState(page) as ClinicalState;
}

async function dismissCoach(page: Page): Promise<boolean> {
  const button = page.getByRole("button", { name: "Got It" });
  if (await button.isVisible({ timeout: 500 }).catch(() => false)) {
    await button.click();
    return true;
  }
  return false;
}

async function chooseCurrentCorrectAnswer(page: Page): Promise<void> {
  await waitForDecisionChoices(page);
  const current = await state(page);
  const encounter = current.encounters[current.openChartEncounterId!];
  if (!encounter) throw new Error("Expected an open tutorial chart.");
  const correct = encounter.frozenCase.decisionNodes[
    encounter.currentNodeIndex
  ]!.answerChoices.find((choice) => choice.isCorrect);
  if (!correct) throw new Error("Expected a correct tutorial answer.");
  await page.getByRole("button", {
    name: new RegExp(
      `^${correct.label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
    ),
  }).click();
}

async function resolveCompletedChart(page: Page): Promise<void> {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    if (await dismissCoach(page)) continue;
    const flip = page.getByRole("button", {
      name: /Flip for (?:M|m)ore Disease Information/,
    });
    if (await flip.isVisible({ timeout: 300 }).catch(() => false)) {
      await flip.click();
      continue;
    }
    const resolve = page.getByRole("button", {
      name: "Resolve Completed Chart",
    });
    if (await resolve.isVisible({ timeout: 300 }).catch(() => false)) {
      await resolve.click();
      return;
    }
    await page.waitForTimeout(100);
  }
  throw new Error("Completed tutorial chart did not expose Resolve Completed Chart.");
}

async function facilityLayout(page: Page): Promise<{
  originX: number;
  originY: number;
  tileSize: number;
}> {
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as
      | (HTMLDivElement & { __facilityGame?: unknown })
      | null;
    return Boolean(host?.__facilityGame);
  });
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as
      HTMLDivElement & {
        __facilityGame: {
          scene: {
            getScene: (key: string) => {
              layout: { originX: number; originY: number; tileSize: number };
            };
          };
        };
      };
    const { originX, originY, tileSize } =
      host.__facilityGame.scene.getScene("facility-scene").layout;
    return { originX, originY, tileSize };
  });
}

test("a fresh player campaign builds and retains its first Examination Room", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "Canonical desktop Chromium proof only.",
  );
  testInfo.setTimeout(240_000);

  await startClinic(page, "GS-016 Founder", CLINIC_NAME);
  let current = await state(page);
  expect(current.rooms.map((room) => room.roomDefinitionId)).toEqual([
    "room.front_desk",
  ]);
  expect(current.doors).toHaveLength(1);
  await page.screenshot({
    path: `${SCREENSHOTS}/gs-016-fresh-no-examination-room.png`,
    fullPage: false,
    animations: "disabled",
  });

  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  await page.getByRole("button", { name: `Resume ${CLINIC_NAME}` }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  current = await state(page);
  expect(current.rooms.some(
    (room) => room.roomDefinitionId === "room.examination",
  )).toBe(false);

  await setFastFacilitySpeed(page);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect(page.getByRole("heading", {
    name: "Your first patient is entering the clinic",
  })).toBeVisible();
  await dismissCoach(page);
  const firstPatient = await waitForFirstPatientReady(page);
  await firstPatient.click();
  await dismissCoach(page);
  await chooseCurrentCorrectAnswer(page);
  await resolveCompletedChart(page);

  await expect(page.getByRole("heading", {
    name: "Use quiet moments around the clinic",
  })).toBeVisible();
  await dismissCoach(page);

  const secondArrivalCoach = page.locator(".tutorial-coach").filter({
    hasText: "Second patient",
  });
  const secondArrivalHeading = secondArrivalCoach.getByRole("heading");
  await expect(secondArrivalHeading).toBeVisible({ timeout: 20_000 });
  const secondPatientName = (
    (await secondArrivalHeading.textContent()) ?? ""
  ).replace(/ is entering the clinic$/, "");
  await dismissCoach(page);
  const secondPatient = page
    .locator(".patient-folder.is-waiting .patient-tab")
    .filter({ hasText: secondPatientName });
  await expect(secondPatient).toBeVisible({ timeout: 20_000 });
  await secondPatient.click();
  await dismissCoach(page);
  await chooseCurrentCorrectAnswer(page);
  await dismissCoach(page);
  await page.getByRole("button", { name: "Enact Plan" }).click();
  const returnToClinic = page.getByRole("button", { name: "Return to clinic" });
  if (await returnToClinic.isVisible({ timeout: 2_000 }).catch(() => false)) {
    await returnToClinic.click();
  }
  await dismissCoach(page);
  const activeSecondPatient = page
    .locator(".patient-folder.is-active .patient-tab")
    .filter({ hasText: secondPatientName });
  await expect(activeSecondPatient).toHaveAccessibleName(/Action required/, {
    timeout: 70_000,
  });
  await dismissCoach(page);
  await activeSecondPatient.click();
  await dismissCoach(page);
  await chooseCurrentCorrectAnswer(page);
  await resolveCompletedChart(page);

  const completed = await state(page);
  expect(
    Object.values(completed.encounters).filter(
      (encounter) => encounter.resolutionReason === "completed",
    ),
  ).toHaveLength(2);
  expect(completed.cash).toBeGreaterThanOrEqual(160);

  await page.getByRole("button", { name: "Enter Build Mode" }).click();
  const examinationCard = page.locator(
    '[data-room-definition-id="room.examination"]',
  );
  await expect(examinationCard).toBeEnabled();
  await expect(examinationCard).toContainText("$160");
  const cashBeforeBuild = (await state(page)).cash;
  await examinationCard.click();
  const canvas = page.locator(".facility-host canvas");
  await expect(canvas).toBeVisible();
  let layout = await facilityLayout(page);
  await canvas.click({
    position: {
      x: layout.originX + (34 + 0.5) * layout.tileSize,
      y: layout.originY + (26 + 0.5) * layout.tileSize,
    },
  });
  await expect.poll(async () =>
    (await state(page)).rooms.filter(
      (room) => room.roomDefinitionId === "room.examination",
    ).length,
  ).toBe(1);
  const afterRoom = await state(page);
  expect(afterRoom.cash).toBe(cashBeforeBuild - 160);
  const examinationRoom = afterRoom.rooms.find(
    (room) => room.roomDefinitionId === "room.examination",
  )!;

  await page.getByRole("button", { name: "Place Door" }).click();
  layout = await facilityLayout(page);
  await canvas.click({
    position: {
      x: layout.originX + (34 + 1.5) * layout.tileSize,
      y: layout.originY + (26 + 2) * layout.tileSize,
    },
  });
  await expect.poll(async () =>
    (await state(page)).doors.filter(
      (door) => door.roomId === examinationRoom.id,
    ).length,
  ).toBe(1);
  await page.getByRole("button", { name: "Done / Save" }).click();
  await expect(page.getByRole("button", { name: "Enter Build Mode" })).toBeVisible();
  await page.screenshot({
    path: `${SCREENSHOTS}/gs-016-player-built-examination-room.png`,
    fullPage: false,
    animations: "disabled",
  });

  await page.reload();
  await page.getByRole("button", { name: `Resume ${CLINIC_NAME}` }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const restored = await state(page);
  expect(restored.rooms.filter(
    (room) => room.roomDefinitionId === "room.examination",
  )).toEqual([
    expect.objectContaining({ id: examinationRoom.id, x: 34, y: 26 }),
  ]);
  expect(restored.doors).toContainEqual(
    expect.objectContaining({ roomId: examinationRoom.id }),
  );
  expect(
    Object.values(restored.encounters).filter(
      (encounter) => encounter.resolutionReason === "completed",
    ),
  ).toHaveLength(2);
  expect(restored.clinicalXp).toBe(completed.clinicalXp);
});
