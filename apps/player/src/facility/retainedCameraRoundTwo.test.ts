import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { afterEach, expect, it, vi } from "vitest";
import { deserializeGameState } from "@gamify-surgery/game-domain";
import { characterBitmapLayers, characterBitmapRegistration } from "../art/characterBitmapArt";
import { createPrototypePlayerView } from "../session/viewModels";
import { headlessFacilityScene } from "./retainedCameraTestSupport";
import { CAMERA_ZOOM_SETTLE_MS } from "./retainedCamera";

vi.mock("phaser", () => ({ default: { Scene: class {}, BlendModes: { MULTIPLY: 2, SCREEN: 3 },
  Display: { Color: { HexStringToColor: (s: string) => ({ color: parseInt(s.replace("#", ""), 16) }) } } } }));
afterEach(() => vi.restoreAllMocks());
const checkpoints = JSON.parse(readFileSync(new URL("../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json", import.meta.url), "utf8"));
function model(build = false) {
  const state = deserializeGameState(JSON.stringify(checkpoints["integration-build"]));
  state.paused = true;
  const m = createPrototypePlayerView(state, null, false, null, build).facility;
  m.camera = { zoom: 1.4, panX: 0, panY: 0 }; return m;
}
const settle = (f: ReturnType<typeof headlessFacilityScene>) => {
  f.scene.time.now += CAMERA_ZOOM_SETTLE_MS + 1; f.scene.refreshLayout();
  expect(f.camera.zoom).toBe(1); expect(f.camera.roundPixels).toBe(true);
};

it("draws loaded paused stills at native integer 1:2 sizes and registered floors after every crisp zoom", () => {
  const f = headlessFacilityScene(model());
  f.scene.textures.exists = (key: string) => key.startsWith("stitchin-time-art:character") || key === "character-contact-shadow";
  // Use Phaser's real size getters/setters, including texture-frame division
  // and multiplication. A mock that merely stores displayWidth misses this.
  const require = createRequire(import.meta.url);
  const size = require(join(dirname(require.resolve("phaser/package.json")), "src/gameobjects/components/Size.js"));
  const people = [f.bridge.viewModel.founder, ...f.bridge.viewModel.staff.slice(0, 2), ...f.bridge.viewModel.patients!.slice(0, 1)];
  expect(people).toHaveLength(4);
  const draw = (person: typeof people[number], index: number) => {
    const key = `character:proof:${index}`, graphics = f.scene.getCharacterGraphics(key);
    f.scene.drawCharacterPresentation(graphics, key, { centerX: f.scene.worldLayout.originX + 34.5 * f.scene.worldLayout.tileSize,
      baseY: f.scene.worldLayout.originY + 30.5 * f.scene.worldLayout.tileSize, appearance: person.appearance,
      direction: "front", pose: index === 1 ? "seated" : "idle", rightFacing: false, displayScale: 1 }, index);
    return f.scene.characterBitmapContainers.get(key).getByName("actor");
  };
  people.forEach((person, i) => {
    const actor = draw(person, i);
    actor.frame = { realWidth: 160, realHeight: 320 };
    Object.defineProperties(actor, { displayWidth: size.displayWidth, displayHeight: size.displayHeight });
    actor.setDisplaySize = size.setDisplaySize;
    // Reproduce a resting breath captured before pause. It must not leave
    // fractional, anisotropically stretched stills at the settled camera.
    f.scene.characterStepBounceStates.set(`character:proof:${i}`, { lift: 0, scaleX: .997, scaleY: 1.004, shadowAlpha: .45, shadowScale: 1 });
  });
  for (const zoom of [.1, .5, .7, 1, 1.6, 2.5]) {
    f.scene.applyCamera({ zoom, panX: 37, panY: -21 }); settle(f);
    people.forEach((person, i) => {
      const actor = draw(person, i), container = actor.parentContainer;
      expect(Number.isInteger(actor.displayWidth)).toBe(true); expect(Number.isInteger(actor.displayHeight)).toBe(true);
      expect(actor.displayHeight).toBe(actor.displayWidth * 2);
      expect(Math.abs(actor.y)).toBe(0); expect(Number.isInteger(container.x)).toBe(true); expect(Number.isInteger(container.y)).toBe(true);
      const registration = characterBitmapRegistration(characterBitmapLayers(person.appearance!, "front", i === 1 ? "seated" : "idle", false));
      expect(actor.originY).toBe(registration.floorAnchorY);
      expect(actor.getBounds().top + actor.displayHeight * registration.floorAnchorY).toBeCloseTo(container.y, 8);
    });
  }
});

