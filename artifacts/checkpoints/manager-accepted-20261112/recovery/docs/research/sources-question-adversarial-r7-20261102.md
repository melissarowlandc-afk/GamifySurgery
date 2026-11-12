# Sources and atomic-claim mappings for the final authoring round

Recorded 2026-11-03. No network access, new article retrieval, source-text storage or source-prose copying occurred. All medical publications below were previously verified in this thread. Original access dates, citation metadata, authority and rights limitations are retained. A new mapping ID is not another independent publication.

The eleven rewritten versions map 35 existing/new atomic claims to 50 source records. Two new limited application claims reuse three fully recorded primary sources; all new clinical records remain needs_clinician_review. The remaining 62 PASS versions retain their earlier source ledgers and exact clinical records.

The B18 1.8-mm value is retained from the same case's existing completed-primary record, and 0.6 mm from its prior partial-report draft. Their new cross-specimen placement is constructed and needs dermatopathology review. Neither is a treatment threshold. The actual greater-than-1-mm discussion boundary uses the pre-existing nodal-staging claim and its verified guideline/independent source. No new probability, dose, elapsed-time rule or demographic weight is authored.

The B19 claim is a technical application of current MRI characterization guidance to different acquisition settings. One adequate medical primary consensus source is recorded; there was no new independent verification of the exact sequence pair. It requires MSK radiology confirmation. The QI table is visibly constructed, uses the same ten simulated visit records per workflow and establishes neither causal benefit nor a rollout gate.

## Atomic claims

### claim.achalasia.high-resolution-manometry

High-resolution esophageal manometry is the confirmatory physiologic test when achalasia is suspected after structural obstruction and concerning pseudoachalasia have been appropriately excluded.

- Supporting source IDs: source.sc.seoul-achalasia-2020
- Evidence category / certainty: evaluation / moderate
- Limitation: The accepted guideline rates diagnostic evidence as low despite strong consensus. This claim does not prescribe subtype thresholds or a treatment algorithm.
- Last checked / clinical status: 2026-09-10 / needs_clinician_review

### claim.bread-butter.inguinal-hernia.watchful-waiting

Watchful waiting is a safe option for informed men with asymptomatic or minimally symptomatic reducible inguinal hernias, although later repair is common when symptoms develop.

- Supporting source IDs: source.bread-butter.herniasurge-2018, source.bread-butter.herniasurge-update-2023
- Evidence category / certainty: management / high
- Limitation: This does not apply to women, femoral hernias, activity-limiting symptoms, irreducibility, obstruction, or strangulation.
- Last checked / clinical status: 2026-09-17 / needs_clinician_review

### claim.gastric-malt.integrated-pathologic-recognition

Gastric MALT lymphoma is recognized by an integrated pathologic pattern that includes a small B-cell infiltrate with gland-infiltrating lymphoepithelial lesions and a compatible immunophenotype, commonly CD20 positive with CD5, CD10, and cyclin D1 absent.

- Supporting source IDs: source.hu-gastric-malt-diagnosis-management.2016, source.matysiak-budnik-gastric-malt-management.2023
- Evidence category / certainty: evaluation / high
- Limitation: CD20 establishes B-cell lineage but is not specific for MALT lymphoma. Diagnosis requires integrated morphology and immunophenotyping, with additional evaluation when a limited biopsy is equivocal.
- Last checked / clinical status: 2026-08-06 / clinically_approved

### claim.gs028se.statistics.pdsa-act

After studying a small quality-improvement test, the team uses its findings to adopt, adapt, or abandon the change and links that decision to a next cycle.

- Supporting source IDs: source.ahrq.pdca.2026
- Evidence category / certainty: evaluation / moderate
- Limitation: The fictional cycles do not establish patient-treatment effectiveness or replace research oversight when an activity is research.
- Last checked / clinical status: 2026-09-29 / needs_clinician_review

### claim.inguinal-hernia.symptomatic-elective-repair

For a patient with a confirmed reducible inguinal hernia and meaningful activity-limiting symptoms, elective repair discussion and planning are appropriate.

- Supporting source IDs: source.sc.herniasurge-2018, source.sc.niddk-inguinal-hernia
- Evidence category / certainty: management / moderate
- Limitation: This does not select a repair technique, mesh, or timing protocol, and does not treat watchful waiting as the default for the symptomatic profiles used here. NIDDK cites HerniaSurge as underlying evidence.
- Last checked / clinical status: 2026-09-10 / needs_clinician_review

### claim.pigmented-skin-lesion.complete-diagnostic-biopsy

A small accessible pigmented lesion concerning for melanoma should usually undergo complete diagnostic excision with narrow clinical margins and sufficient depth for histologic microstaging.

- Supporting source IDs: source.sc.nci-melanoma-pdq-2025, source.sc.aad-melanoma-highlights
- Evidence category / certainty: evaluation / moderate
- Limitation: Partial biopsy can be appropriate for selected large or anatomically difficult lesions, and this claim does not prohibit every properly performed deep saucerization technique or define an exact diagnostic margin.
- Last checked / clinical status: 2026-09-10 / needs_clinician_review

### claim.qq20261102a.esophageal-physiology-sequence

High-resolution manometry supplies esophageal motor classification when persistent obstructive swallowing symptoms remain after structural evaluation.

- Supporting source IDs: source.qq20261102a.chicago, source.qq20261102a.seoul
- Evidence category / certainty: evaluation / moderate
- Limitation: FLIP can complement inconclusive studies or be used in selected circumstances; it is not declared useless. No later pressure result is used to justify the earlier task.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102a.gastric-lineage-not-classification

CD20 establishes B-cell lineage but is insufficient without representative morphology and ancillary assessment to classify gastric MALT lymphoma.

- Supporting source IDs: source.qq20261102a.bsh-mzl, source.qq20261102a.malt2023
- Evidence category / certainty: evaluation / moderate
- Limitation: Repeat representative biopsies are warranted for the constructed crushed, architecture-poor sample. Clonality alone can occur in reactive inflammation and does not resolve every lymphoma subtype.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102a.melanoma-diagnostic-sampling

When feasible, complete diagnostic removal of a suspicious melanocytic lesion supports assessment of its architecture and invasion depth.

- Supporting source IDs: source.qq20261102a.eado2024, source.qq20261102a.nci-melanoma
- Evidence category / certainty: evaluation / moderate
- Limitation: The offered tangential option is explicitly limited to papillary dermis; this does not condemn every shave or require excision in anatomically unsuitable lesions.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102a.melanoma-integrated-node-staging

Clinically node-negative invasive melanoma in the supplied greater-than-1-mm range calls for sentinel-node staging consideration; reassuring ultrasound does not replace microscopic nodal staging.

- Supporting source IDs: source.qq20261102a.eado2024, source.qq20261102a.nci-melanoma
- Evidence category / certainty: management / moderate
- Limitation: Existing synthetic thickness values are retained. No fixed metastatic probability or survival benefit asserted; subtype and patient suitability remain clinician review.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102a.pdsa-outcome-balancing-adaptation

Improvement-cycle decisions should consider whether process changes improve the intended outcome and add burden, then use the findings to plan the next test.

- Supporting source IDs: source.qq20261102a.ahrq-pdca, source.qq20261102a.ahrq-metrics
- Evidence category / certainty: management / moderate
- Limitation: B36 is a fictional process pilot, not patient trial evidence or question correctness analytics. The data favor adapting the form over rollout or training-only repetition; no universal abandon threshold taught.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102a.sarcoma-local-imaging

MRI is the preferred local characterization/staging study for a deep or indeterminate limb soft-tissue mass before planned biopsy.

- Supporting source IDs: source.qq20261102a.essr2023, source.qq20261102a.seom2024
- Evidence category / certainty: evaluation / moderate
- Limitation: CT is useful in selected circumstances; ultrasound can triage accessible lesions. The supplied prior ultrasound establishes deep extent, rather than merely a lesion beneath skin.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102a.sarcoma-viable-biopsy-target

Image-guided core sampling of a heterogeneous soft-tissue tumor should target viable tumor identified with enhancement or vascularity.

- Supporting source IDs: source.qq20261102a.essr2015-target, source.qq20261102a.seom2024
- Evidence category / certainty: evaluation / moderate
- Limitation: Exact targeting is directly supported by older primary technique guidance; current society guidance corroborates planned image-guided core biopsy. No diagnostic certainty from MRI alone, invented needle size or tract rule added.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102a.symptomatic-groin-planning

Activity-limiting symptoms from an inguinal hernia favor discussion of elective repair rather than treating the patient as an asymptomatic watchful-waiting candidate.

- Supporting source IDs: source.qq20261102a.hernia2018, source.qq20261102a.hernia2023
- Evidence category / certainty: management / moderate
- Limitation: Risk, preferences and surgical assessment remain necessary; no compulsory operation, emergency state or outcome probability asserted.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102b.gastric-clone-not-diagnosis

Clonal B-cell expansion can occur in chronic inflammation and does not establish gastric MALT lymphoma without morphologic/clinical correlation.

