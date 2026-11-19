import {
  deserializeGameState, getPeriopNurseStandingPoints, getRoomCareAnchor, getRoomCareStations,
  getRoomCompanionSeats, getRoomDefinition, isEmployeeOperational, serializeGameState, startServiceOperation,
  type DomainContext, type GameState, type GridPoint, type RoomOrientation,
} from "@gamify-surgery/game-domain";
import { vi } from "vitest";
import { APPROVED_ROOM_NAVIGATION_CONTRACTS } from "@gamify-surgery/balance-config";
import {
  buyPediatricRoom, engCommand, engProcedureClinic, engTick, lineFor, mechanicalProcedureCase,
  openEngConsult, type ProcedureKind,
} from "../../../../packages/game-domain/tests/eng-i01-live-procedure.fixture";
import { answerConsult } from "../../../../packages/game-domain/tests/founder-consults.fixture";
import { routineOrFixture } from "../../../../packages/game-domain/tests/routine-or-demand.fixture";
import { createPrototypePlayerView } from "../session/viewModels";
import { characterBitmapLayers, characterBitmapRegistration } from "../art/characterBitmapArt";
import type { CharacterDirection, CharacterPose } from "../art/characterArt";
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";
import { MAP_CHARACTER_REFERENCE_TILE_SIZE } from "./characterPresentation";
import { SEAT_SETTLE_DURATION_MS } from "./characterSeatSettle";
import type { ApprovedRoomDrawRecord } from "./approvedRoomPresentation";

export interface ProcedureLayout {
  kind: ProcedureKind;
  definitionId: "room.ambulatory_or" | "room.endoscopy";
  orientation: RoomOrientation;
}

// OR is currently north-up only; endoscopy has both approved orientations.
// Never manufacture an unsupported OR rotation to satisfy the test matrix.
export const PROCEDURE_LAYOUTS: ProcedureLayout[] = (["operation", "endoscopy"] as const).flatMap(kind => {
  const definitionId = kind === "operation" ? "room.ambulatory_or" : "room.endoscopy";
  return APPROVED_ROOM_NAVIGATION_CONTRACTS[definitionId]!.allowedOrientations.map(orientation => ({ kind, definitionId, orientation }));
});
export const samePoint = (a: GridPoint | null | undefined, b: GridPoint | null | undefined) => Boolean(a && b && a.x === b.x && a.y === b.y);
export const operation = (state: GameState, id: string) => state.serviceOperations.find(op => op.id === id)!;
export const familyFor = (state: GameState, id: string) => Object.values(state.pediatricFamilies ?? {}).find(family => family.procedureFlow?.serviceOperationId === id);
export const hydrate = (state: GameState, context: DomainContext) => deserializeGameState(serializeGameState(state), context);

function until(state: GameState, context: DomainContext, id: string, predicate: (state: GameState) => boolean): GameState {
  const op = operation(state, id);
  const facility = context.balanceRelease.facility;
  const travel = Math.ceil(facility.gridWidth * facility.gridHeight / facility.characterTravelTilesPerTick);
  const bound = op.frozenOperationPhases!.reduce((sum, phase) => sum + phase.durationMinutes + travel, 0) +
    (op.periopNurseAttention?.tasks.reduce((sum, task) => sum + task.durationMinutes, 0) ?? 0);
  for (let minute = 0; minute < bound && !predicate(state); minute++) state = engTick(state, context);
  if (!predicate(state)) throw new Error(`Synthetic B-014 care did not reach its checkpoint: ${JSON.stringify(operation(state, id))}`);
  return state;
}

export interface ProcedureJourney {
  layout: ProcedureLayout;
  context: DomainContext;
  id: string;
  frames: Record<"arrival" | "preOp" | "transfer" | "procedure" | "procedureReload" | "chart" | "chartReload" | "postOp" | "completed", GameState>;
}

/** Existing mechanical cases contain unchanged public questions/identities.
 * Every arrival, care phase, consult binding and transfer uses real commands;
 * no patient location, phase, appearance or presentation result is staged. */
