import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "@gamify-surgery/balance-config";
import { answerChoiceTimingRegistryEntrySchema, decisionNodeSchema, syntheticClinicalCaseSchema, testedConceptSchema } from "./schema";
import {
  BILIARY_INJURY_MALIGNANCY_TOPIC_PACKET as packet,
  BILIARY_INJURY_MALIGNANCY_TOPIC_SOURCE_LEDGER as ledger,
  BILIARY_INJURY_MALIGNANCY_TOPIC_QUESTIONS as questions,
  BILIARY_INJURY_MALIGNANCY_TOPIC_NODES as nodes,
  BILIARY_INJURY_MALIGNANCY_TOPIC_CASES as cases,
  BILIARY_INJURY_MALIGNANCY_TOPIC_TESTED_CONCEPTS as concepts,
  BILIARY_INJURY_MALIGNANCY_TOPIC_CONCEPT_PROPOSALS as proposals,
  BILIARY_INJURY_MALIGNANCY_TOPIC_TIMING_ENTRIES as timings,
  BILIARY_INJURY_MALIGNANCY_TOPIC_PASS_READY_CASES as passCases,
  BILIARY_INJURY_MALIGNANCY_TOPIC_REVISED_CASES as revisedCases,
  BILIARY_INJURY_MALIGNANCY_TOPIC_PARKED as parked,
} from "./question-topic-biliary-injury-malignancy-20261111";

const root = new URL("../../../", import.meta.url);
const read = (path: string) => readFileSync(new URL(path, root), "utf8");
const hash = (value: string) => createHash("sha256").update(value).digest("hex");

