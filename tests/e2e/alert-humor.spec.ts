import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import {
  PROFILE_KEY,
  getProfile,
  startClinic,
} from "./helpers";

const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

interface MutableAlertFixtureState {
  campaignId: string;
  facilityLevel: number;
  facilityTick: number;
  paused: boolean;
  cash: number;
  cashCents: number;
  advertisingLevel: number;
  employees: unknown[];
  encounters: Record<string, Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  environment: {
    waterCoolerFillPercent: number;
    litterItems: unknown[];
    [key: string]: unknown;
  };
  alertHumor: {
    alertsTutorialAcknowledgedAtTick: number | null;
    nextAmbientAlertTick: number | null;
    ambientSequence: number;
    ambientCycle: number;
    ambientUsedDefinitionIds: string[];
    recentAmbientDefinitionIds: string[];
    recentWalkoutReviewVariantIds: string[];
  };
}

/**
 * Installs a production-shaped v6 campaign state with five semantic alert
 * categories. The feed itself is still assembled by the real session
 * selectors, registry renderer, priority sorter, and AppShell target router.
 */
async function installMixedAlertCampaign(page: Page): Promise<void> {
  await startClinic(
    page,
    "Alert Test Founder",
    "Alert Humor Surgical Clinic",
  );
  const profile = await getProfile(page);
  const activeIndex = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  expect(activeIndex).toBeGreaterThanOrEqual(0);
  const active = profile.campaigns[activeIndex]!;
  const state = JSON.parse(
    active.serializedState,
  ) as MutableAlertFixtureState;
  const patient = Object.values(state.encounters)[0];
  if (!patient) {
    throw new Error("The alert fixture needs the first tutorial encounter.");
  }

  state.facilityLevel = 1;
  state.facilityTick = 45;
  state.paused = true;
  state.cash = 1_000;
  state.cashCents = 100_000;
  state.advertisingLevel = 1;
  state.employees = [];
  state.environment = {
    ...state.environment,
    waterCoolerFillPercent: 100,
    litterItems: [],
    facilityConditionOccurrenceSequence: 1,
    facilityConditionOccurrences: [
      {
        id: "facility-condition.no_receptionist.1",
        conditionKey: "no_receptionist",
        kind: "onset",
        occurredAtFacilityTick: 41,
        resolvedAtFacilityTick: null,
        definitionId: "alert.staff.receptionist-recommended",
        message:
          "Patients are checking themselves in with the confidence of people who did not read the form. Hire a receptionist to speed up check-in.",
        priority: "informational",
        target: {
          kind: "staff_role",
          id: "staff.receptionist",
        },
      },
    ],
  };
  state.alertHumor = {
    alertsTutorialAcknowledgedAtTick: 20,
    nextAmbientAlertTick: 100,
    ambientSequence: 1,
    ambientCycle: 0,
    ambientUsedDefinitionIds: ["alert.ambient.06"],
    recentAmbientDefinitionIds: ["alert.ambient.06"],
    recentWalkoutReviewVariantIds: ["alert.review.general.02"],
  };

  patient.lifecycle = "waiting_unopened";
  patient.resolutionReason = null;
  patient.patientSatisfaction = 86;
  patient.finalPatientSatisfaction = null;
  patient.patientMovement = null;
  patient.patientLocation = { x: 34, y: 30 };
  patient.idleWaitingSinceTick = 39;
  patient.feedAttentionKind = "checked_in";
  patient.feedAttentionStartedAtTick = 39;
  patient.waiting = {
    ...(patient.waiting as Record<string, unknown>),
    arrivedAtTick: 39,
    patienceExempt: false,
    warningIssued: false,
  };

  state.events = [
    {
      id: "event.e2e.suppressed.expense",
      type: "operating_expense",
      facilityTick: 35,
      encounterId: null,
      message: "Operating costs -$4.00.",
      priority: "informational",
      definitionId: "alert.finance.expense",
      target: {
        kind: "campaign",
        id: state.campaignId,
      },
    },
    {
      id: "event.e2e.suppressed.decision",
      type: "clinical_decision_recorded",
      facilityTick: 36,
      encounterId: "encounter.e2e",
      message:
        "Casey Morgan: correct decision recorded. +10 Learning XP.",
      priority: "informational",
      definitionId: "event.clinical.decision-correct",
      target: {
        kind: "encounter",
        id: "encounter.e2e",
      },
    },
    {
      id: "event.e2e.suppressed.glp1",
      type: "emergency_glp1_consultation",
      facilityTick: 37,
      encounterId: null,
      message: "Emergency GLP-1 consultation completed: +$25.",
      priority: "informational",
      definitionId: "alert.finance.emergency-glp1-completed",
      target: {
        kind: "campaign",
        id: state.campaignId,
      },
    },
    {
      id: "event.e2e.suppressed.build",
      type: "room_placed",
      facilityTick: 38,
      encounterId: null,
      message: "Waiting Room opened.",
      priority: "informational",
      definitionId: "alert.success.waiting-room-constructed",
      alertCategory: "success",
      target: {
        kind: "room",
        id: "room.e2e.waiting",
      },
    },
    {
      id: "event.e2e.success",
      type: "success_message",
      facilityTick: 39,
      encounterId: null,
      message:
        "First patient resolved. The clinic remains structurally optimistic.",
      priority: "informational",
      definitionId:
        "alert.success.first-ordinary-patient-resolved",
      alertCategory: "success",
      alertVariantId:
        "alert.success.first-ordinary-patient-resolved.default",
      target: null,
    },
    {
      id: "event.e2e.suppressed.trash-cleaned",
      type: "litter_collected",
      facilityTick: 40,
      encounterId: null,
      message:
        "Trash removed. The floor has been returned to the floor.",
      priority: "informational",
      definitionId: "alert.success.trash-cleaned",
      alertCategory: "success",
      target: {
        kind: "campaign",
        id: state.campaignId,
      },
    },
    {
      id: "event.e2e.suppressed.water-refilled",
      type: "water_cooler_refilled",
      facilityTick: 41,
      encounterId: null,
      message:
        "Water cooler refilled. Hydration has resumed normal operations.",
      priority: "informational",
      definitionId: "alert.success.water-refilled",
      alertCategory: "success",
      target: {
        kind: "campaign",
        id: state.campaignId,
      },
    },
    {
      id: "event.e2e.review",
      type: "left_before_seen",
      facilityTick: 42,
      encounterId: null,
      message:
        "New 1-star review from Casey Morgan: The plant was attentive.",
      priority: "informational",
      definitionId: "alert.review.general",
      alertCategory: "walkout_review",
      alertVariantId: "alert.review.general.02",
      walkoutReview: {
        rating: 1,
        cause: "excessive_waiting",
      },
      target: null,
    },
    {
      id: "event.e2e.ambient",
      type: "ambient_message",
      facilityTick: 43,
      encounterId: null,
      message: "The coffee is technically warm.",
      priority: "flavor",
      definitionId: "alert.ambient.06",
      alertCategory: "ambient_flavor",
      alertVariantId: "alert.ambient.06.default",
      target: {
        kind: "campaign",
        id: state.campaignId,
      },
    },
  ];

  profile.campaigns[activeIndex] = {
    ...active,
    serializedState: JSON.stringify(state),
  };
  profile.tutorialsEnabled = false;
  await page.addInitScript(
    ({ profileKey, nextProfile }) => {
      window.localStorage.setItem(
        profileKey,
        JSON.stringify(nextProfile),
      );
    },
    { profileKey: PROFILE_KEY, nextProfile: profile },
  );

  await page.goto("/?prototype-tools=0");
  const resume = page.getByRole("button", {
    name: `Resume ${active.name}`,
  });
  await expect(resume).toBeVisible();
  await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect(page.locator(".event-message-board")).toBeVisible();
}

