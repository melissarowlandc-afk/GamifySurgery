# Early-level source clinic — September 13, 2026

## Purpose and boundary

This source brief covers five candidate two-concept families. It does not approve clinical content, authorize production implementation, or change the active release. Any later records remain `needs_clinician_review`. All statements are independently written factual syntheses, not source prose, patient advice, or a medication/product schedule.

Research date: 2026-09-13. Official and guideline sources were used only for targeted factual verification. Public SCORE is curriculum mapping only, never a question source.

## Duplicate and runtime inventory

The active release is 123 concepts, 298 cases, and 463 decision nodes. No candidate ID or underlying teaching point duplicates an active concept.

- Existing `concept.anal-fissure.acute-recognition` and `concept.anal-fissure.initial-conservative-care` cover a recent uncomplicated acute fissure and conservative care only. Chronic topical calcium-channel-blocker (CCB) treatment and selected lateral internal sphincterotomy (LIS) remain distinct.
- Existing skin content is melanoma: `concept.pigmented-skin-lesion.complete-diagnostic-biopsy` and `concept.melanoma.sentinel-node-staging`; it is not cSCC.
- Existing splenectomy content is hereditary-spherocytosis hemolysis/accessory-spleen evaluation, not preoperative vaccines or fever safety.
- No active concepts cover Lynch/MMR triage or venous-ulcer arterial assessment/compression.

All proposed stable presentations fit Level 0/1 clinic review, external pathology/laboratory results, counseling, or referral. Do not create an in-house capability merely to show a test. Fever with impaired splenic function must be an emergency disposition, never an outpatient test-wait flow.

## 1. Lynch-associated tumor MMR triage and counseling

**Proposed concepts**

1. `concept.lynch-tumor.universal-mmr-screening`: select MMR IHC or MSI tumor screening for a newly diagnosed colorectal cancer to identify a possible hereditary-cancer signal.
2. `concept.lynch-tumor.germline-counseling-after-suggestive-ihc`: select genetics counseling and germline-testing discussion after a returned suggestive tumor result.

**Atomic claims**

- `claim.lynch-tumor.universal-mmr-screening-new-crc`: Molecular tumor testing using MMR IHC and/or MSI is used as universal screening for Lynch syndrome in newly diagnosed colorectal cancer. This screening identifies a possible hereditary-risk signal; it is not germline testing or a diagnosis of Lynch syndrome.
- `claim.lynch-tumor.genetics-counseling-after-suggestive-ihc`: A patient whose tumor result suggests Lynch syndrome should receive genetics counseling and germline-testing discussion rather than be labeled with Lynch syndrome from IHC alone. Counseling addresses possible results and familial implications without promising a result.

**Case/service boundary.** Use four two-node cases: an adult with newly diagnosed colorectal cancer and no prior MMR evaluation first selects universal tumor MMR IHC/MSI screening; its external tumor-IHC gate then returns retained internal controls with MSH2/MSH6 loss, and the second node selects pretest genetics counseling/germline testing discussion. Do not use age cutoffs, Amsterdam/Bethesda criteria, surveillance intervals, or MLH1 methylation reflex in this MSH2/MSH6 pathway. An external tumor-IHC service contract is required; it must be distinct from any later germline-testing/referral representation.

**Board mapping.** Official 2025–26 SCORE: Colon Cancer, printed p. 7 / physical p. 8. Lynch is an inferred subtopic; the typography/depth was not verified and must not be assigned.

**Sources**

- `source.lynch.nci-colorectal-genetics-pdq.2026`: PDQ Cancer Genetics Editorial Board. *Genetics of Colorectal Cancer (PDQ®), Health Professional Version.* National Cancer Institute, live summary, accessed 2026-09-13. https://www.cancer.gov/types/colorectal/hp/colorectal-genetics-pdq . Government professional evidence summary; direct support for universal MMR IHC/MSI screening, the returned MSH2/MSH6 pattern, and germline evaluation. U.S. government factual material generally public domain subject to NCI/PDQ conditions; original synthesis only, no marks, images, tables, or branded summary. Supports both claims.
- `source.lynch.nci-genetic-counseling-pdq.2026`: PDQ Cancer Genetics Editorial Board. *Cancer Genetics Risk Assessment and Counseling (PDQ®), Health Professional Version.* National Cancer Institute, live summary, accessed 2026-09-13. https://www.cancer.gov/publications/pdq/information-summaries/genetics/risk-assessment-hp-pdq . Government professional evidence summary; independent support for pretest counseling, consent, result categories, and familial implications. Same reuse limit. Supports the counseling claim.