- Supporting source IDs: source.qq20261102b.bsh-mzl
- Evidence category / certainty: evaluation / moderate
- Limitation: Direct primary guideline caution. Preserved glands do not by themselves exclude every lymphoma; CD20 remains a lineage marker.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102b.gastric-uncertainty-repeat-biopsy

Repeat endoscopy with biopsies is recommended when gastric MALT classification remains diagnostically uncertain.

- Supporting source IDs: source.qq20261102b.bsh-mzl
- Evidence category / certainty: evaluation / moderate
- Limitation: One adequate primary guideline. Site documentation/comparative expert review is retained; no mandatory mapping grid, diagnostic probability or fixed interval is asserted.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102b.pdsa-hypothesis-not-proof

A small PDSA test uses local observations to select and evaluate a specific next change rather than establish its causal effect in advance.

- Supporting source IDs: source.qq20261102b.ahrq-pdca, source.qq20261102b.ahrq-metrics
- Evidence category / certainty: definition / moderate
- Limitation: The task-time/record-agreement table and prefill candidate are constructed hypotheses. No empirical effectiveness claim, adoption cutoff or answer analytics is introduced.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102b.sarcoma-method-and-tract

Planned sarcoma biopsy should avoid contaminating a separate unaffected compartment.

- Supporting source IDs: source.qq20261102b.essr2015, source.qq20261102b.seom2024
- Evidence category / certainty: management / moderate
- Limitation: The exact compartment rule is directly checked in older ESSR technique guidance; current SEOM corroborates tract removal/planning. Constructed rectus/adductor and triceps/biceps paths require clinician anatomy review.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102c.gastric-clonality-classification-boundary

Gastric B-cell clonality alone cannot establish a specific lymphoma without integrated morphology and clinical correlation.

- Supporting source IDs: source.qq20261102c.bsh2024, source.qq20261102c.malt-review2023
- Evidence category / certainty: evaluation / moderate
- Limitation: Neither preserved glands nor a clonal result independently resolves every case. No unique ranking of repeat endoscopy versus fusion testing is claimed.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102c.groin-symptom-attribution

A painless reducible inguinal hernia in a man may be observed while symptoms from another site receive separate evaluation.

- Supporting source IDs: source.qq20261102c.hernia2018, source.qq20261102c.hernia2023
- Evidence category / certainty: management / moderate
- Limitation: Case localization/provocation is synthetic and must be clinically reviewed; neither positive imaging nor a repair consultation guarantees resolution of separate pain.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102c.hrm-protocol-and-provocation

Adequate separated-swallow protocols and selected provocative maneuvers help determine whether manometry addresses the patient's obstructive symptoms.

- Supporting source IDs: source.qq20261102c.acg-physiology2020, source.qq20261102c.chicago
- Evidence category / certainty: evaluation / moderate
- Limitation: The technical protocol and symptom challenge need specialist review; no new quantitative threshold, fluid volume or meal recipe is authored.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102c.melanoma-incomplete-biopsy-completion

A partial skin specimen may not establish the diagnosis or maximum invasive depth of an unsampled residual lesion.

- Supporting source IDs: source.qq20261102c.esmo-melanoma2025
- Evidence category / certainty: evaluation / moderate
- Limitation: One directly retrieved current guideline supports full-thickness complete diagnostic sampling and maximum-depth/edge reporting. Exact completion technique and sequencing after a specific partial specimen remain clinical inference pending specialist review; completion is not universal when the initial specimen already suffices for planning.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102c.pdsa-source-specific-next-test

A small improvement test can compare a source-specific adaptation while retaining checks and measuring both burden and record agreement.

- Supporting source IDs: source.qq20261102c.ahrq-pdsa, source.qq20261102c.ahrq-measures
- Evidence category / certainty: definition / moderate
- Limitation: Current/prior/dispensing records and times are fictional local inputs. No empirical prefill benefit or patient/question analytics is claimed.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102c.qi-comparison-input-control

Keeping the clinical input source constant helps distinguish an entry-method change from a simultaneous record-source change in a process comparison.

- Supporting source IDs: source.qq20261102c.nist-comparison, source.qq20261102c.ahrq-pdsa, source.qq20261102c.ahrq-measures
- Evidence category / certainty: definition / moderate
- Limitation: Original application of experimental-control guidance to a constructed local PDSA comparison. Not a universal one-factor-at-a-time requirement, randomized-trial claim, guarantee of software benefit or clinical recommendation.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102c.sarcoma-enhancement-biopsy-target

Contrast-enhanced MRI can help identify viable regions within a soft-tissue mass for representative biopsy targeting.

- Supporting source IDs: source.qq20261102c.essr2023
- Evidence category / certainty: evaluation / moderate
- Limitation: Single adequate directly retrieved current primary society consensus; the exact sequence and individual target require MSK review. No contrast dose, signal cutoff or automatic benign/malignant classification is inferred.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102c.sarcoma-mri-coverage-and-target

Local MRI for suspected soft-tissue malignancy should depict the full lesion and relevant compartment relationships before biopsy planning.

- Supporting source IDs: source.qq20261102c.essr2023
- Evidence category / certainty: evaluation / moderate
- Limitation: Previously verified primary society guidance. Missing enhancement/viability information is a separate target-planning application, requiring radiologist review; no contrast dose or imaging diagnosis is inferred.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102d.hrm-rapid-drink-purpose

A rapid-drink manometry challenge assesses esophageal outflow under liquid loading rather than replacing the ordinary separated-swallow peristaltic assessment.

- Supporting source IDs: source.qq20261102d.acg2020, source.qq20261102d.chicago2021
- Evidence category / certainty: evaluation / moderate
- Limitation: Existing primary-source verification reused offline. This is a protocol-purpose distinction, not a universal preference over other corroborating studies or an invented quantitative criterion.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102d.hrm-rapid-swallow-interpretation

A rapid-swallow manometry sequence assesses inhibition and post-sequence contractile reserve; it is not interchangeable with separated baseline swallows for esophageal-body classification.

- Supporting source IDs: source.qq20261102d.acg2020, source.qq20261102d.chicago2021
- Evidence category / certainty: evaluation / moderate
- Limitation: Previously verified primary physiology guidance and classification consensus reused offline. Interpretation depends on adequate acquisition; no exact swallow count, volume, interval or pressure cutoff is introduced.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102d.hrm-solid-meal-provocation

A standardized solid-meal manometry challenge can investigate food-associated obstructive symptoms that an ordinary water-swallow series has not explained.

- Supporting source IDs: source.qq20261102d.acg2020, source.qq20261102d.chicago2021
- Evidence category / certainty: evaluation / moderate
- Limitation: Previously verified primary sources reused offline. Choice of meal and protocol needs specialist review; no recipe, diagnostic cutoff or universal test hierarchy is authored.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102e.hrm-reserve-versus-outflow

After technically adequate rapid-swallow testing, failure of the post-sequence contraction to augment baseline supports reduced contractile reserve, distinct from inhibition during the sequence and from the outflow assessment made during rapid drinking.

- Supporting source IDs: source.qq20261102e.acg2020, source.qq20261102e.chicago2021
- Evidence category / certainty: evaluation / moderate
- Limitation: Previously verified primary physiology guidance reused offline. Qualitative laboratory-referenced observations and repeatability require motility review. No numerical criterion, diagnostic subtype or cause of all symptoms is inferred from these responses alone.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102e.mapped-partial-skin-evidence

A finding in a mapped partial melanocytic specimen can remain valid at that sampled site without establishing the diagnosis or invasive status of a different unrepresented residual component.

- Supporting source IDs: source.qq20261102e.esmo2025, source.qq20261102e.nci-melanoma
- Evidence category / certainty: evaluation / moderate
- Limitation: Anatomical and clinicopathologic application of previously verified diagnostic-sampling/microstaging guidance. Original constructed cytology and specimen maps require dermatopathology review; no whole-lesion diagnosis or universal completion technique is inferred from a partial fragment.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102e.transected-depth-lower-bound

When invasive melanoma reaches the deep cut surface used as the measurement endpoint, the measured invasive depth supplies a lower bound rather than a demonstrated whole-lesion maximum.

- Supporting source IDs: source.qq20261102e.esmo2025, source.qq20261102e.nci-melanoma
- Evidence category / certainty: evaluation / moderate
- Limitation: Original measurement-bound application of previously verified full-thickness sampling and maximum-depth reporting guidance; specialist confirmation of this report wording remains necessary. The retained 0.6-mm observation is constructed patient data, not a sourced treatment threshold, and no nodal indication is derived from it.
- Last checked / clinical status: 2026-11-02 / needs_clinician_review

### claim.qq20261102f.integrated-partial-depth-planning

A smaller invasive-depth measurement from a different partial specimen does not erase a greater valid demonstrated invasive extent; an incomplete whole-lesion maximum can still have a known lower bound relevant to a supported planning discussion.

