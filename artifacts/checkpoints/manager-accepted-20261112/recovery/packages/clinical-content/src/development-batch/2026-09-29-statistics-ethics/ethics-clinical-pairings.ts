import type { ClinicalSource, EvidenceClaim, QuestionVariant } from "../../pilot-schema";
import type { AnswerChoiceTimingRegistryEntry, SyntheticClinicalCase } from "../../schema";
import { ROW_036_CASES, ROW_036_EVIDENCE_CLAIMS, ROW_036_SOURCES } from "../../approved-data/mondor-disease";
import { ROW_048_CASES, ROW_048_EVIDENCE_CLAIMS, ROW_048_SOURCES } from "../../approved-data/desmoid-management-pathway";
import { ROW_060_CASES, ROW_060_EVIDENCE_CLAIMS, ROW_060_QUESTION_VARIANTS, ROW_060_SOURCES } from "../../approved-data/familial-hypocalciuric-hypercalcemia";
import { GASTRIC_GIST_CASES, GASTRIC_GIST_CASE_REVIEWS, GASTRIC_GIST_CLAIMS, GASTRIC_GIST_QUESTIONS, GASTRIC_GIST_SOURCES, GASTRIC_GIST_TIMING_ENTRIES } from "../2026-09-12/gastric-gist";
import { PERIANAL_ABSCESS_CASES, PERIANAL_ABSCESS_CASE_REVIEWS, PERIANAL_ABSCESS_CLAIMS, PERIANAL_ABSCESS_QUESTIONS, PERIANAL_ABSCESS_SOURCES, PERIANAL_ABSCESS_TIMING_ENTRIES } from "../2026-09-17-bread-and-butter/perianal-abscess";
import { HIDRADENITIS } from "../2026-09-28-pre-endoscopy/hidradenitis-suppurativa";
import { VARICOSE_VEINS } from "../2026-09-28-pre-endoscopy/varicose-veins";
import { PTLD } from "../2026-09-29-pre-endoscopy/ptld";
import { NEEDS_REVIEW, OWNER_DELEGATED_AGENT_REVIEW, type DevelopmentQuestion } from "./batch-helpers";
import type { buildFamily } from "./family-builder";
import type { ClinicalAnchorKey } from "./statistics-variants";

type DecisionNode = SyntheticClinicalCase["decisionNodes"][number];
type Family = ReturnType<typeof buildFamily>;

export const P2E_CONTENT_VERSION = "development-batch.2026-09-29.statistics-ethics.p2e.1";
const P2E_AGENT_REVIEW = { ...OWNER_DELEGATED_AGENT_REVIEW, reviewedOn: "2026-10-17" } as const;
interface PairedClinicalQuestion extends Omit<DevelopmentQuestion, "agentReview"> {
  agentReview: typeof P2E_AGENT_REVIEW;
}

// Direct references to authored records, never a second clinical evidence catalog.
// Do not import the aggregate index here: it assembles this batch as well.
export const P2E_REUSED_CLINICAL_CONTENT = {
  cases: [
    ...VARICOSE_VEINS.cases, ...PERIANAL_ABSCESS_CASES,
    ...PTLD.cases, ...GASTRIC_GIST_CASES, ...ROW_048_CASES,
    ...HIDRADENITIS.cases, ...ROW_060_CASES, ...ROW_036_CASES,
  ] as SyntheticClinicalCase[],
  questions: [
    ...VARICOSE_VEINS.questions, ...PERIANAL_ABSCESS_QUESTIONS,
    ...PTLD.questions, ...GASTRIC_GIST_QUESTIONS, ...HIDRADENITIS.questions,
    ...ROW_060_QUESTION_VARIANTS,
  ] as QuestionVariant[],
  claims: [
    ...VARICOSE_VEINS.claims, ...PERIANAL_ABSCESS_CLAIMS,
    ...PTLD.claims, ...GASTRIC_GIST_CLAIMS, ...ROW_048_EVIDENCE_CLAIMS,
    ...HIDRADENITIS.claims, ...ROW_060_EVIDENCE_CLAIMS, ...ROW_036_EVIDENCE_CLAIMS,
  ] as EvidenceClaim[],
  sources: [
    ...VARICOSE_VEINS.sources, ...PERIANAL_ABSCESS_SOURCES,
    ...PTLD.sources, ...GASTRIC_GIST_SOURCES, ...ROW_048_SOURCES,
    ...HIDRADENITIS.sources, ...ROW_060_SOURCES, ...ROW_036_SOURCES,
  ] as ClinicalSource[],
  timingEntries: [
    ...VARICOSE_VEINS.timingEntries, ...PERIANAL_ABSCESS_TIMING_ENTRIES,
    ...PTLD.timingEntries, ...GASTRIC_GIST_TIMING_ENTRIES,
    ...HIDRADENITIS.timingEntries,
  ] as AnswerChoiceTimingRegistryEntry[],
  caseReviews: [
    ...VARICOSE_VEINS.caseReviews, ...PERIANAL_ABSCESS_CASE_REVIEWS,
    ...PTLD.caseReviews, ...GASTRIC_GIST_CASE_REVIEWS, ...HIDRADENITIS.caseReviews,
  ],
};

