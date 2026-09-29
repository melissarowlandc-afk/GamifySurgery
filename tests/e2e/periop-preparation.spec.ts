import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  gameReducer,
  getCurrentCapabilities,
  getFacilityAccessValidation,
  getRoomDefinition,
  getRoomInstanceFootprint,
  getRoomNavigationAnchor,
  getRoomWaitingAnchors,
  serializeGameState,
  type GameState,
  type GridPoint,
  type ServiceOperationState,
} from "@gamify-surgery/game-domain";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { PROFILE_KEY, getActiveState, getProfile, startClinic, waitForDecisionChoices } from "./helpers";

const ORIGIN = "http://127.0.0.1:4197";
const ROOT = process.env.GAMIFY_PERIOP_PROOF_ROOT ?? ".local-dev/gs025-periop-preparation/final";
const ENCOUNTER_ID = "periop-colonoscopy-question";

type Room = GameState["rooms"][number];

function room(id: string, roomDefinitionId: string, x: number, y: number): Room {
  return { id, roomDefinitionId, x, y, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 };
}

function anchor(candidate: Room, kind: "primary" | "staff" = "staff"): GridPoint {
  return getRoomNavigationAnchor(candidate, getRoomDefinition(candidate.roomDefinitionId)!, kind);
}

function configurePeriopFacility(state: GameState): GameState {
  const existingFront = state.rooms.find((candidate) => candidate.id === "room.instance.founder_desk");
  const existingFrontDoors = state.doors.filter((candidate) => candidate.roomId === "room.instance.founder_desk" && candidate.exterior);
  if (!existingFront || existingFrontDoors.length === 0) throw new Error("Fresh campaign Front Desk entrance is missing.");
  state.facilityLevel = 2;
  state.cash = 20_000;
  state.cashCents = 2_000_000;
  state.paused = true;
  state.simulationSpeed = 4;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.ambientPedestrians = [];
  state.environment.litterItems = [];
  state.encounters = {};
  state.serviceOperations = [];
  state.serviceIncomeReceipts = [];
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  const endoscopy = [room("room.periop.endoscopy.1", "room.endoscopy", 28, 2), room("room.periop.endoscopy.2", "room.endoscopy", 28, 7)];
  const recovery = [
    room("room.periop.station.1", "room.periop_recovery", 26, 12),
    room("room.periop.station.2", "room.periop_recovery", 26, 18),
  ];
  recovery.forEach((candidate) => { candidate.upgradeLevel = 5; });
  const exam = room("room.periop.exam", "room.examination", 33, 25);
  const front = { ...existingFront };
  state.rooms = [
    front, ...endoscopy, ...recovery, exam,
    ...Array.from({ length: 28 }, (_, index) => room(`room.periop.hall.${index}`, "room.hallway", 32, 3 + index)),
  ];
  state.doors = [
    ...existingFrontDoors,
    { id: "door.periop.front.hall", roomId: front.id, side: "west", offset: 0, exterior: false },
    ...[...endoscopy, ...recovery].map((candidate) => ({ id: `door.${candidate.id}`, roomId: candidate.id, side: "east" as const, offset: 1, exterior: false })),
    { id: "door.periop.exam", roomId: exam.id, side: "west", offset: 1, exterior: false },
  ];
  const addEmployee = (id: string, role: string, home: Room) => ({
    id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
    hiredAtFacilityTick: state.facilityTick, salaryPerExpenseInterval: 1, morale: 100, trainingLevel: 1,
    homeRoomInstanceId: home.id, location: anchor(home), path: [anchor(home)], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  });
  state.employees = [
    addEmployee("employee.periop.endoscopy-nurse.1", "staff.endoscopy_nurse", endoscopy[0]!),
    addEmployee("employee.periop.endoscopy-nurse.2", "staff.endoscopy_nurse", endoscopy[1]!),
    addEmployee("employee.periop.nurse.1", "staff.periop_nurse", recovery[0]!),
    addEmployee("employee.periop.nurse.2", "staff.periop_nurse", recovery[1]!),
    addEmployee("employee.periop.endoscopist", "staff.endoscopist", endoscopy[0]!),
  ];
  state.environment.founderLocation = anchor(front, "staff");
  state.environment.founderActivity = null;
  const occupied = new Set<string>();
  for (const candidate of state.rooms) {
    const footprint = getRoomInstanceFootprint(state, candidate.id)!;
    for (let y = candidate.y; y < candidate.y + footprint.height; y += 1) {
      for (let x = candidate.x; x < candidate.x + footprint.width; x += 1) {
        const key = `${x},${y}`;
        if (occupied.has(key)) throw new Error(`Fixture room overlap at ${key} (${candidate.id}).`);
        occupied.add(key);
      }
    }
  }
  return state;
}

