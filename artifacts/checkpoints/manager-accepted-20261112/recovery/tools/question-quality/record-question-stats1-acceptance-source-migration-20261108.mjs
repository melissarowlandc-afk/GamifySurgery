import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json','utf8'));
const output='tools/question-quality/fixtures/question-stats1-acceptance-source-migration-20261108.json';
const local='.local-dev/question-stats1-acceptance-20261108/before-source-texts.json';
const texts=fs.existsSync(local)?JSON.parse(fs.readFileSync(local,'utf8')):Object.fromEntries(JSON.parse(fs.readFileSync(output,'utf8')).files.map(r=>[r.path,r.beforeText]));
const sha=v=>createHash('sha256').update(v).digest('hex');
const allowed=new Set([
 'packages/clinical-content/src/question-ship-manifest.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/index.ts','packages/clinical-content/src/answer-choice-timing.ts',
 'packages/clinical-content/src/question-stats1-test-support.ts','packages/clinical-content/src/question-flags3-acceptance-test-support.ts',
 'packages/clinical-content/src/question-stats1-20261108.test.ts','packages/clinical-content/src/question-flags3-acceptance-20261107.test.ts',
 'packages/clinical-content/src/question-ship-manifest.test.ts','packages/clinical-content/src/answer-choice-timing.test.ts',
 'apps/player/src/questionShipSaveCompatibility.test.ts',
 'packages/clinical-content/src/question-flags2-20261105.test.ts','packages/clinical-content/src/question-flags2-round2-20261105.test.ts',
 'packages/clinical-content/src/question-flags2-round3-20261105.test.ts','packages/clinical-content/src/question-new-n3-round2-20261105.test.ts',
 'packages/clinical-content/src/playable-patient-narrative.test.ts','packages/clinical-content/src/patient-library-wording-repair.test.ts','packages/clinical-content/src/pilot-content.test.ts',
]);
const changed=Object.entries(before.files).filter(([p,h])=>sha(fs.readFileSync(p))!==h);
for(const[p]of changed)assert(allowed.has(p),'Unexpected/concurrent change; do not absorb: '+p);
const files=changed.map(([path,beforeSha256])=>{assert.equal(sha(texts[path]),beforeSha256,path+' preimage');return {path,beforeSha256,afterSha256:sha(fs.readFileSync(path)),beforeText:texts[path]};});
const receipt={capturedOn:'2026-11-08',purpose:'Pin exact authorized stats1 integration; retain every old assertion and immutable capture',files};
if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(output,'utf8')),receipt);else fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({protected:Object.keys(before.files).length,unchanged:Object.keys(before.files).length-files.length,changed:files.map(r=>r.path)}));
