import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingProfileMapping } from "../../balance-config/src/diagnostic-timing";
import { THORACIC_FAMILIES } from "./development-batch/2026-10-03-coverage-gaps/thoracic";
import { QUESTION_NEW_N3_CASES, QUESTION_NEW_N3_QUESTIONS } from "./question-new-n3-20261105";
import { syntheticClinicalCaseSchema } from "./schema";
import {
  THORACIC_TOPIC_CASES as cases,
  THORACIC_TOPIC_CASE_REVIEWS as caseReviews,
  THORACIC_TOPIC_CLAIMS as claims,
  THORACIC_TOPIC_CONCEPT_PROPOSALS as concepts,
  THORACIC_TOPIC_ITEMS as items,
  THORACIC_TOPIC_NODES as nodes,
  THORACIC_TOPIC_PACKET as packet,
  THORACIC_TOPIC_QUESTIONS as questions,
  THORACIC_TOPIC_RETAINED_QUESTIONS as retainedQuestions,
  THORACIC_TOPIC_RETAINED_CASES as retainedCases,
  THORACIC_TOPIC_PARKED_ATTEMPTS as parked,
  THORACIC_TOPIC_REVIEW_METADATA as review,
  THORACIC_TOPIC_SELF_CHECKS as checks,
  THORACIC_TOPIC_SOURCES as sources,
  THORACIC_TOPIC_SOURCE_LINKS as links,
  THORACIC_TOPIC_STATEMENT_MAPPINGS as mappings,
  THORACIC_TOPIC_TEST_ORDER_PROPOSALS as orders,
  THORACIC_TOPIC_TIMING_PROPOSALS as timing,
} from "./question-topic-thoracic-lung-pleura-mediastinum-20261111";

const rootFile = (path: string) => readFileSync(new URL(`../../../${path}`, import.meta.url), "utf8");
const hash = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