- Supporting source IDs: source.qq20261102f.esmo2025, source.qq20261102f.nci-melanoma
- Evidence category / certainty: evaluation / moderate
- Limitation: Original cross-specimen application of previously verified full-thickness sampling and maximum-depth reporting guidance, not a separately retrieved specimen-integration rule. Dermatopathology must confirm validity and mapping. The 1.8-mm value is retained from this case's existing completed-primary record and 0.6 mm from its existing partial report; their new constructed placement is not a management cutoff. The actual greater-than-1-mm nodal-discussion boundary is separately mapped to existing claim.qq20261102a.melanoma-integrated-node-staging.
- Last checked / clinical status: 2026-11-03 / needs_clinician_review

### claim.qq20261102f.mri-comparable-contrast-acquisition

Assessment of contrast-related signal change in an intrinsically bright soft-tissue mass region requires accounting for acquisition settings; a pre/post comparison that also changes suppression cannot simply assign all signal differences to enhancement.

- Supporting source IDs: source.qq20261102f.essr2023
- Evidence category / certainty: evaluation / moderate
- Limitation: Technical application of previously verified primary MRI characterization/contrast-targeting guidance, reused offline. Only one adequate medical primary consensus source is mapped; no new direct verification of the exact constructed sequence pair occurred. MSK radiology must confirm this comparison and its priority. No universal sequence mandate, contrast dose, numerical enhancement criterion, tract or histologic diagnosis is inferred.
- Last checked / clinical status: 2026-11-03 / needs_clinician_review

### claim.soft-tissue-mass.mri

MRI is appropriate for local characterization of a deep, enlarging, or ultrasound-indeterminate extremity soft-tissue mass before biopsy.

- Supporting source IDs: source.essr.soft-tissue-imaging.2024, source.nci.soft-tissue-sarcoma-pdq.2025
- Evidence category / certainty: evaluation / high
- Limitation: MRI can characterize and guide planning but cannot by itself prove sarcoma.
- Last checked / clinical status: 2026-09-09 / needs_clinician_review

## Source records

Full metadata is also retained in the source modules. License permission and medical authority are separate assessments. Undated records remain n.d.; no year is inferred from the access date.

### source.ahrq.pdca.2026

- Full citation: Agency for Healthcare Research and Quality. Plan-Do-Check-Act Cycle. Accessed 2026-09-29.
- Organization / journal: Agency for Healthcare Research and Quality
- Authors: Agency for Healthcare Research and Quality
- Publication year: n.d.
- DOI / official URL: https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle
- Access date: 2026-09-29
- Source class: government_guidance
- License / reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; copyrighted_targeted_verification_only; Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Medical authority: Federal quality-improvement reference for iterative Plan-Do-Check-Act cycles.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.gs028se.statistics.pdsa-act

### source.bread-butter.herniasurge-2018

- Full citation: The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. doi:10.1007/s10029-017-1668-x. PMID:29330835. PMCID:PMC5809582.
- Organization / journal: Hernia / HerniaSurge Group
- Authors: The HerniaSurge Group
- Publication year: 2018
- DOI / official URL: 10.1007/s10029-017-1668-x; https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/
- Access date: 2026-09-17
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution-NonCommercial 4.0 International; cc_by_nc_4_0_restricted; Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or algorithms reproduced.
- Medical authority: Multisociety international guideline defining the selected watchful-waiting phenotype and timely femoral-hernia repair direction.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.bread-butter.inguinal-hernia.watchful-waiting

### source.bread-butter.herniasurge-update-2023

- Full citation: Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080. doi:10.1093/bjsopen/zrad080. PMID:37862616.
- Organization / journal: BJS Open / HerniaSurge Collaboration
- Authors: Cesare Stabilini; Nadine van Veenendaal; Eske Aasvang; Ferdinando Agresta; Theo Aufenacker; Frederik Berrevoet; Ine Burgmans; David Chen; Andrew de Beaux; Barbora East; José Garcia-Alamino; Nadia Henriksen; Ferdinand Köckerling; Jan Kukleta; Maarten Loos; Manuel Lopez-Cano; Ralph Lorenz; Marc Miserez; Agneta Montgomery; Salvador Morales-Conde; Chris Oppong; Maciej Pawlak; Mauro Podda; Wolfgang Reinpold; David Sanders; Alberto Sartori; Hanh Minh Tran; Mireia Verdaguer; Reiko Wiessner; Michael Yeboah; Willem Zwaans; Maarten Simons
- Publication year: 2023
- DOI / official URL: 10.1093/bjsopen/zrad080; https://academic.oup.com/bjsopen/article/7/5/zrad080/7325871
- Access date: 2026-09-17
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Original factual synthesis with citation; no source prose, tables, figures, or algorithms reproduced.
- Medical authority: Current international guideline update corroborating safety and later crossover for watchful waiting in selected men.
- Intended evidence / cross-check use: cross_check
- Supported evidence-claim IDs in this round: claim.bread-butter.inguinal-hernia.watchful-waiting

### source.essr.soft-tissue-imaging.2024

- Full citation: Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.
- Organization / journal: European Radiology
- Authors: Noebauer-Huhmann IM; Vanhoenacker FM; Vilanova JC; et al.
- Publication year: 2024
- DOI / official URL: 10.1007/s00330-023-10425-5; https://link.springer.com/article/10.1007/s00330-023-10425-5
- Access date: 2026-09-09
- Source class: peer_reviewed_guideline
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .
- Medical authority: Peer-reviewed ESSR expert consensus directly checked for MRI characterization, tumor-center referral before intervention, and planned image-guided biopsy.
- Intended evidence / cross-check use: both
- Supported evidence-claim IDs in this round: claim.soft-tissue-mass.mri

### source.hu-gastric-malt-diagnosis-management.2016

- Full citation: Hu Q, Zhang Y, Zhang X, Fu K. Gastric mucosa-associated lymphoid tissue lymphoma and Helicobacter pylori infection: a review of current diagnosis and management. Biomark Res. 2016;4:15. doi:10.1186/s40364-016-0068-1.
- Organization / journal: Biomarker Research
- Authors: Qinglong Hu; Yizhuo Zhang; Xiaoyan Zhang; Kai Fu
- Publication year: 2016
- DOI / official URL: 10.1186/s40364-016-0068-1; https://pmc.ncbi.nlm.nih.gov/articles/PMC4962427/
- Access date: 2026-08-06
- Source class: narrative_review
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Use with attribution and independent synthesis. Do not reproduce source figures, tables, algorithms, or extended wording.
- Medical authority: Peer-reviewed open-access review supporting the integrated morphologic and immunophenotypic diagnostic pattern and the H. pylori association.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.gastric-malt.integrated-pathologic-recognition

### source.matysiak-budnik-gastric-malt-management.2023

- Full citation: Matysiak-Budnik T, Priadko K, Bossard C, Chapelle N, Ruskoné-Fourmestraux A. Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View. Cancers (Basel). 2023;15(15):3811. doi:10.3390/cancers15153811.
- Organization / journal: Cancers
- Authors: Tamara Matysiak-Budnik; Kateryna Priadko; Céline Bossard; Nicolas Chapelle; Agnès Ruskoné-Fourmestraux
- Publication year: 2023
- DOI / official URL: 10.3390/cancers15153811; https://pmc.ncbi.nlm.nih.gov/articles/PMC10417821/
- Access date: 2026-08-06
- Source class: narrative_review
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Use with attribution and independently written synthesis. Do not reproduce source images, tables, or prose.
- Medical authority: Recent specialist review cross-checking pathology, eradication-first management, staging, follow-up, and nonclassic disease boundaries.
- Intended evidence / cross-check use: both
- Supported evidence-claim IDs in this round: claim.gastric-malt.integrated-pathologic-recognition

### source.nci.soft-tissue-sarcoma-pdq.2025

- Full citation: PDQ Adult Treatment Editorial Board. Soft Tissue Sarcoma Treatment, Health Professional Version. Bethesda, MD: National Cancer Institute. Updated February 21, 2025. PMID:26389481.
- Organization / journal: National Cancer Institute PDQ
- Authors: PDQ Adult Treatment Editorial Board
- Publication year: 2025
- DOI / official URL: https://www.cancer.gov/types/soft-tissue-sarcoma/hp/adult-soft-tissue-treatment-pdq
- Access date: 2026-09-09
- Source class: government_guidance
- License / reuse: United States government work; NCI reuse conditions apply; public_domain_conditions_apply; Original factual synthesis only; no source prose, imagery, agency marks, or PDQ branding reproduced.
- Medical authority: NCI expert editorial synthesis directly checked for imaging before intervention, planned biopsy, and experienced pathology review; PDQ is independent of NCI policy.
- Intended evidence / cross-check use: both
- Supported evidence-claim IDs in this round: claim.soft-tissue-mass.mri

### source.qq20261102a.ahrq-metrics

- Full citation: Agency for Healthcare Research and Quality. Chapter 6. Track Performance with Metrics. Last reviewed May 2016. Accessed 2026-09-29.
- Organization / journal: Agency for Healthcare Research and Quality
- Authors: Agency for Healthcare Research and Quality
- Publication year: 2016
- DOI / official URL: https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; copyrighted_targeted_verification_only; Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Medical authority: Independent government measures guidance supports distinguishing process uptake, clinical outcomes and balancing burden. All B36 counts/time observations are constructed fictional process data. Same publication as source.ahrq.qi-measures.2026; this recheck is not an independent second source.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102a.pdsa-outcome-balancing-adaptation

