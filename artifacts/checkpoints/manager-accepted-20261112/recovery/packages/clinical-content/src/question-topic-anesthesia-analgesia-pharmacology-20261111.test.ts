import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { answerChoiceTimingRegistryEntrySchema, validateSyntheticClinicalRelease } from './schema';
import {
  ANESTHESIA_TOPIC_ASSIGNMENT as assignment,
  ANESTHESIA_TOPIC_AUDIT as audit,
  ANESTHESIA_TOPIC_AUTHOR_CHECKS as checks,
  ANESTHESIA_TOPIC_AUTHORING_CONCEPTS as concepts,
  ANESTHESIA_TOPIC_BEFORE_SNAPSHOTS as before,
  ANESTHESIA_TOPIC_CASES as cases,
  ANESTHESIA_TOPIC_CASE_REVIEWS as reviews,
  ANESTHESIA_TOPIC_CLAIMS as claims,
  ANESTHESIA_TOPIC_DEFINITIONS as definitions,
  ANESTHESIA_TOPIC_DISCOVERED_HOLDS as holds,
  ANESTHESIA_TOPIC_FROZEN_REFERENCES as frozen,
  ANESTHESIA_TOPIC_MANIFEST as manifest,
  ANESTHESIA_TOPIC_ORDER_PROPOSALS as orders,
  ANESTHESIA_TOPIC_PREVIEW_RELEASE as preview,
  ANESTHESIA_TOPIC_REVIEW_REVISION as revision,
  ANESTHESIA_TOPIC_REVIEW_DISPOSITIONS as dispositions,
  ANESTHESIA_TOPIC_PARKED_ATTEMPTS as parked,
  ANESTHESIA_TOPIC_COMPOSITION_PROPOSALS as compositions,
  ANESTHESIA_TOPIC_QUESTIONS as questions,
  ANESTHESIA_TOPIC_SOURCES as sources,
  ANESTHESIA_TOPIC_SOURCE_LINKS as links,
  ANESTHESIA_TOPIC_STATEMENT_MAPPINGS as mappings,
  ANESTHESIA_TOPIC_TIMING_ENTRIES as timing,
  ANESTHESIA_TOPIC_WITHDRAWN_ATTEMPTS as withdrawn,
} from './question-topic-anesthesia-analgesia-pharmacology-20261111';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const digest = (v: unknown) => createHash('sha256').update(JSON.stringify(v)).digest('hex');
const sourceDigest = (file: string) => createHash('sha256').update(readFileSync(join(root, file))).digest('hex');
const reviewedDefinitions = revision.originalProposedCases as unknown as typeof definitions;

