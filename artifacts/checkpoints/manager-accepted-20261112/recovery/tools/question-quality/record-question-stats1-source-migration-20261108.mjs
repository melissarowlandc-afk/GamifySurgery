import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-stats1-before-20261108.json','utf8'));
const sha=v=>createHash('sha256').update(v).digest('hex');
const files=[
 ['docs/clinical/question-authoring-standard.md',before.standardBeforeText],
 ['packages/clinical-content/src/question-flags3-acceptance-test-support.ts',before.testSupportBeforeText],
].map(([path,beforeText])=>{
 assert.equal(sha(beforeText),before.files[path]);return {path,beforeSha256:sha(beforeText),afterSha256:sha(fs.readFileSync(path)),beforeText};
});
const report={checkedOn:'2026-11-08',scope:'Exact owner-authorized statistics standard section/version plus a test-only historical-epoch hook. No old captures are refreshed and no assertion/budget is relaxed.',files};
fs.writeFileSync('tools/question-quality/fixtures/question-stats1-source-migration-20261108.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(files.map(({path,beforeSha256,afterSha256})=>({path,beforeSha256,afterSha256})),null,2));
