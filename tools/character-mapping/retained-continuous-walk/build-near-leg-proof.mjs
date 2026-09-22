import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { compileLateral } from '../math.mjs';

const repo = resolve(import.meta.dirname, '../../..');
const out = resolve(repo, 'artifacts/character-movement/retained-continuous-walk');
const kitPath = resolve(import.meta.dirname, 'gray-east-kit.json');
const kit = JSON.parse(readFileSync(kitPath, 'utf8'));
const mapping = JSON.parse(readFileSync(resolve(import.meta.dirname, '../retained-donor-merge/mapping.json'), 'utf8'));
const character = mapping.characters.find((entry) => entry.id === 'retained-dark-hair-beard-gray-overshirt');
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

function crop(image, box) {
  const canvas = createCanvas(box.width, box.height);
  canvas.getContext('2d').drawImage(image, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);
  return canvas;
}

function removeExteriorChecker(canvas) {
  const context = canvas.getContext('2d');
  const image = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  const seen = new Uint8Array(canvas.width * canvas.height);
  const queue = new Uint32Array(seen.length);
  let head = 0;
  let tail = 0;
  const isBackground = (index) => {
    const offset = index * 4;
    const red = data[offset];
    const green = data[offset + 1];
    const blue = data[offset + 2];
    return Math.min(red, green, blue) >= 224 && Math.max(red, green, blue) - Math.min(red, green, blue) <= 24;
  };
  const add = (index) => {
    if (!seen[index] && isBackground(index)) {
      seen[index] = 1;
      queue[tail++] = index;
    }
  };
  for (let x = 0; x < canvas.width; x += 1) {
    add(x);
    add((canvas.height - 1) * canvas.width + x);
  }
  for (let y = 0; y < canvas.height; y += 1) {
    add(y * canvas.width);
    add(y * canvas.width + canvas.width - 1);
  }
  while (head < tail) {
    const index = queue[head++];
    const x = index % canvas.width;
    const y = Math.floor(index / canvas.width);
    if (x > 0) add(index - 1);
    if (x + 1 < canvas.width) add(index + 1);
    if (y > 0) add(index - canvas.width);
    if (y + 1 < canvas.height) add(index + canvas.width);
  }
  for (let index = 0; index < seen.length; index += 1) if (seen[index]) data[index * 4 + 3] = 0;
  context.putImageData(image, 0, 0);
  return canvas;
}

function masked(source, polygon) {
  const canvas = createCanvas(source.width, source.height);
  const context = canvas.getContext('2d');
  context.beginPath();
  polygon.forEach(([x, y], index) => index ? context.lineTo(x, y) : context.moveTo(x, y));
  context.closePath();
  context.clip();
  context.drawImage(source, 0, 0);
  return canvas;
}

function crossSections(centers, halfWidths) {
  return centers.map((center, index) => {
    const previous = centers[Math.max(0, index - 1)];
    const next = centers[Math.min(centers.length - 1, index + 1)];
    const dx = next[0] - previous[0];
    const dy = next[1] - previous[1];
    const length = Math.hypot(dx, dy);
    const normal = [-dy / length, dx / length];
    const width = halfWidths[index];
    return [
      [center[0] + normal[0] * width, center[1] + normal[1] * width],
      [center[0] - normal[0] * width, center[1] - normal[1] * width]
    ];
  });
}

function barycentric(point, triangle) {
  const [[ax, ay], [bx, by], [cx, cy]] = triangle;
  const denominator = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
  const u = ((by - cy) * (point[0] - cx) + (cx - bx) * (point[1] - cy)) / denominator;
  const v = ((cy - ay) * (point[0] - cx) + (ax - cx) * (point[1] - cy)) / denominator;
  return [u, v, 1 - u - v, denominator];
}

