import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, NEEDS_REVIEW, source, type CaseSpec } from "./batch-helpers";

const NODULES = "source.sc.ata-thyroid-nodules";
const CYTOPATHOLOGY = "source.sc.ata-thyroid-cytopathology";

export const THYROID_NODULE_CLAIMS = [
  claim({ id: "claim.thyroid-nodule.fna-after-selected-ultrasound", statement: "For a stable patient whose ultrasound identifies suspicious thyroid-nodule features meeting biopsy criteria, ultrasound-guided fine-needle aspiration is an appropriate next diagnostic step after TSH and ultrasound evaluation.", sourceIds: [NODULES], evidenceCategory: "evaluation", certainty: "moderate", limitation: "This does not define ultrasound score cutoffs, size thresholds, or the workup of every thyroid nodule.", applicablePopulation: "Stable outpatients with a selected suspicious thyroid nodule, normal TSH, and ultrasound features meeting biopsy criteria.", lastCheckedOn: "2026-09-10" }),
  claim({ id: "claim.thyroid-nodule.follicular-invasion-histology", statement: "Follicular cytology cannot itself establish capsular or vascular invasion; that distinction between follicular adenoma and carcinoma requires histologic evaluation of the lesion.", sourceIds: [CYTOPATHOLOGY], evidenceCategory: "evaluation", certainty: "moderate", limitation: "This bounded distinction does not prescribe an operation, molecular-testing strategy, or management for every indeterminate cytology result.", applicablePopulation: "Patients whose thyroid FNA is reported as a follicular neoplasm in this authored diagnostic pathway.", lastCheckedOn: "2026-09-10" }),
];

