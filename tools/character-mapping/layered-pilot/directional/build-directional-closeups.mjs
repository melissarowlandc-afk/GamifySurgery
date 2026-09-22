import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createCanvas } from '@napi-rs/canvas';
import { directionalWalkPose, loadDirectionalRig, renderDirectionalStanding, renderDirectionalWalk } from './directional-rig-v1.mjs';

const repo = resolve(import.meta.dirname, '../../../..');
const output = resolve(repo, 'artifacts/character-movement/layered-pilot/directional-v1/closeups');
mkdirSync(output, { recursive: true });
const loaded = await loadDirectionalRig(repo);
const clean = createCanvas(1440, 480);
const diagnostic = createCanvas(1440, 480);

for (const target of [clean, diagnostic]) {
  const context = target.getContext('2d');
  context.fillStyle = '#f4efe2'; context.fillRect(0, 0, target.width, target.height);
  context.font = '12px sans-serif'; context.fillStyle = '#253039';
}

for (const [row, view] of ['east', 'west'].entries()) for (let index = 0; index < 8; index += 1) {
  const rendered = renderDirectionalWalk(loaded, directionalWalkPose(view, index));
  const cellX = index * 180;
  const cellY = row * 240;
  for (const target of [clean, diagnostic]) {
    const context = target.getContext('2d');
    context.save(); context.beginPath(); context.rect(cellX, cellY, 180, 218); context.clip();
    context.drawImage(rendered.canvas, 20, 65, 120, 175, cellX + 9, cellY, 162, 236); context.restore();
    context.fillStyle = '#253039'; context.fillRect(cellX, cellY + 218, 180, 22);
    context.fillStyle = '#fff'; context.fillText(`${view.toUpperCase()} ${rendered.metadata.phaseId} ${view === 'east' ? '->' : '<-'}`, cellX + 7, cellY + 233);
  }
  const diagnosticContext = diagnostic.getContext('2d');
  const scaleX = 162 / 120; const scaleY = 236 / 175;
  for (const side of ['left', 'right']) {
    const arm = rendered.metadata.arms[side];
    diagnosticContext.fillStyle = side === rendered.metadata.arms[side].donor.side ? '#05a4c7' : '#ef7d32';
    const x = cellX + 9 + (arm.thumbLandmark.x - 20) * scaleX;
    const y = cellY + (arm.thumbLandmark.y - 65) * scaleY;
    diagnosticContext.beginPath(); diagnosticContext.arc(x, y, 2.5, 0, Math.PI * 2); diagnosticContext.fill();
  }
}
writeFileSync(resolve(output, 'green-profile-arm-neck-clean.png'), clean.toBuffer('image/png'));
writeFileSync(resolve(output, 'green-profile-thumb-landmarks.png'), diagnostic.toBuffer('image/png'));

const checkpoints = [
  { label: 'STAND', render: view => renderDirectionalStanding(loaded, view) },
  ...[0, 2, 4, 6].map(index => ({ label: String(index + 1).padStart(2, '0'), render: view => renderDirectionalWalk(loaded, directionalWalkPose(view, index)) })),
];
const shoulderClean = createCanvas(900, 720);
const shoulderOverlay = createCanvas(900, 720);
for (const target of [shoulderClean, shoulderOverlay]) {
  const context = target.getContext('2d'); context.fillStyle = '#f4efe2'; context.fillRect(0, 0, target.width, target.height);
}
for (const [row, view] of ['east', 'west', 'north'].entries()) for (const [column, checkpoint] of checkpoints.entries()) {
  const rendered = checkpoint.render(view);
  const cellX = column * 180; const cellY = row * 240;
  for (const target of [shoulderClean, shoulderOverlay]) {
    const context = target.getContext('2d');
    context.save(); context.beginPath(); context.rect(cellX, cellY, 180, 218); context.clip();
    context.drawImage(rendered.canvas, 15, 60, 130, 180, cellX + 5, cellY, 169, 234); context.restore();
    context.fillStyle = '#253039'; context.fillRect(cellX, cellY + 218, 180, 22);
    context.fillStyle = '#fff'; context.font = '12px sans-serif'; context.fillText(`${view.toUpperCase()} ${checkpoint.label} ${view === 'east' ? '->' : view === 'west' ? '<-' : 'BACK'}`, cellX + 7, cellY + 233);
  }
  const overlay = shoulderOverlay.getContext('2d');
  const xScale = 169 / 130; const yScale = 234 / 180;
  for (const side of ['left', 'right']) {
    const arm = rendered.metadata.arms?.[side] ?? rendered.metadata.parts.arms[side];
    for (const [point, color, radius] of [[arm.shoulder, '#ff3158', 4], [arm.sleeve.mappedCap, '#14b8a6', 2], [arm.cuff, '#2563eb', 3]]) {
      overlay.fillStyle = color; overlay.beginPath(); overlay.arc(cellX + 5 + (point.x - 15) * xScale, cellY + (point.y - 60) * yScale, radius, 0, Math.PI * 2); overlay.fill();
    }
  }
}
writeFileSync(resolve(output, 'green-directional-shoulder-clean.png'), shoulderClean.toBuffer('image/png'));
writeFileSync(resolve(output, 'green-directional-shoulder-anchors.png'), shoulderOverlay.toBuffer('image/png'));
console.log(JSON.stringify({ output, clean: 'green-profile-arm-neck-clean.png', diagnostic: 'green-profile-thumb-landmarks.png', shoulderClean: 'green-directional-shoulder-clean.png', shoulderOverlay: 'green-directional-shoulder-anchors.png' }));
