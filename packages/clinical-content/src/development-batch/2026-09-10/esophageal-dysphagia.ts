import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, NEEDS_REVIEW, source, type CaseSpec } from "./batch-helpers";

const EGD = "source.sc.niddk-upper-gi-endoscopy";
const NIDDK_BARRETT = "source.sc.niddk-barrett-diagnosis";
const ACG = "source.sc.acg-barrett-patient-2024";

export const ESOPHAGEAL_DYSPHAGIA_CLAIMS = [
  claim({ id: "claim.esophageal-dysphagia.upper-endoscopy", statement: "Upper-GI endoscopy with appropriate esophageal biopsies evaluates persistent esophageal dysphagia by examining mucosa and structural narrowing and obtaining tissue when indicated.", sourceIds: [EGD, NIDDK_BARRETT, ACG], evidenceCategory: "evaluation", certainty: "moderate", limitation: "This does not prescribe an emergency pathway, universal dilation, screening criteria, or a test sequence for every dysphagia presentation.", applicablePopulation: "Stable adults with persistent esophageal dysphagia who can tolerate liquids and have no acute food impaction.", lastCheckedOn: "2026-09-10" }),
  claim({ id: "claim.barrett-esophagus.intestinal-metaplasia", statement: "A visible esophageal columnar segment with biopsy-confirmed specialized intestinal metaplasia supports the diagnosis of Barrett esophagus.", sourceIds: [NIDDK_BARRETT, ACG], evidenceCategory: "definition", certainty: "moderate", limitation: "Barrett metaplasia is not treated as the cause of obstructive dysphagia here, and this claim does not specify screening groups, cancer risk, surveillance intervals, acid-suppression protocols, or dysplasia treatment.", applicablePopulation: "Adults with an adequately examined esophageal columnar segment and specialized intestinal metaplasia on biopsy without dysplasia or carcinoma.", lastCheckedOn: "2026-09-10" }),
];

