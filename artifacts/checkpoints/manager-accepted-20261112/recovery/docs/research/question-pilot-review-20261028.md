# Question-quality pilot review — 2026-10-28; owner round two 2026-10-29

Current continuation (2026-11-02): eleven pilot tasks are owner-approved editorially; A02/A06/A25 have new drafts in [round-three JSON](question-round3-20261102.json). This packet retains the prior review history. See [the current handoff](question-round3-batch1-handoff-20261102.md); all clinical versions remain needs_clinician_review.

**OWNER/CLINICIAN REVIEW HOLD: local working-tree drafts only; nothing ships. Every clinical question and claim remains `needs_clinician_review`. Key shown first for review only; runtime choices are randomized.** Owner editorial approval of eight prior drafts does not confer clinical approval. The six revised drafts require another owner review.

This pilot contains 14 original tasks and five context companions. Owner round two changes six tasks (A02/A06/A11/A25/A30/A40) and versions three companions (A06/A25/A30 context). The other eight owner-approved tasks retain their exact authored question bytes. No concept ID or concept definition is changed. Clinical equivalence of the revised application, recommendation and distractors remains a clinician decision. Original source, prior `.r2` drafts and the owner's exact round-one draft set remain reconstructible.

[Standard](../clinical/question-authoring-standard.md), [source records](sources-question-writing-20261028.md), [inventory](question-inventory-20261028.md), [batch-1 proposal](question-rewrite-batch1-proposal-20261029.md), [handoff](question-quality-phase1-handoff-20261028.md). Current [draft definitions](../../packages/clinical-content/src/question-quality-pilot-20261028-data.ts), retained [owner round one](../../packages/clinical-content/src/question-quality-pilot-20261029-round1.ts), and [round-two claim/source ledger](../../packages/clinical-content/src/question-quality-pilot-round2-evidence-20261029.ts).

## Owner round two — 2026-10-29

**Draft; needs_clinician_review. Key shown first for review only. Nothing ships.** The owner approved A04/A08/A17/A22/A23/A27/A28/A38 editorially at their prior exact identities; their authored questions are unchanged. Approval does not supply clinical sign-off. The six returned tasks below have new draft identities; three context companions are versioned for changed shared presentation. All earlier local drafts and exact timing/binding contracts remain retained.

Machine-readable review: [question-pilot-round2-20261029.json](question-pilot-round2-20261029.json). Its capitalized display fields are canonical synthetic before/after packets; `rationalePairs` contains option/reason tuples. The manager publishes the review page; this tool performs no network writes.

### Owner round two: A02 — Imaging after inconclusive gallbladder ultrasound

**Draft; needs_clinician_review. Key shown first for review only.**

| Field | Round-one owner draft | Round-two draft |
|---|---|---|
| variantId | question.cholecystitis.hida-after-equivocal-ultrasound.v2.r3 | question.cholecystitis.hida-after-equivocal-ultrasound.v2.r4 |
| Presentation | Jamie Taylor, a 37-year-old woman, comes to the clinic with sustained right-upper-quadrant pain, nausea and inflammatory laboratory findings. Ultrasound shows gallstones, but the gallbladder inflammatory findings are inconclusive. The patient is stable; further imaging can be arranged at the receiving hospital without an availability constraint. | Jamie Taylor, a 37-year-old woman, comes to the clinic with sustained right-upper-quadrant pain, nausea and inflammatory laboratory findings. Ultrasound shows gallstones, but the gallbladder inflammatory findings are inconclusive. |
| Current update | — | — |
| Exhibit | — | — |
| Task | Which investigation should be arranged next for Jamie Taylor's suspected acute cholecystitis? | Which investigation should be arranged next for Jamie Taylor's suspected acute cholecystitis? |
| Options | **KEY:** Hepatobiliary scintigraphy<br>Contrast-enhanced abdominal CT<br>Biliary magnetic resonance imaging | **KEY:** Hepatobiliary scintigraphy<br>Contrast-enhanced abdominal CT<br>Biliary magnetic resonance imaging |

What changed: Deleted the entire stability/availability sentence. Retained the symptoms, inflammatory findings and inconclusive ultrasound; no replacement setting sentence points at the key.

Intended inference: Choose additional imaging for the unresolved gallbladder diagnosis after equivocal ultrasound.

Clinical review focus: Confirm that the clinical question, without an availability preference, supports the intended single best investigation. The source ranking is not a universal imaging algorithm.

| Round | Choice (key shown first for review only) | Rationale |
|---|---|---|
| before | **KEY:** Hepatobiliary scintigraphy | Targets the unresolved gallbladder question after inconclusive ultrasound. |
| before | Contrast-enhanced abdominal CT | Prioritizes a broader abdominal survey when the remaining question concerns gallbladder inflammation. |
| before | Biliary magnetic resonance imaging | Prioritizes detailed biliary anatomy over resolving the remaining gallbladder question. |
| after | **KEY:** Hepatobiliary scintigraphy | Targets the unresolved gallbladder question after inconclusive ultrasound. |
| after | Contrast-enhanced abdominal CT | Prioritizes a broader abdominal survey when the remaining question concerns gallbladder inflammation. |
| after | Biliary magnetic resonance imaging | Prioritizes detailed biliary anatomy over resolving the remaining gallbladder question. |

Claims: `claim.gs028c.cholecystitis.hida-after-equivocal-us`, `claim.qq20261028.cholecystitis.comparative-imaging`.


### Owner round two: A06 — Interpreting two nipple-discharge patterns

**Draft; needs_clinician_review. Key shown first for review only.**

| Field | Round-one owner draft | Round-two draft |
|---|---|---|
| variantId | question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r2 | question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r3 |
| Presentation | Jamie Taylor, a 42-year-old woman, visits the clinic after noticing intermittent small blood-stained spots inside the left side of the bra. Examination localizes the discharge to one duct. The discharge has appeared during ordinary activity as well as at the visit. | Jamie Taylor, a 42-year-old woman, visits the clinic after finding rust-coloured spots inside the left side of the bra between examinations. During the visit, compression produces pale fluid from several openings on each nipple; a reddish drop is also seen at one left-sided opening. |
| Current update | — | — |
| Exhibit | — | — |
| Task | Which feature of this nipple discharge most strongly supports a pathologic rather than a physiologic pattern? | Which interpretation best accounts for Jamie Taylor's nipple-discharge history? |
| Options | **KEY:** Spontaneous single-duct discharge<br>Intermittent episodes of discharge<br>Small volume of discharge | **KEY:** Pathologic left-sided episodes; physiologic expressed secretion<br>Physiologic left-sided episodes; physiologic expressed secretion<br>Endocrine-mediated left-sided episodes; endocrine-mediated expressed secretion |

What changed: Replaced a single classic feature list with mixed raw observations. All three choices interpret both the between-examination episodes and the expressed secretion, with parallel grammar and credible overgeneralization errors.

Intended inference: Separate two observed patterns and decide which interpretation accounts for both, rather than selecting an explicitly labelled feature.

Clinical review focus: Confirm that the unprovoked left-sided history is sufficiently clear and that the endocrine interpretation is a credible competing error. The conceptual target remains pattern classification, not a specific breast lesion.

| Round | Choice (key shown first for review only) | Rationale |
|---|---|---|
| before | **KEY:** Spontaneous single-duct discharge | Uses the pattern that warrants pathologic-discharge evaluation; it does not identify a specific underlying lesion. |
| before | Intermittent episodes of discharge | Intermittent timing can seem reassuring or concerning, but does not classify the pattern as reliably as the origin and spontaneity. |
| before | Small volume of discharge | The amount can distract from the more informative pattern; scant discharge can still warrant evaluation. |
| after | **KEY:** Pathologic left-sided episodes; physiologic expressed secretion | Distinguishes the unilateral staining episodes from the bilateral secretion elicited during examination; one pattern need not explain every observation. |
| after | Physiologic left-sided episodes; physiologic expressed secretion | Overweights the bilateral expressed fluid and treats the separate left-sided history as reassuring. |
| after | Endocrine-mediated left-sided episodes; endocrine-mediated expressed secretion | Attributes the combined history to a systemic endocrine explanation because pale fluid can be expressed from both breasts, underweighting the focal reddish episodes. |

Claims: `claim.discharge.pathologic-pattern`, `claim.qq20261029.discharge.mixed-pattern`, `claim.qq20261029.discharge.endocrine-alternative`.

Companion `A06-context`: `question.pathologic-nipple-discharge.diagnostic-imaging.v1.r3` → `question.pathologic-nipple-discharge.diagnostic-imaging.v1.r4`; Versioned the companion because its shared presentation changed; removed the redundant request-for-evaluation wording.

### Owner round two: A11 — Initial surgery for confined thyroid cancer

**Draft; needs_clinician_review. Key shown first for review only.**

