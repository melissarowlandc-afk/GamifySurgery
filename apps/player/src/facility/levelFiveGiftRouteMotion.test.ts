import { afterAll, beforeAll, expect, it, vi } from "vitest";
import { gameReducer, deserializeGameState, serializeGameState, giftContactLocation, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import { createLevelFiveStateQaContext, createLevelFiveStateQaState } from "../../../../tests/fixtures/level-five-state";
import { createPrototypePlayerView } from "../session/viewModels";
vi.mock("phaser",()=>({default:{Scene:class {}}}));
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";
// Hosted CI runners run long simulations up to ten times slower.
const hostedTime = (ms: number) => (process.env.CI ? ms * 10 : ms);

const context=createLevelFiveStateQaContext(), original=PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
beforeAll(()=>{PROTOTYPE_DOMAIN_CONTEXT.balanceRelease=context.balanceRelease;});
afterAll(()=>{PROTOTYPE_DOMAIN_CONTEXT.balanceRelease=original;});
it.each([1,4] as const)("samples actual gift queue/counter/return paths at %ix, through reload without routeMotion changes", speed=>{
  let state:GameState={...createLevelFiveStateQaState("gift-queue",context),paused:false,simulationSpeed:speed};
  const bridge:FacilitySceneBridge={viewModel:createPrototypePlayerView(state,null,false,null).facility,onPlaceRoom:()=>false};
  let scene=new FacilityScene(bridge) as any;
  const calls=[vi.spyOn(scene,"getCharacterRouteMotionPresentation")];let samples=0,checkout=false,reloaded=false;
  for(let minute=0;minute<180;minute++){
    state=gameReducer(state,{type:"ADVANCE_TICK",operationId:`gift.render.${speed}.${minute}`},context);
    if(!reloaded && state.retailOperations.some(t=>t.status==="purchasing")){
      state=deserializeGameState(serializeGameState(state),context);scene=new FacilityScene(bridge) as any;calls.push(vi.spyOn(scene,"getCharacterRouteMotionPresentation"));reloaded=true;
    }
    bridge.viewModel=createPrototypePlayerView(state,null,false,null).facility;
    for(let frame=0;frame<16;frame++){
      scene.frameDeltaMilliseconds=bridge.viewModel.realMillisecondsPerFacilityMinuteAt1x/speed/16;
      for(const actor of bridge.viewModel.retailExternalActors??[]){
        const presentation=scene.getCharacterRoutePresentation(`gift:${actor.instanceId}`,actor);
        expect(Number.isFinite(presentation.location.x)).toBe(true);expect(Number.isFinite(presentation.location.y)).toBe(true);
        if(actor.supportRole==="gift-shop-contact" && actor.supportId==="pay") checkout=true;samples++;
      }
    }
  }
  expect(reloaded).toBe(true);expect(checkout).toBe(true);expect(samples).toBeGreaterThan(1000);
  for(const call of calls) expect(call.mock.results.filter(r=>r.type==="throw")).toEqual([]);
  expect(state.serviceIncomeReceipts.some(r=>r.incomeLineId==="income.gift_shop")).toBe(true);
});

function sceneActors(view: FacilitySceneBridge["viewModel"]) {
  return [
    { key: "character:founder", actor: view.founder },
    ...view.staff.map(actor => ({ key: `character:staff:${actor.instanceId}`, actor })),
    ...(view.patients ?? []).map(actor => ({ key: `character:patient:${actor.instanceId}`, actor })),
    ...(view.serviceVisitors ?? []).map(actor => ({ key: `character:service-visitor:${actor.actorId}`, actor })),
    ...(view.retailExternalActors ?? []).map(actor => ({ key: `character:retail-${actor.actorKind}:${actor.instanceId}`, actor })),
  ];
}

it.each([1, 4] as const)("renders the whole real gift queue lifecycle at %ix without any co-located shop actors", speed => {
  let state: GameState = { ...createLevelFiveStateQaState("gift-queue", context), paused: false, simulationSpeed: speed };
  const shop = state.rooms.find(room => room.roomDefinitionId === "room.gift_shop")!;
  const contacts = ["pay", "queue1", "queue2"] as const;
  expect(new Set(contacts.map(id => JSON.stringify(giftContactLocation(shop, id)))).size).toBe(3);
  const cohort = state.retailOperations.slice(0, 3).map(trip => trip.actorId);
  const rearTripId = state.retailOperations[2]!.id;
  const rearContacts: Array<string | null> = ["queue2"];
  const bridge: FacilitySceneBridge = { viewModel: createPrototypePlayerView(state, null, false, null).facility, onPlaceRoom: () => false };
  let scene = new FacilityScene(bridge) as any;
  const calls = [vi.spyOn(scene, "getCharacterRouteMotionPresentation")];
  let reloaded = false, shopSamples = 0;
  for (let minute = 0; minute < 180; minute++) {
    state = gameReducer(state, { type: "ADVANCE_TICK", operationId: `gift.queue.lifecycle.${speed}.${minute}` }, context);
    if (!reloaded && state.retailOperations.some(trip => trip.status === "purchasing")) {
      state = deserializeGameState(serializeGameState(state), context);
      scene = new FacilityScene(bridge) as any;
      calls.push(vi.spyOn(scene, "getCharacterRouteMotionPresentation"));
      reloaded = true;
    }
    const rearContact = state.retailOperations.find(trip => trip.id === rearTripId)?.giftCheckout?.contactId ?? null;
    if (rearContact !== rearContacts.at(-1)) rearContacts.push(rearContact);
    const reservations = state.retailOperations.filter(trip => trip.giftCheckout?.contactId && !["completed", "cancelled", "abandoned"].includes(trip.status));
    expect(new Set(reservations.map(trip => `${trip.actorKind}:${trip.actorId}`)).size).toBe(reservations.length);
    expect(new Set(reservations.map(trip => `${trip.outletRoomInstanceId}:${trip.giftCheckout!.contactId}`)).size).toBe(reservations.length);
    bridge.viewModel = createPrototypePlayerView(state, null, false, null).facility;
    const rows = sceneActors(bridge.viewModel);
    const inShop = rows.filter(({ actor }) => actor.location && actor.location.x > shop.x - .5 && actor.location.x < shop.x + 2.5 &&
      actor.location.y > shop.y - .5 && actor.location.y < shop.y + 2.5);
    for (let i = 0; i < inShop.length; i++) for (let j = i + 1; j < inShop.length; j++) {
      const a = inShop[i]!, b = inShop[j]!;
      expect(Math.hypot(a.actor.location!.x - b.actor.location!.x, a.actor.location!.y - b.actor.location!.y),
        `minute ${minute}: ${a.key} and ${b.key} share the shop view-model point`).toBeGreaterThan(0.000001);
    }
    const bounds = scene.toPixels({ tileX: shop.x, tileY: shop.y, width: 3, height: 3 });
    for (let frame = 0; frame < 24; frame++) {
      scene.frameDeltaMilliseconds = bridge.viewModel.realMillisecondsPerFacilityMinuteAt1x / speed / 24;
      const positions: Array<{ key: string; x: number; y: number }> = [];
      for (const { key, actor } of rows) {
        if (!actor.location) continue;
        const motion = scene.getCharacterRoutePresentation(key, actor);
        const support = scene.getApprovedActorSupportDisplayPosition(motion.location, motion.moving, actor.supportRole, actor.supportId,
          "supportRoomInstanceId" in actor ? actor.supportRoomInstanceId : undefined);
        if (support?.hidden) continue;
        const x = support?.centerX ?? scene.layout.originX + (motion.location.x + .5) * scene.layout.tileSize;
        const y = support?.baseY ?? scene.actorBaseY(motion.location.y);
        expect(Number.isFinite(x) && Number.isFinite(y)).toBe(true);
        if (x > bounds.x && x < bounds.x + bounds.width && y > bounds.y && y < bounds.y + bounds.height) positions.push({ key, x, y });
      }
      for (let i = 0; i < positions.length; i++) for (let j = i + 1; j < positions.length; j++) {
        const a = positions[i]!, b = positions[j]!;
        expect(Math.hypot(a.x - b.x, a.y - b.y), `minute ${minute}, frame ${frame}: ${a.key} and ${b.key} at ${a.x},${a.y}`).toBeGreaterThan(0.000001);
        expect(Math.hypot(Math.round(a.x) - Math.round(b.x), Math.round(a.y) - Math.round(b.y)),
          `minute ${minute}, frame ${frame}: ${a.key} and ${b.key} share a rendered pixel`).toBeGreaterThan(0);
      }
      shopSamples += positions.length;
    }
  }
  expect(rearContacts).toEqual(["queue2", "queue1", "pay", null]);
  for (const actorId of cohort) {
    expect(state.serviceIncomeReceipts.filter(receipt => receipt.actorId === actorId && receipt.incomeLineId === "income.gift_shop")).toHaveLength(1);
    expect(state.retailExternalActors.find(actor => actor.id === actorId)?.lifecycle).toBe("departed");
  }
  expect(reloaded).toBe(true);
  expect(shopSamples).toBeGreaterThan(100);
  for (const call of calls) expect(call.mock.results.filter(result => result.type === "throw")).toEqual([]);
}, hostedTime(20000));