it("starts a first paused presentation at rest and preserves an existing frozen mid-hop", () => {
  const f = headlessFacilityScene(model()), graphics = f.scene.getCharacterGraphics("character:proof");
  const candidate = { centerX: 100, baseY: 150, appearance: f.bridge.viewModel.founder.appearance,
    direction: "front", pose: "idle", rightFacing: false, displayScale: 1 };
  const draw = vi.spyOn(f.scene, "drawPixelPerson");
  f.scene.ensureCharacterStill = () => false;
  f.scene.drawCharacterPresentation(graphics, "character:proof", candidate, 0);
  expect(draw.mock.calls.at(-1)![13]).toMatchObject({ lift: 0, scaleX: 1, scaleY: 1 });
  const hop = { lift: 3.5, scaleX: .97, scaleY: 1.03, shadowAlpha: .3, shadowScale: .9 };
  f.scene.characterMotionSnapshots.clear();
  f.scene.characterStepBounceStates.set("character:proof", hop);
  f.scene.drawCharacterPresentation(graphics, "character:proof", { ...candidate, pose: "walk-a" }, 0);
  expect(draw.mock.calls.at(-1)![13]).toMatchObject({ ...hop, lift: hop.lift * 1.4 });
  expect(f.scene.characterStepBounceStates.get("character:proof")).toBe(hop);
});

it.each([.5, 1.6, 2.5])("dispatches real character, seat and hallway pointer clicks during and after zoom %s", zoom => {
  const f = headlessFacilityScene(model()), seatCallback = vi.fn(() => true), move = vi.fn(() => true);
  Object.assign(f.bridge, { onSeatFounderInChair: seatCallback, onMoveFounder: move });
  f.scene.applyCamera({ zoom, panX: 73, panY: -91 });
  const click = (p: { x: number; y: number }) => {
    const pointer = { ...p, button: 0 };
    f.scene.handlePointerDown(pointer); f.scene.handlePointerUp(pointer);
  };
  for (const settled of [false, true]) {
    if (settled) settle(f);
    const before = f.stats.worldDraws;
    const seat = f.bridge.viewModel.founderChairs!.find(chair => chair.kind === "front_desk_public")!;
    expect(seat).toBeDefined(); seat.occupied = false;
    click(f.scene.worldToScreen(f.scene.founderSeatScreenPoint(seat)));
    expect(seatCallback).toHaveBeenLastCalledWith(seat.roomInstanceId, seat.location, ...(seat.seatId ? [seat.seatId] : []));
    const hall = f.bridge.viewModel.rooms.find(room => room.definitionId === "room.hallway")!;
    const tile = { x: hall.tileX, y: hall.tileY };
    const pointer = { x: f.scene.layout.originX + (tile.x + .5) * f.scene.layout.tileSize,
      y: f.scene.layout.originY + (tile.y + .5) * f.scene.layout.tileSize };
    click(pointer); expect(move).toHaveBeenLastCalledWith(tile);
    const key = "character:founder", actor = f.scene.add.image(200, 230).setName("actor");
    f.scene.characterBitmapContainers.set(key, f.scene.add.container(0, 0).add(actor));
    click(f.scene.worldToScreen({ x: 216, y: 246 }));
    expect(f.scene.inspectTarget).toMatchObject({ kind: "character", key });
    f.scene.characterBitmapContainers.clear();
    expect(f.stats.worldDraws).toBe(before);
  }
});