describe("biliary injury and malignancy explicit-import sidecar", () => {
  it("reconciles all primary-topic rows without counting secondary history as questions", () => {
    const program = JSON.parse(read("docs/research/question-topic-program-20261111.json")) as {
      inventory: Array<{ recordId: string; primaryTopicSlug: string }>;
    };
    const assigned = program.inventory.filter((row) => row.primaryTopicSlug === packet.topicSlug);
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(assigned).toHaveLength(39);
    expect(packet.audit.map((row) => row.inventoryRecordId).sort()).toEqual(assigned.map((row) => row.recordId).sort());
    expect(new Set(packet.audit.map((row) => row.questionVariantId)).size).toBe(39);
    expect(packet.audit.filter((row) => row.verdict === "Keep")).toHaveLength(17);
    expect(packet.audit.filter((row) => row.verdict === "Rewrite")).toHaveLength(4);
    expect(packet.audit.filter((row) => row.verdict === "Retire-and-replace")).toHaveLength(18);
    expect(packet.assignment.relatedSecondaryInventory).toHaveLength(2);
    expect(packet.assignment.recordedHolds).toEqual([]);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    for (const row of packet.audit) {
      expect(row.reasons.length).toBeGreaterThanOrEqual(2);
      expect(row.sourceFile).toMatch(/\.ts$/);
      expect(row.sourceExport.length).toBeGreaterThan(3);
      expect(row.before.question).toBeTruthy();
      expect(hash(JSON.stringify(row.before.question))).toBe(row.beforeQuestionSha256);
      expect(hash(JSON.stringify(row.before.node))).toBe(row.beforeNodeSha256);
      expect(hash(JSON.stringify(row.before.clinicalCase))).toBe(row.beforeCaseSha256);
      if (row.caseId) expect(row.before.clinicalCase).toBeTruthy();
    }
  });

  it("retains exact clinical/PASS identities and distinguishes assembly drift", () => {
    expect(packet.assignment.frozenReferences).toHaveLength(17);
    expect(packet.audit.filter((row) => row.clinicalApproval)).toHaveLength(15);
    expect(packet.audit.filter((row) => row.editorialAcceptance)).toHaveLength(2);
    for (const row of packet.audit.filter((entry) => entry.freezeReference)) expect(row.verdict).toBe("Keep");
    for (const input of packet.assignment.sourceHashes.filter((entry) => entry.programSha256 === entry.observedSha256)) {
      expect(hash(read(input.file)), input.file).toBe(input.observedSha256);
    }
    expect(packet.drift.changedInputFiles.map((entry) => entry.file).sort()).toEqual([
      "packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts",
    ]);
    expect(packet.drift.assignedLiveAtIntake).toBe(32);
    const passFiles = packet.assignment.independentReviews.filter((review) => review.file.includes("review"));
    expect(passFiles.length).toBeGreaterThanOrEqual(4);
    expect(packet.registryHistory).toHaveLength(13);
    expect(packet.registryHistory.filter((entry) => entry.registryOnly)).toHaveLength(3);
    const contexts = packet.retainedContextAudit.contexts;
    expect(contexts).toHaveLength(2);
    expect(contexts[0]!.clinicalCase).toEqual(contexts[1]!.clinicalCase);
    expect(contexts[0]!.nodeSha256).not.toBe(contexts[1]!.nodeSha256);
    for (const context of contexts) expect(hash(JSON.stringify(context.node))).toBe(context.nodeSha256);
  });

  it("provides a supported destination for every replacement and preserves reused meanings", () => {
    const destinations = new Set([...questions.map((question) => question.id), ...parked.map((item) => item.attemptedQuestionVariantId),
      ...packet.audit.filter((row) => row.verdict === "Keep").map((row) => row.questionVariantId)]);
    for (const row of packet.audit.filter((entry) => entry.verdict !== "Keep")) {
      expect(row.replacementQuestionVariantIds.length).toBeGreaterThan(0);
      for (const id of row.replacementQuestionVariantIds) expect(destinations.has(id), id).toBe(true);
    }
    expect(questions).toHaveLength(12);
    expect(new Set(questions.map((question) => question.id)).size).toBe(12);
    expect(new Set(concepts.map((concept) => concept.id)).size).toBe(12);
    expect(packet.initialAuthoringCounts.newQuestionVariants).toBe(15);
    expect(packet.counts.newQuestionVariants).toBe(8);
    expect(packet.conceptDecisions.filter((entry) => entry.conceptRelation === "existing_meaning_variant")).toHaveLength(9);
    expect(packet.conceptDecisions.filter((entry) => entry.conceptRelation === "new_meaning")).toHaveLength(3);
    for (const decision of packet.conceptDecisions) {
      const concept = concepts.find((entry) => entry.id === decision.conceptId)!;
      expect(testedConceptSchema.safeParse(concept).success).toBe(true);
      if (decision.existingTestedConcept) expect(concept).toEqual(decision.existingTestedConcept);
    }
    for (const version of packet.manifest.exactVersions) {
      expect(hash(JSON.stringify(questions.find((entry) => entry.id === version.questionVariantId)))).toBe(version.questionSha256);
      expect(hash(JSON.stringify(nodes.find((entry) => entry.id === version.nodeId)))).toBe(version.nodeSha256);
      expect(hash(JSON.stringify(cases.find((entry) => entry.id === version.caseId)))).toBe(version.caseSha256);
    }
  });

  it("materializes whole clinic cases with consistent demographics and new later evidence", () => {
    expect(cases).toHaveLength(12);
    expect(cases.every((entry) => entry.decisionNodes.length === 1)).toBe(true);
    expect(passCases).toHaveLength(4);
    expect(revisedCases).toHaveLength(8);
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.presentation).toContain("{patientName}");
      expect(clinicalCase.presentation).toContain("clinic");
      expect(clinicalCase.presentation).toContain(`${clinicalCase.prototypeDemographics!.ageYears}-year-old`);
      expect(clinicalCase.presentation).toContain(clinicalCase.prototypeDemographics!.sexLabel === "Female" ? "woman" : "man");
      expect(clinicalCase.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      for (const node of clinicalCase.decisionNodes) {
        expect(decisionNodeSchema.safeParse(node).success).toBe(true);
        const concept = concepts.find((entry) => entry.id === node.primaryConceptId)!;
        expect(clinicalCase.earliestFacilityStage).toBeGreaterThanOrEqual(concept.earliestFacilityStage);
        expect(node.shuffleAnswers).toBe(true);
        expect(node.resultGateAfter).toBeNull();
        expect(node.answerChoices).toHaveLength(3);
        expect(node.answerChoices.filter((choice) => choice.isCorrect)).toHaveLength(1);
        expect(node.answerChoices.every((choice) => choice.serviceRequest === null)).toBe(true);
      }
    }
  });

  it("keeps every new clinical artifact unapproved and records concrete author checks", () => {
    for (const record of [...questions, ...proposals, ...ledger.evidenceClaims]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.aiAssistedDrafting).toBe(true);
      expect(record.lastClinicianReview).toBeNull();
    }
    for (const item of packet.proposedNodes) {
      expect(item.reasoningSteps).toHaveLength(2);
      expect(item.closestCredibleError.length).toBeGreaterThan(20);
      expect(item.decidingObservation.length).toBeGreaterThan(20);
      expect(item.counterfactual.length).toBeGreaterThan(30);
      expect(item.deletionTest.length).toBeGreaterThan(30);
      expect(Object.keys(item.manualAuthorGate)).toHaveLength(5);
      for (const gate of Object.values(item.manualAuthorGate)) expect(gate.trim().length).toBeGreaterThan(15);
      for (const choice of item.choices.filter((entry) => !entry.isCorrect)) {
        expect(choice.temptation!.length).toBeGreaterThan(15);
        expect(choice.counterfactual!.length).toBeGreaterThan(20);
        expect(choice.rationale.length).toBeGreaterThan(30);
      }
      if (item.reviewResponseStatus === "revised") expect(item.independentReview).toBeNull();
      else expect(item.independentReview?.verdict).toBe("PASS");
    }
    expect(packet.withheldTeachingPoints).toHaveLength(5);
    for (const item of packet.withheldTeachingPoints) expect(item.key).toBeNull();
    expect(questions.some((question) => question.id.includes("symptomatic-choledochocele"))).toBe(false);
  });

  it("closes source/claim/question mappings without treating duplicate URLs as corroboration", () => {
    expect(ledger.sources).toHaveLength(9);
    expect(ledger.evidenceClaims).toHaveLength(42);
    expect(ledger.reviewRound.sourceSnapshot.sources).toHaveLength(8);
    expect(ledger.reviewRound.sourceSnapshot.evidenceClaims).toHaveLength(34);
    for (const original of ledger.reviewRound.sourceSnapshot.evidenceClaims) {
      expect(ledger.evidenceClaims.find((claim) => claim.id === original.id)).toEqual(original);
    }
    const sourceIds = new Set(ledger.sources.map((source) => source.id));
    const claimIds = new Set(ledger.evidenceClaims.map((claim) => claim.id));
    for (const question of questions) {
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of question.supportingEvidenceClaimIds) expect(claimIds.has(id), id).toBe(true);
    }
    for (const claim of ledger.evidenceClaims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const id of claim.sourceIds) {
        expect(sourceIds.has(id)).toBe(true);
        expect(ledger.sources.find((source) => source.id === id)!.evidenceClaimIds).toContain(claim.id);
      }
      expect(ledger.claimToQuestionMappings.find((entry) => entry.claimId === claim.id)!.questionVariantIds.sort())
        .toEqual(questions.filter((question) => question.supportingEvidenceClaimIds.includes(claim.id)).map((question) => question.id).sort());
    }
    for (const source of ledger.sources) {
      expect(source.completeCitation.length).toBeGreaterThan(60);
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.reuseNotes.length).toBeGreaterThan(50);
      expect(source.authorityAssessment.length).toBeGreaterThan(50);
    }
    const boundarySource = ledger.sources.find((source) => source.id.endsWith("sages-ahpba-2025"))!;
    for (const id of boundarySource.evidenceClaimIds) expect(questions.some((question) => question.supportingEvidenceClaimIds.includes(id))).toBe(false);
  });

  it("binds every testing choice and distractor to existing placeholder waits without executing orders", () => {
    expect(timings).toHaveLength(nodes.length);
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map((profile) => profile.id));
    const timed = packet.proposedNodes.flatMap((node) => node.choices.filter((choice) => choice.timingProfileId));
    expect(timed).toHaveLength(19);
    expect(packet.testOrderProposals).toHaveLength(timed.length);
    for (const entry of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const node = nodes.find((item) => item.id === entry.nodeId)!;
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map((choice) => [choice.choiceId, choice.choiceLabel]))
          .toEqual(node.answerChoices.map((choice) => [choice.id, choice.label]));
        for (const choice of entry.classification.choices) if (choice.timing.kind === "test") {
          expect(profiles.has(choice.timing.timingProfileId)).toBe(true);
          expect(packet.testOrderProposals.some((order) => order.caseId === entry.caseId && order.nodeId === entry.nodeId &&
            order.questionVariantId === entry.questionVariantId && order.choiceId === choice.choiceId && order.choiceLabel === choice.choiceLabel)).toBe(true);
        }
      }
    }
    for (const order of packet.testOrderProposals) {
      expect(order.execution).toBe("not_added");
      expect(order.classification).toBe("future_planned");
      expect(order.serviceRequest).toBeNull();
      expect(order.resultGateAfter).toBeNull();
    }
    for (const link of packet.sourceLinkProposals) {
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
  });

  it("leaves the production barrel and ship manifest outside the sidecar", () => {
    const moduleName = "question-topic-biliary-injury-malignancy-20261111";
    expect(read("packages/clinical-content/src/index.ts")).not.toContain(moduleName);
    expect(read("packages/clinical-content/src/synthetic-content.ts")).not.toContain(moduleName);
    expect(read("packages/clinical-content/src/question-ship-manifest.ts")).not.toContain(moduleName);
    expect(packet.statementClaimMappings).toHaveLength(questions.length);
    for (const file of ["docs/research/question-topic-biliary-injury-malignancy-20261111.json",
      "docs/research/sources-question-topic-biliary-injury-malignancy-20261111.json"]) expect(() => JSON.parse(read(file))).not.toThrow();
  });

  it("accounts for all review decisions and gives each returned item exactly one attempt", () => {
    const review = JSON.parse(read(packet.reviewRound.reviewFile)) as Array<{ id: string; verdict: string }>;
    expect(hash(read(packet.reviewRound.reviewFile))).toBe(packet.reviewRound.reviewFileSha256);
    expect(packet.reviewRound.reviewDecisions).toEqual(review);
    expect(packet.reviewRound.items.map((item) => item.reviewedQuestionVariantId).sort()).toEqual(review.map((item) => item.id).sort());
    expect(packet.reviewRound.items.filter((item) => item.status === "pass-preserved")).toHaveLength(4);
    expect(packet.reviewRound.items.filter((item) => item.status === "revised")).toHaveLength(8);
    expect(packet.reviewRound.items.filter((item) => item.status === "parked")).toHaveLength(7);
    for (const item of packet.reviewRound.items) {
      expect(item.revisionAttempts).toBe(item.status === "pass-preserved" ? 0 : 1);
      for (const response of Object.values(item.reviewNoteResponses)) expect(response.trim().length).toBeGreaterThan(15);
      expect(item.independentReviewStatus).toBe(item.status === "pass-preserved" ? "PASS" : "pending_not_passed");
    }
    for (const item of parked) {
      expect(item.remainingIssues.length).toBeGreaterThan(0);
      expect(item.candidate.provisionalKey).toBeNull();
      expect(item.candidate.choices.every((choice) => choice.isCorrect === null)).toBe(true);
      expect(questions.some((question) => question.id === item.attemptedQuestionVariantId)).toBe(false);
      expect(nodes.some((node) => node.id === item.candidate.nodeId)).toBe(false);
      expect(cases.some((clinicalCase) => clinicalCase.id === item.clinicalCase.id)).toBe(false);
      expect(timings.some((entry) => entry.questionVariantId === item.attemptedQuestionVariantId)).toBe(false);
      expect(packet.testOrderProposals.some((entry) => entry.questionVariantId === item.attemptedQuestionVariantId)).toBe(false);
    }
  });

  it("preserves every PASS question, raw node, header and timing tuple exactly after splitting", () => {
    for (const freeze of packet.reviewRound.passFreeze) {
      const question = questions.find((entry) => entry.id === freeze.reviewedQuestionVariantId)!;
      const rawNode = nodes.find((entry) => entry.questionVariantId === question.id)!;
      const clinicalCase = cases.find((entry) => entry.decisionNodes.some((node) => node.questionVariantId === question.id))!;
      const { decisionNodes, learningSummary: _summary, ...header } = clinicalCase;
      expect(hash(JSON.stringify(question))).toBe(freeze.questionSha256);
      expect(hash(JSON.stringify(rawNode))).toBe(freeze.nodeSha256);
      expect(hash(JSON.stringify(header))).toBe(freeze.caseHeaderSha256);
      expect(question).toEqual(freeze.question);
      expect(rawNode).toEqual(freeze.node);
      expect(decisionNodes).toHaveLength(1);
      const { terminalDispositions: closing, ...composedVisible } = decisionNodes[0]!;
      const { terminalDispositions: originalClosing, ...rawVisible } = rawNode;
      expect(composedVisible).toEqual(rawVisible);
      if (originalClosing.length) expect(closing).toEqual(originalClosing);
      else for (const disposition of closing) {
        expect(disposition.kind).toBe("no_terminal_outcome");
        const choice = rawNode.answerChoices.find((entry) => entry.id === disposition.answerChoiceId)!;
        if (disposition.kind === "no_terminal_outcome") {
          expect(disposition.consequenceNarrative).toBe(choice.rationale);
          expect(disposition.clinicalRationale).toBe(choice.rationale);
        }
      }
      expect(timings.find((entry) => entry.questionVariantId === question.id))
        .toEqual(packet.reviewRound.snapshot.timingProposals.find((entry) => entry.questionVariantId === question.id));
    }
    expect(packet.reviewRound.composition.terminalMetadataReceipts).toHaveLength(3);
    expect(new Set([...passCases, ...revisedCases].map((entry) => entry.id)).size).toBe(cases.length);
  });

  it("exports the actual missing pathology evidence before the revised question", () => {
    const question = questions.find((entry) => entry.id.endsWith(".t1a-complete-resection.v2"))!;
    const node = nodes.find((entry) => entry.questionVariantId === question.id)!;
    expect(question.exhibit?.kind).toBe("table");
    expect(node.exhibit).toEqual(question.exhibit);
    if (question.exhibit?.kind !== "table") throw new Error("Required pre-answer pathology table is absent");
    const rows = new Map(question.exhibit.rowHeaders.map((label, index) => [label, question.exhibit!.kind === "table" ? question.exhibit!.cells[index]!.join(" ") : ""]));
    expect(rows.get("Tumor and specimen")).toMatch(/entirely submitted.*malignant glands.*lamina propria/i);
    expect(rows.get("Wall under the tumor")).toMatch(/full-thickness.*include muscle.*no malignant glands/i);
    expect(rows.get("Cystic-duct margin")).toMatch(/free of carcinoma/i);
    expect(rows.get("Hepatic-bed margin")).toMatch(/free of carcinoma/i);
    expect(rows.get("Postoperative staging")).toMatch(/no residual mass or metastatic disease/i);
    const original = packet.reviewRound.snapshot.questions.find((entry) => entry.id.endsWith(".t1a-complete-resection.v1"))!;
    expect(Object.hasOwn(original, "exhibit")).toBe(false);
    expect(question.stem).toMatch(/next management/i);
  });
});
