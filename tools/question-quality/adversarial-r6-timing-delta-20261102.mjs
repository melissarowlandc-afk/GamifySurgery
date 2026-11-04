import fs from "node:fs";
import assert from "node:assert/strict";
import "../economy-audit/source-loader.mjs";
const c=await import("../../packages/clinical-content/src/index.ts");
function inventory(release){
 const rows=new Map(c.ANSWER_CHOICE_TIMING_REGISTRY.map(r=>[[r.caseId,r.nodeId,r.questionVariantId].join("|"),r]));
 return release.cases.flatMap(cs=>cs.decisionNodes.map((n,i)=>{
  const row=rows.get([cs.id,n.id,n.questionVariantId].join("|"));assert(row);
  const choices=row.classification.kind==="test_choices"?row.classification.choices.filter(ch=>ch.timing.kind==="test"):[];
  return {caseId:cs.id,nodeId:n.id,variantId:n.questionVariantId,timedChoices:choices.map(ch=>({id:ch.choiceId,label:ch.choiceLabel,profile:ch.timing.timingProfileId})),terminalTimedKeys:i===cs.decisionNodes.length-1?choices.filter(ch=>n.answerChoices.find(a=>a.id===ch.choiceId)?.isCorrect).length:0};
 }));
}
const before=inventory(c.QUESTION_QUALITY_PRE_ADVERSARIAL_R6_RELEASE),after=inventory(c.SYNTHETIC_CLINICAL_RELEASE);
const total=rows=>({timedChoices:rows.reduce((n,r)=>n+r.timedChoices.length,0),terminalTimedKeys:rows.reduce((n,r)=>n+r.terminalTimedKeys,0)});
const changes=c.QUESTION_QUALITY_ADVERSARIAL_R6_REVISIONS.map(r=>({id:r.auditId,before:before.find(n=>n.caseId===r.caseId&&n.nodeId===r.nodeId),after:after.find(n=>n.caseId===r.caseId&&n.nodeId===r.nodeId)}));
assert.equal(total(before).timedChoices,1466);assert.equal(total(after).timedChoices,1469);assert.equal(total(before).terminalTimedKeys,138);assert.equal(total(after).terminalTimedKeys,138);
const result={checkedOn:"2026-11-02",scope:"Authoring metadata only, not player answers or gameplay analytics. All old rows remain. Existing placeholder profiles only; no fixed wait is put in prose and no new duration/terminal execution rule is introduced.",before:total(before),after:total(after),changes};
fs.writeFileSync("tools/question-quality/adversarial-r6-timing-delta-20261102.json",JSON.stringify(result,null,2)+"\n");
console.log(JSON.stringify({before:result.before,after:result.after,changedCounts:changes.filter(r=>r.before.timedChoices.length!==r.after.timedChoices.length).map(r=>({id:r.id,delta:r.after.timedChoices.length-r.before.timedChoices.length}))}));
