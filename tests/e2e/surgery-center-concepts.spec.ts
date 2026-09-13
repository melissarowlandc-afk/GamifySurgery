import { mkdirSync } from "node:fs";
import { expect, test, type BrowserContext, type Page } from "@playwright/test";
import {
  SURGERY_CENTER_CASES,
} from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  deserializeGameState,
  gameReducer,
  getEncounterPatientLocation,
  getCurrentCapabilities,
  serializeGameState,
  validateDomainContext,
  type EncounterState,
  type GameState,
  type PendingResult,
} from "@gamify-surgery/game-domain";
import {
  PROFILE_KEY,
  getActiveState,
  installLevelTwoVisualState,
  setFastFacilitySpeed,
  startClinic,
  waitForDecisionChoices,
} from "./helpers";

const ORIGIN = "http://127.0.0.1:4173";
const SCREENSHOT_DIRECTORY = "artifacts/screenshots";

interface StoredCampaign {
  campaignId: string;
  name: string;
  serializedState: string;
  [key: string]: unknown;
}

interface StoredProfile {
  activeCampaignId: string | null;
  tutorialsEnabled: boolean;
  campaigns: StoredCampaign[];
  [key: string]: unknown;
}

interface PreparedEncounter {
  id: string;
  patientName: string;
  caseId: string;
  demographics: unknown;
  appearance: unknown;
  profileId: string | null;
  answerOrders: string[][];
  nodes: EncounterState["frozenCase"]["decisionNodes"];
}

test.beforeAll(() => mkdirSync(SCREENSHOT_DIRECTORY, { recursive: true }));

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function requiredCurrentUpdate(
  node: EncounterState["frozenCase"]["decisionNodes"][number],
): string {
  if (!node.currentUpdate) throw new Error(`Node ${node.id} has no current update.`);
  return node.currentUpdate;
}

function targetContext(caseId: string) {
  const clinicalCase = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
    (item) => item.id === caseId,
  );
  if (!clinicalCase) throw new Error(`Missing admitted runtime case ${caseId}.`);
  const batchCase = SURGERY_CENTER_CASES.find((item) => item.id === caseId);
  expect(batchCase).toEqual(clinicalCase);
  const conceptIds = new Set(
    clinicalCase.decisionNodes.map((node) => node.primaryConceptId),
  );
  return validateDomainContext({
    ...PROTOTYPE_DOMAIN_CONTEXT,
    clinicalRelease: {
      ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
      cases: [clinicalCase],
      concepts: PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.filter(
        (concept) => conceptIds.has(concept.id),
      ),
    },
  });
}

async function prepareAutomaticAdmission(
  setupPage: Page,
  caseId: string,
  facilityLevel: 1 | 2,
): Promise<{ profile: StoredProfile; encounter: PreparedEncounter; campaignName: string }> {
  const rawProfile = await setupPage.evaluate(
    (key) => localStorage.getItem(key),
    PROFILE_KEY,
  );
  if (!rawProfile) throw new Error("Fresh campaign profile was not persisted.");
  const profile = JSON.parse(rawProfile) as StoredProfile;
  const activeIndex = profile.campaigns.findIndex(
    (campaign) => campaign.campaignId === profile.activeCampaignId,
  );
  if (activeIndex < 0) throw new Error("Fresh campaign is not active.");
  const active = profile.campaigns[activeIndex]!;
  let state = deserializeGameState(active.serializedState);
  state.facilityLevel = facilityLevel;
  if (facilityLevel === 2) {
    for (const [employeeId, location] of [
      ["employee.l2.endoscopy", { x: 31, y: 25 }],
      ["employee.l2.endoscopist", { x: 32, y: 26 }],
    ] as const) {
      const employee = state.employees.find((item) => item.id === employeeId);
      if (!employee) throw new Error(`Missing Level 2 fixture employee ${employeeId}.`);
      employee.location = location;
      employee.path = [];
      employee.pathIndex = 0;
    }
    expect(getCurrentCapabilities(state)).toContain("capability.endoscopy");
  }
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.paused = false;
  state.nextRoutineArrivalTick = state.facilityTick + 1;
  state = gameReducer(
    state,
    {
      type: "ADVANCE_TICK",
      operationId: `e2e.${caseId}.automatic-admission`,
      advancedAtRealMs: 1_800_000_000_000,
    },
    targetContext(caseId),
  );
  const encounter = Object.values(state.encounters).find(
    (candidate) => candidate.frozenCase.id === caseId,
  );
  if (!encounter || encounter.frozenCase.id !== caseId) {
    throw new Error(
      `Automatic production admission did not select ${caseId}: ${JSON.stringify({
        facilityTick: state.facilityTick,
        nextRoutineArrivalTick: state.nextRoutineArrivalTick,
        facilityLevel: state.facilityLevel,
        capabilities: [...getCurrentCapabilities(state)],
        encounterCaseIds: Object.values(state.encounters).map(
          (item) => item.frozenCase.id,
        ),
      })}`,
    );
  }
  if (encounter.patientDisplayName.includes("{patientName}")) {
    throw new Error("Generated patient name was not materialized.");
  }
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  profile.campaigns[activeIndex] = {
    ...active,
    serializedState: serializeGameState(state),
  };
  profile.tutorialsEnabled = false;
  return {
    profile,
    campaignName: active.name,
    encounter: {
      id: encounter.id,
      patientName: encounter.patientDisplayName,
      caseId,
      demographics: encounter.frozenCase.prototypeDemographics,
      appearance: encounter.patientAppearance,
      profileId: encounter.frozenCase.selectedInstantiationProfileId ?? null,
      answerOrders: encounter.frozenCase.decisionNodes.map((node) =>
        node.answerChoices.map((choice) => choice.id),
      ),
      nodes: encounter.frozenCase.decisionNodes,
    },
  };
}

