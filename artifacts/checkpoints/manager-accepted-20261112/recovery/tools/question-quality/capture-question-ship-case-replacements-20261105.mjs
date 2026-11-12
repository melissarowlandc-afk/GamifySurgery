import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const path='tools/question-quality/fixtures/question-ship-case-replacements-before-20261105.json';
assert(!fs.existsSync(path),'Never refresh intake');
const dir='.local-dev/question-ship-case-replacements-20261105';fs.mkdirSync(dir,{recursive:true});
const paths=['packages/clinical-content/src/question-ship-manifest.ts','packages/clinical-content/src/question-ship-projection.ts',
 'packages/clinical-content/src/question-ship-manifest-validation.ts','packages/clinical-content/src/question-ship-manifest.test.ts',
 'packages/clinical-content/src/question-flags2-round3-20261105.test.ts','packages/clinical-content/src/question-flags2-round2-20261105.test.ts',
 'packages/clinical-content/src/question-flags2-20261105.test.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/index.ts',
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/answer-choice-timing.test.ts',
 'packages/game-domain/src/test-choice-orders.ts','packages/game-domain/tests/test-choice-order-inventory.test.ts',
 'apps/player/src/questionShipSaveCompatibility.test.ts'];
for(const p of paths)fs.copyFileSync(p,dir+'/'+p.replaceAll('/','__'));
const protectedFiles={};
for(const directory of ['packages/clinical-content/src','packages/game-domain/src','apps/player/src/session/cloud'])for(const name of fs.readdirSync(directory)){
 const p=directory+'/'+name;
 if(fs.statSync(p).isFile()&&(/question-new-n3/.test(name)||directory.endsWith('/cloud')))protectedFiles[p]=hash(p);
}
const release=c.SYNTHETIC_CLINICAL_RELEASE;
const ids=c.QUESTION_FLAGS2_ROUND3_REVISIONS.map(r=>r.caseId);
const record={capturedOn:'2026-11-05',scope:'Pre-integration exact source/content snapshot; synthetic content and hashes only, no private feedback or external source text.',
 default:{id:release.id,cases:release.cases.length,nodes:release.cases.reduce((n,cs)=>n+cs.decisionNodes.length,0),concepts:release.concepts.length,sha256:digest(release),
  caseHashes:Object.fromEntries(release.cases.map(cs=>[cs.id,digest(cs)])),conceptHashes:Object.fromEntries(release.concepts.map(x=>[x.id,digest(x)]))},
 oldCases:release.cases.filter(cs=>ids.includes(cs.id)),manifest:c.QUESTION_SHIP_MANIFEST,
 timing:{count:c.ANSWER_CHOICE_TIMING_REGISTRY.length,sha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY)},
 files:Object.fromEntries(paths.map(p=>[p,hash(p)])),protectedFiles};
fs.writeFileSync(path,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path,default:{...record.default,caseHashes:undefined,conceptHashes:undefined},manifestRows:record.manifest.accepted.length,timings:record.timing.count,protectedFiles:Object.keys(protectedFiles).length},null,2));
