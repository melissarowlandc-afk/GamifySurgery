import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  gameReducer,
  getCurrentQuestion,
  getFacilityAccessValidation,
  getRoomCareAnchor,
  getRoomDefinition,
  getRoomNavigationAnchor,
  getRoomWaitingAnchors,
  pathEntersUnauthorizedProtectedRoom,
  protectedCareRoomAtPoint,
  startEncounterProcedureOperation,
  type GameState,
  type PlacedRoom,
} from "@gamify-surgery/game-domain";
import { getActiveState, getProfile, PROFILE_KEY, startClinic } from "./helpers";

const EVIDENCE = ".local-dev/gs031/browser-care-flow";
test.beforeAll(() => mkdirSync(EVIDENCE, { recursive: true }));
test.setTimeout(180_000);

const room = (id: string, roomDefinitionId: string, x: number, y: number, upgradeLevel = 1): PlacedRoom => ({
  id, roomDefinitionId, x, y, orientation: 0, doorSide: null,
  upgradeLevel: upgradeLevel as 1, cleanliness: 100,
});

function employee(state: GameState, id: string, role: string, home: PlacedRoom, location?: { x: number; y: number }) {
  const anchor = location ?? getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
  return {
    id, staffRoleDefinitionId: role, displayName: id, appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 1, morale: 100, trainingLevel: 1 as const,
    homeRoomInstanceId: home.id, location: { ...anchor }, path: [{ ...anchor }], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  };
}

function quiet(state: GameState): void {
  state.facilityLevel = 2;
  state.paused = true;
  state.simulationSpeed = 4;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.nextFinancialPostingTick = Number.MAX_SAFE_INTEGER;
  state.serviceAppointmentsEnabled = false;
  state.environment.nextLitterSpawnTick = Number.MAX_SAFE_INTEGER;
  state.environment.nextWaterCoolerDrainTick = Number.MAX_SAFE_INTEGER;
  state.environment.ambientPedestrians = [];
  state.environment.litterItems = [];
  state.environment.founderActivity = null;
  state.environment.pendingFounderConsult = null;
  state.environment.suspendedFounderActivity = null;
  state.encounters = {};
  state.employees = [];
  state.serviceOperations = [];
  state.retailOperations = [];
  state.retailExternalActors = [];
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.openEmployeeDiscussionId = null;
  state.employeeDiscussions = {};
  state.operationReceipts = {};
}

function setExplicitChair(state: GameState, waiting: PlacedRoom, index = 3) {
  const chair = getRoomWaitingAnchors(waiting, getRoomDefinition(waiting.roomDefinitionId)!)[index]!;
  state.environment.founderLocation = { ...chair };
  state.environment.founderActivity = {
    kind: "sit_in_chair", targetId: `${waiting.id}.${chair.x}.${chair.y}`,
    path: [{ ...chair }], pathIndex: 0, lastMovedAtFacilityTick: state.facilityTick,
    workMinutesRemaining: Number.MAX_SAFE_INTEGER, explicitSeat: true,
  };
  return chair;
}

function expectValidFacility(state: GameState): void {
  expect(getFacilityAccessValidation(state)).toMatchObject({ valid: true, unreachableRoomIds: [] });
}

async function install(page: Page, name: string, state: GameState): Promise<void> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((item) => item.campaignId === profile.activeCampaignId)!;
  campaign.name = name;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value, marker }) => {
    if (sessionStorage.getItem(marker)) return;
    sessionStorage.setItem(marker, "1");
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: PROFILE_KEY, value: profile, marker: `gs031-care.${name}` });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button", { name: `Resume ${name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
}

async function prepare(page: Page, name: string, transform: (state: GameState) => GameState | void): Promise<GameState> {
  await startClinic(page, `${name} Founder`, name);
  const state = (await getActiveState(page)) as unknown as GameState;
  const result = transform(state) ?? state;
  expectValidFacility(result);
  await install(page, name, result);
  return result;
}

async function state(page: Page): Promise<GameState> {
  return (await getActiveState(page)) as unknown as GameState;
}

async function answerCorrect(page: Page, encounterId: string): Promise<string> {
  const current = await state(page);
  const choice = getCurrentQuestion(current, encounterId)?.node.answerChoices.find((item) => item.isCorrect);
  if (!choice) throw new Error(`No correct answer is available for ${encounterId}.`);
  await page.getByRole("button", { name: choice.label, exact: true }).click();
  return choice.id;
}

