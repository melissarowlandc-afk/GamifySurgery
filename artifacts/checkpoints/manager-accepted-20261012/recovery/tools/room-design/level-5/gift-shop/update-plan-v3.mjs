// Replace only our section; preserve the manager's binding room-first directive.
import fs from 'node:fs'; import path from 'node:path'; import crypto from 'node:crypto'; import assert from 'node:assert/strict'; import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url)), repo = path.resolve(root, '../../../..'), file = path.join(repo, 'docs/execplans/level5-room-design-20261008.md');
const bytes = fs.readFileSync(file), text = bytes.toString('utf8'), heading = '## Step: Gift Shop mockup', directive = '- **Room-first composition (owner, 2026-10-11, applies to all remaining rooms):**';
assert.equal(text.split(heading).length, 2, 'Exactly one assigned Gift Shop section'); assert.ok(text.includes(directive), 'Preserve the manager’s binding room-first instruction');
const start = text.indexOf(heading), tail = text.slice(start + heading.length), next = tail.search(/^## /m), nextHeading = next < 0 ? text.length : start + heading.length + next;
const directiveStart = text.indexOf(directive, start), end = directiveStart >= 0 && directiveStart < nextHeading ? directiveStart : nextHeading;
const prefix = bytes.subarray(0, Buffer.byteLength(text.slice(0, start))), suffix = bytes.subarray(Buffer.byteLength(text.slice(0, end))), section = fs.readFileSync(path.join(root, 'EXECPLAN_SECTION.md'));
assert.ok(section.toString('utf8').startsWith(heading)); assert.ok(!section.toString('utf8').includes(directive), 'Directive belongs to the preserved manager suffix');
const after = Buffer.concat([prefix, section, suffix]), sha = b => crypto.createHash('sha256').update(b).digest('hex');
assert.deepEqual(fs.readFileSync(file), bytes, 'Concurrent shared-plan edit; retry on current bytes'); fs.writeFileSync(file, after);
assert.deepEqual(fs.readFileSync(file).subarray(0, prefix.length), prefix); assert.deepEqual(fs.readFileSync(file).subarray(prefix.length + section.length), suffix); assert.equal(after.toString('utf8').split(directive).length, 2);
const receipt = { status: 'PASS', writeScope: heading, preservedManagerDirective: directive, unchangedPrefixBytes: prefix.length, unchangedPrefixSha256: sha(prefix), unchangedSuffixBytes: suffix.length, unchangedSuffixSha256: sha(suffix), sectionBytes: section.length, sectionSha256: sha(section), replacedSectionSha256: sha(bytes.subarray(prefix.length, bytes.length - suffix.length)), planSha256: sha(after) };
fs.writeFileSync(path.join(root, 'proof/evidence/v3/plan-revision-receipt.json'), JSON.stringify(receipt, null, 2) + '\n');
console.log(`SCOPED PLAN UPDATE PASS: only Step: Gift Shop mockup replaced; ${prefix.length} prefix bytes / ${suffix.length} suffix bytes preserved exactly, including the manager’s room-first directive.`);
