import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = resolve(import.meta.dirname, '../../..');
const intakeRoot = 'artifacts/character-statics/gs-022-new-v1/employee20-v1';
const outputRoot = 'artifacts/character-statics/employee20-statics-v1';
const assetsRoot = 'tools/character-mapping/employee20-statics-v1/assets';
const manifest = JSON.parse(readFileSync(resolve(repo, intakeRoot, 'manifest.json'), 'utf8'));
const receipt = JSON.parse(readFileSync(resolve(repo, manifest.approvalReceipt.path), 'utf8'));
const references = JSON.parse(readFileSync(resolve(repo, outputRoot, 'reference-manifest.json'), 'utf8'));
const config = JSON.parse(readFileSync(resolve(import.meta.dirname, 'employee20-config.json'), 'utf8'));
const approvedSnapshots = new Map();
for (const id of config.artApprovedIds ?? []) {
  const number = id.slice(-3), snapshotPath = resolve(import.meta.dirname, `approved-employee${number}-7.json`);
  assert(existsSync(snapshotPath), `${id} is marked approved without a durable snapshot`);
  const snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8')); assert.equal(snapshot.identity, id); approvedSnapshots.set(id, snapshot);
}
const shaBytes = (bytes) => createHash('sha256').update(bytes).digest('hex');
const shaFile = (file) => shaBytes(readFileSync(file));
const relative = (...parts) => `${outputRoot}/${parts.join('/')}`;
const at = (...parts) => resolve(repo, outputRoot, ...parts);
const views = ['south', 'east', 'west', 'north'];
const slots = [...views.map((direction) => ({ pose: 'stand', direction })), ...views.map((direction) => ({ pose: 'sit', direction }))];
const receiptById = new Map(receipt.frontCandidates.map((entry) => [entry.id, entry]));

