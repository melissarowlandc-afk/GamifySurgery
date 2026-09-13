import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, NEEDS_REVIEW, source, type CaseSpec } from "./batch-helpers";

const DIAGNOSIS = "source.niddk.gallstones-diagnosis.2017";
const TREATMENT = "source.niddk.gallstones-treatment.2017";
const GUIDELINE = "source.jsge.cholelithiasis-guideline.2023";

export const GALLSTONE_CLAIMS = [
  claim({ id: "claim.gallstones.ultrasound-first", statement: "Abdominal ultrasound is an appropriate initial imaging test for a stable outpatient with suspected gallstones.", sourceIds: [DIAGNOSIS, GUIDELINE], evidenceCategory: "evaluation", certainty: "high", limitation: "This scoped claim does not cover unstable patients or every alternative biliary presentation.", applicablePopulation: "Stable adults with symptoms compatible with uncomplicated gallstones.", lastCheckedOn: "2026-09-09" }),
  claim({ id: "claim.gallstones.symptomatic-referral", statement: "Recurrent compatible symptoms with ultrasound-confirmed gallstones support elective surgical assessment and cholecystectomy counseling.", sourceIds: [TREATMENT, GUIDELINE], evidenceCategory: "management", certainty: "high", limitation: "Individual operative suitability and competing diagnoses still require assessment.", applicablePopulation: "Stable adults with symptomatic gallstones and no acute complication in this encounter.", lastCheckedOn: "2026-09-09" }),
  claim({ id: "claim.gallstones.incidental-observation", statement: "Incidentally found gallstones without symptoms or suspicious features usually do not require prophylactic surgery.", sourceIds: [TREATMENT, GUIDELINE], evidenceCategory: "management", certainty: "high", limitation: "Higher-risk gallbladder features and later biliary symptoms are outside this pathway.", applicablePopulation: "Asymptomatic adults with uncomplicated incidental gallstones.", lastCheckedOn: "2026-09-09" }),
  claim({ id: "claim.gallstones.ercp-common-bile-duct-stone", statement: "ERCP can remove a stone lodged in the common bile duct; that indication is distinct from treating uncomplicated stones confined to the gallbladder.", sourceIds: [TREATMENT], evidenceCategory: "management", certainty: "high", limitation: "This supporting boundary does not define every indication for ERCP.", applicablePopulation: "Adults being evaluated for gallstone disease where duct intervention is considered.", lastCheckedOn: "2026-09-09" }),
];

export const GALLSTONE_SOURCES = linkSourcesToClaims([
  source({ id: DIAGNOSIS, title: "Diagnosis of Gallstones", completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases. Diagnosis of Gallstones. Reviewed November 2017.", organizationOrJournal: "NIDDK", authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"], publicationYear: 2017, doi: null, pmid: null, officialUrl: "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones/diagnosis", accessedOn: "2026-09-09", sourceClass: "government_guidance", licenseLabel: "United States government work; NIDDK reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only; third-party materials and agency marks are excluded. Credit NIDDK without implying endorsement.", authorityAssessment: "Federal patient guidance directly checked for the role of ultrasound in gallstone diagnosis.", usageRole: "evidence" }),
  source({ id: TREATMENT, title: "Treatment for Gallstones", completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases. Treatment for Gallstones. Reviewed November 2017.", organizationOrJournal: "NIDDK", authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"], publicationYear: 2017, doi: null, pmid: null, officialUrl: "https://www.niddk.nih.gov/health-information/digestive-diseases/gallstones/treatment", accessedOn: "2026-09-09", sourceClass: "government_guidance", licenseLabel: "United States government work; NIDDK reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only; no source prose, art, or agency marks are reproduced.", authorityAssessment: "Federal patient guidance directly checked for symptomatic treatment and usual non-treatment of asymptomatic stones.", usageRole: "evidence" }),
  source({ id: GUIDELINE, title: "Evidence-based clinical practice guidelines for cholelithiasis 2021", completeCitation: "Fujita N, Yasuda I, Endo I, et al. Evidence-based clinical practice guidelines for cholelithiasis 2021. Journal of Gastroenterology. 2023;58:801-833. doi:10.1007/s00535-023-02014-6.", organizationOrJournal: "Journal of Gastroenterology", authors: ["Fujita N", "Yasuda I", "Endo I", "et al."], publicationYear: 2023, doi: "10.1007/s00535-023-02014-6", pmid: null, officialUrl: "https://link.springer.com/article/10.1007/s00535-023-02014-6", accessedOn: "2026-09-09", sourceClass: "peer_reviewed_guideline", licenseLabel: "Creative Commons Attribution 4.0 International", reuseStatus: "cc_by_4_0", reuseNotes: "Original modified factual synthesis; no figures or tables copied. Attribution and license: https://creativecommons.org/licenses/by/4.0/ .", authorityAssessment: "JSGE peer-reviewed GRADE and consensus guideline directly checked for diagnosis and symptomatic/asymptomatic management boundaries.", usageRole: "both" }),
], GALLSTONE_CLAIMS);

