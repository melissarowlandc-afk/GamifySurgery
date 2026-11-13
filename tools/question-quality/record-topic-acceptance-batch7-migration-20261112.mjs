import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch7-before-20261112.json');
const extraPath='tools/question-quality/fixtures/question-topic-acceptance-batch7-additional-before-20261112.json';
const extra=fs.existsSync(extraPath)?read(extraPath).files:[];
const hash=b=>createHash('sha256').update(b).digest('hex');
const files=[...before.sourcePreimages,...extra].map(row=>{
  assert.equal(hash(row.beforeText),row.beforeSha256,row.path+' preimage');
  return {...row,afterSha256:hash(fs.readFileSync(row.path))};
}).filter(row=>row.beforeSha256!==row.afterSha256);
const path='tools/question-quality/fixtures/question-topic-acceptance-batch7-source-migration-20261112.json';
const text=JSON.stringify({checkedOn:'2026-11-12',reason:'Exact manager-authorized batch7 integration and historical membership/source-pin adaptations. No captured preimage is modified.',files},null,2)+'\n';
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(path,'utf8'),text,'Source migration drift');else fs.writeFileSync(path,text);
console.log(JSON.stringify({migratedSourceFiles:files.length}));