async function panFacilityMap(page: Page, deltaY: number): Promise<void> {
  const canvas = page.getByTestId("facility-canvas");
  const box = await canvas.boundingBox();
  if (!box) throw new Error("The facility canvas is unavailable for evidence framing.");
  const x = box.x + box.width * 0.7;
  const y = box.y + box.height * 0.55;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x, y + deltaY, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(150);
}

async function captureFullPageEvidence(page: Page, path: string): Promise<void> {
  const pause = page.locator(".facility-pause-indicator");
  const paused = await pause.isVisible();
  if (paused) await pause.evaluate((element: HTMLElement) => { element.style.visibility = "hidden"; });
  await page.screenshot({ path, animations: "disabled", fullPage: true });
  if (paused) await pause.evaluate((element: HTMLElement) => { element.style.visibility = ""; });
}

function patientFixture(state: GameState) {
  quiet(state);
  const front = state.rooms.find((item) => item.roomDefinitionId === "room.front_desk")!;
  const exterior = state.doors.filter((door) => door.roomId === front.id && door.exterior);
  const waiting = room("gs031.care.waiting", "room.waiting", 28, 28);
  const examNorth = room("gs031.care.exam-north", "room.examination", 33, 20);
  const examEast = room("gs031.care.exam-east", "room.examination", 33, 24);
  state.rooms = [front, waiting, examNorth, examEast, ...[20, 21, 22, 23, 24, 25, 26, 27, 28].map((y) => room(`gs031.care.hall.${y}`, "room.hallway", 32, y))];
  state.doors = [...exterior,
    { id: "gs031.care.front", roomId: front.id, side: "west", offset: 0, exterior: false },
    { id: "gs031.care.waiting", roomId: waiting.id, side: "east", offset: 0, exterior: false },
    { id: "gs031.care.exam-north", roomId: examNorth.id, side: "west", offset: 1, exterior: false },
    { id: "gs031.care.exam-east", roomId: examEast.id, side: "west", offset: 1, exterior: false },
  ];
  let next = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "gs031.waiting.admit", encounterId: "gs031.waiting-patient", caseId: "case.breast-cyst.under-30-asymptomatic-simple", patientDisplayName: "Waiting Chart Patient", arrivalClass: "routine" });
  next = gameReducer(next, { type: "ADMIT_PATIENT", operationId: "gs031.existing.admit", encounterId: "gs031.existing-patient", caseId: "case.breast-cyst.under-30-asymptomatic-simple", patientDisplayName: "Existing Chart Patient", arrivalClass: "routine" });
  if (next.operationReceipts["gs031.waiting.admit"]?.status !== "applied" || next.operationReceipts["gs031.existing.admit"]?.status !== "applied") {
    throw new Error(`The two approved patient fixtures were not admitted: ${JSON.stringify({
      waiting: next.operationReceipts["gs031.waiting.admit"],
      existing: next.operationReceipts["gs031.existing.admit"],
    })}`);
  }
  const waitingEncounter = next.encounters["gs031.waiting-patient"]!;
  const waitingLocation = getRoomWaitingAnchors(waiting, getRoomDefinition(waiting.roomDefinitionId)!)[3]!;
  Object.assign(waitingEncounter, {
    checkInStatus: "checked_in", lifecycle: "waiting_unopened", patientMovement: null,
    patientLocation: waitingLocation, assignedRoomInstanceId: waiting.id, queuedCareRoomInstanceId: null,
    waitingDestination: { roomInstanceId: waiting.id, location: waitingLocation, kind: "chair" },
  });
  const existing = next.encounters["gs031.existing-patient"]!;
  const examLocation = getRoomCareAnchor(examEast, getRoomDefinition(examEast.roomDefinitionId)!, "patient");
  Object.assign(existing, {
    checkInStatus: "checked_in", lifecycle: "active_action_required", patientMovement: null,
    patientLocation: examLocation, assignedRoomInstanceId: examEast.id, queuedCareRoomInstanceId: null,
    waitingDestination: null,
  });
  next.environment.founderActivity = null;
  return { state: next, founderStart: { ...next.environment.founderLocation } };
}

