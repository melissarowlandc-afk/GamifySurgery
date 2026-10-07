// Claude diagnostic harness pieces (2026-10-07). Not a game test.
import {
  createInitialGameState,
  deserializeGameState,
  serializeGameState,
  gameReducer,
  getCurrentQuestion,
  type GameState,
  type GridPoint,
} from "../../packages/game-domain/src";
import { createPrototypePlayerView } from "../../apps/player/src/session/viewModels";

export const REAL_MS = 10_000;

export type Input = { location?: GridPoint; path?: GridPoint[]; pathIndex?: number; moving?: boolean; label: string };

export function levelOneClinic(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.claude.jumps", campaignSeed: "claude-jumps", createdAtRealMs: 0 });
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.rooms.push({ id: "room.j.exam", roomDefinitionId: "room.examination", x: 34, y: 26, orientation: 0, doorSide: "south", upgradeLevel: 1, cleanliness: 100 });
  state.doors.push({ id: "door.j.exam", roomId: "room.j.exam", side: "south", offset: 1, exterior: false });
  state.nextRoutineArrivalTick = 1;
  return state;
}

/** Mirrors tests/e2e/helpers.ts installLevelTwoVisualState, but keeps arrivals on. */
export function levelTwoClinic(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.claude.jumps2", campaignSeed: "claude-jumps-2", createdAtRealMs: 0 }) as GameState & Record<string, unknown>;
  const makeRoom = (id: string, roomDefinitionId: string, x: number, y: number) => ({ id, roomDefinitionId, x, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 });
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
  state.cash = 12_345;
  state.cashCents = 1_234_500;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = 1;
  state.rooms = [
    makeRoom("room.instance.founder_desk", "room.front_desk", 33, 28),
    ...roomRows.map(([id, d, x, y]) => makeRoom(id, d, x, y)),
    ...Array.from({ length: 49 }, (_, i) => makeRoom(`room.l2.hall.${i}`, "room.hallway", 8 + i, 27)),
  ] as GameState["rooms"];
  state.doors = [
    { id: "door.l2.front.exterior", roomId: "room.instance.founder_desk", side: "south", offset: 1, exterior: true },
    { id: "door.l2.front.hall", roomId: "room.instance.founder_desk", side: "north", offset: 1, exterior: false },
    ...roomRows.filter(([id]) => !id.startsWith("room.l2.control")).map(([id]) => ({ id: `door.${id}.hall`, roomId: id, side: "south" as const, offset: 1, exterior: false })),
    { id: "door.l2.ultrasound.control", roomId: "room.l2.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.l2.ct.control", roomId: "room.l2.ct", side: "west", offset: 2, exterior: false },
    { id: "door.l2.xray.control", roomId: "room.l2.xray", side: "west", offset: 1, exterior: false },
  ] as GameState["doors"];
  const roleRows: Array<[string, string, string, string]> = [
    ["employee.l2.receptionist", "staff.receptionist", "Morgan Vale", "room.instance.founder_desk"],
    ["employee.l2.imaging", "staff.imaging_technician", "Avery Chen", "room.l2.control-xray"],
    ["employee.l2.periop", "staff.periop_nurse", "Riley Park", "room.l2.periop"],
    ["employee.l2.endoscopy", "staff.endoscopy_nurse", "Taylor Brooks", "room.l2.endoscopy"],
    ["employee.l2.endoscopist", "staff.endoscopist", "Casey Morgan", "room.l2.endoscopy"],
    ["employee.l2.phlebotomy", "staff.phlebotomist", "Jordan Lee", "room.l2.phlebotomy"],
    ["employee.l2.evs", "staff.evs_worker", "Avery Stone", "room.l2.evs"],
    ["employee.l2.glp", "staff.glp1_np", "Cameron Wells", "room.l2.glp"],
    ["employee.l2.medical-assistant", "staff.medical_assistant", "Quinn Rivera", "room.l2.examination"],
  ];
  state.employees = roleRows.map(([id, role, displayName, homeRoomInstanceId], index) => ({
    id, staffRoleDefinitionId: role, displayName,
    appearance: { version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: index % 4, hairShade: index % 4, faceStyle: "round", outfitStyle: "plain", outfitShade: index % 4, accessory: "badge", headVariant: index + 1, bodyVariant: index + 1, roleStyle: role.replace("staff.", "") },
    hiredAtFacilityTick: 0, salaryPerExpenseInterval: 1, morale: 90, trainingLevel: 1,
    homeRoomInstanceId, location: { x: 34 + (index % 3), y: 27 }, path: [], pathIndex: 0,
    lastMovedAtFacilityTick: 0, lastPraisedAtFacilityTick: null, nextIdleActionAtFacilityTick: 5 + index, facilityTask: null,
  })) as unknown as GameState["employees"];
  state.environment = { ...state.environment, founderLocation: { x: 34, y: 29 }, founderActivity: null };
  return deserializeGameState(serializeGameState(state));
}

