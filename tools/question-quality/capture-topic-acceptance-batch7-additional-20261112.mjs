import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch7-before-20261112.json','utf8'));
const path='tools/question-quality/fixtures/question-topic-acceptance-batch7-additional-before-20261112.json';
const value=fs.existsSync(path)?JSON.parse(fs.readFileSync(path,'utf8')):{checkedOn:'2026-11-12',files:[]};
const hash=b=>createHash('sha256').update(b).digest('hex');
for(const p of process.argv.slice(2)){
  assert(!/question-topic-|question-owner-decisions-|balance-config|progression/.test(p),'Not in acceptance edit lane '+p);
  if(before.sourcePreimages.some(r=>r.path===p)||value.files.some(r=>r.path===p))continue;
  const text=fs.readFileSync(p,'utf8');assert.equal(hash(text),before.observed[p],'Unmodified intake preimage '+p);
  value.files.push({path:p,beforeSha256:hash(text),beforeText:text});
}
fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');
console.log(JSON.stringify({additionalPreimages:value.files.length}));