function employeeDiscussionFixture(state: GameState) {
  quiet(state);
  const front = state.rooms.find((item) => item.roomDefinitionId === "room.front_desk")!;
  const exterior = state.doors.filter((door) => door.roomId === front.id && door.exterior);
  const waiting = room("gs031.employee.waiting", "room.waiting", 33, 22);
  const glp = room("gs031.employee.glp", "room.glp1_telehealth_suite", 29, 29);
  state.rooms = [front, waiting, glp, ...[22, 23, 24, 25, 26, 27, 28, 29, 30].map((y) => room(`gs031.employee.hall.${y}`, "room.hallway", 32, y))];
  state.doors = [...exterior,
    { id: "gs031.employee.front", roomId: front.id, side: "west", offset: 0, exterior: false },
    { id: "gs031.employee.waiting", roomId: waiting.id, side: "west", offset: 2, exterior: false },
    { id: "gs031.employee.glp", roomId: glp.id, side: "east", offset: 1, exterior: false },
  ];
  state.employees = [employee(state, "gs031.employee.np", "staff.glp1_np", glp, { x: 31, y: 30 })];
  state.nextEmployeeDiscussionTick = state.facilityTick + 1;
  state.paused = false;
  let next = gameReducer(state, { type: "ADVANCE_TICK", operationId: "gs031.employee.schedule" }, PROTOTYPE_DOMAIN_CONTEXT);
  next.paused = true;
  const discussion = Object.values(next.employeeDiscussions ?? {})[0];
  if (!discussion) throw new Error("Production employee discussion did not schedule.");
  const chair = setExplicitChair(next, waiting);
  return { state: next, discussion, chair };
}

function endoscopyConsultFixture(state: GameState) {
  quiet(state);
  const front = state.rooms.find((item) => item.roomDefinitionId === "room.front_desk")!;
  const exterior = state.doors.filter((door) => door.roomId === front.id && door.exterior);
  const waiting = room("gs031.endo.waiting", "room.waiting", 33, 18);
  const exam = room("gs031.endo.exam", "room.examination", 33, 25);
  const endoscopy = room("gs031.endo.suite", "room.endoscopy", 28, 23);
  const periop = room("gs031.endo.periop", "room.periop_recovery", 26, 26);
  state.rooms = [front, waiting, exam, endoscopy, periop, ...[20, 21, 22, 23, 24, 25, 26, 27, 28].map((y) => room(`gs031.endo.hall.${y}`, "room.hallway", 32, y))];
  state.doors = [...exterior,
    { id: "gs031.endo.front", roomId: front.id, side: "west", offset: 0, exterior: false },
    { id: "gs031.endo.waiting", roomId: waiting.id, side: "west", offset: 2, exterior: false },
    { id: "gs031.endo.exam", roomId: exam.id, side: "west", offset: 1, exterior: false },
    { id: "gs031.endo.suite", roomId: endoscopy.id, side: "east", offset: 1, exterior: false },
    { id: "gs031.endo.periop", roomId: periop.id, side: "east", offset: 1, exterior: false },
  ];
  state.employees = [
    employee(state, "gs031.endo.nurse", "staff.endoscopy_nurse", endoscopy),
    employee(state, "gs031.endo.provider", "staff.endoscopist", endoscopy),
    employee(state, "gs031.endo.periop-nurse", "staff.periop_nurse", periop),
  ];
  let next = gameReducer(state, { type: "ADMIT_PATIENT", operationId: "gs031.endo.admit", encounterId: "gs031.endo-patient", caseId: "case.colorectal.routine-screen", patientDisplayName: "Endoscopy Consult Patient", arrivalClass: "routine" });
  const encounter = next.encounters["gs031.endo-patient"]!;
  const orderNodeIndex = encounter.frozenCase.decisionNodes.findIndex(
    (node) => node.id === "node.colorectal.routine-screen.1",
  );
  if (orderNodeIndex < 0) throw new Error("The approved colorectal order node is unavailable.");
  encounter.currentNodeIndex = orderNodeIndex;
  encounter.steps.forEach((step, index) => {
    step.status = index < orderNodeIndex ? "completed" : index === orderNodeIndex ? "action_required" : "locked";
  });
  Object.assign(encounter, {
    checkInStatus: "checked_in", lifecycle: "active_action_required", patientMovement: null,
    patientLocation: getRoomCareAnchor(exam, getRoomDefinition(exam.roomDefinitionId)!, "patient"),
    assignedRoomInstanceId: exam.id, queuedCareRoomInstanceId: null, waitingDestination: null,
  });
  next.openChartEncounterId = encounter.id;
  next.attendedEncounterId = encounter.id;
  const first = getCurrentQuestion(next, encounter.id)!;
  const choice = first.node.answerChoices.find((item) => item.isCorrect)!;
  next = gameReducer(next, { type: "SUBMIT_ANSWER", operationId: "gs031.endo.order", encounterId: encounter.id, decisionNodeId: first.node.id, answerChoiceId: choice.id, reviewedAtMs: 10_000 });
  next = gameReducer(next, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: "gs031.endo.feedback", encounterId: encounter.id, decisionNodeId: first.node.id });
  next.paused = false;
  let providerWitness: NonNullable<(typeof next.serviceOperations)[number]["providerReservation"]> | null = null;
  for (let index = 0; index < 600; index += 1) {
    const current = next.encounters[encounter.id]!;
    if (current.currentNodeIndex > orderNodeIndex && current.lifecycle === "active_action_required" && current.pendingResult?.deliveredAtTick !== null) break;
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `gs031.endo.tick.${index}` });
    const operationProvider = next.serviceOperations.find((operation) =>
      operation.actorId === encounter.id && operation.phaseIndex === 1 && operation.status === "in_service"
    )?.providerReservation;
    if (operationProvider?.kind === "employee") providerWitness = { ...operationProvider };
  }
  const ready = next.encounters[encounter.id]!;
  if (!(ready.currentNodeIndex > orderNodeIndex && ready.lifecycle === "active_action_required" && ready.pendingResult?.deliveredAtTick !== null)) {
    throw new Error(`Endoscopy result question did not become ready: ${JSON.stringify({
      tick: next.facilityTick,
      lifecycle: ready.lifecycle,
      currentNodeIndex: ready.currentNodeIndex,
      orderNodeIndex,
      pendingResult: ready.pendingResult,
      movement: ready.patientMovement,
      operations: next.serviceOperations,
    })}`);
  }
  if (providerWitness?.kind !== "employee") throw new Error("The staffed Endoscopy phase never used the named employee provider.");
  next.openChartEncounterId = null;
  next.attendedEncounterId = null;
  next.environment.pendingFounderConsult = null;
  const chair = setExplicitChair(next, waiting);
  next.paused = true;
  return { state: next, encounterId: encounter.id, chair, providerWitness };
}

