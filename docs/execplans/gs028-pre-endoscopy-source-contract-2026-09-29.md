# GS-028 pre-Endoscopy twenty-objective source contract (September 29, 2026)

Status: accepted research and authoring contract for the September 29 GS-028
batch. It is not clinical approval or a public release. All resulting concepts,
claims, cases, questions, and feedback remain `needs_clinician_review` in the
owner/development preview until a named clinician approves a version.

## Research and source boundary

The roster was compared with the frozen `2026-09-29` baseline of 203 concepts,
518 cases, and 783 nodes, the GS-028 onboarding inventory, prior batch source
contracts, and the unchanged owner candidate sheet through row 162. Stage means
gameplay availability; it does not encode acuity, curricular depth, or facility
capability. Each objective requires four substantively different variants and at
least one independently eligible case. A paired case is useful only when the
second decision follows new, clinically coherent information.

No source prose, table, figure, algorithm, checklist, question, or explanation
may be copied. The sources below authorize only targeted factual verification
and short original synthesis unless a stated license grants more. Public access
does not imply permission. NICE sources, proprietary SCORE modules, commercial
question banks, recalled ABSITE material, and inaccessible snippets are outside
this contract.

The 2025 ESPEN surgery-nutrition update is also excluded. Its official listing
reserves text/data-mining and AI-training rights. No fact in this contract or the
batch is derived from that update. The permitted nutrition source is the 2021 ESPEN practical guideline, used only
for targeted factual verification under retained copyright.

## Accepted roster

