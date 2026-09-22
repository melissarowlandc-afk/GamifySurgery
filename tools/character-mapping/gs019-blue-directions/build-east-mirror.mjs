import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = path.resolve(import.meta.dirname, '../../..');
const inputRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v5');
const outputRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/east-mirror-v1');
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const sha = (value) => createHash('sha256').update(value).digest('hex');
const ensureParent = (file) => mkdirSync(path.dirname(file), { recursive: true });
const save = (file, canvas) => {
  const bytes = canvas.toBuffer('image/png');
  const full = path.join(outputRoot, file);
  ensureParent(full);
  writeFileSync(full, bytes);
  return { file, sha256: sha(bytes), width: canvas.width, height: canvas.height };
};

const westManifestBytes = readFileSync(path.join(inputRoot, 'manifest.json'));
const westManifest = JSON.parse(westManifestBytes);
const eastStandingFile = path.join(repo, 'artifacts/character-movement/blue-glasses-v1/frames/stand/east.png');
const eastStandingBytes = readFileSync(eastStandingFile);
const eastStanding = await loadImage(eastStandingBytes);
const frames = {};
const measurements = {};
const images = [];
for (const phase of phases) {
  const westBytes = readFileSync(path.join(inputRoot, westManifest.frames[phase].file));
  const west = await loadImage(westBytes);
  if (west.width !== 160 || west.height !== 320) throw new Error(`unexpected West frame dimensions ${phase}`);
  const east = createCanvas(160, 320);
  const context = east.getContext('2d');
  context.imageSmoothingEnabled = false;
  context.translate(160, 0);
  context.scale(-1, 1);
  context.drawImage(west, 0, 0);
  frames[phase] = save(`frames/${phase}.png`, east);
  const westBounds = westManifest.measurements[phase].bounds;
  measurements[phase] = {
    sourceWestSha256: sha(westBytes),
    mirrorTransform: { a: -1, b: 0, c: 0, d: 1, e: 160, f: 0 },
    expectedBounds: {
      left: 159 - westBounds.right,
      top: westBounds.top,
      right: 159 - westBounds.left,
      bottom: westBounds.bottom,
      width: westBounds.width,
      height: westBounds.height,
    },
    floorAlpha: westManifest.measurements[phase].floorAlpha,
    belowFloorAlpha: westManifest.measurements[phase].belowFloorAlpha,
  };
  images.push(east);
}

const native = createCanvas(1280, 344);
const nativeContext = native.getContext('2d');
nativeContext.fillStyle = '#ded8ce'; nativeContext.fillRect(0, 0, native.width, native.height);
nativeContext.fillStyle = '#20242a'; nativeContext.fillRect(0, 0, native.width, 24);
nativeContext.fillStyle = '#fff'; nativeContext.font = '12px sans-serif'; nativeContext.imageSmoothingEnabled = false;
images.forEach((image, index) => { nativeContext.fillText(`east ${phases[index]}`, index * 160 + 4, 16); nativeContext.drawImage(image, index * 160, 24); });
const proofs = { allEightNative: save('proofs/east-all8-native.png', native) };

const enlarged = createCanvas(1280, 1328);
const enlargedContext = enlarged.getContext('2d');
enlargedContext.fillStyle = '#ded8ce'; enlargedContext.fillRect(0, 0, enlarged.width, enlarged.height);
enlargedContext.fillStyle = '#20242a'; enlargedContext.font = '16px sans-serif'; enlargedContext.imageSmoothingEnabled = false;
images.forEach((image, index) => {
  const x = (index % 4) * 320;
  const y = Math.floor(index / 4) * 664;
  enlargedContext.fillText(`east ${phases[index]}`, x + 8, y + 18);
  enlargedContext.drawImage(image, 0, 0, 160, 320, x, y + 24, 320, 640);
});
proofs.allEightEnlarged = save('proofs/east-all8-enlarged-2x.png', enlarged);

const game = createCanvas(240, 24 + phases.length * 76);
const gameContext = game.getContext('2d');
gameContext.fillStyle = '#ded8ce'; gameContext.fillRect(0, 0, game.width, game.height);
gameContext.fillStyle = '#20242a'; gameContext.fillRect(0, 0, game.width, 24);
gameContext.fillStyle = '#fff'; gameContext.font = '12px sans-serif'; gameContext.imageSmoothingEnabled = false;
gameContext.fillText('East standing', 8, 16); gameContext.fillText('East walking', 128, 16);
images.forEach((image, index) => {
  const y = 30 + index * 76;
  gameContext.fillStyle = '#20242a'; gameContext.fillText(phases[index], 2, y + 12);
  gameContext.drawImage(eastStanding, 0, 0, 160, 320, 48, y, 32, 64);
  gameContext.drawImage(image, 0, 0, 160, 320, 168, y, 32, 64);
});
proofs.gameSize = save('proofs/east-standing-walk-game-size.png', game);

const manifest = {
  schemaVersion: 'gs019-blue-directions/east-mirror-v1',
  status: 'prototype-needs-owner-directional-review',
  characterId: 'patient.adult.039',
  direction: 'east',
  method: 'exact horizontal pixel mirror of owner-approved Blue West candidate-v5; no resampling, repainting, body fitting, or head recomposition',
  canvas: { width: 160, height: 320, axisX: 80, floorY: 287 },
  gamePresentation: { width: 32, height: 64, tileSize: 24, displayScale: 1 },
  phaseContract: westManifest.phaseContract,
  pins: {
    approvedWestCandidateManifest: {
      file: 'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v5/manifest.json',
      sha256: sha(westManifestBytes),
    },
    approvedEastStanding: {
      file: 'artifacts/character-movement/blue-glasses-v1/frames/stand/east.png',
      sha256: sha(eastStandingBytes),
    },
  },
  frames,
  measurements,
  proofs,
};
const manifestBytes = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
writeFileSync(path.join(outputRoot, 'manifest.json'), manifestBytes);
console.log(JSON.stringify({ status: 'PASS', manifestSha256: sha(manifestBytes), outputRoot: path.relative(repo, outputRoot) }, null, 2));
