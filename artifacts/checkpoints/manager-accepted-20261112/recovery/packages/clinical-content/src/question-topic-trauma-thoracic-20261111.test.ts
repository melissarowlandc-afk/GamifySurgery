import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import program from "../../../docs/research/question-topic-program-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-trauma-thoracic-20261111.json";
import dispositions from "../../../docs/research/question-topic-acceptance-batch2-dispositions-20261111.json";
import { ROW_045_QUESTION_VARIANTS } from "./approved-data/right-thoracotomy-trauma-exposure";
import { GS028_20261003_CASES } from "./development-batch/2026-10-03-coverage-gaps/coverage-gaps-batch";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import {
  answerChoiceTimingRegistryEntrySchema, syntheticClinicalCaseSchema, testedConceptSchema,
} from "./schema";
import {
  QUESTION_TOPIC_TRAUMA_THORACIC_PACKET as packet,
  QUESTION_TOPIC_TRAUMA_THORACIC_CASES as cases,
  QUESTION_TOPIC_TRAUMA_THORACIC_QUESTIONS as questions,
  QUESTION_TOPIC_TRAUMA_THORACIC_CLAIMS as claims,
  QUESTION_TOPIC_TRAUMA_THORACIC_SOURCES as sources,
  QUESTION_TOPIC_TRAUMA_THORACIC_TESTED_CONCEPTS as concepts,
  QUESTION_TOPIC_TRAUMA_THORACIC_TIMING_ENTRIES as timing,
  QUESTION_TOPIC_TRAUMA_THORACIC_SOURCE_LINKS as links,
  QUESTION_TOPIC_TRAUMA_THORACIC_MANIFEST as manifest,
  QUESTION_TOPIC_TRAUMA_THORACIC_AUTHORING_CONCEPTS as activeConcepts,
  QUESTION_TOPIC_TRAUMA_THORACIC_REVIEWED_CASES as reviewedCases,
  QUESTION_TOPIC_TRAUMA_THORACIC_REVIEWED_QUESTIONS as reviewedQuestions,
  QUESTION_TOPIC_TRAUMA_THORACIC_PARKED_ITEMS as parked,
  QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_CASES as salvageCases,
  QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_QUESTIONS as salvageQuestions,
  QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_TIMING_ENTRIES as salvageTiming,
  QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_CASE_REVIEWS as salvageCaseReviews,
  QUESTION_TOPIC_TRAUMA_THORACIC_SALVAGE_MANIFEST as salvageManifest,
} from "./question-topic-trauma-thoracic-20261111";

const canonical = (v: unknown): unknown => Array.isArray(v) ? v.map(canonical) : v && typeof v === "object"
  ? Object.fromEntries(Object.keys(v).sort().map(k => [k, canonical((v as Record<string, unknown>)[k])])) : v;
const digest = (v: unknown) => createHash("sha256").update(JSON.stringify(canonical(v))).digest("hex");
const unique = (values: string[]) => expect(new Set(values).size).toBe(values.length);

