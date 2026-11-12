import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { resolve, dirname } from 'node:path';
import { assertPhlebotomyCapture, assertPhlebotomyPairs, assertPhlebotomyMatrix, assertPhlebotomyFounderPixels } from './character-phlebotomy-capture.mjs';
import { readPhlebotomyCaptureInputs } from './character-phlebotomy-inputs.mjs';
const phaserRequire = createRequire(import.meta.url);
const filters = phaserRequire(resolve(dirname(phaserRequire.resolve('phaser')), '../src/textures/const.js'));
const baseline = JSON.parse(readFileSync(new URL('../../apps/player/src/art/characterPhlebotomyQa.before.json', import.meta.url)));
const inputs = await readPhlebotomyCaptureInputs();
function sample({ orientation = 0, zoom = 1, version = 'after', seatedCorrections = false, actorState = 'active' } = {}) {
  const tile = new Map([[.1, 22], [.5, 35], [.7, 42], [1, 52], [1.6, 83], [2.5, 130]]).get(zoom);
  const stage = { tileSize: tile, originX: tile * 1.5, originY: tile * 2.5, width: (orientation === 0 ? 9 : 8) * tile, height: tile * 9 };
  const figure = (key, id, posture, facing, left, depth) => {
    const input = inputs.measuredFrames.find(f => f.id === id && f.posture === posture && f.facing === facing);
    const metrics = input.metrics[tile][seatedCorrections ? 'on' : 'off'];
    const frameWidth = metrics.width * input.motion.scaleX, frameHeight = metrics.height * input.motion.scaleY;
    return { key, stillId: id, source: input.frame.url, pose: posture === 'sit' ? 'seated' : 'idle', frameWidth, frameHeight,
      figureHeight: input.bounds.height * frameHeight / input.frame.height, figureWidth: input.bounds.width * frameWidth / input.frame.width, floorAnchorY: input.floorY / input.frame.height,
      scaleMode: filters.NEAREST, textureUsesLinearFiltering: false, headY: 500 - (input.floorY - input.bounds.y) * frameHeight / input.frame.height, floorY: 500, left, right: left + 10, depth, seatY: 0 };
  };
  const patient = figure('character:patient:phlebotomy-patient', actorState === 'wide-patient' ? 'patient-gapfill-v6a.015' : 'patient.adult.001', 'sit', orientation === 0 ? 'south' : 'east', 60, 102064);
  const clinician = figure('character:staff:phlebotomist', 'gs022-new-employee-015', actorState === 'standing' ? 'stand' : 'sit', actorState === 'standing' ? 'south' : orientation === 0 && version === 'before' ? 'north' : 'west', 100, 104000);
  const founder = figure('character:founder', 'founder.14', 'stand', 'south', 180, 110000);
  const chairProof = baseline.views.find(v => v.orientation === orientation).records.find(d => d.id === 'chair');
  const stoolProof = baseline.views.find(v => v.orientation === orientation).records.find(d => d.id === 'stool');
  const factor = version === 'after' ? .85 : 1;
  const ground = orientation === 0 ? { x: 1.3, y: 1.08 } : { x: .78, y: 1.5 };
  const seatSourceY = orientation === 0 ? 438 : 435;
  patient.seatY = stage.originY + (ground.y + (seatSourceY - chairProof.sourceFloorContact[1]) / chairProof.sourceRect[3] * chairProof.renderSizeTiles[1] * .85) * tile;
  const patientInput = inputs.measuredFrames.find(f => f.frame.url === patient.source);
  const baseHeight = patientInput.metrics[tile][seatedCorrections ? 'on' : 'off'].height;
  patient.seatY -= (patientInput.floorY - patientInput.frame.anchors.seatContactY) * (patient.frameHeight - baseHeight) / patientInput.frame.height;
  return { protocolVersion: 3, orientation, zoom, version, seatedCorrections, actorState, stage, figures: [patient, clinician, founder],
    fixtures: [{ id: 'chair', width: Math.round(chairProof.renderSizeTiles[0] * factor * tile), height: Math.round(chairProof.renderSizeTiles[1] * factor * tile), depth: 102000 },
      { id: 'stool', width: Math.round(stoolProof.renderSizeTiles[0] * tile), height: Math.round(stoolProof.renderSizeTiles[1] * tile), depth: 103900 }],
    chairLayers: [{ drawId: 'chair', foregroundVisible: true, baseLayer: 'rear', foregroundDepth: 102064.5 }], sha256: version };
}
const check = capture => assertPhlebotomyCapture(capture, baseline, inputs);
const matrix = () => [0, 270].flatMap(orientation => [.1, .5, .7, 1, 1.6, 2.5].flatMap(zoom => ['active', 'idle', 'standing', 'wide-patient'].flatMap(actorState => [false, true].flatMap(seatedCorrections => ['before', 'after'].map(version => sample({ orientation, zoom, actorState, seatedCorrections, version }))))));

