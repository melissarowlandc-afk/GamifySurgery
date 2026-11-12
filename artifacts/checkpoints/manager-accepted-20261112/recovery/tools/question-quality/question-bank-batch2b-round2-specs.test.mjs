import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {entry,specs} from './question-bank-batch2b-round2-specs-20261104.mjs';

test('all and only returned batch-2b items plus omitted F13 are authored',()=>{
 assert.deepEqual(specs.map(s=>s.id).sort(),[...entry.review.filter(r=>r.verdict!=='PASS').map(r=>r.id),'F13'].sort());
 assert.equal(specs.length,38);assert(!specs.some(s=>['B2B06','B2B10'].includes(s.id)));
});
for(const s of specs.filter(s=>s.numericCheck))test(s.id+' has internally consistent constructed arithmetic and gas values',()=>{
 const check=s.numericCheck;
 for(const [column,panel]of (check.panels??[check]).entries()){
  if(check.kind==='gap'||check.kind==='paired-gap')for(const [row,key]of ['na','cl','hco3','albuminGL','pH','pco2'].entries())assert.equal(Number(s.exhibit.cells[row][column]),panel[key],'Visible cell differs from checked '+key);
  if(check.kind==='gas-pair')for(const [row,key]of [[2,'hco3'],[3,'pH'],[4,'pco2']])assert.equal(Number(s.exhibit.cells[row][column]),panel[key],'Visible gas cell differs from checked '+key);
  if(panel.raw!==undefined){assert.equal(panel.na-panel.cl-panel.hco3,panel.raw);assert.equal(panel.raw+0.25*(40-panel.albuminGL),panel.adjusted);assert(s.sourceHold,'Exact aid remains held for separate source verification');}
  if(panel.pH!==undefined){const predicted=6.1+Math.log10(panel.hco3/(0.03*panel.pco2));assert(Math.abs(predicted-panel.pH)<0.02,'Rounded pH, bicarbonate and pCO2 are inconsistent');}
 }
 if(check.kind==='intake'){assert.equal(check.energy.reduce((a,b)=>a+b),check.targetEnergy);assert.equal(check.protein.reduce((a,b)=>a+b),check.targetProtein);}
 if(check.kind==='gas-discordance'){
  assert.notEqual(check.chemistryCO2,check.hco3);
  assert.equal(Number(s.exhibit.cells[2][0].match(/: (\d+)/)[1]),check.chemistryCO2);
  assert.equal(Number(s.exhibit.cells[2][1].match(/: (\d+)/)[1]),check.hco3);
  const gas=s.exhibit.cells[3][1].match(/pH ([\d.]+); CO2 ([\d.]+)/);assert.equal(Number(gas[1]),check.pH);assert.equal(Number(gas[2]),check.pco2);
 }
});
test('F13 and the exact corrected-gap aids cannot silently lose their explicit source holds',()=>{
 for(const id of ['B2B32','B2B34','F13'])assert(specs.find(s=>s.id===id).sourceHold.length>50);
});
test('the corrected packet accounts for every returned reviewer note without accepting drafts',()=>{
 const packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2b-round2-20261104.json','utf8'));
 assert.equal(packet.length,40);
 for(const r of entry.review){const p=packet.find(p=>p.id===r.id);assert(p);if(r.verdict==='PASS'){assert.equal(p.pipelinePassed,true);assert.deepEqual(p.after,entry.packet.find(p=>p.id===r.id).after);continue;}
  assert.equal(p.pipelinePassed,false);assert.equal(p.reviewStatus,'needs_clinician_review');
  for(const category of ['cues','fairness','suggestions']){const responses=p.reviewResponse.noteResponses[category];assert.equal(responses.length,r[category].length);responses.forEach((answer,i)=>{assert.deepEqual(answer.note,r[category][i]);assert(answer.response.length>100);});}
  assert.equal(p.keyOrderNotice,'key shown first for review only; runtime answer choices are randomized');
 }
 const f13=packet.find(p=>p.id==='F13');assert.equal(f13.before.variantId,'question.preoperative-osa.validated-risk-screening.v4');assert(f13.sourceVerificationHold);assert.equal(f13.releaseReady,false);
});
