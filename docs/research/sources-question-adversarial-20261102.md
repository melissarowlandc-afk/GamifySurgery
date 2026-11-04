# Adversarial correction sources - 2026-11-02

Targeted, read-only factual checks under AGENTS.md. All 39 new atomic claims and 35 runtime source records remain `needs_clinician_review`. Authority and reuse rights are separate. Rechecked publications have new scope records but are not counted as independent publications merely because an older source ID exists. No source text, table, figure, algorithm, question-bank item or recalled item is retained.

Runtime records: `packages/clinical-content/src/question-quality-adversarial-evidence-20261102.ts`. The original synthetic authoring worksheet and the claim mapping compiler are in `tools/question-quality`; they never retrieve sources during gameplay.

## Limits and specific checks

A02 compares specified filling/emptying/duct protocols, not a claim that every MRI/CT alternative is wrong after ultrasound. Melissa must confirm the exact ranking. A06 separates medication-associated secretion from the focal discharge component; age-specific imaging remains bound to the supplied adult female profiles. A25 uses the already verified named ART combination and newly verified route-specific midazolam rules. The NIH interaction table direct request returned 403; its search snippet was not treated as independent evidence.

Chicago v4 directly supports the primary-position distinction and the failed-DCI threshold; B04's 30-80 readouts are explicitly synthetic values within that supported range. No device-specific IRP number, exact dose, clinical probability or wait duration was invented. Hypothetical trial margins and process counts are clearly constructed model/protocol inputs; the accompanying QA checks arithmetic, not clinical efficacy.

ASCRS is the one adequately retrieved guideline for the new adverse-polyp application; AGA/ASGE requests failed, so they are not counted as corroboration. The supplied CT pathway is not contrasted against a valid CT-chest/abdominal-MRI pathway. Older ESSR technique guidance directly supports viable-area targeting; current ESSR/SEOM guidance supports MRI and planned cores. Current EADO guidance was read as a full public PDF; ESMO direct retrieval encountered captcha and is not used as the new factual anchor.

Korean 2024/2025 and JGCA2021 support the B23 scope. The contradictory English JGCA2025 hilar wording recorded in the previous ledger remains WITHHELD; no station-10 teaching point was inferred. BSH and the independent gastric-MALT review support integrated classification and histologic response. ESGE2026 supports the ulcer modality comparison; its topical rescue/temporizing role is retained, rather than declaring powder never useful.

Many PMC direct URLs returned captcha. Accessible publisher HTML or full official PDFs were used where available; bibliographic search records were used only to confirm metadata. Public availability is not inferred to grant a reuse license. No proprietary SCORE, commercial question bank, UpToDate, AccessSurgery, textbook corpus, paywalled snippet or incidental NCCN search hit was used.

## Complete runtime source records

### source.qq20261102a.wses

Pisano M, Allievi N, Gurusamy K, et al. 2020 World Society of Emergency Surgery updated guidelines for acute calculous cholecystitis. World J Emerg Surg. 2020;15:61.

