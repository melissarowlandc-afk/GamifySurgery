import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import {
  NUTRITION_TOPIC_ACTIVE_DEFINITIONS as definitions, NUTRITION_TOPIC_CASES as cases,
  NUTRITION_TOPIC_QUESTIONS as questions, NUTRITION_TOPIC_CONCEPTS as concepts,
  NUTRITION_TOPIC_CLAIMS as claims, NUTRITION_TOPIC_SOURCES as sources,
  NUTRITION_TOPIC_AUTHOR_CHECKS as gates, NUTRITION_TOPIC_TIMING_ENTRIES as timing,
  NUTRITION_TOPIC_ORDER_PROPOSALS as orders, NUTRITION_TOPIC_STATEMENT_MAPPINGS as statements,
  NUTRITION_TOPIC_SOURCE_LINKS as links, NUTRITION_TOPIC_UNKEYED_HOLDS as unkeyed,
  NUTRITION_TOPIC_PARKED_ATTEMPTS as parked, NUTRITION_TOPIC_PARKED_AUTHOR_CHECKS as parkedGates,
  NUTRITION_TOPIC_PREVIEW_RELEASE as preview, NUTRITION_TOPIC_MANIFEST as manifest,
  NUTRITION_TOPIC_CURRENT_ITEM_STATUS as statuses, NUTRITION_TOPIC_ROUND2_ATTEMPTS as attempts,
  NUTRITION_TOPIC_V1_QUESTIONS as archivedQuestions, NUTRITION_TOPIC_V1_CASES as archivedCases,
  NUTRITION_TOPIC_V1_PARKED_ATTEMPTS as firstRoundFailedAttempts,
  NUTRITION_TOPIC_CONCEPT_PROPOSALS as conceptProposals,
} from './question-topic-nutrition-support-metabolism-20261111';
import type { QuestionVariant } from './pilot-schema';
import type { SyntheticClinicalCase } from './schema';
import { DIAGNOSTIC_PROFILE_TIMING_MAPPINGS } from '../../balance-config/src/diagnostic-timing';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const readJson = (path: string) => JSON.parse(readFileSync(root + '/' + path, 'utf8'));
const packet = readJson('docs/research/question-topic-nutrition-support-metabolism-20261111.json');
const ledger = readJson('docs/research/sources-question-topic-nutrition-support-metabolism-20261111.json');
const program = readJson('docs/research/question-topic-program-20261111.json');
const response = packet.reviewResponseRound2;
const digest = (x: unknown) => createHash('sha256').update(JSON.stringify(x)).digest('hex');
const visible = (q: QuestionVariant, list: SyntheticClinicalCase[]) => {
  const c = list.find(c => c.decisionNodes.some(n => n.questionVariantId === q.id))!;
  const n = c.decisionNodes.find(n => n.questionVariantId === q.id)!;
  return { question: q, patientDisplayName: c.patientDisplayName, patientPresentationVariantId: c.patientPresentationVariantId,
    prototypeDemographics: c.prototypeDemographics, chiefComplaint: c.chiefComplaint, presentation: c.presentation, profiles: c.approvedInstantiationProfiles,
    node: { id: n.id, questionVariantId: n.questionVariantId, primaryConceptId: n.primaryConceptId, stem: n.stem,
      currentUpdate: n.currentUpdate ?? null, exhibit: n.exhibit ?? null, answerChoices: n.answerChoices,
      shuffleAnswers: n.shuffleAnswers, explanation: n.explanation, resultGateAfter: n.resultGateAfter } };
};
const active = statuses.filter(i => i.status !== 'parked');
const pass = statuses.filter(i => i.status === 'pass-preserved');

