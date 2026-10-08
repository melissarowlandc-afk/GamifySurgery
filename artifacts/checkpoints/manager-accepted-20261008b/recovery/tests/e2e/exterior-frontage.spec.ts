import { mkdirSync } from "node:fs";
import { expect, test, type Page } from "@playwright/test";
import { getProfile, PROFILE_KEY, startClinic } from "./helpers";

const SHOTS = "artifacts/screenshots";
const CLINIC = "Frontage B QA Clinic";
const ZOOMS = [110,100,70,50,10] as const;

type ImageState = {
  key: string; texture: string; x: number; y: number; width: number; height: number;
  scaleX: number; scaleY: number; depth: number; alpha: number;
  rotation: number; flipX: boolean; flipY: boolean;
  bounds: { x: number; y: number; width: number; height: number };
};
type SurfaceState = { key: string; x: number; y: number; width: number; height: number;
  phaseX: number; phaseY: number; scaleX: number; scaleY: number };
type Snapshot = {
  origin: string; dpr: number; browserScale: number; zoom: number; tileSize: number;
  originX: number; originY: number; sidewalkTop: number; sidewalkHeight: number;
  canvasWidth: number; canvasHeight: number; columns: number; rows: number;
  frontDeskLeft: number; images: ImageState[]; surfaces: SurfaceState[];
  rooms: { x: number; y: number; width: number; height: number }[];
};

test.beforeAll(() => mkdirSync(SHOTS,{ recursive:true }));

async function ready(page: Page): Promise<void> {
  await expect(page.getByTestId("facility-canvas")).toBeVisible();
  await page.waitForFunction(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host?.__facilityGame?.scene?.getScene("facility-scene");
    return Boolean(scene?.landscapingBitmapImages?.has("landscape:front-desk-entrance-bed:west") &&
      scene?.landscapingBitmapImages?.has("landscape:front-desk-entrance-bed:east") &&
      scene?.environmentSprites?.has("environment:sidewalk") && scene?.landscapingTreeCleanupReady);
  });
}

async function fixture(page: Page): Promise<void> {
  await startClinic(page,"Frontage Reviewer",CLINIC,false);
  const pause = page.getByRole("button",{ name:"Pause facility time" });
  if (await pause.isVisible()) await pause.click();
  const profile = await getProfile(page);
  const campaign = profile.campaigns.find(item => item.campaignId===profile.activeCampaignId);
  if (!campaign) throw new Error("Missing synthetic frontage campaign");
  const state = JSON.parse(campaign.serializedState) as Record<string,any>;
  state.paused = true;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.encounters = {};
  state.employees = [];
  state.environment.ambientPedestrians = [];
  campaign.serializedState = JSON.stringify(state);
  profile.tutorialsEnabled = false;
  // Isolated Playwright context only. The init script reapplies the paused
  // fixture after the old page's exit saver, avoiding an autosave race.
  await page.addInitScript(({ key,next }) => localStorage.setItem(key,JSON.stringify(next)),
    { key:PROFILE_KEY,next:profile });
  await page.goto("/?prototype-tools=0&facility-gait-proof=1");
  const resume = page.getByRole("button",{ name:`Resume ${CLINIC}` });
  if (await resume.isVisible()) await resume.click();
  await ready(page);
  await expect(page.locator(".tutorial-target-beacon")).toHaveCount(0);
  await page.addStyleTag({ content:".facility-pause-indicator { visibility:hidden !important; }" });
}