describe("thoracic topic wave 9 explicit-import authoring sidecar", () => {
  it("reconciles every primary-topic inventory record and exact variant once", () => {
    const program = JSON.parse(rootFile("docs/research/question-topic-program-20261111.json")) as {
      inventory: Array<{ recordId: string; primaryTopicSlug: string }>;
    };
    const assigned = program.inventory.filter(row => row.primaryTopicSlug === packet.topicSlug);
    expect(packet.assignment.inventory).toHaveLength(17);
    expect(packet.audit.map(row => row.recordId).sort()).toEqual(assigned.map(row => row.recordId).sort());
    expect(new Set(packet.audit.map(row => row.recordId)).size).toBe(17);
    expect(new Set(packet.audit.flatMap(row => row.variantIds)).size).toBe(17);
    expect(packet.audit.filter(row => row.verdict === "Keep")).toHaveLength(5);
    expect(packet.audit.filter(row => row.verdict === "Rewrite")).toHaveLength(3);
    expect(packet.audit.filter(row => row.verdict === "Retire-and-replace")).toHaveLength(9);
    expect(packet.reviewRound.archive.audit.filter(row => row.verdict === "Keep")).toHaveLength(1);
    for (const row of packet.audit) {
      expect(row.reasons.join(" ").length).toBeGreaterThan(80);
      expect(row.beforeCaseSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(row.beforeQuestionSha256).toMatch(/^[a-f0-9]{64}$/);
    }
  });

  it("preserves all six exact independent PASS versions and their visible clinical context", () => {
    const exactHashes: Record<string, string> = {
      "pleural-drainage": "45f840d5cba816e0b9a8f669b26f7abe44e3b213b094e883fec39ba89a0642bb",
      "mpe-assess-response": "a471d6b3fc98d8af8d95b90d6ce3f0a4d64acc9d936e34476e48f400cc444325",
      "ipc-infection-response": "3fcd7f4d845c671fba125e0d954e33b556c797aa1fd5e88df5768daf812f50c2",
      "pleural-dissemination-plan": "14f6de4cf2216bb9f9a76ef21a86bcea22c34bfdf47a254da600205f4737831a",
      "mediastinal-mri": "252f40fb7320182464ef4ec794dea976fd6235362d975749eb97620b2e634d7d",
      "invasive-mediastinal-core": "bca7a91e2ff1850ea579e649f06db68e219792e08541dacdde5260e8cb24fade",
    };
    expect(createHash("sha256").update(rootFile(packet.reviewRound.reviewFile)).digest("hex"))
      .toBe("8ea0f57be73984cacb8f083ceaa55991775706aa70a2c6c96a7209b05d91c5ae");
    expect(packet.reviewRound.passFreeze).toHaveLength(6);
    for (const frozen of packet.reviewRound.passFreeze) {
      const question = questions.find(question => question.id === frozen.questionVariantId)!;
      expect(hash(question)).toBe(exactHashes[frozen.rawItem.slug]);
      expect(question).toEqual(frozen.questionDefinition);
      const clinicalCase = cases.find(clinicalCase => clinicalCase.decisionNodes.some(node => node.id === frozen.nodeId))!;
      const node = clinicalCase.decisionNodes.find(node => node.id === frozen.nodeId)!;
      const { terminalDispositions, ...clinicalPayload } = node;
      expect(hash(clinicalPayload)).toBe(frozen.clinicalPayloadSha256);
      expect(clinicalCase.patientPresentationVariantId).toBe(frozen.caseDefinition.patientPresentationVariantId);
      expect(clinicalCase.presentation).toBe(frozen.caseDefinition.presentation);
      expect(clinicalCase.chiefComplaint).toBe(frozen.caseDefinition.chiefComplaint);
      expect(clinicalCase.patientDisplayName).toBe(frozen.caseDefinition.patientDisplayName);
      expect(clinicalCase.prototypeDemographics).toEqual(frozen.caseDefinition.prototypeDemographics);
      expect(clinicalCase.approvedInstantiationProfiles).toEqual(frozen.caseDefinition.approvedInstantiationProfiles);
      if (frozen.nodeDefinition.terminalDispositions.length > 0 || terminalDispositions.length === 0) {
        expect(hash(node)).toBe(frozen.nodeSha256);
      } else {
        const adapter = packet.reviewRound.passCaseProposals.flatMap(row => row.terminalAdapters).find(row => row.nodeId === node.id);
        expect(adapter?.changedField).toBe("terminalDispositions");
        for (const disposition of terminalDispositions) {
          expect(disposition.kind).toBe("no_terminal_outcome");
          if (disposition.kind === "no_terminal_outcome") {
            expect(disposition.clinicalRationale).toBe(node.answerChoices.find(choice => choice.id === disposition.answerChoiceId)!.rationale);
          }
        }
      }
    }
    expect(retainedQuestions).toEqual(packet.reviewRound.archive.questionDefinitions);
    expect(retainedCases).toEqual(packet.reviewRound.archive.caseDefinitions);
  });

  it("accounts for every returned item once and emits no parked or mixed-review case", () => {
    const dispositions = packet.reviewRound.dispositions;
    expect(dispositions).toHaveLength(18);
    expect(new Set(dispositions.map(row => row.beforeQuestionVariantId)).size).toBe(18);
    expect(dispositions.filter(row => row.status === "pass-preserved")).toHaveLength(6);
    expect(dispositions.filter(row => row.status === "revised")).toHaveLength(11);
    expect(dispositions.filter(row => row.status === "parked")).toHaveLength(1);
    expect(parked).toHaveLength(1);
    for (const row of dispositions) {
      expect(row.revisionAttempts).toBe(row.status === "pass-preserved" ? 0 : 1);
      expect(row.clinicalReviewStatus).toBe("needs_clinician_review");
      expect(row.issueResponses.length).toBeGreaterThan(0);
      if (row.status === "revised") {
        expect(row.afterQuestionVariantId).toMatch(/\.v2$/);
        expect(questions.some(question => question.id === row.beforeQuestionVariantId)).toBe(false);
        expect(row.newIndependentReviewStatus).toBe("pending_independent_review");
      }
    }
    for (const attempt of parked) {
      expect(attempt.emitted).toBe(false);
      expect(attempt.keyAccepted).toBe(false);
      expect(attempt.parkReason.length).toBeGreaterThan(100);
      expect(questions.some(question => question.id === attempt.questionVariantId)).toBe(false);
      expect(items.some(item => item.slug === attempt.slug)).toBe(false);
    }
    for (const clinicalCase of cases.filter(clinicalCase => clinicalCase.decisionNodes.length > 1)) {
      for (const node of clinicalCase.decisionNodes) {
        expect(dispositions.find(row => row.afterQuestionVariantId === node.questionVariantId)!.status).toBe("pass-preserved");
      }
    }
  });

  it("preserves every assigned old case, node, question and finite profile", () => {
    const oldCases = [...THORACIC_FAMILIES.flatMap(family => family.cases), ...QUESTION_NEW_N3_CASES];
    const oldQuestions = [...THORACIC_FAMILIES.flatMap(family => family.questions), ...QUESTION_NEW_N3_QUESTIONS];
    for (const before of packet.beforeSnapshots) {
      const current = oldCases.find(clinicalCase => clinicalCase.id === before.caseDefinition.id)!;
      expect(current, before.recordId).toEqual(before.caseDefinition);
      expect(hash(current), before.recordId).toBe(before.caseSha256);
      const row = packet.assignment.inventory.find(record => record.recordId === before.recordId)!;
      expect(hash(current.decisionNodes.find(node => row.nodeIds.includes(node.id)))).toBe(before.nodeSha256);
      const question = oldQuestions.find(question => row.variantIds.includes(question.id));
      expect(hash(question), row.variantIds[0]).toBe(before.questionSha256);
      expect(current.approvedInstantiationProfiles).toEqual(before.caseDefinition.approvedInstantiationProfiles);
    }
  });

  it("keeps the disputed frozen PASS and owner-held contaminated-pH idea distinct", () => {
    const heldId = "question.n3.pleural-source-versus-systemic-response.v1";
    const held = packet.audit.find(row => row.variantIds.includes(heldId))!;
    expect(held.verdict).toBe("Keep");
    expect(held.status).toBe("held for owner");
    expect(packet.assignment.frozenReferences.some(row => "verdict" in row.record && row.record.verdict === "PASS")).toBe(true);
    expect(packet.assignment.frozenReferences.some(row => "verdict" in row.record && row.record.verdict === "REVISE")).toBe(true);
    expect(packet.heldAndUnkeyedLedger.carriedUnkeyedClinicalIdea.key).toBeNull();
    expect(packet.heldAndUnkeyedLedger.carriedUnkeyedClinicalIdea.newScoredQuestionId).toBeNull();
    expect(questions.some(question => question.id === heldId)).toBe(false);
    expect(packet.ownerApprovalsNeeded[0]!.candidateEmitted).toBe(false);
  });

  it("parses complete existing-clinic cases with unique randomized scored identities", () => {
    expect(cases).toHaveLength(16);
    expect(nodes).toHaveLength(17);
    expect(questions).toHaveLength(17);
    expect(cases.filter(clinicalCase => clinicalCase.decisionNodes.length > 1)).toHaveLength(1);
    expect(new Set(nodes.map(node => node.id)).size).toBe(17);
    expect(new Set(questions.map(question => question.id)).size).toBe(17);
    for (const clinicalCase of cases) {
      expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
      expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
      expect(clinicalCase.requiredCapabilityIds).toEqual([]);
      expect(clinicalCase.earliestFacilityStage).toBe(0);
      expect(clinicalCase.tutorialEligible).toBe(false);
      for (const node of clinicalCase.decisionNodes) {
        expect(node.answerChoices.length).toBeGreaterThanOrEqual(3);
        expect(node.answerChoices.filter(choice => choice.isCorrect)).toHaveLength(1);
        expect(node.shuffleAnswers).toBe(true);
        expect(node.resultGateAfter).toBeNull();
        expect(node.answerChoices.every(choice => choice.serviceRequest === null)).toBe(true);
      }
      expect(clinicalCase.decisionNodes.slice(0, -1).every(node => node.terminalDispositions.length === 0)).toBe(true);
      const final = clinicalCase.decisionNodes.at(-1)!;
      expect(final.terminalDispositions).toHaveLength(final.answerChoices.filter(choice => !choice.isCorrect).length);
    }
  });

  it("uses consistent named review patients and frozen runtime name tokens", () => {
    for (const proposal of packet.proposedCases) {
      const clinicalCase = cases.find(clinicalCase => clinicalCase.id === proposal.id)!;
      expect(clinicalCase.patientDisplayName).toBe(proposal.name);
      expect(clinicalCase.prototypeDemographics).toEqual({ ageYears: proposal.age, sexLabel: proposal.sex });
      expect(proposal.chiefComplaint.trim().split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(clinicalCase.approvedInstantiationProfiles).toHaveLength(1);
      expect(clinicalCase.presentation).toContain("{patientName}");
      for (const node of clinicalCase.decisionNodes) {
        expect(node.stem).toContain("{patientName}");
        expect(node.stem).not.toContain(proposal.name);
        const authored = items.find(item => item.id === node.id)!;
        expect(node.stem.replaceAll("{patientName}", proposal.name)).toBe(authored.stem);
      }
    }
  });

  it("retains stable meanings and versions the two materially expanded objectives", () => {
    expect(concepts).toHaveLength(17);
    expect(new Set(concepts.map(concept => concept.id)).size).toBe(17);
    const reused = items.filter(item => item.conceptRelation === "stable_meaning_new_question_version");
    expect(reused.map(item => item.conceptId).sort()).toEqual(packet.identityPolicy.reusedConceptIds);
    expect(items.filter(item => item.authorship === "new")).toHaveLength(14);
    for (const item of reused) {
      expect(item.beforeRecordIds).toHaveLength(1);
      const original = packet.assignment.inventory.find(row => row.recordId === item.beforeRecordIds[0])!;
      expect(item.conceptId).toBe(original.conceptId);
      expect(item.replacesVariantIds).toEqual(original.variantIds);
    }
    const versions = items.filter(item => item.previousConceptId !== null);
    expect(versions).toHaveLength(2);
    for (const item of versions) {
      expect(item.conceptId).not.toBe(item.previousConceptId);
      expect(item.conceptId).toMatch(/\.v2$/);
      expect(packet.reviewRound.archive.conceptDefinitions.some(concept => concept.id === item.previousConceptId)).toBe(true);
      expect(item.conceptRelation).toBe("material_meaning_change_new_concept_version");
    }
    expect(packet.identityPolicy.historyMigration).toBe(false);
    expect(packet.identityPolicy.materialMeaningChangesReboundToOldConcepts).toBe(false);
  });

  it("binds every testing choice and distractor to its exact label and an existing profile", () => {
    expect(timing).toHaveLength(17);
    let testChoices = 0;
    for (const clinicalCase of cases) for (const node of clinicalCase.decisionNodes) {
      const entry = timing.filter(entry => entry.caseId === clinicalCase.id && entry.nodeId === node.id && entry.questionVariantId === node.questionVariantId);
      expect(entry).toHaveLength(1);
      const classification = entry[0]!.classification;
      const authored = items.find(item => item.id === node.id)!;
      if (classification.kind === "test_choices") {
        expect(classification.choices.map(choice => [choice.choiceId, choice.choiceLabel])).toEqual(node.answerChoices.map(choice => [choice.id, choice.label]));
        for (const choice of classification.choices) {
          const original = authored.choices.find(row => row.id === choice.choiceId)!;
          if (original.timingProfileId) {
            testChoices++;
            expect(choice.timing).toEqual({ kind: "test", timingProfileId: original.timingProfileId });
            expect(getDiagnosticTimingProfileMapping(original.timingProfileId)).toBeDefined();
            expect(orders.filter(order => order.caseId === clinicalCase.id && order.nodeId === node.id && order.answerChoiceId === choice.choiceId && order.answerChoiceLabel === choice.choiceLabel)).toHaveLength(1);
          } else expect(choice.timing).toEqual({ kind: "no_test" });
        }
      } else expect(authored.choices.every(choice => choice.timingProfileId === null)).toBe(true);
    }
    expect(testChoices).toBe(43);
    expect(orders).toHaveLength(testChoices);
    for (const order of orders) {
      expect(order.execution).toBe("future_planned");
      expect(order.gameplayExecutesOrder).toBe(false);
      expect(order.serviceRequest).toBeNull();
      expect(order.resultGateAfter).toBeNull();
    }
  });

  it("resolves atomic source/claim/question links and separately labels constructed observations", () => {
    const ledger = JSON.parse(rootFile(packet.sourceLedger)) as {
      sourceToClaim: Array<{ sourceId: string; evidenceClaimIds: string[] }>;
      claimToQuestion: Array<{ claimId: string; questionVariantIds: string[] }>;
    };
    expect(new Set(sources.map(source => source.id)).size).toBe(sources.length);
    expect(new Set(claims.map(claim => claim.id)).size).toBe(claims.length);
    expect(mappings).toHaveLength(17);
    for (const claim of claims) {
      expect(claim.statement.length).toBeGreaterThan(20);
      expect(claim.limitation).toBeTruthy();
      expect(claim.lastCheckedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      for (const sourceId of claim.sourceIds) {
        expect(sources.some(source => source.id === sourceId)).toBe(true);
        expect(ledger.sourceToClaim.find(row => row.sourceId === sourceId)!.evidenceClaimIds).toContain(claim.id);
      }
    }
    for (const question of questions) {
      expect(question.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const claimId of question.supportingEvidenceClaimIds) {
        expect(claims.some(claim => claim.id === claimId)).toBe(true);
        expect(ledger.claimToQuestion.find(row => row.claimId === claimId)!.questionVariantIds).toContain(question.id);
      }
      const mapping = mappings.find(mapping => mapping.questionVariantId === question.id)!;
      expect(mapping.evidenceClaimIds).toEqual(question.supportingEvidenceClaimIds);
      expect(mapping.constructedObservations.length).toBeGreaterThan(0);
    }
  });

  it("preserves historical evidence dates and supplies complete rights-aware source metadata", () => {
    for (const source of sources) {
      expect(source.completeCitation).toBeTruthy();
      expect(source.organizationOrJournal).toBeTruthy();
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.licenseLabel).toBeTruthy();
      expect(source.authorityAssessment).toBeTruthy();
      expect(source.reuseNotes).toBeTruthy();
      expect(source.evidenceClaimIds.length).toBeGreaterThan(0);
    }
    expect(sources.find(source => source.id === "source.ers-eacts-ests.pneumothorax.2024")!.accessedOn).toBe("2026-10-03");
    expect(claims.find(claim => claim.id === "claim.gs028d.lung-screening.eligibility")!.lastCheckedOn).toBe("2026-10-03");
    for (const link of links) {
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
  });

  it("records concrete individual author gates without independent or clinical approval", () => {
    expect(checks).toHaveLength(17);
    for (const item of items) {
      expect(item.reasoningSteps).toHaveLength(2);
      expect(item.closestCredibleError.length).toBeGreaterThan(30);
      expect(item.decidingObservation.length).toBeGreaterThan(30);
      expect(item.decisionChangingCounterfactual.length).toBeGreaterThan(30);
      expect(item.deletionTest.length).toBeGreaterThan(60);
      expect(item.manualAuthorGate.independentPass).toBe(false);
      expect(item.manualAuthorGate.clinicalApproval).toBe(false);
      for (const choice of item.choices) {
        expect(choice.temptation.length).toBeGreaterThan(20);
        expect(choice.reasonableCounterfactual.length).toBeGreaterThan(30);
      }
    }
    for (const record of [...questions, ...concepts, ...claims, ...caseReviews]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview ?? null).toBeNull();
    }
    expect(review.independentPass).toBe(false);
    expect(review.managerAccepted).toBe(false);
    expect(review.publicReleaseAuthorized).toBe(false);
    expect(review.independentPassQuestionIds).toHaveLength(6);
    expect(review.reviewDisplay).toBe("key shown first for review only");
  });

  it("keeps complete consolidation groups and explicit later-node selector constraints", () => {
    expect(packet.caseCompositionProposals).toHaveLength(4);
    expect(packet.caseCompositionProposals.flatMap(group => group.retiredCaseIds)).toHaveLength(16);
    for (const group of packet.caseCompositionProposals) {
      expect(group.applyRetirement).toBe(false);
      expect(group.preserveOldDefinitions).toBe(true);
      if (group.status === "withdrawn_parked_replacement") {
        expect(group.targetCaseId).toBeNull();
        expect(group.targetNodeIds).toEqual([]);
      } else {
        const target = cases.find(clinicalCase => clinicalCase.id === group.targetCaseId)!;
        expect(target.decisionNodes.map(node => node.id)).toEqual(group.targetNodeIds);
      }
    }
    for (const clinicalCase of cases) for (const later of clinicalCase.decisionNodes.slice(1)) {
      const item = items.find(item => item.id === later.id)!;
      expect(item.selectionConstraint).toBe("paired_only");
      expect(later.exhibit).toBeDefined();
      expect(later.exhibit).not.toEqual(clinicalCase.decisionNodes[0]!.exhibit);
    }
  });

  it("parses both JSON artifacts and leaves the sidecar outside shared runtime assembly", () => {
    expect(JSON.parse(rootFile("docs/research/question-topic-thoracic-lung-pleura-mediastinum-20261111.json")).counts).toEqual(packet.counts);
    expect(JSON.parse(rootFile(packet.sourceLedger)).statementMappings).toHaveLength(17);
    const moduleName = "question-topic-thoracic-lung-pleura-mediastinum-20261111";
    for (const file of ["packages/clinical-content/src/index.ts", "packages/clinical-content/src/synthetic-content.ts", "packages/clinical-content/src/question-ship-manifest.ts"]) {
      expect(rootFile(file)).not.toContain(`from "./${moduleName}"`);
    }
  });
});
