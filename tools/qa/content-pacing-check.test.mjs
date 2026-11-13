import assert from 'node:assert/strict';
import { test } from 'node:test';
import { assertContentPacing } from './content-pacing-check.mjs';

test('accepts the reference and both edges inside the ten-percent budget', () => {
  assert.equal(assertContentPacing(26_281), 0);
  assert.doesNotThrow(() => assertContentPacing(23_653));
  assert.doesNotThrow(() => assertContentPacing(28_909));
});

test('flags the observed batch3 delay and excessive speedup', () => {
  assert.throws(() => assertContentPacing(37_801), /43.83%/);
  assert.throws(() => assertContentPacing(23_652), /allowed drift is 10%/);
  assert.throws(() => assertContentPacing(28_910), /allowed drift is 10%/);
  assert.throws(() => assertContentPacing(22_690), /allowed drift is 10%/);
});

test('requires a measured positive integer first finish', () => {
  for (const invalid of [null, undefined, NaN, Infinity, 0, -1, 26_281.5]) {
    assert.throws(() => assertContentPacing(invalid), /actual first-finish tick/);
  }
});