function rasterTriangle(target, source, destinationTriangle, sourceTriangle) {
  const minX = Math.max(0, Math.floor(Math.min(...destinationTriangle.map((point) => point[0]))));
  const maxX = Math.min(target.width - 1, Math.ceil(Math.max(...destinationTriangle.map((point) => point[0]))));
  const minY = Math.max(0, Math.floor(Math.min(...destinationTriangle.map((point) => point[1]))));
  const maxY = Math.min(target.height - 1, Math.ceil(Math.max(...destinationTriangle.map((point) => point[1]))));
  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const weights = barycentric([x + 0.5, y + 0.5], destinationTriangle);
      if (weights[0] < -1e-7 || weights[1] < -1e-7 || weights[2] < -1e-7) continue;
      const sourceX = Math.max(0, Math.min(source.width - 1, Math.round(weights[0] * sourceTriangle[0][0] + weights[1] * sourceTriangle[1][0] + weights[2] * sourceTriangle[2][0])));
      const sourceY = Math.max(0, Math.min(source.height - 1, Math.round(weights[0] * sourceTriangle[0][1] + weights[1] * sourceTriangle[1][1] + weights[2] * sourceTriangle[2][1])));
      const sourceOffset = (sourceY * source.width + sourceX) * 4;
      if (!source.data[sourceOffset + 3]) continue;
      const targetOffset = (y * target.width + x) * 4;
      target.data[targetOffset] = source.data[sourceOffset];
      target.data[targetOffset + 1] = source.data[sourceOffset + 1];
      target.data[targetOffset + 2] = source.data[sourceOffset + 2];
      target.data[targetOffset + 3] = source.data[sourceOffset + 3];
    }
  }
}

function warpStrip(donor, sourceCenters, targetCenters, halfWidths) {
  const sourceSections = crossSections(sourceCenters, halfWidths);
  const targetSections = crossSections(targetCenters, halfWidths);
  const canvas = createCanvas(donor.width, donor.height);
  const output = canvas.getContext('2d').createImageData(canvas.width, canvas.height);
  const source = donor.getContext('2d').getImageData(0, 0, donor.width, donor.height);
  const determinants = [];
  for (let index = 0; index + 1 < sourceSections.length; index += 1) {
    const sourceQuad = [sourceSections[index][0], sourceSections[index][1], sourceSections[index + 1][1], sourceSections[index + 1][0]];
    const targetQuad = [targetSections[index][0], targetSections[index][1], targetSections[index + 1][1], targetSections[index + 1][0]];
    for (const indices of [[0, 1, 2], [0, 2, 3]]) {
      const sourceTriangle = indices.map((vertex) => sourceQuad[vertex]);
      const targetTriangle = indices.map((vertex) => targetQuad[vertex]);
      const sourceDeterminant = barycentric(sourceTriangle[0], sourceTriangle)[3];
      const targetDeterminant = barycentric(targetTriangle[0], targetTriangle)[3];
      if (Math.sign(sourceDeterminant) !== Math.sign(targetDeterminant) || Math.abs(targetDeterminant) < 1) throw new Error(`folded mesh segment ${index}`);
      determinants.push(targetDeterminant / sourceDeterminant);
      rasterTriangle(output, source, targetTriangle, sourceTriangle);
    }
  }
  canvas.getContext('2d').putImageData(output, 0, 0);
  return { canvas, determinants };
}

function drawRigidShoe(context, donor, sole, target) {
  const sourceCenter = [(sole.left[0] + sole.right[0]) / 2, (sole.left[1] + sole.right[1]) / 2];
  const targetCenter = [(target.shoeHeel.x + target.shoeToe.x) / 2, target.shoeContact.y];
  context.save();
  context.translate(targetCenter[0] - sourceCenter[0], targetCenter[1] - sourceCenter[1]);
  context.drawImage(donor, 0, 0);
  context.restore();
}

function recipeFor(entry) {
  const frame = entry.recipe.frame;
  return { identity: { templateId: entry.id }, lineage: { east: { kind: 'independent' }, west: { kind: 'reflected', fromView: 'east', phasePermutation: { '01': '05', '02': '06', '03': '07', '04': '08', '05': '01', '06': '02', '07': '03', '08': '04' } } }, lateral: { ...entry.recipe, registration: { east: { scale: 1, sourceAxisX: frame.axisX, sourceFloorY: frame.floorY, sourceWidth: frame.width, sourceHeight: frame.height }, west: { scale: 1, sourceAxisX: frame.axisX, sourceFloorY: frame.floorY, sourceWidth: frame.width, sourceHeight: frame.height } } } };
}