/** One autoplay command, or null when the clinic only needs time. */
let lastAction = -1_000;
export const PACE = Number(process.env.JUMP_PACE ?? 0);
export function autoplayStep(state: GameState, n: number): GameState | null {
  const prefix = `j.${n}`;
  if (PACE > 0 && state.facilityTick - lastAction < PACE) return null;
  const result = autoplayStepInner(state, n, prefix);
  if (result && PACE > 0) lastAction = state.facilityTick;
  return result;
}
function autoplayStepInner(state: GameState, n: number, prefix: string): GameState | null {
  const open = state.openChartEncounterId ? state.encounters[state.openChartEncounterId] : null;
  const encounter = open ??
    Object.values(state.encounters).find((c) => c.lifecycle === "resolved_summary_available") ??
    Object.values(state.encounters).find((c) => c.lifecycle === "active_action_required" || (c.lifecycle === "waiting_unopened" && state.facilityTick - c.waiting.arrivedAtTick >= PACE * 3));
  if (!encounter) return null;
  if (encounter.lifecycle === "resolved_summary_available") {
    let next = state;
    if (!encounter.terminalFeedback?.acknowledged) next = gameReducer(next, { type: "ACKNOWLEDGE_TERMINAL_FEEDBACK", operationId: `${prefix}.t`, encounterId: encounter.id });
    return gameReducer(next, { type: "CLOSE_CHART", operationId: `${prefix}.c`, encounterId: encounter.id });
  }
  if (encounter.lifecycle === "active_pending_result" && state.openChartEncounterId === encounter.id) {
    return gameReducer(state, { type: "CLOSE_CHART", operationId: `${prefix}.pc`, encounterId: encounter.id });
  }
  const step = encounter.steps[encounter.currentNodeIndex];
  if (step?.status === "feedback_pending") {
    return gameReducer(state, { type: "ACKNOWLEDGE_DECISION_FEEDBACK", operationId: `${prefix}.f`, encounterId: encounter.id, decisionNodeId: step.decisionNodeId });
  }
  const question = getCurrentQuestion(state, encounter.id);
  if (question) {
    const choice = question.node.answerChoices.find((c) => c.isCorrect === (n % 3 !== 0))!;
    return gameReducer(state, { type: "SUBMIT_ANSWER", operationId: `${prefix}.a`, encounterId: encounter.id, decisionNodeId: question.node.id, answerChoiceId: choice.id, reviewedAtMs: REAL_MS });
  }
  if (state.openChartEncounterId !== encounter.id && (encounter.lifecycle === "active_action_required" || encounter.lifecycle === "waiting_unopened")) {
    const next = gameReducer(state, { type: "OPEN_CHART", operationId: `${prefix}.o`, encounterId: encounter.id });
    return next.operationReceipts[`${prefix}.o`]?.status === "applied" ? next : null;
  }
  return null;
}