async function expectFeedFitsViewport(page: Page): Promise<void> {
  const board = page.locator(".event-message-board");
  await board.scrollIntoViewIfNeeded();
  await expect(board).toBeVisible();
  const boardBox = await board.boundingBox();
  expect(boardBox).not.toBeNull();
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();
  expect(boardBox!.x).toBeGreaterThanOrEqual(0);
  expect(boardBox!.x + boardBox!.width).toBeLessThanOrEqual(
    viewport!.width + 1,
  );

  const overflow = await board.evaluate((element) => ({
    boardScrollWidth: element.scrollWidth,
    boardClientWidth: element.clientWidth,
    overflowingItems: [
      ...element.querySelectorAll<HTMLElement>(
        ".message-board-item",
      ),
    ].filter((item) => item.scrollWidth > item.clientWidth + 1).length,
  }));
  expect(overflow.boardScrollWidth).toBeLessThanOrEqual(
    overflow.boardClientWidth + 1,
  );
  expect(overflow.overflowingItems).toBe(0);

  const rowLayout = await board
    .locator(".message-board-feed > .message-board-item")
    .evaluateAll((entries) =>
      entries.map((entry) => {
        const bounds = entry.getBoundingClientRect();
        const descendantBottoms = [
          ...entry.querySelectorAll<HTMLElement>("*"),
        ].map((descendant) => descendant.getBoundingClientRect().bottom);
        return {
          top: bounds.top,
          bottom: bounds.bottom,
          contentBottom: Math.max(bounds.top, ...descendantBottoms),
          clientHeight: entry.clientHeight,
          scrollHeight: entry.scrollHeight,
        };
      }),
    );
  expect(rowLayout.length).toBeGreaterThan(0);
  for (const [index, row] of rowLayout.entries()) {
    expect(
      row.scrollHeight,
      `Alert row ${index + 1} must grow to contain wrapped text.`,
    ).toBeLessThanOrEqual(row.clientHeight + 1);
    expect(
      row.contentBottom,
      `Alert row ${index + 1} content must remain inside its own box.`,
    ).toBeLessThanOrEqual(row.bottom + 1);
    const next = rowLayout[index + 1];
    if (next) {
      expect(
        next.top,
        `Alert rows ${index + 1} and ${index + 2} must not overlap.`,
      ).toBeGreaterThanOrEqual(row.bottom - 1);
    }
  }
}

