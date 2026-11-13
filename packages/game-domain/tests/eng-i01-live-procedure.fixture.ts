import { ANSWER_CHOICE_TIMING_REGISTRY, PEDIATRIC_CLINIC_CASES, PEDIATRIC_CLINIC_FAMILY_CONTEXTS, type SyntheticClinicalCase } from "@gamify-surgery/clinical-content";
import { gameReducer, getDoorCells, getRoomDefinition, getRotatedFootprint, PROTOTYPE_DOMAIN_CONTEXT,
  startServiceOperation, type DomainContext, type GameCommand, type GameState } from "../src";
import { endoscopyReadyClinic } from "./routine-endoscopy-ready.fixture";
import { routineOrFixture } from "./routine-or-demand.fixture";

export type ProcedureKind = "operation" | "endoscopy";
const familyFor = (kind: ProcedureKind) => kind === "operation" ? "procedure.groin_hernia_repair" : "procedure.egd";
export const lineFor = (kind: ProcedureKind) => kind === "operation" ? "income.ambulatory_operation" : "income.endoscopy";

/** Mechanical-only fixtures reuse existing questions without authoring clinical
 * facts or changing the shipped release. Metadata exercises the source engine. */
export function mechanicalProcedureCase(kind: ProcedureKind, pediatric = false, twoNodes = false): SyntheticClinicalCase {
  const family = PEDIATRIC_CLINIC_FAMILY_CONTEXTS[0]!;
  const original = (pediatric ? PEDIATRIC_CLINIC_CASES : PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases)
    .find(c => c.id === (pediatric ? family.caseId : "case.n4.cholecystectomy-neck-plane-bailout.v1"))!;
  const c = structuredClone(original);
  if (!pediatric) c.id = `case.mechanical.eng-i01.${kind}`;
  c.earliestFacilityStage = pediatric ? 4 : kind === "operation" ? 3 : 2;
  c.requiredClinicalSetting = kind === "operation" ? "ambulatory_surgery" : "endoscopy";
  c.requiredCapabilityIds = [];
  c.routineEligible = true;
  c.procedureContext = {version: "procedure-context.v1", mode: "live", familyId: familyFor(kind), kind,
    phase: "procedure", allowedIncomeLineIds: [lineFor(kind)], requiredCapabilityIds: [],
    ...(pediatric ? {pediatricFamilyContext: {profileId: family.profileId, childName: family.childName,
      childStillId: family.childStillId, parentName: family.parentName, parentRelationship: family.parentRelationship}} : {})};
  if (twoNodes) {
    const other = (pediatric ? PEDIATRIC_CLINIC_CASES : PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases)
      .flatMap(row => row.decisionNodes.map(node => ({caseId: row.id, node})))
      .find(({caseId, node}) => node.primaryConceptId !== c.decisionNodes[0]!.primaryConceptId && !node.resultGateAfter &&
        !node.answerChoices.some(choice => choice.serviceRequest) &&
        ANSWER_CHOICE_TIMING_REGISTRY.some(row => row.caseId === caseId && row.nodeId === node.id &&
          row.questionVariantId === node.questionVariantId && row.classification.kind === "no_test"))!;
    const next = structuredClone(other.node);
    next.id += ".mechanical-second"; next.questionVariantId += ".mechanical-second";
    next.currentUpdate = "Mechanical second observation checkpoint.";
    c.decisionNodes[0]!.terminalDispositions = [];
    c.decisionNodes.push(next);
  }
  return c;
}

/** Only a second synthetic pediatric node needs an additional exact metadata
 * row. Existing child rows remain unchanged and cleanup removes only our row. */
export function registerMechanicalTiming(c: SyntheticClinicalCase): () => void {
  const rows = ANSWER_CHOICE_TIMING_REGISTRY as unknown as Array<(typeof ANSWER_CHOICE_TIMING_REGISTRY)[number]>;
  if (c.decisionNodes.length < 2) return () => {};
  const node = c.decisionNodes[1]!;
  const source = rows.find(row => row.nodeId === node.id.replace(/\.mechanical-second$/, "") &&
    row.questionVariantId === node.questionVariantId.replace(/\.mechanical-second$/, ""));
  if (!source) throw new Error("The synthetic second node needs its original exact timing metadata");
  const added = {...structuredClone(source), caseId: c.id, nodeId: node.id, questionVariantId: node.questionVariantId};
  rows.push(added);
  return () => {const index = rows.indexOf(added); if (index >= 0) rows.splice(index, 1);};
}

let sequence = 0;
type Command = { [T in GameCommand["type"]]: Omit<Extract<GameCommand, {type: T}>, "operationId"> }[GameCommand["type"]];
export function engCommand(state: GameState, command: Command, context: DomainContext): GameState {
  const operationId = `eng-i01.${sequence++}`;
  const next = gameReducer(state, {...command, operationId} as GameCommand, context);
  if (next.operationReceipts[operationId]?.status !== "applied") throw new Error(`${command.type}: ${next.operationReceipts[operationId]?.message}`);
  return next;
}
export function engTick(state: GameState, context: DomainContext, count = 1): GameState {
  for (let n = 0; n < count; n++) state = engCommand(state, {type: "ADVANCE_TICK", advancedAtRealMs: state.createdAtRealMs + (state.facilityTick + 1) * 1000}, context);
  return state;
}

