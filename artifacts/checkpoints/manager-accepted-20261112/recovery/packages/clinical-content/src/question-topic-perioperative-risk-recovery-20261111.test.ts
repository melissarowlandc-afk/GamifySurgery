import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import packet from '../../../docs/research/question-topic-perioperative-risk-recovery-20261111.json';
import ledger from '../../../docs/research/sources-question-topic-perioperative-risk-recovery-20261111.json';
import program from '../../../docs/research/question-topic-program-20261111.json';
import { PROTOTYPE_BALANCE_RELEASE } from '../../balance-config/src/prototype-balance';
import { answerChoiceTimingRegistryEntrySchema, validateSyntheticClinicalRelease } from './schema';
import {
  PERIOPERATIVE_TOPIC_ACTIVE_DEFINITIONS as definitions, PERIOPERATIVE_TOPIC_AUTHOR_CHECKS as gates,
  PERIOPERATIVE_TOPIC_CASES as cases, PERIOPERATIVE_TOPIC_CASE_REVIEWS as reviews,
  PERIOPERATIVE_TOPIC_CLAIMS as claims, PERIOPERATIVE_TOPIC_CONCEPT_PROPOSALS as concepts,
  PERIOPERATIVE_TOPIC_IDS as ids, PERIOPERATIVE_TOPIC_MANIFEST as manifest,
  PERIOPERATIVE_TOPIC_ORDER_PROPOSALS as orders, PERIOPERATIVE_TOPIC_PARKED_ATTEMPTS as parked,
  PERIOPERATIVE_TOPIC_PREVIEW_RELEASE as preview, PERIOPERATIVE_TOPIC_QUESTIONS as questions,
  PERIOPERATIVE_TOPIC_REVIEW_DISPOSITIONS as dispositions,
  PERIOPERATIVE_TOPIC_SOURCE_LINKS as links, PERIOPERATIVE_TOPIC_STATEMENT_MAPPINGS as mappings,
  PERIOPERATIVE_TOPIC_TIMING_ENTRIES as timing, PERIOPERATIVE_TOPIC_UNKEYED_HOLDS as holds,
} from './question-topic-perioperative-risk-recovery-20261111';

const sha = (x: unknown) => createHash('sha256').update(typeof x === 'string' ? x : JSON.stringify(x)).digest('hex');
const root = fileURLToPath(new URL('../../../', import.meta.url));
const claimId = (s: string) => s.startsWith('claim.') ? s : `claim.perioperative-risk-recovery.${s}`;
const nodes = definitions.flatMap(c => c.nodes);

