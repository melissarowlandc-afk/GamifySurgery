import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, source, type CaseSpec, type DevelopmentServiceContract } from "./batch-helpers";

const ESSR = "source.essr.soft-tissue-imaging.2024";
const NCI = "source.nci.soft-tissue-sarcoma-pdq.2025";
export const SOFT_TISSUE_MASS_SERVICE_CONTRACTS: DevelopmentServiceContract[] = [{ serviceId: "service.extremity_mri", allowedRouteIds: ["route.extremity_mri.outsourced"], delivery: "new_external_contract_required" }];
export const SOFT_TISSUE_MASS_CLAIMS = [
  claim({ id: "claim.soft-tissue-mass.mri", statement: "MRI is appropriate for local characterization of a deep, enlarging, or ultrasound-indeterminate extremity soft-tissue mass before biopsy.", sourceIds: [ESSR, NCI], evidenceCategory: "evaluation", certainty: "high", limitation: "MRI can characterize and guide planning but cannot by itself prove sarcoma.", applicablePopulation: "Stable adults with a deep, enlarging, or ultrasound-indeterminate extremity soft-tissue mass.", lastCheckedOn: "2026-09-09" }),
  claim({ id: "claim.soft-tissue-mass.planned-biopsy", statement: "A suspicious extremity soft-tissue mass should reach an experienced sarcoma team before a planned image-guided core biopsy so the biopsy path respects a future surgical approach.", sourceIds: [ESSR, NCI], evidenceCategory: "management", certainty: "high", limitation: "Biopsy technique and selected incisional approaches remain specialist decisions; imaging suspicion is not a tissue diagnosis.", applicablePopulation: "Adults whose extremity mass remains suspicious after local MRI characterization.", lastCheckedOn: "2026-09-09" }),
];
export const SOFT_TISSUE_MASS_SOURCES = linkSourcesToClaims([
  source({ id: ESSR, title: "Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where?", completeCitation: "Noebauer-Huhmann IM, Vanhoenacker FM, Vilanova JC, et al. Soft tissue tumor imaging in adults: European Society of Musculoskeletal Radiology-Guidelines 2023-overview, and primary local imaging: how and where? European Radiology. 2024;34:4427-4437. doi:10.1007/s00330-023-10425-5.", organizationOrJournal: "European Radiology", authors: ["Noebauer-Huhmann IM", "Vanhoenacker FM", "Vilanova JC", "et al."], publicationYear: 2024, doi: "10.1007/s00330-023-10425-5", pmid: null, officialUrl: "https://link.springer.com/article/10.1007/s00330-023-10425-5", accessedOn: "2026-09-09", sourceClass: "peer_reviewed_guideline", licenseLabel: "Creative Commons Attribution 4.0 International", reuseStatus: "cc_by_4_0", reuseNotes: "Original modified factual synthesis; no algorithms, figures, or third-party art copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .", authorityAssessment: "Peer-reviewed ESSR expert consensus directly checked for MRI characterization, tumor-center referral before intervention, and planned image-guided biopsy.", usageRole: "both" }),
  source({ id: NCI, title: "Soft Tissue Sarcoma Treatment, Health Professional Version", completeCitation: "PDQ Adult Treatment Editorial Board. Soft Tissue Sarcoma Treatment, Health Professional Version. Bethesda, MD: National Cancer Institute. Updated February 21, 2025. PMID:26389481.", organizationOrJournal: "National Cancer Institute PDQ", authors: ["PDQ Adult Treatment Editorial Board"], publicationYear: 2025, doi: null, pmid: "26389481", officialUrl: "https://www.cancer.gov/types/soft-tissue-sarcoma/hp/adult-soft-tissue-treatment-pdq", accessedOn: "2026-09-09", sourceClass: "government_guidance", licenseLabel: "United States government work; NCI reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only; no source prose, imagery, agency marks, or PDQ branding reproduced.", authorityAssessment: "NCI expert editorial synthesis directly checked for imaging before intervention, planned biopsy, and experienced pathology review; PDQ is independent of NCI policy.", usageRole: "both" }),
], SOFT_TISSUE_MASS_CLAIMS);

