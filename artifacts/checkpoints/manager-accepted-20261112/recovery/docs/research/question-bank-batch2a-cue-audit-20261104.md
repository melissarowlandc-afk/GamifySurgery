# Batch 2a cue audit: 2026-11-04

Eleven draft versions: nine owner-review targets, one new adrenal question flag, one necessary B06 ultrasound chronology companion. Runtime answers randomized; key shown first for review only in the JSON packet. All new versions remain needs_clinician_review. No clinical/editorial pass is inferred from this audit.

Same question-cue-lint.2026-11-04.v8 before/after: 1418 variants / 6039 finite contexts. Findings 2039 → 2031; variants with warnings 949 → 949. Selected eleven 18 → 14.

| Item / owner ID | Change | Findings before / after |
|---|---|---:|
| B2A01 / b1-B01 | Supply an actual local schematic image in place of the prose-only exhibit. Keep the owner-reviewed task, options, explanation, shared presentation and passed companion exact; give the image version a new draft identity. | 1 / 1 |
| B2A02 / b1-B02 | Replace generic treatment assessment with three named treatments. Remove the failed-reflux-therapy sentence so omeprazole is not pre-excluded independently of the study. Preserve the actual manometry observations. | 3 / 0 |
| B2A03 / b1-B02-context | Replace the swallow-maneuver quiz with a concrete next-investigation decision. All choices are actual investigations, the key repeats an incomplete study, and the post-answer feedback stops before teaching the later treatment answer. | 1 / 0 |
| B2A04 / b1-B03-context | Show an actual schematic instead of the table and normal-draft-report premise. Ask directly for the exhibit interpretation; use a balanced four-option matrix and retain the approved later opioid/physiology question byte for byte. | 7 / 2 |
| B2A05 / b1-B05-context | Delete the diary/exercise framing and the contrived later dissociation of a known symptomatic hernia. Give coherent current examination/function observations and make elective hernia repair the key. | 0 / 1 |
| B2A06 / b1-B06 | Remove the stipulation that cross-sectional imaging has already been requested and the MRI-only protocol set. Use an incomplete outside examination, targeted ultrasound as key, and a correspondingly versioned ultrasound result gate. Preserve old MRI identities for frozen encounters. | 0 / 2 |
| B2A07 / b1-B06-context-continuity | Necessary companion wording only: replace the opening MRI reference with targeted ultrasound after B06’s corrected gate. All other observations, task, choices, feedback and concept remain exact. | 0 / 0 |
| B2A08 / b1-B07-context | Remove the artificial late symptom/contour dissociation that contradicted the established history. Keep coexisting symptoms but make the ongoing functional episode and key clinically consistent. | 1 / 6 |
| B2A09 / b1-B12-context | Replace the low-value request-label/procedure-photo dispute with an actual diagnostic action. Keep the important benign-fragment trap, remove the already-arranged-completion sentence, and use three specific sampling strategies. | 2 / 0 |
| B2A10 / b1-B36 | Replace source-letter abstractions and the priority-of-comparisons puzzle with a concrete preoperative medication-list omission. Remove redundant contact rows; compare three specific next pilot actions. | 3 / 1 |
| B2A11 / new-adrenal-question-flag | Narrow the complete task to cortisol assessment and make all options cortisol tests. Remove the normal potassium/blood-pressure, benign-density and limited-life-expectancy exclusions that previously selected the lone offered axis. | 0 / 1 |
 
v8 adds unnamed-treatment-action for generic treatment/management assessment/discussion/planning labels. It inspects actual image captions and accessible descriptions and excludes nonvisible asset paths. It cannot judge clinical realism, importance, source validity or actual difficulty. All findings remain advisory.

| Owner rule | Variants before / after | Findings before / after |
|---|---:|---:|
| option-alone | 120 / 120 | 164 / 164 |
| option-generic-individualization | 11 / 11 | 11 / 11 |
| availability-permission-cue | 15 / 15 | 16 / 16 |
| supplied-clinical-conclusion | 18 / 18 | 24 / 24 |
| unexplained-negative-imaging | 6 / 6 | 10 / 10 |
| ambiguous-cervical-term | 19 / 19 | 24 / 24 |
| nerve-competitor-plausibility | 0 / 0 | 0 / 0 |
| unnamed-treatment-action | 3 / 2 | 8 / 5 |

## Retained warnings

