import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import {format} from '@vitest/pretty-format';
const entry=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-bank-batch2a-tests-before-20261104.json','utf8'));
const candidate=JSON.parse(fs.readFileSync('tools/question-quality/question-bank-batch2a-supply-candidate-20261104.json','utf8'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const normalized=s=>s.replaceAll('\r\n','\n').replace(/\.toMatchInlineSnapshot\(`[\s\S]*?`\)/g,'.toMatchInlineSnapshot(SNAPSHOT)').replace(/^\s*\/\/.*$/gm,'').replace(/\s+/g,'');
const results=[];
for(const file of Object.keys(entry.files)){
 const before=entry.files[file].text,expected=before.replace('expect(release.concepts).toHaveLength(412);','expect(release.concepts).toHaveLength(414);');
 let current=fs.readFileSync(file,'utf8');assert.equal(normalized(current),normalized(expected),file+' changed outside snapshots, catalog count or comments');
 const scenarios=candidate.results.filter(r=>r.file===file);let index=0;
 if(process.argv.includes('--apply')){
  current=current.replace(/\.toMatchInlineSnapshot\(`[\s\S]*?`\)/g,()=>{
   const value=scenarios[index++]?.runs.current.value;assert(value,'missing exact candidate');
   const printed=format(value,{printBasicPrototype:false,escapeString:false});
   return '.toMatchInlineSnapshot(`\n'+printed.split('\n').map(l=>'      '+l).join('\n')+'\n    `)';
  });
  assert.equal(index,scenarios.length);fs.writeFileSync(file,current);
 }
 const snapshots=[...current.matchAll(/\.toMatchInlineSnapshot\(`([\s\S]*?)`\)/g)].map(m=>JSON.parse(m[1].replace(/,\s*([}\]])/g,'$1')));
 assert.equal(snapshots.length,scenarios.length);snapshots.forEach((value,i)=>assert.deepEqual(value,scenarios[i].runs.current.value));
 results.push({file,sourceBefore:hash(before),sourceAfter:hash(current),snapshotCount:snapshots.length,nonSnapshotAssertionsUnchanged:true,
  onlyOtherChange:file.endsWith('/tests/patient-supply.test.ts')?'catalog count 412 to 414 and explanatory comment':'none',
  rationale:'Same domain code with exact entry/current clinical releases. Two new scored constructs and the intentional MRI-to-US workup change alter deterministic availability/selection and journey schedules; neither selector nor routing is changed. Actual admission, answer, gate and completion assertions remain enforced.',
  scenarios:scenarios.map(r=>({title:r.title,entrySnapshotOnEntryRelease:r.entrySnapshotOnEntryRelease,old:r.runs.entry.value,current:r.runs.current.value,entryTrace:r.runs.entry.trace,currentTrace:r.runs.current.trace}))});
}
fs.writeFileSync('tools/question-quality/question-bank-batch2a-snapshot-change-review-20261104.json',JSON.stringify({checkedOn:'2026-11-04',status:'reviewed',scope:'Three expected snapshot values plus exact two-concept catalog increment; every other functional assertion/command/deadline retained. Day six now selects the one-node adrenal DST case instead of the two-node interpreter/consent case; both actually complete. No snapshot is a performance benchmark or player analytics.',results},null,2)+'\n');
console.log(JSON.stringify({files:results.length,snapshots:results.reduce((n,r)=>n+r.snapshotCount,0),allOtherFunctionalAssertionsPreserved:true}));
