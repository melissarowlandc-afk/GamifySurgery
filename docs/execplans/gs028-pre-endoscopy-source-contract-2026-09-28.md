# GS-028 pre-Endoscopy twenty-objective source contract

Status: bounded research handoff for the September 28, 2026 batch. This is an
authoring contract, not clinical approval, a public release, or permission to
copy any source. All resulting claims, concepts, questions, cases, and feedback
must remain `needs_clinician_review` in the owner/development preview.

## Research boundary and roster decision

The roster below was compared with the 183 concepts in the live runtime release,
the GS-028 onboarding inventory, and the unchanged 161-row owner candidate sheet
through row 162. It replaces the sheet's row-122 emergency gallstone-pancreatitis
idea with the owner's row-162 Glasgow Coma Scale request. No Endoscopy capability
is required. Stage suggestions describe gameplay availability, not acuity or
educational complexity.

Use four substantively different question variants for every objective. Give
each objective at least one independently eligible case so a learned sibling
cannot strand it. Paired families should also have purposeful two-node cases
where the second decision follows actual returned information. Do not turn a
post-hospital record-review case into a definition quiz, and do not delay urgent
transfer to create a result gate.

| # | Proposed stable concept ID | Narrow objective | Earliest stage / route | Closest existing runtime neighbor and distinction |
| ---: | --- | --- | --- | --- |
| 1 | `concept.small-bowel-obstruction.ct-pattern-recognition` | Recognize mechanical small-bowel obstruction from a completed CT showing proximal small-bowel dilation with a transition point and distal decompression, without claiming that imaging alone establishes ischemia. | 2; existing external CT route or a completed outside-hospital CT record | `concept.postoperative-ileus.parenteral-nutrition-when-enteral-infeasible` addresses nutritional support during prolonged postoperative ileus, and `concept.gastroparesis.confirmatory-gastric-emptying-scintigraphy` requires prior exclusion of obstruction. Neither tests SBO CT recognition. |
| 2 | `concept.small-bowel-obstruction.urgent-surgical-escalation` | Select immediate hospital surgical escalation when suspected SBO has peritonitis or findings concerning for strangulation/ischemia; do not wait for a clinic test. | 0; immediate external transfer, no timed gate | The fascial-dehiscence/evisceration emergency concept tests a different postoperative emergency. No current concept tests SBO escalation. |
| 3 | `concept.umbilical-epigastric-hernia.clinical-recognition` | Recognize a reducible primary umbilical or epigastric hernia clinically; use targeted imaging only when the examination is uncertain. | 0; examination, with optional external ultrasound distractors timed centrally | Existing inguinal/femoral concepts test groin anatomy and management; the incisional-hernia pulmonary concept presupposes a known incisional hernia. This objective tests a different primary midline hernia family. |
| 4 | `concept.umbilical-epigastric-hernia.symptomatic-elective-referral` | Refer a stable symptomatic umbilical or epigastric hernia for individualized elective repair discussion, while routing incarceration/strangulation features urgently and avoiding one-size repair-technique claims. | 0; external elective surgical referral | Existing symptomatic inguinal repair and femoral repair concepts concern different anatomy and risk. The incisional-hernia concept tests pulmonary optimization, not the indication for referral. |
| 5 | `concept.varicose-veins.reflux-duplex-evaluation` | Select venous reflux duplex for symptomatic lower-extremity varicose veins being evaluated for treatment. | 1; reuse the external venous-duplex service/route only if its capability contract supports reflux evaluation, otherwise add a separate external reflux-duplex route | Existing postoperative-DVT duplex tests acute thrombosis, and Mondor Doppler tests a superficial breast/chest-wall cord. Venous-ulcer concepts begin after ulcer formation. |
| 6 | `concept.varicose-veins.intervention-referral-after-axial-reflux` | After completed duplex documents symptomatic axial superficial reflux in an intervention candidate who wants treatment, refer for superficial venous intervention rather than imposing long-term compression as a mandatory prerequisite. | 1; external vascular referral after completed duplex | Existing venous-ulcer compression is wound care after adequate arterial assessment. This objective concerns uncomplicated symptomatic varicose veins and preference-sensitive intervention referral. |
| 7 | `concept.diabetic-foot-infection.clinical-recognition` | Diagnose diabetic foot soft-tissue infection clinically from compatible local or systemic inflammatory findings and distinguish colonization or an uninfected ulcer. | 1; general-clinic examination and external referral only; no onsite wound-specialty service | Existing cutaneous-abscess and lymphangitis concepts test different lesions. Existing PAD and venous-ulcer objectives do not test infection recognition in a diabetic foot ulcer. |
| 8 | `concept.diabetic-foot-ulcer.no-antibiotics-without-infection` | With a clinically uninfected diabetic foot ulcer, withhold systemic or local antibiotics intended to prevent infection or accelerate healing and arrange external multidisciplinary referral. | 1; general-clinic antibiotic/referral boundary only; no onsite wound-specialty service or antibiotic action | This is distinct from postoperative prophylaxis cessation and selective antibiotics after drained perianal abscess: the ulcer has no clinical infection at all. Do not author a wound-healing algorithm beyond the antibiotic boundary. |
| 9 | `concept.burn.superficial-partial-thickness-recognition` | Recognize a superficial partial-thickness thermal burn from a moist, red, blanching, blistered, very painful wound, while distinguishing superficial, deep-partial, and full-thickness patterns. | 0; examination only | Existing `concept.severe-burn.early-enteral-nutrition` presupposes an extensive adequately resuscitated burn and tests nutrition, not depth recognition. |
| 10 | `concept.burn.referral-consultation-selection` | Use burn depth, location, extent, mechanism, inhalation concern, comorbidity, pain, and local resources to choose burn-center consultation or immediate transfer; exact thresholds may appear only when directly sourced and must not delay stabilization. | 0; external consultation/transfer, no clinic wait | No current concept tests burn referral. This remains separate from nutritional care for an already resuscitated severe burn. |
| 11 | `concept.hidradenitis-suppurativa.pattern-recognition` | Recognize hidradenitis suppurativa from recurrent typical nodules/abscesses, tunnels or scarring in characteristic intertriginous sites and a relapsing course. | 0; examination/history only | Cutaneous and perianal abscess concepts test isolated drainable infections. Pilonidal disease tests a different anatomic process. |
| 12 | `concept.hidradenitis-suppurativa.multimodal-specialist-planning` | Refer recurrent or tunnel-forming hidradenitis for severity-based longitudinal multimodal medical and surgical planning rather than treating repeated simple incision and drainage as definitive disease control. | 0; external dermatology/surgery pathway | Existing abscess drainage remains correct for an isolated abscess; this objective tests chronic inflammatory disease planning. Do not encode a drug regimen or universal operation. |
| 13 | `concept.parastomal-hernia.clinical-recognition` | Recognize a parastomal hernia/bulge clinically in a stable ostomy patient and identify uncertainty or obstruction features that require further assessment. | 1; examination, optional external CT only for diagnostic uncertainty/operative planning | High-output ileostomy concepts test fluid/electrolyte loss and oral rehydration, not a structural peristomal bulge. Other hernia concepts do not involve a stoma. |
| 14 | `concept.parastomal-hernia.nonurgent-stoma-specialist-management` | For a stable reducible parastomal hernia without obstruction or ischemia, select individualized stoma-nurse/hernia-specialist assessment and symptom management rather than promising routine repair or a universal support garment. | 1; external stoma/hernia referral | No existing concept tests parastomal-hernia management. The evidence base is limited, so cases must preserve preference, symptom, appliance, and local-resource dependence. |
| 15 | `concept.stoma-prolapse.viability-obstruction-assessment` | Recognize full-thickness stoma prolapse and promptly assess reducibility, bowel viability, output/obstruction, pain, and appliance function. | 1; examination only | Existing ileostomy objectives test high output, not prolapse; parastomal hernia is a separate peristomal fascial defect. |
| 16 | `concept.stoma-prolapse.urgent-surgical-escalation` | Send an irreducible prolapsed stoma with ischemia or obstruction for urgent hospital surgery, while a viable reducible prolapse may receive nonemergency specialist care. | 1; urgent external transfer when indicated | No current stoma emergency objective has this meaning. Do not teach sugar reduction as a substitute for escalation in ischemia or obstruction. |
| 17 | `concept.gcs.complete-component-total` | Calculate the Glasgow Coma Scale total only when all eye, verbal, and motor components are testable, using the documented component responses. | 0; review of the same named patient's completed emergency assessment, no new test | There is no current GCS objective. This is arithmetic interpretation of recorded responses, not severity classification, prognosis, or a management threshold. |
| 18 | `concept.gcs.verbal-not-testable-documentation` | When an actual interference makes the verbal response untestable, record the component as `V-NT` with the reason and report components rather than assigning a false verbal score of 1/0 or a misleading total. | 0; same-patient emergency-note review or immediate documentation without delaying escalation | No current GCS objective. Do not imply every tracheostomy makes speech untestable; the authored interference must genuinely prevent verbal testing. |
| 19 | `concept.secondary-lymphedema.clinical-recognition` | Recognize chronic secondary lymphedema after lymph-node treatment from a compatible history and limb findings while preserving DVT, infection, recurrent malignancy, and systemic edema as exclusions when indicated. | 1; examination/history; use existing venous duplex only when the differential actually warrants it | Existing lymphangitis is acute tender erythematous streaking; postoperative DVT is acute unilateral swelling. Neither tests chronic lymphatic failure. |
| 20 | `concept.secondary-lymphedema.decongestive-therapy-referral` | Refer established stable secondary lymphedema for individualized complete decongestive therapy, including fitted compression, exercise, skin care, and manual lymphatic drainage as appropriate. | 1; external lymphedema-therapy referral | Existing venous-ulcer compression treats venous disease after arterial assessment. This objective tests multimodal lymphatic care and must not prescribe one compression level to every patient. |

