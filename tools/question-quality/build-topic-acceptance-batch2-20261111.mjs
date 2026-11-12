import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {validateSyntheticClinicalRelease} from '../../packages/clinical-content/src/schema.ts';
import {PROGRAM_BATCH1_VIEWS} from '../../packages/clinical-content/src/question-program-batch1-accepted-data-20261111.ts';
const before = JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch2-before-20261111.json', 'utf8'));
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const decision = 'docs/research/question-topic-acceptance-batch2-20261111.md';
function output(path, text) {
  if (process.argv.includes('--check')) assert.equal(fs.readFileSync(path, 'utf8'), text, path + ' stale');
  else fs.writeFileSync(path, text);
}
const selected = before.topics.flatMap(topic => topic.candidates.filter(row => row.runtime.clinicAdmissible)
  .map(row => ({...row, topic:topic.config.slug})));
const firstIntake = JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json', 'utf8'));
const existingConcepts = new Map(firstIntake.default.concepts.map(concept => [concept.id, concept]));
for (const concept of Object.values(PROGRAM_BATCH1_VIEWS).flatMap(view => view.concepts))
  if (!existingConcepts.has(concept.id)) existingConcepts.set(concept.id, concept);
assert.equal(existingConcepts.size, before.default.conceptIds.length);
for (const [id, concept] of existingConcepts) assert.equal(digest(concept), before.default.conceptHashes[id], id);
const stageAdjustments = [];
const cases = selected.map(row => {
  const floor = Math.max(row.case.earliestFacilityStage,
    ...row.records.map(record => existingConcepts.get(record.concept.id)?.earliestFacilityStage ?? record.concept.earliestFacilityStage));
  if (floor !== row.case.earliestFacilityStage) stageAdjustments.push({caseId:row.case.id,
    before:row.case.earliestFacilityStage, after:floor, reason:'Preserve the existing registered meaning\'s facility-stage floor.'});
  return {...row.case, earliestFacilityStage:floor, learningSummary:row.case.decisionNodes.map(node => node.explanation).join(' ')};
});
const views = Object.fromEntries(before.topics.map(topic => {
  const records = selected.filter(row => row.topic === topic.config.slug);
  const concepts = [...new Map(records.flatMap(row => row.records.map(record => record.concept)).map(co => [co.id, co])).values()]
    .map(co => ({id:co.id, displayName:co.displayName, learningObjective:co.learningObjective,
      earliestFacilityStage:co.earliestFacilityStage, conceptType:co.conceptType}));
  const release = validateSyntheticClinicalRelease({id:'clinical.synthetic.prototype.v1', schemaVersion:1,
    publicationStatus:'synthetic_unapproved_prototype', disclaimer:'Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.',
    concepts, cases:cases.filter(cs => records.some(record => record.case.id === cs.id))});
  return ['topic-batch2-' + topic.config.slug, release];
}));
const rows = selected.flatMap(row => row.records.map(record => ({acceptanceId:record.question.id, caseId:row.case.id,
  nodeId:record.node.id, questionVariantId:record.question.id, conceptId:record.node.primaryConceptId,
  sourceView:'topic-batch2-' + row.topic, decision})));
const replacements = [], consolidations = [];
for (const row of selected) {
  if (!row.legacyCaseIds.length) continue;
  const target = row.records.find(record => record.legacyRewrites.length).question.id;
  if (row.legacyCaseIds.length === 1) replacements.push({replaces:row.legacyCaseIds[0], with:target});
  else consolidations.push({id:'topic-program.' + row.topic + '.20261111', program:'topic-program',
    replaces:row.legacyCaseIds, with:target, decision});
}
const retiredIds = new Set([...replacements.map(row => row.replaces), ...consolidations.flatMap(row => row.replaces)]);
const retired = before.default.retainedCases.filter(cs => retiredIds.has(cs.id));
assert.equal(retired.length, retiredIds.size);
const questions = selected.flatMap(row => row.records.map(record => record.question));
const timing = selected.flatMap(row => row.timing);
const orders = timing.flatMap(entry => entry.classification.kind === 'test_choices' ? entry.classification.choices
  .filter(choice => choice.timing.kind === 'test').map(choice => ({caseId:entry.caseId, nodeId:entry.nodeId,
    questionVariantId:entry.questionVariantId, choiceId:choice.choiceId, choiceLabel:choice.choiceLabel,
    timingProfileId:choice.timing.timingProfileId, disposition:{kind:'not_executed', reason:'future_planned'}})) : []);
