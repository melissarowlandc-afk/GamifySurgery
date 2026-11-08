import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const s=await import('../../packages/clinical-content/src/question-stats1-20261108.ts');
const output='tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json';
assert(!fs.existsSync(output),'Immutable capture exists; never refresh');
const original=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-stats1-before-20261108.json','utf8'));
const filesReceipt=JSON.parse(fs.readFileSync('docs/research/question-stats1-files-20261108.json','utf8'));
const sha=v=>createHash('sha256').update(v).digest('hex');
const digest=v=>sha(JSON.stringify(v));
const paths=new Set([...Object.keys(original.files),...filesReceipt.newFiles.map(r=>r.path),filesReceipt.self.path]);
for(const dir of ['packages/clinical-content/src','tools/question-quality'])
 for(const entry of fs.readdirSync(dir,{withFileTypes:true}))if(entry.isFile()&&/\.(ts|mjs|json)$/.test(entry.name))paths.add(path.posix.join(dir,entry.name));
paths.add('apps/player/src/questionShipSaveCompatibility.test.ts');
for(const label of ['A','B'])paths.add('docs/research/question-stats1-review-'+label+'-20261108.json');
const files=Object.fromEntries([...paths].sort().filter(p=>fs.existsSync(p)).map(p=>[p,sha(fs.readFileSync(p))]));
const sourceTexts=Object.fromEntries([...paths].sort().filter(p=>fs.existsSync(p)&&/\.(ts|mjs)$/.test(p)).map(p=>[p,fs.readFileSync(p,'utf8')]));
const live=c.SYNTHETIC_CLINICAL_RELEASE;
const reviews=['A','B'].flatMap(n=>JSON.parse(fs.readFileSync('docs/research/question-stats1-review-'+n+'-20261108.json','utf8')));
assert.equal(reviews.filter(r=>r.verdict==='PASS').length,42);assert.equal(reviews.filter(r=>r.verdict==='REVISE').length,22);
const record={capturedOn:'2026-11-08',purpose:'Immutable pre-stats1-acceptance epoch; never refresh',
 default:{sha256:digest(live),caseHashes:Object.fromEntries(live.cases.map(cs=>[cs.id,digest(cs)])),conceptHashes:Object.fromEntries(live.concepts.map(co=>[co.id,digest(co)])),
  caseIds:live.cases.map(cs=>cs.id),conceptIds:live.concepts.map(co=>co.id),caseCount:live.cases.length,nodeCount:live.cases.reduce((n,cs)=>n+cs.decisionNodes.length,0),
  activeConceptCount:new Set(live.cases.flatMap(cs=>cs.decisionNodes.map(n=>n.primaryConceptId))).size},
 catalogSha256:digest(c.QUESTION_CATALOG_RELEASE),manifest:c.QUESTION_SHIP_MANIFEST,manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),
 timing:c.ANSWER_CHOICE_TIMING_REGISTRY,timingSha256:digest(c.ANSWER_CHOICE_TIMING_REGISTRY),
 reviewedSource:s.QUESTION_STATS1_SOURCE_RELEASE,reviewedSourceSha256:digest(s.QUESTION_STATS1_SOURCE_RELEASE),reviewedRevisions:s.QUESTION_STATS1_REVISIONS,
 packet:JSON.parse(fs.readFileSync('docs/research/question-stats1-20261108.json','utf8')),reviews,retainedInput:s.QUESTION_STATS1_RETAINED_INPUT,
 additional:original.additional,files};
const local='.local-dev/question-stats1-acceptance-20261108';fs.mkdirSync(local,{recursive:true});
fs.writeFileSync(local+'/before-source-texts.json',JSON.stringify(sourceTexts));
fs.writeFileSync(output,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({output,protectedFiles:Object.keys(files).length,defaultSha256:record.default.sha256,reviewedSourceSha256:record.reviewedSourceSha256,acceptedRows:record.manifest.accepted.length,bytes:fs.statSync(output).size}));
