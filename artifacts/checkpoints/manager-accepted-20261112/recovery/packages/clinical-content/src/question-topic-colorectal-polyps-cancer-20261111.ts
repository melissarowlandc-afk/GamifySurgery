import type { AuthoredClinicalRecord, ClinicalSource, EvidenceClaim, QuestionVariant } from "./pilot-schema";
import { validateSyntheticClinicalRelease, type AnswerChoiceTimingRegistryEntry, type CaseExhibit, type SyntheticClinicalCase, type TestedConcept } from "./schema";

/** Explicit-import authoring sidecar; manager review and installation are separate. */
export const CPC_DRAFT = {
  contentVersion: "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v1",
  reviewStatus: "needs_clinician_review", aiAssistedDrafting: true, lastClinicianReview: null,
} as const satisfies AuthoredClinicalRecord;
export const CPC_TOPIC = "colorectal-polyps-cancer";
const sourceId = (suffix: string) => `source.${CPC_TOPIC}.${suffix}`;
const claimId = (suffix: string) => `claim.${CPC_TOPIC}.${suffix}`;
const societyRights = "Copyright retained; targeted verification of underlying facts and bibliographic attribution only. No source prose, excerpts, tables, figures or algorithms retained. Public access is not a reuse licence or endorsement. Medical authority is assessed separately.";
function source(suffix: string, title: string, citation: string, journal: string, authors: string[], year: number | null, doi: string | null, url: string, authority: string, government = false): ClinicalSource {
  return { ...CPC_DRAFT, id: sourceId(suffix), title, completeCitation: citation,
    organizationOrJournal: journal, authors, publicationYear: year, doi, pmid: null,
    officialUrl: url, accessedOn: "2026-11-11", sourceClass: government ? "government_guidance" : "professional_society_guideline",
    licenseLabel: government ? "Government information; source-specific copyright conditions apply" : "Copyrighted professional-society guidance",
    reuseStatus: government ? "public_domain_conditions_apply" : "copyrighted_targeted_verification_only",
    reuseNotes: government ? "Independently synthesized facts with agency attribution and an external link. NCI policy permits its text unless otherwise credited; third-party staging tables and graphics remain excluded. USPSTF copyright conditions do not establish a blanket public-domain licence. No endorsement implied." : societyRights,
    authorityAssessment: authority, usageRole: "both", evidenceClaimIds: [] };
}
const sourceRecords: ClinicalSource[] = [
  source("uspstf-screening-2021", "Colorectal Cancer: Screening", "US Preventive Services Task Force. Colorectal Cancer: Screening. Final Recommendation Statement. May 18, 2021.", "US Preventive Services Task Force", ["US Preventive Services Task Force"], 2021, null, "https://www.uspreventiveservicestaskforce.org/uspstf/recommendation/colorectal-cancer-screening", "Preventive recommendation; targeted stool-test completion principle. Not used for symptomatic workup, polypectomy or surveillance intervals.", true),
  source("ascrs-colon-2022", "ASCRS Management of Colon Cancer (2022)", "Vogel JD, Felder SI, Bhama AR, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Colon Cancer. Dis Colon Rectum. 2022;65:148-177. doi:10.1097/DCR.0000000000002323.", "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum", ["Jon D. Vogel", "Seth I. Felder", "Anuradha R. Bhama", "et al."], 2022, "10.1097/DCR.0000000000002323", "https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982018/all/Management_of_Colon_Cancer__2022_?q=management+practice", "Graded society surgical guideline; targeted diagnosis, malignant-polyp, node retrieval, operative extent and stage-IV checks. Official PDF returned 404; the public society toolkit full guidance was accessible. Not an assertion that every systemic treatment is current to 2026."),
  source("ascrs-rectal-2020", "ASCRS Management of Rectal Cancer (2020)", "You YN, Hardiman KM, Bafford A, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Rectal Cancer. Dis Colon Rectum. 2020;63:1191-1222. doi:10.1097/DCR.0000000000001762.", "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum", ["Y. Nancy You", "Karin M. Hardiman", "Andrea Bafford", "et al."], 2020, "10.1097/DCR.0000000000001762", "https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982025/all/Management_of_Rectal_Cancer__2020_?q=80+question", "Society guideline for MRI/EUS staging, local excision and completion radical resection. Read with the 2023 supplement, not as stand-alone current multimodal guidance."),
  source("ascrs-rectal-supplement-2023", "ASCRS Management of Rectal Cancer 2023 Supplement", "Langenfeld SJ, Davis BR, Vogel JD, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Rectal Cancer 2023 Supplement. Dis Colon Rectum. 2024;67:18-31. doi:10.1097/DCR.0000000000003057.", "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum", ["Sean J. Langenfeld", "Bradley R. Davis", "Jon D. Vogel", "et al."], 2024, "10.1097/DCR.0000000000003057", "https://www.ascrsu.com/ascrs/view/ASCRS-Toolkit/2851104/3/Management_of_Rectal_Cancer_2023_Supplement__2023_", "Updated graded guidance: upper rectum, total neoadjuvant therapy, response evaluation and selected watch-and-wait. Guideline title uses 2023; journal issue is 2024. Exact near-complete-response timing remains held."),
  source("ascrs-polyposis-2024", "ASCRS Management of Inherited Adenomatous Polyposis Syndromes (2024)", "Poylin VY, Shaffer VO, Felder SI, et al. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Inherited Adenomatous Polyposis Syndromes. Dis Colon Rectum. 2024;67:213-227. doi:10.1097/DCR.0000000000003072.", "American Society of Colon and Rectal Surgeons / Diseases of the Colon & Rectum", ["Vitaliy Y. Poylin", "Virginia O. Shaffer", "Seth I. Felder", "et al."], 2024, "10.1097/DCR.0000000000003072", "https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982023/all/Management%20of%20Inherited%20Adenomatous%20Polyposis%20Syndromes%20(2024)", "Graded surgical guidance; recommendation 4 and its surgical discussion directly checked. Low-quality/conditional evidence for operation selection. Bibliographic header, DOI and surgical recommendations directly checked in the moved public full guideline."),
  source("nci-colon-pdq", "Colon Cancer Treatment (PDQ), Health Professional Version", "PDQ Adult Treatment Editorial Board. Colon Cancer Treatment (PDQ): Health Professional Version. Bethesda, MD: National Cancer Institute. Current online version accessed November 11, 2026.", "National Cancer Institute", ["PDQ Adult Treatment Editorial Board"], null, null, "https://www.cancer.gov/types/colorectal/hp/colon-treatment-pdq", "Government evidence summary; independent cross-check for invasion, regional disease and adjuvant therapy. Not used for the page's older screening-age statement. No AJCC tables or staging prose reproduced.", true),
  source("nci-rectal-pdq", "Rectal Cancer Treatment (PDQ), Health Professional Version", "PDQ Adult Treatment Editorial Board. Rectal Cancer Treatment (PDQ): Health Professional Version. Bethesda, MD: National Cancer Institute. Current online version accessed November 11, 2026.", "National Cancer Institute", ["PDQ Adult Treatment Editorial Board"], null, null, "https://www.cancer.gov/types/colorectal/hp/rectal-treatment-pdq", "Government evidence summary; independent cross-check of staging and local versus radical treatment. Not used for its older screening-age section; no copied tables/figures.", true),
  source("usmstf-removal-2020", "US Multi-Society Task Force: Endoscopic Removal of Colorectal Lesions", "Kaltenbach T, Anderson JC, Burke CA, et al. Endoscopic Removal of Colorectal Lesions: Recommendations by the US Multi-Society Task Force on Colorectal Cancer. Gastrointest Endosc. 2020;91:486-519. doi:10.1016/j.gie.2020.01.029.", "US Multi-Society Task Force / Gastrointestinal Endoscopy", ["Tonya Kaltenbach", "Joseph C. Anderson", "Carol A. Burke", "et al."], 2020, "10.1016/j.gie.2020.01.029", "https://www.asge.org/docs/default-source/guidelines/endoscopic-removal-of-colorectal-lesions-recommendations-by-the-us-multi-society-task-force-on-colorectal-cancer-2020-march-gie.pdf", "Primary multisociety recommendations; society-hosted full guidance directly checked. Single publication for exact stalk criteria and fibrosis interpretation. ASGE terms prohibit duplication; none is undertaken. No automated/AI restriction was identified in the retrieved terms result."),
  source("usmstf-surveillance-2020", "US Multi-Society Task Force: Follow-Up After Colonoscopy and Polypectomy", "Gupta S, Lieberman D, Anderson JC, et al. Recommendations for Follow-Up After Colonoscopy and Polypectomy: A Consensus Update by the US Multi-Society Task Force on Colorectal Cancer. Gastrointest Endosc. 2020;91:463-485.e5. doi:10.1016/j.gie.2020.01.014.", "US Multi-Society Task Force / Gastrointestinal Endoscopy", ["Samir Gupta", "David Lieberman", "Joseph C. Anderson", "et al."], 2020, "10.1016/j.gie.2020.01.014", "https://www.asge.org/docs/default-source/guidelines/recommendations-for-follow-up-after-colonoscopy-and-polypectomy-a-consensus-update-by-the-us-multi-society-task-force-on-colorectal-cancer-2020-march-gie.pdf", "Primary US consensus. Exact intervals are USMSTF-scoped, require a high-quality complete baseline and do not apply to malignant polyps, hereditary syndromes or prior CRC. Single publication; society landing page and PDF are not independent sources."),
  source("acg-prep-summary-2025", "Optimizing Bowel Preparation for Colonoscopy: Insights from the USMSTF Recommendations", "Hagen R, Anderson JC. Optimizing Bowel Preparation for Colonoscopy: Insights from the USMSTF Recommendations. Evidence-Based GI. American College of Gastroenterology. April 16, 2025. Summary of Jacobson BC, Anderson JC, Burke CA, et al. Am J Gastroenterol. 2025;120:738-764.", "American College of Gastroenterology / Evidence-Based GI", ["Rachael Hagen", "Joseph C. Anderson"], 2025, null, "https://gi.org/journals-publications/ebgi/anderson_hagen_apr2025/", "Official society summary of 2025 consensus, used only for adequate preparation and repeat completion. Full primary ASGE page returned 502; no fixed repeat deadline or laxative regimen is authored. Summary and parent guideline count as one publication."),
];
type ClaimSpec = [string, string, string[], EvidenceClaim["evidenceCategory"], string];
const claimSpecs: ClaimSpec[] = [
  ["small-adenoma-surveillance", "USMSTF recommends a seven-to-ten-year interval after complete removal of one or two tubular adenomas under 10 mm at a high-quality examination.", ["usmstf-surveillance-2020"], "management", "Single publication; average-risk baseline, not a count of pathology fragments or a history of advanced neoplasia."],
  ["three-four-adenomas-surveillance", "USMSTF recommends three-to-five-year surveillance after three or four small tubular adenomas are completely removed at a high-quality examination.", ["usmstf-surveillance-2020"], "management", "Single publication; weak recommendation with very-low-quality evidence. Count lesions, not fragments from a shared container."],
  ["five-ten-adenomas-surveillance", "USMSTF recommends three-year surveillance after five to ten tubular adenomas under 10 mm are completely removed at a high-quality examination.", ["usmstf-surveillance-2020"], "management", "Single publication; not a policy for more than ten adenomas, hereditary disease or a malignant polyp."],
  ["response-mri-sequences", "Rectal post-treatment MRI response assessment includes T2-weighted and diffusion-weighted evaluation of the treated bed.", ["ascrs-rectal-supplement-2023"], "evaluation", "A nondiagnostic component cannot supply its missing observation; this does not define a universal artifact-management protocol."],
  ["positive-fit-completion", "An abnormal FIT screening result requires diagnostic colonoscopy; repeating stool screening does not complete that evaluation.", ["uspstf-screening-2021"], "evaluation", "One federal recommendation. Does not diagnose cancer or rank investigations when colonoscopy is contraindicated."],
  ["unrepresentative-colon-biopsy", "A benign fragment from outside a suspicious colonic lesion does not establish that lesion's histology.", ["ascrs-colon-2022"], "evaluation", "Anatomic application of sampling limitations. Repeat sampling can be appropriate; a concerning nonendoscopically removable lesion may warrant oncologic resection despite nondiagnostic biopsy."],
  ["inadequate-prep-completion", "Cecal intubation does not complete a diagnostic examination when mucosal visualization remains inadequate after cleaning; an adequately prepared repeat is needed.", ["acg-prep-summary-2025", "usmstf-surveillance-2020"], "evaluation", "No universal same-day/next-day deadline, bowel-prep score cutoff or purgative regimen is asserted."],
  ["advanced-adenoma-surveillance", "After confident complete removal at a high-quality examination, an adenoma at least 10 mm warrants USMSTF colonoscopic surveillance in three years.", ["usmstf-surveillance-2020"], "management", "Single publication, average-risk post-polypectomy context; not a malignant-polyp interval."],
  ["piecemeal-surveillance", "USMSTF recommends the first surveillance colonoscopy about six months after piecemeal resection of an adenoma at least 20 mm.", ["usmstf-surveillance-2020", "usmstf-removal-2020"], "management", "Two related multisociety publications share an evidence base. Do not substitute routine advanced-adenoma timing for the early scar check."],
  ["serrated-dysplasia-surveillance", "A completely removed sessile serrated lesion containing dysplasia warrants USMSTF surveillance in three years after a high-quality examination.", ["usmstf-surveillance-2020"], "management", "Single publication; weak recommendation with very-low-quality evidence. Complete resection and pathology confidence are necessary."],
  ["serial-adenoma-surveillance", "After an advanced adenoma at baseline and a normal first surveillance colonoscopy, USMSTF recommends the next examination in five years.", ["usmstf-surveillance-2020"], "management", "Single publication; weak recommendation with low-quality evidence. Prior CRC, hereditary disease, incomplete exams and additional lesions change applicability."],
  ["large-polyp-expertise", "Large nonpedunculated colorectal lesions without deep invasive features should be assessed by an endoscopist experienced in advanced resection before surgery for technical difficulty.", ["usmstf-removal-2020", "ascrs-colon-2022"], "management", "Size at least 20 mm supports advanced expertise; choice among EMR, ESD or surgery depends on detailed lesion assessment. A superficial biopsy does not exclude focal invasion."],
  ["scar-nonlifting", "Failure to lift after injection can reflect prior biopsy, cautery or tattoo-related fibrosis as well as invasive cancer.", ["usmstf-removal-2020"], "evaluation", "Single primary guideline. Nonlifting neither proves cancer nor guarantees safe routine snare resection."],
  ["pedunculated-hemostasis", "USMSTF recommends mechanical stalk ligation before resection for a pedunculated polyp with head at least 20 mm or stalk thickness at least 5 mm.", ["usmstf-removal-2020"], "management", "Single primary guideline. The new example is well beyond the threshold. No exclusive ranking of clips versus a detachable loop or injection-based alternatives is asserted."],
  ["pedunculated-hot-snare", "USMSTF recommends hot-snare resection for pedunculated colorectal lesions at least 10 mm, with specimen retrieval for histology.", ["usmstf-removal-2020"], "management", "Single primary guideline. This does not generalize to small nonpedunculated lesions."],
  ["low-risk-malignant-polyp", "An intact, fully assessed malignant-polyp specimen with favorable grade, superficial submucosal invasion, absent lymphovascular/perineural invasion, low budding and clear margins can support endoscopic treatment with surveillance.", ["ascrs-colon-2022"], "management", "Single directly verified surgical guideline. Its low-risk definition uses submucosal depth under 1 mm. Exact margin definitions remain debated; examples use clear 2-mm margins rather than the disputed close-margin zone."],
  ["adverse-polyp-regional-risk", "Lymphovascular invasion, poor differentiation or a positive/indeterminate invasive-polyp margin supports discussion of oncologic segmental resection with regional lymphatic drainage.", ["ascrs-colon-2022", "nci-colon-pdq"], "management", "Surgical fitness and goals matter. Negative CT nodes and a healed scar do not exclude microscopic regional disease. No individual probability is claimed."],
  ["intramucosal-local-treatment", "Carcinoma confined to the colonic mucosa, completely excised with an intact assessed submucosa, is treated differently from submucosally invasive malignant polyps and can be managed locally.", ["nci-colon-pdq", "ascrs-colon-2022"], "management", "Complete local excision and tissue adequacy are required. No inference of absent invasion from a superficial biopsy is allowed."],
  ["fap-rectal-burden", "FAP with rectal adenomas that cannot be cleared endoscopically favors proctocolectomy; preserved continence and a restorative goal can support IPAA.", ["ascrs-polyposis-2024"], "management", "One guideline; conditional/low-quality evidence. No automatic polyp-count threshold or procedure ranking independent of function and goals."],
  ["fap-ira", "Colectomy with ileorectal anastomosis can be considered in FAP with relative rectal sparing and endoscopically removable rectal adenomas, with continuing rectal surveillance.", ["ascrs-polyposis-2024"], "management", "One guideline. Operation choice is shared; offered alternatives must not treat IRA as mandatory for every patient with few rectal polyps."],
  ["fap-end-ileostomy", "Poor sphincter function can favor proctocolectomy with end ileostomy instead of restorative IPAA in FAP requiring rectal removal.", ["ascrs-polyposis-2024"], "management", "One guideline; no invented manometric threshold or absolute contraindication. The patient's informed functional priority remains necessary."],
  ["fap-pouch-surveillance", "After IPAA for FAP, annual endoscopy should assess the pouch and any retained rectal or anal-transition-zone mucosa.", ["ascrs-polyposis-2024"], "management", "One guideline. Does not specify automatic excision of all polyps or end upper-GI surveillance."],
  ["rectal-mri-staging", "Rectal-protocol pelvic MRI evaluates tumor depth, regional nodes and the relationship of disease to the mesorectal fascia for treatment planning.", ["ascrs-rectal-2020", "nci-rectal-pdq"], "evaluation", "Diagnostic abdominal/pelvic CT does not supply equivalent local staging. No CRM cutoff is invented."],
  ["rectal-early-eus", "Endorectal ultrasound can complement MRI when distinguishing early rectal submucosal from muscularis-propria invasion would change local-excision eligibility.", ["ascrs-rectal-2020"], "evaluation", "Single guideline; operator-dependent, complementary rather than a universal replacement for MRI."],
  ["rectal-local-excision", "Local excision is an option for selected small favorable cT1N0 rectal cancers; it does not remove or stage mesorectal nodes.", ["ascrs-rectal-2020", "nci-rectal-pdq"], "management", "Example eligibility follows the guideline: under 3 cm and under 30% circumference, favorable differentiation, no adverse vascular/neural/budding features and transanal accessibility."],
  ["rectal-t2-completion", "Muscularis-propria invasion found after local rectal excision generally warrants radical resection in an operable patient despite a clear local margin.", ["ascrs-rectal-2020", "nci-rectal-pdq"], "management", "Completion TME addresses regional disease not treated by scar excision. Organ-preserving alternatives for patients refusing or unfit for surgery require individualized review."],
  ["rectal-tnt", "Total neoadjuvant therapy is generally recommended for stage II/III mid or low rectal adenocarcinoma; treatment is planned before radical surgery.", ["ascrs-rectal-supplement-2023", "nci-rectal-pdq"], "management", "Selected example has proficient mismatch repair and a threatened local plane; no drug doses, cycle counts, fixed interval or ranking of TNT sequences is taught."],
  ["upper-rectal-initial-resection", "A tumor entirely above the anterior peritoneal reflection can follow an upper-rectal pathway with initial resection rather than routine neoadjuvant pelvic radiation.", ["ascrs-rectal-supplement-2023"], "management", "Single guideline; conditional recommendation. T4b disease, threatened posterior fascia or extramural vascular invasion may change the plan. Distance from anal verge is not a fixed anatomic substitute."],
  ["multimodal-response", "Post-neoadjuvant rectal response assessment integrates current examination, endoscopy and rectal MRI rather than mixing pretreatment and post-treatment records.", ["ascrs-rectal-supplement-2023", "nci-rectal-pdq"], "evaluation", "No fixed optimal assessment date or near-complete-response interval is asserted. Performed but unexported acquisitions should be distinguished from absent studies."],
  ["clinical-complete-response", "A clinical complete response requires concordant examination, endoscopic and MRI findings without residual tumor or suspicious nodes; it is not proof of pathological eradication.", ["ascrs-rectal-supplement-2023", "nci-rectal-pdq"], "evaluation", "No universal binary inference from one modality. Original fictional observations apply the criteria; uncertain near-complete response remains on the owner hold."],
  ["negative-response-biopsy", "A negative superficial biopsy after rectal neoadjuvant treatment does not exclude deeper residual tumor when examination and MRI remain concerning.", ["ascrs-rectal-supplement-2023"], "evaluation", "Single guideline; biopsy evidence is very low quality. New example uses increasing palpable nodularity and diffusion restriction, not a small shrinking equivocal ulcer."],
  ["selected-watch-wait", "Selected patients with a clinical complete rectal response may choose protocolized watch-and-wait in an experienced program after counseling; persistent tumor calls for oncologic resection assessment.", ["ascrs-rectal-supplement-2023", "nci-rectal-pdq"], "management", "Surgery remains valid after complete response. No automatic preference-based key or indefinite observation of proven residual disease."],
  ["regrowth-salvage", "Localized regrowth during watch-and-wait warrants staging and salvage oncologic surgical assessment when resectable.", ["ascrs-rectal-supplement-2023", "nci-rectal-pdq"], "management", "No claim that all regrowth is salvageable or that every patient requires the same operation. Example has biopsy-proven regrowth and completed negative distant staging."],
  ["en-bloc-adherence", "Curative surgery for colon cancer adherent to an adjacent organ should preserve an en-bloc specimen rather than separate the adhesion through the tumor interface.", ["ascrs-colon-2022"], "management", "One guideline; actual organ-resection extent depends on anatomic involvement and ability to obtain clear margins. Adhesion alone is not a pathological T4b diagnosis."],
  ["node-retrieval", "When fewer than 12 nodes are reported after colon cancer resection, additional pathology evaluation of the submitted specimen should be requested before relying on node-negative staging.", ["ascrs-colon-2022"], "evaluation", "One guideline; no automatic repeat colectomy or inference that an inadequate count proves nodal metastasis."],
  ["tumor-deposit-regional", "A discontinuous pericolic tumor deposit can establish N1c regional involvement even when retrieved lymph nodes are negative.", ["nci-colon-pdq"], "definition", "One government summary; requires pathologist-confirmed deposit rather than assuming every pericolic nodule is one. No copyrighted staging table is reproduced."],
  ["stage-three-adjuvant", "After complete resection of nonmetastatic colon cancer with regional nodal disease, adjuvant systemic chemotherapy is considered; FOLFOX is an established option.", ["nci-colon-pdq"], "management", "One government evidence summary. Oncology individualizes regimen and duration; the questions do not choose between FOLFOX and CAPOX or specify a current molecular-treatment policy."],
  ["asymptomatic-stage-four", "For incurable metastatic colon cancer with an asymptomatic primary, initial systemic treatment is generally preferred over prophylactic colectomy.", ["ascrs-colon-2022"], "management", "One guideline; symptoms, potentially resectable metastases and curative conversion strategies alter the decision. No particular drug regimen is ranked."],
  ["perforated-cancer", "Perforated colon cancer requires source control with an oncologic surgical plan; endoluminal stenting is contraindicated in the perforated setting.", ["ascrs-colon-2022"], "management", "One guideline; resuscitation is concurrent background care. Diversion/anastomosis choices remain individualized. Outside-hospital chart review, not emergency care delivered by this clinic."],
];
export const CPC_REVIEWED_V1_CLAIMS: EvidenceClaim[] = claimSpecs.map(([id, statement, sources, evidenceCategory, limitation]) => ({
  ...CPC_DRAFT, id: claimId(id), statement, sourceIds: sources.map(sourceId), evidenceCategory,
  certainty: ["serrated-dysplasia-surveillance", "serial-adenoma-surveillance", "three-four-adenomas-surveillance", "fap-rectal-burden", "fap-ira", "fap-end-ileostomy", "negative-response-biopsy"].includes(id) ? "low" : "moderate",
  limitation, applicablePopulation: "The explicitly scoped fictional colorectal clinic/chart-review decision; not an autonomous patient-care rule.", lastCheckedOn: "2026-11-11",
}));
export const CPC_REVIEWED_V1_SOURCES: ClinicalSource[] = sourceRecords.map(s => ({ ...s, evidenceClaimIds: CPC_REVIEWED_V1_CLAIMS.filter(c => c.sourceIds.includes(s.id)).map(c => c.id) }));

export interface CPCChoice { id: string; label: string; rationale: string; temptation: string; reasonableWhen: string; timingProfileId?: string }
export interface CPCNodeDraft {
  version?: 2; slug: string; conceptId: string; previousConceptId: string | null; conceptRelation: "preserved" | "new_identity" | "new_version";
  title: string; objective: string; conceptType: TestedConcept["conceptType"]; update: string; task: string; exhibit?: CaseExhibit;
  choices: CPCChoice[]; correctChoice: string; explanation: string; claims: string[]; creationKind: "rewrite" | "new";
  gate: { cueAttack: string; stage: string; steps: [string, string]; difficulty: string; closestChoice: string; decidingObservation: string;
    consequence: string; deletionTest: string; counterfactual: string; counterfactualChoice: string; sequence: string };
}
export interface CPCCaseDraft { version?: 2; slug: string; name: string; age: number; sex: "Female" | "Male"; complaint: string; presentation: string; historicalAcuity: "stable" | "urgent_stable" | "obvious_emergency"; nodes: CPCNodeDraft[] }