| Field | Round-one owner draft | Round-two draft |
|---|---|---|
| variantId | question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r3 | question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r4 |
| Presentation | Jamie Taylor, a 43-year-old woman, presents after thyroid FNA returned papillary thyroid carcinoma. No dedicated preoperative central or lateral neck-node mapping has been completed. | Jamie Taylor, a 43-year-old woman, presents after thyroid FNA returned papillary thyroid carcinoma. No dedicated preoperative central or lateral neck-node mapping has been completed. |
| Current update | Neck ultrasound shows a 2 cm papillary thyroid carcinoma confined to one lobe, with no gross extension beyond the thyroid, no suspicious cervical nodes and a normal-appearing contralateral lobe. Staging has not identified distant metastases. The patient has chosen surgery and asks to preserve uninvolved thyroid tissue when an appropriate operation allows it. | Neck ultrasound shows a 2 cm papillary thyroid carcinoma confined to one lobe, with no gross extension beyond the thyroid, no suspicious cervical nodes and a normal-appearing contralateral lobe. Staging has not identified distant metastases. The patient has chosen surgery. |
| Exhibit | — | — |
| Task | Which initial operation is most appropriate for Jamie Taylor's papillary thyroid carcinoma? | Which initial operation is most appropriate for Jamie Taylor's papillary thyroid carcinoma? |
| Options | **KEY:** Lobectomy<br>Total thyroidectomy<br>Subtotal thyroidectomy | **KEY:** Lobectomy<br>Total thyroidectomy<br>Subtotal thyroidectomy |

What changed: Removed the tissue-preservation request entirely. Retained the selected-surgery status and staging facts; mapped the recommendation explicitly to current ATA guidance rather than relying on a preference to break a tie.

Intended inference: Apply the disease-extent recommendation for initial surgery without using an explicit preference to identify the limited operation.

Clinical review focus: Named clinician must confirm the ATA 2025 recommendation and absence of an alternative supplied indication for total thyroidectomy. The existing 2 cm observation is unchanged. No blanket rule for all thyroid cancers is taught.

| Round | Choice (key shown first for review only) | Rationale |
|---|---|---|
| before | **KEY:** Lobectomy | Applies the confined unilateral tumor findings and tissue-preservation goal to an eligible initial operation. |
| before | Total thyroidectomy | A cancer diagnosis can prompt a more extensive operation, but that is less aligned with this eligible patient's stated tissue-preservation goal. |
| before | Subtotal thyroidectomy | Attempts a compromise on tissue preservation but is not the guideline's lobectomy-based initial approach for this profile. |
| after | **KEY:** Lobectomy | Applies the 2025 ATA initial-surgery recommendation to the stated unilateral 2 cm, intrathyroidal, node-negative and nonmetastatic profile. |
| after | Total thyroidectomy | Extends treatment beyond the recommended initial extent for this stated profile without another supplied indication for contralateral surgery. |
| after | Subtotal thyroidectomy | Treats subtotal resection as an intermediate cancer operation; it is not the recommended initial operation for this profile. |

Claims: `claim.dtc.extent`, `claim.dtc.lobectomy-boundary`, `claim.qq20261029.thyroid.initial-lobectomy`.


### Owner round two: A25 — Reconciling perioperative antiretroviral instructions

**Draft; needs_clinician_review. Key shown first for review only.**

| Field | Round-one owner draft | Round-two draft |
|---|---|---|
| variantId | question.gs028g.hiv-perioperative.art-continuity.v1.r3 | question.gs028g.hiv-perioperative.art-continuity.v1.r4 |
| Presentation | Jamie Taylor, a 43-year-old woman, visits the clinic before elective hernia repair at an outside surgical service. HIV is well controlled on a prescribed ritonavir-boosted antiretroviral regimen. The patient can swallow, and the prescribed medicines are available. | Jamie Taylor, a 43-year-old woman, visits the clinic before elective hernia repair at an outside surgical service. The clinic medication list records a ritonavir-boosted antiretroviral regimen being taken as prescribed. A generic preoperative instruction sheet includes these medicines among those to pause for the operation. |
| Current update | — | — |
| Exhibit | — | — |
| Task | Which perioperative antiretroviral medication plan is most appropriate for this elective operation? | Which perioperative antiretroviral plan should be sent to Jamie Taylor's surgical team? |
| Options | **KEY:** Keep the complete regimen<br>Suspend the complete regimen<br>Omit the regimen's booster | **KEY:** Continue the complete prescribed regimen<br>Interrupt the complete prescribed regimen<br>Withhold ritonavir and maintain the other agents |

What changed: Removed the permission-like swallowing/availability sentence and the generic well-controlled reassurance. Added a concrete conflicting instruction to interpret. Rebuilt three parallel plans around full continuity, blanket interruption and partial-regimen continuation; no filler or exact interruption interval.

Intended inference: Reconcile a generic stop instruction with regimen continuity, while recognizing that deleting a booster is a different error rather than a safe compromise.

Clinical review focus: Confirm feasible administration and clinical plausibility of the instruction conflict without adding an unsupported fasting or drug-dosing rule. The companion separately tests a specific drug interaction; no new concept objective is intended.

| Round | Choice (key shown first for review only) | Rationale |
|---|---|---|
| before | **KEY:** Keep the complete regimen | Recognizes feasible regimen continuity rather than repeating a stated permission to continue ART. |
| before | Suspend the complete regimen | Overgeneralizes perioperative medication withholding to an effective regimen that can be administered. |
| before | Omit the regimen's booster | Attempts to avoid interaction concerns by removing part of a regimen without coordinated review. |
| after | **KEY:** Continue the complete prescribed regimen | Reconciles the generic withholding instruction with the need to avoid an unnecessary interruption of a feasible prescribed regimen. |
| after | Interrupt the complete prescribed regimen | Applies a generic perioperative withholding instruction to ART without medication-specific review. |
| after | Withhold ritonavir and maintain the other agents | Attempts to reduce interaction concerns by removing ritonavir and continuing an incomplete regimen without coordinated review. |

Claims: `claim.gs028g.hiv-perioperative.art-continuity`, `claim.gs028g.hiv-perioperative.art-continuity.fact2`, `claim.gs028g.hiv-perioperative.art-continuity.fact3`, `claim.gs028g.hiv-perioperative.art-continuity.fact4`.

Companion `A25-context`: `question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r3` → `question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r4`; Versioned the companion for the shared medication-reconciliation context; its interaction decision is unchanged.

### Owner round two: A30 — Recurrent peristomal skin injury

**Draft; needs_clinician_review. Key shown first for review only.**

| Field | Round-one owner draft | Round-two draft |
|---|---|---|
| variantId | question.gs028g.peristomal-skin.restore-seal.v1.r3 | question.gs028g.peristomal-skin.restore-seal.v1.r4 |
| Presentation | Jamie Taylor, a 43-year-old woman, visits the clinic with burning around an ileostomy. Moist erosions form a ring around the stoma where effluent has contacted the skin. Skin farther out under the adhesive is intact. The stoma is viable, and the patient is well. | Jamie Taylor, a 43-year-old woman, visits the clinic with recurrent burning around an ileostomy. Examination shows a moist red ring immediately beside the stoma, with intact skin farther out under the adhesive. The stoma is viable, and the patient feels well. |
| Current update | With the pouch removed, the nurse sees that the cutout extends beyond the stoma base and leaves the eroded ring exposed to effluent. | The removed barrier shows moisture around its inner edge, although the outer adhesive border remains attached. |
| Exhibit | — | — |
| Task | Which appliance-care change should be made for Jamie Taylor's peristomal skin problem? | Which next step is most appropriate for Jamie Taylor's recurrent peristomal skin injury? |
| Options | **KEY:** Resize the opening to the stoma<br>Switch the adhesive to another product<br>Apply antifungal powder under the pouch<br>Increase the frequency of pouch changes | **KEY:** Reassess pouch fit with the ostomy nurse<br>Switch to a different adhesive brand<br>Start topical antifungal treatment<br>Schedule more frequent routine pouch changes |

What changed: Removed the explicit oversized-cutout mechanism and the presentation clause interpreting effluent contact. Used observable skin and barrier findings; the key now calls for assessment of fit, without assuming a demonstrated dimension that the vignette no longer supplies.

Intended inference: Infer a recurrent appliance-contact problem from the skin distribution and removed-barrier observations, then choose fit assessment rather than an empiric product or interval change.

Clinical review focus: Confirm a single best next step. The observations support assessment/refitting but do not establish an exact cutout defect, product choice or wear interval. Prior diagnosis feedback remains legitimate scaffolding.

| Round | Choice (key shown first for review only) | Rationale |
|---|---|---|
| before | **KEY:** Resize the opening to the stoma | Targets continued effluent contact at the observed fit problem with ostomy-nurse guidance. |
| before | Switch the adhesive to another product | Treats the injury as adhesive intolerance despite the intact more peripheral adhesive-contact skin and exposed-ring pattern. |
| before | Apply antifungal powder under the pouch | Treats a competing cause of peristomal rash without correcting the demonstrated exposure pathway. |
| before | Increase the frequency of pouch changes | Responds to wetness but leaves the opening-to-stoma mismatch in place. |
| after | **KEY:** Reassess pouch fit with the ostomy nurse | Uses the distribution and removed-appliance observations to prioritize assessment of the seal and fit before prescribing a particular product or opening dimension. |
| after | Switch to a different adhesive brand | Treats the complaint as an adhesive-product problem without first explaining the observed distribution and inner-edge moisture. |
| after | Start topical antifungal treatment | Treats a competing rash mechanism before assessing the appliance and the source of the recurrent contact injury. |
| after | Schedule more frequent routine pouch changes | May form part of an individualized plan, but selecting a new routine interval alone does not assess why this appliance repeatedly fails at the affected skin. |

Claims: `claim.gs028g.peristomal-skin.restore-seal`, `claim.gs028g.peristomal-skin.restore-seal.fact2`, `claim.gs028g.peristomal-skin.restore-seal.fact3`, `claim.gs028g.peristomal-skin.restore-seal.fact4`, `claim.qq20261028.peristomal.fit-exposure`.