| # | Stable concept ID | Narrow scored objective | Earliest stage and real route | Closest active neighbor and exact distinction |
| ---: | --- | --- | --- | --- |
| 1 | `concept.postherniorrhaphy-pain.neuropathic-pattern-recognition` | Recognize chronic postoperative inguinal pain with a compatible neuropathic distribution/history while reassessing recurrence and other causes. | 0; history/examination | Existing inguinal-hernia concepts address the untreated hernia and repair counseling. This begins after repair and tests chronic-pain phenotype/differential. |
| 2 | `concept.postherniorrhaphy-pain.targeted-block-specialist-evaluation` | Refer persistent suspected neuropathic postherniorrhaphy pain for specialist evaluation that may include a diagnostic local-anesthetic trigger-point or nerve block; do not prescribe a rigid drug ladder or promise block response. | 0; external pain/hernia specialist, no invented onsite block | No active concept tests diagnostic block selection after groin-hernia repair. |
| 3 | `concept.spigelian-hernia.clinical-imaging-recognition` | Recognize a lateral ventral defect along the semilunar region and use ultrasound or CT when examination is uncertain. | 0; examination; existing ultrasound/CT routes only when uncertainty warrants imaging | Existing umbilical/epigastric, incisional, inguinal, and femoral objectives test different anatomy. |
| 4 | `concept.spigelian-hernia.elective-repair-referral` | Refer a confirmed stable Spigelian hernia for individualized elective repair discussion without teaching one universal technique. | 0; external hernia-surgery referral | Existing hernia referral objectives concern other named anatomic types. |
| 5 | `concept.prosthetic-mesh-infection.deep-infection-recognition` | Distinguish deep/chronic prosthetic mesh infection from a superficial incisional process using compatible drainage, sinus, collection, systemic findings, or fistula context. | 0; examination/completed records; urgent external assessment when unstable | Existing superficial surgical-site infection and seroma objectives do not test infection involving implanted hernia mesh. |
| 6 | `concept.prosthetic-mesh-infection.specialist-source-control-evaluation` | Arrange prompt external hernia/infection specialist source-control evaluation for suspected deep mesh infection; do not encode automatic mesh explantation for every case. | 0; external specialist/hospital route; no artificial clinic wait | Existing abscess drainage and superficial wound-care decisions do not address prosthetic source control. |
| 7 | `concept.cirrhosis-perioperative-risk.multifactor-assessment` | Use a multidimensional preoperative assessment that considers liver severity, portal hypertension/decompensation, procedure, comorbidity, and center expertise instead of relying on one laboratory value or score. | 0; clinic assessment and external hepatology/anesthesia coordination | Existing HCC resection selection presupposes a cancer and a favorable compensated profile. This applies to nonhepatic elective surgery and does not select HCC therapy. |
| 8 | `concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary` | Defer a nonurgent elective operation for multidisciplinary optimization when active decompensation is present, without inventing a fixed mortality estimate or universal cutoff. | 0; external hepatology/anesthesia/surgical planning | No active concept tests the elective-surgery boundary for active cirrhosis decompensation. |
| 9 | `concept.ptld.posttransplant-pattern-recognition` | Recognize PTLD concern in a transplant recipient with otherwise unexplained lymphadenopathy, organ involvement, systemic symptoms, or allograft dysfunction while preserving infection and other malignancy in the differential. | 1; examination/completed transplant records and prompt external transplant evaluation | Existing transplant concepts concern rejection, infection prophylaxis, or technical complications; none tests a post-transplant lymphoproliferative pattern. |
| 10 | `concept.ptld.tissue-diagnosis-coordination` | Coordinate transplant/hematology evaluation and tissue biopsy for suspected PTLD; do not treat EBV DNA or imaging alone as definitive tissue classification. | 1; external transplant/hematology and biopsy route | Existing generic mass biopsy objectives do not test the transplant-specific diagnostic pathway or immunosuppression coordination boundary. |
| 11 | `concept.differentiated-thyroid-cancer.preoperative-nodal-ultrasound` | Obtain preoperative central/lateral neck ultrasonography after malignant thyroid cytology or molecular findings to map nodal disease and gross local extension. | 1; existing external/onsite ultrasound only if its contract covers neck imaging | Existing thyroid-nodule ultrasound/FNA establishes nodule diagnosis. This begins after malignant findings and maps operative extent. |
| 12 | `concept.differentiated-thyroid-cancer.individualized-surgical-extent` | Choose referral for individualized lobectomy-versus-total-thyroidectomy planning from tumor extent, laterality, nodal/distant disease, recurrence risk, and patient goals; avoid a blanket operation. | 1; external high-volume thyroid-surgery referral | Existing Graves and thyroid-nodule concepts do not plan surgery for confirmed differentiated thyroid cancer. |
| 13 | `concept.pathologic-nipple-discharge.pathologic-vs-physiologic-recognition` | Distinguish pathologic spontaneous unilateral single-duct serous/bloody discharge from physiologic bilateral multiduct discharge expressed with compression. | 0; history/examination | Existing breast cyst, mastitis/abscess, and suspicious-mass concepts start with a mass or infection rather than discharge phenotype. |
| 14 | `concept.pathologic-nipple-discharge.diagnostic-imaging` | Select age/context-appropriate diagnostic breast imaging for pathologic nipple discharge while avoiding routine imaging for a clearly physiologic pattern. | 0; existing external diagnostic mammography/DBT and targeted ultrasound routes | Existing suspicious-mass imaging/core objectives do not test discharge-specific imaging initiation. Tissue biopsy is deliberately outside this objective. |
| 15 | `concept.breast-cancer-after-neoadjuvant-therapy.response-mapping` | After completed neoadjuvant therapy for noninflammatory breast cancer, coordinate breast/axillary examination and appropriate post-treatment imaging/localization to map residual disease for surgery. | 0; external breast-imaging/specialist route; completed therapy, no clinic administration | Existing inflammatory-breast-cancer sequencing mandates a different multimodal pathway; rectal response assessment concerns different anatomy and tests. |
| 16 | `concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection` | Recognize that selected noninflammatory breast cancer can remain eligible for breast conservation after adequate response, based on residual extent, localization feasibility, radiotherapy, biology/genetics, and patient preference; do not make mastectomy automatic. | 0; external breast-surgery planning | Existing inflammatory breast cancer still requires its disease-specific mastectomy sequence. This objective is limited to selected noninflammatory disease. |
| 17 | `concept.basal-cell-carcinoma.clinical-pattern-recognition` | Recognize a lesion pattern concerning for BCC and arrange diagnostic dermatologic/surgical evaluation; do not score biopsy technique or reuse cSCC treatment logic. | 0; examination and external skin specialist | Active cSCC and melanoma concepts test different malignancies and their biopsy/staging decisions. |
| 18 | `concept.basal-cell-carcinoma.local-invasion-metastasis-counseling` | Counsel a patient with biopsy-confirmed BCC that local tissue destruction is the principal untreated-disease concern and metastasis is rare, while locally advanced disease still needs specialist care. | 0; same-patient or standalone counseling after an already returned pathology result | Active cSCC tests risk-directed excision/Mohs planning. This BCC objective teaches its distinct local-invasion/rare-metastasis behavior and selects no procedure. |
| 19 | `concept.preoperative-nutrition.nutritional-risk-screening` | Perform structured nutritional-risk assessment before major elective surgery rather than treating albumin alone as a nutrition diagnosis. | 0; clinic screen and external dietitian referral | The baseline has no active nutrition-screen concept. Severe-burn and postoperative-ileus concepts begin after acute hospitalization and address feeding support, not preoperative screening. |
| 20 | `concept.preoperative-nutrition.oral-enteral-first-line` | For a stable nutritionally at-risk elective surgical patient with a functional gastrointestinal tract, prioritize oral intake/oral supplements and then enteral nutrition when oral intake is inadequate; reserve parenteral nutrition for oral/enteral infeasibility or contraindication. | 0; external dietitian/perioperative team; no unsourced fixed duration | Existing postoperative-ileus parenteral nutrition concerns prolonged postoperative enteral infeasibility. This objective is preoperative and preserves a functioning-gut boundary. |