function endoscopyClearanceFixture(state: GameState) {
  quiet(state);
  const front = state.rooms.find((item) => item.roomDefinitionId === "room.front_desk")!;
  const exterior = state.doors.filter((door) => door.roomId === front.id && door.exterior);
  const endoscopy = room("gs031.clearance.endoscopy", "room.endoscopy", 33, 23);
  const periop = room("gs031.clearance.periop", "room.periop_recovery", 38, 23, 5);
  state.rooms = [
    front, endoscopy, periop,
    room("gs031.clearance.hall.corner", "room.hallway", 32, 22),
    ...[23, 24, 25, 26, 27, 28].map((y) => room(`gs031.clearance.hall.west.${y}`, "room.hallway", 32, y)),
    ...[33, 34, 35, 36, 37].map((x) => room(`gs031.clearance.hall.north.${x}`, "room.hallway", x, 22)),
    room("gs031.clearance.hall.east", "room.hallway", 37, 23),
    room("gs031.clearance.hall.bridge", "room.hallway", 37, 24),
  ];
  state.doors = [...exterior,
    { id: "gs031.clearance.front", roomId: front.id, side: "west", offset: 0, exterior: false },
    { id: "gs031.clearance.endoscopy.west", roomId: endoscopy.id, side: "west", offset: 1, exterior: false },
    { id: "gs031.clearance.endoscopy.east", roomId: endoscopy.id, side: "east", offset: 1, exterior: false },
    { id: "gs031.clearance.periop.west", roomId: periop.id, side: "west", offset: 1, exterior: false },
  ];
  state.employees = [
    employee(state, "gs031.clearance.endo-nurse", "staff.endoscopy_nurse", endoscopy),
    employee(state, "gs031.clearance.provider", "staff.endoscopist", endoscopy),
    employee(state, "gs031.clearance.periop-nurse", "staff.periop_nurse", periop),
  ];
  const encounterIds = ["gs031.clearance.first", "gs031.clearance.second"] as const;
  let next = state;
  for (const [index, encounterId] of encounterIds.entries()) {
    next = gameReducer(next, {
      type: "ADMIT_PATIENT", operationId: `gs031.clearance.admit.${index}`,
      encounterId, caseId: "case.colorectal.routine-screen",
      patientDisplayName: index === 0 ? "Outgoing Endoscopy Patient" : "Next Endoscopy Patient",
      arrivalClass: "routine",
    });
    const encounter = next.encounters[encounterId]!;
    encounter.checkInStatus = "checked_in";
    encounter.lifecycle = "active_action_required";
    encounter.patientMovement = null;
    encounter.patientLocation = { x: 32, y: 27 - index };
    encounter.assignedRoomInstanceId = null;
    encounter.queuedCareRoomInstanceId = null;
    encounter.waitingDestination = null;
    if (!startEncounterProcedureOperation(next, encounter, "income.endoscopy", PROTOTYPE_DOMAIN_CONTEXT)) {
      throw new Error(`Could not start the real Endoscopy operation for ${encounterId}.`);
    }
  }
  next.paused = false;
  for (let minute = 0; minute < 360; minute += 1) {
    const first = next.serviceOperations.find((operation) => operation.actorId === encounterIds[0]);
    if (first?.phaseIndex === 2 && first.status === "walking_between_phases") break;
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `gs031.clearance.tick.${minute}` });
  }
  const operations = encounterIds.map((encounterId) => next.serviceOperations.find((operation) => operation.actorId === encounterId)!);
  if (!(operations[0]?.phaseIndex === 2 && operations[0].status === "walking_between_phases")) {
    throw new Error(`The outgoing Endoscopy patient did not begin physical clearance: ${JSON.stringify({
      facilityTick: next.facilityTick,
      operations,
      encounters: encounterIds.map((encounterId) => {
        const encounter = next.encounters[encounterId]!;
        return {
          id: encounter.id,
          lifecycle: encounter.lifecycle,
          location: encounter.patientLocation,
          movement: encounter.patientMovement,
          assignedRoomInstanceId: encounter.assignedRoomInstanceId,
          queuedCareRoomInstanceId: encounter.queuedCareRoomInstanceId,
        };
      }),
      employees: next.employees.map((member) => ({
        id: member.id,
        role: member.staffRoleDefinitionId,
        location: member.location,
        path: member.path,
        pathIndex: member.pathIndex,
        facilityTask: member.facilityTask,
      })),
    })}`);
  }
  if (operations[1]?.reservedRoomInstanceIds.includes(endoscopy.id)) {
    throw new Error("The next Endoscopy patient entered before the outgoing patient began clearance.");
  }
  next.environment.founderLocation = { x: 32, y: 24 };
  next.environment.founderActivity = {
    kind: "wander_facility", targetId: "gs031.clearance.unrelated-loiterer",
    path: [{ x: 32, y: 24 }, { x: 33, y: 24 }], pathIndex: 0,
    lastMovedAtFacilityTick: next.facilityTick, workMinutesRemaining: 10,
  };
  next.paused = true;
  return { state: next, firstId: operations[0].id, secondId: operations[1].id, endoscopy, periop };
}