const scenarios = [
  ["deep-thigh", 39, "I have a deep thigh mass that is enlarging.", "has noticed a deep thigh mass enlarging over several months. Examination confirms a firm deep lesion; they have no acute neurovascular symptoms."],
  ["upper-arm", 52, "I have an enlarging upper-arm mass.", "reports an upper-arm mass that has enlarged. Ultrasound could not confidently characterize its full extent, and they remain clinically stable."],
  ["calf-indeterminate", 46, "I have a calf mass that ultrasound could not characterize.", "has a persistent calf mass. Ultrasound is indeterminate and suggests the lesion extends deeper than the superficial tissues."],
  ["forearm-progressive", 63, "I have a progressively enlarging forearm mass.", "has a progressively enlarging forearm mass with uncertain tissue characteristics after initial ultrasound. Distal function and perfusion are intact."],
] as const;
const cases: CaseSpec[] = scenarios.map(([slug, age, complaint, story], index) => {
  const n = index + 1;
  const result = "Extremity MRI defines the lesion's local extent and shows features concerning for an aggressive soft-tissue tumor. Imaging is suspicious but does not establish a histologic diagnosis.";
  return { id: `case.soft-tissue-mass.${slug}`, displayName: "Progressive extremity mass", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 4], sexLabels: ["Female", "Male"], stage: 1, nodes: [
    { conceptId: "concept.soft-tissue-mass.extremity-mri", stem: "Which imaging study best characterizes this mass locally before tissue sampling?", choices: [
      { id: `extremity_mri_${n}`, label: "Dedicated MRI of the involved extremity", isCorrect: true, serviceId: "service.extremity_mri", rationale: "MRI characterizes local extent and tissue relationships before intervention." },
      { id: `repeat_ultrasound_${n}`, label: "Focused ultrasound of the mass", serviceId: "service.ultrasound", rationale: "Ultrasound has already been indeterminate or the lesion is deep and enlarging." },
      { id: `plain_radiograph_${n}`, label: "Plain radiographs of the involved extremity", rationale: "Radiographs can show bone or mineralization but do not provide the needed soft-tissue characterization." },
      { id: `noncontrast_ct_${n}`, label: "Noncontrast CT of the involved extremity", serviceId: "service.ct", rationale: "CT is not the preferred local soft-tissue characterization study in this scenario." },
    ], explanation: "A deep, enlarging, or ultrasound-indeterminate extremity mass warrants dedicated MRI for local characterization before biopsy. MRI guides planning but does not prove a histologic diagnosis.", claimIds: ["claim.soft-tissue-mass.mri"], gate: { id: `gate.soft-tissue-mass.mri.${n}`, serviceId: "service.extremity_mri", pendingLabel: "Extremity MRI pending", resultNarrative: result, routeIds: ["route.extremity_mri.outsourced"] } },
    { conceptId: "concept.soft-tissue-mass.specialist-planned-biopsy", currentUpdate: result, stem: "Which tissue-diagnosis plan best protects the patient's later definitive treatment options?", choices: [
      { id: `sarcoma_core_${n}`, label: "Sarcoma-team-planned image-guided core biopsy", isCorrect: true, rationale: "Specialist planning aligns the biopsy path with a possible future resection." },
      { id: `office_excision_${n}`, label: "Office excision of the mass", rationale: "An unplanned excision can compromise later definitive surgical planning." },
      { id: `random_fna_${n}`, label: "Fine-needle aspiration before specialist referral", rationale: "The route and method should be planned by the specialist team to preserve future options." },
      { id: `open_biopsy_${n}`, label: "Incisional biopsy before sarcoma-center review", rationale: "An incision chosen outside the definitive treatment plan can complicate later resection." },
    ], explanation: "Suspicious MRI should prompt referral to an experienced sarcoma team before biopsy. A planned image-guided core biopsy can obtain tissue while placing the biopsy tract where it can be managed within a future surgical approach; MRI suspicion alone is not sarcoma confirmation.", claimIds: ["claim.soft-tissue-mass.planned-biopsy"] },
  ] };
});
export const SOFT_TISSUE_MASS_CONCEPTS = [
  concept({ id: "concept.soft-tissue-mass.extremity-mri", educationalTier: 1, displayName: "MRI characterization of a concerning extremity mass", learningObjective: "Select dedicated extremity MRI before biopsy for a deep, enlarging, or ultrasound-indeterminate soft-tissue mass while recognizing that imaging does not prove sarcoma.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.soft-tissue-mass.mri"] }),
  concept({ id: "concept.soft-tissue-mass.specialist-planned-biopsy", educationalTier: 1, displayName: "Specialist-planned biopsy of a suspicious soft-tissue mass", learningObjective: "Refer a suspicious extremity mass to an experienced sarcoma team for planned image-guided core biopsy that preserves the future surgical approach.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.soft-tissue-mass.planned-biopsy"] }),
];
const family = createDevelopmentFamily({ concepts: SOFT_TISSUE_MASS_CONCEPTS, cases, sourceLabels: ["Noebauer-Huhmann et al., ESSR soft-tissue imaging guideline (2024), CC BY 4.0", "NCI PDQ Soft Tissue Sarcoma Treatment (updated 2025)"] });
export const SOFT_TISSUE_MASS_TESTED_CONCEPTS = family.testedConcepts;
export const SOFT_TISSUE_MASS_QUESTIONS = family.questions;
export const SOFT_TISSUE_MASS_CASES = family.cases;
export const SOFT_TISSUE_MASS_CASE_REVIEWS = family.caseReviews;


