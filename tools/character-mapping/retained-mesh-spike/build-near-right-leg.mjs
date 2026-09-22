import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const out = resolve(repo, 'artifacts/character-movement/retained-mesh-spike');
mkdirSync(out, { recursive: true });
const sourcePath = 'Photos for Codex 2/Patients or Staff or Other Characters/exec-33437146-564e-4cb1-a7e2-ad41504ea752.png';
const kit = JSON.parse(readFileSync(resolve(repo, 'tools/character-mapping/retained-donor-merge/man-donor-kit.json')));
const compiled = JSON.parse(readFileSync(resolve(repo, 'artifacts/character-movement/retained-donor-merge/two-character-eight-east-v2/two-character-eight-east.json')));
const gray = compiled.characters.find((character) => character.id === kit.characterId);
if (!gray) throw new Error('gray overshirt character not found in compiled east targets');
const source = await loadImage(resolve(repo, sourcePath));

function point(x, y) { return { x, y }; }
function sub(a, b) { return point(a.x - b.x, a.y - b.y); }
function add(a, b) { return point(a.x + b.x, a.y + b.y); }
function mul(a, n) { return point(a.x * n, a.y * n); }
function unit(a) { const n = Math.hypot(a.x, a.y); return mul(a, 1 / n); }
function normal(a) { return point(-a.y, a.x); }
function bisector(a, b) { return unit(add(unit(a), unit(b))); }
function path(context, polygon) { context.beginPath(); polygon.forEach(([x, y], i) => i ? context.lineTo(x, y) : context.moveTo(x, y)); context.closePath(); }
function triangleArea(a, b, c) { return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x); }

function isolatedSourceLeg() {
  const crop = createCanvas(240, 310);
  const context = crop.getContext('2d');
  context.drawImage(source, 1000, 360, 240, 310, 0, 0, 240, 310);
  const mask = createCanvas(240, 310);
  const m = mask.getContext('2d');
  const thigh = kit.pieces.find((piece) => piece.id === 'near-right-thigh').polygon;
  const shin = kit.pieces.find((piece) => piece.id === 'near-right-shin').polygon;
  // The overlapping polygons and this measured bridge are the actual knee region,
  // not an added circular cap. The shoe stays a separate rigid donor.
  path(m, thigh); m.fill();
  path(m, shin); m.fill();
  path(m, [[152, 207], [164, 208], [173, 237], [160, 247], [148, 254], [135, 242], [130, 237], [121, 217]]); m.fill();
  context.globalCompositeOperation = 'destination-in';
  context.drawImage(mask, 0, 0);
  // The retained sheet's checkerboard is bright and nearly neutral. Key it only
  // after this leg-specific mask is applied, preserving the white tee elsewhere
  // in the source crop while preventing enclosed background from entering UVs.
  const pixels = context.getImageData(0, 0, 240, 310);
  for (let i = 0; i < pixels.data.length; i += 4) {
    const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2];
    if (Math.min(r, g, b) >= 224 && Math.max(r, g, b) - Math.min(r, g, b) <= 24) pixels.data[i + 3] = 0;
  }
  context.putImageData(pixels, 0, 0);
  return crop;
}

function stations(hip, knee, ankle, widths) {
  const upper = sub(knee, hip), lower = sub(ankle, knee);
  const directions = [unit(upper), unit(upper), bisector(upper, lower), unit(lower), unit(lower)];
  const centers = [hip, add(hip, mul(upper, .5)), knee, add(knee, mul(lower, .5)), ankle];
  return centers.map((center, index) => {
    const n = normal(directions[index]);
    return { center, left: add(center, mul(n, widths[index] / 2)), right: add(center, mul(n, -widths[index] / 2)) };
  });
}

function affine(sourceTriangle, targetTriangle) {
  const [a, b, c] = sourceTriangle, [u, v, w] = targetTriangle;
  const det = a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y);
  if (Math.abs(det) < 1e-7) throw new Error('degenerate source triangle');
  const solve = (p, q, r) => [
    (p * (b.y - c.y) + q * (c.y - a.y) + r * (a.y - b.y)) / det,
    (p * (c.x - b.x) + q * (a.x - c.x) + r * (b.x - a.x)) / det,
    (p * (b.x * c.y - c.x * b.y) + q * (c.x * a.y - a.x * c.y) + r * (a.x * b.y - b.x * a.y)) / det
  ];
  const [ax, bx, cx] = solve(u.x, v.x, w.x), [ay, by, cy] = solve(u.y, v.y, w.y);
  return [ax, ay, bx, by, cx, cy];
}

function paintTriangle(context, donor, sourceTriangle, targetTriangle) {
  context.save();
  context.beginPath();
  targetTriangle.forEach((p, i) => i ? context.lineTo(p.x, p.y) : context.moveTo(p.x, p.y));
  context.closePath(); context.clip();
  context.transform(...affine(sourceTriangle, targetTriangle));
  context.drawImage(donor, 0, 0);
  context.restore();
}

function meshTriangles(sourceStations, targetStations) {
  const triangles = [];
  for (let i = 0; i < sourceStations.length - 1; i++) {
    const s0 = sourceStations[i], s1 = sourceStations[i + 1], t0 = targetStations[i], t1 = targetStations[i + 1];
    triangles.push([[s0.left, s0.right, s1.right], [t0.left, t0.right, t1.right]]);
    triangles.push([[s0.left, s1.right, s1.left], [t0.left, t1.right, t1.left]]);
  }
  return triangles;
}

