import { claim, concept, createDevelopmentFamily, linkSourcesToClaims, NEEDS_REVIEW, source, type CaseSpec } from "./batch-helpers";

const SEOUL = "source.sc.seoul-achalasia-2020";

export const ACHALASIA_CLAIMS = [
  claim({ id: "claim.achalasia.high-resolution-manometry", statement: "High-resolution esophageal manometry is the confirmatory physiologic test when achalasia is suspected after structural obstruction and concerning pseudoachalasia have been appropriately excluded.", sourceIds: [SEOUL], evidenceCategory: "evaluation", certainty: "moderate", limitation: "The accepted guideline rates diagnostic evidence as low despite strong consensus. This claim does not prescribe subtype thresholds or a treatment algorithm.", applicablePopulation: "Stable adults with persistent solids-and-liquids dysphagia and regurgitation after an adequate EGD excludes mechanical obstruction and concerning pseudoachalasia.", lastCheckedOn: "2026-09-10" }),
  claim({ id: "claim.achalasia.manometric-recognition", statement: "Absent esophageal peristalsis together with impaired esophagogastric-junction relaxation on high-resolution manometry supports achalasia.", sourceIds: [SEOUL], evidenceCategory: "evaluation", certainty: "moderate", limitation: "No exact pressure cutoff, subtype assignment, or universal requirement for raised basal lower-esophageal-sphincter pressure is asserted; the accepted precise source is a single society guideline.", applicablePopulation: "Adults with an adequate structural evaluation and the authored manometric pattern.", lastCheckedOn: "2026-09-10" }),
];

export const ACHALASIA_SOURCES = linkSourcesToClaims([
  source({ id: SEOUL, title: "2019 Seoul Consensus on Esophageal Achalasia Guidelines", completeCitation: "Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. Journal of Neurogastroenterology and Motility. 2020;26(2):180-203. Published 2020-04-30. doi:10.5056/jnm20014. PMID:32235027.", organizationOrJournal: "Journal of Neurogastroenterology and Motility / Korean Society of Neurogastroenterology and Motility", authors: ["Jung HK", "Hong SJ", "Lee OY", "Pandolfino J", "Park H", "Miwa H", "Ghoshal UC", "Mahadeva S", "et al."], publicationYear: 2020, doi: "10.5056/jnm20014", pmid: "32235027", officialUrl: "https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014", accessedOn: "2026-09-10", sourceClass: "professional_society_guideline", licenseLabel: "Creative Commons Attribution-NonCommercial 4.0 International", reuseStatus: "cc_by_nc_4_0_restricted", reuseNotes: "Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.", authorityAssessment: "Society evidence-based guideline directly checked for HRM after structural assessment and the absent-peristalsis/impaired-relaxation pattern. Diagnostic evidence is low with strong consensus; the inaccessible corrigendum is not represented as reviewed.", usageRole: "evidence" }),
], ACHALASIA_CLAIMS);

const labels = ["Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"];
const testChoices = (n: number) => [
  { id: `manometry_${n}`, label: "High-resolution esophageal manometry", isCorrect: true, serviceId: "service.esophageal_manometry", rationale: "The structural evaluation is complete and the unresolved question is esophageal motility." },
  { id: `repeat_egd_${n}`, label: "Repeat upper-GI endoscopy", rationale: "An adequate recent EGD has already excluded a mechanical explanation and concerning pseudoachalasia." },
  { id: `ph_monitoring_${n}`, label: "Ambulatory esophageal reflux monitoring", rationale: "Reflux monitoring does not define the suspected motility disorder." },
  { id: `chest_ct_${n}`, label: "Contrast-enhanced chest CT", rationale: "Cross-sectional imaging does not provide the required esophageal physiology after the completed structural evaluation." },
] as const;
const diagnosisChoices = (n: number) => [
  { id: `achalasia_${n}`, label: "Achalasia", isCorrect: true, rationale: "Absent peristalsis with impaired EGJ relaxation supports achalasia." },
  { id: `distal_spasm_${n}`, label: "Distal esophageal spasm", rationale: "The reported pattern is absent peristalsis with impaired junction relaxation rather than premature contractions." },
  { id: `reflux_dysmotility_${n}`, label: "Reflux-related dysmotility", rationale: "The combined manometric findings more directly support achalasia." },
  { id: `rumination_${n}`, label: "Rumination syndrome", rationale: "Rumination does not produce this esophageal manometric pattern." },
] as const;

