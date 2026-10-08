// Node-only technical crop, alpha-fringe cleanup, uniform fit and registration.
// Original generated art and every external reference remain read only.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas } from '@napi-rs/canvas';
import { sha, decode, bounds, alphaStats } from './image-utils.mjs';
const here = path.dirname(fileURLToPath(import.meta.url));
const contractFile = path.resolve(here, '../proof/asset-contract.json');
const manifestFile = path.join(here, 'generation-manifest.json');
const contract = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const out = path.join(here, 'processed'); fs.mkdirSync(out, { recursive: true });
const results = {}, outputs = [];
for (const [id, spec] of Object.entries(contract.assets)) {
  const entry = manifest.assets.find(x => x.id === id);
  if (!entry) throw new Error(`Missing generated original: ${id}`);
  const source = path.resolve(here, entry.file);
  if (!source.startsWith(path.join(here, 'originals') + path.sep)) throw new Error('Original escaped owned lane');
  if (sha(source) !== entry.sha256 || sha(path.resolve(here, entry.prompt)) !== entry.promptSha256) throw new Error(`Original or exact prompt hash mismatch: ${id}`);
  const raw = await decode(source), sw = raw.canvas.width, sh = raw.canvas.height;
  const sourceVisible = bounds(raw.pixels.data, sw, sh, contract.alphaCleanupThreshold);
  const sourceOpaque = bounds(raw.pixels.data, sw, sh, contract.opaqueThreshold);
  const sourceAll = bounds(raw.pixels.data, sw, sh, 1);
  if (!sourceVisible || !sourceOpaque || sourceVisible.edgeAlphaMax >= contract.alphaCleanupThreshold) throw new Error(`Meaningful source edge cropped or absent: ${id}`);
  let fringePixelsRemoved = 0, maxRemovedAlpha = 0;
  for (let i = 0; i < raw.pixels.data.length; i += 4) {
    const alpha = raw.pixels.data[i + 3];
    if (alpha && alpha < contract.alphaCleanupThreshold) {
      fringePixelsRemoved++; maxRemovedAlpha = Math.max(maxRemovedAlpha, alpha);
      raw.pixels.data[i] = raw.pixels.data[i + 1] = raw.pixels.data[i + 2] = raw.pixels.data[i + 3] = 0;
    }
  }
  raw.context.putImageData(raw.pixels, 0, 0);
  const crop = [sourceVisible.left - 1, sourceVisible.top - 1, sourceVisible.width + 2, sourceVisible.height + 2];
  if (crop[0] < 0 || crop[1] < 0 || crop[0] + crop[2] > sw || crop[1] + crop[3] > sh) throw new Error(`Source lacks clear surrounding pixel: ${id}`);
  const [width, height] = spec.canvas, margin = contract.packingMarginPixels;
  const scale = spec.packing?.scale ?? Math.min((width - 2 * margin) / crop[2], (height - 2 * margin) / crop[3]);
  if (!(scale > 0 && scale <= 1)) throw new Error(`Invalid packing scale or source upscale: ${id}`);
  if(spec.packing && sha(path.resolve(here,spec.packing.baselineMetadata))!==spec.packing.baselineMetadataSha256)throw new Error('Reviewed packing baseline changed: '+id);
  const destination = [spec.packing?.leftPixels ?? (width - crop[2] * scale) / 2, height - margin - crop[3] * scale, crop[2] * scale, crop[3] * scale];
  const canvas = createCanvas(width, height), context = canvas.getContext('2d');
  context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
  context.drawImage(raw.canvas, ...crop, ...destination);
  const pixels = context.getImageData(0, 0, width, height).data;
  const all = bounds(pixels, width, height), opaque = bounds(pixels, width, height, contract.opaqueThreshold);
  const clearance = { left: all.left, top: all.top, right: width - 1 - all.right, bottom: height - 1 - all.bottom };
  if (Object.values(clearance).some(x => x < contract.minimumClearancePixels)) throw new Error(`Transparent margin too small: ${id}`);
  const canvasAnchor = [width / 2, spec.anchorKind === 'wall' ? all.top : opaque.bottom + 1];
  const sourcePoints = spec.sourcePoints ?? {}, points = {};
  for (const [name, xy] of Object.entries(sourcePoints)) {
    if (raw.pixels.data[(Math.round(xy[1]) * sw + Math.round(xy[0])) * 4 + 3] < contract.opaqueThreshold) throw new Error(`Landmark outside opaque source: ${id}/${name}`);
    points[name] = [destination[0] + (xy[0] - crop[0]) * scale, destination[1] + (xy[1] - crop[1]) * scale];
  }
  const proofScale = spec.widthTiles * contract.proofPixelsPerTile / width;
  const seatRise = points.seat ? (canvasAnchor[1] - points.seat[1]) * proofScale : null;
  if (seatRise !== null && Math.abs(seatRise - spec.expectedSeatRiseProofPixels) > spec.seatToleranceProofPixels) throw new Error(`Stool seat rise ${seatRise} differs from original native registration`);
  const png = canvas.toBuffer('image/png');
  const outputSha256 = (await import('node:crypto')).createHash('sha256').update(png).digest('hex').toUpperCase();
  results[id] = {
    id, file: `${id}.png`, status: entry.status, canvas: spec.canvas,
    widthTiles: spec.widthTiles, heightTiles: spec.heightTiles, proofScale,
    source: entry.file, sourceSha256: entry.sha256, prompt: entry.prompt, promptSha256: entry.promptSha256,
    sourceSize: [sw, sh], sourceAllAlphaBounds: sourceAll, sourceVisibleBounds: sourceVisible, sourceOpaqueBounds: sourceOpaque,
    alphaCleanup: { threshold: contract.alphaCleanupThreshold, fringePixelsRemoved, maxRemovedAlpha, meaningfulPixelsRemoved: 0 },
    crop, scale, destination, ...(spec.packing?{packingRegistration:spec.packing}:{}), aspectPreserved: true, sourceUpscaled: false, outputSha256,
    outputAllAlphaBounds: all, outputOpaqueBounds: opaque, alphaClearancePixels: clearance,
    alpha: alphaStats(pixels, width, height), canvasAnchor,
    anchorKind: spec.anchorKind, anchorBasis: spec.anchorKind === 'wall' ? 'Top edge of actual alpha at wall top' : 'Edge immediately below final opaque floor/base row, alpha >= 160',
    worldAnchors: spec.ground ?? [spec.top], sourcePoints, calibratedPoints: points,
    measuredSeatRiseProofPixels: seatRise,
    measuredTabletopRiseProofPixels: points.frontTabletop ? (canvasAnchor[1] - points.frontTabletop[1]) * proofScale : null,
    physicalFloorGapProofPixels: spec.anchorKind === 'floor' ? 0 : null
  };
  outputs.push([path.join(out, `${id}.png`), png]);
  if (sha(source) !== entry.sha256) throw new Error(`Source changed during preparation: ${id}`);
  console.log(`PACK ${id} ${width}x${height}; alpha margins ${Object.values(clearance).join('/')}; ground ${canvasAnchor.join(',')}${seatRise === null ? '' : `; seat rise ${seatRise.toFixed(3)} px`}`);
}
const metadata = { schemaVersion: 1, status: manifest.designApproval?'owner_design_approved':'owner_revision_in_progress', complete: true, nominalNativePixelsPerTile: 480, proofPixelsPerTile: 120, generationManifestSha256: sha(manifestFile), contractSha256: sha(contractFile), assets: results, notes: ['Minimum true-alpha clearance 4 native pixels. Extra one-axis padding preserves source proportions; all actual margins are recorded.', 'Chair revision retains reviewed uniform scale and left placement within the original transparent native frame; no expansion after leg-rest removal.', 'No browser, web retrieval, AI call, generated replacement art, character edit or shared-source edit during preparation.'] };
// Publish only after the entire batch passes technical validation.
for (const [file, bytes] of outputs) fs.writeFileSync(file, bytes);
fs.writeFileSync(path.join(out, 'metadata.json'), JSON.stringify(metadata, null, 2) + '\n');
fs.copyFileSync(contractFile, path.join(out, 'contract-used.json'));
console.log(`PREPARE PASS ${outputs.length} genuine-alpha native sprites; originals unchanged; Node-only`);
