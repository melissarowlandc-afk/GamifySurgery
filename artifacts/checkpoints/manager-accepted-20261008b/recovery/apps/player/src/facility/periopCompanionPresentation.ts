import {
  getRoomCompanionSeats,
  getRoomDefinition,
  type CardinalDirection,
  type GridPoint,
  type PlacedRoom,
} from "@gamify-surgery/game-domain";
import {
  resolveApprovedRoomActorSupports,
  resolveApprovedRoomDrawRecords,
  type ApprovedActorSupport,
  type ApprovedRoomDrawRecord,
} from "./approvedRoomPresentation";
import { getApprovedSideChairMask, type ApprovedSideChairMaskDefinition } from "./approvedSideChairLayers";
import type { FacilityDoorView, FacilityRetailExternalActorView, FacilityRoomView } from "./types";

export interface PeriopCompanionChairPresentation {
  readonly roomInstanceId: string;
  /** Authoritative world grid endpoint; the visible cushion has a separate contact. */
  readonly anchor: GridPoint;
  readonly draw: ApprovedRoomDrawRecord;
  readonly support: ApprovedActorSupport;
  readonly mask: ApprovedSideChairMaskDefinition;
}

type ChairTemplate = Readonly<{
  draw: ApprovedRoomDrawRecord;
  support: ApprovedActorSupport;
  mask: ApprovedSideChairMaskDefinition;
}>;

const chairTemplates = new Map<CardinalDirection, ChairTemplate>();

function approvedChairTemplate(facing: CardinalDirection): ChairTemplate {
  const cached = chairTemplates.get(facing);
  if (cached) return cached;
  const orientation = facing === "east" || facing === "west" ? 0 : 270;
  const support = resolveApprovedRoomActorSupports("room.waiting", orientation)
    .find((candidate) => candidate.facing === facing && candidate.id !== "bench:seat-1" && candidate.id !== "bench:seat-2")!;
  const mask = getApprovedSideChairMask("room.waiting", orientation, support.id)!;
  const draw = resolveApprovedRoomDrawRecords("room.waiting", orientation)
    .find((candidate) => candidate.id === mask.drawId)!;
  const template = { draw, support, mask };
  chairTemplates.set(facing, template);
  return template;
}

function domainRoom(room: FacilityRoomView): PlacedRoom {
  return {
    id: room.instanceId, roomDefinitionId: room.definitionId,
    x: room.tileX, y: room.tileY, orientation: room.orientation ?? 0,
    doorSide: room.doorSide ?? null, upgradeLevel: room.upgradeLevel ?? 1,
  };
}

/** Shares the domain's exact own/neighbor door rule; no navigation state is authored here. */
export function resolvePeriopCompanionChairs(
  room: FacilityRoomView,
  doors: readonly FacilityDoorView[] = [],
  rooms: readonly FacilityRoomView[] = [room],
): readonly PeriopCompanionChairPresentation[] {
  if (room.definitionId !== "room.periop_recovery") return [];
  const definition = getRoomDefinition(room.definitionId);
  if (!definition) return [];
  return getRoomCompanionSeats(
    domainRoom(room), definition,
    doors.map((door) => ({ id: door.instanceId, roomId: door.roomInstanceId, side: door.side, offset: door.offset, exterior: door.exterior })),
    rooms.map(domainRoom), getRoomDefinition,
  ).map((seat) => {
    const template = approvedChairTemplate(seat.facing);
    const local = { x: seat.anchor.x - room.tileX, y: seat.anchor.y - room.tileY };
    const footprint = { left: local.x + .15, top: local.y + .15, width: .7, height: .7 };
    const originalFootprint = template.draw.footprint!;
    // Translate the approved floor footprint into the domain's 0.7-tile envelope.
    // Keep the bitmap size and all cushion/ground offsets unchanged.
    const dx = footprint.left + footprint.width / 2 - (originalFootprint.left + originalFootprint.width / 2);
    const dy = footprint.top + footprint.height - (originalFootprint.top + originalFootprint.height);
    const translate = (point: Readonly<GridPoint>) => ({ x: point.x + dx, y: point.y + dy });
    const mask: ApprovedSideChairMaskDefinition = {
      ...template.mask, id: `periop-${seat.id}`, roomDefinitionId: room.definitionId,
      orientation: room.orientation ?? 0, drawId: seat.id, supportIds: [seat.id],
    };
    const support: ApprovedActorSupport = {
      ...template.support, id: seat.id, role: "periop-companion-seat",
      seat: translate(template.support.seat), ground: translate(template.support.ground),
      fixtureGround: translate(template.support.fixtureGround),
      sideChairLayer: { drawId: seat.id, maskId: mask.id },
    };
    const draw: ApprovedRoomDrawRecord = {
      ...template.draw, id: seat.id,
      destinationTopLeftTiles: [template.draw.destinationTopLeftTiles[0] + dx, template.draw.destinationTopLeftTiles[1] + dy],
      worldLocalGround: template.draw.worldLocalGround
        ? [template.draw.worldLocalGround[0] + dx, template.draw.worldLocalGround[1] + dy] : undefined,
      footprint, approach: undefined, seat: [support.seat],
      // getRoomCompanionSeats already filters physical openings on both sides.
      // These floor chairs remain visible when the north wall is backed/low.
      doorOwners: [], backedOwners: [], depthKey: template.draw.depthKey + dy,
    };
    return { roomInstanceId: room.instanceId, anchor: seat.anchor, draw, support, mask };
  });
}

/** A reservation en route, standing reservation, or stale/hidden seat never supplies a seated pose. */
export function getPeriopCompanionChairForActor(
  actor: FacilityRetailExternalActorView,
  chairs: readonly PeriopCompanionChairPresentation[],
): PeriopCompanionChairPresentation | undefined {
  const flow = actor.procedureCompanion;
  const reservation = flow?.waitingReservation;
  if (actor.actorKind !== "companion" || actor.moving || !actor.location ||
    flow?.phase !== "waiting_in_periop" || reservation?.kind !== "chair" ||
    flow.periopRoomInstanceId !== reservation.roomInstanceId) return undefined;
  return chairs.find((chair) => chair.roomInstanceId === reservation.roomInstanceId &&
    chair.support.id === reservation.seatId &&
    chair.anchor.x === reservation.location.x && chair.anchor.y === reservation.location.y &&
    chair.anchor.x === actor.location!.x && chair.anchor.y === actor.location!.y);
}