interface PairingSpec {
  ethicsQuestionId: string;
  anchor: ClinicalAnchorKey;
  sourceQuestionId: string;
  /** Only needed for older approved cases with no exported QuestionVariant. */
  sourceClaimIds?: string[];
  /** Explicit no-test declaration for older approved management-only nodes. */
  noTest?: true;
  currentUpdate: string;
  stem: string;
  explanation: string;
  /** Equivalent answer wording; original IDs and correctness stay attached. */
  choiceLabels?: [string, string, string, string];
  /** Older approved runtime nodes have no per-choice rationale fields. */
  rationales?: [string, string, string, string];
}

// Eight single-node ethics variants become two-node cases. The four Spanish
// interpreter -> consent cases are deliberately outside this replacement set.
// Diagnostic continuations also need exact game-domain order registrations;
// this content-only milestone uses management and referral decisions.
// Keys are first in this authoring list only; every runtime node shuffles.
export const ETHICS_P2E_PAIRINGS: readonly PairingSpec[] = [
  {
    ethicsQuestionId: "question.statistics-ethics.capacity-refusal.v4",
    anchor: "varicose",
    sourceQuestionId: "question.varicose-veins.intervention-referral-after-axial-reflux.v1",
    currentUpdate: "The team supports {patientName}'s own informed choice rather than replacing it because of the cognitive diagnosis. The same symptomatic varicose veins have documented axial superficial reflux without acute DVT. Specialist screening finds the patient medically eligible, and the patient remains interested in treatment after plain-language discussion. The next decision concerns the clinical referral plan.",
    stem: "Which referral plan best fits {patientName}'s symptomatic varicose veins with axial reflux, medical eligibility and an informed preference for intervention?",
    explanation: "Refer for venous intervention assessment, with the exact procedure left to specialist evaluation. The documented reflux, persistent symptoms and supported treatment preference fit the existing referral objective.",
  },
  {
    ethicsQuestionId: "question.statistics-ethics.perioperative-dnr.v4",
    anchor: "perianal-abscess",
    sourceQuestionId: "question.perianal-abscess.prompt-drainage.v1",
    currentUpdate: "The team clarifies that {patientName}'s DNR order alone does not decline abscess treatment or comfort care. The patient wants the abscess addressed. Examination shows a tender, fluctuant superficial perianal collection with stable vital signs, without Crohn disease, recurrence, immune compromise or deep pelvic symptoms. The DNR order remains in place while the team discusses the separate treatment plan.",
    stem: "Which treatment should the team arrange for {patientName}'s clinically evident, uncomplicated superficial perianal abscess when the patient wants treatment and the DNR order remains in place?",
    explanation: "Arrange prompt incision and drainage for the evident superficial perianal collection. Antibiotics, compresses or needle aspiration alone do not replace the authored drainage plan.",
    choiceLabels: [
      "Arrange incision and drainage",
      "Arrange an oral antibiotic course",
      "Arrange warm-compress treatment",
      "Arrange aspiration through a needle",
    ],
  },
  {
    ethicsQuestionId: "question.statistics-ethics.error-disclosure.v4",
    anchor: "ptld",
    sourceQuestionId: "question.ptld.tissue-diagnosis-coordination.v1",
    currentUpdate: "The team explains the confirmed wrong-chart error and its effect on {patientName}'s recommendation despite no demonstrated injury. The actual transplant record is reviewed with the patient. Persistent unexplained lymphadenopathy and completed imaging show an accessible enlarged node; PTLD is suspected but not classified. The revised discussion concerns how to obtain a reliable diagnosis with the appropriate treating teams.",
    stem: "After disclosure and review of the correct record, which diagnostic plan best fits {patientName}'s suspected PTLD with an accessible enlarged node and no tissue classification?",
    explanation: "Coordinate transplant and hematology evaluation with tissue sampling for suspected PTLD. Imaging or EBV DNA alone does not establish the required tissue classification.",
  },
  {
    ethicsQuestionId: "question.statistics-ethics.research-consent.v1",
    anchor: "gist",
    sourceQuestionId: "question.gastric-gist.mutation-guided-neoadjuvant-imatinib.v1",
    currentUpdate: "The team explains that {patientName}'s ordinary gastric-GIST care does not depend on joining the optional study. The specialist reviews completed core pathology and molecular testing showing GIST with an imatinib-sensitive mutation and no metastatic disease. The large posterior fundus mass abuts the pancreas; the multidisciplinary team expects meaningful shrinkage could avoid combined gastric and pancreatic resection.",
    stem: "Which multidisciplinary treatment plan best fits {patientName}'s imatinib-sensitive, nonmetastatic gastric GIST when tumor shrinkage could reduce the morbidity of the planned extensive resection?",
    explanation: "Plan neoadjuvant imatinib with later reassessment of resection for this mutation-sensitive GIST. The documented opportunity to reduce operative morbidity supports the plan; size alone does not.",
  },
  {
    ethicsQuestionId: "question.statistics-ethics.research-consent.v3",
    anchor: "desmoid",
    sourceQuestionId: "question.desmoid.initial-surveillance.new-diagnosis.v1",
    sourceClaimIds: ["claim.desmoid.initial-active-surveillance-selected-noncritical"],
    noTest: true,
    currentUpdate: "The team explains random allocation and uncertain benefit to {patientName}; research participation remains an optional decision. Ordinary specialist care continues for the same newly diagnosed, biopsy-confirmed abdominal-wall desmoid tumor. It is stable with minimal discomfort, no functional limitation, no obstruction and no threat to a critical structure. The next discussion concerns initial clinical management outside the optional trial.",
    stem: "Which initial clinical management plan best fits {patientName}'s newly diagnosed, stable, minimally symptomatic abdominal-wall desmoid tumor without threatened function or a critical structure?",
    explanation: "Specialist active surveillance fits this newly diagnosed, stable desmoid without critical threat or functional decline. The existing objective does not require immediate surgery or cytotoxic therapy.",
    choiceLabels: [
      "Specialist active surveillance with follow-up",
      "Immediate wide excision with margin assessment",
      "Cytotoxic chemotherapy with specialist follow-up",
      "Incision and drainage with wound follow-up",
    ],
    rationales: [
      "The newly diagnosed tumor is stable and minimally symptomatic, with no threatened function or critical structure. This is the authored surveillance population.",
      "Immediate wide excision is not required for every newly diagnosed stable desmoid. The supplied findings support specialist surveillance first.",
      "Routine upfront cytotoxic therapy is not required for the selected stable, noncritical disease described here.",
      "The biopsy-confirmed desmoid is a solid tumor, rather than a collection for incision and drainage.",
    ],
  },
  {
    ethicsQuestionId: "question.statistics-ethics.research-consent.v4",
    anchor: "hidradenitis",
    sourceQuestionId: "question.hidradenitis-suppurativa.multimodal-specialist-planning.v1",
    currentUpdate: "The team accepts {patientName}'s withdrawal from optional research without threatening unrelated ordinary appointments. Clinical follow-up continues for the same hidradenitis suppurativa. The longitudinal history and examination show recurrent painful lesions, intermittent drainage, scarring and persistent tunnels rather than one isolated abscess. The patient wants ordinary care, and the next discussion concerns the long-term clinical plan rather than study enrollment.",
    stem: "Which long-term clinical plan best fits {patientName}'s recurrent, tunnel-forming hidradenitis suppurativa after withdrawal from the optional study?",
    explanation: "Arrange multidisciplinary HS planning based on severity, site and patient goals. Repeated acute drainage alone does not provide definitive control of chronic tunnel-forming disease.",
  },
  {
    ethicsQuestionId: "question.statistics-ethics.confidentiality.v2",
    anchor: "fhh",
    sourceQuestionId: "question.fhh.parathyroid-surgery-counseling.v1",
    noTest: true,
    currentUpdate: "The curiosity-only chart access is not permitted. During {patientName}'s private clinical follow-up, the team reviews confirmed uncomplicated familial hypocalciuric hypercalcemia with stable mild hypercalcemia. No separate surgical disorder is identified. The patient asks why parathyroid surgery is not being offered for this inherited calcium-sensing condition. The clinical discussion can continue without giving the curious employee access to the record.",
    stem: "Which explanation should the team give {patientName} about parathyroid surgery for confirmed uncomplicated familial hypocalciuric hypercalcemia with stable mild hypercalcemia?",
    explanation: "Explain that parathyroidectomy usually does not correct uncomplicated FHH. The inherited calcium-sensing abnormality is not a routine single-gland surgical problem in this confirmed case.",
  },
  {
    ethicsQuestionId: "question.statistics-ethics.confidentiality.v4",
    anchor: "mondor",
    sourceQuestionId: "question.mondor-disease.management.supportive-care.v1",
    sourceClaimIds: ["claim.mondor-disease.supportive-management-and-boundaries"],
    noTest: true,
    currentUpdate: "The team shares relevant information for {patientName}'s authorized consultation while avoiding unnecessary disclosure. The specialist confirms concordant uncomplicated Mondor disease after appropriate clinical evaluation. There is no suspicious mass, infection, progressive diffuse breast change, adenopathy, recurrent or migratory thrombophlebitis, or known hypercoagulable condition. The same patient wants to discuss initial care now that relevant findings are available to the treating team.",
    stem: "Which initial care plan best fits {patientName}'s confirmed uncomplicated Mondor disease after appropriate evaluation, without infection, suspicious findings or a separate indication for anticoagulation?",
    explanation: "Offer supportive care for concordant uncomplicated Mondor disease, including warm compresses, an NSAID when appropriate and follow-up. Other treatments require a separate indication.",
    rationales: [
      "Supportive measures and follow-up fit the confirmed uncomplicated superficial thrombophlebitis after appropriate evaluation.",
      "The evaluated finding is uncomplicated Mondor disease, without an abscess or infection requiring drainage and antibiotics.",
      "Excision of the superficial vein is not routine initial treatment for concordant uncomplicated Mondor disease.",
      "Routine therapeutic anticoagulation is not standard for uncomplicated Mondor disease without a separate indication.",
    ],
  },
];

