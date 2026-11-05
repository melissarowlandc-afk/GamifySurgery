// Run: node --disable-warning=ExperimentalWarning tools/question-new-n1/measure.mjs [before|after]
// Synthetic histories only. No save, owner telemetry, network, or Git access.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
const content = await import('../../packages/clinical-content/src/index.ts');
const domain = await import('../../packages/game-domain/src/index.ts');
const { collectAuthoredMetadata } = await import('../question-quality/bank.mjs');
const { clinicalCaseHasSupportedPatientSemantics } = await import('../../packages/game-domain/src/clinical-case-eligibility.ts');
const { createLevelFourRoomsQaContext, createLevelFourRoomsQaState } = await import('../../tests/fixtures/level-four-rooms.ts');
const suffix = process.argv[2] ?? 'before';
if (!['before', 'after', 'current-pre-n1'].includes(suffix)) throw new Error('Expected before, after or current-pre-n1');
// Reproduce N0 from its actual frozen rewrite-pipeline snapshot even after N1
// or another worker appends new versions to the integrated release.
const release = suffix === 'before' ? content.QUESTION_FLAGS_PRE_ROUND3_RELEASE
  : suffix === 'current-pre-n1' ? content.QUESTION_NEW_N1_PRE_RELEASE : content.SYNTHETIC_CLINICAL_RELEASE;
const context = { ...domain.PROTOTYPE_DOMAIN_CONTEXT, clinicalRelease: release };
const metadata = collectAuthoredMetadata(content);
const NOW = 1_800_000_000_000;
const ids = c => [...new Set(c.decisionNodes.map(n => n.primaryConceptId))];
const conceptIds = cases => [...new Set(cases.flatMap(ids))];
const casesAt = (level, clinicOnly = false) => release.cases.filter(c => c.routineEligible && !c.participant &&
  clinicalCaseHasSupportedPatientSemantics(c) && c.earliestFacilityStage <= level &&
  (!clinicOnly || c.requiredCapabilityIds.length === 0));