Companion `A30-context`: `question.gs028g.peristomal-skin.effluent-irritation.v1.r3` → `question.gs028g.peristomal-skin.effluent-irritation.v1.r4`; Versioned the companion because the shared presentation now contains raw morphology rather than a supplied effluent-contact explanation.

### Owner round two: A40 — Localizing an abdominal-wall hernia

**Draft; needs_clinician_review. Key shown first for review only.**

| Field | Round-one owner draft | Round-two draft |
|---|---|---|
| variantId | question.pediatric-clinic.upper-midline-lump.v1.r3 | question.pediatric-clinic.upper-midline-lump.v1.r4 |
| Presentation | Ella Morgan, a 6-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline. Examination identifies a small abdominal-wall gap with protruding fat at that site, above the navel. Ella is comfortable. | Ella Morgan, a 6-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline. Examination identifies a small abdominal-wall gap with protruding fat at that site, above the navel. Her previous abdominal operation used a right-lower-quadrant incision. Ella is comfortable. |
| Current update | — | — |
| Exhibit | — | — |
| Task | Which diagnosis best explains Ella Morgan's abdominal-wall lump? | Which diagnosis best explains Ella Morgan's abdominal-wall lump? |
| Options | **KEY:** Epigastric hernia<br>Umbilical hernia<br>Inguinal canal hernia | **KEY:** Epigastric hernia<br>Spigelian hernia<br>Incisional hernia<br>Lumbar hernia |

What changed: Replaced umbilical/inguinal competitors with Spigelian, incisional and lumbar hernias. Added the location of the prior incision as decision-critical raw history, without an option-by-option negative list. Morgagni is not used because its compartment differs.

Intended inference: Localize the defect and relate it to the operative history among competing abdominal-wall hernias.

Clinical review focus: Still an anatomical-recognition task, with stronger same-category competitors. Confirm pediatric plausibility. Morgagni is diaphragmatic and is excluded from this abdominal-wall option set; no new diagnosis or concept meaning is intended.

| Round | Choice (key shown first for review only) | Rationale |
|---|---|---|
| before | **KEY:** Epigastric hernia | Uses the location and focal fat-containing wall defect rather than absence of bulges elsewhere. |
| before | Umbilical hernia | Confuses a nearby midline location with the navel itself. |
| before | Inguinal canal hernia | Overgeneralizes a common pediatric hernia category without using the examination site. |
| after | **KEY:** Epigastric hernia | Uses the focal upper-midline fat-containing wall defect; the previous incision is at a different site. |
| after | Spigelian hernia | Confuses a lateral abdominal-wall defect near the semilunar line with the observed midline defect. |
| after | Incisional hernia | Overweights the operative history without matching the current defect to the prior incision. |
| after | Lumbar hernia | Confuses a posterior or flank wall defect with the anterior upper-midline finding. |

Claims: `claim.pediatric-clinic.epigastric-fat-defect`, `claim.qq20261029.hernia.spigelian`, `claim.qq20261029.hernia.incisional`, `claim.qq20261029.hernia.lumbar`.


A06's near-duplicate warning reflects a meaningful change in classification between the two observed patterns; it requires human review rather than extra filler. A02 retains standard imaging names of different lengths, which the category/length heuristics flag. A11 keeps short standard operation names. A30's raw findings justify assessment of fit, not a claim that an exact oversized opening has been demonstrated. A40's Spigelian/incisional/lumbar options are abdominal-wall hernias; Morgagni is diaphragmatic and is omitted. The new prior-incision location prevents an unspoken assumption when ranking the incisional competitor. All six require clinician confirmation of one best key.

## Whole-bank advisory comparison

Using the same current rules, original pre-pilot assembly has 1916 warning signatures across 933/1418 variants; current assembly has 1894 across 926/1418. Overlapping warnings are not verified clinical flaws, and a reduction is not measured discrimination. Canonical per-item counts below differ from bank totals, which merge identical signatures across finite profiles and prior visible history.

Complete explicit per-option reasons allow the rationale comparison for 179/1418 live variants. Missing/conflicting reasons are unassessed. Rationale spans remain post-answer metadata and never enter the ordinary pre-answer overlap calculation. The linter does not understand all synonymous paraphrases or clinical exclusions.

## Original pilot versus current draft

All eight manual exclusion cases, all three direct-key disclosures and all five supplied-interpretation cases are represented below (14 distinct tasks). The original 40-item audit remains historical; this table is not a new population estimate.

| Audit | Original variant | Current variant | Canonical lint before → after | Owner editorial status |
|---|---|---|---:|---|
| A02 | question.cholecystitis.hida-after-equivocal-ultrasound.v2 | question.cholecystitis.hida-after-equivocal-ultrasound.v2.r4 | 4 → 2 | new draft awaiting review |
| A04 | question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2 | question.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2.r2 | 1 → 1 | approved_editorially |
| A06 | question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1 | question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r3 | 1 → 1 | new draft awaiting review |
| A08 | question.wound.secondary-intention-healing.v1 | question.wound.secondary-intention-healing.v1.r2 | 2 → 0 | approved_editorially |
| A11 | question.differentiated-thyroid-cancer.individualized-surgical-extent.v1 | question.differentiated-thyroid-cancer.individualized-surgical-extent.v1.r4 | 3 → 1 | new draft awaiting review |
| A17 | question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3 | question.adrenal-incidentaloma.pheochromocytoma-before-biopsy.v3.r3 | 1 → 0 | approved_editorially |
| A22 | question.statistics-ethics.fisher-exact.v2 | question.statistics-ethics.fisher-exact.v2.r3 | 0 → 0 | approved_editorially |
| A23 | question.statistics-ethics.risk-ratio-odds-ratio.v4 | question.statistics-ethics.risk-ratio-odds-ratio.v4.r3 | 8 → 0 | approved_editorially |
| A25 | question.gs028g.hiv-perioperative.art-continuity.v1 | question.gs028g.hiv-perioperative.art-continuity.v1.r4 | 1 → 0 | new draft awaiting review |
| A27 | question.gs028g.laparoscopy-respiratory.co2-absorption.v2 | question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r3 | 2 → 0 | approved_editorially |
| A28 | question.gs028g.merkel-cell.integrated-diagnosis.v1 | question.gs028g.merkel-cell.integrated-diagnosis.v1.r3 | 2 → 0 | approved_editorially |
| A30 | question.gs028g.peristomal-skin.restore-seal.v1 | question.gs028g.peristomal-skin.restore-seal.v1.r4 | 0 → 0 | new draft awaiting review |
| A38 | question.pediatric-clinic.shrinking-mobile-neck-nodes.v2 | question.pediatric-clinic.shrinking-mobile-neck-nodes.v2.r3 | 0 → 0 | approved_editorially |
| A40 | question.pediatric-clinic.upper-midline-lump.v1 | question.pediatric-clinic.upper-midline-lump.v1.r4 | 0 → 0 | new draft awaiting review |

## A02 — HIDA after equivocal gallbladder ultrasound

Case `case.gs028c.acute-cholecystitis.a-stones-without-secondary-signs`; node `node.gs028c.acute-cholecystitis.a-stones-without-secondary-signs.1`; stable concept `concept.cholecystitis.hida-after-equivocal-ultrasound`. Facility entry 0; educational tier 1. Current content version `question-authoring.2026-10-29.v3`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, a 37-year-old woman, comes to the clinic with sustained right-upper-quadrant pain, nausea, and inflammatory laboratory findings. Ultrasound confirms stones but the secondary signs of acute inflammation are inconclusive. The patient is stable and HIDA is promptly available at the receiving hospital. | {patientName}, a 37-year-old woman, comes to the clinic with sustained right-upper-quadrant pain, nausea and inflammatory laboratory findings. Ultrasound shows gallstones, but the gallbladder inflammatory findings are inconclusive. |
| Current update | — | — |
| Task | Which diagnostic study should be used next to evaluate suspected acute cholecystitis after an equivocal ultrasound? | Which investigation should be arranged next for {patientName}'s suspected acute cholecystitis? |
| Options | **KEY:** Hepatobiliary scintigraphy (`correct_2`)<br>Right-upper-quadrant ultrasound (`d1_2`)<br>Noncontrast abdominal CT (`d2_2`)<br>Biliary magnetic resonance imaging (`d3_2`) | **KEY:** Hepatobiliary scintigraphy (`correct_2`)<br>Contrast-enhanced abdominal CT (`d2_2`)<br>Biliary magnetic resonance imaging (`d3_2`) |
| Exhibit | — | — |

Inference: Choose additional imaging for the unresolved gallbladder diagnosis after equivocal ultrasound.

Review focus: Confirm that the clinical question, without an availability preference, supports the intended single best investigation. The source ranking is not a universal imaging algorithm.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Hepatobiliary scintigraphy | Targets the unresolved gallbladder question after inconclusive ultrasound. |
| Contrast-enhanced abdominal CT | Prioritizes a broader abdominal survey when the remaining question concerns gallbladder inflammation. |
| Biliary magnetic resonance imaging | Prioritizes detailed biliary anatomy over resolving the remaining gallbladder question. |

Post-answer feedback: Hepatobiliary scintigraphy can clarify suspected acute calculous cholecystitis after an inconclusive ultrasound. WSES ranks its diagnostic accuracy highly; CT and MRI may serve other clinical questions. The exact next investigation remains subject to the clinical setting and clinician review.

