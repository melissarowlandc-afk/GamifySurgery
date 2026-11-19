import { describe, expect, it, vi } from "vitest";
import { getRoomCareAnchor, getRoomDefinition, type CardinalDirection, type GameState, type GridPoint } from "@gamify-surgery/game-domain";
import { characterStillScaleForAppearance } from "../art/characterBitmapArt";
import {
  getApprovedRoomProofCapture, resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords,
  type ApprovedActorSupport, type ApprovedRoomDrawRecord,
} from "./approvedRoomPresentation";
import { getApprovedDrawPainterGround, getApprovedSupportFacing, getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import { getFacilitySceneDepth } from "./renderDepth";
import { resolvePeriopCompanionChairs } from "./periopCompanionPresentation";
import {
  childKey, familyFor, operation, PROCEDURE_LAYOUTS, procedureJourney, procedureRoom,
  savedParentChair, sceneFrame, type ProcedureJourney,
} from "./pediatricProcedureTableContact.fixture";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));

type Frame = ReturnType<typeof sceneFrame>;
type Rendered = NonNullable<ReturnType<Frame["rendered"]>>;
type Room = Frame["view"]["rooms"][number];
const isTable = (draw: ApprovedRoomDrawRecord) => /^(table|tableEmpty|tableOccupied)$/.test(draw.id);

function tableFacing(room: Room, table: ApprovedRoomDrawRecord) {
  if (room.definitionId === "room.endoscopy") {
    const proof = getApprovedRoomProofCapture(room.definitionId, room.orientation ?? 0)!;
    const data = proof.dataset as { model: { fixtures: { procedureTable: { footFacing: string } } } };
    const facing = ({ N: "north", S: "south", E: "east", W: "west" } as Record<string, CardinalDirection>)[data.model.fixtures.procedureTable.footFacing];
    expect(facing, "Use the approved table's orientation-specific foot facing").toBeDefined();
    return getApprovedSupportFacing(facing!);
  }
  // OR's approved approach is beyond the foot of its table. Derive the
  // cardinal from that geometry, independently of any new patient support.
  const footprint = table.footprint!, approach = table.approach!;
  expect(footprint).toBeDefined(); expect(approach).toBeDefined();
  const dx = approach.x - (footprint.left + footprint.width / 2);
  const dy = approach.y - (footprint.top + footprint.height / 2);
  return getApprovedSupportFacing(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "east" : "west" : dy > 0 ? "south" : "north");
}

function closePixel(actual: number, expected: number) {
  // The real bitmap container uses Math.round: at most half a display pixel.
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(1 / 2 + Number.EPSILON * Math.abs(expected));
}

function registeredContact(frame: Frame, actor: Rendered, support: ApprovedActorSupport, room: Room) {
  const evidence = JSON.stringify({ pose: actor.pose, aligned: actor.alignSeatContact,
    input: [actor.centerX, actor.baselineY], rasterSeatY: actor.contactY,
    support: actor.graphics.getData("actor-support-id"), room: actor.graphics.getData("actor-support-room-instance-id") });
  expect(actor.alignSeatContact, `B-014: render on the furniture's patient/seat contact, not the floor. ${evidence}`).toBe(true);
  expect(actor.sprite, evidence).toBeDefined();
  expect(actor.container?.visible, evidence).toBe(true);
  expect(actor.registration.seatContactY, evidence).toBeTypeOf("number");
  const x = (room.tileX + support.seat.x) * frame.tileSize;
  const y = (room.tileY + support.seat.y) * frame.tileSize;
  closePixel(actor.centerX, x);
  closePixel(actor.baselineY, y);
  closePixel(actor.container!.x, x);
  closePixel(actor.contactY!, y); // Uses real drawPixelPerson native registration.
  expect({ direction: actor.direction, rightFacing: actor.rightFacing }).toEqual(getApprovedSupportFacing(support.facing));
  expect(actor.graphics.getData("actor-support-id")).toBe(support.id);
  expect(actor.graphics.getData("actor-support-room-instance-id")).toBe(room.instanceId);
  // Actual scene scale is identity-wide, never fitted to a room/table crop.
  expect(actor.scale).toBe(characterStillScaleForAppearance(actor.appearance));
}

function supportFor(frame: Frame, actor: Rendered, room: Room) {
  return resolveApprovedRoomActorSupports(room.definitionId, room.orientation ?? 0, room.upgradeLevel)
    .find(support => support.id === actor.graphics.getData("actor-support-id") && support.role === actor.graphics.getData("actor-support-role"));
}