export const THYROID_NODULE_SOURCES = linkSourcesToClaims([
  source({ id: NODULES, title: "Thyroid Nodules", completeCitation: "American Thyroid Association. Thyroid Nodules. Undated patient education page. Accessed 2026-09-10.", organizationOrJournal: "American Thyroid Association", authors: ["American Thyroid Association"], publicationYear: null, doi: null, pmid: null, officialUrl: "https://www.thyroid.org/thyroid-nodules/", accessedOn: "2026-09-10", sourceClass: "open_educational_resource", licenseLabel: "Copyrighted society educational guidance; targeted factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "Original factual synthesis only. No source prose, tables, images, or trademarks are reproduced; the source is cited without implying endorsement.", authorityAssessment: "American Thyroid Association public education page directly checked for the scoped TSH, ultrasound, and selected FNA evaluation facts; it is not an independently verified guideline cross-check.", usageRole: "evidence" }),
  source({ id: CYTOPATHOLOGY, title: "Quality Assurance in Cytopathology and Histopathology of the Thyroid", completeCitation: "American Thyroid Association. Quality Assurance in Cytopathology and Histopathology of the Thyroid. Undated professional laboratory guidance page. Accessed 2026-09-10.", organizationOrJournal: "American Thyroid Association", authors: ["American Thyroid Association"], publicationYear: null, doi: null, pmid: null, officialUrl: "https://www.thyroid.org/professionals/laboratory-services-library/quality-assurance-cytopathology/", accessedOn: "2026-09-10", sourceClass: "open_educational_resource", licenseLabel: "Copyrighted society educational guidance; targeted factual verification only", reuseStatus: "copyrighted_targeted_verification_only", reuseNotes: "Original factual synthesis only. No source prose, tables, images, or trademarks are reproduced; the source is cited without implying endorsement.", authorityAssessment: "American Thyroid Association laboratory guidance directly checked for the limitation of follicular cytology and the need for histology to establish invasion; it is not an independent cross-check.", usageRole: "evidence" }),
], THYROID_NODULE_CLAIMS);

const labels = ["American Thyroid Association thyroid-nodule and cytopathology guidance (undated; accessed 2026-09-10)"];
const fnaChoices = (n: number) => [
  { id: `thyroid_fna_${n}`, label: "Ultrasound-guided thyroid FNA", isCorrect: true, serviceId: "service.thyroid_fna", rationale: "The report identifies suspicious features meeting biopsy criteria." },
  { id: `repeat_tsh_${n}`, label: "Serum thyroid-stimulating hormone", rationale: "The TSH result is already available." },
  { id: `radionuclide_scan_${n}`, label: "Radionuclide thyroid uptake scan", rationale: "This is not the selected next test in the current normal-TSH presentation." },
  { id: `repeat_ultrasound_${n}`, label: "Repeat thyroid ultrasonography", rationale: "The existing ultrasound already identifies features meeting biopsy criteria." },
] as const;
const histologyChoices = (n: number) => [
  { id: `invasion_histology_${n}`, label: "Histologic capsular or vascular invasion", isCorrect: true, rationale: "Invasion requires examination of tissue architecture, not cytology alone." },
  { id: `repeat_fna_${n}`, label: "Follicular-pattern cells on repeat aspiration", rationale: "Additional cytology does not demonstrate capsular or vascular invasion." },
  { id: `normal_tsh_${n}`, label: "Normal thyroid-stimulating hormone concentration", rationale: "TSH helps frame initial evaluation but does not classify follicular invasion." },
  { id: `ultrasound_pattern_${n}`, label: "An ultrasound with suspicious nodule features", rationale: "Ultrasound can select a nodule for FNA but cannot prove histologic invasion." },
] as const;

const stories = [
  ["palpable-referral", 42, "I was referred after a neck ultrasound.", "was referred after a clinician noted a thyroid nodule. TSH is normal, ultrasound identifies suspicious features meeting biopsy criteria, and there is no airway symptom or thyrotoxicosis concern.", "Which diagnostic step best fits {patientName}'s thyroid nodule now?"],
  ["incidental-imaging", 55, "My carotid scan found a thyroid nodule.", "brings an incidental thyroid-nodule report from vascular imaging. Dedicated ultrasound and normal TSH are already available, and the nodule has suspicious features meeting biopsy criteria; the patient is clinically stable.", "What is the appropriate next diagnostic action for {patientName}?"],
  ["family-clinic", 36, "I am worried about a new thyroid finding.", "comes to endocrine clinic after a family clinician arranged ultrasound for a new thyroid finding. TSH is normal, the nodule meets biopsy criteria on ultrasound, and there is no compressive emergency.", "Which study should be arranged next for {patientName}'s nodule?"],
  ["surveillance-change", 63, "My follow-up scan changed the plan.", "returns after surveillance ultrasound identified a thyroid nodule with suspicious features meeting biopsy criteria. TSH remains normal, and the patient has no acute breathing, swallowing, or hormone-excess concern.", "What is the best next diagnostic step for {patientName}?"],
] as const;

const cases: CaseSpec[] = stories.map(([slug, age, complaint, story, stem], index) => {
  const result = "Ultrasound-guided FNA reports a follicular neoplasm.";
  return {
    id: `case.thyroid-nodule.${slug}`, displayName: "Selected thyroid-nodule evaluation", chiefComplaint: complaint,
    presentation: `{patientName} ${story}`, ageYears: [age, age + 5], sexLabels: ["Female", "Male"], stage: 1,
    nodes: [
      { conceptId: "concept.thyroid-nodule.fna-selection", stem, choices: [...fnaChoices(index + 1)], explanation: "Normal TSH with suspicious ultrasound findings meeting biopsy criteria supports ultrasound-guided FNA for {patientName}'s nodule. Further care depends on the cytology and the patient's clinical context.", claimIds: ["claim.thyroid-nodule.fna-after-selected-ultrasound"], gate: { id: `gate.thyroid-nodule.fna.${index + 1}`, serviceId: "service.thyroid_fna", pendingLabel: "Thyroid FNA cytology pending", resultNarrative: result, routeIds: ["route.thyroid_fna.outsourced"] } },
      { conceptId: "concept.thyroid-nodule.follicular-invasion-histology", currentUpdate: result, stem: "After {patientName}'s follicular-neoplasm cytology result, which additional finding would establish follicular carcinoma?", choices: [...histologyChoices(index + 1)], explanation: "Follicular cytology does not show capsular or vascular invasion. Histologic evaluation determines whether that invasion is present and informs individualized management.", claimIds: ["claim.thyroid-nodule.follicular-invasion-histology"] },
    ],
  };
});

export const THYROID_NODULE_CONCEPTS = [
  concept({ id: "concept.thyroid-nodule.fna-selection", educationalTier: 0, displayName: "FNA selection for a suspicious thyroid nodule", learningObjective: "Select ultrasound-guided FNA after normal TSH and ultrasound findings meeting biopsy criteria in the scoped stable outpatient pathway.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.thyroid-nodule.fna-after-selected-ultrasound"] }),
  concept({ id: "concept.thyroid-nodule.follicular-invasion-histology", educationalTier: 1, displayName: "Follicular invasion requires histology", learningObjective: "Recognize that capsular or vascular invasion distinguishing follicular adenoma from carcinoma requires histologic evaluation rather than follicular cytology alone.", earliestFacilityStage: 1, conceptType: "diagnosis", evidenceClaimIds: ["claim.thyroid-nodule.follicular-invasion-histology"] }),
];
const family = createDevelopmentFamily({ concepts: THYROID_NODULE_CONCEPTS, cases, sourceLabels: labels });
export const THYROID_NODULE_TESTED_CONCEPTS = family.testedConcepts;
export const THYROID_NODULE_QUESTIONS = family.questions;
export const THYROID_NODULE_CASES = family.cases;
export const THYROID_NODULE_CASE_REVIEWS = family.caseReviews;
export const THYROID_NODULE_AUTHORING_REVIEW = NEEDS_REVIEW;
export const THYROID_NODULE_SERVICE_CONTRACTS = [{ serviceId: "service.thyroid_fna", allowedRouteIds: ["route.thyroid_fna.outsourced"], delivery: "new_external_contract_required" as const }];