Evidence claims: `claim.gs028c.cholecystitis.hida-after-equivocal-us`, `claim.qq20261028.cholecystitis.comparative-imaging`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `case-detail-decision-cue`: `presentation` “promptly available”; `answerChoices.label[correct_2]` “Hepatobiliary scintigraphy”<br>`heterogeneous-option-category`: `answerChoices.label[correct_2]` “Hepatobiliary scintigraphy”; `answerChoices.label[d1_2]` “Right-upper-quadrant ultrasound”; `answerChoices.label[d2_2]` “Noncontrast abdominal CT”; `answerChoices.label[d3_2]` “Biliary magnetic resonance imaging”<br>`key-test-name-in-context`: `presentation` “HIDA”; `answerChoices.label[correct_2]` “Hepatobiliary scintigraphy”<br>`option-length-disparity`: `answerChoices.label[d3_2]` “Biliary magnetic resonance imaging”; `answerChoices.label[correct_2]` “Hepatobiliary scintigraphy”

Canonical lint after: `heterogeneous-option-category`: `answerChoices.label[correct_2]` “Hepatobiliary scintigraphy”; `answerChoices.label[d2_2]` “Contrast-enhanced abdominal CT”; `answerChoices.label[d3_2]` “Biliary magnetic resonance imaging”<br>`option-length-disparity`: `answerChoices.label[d3_2]` “Biliary magnetic resonance imaging”; `answerChoices.label[correct_2]` “Hepatobiliary scintigraphy”


## A04 — Explain refeeding-related phosphate shifts

Case `case.gs028f.nutrition.c1-where-phosphate-went`; node `node.gs028f.nutrition.c1-where-phosphate-went.1`; stable concept `concept.gs028f.nutrition.refeeding-insulin-phosphate-shift`. Facility entry 0; educational tier 0. Current content version `question-authoring.2026-10-28.v1`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, a 45-year-old woman, returns after a completed hospital nutrition restart. The team identified an insulin-associated phosphate shift after prolonged poor intake. The patient has no ongoing symptoms and asks which compartment received phosphate as the blood concentration fell. | {patientName}, a 45-year-old woman, returns to the clinic after a completed hospital nutrition restart following prolonged poor intake. The record shows that carbohydrate intake increased, insulin rose and serum phosphate fell. The patient has recovered and asks about the earlier laboratory change. |
| Current update | — | — |
| Task | Which movement of phosphate best matches the insulin-associated refeeding shift documented for this patient? | Which phosphate movement best accounts for the fall in serum phosphate during this nutrition restart? |
| Options | **KEY:** From extracellular blood into cells (`correct_2`)<br>From cells into the extracellular blood (`d1_2`)<br>From circulating blood into the urine (`d2_2`)<br>From intestinal lumen into circulating blood (`d3_2`) | **KEY:** From extracellular fluid into cells (`correct_2`)<br>From cells into extracellular fluid (`d1_2`)<br>From circulating blood into urine (`d2_2`)<br>From intestinal lumen into blood (`d3_2`) |
| Exhibit | — | — |

Inference: Infer the insulin-associated intracellular shift from the nutrition sequence and laboratory direction, rather than repeat a supplied interpretation.

Review focus: This remains a compartment/mechanism objective; it does not diagnose every cause of hypophosphatemia or teach a replacement regimen.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** From extracellular fluid into cells | Connects carbohydrate-driven insulin activity with cellular phosphate uptake. |
| From cells into extracellular fluid | Reverses the compartment shift and would tend to raise the measured extracellular concentration. |
| From circulating blood into urine | Mistakes an intracellular redistribution for renal loss after focusing on the falling serum result. |
| From intestinal lumen into blood | Confuses the source of newly absorbed nutrients with the redistribution explaining the serum fall. |

Post-answer feedback: After prolonged undernutrition, carbohydrate-associated insulin activity can increase cellular phosphate uptake. The relevant movement is from extracellular fluid into cells; the serum result measures the extracellular compartment.

Evidence claims: `claim.gs028f.refeeding.insulin-phosphate-shift`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `near-duplicate-options`: `answerChoices.label[correct_2]` “From extracellular blood into cells”; `answerChoices.label[d1_2]` “From cells into the extracellular blood”

Canonical lint after: `near-duplicate-options`: `answerChoices.label[correct_2]` “From extracellular fluid into cells”; `answerChoices.label[d1_2]` “From cells into extracellular fluid”


## A06 — Classify nipple discharge patterns

Case `case.gs028b.nipple-discharge.paired-bloody-single-duct`; node `node.gs028b.nipple-discharge.paired-bloody-single-duct.1`; stable concept `concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition`. Facility entry 0; educational tier 0. Current content version `question-authoring.2026-10-29.v3`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, a 42-year-old woman, presents with spontaneous unilateral bloody discharge arising from one duct without compression. No fever or lactation is present. | {patientName}, a 42-year-old woman, visits the clinic after finding rust-coloured spots inside the left side of the bra between examinations. During the visit, compression produces pale fluid from several openings on each nipple; a reddish drop is also seen at one left-sided opening. |
| Current update | — | — |
| Task | How should this discharge pattern be classified? | Which interpretation best accounts for {patientName}'s nipple-discharge history? |
| Options | **KEY:** Pathologic discharge pattern (`correct_1`)<br>Physiologic multiduct discharge (`d1_1`)<br>Lactational milk production (`d2_1`)<br>Superficial breast cellulitis (`d3_1`) | **KEY:** Pathologic left-sided episodes; physiologic expressed secretion (`correct_1`)<br>Physiologic left-sided episodes; physiologic expressed secretion (`d1_1`)<br>Endocrine-mediated left-sided episodes; endocrine-mediated expressed secretion (`d2_1`) |
| Exhibit | — | — |

Inference: Separate two observed patterns and decide which interpretation accounts for both, rather than selecting an explicitly labelled feature.

Review focus: Confirm that the unprovoked left-sided history is sufficiently clear and that the endocrine interpretation is a credible competing error. The conceptual target remains pattern classification, not a specific breast lesion.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Pathologic left-sided episodes; physiologic expressed secretion | Distinguishes the unilateral staining episodes from the bilateral secretion elicited during examination; one pattern need not explain every observation. |
| Physiologic left-sided episodes; physiologic expressed secretion | Overweights the bilateral expressed fluid and treats the separate left-sided history as reassuring. |
| Endocrine-mediated left-sided episodes; endocrine-mediated expressed secretion | Attributes the combined history to a systemic endocrine explanation because pale fluid can be expressed from both breasts, underweighting the focal reddish episodes. |

Post-answer feedback: The left-sided staining between examinations warrants a pathologic-discharge evaluation even though compression also produces a bilateral multiduct pattern. The latter can be physiologic and does not establish one endocrine cause for the entire presentation. Pattern recognition does not determine the underlying lesion.

Evidence claims: `claim.discharge.pathologic-pattern`, `claim.qq20261029.discharge.mixed-pattern`, `claim.qq20261029.discharge.endocrine-alternative`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `key-only-phrase-overlap`: `stem` “discharge pattern”; `answerChoices.label[correct_1]` “discharge pattern”

Canonical lint after: `near-duplicate-options`: `answerChoices.label[correct_1]` “Pathologic left-sided episodes; physiologic expressed secretion”; `answerChoices.label[d1_1]` “Physiologic left-sided episodes; physiologic expressed secretion”


## A08 — Recognize secondary-intention healing

Case `case.gs028e.wound-healing-remaining.c2-skin-excision-plan`; node `node.gs028e.wound-healing-remaining.c2-skin-excision-plan.1`; stable concept `concept.wound.secondary-intention-healing`. Facility entry 0; educational tier 0. Current content version `question-authoring.2026-10-28.v1`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, a 46-year-old woman, reviews an outside dermatology record after a small skin lesion was removed. The treating clinician deliberately left the appropriate defect open to heal without stitches, a graft or planned later closure. The patient is well and has no wound-infection symptoms. | {patientName}, a 46-year-old woman, visits the clinic to review an outside dermatology record after removal of a small skin lesion. At follow-up, the wound edges remain apart and the defect is becoming smaller as it heals. The wound-care plan is dressings while healing proceeds. |
| Current update | — | — |
| Task | Which healing strategy describes this patient's wound being left open without later edge closure? | Which healing strategy describes this skin-excision wound's documented course? |
| Options | **KEY:** Healing by secondary intention (`correct_1`)<br>Healing by direct edge approximation (`d1_1`)<br>Healing after delayed edge closure (`d2_1`)<br>Healing after skin-graft placement (`d3_1`) | **KEY:** Healing by secondary intention (`correct_1`)<br>Healing by primary intention (`d1_1`)<br>Healing by delayed primary closure (`d2_1`) |
| Exhibit | — | — |

Inference: Recognize the healing strategy from the observed course instead of alternative-by-alternative exclusions.

Review focus: Keep the closing course sufficiently explicit to distinguish delayed closure; the simple concept cannot fairly be made a stretch item by deleting that distinction.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Healing by secondary intention | Recognizes healing of the open defect rather than relying on a list excluding sutures, grafting and later closure. |
| Healing by primary intention | Mistakes ordinary postoperative wound care for immediate edge approximation. |
| Healing by delayed primary closure | Confuses continuing open-wound healing with an initial open interval followed by edge closure. |

Post-answer feedback: This course describes secondary-intention healing: the defect heals while the edges remain apart. Primary intention approximates the edges, while delayed primary closure includes later edge closure. This names the supplied course rather than recommending open healing for every excision.

