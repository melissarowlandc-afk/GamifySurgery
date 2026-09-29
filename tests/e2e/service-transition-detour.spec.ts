import { expect, test, type Page } from "@playwright/test";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  gameReducer,
  getPendingPatientRoutePresentation,
  getRoomDefinition,
  getRoomNavigationAnchor,
  type GameState,
  type GridPoint,
} from "@gamify-surgery/game-domain";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPrototypePlayerView } from "../../apps/player/src/session/viewModels";
import { PROFILE_KEY, getActiveState, getProfile, startClinic } from "./helpers";

const ROOT = process.env.GAMIFY_SERVICE_DETOUR_ROOT ?? ".local-dev/gs025-service-detour";
const PHASE = process.env.GAMIFY_SERVICE_DETOUR_PHASE ?? "before";

type ServiceFixture = "ultrasound" | "minor" | "phlebotomy";

type TraceFrame = {
  now: number;
  facilityTick: number;
  projected: { location?: GridPoint; path?: GridPoint[]; pathIndex?: number; moving?: boolean; supportRole?: string } | null;
  track: {
    path: GridPoint[];
    signature: string;
    progress: number;
    targetIndex: number;
    sourceOffset: number;
    lastObservedPathIndex: number;
  } | null;
  sample: GridPoint | null;
  actor: { x: number; y: number; visible: boolean } | null;
};

