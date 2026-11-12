import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=path=>JSON.parse(fs.readFileSync(path,'utf8'));
const hash=value=>createHash('sha256').update(value).digest('hex');
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch3-before-20261111.json');
const migration=read('tools/question-quality/fixtures/question-topic-acceptance-batch3-source-migration-20261111.json');
const packet=read('docs/research/question-topic-acceptance-batch3-packet-20261111.json');
const newFiles=[
  ...['accepted-data','accepted','acceptance-test-support'].map(name=>'packages/clinical-content/src/question-program-batch3-'+name+'-20261111.ts')
    .filter(path=>!path.includes('test-support-20261111')),
  'packages/clinical-content/src/question-program-batch3-acceptance-test-support.ts',
  'packages/clinical-content/src/question-program-batch3-acceptance-20261111.test.ts',
  'apps/player/src/questionProgramBatch3SaveCompatibility.test.ts','apps/player/src/questionProgramBatch3StatisticsAdmission.test.ts',
  ...['topic-acceptance-batch3-config','capture-topic-acceptance-batch3','prepare-topic-acceptance-batch3','build-topic-acceptance-batch3',
    'integrate-topic-acceptance-batch3','record-topic-acceptance-batch3-migration','review-topic-acceptance-batch3','freeze-topic-acceptance-batch3-source',
    'handoff-topic-acceptance-batch3','record-topic-acceptance-batch3-files'].map(name=>'tools/question-quality/'+name+'-20261111.mjs'),
  ...['before','selection','additional-before','narrative-before','domain-before','domain-suites-before','flags2-guard-before','source-migration']
    .map(name=>'tools/question-quality/fixtures/question-topic-acceptance-batch3-'+name+'-20261111.json'),
  'docs/execplans/question-topic-acceptance-batch3-20261111.md',
  ...['','-packet','-dispositions','-lint','-source-freeze','-validation'].map(name=>'docs/research/question-topic-acceptance-batch3'+name+'-20261111.'+(name?'json':'md')),
];
assert.equal(new Set(newFiles).size,newFiles.length);
const files=[...migration.files.map(({beforeText,...row})=>({...row,kind:'existing'})),...newFiles.map(path=>({path,kind:'new',afterSha256:hash(fs.readFileSync(path))}))];
for(const row of files)assert.equal(hash(fs.readFileSync(row.path)),row.afterSha256,row.path+' source drift');
const shared=fs.readFileSync(before.sharedHandoff.path);
assert.equal(hash(shared.subarray(0,before.sharedHandoff.bytes)),before.sharedHandoff.sha256,'Shared handoff prefix changed');
const owned=new Set(files.map(row=>row.path));
const concurrentChanges=Object.entries(before.observed).filter(([path,sha])=>!owned.has(path)&&fs.existsSync(path)&&hash(fs.readFileSync(path))!==sha)
  .map(([path,beforeSha256])=>({path,beforeSha256,currentSha256:hash(fs.readFileSync(path))}));
const newConcurrentFiles=[];
for(const root of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','apps/player/src/session']){
  const visit=path=>{for(const item of fs.readdirSync(path,{withFileTypes:true})){const child=path+'/'+item.name;if(item.isDirectory())visit(child);else if(/\.tsx?$/.test(item.name)&&!before.observed[child]&&!owned.has(child))newConcurrentFiles.push(child);}};visit(root);
}
const protectedInputs=packet.protectedInputs.map(row=>({...row,currentSha256:hash(fs.readFileSync(row.path)),unchanged:hash(fs.readFileSync(row.path))===row.beforeSha256}));
const receipt={checkedOn:'2026-11-11',existingFiles:migration.files.length,newHashedFiles:newFiles.length,files,
  receiptSelf:{path:'docs/research/question-topic-acceptance-batch3-files-20261111.json',hashOmittedToAvoidSelfReference:true},
  sharedHandoff:{...before.sharedHandoff,currentBytes:shared.length,currentSha256:hash(shared),originalPrefixPreserved:true,appendOnly:true},
  sourceFreeze:packet.sourceByteFreeze,protectedInputs,concurrentChanges,newConcurrentFiles,
  constraints:{gitCommands:0,installs:0,networkCalls:0,agents:0,deploys:0,rebinds:0,topicSourceEdits:0,balanceEdits:0,domainRuntimeEdits:0,sessionCloudEdits:0},
};
fs.writeFileSync(receipt.receiptSelf.path,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({existing:receipt.existingFiles,newHashed:receipt.newHashedFiles,hashedFiles:files.length,
  sharedPrefixPreserved:true,protectedInputDrift:protectedInputs.filter(row=>!row.unchanged).map(row=>row.path),concurrentChanges:concurrentChanges.map(row=>row.path),newConcurrentFiles}));
