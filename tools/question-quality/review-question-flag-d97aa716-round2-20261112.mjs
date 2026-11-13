import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata, inventoryRelease} from './bank.mjs';

const content = await import('../../packages/clinical-content/src/index.ts');
const previous = await import('../../packages/clinical-content/src/question-flag-d97aa716-20261112.ts');
const candidate = await import('../../packages/clinical-content/src/question-flag-d97aa716-round2-20261112.ts');
const read = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const input = read('tools/question-quality/fixtures/question-flag-d97aa716-before-20261112.json');
const intake = read('tools/question-quality/fixtures/question-flag-d97aa716-round2-intake-20261112.json');
const reviewPath = 'docs/research/question-flag-d97aa716-review-20261112.json';
const review = read(reviewPath);
const bytesDigest = value => createHash('sha256').update(value).digest('hex');
const digest = value => bytesDigest(JSON.stringify(value));
const metadata = collectAuthoredMetadata({...content, ...previous, ...candidate});
const liveMetadata = collectAuthoredMetadata(content);
for (const question of candidate.QUESTION_FLAG_D97AA716_ROUND2_QUESTIONS)
  assert(!liveMetadata.questions.has(question.id), question.id + ' exact identity already exists in indexed source');
const beforeLint = inventoryRelease(previous.QUESTION_FLAG_D97AA716_SOURCE_RELEASE, metadata);
const afterLint = inventoryRelease(candidate.QUESTION_FLAG_D97AA716_ROUND2_SOURCE_RELEASE, metadata);
const ids = new Set(candidate.QUESTION_FLAG_D97AA716_ROUND2_QUESTIONS.map(question => question.id));
const targets = afterLint.variants.filter(row => ids.has(row.questionVariantId));
assert.equal(targets.length, 3);
assert.equal(targets.flatMap(row => row.findings).length, 0, 'Round-2 targets require zero unsuppressed findings');
for (const [current, expected] of [
  [content.SYNTHETIC_CLINICAL_RELEASE, input.live.sha256], [content.QUESTION_SHIP_MANIFEST, input.manifestSha256],
  [content.ANSWER_CHOICE_TIMING_REGISTRY, input.timingSha256], [content.QUESTION_CATALOG_RELEASE, input.catalogSha256],
]) assert.equal(digest(current), expected);
for (const row of intake.files.filter(row => !row.path.endsWith('.test.ts') &&
  !['docs/research/question-flag-d97aa716-20261112.json', 'docs/research/sources-question-flag-d97aa716-20261112.json',
    'tools/question-quality/question-flag-d97aa716-lint-20261112.json'].includes(row.path)))
  assert.equal(bytesDigest(fs.readFileSync(row.path)), row.sha256, row.path);

