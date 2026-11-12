import fs from "node:fs";
import {pathToFileURL} from "node:url";
import "../economy-audit/source-loader.mjs";
import {collectAuthoredMetadata,inventoryRelease} from "./bank.mjs";
import {renderInventory} from "./report.mjs";
import {specs} from "./adversarial-specs-20261102.mjs";
const ordered=cs=>[...cs].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect));
const mark=c=>(c.isCorrect?"**KEY:** ":"")+c.label;
const clean=x=>JSON.parse(JSON.stringify(x));
const sum=vs=>({variants:vs.length,variantsWithFindings:vs.filter(v=>v.findings.length).length,findings:vs.reduce((n,v)=>n+v.findings.length,0)});
function lintDisposition(f,id){
  const reasons={
    "option-length-disparity":"Conventional diagnostic names have different natural lengths. Do not pad Achalasia or rename a neighboring diagnosis; the position/trace data must determine the key. Independent reviewer should still attack the name-length pattern.",
    "unique-key-abbreviation":"The abbreviation is a conventional modality/route name. Other protocols have equivalent technical scope; abbreviation length alone does not justify an imaging choice. Clinical ranking still needs review.",
    "heterogeneous-option-category":"These are neighboring physiologic investigations; the regex recognizes manometry and misses distensibility/reflux-monitoring names. Their clinical purpose and workup stage, not the regex category, distinguish the options.",
    "near-duplicate-options":"The exact differing component is consequential. Paired statistical decisions and balanced plan combinations intentionally share wording; no choice is identical and only one combination fits the supplied inputs. Verify the negation/criterion rather than treating small lexical distance as duplicate meaning.",
    "convergence":"Compare all combinations and credible errors, not token frequency. Shared words describe common procedural/plan components; the key must satisfy the clinical requirements. Balanced four-option plans give each component equal frequency; three-choice bundles/sampling plans need independent review for a residual combine-the-features shortcut.",
    "option-absolute":"Driver-only names the actual transport role, not an absolute clinical claim. Each transport/support component occurs in two of four plans; an adult care role cannot be inferred merely from a booking or phone handover.",
    "case-detail-key-rationale-overlap":"Conditional odds ratio is a required model input and is repeated in post-answer rationale metadata. Every visible option is a probability; the words do not identify which numeric risk follows the conversion.",
    "negative-aligned-to-distractor":"The negated term is part of a necessary raw observation, not an author assertion that the named alternative is excluded. Distal contraction is not synonymous with distal spasm; the other swallows and junction measurement must also be interpreted.",
    "key-only-word-overlap":"The shared word removal refers to the prior endoscopic polypectomy in the case and to mesenteric removal in the offered regional operation. It does not equate those procedures or supply the adverse-histology inference. Keep the prior workup stage; a common verb is lexical evidence for review, not a reason to omit it.",
  };
  return {findingId:f.id,rule:f.rule,status:"retained_for_independent_review",reason:reasons[f.rule]??"Retained exact lexical evidence for independent review. "+specs.get(id).attack};
}
export async function buildReview(){
  const content=await import("../../packages/clinical-content/src/index.ts");
  const snapshot=JSON.parse(fs.readFileSync(new URL("fixtures/adversarial-before-20261102.json",import.meta.url),"utf8"));
  const cases=new Map(content.SYNTHETIC_CLINICAL_RELEASE.cases.map(c=>[c.id,c])),oldCases=new Map(snapshot.cases.map(c=>[c.id,c]));
  const all=content.QUESTION_QUALITY_CURRENT_REVISIONS,metadata=collectAuthoredMetadata(content),tutorialCaseIds=[content.FIRST_TUTORIAL_CASE_ID,content.SECOND_TUTORIAL_CASE_ID];
  const beforeMetadata={...metadata,questions:new Map(metadata.questions)};
  for(const row of snapshot.metadata)beforeMetadata.questions.set(row.questionVariantId,row.questions);
  const beforeRelease={...content.SYNTHETIC_CLINICAL_RELEASE,cases:content.SYNTHETIC_CLINICAL_RELEASE.cases.map(c=>oldCases.get(c.id)??c)};
  const beforeReport=inventoryRelease(beforeRelease,beforeMetadata,{tutorialCaseIds,pilotRevisions:snapshot.revisions});
  const afterReport=inventoryRelease(content.SYNTHETIC_CLINICAL_RELEASE,metadata,{tutorialCaseIds,pilotRevisions:all});
  const original=[...snapshot.pilotPacket,...snapshot.batchPacket].flatMap(i=>[i,...i.contextRevisions??[]]);
  const packet=r=>{
    const a=cases.get(r.caseId),b=oldCases.get(r.caseId),n=a.decisionNodes.find(n=>n.id===r.nodeId),o=b.decisionNodes.find(n=>n.id===r.nodeId);
    const oldQ=snapshot.revisions.find(x=>x.auditId===r.auditId).question,name=a.patientDisplayName==="{patientName}"?"Jamie Taylor":a.patientDisplayName;
    const display=v=>typeof v==="string"?v.replaceAll("{patientName}",name):v;
    const fields=(c,n)=>({variantId:n.questionVariantId,Presentation:display(c.presentation),"Current update":display(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:display(n.stem),Options:ordered(n.answerChoices).map(mark)});
    const reasons=(q,n)=>ordered(n.answerChoices).map(c=>{const v=q.answerChoices.find(x=>x.id===c.id);return [mark(c),v?.rationale??v?.distractorRationale??c.rationale??"No explicit reason supplied; clinician review required."];});
    const history=(c,n)=>c.decisionNodes.slice(0,c.decisionNodes.indexOf(n)).map(p=>({variantId:p.questionVariantId,result:display(p.resultGateAfter?.resultNarrative??null),feedback:display(p.explanation),teachingPoint:display(p.teachingPoint??null)}));
    const prior=original.find(i=>i.id===r.auditId),spec=specs.get(r.auditId);
    return {id:r.auditId,title:prior?.title??metadata.concepts.get(r.question.conceptId)?.displayName??r.question.conceptId,
      reviewStatus:r.question.reviewStatus,ownerStatus:"awaiting_owner_review",pipelineStatus:"awaiting_independent_re_review_and_manager_acceptance",
      keyOrderNotice:"key shown first for review only; runtime options are randomized",
      reviewDisplayNote:a.participant?.kind==="employee_discussion"?"Synthetic employee discussion, without patient demographics. Placeholder rendered as "+name+" for review only.":"Synthetic canonical patient; placeholders rendered as "+name+" for review only. Runtime finite profiles remain bound.",
      caseId:r.caseId,conceptId:r.question.conceptId,before:fields(b,o),after:fields(a,n),originalAuthoringBefore:prior?.before??null,
      comparisonBasis:"Before is the exact round-three/batch-one draft attacked by Astra; originalAuthoringBefore retains the earlier authoring baseline.",
      rationalePairs:{before:reasons(oldQ,o),after:reasons(r.question,n)},inference:r.intendedInference,focus:r.reviewerNotes,
      whatChanged:r.adversarialReview?.whatChanged??r.ownerRound3Review?.whatChanged??r.batchReview?.whatChanged,
      caseDetailChanges:{chiefComplaint:{before:b.chiefComplaint,after:a.chiefComplaint},profileChiefComplaints:{before:(b.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint??b.chiefComplaint})),after:(a.approvedInstantiationProfiles??[]).map(p=>({id:p.id,chiefComplaint:p.chiefComplaint??a.chiefComplaint}))}},
      reviewResponse:r.reviewResponse,educationalIntent:r.educationalIntent,supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,
      visibleHistory:{before:history(b,o),after:history(a,n)},lint:{before:beforeReport.variants.find(v=>v.questionVariantId===o.questionVariantId)?.findings??[],after:afterReport.variants.find(v=>v.questionVariantId===n.questionVariantId)?.findings??[]},
      clinicalMeaning:"Stable concept objective and ID retained. Clinical observations/application have changed; Melissa must confirm construct equivalence and the single key. No concept metadata version was promoted or silently rewritten.",
      ...(spec?.mathematics?{derivedValueBasis:spec.mathematics}:{}),
      lintReview:(afterReport.variants.find(v=>v.questionVariantId===n.questionVariantId)?.findings??[]).map(f=>lintDisposition(f,r.auditId)),
      companionVariants:all.filter(x=>x.caseId===r.caseId&&x.contextCompanion&&x.questionVariantId!==r.questionVariantId).map(x=>({id:x.auditId,before:x.previousQuestionVariantId,after:x.questionVariantId,whatChanged:x.adversarialReview?.whatChanged??x.ownerRound3Review?.whatChanged??x.batchReview?.whatChanged}))};
  };
  const attach=r=>({...packet(r),contextRevisions:all.filter(c=>c.caseId===r.caseId&&c.contextCompanion&&c.adversarialReview).map(packet)});
  const revised=content.QUESTION_QUALITY_ADVERSARIAL_REVISIONS,pilot=revised.filter(r=>r.auditId.startsWith("A")&&!r.contextCompanion).map(attach),batch=revised.filter(r=>r.auditId.startsWith("B")&&!r.contextCompanion).map(attach);
  for(const i of batch){const v=afterReport.variants.find(v=>v.questionVariantId===i.after.variantId);i.facilityEntryLevel=v.priorityStage;i.educationalTier=v.educationalTier;i.caseReferenceCount=v.caseReferenceCount;i.exposureBasis="Original proposal: Level 1 then 2, case-reference proxy only; no player analytics.";}
  const subset=(report,items,field)=>sum(report.variants.filter(v=>new Set(items.map(i=>i[field].variantId)).has(v.questionVariantId)));
  const contexts=[...pilot,...batch].flatMap(i=>i.contextRevisions);
  const comparison={checkedOn:"2026-11-02",linterVersion:afterReport.linterVersion,rule:"Same linter and exact per-version authoring metadata on both sides; advisory findings are not measured difficulty or clinical validation.",wholeBank:{before:beforeReport.totals,after:afterReport.totals},pilotTasks:{before:subset(beforeReport,pilot,"before"),after:subset(afterReport,pilot,"after")},batchTasks:{before:subset(beforeReport,batch,"before"),after:subset(afterReport,batch,"after")},contexts:{before:subset(beforeReport,contexts,"before"),after:subset(afterReport,contexts,"after")},perItem:[...pilot,...batch,...contexts].map(i=>({id:i.id,beforeVariantId:i.before.variantId,afterVariantId:i.after.variantId,beforeFindings:i.lint.before.length,afterFindings:i.lint.after.length,remainingRules:[...new Set(i.lint.after.map(f=>f.rule))]}))};
  return {content,snapshot,pilot:clean(pilot),batch:clean(batch),beforeReport,afterReport,comparison};
}
export async function main(){const r=await buildReview();const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+"\n");
  write("docs/research/question-round3-20261102.json",r.pilot);write("docs/research/question-batch1-20261102.json",r.batch);
  write("tools/question-quality/adversarial-cue-before-20261102.json",r.beforeReport);write("tools/question-quality/adversarial-cue-after-20261102.json",r.afterReport);write("tools/question-quality/adversarial-cue-comparison-20261102.json",r.comparison);
  fs.writeFileSync("docs/research/question-inventory-20261028.md",renderInventory(r.afterReport));
  console.log(JSON.stringify({mainItems:r.pilot.length+r.batch.length,contextItems:[...r.pilot,...r.batch].reduce((n,i)=>n+i.contextRevisions.length,0),wholeBank:r.comparison.wholeBank,subsets:{pilot:r.comparison.pilotTasks,batch:r.comparison.batchTasks,contexts:r.comparison.contexts}},null,2));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error(e.stack);process.exitCode=1;});
