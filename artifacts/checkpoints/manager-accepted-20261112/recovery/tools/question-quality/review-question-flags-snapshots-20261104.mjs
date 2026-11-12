import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
const entry=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags-integration-tests-before-20261104.json','utf8'));
const candidate=JSON.parse(fs.readFileSync('tools/question-quality/question-flags-supply-candidate-20261104.json','utf8'));
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const normalized=s=>s.replaceAll('\r\n','\n').replace(/\.toMatchInlineSnapshot\(`[\s\S]*?`\)/g,'.toMatchInlineSnapshot(SNAPSHOT)').replace(/^\s*\/\/.*$/gm,'').replace(/\s+/g,'');
const results=[];
for(const file of ['packages/game-domain/tests/patient-supply.test.ts','packages/game-domain/tests/diagnostics/patient-supply.test.ts']){
 const before=entry.files[file].text,current=fs.readFileSync(file,'utf8');
 const expected=before.replace('expect(release.concepts).toHaveLength(396);','expect(release.concepts).toHaveLength(398);');
 assert.equal(normalized(current),normalized(expected),file+' changed outside snapshots and the explicit catalog count');
 const snapshots=[...current.matchAll(/\.toMatchInlineSnapshot\(`([\s\S]*?)`\)/g)].map(m=>JSON.parse(m[1].replace(/,\s*([}\]])/g,'$1')));
 const scenarios=candidate.results.filter(r=>r.file===file);
 assert.equal(snapshots.length,scenarios.length);
 snapshots.forEach((value,i)=>assert.deepEqual(value,scenarios[i].runs.current.value));
 results.push({file,sourceBefore:hash(before),sourceAfter:hash(current),snapshotCount:snapshots.length,
  nonSnapshotAssertionsUnchanged:true,onlyOtherChange:file.endsWith('/tests/patient-supply.test.ts')?'catalog count 396 → 398; explanatory comment':'none',
  scenarios:scenarios.map(r=>({title:r.title,entrySnapshotOnEntryRelease:r.entrySnapshotOnEntryRelease,old:r.runs.entry.value,current:r.runs.current.value,entryTrace:r.runs.entry.trace,currentTrace:r.runs.current.trace}))});
}
fs.writeFileSync('tools/question-quality/question-flags-snapshot-change-review-20261104.json',JSON.stringify({checkedOn:'2026-11-04',status:'reviewed',scope:'Three expected snapshots only, plus the explicit two-concept catalog increment. All commands, deadlines and non-snapshot functional assertions are unchanged. Exact entry/current callback controls isolate the clinical-data change under the same domain code.',results},null,2)+'\n');
console.log(JSON.stringify({files:results.length,snapshots:results.reduce((n,r)=>n+r.snapshotCount,0),allOtherFunctionalAssertionsPreserved:true}));
