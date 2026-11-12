import { strict as assert } from 'node:assert';
import { test } from 'node:test';
import { seatedProportionData } from './character-room-people.mjs';

test('seated fitter preserves suitable art, corrects bounded outliers and holds large pose jumps', () => {
  const identity = height => ({ group: 'adult', scale: 1, boundsByPose: Object.fromEntries(['south', 'east', 'west', 'north'].map(f => ['sit-' + f, { height }])) });
  const identities = Object.fromEntries(Array.from({ length: 20 }, (_, i) => ['founder.' + String(i + 1).padStart(2, '0'), identity(224)]));
  identities.normal = identity(224); identities.moderate = identity(200); identities.large = identity(160);
  identities.inconsistent = identity(224); identities.inconsistent.boundsByPose['sit-south'].height = 160;
  const data = seatedProportionData({ identities, reference: { groups: { adult: { band: [.95, 1.05] } } } });
  assert.equal(data.identities.normal.correction, 1);
  assert.equal(data.identities.moderate.status, 'corrected');
  assert(data.identities.moderate.correction > 1 && data.identities.moderate.correction <= 1.1);
  assert.equal(data.identities.large.status, 'regeneration-required-size-jump');
  assert.equal(data.identities.large.correction, 1); assert(data.identities.large.requiredCorrection > 1.1);
  assert.equal(data.identities.inconsistent.status, 'regeneration-required-cardinals'); assert.equal(data.identities.inconsistent.correction, 1);
  for (let tile = 26; tile <= 130; tile++) {
    const width = Math.round(tile * 1.35 * (181 / 128) * (160 / 287) * data.identities.moderate.correction);
    const ratio = 200 * width * 2 / 320 / (data.reference.seatedHeight * tile / 52);
    assert(ratio >= .95 && ratio <= 1.05, `tile=${tile} ratio=${ratio}`);
  }
});
