import { describe, expect, it, vi } from "vitest";
import {
  APPROVED_ROOM_PRESENTATIONS,
  getApprovedRoomPresentation,
  resolveApprovedRoomActorSupports,
  resolveApprovedRoomDrawRecords,
} from "./approvedRoomPresentation";
import { getApprovedDrawPainterGround, getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import {
  getApprovedSideChairMask,
  getApprovedSideChairMaskForDraw,
  isApprovedSideChairForegroundPixel,
  partitionApprovedSideChairPixels,
} from "./approvedSideChairLayers";
import { applyRoomTouchupsToRecords } from "./roomTouchups";
import { getFacilitySceneDepth } from "./renderDepth";
import before from "./furnitureSeatLayering.before.fixture.json";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";
import type { FacilityRoomView } from "./types";

/** Records the real scene's draw-order decisions without a browser or canvas. */
class DisplayObject {
  visible = true;
  depth = 0;
  x = 0;
  y = 0;
  displayWidth = 0;
  displayHeight = 0;
  texture = "";
  frame: string | undefined;
  data = new Map<string, unknown>();
  setData(key: string, value: unknown) { this.data.set(key, value); return this; }
  getData(key: string) { return this.data.get(key); }
  setTexture(texture: string, frame?: string) { this.texture = texture; this.frame = frame; return this; }
  setOrigin(_x: number, _y: number) { return this; }
  setPosition(x: number, y: number) { this.x = x; this.y = y; return this; }
  setDisplaySize(width: number, height: number) { this.displayWidth = width; this.displayHeight = height; return this; }
  setDepth(depth: number) { this.depth = depth; return this; }
  setVisible(visible: boolean) { this.visible = visible; return this; }
  destroy() { this.visible = false; }
  getByName(_name: string) { return { visible: true }; }
}

function harness(definitionId: string, orientation: 0 | 270 = 0) {
  const footprint = getApprovedRoomPresentation(definitionId)!.orientations.find((view) => view.runtimeOrientation === orientation)!.footprint;
  const room: FacilityRoomView = {
    instanceId: "qa-room", definitionId, displayName: "QA", tileX: 0, tileY: 0,
    width: footprint[0], height: footprint[1], orientation, isFounderRoom: false,
  };
  const scene = new FacilityScene({ viewModel: { rooms: [room] } } as FacilitySceneBridge) as any;
  scene.layout = { originX: 31, originY: 83, tileSize: 64 };
  scene.add = { image: () => new DisplayObject() };
  scene.registerApprovedRoomFrame = (draw: { id: string }) => "full:" + draw.id;
  scene.ensureApprovedSideChairTextures = (mask: { id: string }) => ({ rear: mask.id + ":rear", foreground: mask.id + ":front" });
  scene.getApprovedSegmentState = () => ({ openDoorSegments: new Set(), backedNorthSegments: new Set() });
  scene.getTouchupRoomLighting = () => undefined;
  scene.drawTouchupSprite = () => undefined;
  const draw = () => scene.drawApprovedRoomFixtures(room, { x: 31, y: 83, width: footprint[0] * 64, height: footprint[1] * 64 });
  return { scene, room, draw };
}

describe("furniture seating layer audit", () => {
  it("preserves all 56 pre-change actor contacts and all 64 furniture crops/positions", () => {
    let seatCount = 0, drawCount = 0;
    for (const view of before) {
      const orientation = view.orientation as 0 | 270;
      const supports = resolveApprovedRoomActorSupports(view.room, orientation);
      const draws = resolveApprovedRoomDrawRecords(view.room, orientation);
      for (const baseline of view.seats) {
        const actual = supports.find((support) => support.id === baseline.id)!;
        expect({ id: actual.id, seat: actual.seat, ground: actual.ground }, view.room + ":" + baseline.id).toEqual(baseline);
        seatCount += 1;
      }
      for (const baseline of view.furniture) {
        const actual = draws.find((draw) => draw.id === baseline.id)!;
        expect({ id: actual.id, assetId: actual.assetId, sourceRect: actual.sourceRect,
          destinationTopLeftTiles: actual.destinationTopLeftTiles, renderSizeTiles: actual.renderSizeTiles,
        }, view.room + ":" + baseline.id).toEqual(baseline);
        drawCount += 1;
      }
    }
    expect([seatCount, drawCount]).toEqual([56, 64]);
  });

  it("covers every runtime east/west chair and bench, distinguishing armless seats", () => {
    const armless = new Set([
      "room.examination:0:stool:clinician", "room.phlebotomy:270:stool:clinician",
      "room.staff_break:0:largeWest", "room.staff_break:0:largeEast",
    ]);
    const checked: string[] = [];
    for (const room of APPROVED_ROOM_PRESENTATIONS) for (const view of room.orientations) {
      for (const support of resolveApprovedRoomActorSupports(room.roomDefinitionId, view.runtimeOrientation)) {
        if (support.pose !== "seated" || !["east", "west"].includes(support.facing) || support.role === "periop-bed-patient") continue;
        const key = room.roomDefinitionId + ":" + view.runtimeOrientation + ":" + support.id;
        if (armless.has(key)) expect(support.sideChairLayer, key).toBeUndefined();
        else expect(support.sideChairLayer, key).toBeDefined();
        checked.push(key);
      }
    }
    expect(checked).toHaveLength(13);
    expect(checked.filter((key) => armless.has(key))).toHaveLength(4);
  });

  it("keeps south-facing beds and exam tables completely below their occupants at every scale", () => {
    const furniture = [
      ["room.periop_recovery", 0, "periop-bed:N3", "N3.bed"],
      ["room.periop_recovery", 0, "periop-bed:N4", "N4.bed"],
      ["room.examination", 270, "exam-table:patient", "exam-table"],
      ["room.minor_procedure", 0, "table:patient", "table"],
      ["room.ultrasound", 0, "table:patient", "table"],
      ["room.ct", 0, "scanner:patient", "scanner"],
    ] as const;
    for (const [room, orientation, supportId, drawId] of furniture) {
      const sitter = resolveApprovedRoomActorSupports(room, orientation).find((support) => support.id === supportId)!;
      const bed = resolveApprovedRoomDrawRecords(room, orientation).find((draw) => draw.id === drawId)!;
      expect(sitter.facing).toBe("south");
      expect(getApprovedSideChairMask(room, orientation, supportId)).toBeUndefined();
      expect(getApprovedSideChairMaskForDraw(room, orientation, bed)).toBeUndefined();
      for (const tilePixels of [32, 64, 97]) for (const originY of [0, 83, 205]) {
        const bedDepth = getFacilitySceneDepth(originY + getApprovedDrawPainterGround(bed) * tilePixels, "fixture", 63);
        const actorDepth = getFacilitySceneDepth(originY + getApprovedSupportPainterGround(sitter).y * tilePixels, "character", 0);
        expect(actorDepth, room + ":" + supportId).toBeGreaterThan(bedDepth);
      }
    }
  });

  it("shows the south-bed leg-band regression before/after at the same source pixel", () => {
    const oldBand = [[0, 480], [253, 480], [253, 599], [0, 599]] as const;
    expect(before.find((view) => view.room === "room.periop_recovery")!.priorMaskBindings)
      .toContainEqual({ supportId: "periop-bed:N3", maskId: "recovery-bed-N3" });
    const bed = resolveApprovedRoomDrawRecords("room.periop_recovery", 0).find((draw) => draw.id === "N3.bed")!;
    expect(isApprovedSideChairForegroundPixel(120.5, 510.5, oldBand)).toBe(true); // Before: bed overwrites legs.
    expect(getApprovedSideChairMaskForDraw("room.periop_recovery", 0, bed)).toBeUndefined(); // After: all actor pixels win.
  });

  it("puts the entire south-facing recliner below the sitter, including its existing front sprite", () => {
    const records = resolveApprovedRoomDrawRecords("room.staff_break", 0);
    const sitter = resolveApprovedRoomActorSupports("room.staff_break", 0).find((support) => support.id === "massage")!;
    const previousFront = records.find((draw) => draw.id === "massageFront")!;
    const updated = applyRoomTouchupsToRecords("room.staff_break", 0, 4, records);
    const actorDepth = getFacilitySceneDepth(getApprovedSupportPainterGround(sitter).y * 64, "character");
    expect(getFacilitySceneDepth(getApprovedDrawPainterGround(previousFront) * 64, "fixture")).toBeGreaterThan(actorDepth);
    for (const draw of updated.filter((draw) => ["massageChair", "massageFront"].includes(draw.id))) {
      expect(getFacilitySceneDepth(getApprovedDrawPainterGround(draw) * 64, "fixture", 63)).toBeLessThan(actorDepth);
    }
  });

  it("retains covered Endoscopy/OR patients as the approved table variant rather than a second sitter", () => {
    for (const room of ["room.endoscopy", "room.ambulatory_or"]) {
      expect(getApprovedRoomPresentation(room)?.variantPolicy?.hideIndividualPatient).toBe(true);
      for (const view of getApprovedRoomPresentation(room)!.orientations) {
        expect(resolveApprovedRoomActorSupports(room, view.runtimeOrientation).every((support) => support.pose === "standing")).toBe(true);
      }
    }
  });

  it("shows a previously unsplit side chair's arm/posts over the body while the seat stays behind", () => {
    const mask = getApprovedSideChairMask("room.reading", 0, "northeast")!;
    expect(before.find((view) => view.room === "room.reading")!.priorMaskBindings).toEqual([]);
    const width = mask.sourceRect[2], height = mask.sourceRect[3];
    const original = new Uint8ClampedArray(width * height * 4);
    for (let index = 0; index < original.length; index += 4) original.set([20, 40, 60, 173], index);
    const rear = new Uint8ClampedArray(original), front = new Uint8ClampedArray(original);
    partitionApprovedSideChairPixels(rear, front, width, height, mask.southArmPolygon, mask.additionalForegroundPolygons);
    // A single chair bitmap below an opaque actor leaves actor colour at all three sample points.
    const previousPixel = (_x: number, _y: number) => "actor";
    const updatedPixel = (x: number, y: number) => front[(y * width + x) * 4 + 3] ? "chair" : "actor";
    expect([[150, 125], [118, 210], [180, 185]].map(([x, y]) => previousPixel(x!, y!))).toEqual(["actor", "actor", "actor"]);
    expect([[150, 125], [118, 210], [180, 185]].map(([x, y]) => updatedPixel(x!, y!))).toEqual(["chair", "chair", "actor"]);
    let alteredPixels = 0;
    for (let index = 0; index < original.length; index += 4) {
      if (rear[index + 3]! + front[index + 3]! !== original[index + 3]) alteredPixels += 1;
      for (let channel = 0; channel < 3; channel += 1) {
        if (rear[index + channel] !== original[index + channel] || front[index + channel] !== original[index + channel]) alteredPixels += 1;
      }
    }
    expect(alteredPixels).toBe(0);
  });

  it("reconciles bitmap/fallback bench occupants, restores empty furniture and isolates room ownership", () => {
    const { scene, draw } = harness("room.waiting", 270);
    expect(draw()).toBe(true);
    const bench = [...scene.approvedSideChairRuntimes.values()].find((runtime: any) => runtime.drawId === "draws.bench") as any;
    const bitmap = new DisplayObject().setDepth(123_200), fallback = new DisplayObject().setDepth(123_400);
    bitmap.setData("actor-support-room-instance-id", "qa-room").setData("actor-support-id", "bench:seat-2");
    fallback.setData("actor-support-room-instance-id", "qa-room").setData("actor-support-id", "bench:seat-1");
    scene.characterBitmapContainers.set("bitmap", bitmap);
    scene.characterGraphics.set("fallback", fallback);
    scene.reconcileApprovedSideChairLayers();
    expect(bench.baseImage.texture).toBe("waiting-west-bench-east:rear");
    expect(bench.foregroundImage.depth).toBe(123_400.5);
    expect(bench.foregroundImage.visible).toBe(true);
    expect([bench.foregroundImage.x, bench.foregroundImage.y, bench.foregroundImage.displayWidth, bench.foregroundImage.displayHeight])
      .toEqual([bench.baseImage.x, bench.baseImage.y, bench.baseImage.displayWidth, bench.baseImage.displayHeight]);
    fallback.setData("actor-support-room-instance-id", "other-room");
    scene.setCharacterSupportPresentation("bitmap", new DisplayObject(), undefined, 0); // A walker loses its furniture binding.
    scene.reconcileApprovedSideChairLayers();
    expect(bench.foregroundImage.visible).toBe(false);
    expect(bench.baseImage.frame).toBe("full:draws.bench");
    expect(bench.baseImage.depth).toBe(bench.fixtureDepth);
  });

  it("carries furniture ownership through an idle staff seat's renamed support ID", () => {
    const { scene, draw } = harness("room.surgeon_office");
    draw();
    const display = scene.getApprovedActorSupportDisplayPosition({ x: 1, y: 0 }, false, "staff-idle", "surgeon-office:desk");
    expect(display.supportId).toBe("surgeon-office:desk");
    expect(display.sideChairLayer.maskId).toBe("surgeon-office-south");
    const staff = new DisplayObject();
    scene.characterGraphics.set("staff", staff);
    scene.setCharacterSupportPresentation("staff", staff, display, 3);
    scene.reconcileApprovedSideChairLayers();
    expect(scene.debugApprovedSideChairLayerSnapshot()).toMatchObject([
      { drawId: "surgeonChair", foregroundVisible: true, foregroundDepth: staff.depth + .5 },
    ]);
  });

  it("binds Front Desk arm/back layers to its room and retains the public chair's north-facing art", () => {
    const { scene, draw } = harness("room.front_desk");
    draw();
    for (const anchor of ["staff", "public"] as const) {
      const display = scene.getFrontDeskV5ActorDisplayPosition({ x: 1, y: 1 }, false, anchor);
      expect(display.supportRoomInstanceId).toBe("qa-room");
      expect(display.sideChairLayer).toBeDefined();
      if (anchor === "public") expect(display.direction).toBe("back");
      const actor = new DisplayObject();
      scene.characterGraphics.set(anchor, actor);
      scene.setCharacterSupportPresentation(anchor, actor, display, 0);
    }
    scene.reconcileApprovedSideChairLayers();
    expect(scene.debugApprovedSideChairLayerSnapshot().every((runtime: { foregroundVisible: boolean }) => runtime.foregroundVisible)).toBe(true);
  });
});
