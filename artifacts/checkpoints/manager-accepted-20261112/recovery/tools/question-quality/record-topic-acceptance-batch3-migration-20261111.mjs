import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch3-before-20261111.json');
const extra=['additional','narrative','domain','domain-suites','flags2-guard'].flatMap(label=>{
  const path='tools/question-quality/fixtures/question-topic-acceptance-batch3-'+label+'-before-20261111.json';
  return fs.existsSync(path)?read(path).files:[];
});
const hash=value=>createHash('sha256').update(value).digest('hex');
const files=[...before.sourcePreimages,...extra].map(row=>({...row,afterSha256:hash(fs.readFileSync(row.path))})).filter(row=>row.afterSha256!==row.beforeSha256);
for(const row of files)assert.equal(hash(row.beforeText),row.beforeSha256);
fs.writeFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch3-source-migration-20261111.json',JSON.stringify({checkedOn:'2026-11-11',files},null,2)+'\n');
console.log(JSON.stringify({existingFiles:files.length}));