Evidence claims: `claim.gs028e.secondary_intention`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `negative-aligned-to-distractor`: `presentation` “without stitches, a graft or planned later closure”; `presentation` “closure”; `answerChoices.label[d2_1]` “closure”<br>`negative-aligned-to-distractor`: `stem` “without later edge closure”; `stem` “closure”; `answerChoices.label[d2_1]` “closure”

Canonical lint after: No lexical findings; this does not establish clinical validity.


## A11 — Individualize DTC surgical extent

Case `case.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology`; node `node.gs028b.differentiated-thyroid-cancer.paired-malignant-cytology.2`; stable concept `concept.differentiated-thyroid-cancer.individualized-surgical-extent`. Facility entry 1; educational tier 1. Current content version `question-authoring.2026-10-29.v3`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, a 43-year-old woman, presents after thyroid FNA returned papillary thyroid carcinoma. No dedicated preoperative central or lateral neck-node mapping has been completed. | {patientName}, a 43-year-old woman, presents after thyroid FNA returned papillary thyroid carcinoma. No dedicated preoperative central or lateral neck-node mapping has been completed. |
| Current update | Preoperative neck ultrasound returns with no suspicious central or lateral cervical nodes and no gross extrathyroidal extension; the tumor measures 2 cm, remains intrathyroidal and confined to one lobe with no other high-risk driver, and the patient prefers tissue preservation when reasonable. | Neck ultrasound shows a 2 cm papillary thyroid carcinoma confined to one lobe, with no gross extension beyond the thyroid, no suspicious cervical nodes and a normal-appearing contralateral lobe. Staging has not identified distant metastases. The patient has chosen surgery. |
| Task | Which planning approach is most appropriate? | Which initial operation is most appropriate for {patientName}'s papillary thyroid carcinoma? |
| Options | **KEY:** Discuss lobectomy as an eligible option (`correct_1`)<br>Mandate total thyroidectomy for every DTC (`d1_1`)<br>Avoid surgical evaluation entirely (`d2_1`)<br>Choose the operation from age alone (`d3_1`) | **KEY:** Lobectomy (`correct_1`)<br>Total thyroidectomy (`d1_1`)<br>Subtotal thyroidectomy (`d2_1`) |
| Exhibit | — | — |

Inference: Apply the disease-extent recommendation for initial surgery without using an explicit preference to identify the limited operation.

Review focus: Named clinician must confirm the ATA 2025 recommendation and absence of an alternative supplied indication for total thyroidectomy. The existing 2 cm observation is unchanged. No blanket rule for all thyroid cancers is taught.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Lobectomy | Applies the 2025 ATA initial-surgery recommendation to the stated unilateral 2 cm, intrathyroidal, node-negative and nonmetastatic profile. |
| Total thyroidectomy | Extends treatment beyond the recommended initial extent for this stated profile without another supplied indication for contralateral surgery. |
| Subtotal thyroidectomy | Treats subtotal resection as an intermediate cancer operation; it is not the recommended initial operation for this profile. |

Post-answer feedback: For the stated unilateral cancer measuring 2 cm without gross extension or nodal or distant metastases, the 2025 ATA recommendation supports lobectomy as the initial operation when surgery is chosen. Bilateral cancer or other indications can change the operation. This choice follows disease extent rather than an answer-directing tissue-preservation request.

Evidence claims: `claim.dtc.extent`, `claim.dtc.lobectomy-boundary`, `claim.qq20261029.thyroid.initial-lobectomy`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `case-detail-decision-cue`: `currentUpdate` “tissue preservation”; `answerChoices.label[correct_1]` “Discuss lobectomy as an eligible option”<br>`option-absolute`: `answerChoices.label[d2_1]` “entirely”; `answerChoices.label[d2_1]` “Avoid surgical evaluation entirely”<br>`option-absolute`: `answerChoices.label[d1_1]` “every”; `answerChoices.label[d1_1]` “Mandate total thyroidectomy for every DTC”

Canonical lint after: `option-length-disparity`: `answerChoices.label[d1_1]` “Total thyroidectomy”; `answerChoices.label[correct_1]` “Lobectomy”


## A17 — Pheochromocytoma exclusion before adrenal biopsy

Case `case.adrenal-incidentaloma.renal-cancer-mass`; node `node.adrenal-incidentaloma.renal-cancer-mass.1`; stable concept `concept.adrenal-incidentaloma.pheochromocytoma-before-biopsy`. Facility entry 2; educational tier 1. Current content version `question-authoring.2026-10-28.v2`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName} is a 58-year-old woman who has treated renal cell carcinoma and a solitary adrenal mass measuring 28 HU. Cortisol screening is normal, and tissue confirmation would change management. | {patientName}, a 58-year-old woman, visits the clinic after treatment for renal cell carcinoma. Imaging shows a solitary adrenal mass measuring 28 HU. The oncology team is considering biopsy because tissue confirmation would change management. |
| Current update | — | — |
| Task | Which test must precede {patientName}'s adrenal biopsy? | Which test should be completed before {patientName}'s adrenal biopsy? |
| Options | **KEY:** Plasma-free metanephrines (`metanephrines_3`)<br>Overnight dexamethasone test (`dst_3`)<br>Aldosterone-renin ratio (`aldosterone_3`)<br>CT-guided adrenal biopsy (`biopsy_3`) | **KEY:** Plasma free metanephrines (`metanephrines_3`)<br>Overnight dexamethasone suppression (`dst_3`)<br>Plasma aldosterone-renin ratio (`aldosterone_3`) |
| Exhibit | — | — |

Inference: Distinguish the biopsy-specific endocrine safety problem from other legitimate adrenal studies.

Review focus: Retains the original illustrative 28 HU and clinical meaning. Removing the normal cortisol result keeps a real endocrine distractor alive.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Plasma free metanephrines | Evaluates the catecholamine-related hazard before the planned invasive sampling. |
| Overnight dexamethasone suppression | Selects cortisol assessment from the adrenal hormonal workup rather than evaluating catecholamine secretion. |
| Plasma aldosterone-renin ratio | Selects a mineralocorticoid workup from a different adrenal decision pathway. |

Post-answer feedback: Pheochromocytoma must be assessed before a biopsy of an indeterminate adrenal mass when tissue would change management. Plasma free metanephrines address that risk; urinary fractionated metanephrines are another accepted approach, but are not offered here. Cortisol or aldosterone evaluation answers different questions.

Evidence claims: `claim.brief.adrenal-incidentaloma.pheochromocytoma-before-biopsy`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `heterogeneous-option-category`: `answerChoices.label[metanephrines_3]` “Plasma-free metanephrines”; `answerChoices.label[dst_3]` “Overnight dexamethasone test”; `answerChoices.label[aldosterone_3]` “Aldosterone-renin ratio”; `answerChoices.label[biopsy_3]` “CT-guided adrenal biopsy”

Canonical lint after: No lexical findings; this does not establish clinical validity.


## A22 — Select Fisher exact test

Case `case.gs028se.fisher-exact-study-design.a-tiny-pilot`; node `node.gs028se.fisher-exact-study-design.a-tiny-pilot.1`; stable concept `concept.statistics-ethics.fisher-exact`. Facility entry 2; educational tier 1. Current content version `question-authoring.2026-10-28.v2`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, the colorectal discussion lead, reviews a new fixation technique for rectal prolapse. A small pilot records recurrence within two years in separate groups. The supplier calls the pilot extensive; its sales delegation is larger than the study population. The report contains the observed two-by-two table and the expected-count assessment requested for the recurrence comparison. | {patientName}, the colorectal discussion lead, reviews a fictional pilot comparing recurrence after two approaches to rectal prolapse. Separate unmatched groups are assessed once at two years. The exhibit contains the observed patient counts; it does not report an efficacy conclusion. |
| Current update | — | — |
| Task | Which analysis best compares two-year recurrence between the separate groups, using the sparse table and assumptions in the exhibit? | Which statistical test is most appropriate for comparing recurrence between the study groups? |
| Options | **KEY:** Fisher exact test (`correct_tiny-pilot`)<br>Chi-square test of independence (`d1_tiny-pilot`)<br>Independent-samples t test (`d2_tiny-pilot`)<br>Wilcoxon rank-sum test (`d3_tiny-pilot`) | **KEY:** Fisher exact test (`correct_tiny-pilot`)<br>Pearson chi-square test (`d1_tiny-pilot`)<br>McNemar test (`d2_tiny-pilot`) |
| Exhibit | {"kind":"table","caption":"Unnamed investigational prolapse fixation technique: invented practice counts by group and two-year recurrence. Cells count people once, unmatched. Expected counts are sparse; the large-sample approximation is unreliable.","columnHeaders":["Recurrence","No recurrence"],"rowHeaders":["New study intervention","Study comparator"],"cells":[["0","7"],["3","4"]]} | {"kind":"table","caption":"Fictional practice data: recurrence status at two years, one observation per person in separate unmatched groups.","columnHeaders":["Recurrence","No recurrence"],"rowHeaders":["Study intervention","Study comparator"],"cells":[["0","7"],["3","4"]]} |

Inference: Derive the sparse expected-count issue and distinguish independent from paired binary data without a supplied reliability conclusion.