- B2A01: option-length-disparity. The actual pressure observations must be available in the image and its equivalent accessible description. The clinical task and option set are retained from the owner-reviewed version; a new image version still needs review.
- B2A04: near-duplicate-options. The complete four-option matrix balances both components. Raw pressure descriptions are accessible equivalents of the actual schematic and do not name the reserve/outflow interpretation. The technical interpretation still needs independent importance/difficulty and clinical review.
- B2A05: key-only-word-overlap. The continuing activity limitation and reduction-responsive protrusion are necessary to distinguish elective hernia care from the improved hip complaint. An independently reproduced known hernia should not be contradicted to manufacture difficulty. Review whether a repeat study or rehabilitation is a credible competing choice.
- B2A06: key-only-word-overlap, key-test-name-in-context. The two observations concern different anatomical locations; there is no explicit sentence naming a missing standing/strain protocol. The actual study acquisition must be interpreted. All options are imaging requests; MRI remains a possible later competitor rather than a stipulated routine step.
- B2A08: key-only-word-overlap. Caregiving limitation tracks the reducible protrusion despite improvement in a separate attachment ache. All choices are concrete next plans. A clinically contradictory observation-management key was removed; review the remaining close competitor and difficulty.
- B2A10: key-only-word-overlap. The lexical finding is Medication in the table header versus medication in the key; the manual alternative also says medication-list, which the tokenizer treats as one different token. This does not establish a key-only clinical rationale. The actual as-needed omission pattern must be interpreted across rows. Independent review must judge application difficulty and the competing workflow changes.
- B2A11: unique-key-test-name. Every offered choice is a cortisol study, so the task does not uniquely match a single cortisol option or preclude other indicated hormonal axes. This intentionally prioritizes the owner’s task-clarity flag; it is not claimed to be moderate/hard or granted accepted-basic status.

## Unedited owner-rule candidates

The whole-bank queue retains every live identity and all original 179 candidates. Sixteen flag-round-two drafts are frozen until the manager returns independent review; F14 stays live and deferred. The prior F14/neck-node retirement recommendations are superseded by KEEP decisions. No further linter candidates are rewritten in this batch.

| Variant | Stage | Owner-rule findings |
|---|---:|---:|
| question.achalasia.manometric-recognition.v4.r4 | 1 | 4 |
| question.perianal-abscess.prompt-drainage.v4 | 0 | 3 |
| question.metabolic-acidosis.albumin-corrected-anion-gap.v1 | 0 | 3 |
| question.metabolic-acidosis.albumin-corrected-anion-gap.v3 | 0 | 3 |
| question.metabolic-acidosis.confirm-with-blood-gas.v3 | 0 | 3 |
| question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v1 | 0 | 3 |
| question.perianal-abscess.prompt-drainage.v1 | 0 | 3 |
| question.perianal-abscess.prompt-drainage.v2 | 0 | 3 |
| question.perianal-abscess.prompt-drainage.v3 | 0 | 3 |
| question.spigelian-hernia.elective-repair-referral.v4 | 0 | 3 |
| question.differentiated-thyroid-cancer.individualized-surgical-extent.v3 | 1 | 3 |
| question.acute-mesenteric-ischemia.peritonitis-exploration.v3 | 0 | 2 |
| question.cholecystitis.fit-patient-index-admission-cholecystectomy.v4 | 0 | 2 |
| question.hyperkalaemia.severe-community-result-transfer.v3 | 0 | 2 |
| question.postoperative-delirium.multicomponent-prevention-plan.v4 | 0 | 2 |
| question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1 | 0 | 2 |
| question.cirrhosis-perioperative-risk.multifactor-assessment.v2 | 0 | 2 |
| question.hyperkalaemia.severe-community-result-transfer.v2 | 0 | 2 |
| question.hyperkalaemia.severe-community-result-transfer.v4 | 0 | 2 |
| question.immunology.preformed-antibody-hyperacute-rejection.v4 | 0 | 2 |

## Source and release limitations

No network was used. Three new qualitative achalasia treatment claims use existing real guideline records but need direct treatment-section alignment and foregut review before release. This is an explicit sourceVerificationHold in B2A02. Source metadata/atomic mappings and original-image provenance are in sources-question-bank-batch2a-20261104.json. Other tasks use existing locally mapped evidence; every new version remains draft.

Queue: question-bank-program-queue-20261104.json. Complete exact cue spans: tools/question-quality/question-bank-batch2a-whole-bank-20261104.json. Manager independent review and release follow the batch stop; no owner page review is requested.
