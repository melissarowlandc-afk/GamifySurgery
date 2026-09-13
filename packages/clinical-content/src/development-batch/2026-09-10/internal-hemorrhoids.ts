import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, NEEDS_REVIEW, source, type CaseSpec } from "./batch-helpers";

const ASCRS = "source.sc.ascrs-hemorrhoids-patient";
const NIDDK = "source.sc.niddk-hemorrhoids-treatment";

export const INTERNAL_HEMORRHOIDS_CLAIMS = [
  claim({ id: "claim.internal-hemorrhoids.anoscopy-evaluation", statement: "After history, external inspection, and digital examination, anoscopy directly evaluates suspected internal hemorrhoidal tissue when local canal anatomy remains unconfirmed.", sourceIds: [ASCRS], evidenceCategory: "evaluation", certainty: "moderate", limitation: "Rectal bleeding must not automatically be attributed to hemorrhoids; upstream evaluation and screening remain individualized. The source is undated society patient guidance rather than a verified current formal guideline.", applicablePopulation: "Stable adults with persistent painless bleeding or prolapse whose upstream colorectal evaluation is already appropriate and who have no alarm symptoms or iron-deficiency anemia.", lastCheckedOn: "2026-09-10" }),
  claim({ id: "claim.internal-hemorrhoids.office-banding-selection", statement: "Office rubber-band ligation is an appropriate treatment option for selected bleeding or prolapsing internal hemorrhoids that persist after dietary and bowel-habit care.", sourceIds: [ASCRS, NIDDK], evidenceCategory: "management", certainty: "moderate", limitation: "Other office treatments can also be appropriate. This claim is limited to uncomplicated internal disease without a bleeding disorder, antithrombotic complication, active infection, or substantial external component.", applicablePopulation: "Stable adults with confirmed spontaneously reducing internal hemorrhoids and persistent bleeding or prolapse after conservative care.", lastCheckedOn: "2026-09-10" }),
];

