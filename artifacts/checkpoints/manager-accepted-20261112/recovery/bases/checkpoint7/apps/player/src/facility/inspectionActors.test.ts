import { afterAll, beforeAll, expect, it, vi } from "vitest";
import { deserializeGameState, gameReducer, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { createPrototypePlayerView } from "../session/viewModels";
import { characterBitmapLayers, characterStandingBitmapDescriptors } from "../art/characterBitmapArt";
import { APPROVED_ROOM_NAVIGATION_CONTRACTS } from "@gamify-surgery/balance-config";
import { getApprovedLevel5RoomTier } from "./approvedLevel5RoomData";
vi.mock("phaser", () => ({ default: { Scene: class {} } }));
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";

const context = createLevelFiveStateQaContext(), balance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease; });
afterAll(() => { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = balance; });

it.each([1, 4] as const)("uses the existing routeMotion and clipboard standing cardinals for all ten actors at %ix, through reload", speed => {
  let state = createLevelFiveStateQaState("inspectors-arriving", context); state.paused = false; state.simulationSpeed = speed;
  const bridge: FacilitySceneBridge = { viewModel: createPrototypePlayerView(state, null, false, null).facility, onPlaceRoom: () => false };
  let scene = new FacilityScene(bridge) as any;
  const ids = new Set<string>(), directions = new Set<string>(); let samples = 0;
  const solids = state.rooms.flatMap(room => {
    // Read the actual room renderer's footprints for prestige furniture.
    const tier = getApprovedLevel5RoomTier(room.roomDefinitionId, room.upgradeLevel);
    const open = new Set(state.doors.filter(door => door.roomId === room.id).map(door => door.side === "north" || door.side === "south"
      ? `${door.side === "north" ? "N" : "S"}${door.offset + 1}` : `${door.side === "west" ? "W" : "E"}${String.fromCharCode(65 + door.offset)}`));
    const boxes = tier ? tier.records.filter(record => record.footprint && !record.doorOwners.some(owner => open.has(owner))).map(record => record.footprint!)
      : (APPROVED_ROOM_NAVIGATION_CONTRACTS[room.roomDefinitionId]?.solidFixtures ?? []).filter(fixture =>
        !fixture.hiddenByDoorSlots?.some(slot => state.doors.some(door => door.roomId === room.id && door.side === slot.side && door.offset === slot.offset))).map(fixture => fixture.footprint);
    return boxes.map(box => ({ ...box, left: box.left + room.x, top: box.top + room.y, roomId: room.id }));
  });
  const calls = [vi.spyOn(scene, "getCharacterRouteMotionPresentation")];
  for (let minute = 0; minute < 75; minute++) {
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `m7b.motion.${speed}.${minute}` }, context);
    if (minute === 35) { state = deserializeGameState(serializeGameState(state), context); scene = new FacilityScene(bridge) as any; calls.push(vi.spyOn(scene, "getCharacterRouteMotionPresentation")); }
    bridge.viewModel = createPrototypePlayerView(state, null, false, null).facility;
    for (let frame = 0; frame < 12; frame++) {
      scene.frameDeltaMilliseconds = bridge.viewModel.realMillisecondsPerFacilityMinuteAt1x / speed / 12;
      for (const actor of bridge.viewModel.inspectors!) {
        const shown = scene.getCharacterRoutePresentation(`character:inspector:${actor.instanceId}`, actor);
        expect(Number.isFinite(shown.location.x) && Number.isFinite(shown.location.y)).toBe(true);
        const x = shown.location.x + .5, y = shown.location.y + .5;
        const overlaps = solids.filter(box => x >= box.left && y >= box.top && x <= box.left + box.width && y <= box.top + box.height);
        expect(overlaps, `minute ${minute}, frame ${frame}, ${actor.instanceId} at ${x},${y}`).toEqual([]);
        ids.add(actor.appearance.stillId!); directions.add(shown.direction);
        const pose = characterBitmapLayers(actor.appearance, shown.direction, shown.moving ? "walk-a" : "idle", shown.rightFacing)!;
        expect(pose.actor.asset).toMatchObject({ url: expect.stringContaining("/stand-") }); samples++;
      }
    }
  }
  expect(ids.size).toBe(10); expect(samples).toBe(9000); expect(directions).toContain("side"); expect(directions).toContain("back");
  for (const call of calls) expect(call.mock.results.filter(result => result.type === "throw")).toEqual([]);
}, 30_000);

it.each([false, true])("draws the separate inspector layer with standard scale/depth and clears it when the run ends (phone=%s)", mobileInput => {
  const state = createLevelFiveStateQaState("inspectors", context), facility = createPrototypePlayerView(state, null, false, null).facility;
  const bridge: FacilitySceneBridge = { viewModel: { ...facility, founder: { ...facility.founder, location: undefined, path: [] },
    staff: [], patients: [], serviceVisitors: [], retailExternalActors: [], ambientPedestrians: [] }, mobileInput, onPlaceRoom: () => false };
  const scene = new FacilityScene(bridge) as any;
  const prefetched = vi.spyOn(scene, "ensureCharacterStills").mockImplementation(() => {});
  const drawn = vi.spyOn(scene, "drawCharacterPresentation").mockImplementation((_graphics, _key, input: any) => input.baseY);
  const depths: number[] = [];
  const issues = new Map<string, unknown>();
  vi.spyOn(scene, "getCharacterGraphics").mockImplementation((key: unknown) => ({
    setDepth: (value: number) => depths.push(value), setData: (_name: string, value: unknown) => issues.set(String(key), value),
  }));
  vi.spyOn(scene, "reconcileApprovedSideChairLayers").mockImplementation(() => {});
  vi.spyOn(scene, "renderInspectBox").mockImplementation(() => {});
  scene.drawCharacters();
  expect(drawn).toHaveBeenCalledTimes(10); expect(depths.every(Number.isFinite)).toBe(true);
  expect(prefetched.mock.calls[0]![0]).toHaveLength(40);
  for (const [, key, input] of drawn.mock.calls as any[]) {
    expect(key).toMatch(/^character:inspector:/); expect(input.displayScale).toBe(1); expect(input.pose).not.toBe("seated");
  }
  const first = bridge.viewModel.inspectors![0]!;
  scene.failedCharacterStills.add(characterStandingBitmapDescriptors(first.appearance)[0]!.id);
  drawn.mockClear(); scene.drawCharacters();
  const held = (drawn.mock.calls[0] as any[])[2];
  expect(issues.get(`character:inspector:${first.instanceId}`)).toBe("Inspector art failed; stationary observer.");
  bridge.viewModel = { ...bridge.viewModel, inspectors: bridge.viewModel.inspectors!.map((actor, index) => index
    ? actor : { ...actor, location: { x: actor.location.x + 3, y: actor.location.y } }) };
  drawn.mockClear(); scene.drawCharacters();
  expect((drawn.mock.calls[0] as any[])[2]).toMatchObject({ centerX: held.centerX, baseY: held.baseY });
  bridge.viewModel = { ...bridge.viewModel, inspectors: undefined }; drawn.mockClear(); scene.drawCharacters();
  expect(drawn).not.toHaveBeenCalled(); expect(scene.routeMotionTracks.size).toBe(0); expect(scene.characterMotionSnapshots.size).toBe(0);
  expect(scene.failedInspectorLocations.size).toBe(0);
});