Review focus: Employee discussion, not a patient encounter. Counts and two-year endpoint are retained fictional exercise data, not clinical thresholds or efficacy evidence.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Fisher exact test | Interprets the small observed categorical table and the inadequacy of the usual large-sample approximation. |
| Pearson chi-square test | Recognizes independent categorical groups but overlooks the sparse expected-count problem. |
| McNemar test | Recognizes a binary outcome but mistakes the two independent groups for paired observations. |

Post-answer feedback: Fisher exact testing fits this small two-by-two table from independent groups. Expected counts derived from the observed margins are too sparse for the usual Pearson approximation in this exercise. McNemar testing would require paired binary observations. The invented counts do not establish clinical efficacy.

Evidence claims: `claim.gs028se.statistics.fisher-exact`, `claim.gs028se.statistics.chi-square`, `claim.gs028se.statistics.fisher-exact.mcnemar-boundary`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: No lexical findings; this does not establish clinical validity.

Canonical lint after: No lexical findings; this does not establish clinical validity.


## A23 — Distinguish risk ratio and odds ratio

Case `case.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical`; node `node.gs028se.predictive-value-prevalence-risk-ratio-odds-ratio.b-rare-not-identical.1`; stable concept `concept.statistics-ethics.risk-ratio-odds-ratio`. Facility entry 2; educational tier 1. Current content version `question-authoring.2026-10-28.v2`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, the bariatric journal-club lead, reviews a new protective agent for marginal ulcer after gastric bypass. The observational report labels its estimate as an exposure odds ratio for rare ulcer recurrence. The editor requests a more exciting conclusion while retaining 'strictly factual.' Underlying group risks are unavailable, and the investigators discuss approximate similarity to a risk ratio. | {patientName}, the bariatric journal-club lead, reviews a fictional study of ulcer recurrence after gastric bypass. |
| Current update | — | — |
| Task | Which interpretation preserves the reported measure when an exposure odds ratio for rare ulcer recurrence is discussed as approximately similar to a risk ratio? | Which measure is calculated by the expression in this ulcer-recurrence report? |
| Options | **KEY:** Report the estimate as an odds ratio (`correct_rare-not-identical`)<br>Report the estimate as a relative risk (`d1_rare-not-identical`)<br>Report the estimate as a relative risk reduction (`d2_rare-not-identical`)<br>Report the estimate as an absolute risk difference (`d3_rare-not-identical`) | **KEY:** Odds ratio (`correct_rare-not-identical`)<br>Risk ratio (`d1_rare-not-identical`)<br>Risk difference (`d3_rare-not-identical`) |
| Exhibit | {"kind":"abstract","title":"Ulcer recurrence — illustrative study","body":"An invented study of an unnamed investigational marginal-ulcer protective agent reports an exposure odds ratio for rare one-year ulcer recurrence. Authors discuss approximate similarity to a risk ratio, but underlying group risks are unavailable. These practice conditions supply no real efficacy or clinical risk estimate."} | {"kind":"abstract","title":"Fictional comparison expression","body":"Let p_E denote recurrence probability in the exposed group and p_C recurrence probability in the comparator group. The reported expression is [p_E / (1 - p_E)] / [p_C / (1 - p_C)]."} |

Inference: Identify the measure from its probability expression without its name appearing in the pre-answer text.

Review focus: Keeps the naming/interpretation objective; does not introduce adjusted logistic-model interpretation. Removes the unrelated H. pylori treatment mapping from this revision only.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Odds ratio | Recognizes the ratio of two odds, rather than a direct comparison of probabilities. |
| Risk ratio | Treats division of odds as though it were division of the probabilities themselves. |
| Risk difference | Confuses a relative comparison with subtraction of the two probabilities. |

Post-answer feedback: Each p/(1-p) term is an odds. Dividing the two terms produces an odds ratio. A risk ratio divides the probabilities themselves, and a risk difference subtracts them. Similarity in selected settings does not make these measures interchangeable.

Evidence claims: `claim.gs028se.statistics.risk-ratio-odds-ratio`, `claim.qq20261028.statistics.odds-scale`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `key-only-phrase-overlap`: `presentation` “odds ratio”; `answerChoices.label[correct_rare-not-identical]` “odds ratio”<br>`key-only-phrase-overlap`: `exhibit.body` “odds ratio”; `answerChoices.label[correct_rare-not-identical]` “odds ratio”<br>`key-only-phrase-overlap`: `stem` “odds ratio”; `answerChoices.label[correct_rare-not-identical]` “odds ratio”<br>`key-only-word-overlap`: `presentation` “ratio”; `answerChoices.label[correct_rare-not-identical]` “ratio”<br>`key-only-word-overlap`: `exhibit.body` “ratio”; `answerChoices.label[correct_rare-not-identical]` “ratio”<br>`key-only-word-overlap`: `stem` “ratio”; `answerChoices.label[correct_rare-not-identical]` “ratio”<br>`near-duplicate-options`: `answerChoices.label[d1_rare-not-identical]` “Report the estimate as a relative risk”; `answerChoices.label[d2_rare-not-identical]` “Report the estimate as a relative risk reduction”<br>`option-absolute`: `answerChoices.label[d3_rare-not-identical]` “absolute”; `answerChoices.label[d3_rare-not-identical]` “Report the estimate as an absolute risk difference”

Canonical lint after: No lexical findings; this does not establish clinical validity.


## A25 — Perioperative ART continuity

Case `case.gs028g.hiv-perioperative.paired-routine-elective`; node `node.gs028g.hiv-perioperative.paired-routine-elective.1`; stable concept `concept.gs028g.hiv-perioperative.art-continuity`. Facility entry 3; educational tier 1. Current content version `question-authoring.2026-10-29.v3`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, a 43-year-old woman, is planning an elective hernia repair at an outside surgical service. HIV is well controlled, and the anesthesia team confirms the prescribed ART can be taken around the procedure. | {patientName}, a 43-year-old woman, visits the clinic before elective hernia repair at an outside surgical service. The clinic medication list records a ritonavir-boosted antiretroviral regimen being taken as prescribed. A generic preoperative instruction sheet includes these medicines among those to pause for the operation. |
| Current update | — | — |
| Task | Which ART plan is appropriate when the prescribed regimen can be continued perioperatively? | Which perioperative antiretroviral plan should be sent to {patientName}'s surgical team? |
| Options | **KEY:** Continue ART with the perioperative team (`correct_1`)<br>Withhold ART during surgical recovery (`d1_1`)<br>Use a single-drug ART formulary substitute (`d2_1`)<br>Continue the unboosted ART components (`d3_1`) | **KEY:** Continue the complete prescribed regimen (`correct_1`)<br>Interrupt the complete prescribed regimen (`d1_1`)<br>Withhold ritonavir and maintain the other agents (`d3_1`) |
| Exhibit | — | — |

Inference: Reconcile a generic stop instruction with regimen continuity, while recognizing that deleting a booster is a different error rather than a safe compromise.

Review focus: Confirm feasible administration and clinical plausibility of the instruction conflict without adding an unsupported fasting or drug-dosing rule. The companion separately tests a specific drug interaction; no new concept objective is intended.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Continue the complete prescribed regimen | Reconciles the generic withholding instruction with the need to avoid an unnecessary interruption of a feasible prescribed regimen. |
| Interrupt the complete prescribed regimen | Applies a generic perioperative withholding instruction to ART without medication-specific review. |
| Withhold ritonavir and maintain the other agents | Attempts to reduce interaction concerns by removing ritonavir and continuing an incomplete regimen without coordinated review. |

Post-answer feedback: Generic preoperative instructions require medication-specific reconciliation. Avoid an unnecessary ART interruption when treatment can be administered, and coordinate the plan with the perioperative and HIV teams. Interaction concerns require review of the proposed drugs; they do not justify an uncoordinated partial regimen.

Evidence claims: `claim.gs028g.hiv-perioperative.art-continuity`, `claim.gs028g.hiv-perioperative.art-continuity.fact2`, `claim.gs028g.hiv-perioperative.art-continuity.fact3`, `claim.gs028g.hiv-perioperative.art-continuity.fact4`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `key-only-word-overlap`: `presentation` “team”; `answerChoices.label[correct_1]` “team”

Canonical lint after: No lexical findings; this does not establish clinical validity.


## A27 — Insufflation CO2 absorption

Case `case.gs028g.laparoscopy-respiratory.paired-ventilation-load`; node `node.gs028g.laparoscopy-respiratory.paired-ventilation-load.1`; stable concept `concept.gs028g.laparoscopy-respiratory.co2-absorption`. Facility entry 3; educational tier 1. Current content version `question-authoring.2026-10-28.v2`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, a 43-year-old woman, asks about an outside anesthetic explanation that ventilation requirements can rise after abdominal CO2 insufflation even when the breathing circuit is functioning normally. The explanation concerns an otherwise evaluated uncomplicated course without hyperthermia or airway obstruction. | {patientName}, a 43-year-old woman, visits the clinic after a completed laparoscopic procedure. The anesthetic record shows that end-tidal CO2 rose gradually after abdominal insufflation while delivered minute ventilation stayed steady. The inspiratory CO2 tracing returned to zero on each breath, and body temperature stayed steady. |
| Current update | — | — |
| Task | What physiologic process adds a CO2 load during laparoscopic insufflation? | Which mechanism best explains the recorded end-tidal CO2 change? |
| Options | **KEY:** Absorption of CO2 from the insufflated cavity (`correct_2`)<br>Circuit rebreathing of exhaled CO2 (`d1_2`)<br>Increased metabolic CO2 from hyperthermia (`d2_2`)<br>Reduced alveolar ventilation from tube obstruction (`d3_2`) | **KEY:** Absorption from the insufflated cavity (`correct_2`)<br>Rebreathing from the anesthetic circuit (`d1_2`)<br>Production from increased metabolic activity (`d2_2`) |
| Exhibit | — | — |

