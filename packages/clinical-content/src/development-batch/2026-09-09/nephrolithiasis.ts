import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, source, type CaseSpec } from "./batch-helpers";

const DIAGNOSIS = "source.niddk.kidney-stones-diagnosis.2017";
const TREATMENT = "source.niddk.kidney-stones-treatment.2017";
export const NEPHROLITHIASIS_CLAIMS = [
  claim({ id: "claim.nephrolithiasis.noncontrast-ct", statement: "Noncontrast CT can clarify stone presence, location, and obstruction when a stable nonpregnant adult has unresolved diagnostic uncertainty after indeterminate ultrasound.", sourceIds: [DIAGNOSIS], evidenceCategory: "evaluation", certainty: "moderate", limitation: "This is not a universal first-line imaging rule and does not apply to pregnancy, children, or unstable presentations.", applicablePopulation: "Stable nonpregnant adults with suspected stone disease and unresolved diagnostic uncertainty.", lastCheckedOn: "2026-09-09" }),
  claim({ id: "claim.nephrolithiasis.recurrent-metabolic", statement: "Recurrent stone disease supports stone-composition analysis when material is available and urine and blood metabolic evaluation, including a 24-hour urine assessment of volume and mineral measures, to inform prevention planning.", sourceIds: [DIAGNOSIS, TREATMENT], evidenceCategory: "evaluation", certainty: "moderate", limitation: "Sources are older single-agency guidance; this claim does not prescribe a preventive drug or exact collection protocol.", applicablePopulation: "Adults with recurrent confirmed kidney stone disease after the acute episode is addressed.", lastCheckedOn: "2026-09-09" }),
  claim({ id: "claim.nephrolithiasis.infection-evidence-separate", statement: "Clinical and urine findings relevant to urinary infection are distinct from CT characterization of stone location and obstruction.", sourceIds: [DIAGNOSIS], evidenceCategory: "safety_boundary", certainty: "moderate", limitation: "An available urinalysis without documented infection is not treated as an absolute exclusion of infection.", applicablePopulation: "Stable adults undergoing evaluation for suspected kidney stones.", lastCheckedOn: "2026-09-09" }),
];
export const NEPHROLITHIASIS_SOURCES = linkSourcesToClaims([
  source({ id: DIAGNOSIS, title: "Diagnosis of Kidney Stones", completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases. Diagnosis of Kidney Stones. Reviewed May 2017.", organizationOrJournal: "NIDDK", authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"], publicationYear: 2017, doi: null, pmid: null, officialUrl: "https://www.niddk.nih.gov/health-information/urologic-diseases/kidney-stones/diagnosis", accessedOn: "2026-09-09", sourceClass: "government_guidance", licenseLabel: "United States government work; NIDDK reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only; third-party matter and agency marks excluded.", authorityAssessment: "Federal patient guidance directly checked for CT characterization and urine/blood testing; older single-agency source.", usageRole: "evidence" }),
  source({ id: TREATMENT, title: "Treatment for Kidney Stones", completeCitation: "National Institute of Diabetes and Digestive and Kidney Diseases. Treatment for Kidney Stones. Reviewed May 2017.", organizationOrJournal: "NIDDK", authors: ["National Institute of Diabetes and Digestive and Kidney Diseases"], publicationYear: 2017, doi: null, pmid: null, officialUrl: "https://www.niddk.nih.gov/health-information/urologic-diseases/kidney-stones/treatment", accessedOn: "2026-09-09", sourceClass: "government_guidance", licenseLabel: "United States government work; NIDDK reuse conditions apply", reuseStatus: "public_domain_conditions_apply", reuseNotes: "Original factual synthesis only; no copied drug tables, source prose, or art.", authorityAssessment: "Federal patient guidance directly checked for stone analysis and urine assessment in prevention planning; older single-agency source.", usageRole: "evidence" }),
], NEPHROLITHIASIS_CLAIMS);

const scenarios = [
  ["recurrent-flank-pain", 34, ["Female"], "I have intermittent flank pain.", "has recurrent flank pain and microscopic blood in the urine. An ultrasound was indeterminate, symptoms are controlled, and they are nonpregnant, afebrile, and without hypotension or solitary-kidney concern."],
  ["uncertain-ureteral-stone", 47, ["Male"], "I have side-to-groin pain.", "has episodic side-to-groin pain. Ultrasound did not establish a stone or obstruction. They are stable, afebrile, and able to take fluids."],
  ["prior-stone-new-pain", 56, ["Female"], "I have new flank pain and prior stones.", "has a prior passed stone and new intermittent flank pain. Ultrasound was limited and nondiagnostic. They are nonpregnant and comfortable now without fever, persistent vomiting, or systemic illness."],
  ["hematuria-colic", 41, ["Male"], "I have colicky flank pain and blood in my urine.", "reports colicky flank pain with hematuria. Initial ultrasound leaves the cause uncertain. They are stable, with no infectious features or uncontrolled pain."],
] as const;