const responses = [
  {
    fairness: [
      'Offline review scope and source limitations retained; no fresh retrieval or clinician approval is claimed.',
      'Label-free routes retained; every medial-route field now specifies adductor longus.',
      'Both enhancing targets are explicitly accessible percutaneously. The initial core key and selected-open alternative distinction are unchanged.',
      'A constructed longitudinal anterior resection includes the anterior skin entry and underlying rectus femoris; the explanation requires tract removal with the specimen, separately from compartment confinement.',
      'Both targets still enhance. Existing viable-target claim and older direct-technique limitation retained; duplicate publication IDs are not independent evidence.',
      'Use the exact muscle supported by the existing adductor-longus claim. The source is not presented as certification of the constructed trajectory.',
      'Balanced four-plan method-by-route matrix, unchanged choice identities and no uniquely long or cautious option.',
      'Moderate application remains the author prediction; missing operative information is supplied rather than counted as difficulty.',
      'The packet now displays the inherited three-word chief complaint and a complete thigh-specific task; all original profiles and presentation tokens are exact.',
    ],
    suggestions: [
      'Restored explicit percutaneous sampling access for both enhancing targets, without designating either route preferred in the case record.',
      'Added a constructed resection exposure and specimen outline. Mapped the requirement to the existing tract-excision claim and explained complete tract removal. No clinician confirmation is falsely claimed; exact geometry remains the named clinical-review boundary.',
      'Changed generic adductor muscle to adductor longus in the exhibit, both medial options and feedback, using the existing exact anatomical claim. Human confirmation of this fictional route remains pending.',
      'Retained the table, enhancing targets, full balanced matrix and concept; added chief complaint to both packet projections. All versions remain needs_clinician_review.',
    ],
  },
  {
    fairness: [
      'Kept both named approaches and the complete route-to-enhancement table; no letter labels return.',
      'Kept the posterior core key, concept and exact choice identities. Existing arm anatomy claims support membership but do not certify the invented route.',
      'Restored percutaneous sampling access for both enhancing targets; feasible initial core remains the keyed method.',
      'Added the constructed posterior resection exposure, posterior skin entry and triceps specimen relation. Explicitly teach tract excision rather than inferring it from compartment confinement.',
      'Both targets enhance; greater anterior enhancement does not override the documented tract relation. Older direct targeting source and duplicate-record limitation are retained.',
      'Retained the complete two-method/two-route matrix with parallel choices and no new qualifier on the key.',
      'Moderate, at the easier end, remains a qualitative author prediction; no ambiguity is used to increase difficulty.',
      'Added chief complaint and the upper-arm-specific complete task. Original profiles and runtime name token are preserved; clinical approval is not claimed.',
    ],
    suggestions: [
      'Restored explicit percutaneous sampling access to both targets, not a preferred-route label.',
      'Added the constructed posterior exposure and skin-to-mass tract within the proposed specimen; explained removal with definitive resection and mapped the existing tract-excision claim. Actual specialist confirmation remains pending and is stated explicitly.',
      'Retained the named balanced matrix, stable concept and needs_clinician_review status; included chief complaint and a site-specific complete task.',
    ],
  },
  {
    fairness: [
      'Retained the complete posterior and lateral anatomical routes without abstract labels.',
      'Kept the initial posterior core key and stable concept. Both targets now have explicit percutaneous access; the key also depends on the documented specimen outline.',
      'Withdrew the unverified calf compartment-membership assertion from all teaching, feedback and scoring rationale. No calf anatomy claim is invented or borrowed from thigh/arm records. The same planned-tract objective now uses the constructed specimen outline under the existing tract-excision claim.',
      'Added the constructed posterior exposure, skin entry and underlying gastrocnemius within the proposed specimen, with peroneus longus outside it. Explain complete tract removal; general guidance does not certify the fictional geometry.',
      'Added the existing viable-target claim to D97-3 and the enhancement/explanation field mappings, preserving the older technical-source limitation and not counting duplicate records independently.',
      'Retained all four balanced method-by-route options, equal word lengths and no key-only qualifier. Both routes retain neurovascular clearance.',
      'Moderate application is predicted from method plus specimen/tract interpretation; it no longer requires an unverified compartment premise.',
      'Included the short complaint in the packet and retained all demographic/name tokens and a complete calf-specific task. No clinical approval is implied.',
    ],
    suggestions: [
      'The existing permitted ledger cannot verify the calf compartment memberships. That assertion is explicitly withheld, not represented as clinician-reviewed. The candidate is revised to use the stated operative specimen relationship instead, without a new general anatomical teaching point or a changed core/tract objective.',
      'Restored percutaneous access for both targets and documented the proposed posterior exposure and tract/specimen relationship. Explained removal with the specimen. These are labeled constructed observations with named specialist confirmation still pending.',
      'Mapped enhancement and viable-target explanation to claim.qq20261102a.sarcoma-viable-biopsy-target and its exact existing records; retained source-age and duplicate-publication limitations.',
      'Retained the readable matrix, calf-specific task, chief complaint and stable concept/key/choice identities. Needs_clinician_review remains explicit.',
    ],
  },
];
const display = (cs, node) => ({variantId: node.questionVariantId, 'Chief complaint': cs.chiefComplaint,
  Presentation: cs.presentation, 'Current update': node.currentUpdate ?? null,
  Exhibit: node.exhibit ?? null, Task: node.stem,
  Options: [...node.answerChoices].sort((a,b) => Number(b.isCorrect) - Number(a.isCorrect))
    .map(choice => (choice.isCorrect ? '**KEY:** ' : '') + choice.label)});
