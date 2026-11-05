import fs from 'node:fs';
import assert from 'node:assert/strict';
import {format} from '@vitest/pretty-format';
const root='tools/question-quality/',baseline=JSON.parse(fs.readFileSync(root+'fixtures/question-bank-batch2a-round2-domain-fixtures-before-20261104.json','utf8')),proof=JSON.parse(fs.readFileSync(root+'question-bank-batch2a-round2-fixture-control-20261104.json','utf8'));
for(const s of proof.scenarios)assert(s.runs.before.matchesFixture&&s.runs.before.matchesLengths,'Current domain and prior clinical bank must reproduce the old fixture: '+s.title);
const pattern=/\.toMatchInlineSnapshot\(`([\s\S]*?)`\)/g;
const clean=s=>{const lines=s.replaceAll('\r\n','\n').split('\n'),nonempty=lines.filter(l=>l.trim()),indent=Math.min(...nonempty.map(l=>l.match(/^\s*/)[0].length));return lines.map(l=>l.slice(Math.min(indent,l.match(/^\s*/)[0].length))).join('\n').trim();};
const reviews=[];
for(const[file,old]of Object.entries(baseline)){
 let next=old,allowed=[],assertionsAdded=0;
 const sc=proof.scenarios.filter(s=>s.file===file);
 if(sc.length){
  const matches=[...old.matchAll(pattern)];assert.equal(matches.length,sc.length,file);let i=0;
  next=next.replace(pattern,(_,text)=>{const s=sc[i++];assert.equal(clean(text),format(s.runs.before.value,{printBasicPrototype:false}),'Exact serializer before '+s.title);return '.toMatchInlineSnapshot(`\n'+format(s.runs.after.value,{printBasicPrototype:false})+'\n`)';});
  if(sc[0].runs.after.lengths.length){const a='expect(release.concepts).toHaveLength(462 + 39);',b='expect(release.concepts).toHaveLength(462 + 39 + 6);';assert.equal(next.split(a).length,2);next=next.replace(a,b);allowed.push([a,b]);}
 }
 const cohort=proof.cohorts.find(c=>c.file===file);
 if(cohort)for(const key of ['before','after']){
  const re=new RegExp('expect\\(pools\\.map\\(\\(item\\) => item\\.'+key+'\\)\\)\\.toEqual\\((\\[[^;]+\\])\\);');
  const m=next.match(re);assert(m,file+' '+key);
  const value=JSON.parse(m[1].replace(/(cases|concepts):/g,'"$1":'));
  assert.deepEqual(value,cohort.runs.before.pools.map(p=>p[key]),'Original cohort expectation reproduced');
  const replacement='expect(pools.map((item) => item.'+key+')).toEqual('+JSON.stringify(cohort.runs.after.pools.map(p=>p[key]))+');';
  next=next.replace(m[0],replacement);allowed.push([m[0],replacement]);
 }
 if(file.endsWith('/surgery-center-batch.test.ts')){
  const marker='    expect(reviewed).toEqual(expected);';assert.equal(next.split(marker).length,2);
  const removed=proof.surgeryCenter.before.filter(id=>!proof.surgeryCenter.after.includes(id)),added=proof.surgeryCenter.after.filter(id=>!proof.surgeryCenter.before.includes(id));
  const block='    // Round two retains old cards, but this cohort now witnesses four new\n    // applied objectives instead of two prior scored constructs.\n'+removed.map(id=>'    expected.delete('+JSON.stringify(id)+');\n').join('')+added.map(id=>'    expected.add('+JSON.stringify(id)+');\n').join('');
  next=next.replace(marker,block+marker);allowed.push([marker,block+marker]);
 }
 if(file.endsWith('/gs028-20261003-batch.test.ts')){
  // This preview was already present before this round. The earlier N2 catalog
  // mismatch had hidden the next assertion in the previous full run.
  const a='    expect(records).toHaveLength(19);';
  const b='    // Retained flag-round-three F13 contributes one planned PSG preview.\n    expect(records).toHaveLength(20);\n    expect(records.filter(record => record.disposition.kind === "not_executed" && record.disposition.reason === "future_planned")).toEqual([{\n      caseId: "case.gs028d.anesthesia.a-validated-not-impression",\n      nodeId: "node.gs028d.anesthesia.a-validated-not-impression.1",\n      questionVariantId: "question.preoperative-osa.validated-risk-screening.v4.r4",\n      choiceId: "choice.qf3.20261104.f13.d2",\n      choiceLabel: "Obtain diagnostic polysomnography before planning precautions",\n      timingProfileId: "timing.test.overnight_protocol",\n      disposition: { kind: "not_executed", reason: "future_planned" },\n    }]);';
  assert.equal(next.split(a).length,2);next=next.replace(a,b);allowed.push([a,b]);assertionsAdded=1;
 }
 if(next===old)continue;
 const count=s=>(s.match(/\bexpect\(/g)||[]).length;assert.equal(count(next),count(old)+assertionsAdded);
 assert.deepEqual([...next.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]),[...old.matchAll(/hostedTime\(([^)]*)\)/g)].map(m=>m[1]));
 const normalize=s=>s.replace(pattern,'.toMatchInlineSnapshot(SNAPSHOT)');let reversed=next;
 for(const[a,b]of allowed)reversed=reversed.replace(b,a);
 assert.equal(normalize(reversed),normalize(old),'Only documented expected values/snapshots/coverage literals change');
 if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8'),next);else if(fs.readFileSync(file,'utf8')!==next){assert.equal(fs.readFileSync(file,'utf8'),old,'Concurrent fixture edit: inspect and preserve '+file);fs.writeFileSync(file,next);}
 reviews.push({file,assertionCallSitesBefore:count(old),assertionCallSitesAfter:count(next),assertionsAdded,commandsAndDeadlinesUnchanged:true,onlyDocumentedExpectedValuesAndAddedExactGuard:true,replacements:allowed});
}
const summary={checkedAt:new Date().toISOString(),control:'question-bank-batch2a-round2-fixture-control-20261104.json',reviews,justification:'Exact old snapshots and cohort counts reproduce with the current domain/N1/N2 and retained prior clinical bank. Only six new constructs and ten version projections differ. Case/node counts are unchanged; three additional active concepts enter the early pools. Seeded unseen selection and the versioned contrast-study gate alter deterministic receipts, while all functional assertions and deadlines remain.',limitation:'The control is diagnostic, not a Vitest pass; actual files must pass their original deadlines. No source/evidence/routing/save or selector change.'};
fs.writeFileSync(root+'question-bank-batch2a-round2-fixture-review-20261104.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(reviews.map(r=>({file:r.file,before:r.assertionCallSitesBefore,after:r.assertionCallSitesAfter}))));