function painterBand(frame: Frame, actor: Rendered, room: Room, localY: number) {
  const baseline = (room.tileY + localY) * frame.tileSize;
  expect(actor.container!.depth).toBeGreaterThanOrEqual(getFacilitySceneDepth(baseline, "character"));
  expect(actor.container!.depth).toBeLessThan(getFacilitySceneDepth(Math.round(baseline) + 1, "fixture"));
}

function parentNeverOnTable(frame: Frame, state: GameState, id: string, procedure: Room) {
  const family = familyFor(state, id)!;
  const parent = state.retailExternalActors.find(actor => actor.id === family.parentActorId)!;
  const rendered = frame.rendered(`character:retail-companion:${parent.id}`)!;
  expect(rendered, "The real parent remains a separate visible actor").toBeDefined();
  expect(parent.location).not.toEqual(operation(state, id).location);
  expect(rendered.graphics.getData("actor-support-room-instance-id")).not.toBe(procedure.instanceId);
  expect(rendered.pose).not.toBe("exam-table");
  expect(frame.view.rooms.find(room => room.definitionId === "room.periop_recovery" && parent.location &&
    parent.location.x >= room.tileX && parent.location.x < room.tileX + room.width &&
    parent.location.y >= room.tileY && parent.location.y < room.tileY + room.height)).toBeDefined();
}

function childOnTable(journey: ProcedureJourney, name: "procedure" | "procedureReload" | "chart" | "chartReload") {
  const state = journey.frames[name], op = operation(state, journey.id);
  const { room: domainRoom, endpoint } = procedureRoom(state, journey.id);
  expect(op.status).toBe("in_service");
  expect(op.phaseIndex).toBe(1);
  expect(op.location).toEqual(endpoint);
  expect(domainRoom.orientation).toBe(journey.layout.orientation);
  expect(op.pathIndex).toBe(op.path.length - 1);
  expect(op.actorKind).toBe(name.startsWith("chart") ? "encounter" : "visitor");
  if (op.actorKind === "encounter") {
    expect(state.openChartEncounterId).toBe(op.consultEncounterId);
    expect(state.encounters[op.actorId]!.patientLocation).toEqual(endpoint);
    expect(state.encounters[op.actorId]!.patientAppearance).toEqual(journey.frames.arrival.serviceOperations.find(row => row.id === journey.id)!.appearance);
  }
  const frame = sceneFrame(state, journey.context);
  const room = frame.view.rooms.find(room => room.instanceId === domainRoom.id)!;
  const table = frame.roomDraws(room).find(isTable)!;
  expect(table, "The actual scene selects the approved empty procedure table").toBeDefined();
  const expectedFacing = tableFacing(room, table);
  expect(frame.roomVariant(room)).toBeUndefined();
  expect(frame.view.endoscopyOccupancy?.roomInstanceIds).not.toContain(room.instanceId);
  parentNeverOnTable(frame, state, journey.id, room);
  const actor = frame.rendered(childKey(state, journey.id))!;
  expect(actor, "The child is individually drawn, never replaced by baked adult art").toBeDefined();
  const evidence = `B-014 ${journey.layout.kind}/${journey.layout.orientation}/${name}: rendered contact must lie on the actual table art; ${JSON.stringify({
    point: [actor.container?.x, actor.contactY], input: [actor.centerX, actor.baselineY],
    tableOrigin: table.destinationTopLeftTiles, tableSize: table.renderSizeTiles, room: [room.tileX, room.tileY],
  })}`;
  const left = (room.tileX + table.destinationTopLeftTiles[0]) * frame.tileSize;
  const top = (room.tileY + table.destinationTopLeftTiles[1]) * frame.tileSize;
  // Same half-pixel rounding envelope as the real bitmap container.
  expect(actor.registration.seatContactY, evidence).toBeTypeOf("number");
  expect(actor.container!.x, evidence).toBeGreaterThanOrEqual(left - 1 / 2);
  expect(actor.container!.x, evidence).toBeLessThanOrEqual(left + table.renderSizeTiles[0] * frame.tileSize + 1 / 2);
  expect(actor.contactY!, evidence).toBeGreaterThanOrEqual(top - 1 / 2);
  expect(actor.contactY!, evidence).toBeLessThanOrEqual(top + table.renderSizeTiles[1] * frame.tileSize + 1 / 2);
  // A support flag or pose alone cannot satisfy the physical checks above.
  expect(actor.alignSeatContact, `B-014 ${journey.layout.kind}/${journey.layout.orientation}/${name}: actual scene contact ${JSON.stringify({
    pose: actor.pose, input: [actor.centerX / frame.tileSize, actor.baselineY / frame.tileSize], rasterSeatY: actor.contactY,
    support: actor.graphics.getData("actor-support-id"), table: table.destinationTopLeftTiles,
  })}`).toBe(true);
  const support = supportFor(frame, actor, room);
  expect(support, "Bind the child to its actual owning table's patient support").toBeDefined();
  expect(support!.pose).not.toBe("standing");
  expect(support!.role).not.toMatch(/nurse|provider|surgeon/);
  registeredContact(frame, actor, support!, room);
  expect({ direction: actor.direction, rightFacing: actor.rightFacing }).toEqual(expectedFacing);
  expect(actor.sprite!.getData("gait-still-id")).toBe(op.appearance!.stillId);

  if (room.definitionId === "room.endoscopy") {
    const capture = getApprovedRoomProofCapture(room.definitionId, room.orientation ?? 0)!;
    const attachment = table.attachments.procedureAttach as GridPoint;
    expect(attachment, "Endoscopy has an existing proof-authored patient contact").toBeDefined();
    const [originX, originY] = capture.coordinateSpace.floorOriginPixels;
    closePixel(actor.centerX, (room.tileX + (attachment.x - originX) / capture.coordinateSpace.tilePixels) * frame.tileSize);
    closePixel(actor.baselineY, (room.tileY + (attachment.y - originY) / capture.coordinateSpace.tilePixels) * frame.tileSize);
    closePixel(actor.contactY!, (room.tileY + (attachment.y - originY) / capture.coordinateSpace.tilePixels) * frame.tileSize);
  } else {
    // The OR currently has no authored patient attachment. Do not invent one:
    // require a registered patient contact inside the actual approved table
    // bitmap, on its center line and above its floor/leg contact.
    const [left, top] = table.destinationTopLeftTiles, [width, height] = table.renderSizeTiles;
    closePixel(support!.seat.x * frame.tileSize, table.worldLocalGround![0] * frame.tileSize);
    expect(support!.seat.x).toBeGreaterThan(left);
    expect(support!.seat.x).toBeLessThan(left + width);
    expect(support!.seat.y).toBeGreaterThan(top);
    expect(support!.seat.y).toBeLessThan(Math.min(top + height, table.worldLocalGround![1]));
  }
  // Use the owning artwork's authored painter layer, not the child's raised
  // seat or former floor baseline (especially important for the OR lights).
  painterBand(frame, actor, room, getApprovedDrawPainterGround(table));
}

