import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import "../economy-audit/source-loader.mjs";
import { collectAuthoredMetadata, inventoryRelease } from "./bank.mjs";

const IDS = ["A02", "A06", "A11", "A25", "A30", "A40"];
const TITLES = { A02: "Imaging after inconclusive gallbladder ultrasound", A06: "Interpreting two nipple-discharge patterns", A11: "Initial surgery for confined thyroid cancer", A25: "Reconciling perioperative antiretroviral instructions", A30: "Recurrent peristomal skin injury", A40: "Localizing an abdominal-wall hernia" };
const keyFirst = choices => [...choices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect));
const label = c => (c.isCorrect ? "**KEY:** " : "") + c.label;
const cell = s => String(s ?? "—").replaceAll("|", "\\|").replaceAll("\n", "<br>");
const nodeOf = (c,r) => c.decisionNodes.find(n=>n.id===r.nodeId);

export function buildOwnerRoundTwo(content) {
  const snapshot = JSON.parse(readFileSync(new URL("fixtures/owner-round1-before-20261029.json",import.meta.url),"utf8"));
  return IDS.map(id=>{
    const r=content.QUESTION_QUALITY_REVISIONS.find(r=>r.auditId===id),old=snapshot.revisions.find(r=>r.auditId===id);
    const beforeCase=snapshot.cases.find(c=>c.id===r.caseId),afterCase=content.SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===r.caseId);
    const reviewName=afterCase.patientDisplayName==="{patientName}"?"Jamie Taylor":afterCase.patientDisplayName;
    const display=s=>typeof s==="string"?s.replaceAll("{patientName}",reviewName):s;
    const packet=(c,rev)=>{const n=nodeOf(c,rev);return {variantId:n.questionVariantId,Presentation:display(c.presentation),"Current update":display(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:display(n.stem),Options:keyFirst(n.answerChoices).map(label)};};
    const reasons=rev=>keyFirst(rev.question.answerChoices).map(c=>[label(c),c.rationale??c.distractorRationale]);
    return {id,title:TITLES[id],reviewStatus:"needs_clinician_review",ownerStatus:"awaiting_round_two_review",keyOrderNotice:"key shown first for review only; runtime options are randomized",reviewDisplayNote:"Synthetic canonical profile; any patientName placeholder is rendered as "+reviewName+" for this review only.",caseId:r.caseId,conceptId:r.question.conceptId,before:packet(beforeCase,old),after:packet(afterCase,r),rationalePairs:{before:reasons(old),after:reasons(r)},inference:r.intendedInference,focus:r.reviewerNotes,whatChanged:r.ownerRound2Review.whatChanged,supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,companionVariants:content.QUESTION_QUALITY_REVISIONS.filter(c=>c.caseId===r.caseId&&c.contextCompanion&&c.ownerRound2Review).map(c=>({id:c.auditId,before:c.ownerRound2Review.beforeVariantId,after:c.questionVariantId,whatChanged:c.ownerRound2Review.whatChanged})),clinicalMeaning:"Stable concept objective retained; exact clinical equivalence requires named clinician review."};
  });
}

export function renderOwnerRoundTwo(items) {
  const lines=["## Owner round two — 2026-10-29", "",
    "**Draft; needs_clinician_review. Key shown first for review only. Nothing ships.** The owner approved A04/A08/A17/A22/A23/A27/A28/A38 editorially at their prior exact identities; their authored questions are unchanged. Approval does not supply clinical sign-off. The six returned tasks below have new draft identities; three context companions are versioned for changed shared presentation. All earlier local drafts and exact timing/binding contracts remain retained.", "",
    "Machine-readable review: [question-pilot-round2-20261029.json](question-pilot-round2-20261029.json). Its capitalized display fields are canonical synthetic before/after packets; `rationalePairs` contains option/reason tuples. The manager publishes the review page; this tool performs no network writes.", ""];
  for(const item of items){
    lines.push("### Owner round two: "+item.id+" — "+item.title,"","**Draft; needs_clinician_review. Key shown first for review only.**","",
      "| Field | Round-one owner draft | Round-two draft |","|---|---|---|",
      ...["variantId","Presentation","Current update","Exhibit","Task","Options"].map(k=>"| "+k+" | "+[item.before[k],item.after[k]].map(v=>cell(Array.isArray(v)?v.join("<br>"):v&&typeof v==="object"?JSON.stringify(v):v)).join(" | ")+" |"),"",
      "What changed: "+item.whatChanged,"","Intended inference: "+item.inference,"","Clinical review focus: "+item.focus,"",
      "| Round | Choice (key shown first for review only) | Rationale |","|---|---|---|",
      ...["before","after"].flatMap(round=>item.rationalePairs[round].map(([choice,reason])=>"| "+round+" | "+cell(choice)+" | "+cell(reason)+" |")),"",
      "Claims: "+item.supportingEvidenceClaimIds.map(id=>"`"+id+"`").join(", ")+".","",
      ...item.companionVariants.map(c=>"Companion `"+c.id+"`: `"+c.before+"` → `"+c.after+"`; "+c.whatChanged),"");
  }
  lines.push("A06's near-duplicate warning reflects a meaningful change in classification between the two observed patterns; it requires human review rather than extra filler. A02 retains standard imaging names of different lengths, which the category/length heuristics flag. A11 keeps short standard operation names. A30's raw findings justify assessment of fit, not a claim that an exact oversized opening has been demonstrated. A40's Spigelian/incisional/lumbar options are abdominal-wall hernias; Morgagni is diaphragmatic and is omitted. The new prior-incision location prevents an unspoken assumption when ranking the incisional competitor. All six require clinician confirmation of one best key.","");
  return lines.join("\n");
}

