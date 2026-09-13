import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, source, type CaseSpec, type DevelopmentServiceContract } from "./batch-helpers";

const NCI = "source.nci.colorectal-screening.2024";
export const COLORECTAL_SERVICE_CONTRACTS: DevelopmentServiceContract[] = [{ serviceId: "service.colonoscopy", allowedRouteIds: ["route.colonoscopy.outsourced"], delivery: "new_external_contract_required" }];
export const COLORECTAL_CLAIMS = [
  claim({ id: "claim.colorectal.positive-fit-colonoscopy", statement: "A positive screening FIT requires diagnostic colonoscopy; FIT alone does not diagnose colorectal cancer.", sourceIds: [NCI], evidenceCategory: "evaluation", certainty: "high", limitation: "Suitability and the management of incomplete examination remain individualized.", applicablePopulation: "Adults with a positive colorectal-cancer screening FIT who are suitable for outpatient diagnostic evaluation.", lastCheckedOn: "2026-09-09" }),
  claim({ id: "claim.colorectal.histology-confirms", statement: "Histologic examination of tissue sampled from a suspicious colorectal lesion provides confirming evidence of cancer.", sourceIds: [NCI], evidenceCategory: "definition", certainty: "high", limitation: "Gross appearance and cross-sectional imaging can be suspicious but do not substitute for tissue diagnosis or assign stage here.", applicablePopulation: "Adults with a suspicious colorectal lesion sampled during colonoscopy.", lastCheckedOn: "2026-09-09" }),
];
export const COLORECTAL_SOURCES = linkSourcesToClaims([source({ id: NCI, title: "Screening Tests to Detect Colorectal Cancer and Polyps", completeCitation: "National Cancer Institute. Screening Tests to Detect Colorectal Cancer and Polyps. Reviewed October 29, 2024.", organizationOrJournal: "National Cancer Institute", authors: ["National Cancer Institute"], publicationYear: 2024, doi: null, pmid: null, officialUrl: "https://www.cancer.gov/types/colorectal/screening-fact-sheet", accessedOn: "2026-09-09", sourceClass: "government_guidance", licenseLabel: "United States government work; NCI reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only; no source prose, art, logos, or PDQ branding reproduced. Credit and link NCI without endorsement.", authorityAssessment: "Federal evidence synthesis directly checked for colonoscopy after positive stool screening and histologic examination of sampled abnormal tissue.", usageRole: "evidence" })], COLORECTAL_CLAIMS);

const scenarios = [
  ["routine-screen", 53, "My screening stool test was positive.", "completed an average-risk screening FIT that returned positive. They feel well and understand that the stool result is abnormal but does not itself diagnose cancer."],
  ["mailed-fit", 61, "My mailed FIT result was positive.", "returned a mailed screening FIT kit and has a positive result. They have no acute symptoms and are suitable for outpatient diagnostic evaluation."],
  ["preventive-visit", 67, "My colorectal screening result was abnormal.", "is seen after a preventive visit generated a positive FIT. They ask whether the result proves cancer; no diagnosis has yet been made."],
  ["repeat-screening", 58, "My colorectal screening FIT was positive.", "has a positive FIT from an organized screening program. They are stable and ready to complete the recommended diagnostic workup."],
] as const;
const cases: CaseSpec[] = scenarios.map(([slug, age, complaint, story], index) => {
  const n = index + 1;
  const result = "Colonoscopy identifies a suspicious colonic lesion. The endoscopist samples the lesion, and histology is pending.";
  return { id: `case.colorectal.${slug}`, displayName: "Abnormal screening follow-up", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 3], sexLabels: ["Female", "Male"], stage: 1, nodes: [
    { conceptId: "concept.colorectal.positive-fit-colonoscopy", stem: "Which diagnostic investigation should follow this screening result?", choices: [
      { id: `colonoscopy_${n}`, label: "Diagnostic colonoscopy", isCorrect: true, serviceId: "service.colonoscopy", rationale: "Colonoscopy is needed to evaluate a positive FIT and permits sampling of abnormalities." },
      { id: `repeat_fit_${n}`, label: "Repeat fecal immunochemical testing", rationale: "Repeating stool screening does not complete the required diagnostic examination after a positive result." },
      { id: `ct_colonography_${n}`, label: "CT colonography", serviceId: "service.ct", rationale: "This would not provide the same opportunity to sample a detected lesion during this follow-up." },
      { id: `flex_sig_${n}`, label: "Flexible sigmoidoscopy", rationale: "A limited distal examination does not complete the indicated full-colon evaluation." },
    ], explanation: "A positive FIT is an abnormal screening result, not a cancer diagnosis. Diagnostic colonoscopy evaluates the colon and allows abnormal tissue to be removed or sampled.", claimIds: ["claim.colorectal.positive-fit-colonoscopy"], gate: { id: `gate.colorectal.colonoscopy.${n}`, serviceId: "service.colonoscopy", pendingLabel: "Diagnostic colonoscopy pending", resultNarrative: result, routeIds: ["route.colonoscopy.outsourced"] } },
    { conceptId: "concept.colorectal.histologic-confirmation", currentUpdate: result, stem: "Which evidence establishes the diagnosis for this sampled lesion?", choices: [
      { id: `histology_${n}`, label: "Histologic examination of the sampled tissue", isCorrect: true, rationale: "Microscopic tissue examination provides the confirming evidence." },
      { id: `endoscopic_appearance_${n}`, label: "The lesion's endoscopic appearance", rationale: "Gross appearance can be suspicious but does not provide histologic confirmation." },
      { id: `serum_marker_${n}`, label: "A serum tumor-marker result", rationale: "A serum marker does not replace examination of the sampled lesion for diagnosis." },
      { id: `ct_appearance_${n}`, label: "The lesion's cross-sectional imaging appearance", rationale: "Imaging can characterize extent but does not substitute for tissue diagnosis." },
    ], explanation: "The suspicious lesion was appropriately sampled during colonoscopy. Histologic examination of that tissue can confirm cancer; gross endoscopic appearance, serum markers, and imaging do not replace tissue diagnosis.", claimIds: ["claim.colorectal.histology-confirms"] },
  ] };
});
export const COLORECTAL_CONCEPTS = [
  concept({ id: "concept.colorectal.positive-fit-colonoscopy", educationalTier: 0, displayName: "Diagnostic colonoscopy after a positive FIT", learningObjective: "Select diagnostic colonoscopy after a positive screening FIT while recognizing that the stool result alone does not diagnose colorectal cancer.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.colorectal.positive-fit-colonoscopy"] }),
  concept({ id: "concept.colorectal.histologic-confirmation", educationalTier: 0, displayName: "Histologic confirmation of a colorectal lesion", learningObjective: "Identify histologic examination of sampled lesion tissue as the confirming evidence after colonoscopy identifies a suspicious colorectal lesion.", earliestFacilityStage: 1, conceptType: "diagnosis", evidenceClaimIds: ["claim.colorectal.histology-confirms"] }),
];
const family = createDevelopmentFamily({ concepts: COLORECTAL_CONCEPTS, cases, sourceLabels: ["National Cancer Institute colorectal screening fact sheet (reviewed 2024)"] });
export const COLORECTAL_TESTED_CONCEPTS = family.testedConcepts;
export const COLORECTAL_QUESTIONS = family.questions;
export const COLORECTAL_CASES = family.cases;
export const COLORECTAL_CASE_REVIEWS = family.caseReviews;