## Curriculum mapping

Target: ABSITE scope aligned to the public SCORE General Surgery Curriculum
Outline. The current SCORE PDF was downloaded only for targeted verification on
September 28, 2026 from its official versionless endpoint. It identifies itself
as **2025–2026**, has 27 physical PDF pages, and matches SHA-256
`2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09`.
No PDF or extracted text is stored in the repository. The public ABSITE outline
still identifies itself as Updated 01/2021 and supplies category-level context
only. Neither source supports an individual-question-frequency claim.

| Objectives | SCORE locator and depth | Mapping |
| --- | --- | --- |
| 1–2 | Small Intestine → Diseases/Conditions → **Small Intestinal Obstruction**, printed p. 6 / physical p. 7, Common | Explicit family; CT interpretation and emergency disposition are inferred subobjectives. |
| 3–4 | Hernia → Diseases/Conditions → **Umbilical and Epigastric Hernias**, printed p. 2 / physical p. 3, Common | Explicit family; recognition and referral details inferred. |
| 5–6 | Vascular Venous → Diseases/Conditions → **Varicose Veins** and Operations/Procedures → **Venous Insufficiency and Related Procedures**, printed p. 15 / physical p. 16, Common | Explicit families; duplex and candidate-specific referral details inferred. |
| 7–8 | Arterial Disease → Diseases/Conditions → **Diabetic Foot Infections**, printed p. 14 / physical p. 15, Common | Objective 7 explicit/inferred detail. Objective 8 is supplemental to that named family because it tests an uninfected ulcer boundary. |
| 9–10 | Trauma → Diseases/Conditions → **Burns**, printed p. 13 / physical p. 14, Common | Explicit family; depth and referral decisions inferred. |
| 11–12 | Skin and Soft Tissue → Diseases/Conditions → **Hidradenitis Suppurativa**, printed p. 11 / physical p. 12, Common | Explicit family; pattern and multimodal planning inferred. |
| 13–14 | Hernia → Diseases/Conditions → **Miscellaneous Hernias**, printed p. 2 / physical p. 3, Common; also Large Intestine → Operations/Procedures → **Colostomy and Colostomy Closure**, printed p. 7 / physical p. 8, Common | Parastomal hernia is inferred within named hernia/ostomy families; it is not named explicitly. |
| 15–16 | Small Intestine → Operations/Procedures → **Ileostomy and Ileostomy Closure**, printed p. 7 / physical p. 8, Common, and Large Intestine → **Colostomy and Colostomy Closure**, same locator/depth | Inferred complication scope; stoma prolapse is not named explicitly. |
| 17–18 | Trauma → **Initial Assessment and Management of Trauma** and **Traumatic Brain Injury**, printed p. 13 / physical p. 14, Common | Inferred. GCS is not named in the outline. These objectives answer owner sheet row 162 without claiming an explicit SCORE GCS line. |
| 19–20 | Skin and Soft Tissue → Diseases/Conditions → **Lymphedema**, printed p. 11 / physical p. 12, Uncommon | Explicit family; secondary recognition and decongestive referral details inferred. |