function renderPhase(id, donor, sourceStations) {
  const phase = gray.targets[id];
  const joints = phase.joints.right;
  const targetStations = stations(joints.hip, joints.knee, joints.ankle, [27, 30, 31, 27, 23]);
  const canvas = createCanvas(240, 310), context = canvas.getContext('2d');
  const triangles = meshTriangles(sourceStations, targetStations);
  triangles.forEach(([s, t]) => paintTriangle(context, donor, s, t));
  // Keep the terminal shoe out of this first checkpoint. Its existing donor
  // polygon reaches into trouser pixels, so it needs source-pixel review before
  // it can be claimed as a rigid cuff-attached terminal.
  return { canvas, triangles, targetStations };
}

function alphaAudit(canvas) {
  const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
  const seen = new Uint8Array(canvas.width * canvas.height), queue = new Uint32Array(seen.length);
  let opaque = 0, brightNeutralOpaque = 0, components = 0;
  const solid = (index) => data[index * 4 + 3] >= 128;
  for (let index = 0; index < seen.length; index++) {
    if (!solid(index)) continue;
    opaque++;
    const p = index * 4, r = data[p], g = data[p + 1], b = data[p + 2];
    if (Math.min(r, g, b) >= 224 && Math.max(r, g, b) - Math.min(r, g, b) <= 24) brightNeutralOpaque++;
    if (seen[index]) continue;
    components++;
    let read = 0, write = 0; seen[index] = 1; queue[write++] = index;
    while (read < write) {
      const current = queue[read++], x = current % canvas.width, y = Math.floor(current / canvas.width);
      const neighbors = [];
      if (x > 0) neighbors.push(current - 1);
      if (x + 1 < canvas.width) neighbors.push(current + 1);
      if (y > 0) neighbors.push(current - canvas.width);
      if (y + 1 < canvas.height) neighbors.push(current + canvas.width);
      for (const next of neighbors) {
        if (!seen[next] && solid(next)) { seen[next] = 1; queue[write++] = next; }
      }
    }
  }
  return { opaquePixels: opaque, brightNeutralOpaquePixels: brightNeutralOpaque, alphaComponentsAt128: components };
}

const donor = isolatedSourceLeg();
const walkCrop = createCanvas(240, 310);
walkCrop.getContext('2d').drawImage(source, 1000, 360, 240, 310, 0, 0, 240, 310);
const sourceStations = stations(point(119, 198), point(145, 230), point(157, 261), [27, 30, 31, 27, 23]);
const results = ['01', '03'].map((id) => ({ id, ...renderPhase(id, donor, sourceStations) }));
for (const result of results) writeFileSync(resolve(out, `near-right-leg-east-${result.id}.png`), result.canvas.toBuffer('image/png'));
writeFileSync(resolve(out, 'near-right-leg-source.png'), donor.toBuffer('image/png'));
writeFileSync(resolve(out, 'walk-east-a-crop.png'), walkCrop.toBuffer('image/png'));

const sheet = createCanvas(960, 390), sheetContext = sheet.getContext('2d');
sheetContext.fillStyle = '#20242b'; sheetContext.fillRect(0, 0, 960, 390);
sheetContext.font = '18px sans-serif'; sheetContext.fillStyle = '#ffffff';
[['WALK EAST A', walkCrop], ['SOURCE LEG', donor], ['EAST 01', results[0].canvas], ['EAST 03', results[1].canvas]].forEach(([label, canvas], index) => {
  const x = index * 240; sheetContext.fillText(label, x + 12, 24); sheetContext.drawImage(canvas, x, 40);
});
writeFileSync(resolve(out, 'near-right-leg-contact-sheet.png'), sheet.toBuffer('image/png'));

const evidence = {
  schemaVersion: 1,
  status: 'spike-review-required',
  scope: 'gray overshirt near/right trouser leg only; east phases 01 and 03',
  source: { path: sourcePath, crop: { x: 1000, y: 360, width: 240, height: 310 }, anchors: { hip: [119, 198], knee: [145, 230], ankle: [157, 261] } },
  mesh: { stations: 5, triangleCountPerPose: 8, sourceWidths: [27, 30, 31, 27, 23], policy: 'connected two-bone strip; shared knee cross-section; bisector normal at knee; no endpoint disks; source polygon union plus measured knee bridge' },
  targets: Object.fromEntries(results.map(({ id, triangles, targetStations }) => [id, {
    hip: gray.targets[id].joints.right.hip, knee: gray.targets[id].joints.right.knee, ankle: gray.targets[id].joints.right.ankle,
    minimumAbsoluteTriangleArea: Math.min(...triangles.flatMap(([sourceTriangle, targetTriangle]) => [Math.abs(triangleArea(...sourceTriangle)), Math.abs(triangleArea(...targetTriangle))])),
    foldedOrWindingMismatchedTriangles: triangles.filter(([sourceTriangle, targetTriangle]) => triangleArea(...sourceTriangle) * triangleArea(...targetTriangle) <= 0).length,
    sharedKneeEdges: targetStations[2],
    alpha: alphaAudit(results.find((result) => result.id === id).canvas)
  }])),
  sourceAlpha: alphaAudit(donor),
  outputs: { walkEastACrop: 'walk-east-a-crop.png', source: 'near-right-leg-source.png', east01: 'near-right-leg-east-01.png', east03: 'near-right-leg-east-03.png', contactSheet: 'near-right-leg-contact-sheet.png' },
  limitation: 'This isolated proof does not composite torso/hem or the other leg. Any exposed proximal texture gap must be fixed from actual source pixels before expansion.'
};
writeFileSync(resolve(out, 'near-right-leg-evidence.json'), `${JSON.stringify(evidence, null, 2)}\n`);
console.log(JSON.stringify({ out, outputs: evidence.outputs, checks: evidence.targets }, null, 2));