describe('perioperative-risk-recovery explicit-import authoring sidecar', () => {
  it('validates through the existing release representation without admission', () => {
    expect(validateSyntheticClinicalRelease(preview)).toEqual(preview);
    expect(preview.cases).toHaveLength(21);
    expect(questions).toHaveLength(21);
    expect(packet.proposals.questions).toEqual(questions);
    expect(packet.proposals.cases).toEqual(cases);
    expect(manifest).toMatchObject({ managerAccepted: false, independentPass: false, clinicalApproval: false, publicReleaseAuthorized: false, executableOrdersAdded: false, sharedFilesEdited: false });
  });

  it('reconciles every exact assigned variant and only the assigned primary topic', () => {
    const assigned = program.inventory.filter(r => r.primaryTopicSlug === 'perioperative-risk-recovery');
    expect(packet.assignment.inventory).toEqual(assigned);
    expect(assigned).toHaveLength(87);
    expect(packet.audit.map(r => r.inventoryRecordId).sort()).toEqual(assigned.map(r => r.recordId).sort());
    expect(new Set(packet.audit.map(r => r.inventoryRecordId)).size).toBe(87);
    for (const row of packet.audit) {
      expect(['Keep', 'Rewrite', 'Retire-and-replace']).toContain(row.verdict);
      expect(row.reasons.length).toBeGreaterThan(1);
      expect(row.beforeVersionSha256).toMatch(/^[a-f0-9]{64}$/);
      if (row.verdict !== 'Keep') expect(row.proposedQuestionVariantIds.length + row.parkedReplacementAttemptIds.length).toBeGreaterThan(0);
      for (const id of row.proposedQuestionVariantIds) expect(questions.some(q => q.id === id)).toBe(true);
    }
  });

  it('retains registry-only identities, withheld teaching and source holds separately', () => {
    expect(packet.assignment.concepts).toHaveLength(32);
    expect(packet.assignment.concepts.filter(c => c.registeredInDefaultRelease)).toHaveLength(25);
    expect(packet.assignment.unkeyedDraftSlots).toEqual([]);
    expect(packet.assignment.withheldTeachingPoints.map(x => x.recordId)).toEqual(['withheld.variety3.allergy-protocol']);
    expect(packet.holdLedger.some(x => x.id === 'claim.n2r3.extravasation-pulse-assessment')).toBe(true);
    expect(packet.holdLedger.some(x => x.id === 'F13-source-hold-20261105')).toBe(true);
  });

  it('keeps exact before question and context payloads hash-verifiable', () => {
    expect(packet.beforeVersions).toHaveLength(87);
    for (const b of packet.beforeVersions) {
      expect(b.question || b.capturedNode).toBeTruthy();
      if (b.question) expect(sha(b.question)).toBe(b.questionSha256);
      if (b.capturedNode) expect(sha(b.capturedNode)).toBe(b.capturedNodeSha256);
      expect(b.completeVisibleContexts.length + b.authoredBindings.length).toBeGreaterThan(0);
    }
  });

  it('verifies unchanged authored source inputs that the revision and freeze analysis depends on', () => {
    for (const input of packet.preservedInputHashes) {
      expect(sha(readFileSync(root + input.file, 'utf8')), input.file).toBe(input.sha256);
    }
    expect(packet.freezeReferences.some(x => x.reviewId === 'A25')).toBe(true);
    expect(packet.freezeReferences.some(x => x.reviewId === 'B2B21')).toBe(true);
    expect(packet.freezeReferences.every(x => x.newClinicalApprovalGranted === false)).toBe(true);
  });

  it('assigns unique namespaced case/node/question/choice identities', () => {
    for (const list of [cases.map(c => c.id), cases.flatMap(c => c.decisionNodes.map(n => n.id)), questions.map(q => q.id), questions.flatMap(q => q.answerChoices.map(c => c.id))]) {
      expect(new Set(list).size).toBe(list.length);
      expect(list.every(id => id.includes('topic.perioperative-risk-recovery.'))).toBe(true);
      expect(list.every(id => id.length <= 120)).toBe(true);
    }
  });

  it('keeps every new exact version clinically unapproved with one fixed constrained profile', () => {
    for (const q of questions) expect(q).toMatchObject({ reviewStatus: 'needs_clinician_review', aiAssistedDrafting: true, lastClinicianReview: null });
    for (const c of cases) {
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.presentation).toContain('{patientName}');
      expect(c.presentation).toContain(`${c.prototypeDemographics!.ageYears}-year-old`);
      expect(c.presentation).not.toMatch(/^A patient with/i);
    }
  });

  it('uses existing clinic settings for all hospital and recovery reviews', () => {
    for (const c of cases) {
      expect(c.requiredClinicalSetting).toBe('clinic');
      expect(c.requiredCapabilityIds).toEqual([]);
      expect(c.tutorialEligible).toBe(false);
    }
    for (const r of reviews) expect(r).toMatchObject({ acuity: 'stable', educationalTier: 1, earliestFacilityStage: 1, requiredClinicalSetting: 'clinic' });
    expect(reviews.some(r => r.historicalAcuity === 'obvious_emergency')).toBe(true);
    expect(reviews.some(r => r.encounterMode === 'outside_record_review_in_clinic')).toBe(true);
  });

  it('preserves runtime randomization and parallel keyed structures', () => {
    for (const c of cases) for (const n of c.decisionNodes) {
      expect(n.shuffleAnswers).toBe(true);
      expect(n.answerChoices.length).toBeGreaterThanOrEqual(3);
      expect(n.answerChoices.length).toBeLessThanOrEqual(4);
      expect(n.answerChoices.filter(x => x.isCorrect)).toHaveLength(1);
      expect(n.answerChoices.every(x => !!x.rationale)).toBe(true);
      expect(n.stem).toContain('{patientName}');
    }
    expect(packet.reviewDisplay).toBe('key shown first for review only.');
  });

  it('isolates pending repairs so no multipart case mixes review states', () => {
    expect(cases.filter(c => c.decisionNodes.length > 1)).toHaveLength(0);
    for (const c of cases) c.decisionNodes.forEach((n, index) => {
      if (index > 0) expect(n.currentUpdate?.length).toBeGreaterThan(30);
      if (index < c.decisionNodes.length - 1) expect(n.terminalDispositions).toEqual([]);
      expect(n.resultGateAfter).toBeNull();
      expect(n.answerChoices.every(x => x.serviceRequest === null)).toBe(true);
    });
  });

  it('maps every testing choice by exact identity and label using existing placeholder profiles', () => {
    const profiles = new Set(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.map(p => p.id));
    expect(timing).toHaveLength(questions.length);
    for (const c of definitions) for (const n of c.nodes) {
      const entry = timing.find(e => e.questionVariantId === ids.question(n.slug))!;
      expect(answerChoiceTimingRegistryEntrySchema.parse(entry)).toEqual(entry);
      if (n.choices.some(x => x.timingProfileId)) {
        expect(entry.classification.kind).toBe('test_choices');
        if (entry.classification.kind !== 'test_choices') throw new Error('Missing choice timing');
        expect(entry.classification.choices).toHaveLength(n.choices.length);
        for (const option of n.choices) {
          const mapping = entry.classification.choices.find(x => x.choiceId === ids.choice(n.slug, option.id))!;
          expect(mapping.choiceLabel).toBe(option.label);
          if (option.timingProfileId) {
            expect(profiles.has(option.timingProfileId)).toBe(true);
            expect(mapping.timing).toEqual({ kind: 'test', timingProfileId: option.timingProfileId });
          } else expect(mapping.timing).toEqual({ kind: 'no_test' });
        }
      } else expect(entry.classification).toEqual({ kind: 'no_test' });
    }
    expect(orders).toHaveLength(16);
    expect(orders.every(x => x.serviceRequest === null && x.resultGateAfter === null && x.disposition.kind === 'not_executed')).toBe(true);
  });

  it('gives all three awake-gas and both allergy testing alternatives wait metadata', () => {
    for (const slug of ['awake-ventilation-assessment', 'penicillin-delayed-boundary']) {
      const n = nodes.find(n => n.slug === slug)!;
      expect(n.choices.filter(c => c.timingProfileId)).toHaveLength(slug === 'awake-ventilation-assessment' ? 3 : 2);
    }
  });

  it('maps every node and every option to existing atomic claims', () => {
    const known = new Set(claims.map(c => c.id));
    for (const n of nodes) {
      const q = questions.find(q => q.id === ids.question(n.slug))!;
      expect(q.supportingEvidenceClaimIds.length).toBeGreaterThan(0);
      for (const c of q.supportingEvidenceClaimIds) expect(known.has(c), c).toBe(true);
      for (const option of n.choices) for (const c of option.claims.map(claimId)) expect(q.supportingEvidenceClaimIds).toContain(c);
      const mapping = mappings.find(m => m.questionVariantId === q.id)!;
      expect(mapping.fieldMappings).toHaveLength(n.choices.length + 2);
    }
  });

  it('keeps source-to-claim and claim-to-question mappings bidirectional', () => {
    for (const s of ledger.sources) {
      expect(s.completeCitation.length).toBeGreaterThan(25);
      expect(s.authorityAssessment).toBeTruthy();
      expect(s.reuseStatus).toBeTruthy();
      expect(s.officialUrl).toMatch(/^https:\/\//);
      for (const id of s.evidenceClaimIds) expect(claims.find(c => c.id === id)?.sourceIds).toContain(s.id);
    }
    for (const c of claims) {
      expect(c.reviewStatus).toBe('needs_clinician_review');
      expect(c.sourceIds.length).toBeGreaterThan(0);
      for (const id of c.sourceIds) expect(ledger.sources.find(s => s.id === id)?.evidenceClaimIds).toContain(c.id);
    }
    for (const q of questions) for (const id of q.supportingEvidenceClaimIds) {
      expect(ledger.claimToQuestionMappings.find(x => x.claimId === id)?.questionVariantIds).toContain(q.id);
    }
  });

  it('preserves original seroma access/check dates and excluded-source decisions', () => {
    expect(ledger.sources.find(s => s.id === 'source.sc.ucla-post-surgical-fluid')?.accessedOn).toBe('2026-09-10');
    expect(claims.find(c => c.id === 'claim.postoperative-seroma.uncomplicated-observation')?.lastCheckedOn).toBe('2026-09-10');
    expect(ledger.excludedSources.some(s => s.url.includes('nice.org.uk'))).toBe(true);
    expect(ledger.excludedSources.some(s => s.url.includes('acc.org'))).toBe(true);
  });

  it('records concrete author attacks, reasoning, boundaries and per-option counterfactuals', () => {
    expect(gates).toHaveLength(21);
    for (const g of gates) {
      for (const field of ['interpret', 'apply', 'decidingObservation', 'counterfactual', 'deletionTest', 'cueAttack', 'stageAudit', 'difficultyReason', 'sequenceAudit'] as const) expect(g[field].length).toBeGreaterThan(20);
      expect(g.independent).toBe(false);
      expect(g.clinicalApproval).toBe(false);
      expect(g.optionAudit.every(o => !!o.temptation && !!o.whyRankedHere && !!o.correctUnder)).toBe(true);
      const q = questions.find(q => q.id === g.questionVariantId)!;
      const n = nodes.find(n => ids.question(n.slug) === q.id)!;
      expect(q.answerChoices.some(c => c.id === ids.choice(n.slug, g.counterfactualChoice))).toBe(true);
    }
  });

  it('separates reused concepts and changed meaning without transferring history', () => {
    expect(concepts.filter(c => c.relation === 'reuse_existing_meaning')).toHaveLength(7);
    expect(concepts.filter(c => c.relation === 'new_version')).toHaveLength(7);
    expect(concepts.filter(c => c.relation === 'new_meaning')).toHaveLength(7);
    expect(concepts.every(c => c.historyMigration.startsWith('None.'))).toBe(true);
  });

  it('keeps seven failed repairs and both previous holds unkeyed outside scored supply', () => {
    expect(holds).toHaveLength(9);
    expect(holds[0]).toMatchObject({ activeQuestionVariantId: null, activeKeyChoiceId: null });
    expect(parked.every(c => c.nodes.every(n => n.key === null))).toBe(true);
    expect(questions.some(q => q.id.includes('mri-current-system'))).toBe(false);
    expect(questions.some(q => q.id.includes('delirium-danger-drug'))).toBe(false);
    expect(cases.some(c => c.id.includes('dangerous-delirium'))).toBe(false);
    for (const row of dispositions.filter(r => r.status === 'parked')) {
      expect(row.currentQuestionVariantId).toBeNull();
      expect(questions.some(q => q.id === row.attemptedQuestionVariantId)).toBe(false);
    }
  });

  it('pins the independent review and accounts for every returned item exactly once', () => {
    expect(sha(readFileSync(root + packet.revision1.reviewFile, 'utf8'))).toBe(packet.revision1.reviewSha256);
    expect(packet.proposals.reviewDispositions).toEqual(dispositions);
    expect(dispositions).toHaveLength(28);
    expect(dispositions.filter(r => r.status === 'pass-preserved')).toHaveLength(8);
    expect(dispositions.filter(r => r.status === 'revised')).toHaveLength(13);
    expect(dispositions.filter(r => r.status === 'parked')).toHaveLength(7);
    expect(dispositions.map(r => r.reviewedQuestionVariantId).sort()).toEqual(packet.revision1.reviewItems.map(r => r.id).sort());
    for (const r of dispositions) {
      expect(r.attemptCount).toBe(r.reviewVerdict === 'PASS' ? 0 : 1);
      expect(r.newIndependentPassGranted).toBe(false);
      if (r.status === 'revised') {
        expect(r.currentQuestionVariantId).toMatch(/\.v2$/);
        expect(questions.some(q => q.id === r.currentQuestionVariantId)).toBe(true);
      }
    }
  });

  it('preserves all eight exact PASS questions, runtime nodes and complete patient headers', () => {
    for (const r of dispositions.filter(r => r.status === 'pass-preserved')) {
      const q = questions.find(q => q.id === r.reviewedQuestionVariantId)!;
      const c = cases.find(c => c.decisionNodes.some(n => n.questionVariantId === q.id))!;
      const n = c.decisionNodes.find(n => n.questionVariantId === q.id)!;
      const header = Object.fromEntries(Object.entries(c).filter(([key]) => !['decisionNodes', 'learningSummary'].includes(key)));
      expect(sha(q), q.id).toBe(r.beforeQuestionSha256);
      expect(sha(n), q.id).toBe(r.beforeNodeSha256);
      expect(sha(header), q.id).toBe(r.beforeCaseHeaderSha256);
      expect(c.decisionNodes).toHaveLength(1);
    }
  });

  it('versions the four changed clinical objectives without migrating their reviewed history', () => {
    expect(packet.revision1.changedClinicalMeanings).toHaveLength(4);
    for (const change of packet.revision1.changedClinicalMeanings) {
      const q = questions.find(q => q.id === change.currentQuestionVariantId)!;
      const old = packet.revision1.beforeSubmission.questions.find(q => q.id === change.reviewedQuestionVariantId)!;
      expect(old.conceptId).toBe(change.oldConceptId);
      expect(q.conceptId).toBe(change.newConceptId);
      expect(q.conceptId).not.toBe(old.conceptId);
      expect(concepts.find(c => c.conceptId === q.conceptId)?.previousConceptId).toBe(old.conceptId);
    }
  });

  it('supplies safe external links and performs no runtime network/model retrieval', () => {
    for (const link of links) expect(link).toMatchObject({ target: '_blank', rel: 'noopener noreferrer', referrerPolicy: 'no-referrer' });
    const code = readFileSync(fileURLToPath(new URL('./question-topic-perioperative-risk-recovery-20261111.ts', import.meta.url)), 'utf8');
    expect(code).not.toMatch(/\bfetch\s*\(|XMLHttpRequest|openai\.responses|chat\.completions/);
  });
});
