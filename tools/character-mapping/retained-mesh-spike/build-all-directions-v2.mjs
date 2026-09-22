import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const out = resolve(repo, 'artifacts/character-movement/retained-mesh-spike/all-directions-v2');
const framesDir = resolve(out, 'frames');
mkdirSync(framesDir, { recursive: true });
const oldBase = resolve(repo, 'artifacts/character-movement/retained-donor-merge/all-directions-v1');
const oldManifest = JSON.parse(readFileSync(resolve(oldBase, 'all-directions-manifest.json')));
const lateralBase = resolve(repo, 'artifacts/character-movement/retained-mesh-spike/lateral-v2');
const lateralManifest = JSON.parse(readFileSync(resolve(lateralBase, 'lateral-v2-manifest.json')));
const kits = JSON.parse(readFileSync(resolve(repo, 'tools/character-mapping/retained-donor-merge/all-directions-kits.json')));
const phases = oldManifest.phaseIds;
const p = (x, y) => ({ x, y });
const add = (a, b) => p(a.x + b.x, a.y + b.y), sub = (a, b) => p(a.x - b.x, a.y - b.y), mul = (a, n) => p(a.x * n, a.y * n);
const unit = (a) => mul(a, 1 / Math.hypot(a.x, a.y)), normal = (a) => p(-a.y, a.x);
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');

