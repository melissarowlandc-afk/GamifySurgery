import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {validateSyntheticClinicalRelease} from '../../packages/clinical-content/src/schema.ts';
const before = JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch5-before-20261111.json', 'utf8'));
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const decision = 'docs/research/question-topic-acceptance-batch5-20261111.md';
const correctionPath = 'tools/question-quality/fixtures/question-topic-acceptance-batch5-literal-name-corrections-20261111.json';
const presentationCorrections = JSON.parse(fs.readFileSync(correctionPath, 'utf8'));
function applyPresentationFields(target, fields) {
  for (const field of fields) {
    let parent = target;
    for (const segment of field.path.slice(0, -1)) parent = parent[segment];
    const key = field.path.at(-1);
    assert.equal(parent[key], field.before, 'Presentation correction source drift');
    parent[key] = field.after;
  }
}
function output(path, text) {
  if (process.argv.includes('--check')) assert.equal(fs.readFileSync(path, 'utf8'), text, path + ' stale');
  else fs.writeFileSync(path, text);
}
const selection = JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-topic-acceptance-batch5-selection-20261111.json', 'utf8'));
const selected = selection.selected.map(item => ({...before.topics.find(topic => topic.config.slug === item.topic).candidates.find(row => row.case.id === item.caseId), topic:item.topic, runtime:item.runtime}));
const existingConcepts = new Map(before.default.concepts.map(concept => [concept.id,concept]));
assert.equal(existingConcepts.size, before.default.conceptIds.length);
for (const [id, concept] of existingConcepts) assert.equal(digest(concept), before.default.conceptHashes[id], id);
const stageAdjustments = [];
const eligibilityAdjustments = [];
const cases = selected.map(row => {
  const floor = Math.max(row.case.earliestFacilityStage,
    ...row.records.map(record => existingConcepts.get(record.concept.id)?.earliestFacilityStage ?? record.concept.earliestFacilityStage));
  if (floor !== row.case.earliestFacilityStage) stageAdjustments.push({caseId:row.case.id,
    before:row.case.earliestFacilityStage, after:floor, reason:'Preserve the existing registered meaning\'s facility-stage floor.'});
  if (!row.case.routineEligible) eligibilityAdjustments.push({caseId:row.case.id,before:false,after:true,
    reason:'Activate the reviewed draft for fresh selection only after exact manager acceptance.'});
  return structuredClone({...row.case, routineEligible:true, earliestFacilityStage:floor, learningSummary:row.case.decisionNodes.map(node => node.explanation).join(' ')});
});
assert.equal(new Set(presentationCorrections.records.map(record => record.caseId)).size, presentationCorrections.records.length);
for (const correction of presentationCorrections.records) {
  const target = cases.find(clinicalCase => clinicalCase.id === correction.caseId);
  assert(target, correction.caseId);
  assert.equal(digest(target), correction.beforeCaseSha256, correction.caseId + ' accepted source drift');
  applyPresentationFields(target, correction.fields.filter(field => field.target === 'case'));
}
const views = Object.fromEntries(before.topics.filter(topic => selected.some(row => row.topic === topic.config.slug)).map(topic => {
  const records = selected.filter(row => row.topic === topic.config.slug);
  const concepts = [...new Map(records.flatMap(row => row.records.map(record => record.concept)).map(co => [co.id, co])).values()]
    .map(co => ({id:co.id, displayName:co.displayName, learningObjective:co.learningObjective,
      earliestFacilityStage:co.earliestFacilityStage, conceptType:co.conceptType}));
  const release = validateSyntheticClinicalRelease({id:'clinical.synthetic.prototype.v1', schemaVersion:1,
    publicationStatus:'synthetic_unapproved_prototype', disclaimer:'Synthetic unapproved topic archive, not clinically approved. Melissa Rowland is clinical sign-off.',
    concepts, cases:cases.filter(cs => records.some(record => record.case.id === cs.id))});
  return ['topic-batch5-' + topic.config.slug, release];
}));
const rows = selected.flatMap(row => row.records.map(record => ({acceptanceId:record.question.id, caseId:row.case.id,
  nodeId:record.node.id, questionVariantId:record.question.id, conceptId:record.node.primaryConceptId,
  sourceView:'topic-batch5-' + row.topic, decision})));
