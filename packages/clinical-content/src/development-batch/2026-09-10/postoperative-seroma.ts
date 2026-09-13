import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, NEEDS_REVIEW, source, type CaseSpec } from "./batch-helpers";

const UCLA = "source.sc.ucla-post-surgical-fluid";
const NCI = "source.sc.nci-seroma-dictionary";

export const POSTOPERATIVE_SEROMA_CLAIMS = [
  claim({ id: "claim.postoperative-seroma.ultrasound-characterization", statement: "Targeted ultrasound can characterize an uncertain superficial postoperative breast collection and distinguish simple fluid features from a solid or suspiciously vascular finding.", sourceIds: [UCLA], evidenceCategory: "evaluation", certainty: "moderate", limitation: "This imaging detail is supported by a single institutional teaching source rather than a society guideline, and ultrasound is not presented as universally definitive outside the complete clinical context.", applicablePopulation: "Stable adults with uncertain superficial fullness after benign breast excision and no emergency or infectious features.", lastCheckedOn: "2026-09-10" }),
  claim({ id: "claim.postoperative-seroma.uncomplicated-observation", statement: "A small simple postoperative seroma without infection, wound tension, an implant, meaningful pain, or functional limitation can be observed with clinical follow-up rather than routinely aspirated.", sourceIds: [UCLA, NCI], evidenceCategory: "management", certainty: "moderate", limitation: "The management detail is chiefly supported by one institutional source; symptoms, wound compromise, infection concern, diagnostic uncertainty, or other patient factors can justify intervention.", applicablePopulation: "Stable adults with a small simple collection after benign breast excision and no infection, wound tension, implant, meaningful pain, or functional limitation.", lastCheckedOn: "2026-09-10" }),
];

