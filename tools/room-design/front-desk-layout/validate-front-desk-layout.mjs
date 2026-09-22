import { readFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = path.dirname(fileURLToPath(import.meta.url));
const fragmentPath = path.join(here, "front-desk-layout.html");
const evidence = path.join(here, "evidence");
const fragment = await readFile(fragmentPath, "utf8");
if (Buffer.byteLength(fragment, 'utf8') >= 1_000_000) throw new Error('self-contained fragment must stay below 1 MB');
const browser = await chromium.launch({
  headless: true,
  executablePath: process.platform === "win32"
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : undefined,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const pageErrors = [];
page.on('pageerror', error => pageErrors.push(error.message));
page.on('console', message => { if (message.type() === 'error') pageErrors.push(message.text()); });
await page.setContent(`<main>${fragment}</main>`, { waitUntil: "load" });
await page.waitForFunction(() => window.__frontDeskLayout?.atlasReady());
const result = await page.evaluate(() => {
  const model = window.__frontDeskLayout;
  const failures = [];
  for (const visitor of ["D5", "D4", "D2"]) {
    for (const chairMode of ["stay", "hide"]) for (let mask = 0; mask < 8192; mask += 1) {
      const state = model.evaluate(mask, visitor);
      const edActive = Boolean(mask & (1 << model.segments.indexOf('ED')));
      const expectedReachable = visitor === 'D5' && !edActive ? 12 : 13;
      if (state.reachable !== expectedReachable) failures.push({ visitor, chairMode, mask, reachable: state.reachable, expectedReachable });
      if (!state.seatApproaches.receptionist.length || !state.seatApproaches.visitor.length) failures.push({ visitor, chairMode, mask, seats: state.seatApproaches });
      if (state.visitorFrontClear !== (visitor === 'D4' || visitor === 'D5')) failures.push({ visitor, chairMode, mask, visitorFront: state.visitorFront, clear: state.visitorFrontClear });
      for (const route of state.activeRoutes) if (route.path.some(tile => model.permanent(visitor).has(tile) && !(visitor === 'D5' && route.id === 'ED' && edActive && tile === 'D5'))) failures.push({ visitor, chairMode, mask, route: route.id, crossing: 'solid' });
      if (visitor === 'D5' && !edActive && state.candidateRoutes.find(route => route.id === 'ED').path.length) failures.push({ visitor, chairMode, mask, ed: 'candidate should remain blocked' });
      if (visitor === 'D5' && edActive && !state.activeRoutes.find(route => route.id === 'ED').path.length) failures.push({ visitor, chairMode, mask, ed: 'active should be reachable' });
      for (const item of model.optional) {
        const overlaps = item.segments.some((id) => state.active.includes(id));
        if (overlaps !== state.hidden.includes(item.id)) failures.push({ visitor, mask, item: item.id, hiding: "mismatch" });
      }
    }
  }
  return { failures, initial: document.querySelector('#fd-status').textContent };
});
if (result.failures.length) throw new Error(JSON.stringify(result.failures.slice(0, 5)));
const primaryView = await page.evaluate(() => ({
  mapHidden: document.querySelector('#fd-map-section').hidden,
  targets: document.querySelectorAll('#fd-art-targets [data-segment]').length,
  artVisible: document.querySelector('#fd-art').getBoundingClientRect().width > 0,
  doorControlsVisible: [...document.querySelectorAll('#fd-north [data-segment],#fd-west [data-segment],#fd-east [data-segment]')].filter(button => button.getBoundingClientRect().width > 0).length,
  adjacencyControlsVisible: [...document.querySelectorAll('[data-adjacent]')].filter(input => input.getBoundingClientRect().width > 0).length,
}));
if (!primaryView.mapHidden || primaryView.targets !== 13 || !primaryView.artVisible || primaryView.doorControlsVisible !== 13 || primaryView.adjacencyControlsVisible !== 5) throw new Error(JSON.stringify({ primaryView }));
const shellGeometry = await page.evaluate(() => {
  const art = document.querySelector('#fd-art');
  const artRect = art.getBoundingClientRect();
  const surface = JSON.parse(art.dataset.surface);
  const slots = JSON.parse(art.dataset.slots);
  const targets = Object.fromEntries([...document.querySelectorAll('#fd-art-targets [data-segment]')].map(target => {
    const rect = target.getBoundingClientRect();
    return [target.dataset.segment, { left: rect.left - artRect.left, top: rect.top - artRect.top, width: rect.width, height: rect.height }];
  }));
  return { surface, slots, targets, width: artRect.width, height: artRect.height };
});
if (shellGeometry.surface.logicalCols !== 5 || shellGeometry.surface.logicalRows !== 4 || shellGeometry.surface.visualCols !== 10 || shellGeometry.surface.visualRows !== 8 || shellGeometry.surface.canvasHeight !== 520 || shellGeometry.surface.doorStyle !== 'open-frame-only' || shellGeometry.surface.frameHasLeaf !== false || shellGeometry.surface.rearWallHeight !== 80 || shellGeometry.surface.lowWallHeight !== 29 || shellGeometry.surface.lowNorthHasHeader !== false || shellGeometry.surface.sideWallStyle !== 'orthogonal-cap-only' || shellGeometry.surface.sideDoorStyle !== 'gap-with-jamb-stripes' || shellGeometry.surface.sideCapWidth !== 14 || shellGeometry.surface.sideTopMode !== 'matches-visible-north-cap' || shellGeometry.surface.sideTallTop !== 21 || shellGeometry.surface.sideLowTop !== 81 || shellGeometry.surface.frontWallHeight !== 29 || shellGeometry.surface.adjoiningStripDepth !== 0 || shellGeometry.surface.northAdjacencySlots !== 5 || shellGeometry.surface.openingOwnership !== 'neighbor-transparent' || shellGeometry.surface.sideDoorSeam !== 'half-thickness' || shellGeometry.surface.sideInnerFloorPixels !== 7 || shellGeometry.surface.sideOuterAlphaPixels !== 7 || shellGeometry.surface.coolerPersistence !== 'permanent' || shellGeometry.surface.coolerCollision !== 'nonblocking') throw new Error(JSON.stringify({ shellGeometry }));
const coolerContract = await page.evaluate(() => window.__frontDeskLayout.optional.find(item => item.id === 'cooler'));
if (!coolerContract || coolerContract.persistence !== 'permanent' || coolerContract.collision !== 'nonblocking' || coolerContract.segments.length !== 0) throw new Error(JSON.stringify({ coolerContract, issue: 'water cooler must be permanent, nonblocking, and independent of door conflicts' }));
const upkeepContract = await page.evaluate(() => {
  const model = window.__frontDeskLayout;
  const service = model.servicePoints;
  const routeFailures = [];
  const masks=[0,(1<<model.segments.length)-1,1<<model.segments.indexOf('ED'),(1<<model.segments.indexOf('N5'))|(1<<model.segments.indexOf('EA'))];
  for (const visitor of ['D5','D4','D2']) for (const mask of masks) {
    const active = new Set(model.segments.filter((_,index)=>mask&(1<<index)));
    for (const target of [service.water.tile,...service.litter.map(item=>item.tile)]) if (!model.bfs(target,visitor,active).length) routeFailures.push({visitor,mask,target});
  }
  return {service,routeFailures,water:document.querySelector('#fd-water').value,cleanliness:document.querySelector('#fd-cleanliness').value};
});
if (upkeepContract.water !== 'full' || upkeepContract.cleanliness !== 'clean' || upkeepContract.service.water.tile !== 'B5' || upkeepContract.service.water.blocking !== false || upkeepContract.service.litter.map(item=>item.tile).join(',') !== 'D1,B4' || upkeepContract.service.litter.some(item=>item.blocking !== false) || upkeepContract.routeFailures.length) throw new Error(JSON.stringify({upkeepContract,issue:'upkeep state/service contract failed'}));
const fullState = await page.evaluate(() => { const art=document.querySelector('#fd-art'); return {image:art.toDataURL(),upkeep:JSON.parse(art.dataset.upkeep),draw:JSON.parse(art.dataset.coolerDraw),litter:JSON.parse(art.dataset.litterDraw)}; });
await page.selectOption('#fd-water','empty');
const emptyState = await page.evaluate(() => { const art=document.querySelector('#fd-art'); return {image:art.toDataURL(),upkeep:JSON.parse(art.dataset.upkeep),draw:JSON.parse(art.dataset.coolerDraw),hidden:art.dataset.hidden}; });
if (fullState.image === emptyState.image || fullState.upkeep.water !== 'full' || emptyState.upkeep.water !== 'empty' || fullState.litter.length || emptyState.hidden.includes('cooler') || Math.abs(fullState.draw.width-emptyState.draw.width)>.001 || Math.abs(fullState.draw.height-emptyState.draw.height)>.001 || Math.abs(fullState.draw.anchor-emptyState.draw.anchor)>.001 || Math.abs(fullState.draw.bottom-fullState.draw.anchor)>.01 || Math.abs((fullState.draw.width/fullState.draw.height)-(294/710))>.001) throw new Error(JSON.stringify({fullState:{upkeep:fullState.upkeep,draw:fullState.draw},emptyState:{upkeep:emptyState.upkeep,draw:emptyState.draw},issue:'full/empty cooler registration or visibility failed'}));
await page.selectOption('#fd-cleanliness','litter');
const litterState = await page.evaluate(() => { const art=document.querySelector('#fd-art'); return {upkeep:JSON.parse(art.dataset.upkeep),draw:JSON.parse(art.dataset.litterDraw),hidden:art.dataset.hidden}; });
if (litterState.upkeep.cleanliness !== 'litter' || litterState.upkeep.litter.length !== 2 || litterState.draw.length !== 2 || litterState.draw.some(item=>item.blocking !== false) || litterState.hidden.includes('litter-d1') || Math.abs(litterState.draw[0].w/litterState.draw[0].h-354/192)>.001 || Math.abs(litterState.draw[1].w/litterState.draw[1].h-318/192)>.001) throw new Error(JSON.stringify({litterState,issue:'litter state/aspect/nonblocking contract failed'}));
await page.getByLabel('Show floor footprints, routes, and service points').check();
const serviceMarkers = await page.evaluate(() => [...document.querySelectorAll('[data-service]')].map(el=>({id:el.dataset.service,size:parseFloat(getComputedStyle(el).fontSize)})));
if (serviceMarkers.map(item=>item.id).join(',') !== 'water,litter-d1,litter-b4' || serviceMarkers.some(item=>item.size<11)) throw new Error(JSON.stringify({serviceMarkers,issue:'service-point overlay failed'}));
await page.getByLabel('Show floor footprints, routes, and service points').uncheck();
await page.selectOption('#fd-water','full');
await page.selectOption('#fd-cleanliness','clean');
const coolerClosedPixel = await page.evaluate(() => [...document.querySelector('#fd-art').getContext('2d').getImageData(485, 50, 1, 1).data]);
await page.getByRole('button', { name: 'Toggle door at N5' }).click();
await page.getByRole('button', { name: 'Toggle door at EA' }).click();
const coolerDoorState = await page.evaluate(() => { const art=document.querySelector('#fd-art'),ctx=art.getContext('2d'); return { hidden:art.dataset.hidden, pixel:[...ctx.getImageData(485,50,1,1).data] }; });
if (coolerDoorState.hidden.includes('cooler') || coolerDoorState.pixel[2] < 180 || coolerDoorState.pixel[2] < coolerDoorState.pixel[0] + 80 || coolerDoorState.pixel[3] < 245 || coolerDoorState.pixel.some((value,index) => Math.abs(value - coolerClosedPixel[index]) > 2)) throw new Error(JSON.stringify({ coolerClosedPixel, coolerDoorState, issue: 'water cooler changed or disappeared with N5 and EA open' }));
await page.getByRole('button', { name: 'Toggle door at N5' }).click();
await page.getByRole('button', { name: 'Toggle door at EA' }).click();
for (const [id, slot] of Object.entries(shellGeometry.slots)) {
  if (id.startsWith('N') && (slot.y !== 30 || slot.h !== 80 || slot.w !== 88)) throw new Error(JSON.stringify({ id, slot, issue: 'north wall target does not match rear wall plane' }));
  if (!id.startsWith('N') && (slot.w !== 40 || slot.h !== 88 || ![50, 490].includes(slot.x) || slot.y < 110 || slot.y + slot.h > 462)) throw new Error(JSON.stringify({ id, slot, issue: 'side wall target does not align to orthogonal cap' }));
}
for (const id of Object.keys(shellGeometry.slots)) {
  const slot = shellGeometry.slots[id], target = shellGeometry.targets[id];
  const expected = { left: slot.x / 600 * shellGeometry.width, top: slot.y / 520 * shellGeometry.height, width: slot.w / 600 * shellGeometry.width, height: slot.h / 520 * shellGeometry.height };
  if (!target || Object.keys(expected).some(key => Math.abs(target[key] - expected[key]) > 1.5)) throw new Error(JSON.stringify({ id, target, expected }));
}
const closedShellPixels = await page.evaluate(() => {
  const ctx = document.querySelector('#fd-art').getContext('2d');
  const pixel = (x, y) => [...ctx.getImageData(x, y, 1, 1).data];
  return { westOutside: pixel(50, 300), eastOutside: pixel(550, 300), frontJoin: [pixel(66, 458), pixel(70, 458), pixel(510, 458), pixel(514, 458)] };
});
const isBackground = rgba => Math.abs(rgba[0] - 243) < 4 && Math.abs(rgba[1] - 234) < 4 && Math.abs(rgba[2] - 211) < 4;
if (!isBackground(closedShellPixels.westOutside) || !isBackground(closedShellPixels.eastOutside) || closedShellPixels.frontJoin.some(isBackground)) throw new Error(JSON.stringify({ closedShellPixels, issue: 'orthogonal side caps or joined south corners failed' }));
const adjacencyAudit = await page.evaluate(() => {
  const inputs = [...document.querySelectorAll('[data-adjacent]')];
  const art = document.querySelector('#fd-art');
  const ctx = art.getContext('2d');
  const pixel = (x, y) => [...ctx.getImageData(x, y, 1, 1).data];
  const background = rgba => rgba[3] === 255 && Math.abs(rgba[0] - 243) < 4 && Math.abs(rgba[1] - 234) < 4 && Math.abs(rgba[2] - 211) < 4;
  const failures = [];
  for (let mask = 0; mask < 32; mask += 1) {
    inputs.forEach((input, i) => { const wanted = Boolean(mask & (1 << i)); if (input.checked !== wanted) input.click(); });
    const active = art.dataset.adjacency ? art.dataset.adjacency.split(',') : [];
    const hidden = art.dataset.hidden ? art.dataset.hidden.split(',') : [];
    const slots = JSON.parse(art.dataset.slots);
    const expected = inputs.filter((_, i) => mask & (1 << i)).map(input => input.dataset.adjacent);
    if (active.join(',') !== expected.join(',')) failures.push({ mask, active, expected, issue: 'adjacency state' });
    if (hidden.includes('gallery') !== Boolean(mask & 0b00110)) failures.push({ mask, hidden, issue: 'gallery low-wall rule' });
    if (hidden.includes('botanical') !== Boolean(mask & 0b01000)) failures.push({ mask, hidden, issue: 'botanical low-wall rule' });
    if (hidden.includes('cabinet') || hidden.includes('cooler')) failures.push({ mask, hidden, issue: 'floor furniture hidden by adjacency' });
    for (let i = 0; i < 5; i++) {
      const id = `N${i + 1}`, low = Boolean(mask & (1 << i));
      if (slots[id].y !== (low ? 81 : 30) || slots[id].h !== (low ? 31 : 80)) failures.push({ mask, id, slot: slots[id], issue: 'dynamic north hit plane' });
      if (low && i > 0 && i < 4 && pixel(70 + i * 88 + 44, 60)[3] !== 0) failures.push({ mask, id, issue: 'neighbor-owned area above low north segment is not transparent' });
    }
    const leftLow = Boolean(mask & 1), rightLow = Boolean(mask & 16);
    if (background(pixel(60, leftLow ? 82 : 22)) || (!leftLow && background(pixel(60, 22))) || (leftLow && !background(pixel(60, 22)))) failures.push({ mask, issue: 'west side cap top does not match N1 wall height' });
    if (background(pixel(519, rightLow ? 82 : 22)) || (!rightLow && background(pixel(519, 22))) || (rightLow && !background(pixel(519, 22)))) failures.push({ mask, issue: 'east side cap top does not match N5 wall height' });
  }
  inputs.forEach(input => { if (input.checked) input.click(); });
  return failures;
});
if (adjacencyAudit.length) throw new Error(JSON.stringify(adjacencyAudit.slice(0, 5)));
await page.getByRole('button', { name: 'Toggle door at N3' }).click();
const tallNorthHeader = await page.evaluate(() => [...document.querySelector('#fd-art').getContext('2d').getImageData(290, 35, 1, 1).data]);
if (tallNorthHeader[3] !== 255 || isBackground(tallNorthHeader)) throw new Error(JSON.stringify({ tallNorthHeader, issue: 'tall north door lost its header' }));
await page.getByLabel('N3', { exact: true }).check();
const independentNorthState = await page.evaluate(() => { const art=document.querySelector('#fd-art'),ctx=art.getContext('2d'),pixel=(x,y)=>[...ctx.getImageData(x,y,1,1).data]; return { openings: art.dataset.openings, adjacency: art.dataset.adjacency, hidden: art.dataset.hidden, aboveBoundary: pixel(290,60), headerAir: pixel(290,76), aperture: pixel(290,90), leftJamb: pixel(253,90) }; });
if (!independentNorthState.openings.includes('N3') || independentNorthState.adjacency !== 'N3' || !independentNorthState.hidden.includes('gallery') || independentNorthState.aboveBoundary[3] !== 0 || independentNorthState.headerAir[3] !== 0 || independentNorthState.aperture[3] !== 0 || independentNorthState.leftJamb[3] !== 255 || isBackground(independentNorthState.leftJamb)) throw new Error(JSON.stringify({ independentNorthState, issue: 'low north doorway must expose transparent neighbor space between opaque side jambs, with no header' }));
await page.getByLabel('N3', { exact: true }).uncheck();
await page.getByRole('button', { name: 'Toggle door at N3' }).click();
await page.getByRole('button', { name: 'Toggle door at WB' }).click();
const sideBreak = await page.evaluate(() => { const ctx=document.querySelector('#fd-art').getContext('2d'),pixel=(x,y)=>[...ctx.getImageData(x,y,1,1).data],alphaColumns=(from,to,y)=>Array.from({length:to-from},(_,i)=>pixel(from+i,y)[3]); return { outerHalf:pixel(61,242), innerHalf:pixel(68,242), copiedSource:pixel(73,242), outerColumns:alphaColumns(58,65,242), innerColumns:alphaColumns(65,72,242), jamb:pixel(65,207), outsideMid:pixel(54,242) }; });
if (sideBreak.outerColumns.some(alpha => alpha !== 0) || sideBreak.innerColumns.some(alpha => alpha !== 255) || sideBreak.outerHalf[3] !== 0 || sideBreak.innerHalf[3] !== 255 || sideBreak.innerHalf.some((value, index) => value !== sideBreak.copiedSource[index]) || sideBreak.jamb[3] !== 255 || isBackground(sideBreak.jamb) || !isBackground(sideBreak.outsideMid)) throw new Error(JSON.stringify({ sideBreak, issue: 'west doorway must split every cap column at its midpoint: transparent neighbor half, copied current-room floor half, opaque jamb stripes' }));
await page.getByRole('button', { name: 'Toggle door at WB' }).click();
await page.getByRole('button', { name: 'Wall door N1' }).click();
const directWallState = await page.evaluate(() => ({ art: document.querySelector('#fd-art').dataset.openings, compact: [...document.querySelectorAll('#fd-north [data-segment="N1"]')].every(el => el.getAttribute('aria-pressed') === 'true') }));
if (!directWallState.art.includes('N1') || !directWallState.compact) throw new Error('direct wall target did not update the shared model');
await page.getByRole('button', { name: 'Wall door N1' }).click();
await page.getByLabel('Show floor footprints, routes, and service points').check();
const geometry = await page.evaluate(() => {
  const box = selector => { const rect = document.querySelector(selector).getBoundingClientRect(); return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom }; };
  return { desk: box('[data-solid="desk"]'), c2: box('[data-cell="C2"]'), c3: box('[data-cell="C3"]'), reception: box('[data-solid="reception"]'), b2: box('[data-cell="B2"]'), visitor: box('[data-solid="visitor"]'), d5: box('[data-cell="D5"]'), columns: getComputedStyle(document.querySelector('#fd-map')).gridTemplateColumns.split(' ').length, footprint: window.__frontDeskLayout.footprint, draw: JSON.parse(document.querySelector('#fd-art').dataset.deskDraw), cooler: JSON.parse(document.querySelector('#fd-art').dataset.coolerDraw), cabinet: JSON.parse(document.querySelector('#fd-art').dataset.cabinetDraw) };
});
if (geometry.columns !== 5 || geometry.desk.left !== geometry.c2.left || geometry.desk.right !== geometry.c3.right || geometry.desk.top !== geometry.c2.top || geometry.desk.bottom !== geometry.c2.bottom || geometry.reception.left !== geometry.b2.left || geometry.reception.right !== geometry.b2.right || geometry.visitor.left !== geometry.d5.left || geometry.visitor.right !== geometry.d5.right) throw new Error(JSON.stringify({ geometry }));
const deskAspectError = Math.abs((geometry.draw.width / geometry.draw.height) / geometry.footprint.desk.source.aspect - 1);
if (geometry.footprint.desk.col !== 1 || geometry.footprint.desk.row !== 2 || geometry.footprint.desk.w !== 2 || geometry.footprint.desk.h !== 1 || deskAspectError > 0.02 || Math.abs(geometry.draw.baseLeft - 158) > .01 || Math.abs(geometry.draw.baseRight - 334) > .01 || Math.abs(geometry.draw.baseBottom - 374) > .01 || geometry.draw.order !== 'reception,desk') throw new Error(JSON.stringify({ geometry, deskAspectError }));
if (Math.abs(geometry.cooler.bottom - geometry.cooler.anchor) > .01 || Math.abs((geometry.cooler.width / geometry.cooler.height) / geometry.cooler.aspect - 1) > .02 || geometry.cooler.y < 0 || geometry.cooler.floor.x < 0 || geometry.cooler.floor.y < 0 || geometry.cooler.floor.x + geometry.cooler.floor.width > 440 || geometry.cooler.floor.y + geometry.cooler.floor.height > 88 || Math.abs(geometry.cooler.floor.x + geometry.cooler.floor.width - 436) > .02) throw new Error(JSON.stringify({ cooler: geometry.cooler }));
if (Math.abs(geometry.cabinet.bottom - geometry.cabinet.anchor) > .01 || Math.abs((geometry.cabinet.width / geometry.cabinet.height) / geometry.cabinet.aspect - 1) > .02 || geometry.cabinet.anchor !== geometry.cooler.anchor || geometry.cabinet.y < 0 || geometry.cabinet.floor.x < 0 || geometry.cabinet.floor.y < 0 || geometry.cabinet.floor.x + geometry.cabinet.floor.width > 88 || geometry.cabinet.floor.y + geometry.cabinet.floor.height > 88) throw new Error(JSON.stringify({ cabinet: geometry.cabinet }));
await page.getByRole('button', { name: 'Toggle door at N2' }).focus();
await page.keyboard.press('Enter');
await page.getByRole('button', { name: 'Toggle door at N1' }).click();
await page.selectOption('#fd-visitor', 'D2');
const controlState = await page.evaluate(() => ({ n2: document.querySelector('[data-segment="N2"]').getAttribute('aria-pressed'), n1: document.querySelector('[data-segment="N1"]').getAttribute('aria-pressed'), gallery: document.querySelector('[data-optional="gallery"]').classList.contains('fd-hidden'), cabinet: document.querySelector('[data-optional="cabinet"]').classList.contains('fd-hidden'), northGap: document.querySelector('[data-cell="A2"]').classList.contains('door-north'), artOpenings: document.querySelector('#fd-art').dataset.openings, status: document.querySelector('#fd-status').textContent }));
if (controlState.n2 !== 'true' || controlState.n1 !== 'true' || !controlState.gallery || !controlState.cabinet || !controlState.northGap || !controlState.artOpenings.includes('N2') || !controlState.artOpenings.includes('N1') || !controlState.status.includes('N1')) throw new Error('interactive controls did not update the shared layout/art model');
await page.getByRole('button', { name: 'Toggle door at N2' }).click();
const compoundState = await page.evaluate(() => ({ gallery: document.querySelector('[data-optional="gallery"]').classList.contains('fd-hidden'), cabinet: document.querySelector('[data-optional="cabinet"]').classList.contains('fd-hidden') }));
if (compoundState.gallery || !compoundState.cabinet) throw new Error('whole-group hide restoration did not preserve a remaining conflict');
await page.getByRole('button', { name: 'Toggle door at N1' }).click();
if (await page.locator('[data-optional="cabinet"]').evaluate(el => el.classList.contains('fd-hidden'))) throw new Error('optional group did not restore after all conflicts cleared');
await page.selectOption('#fd-visitor', 'D5');
await page.getByRole('button', { name: 'Toggle door at ED' }).click();
const edStay = await page.evaluate(() => ({ visitor: Boolean(document.querySelector('[data-solid="visitor"]')), d5Route: window.__frontDeskLayout.bfs('D5', 'D5', new Set(['ED'])).length, art: document.querySelector('#fd-art').dataset.openings, pixels: document.querySelector('#fd-art').getContext('2d').getImageData(0, 0, 600, 480).data.some(value => value !== 0) }));
if (!edStay.visitor || !edStay.d5Route || !edStay.art.includes('ED') || !edStay.pixels) throw new Error('D5 ED stay comparison or atlas art rendering failed');
await page.selectOption('#fd-ed-chair', 'hide');
if (await page.locator('[data-solid="visitor"]').count()) throw new Error('D5 ED hide comparison did not hide the visitor presentation');
if (!(await page.evaluate(() => window.__frontDeskLayout.bfs('D5', 'D5', new Set(['ED'])).length))) throw new Error('D5 traversal changed when only the ED presentation option changed');
await page.selectOption('#fd-ed-chair', 'stay');
await page.getByRole('button', { name: 'Toggle door at ED' }).click();
const artChecks = await page.evaluate(() => {
  const art = document.querySelector('#fd-art');
  const baseline = art.toDataURL();
  const ctx = art.getContext('2d');
  const results = {};
  for (const id of window.__frontDeskLayout.segments) {
    document.querySelector(`[data-segment="${id}"]`).click();
    const i = id.startsWith('N') ? Number(id.slice(1)) - 1 : ['A','B','C','D'].indexOf(id.slice(1));
    const y = 110 + i * 88 + 44;
    const samples = id.startsWith('N')
      ? { neighbor: [70 + i * 88 + 44, 70] }
      : id.startsWith('W')
        ? { neighbor: [61, y], room: [68, y], source: [73, y] }
        : { neighbor: [519, y], room: [512, y], source: [507, y] };
    const alphaColumns = id.startsWith('N') ? null : id.startsWith('W')
      ? { neighbor: Array.from({length:7},(_,x)=>ctx.getImageData(58+x,y,1,1).data[3]), room: Array.from({length:7},(_,x)=>ctx.getImageData(65+x,y,1,1).data[3]) }
      : { room: Array.from({length:7},(_,x)=>ctx.getImageData(508+x,y,1,1).data[3]), neighbor: Array.from({length:7},(_,x)=>ctx.getImageData(515+x,y,1,1).data[3]) };
    results[id] = { changed: art.toDataURL() !== baseline, openings: art.dataset.openings, hidden: art.dataset.hidden, pixels: Object.fromEntries(Object.entries(samples).map(([name, sample]) => [name, [...ctx.getImageData(sample[0], sample[1], 1, 1).data]])), alphaColumns };
    document.querySelector(`[data-segment="${id}"]`).click();
  }
  return results;
});
for (const id of Object.keys(artChecks)) if (!artChecks[id].changed || !artChecks[id].openings.includes(id)) throw new Error(`art aperture did not change for ${id}`);
for (const [id, check] of Object.entries(artChecks)) {
  if (check.pixels.neighbor[3] !== 0) throw new Error(JSON.stringify({ id, pixels: check.pixels, issue: 'neighbor-owned aperture half is not transparent' }));
  if (!id.startsWith('N') && (check.alphaColumns.neighbor.some(alpha => alpha !== 0) || check.alphaColumns.room.some(alpha => alpha !== 255) || check.pixels.room[3] !== 255 || check.pixels.room.some((value, index) => value !== check.pixels.source[index]))) throw new Error(JSON.stringify({ id, pixels: check.pixels, alphaColumns: check.alphaColumns, issue: 'side aperture must keep every outer-half column transparent and every inner-half column as continued room floor texture' }));
}
for (const [id, group] of [['N2', 'gallery'], ['N1', 'cabinet'], ['N4', 'botanical'], ['WC', 'ficus']]) if (!artChecks[id].hidden.includes(group)) throw new Error(`art decor group did not hide for ${id}`);
for (const id of ['N5','EA']) if (artChecks[id].hidden.includes('cooler')) throw new Error(`permanent water cooler hid for ${id}`);
await mkdir(evidence, { recursive: true });
await page.screenshot({ path: path.join(evidence, 'front-desk-layout-desktop.png'), fullPage: true });
await page.setViewportSize({ width: 360, height: 840 });
await page.screenshot({ path: path.join(evidence, 'front-desk-layout-narrow.png'), fullPage: true });
await page.setViewportSize({ width: 320, height: 840 });
await page.screenshot({ path: path.join(evidence, 'front-desk-layout-320.png'), fullPage: true });
const narrow = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > window.innerWidth, doorControls: [...document.querySelectorAll('#fd-north [data-segment],#fd-west [data-segment],#fd-east [data-segment]')].filter(button => button.getBoundingClientRect().width > 0).length, adjacencyControls: [...document.querySelectorAll('[data-adjacent]')].filter(input => input.getBoundingClientRect().width > 0).length }));
if (narrow.overflow || narrow.doorControls !== 13 || narrow.adjacencyControls !== 5 || pageErrors.length) throw new Error(JSON.stringify({ narrow, pageErrors }));
await browser.close();
console.log(`PASS 49152 mask/chair/mode states with permanent nonblocking full/empty cooler; clean/litter states; B5 + D1/B4 service routes; 32 north-adjacency states; 13 transparent half-owned door apertures; keyboard/click/select controls; desktop/320`);
