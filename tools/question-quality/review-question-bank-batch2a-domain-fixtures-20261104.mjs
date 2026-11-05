import fs from 'node:fs';
import assert from 'node:assert/strict';
const path='tools/question-quality/fixtures/question-bank-batch2a-domain-fixtures-before-20261104.json',before=JSON.parse(fs.readFileSync(path,'utf8'));
const normalized=s=>s.replaceAll('\r\n','\n').replace(/^\s*\/\/.*$/gm,'').replace(/\s+/g,'');
const changes={
 'packages/game-domain/tests/gs028-20261007-batch.test.ts':[['{ cases: 718, concepts: 257 }','{ cases: 718, concepts: 258 }'],['{ cases: 754, concepts: 274 }','{ cases: 754, concepts: 275 }'],['{ cases: 796, concepts: 280 }','{ cases: 796, concepts: 281 }'],['{ cases: 832, concepts: 297 }','{ cases: 832, concepts: 298 }']],
 'packages/game-domain/tests/gs028-20261007-variety2-batch.test.ts':[['{ cases: 796, concepts: 280 }','{ cases: 796, concepts: 281 }'],['{ cases: 832, concepts: 297 }','{ cases: 832, concepts: 298 }'],['{ cases: 874, concepts: 301 }','{ cases: 874, concepts: 302 }'],['{ cases: 910, concepts: 318 }','{ cases: 910, concepts: 319 }']],
 'packages/game-domain/tests/surgery-center-batch.test.ts':[['    expect(reviewed).toEqual(expected);','    expected.add("concept.achalasia.physiology-directed-treatment.v1");\n    expected.add("concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5");\n    expect(reviewed).toEqual(expected);']],
};
const results=[];
for(const[file,entry]of Object.entries(before.files)){
 let expected=entry.text;for(const[a,b]of changes[file]){assert.equal(expected.split(a).length,2,file+' unique literal');expected=expected.replace(a,b);}
 const current=fs.readFileSync(file,'utf8');assert.equal(normalized(current),normalized(expected),file+' changes outside explicit expected values/comments');
 const assertions=(entry.text.match(/\bexpect\(/g)||[]).length;assert.equal((current.match(/\bexpect\(/g)||[]).length,assertions);
 assert.deepEqual([...current.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]),[...entry.text.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]));
 results.push({file,assertionCallSites:assertions,commandsAndDeadlinesUnchanged:true,explicitExpectedChanges:changes[file],reason:file.includes('surgery-center')?'Both new scored constructs are witnessed by real answers in the same forty-case/32-gate cohort, while earlier objectives remain in other cases.':'The two new outside-cohort construct versions change one eligible active-concept count at these facility/capability configurations. Before/after case counts and cohort deltas remain exact.'});
}
fs.writeFileSync('tools/question-quality/question-bank-batch2a-domain-fixture-review-20261104.json',JSON.stringify({checkedOn:'2026-11-04',scope:'Three fixture repairs only; no runtime, selector, routing, save or Level 4/5 test/evidence change.',results},null,2)+'\n');
console.log(JSON.stringify({files:results.length,assertionCallSites:results.reduce((n,r)=>n+r.assertionCallSites,0),allCommandsAndDeadlinesUnchanged:true}));
