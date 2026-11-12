import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readPhlebotomyCaptureInputs, assertPhlebotomyInputsUnchanged } from './character-phlebotomy-inputs.mjs';
const root = fileURLToPath(new URL('../../', import.meta.url));
const before = await readPhlebotomyCaptureInputs();
function mutated(path, transform) {
  const absolute = resolve(root, path);
  return readPhlebotomyCaptureInputs({ root, readFile: file => {
    if (file !== absolute) return readFileSync(file);
    const original = readFileSync(file).toString('utf8'), changed = transform(original);
    assert.notEqual(changed, original, 'Test mutation must change its intended input: ' + path);
    return Buffer.from(changed);
  } });
}
const changeJson = fn => text => { const data = JSON.parse(text); fn(data); return JSON.stringify(data); };
describe('phlebotomy measured-input scope', () => {
  it('fingerprints exactly eight measured actor frames and excludes unrelated preloaded room assets', () => {
    assert.equal(before.measuredFrames.length, 8);
    assert.equal(before.inputs.filter(i => i.selector === 'asset').length, 13);
    assert.ok(before.measuredFrames.some(f => f.id === 'gs022-new-employee-015' && f.posture === 'stand' && f.facing === 'south'));
    assert.ok(!before.measuredFrames.some(f => f.id === 'gs022-new-employee-015' && f.posture === 'stand' && f.facing === 'west'));
    assert.ok(before.inputs.some(i => i.selector === 'phlebotomy-support-branch'));
    assert.ok(!before.inputs.some(i => /xray|ultrasound|waiting\//.test(i.path)));
  });
  it('ignores other identities, unused facings, audit-only metadata and other room JSON changes', async () => {
    const cases = [
      ['apps/player/src/art/characterStillRegistry.generated.json', changeJson(d => d.characters.find(c => c.id === 'patient.adult.002').poses.sit.south.anchors.floorY++)],
      ['apps/player/src/art/characterStillRegistry.generated.json', changeJson(d => d.characters.find(c => c.id === 'founder.14').poses.sit.south.anchors.floorY++)],
      ['apps/player/src/art/characterProportions.generated.json', changeJson(d => { d.registrySha256 = 'unrelated registry receipt'; d.identities['patient.adult.002'].scale *= 1.1; })],
      ['apps/player/src/art/characterRoomProportions.generated.json', changeJson(d => { d.identities['patient.adult.002'].correction *= 1.1; d.identities['patient.adult.001'].status = 'audit-note-only'; })],
      ['apps/player/src/facility/approvedRoomProofData.json', changeJson(d => d.rooms.waiting.proofSha256 = 'other room proof receipt')],
    ];
    for (const [path, change] of cases) { const after = await mutated(path, change); assert.doesNotThrow(() => assertPhlebotomyInputsUnchanged(before, after), path); }
  });
  it('ignores unrelated shared-method edits, other room masks/touchups and formatting', async () => {
    for (const [path, change] of [
      ['apps/player/src/facility/FacilityScene.ts', text => text.replace(/(private roomFloorColor\([\s\S]*?case "room.front_desk":\s*return )PIXEL_PALETTE_NUMBER\.cream/, '$1PIXEL_PALETTE_NUMBER.sage')],
      ['apps/player/src/facility/FacilityScene.ts', text => text.replace('private drawPixelPerson(', '/* measured method moved; semantics identical */\n  private drawPixelPerson(')],
      ['apps/player/src/facility/approvedSideChairLayers.ts', text => text.replace('southArmPolygon: [[6, 144]', 'southArmPolygon: [[7, 144]')],
      ['apps/player/src/facility/roomTouchups.ts', text => text.replace('accent: "#a7a3cb"', 'accent: "#a7a3cc"')],
    ]) { const after = await mutated(path, change); assert.doesNotThrow(() => assertPhlebotomyInputsUnchanged(before, after), path); }
  });
  it('rejects measured frame anchors, scales, bounds and seated-factor changes', async () => {
    for (const [path, change] of [
      ['apps/player/src/art/characterStillRegistry.generated.json', changeJson(d => d.characters.find(c => c.id === 'patient.adult.001').poses.sit.east.anchors.seatContactY++)],
      ['apps/player/src/art/characterProportions.generated.json', changeJson(d => d.identities['gs022-new-employee-015'].scale *= 1.01)],
      ['apps/player/src/art/characterProportions.generated.json', changeJson(d => d.identities['founder.14'].boundsByPose['stand-south'].height++)],
      ['apps/player/src/art/characterRoomProportions.generated.json', changeJson(d => d.identities['patient-gapfill-v6a.015'].correction *= 1.01)],
    ]) { const after = await mutated(path, change); assert.throws(() => assertPhlebotomyInputsUnchanged(before, after), /Measured capture inputs changed/); }
  });
  it('rejects changed measured PNG bytes and phlebotomy fixture/mask/render-function changes', async () => {
    const png = 'apps/player/public/' + before.measuredFrames[0].frame.url;
    await assert.rejects(mutated(png, text => text + 'changed'), /Measured actor PNG differs/);
    for (const [path, change] of [
      ['apps/player/src/facility/approvedRoomProofData.json', changeJson(d => d.rooms.phlebotomy.orientations[0].dataset.model.fixtures.chair.seat.y += .1)],
      ['apps/player/src/facility/approvedSideChairLayers.ts', text => text.replace('[[0, 230], [179, 230]', '[[1, 230], [179, 230]')],
      ['apps/player/src/facility/characterPresentation.ts', text => text.replace('return { width, height: width * 2 };', 'return { width, height: width * 3 };')],
      ['apps/player/src/facility/characterHopMotion.ts', text => text.replace('breathDepth: 0.02,', 'breathDepth: 0.03,')],
    ]) { const after = await mutated(path, change); assert.throws(() => assertPhlebotomyInputsUnchanged(before, after), /Measured capture inputs changed/); }
  });
});
