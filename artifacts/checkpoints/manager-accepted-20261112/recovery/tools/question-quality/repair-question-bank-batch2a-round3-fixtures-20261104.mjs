import fs from 'node:fs';
import assert from 'node:assert/strict';
import {isDeepStrictEqual as equal} from 'node:util';
import {format} from '@vitest/pretty-format';
const root='tools/question-quality/',baseline=JSON.parse(fs.readFileSync(root+'fixtures/question-bank-batch2a-round3-domain-fixtures-before-20261104.json','utf8'));
const proof=JSON.parse(fs.readFileSync(root+'question-bank-batch2a-round3-fixture-control-20261104.json','utf8'));
const pattern=/\.toMatchInlineSnapshot\(`([\s\S]*?)`\)/g;
// Carry only this round's measured delta into an expected value. An already
// stale, unrelated N2 expectation stays visibly stale; it is not blessed here.
function delta(expected,before,after){
 if(equal(before,after))return expected;
 if(typeof before==='number'&&typeof after==='number'){assert.equal(typeof expected,'number');return expected+after-before;}
 if(Array.isArray(before)&&Array.isArray(after)){
  if([...before,...after].every(x=>typeof x==='string')){
   const removed=before.filter(x=>!after.includes(x)),added=after.filter(x=>!before.includes(x));
   assert(removed.every(x=>expected.includes(x)));return [...expected.filter(x=>!removed.includes(x)),...added].sort();
  }
  if(equal(expected,before))return after;
  assert.equal(expected.length,before.length);assert.equal(before.length,after.length);return expected.map((x,i)=>delta(x,before[i],after[i]));
 }
 if(before&&after&&typeof before==='object'&&typeof after==='object'){
  assert.deepEqual(Object.keys(before).sort(),Object.keys(after).sort());
  return Object.fromEntries(Object.keys(expected).map(k=>[k,delta(expected[k],before[k],after[k])]));
 }
 assert(equal(expected,before));return after;
}
const reviews=[];
for(const[file,old]of Object.entries(baseline)){
 let next=old,allowed=[];const scenarios=proof.scenarios.filter(s=>s.file===file);
 if(scenarios.length){
  assert.equal([...old.matchAll(pattern)].length,scenarios.length);let index=0;
  next=next.replace(pattern,(_,text)=>{
   const s=scenarios[index++],expected=JSON.parse(text.replace(/,\s*([}\]])/g,'$1'));
   assert.deepEqual(expected,s.runs.before.expectedSnapshot);
   const corrected=delta(expected,s.runs.before.value,s.runs.after.value);
   return '.toMatchInlineSnapshot(`\n'+format(corrected,{printBasicPrototype:false})+'\n`)';
  });
  if(scenarios[0].runs.after.lengths.length){
   assert(scenarios[0].runs.before.matchesLengths);const a='expect(release.concepts).toHaveLength(462 + 39 + 6 + 6 + 7 + 21);',b='expect(release.concepts).toHaveLength(462 + 39 + 6 + 6 + 7 + 21 + 5);';
   assert.equal(next.split(a).length,2);next=next.replace(a,b);allowed.push([a,b]);
  }
 }
 const cohort=proof.cohorts.find(c=>c.file===file);
 if(cohort)for(const key of ['before','after']){
  const re=new RegExp('expect\\(pools\\.map\\(\\(item\\) => item\\.'+key+'\\)\\)\\.toEqual\\((\\[[^;]+\\])\\);'),m=next.match(re);assert(m);
  const value=JSON.parse(m[1].replace(/(cases|concepts):/g,'"$1":'));assert.deepEqual(value,cohort.runs.before.pools.map(p=>p[key]));
  const b='expect(pools.map((item) => item.'+key+')).toEqual('+JSON.stringify(cohort.runs.after.pools.map(p=>p[key]))+');';next=next.replace(m[0],b);allowed.push([m[0],b]);
 }
 if(file.endsWith('/surgery-center-batch.test.ts')){
  const marker='    expect(reviewed).toEqual(expected);';assert.equal(next.split(marker).length,2);
  const removed=proof.surgeryCenter.before.filter(x=>!proof.surgeryCenter.after.includes(x)),added=proof.surgeryCenter.after.filter(x=>!proof.surgeryCenter.before.includes(x));
  const block='    // Round three: actual cohort coverage follows four revised scored\n    // objectives. Old definitions and their existing histories stay retained.\n'+removed.map(x=>'    expected.delete('+JSON.stringify(x)+');\n').join('')+added.map(x=>'    expected.add('+JSON.stringify(x)+');\n').join('');
  next=next.replace(marker,block+marker);allowed.push([marker,block+marker]);
 }
 if(next===old)continue;
 const count=s=>(s.match(/\bexpect\(/g)||[]).length;assert.equal(count(next),count(old));
 assert.deepEqual([...next.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]),[...old.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]));
 let reversed=next;for(const[a,b]of allowed)reversed=reversed.replace(b,a);
 assert.equal(reversed.replace(pattern,'SNAPSHOT'),old.replace(pattern,'SNAPSHOT'));
 if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8'),next);
 else{assert.equal(fs.readFileSync(file,'utf8'),old,'Concurrent fixture edit: '+file);fs.writeFileSync(file,next);}
 reviews.push({file,assertionCallSitesBefore:count(old),assertionCallSitesAfter:count(next),deadlinesAndFunctionalAssertionsUnchanged:true,onlyMeasuredOwnDelta:true,replacements:allowed});
}
fs.writeFileSync(root+'question-bank-batch2a-round3-fixture-review-20261104.json',JSON.stringify({checkedAt:new Date().toISOString(),reviews,justification:'Same current domain, N1/N2 and batch-2b on both sides; reverse only seven own nodes and remove five own concepts for the control. Active early-pool concepts increase by two, cases and nodes stay equal. Seeded patient selection and actual revised objective coverage change. One inventory snapshot already differs because it does not exclude the independent N2 round-two IDs; that external mismatch is deliberately retained, not hidden by a full refresh.',scope:'Expected values only; original commands, assertion counts, timings, routing, save formats and evidence remain.'},null,2)+'\n');
console.log(JSON.stringify(reviews.map(x=>({file:x.file,assertions:x.assertionCallSitesAfter}))));