const labels = ["NIDDK gallstone diagnosis and treatment guidance (reviewed 2017)", "Fujita et al., JSGE cholelithiasis guideline (2023), CC BY 4.0"];
const ultrasoundChoices = (suffix: string) => [
  { id: `abdominal_ultrasound_${suffix}`, label: "Abdominal ultrasound", isCorrect: true, serviceId: "service.ultrasound", rationale: "Ultrasound directly evaluates suspected gallstones in this stable outpatient." },
  { id: `abdominal_ct_${suffix}`, label: "Contrast-enhanced abdominal CT", serviceId: "service.ct", rationale: "CT may answer other abdominal questions but is not the preferred initial test for this uncomplicated gallstone presentation." },
  { id: `mrcp_${suffix}`, label: "Magnetic resonance cholangiopancreatography", rationale: "MRCP is not the necessary first study when uncomplicated gallstones are suspected without jaundice or ductal concern." },
  { id: `hida_${suffix}`, label: "Hepatobiliary scintigraphy", rationale: "A functional hepatobiliary study is not the first test for this stable recurrent presentation without acute inflammatory features." },
] as const;

const referralChoices = (suffix: string) => [
  { id: `elective_surgery_${suffix}`, label: "Elective surgical assessment", isCorrect: true, rationale: "The symptoms and uncomplicated ultrasound-confirmed stones support elective surgical review." },
  { id: `observation_only_${suffix}`, label: "Observation with symptom counseling", rationale: "Absence of duct dilation does not make recurrent symptomatic gallstones asymptomatic." },
  { id: `ercp_${suffix}`, label: "Therapeutic ERCP", rationale: "The returned study does not establish a duct stone requiring endoscopic therapy." },
  { id: `antibiotics_${suffix}`, label: "Outpatient antibiotic therapy", rationale: "The patient has no fever, persistent pain, or ultrasound inflammatory findings supporting that treatment." },
] as const;

const symptomatic = [
  ["postmeal-episodes", 38, "Female", "I have recurring upper abdominal pain after meals.", "has had several episodes of upper abdominal pain after meals that fully resolved. Today they are comfortable, afebrile, and without jaundice or abdominal tenderness.", "Which imaging study is the best initial choice for this stable presentation?", "Ultrasound shows mobile gallstones, without gallbladder wall inflammation, duct dilation, or a duct stone."],
  ["episodic-night-pain", 52, "Male", "I have episodes of right upper abdominal pain.", "reports recurring right upper abdominal pain at night with nausea; each episode resolved. They now have normal vital signs and no fever, jaundice, ongoing severe pain, or peritoneal findings.", "Which study should be obtained first to evaluate suspected gallstones?", "Ultrasound demonstrates gallstones without inflammatory change or biliary duct dilation."],
  ["recurrent-epigastric-pain", 46, "Female", "I have recurring upper abdominal pain that resolves.", "describes repeated self-limited epigastric and right upper abdominal pain. They are currently well appearing, with no fever, jaundice, or persistent tenderness.", "Which initial imaging approach best fits this outpatient workup?", "Ultrasound identifies gallstones; there is no wall thickening, surrounding fluid, or duct dilation."],
  ["fatty-food-pain", 61, "Male", "I have intermittent upper abdominal pain.", "reports intermittent upper abdominal pain after rich meals that resolves between episodes. They are stable today and deny fever, jaundice, and continuing severe pain.", "What is the most appropriate initial imaging test?", "Ultrasound confirms gallstones with no sonographic inflammatory complication or dilated bile ducts."],
] as const;

const cases: CaseSpec[] = symptomatic.map(([slug, age, sex, complaint, story, stem, result], index) => ({
  id: `case.gallstones.symptomatic-${slug}`,
  displayName: "Recurring upper abdominal symptoms",
  chiefComplaint: complaint,
  presentation: `{patientName} ${story}`,
  ageYears: [age, age + 4],
  sexLabels: [sex, sex === "Female" ? "Male" : "Female"],
  stage: 1,
  nodes: [
    { conceptId: "concept.gallstones.initial-ultrasound", stem, choices: [...ultrasoundChoices(String(index + 1))], explanation: "Abdominal ultrasound is the appropriate initial imaging test for this stable patient with recurrent symptoms compatible with uncomplicated gallstones. CT, MRCP, and hepatobiliary scintigraphy have roles in other questions but are not the best first test in this scoped presentation.", claimIds: ["claim.gallstones.ultrasound-first"], gate: { id: `gate.gallstones.ultrasound.${index + 1}`, serviceId: "service.ultrasound", pendingLabel: "Abdominal ultrasound pending", resultNarrative: result, routeIds: ["route.ultrasound.outsourced", "route.ultrasound.in_house"] } },
    { conceptId: "concept.gallstones.symptomatic-surgical-referral", currentUpdate: result, stem: "What is the most appropriate next plan after this result?", choices: [...referralChoices(String(index + 1))], explanation: "Recurrent compatible symptoms plus uncomplicated ultrasound-confirmed gallstones support elective surgical assessment and counseling about cholecystectomy. ERCP is used for a common-bile-duct stone, which is not shown in this result.", claimIds: ["claim.gallstones.symptomatic-referral", "claim.gallstones.ercp-common-bile-duct-stone"] },
  ],
}));