export function procedureJourney(layout: ProcedureLayout, pediatric: boolean): ProcedureJourney {
  const clinicalCase = mechanicalProcedureCase(layout.kind, pediatric);
  clinicalCase.earliestFacilityStage = 4;
  let { state, context, id } = engProcedureClinic(layout.kind, clinicalCase, true);
  if (layout.orientation !== 0) {
    // The public OR clinic retains a north-up Peri-op and the empty former
    // endoscopy plot. Build only the rotated procedure room there, before
    // accepting any visitor; do not rotate an occupied staff doorway.
    const plot = state.rooms.find(room => room.roomDefinitionId === layout.definitionId)!;
    const doorway = state.doors.find(door => door.roomId === plot.id)!;
    state = structuredClone(routineOrFixture().state);
    state.facilityLevel = 4;
    state.serviceAppointmentsEnabled = false;
    const roomId = "b014.rotated.endoscopy";
    state = engCommand(state, { type: "PLACE_ROOM", roomId, roomDefinitionId: layout.definitionId,
      x: plot.x, y: plot.y, orientation: layout.orientation }, context);
    state = engCommand(state, { type: "PLACE_DOOR", doorId: `${roomId}.door`, roomId,
      side: doorway.side, offset: doorway.offset }, context);
    for (const role of ["staff.endoscopy_nurse", "staff.endoscopist"]) {
      const employeeId = `b014.${role}`;
      state = engCommand(state, { type: "HIRE_STAFF", employeeId, staffRoleDefinitionId: role }, context);
      state.retailNextOpportunityTicks[`employee:${employeeId}`] = Number.MAX_SAFE_INTEGER;
    }
    state = buyPediatricRoom(state, context);
    const facility = context.balanceRelease.facility;
    const arrivalBound = Math.ceil(facility.gridWidth * facility.gridHeight / facility.characterTravelTilesPerTick);
    for (let i = 0; i < arrivalBound && state.employees.some(employee => !isEmployeeOperational(state, employee.id, context)); i++) state = engTick(state, context);
    if (state.employees.some(employee => !isEmployeeOperational(state, employee.id, context))) throw new Error("The rotated clinic's real hires did not arrive.");
    const scheduled = startServiceOperation(state, lineFor(layout.kind), "visitor", context);
    if (!scheduled) throw new Error("The staffed rotated clinic could not schedule the mechanical source.");
    id = scheduled;
  }
  const arrival = state;
  state = until(state, context, id, state => operation(state, id).phaseIndex === 0 && operation(state, id).status === "in_service");
  const preOp = state;
  state = hydrate(state, context); // A real pre-procedure reload precedes care.
  state = until(state, context, id, state => operation(state, id).phaseIndex === 1 && operation(state, id).status === "walking_between_phases");
  const transfer = state;
  state = until(state, context, id, state => operation(state, id).phaseIndex === 1 && operation(state, id).status === "in_service");
  const procedure = state;
  const procedureReload = engTick(hydrate(state, context), context);
  const opened = openEngConsult(state, context, id);
  state = opened.state;
  const chart = state;
  state = engTick(hydrate(state, context), context);
  const chartReload = state;
  state = answerConsult(state, opened.encounterId, context);
  state = engCommand(state, { type: "CLOSE_CHART", encounterId: opened.encounterId }, context);
  state = until(state, context, id, state => operation(state, id).phaseIndex === 2 && operation(state, id).status === "in_service");
  const postOp = state;
  state = until(state, context, id, state => operation(state, id).status === "completed");
  return { layout, context, id, frames: { arrival, preOp, transfer, procedure, procedureReload, chart, chartReload, postOp, completed: state } };
}

/** Historical checkpoint only: real codecs load it and the real parent walks
 * to the safe, visible chair. No parent position or chair support is injected. */
export function savedParentChair(journey: ProcedureJourney) {
  const { id, context } = journey;
  let state = structuredClone(journey.frames.procedure);
  const op = operation(state, id), family = familyFor(state, id)!;
  const room = state.rooms.find(room => room.id === op.periopBedReservation!.roomInstanceId)!;
  const definition = getRoomDefinition(room.roomDefinitionId, context)!;
  const working = getRoomCareStations(room, definition, state.doors, state.rooms, getRoomDefinition).flatMap(station =>
    getPeriopNurseStandingPoints(state, { ...op, periopBedReservation: { ...op.periopBedReservation!, endpoint: station.patientAnchor } }, context));
  const seat = getRoomCompanionSeats(room, definition, state.doors, state.rooms, getRoomDefinition).find(seat =>
    !working.some(point => samePoint(point, seat.anchor)) &&
    Math.max(Math.abs(seat.anchor.x - op.periopBedReservation!.endpoint.x), Math.abs(seat.anchor.y - op.periopBedReservation!.endpoint.y)) > 1);
  if (!seat) throw new Error("The public peri-op fixture needs a safe visible parent chair.");
  family.procedureFlow!.parentCheckpoint = { roomInstanceId: room.id, location: { ...seat.anchor } };
  state = hydrate(state, context);
  state = until(state, context, id, state => samePoint(state.retailExternalActors.find(actor => actor.id === family.parentActorId)!.location, seat.anchor));
  return { state, seat, roomId: room.id, parentId: family.parentActorId };
}