function advance(state: GameState, label: string): GameState {
  return gameReducer({ ...state, paused: false }, { type: "ADVANCE_TICK", operationId: `periop.${label}.${state.facilityTick}` });
}

function advanceUntil(state: GameState, label: string, predicate: (candidate: GameState) => boolean, maximum = 360): GameState {
  let next = state;
  for (let index = 0; index < maximum; index += 1) {
    if (predicate(next)) return { ...next, paused: true };
    const before = next.facilityTick;
    next = advance(next, `${label}.${index}`);
    if (next.facilityTick === before) throw new Error(`${label} stopped at tick ${before}.`);
  }
  throw new Error(`${label} did not reach its expected state in ${maximum} ticks.`);
}

function startVisitor(state: GameState, label: string): { state: GameState; id: string } {
  const prior = new Set(state.serviceOperations.map((operation) => operation.id));
  const next = gameReducer(state, {
    type: "START_SERVICE_OPERATION", operationId: `periop.visitor.${label}`,
    incomeLineId: "income.endoscopy", actorKind: "visitor",
  });
  const receipt = next.operationReceipts[`periop.visitor.${label}`];
  if (receipt?.status !== "applied") throw new Error(`Visitor ${label} rejected: ${JSON.stringify({ receipt, capabilities: [...getCurrentCapabilities(state)], access: getFacilityAccessValidation(state) })}`);
  const operation = next.serviceOperations.find((candidate) => !prior.has(candidate.id));
  if (!operation) throw new Error(`Visitor ${label} did not create an operation.`);
  return { state: next, id: operation.id };
}

function operation(state: GameState, id: string): ServiceOperationState {
  const found = state.serviceOperations.find((candidate) => candidate.id === id);
  if (!found) throw new Error(`Missing service operation ${id}.`);
  return found;
}