async function openPreparedCampaign(
  context: BrowserContext,
  profile: StoredProfile,
  campaignName: string,
  marker: string,
): Promise<Page> {
  const page = await context.newPage();
  await page.addInitScript(
    ({ markerKey, profileKey, nextProfile }) => {
      if (sessionStorage.getItem(markerKey) !== null) return;
      sessionStorage.setItem(markerKey, "installed");
      localStorage.setItem(profileKey, JSON.stringify(nextProfile));
    },
    { markerKey: marker, profileKey: PROFILE_KEY, nextProfile: profile },
  );
  await page.goto("/?prototype-tools=0");
  expect(new URL(page.url()).origin).toBe(ORIGIN);
  const resume = page.getByRole("button", { name: `Resume ${campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  return page;
}

async function resumeFacility(page: Page): Promise<void> {
  const resume = page.getByRole("button", { name: "Resume facility time" });
  if (await resume.isVisible()) await resume.click();
}

async function pauseFacility(page: Page): Promise<void> {
  const pause = page.getByRole("button", { name: "Pause facility time" });
  if (await pause.isVisible()) await pause.click();
}

async function openEncounter(page: Page, encounter: PreparedEncounter): Promise<void> {
  const patient = page
    .locator(".patient-folder .patient-tab")
    .filter({ hasText: encounter.patientName });
  await expect(patient).toBeVisible({ timeout: 25_000 });
  await patient.click();
  await expect(page.locator(".paper-chart")).toBeVisible();
  await expect(
    page.locator(".paper-chart").getByText(encounter.patientName, { exact: true }),
  ).toBeVisible();
  await waitForDecisionChoices(page);
  await expect
    .poll(async () => {
      const state = (await getActiveState(page)) as unknown as GameState;
      const current = state.encounters[encounter.id];
      return Boolean(
        current &&
          current.patientMovement === null &&
          current.assignedRoomInstanceId !== null,
      );
    }, { timeout: 30_000 })
    .toBe(true);
}

async function clickCorrectAnswer(page: Page, encounterId: string): Promise<void> {
  const state = (await getActiveState(page)) as unknown as GameState;
  const encounter = state.encounters[encounterId]!;
  const node = encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
  const correct = node.answerChoices.find((choice) => choice.isCorrect)!;
  await page
    .getByRole("button", {
      name: new RegExp(`^${escapeRegex(correct.label)}(?:$|\\s)`),
    })
    .click();
  await expect(
    page.locator(".chart-step-column.is-current .chart-step-feedback"),
  ).toContainText("Correct");
}

function assertFrozenEncounter(
  state: GameState,
  prepared: PreparedEncounter,
): EncounterState {
  const encounter = state.encounters[prepared.id]!;
  expect(encounter.frozenCase.id).toBe(prepared.caseId);
  expect(encounter.patientDisplayName).toBe(prepared.patientName);
  expect(encounter.frozenCase.prototypeDemographics).toEqual(prepared.demographics);
  expect(encounter.patientAppearance).toEqual(prepared.appearance);
  expect(encounter.frozenCase.selectedInstantiationProfileId).toBe(prepared.profileId);
  expect(
    encounter.frozenCase.decisionNodes.map((node) =>
      node.answerChoices.map((choice) => choice.id),
    ),
  ).toEqual(prepared.answerOrders);
  return encounter;
}

async function assertInitialChart(
  page: Page,
  prepared: PreparedEncounter,
  hiddenRoute: string,
): Promise<void> {
  const state = (await getActiveState(page)) as unknown as GameState;
  assertFrozenEncounter(state, prepared);
  expect(prepared.profileId).toBeTruthy();
  const demographics = prepared.demographics as {
    ageYears: number;
    sexLabel: string;
  };
  const appearance = prepared.appearance as {
    skinTone: number;
    headVariant: number;
    bodyVariant: number;
  };
  await expect(page.getByText("Decision 1 of 2", { exact: true })).toBeVisible();
  await expect(page.locator(".chart-demographic-line")).toContainText(
    `${demographics.ageYears} years · ${demographics.sexLabel}`,
  );
  await expect(
    page.locator(".chart-identity-column").getByRole("img", {
      name: `${prepared.patientName} portrait`,
    }),
  ).toHaveAttribute(
    "data-appearance",
    `${appearance.skinTone}-${appearance.headVariant}-${appearance.bodyVariant}`,
  );
  const expectedLabels = prepared.nodes[0]!.answerChoices.map((choice) => choice.label);
  await expect(page.locator(".chart-step-column.is-current .answer-choice strong"))
    .toHaveText(expectedLabels);
  await expect(page.locator(".answer-choice-eta")).toHaveCount(0);
  await expect(page.locator(".answer-choice-copy small")).toHaveCount(0);
  await expect(page.getByText(hiddenRoute, { exact: true })).toHaveCount(0);
  await expect(page.getByText("Service route unavailable", { exact: true })).toHaveCount(0);
  await expect(
    page.getByText(requiredCurrentUpdate(prepared.nodes[1]!), { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(prepared.nodes[1]!.stem, { exact: true })).toHaveCount(0);
}

async function enactPlanAndReadPending(
  page: Page,
  prepared: PreparedEncounter,
  routeName: string,
): Promise<PendingResult> {
  const answered = (await getActiveState(page)) as unknown as GameState;
  expect(answered.encounters[prepared.id]!.steps[0]!.status).toBe("feedback_pending");
  await expect(page.locator(".chart-decision-next")).toContainText(routeName);
  await page.getByRole("button", { name: "Enact Plan", exact: true }).click();
  const pendingState = (await getActiveState(page)) as unknown as GameState;
  const pending = pendingState.encounters[prepared.id]!.pendingResult;
  if (!pending) throw new Error("Expected the result service to be pending.");
  expect(pending.dueTick).toBeGreaterThan(pending.scheduledAtTick);
  const patient = page
    .locator(".patient-folder.is-active .patient-tab")
    .filter({ hasText: prepared.patientName });
  await expect(patient).toBeVisible();
  await patient.click();
  await expect(page.locator(".paper-chart")).toBeVisible();
  await expect(page.locator(".chart-pending-card")).toContainText(routeName);
  await expect(page.locator(".chart-pending-card small")).toContainText("remaining");
  await expect(
    page.getByText(requiredCurrentUpdate(prepared.nodes[1]!), { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText(prepared.nodes[1]!.stem, { exact: true })).toHaveCount(0);
  return pending;
}

async function waitForReturnedResult(
  page: Page,
  prepared: PreparedEncounter,
  timeout: number,
): Promise<GameState> {
  const patient = page
    .locator(".patient-folder.is-active .patient-tab")
    .filter({ hasText: prepared.patientName });
  await expect(patient).toHaveAccessibleName(/Action required/, { timeout });
  await patient.click();
  await waitForDecisionChoices(page);
  await expect(page.getByText("Decision 2 of 2", { exact: true })).toBeVisible();
  await expect(page.getByTestId("chart-current-update")).toContainText(
    requiredCurrentUpdate(prepared.nodes[1]!),
  );
  return (await getActiveState(page)) as unknown as GameState;
}

async function assertRenderedIdentity(
  page: Page,
  prepared: PreparedEncounter,
): Promise<void> {
  const demographics = prepared.demographics as { ageYears: number; sexLabel: string };
  const appearance = prepared.appearance as {
    skinTone: number;
    headVariant: number;
    bodyVariant: number;
  };
  await expect(page.locator(".chart-demographic-line")).toContainText(
    `${demographics.ageYears} years · ${demographics.sexLabel}`,
  );
  await expect(page.locator(".chart-identity-column").getByRole("img", {
    name: `${prepared.patientName} portrait`,
  }))
    .toHaveAttribute(
      "data-appearance",
      `${appearance.skinTone}-${appearance.headVariant}-${appearance.bodyVariant}`,
    );
}

async function finishAndAssertLearning(
  page: Page,
  prepared: PreparedEncounter,
): Promise<GameState> {
  await clickCorrectAnswer(page, prepared.id);
  const enact = page.getByRole("button", { name: "Enact Plan", exact: true });
  if (await enact.isVisible()) await enact.click();
  const dismiss = page.getByRole("button", { name: "Dismiss", exact: true });
  if (await dismiss.isVisible()) await dismiss.click();
  await page.getByRole("button", { name: "Resolve Completed Chart" }).click();
  await expect
    .poll(async () => {
      const state = (await getActiveState(page)) as unknown as GameState;
      return state.encounters[prepared.id]?.lifecycle;
    })
    .toBe("resolved");
  const completed = (await getActiveState(page)) as unknown as GameState;
  expect(completed.encounters[prepared.id]!.deliveredResultNarratives).toHaveLength(1);
  for (const node of prepared.nodes) {
    expect(completed.learningHistories[node.primaryConceptId]!.reviews).toHaveLength(1);
  }
  return completed;
}

function collectBrowserErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    const favicon404 =
      message.location().url === `${ORIGIN}/favicon.ico` &&
      message.text().includes("404");
    if (!favicon404) errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
  return errors;
}

test("external skin biopsy preserves its generated patient and pending timer across reload", async ({
  context,
  page: setupPage,
}, testInfo) => {
  testInfo.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Runs in installed desktop Chrome.");
  await startClinic(setupPage, "Skin E2E Founder", "Skin E2E Clinic");
  const preparedCampaign = await prepareAutomaticAdmission(
    setupPage,
    "case.pigmented-skin-lesion.changing-back-lesion",
    1,
  );
  await setupPage.close();
  const page = await openPreparedCampaign(
    context,
    preparedCampaign.profile,
    preparedCampaign.campaignName,
    "surgery-center:skin:installed",
  );
  const browserErrors = collectBrowserErrors(page);
  await setFastFacilitySpeed(page);
  await resumeFacility(page);
  await openEncounter(page, preparedCampaign.encounter);
  await pauseFacility(page);
  await assertInitialChart(
    page,
    preparedCampaign.encounter,
    "Off-site excisional skin biopsy",
  );
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/surgery-center-skin-initial.png`,
    animations: "disabled",
  });

  await clickCorrectAnswer(page, preparedCampaign.encounter.id);
  const pending = await enactPlanAndReadPending(
    page,
    preparedCampaign.encounter,
    "Off-site excisional skin biopsy",
  );
  expect(pending.routeId).toBe("route.skin_excisional_biopsy.outsourced");
  expect(pending.serviceDurationTicks).toBe(180);
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/surgery-center-skin-pending.png`,
    animations: "disabled",
  });

  await resumeFacility(page);
  await expect
    .poll(async () => (await getActiveState(page) as unknown as GameState).facilityTick, {
      timeout: 20_000,
    })
    .toBeGreaterThanOrEqual(pending.scheduledAtTick + 15);
  await pauseFacility(page);
  const beforeReload = (await getActiveState(page)) as unknown as GameState;
  expect(beforeReload.paused).toBe(true);
  expect(beforeReload.facilityTick).toBeLessThan(pending.dueTick);
  const fullPendingBeforeReload = beforeReload.encounters[preparedCampaign.encounter.id]!.pendingResult;
  await page.reload();
  const resumeCampaign = page.getByRole("button", {
    name: `Resume ${preparedCampaign.campaignName}`,
  });
  if (await resumeCampaign.isVisible()) await resumeCampaign.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const afterReload = (await getActiveState(page)) as unknown as GameState;
  const reloaded = assertFrozenEncounter(afterReload, preparedCampaign.encounter);
  expect(afterReload.paused).toBe(true);
  expect(afterReload.facilityTick).toBe(beforeReload.facilityTick);
  expect(reloaded.pendingResult).toEqual(fullPendingBeforeReload);
  expect(reloaded.deliveredResultNarratives).toEqual([]);
  console.log("skin-reload-evidence", JSON.stringify({
    patientName: preparedCampaign.encounter.patientName,
    profileId: preparedCampaign.encounter.profileId,
    demographics: preparedCampaign.encounter.demographics,
    appearance: preparedCampaign.encounter.appearance,
    answerOrders: preparedCampaign.encounter.answerOrders,
    facilityTickBeforeReload: beforeReload.facilityTick,
    facilityTickAfterReload: afterReload.facilityTick,
    pending: fullPendingBeforeReload,
  }));
  const reloadedPatient = page
    .locator(".patient-folder.is-active .patient-tab")
    .filter({ hasText: preparedCampaign.encounter.patientName });
  await reloadedPatient.click();
  await expect(page.locator(".chart-pending-card")).toContainText(
    "Off-site excisional skin biopsy",
  );
  await assertRenderedIdentity(page, preparedCampaign.encounter);
  await resumeFacility(page);
  const returned = await waitForReturnedResult(
    page,
    preparedCampaign.encounter,
    90_000,
  );
  expect(returned.encounters[preparedCampaign.encounter.id]!.deliveredResultNarratives)
    .toEqual([requiredCurrentUpdate(preparedCampaign.encounter.nodes[1]!)]);
  console.log("skin-return-evidence", JSON.stringify({
    facilityTick: returned.facilityTick,
    deliveredResultNarratives: returned.encounters[preparedCampaign.encounter.id]!
      .deliveredResultNarratives,
  }));
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/surgery-center-skin-return.png`,
    animations: "disabled",
  });
  await finishAndAssertLearning(page, preparedCampaign.encounter);
  expect(browserErrors).toEqual([]);
});

