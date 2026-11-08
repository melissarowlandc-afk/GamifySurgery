import fs from 'node:fs';
import {createHash} from 'node:crypto';
const sha=v=>createHash('sha256').update(v).digest('hex');
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags3-acceptance-before-20261107.json','utf8'));
const source=JSON.parse(fs.readFileSync('.local-dev/question-flags3-acceptance-20261107/before-source-texts.json','utf8'));
const files=Object.entries(source).flatMap(([path,beforeText])=>{
 const current=fs.readFileSync(path,'utf8'),afterSha256=sha(current);if(afterSha256===before.files[path])return [];
 return [{path,beforeSha256:before.files[path],afterSha256,beforeText}];
});
const allowed=new Set([
 'tools/question-quality/capture-question-flags3-acceptance-20261107.mjs',
 'packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
 'packages/clinical-content/src/question-ship-manifest.ts','packages/clinical-content/src/answer-choice-timing.ts',
 'packages/game-domain/src/test-choice-orders.ts',
 'packages/clinical-content/src/question-new-n3-acceptance-test-support.ts',
 'packages/clinical-content/src/question-new-n3-acceptance-20261105.test.ts',
 'packages/clinical-content/src/question-flags3-20261107.test.ts',
 'packages/clinical-content/src/question-ship-manifest.test.ts',
 'packages/clinical-content/src/answer-choice-timing.test.ts',
 'packages/clinical-content/src/question-ship-case-replacements.test.ts',
 'packages/clinical-content/src/question-bank-batch2b-acceptance-20261105.test.ts',
 'packages/clinical-content/src/question-new-n3-round3-20261105.test.ts',
 'packages/clinical-content/src/question-flags2-round3-20261105.test.ts',
 'apps/player/src/questionShipSaveCompatibility.test.ts',
]);
for(const file of files)if(!allowed.has(file.path))throw Error('Unassigned existing source changed: '+file.path);
const output={checkedOn:'2026-11-07',scope:'Exact source-byte migration for authorized flags3 acceptance only; old captures retained and validated, never relaxed.',files};
fs.writeFileSync('tools/question-quality/fixtures/question-flags3-acceptance-source-migration-20261107.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({files:files.map(f=>({path:f.path,before:f.beforeSha256,after:f.afterSha256}))},null,2));