it("keeps inspect/activity popups on their character or seat through a retained transform and settled rebase", () => {
  const f = headlessFacilityScene(model(), false, true), key = "character:founder";
  Object.assign(f.bridge, { onDescribeCharacter: () => ({ name: "Founder", activity: "Taking a break" }) });
  f.scene.inspectText = f.scene.add.text(0, 0, ""); f.scene.inspectBox = f.scene.add.graphics();
  f.scene.founderActivityText = f.scene.add.text(0, 0, ""); f.scene.founderActivityBox = f.scene.add.graphics();
  for (const zoom of [.5, 1.6]) for (const settled of [false, true]) {
    f.scene.applyCamera({ zoom, panX: 63, panY: 19 }); if (settled) settle(f);
    const actor = f.scene.add.image(200, 230).setName("actor");
    f.scene.characterBitmapContainers.set(key, f.scene.add.container(0, 0).add(actor));
    f.scene.handleCharacterClick(key); f.scene.renderInspectBox();
    const shown = f.scene.worldToScreen(f.scene.inspectText), head = f.scene.worldToScreen({ x: 216, y: 230 });
    expect(shown.x).toBeCloseTo(head.x, 8); expect(shown.y).toBeCloseTo(head.y - 7 * f.camera.zoom, 8);
    f.scene.inspectTarget = null;
    f.scene.renderFounderActivityBox(key, "Working", 0, 0);
    const activity = f.scene.worldToScreen(f.scene.founderActivityText);
    expect(activity.x).toBeCloseTo(head.x, 8); expect(activity.y).toBeCloseTo(head.y - 4 * f.camera.zoom, 8);
    const seat = f.bridge.viewModel.founderChairs![0]!;
    f.scene.showSeatBox(seat, "Seat occupied"); f.scene.renderInspectBox();
    const anchor = f.scene.worldToScreen(f.scene.founderSeatScreenPoint(seat)), label = f.scene.worldToScreen(f.scene.inspectText);
    expect(label.x).toBeCloseTo(anchor.x, 8);
    expect(label.y).toBeCloseTo(anchor.y - (.55 * f.scene.worldLayout.tileSize + 7) * f.camera.zoom, 8);
  }
});

it("retains Build labels/badges/stars while panning and zooming, then redraws the same crisp settled geometry", () => {
  const m = model(true); m.rooms[0]!.accessProblem = true;
  const f = headlessFacilityScene(m, false, true), labels = [...f.scene.roomTexts], stars = [...f.scene.roomStarGraphics.commandBuffer];
  expect(labels.some((label: any) => label.text === "! NO ACCESS")).toBe(true); expect(stars.length).toBeGreaterThan(0);
  const before = f.stats.worldDraws;
  f.scene.applyCamera({ zoom: 2, panX: 49, panY: -83 });
  expect(f.scene.roomTexts).toEqual(labels); expect(f.scene.roomStarGraphics.commandBuffer).toEqual(stars);
  const room = f.bridge.viewModel.rooms.find(r => r.kind !== "hallway" && r.definitionId !== "room.hallway")!;
  const shown = f.scene.worldToScreen(labels[0]);
  expect(shown.x).toBeCloseTo(f.scene.layout.originX + (room.tileX + room.width / 2) * f.scene.layout.tileSize, 8);
  expect(f.stats.worldDraws).toBe(before); settle(f);
  const fresh = headlessFacilityScene({ ...m, camera: f.scene.getCameraPreference() }, false, true);
  expect(f.scene.roomTexts.map((t: any) => [t.x, t.y, t.text, t.visible])).toEqual(fresh.scene.roomTexts.map((t: any) => [t.x, t.y, t.text, t.visible]));
  expect(f.scene.roomStarGraphics.commandBuffer).toEqual(fresh.scene.roomStarGraphics.commandBuffer);
});

it.each([.5, 2])("places the Build ghost at the actual picked tile at zoom %s before and after settlement", zoom => {
  const m = model(true);
  m.placement = { definitionId: "room.waiting", displayName: "Waiting Room", width: 4, height: 3, orientation: 0 };
  const f = headlessFacilityScene(m, false, true), place = vi.fn(() => true);
  f.bridge.onPlaceRoom = place;
  f.scene.applyCamera({ zoom, panX: 97, panY: 141 });
  for (const settled of [false, true]) {
    if (settled) settle(f);
    const before = f.stats.worldDraws, tile = { x: 2, y: 2 };
    const pointer = { x: f.scene.layout.originX + (tile.x + .5) * f.scene.layout.tileSize,
      y: f.scene.layout.originY + (tile.y + .5) * f.scene.layout.tileSize, button: 0 };
    f.scene.handlePointerMove(pointer);
    expect(f.scene.placementGhost).toMatchObject({ tileX: 2, tileY: 2, valid: true });
    const footprint = f.scene.ghostGraphics.commandBuffer.find((c: any[]) => c[0] === "fillRect");
    const shown = f.scene.worldToScreen({ x: footprint[1], y: footprint[2] });
    expect(shown.x).toBeCloseTo(f.scene.layout.originX + tile.x * f.scene.layout.tileSize, 8);
    expect(shown.y).toBeCloseTo(f.scene.layout.originY + tile.y * f.scene.layout.tileSize, 8);
    f.scene.handlePointerDown(pointer); expect(place).toHaveBeenLastCalledWith(2, 2, 0);
    expect(f.stats.worldDraws).toBe(before);
  }
});
