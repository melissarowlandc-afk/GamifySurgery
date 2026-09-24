const { chromium } = require('playwright');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const proofs = {
  frontDesk: 'tools/room-design/furniture-revision-2026-09-22/front-desk-candidate.html',
  examination: 'tools/room-design/examination-layout/examination-layout.html',
  hallway: 'tools/room-design/hallway-layout/hallway-layout.html',
  waiting: 'tools/room-design/waiting-layout/waiting-layout.html',
  bathroom: 'tools/room-design/bathroom-layout/bathroom-layout.html',
  minorProcedure: 'tools/room-design/minor-procedure-layout/minor-procedure-layout.html',
  ultrasound: 'tools/room-design/ultrasound-layout/ultrasound-layout.html',
  xray: 'tools/room-design/furniture-revision-2026-09-22/xray-candidate.html',
  ct: 'tools/room-design/furniture-revision-2026-09-22/ct-candidate.html',
  phlebotomy: 'tools/room-design/phlebotomy-layout/phlebotomy-layout.html',
  evs: 'tools/room-design/evs-layout/evs-layout.html',
  endoscopy: 'tools/room-design/furniture-revision-2026-09-22/endoscopy-candidate.html',
  recovery: 'tools/room-design/recovery-layout/recovery-layout.html',
  training: 'tools/room-design/training-layout/training-layout.html',
  coffee: 'tools/room-design/coffee-kiosk-layout/coffee-kiosk-layout.html',
  telehealth: 'tools/room-design/telehealth-layout/telehealth-layout.html',
};
const coordinateSpaces = {
  frontDesk: [[70, 110, 88]], examination: [[120, 140, 120], [180, 140, 120]], hallway: [[0, 0, 120]],
  waiting: [[120, 230, 120], [180, 230, 120]], bathroom: [[60, 130, 120]], minorProcedure: [[60, 130, 120]],
  ultrasound: [[60, 130, 120]], xray: [[60, 130, 120]], ct: [[54, 136, 120]], phlebotomy: [[60, 130, 120], [120, 130, 120]],
  evs: [[60, 130, 120]], endoscopy: [[60, 130, 120], [120, 130, 120]], recovery: [[60, 130, 120]],
  training: [[90, 150, 120]], coffee: [[150, 150, 120]], telehealth: [[60, 130, 120], [120, 130, 120]],
};
const presentationKeys = new Set([
  'model', 'fixtures', 'table', 'surface', 'shell', 'cooler-draw', 'cabinet-draw',
  'desk-draw', 'litter-draw', 'upkeep', 'navigation-blocker', 'south-passage',
]);

