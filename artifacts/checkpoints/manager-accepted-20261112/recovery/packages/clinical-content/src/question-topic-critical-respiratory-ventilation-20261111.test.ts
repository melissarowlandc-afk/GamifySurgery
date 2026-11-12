import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import {
  RESPIRATORY_TOPIC_AUDIT as audit,
  RESPIRATORY_TOPIC_CASES as cases,
  RESPIRATORY_TOPIC_CLAIMS as claims,
  RESPIRATORY_TOPIC_CONCEPT_PROPOSALS as concepts,
  RESPIRATORY_TOPIC_CONTEXT_HOLDS as contextHolds,
  RESPIRATORY_TOPIC_FROZEN_CASES as frozenCases,
  RESPIRATORY_TOPIC_HELD_PRESERVED as held,
  RESPIRATORY_TOPIC_NODES as nodes,
  RESPIRATORY_TOPIC_ORDER_PROPOSALS as orders,
  RESPIRATORY_TOPIC_PACKET as packet,
  RESPIRATORY_TOPIC_PARKED_ATTEMPTS as parked,
  RESPIRATORY_TOPIC_PASS_FREEZE as passFreeze,
  RESPIRATORY_TOPIC_QUESTIONS as questions,
  RESPIRATORY_TOPIC_REVIEW_METADATA as review,
  RESPIRATORY_TOPIC_REVIEW_DISPOSITIONS as dispositions,
  RESPIRATORY_TOPIC_RETAINED_CASES as retainedCases,
  RESPIRATORY_TOPIC_SALVAGE_CASES as salvageCases,
  RESPIRATORY_TOPIC_SALVAGE_ITEMS as salvageItems,
  RESPIRATORY_TOPIC_SALVAGE_NODES as salvageNodes,
  RESPIRATORY_TOPIC_SOURCES as sources,
  RESPIRATORY_TOPIC_SOURCE_LEDGER as ledger,
  RESPIRATORY_TOPIC_SOURCE_LINKS as links,
  RESPIRATORY_TOPIC_TIMING_PROPOSALS as timing,
} from "./question-topic-critical-respiratory-ventilation-20261111";
import { syntheticClinicalCaseSchema, testedConceptSchema } from "./schema";

const root = new URL("../../../", import.meta.url);
const sha256 = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const canonical = (value: unknown): unknown => Array.isArray(value) ? value.map(canonical)
  : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).sort(([a], [b]) =>
    a.localeCompare(b)).map(([key, item]) => [key, canonical(item)])) : value;

