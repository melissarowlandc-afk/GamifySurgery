import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import { describe, expect, it, vi } from "vitest";
import { characterBitmapLayers } from "../art/characterBitmapArt";

vi.mock("phaser", () => ({ default: { Scene: class { constructor(_config?: unknown) {} } } }));

import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";
import { getFrontDeskV5StationaryActorDisplay } from "./frontDeskPresentation";

type Draw = { key: string; centerX: number; baseY: number; offsetIndex: number; direction: string; pose: string; rightFacing: boolean; representation?: string; visualLift: number };
const APPEARANCE: PixelAppearanceDescriptor = {
  version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: 1,
  hairShade: 2, faceStyle: "round", outfitStyle: "plain", outfitShade: 1,
  accessory: "none", headVariant: 0, bodyVariant: 0, roleStyle: "receptionist",
};
const route = (y: number, start = 1, end = 5) => [{ x: start, y }, { x: end, y }];

function bridge(): FacilitySceneBridge {
  return {
    viewModel: {
      facilityTitle: "test", facilityTick: 0, paused: false, buildMode: false, simulationSpeed: 1,
      realMillisecondsPerFacilityMinuteAt1x: 1_000, characterTravelTilesPerFacilityMinute: 2,
      gridColumns: 12, gridRows: 10, patientCounts: { waiting: 0, active: 0, actionReady: 0, resolved: 0 },
      founder: { displayName: "Founder", appearance: { ...APPEARANCE, roleStyle: "founder" }, location: { x: 1, y: 1 }, path: route(1), pathIndex: 0, moving: true, direction: "side" },
      staff: [
        { instanceId: "staff-a", displayName: "Staff A", roleDisplayName: "Staff", homeRoomInstanceId: "work", appearance: APPEARANCE, location: { x: 1, y: 2 }, path: route(2), pathIndex: 0, moving: true, direction: "side" },
        { instanceId: "staff-b", displayName: "Staff B", roleDisplayName: "Staff", homeRoomInstanceId: "work", appearance: { ...APPEARANCE, outfitShade: 2 }, location: { x: 1, y: 3 }, path: route(3), pathIndex: 0, moving: true, direction: "side" },
      ],
      patients: [
        { instanceId: "patient-a", displayName: "Patient A", status: "active", appearance: { ...APPEARANCE, roleStyle: "patient", patientIdentityId: "patient.adult.1" }, location: { x: 1, y: 4 }, path: route(4), pathIndex: 0, moving: true, direction: "side" },
        { instanceId: "patient-b", displayName: "Patient B", status: "active", appearance: { ...APPEARANCE, roleStyle: "patient", patientIdentityId: "patient.adult.2" }, location: { x: 1, y: 5 }, path: route(5), pathIndex: 0, moving: true, direction: "side" },
      ],
      ambientPedestrians: [
        { instanceId: "ambient-a", appearance: APPEARANCE, location: { x: 1, y: 10 }, path: route(10), pathIndex: 0, moving: true, direction: "side" },
        { instanceId: "ambient-b", appearance: { ...APPEARANCE, outfitShade: 3 }, location: { x: 5, y: 10 }, path: route(10, 5, 1), pathIndex: 0, moving: true, direction: "side" },
      ],
      rooms: [], placement: null,
    },
    onPlaceRoom: () => false,
  };
}

function harness(source = bridge()) {
  const scene = new FacilityScene(source) as any;
  const draws: Draw[] = [];
  scene.layout = { originX: 0, originY: 0, tileSize: 32, width: 640, height: 480, sidewalkTop: 400, sidewalkHeight: 40, setbackTop: 360 };
  scene.refreshLayout = vi.fn();
  scene.ensureCharacterStills = vi.fn();
  scene.getCharacterGraphics = vi.fn((key: string) => ({ getData: () => key, setData: vi.fn(), setDepth: vi.fn(), setVisible: vi.fn(), setPosition: vi.fn() }));
  scene.drawPixelPerson = vi.fn((graphics: { getData(): string }, centerX: number, baseY: number, offsetIndex: number, _appearance: unknown, _color: number, direction: string, pose: string, rightFacing: boolean, _scale: number, representation?: string, _frozen?: boolean, _seat?: boolean, visualLift = 0) => {
    draws.push({ key: graphics.getData(), centerX, baseY, offsetIndex, direction, pose, rightFacing, representation, visualLift });
    return { baseY, representation: representation ?? "procedural" };
  });
  scene.getFrontDeskV5ActorDisplayPosition = vi.fn(() => undefined);
  scene.drawPatientLocator = vi.fn(); scene.removeInactiveGraphics = vi.fn(); scene.removeInactiveCharacterBitmapContainers = vi.fn();
  return { scene, draws, bridge: source };
}

