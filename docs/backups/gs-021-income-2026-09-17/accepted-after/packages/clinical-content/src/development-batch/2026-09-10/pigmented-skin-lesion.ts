import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, NEEDS_REVIEW, source, type CaseSpec } from "./batch-helpers";

const NCI = "source.sc.nci-melanoma-pdq-2025";
const AAD = "source.sc.aad-melanoma-highlights";

export const PIGMENTED_SKIN_LESION_CLAIMS = [
  claim({ id: "claim.pigmented-skin-lesion.complete-diagnostic-biopsy", statement: "A small accessible pigmented lesion concerning for melanoma should usually undergo complete diagnostic excision with narrow clinical margins and sufficient depth for histologic microstaging.", sourceIds: [NCI, AAD], evidenceCategory: "evaluation", certainty: "moderate", limitation: "Partial biopsy can be appropriate for selected large or anatomically difficult lesions, and this claim does not prohibit every properly performed deep saucerization technique or define an exact diagnostic margin.", applicablePopulation: "Stable adults with a small accessible evolving superficial pigmented lesion and no prior tissue diagnosis.", lastCheckedOn: "2026-09-10" }),
  claim({ id: "claim.melanoma.sentinel-node-staging", statement: "For clinically node-negative melanoma of intermediate thickness, sentinel lymph-node biopsy should be discussed for pathological regional staging alongside definitive wide-excision planning.", sourceIds: [NCI, AAD], evidenceCategory: "management", certainty: "moderate", limitation: "Sentinel-node biopsy is not complete nodal dissection, does not itself prove metastatic disease, and is not presented as guaranteeing survival benefit. Exact margin rules and systemic treatment are outside this claim.", applicablePopulation: "Stable adults with biopsy-confirmed intermediate-thickness invasive melanoma and no clinically palpable regional nodes.", lastCheckedOn: "2026-09-10" }),
];

export const PIGMENTED_SKIN_LESION_SOURCES = linkSourcesToClaims([
  source({ id: NCI, title: "Melanoma Treatment (PDQ), Health Professional Version", completeCitation: "PDQ Adult Treatment Editorial Board. Melanoma Treatment (PDQ), Health Professional Version. National Cancer Institute. Updated 2025-05-02. PMID:26389469. Accessed 2026-09-10.", organizationOrJournal: "National Cancer Institute PDQ", authors: ["PDQ Adult Treatment Editorial Board"], publicationYear: 2025, doi: null, pmid: "26389469", officialUrl: "https://www.cancer.gov/types/skin/hp/melanoma-treatment-pdq", accessedOn: "2026-09-10", sourceClass: "government_guidance", licenseLabel: "United States government factual material; NCI and PDQ reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only. No PDQ-branded modified summary, source prose, third-party image, table, or agency mark reproduced; credit NCI without endorsement.", authorityAssessment: "Current government professional evidence summary directly checked for diagnostic biopsy and pathological sentinel-node staging in intermediate-thickness clinically node-negative melanoma.", usageRole: "evidence" }),
  source({ id: AAD, title: "Melanoma clinical guideline (Guideline highlights)", completeCitation: "American Academy of Dermatology. Melanoma clinical guideline: Guideline highlights. Undated professional education page. Accessed 2026-09-10.", organizationOrJournal: "American Academy of Dermatology", authors: ["American Academy of Dermatology"], publicationYear: null, doi: null, pmid: null, officialUrl: "https://www.aad.org/member/clinical-quality/guidelines/melanoma", accessedOn: "2026-09-10", sourceClass: "open_educational_resource", licenseLabel: "Copyrighted society professional education; attributed noncommercial targeted factual use", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "Original factual synthesis and citation only for local educational development. No source prose, figures, third-party database content, or marks reproduced; this page is not the unaccessed full JAAD guideline.", authorityAssessment: "Society guideline highlights directly checked as a corroborating professional source for adequate biopsy histology and selected sentinel-node biopsy for pathological regional staging.", usageRole: "cross_check" }),
], PIGMENTED_SKIN_LESION_CLAIMS);

const labels = ["NCI melanoma PDQ professional summary (updated May 2025)", "AAD melanoma guideline highlights (undated)"];
const biopsyChoices = (n: number) => [
  { id: `excisional_${n}`, label: "Complete excisional biopsy", isCorrect: true, serviceId: "service.skin_excisional_biopsy", rationale: "The lesion is small and accessible, so narrow-margin full-depth sampling can preserve microstaging information." },
  { id: `superficial_shave_${n}`, label: "Superficial shave biopsy", rationale: "A superficial sample can truncate the lesion and compromise microstaging." },
  { id: `partial_punch_${n}`, label: "Partial punch biopsy", rationale: "The small accessible lesion can be completely sampled rather than selecting one potentially unrepresentative edge." },
  { id: `wide_excision_${n}`, label: "Definitive wide local excision", rationale: "Diagnostic microstaging should guide definitive planning rather than beginning with an unselected wide excision." },
] as const;
const stagingChoices = (n: number) => [
  { id: `sentinel_node_${n}`, label: "Sentinel lymph-node biopsy with definitive excision", isCorrect: true, rationale: "The intermediate-thickness melanoma and clinically negative nodal examination support a sentinel-node staging discussion." },
  { id: `complete_dissection_${n}`, label: "Complete regional lymph-node dissection with definitive excision", rationale: "Clinically negative nodes do not justify automatic complete nodal dissection." },
  { id: `imaging_only_${n}`, label: "Regional nodal ultrasound surveillance with definitive excision", rationale: "Ultrasound surveillance does not replace the appropriate sentinel-node staging discussion for this pathology." },
  { id: `no_staging_${n}`, label: "Clinical nodal follow-up with definitive excision", rationale: "The pathology warrants discussion of pathological regional staging." },
] as const;