const replacements = [], consolidations = [];
for (const row of selected) {
  const legacyCaseIds = selection.retirements.filter(record => record.primaryTargetCaseId === row.case.id).map(record => record.legacyCaseId);
  if (!legacyCaseIds.length) continue;
  const target = row.records.find(record => record.legacyRewrites.length).question.id;
  if (legacyCaseIds.length === 1) replacements.push({replaces:legacyCaseIds[0], with:target});
  else consolidations.push({id:'topic-program.batch5.' + row.case.id, program:'topic-program',
    replaces:legacyCaseIds, with:target, decision});
}
const retiredIds = new Set([...replacements.map(row => row.replaces), ...consolidations.flatMap(row => row.replaces)]);
const retired = before.default.retainedCases.filter(cs => retiredIds.has(cs.id));
assert.equal(retired.length, retiredIds.size);
const questions = structuredClone(selected.flatMap(row => row.records.map(record => record.question)));
for (const correction of presentationCorrections.records) {
  for (const [questionId, beforeSha256] of Object.entries(correction.beforeQuestionSha256)) {
    const question = questions.find(candidate => candidate.id === questionId);
    assert.equal(digest(question), beforeSha256, questionId + ' reviewed question drift');
    applyPresentationFields(question, correction.fields.filter(field => field.target === questionId));
  }
}
const timingOrderAdjustments = [];
const noTestClassificationAdjustments = [];
const timing = structuredClone(selected.flatMap(row => row.timing)).map(entry => {
  if (entry.classification.kind !== 'test_choices') return entry;
  if (entry.classification.choices.every(choice => choice.timing.kind === 'no_test')) {
    noTestClassificationAdjustments.push({caseId:entry.caseId, nodeId:entry.nodeId, before:entry.classification});
    entry.classification = {kind:'no_test'};
    return entry;
  }
  const node = cases.find(cs => cs.id === entry.caseId).decisionNodes.find(node => node.id === entry.nodeId);
  const original = entry.classification.choices;
  const ordered = node.answerChoices.map(choice => original.find(record => record.choiceId === choice.id));
  assert(ordered.every(Boolean) && ordered.length === original.length, 'Complete timing choices ' + entry.nodeId);
  if (digest(original) !== digest(ordered)) timingOrderAdjustments.push({caseId:entry.caseId, nodeId:entry.nodeId,
    beforeChoiceIds:original.map(choice => choice.choiceId), afterChoiceIds:ordered.map(choice => choice.choiceId)});
  entry.classification.choices = ordered;
  return entry;
});
const orders = timing.flatMap(entry => entry.classification.kind === 'test_choices' ? entry.classification.choices
  .filter(choice => choice.timing.kind === 'test').map(choice => ({caseId:entry.caseId, nodeId:entry.nodeId,
    questionVariantId:entry.questionVariantId, choiceId:choice.choiceId, choiceLabel:choice.choiceLabel,
    timingProfileId:choice.timing.timingProfileId, disposition:{kind:'not_executed', reason:'future_planned'}})) : []);
const frozen = selected.map(row => ({topic:row.topic, caseId:row.case.id, rawCaseSha256:digest(row.case),
  retainedCaseSha256:digest(cases.find(cs => cs.id === row.case.id)),
  nodes:row.records.map(record => ({nodeId:record.node.id, questionVariantId:record.question.id,
    conceptId:record.node.primaryConceptId,
    nodeSha256:digest(cases.find(cs => cs.id === row.case.id).decisionNodes.find(node => node.id === record.node.id)),
    questionSha256:digest(questions.find(question => question.id === record.question.id)), reviewPath:record.evidence.path}))}));