## 2. Chronic anal fissure: topical CCB then selected LIS

**Proposed concepts**

1. `concept.chronic-anal-fissure.topical-calcium-channel-blocker`: select topical CCB as first-line pharmacologic treatment for chronic anal fissure.
2. `concept.chronic-anal-fissure.lis-after-medical-treatment`: after failed topical therapy, select colorectal-surgery assessment for LIS in a patient without baseline fecal incontinence or described continence risk.

**Atomic claims**

- `claim.chronic-anal-fissure.topical-ccb-first-line`: For typical chronic anal fissure, topical CCB is an appropriate first-line pharmacologic option, with efficacy comparable to topical nitrates and a more favorable side-effect profile. No drug, concentration, schedule, or duration is specified.
- `claim.chronic-anal-fissure.selected-lis-after-medical-treatment`: In chronic fissure persisting after appropriate medical treatment, with no baseline fecal incontinence or stated sphincter-injury risk, LIS can be offered after individualized continence counseling. It is not suitable for every patient.

**Case/service boundary.** Use two separate single-node cases. The first is a stable adult with clinician-characterized chronic midline fissure; exclude inflammatory bowel disease, obstetric injury, prior anorectal operation, baseline incontinence, atypical/lateral/multiple lesions, or acute infection, and select CCB treatment. The second is a later return after a documented adequate medical-treatment trial with persistent symptoms and no baseline continence risk, and selects LIS discussion/referral. This avoids representing treatment failure as an instantaneous next node. No exact treatment duration or incontinence percentage. No test/service required.

**Board mapping.** Official 2025–26 SCORE: Anal Fissure, printed p. 8 / physical p. 9. The depth typography was not verified. CCB/LIS sequencing is inferred within the explicit family.

**Sources**

- `source.chronic-fissure.ascrs-cpg.2023`: Davids JS, Hawkins AT, Bhama AR, Feinberg AE, Grieco MJ, Lightner AL, Feingold DL, Paquette IM; ASCRS Clinical Practice Guidelines Committee. *The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Anal Fissures.* Diseases of the Colon & Rectum. 2023;66(2):190-199. doi:10.1097/DCR.0000000000002664. Official PDF: https://www.ascrsu.com/ascrs/repview?name=3_2851088_PDF&type=784-162 . Professional-society guideline; copyrighted, targeted factual verification only. Supports both claims.
- `source.chronic-fissure.siucp.2023`: Brillantino A, Renzi A, Talento P, et al. *The Italian Unitary Society of Colon-proctology guidelines for the management of anal fissure.* BMC Surgery. 2023;23:311. doi:10.1186/s12893-023-02223-z. https://doi.org/10.1186/s12893-023-02223-z . Professional-society guideline, CC BY 4.0; attribution required. Independent cross-check; no exact regimen or universal-surgery rule.

## 3. Cutaneous SCC: diagnostic biopsy and risk-directed surgery

**Proposed concepts**

1. `concept.cutaneous-scc.diagnostic-biopsy`: select biopsy that supplies adequate diagnosis and risk information for suspicious cSCC.
2. `concept.cutaneous-scc.low-risk-excision-high-risk-mohs-referral`: select standard excision with margin assessment for clearly low-risk primary cSCC, while referring clearly high-risk disease for Mohs-capable specialist evaluation.

**Atomic claims**