const rationalePairs = node => node.answerChoices.map(choice => ({choiceId: choice.id,
  label: choice.label, key: choice.isCorrect, rationale: choice.rationale}));
const packet = candidate.QUESTION_FLAG_D97AA716_ROUND2_REVISIONS.map((row, index) => {
  const original = input.selected[index];
  const oldCase = previous.QUESTION_FLAG_D97AA716_CASES.find(cs => cs.id === row.caseId);
  const oldNode = oldCase.decisionNodes.find(node => node.id === row.nodeId);
  const cs = candidate.QUESTION_FLAG_D97AA716_ROUND2_CASES.find(cs => cs.id === row.caseId);
  const node = cs.decisionNodes.find(node => node.id === row.nodeId);
  const notes = review[index];
  assert.equal(notes.id, row.id);
  assert.equal(notes.fairness.length, responses[index].fairness.length);
  assert.equal(notes.suggestions.length, responses[index].suggestions.length);
  const mappings = [
    {fields: ['Presentation', 'Chief complaint', 'Current update: mass location', 'Exhibit: needle routes'],
      type: index === 1 ? 'Retained constructed upper-arm patient/MRI observations with the existing biceps/triceps membership claims' : 'Retained constructed patient/MRI observations; the thigh medial muscle is made specific to its existing claim',
      sourceCaseSha256: original.caseSha256,
      claimIds: row.question.supportingEvidenceClaimIds.filter(id => /compartment|planned-biopsy|\.mri$/.test(id))},
    {fields: ['Current update: percutaneous access', 'Options: method', 'Rationales', 'Explanation: initial method'],
      type: 'Constructed access observation with the existing feasible-initial-core rule',
      claimIds: row.question.supportingEvidenceClaimIds.filter(id => /initial-core|planned-biopsy/.test(id))},
    {fields: ['Current update: proposed resection', 'Rationales: tract/specimen relation', 'Explanation: tract excision'],
      type: 'New constructed planning observation; applying existing guidance, not new general anatomy or a certified operative plan',
      claimIds: ['claim.question-topic-soft-tissue-sarcoma-desmoid.tract-excision']},
    {fields: ['Current update: enhancing solid targets', 'Exhibit: enhancement', 'Rationales', 'Explanation: enhancement'],
      type: 'Existing viable-target principle; original enhancing-target observations retained',
      claimIds: ['claim.qq20261102a.sarcoma-viable-biopsy-target']},
  ];
  return {id: row.id, round: 2, title: row.title, flagId: input.flag.id, ownerNote: input.flag.note,
    status: 'draft_needs_independent_review', reviewStatus: 'needs_clinician_review', clinicalApproval: false,
    sourceView: candidate.QUESTION_FLAG_D97AA716_ROUND2_SOURCE_VIEW_NAME, caseId: row.caseId, nodeId: row.nodeId,
    conceptId: node.primaryConceptId, conceptMeaningChanged: false, keyChanged: false, holdStatus: 'none',
    withheldAssertion: row.withdrawnAssertion,
    before: display(oldCase, oldNode), after: display(cs, node), originalLive: intake.round1Packet[index].before,
    keyOrderNotice: 'Key shown first for review only. Runtime answer choices are randomized.',
    rationalePairs: {before: rationalePairs(oldNode), after: rationalePairs(node)},
    explanation: node.explanation, inference: row.inference,
    focus: 'Initial core method plus tract removability under an explicitly documented resection plan',
    whatChanged: row.whatChanged, clinicalReviewBoundary: row.clinicalBoundary,
    reviewResponse: {reviewFile: reviewPath, reviewSha256: bytesDigest(fs.readFileSync(reviewPath)),
      priorVerdict: notes.verdict, notes: [
        ...notes.fairness.map((_note,i) => ({type: 'fairness', noteIndex: i + 1, response: responses[index].fairness[i]})),
        ...notes.suggestions.map((_note,i) => ({type: 'suggestion', noteIndex: i + 1, response: responses[index].suggestions[i]})),
      ]},
    selfCheck: {independent: false, clinicalApproval: false, authorVerdict: 'DRAFT_FOR_INDEPENDENT_REVIEW',
      coverTheKey: 'Each method occurs with each approach. The documented specimen relation narrows the route, not the method; the player must also apply feasible initial-core guidance.',
      optionCategory: 'Four initial biopsy plans in a complete method-by-approach matrix.',
      reasoningSteps: ['Interpret enhancing targets and each route relative to the stated resection specimen.', 'Combine a removable planned tract with the preferred feasible initial sampling method.'],
      decidingObservation: row.decidingObservation, closestCredibleError: row.closestCompetitor,
      counterfactual: row.counterfactual, predictedDifficulty: 'moderate',
      fairness: 'Both targets enhance and are accessible percutaneously. The selected entire tract is included in the constructed resection plan; no same-compartment inference substitutes for this. Human confirmation is pending.',
      sourceClosure: index === 2 ? 'No unverified calf compartment membership is required or taught.' : index === 1 ? 'Existing biceps-anterior and triceps-posterior arm-membership claims are retained; the constructed posterior access and complete tract geometry still need clinician confirmation.' : 'Existing exact muscle-membership claims retained; adductor longus is used precisely.',
      originalOwnerNoteResolved: true},
    evidenceClaimIds: row.question.supportingEvidenceClaimIds, evidenceMapping: mappings,
    lint: {beforeCount: beforeLint.variants.find(record => record.questionVariantId === oldNode.questionVariantId).findings.length,
      afterCount: targets[index].findings.length, profileContexts: targets[index].profileContexts, suppressedFindings: 0},
    frozenPreservation: {originalLiveCaseSha256: original.caseSha256, beforeCaseSha256: digest(oldCase),
      afterCaseSha256: digest(cs), beforeNodeSha256: digest(oldNode), afterNodeSha256: digest(node),
      afterQuestionSha256: digest(row.question)},
    currentFreshReachability: original.reachability, fallbackQuestionVariantId: original.question.id,
  };
});
const ledger = {checkedOn: '2026-11-12', round: 2, reviewStatus: 'needs_clinician_review', clinicalApproval: false,
  networkUsed: false, newClinicalClaims: 0, evidenceClaims: input.claims, sources: input.sources,
  policy: 'Exact existing source records and atomic claims reused offline. Original access/check dates and limitations preserved. Duplicate ESSR or SEOM records are one publication each, not independent corroboration.',
  constructedObservations: 'Percutaneous access and proposed resection outlines are fictional case data. General guidance supports the decision rule, not these anatomical trajectories. No clinician confirmation is claimed.',
  withheldAssertions: packet.filter(row => row.withheldAssertion).map(row => ({id: row.id, statement: row.withheldAssertion})),
  clinicalReviewBoundary: packet.map(row => ({id: row.id, boundary: row.clinicalReviewBoundary})),
  questionClaimMappings: packet.map(row => ({questionVariantId: row.after.variantId, fields: row.evidenceMapping})),
  siblingAudit: input.siblingAudit,
};
const lint = {checkedOn: '2026-11-12', round: 2, suppressedFindings: 0, targetVariants: 3,
  targetProfileContexts: targets.reduce((n,row) => n + row.profileContexts, 0), targetFindings: 0,
  inheritedFindings: afterLint.variants.filter(row => !ids.has(row.questionVariantId)), before: beforeLint, after: afterLint};
for (const [path, value] of [
  ['docs/research/question-flag-d97aa716-20261112.json', packet],
  ['docs/research/sources-question-flag-d97aa716-20261112.json', ledger],
  ['tools/question-quality/question-flag-d97aa716-lint-20261112.json', lint],
]) {
  const text = JSON.stringify(value, null, 2) + '\n';
  if (process.argv.includes('--check')) assert.equal(fs.readFileSync(path, 'utf8'), text, path + ' stale');
  else fs.writeFileSync(path, text);
}
console.log(JSON.stringify({round: 2, revised: packet.length, targetFindings: 0, contexts: lint.targetProfileContexts,
  preservedContextFindings: lint.inheritedFindings.reduce((n,row) => n + row.findings.length, 0),
  reviewNotesAnswered: packet.reduce((n,row) => n + row.reviewResponse.notes.length, 0),
  claims: ledger.evidenceClaims.length, sources: ledger.sources.length, liveUnchanged: true}));
