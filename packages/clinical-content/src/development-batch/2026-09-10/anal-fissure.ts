import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, NEEDS_REVIEW, source, type CaseSpec } from "./batch-helpers";

const SIUCP = "source.sc.siucp-fissure-2023";
const ASCRS = "source.sc.ascrs-fissure-patient";

export const ANAL_FISSURE_CLAIMS = [
  claim({ id: "claim.anal-fissure.acute-midline-recognition", statement: "Recent severe pain with defecation, scant bright-red bleeding, and a superficial midline anal tear on gentle inspection support acute anal fissure.", sourceIds: [SIUCP, ASCRS], evidenceCategory: "evaluation", certainty: "moderate", limitation: "Persistent, lateral, multiple, painless, or otherwise atypical lesions require reassessment; the finding does not explain every cause of rectal bleeding.", applicablePopulation: "Stable outpatients with a recent painful superficial midline tear and no abscess, systemic illness, or chronic fissure features.", lastCheckedOn: "2026-09-10" }),
  claim({ id: "claim.anal-fissure.initial-conservative-care", statement: "Initial care for an uncomplicated acute anal fissure includes stool-regulating fiber, sufficient fluid intake, and warm sitz baths to support comfortable soft formed stools.", sourceIds: [SIUCP, ASCRS], evidenceCategory: "management", certainty: "moderate", limitation: "No exact dose, schedule, duration, medication concentration, or healing probability is specified; persistent symptoms warrant reassessment.", applicablePopulation: "Stable outpatients with a typical uncomplicated acute midline anal fissure.", lastCheckedOn: "2026-09-10" }),
];

