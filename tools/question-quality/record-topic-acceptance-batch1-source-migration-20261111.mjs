import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json','utf8'));
const sha=s=>createHash('sha256').update(s).digest('hex');
const files=before.sourcePreimages.map(r=>({...r,afterSha256:sha(fs.readFileSync(r.path))})).filter(r=>r.beforeSha256!==r.afterSha256);
for(const r of files)assert.equal(sha(r.beforeText),r.beforeSha256);
fs.writeFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch1-source-migration-20261111.json',JSON.stringify({checkedOn:'2026-11-11',scope:'Explicit clinical integration/test deltas only. Original topic sources/tests/packets and old captures are not edited. Runtime changes belong to other workers.',files},null,2)+'\n');
console.log(JSON.stringify({count:files.length,paths:files.map(r=>r.path)}));