- `claim.cutaneous-scc.biopsy-for-diagnosis-and-risk`: A lesion suspected to be cSCC should receive a biopsy method that supplies adequate diagnostic and risk information. Selection depends on lesion features and location; no single biopsy technique is universal.
- `claim.cutaneous-scc.risk-directed-surgery`: Standard excision with histologic margin assessment is appropriate for low-risk primary cSCC, whereas Mohs micrographic surgery is recommended for high-risk cSCC. The case must establish risk classification and cannot treat location alone as an unqualified Mohs rule.

**Case/service boundary.** Stable noninfected keratotic lesion without a tissue diagnosis or nodal disease; choose diagnostic biopsy/referral. Create `service.skin_diagnostic_biopsy` with an external `route.skin_diagnostic_biopsy.outsourced`: the existing melanoma `service.skin_excisional_biopsy` is intentionally too specific to stand in for a generally appropriate cSCC biopsy. Returned pathology must explicitly establish invasive cSCC plus a low- or high-risk setting. Keep each definitive-treatment case unambiguous: low-risk trunk/extremity excision or clearly high-risk Mohs referral. Use external dermatology pathology/referral; do not add office Mohs/minor-procedure capability.

**Board mapping.** Official 2025–26 SCORE: Nonmelanoma Skin Cancers and Surgical Management of Skin and Soft Tissue Lesions, printed p. 11 / physical p. 12. The depth typography was not verified. Biopsy and risk-directed excision/Mohs selection are inferred within those explicit families.

**Sources**

- `source.csc.aad-guideline.2018`: Alam M, Armstrong A, Baum C, et al. *Guidelines of care for the management of cutaneous squamous cell carcinoma.* Journal of the American Academy of Dermatology. 2018;78(3):560-578. doi:10.1016/j.jaad.2017.10.007. AAD entry: https://www.aad.org/member/clinical-quality/guidelines/scc ; author manuscript: https://pmc.ncbi.nlm.nih.gov/articles/PMC6652228/ . Professional-society guideline; targeted verification only for AAD and CC BY-NC-ND for the manuscript. Independently written factual synthesis only. Supports both claims.
- `source.csc.aad-mohs-wisely.2026`: American Academy of Dermatology. *Choosing Wisely: recommendations about treatments, tests, and procedures*, live professional page, accessed 2026-09-13. https://www.aad.org/member/clinical-quality/clinical-care/wisely . Copyrighted society professional resource, targeted factual verification only. Independently limits routine Mohs for small low-risk superficial cSCC on trunk/extremities. Supports the limitation.

## 4. Venous leg ulcer: arterial assessment then compression

**Proposed concepts**

1. `concept.venous-leg-ulcer.arterial-assessment-before-compression`: obtain arterial assessment, including ABI when appropriate, before selecting full compression for presumed venous leg ulcer.
2. `concept.venous-leg-ulcer.compression-with-adequate-arterial-perfusion`: select compression after returned assessment supports adequate arterial perfusion in uncomplicated active venous leg ulcer.

**Atomic claims**

- `claim.venous-leg-ulcer.arterial-assessment-before-compression`: In suspected venous leg ulcer, arterial status should be assessed before selecting compression because coexisting arterial disease changes compression safety and type. ABI is one component and can be unreliable with noncompressible arteries.
- `claim.venous-leg-ulcer.compression-after-adequate-arterial-assessment`: Compression improves active venous-ulcer healing when assessment supports its use and adequate arterial perfusion. This does not prescribe a pressure, wrap type, or mixed arterial-venous treatment.

**Case/service boundary.** Stable gaiter-area ulcer with compatible chronic venous changes; exclude spreading infection, acute ischemia, rest pain, tissue-threatening arterial disease, and uncontrolled alternate edema cause. First node selects ABI/arterial assessment. Its returned result gives an actual normal physiological example—ABI 1.05 with normal arterial waveforms—rather than declaring compression permissible; this is a case finding, not an authored threshold or general rule. Second selects compression/wound-venous follow-up. Existing `service.resting_abi` and `timing.test.vascular_physiology` can support an external gate; no balance expansion. Do not author ABI or compression-pressure cutoffs.

**Board mapping.** Official 2025–26 SCORE: Venous Stasis/Chronic Venous Insufficiency, printed p. 15 / physical p. 16. The depth typography was not verified. ABI/compression sequence is inferred within the explicit family.