const incidental = [
  ["checkup", 57, "Female", "My outside imaging found gallstones.", "brings an outside ultrasound obtained for an unrelated kidney evaluation. It reports gallstones but no suspicious gallbladder feature. They have never had biliary-type pain, fever, or jaundice."],
  ["liver-study", 49, "Male", "My liver imaging found gallstones.", "had an ultrasound for mild liver-test follow-up. Gallstones were noted without wall abnormality or duct dilation. They deny any prior compatible pain or biliary symptoms."],
  ["vascular-ct", 68, "Female", "My CT report mentioned gallstones.", "had CT imaging for vascular surveillance that mentioned uncomplicated gallstones. They report no upper abdominal pain, nausea after meals, fever, or jaundice."],
  ["training-ultrasound", 44, "Male", "My ultrasound found gallstones.", "was told that an incidental finding during a supervised sonography training scan showed gallstones without a mass, wall thickening, or duct dilation. They have no biliary symptoms and feel well."],
] as const;

for (const [index, [slug, age, sex, complaint, story]] of incidental.entries()) {
  cases.push({ id: `case.gallstones.incidental-${slug}`, displayName: "Incidental imaging finding", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 3], sexLabels: [sex, sex === "Female" ? "Male" : "Female"], stage: 0, nodes: [{ conceptId: "concept.gallstones.incidental-observation", stem: "What is the most appropriate gallstone-specific plan now?", choices: [
    { id: `observe_${index + 1}`, label: "Observation with symptom counseling", isCorrect: true, rationale: "Usual observation fits uncomplicated asymptomatic gallstones." },
    { id: `prophylactic_surgery_${index + 1}`, label: "Elective prophylactic cholecystectomy", rationale: "The case lacks symptoms or higher-risk gallbladder findings supporting automatic surgery." },
    { id: `ercp_${index + 1}`, label: "Endoscopic bile-duct intervention", rationale: "ERCP is not a treatment for uncomplicated asymptomatic stones confined to the gallbladder." },
    { id: `antibiotics_${index + 1}`, label: "Outpatient antibiotic therapy", rationale: "There are no clinical or imaging features of infection." },
  ], explanation: "Uncomplicated gallstones discovered incidentally in a patient without biliary symptoms usually need no immediate gallstone-directed procedure. Counseling and observation preserve the boundary that symptoms or suspicious features would prompt reassessment.", claimIds: ["claim.gallstones.incidental-observation", "claim.gallstones.ercp-common-bile-duct-stone"] }] });
}

export const GALLSTONE_CONCEPTS = [
  concept({ id: "concept.gallstones.initial-ultrasound", educationalTier: 0, displayName: "Initial ultrasound for suspected gallstones", learningObjective: "Select abdominal ultrasound as the initial imaging study for a stable outpatient with recurrent symptoms compatible with uncomplicated gallstones.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.gallstones.ultrasound-first"] }),
  concept({ id: "concept.gallstones.symptomatic-surgical-referral", educationalTier: 1, displayName: "Elective referral for symptomatic gallstones", learningObjective: "Use compatible recurrent symptoms and uncomplicated ultrasound-confirmed gallstones to support elective surgical assessment and cholecystectomy counseling.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.gallstones.symptomatic-referral", "claim.gallstones.ercp-common-bile-duct-stone"] }),
  concept({ id: "concept.gallstones.incidental-observation", educationalTier: 0, displayName: "Observation of uncomplicated incidental gallstones", learningObjective: "Choose observation and counseling for uncomplicated incidental gallstones in an asymptomatic adult without suspicious gallbladder features.", earliestFacilityStage: 0, conceptType: "management", evidenceClaimIds: ["claim.gallstones.incidental-observation", "claim.gallstones.ercp-common-bile-duct-stone"] }),
];

const family = createDevelopmentFamily({ concepts: GALLSTONE_CONCEPTS, cases, sourceLabels: labels });
export const GALLSTONE_TESTED_CONCEPTS = family.testedConcepts;
export const GALLSTONE_QUESTIONS = family.questions;
export const GALLSTONE_CASES = family.cases;
export const GALLSTONE_CASE_REVIEWS = family.caseReviews;
export const GALLSTONE_AUTHORING_REVIEW = NEEDS_REVIEW;