## Atomic evidence claims

Every claim below is original synthesis, last checked `2026-09-28`, evidence
category `clinical_guideline_or_consensus` unless noted, and review status
`needs_clinician_review`.

| Claim ID | Atomic claim and limitation | Supporting source IDs |
| --- | --- | --- |
| `claim.sbo.ct-transition-pattern` | A completed CT showing dilated proximal small bowel, a transition point, and decompressed distal bowel supports mechanical SBO; CT findings must be integrated with the clinical assessment and do not alone prove ischemia. | `source.sbo.acr-2020`, `source.sbo.wses-2018` |
| `claim.sbo.urgent-escalation-features` | Peritonitis or concern for strangulation/ischemia in SBO requires urgent surgical evaluation rather than a routine nonoperative outpatient pathway. | `source.sbo.wses-2018`, `source.sbo.east-2012` |
| `claim.primary-midline-hernia.clinical-recognition` | Most umbilical and epigastric hernias are diagnosed clinically; ultrasound or CT may be used when examination is inconclusive. | `source.hernia.ehs-ahs-2020` (single-guideline limitation) |
| `claim.primary-midline-hernia.symptomatic-referral` | A stable symptomatic umbilical or epigastric hernia supports elective repair discussion tailored to patient, hernia, surgeon, and local-resource factors. Evidence quality for many technique details is low, so no universal technique is claimed. | `source.hernia.ehs-ahs-2020` (single-guideline limitation) |
| `claim.varicose.reflux-duplex` | Duplex ultrasound is the diagnostic test of choice for lower-extremity chronic venous reflux evaluation. | `source.varicose.svs-avf-avls-2022` (single-guideline limitation) |
| `claim.varicose.intervention-referral` | For symptomatic axial superficial reflux in a patient who is an intervention candidate and wants treatment, specialist superficial venous intervention is preferred to mandatory long-term compression. | `source.varicose.svs-avf-avls-2023` (single-guideline limitation) |
| `claim.varicose.conservative-boundary` | Conservative care remains reasonable when comorbidity, mobility, anatomy, local resources, or patient preference weighs against intervention; no universal procedure is taught. | `source.varicose.svs-avf-avls-2023` (single-guideline limitation) |
| `claim.dfi.clinical-recognition` | Diabetic foot soft-tissue infection is diagnosed clinically from local or systemic inflammatory signs; microbial colonization alone does not establish infection. | `source.dfi.iwgdf-idsa-2023` (single-guideline limitation) |
| `claim.dfi.initial-escalation` | Severe infection, or moderate infection with important morbidity, warrants hospital consideration; gangrene, deep abscess, necrotizing infection, compartment syndrome, or severe ischemia warrants urgent surgical consultation. This objective ends at recognition and external escalation. | `source.dfi.iwgdf-idsa-2023` (single-guideline limitation) |
| `claim.dfu.no-antibiotics-uninfected` | Do not use systemic or local antibiotics for a clinically uninfected diabetic foot ulcer solely to prevent infection or promote healing. | `source.dfi.iwgdf-idsa-2023` (single-guideline limitation) |
| `claim.burn.superficial-partial-depth` | A superficial partial-thickness burn is typically moist, red, blanching, blistered, and very painful; deeper burns become paler/drier, less blanching, and less sensate. Depth can evolve and requires reassessment. | `source.burn.aba-referral-2022`, `source.burn.aha-redcross-2024` |
| `claim.burn.referral-boundary` | Burn-center consultation or transfer depends on depth, extent, special location, mechanism, inhalation concern, comorbidity, pain, local resources, and associated trauma; the ABA thresholds may be used only exactly and with attribution. | `source.burn.aba-referral-2022`, `source.burn.aha-redcross-2024` |
| `claim.hs.pattern-recognition` | HS is recognized clinically by typical recurrent lesions such as nodules, abscesses, tunnels, or scars in characteristic intertriginous sites with a relapsing course. | `source.hs.australasian-2025`, `source.hs.north-american-2019` |
| `claim.hs.multimodal-planning` | Recurrent or tunnel-forming HS needs severity-based longitudinal multimodal planning; repeated simple drainage may relieve an acute collection but is not definitive chronic-disease control. Exact medical therapy is outside this objective. | `source.hs.australasian-2025`, `source.hs.north-american-2019` |
| `claim.parastomal-hernia.recognition` | A new peristomal bulge compatible with a fascial defect supports parastomal-hernia recognition; diagnostic uncertainty or obstructive symptoms require further assessment. | `source.parastomal.ehs-2018`, `source.ostomy.missto-wses-2023` |
| `claim.parastomal-hernia.individualized-nonurgent-care` | Stable nonobstructed parastomal hernia symptoms may be managed through individualized appliance, support, activity, education, and referral measures; evidence is limited and no universal garment or routine operation is supported. | `source.parastomal.nursing-2025`, `source.parastomal.ehs-2018` |
| `claim.stoma-prolapse.assessment` | A prolapsed stoma requires prompt assessment of reducibility, viability, obstruction/output, pain, and appliance function; viable reducible prolapse can follow a nonemergency specialist pathway. | `source.stoma.acpgbi-2021`, `source.ostomy.missto-wses-2023` |
| `claim.stoma-prolapse.urgent-escalation` | Irreducible stoma prolapse with ischemia or obstruction requires urgent operative evaluation. Evidence for reduction techniques is low and they must not delay escalation. | `source.stoma.acpgbi-2021`, `source.ostomy.missto-wses-2023` |
| `claim.gcs.complete-total` | The GCS total is the sum of eye, verbal, and motor scores only when all three components are testable; component findings should remain visible. | `source.gcs.faq-current`, `source.gcs.assessment-aid-current` |
| `claim.gcs.eye-mapping` | Eye response scores are 4 spontaneous, 3 to sound, 2 to pressure, and 1 none. | `source.gcs.assessment-aid-current` (same official source family; independent corroboration limited) |
| `claim.gcs.verbal-mapping` | Verbal response scores are 5 oriented, 4 confused, 3 words, 2 sounds, and 1 none when the component is testable. | `source.gcs.assessment-aid-current` (same official source family; independent corroboration limited) |
| `claim.gcs.motor-mapping` | Motor response scores are 6 obeys commands, 5 localizes, 4 normal flexion, 3 abnormal flexion, 2 extension, and 1 none. | `source.gcs.assessment-aid-current` (same official source family; independent corroboration limited) |
| `claim.gcs.verbal-nt` | If an interference genuinely prevents verbal-response testing, document the component as not testable with the reason and avoid substituting 1/0 or reporting a misleading total. | `source.gcs.faq-current`, `source.gcs.assessment-aid-current` (same official source family; independent corroboration limited) |
| `claim.lymphedema.secondary-recognition` | Chronic limb swelling after lymphatic node/vessel treatment may represent secondary lymphedema, but acute DVT, infection, recurrent malignancy, and systemic causes must be considered and investigated when indicated. | `source.lymphedema.isl-2023`, `source.lymphedema.nci-pdq-current` |
| `claim.lymphedema.decongestive-referral` | Established lymphedema is managed with individualized decongestive care using compression, exercise, skin care, and manual lymphatic drainage as appropriate; there is no universal garment or pressure prescription. | `source.lymphedema.isl-2023`, `source.lymphedema.nci-pdq-current` |

