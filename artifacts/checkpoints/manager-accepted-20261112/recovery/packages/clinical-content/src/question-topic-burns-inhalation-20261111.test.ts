import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { getDiagnosticTimingRuleForProfile } from "../../balance-config/src/diagnostic-timing";
import packet from "../../../docs/research/question-topic-burns-inhalation-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-burns-inhalation-20261111.json";
import {
  answerChoiceTimingRegistryEntrySchema,
  syntheticClinicalReleaseSchema,
} from "./schema";
import { ROW_043_QUESTION_VARIANTS, ROW_043_CLINICAL_APPROVAL } from "./approved-data/severe-burn-early-enteral-nutrition";
import { QUESTION_NEW_N2_ROUND3_QUESTIONS } from "./question-new-n2-round3-20261104";
import {
  BURNS_INHALATION_TOPIC_REVIEWED_QUESTIONS as reviewedQuestions,
  BURNS_INHALATION_TOPIC_REVIEWED_CASES as reviewedCases,
  BURNS_INHALATION_TOPIC_REVIEWED_TIMING_ENTRIES as reviewedTimings,
  BURNS_INHALATION_TOPIC_REVIEWED_CASE_DEFINITIONS as reviewedDefinitions,
  BURNS_INHALATION_TOPIC_REVISION_CASE_DEFINITIONS as revisedDefinitions,
  BURNS_INHALATION_TOPIC_PARKED_CASE_DEFINITIONS as parkedDefinitions,
  BURNS_INHALATION_TOPIC_PARKED_ARTIFACTS as parked,
  BURNS_INHALATION_TOPIC_ITEM_STATUSES as statuses,
  BURNS_INHALATION_TOPIC_AUTHOR_CHECKS as checks,
  BURNS_INHALATION_TOPIC_AUTHORING_CONCEPTS as concepts,
  BURNS_INHALATION_TOPIC_CASE_DEFINITIONS as definitions,
  BURNS_INHALATION_TOPIC_CASE_REVIEWS as reviews,
  BURNS_INHALATION_TOPIC_CASES as cases,
  BURNS_INHALATION_TOPIC_CLAIMS as claims,
  BURNS_INHALATION_TOPIC_MANIFEST as manifest,
  BURNS_INHALATION_TOPIC_ORDER_PROPOSALS as orders,
  BURNS_INHALATION_TOPIC_PREVIEW_RELEASE as preview,
  BURNS_INHALATION_TOPIC_QUESTIONS as questions,
  BURNS_INHALATION_TOPIC_SOURCE_LINKS as links,
  BURNS_INHALATION_TOPIC_SOURCES as sources,
  BURNS_INHALATION_TOPIC_STATEMENT_MAPPINGS as mappings,
  BURNS_INHALATION_TOPIC_TIMING_ENTRIES as timings,
} from "./question-topic-burns-inhalation-20261111";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const flat = definitions.flatMap(c => c.nodes.map(n => ({ c, n })));

