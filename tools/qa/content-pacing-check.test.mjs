import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertContentPacing } from './content-pacing-check.mjs';

test('accepts the reference and both edges inside the ten-percent budget', () => {
  assert.equal(assertContentPacing(22_690), 0);
  assert.doesNotThrow(() => assertContentPacing(20_421));
  assert.doesNotThrow(() => assertContentPacing(24_959));
});

test('flags the observed batch3 delay and excessive speedup', () => {
  assert.throws(() => assertContentPacing(37_801), /66.60%/);
  assert.throws(() => assertContentPacing(20_420), /allowed drift is 10%/);
  assert.throws(() => assertContentPacing(24_960), /allowed drift is 10%/);
});

test('requires a measured positive integer first finish', () => {
  for (const invalid of [null, undefined, NaN, Infinity, 0, -1, 22_690.5]) {
    assert.throws(() => assertContentPacing(invalid), /actual first-finish tick/);
  }
});