function measureCanvas(canvas, threshold = 20) {
  const { width, height } = canvas; const data = canvas.getContext('2d').getImageData(0, 0, width, height).data;
  let left = width; let top = height; let right = -1; let bottom = -1; let transparent = 0; let partial = 0; let opaque = 0; let boundaryNonzero = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) { const a = data[(y * width + x) * 4 + 3]; if (a === 0) transparent++; else if (a === 255) opaque++; else partial++; if (a > 0 && (x === 0 || y === 0 || x === width - 1 || y === height - 1)) boundaryNonzero++; if (a >= threshold) { left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); } }
  assert(right >= 0, 'pose contains no visible pixels');
  return { visibleBounds: { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 }, alpha: { transparent, partial, opaque, boundaryNonzero, threshold } };
}
async function imageCanvas(file) { const image = await loadImage(file); const canvas = createCanvas(image.width, image.height); canvas.getContext('2d').drawImage(image, 0, 0); return canvas; }
function alphaComponents(canvas, threshold = 1) {
  const { width, height } = canvas; const context = canvas.getContext('2d'); const imageData = context.getImageData(0, 0, width, height); const pixels = imageData.data; const visited = new Uint8Array(width * height); const components = [];
  for (let start = 0; start < width * height; start++) {
    if (visited[start] || pixels[start * 4 + 3] < threshold) continue;
    const queue = [start]; visited[start] = 1; let head = 0; let left = width; let top = height; let right = -1; let bottom = -1;
    while (head < queue.length) { const index = queue[head++], x = index % width, y = Math.floor(index / width); left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y); for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) { const nx = x + dx, ny = y + dy, next = ny * width + nx; if (nx >= 0 && nx < width && ny >= 0 && ny < height && !visited[next] && pixels[next * 4 + 3] >= threshold) { visited[next] = 1; queue.push(next); } } }
    components.push({ pixels: queue, area: queue.length, left, top, right, bottom, centerX: (left + right + 1) / 2 });
  }
  return { components, pixels, imageData };
}
function deriveSourceCells(sheet) {
  const ranked = alphaComponents(sheet, 13).components.sort((a, b) => b.area - a.area).slice(0, 8); assert.equal(ranked.length, 8, 'sheet does not contain eight alpha-separated whole figures');
  const byY = [...ranked].sort((a, b) => (a.top + a.bottom) - (b.top + b.bottom)); const rows = [byY.slice(0, 4).sort((a, b) => a.centerX - b.centerX), byY.slice(4).sort((a, b) => a.centerX - b.centerX)]; const cells = []; const padding = 16;
  for (let row = 0; row < 2; row++) {
    const figures = rows[row]; const xBoundaries = [0]; for (let index = 0; index < 3; index++) xBoundaries.push(Math.floor((figures[index].right + figures[index + 1].left + 1) / 2)); xBoundaries.push(sheet.width);
    for (let column = 0; column < 4; column++) {
      const figure = figures[column], rowBoundary = Math.floor((rows[0][column].bottom + rows[1][column].top + 1) / 2); const x0 = Math.max(xBoundaries[column], figure.left - padding), x1 = Math.min(xBoundaries[column + 1], figure.right + 1 + padding); const y0 = row === 0 ? Math.max(0, figure.top - padding) : Math.max(rowBoundary, figure.top - padding); const y1 = row === 0 ? Math.min(rowBoundary, figure.bottom + 1 + padding) : Math.min(sheet.height, figure.bottom + 1 + padding); assert(x1 > x0 && y1 > y0, `invalid derived figure crop ${row},${column}`);
      const canvas = createCanvas(x1 - x0, y1 - y0); canvas.getContext('2d').drawImage(sheet, x0, y0, x1 - x0, y1 - y0, 0, 0, x1 - x0, y1 - y0); cells.push({ canvas, sourceRect: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }, segmentation: { method: 'eight full-sheet alpha-connected figures grouped by vertical centroid and horizontal order; 16px padding constrained by per-neighbor midpoint boundaries', threshold: 13, rowBoundary, figureBounds: { area: figure.area, left: figure.left, top: figure.top, right: figure.right, bottom: figure.bottom, centerX: figure.centerX } } });
    }
  }
  return cells;
}
function deriveApprovedPilotCells(sheet) {
  const cells = [];
  for (let row = 0; row < 2; row++) { const y0 = Math.round(row * sheet.height / 2), y1 = Math.round((row + 1) * sheet.height / 2); const rowCanvas = createCanvas(sheet.width, y1 - y0); rowCanvas.getContext('2d').drawImage(sheet, 0, y0, sheet.width, y1 - y0, 0, 0, sheet.width, y1 - y0); const major = alphaComponents(rowCanvas, 13).components.sort((a, b) => b.area - a.area).slice(0, 4).sort((a, b) => a.centerX - b.centerX); const boundaries = [0]; for (let index = 0; index < 3; index++) boundaries.push(Math.floor((major[index].right + major[index + 1].left + 1) / 2)); boundaries.push(sheet.width); for (let column = 0; column < 4; column++) { const x0 = boundaries[column], x1 = boundaries[column + 1], figure = major[column]; const canvas = createCanvas(x1 - x0, y1 - y0); canvas.getContext('2d').drawImage(sheet, x0, y0, x1 - x0, y1 - y0, 0, 0, x1 - x0, y1 - y0); cells.push({ canvas, sourceRect: { x: x0, y: y0, width: x1 - x0, height: y1 - y0 }, segmentation: { method: 'frozen approved pilot per-row alpha-component midpoint extraction', threshold: 13, figureBounds: { area: figure.area, left: figure.left, top: figure.top, right: figure.right, bottom: figure.bottom, centerX: figure.centerX } } }); } }
  return cells;
}
function clearIsolatedArtifacts(cell) {
  const context = cell.getContext('2d'); const { components, pixels, imageData } = alphaComponents(cell, 1); const ranked = [...components].sort((a, b) => b.area - a.area); const main = ranked[0]; const keep = (component) => { const dx = Math.max(main.left - component.right - 1, component.left - main.right - 1, 0), dy = Math.max(main.top - component.bottom - 1, component.top - main.bottom - 1, 0); return component === main || component.area >= main.area * 0.005 || Math.hypot(dx, dy) <= 12; };
  const removed = ranked.filter((component) => !keep(component)); if (!removed.length) return { canvas: cell, cleanup: { method: 'alpha connected-component isolation', removedComponents: 0, removedPixels: 0 } };
  for (const component of removed) for (const index of component.pixels) pixels[index * 4 + 3] = 0; context.putImageData(imageData, 0, 0);
  return { canvas: cell, cleanup: { method: 'removed only small alpha-disconnected components more than 12px from the principal whole-body component', removedComponents: removed.length, removedPixels: removed.reduce((sum, component) => sum + component.area, 0) } };
}
function renderCell(cell, scale) {
  const sourceMeasure = measureCanvas(cell); const b = sourceMeasure.visibleBounds;
  const canvas = createCanvas(160, 320); const context = canvas.getContext('2d'); context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
  const translateX = 80 - (b.left + b.right + 1) * scale / 2; const translateY = 287 - (b.bottom + 1) * scale;
  context.drawImage(cell, translateX, translateY, cell.width * scale, cell.height * scale);
  return { canvas, sourceMeasure, transform: { scale, translateX, translateY, bodyAxisX: 80, floorY: 287, policy: 'one uniform whole-body scale and translation; no segmented edits or mirroring' }, ...measureCanvas(canvas) };
}
function writeCanvas(canvas, ...parts) { mkdirSync(resolve(at(...parts), '..'), { recursive: true }); const bytes = canvas.toBuffer('image/png'); writeFileSync(at(...parts), bytes); return { file: relative(...parts), sha256: shaBytes(bytes), width: canvas.width, height: canvas.height }; }
function writePoseCanvas(canvas, parts, expectedSha256) { const bytes = canvas.toBuffer('image/png'); const digest = shaBytes(bytes); if (expectedSha256) assert.equal(digest, expectedSha256, `approved pose drift blocked before write: ${parts.join('/')}`); mkdirSync(resolve(at(...parts), '..'), { recursive: true }); writeFileSync(at(...parts), bytes); return { file: relative(...parts), sha256: digest, width: canvas.width, height: canvas.height }; }
async function poseProof(id, poseEntries, scale, theme) {
  const cellW = 160 * scale, cellH = 320 * scale, labelH = 24; const canvas = createCanvas(cellW * 4, (cellH + labelH) * 2); const context = canvas.getContext('2d');
  context.fillStyle = theme === 'dark' ? '#20252b' : '#eee9df'; context.fillRect(0, 0, canvas.width, canvas.height); context.fillStyle = theme === 'dark' ? '#fff' : '#111'; context.font = `${12 * scale}px sans-serif`;
  for (let index = 0; index < poseEntries.length; index++) { const entry = poseEntries[index]; const image = await loadImage(resolve(repo, entry.file)); const column = index % 4, row = Math.floor(index / 4), x = column * cellW, y = row * (cellH + labelH); context.drawImage(image, x, y, cellW, cellH); context.fillText(`${entry.pose} ${entry.direction}`, x + 4, y + cellH + 16 * scale); }
  return writeCanvas(canvas, 'proofs', id, `${id}-${scale === 1 ? 'native' : '2x'}-${theme}.png`);
}
async function gameProof(id, poseEntries, theme) {
  const canvas = createCanvas(32 * 4, 64 * 2); const context = canvas.getContext('2d'); context.fillStyle = theme === 'dark' ? '#20252b' : '#eee9df'; context.fillRect(0, 0, canvas.width, canvas.height); context.imageSmoothingEnabled = true;
  for (let index = 0; index < poseEntries.length; index++) { const image = await loadImage(resolve(repo, poseEntries[index].file)); context.drawImage(image, index % 4 * 32, Math.floor(index / 4) * 64, 32, 64); }
  return writeCanvas(canvas, 'proofs', id, `${id}-game-32x64-${theme}.png`);
}
function sourceCoordinateProof(id, sheet, sourceRects, contacts, approved) {
  const canvas = createCanvas(sheet.width, sheet.height); const context = canvas.getContext('2d'); context.drawImage(sheet, 0, 0); context.strokeStyle = '#ff2d55'; context.lineWidth = Math.max(2, Math.round(sheet.width / 768)); context.font = `${Math.max(18, Math.round(sheet.width / 60))}px sans-serif`; context.fillStyle = '#ff2d55';
  slots.forEach((slot, index) => { const rect = sourceRects[index]; context.strokeRect(rect.x, rect.y, rect.width, rect.height); context.fillText(`${slot.pose} ${slot.direction} — cell y 0..${rect.height - 1}`, rect.x + 8, rect.y + 28); if (slot.pose === 'sit' && contacts?.[slot.direction] !== undefined) { const y = rect.y + contacts[slot.direction]; context.beginPath(); context.moveTo(rect.x, y); context.lineTo(rect.x + rect.width, y); context.stroke(); } });
  return { ...writeCanvas(canvas, 'proofs', id, `${id}-source-coordinates.png`), status: approved ? 'parent-accepted-authored-contact-lines' : contacts ? 'authored-contact-lines-present-pending-parent-review' : 'source-coordinates-only-contact-measurements-pending-parent-authorship' };
}
async function contactProof(id, sitEntries, contacts, approved) {
  const canvas = createCanvas(320 * 4, 640); const context = canvas.getContext('2d'); context.fillStyle = '#20252b'; context.fillRect(0, 0, canvas.width, canvas.height); context.font = '24px sans-serif'; context.fillStyle = '#fff';
  for (let index = 0; index < 4; index++) { const entry = sitEntries[index]; const image = await loadImage(resolve(repo, entry.file)); context.drawImage(image, index * 320, 0, 320, 640); context.fillText(entry.direction, index * 320 + 8, 30); if (entry.anchors?.seatContact) { const y = entry.anchors.seatContact.y * 2; context.strokeStyle = '#ff2d55'; context.lineWidth = 2; context.beginPath(); context.moveTo(index * 320, y); context.lineTo(index * 320 + 320, y); context.stroke(); } }
  return { ...writeCanvas(canvas, 'proofs', id, `${id}-seat-contact-2x-dark.png`), status: approved ? 'parent-accepted-authored-contact-overlay' : contacts ? 'authored-contact-overlay-pending-parent-review' : 'poses-only-contact-lines-pending-parent-authorship' };
}