describe("trauma-thoracic explicit-import topic sidecar", () => {
  it("reconciles every assigned exact variant, locator, before version and verdict", () => {
    const assigned = program.inventory.filter(r => r.primaryTopicSlug === "trauma-thoracic");
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(packet.audit.map(a => a.inventoryRecordId).sort()).toEqual(assigned.map(r => r.recordId).sort());
    unique(packet.audit.map(a => a.inventoryRecordId));
    expect(packet.audit).toHaveLength(19);
    expect(packet.audit.filter(a => a.verdict === "Rewrite")).toHaveLength(3);
    expect(packet.audit.filter(a => a.verdict === "Retire-and-replace")).toHaveLength(16);
    for (const audit of packet.audit) {
      const before = packet.before.find(b => b.inventoryRecordId === audit.inventoryRecordId)!;
      expect(audit.variantIds).toEqual(before.variantIds);
      expect(audit.sourceLocation.file).toBeTruthy();
      expect(audit.sourceLocation.export).toBeTruthy();
      expect(audit.beforeQuestionSha256s.length).toBeGreaterThan(0);
      expect(audit.reasons.length).toBeGreaterThanOrEqual(2);
      expect(audit.contextAudit).toHaveLength(before.visibleContexts.length);
      for (const q of before.questionDefinitions) expect(digest(q.question)).toBe(q.canonicalSha256);
      for (const c of before.visibleContexts) expect(digest(c.clinicalCase)).toBe(c.canonicalSha256);
      for (const id of audit.replacementQuestionVariantIds) {
        const replacement = packet.nodes.find(n => n.questionVariantId === id)!;
        expect(replacement).toBeTruthy();
        expect(questions.some(q => q.id === id)).toBe(replacement.runtimeEligible);
      }
    }
  });

  it("preserves the eight original source cases and all four exact historical approvals", () => {
    const liveRows = packet.assignment.inventory.filter(r => r.live);
    expect(liveRows).toHaveLength(8);
    for (const row of liveRows) {
      const current = GS028_20261003_CASES.find(c => c.id === row.caseId)!;
      expect(current, row.caseId ?? row.recordId).toBeTruthy();
      const before = packet.before.find(b => b.inventoryRecordId === row.recordId)!;
      expect(before.visibleContexts.some(c => c.canonicalSha256 === digest(current))).toBe(true);
    }
    expect(packet.assignment.frozenPassApprovalReferences.independentPass).toEqual([]);
    expect(packet.assignment.frozenPassApprovalReferences.clinicalApprovals).toHaveLength(4);
    for (const pin of packet.assignment.frozenPassApprovalReferences.clinicalApprovals) {
      const original = ROW_045_QUESTION_VARIANTS.find(q => q.id === pin.questionVariantId)!;
      expect(digest(original)).toBe(pin.questionCanonicalSha256);
      expect(original.reviewStatus).toBe("clinically_approved");
      expect(pin.lastClinicianReview.reviewer).toBe("Melissa Rowland, MD");
    }
    expect(packet.assignment.recordedHolds.map(h => h.id).sort()).toEqual([
      "review.n3.blunt-chest-injury-discordant-screening-results.v2",
      "review.n3.blunt-chest-mechanism-versus-completed-screen.v2",
    ]);
  });

  it("materializes ten clinic reviews and thirteen active supported decisions", () => {
    expect(cases).toHaveLength(10);
    expect(questions).toHaveLength(13);
    expect(concepts).toHaveLength(13);
    expect(cases.filter(c => c.decisionNodes.length === 2)).toHaveLength(3);
    expect(cases.filter(c => c.decisionNodes.length === 1)).toHaveLength(7);
    for (const c of cases) {
      expect(syntheticClinicalCaseSchema.safeParse(c).success).toBe(true);
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.tutorialEligible).toBe(false);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.prototypeDemographics?.ageYears).toBeGreaterThanOrEqual(18);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toMatch(/clinic/i);
      for (const n of c.decisionNodes) {
        expect(n.shuffleAnswers).toBe(true);
        expect(n.answerChoices.length).toBeGreaterThanOrEqual(3);
        expect(n.answerChoices.length).toBeLessThanOrEqual(4);
        expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
        expect(n.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
        expect(n.resultGateAfter).toBeNull();
        expect(n.stem).toContain("{patientName}");
        expect(n.currentUpdate).toBeTruthy();
      }
    }
    for (const c of concepts) expect(testedConceptSchema.safeParse(c).success).toBe(true);
  });

  it("keeps identities unique and reconciles the manager's accepted subset", () => {
    unique(cases.map(c => c.id)); unique(questions.map(q => q.id)); unique(concepts.map(c => c.id));
    unique(cases.flatMap(c => c.decisionNodes.map(n => n.id)));
    unique(cases.flatMap(c => c.decisionNodes.flatMap(n => n.answerChoices.map(a => a.id))));
    const liveIds = new Set(SYNTHETIC_CLINICAL_RELEASE.cases.map(c => c.id));
    const acceptedCaseIds = [...new Set(dispositions.items
      .filter(item => item.topic === "trauma-thoracic" && item.status === "accepted")
      .map(item => item.caseId))];
    expect(cases.filter(c => liveIds.has(c.id)).map(c => c.id).sort()).toEqual(acceptedCaseIds.sort());
    expect(activeConcepts.filter(c => c.conceptMeaning === "preserved_identity")).toHaveLength(1);
    expect(activeConcepts.filter(c => c.conceptMeaning !== "preserved_identity")).toHaveLength(12);
    expect(packet.independentReview1.inputSnapshot.concepts).toHaveLength(18);
    expect(packet.concepts).toHaveLength(19);
    expect(packet.identityHistory).toHaveLength(7);
    expect(manifest.installedInDefaultRelease).toBe(false);
    expect(manifest.pipelinePassed).toBe(false);
    expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.publicReleaseAuthorized).toBe(false);
  });

  it("requires clinician review on every new clinical record", () => {
    for (const row of [...packet.nodes, ...packet.cases, ...packet.concepts, ...sources, ...claims]) {
      expect(row.reviewStatus).toBe("needs_clinician_review");
      expect(row.lastClinicianReview).toBeNull();
      expect(row.aiAssistedDrafting).toBe(true);
    }
  });

  it("closes reciprocal source, claim, question and exact statement mappings", () => {
    unique(sources.map(s => s.id)); unique(claims.map(c => c.id));
    for (const s of sources) {
      expect(s.id).toMatch(/^source\.trauma-thoracic\./);
      expect(s.completeCitation).toBeTruthy(); expect(s.authors.length).toBeGreaterThan(0);
      expect(s.authorityAssessment).toBeTruthy(); expect(s.reuseNotes).toBeTruthy();
      expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(s.evidenceClaimIds.sort()).toEqual(claims.filter(c => c.sourceIds.includes(s.id)).map(c => c.id).sort());
    }
    for (const claim of claims) {
      expect(claim.id).toMatch(/^claim\.trauma-thoracic\./);
      expect(claim.sourceIds.every(id => sources.some(s => s.id === id))).toBe(true);
      const map = ledger.claimToQuestion.find(m => m.evidenceClaimId === claim.id)!;
      expect(map).toBeTruthy();
      expect(map.questionVariantIds.sort()).toEqual(questions.filter(q => q.supportingEvidenceClaimIds.includes(claim.id)).map(q => q.id).sort());
    }
    for (const q of questions) {
      expect(q.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      expect(q.supportingEvidenceClaimIds.every(id => claims.some(c => c.id === id))).toBe(true);
      const maps = ledger.statementMappings.filter(m => m.questionVariantId === q.id);
      expect(maps.some(m => m.field === "explanation")).toBe(true);
      for (const a of q.answerChoices) expect(maps.some(m => m.field === `choices.${a.id}.rationale`)).toBe(true);
      expect(maps.every(m => m.evidenceClaimIds.length && m.evidenceClaimIds.every(id => q.supportingEvidenceClaimIds.includes(id)))).toBe(true);
    }
  });

  it("keeps original offline dates separate from the local mapping date", () => {
    const offline = ledger.sources.find(s => s.id.endsWith("caputo-exposure-2024-offline"))!;
    expect(offline.accessedOn).toBe("2026-08-06");
    expect(offline.localMappingCheckedOn).toBe("2026-11-11");
    for (const slug of ["planned-exposure", "edt-exposure"]) {
      expect(claims.find(c => c.id === `claim.trauma-thoracic.${slug}`)!.lastCheckedOn).toBe("2026-08-06");
    }
    expect(ledger.rightsFindings.some(r => r.site === "SVS")).toBe(true);
  });

  it("binds all testing-choice waits to exact identities and existing placeholder profiles", () => {
    expect(timing).toEqual(packet.timingProposals);
    expect(timing).toHaveLength(13);
    for (const entry of timing) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(entry).success).toBe(true);
      const n = packet.nodes.find(n => n.questionVariantId === entry.questionVariantId)!;
      expect(n.id).toBe(entry.nodeId);
      expect(cases.find(c => c.id === entry.caseId)!.decisionNodes.some(d => d.id === n.id)).toBe(true);
      if (entry.classification.kind === "test_choices") {
        expect(entry.classification.choices.map(c => [c.choiceId, c.choiceLabel])).toEqual(n.choices.map(c => [c.id, c.label]));
        for (const a of entry.classification.choices) {
          const authored = n.choices.find(c => c.id === a.choiceId)!;
          if (a.timing.kind === "test") expect(a.timing.timingProfileId).toBe(authored.timingProfileId);
          else expect(authored.timingProfileId).toBeNull();
        }
      } else expect(n.choices.every(c => c.timingProfileId === null)).toBe(true);
    }
    const balance = readFileSync(new URL("../../balance-config/src/diagnostic-timing.ts", import.meta.url), "utf8");
    const profiles = new Set(packet.nodes.flatMap(n => n.choices.flatMap(c => c.timingProfileId ? [c.timingProfileId] : [])));
    for (const profile of profiles) expect(balance).toContain(profile);
    expect(packet.orderProposals.every(p => p.serviceRequest === null && p.execution === "record_review_only")).toBe(true);
  });

  it("uses safe external source links and records no gameplay retrieval", () => {
    expect(links).toHaveLength(sources.length);
    for (const link of links) {
      expect(link.target).toBe("_blank"); expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer"); expect(link.href).toMatch(/^https:\/\//);
    }
    const code = readFileSync(new URL("./question-topic-trauma-thoracic-20261111.ts", import.meta.url), "utf8");
    expect(code).not.toMatch(/\bfetch\s*\(|https\.get\s*\(/);
  });

  it("keeps all three disputed extensions unkeyed and outside scored evidence", () => {
    expect(packet.withheldTeachingPoints).toHaveLength(3);
    expect(packet.unkeyedDraftSlots).toHaveLength(3);
    for (const held of packet.withheldTeachingPoints) {
      expect(held.key).toBeNull(); expect(held.questionVariantId).toBeNull();
      expect(claims.find(c => c.id === held.evidenceClaimId)!.certainty).toBe("conflicting");
      expect(questions.every(q => !q.supportingEvidenceClaimIds.includes(held.evidenceClaimId))).toBe(true);
    }
  });

  it("records a concrete manual gate, counterfactuals and nonleaking sequence checks", () => {
    for (const n of packet.nodes.filter(n => n.runtimeEligible)) {
      expect(n.reasoningSteps).toHaveLength(2);
      for (const key of ["cueAttack", "sameStageAndCategory", "twoConsequentialSteps", "predictedResidentDifficulty", "singleBestAnswer"] as const) {
        expect(n.authorGate[key].length).toBeGreaterThan(45);
      }
      expect(n.closestCredibleError.length).toBeGreaterThan(20);
      expect(n.deletionTest.length).toBeGreaterThan(50);
      expect(n.choices.every(c => c.temptation.length > 15 && c.counterfactual.length > 25)).toBe(true);
      expect(n.choices.every(c => !/\balone\b|individualized|tailored/i.test(c.label))).toBe(true);
    }
    for (const c of packet.cases) expect(c.sequenceReview.length).toBeGreaterThan(50);
    const first = cases.find(c => c.patientDisplayName === "Elena Morales")!.decisionNodes[0]!;
    expect([first.explanation, ...first.answerChoices.map(c => c.rationale)].join(" ")).not.toMatch(/persistent.*arrhythmia|inadequate.*transthoracic|transesophageal/i);
    for (const name of ["Owen Brooks", "Sofia Patel", "Amina Hassan"]) {
      expect(cases.find(c => c.patientDisplayName === name)!.decisionNodes).toHaveLength(1);
    }
  });

  it("pins the exact proposed runtime case versions for independent review", () => {
    expect(packet.runtimePins).toHaveLength(cases.length);
    for (const c of cases) expect(digest(c)).toBe(packet.runtimePins.find(pin => pin.caseId === c.id)!.canonicalSha256);
  });

  it("preserves every reviewed PASS question, scored node and common case header exactly", () => {
    const round = packet.independentReview1;
    expect(round.passPins).toHaveLength(4);
    for (const pin of round.passPins) {
      const question = questions.find(q => q.id === pin.questionVariantId)!;
      const clinicalCase = cases.find(c => c.id === pin.caseId)!;
      const node = clinicalCase.decisionNodes.find(n => n.id === pin.nodeId)!;
      const { decisionNodes, learningSummary, ...header } = clinicalCase;
      expect(decisionNodes).toContainEqual(node);
      expect(learningSummary).toBeTruthy();
      expect(digest(question)).toBe(pin.questionCanonicalSha256);
      expect(digest(node)).toBe(pin.nodeCanonicalSha256);
      expect(digest(header)).toBe(pin.headerCanonicalSha256);
      expect(question).toEqual(pin.question);
      expect(node).toEqual(pin.node);
      expect(header).toEqual(pin.header);
      expect(question.contentVersion).toBe("clinical.question-topic-trauma-thoracic.2026-11-11.v1");
    }
    const reviewBytes = readFileSync(new URL("../../../docs/research/question-topic-trauma-thoracic-review-20261111.json", import.meta.url));
    expect(createHash("sha256").update(reviewBytes).digest("hex")).toBe(round.reviewFileSha256);
  });

  it("gives every reviewed item one explicit disposition and excludes all parked candidates", () => {
    const round = packet.independentReview1;
    expect(round.responses).toHaveLength(18);
    unique(round.responses.map(r => r.reviewedQuestionVariantId));
    expect(round.responses.map(r => r.reviewedQuestionVariantId).sort()).toEqual(round.records.map(r => r.id).sort());
    expect(round.responses.filter(r => r.status === "pass-preserved")).toHaveLength(4);
    expect(round.responses.filter(r => r.status === "revised")).toHaveLength(9);
    expect(parked).toHaveLength(5);
    for (const response of round.responses) {
      const review = round.records.find(r => r.id === response.reviewedQuestionVariantId)!;
      expect(response.attempts).toBe(review.verdict === "PASS" ? 0 : 1);
      expect(response.issueResponses).toHaveLength(review.clarityIssues.length + review.cues.length + review.fairness.length + review.suggestions.length);
      expect(response.issueResponses.every(issue => issue.resolution.length > 30)).toBe(true);
      const current = packet.nodes.find(n => n.questionVariantId === response.currentQuestionVariantId)!;
      expect(current.revisionStatus).toBe(response.status);
      expect(questions.some(q => q.id === current.questionVariantId)).toBe(response.status !== "parked");
    }
    for (const candidate of parked) {
      expect(candidate.runtimeEligible).toBe(false);
      expect(candidate.acceptedKeyChoiceId).toBeNull();
      expect(candidate.keyStatus).toBe("archival_author_intent_only");
      expect(candidate.parkingReason!.length).toBeGreaterThan(60);
      expect(cases.flatMap(c => c.decisionNodes).some(n => n.id === candidate.id)).toBe(false);
      expect(timing.some(t => t.nodeId === candidate.id)).toBe(false);
      expect(ledger.parkedStatementMappings.some(m => m.nodeId === candidate.id)).toBe(true);
    }
  });

  it("uses the revised scopes, acquired observations and offered counterfactual plans", () => {
    const selective = packet.nodes.find(n => n.slug === "bci-selective-imaging")!;
    expect(selective.currentUpdate).toMatch(/telemetry and serial troponin/);
    expect(selective.task).toMatch(/additional cardiac-imaging/);
    const echo = packet.nodes.find(n => n.slug === "bci-persistent-arrhythmia")!;
    expect(echo.choices.some(c => /repeat transthoracic/i.test(c.label))).toBe(false);
    expect(echo.choices.some(c => /without further cardiac imaging/.test(c.label))).toBe(true);
    expect(echo.decisionChangingCounterfactual).toMatch(/best offered plan/);
    const diaphragm = packet.nodes.find(n => n.slug === "left-diaphragm-evaluation")!;
    expect(diaphragm.choices.some(c => /thoracoscop/i.test(c.label))).toBe(false);
    const airway = packet.nodes.find(n => n.slug === "airway-tear-repair")!;
    expect(airway.currentUpdate).toMatch(/visible gap/);
    expect(airway.currentUpdate).toMatch(/all side holes are intrapleural/);
    const ribs = packet.nodes.find(n => n.slug === "rib-fixation-weaning")!;
    expect(ribs.currentUpdate).toMatch(/moves inward with inspiration/);
    expect(ribs.currentUpdate).not.toMatch(/team attributes|can tolerate/i);
    expect(ribs.task).not.toMatch(/chest-wall treatment|consider/i);
  });

  it("retains the complete reviewed batch and separates the changed ventilation meaning", () => {
    const snapshot = packet.independentReview1.inputSnapshot;
    expect(reviewedCases).toHaveLength(11);
    expect(reviewedQuestions).toHaveLength(18);
    expect(snapshot.nodes).toHaveLength(18);
    expect(ledger.historicalStatementMappings).toEqual(snapshot.statementMappings);
    for (const oldCase of reviewedCases) {
      expect(digest(oldCase)).toBe(snapshot.runtimePins.find(pin => pin.caseId === oldCase.id)!.canonicalSha256);
    }
    const changed = packet.independentReview1.meaningChanges;
    expect(changed).toHaveLength(1);
    expect(changed[0]!.currentConceptId).not.toBe(changed[0]!.previousConceptId);
    const oldQuestion = reviewedQuestions.find(q => q.id === changed[0]!.reviewedQuestionVariantId)!;
    const current = questions.find(q => q.id === changed[0]!.currentQuestionVariantId)!;
    expect(oldQuestion.conceptId).toBe(changed[0]!.previousConceptId);
    expect(current.conceptId).toBe(changed[0]!.currentConceptId);
    expect(packet.concepts.some(c => c.id === oldQuestion.conceptId && !c.runtimeEligible)).toBe(true);
    expect(packet.concepts.find(c => c.id === current.conceptId)!.historyMigration).toMatch(/^None\./);
    expect(current.supportingEvidenceClaimIds).toContain("claim.trauma-thoracic.air-trapping-ventilation");
    for (const response of packet.independentReview1.responses.filter(r => r.status === "revised" && r.currentQuestionVariantId !== current.id)) {
      const old = reviewedQuestions.find(q => q.id === response.reviewedQuestionVariantId)!;
      expect(questions.find(q => q.id === response.currentQuestionVariantId)!.conceptId).toBe(old.conceptId);
    }
  });

  it("recovers exactly the skipped PASS node in a standalone clinic case", () => {
    const skipped = dispositions.items.filter(item => item.topic === "trauma-thoracic" && item.status === "skipped");
    expect(skipped).toHaveLength(1);
    expect(salvageCases).toHaveLength(1);
    expect(salvageQuestions).toHaveLength(1);
    expect(packet.salvage.items.flatMap(item => item.nodeIds)).toEqual(skipped.map(item => item.nodeId));
    expect(packet.reviewQueue).toEqual(packet.salvage.reviewQueue);
    expect(packet.reviewQueue.every(item => item.status === "salvage")).toBe(true);

    const item = packet.salvage.items[0]!;
    const clinicalCase = salvageCases[0]!;
    expect(syntheticClinicalCaseSchema.safeParse(clinicalCase).success).toBe(true);
    expect(clinicalCase.id).toBe(item.caseId);
    expect(clinicalCase.id).not.toBe(item.originalCaseId);
    expect(clinicalCase.decisionNodes).toEqual([item.before.node]);
    expect(clinicalCase.decisionNodes.map(node => node.id)).toEqual(item.nodeIds);
    expect(salvageQuestions[0]).toEqual(item.before.question);
    expect(digest(clinicalCase.decisionNodes[0])).toBe(item.after.nodeCanonicalSha256);
    expect(digest(salvageQuestions[0])).toBe(item.after.questionCanonicalSha256);
    expect(digest(clinicalCase)).toBe(item.after.caseCanonicalSha256);
    expect(clinicalCase.requiredClinicalSetting).toBe("clinic");
    expect(clinicalCase.requiredCapabilityIds).toEqual([]);
    expect(clinicalCase.presentation).toBe(item.before.clinicalCase.presentation);
    expect(clinicalCase.chiefComplaint).toBe(item.before.clinicalCase.chiefComplaint);
    expect(clinicalCase.prototypeDemographics).toEqual(item.before.clinicalCase.prototypeDemographics);
    expect(clinicalCase.approvedInstantiationProfiles![0]!.presentation).toBe(item.before.clinicalCase.presentation);
    expect(clinicalCase.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(clinicalCase.prototypeDemographics);
    expect(clinicalCase.learningSummary).toBe(item.before.node.explanation);
    expect(clinicalCase.decisionNodes[0]!.shuffleAnswers).toBe(true);
    expect(clinicalCase.decisionNodes[0]!.answerChoices.every(choice => choice.serviceRequest === null)).toBe(true);
    expect(clinicalCase.decisionNodes[0]!.resultGateAfter).toBeNull();
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.some(c => c.id === clinicalCase.id)).toBe(false);
    expect(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(c => c.decisionNodes).some(n => n.id === item.nodeIds[0])).toBe(false);
    expect(salvageManifest.pipelinePassed).toBe(false);
    expect(salvageManifest.clinicalApproval).toBe(false);
    expect(salvageManifest.installedInDefaultRelease).toBe(false);
    expect(item.status).toBe("salvage");
    expect(item.sourceReview.record.verdict).toBe("PASS");
    expect(item.independentCaseReviewStatus).toBe("pending_salvage_context_review");
  });

  it("preserves all accepted topic nodes and prior case definitions through salvage", () => {
    const preservation = packet.salvage.preservation;
    expect(preservation.acceptedAuthorNodePins).toHaveLength(7);
    expect(preservation.acceptedRuntimeCasePins).toHaveLength(5);
    for (const pin of preservation.priorAuthoringCases) {
      expect(digest(cases.find(c => c.id === pin.caseId))).toBe(pin.canonicalSha256);
    }
    for (const pin of preservation.acceptedAuthorNodePins) {
      expect(digest(packet.nodes.find(n => n.id === pin.nodeId))).toBe(pin.canonicalSha256);
      expect(packet.salvage.items.some(item => item.nodeIds.includes(pin.nodeId))).toBe(false);
    }
    for (const pin of preservation.acceptedRuntimeCasePins) {
      expect(digest(cases.find(c => c.id === pin.caseId))).toBe(pin.canonicalSha256);
      expect(digest(SYNTHETIC_CLINICAL_RELEASE.cases.find(c => c.id === pin.caseId))).toBe(pin.canonicalSha256);
    }
    for (const pin of preservation.acceptedQuestionPins) {
      expect(digest(questions.find(q => q.id === pin.questionVariantId))).toBe(pin.canonicalSha256);
    }
    for (const pin of packet.salvage.inputHashes.filter(pin => pin.path.includes("question-program-batch2-accepted"))) {
      const bytes = readFileSync(new URL("../../../" + pin.path, import.meta.url));
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(pin.sha256);
    }
  });

  it("binds salvage timing and evidence to the new case without changing verified facts", () => {
    const item = packet.salvage.items[0]!;
    expect(salvageTiming).toEqual(packet.salvage.timingProposals);
    expect(salvageTiming).toEqual([{
      caseId: item.caseId,
      nodeId: item.nodeIds[0],
      questionVariantId: item.questionVariantIds[0],
      classification: { kind: "no_test" },
    }]);
    expect(salvageCaseReviews).toHaveLength(1);
    expect(salvageCaseReviews[0]!.status).toBe("salvage");
    expect(salvageCaseReviews[0]!.reviewStatus).toBe("needs_clinician_review");
    expect(salvageCaseReviews[0]!.lastClinicianReview).toBeNull();
    expect(ledger.salvageStatementMappings).toHaveLength(10);
    for (const mapping of ledger.salvageStatementMappings) {
      expect(mapping.status).toBe("salvage");
      expect(mapping.caseId).toBe(item.caseId);
      expect(mapping.nodeId).toBe(item.nodeIds[0]);
      expect(mapping.questionVariantId).toBe(item.questionVariantIds[0]);
      expect(mapping.evidenceClaimIds).toEqual(salvageQuestions[0]!.supportingEvidenceClaimIds);
      expect(ledger.statementMappings.some(original => original.id === mapping.originalStatementMappingId)).toBe(true);
    }
    expect(digest(ledger.sources)).toBe(packet.salvage.preservation.sourceRecordsCanonicalSha256);
    expect(digest(ledger.claims)).toBe(packet.salvage.preservation.atomicClaimsCanonicalSha256);
    expect(ledger.salvageEvidenceReuse.newSources).toBe(0);
    expect(ledger.salvageEvidenceReuse.newAtomicClaims).toBe(0);
  });
});
