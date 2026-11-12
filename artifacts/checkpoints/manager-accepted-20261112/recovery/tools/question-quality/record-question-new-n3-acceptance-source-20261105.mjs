import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const capture=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-new-n3-acceptance-before-20261105.json','utf8'));
const supplemental=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-new-n3-acceptance-supplemental-before-20261105.json','utf8'));
const sha=x=>createHash('sha256').update(x).digest('hex');
const files=[];
for(const[path,beforeSha256]of Object.entries({...capture.files,...supplemental.files})){
 const beforeText=fs.readFileSync('.local-dev/question-new-n3-acceptance-20261105/'+path.replaceAll('/','__'),'utf8');
 assert.equal(sha(beforeText),beforeSha256,'Archived intake drift');
 const afterSha256=sha(fs.readFileSync(path));if(beforeSha256===afterSha256)continue;
 files.push({path,beforeSha256,afterSha256,beforeText});
}
const record={checkedOn:'2026-11-05',scope:'Exact N3 five-version acceptance integration; original earlier captures and source-migration receipts remain immutable. Current source bytes are pinned before historical-epoch checking.',files};
const path='tools/question-quality/fixtures/question-new-n3-acceptance-source-migration-20261105.json';
if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),record);else fs.writeFileSync(path,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({sourceMigrations:files.map(f=>f.path)},null,2));