## Source register, authority, rights, and limits

All URLs were accessed September 28, 2026. Medical authority and reuse status
are recorded separately. Links are for targeted factual verification. Authoring
must use original prose and must not copy tables, algorithms, figures, charts,
assessment aids, or protected wording.

- `source.curriculum.score-gs-2025-26` — Surgical Council on Resident
  Education, *General Surgery Curriculum Outline | 2025–2026*. Official public
  curriculum PDF, versionless endpoint,
  <https://absprodeus2scorestor.blob.core.windows.net/score/curriculumoutline_gs.pdf>.
  High curricular authority; copyrighted, no reusable license asserted. Use
  only the short original mappings above. Supports all curriculum rows.
- `source.curriculum.absite-2021` — American Board of Surgery, *General Surgery
  In-Training Examination (ABSITE) Content Outline*, Updated 01/2021,
  <https://www.absurgery.org/resources/exam-content-outlines/general-surgery-in-training-examination-absite-content-outline/>.
  Official category-level exam authority; copyrighted. It does not establish
  individual-topic frequency. Supports the stated target only.
- `source.sbo.wses-2018` — ten Broek RPG, Krielen P, Di Saverio S, et al.,
  “Bologna guidelines for diagnosis and management of adhesive small bowel
  obstruction: 2017 update,” *World Journal of Emergency Surgery* 2018;13:24.
  doi:10.1186/s13017-018-0185-2,
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC6006983/>. Professional-society
  guideline; CC BY 4.0 article. Direct authority for CT danger findings and
  operative/nonoperative boundary. Supports the two SBO claims.