export const ANAL_FISSURE_SOURCES = linkSourcesToClaims([
  source({ id: SIUCP, title: "The Italian Unitary Society of Colon-proctology (SIUCP: Societa Italiana Unitaria di Colonproctologia) guidelines for the management of anal fissure", completeCitation: "Brillantino A, Renzi A, Talento P, Iacobellis F, Brusciano L, Monaco L, Izzo D, Giordano A, Pinto M, Fantini C, Gasparrini M, Schiano Di Visconte M, et al. The Italian Unitary Society of Colon-proctology (SIUCP: Societa Italiana Unitaria di Colonproctologia) guidelines for the management of anal fissure. BMC Surgery. 2023;23:311. Published 2023-10-13. doi:10.1186/s12893-023-02223-z.", organizationOrJournal: "BMC Surgery / Italian Unitary Society of Colon-Proctology", authors: ["Brillantino A", "Renzi A", "Talento P", "Iacobellis F", "Brusciano L", "Monaco L", "Izzo D", "Giordano A", "Pinto M", "Fantini C", "Gasparrini M", "Schiano Di Visconte M", "et al."], publicationYear: 2023, doi: "10.1186/s12893-023-02223-z", pmid: null, officialUrl: "https://www.siucp.eu/public/documenti/638659057322833204_linee-guida-ragadi.pdf", accessedOn: "2026-09-10", sourceClass: "professional_society_guideline", licenseLabel: "Creative Commons Attribution 4.0 International", reuseStatus: "cc_by_4_0", reuseNotes: "Original modified factual synthesis with attribution under https://creativecommons.org/licenses/by/4.0/; no prose, tables, figures, or algorithms reproduced.", authorityAssessment: "Directly checked society GRADE guideline supporting recognition by history and inspection and conservative first-line care; the acute-treatment evidence is moderate.", usageRole: "evidence" }),
  source({ id: ASCRS, title: "Anal Fissure Expanded Information", completeCitation: "American Society of Colon and Rectal Surgeons. Anal Fissure Expanded Information. Undated patient education page. Accessed 2026-09-10.", organizationOrJournal: "American Society of Colon and Rectal Surgeons", authors: ["American Society of Colon and Rectal Surgeons"], publicationYear: null, doi: null, pmid: null, officialUrl: "https://fascrs.org/Web/Web/Patients/Diseases-and-Conditions/A-Z/Anal-Fissure-Expanded-Information.aspx", accessedOn: "2026-09-10", sourceClass: "open_educational_resource", licenseLabel: "Copyrighted society patient education; targeted factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "Original factual synthesis and citation only. No source wording, images, or marks reproduced; page date is unknown.", authorityAssessment: "Society patient education directly checked as a lower-authority cross-check for presentation and conservative care; it is not the inaccessible formal guideline.", usageRole: "cross_check" }),
], ANAL_FISSURE_CLAIMS);

const labels = ["SIUCP anal-fissure guideline (2023), CC BY 4.0", "ASCRS anal-fissure patient education (undated)"];
const diagnosisChoices = (n: number) => [
  { id: `acute_fissure_${n}`, label: "Acute anal fissure", isCorrect: true, rationale: "The recent defecation-related pain and superficial midline tear fit an acute fissure." },
  { id: `external_thrombosis_${n}`, label: "Thrombosed external hemorrhoid", rationale: "No tender bluish perianal lump is described." },
  { id: `perianal_abscess_${n}`, label: "Perianal abscess", rationale: "There is no fluctuant collection, fever, or progressive constant pain." },
  { id: `internal_hemorrhoid_${n}`, label: "Prolapsing internal hemorrhoid", rationale: "A superficial painful midline tear explains this presentation more directly." },
] as const;
const careChoices = (n: number) => [
  { id: `conservative_${n}`, label: "Fiber, fluids, soft stools, and sitz baths", isCorrect: true, rationale: "This is appropriate initial care for the uncomplicated acute fissure." },
  { id: `banding_${n}`, label: "Office rubber-band ligation of internal hemorrhoids", rationale: "Banding treats selected internal hemorrhoids, not an acute fissure." },
  { id: `drainage_${n}`, label: "Incision and drainage of a perianal collection", rationale: "There is no abscess or drainable collection." },
  { id: `sphincterotomy_${n}`, label: "Immediate operative internal sphincter division", rationale: "Immediate surgery is not initial care for this uncomplicated acute presentation." },
] as const;

const stories = [
  ["constipation", 31, "I have sharp anal pain with bowel movements.", "reports recent sharp pain during and after firm bowel movements with a small streak of bright-red blood. Gentle inspection shows one superficial posterior midline tear without a sentinel tag, fluctuance, drainage, or lateral lesion."],
  ["post-travel", 47, "I have pain and a little blood after bowel movements.", "developed pain with defecation after travel disrupted usual bowel habits. There is scant bright-red blood, and gentle inspection shows a recent superficial posterior midline tear without chronic scarring or infection."],
  ["postpartum", 35, "I have sharp tearing pain when I pass stool.", "recently gave birth and now has defecation-related pain with scant bright-red spotting. Gentle inspection identifies one superficial anterior midline tear without a chronic tag, surrounding cellulitis, or fluctuance."],
  ["diarrhea", 54, "I have painful anal bleeding with loose stools.", "reports recent pain during and after frequent loose stools with a trace of bright-red blood. Gentle inspection shows one superficial posterior midline tear and no abscess, prolapsing tissue, or chronic fissure features."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, age, complaint, story], index) => ({
  id: `case.anal-fissure.${slug}`, displayName: "Painful anal tear evaluation", chiefComplaint: complaint,
  presentation: `{patientName} ${story}`, ageYears: slug === "postpartum" ? [age, age + 4, age + 8, age + 12] : [age, age + 7], sexLabels: slug === "postpartum" ? ["Female"] : ["Female", "Male"], stage: 1,
  nodes: [
    { conceptId: "concept.anal-fissure.acute-recognition", stem: `Which diagnosis best explains {patientName}'s current presentation?`, choices: [...diagnosisChoices(index + 1)], explanation: "Recent severe pain with defecation, scant bright-red blood, and a superficial midline tear support acute anal fissure. Atypical or persistent findings require reassessment for other causes.", claimIds: ["claim.anal-fissure.acute-midline-recognition"] },
    { conceptId: "concept.anal-fissure.initial-conservative-care", currentUpdate: "The examination findings are recorded, and the patient asks how to begin treatment.", stem: `Which initial care plan is most appropriate for {patientName}'s uncomplicated acute midline tear?`, choices: [...careChoices(index + 1)], explanation: "Initial care emphasizes fiber, sufficient fluids, comfortable soft formed stools, and warm sitz baths. Persistent or atypical symptoms should prompt reassessment rather than assuming every episode of bleeding is from the fissure.", claimIds: ["claim.anal-fissure.initial-conservative-care", "claim.anal-fissure.acute-midline-recognition"] },
  ],
}));

export const ANAL_FISSURE_CONCEPTS = [
  concept({ id: "concept.anal-fissure.acute-recognition", educationalTier: 0, displayName: "Clinical recognition of acute anal fissure", learningObjective: "Recognize an uncomplicated acute anal fissure from recent defecation-related pain, scant bleeding, and a superficial midline tear.", earliestFacilityStage: 1, conceptType: "diagnosis", evidenceClaimIds: ["claim.anal-fissure.acute-midline-recognition"] }),
  concept({ id: "concept.anal-fissure.initial-conservative-care", educationalTier: 0, displayName: "Initial conservative care for acute anal fissure", learningObjective: "Select stool-regulating fiber, fluids, soft formed stools, and sitz baths as initial care for a typical uncomplicated acute fissure.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.anal-fissure.initial-conservative-care"] }),
];
const family = createDevelopmentFamily({ concepts: ANAL_FISSURE_CONCEPTS, cases, sourceLabels: labels });
export const ANAL_FISSURE_TESTED_CONCEPTS = family.testedConcepts;
export const ANAL_FISSURE_QUESTIONS = family.questions;
export const ANAL_FISSURE_CASES = family.cases;
export const ANAL_FISSURE_CASE_REVIEWS = family.caseReviews;
export const ANAL_FISSURE_AUTHORING_REVIEW = NEEDS_REVIEW;
export const ANAL_FISSURE_SERVICE_CONTRACTS = [];
