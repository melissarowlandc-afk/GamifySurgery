import { expect, type Locator, type Page } from "@playwright/test";

export const PROFILE_KEY = "gamify-surgery.prototype.profile.v1";
export const ACCESS_KEY = "gamify-surgery.prototype.access.v1";

export interface PersistedCampaign {
  campaignId: string;
  name: string;
  status: "resumable" | "archived";
  serializedState: string;
}

export interface PersistedProfile {
  activeCampaignId: string | null;
  tutorialsEnabled?: boolean;
  campaigns: PersistedCampaign[];
}

export interface PersistedGameState {
  campaignId: string;
  campaignSeed: string;
  cash: number;
  clinicalXp: number;
  facilityLevel: number;
  founder: {
    displayName: string;
    headId: string;
    bodyId: string;
    appearance: unknown;
  };
  rooms: unknown[];
  doors: unknown[];
  reviewIntents: unknown[];
  learningHistories: Record<string, { reviews: unknown[] }>;
}

interface MutableVisualGameState extends PersistedGameState {
  cashCents: number;
  paused: boolean;
  simulationSpeed: number;
  employees: unknown[];
  nextRoutineArrivalTick?: number;
  encounters: Record<string, Record<string, unknown>>;
  environment: {
    founderLocation: { x: number; y: number };
    founderActivity: unknown;
    [key: string]: unknown;
  };
}

export async function installRememberedLocalAccess(
  page: Page,
): Promise<void> {
  await page.addInitScript((storageKey) => {
    const now = Date.now();
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        mode: "local_prototype",
        issuedAtRealMs: now,
        expiresAtRealMs: now + 60 * 60 * 1_000,
      }),
    );
  }, ACCESS_KEY);
}

export async function openCampaignScreen(page: Page): Promise<void> {
  await installRememberedLocalAccess(page);
  // Handoff captures and normal walkthroughs exercise the player-facing UI.
  // Developer controls remain opt-in through ?prototype-tools=1.
  await page.goto("/?prototype-tools=0");
  await expect(
    page.getByRole("heading", { name: "Clinic Campaigns" }),
  ).toBeVisible();
}

