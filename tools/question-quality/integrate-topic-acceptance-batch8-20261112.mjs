import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {PROGRAM_BATCH8_ROWS as rows,PROGRAM_BATCH8_REPLACED_ROWS as removed,
  PROGRAM_BATCH8_RETIREMENTS as retirements,PROGRAM_BATCH8_RETARGETED_CONSOLIDATIONS as retargeted}
  from '../../packages/clinical-content/src/question-program-batch8-accepted-data-20261112.ts';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch8-before-20261112.json','utf8'));
const dir='packages/clinical-content/src/';
const hash=b=>createHash('sha256').update(b).digest('hex');
const replace=(s,a,b)=>{assert.equal(s.split(a).length,2,'Unique anchor '+a);return s.replace(a,b);};
function original(path){const text=fs.readFileSync(path,'utf8');assert.equal(hash(text),before.observed[path],path+' untouched captured preimage');return text;}
const path=dir+'question-ship-manifest.ts';let text=original(path);
assert(text.includes('question-ship.2026-11-12.v16'),'One-shot acceptance only');
// Locate the existing JSON literal blocks without reformatting adjacent rows.
// The installed TypeScript package exposes its version shim, not a parser API.
function block(anchor){
  assert.equal(text.split(anchor).length,2,'Unique literal '+anchor);
  const start=text.indexOf(anchor)+anchor.length-1,open=text[start],close=open==='['?']':'}';
  let depth=0,quoted=false,escaped=false,line=false,comment=false;
  for(let i=start;i<text.length;i++){
    const c=text[i],n=text[i+1];
    if(line){if(c==='\n')line=false;continue;}
    if(comment){if(c==='*'&&n==='/'){comment=false;i++;}continue;}
    if(quoted){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c==='"')quoted=false;continue;}
    if(c==='/'&&n==='/'){line=true;i++;continue;}if(c==='/'&&n==='*'){comment=true;i++;continue;}
    if(c==='"'){quoted=true;continue;}
    if(c===open)depth++;if(c===close&&--depth===0)return {start,end:i+1};
  }
  throw new Error('Unclosed literal '+anchor);
}
const edits=[];
const accepted=block('  accepted: [');
for(const row of removed){
  const serialized=JSON.stringify(row,null,2);
  const patterns=[serialized,serialized.split('\n').map((line,i)=>i?'  '+line:line).join('\n'),JSON.stringify(row)];
  const matches=patterns.flatMap(pattern=>{
    const at=text.indexOf(pattern,accepted.start);return at>=0&&at<accepted.end?[{start:at,end:at+pattern.length}]:[];
  });
  assert.equal(matches.length,1,row.questionVariantId);const n=matches[0];let end=n.end;
  while(/\s/.test(text[end]))end++;assert.equal(text[end],',');edits.push({start:n.start,end:end+1,value:''});
}
edits.push({start:accepted.end-1,end:accepted.end-1,value:'\n  // Batch 8: exact owner-directed successors and the new dantrolene item.\n'+JSON.stringify(rows,null,2).slice(1,-1).trimStart()+',\n'});
const headers=block('  headerSources: {'),newHeaders=[];
for(const [caseId,sourceView]of new Map(rows.map(r=>[r.caseId,r.sourceView]))){
  const oldView=before.manifest.headerSources[caseId];
  if(oldView){
    const pattern=JSON.stringify(caseId)+': '+JSON.stringify(oldView),start=text.indexOf(pattern,headers.start);
    assert(start>=0&&start<headers.end,caseId+' exact prior header');
    edits.push({start:start+pattern.length-JSON.stringify(oldView).length,end:start+pattern.length,value:JSON.stringify(sourceView)});
  }
  else newHeaders.push('    '+JSON.stringify(caseId)+': '+JSON.stringify(sourceView)+',');
}
edits.push({start:headers.end-1,end:headers.end-1,value:',\n'+newHeaders.join('\n')+'\n'});
const retired=block('  retirements: [');
edits.push({start:retired.end-1,end:retired.end-1,value:',\n'+JSON.stringify(retirements,null,2).slice(1,-1).trimStart()+'\n'});
for(const relation of retargeted){
  const patterns=['"with":','"with": '].map(p=>p+JSON.stringify(relation.before.with));
  const matches=patterns.flatMap(pattern=>text.includes(pattern)?[{pattern,start:text.indexOf(pattern)}]:[]);
  assert.equal(matches.length,1,'Exact prior consolidation '+relation.before.id);
  const {pattern,start}=matches[0];edits.push({start,end:start+pattern.length,
    value:pattern.slice(0,-JSON.stringify(relation.before.with).length)+JSON.stringify(relation.after.with)});
}
const versionStart=text.indexOf('"question-ship.2026-11-12.v16"');
edits.push({start:versionStart,end:versionStart+'"question-ship.2026-11-12.v16"'.length,value:'"question-ship.2026-11-12.v17"'});
for(const e of edits.sort((a,b)=>b.start-a.start))text=text.slice(0,e.start)+e.value+text.slice(e.end);
fs.writeFileSync(path,text);