describe('phlebotomy capture acceptance checks', () => {
  it('accepts the installed Phaser NEAREST value and rejects its LINEAR value', () => {
    assert.equal(filters.NEAREST, 1); // Regression: original guard required 0 (LINEAR).
    assert.doesNotThrow(() => check(sample()));
    const blurred = sample(); blurred.figures[0].scaleMode = filters.LINEAR;
    assert.throws(() => check(blurred), /Actor sampling changed: character:patient.*NEAREST=1/);
    const inconsistent = sample(); inconsistent.figures[0].textureUsesLinearFiltering = true;
    assert.throws(() => check(inconsistent), /Actor sampling changed: character:patient.*linear=true/);
  });
  it('accepts benign Phaser dimension roundoff while rejecting real size/anchor changes', () => {
    const rounded = sample(); rounded.figures[0].frameWidth += 1e-12; rounded.figures[0].frameHeight -= 1e-12;
    rounded.fixtures[0].height += 1e-12; rounded.fixtures[1].height -= 1e-12;
    assert.doesNotThrow(() => check(rounded));
    for (const mutate of [c => c.figures[0].frameWidth += .01, c => c.figures[0].floorAnchorY += .01, c => c.figures[0].figureHeight += 2]) {
      const capture = sample(); mutate(capture); assert.throws(() => check(capture), /registration changed|scale\/anchor changed/);
    }
  });
  it('matches the actual founder breathing readback, rejecting real stretch or head-anchor changes', () => {
    const founder = sample().figures[2];
    assert.ok(Math.abs(founder.frameWidth - 48.99911931529394) < 1e-12);
    assert.ok(Math.abs(founder.frameHeight - 98.00587123137373) < 1e-12);
    assert.ok(Math.abs(founder.frameHeight - founder.frameWidth * 2) > 1e-6);
    for (const change of [f => f.frameHeight += .01, f => f.headY += .01, f => f.figureWidth += .01]) {
      const changed = sample(); change(changed.figures[2]); assert.throws(() => check(changed));
    }
    const before = sample({ version: 'before' }), after = sample();
    before.figures[2].headY += .01;
    assert.throws(() => assertPhlebotomyPairs([before, after]), /founder reference/);
  });
  it('accepts all 192 camera/orientation/pose/scale-factor cases using current measured metadata', () => {
    for (const capture of matrix()) assert.doesNotThrow(() => check(capture), JSON.stringify([capture.orientation, capture.zoom, capture.actorState, capture.seatedCorrections, capture.version]));
  });
  it('rejects overlapping people, detached cushions and an armrest above the clinician', () => {
    const overlap = sample(); overlap.figures[0].right = 101;
    assert.throws(() => check(overlap), /overlap/);
    const detached = sample(); detached.figures[0].seatY += 1;
    assert.throws(() => check(detached), /cushion/);
    const armrest = sample(); armrest.chairLayers[0].foregroundDepth = 104001;
    assert.throws(() => check(armrest), /armrest/);
  });
  it('rejects changed identities/facings, actor/furniture size, wrong poses and stale pages', () => {
    for (const mutate of [c => c.figures[0].stillId = 'patient.adult.002', c => c.figures[0].source = inputs.measuredFrames[0].frame.url,
      c => c.fixtures[0].width++, c => c.fixtures[1].height++, c => c.figures[1].pose = 'idle', c => c.figures.pop(), c => c.zoom = .7,
      c => c.protocolVersion = 2, c => c.figures[1].scaleMode = undefined]) {
      const capture = sample(); mutate(capture); assert.throws(() => check(capture));
    }
  });
  it('requires each pair to differ visually while retaining actor heights, with float tolerance', () => {
    const after = sample(), before = sample({ version: 'before' });
    before.figures[0].frameHeight += 1e-12;
    assert.doesNotThrow(() => assertPhlebotomyPairs([before, after]));
    before.figures[0].frameHeight += 2;
    assert.throws(() => assertPhlebotomyPairs([before, after]), /height/);
    assert.throws(() => assertPhlebotomyPairs([after]), /Missing/);
    assert.throws(() => assertPhlebotomyPairs([{ ...after, version: 'before' }, after]), /identical/);
  });
  it('requires the exact full matrix, rejecting missing and duplicated states', () => {
    const captures = matrix();
    assert.doesNotThrow(() => assertPhlebotomyMatrix(captures));
    assert.throws(() => assertPhlebotomyMatrix(captures.slice(1)), /matrix/);
    captures[1] = captures[0];
    assert.throws(() => assertPhlebotomyMatrix(captures), /matrix/);
  });
  it('detects stale founder pixels while allowing furniture changes outside its region', () => {
    const before = { file: 'before.png' }, after = { file: 'after.png', figures: [{ key: 'character:founder', centerX: 32, frameWidth: 16, headY: 16, floorY: 48 }] };
    const image = () => ({ width: 64, height: 64, rgba: Buffer.alloc(64 * 64 * 4, 255) });
    const a = image(), b = image(); b.rgba[0] = 12;
    assert.doesNotThrow(() => assertPhlebotomyFounderPixels(before, after, a, b));
    b.rgba[(32 * 64 + 32) * 4] = 12;
    assert.throws(() => assertPhlebotomyFounderPixels(before, after, a, b), /Founder PNG differs despite unchanged geometry/);
  });
});