function path(ctx, vertices) { ctx.beginPath(); vertices.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); }
function crop(source, box) { const c = createCanvas(240, Math.max(340, box.height)), x = c.getContext('2d'); x.drawImage(source, box.x, box.y, box.width, box.height, 0, 0, box.width, box.height); return c; }
function key(canvas) { const x = canvas.getContext('2d'), d = x.getImageData(0, 0, canvas.width, canvas.height), seen = new Uint8Array(canvas.width * canvas.height), queue = new Uint32Array(seen.length); let head = 0, tail = 0; const background = index => { const i = index * 4, r = d.data[i], g = d.data[i + 1], b = d.data[i + 2]; return d.data[i + 3] && Math.min(r, g, b) >= 224 && Math.max(r, g, b) - Math.min(r, g, b) <= 24; }; const addIndex = index => { if (!seen[index] && background(index)) { seen[index] = 1; queue[tail++] = index; } }; for (let px = 0; px < canvas.width; px++) { addIndex(px); addIndex((canvas.height - 1) * canvas.width + px); } for (let py = 0; py < canvas.height; py++) { addIndex(py * canvas.width); addIndex(py * canvas.width + canvas.width - 1); } while (head < tail) { const current = queue[head++], px = current % canvas.width, py = Math.floor(current / canvas.width); if (px) addIndex(current - 1); if (px < canvas.width - 1) addIndex(current + 1); if (py) addIndex(current - canvas.width); if (py < canvas.height - 1) addIndex(current + canvas.width); } for (let index = 0; index < seen.length; index++) if (seen[index]) d.data[index * 4 + 3] = 0; x.putImageData(d, 0, 0); return canvas; }
function donor(source, polygons) { const c = createCanvas(240, 340), x = c.getContext('2d'); for (const polygon of polygons) { path(x, polygon); x.fill(); } x.globalCompositeOperation = 'source-in'; x.drawImage(source, 0, 0); const pixels = x.getImageData(0, 0, 240, 340); for (let i = 0; i < pixels.data.length; i += 4) { const r = pixels.data[i], g = pixels.data[i + 1], b = pixels.data[i + 2]; if (Math.min(r, g, b) >= 224 && Math.max(r, g, b) - Math.min(r, g, b) <= 24) pixels.data[i + 3] = 0; } x.putImageData(pixels, 0, 0); return c; }
function box(x1, y1, x2, y2, padX, topPad, bottomPad) { return [[Math.min(x1, x2) - padX, y1 - topPad], [Math.max(x1, x2) + padX, y1 - topPad], [Math.max(x1, x2) + padX, y2 + bottomPad], [Math.min(x1, x2) - padX, y2 + bottomPad]]; }
function centers(a, b, c) { return [a, add(a, mul(sub(b, a), .5)), b, add(b, mul(sub(c, b), .5)), c]; }
function sections(points, widths) { return points.map((q, i) => { const prev = points[Math.max(0, i - 1)], next = points[Math.min(points.length - 1, i + 1)], n = normal(unit(sub(next, prev))), w = widths[i] / 2; return [add(q, mul(n, w)), add(q, mul(n, -w))]; }); }
function bary(q, [a, b, c]) { const d = (b.y - c.y) * (a.x - c.x) + (c.x - b.x) * (a.y - c.y); return [((b.y - c.y) * (q.x - c.x) + (c.x - b.x) * (q.y - c.y)) / d, ((c.y - a.y) * (q.x - c.x) + (a.x - c.x) * (q.y - c.y)) / d, d]; }
function triangle(output, source, target, original, metrics) { const minX = Math.max(0, Math.floor(Math.min(...target.map(q => q.x)))), maxX = Math.min(239, Math.ceil(Math.max(...target.map(q => q.x)))), minY = Math.max(0, Math.floor(Math.min(...target.map(q => q.y)))), maxY = Math.min(309, Math.ceil(Math.max(...target.map(q => q.y)))); if (bary(original[0], original)[2] * bary(target[0], target)[2] <= 0) throw Error('folded mesh'); metrics.triangles++; for (let y = minY; y <= maxY; y++) for (let x = minX; x <= maxX; x++) { const [u, v] = bary(p(x + .5, y + .5), target); if (u < 0 || v < 0 || u + v > 1) continue; const sx = Math.round(u * original[0].x + v * original[1].x + (1 - u - v) * original[2].x), sy = Math.round(u * original[0].y + v * original[1].y + (1 - u - v) * original[2].y), si = (sy * 240 + sx) * 4; if (!source.data[si + 3]) continue; const oi = (y * 240 + x) * 4; output.data.set(source.data.subarray(si, si + 4), oi); } }
function mesh(canvas, sourceCanvas, sourcePoints, targetPoints, widths, metrics, id) { const x = canvas.getContext('2d'), output = x.getImageData(0, 0, 240, 310), source = sourceCanvas.getContext('2d').getImageData(0, 0, 240, 340), a = sections(sourcePoints, widths), b = sections(targetPoints, widths); for (let strip = 0; strip < 4; strip++) for (const indices of [[0, 1, 2], [0, 2, 3]]) { const aq = [a[strip][0], a[strip][1], a[strip + 1][1], a[strip + 1][0]], bq = [b[strip][0], b[strip][1], b[strip + 1][1], b[strip + 1][0]]; triangle(output, source, indices.map(i => bq[i]), indices.map(i => aq[i]), metrics); } x.putImageData(output, 0, 0); metrics.meshes.push({ id, source: sourcePoints, target: targetPoints, widths }); }
function rigid(canvas, image, from, to, metrics, id) { const [a, b] = from, [u, v] = to, sourceAngle = Math.atan2(b.y - a.y, b.x - a.x), targetAngle = Math.atan2(v.y - u.y, v.x - u.x), scale = Math.hypot(v.x - u.x, v.y - u.y) / Math.hypot(b.x - a.x, b.y - a.y), x = canvas.getContext('2d'); x.save(); x.translate(u.x, u.y); x.rotate(targetAngle - sourceAngle); x.scale(scale, scale); x.translate(-a.x, -a.y); x.drawImage(image, 0, 0); x.restore(); metrics.terminals.push({ id, sourceStart: a, sourceEnd: b, targetStart: u, targetEnd: v, scale, rotationRadians: targetAngle - sourceAngle }); }