const lengthResiduals = cases.flatMap(cs => cs.decisionNodes.flatMap(node => {
  const correct = node.answerChoices.find(choice => choice.isCorrect);
  const longestDistractor = Math.max(...node.answerChoices.filter(choice => !choice.isCorrect).map(choice => choice.label.length));
  return correct.label.length > longestDistractor ? [{caseId:cs.id, questionVariantId:node.questionVariantId, correctLength:correct.label.length, longestDistractor}] : [];
}));
const dispositions = before.topics.flatMap(topic => topic.requested.map(record => {
  const chosen = selected.find(row => row.case.decisionNodes.some(node => node.id === record.nodeId));
  const unavailable = topic.candidates.find(row => row.records.some(item => item.node.id === record.nodeId));
  const runtimeAdmissionIssue = !chosen && unavailable ?
    (selection.admissionChecks.find(check=>check.caseId===unavailable.case.id)?.runtime.issue ?? unavailable.runtime.issue) : null;
  return {...record, topic:topic.config.slug, status:chosen ? 'accepted' : 'skipped',
    caseId:chosen?.case.id ?? record.contexts[0].caseId,
    reason:chosen ? 'Complete PASS-only case admitted through its existing clinic participant route.' : record.evidence?.record.verdict !== 'PASS' ? 'The exact requested node has no current PASS verdict in its applicable review.' : runtimeAdmissionIssue ? runtimeAdmissionIssue : 'Reviewed case includes scored nodes outside the manager PASS list.',
    runtimeAdmissionIssue,
    unlistedSiblingIds:[...new Set(record.contexts.flatMap(context => context.unlistedSiblingIds))]};
}));
const acceptedClaimIds=new Set(questions.flatMap(question=>question.supportingEvidenceClaimIds));
const acceptedClaims=before.claims.filter(claim=>acceptedClaimIds.has(claim.id));
const acceptedSourceIds=new Set(acceptedClaims.flatMap(claim=>claim.sourceIds));
const acceptedSources=before.sources.filter(source=>acceptedSourceIds.has(source.id));
const json = value => JSON.stringify(value, null, 2);
const declarations = [
  ['ROWS', 'QuestionShipAcceptance[]', rows], ['REPLACEMENTS', 'QuestionShipCaseReplacement[]', replacements],
  ['CONSOLIDATIONS', 'QuestionShipTopicConsolidation[]', consolidations],
  ['VIEWS', 'Record<string,SyntheticClinicalRelease>', views], ['QUESTIONS', '(QuestionVariant & Record<string,unknown>)[]', questions],
  ['TIMINGS', 'AnswerChoiceTimingRegistryEntry[]', timing], ['RETIRED_CASES', 'SyntheticClinicalCase[]', retired],
  ['CLAIMS', '(Omit<EvidenceClaim,"evidenceCategory" | "certainty"> & {evidenceCategory:EvidenceClaim["evidenceCategory"] | "applied_science" | "treatment" | "medication_safety" | "microbiology"; certainty:EvidenceClaim["certainty"] | "limited"} & Record<string,unknown>)[]', acceptedClaims],
  ['SOURCES', '(Omit<ClinicalSource,"sourceClass" | "reuseStatus" | "publicationDateNote"> & {sourceClass:ClinicalSource["sourceClass"] | "regulatory_label"; reuseStatus:ClinicalSource["reuseStatus"] | "targeted_factual_verification_only"; publicationDateNote?:string | null} & Record<string,unknown>)[]', acceptedSources],
].map(([name,type,value]) => `export const PROGRAM_BATCH5_${name}: ${type} = ${json(value)};`).join('\n');
output('packages/clinical-content/src/question-program-batch5-accepted-data-20261111.ts',
  'import type {QuestionShipAcceptance,QuestionShipCaseReplacement,QuestionShipTopicConsolidation} from "./question-ship-manifest";\n' +
  'import type {SyntheticClinicalRelease,SyntheticClinicalCase,AnswerChoiceTimingRegistryEntry} from "./schema";\n' +
  'import type {QuestionVariant,EvidenceClaim,ClinicalSource} from "./pilot-schema";\n' + declarations + '\n' +
  [['ORDERS',orders], ['FROZEN',frozen], ['LENGTH_RESIDUALS',lengthResiduals],
    ['AUTHORED_CONCEPTS',selected.flatMap(row => row.records.map(record => record.concept))]]
    .map(([name,value]) => `export const PROGRAM_BATCH5_${name} = ${json(value)} as const;`).join('\n') + '\n');
