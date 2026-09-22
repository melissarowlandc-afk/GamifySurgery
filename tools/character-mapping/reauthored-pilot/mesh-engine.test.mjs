import assert from 'node:assert/strict';
import test from 'node:test';
import { createCanvas } from '@napi-rs/canvas';
import { createFullSurfaceGrid, inspectAlpha, inspectDeformedMesh, keyConnectedBackground, rasterizeMesh, skinVertices } from './mesh-engine.mjs';
import { validateSourceProfiles } from './source-profile.mjs';
import pendingProfiles from './source-profiles.json' with { type: 'json' };

function syntheticPart({ stray = false } = {}) {
  const canvas = createCanvas(30, 56), context = canvas.getContext('2d');
  context.fillStyle = '#73834a';
  context.fillRect(9, 2, 12, 23);
  context.fillRect(7, 20, 16, 20);
  context.fillStyle = '#c59a68';
  context.fillRect(6, 38, 18, 10);
  context.fillRect(18, 44, 9, 6);
  if (stray) context.fillRect(1, 54, 1, 1);
  return { canvas, imageData: context.getImageData(0, 0, canvas.width, canvas.height) };
}

const sourceRig = { proximal: { x: 15, y: 2 }, joint: { x: 15, y: 25 }, terminal: { x: 15, y: 40 }, end: { x: 23, y: 48 } };

test('full-surface grid covers the complete connected silhouette including the terminal toe', () => {
  const { imageData } = syntheticPart(), bounds = { x: 6, y: 2, width: 21, height: 48 };
  const mesh = createFullSurfaceGrid(imageData, bounds, { cellSize: 4 });
  assert.equal(mesh.diagnostics.componentCount, 1);
  assert.equal(mesh.diagnostics.connectedSurface, true);
  assert.equal(mesh.diagnostics.coversEveryOpaquePixel, true);
  assert(mesh.diagnostics.transparentCellCount > 0, 'fully transparent corner cells should not be deformed');
  assert(mesh.vertices.some(value => value.x === 27 && value.y === 50), 'grid must include the far toe boundary');
});

test('source inspection reports a detached opaque stray instead of deleting it', () => {
  const { imageData } = syntheticPart({ stray: true });
  const inspection = inspectAlpha(imageData, { x: 1, y: 2, width: 26, height: 53 });
  assert.equal(inspection.componentCount, 2);
  assert.equal(inspection.components[1].pixelCount, 1);
});

test('background key removes only edge-connected magenta and preserves enclosed matching art pixels', () => {
  const canvas = createCanvas(9, 9), context = canvas.getContext('2d');
  context.fillStyle = '#ff00ff'; context.fillRect(0, 0, 9, 9);
  context.fillStyle = '#73834a'; context.fillRect(2, 2, 5, 5);
  context.fillStyle = '#ff00ff'; context.fillRect(4, 4, 1, 1);
  const keyed = keyConnectedBackground(context.getImageData(0, 0, 9, 9), { color: [255, 0, 255], tolerance: 0 });
  assert.equal(keyed.removedPixelCount, 56);
  assert.equal(keyed.imageData.data[(0 * 9 + 0) * 4 + 3], 0);
  assert.equal(keyed.imageData.data[(4 * 9 + 4) * 4 + 3], 255);
});

test('explicit no-pink source policy removes dark magenta matte remnants without touching neutral outlines', () => {
  const canvas = createCanvas(5, 3), context = canvas.getContext('2d');
  context.fillStyle = '#ff00ff'; context.fillRect(0, 0, 5, 3);
  context.fillStyle = '#492549'; context.fillRect(2, 1, 1, 1);
  context.fillStyle = '#171717'; context.fillRect(3, 1, 1, 1);
  const keyed = keyConnectedBackground(context.getImageData(0, 0, 5, 3), { color: [255, 0, 255], tolerance: 96, magentaDominanceThreshold: 20 });
  assert.equal(keyed.imageData.data[(1 * 5 + 2) * 4 + 3], 0);
  assert.equal(keyed.imageData.data[(1 * 5 + 3) * 4 + 3], 255);
});