assert.equal(references.references.length, 20, 'reference milestone incomplete');
assert.equal(shaFile(resolve(repo, manifest.approvalReceipt.path)), manifest.approvalReceipt.sha256, 'approval receipt changed');
const records = []; let generatedSources = 0; let packaged = 0;
for (const intake of manifest.records) {
  const id = intake.id; const approved = receiptById.get(id); assert(approved && approved.sha256 === intake.poses.stand.south.sha256, `${id} approval binding drift`);
  const characterDir = at('characters', id); mkdirSync(characterDir, { recursive: true });
  const southOutput = at('characters', id, 'stand-south.png'); copyFileSync(resolve(repo, approved.file), southOutput); assert.equal(shaFile(southOutput), approved.sha256, `${id} approved South copy changed`);
  const southCanvas = await imageCanvas(southOutput); const southMeasure = measureCanvas(southCanvas); packaged++;
  const record = { id, role: intake.role, appearanceSpec: intake.appearanceSpec, ownerApproval: 'approved-identity-and-front-concept-only', runtimeReady: false, reference: references.references.find((entry) => entry.id === id), approvedSouth: { sourceFile: approved.file, sourceSha256: approved.sha256, receipt: manifest.approvalReceipt, outputFile: relative('characters', id, 'stand-south.png'), outputSha256: approved.sha256, copyPolicy: 'byte-for-byte approved original reuse', ...southMeasure }, generatedSource: null, poses: { stand: { south: { status: 'owner-approved-original-front-reused', file: relative('characters', id, 'stand-south.png'), sha256: approved.sha256, anchors: { bodyAxisX: 80, floorY: 287 }, ...southMeasure } }, sit: {} }, proofs: null };
  const assetVersion = config.assetVersions[id] ?? 'v1', sourceOrder = config.sourceOrders[id] ?? views; assert.deepEqual([...sourceOrder].sort(), [...views].sort(), `${id} source order must contain each cardinal direction once`); const assetRelative = `${assetsRoot}/${id}-cardinals-${assetVersion}.png`, promptRelative = `${assetsRoot}/${id}-cardinals-${assetVersion}-exact-prompt.txt`; const assetPath = resolve(repo, assetRelative), promptPath = resolve(repo, promptRelative);
  const sourcePairReady = existsSync(assetPath) && existsSync(promptPath);
  if (sourcePairReady) {
    generatedSources++; const sheet = await imageCanvas(assetPath); assert(sheet.width >= 800 && sheet.height >= 600, `${id} source sheet is unexpectedly small`);
    const sourceCells = id === 'gs022-new-employee-001' ? deriveApprovedPilotCells(sheet) : deriveSourceCells(sheet); const physicalSlots = [...sourceOrder.map((direction) => ({ pose: 'stand', direction })), ...sourceOrder.map((direction) => ({ pose: 'sit', direction }))]; const cells = slots.map((slot) => { const sourceIndex = physicalSlots.findIndex((entry) => entry.pose === slot.pose && entry.direction === slot.direction); const sourceCell = sourceCells[sourceIndex]; return { ...slot, sourceIndex, ...sourceCell, ...clearIsolatedArtifacts(sourceCell.canvas) }; }); const sourceRects = cells.map((cell) => cell.sourceRect); const sourceMeasures = cells.map((cell) => measureCanvas(cell.canvas));
    const calibration = sourceMeasures[0].visibleBounds; const requestedScale = southMeasure.visibleBounds.height / calibration.height; const maxScale = Math.min(...sourceMeasures.map((entry) => Math.min(154 / entry.visibleBounds.width, 287 / entry.visibleBounds.height))); const override = config.scaleOverrides[id] ?? 1; const scale = Math.min(requestedScale * override, maxScale);
    const provenanceRelative = [`${assetsRoot}/${id}-cardinals-${assetVersion}-tool-output-provenance.txt`, `${assetsRoot}/${id}-cardinals-${assetVersion}-provenance.md`].find((candidate) => existsSync(resolve(repo, candidate))), provenancePath = provenanceRelative ? resolve(repo, provenanceRelative) : null;
    record.generatedSource = { path: assetRelative, sha256: shaFile(assetPath), exactPromptPath: promptRelative, exactPromptSha256: shaFile(promptPath), toolOutputProvenance: provenancePath ? { path: provenanceRelative, sha256: shaFile(provenancePath) } : { status: 'not-yet-received' }, dimensions: { width: sheet.width, height: sheet.height }, version: assetVersion, physicalOrder: [...sourceOrder.map((direction) => `stand ${direction}`), ...sourceOrder.map((direction) => `sit ${direction}`)], canonicalOutputOrder: ['stand south', 'stand east', 'stand west', 'stand north', 'sit south', 'sit east', 'sit west', 'sit north'], generatedSouthUse: 'calibration-only-excluded-from-final-eight', calibration: { approvedSouthVisibleHeight: southMeasure.visibleBounds.height, generatedSouthVisibleHeight: calibration.height, requestedScale, authoredScaleOverride: override, fitScaleLimit: maxScale, appliedUniformScale: scale, fitConstraintApplied: scale < requestedScale * override, headProportionAcceptance: approvedSnapshots.has(id) ? 'parent-visual-approved' : 'pending-parent-visual-review' } };
    const approvedSnapshot = approvedSnapshots.get(id), fullyApproved = (config.parentApprovedIds ?? []).includes(id); if (approvedSnapshot) { assert.equal(approvedSnapshot.generatedSourceSha256, record.generatedSource.sha256, `${id} approved source drift`); if (approvedSnapshot.seatContactSourceY) assert.deepEqual(approvedSnapshot.seatContactSourceY, config.seatContacts[id], `${id} approved contact coordinates drift`); }
    const poseEntries = [record.poses.stand.south];
    for (let index = 1; index < cells.length; index++) {
      const cell = cells[index], rendered = renderCell(cell.canvas, scale), posePath = ['characters', id, `${cell.pose}-${cell.direction}.png`]; const frozen = approvedSnapshot?.poses.find((entry) => entry.pose === cell.pose && entry.direction === cell.direction); const output = writePoseCanvas(rendered.canvas, posePath, frozen?.sha256); if (frozen) assert.deepEqual({ pose: cell.pose, direction: cell.direction, file: output.file, sha256: output.sha256 }, frozen, `${id} frozen pose binding drift`); const contactY = cell.pose === 'sit' ? config.seatContacts[id]?.[cell.direction] : undefined;
      const pose = { status: fullyApproved ? 'parent-visual-approved-static-art-ready-local-only' : approvedSnapshot ? 'parent-art-approved-contact-review-pending' : 'source-packaged-pending-parent-visual-review', ...output, sourceCell: { canonicalIndex: index, sourceIndex: cell.sourceIndex, row: Math.floor(cell.sourceIndex / 4), column: cell.sourceIndex % 4, rect: cell.sourceRect, segmentation: cell.segmentation, cleanup: cell.cleanup, visibleBounds: rendered.sourceMeasure.visibleBounds }, transform: rendered.transform, visibleBounds: rendered.visibleBounds, alpha: rendered.alpha };
      if (cell.pose === 'sit') pose.anchors = contactY === undefined ? { bodyAxisX: 80, floorY: 287, seatContact: { status: 'pending-parent-authored-source-pixel-measurement' } } : { bodyAxisX: 80, floorY: 287, seatContact: { status: fullyApproved ? 'parent-accepted-authored-source-pixel-measurement' : 'authored-source-pixel-measurement-pending-parent-review', sourceY: contactY, y: contactY * scale + rendered.transform.translateY, method: 'authored source-cell pixel measurement at underside posterior/upper-thigh chair support plane' } };
      record.poses[cell.pose][cell.direction] = pose; poseEntries.push({ pose: cell.pose, direction: cell.direction, ...pose }); packaged++;
    }
    const normalizedEntries = slots.map((slot) => ({ pose: slot.pose, direction: slot.direction, ...record.poses[slot.pose][slot.direction] })); const contacts = config.seatContacts[id];
    record.proofs = { nativeLight: await poseProof(id, normalizedEntries, 1, 'light'), nativeDark: await poseProof(id, normalizedEntries, 1, 'dark'), enlargedLight: await poseProof(id, normalizedEntries, 2, 'light'), enlargedDark: await poseProof(id, normalizedEntries, 2, 'dark'), gameLight: await gameProof(id, normalizedEntries, 'light'), gameDark: await gameProof(id, normalizedEntries, 'dark'), sourceCoordinates: sourceCoordinateProof(id, sheet, sourceRects, contacts, fullyApproved), seatContact: await contactProof(id, views.map((direction) => ({ direction, ...record.poses.sit[direction] })), contacts, fullyApproved) };
  }
  for (const pose of ['stand', 'sit']) for (const direction of views) if (!record.poses[pose][direction]) record.poses[pose][direction] = { status: 'pending-source-art' };
  records.push(record);
}
const artApprovedNewPoses = approvedSnapshots.size * 7, fullyApprovedNewPoses = (config.parentApprovedIds ?? []).length * 7, packageComplete = generatedSources === 20 && artApprovedNewPoses === 140 && fullyApprovedNewPoses === 140; const outputManifest = { schemaVersion: 1, status: packageComplete ? 'parent-production-qa-approved-local-static-package-complete' : generatedSources ? 'partial-cardinal-sources-packaged-with-reviewed-pilot' : 'approved-fronts-reused-new-cardinals-pending-source-art', runtimeIntegration: { authorized: false, ready: false }, canvas: { width: 160, height: 320, bodyAxisX: 80, floorY: 287 }, sourceContract: { grid: '2 rows x 4 columns', order: ['stand south', 'stand east', 'stand west', 'stand north', 'sit south', 'sit east', 'sit west', 'sit north'], generatedSouth: 'calibration-only-excluded-from-final-eight', finalSouth: 'byte-for-byte owner-approved GS-022 original' }, counts: { identities: 20, requiredPoses: 160, approvedOriginalSouth: 20, generatedSourcesAvailable: generatedSources, parentArtApprovedNewPoses: artApprovedNewPoses, parentFullyApprovedNewPoses: fullyApprovedNewPoses, newlyPackagedArtPendingReview: generatedSources * 7 - artApprovedNewPoses, contactReviewPendingForArtApprovedPoses: artApprovedNewPoses - fullyApprovedNewPoses, packagedPoses: packaged, pendingPoses: 160 - packaged }, records };
writeFileSync(at('manifest.json'), `${JSON.stringify(outputManifest, null, 2)}\n`);
console.log(JSON.stringify({ status: 'PASS', ...outputManifest.counts, runtimeReady: false }));