test("Waiting and Existing charts open immediately while founder travel remains concurrent and switching works", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop proof");
  let fixture!: ReturnType<typeof patientFixture>;
  await prepare(page, "GS031 Immediate Charts", (initial) => { fixture = patientFixture(initial); return fixture.state; });
  await page.getByText("Waiting Chart Patient", { exact: true }).click();
  await expect(page.locator(".chart-sheet .cs-answer").first()).toBeVisible();
  let current = await state(page);
  expect(current.openChartEncounterId).toBe("gs031.waiting-patient");
  expect(current.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: "gs031.waiting-patient" });
  expect(current.environment.founderActivity!.pathIndex).toBeLessThan(current.environment.founderActivity!.path.length - 1);
  await page.getByText("Existing Chart Patient", { exact: true }).click();
  await expect(page.locator(".chart-sheet .cs-answer").first()).toBeVisible();
  current = await state(page);
  expect(current.openChartEncounterId).toBe("gs031.existing-patient");
  expect(current.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: "gs031.existing-patient" });
  await page.screenshot({ path: join(EVIDENCE, "desktop-immediate-chart-switch.png"), animations: "disabled" });
  writeFileSync(join(EVIDENCE, "desktop-immediate-chart-switch.json"), `${JSON.stringify({ founderStart: fixture.founderStart, open: current.openChartEncounterId, activity: current.environment.founderActivity }, null, 2)}\n`);
});