(async () => {
  const provenance = JSON.parse(fs.readFileSync(path.join(root, 'apps/player/public/art/rooms/gs015-v1/provenance.json'), 'utf8'));
  const assetByHash = new Map(provenance.records.map(record => [record.sha256, `gs015:${record.output.replace(/\.webp$/, '').replaceAll('/', ':')}`]));
  const normalizeDraws = (draws, canvasId) => {
    const seen = new Set();
    return draws.map(draw => {
      const match = /^data:image\/(?:webp|png);base64,(.+)$/.exec(draw.src.url || '');
      const sha256 = match ? crypto.createHash('sha256').update(Buffer.from(match[1], 'base64')).digest('hex').toUpperCase() : undefined;
      return { ...draw, src: { kind: draw.src.kind, width: draw.src.width, height: draw.src.height, sha256, assetId: sha256 ? assetByHash.get(sha256) : undefined } };
    }).filter(draw => {
      if (draw.canvas !== canvasId || draw.src.width <= 0 || draw.src.height <= 0) return false;
      if (draw.src.assetId) return true;
      if (draw.src.kind === 'canvas' || (draw.src.width === 256 && draw.src.height === 768)) return false;
      throw new Error(`Unrecognized image source ${draw.src.width}x${draw.src.height} on ${canvasId}`);
    }).filter(draw => {
      const key = JSON.stringify([draw.src.assetId, draw.args, draw.transform]);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
  const browser = await chromium.launch({ headless: true, executablePath: process.env.GS015_CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const rooms = {};
  for (const [id, file] of Object.entries(proofs)) {
    const page = await browser.newPage();
    await page.addInitScript(() => {
      window.__drawImages = [];
      const original = CanvasRenderingContext2D.prototype.drawImage;
      CanvasRenderingContext2D.prototype.drawImage = function(image, ...args) {
        const src = image instanceof HTMLImageElement ? { kind: 'image', width: image.naturalWidth, height: image.naturalHeight, url: image.currentSrc || image.src } : { kind: 'canvas', width: image.width, height: image.height, url: '' };
        const matrix = this.getTransform();
        window.__drawImages.push({ canvas: this.canvas.id, src, transform: [matrix.a, matrix.b, matrix.c, matrix.d, matrix.e, matrix.f], args });
        return original.call(this, image, ...args);
      };
    });
    await page.goto(`file:///${path.join(root, file).replaceAll('\\', '/')}`);
    await page.waitForFunction(() => Object.entries(window).some(([key, value]) => key.startsWith('__') && value && typeof value === 'object' && ((typeof value.ready === 'function' && value.ready()) || (typeof value.atlasReady === 'function' && value.atlasReady()))));
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const orientations = [];
    const candidates = await page.locator('select').evaluateAll(selects => selects.map((s, index) => ({ index, values: [...s.options].map(o => o.value) })).filter(s => s.values.some(v => ['south', 'west', 'east', '0', '90'].includes(v))));
    const states = candidates.length ? candidates[0].values.filter(v => ['south', 'west', 'east', '0', '90'].includes(v)) : ['default'];
    for (const state of states) {
      await page.evaluate(() => { window.__drawImages.splice(0); });
      if (state !== 'default') {
        await page.locator('select').nth(candidates[0].index).selectOption(state);
        await page.waitForTimeout(50);
      } else {
        await page.evaluate(() => {
          const proof = Object.entries(window).find(([key, value]) => key.startsWith('__') && value && typeof value === 'object' && (typeof value.render === 'function' || typeof value.draw === 'function'))?.[1];
          (proof.render || proof.draw).call(proof);
        });
      }
      const capture = await page.locator('canvas').first().evaluate((canvas, state) => ({ state, canvasId: canvas.id, dataset: Object.fromEntries([...canvas.attributes].filter(a => a.name.startsWith('data-')).map(a => [a.name.slice(5), a.value])), drawImages: window.__drawImages.splice(0) }), state);
      if (id === 'endoscopy') {
        await page.evaluate(() => { window.__drawImages.splice(0); window.__endoscopyProof.state.duringProcedure = true; window.__endoscopyProof.render(); });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
        const variant = await page.locator('canvas').first().evaluate(canvas => ({ dataset: Object.fromEntries([...canvas.attributes].filter(a => a.name.startsWith('data-')).map(a => [a.name.slice(5), a.value])), drawImages: window.__drawImages.splice(0) }));
        for (const [key, value] of Object.entries(variant.dataset)) { try { variant.dataset[key] = JSON.parse(value); } catch {} }
        capture.variants = { occupiedCovered: { dataset: variant.dataset, drawImages: normalizeDraws(variant.drawImages, capture.canvasId) } };
        await page.evaluate(() => { window.__drawImages.splice(0); window.__endoscopyProof.state.duringProcedure = false; window.__endoscopyProof.render(); window.__drawImages.splice(0); });
      }
      if (id === 'frontDesk') {
        capture.variants = {};
        await page.evaluate(() => { window.__drawImages.splice(0); window.__frontDeskLayout.state.water = 'empty'; window.__frontDeskLayout.render(); });
        capture.variants.emptyWater = await page.locator('canvas').first().evaluate(canvas => ({ drawImages: window.__drawImages.splice(0) }));
        capture.variants.emptyWater.drawImages = normalizeDraws(capture.variants.emptyWater.drawImages, capture.canvasId);
        await page.evaluate(() => { window.__drawImages.splice(0); const p = window.__frontDeskLayout; p.state.water = 'full'; p.state.selected.add('ED'); p.state.edChair = 'hide'; p.render(); });
        capture.variants.visitorEdHidden = await page.locator('canvas').first().evaluate(canvas => ({ drawImages: window.__drawImages.splice(0) }));
        capture.variants.visitorEdHidden.drawImages = normalizeDraws(capture.variants.visitorEdHidden.drawImages, capture.canvasId);
        await page.evaluate(() => { window.__drawImages.splice(0); const p = window.__frontDeskLayout; p.state.selected.clear(); p.state.edChair = 'stay'; p.render(); window.__drawImages.splice(0); });
      }
      for (const [key, value] of Object.entries(capture.dataset)) {
        if (!presentationKeys.has(key)) { delete capture.dataset[key]; continue; }
        try { capture.dataset[key] = JSON.parse(value); } catch { /* comma lists remain strings */ }
      }
      if (capture.dataset.model) {
        const model = capture.dataset.model;
        const keep = new Set(['orientation', 'dimensions', 'logicalCols', 'logicalRows', 'tileSize', 'segments', 'worldSegments', 'worldToLocal', 'fixtures', 'contracts', 'wallDecor', 'draws', 'stationDraw', 'chairs', 'plants', 'drawOrder', 'shell', 'bench', 'stools', 'island', 'bays', 'station', 'partitions', 'artAssignments', 'wallArtPlacements', 'replacementContract', 'tableState', 'scaleContract']);
        for (const key of Object.keys(model)) if (!keep.has(key)) delete model[key];
      }
      capture.drawImages = normalizeDraws(capture.drawImages, capture.canvasId);
      const [originX, originY, tilePixels] = coordinateSpaces[id][orientations.length];
      capture.coordinateSpace = { floorOriginPixels: [originX, originY], tilePixels };
      orientations.push(capture);
    }
    const bytes = fs.readFileSync(path.join(root, file));
    rooms[id] = { proofPath: file, proofSha256: crypto.createHash('sha256').update(bytes).digest('hex').toUpperCase(), orientations };
    await page.close();
  }
  await browser.close();
  const output = {
    schemaVersion: 1,
    approvalStatus: 'owner-approved-for-runtime',
    approvalDate: '2026-09-24',
    coordinateContract: 'Dataset fixture geometry is room-local tiles. drawImage args are exact proof-canvas pixels in CanvasRenderingContext2D order; 9-argument calls include source crop followed by destination envelope.',
    rooms,
  };
  const destination = path.join(root, 'apps/player/src/facility/approvedRoomProofData.json');
  fs.writeFileSync(destination, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Exported exact proof draw data for ${Object.keys(rooms).length} approved rooms.`);
})();
