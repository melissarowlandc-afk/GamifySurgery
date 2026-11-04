import { readFileSync, writeFileSync } from "node:fs";
import "../economy-audit/source-loader.mjs";
import { authoredRationales, collectAuthoredMetadata, inventoryRelease, preAnswerFields } from "./bank.mjs";
import { lintQuestion } from "./lint.mjs";
import { buildOwnerRoundTwo, renderOwnerRoundTwo } from "./owner-round2-review.mjs";

const d=await import("../../packages/clinical-content/src/index.ts"),metadata=collectAuthoredMetadata(d);
const snapshot=JSON.parse(readFileSync(new URL("fixtures/pilot-before-20261028.json",import.meta.url),"utf8"));
const cell=s=>String(s??"—").replaceAll("|","\\|").replaceAll("\n","<br>");
const options=n=>[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(c=>(c.isCorrect?"**KEY:** ":"")+cell(c.label)+" (`"+c.id+"`)").join("<br>");
const findNode=(c,id)=>c.decisionNodes.find(n=>n.id===id);
const lintCase=(c,n,concept)=>lintQuestion({variantId:n.questionVariantId,caseId:c.id,choices:n.answerChoices,fields:preAnswerFields(c,c.decisionNodes.indexOf(n)),concept,rationales:authoredRationales(metadata.questions.get(n.questionVariantId)??[],n.answerChoices)});
const describe=r=>r.findings.length?r.findings.map(f=>"`"+f.rule+"`: "+f.evidence.map(e=>"`"+e.field+(e.choiceId?"["+e.choiceId+"]":"")+"` “"+cell(e.text)+"”").join("; ")).join("<br>"):"No lexical findings; this does not establish clinical validity.";
const before=inventoryRelease(d.QUESTION_QUALITY_SOURCE_RELEASE,metadata),after=inventoryRelease(d.SYNTHETIC_CLINICAL_RELEASE,metadata,{pilotRevisions:d.QUESTION_QUALITY_REVISIONS,tutorialCaseIds:[d.FIRST_TUTORIAL_CASE_ID,d.SECOND_TUTORIAL_CASE_ID]});
const roundTwo=buildOwnerRoundTwo(d);
writeFileSync("docs/research/question-pilot-round2-20261029.json",JSON.stringify(roundTwo,null,2)+"\n");
const lines=["# Question-quality pilot review — 2026-10-28; owner round two 2026-10-29","",
  "**OWNER/CLINICIAN REVIEW HOLD: local working-tree drafts only; nothing ships. Every clinical question and claim remains `needs_clinician_review`. Key shown first for review only; runtime choices are randomized.** Owner editorial approval of eight prior drafts does not confer clinical approval. The six revised drafts require another owner review.","",
  "This pilot contains 14 original tasks and five context companions. Owner round two changes six tasks (A02/A06/A11/A25/A30/A40) and versions three companions (A06/A25/A30 context). The other eight owner-approved tasks retain their exact authored question bytes. No concept ID or concept definition is changed. Clinical equivalence of the revised application, recommendation and distractors remains a clinician decision. Original source, prior `.r2` drafts and the owner's exact round-one draft set remain reconstructible.","",
  "[Standard](../clinical/question-authoring-standard.md), [source records](sources-question-writing-20261028.md), [inventory](question-inventory-20261028.md), [batch-1 proposal](question-rewrite-batch1-proposal-20261029.md), [handoff](question-quality-phase1-handoff-20261028.md). Current [draft definitions](../../packages/clinical-content/src/question-quality-pilot-20261028-data.ts), retained [owner round one](../../packages/clinical-content/src/question-quality-pilot-20261029-round1.ts), and [round-two claim/source ledger](../../packages/clinical-content/src/question-quality-pilot-round2-evidence-20261029.ts).","",
  renderOwnerRoundTwo(roundTwo),"## Whole-bank advisory comparison","",
  `Using the same current rules, original pre-pilot assembly has ${before.totals.findings} warning signatures across ${before.totals.variantsWithFindings}/${before.totals.uniqueVariants} variants; current assembly has ${after.totals.findings} across ${after.totals.variantsWithFindings}/${after.totals.uniqueVariants}. Overlapping warnings are not verified clinical flaws, and a reduction is not measured discrimination. Canonical per-item counts below differ from bank totals, which merge identical signatures across finite profiles and prior visible history.`,"",
  `Complete explicit per-option reasons allow the rationale comparison for ${after.totals.variantsWithCompleteRationales}/${after.totals.uniqueVariants} live variants. Missing/conflicting reasons are unassessed. Rationale spans remain post-answer metadata and never enter the ordinary pre-answer overlap calculation. The linter does not understand all synonymous paraphrases or clinical exclusions.`,"",
  "## Original pilot versus current draft","",
  "All eight manual exclusion cases, all three direct-key disclosures and all five supplied-interpretation cases are represented below (14 distinct tasks). The original 40-item audit remains historical; this table is not a new population estimate.","",
  "| Audit | Original variant | Current variant | Canonical lint before → after | Owner editorial status |","|---|---|---|---:|---|"];
const details=[];
for(const old of snapshot.items){
  const r=d.QUESTION_QUALITY_REVISIONS.find(r=>r.auditId===old.auditId),c=d.SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===r.caseId),a=findNode(old.case,old.nodeId),b=findNode(c,r.nodeId);
  const lb=lintCase(old.case,a,old.concept),la=lintCase(c,b,metadata.concepts.get(b.primaryConceptId));
  const status=r.ownerRound2Review?"new draft awaiting review":r.ownerEditorialReview?.status??"not separately recorded";
  lines.push("| "+[r.auditId,r.previousQuestionVariantId,r.questionVariantId,lb.findings.length+" → "+la.findings.length,status].map(cell).join(" | ")+" |");
  details.push("","## "+r.auditId+" — "+cell(old.concept?.displayName??b.primaryConceptId),"",
    "Case `"+r.caseId+"`; node `"+r.nodeId+"`; stable concept `"+b.primaryConceptId+"`. Facility entry "+c.earliestFacilityStage+"; educational tier "+(old.concept?.educationalTier??"unknown")+". Current content version `"+r.question.contentVersion+"`. **Draft; needs_clinician_review. Key shown first for review only.**","",
    "| Field | Original project-owned source | Current draft |","|---|---|---|",
    "| Presentation | "+cell(old.case.presentation)+" | "+cell(c.presentation)+" |",
    "| Current update | "+cell(a.currentUpdate)+" | "+cell(b.currentUpdate)+" |",
    "| Task | "+cell(a.stem)+" | "+cell(b.stem)+" |",
    "| Options | "+options(a)+" | "+options(b)+" |",
    "| Exhibit | "+cell(a.exhibit?JSON.stringify(a.exhibit):null)+" | "+cell(b.exhibit?JSON.stringify(b.exhibit):null)+" |","",
    "Inference: "+r.intendedInference,"","Review focus: "+r.reviewerNotes,"",
    "| Current choice (key shown first for review only) | Why it tempts / deciding inference |","|---|---|",
    ...r.question.answerChoices.map(choice=>"| "+(choice.isCorrect?"**KEY:** ":"")+cell(choice.label)+" | "+cell(choice.rationale??choice.distractorRationale)+" |"),"",
    "Post-answer feedback: "+r.question.explanation,"",
    "Evidence claims: "+r.question.supportingEvidenceClaimIds.map(id=>"`"+id+"`").join(", ")+". Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.","",
    "Canonical lint before: "+describe(lb),"","Canonical lint after: "+describe(la),"");
}
lines.push(...details,"## Companion and history review","",
  "| Companion | Owner round-one variant | Current variant | Context disposition |","|---|---|---|---|",
  ...d.QUESTION_QUALITY_REVISIONS.filter(r=>r.contextCompanion).map(r=>"| "+[r.auditId,d.QUESTION_QUALITY_OWNER_ROUND1_REVISIONS.find(p=>p.auditId===r.auditId).questionVariantId,r.questionVariantId,r.ownerRound2Review?.whatChanged??"Unchanged this owner round; still needs clinician review."].map(cell).join(" | ")+" |"),"",
  "Review the complete visible sequence, including prior feedback and result gates. A06/A25/A30 companions are scaffolded by earlier decisions; do not claim independent difficult reasoning for every step. A08 remains foundational. A40 now tests anatomical localization among stronger same-category choices; adding rarer names alone does not establish resident difficulty. A27 companion's balanced four-combination mechanics set retains equal term frequencies; its convergence warning has no unique key-frequency advantage.","",
  "## Case-detail deletion review and acceptance","",
  "The owner's new lesson is part of the standard: every case sentence needs a decision/prerequisite/required-presentation job. Delete non-decision filler; replace a sentence that paraphrases the keyed reason with supported raw observations, then independently verify one defensible key. Do not move the cue into a preference, setting statement, mechanism description or lead-in. The exact original A11 preference, A02 availability and A30 opening statements are regression fixtures for advisory case-detail lint. Lexical matches are review prompts; they cannot safely automate deletion of necessary findings.","",
  "The current pilot keeps stable concepts and frozen identities. There are "+d.QUESTION_QUALITY_RETAINED_REVISIONS.length+" superseded local-draft timing identities in addition to 19 original and 19 current identities. A02/A06-companion append exact new keyed-test bindings while retaining every prior contract. A40's three new wrong-choice IDs map to the original no-terminal-outcome contracts; frozen old choices are unchanged. No reducer/save format or spatial optimization is introduced. Level 5 evidence remains untouched and needs a later manager rebind. See the handoff for exact current failures and bound inputs.","",
  "Named clinician review must confirm each key/distractor ranking, profiles, clinical equivalence and source limitations. New sources include one organization for the ATA recommendation, adult-focused hernia anatomy without pediatric management extrapolation, and a current open discharge review. Morgagni's compartment is a review-only factual check with restrictive source rights recorded. Clinical approval and owner acceptance remain separate. No correctness/exposure analytics, saved-history mining, network gameplay retrieval or external publication occurs.","");
writeFileSync("docs/research/question-pilot-review-20261028.md",lines.join("\n")+"\n");
process.stdout.write(JSON.stringify({originalPilotTasks:snapshot.items.length,companions:5,ownerRoundTwoTasks:roundTwo.length,changedIdentities:d.QUESTION_QUALITY_REVISIONS.filter(r=>r.ownerRound2Review).length,retainedDraftIdentities:d.QUESTION_QUALITY_RETAINED_REVISIONS.length,before:before.totals,after:after.totals},null,2)+"\n");
