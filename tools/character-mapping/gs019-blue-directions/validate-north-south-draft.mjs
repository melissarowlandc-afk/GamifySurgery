import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { loadRig, renderPose, standingPose } from '../layered-pilot/blue-glasses-v1/blue-glasses-rig-v1.mjs';
import { drawStandardSlot } from '../standard-atlas/standard-character-renderer.mjs';

const repo = path.resolve(import.meta.dirname, '../../..');
const artifactRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/north-south-draft-v1');
const manifestBytes = readFileSync(path.join(artifactRoot, 'manifest.json'));
const manifest = JSON.parse(manifestBytes);
const referenceBytes = readFileSync(path.join(repo, 'artifacts/character-movement/gs019-blue-directions/source-reference/source-investigation.json'));
const reference = JSON.parse(referenceBytes);
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const expectedMaps = {
  north: [
    ['northV1', 5, false], ['northV1', 2, false], ['northV1', 3, false], ['northV1', 4, false],
    ['northV1', 1, false], ['northV1', 2, true], ['northV1', 3, true], ['northV1', 4, true],
  ],
  south: [
    ['southV2', 5, false], ['southV2', 6, false], ['southV2', 7, false], ['southV2', 4, false],
    ['southV2', 1, false], ['southV2', 6, true], ['southV2', 7, true], ['southV2', 4, true],
  ],
};
const sha = value => createHash('sha256').update(value).digest('hex');
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
const loaded = await loadRig(repo);

function pixels(canvas) { return canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data; }
function exactAt(actual, expected, index) { return actual[index] === expected[index] && actual[index + 1] === expected[index + 1] && actual[index + 2] === expected[index + 2] && actual[index + 3] === expected[index + 3]; }
function isSkin(r, g, b, a) { return a >= 80 && r >= 90 && r >= g + 8 && g >= b + 5 && b < 150; }
function isShirt(r, g, b, a) { return a >= 160 && b >= r + 7 && g >= r + 4 && b >= g - 9 && r < 145 && g < 165; }
function authoredShirtTop(data, width, height) {
  let top = height;
  for (let y = 0; y < Math.min(height, 220); y++) for (let x = 0; x < width; x++) { const i = (y * width + x) * 4; if (isShirt(data[i], data[i + 1], data[i + 2], data[i + 3])) top = Math.min(top, y); }
  return top;
}
function componentMetrics(data, width, height) {
  const occupied = new Uint8Array(width * height), seen = new Uint8Array(width * height);
  let left = width, top = height, right = -1, bottom = -1, floorAlpha = 0, belowFloorAlpha = 0, alphaPixels = 0, lowAlphaPixels = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const n = y * width + x, alpha = data[n * 4 + 3];
    if (alpha > 0 && alpha < 24) lowAlphaPixels++;
    if (alpha < 24) continue;
    occupied[n] = 1; alphaPixels++; left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
    if (y === 287) floorAlpha++;
    if (y > 287) belowFloorAlpha++;
  }
  const components = [];
  for (let seed = 0; seed < occupied.length; seed++) {
    if (!occupied[seed] || seen[seed]) continue;
    const stack = [seed]; seen[seed] = 1; let size = 0, firstX = seed % width, firstY = Math.floor(seed / width);
    while (stack.length) {
      const n = stack.pop(), x = n % width, y = Math.floor(n / width); size++;
      for (const next of [x ? n - 1 : -1, x + 1 < width ? n + 1 : -1, y ? n - width : -1, y + 1 < height ? n + width : -1]) if (next >= 0 && occupied[next] && !seen[next]) { seen[next] = 1; stack.push(next); }
    }
    components.push({ size, firstX, firstY });
  }
  components.sort((a, b) => b.size - a.size);
  return { alphaThreshold: 24, bounds: { left, top, right, bottom }, floorAlpha, belowFloorAlpha, alphaPixels, lowAlphaPixels, componentCount: components.length, components };
}