test("employee question opens before arrival, answers early, and resumes an explicit chair without retry", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop proof");
  let fixture!: ReturnType<typeof employeeDiscussionFixture>;
  await prepare(page, "GS031 Employee Consult", (initial) => { fixture = employeeDiscussionFixture(initial); return fixture.state; });
  await page.getByText(fixture.discussion.employeeDisplayName, { exact: true }).click();
  await expect(page.getByRole("complementary", { name: "Team discussion" }).locator(".answer-choice").first()).toBeVisible();
  let current = await state(page);
  expect(current.openEmployeeDiscussionId).toBe(fixture.discussion.id);
  expect(current.environment.founderActivity).toMatchObject({ kind: "attend_employee_discussion", targetId: fixture.discussion.id });
  expect(current.environment.founderActivity!.pathIndex).toBeLessThan(current.environment.founderActivity!.path.length - 1);
  expect(current.environment.suspendedFounderActivity).toMatchObject({ kind: "sit_in_chair", explicitSeat: true });
  const choice = current.employeeDiscussions![fixture.discussion.id]!.frozenCase.decisionNodes[0]!.answerChoices.find((item) => item.isCorrect)!;
  await page.getByRole("button", { name: choice.label, exact: true }).click();
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeVisible();
  current = await state(page);
  expect(current.environment.founderActivity).toMatchObject({ kind: "sit_in_chair", explicitSeat: true });
  expect(current.environment.founderActivity?.path.at(-1)).toEqual(fixture.chair);
  expect(current.environment.pendingFounderConsult).toBeNull();
  expect(current.environment.suspendedFounderActivity).toBeNull();
  expect(current.employees.find((item) => item.id === fixture.discussion.employeeId)?.facilityTask).toBeNull();
  const answerCount = current.employeeDiscussions![fixture.discussion.id]!.answers.length;
  await page.getByRole("button", { name: "Resume facility time" }).click();
  const tick = current.facilityTick;
  await expect.poll(async () => (await state(page)).facilityTick).toBeGreaterThan(tick);
  current = await state(page);
  expect(current.environment.founderActivity).toMatchObject({ kind: "sit_in_chair", explicitSeat: true });
  expect(current.employeeDiscussions![fixture.discussion.id]!.answers).toHaveLength(answerCount);
  expect(current.operationReceipts["system.open-chart-attendance-retry"]).toBeUndefined();
  const xp = current.clinicalXp;
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume GS031 Employee Consult" });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeVisible();
  current = await state(page);
  expect(current.clinicalXp).toBe(xp);
  expect(current.employeeDiscussions![fixture.discussion.id]!.answers).toHaveLength(answerCount);
  await page.screenshot({ path: join(EVIDENCE, "desktop-employee-early-answer-resume.png"), animations: "disabled" });
});

test("staffed Endoscopy result question opens as a concurrent consult after the named provider completes the service", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop proof");
  let fixture!: ReturnType<typeof endoscopyConsultFixture>;
  await prepare(page, "GS031 Endoscopy Consult", (initial) => { fixture = endoscopyConsultFixture(initial); return fixture.state; });
  await page.getByText("Endoscopy Consult Patient", { exact: true }).click();
  let current = await state(page);
  const readyChoice = getCurrentQuestion(current, fixture.encounterId)?.node.answerChoices.find((item) => item.isCorrect);
  if (!readyChoice) throw new Error("The returned Endoscopy question is not answer-ready.");
  await expect(page.getByRole("button", { name: readyChoice.label, exact: true })).toBeVisible();
  const pending = current.encounters[fixture.encounterId]!.pendingResult!;
  expect(fixture.providerWitness).toMatchObject({ kind: "employee", employeeId: "gs031.endo.provider" });
  expect(current.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: fixture.encounterId });
  expect(current.environment.founderActivity?.path.at(-1)).toEqual(getRoomNavigationAnchor(
    current.rooms.find((item) => item.id === "gs031.endo.suite")!,
    getRoomDefinition("room.endoscopy")!,
    "staff",
  ));
  const answersBefore = current.encounters[fixture.encounterId]!.answers.length;
  const xpBefore = current.clinicalXp;
  await answerCorrect(page, fixture.encounterId);
  current = await state(page);
  expect(current.encounters[fixture.encounterId]!.answers).toHaveLength(answersBefore + 1);
  expect(current.environment.founderActivity).toMatchObject({ kind: "sit_in_chair", explicitSeat: true });
  const xpAfter = current.clinicalXp;
  expect(xpAfter).toBeGreaterThanOrEqual(xpBefore);
  const serializedBeforeReload = JSON.stringify({
    answer: current.encounters[fixture.encounterId]!.answers.at(-1),
    provider: current.encounters[fixture.encounterId]!.pendingResult?.providerReservation,
    xp: current.clinicalXp,
  });
  await page.reload();
  const resume = page.getByRole("button", { name: "Resume GS031 Endoscopy Consult" });
  if (await resume.isVisible()) await resume.click();
  current = await state(page);
  expect(JSON.stringify({
    answer: current.encounters[fixture.encounterId]!.answers.at(-1),
    provider: current.encounters[fixture.encounterId]!.pendingResult?.providerReservation,
    xp: current.clinicalXp,
  })).toBe(serializedBeforeReload);
  await page.screenshot({ path: join(EVIDENCE, "desktop-endoscopy-consult-reload.png"), animations: "disabled" });
  writeFileSync(join(EVIDENCE, "desktop-endoscopy-consult-reload.json"), `${serializedBeforeReload}\n`);
});

