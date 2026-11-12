import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const hash = value => createHash('sha256').update(value).digest('hex');
const before = read('tools/question-quality/fixtures/question-topic-acceptance-batch6-before-20261112.json');
const selection = read('tools/question-quality/fixtures/question-topic-acceptance-batch6-selection-20261112.json');
const path = 'docs/research/question-topic-acceptance-batch6-source-freeze-20261112.json';
const records = selection.selected.flatMap(item => {
  const topic = before.topics.find(topic => topic.config.slug === item.topic);
  const candidate = topic.candidates.find(candidate => candidate.case.id === item.caseId);
  return candidate.records.map(record => {
    assert.deepEqual(JSON.parse(record.sourceNodeJson), record.node);
    assert.deepEqual(JSON.parse(record.sourceQuestionJson), record.question);
    const parsed = JSON.stringify(record.node);
    return {
      caseId: item.caseId, nodeId: record.node.id, questionVariantId: record.question.id,
      sourcePath: topic.sourcePath, sourceFileSha256: topic.sourceSha256,
      reviewPath: record.evidence.path,
      sourceNodeSha256: hash(record.sourceNodeJson), runtimeNodeSha256: hash(parsed),
      sourceQuestionSha256: hash(record.sourceQuestionJson),
      serializedObjectKeyOrderMatches: parsed === record.sourceNodeJson,
      sourceNodeJson: record.sourceNodeJson, sourceQuestionJson: record.sourceQuestionJson,
    };
  });
});
const freeze = {
  checkedOn: '2026-11-11', total: records.length, exactFields: records.length,
  objectKeyOrderNormalizations: records.filter(record => !record.serializedObjectKeyOrderMatches).length,
  policy: 'Reviewed serializations precede the separately recorded name-only corrections in accepted copies.',
  records,
};
const text = JSON.stringify(freeze, null, 2) + '\n';
if (fs.existsSync(path)) {
  if(process.argv.includes('--timing-recheck')){
    const initial=read('tools/question-quality/fixtures/question-topic-acceptance-batch6-initial-preflight-20261112.json');
    assert.equal(hash(fs.readFileSync(path)),initial.records.sourceFreeze.sha256,'Preserved first source freeze');
    for(const record of records)assert.deepEqual(initial.records.sourceFreeze.value.records.find(row=>row.nodeId===record.nodeId),record);
    fs.writeFileSync(path,text);
  }else{
    assert(process.argv.includes('--check'), 'Reviewed source archive already exists.');
    assert.equal(fs.readFileSync(path, 'utf8'), text, 'Reviewed source archive drift');
  }
} else fs.writeFileSync(path, text);
console.log(JSON.stringify({exact: records.length, objectKeyOrderNormalizations: freeze.objectKeyOrderNormalizations}));
