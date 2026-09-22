import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = path.resolve(import.meta.dirname, '../../..');
const westRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-west/whole-body-candidate-v5');
const eastRoot = path.join(repo, 'artifacts/character-movement/gs019-blue-directions/east-mirror-v1');
const westManifestBytes = readFileSync(path.join(westRoot, 'manifest.json'));
const westManifest = JSON.parse(westManifestBytes);
const eastManifest = JSON.parse(readFileSync(path.join(eastRoot, 'manifest.json')));
const phases = ['01', '02', '03', '04', '05', '06', '07', '08'];
const sha = (value) => createHash('sha256').update(value).digest('hex');
const errors = [];
const check = (ok, message) => { if (!ok) errors.push(message); };
check(eastManifest.schemaVersion === 'gs019-blue-directions/east-mirror-v1', 'schema');
check(JSON.stringify(eastManifest.phaseContract.ids) === JSON.stringify(phases), 'phase order/count');
check(eastManifest.pins.approvedWestCandidateManifest.sha256 === sha(westManifestBytes), 'West manifest pin');
check(sha(readFileSync(path.join(repo, eastManifest.pins.approvedEastStanding.file))) === eastManifest.pins.approvedEastStanding.sha256, 'East standing pin');
let exactPixels = 0;
let minFloorAlpha = Infinity;
let maxBelowFloorAlpha = 0;
for (const phase of phases) {
  const westBytes = readFileSync(path.join(westRoot, westManifest.frames[phase].file));
  const eastBytes = readFileSync(path.join(eastRoot, eastManifest.frames[phase].file));
  check(sha(eastBytes) === eastManifest.frames[phase].sha256, `East frame hash ${phase}`);
  const [westImage, eastImage] = await Promise.all([loadImage(westBytes), loadImage(eastBytes)]);
  const west = createCanvas(160, 320), east = createCanvas(160, 320);
  west.getContext('2d').drawImage(westImage, 0, 0); east.getContext('2d').drawImage(eastImage, 0, 0);
  const westData = west.getContext('2d').getImageData(0, 0, 160, 320).data;
  const eastData = east.getContext('2d').getImageData(0, 0, 160, 320).data;
  let left = 160, top = 320, right = -1, bottom = -1, floorAlpha = 0, belowFloorAlpha = 0;
  for (let y = 0; y < 320; y++) for (let x = 0; x < 160; x++) {
    const eastIndex = (y * 160 + x) * 4;
    const westIndex = (y * 160 + (159 - x)) * 4;
    for (let channel = 0; channel < 4; channel++) {
      check(eastData[eastIndex + channel] === westData[westIndex + channel], `mirror pixel ${phase}@${x},${y},${channel}`);
      exactPixels++;
    }
    if (eastData[eastIndex + 3]) {
      left = Math.min(left, x); top = Math.min(top, y); right = Math.max(right, x); bottom = Math.max(bottom, y);
      if (y === 287) floorAlpha++;
      if (y > 287) belowFloorAlpha++;
    }
  }
  const expected = eastManifest.measurements[phase].expectedBounds;
  check(JSON.stringify({ left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 }) === JSON.stringify(expected), `bounds ${phase}`);
  check(floorAlpha === eastManifest.measurements[phase].floorAlpha && floorAlpha > 0, `floor contact ${phase}`);
  check(belowFloorAlpha === 0 && belowFloorAlpha === eastManifest.measurements[phase].belowFloorAlpha, `below floor ${phase}`);
  minFloorAlpha = Math.min(minFloorAlpha, floorAlpha);
  maxBelowFloorAlpha = Math.max(maxBelowFloorAlpha, belowFloorAlpha);
}
for (const proof of Object.values(eastManifest.proofs)) check(sha(readFileSync(path.join(eastRoot, proof.file))) === proof.sha256, `proof hash ${proof.file}`);
console.log(JSON.stringify({ status: errors.length ? 'FAIL' : 'PASS', errors: errors.slice(0, 20), metrics: { frames: phases.length, exactChannelValues: exactPixels, minFloorAlpha, maxBelowFloorAlpha } }, null, 2));
if (errors.length) process.exitCode = 1;
