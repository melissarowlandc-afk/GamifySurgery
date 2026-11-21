import { mountDesktopClinic, observeDoorWork } from "./desktopLagAppFixture";
import { expect, it, vi } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, findDeterministicFacilityPath, getRoomDefinition, serializeGameState, type GameState,
} from "@gamify-surgery/game-domain";
import { getRoomUpgradeLevelBenefit } from "@gamify-surgery/balance-config";
import { examRoom } from "../../../../packages/game-domain/tests/paused-command-outage-fixtures";
import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { getApprovedSupportPainterGround } from "./approvedRoomRenderer";
import { getFacilitySceneDepth } from "./renderDepth";
import { interiorFills, officeId, ownerScaleClinic, pixelRoom, roomCenter } from "./desktopLagAcceptanceFixtures";

type App = Awaited<ReturnType<typeof mountDesktopClinic>>;
const distantRoom = "public.perf.exam.3.14";
const front = { x: 35, y: 29 };

async function selectRoom(app: App, roomId: string) {
  await app.revealRoom(roomId);
  await app.action(() => app.f.click(roomCenter(app.f, roomId)));
  await app.frame();
  expect(app.f.bridge.viewModel.selectedRoomInstanceId).toBe(roomId);
}

function stars(app: App, roomId: string) {
  const { f } = app;
  const room = f.bridge.viewModel.rooms.find(room => room.instanceId === roomId)!;
  const r = pixelRoom(f.scene, room);
  const full = new f.camera.constructor(0, 0, 12000, 12000).setOrigin(0, 0).setScroll(-6000, -6000);
  full.id = 1; full.preRender();
  return f.render(true, full).filter(row => row.object.depth === f.scene.roomStarGraphics.depth)
    .flatMap(row => row.calls).filter(([name, x, y]) => name === "fillRect" && Math.abs(Number(x) - (r.x + r.width / 2)) < 45 &&
      Math.abs(Number(y) - (r.y + 0.16 * f.scene.worldLayout.tileSize + 32)) < 35);
}