test("an unanswered returned Endoscopy consult survives facility ticks and reaches the associated suite", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop proof");
  let fixture!: ReturnType<typeof endoscopyConsultFixture>;
  await prepare(page, "GS031 Endoscopy Travel", (initial) => { fixture = endoscopyConsultFixture(initial); return fixture.state; });
  await page.getByText("Endoscopy Consult Patient", { exact: true }).click();
  let current = await state(page);
  const question = getCurrentQuestion(current, fixture.encounterId);
  if (!question) throw new Error("The returned Endoscopy question is not immediately available.");
  await expect(page.getByRole("button", { name: question.node.answerChoices.find((choice) => choice.isCorrect)!.label, exact: true })).toBeVisible();
  const suite = current.rooms.find((item) => item.id === "gs031.endo.suite")!;
  const suiteStaff = getRoomNavigationAnchor(suite, getRoomDefinition(suite.roomDefinitionId)!, "staff");
  const answerCount = current.encounters[fixture.encounterId]!.answers.length;
  const openedAtTick = current.facilityTick;
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => (await state(page)).facilityTick, { timeout: 15_000 }).toBeGreaterThan(openedAtTick);
  current = await state(page);
  expect(current.environment.founderActivity).toMatchObject({ kind: "attend_encounter", targetId: fixture.encounterId });
  expect(current.environment.founderActivity?.path.at(-1)).toEqual(suiteStaff);
  expect(current.encounters[fixture.encounterId]!.answers).toHaveLength(answerCount);
  await expect.poll(async () => (await state(page)).environment.founderLocation, { timeout: 20_000 }).toEqual(suiteStaff);
  current = await state(page);
  expect(current.environment.pendingFounderConsult).toMatchObject({ kind: "encounter", targetId: fixture.encounterId });
  expect(current.encounters[fixture.encounterId]!.answers).toHaveLength(answerCount);
  await panFacilityMap(page, 180);
  await captureFullPageEvidence(page, join(EVIDENCE, "desktop-endoscopy-unanswered-suite-arrival.png"));
  await page.getByRole("button", { name: "Pause facility time" }).click();
});