describe('anesthesia topic explicit-import authoring sidecar', () => {
  it('validates the actual existing runtime representation for the entire preview', () => {
    const result = validateSyntheticClinicalRelease(preview);
    expect(result.cases).toHaveLength(15);
    expect(result.cases.flatMap(c => c.decisionNodes)).toHaveLength(15);
    expect(result.concepts).toHaveLength(14);
    expect(manifest).toMatchObject({ pipelinePassed: false, clinicalApproval: false,
      managerAccepted: false, publicReleaseAuthorized: false, executableOrdersAdded: false });
  });

  it('reconciles every primary exact inventory identity and context disposition', () => {
    expect(assignment.inventory).toHaveLength(87);
    expect(new Set(assignment.inventory.flatMap(x => x.variantIds)).size).toBe(87);
    expect(audit.map(x => x.inventoryRecordId).sort()).toEqual(assignment.inventory.map(x => x.recordId).sort());
    expect(audit.filter(x => x.verdict === 'Keep')).toHaveLength(6);
    expect(audit.filter(x => x.verdict === 'Rewrite')).toHaveLength(12);
    expect(audit.filter(x => x.verdict === 'Retire-and-replace')).toHaveLength(69);
    expect(audit.filter(x => x.currentDefaultExactBinding)).toHaveLength(53);
    expect(audit.filter(x => x.unassembledBindingLimitation)).toHaveLength(5);
    for (const a of audit) {
      const assigned = assignment.inventory.find(r => r.recordId === a.inventoryRecordId)!;
      expect(a.variantIds).toEqual(assigned.variantIds);
      expect(a.nodeIds).toEqual(assigned.nodeIds);
      expect(a.conceptId).toBe(assigned.conceptId);
      expect(a.reasons.join(' ').length).toBeGreaterThan(80);
      expect(a.sourceFile).toBe(assigned.fileLocation.file);
      expect(a.exportLocator).toContain(assigned.fileLocation.export);
      if (a.verdict !== 'Keep') {
        expect(revision.originalArtifacts.ANESTHESIA_TOPIC_QUESTIONS.some(q => q.id === a.proposedReplacementQuestionVariantId)).toBe(true);
        if (a.currentReplacementQuestionVariantId) expect(questions.some(q => q.id === a.currentReplacementQuestionVariantId)).toBe(true);
        else expect(a.replacementReviewStatus).toBe('parked');
        expect(a.integrationRetirementAuthorized).toBe(false);
      }
    }
  });

  it('preserves exact captured before objects and all distinct serialized contexts', () => {
    expect(before).toHaveLength(87);
    for (const snapshot of before) {
      for (const c of snapshot.materializedContexts) expect(digest(c.case)).toBe(c.caseSha256);
      for (const q of snapshot.authoredDefinitions) expect(digest(q.question)).toBe(q.questionSha256);
      if (snapshot.defaultReleaseCase) expect(digest(snapshot.defaultReleaseCase)).toBe(snapshot.defaultReleaseCaseSha256);
      const a = audit.find(a => a.inventoryRecordId === snapshot.inventoryRecordId)!;
      expect(a.visibleContextAudit).toHaveLength(snapshot.materializedContexts.length);
      expect(a.beforeVersionHashes.cases).toEqual(snapshot.materializedContexts.map(x => x.caseSha256));
    }
  });

  it('rechecks all 41 assigned definition files without asserting shared manifest stability', () => {
    const hashes = assignment.baseline.inputHashes.filter(h => h.matches);
    expect(hashes).toHaveLength(41);
    for (const h of hashes) expect(sourceDigest(h.file), h.file).toBe(h.currentSha256);
    for (const h of assignment.baseline.additionalProtectedInputs) expect(sourceDigest(h.file), h.file).toBe(h.sha256);
    expect(assignment.baseline.programBaseline.manifestRows).toBe(145);
    expect(assignment.baseline.manifestRows).toBe(404);
    expect(assignment.baseline.drift).toContain('All 53 assigned live exact variants');
  });

  it('retains exact PASS/basic and accepted-REVISE distinctions', () => {
    expect(frozen.map(f => f.reviewId).sort()).toEqual(['A25-context', 'A27', 'B29', 'F09', 'F15', 'review.n2.sugammadex-recovery-endpoints.v3'].sort());
    expect(frozen.find(f => f.reviewId === 'F15')!.independentDisposition).toBe('REVISE_accepted');
    expect(frozen.find(f => f.reviewId === 'B29')!.independentDisposition).toBe('PASS_ACCEPT_BASIC');
    for (const f of frozen) {
      expect(f.clinicalApproval).toBe(f.reviewId === 'A27');
      expect(audit.find(a => a.inventoryRecordId === f.inventoryRecordId)!.verdict).toBe('Keep');
      expect(questions.some(q => f.variantIds.includes(q.id))).toBe(false);
      expect(readFileSync(join(root, f.reviewFile), 'utf8').length).toBeGreaterThan(30);
    }
    const a27 = before.find(s => s.inventoryRecordId === 'inventory.8eed69f6696b4253')!;
    const approved = a27.authoredDefinitions.find(q => q.question.reviewStatus === 'clinically_approved')!;
    expect(approved.questionSha256).toBe('90c13b79bf01fb937dfa7ed8144072533481a0505832e939ff85f668e04f08d2');
    expect(approved.question).toMatchObject({
      id: 'question.gs028g.laparoscopy-respiratory.co2-absorption.v2.r3',
      contentVersion: 'question-authoring.2026-10-28.v2', reviewStatus: 'clinically_approved',
      lastClinicianReview: { reviewer: 'Melissa Rowland (clinical sign-off)', reviewedOn: '2026-10-29' },
    });
    expect(holds).toHaveLength(4);
    expect(holds.find(h => h.id.endsWith('n2-acquisition'))!.status).toBe('unresolved_not_reauthored');
  });

  it('gives every proposal fresh exact identities without overwriting assigned variants', () => {
    const oldQuestions = new Set(assignment.inventory.flatMap(x => x.variantIds));
    for (const ids of [cases.map(c => c.id), questions.map(q => q.id), cases.flatMap(c => c.decisionNodes.map(n => n.id)),
      questions.flatMap(q => q.answerChoices.map(ch => ch.id))]) expect(new Set(ids).size).toBe(ids.length);
    expect(questions.every(q => !oldQuestions.has(q.id))).toBe(true);
    expect(questions.filter(q => q.reviewStatus === 'needs_clinician_review')).toHaveLength(15);
    expect(questions.every(q => q.lastClinicianReview === null)).toBe(true);
    expect(definitions.flatMap(c => c.nodes).filter(n => n.authorship === 'rewrite')).toHaveLength(8);
    expect(definitions.flatMap(c => c.nodes).filter(n => n.authorship === 'new')).toHaveLength(7);
  });

  it('preserves stable meanings and separates materially changed histories', () => {
    expect(concepts.filter(c => c.conceptMeaning === 'unchanged_meaning')).toHaveLength(5);
    expect(concepts.filter(c => c.conceptMeaning !== 'unchanged_meaning')).toHaveLength(9);
    expect(questions.filter(q => q.conceptId === 'concept.n2.naloxone-response-recurrence')).toHaveLength(1);
    for (const c of concepts) {
      if (c.conceptMeaning === 'unchanged_meaning') {
        const existing = assignment.concepts.find(x => x.conceptId === c.id)!;
        expect(c.learningObjective).toBe(existing.learningObjective);
        expect(c.displayName).toBe(existing.displayName);
      }
      if (c.previousConceptId) {
        expect(c.id).not.toBe(c.previousConceptId);
        const previousExists = assignment.concepts.some(x => x.conceptId === c.previousConceptId)
          || revision.originalProposedCases.some(x => x.nodes.some(n => n.conceptId === c.previousConceptId));
        expect(previousExists).toBe(true);
        expect(c.conceptVersionReason.length).toBeGreaterThan(30);
      }
      expect(c.historyMigration).toContain('None');
    }
  });

  it('uses one consistent named demographic profile and complete separated tasks', () => {
    for (const c of cases) {
      const d = definitions.find(d => d.id === c.id)!;
      expect(c.requiredClinicalSetting).toBe('clinic');
      expect(c.chiefComplaint!.split(/\s+/).length).toBeLessThanOrEqual(5);
      expect(c.prototypeDemographics).toEqual({ ageYears: d.ageYears, sexLabel: d.sexLabel });
      expect(c.presentation).toContain(`${d.ageYears}-year-old`);
      expect(c.presentation).toContain('{patientName}');
      expect(c.approvedInstantiationProfiles).toHaveLength(1);
      expect(c.approvedInstantiationProfiles![0]!.prototypeDemographics).toEqual(c.prototypeDemographics);
      for (const n of c.decisionNodes) {
        expect(n.stem).toContain('{patientName}');
        expect(n.shuffleAnswers).toBe(true);
        expect(n.answerChoices.length).toBeGreaterThanOrEqual(3);
        expect(n.answerChoices.length).toBeLessThanOrEqual(4);
        expect(n.answerChoices.filter(ch => ch.isCorrect)).toHaveLength(1);
      }
      const review = reviews.find(r => r.caseId === c.id)!;
      expect(review).toMatchObject({ educationalTier: 1, acuity: 'stable', earliestFacilityStage: 0,
        profileApproval: 'needs_clinician_review' });
      expect(review.historicalAcuity).toBe(d.historicalAcuity);
    }
  });

  it('keeps later observations progressive and all orders nonexecuting', () => {
    for (const c of cases) {
      expect(c.decisionNodes[0]!.currentUpdate).toBeUndefined();
      for (const n of c.decisionNodes.slice(1)) expect(n.currentUpdate!.length).toBeGreaterThan(30);
      for (const n of c.decisionNodes) {
        expect(n.resultGateAfter).toBeNull();
        expect(n.answerChoices.every(ch => ch.serviceRequest === null)).toBe(true);
      }
    }
    for (const o of orders) expect(o).toMatchObject({ serviceRequest: null, resultGateAfter: null, execution: 'review_plan_only' });
  });

  it('binds testing estimates to exact choice identities and labels, including distractors', () => {
    const knownProfiles = new Set(['timing.test.physiology', 'timing.test.basic_labs', 'timing.test.advanced_diagnostic']);
    expect(timing).toHaveLength(15);
    for (const t of timing) {
      expect(answerChoiceTimingRegistryEntrySchema.safeParse(t).success).toBe(true);
      const d = definitions.flatMap(c => c.nodes).find(n => n.questionVariantId === t.questionVariantId)!;
      const n = cases.flatMap(c => c.decisionNodes).find(n => n.questionVariantId === t.questionVariantId)!;
      if (t.classification.kind === 'test_choices') {
        expect(t.classification.choices.map(ch => [ch.choiceId, ch.choiceLabel])).toEqual(n.answerChoices.map(ch => [ch.id, ch.label]));
        for (const ch of t.classification.choices) {
          expect(ch.timing).toEqual(d.choices.find(c => c.exactChoiceId === ch.choiceId)!.timing);
          if (ch.timing.kind === 'test') expect(knownProfiles.has(ch.timing.timingProfileId)).toBe(true);
        }
      } else expect(d.choices.every(ch => ch.timing.kind === 'no_test')).toBe(true);
    }
    const confirmation = timing.find(t => t.questionVariantId.includes('methemoglobin-confirmation'))!;
    expect(confirmation.classification.kind).toBe('test_choices');
    if (confirmation.classification.kind === 'test_choices') expect(confirmation.classification.choices.every(ch => ch.timing.kind === 'test')).toBe(true);
  });

  it('maps every proposed field and every option to existing atomic claims and sources', () => {
    const claimSet = new Set(claims.map(c => c.id)), sourceSet = new Set(sources.map(s => s.id));
    expect(mappings).toHaveLength(15);
    for (const q of questions) {
      const mapping = mappings.find(m => m.questionVariantId === q.id)!;
      expect(new Set(mapping.evidenceClaimIds)).toEqual(new Set(q.supportingEvidenceClaimIds));
      for (const id of q.supportingEvidenceClaimIds) expect(claimSet.has(id), id).toBe(true);
      for (const ch of q.answerChoices) {
        const field = mapping.fieldMappings.find(m => m.fields.includes(`answerChoices[id=${ch.id}].rationale`))!;
        expect(field.claimIds.length).toBeGreaterThan(0);
        for (const id of field.claimIds) expect(claimSet.has(id), id).toBe(true);
      }
    }
    for (const c of claims) {
      expect(c.sourceIds.length).toBeGreaterThan(0);
      expect(c.reviewStatus).toBe('needs_clinician_review');
      expect(c.lastCheckedOn).toMatch(/^2026-/);
      expect(c.limitation).toBeTruthy();
      for (const s of c.sourceIds) expect(sourceSet.has(s), s).toBe(true);
    }
    for (const s of sources) for (const id of s.evidenceClaimIds) expect(claims.find(c => c.id === id)!.sourceIds).toContain(s.id);
  });

  it('keeps source rights, authority, original dates and safe external-link behavior distinct', () => {
    expect(sources).toHaveLength(22);
    for (const s of sources) {
      expect(s.completeCitation.length).toBeGreaterThan(30);
      expect(s.organizationOrJournal).toBeTruthy();
      expect(s.authors.length).toBeGreaterThan(0);
      expect(s.officialUrl).toMatch(/^https:\/\//);
      expect(s.accessedOn).toMatch(/^2026-/);
      expect(s.licenseLabel).toBeTruthy(); expect(s.reuseNotes).toBeTruthy(); expect(s.authorityAssessment).toBeTruthy();
      expect(s.evidenceClaimIds.length).toBeGreaterThan(0);
    }
    expect(sources.find(s => s.id === 'source.jcm.laparoscopic-anesthesia-review.2020')!.accessedOn).toBe('2026-10-07');
    for (const link of links) expect(link).toMatchObject({ target: '_blank', rel: 'noopener noreferrer', referrerPolicy: 'no-referrer' });
    expect(sources.some(s => s.officialUrl!.includes('mhaus.org'))).toBe(false);
  });

  it('retains concrete manual checks rather than automated clinical PASS flags', () => {
    expect(checks).toHaveLength(15);
    for (const check of checks) {
      for (const field of ['interpret', 'apply', 'closestError', 'decidingObservation', 'counterfactual', 'cueAttack', 'deletionTest', 'sequenceAudit', 'difficultyReason', 'oneBestAnswer'] as const) {
        expect(check[field].length, `${check.questionVariantId}: ${field}`).toBeGreaterThanOrEqual(field === 'sequenceAudit' ? 20 : 30);
      }
      expect(check).toMatchObject({ independent: false, pipelinePassed: false, clinicalApproval: false });
      const question = questions.find(q => q.id === check.questionVariantId)!;
      expect(check.distractorChecks).toHaveLength(question.answerChoices.length - 1);
      for (const ch of check.distractorChecks) {
        expect(ch.temptation.length).toBeGreaterThan(20);
        expect(ch.counterfactual.length).toBeGreaterThan(20);
      }
    }
    expect(withdrawn).toHaveLength(1);
    expect(withdrawn[0]!.status).toBe('author_gate_failed_not_proposed');
    expect(questions.some(q => q.id.includes('ponv-baseline-strategy'))).toBe(false);
  });

  it('keeps the two owned JSON outputs parseable with no missing reverse mappings', () => {
    const packet = JSON.parse(readFileSync(join(root, 'docs/research/question-topic-anesthesia-analgesia-pharmacology-20261111.json'), 'utf8'));
    const ledger = JSON.parse(readFileSync(join(root, 'docs/research/sources-question-topic-anesthesia-analgesia-pharmacology-20261111.json'), 'utf8'));
    expect(packet.counts.proposedExactVariants).toBe(15);
    expect(ledger.statementMappings.map((m: { questionVariantId: string }) => m.questionVariantId).sort()).toEqual(questions.map(q => q.id).sort());
    expect(ledger.claimToQuestionMappings).toHaveLength(claims.length);
  });

  it('reconciles every independent verdict and exactly one repair per returned item', () => {
    expect(sourceDigest(revision.reviewPath)).toBe(revision.reviewFileSha256);
    expect(dispositions).toHaveLength(22);
    expect(dispositions.filter(d => d.status === 'pass-preserved')).toHaveLength(5);
    expect(dispositions.filter(d => d.status === 'revised')).toHaveLength(10);
    expect(dispositions.filter(d => d.status === 'parked')).toHaveLength(7);
    expect(dispositions.map(d => d.reviewedQuestionVariantId).sort())
      .toEqual(revision.originalReview.map(r => r.id).sort());
    for (const d of dispositions) {
      const review = revision.originalReview.find(r => r.id === d.reviewedQuestionVariantId)!;
      expect(d.reviewVerdict).toBe(review.verdict);
      expect(d.repairAttempts).toBe(review.verdict === 'PASS' ? 0 : 1);
      expect(d.issueResponses).toHaveLength(review.clarityIssues.length + review.cues.length
        + review.fairness.length + review.suggestions.length);
      if (d.status !== 'pass-preserved') expect(d.attemptedQuestionVariantId).toMatch(/\.v2$/);
      if (d.status === 'parked') {
        expect(d.currentQuestionVariantId).toBeNull();
        expect(d.parkReason!.length).toBeGreaterThan(40);
      }
    }
  });

  it('preserves complete PASS questions, nodes and visible context exactly', () => {
    for (const d of dispositions.filter(d => d.status === 'pass-preserved')) {
      const originalDefinition = reviewedDefinitions.flatMap(c => c.nodes)
        .find(n => n.questionVariantId === d.reviewedQuestionVariantId)!;
      const currentDefinition = definitions.flatMap(c => c.nodes)
        .find(n => n.questionVariantId === d.reviewedQuestionVariantId)!;
      const originalQuestion = revision.originalArtifacts.ANESTHESIA_TOPIC_QUESTIONS
        .find(q => q.id === d.reviewedQuestionVariantId)!;
      const originalCase = revision.originalArtifacts.ANESTHESIA_TOPIC_CASES
        .find(c => c.id === d.originalCaseId)!;
      const originalNode = originalCase.decisionNodes.find(n => n.questionVariantId === d.reviewedQuestionVariantId)!;
      const currentCase = cases.find(c => c.id === d.currentCaseId)!;
      const currentNode = currentCase.decisionNodes[0]!;
      const context = (c: typeof currentCase) => ({ presentation: c.presentation,
        chiefComplaint: c.chiefComplaint, patientDisplayName: c.patientDisplayName,
        prototypeDemographics: c.prototypeDemographics,
        approvedInstantiationProfiles: c.approvedInstantiationProfiles });
      expect(currentDefinition).toEqual(originalDefinition);
      expect(questions.find(q => q.id === d.reviewedQuestionVariantId)).toEqual(originalQuestion);
      expect({ ...currentNode, terminalDispositions: originalNode.terminalDispositions }).toEqual(originalNode);
      expect(currentNode.terminalDispositions).toHaveLength(currentNode.answerChoices.length - 1);
      for (const terminal of currentNode.terminalDispositions) {
        expect(terminal.kind).toBe('no_terminal_outcome');
        if (terminal.kind === 'no_terminal_outcome') {
          expect(terminal.clinicalRationale).toBe(currentNode.answerChoices.find(ch => ch.id === terminal.answerChoiceId)!.rationale);
        }
      }
      expect(context(currentCase)).toEqual(context(originalCase as unknown as typeof currentCase));
      expect(digest(currentDefinition)).toBe(d.reviewedHashes.rawNodeSha256);
      expect(digest(originalQuestion)).toBe(d.reviewedHashes.questionSha256);
      expect(digest(originalNode)).toBe(d.reviewedHashes.materializedNodeSha256);
      expect(digest(context(currentCase))).toBe(d.reviewedHashes.visibleContextSha256);
      if (originalCase.decisionNodes.length === 1) expect(currentCase).toEqual(originalCase);
    }
  });

  it('excludes parked and superseded non-PASS versions and gates every multipart composition', () => {
    expect(questions.map(q => q.id).sort())
      .toEqual(dispositions.flatMap(d => d.currentQuestionVariantId ? [d.currentQuestionVariantId] : []).sort());
    expect(parked).toHaveLength(7);
    for (const p of parked) {
      expect(p.releaseEligible).toBe(false);
      for (const n of p.case.nodes) expect(questions.some(q => q.id === n.questionVariantId)).toBe(false);
    }
    for (const d of dispositions.filter(d => d.reviewVerdict !== 'PASS')) {
      expect(questions.some(q => q.id === d.reviewedQuestionVariantId)).toBe(false);
    }
    const passes = new Set(dispositions.filter(d => d.status === 'pass-preserved').map(d => d.currentQuestionVariantId));
    for (const c of cases.filter(c => c.decisionNodes.length > 1)) {
      expect(c.decisionNodes.every(n => passes.has(n.questionVariantId))).toBe(true);
    }
    expect(cases.every(c => c.decisionNodes.length === 1)).toBe(true);
    expect(compositions).toHaveLength(4);
    expect(compositions.every(c => c.state === 'withheld_until_all_exact_nodes_PASS')).toBe(true);
    expect(parked.find(p => p.slug === 'last-lipid-rescue')!.case.nodes[0]!.key).toBeNull();
  });

  it('guards the failed chronology and the balanced medication-plan comparison', () => {
    const pressure = cases.find(c => c.decisionNodes[0]!.questionVariantId.endsWith('lap-pressure-intervention.v2'))!;
    const n = pressure.decisionNodes[0]!;
    expect(n.exhibit!.kind).toBe('table');
    if (n.exhibit!.kind === 'table') {
      expect(n.exhibit!.columnHeaders).toEqual(['Before pressure increase', 'Current higher pressure']);
      expect(JSON.stringify(n.exhibit)).not.toMatch(/Returns toward|After reduction/);
    }
    expect(pressure.presentation).toContain('transesophageal echocardiogram');
    expect(pressure.presentation).toContain('passive inspiratory holds');
    const route = questions.find(q => q.id.endsWith('boosted-midazolam-route.v2'))!;
    expect(route.answerChoices).toHaveLength(4);
    for (const component of ['Omit oral', 'Retain oral', 'smaller IV', 'copied IV']) {
      expect(route.answerChoices.filter(c => c.label.includes(component))).toHaveLength(2);
    }
  });
});