- `source.sbo.east-2012` — Maung AA, Johnson DC, Piper GL, et al., “Small-Bowel
  Obstruction, Evaluation and Management of,” EAST Practice Management
  Guideline, *Journal of Trauma* 2012;73(5 Suppl 4):S362–S369,
  <https://www.east.org/education-resources/practice-management-guidelines/details/smallbowel-obstruction-evaluation-and-management-of>.
  Professional-society guideline, still listed by EAST; copyrighted, targeted
  factual verification only. Independent cross-check for escalation.
- `source.sbo.acr-2020` — Expert Panel on Gastrointestinal Imaging; Chang KJ,
  Marin D, Kim DH, et al., “ACR Appropriateness Criteria®
  Suspected Small-Bowel Obstruction,” *Journal of the American College of
  Radiology* 2020; official current topic portal
  <https://gravitas.acr.org/ACPortal/GetDataForOneTopic?topicId=134> and
  PubMed <https://pubmed.ncbi.nlm.nih.gov/32370974/>. Professional-society
  imaging guidance; copyrighted, targeted factual verification only. Supports
  CT use; the runtime objective must test interpretation of a completed CT, not
  copy the appropriateness table.
- `source.hernia.ehs-ahs-2020` — Henriksen NA, Montgomery A, Kaufmann R, et al.,
  “Guidelines for treatment of umbilical and epigastric hernias from the
  European Hernia Society and Americas Hernia Society,” *British Journal of
  Surgery* 2020;107(3):171–190. doi:10.1002/bjs.11489,
  <https://europeanherniasociety.eu/guidelines/guidelines-for-treatment-of-umbilical-and-epigastric-hernias-from-the-european-hernia-society-and-americas-hernia-society/>.
  Joint society guideline; copyrighted, targeted verification only. The paper
  itself notes limited evidence and mostly weak recommendations. Supports both
  primary-midline-hernia claims; single-source limitation retained.