export const CPC_ROUND2_DRAFT = {
  "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null
} as const satisfies AuthoredClinicalRecord;
const revisionClaims: EvidenceClaim[] = [
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.colorectal-polyps-cancer.prep-after-cleansing",
    "statement": "Bowel-preparation adequacy is judged from mucosal visibility after endoscopist cleansing rather than the uncleaned insertion view.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.acg-prep-summary-2025"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "low",
    "limitation": "One official ACG summary of the 2025 USMSTF consensus; assessment-after-cleansing has low-quality support. This summary and its parent recommendation are one publication, not independent corroboration.",
    "applicablePopulation": "The explicitly scoped fictional colorectal clinic/chart-review decision; not an autonomous patient-care rule.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.colorectal-polyps-cancer.normal-colonoscopy-surveillance",
    "statement": "USMSTF recommends repeat screening in ten years after a normal complete high-quality colonoscopy in the applicable average-risk setting.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.usmstf-surveillance-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single directly checked guideline. Prior neoplasia, hereditary disease, relevant family history, incomplete examination or inadequate final visibility changes applicability.",
    "applicablePopulation": "The explicitly scoped fictional colorectal clinic/chart-review decision; not an autonomous patient-care rule.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.colorectal-polyps-cancer.piecemeal-second-surveillance",
    "statement": "After the first approximately six-month surveillance following piecemeal removal of a lesion at least 20 mm, USMSTF recommends the next surveillance one year after that first examination.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.usmstf-surveillance-2020"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Single publication. This is the subsequent visit, not a one-year substitute for the initial scar check. No recurrence-management algorithm is asserted.",
    "applicablePopulation": "The explicitly scoped fictional colorectal clinic/chart-review decision; not an autonomous patient-care rule.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.colorectal-polyps-cancer.bladder-partial-extent",
    "statement": "For a colon cancer attached to a limited bladder portion, en-bloc partial bladder resection can preserve uninvolved bladder when clear margins and a useful remnant are achievable.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.ascrs-colon-2022",
      "source.colorectal-polyps-cancer.kondo-bladder-2019"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "ASCRS supports en-bloc removal; the anatomy-specific bladder-preserving example is cross-checked in one retrospective single-center cohort. It does not establish a universal reservoir cutoff or a survival advantage caused by partial rather than total cystectomy. Neck/trigone involvement and achievable margins may require a different extent.",
    "applicablePopulation": "The explicitly scoped fictional colorectal clinic/chart-review decision; not an autonomous patient-care rule.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.colorectal-polyps-cancer.regional-node-provenance",
    "statement": "Regional-node findings must remain assigned to their primary tumor and resection specimen when assessing a separate cancer basin.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.ascrs-colon-2022",
      "source.colorectal-polyps-cancer.nci-colon-pdq"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Anatomic/provenance application of regional drainage and specimen-based node assessment to constructed synchronous primaries; neither source is represented as an empirical trial of pooling counts. Five plus seventeen is not a clinical rate or new threshold.",
    "applicablePopulation": "The explicitly scoped fictional colorectal clinic/chart-review decision; not an autonomous patient-care rule.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.colorectal-polyps-cancer.nontraversability-not-obstruction",
    "statement": "The inability of one colonoscope to pass a tumor does not by itself establish a primary-related complication requiring prophylactic local treatment in otherwise asymptomatic incurable metastatic disease.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.ascrs-colon-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Constructed application of the guideline asymptomatic-primary versus obstructing-primary distinction. No validated obstruction score, guaranteed future patency or numerical dilation cutoff is claimed; symptoms and imaging still require clinical judgment.",
    "applicablePopulation": "The explicitly scoped fictional colorectal clinic/chart-review decision; not an autonomous patient-care rule.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.colorectal-polyps-cancer.unstable-left-perforation-reconstruction",
    "statement": "After resection of a perforated left-colon cancer, continuing circulatory instability and adverse contamination or tissue conditions favor avoiding primary anastomosis and considering an end colostomy with rectal-stump closure.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.ascrs-colon-2022",
      "source.colorectal-polyps-cancer.wses-emergency-2018"
    ],
    "evidenceCategory": "management",
    "certainty": "low",
    "limitation": "Two surgical guidelines; evidence is low quality and reconstruction remains individualized. Scope is the current after-resection decision with feasible closure, not an automatic rule for all perforations, all metastases or patients requiring an open abdomen. No dose or physiologic cutoff is invented.",
    "applicablePopulation": "The explicitly scoped fictional colorectal clinic/chart-review decision; not an autonomous patient-care rule.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.colorectal-polyps-cancer.ctc-incomplete-distal-cancer",
    "statement": "CT colonography may help evaluate the proximal colon when a distal colon cancer prevents complete colonoscopy.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.ascrs-colon-2022"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "One society guideline. Used only to ground the counterfactual anatomic completion alternative; it is not promoted as routine replacement for colonoscopy after abnormal FIT with a correctable preparation deficit.",
    "applicablePopulation": "The explicitly scoped fictional colorectal clinic/chart-review decision; not an autonomous patient-care rule.",
    "lastCheckedOn": "2026-11-11"
  },
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.colorectal-polyps-cancer.fragment-versus-imaging-scope",
    "statement": "Histology of submitted dysplastic fragments describes those fragments, while pelvic MRI assesses represented local extent; neither observation alone establishes the absence of microscopic invasion throughout an unsampled rectal field.",
    "sourceIds": [
      "source.colorectal-polyps-cancer.ascrs-polyposis-2024",
      "source.colorectal-polyps-cancer.ascrs-rectal-2020"
    ],
    "evidenceCategory": "evaluation",
    "certainty": "moderate",
    "limitation": "Scope/provenance application of histologic sampling and radiologic local staging, not an accuracy estimate or an absolute limit on all imaging. The new case does not assume MRI determines the histologic status of every adenoma.",
    "applicablePopulation": "The fictional post-IRA rectal-field chart review.",
    "lastCheckedOn": "2026-11-11"
  }
];
const revisionSources: ClinicalSource[] = [
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.colorectal-polyps-cancer.kondo-bladder-2019",
    "title": "Partial versus total cystectomy with colorectal en-bloc resection",
    "completeCitation": "Kondo A, Sasaki T, Kitaguchi D, Tsukada Y, Nishizawa Y, Ito M. Resection of the urinary bladder for locally advanced colorectal cancer: a retrospective comparison of partial versus total cystectomy. BMC Surg. 2019;19:63. doi:10.1186/s12893-019-0522-8.",
    "organizationOrJournal": "BMC Surgery",
    "authors": [
      "Akihiro Kondo",
      "Takeshi Sasaki",
      "Daichi Kitaguchi",
      "Yuichiro Tsukada",
      "Yuji Nishizawa",
      "Masaaki Ito"
    ],
    "publicationYear": 2019,
    "doi": "10.1186/s12893-019-0522-8",
    "pmid": "31208384",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6580572/",
    "accessedOn": "2026-11-11",
    "sourceClass": "observational_study",
    "licenseLabel": "Creative Commons Attribution 4.0 International; article-level license verified",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Attribution: Kondo and colleagues, BMC Surgery 2019, DOI 10.1186/s12893-019-0522-8. License https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized and applied to a new fictional example; no article prose, excerpts, tables, figures or algorithms reproduced. Article license verified in its copyright section rather than inferred from PMC hosting.",
    "authorityAssessment": "Retrospective single-center selected cohort. Cross-checks that anatomy and useful remaining bladder affect partial versus total extent; not a causal comparison or universal numerical criterion. Primary en-bloc principle comes from ASCRS 2022.",
    "usageRole": "cross_check",
    "evidenceClaimIds": []
  },
  {
    "contentVersion": "clinical.question-topic-colorectal-polyps-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.colorectal-polyps-cancer.wses-emergency-2018",
    "title": "WSES colorectal cancer emergency guideline",
    "completeCitation": "Pisano M, Zorcolo L, Merli C, et al. 2017 WSES guidelines on colon and rectal cancer emergencies: obstruction and perforation. World J Emerg Surg. 2018;13:36. doi:10.1186/s13017-018-0192-3.",
    "organizationOrJournal": "World Society of Emergency Surgery / World Journal of Emergency Surgery",
    "authors": [
      "Michele Pisano",
      "Luigi Zorcolo",
      "Cecilia Merli",
      "et al."
    ],
    "publicationYear": 2018,
    "doi": "10.1186/s13017-018-0192-3",
    "pmid": "30123315",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC6090779/",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International; article-level license verified",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Attribution: Pisano and colleagues, World Journal of Emergency Surgery 2018, DOI 10.1186/s13017-018-0192-3. License https://creativecommons.org/licenses/by/4.0/. Independently synthesized underlying facts, without source prose, excerpts, tables, figures or algorithms. Article-level license verified; no presumption of rights from PMC availability.",
    "authorityAssessment": "Consensus emergency surgical guidance with low-quality support for unstable left-sided perforation reconstruction. Read alongside the newer ASCRS 2022 guidance; publication year 2018 is not relabeled current evidence. No numeric resuscitation targets are imported.",
    "usageRole": "both",
    "evidenceClaimIds": []
  }
];
export const CPC_CLAIMS: EvidenceClaim[] = [...CPC_REVIEWED_V1_CLAIMS, ...revisionClaims];
export const CPC_SOURCES: ClinicalSource[] = [...CPC_REVIEWED_V1_SOURCES, ...revisionSources].map(s => ({ ...s, evidenceClaimIds: CPC_CLAIMS.filter(c => c.sourceIds.includes(s.id)).map(c => c.id) }));
export const CPC_REVIEWED_V1_ITEMS: CPCCaseDraft[] = [
  {
    "slug": "discordant-stool-record",
    "name": "Henry Wallace",
    "age": 58,
    "sex": "Male",
    "complaint": "Stool test review",
    "presentation": "{patientName}, a 58-year-old man, attends clinic to reconcile outside colorectal screening results.",
    "nodes": [
      {
        "slug": "positive-fit-negative-repeat",
        "conceptId": "concept.colorectal.positive-fit-colonoscopy",
        "title": "Complete abnormal stool screening",
        "objective": "Select diagnostic colonoscopy after an abnormal FIT despite a later negative repeat.",
        "update": "The August screening FIT was positive. A second kit from another office in September was negative. No colon examination has followed; colonoscopy is clinically appropriate.",
        "task": "Which investigation should complete {patientName}'s evaluation of these screening records?",
        "choices": [
          {
            "id": "scope",
            "label": "Diagnostic colonoscopy",
            "temptation": "Let the screening indication determine diagnostic completion",
            "rationale": "An earlier positive screen still requires colonoscopy; a later negative screen does not complete its evaluation.",
            "reasonableWhen": "An abnormal stool screen remains unresolved and colonoscopy is appropriate.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "fit",
            "label": "Another fecal immunochemical test",
            "temptation": "Let the newest screen cancel the older result",
            "rationale": "Another screening result does not resolve the first abnormal result.",
            "reasonableWhen": "Routine eligible screening without an outstanding abnormal result.",
            "timingProfileId": "timing.test.general_diagnostic"
          },
          {
            "id": "ctc",
            "label": "CT colonography",
            "temptation": "Prefer a whole-colon image over direct examination",
            "rationale": "No barrier to diagnostic colonoscopy is supplied; tissue sampling may be needed.",
            "reasonableWhen": "An incomplete or contraindicated colonoscopy could change the completion pathway.",
            "timingProfileId": "timing.test.ct"
          }
        ],
        "claims": [
          "positive-fit-completion"
        ],
        "explanation": "A negative repeat screen cannot cancel the diagnostic evaluation required by an earlier positive FIT.",
        "gate": {
          "cueAttack": "Neither complaint nor task names the keyed instrument. All three tests have estimates. Removed ready-for-recommended-workup wording.",
          "stage": "Three diagnostic investigations after abnormal screening.",
          "steps": [
            "Recognize a negative repeat as another screen rather than diagnostic completion.",
            "Choose a colon examination rather than further screening."
          ],
          "difficulty": "Moderate prediction: recency bias can overwrite the unresolved earlier result.",
          "closestChoice": "fit",
          "decidingObservation": "Initial positive FIT without a completed colon examination.",
          "consequence": "Delayed diagnostic evaluation.",
          "deletionTest": "Both results create the discordance; colonoscopy suitability limits the offered alternatives.",
          "counterfactual": "Replace both results with a single negative FIT in routine screening: scheduled repeat FIT becomes reasonable.",
          "counterfactualChoice": "fit",
          "sequence": "First node; its explanation gives no tissue-provenance rule."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "workup",
        "correctChoice": "scope"
      },
      {
        "slug": "biopsy-site-discordance",
        "conceptId": "concept.colorectal.histologic-confirmation.v2",
        "title": "Resolve unrepresentative colon sampling",
        "objective": "Arrange lesion-directed tissue acquisition when a benign submitted specimen came from outside a persistent lesion.",
        "update": "At a later visit, the founder reviews the completed outside colonoscopy. An irregular sigmoid mucosal lesion remains in place. The procedure diagram maps the submitted bites to adjacent mucosa; histology contains intact crypts and lamina propria. Lesion-directed endoscopic sampling is feasible.",
        "task": "Which tissue-assessment plan should be arranged for {patientName}'s sigmoid lesion?",
        "choices": [
          {
            "id": "target",
            "label": "Repeat endoscopic sampling of the lesion",
            "temptation": "Match submitted tissue to the target",
            "rationale": "Benign adjacent mucosa does not establish the separate lesion diagnosis.",
            "reasonableWhen": "A suspicious lesion remains unsampled and can be sampled safely.",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          },
          {
            "id": "levels",
            "label": "Obtain deeper levels from the existing block",
            "temptation": "Treat a provenance problem as a processing problem",
            "rationale": "Further levels cannot turn adjacent tissue into the persistent lesion.",
            "reasonableWhen": "A correctly targeted specimen has an incompletely sectioned diagnostic focus.",
            "timingProfileId": "timing.test.pathology_review"
          },
          {
            "id": "interval",
            "label": "Repeat endoscopy at a surveillance visit",
            "temptation": "Accept benign tissue as a resolved baseline",
            "rationale": "The actual lesion remains histologically unresolved.",
            "reasonableWhen": "A completely removed concordantly benign lesion can enter surveillance.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "unrepresentative-colon-biopsy"
        ],
        "explanation": "Map the specimen before trusting its scope. The submitted mucosa does not represent the persistent lesion; arrange targeted tissue assessment.",
        "gate": {
          "cueAttack": "The record does not label sampling inadequate. The map and constituents require interpretation; all assessment options carry estimates.",
          "stage": "Three tissue-assessment plans for an unresolved diagnosis.",
          "steps": [
            "Identify that the submitted specimen comes from adjacent surface mucosa.",
            "Acquire the actual lesion rather than reprocess off-target tissue or assume clearance."
          ],
          "difficulty": "Moderate prediction: a reassuring pathology label may obscure target mismatch.",
          "closestChoice": "levels",
          "decidingObservation": "Procedure map places the bites outside the lesion.",
          "consequence": "False reassurance from an unrepresentative specimen.",
          "deletionTest": "Deleting the map makes deeper levels a more credible first action; persistent lesion and feasibility delimit the decision.",
          "counterfactual": "Move the bites into the lesion and add a pathologist request for additional levels to resolve a partially sectioned focus: block review becomes appropriate.",
          "counterfactualChoice": "levels",
          "sequence": "Earlier FIT feedback supplies no specimen-location inference."
        },
        "creationKind": "rewrite",
        "conceptRelation": "new_version",
        "previousConceptId": "concept.colorectal.histologic-confirmation",
        "conceptType": "workup",
        "correctChoice": "target"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "incomplete-colonoscopy",
    "name": "Grace Bennett",
    "age": 64,
    "sex": "Female",
    "complaint": "Colonoscopy review",
    "presentation": "{patientName}, a 64-year-old woman, attends clinic to review an outside colonoscopy after a positive FIT.",
    "nodes": [
      {
        "slug": "cecum-versus-adequacy",
        "conceptId": "concept.variety3.inadequate-bowel-prep-repeat-colonoscopy",
        "title": "Complete an inadequately prepared examination",
        "objective": "Distinguish cecal intubation from adequate proximal mucosal assessment.",
        "update": "The scope reached the cecum. After washing, adherent stool still obscured broad areas of the ascending and transverse colon. The left colon was well seen; the report nevertheless assigned a routine screening interval.",
        "task": "Which investigation should complete {patientName}'s positive-FIT evaluation?",
        "choices": [
          {
            "id": "repeat",
            "label": "Repeat colonoscopy with revised preparation",
            "temptation": "Judge visualization separately from scope reach",
            "rationale": "Obscured proximal mucosa remains unresolved despite cecal intubation.",
            "reasonableWhen": "A required diagnostic colon examination remains inadequate.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "sigmoid",
            "label": "Flexible sigmoidoscopy with standard preparation",
            "temptation": "Focus on the adequately seen distal colon",
            "rationale": "A distal repeat leaves the poorly seen proximal colon unexamined.",
            "reasonableWhen": "An isolated distal question after adequate proximal evaluation.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "fit",
            "label": "Repeat fecal immunochemical screening",
            "temptation": "Treat cecal reach as a completed negative scope",
            "rationale": "A repeat screen cannot complete the unresolved diagnostic examination.",
            "reasonableWhen": "Routine screening after an appropriately resolved prior evaluation.",
            "timingProfileId": "timing.test.general_diagnostic"
          }
        ],
        "claims": [
          "positive-fit-completion",
          "inadequate-prep-completion"
        ],
        "explanation": "Reaching the cecum does not establish adequate mucosal inspection. Complete the poorly visualized colon with an adequately prepared repeat; no universal repeat deadline is specified.",
        "gate": {
          "cueAttack": "Removed interpretive cannot-support-screening wording. Raw regional visibility competes with the cecal landmark. All tests have previews.",
          "stage": "Three completion investigations.",
          "steps": [
            "Recognize the mismatch between anatomic reach and mucosal assessment.",
            "Complete the unresolved positive-FIT evaluation rather than accept a routine interval."
          ],
          "difficulty": "Moderate prediction: residents may trust the cecal endpoint or a reassuring distal examination.",
          "closestChoice": "fit",
          "decidingObservation": "Proximal mucosa remains obscured after washing.",
          "consequence": "Missed proximal neoplasia and an unjustified interval.",
          "deletionTest": "Cecal reach creates the error; regional obscuration defeats it. Positive FIT establishes the diagnostic phase.",
          "counterfactual": "If the whole colon were adequately inspected with no neoplasia, returning to an appropriate screening pathway becomes reasonable.",
          "counterfactualChoice": "fit",
          "sequence": "No later pathology or surveillance rule is exposed."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "workup",
        "correctChoice": "repeat"
      },
      {
        "slug": "advanced-adenoma-surveillance",
        "conceptId": "concept.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v1",
        "title": "Surveillance after an advanced adenoma",
        "objective": "Use the completed baseline and resection details to select USMSTF surveillance.",
        "update": "The repeat examination had adequate visualization throughout. A 12-mm tubular adenoma was removed in one intact specimen with complete excision documented and no invasive cancer. There were no other polyps, prior neoplasia, hereditary syndrome or relevant family history.",
        "task": "Under USMSTF guidance, when should {patientName}'s next colonoscopy be planned?",
        "choices": [
          {
            "id": "three",
            "label": "Colonoscopy in three years",
            "temptation": "Combine adenoma size with complete intact removal",
            "rationale": "An adenoma at least 10 mm warrants three-year surveillance after a high-quality baseline.",
            "reasonableWhen": "An advanced adenoma has been confidently completely removed.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "six",
            "label": "Colonoscopy in six months",
            "temptation": "Apply a large-piecemeal scar-check rule",
            "rationale": "This smaller lesion was removed intact, so the early piecemeal pathway does not apply.",
            "reasonableWhen": "An adenoma at least 20 mm was removed piecemeal.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "ten",
            "label": "Colonoscopy in ten years",
            "temptation": "Let corrected preparation reset the case to normal screening",
            "rationale": "The adequate examination still found a size-defined advanced adenoma.",
            "reasonableWhen": "A normal high-quality examination in an average-risk patient.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "advanced-adenoma-surveillance",
          "piecemeal-surveillance"
        ],
        "explanation": "The adequate repeat becomes the baseline. The adenoma size supports three years, while intact complete removal distinguishes this from an early piecemeal scar check.",
        "gate": {
          "cueAttack": "Identical investigation labels differ only by supported interval. US framework is stated because intervals are guideline-specific.",
          "stage": "Three next-colonoscopy intervals.",
          "steps": [
            "Interpret the now-adequate baseline, specimen size and intact removal.",
            "Select advanced-adenoma surveillance rather than a scar check or normal-screen interval."
          ],
          "difficulty": "Moderate prediction: the earlier incomplete examination or adenoma size may provoke an unnecessary early repeat.",
          "closestChoice": "six",
          "decidingObservation": "12-mm adenoma, intact complete excision and adequate whole-colon examination.",
          "consequence": "Over-surveillance or delayed surveillance.",
          "deletionTest": "Size and removal mode independently change the category; exclusions delimit guideline applicability.",
          "counterfactual": "Change to a 25-mm adenoma removed piecemeal: six-month surveillance becomes best.",
          "counterfactualChoice": "six",
          "sequence": "The prior explanation addresses adequacy, not adenoma surveillance."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "three"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "large-polyp-referral",
    "name": "Victor Ellis",
    "age": 67,
    "sex": "Male",
    "complaint": "Polyp removal consultation",
    "presentation": "{patientName}, a 67-year-old man, attends clinic with outside endoscopy records for a cecal lesion.",
    "nodes": [
      {
        "slug": "large-polyp-expert-resection",
        "conceptId": "concept.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v1",
        "title": "Advanced resection before colectomy",
        "objective": "Choose expert endoscopic assessment for a large lesion without demonstrated deep invasion.",
        "update": "The lesion spans 28 mm and spreads laterally with a uniform granular surface. Documented image-enhanced inspection shows no depressed or ulcerated focus. A superficial sample contains adenoma. The first operator stopped before attempting resection because of size.",
        "task": "Which referral should guide {patientName}'s next lesion-removal plan?",
        "choices": [
          {
            "id": "expert",
            "label": "Advanced endoscopist for resection assessment",
            "temptation": "Separate technical complexity from an oncologic indication",
            "rationale": "Size supports advanced expertise; neither the appearance nor the superficial sample establishes mandatory colectomy.",
            "reasonableWhen": "A large nonpedunculated lesion lacks overt deep-invasive features.",
            "timingProfileId": "timing.test.advanced_diagnostic"
          },
          {
            "id": "surgery",
            "label": "Colorectal surgeon for segmental colectomy",
            "temptation": "Interpret size as proof that endoscopy cannot be definitive",
            "rationale": "A technically difficult adenoma can still be removable by an expert.",
            "reasonableWhen": "Deep invasion or expert-confirmed inability to achieve safe complete endoscopic removal."
          },
          {
            "id": "routine",
            "label": "Referring endoscopist for serial partial resections",
            "temptation": "Convert a large lesion into several routine removals",
            "rationale": "Repeated incomplete attempts can complicate definitive resection.",
            "reasonableWhen": "A readily removable small lesion can be completely excised by the routine operator.",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        ],
        "claims": [
          "large-polyp-expertise"
        ],
        "explanation": "Separate size-related difficulty from established deep cancer. Expert assessment can define a complete endoscopic removal plan before colectomy is chosen for technical complexity.",
        "gate": {
          "cueAttack": "No statement calls the lesion benign or curable. The reason the operator stopped is observed chronology, not a promise that an expert can succeed.",
          "stage": "Three referral/removal pathways.",
          "steps": [
            "Interpret morphology, superficial-biopsy scope and why the first procedure stopped.",
            "Seek appropriate resection expertise before equating technical difficulty with mandatory colectomy."
          ],
          "difficulty": "Moderate prediction: size and incomplete removal can trigger premature surgery.",
          "closestChoice": "surgery",
          "decidingObservation": "No deep-invasive morphology; size stopped an unattempted resection.",
          "consequence": "Unnecessary colectomy or repeated scarring partial attempts.",
          "deletionTest": "Morphology prevents a cancer-first assumption; superficial sampling remains explicitly limited.",
          "counterfactual": "Confirm deep submucosal invasion and replace the surface with an ulcerated invasive focus: surgical evaluation becomes best.",
          "counterfactualChoice": "surgery",
          "sequence": "No previous scored finding; the later EMR method is not yet visible."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "expert"
      },
      {
        "slug": "piecemeal-scar-surveillance",
        "conceptId": "concept.topic.colorectal-polyps-cancer.piecemeal-emr-surveillance.v1",
        "title": "Early surveillance after piecemeal EMR",
        "objective": "Select early scar assessment after large piecemeal adenoma resection.",
        "update": "At the next clinic visit, the founder reviews expert EMR records. The 28-mm lesion was removed in several pieces. No residual tissue was visible; fragments contain adenoma without invasive cancer, but cannot establish a continuous lateral margin. The remaining colon was adequately examined.",
        "task": "Under USMSTF guidance, when should {patientName}'s first postresection colonoscopy be planned?",
        "choices": [
          {
            "id": "six",
            "label": "Colonoscopy at about six months",
            "temptation": "Match follow-up to removal mode",
            "rationale": "Large piecemeal EMR needs early recurrence assessment despite apparent visual clearance.",
            "reasonableWhen": "An adenoma at least 20 mm was removed piecemeal.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "three",
            "label": "Colonoscopy at three years",
            "temptation": "Use the ordinary advanced-adenoma interval",
            "rationale": "That interval omits the separate early scar check for this resection.",
            "reasonableWhen": "A smaller advanced adenoma was confidently removed intact.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "ten",
            "label": "Colonoscopy at ten years",
            "temptation": "Treat visual clearance as a normal baseline",
            "rationale": "A large piecemeal-resected adenoma is not a normal screening examination.",
            "reasonableWhen": "A high-quality colonoscopy finds no neoplasia.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "piecemeal-surveillance",
          "advanced-adenoma-surveillance"
        ],
        "explanation": "Visual clearance and intact margin assessment are different. Large size plus piecemeal removal supports the early scar-surveillance pathway.",
        "gate": {
          "cueAttack": "All options are the same examination at different intervals. Removed a complete-clearance conclusion; method and specimen architecture determine follow-up.",
          "stage": "Three first postresection colonoscopy intervals.",
          "steps": [
            "Distinguish clear-looking surface from confidently assessed continuous margins.",
            "Apply early piecemeal surveillance rather than routine advanced-adenoma follow-up."
          ],
          "difficulty": "Moderate prediction: noninvasive fragments and visual clearance may falsely reassure into a three-year interval.",
          "closestChoice": "three",
          "decidingObservation": "28-mm lesion removed piecemeal despite a clear final surface.",
          "consequence": "Delayed detection of residual or recurrent adenoma.",
          "deletionTest": "Removal mode and size are necessary; no invasion keeps this separate from adverse malignant-polyp surgery.",
          "counterfactual": "Change to an intact completely excised 12-mm adenoma: three-year surveillance becomes best.",
          "counterfactualChoice": "three",
          "sequence": "The first referral explanation gives no surveillance interval or future removal method."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "six"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "favorable-polyp-specimen",
    "name": "Susan Mercer",
    "age": 55,
    "sex": "Female",
    "complaint": "Polyp pathology review",
    "presentation": "{patientName}, a 55-year-old woman, attends clinic after removal of an ascending-colon lesion.",
    "nodes": [
      {
        "slug": "intact-low-risk-specimen",
        "conceptId": "concept.malignant-polyp.low-risk-endoscopic-excision",
        "title": "Complete favorable invasive-polyp excision",
        "objective": "Integrate specimen adequacy, depth and adverse-feature assessment before colectomy.",
        "update": "The lesion was retrieved in one oriented piece. Moderately differentiated glands extend 0.6 mm into submucosa and remain 2 mm from the deep cut edge. No lymphovascular or perineural invasion is found; budding is low. No lesion remained endoscopically.",
        "task": "Which lesion-directed plan should be discussed for {patientName}'s resected ascending-colon lesion?",
        "choices": [
          {
            "id": "follow",
            "label": "Colonoscopic surveillance of the excision site",
            "temptation": "Use the complete specimen rather than the cancer label",
            "rationale": "The intact assessment and favorable features support endoscopic treatment with surveillance.",
            "reasonableWhen": "A fully assessed invasive polyp has favorable features and clear edges.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "scar",
            "label": "Endoscopic full-thickness scar excision",
            "temptation": "Treat all submucosal cancer as local residual",
            "rationale": "No outstanding local margin question is established.",
            "reasonableWhen": "A specialist-defined unresolved local-clearance problem.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "regional",
            "label": "Oncologic ascending-colon resection",
            "temptation": "Treat invasion as automatic colectomy",
            "rationale": "No adverse feature puts this fully assessed lesion in the regional resection group.",
            "reasonableWhen": "Adverse histology or an involved invasive margin."
          }
        ],
        "claims": [
          "low-risk-malignant-polyp",
          "adverse-polyp-regional-risk"
        ],
        "explanation": "The intact specimen can establish depth and clearance. Its favorable represented features support surveillance after endoscopic treatment.",
        "gate": {
          "cueAttack": "Neither task nor presentation says low-risk. Removed chemotherapy and radiation foils; individual pathology components must be integrated.",
          "stage": "Three postexcision lesion plans.",
          "steps": [
            "Establish that the intact specimen supports depth and margin assessment.",
            "Combine grade, budding and vascular/neural findings to distinguish local follow-up from regional treatment."
          ],
          "difficulty": "Moderate prediction: over-treating a cancer label and underweighting specimen adequacy are credible errors.",
          "closestChoice": "regional",
          "decidingObservation": "Intact shallow specimen, clear 2-mm edge and no adverse findings.",
          "consequence": "Unnecessary colectomy or reverse undertreatment of adverse disease.",
          "deletionTest": "Architecture earns negative-margin confidence; adverse-feature assessment is necessary.",
          "counterfactual": "Add malignant glands in vascular channels: regional resection becomes best despite the clear edge.",
          "counterfactualChoice": "regional",
          "sequence": "Standalone; no preceding favorable-profile feedback."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "follow"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "favorable-stalk-pathology",
    "name": "Daniel Fraser",
    "age": 60,
    "sex": "Male",
    "complaint": "Polyp pathology review",
    "presentation": "{patientName}, a 60-year-old man, attends clinic with a removed sigmoid-polyp specimen and operative diagram.",
    "nodes": [
      {
        "slug": "stalk-local-clearance",
        "conceptId": "concept.malignant-polyp.low-risk-endoscopic-excision",
        "title": "Complete favorable invasive-polyp excision",
        "objective": "Integrate specimen adequacy, depth and adverse-feature assessment before colectomy.",
        "update": "The pedunculated lesion was retrieved intact. Well-formed malignant glands enter 0.5 mm into stalk submucosa, stopping 2 mm above transection. No lymphovascular or perineural invasion or budding is identified.",
        "task": "Which postexcision plan fits {patientName}'s sigmoid-polyp specimen?",
        "choices": [
          {
            "id": "follow",
            "label": "Colonoscopic surveillance after polypectomy",
            "temptation": "Interpret invasion and clearance separately",
            "rationale": "The intact shallow favorable specimen supports surveillance.",
            "reasonableWhen": "Complete local excision with favorable invasion features.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "scar",
            "label": "Endoscopic full-thickness scar resection",
            "temptation": "Equate stalk invasion with a positive margin",
            "rationale": "The represented cut edge is clear; invasion has not reached transection.",
            "reasonableWhen": "A specialist-defined unresolved local margin.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "regional",
            "label": "Oncologic sigmoid colectomy",
            "temptation": "Rank all stalk-invasive cancers as adverse",
            "rationale": "The represented depth and remaining features do not establish adverse-polyp risk.",
            "reasonableWhen": "A transected invasive front or vascular invasion."
          }
        ],
        "claims": [
          "low-risk-malignant-polyp",
          "adverse-polyp-regional-risk"
        ],
        "explanation": "Shallow stalk invasion and an involved stalk cut edge are different observations. The intact clear specimen and remaining favorable findings support local follow-up.",
        "gate": {
          "cueAttack": "No Haggitt level or low-risk conclusion is supplied. Three comparable plans avoid treatment caricatures.",
          "stage": "Three postexcision lesion plans.",
          "steps": [
            "Locate the invasive front relative to transection.",
            "Integrate adequacy and adverse-feature absence rather than treating every stalk-invasive lesion as adverse."
          ],
          "difficulty": "Moderate prediction: stalk invasion may be confused with invasion below the stalk or transection.",
          "closestChoice": "scar",
          "decidingObservation": "The invasive front stops above an intact clear cut edge.",
          "consequence": "Unnecessary scar treatment or colectomy.",
          "deletionTest": "Orientation earns clearance; other findings govern whether local success is sufficient.",
          "counterfactual": "Cut invasive glands across the cautery edge: oncologic sigmoid resection becomes best.",
          "counterfactualChoice": "regional",
          "sequence": "Independent variant, not paired with a favorable-polyp explanation."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "follow"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "vascular-channel-polyp",
    "name": "Lydia Barnes",
    "age": 62,
    "sex": "Female",
    "complaint": "Polyp pathology review",
    "presentation": "{patientName}, a 62-year-old woman, attends clinic after en-bloc sigmoid-polyp excision.",
    "nodes": [
      {
        "slug": "vascular-channel-regional-resection",
        "conceptId": "concept.malignant-polyp.adverse-feature-colectomy",
        "title": "Regional risk despite local clearance",
        "objective": "Distinguish vascular invasion from local clearance when selecting regional treatment.",
        "update": "Malignant glands enter submucosa and occupy endothelial-lined channels away from the main front. None reaches the inked edge. Endoscopy shows a flat scar; CT shows no distant deposits or enlarged nodes. Operative assessment finds no prohibitive risk.",
        "task": "Which treatment plan should be discussed for {patientName}'s sigmoid lesion?",
        "choices": [
          {
            "id": "regional",
            "label": "Sigmoid colectomy with regional lymphadenectomy",
            "temptation": "Separate local clearance from regional risk",
            "rationale": "The vascular-channel finding supports regional resection despite a clear edge and normal-sized nodes.",
            "reasonableWhen": "An operable patient has an adverse invasive-polyp feature."
          },
          {
            "id": "scar",
            "label": "Full-thickness endoscopic scar excision",
            "temptation": "Treat local clearance as the entire oncologic problem",
            "rationale": "Local excision does not address the regional risk raised by vascular invasion.",
            "reasonableWhen": "A selected local-clearance problem without adverse regional-risk features.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "follow",
            "label": "Colonoscopic scar surveillance",
            "temptation": "Let a healed scar override pathology",
            "rationale": "A healed surface cannot erase the adverse feature.",
            "reasonableWhen": "An intact fully assessed favorable polyp.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "adverse-polyp-regional-risk",
          "low-risk-malignant-polyp"
        ],
        "explanation": "Vascular involvement and cut-edge clearance answer different questions. Discuss resection of the involved segment and its draining lymphatic territory.",
        "gate": {
          "cueAttack": "Lymphovascular invasion is not given as a diagnosis. Clear CT and scar create a real clinical misconception rather than permission for the key.",
          "stage": "Three postexcision local-versus-regional treatment plans.",
          "steps": [
            "Recognize malignant glands in endothelial-lined channels.",
            "Determine that local-edge clearance does not settle regional risk."
          ],
          "difficulty": "Moderate/hard prediction: reassuring margins and CT can incorrectly dominate invasive histology.",
          "closestChoice": "scar",
          "decidingObservation": "Malignant glands in endothelial-lined channels despite a clear edge.",
          "consequence": "Undertreatment of microscopic regional disease.",
          "deletionTest": "Removing the channels changes risk; margin and CT reassurance establish the competing error. Fitness limits surgery ranking.",
          "counterfactual": "Remove vascular invasion and supply a completely assessed favorable profile: surveillance becomes best.",
          "counterfactualChoice": "follow",
          "sequence": "Standalone; the frozen N2 provenance matrix remains exact."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "regional"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "transected-invasive-front",
    "name": "Owen Parker",
    "age": 59,
    "sex": "Male",
    "complaint": "Polyp margin review",
    "presentation": "{patientName}, a 59-year-old man, attends clinic to discuss an outside descending-colon polypectomy.",
    "nodes": [
      {
        "slug": "transected-front-regional-resection",
        "conceptId": "concept.malignant-polyp.adverse-feature-colectomy",
        "title": "Regional risk despite local clearance",
        "objective": "Distinguish vascular invasion from local clearance when selecting regional treatment.",
        "update": "Fragments contain moderately differentiated submucosal carcinoma. One ends through invasive glands at a cauterized edge; depth cannot be reconstructed. No vascular invasion is seen in represented sections. The scar looks clear, distant staging is negative and he is fit for resection.",
        "task": "Which treatment plan best addresses {patientName}'s descending-colon pathology?",
        "choices": [
          {
            "id": "regional",
            "label": "Oncologic descending-colon resection",
            "temptation": "Treat an unassessable invasive front as an oncologic issue",
            "rationale": "The transected invasive edge and unknown depth do not meet favorable-polyp criteria.",
            "reasonableWhen": "An operable patient has a positive or indeterminate invasive margin."
          },
          {
            "id": "scar",
            "label": "Endoscopic full-thickness scar resection",
            "temptation": "Convert every uncertainty into a local clearance problem",
            "rationale": "Local treatment may not settle the regional question from inadequately assessed invasive cancer.",
            "reasonableWhen": "A selected noninvasive residual lesion or specialist-defined local-only issue.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "follow",
            "label": "Colonoscopic scar surveillance",
            "temptation": "Treat no vascular invasion as sufficient for low risk",
            "rationale": "A sampled negative does not repair a transected invasive front.",
            "reasonableWhen": "An intact completely assessed favorable polyp.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "adverse-polyp-regional-risk",
          "low-risk-malignant-polyp"
        ],
        "explanation": "The actual cut-edge involvement matters more than the clear-looking scar. Sampled negatives do not turn an incomplete invasive specimen into a fully assessed favorable one.",
        "gate": {
          "cueAttack": "Removed the margin-naming lead-in. Raw transection and unmeasurable depth require interpretation. Options compare definitive lesion plans.",
          "stage": "Three postexcision treatment plans.",
          "steps": [
            "Identify transected invasive glands and the missing complete front.",
            "Do not extrapolate sampled negatives to global favorable risk."
          ],
          "difficulty": "Moderate prediction: sampled negative findings may be overextended to the full specimen.",
          "closestChoice": "scar",
          "decidingObservation": "Invasive glands are cut across at cautery and depth is unassessable.",
          "consequence": "False confidence in local treatment of inadequately staged cancer.",
          "deletionTest": "Transected glands change the key; fragment count alone would not prove an adverse invasive edge.",
          "counterfactual": "Replace fragments with an intact shallow favorable specimen and clear edges: surveillance becomes best.",
          "counterfactualChoice": "follow",
          "sequence": "Standalone; no frozen colon-cancer companion is rebound."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "regional"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "scarred-residual-polyp",
    "name": "Elaine Porter",
    "age": 66,
    "sex": "Female",
    "complaint": "Residual polyp review",
    "presentation": "{patientName}, a 66-year-old woman, attends clinic after partial cecal-polyp removal at an outside center.",
    "nodes": [
      {
        "slug": "nonlifting-after-tattoo",
        "conceptId": "concept.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v1",
        "title": "Advanced resection before colectomy",
        "objective": "Choose expert endoscopic assessment for a large lesion without demonstrated deep invasion.",
        "update": "The original 26-mm lesion had a uniform granular surface. Cautery removed one part; carbon tattoo was injected beneath the remainder. On repeat inspection, residual tissue fails to lift at that site. Removed tissue contains adenoma. No ulcerated or depressed focus is described.",
        "task": "Which referral should guide {patientName}'s next treatment plan?",
        "choices": [
          {
            "id": "expert",
            "label": "Advanced endoscopist for scarred-lesion assessment",
            "temptation": "Interpret nonlifting in its chronology",
            "rationale": "Prior cautery and tattoo can cause fibrosis; expert assessment can determine whether endoscopic completion is appropriate.",
            "reasonableWhen": "Nonlifting residual tissue follows intervention without established deep invasion.",
            "timingProfileId": "timing.test.advanced_diagnostic"
          },
          {
            "id": "regional",
            "label": "Colorectal surgeon for oncologic colectomy",
            "temptation": "Equate all nonlifting with deep invasion",
            "rationale": "Prior intervention supplies a competing cause; nonlifting alone does not establish an oncologic operation.",
            "reasonableWhen": "Confirmed deep cancer or expert determination that safe endoscopic completion is unsuitable."
          },
          {
            "id": "routine",
            "label": "Referring endoscopist for repeat standard snaring",
            "temptation": "Treat possible fibrosis as proof routine removal is safe",
            "rationale": "Nonlifting residual tissue remains technically complex despite the alternative explanation.",
            "reasonableWhen": "Small readily lifting residual tissue can be removed routinely.",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        ],
        "claims": [
          "scar-nonlifting",
          "large-polyp-expertise"
        ],
        "explanation": "Prior cautery and tattoo change the meaning of nonlifting. They do not guarantee benignity or safe routine removal; obtain expert completion assessment.",
        "gate": {
          "cueAttack": "The record does not diagnose fibrosis or declare benignity. Chronology changes the nonlift interpretation. No uniquely cautious key competes with unqualified immediate treatment; each choice is a referral/removal pathway.",
          "stage": "Three pathways for definitive residual-lesion management.",
          "steps": [
            "Recognize a procedure-related cause competing with deep invasion.",
            "Choose advanced assessment instead of automatic colectomy or another routine attempt."
          ],
          "difficulty": "Hard prediction: both overcalling invasion and underestimating fibrosis are credible errors.",
          "closestChoice": "regional",
          "decidingObservation": "Nonlifting is localized to the cauterized and tattooed bed.",
          "consequence": "Unnecessary colectomy or hazardous incomplete repeat resection.",
          "deletionTest": "Without prior intervention, the nonlift has a different meaning; partial adenoma cannot clear unsampled tissue.",
          "counterfactual": "Add targeted histology proving deep invasion: oncologic colectomy assessment becomes best.",
          "counterfactualChoice": "regional",
          "sequence": "Separate variant of advanced-resection meaning; no extra concept solely for tattoo history."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "expert"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "intramucosal-report",
    "name": "Peter Lawson",
    "age": 61,
    "sex": "Male",
    "complaint": "Cancer report review",
    "presentation": "{patientName}, a 61-year-old man, attends clinic after a sigmoid-polyp pathology report used the word carcinoma.",
    "nodes": [
      {
        "slug": "intramucosal-versus-t1",
        "conceptId": "concept.topic.colorectal-polyps-cancer.intramucosal-local-treatment.v1",
        "title": "Mucosal carcinoma versus T1 invasion",
        "objective": "Use represented tissue boundaries rather than a cancer label to select local versus regional care.",
        "update": "The lesion was removed intact. Malignant glands are confined to lamina propria with continuous muscularis mucosae beneath them. Represented submucosa contains no invasive glands; all cut edges are clear.",
        "task": "Which lesion-directed plan fits {patientName}'s represented pathology?",
        "choices": [
          {
            "id": "follow",
            "label": "Colonoscopic surveillance after local excision",
            "temptation": "Apply the actual depth boundary",
            "rationale": "The adequately represented mucosal lesion has been excised; submucosal T1 invasion is not shown.",
            "reasonableWhen": "Complete local excision of intramucosal disease.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "scar",
            "label": "Full-thickness endoscopic scar resection",
            "temptation": "Treat carcinoma wording as unremoved deeper tissue",
            "rationale": "The intact specimen already represents the relevant boundary and clear margins.",
            "reasonableWhen": "A selected unresolved local-clearance question.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "regional",
            "label": "Sigmoid colectomy with regional lymphadenectomy",
            "temptation": "Collapse mucosal carcinoma and adverse T1 cancer",
            "rationale": "The represented submucosa contains no invasive glands.",
            "reasonableWhen": "Submucosal invasion with adverse histology supports regional treatment."
          }
        ],
        "claims": [
          "intramucosal-local-treatment",
          "adverse-polyp-regional-risk"
        ],
        "explanation": "Interpret depth and adequacy before acting on terminology. An intact specimen showing mucosal confinement and clear edges supports local treatment with surveillance.",
        "gate": {
          "cueAttack": "No stage-zero label precedes the answer. Represented submucosa is retained because a superficial negative would not establish the same conclusion.",
          "stage": "Three postexcision lesion plans.",
          "steps": [
            "Interpret the muscularis-mucosae boundary and represented submucosa.",
            "Choose local care rather than regional surgery from the word carcinoma."
          ],
          "difficulty": "Moderate prediction: pathology terminology can provoke overtreatment if depth is ignored.",
          "closestChoice": "regional",
          "decidingObservation": "Glands remain above continuous muscularis mucosae; submucosa is represented.",
          "consequence": "Unnecessary regional resection.",
          "deletionTest": "Removing represented submucosa destroys confidence in the local conclusion; clear edges establish local completion.",
          "counterfactual": "Show glands inside submucosal vascular channels: regional colectomy becomes best.",
          "counterfactualChoice": "regional",
          "sequence": "Standalone; no histology-label task precedes the applied decision."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "follow"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "fap-rectal-field",
    "name": "Martha Nolan",
    "age": 34,
    "sex": "Female",
    "complaint": "Polyposis surgery consultation",
    "presentation": "{patientName}, a 34-year-old woman with established FAP, attends clinic while the founder reviews outside colonoscopy and operative-planning records.",
    "nodes": [
      {
        "slug": "fap-diffuse-rectal-burden",
        "conceptId": "concept.fap.ipaa-for-uncontrolled-rectal-burden",
        "title": "Rectal removal for uncontrolled FAP burden",
        "objective": "Integrate rectal clearance, continence and restorative goals when choosing FAP operative extent.",
        "update": "The colon contains extensive adenomas. In the rectum, confluent adenomatous areas remain between several prior resection scars; two further clearing sessions left visible lesions, including a broad focus with high-grade dysplasia. She has normal continence and wants intestinal continuity after counseling.",
        "task": "Which operative plan should be discussed for {patientName}'s colorectal disease?",
        "choices": [
          {
            "id": "ipaa",
            "label": "Proctocolectomy with ileal pouch-anal anastomosis",
            "temptation": "Interpret failed rectal control alongside function",
            "rationale": "Removing the uncontrolled rectum addresses the disease; preserved continence and informed restorative goals support IPAA.",
            "reasonableWhen": "Rectal burden requires removal and pouch function is clinically appropriate."
          },
          {
            "id": "ira",
            "label": "Colectomy with ileorectal anastomosis",
            "temptation": "Preserve the rectum despite the actual clearance record",
            "rationale": "IRA retains the repeatedly uncleared rectal adenoma field.",
            "reasonableWhen": "Relative rectal sparing with endoscopically controllable adenomas."
          },
          {
            "id": "end",
            "label": "Proctocolectomy with end ileostomy",
            "temptation": "Choose rectal removal without using the functional goal",
            "rationale": "It removes the field but is less aligned with her stated restorative goal and preserved continence.",
            "reasonableWhen": "Poor sphincter function or an informed preference against pouch-related functional effects."
          }
        ],
        "claims": [
          "fap-rectal-burden",
          "fap-ira",
          "fap-end-ileostomy"
        ],
        "explanation": "Repeated failure to clear the rectal field changes the operation from colon removal to colorectal removal. Continence and the informed functional goal then guide reconstruction.",
        "gate": {
          "cueAttack": "Removed the conclusion rectal burden not controllable. Actual failed clearing, residual field and dysplasia establish it. Three named operations have similar scope; continence and goals are necessary rather than decorative.",
          "stage": "Three definitive FAP operations.",
          "steps": [
            "Infer that the repeatedly uncleared dysplastic rectal field cannot safely be retained as in IRA.",
            "Use continence and restorative goals to select IPAA rather than an end stoma."
          ],
          "difficulty": "Moderate/hard prediction: a resident may preserve an unsafe rectum to avoid pelvic dissection or remove restoration despite adequate function.",
          "closestChoice": "ira",
          "decidingObservation": "Repeated visible rectal residual disease with high-grade dysplasia, normal continence.",
          "consequence": "Retained high-risk rectal disease or avoidable loss of desired restoration.",
          "deletionTest": "Failed clearance establishes extent; continence and goals distinguish two rectum-removing operations.",
          "counterfactual": "Change to a sparsely involved rectum with all adenomas removed and a priority to avoid pelvic dissection: IRA becomes reasonable.",
          "counterfactualChoice": "ira",
          "sequence": "Standalone; genetics testing interpretation is outside the scored topic."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "ipaa"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "fap-rectal-sparing",
    "name": "Nathan Cole",
    "age": 29,
    "sex": "Male",
    "complaint": "Polyposis surgery planning",
    "presentation": "{patientName}, a 29-year-old man with established FAP, attends clinic to review prophylactic surgery with the founder.",
    "nodes": [
      {
        "slug": "fap-rectal-sparing-ira",
        "conceptId": "concept.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1",
        "title": "Rectal-sparing FAP operation",
        "objective": "Assess whether relative rectal sparing permits a colon-only operation under informed functional goals.",
        "update": "Hundreds of colonic adenomas remain after an outside colonoscopy. The rectum contained three small adenomas, all removed intact; the remaining rectum was adequately inspected. Continence is normal. After counseling, he prioritizes avoiding pelvic dissection if the retained rectum can be safely monitored and accepts continuing endoscopy.",
        "task": "Which operative plan best fits {patientName}'s disease distribution and stated priorities?",
        "choices": [
          {
            "id": "ira",
            "label": "Total colectomy with ileorectal anastomosis",
            "temptation": "Use relative rectal sparing under informed priorities",
            "rationale": "The documented clearable rectum permits an IRA option, with ongoing surveillance.",
            "reasonableWhen": "Relative rectal sparing, clearable lesions and willingness to retain surveillance."
          },
          {
            "id": "ipaa",
            "label": "Proctocolectomy with ileal pouch-anal anastomosis",
            "temptation": "Apply the most extensive restorative operation to every FAP case",
            "rationale": "IPAA is a valid broader option, but the supplied relative sparing and functional priority favor IRA here.",
            "reasonableWhen": "Rectal burden cannot be controlled or informed goals favor rectal removal."
          },
          {
            "id": "end",
            "label": "Proctocolectomy with end ileostomy",
            "temptation": "Treat all polyposis as incompatible with restoration",
            "rationale": "No sphincter problem or preference favors an end stoma in this case.",
            "reasonableWhen": "Poor sphincter function or a preference against pouch function."
          }
        ],
        "claims": [
          "fap-ira",
          "fap-rectal-burden",
          "fap-end-ileostomy"
        ],
        "explanation": "The operation depends on distribution, not a single FAP label. Relative rectal sparing permits IRA when the patient accepts ongoing rectal risk assessment and surveillance.",
        "gate": {
          "cueAttack": "The preference is necessary because both IRA and IPAA can be valid. It does not by itself establish that the rectum is retainable. All alternatives name complete operations.",
          "stage": "Three prophylactic FAP operations.",
          "steps": [
            "Interpret the colon-versus-rectum adenoma distribution and completeness of rectal clearance.",
            "Apply the informed priority only after establishing that rectal retention is a supported option."
          ],
          "difficulty": "Moderate prediction: diagnosis-based automatic IPAA competes with inappropriate rectal preservation regardless of burden.",
          "closestChoice": "ipaa",
          "decidingObservation": "Three rectal adenomas completely removed versus extensive persistent colonic disease.",
          "consequence": "Unnecessary pelvic dissection or, if distribution is misread, unsafe rectal retention.",
          "deletionTest": "Without the clearing record, the priority cannot choose IRA; without the informed priority, IPAA remains equally defensible.",
          "counterfactual": "Replace relative sparing with repeatedly uncleared rectal high-grade disease: proctocolectomy with IPAA becomes best despite the wish to avoid pelvic dissection.",
          "counterfactualChoice": "ipaa",
          "sequence": "First decision; feedback gives no future progression findings."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "ira"
      },
      {
        "slug": "fap-retained-rectum-progression",
        "conceptId": "concept.fap.ipaa-for-uncontrolled-rectal-burden",
        "title": "Rectal removal for uncontrolled FAP burden",
        "objective": "Integrate rectal clearance, continence and restorative goals when choosing FAP operative extent.",
        "update": "At a subsequent clinic visit after colectomy with IRA, the founder reviews new surveillance records. The retained rectum now contains a confluent adenoma field with high-grade dysplasia that remained after repeated clearing attempts. Pelvic staging shows no invasive cancer. Continence remains normal and he wants restoration.",
        "task": "Which next operative plan should be discussed for {patientName}'s retained rectum?",
        "choices": [
          {
            "id": "complete",
            "label": "Completion proctectomy with ileal pouch-anal anastomosis",
            "temptation": "Update operative extent from current rather than prior burden",
            "rationale": "The earlier rectal-sparing premise no longer holds; removing the uncontrolled rectum addresses the new disease while permitting restoration.",
            "reasonableWhen": "A retained rectum develops disease no longer manageable endoscopically."
          },
          {
            "id": "continue",
            "label": "Continue IRA with repeated endoscopic clearing",
            "temptation": "Carry forward an earlier appropriate choice unchanged",
            "rationale": "Repeated residual high-grade field disease defeats the original rectal-retention premise.",
            "reasonableWhen": "A limited rectal burden remains endoscopically clearable.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "end",
            "label": "Completion proctectomy with end ileostomy",
            "temptation": "Remove the rectum without using the preserved function",
            "rationale": "This is an option, but the supplied function and restorative goal favor pouch planning.",
            "reasonableWhen": "Poor continence or a preference to avoid pouch-related function."
          }
        ],
        "claims": [
          "fap-rectal-burden",
          "fap-ira",
          "fap-end-ileostomy"
        ],
        "explanation": "A previously appropriate IRA does not remain appropriate under every later rectal phenotype. Reassess current disease control and function before planning completion surgery.",
        "gate": {
          "cueAttack": "The prior plan is not called wrong. New observed failed clearance and dysplasia must override its earlier premise. Options are same-stage definitive strategies.",
          "stage": "Three plans for the currently retained rectum.",
          "steps": [
            "Recognize that new residual dysplastic disease invalidates the earlier clearable-rectum premise.",
            "Select completion rectal removal and restoration using current continence and goals."
          ],
          "difficulty": "Hard prediction: anchoring to a previously correct IRA may delay necessary completion proctectomy.",
          "closestChoice": "continue",
          "decidingObservation": "Persistent high-grade rectal field after repeated clearing.",
          "consequence": "Retaining an uncontrolled neoplastic field.",
          "deletionTest": "Deleting the update leaves the original IRA appropriate, so the update earns a new decision. Continence distinguishes reconstruction choices.",
          "counterfactual": "Return the rectum to a few completely removable adenomas: continued IRA with surveillance becomes best.",
          "counterfactualChoice": "continue",
          "sequence": "Prior explanation permits IRA only under clearability. It does not reveal the later failure or dictate a reconstruction."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "complete"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "fap-poor-sphincter",
    "name": "Helen Marsh",
    "age": 48,
    "sex": "Female",
    "complaint": "Polyposis operation review",
    "presentation": "{patientName}, a 48-year-old woman with FAP, attends clinic for review of outside colorectal surgical recommendations.",
    "nodes": [
      {
        "slug": "fap-poor-sphincter-end-stoma",
        "conceptId": "concept.topic.colorectal-polyps-cancer.fap-poor-sphincter-end-stoma.v1",
        "title": "Reconstruction when continence is poor",
        "objective": "Integrate rectal removal needs with established sphincter dysfunction and informed functional priorities.",
        "update": "The rectal adenoma field includes high-grade dysplasia and has remained after repeated clearing attempts. She has daily leakage of formed stool despite prior continence treatment; examination documents a weak disrupted sphincter. After counseling, she prioritizes reliable evacuation and accepts a permanent stoma.",
        "task": "Which operative plan best fits {patientName}'s disease and functional record?",
        "choices": [
          {
            "id": "end",
            "label": "Proctocolectomy with end ileostomy",
            "temptation": "Use established poor function when choosing reconstruction",
            "rationale": "The rectum needs removal and a pouch would depend on an already poorly functioning outlet; her informed goal supports an end stoma.",
            "reasonableWhen": "Rectal removal is needed with poor sphincter function and compatible informed goals."
          },
          {
            "id": "ipaa",
            "label": "Proctocolectomy with ileal pouch-anal anastomosis",
            "temptation": "Apply restoration without checking the outlet",
            "rationale": "It removes the field but uses the impaired sphincter and conflicts with her functional priority.",
            "reasonableWhen": "Good sphincter function with a restorative goal."
          },
          {
            "id": "ira",
            "label": "Colectomy with ileorectal anastomosis",
            "temptation": "Avoid pouch surgery by retaining an unsafe rectum",
            "rationale": "IRA leaves the uncleared rectal dysplastic field and does not resolve the outlet dysfunction.",
            "reasonableWhen": "Relative rectal sparing and adequate control permit retention."
          }
        ],
        "claims": [
          "fap-end-ileostomy",
          "fap-rectal-burden",
          "fap-ira"
        ],
        "explanation": "Disease distribution determines what must be removed; sphincter function and informed goals determine whether restoration is appropriate.",
        "gate": {
          "cueAttack": "The stoma preference is supported by raw formed-stool leakage and structural weakness, not used as an isolated answer label. Three specific operations share grammar.",
          "stage": "Three definitive FAP operations.",
          "steps": [
            "Identify both uncontrolled rectal disease and a compromised outlet.",
            "Choose rectal removal without a reconstruction relying on that outlet."
          ],
          "difficulty": "Moderate/hard prediction: reflex IPAA in a younger patient can override functional evidence.",
          "closestChoice": "ipaa",
          "decidingObservation": "Established daily formed-stool leakage and sphincter disruption.",
          "consequence": "Poor pouch continence or retention of uncontrolled rectal disease.",
          "deletionTest": "Without poor function, restorative IPAA competes strongly; burden still determines the need for rectal removal.",
          "counterfactual": "Replace dysfunction with normal continence and an informed restorative goal: IPAA becomes best.",
          "counterfactualChoice": "ipaa",
          "sequence": "Standalone; demographic facts do not select the operation."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "end"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "rectal-initial-staging",
    "name": "Laura Sutton",
    "age": 54,
    "sex": "Female",
    "complaint": "Rectal surgery consultation",
    "presentation": "{patientName}, a 54-year-old woman, attends clinic after an outside biopsy identified mid-rectal adenocarcinoma.",
    "nodes": [
      {
        "slug": "rectal-local-mri",
        "conceptId": "concept.topic.colorectal-polyps-cancer.rectal-local-mri.v1",
        "title": "Local rectal staging before treatment",
        "objective": "Choose local staging that evaluates the tumor and mesorectal surgical plane after adequate distant staging.",
        "update": "Colonoscopy identifies a broad lesion 7 cm from the anal verge. Chest and contrast abdominal/pelvic CT show no metastases but do not resolve the tumor edge against the mesorectal fascia. Examination is compatible with a resectable pelvic tumor.",
        "task": "Which examination should complete {patientName}'s local pretreatment assessment?",
        "choices": [
          {
            "id": "mri",
            "label": "Rectal-protocol pelvic MRI",
            "temptation": "Separate local surgical-plane staging from distant staging",
            "rationale": "MRI assesses tumor depth, regional disease and relationship to the mesorectal fascia.",
            "reasonableWhen": "A rectal tumor needs locoregional planning.",
            "timingProfileId": "timing.test.mri"
          },
          {
            "id": "eus",
            "label": "Endorectal ultrasound",
            "temptation": "Use early wall-layer resolution for all rectal staging",
            "rationale": "EUS can help early T-stage distinctions but does not replace the broad mesorectal-plane assessment needed here.",
            "reasonableWhen": "A small early lesion needs T1-versus-T2 clarification.",
            "timingProfileId": "timing.test.advanced_diagnostic"
          },
          {
            "id": "pet",
            "label": "Whole-body FDG PET-CT",
            "temptation": "Treat another distant study as local planning",
            "rationale": "No unresolved systemic target makes PET the local staging examination.",
            "reasonableWhen": "Selected unresolved systemic disease can justify PET after appropriate review.",
            "timingProfileId": "timing.test.pet_ct"
          }
        ],
        "claims": [
          "rectal-mri-staging",
          "rectal-early-eus"
        ],
        "explanation": "Completed distant staging does not establish the local surgical plane. Rectal-protocol MRI addresses the tumor, mesorectum and fascia relationship.",
        "gate": {
          "cueAttack": "The task names the clinical stage, not an imaging property unique to the key. All imaging options have previews; no statement promises MRI availability.",
          "stage": "Three staging examinations.",
          "steps": [
            "Identify that existing CT completed distant assessment but not the local mesorectal-plane question.",
            "Select the modality suited to that remaining planning decision."
          ],
          "difficulty": "Moderate prediction: confusion between systemic staging, early wall-layer staging and mesorectal-plane mapping.",
          "closestChoice": "eus",
          "decidingObservation": "The mesorectal-fascia relationship remains unresolved in a broad rectal lesion.",
          "consequence": "Treatment planned without the relevant local extent.",
          "deletionTest": "Completed distant staging excludes a gratuitous repeat; unresolved fascia relation defines the need.",
          "counterfactual": "Change to an otherwise staged small early lesion whose only unresolved issue is T1 versus T2: EUS becomes reasonable.",
          "counterfactualChoice": "eus",
          "sequence": "First node. Feedback gives no treatment sequence for the still-unseen MRI."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "mri"
      },
      {
        "slug": "rectal-high-risk-tnt",
        "conceptId": "concept.topic.colorectal-polyps-cancer.rectal-high-risk-tnt.v1",
        "title": "Neoadjuvant sequence for locally advanced rectal cancer",
        "objective": "Use local stage and threatened planes to select treatment before definitive surgery.",
        "update": "The outside MRI shows tumor extending through muscle into mesorectal fat, touching the mesorectal fascia, with two irregular heterogeneous mesorectal nodes. The tumor lies below the anterior peritoneal reflection. Mismatch-repair proteins are retained. Distant staging remains negative and she is fit for combined treatment.",
        "task": "Which treatment sequence should be discussed for {patientName}'s rectal cancer?",
        "choices": [
          {
            "id": "tnt",
            "label": "Total neoadjuvant therapy followed by reassessment",
            "temptation": "Integrate local and systemic control before surgery",
            "rationale": "The locally advanced mid-rectal findings support a neoadjuvant multimodal pathway before definitive surgical planning.",
            "reasonableWhen": "Fit patient with stage II/III mid or low rectal disease."
          },
          {
            "id": "upfront",
            "label": "Total mesorectal excision followed by adjuvant therapy",
            "temptation": "Treat a technically resectable tumor as ready for immediate surgery",
            "rationale": "This sequence bypasses the neoadjuvant opportunity in the supplied high-risk local setting.",
            "reasonableWhen": "Selected low-risk or upper-rectal disease can favor initial surgery."
          },
          {
            "id": "local",
            "label": "Transanal excision followed by adjuvant therapy",
            "temptation": "Substitute local wall removal for a mesorectal disease strategy",
            "rationale": "Local excision does not address the represented extramural and nodal disease.",
            "reasonableWhen": "Selected small favorable cT1N0 lesions can be locally excised."
          }
        ],
        "claims": [
          "rectal-tnt",
          "rectal-mri-staging",
          "rectal-local-excision",
          "upper-rectal-initial-resection"
        ],
        "explanation": "Interpret the extramural, nodal and fascia findings before selecting the sequence. Total neoadjuvant treatment is a supported pathway for this fit patient before definitive resection planning.",
        "gate": {
          "cueAttack": "No cT3N-positive or locally advanced label supplies the staging inference. Three options are named treatment sequences of comparable length.",
          "stage": "Three curative-intent treatment sequences.",
          "steps": [
            "Infer extramural/regional disease and a threatened local surgical plane from MRI observations.",
            "Select preoperative multimodal treatment rather than immediate or local surgery."
          ],
          "difficulty": "Moderate/hard prediction: technically resectable and colon-like surgery-first reasoning can override rectal local-control needs.",
          "closestChoice": "upfront",
          "decidingObservation": "Extramural tumor touching fascia, irregular nodes and position below the reflection.",
          "consequence": "Loss of a supported neoadjuvant local/systemic treatment opportunity.",
          "deletionTest": "The MRI changes the plan; mismatch repair narrows modern treatment context without testing germline interpretation.",
          "counterfactual": "Move the tumor entirely above the reflection with clear local planes and no high-risk extension: initial resection becomes a reasonable offered sequence.",
          "counterfactualChoice": "upfront",
          "sequence": "First explanation names staging scope, not neoadjuvant treatment. MRI findings appear only after that answer."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "tnt"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "early-rectal-excision",
    "name": "Samuel Price",
    "age": 57,
    "sex": "Male",
    "complaint": "Early rectal cancer review",
    "presentation": "{patientName}, a 57-year-old man, attends clinic for review of a small outside rectal-cancer workup.",
    "nodes": [
      {
        "slug": "early-rectal-eus",
        "conceptId": "concept.topic.colorectal-polyps-cancer.early-rectal-eus.v1",
        "title": "Clarify early rectal wall invasion",
        "objective": "Select complementary EUS when an early depth distinction changes local-excision eligibility.",
        "update": "The lesion is 2 cm across and occupies less than one quarter of the rectal circumference. Biopsy shows well-differentiated adenocarcinoma without represented vascular invasion or budding. MRI shows no suspicious nodes but cannot distinguish submucosal from muscularis-propria involvement. The lesion is accessible transanally; distant staging is negative.",
        "task": "Which examination would best clarify {patientName}'s remaining local-treatment eligibility question?",
        "choices": [
          {
            "id": "eus",
            "label": "Endorectal ultrasound of the lesion",
            "temptation": "Use an early wall-layer question",
            "rationale": "EUS complements MRI for the unresolved submucosa-versus-muscularis distinction relevant to local excision.",
            "reasonableWhen": "Early T1-versus-T2 distinction remains consequential.",
            "timingProfileId": "timing.test.advanced_diagnostic"
          },
          {
            "id": "mri",
            "label": "Repeat pelvic MRI with the same protocol",
            "temptation": "Repeat a completed broad study without changing the limitation",
            "rationale": "No correctable acquisition error is given; the remaining problem is early layer discrimination.",
            "reasonableWhen": "An inadequate or incorrectly acquired first MRI may need replacement.",
            "timingProfileId": "timing.test.mri"
          },
          {
            "id": "pet",
            "label": "Whole-body FDG PET-CT",
            "temptation": "Treat metabolic staging as wall-layer definition",
            "rationale": "PET does not resolve the early wall-layer distinction needed here.",
            "reasonableWhen": "A separate indeterminate systemic target could justify PET.",
            "timingProfileId": "timing.test.pet_ct"
          }
        ],
        "claims": [
          "rectal-early-eus",
          "rectal-local-excision"
        ],
        "explanation": "The remaining question is early wall depth rather than missing distant or mesorectal staging. Complementary EUS can help resolve eligibility for local treatment.",
        "gate": {
          "cueAttack": "No meets-local-excision label is supplied. Actual dimensions, morphology, biopsy and imaging limits establish why the unresolved layer matters; all tests carry estimates.",
          "stage": "Three examinations before choosing local treatment.",
          "steps": [
            "Recognize that favorable size and histology still leave a consequential depth uncertainty.",
            "Use complementary wall-layer imaging rather than repeating the same limitation or systemic staging."
          ],
          "difficulty": "Moderate/hard prediction: normal nodes and a small lesion can lead to premature local excision, or repeat-MRI reflex.",
          "closestChoice": "mri",
          "decidingObservation": "MRI cannot separate submucosal from muscularis involvement in a small otherwise favorable lesion.",
          "consequence": "Premature local treatment or redundant staging.",
          "deletionTest": "Size, histology and access establish why local treatment is plausible; the unresolved layer changes it.",
          "counterfactual": "Document motion-degraded MRI with no diagnostic pelvic acquisition: a properly repeated MRI becomes appropriate.",
          "counterfactualChoice": "mri",
          "sequence": "First node; feedback does not reveal final excision pathology."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "eus"
      },
      {
        "slug": "t2-after-local-excision",
        "conceptId": "concept.topic.colorectal-polyps-cancer.t2-after-local-excision.v1",
        "title": "Completion treatment after unexpected T2 disease",
        "objective": "Use depth found after local excision to address untreated regional risk despite clear margins.",
        "update": "At a later clinic visit, the founder reviews the outside full-thickness excision. Cancer infiltrates the muscularis propria but stops before perirectal fat. All specimen edges are clear. Pelvic restaging shows no enlarged nodes or distant disease; he is fit for radical resection and has not received radiation.",
        "task": "Which next treatment plan should be discussed for {patientName}'s rectal cancer?",
        "choices": [
          {
            "id": "tme",
            "label": "Completion rectal resection with total mesorectal excision",
            "temptation": "Address disease outside the scope of local excision",
            "rationale": "Muscularis-propria invasion places the lesion beyond the favorable T1 local-excision group; clear wall edges do not stage mesorectal nodes.",
            "reasonableWhen": "An operable patient has T2 disease after local excision."
          },
          {
            "id": "scar",
            "label": "Repeat full-thickness transanal scar excision",
            "temptation": "Use more local clearance to solve regional risk",
            "rationale": "The local edges are already clear; another scar specimen does not remove the regional nodal basin.",
            "reasonableWhen": "A selected local-margin problem without a need for radical regional treatment.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "follow",
            "label": "Endoscopic rectal scar surveillance",
            "temptation": "Treat a clear margin and negative imaging as node-negative proof",
            "rationale": "Local clearance and imaging cannot settle microscopic mesorectal disease.",
            "reasonableWhen": "A favorable adequately assessed T1 lesion treated completely locally.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "rectal-t2-completion",
          "rectal-local-excision"
        ],
        "explanation": "The new pathology changes the relevant treatment scope. Clear local margins do not make a muscle-invasive rectal cancer adequately treated by local excision in a fit patient.",
        "gate": {
          "cueAttack": "No T2 label is supplied. The raw muscle boundary must be interpreted. Options compare three postexcision plans rather than information gathering against premature therapy.",
          "stage": "Three definitive postexcision plans.",
          "steps": [
            "Infer muscularis-propria invasion from the specimen.",
            "Address regional mesorectal risk that local excision cannot stage or treat."
          ],
          "difficulty": "Moderate/hard prediction: a clear local edge and CT-sized nodes may be mistaken for completed oncologic treatment.",
          "closestChoice": "scar",
          "decidingObservation": "Cancer infiltrates muscularis propria despite clear specimen edges.",
          "consequence": "Inadequate regional treatment.",
          "deletionTest": "Delete muscle invasion and favorable T1 surveillance may follow; the update therefore earns a new decision.",
          "counterfactual": "Change to a fully assessed favorable T1 lesion with clear edges: surveillance becomes best.",
          "counterfactualChoice": "follow",
          "sequence": "Prior EUS feedback identifies a staging question but gives no final-depth result or completion operation."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "tme"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "rectal-record-dates",
    "name": "Clara Morgan",
    "age": 62,
    "sex": "Female",
    "complaint": "Treatment response review",
    "presentation": "{patientName}, a 62-year-old woman, attends clinic after outside neoadjuvant treatment for rectal adenocarcinoma.",
    "nodes": [
      {
        "slug": "response-stale-mri",
        "conceptId": "concept.rectal-cancer.multimodal-response-assessment",
        "title": "Current multimodal rectal response assessment",
        "objective": "Reconcile the date and scope of response records before treatment decisions.",
        "update": "Treatment finished in July. September examination records a smooth flat scar without a nodule; September endoscopy shows a pale scar without ulceration. The attached rectal MRI is dated March and depicts the original tumor. September systemic staging shows no distant disease.",
        "task": "Which examination should complete {patientName}'s local post-treatment assessment?",
        "choices": [
          {
            "id": "mri",
            "label": "Current rectal-protocol pelvic MRI",
            "temptation": "Reconcile chronology across modalities",
            "rationale": "The attached local image is pretreatment and cannot establish current wall or nodal response.",
            "reasonableWhen": "Current rectal MRI has not been performed.",
            "timingProfileId": "timing.test.mri"
          },
          {
            "id": "scope",
            "label": "Repeat endoscopy with scar biopsy",
            "temptation": "Let a visible luminal scar substitute for wall assessment",
            "rationale": "Recent luminal assessment does not supply the missing post-treatment deep-wall and regional evaluation; negative biopsy would not establish eradication.",
            "reasonableWhen": "A new suspicious luminal focus may need tissue assessment.",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          },
          {
            "id": "pet",
            "label": "Whole-body FDG PET-CT",
            "temptation": "Repeat systemic staging to complete a local question",
            "rationale": "Distant restaging is current; PET does not replace the standard local combination.",
            "reasonableWhen": "A selected unresolved systemic target may justify PET.",
            "timingProfileId": "timing.test.pet_ct"
          }
        ],
        "claims": [
          "multimodal-response",
          "negative-response-biopsy"
        ],
        "explanation": "The dates matter. Current surface and examination findings cannot convert an old MRI into a post-treatment local assessment.",
        "gate": {
          "cueAttack": "Removed hopes-to-avoid-surgery and planned-response-visit assurances. All dates are constructed chronology, not a treatment-timing recommendation. Three tests have estimates.",
          "stage": "Three examinations to complete current local response assessment.",
          "steps": [
            "Identify that the packet mixes current surface findings with a pretreatment local image.",
            "Obtain the missing current local component instead of duplicating recent surface or systemic work."
          ],
          "difficulty": "Moderate prediction: a complete-looking transferred packet may be accepted without reading dates.",
          "closestChoice": "scope",
          "decidingObservation": "March local MRI predates July treatment completion.",
          "consequence": "Incorrect response classification from stale imaging.",
          "deletionTest": "Delete dates and the local adequacy problem cannot be solved; current systemic and luminal records delimit the remaining question.",
          "counterfactual": "Make the MRI current but show a new ulcerated mucosal focus not previously sampled: targeted endoscopic assessment becomes appropriate.",
          "counterfactualChoice": "scope",
          "sequence": "Standalone variant. No complete-response or watch-and-wait management is supplied."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "workup",
        "correctChoice": "mri"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "rectal-exported-series",
    "name": "Julia Reeves",
    "age": 59,
    "sex": "Female",
    "complaint": "Response records review",
    "presentation": "{patientName}, a 59-year-old woman, attends clinic while the founder reconciles a transferred rectal-cancer response packet.",
    "nodes": [
      {
        "slug": "response-acquired-not-exported",
        "conceptId": "concept.rectal-cancer.multimodal-response-assessment",
        "title": "Current multimodal rectal response assessment",
        "objective": "Reconcile the date and scope of response records before treatment decisions.",
        "update": "Examination and endoscopy after treatment show a flat smooth scar. The exported image viewer opens an older MRI. The outside acquisition log and final report document a later post-treatment rectal study with T2 and diffusion series; its images remain in the original hospital archive. The current report and surface assessments disagree about whether a small wall focus persists.",
        "task": "Which imaging plan should resolve {patientName}'s current response-record discrepancy first?",
        "choices": [
          {
            "id": "retrieve",
            "label": "Retrieve and review the completed post-treatment MRI",
            "temptation": "Distinguish absent export from absent acquisition",
            "rationale": "The appropriate current study was performed; reviewing its actual images addresses the discrepancy before repeating acquisition.",
            "reasonableWhen": "A suitable completed study is retrievable but absent from the transfer."
          },
          {
            "id": "repeat",
            "label": "Repeat rectal-protocol pelvic MRI",
            "temptation": "Treat a missing exported series as an unperformed study",
            "rationale": "No acquisition inadequacy is yet established; the completed current images should be reviewed first.",
            "reasonableWhen": "Current imaging is genuinely absent, inadequate or unavailable.",
            "timingProfileId": "timing.test.mri"
          },
          {
            "id": "eus",
            "label": "Obtain endorectal ultrasound",
            "temptation": "Replace a transfer problem with a different local modality",
            "rationale": "EUS does not resolve what the documented current rectal MRI actually showed.",
            "reasonableWhen": "An early primary T1-versus-T2 question may benefit from complementary EUS.",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        ],
        "claims": [
          "multimodal-response",
          "rectal-early-eus"
        ],
        "explanation": "A missing exported study is different from an unperformed study. Review the documented current acquisition before deciding that a new examination is needed.",
        "gate": {
          "cueAttack": "No statement says imaging is adequate; protocol and performed acquisition are factual records. Retrieval is not keyed by a named omission alone: current report/surface discordance makes review consequential. No wait estimate is assigned to existing-record retrieval.",
          "stage": "Three imaging-completion plans at the same discrepancy stage.",
          "steps": [
            "Distinguish the old exported image from the newer performed protocol study.",
            "Retrieve the actual current evidence before ordering duplicate or non-equivalent tests."
          ],
          "difficulty": "Moderate/hard prediction: missing-export and unperformed-acquisition errors recur in transferred oncology care.",
          "closestChoice": "repeat",
          "decidingObservation": "A current T2/diffusion study was performed and is archived despite an older exported viewer.",
          "consequence": "Redundant acquisition or a treatment decision based on the wrong study.",
          "deletionTest": "The log changes repeat versus retrieval; the response disagreement supplies a reason images matter rather than administrative trivia.",
          "counterfactual": "Remove the later acquisition from the log and confirm only pretreatment imaging exists: repeat current rectal MRI becomes best.",
          "counterfactualChoice": "repeat",
          "sequence": "Standalone; no treatment plan or eventual image interpretation is exposed."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "workup",
        "correctChoice": "retrieve"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "persistent-rectal-wall-focus",
    "name": "Amelia Grant",
    "age": 57,
    "sex": "Female",
    "complaint": "Rectal response consultation",
    "presentation": "{patientName}, a 57-year-old woman, attends clinic after outside neoadjuvant treatment for a previously node-positive low rectal adenocarcinoma.",
    "nodes": [
      {
        "slug": "residual-despite-negative-biopsy",
        "conceptId": "concept.rectal-cancer.selected-watch-and-wait",
        "title": "Select a rectal organ-preservation pathway",
        "objective": "Distinguish adequate clinical response from persistent tumor before offering watch-and-wait.",
        "update": "Treatment ended in July. In September, a firm mural nodule was palpable beneath intact mucosa; on a later October assessment it was larger. MRI shows a corresponding intermediate-T2 focus with diffusion restriction. Superficial biopsies contain scar and inflammation. Distant restaging is negative. She is fit for resection and remains interested in organ preservation.",
        "task": "Which treatment plan best fits {patientName}'s current rectal findings?",
        "choices": [
          {
            "id": "tme",
            "label": "Oncologic rectal resection with total mesorectal excision",
            "temptation": "Do not equate negative surface biopsy with wall eradication",
            "rationale": "Progressive concordant mural abnormalities are not a complete response; regional oncologic resection assessment is supported.",
            "reasonableWhen": "Persistent rectal tumor is present in an operable patient."
          },
          {
            "id": "local",
            "label": "Full-thickness transanal excision of the treated site",
            "temptation": "Use a local specimen to avoid regional treatment",
            "rationale": "The prior regional disease and persistent mural findings do not establish a favorable local-only treatment group.",
            "reasonableWhen": "Selected small favorable early tumors may be treated locally.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "watch",
            "label": "Protocolized watch-and-wait surveillance",
            "temptation": "Let preference and superficial histology overrule the response record",
            "rationale": "Interest in organ preservation does not convert progressive palpable/MRI disease into a complete clinical response.",
            "reasonableWhen": "Concordant clinical complete response after informed counseling in an experienced program.",
            "timingProfileId": "timing.test.rectal_response_assessment"
          }
        ],
        "claims": [
          "negative-response-biopsy",
          "clinical-complete-response",
          "selected-watch-wait",
          "rectal-local-excision"
        ],
        "explanation": "The biopsy describes the surface specimen. Progressive concordant mural findings defeat a complete-response conclusion despite that negative sample and her organ-preservation goal.",
        "gate": {
          "cueAttack": "No residual-tumor or incomplete-response label is supplied. The organ-preservation preference cannot select the key and is deliberately overruled by actual progression. No fixed timing threshold is taught.",
          "stage": "Three definitive post-neoadjuvant treatment strategies.",
          "steps": [
            "Reconcile superficial negative tissue with an enlarging palpable and diffusion-restricting wall focus.",
            "Decline the complete-response watch-and-wait pathway and address persistent oncologic disease."
          ],
          "difficulty": "Hard prediction: false-negative biopsy reassurance and preference anchoring compete with progression.",
          "closestChoice": "watch",
          "decidingObservation": "The palpable nodule enlarges and corresponds to a persistent restricting wall focus.",
          "consequence": "Observation of persistent tumor rather than timely oncologic treatment.",
          "deletionTest": "Without progression the owner-held near-complete boundary could recur; it is deliberately excluded. Surface provenance explains the negative biopsy.",
          "counterfactual": "Replace the mural findings with concordant smooth flat scar, no restricting focus and no suspicious nodes: informed protocolized watch-and-wait becomes a supported option.",
          "counterfactualChoice": "watch",
          "sequence": "Standalone. This is not the held shrinking equivocal ulcer at eight weeks; that version and clinical question remain held."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "tme"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "rectal-local-regrowth",
    "name": "Robert Hayes",
    "age": 65,
    "sex": "Male",
    "complaint": "Cancer surveillance review",
    "presentation": "{patientName}, a 65-year-old man, attends clinic while the founder reviews outside surveillance after a prior clinical complete response managed by watch-and-wait.",
    "nodes": [
      {
        "slug": "regrowth-salvage-resection",
        "conceptId": "concept.topic.colorectal-polyps-cancer.regrowth-salvage-resection.v1",
        "title": "Salvage assessment after rectal regrowth",
        "objective": "Use proven localized regrowth and depth to plan salvage rather than continue the old response pathway.",
        "update": "New endoscopy shows a nodule at the treated site; biopsy contains adenocarcinoma. MRI shows growth through the muscularis propria, with an achievable surgical plane. Chest and abdominal staging show no distant disease. He is fit for surgery after prior completed neoadjuvant therapy.",
        "task": "Which treatment plan should now be discussed for {patientName}'s rectal lesion?",
        "choices": [
          {
            "id": "salvage",
            "label": "Salvage rectal resection with total mesorectal excision",
            "temptation": "Update the plan from current proven disease",
            "rationale": "Localized operable regrowth with deep-wall involvement warrants oncologic salvage assessment.",
            "reasonableWhen": "Resectable regrowth is established after watch-and-wait."
          },
          {
            "id": "local",
            "label": "Transanal full-thickness nodule excision",
            "temptation": "Treat all small-looking luminal regrowth as local-only disease",
            "rationale": "The MRI demonstrates depth beyond a favorable early local-excision group.",
            "reasonableWhen": "Selected superficial favorable local lesions may permit a local approach.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "watch",
            "label": "Continue protocolized watch-and-wait surveillance",
            "temptation": "Carry the old complete-response conclusion forward",
            "rationale": "Biopsy-proven regrowth is not continued clinical complete response.",
            "reasonableWhen": "Current evaluation still demonstrates complete response without suspicious recurrence.",
            "timingProfileId": "timing.test.rectal_response_assessment"
          }
        ],
        "claims": [
          "regrowth-salvage",
          "rectal-t2-completion",
          "selected-watch-wait"
        ],
        "explanation": "A prior complete response is historical evidence, not permanent clearance. Proven localized regrowth changes the treatment objective to salvage.",
        "gate": {
          "cueAttack": "Known biopsy diagnosis is legitimate because the task is treatment. Raw depth and completed staging distinguish salvage scope; no invented recurrence probability appears.",
          "stage": "Three treatment plans for current localized regrowth.",
          "steps": [
            "Recognize that current pathology overrides the older complete response.",
            "Use depth and negative distant staging to choose regional oncologic salvage assessment."
          ],
          "difficulty": "Moderate/hard prediction: prior organ-preservation success and a small luminal nodule can favor insufficient local treatment.",
          "closestChoice": "local",
          "decidingObservation": "Biopsy-proven regrowth extends through muscularis propria without distant disease.",
          "consequence": "Delayed or inadequate salvage treatment.",
          "deletionTest": "Without depth, local salvage possibilities compete; without distant staging, the curative local plan is less secure.",
          "counterfactual": "Replace current nodule/biopsy/MRI findings with unchanged complete-response assessments: continued protocol surveillance becomes appropriate.",
          "counterfactualChoice": "watch",
          "sequence": "Independent case; no earlier newly authored explanation supplies salvage selection."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "salvage"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "upper-rectal-anatomy",
    "name": "Diane Foster",
    "age": 63,
    "sex": "Female",
    "complaint": "Rectal treatment planning",
    "presentation": "{patientName}, a 63-year-old woman, attends clinic after outside rectal-cancer staging.",
    "nodes": [
      {
        "slug": "above-reflection-sequence",
        "conceptId": "concept.topic.colorectal-polyps-cancer.above-reflection-sequence.v1",
        "title": "Upper-rectal treatment sequence",
        "objective": "Use patient-specific peritoneal-reflection anatomy rather than a fixed endoscopic distance to select sequence.",
        "update": "MRI places the entire tumor above the anterior peritoneal reflection. It extends slightly beyond muscle with a clear surrounding surgical plane, no involved adjacent organ, no suspicious nodes and no extramural vascular invasion. Distant staging is negative, mismatch-repair proteins are retained and she is fit for resection.",
        "task": "Which treatment sequence is most appropriate to discuss for {patientName}'s represented disease?",
        "choices": [
          {
            "id": "surgery",
            "label": "Initial oncologic resection followed by pathology-directed therapy",
            "temptation": "Use anatomy and local-risk features together",
            "rationale": "The entirely upper-rectal location without the supplied high-risk exceptions supports initial resection rather than routine pelvic radiation.",
            "reasonableWhen": "Upper-rectal tumor with clear local planes and no modifying high-risk feature."
          },
          {
            "id": "tnt",
            "label": "Total neoadjuvant therapy followed by rectal resection",
            "temptation": "Apply a mid/low rectal pathway to every rectal label",
            "rationale": "The anatomic relationship and risk record do not establish routine benefit from that sequence here.",
            "reasonableWhen": "Stage II/III mid or low rectal disease, especially threatened planes."
          },
          {
            "id": "local",
            "label": "Transanal local excision followed by surveillance",
            "temptation": "Treat absence of suspicious nodes as an early local lesion",
            "rationale": "The extramuscular extension excludes favorable T1 local treatment.",
            "reasonableWhen": "A small favorable cT1N0 tumor accessible transanally."
          }
        ],
        "claims": [
          "upper-rectal-initial-resection",
          "rectal-tnt",
          "rectal-local-excision"
        ],
        "explanation": "The anterior peritoneal reflection is patient-specific anatomy. This upper-rectal record supports initial resection; the recommendation is conditional and does not generalize to threatened fascia or adjacent-organ invasion.",
        "gate": {
          "cueAttack": "No upper-rectal diagnosis or surgery-first phrase supplies the interpretation. Necessary local-risk negatives remain because they delimit the conditional recommendation.",
          "stage": "Three curative-intent treatment sequences.",
          "steps": [
            "Interpret the tumor relative to the anterior peritoneal reflection and identify the absence of modifying local risks.",
            "Apply the upper-rectal rather than mid/low multimodal pathway."
          ],
          "difficulty": "Hard prediction: a generic rectal-cancer label may trigger automatic neoadjuvant radiation despite the anatomy.",
          "closestChoice": "tnt",
          "decidingObservation": "Entire tumor above the reflection with clear planes and no high-risk extension.",
          "consequence": "Unnecessary treatment or inappropriate generalization of surgery-first to high-risk disease.",
          "deletionTest": "Anatomy changes the pathway; the listed risk observations prevent an unsupported universal rule.",
          "counterfactual": "Move the tumor below the reflection and add threatened mesorectal fascia: total neoadjuvant therapy becomes best.",
          "counterfactualChoice": "tnt",
          "sequence": "Standalone; this does not reuse the earlier high-risk case or teach the answer before its decision."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "surgery"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "colon-adjacent-organ",
    "name": "Felix Turner",
    "age": 68,
    "sex": "Male",
    "complaint": "Colon operation planning",
    "presentation": "{patientName}, a 68-year-old man, attends clinic after an outside diagnostic laparoscopy was stopped to arrange colorectal and urologic surgery.",
    "nodes": [
      {
        "slug": "adherent-bladder-en-bloc",
        "conceptId": "concept.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v1",
        "title": "En-bloc planning for an adherent colon tumor",
        "objective": "Preserve the tumor interface when planning curative resection of a colon cancer adherent to bladder.",
        "update": "Biopsy confirms sigmoid adenocarcinoma. Distant staging is negative. The operative record describes a short firm attachment between tumor and bladder dome, with otherwise separable planes and no peritoneal deposits. He is fit for curative surgery; the attachment was not divided.",
        "task": "Which operative plan should be discussed for {patientName}'s represented anatomy?",
        "choices": [
          {
            "id": "enbloc",
            "label": "Sigmoid colectomy with en-bloc involved bladder-dome resection",
            "temptation": "Preserve a potentially involved tumor interface",
            "rationale": "An adherent interface may contain cancer; en-bloc margin-negative resection avoids separating through it.",
            "reasonableWhen": "Resectable colon cancer adheres to an adjacent organ and curative resection is intended."
          },
          {
            "id": "peel",
            "label": "Sigmoid colectomy after separating the bladder attachment",
            "temptation": "Assume adhesion is inflammatory until proven otherwise",
            "rationale": "Peeling the attachment risks violating a malignant interface.",
            "reasonableWhen": "A clearly separate non-tumor plane between organs does not require adjacent-organ resection."
          },
          {
            "id": "sample",
            "label": "Sigmoid colectomy after sampling and dividing the attachment",
            "temptation": "Use a small interface sample to authorize separation",
            "rationale": "A sampled negative cannot make division of an adherent tumor interface oncologically equivalent to en-bloc removal.",
            "reasonableWhen": "A separate suspicious lesion outside the intended curative interface may require diagnostic sampling."
          }
        ],
        "claims": [
          "en-bloc-adherence"
        ],
        "explanation": "Adherence is not pathological proof of bladder invasion, but curative operative planning must preserve the potentially involved interface. The exact bladder extent depends on anatomy.",
        "gate": {
          "cueAttack": "No T4b diagnosis is supplied. The attachment is an operative observation, not permission to select a named procedure. Three complete operative strategies compare treatment of the same interface.",
          "stage": "Three curative resection strategies.",
          "steps": [
            "Recognize that a firm tumor attachment cannot safely be classified as benign by appearance or a small sample.",
            "Plan en-bloc clearance rather than divide a potentially malignant plane."
          ],
          "difficulty": "Moderate/hard prediction: tissue-preserving peeling or frozen-section reassurance may tempt an otherwise prepared surgeon.",
          "closestChoice": "sample",
          "decidingObservation": "Firm tumor-to-bladder attachment with curative resectability and no divided plane.",
          "consequence": "Tumor violation or compromised local margins.",
          "deletionTest": "Curative intent and attachment determine the plan; no deposits and operative fitness delimit the setting.",
          "counterfactual": "Replace the attachment with a documented intact freely separable plane: standard colectomy with bladder preservation becomes reasonable.",
          "counterfactualChoice": "peel",
          "sequence": "Retrospective clinic planning after stopped outside laparoscopy; no operation occurs in this clinic."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "enbloc"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "colon-postoperative-pathology",
    "name": "Irene Wells",
    "age": 67,
    "sex": "Female",
    "complaint": "Resection pathology review",
    "presentation": "{patientName}, a 67-year-old woman, attends clinic after an outside sigmoid colectomy.",
    "nodes": [
      {
        "slug": "few-nodes-specimen-reassessment",
        "conceptId": "concept.topic.colorectal-polyps-cancer.few-nodes-specimen-reassessment.v1",
        "title": "Reassess a low node yield",
        "objective": "Distinguish negative sampled nodes from an adequate pathologic regional assessment.",
        "update": "The tumor extends through muscularis propria into pericolic fat; margins are clear. The report lists five negative lymph nodes. Preoperative chest and abdominal/pelvic staging showed no metastases. The remaining mesenteric specimen is retained by pathology.",
        "task": "Which investigation should next improve {patientName}'s postoperative regional-stage assessment?",
        "choices": [
          {
            "id": "path",
            "label": "Additional node retrieval from the retained specimen",
            "temptation": "Separate observed negatives from staging adequacy",
            "rationale": "Request further pathology processing when fewer than 12 nodes were reported before relying on the node-negative assessment.",
            "reasonableWhen": "An available colon-resection specimen has an inadequate reported node count.",
            "timingProfileId": "timing.test.pathology_review"
          },
          {
            "id": "pet",
            "label": "Postoperative FDG PET-CT of regional nodal basins",
            "temptation": "Use imaging to replace microscopic staging",
            "rationale": "Negative imaging cannot supply the additional regional pathology needed from the submitted specimen.",
            "reasonableWhen": "A selected unresolved systemic or recurrent focus can warrant PET review.",
            "timingProfileId": "timing.test.pet_ct"
          },
          {
            "id": "mri",
            "label": "Pelvic MRI of the remaining mesentery",
            "temptation": "Translate rectal local staging into colon specimen staging",
            "rationale": "Imaging the remaining pelvis does not improve the sampled microscopic assessment of the removed regional tissue.",
            "reasonableWhen": "A rectal primary may need mesorectal-plane assessment.",
            "timingProfileId": "timing.test.mri"
          }
        ],
        "claims": [
          "node-retrieval",
          "rectal-mri-staging"
        ],
        "explanation": "Five observed negative nodes do not provide the same confidence as an adequately examined regional specimen. Request further retrieval from the retained material.",
        "gate": {
          "cueAttack": "The stem does not say inadequate staging or name the missing action. Three specific investigations have timing metadata. The retained specimen is relevant provenance, not convenience permission.",
          "stage": "Three investigations aimed at postoperative regional assessment.",
          "steps": [
            "Interpret the low count separately from the negative findings and prior CT.",
            "Use available resection tissue rather than substitute another image for microscopic regional assessment."
          ],
          "difficulty": "Moderate prediction: all nodes negative plus negative CT can falsely settle regional status.",
          "closestChoice": "pet",
          "decidingObservation": "Only five nodes were examined and mesenteric tissue remains available.",
          "consequence": "Understaging and an inadequately informed postoperative plan.",
          "deletionTest": "Count creates inadequacy; availability identifies the useful existing specimen rather than an invented reoperation.",
          "counterfactual": "Change the record to an adequate node assessment but a newly indeterminate extra-regional focus: a targeted imaging pathway could become appropriate.",
          "counterfactualChoice": "pet",
          "sequence": "First node; feedback does not reveal what additional pathology will show."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "path"
      },
      {
        "slug": "deposit-with-negative-nodes",
        "conceptId": "concept.topic.colorectal-polyps-cancer.deposit-with-negative-nodes.v1",
        "title": "Postoperative planning with a tumor deposit",
        "objective": "Recognize regional disease from a confirmed tumor deposit despite negative recovered nodes.",
        "update": "Additional pathology finds a total of 15 negative nodes. A separate pericolic nodule contains discontinuous adenocarcinoma; the pathologist confirms a tumor deposit rather than residual lymph-node, vessel or nerve tissue. Margins remain clear, distant staging is negative, mismatch-repair proteins are retained and she has recovered sufficiently for adjuvant treatment assessment.",
        "task": "Which postoperative plan should be discussed for {patientName}'s updated pathology?",
        "choices": [
          {
            "id": "adjuvant",
            "label": "Adjuvant FOLFOX planning with medical oncology",
            "temptation": "Classify the regional deposit before selecting intent",
            "rationale": "A confirmed pericolic deposit can establish regional N1c disease despite negative nodes, supporting adjuvant systemic treatment assessment.",
            "reasonableWhen": "Completely resected nonmetastatic colon cancer has regional disease."
          },
          {
            "id": "surveillance",
            "label": "Surveillance after node-negative colectomy",
            "temptation": "Count negative nodes and ignore the separate deposit",
            "rationale": "The adequate negative-node count does not erase deposit-defined regional involvement.",
            "reasonableWhen": "A completely resected lower-risk node-negative tumor may enter surveillance."
          },
          {
            "id": "radiation",
            "label": "Adjuvant pelvic chemoradiation planning",
            "temptation": "Apply a rectal local-control pathway to a colon deposit",
            "rationale": "This is a sigmoid-colon regional pathology problem, not an indication for routine pelvic radiation.",
            "reasonableWhen": "Selected rectal-cancer local-control pathways can include pelvic chemoradiation."
          }
        ],
        "claims": [
          "tumor-deposit-regional",
          "stage-three-adjuvant"
        ],
        "explanation": "A confirmed tumor deposit is not canceled by an adequate set of negative nodes. Interpret it as regional disease before discussing adjuvant systemic treatment; regimen details remain individualized.",
        "gate": {
          "cueAttack": "No stage III label appears. The pathologist-confirmed tissue category is legitimate data because treatment is scored; no invented nodule classification is inferred by the author. Options are postoperative treatment strategies.",
          "stage": "Three postoperative oncology plans.",
          "steps": [
            "Interpret a discontinuous confirmed pericolic deposit despite negative nodes.",
            "Apply the regional-disease treatment pathway rather than a node-count-only conclusion."
          ],
          "difficulty": "Hard prediction: an adequate negative-node count can distract from N1c disease.",
          "closestChoice": "surveillance",
          "decidingObservation": "Confirmed discontinuous pericolic tumor deposit with no distant disease.",
          "consequence": "Omission of an indicated adjuvant treatment discussion.",
          "deletionTest": "The deposit changes treatment; without it the new adequate node-negative report could support surveillance depending on other risks.",
          "counterfactual": "Remove the deposit and all high-risk features from an adequately staged completely resected tumor: surveillance becomes a reasonable offered plan.",
          "counterfactualChoice": "surveillance",
          "sequence": "Earlier feedback requests an adequate node search but does not state deposit classification or adjuvant therapy."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "adjuvant"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "metastatic-primary-strategy",
    "name": "Martin Shaw",
    "age": 70,
    "sex": "Male",
    "complaint": "Cancer treatment review",
    "presentation": "{patientName}, a 70-year-old man, attends clinic while the founder reviews outside multidisciplinary records for sigmoid adenocarcinoma with metastases.",
    "nodes": [
      {
        "slug": "asymptomatic-incurable-primary",
        "conceptId": "concept.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v1",
        "title": "Initial treatment of an asymptomatic metastatic primary",
        "objective": "Distinguish symptom control from prophylactic primary resection when distant disease is not curatively resectable.",
        "update": "The outside team documents diffuse bilobar liver and pulmonary metastases not amenable to curative local treatment. The sigmoid lumen remains patent. He is eating and passing stool without bleeding, pain or transfusion need, and is fit for systemic treatment.",
        "task": "Which initial treatment strategy best fits {patientName}'s current record?",
        "choices": [
          {
            "id": "systemic",
            "label": "Medical-oncology systemic treatment planning",
            "temptation": "Let metastatic disease determine initial treatment",
            "rationale": "An asymptomatic primary with incurable metastatic disease generally favors systemic treatment rather than prophylactic colectomy.",
            "reasonableWhen": "Incurable metastatic disease with no primary-related complication."
          },
          {
            "id": "colectomy",
            "label": "Oncologic sigmoid colectomy before systemic treatment",
            "temptation": "Prevent a hypothetical primary complication with immediate surgery",
            "rationale": "No current primary symptom establishes a reason to delay systemic treatment for prophylactic resection.",
            "reasonableWhen": "A primary-related complication or a curative multimodality strategy can change sequencing."
          },
          {
            "id": "stent",
            "label": "Endoscopic sigmoid stent placement before systemic treatment",
            "temptation": "Treat the presence of a luminal tumor as obstruction",
            "rationale": "The lumen is patent and there is no obstructive syndrome to palliate.",
            "reasonableWhen": "Malignant obstruction without perforation may warrant stenting in a suitable pathway.",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        ],
        "claims": [
          "asymptomatic-stage-four",
          "perforated-cancer"
        ],
        "explanation": "The primary is not currently causing a complication. Systemic treatment addresses the dominant unresectable disease; prophylactic colectomy or stenting is not established by the diagnosis alone.",
        "gate": {
          "cueAttack": "No asymptomatic-primary label substitutes for the symptom and patency record. All choices are specific initial strategies. Metastatic unresectability is an outside multidisciplinary conclusion, not a guessed image interpretation.",
          "stage": "Three initial treatment strategies.",
          "steps": [
            "Recognize incurable distant distribution without a current primary-related complication.",
            "Prioritize systemic treatment instead of prophylactic local intervention."
          ],
          "difficulty": "Moderate prediction: resect-the-primary-first is a credible surgical default even when no curative or symptom-control benefit is established.",
          "closestChoice": "colectomy",
          "decidingObservation": "Patent lumen, no primary symptoms and incurable metastatic disease.",
          "consequence": "Delay or morbidity from unnecessary prophylactic intervention.",
          "deletionTest": "Metastatic resectability and symptom status both change the sequence; no irrelevant performance numbers are supplied.",
          "counterfactual": "Add a perforation through the primary: local surgical source-control assessment becomes necessary before ordinary systemic sequencing.",
          "counterfactualChoice": "colectomy",
          "sequence": "First node; explanation does not describe a later complication."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "systemic"
      },
      {
        "slug": "perforation-overrides-systemic-first",
        "conceptId": "concept.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v1",
        "title": "Source control for a perforated primary",
        "objective": "Use a new outside-hospital complication to revise a previously appropriate systemic-first strategy.",
        "update": "At a later clinic chart-review visit, the founder reviews an intervening outside admission. CT showed free gas and fluid arising from the sigmoid tumor; examination documented diffuse peritoneal tenderness. The hospital team has begun resuscitation and antibiotics and is arranging definitive source control. These events occurred at that hospital, not in the clinic.",
        "task": "Which definitive local plan best fits {patientName}'s outside admission findings?",
        "choices": [
          {
            "id": "resect",
            "label": "Oncologic tumor resection with a staged reconstruction plan",
            "temptation": "Let actual perforation change the immediate objective",
            "rationale": "Perforated cancer with peritonitis needs surgical source-control planning; staging of reconstruction depends on physiology and contamination.",
            "reasonableWhen": "A perforated colon primary needs operative source control."
          },
          {
            "id": "stent",
            "label": "Endoluminal stenting across the sigmoid tumor",
            "temptation": "Carry an obstruction-palliation option into perforation",
            "rationale": "Perforation contraindicates endoluminal stenting.",
            "reasonableWhen": "An obstructed but nonperforated primary may be considered for stent decompression.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "systemic",
            "label": "Systemic treatment after the initial antibiotic course",
            "temptation": "Carry forward the earlier systemic-first strategy",
            "rationale": "The former no-complication premise no longer applies; antibiotics do not replace source-control assessment in this record.",
            "reasonableWhen": "An asymptomatic incurable primary without perforation or another local complication."
          }
        ],
        "claims": [
          "perforated-cancer",
          "asymptomatic-stage-four"
        ],
        "explanation": "The earlier strategy was appropriate to an uncomplicated primary. A new perforation changes the current objective to source control; the clinic reviews the hospital plan rather than delivering emergency surgery.",
        "gate": {
          "cueAttack": "All options are definitive local/systemic strategies after common resuscitation, rather than resuscitation competing with treatment. Hospital acuity is separate from the stable clinic review.",
          "stage": "Three definitive strategies after initial hospital stabilization.",
          "steps": [
            "Interpret extraluminal gas/fluid at the primary with peritonitis as perforation.",
            "Override the old asymptomatic-primary pathway and avoid a stent in a perforated setting."
          ],
          "difficulty": "Moderate/hard prediction: previously correct systemic-first or obstruction-palliation reasoning can be applied after its premise changes.",
          "closestChoice": "stent",
          "decidingObservation": "Free gas/fluid from the tumor plus diffuse peritoneal tenderness.",
          "consequence": "Failure of source control or inappropriate stenting.",
          "deletionTest": "Removing the new findings restores the earlier systemic strategy; this update earns a distinct consequential decision.",
          "counterfactual": "Replace free gas/peritonitis with obstruction without perforation: stent palliation becomes a reasonable option after specialist assessment.",
          "counterfactualChoice": "stent",
          "sequence": "Prior feedback concerns an uncomplicated primary only. The hospital records are a later reveal; no in-clinic admission or emergency execution is implied."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "resect"
      }
    ],
    "historicalAcuity": "obvious_emergency"
  },
  {
    "slug": "serrated-specimen-map",
    "name": "Nora Ellis",
    "age": 56,
    "sex": "Female",
    "complaint": "Polyp surveillance planning",
    "presentation": "{patientName}, a 56-year-old woman, attends clinic to reconcile outside polypectomy records.",
    "nodes": [
      {
        "slug": "serrated-dysplasia-surveillance",
        "conceptId": "concept.topic.colorectal-polyps-cancer.serrated-dysplasia-surveillance.v1",
        "title": "Surveillance after serrated dysplasia",
        "objective": "Use the correct specimen, dysplasia and complete-resection record to select USMSTF surveillance.",
        "update": "The examination was complete and adequately prepared. Container A from a 4-mm sigmoid lesion contains a hyperplastic polyp. Container B from a 9-mm ascending-colon lesion contains a sessile serrated lesion with focal dysplasia. Both were removed intact with complete excision documented. She has no prior colorectal neoplasia, relevant family history or hereditary syndrome.",
        "task": "Under USMSTF guidance, when should {patientName}'s next surveillance colonoscopy be planned?",
        "choices": [
          {
            "id": "three",
            "label": "Colonoscopy in three years",
            "temptation": "Use the dysplastic serrated specimen rather than the small distal polyp",
            "rationale": "Dysplasia changes the surveillance category despite the proximal lesion being smaller than 10 mm.",
            "reasonableWhen": "A sessile serrated lesion with dysplasia has been confidently completely removed.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "long",
            "label": "Colonoscopy in five to ten years",
            "temptation": "Use the interval for a small nondysplastic serrated lesion",
            "rationale": "That interval does not incorporate the focal dysplasia in the actual specimen.",
            "reasonableWhen": "One or two small sessile serrated lesions without dysplasia after complete high-quality resection.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "six",
            "label": "Colonoscopy in six months",
            "temptation": "Treat any dysplasia as large-piecemeal residual risk",
            "rationale": "The lesions were small and removed intact, not a large piecemeal resection.",
            "reasonableWhen": "A lesion at least 20 mm was removed piecemeal.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "serrated-dysplasia-surveillance",
          "piecemeal-surveillance"
        ],
        "explanation": "Map each specimen to the correct lesion and integrate dysplasia rather than size alone. The completely removed dysplastic serrated lesion supports the three-year USMSTF interval.",
        "gate": {
          "cueAttack": "All choices are colonoscopy intervals. The small distal benign specimen creates a provenance error; focal dysplasia is legitimate management data rather than a supplied surveillance conclusion.",
          "stage": "Three next-colonoscopy intervals.",
          "steps": [
            "Identify the proximal dysplastic serrated lesion as the consequential finding instead of the distal hyperplastic sample.",
            "Use histology and removal completeness to select surveillance rather than size-only or piecemeal rules."
          ],
          "difficulty": "Moderate/hard prediction: small size or the first container label may overshadow focal serrated dysplasia.",
          "closestChoice": "long",
          "decidingObservation": "Focal dysplasia in the intact 9-mm ascending-colon serrated lesion.",
          "consequence": "Delayed surveillance or unnecessary early scar checking.",
          "deletionTest": "Both specimen location and dysplasia matter; complete removal excludes an unresolved resection problem.",
          "counterfactual": "Remove dysplasia from the single small serrated lesion: five-to-ten-year surveillance becomes the appropriate offered interval.",
          "counterfactualChoice": "long",
          "sequence": "Standalone; no prior surveillance explanation supplies the category."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "three"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "serial-surveillance",
    "name": "George Sutton",
    "age": 68,
    "sex": "Male",
    "complaint": "Surveillance interval review",
    "presentation": "{patientName}, a 68-year-old man, attends clinic with records from two outside colonoscopies.",
    "nodes": [
      {
        "slug": "advanced-baseline-normal-surveillance",
        "conceptId": "concept.topic.colorectal-polyps-cancer.serial-adenoma-surveillance.v1",
        "title": "Integrate baseline and first surveillance",
        "objective": "Choose USMSTF second-surveillance timing from both the baseline adenoma and the first follow-up.",
        "update": "At baseline, a 14-mm tubular adenoma was completely removed in one piece during a high-quality examination. The first surveillance colonoscopy was also complete and adequately prepared and found no adenoma or serrated lesion. He has no prior cancer, hereditary syndrome or relevant family history.",
        "task": "Under USMSTF guidance, when should {patientName}'s next colonoscopy be planned after this normal first surveillance examination?",
        "choices": [
          {
            "id": "five",
            "label": "Colonoscopy in five years",
            "temptation": "Combine the baseline and first-surveillance findings",
            "rationale": "A normal first surveillance examination after an advanced baseline adenoma supports a five-year next interval.",
            "reasonableWhen": "Advanced adenoma at baseline followed by a normal high-quality first surveillance.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "three",
            "label": "Colonoscopy in three years",
            "temptation": "Repeat the baseline advanced-adenoma interval unchanged",
            "rationale": "The normal first surveillance modifies the next interval.",
            "reasonableWhen": "Advanced adenoma or another corresponding higher-risk finding persists at first surveillance.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "ten",
            "label": "Colonoscopy in ten years",
            "temptation": "Erase baseline risk after one normal follow-up",
            "rationale": "The advanced baseline finding continues to matter when selecting the next interval.",
            "reasonableWhen": "A low-risk baseline followed by normal first surveillance can support a longer interval.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "serial-adenoma-surveillance",
          "advanced-adenoma-surveillance"
        ],
        "explanation": "Second-surveillance planning uses two examinations. A normal first follow-up modifies, but does not erase, the advanced baseline adenoma history.",
        "gate": {
          "cueAttack": "Neither title nor complaint calls the baseline advanced. All options use identical investigation grammar; the stem asks a specific surveillance stage.",
          "stage": "Three second-surveillance intervals.",
          "steps": [
            "Classify the size-defined baseline adenoma and the quality/normal result of first surveillance.",
            "Apply the serial rather than baseline-only or latest-exam-only recommendation."
          ],
          "difficulty": "Hard prediction: each single-examination shortcut points to a different credible wrong interval.",
          "closestChoice": "ten",
          "decidingObservation": "A 14-mm baseline adenoma followed by normal high-quality first surveillance.",
          "consequence": "Over- or under-surveillance from ignoring one examination.",
          "deletionTest": "Delete either examination and the five-year serial recommendation is no longer established; no ornamental chronology is added.",
          "counterfactual": "Replace the first surveillance result with a new advanced adenoma: three years becomes the appropriate offered interval.",
          "counterfactualChoice": "three",
          "sequence": "Standalone; this is not merely another surface variant of the first-surveillance rule."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "five"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "adenoma-fragment-count",
    "name": "Joan Miller",
    "age": 63,
    "sex": "Female",
    "complaint": "Polyp count review",
    "presentation": "{patientName}, a 63-year-old woman, attends clinic to reconcile an outside colonoscopy report and pathology fragment count.",
    "nodes": [
      {
        "slug": "lesions-not-fragments",
        "conceptId": "concept.topic.colorectal-polyps-cancer.lesions-not-fragments.v1",
        "title": "Count adenomas by lesions rather than fragments",
        "objective": "Use the actual number of removed lesions and the assessed histology to select surveillance.",
        "update": "The complete, adequately prepared procedure log records two polyps, 6 mm and 8 mm, each removed completely and placed together in one container. The laboratory describes four tissue fragments of tubular adenoma without advanced features. No other lesions, previous neoplasia, hereditary syndrome or relevant family history are recorded.",
        "task": "Under USMSTF guidance, when should {patientName}'s surveillance colonoscopy be planned?",
        "choices": [
          {
            "id": "long",
            "label": "Colonoscopy in seven to ten years",
            "temptation": "Reconcile the procedure count with specimen fragmentation",
            "rationale": "Two small completely removed nonadvanced adenomas remain two lesions despite four laboratory fragments.",
            "reasonableWhen": "One or two small nonadvanced tubular adenomas at a high-quality baseline.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "middle",
            "label": "Colonoscopy in three to five years",
            "temptation": "Count tissue fragments as separate adenomas",
            "rationale": "The procedure documented two lesions; four fragments do not establish four adenomas.",
            "reasonableWhen": "Three or four small tubular adenomas were actually removed.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "short",
            "label": "Colonoscopy in three years",
            "temptation": "Treat any multiple-fragment adenoma jar as high-burden disease",
            "rationale": "Neither five-to-ten actual adenomas nor an advanced feature is established.",
            "reasonableWhen": "Five to ten small adenomas or an advanced adenoma is found.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "small-adenoma-surveillance",
          "three-four-adenomas-surveillance",
          "five-ten-adenomas-surveillance"
        ],
        "explanation": "Use lesion-level procedural provenance rather than fragment count. The two small nonadvanced adenomas support the USMSTF seven-to-ten-year interval.",
        "gate": {
          "cueAttack": "No low-risk-count label is supplied. Procedure sites and laboratory fragments must be reconciled. Three parallel interval options carry identical colonoscopy preview scope.",
          "stage": "Three first-surveillance intervals.",
          "steps": [
            "Infer that four fragments from one jar do not establish four removed lesions.",
            "Apply the actual two-lesion count and nonadvanced histology to the surveillance interval."
          ],
          "difficulty": "Hard prediction: fragment counting produces a specifically plausible three-to-five-year error.",
          "closestChoice": "middle",
          "decidingObservation": "Two documented lesions versus four fragments in the shared pathology container.",
          "consequence": "Unnecessary surveillance from a falsely inflated adenoma count.",
          "deletionTest": "Without the procedure count the jar cannot establish lesion number; size and histology keep the low-count rule applicable.",
          "counterfactual": "Replace the procedure log with four separate completely removed small adenomas: three-to-five years becomes best.",
          "counterfactualChoice": "middle",
          "sequence": "Standalone; this is a provenance-to-management decision, not a cosmetic size variant."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "long"
      }
    ],
    "historicalAcuity": "stable"
  },
  {
    "slug": "rectal-diffusion-quality",
    "name": "Vincent Reed",
    "age": 60,
    "sex": "Male",
    "complaint": "Response imaging review",
    "presentation": "{patientName}, a 60-year-old man, attends clinic after outside neoadjuvant rectal-cancer treatment.",
    "nodes": [
      {
        "slug": "response-nondiagnostic-diffusion",
        "conceptId": "concept.rectal-cancer.multimodal-response-assessment",
        "title": "Current multimodal rectal response assessment",
        "objective": "Reconcile the date and scope of response records before treatment decisions.",
        "update": "Current examination and endoscopy describe a smooth flat scar without a nodule. T2 MRI images show a dark scar, but the post-treatment diffusion series is distorted at the tumor bed by artifact and is reported as nondiagnostic there. The transferred summary labels the overall response complete. No diagnostic diffusion series exists in the archive and distant restaging is negative.",
        "task": "Which local imaging plan should resolve {patientName}'s remaining response-assessment limitation?",
        "choices": [
          {
            "id": "repeat",
            "label": "Repeat rectal MRI with diagnostic T2 and diffusion acquisition",
            "temptation": "Separate a reassuring component from an incomplete protocol",
            "rationale": "The current diffusion component cannot assess the treated bed; repeat an adequate local protocol before relying on the summary.",
            "reasonableWhen": "A necessary current MRI component is genuinely nondiagnostic and cannot be retrieved.",
            "timingProfileId": "timing.test.mri"
          },
          {
            "id": "retrieve",
            "label": "Retrieve the archived diffusion series for review",
            "temptation": "Treat all transfer limitations as missing exports",
            "rationale": "The archive has no diagnostic diffusion acquisition; retrieval cannot improve a series that was nondiagnostic when performed.",
            "reasonableWhen": "A suitable performed study exists but was not exported."
          },
          {
            "id": "pet",
            "label": "Obtain whole-body FDG PET-CT for response assessment",
            "temptation": "Replace a deficient local protocol with metabolic imaging",
            "rationale": "PET does not supply the standard local combination or repair the artifact-limited MRI component.",
            "reasonableWhen": "A separate unresolved systemic target may justify PET.",
            "timingProfileId": "timing.test.pet_ct"
          }
        ],
        "claims": [
          "multimodal-response",
          "response-mri-sequences",
          "clinical-complete-response"
        ],
        "explanation": "A complete-response summary does not override an artifact-limited acquisition. Distinguish missing exports from genuinely nondiagnostic imaging before choosing retrieval or repeat acquisition.",
        "gate": {
          "cueAttack": "The report uses the actual artifact and diagnostic-scope observations rather than an author-authored eligibility label. The complete-response summary is a competing conclusion, not the answer. Test previews cover repeat MRI and PET; record retrieval is not a new test.",
          "stage": "Three local imaging-completion plans.",
          "steps": [
            "Determine that a dark T2 scar does not establish the missing diffusion observation and that this is an acquisition limitation.",
            "Repeat a diagnostic local protocol instead of retrieving nonexistent adequate images or substituting systemic imaging."
          ],
          "difficulty": "Hard prediction: a reassuring summary or a learned retrieve-before-repeat rule can override actual acquisition quality.",
          "closestChoice": "retrieve",
          "decidingObservation": "The diffusion series is nondiagnostic at the tumor bed and no adequate acquired series exists.",
          "consequence": "Incorrect response classification or futile retrieval.",
          "deletionTest": "The actual acquisition limitation distinguishes this from the earlier missing-export variant; T2 and surface findings create real reassurance.",
          "counterfactual": "Change the log to a diagnostic completed diffusion series omitted from the transfer: retrieving it becomes best.",
          "counterfactualChoice": "retrieve",
          "sequence": "Separate variant of the stable multimodal-response concept. It is not paired with the missing-export variant, so that feedback cannot dictate this choice."
        },
        "creationKind": "new",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "workup",
        "correctChoice": "repeat"
      }
    ],
    "historicalAcuity": "stable"
  }
];

export const CPC_REVISION_ITEMS: CPCCaseDraft[] = [
  {
    "slug": "positive-fit-negative-repeat-r2",
    "name": "Henry Wallace",
    "age": 58,
    "sex": "Male",
    "complaint": "Stool test review",
    "presentation": "{patientName}, a 58-year-old man, attends clinic to reconcile outside colorectal screening results.",
    "nodes": [
      {
        "slug": "positive-fit-negative-repeat",
        "conceptId": "concept.colorectal.positive-fit-colonoscopy",
        "title": "Complete abnormal stool screening",
        "objective": "Select diagnostic colonoscopy after an abnormal FIT despite a later negative repeat.",
        "update": "The August screening FIT was positive and a September repeat was negative. An October colonoscopy reached the cecum and found no lesion. Its withdrawal record describes adherent stool covering much of the ascending and transverse mucosa after irrigation and suction; the distal mucosa was visible. The summary calls the colonoscopy negative.",
        "task": "Which next colorectal investigation should be arranged for {patientName} after these outside results?",
        "choices": [
          {
            "id": "scope",
            "label": "Repeat colonoscopy with a revised preparation plan",
            "temptation": "Accept the latest label only after checking what was actually examined.",
            "rationale": "The proximal mucosa was not adequately evaluated. The positive FIT still needs a complete diagnostic colonoscopy despite the repeat FIT and negative summary.",
            "reasonableWhen": "A positive stool screen is followed by a colonoscopy whose mucosal visualization remains inadequate.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "ctc",
            "label": "CT colonography with a colonic preparation plan",
            "temptation": "Use an alternative complete-colon investigation after an incomplete report.",
            "rationale": "The record describes a preparation problem, not an anatomic barrier or contraindication to repeating colonoscopy; colonoscopy can also sample or remove a lesion.",
            "reasonableWhen": "A distal cancer prevents complete colonoscopy and proximal-colon assessment is needed.",
            "timingProfileId": "timing.test.ct"
          },
          {
            "id": "fit",
            "label": "Repeat fecal immunochemical screening next year",
            "temptation": "Let a negative repeat screen and a negative summary end the workup.",
            "rationale": "Neither the repeat stool test nor the poorly visualized proximal colon establishes completed positive-FIT evaluation.",
            "reasonableWhen": "Routine stool screening is being chosen before any abnormal screening result.",
            "timingProfileId": "timing.test.general_diagnostic"
          }
        ],
        "claims": [
          "positive-fit-completion",
          "inadequate-prep-completion",
          "ctc-incomplete-distal-cancer"
        ],
        "explanation": "Read the withdrawal observations before accepting the negative summary. Cecal reach did not establish adequate proximal inspection, so the positive FIT remains incompletely evaluated. Repeat prepared colonoscopy addresses that deficit; repeating FIT does not.",
        "gate": {
          "cueAttack": "Removed the permission that colonoscopy is clinically appropriate and the announcement that no examination followed. The competing negative report must be reconciled with its raw withdrawal observations. Options are concrete next investigation plans; CT colonography is a credible completion alternative rather than an already completed distal examination.",
          "stage": "One next-investigation decision after discordant screening and colonoscopy records.",
          "steps": [
            "Infer from the final withdrawal observations that the negative colonoscopy summary does not represent a complete mucosal evaluation.",
            "Apply the unresolved positive-FIT pathway to select repeat colonoscopy rather than rescreening or an unnecessary modality substitution."
          ],
          "difficulty": "Moderate prediction: anchoring on cecal reach, the negative repeat FIT or the report headline produces a specific wrong completion decision. This is not claimed independently hard.",
          "closestChoice": "ctc",
          "decidingObservation": "The limiting factor is persistent stool after cleansing, with no anatomic completion failure or stated contraindication to repeat colonoscopy.",
          "consequence": "Missed proximal pathology or failure to complete abnormal screening.",
          "deletionTest": "The FIT results establish the diagnostic pathway; final segment visibility determines whether it was completed. The negative headline creates a real reconciliation task; no availability permission remains.",
          "counterfactual": "If an otherwise adequately prepared examination instead stopped at an impassable distal cancer, CT colonography would become an offered method to assess the unexamined proximal colon.",
          "counterfactualChoice": "ctc",
          "sequence": "Standalone; no preceding colonoscopy or biopsy feedback supplies the judgment."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "workup",
        "correctChoice": "scope",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "cecum-versus-adequacy-r2",
    "name": "Grace Bennett",
    "age": 64,
    "sex": "Female",
    "complaint": "Colonoscopy report review",
    "presentation": "{patientName}, a 64-year-old woman, attends clinic to review an outside screening colonoscopy.",
    "nodes": [
      {
        "slug": "cecum-versus-adequacy",
        "conceptId": "concept.variety3.inadequate-bowel-prep-repeat-colonoscopy",
        "title": "Judge the final preparation rather than the insertion view",
        "objective": "Use final mucosal visualization after cleansing to decide whether a normal colonoscopy supports standard screening.",
        "update": "During insertion, stool covered the right-colon mucosa. The cecum was reached. After irrigation and suction, the withdrawal record documents the entire mucosa in every segment as visible, with no obscured area and no polyp or mass. This was her first screening colonoscopy; there is no prior neoplasia, hereditary syndrome or relevant family history.",
        "task": "Under USMSTF guidance, which next colonoscopy plan fits {patientName}'s completed examination?",
        "choices": [
          {
            "id": "routine",
            "label": "Repeat colonoscopy in ten years",
            "temptation": "Use the final examination quality and normal findings.",
            "rationale": "Preparation is judged after cleansing. A complete normal examination with adequate final visualization supports the usual ten-year interval in this scoped screening setting.",
            "reasonableWhen": "The entire colon is adequately inspected and normal without a history requiring shorter surveillance.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "early",
            "label": "Repeat colonoscopy within one year",
            "temptation": "Let the initially dirty right colon define the whole examination.",
            "rationale": "The final withdrawal record establishes that cleaning resolved the obscuration; an inadequacy-driven early repeat is not supported.",
            "reasonableWhen": "Mucosa remains inadequately visualized after cleansing in a screening examination.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "three",
            "label": "Repeat colonoscopy in three years",
            "temptation": "Compromise between an initially dirty view and a normal final report.",
            "rationale": "An intermediate interval does not replace classification of the final examination, and no advanced adenoma was found.",
            "reasonableWhen": "A completely removed advanced adenoma establishes a three-year surveillance indication.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "prep-after-cleansing",
          "normal-colonoscopy-surveillance",
          "inadequate-prep-completion",
          "advanced-adenoma-surveillance"
        ],
        "explanation": "Insertion quality and final withdrawal quality are different observations. After cleansing, every segment was visible and normal. That final examination supports standard screening timing; an initially dirty view does not independently create an early-repeat indication.",
        "gate": {
          "cueAttack": "Replaced the editorially signaled bad report and the completed-sigmoidoscopy foil. All options now name colonoscopy timing. The learner must reconcile insertion and withdrawal rather than match the word inadequate to repeat.",
          "stage": "Three next-colonoscopy plans for the same completed screening examination.",
          "steps": [
            "Determine whether the initial obscuration persisted after endoscopist cleaning.",
            "Use the resulting complete normal examination, rather than insertion appearance, to select standard screening timing."
          ],
          "difficulty": "Moderate prediction: an inadequacy heuristic competes with the final visualization record. No unsupported numerical cleanliness score is required.",
          "closestChoice": "early",
          "decidingObservation": "Every segment became fully visible on withdrawal after cleaning; the initially dirty view did not persist.",
          "consequence": "Unnecessary early invasive testing if insertion quality is mistaken for final adequacy.",
          "deletionTest": "Remove the initial view and there is no quality reconciliation; remove the final observations and a standard interval cannot be justified. History excludes a separate surveillance pathway.",
          "counterfactual": "If adherent stool still obscured broad proximal areas after all cleansing, the final examination would remain inadequate and the offered within-one-year repeat would replace the ten-year plan in this screening setting.",
          "counterfactualChoice": "early",
          "sequence": "Standalone with a normal screening frame; not a second question that inherits an earlier inadequate-preparation answer."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "workup",
        "correctChoice": "routine",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "advanced-adenoma-surveillance-r2",
    "name": "Grace Bennett",
    "age": 64,
    "sex": "Female",
    "complaint": "Polypectomy follow-up",
    "presentation": "{patientName}, a 64-year-old woman, attends clinic to reconcile an outside polypectomy report with the pathology processing record.",
    "nodes": [
      {
        "slug": "advanced-adenoma-surveillance",
        "conceptId": "concept.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v1",
        "title": "Surveillance after an advanced adenoma",
        "objective": "Use the completed baseline and resection details to select USMSTF surveillance.",
        "update": "The complete, adequately prepared colonoscopy documented one 24-mm nonpedunculated adenoma removed by a single en-bloc snare resection. The specimen arrived intact; the laboratory grossing log records that it was divided into four pieces for processing. Final pathology shows tubular adenoma without invasive cancer, and the assessed margins are free of adenoma. No other lesion, prior neoplasia, hereditary syndrome or relevant family history is recorded.",
        "task": "Under USMSTF guidance, when should {patientName}'s first surveillance colonoscopy be planned after this resection?",
        "choices": [
          {
            "id": "three",
            "label": "Colonoscopy in three years",
            "temptation": "Reconstruct the resection method from procedure and laboratory records.",
            "rationale": "The lesion was removed intact in one resection; later laboratory division does not make that procedure piecemeal. Size establishes an advanced adenoma with confident complete removal.",
            "reasonableWhen": "An adenoma at least 10 mm is completely removed at a high-quality baseline examination.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "six",
            "label": "Colonoscopy in six months",
            "temptation": "Treat four laboratory pieces as four resection fragments.",
            "rationale": "The early piecemeal scar interval applies to the endoscopic removal method, not subsequent grossing of an intact specimen.",
            "reasonableWhen": "An adenoma at least 20 mm was removed piecemeal.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "one",
            "label": "Colonoscopy in one year",
            "temptation": "Apply another large-polyp follow-up interval without checking which surveillance visit is being scheduled.",
            "rationale": "This is the first follow-up after complete en-bloc removal, not the later visit after an initial piecemeal scar check.",
            "reasonableWhen": "The first six-month surveillance after a large piecemeal resection has been completed and the next visit is being scheduled.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "advanced-adenoma-surveillance",
          "piecemeal-surveillance",
          "piecemeal-second-surveillance"
        ],
        "explanation": "Separate endoscopic resection from laboratory processing. Four grossing pieces from a specimen received intact do not establish piecemeal removal. The completely excised 24-mm adenoma therefore follows the three-year advanced-adenoma pathway.",
        "gate": {
          "cueAttack": "The procedure and pathology records now create a consequential discrepancy. Removed the prior routine size-only stem. Three equally formatted intervals are credible within post-polypectomy care; no ten-year foil remains.",
          "stage": "Three first-surveillance colonoscopy intervals.",
          "steps": [
            "Infer that fragmentation occurred in laboratory processing, not during resection.",
            "Apply the size-defined advanced-adenoma interval rather than the large-piecemeal scar interval."
          ],
          "difficulty": "Moderate prediction: conflating laboratory fragments with resection pieces changes the correct interval; size recall alone no longer solves the record.",
          "closestChoice": "six",
          "decidingObservation": "The specimen was received intact after one en-bloc resection, then divided by the laboratory.",
          "consequence": "Unnecessary early scar surveillance from misclassifying the resection method.",
          "deletionTest": "The laboratory division is the competing signal; intact receipt and procedure technique resolve it. Size and complete assessed margins set the interval boundary.",
          "counterfactual": "If the procedure instead removed this 24-mm adenoma in overlapping pieces before retrieval, the offered six-month first surveillance would become appropriate.",
          "counterfactualChoice": "six",
          "sequence": "Standalone; no preparation or resection feedback has already classified this specimen."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "three",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "large-polyp-expert-resection-r2",
    "name": "Victor Ellis",
    "age": 67,
    "sex": "Male",
    "complaint": "Polyp removal consultation",
    "presentation": "{patientName}, a 67-year-old man, attends clinic with outside endoscopy records for a cecal lesion.",
    "nodes": [
      {
        "slug": "large-polyp-expert-resection",
        "conceptId": "concept.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v1",
        "title": "Advanced resection before colectomy",
        "objective": "Choose expert endoscopic assessment for a large lesion without demonstrated deep invasion.",
        "update": "The 28-mm laterally spreading cecal lesion has a uniform granular surface without a depressed or ulcerated focus on documented image-enhanced inspection. A small superficial sample contains adenoma; submucosa is not represented. The first operator stopped before resection because of size.",
        "task": "Which referral should guide {patientName}'s next lesion-removal plan?",
        "choices": [
          {
            "id": "expert",
            "label": "Advanced-endoscopy referral for endoscopic resection planning",
            "temptation": "Distinguish technical size from observed deep invasion.",
            "rationale": "Large nonpedunculated lesions without deep invasive features merit advanced-resection expertise; the superficial biopsy does not itself prove the whole lesion benign.",
            "reasonableWhen": "A large lesion lacks overt deep invasive features and has not yet undergone an expert resection assessment.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "surgery",
            "label": "Colorectal-surgery referral for oncologic resection planning",
            "temptation": "Treat lesion size or unassessed submucosa as sufficient evidence for colectomy.",
            "rationale": "Neither size alone nor an unrepresented layer establishes deep invasion that rules out endoscopic treatment.",
            "reasonableWhen": "Deep invasive features or an expert assessment establishes a lesion unsuitable for curative endoscopic removal."
          },
          {
            "id": "sample",
            "label": "Diagnostic-endoscopy referral for repeat biopsy planning",
            "temptation": "Require a more reassuring biopsy before any resection referral.",
            "rationale": "Repeating a small sample may still miss the relevant invasive focus and does not address the expertise required for definitive removal.",
            "reasonableWhen": "A suspicious lesion needs histologic confirmation for a nonendoscopic treatment pathway and the initial sample was unrepresentative.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "large-polyp-expertise"
        ],
        "explanation": "Interpret the optical morphology separately from the limited superficial sample. The absent submucosa prevents the biopsy from excluding invasion, but size alone does not establish an indication for colectomy. Advanced endoscopic resection planning is the appropriate referral at this stage.",
        "gate": {
          "cueAttack": "All options now commit to a referral for a specified planning objective. Removed the key-only cautious assessment wording, committed colectomy contrast and serial partial-resection foil. The raw morphology, rather than the biopsy word adenoma, supplies the discriminating evidence.",
          "stage": "Three referral plans before definitive lesion treatment.",
          "steps": [
            "Interpret the optical appearance and sampling depth without treating superficial adenoma as proof of absent invasion.",
            "Select advanced endoscopic resection expertise rather than size-driven oncologic planning or another limited biopsy."
          ],
          "difficulty": "Moderate prediction: colectomy for size and repeated biopsy for unrepresented submucosa are credible competing errors; no independent hard label is asserted.",
          "closestChoice": "surgery",
          "decidingObservation": "Uniform granular morphology without a depressed or ulcerated focus, with size as the first operator's reason for stopping.",
          "consequence": "Avoidable colectomy or repeated sampling that delays definitive assessment.",
          "deletionTest": "Size establishes the expertise requirement; morphology separates the endoscopic route from an invasion-driven surgical route. Sampling depth prevents a false benign-biopsy inference.",
          "counterfactual": "If image-enhanced inspection instead showed a deeply depressed ulcerated focus with a deep invasive pattern, oncologic resection planning would become the best offered referral.",
          "counterfactualChoice": "surgery",
          "sequence": "Standalone; the later piecemeal-surveillance candidate is not assembled as a companion while awaiting review."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "expert",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "piecemeal-scar-surveillance-r2",
    "name": "Victor Ellis",
    "age": 67,
    "sex": "Male",
    "complaint": "Polypectomy follow-up",
    "presentation": "{patientName}, a 67-year-old man, attends clinic with an outside polypectomy procedure log and pathology report.",
    "nodes": [
      {
        "slug": "piecemeal-scar-surveillance",
        "conceptId": "concept.topic.colorectal-polyps-cancer.piecemeal-emr-surveillance.v1",
        "title": "Early surveillance after piecemeal EMR",
        "objective": "Select early scar assessment after large piecemeal adenoma resection.",
        "update": "The outside procedure log describes removal of a 28-mm ascending-colon adenoma with four overlapping snare captures. All retrieved portions were placed in one container. Pathology calls it one aggregate of tubular adenoma without invasive cancer and notes a free cut edge on one fragment. Endoscopic inspection found no visible remnant. The rest of the colon was completely examined with adequate preparation.",
        "task": "Under USMSTF guidance, when should {patientName}'s first surveillance colonoscopy be planned after this procedure?",
        "choices": [
          {
            "id": "six",
            "label": "Colonoscopy in six months",
            "temptation": "Use the actual removal method rather than the specimen-container label.",
            "rationale": "Four overlapping captures establish piecemeal removal of an adenoma at least 20 mm. A free edge on one fragment cannot establish a single complete perimeter.",
            "reasonableWhen": "A large adenoma was removed piecemeal and the first scar check is due.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "three",
            "label": "Colonoscopy in three years",
            "temptation": "Treat one aggregate or a free fragment edge as proof of complete en-bloc removal.",
            "rationale": "Routine advanced-adenoma timing does not replace the early scar check after large piecemeal removal.",
            "reasonableWhen": "A size-defined advanced adenoma was completely removed en bloc.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "one",
            "label": "Colonoscopy in one year",
            "temptation": "Apply a later large-piecemeal surveillance visit as the first visit.",
            "rationale": "The one-year subsequent interval follows the initial six-month surveillance; this patient has not had that first check.",
            "reasonableWhen": "The first surveillance after the large piecemeal resection has already been completed.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "piecemeal-surveillance",
          "advanced-adenoma-surveillance",
          "piecemeal-second-surveillance"
        ],
        "explanation": "One container is not one resection. The procedure shows piecemeal removal, and the assessed edge of one fragment cannot establish the whole lesion's perimeter. The first large-piecemeal surveillance visit is about six months after resection.",
        "gate": {
          "cueAttack": "Removed the supplied margin-management conclusion and the remote ten-year option. Procedure captures, container count and fragment-edge wording must now be reconciled; all three options are plausible surveillance intervals.",
          "stage": "Three first-surveillance colonoscopy intervals after removal.",
          "steps": [
            "Infer the actual piecemeal method from four overlapping captures despite the single aggregate and fragment-edge report.",
            "Apply the early large-piecemeal scar interval instead of routine advanced-adenoma or subsequent-surveillance timing."
          ],
          "difficulty": "Moderate prediction: a reassuring pathology label or single-container heuristic points to a different interval. The author does not claim the timing rule itself is hard.",
          "closestChoice": "three",
          "decidingObservation": "Four overlapping endoscopic captures, not the number of containers or the margin of one fragment.",
          "consequence": "Delay in detecting residual adenoma at a large piecemeal resection site.",
          "deletionTest": "The procedure and laboratory observations are both required to resolve the apparent completeness; size establishes the relevant piecemeal threshold. The rest-of-colon quality excludes a separate completion problem.",
          "counterfactual": "If the 28-mm adenoma had instead been removed in one intact oriented specimen with all margins assessed clear, the offered three-year interval would become appropriate.",
          "counterfactualChoice": "three",
          "sequence": "Standalone; no earlier resection explanation identifies the method or surveillance pathway."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "six",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "intact-low-risk-specimen-r2",
    "name": "Susan Mercer",
    "age": 55,
    "sex": "Female",
    "complaint": "Polyp pathology review",
    "presentation": "{patientName}, a 55-year-old woman, attends clinic after removal of an ascending-colon lesion.",
    "nodes": [
      {
        "slug": "intact-low-risk-specimen",
        "conceptId": "concept.malignant-polyp.low-risk-endoscopic-excision",
        "title": "Complete favorable invasive-polyp excision",
        "objective": "Integrate specimen adequacy, depth and adverse-feature assessment before colectomy.",
        "update": "The nonpedunculated ascending-colon lesion was removed completely and retrieved in one oriented piece. Moderately differentiated glands extend 0.6 mm into submucosa; the invasive front is 2 mm from the deep cut edge. Both lateral mucosal edges were identified histologically and are free of adenoma and carcinoma. No lymphovascular or perineural invasion is found; budding is low. No lesion remained endoscopically.",
        "task": "Which lesion-directed plan should be discussed for {patientName}'s resected ascending-colon lesion?",
        "choices": [
          {
            "id": "follow",
            "label": "Colonoscopic surveillance of the excision site",
            "temptation": "Use the complete specimen rather than the cancer label",
            "rationale": "The intact assessment and favorable features support endoscopic treatment with surveillance.",
            "reasonableWhen": "A fully assessed invasive polyp has favorable features and clear edges.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "scar",
            "label": "Endoscopic full-thickness scar excision",
            "temptation": "Treat all submucosal cancer as local residual",
            "rationale": "No outstanding local margin question is established.",
            "reasonableWhen": "A specialist-defined unresolved local-clearance problem.",
            "timingProfileId": "timing.test.clinical_procedure"
          },
          {
            "id": "regional",
            "label": "Oncologic ascending-colon resection",
            "temptation": "Treat invasion as automatic colectomy",
            "rationale": "No adverse feature puts this fully assessed lesion in the regional resection group.",
            "reasonableWhen": "Adverse histology or an involved invasive margin."
          }
        ],
        "claims": [
          "low-risk-malignant-polyp",
          "adverse-polyp-regional-risk"
        ],
        "explanation": "Assess the whole intact specimen, including lateral and deep clearance, depth, grade, vascular/neural invasion and budding. These findings support a favorable fully excised submucosally invasive lesion for which endoscopic treatment with surveillance can be discussed; a visually clear scar alone would not establish that conclusion.",
        "gate": {
          "cueAttack": "Added explicit nonpedunculated morphology, complete excision and histologically assessed clear lateral margins. No visual-to-histologic margin substitution remains. Retained the concrete surveillance, local scar excision and regional resection alternatives.",
          "stage": "Three postexcision lesion plans.",
          "steps": [
            "Integrate depth and adverse-feature observations with complete deep and lateral histologic clearance.",
            "Choose surveillance rather than another local excision or regional oncologic resection in this fully assessed favorable specimen."
          ],
          "difficulty": "Fair moderate: the independent review found the intended favorable-risk reasoning reasonable once lateral clearance and morphology were supplied. No extra difficulty is manufactured.",
          "closestChoice": "regional",
          "decidingObservation": "An intact nonpedunculated specimen with clear assessed deep and lateral margins, superficial submucosal depth, low budding and no lymphovascular invasion.",
          "consequence": "Unnecessary colectomy or reverse undertreatment of adverse disease.",
          "deletionTest": "Every pathology feature establishes a relevant favorable-risk or completeness criterion. Visual clearance is corroborative and does not substitute for the added histologic lateral assessment.",
          "counterfactual": "If lymphovascular invasion were identified while all margins remained clear, regional oncologic resection would become the best offered lesion-directed plan for a surgically suitable patient.",
          "counterfactualChoice": "regional",
          "sequence": "Standalone. No preserved PASS malignant-polyp variant is edited or used as teaching feedback."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "follow",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "nonlifting-after-tattoo-r2",
    "name": "Elaine Porter",
    "age": 66,
    "sex": "Female",
    "complaint": "Residual polyp review",
    "presentation": "{patientName}, a 66-year-old woman, attends clinic after partial cecal-polyp removal at an outside center.",
    "nodes": [
      {
        "slug": "nonlifting-after-tattoo",
        "conceptId": "concept.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v1",
        "title": "Advanced resection before colectomy",
        "objective": "Choose expert endoscopic assessment for a large lesion without demonstrated deep invasion.",
        "update": "The original 26-mm lesion had a uniform granular surface. Cautery removed one part; carbon tattoo was injected beneath the remainder. On repeat inspection, residual tissue fails to lift at that site. Removed tissue contains adenoma. No ulcerated or depressed focus is described.",
        "task": "Which referral should guide {patientName}'s next treatment plan?",
        "choices": [
          {
            "id": "expert",
            "label": "Advanced-endoscopy referral for completion-resection planning",
            "temptation": "Recognize a treatment-related confounder of the lift sign.",
            "rationale": "Prior cautery and tattoo beneath the residual lesion can produce fibrosis. Expert completion planning is warranted; nonlifting alone does not prove deep invasion.",
            "reasonableWhen": "A scarred residual lesion without documented deep invasive features requires advanced assessment.",
            "timingProfileId": "timing.test.advanced_diagnostic"
          },
          {
            "id": "regional",
            "label": "Colorectal-surgery referral for oncologic resection planning",
            "temptation": "Treat the nonlifting sign as sufficient proof of invasive cancer.",
            "rationale": "This lift test was performed after interventions that can scar the submucosa; the original granular morphology and lack of an invasive focus matter.",
            "reasonableWhen": "Optical deep invasion or expert assessment establishes a lesion unsuitable for curative endoscopic treatment."
          },
          {
            "id": "sample",
            "label": "Diagnostic-endoscopy referral for repeat biopsy planning",
            "temptation": "Try to settle the lift finding with another small tissue sample.",
            "rationale": "Another limited sample may miss invasion and does not solve the scarred completion-resection problem.",
            "reasonableWhen": "Representative tissue confirmation is needed to direct an established nonendoscopic treatment pathway.",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        ],
        "claims": [
          "scar-nonlifting",
          "large-polyp-expertise"
        ],
        "explanation": "Interpret a lift test in its procedural history. Tattoo and cautery beneath a residual lesion can cause fibrosis, so this nonlift does not independently establish deep invasion. Advanced completion-resection planning addresses the actual problem without assuming either cancer or easy routine snare removal.",
        "gate": {
          "cueAttack": "Converted all three answers to parallel referral plans. Removed standard repeat snaring and the cautious assessment versus committed operation contrast. The temporal relation between injury, tattoo and nonlift remains raw evidence.",
          "stage": "Three referral plans for the residual lesion before definitive treatment.",
          "steps": [
            "Interpret nonlifting after cautery and sublesional tattoo as a confounded finding, not proof of deep invasion.",
            "Use the residual lesion's complexity and available original morphology to choose expert completion-resection planning."
          ],
          "difficulty": "Moderate prediction: anchoring on a later nonlift despite its procedural cause competes with expert endoscopic referral.",
          "closestChoice": "regional",
          "decidingObservation": "The lift failure arose at a site already treated with cautery and tattoo beneath the lesion.",
          "consequence": "Unnecessary regional resection or repeated superficial sampling rather than definitive expert planning.",
          "deletionTest": "Original morphology and prior interventions determine how to interpret nonlift; residual tissue establishes a completion problem. The adenoma sample cannot exclude an unsampled invasive focus.",
          "counterfactual": "If the untreated lesion had a depressed ulcerated invasive focus before any injection, biopsy or cautery, oncologic resection planning would become the best offered referral.",
          "counterfactualChoice": "regional",
          "sequence": "Standalone; the large-polyp referral draft cannot supply this answer as prior feedback."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "expert",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "fap-retained-rectum-progression-r2",
    "name": "Nathan Cole",
    "age": 35,
    "sex": "Male",
    "complaint": "Rectal surveillance review",
    "presentation": "{patientName}, a 35-year-old man with FAP and a prior ileorectal anastomosis, attends clinic to review outside rectal surveillance records.",
    "nodes": [
      {
        "slug": "fap-retained-rectum-progression",
        "conceptId": "concept.fap.ipaa-for-uncontrolled-rectal-burden",
        "title": "Rectal removal for uncontrolled FAP burden",
        "objective": "Integrate rectal clearance, continence and restorative goals when choosing FAP operative extent.",
        "update": "Years after colectomy with ileorectal anastomosis for FAP, the retained rectum now contains a confluent adenoma field left after repeated endoscopic clearing attempts. Submitted fragments contain high-grade dysplasia; no invasive carcinoma is present in those fragments. Pelvic MRI shows no extrarectal extension or suspicious regional nodes. Continence is normal. After counseling about further surgery, he prioritizes maintaining intestinal continuity over a permanent end ileostomy.",
        "task": "Which next operative plan should be discussed for {patientName}'s retained rectum?",
        "choices": [
          {
            "id": "complete",
            "label": "Completion proctectomy with ileal pouch-anal anastomosis",
            "temptation": "Update operative extent from current rather than prior burden",
            "rationale": "The earlier rectal-sparing premise no longer holds; removing the uncontrolled rectum addresses the new disease while permitting restoration.",
            "reasonableWhen": "A retained rectum develops disease no longer manageable endoscopically."
          },
          {
            "id": "continue",
            "label": "Continue IRA with repeated endoscopic clearing",
            "temptation": "Carry forward an earlier appropriate choice unchanged",
            "rationale": "Repeated residual high-grade field disease defeats the original rectal-retention premise.",
            "reasonableWhen": "A limited rectal burden remains endoscopically clearable.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "end",
            "label": "Completion proctectomy with end ileostomy",
            "temptation": "Remove the rectum without using the preserved function",
            "rationale": "This is an option, but the supplied function and restorative goal favor pouch planning.",
            "reasonableWhen": "Poor continence or a preference to avoid pouch-related function."
          }
        ],
        "claims": [
          "fap-rectal-burden",
          "fap-ira",
          "fap-end-ileostomy",
          "fragment-versus-imaging-scope"
        ],
        "explanation": "Failure of endoscopic control requires reconsideration of the retained rectum. Fragment histology and MRI do not exclude microscopic invasion throughout the field. Completion proctectomy with IPAA can address the rectal burden while respecting preserved function and the stated continuity goal; final pathology still matters.",
        "gate": {
          "cueAttack": "Removed the claim that MRI shows no invasive cancer and the ambiguous desire for restoration in a patient who already has IRA. Separate fragment histology from extrarectal MRI observations; the preference now concerns future continuity versus end ileostomy.",
          "stage": "Three plans for the retained rectum after IRA surveillance failure.",
          "steps": [
            "Infer from persistent confluent dysplasia after repeated clearing that rectal preservation is no longer endoscopically controlled.",
            "Combine the need for rectal removal with preserved continence and the stated future functional goal to choose restorative completion surgery."
          ],
          "difficulty": "Fair moderate: two clinical constraints determine extent and reconstruction. The revised case does not imply imaging excludes microscopic invasive disease.",
          "closestChoice": "continue",
          "decidingObservation": "The retained field persists after repeated clearing and contains high-grade dysplasia in submitted tissue.",
          "consequence": "Continued uncontrolled rectal neoplasia or a reconstruction inconsistent with function and goals.",
          "deletionTest": "Prior IRA identifies the retained organ; failed clearing and dysplasia establish its problem; continence and future continuity distinguish reconstruction. MRI is limited to its observed extrarectal scope.",
          "counterfactual": "If the retained rectal adenomas were sparse, fully clearable and without high-grade dysplasia, continued IRA with endoscopic clearing and surveillance would become the best offered plan.",
          "counterfactualChoice": "continue",
          "sequence": "New standalone post-IRA visit. The exact PASS prophylactic-IRA question and its original header remain unchanged in their own case."
        },
        "creationKind": "rewrite",
        "conceptRelation": "preserved",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "complete",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "adherent-bladder-en-bloc-r2",
    "name": "Felix Turner",
    "age": 68,
    "sex": "Male",
    "complaint": "Colon operation planning",
    "presentation": "{patientName}, a 68-year-old man, attends clinic after an outside diagnostic laparoscopy was stopped to arrange colorectal and urologic surgery.",
    "nodes": [
      {
        "slug": "adherent-bladder-en-bloc",
        "conceptId": "concept.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v2",
        "title": "Plan en-bloc resection while preserving uninvolved bladder",
        "objective": "Use the location and extent of an adherent colon cancer to plan en-bloc bladder resection without automatically sacrificing the whole bladder.",
        "update": "Biopsy confirms sigmoid adenocarcinoma and distant staging is negative. The outside exploration record describes a firm focal attachment to the bladder dome, with the neck, trigone and ureteric entries separate from the tumor. The remainder of the bladder wall is uninvolved and would retain a substantial reservoir after dome removal. No peritoneal deposits were found. The patient is being considered for curative surgery, and the attachment has not been divided.",
        "task": "Which operative plan best fits {patientName}'s recorded anatomy, subject to confirmation of clear margins at surgery?",
        "choices": [
          {
            "id": "partial",
            "label": "Sigmoid colectomy with en-bloc partial cystectomy",
            "temptation": "Match the organ extent to the involved dome while preserving the tumor interface.",
            "rationale": "A focal dome attachment can be removed en bloc with a bladder portion while retaining uninvolved neck, trigone and reservoir; the plan still requires an achievable clear margin.",
            "reasonableWhen": "The attached bladder portion can be removed with negative margins and useful remaining bladder."
          },
          {
            "id": "total",
            "label": "Sigmoid colectomy with en-bloc total cystectomy",
            "temptation": "Equate any bladder adherence with a need to remove the whole bladder.",
            "rationale": "The represented attachment is focal at the dome; the record does not show neck/trigone involvement or loss of a usable remaining bladder requiring total removal.",
            "reasonableWhen": "Extent or location prevents clear-margin partial resection with a usable bladder."
          },
          {
            "id": "separate",
            "label": "Sigmoid colectomy with separation of the bladder attachment",
            "temptation": "Assume focal attachment can be peeled away to preserve bladder.",
            "rationale": "An adherent cancer interface should not be divided to decide whether the adhesion is malignant; partial bladder resection preserves an en-bloc specimen.",
            "reasonableWhen": "No true tumor-organ attachment exists and an uninvolved plane is established without dividing an adherent cancer interface."
          }
        ],
        "claims": [
          "en-bloc-adherence",
          "bladder-partial-extent"
        ],
        "explanation": "First preserve the adherent tumor-organ interface. Then use the involved anatomy to choose the planned bladder extent: a focal dome attachment with separate neck/trigone and a usable remnant supports en-bloc partial cystectomy, provided a clear margin is achievable. Adherence does not itself establish histologic invasion, and total cystectomy is not automatic.",
        "gate": {
          "cueAttack": "Replaced two attachment-division near-duplicates with three distinct operative extents. The task is a conditional surgical plan, not a guarantee of final margin status. No endoscopic mucosal-negative claim is used to exclude outer-wall involvement.",
          "stage": "Three combined colorectal/bladder operative plans at the same planning stage.",
          "steps": [
            "Infer that the firm cancer-bladder interface must remain en bloc regardless of whether pathology later shows invasion.",
            "Use dome-limited attachment, separate neck/trigone and a usable remnant to distinguish partial from total cystectomy planning."
          ],
          "difficulty": "Moderate prediction: either preserving all bladder by interface division or overextending en-bloc surgery to total cystectomy is a credible resident error.",
          "closestChoice": "total",
          "decidingObservation": "The attachment is confined to the dome, with uninvolved neck/trigone and substantial uninvolved bladder remaining.",
          "consequence": "Tumor-plane violation or unnecessary loss of the bladder.",
          "deletionTest": "Attachment establishes the en-bloc requirement; its location and remaining reservoir determine partial versus total extent. Curative intent and negative distant staging define the operative goal.",
          "counterfactual": "If the attachment instead involved the bladder neck and trigone such that no clear-margin partial resection could retain a usable bladder, the offered en-bloc total cystectomy plan would become appropriate.",
          "counterfactualChoice": "total",
          "sequence": "Standalone. The meaning now includes bladder extent, so the prior concept version is retained without FSRS migration."
        },
        "creationKind": "new",
        "conceptRelation": "new_version",
        "previousConceptId": "concept.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v1",
        "conceptType": "management",
        "correctChoice": "partial",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "few-nodes-specimen-reassessment-r2",
    "name": "Thomas Hale",
    "age": 66,
    "sex": "Male",
    "complaint": "Pathology review",
    "presentation": "{patientName}, a 66-year-old man, attends clinic after outside resections of synchronous right-colon and sigmoid cancers.",
    "nodes": [
      {
        "slug": "few-nodes-specimen-reassessment",
        "conceptId": "concept.topic.colorectal-polyps-cancer.few-nodes-specimen-reassessment.v1",
        "title": "Reassess a low node yield",
        "objective": "Distinguish negative sampled nodes from an adequate pathologic regional assessment.",
        "update": "Two synchronous colon cancers were removed in separately labeled right-colon and sigmoid specimens. The right-colon report lists 17 negative regional nodes. The sigmoid report lists five negative regional nodes; that tumor extends through muscularis propria into pericolic fat with clear margins. No metastases were found on preoperative staging. Both submitted mesenteric specimens remain available to pathology.",
        "task": "Which pathology plan should next improve {patientName}'s regional-stage assessment for these two resections?",
        "choices": [
          {
            "id": "sigmoid",
            "label": "Request an additional node search in the sigmoid specimen",
            "temptation": "Keep each primary linked to its own submitted regional specimen.",
            "rationale": "The sigmoid basin has only five assessed nodes. The 17 nodes assigned to the other primary do not repair that specimen-specific deficit.",
            "reasonableWhen": "Fewer than 12 nodes are reported in the specimen for the cancer being staged.",
            "timingProfileId": "timing.test.pathology_review"
          },
          {
            "id": "right",
            "label": "Request an additional node search in the right-colon specimen",
            "temptation": "Focus on the larger node-bearing specimen while overlooking which basin is undersampled.",
            "rationale": "The right-colon specimen already has 17 reported nodes; the identified low count belongs to the sigmoid specimen.",
            "reasonableWhen": "The right-colon specimen rather than the sigmoid specimen has fewer than 12 assessed nodes.",
            "timingProfileId": "timing.test.pathology_review"
          },
          {
            "id": "accept",
            "label": "Accept the combined 22-node assessment for both primaries",
            "temptation": "Pool all negative nodes from the operation.",
            "rationale": "Separate primary tumors require their own regional specimen provenance; a pooled total does not establish adequate assessment for the five-node sigmoid basin.",
            "reasonableWhen": "Each primary has an adequate separately assigned regional-node assessment and no additional pathology deficit is identified."
          }
        ],
        "claims": [
          "node-retrieval",
          "regional-node-provenance"
        ],
        "explanation": "Assign nodes to the primary and specimen from which they came before assessing the count. Seventeen right-colon nodes cannot be transferred to the sigmoid basin. Additional pathology evaluation should target the sigmoid specimen with five assessed nodes; this does not itself prove nodal metastasis or require repeat colectomy.",
        "gate": {
          "cueAttack": "Replaced PET and anatomically awkward mesenteric MRI with three pathology-disposition plans. A pooled adequate-looking count now competes with a genuinely inadequate specimen-specific count; retained tissue is background feasibility for either targeted search rather than a uniquely named key action.",
          "stage": "Three pathology plans for regional staging after completed resection.",
          "steps": [
            "Separate nodes by the two labeled primaries rather than pool the operation's total.",
            "Identify the five-node sigmoid specimen as needing additional pathology retrieval before relying on its node-negative assessment."
          ],
          "difficulty": "Moderate prediction: counting 22 negative nodes across two specimens obscures the undersampled cancer's own basin.",
          "closestChoice": "accept",
          "decidingObservation": "The five sigmoid nodes and 17 right-colon nodes were assigned to separate primary-specific specimens.",
          "consequence": "Overconfidence in an inadequately assessed sigmoid regional stage.",
          "deletionTest": "Two primaries and specimen labels create the provenance problem; both node counts distinguish the proper search from the competing plans. Submitted-tissue availability makes either pathology request possible.",
          "counterfactual": "If the counts were reversed, with five right-colon nodes and 17 sigmoid nodes, the offered additional search in the right-colon specimen would become best.",
          "counterfactualChoice": "right",
          "sequence": "Standalone with a distinct patient; the exact PASS tumor-deposit question retains its original patient and wording."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "sigmoid",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  },
  {
    "slug": "asymptomatic-incurable-primary-r2",
    "name": "Martin Shaw",
    "age": 70,
    "sex": "Male",
    "complaint": "Cancer treatment review",
    "presentation": "{patientName}, a 70-year-old man, attends clinic while the founder reviews outside multidisciplinary records for sigmoid adenocarcinoma with metastases.",
    "nodes": [
      {
        "slug": "asymptomatic-incurable-primary",
        "conceptId": "concept.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v1",
        "title": "Initial treatment of an asymptomatic metastatic primary",
        "objective": "Distinguish symptom control from prophylactic primary resection when distant disease is not curatively resectable.",
        "update": "The outside multidisciplinary team records diffuse bilobar liver and pulmonary metastases not amenable to curative local treatment. At colonoscopy an adult instrument could not pass the sigmoid tumor, but a pediatric instrument passed it. He reports daily formed stools without pain, vomiting, bleeding or transfusion need. CT shows no upstream colonic dilation.",
        "task": "Which initial treatment sequence best fits {patientName}'s current metastatic-primary record?",
        "choices": [
          {
            "id": "systemic",
            "label": "Systemic treatment planning with the primary left in place",
            "temptation": "Distinguish a narrow endoscopic lumen from a clinically obstructing primary.",
            "rationale": "The record lacks clinical or radiographic obstruction and other primary-related complications. For incurable metastatic disease in this setting, systemic treatment generally precedes prophylactic primary surgery.",
            "reasonableWhen": "Metastatic disease is incurable and the primary is not causing obstruction, significant bleeding or perforation."
          },
          {
            "id": "colectomy",
            "label": "Sigmoid colectomy followed by systemic treatment planning",
            "temptation": "Treat failure of the adult scope to pass as a surgical obstruction indication.",
            "rationale": "The smaller scope passed, bowel function continues and CT shows no upstream dilation; prophylactic colectomy would delay treatment of the dominant metastatic disease.",
            "reasonableWhen": "Primary-related perforation or another surgically managed complication requires resection before systemic treatment."
          },
          {
            "id": "divert",
            "label": "Diverting colostomy followed by systemic treatment planning",
            "temptation": "Decompress preemptively because the adult scope did not pass.",
            "rationale": "No symptomatic or radiographic obstruction requiring diversion is established.",
            "reasonableWhen": "A clinically obstructing unresectable primary requires decompression and diversion is the selected feasible route."
          }
        ],
        "claims": [
          "asymptomatic-stage-four",
          "nontraversability-not-obstruction",
          "perforated-cancer"
        ],
        "explanation": "The adult scope's nonpassage does not alone establish bowel obstruction. Ongoing bowel function, absent obstructive symptoms and no upstream dilation define the present primary-related burden. With incurable metastases and no primary complication, initial systemic treatment planning is generally preferred to prophylactic colectomy or diversion.",
        "gate": {
          "cueAttack": "Removed the fitness endorsement and patent-lumen interpretation. Replaced stenting with a parallel diversion-first sequence. Endoscope caliber now creates a credible concern that must be interpreted against bowel function and CT.",
          "stage": "Three initial treatment sequences for incurable metastatic colon cancer.",
          "steps": [
            "Determine whether the instrument-level narrowing represents a clinical obstruction in the current record.",
            "Choose the systemic-first sequence for the uncomplicated primary rather than a prophylactic resection or diversion-first sequence."
          ],
          "difficulty": "Moderate prediction: instrument nonpassage can be mistaken for a mandatory local intervention despite contrary functional and radiographic observations.",
          "closestChoice": "colectomy",
          "decidingObservation": "A pediatric instrument passed, stools continue, and CT shows no proximal dilation or other primary complication.",
          "consequence": "Unnecessary local intervention and delayed metastatic treatment, or failure to respond if a true complication develops.",
          "deletionTest": "Metastatic resectability establishes treatment intent; scope caliber creates the competing concern; symptoms and dilation establish whether that concern is currently a complication. No affirmative treatment-fitness sentence supplies the answer.",
          "counterfactual": "If the primary perforated with generalized contamination, a local resection-first sequence would supersede systemic-first planning among these choices.",
          "counterfactualChoice": "colectomy",
          "sequence": "Standalone; the revised reconstruction question uses a distinct retrospective admission case and does not inherit this explanation."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "systemic",
        "version": 2
      }
    ],
    "historicalAcuity": "obvious_emergency",
    "version": 2
  },
  {
    "slug": "perforation-overrides-systemic-first-r2",
    "name": "Martin Shaw",
    "age": 70,
    "sex": "Male",
    "complaint": "Operative chart review",
    "presentation": "{patientName}, a 70-year-old man, attends clinic after an outside admission; the founder reviews the recorded operation for his metastatic sigmoid cancer.",
    "nodes": [
      {
        "slug": "perforation-overrides-systemic-first",
        "conceptId": "concept.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v2",
        "title": "Choose reconstruction after emergency sigmoid resection",
        "objective": "Use the intraoperative physiology and contamination to choose a concrete reconstruction strategy after resection of a perforated sigmoid cancer.",
        "update": "The founder reviews the operative decision recorded during his outside admission for a perforated sigmoid primary with unresectable liver and lung metastases. Before admission he requested treatment of reversible acute complications. At the recorded decision point, the perforated sigmoid segment had been resected and the remaining bowel ends were viable. Diffuse fecal contamination had been encountered. Despite fluids, antibiotics and resection, norepinephrine was still required and the bowel was edematous. The operative team judged fascial closure feasible without a planned open abdomen.",
        "task": "At that outside intraoperative decision point, which reconstruction plan best fits {patientName}'s recorded findings?",
        "choices": [
          {
            "id": "hartmann",
            "label": "Close the rectal stump and create an end colostomy",
            "temptation": "Interpret continuing circulatory support and contamination when deciding whether to create an anastomosis.",
            "rationale": "Ongoing vasopressor need with fecal contamination and edematous bowel favors avoiding a new colorectal anastomosis. A concrete Hartmann reconstruction is supported here; no universal rule for every perforation is asserted.",
            "reasonableWhen": "After left-sided perforation resection, current physiology and local conditions make primary anastomosis inappropriate and the abdomen can be closed."
          },
          {
            "id": "protected",
            "label": "Create a colorectal anastomosis and a diverting loop ileostomy",
            "temptation": "Assume proximal diversion makes a high-risk anastomosis acceptable regardless of current physiology.",
            "rationale": "Diversion does not remove an anastomosis or its failure risk. The continuing vasopressor need and adverse local conditions favor not constructing it at this recorded point.",
            "reasonableWhen": "Resuscitation has restored stable physiology and local bowel conditions support a primary anastomosis, with diversion selected for the residual risk."
          },
          {
            "id": "unprotected",
            "label": "Create a colorectal anastomosis without proximal diversion",
            "temptation": "Transfer preadmission fitness into a septic operative decision.",
            "rationale": "The relevant observations are the current vasopressor need, contamination and edema, not earlier cancer-treatment eligibility.",
            "reasonableWhen": "Physiology, perfusion, contamination and anastomotic conditions are favorable enough for primary anastomosis without diversion."
          }
        ],
        "claims": [
          "perforated-cancer",
          "unstable-left-perforation-reconstruction"
        ],
        "explanation": "Review the physiology at the actual reconstruction point. Persistent vasopressor need plus fecal contamination and bowel edema favor avoiding a colorectal anastomosis; closing the stump and forming an end colostomy is a concrete plan. Diversion cannot erase the risk of an anastomosis already constructed. This scoped decision does not prescribe Hartmann reconstruction for every perforated cancer.",
        "gate": {
          "cueAttack": "Rebuilt the failed item at one past intraoperative moment after resection. All answers are specific reconstruction operations; no stent, delayed source control, vague staged plan or supplied definitive-source-control cue remains.",
          "stage": "Three concrete reconstruction plans after the same completed sigmoid resection.",
          "steps": [
            "Interpret ongoing norepinephrine need after resuscitation together with fecal contamination and bowel edema as adverse conditions for a new anastomosis.",
            "Choose stump closure and end colostomy rather than assume that proximal diversion or earlier cancer-treatment fitness makes an anastomosis suitable."
          ],
          "difficulty": "Fair moderate: protected anastomosis is the nearest real competitor. No invented pressor-dose, lactate or timeline threshold is used, and prior systemic-treatment fitness supplies no inference.",
          "closestChoice": "protected",
          "decidingObservation": "At the reconstruction point vasopressor support remained necessary and bowel edema with diffuse fecal contamination was documented.",
          "consequence": "Anastomotic failure risk from constructing an anastomosis under unfavorable current conditions.",
          "deletionTest": "Metastatic context and the stated goals establish why the acute complication was treated; viable ends establish that reconstruction is the decision. Current physiology and local findings distinguish the operations, while feasible closure excludes an unstated open-abdomen stoma-delay question.",
          "counterfactual": "If resuscitation instead restored stable physiology without vasopressors and the viable bowel was well perfused without edema or diffuse contamination, a colorectal anastomosis with selected protective diversion would become a reasonable offered reconstruction rather than a mandatory end colostomy. That counterfactual permits the alternative; it does not claim diversion is universally required.",
          "counterfactualChoice": "protected",
          "sequence": "Standalone retrospective clinic chart review. No uncomplicated-primary question or its feedback precedes the reconstruction decision."
        },
        "creationKind": "new",
        "conceptRelation": "new_version",
        "previousConceptId": "concept.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v1",
        "conceptType": "management",
        "correctChoice": "hartmann",
        "version": 2
      }
    ],
    "historicalAcuity": "obvious_emergency",
    "version": 2
  },
  {
    "slug": "advanced-baseline-normal-surveillance-r2",
    "name": "George Sutton",
    "age": 68,
    "sex": "Male",
    "complaint": "Surveillance interval review",
    "presentation": "{patientName}, a 68-year-old man, attends clinic with records from two outside colonoscopies.",
    "nodes": [
      {
        "slug": "advanced-baseline-normal-surveillance",
        "conceptId": "concept.topic.colorectal-polyps-cancer.serial-adenoma-surveillance.v1",
        "title": "Integrate baseline and first surveillance",
        "objective": "Choose USMSTF second-surveillance timing from both the baseline adenoma and the first follow-up.",
        "update": "At baseline, a 14-mm tubular adenoma was completely removed in one piece during a high-quality examination. The first surveillance colonoscopy, performed three years later, was also complete and adequately prepared and found no adenoma or serrated lesion. He has no prior cancer, hereditary syndrome or relevant family history.",
        "task": "Under USMSTF guidance, when should {patientName}'s next colonoscopy be planned after this normal first surveillance examination?",
        "choices": [
          {
            "id": "five",
            "label": "Colonoscopy in five years",
            "temptation": "Combine the baseline and first-surveillance findings",
            "rationale": "A normal first surveillance examination after an advanced baseline adenoma supports a five-year next interval.",
            "reasonableWhen": "Advanced adenoma at baseline followed by a normal high-quality first surveillance.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "three",
            "label": "Colonoscopy in three years",
            "temptation": "Repeat the baseline advanced-adenoma interval unchanged",
            "rationale": "The normal first surveillance modifies the next interval.",
            "reasonableWhen": "Advanced adenoma or another corresponding higher-risk finding persists at first surveillance.",
            "timingProfileId": "timing.test.lower_endoscopy"
          },
          {
            "id": "ten",
            "label": "Colonoscopy in ten years",
            "temptation": "Erase baseline risk after one normal follow-up",
            "rationale": "The advanced baseline finding continues to matter when selecting the next interval.",
            "reasonableWhen": "A low-risk baseline followed by normal first surveillance can support a longer interval.",
            "timingProfileId": "timing.test.lower_endoscopy"
          }
        ],
        "claims": [
          "serial-adenoma-surveillance",
          "advanced-adenoma-surveillance"
        ],
        "explanation": "Second-surveillance planning uses two examinations. A normal first follow-up modifies, but does not erase, the advanced baseline adenoma history.",
        "gate": {
          "cueAttack": "Added the missing three-year baseline-to-first-surveillance interval. Retained the reviewed two-examination decision and three parallel timing choices without introducing extraneous chronology.",
          "stage": "Three second-surveillance intervals.",
          "steps": [
            "Classify the size-defined baseline adenoma and verify that the normal first surveillance occurred at its appropriate interval.",
            "Apply the serial-surveillance recommendation rather than reuse either the baseline-only or latest-examination-only interval."
          ],
          "difficulty": "Fair moderate, consistent with independent review: interpreting both examinations is consequential; the newly stated first interval removes ambiguity rather than manufacturing difficulty.",
          "closestChoice": "ten",
          "decidingObservation": "A completely removed 14-mm baseline adenoma followed three years later by a normal high-quality first surveillance examination.",
          "consequence": "Over- or under-surveillance from ignoring one examination.",
          "deletionTest": "Each examination determines a different part of the serial-surveillance recommendation, and the added interval establishes that this is the appropriate first surveillance rather than an arbitrary early examination.",
          "counterfactual": "Replace the first surveillance result with a new advanced adenoma: three years becomes the appropriate offered interval.",
          "counterfactualChoice": "three",
          "sequence": "Standalone; exact PASS count/provenance surveillance item remains untouched."
        },
        "creationKind": "new",
        "conceptRelation": "new_identity",
        "previousConceptId": null,
        "conceptType": "management",
        "correctChoice": "five",
        "version": 2
      }
    ],
    "historicalAcuity": "stable",
    "version": 2
  }
];
export const CPC_PARKED_ATTEMPTS = [
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.biopsy-site-discordance.v1",
    "status": "parked",
    "attemptCount": 1,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.biopsy-site-discordance.v2",
    "currentQuestionVariantId": null,
    "correctChoice": null,
    "emittedInSidecar": false,
    "reason": "The permission cue is repaired, but a fair harder biopsy-versus-excision choice cannot be keyed from the current lesion facts. Retained as an unscored sampling-provenance teaching point.",
    "nextAction": "Melissa/manager may supply a clinically verified lesion-specific decision boundary; otherwise retire this scored objective rather than restore the easy site-matching version.",
    "caseDraft": {
      "slug": "discordant-stool-record-park-r2",
      "name": "Henry Wallace",
      "age": 58,
      "sex": "Male",
      "complaint": "Stool test review",
      "presentation": "{patientName}, a 58-year-old man, attends clinic to reconcile outside colorectal screening results.",
      "nodes": [
        {
          "slug": "biopsy-site-discordance",
          "conceptId": "concept.colorectal.histologic-confirmation.v2",
          "title": "Resolve unrepresentative colon sampling",
          "objective": "Arrange lesion-directed tissue acquisition when a benign submitted specimen came from outside a persistent lesion.",
          "update": "The sigmoid lesion remains in place. The outside procedure diagram locates the submitted bites beside it; the container contains intact crypts and lamina propria. No specimen from the lesion itself is documented.",
          "task": "Which tissue-acquisition plan should be considered next for {patientName}'s sigmoid lesion?",
          "choices": [
            {
              "id": "target",
              "label": "Endoscopic forceps sampling of the lesion",
              "temptation": "Obtain tissue from the actual target.",
              "rationale": "A target-directed sample would address the site error, but the record does not establish why biopsy is preferable to a complete resection specimen.",
              "reasonableWhen": "Representative biopsy is needed before a planned nonendoscopic treatment pathway.",
              "timingProfileId": "timing.test.endoscopy_with_sampling"
            },
            {
              "id": "excision",
              "label": "Endoscopic complete excision of the lesion",
              "temptation": "Obtain diagnosis and local treatment together.",
              "rationale": "Complete excision may be appropriate for a resectable lesion, but size, morphology and invasion features needed to rank it are absent.",
              "reasonableWhen": "The lesion is suitable for complete endoscopic removal.",
              "timingProfileId": "timing.test.advanced_diagnostic"
            },
            {
              "id": "surgical",
              "label": "Surgical resection of the lesion-bearing segment",
              "temptation": "Treat concerning unsampled disease with an oncologic specimen.",
              "rationale": "Nondiagnostic off-target tissue does not itself establish the invasion or unresectability needed to prefer surgery.",
              "reasonableWhen": "The lesion cannot be endoscopically removed or has deep invasive features."
            }
          ],
          "claims": [
            "unrepresentative-colon-biopsy"
          ],
          "explanation": "No key is assigned: the site discrepancy establishes a sampling limitation, but the available facts do not rank the credible tissue-acquisition routes.",
          "gate": {
            "cueAttack": "Removed the feasibility permission and replaced vague surveillance with complete excision. All options acquire tissue; no key is singled out as the only action.",
            "stage": "Three tissue-acquisition plans.",
            "steps": [
              "Identify that adjacent mucosa did not sample the lesion.",
              "Rank acquisition methods only after lesion-specific morphology and treatment intent are known."
            ],
            "difficulty": "Not accepted as a scored resident-level item after the single revision attempt.",
            "closestChoice": "excision",
            "decidingObservation": "Target tissue is absent, but lesion removability and invasion features are unspecified.",
            "consequence": "A forced key would confuse needed diagnosis with an unsupported procedure preference.",
            "deletionTest": "Removing the diagram loses the proven site error; adding decorative pathology cannot determine the acquisition method.",
            "counterfactual": "A documented benign-appearing completely endoscopically resectable lesion would support the complete-excision route; deep invasive features would support surgical planning.",
            "counterfactualChoice": "excision",
            "sequence": "Unkeyed, unassembled attempt; cannot appear in a runtime or mixed multi-part case."
          },
          "creationKind": "rewrite",
          "conceptRelation": "new_version",
          "previousConceptId": "concept.colorectal.histologic-confirmation",
          "conceptType": "workup",
          "version": 2
        }
      ],
      "historicalAcuity": "stable",
      "version": 2
    }
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.rectal-local-mri.v1",
    "status": "parked",
    "attemptCount": 1,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.rectal-local-mri.v2",
    "currentQuestionVariantId": null,
    "correctChoice": null,
    "emittedInSidecar": false,
    "reason": "The attempted repair resolves the obvious wording and category cues but leaves a one-rule modality item. No accepted basic-purpose reference exists.",
    "nextAction": "Use a new clinician-verified clinical discrepancy if available; preserve the exact PASS high-risk TNT node separately.",
    "caseDraft": {
      "slug": "rectal-initial-staging-park-r2",
      "name": "Laura Sutton",
      "age": 54,
      "sex": "Female",
      "complaint": "Rectal surgery consultation",
      "presentation": "{patientName}, a 54-year-old woman, attends clinic after an outside biopsy identified mid-rectal adenocarcinoma.",
      "nodes": [
        {
          "slug": "rectal-local-mri",
          "conceptId": "concept.topic.colorectal-polyps-cancer.rectal-local-mri.v1",
          "title": "Local rectal staging before treatment",
          "objective": "Choose local staging that evaluates the tumor and mesorectal surgical plane after adequate distant staging.",
          "update": "The outside workup identifies a rectal adenocarcinoma 7 cm from the anal verge. Chest and abdominal/pelvic CT show no metastases. No local pelvic staging study has yet been performed.",
          "task": "Which local staging plan should be considered for {patientName} before treatment sequencing?",
          "choices": [
            {
              "id": "mri",
              "label": "Rectal-protocol MRI staging",
              "temptation": "Assess the local pelvic extent.",
              "rationale": "A standard local staging route is supported, but the comparison still primarily tests routine modality recall.",
              "reasonableWhen": "Routine rectal local staging is needed.",
              "timingProfileId": "timing.test.mri"
            },
            {
              "id": "eus",
              "label": "Endorectal ultrasound staging",
              "temptation": "Define early mural depth.",
              "rationale": "Its complementary role needs an early-depth decision rather than an unqualified substitute for local MRI.",
              "reasonableWhen": "A specific early-depth distinction would change local-excision eligibility.",
              "timingProfileId": "timing.test.advanced_diagnostic"
            },
            {
              "id": "combined",
              "label": "Rectal MRI with endorectal ultrasound staging",
              "temptation": "Combine local modalities.",
              "rationale": "Without a specific unresolved early-depth question, the extra test is not established as necessary.",
              "reasonableWhen": "Both mesorectal assessment and an unresolved early mural distinction are consequential.",
              "timingProfileId": "timing.test.rectal_response_assessment"
            }
          ],
          "claims": [
            "rectal-mri-staging",
            "rectal-early-eus"
          ],
          "explanation": "Unkeyed attempt: removing the named mesorectal-fascia cue improves presentation but does not create a two-step staging judgment.",
          "gate": {
            "cueAttack": "Removed the uniquely named MRI target and the whole-body PET foil. All choices are local staging plans.",
            "stage": "Three local staging plans.",
            "steps": [
              "Determine what local staging information is actually missing.",
              "Select a protocol only when a meaningful competing limitation is specified."
            ],
            "difficulty": "Not accepted as a scored resident-level item after the single revision attempt.",
            "closestChoice": "combined",
            "decidingObservation": "No competing acquisition or early-depth limitation is established.",
            "consequence": "Scoring this version would label routine modality recall as difficult clinical reasoning.",
            "deletionTest": "No current sentence creates a second consequential inference after removal of the target-word cue.",
            "counterfactual": "A small favorable lesion with a genuine unresolved submucosal-versus-muscle distinction after MRI could justify complementary endorectal ultrasound.",
            "counterfactualChoice": "combined",
            "sequence": "Unkeyed, unassembled attempt; cannot appear in a runtime or mixed multi-part case."
          },
          "creationKind": "new",
          "conceptRelation": "new_identity",
          "previousConceptId": null,
          "conceptType": "management",
          "version": 2
        }
      ],
      "historicalAcuity": "stable",
      "version": 2
    }
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.early-rectal-eus.v1",
    "status": "parked",
    "attemptCount": 1,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.early-rectal-eus.v2",
    "currentQuestionVariantId": null,
    "correctChoice": null,
    "emittedInSidecar": false,
    "reason": "The revision removes the cues and inaccurate implication of perfect EUS resolution but cannot establish one best harder route from verified facts.",
    "nextAction": "Design a clinician-adjudicated early-depth problem with explicit limitations; retain the exact PASS completion-TME node independently.",
    "caseDraft": {
      "slug": "early-rectal-excision-park-r2",
      "name": "Samuel Price",
      "age": 57,
      "sex": "Male",
      "complaint": "Early rectal cancer review",
      "presentation": "{patientName}, a 57-year-old man, attends clinic after outside assessment of a small rectal lesion.",
      "nodes": [
        {
          "slug": "early-rectal-eus",
          "conceptId": "concept.topic.colorectal-polyps-cancer.early-rectal-eus.v1",
          "title": "Clarify early rectal wall invasion",
          "objective": "Select complementary EUS when an early depth distinction changes local-excision eligibility.",
          "update": "The 2-cm rectal lesion occupies less than one quarter of the circumference and is accessible transanally. Biopsy contains well-differentiated adenocarcinoma. MRI shows no suspicious nodes, but the readers cannot distinguish submucosal from muscularis-propria invasion. Distant staging is negative.",
          "task": "Which additional local-assessment plan should be considered for {patientName} before choosing an excision strategy?",
          "choices": [
            {
              "id": "eus",
              "label": "Expert endorectal ultrasound assessment",
              "temptation": "Complement an unresolved early mural-depth question.",
              "rationale": "EUS can complement MRI, but no supplied limitation yet establishes why it uniquely outranks expert MRI review or diagnostic excision.",
              "reasonableWhen": "An operator-dependent complementary early-depth assessment would affect treatment.",
              "timingProfileId": "timing.test.advanced_diagnostic"
            },
            {
              "id": "review",
              "label": "Expert review of the rectal MRI acquisition",
              "temptation": "Reassess the already acquired early-depth information.",
              "rationale": "Its yield relative to EUS depends on acquisition quality and expert interpretation not specified here.",
              "reasonableWhen": "The acquisition is adequate but interpretation is unresolved."
            },
            {
              "id": "excision",
              "label": "Transanal full-thickness diagnostic excision",
              "temptation": "Use an excision specimen to establish depth.",
              "rationale": "Selection for diagnostic excision requires verified eligibility and a discussion of regional staging limits.",
              "reasonableWhen": "A suitable lesion and agreed diagnostic-excision pathway are established.",
              "timingProfileId": "timing.test.clinical_procedure"
            }
          ],
          "claims": [
            "rectal-early-eus",
            "rectal-local-excision"
          ],
          "explanation": "Unkeyed attempt: EUS is complementary and operator-dependent; it is not a perfect definitive discriminator.",
          "gate": {
            "cueAttack": "Removed the awkward outside-workup grammar, unchanged failed MRI repetition and whole-body PET outlier. Options are credible early local assessment routes.",
            "stage": "Three additional early local-assessment plans.",
            "steps": [
              "Recognize that uncertain early depth changes local-excision eligibility.",
              "Rank complementary assessment routes only with their actual quality and eligibility constraints."
            ],
            "difficulty": "Not accepted as a scored resident-level item after the single revision attempt.",
            "closestChoice": "review",
            "decidingObservation": "The acquisition quality and relative feasibility needed to rank the credible routes are not established.",
            "consequence": "A uniquely forced EUS key would overstate its performance and ignore plausible alternatives.",
            "deletionTest": "Lesion size and access establish relevance; they do not establish a universal hierarchy among the three routes.",
            "counterfactual": "If an adequate MRI acquisition had not received expert rectal review, that review could reasonably precede new acquisition; an agreed suitable diagnostic-excision pathway could change the choice again.",
            "counterfactualChoice": "review",
            "sequence": "Unkeyed, unassembled attempt; cannot appear in a runtime or mixed multi-part case."
          },
          "creationKind": "new",
          "conceptRelation": "new_identity",
          "previousConceptId": null,
          "conceptType": "management",
          "version": 2
        }
      ],
      "historicalAcuity": "stable",
      "version": 2
    }
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-stale-mri.v1",
    "status": "parked",
    "attemptCount": 1,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-stale-mri.v2",
    "currentQuestionVariantId": null,
    "correctChoice": null,
    "emittedInSidecar": false,
    "reason": "One revision leaves a date-only completion rule. It is parked rather than represented as a genuinely two-step scored response item.",
    "nextAction": "Retain chronology as an unscored record-quality lesson; a future clinical-response item needs supported current findings without resolving the existing near-complete-response hold.",
    "caseDraft": {
      "slug": "rectal-record-dates-park-r2",
      "name": "Clara Morgan",
      "age": 62,
      "sex": "Female",
      "complaint": "Treatment response review",
      "presentation": "{patientName}, a 62-year-old woman, attends clinic after outside neoadjuvant treatment for rectal adenocarcinoma.",
      "nodes": [
        {
          "slug": "response-stale-mri",
          "conceptId": "concept.rectal-cancer.multimodal-response-assessment",
          "title": "Current multimodal rectal response assessment",
          "objective": "Reconcile the date and scope of response records before treatment decisions.",
          "update": "Neoadjuvant treatment ended in July. September examination and endoscopy show a flat scar without a nodule or ulcer. The transferred MRI was acquired in March before treatment. September distant restaging is negative.",
          "task": "Which plan should complete {patientName}'s local response evaluation before a definitive management discussion?",
          "choices": [
            {
              "id": "current",
              "label": "Acquire current rectal MRI for response assessment",
              "temptation": "Replace pretreatment local information.",
              "rationale": "This accurately fills the date gap, but does not by itself require clinical interpretation of a response discrepancy.",
              "reasonableWhen": "No current local MRI was acquired.",
              "timingProfileId": "timing.test.mri"
            },
            {
              "id": "archive",
              "label": "Obtain expert review of the transferred MRI",
              "temptation": "Interpret existing imaging before a new examination.",
              "rationale": "Pretreatment images cannot describe the treated bed after therapy.",
              "reasonableWhen": "The transferred study is current and has an unresolved interpretation."
            },
            {
              "id": "combined",
              "label": "Repeat local endoscopy and acquire current rectal MRI",
              "temptation": "Repeat all components of a response assessment.",
              "rationale": "The record does not establish why the recent surface examination needs repetition.",
              "reasonableWhen": "Current surface assessment as well as MRI is incomplete or unreliable.",
              "timingProfileId": "timing.test.rectal_response_assessment"
            }
          ],
          "claims": [
            "multimodal-response",
            "negative-response-biopsy"
          ],
          "explanation": "The chronology has one defensible factual lesson, but no new clinical response finding is supplied from which to make a harder decision.",
          "gate": {
            "cueAttack": "Neutralized the task and removed whole-body imaging. Competing local plans are comparable in purpose, yet the dates still solve the item directly.",
            "stage": "Three local response-evaluation plans.",
            "steps": [
              "Distinguish pretreatment from current information.",
              "A clinical response decision would then require actual current response observations, which are absent."
            ],
            "difficulty": "Not accepted as a scored resident-level item after the single revision attempt.",
            "closestChoice": "archive",
            "decidingObservation": "The only discriminatory issue remains a March pretreatment acquisition versus July treatment.",
            "consequence": "Unsupported promotion of an administrative date check to a hard response decision.",
            "deletionTest": "Removing chronology removes the question; no other clinical inference independently contributes.",
            "counterfactual": "A diagnostic September MRI acquired after treatment but omitted from transfer would support retrieval and expert review rather than repeat acquisition.",
            "counterfactualChoice": "archive",
            "sequence": "Unkeyed, unassembled attempt; cannot appear in a runtime or mixed multi-part case."
          },
          "creationKind": "rewrite",
          "conceptRelation": "preserved",
          "previousConceptId": null,
          "conceptType": "workup",
          "version": 2
        }
      ],
      "historicalAcuity": "stable",
      "version": 2
    }
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-acquired-not-exported.v1",
    "status": "parked",
    "attemptCount": 1,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-acquired-not-exported.v2",
    "currentQuestionVariantId": null,
    "correctChoice": null,
    "emittedInSidecar": false,
    "reason": "The single attempt resolves the chronology and transfer wording but does not make a genuine two-step clinical decision. Parked as an unscored provenance lesson.",
    "nextAction": "Future design must include actual supported, contemporaneous response observations; do not invent a wall focus interpretation or change the owner-held response timing case.",
    "caseDraft": {
      "slug": "rectal-exported-series-park-r2",
      "name": "Julia Reeves",
      "age": 59,
      "sex": "Female",
      "complaint": "Response records review",
      "presentation": "{patientName}, a 59-year-old woman, attends clinic while the founder reconciles a transferred rectal-cancer response packet.",
      "nodes": [
        {
          "slug": "response-acquired-not-exported",
          "conceptId": "concept.rectal-cancer.multimodal-response-assessment",
          "title": "Current multimodal rectal response assessment",
          "objective": "Reconcile the date and scope of response records before treatment decisions.",
          "update": "September examination and endoscopy show a flat smooth scar. The image viewer contains only the pretreatment MRI. The hospital acquisition log records a diagnostic September post-treatment rectal MRI with T2 and diffusion imaging, acquired the same week as the surface assessments. The report mentions a small wall focus but does not provide its T2 or diffusion characteristics in the transfer.",
          "task": "Which local response-review plan should be considered before {patientName}'s treatment decision?",
          "choices": [
            {
              "id": "retrieve",
              "label": "Retrieve the September MRI for expert response review",
              "temptation": "Use a performed contemporaneous study.",
              "rationale": "Retrieval repairs a transfer problem but the unseen findings cannot support a scored response classification.",
              "reasonableWhen": "An adequate contemporaneous study exists outside the transfer."
            },
            {
              "id": "repeat",
              "label": "Repeat rectal MRI for response review",
              "temptation": "Resolve the uncertainty with a new local acquisition.",
              "rationale": "A performed diagnostic study may make repeat acquisition unnecessary, but that is still a record-completion rule.",
              "reasonableWhen": "The performed acquisition is nondiagnostic or cannot be obtained.",
              "timingProfileId": "timing.test.mri"
            },
            {
              "id": "surface",
              "label": "Repeat examination and endoscopy for response review",
              "temptation": "Reassess the surface component.",
              "rationale": "The supplied surface studies are contemporaneous; their repetition does not reveal the unexported mural findings.",
              "reasonableWhen": "The existing surface assessment is inadequate or no longer current.",
              "timingProfileId": "timing.test.endoscopy_with_sampling"
            }
          ],
          "claims": [
            "multimodal-response",
            "rectal-early-eus"
          ],
          "explanation": "The dates and transfer status are now explicit. No key is emitted because the proposed discrimination remains an administrative retrieval shortcut rather than interpretation of an actual mural finding.",
          "gate": {
            "cueAttack": "Specified contemporaneous dates and removed implied retrieval permission and systemic-imaging outliers. Actual T2 and diffusion findings remain unavailable rather than invented.",
            "stage": "Three local response-review plans.",
            "steps": [
              "Separate a performed current study from an exported old study.",
              "Interpret a real response disagreement only after its actual diagnostic observations are supplied."
            ],
            "difficulty": "Not accepted as a scored resident-level item after the single revision attempt.",
            "closestChoice": "repeat",
            "decidingObservation": "The archive log establishes a performed diagnostic study, but the response findings needed for clinical adjudication are not supplied.",
            "consequence": "An unearned response classification or a repeat-versus-retrieve question mislabeled as hard.",
            "deletionTest": "The acquisition log earns a retrieval lesson; it does not create the missing clinical inference.",
            "counterfactual": "If the September acquisition were actually nondiagnostic and no adequate current series existed, new diagnostic imaging would be reasonable rather than retrieval alone.",
            "counterfactualChoice": "repeat",
            "sequence": "Unkeyed, unassembled attempt; cannot appear in a runtime or mixed multi-part case."
          },
          "creationKind": "rewrite",
          "conceptRelation": "preserved",
          "previousConceptId": null,
          "conceptType": "workup",
          "version": 2
        }
      ],
      "historicalAcuity": "stable",
      "version": 2
    }
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.above-reflection-sequence.v1",
    "status": "parked",
    "attemptCount": 1,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.above-reflection-sequence.v2",
    "currentQuestionVariantId": null,
    "correctChoice": null,
    "emittedInSidecar": false,
    "reason": "Fairness remains unresolved across conditional upper-rectal pathways. Parked unkeyed for Melissa; no invented extension or margin cutoff is used.",
    "nextAction": "Melissa must adjudicate the exact framework, selection observations and competing sequences before any keyed replacement is accepted.",
    "caseDraft": {
      "slug": "upper-rectal-anatomy-park-r2",
      "name": "Diane Foster",
      "age": 63,
      "sex": "Female",
      "complaint": "Rectal treatment planning",
      "presentation": "{patientName}, a 63-year-old woman, attends clinic after outside rectal-cancer staging.",
      "nodes": [
        {
          "slug": "above-reflection-sequence",
          "conceptId": "concept.topic.colorectal-polyps-cancer.above-reflection-sequence.v1",
          "title": "Upper-rectal treatment sequence",
          "objective": "Use patient-specific peritoneal-reflection anatomy rather than a fixed endoscopic distance to select sequence.",
          "update": "MRI places the whole tumor above the anterior peritoneal reflection. It extends beyond the muscularis propria; the transfer omits measured extramural depth and the tumor-to-fascia distance. No adjacent-organ involvement, suspicious nodes or extramural vascular invasion is reported. Distant staging is negative and mismatch-repair proteins are retained.",
          "task": "Which treatment sequence should the multidisciplinary team discuss for {patientName} under a specified upper-rectal framework?",
          "choices": [
            {
              "id": "surgery",
              "label": "Initial oncologic resection followed by pathology-directed therapy",
              "temptation": "Apply a favorable upper-rectal surgery-first pathway.",
              "rationale": "Potentially reasonable, but the exact selection criteria and framework have not been adjudicated for this draft.",
              "reasonableWhen": "The clinician-verified upper-rectal selection framework supports initial resection."
            },
            {
              "id": "tnt",
              "label": "Total neoadjuvant therapy followed by oncologic resection",
              "temptation": "Apply a locally advanced rectal neoadjuvant pathway.",
              "rationale": "Cannot be declared inferior without explicit framework and verified local-risk observations.",
              "reasonableWhen": "Anatomic and risk criteria under the agreed framework support TNT."
            },
            {
              "id": "selective",
              "label": "Neoadjuvant chemotherapy with selective pelvic radiation followed by resection",
              "temptation": "Apply a selected radiation-sparing sequence.",
              "rationale": "Requires exact eligibility and regimen-framework verification that this record does not establish.",
              "reasonableWhen": "An agreed clinician-verified selective-radiation protocol applies."
            }
          ],
          "claims": [
            "upper-rectal-initial-resection",
            "rectal-tnt",
            "rectal-local-excision"
          ],
          "explanation": "No key is assigned. The omitted MRI measurements are acknowledged rather than replaced with invented cutoffs; the sequence remains conditional on the exact clinical framework.",
          "gate": {
            "cueAttack": "Removed slightly and clear-plane preinterpretation and the implausible transanal-excision foil. Three credible sequences remain, so framework uncertainty is visible rather than hidden.",
            "stage": "Three initial treatment sequences.",
            "steps": [
              "Locate the tumor relative to the peritoneal reflection and identify missing local-risk observations.",
              "Apply the clinician-adjudicated framework only after its actual selection criteria are established."
            ],
            "difficulty": "Not accepted as a scored resident-level item after the single revision attempt.",
            "closestChoice": "tnt",
            "decidingObservation": "Above-reflection anatomy is known, but precise relevant local-risk observations and the intended framework are not settled.",
            "consequence": "A conditional surgery-first recommendation could be unfairly scored against another accepted neoadjuvant pathway.",
            "deletionTest": "Anatomic location remains consequential; missing measurements are not replaced with a convenient invented threshold.",
            "counterfactual": "A clinician-confirmed high-risk feature under the chosen framework could favor neoadjuvant treatment instead of initial resection.",
            "counterfactualChoice": "tnt",
            "sequence": "Unkeyed, unassembled attempt; cannot appear in a runtime or mixed multi-part case."
          },
          "creationKind": "new",
          "conceptRelation": "new_identity",
          "previousConceptId": null,
          "conceptType": "management",
          "version": 2
        }
      ],
      "historicalAcuity": "stable",
      "version": 2
    }
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.serrated-dysplasia-surveillance.v1",
    "status": "parked",
    "attemptCount": 1,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.serrated-dysplasia-surveillance.v2",
    "currentQuestionVariantId": null,
    "correctChoice": null,
    "emittedInSidecar": false,
    "reason": "The accurate moderate/basic interval rule survives the clarity repair but has no accepted basic-purpose reference and no fair supported harder discriminator in this attempt.",
    "nextAction": "Manager may seek explicit basic-purpose acceptance or design a materially consequential specimen/procedure problem; do not restore decorative container complexity.",
    "caseDraft": {
      "slug": "serrated-specimen-map-park-r2",
      "name": "Nora Ellis",
      "age": 56,
      "sex": "Female",
      "complaint": "Polyp surveillance planning",
      "presentation": "{patientName}, a 56-year-old woman, attends clinic to reconcile outside polypectomy records.",
      "nodes": [
        {
          "slug": "serrated-dysplasia-surveillance",
          "conceptId": "concept.topic.colorectal-polyps-cancer.serrated-dysplasia-surveillance.v1",
          "title": "Surveillance after serrated dysplasia",
          "objective": "Use the correct specimen, dysplasia and complete-resection record to select USMSTF surveillance.",
          "update": "A 9-mm ascending-colon sessile serrated lesion with focal dysplasia was removed intact with complete excision documented during a complete, adequately prepared examination. No other lesion, prior neoplasia, relevant family history or hereditary syndrome is recorded.",
          "task": "Under USMSTF guidance, when should {patientName}'s next surveillance colonoscopy be planned?",
          "choices": [
            {
              "id": "three",
              "label": "Colonoscopy in three years",
              "temptation": "Use the dysplasia finding rather than size alone.",
              "rationale": "This is the supported dysplastic-serrated interval but remains a direct rule-recall exercise.",
              "reasonableWhen": "A sessile serrated lesion with dysplasia is completely removed at a high-quality examination.",
              "timingProfileId": "timing.test.lower_endoscopy"
            },
            {
              "id": "long",
              "label": "Colonoscopy in five to ten years",
              "temptation": "Apply the small nondysplastic serrated interval.",
              "rationale": "Dysplasia changes the applicable category.",
              "reasonableWhen": "One or two small sessile serrated lesions without dysplasia were completely removed.",
              "timingProfileId": "timing.test.lower_endoscopy"
            },
            {
              "id": "six",
              "label": "Colonoscopy in six months",
              "temptation": "Apply a large piecemeal scar interval.",
              "rationale": "Neither lesion size nor the intact removal method meets that pathway.",
              "reasonableWhen": "A lesion at least 20 mm was removed piecemeal.",
              "timingProfileId": "timing.test.lower_endoscopy"
            }
          ],
          "claims": [
            "serrated-dysplasia-surveillance",
            "piecemeal-surveillance"
          ],
          "explanation": "The decorative hyperplastic container has been removed. The remaining accurate surveillance lesson is a single rule; no key is emitted as an accepted difficult item.",
          "gate": {
            "cueAttack": "Removed the unrelated container rather than pretend it provided a consequential first inference. Three interval options remain parallel.",
            "stage": "Three first-surveillance colonoscopy intervals.",
            "steps": [
              "Recognize focal dysplasia in the removed serrated lesion.",
              "Apply its interval; this is a single category-to-rule task rather than two consequential inferences."
            ],
            "difficulty": "Not accepted as a scored resident-level item after the single revision attempt.",
            "closestChoice": "long",
            "decidingObservation": "Focal dysplasia is the direct interval determinant.",
            "consequence": "Overstated difficulty if a decorative provenance step were restored.",
            "deletionTest": "Deleting the second container changes nothing, confirming the review's finding; no cosmetic substitute is added.",
            "counterfactual": "Removing dysplasia from the single small serrated lesion would make the offered five-to-ten-year interval appropriate.",
            "counterfactualChoice": "long",
            "sequence": "Unkeyed, unassembled attempt; cannot appear in a runtime or mixed multi-part case."
          },
          "creationKind": "new",
          "conceptRelation": "new_identity",
          "previousConceptId": null,
          "conceptType": "management",
          "version": 2
        }
      ],
      "historicalAcuity": "stable",
      "version": 2
    }
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-nondiagnostic-diffusion.v1",
    "status": "parked",
    "attemptCount": 1,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-nondiagnostic-diffusion.v2",
    "currentQuestionVariantId": null,
    "correctChoice": null,
    "emittedInSidecar": false,
    "reason": "The one repair removes the cues but exposes an unverified technical procedure ranking. Parked rather than forcing full MRI repetition from response criteria.",
    "nextAction": "Obtain a clinician/radiologist-verified technical protocol or use this limitation as unscored context in a genuine response decision.",
    "caseDraft": {
      "slug": "rectal-diffusion-quality-park-r2",
      "name": "Vincent Reed",
      "age": 60,
      "sex": "Male",
      "complaint": "Response imaging review",
      "presentation": "{patientName}, a 60-year-old man, attends clinic after outside neoadjuvant rectal-cancer treatment.",
      "nodes": [
        {
          "slug": "response-nondiagnostic-diffusion",
          "conceptId": "concept.rectal-cancer.multimodal-response-assessment",
          "title": "Current multimodal rectal response assessment",
          "objective": "Reconcile the date and scope of response records before treatment decisions.",
          "update": "Current examination and endoscopy show a flat scar. T2 MRI shows a dark scar; diffusion imaging is distorted by artifact at the treated bed and cannot be interpreted there. A diagnostic replacement diffusion series was not obtained.",
          "task": "Which technical MRI plan should be considered for {patientName}'s local response assessment?",
          "choices": [
            {
              "id": "optimized",
              "label": "Obtain an optimized diffusion acquisition after protocol review",
              "temptation": "Repair the specific component.",
              "rationale": "Whether a limited optimized acquisition is sufficient depends on technical review not established by the cited response criteria.",
              "reasonableWhen": "An expert protocol review supports a component-specific repeat.",
              "timingProfileId": "timing.test.mri"
            },
            {
              "id": "full",
              "label": "Repeat the full rectal MRI response protocol",
              "temptation": "Replace the whole study.",
              "rationale": "The current sources do not establish that the adequate T2 component must be repeated rather than the affected component optimized.",
              "reasonableWhen": "The overall protocol or registration is inadequate and a full repeat is needed.",
              "timingProfileId": "timing.test.mri"
            },
            {
              "id": "expert",
              "label": "Obtain expert review of the acquisition and artifact",
              "temptation": "Assess the technical limitation before a repeat plan.",
              "rationale": "Expert review is credible; no verified case-specific rule ranks it against the two acquisition strategies here.",
              "reasonableWhen": "The protocol limitation and feasible correction need expert adjudication."
            }
          ],
          "claims": [
            "multimodal-response",
            "response-mri-sequences",
            "clinical-complete-response"
          ],
          "explanation": "No key is assigned: response criteria support diagnostic T2 and diffusion assessment but do not supply a universal artifact-management hierarchy.",
          "gate": {
            "cueAttack": "Removed impossible retrieval and whole-body PET. Scoped the alternatives to credible technical plans without claiming an unsupported full-repeat requirement.",
            "stage": "Three technical local MRI plans.",
            "steps": [
              "Identify which acquired observation is unreliable.",
              "Choose a technical correction only under a verified acquisition-specific protocol rather than a named-missing-action shortcut."
            ],
            "difficulty": "Not accepted as a scored resident-level item after the single revision attempt.",
            "closestChoice": "expert",
            "decidingObservation": "Diffusion is nondiagnostic, but adequate T2 imaging alone does not determine the necessary repeat scope.",
            "consequence": "An unsupported imaging protocol could be taught as universally required.",
            "deletionTest": "Artifact location establishes the limitation; it does not establish the hierarchy of limited acquisition, full repeat and expert review.",
            "counterfactual": "If expert technical review established that all local sequences were degraded, a full protocol repeat would become the supported acquisition scope.",
            "counterfactualChoice": "full",
            "sequence": "Unkeyed, unassembled attempt; cannot appear in a runtime or mixed multi-part case."
          },
          "creationKind": "new",
          "conceptRelation": "preserved",
          "previousConceptId": null,
          "conceptType": "workup",
          "version": 2
        }
      ],
      "historicalAcuity": "stable",
      "version": 2
    }
  }
];
export const CPC_ITEM_STATUSES = [
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.positive-fit-negative-repeat.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.positive-fit-negative-repeat.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.positive-fit-negative-repeat.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.biopsy-site-discordance.v1",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.biopsy-site-discordance.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "The permission cue is repaired, but a fair harder biopsy-versus-excision choice cannot be keyed from the current lesion facts. Retained as an unscored sampling-provenance teaching point."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.cecum-versus-adequacy.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.cecum-versus-adequacy.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.cecum-versus-adequacy.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.piecemeal-scar-surveillance.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.piecemeal-scar-surveillance.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.piecemeal-scar-surveillance.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.intact-low-risk-specimen.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.intact-low-risk-specimen.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.intact-low-risk-specimen.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.stalk-local-clearance.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.stalk-local-clearance.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.vascular-channel-regional-resection.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.vascular-channel-regional-resection.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.transected-front-regional-resection.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.transected-front-regional-resection.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.nonlifting-after-tattoo.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.nonlifting-after-tattoo.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.nonlifting-after-tattoo.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.intramucosal-versus-t1.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.intramucosal-versus-t1.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.fap-diffuse-rectal-burden.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.fap-diffuse-rectal-burden.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.fap-retained-rectum-progression.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.fap-retained-rectum-progression.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.fap-retained-rectum-progression.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.fap-poor-sphincter-end-stoma.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.fap-poor-sphincter-end-stoma.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.rectal-local-mri.v1",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.rectal-local-mri.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "The attempted repair resolves the obvious wording and category cues but leaves a one-rule modality item. No accepted basic-purpose reference exists."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.rectal-high-risk-tnt.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.rectal-high-risk-tnt.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.early-rectal-eus.v1",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.early-rectal-eus.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "The revision removes the cues and inaccurate implication of perfect EUS resolution but cannot establish one best harder route from verified facts."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.t2-after-local-excision.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.t2-after-local-excision.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-stale-mri.v1",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-stale-mri.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revision leaves a date-only completion rule. It is parked rather than represented as a genuinely two-step scored response item."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-acquired-not-exported.v1",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-acquired-not-exported.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "The single attempt resolves the chronology and transfer wording but does not make a genuine two-step clinical decision. Parked as an unscored provenance lesson."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.regrowth-salvage-resection.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.regrowth-salvage-resection.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.above-reflection-sequence.v1",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.above-reflection-sequence.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "Fairness remains unresolved across conditional upper-rectal pathways. Parked unkeyed for Melissa; no invented extension or margin cutoff is used."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.adherent-bladder-en-bloc.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.few-nodes-specimen-reassessment.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.few-nodes-specimen-reassessment.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.few-nodes-specimen-reassessment.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.deposit-with-negative-nodes.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.deposit-with-negative-nodes.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v1",
    "reviewVerdict": "FAIL",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.serrated-dysplasia-surveillance.v1",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.serrated-dysplasia-surveillance.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "The accurate moderate/basic interval rule survives the clarity repair but has no accepted basic-purpose reference and no fair supported harder discriminator in this attempt."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.advanced-baseline-normal-surveillance.v1",
    "reviewVerdict": "REVISE",
    "status": "revised",
    "attemptCount": 1,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.advanced-baseline-normal-surveillance.v2",
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.advanced-baseline-normal-surveillance.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "One revised v2 candidate addresses the independent findings; author check is not an independent PASS."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.lesions-not-fragments.v1",
    "reviewVerdict": "PASS",
    "status": "pass-preserved",
    "attemptCount": 0,
    "currentQuestionVariantId": "question.topic.colorectal-polyps-cancer.lesions-not-fragments.v1",
    "attemptedQuestionVariantId": null,
    "independentReviewCurrent": "PASS_exact_question_and_visible_wording",
    "reason": "Exact reviewed question and visible case/node wording preserved; no optional review suggestion applied."
  },
  {
    "reviewedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-nondiagnostic-diffusion.v1",
    "reviewVerdict": "REVISE",
    "status": "parked",
    "attemptCount": 1,
    "currentQuestionVariantId": null,
    "attemptedQuestionVariantId": "question.topic.colorectal-polyps-cancer.response-nondiagnostic-diffusion.v2",
    "independentReviewCurrent": "not_yet_reviewed",
    "reason": "The one repair removes the cues but exposes an unverified technical procedure ranking. Parked rather than forcing full MRI repetition from response criteria."
  }
];
export const CPC_COMPOSITION_PROPOSALS = [
  {
    "originalCaseId": "case.topic.colorectal-polyps-cancer.discordant-stool-record.v1",
    "originalQuestionVariantIds": [
      "question.topic.colorectal-polyps-cancer.positive-fit-negative-repeat.v1",
      "question.topic.colorectal-polyps-cancer.biopsy-site-discordance.v1"
    ],
    "enabled": false,
    "reason": "No case may mix exact PASS with pending or parked nodes. Recomposition requires independent PASS for every exact scored node and full sequence review."
  },
  {
    "originalCaseId": "case.topic.colorectal-polyps-cancer.incomplete-colonoscopy.v1",
    "originalQuestionVariantIds": [
      "question.topic.colorectal-polyps-cancer.cecum-versus-adequacy.v1",
      "question.topic.colorectal-polyps-cancer.advanced-adenoma-surveillance.v1"
    ],
    "enabled": false,
    "reason": "No case may mix exact PASS with pending or parked nodes. Recomposition requires independent PASS for every exact scored node and full sequence review."
  },
  {
    "originalCaseId": "case.topic.colorectal-polyps-cancer.large-polyp-referral.v1",
    "originalQuestionVariantIds": [
      "question.topic.colorectal-polyps-cancer.large-polyp-expert-resection.v1",
      "question.topic.colorectal-polyps-cancer.piecemeal-scar-surveillance.v1"
    ],
    "enabled": false,
    "reason": "No case may mix exact PASS with pending or parked nodes. Recomposition requires independent PASS for every exact scored node and full sequence review."
  },
  {
    "originalCaseId": "case.topic.colorectal-polyps-cancer.fap-rectal-sparing.v1",
    "originalQuestionVariantIds": [
      "question.topic.colorectal-polyps-cancer.fap-rectal-sparing-ira.v1",
      "question.topic.colorectal-polyps-cancer.fap-retained-rectum-progression.v1"
    ],
    "enabled": false,
    "reason": "No case may mix exact PASS with pending or parked nodes. Recomposition requires independent PASS for every exact scored node and full sequence review."
  },
  {
    "originalCaseId": "case.topic.colorectal-polyps-cancer.rectal-initial-staging.v1",
    "originalQuestionVariantIds": [
      "question.topic.colorectal-polyps-cancer.rectal-local-mri.v1",
      "question.topic.colorectal-polyps-cancer.rectal-high-risk-tnt.v1"
    ],
    "enabled": false,
    "reason": "No case may mix exact PASS with pending or parked nodes. Recomposition requires independent PASS for every exact scored node and full sequence review."
  },
  {
    "originalCaseId": "case.topic.colorectal-polyps-cancer.early-rectal-excision.v1",
    "originalQuestionVariantIds": [
      "question.topic.colorectal-polyps-cancer.early-rectal-eus.v1",
      "question.topic.colorectal-polyps-cancer.t2-after-local-excision.v1"
    ],
    "enabled": false,
    "reason": "No case may mix exact PASS with pending or parked nodes. Recomposition requires independent PASS for every exact scored node and full sequence review."
  },
  {
    "originalCaseId": "case.topic.colorectal-polyps-cancer.colon-postoperative-pathology.v1",
    "originalQuestionVariantIds": [
      "question.topic.colorectal-polyps-cancer.few-nodes-specimen-reassessment.v1",
      "question.topic.colorectal-polyps-cancer.deposit-with-negative-nodes.v1"
    ],
    "enabled": false,
    "reason": "No case may mix exact PASS with pending or parked nodes. Recomposition requires independent PASS for every exact scored node and full sequence review."
  },
  {
    "originalCaseId": "case.topic.colorectal-polyps-cancer.metastatic-primary-strategy.v1",
    "originalQuestionVariantIds": [
      "question.topic.colorectal-polyps-cancer.asymptomatic-incurable-primary.v1",
      "question.topic.colorectal-polyps-cancer.perforation-overrides-systemic-first.v1"
    ],
    "enabled": false,
    "reason": "No case may mix exact PASS with pending or parked nodes. Recomposition requires independent PASS for every exact scored node and full sequence review."
  }
];
export const CPC_REVIEW_INPUT = {
  "path": "docs/research/question-topic-colorectal-polyps-cancer-review-20261111.json",
  "sha256": "20acba0aa5cb233abbb31324e2a18d4234a68be47d3f0016faac99fbc368afd0"
};
const passIds = new Set(CPC_ITEM_STATUSES.filter(s => s.status === "pass-preserved").map(s => s.reviewedQuestionVariantId));
const caseId = (c: CPCCaseDraft) => `case.topic.${CPC_TOPIC}.${c.slug}.v${c.version ?? 1}`;
const nodeId = (n: CPCNodeDraft) => `node.topic.${CPC_TOPIC}.${n.slug}.v${n.version ?? 1}`;
const questionId = (n: CPCNodeDraft) => `question.topic.${CPC_TOPIC}.${n.slug}.v${n.version ?? 1}`;
const choiceId = (n: CPCNodeDraft, c: CPCChoice) => `choice.cpc.${n.slug}.${c.id}.v${n.version ?? 1}`;
const claimsFor = (n: CPCNodeDraft) => n.claims.map(claimId);
const labelsFor = (n: CPCNodeDraft) => [...new Set(CPC_CLAIMS.filter(c => claimsFor(n).includes(c.id)).flatMap(c => c.sourceIds))].map(id => CPC_SOURCES.find(s => s.id === id)!.title);

const reviewFor = (record: { version?: 2 }) => record.version === 2 ? CPC_ROUND2_DRAFT : CPC_DRAFT;
const reviewForId = (id: string) => id.endsWith(".v2") ? CPC_ROUND2_DRAFT : CPC_DRAFT;
function buildCpc(items: CPCCaseDraft[], sources: ClinicalSource[]) {
const CPC_QUESTIONS: QuestionVariant[] = items.flatMap(c => c.nodes.map(n => ({ ...reviewFor(n),
  id: questionId(n), conceptId: n.conceptId, stem: n.task, explanation: n.explanation,
  supportingEvidenceClaimIds: claimsFor(n), ...(n.exhibit ? { exhibit: n.exhibit } : {}),
  answerChoices: n.choices.map(a => ({ id: choiceId(n, a), label: a.label, isCorrect: a.id === n.correctChoice,
    rationale: a.rationale, distractorRationale: a.id === n.correctChoice ? null : a.rationale })),
})));
const CPC_CONCEPTS: TestedConcept[] = [...new Map(items.flatMap(c => c.nodes.map(n => [n.conceptId, {
  id: n.conceptId, displayName: n.title, learningObjective: n.objective, earliestFacilityStage: 1, conceptType: n.conceptType,
}] as const))).values()];
const CPC_AUTHORING_CONCEPTS = CPC_CONCEPTS.map(c => {
  const ns = items.flatMap(i => i.nodes).filter(n => n.conceptId === c.id);
  return { ...reviewFor(ns[0]!), ...c, educationalTier: 1, previousConceptId: ns[0]!.previousConceptId,
    conceptRelation: ns[0]!.conceptRelation, evidenceClaimIds: [...new Set(ns.flatMap(claimsFor))],
    historyMigration: "None. Unchanged meanings reuse stable IDs. New meanings keep prior definitions and histories separate." };
});
const CPC_CASES: SyntheticClinicalCase[] = items.map(c => {
  const sourceLabels = [...new Set(c.nodes.flatMap(labelsFor))];
  const demographics = { ageYears: c.age, sexLabel: c.sex };
  return { id: caseId(c), displayName: `${c.name}: ${c.complaint}`, patientPresentationVariantId: `presentation.cpc.${c.slug}.v${c.version ?? 1}`,
    releasePointId: "release.l0.clinic_evaluation", patientDisplayName: c.name, prototypeDemographics: demographics,
    chiefComplaint: c.complaint, presentation: c.presentation,
    approvedInstantiationProfiles: [{ id: `profile.cpc.${c.slug}.v${c.version ?? 1}`, prototypeDemographics: demographics, chiefComplaint: c.complaint, presentation: c.presentation }],
    tutorialEligible: false, routineEligible: true, earliestFacilityStage: 1, requiredClinicalSetting: "clinic", requiredCapabilityIds: [],
    rewardTierId: "reward.clinic_basic", sourceLabels,
    decisionNodes: c.nodes.map((n, index) => ({ id: nodeId(n), questionVariantId: questionId(n), primaryConceptId: n.conceptId,
      currentUpdate: n.update, stem: n.task, ...(n.exhibit ? { exhibit: n.exhibit } : {}), shuffleAnswers: true,
      answerChoices: n.choices.map(a => ({ id: choiceId(n, a), label: a.label, isCorrect: a.id === n.correctChoice, rationale: a.rationale, serviceRequest: null })),
      explanation: n.explanation, sourceLabels: labelsFor(n), resultGateAfter: null,
      terminalDispositions: index === c.nodes.length - 1 ? n.choices.filter(a => a.id !== n.correctChoice).map(a => ({ answerChoiceId: choiceId(n, a),
        kind: "no_terminal_outcome" as const, consequenceNarrative: "The clinic review records the proposed plan and its clinical reasoning.",
        clinicalRationale: a.rationale, sourceLabels: labelsFor(n) })) : [],
    })), learningSummary: "Interpret the current findings in their actual clinical phase before choosing the next plan.",
  };
});
const CPC_CASE_REVIEWS = items.map(c => ({ ...reviewFor(c), caseId: caseId(c), educationalTier: 1,
  acuity: "stable", historicalAcuity: c.historicalAcuity, earliestFacilityStage: 1, requiredClinicalSetting: "clinic", requiredCapabilityIds: [],
  evidenceClaimIds: [...new Set(c.nodes.flatMap(claimsFor))], encounterMode: "outside-records-review-in-clinic" }));
const CPC_TIMING_ENTRIES: AnswerChoiceTimingRegistryEntry[] = items.flatMap(c => c.nodes.map(n => ({
  caseId: caseId(c), nodeId: nodeId(n), questionVariantId: questionId(n),
  classification: n.choices.some(a => a.timingProfileId) ? { kind: "test_choices" as const, choices: n.choices.map(a => ({
    choiceId: choiceId(n, a), choiceLabel: a.label,
    timing: a.timingProfileId ? { kind: "test" as const, timingProfileId: a.timingProfileId } : { kind: "no_test" as const },
  })) } : { kind: "no_test" as const },
})));
const CPC_ORDER_PROPOSALS = CPC_TIMING_ENTRIES.flatMap(t => t.classification.kind === "test_choices"
  ? t.classification.choices.filter(a => a.timing.kind === "test").map(a => ({ ...reviewForId(t.questionVariantId),
    caseId: t.caseId, nodeId: t.nodeId, questionVariantId: t.questionVariantId, choiceId: a.choiceId, choiceLabel: a.choiceLabel,
    timing: a.timing, disposition: { kind: "not_executed", reason: "future_planned" }, serviceRequest: null, resultGateAfter: null,
  })) : []);
const CPC_AUTHOR_CHECKS = items.flatMap(c => c.nodes.map(n => ({ ...reviewFor(n), caseId: caseId(c), nodeId: nodeId(n), questionVariantId: questionId(n),
  reviewRole: "author_self_check_only", independentPass: false, clinicalApproval: false, finiteProfileCount: 1,
  ...n.gate, fiveChecks: [
    { check: "Cover-the-key cue attack", record: n.gate.cueAttack },
    { check: "One decision stage and category", record: n.gate.stage },
    { check: "Two consequential supported reasoning steps", record: n.gate.steps.join(" Then: ") },
    { check: "Predicted resident difficulty", record: n.gate.difficulty },
    { check: "One defensible key and counterfactual", record: `${n.gate.decidingObservation} ${n.gate.counterfactual}` },
  ], optionAudit: n.choices.map(a => ({ choiceId: choiceId(n, a), temptation: a.temptation, whyRankedHere: a.rationale,
    reasonableWhen: a.reasonableWhen, evidenceClaimIds: claimsFor(n) })),
})));
const CPC_STATEMENT_MAPPINGS = items.flatMap(c => c.nodes.map(n => ({ ...reviewFor(n),
  caseId: caseId(c), nodeId: nodeId(n), questionVariantId: questionId(n),
  constructedObservations: "Original fictional patients, specimen maps, dates, findings and responses; these are applications, not empirical rates or newly invented clinical cutoffs.",
  fieldMappings: ["presentation", "prototypeDemographics", "approvedInstantiationProfiles", "currentUpdate", "exhibit", "stem", "explanation", "authorChecks", ...n.choices.map(a => `answerChoices.${choiceId(n, a)}.rationale`)].map(field => ({ field, evidenceClaimIds: claimsFor(n) })),
  evidenceClaimIds: claimsFor(n),
})));
const CPC_SOURCE_LINKS = sources.map(s => ({ ...CPC_DRAFT, sourceId: s.id, label: s.title,
  href: s.officialUrl!, target: "_blank" as const, rel: "noopener noreferrer" as const, referrerPolicy: "no-referrer" as const }));
return { questions: CPC_QUESTIONS, cases: CPC_CASES, concepts: CPC_CONCEPTS, authoringConcepts: CPC_AUTHORING_CONCEPTS, caseReviews: CPC_CASE_REVIEWS, selfChecks: CPC_AUTHOR_CHECKS, statementMappings: CPC_STATEMENT_MAPPINGS, timing: CPC_TIMING_ENTRIES, orders: CPC_ORDER_PROPOSALS, links: CPC_SOURCE_LINKS };
}
export const CPC_REVIEWED_V1_CATALOG = buildCpc(CPC_REVIEWED_V1_ITEMS, CPC_REVIEWED_V1_SOURCES);
const passItems = CPC_REVIEWED_V1_ITEMS.filter(c => c.nodes.some(n => passIds.has(questionId(n)))).map(c => ({ ...c, nodes: c.nodes.filter(n => passIds.has(questionId(n))) }));
export const CPC_ITEMS: CPCCaseDraft[] = [...passItems, ...CPC_REVISION_ITEMS];
const active = buildCpc(CPC_ITEMS, CPC_SOURCES);
export const CPC_QUESTIONS: QuestionVariant[] = [...CPC_REVIEWED_V1_CATALOG.questions.filter(q => passIds.has(q.id)), ...active.questions.filter(q => !passIds.has(q.id))];
/** Preserve original headers and every visible PASS node field. Only final-node terminal metadata is added when a former first node becomes a singleton. */
export const CPC_CASES: SyntheticClinicalCase[] = active.cases.map(c => {
  if (!c.decisionNodes.every(n => passIds.has(n.questionVariantId!))) return c;
  const original = CPC_REVIEWED_V1_CATALOG.cases.find(o => o.id === c.id)!;
  return { ...original, decisionNodes: original.decisionNodes.filter(n => passIds.has(n.questionVariantId!)).map(n => ({ ...n, terminalDispositions: n.terminalDispositions.length ? n.terminalDispositions : c.decisionNodes.find(a => a.id === n.id)!.terminalDispositions })) };
});
export const CPC_CONCEPTS = active.concepts;
export const CPC_AUTHORING_CONCEPTS = active.authoringConcepts;
export const CPC_CASE_REVIEWS = active.caseReviews;
export const CPC_TIMING_ENTRIES = active.timing;
export const CPC_ORDER_PROPOSALS = active.orders;
export const CPC_AUTHOR_CHECKS = active.selfChecks;
export const CPC_STATEMENT_MAPPINGS = active.statementMappings;
export const CPC_SOURCE_LINKS = active.links;
export const CPC_PREVIEW_RELEASE = validateSyntheticClinicalRelease({ id: "clinical.synthetic.prototype.v1", schemaVersion: 1, publicationStatus: "synthetic_unapproved_prototype", disclaimer: "Synthetic educational authoring preview. AI-assisted drafts need Melissa Rowland's exact clinical review; not clinically approved.", concepts: CPC_CONCEPTS, cases: CPC_CASES });
export const CPC_MANIFEST = { ...CPC_ROUND2_DRAFT, topicSlug: CPC_TOPIC, reviewDisplay: "key shown first for review only", questionCount: CPC_QUESTIONS.length, caseCount: CPC_CASES.length, conceptCount: CPC_CONCEPTS.length, reviewedItemCount: CPC_ITEM_STATUSES.length, passPreserved: 13, revised: 13, parked: 8, clinicalApproval: false, independentPass: false, managerAccepted: false, publicReleaseAuthorized: false, executableOrdersAdded: false, selectionLimitation: "Standalone cases only. All original multi-part proposals are disabled until every exact scored node passes independent review and sequence review.", integrationDependencies: ["Manager reviews each revised v2; no author check confers independent PASS.", "Melissa Rowland remains the named clinician; all new clinical versions need her exact sign-off.", "Preserve all historical definitions, frozen approvals, saved cases and FSRS history; no migration is performed.", "Install exact timing/order identities only after acceptance. No orders are executed by this sidecar.", "Owner-held rectal near-complete response, disputed close-margin policy and preparation scheduling hold remain unchanged."] };