function blank(seed) {
  const state = domain.createInitialGameState(context, { campaignSeed: seed, createdAtRealMs: NOW });
  Object.assign(state, { encounters: {}, employeeDiscussions: {}, openChartEncounterId: null, attendedEncounterId: null,
    paused: false, facilityLevel: 4, nextRoutineArrivalTick: 0, routineArrivalSequence: 0, serviceAppointmentsEnabled: false });
  return state;
}
function review(state, c, at, rating = 'Good') {
  for (const node of c.decisionNodes) {
    const conceptId = node.primaryConceptId;
    const history = state.learningHistories[conceptId] ?? { conceptId, card: domain.createNewFsrsCard(at), reviews: [] };
    const updated = domain.applyFsrsReview(history.card, rating, at, context.balanceRelease.learning);
    state.learningHistories[conceptId] = { conceptId, card: updated.card, reviews: [...history.reviews, {
      id: `review.n0.${state.routineArrivalSequence}.${node.id}`, encounterId: `encounter.n0.${state.routineArrivalSequence}`,
      decisionNodeId: node.id, questionVariantId: node.questionVariantId,
      patientPresentationVariantId: c.patientPresentationVariantId, primaryConceptId: conceptId,
      answerChoiceId: node.answerChoices.find(a => a.isCorrect === (rating === 'Good')).id,
      correct: rating === 'Good', rating, reviewedAtMs: at, facilityTick: state.facilityTick, schedulerLog: updated.log,
    }] };
  }
  state.routineArrivalSequence++;
}
function exhaust(cases, seed, state = blank(seed), at = NOW) {
  let patients = 0;
  while (true) {
    const selected = domain.selectRoutineClinicalCase(state, cases, at);
    if (!selected) break;
    if (patients > release.concepts.length * 2) throw new Error('Unbounded supply simulation');
    review(state, selected.clinicalCase, at);
    patients++;
  }
  const unseen = conceptIds(cases).filter(id => !state.learningHistories[id]?.reviews.length);
  return { patients, introduced: conceptIds(cases).length - unseen.length, stranded: unseen };
}
const range = values => ({ min: Math.min(...values), max: Math.max(...values) });
const tierForConcept = new Map(release.concepts.map(concept => {
  const authoredTier = metadata.concepts.get(concept.id)?.educationalTier;
  const caseTiers = [...new Set(release.cases.filter(c => ids(c).includes(concept.id))
    .map(c => metadata.caseReviews.get(c.id)?.educationalTier).filter(t => t !== undefined))];
  return [concept.id, authoredTier ?? (caseTiers.length === 1 ? caseTiers[0] : 'unclassified')];
}));
const byTier = (cases, kind) => {
  const pairs = cases.flatMap(c => c.decisionNodes.map(n => [kind === 'concept' ? n.primaryConceptId : n.questionVariantId,
    tierForConcept.get(n.primaryConceptId)]));
  return Object.fromEntries([...new Set(pairs.map(([, t]) => t))].sort().map(t => [t, new Set(pairs.filter(([, tier]) => tier === t).map(([id]) => id)).size]));
};
const stages = [0, 1, 2, 3, 4].map(level => {
  const all = casesAt(level), clinic = casesAt(level, true), previous = level ? casesAt(level - 1) : [];
  const runs = Array.from({ length: 16 }, (_, seed) => exhaust(all, `n0.cold.${level}.${seed}`));
  const clinicRuns = Array.from({ length: 16 }, (_, seed) => exhaust(clinic, `n0.clinic.${level}.${seed}`));
  const prior = new Set(conceptIds(previous));
  return { level, cases: all.length, concepts: conceptIds(all).length,
    newlyUnlockedConcepts: conceptIds(all).filter(id => !prior.has(id)).length,
    variants: new Set(all.flatMap(c => c.decisionNodes.map(n => n.questionVariantId))).size,
    conceptsByEducationalTier: byTier(all, 'concept'), variantsByEducationalTier: byTier(all, 'variant'),
    patientsUntilNoUnseenOrDue: range(runs.map(r => r.patients)), strandedUnseenConcepts: range(runs.map(r => r.stranded.length)),
    noCapabilityCases: clinic.length, noCapabilityConcepts: conceptIds(clinic).length,
    noCapabilityPatientBoundary: range(clinicRuns.map(r => r.patients)),
    // Operational room/staff validation remains separate from this upper bound.
    inventoryBasis: 'All supported patient cases passing numeric stage; required capabilities assumed installed and operational.' };
});
// Progression model follows per-level XP thresholds; construction/cash/episode witnesses are deliberately not inferred.
// Conservative extra-volume model represents time spent earning cash/building before choosing Level Up.
const progressed = [];
for (const mode of ['xp-minimum-all-good', 'construction-delay-all-good', 'construction-delay-mixed', 'long-construction-delay-all-good']) {
  const runs = [];
  for (let seed = 0; seed < 16; seed++) {
    const state = blank(`n0.progress.${mode}.${seed}`), rows = [];
    let at = NOW;
    for (const level of [0, 1, 2, 3, 4]) {
      state.facilityLevel = level;
      const cases = casesAt(level);
      const threshold = context.balanceRelease.facility.stageDefinitions.find(s => s.level === level).minimumClinicalXp;
      const target = mode.startsWith('long-') ? threshold * 4 : mode.startsWith('construction') ? threshold * 2 : threshold;
      let xp = 0, patients = 0, newConcepts = 0, duePatients = 0;
      const distinctBefore = Object.values(state.learningHistories).filter(h => h.reviews.length).length;
      while (xp < target) {
        const selected = domain.selectRoutineClinicalCase(state, cases, at);
        if (!selected) break;
        const rating = mode.endsWith('mixed') && state.routineArrivalSequence % 5 === 4 ? 'Again' : 'Good';
        if (selected.kind === 'due_review') duePatients++;
        newConcepts += ids(selected.clinicalCase).filter(id => !state.learningHistories[id]?.reviews.length).length;
        xp += selected.clinicalCase.decisionNodes.length * (rating === 'Good' ? 10 : 2);
        review(state, selected.clinicalCase, at, rating);
        patients++;
        at += 120_000; // Explicit editorial pacing assumption: two real minutes per completed chart.
      }
      const remainingState = structuredClone(state);
      const remaining = exhaust(cases, 'unused', remainingState, at);
      rows.push({ level, targetXp: target, modeledXp: xp, encountersThisStage: patients,
        cumulativeEncounters: state.routineArrivalSequence, newConceptsThisStage: newConcepts, duePatients,
        priorReviewedConcepts: distinctBefore, reviewedConcepts: Object.values(state.learningHistories).filter(h => h.reviews.length).length,
        remainingUnseenOrDuePatientsAtStageEnd: remaining.patients,
        blockedBeforeTarget: xp < target });
    }
    runs.push(rows);
  }
  progressed.push({ mode, stages: [0, 1, 2, 3, 4].map(level => {
    const rows = runs.map(run => run[level]);
    return { level, encountersThisStage: range(rows.map(r => r.encountersThisStage)), cumulativeEncounters: range(rows.map(r => r.cumulativeEncounters)),
      reviewedConcepts: range(rows.map(r => r.reviewedConcepts)), newConceptsThisStage: range(rows.map(r => r.newConceptsThisStage)),
      duePatients: range(rows.map(r => r.duePatients)), remainingUnseenOrDuePatientsAtStageEnd: range(rows.map(r => r.remainingUnseenOrDuePatientsAtStageEnd)),
      blockedRuns: rows.filter(r => r.blockedBeforeTarget).length };
  }) });
}
// Native ADVANCE_TICK reproduction in the existing QA campaign; no fake selector result.
const qaContext = createLevelFourRoomsQaContext();
const probeCase = casesAt(3).find(c => c.requiredCapabilityIds.length === 0 && c.decisionNodes.length === 1 && !c.pediatricProfile);
const probeContext = { ...qaContext, clinicalRelease: { ...release, cases: [probeCase] } };
const admissionProbes = [];
for (const condition of ['unseen', 'future-due', 'due-now']) {
  const state = createLevelFourRoomsQaState(qaContext);
  Object.assign(state, { paused: false, facilityLevel: 3, nextRoutineArrivalTick: 0 });
  if (condition !== 'unseen') {
    review(state, probeCase, NOW);
    state.learningHistories[ids(probeCase)[0]].card.dueAtMs = condition === 'due-now' ? NOW : NOW + 86_400_000;
  }
  const next = domain.gameReducer(state, { type: 'ADVANCE_TICK', operationId: `n0.probe.${condition}`, advancedAtRealMs: NOW }, probeContext);
  admissionProbes.push({ condition, availabilityBefore: domain.getRoutinePatientAvailability(state, NOW, probeContext),
    patientsAdmitted: Object.values(next.encounters).filter(e => e.resolutionReason === null).length,
    nextRoutineArrivalTick: next.nextRoutineArrivalTick, facilityTick: next.facilityTick });
}
const result = { schemaVersion: 1, measuredOn: '2026-11-04', basis: 'Offline synthetic domain experiment; no private campaign or answer-statistics analysis.',
  releaseId: release.id, releaseSha256: createHash('sha256').update(JSON.stringify(release)).digest('hex'),
  registeredConcepts: release.concepts.length, activePatientConcepts: conceptIds(casesAt(4)).length,
  activeEmployeeConcepts: conceptIds(release.cases.filter(c => c.routineEligible && c.participant)).length,
  inactiveRegisteredConceptIds: release.concepts.filter(c => !release.cases.some(k => k.decisionNodes.some(n => n.primaryConceptId === c.id))).map(c => c.id),
  stages, progressed, admissionProbes, arrivalBalance: context.balanceRelease.arrivals,
  progressionThresholds: context.balanceRelease.facility.stageDefinitions.filter(s => s.level <= 4).map(s => ({ level: s.level, xp: s.minimumClinicalXp })),
  limitations: ['Stage census is a capability-installed upper bound, not an assertion that rooms/staff are actually operational in an owner save.',
    'No measured typical-player exposure or correctness rate. XP-minimum and twice-threshold construction-delay histories are explicit scenarios.',
    'History reviews use the shipped FSRS adapter; chart completion is simulated, not full physical service completion.',
    'Due priority and complete-case eligibility can cause repetitions or block unseen paired objectives. More variants do not create new unseen identities.',
    'Numeric stage 0 recovery has a special progression stop; the Level 0 cold inventory is not a promise all its cases are visited before Level Up.'] };
fs.mkdirSync('.local-dev/question-new-content-20261104', { recursive: true });
fs.writeFileSync(`.local-dev/question-new-content-20261104/supply-${suffix}.json`, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ stages: result.stages, progressed: result.progressed, admissionProbes }, null, 2));