test("onsite EGD uses live rooms, nurses, endoscopist, phases, travel, and return", async ({
  context,
  page: setupPage,
}, testInfo) => {
  testInfo.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Runs in installed desktop Chrome.");
  await startClinic(setupPage, "EGD E2E Founder", "EGD E2E Clinic");
  await installLevelTwoVisualState(setupPage);
  const preparedCampaign = await prepareAutomaticAdmission(
    setupPage,
    "case.esophageal-dysphagia.bread-sticking",
    2,
  );
  // Close the fixture page before installing the prepared encounter. Its
  // page-scoped init script and late pagehide autosave cannot overwrite play.
  await setupPage.close();
  const page = await openPreparedCampaign(
    context,
    preparedCampaign.profile,
    preparedCampaign.campaignName,
    "surgery-center:egd:installed",
  );
  const browserErrors = collectBrowserErrors(page);
  await setFastFacilitySpeed(page);
  await resumeFacility(page);
  await openEncounter(page, preparedCampaign.encounter);
  await pauseFacility(page);
  await assertInitialChart(
    page,
    preparedCampaign.encounter,
    "Onsite endoscopy workflow",
  );
  const initialState = (await getActiveState(page)) as unknown as GameState;
  expect(getCurrentCapabilities(initialState)).toContain("capability.endoscopy");
  expect(initialState.employees.some((item) => item.id === "employee.l2.endoscopist"))
    .toBe(true);

  await clickCorrectAnswer(page, preparedCampaign.encounter.id);
  const pending = await enactPlanAndReadPending(
    page,
    preparedCampaign.encounter,
    "Onsite endoscopy workflow",
  );
  expect(pending).toMatchObject({
    routeId: "route.endoscopy.in_house",
    serviceDurationTicks: 180,
    resourceReservations: [
      {
        roomDefinitionId: "room.endoscopy",
        staffRoleDefinitionId: "staff.endoscopy_nurse",
      },
      {
        roomDefinitionId: "room.periop_recovery",
        staffRoleDefinitionId: "staff.periop_nurse",
      },
    ],
    providerReservation: {
      kind: "employee",
      employeeId: "employee.l2.endoscopist",
      staffRoleDefinitionId: "staff.endoscopist",
    },
  });
  expect(pending.patientTravel?.outboundPath.length).toBeGreaterThan(0);
  expect(pending.patientTravel?.returnPath.length).toBeGreaterThan(0);
  expect(pending.timingPhases).toEqual([
    expect.objectContaining({ id: "phase.endoscopy.preparation", durationTicks: 30, resourceBound: true }),
    expect.objectContaining({ id: "phase.endoscopy.procedure", durationTicks: 45, resourceBound: true }),
    expect.objectContaining({ id: "phase.endoscopy.recovery", durationTicks: 45, resourceBound: true }),
    expect.objectContaining({ id: "phase.endoscopy.return_and_report", durationTicks: 60, resourceBound: false }),
  ]);
  const phases = pending.timingPhases!;
  expect(phases[2]!.endsAtTick).toBe(pending.scheduledAtTick + 120);
  expect(phases[3]!.startsAtTick).toBe(pending.scheduledAtTick + 120);
  await page.getByRole("button", { name: "Return to clinic" }).click();
  await resumeFacility(page);

  await expect
    .poll(async () => {
      const state = (await getActiveState(page)) as unknown as GameState;
      const liveProcedure = state.encounters[preparedCampaign.encounter.id]!
        .pendingResult?.timingPhases?.[1];
      return Boolean(
        liveProcedure &&
          state.facilityTick >= liveProcedure.startsAtTick + 3 &&
          state.facilityTick < liveProcedure.endsAtTick,
      );
    }, { timeout: 60_000 })
    .toBe(true);
  const duringProcedure = (await getActiveState(page)) as unknown as GameState;
  const livePending = duringProcedure.encounters[preparedCampaign.encounter.id]!.pendingResult!;
  const liveProcedure = livePending.timingPhases![1]!;
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/surgery-center-egd-procedure.png`,
    animations: "disabled",
  });
  expect(duringProcedure.facilityTick).toBeLessThan(liveProcedure.endsAtTick);
  expect(livePending.resourceReservations).toEqual(pending.resourceReservations);
  expect(livePending.providerReservation).toEqual(pending.providerReservation);
  expect(getEncounterPatientLocation(duringProcedure, preparedCampaign.encounter.id))
    .toEqual(livePending.patientTravel!.outboundPath.at(-1));
  console.log("egd-procedure-evidence", JSON.stringify({
    patientName: preparedCampaign.encounter.patientName,
    profileId: preparedCampaign.encounter.profileId,
    demographics: preparedCampaign.encounter.demographics,
    appearance: preparedCampaign.encounter.appearance,
    answerOrders: preparedCampaign.encounter.answerOrders,
    facilityTick: duringProcedure.facilityTick,
    patientMovement: duringProcedure.encounters[preparedCampaign.encounter.id]!.patientMovement,
    assignedRoomInstanceId: duringProcedure.encounters[preparedCampaign.encounter.id]!
      .assignedRoomInstanceId,
    queuedCareRoomInstanceId: duringProcedure.encounters[preparedCampaign.encounter.id]!
      .queuedCareRoomInstanceId,
    projectedLocation: getEncounterPatientLocation(
      duringProcedure,
      preparedCampaign.encounter.id,
    ),
    pending: livePending,
  }));

  const returned = await waitForReturnedResult(
    page,
    preparedCampaign.encounter,
    100_000,
  );
  const returnedEncounter = returned.encounters[preparedCampaign.encounter.id]!;
  expect(returnedEncounter.deliveredResultNarratives)
    .toEqual([requiredCurrentUpdate(preparedCampaign.encounter.nodes[1]!)]);
  expect(returnedEncounter.assignedRoomInstanceId)
    .toBe(livePending.patientTravel!.originRoomInstanceId);
  expect(returnedEncounter.patientLocation)
    .toEqual(livePending.patientTravel!.returnPath.at(-1));
  console.log("egd-return-evidence", JSON.stringify({
    facilityTick: returned.facilityTick,
    assignedRoomInstanceId: returnedEncounter.assignedRoomInstanceId,
    patientLocation: returnedEncounter.patientLocation,
    deliveredResultNarratives: returnedEncounter.deliveredResultNarratives,
  }));
  await page.screenshot({
    path: `${SCREENSHOT_DIRECTORY}/surgery-center-egd-return.png`,
    animations: "disabled",
  });
  await finishAndAssertLearning(page, preparedCampaign.encounter);
  expect(browserErrors).toEqual([]);
});