export function proposeRewriteBatch(report,pilotIds) {
  const priorities=["diagnosis-disclosed","key-test-name-in-context","lead-in-decision-principle","case-detail-decision-cue","option-explanation","key-only-phrase-overlap","negative-aligned-to-distractor","key-length-disparity","option-absolute","key-only-word-overlap","case-detail-key-rationale-overlap"];
  const compare=(a,b)=>{
    if(a.caseReferenceCount!==b.caseReferenceCount)return b.caseReferenceCount-a.caseReferenceCount;
    for(const rule of priorities){const delta=Number(b.findings.some(f=>f.rule===rule))-Number(a.findings.some(f=>f.rule===rule));if(delta)return delta;}
    return b.findings.length-a.findings.length||a.questionVariantId.localeCompare(b.questionVariantId);
  };
  return [1,2].flatMap(level=>report.variants.filter(v=>v.priorityStage===level&&!v.tutorialSequence&&!pilotIds.has(v.questionVariantId)&&v.findings.length).sort(compare).slice(0,20).map(v=>({questionVariantId:v.questionVariantId,conceptId:v.conceptId,facilityEntryLevel:level,educationalTier:v.educationalTier,caseReferenceCount:v.caseReferenceCount,caseIds:v.caseIds,intent:v.educationalIntent,selectionReason:priorities.find(rule=>v.findings.some(f=>f.rule===rule))??"other advisory cue",findings:v.findings.map(f=>({rule:f.rule,evidence:f.evidence}))})));
}

export async function main() {
  const content=await import("../../packages/clinical-content/src/index.ts"),items=buildOwnerRoundTwo(content);
  writeFileSync("docs/research/question-pilot-round2-20261029.json",JSON.stringify(items,null,2)+"\n");
  const report=inventoryRelease(content.SYNTHETIC_CLINICAL_RELEASE,collectAuthoredMetadata(content),{pilotRevisions:content.QUESTION_QUALITY_REVISIONS,tutorialCaseIds:[content.FIRST_TUTORIAL_CASE_ID,content.SECOND_TUTORIAL_CASE_ID]});
  const batch=proposeRewriteBatch(report,new Set(content.QUESTION_QUALITY_REVISIONS.map(r=>r.questionVariantId)));
  writeFileSync("docs/research/question-rewrite-batch1-proposal-20261029.json",JSON.stringify({status:"proposal_only_no_rewrites",exposureBasis:"Case-reference count is a structural proxy, not measured plays; no player exposure/correctness analytics collected.",levels:"Facility entry level 1 then 2, distinct from educational tier; 20 variants per level.",variants:batch},null,2)+"\n");
  const lines=["# Full-bank rewrite batch 1 proposal — 2026-10-29","","**Proposal only: none of these 40 variants was rewritten in this milestone.** Pilot content remains local and needs owner/clinician review.","",
    "Highest exposure is approximated by existing case-reference counts because gameplay exposure/correctness analytics are not collected. Actual play frequency is unknown. Within facility entry level 1, then level 2, rank references first; ties prioritize diagnosis/named-test disclosure, lead-in principles, explicit case-detail cues, explanatory labels, key phrase overlap and negative alignment before low-confidence rationale repetition, then warning count. Raw decision-critical assumptions can create a rationale-overlap false positive; inspect them before deleting anything. This is a transparent editorial order, not a validated difficulty score. Twenty variants per level are proposed. Educational tier remains separate. Tutorial sequences and current pilot identities are excluded; foundational candidates and all warnings still need human review. Review concept siblings together before authoring.","",
    "| Order | Variant ID | Concept | Facility entry / educational tier | Case references | Lint reason and exact phrase |","|---|---|---|---|---:|---|",
    ...batch.map((v,i)=>"| "+[i+1,v.questionVariantId,v.conceptId,v.facilityEntryLevel+" / "+(v.educationalTier??"unknown"),v.caseReferenceCount,v.findings.map(f=>f.rule+": "+f.evidence.map(e=>e.field+(e.choiceId?"["+e.choiceId+"]":"")+" = “"+e.text+"”").join("; ")).join("<br>")].map(cell).join(" | ")+" |"),"",
    "The [machine-readable proposal](question-rewrite-batch1-proposal-20261029.json) includes exact case IDs and finding evidence. A clean or high-warning item is not automatically fair/unfair. Before rewriting, inspect the complete visible sequence, clinical evidence, retained approvals and concept-version requirements. No per-question statistics, answer histories, saves or tester-flag exports were used.",""];
  writeFileSync("docs/research/question-rewrite-batch1-proposal-20261029.md",lines.join("\n"));
  process.stdout.write(JSON.stringify({roundTwoItems:items.length,batchVariants:batch.length,batchLevels:batch.reduce((a,v)=>(a[v.facilityEntryLevel]=(a[v.facilityEntryLevel]??0)+1,a),{}),totals:report.totals},null,2)+"\n");
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{process.stderr.write(e.stack+"\n");process.exitCode=1;});
