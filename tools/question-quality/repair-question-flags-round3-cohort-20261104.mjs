import fs from 'node:fs';
import assert from 'node:assert/strict';
const normalize=s=>s.replaceAll('\r\n','\n').replace(/^\s*\/\/.*$/gm,'').replace(/\s+/g,'');
const results=[];
for(const first of [true,false]){
 const fixture=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags-round3-cohort-'+(first?'first-':'')+'before-20261104.json','utf8'));
 const control=JSON.parse(fs.readFileSync('tools/question-quality/question-flags-round3-cohort-'+(first?'first-':'')+'control-20261104.json','utf8'));
 assert(control.originalExpectationsReproduced);
 let next=fixture.text;const swaps=[];
 function swap(a,b){if(a===b)return;assert.equal(next.split(a).length,2,fixture.file+' unique repair '+a);next=next.replace(a,b);swaps.push([a,b]);}
 for(const key of ['before','after']){
  const match=next.match(new RegExp('expect\\(pools\\.map\\(\\(item\\) => item\\.'+key+'\\)\\)\\.toEqual\\((\\[[^;]+\\])\\);'));assert(match,key);
  const values=control.runs.current.pools.map(p=>p[key]);
  const literal='['+values.map(v=>`{ cases: ${v.cases}, concepts: ${v.concepts} }`).join(', ')+']';swap(match[1],literal);
 }
 if(first){
  assert.equal(control.runs.entryWithSameN1.bindings.length,11);assert.equal(control.runs.current.bindings.length,10);
  assert.equal(control.runs.entryWithSameN1.choices,317);assert.equal(control.runs.current.choices,318);
  assert.equal(control.runs.current.bindings.filter(r=>r.isCorrect).length,3);
  assert.equal(control.runs.current.bindings.filter(r=>r.isCorrect&&r.disposition.kind!=='not_executed').length,2);
  swap('binds two executable gates, one planned correct study and eight non-executed distractors','binds two executable gates, one planned correct procedure and seven non-executed distractors');
  swap('expect(exact).toHaveLength(11);','expect(exact).toHaveLength(10);');
  swap('expect(record.questionVariantId).toBe("question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3");','expect(record.questionVariantId).toBe("question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4");');
  swap('expect(record.timingProfileId).toBe("timing.test.hepatobiliary_contrast_mrcp");','expect(record.timingProfileId).toBe("timing.test.ercp");');
  swap('toEqual({ correctCount: 3, wrongCount: 8, executableCount: 2, plannedCount: 1 });','toEqual({ correctCount: 3, wrongCount: 7, executableCount: 2, plannedCount: 1 });');
  swap('expect([...coverage.values()].reduce((total, ids) => total + ids.size, 0)).toBe(317);','expect([...coverage.values()].reduce((total, ids) => total + ids.size, 0)).toBe(318);');
 }
 const beforeAssertions=(fixture.text.match(/\bexpect\(/g)||[]).length,afterAssertions=(next.match(/\bexpect\(/g)||[]).length;assert.equal(beforeAssertions,afterAssertions);
 const deadlines=s=>[...s.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]);assert.deepEqual(deadlines(next),deadlines(fixture.text));
 const current=fs.readFileSync(fixture.file,'utf8');
 if(process.argv.includes('--check'))assert.equal(normalize(current),normalize(next),'Only documented expectations/title may change');
 else{
  assert.equal(current,fixture.text,'Concurrent fixture edit: preserve it and inspect');
  const note='    // Flag round three versions F06\'s archived-test objective while its old\n    // mechanism remains in siblings: one more active concept, no new case.\n';
  const marker='    expect(pools.map((item) => item.before))';const i=next.indexOf(marker);assert(i>0);next=next.slice(0,i)+note+next.slice(i);
  if(first)next=next.replace('    // F02 loses one option; the complete F09/F15 matrices each add one (+1 net).','    // Final flag round: F06 adds one offered choice; F02 replaces an imaging\n    // distractor with a non-testing operation, retaining its outside ERCP key.');
  fs.writeFileSync(fixture.file,next);
 }
 results.push({file:fixture.file,assertionCallSites:beforeAssertions,commandsAndDeadlinesUnchanged:true,explicitSwaps:swaps,
  reason:first?'F02 now plans ERCP rather than MRCP, with two timed procedure choices instead of three imaging choices; F06 adds a fourth offered choice and an active archived-test construct. No executable gate/route change.':'F06 changes one outside-cohort active construct on both sides. Exact 78-case / 21-concept cohort delta remains unchanged.'});
}
fs.writeFileSync('tools/question-quality/question-flags-round3-cohort-fixture-review-20261104.json',JSON.stringify({checkedOn:'2026-11-04',scope:'Two strictly necessary content-expectation repairs. No runtime, selector, routing, save, evidence or Level 4/5 test edits.',results},null,2)+'\n');
console.log(JSON.stringify({files:results.length,assertionCallSites:results.reduce((n,r)=>n+r.assertionCallSites,0),allCommandsAndDeadlinesUnchanged:true}));