## Curriculum mapping

The target is ABSITE scope aligned with the public SCORE General Surgery
Curriculum Outline. The current public ABSITE page was checked on `2026-09-29`
and still identifies the outline as Updated 01/2021; it provides broad category
weights only and cannot support individual-topic frequency claims.

The official SCORE outline was not downloaded again. A bounded attempt to read
the official public PDF was rejected by automatic approval review because it
classified the action as reading a SCORE curriculum PDF prohibited by the
repository source restrictions and directed that no workaround be attempted.
This contract obeys that decision. It relies only on the independently verified
September 28 official 2025–2026 outline, 27 physical pages, SHA-256
`2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`,
and the short trusted locators already recorded locally. No SCORE PDF or
extracted outline text is stored.

| Objectives | SCORE locator and depth | Mapping |
| --- | --- | --- |
| 1–6 | Hernia, printed p. 2 / physical p. 3, Common | Groin/ventral hernia families are explicit; chronic postoperative pain, Spigelian anatomy, and deep prosthetic infection are inferred complication/anatomic subobjectives. |
| 7–8 | Liver, printed p. 8 / physical p. 9, Common; Perioperative Care, printed p. 22 / physical p. 23, Common | Cirrhosis and perioperative assessment are explicit families; the bounded nonhepatic-surgery decisions are inferred. |
| 9–10 | Transplantation, printed p. 20 / physical p. 21, Common/Uncommon topic mix | PTLD is an inferred transplant-neoplasia complication, not a separately verified named line. No exam-frequency claim is made. |
| 11–12 | Endocrine/Thyroid, printed p. 10 / physical p. 11, Common | Thyroid cancer is explicit; nodal mapping and individualized operative extent are inferred subobjectives. |
| 13–16 | Breast, printed p. 9 / physical p. 10, Common | Nipple discharge and breast cancer are explicit families; discharge imaging and post-neoadjuvant planning are inferred decisions. |
| 17–18 | Skin and Soft Tissue, printed p. 11 / physical p. 12, Common/Uncommon topic mix | Nonmelanoma skin cancer is an explicit family; the BCC phenotype and counseling distinction are inferred. |
| 19–20 | Perioperative Care/Nutrition, printed p. 22 / physical p. 23, Common | Nutritional assessment/support is an explicit family; the screening and functional-gut route boundaries are inferred. |

## Atomic evidence claims

All claims are original synthesis, last checked `2026-09-29`, and remain
`needs_clinician_review`. Exact thresholds, probabilities, drug regimens, and
operation details are excluded unless a source directly supports and the final
question genuinely needs them.

