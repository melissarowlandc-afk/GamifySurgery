import fs from "node:fs";
import "../economy-audit/source-loader.mjs";
import {entry,specs} from "./adversarial-r5-specs-20261102.mjs";
import {collectAuthoredMetadata} from "./bank.mjs";
const c=await import("../../packages/clinical-content/src/index.ts"),metadata=collectAuthoredMetadata(c);
const revisions=c.QUESTION_QUALITY_ADVERSARIAL_R5_REVISIONS;
const claimIds=new Set(revisions.flatMap(r=>r.question.supportingEvidenceClaimIds));
const claims=[...claimIds].map(id=>metadata.claims.get(id));
const sourceIds=new Set(claims.flatMap(claim=>claim.sourceIds));
const sources=[...sourceIds].sort().map(id=>metadata.sources.get(id));
const usedBy=id=>revisions.filter(r=>r.question.supportingEvidenceClaimIds.includes(id)).map(r=>r.auditId);
const cell=v=>String(v??"not recorded").replaceAll("|","\\|").replaceAll("\n"," ");
const lines=["# Sources reused for fifth author revision - 2026-11-02","",
 "No network was used in this round. This ledger records existing bibliographic metadata and prior source checks reused for original synthesis; it does not claim fresh article retrieval, a new publication audit or independent corroboration from duplicate source IDs. No source excerpts, article text, tables, figures or protected question-bank material are stored. New clinical versions and claims remain needs_clinician_review.","",
 `The 26 revisions retain mappings to ${claims.length} claims and ${sources.length} source records. Five new atomic claims use four new mapping records for previously checked publications. Medical authority and permission to reuse are assessed separately. Original source access dates are retained.`,"",
 "## Five new atomic mappings","",
 "| Claim ID | Original synthesis | Sources | Items | Limitation |","| --- | --- | --- | --- | --- |",
 ...c.QUESTION_QUALITY_ADVERSARIAL_R5_CLAIMS.map(q=>"| "+[q.id,q.statement,q.sourceIds.join(", "),usedBy(q.id).join(", "),q.limitation].map(cell).join(" | ")+" |"),"",
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
fs.writeFileSync("docs/research/sources-question-adversarial-r5-20261102.md",lines.join("\n"));
const response=["# Response to independent review four - fifth author revision","",
 "Review four assessed 73 versions: 47 PASS / 26 REVISE / zero FAIL. The 47 exact PASS versions, including the two unchanged active accepted-basic items, remain exact. Eleven exact Melissa Rowland approvals remain untouched. B29's explicit manager-authorized REVISE exception repairs the previously missing recovery-assessment state while retaining its accepted basic purpose; its older exact version remains available. No new version is marked independently passed or clinically approved.","",
 "All 26 returned items have new question versions under question-authoring.2026-11-02.v8 and needs_clinician_review. Twenty-five aim at moderate/hard application; B29 is the specifically accepted basic role. Author predictions are not measured difficulty or a substitute for independent review. The packets show the key first for review only; runtime choices remain randomized.","",
 "## Manager decisions implemented","",
 "- B29 REVISE takes precedence over its prior accepted-basic freeze. Its required assessment is now explicitly incomplete, with feasible accompaniment and handover. No universal observation interval is invented.",
 "- Paired-only coverage is accepted for now. The new lipoma evidence-status version has paired coverage; no selector, routing or FSRS eligibility change.",
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
 "The one new construct is concept.colonic-lipoma.endoscopic-recognition.v3, following v2. It changes the score from further-tissue planning to separate lesion characterization and histologic-confirmation claims. All 388 previous concept definitions remain, including the now non-live v2; no FSRS history is transferred. Both passed no-follow-up companions retain their exact clinical premise and fields. The new feedback does not teach that later management answer.","",
 "All 1,714 old timing rows remain; 26 new rows make 1,740. The current bank has 1,466 timed choices versus 1,451 at entry, and 138 terminal timed keys in both. Testing distractors receive existing profiles; interpretation choices do not inherit old biopsy waits. Two exact order records are additive with unchanged keyed services and prior disposition types. The full prior order registry is reconstructed byte-for-byte after stripping the new block/spread.","",
 "The synthetic supply snapshot change adds the retained v2 identity to the catalog-only list. The controlled before/current-release comparison and normalized source comparison retain functional assertions and deadlines. These are test diagnostics, not player analytics. See the exact receipts and final validation in the round-five handoff.","",
 "All clinical judgments require named sign-off; the new FNA target/matrix plan, manometry protocol roles, skin completion, imaging acquisition and vascular sequence deserve specialist review. Quality uses the standard, advisory linter, independent/owner/clinician review and voluntary tester flags. No answer statistics, correctness input, threshold or collection is added. Nothing ships from this worker.","");
fs.writeFileSync("docs/research/question-adversarial-round5-response-20261102.md",response.join("\n"));
console.log(JSON.stringify({revised:specs.size,returnedNoteResponses:notes,mappedClaims:claims.length,reusedSourceRecords:sources.length,newClaims:5,newSourceMappingRecords:4}));