const stories = [
  ["changing-back-lesion", 46, "I noticed a mole on my back change color.", "has a small accessible pigmented lesion on the upper back that has evolved in color and border. It is superficial and can be removed completely; regional nodes are not palpable, and no diagnosis has been made."],
  ["shoulder-border", 58, "I noticed a shoulder spot with a changing border.", "presents with a small accessible superficial shoulder lesion with new border asymmetry and color variation. There is no prior biopsy and no palpable regional adenopathy."],
  ["calf-growth", 39, "I noticed a dark spot on my calf enlarge.", "reports evolution of a small accessible pigmented calf lesion with asymmetric color. The entire lesion can be sampled locally, and regional nodal examination is clinically negative."],
  ["forearm-change", 67, "I noticed a forearm spot change since last season.", "has a small superficial forearm lesion with documented change in border and pigmentation. It is accessible for complete local biopsy, with no tissue diagnosis or palpable regional nodes yet."],
] as const;
const depths = ["1.4 mm", "1.6 mm", "1.8 mm", "1.5 mm"] as const;

const cases: CaseSpec[] = stories.map(([slug, age, complaint, story], index) => {
  const result = `Complete biopsy shows invasive melanoma with a measured thickness of ${depths[index]} with adequate histologic microstaging.`;
  return { id: `case.pigmented-skin-lesion.${slug}`, displayName: "Changing skin lesion evaluation", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 5], sexLabels: ["Female", "Male"], stage: 1, requiredCapabilityIds: ["capability.minor_procedure"],
    nodes: [
      { conceptId: "concept.pigmented-skin-lesion.complete-diagnostic-biopsy", stem: `Which initial tissue-diagnosis approach best fits {patientName}'s lesion?`, choices: [...biopsyChoices(index + 1)], explanation: "A small accessible lesion concerning for melanoma is usually removed completely with narrow clinical margins and enough depth for histologic microstaging. Selected large or difficult lesions can require a different biopsy approach.", claimIds: ["claim.pigmented-skin-lesion.complete-diagnostic-biopsy"], gate: { id: `gate.pigmented-skin-lesion.biopsy.${index + 1}`, serviceId: "service.skin_excisional_biopsy", pendingLabel: "Skin-lesion pathology pending", resultNarrative: result, routeIds: ["route.skin_excisional_biopsy.in_house", "route.skin_excisional_biopsy.outsourced"] } },
      { conceptId: "concept.melanoma.sentinel-node-staging", currentUpdate: result, stem: `With clinically negative regional nodes, which staging discussion should accompany {patientName}'s definitive wide-excision planning?`, choices: [...stagingChoices(index + 1)], explanation: "Intermediate-thickness invasive melanoma with no clinically palpable nodes supports discussion of sentinel lymph-node biopsy for pathological regional staging. This is distinct from automatic complete nodal dissection and does not guarantee a survival benefit.", claimIds: ["claim.melanoma.sentinel-node-staging", "claim.pigmented-skin-lesion.complete-diagnostic-biopsy"] },
    ],
  };
});

export const PIGMENTED_SKIN_LESION_CONCEPTS = [
  concept({ id: "concept.pigmented-skin-lesion.complete-diagnostic-biopsy", educationalTier: 0, displayName: "Complete diagnostic biopsy of a suspicious pigmented lesion", learningObjective: "Select complete diagnostic excision with narrow margins and adequate depth for a small accessible pigmented lesion concerning for melanoma.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.pigmented-skin-lesion.complete-diagnostic-biopsy"] }),
  concept({ id: "concept.melanoma.sentinel-node-staging", educationalTier: 1, displayName: "Sentinel-node staging discussion for melanoma", learningObjective: "Discuss sentinel lymph-node biopsy for pathological regional staging of intermediate-thickness clinically node-negative melanoma alongside definitive excision planning.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.melanoma.sentinel-node-staging"] }),
];
const family = createDevelopmentFamily({ concepts: PIGMENTED_SKIN_LESION_CONCEPTS, cases, sourceLabels: labels });
export const PIGMENTED_SKIN_LESION_TESTED_CONCEPTS = family.testedConcepts;
export const PIGMENTED_SKIN_LESION_QUESTIONS = family.questions;
export const PIGMENTED_SKIN_LESION_CASES = family.cases;
export const PIGMENTED_SKIN_LESION_CASE_REVIEWS = family.caseReviews;
export const PIGMENTED_SKIN_LESION_AUTHORING_REVIEW = NEEDS_REVIEW;
export const PIGMENTED_SKIN_LESION_SERVICE_CONTRACTS = [{ serviceId: "service.skin_excisional_biopsy", allowedRouteIds: ["route.skin_excisional_biopsy.in_house", "route.skin_excisional_biopsy.outsourced"], delivery: "existing_balance_contract" as const }];
