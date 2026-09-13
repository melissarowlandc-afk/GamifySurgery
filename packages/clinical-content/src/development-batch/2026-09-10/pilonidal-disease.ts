import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, NEEDS_REVIEW, source, type CaseSpec } from "./batch-helpers";

const SICCR = "source.sc.siccr-pilonidal-2021";
const ASCRS = "source.sc.ascrs-pilonidal-patient";

export const PILONIDAL_DISEASE_CLAIMS = [
  claim({ id: "claim.pilonidal-disease.chronic-sinus-recognition", statement: "Recurrent drainage through characteristic midline pits in the natal cleft, without a current abscess, supports chronic pilonidal sinus disease on clinical examination.", sourceIds: [SICCR, ASCRS], evidenceCategory: "evaluation", certainty: "moderate", limitation: "The examination should consider other causes, including an anal fistula when the location or history raises concern; routine imaging is not required for the classic presentation used here.", applicablePopulation: "Stable adults with recurrent natal-cleft drainage and midline pits but no fluctuant abscess, cellulitis, or systemic illness.", lastCheckedOn: "2026-09-10" }),
  claim({ id: "claim.pilonidal-disease.off-midline-closure-planning", statement: "When excision with primary closure has already been selected for chronic pilonidal disease, the closure should be placed away from the natal midline.", sourceIds: [SICCR], evidenceCategory: "management", certainty: "moderate", limitation: "Open healing and minimally invasive approaches remain valid individualized alternatives, and no single named flap is asserted to be best for every patient.", applicablePopulation: "Stable adults with chronic pilonidal disease who, after individualized discussion, have selected excision with primary closure.", lastCheckedOn: "2026-09-10" }),
];