### source.qq20261102a.ahrq-pdca

- Full citation: Agency for Healthcare Research and Quality. Plan-Do-Check-Act Cycle. Accessed 2026-09-29.
- Organization / journal: Agency for Healthcare Research and Quality
- Authors: Agency for Healthcare Research and Quality
- Publication year: n.d.
- DOI / official URL: https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; copyrighted_targeted_verification_only; Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Medical authority: Public primary QI tool rechecked: test, study outcome and iterate. Does not define a universal abandon rule from lack of benefit. Same publication as source.ahrq.pdca.2026; this recheck is not an independent second source.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102a.pdsa-outcome-balancing-adaptation

### source.qq20261102a.bsh-mzl

- Full citation: Walewska R, Eyre TA, Barrington S, Brady J, Fields P, Iyengar S, et al.; British Society of Haematology. Guideline for the diagnosis and management of marginal zone lymphomas. Br J Haematol. 2024;204(1):86-107. doi:10.1111/bjh.19064. First published November 13, 2023.
- Organization / journal: British Society of Haematology / British Journal of Haematology
- Authors: Renata Walewska; Toby A Eyre; Sally Barrington; Jessica Brady; Paul Fields; Sunil Iyengar; et al.
- Publication year: 2024
- DOI / official URL: 10.1111/bjh.19064; https://b-s-h.org.uk/media/x0bbg4bs/guideline-for-the-diagnosis-and-management-of-marginal-zone-lymphomas-a-british-society.pdf
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Copyright BSH/Wiley; targeted verification only; copyrighted_targeted_verification_only; Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Medical authority: Full public society PDF read. Tissue morphology/architecture plus immunophenotype, repeat endoscopy if uncertain, clonality not sufficient in isolation, and gastric histologic response assessment. Marker exceptions and expert pathology review remain explicit.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102a.gastric-lineage-not-classification

### source.qq20261102a.chicago

- Full citation: Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.
- Organization / journal: Neurogastroenterology and Motility / International High-Resolution Manometry Working Group
- Authors: Rena Yadlapati; Peter J Kahrilas; Mark R Fox; Albert J Bredenoord; C Prakash Gyawali; Sabine Roman; et al.
- Publication year: 2021
- DOI / official URL: 10.1111/nmo.14058; https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/
- Access date: 2026-11-02
- Source class: peer_reviewed_guideline
- License / reuse: Copyrighted expert consensus; public author manuscript, reusable license not established; copyrighted_targeted_verification_only; PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.
- Medical authority: Primary classification consensus checked in the accessible complete manuscript: primary-position achalasia criterion, absent normal peristalsis, pressurization/spasm distinction and failed DCI below 100 mmHg.s.cm. Same publication as source.qq20261102.chicago-v4; this recheck is not an independent second source.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102a.esophageal-physiology-sequence

### source.qq20261102a.eado2024

- Full citation: Garbe C, Amaral T, Peris K, Hauschild A, Arenberger P, Basset-Seguin N, et al.; EADO, EDF and EORTC. European consensus-based interdisciplinary guideline for melanoma. Part 1: Diagnostics - Update 2024. Eur J Cancer. 2025;215:115152. doi:10.1016/j.ejca.2024.115152.
- Organization / journal: EADO / EDF / EORTC / European Journal of Cancer
- Authors: Claus Garbe; Teresa Amaral; Ketty Peris; Axel Hauschild; Petr Arenberger; Nicole Basset-Seguin; et al.
- Publication year: 2025
- DOI / official URL: 10.1016/j.ejca.2024.115152; https://eado.org/files/2025/01/2024-EADO-CMGuideline-Diagnostics-EJC.pdf
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Copyright Elsevier; freely available society PDF; targeted verification only; copyrighted_targeted_verification_only; Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Medical authority: Complete publicly parsed society PDF read despite direct-fetch redirect loop. Valid through end 2026. Supports integrated depth/clinical nodal assessment, ultrasound not substituting for sentinel staging, and complete diagnostic excision when feasible.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102a.melanoma-diagnostic-sampling, claim.qq20261102a.melanoma-integrated-node-staging

### source.qq20261102a.essr2015-target

- Full citation: Noebauer-Huhmann IM, et al. Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging. Semin Musculoskelet Radiol. 2015;19(5):475-482. doi:10.1055/s-0035-1569251.
- Organization / journal: European Society of Musculoskeletal Radiology / Seminars in Musculoskeletal Radiology
- Authors: Iris-Melanie Noebauer-Huhmann; et al.
- Publication year: 2015
- DOI / official URL: 10.1055/s-0035-1569251; https://pure.amsterdamumc.nl/ws/files/173173752/Soft-tissue-tumors-in-adults-essr-approved-guidelines-for-diagnostic-imaging.pdf
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Copyright Thieme; public institutional copy; targeted verification only; copyrighted_targeted_verification_only; Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Medical authority: Older primary society technique guidance, complete PDF checked: target viable areas identified by enhancement/Doppler, coordinate route. Current ESSR and SEOM local-imaging/core guidance independently corroborate the general pathway; no invented needle size or timing.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102a.sarcoma-viable-biopsy-target

### source.qq20261102a.essr2023

- Full citation: Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.
- Organization / journal: European Radiology
- Authors: Noebauer-Huhmann IM; Vanhoenacker FM; Vilanova JC; et al.
- Publication year: 2024
- DOI / official URL: 10.1007/s00330-023-10425-5; https://link.springer.com/article/10.1007/s00330-023-10425-5
- Access date: 2026-11-02
- Source class: peer_reviewed_guideline
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .
- Medical authority: Current ESSR consensus checked in full publisher HTML; MRI characterization/local staging of a deep or indeterminate limb lesion and referral before biopsy. Older ESSR targeting guidance is cross-checked, not a substitute for this current guideline. Same publication as source.essr.soft-tissue-imaging.2024; this recheck is not an independent second source.
- Intended evidence / cross-check use: both
- Supported evidence-claim IDs in this round: claim.qq20261102a.sarcoma-local-imaging

### source.qq20261102a.hernia2018

- Full citation: The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. doi:10.1007/s10029-017-1668-x. PMID:29330835. PMCID:PMC5809582.
- Organization / journal: Hernia / HerniaSurge Group
- Authors: The HerniaSurge Group
- Publication year: 2018
- DOI / official URL: 10.1007/s10029-017-1668-x; https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution-NonCommercial 4.0 International; cc_by_nc_4_0_restricted; Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or algorithms reproduced.
- Medical authority: International guideline: ultrasound in uncertain clinical examination, dynamic cross-sectional imaging when unresolved; symptoms/function affect observation-versus-repair planning. Same publication as source.bread-butter.herniasurge-2018; this recheck is not an independent second source.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102a.symptomatic-groin-planning

### source.qq20261102a.hernia2023

- Full citation: Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080. doi:10.1093/bjsopen/zrad080. PMID:37862616.
- Organization / journal: BJS Open / HerniaSurge Collaboration
- Authors: Cesare Stabilini; Nadine van Veenendaal; Eske Aasvang; Ferdinando Agresta; Theo Aufenacker; Frederik Berrevoet; Ine Burgmans; David Chen; Andrew de Beaux; Barbora East; José Garcia-Alamino; Nadia Henriksen; Ferdinand Köckerling; Jan Kukleta; Maarten Loos; Manuel Lopez-Cano; Ralph Lorenz; Marc Miserez; Agneta Montgomery; Salvador Morales-Conde; Chris Oppong; Maciej Pawlak; Mauro Podda; Wolfgang Reinpold; David Sanders; Alberto Sartori; Hanh Minh Tran; Mireia Verdaguer; Reiko Wiessner; Michael Yeboah; Willem Zwaans; Maarten Simons
- Publication year: 2023
- DOI / official URL: 10.1093/bjsopen/zrad080; https://academic.oup.com/bjsopen/article/7/5/zrad080/7325871
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Original factual synthesis with citation; no source prose, tables, figures, or algorithms reproduced.
- Medical authority: Current update cross-check for watchful-waiting scope and later crossover; no invented operative threshold. Same publication as source.bread-butter.herniasurge-update-2023; this recheck is not an independent second source.
- Intended evidence / cross-check use: cross_check
- Supported evidence-claim IDs in this round: claim.qq20261102a.symptomatic-groin-planning

### source.qq20261102a.malt2023

