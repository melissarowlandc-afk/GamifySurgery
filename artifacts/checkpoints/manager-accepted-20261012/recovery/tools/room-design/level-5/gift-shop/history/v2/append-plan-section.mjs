// Only append the assigned Gift Shop section; preserve current concurrent plan bytes.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url)), repo = path.resolve(root, '../../../..'), plan = path.join(repo, 'docs/execplans/level5-room-design-20261008.md');
const section = fs.readFileSync(path.join(root, 'EXECPLAN_SECTION.md')), before = fs.readFileSync(plan), marker = '## Step: Gift Shop mockup';
assert.ok(!before.toString('utf8').includes(marker), 'Do not replace or duplicate a shared plan section.');
assert.ok(section.toString('utf8').startsWith(marker)); const appended = Buffer.concat([Buffer.from('\n'), section]);
fs.appendFileSync(plan, appended); const after = fs.readFileSync(plan); assert.ok(after.subarray(0, before.length).equals(before), 'All existing plan bytes preserved'); assert.ok(after.subarray(before.length).equals(appended));
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
fs.writeFileSync(path.join(root, 'proof/evidence/v1/plan-append-receipt.json'), JSON.stringify({ status: 'PASS', path: 'docs/execplans/level5-room-design-20261008.md', unchangedPrefixBytes: before.length, unchangedPrefixSha256: sha(before), appendedBytes: appended.length, appendedSha256: sha(appended), afterSha256: sha(after), marker, method: 'Single append; all current Founder/Executive/owner-rule bytes preserved.' }, null, 2) + '\n');
console.log('PLAN APPEND PASS: Gift Shop section appended; every existing Founder/Executive/owner-rule byte preserved.');