function definitions(view, characterKit) {
  const rest = characterKit.rest[view], viewKit = kits.views[view], result = {};
  const screenLeftHip = rest.hipRightX, screenRightHip = rest.hipLeftX, shoeMidpoint = (screenLeftHip + screenRightHip) / 2;
  for (const screenSide of ['left', 'right']) {
    const side = viewKit.screenSideToAnatomy[screenSide];
    const shoulderX = screenSide === 'left' ? rest.shoulderRightX : rest.shoulderLeftX;
    const elbowX = screenSide === 'left' ? rest.elbowRightX : rest.elbowLeftX;
    const wristX = screenSide === 'left' ? rest.wristRightX : rest.wristLeftX;
    const hipX = screenSide === 'left' ? rest.hipRightX : rest.hipLeftX;
    result[side] = {
      armSource: [p(shoulderX, rest.shoulderY), p(elbowX, rest.elbowY), p(wristX, rest.wristY)],
      legSource: [p(hipX, rest.hipY), p(hipX, rest.kneeY), p(hipX, rest.ankleY)],
      handPair: [p(wristX, rest.wristY - 3), p(wristX, rest.wristY + 9)],
      shoePair: [p(hipX, rest.ankleY), p(hipX, rest.soleY)],
      armPolygons: [box(shoulderX, rest.shoulderY, elbowX, rest.elbowY, 9, 5, 6), box(elbowX, rest.elbowY, wristX, rest.wristY, 9, 6, 2)],
      legPolygons: [box(hipX, rest.hipY + 2, hipX, rest.kneeY, 14, 0, 5), box(hipX, rest.kneeY, hipX, rest.ankleY, 13, 5, 2)],
      handPolygon: box(wristX, rest.wristY - 3, wristX, rest.wristY + 11, 10, 0, 0),
      shoePolygon: hipX < shoeMidpoint
        ? [[hipX - 23, rest.ankleY - 7], [shoeMidpoint - 2, rest.ankleY - 7], [shoeMidpoint - 2, rest.soleY + 8], [hipX - 23, rest.soleY + 8]]
        : [[shoeMidpoint + 2, rest.ankleY - 7], [hipX + 23, rest.ankleY - 7], [hipX + 23, rest.soleY + 8], [shoeMidpoint + 2, rest.soleY + 8]],
    };
  }
  return result;
}

function makeBody(walk, view, characterKit) {
  const c = createCanvas(240, 340), x = c.getContext('2d'), viewKit = kits.views[view], dx = viewKit.sourceAxisX - 105, rest = characterKit.rest[view];
  const shoulderLeft = rest.shoulderRightX - 6, shoulderRight = rest.shoulderLeftX + 6;
  const hipLeft = rest.hipRightX - 12, hipRight = rest.hipLeftX + 12;
  const bodyClip = [[shoulderLeft, rest.shoulderY - 35], [shoulderRight, rest.shoulderY - 35], [shoulderRight, rest.shoulderY + 12], [hipRight, 218], [hipRight, 233], [hipLeft, 233], [hipLeft, 218], [shoulderLeft, rest.shoulderY + 12]];
  const head = viewKit.head.map(([px, py]) => [px + dx, py]);
  for (const polygon of [bodyClip, head]) { x.save(); path(x, polygon); x.clip(); x.drawImage(walk, 0, 0); x.restore(); }
  return c;
}

