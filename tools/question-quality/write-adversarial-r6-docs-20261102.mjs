import fs from "node:fs";
import "../economy-audit/source-loader.mjs";
import {entry,specs} from "./adversarial-r6-specs-20261102.mjs";
import {collectAuthoredMetadata} from "./bank.mjs";
const c=await import("../../packages/clinical-content/src/index.ts"),metadata=collectAuthoredMetadata(c);
const revisions=c.QUESTION_QUALITY_ADVERSARIAL_R6_REVISIONS;
const claimIds=new Set(revisions.flatMap(r=>r.question.supportingEvidenceClaimIds));
const claims=[...claimIds].map(id=>metadata.claims.get(id));
const sourceIds=new Set(claims.flatMap(claim=>claim.sourceIds));
const sources=[...sourceIds].sort().map(id=>metadata.sources.get(id));
const usedBy=id=>revisions.filter(r=>r.question.supportingEvidenceClaimIds.includes(id)).map(r=>r.auditId);
const cell=v=>String(v??"not recorded").replaceAll("|","\\|").replaceAll("\n"," ");
const lines=["# Sources reused for sixth author revision - 2026-11-02","",
 "No network was used in this round. This ledger records existing bibliographic metadata and prior source checks reused for original synthesis; it does not claim fresh article retrieval, a new publication audit or independent corroboration from duplicate source IDs. No source excerpts, article text, tables, figures or protected question-bank material are stored. New clinical versions and claims remain needs_clinician_review.","",
 `The 16 revisions retain mappings to ${claims.length} claims and ${sources.length} source records. Three new atomic claims use four new mapping records for previously checked publications. Medical authority and permission to reuse are assessed separately. Original source access dates are retained.`,"",
 "## Three new atomic mappings","",
 "| Claim ID | Original synthesis | Sources | Items | Limitation |","| --- | --- | --- | --- | --- |",
 ...c.QUESTION_QUALITY_ADVERSARIAL_R6_CLAIMS.map(q=>"| "+[q.id,q.statement,q.sourceIds.join(", "),usedBy(q.id).join(", "),q.limitation].map(cell).join(" | ")+" |"),"",
 "## Complete reused source records","",
 "A record ID is a stable mapping identity. Multiple IDs for one DOI/publication are not independent evidence. Intended use is limited to the mapped atomic claims and items below; clinical authority does not grant copying rights.",""
];
for(const s of sources){
 const mapped=claims.filter(q=>q.sourceIds.includes(s.id));
 lines.push("### "+s.id,"",s.completeCitation??s.title,"",
  "- Organization/journal: "+cell(s.organizationOrJournal),
  "- Authors: "+cell((s.authors??[]).join("; ")),
  "- Year: "+(s.publicationYear===null?"n.d. (undated guidance; original access date retained)":cell(s.publicationYear))+"; DOI: "+cell(s.doi),
  "- Official/public primary route: "+(s.officialUrl??"not recorded"),
  "- Original access date: "+cell(s.accessedOn)+"; source class: "+cell(s.sourceClass),
  "- License/reuse status: "+cell(s.licenseLabel)+" / "+cell(s.reuseStatus),
  "- Reuse restrictions: "+cell(s.reuseNotes),
  "- Medical authority: "+cell(s.authorityAssessment),
  "- Intended use: "+cell(s.usageRole)+"; existing-source factual support/cross-check for "+mapped.map(q=>q.id).join(", "),
  "- Items: "+[...new Set(mapped.flatMap(q=>usedBy(q.id)))].join(", "),""
 );
}
lines.push("## All mapped claims","","These are project-authored statements, not source excerpts. Their original last-check dates and review states remain explicit. A one-source or inference limitation is retained rather than promoted to clinical approval.","",
 "| Claim | Statement | Sources | Category / certainty | Last checked / review | Limitation |","| --- | --- | --- | --- | --- | --- |",
 ...claims.map(q=>"| "+[q.id,q.statement,q.sourceIds.join(", "),q.evidenceCategory+" / "+q.certainty,q.lastCheckedOn+" / "+q.reviewStatus,q.limitation].map(cell).join(" | ")+" |"),"");