| Claim ID | Atomic claim and limitation | Source IDs |
| --- | --- | --- |
| `claim.php.recognition` | Persistent pain after inguinal-hernia repair requires focused history/examination, pain mapping, and reassessment for recurrence and other causes; a compatible neuropathic distribution supports but does not alone prove a nerve mechanism. | `source.php.herniasurge-2023` |
| `claim.php.block-evaluation` | In specialist evaluation, a local-anesthetic trigger-point or peripheral nerve block may provide diagnostic information, but evidence is very low and no single technique or response is guaranteed. | `source.php.herniasurge-2023` |
| `claim.spigelian.anatomy-recognition` | Spigelian hernia occurs through the Spigelian fascia along the lateral ventral abdominal wall; examination, ultrasonography, or CT may establish the diagnosis. | `source.spigelian.ehs-ahs-2020` |
| `claim.spigelian.repair-referral` | A confirmed Spigelian hernia supports surgical repair discussion, but evidence is insufficient to prescribe one open or laparoscopic technique for every patient. | `source.spigelian.ehs-ahs-2020` |
| `claim.mesh.deep-pattern` | Prosthetic mesh infection may present as a chronic or indolent deep process with sinus/drainage, collection, fistula, or systemic infection rather than superficial incisional erythema alone. | `source.mesh.wses-sise-2018` |
| `claim.mesh.source-control` | Suspected deep mesh infection needs prompt specialist source-control evaluation; treatment is individualized and failure of conservative management may require removal, so removal is not taught as automatic. | `source.mesh.wses-sise-2018` |
| `claim.cirrhosis.multifactor-risk` | Perioperative risk in cirrhosis depends on liver severity, portal hypertension/decompensation, procedure type, comorbidity, and center experience; no one score or laboratory value captures the whole decision. | `source.cirrhosis.aga-2019` |
| `claim.cirrhosis.optimize-decompensation` | Active decompensation such as uncontrolled ascites or encephalopathy supports multidisciplinary optimization before proceeding with a nonurgent elective plan; deferral is an inferred case-specific planning boundary, not an automatic prohibition. The contract teaches no fixed mortality percentage or universal cutoff. | `source.cirrhosis.aga-2019` |
| `claim.ptld.pattern` | PTLD is heterogeneous; in a solid-organ recipient, unexplained fever, lymphadenopathy, an extranodal mass, organ dysfunction, or rising EBV viremia should prompt evaluation while infection and rejection remain mimics. | `source.ptld.ast-2019`, `source.ptld.frontiers-review-2026` |
| `claim.ptld.tissue` | Tissue biopsy is required to classify suspected PTLD; EBV DNA and imaging can support evaluation but are not substitutes for histopathologic diagnosis. | `source.ptld.ast-2019` |
| `claim.dtc.preop-ultrasound` | Malignant thyroid cytology or molecular findings warrant preoperative central and lateral neck ultrasonography to assess nodes and gross local extension. | `source.dtc.ata-2025` |
| `claim.dtc.lobectomy-boundary` | For a patient who has chosen surgery for differentiated thyroid cancer measuring 2 cm or less, confined to one lobe without gross extension or nodal disease, lobectomy is an eligible initial option; this does not make lobectomy mandatory. | `source.dtc.ata-2025`, `source.dtc.ata-summary-2025` |
| `claim.dtc.extent` | Initial thyroid surgical extent is individualized from tumor extent/laterality, nodal or distant disease, recurrence considerations, future treatment needs, and patient preferences; confirmed DTC does not mandate the same operation in every case. | `source.dtc.ata-2025`, `source.dtc.ata-summary-2025` |
| `claim.discharge.pathologic-pattern` | Spontaneous unilateral single-duct serous or bloody discharge is concerning for a pathologic process, whereas bilateral multiduct discharge elicited with compression more often follows a physiologic pattern. | `source.discharge.acr-2022` |
| `claim.discharge.imaging` | Clearly physiologic discharge generally does not need diagnostic imaging; pathologic discharge warrants age/context-appropriate diagnostic mammography or DBT with targeted ultrasonography as applicable. | `source.discharge.acr-2022` |
| `claim.nact.response-mapping` | After neoadjuvant systemic therapy, operative planning integrates the original disease distribution, current breast/axillary examination, residual imaging findings, and localization of a residual lesion or marker when needed. | `source.nact.asbrs-2025`, `source.bcs.asbrs-2026` |
| `claim.nact.bcs-selection` | Selected noninflammatory breast cancer may be treated with breast-conserving surgery after adequate response when residual extent can be localized and acceptable conservation/radiotherapy is feasible; response does not make conservation universal. | `source.nact.asbrs-2025`, `source.bcs.asbrs-2026` |
| `claim.nact.oncoplastic-selection` | An oncoplastic breast-conserving approach can remain an option for selected localized residual disease when a wider resection is needed and negative margins with acceptable cosmesis appear feasible; it is not suitable for every response pattern. | `source.bcs.asbrs-2026` |
| `claim.bcc.pattern` | A slowly enlarging pearly or translucent papule/nodule, often with telangiectasia or ulceration, is concerning for BCC and warrants diagnostic confirmation because clinical appearance alone does not establish histology; a firm scar-like plaque can represent morpheaform BCC. | `source.bcc.nci-pdq-current` |
| `claim.bcc.local-invasion` | BCC usually grows locally and can cause substantial destructive morbidity if neglected or recurrent. | `source.bcc.nci-pdq-current`, `source.bcc.s2k-2024` |
| `claim.bcc.rare-metastasis` | Metastasis from BCC is rare; counseling must not minimize locally advanced disease or imply that specialist follow-up is unnecessary. No numeric incidence is taught. | `source.bcc.nci-pdq-current`, `source.bcc.s2k-2024` |
| `claim.nutrition.screen` | Nutritional status should be assessed before major surgery with a structured clinical process; albumin alone is not treated as a nutrition diagnosis. | `source.nutrition.espen-practical-2021` (single-guideline limitation) |
| `claim.nutrition.referral` | Identified preoperative nutritional risk supports dietitian/perioperative-team assessment and an individualized nutrition plan rather than an improvised universal supplement regimen. | `source.nutrition.espen-practical-2021` (single-guideline limitation) |
| `claim.nutrition.oral-enteral` | When the gastrointestinal tract is functional, oral intake and oral supplements are preferred first, with enteral nutrition used when oral intake is inadequate. | `source.nutrition.espen-practical-2021` |
| `claim.nutrition.pn-boundary` | Parenteral nutrition is reserved for situations in which oral and enteral routes are infeasible, contraindicated, or insufficient; no fixed timing is taught here. | `source.nutrition.espen-practical-2021` |

