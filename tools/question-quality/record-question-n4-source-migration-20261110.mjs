import fs from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-n4-acceptance-before-20261110.json','utf8'));
const sha=s=>createHash('sha256').update(s).digest('hex');
const files=before.sourcePreimages.map(row=>{assert.equal(sha(row.beforeText),row.beforeSha256);return {...row,afterSha256:sha(fs.readFileSync(row.path))};});
assert(files.every(row=>row.afterSha256!==row.beforeSha256),'Do not authorize unmodified files');
fs.writeFileSync('tools/question-quality/fixtures/question-n4-acceptance-source-migration-20261110.json',JSON.stringify({checkedOn:'2026-11-10',scope:'Ten explicit clinical-only source/test deltas. Immutable preimages and original captures retained; no domain runtime or save-view-model edits.',files},null,2)+'\n');
console.log(JSON.stringify({files:files.length,paths:files.map(f=>f.path)}));
