# Whole-bank retire/merge proposals: 2026-11-04

Proposals only. No concept, question, selector entry or FSRS record is deleted,
retired, merged or migrated by this worker. Manager acceptance and a history
compatibility plan are required before any such change. Clinical sign-off is
Melissa Rowland; an editorial decision does not approve a clinical version.

| Candidate | Practical concern | Proposal and boundary | State |
|---|---|---|---|
| B12-context legacy partial-specimen provenance task (`concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v3`) | The owner found the request-label/photo comparison unimportant. It tests adjudicating paperwork before a procedure already chosen. | Prefer the batch-2a completion-of-diagnostic-sampling application (`.v5`), subject to independent review. Later consider merging redundant provenance coverage into the core complete-biopsy family; preserve the old card/encounters and map history only through an accepted migration. | Proposed; no retirement or merge applied. |
| Repeated HRM acquisition/protocol variants, including B02-context (`concept.achalasia.high-resolution-manometry.v2`) | Recognizing a named swallow maneuver can become low-value trivia or repeat the same acquisition rule. | Keep clinically consequential study-adequacy decisions. Compare acquisition variants together in a later batch and merge only redundant coverage after a foregut reviewer confirms distinct objectives are not lost. B2A03 reframes the current task as a next-investigation decision without deleting the existing concept. | Coverage review proposed; no whole concept retirement recommended. |
| B03-context reserve/outflow interpretation (`concept.achalasia.high-resolution-manometry.v3`) | An actual exhibit improves the task, but technical interpretation still needs a practical-importance judgment. | Retain the image-based draft for independent review. If the distinction does not support an important general-surgery decision, propose merging its teaching into a consequential management task rather than retaining a standalone report-editing quiz. | Importance review pending; no retirement applied. |

The manager has declined the two earlier flag-round-two retirement suggestions:

- **F14, thyroid-nodule FNA selection: KEEP.** Core general-surgery content.
  Leave the exact live version unchanged until a permitted source directly
  supports the proposed morphology/size criteria. No network is authorized in
  this milestone, so no replacement cutoff or raw profile is fabricated.
- **F05, initial neck-node FNA: KEEP.** Initial evaluation of a neck mass is in
  general-surgery scope. Retain the round-two anatomy/wording fixes while those
  sixteen drafts await the manager’s independent-review result. Do not use the
  superseded retirement recommendation to remove this concept.

The complete queue is in question-bank-program-queue-20261104.json. Low-value
or scope concerns discovered in later batches belong here as explicit proposals,
with the useful replacement objective and history consequences, never as silent
deletions or generic onboarding exemptions.

## Final flag author-round overlap to review

F02's proposed treatment application,
`concept.postlaparoscopy.shoulder-pain-biliary-localization.v2`, now overlaps
`concept.bile-leak.minor-leak-ercp-stent`: both select ERCP/plastic-stent
treatment for persistent minor leakage with preserved major-duct continuity.
If the final draft passes, review whether its question should share that
canonical learning objective instead of introducing a duplicate FSRS card.
Check facility entry and history compatibility before any consolidation. Keep
the underlying clinical teaching and both retained versions; no merge,
retirement, routing change or history migration is applied here. If the final
draft is rejected, use its recorded live fallback instead. This proposal does
not reverse the F05/F14 KEEP decisions.

## Batch 2a round-two overlap proposals

These are coverage proposals, not deletions, card migrations or approvals:

- `concept.groin-hernia.femoral-defect-repair-priority.v1` now adds current-study
  reclassification before applying the femoral repair exception. Compare its
  coverage with the existing femoral timely-repair objective after independent
  review; retain the original inguinal objective and all histories meanwhile.
- B2A05 and B2A07 remain variants of the same functional care-priority concept.
  Compare the positive-hip-study and modified-duty errors together. If they add
  too little distinct practice, reduce redundant variant coverage through the
  manager rather than inventing another concept or deleting an active card.
- B2A03 remains a practical acquisition-before-classification decision. Review
  its overlap with the separate new-content manometry protocol items; those
  authored files are untouched here. Avoid a large sub-bank that repeatedly
  tests the same single protocol-purpose rule.
- B2A04 now applies reserve versus outflow evidence to a concrete next plan;
  the old technical classification version is retained. Foregut review should
  assess whether both constructs warrant separate FSRS cards.
- The new source-by-method QI pilot and cortisol etiologic-classification
  objectives should be compared with the existing QI/source-adaptation and
  Cushing/ACTH objectives before future consolidation. Distinct patient context
  does not by itself justify duplicate cards. No merge is applied in this round.


## Batch 2b importance/duplication review

Proposals only; no deletion, selector, FSRS membership or fallback application.