mkdirSync(resolve(out, 'proof'), { recursive: true });
const sourceBytes = readFileSync(resolve(repo, kit.sourcePath));
if (sha(sourceBytes) !== kit.sourceSha256) throw new Error('retained source hash mismatch');
const sourceImage = await loadImage(resolve(repo, kit.sourcePath));
const source = removeExteriorChecker(crop(sourceImage, kit.sourceCrop));
const legDonor = masked(source, kit.nearRightLeg.mask);
const shoeDonor = masked(source, kit.nearRightLeg.shoeMask);
const targets = compileLateral(recipeFor(character)).filter((entry) => entry.view === 'east' && ['01', '03'].includes(entry.phaseId));
const records = [];
for (const target of targets) {
  const joints = target.geometry.joints.right;
  const targetCenters = [
    [joints.hip.x, joints.hip.y],
    [(joints.hip.x + joints.knee.x) / 2, (joints.hip.y + joints.knee.y) / 2],
    [joints.knee.x, joints.knee.y],
    [(joints.knee.x + joints.ankle.x) / 2, (joints.knee.y + joints.ankle.y) / 2],
    [joints.ankle.x, joints.ankle.y]
  ];
  const warped = warpStrip(legDonor, kit.nearRightLeg.sourceCenters, targetCenters, kit.nearRightLeg.halfWidths);
  const frame = createCanvas(240, 310);
  const context = frame.getContext('2d');
  drawRigidShoe(context, shoeDonor, kit.nearRightLeg.shoeSole, joints);
  context.drawImage(warped.canvas, 0, 0);
  const bytes = frame.toBuffer('image/png');
  const name = `proof/near-right-leg-east-${target.phaseId}.png`;
  writeFileSync(resolve(out, name), bytes);
  records.push({ phaseId: target.phaseId, frame: name, sha256: sha(bytes), targetCenters, jacobianRange: [Math.min(...warped.determinants), Math.max(...warped.determinants)] });
}

const sheet = createCanvas(1040, 390);
const sheetContext = sheet.getContext('2d');
sheetContext.fillStyle = '#17191d';
sheetContext.fillRect(0, 0, sheet.width, sheet.height);
sheetContext.fillStyle = '#fff';
sheetContext.font = 'bold 20px sans-serif';
sheetContext.fillText('Gray overshirt — connected near-right leg proof', 18, 28);
for (let index = 0; index < records.length; index += 1) {
  const image = await loadImage(resolve(out, records[index].frame));
  for (const [background, offset] of [['#eeeae2', 0], ['#20242a', 250]]) {
    const x = 18 + index * 500 + offset;
    sheetContext.fillStyle = background;
    sheetContext.fillRect(x, 48, 240, 310);
    sheetContext.imageSmoothingEnabled = false;
    sheetContext.drawImage(image, x, 48);
    sheetContext.fillStyle = background === '#20242a' ? '#fff' : '#111';
    sheetContext.font = 'bold 14px sans-serif';
    sheetContext.fillText(`East ${records[index].phaseId}`, x + 8, 70);
  }
}
const sheetBytes = sheet.toBuffer('image/png');
writeFileSync(resolve(out, 'near-leg-01-03-proof.png'), sheetBytes);
writeFileSync(resolve(out, 'near-leg-01-03-proof.json'), JSON.stringify({ schemaVersion: 1, method: 'inverse-rasterized connected two-bone strip; shared knee section; source-width-preserving; rigid native shoe', sourcePath: kit.sourcePath, sourceSha256: kit.sourceSha256, records, sheet: 'near-leg-01-03-proof.png', sheetSha256: sha(sheetBytes) }, null, 2) + '\n');
console.log(JSON.stringify({ output: resolve(out, 'near-leg-01-03-proof.png'), records }, null, 2));
