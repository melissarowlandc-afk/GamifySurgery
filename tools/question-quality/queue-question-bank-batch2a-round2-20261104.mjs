import fs from 'node:fs';
import assert from 'node:assert/strict';
const file='docs/research/question-bank-program-queue-20261104.json',source=fs.readFileSync(file,'utf8'),fixture='tools/question-quality/fixtures/question-bank-batch2a-round2-queue-before-20261104.json';
if(!fs.existsSync(fixture))fs.writeFileSync(fixture,source);
const old=JSON.parse(source),packet=JSON.parse(fs.readFileSync('docs/research/question-bank-batch2a-round2-20261104.json','utf8'));
const report=JSON.parse(fs.readFileSync('tools/question-quality/question-bank-batch2a-round2-whole-bank-20261104.json','utf8'));
const variants=old.variants.map(q=>{
 const p=packet.find(p=>p.id!=='B2A01'&&[p.before.variantId,p.after.variantId].includes(q.questionVariantId));
 if(p){const v=report.variants.find(v=>v.questionVariantId===p.after.variantId);assert(v);
  return {...q,questionVariantId:p.after.variantId,previousVariantId:p.before.variantId,conceptId:p.conceptId,state:'batch2a_round2_awaiting_independent_review',batchItem:p.id,pipelinePassed:false,reviewStatuses:['needs_clinician_review'],findings:v.findings.length,
   lintRuleCounts:Object.fromEntries([...new Set(v.findings.map(f=>f.rule))].map(rule=>[rule,v.findings.filter(f=>f.rule===rule).length]))};
 }
 if(q.questionVariantId===packet[0].after.variantId)return {...q,state:'batch2a_review1_pass_basic_frozen',pipelinePassed:true,basicAccepted:true};
 return q;
});
assert.equal(variants.filter(v=>v.state==='batch2a_round2_awaiting_independent_review').length,10);
for(const q of old.variants.filter(q=>!packet.some(p=>p.before.variantId===q.questionVariantId||p.after.variantId===q.questionVariantId)))assert.deepEqual(variants.find(v=>v.questionVariantId===q.questionVariantId),q,'Unrelated queue row '+q.questionVariantId);
const by=key=>Object.fromEntries([...new Set(variants.map(v=>v[key]))].map(k=>[k,variants.filter(v=>v[key]===k).length]));
const next={...old,updatedOn:'2026-11-04',batch2aRound2Note:'B2A01 exact PASS/basic frozen; ten additive drafts with 121 indexed note responses and five-part author checks. Fourteen final flag drafts and all separate new-content queue rows preserved.',totals:{...old.totals,batch2aRound2AwaitingIndependentReview:10,batch2aReview1PassFrozen:1,byPriority:by('priority'),byState:by('state')},variants};
assert.equal(fs.readFileSync(file,'utf8'),source,'Concurrent queue edit: inspect before writing');fs.writeFileSync(file,JSON.stringify(next,null,2)+'\n');
const candidates=variants.filter(q=>q.state==='queued'&&q.priority===2).slice(0,40),cell=x=>String(x??'').replaceAll('|','\\|');assert.equal(candidates.length,40);
fs.writeFileSync('docs/research/question-bank-batch2b-proposal-20261104.md',[
 '# Batch 2b: next forty queued candidates, 2026-11-04','',
 '**Proposal only; no batch-2b source rewrite in the batch-2a correction milestone.** Returned owner/tester items take priority. B2A01, the fourteen final flag drafts, F01/F12/F14, exact owner approvals and the separate new-content files are protected. Ten batch-2a round-two drafts now await independent review.','',
 'Order retains the durable queue: entry stage, structural case references and cue findings. These are authoring proxies, not measured exposure, resident difficulty or answer analytics. Every candidate still needs importance, raw-data, closest-error, source and five-part rubric review.','',
 '| Order | Variant | Concept | Entry / tier | Case references | Advisory findings |','|---:|---|---|---|---:|---|',
 ...candidates.map((q,i)=>'| '+[i+1,q.questionVariantId,q.conceptId,q.entryStage+' / '+(q.educationalTier??'unknown'),q.structuralCaseReferences,Object.entries(q.lintRuleCounts).map(([k,v])=>k+' ('+v+')').join('; ')].map(cell).join(' | ')+' |'),'',
 'No candidate is retired, merged or promoted. The manager accepts the preceding packet and runs independent review/release; a later authored 2b packet must stop at that same gate.','',
].join('\n'));
fs.writeFileSync('tools/question-quality/question-bank-batch2a-round2-queue-review-20261104.json',JSON.stringify({updatedOn:'2026-11-04',changedRows:11,unchangedRows:variants.length-11,allUnrelatedRowsExact:true,totals:next.totals,nextForty:candidates.map(c=>c.questionVariantId)},null,2)+'\n');
console.log(JSON.stringify({changedRows:11,unchangedRows:variants.length-11,nextForty:candidates.length}));