const stories = [
  ["water-and-solids", 42, "I feel both food and water hang up when I swallow.", "reports persistent dysphagia to solids and liquids with passive regurgitation. A recent adequate EGD excluded a fixed obstruction and concerning pseudoachalasia; the patient is stable and maintaining oral hydration."],
  ["night-regurgitation", 57, "I regurgitate undigested food at night.", "has progressive solids-and-liquids dysphagia with nocturnal regurgitation. Prior EGD adequately assessed the esophagus without a mechanical lesion or concerning pseudoachalasia, and there is no acute impaction."],
  ["slow-meals", 34, "My meals take longer because liquids and solids stick.", "describes persistent difficulty passing both food and drinks with intermittent regurgitation. Structural evaluation by EGD is complete and excludes obstruction and concerning pseudoachalasia."],
  ["clinic-referral", 66, "My endoscopy was clear, but swallowing is still difficult.", "is referred after an adequate EGD found no mechanical cause or concerning pseudoachalasia. Dysphagia affects solids and liquids, regurgitation continues, and the patient has no emergency feature."],
] as const;

const cases: CaseSpec[] = stories.map(([slug, age, complaint, story], index) => {
  const result = "High-resolution manometry shows absent organized esophageal peristalsis together with impaired relaxation of the esophagogastric junction.";
  return { id: `case.achalasia.${slug}`, displayName: "Esophageal motility evaluation", chiefComplaint: complaint, presentation: `{patientName} ${story}`, ageYears: [age, age + 6], sexLabels: ["Female", "Male"], stage: 1,
    nodes: [
      { conceptId: "concept.achalasia.high-resolution-manometry", stem: `Which test should confirm the suspected motility disorder in {patientName}?`, choices: [...testChoices(index + 1)], explanation: "After an adequate endoscopic structural assessment excludes obstruction and concerning pseudoachalasia, high-resolution manometry supplies the esophageal physiology needed to evaluate suspected achalasia.", claimIds: ["claim.achalasia.high-resolution-manometry"], gate: { id: `gate.achalasia.manometry.${index + 1}`, serviceId: "service.esophageal_manometry", pendingLabel: "Esophageal manometry pending", resultNarrative: result, routeIds: ["route.esophageal_manometry.outsourced"] } },
      { conceptId: "concept.achalasia.manometric-recognition", currentUpdate: result, stem: `Which diagnosis best explains {patientName}'s manometric pattern?`, choices: [...diagnosisChoices(index + 1)], explanation: "Absent peristalsis together with impaired EGJ relaxation supports achalasia. Basal sphincter pressure can vary, so recognition rests on the accepted physiologic pattern rather than a universally elevated basal pressure.", claimIds: ["claim.achalasia.manometric-recognition", "claim.achalasia.high-resolution-manometry"] },
    ],
  };
});

export const ACHALASIA_CONCEPTS = [
  concept({ id: "concept.achalasia.high-resolution-manometry", educationalTier: 0, displayName: "High-resolution manometry for suspected achalasia", learningObjective: "Select high-resolution esophageal manometry after adequate structural evaluation for persistent solids-and-liquids dysphagia with regurgitation.", earliestFacilityStage: 1, conceptType: "workup", evidenceClaimIds: ["claim.achalasia.high-resolution-manometry"] }),
  concept({ id: "concept.achalasia.manometric-recognition", educationalTier: 1, displayName: "Manometric recognition of achalasia", learningObjective: "Recognize achalasia from absent peristalsis and impaired esophagogastric-junction relaxation without relying on an unsupported numeric threshold.", earliestFacilityStage: 1, conceptType: "diagnosis", evidenceClaimIds: ["claim.achalasia.manometric-recognition"] }),
];
const family = createDevelopmentFamily({ concepts: ACHALASIA_CONCEPTS, cases, sourceLabels: labels });
export const ACHALASIA_TESTED_CONCEPTS = family.testedConcepts;
export const ACHALASIA_QUESTIONS = family.questions;
export const ACHALASIA_CASES = family.cases;
export const ACHALASIA_CASE_REVIEWS = family.caseReviews;
export const ACHALASIA_AUTHORING_REVIEW = NEEDS_REVIEW;
export const ACHALASIA_SERVICE_CONTRACTS = [{ serviceId: "service.esophageal_manometry", allowedRouteIds: ["route.esophageal_manometry.outsourced"], delivery: "new_external_contract_required" as const }];
