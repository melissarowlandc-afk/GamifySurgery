import { resolve } from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import { inspectAlpha, keyConnectedBackground } from '../reauthored-pilot/mesh-engine.mjs';

const repositoryRoot = resolve(import.meta.dirname, '../../..');
const slug = process.argv[2] ?? 'braid';
const image = await loadImage(resolve(repositoryRoot, `artifacts/character-movement/reauthored-batch-02/sources/${slug}-rig-ready-v1.png`));
const canvas = createCanvas(image.width, image.height), context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
const keyed = keyConnectedBackground(context.getImageData(0, 0, image.width, image.height), { color: [255, 0, 255], tolerance: 96, magentaDominanceThreshold: 20 });
const parts = {};
for (const [name, column] of [['leftArm',2],['rightArm',3],['leftLeg',4],['rightLeg',5]]) {
  const region = { x: column * 256, y: 0, width: 256, height: 320 };
  parts[name] = inspectAlpha(keyed.imageData, region).components.sort((left, right) => right.pixelCount - left.pixelCount);
}
console.log(JSON.stringify(parts, null, 2));