export const PILONIDAL_DISEASE_SOURCES = linkSourcesToClaims([
  source({ id: SICCR, title: "Consensus statement of the Italian society of colorectal surgery (SICCR): management and treatment of pilonidal disease", completeCitation: "Milone M, Basso L, Manigrasso M, Pietroletti R, Bondurri A, La Torre M, Milito G, Pozzo M, Segre D, Perinotti R, Gallo G. Consensus statement of the Italian society of colorectal surgery (SICCR): management and treatment of pilonidal disease. Techniques in Coloproctology. 2021;25(12):1269-1280. Published 2021-06-27. doi:10.1007/s10151-021-02487-8. PMID:34176001.", organizationOrJournal: "Techniques in Coloproctology / Italian Society of Colorectal Surgery", authors: ["Milone M", "Basso L", "Manigrasso M", "Pietroletti R", "Bondurri A", "La Torre M", "Milito G", "Pozzo M", "Segre D", "Perinotti R", "Gallo G"], publicationYear: 2021, doi: "10.1007/s10151-021-02487-8", pmid: "34176001", officialUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8580911/", accessedOn: "2026-09-10", sourceClass: "professional_society_guideline", licenseLabel: "Creative Commons Attribution 4.0 International", reuseStatus: "cc_by_4_0", reuseNotes: "Original modified factual synthesis with attribution under https://creativecommons.org/licenses/by/4.0/; no source prose, tables, figures, or algorithms reproduced.", authorityAssessment: "Society systematic-review and Delphi consensus directly checked for clinical diagnosis and conditional off-midline primary closure, with individualized alternatives and no universally best named flap.", usageRole: "evidence" }),
  source({ id: ASCRS, title: "Pilonidal Disease", completeCitation: "American Society of Colon and Rectal Surgeons. Pilonidal Disease. Undated patient education page. Accessed 2026-09-10.", organizationOrJournal: "American Society of Colon and Rectal Surgeons", authors: ["American Society of Colon and Rectal Surgeons"], publicationYear: null, doi: null, pmid: null, officialUrl: "https://fascrs.org/Web/Web/Patients/Diseases-and-Conditions/A-Z/Pilonidal-Disease.aspx", accessedOn: "2026-09-10", sourceClass: "open_educational_resource", licenseLabel: "Copyrighted society patient education; targeted factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "Original factual synthesis and citation only. No source wording, schedules, images, or marks reproduced; page date is unknown.", authorityAssessment: "Society patient education directly checked as a lower-authority cross-check for recurrent natal-cleft disease and individualized elective care; it does not independently compare closure techniques.", usageRole: "cross_check" }),
], PILONIDAL_DISEASE_CLAIMS);

const labels = ["SICCR pilonidal-disease consensus (2021), CC BY 4.0", "ASCRS pilonidal-disease patient education (undated)"];
const diagnosisChoices = (n: number) => [
  { id: `pilonidal_${n}`, label: "Chronic pilonidal disease", isCorrect: true, rationale: "Recurrent drainage from midline natal-cleft pits is characteristic of chronic pilonidal disease." },
  { id: `anal_fistula_${n}`, label: "Cryptoglandular anal fistula", rationale: "The openings are centered in the natal cleft and the anorectal examination does not identify a fistula pattern." },
  { id: `hidradenitis_${n}`, label: "Hidradenitis suppurativa", rationale: "There are characteristic midline pits rather than multifocal intertriginous nodules and tracts." },
  { id: `epidermal_cyst_${n}`, label: "Epidermal inclusion cyst", rationale: "A solitary cyst does not account as well for recurrent drainage through several midline pits." },
] as const;
const closureChoices = (n: number) => [
  { id: `off_midline_${n}`, label: "Off-midline primary closure", isCorrect: true, rationale: "When primary closure is chosen, the closure should be displaced away from the natal midline." },
  { id: `midline_${n}`, label: "Conventional midline primary closure", rationale: "Primary closure directly in the natal midline has less favorable wound outcomes." },
  { id: `open_${n}`, label: "Open healing without primary closure", rationale: "Open healing can be valid, but it does not follow the already selected primary-closure plan." },
  { id: `pit_excision_${n}`, label: "Limited pit excision without primary closure", rationale: "A minimally invasive approach can be valid for selected disease, but the patient has already chosen excision with primary closure." },
] as const;

const stories = [
  ["recurrent-drainage", 27, "I have a spot in the upper groove between my buttocks near my tailbone that keeps draining.", "reports repeated drainage from the upper groove between the buttocks near the tailbone. Examination shows several pits along the midline and a quiet sinus opening, without current fluctuance, cellulitis, fever, or anorectal fistula findings."],
  ["work-clothing", 34, "My work clothes get stained by drainage from the upper groove between my buttocks.", "has intermittent drainage and tenderness in the upper groove between the buttocks near the tailbone. Midline pits are visible without a current abscess, surrounding infection, systemic illness, or an opening near the anal canal."],
  ["cycling", 22, "I notice a small opening near my tailbone that drains after cycling.", "describes recurrent drainage from the upper groove between the buttocks near the tailbone. Examination identifies characteristic midline pits and no fluctuant collection, cellulitis, fever, or anorectal source."],
  ["quiet-sinus", 41, "I have an opening in the upper groove between my buttocks that keeps returning after it closes.", "has a recurrent draining opening in the upper groove between the buttocks near the tailbone with several midline pits. There is no current abscess, spreading erythema, systemic symptom, or examination finding suggesting anal fistula."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, age, complaint, story], index) => ({
  id: `case.pilonidal-disease.${slug}`, displayName: "Recurrent drainage near the tailbone", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 6], sexLabels: ["Female", "Male"], stage: 1,
  nodes: [
    { conceptId: "concept.pilonidal-disease.chronic-sinus-recognition", stem: `Which diagnosis best explains {patientName}'s recurrent finding in the upper groove between the buttocks near the tailbone?`, choices: [...diagnosisChoices(index + 1)], explanation: "Recurrent drainage through characteristic midline natal-cleft pits supports chronic pilonidal sinus disease. Location and examination help distinguish anorectal fistula and other skin conditions.", claimIds: ["claim.pilonidal-disease.chronic-sinus-recognition"] },
    { conceptId: "concept.pilonidal-disease.off-midline-closure-planning", currentUpdate: "Elective options are reviewed, and the patient and surgeon select excision with primary closure.", stem: `After individualized discussion, {patientName} selects excision with primary closure. Which closure strategy should be planned?`, choices: [...closureChoices(index + 1)], explanation: "Once excision with primary closure is selected, the closure should lie away from the natal midline. Open healing and minimally invasive procedures remain reasonable alternatives in other individualized plans, and no single named flap is preferred for every patient.", claimIds: ["claim.pilonidal-disease.off-midline-closure-planning", "claim.pilonidal-disease.chronic-sinus-recognition"] },
  ],
}));

export const PILONIDAL_DISEASE_CONCEPTS = [
  concept({ id: "concept.pilonidal-disease.chronic-sinus-recognition", educationalTier: 0, displayName: "Clinical recognition of chronic pilonidal sinus", learningObjective: "Recognize chronic pilonidal sinus disease from recurrent natal-cleft drainage and characteristic midline pits without a current abscess.", earliestFacilityStage: 1, conceptType: "diagnosis", evidenceClaimIds: ["claim.pilonidal-disease.chronic-sinus-recognition"] }),
  concept({ id: "concept.pilonidal-disease.off-midline-closure-planning", educationalTier: 1, displayName: "Off-midline closure planning for pilonidal disease", learningObjective: "Plan an off-midline closure when excision with primary closure has already been selected for chronic pilonidal disease.", earliestFacilityStage: 1, conceptType: "management", evidenceClaimIds: ["claim.pilonidal-disease.off-midline-closure-planning"] }),
];
const family = createDevelopmentFamily({ concepts: PILONIDAL_DISEASE_CONCEPTS, cases, sourceLabels: labels });
export const PILONIDAL_DISEASE_TESTED_CONCEPTS = family.testedConcepts;
export const PILONIDAL_DISEASE_QUESTIONS = family.questions;
export const PILONIDAL_DISEASE_CASES = family.cases;
export const PILONIDAL_DISEASE_CASE_REVIEWS = family.caseReviews;
export const PILONIDAL_DISEASE_AUTHORING_REVIEW = NEEDS_REVIEW;
export const PILONIDAL_DISEASE_SERVICE_CONTRACTS = [];