export const INTERNAL_HEMORRHOIDS_SOURCES = linkSourcesToClaims([
  source({ id: ASCRS, title: "Hemorrhoids Expanded Information", completeCitation: "American Society of Colon and Rectal Surgeons. Hemorrhoids Expanded Information. Undated patient education page. Accessed 2026-09-10.", organizationOrJournal: "American Society of Colon and Rectal Surgeons", authors: ["American Society of Colon and Rectal Surgeons"], publicationYear: null, doi: null, pmid: null, officialUrl: "https://fascrs.org/Web/Web/Patients/Diseases-and-Conditions/A-Z/Hemorrhoids-Expanded-Information.aspx", accessedOn: "2026-09-10", sourceClass: "open_educational_resource", licenseLabel: "Copyrighted society patient education; targeted factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "Original factual synthesis and citation only. No source wording, procedural details, images, or marks reproduced; page date is unknown.", authorityAssessment: "Society patient education directly checked for anoscopy, evaluation for other bleeding causes, conservative therapy, and office banding; it is not the inaccessible 2024 formal guideline.", usageRole: "evidence" }),
  source({ id: NIDDK, title: "Treatment of Hemorrhoids", completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases. Treatment of Hemorrhoids. Last reviewed October 2016. Accessed 2026-09-10.", organizationOrJournal: "National Institute of Diabetes and Digestive and Kidney Diseases", authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"], publicationYear: 2016, doi: null, pmid: null, officialUrl: "https://www.niddk.nih.gov/health-information/digestive-diseases/hemorrhoids/treatment", accessedOn: "2026-09-10", sourceClass: "government_guidance", licenseLabel: "United States government factual material; NIDDK reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only. Third-party content, images, and agency marks are excluded; credit NIDDK without implying endorsement.", authorityAssessment: "Older government patient education directly checked as an independent factual cross-check for office banding of bleeding or prolapsing internal hemorrhoids; it is not a current formal guideline.", usageRole: "cross_check" }),
], INTERNAL_HEMORRHOIDS_CLAIMS);

const labels = ["ASCRS hemorrhoids patient education (undated)", "NIDDK hemorrhoids treatment guidance (reviewed October 2016)"];
const examChoices = (n: number) => [
  { id: `anoscopy_${n}`, label: "Anal canal anoscopy", isCorrect: true, serviceId: "service.anoscopy", rationale: "Anoscopy directly evaluates the suspected internal tissue after the completed external and digital examination." },
  { id: `repeat_colonoscopy_${n}`, label: "Repeat colonoscopy", rationale: "The upstream evaluation and screening are already appropriate, with no new alarm feature." },
  { id: `pelvic_mri_${n}`, label: "Pelvic MRI", rationale: "MRI is not the focused examination needed to visualize suspected internal hemorrhoids." },
  { id: `occult_blood_${n}`, label: "Fecal occult-blood testing", rationale: "Occult-blood testing does not define the local canal anatomy in this presentation." },
] as const;
const treatmentChoices = (n: number) => [
  { id: `banding_${n}`, label: "Office rubber-band ligation", isCorrect: true, rationale: "Confirmed uncomplicated internal disease persists despite bowel-habit care and is suitable for office banding." },
  { id: `hemorrhoidectomy_${n}`, label: "Excisional hemorrhoidectomy", rationale: "The limited internal disease without an external component supports a less invasive office option first." },
  { id: `thrombectomy_${n}`, label: "External hemorrhoid thrombectomy", rationale: "No thrombosed external hemorrhoid is present." },
  { id: `abscess_drainage_${n}`, label: "Perianal incision and drainage", rationale: "There is no infectious collection to drain." },
] as const;

const stories = [
  ["commute", 45, "I still see painless blood after bowel movements.", "reports persistent painless bright-red bleeding and intermittent tissue prolapse despite fiber and improved bowel habits. Screening and upstream evaluation are current, with no anemia or new alarm symptoms. External inspection and digital examination do not identify the source."],
  ["exercise", 52, "I notice tissue during bowel movements.", "has painless prolapse that returns on its own and occasional bright-red bleeding despite conservative care. Prior colorectal evaluation is adequate; there is no weight loss, anemia, bleeding disorder, antithrombotic concern, or external thrombosis. Local canal anatomy remains unconfirmed after inspection and digital examination."],
  ["workday", 38, "My painless bleeding keeps recurring.", "describes recurrent painless bleeding and reducible prolapse after a sustained bowel-habit program. Appropriate upstream causes and screening have been addressed, and there are no alarm symptoms, infection findings, or important external hemorrhoids on examination."],
  ["followup", 61, "My stools improved with fiber, but the prolapse continues.", "returns with persistent painless prolapse and minor bleeding even though stools are now regular. Colorectal screening and prior evaluation are appropriate, hemoglobin is not concerning, and inspection plus digital examination show no external explanation."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, age, complaint, story], index) => {
  const result = "Anoscopy shows internal hemorrhoidal tissue that prolapses with straining and reduces spontaneously, without a significant external component or another visualized local lesion. Medication and bleeding-risk review identifies no antithrombotic complication, and there is no active infection.";
  return { id: `case.internal-hemorrhoids.${slug}`, displayName: "Persistent anorectal bleeding evaluation", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 6], sexLabels: ["Female", "Male"], stage: 1,
    nodes: [
      { conceptId: "concept.internal-hemorrhoids.anoscopy-evaluation", stem: `Which focused examination should be selected next for {patientName}?`, choices: [...examChoices(index + 1)], explanation: "Anoscopy directly evaluates the anal canal after history, inspection, and digital examination. Rectal bleeding should not automatically be assigned to hemorrhoids; upstream evaluation remains important and is already appropriate for this patient.", claimIds: ["claim.internal-hemorrhoids.anoscopy-evaluation"], gate: { id: `gate.internal-hemorrhoids.anoscopy.${index + 1}`, serviceId: "service.anoscopy", pendingLabel: "Anoscopy examination pending", resultNarrative: result, routeIds: ["route.anoscopy.outsourced"] } },
      { conceptId: "concept.internal-hemorrhoids.office-banding-selection", currentUpdate: result, stem: `What is the best next, least invasive procedural plan for {patientName}'s confirmed internal disease?`, choices: [...treatmentChoices(index + 1)], explanation: "Office rubber-band ligation is appropriate for selected bleeding or prolapsing internal hemorrhoids that persist after conservative care. Medication and bleeding-risk review shows no contraindicating concern or active infection; other office modalities remain valid in other contexts.", claimIds: ["claim.internal-hemorrhoids.office-banding-selection", "claim.internal-hemorrhoids.anoscopy-evaluation"] },
    ],
  };
});

export const INTERNAL_HEMORRHOIDS_CONCEPTS = [
  concept({ id: "concept.internal-hemorrhoids.anoscopy-evaluation", educationalTier: 0, displayName: "Anoscopy for suspected internal hemorrhoids", learningObjective: "Select anoscopy to define local canal anatomy after an appropriate broader evaluation in a stable patient with suspected internal hemorrhoids.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.internal-hemorrhoids.anoscopy-evaluation"] }),
  concept({ id: "concept.internal-hemorrhoids.office-banding-selection", educationalTier: 1, displayName: "Office banding for persistent internal hemorrhoids", learningObjective: "Select office rubber-band ligation for uncomplicated bleeding or prolapsing internal hemorrhoids that persist after conservative care.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.internal-hemorrhoids.office-banding-selection"] }),
];
const family = createDevelopmentFamily({ concepts: INTERNAL_HEMORRHOIDS_CONCEPTS, cases, sourceLabels: labels });
export const INTERNAL_HEMORRHOIDS_TESTED_CONCEPTS = family.testedConcepts;
export const INTERNAL_HEMORRHOIDS_QUESTIONS = family.questions;
export const INTERNAL_HEMORRHOIDS_CASES = family.cases;
export const INTERNAL_HEMORRHOIDS_CASE_REVIEWS = family.caseReviews;
export const INTERNAL_HEMORRHOIDS_AUTHORING_REVIEW = NEEDS_REVIEW;
export const INTERNAL_HEMORRHOIDS_SERVICE_CONTRACTS = [{ serviceId: "service.anoscopy", allowedRouteIds: ["route.anoscopy.outsourced"], delivery: "new_external_contract_required" as const }];