Inference: Interpret recorded observations instead of accepting labels that the circuit, airway and metabolic course are normal.

Review focus: Requires clinician review of the raw capnography observation and its competing interpretation. One ventilation review supports absorption; a separate capnography source supports the tracing interpretation.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Absorption from the insufflated cavity | Connects insufflation with a new systemic CO2 load requiring ventilatory clearance. |
| Rebreathing from the anesthetic circuit | Interprets elevated expired CO2 as inspired-gas contamination despite the supplied inspiratory tracing. |
| Production from increased metabolic activity | Attributes the change to endogenous production rather than the insufflated gas and temporal pattern. |

Post-answer feedback: CO2 from the insufflated cavity can be absorbed and add to the systemic load requiring ventilation. The temporal pattern and recorded observations favor that mechanism here. An unexpected or acute perioperative deterioration still requires assessment rather than automatic attribution to insufflation.

Evidence claims: `claim.gs028g.laparoscopy-respiratory.co2-absorption`, `claim.gs028g.laparoscopy-respiratory.co2-absorption.fact2`, `claim.gs028g.laparoscopy-respiratory.co2-absorption.fact3`, `claim.qq20261028.capnography.rebreathing-baseline`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `negative-aligned-to-distractor`: `presentation` “without hyperthermia or airway obstruction”; `presentation` “obstruction”; `answerChoices.label[d3_2]` “obstruction”<br>`negative-aligned-to-distractor`: `presentation` “without hyperthermia or airway obstruction”; `presentation` “hyperthermia”; `answerChoices.label[d2_2]` “hyperthermia”

Canonical lint after: No lexical findings; this does not establish clinical validity.


## A28 — Cutaneous neuroendocrine carcinoma recognition

Case `case.gs028g.merkel-cell.paired-skin-panel`; node `node.gs028g.merkel-cell.paired-skin-panel.1`; stable concept `concept.gs028g.merkel-cell.integrated-diagnosis`. Facility entry 3; educational tier 1. Current content version `question-authoring.2026-10-28.v2`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, a 43-year-old woman, brings completed pathology from a growing forearm skin nodule. It shows a dermal small-cell malignancy with epithelial and neuroendocrine differentiation and cytokeratin-20 expression; the integrated workup excludes melanoma, lymphoma and a metastatic pulmonary primary. | {patientName}, a 43-year-old woman, visits the clinic with pathology from a growing forearm skin nodule. The biopsy shows small malignant cells in the dermis. The panel records CK20 with paranuclear dot-like staining, synaptophysin positivity and TTF1 negativity. |
| Current update | — | — |
| Task | Which diagnosis best fits this integrated primary cutaneous neuroendocrine pathology assessment? | Which diagnosis is best supported by this skin biopsy? |
| Options | **KEY:** Merkel cell carcinoma (`correct_1`)<br>Cutaneous squamous cell carcinoma (`d1_1`)<br>Primary cutaneous malignant melanoma (`d2_1`)<br>Primary cutaneous lymphoid lymphoma (`d3_1`) | **KEY:** Merkel cell carcinoma (`correct_1`)<br>Metastatic pulmonary small-cell carcinoma (`d1_1`)<br>Primary cutaneous malignant melanoma (`d2_1`)<br>Primary cutaneous malignant lymphoma (`d3_1`) |
| Exhibit | — | — |

Inference: Integrate raw morphology and immunostains rather than repeat an integrated primary-cutaneous-neuroendocrine label or an exclusion list.

Review focus: New panel claims use Harms et al. and ESMO sources, not NCI PDQ alone. Confirm panel sufficiency and close differential; no prevalence inference from the editorial patient age.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Merkel cell carcinoma | Integrates skin location, morphology and the panel; no single stain alone establishes the diagnosis. |
| Metastatic pulmonary small-cell carcinoma | Shares small-cell neuroendocrine morphology, making the pattern across CK20 and TTF1 important rather than the word small-cell alone. |
| Primary cutaneous malignant melanoma | A malignant skin nodule remains plausible initially, but the combined epithelial/neuroendocrine staining favors another lineage. |
| Primary cutaneous malignant lymphoma | Small dermal malignant cells can suggest a lymphoid process before the integrated immunophenotype is considered. |

Post-answer feedback: The morphology and combined CK20, synaptophysin and TTF1 pattern favor Merkel cell carcinoma among these options. Staining patterns have exceptions; no single marker definitively excludes pulmonary small-cell carcinoma or establishes Merkel cell carcinoma. Integrate the panel with the clinical and pathologic assessment.

Evidence claims: `claim.gs028g.merkel-cell.integrated-diagnosis`, `claim.qq20261028.merkel.panel-pattern`, `claim.qq20261028.merkel.panel-exceptions`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: `negative-aligned-to-distractor`: `presentation` “excludes melanoma, lymphoma and a metastatic pulmonary primary”; `presentation` “melanoma”; `answerChoices.label[d2_1]` “melanoma”<br>`negative-aligned-to-distractor`: `presentation` “excludes melanoma, lymphoma and a metastatic pulmonary primary”; `presentation` “lymphoma”; `answerChoices.label[d3_1]` “lymphoma”

Canonical lint after: No lexical findings; this does not establish clinical validity.


## A30 — Correct the leaking ostomy seal

Case `case.gs028g.peristomal-skin.paired-wide-opening`; node `node.gs028g.peristomal-skin.paired-wide-opening.2`; stable concept `concept.gs028g.peristomal-skin.restore-seal`. Facility entry 3; educational tier 1. Current content version `question-authoring.2026-10-29.v3`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | {patientName}, a 43-year-old woman, has an ileostomy with moist, burning erosions exactly where effluent reaches exposed skin through an oversized appliance opening. The stoma is viable, and there is no spreading redness or purulence. | {patientName}, a 43-year-old woman, visits the clinic with recurrent burning around an ileostomy. Examination shows a moist red ring immediately beside the stoma, with intact skin farther out under the adhesive. The stoma is viable, and the patient feels well. |
| Current update | The stoma remains viable with no infection findings. The nurse identifies excessive exposed skin inside the pouch opening. | The removed barrier shows moisture around its inner edge, although the outer adhesive border remains attached. |
| Task | What is the best initial care plan for noninfectious dermatitis caused by this oversized pouch opening? | Which next step is most appropriate for {patientName}'s recurrent peristomal skin injury? |
| Options | **KEY:** Refit the seal with ostomy-nurse guidance (`correct_1`)<br>Start systemic antibiotic treatment (`d1_1`)<br>Start topical antifungal treatment (`d2_1`)<br>Enlarge the cutout around the irritated skin (`d3_1`) | **KEY:** Reassess pouch fit with the ostomy nurse (`correct_1`)<br>Switch to a different adhesive brand (`d1_1`)<br>Start topical antifungal treatment (`d2_1`)<br>Schedule more frequent routine pouch changes (`d3_1`) |
| Exhibit | — | — |

Inference: Infer a recurrent appliance-contact problem from the skin distribution and removed-barrier observations, then choose fit assessment rather than an empiric product or interval change.

Review focus: Confirm a single best next step. The observations support assessment/refitting but do not establish an exact cutout defect, product choice or wear interval. Prior diagnosis feedback remains legitimate scaffolding.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Reassess pouch fit with the ostomy nurse | Uses the distribution and removed-appliance observations to prioritize assessment of the seal and fit before prescribing a particular product or opening dimension. |
| Switch to a different adhesive brand | Treats the complaint as an adhesive-product problem without first explaining the observed distribution and inner-edge moisture. |
| Start topical antifungal treatment | Treats a competing rash mechanism before assessing the appliance and the source of the recurrent contact injury. |
| Schedule more frequent routine pouch changes | May form part of an individualized plan, but selecting a new routine interval alone does not assess why this appliance repeatedly fails at the affected skin. |

Post-answer feedback: The observed skin distribution and moisture on the removed barrier warrant ostomy-nurse assessment of pouch fit and seal. Findings should guide refitting and compatible skin care. Wear time, product intolerance and coexisting infection may also need review; these observations do not prove a particular opening size or exclude every alternative.

Evidence claims: `claim.gs028g.peristomal-skin.restore-seal`, `claim.gs028g.peristomal-skin.restore-seal.fact2`, `claim.gs028g.peristomal-skin.restore-seal.fact3`, `claim.gs028g.peristomal-skin.restore-seal.fact4`, `claim.qq20261028.peristomal.fit-exposure`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: No lexical findings; this does not establish clinical validity.

Canonical lint after: No lexical findings; this does not establish clinical validity.


## A38 — Observe uncomplicated childhood neck nodes

