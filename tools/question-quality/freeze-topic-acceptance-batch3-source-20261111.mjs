import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {isDeepStrictEqual} from 'node:util';
import '../economy-audit/source-loader.mjs';
import {syntheticClinicalCaseSchema} from '../../packages/clinical-content/src/schema.ts';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch3-before-20261111.json');
const selection=read('tools/question-quality/fixtures/question-topic-acceptance-batch3-selection-20261111.json');
const outputPath='docs/research/question-topic-acceptance-batch3-source-freeze-20261111.json';
if(fs.existsSync(outputPath)){
  assert(process.argv.includes('--check'),'Raw source freeze is immutable; use --check.');
  const saved=read(outputPath),expected=selection.selected.flatMap(item=>{
    const topic=before.topics.find(topic=>topic.config.slug===item.topic);
    return topic.candidates.find(row=>row.case.id===item.caseId).records.map(record=>({...record,caseId:item.caseId,sourcePath:topic.sourcePath,sourceFileSha256:topic.sourceSha256}));
  });
  assert.equal(saved.records.length,expected.length);
  for(const record of expected){
    const actual=saved.records.find(row=>row.caseId===record.caseId&&row.nodeId===record.node.id);
    assert(actual,record.node.id);assert.equal(actual.sourcePath,record.sourcePath);assert.equal(actual.sourceFileSha256,record.sourceFileSha256);
    assert.equal(hash(actual.sourceNodeJson),actual.sourceNodeSha256);assert.equal(hash(actual.sourceQuestionJson),actual.sourceQuestionSha256);
    assert.deepEqual(JSON.parse(actual.sourceNodeJson),record.node);assert.deepEqual(JSON.parse(actual.sourceQuestionJson),record.question);
    assert.equal(actual.runtimeNodeSha256,hash(JSON.stringify(record.node)));
  }
  console.log(JSON.stringify({exact:saved.exactFields,total:saved.total,objectKeyOrderNormalizations:saved.objectKeyOrderNormalizations}));
  process.exit(0);
}
const records=[];
for(const topic of before.topics){
  const module=await import('../../'+topic.sourcePath),objects=[],seen=new WeakSet();
  function visit(value){
    if(!value||typeof value!=='object'||seen.has(value))return;
    seen.add(value);if(Array.isArray(value))value.forEach(visit);
    else{objects.push(value);Object.values(value).forEach(visit);}
  }
  visit(module);
  assert.equal(hash(fs.readFileSync(topic.sourcePath)),topic.sourceSha256,'Source changed before raw freeze '+topic.sourcePath);
  for(const item of selection.selected.filter(row=>row.topic===topic.config.slug)){
    const captured=topic.candidates.find(row=>row.case.id===item.caseId);
    const sourceCase=objects.find(value=>value.id===item.caseId&&Array.isArray(value.decisionNodes)&&
      isDeepStrictEqual(syntheticClinicalCaseSchema.parse(value),captured.case));
    assert(sourceCase,'Exact reviewed case '+item.caseId);
    for(const record of captured.records){
      const node=sourceCase.decisionNodes.find(value=>value.id===record.node.id&&isDeepStrictEqual(value,record.node));
      const question=objects.find(value=>value.id===record.question.id&&isDeepStrictEqual(value,record.question));
      assert(node,'Exact current reviewed fields '+record.node.id);assert(question,'Exact current reviewed question '+record.question.id);
      const sourceNodeJson=JSON.stringify(node),sourceQuestionJson=JSON.stringify(question),parsedNodeJson=JSON.stringify(record.node);
      records.push({nodeId:node.id,questionVariantId:question.id,caseId:item.caseId,sourcePath:topic.sourcePath,sourceFileSha256:topic.sourceSha256,
        sourceNodeSha256:hash(sourceNodeJson),runtimeNodeSha256:hash(parsedNodeJson),sourceQuestionSha256:hash(sourceQuestionJson),
        exactFields:true,serializedObjectKeyOrderMatches:sourceNodeJson===parsedNodeJson,sourceNodeJson,sourceQuestionJson});
    }
  }
}
assert.equal(records.length,211);
const result={checkedOn:'2026-11-11',reviewDisplay:'Key shown first for review only where authored in that order. Runtime answer choices shuffle.',total:records.length,exactFields:records.length,
  objectKeyOrderNormalizations:records.filter(row=>!row.serializedObjectKeyOrderMatches).length,
  policy:'Original JSON serialization and SHA-256 are retained for every reviewed source node and question. Runtime schema parsing can reorder object keys; every value and field is unchanged. These key-order differences are not clinical edits.',records};
const path=outputPath,text=JSON.stringify(result,null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(hash(fs.readFileSync(path)),hash(text),'Source freeze stale');else fs.writeFileSync(path,text);
console.log(JSON.stringify({exact:result.exactFields,total:result.total,objectKeyOrderNormalizations:result.objectKeyOrderNormalizations}));
