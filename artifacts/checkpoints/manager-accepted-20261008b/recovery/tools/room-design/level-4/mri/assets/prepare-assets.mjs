// Technical preparation only: preserve originals; crop, uniformly scale and pack.
// Uses the installed browser Canvas implementation, no installed image dependency.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('@playwright/test');
const here = path.dirname(fileURLToPath(import.meta.url));
const contractPath = path.resolve(here, '../proof/asset-contract.json');
const contract = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
const manifestPath = path.join(here, 'generation-manifest.json');
const totalAssets = Object.keys(contract.assets).length;
const partial = process.argv.includes('--partial');
const manifest = fs.existsSync(manifestPath) ? JSON.parse(fs.readFileSync(manifestPath, 'utf8')) : { assets: [] };
const manifestInputSha256 = fs.existsSync(manifestPath) ? crypto.createHash('sha256').update(fs.readFileSync(manifestPath)).digest('hex').toUpperCase() : null;
const entries = Array.isArray(manifest.assets) ? manifest.assets : Object.entries(manifest.assets || {}).map(([id, value]) => ({ id, ...value }));
const destinationOut = path.join(here, 'prepared');
const out = path.join(destinationOut, '.packing-stage');
if (!path.resolve(out).startsWith(path.resolve(destinationOut)+path.sep)) throw new Error('Packing stage escaped owned prepared directory');
if (fs.existsSync(out)) fs.rmSync(out, { recursive: true });
fs.mkdirSync(out, { recursive: true });
const sha = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').toUpperCase();
const asDataUrl = file => `data:image/png;base64,${fs.readFileSync(file).toString('base64')}`;
const results = {}, missing = [], notes = [];
const tasks = [];
for (const [id, spec] of Object.entries(contract.assets)) {
  const entry = entries.find(x => x.id === id);
  if (!entry?.file || !fs.existsSync(path.resolve(here, entry.file))) { missing.push(id); continue; }
  const source = path.resolve(here, entry.file);
  if (!source.startsWith(path.join(here, 'originals') + path.sep)) throw new Error(`${id} source must be in assets/originals`);
  const sourceHash = sha(source);
  if (entry.sha256 && sourceHash !== entry.sha256.toUpperCase()) throw new Error(`${id} original hash mismatch`);
  tasks.push({ id, spec, entry, source, sourceHash });
}
if (missing.length && !partial) throw new Error(`Missing source originals: ${missing.join(', ')}. Use --partial only for an explicitly incomplete candidate.`);
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const page = await browser.newPage();
try {
  for (const task of tasks) {
    const requestedCalibration = contract.sourceCalibration[task.id] || {};
    const calibration = requestedCalibration.sourceFile && requestedCalibration.sourceFile !== task.entry.file ? {} : requestedCalibration;
    const result = await page.evaluate(async input => {
      const im = new Image(); im.src = input.source; await im.decode();
      const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
      const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0);
      const rgba = g.getImageData(0, 0, c.width, c.height).data;
      function bounds(threshold) {
        let l = c.width, t = c.height, r = -1, b = -1, count = 0;
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) if (rgba[(y * c.width + x) * 4 + 3] >= threshold) {
          l = Math.min(l, x); t = Math.min(t, y); r = Math.max(r, x); b = Math.max(b, y); count++;
        }
        return count ? { left: l, top: t, width: r - l + 1, height: b - t + 1, pixels: count } : null;
      }
      const visible = bounds(input.threshold), opaque = bounds(input.opaqueThreshold), allAlpha = bounds(1);
      if (!visible || !opaque) throw new Error('No sufficiently opaque source art');
      const crop = input.calibration.crop || [visible.left, visible.top, visible.width, visible.height];
      const [W, H] = input.canvas, m = input.margin;
      const fitScale = Math.min((W - 2 * m) / crop[2], (H - 2 * m) / crop[3]);
      const scale = input.calibration.scale ?? fitScale * (input.calibration.uniformScaleFactor ?? 1);
      if (!(scale > 0)) throw new Error('Packing scale must be positive');
      if (scale > fitScale + 1e-8) throw new Error('Calibrated scale does not fit the requested canvas without cropping');
      const dw = crop[2] * scale, dh = crop[3] * scale;
      const destination = [(W - dw) / 2, H - m - dh, dw, dh];
      const p = document.createElement('canvas'); p.width = W; p.height = H;
      const pg = p.getContext('2d', { willReadFrequently: true }); pg.imageSmoothingEnabled = true; pg.imageSmoothingQuality = 'high';
      pg.drawImage(im, ...crop, ...destination);
      const image = pg.getImageData(0, 0, W, H), pixels = image.data;
      let transparent = 0, opaqueCount = 0, edgeAlphaMax = 0, alphaMin = 255, alphaMax = 0;
      let l = W, t = H, r = -1, b = -1, opaqueBottom = -1, al = W, at = H, ar = -1, ab = -1;
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const a = pixels[(y * W + x) * 4 + 3]; alphaMin = Math.min(alphaMin, a); alphaMax = Math.max(alphaMax, a);
        if (!a) transparent++; if (a >= input.opaqueThreshold) { opaqueCount++; opaqueBottom = Math.max(opaqueBottom, y); }
        if (a >= input.threshold) { l = Math.min(l, x); t = Math.min(t, y); r = Math.max(r, x); b = Math.max(b, y); }
        if (a) { al = Math.min(al, x); at = Math.min(at, y); ar = Math.max(ar, x); ab = Math.max(ab, y); }
        if (!x || !y || x === W - 1 || y === H - 1) edgeAlphaMax = Math.max(edgeAlphaMax, a);
      }
      const mapped = Object.fromEntries(Object.entries(input.calibration.points || {}).map(([id, xy]) => [id, [destination[0] + (xy[0] - crop[0]) * scale, destination[1] + (xy[1] - crop[1]) * scale]]));
      return {
        png: p.toDataURL('image/png').split(',')[1], sourceSize: [c.width, c.height], sourceAlphaBounds: allAlpha, sourceVisibleBounds: visible,
        sourceOpaqueBounds: opaque, crop, scale, fitScale, destination, calibratedPoints: mapped,
        outputVisibleBounds: { left: l, top: t, width: r - l + 1, height: b - t + 1 },
        outputAllAlphaBounds: { left: al, top: at, width: ar - al + 1, height: ab - at + 1 },
        alphaClearancePixels: { left: al, top: at, right: W - 1 - ar, bottom: H - 1 - ab },
        uniformContactCalibration: { factorRelativeToMaximumFit: scale / fitScale, note: input.calibration.packingNote ?? 'Maximum uniform fit inside the exact canvas' },
        alpha: { transparent, opaque: opaqueCount, min: alphaMin, max: alphaMax, edgeAlphaMax }, opaqueBottom,
        aspectPreserved: true, discardedByCrop: allAlpha ? crop[0] > allAlpha.left || crop[1] > allAlpha.top || crop[0] + crop[2] < allAlpha.left + allAlpha.width || crop[1] + crop[3] < allAlpha.top + allAlpha.height : false
      };
    }, { source: asDataUrl(task.source), canvas: task.spec.canvas, margin: contract.marginPixels, threshold: contract.alphaBoundsThreshold, opaqueThreshold: contract.opaqueThreshold, calibration });
    const file = path.join(out, `${task.id}.png`);
    fs.writeFileSync(file, Buffer.from(result.png, 'base64')); delete result.png;
    const canvas = task.spec.canvas;
    const expected = task.spec.expectedSeatRiseNativePixels ?? task.spec.expectedWorktopRiseNativePixels ?? task.spec.expectedCouchRiseNativePixels ?? task.spec.expectedBoreRiseNativePixels;
    const point = result.calibratedPoints.seat ?? result.calibratedPoints.worktop ?? result.calibratedPoints.couchTop ?? result.calibratedPoints.bore;
    const groundAnchorY = task.spec.top ? 0 : result.opaqueBottom + 1;
    const measuredRise = point ? groundAnchorY - point[1] : null;
    const warnings = [];
    if (expected && !point) warnings.push('Contact/bore source point not calibrated; height standard unverified.');
    if (expected && point && Math.abs(measuredRise - expected) > 3) warnings.push(`Measured rise ${measuredRise.toFixed(2)} native px differs from ${expected}px target.`);
    // Opaque foot edge supplies the physical contact. Canvas padding must never
    // masquerade as a world ground point or leave the sprite floating.
    if (task.id === 'gantry-side' && result.sourceVisibleBounds.width > result.sourceVisibleBounds.height) warnings.push('Landscape long-magnet silhouette packed without stretching inside the portrait brief canvas; owner reconciliation required.');
    const proofScale = task.spec.widthTiles * 120 / canvas[0];
    results[task.id] = { id: task.id, status: 'candidate_needs_owner_review', file: `${task.id}.png`, canvas, widthTiles: task.spec.widthTiles, proofScale, source: task.entry.file, sourceSha256: task.sourceHash, outputSha256: sha(file), canvasAnchor: [canvas[0] / 2, groundAnchorY], canvasEnvelopeBottom: [canvas[0] / 2, canvas[1]], groundAnchorBasis: task.spec.top ? 'north-wall top centre' : `Bottom edge after last opaque foot/base row at alpha>=${contract.opaqueThreshold}; source visual base inspected`, worldAnchor: task.spec.ground ?? task.spec.top, depthRecord: task.spec.record, expectedRiseNativePixels: expected ?? null, measuredRiseNativePixels: measuredRise, measuredRiseProofPixels: measuredRise == null ? null : measuredRise * proofScale, measuredOpaqueContactGapProofPixels: task.spec.top ? null : 0, canvasPaddingBelowGroundProofPixels: task.spec.top ? null : (canvas[1] - groundAnchorY) * proofScale, ...result, warnings };
    if (sha(task.source) !== task.sourceHash) throw new Error(`${task.id} original changed during preparation`);
    console.log(`PACK ${task.id} ${canvas.join('x')} scale=${result.scale.toFixed(6)} warnings=${warnings.length}`);
  }

} finally { await browser.close(); }
// Larger scanner retains its source proportions. Its floor is privately moved
// to put the measured bore at the unchanged, measured empty-couch surface.
const gantry = results['gantry-side'], couch = results['table-empty'];
if (gantry && couch && contract.assets['gantry-side'].groundRule === 'align-bore-to-empty-couch') {
  if (!Number.isFinite(gantry.measuredRiseProofPixels) || !Number.isFinite(couch.measuredRiseProofPixels)) throw new Error('Bore/couch landmarks must be measured before ground alignment');
  const couchSurfaceY = couch.worldAnchor[1] * contract.proofPixelsPerTile - couch.measuredRiseProofPixels;
  gantry.worldAnchor = [gantry.worldAnchor[0], (couchSurfaceY + gantry.measuredRiseProofPixels) / contract.proofPixelsPerTile];
  gantry.groundRegistration = { method: 'align measured bore to unchanged empty-couch surface', couchSurfaceProofY: couchSurfaceY, alignedBoreProofY: gantry.worldAnchor[1] * contract.proofPixelsPerTile - gantry.measuredRiseProofPixels, privateGround: gantry.worldAnchor, layoutChangeAuthorizedBy: contract.ownerDirection };
}
for (const task of tasks) if (sha(task.source) !== task.sourceHash) throw new Error(`${task.id} original changed before publication`);
const metadata = { status: 'candidate_needs_owner_review', complete: missing.length === 0, nativePixelsPerTile: 240, proofPixelsPerTile: 120, contractSha256: sha(contractPath), generationManifestSha256: manifestInputSha256, assets: results, missing, notes };
fs.copyFileSync(contractPath, path.join(out, 'contract-used.json'));
fs.writeFileSync(path.join(out, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n');
// Publish the coherent candidate only after every requested transform succeeds.
for (const file of fs.readdirSync(out).filter(file => file.endsWith('.png') || ['metadata.json','contract-used.json'].includes(file))) fs.copyFileSync(path.join(out, file), path.join(destinationOut, file));
// The complete older candidate was preserved under proof/history first.
// Retire only these explicitly superseded files from the active prepared set.
for (const retired of ['table-occupied.png','table-patient-mask.png','table-patient-only.png','lockers.png']) {
  const target=path.resolve(destinationOut,retired);
  if (path.dirname(target)!==path.resolve(destinationOut)) throw new Error('Retired path escaped owned prepared directory');
  if (fs.existsSync(target)) fs.unlinkSync(target);
}
if (path.resolve(out) !== path.resolve(destinationOut, '.packing-stage')) throw new Error('Unexpected staging path');
fs.rmSync(out, { recursive: true });
console.log(`${missing.length ? 'INCOMPLETE' : 'PACKED'} ${Object.keys(results).length}/${totalAssets} assets; registration/contact validation remains separate.`);
