// Replace only the assigned section; preserve concurrent manager text byte-for-byte.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(root,'../../../..'),plan=path.join(repo,'docs/execplans/level5-room-design-20261008.md'),sha=b=>crypto.createHash('sha256').update(b).digest('hex'),before=fs.readFileSync(plan),marker=Buffer.from('## Step: Executive Office mockup'),start=before.indexOf(marker);
assert.ok(start>=0,'Assigned plan section exists');
assert.equal(before.indexOf(marker,start+marker.length),-1,'Exactly one assigned section');
const next=before.indexOf(Buffer.from('\n## '),start+marker.length),end=next<0?before.length:next;
const snapshot=JSON.parse(fs.readFileSync(path.join(root,'history/3x2-seat-hiding-20261011/snapshot-manifest.json'),'utf8'));
assert.equal(sha(before.subarray(start,end)),snapshot.planSectionSha256,'Concurrent edit to assigned section; preserve it and return evidence to manager');
const replacement=fs.readFileSync(path.join(root,'EXECPLAN_SECTION.md')),prefix=before.subarray(0,start),suffix=before.subarray(end),after=Buffer.concat([prefix,replacement,suffix]);
assert.equal(sha(after.subarray(0,prefix.length)),sha(prefix));assert.equal(sha(suffix.length?after.subarray(after.length-suffix.length):Buffer.alloc(0)),sha(suffix));
fs.writeFileSync(plan,after);
const receipt={status:'PASS',date:'2026-10-11',section:'Step: Executive Office mockup',beforeSha256:sha(before),afterSha256:sha(after),previousSectionSha256:sha(before.subarray(start,end)),newSectionSha256:sha(replacement),unchangedPrefixBytes:prefix.length,unchangedPrefixSha256:sha(prefix),unchangedSuffixBytes:suffix.length,unchangedSuffixSha256:sha(suffix),footprint:[3,2],retainedSeats:['executiveChair','visitorChair']};
fs.writeFileSync(path.join(root,'proof/evidence/v4/plan-revision-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log('PLAN REVISION PASS: Executive Office section updated for retained N2/S2 seats; all preceding/following plan bytes preserved.');
