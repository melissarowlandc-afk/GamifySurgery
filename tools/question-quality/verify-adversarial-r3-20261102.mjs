import fs from "node:fs";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {buildReview} from "./review-adversarial-r3-20261102.mjs";
import {collectAuthoredMetadata,preAnswerFields,authoredRationales} from "./bank.mjs";
import {assembleReport,renderInventory} from "./report.mjs";
import {specs as mathSpecs} from "./adversarial-specs-20261102.mjs";
const read=p=>fs.readFileSync(p,"utf8"),json=p=>JSON.parse(read(p)),clean=v=>v===undefined?v:JSON.parse(JSON.stringify(v));
const eq=(a,b,m)=>assert.deepEqual(clean(a),clean(b),m),hash=p=>createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const built=await buildReview(),c=built.content,s=built.entry,metadata=collectAuthoredMetadata(c);
eq(json("docs/research/question-round3-20261102.json"),built.pilot);
eq(json("docs/research/question-batch1-20261102.json"),built.batch);
eq(json("tools/question-quality/adversarial-r3-cue-before-20261102.json"),built.beforeReport);
eq(json("tools/question-quality/adversarial-r3-cue-after-20261102.json"),built.afterReport);
eq(await assembleReport(),built.afterReport);assert.equal(read("docs/research/question-inventory-20261028.md"),renderInventory(built.afterReport));
eq(json("docs/research/question-batch1-adversarial-review2-20261102.json"),s.review,"Independent review two is immutable");
const packets=built.all;assert.equal(packets.length,73);assert.equal(new Set(packets.map(i=>i.id)).size,73);
const cases=new Map(c.SYNTHETIC_CLINICAL_RELEASE.cases.map(cs=>[cs.id,cs])),oldCases=new Map(s.cases.map(cs=>[cs.id,cs]));
const beforePackets=new Map([...s.pilotPacket,...s.batchPacket].flatMap(p=>[p,...p.contextRevisions]).map(p=>[p.id,p]));
let responses=0,priorAssessments=0;
for(const p of packets){
  const cs=cases.get(p.caseId),old=oldCases.get(p.caseId),review=s.review.find(r=>r.id===p.id),name=cs.patientDisplayName==="{patientName}"?"Jamie Taylor":cs.patientDisplayName;
  const display=v=>typeof v==="string"?v.replaceAll("{patientName}",name):v;
  for(const [side,clinicalCase] of [["before",old],["after",cs]]){
    const fields=p[side],n=clinicalCase.decisionNodes.find(n=>n.questionVariantId===fields.variantId);assert(n,p.id+" "+side);
    assert.equal(fields.Presentation,display(clinicalCase.presentation));assert.equal(fields["Current update"],display(n.currentUpdate??null));
    eq(fields.Exhibit,n.exhibit??null);assert.equal(fields.Task,display(n.stem));
    eq(fields.Options,[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(c=>(c.isCorrect?"**KEY:** ":"")+c.label));
    assert.equal(fields.Options.filter(x=>x.startsWith("**KEY:** ")).length,1);
    eq(p.rationalePairs[side].map(([label])=>label),fields.Options);
    assert(p.rationalePairs[side].every(([,why])=>typeof why==="string"&&why.length>0));
  }
  for(const k of ["cues","fairness","suggestions"]){
    assert.equal(p.reviewResponse.noteResponses[k].length,review[k].length,p.id+" "+k);
    assert(p.reviewResponse.noteResponses[k].every((v,i)=>v.startsWith(k+" "+(i+1)+":")));
    responses+=review[k].length;
  }
  priorAssessments+=review.fairness.filter(x=>x.startsWith("First-pass ")).length;
  eq(p.lintReview.map(x=>x.findingId),p.lint.after.map(x=>x.id));
  assert(p.lintReview.every(x=>x.reason&&x.status==="retained_for_independent_review"));
  const oldRevision=s.revisions.find(r=>r.auditId===p.id),now=c.QUESTION_QUALITY_CURRENT_REVISIONS.find(r=>r.auditId===p.id);
  if(review.verdict==="PASS"){
    assert.equal(p.pipelinePassed,true);eq(p.after,beforePackets.get(p.id).after);
    eq(now.question,oldRevision.question);eq(cs.presentation,old.presentation);eq(cs.approvedInstantiationProfiles,old.approvedInstantiationProfiles);
    eq(cs.decisionNodes.find(n=>n.id===now.nodeId),old.decisionNodes.find(n=>n.id===oldRevision.nodeId));
  }else{
    assert.equal(p.pipelinePassed,false);assert.notEqual(p.before.variantId,p.after.variantId);
    assert.equal(p.reviewStatus,"needs_clinician_review");assert.equal(now.question.lastClinicianReview,null);
    if(p.basicRecallIntentional){assert(p.basicRecallJustification);assert.equal(now.basicRecallIntentional,true);}
    else assert(p.reviewResponse.selfCheck.reasoningSteps.length>=2);
  }
}
assert.equal(responses,999);assert.equal(priorAssessments,586);
assert.equal(packets.filter(p=>p.pipelinePassed).length,17);assert.equal(packets.filter(p=>p.basicRecallIntentional).length,35);
eq(c.SYNTHETIC_CLINICAL_RELEASE.concepts,s.concepts);
for(const row of s.timings)eq(c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>t.caseId===row.caseId&&t.nodeId===row.nodeId&&t.questionVariantId===row.questionVariantId),[row]);
assert.equal(c.ANSWER_CHOICE_TIMING_REGISTRY.length,1669);
for(const r of c.QUESTION_QUALITY_ADVERSARIAL_R3_REVISIONS)for(const id of r.question.supportingEvidenceClaimIds)assert(metadata.claims.has(id),r.auditId+" "+id);
for(const claim of c.QUESTION_QUALITY_ADVERSARIAL_R3_CLAIMS)for(const id of claim.sourceIds){assert(metadata.sources.has(id),id);assert(metadata.sources.get(id).evidenceClaimIds.includes(claim.id));}
for(const a of s.approvals){
  const old=s.revisions.find(r=>r.auditId===a.auditId),now=c.QUESTION_QUALITY_REVISIONS.find(r=>r.auditId===a.auditId);
  eq(now.question,old.question,a.auditId+" exact approved question including metadata");
}
for(const [p,h] of Object.entries(s.protected))assert.equal(hash(p),h,p+" protected");
for(const p of ["packages/clinical-content/src/question-quality-clinical-approvals-20261102.ts","packages/clinical-content/src/question-quality-adversarial-20261102-data.ts","packages/clinical-content/src/question-quality-adversarial-evidence-20261102.ts"])assert.equal(hash(p),s.files[p].sha256,p+" retained source");
const restoredRegistry=read("packages/game-domain/src/test-choice-orders.ts").replace(/\/\/ BEGIN QUESTION QUALITY ADVERSARIAL R3 20261102 EXACT RECORDS[\s\S]*?\/\/ END QUESTION QUALITY ADVERSARIAL R3 20261102 EXACT RECORDS\r?\n\r?\n/,"").replace("  ...questionQualityAdversarialR320261102Records,\n","");
assert.equal(restoredRegistry,s.files["packages/game-domain/src/test-choice-orders.ts"].text,"All prior registry source retained");
let spans=0,postAnswerSpans=0;
function reconstruct(report,release,questionMetadata){
  const byCase=new Map(release.cases.map(cs=>[cs.id,cs]));
  for(const v of report.variants)for(const f of v.findings)for(const o of f.occurrences){
    const cs=byCase.get(o.caseId),index=cs.decisionNodes.findIndex(n=>n.questionVariantId===v.questionVariantId),n=cs.decisionNodes[index];assert(n);
    const reasons=authoredRationales(questionMetadata.questions.get(v.questionVariantId)??[],n.answerChoices);
    for(const pid of o.profileIds){
      const profile=pid==="canonical"?null:cs.approvedInstantiationProfiles.find(p=>p.id===pid),fields=preAnswerFields(cs,index,profile);
      for(const [i,e] of f.evidence.entries()){
        const text=e.field==="answerChoices.label"?n.answerChoices.find(c=>c.id===e.choiceId)?.label:e.postAnswerMetadata?reasons.find(r=>r.choiceId===e.choiceId&&r.field===e.field)?.text:fields[e.field];
        const range=o.ranges[i];assert.equal(typeof text,"string");assert.equal(text.slice(range.start,range.end),e.text,v.questionVariantId+" "+e.field);spans++;if(e.postAnswerMetadata)postAnswerSpans++;
      }
    }
  }
}
const beforeMetadata={...metadata,questions:new Map(metadata.questions)};for(const [id,rows] of s.questionMetadata)beforeMetadata.questions.set(id,rows);
reconstruct(built.beforeReport,{...c.SYNTHETIC_CLINICAL_RELEASE,cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.map(cs=>oldCases.get(cs.id)??cs)},beforeMetadata);
reconstruct(built.afterReport,c.SYNTHETIC_CLINICAL_RELEASE,metadata);
let math=0;
for(const [id,spec] of mathSpecs){const m=spec.mathematics;if(!m)continue;math++;
  if(m.kind==="odds"){const odds=m.referenceRisk/(1-m.referenceRisk)*m.oddsRatio;assert(Math.abs(odds/(1+odds)-m.correctRisk)<1e-12);}
  if(m.kind==="riskInterval")eq(m.ratioBounds.map(x=>Number((m.referenceRisk*(x-1)).toFixed(10))),m.differenceBounds);
  if(m.kind==="pTarget"){assert.equal(m.p<.05,m.reject);assert.equal(m.mode==="exclude"?m.lower>-m.target:m.upper<=-m.target,m.mode==="exclude"?true:m.establish);}
  if(m.kind==="equivalence"){assert(m.p>.05);assert(m.lower<-m.margin&&m.upper<m.margin);assert(JSON.stringify(packets.find(p=>p.id===id).after.Exhibit).includes("90%"));}
}
const records=json("tools/question-quality/adversarial-r3-exact-records-20261102.json");assert.equal(records.length,9);
const result={checkedOn:"2026-11-02",status:"passed",mainItems:43,contextItems:30,independentPassVersionsUnchanged:17,returnedRevisions:56,basicRecallIntentional:35,applicationRevisions:21,indexedSecondReviewResponses:responses,firstReviewAssessmentsRetained:priorAssessments,exactClinicalApprovalsUnchanged:11,retainedTimingRows:1613,currentTimingRows:1669,newExactRecords:9,newClaims:c.QUESTION_QUALITY_ADVERSARIAL_R3_CLAIMS.length,sourceRecords:c.QUESTION_QUALITY_ADVERSARIAL_R3_SOURCES.length,sourceSpans:spans,postAnswerSpans,mathematicalItems:math,protectedFilesUnchanged:Object.keys(s.protected).length,beforeTotals:built.beforeReport.totals,afterTotals:built.afterReport.totals,scope:"Authoring/report integrity only. No new independent PASS, clinical approval, measured difficulty, answer analytics or player data."};
fs.writeFileSync("tools/question-quality/adversarial-r3-report-qa-20261102.json",JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify(result,null,2));