for (const layout of PROCEDURE_LAYOUTS) describe(`B-014 ${layout.kind} ${layout.orientation}°`, () => {
  let cachedChild: ProcedureJourney | undefined, cachedAdult: ProcedureJourney | undefined;
  const child = () => cachedChild ??= procedureJourney(layout, true);
  const adult = () => cachedAdult ??= procedureJourney(layout, false);

  for (const name of ["procedure", "procedureReload", "chart", "chartReload"] as const) {
    it(`B-014 ${name}: child contacts the real procedure table with seat registration, facing and painter depth; parent never uses it`, () => {
      childOnTable(child(), name);
    });
  }

  it("B-014 saved parent chair checkpoint renders seated on that exact chair contact", () => {
    const journey = child(), saved = savedParentChair(journey);
    const family = familyFor(saved.state, journey.id)!;
    expect(family.procedureFlow!.parentCheckpoint).toEqual({ roomInstanceId: saved.roomId, location: saved.seat.anchor });
    const parent = saved.state.retailExternalActors.find(actor => actor.id === saved.parentId)!;
    expect(parent.location).toEqual(saved.seat.anchor);
    expect(parent.pathIndex).toBe(parent.path.length - 1);
    expect(parent.procedureCompanion, "A pediatric parent must keep its own family flow").toBeUndefined();
    const frame = sceneFrame(saved.state, journey.context);
    const room = frame.view.rooms.find(room => room.instanceId === saved.roomId)!;
    const chair = resolvePeriopCompanionChairs(room, frame.view.doors, frame.view.rooms).find(chair => chair.support.id === saved.seat.id)!;
    expect(chair, "The exact saved checkpoint corresponds to a live, visible approved chair").toBeDefined();
    const actor = frame.rendered(`character:retail-companion:${saved.parentId}`)!;
    registeredContact(frame, actor, chair.support, room);
    expect(actor.pose).toBe("seated");
    painterBand(frame, actor, room, getApprovedSupportPainterGround(chair.support).y);
  });

  it("B-014 adult control preserves occupied-table artwork and suppresses the individual visitor and chart patient", () => {
    const journey = adult();
    for (const name of ["procedure", "procedureReload", "chart", "chartReload"] as const) {
      const state = journey.frames[name], op = operation(state, journey.id);
      const frame = sceneFrame(state, journey.context), { room: domainRoom } = procedureRoom(state, journey.id);
      const room = frame.view.rooms.find(room => room.instanceId === domainRoom.id)!;
      expect(frame.roomVariant(room)).toBe("occupiedCovered");
      expect(frame.view.endoscopyOccupancy!.roomInstanceIds).toContain(room.instanceId);
      expect(op.actorKind === "encounter" ? frame.view.endoscopyOccupancy!.patientInstanceIds : frame.view.endoscopyOccupancy!.serviceVisitorInstanceIds)
        .toContain(op.actorKind === "encounter" ? op.actorId : op.id);
      expect(frame.rendered(childKey(state, journey.id))).toBeUndefined();
      const actual = frame.roomDraws(room).find(isTable)!;
      const occupied = resolveApprovedRoomDrawRecords(room.definitionId, room.orientation ?? 0, "occupiedCovered").find(isTable)!;
      const empty = resolveApprovedRoomDrawRecords(room.definitionId, room.orientation ?? 0).find(isTable)!;
      // Exercise the independent geometry oracle even while child assertions
      // correctly stop at the missing table attachment on the broken base.
      expect(tableFacing(room, empty)).toBeDefined();
      expect(actual.assetId).toBe(occupied.assetId);
      expect(actual.sourceRect).toEqual(occupied.sourceRect);
      expect(actual.destinationTopLeftTiles).toEqual(occupied.destinationTopLeftTiles);
      expect(actual.renderSizeTiles).toEqual(occupied.renderSizeTiles);
      expect(actual.worldLocalGround).toEqual(occupied.worldLocalGround);
      expect(actual.depthKey).toBe(occupied.depthKey);
      expect(actual.depthPolicy).toBe(occupied.depthPolicy);
      expect([actual.assetId, actual.sourceRect]).not.toEqual([empty.assetId, empty.sourceRect]);
    }
  });

  it("B-014 peri-op control preserves the child's pre-op and post-op bed contacts and frozen identity", () => {
    const journey = child(), original = operation(journey.frames.arrival, journey.id).appearance;
    for (const name of ["preOp", "postOp"] as const) {
      const state = journey.frames[name], op = operation(state, journey.id);
      expect(op.appearance).toEqual(original);
      expect(op.location).toEqual(op.periopBedReservation!.endpoint);
      const frame = sceneFrame(state, journey.context);
      const room = frame.view.rooms.find(room => room.instanceId === op.periopBedReservation!.roomInstanceId)!;
      expect(room.definitionId).toBe("room.periop_recovery");
      const actor = frame.rendered(childKey(state, journey.id))!;
      const support = resolveApprovedRoomActorSupports(room.definitionId, room.orientation ?? 0).find(support => support.id === `periop-bed:${op.periopBedReservation!.bedId}`)!;
      registeredContact(frame, actor, support, room);
      expect(actor.pose).toBe("seated");
      painterBand(frame, actor, room, getApprovedSupportPainterGround(support).y);
    }
    const completed = operation(journey.frames.completed, journey.id);
    expect(completed.status).toBe("completed");
    expect(completed.appearance).toEqual(original);
    expect(completed.periopNurseAttention!.tasks.map(task => task.durationMinutes)).toEqual(operation(journey.frames.arrival, journey.id).periopNurseAttention!.tasks.map(task => task.durationMinutes));
    expect(completed.periopNurseAttention!.tasks.every(task => task.remainingMinutes === 0 && task.completedAtFacilityTick !== null)).toBe(true);
    expect(journey.frames.completed.serviceIncomeReceipts.filter(receipt => receipt.transactionKey.includes(journey.id))).toHaveLength(1);
  });

  it("B-014 arrival/transfer control keeps the moving child off the procedure table until it reaches its endpoint", () => {
    const journey = child();
    for (const name of ["arrival", "transfer"] as const) {
      const state = journey.frames[name], op = operation(state, journey.id);
      expect(op.pathIndex).toBeLessThan(op.path.length - 1);
      const frame = sceneFrame(state, journey.context), actor = frame.rendered(childKey(state, journey.id))!;
      expect(actor).toBeDefined();
      expect(actor.alignSeatContact).toBe(false);
      expect(actor.graphics.getData("actor-support-id")).toBeNull();
      expect(actor.pose).not.toBe("exam-table");
      const room = state.rooms.find(room => room.roomDefinitionId === layout.definitionId)!;
      expect(op.location).not.toEqual(getRoomCareAnchor(room, getRoomDefinition(room.roomDefinitionId)!, "patient"));
    }
  });
});
