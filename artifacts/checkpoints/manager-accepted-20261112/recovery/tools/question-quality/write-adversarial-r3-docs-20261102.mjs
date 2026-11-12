import fs from "node:fs";
import {buildReview} from "./review-adversarial-r3-20261102.mjs";
const r=await buildReview(),c=r.content;
const cell=s=>String(s??"").replaceAll("|","\\|").replaceAll("\n"," ");
const sourcePath="docs/research/sources-question-adversarial-r3-20261102.md";
const lines=["# Sources for third author revision after independent review two","",
  "Access/check date: 2026-11-02. Clinical claims and all new question versions remain needs_clinician_review. Melissa Rowland is clinical sign-off. These records store bibliographic metadata and independently worded atomic factual claims, never article text, source stems, algorithms, tables or excerpts.","",
  "Eighteen scoped source records support twenty-two added claims. Twelve reuse publications already checked in the preceding correction; a new scoped ID is not an independent source. The targeted current reads and earlier verified factual checks are distinguished in authority/limitations. The additional publications are the ACG achalasia guideline, CCO melanoma technical guideline, official ACR/RSNA implant-protocol information, and three anatomy publications. Clinical authority is separate from reuse permission.","",
  "The older ASCRS PDF URL returned 404; the complete public society guideline in its new evidence-guideline location was used. The moved/expired toolkit page was not evidence. Direct ACG publisher access failed; the complete society-hosted PDF was available. GEIS2025/ASGE routes that could not be retrieved adequately were not used as supporting sources. No inaccessible snippet, commercial bank, proprietary textbook, recalled board item, SCORE, UpToDate or AccessSurgery was used.","",
  "## Source records",""];
for(const s of c.QUESTION_QUALITY_ADVERSARIAL_R3_SOURCES){
  lines.push("### "+s.id,"",
    "- Citation: "+s.completeCitation,
    "- Organization/journal: "+s.organizationOrJournal,
    "- Authors: "+s.authors.join("; "),
    "- Publication year: "+s.publicationYear+"; DOI: "+(s.doi??"none assigned in this record"),
    "- Official URL: ["+s.title+"]("+s.officialUrl+"). Access date: "+s.accessedOn+".",
    "- Source class: "+s.sourceClass+"; intended use: "+s.usageRole+".",
    "- License/reuse status: "+s.licenseLabel+" / "+s.reuseStatus+". "+s.reuseNotes,
    "- Medical authority/intended factual use: "+s.authorityAssessment,
    "- Supported evidence-claim IDs: "+s.evidenceClaimIds.join(", ")+".","");
}
lines.push("## Excluded candidates (no evidence use)","",
  "- excluded.openstax.anatomy2e: Betts JG, Young KA, Wise JA, Johnson E, Poe B, Kruse DH, Korol O, Johnson JE, Womble M, DeSaix P. Anatomy and Physiology 2e. Houston: OpenStax/Rice University; 2022. Official [preface/terms](https://openstax.org/books/anatomy-and-physiology-2e/pages/preface), accessed 2026-11-02; open educational resource. Current CC BY-NC-SA 4.0 terms separately prohibit AI ingestion without written permission. Excluded when that restriction was found; no evidence claim or question content is derived from this resource.",
  "- excluded.wasserman.myositis: Wasserman PL, Way A, Baig S, Gopireddy DR. MRI of myositis and other urgent muscle-related disorders. Emerg Radiol. 2021;28:409-421. doi:10.1007/s10140-020-01866-2. [Publication](https://pmc.ncbi.nlm.nih.gov/articles/PMC7652376/), accessed 2026-11-02; narrative review. Temporary pandemic reuse permission was not assumed to be a current reusable license. Excluded; supported claim IDs: none. No source expression retained.","",
  "## Atomic claims and question mappings","","All records have lastCheckedOn 2026-11-02, AI-assisted drafting, lastClinicianReview null and reviewStatus needs_clinician_review. Constructed observations/protocol values are fictional teaching inputs, not measured patients or evidence of a treatment effect.","",
  "| Claim | Original statement | Sources | Category / certainty | Limitation | Items |","| --- | --- | --- | --- | --- | --- |");