- Full citation: Matysiak-Budnik T, Priadko K, Bossard C, Chapelle N, Ruskoné-Fourmestraux A. Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View. Cancers (Basel). 2023;15(15):3811. doi:10.3390/cancers15153811.
- Organization / journal: Cancers
- Authors: Tamara Matysiak-Budnik; Kateryna Priadko; Céline Bossard; Nicolas Chapelle; Agnès Ruskoné-Fourmestraux
- Publication year: 2023
- DOI / official URL: 10.3390/cancers15153811; https://pmc.ncbi.nlm.nih.gov/articles/PMC10417821/
- Access date: 2026-11-02
- Source class: narrative_review
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Use with attribution and independently written synthesis. Do not reproduce source images, tables, or prose.
- Medical authority: Independent open peer-reviewed gastric MALT review cross-check for representative biopsy, integrated classification and eradication/serial histologic response assessment. Same publication as source.matysiak-budnik-gastric-malt-management.2023; this recheck is not an independent second source.
- Intended evidence / cross-check use: both
- Supported evidence-claim IDs in this round: claim.qq20261102a.gastric-lineage-not-classification

### source.qq20261102a.nci-melanoma

- Full citation: PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.
- Organization / journal: National Cancer Institute PDQ
- Authors: PDQ Adult Treatment Editorial Board
- Publication year: 2025
- DOI / official URL: https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: United States government factual material; NCI and PDQ reuse conditions apply; public_domain_conditions_apply; Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.
- Medical authority: Independent federal professional evidence summary supports diagnostic depth assessment and sentinel staging in the supplied thickness range; this does not promise a survival benefit. Same publication as source.sc.nci-melanoma-pdq-2025; this recheck is not an independent second source.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102a.melanoma-diagnostic-sampling, claim.qq20261102a.melanoma-integrated-node-staging

### source.qq20261102a.seom2024

- Full citation: Serrano C, Arregui M, Carrasco I, et al. SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024). Clinical and Translational Oncology. 2025;27(4):1460-1471. doi:10.1007/s12094-024-03842-5.
- Organization / journal: Spanish Society of Medical Oncology and Spanish Group for Sarcoma Research; Clinical and Translational Oncology
- Authors: Cesar Serrano; Marta Arregui; Irene Carrasco; Nadia Hindi; Javier Martinez-Trufero; Jeronimo Martinez-Garcia; Aurea Molina; Ana Paisan; Raul Sanchez; Maria Angeles Sala
- Publication year: 2025
- DOI / official URL: 10.1007/s12094-024-03842-5; https://pmc.ncbi.nlm.nih.gov/articles/PMC12000159/
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms.
- Medical authority: Independent society guideline for contrast MRI and coordinated image-guided core biopsy; specific viable-area selection additionally checked in ESSR technique guidance. Same publication as source.seom-geis.soft-tissue-sarcoma-guideline.2024; this recheck is not an independent second source.
- Intended evidence / cross-check use: both
- Supported evidence-claim IDs in this round: claim.qq20261102a.sarcoma-local-imaging, claim.qq20261102a.sarcoma-viable-biopsy-target

### source.qq20261102a.seoul

- Full citation: Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. Journal of Neurogastroenterology and Motility. 2020;26(2):180-203. Published 2020-04-30. doi:10.5056/jnm20014. PMID:32235027.
- Organization / journal: Journal of Neurogastroenterology and Motility / Korean Society of Neurogastroenterology and Motility
- Authors: Jung HK; Hong SJ; Lee OY; Pandolfino J; Park H; Miwa H; Ghoshal UC; Mahadeva S; et al.
- Publication year: 2020
- DOI / official URL: 10.5056/jnm20014; https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution-NonCommercial 4.0 International; cc_by_nc_4_0_restricted; Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.
- Medical authority: Independent guideline corroborates pressure-study classification following structural assessment; FLIP and reflux testing are not represented as complete substitutes for ordinary HRM classification. Same publication as source.sc.seoul-achalasia-2020; this recheck is not an independent second source.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102a.esophageal-physiology-sequence

### source.qq20261102b.ahrq-metrics

- Full citation: Agency for Healthcare Research and Quality. Chapter 6. Track Performance with Metrics. Last reviewed May 2016. Accessed 2026-09-29.
- Organization / journal: Agency for Healthcare Research and Quality
- Authors: Agency for Healthcare Research and Quality
- Publication year: 2016
- DOI / official URL: https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; copyrighted_targeted_verification_only; Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Medical authority: Existing verified government improvement guidance reused for process/outcome/balancing measurement; no patient outcome or question-correctness data are collected. Same publication as source.qq20261102a.ahrq-metrics; no independent second source is implied.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102b.pdsa-hypothesis-not-proof

### source.qq20261102b.ahrq-pdca

- Full citation: Agency for Healthcare Research and Quality. Plan-Do-Check-Act Cycle. Accessed 2026-09-29.
- Organization / journal: Agency for Healthcare Research and Quality
- Authors: Agency for Healthcare Research and Quality
- Publication year: n.d.
- DOI / official URL: https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; copyrighted_targeted_verification_only; Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Medical authority: Existing verified government improvement toolkit reused for small iterative tests and hypothesis refinement, not proof of a prefill intervention. Same publication as source.qq20261102a.ahrq-pdca; no independent second source is implied.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102b.pdsa-hypothesis-not-proof

### source.qq20261102b.bsh-mzl

- Full citation: Walewska R, Eyre TA, Barrington S, Brady J, Fields P, Iyengar S, et al.; British Society of Haematology. Guideline for the diagnosis and management of marginal zone lymphomas. Br J Haematol. 2024;204(1):86-107. doi:10.1111/bjh.19064. First published November 13, 2023.
- Organization / journal: British Society of Haematology / British Journal of Haematology
- Authors: Renata Walewska; Toby A Eyre; Sally Barrington; Jessica Brady; Paul Fields; Sunil Iyengar; et al.
- Publication year: 2024
- DOI / official URL: 10.1111/bjh.19064; https://b-s-h.org.uk/media/x0bbg4bs/guideline-for-the-diagnosis-and-management-of-marginal-zone-lymphomas-a-british-society.pdf
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Copyright BSH/Wiley; targeted verification only; copyrighted_targeted_verification_only; Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Medical authority: Current full society guideline rechecked: clonality can occur in chronic inflammation; repeat OGD is recommended for diagnostic uncertainty; fusion testing has a different role. Same publication as source.qq20261102a.bsh-mzl; no independent second source is implied.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102b.gastric-clone-not-diagnosis, claim.qq20261102b.gastric-uncertainty-repeat-biopsy

### source.qq20261102b.essr2015

- Full citation: Noebauer-Huhmann IM, et al. Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging. Semin Musculoskelet Radiol. 2015;19(5):475-482. doi:10.1055/s-0035-1569251.
- Organization / journal: European Society of Musculoskeletal Radiology / Seminars in Musculoskeletal Radiology
- Authors: Iris-Melanie Noebauer-Huhmann; et al.
- Publication year: 2015
- DOI / official URL: 10.1055/s-0035-1569251; https://pure.amsterdamumc.nl/ws/files/173173752/Soft-tissue-tumors-in-adults-essr-approved-guidelines-for-diagnostic-imaging.pdf
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Copyright Thieme; institutional Taverne access, not an open reuse license; copyrighted_targeted_verification_only; Institutional version states personal-use/reproduction restrictions. Used only for targeted factual verification of professional-society guidance as permitted by AGENTS; no text, figures, biopsy diagrams or procedures copied or distributed. No reusable-content license inferred.
- Medical authority: Primary technical guideline rechecked for viable targets, core sampling and avoiding contamination of other compartments. Older technique guidance, corroborated by current SEOM planning guidance. Same publication as source.qq20261102a.essr2015-target; no independent second source is implied.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102b.sarcoma-method-and-tract

### source.qq20261102b.seom2024

- Full citation: Serrano C, Arregui M, Carrasco I, et al. SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024). Clinical and Translational Oncology. 2025;27(4):1460-1471. doi:10.1007/s12094-024-03842-5.
- Organization / journal: Spanish Society of Medical Oncology and Spanish Group for Sarcoma Research; Clinical and Translational Oncology
- Authors: Cesar Serrano; Marta Arregui; Irene Carrasco; Nadia Hindi; Javier Martinez-Trufero; Jeronimo Martinez-Garcia; Aurea Molina; Ana Paisan; Raul Sanchez; Maria Angeles Sala
- Publication year: 2025
- DOI / official URL: 10.1007/s12094-024-03842-5; https://pmc.ncbi.nlm.nih.gov/articles/PMC12000159/
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms.
- Medical authority: Current open society guideline rechecked for initial image-guided core biopsy, selected open biopsy and planned removal of the tract with the tumor. Same publication as source.qq20261102a.seom2024; no independent second source is implied.
- Intended evidence / cross-check use: both
- Supported evidence-claim IDs in this round: claim.qq20261102b.sarcoma-method-and-tract

### source.qq20261102c.acg-physiology2020