it.each([
  { roomId: examRoom, definitionId: "room.examination", cost: 90, budget: 150, goal: { x: 35, y: 25 },
    effect: "+2 satisfaction points after examination; routine APP work takes 5% less time" },
  { roomId: officeId, definitionId: "room.founder_office", cost: 300, budget: 320, goal: { x: 42, y: 25 },
    effect: "+2 staff morale points; improved office appearance" },
])("B-021 first displayed $definitionId upgrade refreshes only affected parts, with one durable edit", async ({ roomId, definitionId, cost, budget, goal, effect }) => {
  const seed = ownerScaleClinic();
  seed.cash = budget;
  seed.cashCents = budget * 100;
  const office = roomId === officeId;
  // r48 has tiered contact art with no live producer for the office support
  // role. Supply this one actor input from the first real bridge publication.
  const app = await mountDesktopClinic(seed, office ? { adapt: model => ({ ...model, founder: { ...model.founder,
    location: { x: 42, y: 24 }, path: undefined, pathIndex: undefined, moving: false, seated: true,
    supportRole: "founder-office-seat", supportId: "founderChair", supportRoomInstanceId: roomId } }) } : undefined);
  const { f } = app;
  const room = (id: string) => f.bridge.viewModel.rooms.find(room => room.instanceId === id)!;
  await app.click("Enter Build Mode");
  await app.frame();
  await selectRoom(app, roomId);
  await app.frame();
  expect(f.bridge.viewModel).toMatchObject({ buildDoorTool: null, buildMode: true, paused: true });
  expect(app.env.element.textContent).toContain(effect);
  const route = (state: GameState) => findDeterministicFacilityPath(front, goal, state.rooms, state.doors, getRoomDefinition);
  const before = app.session.state, beforeBytes = serializeGameState(before), beforeRoute = route(before);
  expect(beforeRoute.at(-1)).toEqual(goal);
  const beforeOpenings = f.scene.getRoomDoorOpenings(room(roomId));
  const beforeStars = stars(app, roomId);
  expect(beforeStars.length).toBeGreaterThan(0);
  const badges = f.bridge.viewModel.rooms.filter(r => r.instanceId !== roomId && r.upgradeAffordable).map(r => r.instanceId);
  expect(badges.length).toBeGreaterThan(1);
  const artOf = () => f.objects.filter(object => object.kind === "image" && object.visible && object.getData("approved-front-room-id") === roomId)
    .map(object => [object.getData("approved-draw-id"), object.texture?.key, object.displayFrame, object.x, object.y, object.displayWidth, object.displayHeight]);
  const priorArt = artOf();
  const journal = vi.spyOn(app.cache.journal, "append");
  const meter = observeDoorWork(before.doors);
  f.reset();
  const upgrade = app.env.find(node => node.tagName === "BUTTON" && node.attributes.class?.includes("room-action-menu-upgrade") === true);
  await app.env.clickElement(upgrade);
  await app.action(() => {});
  await app.frame();
  const firstWork = f.work(), hypothetical = meter.read();
  meter.stop();
  const durableRows = journal.mock.calls.flatMap(([, , , rows]) => rows);
  const executed = app.ports.flatMap(port => port.messages).find(row => row.kind === "command" && row.command.type === "UPGRADE_ROOM");
  expect(executed?.kind).toBe("command");
  if (executed?.kind !== "command") throw Error("Upgrade never reached the operational worker");
  const next = app.session.state;
  expect(next.operationReceipts[executed.command.operationId]).toMatchObject({ status: "applied", commandType: "UPGRADE_ROOM",
    message: `${getRoomDefinition(definitionId)!.displayName} upgraded for $${cost}.` });
  expect(next.cashCents).toBe(before.cashCents - cost * 100);
  expect(next.facilityTick).toBe(before.facilityTick);
  expect(next.events.at(-1)).toMatchObject({ type: "room_upgraded", target: { kind: "room", id: roomId } });
  expect(durableRows).toHaveLength(1);
  expect(journal.mock.calls).toHaveLength(1);
  expect(room(roomId).upgradeLevel).toBe(2);
  expect(getRoomUpgradeLevelBenefit(definitionId, 2)?.totalDescription).toBe(effect);
  expect(stars(app, roomId)).not.toEqual(beforeStars);
  expect(badges.filter(id => room(id).upgradeAffordable === false).length).toBeGreaterThan(1);
  expect(next.doors).toEqual(before.doors);
  expect(route(next)).toEqual(beforeRoute);
  expect(f.scene.getRoomDoorOpenings(room(roomId))).toEqual(beforeOpenings);
  if (office) {
    const art = artOf();
    const oldRecords = resolveApprovedRoomDrawRecords(definitionId, 0, undefined, 1);
    const tierTwo = resolveApprovedRoomDrawRecords(definitionId, 0, undefined, 2);
    const changed = tierTwo.filter(record => record.classification === "necessary" &&
      !oldRecords.some(old => old.id === record.id && old.assetId === record.assetId && old.sourceRect.join() === record.sourceRect.join()));
    expect(changed.length).toBeGreaterThan(0);
    expect(art).not.toEqual(priorArt);
    for (const record of changed) {
      expect(art).toContainEqual(expect.arrayContaining([record.id, `stitchin-time-art:${record.assetId}`,
        `gs015:${record.assetId}:${record.sourceRect.join(":")}`]));
    }
    const support = resolveApprovedRoomActorSupports(definitionId, 0, 2).find(row => row.id === "founderChair")!;
    const r = pixelRoom(f.scene, room(roomId)), tile = f.scene.worldLayout.tileSize;
    expect(f.scene.debugCharacterGaitSnapshot()["character:founder"]).toMatchObject({
      supportId: support.id, supportRoomInstanceId: roomId, visible: true, pose: "seated",
      groundX: Math.round(r.x + support.seat.x * tile),
    });
    expect(f.scene.characterBitmapContainers.get("character:founder").depth)
      .toBe(getFacilitySceneDepth(r.y + getApprovedSupportPainterGround(support).y * tile, "character", 0));
  } else expect(artOf()).toEqual(priorArt);

  const unrelatedRoom = pixelRoom(f.scene, room(distantRoom));
  const unnecessary = {
    unaffectedFills: interiorFills(unrelatedRoom, firstWork.issuedRects).length,
    unaffectedFixtureWrites: firstWork.fixtureWrites.filter(image => image.getData("approved-front-room-id") === distantRoom && !image.getData("approved-chair-layer")).length,
    roomTextCreates: firstWork.roomTextCreates, ...hypothetical,
  };

  const undo = app.env.find(node => node.tagName === "BUTTON" && node.attributes.class?.includes("build-undo-button") === true);
  expect(undo.attributes.disabled).toBeUndefined();
  await app.env.clickElement(undo);
  await app.action(() => {});
  await app.frame();
  expect(serializeGameState(app.session.state)).toBe(beforeBytes);
  expect(room(roomId).upgradeLevel).toBe(1);
  expect(stars(app, roomId)).toEqual(beforeStars);
  await app.click("Doors");
  await app.frame();
  const targets = () => f.scene.getBuildDoorInteractionTargets().filter((target: { kind: string }) => target.kind === "place")
    .map(({ slot, geometry }: any) => [slot.id, geometry]);
  const beforePlaceUpgrade = targets();
  expect(beforePlaceUpgrade.length).toBeGreaterThan(0);
  const myRooms = app.env.find(node => node.attributes.id === "build-tab-my");
  await app.env.clickElement(myRooms);
  const row = app.env.find(node => node.attributes["data-room-instance-id"] === roomId);
  await app.env.clickElement(row.childNodes.find(node => node.attributes.class?.includes("build-owned-upgrade"))!);
  await app.action(() => {});
  await app.frame();
  expect(room(roomId).upgradeLevel).toBe(2);
  expect(f.bridge.viewModel.buildDoorTool).toBe("place");
  expect(targets()).toEqual(beforePlaceUpgrade);
  await app.click("Done / Save");
  await app.frame();
  expect(f.bridge.viewModel).toMatchObject({ paused: true, buildMode: false });
  expect(unnecessary, `work on the first displayed upgrade result (${firstWork.worldDraws} world draws)`).toEqual({ unaffectedFills: 0, unaffectedFixtureWrites: 0,
    roomTextCreates: 0, ...meter.zero });
});

