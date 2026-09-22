import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const out = resolve(repo, 'artifacts/character-movement/retained-mesh-spike/lateral-v2');
const framesDir = resolve(out, 'frames');
mkdirSync(framesDir, { recursive: true });
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const eastManifest = JSON.parse(readFileSync(resolve(repo, 'artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2/two-character-eight-east.json')));
const allManifest = JSON.parse(readFileSync(resolve(repo, 'artifacts/character-movement/retained-donor-merge/all-directions-v1/all-directions-manifest.json')));
const p = (x, y) => ({ x, y });
const add = (a, b) => p(a.x + b.x, a.y + b.y);
const sub = (a, b) => p(a.x - b.x, a.y - b.y);
const mul = (a, n) => p(a.x * n, a.y * n);
const unit = (a) => mul(a, 1 / Math.hypot(a.x, a.y));
const normal = (a) => p(-a.y, a.x);
const point = ([x, y]) => p(x, y);
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

function polygon(ctx, vertices) {
  ctx.beginPath();
  vertices.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
}

function crop(source, box, mirror = false) {
  const canvas = createCanvas(240, Math.max(310, box.height));
  const ctx = canvas.getContext('2d');
  if (mirror) {
    ctx.translate(box.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height);
  return canvas;
}

function keyBackground(canvas) {
  const ctx = canvas.getContext('2d');
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
  for (let index = 0; index < pixels.data.length; index += 4) {
    const [r, g, b] = [pixels.data[index], pixels.data[index + 1], pixels.data[index + 2]];
    if (Math.min(r, g, b) >= 224 && Math.max(r, g, b) - Math.min(r, g, b) <= 24) pixels.data[index + 3] = 0;
  }
  ctx.putImageData(pixels, 0, 0);
  return canvas;
}

function donor(image, polygons) {
  const canvas = createCanvas(240, 310);
  const ctx = canvas.getContext('2d');
  for (const vertices of polygons) {
    polygon(ctx, vertices);
    ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-in';
  ctx.drawImage(image, 0, 0);
  return keyBackground(canvas);
}

function clipBelow(vertices, minimumY) {
  const output = [];
  for (let index = 0; index < vertices.length; index += 1) {
    const current = vertices[index];
    const next = vertices[(index + 1) % vertices.length];
    const currentInside = current[1] >= minimumY;
    const nextInside = next[1] >= minimumY;
    if (currentInside) output.push(current);
    if (currentInside !== nextInside) {
      const amount = (minimumY - current[1]) / (next[1] - current[1]);
      output.push([current[0] + amount * (next[0] - current[0]), minimumY]);
    }
  }
  return output;
}

function reflectCanvas(source, axisX) {
  const canvas = createCanvas(240, 310);
  const ctx = canvas.getContext('2d');
  ctx.translate(2 * axisX, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(source, 0, 0);
  return canvas;
}

function centers(a, b, c) {
  return [a, add(a, mul(sub(b, a), 0.5)), b, add(b, mul(sub(c, b), 0.5)), c];
}

function sections(centerline, widths) {
  return centerline.map((q, index) => {
    const prev = centerline[Math.max(0, index - 1)];
    const next = centerline[Math.min(centerline.length - 1, index + 1)];
    const n = normal(unit(sub(next, prev)));
    return [add(q, mul(n, widths[index] / 2)), add(q, mul(n, -widths[index] / 2))];
  });
}

function barycentric(q, triangle) {
  const [a, b, c] = triangle;
  const denominator = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y);
  return [
    ((b.y - c.y) * (q.x - c.x) + (c.x - b.x) * (q.y - c.y)) / denominator,
    ((c.y - a.y) * (q.x - c.x) + (a.x - c.x) * (q.y - c.y)) / denominator,
    denominator,
  ];
}

function rasterTriangle(output, source, targetTriangle, sourceTriangle, metrics) {
  const minX = Math.max(0, Math.floor(Math.min(...targetTriangle.map(({ x }) => x))));
  const maxX = Math.min(239, Math.ceil(Math.max(...targetTriangle.map(({ x }) => x))));
  const minY = Math.max(0, Math.floor(Math.min(...targetTriangle.map(({ y }) => y))));
  const maxY = Math.min(309, Math.ceil(Math.max(...targetTriangle.map(({ y }) => y))));
  if (barycentric(sourceTriangle[0], sourceTriangle)[2] * barycentric(targetTriangle[0], targetTriangle)[2] <= 0) throw Error('folded triangle');
  metrics.triangles += 1;
  for (let y = minY; y <= maxY; y += 1) for (let x = minX; x <= maxX; x += 1) {
    const [u, v] = barycentric(p(x + 0.5, y + 0.5), targetTriangle);
    if (u < 0 || v < 0 || u + v > 1) continue;
    const sx = Math.round(u * sourceTriangle[0].x + v * sourceTriangle[1].x + (1 - u - v) * sourceTriangle[2].x);
    const sy = Math.round(u * sourceTriangle[0].y + v * sourceTriangle[1].y + (1 - u - v) * sourceTriangle[2].y);
    const sourceIndex = (sy * 240 + sx) * 4;
    if (!source.data[sourceIndex + 3]) continue;
    const outputIndex = (y * 240 + x) * 4;
    output.data.set(source.data.subarray(sourceIndex, sourceIndex + 4), outputIndex);
  }
}

function mesh(canvas, sourceCanvas, sourcePoints, targetPoints, widths, metrics) {
  const ctx = canvas.getContext('2d');
  const output = ctx.getImageData(0, 0, 240, 310);
  const source = sourceCanvas.getContext('2d').getImageData(0, 0, 240, 310);
  const sourceSections = sections(sourcePoints, widths);
  const targetSections = sections(targetPoints, widths);
  for (let strip = 0; strip < 4; strip += 1) for (const indices of [[0, 1, 2], [0, 2, 3]]) {
    const sourceQuad = [sourceSections[strip][0], sourceSections[strip][1], sourceSections[strip + 1][1], sourceSections[strip + 1][0]];
    const targetQuad = [targetSections[strip][0], targetSections[strip][1], targetSections[strip + 1][1], targetSections[strip + 1][0]];
    rasterTriangle(output, source, indices.map((index) => targetQuad[index]), indices.map((index) => sourceQuad[index]), metrics);
  }
  ctx.putImageData(output, 0, 0);
}

function rigid(canvas, image, from, to, metrics, id) {
  const [a, b] = from;
  const [u, v] = to;
  const sourceAngle = Math.atan2(b.y - a.y, b.x - a.x);
  const targetAngle = Math.atan2(v.y - u.y, v.x - u.x);
  const scale = Math.hypot(v.x - u.x, v.y - u.y) / Math.hypot(b.x - a.x, b.y - a.y);
  const ctx = canvas.getContext('2d');
  ctx.save();
  ctx.translate(u.x, u.y);
  ctx.rotate(targetAngle - sourceAngle);
  ctx.scale(scale, scale);
  ctx.translate(-a.x, -a.y);
  ctx.drawImage(image, 0, 0);
  ctx.restore();
  metrics.transforms.push({ id, sourceStart: a, sourceEnd: b, targetStart: u, targetEnd: v, scale, rotationRadians: targetAngle - sourceAngle });
}

function alphaComponents(canvas) {
  const data = canvas.getContext('2d').getImageData(0, 0, 240, 310).data;
  const seen = new Uint8Array(240 * 310);
  const queue = new Uint32Array(seen.length);
  let count = 0;
  for (let index = 0; index < seen.length; index += 1) {
    if (seen[index] || data[index * 4 + 3] < 128) continue;
    count += 1;
    let head = 0, tail = 0;
    seen[index] = 1; queue[tail++] = index;
    while (head < tail) {
      const current = queue[head++], x = current % 240, y = Math.floor(current / 240);
      for (const next of [x && current - 1, x < 239 && current + 1, y && current - 240, y < 309 && current + 240]) {
        if (next !== false && !seen[next] && data[next * 4 + 3] >= 128) { seen[next] = 1; queue[tail++] = next; }
      }
    }
  }
  return count;
}

const configs = [
  {
    kit: 'woman-donor-kit.json', short: 'olive',
    widths: { rightLeg: [29, 29, 28, 25, 21], leftLeg: [29, 28, 27, 24, 20], rightArm: [16, 16, 15, 15, 13], leftArm: [16, 16, 15, 15, 13] },
  },
  {
    kit: 'man-donor-kit.json', short: 'gray',
    widths: { rightLeg: [27, 30, 31, 27, 23], leftLeg: [27, 29, 30, 26, 22], rightArm: [18, 18, 17, 16, 14], leftArm: [18, 18, 17, 16, 14] },
  },
];

const characters = [];
for (const config of configs) {
  const kitPath = resolve(repo, 'tools/character-mapping/retained-donor-merge', config.kit);
  const kit = JSON.parse(readFileSync(kitPath));
  const source = await loadImage(resolve(repo, kit.sourcePath));
  const eastData = eastManifest.characters.find(({ id }) => id === kit.characterId);
  const allData = allManifest.characters.find(({ id }) => id === kit.characterId);
  const bodyEast = await loadImage(resolve(repo, 'artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2', eastData.bodyPreview));
  const axisX = allData.directions.east['01'].geometry.registration.sourceAxisX;
  const bodyWest = reflectCanvas(bodyEast, axisX);
  const walk = crop(source, kit.sourceCrop);
  const nativeWestMirror = crop(source, { x: 550, y: 20, width: 210, height: 340 }, true);
  const pieces = Object.fromEntries(kit.pieces.map((piece) => [piece.id, piece]));
  const kneeBridge = config.short === 'gray' ? [[[152, 207], [164, 208], [173, 237], [160, 247], [148, 254], [135, 242], [130, 237], [121, 217]]] : [];
  const eastDonors = {
    rightLeg: donor(walk, [pieces['near-right-thigh'].polygon, pieces['near-right-shin'].polygon, ...kneeBridge]),
    leftLeg: donor(walk, [pieces['far-left-thigh'].polygon, pieces['far-left-shin'].polygon]),
    rightArm: donor(walk, [pieces['near-right-upper-arm'].polygon, pieces['near-right-forearm-hand'].polygon]),
    leftArm: donor(nativeWestMirror, [pieces['far-left-upper-arm'].polygon, pieces['far-left-forearm-hand'].polygon]),
    rightHand: donor(walk, [config.short === 'gray' ? [[84, 180], [100, 179], [99, 191], [94, 204], [83, 202], [77, 191]] : clipBelow(pieces['near-right-forearm-hand'].polygon, 174)]),
    leftHand: donor(nativeWestMirror, [config.short === 'gray' ? [[101, 218], [113, 216], [124, 221], [124, 230], [116, 240], [103, 241], [92, 230], [94, 221]] : clipBelow(pieces['far-left-forearm-hand'].polygon, 210)]),
    rightShoe: donor(walk, [pieces['near-right-shoe'].polygon]),
    leftShoe: donor(walk, [pieces['far-left-shoe'].polygon]),
  };
  const anchors = {
    rightLeg: [point(pieces['near-right-thigh'].anchors[0]), point(pieces['near-right-thigh'].anchors[1]), point(pieces['near-right-shin'].anchors[1])],
    leftLeg: [point(pieces['far-left-thigh'].anchors[0]), point(pieces['far-left-thigh'].anchors[1]), point(pieces['far-left-shin'].anchors[1])],
    rightArm: [point(pieces['near-right-upper-arm'].anchors[0]), point(pieces['near-right-upper-arm'].anchors[1]), point(pieces['near-right-forearm-hand'].anchors[1])],
    leftArm: [point(pieces['far-left-upper-arm'].anchors[0]), point(pieces['far-left-upper-arm'].anchors[1]), point(pieces['far-left-forearm-hand'].anchors[1])],
    rightHand: pieces['near-right-forearm-hand'].anchors.map(point),
    leftHand: pieces['far-left-forearm-hand'].anchors.map(point),
    rightShoe: pieces['near-right-shoe'].anchors.map(point),
    leftShoe: pieces['far-left-shoe'].anchors.map(point),
  };
  if (config.short === 'gray') anchors.rightLeg = [p(132, 207), p(145, 230), p(157, 261)];
  if (config.short === 'olive') {
    anchors.rightLeg = [anchors.rightLeg[0], anchors.rightLeg[1], p(156, 250)];
    anchors.leftLeg = [anchors.leftLeg[0], anchors.leftLeg[1], p(68, 249)];
  }
  const directions = {};
  for (const direction of ['east', 'west']) {
    const reflect = direction === 'west';
    const donors = reflect ? Object.fromEntries(Object.entries(eastDonors).map(([id, image]) => [id, reflectCanvas(image, axisX)])) : eastDonors;
    const sourceAnchors = reflect ? Object.fromEntries(Object.entries(anchors).map(([id, values]) => [id, values.map(({ x, y }) => p(2 * axisX - x, y))])) : anchors;
    const body = reflect ? bodyWest : bodyEast;
    const records = [];
    for (const phaseId of phases) {
      const geometry = allData.directions[direction][phaseId].geometry;
      const canvas = createCanvas(240, 310);
      const ctx = canvas.getContext('2d');
      const metrics = { triangles: 0, transforms: [] };
      const far = direction === 'east' ? 'left' : 'right';
      const near = direction === 'east' ? 'right' : 'left';
      for (const side of [far, near]) {
        const joint = geometry.joints[side];
        rigid(canvas, donors[`${side}Shoe`], sourceAnchors[`${side}Shoe`], [joint.shoeHeel, joint.shoeToe], metrics, `${side}Shoe`);
      }
      for (const side of [far, near]) {
        const joint = geometry.joints[side];
        mesh(canvas, donors[`${side}Leg`], centers(...sourceAnchors[`${side}Leg`]), centers(joint.hip, joint.knee, joint.ankle), config.widths[`${side}Leg`], metrics);
      }
      const farJoint = geometry.joints[far];
      rigid(canvas, donors[`${far}Hand`], sourceAnchors[`${far}Hand`], [farJoint.elbow, farJoint.wrist], metrics, `${far}Hand`);
      mesh(canvas, donors[`${far}Arm`], centers(...sourceAnchors[`${far}Arm`]), centers(farJoint.shoulder, farJoint.elbow, farJoint.wrist), config.widths[`${far}Arm`], metrics);
      const bodyHip = reflect ? p(2 * axisX - kit.bodySourceHip.x, kit.bodySourceHip.y) : kit.bodySourceHip;
      ctx.drawImage(body, geometry.joints.right.hip.x - bodyHip.x, geometry.joints.right.hip.y - bodyHip.y);
      const nearJoint = geometry.joints[near];
      rigid(canvas, donors[`${near}Hand`], sourceAnchors[`${near}Hand`], [nearJoint.elbow, nearJoint.wrist], metrics, `${near}Hand`);
      mesh(canvas, donors[`${near}Arm`], centers(...sourceAnchors[`${near}Arm`]), centers(nearJoint.shoulder, nearJoint.elbow, nearJoint.wrist), config.widths[`${near}Arm`], metrics);
      const filename = `${config.short}-${direction}-${phaseId}.png`;
      const buffer = canvas.toBuffer('image/png');
      writeFileSync(resolve(framesDir, filename), buffer);
      records.push({ phaseId, file: `frames/${filename}`, sha256: sha256(buffer), alphaComponents: alphaComponents(canvas), triangles: metrics.triangles, transforms: metrics.transforms, targets: geometry });
    }
    directions[direction] = records;
  }
  const donorSheet = createCanvas(960, 660);
  const donorCtx = donorSheet.getContext('2d');
  donorCtx.fillStyle = '#1d2128'; donorCtx.fillRect(0, 0, 960, 660); donorCtx.fillStyle = '#fff'; donorCtx.font = '17px sans-serif';
  let donorIndex = 0;
  for (const [id, image] of Object.entries(eastDonors)) {
    const x = donorIndex % 4 * 240, y = Math.floor(donorIndex / 4) * 320;
    donorCtx.fillText(`${config.short} ${id}`, x + 8, y + 20); donorCtx.drawImage(image, x, y + 26); donorIndex += 1;
  }
  const donorFile = `${config.short}-source-donors.png`;
  const donorBuffer = donorSheet.toBuffer('image/png');
  writeFileSync(resolve(out, donorFile), donorBuffer);
  for (const direction of ['east', 'west']) {
    const sheet = createCanvas(960, 640);
    const sheetCtx = sheet.getContext('2d');
    sheetCtx.fillStyle = '#1d2128'; sheetCtx.fillRect(0, 0, sheet.width, sheet.height); sheetCtx.fillStyle = '#fff'; sheetCtx.font = '18px sans-serif';
    sheetCtx.fillText(`${config.short} connected mesh ${direction.toUpperCase()} 01–08`, 8, 20);
    for (let index = 0; index < phases.length; index += 1) {
      const image = await loadImage(resolve(out, directions[direction][index].file));
      const x = index % 4 * 240, y = 24 + Math.floor(index / 4) * 308;
      sheetCtx.drawImage(image, x, y); sheetCtx.fillText(phases[index], x + 8, y + 20);
    }
    writeFileSync(resolve(out, `${config.short}-${direction}-native-contact.png`), sheet.toBuffer('image/png'));
  }
  characters.push({ id: kit.characterId, sourcePin: { path: kit.sourcePath, sha256: kit.sourceSha256, crop: kit.sourceCrop }, kit: { path: `tools/character-mapping/retained-donor-merge/${config.kit}`, sha256: sha256(readFileSync(kitPath)), bodySourceHip: kit.bodySourceHip }, reflectionAxisX: axisX, widths: config.widths, directions, donorSheet: { file: donorFile, sha256: sha256(donorBuffer) } });
}

for (const direction of ['east', 'west']) {
  const sheet = createCanvas(1920, 640);
  const ctx = sheet.getContext('2d');
  ctx.fillStyle = '#1d2128'; ctx.fillRect(0, 0, sheet.width, sheet.height); ctx.fillStyle = '#fff'; ctx.font = '20px sans-serif';
  ctx.fillText(`Connected retained mesh — ${direction.toUpperCase()} — olive then gray`, 12, 24);
  for (let row = 0; row < characters.length; row += 1) for (let column = 0; column < phases.length; column += 1) {
    const record = characters[row].directions[direction][column];
    const image = await loadImage(resolve(out, record.file));
    ctx.drawImage(image, column * 240, 30 + row * 305);
    ctx.fillText(record.phaseId, column * 240 + 8, 52 + row * 305);
  }
  writeFileSync(resolve(out, `review-${direction}.png`), sheet.toBuffer('image/png'));
}

const manifest = {
  schemaVersion: 2,
  status: 'review-required',
  method: 'four source-textured connected limb meshes per frame plus whole masked rigid hands and shoes; individual reflected donors/body for west',
  sourceGeometry: 'artifacts/character-movement/retained-donor-merge/all-directions-v1/all-directions-manifest.json characters[].directions[direction][phase].geometry',
  phaseIds: phases,
  directions: ['east', 'west'],
  characters,
  contactSheets: { east: 'review-east.png', west: 'review-west.png' },
  invariants: ['no joint discs', 'four strips and eight triangles per limb', 'hands and shoes drawn as complete rigid masked source pieces', 'legs before body; far arm before body; anatomical near arm after body', 'west built from reflected donors and authoritative west targets, never by flipping a finished east frame'],
  limitations: ['review artifact only; no runtime integration', 'source masks retain authored antialiasing and may contain isolated low-area opaque pixels'],
};
writeFileSync(resolve(out, 'lateral-v2-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ out, frames: characters.reduce((sum, character) => sum + character.directions.east.length + character.directions.west.length, 0), sheets: manifest.contactSheets, componentCounts: characters.map(({ id, directions }) => ({ id, east: directions.east.map(({ alphaComponents }) => alphaComponents), west: directions.west.map(({ alphaComponents }) => alphaComponents) })) }, null, 2));