- `source.varicose.svs-avf-avls-2022` — Gloviczki P, Lawrence PF, Wasan SM, et
  al., “2022 SVS/AVF/AVLS clinical practice guidelines for management of
  varicose veins, Part I: Duplex Scanning and Treatment of Superficial Truncal
  Reflux,” *J Vasc Surg Venous Lymphat Disord* 2023;11(2):231–261.e6.
  doi:10.1016/j.jvsv.2022.09.004,
  <https://doi.org/10.1016/j.jvsv.2022.09.004>. Multisociety guideline;
  copyrighted, targeted verification only. Supports reflux duplex.
- `source.varicose.svs-avf-avls-2023` — Gloviczki P, Lawrence PF, Wasan SM, et
  al., “2023 SVS/AVF/AVLS clinical practice guidelines for management of
  varicose veins, Part II,” *J Vasc Surg Venous Lymphat Disord*
  2024;12(1):101670. doi:10.1016/j.jvsv.2023.08.011,
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC11523430/>. Multisociety guideline;
  publicly readable but no reuse license assumed. Supports preference- and
  candidate-dependent intervention referral.
- `source.dfi.iwgdf-idsa-2023` — Senneville E, Albalawi Z, van Asten SA, et al.,
  “IWGDF/IDSA Guidelines on the Diagnosis and Treatment of Diabetes-related
  Foot Infections,” *Clinical Infectious Diseases* 2023, ciad527.
  doi:10.1093/cid/ciad527,
  <https://www.idsociety.org/practice-guideline/diabetic-foot-infections/>.
  Current intersociety guideline; copyrighted, targeted verification only.
  Supports clinical diagnosis and no-antibiotic boundary.
