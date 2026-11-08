import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const f=await import('../../packages/clinical-content/src/question-flags3-20261107.ts');
const output='tools/question-quality/fixtures/question-flags3-acceptance-before-20261107.json';
assert(!fs.existsSync(output),'Immutable capture already exists; do not refresh it');
const original=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags3-before-20261107.json','utf8'));
const sha=v=>createHash('sha256').update(v).digest('hex');
const digest=v=>sha(JSON.stringify(v));
const paths=new Set(Object.keys(original.files));
for(const directory of ['packages/clinical-content/src','tools/question-quality']){
 for(const entry of fs.readdirSync(directory,{withFileTypes:true}))if(entry.isFile()&&/\.(ts|mjs|json)$/.test(entry.name))paths.add(path.posix.join(directory,entry.name));
}
paths.add('apps/player/src/questionShipSaveCompatibility.test.ts');
paths.add('docs/research/question-flags3-20261107.json');
paths.add('docs/research/question-flags3-review-20261107.json');
const files=Object.fromEntries([...paths].sort().filter(p=>fs.existsSync(p)).map(p=>[p,sha(fs.readFileSync(p))]));
// Source bytes are retained only for code/doc migration receipts, never clinical
// external source text. Captures and clinical prose use their own exact views.
const sourceTexts=Object.fromEntries([...paths].sort().filter(p=>fs.existsSync(p)&&/\.(ts|mjs)$/.test(p)).map(p=>[p,fs.readFileSync(p,'utf8')]));
const live=c.SYNTHETIC_CLINICAL_RELEASE;
const record={capturedOn:'2026-11-07',purpose:'Exact pre-flags3-acceptance epoch; never refresh',
 default:{sha256:digest(live),caseHashes:Object.fromEntries(live.cases.map(cs=>[cs.id,digest(cs)])),
  conceptHashes:Object.fromEntries(live.concepts.map(co=>[co.id,digest(co)])),caseIds:live.cases.map(cs=>cs.id),conceptIds:live.concepts.map(co=>co.id)},
 catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),manifest:c.QUESTION_SHIP_MANIFEST,
 timing:c.ANSWER_CHOICE_TIMING_REGISTRY,timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),
 reviewedSource:f.QUESTION_FLAGS3_SOURCE_RELEASE,reviewedSourceSha256:digest(f.QUESTION_FLAGS3_SOURCE_RELEASE),
 reviewedRevisions:f.QUESTION_FLAGS3_REVISIONS,
 packet:JSON.parse(fs.readFileSync('docs/research/question-flags3-20261107.json','utf8')),
 retainedInput:f.QUESTION_FLAGS3_RETAINED_INPUT,files};
const localDir='.local-dev/question-flags3-acceptance-20261107';fs.mkdirSync(localDir,{recursive:true});
fs.writeFileSync(localDir+'/before-source-texts.json',JSON.stringify(sourceTexts));
fs.writeFileSync(output,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({output,files:Object.keys(files).length,defaultSha256:record.default.sha256,rows:record.manifest.accepted.length,bytes:fs.statSync(output).size}));