// Only Phaser's output devices/asset loading are substituted. The complete
// drawCharacters -> support selection -> drawCharacterPresentation ->
// drawPixelPerson path (including real native seat registration) runs intact.
class DisplayObject {
  x = 0; y = 0; depth = 0; visible = true; name = "";
  displayWidth = 0; displayHeight = 0; originX = 0; originY = 0;
  children: DisplayObject[] = [];
  data = new Map<string, unknown>();
  setData(key: string | Record<string, unknown>, value?: unknown) {
    if (typeof key === "string") this.data.set(key, value);
    else for (const [name, item] of Object.entries(key)) this.data.set(name, item);
    return this;
  }
  getData(key: string) { return this.data.get(key); }
  setPosition(x: number, y: number) { this.x = x; this.y = y; return this; }
  setDepth(depth: number) { this.depth = depth; return this; }
  setVisible(visible: boolean) { this.visible = visible; return this; }
  setDisplaySize(width: number, height: number) { this.displayWidth = width; this.displayHeight = height; return this; }
  setOrigin(x: number, y: number) { this.originX = x; this.originY = y; return this; }
  setName(name: string) { this.name = name; return this; }
  setTexture(_texture: string) { return this; }
  setFlipX(_flip: boolean) { return this; }
  setAlpha(_alpha: number) { return this; }
  add(children: DisplayObject[]) { this.children.push(...children); return this; }
  getByName(name: string) { return this.children.find(child => child.name === name); }
  clear() { return this; }
  fillStyle() { return this; }
  fillCircle() { return this; }
  fillRoundedRect() { return this; }
  destroy() { this.visible = false; }
}

export function sceneFrame(state: GameState, context: DomainContext) {
  // Pause through the reducer for a settled first-frame capture: native still
  // registration is measured without breathing/hop or wall-clock animation.
  const paused = engCommand(state, { type: "SET_PAUSED", paused: true }, context);
  const view = createPrototypePlayerView(paused, null, false, null).facility;
  const scene = new FacilityScene({ viewModel: view } as FacilitySceneBridge) as any;
  const tileSize = MAP_CHARACTER_REFERENCE_TILE_SIZE;
  scene.layout = { originX: 0, originY: 0, tileSize,
    sidewalkTop: context.balanceRelease.facility.gridHeight * tileSize, sidewalkHeight: tileSize };
  scene.frameDeltaMilliseconds = SEAT_SETTLE_DURATION_MS;
  scene.add = { graphics: () => new DisplayObject(), container: () => new DisplayObject(), image: () => new DisplayObject() };
  scene.textures = { exists: () => true };
  scene.ensureCharacterStills = () => undefined;
  scene.renderInspectBox = () => undefined;
  const calls = vi.spyOn(scene, "drawPixelPerson"); // Call through, not a replacement.
  scene.drawCharacters();
  return {
    view, scene, tileSize,
    roomDraws: (room: (typeof view.rooms)[number]) => scene.getTouchupDrawRecords(room) as readonly ApprovedRoomDrawRecord[],
    roomVariant: (room: (typeof view.rooms)[number]) => scene.getApprovedRoomVariant(room) as string | undefined,
    rendered(key: string) {
      const args = calls.mock.calls.find(args => (args[0] as DisplayObject).getData("character-key") === key);
      if (!args) return undefined;
      const graphics = args[0] as DisplayObject;
      const container = scene.characterBitmapContainers.get(key) as DisplayObject | undefined;
      const sprite = container?.getByName("actor");
      const appearance = args[4] as Parameters<typeof characterBitmapLayers>[0];
      const layers = characterBitmapLayers(appearance, args[6] as CharacterDirection, args[7] as CharacterPose, args[8] as boolean);
      const registration = characterBitmapRegistration(layers);
      const contactY = container && sprite && registration.seatContactY !== undefined
        ? container.y + sprite.y + (registration.seatContactY - sprite.originY * registration.cell.height) * sprite.displayHeight / registration.cell.height
        : undefined;
      return { graphics, container, sprite, appearance, layers, registration, contactY,
        centerX: args[1] as number, baselineY: args[2] as number, direction: args[6], pose: args[7], rightFacing: args[8],
        scale: args[9] as number, alignSeatContact: args[12] as boolean };
    },
  };
}

export function childKey(state: GameState, id: string): string {
  const op = operation(state, id);
  return op.actorKind === "encounter" ? `character:patient:${op.actorId}` : `character:service-visitor:${op.actorId}`;
}

export function procedureRoom(state: GameState, id: string) {
  const op = operation(state, id), phase = op.frozenOperationPhases![op.phaseIndex]!;
  const room = state.rooms.find(room => op.reservedRoomInstanceIds.includes(room.id) && room.roomDefinitionId === phase.roomDefinitionId)!;
  return { room, endpoint: getRoomCareAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "patient") };
}