- Organization/journal: World Journal of Emergency Surgery
- Authors: Pisano M; Allievi N; Gurusamy K; et al.
- Year: 2020
- DOI: 10.1186/s13017-020-00336-x; official/source URL: [source](https://link.springer.com/article/10.1186/s13017-020-00336-x).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Creative Commons Attribution 4.0; `cc_by_4_0`. Article-specific CC BY 4.0 verified on publisher record. https://creativecommons.org/licenses/by/4.0/. Original factual synthesis with citation; no source prose, algorithms, tables or figures copied/adapted.
- Authority/intended use (evidence): Current openly licensed WSES guideline: components of clinical inflammation and imaging must be integrated; no single ultrasound observation excludes acute disease. Same publication as source.qq20261028.wses-cholecystitis-2020; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.gallbladder-filling-versus-emptying`

### source.qq20261102a.snm-hida

Tulchinsky M, Ciak BW, Delbeke D, Hilson A, Holes-Lewis KA, Stabin MG, Ziessman HA. SNM Practice Guideline for Hepatobiliary Scintigraphy 4.0. J Nucl Med Technol. 2010;38(4):210-218. doi:10.2967/jnmt.110.082289.

- Organization/journal: Society of Nuclear Medicine / Journal of Nuclear Medicine Technology
- Authors: Mark Tulchinsky; Brian W Ciak; Dominique Delbeke; Andrew Hilson; Kelly A Holes-Lewis; Michael G Stabin; Harvey A Ziessman
- Year: 2010
- DOI: 10.2967/jnmt.110.082289; official/source URL: [source](https://tech.snmjournals.org/content/jnmt/38/4/210.full.pdf).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Copyright society; targeted verification only; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Public full PDF parsed through the research index; direct journal fetch returned 403. Distinguishes filling/nonvisualization from stimulated emptying; preparation, false positives and technical limitations remain relevant. The newer public-comment draft is not treated as an adopted guideline.
- Supported claim IDs: `claim.qq20261102a.gallbladder-filling-versus-emptying`

### source.qq20261102a.pitarch

Pitarch M, Alcantara R, Comerma L, Vazquez de Las Heras I, Azcona J, Wiedemann A, Prutki M, Fallenberg EM. An update on multimodal imaging strategies for nipple discharge: from detection to decision. Insights Imaging. 2025;16:70. doi:10.1186/s13244-025-01947-1.

- Organization/journal: Insights into Imaging
- Authors: Mireia Pitarch; Rodrigo Alcantara; Laura Comerma; Ivonne Vazquez de Las Heras; Javier Azcona; Antonia Wiedemann; Maja Prutki; Eva Maria Fallenberg
- Year: 2025
- DOI: 10.1186/s13244-025-01947-1; official/source URL: [source](https://link.springer.com/article/10.1186/s13244-025-01947-1).
- Access date: 2026-11-02; source class: `narrative_review`.
- License/reuse: CC BY 4.0 (publisher rights statement checked); `cc_by_4_0`. https://creativecommons.org/licenses/by/4.0/ . Original factual synthesis with attribution; no copied prose, figures, algorithms or case examples. No source text stored.
- Authority/intended use (both): Open peer-reviewed imaging review: integrate spontaneous unilateral discharge separately from expressed bilateral secretion; initial mammography/targeted ultrasound and later problem-solving MRI. Same publication as source.qq20261029.pitarch-discharge-2025; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.mixed-discharge-local-assessment`, `claim.qq20261102a.initial-breast-pathway`

### source.qq20261102a.reglan-label

ANI Pharmaceuticals, Inc. REGLAN (metoclopramide) tablets: FDA-approved prescribing information, revised February 2026, section 5.7. DailyMed set de55c133-eb08-4a35-91a2-5dc093027397, version 8.

- Organization/journal: ANI Pharmaceuticals / FDA label published by NIH DailyMed
- Authors: ANI Pharmaceuticals, Inc.
- Year: 2026
- DOI: none stated; official/source URL: [source](https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=de55c133-eb08-4a35-91a2-5dc093027397&type=display).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: Government-hosted manufacturer label; underlying labeling rights/conditions apply; `public_domain_conditions_apply`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Primary regulatory label directly supports prolactin elevation and reported galactorrhea. Government hosting is recorded separately from manufacturer copyright; no dosing or implied breast-cancer causation is authored.
- Supported claim IDs: `claim.qq20261102a.mixed-discharge-medication`

### source.qq20261102a.nysdoh-hiv

Shin SJ, Vail R, Shah S, Fine SM, McGowan JP, Merrick ST, Radix AE, Rodrigues JC, Hoffmann CJ, Norton BL, Gonzalez CJ; NYSDOH AIDS Institute. Perioperative Care in Adults With HIV. Clinical Guidelines Program; November 4, 2024.

- Organization/journal: New York State Department of Health AIDS Institute
- Authors: Sangyoon Jason Shin; Rona Vail; Sanjiv Shah; Steven M Fine; Joseph P McGowan; Samuel T Merrick; Asa E Radix; Jessica Rodrigues; Christopher J Hoffmann; Brianna L Norton; Charles J Gonzalez
- Year: 2024
- DOI: none stated; official/source URL: [source](https://www.hivguidelines.org/guideline/hiv-perioperative/).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: Government guidance; site and third-party reuse conditions apply; `public_domain_conditions_apply`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Current public perioperative guidance, read in full targeted sections. Direct route-specific midazolam and coordinated ART-continuity support; no fixed dose or washout invented. NIH PI table direct fetch was blocked, so no new claim relies on its inaccessible snippet.
- Supported claim IDs: `claim.qq20261102a.boosted-midazolam-routes`, `claim.qq20261102a.boosted-parenteral-titration`, `claim.qq20261102a.art-continuity`

### source.qq20261102a.chicago

Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.

- Organization/journal: Neurogastroenterology and Motility / International High-Resolution Manometry Working Group
- Authors: Rena Yadlapati; Peter J Kahrilas; Mark R Fox; Albert J Bredenoord; C Prakash Gyawali; Sabine Roman; et al.
- Year: 2021
- DOI: 10.1111/nmo.14058; official/source URL: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/).
- Access date: 2026-11-02; source class: `peer_reviewed_guideline`.
- License/reuse: Copyrighted expert consensus; public author manuscript, reusable license not established; `copyrighted_targeted_verification_only`. PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.
- Authority/intended use (evidence): Primary classification consensus checked in the accessible complete manuscript: primary-position achalasia criterion, absent normal peristalsis, pressurization/spasm distinction and failed DCI below 100 mmHg.s.cm. Same publication as source.qq20261102.chicago-v4; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.pressure-not-peristalsis`, `claim.qq20261102a.primary-position-achalasia`, `claim.qq20261102a.spastic-achalasia`, `claim.qq20261102a.failed-contraction-threshold`, `claim.qq20261102a.esophageal-physiology-sequence`

### source.qq20261102a.seoul

Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. Journal of Neurogastroenterology and Motility. 2020;26(2):180-203. Published 2020-04-30. doi:10.5056/jnm20014. PMID:32235027.

- Organization/journal: Journal of Neurogastroenterology and Motility / Korean Society of Neurogastroenterology and Motility
- Authors: Jung HK; Hong SJ; Lee OY; Pandolfino J; Park H; Miwa H; Ghoshal UC; Mahadeva S; et al.
- Year: 2020
- DOI: 10.5056/jnm20014; official/source URL: [source](https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Creative Commons Attribution-NonCommercial 4.0 International; `cc_by_nc_4_0_restricted`. Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.
- Authority/intended use (evidence): Independent guideline corroborates pressure-study classification following structural assessment; FLIP and reflux testing are not represented as complete substitutes for ordinary HRM classification. Same publication as source.sc.seoul-achalasia-2020; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.pressure-not-peristalsis`, `claim.qq20261102a.spastic-achalasia`, `claim.qq20261102a.esophageal-physiology-sequence`

### source.qq20261102a.hernia2018

The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. doi:10.1007/s10029-017-1668-x. PMID:29330835. PMCID:PMC5809582.

- Organization/journal: Hernia / HerniaSurge Group
- Authors: The HerniaSurge Group
- Year: 2018
- DOI: 10.1007/s10029-017-1668-x; official/source URL: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Creative Commons Attribution-NonCommercial 4.0 International; `cc_by_nc_4_0_restricted`. Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or algorithms reproduced.
- Authority/intended use (evidence): International guideline: ultrasound in uncertain clinical examination, dynamic cross-sectional imaging when unresolved; symptoms/function affect observation-versus-repair planning. Same publication as source.bread-butter.herniasurge-2018; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.groin-initial-dynamic-assessment`, `claim.qq20261102a.symptomatic-groin-planning`

### source.qq20261102a.hernia2023

Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080. doi:10.1093/bjsopen/zrad080. PMID:37862616.

- Organization/journal: BJS Open / HerniaSurge Collaboration
- Authors: Cesare Stabilini; Nadine van Veenendaal; Eske Aasvang; Ferdinando Agresta; Theo Aufenacker; Frederik Berrevoet; Ine Burgmans; David Chen; Andrew de Beaux; Barbora East; José Garcia-Alamino; Nadia Henriksen; Ferdinand Köckerling; Jan Kukleta; Maarten Loos; Manuel Lopez-Cano; Ralph Lorenz; Marc Miserez; Agneta Montgomery; Salvador Morales-Conde; Chris Oppong; Maciej Pawlak; Mauro Podda; Wolfgang Reinpold; David Sanders; Alberto Sartori; Hanh Minh Tran; Mireia Verdaguer; Reiko Wiessner; Michael Yeboah; Willem Zwaans; Maarten Simons
- Year: 2023
- DOI: 10.1093/bjsopen/zrad080; official/source URL: [source](https://academic.oup.com/bjsopen/article/7/5/zrad080/7325871).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Creative Commons Attribution 4.0 International; `cc_by_4_0`. Original factual synthesis with citation; no source prose, tables, figures, or algorithms reproduced.
- Authority/intended use (cross_check): Current update cross-check for watchful-waiting scope and later crossover; no invented operative threshold. Same publication as source.bread-butter.herniasurge-update-2023; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.groin-initial-dynamic-assessment`, `claim.qq20261102a.symptomatic-groin-planning`

### source.qq20261102a.ata2025

Ringel MD, Sosa JA, Baloch Z, Bischoff L, Bloom G, Brent GA, et al. 2025 American Thyroid Association Management Guidelines for Adult Patients with Differentiated Thyroid Cancer. Thyroid. 2025;35(8):841-985. doi:10.1177/10507256251363120.

- Organization/journal: American Thyroid Association / Thyroid
- Authors: Matthew D Ringel; Julie Ann Sosa; Zubair Baloch; Lindsay Bischoff; Gary Bloom; Gregory A Brent; et al.
- Year: 2025
- DOI: 10.1177/10507256251363120; official/source URL: [source](https://thyca.org/wp-content/uploads/DTCGuidelines.pdf).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Copyright American Thyroid Association; targeted verification only; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Full public guideline on the patient-advocacy organization's site; recommendation 7 supports initial central/lateral nodal ultrasound; CT/MRI adjuncts for extensive/invasive disease, not an assertion that they are never appropriate.
- Supported claim IDs: `claim.qq20261102a.papillary-cytology-regional-survey`

### source.qq20261102a.ptc-cytology

Harahap AS, Jung CK. Cytologic hallmarks and differential diagnosis of papillary thyroid carcinoma subtypes. J Pathol Transl Med. 2024;58(6):265-282. doi:10.4132/jptm.2024.10.11.

- Organization/journal: Journal of Pathology and Translational Medicine
- Authors: Agnes Stephanie Harahap; Chan Kwon Jung
- Year: 2024
- DOI: 10.4132/jptm.2024.10.11; official/source URL: [source](https://www.jpatholtm.org/journal/view.php?number=17133).
- Access date: 2026-11-02; source class: `narrative_review`.
- License/reuse: CC BY-NC 4.0; publisher notice checked; `cc_by_nc_4_0_restricted`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Noncommercial restriction retained; https://creativecommons.org/licenses/by-nc/4.0/ . No article adaptation distributed.
- Authority/intended use (evidence): Open pathology review, checked on publisher HTML after PMC captcha. Multiple nuclear and architectural findings, not a single groove, support papillary interpretation; no image or classification table reproduced.
- Supported claim IDs: `claim.qq20261102a.papillary-cytology-pattern`

### source.qq20261102a.eado2024

Garbe C, Amaral T, Peris K, Hauschild A, Arenberger P, Basset-Seguin N, et al.; EADO, EDF and EORTC. European consensus-based interdisciplinary guideline for melanoma. Part 1: Diagnostics - Update 2024. Eur J Cancer. 2025;215:115152. doi:10.1016/j.ejca.2024.115152.

- Organization/journal: EADO / EDF / EORTC / European Journal of Cancer
- Authors: Claus Garbe; Teresa Amaral; Ketty Peris; Axel Hauschild; Petr Arenberger; Nicole Basset-Seguin; et al.
- Year: 2025
- DOI: 10.1016/j.ejca.2024.115152; official/source URL: [source](https://eado.org/files/2025/01/2024-EADO-CMGuideline-Diagnostics-EJC.pdf).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Copyright Elsevier; freely available society PDF; targeted verification only; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Complete publicly parsed society PDF read despite direct-fetch redirect loop. Valid through end 2026. Supports integrated depth/clinical nodal assessment, ultrasound not substituting for sentinel staging, and complete diagnostic excision when feasible.
- Supported claim IDs: `claim.qq20261102a.melanoma-integrated-node-staging`, `claim.qq20261102a.melanoma-diagnostic-sampling`

### source.qq20261102a.nci-melanoma

PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.

- Organization/journal: National Cancer Institute PDQ
- Authors: PDQ Adult Treatment Editorial Board
- Year: 2025
- DOI: none stated; official/source URL: [source](https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: United States government factual material; NCI and PDQ reuse conditions apply; `public_domain_conditions_apply`. Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.
- Authority/intended use (evidence): Independent federal professional evidence summary supports diagnostic depth assessment and sentinel staging in the supplied thickness range; this does not promise a survival benefit. Same publication as source.sc.nci-melanoma-pdq-2025; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.melanoma-integrated-node-staging`, `claim.qq20261102a.melanoma-diagnostic-sampling`

### source.qq20261102a.ascrs-colon

Vogel JD, Felder SI, Bhama AR, Hawkins AT, Langenfeld SJ, Shaffer VO, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Colon Cancer. Dis Colon Rectum. 2022;65(2):148-177. doi:10.1097/DCR.0000000000002323.

- Organization/journal: American Society of Colon and Rectal Surgeons / Diseases of the Colon and Rectum
- Authors: Jon D Vogel; Scott I Felder; Anuradha R Bhama; Alexander T Hawkins; Sean J Langenfeld; Vaughn O Shaffer; et al.
- Year: 2022
- DOI: 10.1097/DCR.0000000000002323; official/source URL: [source](https://fascrs.org/ascrs/media/files/downloads/2022-Colon-Cancer-CPG.pdf).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Copyright ASCRS; targeted verification only; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Complete official PDF parsed via indexed source; direct request intermittently 404. Malignant-polyp histology/completeness and initial CT staging facts checked. Chest CT plus abdominal MRI is also valid and is deliberately not keyed wrong. AGA/ASGE independent guidance could not be retrieved; the new management claim has one verified guideline.
- Supported claim IDs: `claim.qq20261102a.malignant-polyp-adverse-features`, `claim.qq20261102a.colon-systemic-staging`

### source.qq20261102a.essr2023

Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.

- Organization/journal: European Radiology
- Authors: Noebauer-Huhmann IM; Vanhoenacker FM; Vilanova JC; et al.
- Year: 2024
- DOI: 10.1007/s00330-023-10425-5; official/source URL: [source](https://link.springer.com/article/10.1007/s00330-023-10425-5).
- Access date: 2026-11-02; source class: `peer_reviewed_guideline`.
- License/reuse: Creative Commons Attribution 4.0 International; `cc_by_4_0`. Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .
- Authority/intended use (both): Current ESSR consensus checked in full publisher HTML; MRI characterization/local staging of a deep or indeterminate limb lesion and referral before biopsy. Older ESSR targeting guidance is cross-checked, not a substitute for this current guideline. Same publication as source.essr.soft-tissue-imaging.2024; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.sarcoma-local-imaging`

### source.qq20261102a.seom2024

Serrano C, Arregui M, Carrasco I, et al. SEOM-GEIS Spanish clinical guidelines for the management of soft-tissue sarcomas (2024). Clinical and Translational Oncology. 2025;27(4):1460-1471. doi:10.1007/s12094-024-03842-5.

- Organization/journal: Spanish Society of Medical Oncology and Spanish Group for Sarcoma Research; Clinical and Translational Oncology
- Authors: Cesar Serrano; Marta Arregui; Irene Carrasco; Nadia Hindi; Javier Martinez-Trufero; Jeronimo Martinez-Garcia; Aurea Molina; Ana Paisan; Raul Sanchez; Maria Angeles Sala
- Year: 2025
- DOI: 10.1007/s12094-024-03842-5; official/source URL: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC12000159/).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Creative Commons Attribution 4.0 International; `cc_by_4_0`. Use independently written factual synthesis with attribution; do not copy source prose, tables, figures, or algorithms.
- Authority/intended use (both): Independent society guideline for contrast MRI and coordinated image-guided core biopsy; specific viable-area selection additionally checked in ESSR technique guidance. Same publication as source.seom-geis.soft-tissue-sarcoma-guideline.2024; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.sarcoma-viable-biopsy-target`, `claim.qq20261102a.sarcoma-local-imaging`

### source.qq20261102a.essr2015-target

Noebauer-Huhmann IM, et al. Soft Tissue Tumors in Adults: ESSR-Approved Guidelines for Diagnostic Imaging. Semin Musculoskelet Radiol. 2015;19(5):475-482. doi:10.1055/s-0035-1569251.

- Organization/journal: European Society of Musculoskeletal Radiology / Seminars in Musculoskeletal Radiology
- Authors: Iris-Melanie Noebauer-Huhmann; et al.
- Year: 2015
- DOI: 10.1055/s-0035-1569251; official/source URL: [source](https://pure.amsterdamumc.nl/ws/files/173173752/Soft-tissue-tumors-in-adults-essr-approved-guidelines-for-diagnostic-imaging.pdf).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Copyright Thieme; public institutional copy; targeted verification only; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Older primary society technique guidance, complete PDF checked: target viable areas identified by enhancement/Doppler, coordinate route. Current ESSR and SEOM local-imaging/core guidance independently corroborate the general pathway; no invented needle size or timing.
- Supported claim IDs: `claim.qq20261102a.sarcoma-viable-biopsy-target`

### source.qq20261102a.esge-sel2022

Deprez PH, Moons LMG, O'Toole D, Gincul R, Seicean A, Pimentel-Nunes P, et al. Endoscopic management of subepithelial lesions including neuroendocrine neoplasms: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2022;54(4):412-429. doi:10.1055/a-1751-5742.

- Organization/journal: European Society of Gastrointestinal Endoscopy / Endoscopy
- Authors: Pierre H Deprez; Leon MG Moons; Dermot O'Toole; Rodica Gincul; Andrada Seicean; Pedro Pimentel-Nunes; et al.
- Year: 2022
- DOI: 10.1055/a-1751-5742; official/source URL: [source](https://www.esge.com/assets/downloads/pdfs/guidelines/2022_a-1751-5742.pdf).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Copyright ESGE; all rights reserved; targeted verification only; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Complete public guideline checked: layer/echogenicity informs interpretation; characteristic lipoma is homogeneous hyperechoic submucosal tissue, and confidently characterized asymptomatic lipoma needs no lesion-specific follow-up. Do not generalize all SELs as diagnostic by EUS.
- Supported claim IDs: `claim.qq20261102a.subepithelial-integrated-pattern`

### source.qq20261102a.korean-gastric

Kim IH, Kang SJ, Choi W, et al. Korean Practice Guidelines for Gastric Cancer 2024: An Evidence-based, Multidisciplinary Approach (Update of 2022 Guideline). J Gastric Cancer. 2025;25(1):5-114. doi:10.5230/jgc.2025.25.e11.

- Organization/journal: Journal of Gastric Cancer / Korean Gastric Cancer Association
- Authors: In-Ho Kim; Seung Joo Kang; Wonyoung Choi; Development Working Group for the Korean Practice Guideline for Gastric Cancer 2024 Task Force Team
- Year: 2025
- DOI: 10.5230/jgc.2025.25.e11; official/source URL: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC11739648/).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Creative Commons Attribution-NonCommercial 4.0; `cc_by_nc_4_0_restricted`. Use for factual synthesis with attribution. Do not reproduce guideline tables, flowcharts, figures, or extended prose.
- Authority/intended use (evidence): Current full open guideline rechecked: D2 framework and avoidance of prophylactic splenectomy in the represented proximal tumor without greater-curvature invasion. This independently checked rule does not resolve the separately withheld contradictory JGCA2025 hilar wording. Same publication as source.korean-gastric-cancer-guideline.2024; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.gastric-depth-nodes-organ-plan`, `claim.qq20261102a.gastric-spleen-preservation`

### source.qq20261102a.jgca2021

Japanese Gastric Cancer Association. Japanese Gastric Cancer Treatment Guidelines 2021 (6th edition). Gastric Cancer. 2023;26(1):1-25. doi:10.1007/s10120-022-01331-8.

- Organization/journal: Gastric Cancer / Japanese Gastric Cancer Association
- Authors: Japanese Gastric Cancer Association
- Year: 2023
- DOI: 10.1007/s10120-022-01331-8; official/source URL: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC9813208/).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Creative Commons Attribution 4.0; `cc_by_4_0`. Use for independently written factual synthesis with attribution. Do not reproduce guideline tables, algorithms, or figures.
- Authority/intended use (cross_check): Independent stage-based surgical scope and organ-preservation cross-check; no station-10 rule reproduced. Same publication as source.japanese-gastric-cancer-guideline.2021; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.gastric-depth-nodes-organ-plan`, `claim.qq20261102a.gastric-spleen-preservation`

### source.qq20261102a.bsh-mzl

Walewska R, Eyre TA, Barrington S, Brady J, Fields P, Iyengar S, et al.; British Society of Haematology. Guideline for the diagnosis and management of marginal zone lymphomas. Br J Haematol. 2024;204(1):86-107. doi:10.1111/bjh.19064. First published November 13, 2023.

- Organization/journal: British Society of Haematology / British Journal of Haematology
- Authors: Renata Walewska; Toby A Eyre; Sally Barrington; Jessica Brady; Paul Fields; Sunil Iyengar; et al.
- Year: 2024
- DOI: 10.1111/bjh.19064; official/source URL: [source](https://b-s-h.org.uk/media/x0bbg4bs/guideline-for-the-diagnosis-and-management-of-marginal-zone-lymphomas-a-british-society.pdf).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Copyright BSH/Wiley; targeted verification only; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Full public society PDF read. Tissue morphology/architecture plus immunophenotype, repeat endoscopy if uncertain, clonality not sufficient in isolation, and gastric histologic response assessment. Marker exceptions and expert pathology review remain explicit.
- Supported claim IDs: `claim.qq20261102a.gastric-lineage-not-classification`, `claim.qq20261102a.gastric-malt-response-assessment`, `claim.qq20261102a.gastric-small-b-cell-differential`

### source.qq20261102a.malt2023

Matysiak-Budnik T, Priadko K, Bossard C, Chapelle N, Ruskoné-Fourmestraux A. Clinical Management of Patients with Gastric MALT Lymphoma: A Gastroenterologist's Point of View. Cancers (Basel). 2023;15(15):3811. doi:10.3390/cancers15153811.

- Organization/journal: Cancers
- Authors: Tamara Matysiak-Budnik; Kateryna Priadko; Céline Bossard; Nicolas Chapelle; Agnès Ruskoné-Fourmestraux
- Year: 2023
- DOI: 10.3390/cancers15153811; official/source URL: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10417821/).
- Access date: 2026-11-02; source class: `narrative_review`.
- License/reuse: Creative Commons Attribution 4.0 International; `cc_by_4_0`. Use with attribution and independently written synthesis. Do not reproduce source images, tables, or prose.
- Authority/intended use (both): Independent open peer-reviewed gastric MALT review cross-check for representative biopsy, integrated classification and eradication/serial histologic response assessment. Same publication as source.matysiak-budnik-gastric-malt-management.2023; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.gastric-lineage-not-classification`, `claim.qq20261102a.gastric-malt-response-assessment`, `claim.qq20261102a.gastric-small-b-cell-differential`

### source.qq20261102a.nist-p

National Institute of Standards and Technology. Engineering Statistics Handbook: Critical values and p values. Accessed 2026-09-29.

- Organization/journal: National Institute of Standards and Technology
- Authors: National Institute of Standards and Technology
- Year: undated, not inferred
- DOI: none stated; official/source URL: [source](https://www.itl.nist.gov/div898/handbook/prc/section1/prc131.htm).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; `copyrighted_targeted_verification_only`. Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Authority/intended use (evidence): Public primary government methodology rechecked: prespecified hypothesis testing; p is not an effect-size or equivalence decision. Same publication as source.nist.p-values.2026; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.null-test-versus-protocol-magnitude`

### source.qq20261102a.nist-ci

National Institute of Standards and Technology. Engineering Statistics Handbook: What are confidence intervals? Accessed 2026-09-29.

- Organization/journal: National Institute of Standards and Technology
- Authors: National Institute of Standards and Technology
- Year: undated, not inferred
- DOI: none stated; official/source URL: [source](https://www.itl.nist.gov/div898/handbook/prc/section1/prc14.htm).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; `copyrighted_targeted_verification_only`. Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Authority/intended use (evidence): Public primary government methodology for interval interpretation; no probability assigned to a fixed true value, no hard truth bounds inferred. Same publication as source.nist.confidence-intervals.2026; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.null-test-versus-protocol-magnitude`, `claim.qq20261102a.relative-to-absolute-interval`

### source.qq20261102a.lakens2017

Lakens D. Equivalence Tests: A Practical Primer for t Tests, Correlations, and Meta-Analyses. Soc Psychol Personal Sci. 2017;8(4):355-362. doi:10.1177/1948550617697177.

- Organization/journal: Social Psychological and Personality Science
- Authors: Daniel Lakens
- Year: 2017
- DOI: 10.1177/1948550617697177; official/source URL: [source](https://pure.tue.nl/ws/portalfiles/portal/80918653/lakeequi2017.pdf).
- Access date: 2026-11-02; source class: `open_educational_resource`.
- License/reuse: Copyright author/publisher; institutional private-research access; no CC license established; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Complete version-of-record PDF checked. TOST at alpha .05 uses a 90% interval within specified equivalence bounds; nonsignificance alone is not equivalence. No source spreadsheet, worked example or prose copied. The fictional protocol's margins are author-specified inputs, not medical thresholds.
- Supported claim IDs: `claim.qq20261102a.null-test-versus-protocol-magnitude`

### source.qq20261102a.dhsc-odds

Department of Health and Social Care. Public Health Technical Guidance: Odds ratio and relative risk; and Proportions and odds. Undated live technical guidance. Accessed November 2, 2026.

- Organization/journal: UK Department of Health and Social Care
- Authors: Department of Health and Social Care
- Year: undated, not inferred
- DOI: none stated; official/source URL: [source](https://fingertips.phe.org.uk/static-reports/public-health-technical-guidance/Basic_statistics/Odds_ratios_relative_risk.html).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: Government public-sector information; OGL and third-party conditions apply; `public_domain_conditions_apply`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Government definitions of ratios/risk and linked odds definition support elementary conversions. Conditional covariate-profile baseline is explicit; no adjusted-to-marginal causal-risk claim is made.
- Supported claim IDs: `claim.qq20261102a.odds-to-risk-conversion`, `claim.qq20261102a.relative-to-absolute-interval`

### source.qq20261102a.bsg-sedation

Sidhu R, Turnbull D, Haboubi H, Leeds JS, Healey C, Hebbar S, et al. British Society of Gastroenterology guidelines on sedation in gastrointestinal endoscopy. Gut. 2024;73:219-245. doi:10.1136/gutjnl-2023-330396.

- Organization/journal: British Society of Gastroenterology / Gut
- Authors: Reena Sidhu; Duncan Turnbull; Haboubi H; John S Leeds; Chris Healey; Srisha Hebbar; et al.
- Year: 2024
- DOI: 10.1136/gutjnl-2023-330396; official/source URL: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10850688/).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Public guideline manuscript; reuse license not assumed; targeted verification only; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Full guideline checked: formal recovery/discharge assessment, responsible adult support, and re-sedation after flumazenil because midazolam action outlasts reversal. No exact observation/discharge duration authored.
- Supported claim IDs: `claim.qq20261102a.sedation-supported-discharge`, `claim.qq20261102a.sedation-after-reversal`

### source.qq20261102a.ksge

Oh CH, Lee JK, Song TJ, Park JS, Lee JM, Son JH, et al. Clinical Endoscopy. 2021;54(4):505-521. doi:10.5946/ce.2021.185.

- Organization/journal: Korean Society of Gastrointestinal Endoscopy
- Authors: Oh CH; Lee JK; Song TJ; Park JS; Lee JM; Son JH; et al.
- Year: 2021
- DOI: 10.5946/ce.2021.185; official/source URL: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC8357592/).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Creative Commons Attribution-NonCommercial 3.0; `copyrighted_targeted_verification_only`. Noncommercial independent factual synthesis with attribution; no figures, tables, or prose reused. The source's CC BY-NC 3.0 license does not match the schema's CC BY-NC 4.0 enum, so the conservative copyrighted status is recorded.
- Authority/intended use (cross_check): Full society guidance rechecked: symptoms/obstruction support drainage, endoscopic assessment for apposed collections, CT/MRCP for anatomy/vessels and EUS access verification. Imaging does not authorize immediate puncture; MRI remains a valid alternative outside the offered CT-protocol comparison. Same publication as source.ksge.pancreatic-fluid-collections.2021; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.pancreatic-contrast-characterization`, `claim.qq20261102a.collection-symptom-attribution`

### source.qq20261102a.ahrq-pdca

Agency for Healthcare Research and Quality. Plan-Do-Check-Act Cycle. Accessed 2026-09-29.

- Organization/journal: Agency for Healthcare Research and Quality
- Authors: Agency for Healthcare Research and Quality
- Year: undated, not inferred
- DOI: none stated; official/source URL: [source](https://digital.ahrq.gov/health-it-tools-and-resources/evaluation-resources/workflow-assessment-health-it-toolkit/all-workflow-tools/plan-do-check-act-cycle).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; `copyrighted_targeted_verification_only`. Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Authority/intended use (evidence): Public primary QI tool rechecked: test, study outcome and iterate. Does not define a universal abandon rule from lack of benefit. Same publication as source.ahrq.pdca.2026; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.pdsa-outcome-balancing-adaptation`

### source.qq20261102a.ahrq-metrics

Agency for Healthcare Research and Quality. Chapter 6. Track Performance with Metrics. Last reviewed May 2016. Accessed 2026-09-29.

- Organization/journal: Agency for Healthcare Research and Quality
- Authors: Agency for Healthcare Research and Quality
- Year: 2016
- DOI: none stated; official/source URL: [source](https://www.ahrq.gov/patient-safety/settings/hospital/vtguide/guide6.html).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: Targeted factual verification only; record-level reuse permission was not separately verified.; `copyrighted_targeted_verification_only`. Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.
- Authority/intended use (evidence): Independent government measures guidance supports distinguishing process uptake, clinical outcomes and balancing burden. All B36 counts/time observations are constructed fictional process data. Same publication as source.ahrq.qi-measures.2026; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.pdsa-outcome-balancing-adaptation`

### source.qq20261102a.ibc-consensus

Dawood S, Merajver SD, Viens P, Vermeulen PB, Swain SM, Buchholz TA, et al. International expert panel on inflammatory breast cancer: consensus statement for standardized diagnosis and treatment. Ann Oncol. 2011;22(3):515-523. doi:10.1093/annonc/mdq345. PMID:20603440. PMCID:PMC3105293.

- Organization/journal: Annals of Oncology
- Authors: Dawood S; Merajver SD; Viens P; Vermeulen PB; Swain SM; Buchholz TA; et al.
- Year: 2011
- DOI: 10.1093/annonc/mdq345; official/source URL: [source](https://pubmed.ncbi.nlm.nih.gov/20603440/).
- Access date: 2026-11-02; source class: `peer_reviewed_guideline`.
- License/reuse: Copyrighted journal article; `copyrighted_targeted_verification_only`. Targeted factual verification and citation only; no diagnostic table, algorithm, or source phrasing reproduced.
- Authority/intended use (evidence): Primary international consensus already directly verified: core invasive-carcinoma confirmation with skin punch as adjunct, not interchangeable proof; underlying claim/limitations retained. Same publication as source.brief.dawood-ibc-consensus-2011; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.ibc-core-versus-adjunctive-skin`

### source.qq20261102a.nci-ibc

National Cancer Institute. Inflammatory Breast Cancer. Updated December 2, 2025. Accessed September 17, 2026.

- Organization/journal: National Cancer Institute
- Authors: National Cancer Institute
- Year: 2025
- DOI: none stated; official/source URL: [source](https://www.cancer.gov/types/breast/breast-cancer-types/inflammatory).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: United States government factual material; NCI reuse conditions and third-party exclusions apply; `public_domain_conditions_apply`. Original factual synthesis with NCI attribution; third-party images, marks, and copied page prose excluded.
- Authority/intended use (cross_check): Federal diagnosis page rechecked; breast/skin tissue investigation and subsequent staging after cancer confirmation. Same publication as source.brief.nci-ibc-diagnosis-2025; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.ibc-core-versus-adjunctive-skin`

### source.qq20261102a.nci-ibc-treatment

National Cancer Institute. Inflammatory Breast Cancer Treatment. Posted December 2, 2025. Accessed November 2, 2026.

- Organization/journal: National Cancer Institute, NIH
- Authors: National Cancer Institute
- Year: 2025
- DOI: none stated; official/source URL: [source](https://www.cancer.gov/types/breast/treatment/inflammatory-breast-cancer).
- Access date: 2026-11-02; source class: `government_guidance`.
- License/reuse: Government information; NCI reuse and third-party conditions apply; `public_domain_conditions_apply`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Current full federal page: stage III systemic therapy, modified radical mastectomy, postoperative radiation. Clinical response does not by itself change the represented pathway; AGO independently corroborates response independence.
- Supported claim IDs: `claim.qq20261102a.ibc-response-local-treatment`

### source.qq20261102a.ago2024

Park-Simon TW, et al.; AGO Breast Committee. Arbeitsgemeinschaft Gynakologische Onkologie Recommendations for the Diagnosis and Treatment of Patients with Early Breast Cancer: Update 2024. Breast Care. 2024;19:165-182. doi:10.1159/000538596.

- Organization/journal: AGO Breast Committee / Breast Care
- Authors: Tjoung-Won Park-Simon; AGO Breast Committee; et al.
- Year: 2024
- DOI: 10.1159/000538596; official/source URL: [source](https://pmc.ncbi.nlm.nih.gov/articles/PMC11182637/pdf/brc-2024-0019-0003-538596.pdf).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Copyright Karger; public PDF; targeted verification only; `copyrighted_targeted_verification_only`. Targeted factual verification and independently written synthesis only. No source prose, tables, figures, algorithms, examples or full text retained. Public access is not permission to copy or to ingest a prohibited corpus; no reusable rights are assumed.
- Authority/intended use (evidence): Full public PDF checked for IBC-specific trimodality regardless of neoadjuvant clinical response; no assumption that ordinary non-IBC breast de-escalation applies.
- Supported claim IDs: `claim.qq20261102a.ibc-response-local-treatment`

### source.qq20261102a.esge-ulcer

Gralnek IM, Morris J, Laursen SB, Camus M, Tziatzios G, Debels LK, et al. Endoscopic diagnosis and management of peptic ulcer bleeding: European Society of Gastrointestinal Endoscopy (ESGE) Guideline - Update 2026. Endoscopy. 2026;58(8):899-924. doi:10.1055/a-2863-8314.

- Organization/journal: European Society of Gastrointestinal Endoscopy / Endoscopy
- Authors: Ian M Gralnek; John Morris; Stig Borbjerg Laursen; Marine Camus; Georgios Tziatzios; Lynn K Debels; et al.
- Year: 2026
- DOI: 10.1055/a-2863-8314; official/source URL: [source](https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2863-8314.pdf).
- Access date: 2026-11-02; source class: `professional_society_guideline`.
- License/reuse: Copyright ESGE; freely readable professional guidance, all rights reserved; `copyrighted_targeted_verification_only`. Targeted verification of hemostasis/PPI and rescue embolization only. No article text, algorithm, tables, illustrations, appendices, exact regimen or dosing schedule stored or reproduced.
- Authority/intended use (evidence): Current complete ESGE2026 PDF rechecked: visible-vessel mechanical/thermal therapy, no epinephrine monotherapy; topical agents have rescue/temporizing roles and are not routine sole initial treatment for the represented vessel. Existing ACG claim supplies independent hemostasis indication. Same publication as source.qq20261102.esge-ulcer-2026; this recheck is not an independent second source.
- Supported claim IDs: `claim.qq20261102a.ulcer-local-modality-choice`

## Metadata-only correction check

Stable ID: `source.qq20261102a.ata2025-corrigendum-check`. SAGE Publications. Corrigendum to: 2025 American Thyroid Association Management Guidelines for Adult Patients with Differentiated Thyroid Cancer. Thyroid. 2025;35(11):1350. doi:10.1177/10507256251387671. [Public correction](https://pmc.ncbi.nlm.nih.gov/articles/PMC13521431/). Accessed 2026-11-02. Class: correction; copyright SAGE, targeted verification only, no open reuse license inferred. No named byline is supplied. Intended use: verify whether the retrieved correction changes the preoperative ultrasound claim. It corrects affiliations/byline, not recommendation 7. Cross-check target: `claim.qq20261102a.papillary-cytology-regional-survey`; not counted as independent clinical evidence.

## Atomic claims and limitations

| Claim ID | Independently written statement | Supporting source IDs | Category / certainty | Limitation |
|---|---|---|---|---|
| claim.qq20261102a.gallbladder-filling-versus-emptying | Gallbladder-filling scintigraphy evaluates cystic-duct patency, whereas stimulated ejection fraction evaluates gallbladder emptying. | source.qq20261102a.snm-hida, source.qq20261102a.wses | evaluation / moderate | One technique-specific guideline plus an independent acute-disease guideline. Normal ultrasound wall/fluid components do not exclude acute disease; a universal HIDA-over-every-CT/MRI ranking is not asserted. |
| claim.qq20261102a.mixed-discharge-medication | Metoclopramide can increase prolactin and produce galactorrhea. | source.qq20261102a.reglan-label | presentation / moderate | Primary regulatory label only for this drug fact; no dose, timing or causation of a focal breast lesion claimed. Separate existing discharge claims support assessment of spontaneous unilateral episodes. |
| claim.qq20261102a.mixed-discharge-local-assessment | Spontaneous unilateral nipple discharge warrants breast-local assessment rather than being explained away by expressed bilateral secretion. | source.qq20261102a.pitarch | evaluation / moderate | Application synthesized from the separate pattern definitions in one open review, not a reported mixed-phenotype trial. Color alone is not a malignancy diagnosis; the medication-associated component can coexist. |
| claim.qq20261102a.initial-breast-pathway | In women over 40 with a pathologic discharge pattern, initial mammography is generally combined with ultrasound; MRI has a subsequent problem-solving role. | source.qq20261102a.pitarch | evaluation / moderate | One current open imaging review, cross-checked against retained project discharge-imaging evidence. The exact age boundary is supported by the source; every supplied female profile is above it. Local imaging suitability remains clinician review. |
| claim.qq20261102a.boosted-midazolam-routes | Oral midazolam is contraindicated with ritonavir-boosted protease-inhibitor therapy. | source.qq20261102a.nysdoh-hiv | safety_boundary / moderate | One adequately retrieved current guideline for this added interaction fact; NIH direct table returned 403 and is not counted as independent verification. |
| claim.qq20261102a.boosted-parenteral-titration | Parenteral midazolam may be considered with boosted protease inhibitors in an appropriately monitored setting, with dose reduction considered particularly for repeated doses. | source.qq20261102a.nysdoh-hiv | management / moderate | One verified current guideline. No exact dose, mandatory universal reduction, unsupervised administration or washout interval authored; anesthesia/HIV coordination required. |
| claim.qq20261102a.art-continuity | Avoid uncoordinated perioperative ART interruption; consult the HIV team when interruption cannot be avoided. | source.qq20261102a.nysdoh-hiv | management / moderate | One verified current guideline; administration feasibility and individual interactions still require clinical review. The existing named-regimen claim independently verifies the four-drug combination. |
| claim.qq20261102a.pressure-not-peristalsis | Simultaneous panesophageal pressurization is not preserved propagated peristalsis when classifying achalasia. | source.qq20261102a.chicago, source.qq20261102a.seoul | evaluation / moderate | Clinical application and the constructed phenotype require Melissa's review; no exact clinical probability, dose or timing is inferred. |
| claim.qq20261102a.primary-position-achalasia | Abnormal median IRP in the primary test position with absent peristalsis can establish achalasia; abnormal IRP in both positions is not required as it is for an EGJOO pattern. | source.qq20261102a.chicago | evaluation / moderate | Single primary classification consensus for the exact positional distinction; ten primary-position swallows and protocol adequacy require clinical confirmation. No device-specific IRP threshold invented. |
| claim.qq20261102a.spastic-achalasia | Premature or failed rather than normally peristaltic swallows with abnormal junction relaxation support a spastic achalasia pattern. | source.qq20261102a.chicago, source.qq20261102a.seoul | evaluation / moderate | The constructed case uses most premature swallows and remaining failed swallows; no subtype label is asked. Technical adequacy, latency reference and opioid effects require review. |
| claim.qq20261102a.failed-contraction-threshold | Chicago v4.0 classifies DCI below 100 mmHg.s.cm as failed contraction. | source.qq20261102a.chicago | definition / moderate | The exact cutoff is explicitly supported by the consensus. B04's 30-80 readings are synthetic examples inside that range, not an invented normal threshold or measured patient dataset. |
| claim.qq20261102a.esophageal-physiology-sequence | High-resolution manometry supplies esophageal motor classification when persistent obstructive swallowing symptoms remain after structural evaluation. | source.qq20261102a.chicago, source.qq20261102a.seoul | evaluation / moderate | FLIP can complement inconclusive studies or be used in selected circumstances; it is not declared useless. No later pressure result is used to justify the earlier task. |
| claim.qq20261102a.groin-initial-dynamic-assessment | Ultrasound is an initial imaging approach for suspected groin hernia when examination does not establish the diagnosis. | source.qq20261102a.hernia2018, source.qq20261102a.hernia2023 | evaluation / moderate | MRI can be appropriate after unresolved assessment; the case establishes first imaging and an intermittent lump, without an availability cue. |
| claim.qq20261102a.symptomatic-groin-planning | Activity-limiting symptoms from an inguinal hernia favor discussion of elective repair rather than treating the patient as an asymptomatic watchful-waiting candidate. | source.qq20261102a.hernia2018, source.qq20261102a.hernia2023 | management / moderate | Risk, preferences and surgical assessment remain necessary; no compulsory operation, emergency state or outcome probability asserted. |
| claim.qq20261102a.papillary-cytology-regional-survey | Malignant thyroid cytology warrants preoperative ultrasound assessment of central and lateral cervical nodal compartments. | source.qq20261102a.ata2025 | evaluation / moderate | Current primary guideline supports the initial survey; additional CT/MRI or sampling can be appropriate for extensive/invasive or sonographically suspicious disease. No node-size threshold authored. |
| claim.qq20261102a.papillary-cytology-pattern | Papillary groups with nuclear grooves and intranuclear cytoplasmic inclusions support a papillary thyroid carcinoma interpretation. | source.qq20261102a.ptc-cytology | evaluation / moderate | A groove alone is insufficient; integrated architecture/nuclei and cytopathologist review are required. No histologic subtype or absolute specificity is taught. |
| claim.qq20261102a.melanoma-integrated-node-staging | Clinically node-negative invasive melanoma in the supplied greater-than-1-mm range calls for sentinel-node staging consideration; reassuring ultrasound does not replace microscopic nodal staging. | source.qq20261102a.eado2024, source.qq20261102a.nci-melanoma | management / moderate | Existing synthetic thickness values are retained. No fixed metastatic probability or survival benefit asserted; subtype and patient suitability remain clinician review. |
| claim.qq20261102a.melanoma-diagnostic-sampling | When feasible, complete diagnostic removal of a suspicious melanocytic lesion supports assessment of its architecture and invasion depth. | source.qq20261102a.eado2024, source.qq20261102a.nci-melanoma | evaluation / moderate | The offered tangential option is explicitly limited to papillary dermis; this does not condemn every shave or require excision in anatomically unsuitable lesions. |
| claim.qq20261102a.malignant-polyp-adverse-features | Adverse invasive-polyp histology or incomplete resection can warrant oncologic regional resection despite a clear-looking scar. | source.qq20261102a.ascrs-colon | management / moderate | One verified primary guideline for this added scope: lymphovascular invasion, poor differentiation, involved deep margin and fragmentation are separately constructed case findings. Individual pedunculated/sessile risk and operative fitness require review; normal CT nodes do not prove microscopic negativity. |
| claim.qq20261102a.colon-systemic-staging | Chest, abdominal and pelvic CT is a standard initial colon-cancer staging pathway; routine PET-CT is not its automatic replacement. | source.qq20261102a.ascrs-colon | evaluation / moderate | Single retrieved guideline. Chest CT plus abdominal MRI is also an accepted pathway and is deliberately not offered as wrong; chest radiography is not equivalent thoracic staging. Contrast suitability assumed, not guaranteed. |
| claim.qq20261102a.sarcoma-viable-biopsy-target | Image-guided core sampling of a heterogeneous soft-tissue tumor should target viable tumor identified with enhancement or vascularity. | source.qq20261102a.essr2015-target, source.qq20261102a.seom2024 | evaluation / moderate | Exact targeting is directly supported by older primary technique guidance; current society guidance corroborates planned image-guided core biopsy. No diagnostic certainty from MRI alone, invented needle size or tract rule added. |
| claim.qq20261102a.sarcoma-local-imaging | MRI is the preferred local characterization/staging study for a deep or indeterminate limb soft-tissue mass before planned biopsy. | source.qq20261102a.essr2023, source.qq20261102a.seom2024 | evaluation / moderate | CT is useful in selected circumstances; ultrasound can triage accessible lesions. The supplied prior ultrasound establishes deep extent, rather than merely a lesion beneath skin. |
| claim.qq20261102a.subepithelial-integrated-pattern | A homogeneous bright submucosal lesion with a yellow deformable endoscopic appearance supports lipoma characterization. | source.qq20261102a.esge-sel2022 | evaluation / moderate | One primary guideline for the added raw EUS detail; existing lipoma evidence separately supports no directed follow-up when confidently characterized and asymptomatic. Not all SELs can be diagnosed from EUS alone. |
| claim.qq20261102a.gastric-depth-nodes-organ-plan | A gastric primary extending into muscularis propria falls outside the early T1 nodal-dissection scope and supports a D2 framework in the represented operative plan. | source.qq20261102a.jgca2021, source.qq20261102a.korean-gastric | management / moderate | The synthetic wall-layer observation must be checked by Melissa. No exact nodal station algorithm or disputed JGCA2025 hilar recommendation is used. |
| claim.qq20261102a.gastric-spleen-preservation | Prophylactic splenectomy is not routine for the represented proximal gastric cancer without greater-curvature or splenic invasion. | source.qq20261102a.korean-gastric, source.qq20261102a.jgca2021 | management / moderate | The separate contradictory English JGCA2025 hilar statement remains withheld. Direct invasion or therapeutic nodal indications can change scope; the case's fat plane is not proof against every microscopic extension. |
| claim.qq20261102a.gastric-lineage-not-classification | CD20 establishes B-cell lineage but is insufficient without representative morphology and ancillary assessment to classify gastric MALT lymphoma. | source.qq20261102a.bsh-mzl, source.qq20261102a.malt2023 | evaluation / moderate | Repeat representative biopsies are warranted for the constructed crushed, architecture-poor sample. Clonality alone can occur in reactive inflammation and does not resolve every lymphoma subtype. |
| claim.qq20261102a.gastric-malt-response-assessment | Histologic gastric response assessment is needed after H. pylori-directed treatment of gastric MALT lymphoma; symptoms alone do not establish remission. | source.qq20261102a.bsh-mzl, source.qq20261102a.malt2023 | management / moderate | No eradication regimen, exact follow-up interval, universal response probability or automatic salvage rule authored. |
| claim.qq20261102a.gastric-small-b-cell-differential | Gastric small B-cell infiltration with gland involvement and a CD20/CD79a-positive, CD5/CD10/cyclin-D1-negative profile supports MALT lymphoma in integrated pathology review. | source.qq20261102a.bsh-mzl, source.qq20261102a.malt2023 | evaluation / moderate | Markers have exceptions; this is not a unique single-stain rule, and lymphoma classification requires morphology, clinical context and expert review. |
| claim.qq20261102a.null-test-versus-protocol-magnitude | Testing against no effect and evaluating a prespecified meaningful effect or equivalence margin are different statistical questions. | source.qq20261102a.nist-p, source.qq20261102a.nist-ci, source.qq20261102a.lakens2017 | definition / moderate | B26/B27/B31/B39 numbers, targets and intervals are constructed protocol inputs, not clinical thresholds or observed treatment effects. TOST .05 uses a 90% CI, not a substituted 95% CI; arithmetic/rounding is separately validated. |
| claim.qq20261102a.odds-to-risk-conversion | For a fixed covariate profile, multiply baseline odds by the conditional odds ratio, then convert resulting odds to risk as odds/(1+odds). | source.qq20261102a.dhsc-odds | definition / moderate | Algebraic derivation from definitions, not a causal/marginal prediction. With baseline .40 and OR .60 the risk is 2/7, approximately 29%; all values are fictional inputs. |
| claim.qq20261102a.relative-to-absolute-interval | With a fixed reference risk, a risk-ratio interval transforms to a risk-difference interval by multiplying each endpoint by that risk and subtracting it. | source.qq20261102a.dhsc-odds, source.qq20261102a.nist-ci | definition / moderate | Derived algebra on fictional inputs: .20*(.40-1)=-.12 and .20*(1.20-1)=.04. A reference-risk uncertainty distribution is not supplied or assumed; intervals are not hard bounds on truth. |
| claim.qq20261102a.sedation-supported-discharge | After IV sedation, discharge planning includes assessed recovery and responsible adult support, not a driver-only transport booking. | source.qq20261102a.bsg-sedation | disposition / moderate | One current specialist guideline plus retained existing local discharge advice. Local approved escort pathways may differ; no taxi-only shortcut, fixed recovery duration or blanket rule for unsedated/nitrous procedures taught. |
| claim.qq20261102a.sedation-after-reversal | Re-sedation can follow flumazenil reversal of midazolam, so apparent immediate recovery does not remove the need for further monitoring. | source.qq20261102a.bsg-sedation | safety_boundary / moderate | One primary specialist guideline. No exact observation period or dose authored; prior benzodiazepine/opioid exposure and individual risk require review. |
| claim.qq20261102a.pancreatic-contrast-characterization | Pre-drainage cross-sectional imaging of a pancreatic fluid collection assesses wall, contents, adjacent organs and vessels. | source.qq20261102a.ksge | evaluation / moderate | CT/MRCP and EUS play complementary roles. The item compares specified CT contrast protocols, not CT against a falsely invalid MRI pathway; actual vascular and contrast suitability remain review requirements. |
| claim.qq20261102a.collection-symptom-attribution | Persistent attributable symptoms or obstruction can warrant drainage assessment of a walled pancreatic fluid collection. | source.qq20261102a.ksge | management / moderate | One verified guideline for this added application. Referral is for access/expertise and symptom attribution assessment, not immediate puncture; no size-only cutoff, exact elapsed time or invented vessel clearance authored. |
| claim.qq20261102a.pdsa-outcome-balancing-adaptation | Improvement-cycle decisions should consider whether process changes improve the intended outcome and add burden, then use the findings to plan the next test. | source.qq20261102a.ahrq-pdca, source.qq20261102a.ahrq-metrics | management / moderate | B36 is a fictional process pilot, not patient trial evidence or question correctness analytics. The data favor adapting the form over rollout or training-only repetition; no universal abandon threshold taught. |
| claim.qq20261102a.ibc-core-versus-adjunctive-skin | Breast core tissue confirms invasive carcinoma in a suspected inflammatory breast cancer presentation; skin punch can add dermal information but does not replace that confirmation. | source.qq20261102a.ibc-consensus, source.qq20261102a.nci-ibc | evaluation / moderate | Existing primary-consensus claim retained; dermal emboli are not required. The poorly informative prior aspirate motivates a tissue core, and staging is conditional on confirmation, preserving the existing external-service bundle. |
| claim.qq20261102a.ibc-response-local-treatment | Clinical response to neoadjuvant treatment does not by itself remove the mastectomy and regional radiation components of the represented operable stage III inflammatory breast cancer pathway. | source.qq20261102a.nci-ibc-treatment, source.qq20261102a.ago2024 | management / moderate | Conditional future planning, not a claim that systemic therapy occurred during biopsy wait; individual operability and response require review. No modern non-IBC de-escalation rule is extrapolated. |
| claim.qq20261102a.ulcer-local-modality-choice | A nonbleeding ulcer vessel can receive mechanical or contact-thermal hemostasis; epinephrine alone is inadequate, and topical agents are not routine sole initial therapy for that finding. | source.qq20261102a.esge-ulcer | management / moderate | Current specific guideline only for the new modality comparison; retained ACG evidence independently supports hemostasis indication. Powder can be appropriate rescue/temporizing therapy; after the failed clip the selected contact treatment supplements epinephrine rather than repeating monotherapy. No dose or universal rescue sequence authored. |

Every listed claim has lastCheckedOn 2026-11-02 and needs_clinician_review. Review mapping is per exact question variant, never an approval of the underlying concept or a clinical release.

## Exact question mappings

| Review ID | Variant ID | Added claim IDs |
|---|---|---|
| A02 | question.cholecystitis.hida-after-equivocal-ultrasound.v2.r6 | claim.qq20261102a.gallbladder-filling-versus-emptying |
| A06 | question.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition.v1.r5 | claim.qq20261102a.mixed-discharge-medication, claim.qq20261102a.mixed-discharge-local-assessment |
| A06-context | question.pathologic-nipple-discharge.diagnostic-imaging.v1.r6 | claim.qq20261102a.initial-breast-pathway, claim.qq20261102a.mixed-discharge-local-assessment |
| A25 | question.gs028g.hiv-perioperative.art-continuity.v1.r6 | claim.qq20261102a.boosted-midazolam-routes, claim.qq20261102a.boosted-parenteral-titration, claim.qq20261102a.art-continuity |
| A25-context | question.gs028g.hiv-perioperative.booster-midazolam-interaction.v1.r6 | claim.qq20261102a.boosted-midazolam-routes, claim.qq20261102a.boosted-parenteral-titration, claim.qq20261102a.art-continuity |
| B01 | question.achalasia.manometric-recognition.v1.r3 | claim.qq20261102a.pressure-not-peristalsis |
| B01-context | question.achalasia.high-resolution-manometry.v1.r3 | claim.qq20261102a.esophageal-physiology-sequence |
| B02 | question.achalasia.manometric-recognition.v2.r3 | claim.qq20261102a.primary-position-achalasia |
| B02-context | question.achalasia.high-resolution-manometry.v2.r3 | claim.qq20261102a.esophageal-physiology-sequence |
| B03 | question.achalasia.manometric-recognition.v3.r3 | claim.qq20261102a.spastic-achalasia |
| B03-context | question.achalasia.high-resolution-manometry.v3.r3 | claim.qq20261102a.esophageal-physiology-sequence |
| B04 | question.achalasia.manometric-recognition.v4.r3 | claim.qq20261102a.failed-contraction-threshold |
| B04-context | question.achalasia.high-resolution-manometry.v4.r3 | claim.qq20261102a.esophageal-physiology-sequence |
| B05 | question.inguinal-hernia.equivocal-exam-ultrasound.v4.r3 | claim.qq20261102a.groin-initial-dynamic-assessment |
| B05-context | question.inguinal-hernia.symptomatic-elective-repair.v4.r3 | claim.qq20261102a.symptomatic-groin-planning |
| B06 | question.inguinal-hernia.equivocal-exam-ultrasound.v2.r3 | claim.qq20261102a.groin-initial-dynamic-assessment |
| B06-context | question.inguinal-hernia.symptomatic-elective-repair.v2.r3 | claim.qq20261102a.symptomatic-groin-planning |
| B07 | question.inguinal-hernia.equivocal-exam-ultrasound.v3.r3 | claim.qq20261102a.groin-initial-dynamic-assessment |
| B07-context | question.inguinal-hernia.symptomatic-elective-repair.v3.r3 | claim.qq20261102a.symptomatic-groin-planning |
| B08 | question.inguinal-hernia.equivocal-exam-ultrasound.v1.r3 | claim.qq20261102a.groin-initial-dynamic-assessment |
| B08-context | question.inguinal-hernia.symptomatic-elective-repair.v1.r3 | claim.qq20261102a.symptomatic-groin-planning |
| B09 | question.differentiated-thyroid-cancer.preoperative-nodal-ultrasound.v3.r3 | claim.qq20261102a.papillary-cytology-regional-survey, claim.qq20261102a.papillary-cytology-pattern |
| B10 | question.stoma-prolapse.urgent-surgical-escalation.v4.r3 |  |
| B11 | question.melanoma.sentinel-node-staging.v2.r3 | claim.qq20261102a.melanoma-integrated-node-staging |
| B11-context | question.pigmented-skin-lesion.complete-diagnostic-biopsy.v2.r3 | claim.qq20261102a.melanoma-diagnostic-sampling |
| B12 | question.melanoma.sentinel-node-staging.v4.r3 | claim.qq20261102a.melanoma-integrated-node-staging |
| B12-context | question.pigmented-skin-lesion.complete-diagnostic-biopsy.v4.r3 | claim.qq20261102a.melanoma-diagnostic-sampling |
| B13 | question.colon-cancer.oncologic-regional-resection.v1.r3 | claim.qq20261102a.malignant-polyp-adverse-features |
| B13-context | question.colon-cancer.preoperative-cross-sectional-staging.v1.r3 | claim.qq20261102a.colon-systemic-staging |
| B14 | question.colon-cancer.oncologic-regional-resection.v2.r3 | claim.qq20261102a.malignant-polyp-adverse-features |
| B14-context | question.colon-cancer.preoperative-cross-sectional-staging.v2.r3 | claim.qq20261102a.colon-systemic-staging |
| B15 | question.colon-cancer.oncologic-regional-resection.v3.r3 | claim.qq20261102a.malignant-polyp-adverse-features |
| B15-context | question.colon-cancer.preoperative-cross-sectional-staging.v3.r3 | claim.qq20261102a.colon-systemic-staging |
| B16 | question.colon-cancer.oncologic-regional-resection.v4.r3 | claim.qq20261102a.malignant-polyp-adverse-features |
| B16-context | question.colon-cancer.preoperative-cross-sectional-staging.v4.r3 | claim.qq20261102a.colon-systemic-staging |
| B17 | question.melanoma.sentinel-node-staging.v1.r3 | claim.qq20261102a.melanoma-integrated-node-staging |
| B17-context | question.pigmented-skin-lesion.complete-diagnostic-biopsy.v1.r3 | claim.qq20261102a.melanoma-diagnostic-sampling |
| B18 | question.melanoma.sentinel-node-staging.v3.r3 | claim.qq20261102a.melanoma-integrated-node-staging |
| B18-context | question.pigmented-skin-lesion.complete-diagnostic-biopsy.v3.r3 | claim.qq20261102a.melanoma-diagnostic-sampling |
| B19 | question.soft-tissue-mass.specialist-planned-biopsy.v1.r3 | claim.qq20261102a.sarcoma-viable-biopsy-target |
| B19-context | question.soft-tissue-mass.extremity-mri.v1.r3 | claim.qq20261102a.sarcoma-local-imaging |
| B20 | question.soft-tissue-mass.specialist-planned-biopsy.v2.r3 | claim.qq20261102a.sarcoma-viable-biopsy-target |
| B20-context | question.soft-tissue-mass.extremity-mri.v2.r3 | claim.qq20261102a.sarcoma-local-imaging |
| B21 | question.colonic-lipoma.management.patient-to-plan.v1.r3 | claim.qq20261102a.subepithelial-integrated-pattern |
| B21-context | question.colonic-lipoma.recognition.patient-to-diagnosis.v1.r3 | claim.qq20261102a.subepithelial-integrated-pattern |
| B22 | question.colonic-lipoma.management.patient-to-plan.v2.r3 | claim.qq20261102a.subepithelial-integrated-pattern |
| B22-context | question.colonic-lipoma.recognition.patient-to-diagnosis.v2.r3 | claim.qq20261102a.subepithelial-integrated-pattern |
| B23 | question.gastric-adenocarcinoma.post-endoscopy-splenic-referral.v1.r3 | claim.qq20261102a.gastric-depth-nodes-organ-plan, claim.qq20261102a.gastric-spleen-preservation |
| B24 | question.gastric-malt.cd20-alone-boundary.v1.r3 | claim.qq20261102a.gastric-lineage-not-classification |
| B25 | question.gastric-malt.eradication-response-reassessment.v1.r3 | claim.qq20261102a.gastric-malt-response-assessment |
| B25-context | question.gastric-malt.pathology-profile-selection.v1.r3 | claim.qq20261102a.gastric-small-b-cell-differential |
| B26 | question.statistics-ethics.p-value.v2.r3 | claim.qq20261102a.null-test-versus-protocol-magnitude |
| B27 | question.statistics-ethics.p-value.v1.r3 | claim.qq20261102a.null-test-versus-protocol-magnitude |
| B28 | question.statistics-ethics.risk-ratio-odds-ratio.v3.r3 | claim.qq20261102a.odds-to-risk-conversion |
| B29 | question.variety3.sedation-discharge-ride.v1.r3 | claim.qq20261102a.sedation-supported-discharge, claim.qq20261102a.sedation-after-reversal |
| B30 | question.gastric-malt.integrated-pathology-diagnosis.v1.r3 | claim.qq20261102a.gastric-small-b-cell-differential |
| B30-context | question.gastric-malt.localized-hpylori-positive-initial-treatment.v1.r3 | claim.qq20261102a.gastric-malt-response-assessment |
| B31 | question.statistics-ethics.p-value.v4.r3 | claim.qq20261102a.null-test-versus-protocol-magnitude |
| B32 | question.pseudocyst.symptomatic-endoscopic-drainage.v1.r3 |  |
| B32-context | question.pseudocyst.contrast-ct-characterization.v1.r3 | claim.qq20261102a.pancreatic-contrast-characterization |
| B33 | question.pseudocyst.symptomatic-endoscopic-drainage.v2.r3 |  |
| B33-context | question.pseudocyst.contrast-ct-characterization.v2.r3 | claim.qq20261102a.pancreatic-contrast-characterization |
| B34 | question.pseudocyst.symptomatic-endoscopic-drainage.v3.r3 | claim.qq20261102a.collection-symptom-attribution |
| B34-context | question.pseudocyst.contrast-ct-characterization.v3.r3 | claim.qq20261102a.pancreatic-contrast-characterization |
| B35 | question.pseudocyst.symptomatic-endoscopic-drainage.v4.r3 |  |
| B35-context | question.pseudocyst.contrast-ct-characterization.v4.r3 | claim.qq20261102a.pancreatic-contrast-characterization |
| B36 | question.quality-improvement.pdsa-act-and-iterate.v3.r3 | claim.qq20261102a.pdsa-outcome-balancing-adaptation |
| B37 | question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r3 | claim.qq20261102a.ibc-core-versus-adjunctive-skin |
| B37-context | question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3 | claim.qq20261102a.ibc-response-local-treatment |
| B38 | question.statistics-ethics.confidence-interval.v1.r3 | claim.qq20261102a.relative-to-absolute-interval |
| B39 | question.statistics-ethics.p-value.v3.r3 | claim.qq20261102a.null-test-versus-protocol-magnitude |
| B40 | question.peptic-ulcer-bleeding.visible-vessel-treat.v1.r3 | claim.qq20261102a.ulcer-local-modality-choice |
| B40-context | question.peptic-ulcer-bleeding.visible-vessel-inadequate-monotherapy.v1.r3 | claim.qq20261102a.ulcer-local-modality-choice |