export function buyPediatricRoom(state: GameState, context: DomainContext): GameState {
  state = engCommand(state, {type: "PLACE_ROOM", roomId: "eng.pediatric", roomDefinitionId: "room.pediatric_examination", x: 25, y: 23}, context);
  const room = state.rooms.find(r => r.id === "eng.pediatric")!;
  const door = {id: "eng.pediatric.east", roomId: room.id, side: "east" as const, offset: 1, exterior: false};
  const target = getDoorCells(door, room, getRoomDefinition(room.roomDefinitionId, context)!)!.outside;
  const occupied = new Set(state.rooms.filter(r => r.roomDefinitionId !== "room.hallway").flatMap(r => {
    const size = getRotatedFootprint(getRoomDefinition(r.roomDefinitionId, context)!, r.orientation);
    return Array.from({length: size.height}, (_, y) => Array.from({length: size.width}, (_, x) => `${r.x + x},${r.y + y}`)).flat();
  }));
  const queue = [{x: 32, y: 22}], previous = new Map<string, {x: number; y: number} | null>([["32,22", null]]);
  for (let i = 0; i < queue.length; i++) {
    const at = queue[i]!;
    if (at.x === target.x && at.y === target.y) break;
    for (const d of [{x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}, {x: 0, y: -1}]) {
      const next = {x: at.x + d.x, y: at.y + d.y}, key = `${next.x},${next.y}`;
      if (next.x < 0 || next.x >= 72 || next.y < 0 || next.y > 30 || occupied.has(key) || previous.has(key)) continue;
      previous.set(key, at); queue.push(next);
    }
  }
  if (!previous.has(`${target.x},${target.y}`)) throw new Error("No public pediatric connection in synthetic clinic");
  let at: {x: number; y: number} | null = target;
  while (at) {
    if (!state.rooms.some(r => r.roomDefinitionId === "room.hallway" && r.x === at!.x && r.y === at!.y)) {
      state = engCommand(state, {type: "PLACE_ROOM", roomId: `eng.hall.${at.x}.${at.y}`, roomDefinitionId: "room.hallway", x: at.x, y: at.y}, context);
    }
    at = previous.get(`${at.x},${at.y}`) ?? null;
  }
  return engCommand(state, {type: "PLACE_DOOR", doorId: door.id, roomId: door.roomId, side: door.side, offset: door.offset}, context);
}

export function engProcedureClinic(kind: ProcedureKind, c: SyntheticClinicalCase, pediatricRoom = Boolean(c.pediatricProfile)) {
  const tutorials = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.filter(row => row.tutorialEligible && row.id !== c.id)
    .map(row => ({...row, routineEligible: false}));
  const context: DomainContext = {...PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: {...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease, cases: [...tutorials, c]}};
  let state = kind === "operation" ? routineOrFixture().state : endoscopyReadyClinic({appointments: false}).state;
  state = structuredClone(state);
  if (kind === "endoscopy") state = engTick(state, PROTOTYPE_DOMAIN_CONTEXT, 40); // Complete the ordinary post-hire walk.
  state.facilityLevel = Math.max(state.facilityLevel, c.earliestFacilityStage) as GameState["facilityLevel"];
  if (c.pediatricProfile) state.facilityLevel = 4;
  state.serviceAppointmentsEnabled = false;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  if (pediatricRoom) state = buyPediatricRoom(state, context);
  const id = startServiceOperation(state, lineFor(kind), "visitor", context);
  if (!id) throw new Error("The installed synthetic procedure could not be scheduled");
  return {state, context, id};
}

export function advanceEngProcedure(state: GameState, context: DomainContext, id: string, maximum = 700): GameState {
  for (let n = 0; n < maximum; n++) {
    const op = state.serviceOperations.find(op => op.id === id)!;
    const phase = op.frozenOperationPhases?.[op.phaseIndex];
    if (op.status === "in_service" && ["room.endoscopy", "room.ambulatory_or"].includes(phase?.roomDefinitionId ?? "") &&
        state.facilityTick - op.phaseStartedAtFacilityTick! >= 3) return state;
    state = engTick(state, context);
  }
  throw new Error(`The synthetic live procedure did not begin: ${JSON.stringify(state.serviceOperations.find(op => op.id === id))}`);
}

export function openEngConsult(state: GameState, context: DomainContext, id: string) {
  state.nextRoutineArrivalTick = state.facilityTick;
  for (let n = 0; n < 8 && !state.serviceOperations.find(op => op.id === id)?.consultEncounterId; n++) state = engTick(state, context);
  const encounterId = state.serviceOperations.find(op => op.id === id)?.consultEncounterId;
  if (!encounterId) throw new Error("The declared consult did not bind to its source");
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return {state: engCommand(state, {type: "OPEN_CHART", encounterId}, context), encounterId};
}
