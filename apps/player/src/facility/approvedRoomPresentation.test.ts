import { describe, expect, it } from "vitest";

import {
  APPROVED_ROOM_PRESENTATIONS,
  getApprovedRoomProofCapture,
  getApprovedRoomOrientation,
  getApprovedRoomPresentation,
  isApprovedFixtureVisible,
  isApprovedDrawVisible,
  isApprovedProceduralDrawVisible,
  resolveApprovedRoomDrawRecords,
  resolveApprovedRoomActorSupports,
  resolveApprovedRoomProceduralDrawRecords,
} from "./approvedRoomPresentation";
import { APPROVED_GS015_ROOM_ATLASES } from "../art/bitmapAssetManifest";

describe("approved GS-015 room presentation contract", () => {
  it("covers each of the sixteen approved proofs exactly once", () => {
    expect(APPROVED_ROOM_PRESENTATIONS).toHaveLength(16);
    expect(new Set(APPROVED_ROOM_PRESENTATIONS.map((room) => room.proofId)).size).toBe(16);
    expect(new Set(APPROVED_ROOM_PRESENTATIONS.map((room) => room.roomDefinitionId)).size).toBe(16);
    expect(getApprovedRoomPresentation("room.imaging_control")).toBeUndefined();
  });

  it("maps every approved rectangular second view to runtime 270 without changing global rotation semantics", () => {
    for (const id of ["room.examination", "room.waiting", "room.phlebotomy", "room.endoscopy", "room.glp1_telehealth_suite"]) {
      expect(getApprovedRoomOrientation(id, 270)?.proofTransform).toBe("(x,y)->(y,W-x)");
      expect(getApprovedRoomOrientation(id, 90)).toBeUndefined();
      expect(getApprovedRoomPresentation(id)?.migration).toBe("legacy-90-to-270");
    }
    expect(getApprovedRoomPresentation("room.periop_recovery")?.orientations).toEqual([
      { runtimeOrientation: 0, proofView: "north-up", footprint: [6, 6] },
    ]);
  });

  it("gives every image-backed fixture a declared production asset and every floor fixture a contact", () => {
    for (const room of APPROVED_ROOM_PRESENTATIONS) {
      const assetIds = new Set(room.assets.map((asset) => asset.id));
      for (const fixture of room.fixtures as readonly import("./approvedRoomPresentation").ApprovedFixturePresentation[]) {
        if (fixture.assetId) expect(assetIds, `${room.proofId}:${fixture.id}`).toContain(fixture.assetId);
        if (fixture.depth !== "wall") expect(fixture.contacts.length, `${room.proofId}:${fixture.id}`).toBeGreaterThan(0);
      }
    }
  });

  it("preserves proof-authored collision categories and examination navigation inflation", () => {
    const collisions = (definitionId: string) => Object.fromEntries(
      getApprovedRoomPresentation(definitionId)!.fixtures.map((fixture) => [fixture.id, fixture.collision]),
    );
    expect(collisions("room.bathroom")).toMatchObject({ sink: "solid", toilet: "solid", mirror: "nonblocking" });
    expect(collisions("room.waiting")).toMatchObject({ bench: "solid", chairs: "solid", "magazine-table": "solid", "magazine-rack": "none", plant: "none" });
    expect(collisions("room.minor_procedure")["wall-light"]).toBe("nonblocking");
    expect(collisions("room.ultrasound")["wall-print"]).toBe("nonblocking");
    expect(collisions("room.xray").apron).toBe("nonblocking");
    expect(collisions("room.ct")["cat-scans"]).toBe("nonblocking");
    const examinationTable = getApprovedRoomPresentation("room.examination")!.fixtures.find((fixture) => fixture.id === "exam-table")!;
    expect(examinationTable.footprint).toEqual([1.3, .65, 1.55, .7]);
    expect(examinationTable.navigationFootprint).toEqual([1.09, .44, 1.97, 1.12]);
  });

  it("hides a complete owned fixture for a door or backed north segment and restores it otherwise", () => {
    const cabinet = getApprovedRoomPresentation("room.endoscopy")!.fixtures.find((fixture) => fixture.id === "prep-cabinet")!;
    expect(isApprovedFixtureVisible(cabinet, new Set(), new Set())).toBe(true);
    expect(isApprovedFixtureVisible(cabinet, new Set(["WA"]), new Set())).toBe(false);
    expect(isApprovedFixtureVisible(cabinet, new Set(), new Set(["N1"]))).toBe(false);
    expect(isApprovedFixtureVisible(cabinet, new Set(["N4"]), new Set(["N4"]))).toBe(true);
  });

  it("carries approved shell and floor inputs independently of furniture", () => {
    for (const room of APPROVED_ROOM_PRESENTATIONS) {
      expect(room.shell.tilePixels).toBe(room.proofId === "front-desk" ? 88 : 120);
      expect(room.shell.floorPattern.length).toBeGreaterThan(3);
      expect(room.shell.floorPalette.length).toBeGreaterThan(0);
      expect(room.shell.floorBase).toMatch(/^#[0-9a-f]{6}$/i);
      expect(room.shell.background).toMatch(/^#[0-9a-f]{6}$/i);
      expect(room.shell.rearWall).toMatch(/^#[0-9a-f]{6}$/i);
      expect(room.shell.doorJamb).toMatch(/^#[0-9a-f]{6}$/i);
    }
    expect(getApprovedRoomPresentation("room.front_desk")!.shell).toMatchObject({
      tilePixels: 88,
      floorPatternSizePixels: 44,
      floorAlgorithm: "front-desk-square",
      floorBase: "#ead9b5",
      rearWall: "#efe1bd",
      rearWallHeightPixels: 80,
      doorInsetPixels: 10,
    });
    expect(getApprovedRoomPresentation("room.evs_closet")!.shell.floorBase).toBe("#85877a");
    expect(getApprovedRoomPresentation("room.periop_recovery")!.shell.rearWall).toBe("#899b91");
  });

  it("exposes exact CT and per-bay Recovery procedural fixtures", () => {
    const ct = resolveApprovedRoomProceduralDrawRecords("room.ct", 0);
    expect(ct).toEqual([expect.objectContaining({
      id: "partition",
      rect: { left: 2.69, top: .75, width: .12, height: 2.4 },
      doorOwners: [],
      drawPhase: "after-scanner-before-console",
      depthKey: 3.15,
      style: expect.objectContaining({
        kind: "ct-observation-partition",
        windowTopFraction: .39,
        windowHeightFraction: .25,
        windowOuterHorizontalBleedPixels: 2,
      }),
    })]);
    const recovery = resolveApprovedRoomProceduralDrawRecords("room.periop_recovery", 0);
    expect(recovery).toHaveLength(4);
    expect(recovery.map((draw) => [draw.id, draw.rect, draw.doorOwners, draw.drawPhase, draw.depthKey])).toEqual([
      ["partitionN", { left: 2.95, top: 0, width: .10, height: 1.55 }, ["N3", "N4"], "before-bitmaps", 1.55],
      ["partitionS", { left: 2.95, top: 4.45, width: .10, height: 1.55 }, ["S3", "S4"], "before-bitmaps", 6],
      ["partitionW", { left: 0, top: 2.95, width: 1.55, height: .10 }, ["WC", "WD"], "depth-sorted", 3],
      ["partitionE", { left: 4.45, top: 2.95, width: 1.55, height: .10 }, ["EC", "ED"], "depth-sorted", 3],
    ]);
    expect(isApprovedProceduralDrawVisible(recovery[0]!, new Set(["N3"]), new Set())).toBe(false);
    expect(isApprovedProceduralDrawVisible(recovery[1]!, new Set(["N3"]), new Set())).toBe(true);
    expect(isApprovedProceduralDrawVisible(recovery[2]!, new Set(["WD"]), new Set())).toBe(false);
    expect(resolveApprovedRoomProceduralDrawRecords("room.periop_recovery", 270)).toEqual([]);
  });

  it("resolves exact proof captures for every authored orientation", () => {
    for (const room of APPROVED_ROOM_PRESENTATIONS) {
      for (const orientation of room.orientations) {
        const capture = getApprovedRoomProofCapture(room.roomDefinitionId, orientation.runtimeOrientation);
        expect(capture, `${room.proofId}:${orientation.runtimeOrientation}`).toBeDefined();
        expect(capture!.drawImages.every((draw) => draw.src.width > 0 && draw.src.height > 0)).toBe(true);
      }
    }
  });

  it("keeps repeated Recovery bay draws individually owned", () => {
    const draws = resolveApprovedRoomDrawRecords("room.periop_recovery", 0);
    for (const segment of ["N3", "N4", "S3", "S4", "WC", "WD", "EC", "ED"] as const) {
      const bed = draws.find((draw) => draw.id === `${segment}.bed`);
      expect(bed, segment).toBeDefined();
      expect(bed!.doorOwners).toEqual([segment]);
      expect(bed!.sourceRect[2]).toBeGreaterThan(0);
    }
    const n3Bed = draws.find((draw) => draw.id === "N3.bed")!;
    const n4Bed = draws.find((draw) => draw.id === "N4.bed")!;
    expect(isApprovedDrawVisible(n3Bed, new Set(["N3"]), new Set())).toBe(false);
    expect(isApprovedDrawVisible(n4Bed, new Set(["N3"]), new Set())).toBe(true);
  });

  it("applies door and backing ownership to one resolved instance at a time", () => {
    const evs = resolveApprovedRoomDrawRecords("room.evs_closet", 0);
    const shelf1 = evs.find((draw) => draw.id === "shelf1")!;
    const shelf2 = evs.find((draw) => draw.id === "shelf2")!;
    expect(isApprovedDrawVisible(shelf1, new Set(), new Set(["N1"]))).toBe(false);
    expect(isApprovedDrawVisible(shelf2, new Set(), new Set(["N1"]))).toBe(true);
    const front = resolveApprovedRoomDrawRecords("room.front_desk", 0);
    expect(isApprovedDrawVisible(front.find((draw) => draw.id === "gallery")!, new Set(["N2"]), new Set())).toBe(false);
    expect(isApprovedDrawVisible(front.find((draw) => draw.id === "botanical")!, new Set(["N2"]), new Set())).toBe(true);
    const apron = resolveApprovedRoomDrawRecords("room.xray", 0).find((draw) => draw.id === "apron")!;
    expect(apron.doorOwners).toEqual(["N1"]);
    expect(isApprovedDrawVisible(apron, new Set(["N1"]), new Set())).toBe(false);
    const cat1 = resolveApprovedRoomDrawRecords("room.ct", 0).find((draw) => draw.id.endsWith("cat1"))!;
    expect(cat1.doorOwners).toEqual(["N1"]);
    expect(isApprovedDrawVisible(cat1, new Set(), new Set(["N1"]))).toBe(false);
    const endoscopyCabinet = resolveApprovedRoomDrawRecords("room.endoscopy", 270).find((draw) => draw.id === "cabinet")!;
    expect(endoscopyCabinet.doorOwners).toEqual(["WD", "S1"]);
    expect(isApprovedDrawVisible(endoscopyCabinet, new Set(["WD"]), new Set())).toBe(false);
  });

  it("binds supplemental windows to their exact world wall segment in both authored views", () => {
    const cases = [
      ["room.phlebotomy", 0, [["window-1", "N2"], ["window-2", "N3"]]],
      ["room.phlebotomy", 270, [["window-1", "N1"], ["window-2", "N2"]]],
      ["room.glp1_telehealth_suite", 0, [["window-1", "N1"], ["window-2", "N2"], ["window-3", "N3"]]],
      ["room.glp1_telehealth_suite", 270, [["window-1", "N1"], ["window-2", "N2"]]],
    ] as const;

    for (const [definitionId, orientation, expected] of cases) {
      const windows = resolveApprovedRoomDrawRecords(definitionId, orientation)
        .filter((draw) => draw.id.startsWith("window-"));
      expect(windows.map((draw) => [draw.id, draw.doorOwners, draw.backedOwners]), `${definitionId}:${orientation}`).toEqual(
        expected.map(([id, owner]) => [id, [owner], [owner]]),
      );
      for (const [id, owner] of expected) {
        const ownedWindow = windows.find((draw) => draw.id === id)!;
        expect(isApprovedDrawVisible(ownedWindow, new Set([owner]), new Set())).toBe(false);
        expect(isApprovedDrawVisible(ownedWindow, new Set(), new Set([owner]))).toBe(false);
        expect(windows.filter((draw) => draw.id !== id).every((draw) =>
          isApprovedDrawVisible(draw, new Set([owner]), new Set([owner])),
        )).toBe(true);
      }
    }
  });

  it("keeps proof-local optional plant ownership and grounds in the active physical view", () => {
    const south = resolveApprovedRoomDrawRecords("room.glp1_telehealth_suite", 0)
      .filter((draw) => draw.id.startsWith("plant"));
    expect(south.map((draw) => [draw.id, draw.worldLocalGround, draw.doorOwners, draw.backedOwners])).toEqual([
      ["plant1", [.25, .33], ["N1", "WA"], ["N1"]],
      ["plant2", [2.75, .33], ["N3", "EA"], ["N3"]],
    ]);

    const west = resolveApprovedRoomDrawRecords("room.glp1_telehealth_suite", 270)
      .filter((draw) => draw.id.startsWith("plant"));
    expect(west.map((draw) => [draw.id, draw.worldLocalGround, draw.doorOwners, draw.backedOwners])).toEqual([
      ["plant1", [.33, .25], ["WA", "N1"], ["N1"]],
      ["plant2", [.33, 2.75], ["WC", "S1"], []],
    ]);
    expect(isApprovedDrawVisible(west[0]!, new Set(["WA"]), new Set())).toBe(false);
    expect(isApprovedDrawVisible(west[0]!, new Set(), new Set(["N1"]))).toBe(false);
    expect(isApprovedDrawVisible(west[1]!, new Set(["WA"]), new Set(["N1"]))).toBe(true);
  });

  it("projects every proof-authored optional fixture owner into the active physical wall frame", () => {
    const expected = [
      ["room.front_desk", 0, "gallery", ["N2", "N3"], ["N2", "N3"]],
      ["room.front_desk", 0, "botanical", ["N4"], ["N4"]],
      ["room.front_desk", 0, "ficus", ["WC"], []],
      ["room.ct", 0, "cat1", ["N1"], ["N1"]],
      ["room.ct", 0, "cat2", ["N2"], ["N2"]],
      ["room.ct", 0, "cat3", ["N3"], ["N3"]],
      ["room.ct", 0, "cat4", ["N4"], ["N4"]],
      ["room.phlebotomy", 0, "sink", ["N1", "WA"], ["N1"]],
      ["room.phlebotomy", 270, "sink", ["WC", "S1"], ["WC"]],
      ["room.evs_closet", 0, "shelf1", ["N1"], ["N1"]],
      ["room.evs_closet", 0, "shelf2", ["N2"], ["N2"]],
      ["room.evs_closet", 0, "clutter1", ["WB", "S1"], []],
      ["room.evs_closet", 0, "clutter2", ["EB", "S2"], []],
      ["room.endoscopy", 0, "cabinet", ["N1", "WA"], ["N1"]],
      ["room.endoscopy", 0, "sink", ["N4", "EA"], ["N4"]],
      ["room.endoscopy", 270, "cabinet", ["WD", "S1"], ["WD"]],
      ["room.endoscopy", 270, "sink", ["WA", "N1"], ["WA"]],
      ["room.training", 0, "cabinetAnatomy", ["N1", "WA"], ["N1"]],
      ["room.training", 0, "whiteboard", ["N2"], ["N2"]],
      ["room.training", 0, "skeleton", ["N3", "EA"], ["N3"]],
      ["room.coffee_kiosk", 0, "print1", ["N1"], ["N1"]],
      ["room.coffee_kiosk", 0, "print2", ["N2"], ["N2"]],
    ] as const;

    for (const [definitionId, orientation, idSuffix, doorOwners, backedOwners] of expected) {
      const record = resolveApprovedRoomDrawRecords(definitionId, orientation)
        .find((draw) => draw.id === idSuffix || draw.id.endsWith(`.${idSuffix}`));
      expect(record, `${definitionId}:${orientation}:${idSuffix}`).toBeDefined();
      expect(record!.doorOwners, `${definitionId}:${orientation}:${idSuffix}:doors`).toEqual(doorOwners);
      expect(record!.backedOwners, `${definitionId}:${orientation}:${idSuffix}:backing`).toEqual(backedOwners);
    }
  });

  it("uses the approved Front Desk floor-contact centers", () => {
    const draws = resolveApprovedRoomDrawRecords("room.front_desk", 0);
    expect(draws.find((draw) => draw.id === "receptionist-chair")!.worldLocalGround).toEqual([1.5, 2]);
    expect(draws.find((draw) => draw.id === "visitor-chair")!.worldLocalGround).toEqual([4.5, 4]);
    expect(draws.find((draw) => draw.id === "ficus")!.worldLocalGround).toEqual([0.4034, 3]);
  });

  it("exposes exact actor furniture supports in each authored orientation", () => {
    const waitingSouth = resolveApprovedRoomActorSupports("room.waiting", 0);
    const waitingWest = resolveApprovedRoomActorSupports("room.waiting", 270);
    expect(waitingSouth).toHaveLength(4);
    expect(waitingWest).toHaveLength(4);
    expect(waitingSouth.every((support) => Number.isFinite(support.seat.x) && Number.isFinite(support.ground.y))).toBe(true);
    expect(waitingWest.map((support) => [support.seat.x, support.seat.y])).not.toEqual(
      waitingSouth.map((support) => [support.seat.x, support.seat.y]),
    );
    for (const orientation of [0, 270] as const) {
      const examination = resolveApprovedRoomActorSupports("room.examination", orientation);
      expect(examination.length).toBeGreaterThan(0);
      expect(examination.some((support) => support.id.includes("exam"))).toBe(true);
    }
  });

  it("backs every resolved proof draw with a shipped approved atlas", () => {
    const assets = new Map(APPROVED_GS015_ROOM_ATLASES.map((asset) => [asset.id, asset]));
    for (const room of APPROVED_ROOM_PRESENTATIONS) {
      for (const orientation of room.orientations) {
        const capture = getApprovedRoomProofCapture(room.roomDefinitionId, orientation.runtimeOrientation)!;
        const draws = resolveApprovedRoomDrawRecords(room.roomDefinitionId, orientation.runtimeOrientation);
        expect(draws, `${room.proofId}:${orientation.runtimeOrientation}`).toHaveLength(capture.drawImages.length);
        expect(new Set(draws.map((draw) => draw.id)).size).toBe(draws.length);
        for (const draw of draws) {
          const atlas = assets.get(draw.assetId);
          expect(atlas, `${room.proofId}:${draw.id}`).toBeDefined();
          const [sourceX, sourceY, sourceWidth, sourceHeight] = draw.sourceRect;
          expect(sourceX, `${room.proofId}:${draw.id}:crop-x`).toBeGreaterThanOrEqual(0);
          expect(sourceY, `${room.proofId}:${draw.id}:crop-y`).toBeGreaterThanOrEqual(0);
          expect(sourceX + sourceWidth, `${room.proofId}:${draw.id}:crop-width`).toBeLessThanOrEqual(atlas!.nativeWidth);
          expect(sourceY + sourceHeight, `${room.proofId}:${draw.id}:crop-height`).toBeLessThanOrEqual(atlas!.nativeHeight);
          const [originX, originY] = capture.coordinateSpace.floorOriginPixels;
          const tilePixels = capture.coordinateSpace.tilePixels;
          const destination = [
            originX + draw.destinationTopLeftTiles[0] * tilePixels,
            originY + draw.destinationTopLeftTiles[1] * tilePixels,
            draw.renderSizeTiles[0] * tilePixels,
            draw.renderSizeTiles[1] * tilePixels,
          ];
          const matchingCalls = capture.drawImages.filter((call) => call.args.slice(-4).every((value, index) =>
            Math.abs(value - destination[index]!) < .01
          ));
          expect(matchingCalls, `${room.proofId}:${draw.id}:destination`).toHaveLength(1);
          expect(draw.assetId, `${room.proofId}:${draw.id}:asset`).toBe(matchingCalls[0]!.src.assetId);
          expect(draw.destinationTopLeftTiles.every(Number.isFinite)).toBe(true);
          expect(draw.canvasTransform).toHaveLength(6);
          expect(Number.isFinite(draw.depthKey)).toBe(true);
        }
      }
    }
  });

  it("registers approved state variants as different exact proof draws", () => {
    const front = getApprovedRoomProofCapture("room.front_desk", 0)!;
    const normalCooler = front.drawImages.find((draw) => draw.src.assetId === "gs015:front-desk:upkeep")!;
    const emptyCooler = front.variants!.emptyWater!.drawImages.find((draw) => draw.src.assetId === "gs015:front-desk:upkeep")!;
    expect(emptyCooler.args.slice(0, 4)).not.toEqual(normalCooler.args.slice(0, 4));
    expect(front.variants!.visitorEdHidden!.drawImages.length).toBe(front.drawImages.length - 1);
    for (const orientation of [0, 270] as const) {
      const endoscopy = getApprovedRoomProofCapture("room.endoscopy", orientation)!;
      const emptyCrops = endoscopy.drawImages.map((draw) => draw.args.slice(0, 4));
      const occupiedCrops = endoscopy.variants!.occupiedCovered!.drawImages.map((draw) => draw.args.slice(0, 4));
      expect(occupiedCrops).not.toEqual(emptyCrops);
      expect(endoscopy.variants!.occupiedCovered!.dataset?.model).toMatchObject({ tableState: "occupiedCovered" });
    }
  });

  it("resolves approved state variants into render-ready records", () => {
    const front = resolveApprovedRoomDrawRecords("room.front_desk", 0);
    const emptyWater = resolveApprovedRoomDrawRecords("room.front_desk", 0, "emptyWater");
    const visitorHidden = resolveApprovedRoomDrawRecords("room.front_desk", 0, "visitorEdHidden");
    expect(emptyWater.map((draw) => draw.sourceRect)).not.toEqual(front.map((draw) => draw.sourceRect));
    expect(visitorHidden).toHaveLength(front.length - 1);
    expect(visitorHidden.some((draw) => draw.id === "visitor-chair")).toBe(false);
    for (const orientation of [0, 270] as const) {
      const empty = resolveApprovedRoomDrawRecords("room.endoscopy", orientation);
      const occupied = resolveApprovedRoomDrawRecords("room.endoscopy", orientation, "occupiedCovered");
      expect(occupied).toHaveLength(empty.length);
      expect(occupied.map((draw) => draw.sourceRect)).not.toEqual(empty.map((draw) => draw.sourceRect));
    }
    expect(() => resolveApprovedRoomDrawRecords("room.ct", 0, "occupiedCovered")).toThrow(/no occupiedCovered variant/);
  });
});