- Full citation: Gyawali CP, Carlson DA, Chen JW, Patel A, Wong RJ, Yadlapati RH. ACG Clinical Guidelines: Clinical Use of Esophageal Physiologic Testing. Am J Gastroenterol. 2020;115(9):1412-1428. doi:10.14309/ajg.0000000000000734.
- Organization / journal: American College of Gastroenterology / American Journal of Gastroenterology
- Authors: Gyawali CP; Carlson DA; Chen JW; Patel A; Wong RJ; Yadlapati RH
- Publication year: 2020
- DOI / official URL: 10.14309/ajg.0000000000000734; https://pmc.ncbi.nlm.nih.gov/articles/PMC9468980/
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Public author manuscript; reusable license not established; copyrighted_targeted_verification_only; No algorithms, protocol tables, source text or exact maneuver quantities copied. Factual verification of society guidance only.
- Medical authority: Full primary guideline rechecked for assisted catheter placement, limitations of incomplete studies, provocative maneuvers and complementary FLIP use. Older technical guidance, combined with retained Chicago v4 rather than claimed new diagnostic cutoffs.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102c.hrm-protocol-and-provocation

### source.qq20261102c.ahrq-measures

- Full citation: Agency for Healthcare Research and Quality. Chapter 6. Track Performance with Metrics. Last reviewed May 2016. Accessed 2026-09-29.
- Organization / journal: Agency for Healthcare Research and Quality
- Authors: Agency for Healthcare Research and Quality
- Publication year: 2016
- DOI / official URL: https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; copyrighted_targeted_verification_only; Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Medical authority: Existing government improvement guidance retained for process/outcome/balancing measures; constructed workflow data are not real patients or gameplay analytics. Same publication as source.qq20261102b.ahrq-metrics; a new record ID does not create independent evidence.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102c.pdsa-source-specific-next-test, claim.qq20261102c.qi-comparison-input-control

### source.qq20261102c.ahrq-pdsa

- Full citation: Agency for Healthcare Research and Quality. Plan-Do-Check-Act Cycle. Accessed 2026-09-29.
- Organization / journal: Agency for Healthcare Research and Quality
- Authors: Agency for Healthcare Research and Quality
- Publication year: n.d.
- DOI / official URL: https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; copyrighted_targeted_verification_only; Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Medical authority: Existing government improvement guidance retained for testing an adaptation from local observations rather than declaring an untested prefill benefit. Same publication as source.qq20261102b.ahrq-pdca; a new record ID does not create independent evidence.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102c.pdsa-source-specific-next-test, claim.qq20261102c.qi-comparison-input-control

### source.qq20261102c.bsh2024

- Full citation: Walewska R, Eyre TA, Barrington S, Brady J, Fields P, Iyengar S, et al.; British Society of Haematology. Guideline for the diagnosis and management of marginal zone lymphomas. Br J Haematol. 2024;204(1):86-107. doi:10.1111/bjh.19064. First published November 13, 2023.
- Organization / journal: British Society of Haematology / British Journal of Haematology
- Authors: Renata Walewska; Toby A Eyre; Sally Barrington; Jessica Brady; Paul Fields; Sunil Iyengar; et al.
- Publication year: 2024
- DOI / official URL: 10.1111/bjh.19064; https://b-s-h.org.uk/media/x0bbg4bs/guideline-for-the-diagnosis-and-management-of-marginal-zone-lymphomas-a-british-society.pdf
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Copyright BSH/Wiley; targeted verification only; copyrighted_targeted_verification_only; Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Medical authority: Full primary guideline rechecked this round for integrated diagnosis, large-cell transformation, infection testing, residual disease and escalation boundaries; no lymphoma response deadline invented. Same publication as source.qq20261102b.bsh-mzl; a new record ID does not create independent evidence.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102c.gastric-clonality-classification-boundary

### source.qq20261102c.chicago

- Full citation: Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.
- Organization / journal: Neurogastroenterology and Motility / International High-Resolution Manometry Working Group
- Authors: Rena Yadlapati; Peter J Kahrilas; Mark R Fox; Albert J Bredenoord; C Prakash Gyawali; Sabine Roman; et al.
- Publication year: 2021
- DOI / official URL: 10.1111/nmo.14058; https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/
- Access date: 2026-11-02
- Source class: peer_reviewed_guideline
- License / reuse: Copyrighted expert consensus; public author manuscript, reusable license not established; copyrighted_targeted_verification_only; PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.
- Medical authority: Previously verified primary classification consensus retained for technically adequate primary/secondary-position protocols and deglutitive inhibition. The new failed-acquisition cases are clinical applications, not new normal ranges. Same publication as source.qq20261102b.chicago; a new record ID does not create independent evidence.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102c.hrm-protocol-and-provocation

### source.qq20261102c.esmo-melanoma2025

- Full citation: Amaral T, Ottaviano M, Arance A, Blank C, Chiarion-Sileni V, Donia M, et al.; ESMO Guidelines Committee. Cutaneous melanoma: ESMO Clinical Practice Guideline for diagnosis, treatment and follow-up. Ann Oncol. 2025;36(1):10-30. doi:10.1016/j.annonc.2024.11.006.
- Organization / journal: European Society for Medical Oncology / Annals of Oncology
- Authors: Amaral T; Ottaviano M; Arance A; Blank C; Chiarion-Sileni V; Donia M; ESMO Guidelines Committee
- Publication year: 2025
- DOI / official URL: 10.1016/j.annonc.2024.11.006; https://doi.org/10.1016/j.annonc.2024.11.006
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Publisher society copyright; targeted verification only (PMC manuscript separately reports CC BY); copyrighted_targeted_verification_only; Access route: https://www.icpf.pf/wp-content/uploads/2025/08/ESMO-2025-Melanome.pdf . PMC routes returned a browser check, so no inaccessible snippet was evidence. No staging tables, margin table, figure or treatment algorithm copied.
- Medical authority: Full guideline read through the public cancer-institute-hosted copy for complete diagnostic biopsy, microstaging, clinically negative sentinel assessment and stage-based workup. Partial-specimen and missed-node applications are independently authored clinical inferences, not a universal completion algorithm.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102c.melanoma-incomplete-biopsy-completion

### source.qq20261102c.essr2023

- Full citation: Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.
- Organization / journal: European Radiology
- Authors: Noebauer-Huhmann IM; Vanhoenacker FM; Vilanova JC; et al.
- Publication year: 2024
- DOI / official URL: 10.1007/s00330-023-10425-5; https://link.springer.com/article/10.1007/s00330-023-10425-5
- Access date: 2026-11-02
- Source class: peer_reviewed_guideline
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .
- Medical authority: Full current primary MSK guideline rechecked this round at https://pmc.ncbi.nlm.nih.gov/articles/PMC11213759/ for whole-lesion/compartment coverage and enhancement-based viable biopsy targeting. CC BY 4.0 independently confirmed; original factual synthesis only, no consensus table/protocol values copied. Exact case protocols still need radiologist review. Same publication as source.qq20261102a.essr2023; a new record ID does not create independent evidence.
- Intended evidence / cross-check use: both
- Supported evidence-claim IDs in this round: claim.qq20261102c.sarcoma-enhancement-biopsy-target, claim.qq20261102c.sarcoma-mri-coverage-and-target

### source.qq20261102c.hernia2018

- Full citation: The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. doi:10.1007/s10029-017-1668-x. PMID:29330835. PMCID:PMC5809582.
- Organization / journal: Hernia / HerniaSurge Group
- Authors: The HerniaSurge Group
- Publication year: 2018
- DOI / official URL: 10.1007/s10029-017-1668-x; https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution-NonCommercial 4.0 International; cc_by_nc_4_0_restricted; Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or algorithms reproduced.
- Medical authority: Full primary guideline rechecked this round for dynamic imaging after negative studies, competing musculoskeletal causes and watchful waiting in selected men. Same publication as source.qq20261102a.hernia2018; a new record ID does not create independent evidence.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102c.groin-symptom-attribution

### source.qq20261102c.hernia2023

- Full citation: Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080. doi:10.1093/bjsopen/zrad080. PMID:37862616.
- Organization / journal: BJS Open / HerniaSurge Collaboration
- Authors: Cesare Stabilini; Nadine van Veenendaal; Eske Aasvang; Ferdinando Agresta; Theo Aufenacker; Frederik Berrevoet; Ine Burgmans; David Chen; Andrew de Beaux; Barbora East; José Garcia-Alamino; Nadia Henriksen; Ferdinand Köckerling; Jan Kukleta; Maarten Loos; Manuel Lopez-Cano; Ralph Lorenz; Marc Miserez; Agneta Montgomery; Salvador Morales-Conde; Chris Oppong; Maciej Pawlak; Mauro Podda; Wolfgang Reinpold; David Sanders; Alberto Sartori; Hanh Minh Tran; Mireia Verdaguer; Reiko Wiessner; Michael Yeboah; Willem Zwaans; Maarten Simons
- Publication year: 2023
- DOI / official URL: 10.1093/bjsopen/zrad080; https://academic.oup.com/bjsopen/article/7/5/zrad080/7325871
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Original factual synthesis with citation; no source prose, tables, figures, or algorithms reproduced.
- Medical authority: Current update retained alongside its 2018 foundation; it is not represented as a separate randomized study proving an individual pain source. Same publication as source.qq20261102a.hernia2023; a new record ID does not create independent evidence.
- Intended evidence / cross-check use: cross_check
- Supported evidence-claim IDs in this round: claim.qq20261102c.groin-symptom-attribution

### source.qq20261102c.malt-review2023