export function getP2EClinicalDonor(pairing: PairingSpec) {
  const clinicalCase = P2E_REUSED_CLINICAL_CONTENT.cases.find(item =>
    item.decisionNodes.some(node => node.questionVariantId === pairing.sourceQuestionId),
  );
  const node = clinicalCase?.decisionNodes.find(item => item.questionVariantId === pairing.sourceQuestionId);
  if (!clinicalCase || !node) throw new Error(`Missing P2-E clinical question: ${pairing.sourceQuestionId}`);
  const question = P2E_REUSED_CLINICAL_CONTENT.questions.find(item => item.id === pairing.sourceQuestionId);
  const claimIds = question?.supportingEvidenceClaimIds ?? pairing.sourceClaimIds;
  if (!claimIds?.length) throw new Error(`Missing P2-E evidence binding: ${pairing.sourceQuestionId}`);
  return { clinicalCase, node, question, claimIds };
}

export function pairEthicsWithClinicalDecisions(family: Family) {
  const pairedQuestions: PairedClinicalQuestion[] = [];
  const replacements = new Map<string, { clinicalCase: SyntheticClinicalCase; source: SyntheticClinicalCase }>();
  const claims = new Map([...family.claims, ...P2E_REUSED_CLINICAL_CONTENT.claims].map(item => [item.id, item]));
  const sources = new Map([...family.sources, ...P2E_REUSED_CLINICAL_CONTENT.sources].map(item => [item.id, item]));
  const labelsForClaims = (ids: string[]) => [...new Set(ids.flatMap(id => {
    const record = claims.get(id);
    if (!record) throw new Error(`Unresolved P2-E claim: ${id}`);
    return record.sourceIds.map(sourceId => {
      const source = sources.get(sourceId);
      if (!source) throw new Error(`Unresolved P2-E source: ${sourceId}`);
      return source.title;
    });
  }))];

  const cases = family.cases.map(original => {
    const first = original.decisionNodes[0]!;
    const pairing = ETHICS_P2E_PAIRINGS.find(item => item.ethicsQuestionId === first.questionVariantId);
    if (!pairing) return original;
    if (original.decisionNodes.length !== 1) throw new Error("P2-E must not silently replace an existing sequence.");
    const authoredEthics = family.questions.find(item => item.id === first.questionVariantId)!;
    const donor = getP2EClinicalDonor(pairing);
    const suffix = `gs028se.p2e.${first.questionVariantId.replace("question.statistics-ethics.", "")}.${pairing.anchor}`;
    const caseId = `case.${suffix}`;
    const clinicalQuestionId = `${pairing.sourceQuestionId}.p2e.${first.questionVariantId.replace("question.statistics-ethics.", "")}`;
    // Ethics claims support the corrected-forward transition in currentUpdate;
    // the clinical claims are exactly the donor's existing authored bindings.
    const claimIds = [...new Set([...donor.claimIds, ...authoredEthics.supportingEvidenceClaimIds])];
    const sourceLabels = labelsForClaims(claimIds);
    const answerChoices = donor.node.answerChoices.map((answer, index) => {
      const authored = donor.question?.answerChoices.find(item => item.id === answer.id);
      const rationale = pairing.rationales?.[index] ?? answer.rationale ?? authored?.rationale
        ?? authored?.distractorRationale ?? (answer.isCorrect ? donor.node.explanation : null);
      if (!rationale) throw new Error(`Missing P2-E rationale: ${pairing.sourceQuestionId}/${answer.id}`);
      return { ...answer, label: pairing.choiceLabels?.[index] ?? answer.label, rationale };
    });
    const clinicalNode: DecisionNode = {
      ...donor.node,
      id: `node.${suffix}.2`,
      questionVariantId: clinicalQuestionId,
      currentUpdate: pairing.currentUpdate,
      stem: pairing.stem,
      answerChoices,
      shuffleAnswers: true,
      teachingPoint: donor.node.teachingPoint ?? donor.node.explanation,
      explanation: pairing.explanation,
      sourceLabels,
      terminalDispositions: answerChoices.filter(answer => !answer.isCorrect).map(answer => ({
        answerChoiceId: answer.id,
        kind: "no_terminal_outcome",
        consequenceNarrative: "Review the teaching point and choice rationales.",
        clinicalRationale: pairing.explanation,
        sourceLabels,
      })),
    };
    const ethicsNode = {
      ...first, id: `node.${suffix}.1`,
      sourceLabels: labelsForClaims(authoredEthics.supportingEvidenceClaimIds),
      terminalDispositions: [],
    };
    const clinicalCase: SyntheticClinicalCase = {
      ...original,
      id: caseId,
      earliestFacilityStage: Math.max(original.earliestFacilityStage, donor.clinicalCase.earliestFacilityStage),
      releasePointId: donor.clinicalCase.releasePointId,
      requiredCapabilityIds: [...new Set([...original.requiredCapabilityIds, ...donor.clinicalCase.requiredCapabilityIds])],
      sourceLabels: [...new Set([...ethicsNode.sourceLabels, ...sourceLabels])],
      decisionNodes: [ethicsNode, clinicalNode],
    };
    pairedQuestions.push({
      ...NEEDS_REVIEW,
      contentVersion: P2E_CONTENT_VERSION,
      id: clinicalQuestionId,
      conceptId: clinicalNode.primaryConceptId,
      patientPresentationVariantId: clinicalCase.patientPresentationVariantId,
      patientPresentation: clinicalCase.presentation,
      approvedInstantiationProfiles: clinicalCase.approvedInstantiationProfiles ?? [],
      reachedCurrentUpdate: pairing.currentUpdate,
      stem: clinicalNode.stem,
      answerChoices: answerChoices.map(answer => ({
        id: answer.id, label: answer.label, isCorrect: answer.isCorrect,
        rationale: answer.rationale, distractorRationale: answer.isCorrect ? null : answer.rationale,
      })),
      explanation: clinicalNode.explanation,
      teachingPoint: clinicalNode.teachingPoint,
      ...(clinicalNode.exhibit ? { exhibit: clinicalNode.exhibit } : {}),
      supportingEvidenceClaimIds: claimIds,
      agentReview: P2E_AGENT_REVIEW,
    });
    replacements.set(original.id, { clinicalCase, source: donor.clinicalCase });
    return clinicalCase;
  });

  const timingEntries = family.timingEntries.map(entry => {
    const replacement = replacements.get(entry.caseId);
    return replacement ? {
      ...entry, caseId: replacement.clinicalCase.id,
      nodeId: replacement.clinicalCase.decisionNodes[0]!.id,
    } : entry;
  });
  for (const { clinicalCase, source } of replacements.values()) {
    const clinicalNode = clinicalCase.decisionNodes[1]!;
    const pairing = ETHICS_P2E_PAIRINGS.find(item => item.ethicsQuestionId === clinicalCase.decisionNodes[0]!.questionVariantId)!;
    const donorTiming = P2E_REUSED_CLINICAL_CONTENT.timingEntries.find(item =>
      item.caseId === source.id && item.questionVariantId === pairing.sourceQuestionId,
    );
    // The three older approved management cases make no testing choices.
    if (!donorTiming && !pairing.noTest) throw new Error(`Missing P2-E timing: ${pairing.sourceQuestionId}`);
    const classification = donorTiming?.classification ?? { kind: "no_test" as const };
    timingEntries.push({
      caseId: clinicalCase.id, nodeId: clinicalNode.id, questionVariantId: clinicalNode.questionVariantId,
      classification: classification.kind === "no_test" ? classification : {
        ...classification,
        choices: classification.choices.map(item => ({
          ...item, choiceLabel: clinicalNode.answerChoices.find(answer => answer.id === item.choiceId)!.label,
        })),
      },
    });
  }
  const caseReviews = family.caseReviews.map(review => {
    const replacement = replacements.get(review.caseId);
    if (!replacement) return review;
    const clinicalCase = replacement.clinicalCase;
    return {
      ...review, contentVersion: P2E_CONTENT_VERSION, caseId: clinicalCase.id, agentReview: P2E_AGENT_REVIEW,
      educationalTier: Math.max(review.educationalTier,
        P2E_REUSED_CLINICAL_CONTENT.caseReviews.find(item => item.caseId === replacement.source.id)?.educationalTier ?? 0,
      ) as 0 | 1,
      earliestFacilityStage: clinicalCase.earliestFacilityStage as 0 | 1 | 2,
      requiredCapabilityIds: clinicalCase.requiredCapabilityIds,
    };
  });
  return { ...family, cases, caseReviews, timingEntries, pairedQuestions };
}
