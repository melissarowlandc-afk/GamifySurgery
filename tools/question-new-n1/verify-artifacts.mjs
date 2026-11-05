import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
const content = await import('../../packages/clinical-content/src/index.ts');
const packet = JSON.parse(fs.readFileSync('docs/research/question-new-n1-20261104.json', 'utf8'));
const coverage = JSON.parse(fs.readFileSync('docs/research/question-coverage-gaps-20261104.json', 'utf8'));
const sources = JSON.parse(fs.readFileSync('docs/research/sources-question-new-n1-20261104.json', 'utf8'));
const dispositions = JSON.parse(fs.readFileSync('docs/research/question-new-n1-lint-dispositions-20261104.json', 'utf8'));
const before = JSON.parse(fs.readFileSync('.local-dev/question-new-content-20261104/supply-before.json', 'utf8'));
const after = JSON.parse(fs.readFileSync('.local-dev/question-new-content-20261104/supply-after.json', 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
assert.equal(packet.variants.length, 40);
assert.equal(packet.label.toLowerCase(), 'key shown first for review only');
assert.equal(packet.reviewStatus, 'needs_clinician_review');
assert.equal(packet.pipelinePassed, false);
assert.equal(dispositions.newOwnerRuleFindings, 0);
assert.equal(coverage.mappings.some(m => m.category === 'Unclassified'), false);
assert.equal(coverage.counts.reduce((total, c) => total + c.N1Concepts, 0), 40);
assert.deepEqual(sources.clinicalSources, content.QUESTION_NEW_N1_SOURCES);
assert.deepEqual(sources.atomicClaims, content.QUESTION_NEW_N1_CLAIMS);
let timedChoices = 0;
for (const [i, row] of packet.variants.entries()) {
  const authored = content.QUESTION_NEW_N1_CASES[i];
  assert.equal(row.exactVersionSha256, hash(authored));
  assert.deepEqual(row.authoredTemplate, authored);
  assert.equal(row.clinicalCase.decisionNodes[0].answerChoices[0].isCorrect, true);
  assert.ok(row.clinicalCase.presentation.includes(row.clinicalCase.patientDisplayName));
  assert.ok(!row.clinicalCase.presentation.includes('{patientName}'));
  assert.ok(row.evidenceClaimIds.every(id => sources.atomicClaims.some(c => c.id === id)));
  if (row.timing.classification.kind === 'test_choices') timedChoices += row.timing.classification.choices.filter(c => c.timing.kind === 'test').length;
}
const summary = {
  checkedOn: '2026-11-04', reviewPacketVariants: 40,
  exactTemplateAndHashMatches: true, canonicalNamedPresentations: true,
  atomicClaims: sources.atomicClaims.length, clinicalSources: sources.clinicalSources.length,
  explicitlyTimedTestingChoices: timedChoices,
  constructedExhibits: packet.variants.filter(v => v.clinicalCase.decisionNodes[0].exhibit).length,
  newOwnerRuleFindings: 0, retainedAdvisoryFindings: dispositions.findings.length,
  coveredTopicFrameLeaves: coverage.counts.length, unresolvedCurrentConceptMappings: 0,
  frozenN0ReleaseStillMatches: before.releaseSha256 === hash(content.QUESTION_FLAGS_PRE_ROUND3_RELEASE),
  currentReleaseMatchesAfterMeasurement: after.releaseSha256 === hash(content.SYNTHETIC_CLINICAL_RELEASE),
  currentRegisteredConcepts: content.SYNTHETIC_CLINICAL_RELEASE.concepts.length,
  currentCases: content.SYNTHETIC_CLINICAL_RELEASE.cases.length,
  currentNodes: content.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(c => c.decisionNodes).length,
};
fs.writeFileSync('.local-dev/question-new-content-20261104/artifact-verification.json', JSON.stringify(summary, null, 2) + '\n');
console.log(JSON.stringify(summary, null, 2));