test.beforeAll(() => {
  mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true });
});

test("mixed alert categories preserve attention markers and focus the receptionist control", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The deterministic alert handoff is captured once at desktop width.",
  );
  await installMixedAlertCampaign(page);

  const board = page.locator(".event-message-board");
  for (const category of [
    "action_required",
    "guidance",
    "success",
    "ambient_flavor",
    "walkout_review",
  ]) {
    await expect(
      board.locator(
        `.message-board-item[data-message-category="${category}"]`,
      ),
    ).not.toHaveCount(0);
  }
  for (const suppressedCopy of [
    "Operating costs -$4.00.",
    "correct decision recorded",
    "Emergency GLP-1 consultation completed",
    "Waiting Room opened.",
    "Trash removed. The floor has been returned to the floor.",
    "Water cooler refilled. Hydration has resumed normal operations.",
  ]) {
    await expect(board).not.toContainText(suppressedCopy);
  }

  const items = board.locator(".message-board-item");
  const markerAudit = await items.evaluateAll((entries) =>
    entries.map((entry) => ({
      category: entry.getAttribute("data-message-category"),
      attention: entry.getAttribute("data-attention-marker"),
      icon:
        entry
          .querySelector(".message-board-priority-icon")
          ?.textContent?.trim() ?? "",
    })),
  );
  expect(markerAudit.filter((item) => item.attention === "true")).not
    .toHaveLength(0);
  for (const item of markerAudit) {
    if (item.category === "action_required") {
      expect(item.attention).toBe("true");
      expect(item.icon).toBe("!");
    } else {
      expect(item.attention).toBe("false");
      expect(item.icon).not.toBe("!");
    }
  }
  const rowCopy = await items.allTextContents();
  expect(
    rowCopy.findIndex((copy) =>
      copy.includes("The coffee is technically warm."),
    ),
  ).toBeLessThan(
    rowCopy.findIndex((copy) =>
      copy.includes("Hire a receptionist to speed up check-in."),
    ),
  );

  const receptionistGuidance = board
    .locator(
      '.message-board-item[data-message-category="guidance"]',
    )
    .filter({ hasText: "Hire a receptionist to speed up check-in." });
  await expect(receptionistGuidance).toHaveCount(1);
  await receptionistGuidance.locator("button").click();
  await expect(page.locator(".management-panel")).toBeVisible();
  await expect(page.locator(".operations-column .staff-panel")).toHaveCount(0);
  await expect(
    page.locator(
      '[data-staff-role-id="staff.receptionist"].is-alert-highlighted',
    ),
  ).toBeVisible();
  await expect(
    page.locator(
      '[data-staff-role-id="staff.receptionist"] [data-staff-role-hire]',
    ),
  ).toBeFocused();

  await expectFeedFitsViewport(page);
  await expect(board.locator(".message-board-history")).toHaveCount(0);
  const feed = board.locator(".message-board-feed");
  for (const category of [
    "action_required",
    "guidance",
    "success",
    "ambient_flavor",
    "walkout_review",
  ]) {
    await expect(
      feed.locator(`[data-message-category="${category}"]`),
    ).not.toHaveCount(0);
  }
  await feed.evaluate((list) => {
    list.scrollTop = list.scrollHeight;
  });
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/alert-humor-feed-desktop.png`,
    fullPage: true,
    animations: "disabled",
  });
});

test("alert text wraps without horizontal overflow at phone width", async ({
  page,
}, testInfo) => {
  test.skip(
    testInfo.project.name !== "desktop-chrome",
    "The phone handoff uses one explicit, stable viewport.",
  );
  await page.setViewportSize({ width: 390, height: 844 });
  await installMixedAlertCampaign(page);

  const board = page.locator(".event-message-board");
  await expect(
    board.locator(
      '.message-board-item[data-message-category="walkout_review"]',
    ),
  ).toContainText("The plant was attentive");
  await expect(
    board.locator(
      '.message-board-item[data-message-category="ambient_flavor"]',
    ),
  ).toContainText("The coffee is technically warm");
  await expectFeedFitsViewport(page);

  await board.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/alert-humor-feed-phone.png`,
    animations: "disabled",
  });
});
