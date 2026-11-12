import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const path='tools/question-quality/fixtures/question-new-n3-acceptance-before-20261105.json';
assert(!fs.existsSync(path),'Never refresh the pre-acceptance capture');
const dir='.local-dev/question-new-n3-acceptance-20261105';fs.mkdirSync(dir,{recursive:true});
const paths=[
 'packages/clinical-content/src/question-ship-manifest.ts',
 'packages/clinical-content/src/synthetic-content.ts',
 'packages/clinical-content/src/question-new-n3-round3-source-20261105.ts',
 'packages/clinical-content/src/question-ship-manifest.test.ts',
 'packages/clinical-content/src/question-ship-case-replacements.test.ts',
 'packages/clinical-content/src/question-ship-case-replacements-test-support.ts',
 'packages/clinical-content/src/question-new-n3-20261105.test.ts',
 'packages/clinical-content/src/question-new-n3-round2-20261105.test.ts',
 'packages/clinical-content/src/question-new-n3-round3-20261105.test.ts',
 'apps/player/src/questionShipSaveCompatibility.test.ts',
];
for(const p of paths)fs.copyFileSync(p,dir+'/'+p.replaceAll('/','__'));
const protectedFiles={};
for(const directory of ['packages/clinical-content/src','packages/game-domain/src','apps/player/src/session/cloud'])for(const name of fs.readdirSync(directory)){
 const p=directory+'/'+name;
 if(fs.statSync(p).isFile()&&(/question-new-n3/.test(name)||directory.endsWith('/cloud')))protectedFiles[p]=hash(p);
}
for(const p of [
 'docs/research/question-new-n3-round3-20261105.json','docs/research/question-new-n3-review2-20261105.json',
 'docs/research/question-new-n3-manager-decision-20261105.md',
 'tools/question-quality/fixtures/question-ship-case-replacements-before-20261105.json',
 'tools/question-quality/fixtures/question-ship-case-replacements-source-migration-20261105.json',
 'tools/question-quality/fixtures/question-flags2-round3-before-20261105.json',
])protectedFiles[p]=hash(p);
const release=c.SYNTHETIC_CLINICAL_RELEASE;
const record={capturedOn:'2026-11-05',scope:'Exact pre-N3-acceptance content/source snapshot; synthetic data and hashes, no private feedback or external source text.',
 default:{cases:release.cases.length,nodes:release.cases.reduce((n,cs)=>n+cs.decisionNodes.length,0),concepts:release.concepts.length,
  conceptIds:release.concepts.map(c=>c.id),sha256:digest(release),caseHashes:Object.fromEntries(release.cases.map(cs=>[cs.id,digest(cs)])),
  conceptHashes:Object.fromEntries(release.concepts.map(x=>[x.id,digest(x)]))},
 manifest:c.QUESTION_SHIP_MANIFEST,catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),round3SourceSha256:digest(c.QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE),
 timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),files:Object.fromEntries(paths.map(p=>[p,hash(p)])),protectedFiles};
fs.writeFileSync(path,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path,cases:record.default.cases,nodes:record.default.nodes,concepts:record.default.concepts,sha256:record.default.sha256,
 manifestRows:record.manifest.accepted.length,sourceCases:c.QUESTION_NEW_N3_ROUND3_SOURCE_RELEASE.cases.length},null,2));