Case `case.pediatric-clinic.shrinking-mobile-neck-nodes`; node `node.pediatric-clinic.shrinking-mobile-neck-nodes.1`; stable concept `concept.pediatric-clinic.reactive-neck-node-observation`. Facility entry 4; educational tier 0. Current content version `question-authoring.2026-10-28.v2`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | Ethan Brooks, a 12-year-old boy, visits the clinic with his father, Paul Brooks, who remains in the same room throughout the visit. Ethan's father can still feel small neck nodes after Ethan recovered from a respiratory illness. The nodes have become less noticeable. Ethan feels well, and the nodes are mobile without skin change or supraclavicular enlargement. There is no node growth, unexplained fever, weight loss or night sweating. | Ethan Brooks, a 12-year-old boy, visits the clinic with his father, Paul Brooks, who remains in the same room throughout the visit. His father feels small neck nodes after a respiratory illness; they have become less noticeable. Ethan is active and feels well. The nodes are mobile and confined to the cervical region. He has no unexplained fever or weight loss. |
| Current update | — | — |
| Task | What is the most appropriate clinic plan for Ethan Brooks's improving cervical-node findings? | What is the most appropriate clinic plan for Ethan Brooks's cervical nodes? |
| Options | **KEY:** Continue observation with a reassessment plan (`choice.shrinking-mobile-neck-nodes.observe`)<br>Arrange urgent pediatric oncology assessment (`choice.shrinking-mobile-neck-nodes.urgent-referral`)<br>Arrange routine pediatric ENT assessment (`choice.shrinking-mobile-neck-nodes.routine-ent`)<br>End follow-up without reassessment instructions (`choice.shrinking-mobile-neck-nodes.discharge`) | **KEY:** Observe with return advice and reassessment (`choice.shrinking-mobile-neck-nodes.observe`)<br>Arrange routine pediatric ENT clinic assessment (`choice.shrinking-mobile-neck-nodes.routine-ent`)<br>Arrange prompt pediatric oncology clinic assessment (`choice.shrinking-mobile-neck-nodes.urgent-referral`) |
| Exhibit | — | — |

Inference: Weight trajectory and overall condition while preserving decision-critical safety information instead of a long checklist excluding every concern.

Review focus: One local pediatric referral guide; verify safety-critical negatives and that prompt oncology remains a credible competing error rather than filler. No follow-up interval or size cutoff invented.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Observe with return advice and reassessment | Uses the improving post-illness course in a well child while retaining a safety net. |
| Arrange routine pediatric ENT clinic assessment | Overweights persistence of palpable nodes while underweighting their improving course and the child's condition. |
| Arrange prompt pediatric oncology clinic assessment | Treats palpable cervical nodes as a malignancy pathway despite the low-concern course provided. |

Post-answer feedback: An improving course of small mobile cervical nodes in a well child supports initial observation with reassessment and return advice. Enlargement, new systemic symptoms or other concerning changes should prompt reassessment. Retain safety-netting rather than treating observation as dismissal.

Evidence claims: `claim.pediatric-clinic.reactive-child-neck-nodes`, `claim.pediatric-clinic.well-child-node-observation`, `claim.pediatric-clinic.node-change-safety-net`, `claim.pediatric-clinic.supraclavicular-node-red-flag`, `claim.pediatric-clinic.unexplained-node-associated-fever`, `claim.pediatric-clinic.unexplained-node-associated-weight-loss`, `claim.pediatric-clinic.unexplained-node-associated-night-sweats`, `claim.pediatric-clinic.concerning-node-pediatric-review`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: No lexical findings; this does not establish clinical validity.

Canonical lint after: No lexical findings; this does not establish clinical validity.


## A40 — Recognize primary midline hernia

Case `case.pediatric-clinic.upper-midline-lump`; node `node.pediatric-clinic.upper-midline-lump.1`; stable concept `concept.umbilical-epigastric-hernia.clinical-recognition`. Facility entry 4; educational tier 0. Current content version `question-authoring.2026-10-29.v3`. **Draft; needs_clinician_review. Key shown first for review only.**

| Field | Original project-owned source | Current draft |
|---|---|---|
| Presentation | Ella Morgan, a 6-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline, above the navel. Examination identifies a small abdominal-wall gap with protruding fat at that site. The navel and groins have no bulge. Ella is comfortable and has no vomiting. | Ella Morgan, a 6-year-old girl, visits the clinic with her mother, Rachel Morgan, who remains in the same room throughout the visit. Her mother points out a small focal lump in Ella's upper abdominal midline. Examination identifies a small abdominal-wall gap with protruding fat at that site, above the navel. Her previous abdominal operation used a right-lower-quadrant incision. Ella is comfortable. |
| Current update | — | — |
| Task | Which diagnosis best explains Ella Morgan's focal upper-midline abdominal-wall defect? | Which diagnosis best explains Ella Morgan's abdominal-wall lump? |
| Options | **KEY:** Epigastric hernia (`choice.upper-midline-lump.epigastric`)<br>Umbilical hernia (`choice.upper-midline-lump.umbilical`)<br>Inguinal canal hernia (`choice.upper-midline-lump.inguinal`)<br>Femoral canal hernia (`choice.upper-midline-lump.femoral`) | **KEY:** Epigastric hernia (`choice.upper-midline-lump.epigastric`)<br>Spigelian hernia (`choice.upper-midline-lump.spigelian`)<br>Incisional hernia (`choice.upper-midline-lump.incisional`)<br>Lumbar hernia (`choice.upper-midline-lump.lumbar`) |
| Exhibit | — | — |

Inference: Localize the defect and relate it to the operative history among competing abdominal-wall hernias.

Review focus: Still an anatomical-recognition task, with stronger same-category competitors. Confirm pediatric plausibility. Morgagni is diaphragmatic and is excluded from this abdominal-wall option set; no new diagnosis or concept meaning is intended.

| Current choice (key shown first for review only) | Why it tempts / deciding inference |
|---|---|
| **KEY:** Epigastric hernia | Uses the focal upper-midline fat-containing wall defect; the previous incision is at a different site. |
| Spigelian hernia | Confuses a lateral abdominal-wall defect near the semilunar line with the observed midline defect. |
| Incisional hernia | Overweights the operative history without matching the current defect to the prior incision. |
| Lumbar hernia | Confuses a posterior or flank wall defect with the anterior upper-midline finding. |

Post-answer feedback: The focal upper-midline fat-containing defect supports epigastric hernia. Spigelian and lumbar defects occupy different abdominal-wall regions; an incisional hernia is related to an operative incision, which is elsewhere in this record. All offered diagnoses are abdominal-wall hernias.

Evidence claims: `claim.pediatric-clinic.epigastric-fat-defect`, `claim.qq20261029.hernia.spigelian`, `claim.qq20261029.hernia.incisional`, `claim.qq20261029.hernia.lumbar`. Original records remain unchanged; new distinctions have explicit claim/source mappings. No new exact clinical thresholds or fictional probabilities are introduced; A11's existing 2 cm observation is retained and its bounded recommendation is directly sourced.

Canonical lint before: No lexical findings; this does not establish clinical validity.

Canonical lint after: No lexical findings; this does not establish clinical validity.

## Companion and history review

| Companion | Owner round-one variant | Current variant | Context disposition |
|---|---|---|---|
| A06-context | question.pathologic-nipple-discharge.diagnostic-imaging.v1.r3 | question.pathologic-nipple-discharge.diagnostic-imaging.v1.r4 | Versioned the companion because its shared presentation changed; removed the redundant request-for-evaluation wording. |
| A25-context | question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r3 | question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r4 | Versioned the companion for the shared medication-reconciliation context; its interaction decision is unchanged. |
| A27-context | question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2.r3 | question.gs028g.laparoscopy-respiratory.diaphragm-compliance.v2.r3 | Unchanged this owner round; still needs clinician review. |
| A28-context | question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r3 | question.gs028g.merkel-cell.clinically-negative-node-staging.v1.r3 | Unchanged this owner round; still needs clinician review. |
| A30-context | question.gs028g.peristomal-skin.effluent-irritation.v1.r3 | question.gs028g.peristomal-skin.effluent-irritation.v1.r4 | Versioned the companion because the shared presentation now contains raw morphology rather than a supplied effluent-contact explanation. |

Review the complete visible sequence, including prior feedback and result gates. A06/A25/A30 companions are scaffolded by earlier decisions; do not claim independent difficult reasoning for every step. A08 remains foundational. A40 now tests anatomical localization among stronger same-category choices; adding rarer names alone does not establish resident difficulty. A27 companion's balanced four-combination mechanics set retains equal term frequencies; its convergence warning has no unique key-frequency advantage.

## Case-detail deletion review and acceptance

The owner's new lesson is part of the standard: every case sentence needs a decision/prerequisite/required-presentation job. Delete non-decision filler; replace a sentence that paraphrases the keyed reason with supported raw observations, then independently verify one defensible key. Do not move the cue into a preference, setting statement, mechanism description or lead-in. The exact original A11 preference, A02 availability and A30 opening statements are regression fixtures for advisory case-detail lint. Lexical matches are review prompts; they cannot safely automate deletion of necessary findings.

The current pilot keeps stable concepts and frozen identities. There are 25 superseded local-draft timing identities in addition to 19 original and 19 current identities. A02/A06-companion append exact new keyed-test bindings while retaining every prior contract. A40's three new wrong-choice IDs map to the original no-terminal-outcome contracts; frozen old choices are unchanged. No reducer/save format or spatial optimization is introduced. Level 5 evidence remains untouched and needs a later manager rebind. See the handoff for exact current failures and bound inputs.

Named clinician review must confirm each key/distractor ranking, profiles, clinical equivalence and source limitations. New sources include one organization for the ATA recommendation, adult-focused hernia anatomy without pediatric management extrapolation, and a current open discharge review. Morgagni's compartment is a review-only factual check with restrictive source rights recorded. Clinical approval and owner acceptance remain separate. No correctness/exposure analytics, saved-history mining, network gameplay retrieval or external publication occurs.