- `source.burn.aba-referral-2022` — American Burn Association, *Guidelines for
  Burn Patient Referral (Advice on Transfer and Consultation)*, copyright 2022,
  <https://www.ameriburn.org/burn-care-team/resources/guidelines-for-burn-patient-referral>.
  Professional-society referral authority. The downloadable one-page original
  may be distributed intact with attribution, but editing/repurposing requires
  permission; do not copy its chart or art. Supports burn depth and referral.
- `source.burn.aha-redcross-2024` — American Heart Association and American Red
  Cross, *2024 Guidelines for First Aid*, thermal-burn section,
  <https://cpr.heart.org/en/resuscitation-science/2024-first-aid-guidelines>.
  Professional-society guideline; copyrighted, targeted verification only.
  Independent cross-check for depth and hospital-referral boundaries.
- `source.hs.australasian-2025` — Frew J, Smith A, Fernandez Penas P, et al.,
  “Australasian hidradenitis suppurativa management guidelines,” *Australasian
  Journal of Dermatology* 2025;66(2):75–89. doi:10.1111/ajd.14388,
  <https://doi.org/10.1111/ajd.14388>. Current peer-reviewed guideline;
  copyright retained and used only for targeted factual verification. Direct authority for recognition
  and multimodal planning; do not copy its tables/algorithm.
- `source.hs.north-american-2019` — Alikhan A, Sayed C, Alavi A, et al., “North
  American clinical management guidelines for hidradenitis suppurativa, Part I,”
  *Journal of the American Academy of Dermatology* 2019;81(1):76–90.
  doi:10.1016/j.jaad.2019.02.067,
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC9131894/>. Foundation guideline;
  author manuscript publicly readable, copyright retained. Targeted factual
  cross-check only.
- `source.parastomal.ehs-2018` — Antoniou SA, Agresta F, Garcia Alamino JM, et
  al., “European Hernia Society guidelines on prevention and treatment of
  parastomal hernias,” *Hernia* 2018;22:183–198.
  doi:10.1007/s10029-017-1697-5,
  <https://europeanherniasociety.eu/european-hernia-society-guidelines-on-prevention-and-treatment-of-parastomal-hernias/>.
  Professional-society guideline; copyrighted, targeted verification only.
  Its explicit evidence gaps constrain management claims.
- `source.parastomal.nursing-2025` — Larsen C, Borglit TB, Leinum LR, Dreyer P,
  “Nursing Interventions for the Management of a Stoma Complicated by a
  Parastomal Hernia or Bulge: A Scoping Review,” *Journal of Clinical Nursing*
  2025;34(7):2591–2624. doi:10.1111/jocn.17671,
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC12181155/>. CC BY-NC-ND 4.0;
  high-level evidence is limited and much included evidence is expert opinion.
  Supports only individualized symptom-management/referral categories.
- `source.stoma.acpgbi-2021` — Miller AS, Boyce K, Box B, et al., “The
  Association of Coloproctology of Great Britain and Ireland consensus
  guidelines in emergency colorectal surgery,” *Colorectal Disease*
  2021;23(2):476–547. doi:10.1111/codi.15503,
  <https://pubmed.ncbi.nlm.nih.gov/33470518/>. Society consensus guideline;
  published under a Creative Commons Attribution-NonCommercial license;
  attribution and noncommercial-use limits apply. Direct
  authority for urgent prolapse escalation, with low evidence grade retained.
- `source.ostomy.missto-wses-2023` — Parini D, Bondurri A, Ferrara F, et al.,
  “Surgical management of ostomy complications: a MISSTO–WSES mapping review,”
  *World Journal of Emergency Surgery* 2023;18:48.
  doi:10.1186/s13017-023-00516-5,
  <https://pmc.ncbi.nlm.nih.gov/articles/PMC10563348/>. CC BY 4.0 mapping
  review endorsed by MISSTO/WSES; attribution is required. It states
  that solid evidence is limited. Supports stoma and parastomal boundaries.