export function actorInputs(state: GameState): Map<string, Input> {
  const view = createPrototypePlayerView(state, null, false, null).facility;
  const out = new Map<string, Input>();
  out.set("character:founder", { ...view.founder, label: "founder" });
  view.staff.forEach((a) => out.set(`character:staff:${a.instanceId}`, { ...a, label: `staff` }));
  view.ambientPedestrians?.forEach((a) => out.set(`character:ambient:${a.instanceId}`, { ...a, label: "ambient" }));
  view.patients?.forEach((a) => {
    if (view.endoscopyOccupancy?.patientInstanceIds.includes(a.instanceId)) return;
    out.set(`character:patient:${a.instanceId}`, { ...a, label: `patient` });
  });
  view.serviceVisitors?.forEach((a) => out.set(`character:service-visitor:${a.actorId}`, { ...a, label: "service-visitor" }));
  view.retailExternalActors?.forEach((a) => out.set(`character:retail-${a.actorKind}:${a.instanceId}`, { ...a, label: `retail-${a.actorKind}` }));
  return out;
}

/** Short description of the domain record behind a render key. */
export function domainNote(state: GameState, key: string): string {
  const id = key.split(":").slice(2).join(":");
  if (key.startsWith("character:patient:")) {
    const e = state.encounters[id];
    const retail = state.retailOperations.find((o) => o.actorKind === "encounter" && o.actorId === id && !["completed", "abandoned", "cancelled"].includes(o.status));
    const svc = state.serviceOperations.find((o) => o.actorKind === "encounter" && o.actorId === id && o.status !== "completed" && o.status !== "cancelled");
    return `life=${e?.lifecycle} mv=${e?.patientMovement?.kind ?? "-"} loc=${JSON.stringify(e?.patientLocation)} retail=${retail?.status ?? "-"} svc=${svc ? `${svc.status}@${JSON.stringify(svc.location)}` : "-"}`;
  }
  if (key.startsWith("character:staff:")) {
    const emp = state.employees.find((x) => x.id === id);
    return `task=${emp?.facilityTask?.kind ?? "-"} loc=${JSON.stringify(emp?.location)}`;
  }
  if (key.startsWith("character:service-visitor:")) {
    const op = state.serviceOperations.find((o) => o.actorId === id);
    return `svc=${op?.status} loc=${JSON.stringify(op?.location)}`;
  }
  if (key === "character:founder") return `act=${state.environment.founderActivity?.kind ?? "-"} loc=${JSON.stringify(state.environment.founderLocation)}`;
  return "";
}

export const fmt = (p?: GridPoint) => (p ? `${Math.round(p.x * 10) / 10},${Math.round(p.y * 10) / 10}` : "-");
export const pathNote = (i?: Input) => (i ? `loc=${fmt(i.location)} path=${i.path?.length ?? 0}@${i.pathIndex ?? "-"} [${fmt(i.path?.[0])}→${fmt(i.path?.at(-1))}] mv=${i.moving ? 1 : 0}` : "absent");

/** Valid layout from packages/game-domain/tests/retail-operations.test.ts, with arrivals and walk-ins on. */
export function retailClinic(): GameState {
  const state = createInitialGameState(undefined, { campaignId: "campaign.claude.retail", campaignSeed: "retail-operations", createdAtRealMs: 0 });
  state.facilityLevel = 2;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = 1;
  state.nextExternalRetailOpportunityTick = 20;
  state.rooms.push(
    { id: "room.retail.ultrasound", roomDefinitionId: "room.ultrasound", x: 33, y: 23, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    { id: "room.retail.coffee", roomDefinitionId: "room.coffee_kiosk", x: 30, y: 27, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 },
    ...([24, 25, 26, 27, 28] as const).map((y) => ({ id: `room.retail.hall.${y}`, roomDefinitionId: "room.hallway", x: 32, y, orientation: 0 as const, doorSide: null, upgradeLevel: 1 as const, cleanliness: 100 })),
  );
  state.doors.push(
    { id: "door.retail.ultrasound.south", roomId: "room.retail.ultrasound", side: "south", offset: 2, exterior: false },
    { id: "door.retail.ultrasound", roomId: "room.retail.ultrasound", side: "west", offset: 1, exterior: false },
    { id: "door.retail.coffee", roomId: "room.retail.coffee", side: "east", offset: 1, exterior: false },
    { id: "door.retail.front", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
  );
  return state;
}