async function snapshot(page: Page): Promise<Snapshot> {
  return page.evaluate(() => {
    const host = document.querySelector("[data-testid='facility-canvas']") as any;
    const scene = host.__facilityGame.scene.getScene("facility-scene");
    const layout = scene.layout;
    const model = scene.bridge.viewModel;
    const images = Array.from(scene.landscapingBitmapImages.entries() as Iterable<[string,any]>)
      .filter(([,image]) => image.visible)
      .map(([key,image]) => {
        const bounds = image.getBounds();
        return { key,texture:image.texture.key,x:image.x,y:image.y,
          width:image.displayWidth,height:image.displayHeight,scaleX:image.scaleX,scaleY:image.scaleY,
          depth:image.depth,alpha:image.alpha,rotation:image.rotation,flipX:image.flipX,flipY:image.flipY,
          bounds:{ x:bounds.x,y:bounds.y,width:bounds.width,height:bounds.height } };
      });
    const surfaces = Array.from(scene.environmentSprites.entries() as Iterable<[string,any]>)
      .filter(([key,sprite]) => sprite.visible && (key==="environment:sidewalk" || key.startsWith("frontage:curb:")))
      .map(([key,sprite]) => ({ key,x:sprite.x,y:sprite.y,width:sprite.displayWidth,height:sprite.displayHeight,
        phaseX:sprite.tilePositionX,phaseY:sprite.tilePositionY,
        scaleX:sprite.tileScaleX*sprite.scaleX,scaleY:sprite.tileScaleY*sprite.scaleY }));
    return { origin:location.origin,dpr:devicePixelRatio,browserScale:visualViewport?.scale ?? 1,
      zoom:scene.cameraView.zoom,tileSize:layout.tileSize,originX:layout.originX,originY:layout.originY,
      sidewalkTop:layout.sidewalkTop,sidewalkHeight:layout.sidewalkHeight,
      canvasWidth:scene.scale.width,canvasHeight:scene.scale.height,columns:model.gridColumns,rows:model.gridRows,
      frontDeskLeft:model.rooms.find((room:any)=>room.definitionId==="room.front_desk").tileX,
      images,surfaces,rooms:model.rooms.map((room:any)=>({ x:room.tileX,y:room.tileY,
        width:room.orientation===90 || room.orientation===270 ? room.height:room.width,
        height:room.orientation===90 || room.orientation===270 ? room.width:room.height })) };
  });
}

async function setZoom(page: Page,percent: number): Promise<void> {
  for (let step=0;step<30;step+=1) {
    const current = Math.round((await snapshot(page)).zoom*100);
    if (current===percent) return;
    await page.getByRole("button",{ name:current<percent ? "Zoom facility in":"Zoom facility out" }).click();
    await expect.poll(async()=>Math.round((await snapshot(page)).zoom*100)).not.toBe(current);
  }
  throw new Error(`Could not reach ${percent}% using the actual zoom controls`);
}

function assertFrontage(state: Snapshot): void {
  const tile = state.tileSize;
  const beds = state.images.filter(image=>image.key.startsWith("landscape:front-desk-entrance-bed:"));
  expect(beds).toHaveLength(2);
  expect(state.images.filter(image=>image.key.startsWith("landscape:front-desk-entrance-bloom:"))).toHaveLength(0);
  for (const bed of beds) {
    const side = bed.key.endsWith(":west") ? "west" : "east";
    expect(bed.texture).toContain(`frontage:bed-${side}-v3`);
    expect(bed.width/tile).toBeCloseTo(1.55,9);
    expect(bed.height/tile).toBeCloseTo(0.484375,9);
    expect(bed.scaleX).toBeCloseTo(bed.scaleY,12);
    expect(bed.bounds.y).toBeGreaterThanOrEqual(state.sidewalkTop-0.00001);
    expect(bed.bounds.y+bed.height).toBeCloseTo(state.sidewalkTop+0.5*tile,9);
    const left = (bed.bounds.x-state.originX)/tile-state.frontDeskLeft;
    expect(left+bed.width/tile<=2 || left>=3).toBe(true);
  }
  const inset = state.images.find(image=>image.key==="frontage:entry-inset");
  expect(inset).toBeDefined();
  expect(inset!.bounds.x).toBeCloseTo(state.originX+(state.frontDeskLeft+2)*tile,9);
  expect(inset!.bounds.y).toBeCloseTo(state.sidewalkTop,9);
  expect(inset!.width/tile).toBeCloseTo(1,9);
  expect(inset!.height/tile).toBeCloseTo(0.5,9);
  expect(inset!.depth).toBeLessThan(Math.min(...beds.map(bed=>bed.depth)));

  const plants = state.images.filter(image=>image.key.startsWith("landscape:site-landscape-"));
  expect(plants.length).toBeGreaterThan(20);
  for (const plant of plants) {
    expect(plant.scaleX).toBeCloseTo(plant.scaleY,12);
    expect(plant.depth).toBeGreaterThan(-10);
    expect(plant.depth).toBeLessThan(0);
    expect(plant.bounds.y+plant.height).toBeLessThan(state.sidewalkTop);
    const bounds = { x:(plant.bounds.x-state.originX)/tile,y:(plant.bounds.y-state.originY)/tile,
      width:plant.width/tile,height:plant.height/tile };
    for (const room of state.rooms) expect(bounds.x+bounds.width<=room.x || bounds.x>=room.x+room.width ||
      bounds.y+bounds.height<=room.y || bounds.y>=room.y+room.height).toBe(true);
  }
  const patches = state.images.filter(image=>image.key.startsWith("frontage:lawn:site-"));
  expect(patches.length).toBeGreaterThan(20);
  for (const patch of patches) {
    expect(patch.bounds.x).toBeGreaterThanOrEqual(state.originX-0.00001);
    expect(patch.bounds.y).toBeGreaterThanOrEqual(state.originY-0.00001);
    expect(patch.bounds.x+patch.bounds.width).toBeLessThanOrEqual(state.originX+state.columns*tile+0.00001);
    expect(patch.bounds.y+patch.bounds.height).toBeLessThanOrEqual(state.sidewalkTop+0.00001);
  }
  const curb = state.surfaces.filter(surface=>surface.key.startsWith("frontage:curb:"));
  expect(curb.length).toBeGreaterThan(2);
  for (const strip of curb) {
    expect(strip.height/tile).toBeCloseTo(0.12,9);
    expect(strip.y+strip.height).toBeCloseTo(state.sidewalkTop+tile,9);
    expect(strip.scaleX).toBeCloseTo(strip.scaleY,12);
    expect(strip.phaseY).toBe(0);
  }
  expect(state.sidewalkHeight/tile).toBeCloseTo(1,9);
}

