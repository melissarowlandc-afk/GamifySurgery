import fs from "node:fs";
import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {entry} from "./adversarial-r7-specs-20261102.mjs";
const source="tools/question-quality/fixtures/round3-batch1-before-20261102.json";
const original=JSON.parse(fs.readFileSync(source,"utf8"));
const hash=v=>createHash("sha256").update(JSON.stringify(v)).digest("hex");
const rows=entry.review.filter(r=>r.verdict==="REVISE").map(review=>{
 const current=entry.revisions.find(r=>r.auditId===review.id),cs=original.cases.find(c=>c.id===current.caseId),node=cs.decisionNodes.find(n=>n.id===current.nodeId);
 assert(node,review.id);const metadata=original.metadata.find(m=>m.caseId===cs.id&&m.nodeId===node.id);
 const question=metadata?.questions.find(q=>q.id===node.questionVariantId)??null;
 return {id:review.id,caseId:cs.id,nodeId:node.id,fallbackKind:"original_pre_batch_version",variantId:node.questionVariantId,conceptId:node.primaryConceptId,
  provenance:{source,sourceSha256:createHash("sha256").update(fs.readFileSync(source)).digest("hex"),reason:"No later owner-reviewed or shipped version is verified for this batch item in the available local review records. Use the exact captured original rather than label an unshipped author draft as a released fallback.",releaseStatus:"original; shipment not independently established",reviewStatus:question?.reviewStatus??"runtime record; approval not inferred",lastClinicianReview:question?.lastClinicianReview??null},
  exactNodeSha256:hash(node),question,node,
  timing:original.timings.find(t=>t.caseId===cs.id&&t.nodeId===node.id&&t.questionVariantId===node.questionVariantId)??null,
  originalContext:{chiefComplaint:cs.chiefComplaint,presentation:cs.presentation,patientDisplayName:cs.patientDisplayName,prototypeDemographics:cs.prototypeDemographics,approvedInstantiationProfiles:cs.approvedInstantiationProfiles??[]},
  restoreConstraint:"Reference only; no fallback is applied. Manager must restore only the rejected item and its explicit version/timing/service binding, retain all passed nodes and shared presentation/profile fields, and review sequence/result consistency. Do not revert the entire captured case, copy an approval to a different presentation, migrate FSRS history or overwrite another worker's content. Dropping only the r7 projection returns the round-six draft, not this original fallback. Use an explicit original-version projection, restoring the original concept and restoring or clearing Current update/Exhibit when the original has none; retain newer archived definitions/timings."};
});
assert.equal(rows.length,11);
fs.writeFileSync("docs/research/question-batch1-round7-fallbacks-20261102.json",JSON.stringify({recordedOn:"2026-11-03",notice:"Exact original fallback records for the final authoring round; not new approvals and not automatically applied. No verified later owner-reviewed/shipped version is assumed.",items:rows},null,2)+"\n");
console.log(JSON.stringify({fallbacks:rows.length,kind:"original_pre_batch_version",missingQuestionRecords:rows.filter(r=>!r.question).map(r=>r.id),missingTiming:rows.filter(r=>!r.timing).map(r=>r.id)}));
