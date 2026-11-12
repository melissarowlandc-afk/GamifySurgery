import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_PACKET as packet,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_LEDGER as ledger,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_QUESTIONS as questions,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_NODES as nodes,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_CASES as cases,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_CASE_PROPOSALS as caseProposals,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_CONCEPT_PROPOSALS as concepts,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_TESTED_CONCEPTS as testedConcepts,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_TIMING_ENTRIES as timings,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_INTEGRATION as integration,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_REVIEW_RESPONSE as response,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_ITEM_STATUSES as statuses,
  SOFT_TISSUE_SARCOMA_DESMOID_TOPIC_PARKED as parked,
} from "./question-topic-soft-tissue-sarcoma-desmoid-20261111";
import { syntheticClinicalCaseSchema, testedConceptSchema } from "./schema";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const hash = (value: unknown) => createHash("sha256")
  .update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
const slug = "soft-tissue-sarcoma-desmoid";
const activeItems = packet.proposedNodes.filter((item) =>
  !statuses.some((status) => status.id === item.id && status.status === "parked"));

describe("soft-tissue sarcoma/desmoid independent-review response", () => {
  it("keeps the complete original inventory and historical before records", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json"));
    const assigned = program.inventory.filter((row: { primaryTopicSlug: string }) => row.primaryTopicSlug === slug);
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(packet.audit.map((row) => row.inventoryRecordId).sort()).toEqual(
      assigned.map((row: { recordId: string }) => row.recordId).sort());
    expect(new Set(packet.audit.map((row) => row.inventoryRecordId)).size).toBe(37);
    expect(packet.beforeSnapshots).toHaveLength(37);
    for (const before of packet.beforeSnapshots) {
      for (const context of before.contexts) {
        expect(hash(context.node)).toBe(context.nodeSha256);
        expect(hash({ caseHeader: context.caseHeader, node: context.node,
          visibleHistory: context.visibleHistory, laterNodes: context.laterNodes })).toBe(context.sha256);
      }
      for (const authored of before.questions) expect(hash(authored.question)).toBe(authored.sha256);
    }
  });

  it("binds this response to the exact supplied review and accounts for every item", () => {
    expect(hash(read(response.sourceReviewFile))).toBe(response.sourceReviewSha256);
    expect(response.sourceReview).toHaveLength(18);
    expect(response.counts).toMatchObject({
      reviewed: 18, passPreserved: 5, returned: 13, revised: 10, parked: 3,
      activeNodes: 15, activeCases: 15, activeMultiPartCases: 0, newIndependentPasses: 0,
    });
    expect(statuses.filter((item) => item.status === "pass-preserved")).toHaveLength(5);
    expect(statuses.filter((item) => item.status === "revised")).toHaveLength(10);
    expect(statuses.filter((item) => item.status === "parked")).toHaveLength(3);
    expect(statuses.map((item) => item.id).sort()).toEqual(response.sourceReview.map((item) => item.id).sort());
    expect(statuses.every((item) => item.revisionAttempts === (item.status === "pass-preserved" ? 0 : 1))).toBe(true);
  });

  it("preserves every PASS question, full node, concept and visible header byte-for-byte", () => {
    expect(response.passFreeze).toHaveLength(5);
    for (const frozen of response.passFreeze) {
      const question = questions.find((item) => item.id === frozen.reviewedQuestionVariantId)!;
      const node = nodes.find((item) => item.id === frozen.nodeId)!;
      const clinicalCase = cases.find((item) => item.id === frozen.caseId)!;
      const concept = concepts.find((item) => item.id === frozen.conceptId)!;
      const { decisionNodes, learningSummary, sourceLabels, ...header } = clinicalCase;
      expect(hash(question)).toBe(frozen.sha256.question);
      expect(hash(node)).toBe(frozen.sha256.node);
      expect(hash(header)).toBe(frozen.sha256.caseHeader);
      expect(concept).toEqual(frozen.concept);
      expect(hash(packet.proposedNodes.find((item) => item.id === frozen.reviewId)!))
        .toBe(frozen.sha256.authorItem);
      expect(question.contentVersion).toBe("question-topic.soft-tissue-sarcoma-desmoid.2026-11-11.v1");
      expect(decisionNodes).toHaveLength(1);
      expect(learningSummary).toBe(node.explanation);
      expect(sourceLabels).toEqual(frozen.caseSourceLabels);
    }
  });

  it("retains exact original clinical/PASS inputs and blocks retirement with parked replacements", () => {
    expect(packet.frozenPreservation).toHaveLength(13);
    for (const frozen of packet.frozenPreservation) expect(hash(read(frozen.sourceFile))).toBe(frozen.sourceSha256);
    expect(packet.assignment.clinicalApproval.approvedQuestionVariantIds).toHaveLength(8);
    const allowed = new Set([...questions.map((question) => question.id),
      ...packet.audit.filter((row) => row.verdict === "Keep").flatMap((row) => row.variantIds)]);
    for (const row of packet.audit) {
      expect(["Keep", "Rewrite", "Retire-and-replace"]).toContain(row.verdict);
      expect(row.reasons.join(" ").length).toBeGreaterThan(80);
      for (const id of row.replacementQuestionVariantIds) expect(allowed.has(id)).toBe(true);
      if (row.verdict !== "Keep" && row.replacementQuestionVariantIds.length === 0)
        expect(row.currentImplementationStatus).toBe("replacement_parked_do_not_apply");
    }
    expect(response.auditEffects.some((effect) => effect.resolution.includes("Keep the historical"))).toBe(true);
  });

  it("removes every parked attempt from active questions, cases, timing and orders", () => {
    expect(parked.map((item) => item.id).sort()).toEqual([
      "desmoid-operative-extent", "mri-acquisition-comparison", "rt-sequence",
    ]);
    for (const item of parked) {
      expect(item.reason.length).toBeGreaterThan(120);
      expect(item.attempt.revisionAttempt).toBe(1);
      expect(questions.some((question) => question.id === item.questionVariantId)).toBe(false);
      expect(nodes.some((node) => node.id === item.nodeId)).toBe(false);
      expect(cases.some((clinicalCase) => clinicalCase.decisionNodes.some((node) => node.id === item.nodeId))).toBe(false);
      expect(timings.some((timing) => timing.questionVariantId === item.questionVariantId)).toBe(false);
      expect(packet.testOrderProposals.some((order) => order.questionVariantId === item.questionVariantId)).toBe(false);
    }
    expect(response.snapshot.questions).toHaveLength(18);
    expect(ledger.parkedQuestionClaimMappings).toHaveLength(3);
  });

  it("exports self-contained cases without mixed reviewed/returned multipart companions", () => {
    expect(cases).toHaveLength(15);
    expect(nodes).toHaveLength(15);
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.decisionNodes).toHaveLength(1);
    }
    expect(cases.find((item) => item.id.includes("calf-planning"))!.decisionNodes[0]!.questionVariantId)
      .toBe(response.passFreeze.find((item) => item.reviewId === "calf-core-tract")!.reviewedQuestionVariantId);
    for (const candidate of response.compositionCandidates) {
      expect(candidate.execution).toBe("not_exported");
      expect(candidate.admissionRequirement).toContain("independently PASS");
    }
  });

  it("keeps all active clinical metadata unapproved without granting a new PASS", () => {
    for (const item of [...questions, ...concepts, ...caseProposals, ...ledger.evidenceClaims]) {
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.lastClinicianReview).toBeNull();
      expect(item.aiAssistedDrafting).toBe(true);
    }
    expect(integration.managerAcceptance).toBeNull();
    expect(integration.independentReview).toContain("awaiting_re_review");
    for (const item of statuses.filter((item) => item.status !== "pass-preserved"))
      expect(item.independentStatus).toBe("awaiting_independent_re_review");
  });

  it("versions changed meanings explicitly and retains stable meanings where appropriate", () => {
    const changed = packet.conceptDecisions.filter((decision) => decision.previousConceptId !== null);
    expect(changed).toHaveLength(4);
    for (const decision of changed) {
      expect(decision.conceptId).toMatch(/\.v2$/);
      expect(response.snapshot.conceptDecisions.some((prior) => prior.conceptId === decision.previousConceptId)).toBe(true);
      expect(decision.decision.length).toBeGreaterThan(60);
    }
    for (const existing of packet.reusedConceptDefinitions) {
      const actual = testedConcepts.find((item) => item.id === existing.id);
      if (actual) expect(testedConceptSchema.parse(actual)).toEqual(testedConceptSchema.parse(existing));
    }
    expect(packet.registryCoverage.find((item) => item.conceptId === "concept.soft-tissue-mass.extremity-mri.v3")!.registryOnly).toBe(true);
  });

  it("keeps complete patient frames and consistent finite profiles after case splitting", () => {
    for (const clinicalCase of cases) {
      expect(clinicalCase.patientDisplayName).not.toBe("Clinic Patient");
      expect(clinicalCase.chiefComplaint!.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain(String(clinicalCase.prototypeDemographics!.ageYears) + "-year-old");
      expect(clinicalCase.presentation).toMatch(
        clinicalCase.prototypeDemographics!.sexLabel === "Female" ? /\bwoman\b/ : /\bman\b/);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
    }
  });

  it("has randomized choices, one key and feedback for every active alternative", () => {
    for (const node of nodes) {
      expect(node.shuffleAnswers).toBe(true);
      expect([3, 4]).toContain(node.answerChoices.length);
      expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(new Set(node.answerChoices.map((choice) => choice.id)).size).toBe(node.answerChoices.length);
      expect(node.resultGateAfter).toBeNull();
      for (const choice of node.answerChoices) {
        expect(choice.rationale!.length).toBeGreaterThan(30);
        expect(choice.serviceRequest).toBeNull();
      }
    }
  });

  it("records a concrete single revision and response to every review-note category", () => {
    for (const returned of response.sourceReview.filter((item) => item.verdict !== "PASS")) {
      const item = packet.proposedNodes.find((node) => node.id === returned.id)!;
      expect(item.revisionAttempt).toBe(1);
      expect(item.questionVariantId).toMatch(/\.v2$/);
      expect(item.beforeReviewVersion!.questionVariantId).toMatch(/\.v1$/);
      expect(item.reviewResponse!.clarityIssues).toHaveLength(returned.clarityIssues.length);
      expect(item.reviewResponse!.cues).toHaveLength(returned.cues.length);
      expect(item.reviewResponse!.fairness).toHaveLength(returned.fairness.length);
      expect(item.reviewResponse!.suggestions).toHaveLength(returned.suggestions.length);
      expect(item.reasoningSteps).toHaveLength(2);
      expect(Object.keys(item.authorGate)).toHaveLength(5);
      expect(item.decidingObservation.length).toBeGreaterThan(25);
      expect(item.counterfactual.length).toBeGreaterThan(50);
      expect(item.deletionTest.length).toBeGreaterThan(100);
      for (const check of Object.values(item.authorGate))
        expect(typeof check === "string" && check.length > 60).toBe(true);
    }
  });

  it("binds every active testing option by exact choice identity and label", () => {
    const profiles = new Set([...read("packages/balance-config/src/prototype-balance.ts")
      .matchAll(/id: "(timing\.test\.[^"]+)"/g)].map((match) => match[1]));
    expect(timings).toHaveLength(15);
    for (const item of activeItems) {
      const entry = timings.find((timing) => timing.questionVariantId === item.questionVariantId)!;
      expect(entry.caseId).toBe(item.caseId);
      expect(entry.nodeId).toBe(item.nodeId);
      if (entry.classification.kind === "test_choices") {
        for (const choice of [...item.choices].reverse()) {
          const mapped = entry.classification.choices.find((timing) => timing.choiceId === choice.id)!;
          expect(mapped.choiceLabel).toBe(choice.label);
          if (choice.timingProfileId) {
            expect(mapped.timing).toEqual({ kind: "test", timingProfileId: choice.timingProfileId });
            expect(profiles.has(choice.timingProfileId)).toBe(true);
          } else expect(mapped.timing).toEqual({ kind: "no_test" });
        }
      } else expect(item.choices.every((choice) => choice.timingProfileId === null)).toBe(true);
    }
    expect(packet.testOrderProposals).toHaveLength(20);
    expect(packet.testOrderProposals.every((order) =>
      order.execution === "future_planned" && order.serviceRequest === null && order.resultGateAfter === null)).toBe(true);
  });

  it("maps complete rights-reviewed evidence and all active/parked question claims", () => {
    const claimIds = new Set(ledger.evidenceClaims.map((claim) => claim.id));
    const sourceIds = new Set(ledger.sources.map((source) => source.id));
    expect(claimIds.size).toBe(ledger.evidenceClaims.length);
    expect(sourceIds.size).toBe(ledger.sources.length);
    for (const source of ledger.sources) {
      expect(source.completeCitation).toBeTruthy();
      expect(source.organizationOrJournal).toBeTruthy();
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl || source.doi).toBeTruthy();
      expect(source.licenseLabel).toBeTruthy();
      expect(source.authorityAssessment).toBeTruthy();
      expect([...source.evidenceClaimIds].sort()).toEqual(
        ledger.evidenceClaims.filter((claim) => claim.sourceIds.includes(source.id)).map((claim) => claim.id).sort());
    }
    for (const claim of ledger.evidenceClaims) {
      expect(claim.limitation).toBeTruthy();
      expect(claim.lastCheckedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const id of claim.sourceIds) expect(sourceIds.has(id)).toBe(true);
    }
    expect(ledger.questionClaimMappings.map((mapping) => mapping.questionVariantId).sort())
      .toEqual(questions.map((question) => question.id).sort());
    for (const question of questions)
      for (const id of question.supportingEvidenceClaimIds) expect(claimIds.has(id)).toBe(true);
    expect(ledger.claimQuestionMappings).toHaveLength(ledger.evidenceClaims.length);
    for (const mapping of ledger.questionClaimMappings) {
      const question = questions.find((item) => item.id === mapping.questionVariantId)!;
      expect(mapping.claimIds).toEqual(question.supportingEvidenceClaimIds);
      expect(mapping.fieldMappings).toHaveLength(question.answerChoices.length + 3);
    }
  });

  it("preserves original verification dates and safe reference metadata", () => {
    expect(ledger.evidenceClaims.find((item) => item.id === "claim.qq20261102b.sarcoma-method-and-tract")!.lastCheckedOn).toBe("2026-11-02");
    expect(ledger.evidenceClaims.find((item) => item.id === "claim.qq20261102f.mri-comparable-contrast-acquisition")!.lastCheckedOn).toBe("2026-11-03");
    expect(ledger.sources.find((item) => item.id === "source.qq20261102f.essr2023")!.accessedOn).toBe("2026-11-02");
    for (const link of packet.sourceLinkProposals)
      expect(link).toMatchObject({ target: "_blank", rel: "noopener noreferrer", referrerPolicy: "no-referrer" });
  });

  it("keeps clinical counterfactual boundaries and balanced systemic alternatives explicit", () => {
    const lung = packet.proposedNodes.find((item) => item.id === "thoracic-staging")!;
    expect(lung.currentUpdate).toContain("no FDG-avid");
    expect(lung.explanation).toContain("indeterminate");
    const systemic = packet.proposedNodes.find((item) => item.id === "advanced-systemic-intensity")!;
    expect(systemic.choices.map((choice) => choice.label)).toEqual([
      "Doxorubicin plus ifosfamide", "Doxorubicin", "Pazopanib", "Gemcitabine plus docetaxel",
    ]);
    expect(systemic.choices[0]!.isCorrect).toBe(true);
    expect(systemic.counterfactual).toContain("complete obstruction");
    expect(packet.assignment.relatedCaseAssignments.find((item) => item.crossTopic)!.primaryTopicSlug).toBe("ethics-professionalism");
  });

  it("parses the owned artifacts and keeps the sidecar free of registry mutations", () => {
    for (const path of ["docs/research/question-topic-" + slug + "-20261111.json",
      "docs/research/sources-question-topic-" + slug + "-20261111.json"])
      expect(JSON.parse(read(path)).topicSlug).toBe(slug);
    const module = read("packages/clinical-content/src/question-topic-" + slug + "-20261111.ts");
    expect(module).not.toMatch(/from ["']\.\/index["']/);
    expect(module).not.toMatch(/fetch\(|\.push\(.*(?:REGISTRY|MANIFEST)/);
    expect(packet.manifest.sharedManifestEdited).toBe(false);
  });
});
