import fs from 'node:fs';
import assert from 'node:assert/strict';
import {format} from '@vitest/pretty-format';
const root='tools/question-quality/',baseline=JSON.parse(fs.readFileSync(root+'fixtures/question-bank-batch2b-domain-fixtures-before-20261104.json','utf8')),proof=JSON.parse(fs.readFileSync(root+'question-bank-batch2b-fixture-control-20261104.json','utf8'));
for(const s of proof.scenarios)assert(s.runs.before.matchesFixture&&s.runs.before.matchesLengths,'The actual pre-2b bank must reproduce the old fixture: '+s.title);
const pattern=/\.toMatchInlineSnapshot\(`([\s\S]*?)`\)/g;
const clean=s=>{const lines=s.replaceAll('\r\n','\n').split('\n'),indent=Math.min(...lines.filter(l=>l.trim()).map(l=>l.match(/^\s*/)[0].length));return lines.map(l=>l.slice(Math.min(indent,l.match(/^\s*/)[0].length))).join('\n').trim();};
const reviews=[];
for(const[file,old]of Object.entries(baseline)){
 let next=old,allowed=[];
 const scenarios=proof.scenarios.filter(s=>s.file===file);
 if(scenarios.length){
  assert.equal([...old.matchAll(pattern)].length,scenarios.length,file);let i=0;
  next=next.replace(pattern,(_,text)=>{const s=scenarios[i++];assert.equal(clean(text),format(s.runs.before.value,{printBasicPrototype:false}));return '.toMatchInlineSnapshot(`\n'+format(s.runs.after.value,{printBasicPrototype:false})+'\n`)';});
  if(scenarios[0].runs.after.lengths.length){
   const a='expect(release.concepts).toHaveLength(462 + 39 + 6 + 6);',b='expect(release.concepts).toHaveLength(462 + 39 + 6 + 6 + 7);';
   assert.equal(next.split(a).length,2);next=next.replace(a,b);allowed.push([a,b]);
  }
 }
 const cohort=proof.cohorts.find(c=>c.file===file);
 if(cohort){
  for(const key of ['before','after']){
   const re=new RegExp('expect\\(pools\\.map\\(\\(item\\) => item\\.'+key+'\\)\\)\\.toEqual\\((\\[[^;]+\\])\\);');const m=next.match(re);assert(m,file+' '+key);
   const expected=JSON.parse(m[1].replace(/(cases|concepts):/g,'"$1":'));assert.deepEqual(expected,cohort.runs.before.pools.map(p=>p[key]));
   const replacement='expect(pools.map((item) => item.'+key+')).toEqual('+JSON.stringify(cohort.runs.after.pools.map(p=>p[key]))+');';next=next.replace(m[0],replacement);allowed.push([m[0],replacement]);
  }
  if(cohort.runs.before.choices!==cohort.runs.after.choices){
   const a='expect([...coverage.values()].reduce((total, ids) => total + ids.size, 0)).toBe('+cohort.runs.before.choices+');';
   const b='// Batch 2b: two revised four-choice nodes now have three credible choices.\n    expect([...coverage.values()].reduce((total, ids) => total + ids.size, 0)).toBe('+cohort.runs.after.choices+');';
   assert.equal(next.split(a).length,2);next=next.replace(a,b);allowed.push([a,b]);
  }
 }
 if(next===old)continue;
 const count=s=>(s.match(/\bexpect\(/g)||[]).length;assert.equal(count(next),count(old));
 assert.deepEqual([...next.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]),[...old.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]));
 let reversed=next;for(const[a,b]of allowed)reversed=reversed.replace(b,a);
 assert.equal(reversed.replace(pattern,'.toMatchInlineSnapshot(SNAPSHOT)'),old.replace(pattern,'.toMatchInlineSnapshot(SNAPSHOT)'),'No commands, assertions or logic may change');
 if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8'),next);else if(fs.readFileSync(file,'utf8')!==next){assert.equal(fs.readFileSync(file,'utf8'),old,'Concurrent fixture changed: '+file);fs.writeFileSync(file,next);}
 reviews.push({file,assertionCallSitesBefore:count(old),assertionCallSitesAfter:count(next),commandsAndDeadlinesUnchanged:true,onlyDocumentedExpectationsChanged:true,replacements:allowed});
}
fs.writeFileSync(root+'question-bank-batch2b-fixture-review-20261104.json',JSON.stringify({checkedAt:new Date().toISOString(),control:'question-bank-batch2b-fixture-control-20261104.json',reviews,justification:'Same current domain and same N1/N2 definitions before/after only the batch-2b projection. Original snapshots reproduce exactly before. Seven new histories and changed active construct coverage alter the seeded unseen mix; two four-choice nodes now have three options. No routing, save, evidence, deadline or assertion changes.',limitation:'Control is diagnostic, not a Vitest pass. Final fixtures must pass actual tests at original deadlines. F13 was subsequently left unchanged; its keyed timing/concept/choice count is unchanged across the attempted and deferred draft, so the structural supply delta is the same; final actual tests verify it.'},null,2)+'\n');
console.log(JSON.stringify(reviews.map(r=>({file:r.file,assertions:r.assertionCallSitesAfter}))));
