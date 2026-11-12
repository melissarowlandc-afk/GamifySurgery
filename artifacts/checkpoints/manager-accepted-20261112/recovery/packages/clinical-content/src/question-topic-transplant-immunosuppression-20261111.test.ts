import {topicQuestionAcceptance, retainedTopicCase} from "./question-program-batch5-acceptance-test-support";
import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import program from "../../../docs/research/question-topic-program-20261111.json";
import packet from "../../../docs/research/question-topic-transplant-immunosuppression-20261111.json";
import ledger from "../../../docs/research/sources-question-topic-transplant-immunosuppression-20261111.json";
import independentReview from "../../../docs/research/question-topic-transplant-immunosuppression-review-20261111.json";
import { PROTOTYPE_BALANCE_RELEASE } from "../../balance-config/src/prototype-balance";
import { SYNTHETIC_CLINICAL_RELEASE } from "./synthetic-content";
import { QUESTION_BANK_BATCH2B_ROUND2_QUESTIONS } from "./question-bank-batch2b-round2-20261104";
import { QUESTION_NEW_N2_ROUND3_CASES, QUESTION_NEW_N2_ROUND3_QUESTIONS } from "./question-new-n2-round3-20261104";
import { QUESTION_FLAGS2_ROUND2_QUESTIONS } from "./question-flags2-round2-20261105";
import { answerChoiceTimingRegistryEntrySchema, syntheticClinicalCaseSchema, testedConceptSchema } from "./schema";
import {
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ITEMS as items,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASES as cases,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CASE_REVIEWS as caseReviews,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_QUESTIONS as questions,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CONCEPTS as concepts,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_CONCEPT_PROPOSALS as conceptProposals,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_TIMING_PROPOSALS as timings,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_ORDER_PROPOSALS as orders,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_SOURCE_LINKS as links,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_AUTHOR_GATES as gates,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_STATEMENT_MAPPINGS as mappings,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_COMPOSITION_PROPOSALS as compositions,
  TRANSPLANT_IMMUNOSUPPRESSION_TOPIC_MANIFEST as manifest,
} from "./question-topic-transplant-immunosuppression-20261111";

const canonical = (value: unknown): unknown => Array.isArray(value) ? value.map(canonical) : value && typeof value === "object"
  ? Object.fromEntries(Object.keys(value).sort().map(k => [k, canonical((value as Record<string, unknown>)[k])])) : value;
const digest = (value: unknown) => createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
const slug = "transplant-immunosuppression";
const specNodes = items.flatMap(c => c.nodes);
const round2 = packet.reviewRound2;
const reviewed = round2.baseline;
const passIds = new Set(independentReview.filter(r => r.verdict === "PASS").map(r => r.id));
const specQuestionId = (s: (typeof specNodes)[number]) => `question.topic.${slug}.${s.slug}.v${s.version ?? 1}`;
const scoredFields = <T extends { terminalDispositions: unknown }>(n: T) => {
  const { terminalDispositions: _composition, ...scored } = n;
  return scored;
};