let source=original(dir+'synthetic-content.ts');
source='import {QUESTION_PROGRAM_BATCH8_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch8Concepts} from "./question-program-batch8-accepted-20261112";\n'+source;
const start=source.indexOf('projectManagerAcceptedQuestions(')+'projectManagerAcceptedQuestions('.length;
let depth=0,end=start;for(;end<source.length;end++){if(source[end]==='(')depth++;else if(source[end]===')')depth--;else if(source[end]===','&&depth===0)break;}
source=source.slice(0,start)+'withAcceptedQuestionProgramBatch8Concepts('+source.slice(start,end)+')'+source.slice(end);
source=replace(source,', QUESTION_FLAGS_PRE_REVISION_RELEASE, {',', QUESTION_FLAGS_PRE_REVISION_RELEASE, {\n  ...QUESTION_PROGRAM_BATCH8_ACCEPTED_SOURCE_VIEWS,');
fs.writeFileSync(dir+'synthetic-content.ts',source);
original(dir+'index.ts');
fs.appendFileSync(dir+'index.ts','\n// Batch 8 exact owner-directed acceptance; direction is not version approval.\nexport * from "./question-program-batch8-accepted-20261112";\n');
original(dir+'answer-choice-timing.ts');
fs.appendFileSync(dir+'answer-choice-timing.ts','\nimport {QUESTION_PROGRAM_BATCH8_ACCEPTED_TIMING_ENTRIES,restoreQuestionProgramBatch8HistoricalTimings} from "./question-program-batch8-accepted-20261112";\nrestoreQuestionProgramBatch8HistoricalTimings(ANSWER_CHOICE_TIMING_REGISTRY);\nANSWER_CHOICE_TIMING_REGISTRY.push(...QUESTION_PROGRAM_BATCH8_ACCEPTED_TIMING_ENTRIES);\n');
let orders=original('packages/game-domain/src/test-choice-orders.ts');
orders='import {QUESTION_PROGRAM_BATCH8_ACCEPTED_TEST_ORDER_RECORDS,QUESTION_PROGRAM_BATCH8_RETAINED_TEST_ORDER_RECORDS} from "@gamify-surgery/clinical-content";\n'+orders;
orders=replace(orders,'  ...QUESTION_PROGRAM_BATCH7_ACCEPTED_TEST_ORDER_RECORDS,','  ...QUESTION_PROGRAM_BATCH7_ACCEPTED_TEST_ORDER_RECORDS,\n  ...QUESTION_PROGRAM_BATCH8_ACCEPTED_TEST_ORDER_RECORDS,');
orders=replace(orders,'export const EXACT_TEST_CHOICE_ORDER_RECORDS: readonly ExactTestChoiceOrderRecord[] = [',
  "function withBatch8HistoricalOrders(records:readonly ExactTestChoiceOrderRecord[]):readonly ExactTestChoiceOrderRecord[]{\n  const restored=[...records];\n  for(const record of QUESTION_PROGRAM_BATCH8_RETAINED_TEST_ORDER_RECORDS){\n    const prior=restored.find(r=>r.caseId===record.caseId&&r.nodeId===record.nodeId&&r.questionVariantId===record.questionVariantId&&r.choiceId===record.choiceId);\n    if(!prior)restored.push(record);\n    else if(JSON.stringify(prior)!==JSON.stringify(record))throw new Error(\"Conflicting frozen batch8 predecessor order: \"+record.questionVariantId);\n  }\n  return restored;\n}\n\nexport const EXACT_TEST_CHOICE_ORDER_RECORDS: readonly ExactTestChoiceOrderRecord[] = withBatch8HistoricalOrders([");
orders=replace(orders,'  ...QUESTION_PROGRAM_BATCH8_ACCEPTED_TEST_ORDER_RECORDS,\n];','  ...QUESTION_PROGRAM_BATCH8_ACCEPTED_TEST_ORDER_RECORDS,\n]);');
fs.writeFileSync('packages/game-domain/src/test-choice-orders.ts',orders);
console.log(JSON.stringify({accepted:rows.length,withdrawn:removed.length,retirements:retirements.length}));