const frozen = selected.map(row => ({topic:row.topic, caseId:row.case.id, rawCaseSha256:digest(row.case),
  retainedCaseSha256:digest(cases.find(cs => cs.id === row.case.id)),
  nodes:row.records.map(record => ({nodeId:record.node.id, questionVariantId:record.question.id,
    conceptId:record.node.primaryConceptId, nodeSha256:digest(record.node), questionSha256:digest(record.question), reviewPath:record.evidence.path}))}));
const lengthResiduals = cases.flatMap(cs => cs.decisionNodes.flatMap(node => {
  const correct = node.answerChoices.find(choice => choice.isCorrect);
  const longestDistractor = Math.max(...node.answerChoices.filter(choice => !choice.isCorrect).map(choice => choice.label.length));
  return correct.label.length > longestDistractor ? [{caseId:cs.id, questionVariantId:node.questionVariantId, correctLength:correct.label.length, longestDistractor}] : [];
}));
const dispositions = before.topics.flatMap(topic => topic.requested.map(record => {
  const chosen = selected.find(row => row.case.decisionNodes.some(node => node.id === record.nodeId));
  return {...record, topic:topic.config.slug, status:chosen ? 'accepted' : 'skipped',
    caseId:chosen?.case.id ?? record.contexts[0].caseId,
    reason:chosen ? 'Complete PASS-only case admitted in the existing clinic.' : 'Reviewed case includes scored nodes outside the manager PASS list.',
    unlistedSiblingIds:[...new Set(record.contexts.flatMap(context => context.unlistedSiblingIds))]};
}));
const json = value => JSON.stringify(value, null, 2);
const declarations = [
  ['ROWS', 'QuestionShipAcceptance[]', rows], ['REPLACEMENTS', 'QuestionShipCaseReplacement[]', replacements],
  ['CONSOLIDATIONS', 'QuestionShipTopicConsolidation[]', consolidations],
  ['VIEWS', 'Record<string,SyntheticClinicalRelease>', views], ['QUESTIONS', '(QuestionVariant & Record<string,unknown>)[]', questions],
  ['TIMINGS', 'AnswerChoiceTimingRegistryEntry[]', timing], ['RETIRED_CASES', 'SyntheticClinicalCase[]', retired],
  ['CLAIMS', '(Omit<EvidenceClaim,"evidenceCategory"> & {evidenceCategory:EvidenceClaim["evidenceCategory"] | "applied_science"} & Record<string,unknown>)[]', before.claims],
  ['SOURCES', '(ClinicalSource & Record<string,unknown>)[]', before.sources],
].map(([name,type,value]) => `export const PROGRAM_BATCH2_${name}: ${type} = ${json(value)};`).join('\n');
output('packages/clinical-content/src/question-program-batch2-accepted-data-20261111.ts',
  'import type {QuestionShipAcceptance,QuestionShipCaseReplacement,QuestionShipTopicConsolidation} from "./question-ship-manifest";\n' +
  'import type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";\n' +
  'import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";\n' + declarations + '\n' +
  [['ORDERS',orders], ['FROZEN',frozen], ['LENGTH_RESIDUALS',lengthResiduals],
    ['AUTHORED_CONCEPTS',selected.flatMap(row => row.records.map(record => record.concept))]]
    .map(([name,value]) => `export const PROGRAM_BATCH2_${name} = ${json(value)} as const;`).join('\n') + '\n');