## Source register: authority, rights, and limits

All URLs were accessed `2026-09-29`. Medical authority is separate from reuse
permission. CC licenses require attribution and retain their stated commercial
or adaptation limits. Copyrighted society guidance is used only for targeted
factual verification and original synthesis.

- `source.curriculum.score-gs-2025-26` — Surgical Council on Resident Education,
  *General Surgery Curriculum Outline | 2025–2026*, official public outline,
  <https://absprodeus2scorestor.blob.core.windows.net/score/curriculumoutline_gs.pdf>.
  Previously verified September 28 as described above; copyrighted, no reusable
  license asserted. Supports only the short curriculum mappings.
- `source.curriculum.absite-2021` — American Board of Surgery, *General Surgery
  In-Training Examination (ABSITE) Content Outline*, Updated 01/2021,
  <https://www.absurgery.org/resources/exam-content-outlines/general-surgery-in-training-examination-absite-content-outline/>.
  Official category-level authority; copyrighted; no individual frequency use.
- `source.php.herniasurge-2023` — Stabilini C, van Veenendaal N, Aasvang E, et
  al., “Update of the international HerniaSurge guidelines for groin hernia
  management,” *BJS Open* 2023;7(5):zrad080.
  doi:10.1093/bjsopen/zrad080,
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10588975/>. International guideline;
  CC BY 4.0. Attribution required. Direct support for both postherniorrhaphy-pain
  claims; evidence quality for blocks is explicitly low.
- `source.spigelian.ehs-ahs-2020` — Henriksen NA, Kaufmann R, Simons MP, et al.,
  “EHS and AHS guidelines for treatment of primary ventral hernias in rare
  locations or special circumstances,” *BJS Open* 2020;4(2):342–353.
  doi:10.1002/bjs5.50252,
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC7093793/>. Joint society guideline;
  CC BY-NC-ND 4.0. Targeted facts and citation only; no adaptation or copied
  table/wording. Single-guideline limitation retained.
- `source.mesh.wses-sise-2018` — Sartelli M, Guirao X, Hardcastle TC, et al.,
  “2018 WSES/SIS-E consensus conference: recommendations for the management of
  skin and soft-tissue infections,” *World Journal of Emergency Surgery*
  2018;13:58. doi:10.1186/s13017-018-0219-9,
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC6295010/>. Society consensus; CC BY
  4.0. Attribution required. Single-source limitation for the mesh-specific
  statements; do not turn conditional removal into a universal rule.