output('packages/clinical-content/src/question-program-batch5-accepted-20261111.ts',
`import type {SyntheticClinicalRelease} from "./schema";
import {QUESTION_SHIP_MANIFEST} from "./question-ship-manifest";
import {PROGRAM_BATCH5_ROWS,PROGRAM_BATCH5_VIEWS,PROGRAM_BATCH5_TIMINGS,PROGRAM_BATCH5_ORDERS} from "./question-program-batch5-accepted-data-20261111";
export const QUESTION_PROGRAM_BATCH5_ACCEPTED_ROWS = PROGRAM_BATCH5_ROWS;
export const QUESTION_PROGRAM_BATCH5_ACCEPTED_SOURCE_VIEWS = PROGRAM_BATCH5_VIEWS;
export const QUESTION_PROGRAM_BATCH5_ACCEPTED_CASES = Object.values(PROGRAM_BATCH5_VIEWS).flatMap(view => view.cases);
function accepted(questionId: string) {
  const row = PROGRAM_BATCH5_ROWS.find(candidate => candidate.questionVariantId === questionId);
  return !!row && QUESTION_SHIP_MANIFEST.accepted.some(candidate =>
    candidate.acceptanceId === row.acceptanceId && candidate.caseId === row.caseId && candidate.nodeId === row.nodeId &&
    candidate.questionVariantId === row.questionVariantId && candidate.conceptId === row.conceptId && candidate.sourceView === row.sourceView);
}
export function withAcceptedQuestionProgramBatch5Concepts(release: SyntheticClinicalRelease): SyntheticClinicalRelease {
  const known = new Set(release.concepts.map(concept => concept.id));
  const additions = Object.values(PROGRAM_BATCH5_VIEWS).flatMap(view => view.concepts).filter(concept => {
    if (known.has(concept.id) || !PROGRAM_BATCH5_ROWS.some(row => row.conceptId === concept.id && accepted(row.questionVariantId))) return false;
    known.add(concept.id);
    return true;
  });
  return {...release, concepts:[...release.concepts, ...additions]};
}
export const QUESTION_PROGRAM_BATCH5_ACCEPTED_TIMING_ENTRIES = PROGRAM_BATCH5_TIMINGS.filter(row => accepted(row.questionVariantId));
export const QUESTION_PROGRAM_BATCH5_ACCEPTED_TEST_ORDER_RECORDS = PROGRAM_BATCH5_ORDERS.filter(row => accepted(row.questionVariantId));
export {PROGRAM_BATCH5_QUESTIONS as QUESTION_PROGRAM_BATCH5_ACCEPTED_QUESTIONS,
  PROGRAM_BATCH5_AUTHORED_CONCEPTS as QUESTION_PROGRAM_BATCH5_AUTHORED_CONCEPTS,
  PROGRAM_BATCH5_REPLACEMENTS as QUESTION_PROGRAM_BATCH5_REPLACEMENTS,
  PROGRAM_BATCH5_CONSOLIDATIONS as QUESTION_PROGRAM_BATCH5_CONSOLIDATIONS,
  PROGRAM_BATCH5_RETIRED_CASES as QUESTION_PROGRAM_BATCH5_RETAINED_CASES,
  PROGRAM_BATCH5_CLAIMS as QUESTION_PROGRAM_BATCH5_CLAIMS,PROGRAM_BATCH5_SOURCES as QUESTION_PROGRAM_BATCH5_SOURCES,
  PROGRAM_BATCH5_FROZEN as QUESTION_PROGRAM_BATCH5_FROZEN_PRESERVATION,
  PROGRAM_BATCH5_LENGTH_RESIDUALS as QUESTION_PROGRAM_BATCH5_LENGTH_RESIDUALS} from "./question-program-batch5-accepted-data-20261111";
`);
output('docs/research/question-topic-acceptance-batch5-dispositions-20261111.json', json({checkedOn:'2026-11-11',
  requested:before.topics.reduce((n,topic) => n+topic.requested.length,0), accepted:rows.length, cases:cases.length, skipped:dispositions.filter(row => row.status === 'skipped').length, stageAdjustments, eligibilityAdjustments,
  items:dispositions, replacements, consolidations, frozen, retirementCoverage:selection.retirements, duplicateContexts:selection.duplicates,
  sourceViews:Object.entries(views).map(([name,view]) => ({name, cases:view.cases.length, nodes:view.cases.flatMap(cs => cs.decisionNodes).length, sha256:digest(view)})),
  presentationCorrections:{path:correctionPath, sha256:createHash('sha256').update(fs.readFileSync(correctionPath)).digest('hex'),
    caseIds:presentationCorrections.records.map(record => record.caseId), fields:presentationCorrections.records.reduce((count, record) => count + record.fields.length, 0)}, timingOrderAdjustments, noTestClassificationAdjustments}) + '\n');
console.log(json({nodes:rows.length, cases:cases.length, retiredCases:retired.length, replacements:replacements.length,
  consolidations:consolidations.length, orders:orders.length, lengthResiduals:lengthResiduals.length}));