describe("respiratory topic explicit-import authoring sidecar", () => {
  it("reconciles all assigned exact variants and review dispositions", () => {
    const program = JSON.parse(readFileSync(new URL("docs/research/question-topic-program-20261111.json", root), "utf8")) as {
      inventory: Array<{ primaryTopicSlug: string; recordId: string }>;
    };
    const assigned = program.inventory.filter((item) => item.primaryTopicSlug === packet.topicSlug);
    expect(assigned).toHaveLength(20);
    expect(audit.map((item) => item.inventoryRecordId).sort()).toEqual(assigned.map((item) => item.recordId).sort());
    expect(new Set(audit.map((item) => item.inventoryRecordId)).size).toBe(20);
    expect(audit.filter((item) => item.verdict === "Rewrite")).toHaveLength(5);
    expect(audit.filter((item) => item.verdict === "Retire-and-replace")).toHaveLength(15);
    const ids = new Set(packet.reviewRound.originalProposedNodes.map((item) => item.questionVariantId));
    for (const item of audit) {
      expect(item.reasons.length).toBeGreaterThanOrEqual(3);
      expect(item.replacementQuestionVariantIds.every((id) => ids.has(id))).toBe(true);
      const before = packet.preservedBeforeDefinitions.find((old) => old.recordId === item.inventoryRecordId)!;
      expect(sha256(before.caseDefinition)).toBe(item.beforeCaseSha256);
      expect(sha256(before.nodeDefinition)).toBe(item.beforeNodeSha256);
    }
  });

  it("keeps preserved inputs exact and accounts for retained serialization wrappers", () => {
    const files = new Set(packet.assignment.inventory.map((item) => item.fileLocation.file));
    for (const item of packet.assignment.sourceHashes.filter((item) => files.has(item.file))) {
      const actual = createHash("sha256").update(readFileSync(new URL(item.file, root))).digest("hex");
      expect(actual, item.file).toBe(item.currentSha256);
    }
    expect(packet.preservedRetainedContexts).toHaveLength(25);
    for (const context of packet.preservedRetainedContexts) {
      expect(sha256(context.caseDefinition)).toBe(context.exactCaseSha256);
      expect(sha256(context.nodeDefinition)).toBe(context.exactNodeSha256);
      const before = packet.preservedBeforeDefinitions.find((old) => old.recordId === context.inventoryRecordId)!;
      expect(canonical(context.caseDefinition)).toEqual(canonical(before.caseDefinition));
    }
  });

  it("materializes clinic cases while retaining the earlier frozen contexts", () => {
    expect(cases).toHaveLength(8);
    expect(questions).toHaveLength(11);
    expect(nodes).toHaveLength(11);
    expect(cases.reduce((sum, item) => sum + item.decisionNodes.length, 0)).toBe(9);
    expect(cases.filter((item) => item.decisionNodes.length > 1)).toHaveLength(1);
    expect(new Set(nodes.map((item) => item.id)).size).toBe(11);
    expect(new Set(questions.map((item) => item.id)).size).toBe(11);
    expect(contextHolds).toHaveLength(1);
    expect(cases.some((item) => item.id === contextHolds[0]!.caseId)).toBe(false);
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(clinicalCase.tutorialEligible).toBe(false);
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.presentation).toContain(clinicalCase.patientDisplayName);
      expect(clinicalCase.presentation).toContain(`${clinicalCase.prototypeDemographics!.ageYears}-year-old`);
      expect(clinicalCase.presentation).toContain("attends clinic after hospital discharge");
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics)
        .toEqual(clinicalCase.prototypeDemographics);
      const metadata = review.caseReviews.find((item) => item.caseId === clinicalCase.id)!;
      expect(metadata.patientAcuity).toBe("stable");
      expect(metadata.educationalTier).toBe(2);
      expect(metadata.earliestFacilityStage).toBe(0);
    }
  });

  it("keeps one best key, runtime randomization and review-only rationales", () => {
    for (const node of nodes) {
      expect(node.shuffleAnswers).toBe(true);
      expect(node.answerChoices).toHaveLength(3);
      expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
      expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      expect(node.resultGateAfter).toBeNull();
      const question = questions.find((item) => item.id === node.questionVariantId)!;
      expect(question.stem).toBe(node.stem);
      expect(question.conceptId).toBe(node.primaryConceptId);
      expect(question.answerChoices.map((choice) => choice.id)).toEqual(node.answerChoices.map((choice) => choice.id));
    }
    expect(packet.reviewDisplay).toBe("key shown first for review only");
  });

  it("maps every testing choice by exact identity and label without executing orders", () => {
    expect(timing).toHaveLength(15);
    expect(orders).toHaveLength(11);
    const allowed = new Set(["timing.test.physiology", "timing.test.clinical_procedure",
      "timing.test.ultrasound", "timing.test.basic_labs"]);
    for (const item of packet.proposedNodes) {
      const entry = timing.find((entry) => entry.questionVariantId === item.questionVariantId)!;
      const tests = item.choices.filter((choice) => choice.timingProfileId);
      if (tests.length === 0) {
        expect(entry.classification.kind).toBe("no_test");
      } else {
        expect(entry.classification.kind).toBe("test_choices");
        if (entry.classification.kind !== "test_choices") throw new Error(item.questionVariantId);
        expect(entry.classification.choices.map((choice) => [choice.choiceId, choice.choiceLabel]))
          .toEqual(item.choices.map((choice) => [choice.id, choice.label]));
        for (const choice of item.choices) {
          const mapping = entry.classification.choices.find((entry) => entry.choiceId === choice.id)!;
          expect(mapping.timing).toEqual(choice.timingProfileId
            ? { kind: "test", timingProfileId: choice.timingProfileId } : { kind: "no_test" });
          if (choice.timingProfileId) expect(allowed.has(choice.timingProfileId)).toBe(true);
        }
      }
    }
    expect(orders.every((item) => item.execution === "none" && item.serviceRequest === null && item.resultGateAfter === null))
      .toBe(true);
  });

  it("closes source-to-claim-to-question mappings and safe external links", () => {
    const sourceIds = new Set(sources.map((source) => source.id));
    const claimIds = new Set(claims.map((claim) => claim.id));
    expect(sources).toHaveLength(13);
    expect(claims).toHaveLength(27);
    for (const source of sources) {
      expect(source.completeCitation).toBeTruthy();
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.reuseNotes).toBeTruthy();
      expect(source.authorityAssessment).toBeTruthy();
      expect(source.evidenceClaimIds.slice().sort()).toEqual(claims.filter((claim) => claim.sourceIds.includes(source.id))
        .map((claim) => claim.id).sort());
    }
    for (const claim of claims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      expect(claim.sourceIds.every((id) => sourceIds.has(id))).toBe(true);
      expect(claim.limitation).toBeTruthy();
      expect(claim.lastCheckedOn).toBe("2026-11-11");
    }
    for (const question of questions) {
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      expect(question.supportingEvidenceClaimIds.every((id) => claimIds.has(id))).toBe(true);
      expect(ledger.questionToClaimMappings.find((entry) => entry.questionVariantId === question.id)?.evidenceClaimIds)
        .toEqual(question.supportingEvidenceClaimIds);
    }
    for (const link of links) {
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
      expect(sourceIds.has(link.sourceId)).toBe(true);
    }
  });

  it("preserves historical meanings and keeps the excluded clinical hold out of candidate supply", () => {
    expect(concepts).toHaveLength(11);
    expect(concepts.filter((item) => item.conceptRelation === "existing_meaning_variant")).toHaveLength(1);
    expect(concepts.find((item) => item.conceptRelation === "existing_meaning_variant")!.id)
      .toBe("concept.n2.ventilator-elastic-versus-resistive-load");
    for (const concept of concepts) {
      expect(testedConceptSchema.safeParse({ id: concept.id, displayName: concept.displayName,
        learningObjective: concept.learningObjective, conceptType: concept.conceptType,
        earliestFacilityStage: concept.earliestFacilityStage }).success).toBe(true);
    }
    const pressure = held[0]!.authoringDefinition;
    expect(pressure.releaseHoldIds).toContain("review.n3.ards-weight-change-versus-tidal-volume-basis.v2");
    expect(packet.assignment.recordedHolds).toHaveLength(2);
    expect(packet.ownerApprovalsNeeded.some((item) => item.id === pressure.releaseHoldIds[0])).toBe(true);
    expect(packet.identityDecisions).toHaveLength(8);
    expect(questions.some((item) => item.id === pressure.questionVariantId)).toBe(false);
    for (const item of [...questions, ...concepts, ...claims, ...sources, ...packet.caseCompositionProposals]) {
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.lastClinicianReview).toBeNull();
    }
    expect(review.independentPass).toBe(false);
    expect(review.managerAccepted).toBe(false);
    expect(review.publicReleaseAuthorized).toBe(false);
  });

  it("pins concrete author attacks to each full visible sequence and explicit before reference", () => {
    for (const item of packet.proposedNodes) {
      expect(sha256(item.visibleContext)).toBe(item.exactVisibleContextSha256);
      for (const field of [item.manualAuthorGate.coverTheKey, item.manualAuthorGate.twoConsequentialSteps,
        item.manualAuthorGate.residentDifficulty, item.manualAuthorGate.singleBestAnswer,
        item.deletionTest, item.counterfactual, item.sequenceReview]) expect(field.length).toBeGreaterThan(45);
      expect(item.choices.every((choice) => choice.rationale && choice.temptation && choice.correctUnder)).toBe(true);
      expect(item.before.length).toBe(item.beforeRecordIds.length);
      expect(item.beforeRecordIds.length === 0).toBe(item.proposalKind === "new_gap");
      const prior = packet.proposedNodes.filter((candidate) => candidate.caseId === item.caseId);
      if (!passFreeze.some((entry) => entry.questionVariantId === item.questionVariantId)) {
        expect(item.visibleContext.priorFeedback.map((entry) => entry.questionVariantId))
          .toEqual(prior.slice(0, prior.indexOf(item)).map((entry) => entry.questionVariantId));
      }
    }
  });

  it("preserves every exact PASS question, node, timing and full visible case context", () => {
    expect(passFreeze).toHaveLength(3);
    expect(frozenCases).toHaveLength(3);
    for (const freeze of passFreeze) {
      const question = questions.find((item) => item.id === freeze.questionVariantId)!;
      const node = nodes.find((item) => item.questionVariantId === freeze.questionVariantId)!;
      const authoring = packet.proposedNodes.find((item) => item.questionVariantId === freeze.questionVariantId)!;
      expect(sha256(question)).toBe(freeze.questionSha256);
      expect(sha256(node)).toBe(freeze.nodeSha256);
      expect(sha256(authoring)).toBe(freeze.authoringDefinitionSha256);
      expect(sha256(authoring.visibleContext)).toBe(freeze.visibleContextSha256);
      expect(sha256(timing.find((item) => item.questionVariantId === freeze.questionVariantId))).toBe(freeze.timingSha256);
      expect(sha256(frozenCases.find((item) => item.id === freeze.caseDefinition.id))).toBe(freeze.caseSha256);
      const assembled = cases.find((item) => item.id === freeze.caseDefinition.id);
      if (assembled) expect(sha256(assembled)).toBe(freeze.caseSha256);
      expect(freeze.independentEditorialPass).toBe(true);
      expect(freeze.clinicalReviewStatus).toBe("needs_clinician_review");
    }
  });

  it("reconciles the independent decisions and one attempt per returned item", () => {
    const text = readFileSync(new URL(packet.reviewRound.reviewFile, root), "utf8");
    expect(createHash("sha256").update(text).digest("hex")).toBe(packet.reviewRound.reviewFileSha256);
    const decisions = JSON.parse(text) as Array<{ id: string; verdict: string }>;
    expect(decisions).toHaveLength(13);
    expect(dispositions).toHaveLength(14);
    expect(dispositions.filter((item) => item.status === "pass-preserved")).toHaveLength(3);
    expect(dispositions.filter((item) => item.status === "revised")).toHaveLength(8);
    expect(dispositions.filter((item) => item.dispositionKind === "returned_attempt_parked")).toHaveLength(2);
    for (const decision of decisions) {
      const status = dispositions.find((item) => item.originalQuestionVariantId === decision.id)!;
      expect(status).toBeTruthy();
      expect(status.attemptCount).toBe(decision.verdict === "PASS" ? 0 : 1);
      if (decision.verdict !== "PASS") {
        const response = packet.reviewRound.issueResponses.find((item) => item.originalQuestionVariantId === decision.id)!;
        expect(response.response.length).toBeGreaterThan(100);
        expect(["revised", "parked"]).toContain(response.status);
      }
    }
  });

  it("excludes parked attempts and retains their supported limitations without invented approval", () => {
    expect(parked).toHaveLength(2);
    for (const item of parked) {
      expect(item.dispositionReason.length).toBeGreaterThan(100);
      expect(questions.some((question) => question.id === item.questionVariantId)).toBe(false);
      expect(nodes.some((node) => node.questionVariantId === item.questionVariantId)).toBe(false);
      expect(timing.some((entry) => entry.questionVariantId === item.questionVariantId)).toBe(false);
      expect(item.reviewStatus).toBe("needs_clinician_review");
    }
    const unkeyed = parked.find((item) => item.key === "delivery-flow-assessment")!;
    expect(unkeyed.choices.every((choice) => !choice.isCorrect)).toBe(true);
    expect(packet.reviewRound.heldPreserved[0]!.authoringDefinition)
      .toEqual(packet.reviewRound.originalProposedNodes.find((item) => item.key === "ards-pressure-limit"));
  });

  it("salvages exactly the four skipped PASS nodes and queues only their standalone contexts", () => {
    const receipt = JSON.parse(readFileSync(new URL(
      "docs/research/question-topic-acceptance-batch1-dispositions-20261111.json", root), "utf8")) as {
      items: Array<{ topic: string; status: string; questionVariantId: string }>;
    };
    const skipped = receipt.items.filter((item) => item.topic === packet.topicSlug && item.status === "skipped");
    expect(skipped).toHaveLength(4);
    expect(salvageItems.map((item) => item.questionVariantId).sort())
      .toEqual(skipped.map((item) => item.questionVariantId).sort());
    expect(salvageCases).toHaveLength(4);
    expect(salvageNodes).toHaveLength(4);
    expect(packet.salvageRound.reviewQueue.map((item) => item.caseId))
      .toEqual(salvageCases.map((item) => item.id));
    for (const item of salvageItems) {
      expect(item.status).toBe("salvage");
      expect(item.reviewRecord.verdict).toBe("PASS");
      expect(item.originalEditorialPass).toBe(true);
      expect(item.standaloneContextReviewStatus).toBe("pending_independent_review");
      expect(item.reviewStatus).toBe("needs_clinician_review");
      expect(item.lastClinicianReview).toBeNull();
      expect(item.managerAccepted).toBe(false);
      expect(item.publicReleaseAuthorized).toBe(false);
      expect(item.visibleContext.priorFeedback).toEqual([]);
      expect(sha256(item.visibleContext)).toBe(item.exactVisibleContextSha256);
      expect(packet.salvageRound.acceptedFreeze.some((entry) => entry.questionVariantId === item.questionVariantId))
        .toBe(false);
      expect(item.contextRationale.length).toBeGreaterThan(100);
    }
  });

  it("retains exact PASS text, choices and identities in each self-contained single-node wrapper", () => {
    for (const item of salvageItems) {
      const original = packet.salvageRound.sourceSnapshots.find((entry) => entry.questionVariantId === item.questionVariantId)!;
      const clinicalCase = salvageCases.find((entry) => entry.id === item.caseId)!;
      const node = clinicalCase.decisionNodes[0]!;
      expect(clinicalCase.decisionNodes).toHaveLength(1);
      expect(item.nodeIds).toEqual([node.id]);
      expect(node.id).toBe(original.nodeId);
      expect(node.questionVariantId).toBe(original.questionVariantId);
      expect(node.primaryConceptId).toBe(original.nodeDefinition.primaryConceptId);
      // Only final-node no-outcome metadata may differ from the reviewed nonfinal node.
      expect({ ...node, terminalDispositions: [] })
        .toEqual({ ...original.nodeDefinition, terminalDispositions: [] });
      expect(sha256(questions.find((entry) => entry.id === item.questionVariantId))).toBe(original.questionSha256);
      expect(item.sourceClinicalFieldsSha256).toBe(item.salvageClinicalFieldsSha256);
      expect(sha256(clinicalCase)).toBe(item.salvageCaseSha256);
      expect(clinicalCase.patientDisplayName).toBe(original.caseDefinition.patientDisplayName);
      expect(clinicalCase.prototypeDemographics).toEqual(original.caseDefinition.prototypeDemographics);
      expect(clinicalCase.chiefComplaint).toBe(original.caseDefinition.chiefComplaint);
      expect(clinicalCase.presentation).toBe(item.changes.presentation.after);
      expect(cases.flatMap((entry) => entry.decisionNodes).filter((entry) => entry.id === node.id)).toHaveLength(1);
      expect(node.terminalDispositions.map((entry) => entry.answerChoiceId).sort())
        .toEqual(node.answerChoices.filter((entry) => !entry.isCorrect).map((entry) => entry.id).sort());
      for (const disposition of node.terminalDispositions) {
        expect(disposition.kind).toBe("no_terminal_outcome");
        if (disposition.kind !== "no_terminal_outcome") throw new Error(item.caseId);
        expect(disposition.clinicalRationale)
          .toBe(node.answerChoices.find((entry) => entry.id === disposition.answerChoiceId)!.rationale);
      }
    }
    for (const old of packet.salvageRound.retainedMixedCases) {
      expect(cases.some((entry) => entry.id === old.id)).toBe(false);
      expect(retainedCases.find((entry) => entry.id === old.id)).toEqual(old);
    }
  });

  it("preserves the accepted definitions and readonly acceptance inputs exactly", () => {
    expect(packet.salvageRound.acceptedFreeze).toHaveLength(2);
    for (const frozen of packet.salvageRound.acceptedFreeze) {
      expect(sha256(questions.find((entry) => entry.id === frozen.questionVariantId))).toBe(frozen.questionSha256);
      expect(sha256(nodes.find((entry) => entry.questionVariantId === frozen.questionVariantId))).toBe(frozen.nodeSha256);
      expect(sha256(cases.find((entry) => entry.id === frozen.caseId))).toBe(frozen.caseSha256);
    }
    for (const input of packet.salvageRound.inputHashes) {
      expect(createHash("sha256").update(readFileSync(new URL(input.file, root))).digest("hex"), input.file)
        .toBe(input.sha256);
    }
  });

  it("rebinds existing timing and evidence to the new contexts without adding clinical claims", () => {
    expect(packet.salvageRound.orderProposals).toHaveLength(4);
    expect(ledger.salvageMappings).toHaveLength(4);
    for (const item of salvageItems) {
      const original = packet.salvageRound.sourceSnapshots.find((entry) => entry.questionVariantId === item.questionVariantId)!;
      const entry = timing.find((entry) => entry.caseId === item.caseId)!;
      expect(entry).toEqual({ ...original.timingProposal, caseId: item.caseId });
      const mapping = ledger.salvageMappings.find((entry) => entry.caseId === item.caseId)!;
      expect(mapping.evidenceClaimIds).toEqual(item.evidenceClaimIds);
      expect(mapping.nodeIds).toEqual(item.nodeIds);
      expect(mapping.questionVariantId).toBe(item.questionVariantId);
      expect(mapping.newClinicalClaims).toBe(0);
      expect(mapping.sourceIds.slice().sort()).toEqual([...new Set(claims
        .filter((claim) => item.evidenceClaimIds.includes(claim.id)).flatMap((claim) => claim.sourceIds))].sort());
      if (entry.classification.kind === "test_choices") {
        const node = salvageNodes.find((node) => node.id === item.nodeIds[0])!;
        expect(entry.classification.choices.map((choice) => [choice.choiceId, choice.choiceLabel]))
          .toEqual(node.answerChoices.map((choice) => [choice.id, choice.label]));
      }
    }
  });
});