- Full citation: Matysiak-Budnik T, Priadko K, Bossard C, Chapelle N, Ruskoné-Fourmestraux A. Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View. Cancers. 2023;15(15):3811. doi:10.3390/cancers15153811.
- Organization / journal: Cancers
- Authors: Matysiak-Budnik T; Priadko K; Bossard C; Chapelle N; Ruskoné-Fourmestraux A
- Publication year: 2023
- DOI / official URL: 10.3390/cancers15153811; https://doi.org/10.3390/cancers15153811
- Access date: 2026-11-02
- Source class: narrative_review
- License / reuse: CC BY 4.0; copyright the authors; cc_by_4_0; https://creativecommons.org/licenses/by/4.0/ . Full licensed original publication read via https://pdfs.semanticscholar.org/7789/4b60720f600d0fb1b6fc625dfb1613d5109e.pdf after publisher/PMC retrieval restrictions. No source expression, figures or tables copied.
- Medical authority: Independent open clinical review cross-checks morphology/clonality limits, fusion-test prevalence, residual-disease monitoring and treatment after eradication. Not a second guideline or proof of an exact individual response deadline.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102c.gastric-clonality-classification-boundary

### source.qq20261102c.nist-comparison

- Full citation: National Institute of Standards and Technology; SEMATECH. NIST/SEMATECH e-Handbook of Statistical Methods. Section 5.3.3.2: Randomized block designs. Undated live section; accessed November 2, 2026.
- Organization / journal: US National Institute of Standards and Technology / SEMATECH
- Authors: National Institute of Standards and Technology; SEMATECH
- Publication year: n.d.
- DOI / official URL: https://www.itl.nist.gov/div898/handbook/pri/section3/pri332.htm
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: US government methods guidance; third-party conditions apply; public_domain_conditions_apply; Full official section checked. Original methods application only; no source text, example, formula, table or diagram copied. Applied alongside existing AHRQ small-test/measurement guidance.
- Medical authority: Primary statistical-methods guidance for controlling extraneous variation while changing a factor of interest. Same handbook as the retained p-value/interval sections, not independent clinical evidence. The source does not prescribe a universal PDSA protocol or prove any clinical software benefit.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102c.qi-comparison-input-control

### source.qq20261102d.acg2020

- Full citation: Gyawali CP, Carlson DA, Chen JW, Patel A, Wong RJ, Yadlapati RH. ACG Clinical Guidelines: Clinical Use of Esophageal Physiologic Testing. Am J Gastroenterol. 2020;115(9):1412-1428. doi:10.14309/ajg.0000000000000734.
- Organization / journal: American College of Gastroenterology / American Journal of Gastroenterology
- Authors: Gyawali CP; Carlson DA; Chen JW; Patel A; Wong RJ; Yadlapati RH
- Publication year: 2020
- DOI / official URL: 10.14309/ajg.0000000000000734; https://pmc.ncbi.nlm.nih.gov/articles/PMC9468980/
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Public author manuscript; reusable license not established; copyrighted_targeted_verification_only; No algorithms, protocol tables, source text or exact maneuver quantities copied. Factual verification of society guidance only.
- Medical authority: Full primary guideline rechecked for assisted catheter placement, limitations of incomplete studies, provocative maneuvers and complementary FLIP use. Older technical guidance, combined with retained Chicago v4 rather than claimed new diagnostic cutoffs. Round five reuses that already-recorded primary-source verification offline; no new web retrieval or independent corroborating source is claimed. The new source ID records a new atomic mapping, not a new publication.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102d.hrm-rapid-drink-purpose, claim.qq20261102d.hrm-rapid-swallow-interpretation, claim.qq20261102d.hrm-solid-meal-provocation

### source.qq20261102d.chicago2021

- Full citation: Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.
- Organization / journal: Neurogastroenterology and Motility / International High-Resolution Manometry Working Group
- Authors: Rena Yadlapati; Peter J Kahrilas; Mark R Fox; Albert J Bredenoord; C Prakash Gyawali; Sabine Roman; et al.
- Publication year: 2021
- DOI / official URL: 10.1111/nmo.14058; https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/
- Access date: 2026-11-02
- Source class: peer_reviewed_guideline
- License / reuse: Copyrighted expert consensus; public author manuscript, reusable license not established; copyrighted_targeted_verification_only; PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.
- Medical authority: Previously verified primary classification consensus retained for technically adequate primary/secondary-position protocols and deglutitive inhibition. The new failed-acquisition cases are clinical applications, not new normal ranges. Same publication as source.qq20261102b.chicago; a new record ID does not create independent evidence. Round five reuses that already-recorded primary-source verification offline; no new web retrieval or independent corroborating source is claimed. The new source ID records a new atomic mapping, not a new publication.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102d.hrm-rapid-drink-purpose, claim.qq20261102d.hrm-rapid-swallow-interpretation, claim.qq20261102d.hrm-solid-meal-provocation

### source.qq20261102e.acg2020

- Full citation: Gyawali CP, Carlson DA, Chen JW, Patel A, Wong RJ, Yadlapati RH. ACG Clinical Guidelines: Clinical Use of Esophageal Physiologic Testing. Am J Gastroenterol. 2020;115(9):1412-1428. doi:10.14309/ajg.0000000000000734.
- Organization / journal: American College of Gastroenterology / American Journal of Gastroenterology
- Authors: Gyawali CP; Carlson DA; Chen JW; Patel A; Wong RJ; Yadlapati RH
- Publication year: 2020
- DOI / official URL: 10.14309/ajg.0000000000000734; https://pmc.ncbi.nlm.nih.gov/articles/PMC9468980/
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Public author manuscript; reusable license not established; copyrighted_targeted_verification_only; No algorithms, protocol tables, source text or exact maneuver quantities copied. Factual verification of society guidance only.
- Medical authority: Full primary guideline rechecked for assisted catheter placement, limitations of incomplete studies, provocative maneuvers and complementary FLIP use. Older technical guidance, combined with retained Chicago v4 rather than claimed new diagnostic cutoffs. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102e.hrm-reserve-versus-outflow

### source.qq20261102e.chicago2021

- Full citation: Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.
- Organization / journal: Neurogastroenterology and Motility / International High-Resolution Manometry Working Group
- Authors: Rena Yadlapati; Peter J Kahrilas; Mark R Fox; Albert J Bredenoord; C Prakash Gyawali; Sabine Roman; et al.
- Publication year: 2021
- DOI / official URL: 10.1111/nmo.14058; https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/
- Access date: 2026-11-02
- Source class: peer_reviewed_guideline
- License / reuse: Copyrighted expert consensus; public author manuscript, reusable license not established; copyrighted_targeted_verification_only; PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.
- Medical authority: Previously verified primary classification consensus retained for technically adequate primary/secondary-position protocols and deglutitive inhibition. The new failed-acquisition cases are clinical applications, not new normal ranges. Same publication as source.qq20261102b.chicago; a new record ID does not create independent evidence. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102e.hrm-reserve-versus-outflow

### source.qq20261102e.esmo2025

- Full citation: Amaral T, Ottaviano M, Arance A, Blank C, Chiarion-Sileni V, Donia M, et al.; ESMO Guidelines Committee. Cutaneous melanoma: ESMO Clinical Practice Guideline for diagnosis, treatment and follow-up. Ann Oncol. 2025;36(1):10-30. doi:10.1016/j.annonc.2024.11.006.
- Organization / journal: European Society for Medical Oncology / Annals of Oncology
- Authors: Amaral T; Ottaviano M; Arance A; Blank C; Chiarion-Sileni V; Donia M; ESMO Guidelines Committee
- Publication year: 2025
- DOI / official URL: 10.1016/j.annonc.2024.11.006; https://doi.org/10.1016/j.annonc.2024.11.006
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Publisher society copyright; targeted verification only (PMC manuscript separately reports CC BY); copyrighted_targeted_verification_only; Access route: https://www.icpf.pf/wp-content/uploads/2025/08/ESMO-2025-Melanome.pdf . PMC routes returned a browser check, so no inaccessible snippet was evidence. No staging tables, margin table, figure or treatment algorithm copied.
- Medical authority: Full guideline read through the public cancer-institute-hosted copy for complete diagnostic biopsy, microstaging, clinically negative sentinel assessment and stage-based workup. Partial-specimen and missed-node applications are independently authored clinical inferences, not a universal completion algorithm. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102e.mapped-partial-skin-evidence, claim.qq20261102e.transected-depth-lower-bound

### source.qq20261102e.nci-melanoma

- Full citation: PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.
- Organization / journal: National Cancer Institute PDQ
- Authors: PDQ Adult Treatment Editorial Board
- Publication year: 2025
- DOI / official URL: https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: United States government factual material; NCI and PDQ reuse conditions apply; public_domain_conditions_apply; Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.
- Medical authority: Independent federal professional evidence summary supports diagnostic depth assessment and sentinel staging in the supplied thickness range; this does not promise a survival benefit. Same publication as source.sc.nci-melanoma-pdq-2025; this recheck is not an independent second source. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102e.mapped-partial-skin-evidence, claim.qq20261102e.transected-depth-lower-bound

