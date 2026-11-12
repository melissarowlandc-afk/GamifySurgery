import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {buildReview} from "./review-adversarial-20261102.mjs";
import {collectAuthoredMetadata,preAnswerFields,authoredRationales} from "./bank.mjs";
import {assembleReport,renderInventory} from "./report.mjs";
import {specs} from "./adversarial-specs-20261102.mjs";
const read=p=>fs.readFileSync(p,"utf8"),json=p=>JSON.parse(read(p)),clean=x=>JSON.parse(JSON.stringify(x));
const eq=(a,b,message)=>assert.deepEqual(clean(a),clean(b),message),hash=p=>createHash("sha256").update(fs.readFileSync(p)).digest("hex");
const built=await buildReview(),c=built.content,s=built.snapshot,metadata=collectAuthoredMetadata(c);
eq(json("docs/research/question-round3-20261102.json"),built.pilot);eq(json("docs/research/question-batch1-20261102.json"),built.batch);
eq(json("tools/question-quality/adversarial-cue-before-20261102.json"),built.beforeReport);eq(json("tools/question-quality/adversarial-cue-after-20261102.json"),built.afterReport);
eq(await assembleReport(),built.afterReport);assert.equal(read("docs/research/question-inventory-20261028.md"),renderInventory(built.afterReport));
eq(json("docs/research/question-batch1-adversarial-review-20261102.json"),s.adversarialReview,"Independent input is immutable");
const packets=[...built.pilot,...built.batch].flatMap(i=>[i,...i.contextRevisions]);assert.equal(packets.length,73);assert.equal(new Set(packets.map(i=>i.id)).size,73);
const cases=new Map(c.SYNTHETIC_CLINICAL_RELEASE.cases.map(cs=>[cs.id,cs])),oldCases=new Map(s.cases.map(cs=>[cs.id,cs]));
let noteResponses=0;
for(const i of packets){
  const current=cases.get(i.caseId),previous=oldCases.get(i.caseId),review=s.adversarialReview.find(v=>v.id===i.id);
  const name=current.patientDisplayName==="{patientName}"?"Jamie Taylor":current.patientDisplayName,display=x=>typeof x==="string"?x.replaceAll("{patientName}",name):x;
  for(const[side,cs]of[["before",previous],["after",current]]){const p=i[side],n=cs.decisionNodes.find(n=>n.questionVariantId===p.variantId);assert(n,i.id+" "+side);
    assert.equal(p.Presentation,display(cs.presentation));assert.equal(p["Current update"],display(n.currentUpdate??null));eq(p.Exhibit,n.exhibit??null);assert.equal(p.Task,display(n.stem));
    eq(p.Options,[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(v=>(v.isCorrect?"**KEY:** ":"")+v.label));assert.equal(p.Options.filter(o=>o.startsWith("**KEY:** ")).length,1);
    eq(i.rationalePairs[side].map(([label])=>label),p.Options);assert(i.rationalePairs[side].every(([,reason])=>typeof reason==="string"&&reason.length>0));
  }
  for(const group of["cues","fairness","suggestions"]){assert.equal(i.reviewResponse.noteResponses[group].length,review[group].length);noteResponses+=review[group].length;assert(i.reviewResponse.noteResponses[group].every((text,index)=>text.startsWith(group+" "+(index+1)+":")));}
  assert.equal(i.reviewResponse.originalVerdict,review.verdict);assert.equal(i.reviewStatus,"needs_clinician_review");assert.equal(i.pipelineStatus,"awaiting_independent_re_review_and_manager_acceptance");
  assert.notEqual(i.before.variantId,i.after.variantId);eq(i.lintReview.map(f=>f.findingId),i.lint.after.map(f=>f.id));assert(i.lintReview.every(f=>f.reason&&f.status==="retained_for_independent_review"));
}
assert.equal(built.pilot.length,3);assert.equal(built.batch.length,40);assert.equal(packets.filter(i=>i.reviewResponse.originalVerdict==="PASS").length,6);
for(const old of s.timings)eq(c.ANSWER_CHOICE_TIMING_REGISTRY.filter(t=>t.caseId===old.caseId&&t.nodeId===old.nodeId&&t.questionVariantId===old.questionVariantId),[old]);assert.equal(c.ANSWER_CHOICE_TIMING_REGISTRY.length,1613);
for(const r of c.QUESTION_QUALITY_ADVERSARIAL_REVISIONS)for(const id of r.question.supportingEvidenceClaimIds)assert(metadata.claims.has(id),r.auditId+" "+id);
for(const claim of c.QUESTION_QUALITY_ADVERSARIAL_CLAIMS)for(const id of claim.sourceIds){assert(metadata.sources.has(id),id);assert(metadata.sources.get(id).evidenceClaimIds.includes(claim.id));}
let mathematicalItems=0;
for(const[id,spec]of specs){const m=spec.mathematics;if(!m)continue;mathematicalItems++;
  if(m.kind==="odds"){const odds=m.referenceRisk/(1-m.referenceRisk)*m.oddsRatio;assert(Math.abs(odds/(1+odds)-m.correctRisk)<1e-12);}
  if(m.kind==="riskInterval")eq(m.ratioBounds.map(x=>Number((m.referenceRisk*(x-1)).toFixed(10))),m.differenceBounds);
  if(m.kind==="pTarget"){assert.equal(m.p<.05,m.reject);assert.equal(m.mode==="exclude"?m.lower>-m.target:m.upper<=-m.target,m.mode==="exclude"?true:m.establish);const se=(m.upper-m.lower)/3.92;assert(Math.abs((m.upper+m.lower)/2-m.difference)<.011);assert(se>0);}
  if(m.kind==="equivalence"){assert(m.p>.05);assert(m.lower<-m.margin&&m.upper<m.margin);const p=packets.find(i=>i.id===id);assert(JSON.stringify(p.after.Exhibit).includes("90%"));}
}
let spans=0,postAnswerSpans=0;
function reconstruct(report,release,questionMetadata){const byCase=new Map(release.cases.map(cs=>[cs.id,cs]));for(const v of report.variants)for(const f of v.findings)for(const o of f.occurrences){
  const cs=byCase.get(o.caseId),index=cs.decisionNodes.findIndex(n=>n.questionVariantId===v.questionVariantId),n=cs.decisionNodes[index];assert(n);
  const reasons=authoredRationales(questionMetadata.questions.get(v.questionVariantId)??[],n.answerChoices);
  for(const pid of o.profileIds){const p=pid==="canonical"?null:cs.approvedInstantiationProfiles.find(p=>p.id===pid),fields=preAnswerFields(cs,index,p);for(const[j,e]of f.evidence.entries()){
    const text=e.field==="answerChoices.label"?n.answerChoices.find(v=>v.id===e.choiceId)?.label:e.postAnswerMetadata?reasons.find(r=>r.choiceId===e.choiceId&&r.field===e.field)?.text:fields[e.field],range=o.ranges[j];
    assert.equal(typeof text,"string");assert.equal(text.slice(range.start,range.end),e.text,v.questionVariantId+" "+e.field);spans++;if(e.postAnswerMetadata)postAnswerSpans++;
  }}
}}
const beforeMetadata={...metadata,questions:new Map(metadata.questions)};for(const row of s.metadata)beforeMetadata.questions.set(row.questionVariantId,row.questions);
reconstruct(built.beforeReport,{...c.SYNTHETIC_CLINICAL_RELEASE,cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.map(cs=>oldCases.get(cs.id)??cs)},beforeMetadata);reconstruct(built.afterReport,c.SYNTHETIC_CLINICAL_RELEASE,metadata);
const protectedPaths=["packages/game-domain/src/spatial.ts","packages/game-domain/src/game-evidence-json.ts","packages/game-domain/src/game-evidence.ts","packages/game-domain/src/game-evidence-index.ts","packages/game-domain/tests/level-five-integration.test.ts","packages/game-domain/tests/level-five-latent-bugs.test.ts","tools/qa/level-five-integration-results-20261012.json","tests/fixtures/level-five-integration-checkpoints-20261012.json","tools/perf/evidence-incremental.mjs"];
for(const p of protectedPaths)assert.equal(hash(p),s.files[p].sha256,p+" protected entry hash");
let registry=read("packages/game-domain/src/test-choice-orders.ts").replace(/\/\/ BEGIN QUESTION QUALITY ADVERSARIAL 20261102 EXACT RECORDS[\s\S]*?\/\/ END QUESTION QUALITY ADVERSARIAL 20261102 EXACT RECORDS\r?\n\r?\n/,"").replace("  ...questionQualityAdversarial20261102Records,\n","");
assert.equal(registry,s.files["packages/game-domain/src/test-choice-orders.ts"].text,"Exact old registry text retained");
for(const p of["apps/player/src/session/briefEarlyLevelsPresentation.test.ts","apps/player/src/session/pediatricChartsViewModels.test.ts"])assert.equal(hash(p),s.files[p].sha256,p);
const approvalTable=c.QUESTION_QUALITY_CLINICAL_APPROVALS;assert.equal(approvalTable.length,11);
for(const a of approvalTable){const old=s.revisions.find(r=>r.auditId===a.auditId).question,current=c.QUESTION_QUALITY_REVISIONS.find(r=>r.auditId===a.auditId).question;
  const text=q=>{const{reviewStatus,lastClinicianReview,...rest}=q;return rest;};eq(text(current),text(old),a.auditId+" exact approved text");assert.equal(current.reviewStatus,"clinically_approved");eq(current.lastClinicianReview,{reviewer:a.reviewer,reviewedOn:a.reviewedOn,contentVersion:a.contentVersion});
}
const result={checkedOn:"2026-11-02",status:"passed",mainItems:43,contextItems:30,indexedNoteResponses:noteResponses,exactClinicalApprovals:11,retainedTimingRows:s.timings.length,currentTimingRows:1613,explicitNewOrderRecords:json("tools/question-quality/exact-adversarial-records-20261102.json").length,newClaims:c.QUESTION_QUALITY_ADVERSARIAL_CLAIMS.length,sourceRecords:c.QUESTION_QUALITY_ADVERSARIAL_SOURCES.length,mathematicalItems,sourceSpans:spans,postAnswerSpans,protectedFilesUnchanged:protectedPaths.length,beforeTotals:built.beforeReport.totals,afterTotals:built.afterReport.totals,scope:"Synthetic authoring/report integrity only. No independent clinical acceptance, measured difficulty, correctness analytics or player-data input."};
fs.writeFileSync("tools/question-quality/adversarial-report-qa-20261102.json",JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result,null,2));