async function captureEntry(page: Page,state: Snapshot,path: string): Promise<void> {
  const box = await page.locator("[data-testid='facility-canvas'] canvas").boundingBox();
  if (!box) throw new Error("No canvas bounds");
  const scaleX = box.width/state.canvasWidth;
  const scaleY = box.height/state.canvasHeight;
  const left = box.x+(state.originX+(state.frontDeskLeft-0.2)*state.tileSize)*scaleX;
  const top = box.y+(state.sidewalkTop-1.35*state.tileSize)*scaleY;
  const right = left+5.4*state.tileSize*scaleX;
  const bottom = top+2.35*state.tileSize*scaleY;
  const x = Math.max(0,box.x,left), y = Math.max(0,box.y,top);
  const viewport = page.viewportSize()!;
  const width = Math.min(right,box.x+box.width,viewport.width)-x;
  const height = Math.min(bottom,box.y+box.height,viewport.height)-y;
  if (width>1 && height>1) await page.screenshot({ path,clip:{ x,y,width,height },animations:"disabled" });
}

test("captures Option B at 110, 100, 70, 50 and minimum zoom with exact live bounds",async({ page },testInfo)=>{
  test.setTimeout(90_000);
  await fixture(page);
  const matrix: Snapshot[] = [];
  for (const zoom of ZOOMS) {
    await setZoom(page,zoom);
    const state = await snapshot(page);
    assertFrontage(state);
    matrix.push(state);
    const name = `exterior-frontage-${testInfo.project.name}-${zoom}`;
    await page.getByTestId("facility-canvas").screenshot({ path:`${SHOTS}/${name}-overview.png`,animations:"disabled" });
    await captureEntry(page,state,`${SHOTS}/${name}-entry.png`);
  }
  await testInfo.attach("frontage-zoom-matrix.json",{ body:JSON.stringify(matrix,null,2),contentType:"application/json" });
});

async function drag(page: Page,reverse = false): Promise<void> {
  const box = await page.locator("[data-testid='facility-canvas'] canvas").boundingBox();
  if (!box) throw new Error("No canvas bounds");
  const x = box.x+box.width*0.15, y = box.y+box.height*0.15;
  await page.mouse.move(x+(reverse?53:0),y+(reverse?37:0));
  await page.mouse.down();
  await page.mouse.move(x+(reverse?0:53),y+(reverse?0:37),{ steps:8 });
  await page.mouse.up();
  await page.evaluate(()=>new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve()))));
}

