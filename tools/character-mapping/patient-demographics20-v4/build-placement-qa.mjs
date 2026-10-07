import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { runtimeIntegrationState } from './runtime-contract.mjs';

const tool = resolve(fileURLToPath(new URL('.', import.meta.url)));
const repo = resolve(tool, '../../..');
const root = resolve(repo, 'artifacts/character-statics/patient-demographics20-v4');
const packageRoot = resolve(root, 'packages');
const diagnosticRoot = resolve(root, 'placement-qa');
const staging = JSON.parse(readFileSync(resolve(root, 'staging-registry.json'), 'utf8'));
const integration = runtimeIntegrationState();
assert.deepEqual(staging.runtimeIntegration, integration);
const approvedPresentationFile = resolve(repo, 'apps/player/src/facility/approvedRoomPresentation.ts');
const proofDataFile = resolve(repo, 'apps/player/src/facility/approvedRoomProofData.json');
const characterPresentationFile = resolve(repo, 'apps/player/src/facility/characterPresentation.ts');
const characterBitmapFile = resolve(repo, 'apps/player/src/art/characterBitmapArt.ts');
const approvedPresentationSource = readFileSync(approvedPresentationFile, 'utf8');
const characterPresentationSource = readFileSync(characterPresentationFile, 'utf8');
const characterBitmapSource = readFileSync(characterBitmapFile, 'utf8');
const proofData = JSON.parse(readFileSync(proofDataFile, 'utf8'));
const hash = file => createHash('sha256').update(readFileSync(file)).digest('hex');
const relative = file => file.slice(repo.length + 1).replaceAll('\\', '/');

const numbers = (match, label) => {
  assert(match, `could not read ${label} from approved runtime source`);
  return match.slice(1).map(Number);
};
const chairCropValues = numbers(
  approvedPresentationSource.match(/\["receptionist-chair", \[(\d+), (\d+), (\d+), (\d+)\]\]/),
  'receptionist-chair source crop',
);
const [chairCropX, chairCropY, chairCropWidth, chairCropHeight] = chairCropValues;
const chairCrop = { x: chairCropX, y: chairCropY, width: chairCropWidth, height: chairCropHeight };
const [fixtureSeatX, fixtureSeatY] = numbers(
  approvedPresentationSource.match(/id: "receptionist-chair"[^\n]*seat: \[([\d.]+), ([\d.]+)\]/),
  'receptionist-chair seat',
);
const [southSeatInsetTiles] = numbers(
  approvedPresentationSource.match(/APPROVED_SOUTH_SEAT_CUSHION_INSET_TILES = ([\d.]+)/),
  'approved south seat inset',
);
assert(characterPresentationSource.includes('export const MAP_CHARACTER_REFERENCE_TILE_SIZE = 52;'));
assert(characterPresentationSource.includes('export const CHARACTER_STILL_WIDTH_IN_TILES = 1.35 * (181 / 128) * (160 / 287);'));
assert(characterBitmapSource.includes('export const CHARACTER_STILL_VISIBLE_HEIGHT_CAP = 246;'));

const tileSize = 52;
const nativeWidth = 160;
const nativeHeight = 320;
const floorY = 287;
const visibleHeightCap = 246;
const widthInTiles = 1.35 * (181 / 128) * (160 / 287);
const proofCapture = proofData.rooms.frontDesk.orientations[0];
const proofTilePixels = proofCapture.coordinateSpace.tilePixels;
const [proofOriginX, proofOriginY] = proofCapture.coordinateSpace.floorOriginPixels;
const chairCall = proofCapture.drawImages.find(call =>
  call.args.length === 8 &&
  chairCropValues.every((value, index) => call.args[index] === value),
);
assert(chairCall, 'approved front-desk proof has no receptionist-chair draw call');
const [proofChairX, proofChairY, proofChairWidth, proofChairHeight] = chairCall.args.slice(-4);
const chairFile = resolve(repo, 'apps/player/public/art/rooms/gs015-v1/front-desk/furniture.webp');
assert(existsSync(chairFile), 'front-desk furniture asset missing');
assert.equal(hash(chairFile), chairCall.src.sha256.toLowerCase(), 'chair asset differs from approved proof');
const chair = await loadImage(chairFile);
assert(chair.width >= chairCrop.x + chairCrop.width && chair.height >= chairCrop.y + chairCrop.height, 'approved chair crop outside furniture asset');