describe("transplant-immunosuppression topic sidecar", () => {
  it("reconciles every exact assigned inventory row and all registered/history identities", () => {
    const assigned = program.inventory.filter(r => r.primaryTopicSlug === slug);
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(packet.audit.map(r => r.recordId).sort()).toEqual(assigned.map(r => r.recordId).sort());
    expect(new Set(packet.audit.map(r => r.recordId)).size).toBe(35);
    expect(packet.coverageHistory.map(c => c.conceptId).sort()).toEqual(program.concepts.filter(c => c.primaryTopicSlug === slug).map(c => c.conceptId).sort());
    expect(packet.coverageHistory).toHaveLength(16);
    expect(packet.coverageHistory.filter(c => c.registeredInDefaultRelease)).toHaveLength(11);
    expect(packet.audit.filter(a => a.currentLive)).toHaveLength(21);
  });

  it("assigns one verdict, a concrete reason and an authored target to every proposed change", () => {
    expect(packet.audit.filter(a => a.verdict === "Keep")).toHaveLength(3);
    expect(packet.audit.filter(a => a.verdict === "Rewrite")).toHaveLength(3);
    expect(packet.audit.filter(a => a.verdict === "Retire-and-replace")).toHaveLength(29);
    for (const a of packet.audit) {
      expect(a.reason.length).toBeGreaterThan(120);
      expect(a.beforeQuestionSha256).toMatch(/^[a-f0-9]{64}$/);
      expect(a.sourceFile.startsWith("packages/clinical-content/src/")).toBe(true);
      if (a.verdict !== "Keep") {
        expect(a.proposedVariantIds.length).toBeGreaterThan(0);
        expect(a.proposedVariantIds.every(id => reviewed.proposals.some(q => q.question.id === id))).toBe(true);
        const current = round2.activeReplacementMappings.find(m => m.recordId === a.recordId)!;
        expect(current.currentCandidates.map(c => c.reviewedVariantId)).toEqual(a.proposedVariantIds);
        for (const c of current.currentCandidates) {
          const status = round2.statuses.find(s => s.reviewedVariantId === c.reviewedVariantId)!;
          expect(c.status).toBe(status.status);
          expect(c.activeVariantId).toBe(status.activeVariantId);
          if (c.activeVariantId) expect(questions.some(q => q.id === c.activeVariantId)).toBe(true);
          else expect(c.status).toBe("parked");
        }
      }
    }
  });

  it("distinguishes 37 raw serializations from 35 visible contexts without losing either alias", () => {
    expect(packet.before.reduce((n, b) => n + b.rawNodeSerializations.length, 0)).toBe(37);
    expect(packet.before.reduce((n, b) => n + b.allRetainedContexts.length, 0)).toBe(35);
    for (const b of packet.before) {
      expect(new Set(b.rawNodeSerializations.map(n => n.canonicalNodeSha256)).size).toBe(1);
      expect(b.authoredVersions).toHaveLength(1);
      expect(digest(b.authoredVersions[0]!.question)).toBe(b.authoredVersions[0]!.sha256);
      expect(digest(b.allRetainedContexts[0]!.case)).toBe(b.allRetainedContexts[0]!.sha256);
    }
  });

  it("preserves all 21 exact live inputs without pinning concurrent unrelated release totals", () => {
    for (const before of packet.before.filter(b => b.liveCase !== null)) {
      const current = retainedTopicCase(before.liveCase!.id);
      expect(current, before.recordId).toBeDefined();
      expect(digest(current), before.recordId).toBe(before.liveSha256);
    }
  });

  it("preserves the exact accepted PASS, source-held PASS and retained G07 park", () => {
    const frozen = packet.assignment.frozenReferences;
    expect(frozen).toHaveLength(3);
    for (const freeze of frozen) {
      const pool = freeze.recordId === "inventory.f0e1e5b407894e36" ? QUESTION_BANK_BATCH2B_ROUND2_QUESTIONS
        : freeze.recordId === "inventory.03a0a7a9da9aec13" ? QUESTION_NEW_N2_ROUND3_QUESTIONS : QUESTION_FLAGS2_ROUND2_QUESTIONS;
      const q = pool.find(q => q.id === freeze.variantId)!;
      expect(digest(q), freeze.variantId).toBe(freeze.questionSha256);
      expect(freeze.clinicalApproval).toBe(false);
      expect(questions.some(q => q.id === freeze.variantId)).toBe(false);
      expect(packet.audit.find(a => a.recordId === freeze.recordId)!.verdict).toBe("Keep");
    }
    const held = frozen.find(f => f.recordId === "inventory.03a0a7a9da9aec13")!;
    const c = QUESTION_NEW_N2_ROUND3_CASES.find(c => c.id === "case.n2.tacrolimus-antibody-pathway-boundary.v1")!;
    expect(digest(c)).toBe(held.caseSha256);
    expect(held.status).toContain("not accepted");
  });

  it("keeps the four recorded holds, old drop proposal and new unkeyed slot separate from counts", () => {
    expect(packet.assignment.recordedHolds.map(h => h.id).sort()).toEqual([
      "claim.n2r3.preimplantation-specificity-assay", "flags2-G07",
      "review.n2.tacrolimus-antibody-pathway-boundary.v3", "review.n3.posttransplant-lesion-versus-viremia-response.v2",
    ].sort());
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints).toEqual([]);
    expect(packet.localUnkeyedDraftSlots).toHaveLength(1);
    expect(packet.localUnkeyedDraftSlots[0]!.key).toBeNull();
    expect(packet.audit.find(a => a.recordId === "inventory.93d1202962285533")!.verdict).toBe("Retire-and-replace");
  });

  it("uses supported clinic records with named consistent adults and one finite profile", () => {
    expect(cases).toHaveLength(18);
    expect(questions).toHaveLength(19);
    for (const [i, c] of cases.entries()) {
      expect(syntheticClinicalCaseSchema.parse(c)).toEqual(c);
      expect(c.requiredClinicalSetting).toBe("clinic");
      expect(c.earliestFacilityStage).toBe(0);
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.patientDisplayName).toBe(items[i]!.patientName);
      expect(c.presentation).toContain(`${items[i]!.age}-year-old`);
      expect(c.prototypeDemographics!.sexLabel).toBe(items[i]!.sex);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.presentation).toBe(c.presentation);
      for (const n of c.decisionNodes) expect(n.stem).toContain("{patientName}");
    }
  });

  it("uses unique identities, one key and randomized runtime choices in every exact item", () => {
    expect(new Set(cases.map(c => c.id)).size).toBe(cases.length);
    expect(new Set(questions.map(q => q.id)).size).toBe(19);
    expect(new Set(concepts.map(c => c.id)).size).toBe(18);
    for (const c of cases) for (const n of c.decisionNodes) {
      expect(n.shuffleAnswers).toBe(true);
      expect([3, 4]).toContain(n.answerChoices.length);
      expect(n.answerChoices.filter(a => a.isCorrect)).toHaveLength(1);
      const q = questions.find(q => q.id === n.questionVariantId)!;
      expect(n.answerChoices.map(a => [a.id, a.label, a.isCorrect])).toEqual(q.answerChoices.map(a => [a.id, a.label, a.isCorrect]));
    }
  });

  it("preserves stable meanings, versions four changed objectives and reuses the renal-biopsy meaning", () => {
    for (const c of concepts) expect(testedConceptSchema.parse(c)).toEqual(c);
    expect(conceptProposals.filter(c => c.conceptRelation === "reuse").map(c => c.id).sort()).toEqual([
      "concept.ptld.tissue-diagnosis-coordination",
      "concept.transplant.abo-versus-hla-and-pre-event-record.v1",
    ].sort());
    expect(conceptProposals.filter(c => c.conceptRelation === "new_meaning")).toHaveLength(16);
    const versioned = round2.statuses.filter(s => s.status === "revised" && s.currentConceptId?.endsWith(".v2"));
    expect(versioned.map(s => s.reviewedVariantId.split(".").at(-2)).sort()).toEqual([
      "cmv-severe-route", "post-transfusion-screen", "pregnancy-switch", "dgf-biopsy",
    ].sort());
    for (const s of versioned) {
      expect(s.previousConceptId).toBe(s.reviewedConceptId);
      expect(reviewed.conceptProposals.some(c => c.id === s.previousConceptId)).toBe(true);
      expect(concepts.some(c => c.id === s.previousConceptId)).toBe(false);
    }
    const exposure = specNodes.find(n => n.slug === "tac-high-exposure")!;
    expect(exposure.conceptId).toBe("concept.transplant-immunosuppression.renal-biopsy.v1");
    expect(exposure.previousConceptId).toBe("concept.transplant-immunosuppression.tac-high-exposure.v1");
    expect(questions.filter(q => q.conceptId === exposure.conceptId)).toHaveLength(2);
    expect(concepts.filter(c => c.id === exposure.conceptId)).toHaveLength(1);
    for (const c of conceptProposals) {
      expect(c.historyPolicy).toContain("No transfer");
      if (c.previousConceptId) expect(c.id).not.toBe(c.previousConceptId);
      expect(c.educationalTier).toBe(1);
      expect(c.patientAcuity).toBe("stable_outpatient_at_review");
      expect(c.recordedHospitalAcuity).toBe("node_specific_outside_record");
    }
  });

  it("maps every statement and every option to valid atomic claims and source records", () => {
    const claims = new Map(ledger.claims.map(c => [c.id, c]));
    const sources = new Set(ledger.sources.map(s => s.id));
    for (const q of questions) {
      const m = mappings.find(m => m.questionVariantId === q.id)!;
      expect(m.choiceMappings.map(a => a.choiceId)).toEqual(q.answerChoices.map(a => a.id));
      for (const id of q.supportingEvidenceClaimIds) expect(claims.has(id), id).toBe(true);
      for (const c of m.choiceMappings) {
        expect(c.rationale.length).toBeGreaterThan(30);
        expect(c.temptation.length).toBeGreaterThan(20);
        expect(c.reasonableWhen.length).toBeGreaterThan(30);
        for (const id of c.evidenceClaimIds) {
          expect(claims.has(id), id).toBe(true);
          expect(q.supportingEvidenceClaimIds).toContain(id);
        }
      }
      expect(ledger.questionClaimMappings.find(m => m.questionVariantId === q.id)!.claimIds).toEqual(q.supportingEvidenceClaimIds);
    }
    for (const c of ledger.claims) {
      expect(c.sourceIds.length).toBeGreaterThan(0);
      expect(c.limitation.length).toBeGreaterThan(20);
      for (const id of c.sourceIds) expect(sources.has(id)).toBe(true);
      const expected = questions.filter(q => q.supportingEvidenceClaimIds.includes(c.id)).map(q => q.id);
      expect(ledger.claimQuestionMappings.find(m => m.claimId === c.id)!.questionVariantIds).toEqual(expected);
    }
    for (const s of ledger.sources) expect([...s.evidenceClaimIds].sort()).toEqual(ledger.claims.filter(c => c.sourceIds.includes(s.id)).map(c => c.id).sort());
  });

  it("supplies exact wait mappings for all 31 testing or monitoring alternatives, including distractors", () => {
    const testing = new Set(["renal-biopsy", "bk-plasma-before-reduction", "bk-function-discordance", "tac-high-exposure", "tac-sample-validity",
      "ptld-discordant-tissue", "cmv-tissue-not-blood", "post-transfusion-screen", "abo-archive", "dgf-biopsy"]);
    const profileIds = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    expect(timings).toHaveLength(19);
    expect(orders).toHaveLength(31);
    for (const t of timings) {
      expect(answerChoiceTimingRegistryEntrySchema.parse(t)).toEqual(t);
      const n = cases.flatMap(c => c.decisionNodes).find(n => n.id === t.nodeId)!;
      const spec = specNodes.find(s => specQuestionId(s) === t.questionVariantId)!;
      if (testing.has(spec.slug)) {
        expect(t.classification.kind).toBe("test_choices");
        if (t.classification.kind === "test_choices") {
          expect(t.classification.choices.map(a => [a.choiceId, a.choiceLabel])).toEqual(n.answerChoices.map(a => [a.id, a.label]));
          for (const [index, c] of t.classification.choices.entries()) {
            const authoredTiming = spec.choices[index]!.timingProfileId;
            expect(c.timing.kind).toBe(authoredTiming ? "test" : "no_test");
            if (c.timing.kind === "test") {
              expect(c.timing.timingProfileId).toBe(authoredTiming);
              expect(profileIds.has(c.timing.timingProfileId)).toBe(true);
              expect(orders.some(o => o.caseId === t.caseId && o.nodeId === t.nodeId && o.questionVariantId === t.questionVariantId && o.choiceId === c.choiceId && o.choiceLabel === c.choiceLabel)).toBe(true);
            } else expect(orders.some(o => o.questionVariantId === t.questionVariantId && o.choiceId === c.choiceId)).toBe(false);
          }
        }
      } else expect(t.classification.kind).toBe("no_test");
    }
  });

  it("separates planned estimates from execution, gameplay retrieval and hospital treatment", () => {
    for (const c of cases) for (const n of c.decisionNodes) {
      expect(n.resultGateAfter).toBeNull();
      expect(n.answerChoices.every(a => a.serviceRequest === null)).toBe(true);
      expect(`${c.presentation} ${n.currentUpdate} ${n.stem}`).not.toMatch(/wait\s+\d+\s+(minutes|hours|days)/i);
    }
    expect(orders.every(o => o.status === "future_planned" && o.newExecutableServiceRequested === false)).toBe(true);
    expect(compositions.every(c => c.requiredClinicalSetting === "clinic" && c.clinicalFrame === "outside_hospital_chart_review_in_clinic")).toBe(true);
  });

  it("keeps new clinical content unapproved and records source rights separately from authority", () => {
    expect(caseReviews).toHaveLength(18);
    for (const r of [...questions, ...conceptProposals, ...caseReviews, ...ledger.sources, ...ledger.claims]) {
      expect(r.reviewStatus).toBe("needs_clinician_review");
      expect(r.lastClinicianReview).toBeNull();
      expect(r.aiAssistedDrafting).toBe(true);
    }
    for (const s of ledger.sources) {
      expect(s.completeCitation.length).toBeGreaterThan(70);
      expect(s.authors.length).toBeGreaterThan(0);
      expect(s.authorityAssessment.length).toBeGreaterThan(40);
      expect(s.licenseLabel.length).toBeGreaterThan(10);
      expect(new URL(s.officialUrl).protocol).toBe("https:");
    }
    const old = ledger.sources.find(s => s.id.endsWith("ptld-ast2019"))!;
    expect(old.accessedOn).toBe("2026-09-29");
    expect(old.localMappingCheckedOn).toBe("2026-11-11");
    expect(ledger.offlineClaimProvenance[0]!.originalLastCheckedOn).toBe("2026-09-29");
    expect(manifest.pipelinePassed).toBe(false);
    expect(manifest.publicReleaseAuthorized).toBe(false);
  });

  it("records concrete manual gates and balanced clinically distinct matrix components", () => {
    expect(gates).toHaveLength(19);
    for (const g of gates) {
      expect(g.independentPass).toBe(passIds.has(g.questionVariantId));
      expect(g.clinicalApproval).toBe(false);
      for (const s of [g.coverTheKey, g.sameStageAndCategory, ...g.twoConsequentialSteps, g.predictedResidentDifficulty.reason,
        g.singleBestAnswer.decidingObservation, g.singleBestAnswer.counterfactual, g.deletionTest, g.sequenceReview]) expect(s.length).toBeGreaterThan(25);
      expect(g.repairHistory.length).toBeGreaterThan(0);
    }
    for (const [slug, components] of [
      ["abo-archive", ["anti-A", "HLA", "preimplantation", "post-exchange"]],
      ["pregnancy-switch", ["azathioprine", "sirolimus", "reassess", "begin"]],
      ["post-transfusion-screen", ["Post-transfusion", "Pretransfusion", "intended-donor", "recipient lymphocyte"]],
      ["cmv-severe-route", ["Oral valganciclovir", "Intravenous ganciclovir", "treatment dosing", "prevention dosing"]],
    ] as const) {
      const item = specNodes.find(n => n.slug === slug)!;
      expect(item.choices).toHaveLength(4);
      for (const component of components) expect(item.choices.filter(c => c.label.includes(component)), `${slug}: ${component}`).toHaveLength(2);
    }
    expect(specNodes.some(n => n.slug === "donor-antigen-specificity")).toBe(false);
    expect(cases.find(c => c.decisionNodes.some(n => n.questionVariantId.endsWith("cellular-rescue.v1")))!.decisionNodes).toHaveLength(1);
  });

  it("matches exact review artifacts and preserves empty before fields for new meanings", () => {
    expect(packet.authoredCases).toEqual(cases);
    expect(packet.proposals.map(p => p.question)).toEqual(questions);
    expect(packet.proposals.filter(p => p.creationKind === "new")).toHaveLength(17);
    expect(packet.proposals.filter(p => p.creationKind === "Rewrite")).toHaveLength(2);
    for (const p of packet.proposals) {
      expect(p.reviewOrderLabel).toBe("key shown first for review only.");
      expect(p.keyFirstReviewChoices[0]!.isCorrect).toBe(true);
      expect(digest(p.question)).toBe(p.exactQuestionSha256);
      expect(p.timing).toEqual(timings.find(t => t.questionVariantId === p.question.id));
      expect(p.statementMapping).toEqual(mappings.find(t => t.questionVariantId === p.question.id));
      expect(p.orderProposals).toEqual(orders.filter(t => t.questionVariantId === p.question.id));
      if (p.creationKind === "new") expect(p.before).toEqual([]);
      else expect(p.before).toHaveLength(1);
    }
    expect(compositions.filter(c => c.selection === "paired_only")).toHaveLength(1);
    expect(compositions.every(c => c.selectionLimitation.includes("unseen or due"))).toBe(true);
    for (const l of links) expect([l.target, l.rel, l.referrerPolicy]).toEqual(["_blank", "noopener noreferrer", "no-referrer"]);
  });

  it("leaves every proposal outside the default release", () => {
    const live = new Set(SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(c => c.decisionNodes.map(n => n.questionVariantId)));
    for (const question of questions) expect(live.has(question.id)).toBe(topicQuestionAcceptance(question.id).live);
    expect(manifest.liveManifestEdited).toBe(false);
  });

  it("accounts for every independent review row and exactly one attempt per returned item", () => {
    expect(round2.reviewRows).toEqual(independentReview);
    expect(independentReview).toHaveLength(23);
    expect(passIds.size).toBe(8);
    expect(round2.statuses.map(s => s.reviewedVariantId).sort()).toEqual(independentReview.map(s => s.id).sort());
    expect(round2.statuses.filter(s => s.status === "pass-preserved")).toHaveLength(8);
    expect(round2.statuses.filter(s => s.status === "revised")).toHaveLength(11);
    expect(round2.statuses.filter(s => s.status === "parked")).toHaveLength(4);
    for (const s of round2.statuses) {
      expect(s.correctionAttempts).toBe(passIds.has(s.reviewedVariantId) ? 0 : 1);
      expect(s.clinicalApproval).toBe(false);
      if (s.status === "pass-preserved") expect(s.activeVariantId).toBe(s.reviewedVariantId);
      else if (s.status === "revised") {
        expect(s.activeVariantId).toBe(s.reviewedVariantId.replace(/\.v1$/, ".v2"));
        expect(s.needsIndependentReview).toBe(true);
        expect(questions.some(q => q.id === s.reviewedVariantId)).toBe(false);
      } else expect(s.activeVariantId).toBeNull();
    }
    expect(questions.map(q => q.id).sort()).toEqual(round2.statuses.flatMap(s => s.activeVariantId ? [s.activeVariantId] : []).sort());
    expect(reviewed.proposals).toHaveLength(23);
    for (const p of reviewed.proposals) {
      expect(digest(p.question)).toBe(p.exactQuestionSha256);
      const n = reviewed.authoredCases.flatMap(c => c.decisionNodes).find(n => n.id === p.nodeId)!;
      expect(digest(n)).toBe(p.exactNodeSha256);
    }
  });

  it("freezes all eight PASS questions, scored fields, case words and original specs", () => {
    expect(round2.passPreservation.map(s => s.questionVariantId).sort()).toEqual([...passIds].sort());
    let compositionOnlyAdditions = 0;
    for (const f of round2.passPreservation) {
      const q = questions.find(q => q.id === f.questionVariantId)!;
      const c = cases.find(c => c.id === f.caseId)!;
      const n = c.decisionNodes.find(n => n.questionVariantId === q.id)!;
      const oldCase = reviewed.authoredCases.find(c => c.id === f.caseId)!;
      const oldNode = oldCase.decisionNodes.find(n => n.questionVariantId === q.id)!;
      const { decisionNodes: _currentNodes, ...header } = c;
      const { decisionNodes: _oldNodes, ...oldHeader } = oldCase;
      expect(digest(q)).toBe(f.questionSha256);
      expect(digest(scoredFields(n))).toBe(f.scoredNodeSha256);
      expect(scoredFields(n)).toEqual(scoredFields(oldNode));
      expect(header).toEqual(oldHeader);
      expect(digest(header)).toBe(f.caseHeaderSha256);
      expect(digest(specNodes.find(s => specQuestionId(s) === q.id))).toBe(f.specSha256);
      if (n.terminalDispositions.length !== oldNode.terminalDispositions.length) {
        compositionOnlyAdditions++;
        expect(oldNode.terminalDispositions).toEqual([]);
        expect(n.id).toBe(c.decisionNodes.at(-1)!.id);
        for (const terminal of n.terminalDispositions) {
          expect(terminal.kind).toBe("no_terminal_outcome");
          if (terminal.kind === "no_terminal_outcome") {
            const a = n.answerChoices.find(a => a.id === terminal.answerChoiceId)!;
            expect(a.isCorrect).toBe(false);
            expect(terminal.clinicalRationale).toBe(a.rationale);
            expect(terminal.consequenceNarrative).toBe(a.rationale);
          }
        }
      } else expect(n.terminalDispositions).toEqual(oldNode.terminalDispositions);
    }
    expect(compositionOnlyAdditions).toBe(4);
  });

  it("ends every multipart case with only exact PASS scored nodes and isolates every correction", () => {
    const multipart = cases.filter(c => c.decisionNodes.length > 1);
    expect(multipart).toHaveLength(1);
    expect(multipart[0]!.decisionNodes.map(n => n.questionVariantId)).toEqual([
      "question.topic.transplant-immunosuppression.bk-plasma-before-reduction.v1",
      "question.topic.transplant-immunosuppression.bk-biopsy-reduction.v1",
    ]);
    for (const c of multipart) {
      expect(c.decisionNodes.every(n => passIds.has(n.questionVariantId))).toBe(true);
      expect(compositions.find(p => p.caseId === c.id)!.allScoredNodesIndependentlyPass).toBe(true);
    }
    for (const s of round2.statuses.filter(s => s.status === "revised")) {
      const c = cases.find(c => c.decisionNodes.some(n => n.questionVariantId === s.activeVariantId))!;
      expect(c.decisionNodes).toHaveLength(1);
      expect(compositions.find(p => p.caseId === c.id)!.independentReviewPending).toBe(true);
    }
  });

  it("parks four unsupported repairs without a new key or executable remnant", () => {
    expect(round2.parkedAttempts).toHaveLength(4);
    expect(round2.parkedAttempts.map(p => p.reviewedVariantId.split(".").at(-2)).sort()).toEqual([
      "ptld-reduce-is", "donor-antigen-specificity", "mtor-open-wound", "hyperacute-review",
    ].sort());
    for (const p of round2.parkedAttempts) {
      expect(p.attemptNumber).toBe(1);
      expect(p.candidateKey).toBeNull();
      expect(p.scored).toBe(false);
      expect(p.reason.length).toBeGreaterThan(150);
      expect(p.attemptedPlans.length).toBeGreaterThanOrEqual(3);
      expect(questions.some(q => q.id === p.reviewedVariantId)).toBe(false);
      expect(questions.some(q => q.id === p.reviewedVariantId.replace(/\.v1$/, ".v2"))).toBe(false);
      expect(reviewed.proposals.some(q => q.question.id === p.reviewedVariantId)).toBe(true);
    }
    for (const c of caseReviews) for (const id of c.evidenceClaimIds) expect(ledger.claims.some(claim => claim.id === id)).toBe(true);
    expect(ledger.sources).toHaveLength(16);
    expect(ledger.claims).toHaveLength(51);
  });
});
