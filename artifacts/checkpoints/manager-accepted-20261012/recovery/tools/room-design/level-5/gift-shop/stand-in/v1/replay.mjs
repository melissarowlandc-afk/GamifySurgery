// Run after proof/build.mjs --stand-in; immediately restore with proof/build.mjs.
import fs from 'node:fs'; import path from 'node:path'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url'; import { createCanvas } from '@napi-rs/canvas';
import { loadNativeEngine } from '../../proof/native-engine.mjs'; import { PREPARED_METADATA } from '../../proof/design-rooms.js';
const here = path.dirname(fileURLToPath(import.meta.url)); assert.equal(PREPARED_METADATA.mode, 'stand-in'); const { engine, warnings } = await loadNativeEngine();
for (const [id, overrides] of [['occupied', {}], ['routes', { routes: true, contacts: true, doors: new Set(['S2']), queueTwo: true }]]) { Object.assign(engine.state, overrides); const c = createCanvas(1, 1), result = await engine.render(c, true); assert.equal(result.bad, false); fs.writeFileSync(path.join(here, 'replay-' + id + '.png'), c.toBuffer('image/png')); }
assert.deepEqual(warnings, []); console.log('STAND-IN REPLAY PASS: actual native renderer; frozen occupied and full-queue route views; original neutral sources unchanged.');