for(const claim of c.QUESTION_QUALITY_ADVERSARIAL_R3_CLAIMS){
  const items=r.all.filter(p=>p.supportingEvidenceClaimIds.includes(claim.id)).map(p=>p.id);
  lines.push("| "+[claim.id,claim.statement,claim.sourceIds.join(", "),claim.evidenceCategory+" / "+claim.certainty,claim.limitation,items.join(", ")].map(cell).join(" | ")+" |");
}
lines.push("","Existing claim mappings remain available in prior evidence modules and source ledgers. The withheld JGCA2025 discrepancy remains withheld. No new claim, source, concept or profile is promoted by the seventeen editorial passes or the eleven historical exact question approvals.","");
fs.writeFileSync(sourcePath,lines.join("\n"));
const response=["# Third author revision: second-review response and intent ledger","",
  "2026-11-02. The immutable independent input is [review two](question-batch1-adversarial-review2-20261102.json). Requested current packets: [round three](question-round3-20261102.json) and [batch one](question-batch1-20261102.json). Key shown first for review only; runtime choices randomize.","",
  "Seventeen PASS question versions and their visible patient fields remain exact and have pipelinePassed true. Fifty-six returned versions advance: twenty-one application revisions and thirty-five basicRecallIntentional items with individual reasons. Those thirty-five are proposed basic items, not failed attempts at resident difficulty; the label does not automatically grant independent PASS or clinical approval. Every new version remains needs_clinician_review. Melissa's eleven exact historical approvals are untouched.","",
  "There are 999 indexed second-review notes: 34 cues, 807 fairness notes and 158 suggestions, including all 586 assessments of first-review notes. Each current packet has a response for each field/index. Author self-checks and basic labels are not independent acceptance. Clinical/source limitations remain explicit.","",
  "## Exact independent passes retained","",
  "| Item | Exact version | Independent difficulty prediction |","| --- | --- | --- |"];
for(const p of r.all.filter(p=>p.pipelinePassed))response.push("| "+[p.id,p.after.variantId,p.independentReview.difficultyPrediction].map(cell).join(" | ")+" |");
response.push("","## Returned-item decisions","","| Item | Current version | Intent / reason | Specific decision or preserved basic scope | Changes addressing review notes |","| --- | --- | --- | --- | --- |");
for(const p of r.all.filter(p=>!p.pipelinePassed))response.push("| "+[p.id,p.after.variantId,p.basicRecallIntentional?"BASIC: "+p.basicRecallJustification:"APPLICATION; reviewer prediction pending",p.inference,p.reviewActions.join(" ")].map(cell).join(" | ")+" |");
response.push("","## Cue comparison and remaining checks","",
  "Both sides use the same advisory linter. Whole bank: "+r.comparison.wholeBank.before.findings+" to "+r.comparison.wholeBank.after.findings+" findings; "+r.comparison.wholeBank.before.variantsWithFindings+" to "+r.comparison.wholeBank.after.variantsWithFindings+" flagged variants. Selected seventy-three: "+r.comparison.selected.before.findings+" to "+r.comparison.selected.after.findings+" findings. These are lexical findings, not measured difficulty, fairness scores or clinical approval.","",
  "Balanced factorial plans and explicit given/omitted contrast protocols can increase near-duplicate/convergence signatures while removing a combine-the-most-common-parts shortcut. Natural diagnostic names and necessary previous-study protocols still produce lexical warnings. Exact evidence and item-level retention reasons remain in both packets. Do not suppress warnings or pad options to achieve zero.","",
  "Check the new paired clinical decisions, the scope of the 35 basic labels, cross-question feedback, all changed raw reports, and every single-best-answer ranking. The B19/B20 safe region letters differ to avoid memorizing a surface cue. The clinician must confirm that the retained concept objectives remain equivalent; no concept definition/version was silently rewritten.","",
  "Compatibility: all 1,613 entry timing rows remain; 56 new rows make 1,669. Nine exact order records clone prior dispositions. No new route, gate type, service execution, queue logic, wait duration, save format or learning-history identity is introduced. Level 3 exact coverage remains eighty nodes; A25-context adds one balanced option, changing its bank choice total from 318 to 319.","",
  "No correctness collection, answer-statistics input or analytics gate exists in these tools. Manager owns independent re-review, clinical review-page publication, release checks and any actual Level 5 rebind. Nothing ships from this worker.","");
fs.writeFileSync("docs/research/question-adversarial-round3-response-20261102.md",response.join("\n"));
console.log(JSON.stringify({sources:c.QUESTION_QUALITY_ADVERSARIAL_R3_SOURCES.length,claims:c.QUESTION_QUALITY_ADVERSARIAL_R3_CLAIMS.length,pass:17,returned:56,basic:35,application:21,secondReviewNotes:999}));
