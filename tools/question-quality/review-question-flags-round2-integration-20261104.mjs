import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const entry=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags-round2-integration-tests-before-20261104.json','utf8'));
const rows=Object.entries(entry.files).map(([path,old])=>{
 const current=fs.readFileSync(path,'utf8');
 const assertions=t=>[...t.matchAll(/expect\([\s\S]*?\.(?:to\w+|not\.to\w+)\([^;]*;/g)].map(m=>m[0]);
 const deadlines=t=>[...t.matchAll(/\b(?:timeout|testTimeout)\b[^\r\n]*/g)].map(m=>m[0]);
 assert.deepEqual(assertions(current),assertions(old.text),path+' assertion changed');
 assert.deepEqual(deadlines(current),deadlines(old.text),path+' deadline changed');
 return {path,before:old.sha256,after:crypto.createHash('sha256').update(current).digest('hex'),originalAssertionCount:assertions(current).length,allOriginalAssertionsExact:true,allDeadlinesExact:true};
});
const output={checkedOn:'2026-11-04',
 scope:'Historical September-28 context uses full case/node/variant tuples instead of a stable-case prefix. The three original terminal-service lifecycles remain. All three new external-study tuples are checked by the new exact-binding suite. Statistics/ethics admission uses the current stable-case mapping so final FSRS checks target the actually scored concept. No production change.',rows};
fs.writeFileSync('tools/question-quality/question-flags-round2-integration-fixture-review-20261104.json',JSON.stringify(output,null,2)+'\n');
console.log(JSON.stringify({files:rows.length,assertions:rows.reduce((n,r)=>n+r.originalAssertionCount,0),allOriginalAssertionsAndDeadlinesExact:true}));