const cases: CaseSpec[] = scenarios.map(([slug, age, sexes, complaint, story], index) => {
  const n = index + 1;
  const result = "Noncontrast CT confirms a ureteral stone, defines its location, and shows no high-grade obstruction. The patient remains afebrile, and an available pre-imaging urinalysis has not documented urinary infection. The history establishes more than one stone episode.";
  return { id: `case.nephrolithiasis.${slug}`, displayName: "Stable flank-pain evaluation", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 5], sexLabels: sexes, stage: 1, nodes: [
    { conceptId: "concept.nephrolithiasis.noncontrast-ct-evaluation", stem: "Which imaging study best resolves the remaining diagnostic question?", choices: [
      { id: `noncontrast_ct_${n}`, label: "Obtain noncontrast CT of the abdomen and pelvis", isCorrect: true, serviceId: "service.ct", rationale: "This study can clarify stone presence, location, and obstruction in the scoped stable nonpregnant patient." },
      { id: `repeat_plain_film_${n}`, label: "Obtain a plain abdominal radiograph", rationale: "A plain film does not reliably settle the full question of stone presence, location, and obstruction." },
      { id: `contrast_ct_${n}`, label: "Obtain multiphase contrast-enhanced CT urography", rationale: "The narrower unresolved stone question does not require this more extensive contrast protocol." },
      { id: `mri_${n}`, label: "Obtain contrast-enhanced abdominal MRI", rationale: "MRI is not the usual study for answering this scoped stone question." },
    ], explanation: "After indeterminate ultrasound, noncontrast CT can resolve whether a stone is present, where it lies, and whether obstruction exists in this stable nonpregnant adult. This does not make CT universal first-line imaging for every suspected stone.", claimIds: ["claim.nephrolithiasis.noncontrast-ct", "claim.nephrolithiasis.infection-evidence-separate"], gate: { id: `gate.nephrolithiasis.ct.${n}`, serviceId: "service.ct", pendingLabel: "Noncontrast CT pending", resultNarrative: result, routeIds: ["route.ct.outsourced", "route.ct.in_house"] } },
    { conceptId: "concept.nephrolithiasis.recurrent-metabolic-evaluation", currentUpdate: result, stem: "After the acute episode is addressed, which evaluation best supports individualized prevention planning?", choices: [
      { id: `stone_metabolic_${n}`, label: "Stone analysis with serum studies and 24-hour urine testing", isCorrect: true, rationale: "Recurrent confirmed stone disease supports composition and metabolic assessment, including urine volume and mineral measures." },
      { id: `ultrasound_urine_${n}`, label: "Repeat renal ultrasound with spot urinalysis and urine culture", rationale: "This does not provide stone composition or a full prevention-oriented urinary metabolic assessment." },
      { id: `serum_radiograph_${n}`, label: "Serum electrolytes and creatinine with repeat abdominal radiography", rationale: "This omits stone analysis and the urine-volume and mineral assessment used for individualized prevention planning." },
      { id: `interval_ct_urine_${n}`, label: "Interval CT imaging with urinalysis at the next painful episode", rationale: "Waiting for another episode and repeating imaging does not characterize current recurrent-stone metabolic contributors." },
    ], explanation: "For recurrent confirmed stone disease, analysis of retrieved stone material and urine and blood metabolic assessment can inform prevention planning.", claimIds: ["claim.nephrolithiasis.recurrent-metabolic"] },
  ] };
});

export const NEPHROLITHIASIS_CONCEPTS = [
  concept({ id: "concept.nephrolithiasis.noncontrast-ct-evaluation", educationalTier: 1, displayName: "Noncontrast CT for unresolved suspected stone disease", learningObjective: "Select noncontrast CT to resolve stone presence, location, and obstruction in a stable nonpregnant adult after indeterminate ultrasound.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.nephrolithiasis.noncontrast-ct", "claim.nephrolithiasis.infection-evidence-separate"] }),
  concept({ id: "concept.nephrolithiasis.recurrent-metabolic-evaluation", educationalTier: 1, displayName: "Metabolic evaluation after recurrent kidney stones", learningObjective: "Select stone analysis when available together with urine and blood metabolic assessment for prevention planning after recurrent confirmed stone disease.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.nephrolithiasis.recurrent-metabolic"] }),
];
const family = createDevelopmentFamily({ concepts: NEPHROLITHIASIS_CONCEPTS, cases, sourceLabels: ["NIDDK kidney-stone diagnosis and treatment guidance (reviewed 2017; older single-agency evidence)"] });
export const NEPHROLITHIASIS_TESTED_CONCEPTS = family.testedConcepts;
export const NEPHROLITHIASIS_QUESTIONS = family.questions;
export const NEPHROLITHIASIS_CASES = family.cases;
export const NEPHROLITHIASIS_CASE_REVIEWS = family.caseReviews;