test("keeps materials and garden contacts world-anchored through pan, Build dimming and reload",async({ page },testInfo)=>{
  await fixture(page);
  await setZoom(page,110);
  const before = await snapshot(page);
  await drag(page);
  const panned = await snapshot(page);
  const dx = panned.originX-before.originX, dy = panned.originY-before.originY;
  expect(dx || dy).not.toBe(0);
  expect(panned.tileSize).toBe(before.tileSize);
  const byKey = new Map(panned.images.map(image=>[image.key,image]));
  for (const image of before.images) {
    const next = byKey.get(image.key)!;
    expect(next).toBeDefined();
    expect(next.x-image.x).toBeCloseTo(dx,9);
    expect(next.y-image.y).toBeCloseTo(dy,9);
    expect(next.rotation).toBe(image.rotation);
    expect(next.flipX).toBe(image.flipX);
    expect(next.flipY).toBe(image.flipY);
  }
  for (const surface of before.surfaces) {
    const next = panned.surfaces.find(item=>item.key===surface.key)!;
    expect(next.phaseX).toBe(surface.phaseX);
    expect(next.phaseY).toBe(surface.phaseY);
  }
  await drag(page,true);
  await page.getByRole("button",{ name:"Enter Build Mode" }).click();
  await ready(page);
  await expect.poll(async()=> (await snapshot(page)).images
    .filter(image=>image.key.startsWith("landscape:"))
    .every(image=>Math.abs(image.alpha-0.38)<0.000001)).toBe(true);
  const build = await snapshot(page);
  assertFrontage(build);
  const props = build.images.filter(image=>image.key.startsWith("landscape:"));
  expect(props.length).toBeGreaterThan(20);
  for (const prop of props) expect(prop.alpha).toBeCloseTo(0.38,9);
  await page.getByTestId("facility-canvas").screenshot({ path:`${SHOTS}/exterior-frontage-${testInfo.project.name}-build.png`,animations:"disabled" });
  await page.reload();
  const resume = page.getByRole("button",{ name:`Resume ${CLINIC}` });
  if (await resume.isVisible()) await resume.click();
  await ready(page);
  await setZoom(page,110);
  const reloaded = await snapshot(page);
  expect(reloaded.images.map(image=>image.key).sort()).toEqual(before.images.map(image=>image.key).sort());
  for (const image of before.images) {
    const next = reloaded.images.find(item=>item.key===image.key)!;
    expect((next.x-reloaded.originX)/reloaded.tileSize).toBeCloseTo((image.x-before.originX)/before.tileSize,9);
    expect((next.y-reloaded.originY)/reloaded.tileSize).toBeCloseTo((image.y-before.originY)/before.tileSize,9);
  }
});

test("culls whole intersecting planting for synthetic room/hallway construction and restores unchanged keys",async({ page })=>{
  await fixture(page);
  await setZoom(page,70);
  const before = await snapshot(page);
  const target = before.images.find(image=>image.key.startsWith("landscape:site-landscape-tree-"));
  expect(target).toBeDefined();
  // Renderer construction regression, deliberately separate from real Build
  // action/price/navigation QA. No synthetic construction is saved.
  for (const hallway of [false,true]) {
    await page.evaluate(({ targetKey,hallway })=>{
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host.__facilityGame.scene.getScene("facility-scene");
      scene.__frontageRoomsBefore = scene.bridge.viewModel.rooms;
      const image = scene.landscapingBitmapImages.get(targetKey);
      const x = Math.floor((image.x-scene.layout.originX)/scene.layout.tileSize);
      // Intersect the actual silhouette even when the frozen field chooses a
      // small sapling; a contact-minus-one tile can miss a short crown.
      const y = Math.floor((image.y-image.originY*image.displayHeight+image.displayHeight/2-
        scene.layout.originY)/scene.layout.tileSize);
      const sample = scene.bridge.viewModel.rooms[0];
      scene.bridge.viewModel.rooms = [...scene.bridge.viewModel.rooms,{ ...sample,
        instanceId:"frontage.synthetic.construction",definitionId:hallway?"room.hallway":"room.examination",
        kind:hallway?"hallway":"room",tileX:x,tileY:y,width:hallway?1:3,height:hallway?1:2,orientation:0 }];
      scene.drawWorld();
    },{ targetKey:target!.key,hallway });
    const constructed = await snapshot(page);
    expect(constructed.images.some(image=>image.key===target!.key)).toBe(false);
    assertFrontage(constructed);
    for (const image of constructed.images) expect(before.images.find(item=>item.key===image.key)).toMatchObject({ x:image.x,y:image.y });
    await page.evaluate(()=>{
      const host = document.querySelector("[data-testid='facility-canvas']") as any;
      const scene = host.__facilityGame.scene.getScene("facility-scene");
      scene.bridge.viewModel.rooms = scene.__frontageRoomsBefore;
      delete scene.__frontageRoomsBefore;
      scene.drawWorld();
    });
    const restored = await snapshot(page);
    expect(restored.images.map(image=>image.key).sort()).toEqual(before.images.map(image=>image.key).sort());
  }
});