describe('nutrition independent-review response', () => {
  it('reconciles all 23 review decisions with exactly one attempt for every returned item', () => {
    const raw = readFileSync(root + '/' + response.reviewFile, 'utf8');
    expect(createHash('sha256').update(raw).digest('hex')).toBe(response.reviewFileSha256);
    expect(statuses).toHaveLength(23);
    expect(pass).toHaveLength(6);
    expect(statuses.filter(i => i.status === 'revised')).toHaveLength(11);
    expect(statuses.filter(i => i.status === 'parked')).toHaveLength(6);
    expect(attempts).toHaveLength(17);
    expect(response.items).toEqual(statuses);
    for (const review of response.review) {
      const item = statuses.find(i => i.reviewedQuestionVariantId === review.id)!;
      expect(item.independentReviewVerdict).toBe(review.verdict);
      expect(item.attemptCount).toBe(review.verdict === 'PASS' ? 0 : 1);
      const row = packet.reviewPacket.find((r: { reviewedVersion: string }) => r.reviewedVersion === review.id);
      expect(row.status).toBe(item.status);
      for (const field of ['clarity', 'cues', 'fairness', 'suggestions']) expect(row.response[field].length).toBeGreaterThan(12);
      if (item.status === 'revised') {
        expect(item.activeQuestionVariantId).toMatch(/\.v2$/);
        expect(item.independentStatus).toBe('not_reviewed');
        expect(row.newIndependentReviewRequired).toBe(true);
      }
    }
  });

  it('retains the entire original reviewed batch and both prior failed attempts as history', () => {
    expect(archivedQuestions).toEqual(response.baseline.questions);
    expect(archivedCases).toEqual(response.baseline.cases);
    expect(archivedQuestions).toHaveLength(23);
    expect(firstRoundFailedAttempts).toHaveLength(2);
    expect(response.initialPacket).toHaveLength(23);
  });

  it.each(pass.map(i => [i.slug, i]))('preserves the exact PASS question and visible context: %s', (_slug, item) => {
    const q = questions.find(q => q.id === item.activeQuestionVariantId)!;
    const before = archivedQuestions.find(q => q.id === item.reviewedQuestionVariantId)!;
    expect(q).toEqual(before);
    expect(digest(q)).toBe(item.passQuestionSha256);
    expect(visible(q, cases)).toEqual(visible(before, archivedCases));
    const proof = response.passPreservation.find((p: { questionVariantId: string }) => p.questionVariantId === q.id);
    expect(proof.beforeVisibleContextSha256).toBe(digest(visible(before, archivedCases)));
    expect(proof.afterVisibleContextSha256).toBe(proof.beforeVisibleContextSha256);
  });

  it('uses standalone cases so no scored multipart contains an unresolved companion', () => {
    expect(cases).toHaveLength(17);
    expect(questions).toHaveLength(17);
    expect(preview.cases).toEqual(cases);
    expect(new Set(questions.map(q => q.id)).size).toBe(17);
    expect(new Set(concepts.map(c => c.id)).size).toBe(17);
    for (const c of cases) {
      expect(c.decisionNodes).toHaveLength(1);
      const qid = c.decisionNodes[0]!.questionVariantId;
      const item = active.find(i => i.activeQuestionVariantId === qid)!;
      expect(c.id).toBe(item.activeCaseId);
      if (item.status === 'pass-preserved' && item.activeCaseId !== item.reviewedCaseId) expect(c.id).toContain('r2-preserved-');
    }
    expect(response.passPreservation.filter((x: { splitStandalone: boolean }) => x.splitStandalone)).toHaveLength(3);
    expect(response.renalFormulaPassLimitation).toContain('does not independently discriminate');
  });

  it('excludes all six parked keys and all returned v1 questions from scored supply', () => {
    expect(unkeyed).toHaveLength(6);
    expect(parked).toHaveLength(6);
    expect(parkedGates).toHaveLength(6);
    for (const i of statuses.filter(i => i.status !== 'pass-preserved')) expect(questions.some(q => q.id === i.reviewedQuestionVariantId)).toBe(false);
    for (const h of unkeyed) {
      expect(h.activeQuestionVariantId).toBeNull();
      expect(h.activeKeyChoiceId).toBeNull();
      expect(h.reason.length).toBeGreaterThan(80);
      expect(questions.some(q => q.id === h.attemptedQuestionVariantId)).toBe(false);
      expect(cases.some(c => c.decisionNodes.some(n => n.questionVariantId === h.attemptedQuestionVariantId))).toBe(false);
    }
    for (const c of parked) {
      expect(c.nodes[0]!.key).toBe('');
      const g = parkedGates.find(g => g.questionVariantId.includes('.' + c.nodes[0]!.slug + '.'))!;
      expect(g.optionAudit.filter(o => o.isKey)).toHaveLength(0);
      expect(g.authorVerdict).toBe('PARKED_UNRESOLVED_FAIRNESS_OR_EVIDENCE');
    }
  });

  it('keeps seventeen active drafts unapproved, randomized and inside clinic capability', () => {
    expect(manifest.independentPass).toBe(false);
    expect(manifest.clinicalApproval).toBe(false);
    expect(manifest.publicReleaseAuthorized).toBe(false);
    for (const c of cases) {
      expect(c.requiredClinicalSetting).toBe('clinic');
      expect(c.prototypeDemographics?.ageYears).toBeGreaterThan(18);
      expect(c.patientDisplayName.split(' ').length).toBeGreaterThan(1);
      expect(c.chiefComplaint?.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.presentation).toContain('{patientName}');
      expect(c.presentation).toContain('clinic');
      for (const n of c.decisionNodes) {
        expect(n.shuffleAnswers).toBe(true);
        expect(n.answerChoices.filter(c => c.isCorrect)).toHaveLength(1);
        expect(n.answerChoices.length).toBeGreaterThanOrEqual(3);
        expect(n.answerChoices.length).toBeLessThanOrEqual(4);
        expect(n.answerChoices.every(c => c.serviceRequest === null)).toBe(true);
        expect(n.resultGateAfter).toBeNull();
      }
    }
    for (const q of questions) {
      expect(q.reviewStatus).toBe('needs_clinician_review');
      expect(q.lastClinicianReview).toBeNull();
    }
  });

  it('reconciles all 63 assigned inventory rows while deferring parked replacement proposals', () => {
    const assigned = program.inventory.filter((r: { primaryTopicSlug: string }) => r.primaryTopicSlug === manifest.topicSlug);
    expect(assigned).toHaveLength(63);
    expect(packet.audit.map((r: { inventoryRecordId: string }) => r.inventoryRecordId).sort())
      .toEqual(assigned.map((r: { recordId: string }) => r.recordId).sort());
    for (const row of packet.audit) {
      expect(['Keep', 'Rewrite', 'Retire-and-replace']).toContain(row.verdict);
      const before = packet.currentInputs.find((r: { recordId: string }) => r.recordId === row.inventoryRecordId);
      expect(row.beforeQuestionSha256).toBe(digest(before.before.question));
      if (before.before.node) expect(row.beforeNodeSha256).toBe(digest(before.before.node));
      expect(row.reasons.length).toBeGreaterThan(1);
      for (const id of row.proposedQuestionVariantIds) expect(questions.some(q => q.id === id)).toBe(true);
      if (row.verdict !== 'Keep' && row.proposedQuestionVariantIds.length === 0) {
        expect(row.integrationDisposition).toContain('DEFERRED');
        expect(row.round2Dispositions.every((x: { status: string }) => x.status === 'parked')).toBe(true);
      }
    }
    expect(packet.audit.filter((r: { verdict: string }) => r.verdict === 'Keep')).toHaveLength(11);
    expect(packet.audit.filter((r: { verdict: string }) => r.verdict === 'Rewrite')).toHaveLength(12);
    expect(packet.audit.filter((r: { verdict: string }) => r.verdict === 'Retire-and-replace')).toHaveLength(40);
    expect(packet.audit.filter((r: { preservationRequired: boolean }) => r.preservationRequired)).toHaveLength(11);
    expect(packet.currentInputs.filter((r: { before: { question: { reviewStatus: string } } }) => r.before.question.reviewStatus === 'clinically_approved')).toHaveLength(6);
    expect(packet.assignment.recordedHolds).toHaveLength(8);
    expect(packet.ownerApprovalsNeeded.some((q: { inheritedHoldIds: string[] }) => q.inheritedHoldIds.includes('review.n3.swallowing-failure-versus-intestinal-failure.v2'))).toBe(true);
  });

  it('uses explicit new concept versions only for material scored-objective changes', () => {
    const changed = conceptProposals.filter(c => c.previousConceptId);
    expect(changed).toHaveLength(2);
    expect(changed.map(c => c.conceptId).sort()).toEqual([
      'concept.nutrition-support-metabolism.acute-kidney-injury-initial-protein.v2',
      'concept.nutrition-support-metabolism.ascorbate-deficiency-route.v2',
    ]);
    for (const c of changed) {
      expect(c.relation).toBe('new_version');
      expect(c.reason.length).toBeGreaterThan(80);
      expect(archivedQuestions.some(q => q.conceptId === c.previousConceptId)).toBe(true);
      expect(questions.some(q => q.conceptId === c.previousConceptId)).toBe(false);
    }
  });

  it('maps every active and parked statement to real atomic claims and complete sources', () => {
    expect(sources).toHaveLength(17);
    expect(claims).toHaveLength(54);
    const sourceIds = new Set(sources.map(s => s.id));
    const claimIds = new Set(claims.map(c => c.id));
    for (const q of questions) {
      expect(q.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const id of q.supportingEvidenceClaimIds) expect(claimIds.has(id)).toBe(true);
      expect(ledger.claimQuestionMappings.some((m: { questionVariantId: string }) => m.questionVariantId === q.id)).toBe(true);
      expect(statements.some(m => m.questionVariantId === q.id)).toBe(true);
    }
    for (const c of claims) {
      expect(c.reviewStatus).toBe('needs_clinician_review');
      expect(c.lastCheckedOn).toBe('2026-11-11');
      for (const sourceId of c.sourceIds) {
        expect(sourceIds.has(sourceId)).toBe(true);
        expect(sources.find(s => s.id === sourceId)?.evidenceClaimIds).toContain(c.id);
      }
    }
    for (const d of [...definitions, ...parked]) for (const n of d.nodes) for (const option of n.choices) {
      for (const id of option.claims) expect(claimIds.has('claim.' + manifest.topicSlug + '.' + id)).toBe(true);
    }
    for (const s of sources) {
      expect(s.completeCitation.length).toBeGreaterThan(25);
      expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(s.authorityAssessment.length).toBeGreaterThan(20);
      expect(s.reuseNotes.length).toBeGreaterThan(20);
      expect(s.accessedOn).toBe('2026-11-11');
    }
    for (const m of [...statements, ...ledger.parkedStatementMappings]) for (const field of m.fieldMappings) for (const id of field.claimIds) expect(claimIds.has(id)).toBe(true);
    expect(ledger.parkedClaimQuestionMappings).toHaveLength(6);
    expect(ledger.sourceTextStored).toBe(false);
  });

  it('binds every testing option to its exact current label and placeholder timing profile', () => {
    const profiles = new Set(Object.keys(DIAGNOSTIC_PROFILE_TIMING_MAPPINGS));
    expect(timing).toHaveLength(questions.length);
    for (const d of definitions) for (const n of d.nodes) {
      const item = active.find(i => i.slug === n.slug)!;
      const c = cases.find(c => c.id === item.activeCaseId)!;
      const node = c.decisionNodes[0]!;
      const entry = timing.find(t => t.questionVariantId === item.activeQuestionVariantId)!;
      expect(entry.caseId).toBe(c.id);
      expect(entry.nodeId).toBe(node.id);
      for (const option of n.choices.filter(x => x.timingProfileId)) {
        expect(entry.classification.kind).toBe('test_choices');
        if (entry.classification.kind !== 'test_choices') throw new Error('Missing testing classification');
        const id = node.answerChoices.find(x => x.label === option.label)!.id;
        const mapped = entry.classification.choices.find(x => x.choiceId === id)!;
        expect(mapped.choiceLabel).toBe(option.label);
        expect(mapped.timing).toEqual({ kind: 'test', timingProfileId: option.timingProfileId });
        expect(profiles.has(option.timingProfileId!)).toBe(true);
        const order = orders.find(x => x.choiceId === id)!;
        expect(order.disposition).toEqual({ kind: 'not_executed', reason: 'future_planned' });
        expect(order.serviceRequest).toBeNull();
      }
    }
  });

  it.each(questions.map(q => [q.id]))('retains concrete manual author attacks for %s', id => {
    const g = gates.find(g => g.questionVariantId === id)!;
    expect(g.independent).toBe(false);
    expect(g.clinicalApproval).toBe(false);
    for (const text of [g.interpret, g.apply, g.decidingObservation, g.counterfactual, g.deletionTest, g.cueAttack, g.stageAudit, g.difficultyReason, g.sequenceAudit]) expect(text.length).toBeGreaterThan(25);
    const item = active.find(i => i.activeQuestionVariantId === id)!;
    const def = definitions.flatMap(c => c.nodes).find(n => n.slug === item.slug)!;
    expect(def.choices.some(c => c.id === g.closestChoice && c.id !== def.key)).toBe(true);
    expect(def.choices.some(c => c.id === g.counterfactualChoice && c.id !== def.key)).toBe(true);
    expect(def.choices.every(c => c.temptation.length > 10 && c.correctUnder.length > 20)).toBe(true);
    expect(g.optionAudit).toHaveLength(def.choices.length);
  });

  it('keeps safe clinical links and all assembly/registries outside the worker lane', () => {
    for (const l of links) {
      expect(l.target).toBe('_blank');
      expect(l.rel).toBe('noopener noreferrer');
      expect(l.referrerPolicy).toBe('no-referrer');
    }
    for (const path of ['packages/clinical-content/src/index.ts', 'packages/clinical-content/src/synthetic-content.ts']) expect(readFileSync(root + '/' + path, 'utf8')).not.toContain('question-topic-nutrition-support-metabolism-20261111');
    expect(manifest.executableOrdersAdded).toBe(false);
  });
});