check(manifest.schemaVersion === 'gs019-blue-directions/north-south-draft-v1', 'schema');
check(JSON.stringify(manifest.phaseContract.ids) === JSON.stringify(phases), 'phase count/order');
check(manifest.phaseContract.cadenceMs === 180, 'cadence');
check(manifest.canvas.width === 160 && manifest.canvas.height === 320 && manifest.canvas.axisX === 80 && manifest.canvas.floorY === 287, 'canvas contract');
check(sha(referenceBytes) === '9b8ad42602eecde1702bf551664028fd4876c5e371db734bb02a063aabf91547', 'source investigation pin');

const metrics = { manifestSha256: sha(manifestBytes), directions: {} };
for (const direction of ['north', 'south']) {
  const record = manifest.directions[direction], ref = reference.directions[direction];
  check(record.approvedStanding.sha256 === ref.approvedStanding.sha256, `${direction} standing manifest pin`);
  check(sha(readFileSync(path.join(repo, record.approvedStanding.file))) === record.approvedStanding.sha256, `${direction} standing bytes`);
  check(record.identitySource.sha256 === ref.identitySource.sha256, `${direction} identity manifest pin`);
  check(sha(readFileSync(path.join(repo, record.identitySource.file))) === record.identitySource.sha256, `${direction} identity bytes`);
  check(JSON.stringify(record.approvedHeadReference.matrix) === JSON.stringify(ref.actualStandingRasterHead.matrix), `${direction} raster head matrix`);
  for (const source of Object.values(record.sourcePins)) {
    check(sha(readFileSync(path.join(repo, source.file))) === source.sha256, `${direction} donor pin ${source.file}`);
    check(sha(readFileSync(path.join(repo, source.prompt))) === source.promptSha256, `${direction} prompt pin ${source.prompt}`);
  }

  const metadata = renderPose(loaded, standingPose(direction)).metadata.head;
  let protectedIdentityPixels = 0, exactProtectedIdentityPixels = 0, skinPixels = 0, exactSkinPixels = 0;
  let lowerBodyChannelValues = 0, exactLowerBodyChannelValues = 0, minFloorAlpha = Infinity, maxBelowFloorAlpha = 0, maxComponents = 0;
  const frameMetrics = {};
  for (const [phaseIndex, phase] of phases.entries()) {
    const frameRecord = record.frames[phase], authoredRecord = record.authored[phase], expectedMap = expectedMaps[direction][phaseIndex];
    check(authoredRecord.sourceSheet === expectedMap[0] && authoredRecord.sourceCell === expectedMap[1] && authoredRecord.mirrored === expectedMap[2], `${direction} phase map ${phase}`);
    const authoredBytes = readFileSync(path.join(artifactRoot, authoredRecord.file)), frameBytes = readFileSync(path.join(artifactRoot, frameRecord.file));
    check(sha(authoredBytes) === authoredRecord.sha256, `${direction} authored hash ${phase}`);
    check(sha(frameBytes) === frameRecord.sha256, `${direction} frame hash ${phase}`);
    const [authoredImage, frameImage] = await Promise.all([loadImage(authoredBytes), loadImage(frameBytes)]);
    check(frameImage.width === 160 && frameImage.height === 320, `${direction} frame dimensions ${phase}`);
    check(authoredImage.width === frameRecord.bodyPlacement.width && authoredImage.height === frameRecord.bodyPlacement.height, `${direction} authored dimensions ${phase}`);
    const frameCanvas = createCanvas(160, 320), authoredCanvas = createCanvas(160, 320), expectedHead = createCanvas(160, 320);
    frameCanvas.getContext('2d').drawImage(frameImage, 0, 0);
    authoredCanvas.getContext('2d').drawImage(authoredImage, frameRecord.bodyPlacement.x, frameRecord.bodyPlacement.y);
    drawStandardSlot(expectedHead.getContext('2d'), loaded.images.identity, metadata.id, frameRecord.headMatrix);
    const actual = pixels(frameCanvas), body = pixels(authoredCanvas), head = pixels(expectedHead);
    const authoredLocal = createCanvas(authoredImage.width, authoredImage.height); authoredLocal.getContext('2d').drawImage(authoredImage, 0, 0); const authoredData = pixels(authoredLocal);
    const recomputedSocketY = frameRecord.bodyPlacement.y + authoredShirtTop(authoredData, authoredImage.width, authoredImage.height);
    const referenceMatrix = record.approvedHeadReference.matrix, baseSocketY = record.frames['01'].socketY;
    check(recomputedSocketY === frameRecord.socketY, `${direction} recomputed body socket ${phase}`);
    check(frameRecord.deltaY === frameRecord.socketY - baseSocketY, `${direction} body-relative head delta ${phase}`);
    check(frameRecord.headMatrix.a === referenceMatrix.a && frameRecord.headMatrix.b === referenceMatrix.b && frameRecord.headMatrix.c === referenceMatrix.c && frameRecord.headMatrix.d === referenceMatrix.d && frameRecord.headMatrix.e === referenceMatrix.e && frameRecord.headMatrix.f === referenceMatrix.f + frameRecord.deltaY, `${direction} raster-relative head matrix ${phase}`);
    const geometry = componentMetrics(actual, 160, 320);
    check(geometry.componentCount === 1, `${direction} connected sprite ${phase}: ${geometry.componentCount}`);
    check(geometry.bounds.left > 0 && geometry.bounds.right < 159 && geometry.bounds.top > 0 && geometry.bounds.bottom === 287, `${direction} nonclipping bounds ${phase}`);
    check(geometry.floorAlpha > 0, `${direction} floor contact ${phase}`);
    check(geometry.belowFloorAlpha === 0, `${direction} below floor ${phase}`);
    minFloorAlpha = Math.min(minFloorAlpha, geometry.floorAlpha); maxBelowFloorAlpha = Math.max(maxBelowFloorAlpha, geometry.belowFloorAlpha); maxComponents = Math.max(maxComponents, geometry.componentCount);

    let headTop = 320, headBottom = -1;
    for (let y = 0; y < 320; y++) for (let x = 0; x < 160; x++) if (head[(y * 160 + x) * 4 + 3] >= 24) { headTop = Math.min(headTop, y); headBottom = Math.max(headBottom, y); }
    const upperIdentityEnd = headTop + Math.floor((headBottom - headTop + 1) * .76);
    for (let y = 0; y < 320; y++) for (let x = 0; x < 160; x++) {
      const i = (y * 160 + x) * 4, alpha = head[i + 3];
      const skin = isSkin(head[i], head[i + 1], head[i + 2], alpha);
      const protectedIdentity = alpha >= 160 && (y <= upperIdentityEnd || skin);
      if (protectedIdentity) { protectedIdentityPixels++; if (exactAt(actual, head, i)) exactProtectedIdentityPixels++; }
      if (skin) { skinPixels++; if (exactAt(actual, head, i)) exactSkinPixels++; }
      if (y >= 150) for (let channel = 0; channel < 4; channel++) { lowerBodyChannelValues++; if (actual[i + channel] === body[i + channel]) exactLowerBodyChannelValues++; }
    }
    check(exactSkinPixels === skinPixels, `${direction} native skin identity ${phase}`);
    frameMetrics[phase] = geometry;
  }
  check(exactProtectedIdentityPixels === protectedIdentityPixels, `${direction} protected native identity`);
  check(exactLowerBodyChannelValues === lowerBodyChannelValues, `${direction} complete lower body unchanged`);
  metrics.directions[direction] = { frames: 8, protectedIdentityPixels, exactProtectedIdentityPixels, skinPixels, exactSkinPixels, lowerBodyChannelValues, exactLowerBodyChannelValues, minFloorAlpha, maxBelowFloorAlpha, maxComponents, frameMetrics };
}

const proof = manifest.proof;
check(sha(readFileSync(path.join(artifactRoot, proof.file))) === proof.sha256, 'all8 proof hash');
const result = { status: errors.length ? 'FAIL' : 'PASS', errors, metrics };
writeFileSync(path.join(artifactRoot, 'validation.json'), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));
if (errors.length) process.exitCode = 1;