function configureFacility(state: GameState, fixture: ServiceFixture): GameState {
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
  state.environment.founderActivity = null;
  const exam = {
    id: "room.detour.exam", roomDefinitionId: "room.examination", x: fixture === "minor" ? 29 : 34, y: fixture === "minor" ? 23 : 26,
    orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
  };
  const service = {
    id: `room.detour.${fixture}`,
    roomDefinitionId: fixture === "ultrasound" ? "room.ultrasound" : fixture === "minor" ? "room.minor_procedure" : "room.phlebotomy",
    x: fixture === "phlebotomy" ? 29 : 33, y: fixture === "phlebotomy" ? 26 : 23,
    orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
  };
  state.rooms.push(
    exam,
    service,
    ...(fixture === "phlebotomy" ? [{
      id: "room.detour.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23,
      orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
    }] : []),
    ...([24, 25, 26, 27, 28] as const).map((y) => ({
      id: `room.detour.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y,
      orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100,
    })),
  );
  state.doors.push(
    { id: "door.detour.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    ...(fixture === "phlebotomy" ? [
      { id: "door.detour.ultrasound", roomId: "room.detour.ultrasound", side: "south" as const, offset: 2, exterior: false },
      { id: "door.detour.ultrasound.staff", roomId: "room.detour.ultrasound", side: "west" as const, offset: 1, exterior: false },
    ] : []),
    ...(fixture === "minor" ? [{ id: "door.detour.exam", roomId: exam.id, side: "east" as const, offset: 1, exterior: false }] : []),
    { id: "door.detour.service", roomId: service.id, side: fixture === "minor" ? "west" : fixture === "phlebotomy" ? "east" : "south", offset: fixture === "ultrasound" ? 2 : 1, exterior: false },
    ...(fixture === "ultrasound" ? [{ id: "door.detour.service.staff", roomId: service.id, side: "west" as const, offset: 1, exterior: false }] : []),
  );
  const employeeLocation = fixture === "phlebotomy" ? { x: 31, y: 27 } : getRoomNavigationAnchor(
    service,
    getRoomDefinition(service.roomDefinitionId)!,
    fixture === "phlebotomy" ? "primary" : "staff",
  );
  state.employees = fixture === "minor" ? [] : [{
    id: `employee.detour.${fixture}`,
    staffRoleDefinitionId: fixture === "phlebotomy" ? "staff.phlebotomist" : "staff.imaging_technician",
    displayName: fixture === "phlebotomy" ? "Phlebotomist" : "Imaging Technician",
    appearance: state.founder.appearance,
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 26, morale: 90, trainingLevel: 1,
    homeRoomInstanceId: service.id,
    location: employeeLocation,
    path: [{ ...employeeLocation }], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null,
    nextIdleActionAtFacilityTick: Number.MAX_SAFE_INTEGER, facilityTask: null,
  }];
  return state;
}

function createOrderedState(state: GameState, fixture: ServiceFixture, encounterId: string): GameState {
  const selection = fixture === "ultrasound"
    ? { caseId: "case.thyroid-nodule.palpable-referral", conceptId: "concept.thyroid-nodule.fna-selection" }
    : fixture === "minor"
      ? { caseId: "case.mammary-paget.crusted-nipple", conceptId: "concept.mammary-paget.full-thickness-biopsy" }
      : PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases
          .flatMap((clinicalCase) => clinicalCase.decisionNodes.map((node) => ({ clinicalCase, node })))
          .filter(({ node }) => node.resultGateAfter?.resultTypeId === "service.basic_labs")
          .map(({ clinicalCase, node }) => ({ caseId: clinicalCase.id, conceptId: node.primaryConceptId }))[0];
  if (!selection) throw new Error(`No ${fixture} authored order is available.`);
  let next = configureFacility(state, fixture);
  next = gameReducer(next, {
    type: "ADMIT_PATIENT", operationId: `${encounterId}.admit`, encounterId,
    caseId: selection.caseId, patientDisplayName: `${fixture} transition patient`, arrivalClass: "routine",
  });
  const encounter = next.encounters[encounterId]!;
  const nodeIndex = encounter.frozenCase.decisionNodes.findIndex((node) => node.primaryConceptId === selection.conceptId);
  if (nodeIndex < 0) throw new Error(`Missing ${selection.conceptId}.`);
  encounter.currentNodeIndex = nodeIndex;
  encounter.steps.forEach((step, index) => {
    step.status = index < nodeIndex ? "completed" : index === nodeIndex ? "action_required" : "locked";
  });
  const exam = next.rooms.find((room) => room.id === "room.detour.exam")!;
  encounter.patientMovement = null;
  encounter.patientLocation = getRoomNavigationAnchor(exam, getRoomDefinition(exam.roomDefinitionId)!, "primary");
  encounter.assignedRoomInstanceId = exam.id;
  encounter.queuedCareRoomInstanceId = null;
  encounter.waitingDestination = null;
  encounter.checkInStatus = "checked_in";
  encounter.lifecycle = "active_action_required";
  next.openChartEncounterId = encounterId;
  next.attendedEncounterId = encounterId;
  const node = encounter.frozenCase.decisionNodes[nodeIndex]!;
  const correct = node.answerChoices.find((choice) => choice.isCorrect)!;
  next = gameReducer(next, {
    type: "SUBMIT_ANSWER", operationId: `${encounterId}.submit`, encounterId,
    decisionNodeId: node.id, answerChoiceId: correct.id, reviewedAtMs: 10_000,
  });
  next = gameReducer(next, {
    type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: `${encounterId}.ack`, encounterId, decisionNodeId: node.id,
  });
  const movement = next.encounters[encounterId]!.patientMovement;
  if (!movement || movement.path.length < 3) throw new Error(`${fixture} did not create a real multi-node patient route: ${JSON.stringify({
    receipt: next.operationReceipts[`${encounterId}.ack`],
    lifecycle: next.encounters[encounterId]!.lifecycle,
    pending: next.encounters[encounterId]!.pendingResult,
    movement,
  })}`);
  const initialSignature = movement.path.map(pointKey).join("|");
  next = { ...next, paused: false };
  let previous = next;
  for (let index = 0; index < 240; index += 1) {
    const candidate = gameReducer(next, { type: "ADVANCE_TICK", operationId: `${encounterId}.find-return.${index}` });
    const projected = projectedPatient(candidate, encounterId);
    const signature = projected?.path?.map(pointKey).join("|");
    if (signature && signature !== initialSignature) {
      return { ...previous, paused: true, simulationSpeed: 4 };
    }
    previous = candidate;
    next = candidate;
  }
  throw new Error(`${fixture} did not expose an actual outbound-to-return route replacement within 240 ticks.`);
}

function projectedPatient(state: GameState, encounterId: string) {
  return createPrototypePlayerView(state, null, false, null).facility.patients.find(
    (patient) => patient.instanceId === encounterId,
  ) ?? null;
}

function traceDomainRouteTimeline(state: GameState, encounterId: string, maximumTicks = 100) {
  const timeline: Array<{
    facilityTick: number;
    location?: GridPoint;
    path?: GridPoint[];
    pathIndex?: number;
    moving?: boolean;
    movementKind?: string;
  }> = [];
  let next = { ...state, paused: false };
  for (let index = 0; index <= maximumTicks; index += 1) {
    const projected = projectedPatient(next, encounterId);
    timeline.push({
      facilityTick: next.facilityTick,
      ...(projected?.location ? { location: { ...projected.location } } : {}),
      ...(projected?.path ? { path: projected.path.map((point) => ({ ...point })) } : {}),
      ...(projected?.pathIndex === undefined ? {} : { pathIndex: projected.pathIndex }),
      moving: projected?.moving,
      movementKind: next.encounters[encounterId]?.patientMovement?.kind,
    });
    next = gameReducer(next, { type: "ADVANCE_TICK", operationId: `${encounterId}.timeline.${index}` });
  }
  return timeline;
}

async function installFixture(page: Page, state: GameState, name: string): Promise<void> {
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find((candidate) => candidate.campaignId === profile.activeCampaignId);
  if (!campaign) throw new Error("Active private campaign is missing.");
  campaign.name = name;
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)), {
    key: PROFILE_KEY, value: profile,
  });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  expect(await page.evaluate(() => location.origin)).toBe("http://127.0.0.1:4197");
  const resume = page.getByRole("button", { name: `Resume ${name}` });
  if (await resume.isVisible()) await resume.click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.addStyleTag({ content: ".tutorial-overlay,.tutorial-card,.prototype-toolbar,.game-announcement,.facility-pause-indicator{display:none!important}" });
}

async function startTrace(page: Page, encounterId: string): Promise<void> {
  await page.evaluate((id) => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene") as any;
    const trace = { scene, frames: [] as TraceFrame[], running: true };
    (globalThis as any).__serviceDetourTrace = trace;
    const read = () => {
      if (!trace.running) return;
      const patient = scene.bridge.viewModel.patients.find((candidate: any) => candidate.instanceId === id);
      const track = scene.routeMotionTracks.get(`character:patient:${id}`);
      const container = scene.characterBitmapContainers.get(`character:patient:${id}`);
      let sample = null;
      if (track?.path?.length) {
        const startIndex = Math.max(0, Math.min(track.path.length - 1, Math.floor(track.progress)));
        const endIndex = Math.min(track.path.length - 1, startIndex + 1);
        const start = track.path[startIndex];
        const end = track.path[endIndex];
        const fraction = Math.max(0, Math.min(1, track.progress - startIndex));
        sample = { x: start.x + (end.x - start.x) * fraction, y: start.y + (end.y - start.y) * fraction };
      }
      trace.frames.push({
        now: performance.now(), facilityTick: scene.bridge.viewModel.facilityTick,
        projected: patient ? {
          location: patient.location ? { ...patient.location } : undefined,
          path: patient.path?.map((point: GridPoint) => ({ ...point })), pathIndex: patient.pathIndex,
          moving: patient.moving, supportRole: patient.supportRole,
        } : null,
        track: track ? {
          path: track.path.map((point: GridPoint) => ({ ...point })), signature: track.signature,
          progress: track.progress, targetIndex: track.targetIndex, sourceOffset: track.sourceOffset,
          lastObservedPathIndex: track.lastObservedPathIndex,
        } : null,
        sample,
        actor: container ? { x: container.x, y: container.y, visible: Boolean(container.visible) } : null,
      });
      requestAnimationFrame(read);
    };
    requestAnimationFrame(read);
  }, encounterId);
}

async function stopTrace(page: Page): Promise<TraceFrame[]> {
  return page.evaluate(() => {
    const trace = (globalThis as any).__serviceDetourTrace;
    trace.running = false;
    return trace.frames;
  });
}

function pointKey(point: GridPoint): string {
  return `${point.x},${point.y}`;
}

function edgeKey(left: GridPoint, right: GridPoint): string {
  const keys = [pointKey(left), pointKey(right)].sort();
  return `${keys[0]}|${keys[1]}`;
}

function routeEdges(path: readonly GridPoint[]): string[] {
  return path.slice(1).map((point, index) => edgeKey(path[index]!, point));
}

function sampleIsOnAuthorizedRoute(sample: GridPoint, paths: readonly GridPoint[][]): boolean {
  const tolerance = .0001;
  return paths.some((path) => path.some((start, index) => {
    const end = path[index + 1];
    if (!end) return Math.abs(sample.x - start.x) <= tolerance && Math.abs(sample.y - start.y) <= tolerance;
    if (start.x === end.x && Math.abs(sample.x - start.x) <= tolerance) {
      return sample.y >= Math.min(start.y, end.y) - tolerance && sample.y <= Math.max(start.y, end.y) + tolerance;
    }
    if (start.y === end.y && Math.abs(sample.y - start.y) <= tolerance) {
      return sample.x >= Math.min(start.x, end.x) - tolerance && sample.x <= Math.max(start.x, end.x) + tolerance;
    }
    return false;
  }));
}

async function runTransitionProof(page: Page, fixture: ServiceFixture): Promise<void> {
  const encounterId = `service-detour-${fixture}`;
  const name = `Service Detour ${fixture}`;
  await startClinic(page, "Service Detour Founder", name);
  const state = createOrderedState((await getActiveState(page)) as unknown as GameState, fixture, encounterId);
  const movement = state.encounters[encounterId]!.patientMovement!;
  const pendingRoute = getPendingPatientRoutePresentation(state, encounterId);
  const root = join(ROOT, PHASE, fixture);
  mkdirSync(root, { recursive: true });
  const timeline = traceDomainRouteTimeline(state, encounterId);
  writeFileSync(join(root, "domain-timeline.json"), JSON.stringify(timeline, null, 2));
  writeFileSync(join(root, "seed.json"), JSON.stringify({
    facilityTick: state.facilityTick, movement, pendingRoute,
    pendingTravel: state.encounters[encounterId]!.pendingResult?.patientTravel ?? null,
    serviceOperations: state.serviceOperations.filter((operation) => operation.actorId === encounterId),
  }, null, 2));
  await installFixture(page, state, name);
  await startTrace(page, encounterId);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => page.evaluate(() => {
    const frames = (globalThis as any).__serviceDetourTrace.frames as TraceFrame[];
    const signatures = frames.map((frame) => frame.projected?.path?.map((point) => `${point.x},${point.y}`).join("|")).filter(Boolean);
    return new Set(signatures).size;
  }), { timeout: 30_000 }).toBeGreaterThanOrEqual(2);
  await page.getByRole("button", { name: "Pause facility time" }).click();
  const frames = await stopTrace(page);
  writeFileSync(join(root, "trace.json"), JSON.stringify(frames, null, 2));
  await page.getByTestId("facility-canvas").screenshot({ path: join(root, "transition.png"), animations: "disabled" });
  const projectedSignatures = frames.map((frame) => frame.projected?.path?.map(pointKey).join("|")).filter((value): value is string => Boolean(value));
  expect(new Set(projectedSignatures).size).toBeGreaterThanOrEqual(2);
  expect(frames.some((frame) => (frame.projected?.pathIndex ?? 0) > 0)).toBe(true);
  expect(frames.some((frame) => frame.track !== null)).toBe(true);
  const authorizedPaths = timeline.flatMap((frame) => frame.path ? [frame.path] : []);
  const authorizedEdges = new Set(authorizedPaths.flatMap(routeEdges));
  const observedTrackEdges = new Set(frames.flatMap((frame) => frame.track ? routeEdges(frame.track.path) : []));
  expect([...observedTrackEdges].filter((edge) => !authorizedEdges.has(edge))).toEqual([]);
  expect(frames.filter((frame) => frame.sample).every((frame) => sampleIsOnAuthorizedRoute(frame.sample!, authorizedPaths))).toBe(true);
}

for (const fixture of ["ultrasound", "minor", "phlebotomy"] as const) {
  test(`actual ${fixture} completion-to-return trace exposes no renderer-only detour`, async ({ page }, testInfo) => {
    testInfo.setTimeout(90_000);
    test.skip(testInfo.project.name !== "desktop-chrome", "Desktop Phaser trace only.");
    await runTransitionProof(page, fixture);
  });
}

test("ultrasound transition remains route-valid across pause and reload", async ({ page }, testInfo) => {
  testInfo.setTimeout(90_000);
  test.skip(testInfo.project.name !== "desktop-chrome", "Desktop Phaser trace only.");
  const fixture: ServiceFixture = "ultrasound";
  const encounterId = "service-detour-ultrasound-control";
  const name = "Service Detour Ultrasound Control";
  await startClinic(page, "Service Detour Founder", name);
  const state = createOrderedState((await getActiveState(page)) as unknown as GameState, fixture, encounterId);
  const timeline = traceDomainRouteTimeline(state, encounterId);
  const authorizedPaths = timeline.flatMap((frame) => frame.path ? [frame.path] : []);
  const authorizedEdges = new Set(authorizedPaths.flatMap(routeEdges));
  const root = join(ROOT, PHASE, "ultrasound-control");
  mkdirSync(root, { recursive: true });
  await installFixture(page, { ...state, simulationSpeed: 1 }, name);
  await startTrace(page, encounterId);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => page.evaluate(() => {
    const frames = (globalThis as any).__serviceDetourTrace.frames as TraceFrame[];
    return new Set(frames.map((frame) => frame.projected?.path?.map((point) => `${point.x},${point.y}`).join("|")).filter(Boolean)).size;
  }), { timeout: 30_000 }).toBeGreaterThanOrEqual(2);
  await page.getByRole("button", { name: "Pause facility time" }).click();
  const beforeReload = await stopTrace(page);
  const pausedTick = beforeReload.at(-1)!.facilityTick;
  await expect.poll(() => getActiveState(page).then((active) => active.facilityTick)).toBe(pausedTick);
  await page.reload();
  await page.getByRole("button", { name: `Resume ${name}` }).click();
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.addStyleTag({ content: ".tutorial-overlay,.tutorial-card,.prototype-toolbar,.game-announcement,.facility-pause-indicator{display:none!important}" });
  expect(await page.evaluate(() => location.origin)).toBe("http://127.0.0.1:4197");
  await startTrace(page, encounterId);
  await page.getByRole("button", { name: "Resume facility time" }).click();
  await expect.poll(async () => page.evaluate(() => ((globalThis as any).__serviceDetourTrace.frames as TraceFrame[]).filter((frame) => frame.track).length), { timeout: 15_000 }).toBeGreaterThan(2);
  await page.getByRole("button", { name: "Pause facility time" }).click();
  const afterReload = await stopTrace(page);
  const observedEdges = new Set([...beforeReload, ...afterReload].flatMap((frame) => frame.track ? routeEdges(frame.track.path) : []));
  expect([...observedEdges].filter((edge) => !authorizedEdges.has(edge))).toEqual([]);
  expect([...beforeReload, ...afterReload].filter((frame) => frame.sample).every((frame) => sampleIsOnAuthorizedRoute(frame.sample!, authorizedPaths))).toBe(true);
  writeFileSync(join(root, "trace.json"), JSON.stringify({ beforeReload, afterReload }, null, 2));
});