**Sources**

- `source.vlu.esvs-cvd.2022`: De Maeseneer MG, Kakkos SK, Aherne T, et al. *Editor’s Choice — European Society for Vascular Surgery (ESVS) 2022 Clinical Practice Guidelines on the Management of Chronic Venous Disease of the Lower Limbs.* European Journal of Vascular and Endovascular Surgery. 2022;63(2):184-267. doi:10.1016/j.ejvs.2021.12.024. https://esvs.org/guideline/chronic-venous-disease-of-lower-limbs/ . Professional-society guideline; official PDF copyrighted, targeted factual verification only. Direct authority for arterial-assessment boundaries and compression. Supports both claims.

## 5. Elective splenectomy: vaccine review and fever action

**Proposed concepts**

1. `concept.elective-splenectomy.encapsulated-organism-vaccine-review`: review indicated pneumococcal, meningococcal, and Hib vaccination before elective splenectomy and arrange indicated vaccines at least 14 days before surgery when feasible.
2. `concept.asplenia.fever-emergency-action`: with impaired splenic function and fever, take any prescribed standby oral antibiotic only as directed and seek emergency care immediately; do not wait for outpatient testing.

**Atomic claims**

- `claim.elective-splenectomy.vaccine-review-14-days-if-possible`: For elective splenectomy, indicated pneumococcal, meningococcal, and Hib vaccines should be reviewed and administered at least 14 days before surgery when possible. This does not reproduce a product schedule or delay a necessary urgent operation.
- `claim.asplenia.fever-immediate-emergency-care`: Fever with impaired splenic function needs immediate emergency assessment. A patient-specific standby oral antibiotic plan, when one exists, does not replace immediate emergency presentation or prompt parenteral antibiotics after evaluation.

**Case/service boundary.** Use two separate single-node cases. The first is a stable elective planned-splenectomy consultation without urgent operative indication and selects vaccine-record review/coordination. The second is a later known-asplenic adult with new fever and selects emergency action, not source diagnosis. This avoids imaginary instantaneous progression from vaccination planning to post-splenectomy infection. No timed laboratory service, medication name/dose, or result gate. The emergency node resolves to referral/disposition.

**Board mapping.** Official 2025–26 SCORE: Splenectomy and Splenorrhaphy, printed p. 5 / physical p. 6. The depth typography was not verified. Vaccine and fever safety are inferred details in the explicit splenectomy family.

**Sources**

- `source.splenectomy.cdc-altered-immunocompetence.2026`: Centers for Disease Control and Prevention. *Altered Immunocompetence: Anatomic or Functional Asplenia.* Vaccines & Immunizations, live guidance, accessed 2026-09-13. https://www.cdc.gov/vaccines/hcp/imz-best-practices/altered-immunocompetence.html . U.S. government guidance; federal factual material generally public domain subject to agency conditions, with no third-party material or marks reused. Direct authority for encapsulated-organism risk and the 14-days-if-possible preoperative principle. Supports claim one.
- `source.asplenia.emergencycarebc-fever.2026`: Emergency Care BC. *Fever in Patients with Impaired Spleen Function.* Clinical Summary, live resource, accessed 2026-09-13. https://emergencycarebc.ca/clinical_resource/clinical-summary/fever-in-patients-with-impaired-spleen-function/ . Provincial clinical summary; reuse/terms not established, targeted factual verification only. Direct support for immediate emergency presentation and prompt broad-spectrum IV antibiotics, including the boundary that standby medication does not replace emergency care. Supports claim two.

## Recommendation and unresolved verification

All five pairs are source-supportable and nonduplicative. Safest authoring order: chronic fissure, cSCC, venous ulcer, elective splenectomy, then Lynch. Lynch needs particular protection against equating tumor IHC with a germline diagnosis; fever needs an explicit emergency-disposition path.

Before authoring, verify SCORE typography/depth for the four located families and search the official outline again for a skin/cSCC family. Do not promote any provisional mapping in this brief into an explicit SCORE or ABSITE claim.
