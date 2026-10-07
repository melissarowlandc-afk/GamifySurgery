const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { chromium } = require('@playwright/test');

const here = __dirname;
const contract = JSON.parse(fs.readFileSync(path.join(here, 'asset-contract.json'), 'utf8'));
const seats = JSON.parse(fs.readFileSync(path.join(here, '../layout-study/seat-sources.json'), 'utf8'));
const out = path.join(here, 'processed-assets');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
fs.mkdirSync(out, { recursive: true });

const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const abs = file => path.resolve(here, file);
const url = file => `data:image/${path.extname(file).slice(1)};base64,${fs.readFileSync(file).toString('base64')}`;
const tasks = [
  { id: 'island', source: contract.sources.island.file, ...contract.packing.island },
  ...Object.entries(contract.packing.chairs).map(([id, spec]) => ({ id: `chair-${id}`, source: contract.sources.chairs.file, ...spec })),
];

(async () => {
  for (const [id, source] of Object.entries(contract.sources)) {
    const file = abs(source.file);
    if (!fs.existsSync(file)) throw new Error(`Missing ${id}: ${file}`);
    if (sha(file) !== source.sha256) throw new Error(`${id} source hash changed`);
  }
  const browser = await chromium.launch({ headless: true, executablePath: chrome });
  const page = await browser.newPage();
  const specs = {};
  for (const task of tasks) {
    const source = abs(task.source);
    const result = await page.evaluate(async input => {
      const image = new Image(); image.src = input.src; await image.decode();
      const sourceCanvas = document.createElement('canvas'); sourceCanvas.width = image.naturalWidth; sourceCanvas.height = image.naturalHeight;
      const sg = sourceCanvas.getContext('2d', { willReadFrequently: true }); sg.drawImage(image, 0, 0);
      const sourceImage = sg.getImageData(0, 0, sourceCanvas.width, sourceCanvas.height); const rgba = sourceImage.data;
      const index = (x, y) => y * sourceCanvas.width + x; const alpha = i => rgba[i * 4 + 3];
      const kept = new Uint8Array(sourceCanvas.width * sourceCanvas.height), seen = new Uint8Array(kept.length), stack = [index(input.seed[0], input.seed[1])]; seen[stack[0]] = 1;
      while (stack.length) { const i = stack.pop(); if (alpha(i) < 160) continue; kept[i] = 1; const x = i % sourceCanvas.width, y = Math.floor(i / sourceCanvas.width); const n = []; if (x) n.push(i - 1); if (x + 1 < sourceCanvas.width) n.push(i + 1); if (y) n.push(i - sourceCanvas.width); if (y + 1 < sourceCanvas.height) n.push(i + sourceCanvas.width); for (const q of n) if (!seen[q]) { seen[q] = 1; stack.push(q); } }
      const ring = kept.slice();
      for (let y = 1; y + 1 < sourceCanvas.height; y++) for (let x = 1; x + 1 < sourceCanvas.width; x++) { const i = index(x, y); if (!kept[i] && alpha(i) > 0 && (kept[i - 1] || kept[i + 1] || kept[i - sourceCanvas.width] || kept[i + sourceCanvas.width])) ring[i] = 1; }
      const [cx, cy, cw, ch] = input.crop; const canvas = document.createElement('canvas'); canvas.width = cw; canvas.height = ch; const g = canvas.getContext('2d'); const output = g.createImageData(cw, ch);
      let keptPixels = 0;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) { const si = index(cx + x, cy + y), di = (y * cw + x) * 4; if (!ring[si]) continue; output.data[di] = rgba[si * 4]; output.data[di + 1] = rgba[si * 4 + 1]; output.data[di + 2] = rgba[si * 4 + 2]; output.data[di + 3] = rgba[si * 4 + 3]; keptPixels++; }
      g.putImageData(output, 0, 0);
      return { data: canvas.toDataURL('image/webp', .94).split(',')[1], keptPixels };
    }, { src: url(source), seed: task.seed, crop: task.crop });
    const file = `${task.id}.webp`; fs.writeFileSync(path.join(out, file), Buffer.from(result.data, 'base64'));
    const spec = { file, width: task.crop[2], height: task.crop[3], crop: task.crop, anchor: [task.sourceAnchor[0] - task.crop[0], task.sourceAnchor[1] - task.crop[1]], renderScale: task.renderScale, keptPixels: result.keptPixels, sourceSha256: sha(source) };
    if (task.id === 'island') Object.assign(spec, { worktopRisePixels: 80, worldGround: task.worldGround, nativeWorktopRise: task.nativeWorktopRise });
    else Object.assign(spec, { facing: task.facing, seatRisePixels: 45, sourceSeatY: task.sourceSeatY });
    specs[task.id] = spec;
  }
  for (const [seat, source] of Object.entries(seats.seats)) {
    const file = path.resolve(here, '../../../../../apps/player/public', source.asset);
    if (sha(file) !== source.sha256.toUpperCase()) throw new Error(`${seat} actor hash changed`);
    const renderedWidthPixels = Math.round(127.78745644599302 * source.identityScale), scale = renderedWidthPixels / 160;
    const data = await page.evaluate(async src => { const image = new Image(); image.src = src; await image.decode(); const canvas = document.createElement('canvas'); canvas.width = 160; canvas.height = 320; canvas.getContext('2d').drawImage(image, 0, 0); return canvas.toDataURL('image/webp', .94).split(',')[1]; }, url(file));
    const id = `actor-${seat}`, outFile = `${id}.webp`; fs.writeFileSync(path.join(out, outFile), Buffer.from(data, 'base64'));
    specs[id] = { file: outFile, width: 160, height: 320, anchor: [source.anchors.bodyAxisX, source.anchors.floorY], renderScale: scale, renderedWidthPixels, identityScale: source.identityScale, identity: source.identity, facing: source.facing, seatContactY: source.anchors.seatContactY, sourceSha256: sha(file) };
  }
  await browser.close();
  fs.writeFileSync(path.join(out, 'metadata.json'), JSON.stringify({ revision: contract.revision, specs }, null, 2) + '\n');
  console.log(`PASS prepared ${Object.keys(specs).length} assets`);
})().catch(error => { console.error(error.stack || error); process.exit(1); });