export const ESOPHAGEAL_DYSPHAGIA_SOURCES = linkSourcesToClaims([
  source({ id: EGD, title: "Upper GI Endoscopy", completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases. Upper GI Endoscopy. Last reviewed October 2023. Acknowledged reviewer Nicholas J. Shaheen, MD. Accessed 2026-09-10.", organizationOrJournal: "National Institute of Diabetes and Digestive and Kidney Diseases", authors: ["National Institute of Diabetes and Digestive and Kidney Diseases", "Nicholas J. Shaheen, MD (acknowledged reviewer)"], publicationYear: 2023, doi: null, pmid: null, officialUrl: "https://www.niddk.nih.gov/health-information/diagnostic-tests/upper-gi-endoscopy", accessedOn: "2026-09-10", sourceClass: "government_guidance", licenseLabel: "United States government factual material; NIDDK reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only. Third-party content, images, and agency marks are excluded; credit NIDDK without implying endorsement.", authorityAssessment: "Government patient education directly checked for endoscopic evaluation of swallowing problems, structural narrowing, biopsy, and subsequent pathology results.", usageRole: "evidence" }),
  source({ id: NIDDK_BARRETT, title: "Diagnosis of Barrett's Esophagus", completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases. Diagnosis of Barrett's Esophagus. Last reviewed August 2024. Accessed 2026-09-10.", organizationOrJournal: "National Institute of Diabetes and Digestive and Kidney Diseases", authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"], publicationYear: 2024, doi: null, pmid: null, officialUrl: "https://www.niddk.nih.gov/health-information/digestive-diseases/barretts-esophagus/diagnosis", accessedOn: "2026-09-10", sourceClass: "government_guidance", licenseLabel: "United States government factual material; NIDDK reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only. Third-party content, images, and agency marks are excluded; credit NIDDK without implying endorsement.", authorityAssessment: "Current government patient education directly checked for EGD with histologic confirmation; it does not independently supply the precise cellular definition used in the claim.", usageRole: "evidence" }),
  source({ id: ACG, title: "Barrett's Esophagus", completeCitation: "Gabbard SL, Gupta M. Barrett's Esophagus. American College of Gastroenterology patient education. Updated May 2024; prior authors Azodo IA, Romero Y, and Shaheen NJ. Accessed 2026-09-10.", organizationOrJournal: "American College of Gastroenterology", authors: ["Gabbard SL", "Gupta M", "Azodo IA", "Romero Y", "Shaheen NJ"], publicationYear: 2024, doi: null, pmid: null, officialUrl: "https://gi.org/topics/barretts-esophagus/", accessedOn: "2026-09-10", sourceClass: "open_educational_resource", licenseLabel: "Copyrighted society patient education; targeted factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "Original factual synthesis and citation only. No source prose, images, or marks reproduced; this is not the complete ACG guideline.", authorityAssessment: "Society patient education directly checked for intestinal metaplasia, an endoscopic columnar segment, dysphagia as an endoscopy indication, and distinction from dysplasia or cancer.", usageRole: "cross_check" }),
], ESOPHAGEAL_DYSPHAGIA_CLAIMS);

const labels = ["NIDDK upper-GI endoscopy guidance (reviewed October 2023)", "NIDDK Barrett diagnosis guidance (reviewed August 2024)", "ACG Barrett patient education (updated May 2024)"];
const egdChoices = (n: number) => [
  { id: `egd_${n}`, label: "EGD with esophageal biopsies", isCorrect: true, serviceId: "service.endoscopy", rationale: "Endoscopy can evaluate the structural narrowing and mucosa and obtain appropriate tissue." },
  { id: `manometry_${n}`, label: "High-resolution esophageal manometry", rationale: "Manometry evaluates motility but does not first assess the structural and mucosal concern in this presentation." },
  { id: `ph_monitoring_${n}`, label: "Ambulatory esophageal reflux monitoring", rationale: "Reflux monitoring does not directly evaluate the persistent swallowing obstruction." },
  { id: `chest_ct_${n}`, label: "Contrast-enhanced chest CT", rationale: "Cross-sectional imaging does not replace direct mucosal and structural evaluation with biopsy here." },
] as const;
const interpretationChoices = (n: number) => [
  { id: `barrett_${n}`, label: "Barrett esophagus", isCorrect: true, rationale: "The columnar segment with specialized intestinal metaplasia supports Barrett esophagus." },
  { id: `reflux_esophagitis_${n}`, label: "Reflux esophagitis", rationale: "Inflammation alone does not account for the specialized intestinal metaplasia in the sampled columnar segment." },
  { id: `eosinophilic_${n}`, label: "Eosinophilic esophagitis", rationale: "The pathology does not describe eosinophilic inflammation." },
  { id: `adenocarcinoma_${n}`, label: "Esophageal adenocarcinoma", rationale: "The biopsies explicitly show no dysplasia or carcinoma." },
] as const;

const stories = [
  ["bread-sticking", 56, "I feel bread and meat stick when I swallow.", "has chronic reflux and persistent solid-food dysphagia. The patient still tolerates liquids and has no acute food impaction, bleeding, respiratory distress, or hemodynamic instability."],
  ["meal-pauses", 49, "I have to pause during meals because food catches.", "describes chronic reflux with repeated sticking of solid food behind the sternum. Liquids pass, and there is no current impaction or unstable symptom."],
  ["progressive-solids", 63, "I find solid foods harder to swallow now.", "reports persistent esophageal dysphagia for solids against a background of reflux. The patient can drink normally and has no acute obstruction, hematemesis, or cardiopulmonary distress."],
  ["restaurant-meals", 44, "I feel food catch during restaurant meals.", "has recurrent solid-food sticking and longstanding reflux despite careful chewing. Liquids remain tolerated, and there is no food impaction or emergency feature today."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, age, complaint, story], index) => {
  const result = "Upper-GI endoscopy adequately assesses a benign peptic narrowing and a columnar segment extending several centimeters above the gastroesophageal junction. Esophageal biopsies show specialized intestinal metaplasia without dysplasia or carcinoma.";
  return { id: `case.esophageal-dysphagia.${slug}`, displayName: "Esophageal swallowing evaluation", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 5], sexLabels: ["Female", "Male"], stage: 2, requiredCapabilityIds: ["capability.endoscopy"],
    nodes: [
      { conceptId: "concept.esophageal-dysphagia.upper-endoscopy", stem: `Which investigation best evaluates {patientName}'s persistent swallowing symptom now?`, choices: [...egdChoices(index + 1)], explanation: "Upper-GI endoscopy evaluates esophageal narrowing and mucosa and permits appropriate biopsy. This stable presentation has no acute impaction requiring emergency care.", claimIds: ["claim.esophageal-dysphagia.upper-endoscopy"], gate: { id: `gate.esophageal-dysphagia.endoscopy.${index + 1}`, serviceId: "service.endoscopy", pendingLabel: "Upper-GI endoscopy and biopsies pending", resultNarrative: result, routeIds: ["route.endoscopy.in_house"] } },
      { conceptId: "concept.barrett-esophagus.intestinal-metaplasia", currentUpdate: result, stem: `Which diagnosis is established by {patientName}'s columnar segment and biopsy finding?`, choices: [...interpretationChoices(index + 1)], explanation: "Specialized intestinal metaplasia in a sampled esophageal columnar segment supports Barrett esophagus. The benign peptic narrowing accounts for the obstructive symptom; Barrett metaplasia does not itself create that narrowing.", claimIds: ["claim.barrett-esophagus.intestinal-metaplasia", "claim.esophageal-dysphagia.upper-endoscopy"] },
    ],
  };
});

export const ESOPHAGEAL_DYSPHAGIA_CONCEPTS = [
  concept({ id: "concept.esophageal-dysphagia.upper-endoscopy", educationalTier: 0, displayName: "Upper endoscopy for persistent esophageal dysphagia", learningObjective: "Select upper-GI endoscopy with appropriate esophageal biopsies for stable persistent esophageal dysphagia with a structural or mucosal concern.", earliestFacilityStage: 2, conceptType: "workup", evidenceClaimIds: ["claim.esophageal-dysphagia.upper-endoscopy"] }),
  concept({ id: "concept.barrett-esophagus.intestinal-metaplasia", educationalTier: 1, displayName: "Barrett esophagus on esophageal biopsy", learningObjective: "Recognize Barrett esophagus from a sampled columnar esophageal segment with specialized intestinal metaplasia.", earliestFacilityStage: 2, conceptType: "diagnosis", evidenceClaimIds: ["claim.barrett-esophagus.intestinal-metaplasia"] }),
];
const family = createDevelopmentFamily({ concepts: ESOPHAGEAL_DYSPHAGIA_CONCEPTS, cases, sourceLabels: labels });
export const ESOPHAGEAL_DYSPHAGIA_TESTED_CONCEPTS = family.testedConcepts;
export const ESOPHAGEAL_DYSPHAGIA_QUESTIONS = family.questions;
export const ESOPHAGEAL_DYSPHAGIA_CASES = family.cases;
export const ESOPHAGEAL_DYSPHAGIA_CASE_REVIEWS = family.caseReviews;
export const ESOPHAGEAL_DYSPHAGIA_AUTHORING_REVIEW = NEEDS_REVIEW;
export const ESOPHAGEAL_DYSPHAGIA_SERVICE_CONTRACTS = [{ serviceId: "service.endoscopy", allowedRouteIds: ["route.endoscopy.in_house"], delivery: "existing_balance_contract" as const }];