const characters = [];
for (const characterKit of kits.characters) {
  const oldCharacter = oldManifest.characters.find(c => c.id === characterKit.id);
  const lateralCharacter = lateralManifest.characters.find(c => c.id === characterKit.id);
  const sourceBytes = readFileSync(resolve(repo, oldCharacter.sourcePath));
  if (sha(sourceBytes) !== oldCharacter.sourceSha256) throw Error(`${characterKit.id} source changed`);
  const source = await loadImage(resolve(repo, oldCharacter.sourcePath));
  const directions = { east: {}, west: {}, south: {}, north: {} };
  for (const direction of ['east', 'west']) for (const record of lateralCharacter.directions[direction]) {
    const cleanBytes = readFileSync(resolve(lateralBase, record.file));
    const clean = `frames/${characterKit.id}-${direction}-${record.phaseId}.png`;
    writeFileSync(resolve(out, clean), cleanBytes);
    const oldGuide = oldCharacter.directions[direction][record.phaseId].guide, guideBytes = readFileSync(resolve(oldBase, oldGuide));
    const guide = `frames/${characterKit.id}-${direction}-${record.phaseId}-guide.png`; writeFileSync(resolve(out, guide), guideBytes);
    directions[direction][record.phaseId] = { clean, guide, sha256: { clean: sha(cleanBytes), guide: sha(guideBytes) }, geometry: record.targets, transforms: { triangleCount: record.triangles, terminals: record.transforms }, provenance: 'retained connected source-textured lateral-v2 mesh' };
  }
  const donorViews = {};
  for (const view of ['south', 'north']) {
    const walk = key(crop(source, kits.views[view].crop)), defs = definitions(view, characterKit), body = makeBody(walk, view, characterKit), donors = {};
    for (const side of ['left', 'right']) donors[side] = { arm: donor(walk, defs[side].armPolygons), leg: donor(walk, defs[side].legPolygons), hand: donor(walk, [defs[side].handPolygon]), shoe: donor(walk, [defs[side].shoePolygon]) };
    donorViews[view] = { walk, defs, body, donors };
    for (const phaseId of phases) {
      const authoritative = oldCharacter.directions[view][phaseId].geometry, frame = authoritative.frame, visibility = authoritative.visibility;
      const canvas = createCanvas(240, 310), metrics = { triangles: 0, meshes: [], terminals: [] };
      for (const side of visibility.legsFarToNear) rigid(canvas, donors[side].shoe, defs[side].shoePair, [frame.joints[side].ankle, frame.joints[side].contact], metrics, `${side}-shoe`);
      for (const side of visibility.legsFarToNear) mesh(canvas, donors[side].leg, centers(...defs[side].legSource), centers(frame.joints[side].hip, frame.joints[side].knee, frame.joints[side].ankle), [characterKit.widths.thigh, characterKit.widths.thigh, (characterKit.widths.thigh + characterKit.widths.shin) / 2, characterKit.widths.shin, characterKit.widths.shin], metrics, `${side}-leg`);
      const farArm = visibility.armsFarToNear[0], nearArm = visibility.armsFarToNear[1];
      rigid(canvas, donors[farArm].hand, defs[farArm].handPair, [frame.joints[farArm].wrist, frame.joints[farArm].hand], metrics, `${farArm}-hand`);
      mesh(canvas, donors[farArm].arm, centers(...defs[farArm].armSource), centers(frame.joints[farArm].shoulder, frame.joints[farArm].elbow, frame.joints[farArm].wrist), [characterKit.widths.upperArm, characterKit.widths.upperArm, (characterKit.widths.upperArm + characterKit.widths.forearm) / 2, characterKit.widths.forearm, characterKit.widths.forearm], metrics, `${farArm}-arm`);
      const sourceHip = characterKit.sourceBodyHip[view], targetHip = frame.body.axisBottom, bodyTranslate = { x: targetHip.x - sourceHip[0], y: targetHip.y - sourceHip[1] };
      canvas.getContext('2d').drawImage(body, bodyTranslate.x, bodyTranslate.y);
      rigid(canvas, donors[nearArm].hand, defs[nearArm].handPair, [frame.joints[nearArm].wrist, frame.joints[nearArm].hand], metrics, `${nearArm}-hand`);
      mesh(canvas, donors[nearArm].arm, centers(...defs[nearArm].armSource), centers(frame.joints[nearArm].shoulder, frame.joints[nearArm].elbow, frame.joints[nearArm].wrist), [characterKit.widths.upperArm, characterKit.widths.upperArm, (characterKit.widths.upperArm + characterKit.widths.forearm) / 2, characterKit.widths.forearm, characterKit.widths.forearm], metrics, `${nearArm}-arm`);
      const clean = `frames/${characterKit.id}-${view}-${phaseId}.png`, bytes = canvas.toBuffer('image/png'); writeFileSync(resolve(out, clean), bytes);
      const oldGuide = oldCharacter.directions[view][phaseId].guide, guideBytes = readFileSync(resolve(oldBase, oldGuide)), guide = `frames/${characterKit.id}-${view}-${phaseId}-guide.png`; writeFileSync(resolve(out, guide), guideBytes);
      directions[view][phaseId] = { clean, guide, sha256: { clean: sha(bytes), guide: sha(guideBytes) }, geometry: authoritative, transforms: { triangleCount: metrics.triangles, body: { sourceHip, targetHip, translate: bodyTranslate }, meshes: metrics.meshes, terminals: metrics.terminals }, provenance: `native ${view} connected source-textured two-bone mesh with whole rigid hands/shoes` };
    }
  }
  const donorSheet = createCanvas(1920, 1020), donorCtx = donorSheet.getContext('2d'); donorCtx.fillStyle = '#1d2128'; donorCtx.fillRect(0, 0, 1920, 1020); donorCtx.fillStyle = '#fff'; donorCtx.font = '16px sans-serif';
  let index = 0; for (const view of ['south', 'north']) { const bx = index % 8 * 240, by = Math.floor(index / 8) * 340; donorCtx.fillText(`${view} body`, bx + 4, by + 18); donorCtx.drawImage(donorViews[view].body, bx, by + 20); index++; for (const side of ['left', 'right']) for (const part of ['leg', 'arm', 'hand', 'shoe']) { const x = index % 8 * 240, y = Math.floor(index / 8) * 340; donorCtx.fillText(`${view} ${side} ${part}`, x + 4, y + 18); donorCtx.drawImage(donorViews[view].donors[side][part], x, y + 20); index++; } }
  const donorFile = `${characterKit.id}-ns-donors.png`, donorBytes = donorSheet.toBuffer('image/png'); writeFileSync(resolve(out, donorFile), donorBytes);
  const staticAssets = {}; for (const mode of ['standSouth', 'sitSouth']) { const oldStatic = oldCharacter.static[mode], cleanBytes = readFileSync(resolve(oldBase, oldStatic.clean)), guideBytes = readFileSync(resolve(oldBase, oldStatic.guide)), clean = `frames/${characterKit.id}-${mode}.png`, guide = `frames/${characterKit.id}-${mode}-guide.png`; writeFileSync(resolve(out, clean), cleanBytes); writeFileSync(resolve(out, guide), guideBytes); staticAssets[mode] = { ...oldStatic, clean, guide, sha256: { clean: sha(cleanBytes), guide: sha(guideBytes) } }; }
  characters.push({ ...oldCharacter, directions, static: staticAssets, donorKits: { east: lateralCharacter.kit, west: { ...lateralCharacter.kit, reflectionAxisX: lateralCharacter.reflectionAxisX }, south: { sourceCrop: kits.views.south.crop, sourceBodyHip: characterKit.sourceBodyHip.south, definitions: donorViews.south.defs }, north: { sourceCrop: kits.views.north.crop, sourceBodyHip: characterKit.sourceBodyHip.north, definitions: donorViews.north.defs } }, nsDonorSheet: { file: donorFile, sha256: sha(donorBytes) }, limitations: ['review candidate only; source-backed mesh seams require visual acceptance'] });
}