fs.writeFileSync("docs/research/sources-question-adversarial-r6-20261102.md",lines.join("\n"));
const response=["# Response to independent review five - sixth author revision","",
 "Review five assessed 73 versions: 57 PASS / 16 REVISE / zero FAIL. All 57 exact PASS versions, all three accepted-basic versions including repaired B29, and eleven exact Melissa Rowland approvals remain unchanged. No new version is marked independently passed or clinically approved.","",
 "All sixteen returned items have new question versions under question-authoring.2026-11-02.v9 and needs_clinician_review. These aim at interpretation/application; no returned item is relabelled basic. Author predictions are not measured difficulty or a substitute for independent review. The packets show the key first for review only; runtime choices remain randomized.","",
 "## Manager decisions implemented","",
 "- B29 now has independent PASS as accepted basic onboarding. Freeze its exact repaired version with B01/B10 and every other PASS.",
 "- Paired-only coverage remains accepted; no selector, routing or FSRS eligibility change. Material interpretation/target-planning changes have three new concept versions, preserving every old definition/history.",
 "- Level 5 input rebinding and legacy behavioral-evidence regeneration are manager work in the release worktree. No evidence input, fixture or released incremental module is edited.","",
 "## Per-item changes and indexed note responses","",
 "Every returned note is addressed by its own indexed author response below and in the batch JSON. Retained clinical limitations are not waived by those responses. This is an author self-check, not a new adversarial verdict.",""
];
let notes=0;
for(const [id,s] of specs){
 const r=revisions.find(r=>r.auditId===id),old=entry.revisions.find(r=>r.auditId===id);
 response.push("### "+id,"","- Versions: "+old.questionVariantId+" -> "+r.questionVariantId,
  "- What changed: "+s.change,"- Intended inference: "+s.steps.join(" Then "),
  "- Decisive observation: "+s.decisive,"- Closest credible error: "+s.closest,
  "- Cue attack: "+s.attack,"- Remaining clinical review: "+s.risk,
  "- Concept: "+r.clinicalBinding.previousConceptId+" -> "+r.clinicalBinding.nextConceptId,
  ...(s.concept?["- Versioning reason: "+s.concept.reason]:[]),""
 );
 for(const group of ["cues","fairness","suggestions"]){
  if(!s.responses[group].length)continue;
  response.push("**"+group+"**","");
  s.responses[group].forEach((message,i)=>{response.push("- "+group+" "+(i+1)+": "+message);notes++;});response.push("");
 }
}
response.push("## Compatibility and review boundary","",
 "Three new constructs (manometry provocative-response interpretation, mapped partial skin evidence, and MRI target/tract planning) retain all 389 entry definitions, making 392. The prior identities remain available and no FSRS history is copied. All 57 passed question/node/presentation/profile values, all three accepted-basic versions, and eleven named clinical approvals are checked against the immutable entry.","",
 "All 1,740 old timing rows remain beside sixteen new rows (1,756 total). Current timed choices change from 1,466 to 1,469; terminal timed keys remain 138. Shared-procedure interpretation options receive the same existing placeholder profile. B05 alone changes its keyed service from ultrasound to the existing MRI route, with an explicit result-gate projection. Every revised testing key has a result gate; no new terminal/unsupported exact record is needed and the previous registry source is byte-identical.","",
 "The deterministic supply snapshots reflect the new concept pool and seeded admission trace. Controlled captured/current callbacks and source normalization verify each intentional update without changing functional assertions, deadlines or selectors. See the exact change receipt and final validation in the round-six handoff. These synthetic diagnostics are not player analytics.","",
 "All new clinical judgments require named sign-off, especially the manometry laboratory interpretation, mapped skin/pathology conclusions and depth bound, constructed MRI target/tract model, and deeper gastric histology fields. Quality uses the standard, advisory lint, independent/owner/clinician review and voluntary tester flags. No answer statistics or correctness collection is introduced. Nothing ships from this worker.","");
fs.writeFileSync("docs/research/question-adversarial-round6-response-20261102.md",response.join("\n"));
console.log(JSON.stringify({revised:specs.size,returnedNoteResponses:notes,mappedClaims:claims.length,reusedSourceRecords:sources.length,newClaims:3,newSourceMappingRecords:4}));