output('packages/clinical-content/src/question-program-batch2-accepted-20261111.ts',
`import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {PROGRAM_BATCH2_ROWS,PROGRAM_BATCH2_VIEWS,PROGRAM_BATCH2_TIMINGS,PROGRAM_BATCH2_ORDERS} from "./question-program-batch2-accepted-data-20261111";
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_ROWS = PROGRAM_BATCH2_ROWS;
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_SOURCE_VIEWS = PROGRAM_BATCH2_VIEWS;
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_CASES = Object.values(PROGRAM_BATCH2_VIEWS).flatMap(view => view.cases);
function accepted(questionId: string) {
  const row = PROGRAM_BATCH2_ROWS.find(candidate => candidate.questionVariantId === questionId);
  return !!row && QUESTION_SHIP_MANIFEST.accepted.some(candidate =>
    candidate.acceptanceId === row.acceptanceId && candidate.caseId === row.caseId && candidate.nodeId === row.nodeId &&
    candidate.questionVariantId === row.questionVariantId && candidate.conceptId === row.conceptId && candidate.sourceView === row.sourceView);
}
export function withAcceptedQuestionProgramBatch2Concepts(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  const known = new Set(release.concepts.map(concept => concept.id));
  const additions = Object.values(PROGRAM_BATCH2_VIEWS).flatMap(view => view.concepts).filter(concept => {
    if (known.has(concept.id) || !PROGRAM_BATCH2_ROWS.some(row => row.conceptId === concept.id && accepted(row.questionVariantId))) return false;
    known.add(concept.id);
    return true;
  });
  return {...release, concepts:[...release.concepts, ...additions]};
}
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_TIMING_ENTRIES = PROGRAM_BATCH2_TIMINGS.filter(row => accepted(row.questionVariantId));
export const QUESTION_PROGRAM_BATCH2_ACCEPTED_TEST_ORDER_RECORDS = PROGRAM_BATCH2_ORDERS.filter(row => accepted(row.questionVariantId));
export {PROGRAM_BATCH2_QUESTIONS as QUESTION_PROGRAM_BATCH2_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH2_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH2_AUTHORED_CONCEPTS,
  PROGRAM_BATCH2_REPLACEMENTS as QUESTION_PROGRAM_BATCH2_REPLACEMENTS,
  PROGRAM_BATCH2_CONSOLIDATIONS as QUESTION_PROGRAM_BATCH2_CONSOLIDATIONS,
  PROGRAM_BATCH2_RETIRED_CASES as QUESTION_PROGRAM_BATCH2_RETAINED_CASES,
  PROGRAM_BATCH2_CLAIMS as QUESTION_PROGRAM_BATCH2_CLAIMS,PROGRAM_BATCH2_SOURCES as QUESTION_PROGRAM_BATCH2_SOURCES,
  PROGRAM_BATCH2_FROZEN as QUESTION_PROGRAM_BATCH2_FROZEN_PRESERVATION,
  PROGRAM_BATCH2_LENGTH_RESIDUALS as QUESTION_PROGRAM_BATCH2_LENGTH_RESIDUALS} from "./question-program-batch2-accepted-data-20261111";
`);
output('docs/research/question-topic-acceptance-batch2-dispositions-20261111.json', json({checkedOn:'2026-11-11',
  requested:43, accepted:rows.length, cases:cases.length, skipped:dispositions.filter(row => row.status === 'skipped').length, stageAdjustments,
  items:dispositions, replacements, consolidations, frozen,
  sourceViews:Object.entries(views).map(([name,view]) => ({name, cases:view.cases.length, nodes:view.cases.flatMap(cs => cs.decisionNodes).length, sha256:digest(view)}))}) + '\n');
console.log(json({nodes:rows.length, cases:cases.length, retiredCases:retired.length, replacements:replacements.length,
  consolidations:consolidations.length, orders:orders.length, lengthResiduals:lengthResiduals.length}));