### source.qq20261102f.esmo2025

- Full citation: Amaral T, Ottaviano M, Arance A, Blank C, Chiarion-Sileni V, Donia M, et al.; ESMO Guidelines Committee. Cutaneous melanoma: ESMO Clinical Practice Guideline for diagnosis, treatment and follow-up. Ann Oncol. 2025;36(1):10-30. doi:10.1016/j.annonc.2024.11.006.
- Organization / journal: European Society for Medical Oncology / Annals of Oncology
- Authors: Amaral T; Ottaviano M; Arance A; Blank C; Chiarion-Sileni V; Donia M; ESMO Guidelines Committee
- Publication year: 2025
- DOI / official URL: 10.1016/j.annonc.2024.11.006; https://doi.org/10.1016/j.annonc.2024.11.006
- Access date: 2026-11-02
- Source class: professional_society_guideline
- License / reuse: Publisher society copyright; targeted verification only (PMC manuscript separately reports CC BY); copyrighted_targeted_verification_only; Access route: https://www.icpf.pf/wp-content/uploads/2025/08/ESMO-2025-Melanome.pdf . PMC routes returned a browser check, so no inaccessible snippet was evidence. No staging tables, margin table, figure or treatment algorithm copied.
- Medical authority: Full guideline read through the public cancer-institute-hosted copy for complete diagnostic biopsy, microstaging, clinically negative sentinel assessment and stage-based workup. Partial-specimen and missed-node applications are independently authored clinical inferences, not a universal completion algorithm. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID. Round seven retains the original publication, rights and access date for offline use. This new mapping ID is neither a fresh source retrieval nor independent corroboration; the technical/cross-specimen application remains clinician review.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102f.integrated-partial-depth-planning

### source.qq20261102f.essr2023

- Full citation: Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.
- Organization / journal: European Radiology
- Authors: Noebauer-Huhmann IM; Vanhoenacker FM; Vilanova JC; et al.
- Publication year: 2024
- DOI / official URL: 10.1007/s00330-023-10425-5; https://link.springer.com/article/10.1007/s00330-023-10425-5
- Access date: 2026-11-02
- Source class: peer_reviewed_guideline
- License / reuse: Creative Commons Attribution 4.0 International; cc_by_4_0; Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .
- Medical authority: Full current primary MSK guideline rechecked this round at https://pmc.ncbi.nlm.nih.gov/articles/PMC11213759/ for whole-lesion/compartment coverage and enhancement-based viable biopsy targeting. CC BY 4.0 independently confirmed; original factual synthesis only, no consensus table/protocol values copied. Exact case protocols still need radiologist review. Same publication as source.qq20261102a.essr2023; a new record ID does not create independent evidence. Round seven retains the original publication, rights and access date for offline use. This new mapping ID is neither a fresh source retrieval nor independent corroboration; the technical/cross-specimen application remains clinician review.
- Intended evidence / cross-check use: both
- Supported evidence-claim IDs in this round: claim.qq20261102f.mri-comparable-contrast-acquisition

### source.qq20261102f.nci-melanoma

- Full citation: PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.
- Organization / journal: National Cancer Institute PDQ
- Authors: PDQ Adult Treatment Editorial Board
- Publication year: 2025
- DOI / official URL: https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq
- Access date: 2026-11-02
- Source class: government_guidance
- License / reuse: United States government factual material; NCI and PDQ reuse conditions apply; public_domain_conditions_apply; Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.
- Medical authority: Independent federal professional evidence summary supports diagnostic depth assessment and sentinel staging in the supplied thickness range; this does not promise a survival benefit. Same publication as source.sc.nci-melanoma-pdq-2025; this recheck is not an independent second source. Round six reuses the existing targeted primary-source verification offline; no fresh retrieval or independent publication is inferred from this new mapping ID. Round seven retains the original publication, rights and access date for offline use. This new mapping ID is neither a fresh source retrieval nor independent corroboration; the technical/cross-specimen application remains clinician review.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.qq20261102f.integrated-partial-depth-planning

### source.sc.aad-melanoma-highlights

- Full citation: American Academy of Dermatology. Melanoma clinical guideline: Guideline highlights. Undated professional education page. Accessed 2026-09-10.
- Organization / journal: American Academy of Dermatology
- Authors: American Academy of Dermatology
- Publication year: n.d.
- DOI / official URL: https://www.aad.org/member/clinical-quality/guidelines/melanoma
- Access date: 2026-09-10
- Source class: open_educational_resource
- License / reuse: Copyrighted society professional education; attributed noncommercial targeted factual use; copyrighted_targeted_verification_only; Original factual synthesis and citation only for local educational development. No source prose, figures, third-party database content, or marks reproduced; this page is not the unaccessed full JAAD guideline.
- Medical authority: Society guideline highlights directly checked as a corroborating professional source for adequate biopsy histology and selected sentinel-node biopsy for pathological regional staging.
- Intended evidence / cross-check use: cross_check
- Supported evidence-claim IDs in this round: claim.pigmented-skin-lesion.complete-diagnostic-biopsy

### source.sc.herniasurge-2018

- Full citation: The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. Published 2018-01-12. doi:10.1007/s10029-017-1668-x. PMID:29330835.
- Organization / journal: Hernia / HerniaSurge Group
- Authors: The HerniaSurge Group
- Publication year: 2018
- DOI / official URL: 10.1007/s10029-017-1668-x; https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/
- Access date: 2026-09-10
- Source class: peer_reviewed_guideline
- License / reuse: Creative Commons Attribution-NonCommercial 4.0 International; cc_by_nc_4_0_restricted; Original factual synthesis only for local noncommercial development. Attribute the source and CC BY-NC 4.0 license at https://creativecommons.org/licenses/by-nc/4.0/; no source prose, figures, tables, or other third-party material is reproduced. Commercial reuse requires separate review.
- Medical authority: International society evidence-based guideline directly checked for exam-first selected imaging, uncertainty around occult imaging, and symptomatic groin-hernia management. It does not establish a universal ultrasound algorithm.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.inguinal-hernia.symptomatic-elective-repair

### source.sc.nci-melanoma-pdq-2025

- Full citation: PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.
- Organization / journal: National Cancer Institute PDQ
- Authors: PDQ Adult Treatment Editorial Board
- Publication year: 2025
- DOI / official URL: https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq
- Access date: 2026-09-10
- Source class: government_guidance
- License / reuse: United States government factual material; NCI and PDQ reuse conditions apply; public_domain_conditions_apply; Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.
- Medical authority: Current government professional evidence summary directly checked for diagnostic biopsy and pathological sentinel-node staging in intermediate-thickness clinically node-negative melanoma.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.pigmented-skin-lesion.complete-diagnostic-biopsy

### source.sc.niddk-inguinal-hernia

- Full citation: National Institute of Diabetes and Digestive and Kidney Diseases. Inguinal Hernia. Last reviewed September 2019. Accessed 2026-09-10.
- Organization / journal: National Institute of Diabetes and Digestive and Kidney Diseases
- Authors: National Institute of Diabetes and Digestive and Kidney Diseases; Neal E. Seymour, MD (acknowledged reviewer)
- Publication year: 2019
- DOI / official URL: https://www.niddk.nih.gov/health-information/digestive-diseases/inguinal-hernia
- Access date: 2026-09-10
- Source class: government_guidance
- License / reuse: United States government factual material; NIDDK reuse conditions apply; public_domain_conditions_apply; Original factual synthesis only. Third-party content, images, and agency marks are excluded; credit NIDDK without implying endorsement.
- Medical authority: Directly checked NIDDK patient education cross-checking selected imaging after an unclear examination, elective repair, and watchful waiting limited to men with few or no symptoms. It cites HerniaSurge, so it is not independent underlying evidence.
- Intended evidence / cross-check use: cross_check
- Supported evidence-claim IDs in this round: claim.inguinal-hernia.symptomatic-elective-repair

### source.sc.seoul-achalasia-2020

- Full citation: Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. Journal of Neurogastroenterology and Motility. 2020;26(2):180-203. Published 2020-04-30. doi:10.5056/jnm20014. PMID:32235027.
- Organization / journal: Journal of Neurogastroenterology and Motility / Korean Society of Neurogastroenterology and Motility
- Authors: Jung HK; Hong SJ; Lee OY; Pandolfino J; Park H; Miwa H; Ghoshal UC; Mahadeva S; et al.
- Publication year: 2020
- DOI / official URL: 10.5056/jnm20014; https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014
- Access date: 2026-09-10
- Source class: professional_society_guideline
- License / reuse: Creative Commons Attribution-NonCommercial 4.0 International; cc_by_nc_4_0_restricted; Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.
- Medical authority: Society evidence-based guideline directly checked for HRM after structural assessment and the absent-peristalsis/impaired-relaxation pattern. Diagnostic evidence is low with strong consensus; the inaccessible corrigendum is not represented as reviewed.
- Intended evidence / cross-check use: evidence
- Supported evidence-claim IDs in this round: claim.achalasia.high-resolution-manometry