- `question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v3`: These generic return-to-individualized-risk-assessment variants duplicate the active-decompensation/timing cases. The locally recorded broad claim does not establish a unique specific treatment/clearance choice. Do not invent an operation threshold or force a generic cautious key; merge/scope decision belongs to the manager.
- `question.cirrhosis-perioperative-risk.multifactor-assessment.v2`: These generic return-to-individualized-risk-assessment variants duplicate the active-decompensation/timing cases. The locally recorded broad claim does not establish a unique specific treatment/clearance choice. Do not invent an operation threshold or force a generic cautious key; merge/scope decision belongs to the manager.
- Original F02 phrenic-referral recall versus its proposed biliary application: these are different scored objectives. Keep the live original until manager acceptance; consider retiring/merging the low-value anatomy-only variant rather than claiming a bile-leak question repairs it.
- B2B02 and B2B31 both integrate graft-event tissue/serum evidence into compatibility review. Consider merging their scored objectives after clinical review; current separate histories remain intact.
- Four perianal variants now share one explicitly versioned source-control/antibiotic objective, with different host/skin/source observations. Old prompt-drainage history is retained; manager decides whether the older recall concept continues to need separate future coverage.
- F04 remains source-held; F14 remains core general-surgery KEEP/defer, never a retirement. Neck-node initial evaluation remains KEEP.
- F13 is an authoring deferral, not a retirement proposal: the attempted screening-probability item remained easy after deletion/cue attack. Existing recorded SASM claims support screening and risk communication, but not an invented monitoring, treatment or surgical-delay protocol. Keep the manager-retained live version unchanged and priority-one queued until a consequential, adequately supported application can be written. No basic label, new version or history change is applied.

## Batch 2a final-round coverage review

These updates describe only the seven returned batch-2a items. All batch-2b
proposals above remain unchanged. No retirement, merge or history migration is
applied.

- B2A03 now tests acquisition integrity before a reserve report; B2A04 scores
  a useful image interpretation, following the reviewer's permitted alternative
  to an unsupported next-investigation hierarchy. The older statements above
  about their round-two management tasks do not describe the final draft.
  Foregut/owner review should still decide whether these technical objectives
  deserve separate general-surgery cards. Do not equate a new image with
  practical importance or automatically call interpretation a two-step plan.
- The final projection leaves three retained constructs without a fresh case:
  `concept.esophageal-physiology.reserve-before-junction-intervention.v1`,
  `concept.groin-ultrasound.symptom-provocation-protocol.v1`, and
  `concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1`.
  Their definitions and histories remain intact. Review whether to restore
  meaningful fresh coverage or propose an explicit later consolidation; do not
  silently reuse their histories for the new acquisition, anatomy or source-
  imaging objectives.
- Four of the five new constructs are currently paired-only; that coverage
  arrangement remains the manager-approved interim policy. No selector or
  routing change is proposed in this authoring handoff. The adrenal imaging
  application has a standalone case.

## Batch 2b round-two coverage proposals

These notes supersede only the earlier batch-2b draft descriptions above. They
do not retire, merge, reroute or migrate any history. The 38 candidates remain
outside live play pending exact manager acceptance and clinical review.

- B2B02 now distinguishes the donor cell target and pre-event serum window;
  B2B31 distinguishes ABO from HLA records. Review whether both laboratory
  applications merit separate general-surgery cards. Their new objectives are
  distinct from the retained generic antibody-injury explanation, so neither
  inherits that history automatically.
- B2B19 and B2B36 now distinguish an acquired target study needing reconciliation
  from one obscured by a marker shadow. Consider consolidating these into one
  acquisition-quality concept if the independent review still finds the split
  low-value. B2B37 separately tests target and tissue representativity after a
  later sample. Do not turn a paper-attachment error into a reason to delay
  assessment of a suspicious palpable lesion.
- B2B18/B2B29 share one new ECG-response/potassium-shifting concept. B2B20/B2B38
  share one new supralevator-origin/drainage concept. The opposing applications
  are variants of those constructs, not duplicate FSRS cards. The original
  transfer and drainage concepts remain intact.
- B2B30 now tests continued insulin/substrate support when ketone acidosis
  persists after glucose falls. B2B33 tests selection of a ketone investigation.
  Check overlap with the separate new-content worker's SGLT2 cases after review;
  different investigation and treatment stages do not automatically require
  separate permanent concepts.
- F13 is now an authored, explicitly source-held awake gas-exchange candidate,
  rather than an unwritten deferral. Keep its manifest-selected v4 unchanged
  until the new prioritization is supported and accepted. F14 remains core
  thyroid content on its existing hold. Initial neck-node FNA remains KEEP;
  B2B06's independently passed target/assay version is frozen. No retirement
  decision is inferred from any of these holds or proposals.


<!-- FLAGS2 G04 proposal 20261105 -->
G04: question.gs028f.gynecology.pregnancy-testing-pelvic-pain.v1 remains live and byte-exact. Propose retirement/merge of its redundant hCG-assay-recognition objective from resident-facing selection, preserving the importance of pregnancy assessment. A harder decision must interpret symptoms/location evidence and change care, not obscure the assay name. Candidate sibling question.gs028f.gynecology.suspected-ectopic-urgent-evaluation.v3 is an unapproved future redesign target, not an accepted replacement; its current options also need work. Manager must accept any retirement/merge and preserve frozen encounters/FSRS. No deletion, routing or history change is applied. Full reasoning and evidence metadata: question-flags2-handoff-20261105.md and sources-question-flags2-20261105.json.