export async function completeClinicOpening(
  page: Page,
  founderName = "Test Founder",
  clinicName = "Test Surgical Clinic",
): Promise<void> {
  await expect(
    page.getByRole("heading", { name: "Create Your Founder" }),
  ).toBeVisible();
  await page.getByLabel("Founder name").fill(founderName);
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Your rich grandpa died.")).toBeVisible();
  await expect(page.getByText("He left you $1,000,000.")).toBeVisible();
  await page
    .getByRole("button", { name: "Build a Surgery Clinic" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Name Your Clinic" }),
  ).toBeVisible();
  await page.getByLabel("Clinic name").fill(clinicName);
  await page.getByRole("button", { name: "Open the Clinic" }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

export async function startClinic(
  page: Page,
  founderName = "Test Founder",
  clinicName = "Test Surgical Clinic",
): Promise<void> {
  await openCampaignScreen(page);
  await page.getByRole("button", { name: "New Campaign" }).click();
  await completeClinicOpening(page, founderName, clinicName);
}

export async function setFastFacilitySpeed(page: Page): Promise<void> {
  const speedButton = page.getByRole("button", {
    name: "Set facility speed to 4x",
  });
  await expect(speedButton).toBeVisible();
  await speedButton.click();
  await expect(speedButton).toHaveAttribute("aria-pressed", "true");
}

export async function waitForFirstPatientReady(
  page: Page,
): Promise<Locator> {
  const patient = page
    .locator(".patient-folder.is-waiting .patient-tab")
    .first();
  await expect(patient).toBeVisible({ timeout: 15_000 });
  return patient;
}

export async function waitForDecisionChoices(
  page: Page,
): Promise<Locator> {
  const choices = page.locator(
    ".chart-step-column.is-current .answer-choice",
  );
  await expect(choices.first()).toBeVisible({ timeout: 15_000 });
  return choices;
}

export async function getProfile(page: Page): Promise<PersistedProfile> {
  return page.evaluate((profileKey) => {
    const raw = window.localStorage.getItem(profileKey);
    if (!raw) {
      throw new Error("Local campaign profile is missing.");
    }
    return JSON.parse(raw) as PersistedProfile;
  }, PROFILE_KEY);
}

export async function getActiveState(
  page: Page,
): Promise<PersistedGameState> {
  const profile = await getProfile(page);
  const active = profile.campaigns.find(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (!active) {
    throw new Error("Active campaign record is missing.");
  }
  return JSON.parse(active.serializedState) as PersistedGameState;
}

/**
 * Builds a deterministic Level 1 visual-review state from a real newly
 * created campaign. This is test-only setup: the application still loads and
 * renders the ordinary persisted campaign through its production migration,
 * selectors, Phaser scene, and React UI.
 */
export async function installLevelOneVisualState(
  page: Page,
): Promise<void> {
  const profile = await getProfile(page);
  const activeIndex = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (activeIndex < 0) {
    throw new Error("Active campaign record is missing.");
  }
  const active = profile.campaigns[activeIndex]!;
  const state = JSON.parse(
    active.serializedState,
  ) as MutableVisualGameState;

  state.facilityLevel = 1;
  state.clinicalXp = 64;
  state.cash = 2_460;
  state.cashCents = 246_000;
  state.paused = true;
  state.simulationSpeed = 1;
  state.rooms = [
    {
      id: "room.instance.founder_desk",
      roomDefinitionId: "room.front_desk",
      x: 33,
      y: 28,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 98,
    },
    {
      id: "room.visual.waiting",
      roomDefinitionId: "room.waiting",
      x: 29,
      y: 28,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 2,
      cleanliness: 96,
    },
    {
      id: "room.visual.examination",
      roomDefinitionId: "room.examination",
      x: 33,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 2,
      cleanliness: 100,
    },
    {
      id: "room.visual.bathroom",
      roomDefinitionId: "room.bathroom",
      x: 36,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 2,
      cleanliness: 94,
    },
    {
      id: "room.visual.imaging_control",
      roomDefinitionId: "room.imaging_control",
      x: 31,
      y: 26,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 2,
      cleanliness: 100,
    },
    {
      id: "room.visual.xray",
      roomDefinitionId: "room.xray",
      x: 28,
      y: 25,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 2,
      cleanliness: 97,
    },
    {
      id: "room.visual.minor_procedure",
      roomDefinitionId: "room.minor_procedure",
      x: 38,
      y: 28,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 2,
      cleanliness: 99,
    },
  ];
  state.doors = [
    {
      id: "door.instance.front_entrance",
      roomId: "room.instance.founder_desk",
      side: "south",
      offset: 2,
      exterior: true,
    },
    {
      id: "door.visual.waiting.front",
      roomId: "room.visual.waiting",
      side: "east",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.visual.exam.front",
      roomId: "room.visual.examination",
      side: "south",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.visual.bath.front",
      roomId: "room.visual.bathroom",
      side: "south",
      offset: 0,
      exterior: false,
    },
    {
      id: "door.visual.procedure.front",
      roomId: "room.visual.minor_procedure",
      side: "west",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.visual.control.waiting",
      roomId: "room.visual.waiting",
      side: "north",
      offset: 2,
      exterior: false,
    },
    {
      id: "door.visual.xray.patient",
      roomId: "room.visual.xray",
      side: "south",
      offset: 1,
      exterior: false,
    },
    {
      id: "door.visual.xray.control",
      roomId: "room.visual.xray",
      side: "east",
      offset: 1,
      exterior: false,
    },
  ];
  state.environment = {
    ...state.environment,
    founderLocation: { x: 36, y: 30 },
    founderActivity: null,
  };
  state.employees = [
    {
      id: "employee.visual.receptionist",
      staffRoleDefinitionId: "staff.receptionist",
      displayName: "Morgan Vale",
      appearance: {
        version: "pixel-avatar.v1",
        bodyShape: "average",
        hairStyle: "bun",
        skinTone: 3,
        hairShade: 0,
        faceStyle: "round",
        outfitStyle: "plain",
        outfitShade: 1,
        accessory: "glasses",
        headVariant: 4,
        bodyVariant: 2,
        roleStyle: "receptionist",
      },
      hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 18,
      morale: 88,
      trainingLevel: 1,
      homeRoomInstanceId: "room.instance.founder_desk",
      location: { x: 34, y: 29 },
      path: [],
      pathIndex: 0,
      lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: 20,
    },
    {
      id: "employee.visual.imaging",
      staffRoleDefinitionId: "staff.imaging_technician",
      displayName: "Avery Chen",
      appearance: {
        version: "pixel-avatar.v1",
        bodyShape: "compact",
        hairStyle: "parted",
        skinTone: 1,
        hairShade: 2,
        faceStyle: "square",
        outfitStyle: "plain",
        outfitShade: 3,
        accessory: "badge",
        headVariant: 6,
        bodyVariant: 7,
        roleStyle: "imaging_technician",
      },
      hiredAtFacilityTick: 0,
      salaryPerExpenseInterval: 28,
      morale: 82,
      trainingLevel: 1,
      homeRoomInstanceId: "room.visual.imaging_control",
      location: { x: 31, y: 26 },
      path: [],
      pathIndex: 0,
      lastMovedAtFacilityTick: 0,
      lastPraisedAtFacilityTick: null,
      nextIdleActionAtFacilityTick: 20,
    },
  ];

  const sourceEncounter = Object.values(state.encounters)[0];
  if (sourceEncounter) {
    const visualPatients = [
      {
        id: "encounter.visual.patient.2",
        name: "Jordan Reed",
        location: { x: 30, y: 29 },
        satisfaction: 93,
        appearance: {
          version: "pixel-avatar.v1",
          bodyShape: "tall",
          hairStyle: "short",
          skinTone: 0,
          hairShade: 3,
          faceStyle: "long",
          outfitStyle: "striped",
          outfitShade: 2,
          accessory: "none",
          headVariant: 2,
          bodyVariant: 5,
          roleStyle: "patient",
        },
      },
      {
        id: "encounter.visual.patient.3",
        name: "Quinn Hart",
        location: { x: 34, y: 26 },
        satisfaction: 87,
        appearance: {
          version: "pixel-avatar.v1",
          bodyShape: "broad",
          hairStyle: "curly",
          skinTone: 2,
          hairShade: 1,
          faceStyle: "round",
          outfitStyle: "checked",
          outfitShade: 0,
          accessory: "headband",
          headVariant: 8,
          bodyVariant: 8,
          roleStyle: "patient",
        },
      },
    ] as const;

    for (const patient of visualPatients) {
      state.encounters[patient.id] = {
        ...structuredClone(sourceEncounter),
        id: patient.id,
        patientDisplayName: patient.name,
        patientAppearance: patient.appearance,
        patientSatisfaction: patient.satisfaction,
        patientLocation: patient.location,
        patientMovement: null,
        assignedRoomInstanceId:
          patient.id.endsWith(".3")
            ? "room.visual.examination"
            : "room.visual.waiting",
        lifecycle: patient.id.endsWith(".3")
          ? "active_action_required"
          : "waiting_unopened",
        idleWaitingSinceTick: patient.id.endsWith(".3")
          ? null
          : sourceEncounter.idleWaitingSinceTick,
        arrivalClass: "routine",
        protectedGuaranteeId: null,
        firstOpenedAtTick: null,
      };
    }
  }

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
  if (await resume.isVisible()) {
    await resume.click();
  }
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await expect(page.locator(".facility-host canvas")).toBeVisible();
  await page.waitForTimeout(300);
}

/**
 * A paused Level 2 review fixture installed into a campaign that the UI has
 * already created.  It deliberately stays in localStorage: loading it again
 * therefore exercises the normal campaign persistence/migration path.
 */
export async function installLevelTwoVisualState(page: Page): Promise<void> {
  const profile = await getProfile(page);
  const activeIndex = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (activeIndex < 0) throw new Error("Active campaign record is missing.");
  const active = profile.campaigns[activeIndex]!;
  const state = JSON.parse(active.serializedState) as MutableVisualGameState;
  const makeRoom = (
    id: string,
    roomDefinitionId: string,
    x: number,
    y: number,
  ) => ({ id, roomDefinitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  // A one-tile public hallway at y=27 links every patient-facing room. The
  // three imaging-control rooms are each directly joined to their scanner;
  // this is intentionally a valid operational graph, not a visual shortcut.
  const roomRows: Array<[string, string, number, number]> = [
    ["room.l2.control-ultrasound", "room.imaging_control", 8, 24],
    ["room.l2.ultrasound", "room.ultrasound", 10, 24],
    ["room.l2.control-ct", "room.imaging_control", 13, 24],
    ["room.l2.ct", "room.ct", 15, 23],
    ["room.l2.control-xray", "room.imaging_control", 19, 24],
    ["room.l2.xray", "room.xray", 21, 24],
    ["room.l2.examination", "room.examination", 24, 25],
    ["room.l2.minor-procedure", "room.minor_procedure", 27, 24],
    ["room.l2.endoscopy", "room.endoscopy", 30, 24],
    ["room.l2.periop", "room.periop_recovery", 34, 24],
    ["room.l2.phlebotomy", "room.phlebotomy", 38, 25],
    ["room.l2.training", "room.training", 41, 24],
    ["room.l2.glp", "room.glp1_telehealth_suite", 44, 25],
    ["room.l2.waiting", "room.waiting", 47, 24],
    ["room.l2.bathroom", "room.bathroom", 51, 25],
    ["room.l2.evs", "room.evs_closet", 53, 25],
    ["room.l2.coffee", "room.coffee_kiosk", 55, 25],
  ];
  state.facilityLevel = 2;
  state.clinicalXp = 0;
  state.cash = 12_345;
  state.cashCents = 1_234_500;
  state.paused = true;
  state.simulationSpeed = 1;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms = [
    makeRoom("room.instance.founder_desk", "room.front_desk", 33, 28),
    ...roomRows.map(([id, definition, x, y]) => makeRoom(id, definition, x, y)),
    ...Array.from({ length: 49 }, (_, index) => makeRoom(`room.l2.hall.${index}`, "room.hallway", 8 + index, 27)),
  ];
  state.doors = [
    { id: "door.l2.front.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 1, exterior: true },
    { id: "door.l2.front.hall", roomId: "room.instance.founder_desk", side: "north", offset: 1, exterior: false },
    ...roomRows.filter(([id]) => !id.startsWith("room.l2.control")).map(([id]) => ({ id: `door.${id}.hall`, roomId: id, side: "south" as const, offset: 1, exterior: false })),
    { id: "door.l2.ultrasound.control", roomId: "room.l2.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.l2.ct.control", roomId: "room.l2.ct", side: "west", offset: 2, exterior: false },
    { id: "door.l2.xray.control", roomId: "room.l2.xray", side: "west", offset: 1, exterior: false },
  ];
  const roleRows: Array<[string, string, string, string]> = [
    ["employee.l2.receptionist", "staff.receptionist", "Morgan Vale", "room.instance.founder_desk"],
    ["employee.l2.imaging", "staff.imaging_technician", "Avery Chen", "room.l2.control-xray"],
    ["employee.l2.periop", "staff.periop_nurse", "Riley Park", "room.l2.periop"],
    ["employee.l2.endoscopy", "staff.endoscopy_nurse", "Taylor Brooks", "room.l2.endoscopy"],
    ["employee.l2.endoscopist", "staff.endoscopist", "Casey Morgan", "room.l2.endoscopy"],
    ["employee.l2.phlebotomy", "staff.phlebotomist", "Jordan Lee", "room.l2.phlebotomy"],
    ["employee.l2.evs", "staff.evs_worker", "Avery Stone", "room.l2.evs"],
    ["employee.l2.glp", "staff.glp1_np", "Cameron Wells", "room.l2.glp"],
  ];
  state.employees = roleRows.map(([id, role, displayName, homeRoomInstanceId], index) => ({
    id, staffRoleDefinitionId: role, displayName,
    appearance: { version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: index % 4, hairShade: index % 4, faceStyle: "round", outfitStyle: "plain", outfitShade: index % 4, accessory: "badge", headVariant: index + 1, bodyVariant: index + 1, roleStyle: role.replace("staff.", "") },
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 1, morale: 90, trainingLevel: 1,
    homeRoomInstanceId, location: { x: 34 + (index % 3), y: 24 + Math.floor(index / 3) }, path: [], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 999,
  }));
  state.environment = { ...state.environment, founderLocation: { x: 34, y: 29 }, founderActivity: null,
    glp1AutomationNextPayoutTicks: [60], glp1AutomationNextPayoutTick: 60 };
  profile.campaigns[activeIndex] = { ...active, serializedState: JSON.stringify(state) };
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ profileKey, nextProfile }) => {
    window.localStorage.setItem(profileKey, JSON.stringify(nextProfile));
  }, { profileKey: PROFILE_KEY, nextProfile: profile });
  await page.goto("/?prototype-tools=0");
  const resume = page.getByRole("button", { name: `Resume ${active.name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

export async function installDeterministicCampaignIds(
  page: Page,
): Promise<void> {
  await page.addInitScript(() => {
    const counterKey = "__gamify_surgery_e2e_uuid_counter";
    Object.defineProperty(window.crypto, "randomUUID", {
      configurable: true,
      value: () => {
        const next = Number(window.localStorage.getItem(counterKey) ?? "2");
        window.localStorage.setItem(counterKey, String(next + 1));
        return `00000000-0000-4000-8000-${String(next).padStart(12, "0")}`;
      },
    });
  });
}

export function moneyValue(page: Page): Locator {
  return page.locator(".resource-money-value");
}

export async function readMoney(page: Page): Promise<number> {
  const label = await moneyValue(page).innerText();
  const match = /^\$([\d,]+)/.exec(label.trim());
  if (!match) {
    throw new Error(`Could not read money from "${label}".`);
  }
  return Number(match[1].replaceAll(",", ""));
}

export function xpValue(page: Page): Locator {
  return page.locator(".resource-xp-row > strong");
}

export function messageTitle(page: Page, title: string): Locator {
  return page
    .locator(".event-message-board .message-board-item")
    .filter({ hasText: title });
}