- `source.cirrhosis.aga-2019` — Northup PG, Friedman LS, Kamath PS, “AGA
  Clinical Practice Update on Surgical Risk Assessment and Perioperative
  Management in Cirrhosis: Expert Review,” *Clinical Gastroenterology and
  Hepatology* 2019;17(4):595–606. doi:10.1016/j.cgh.2018.09.043,
  <https://gastro.org/clinical-guidance/surgical-risk-assessment-and-perioperative-management-in-cirrhosis/>.
  Society expert review; copyrighted, targeted factual verification only.
  Single-guidance limitation; no fixed risk percentage or cutoff.
- `source.ptld.ast-2019` — Allen UD, Preiksaitis JK; AST Infectious Diseases
  Community of Practice, “Post-transplant lymphoproliferative disorders,
  Epstein-Barr virus infection, and disease in solid organ transplantation:
  Guidelines from the American Society of Transplantation Infectious Diseases
  Community of Practice,” *Clinical Transplantation* 2019;33(9):e13652.
  doi:10.1111/ctr.13652, <https://pubmed.ncbi.nlm.nih.gov/31230381/>. Society
  guideline; copyright Wiley, targeted factual verification only. Primary
  tissue-diagnosis authority; phenotype and differential framing are
  independently cross-checked below. No subtype treatment or surveillance
  frequency is taught.
- `source.ptld.frontiers-review-2026` — Vargas-Nieto LP, Santoyo-Sarmiento D, Ballesteros-García MF, Calderón-Vásquez AM, Pinto-Rodriguez M, Robayo-Romero J, Cormane-Alfaro S, Daza-Buitrago JA, “Post-transplant lymphoproliferative disorder after solid organ transplantation: a comprehensive review,” *Frontiers in Transplantation* 2026;5:1869288. doi:10.3389/frtra.2026.1869288, <https://www.frontiersin.org/journals/transplantation/articles/10.3389/frtra.2026.1869288/full>. Open-access review, CC BY 4.0; phenotype/differential cross-check for `claim.ptld.pattern` only.
- `source.dtc.ata-2025` — Ringel MD, Sosa JA, et al., “2025 American Thyroid
  Association Management Guidelines for Adult Patients with Differentiated
  Thyroid Cancer,” *Thyroid* 2025;35(8):841–985.
  doi:10.1177/10507256251363120,
  <https://journals.sagepub.com/doi/pdf/10.1177/10507256251363120>. Current
  society guideline; copyright retained, targeted factual verification only.
  Do not copy recommendations, tables, or exact thresholds into variants unless
  separately required and directly checked.
- `source.dtc.ata-summary-2025` — American Thyroid Association, *What are the key changes in the 2025 ATA guidelines for differentiated thyroid cancer?*, *Clinical Thyroidology for the Public* 2025;18(12):4–5, <https://www.thyroid.org/patient-thyroid-information/ct-for-patients/december-2025/vol-18-issue-12-p-4-5/>. Official society patient summary; copyrighted, targeted factual verification only. Supports the bounded 2-cm unilateral intrathyroidal surgical-extent example in `claim.dtc.extent`; it is from the same ATA source family and is not independent corroboration.
- `source.discharge.acr-2022` — Expert Panel on Breast Imaging; Sanford MF,
  Slanetz PJ, Lewin AA, et al., “ACR Appropriateness Criteria® Evaluation of
  Nipple Discharge: 2022 Update,” *Journal of the American College of Radiology*
  2022;19(11S):S304–S318. doi:10.1016/j.jacr.2022.09.020,
  <https://acsearch.acr.org/docs/3099312/Narrative/>. Professional-society
  imaging guidance; copyrighted, targeted verification only. Do not reproduce
  its variants or ratings table.
- `source.nact.asbrs-2025` — American Society of Breast Surgeons,
  *Resource Guide: Preoperative Management of Patients Treated with Neoadjuvant
  Systemic Therapy*, January 2025,
  <https://www.breastsurgeons.org/docs/statements/asbrs-rg-nst.pdf>. Current
  society resource guide; copyright ASBrS, targeted factual verification only.
  It is expert guidance, not a reusable authoring corpus.
- `source.bcs.asbrs-2026` — American Society of Breast Surgeons,
  *Resource Guide: Breast Conserving Surgery*, February 2026,
  <https://spot.breastsurgeons.org/docs/statements/asbrs-breast-conserving-surgery-2026-02-24.pdf>.
  Current society resource guide; copyright ASBrS, targeted factual verification
  only. It supports selection principles, not an automatic conservation rule.