const latest = (draws: Draw[], key: string) => draws.filter((draw) => draw.key === key).at(-1)!;
const state = (draw: Draw) => ({ centerX: draw.centerX, baseY: draw.baseY, offsetIndex: draw.offsetIndex, direction: draw.direction, pose: draw.pose, rightFacing: draw.rightFacing });

describe("FacilityScene character pause and arrival presentation", () => {
  it("uses the semantic approved Front Desk support at the domain staff anchor", () => {
    const source = bridge();
    source.viewModel.rooms = [{
      instanceId: "room.front", definitionId: "room.front_desk", displayName: "Front Desk",
      tileX: 0, tileY: 0, width: 5, height: 4, isFounderRoom: true, orientation: 0,
    }];
    const domainStaffAnchor = { x: 1, y: 1 };
    expect(getFrontDeskV5StationaryActorDisplay(domainStaffAnchor, false, "staff", source.viewModel.rooms)).toBeUndefined();
    const { scene } = harness(source);
    scene.canRenderFrontDeskV5Architecture = vi.fn(() => false);
    const display = (FacilityScene.prototype as any).getFrontDeskV5ActorDisplayPosition.bind(scene);
    expect(display(domainStaffAnchor, false, "staff")).toMatchObject({
      supportRole: "front-desk-staff",
      supportId: "receptionist-chair:seat-1",
      pose: "seated",
      direction: "front",
    });
    expect(display(domainStaffAnchor, true, "staff")).toBeUndefined();
    expect(display({ x: 8, y: 8 }, false, "staff")).toBeUndefined();
  });

  it("keeps keyed snapshots and gait offsets through real reorder and insertion while paused", () => {
    const { scene, draws, bridge: source } = harness();
    scene.update(0, 100);
    const keys = ["character:founder", "character:staff:staff-a", "character:staff:staff-b", "character:patient:patient-a", "character:patient:patient-b", "character:ambient:ambient-a", "character:ambient:ambient-b"];
    const before = Object.fromEntries(keys.map((key) => [key, state(latest(draws, key))]));
    const offsets = Object.fromEntries(keys.map((key) => [key, scene.characterGaitOffsets.get(key)]));

    source.viewModel.paused = true;
    source.viewModel.founder.location = undefined;
    source.viewModel.staff = [source.viewModel.staff[1]!, { instanceId: "staff-c", displayName: "Staff C", roleDisplayName: "Staff", homeRoomInstanceId: null, appearance: APPEARANCE, location: { x: 7, y: 2 }, path: route(2, 7, 9), pathIndex: 0, moving: true, direction: "side" }, source.viewModel.staff[0]!];
    source.viewModel.patients = [...source.viewModel.patients!].reverse();
    source.viewModel.ambientPedestrians = [...source.viewModel.ambientPedestrians!].reverse();
    for (const actor of source.viewModel.staff.filter((actor) => actor.instanceId !== "staff-c")) actor.location = undefined;
    for (const actor of source.viewModel.patients!) actor.location = undefined;
    // Ambient locations are required by the view type; replace their live input
    // with distant values to prove the keyed frozen anchor wins.
    for (const actor of source.viewModel.ambientPedestrians!) actor.location = { x: 9, y: 10 };
    scene.drawCharacters();
    const inserted = state(latest(draws, "character:staff:staff-c"));
    const insertedOffset = scene.characterGaitOffsets.get("character:staff:staff-c");
    source.viewModel.staff.reverse(); source.viewModel.patients!.reverse(); source.viewModel.ambientPedestrians!.reverse();
    scene.drawCharacters();
    for (const key of keys) {
      expect(state(latest(draws, key))).toEqual(before[key]);
      expect(scene.characterGaitOffsets.get(key)).toBe(offsets[key]);
    }
    expect(state(latest(draws, "character:staff:staff-c"))).toEqual(inserted);
    expect(scene.characterGaitOffsets.get("character:staff:staff-c")).toBe(insertedOffset);

    for (const actor of source.viewModel.staff) {
      const y = actor.instanceId === "staff-b" ? 3 : 2; const start = actor.instanceId === "staff-c" ? 7 : 1;
      actor.location = { x: start, y }; actor.path = route(y, start, actor.instanceId === "staff-c" ? 9 : 5); actor.pathIndex = 0;
    }
    source.viewModel.patients!.forEach((actor) => { actor.location = { x: 1, y: actor.instanceId === "patient-a" ? 4 : 5 }; actor.pathIndex = 0; actor.moving = true; });
    source.viewModel.ambientPedestrians!.forEach((actor) => { actor.location = actor.path[0]!; actor.pathIndex = 0; actor.moving = true; });
    source.viewModel.founder.location = { x: 1, y: 1 };
    source.viewModel.paused = false; scene.update(0, 20_000);
    for (const key of [...keys, "character:staff:staff-c"]) expect(scene.characterGaitOffsets.get(key)).toBe(key === "character:staff:staff-c" ? insertedOffset : offsets[key]);
    for (const key of keys) expect(state(latest(draws, key))).toEqual(before[key]);
    expect(state(latest(draws, "character:staff:staff-c"))).toEqual(inserted);
  });

  it.each(["paused", "buildMode"] as const)("freezes exact motion through repeated %s cycles and resumes after discarding one stale delta", (flag) => {
    const { scene, draws, bridge: source } = harness(); scene.update(0, 100);
    const key = "character:staff:staff-a";
    for (let cycle = 0; cycle < 2; cycle += 1) {
      const before = state(latest(draws, key));
      source.viewModel[flag] = true; source.viewModel.staff[0]!.location = { x: 9, y: 7 };
      scene.update(0, 500); scene.drawCharacters();
      expect(state(latest(draws, key))).toEqual(before);
      source.viewModel[flag] = false; source.viewModel.staff[0]!.location = { x: 1, y: 2 };
      scene.update(0, 30_000); expect(state(latest(draws, key))).toEqual(before);
      scene.update(0, 100); expect(latest(draws, key).centerX).toBeGreaterThan(before.centerX);
    }
  });

  it("starts grounded, peaks at three pixels, freezes exactly, and grounds stopped or seated actors", () => {
    const { scene, draws, bridge: source } = harness();
    const key = "character:staff:staff-a";
    scene.update(0, 0);
    expect(latest(draws, key).visualLift).toBe(0);
    scene.update(250, 250);
    expect(latest(draws, key).visualLift).toBeCloseTo(3, 10);
    source.viewModel.paused = true;
    scene.update(500, 250);
    expect(latest(draws, key).visualLift).toBeCloseTo(3, 10);
    source.viewModel.paused = false;
    scene.update(10_000, 9_500);
    expect(latest(draws, key).visualLift).toBeCloseTo(3, 10);
    expect(scene.characterStepBounceLift(key, "idle", false)).toBe(0);
    expect(scene.characterStepBounceLift(key, "seated", false)).toBe(0);
    expect(scene.characterStepBounceLift(key, "exam-table", false)).toBe(0);
  });

  it("does not reuse update delta in callbacks, discards callback pause delta once, then advances the route", () => {
    const { scene, draws, bridge: source } = harness(); const key = "character:staff:staff-a";
    scene.update(0, 100); const afterUpdate = state(latest(draws, key));
    scene.drawCharacters(); expect(state(latest(draws, key))).toEqual(afterUpdate);
    source.viewModel.paused = true; scene.drawCharacters(); source.viewModel.paused = false;
    scene.update(0, 60_000); expect(state(latest(draws, key))).toEqual(afterUpdate);
    scene.update(0, 100); expect(latest(draws, key).centerX).toBeGreaterThan(afterUpdate.centerX);
    expect(scene.characterPhase).toBeGreaterThan(0.25);
  });

  it("retains real route tails before founder, chair, and exam destination poses", () => {
    const { scene, draws, bridge: source } = harness(); scene.update(0, 100);
    source.viewModel.founder = { ...source.viewModel.founder, location: { x: 5, y: 1 }, path: undefined, moving: false, seated: true, direction: "back" };
    source.viewModel.staff[0] = { ...source.viewModel.staff[0]!, location: { x: 5, y: 2 }, path: undefined, moving: false, direction: "back" };
    source.viewModel.patients![0] = { ...source.viewModel.patients![0]!, location: { x: 5, y: 4 }, path: undefined, moving: false, pose: "seated", direction: "back" };
    source.viewModel.patients![1] = { ...source.viewModel.patients![1]!, location: { x: 5, y: 5 }, path: undefined, moving: false, pose: "exam-table", direction: "back" };
    scene.update(0, 100);
    expect(latest(draws, "character:founder").pose).toMatch(/^walk/);
    expect(latest(draws, "character:staff:staff-a").pose).toMatch(/^walk/);
    expect(latest(draws, "character:patient:patient-a").pose).toMatch(/^walk/);
    expect(latest(draws, "character:patient:patient-b").pose).toMatch(/^walk/);
    scene.update(0, 2_000);
    expect(latest(draws, "character:founder")).toMatchObject({ pose: "seated", direction: "back" });
    expect(latest(draws, "character:staff:staff-a")).toMatchObject({ pose: "idle", direction: "front" });
    expect(latest(draws, "character:patient:patient-a")).toMatchObject({ pose: "seated", direction: "back" });
    expect(latest(draws, "character:patient:patient-b")).toMatchObject({ pose: "exam-table", direction: "back" });
  });

  it("faces every ordinary floor stop south despite founder activity or employee home assignment", () => {
    const { scene, draws, bridge: source } = harness();
    source.viewModel.founder = { ...source.viewModel.founder, moving: false, path: undefined, activityLabel: "Cleaning", direction: "back" };
    source.viewModel.staff = source.viewModel.staff.map((actor) => ({ ...actor, moving: false, path: undefined, direction: "back" }));
    source.viewModel.patients = source.viewModel.patients!.map((actor) => ({ ...actor, moving: false, path: undefined, direction: "back" }));
    source.viewModel.ambientPedestrians = source.viewModel.ambientPedestrians!.map((actor) => ({ ...actor, moving: false, path: [], direction: "back" }));
    scene.drawCharacters();
    for (const key of ["character:founder", "character:staff:staff-a", "character:staff:staff-b", "character:patient:patient-a", "character:patient:patient-b", "character:ambient:ambient-a", "character:ambient:ambient-b"]) expect(latest(draws, key)).toMatchObject({ direction: "front", pose: "idle" });
  });

  it("requests only the four standing cardinals for each live known identity", () => {
    const source = bridge();
    source.viewModel.founder.appearance = { ...source.viewModel.founder.appearance, stillId: "founder.01" };
    const { scene } = harness(source);
    scene.drawCharacters();
    const requested = scene.ensureCharacterStills.mock.calls[0]![0] as Array<{ id: string; relativePath?: string }>;
    const founderAssets = requested.filter((asset) => asset.relativePath?.includes("/founder.01/") === true);
    expect(founderAssets).toHaveLength(4);
    expect(new Set(founderAssets.map((asset) => asset.id)).size).toBe(4);
    expect(founderAssets.every((asset) => asset.relativePath?.includes("/stand-") === true)).toBe(true);
  });

  it("draws a first paused snapshot, removes a genuinely absent key, and never resurrects a completed off-site actor", () => {
    const source = bridge(); source.viewModel.paused = true;
    const { scene, draws } = harness(source); scene.drawCharacters();
    expect(latest(draws, "character:staff:staff-a")).toMatchObject({ centerX: 48, direction: "side" });
    source.viewModel.staff = source.viewModel.staff.filter((actor) => actor.instanceId !== "staff-a"); scene.drawCharacters();
    expect(scene.characterMotionSnapshots.has("character:staff:staff-a")).toBe(false);
    source.viewModel.staff.push({ instanceId: "staff-a", displayName: "Staff A", roleDisplayName: "Staff", homeRoomInstanceId: null, appearance: APPEARANCE, location: { x: 8, y: 2 }, path: route(2, 8, 9), pathIndex: 0, moving: true, direction: "side" });
    scene.drawCharacters(); expect(latest(draws, "character:staff:staff-a").centerX).toBe(272);
    source.viewModel.paused = false; scene.update(0, 100);
    const patient = source.viewModel.patients![0]!; patient.location = undefined; patient.path = undefined; patient.moving = false; patient.status = "off-site";
    scene.update(0, 3_000); scene.update(0, 16);
    expect(scene.characterMotionSnapshots.has("character:patient:patient-a")).toBe(false);
    const count = draws.filter((draw) => draw.key === "character:patient:patient-a").length;
    source.viewModel.paused = true; scene.drawCharacters();
    expect(draws.filter((draw) => draw.key === "character:patient:patient-a")).toHaveLength(count);
  });

  it("upgrades a paused neutral placeholder when its still loads and then freezes the selected frame", () => {
    const source = bridge(); const scene = new FacilityScene(source) as any;
    scene.layout = { originX: 0, originY: 0, tileSize: 32 };
    scene.drawPixelFrameSizedOutline = vi.fn(); scene.drawPixelFrameSized = vi.fn();
    const graphics = { getData: () => "actor", clear: vi.fn(), setPosition: vi.fn(), setVisible: vi.fn(), fillStyle: vi.fn(), fillCircle: vi.fn(), fillRoundedRect: vi.fn() };
    const candidate = { centerX: 48, baseY: 64, direction: "side", pose: "walk-a", rightFacing: true, displayScale: 1, appearance: { ...APPEARANCE, stillId: "founder.01", roleStyle: "founder" } };
    scene.textures = { exists: vi.fn(() => false) }; scene.ensureCharacterStill = vi.fn(() => false);
    scene.drawCharacterPresentation(graphics, "actor", candidate, 0);
    expect(scene.characterMotionSnapshots.get("actor").representation).toBe("neutral");

    const data = new Map<string, unknown>();
    const actor = {
      texture: { source: [{}] }, visible: true, displayWidth: 0, displayHeight: 0, originY: 0,
      setTexture: vi.fn(function (this: object, _key: string, frame: string) { data.set("texture-frame", frame); return this; }),
      setDisplaySize: vi.fn(function (this: { displayWidth: number; displayHeight: number }, width: number, height: number) { this.displayWidth = width; this.displayHeight = height; return this; }),
      setPosition: vi.fn(function (this: object) { return this; }), setOrigin: vi.fn(function (this: { originY: number }, _x: number, y: number) { this.originY = y; return this; }),
      setFlipX: vi.fn(function (this: object, value: boolean) { data.set("flip", value); return this; }),
      setData: vi.fn(function (this: object, values: Record<string, unknown>) { for (const [key, value] of Object.entries(values)) data.set(key, value); return this; }),
      getData: (key: string) => data.get(key),
    };
    const container = { visible: true, getByName: () => actor, setVisible: vi.fn(function (this: { visible: boolean }, value: boolean) { this.visible = value; return this; }), setPosition: vi.fn(function (this: object) { return this; }), setDepth: vi.fn(function (this: object) { return this; }) };
    scene.getCharacterBitmapContainer = vi.fn(() => container); scene.textures = { exists: vi.fn(() => true) };
    source.viewModel.paused = true;
    scene.drawCharacterPresentation(graphics, "actor", { ...candidate, direction: "front", pose: "idle", rightFacing: false }, 0);
    expect({ frame: data.get("gait-frame"), flip: data.get("gait-flip-x"), direction: data.get("gait-direction"), pose: data.get("gait-pose"), representation: scene.characterMotionSnapshots.get("actor").representation })
      .toMatchObject({ direction: "side", pose: "walk-a", flip: false, representation: "neutral" });
    expect(scene.getCharacterBitmapContainer).toHaveBeenCalled();
  });

  it("retains the loaded same-identity bitmap through a cold or failed turn but not an identity swap", () => {
    const scene = new FacilityScene(bridge()) as any;
    scene.layout = { originX: 0, originY: 0, tileSize: 32 };
    scene.textures = { exists: vi.fn(() => false) };
    scene.ensureCharacterStill = vi.fn(() => false);
    const actor = {
      y: 0,
      getData: (key: string) => key === "gait-still-id" ? "founder.01" : key === "gait-direction" ? "front" : undefined,
      setDisplaySize: vi.fn(function (this: object) { return this; }),
    };
    const container = {
      visible: true,
      getByName: () => actor,
      setVisible: vi.fn(function (this: object) { return this; }),
      setPosition: vi.fn(function (this: object) { return this; }),
      setDepth: vi.fn(function (this: object) { return this; }),
    };
    scene.characterBitmapContainers.set("actor", container);
    const graphics = {
      getData: () => "actor", clear: vi.fn(), setVisible: vi.fn(), setPosition: vi.fn(),
      fillStyle: vi.fn(), fillCircle: vi.fn(), fillRoundedRect: vi.fn(),
    };
    const founder01: PixelAppearanceDescriptor = { ...APPEARANCE, stillId: "founder.01", roleStyle: "founder" };
    const retained = scene.drawPixelPerson(graphics, 96, 128, 0, founder01, 0, "side", "walk-neutral", true, 1, undefined, false, false, 2.5);
    expect(retained.representation).toBe("bitmap");
    expect(container.setPosition).toHaveBeenCalledWith(96, 128);
    expect(scene.activeCharacterBitmapContainers.has("actor")).toBe(true);
    expect(actor.getData("gait-direction")).toBe("front");
    expect(actor.y).toBe(-2.5);
    expect(graphics.fillCircle).not.toHaveBeenCalled();

    scene.failedCharacterStills.add(
      characterBitmapLayers(founder01, "back", "walk-neutral", false)!.actor.atlas.id,
    );
    const stillRetained = scene.drawPixelPerson(graphics, 100, 132, 0, founder01, 0, "back", "walk-neutral", false, 1);
    expect(stillRetained.representation).toBe("bitmap");

    const swapped = scene.drawPixelPerson(
      graphics, 100, 132, 0,
      { ...founder01, stillId: "founder.02" }, 0, "side", "walk-neutral", false, 1,
    );
    expect(swapped.representation).toBe("neutral");
    expect(graphics.fillCircle).toHaveBeenCalled();
  });

  it("puts the bordered founder activity box above the actual visible bitmap bounds and hides it at idle", () => {
    const scene = new FacilityScene(bridge()) as any;
    const text = {
      setText: vi.fn(function (this: object) { return this; }),
      setPosition: vi.fn(function (this: object) { return this; }),
      setVisible: vi.fn(function (this: object) { return this; }),
      getBounds: vi.fn(() => ({ x: 80, y: 44, width: 40, height: 12 })),
    };
    const box = {
      clear: vi.fn(function (this: object) { return this; }),
      fillStyle: vi.fn(function (this: object) { return this; }),
      fillRect: vi.fn(function (this: object) { return this; }),
      lineStyle: vi.fn(function (this: object) { return this; }),
      strokeRect: vi.fn(function (this: object) { return this; }),
      setVisible: vi.fn(function (this: object) { return this; }),
    };
    scene.founderActivityText = text;
    scene.founderActivityBox = box;
    scene.characterBitmapContainers.set("character:founder", {
      visible: true,
      getByName: () => ({ visible: true, getBounds: () => ({ centerX: 100, top: 48, width: 24, height: 40 }) }),
    });

    scene.renderFounderActivityBox("character:founder", "Performing endoscopy", 4, 400);
    expect(text.setPosition).toHaveBeenCalledWith(100, 44);
    expect(box.fillRect).toHaveBeenCalledWith(77, 42, 46, 16);
    expect(box.strokeRect).toHaveBeenCalledWith(77.5, 42.5, 45, 15);

    scene.renderFounderActivityBox("character:founder", undefined, 4, 400);
    expect(text.setVisible).toHaveBeenLastCalledWith(false);
    expect(box.setVisible).toHaveBeenLastCalledWith(false);
  });
});