it("B-021 rejected room upgrade leaves displayed architecture, labels and geometry alone", async () => {
  const state = ownerScaleClinic();
  state.cash = 0; state.cashCents = 0;
  const app = await mountDesktopClinic(state);
  await app.click("Enter Build Mode");
  await app.frame();
  await selectRoom(app, examRoom);
  const { f } = app;
  const previous = app.session.state;
  const labels = f.labels();
  const op = "public.perf.rejected-quote";
  const meter = observeDoorWork(previous.doors);
  f.reset();
  await app.action(() => app.session.executeAsync({ type: "UPGRADE_ROOM", roomId: examRoom, operationId: op }, PROTOTYPE_DOMAIN_CONTEXT));
  await app.frame();
  expect(app.session.state.operationReceipts[op]).toMatchObject({ status: "rejected", message: "There is not enough cash for this upgrade." });
  expect(app.session.state.rooms).toEqual(previous.rooms);
  expect(app.session.state.doors).toEqual(previous.doors);
  expect(app.session.state.cashCents).toBe(previous.cashCents);
  expect(f.labels().every((label: any, index: number) => label === labels[index])).toBe(true);
  const work = f.work();
  const room = f.bridge.viewModel.rooms.find(row => row.instanceId === examRoom)!;
  expect({ worldDraws: work.worldDraws, roomTextCreates: work.roomTextCreates,
    shellFills: interiorFills(pixelRoom(f.scene, room), work.issuedRects).length, ...meter.read() }).toEqual({
    worldDraws: 0, roomTextCreates: 0, shellFills: 0, ...meter.zero,
  });
});