- `source.gcs.faq-current` — University of Glasgow, *Glasgow Coma Scale FAQ*,
  undated current site, <https://www.glasgowcomascale.org/faq/>. Official GCS
  interpretive source. Copyright retained; clinical/research use permissions do
  not grant blanket game-content reuse. Direct authority for complete totals
  and not-testable component reporting.
- `source.gcs.assessment-aid-current` — Institute of Neurological Sciences NHS
  Greater Glasgow and Clyde / Sir Graham Teasdale, *GCS Assessment Aid*,
  official one-page aid,
  <https://www.glasgowcomascale.org/downloads/GCS-Assessment-Aid.pdf>.
  Official scoring correspondence. Copyright acknowledged to Glasgow University
  and Sir Graham Teasdale under
  <https://www.glasgowcomascale.org/permissions/>; do not copy the aid/chart.
- `source.lymphedema.isl-2023` — Executive Committee of the International
  Society of Lymphology, “The Diagnosis and Treatment of Peripheral Lymphedema:
  2023 Consensus Document,” *Lymphology* 2023;56(4):133–151. PMID 39207406,
  <https://isl.arizona.edu/sites/default/files/2024-11/THE-DIAGNOSIS-AND-TREATMENT-OF-PERIPHERAL-LYMPHEDEMA-2023-CONSENSUS-DOCUMENT-OF-THE-INTERNATIONAL-SOCIETY-OF-LYMPHOLOGY.pdf>.
  International society consensus; publicly available, copyright retained.
  It explicitly acknowledges evidence uncertainty and patient-specific care.
- `source.lymphedema.nci-pdq-current` — National Cancer Institute PDQ Supportive
  and Palliative Care Editorial Board, *Lymphedema (PDQ®)–Health Professional
  Version*, current page,
  <https://www.cancer.gov/about-cancer/treatment/side-effects/lymphedema/lymphedema-hp-pdq>.
  U.S. government editorial summary used only for targeted factual verification.
  No text, table, or third-party material is reused; third-party rights are not
  inferred from government hosting.
  Supports differential diagnosis and individualized decongestive care.

## Authoring and service constraints carried forward

- Acute SBO with peritonitis/ischemia concern, limb- or life-threatening diabetic
  foot infection, qualifying burn emergencies, and ischemic/obstructed stoma
  prolapse go directly to external emergency care. No clinic test wait may delay
  escalation.
- The SBO CT objective can use the existing Stage-2 external CT route for stable
  selected cases or review an already completed outside-hospital CT. Never imply
  CT is available onsite without the current imaging capability and staff.
- Reflux duplex may reuse the external venous-duplex machinery only after the
  service contract confirms that its label/result can represent reflux rather
  than merely compression ultrasound for DVT. If not, add a distinct external
  service and centralized timing profile.
- Diabetic-foot objectives are limited to initial general-clinic recognition,
  the no-antibiotic boundary for a clinically uninfected ulcer, and external
  multidisciplinary or emergency referral. They do not provide onsite wound
  care, debridement, offloading, dressing, supplies, or a wound-specialty gate.
- GCS cases review the same named patient's documented responses. Vary actual
  eye/verbal/motor combinations and genuine interference scenarios, not names
  alone. Do not add severity bands, prognostic cutoffs, or treatment algorithms.
- Parastomal hernia, HS, lymphedema, and varicose-vein management are
  preference-, resource-, and patient-dependent. Feedback must preserve this
  boundary and avoid universal operations, garments, pressure levels, or drugs.
- Every testing option, including CT, ultrasound, venous duplex, and distractor
  studies, needs a neutral central gameplay wait estimate. Existing-result
  interpretation and pure examination/diagnosis choices do not invent a wait.
- External source links in runtime review surfaces must use safe new-tab
  behavior. No web retrieval occurs during gameplay.

## Handoff decision

This source contract supports authoring the exact 20 objectives above, subject
to Astra's final roster acceptance and implementation review. The weakest areas
are deliberately bounded: primary-midline-hernia claims rely on one guideline;
parastomal/stoma evidence is low quality; GCS support is one official source
family; and lymphedema consensus acknowledges substantial uncertainty. Preserve
those limits in claim metadata and feedback rather than filling gaps by inference.