function seedQuestionWithRealContention(initial: GameState): GameState {
  let state = configurePeriopFacility(initial);
  const first = startVisitor(state, "first");
  state = advanceUntil(first.state, "first-reserved-prep", (candidate) => {
    const current = operation(candidate, first.id);
    return current.phaseIndex === 0 && current.status === "walking_to_service";
  });
  const second = startVisitor(state, "second");
  state = advanceUntil(second.state, "visitors-in-prep", (candidate) => {
    const operations = [operation(candidate, first.id), operation(candidate, second.id)];
    return operations.every((candidateOperation) => candidateOperation.phaseIndex === 0 && candidateOperation.status === "in_service");
  });
  state = gameReducer(state, {
    type: "ADMIT_PATIENT", operationId: "periop.question.admit", encounterId: ENCOUNTER_ID,
    caseId: "case.colorectal.routine-screen", patientDisplayName: "Colonoscopy Question Patient", arrivalClass: "routine",
  });
  expect(state.operationReceipts["periop.question.admit"]?.status).toBe("applied");
  const encounter = state.encounters[ENCOUNTER_ID]!;
  const nodeIndex = encounter.frozenCase.decisionNodes.findIndex((node) => node.id === "node.colorectal.routine-screen.1");
  if (nodeIndex < 0) throw new Error("The actual colonoscopy question node is missing.");
  encounter.currentNodeIndex = nodeIndex;
  encounter.steps.forEach((step, index) => { step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked"; });
  const exam = state.rooms.find((candidate) => candidate.id === "room.periop.exam")!;
  encounter.patientMovement = null;
  encounter.patientLocation = anchor(exam, "primary");
  encounter.assignedRoomInstanceId = exam.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  state.openChartEncounterId = encounter.id;
  state.attendedEncounterId = null;
  return { ...state, paused: true, simulationSpeed: 4 };
}

async function installState(page: Page, state: GameState, campaignName: string): Promise<void> {
  const profile = await getProfile(page);
  const active = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId);
  if (!active) throw new Error("Private proof campaign is missing.");
  active.name = campaignName;
  active.serializedState = serializeGameState(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), { key: PROFILE_KEY, value: profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  expect(await page.evaluate(() => location.origin)).toBe(ORIGIN);
  const resume = page.getByRole("button", { name: `Resume ${campaignName}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.addStyleTag({ content: ".tutorial-overlay,.tutorial-card,.prototype-toolbar,.game-announcement,.facility-pause-indicator{display:none!important}" });
}

function linkedQuestionOperation(state: GameState): ServiceOperationState {
  const id = state.encounters[ENCOUNTER_ID]?.pendingResult?.localServiceOperation?.serviceOperationId;
  if (!id) throw new Error("Actual colonoscopy PendingResult has no linked service operation.");
  return operation(state, id);
}

function pathHasTurn(path: readonly GridPoint[]): boolean {
  return path.slice(2).some((point, index) => {
    const first = path[index]!;
    const middle = path[index + 1]!;
    return (middle.x - first.x) * (point.y - middle.y) !==
      (middle.y - first.y) * (point.x - middle.x);
  });
}

async function assertRenderedOperationRoute(page: Page, expected: ServiceOperationState): Promise<void> {
  await expect.poll(() => page.evaluate(() => Boolean(
    (document.querySelector("[data-testid='facility-canvas']") as any)?.__facilityGame,
  )), { timeout: 15_000 }).toBe(true);
  const projected = await page.evaluate((encounterId) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const patient = scene.bridge.viewModel.patients.find((candidate: any) => candidate.instanceId === encounterId);
    return patient ? { path: patient.path, pathIndex: patient.pathIndex } : null;
  }, ENCOUNTER_ID);
  expect(projected).toEqual({ path: expected.path, pathIndex: expected.pathIndex });
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(() => page.evaluate((encounterId) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene") as any;
    const patient = scene?.bridge?.viewModel?.patients?.find((candidate: any) => candidate.instanceId === encounterId);
    const track = scene?.routeMotionTracks?.get(`character:patient:${encounterId}`);
    return patient && track ? { trackPath: track.path } : null;
  }, ENCOUNTER_ID), { timeout: 15_000 }).not.toBeNull();
  const renderedTrack = await page.evaluate((encounterId) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const track = scene.routeMotionTracks.get(`character:patient:${encounterId}`);
    return track.path as GridPoint[];
  }, ENCOUNTER_ID);
  await page.getByRole("button", { name: "Pause facility time" }).click();
  expect(renderedTrack.length).toBeGreaterThan(1);
  expect(renderedTrack.every((point) => expected.path.some((candidate) => candidate.x === point.x && candidate.y === point.y))).toBe(true);
}

async function capture(page: Page, label: string, state: GameState): Promise<void> {
  mkdirSync(ROOT, { recursive: true });
  writeFileSync(join(ROOT, `${label}.json`), JSON.stringify(state, null, 2));
  const target = linkedQuestionOperation(state).location;
  if (target) {
    await page.evaluate((point) => {
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
      if (!scene?.layout) throw new Error("Missing live facility scene for evidence framing.");
      scene.applyCamera({ ...scene.cameraView, zoom: 1.6, panX: 0, panY: 0 });
      scene.refreshLayout(true);
      const x = scene.layout.originX + (point.x + 0.5) * scene.layout.tileSize;
      const y = scene.layout.originY + (point.y + 0.5) * scene.layout.tileSize;
      scene.applyCamera({
        ...scene.cameraView,
        zoom: 1.6,
        panX: scene.scale.width / 2 - x,
        panY: scene.scale.height / 2 - y,
      });
      scene.refreshLayout(true);
      scene.drawCharacters();
    }, target);
  }
  await page.getByTestId("facility-canvas").screenshot({ path: join(ROOT, `${label}.png`), animations: "disabled" });
}

test("actual colonoscopy waits 30 onsite minutes in periop and preserves elapsed preparation across reload", async ({ page }, testInfo) => {
  testInfo.setTimeout(180_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Private desktop Phaser proof only.");
  const campaignName = "Periop Preparation Proof";
  await startClinic(page, "Periop Proof Founder", campaignName);
  await installState(page, seedQuestionWithRealContention((await getActiveState(page)) as unknown as GameState), campaignName);
  await waitForDecisionChoices(page);
  await page.getByRole("button", { name: /^Diagnostic colonoscopy(?:$|\s)/ }).click();
  await expect(page.locator(".chart-step-feedback")).toContainText("Correct");
  let answered = (await getActiveState(page)) as unknown as GameState;
  expect(answered.encounters[ENCOUNTER_ID]!.pendingResult?.localServiceOperation).toMatchObject({
    version: "pending-result-service-operation.v1", status: "feedback_pending", incomeLineId: "income.endoscopy", serviceOperationId: null,
  });
  await page.getByRole("button", { name: "Enact Plan", exact: true }).click();
  let state = (await getActiveState(page)) as unknown as GameState;
  let current = linkedQuestionOperation(state);
  expect(current).toMatchObject({ phaseFlowVersion: 1, phaseIndex: 0, testChoiceOrder: { purpose: "result_gate", routeId: "route.colonoscopy.in_house" } });
  expect(state.encounters[ENCOUNTER_ID]!.pendingResult?.localServiceOperation).toMatchObject({ status: "waiting_for_service", serviceOperationId: current.id });
  state = advanceUntil(state, "question-walking-to-prep", (candidate) => {
    const linked = linkedQuestionOperation(candidate);
    return linked.status === "walking_to_service" && linked.path.length > 2;
  });
  current = linkedQuestionOperation(state);
  expect(pathHasTurn(current.path)).toBe(true);
  await installState(page, state, campaignName);
  await assertRenderedOperationRoute(page, current);
  await capture(page, "00-question-walking-to-periop", state);
  state = advanceUntil(state, "question-to-prep", (candidate) => linkedQuestionOperation(candidate).status === "in_service");
  current = linkedQuestionOperation(state);
  const prepStart = current.phaseStartedAtFacilityTick!;
  const prepEnd = current.phaseEndsAtFacilityTick!;
  expect(prepEnd - prepStart).toBe(30);
  expect(current.location).toEqual(getRoomWaitingAnchors(
    state.rooms.find((candidate) => candidate.id === current.reservedRoomInstanceIds[0])!,
    getRoomDefinition("room.periop_recovery")!,
  )[0]);
  expect(state.environment.founderActivity?.targetId).not.toBe(current.id);
  await installState(page, state, campaignName);
  await capture(page, "01-question-arrived-periop", state);

  state = advanceUntil(state, "prep-plus-12", (candidate) => candidate.facilityTick === prepStart + 12);
  await installState(page, state, campaignName);
  const beforeReload = (await getActiveState(page)) as unknown as GameState;
  await page.reload();
  await page.getByRole("button", { name: `Resume ${campaignName}` }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  const afterReload = (await getActiveState(page)) as unknown as GameState;
  expect(linkedQuestionOperation(afterReload).phaseStartedAtFacilityTick).toBe(prepStart);
  expect(linkedQuestionOperation(afterReload).phaseEndsAtFacilityTick).toBe(prepEnd);
  expect(afterReload.facilityTick).toBe(beforeReload.facilityTick);

  state = advanceUntil(afterReload, "prep-plus-29", (candidate) => candidate.facilityTick === prepEnd - 1);
  expect(linkedQuestionOperation(state)).toMatchObject({ phaseIndex: 0, status: "in_service" });
  await installState(page, state, campaignName);
  await capture(page, "02-question-prep-minute-29", state);
  state = advance(state, "prep-minute-30");
  current = linkedQuestionOperation(state);
  expect(current).toMatchObject({ phaseIndex: 0, status: "waiting_for_next_phase", providerReservation: null });
  const blockingProcedures = state.serviceOperations.filter((candidate) =>
    candidate.actorKind === "visitor" && candidate.phaseIndex === 1 && candidate.status === "in_service");
  expect(new Set(blockingProcedures.map((candidate) => candidate.providerReservation?.kind))).toEqual(new Set(["employee", "founder"]));
  expect(blockingProcedures.every((candidate) => candidate.reservedRoomInstanceIds.some((id) =>
    state.rooms.find((roomCandidate) => roomCandidate.id === id)?.roomDefinitionId === "room.endoscopy"))).toBe(true);
  expect(current.phaseStartedAtFacilityTick).toBeNull();
  expect(current.phaseEndsAtFacilityTick).toBeNull();
  expect(state.environment.founderActivity?.targetId).not.toBe(current.id);
  state = { ...state, paused: true };
  await installState(page, state, campaignName);
  await page.getByRole("button", { name: /Colonoscopy Question Patient portrait/ }).click();
  await expect(page.getByText("Ready in Peri-op — waiting for procedure", { exact: true }).first()).toBeVisible();
  await capture(page, "03-question-ready-provider-blocked", state);

  const waitingLocation = { ...current.location! };
  state = advanceUntil(state, "provider-release", (candidate) => {
    const linked = linkedQuestionOperation(candidate);
    return linked.phaseIndex === 1 && (linked.status === "walking_between_phases" || linked.status === "in_service");
  });
  current = linkedQuestionOperation(state);
  expect(current.providerReservation).not.toBeNull();
  expect(current.path[0]).toEqual(waitingLocation);
  state = advanceUntil(state, "question-procedure", (candidate) => {
    const linked = linkedQuestionOperation(candidate);
    return linked.phaseIndex === 1 && linked.status === "in_service";
  });
  await installState(page, state, campaignName);
  await capture(page, "04-question-endoscopy", state);
  state = advanceUntil(state, "question-recovery", (candidate) => {
    const linked = linkedQuestionOperation(candidate);
    return linked.phaseIndex === 2 && linked.status === "in_service";
  });
  await installState(page, state, campaignName);
  await capture(page, "05-question-recovery", state);
  state = advanceUntil(state, "question-local-complete", (candidate) => candidate.encounters[ENCOUNTER_ID]?.pendingResult?.localServiceOperation?.status === "external_processing");
  const completed = linkedQuestionOperation(state);
  expect(completed.status).toBe("completed");
  expect(state.encounters[ENCOUNTER_ID]!.pendingResult).toMatchObject({
    localServiceOperation: { status: "external_processing", serviceOperationId: completed.id },
    scheduledAtTick: completed.completedAtFacilityTick,
  });
  expect(state.serviceIncomeReceipts.filter((receipt) => receipt.actorId === ENCOUNTER_ID)).toHaveLength(1);
  expect(state.operationReceipts["periop.question.admit"]?.status).toBe("applied");
  writeFileSync(join(ROOT, "final-summary.json"), JSON.stringify({ prepStart, prepEnd, completedAt: completed.completedAtFacilityTick, receipt: state.serviceIncomeReceipts.find((receipt) => receipt.actorId === ENCOUNTER_ID) }, null, 2));
});