export const POSTOPERATIVE_SEROMA_SOURCES = linkSourcesToClaims([
  source({ id: UCLA, title: "Post-Surgical Fluid Collections: Causes, Symptoms, and Management", completeCitation: "Sparks H, Manchandia TC. Post-Surgical Fluid Collections: Causes, Symptoms, and Management. UCLA Health Department of Radiology, Breast Imaging Teaching Resources. Undated. Accessed 2026-09-10.", organizationOrJournal: "UCLA Health Department of Radiology, Breast Imaging Teaching Resources", authors: ["Sparks H", "Manchandia TC"], publicationYear: null, doi: null, pmid: null, officialUrl: "https://www.uclahealth.org/departments/radiology/education/breast-imaging-teaching-resources/cases/post-surgical-fluid-collections", accessedOn: "2026-09-10", sourceClass: "open_educational_resource", licenseLabel: "Copyright University of California; targeted factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "Original factual synthesis and citation only. No source wording, images, or marks reproduced; the public terms do not provide an explicit content-reuse grant.", authorityAssessment: "Institutional physician teaching guidance directly checked for simple-fluid ultrasound features and observation of small asymptomatic seromas without wound tension. It is not a society guideline.", usageRole: "evidence" }),
  source({ id: NCI, title: "Seroma", completeCitation: "National Cancer Institute. Seroma. NCI Dictionary of Cancer Terms. Undated. Accessed 2026-09-10.", organizationOrJournal: "National Cancer Institute Dictionary of Cancer Terms", authors: ["National Cancer Institute"], publicationYear: null, doi: null, pmid: null, officialUrl: "https://www.cancer.gov/publications/dictionaries/cancer-terms/def/seroma", accessedOn: "2026-09-10", sourceClass: "government_guidance", licenseLabel: "United States government factual material; NCI reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only. Third-party content, images, and agency marks are excluded; credit NCI without implying endorsement.", authorityAssessment: "Government reference definition directly checked as an independent cross-check for clear-fluid collections after breast surgery, spontaneous resolution, and selective drainage; it does not establish ultrasound detail or a management algorithm.", usageRole: "cross_check" }),
], POSTOPERATIVE_SEROMA_CLAIMS);

const labels = ["UCLA breast-imaging postsurgical fluid teaching resource (undated)", "NCI Dictionary of Cancer Terms: seroma (undated)"];
const ultrasoundChoices = (n: number) => [
  { id: `ultrasound_${n}`, label: "Targeted breast ultrasound", isCorrect: true, serviceId: "service.ultrasound", rationale: "Ultrasound directly characterizes whether the uncertain superficial finding is simple fluid or contains a concerning component." },
  { id: `breast_mri_${n}`, label: "Contrast-enhanced breast MRI", rationale: "The localized superficial postoperative question can be answered initially with targeted ultrasound." },
  { id: `chest_ct_${n}`, label: "Chest CT of the breast region", rationale: "CT is not the focused first study for this superficial postoperative fullness." },
  { id: `pathology_review_${n}`, label: "Surgical pathology review", rationale: "Pathology review does not characterize the new palpable postoperative collection." },
] as const;
const managementChoices = (n: number) => [
  { id: `observe_${n}`, label: "Observation with clinical follow-up", isCorrect: true, rationale: "The collection is small and simple without symptoms, infection, wound tension, or an implant." },
  { id: `aspirate_${n}`, label: "Ultrasound-guided aspiration of the collection", rationale: "Routine aspiration is unnecessary for this small uncomplicated asymptomatic collection." },
  { id: `antibiotics_${n}`, label: "Antibiotic treatment with clinical reassessment", rationale: "There is no clinical or imaging evidence of infection." },
  { id: `operative_drainage_${n}`, label: "Operative evacuation of the collection", rationale: "The intact wound and uncomplicated small collection do not support operative drainage." },
] as const;

const stories = [
  ["lumpectomy-fullness", 51, "I have soft fullness near my healed incision.", "returns after benign breast excision with a new superficial fullness near the healed incision that cannot be characterized confidently by palpation. There is no fever, redness, drainage, wound tension, implant, meaningful pain, or activity limitation."],
  ["excisional-biopsy", 43, "I noticed a small lump at the biopsy site.", "has localized fullness after excision of a benign breast lesion. The incision is intact, and examination cannot distinguish fluid from soft tissue. There is no erythema, systemic illness, implant, wound strain, or bothersome symptom."],
  ["upper-outer-site", 64, "My surgical area feels fuller than before.", "presents after benign breast surgery with uncertain superficial swelling beneath an intact incision. There is no warmth, fever, drainage, wound tension, implant, pain affecting activity, or other concerning symptom."],
  ["return-visit", 37, "I noticed a painless bump by my breast incision.", "returns after a benign breast excision because of a small painless superficial prominence. Palpation is indeterminate; the wound is intact without redness, tension, drainage, implant, or functional limitation."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, age, complaint, story], index) => {
  const result = "Targeted ultrasound shows a small simple fluid collection with a smooth wall, no solid component, and no suspicious internal vascularity.";
  return { id: `case.postoperative-seroma.${slug}`, displayName: "Postoperative breast-site evaluation", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 4, age + 8, age + 12], sexLabels: ["Female"], stage: 1,
    nodes: [
      { conceptId: "concept.postoperative-seroma.ultrasound-characterization", stem: `Which next test best characterizes {patientName}'s superficial postoperative finding?`, choices: [...ultrasoundChoices(index + 1)], explanation: "Targeted ultrasound is suited to the focused question of whether this uncertain superficial postoperative fullness is simple fluid or has a solid or vascular component.", claimIds: ["claim.postoperative-seroma.ultrasound-characterization"], gate: { id: `gate.postoperative-seroma.ultrasound.${index + 1}`, serviceId: "service.ultrasound", pendingLabel: "Targeted breast ultrasound pending", resultNarrative: result, routeIds: ["route.ultrasound.outsourced", "route.ultrasound.in_house"] } },
      { conceptId: "concept.postoperative-seroma.uncomplicated-observation", currentUpdate: result, stem: `What is the appropriate management for {patientName}'s small uncomplicated collection?`, choices: [...managementChoices(index + 1)], explanation: "A small simple seroma without infection, wound tension, an implant, meaningful pain, or functional limitation can be observed. Clinical change or increasing symptoms should prompt reassessment.", claimIds: ["claim.postoperative-seroma.uncomplicated-observation", "claim.postoperative-seroma.ultrasound-characterization"] },
    ],
  };
});

export const POSTOPERATIVE_SEROMA_CONCEPTS = [
  concept({ id: "concept.postoperative-seroma.ultrasound-characterization", educationalTier: 0, displayName: "Ultrasound characterization of postoperative fullness", learningObjective: "Select targeted ultrasound to characterize an uncertain superficial collection after benign breast excision.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.postoperative-seroma.ultrasound-characterization"] }),
  concept({ id: "concept.postoperative-seroma.uncomplicated-observation", educationalTier: 0, displayName: "Observation of an uncomplicated postoperative seroma", learningObjective: "Observe a small simple asymptomatic postoperative seroma without infection, wound tension, implant, or functional limitation.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.postoperative-seroma.uncomplicated-observation"] }),
];
const family = createDevelopmentFamily({ concepts: POSTOPERATIVE_SEROMA_CONCEPTS, cases, sourceLabels: labels });
export const POSTOPERATIVE_SEROMA_TESTED_CONCEPTS = family.testedConcepts;
export const POSTOPERATIVE_SEROMA_QUESTIONS = family.questions;
export const POSTOPERATIVE_SEROMA_CASES = family.cases;
export const POSTOPERATIVE_SEROMA_CASE_REVIEWS = family.caseReviews;
export const POSTOPERATIVE_SEROMA_AUTHORING_REVIEW = NEEDS_REVIEW;
export const POSTOPERATIVE_SEROMA_SERVICE_CONTRACTS = [{ serviceId: "service.ultrasound", allowedRouteIds: ["route.ultrasound.outsourced", "route.ultrasound.in_house"], delivery: "existing_balance_contract" as const }];