const destinationTopLeftTiles = [
  (proofChairX - proofOriginX) / proofTilePixels,
  (proofChairY - proofOriginY) / proofTilePixels,
];
const renderSizeTiles = [
  proofChairWidth / proofTilePixels,
  proofChairHeight / proofTilePixels,
];
const runtimeChair = {
  left: Math.round(destinationTopLeftTiles[0] * tileSize),
  top: Math.round(destinationTopLeftTiles[1] * tileSize),
  width: Math.round(renderSizeTiles[0] * tileSize),
  height: Math.round(renderSizeTiles[1] * tileSize),
};
const approvedSeat = {
  x: fixtureSeatX,
  y: fixtureSeatY - southSeatInsetTiles,
};
const worldSeat = {
  x: approvedSeat.x * tileSize,
  y: approvedSeat.y * tileSize,
};
mkdirSync(diagnosticRoot, { recursive: true });

function write(file, canvas) {
  const bytes = canvas.toBuffer('image/png');
  writeFileSync(file, bytes);
  return { path: relative(file), sha256: createHash('sha256').update(bytes).digest('hex'), width: canvas.width, height: canvas.height };
}
function annotate(context, text, x, y, color = '#ffffff', size = 15) {
  context.fillStyle = color;
  context.font = `${size}px sans-serif`;
  context.fillText(text, x, y);
}
function drawPanel(context, pose, geometry, panelX, panelY, zoom, overlay) {
  const viewportLeft = .45 * tileSize;
  const viewportTop = -.25 * tileSize;
  const projectX = value => panelX + (value - viewportLeft) * zoom;
  const projectY = value => panelY + (value - viewportTop) * zoom;
  const panelWidth = 2.15 * tileSize * zoom;
  const panelHeight = 2.45 * tileSize * zoom;
  context.save();
  context.beginPath();
  context.rect(panelX, panelY, panelWidth, panelHeight);
  context.clip();
  context.fillStyle = '#e8d7b3';
  context.fillRect(panelX, panelY, panelWidth, panelHeight);
  context.strokeStyle = 'rgba(105,78,48,.18)';
  context.lineWidth = 1;
  for (let tile = 0; tile <= 3; tile += 1) {
    const x = projectX(tile * tileSize);
    const y = projectY(tile * tileSize);
    context.beginPath(); context.moveTo(x, panelY); context.lineTo(x, panelY + panelHeight); context.stroke();
    context.beginPath(); context.moveTo(panelX, y); context.lineTo(panelX + panelWidth, y); context.stroke();
  }
  context.imageSmoothingEnabled = false;
  context.drawImage(
    chair,
    chairCrop.x,
    chairCrop.y,
    chairCrop.width,
    chairCrop.height,
    projectX(runtimeChair.left),
    projectY(runtimeChair.top),
    runtimeChair.width * zoom,
    runtimeChair.height * zoom,
  );
  context.drawImage(
    pose,
    projectX(geometry.frameLeft),
    projectY(geometry.frameTop),
    geometry.renderedWidth * zoom,
    geometry.renderedHeight * zoom,
  );
  if (overlay) {
    context.strokeStyle = '#22d3ee';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(projectX(runtimeChair.left), projectY(worldSeat.y));
    context.lineTo(projectX(runtimeChair.left + runtimeChair.width), projectY(worldSeat.y));
    context.stroke();
    context.fillStyle = '#22d3ee';
    context.beginPath();
    context.arc(projectX(worldSeat.x), projectY(worldSeat.y), 4, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = '#f472b6';
    context.lineWidth = 1.5;
    context.strokeRect(
      projectX(geometry.visibleLeft),
      projectY(geometry.visibleTop),
      geometry.visibleWidth * zoom,
      geometry.visibleHeight * zoom,
    );
  }
  context.restore();
  context.strokeStyle = '#67727d';
  context.strokeRect(panelX + .5, panelY + .5, panelWidth - 1, panelHeight - 1);
}

const diagnostics = [];
for (const entry of staging.entries) {
  const packageManifestFile = resolve(repo, entry.manifest);
  const packageManifest = JSON.parse(readFileSync(packageManifestFile, 'utf8'));
  const standSouth = packageManifest.poses.stand.south;
  const sitSouth = packageManifest.poses.sit.south;
  const poseFile = resolve(repo, sitSouth.file);
  const pose = await loadImage(poseFile);
  assert.equal(pose.width, nativeWidth, `${entry.number} seated width`);
  assert.equal(pose.height, nativeHeight, `${entry.number} seated height`);
  const standingVisibleHeight = standSouth.anchors.floorY - standSouth.visibleBounds.y;
  const identityScale = Math.min(1, visibleHeightCap / standingVisibleHeight);
  const renderedWidth = Math.max(1, Math.round(tileSize * widthInTiles * identityScale));
  const renderedHeight = renderedWidth * 2;
  const seatContactY = sitSouth.anchors.seatContactY;
  assert(Number.isFinite(seatContactY), `${entry.number} has no seated south contact`);
  const adjustedBaseY = worldSeat.y + (floorY - seatContactY) * (renderedHeight / nativeHeight);
  const roundedBaseY = Math.round(adjustedBaseY);
  const frameLeft = Math.round(worldSeat.x) - renderedWidth / 2;
  const frameTop = roundedBaseY - floorY * (renderedHeight / nativeHeight);
  const geometry = {
    identityScale,
    standingVisibleHeight,
    renderedWidth,
    renderedHeight,
    seatContactY,
    adjustedBaseY,
    roundedBaseY,
    frameLeft,
    frameTop,
    mappedSeatContactY: frameTop + seatContactY * (renderedHeight / nativeHeight),
    visibleLeft: frameLeft + sitSouth.visibleBounds.x * (renderedWidth / nativeWidth),
    visibleTop: frameTop + sitSouth.visibleBounds.y * (renderedHeight / nativeHeight),
    visibleWidth: sitSouth.visibleBounds.width * (renderedWidth / nativeWidth),
    visibleHeight: sitSouth.visibleBounds.height * (renderedHeight / nativeHeight),
  };

  const canvas = createCanvas(1040, 650);
  const context = canvas.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.fillStyle = '#20252b';
  context.fillRect(0, 0, canvas.width, canvas.height);
  annotate(context, `${entry.number} · actual Front Desk runtime geometry at 4× inspection scale`, 22, 30, '#ffffff', 18);
  annotate(context, 'Left: clean depth-order composite. Right: identical composite with approved seat + visible-bounds overlays.', 22, 53, '#c7d2da');
  drawPanel(context, pose, geometry, 28, 78, 4, false);
  drawPanel(context, pose, geometry, 548, 78, 4, true);
  annotate(context, 'runtime: 52 px/tile · character frame ' + `${renderedWidth}×${renderedHeight}px · chair ${runtimeChair.width}×${runtimeChair.height}px`, 22, 607, '#9ee7f5');
  annotate(context, `approved support: seat (${approvedSeat.x.toFixed(2)}, ${approvedSeat.y.toFixed(2)}) tiles · authored contact y=${seatContactY}`, 22, 630, '#f5c47a');
  const file = resolve(diagnosticRoot, `${entry.number}-front-desk-chair-placement.png`);
  diagnostics.push({
    number: entry.number,
    sourceSha256: entry.sourceSha256,
    packageManifest: { path: relative(packageManifestFile), sha256: hash(packageManifestFile) },
    candidateContacts: {
      south: seatContactY,
      east: packageManifest.poses.sit.east.anchors.seatContactY,
      west: packageManifest.poses.sit.west.anchors.seatContactY,
      north: packageManifest.poses.sit.north.anchors.seatContactY,
      status: sitSouth.anchors.seatContactStatus,
    },
    runtimeGeometry: geometry,
    directions: {
      south: { status: integration.authorized ? 'owner-approved-placement-rendered-with-approved-runtime-geometry' : 'candidate-placement-rendered-with-approved-runtime-geometry-pending-root-review', proof: write(file, canvas) },
      east: { status: 'not-rendered-front-desk-support-is-authored-south-facing' },
      west: { status: 'not-rendered-front-desk-support-is-authored-south-facing' },
      north: { status: 'not-rendered-front-desk-support-is-authored-south-facing' },
    },
  });
}

const manifest = {
  schemaVersion: 'patient-demographics20-v4-placement-qa/v2',
  status: integration.ready ? 'owner-approved-locally-integrated' : integration.authorized ? 'owner-approved-placement-review' : 'candidate-review-only-not-runtime-ready',
  runtimeIntegration: integration,
  evidence: {
    approvedRoomPresentation: { path: relative(approvedPresentationFile), sha256: hash(approvedPresentationFile) },
    approvedRoomProofData: { path: relative(proofDataFile), sha256: hash(proofDataFile) },
    characterPresentation: { path: relative(characterPresentationFile), sha256: hash(characterPresentationFile) },
    characterBitmapArt: { path: relative(characterBitmapFile), sha256: hash(characterBitmapFile) },
  },
  runtimeMath: {
    tileSize,
    characterStillWidthInTiles: widthInTiles,
    nativeWidth,
    nativeHeight,
    floorY,
    visibleHeightCap,
    identityScaleFormula: 'min(1, 246 / (standingSouth.floorY - standingSouth.visibleBounds.y))',
    frameSizeFormula: 'width = round(tileSize * CHARACTER_STILL_WIDTH_IN_TILES * identityScale); height = width * 2',
    baseFormula: 'adjustedBaseY = worldSeatY + (floorY - seatContactY) * renderedHeight / nativeHeight; containerBaseY = round(adjustedBaseY)',
    frameTopFormula: 'frameTopY = containerBaseY - floorY * renderedHeight / nativeHeight',
  },
  chairAsset: {
    path: relative(chairFile),
    sha256: hash(chairFile),
    crop: chairCrop,
    approvedProofCoordinateSpace: { floorOriginPixels: [proofOriginX, proofOriginY], tilePixels: proofTilePixels },
    approvedProofDestination: { x: proofChairX, y: proofChairY, width: proofChairWidth, height: proofChairHeight },
    destinationTopLeftTiles,
    renderSizeTiles,
    runtimeRoundedDestination: runtimeChair,
  },
  approvedSupport: {
    fixtureSeatTiles: { x: fixtureSeatX, y: fixtureSeatY },
    southCushionInsetTiles: southSeatInsetTiles,
    visibleSeatTiles: approvedSeat,
    worldSeatAtReferenceTileSize: worldSeat,
    facing: 'south',
  },
  diagnosticScale: 4,
  diagnostics,
};

const pages = [];
for (let start = 0; start < diagnostics.length; start += 4) {
  const rows = diagnostics.slice(start, start + 4);
  const canvas = createCanvas(1040, 706), context = canvas.getContext('2d');
  context.fillStyle = '#20252b'; context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = false;
  for (const [index, diagnostic] of rows.entries()) {
    const x = index % 2 * 520, y = Math.floor(index / 2) * 353;
    context.fillStyle = '#ffffff'; context.font = '16px sans-serif';
    context.fillText(diagnostic.number + ' · source ' + diagnostic.sourceSha256.slice(0, 12), x + 12, y + 21);
    const source = await loadImage(resolve(repo, diagnostic.directions.south.proof.path));
    context.drawImage(source, x, y + 28, 520, 325);
  }
  pages.push({
    identities: rows.map(item => item.number),
    proof: write(resolve(diagnosticRoot, 'chair-review-' + String(pages.length + 1).padStart(2, '0') + '.png'), canvas),
  });
}
manifest.pages = pages;

writeFileSync(resolve(diagnosticRoot, 'placement-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
const boardLinks = pages.map(page => '<li><a href="' + page.proof.path.split('/').pop() + '">Chair board ' + page.identities.join(', ') + '</a></li>').join('');
const links = diagnostics.map(item => `<li>${item.number}: <a href="${item.directions.south.proof.path.split('/').pop()}">south Front Desk placement</a></li>`).join('');
const statusDescription = integration.ready ? 'Owner-approved and integrated locally; not published.' : integration.authorized ? 'Owner-approved; local runtime registration pending.' : 'Owner visual approval and runtime registration pending.';
writeFileSync(resolve(diagnosticRoot, 'index.html'), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Seated placement QA</title><style>body{background:#20252b;color:#fff;font-family:system-ui;margin:24px}a{color:#67e8f9}</style><h1>Seated placement QA</h1><p>${statusDescription}</p><p>Each proof enlarges the actual 52px-tile runtime composition by 4×. Chair crop, destination, support seat, character frame size, identity scale, floor origin and seat-contact alignment are derived from the approved runtime sources recorded in the manifest.</p><h2>Four-patient review boards</h2><ul>${boardLinks}</ul><h2>Full individual proofs</h2><ul>${links}</ul>`);
console.log(JSON.stringify({ status: 'PASS', diagnostics: diagnostics.length, runtimeReady: integration.ready, schemaVersion: manifest.schemaVersion }));