- `source.bcc.nci-pdq-current` — National Cancer Institute PDQ Adult Treatment
  Editorial Board, *Skin Cancer Treatment (PDQ®)–Health Professional Version*,
  current page, <https://www.cancer.gov/types/skin/hp/skin-treatment-pdq>.
  U.S. government editorial summary used for targeted factual verification.
  Third-party material is not assumed reusable. Supports the pattern and
  local-destruction/rare-metastasis counseling boundary.
- `source.bcc.s2k-2024` — Lang BM, Balermpas P, Bauer A, et al., “S2k guideline
  basal cell carcinoma of the skin (update 2023),” *Journal der Deutschen
  Dermatologischen Gesellschaft* 2024;22(12):1697–1714.
  doi:10.1111/ddg.15566,
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC11626229/>. Multisociety guideline;
  CC BY-NC 4.0. Attribution and noncommercial limits apply. Independent support
  for locally destructive growth and rare metastasis; no numeric incidence is
  taught.
- `source.nutrition.espen-practical-2021` — Weimann A, Braga M, Carli F, et al.,
  “ESPEN practical guideline: Clinical nutrition in surgery,” *Clinical
  Nutrition* 2021;40(7):4745–4761. doi:10.1016/j.clnu.2021.03.031,
  <https://doi.org/10.1016/j.clnu.2021.03.031>.
  Society practical guideline; © 2021 ESPEN/Elsevier, all rights reserved.
  Copyrighted, targeted factual verification only; use independently written
  atomic statements and do not reproduce protected expression. This is not the
  excluded 2025 update.

## Duplicate exclusions and authoring constraints

- Excluded as active duplicates: desmoid initial surveillance/progression,
  vitamin-C collagen biology, lactational abscess imaging/drainage, soft-tissue
  mass MRI/core biopsy, asymptomatic primary hyperparathyroidism, complex anal
  fistula MRI/seton planning, postoperative seroma characterization/observation,
  cSCC excision/Mohs planning, melanoma biopsy/staging, and inflammatory-breast
  neoadjuvant sequencing.
- Excluded as near-duplicates: routine observation of stable postoperative groin
  hematoma and generic tissue biopsy after nipple-discharge imaging.
- Femoral-access pseudoaneurysm was removed because prior review classified it
  as supplemental rather than explicitly SCORE-mapped. Postsplenectomy portal
  thrombosis was replaced by the more central preoperative-nutrition pair.
- Postherniorrhaphy blocks are external specialist decisions. Do not invent an
  onsite pain-block service, response, or treatment ladder.
- Suspected deep mesh infection, active cirrhosis decompensation, and concerning
  PTLD findings must not wait for a contrived clinic test. Completed outside
  reports may support standalone cases.
- DTC ultrasonography is a real service choice only where the existing route
  contract covers neck ultrasound. Otherwise use a completed outside result or
  external referral and report the missing route rather than inventing one.
- Nipple-discharge imaging uses diagnostic breast imaging, not screening.
- Post-neoadjuvant breast cases are noninflammatory and post-hospital-treatment
  planning. They preserve localization feasibility, radiotherapy, genetics,
  residual extent, and patient preference; they never reverse the active IBC
  pathway.
- BCC recognition does not score a biopsy technique. BCC counseling begins from
  an already returned pathology result and does not reuse the active cSCC
  risk-directed operation objective.
- Nutrition variants do not reproduce a source tool, prescribe a universal
  supplement, use albumin as a nutrition diagnosis, or teach an unsourced number
  of preoperative days. The gastrointestinal-route boundary stays explicit.
- Runtime choices must be parallel and comparably specific/long. Every testing
  choice, including distractors, needs a real service request and centralized
  timing metadata. Do not attach an inert result gate to a final node.
- Each objective needs four clinically substantive variants and at least one
  independent case. Preserve named-patient story verbs, exact one-key behavior,
  compatible age/sex profiles, and urgent acuity separate from progression.

## Decision

All twenty objectives are supportable within the recorded evidence and
pre-Endoscopy capability boundary. PTLD remains transparently inferred rather
than explicitly named in the verified public curriculum outline. Single-source
limitations for postherniorrhaphy pain, Spigelian hernia, mesh infection,
cirrhosis, DTC, and nipple discharge remain visible for clinician review.
No clinical claim is approved by this research handoff.