describe("burns/inhalation explicit-import topic sidecar", () => {
  it("preserves the complete exact independent-review baseline and its ten PASS questions", () => {
    expect(reviewedQuestions).toEqual(packet.reviewRound1.questions);
    expect(reviewedCases).toEqual(packet.reviewRound1.cases);
    expect(reviewedTimings).toEqual(packet.reviewRound1.timingEntries);
    for (const before of packet.reviewRound1.proposals) {
      expect(digest(reviewedQuestions.find(q => q.id === before.id))).toBe(before.exactQuestionSha256);
      expect(digest(reviewedCases.find(c => c.id === before.caseId))).toBe(before.exactCaseSha256);
    }
    const pass = packet.reviewRound1.review.filter(r => r.verdict === "PASS");
    expect(pass).toHaveLength(10);
    for (const review of pass) {
      expect(questions.find(q => q.id === review.id)).toEqual(reviewedQuestions.find(q => q.id === review.id));
      const status = statuses.find(x => x.reviewedQuestionVariantId === review.id)!;
      expect(status.status).toBe("pass-preserved");
      expect(status.attemptCount).toBe(0);
    }
    const path = root + packet.reviewRound1.reviewPath;
    expect(createHash("sha256").update(readFileSync(path)).digest("hex")).toBe(packet.reviewRound1.reviewFileSha256);
  });

  it("gives each returned item exactly one v2 disposition and excludes parked attempts", () => {
    expect(statuses).toHaveLength(22);
    expect(statuses.filter(x => x.status === "revised")).toHaveLength(8);
    expect(statuses.filter(x => x.status === "parked")).toHaveLength(4);
    expect(revisedDefinitions).toHaveLength(8);
    expect(parkedDefinitions).toHaveLength(4);
    for (const status of statuses.filter(x => x.status !== "pass-preserved")) {
      expect(status.attemptCount).toBe(1);
      expect(status.proposedQuestionVariantId).toMatch(/\.v2$/);
      expect(status.independentReReviewStatus).toBe("not_passed");
      const current = questions.find(q => q.id === status.proposedQuestionVariantId);
      const candidate = parked.questions.find(q => q.id === status.proposedQuestionVariantId);
      expect(status.status === "parked" ? !current && !!candidate : !!current && !candidate).toBe(true);
      const row = packet.reviewRound2.items.find(x => x.reviewedQuestionVariantId === status.reviewedQuestionVariantId)!;
      expect(row.reviewIssueDispositions.map(x => x.category)).toEqual(["clarityIssues", "cues", "fairness", "suggestions"]);
      expect(row.reviewDisposition.length).toBeGreaterThan(80);
      if (status.status === "parked") expect(status.parkedReason!.length).toBeGreaterThan(80);
    }
    expect(syntheticClinicalReleaseSchema.parse(parked.preview_release).cases).toHaveLength(4);
  });

  it("splits exact passing companions and leaves only the fully PASS fluid pair multipart", () => {
    const split = packet.reviewRound2.caseComposition.filter(x => x.composition.startsWith("PASS standalone"));
    expect(split).toHaveLength(4);
    for (const composition of split) {
      const current = cases.find(c => c.id === composition.caseId)!;
      const old = reviewedCases.find(c => c.id === composition.originalCaseId)!;
      expect(current.decisionNodes).toHaveLength(1);
      expect(current.presentation).toBe(old.presentation);
      expect(current.chiefComplaint).toBe(old.chiefComplaint);
      expect(current.prototypeDemographics).toEqual(old.prototypeDemographics);
      expect(current.approvedInstantiationProfiles).toEqual(old.approvedInstantiationProfiles);
      const now = current.decisionNodes[0]!;
      const before = old.decisionNodes.find(n => n.questionVariantId === now.questionVariantId)!;
      // A former first node may gain neutral end-of-case completion only.
      expect({ ...now, terminalDispositions: [] }).toEqual({ ...before, terminalDispositions: [] });
      for (const terminal of now.terminalDispositions) {
        expect(terminal.kind).toBe("no_terminal_outcome");
        if (terminal.kind !== "no_terminal_outcome") throw new Error("unexpected clinical terminal outcome in PASS split");
        expect(terminal.clinicalRationale).toBe(now.answerChoices.find(c => c.id === terminal.answerChoiceId)!.rationale);
      }
      const oldTiming = reviewedTimings.find(x => x.questionVariantId === now.questionVariantId)!;
      expect(timings.find(x => x.questionVariantId === now.questionVariantId)).toEqual({ ...oldTiming, caseId: current.id });
    }
    const multi = cases.filter(c => c.decisionNodes.length > 1);
    expect(multi).toHaveLength(1);
    expect(multi[0]).toEqual(reviewedCases.find(c => c.id === "case.topic.burns-inhalation.fluid-record.v1"));
    for (const c of multi) for (const n of c.decisionNodes) {
      expect(statuses.find(x => x.proposedQuestionVariantId === n.questionVariantId)!.status).toBe("pass-preserved");
    }
  });

  it("retains old clinical atoms exactly while mapping all new evidence and balanced operative choices", () => {
    const originalIds = new Set(packet.reviewRound1.questions.flatMap(q => q.supportingEvidenceClaimIds));
    for (const claim of claims.filter(c => c.id.includes(".r2-"))) {
      expect(originalIds.has(claim.id)).toBe(false);
      expect(ledger.round2Verification.newClaimIds).toContain(claim.id);
      expect(ledger.claimToQuestionMappings.find(x => x.claimId === claim.id)!.activeQuestionVariantIds.length).toBeGreaterThan(0);
    }
    const coverage = revisedDefinitions.find(c => c.nodes[0]!.slug === "temporary-burn-coverage")!.nodes[0]!;
    expect(coverage.options).toHaveLength(4);
    expect(coverage.options.filter(o => o.label.includes("Complete tangential excision"))).toHaveLength(2);
    expect(coverage.options.filter(o => o.label.includes("cadaveric allograft"))).toHaveLength(2);
    expect(coverage.options.filter(o => o.label.includes("meshed autograft"))).toHaveLength(2);
    const newMeaning = revisedDefinitions.flatMap(c => c.nodes).filter(n => n.conceptMeaning === "changed");
    expect(newMeaning).toHaveLength(5);
    expect(newMeaning.every(n => n.previousConceptId && n.previousConceptId !== n.conceptId)).toBe(true);
    for (const d of revisedDefinitions) {
      const original = reviewedDefinitions.flatMap(c => c.nodes).find(n => n.slug === d.nodes[0]!.slug)!;
      expect(original).toBeDefined();
      expect(d.nodes[0]).not.toEqual(original);
    }
  });
  it("reconciles the complete assignment and all verdict/replacement identities", () => {
    expect(packet.assignment.inventory).toHaveLength(21);
    expect(packet.audit.map(x => x.recordId).sort()).toEqual(packet.assignment.inventory.map(x => x.recordId).sort());
    expect(new Set(packet.audit.flatMap(x => x.variantIds)).size).toBe(21);
    expect(packet.audit.filter(x => x.verdict === "Keep")).toHaveLength(5);
    expect(packet.audit.filter(x => x.verdict === "Rewrite")).toHaveLength(6);
    expect(packet.audit.filter(x => x.verdict === "Retire-and-replace")).toHaveLength(10);
    const destinations = new Set([...reviewedQuestions.map(q => q.id), ...questions.map(q => q.id), "question.n2.burn-feeding-perfusion-prerequisite.v3"]);
    for (const row of packet.audit) {
      expect(row.reasons.length).toBeGreaterThanOrEqual(3);
      expect(row.beforeVersion[0]!.sha256).toMatch(/^[a-f0-9]{64}$/);
      expect(row.exportLocator.file).toBe(row.sourceFile);
      if (row.verdict !== "Keep") expect(row.replacementQuestionVariantIds.length).toBeGreaterThan(0);
      for (const id of row.replacementQuestionVariantIds) expect(destinations.has(id), id).toBe(true);
    }
    expect(packet.assignment.concepts).toHaveLength(6);
    expect(packet.assignment.concepts.filter(c => c.registryOnly)).toHaveLength(3);
  });

  it("preserves exact assigned file bytes, approved questions and the accepted N2 question", () => {
    for (const input of packet.assignment.sourceHashes) {
      const actual = createHash("sha256").update(readFileSync(root + input.file)).digest("hex");
      expect(actual, input.file).toBe(input.currentSha256);
      expect(input.currentSha256).toBe(input.snapshotSha256);
    }
    expect(digest(ROW_043_CLINICAL_APPROVAL)).toBe(packet.assignment.exactHistoricalReferences.clinicalApprovalSha256);
    for (const question of ROW_043_QUESTION_VARIANTS) {
      const old = packet.before.find(x => x.variantId === question.id)!;
      expect(digest(question)).toBe(old.questions[0]!.sha256);
      expect(packet.audit.find(x => x.variantIds.includes(question.id))!.verdict).toBe("Keep");
    }
    const kept = QUESTION_NEW_N2_ROUND3_QUESTIONS.find(q => q.id === "question.n2.burn-feeding-perfusion-prerequisite.v3")!;
    expect(digest(kept)).toBe(packet.before.find(x => x.variantId === kept.id)!.questions[0]!.sha256);
    expect(packet.assignment.exactHistoricalReferences.editorialPass[0]!.verdict).toBe("PASS");
    expect(kept.reviewStatus).toBe("needs_clinician_review");
  });

  it("keeps the old release-scope hold and empty planning slots visible", () => {
    expect(packet.assignment.recordedHolds.map(h => h.id)).toEqual(["claim.n1r3.burn-release-scope"]);
    expect(packet.holdDispositions[0]!.oldDisposition).toContain("retained");
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(packet.withheldNewTeachingPoints).toHaveLength(6);
    expect(packet.ownerApprovalsNeeded.some(x => x.id.endsWith("hf-systemic"))).toBe(true);
  });

  it("materializes a schema-valid clinic preview with distinct nodes and fixed patient profiles", () => {
    expect(syntheticClinicalReleaseSchema.parse(preview).cases).toHaveLength(17);
    expect(questions).toHaveLength(18);
    expect(new Set(questions.map(q => q.id)).size).toBe(18);
    expect(new Set(cases.flatMap(c => c.decisionNodes.map(n => n.id))).size).toBe(18);
    expect(concepts).toHaveLength(17);
    expect(cases.filter(c => c.decisionNodes.length > 1)).toHaveLength(1);
    for (const c of cases) {
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.releasePointId).toBe("release.l0.clinic_evaluation");
      expect(c.rewardTierId).toBe("reward.clinic_basic");
      expect(c.patientDisplayName).not.toBe("{patientName}");
      expect(c.presentation).toContain("{patientName}");
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old`);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
    }
  });

  it("preserves histories and explicitly versions every changed clinical meaning", () => {
    expect(concepts.filter(c => c.conceptMeaning === "preserved")).toHaveLength(3);
    expect(concepts.filter(c => c.conceptMeaning === "new")).toHaveLength(8);
    const changed = concepts.filter(c => c.conceptMeaning === "changed");
    expect(changed).toHaveLength(6);
    expect(changed.every(c => c.previousConceptId && c.historyPolicy.includes("no FSRS transfer"))).toBe(true);
    expect(changed[0]!.previousConceptId).toBe("concept.burn.superficial-partial-thickness-recognition");
    expect(changed[0]!.historyPolicy).toContain("no FSRS transfer");
    expect(questions.filter(q => q.conceptId === "concept.burn.referral-consultation-selection")).toHaveLength(2);
    expect(questions.some(q => q.id === "question.n2.burn-feeding-perfusion-prerequisite.v3")).toBe(false);
  });

  it("binds each runtime node to its exact authored choices and enables shuffling", () => {
    for (const c of cases) for (const n of c.decisionNodes) {
      const q = questions.find(q => q.id === n.questionVariantId)!;
      expect(q.conceptId).toBe(n.primaryConceptId);
      expect(n.stem).toBe(q.stem);
      expect(n.explanation).toBe(q.explanation);
      expect(n.shuffleAnswers).toBe(true);
      expect(n.answerChoices.map(x => [x.id, x.label, x.isCorrect])).toEqual(q.answerChoices.map(x => [x.id, x.label, x.isCorrect]));
      expect([3, 4].includes(n.answerChoices.length) || (q.id === "question.topic.burns-inhalation.co-after-oxygen.v2" && n.answerChoices.length === 2)).toBe(true);
      expect(n.answerChoices.filter(x => x.isCorrect)).toHaveLength(1);
      expect(n.resultGateAfter).toBeNull();
      expect(n.answerChoices.every(x => x.serviceRequest === null)).toBe(true);
    }
  });

  it("maps every offered test, including distractors, by exact choice ID and label", () => {
    expect(timings).toHaveLength(18);
    for (const timing of timings) {
      answerChoiceTimingRegistryEntrySchema.parse(timing);
      const definition = flat.find(x => timing.questionVariantId.match(new RegExp("\\." + x.n.slug + "\\.v[12]$")))!.n;
      const q = questions.find(q => q.id === timing.questionVariantId)!;
      const offeredTests = definition.options.filter(x => x.timingProfileId);
      if (offeredTests.length) {
        expect(timing.classification.kind).toBe("test_choices");
        if (timing.classification.kind !== "test_choices") throw new Error("missing testing choices");
        expect(timing.classification.choices.map(x => [x.choiceId, x.choiceLabel])).toEqual(q.answerChoices.map(x => [x.id, x.label]));
        for (const choice of timing.classification.choices) if (choice.timing.kind === "test") {
          expect(getDiagnosticTimingRuleForProfile(choice.timing.timingProfileId), choice.choiceId).toBeDefined();
          expect(definition.options.find(x => choice.choiceId.endsWith("." + x.id))!.timingProfileId).toBe(choice.timing.timingProfileId);
        }
      } else expect(timing.classification.kind).toBe("no_test");
    }
    expect(orders).toHaveLength(54);
    expect(orders.every(x => x.executableOrderAdded === false && x.serviceRequest === null)).toBe(true);
  });

  it("resolves all clinical assertions through atoms and complete source metadata", () => {
    expect(ledger.sources).toEqual(sources);
    expect(ledger.claims).toEqual(claims);
    const knownClaims = new Set(claims.map(c => c.id));
    const knownSources = new Set(sources.map(s => s.id));
    for (const claim of claims) {
      expect(claim.sourceIds.length).toBeGreaterThan(0);
      for (const id of claim.sourceIds) expect(knownSources.has(id)).toBe(true);
      expect(claim.lastCheckedOn).toBe("2026-11-11");
      expect(claim.limitation).toBeTruthy();
      expect(ledger.claimToQuestionMappings.some(x => x.claimId === claim.id)).toBe(true);
    }
    for (const mapping of mappings) for (const assertion of mapping.clinicalAssertions) {
      expect(assertion.evidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of assertion.evidenceClaimIds) expect(knownClaims.has(id), id).toBe(true);
    }
    for (const q of questions) for (const id of q.supportingEvidenceClaimIds) expect(knownClaims.has(id)).toBe(true);
    for (const source of sources) {
      expect(source.completeCitation).toBeTruthy();
      expect(source.organizationOrJournal).toBeTruthy();
      expect(source.authors.length).toBeGreaterThan(0);
      expect(source.officialUrl).toMatch(/^https:\/\//);
      expect(source.accessedOn).toBe("2026-11-11");
      expect(source.licenseLabel).toBeTruthy();
      expect(source.reuseNotes).toBeTruthy();
      expect(source.authorityAssessment).toBeTruthy();
      expect(source.evidenceClaimIds.length).toBeGreaterThan(0);
    }
    expect(sources.some(s => s.officialUrl?.includes("ameriburn.org"))).toBe(false);
    expect(ledger.excludedSources.some(x => x.status === "excluded_from_new_evidence")).toBe(true);
  });

  it("keeps evidence, concepts, profiles and exact new questions clinically unapproved", () => {
    for (const record of [...questions, ...concepts, ...claims, ...sources, ...reviews, ...mappings, ...checks]) {
      expect(record.reviewStatus).toBe("needs_clinician_review");
      expect(record.lastClinicianReview).toBeNull();
    }
    expect(manifest.pipelinePassed).toBe(false);
    expect(manifest.managerAccepted).toBe(false);
    expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.publicReleaseAuthorized).toBe(false);
    expect(manifest.defaultReleaseModified).toBe(false);
    expect(manifest.networkDuringGameplay).toBe(false);
    for (const link of links) {
      expect(link.target).toBe("_blank");
      expect(link.rel).toBe("noopener noreferrer");
      expect(link.referrerPolicy).toBe("no-referrer");
    }
  });

  it("retains concrete manual gates, source mappings and later-node context", () => {
    expect(checks).toHaveLength(18);
    expect(mappings).toHaveLength(18);
    for (const check of checks) {
      expect(check.manualAuthorGate).toHaveLength(5);
      for (const gate of check.manualAuthorGate) expect(gate.record.length).toBeGreaterThan(40);
      expect(check.counterfactual.length).toBeGreaterThan(60);
      expect(check.deletionCheck.length).toBeGreaterThan(60);
      expect(check.fullVisibleSequenceCheck.length).toBeGreaterThan(40);
    }
    for (const c of definitions) if (c.nodes.length > 1) {
      expect(c.nodes[1]!.currentUpdate).toBeTruthy();
      expect(c.nodes[0]!.conceptId).not.toBe(c.nodes[1]!.conceptId);
      expect(reviews.find(r => r.caseId.endsWith(c.slug + ".v1"))!.selectionConstraint).toContain("Paired-only");
    }
    const co = revisedDefinitions.find(c => c.nodes[0]!.slug === "co-after-oxygen")!;
    expect(co.presentation).toContain("followed instructions normally");
    expect(co.nodes[0]!.currentUpdate).toContain("first formal short-term retention assessment");
    expect(co.nodes[0]!.currentUpdate).toContain("No comparable retention assessment was documented initially");
    expect(co.nodes[0]!.currentUpdate).not.toContain("still cannot retain");
    expect(co.nodes[0]!.options).toHaveLength(2);
    const airway = revisedDefinitions.find(c => c.nodes[0]!.slug === "lower-airway-assessment")!;
    expect(airway.nodes[0]!.currentUpdate).toContain("plateau remains 20");
    expect(airway.nodes[0]!.currentUpdate).not.toContain("team needs");
  });

  it("independently re-solves the specified fluid worksheet and both credible errors", () => {
    const dermalArea = 14 + 8;
    const remainingHours = 8 - 4;
    expect(Math.round(((3 * 70 * dermalArea) / 2 - 800) / remainingHours)).toBe(378);
    expect(Math.round(((3 * 70 * (dermalArea + 12)) / 2 - 800) / remainingHours)).toBe(693);
    expect(Math.round(((3 * 70 * dermalArea) / 2 - 800) / 8)).toBe(189);
    const q = questions.find(q => q.id.includes("resuscitation-clock-and-area"))!;
    expect(q.answerChoices.find(c => c.isCorrect)!.label).toContain("378");
  });

  it("keeps packet proposals exactly synchronized with normal explicit-import definitions", () => {
    expect(packet.proposals.map(p => p.id).sort()).toEqual(questions.map(q => q.id).sort());
    for (const proposal of packet.proposals) {
      expect(proposal.question).toEqual(questions.find(q => q.id === proposal.id));
      expect(proposal.nodeDefinition).toEqual(flat.find(x => proposal.id.match(new RegExp("\\." + x.n.slug + "\\.v[12]$")))!.n);
    }
    expect(packet.counts.newGapNodes).toBe(11);
    expect(packet.counts.proposedConsolidatedReplacementNodes).toBe(2);
    expect(packet.counts.proposedRewriteNodes).toBe(5);
  });
});