test("Endoscopy stays assigned until the outgoing patient physically clears, then admits the next patient without a protected-room shortcut", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop-chrome", "controlled desktop proof");
  let fixture!: ReturnType<typeof endoscopyClearanceFixture>;
  await prepare(page, "GS031 Physical Clearance", (initial) => { fixture = endoscopyClearanceFixture(initial); return fixture.state; });
  let current = await state(page);
  const firstAtStart = current.serviceOperations.find((operation) => operation.id === fixture.firstId)!;
  const secondAtStart = current.serviceOperations.find((operation) => operation.id === fixture.secondId)!;
  const firstBeforeSerialize = fixture.state.serviceOperations.find((operation) => operation.id === fixture.firstId)!;
  const firstRoomAtStart = protectedCareRoomAtPoint(current, PROTOTYPE_DOMAIN_CONTEXT, firstAtStart.location!);
  if (firstRoomAtStart?.id !== fixture.endoscopy.id) {
    const summarizeEncounter = (source: GameState) => {
      const encounter = source.encounters[firstAtStart.actorId]!;
      return {
        location: encounter.patientLocation,
        movement: encounter.patientMovement,
        assignedRoomInstanceId: encounter.assignedRoomInstanceId,
        queuedCareRoomInstanceId: encounter.queuedCareRoomInstanceId,
      };
    };
    const summarizeOperation = (operation: typeof firstAtStart) => ({
      status: operation.status,
      phaseIndex: operation.phaseIndex,
      location: operation.location,
      path: operation.path,
      pathIndex: operation.pathIndex,
      lastMovedAtFacilityTick: operation.lastMovedAtFacilityTick,
      transitionHeldRoomInstanceIds: operation.transitionHeldRoomInstanceIds,
      reservedRoomInstanceIds: operation.reservedRoomInstanceIds,
    });
    throw new Error(`Outgoing Endoscopy patient moved across save/load: ${JSON.stringify({
      before: {
        tick: fixture.state.facilityTick,
        operation: summarizeOperation(firstBeforeSerialize),
        encounter: summarizeEncounter(fixture.state),
      },
      after: {
        tick: current.facilityTick,
        roomId: firstRoomAtStart?.id ?? null,
        operation: summarizeOperation(firstAtStart),
        encounter: summarizeEncounter(current),
      },
    })}`);
  }
  expect(firstAtStart.transitionHeldRoomInstanceIds).toContain(fixture.endoscopy.id);
  expect(secondAtStart.reservedRoomInstanceIds).not.toContain(fixture.endoscopy.id);
  expect(pathEntersUnauthorizedProtectedRoom(
    current,
    PROTOTYPE_DOMAIN_CONTEXT,
    firstAtStart.path,
    firstAtStart.pathIndex,
    new Set([fixture.endoscopy.id, fixture.periop.id]),
  )).toBe(false);
  const initialEvidence = {
    tick: current.facilityTick,
    outgoingLocation: firstAtStart.location,
    outgoingRoomId: protectedCareRoomAtPoint(current, PROTOTYPE_DOMAIN_CONTEXT, firstAtStart.location!)?.id ?? null,
    outgoingHoldsSuite: firstAtStart.transitionHeldRoomInstanceIds.includes(fixture.endoscopy.id),
    nextLocation: secondAtStart.location,
    nextOwnsSuite: secondAtStart.reservedRoomInstanceIds.includes(fixture.endoscopy.id),
  };
  await panFacilityMap(page, 220);
  await captureFullPageEvidence(page, join(EVIDENCE, "desktop-endoscopy-clearance-held.png"));

  const resumedAfterTick = current.facilityTick;
  await page.getByRole("button", { name: "Resume facility time" }).click();
  const snapshots: Array<{
    tick: number;
    outgoingRoomId: string | null;
    nextOwnsSuite: boolean;
    nextLocation: { x: number; y: number } | null;
    founderRoomId: string | null;
    founderEndpointRoomId: string | null;
  }> = [];
  for (let attempt = 0; attempt < 200; attempt += 1) {
    current = await state(page);
    const first = current.serviceOperations.find((operation) => operation.id === fixture.firstId)!;
    const second = current.serviceOperations.find((operation) => operation.id === fixture.secondId)!;
    const founderEndpoint = current.environment.founderActivity?.path.at(-1) ?? current.environment.founderLocation;
    const snapshot = {
      tick: current.facilityTick,
      outgoingRoomId: first.location ? protectedCareRoomAtPoint(current, PROTOTYPE_DOMAIN_CONTEXT, first.location)?.id ?? null : null,
      nextOwnsSuite: second.reservedRoomInstanceIds.includes(fixture.endoscopy.id),
      nextLocation: second.location ? { ...second.location } : null,
      founderRoomId: protectedCareRoomAtPoint(current, PROTOTYPE_DOMAIN_CONTEXT, current.environment.founderLocation)?.id ?? null,
      founderEndpointRoomId: protectedCareRoomAtPoint(current, PROTOTYPE_DOMAIN_CONTEXT, founderEndpoint)?.id ?? null,
    };
    if (snapshot.tick > resumedAfterTick && snapshots.at(-1)?.tick !== snapshot.tick) snapshots.push(snapshot);
    if (snapshot.nextOwnsSuite) break;
    await page.waitForTimeout(100);
  }
  const clearanceIndex = snapshots.findIndex((snapshot) => snapshot.outgoingRoomId !== fixture.endoscopy.id);
  const admissionIndex = snapshots.findIndex((snapshot) => snapshot.nextOwnsSuite);
  expect(clearanceIndex).toBeGreaterThanOrEqual(0);
  expect(admissionIndex).toBeGreaterThanOrEqual(clearanceIndex);
  expect(snapshots.slice(0, clearanceIndex).every((snapshot) => !snapshot.nextOwnsSuite)).toBe(true);
  expect(snapshots.every((snapshot) => snapshot.founderRoomId === null && snapshot.founderEndpointRoomId === null)).toBe(true);
  const admitted = snapshots[admissionIndex]!;
  expect(admitted.nextLocation).not.toBeNull();
  await captureFullPageEvidence(page, join(EVIDENCE, "desktop-endoscopy-physical-clearance.png"));
  await page.getByRole("button", { name: "Pause facility time" }).click();
  writeFileSync(join(EVIDENCE, "desktop-endoscopy-physical-clearance.json"), `${JSON.stringify({
    firstId: fixture.firstId,
    secondId: fixture.secondId,
    initialEvidence,
    clearanceIndex,
    admissionIndex,
    snapshots,
  }, null, 2)}\n`);
});