test('soft joint mapping preserves cross-section width and makes the complete terminal rigid', () => {
  const vertices = [{ x: 7, y: 25 }, { x: 23, y: 25 }, { x: 15, y: 40 }, { x: 23, y: 48 }, { x: 18, y: 44 }];
  const targetRig = { proximal: { x: 18, y: 4 }, joint: { x: 28, y: 25 }, terminal: { x: 19, y: 40 }, end: { x: 25, y: 34 } };
  const mapped = skinVertices(vertices, sourceRig, targetRig, { jointBlendPixels: [7, 3], terminalTransition: { before: 0, after: 0 }, normalizationScale: 0.75 });
  assert(Math.abs(Math.hypot(mapped[1].x - mapped[0].x, mapped[1].y - mapped[0].y) - 12) < 1e-6, 'elbow width must use one uniform part normalization scale');
  assert.equal(mapped[2].terminalWeight, 1);
  assert.equal(mapped[3].terminalWeight, 1);
  const sourceTerminalDistance = Math.hypot(vertices[4].x - vertices[2].x, vertices[4].y - vertices[2].y);
  const targetTerminalDistance = Math.hypot(mapped[4].x - mapped[2].x, mapped[4].y - mapped[2].y);
  const scale = 0.75;
  assert(Math.abs(targetTerminalDistance - sourceTerminalDistance * scale) < 1e-6, 'terminal similarity transform must preserve shape');
});

test('deformation diagnostics reject folded topology instead of hiding it in raster output', () => {
  const mesh = { vertices: [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: 2, y: 2 }], triangles: [[0, 1, 2]] };
  assert.deepEqual(inspectDeformedMesh(mesh, mesh.vertices), { triangleCount: 1, minimumAbsoluteArea2: 4, foldedTriangleCount: 0, degenerateTriangleCount: 0, unsafeSamples: [] });
  assert.equal(inspectDeformedMesh(mesh, [mesh.vertices[0], mesh.vertices[2], mesh.vertices[1]]).foldedTriangleCount, 1);
});

test('neutral full-grid rasterization retains every synthetic opaque pixel and color', () => {
  const { imageData } = syntheticPart(), bounds = { x: 6, y: 2, width: 21, height: 48 };
  const mesh = createFullSurfaceGrid(imageData, bounds, { cellSize: 3 });
  const vertices = skinVertices(mesh.vertices, sourceRig, sourceRig, { jointBlendPixels: [6, 3], terminalTransition: { before: 0, after: 0 } });
  const rendered = rasterizeMesh(imageData, mesh, vertices, { width: 30, height: 56 });
  const output = rendered.getContext('2d').getImageData(0, 0, 30, 56);
  for (let y = bounds.y; y < bounds.y + bounds.height; y += 1) for (let x = bounds.x; x < bounds.x + bounds.width; x += 1) {
    const index = (y * 30 + x) * 4;
    assert.deepEqual([...output.data.slice(index, index + 4)], [...imageData.data.slice(index, index + 4)], `neutral pixel mismatch at ${x},${y}`);
  }
});

test('measured source profiles cover both pilots in all four independent views', () => {
  assert.equal(validateSourceProfiles(pendingProfiles), pendingProfiles);
  assert.deepEqual(Object.keys(pendingProfiles.characters).sort(), ['patient.adult.032', 'patient.adult.033']);
  for (const character of Object.values(pendingProfiles.characters)) for (const view of ['east', 'west', 'south', 'north']) {
    assert.equal(character.views[view].status, 'measured');
    assert.ok(character.views[view].parts.leftLeg.bounds.width > 0);
    assert.ok(character.views[view].parts.rightArm.rig.end.y > character.views[view].parts.rightArm.rig.terminal.y);
  }
  const shared = { east: { left: 'mirror-x-local', right: 'authored' }, west: { left: 'mirror-x-local', right: 'authored' }, south: { left: 'mirror-x-local', right: 'mirror-x-local' } };
  for (const [characterId, character] of Object.entries(pendingProfiles.characters)) {
    for (const [view, orientation] of Object.entries(shared)) assert.deepEqual(character.views[view].targetRegistration.armSourceOrientationBySide, orientation);
    assert.deepEqual(character.views.north.targetRegistration.armSourceOrientationBySide, characterId === 'patient.adult.032' ? { left: 'mirror-x-local', right: 'mirror-x-local' } : { left: 'authored', right: 'authored' });
    assert.equal(character.views.west.targetRegistration.headOffsetX, 3);
    assert.equal(character.views.south.targetRegistration.neutralNearArmBehindBody, true);
    const scales = new Set(Object.values(character.views).flatMap(view => [view.parts.leftArm.normalizationScale, view.parts.rightArm.normalizationScale]));
    assert.deepEqual([...scales], [characterId === 'patient.adult.033' ? .56 : .54]);
  }
  assert.equal(pendingProfiles.characters['patient.adult.032'].views.east.targetRegistration.headOffsetX, -3);
  assert.equal(pendingProfiles.characters['patient.adult.033'].views.east.targetRegistration.headOffsetX ?? 0, 0);
});
