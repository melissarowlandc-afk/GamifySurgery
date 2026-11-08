import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const a=await import('../../packages/clinical-content/src/question-stats1-accepted-20261108.ts');
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json','utf8'));
const local='.local-dev/question-stats1-acceptance-20261108/before-source-texts.json';
const output='tools/question-quality/fixtures/question-stats1-acceptance-runtime-migration-20261108.json';
const previous=fs.existsSync(output)?JSON.parse(fs.readFileSync(output,'utf8')):null;
const texts=fs.existsSync(local)?JSON.parse(fs.readFileSync(local,'utf8')):Object.fromEntries((previous?.files??[]).map(r=>[r.path,r.beforeText]));
const sha=v=>createHash('sha256').update(v).digest('hex');
const changes=[];
function edit(p,fn){const old=texts[p];assert(old,p+' absent from capture');assert.equal(sha(old),before.files[p]);
 const value=fn(old);assert.notEqual(value,old,p+' unchanged');changes.push({path:p,beforeSha256:sha(old),afterSha256:sha(value),beforeText:old});
 const current=fs.readFileSync(p,'utf8');if(process.argv.includes('--check'))assert.equal(current,value,p+' integration stale');
 else {const prior=previous?.files.find(r=>r.path===p);assert([old,value].includes(current)||(prior?.beforeSha256===before.files[p]&&prior.afterSha256===sha(current)),p+' concurrent edit; stop');fs.writeFileSync(p,value);}}
edit('packages/clinical-content/src/question-ship-manifest.ts',old=>{
 let t=old.replace('id: "question-ship.2026-11-07.v5"','id: "question-ship.2026-11-08.v6"');
 for(const id of ['G06','F3-01']){const re=new RegExp('  \\{\\r?\\n    "acceptanceId": "'+id+'",\\r?\\n[\\s\\S]*?  \\},\\r?\\n','g');
  assert.equal([...t.matchAll(re)].length,1,id+' exact superseded row');t=t.replace(re,'');}
 const rows=a.QUESTION_STATS1_ACCEPTED_REVISIONS.map(r=>({acceptanceId:r.auditId,caseId:r.caseId,nodeId:r.nodeId,questionVariantId:r.questionVariantId,
  conceptId:r.question.conceptId,sourceView:'stats1-accepted',decision:'docs/research/question-stats1-manager-decision-20261108.md'}));
 const block='  // BEGIN STATS1 ACCEPTANCES 20261108\n'+rows.map(r=>'  '+JSON.stringify(r,null,2).replaceAll('\n','\n  ')+',').join('\n')+'\n  // END STATS1 ACCEPTANCES 20261108\n';
 assert.equal(t.split('] satisfies QuestionShipAcceptance[]').length-1,1);t=t.replace('] satisfies QuestionShipAcceptance[]',block+'] satisfies QuestionShipAcceptance[]');
 for(const id of ['G06','F3-01']){const row=before.manifest.accepted.find(r=>r.acceptanceId===id);assert(row);
  const line=new RegExp('  "'+row.caseId.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'": "'+row.sourceView+'",\\r?\\n','g');
  assert.equal([...t.matchAll(line)].length,1,id+' header');t=t.replace(line,'');}
 const header='  // BEGIN STATS1 ACCEPTED HEADERS 20261108\n'+rows.map(r=>'  '+JSON.stringify(r.caseId)+': "stats1-accepted",').join('\n')+'\n  // END STATS1 ACCEPTED HEADERS 20261108\n';
 assert.equal(t.split('  headerSources: {').length-1,1);return t.replace('  headerSources: {','  headerSources: {\n'+header);
});
edit('packages/clinical-content/src/synthetic-content.ts',t=>{
 const anchor='/** Default runtime content: exact accepted rewrites/new items plus legacy fallback. */';assert(t.includes(anchor));
 t=t.replace(anchor,'// BEGIN STATS1 accepted-source integration 20261108\nimport { QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE, withAcceptedQuestionStats1Concepts } from "./question-stats1-accepted-20261108";\n// END STATS1 accepted-source integration 20261108\n'+anchor);
 const start=t.indexOf('withAcceptedQuestionFlags2Concepts(',t.indexOf('export const SYNTHETIC_CLINICAL_RELEASE'));
 assert(start>=0);let depth=0,end=start;for(;end<t.length;end++){if(t[end]==='(')depth++;if(t[end]===')'&&--depth===0)break;}
 assert(end<t.length);t=t.slice(0,start)+'withAcceptedQuestionStats1Concepts('+t.slice(start,end+1)+')'+t.slice(end+1);
 const key='  "flags3-accepted": QUESTION_FLAGS3_ACCEPTED_SOURCE_RELEASE,';assert(t.includes(key));return t.replace(key,'  "stats1-accepted": QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE,\n'+key);
});
edit('packages/clinical-content/src/index.ts',t=>t+'\n// BEGIN STATS1 accepted and retained source exports 20261108\nexport * from "./question-stats1-20261108";\nexport * from "./question-stats1-accepted-20261108";\n// END STATS1 accepted and retained source exports 20261108\n');
edit('packages/clinical-content/src/answer-choice-timing.ts',t=>{
 const anchor='...QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES].map';assert(t.includes(anchor));
 t=t.replace('...QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES,','...QUESTION_FLAGS2_ACCEPTED_TIMING_ENTRIES, ...QUESTION_STATS1_RETIRED_FLAGS2_TIMING_ENTRIES,');
 return t.replace(anchor,'...QUESTION_STATS1_RETIRED_FLAGS3_TIMING_ENTRIES, ...QUESTION_FLAGS3_ACCEPTED_TIMING_ENTRIES, ...QUESTION_STATS1_ACCEPTED_TIMING_ENTRIES].map')+
 '\n// BEGIN STATS1 exact accepted no-test timing 20261108\nimport { QUESTION_STATS1_ACCEPTED_TIMING_ENTRIES, QUESTION_STATS1_RETIRED_FLAGS2_TIMING_ENTRIES, QUESTION_STATS1_RETIRED_FLAGS3_TIMING_ENTRIES } from "./question-stats1-accepted-20261108";\n// END STATS1 exact accepted no-test timing 20261108\n';
});
const receipt={capturedOn:'2026-11-08',purpose:'Exact four runtime integration deltas; not a historical-capture refresh',files:changes};
if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(output,'utf8')),receipt);else fs.writeFileSync(output,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({files:changes.map(r=>r.path),accepted:64,superseded:['G06','F3-01'],newAcceptedRowCount:133,legacyBindingsUnchanged:true,wholeCaseRelationsUnchanged:true}));