const reviewSheets = {};
for (const direction of ['east', 'west', 'south', 'north']) {
  const sheet = createCanvas(1920, 640), ctx = sheet.getContext('2d'); ctx.fillStyle = '#1d2128'; ctx.fillRect(0, 0, 1920, 640); ctx.fillStyle = '#fff'; ctx.font = '18px sans-serif'; ctx.fillText(`${direction.toUpperCase()} connected retained mesh — olive then gray`, 8, 20);
  for (let row = 0; row < characters.length; row++) for (let column = 0; column < phases.length; column++) { const record = characters[row].directions[direction][phases[column]], image = await loadImage(resolve(out, record.clean)); ctx.drawImage(image, column * 240, 24 + row * 308); ctx.fillText(phases[column], column * 240 + 8, 44 + row * 308); }
  const file = `review-${direction}.png`, bytes = sheet.toBuffer('image/png'); writeFileSync(resolve(out, file), bytes); reviewSheets[direction] = { file, sha256: sha(bytes) };
}

const manifest = { schemaVersion: 2, status: 'review-required', acceptedSolvers: oldManifest.acceptedSolvers, phaseIds: phases, directions: ['east', 'west', 'south', 'north'], characters, reviewSheets, invariants: ['64 clean walk frames at 240x310', 'connected two-bone limb meshes with eight triangles per limb', 'whole rigid source hands map wrist-to-hand and shoes map ankle-to-contact', 'authoritative all-directions-v1 target geometry and visibility retained', 'standing/sitting source assets and guides copied byte-for-byte'], limitations: ['two retained identities only; no runtime integration', 'visual review required for source mask seams and isolated antialias pixels'] };
writeFileSync(resolve(out, 'all-directions-v2-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(JSON.stringify({ out, characters: characters.length, walkFrames: characters.length * 32, reviewSheets: manifest.reviewSheets }, null, 2));
