import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const root = 'tools/question-quality/fixtures/question-topic-acceptance-batch6-';
const before = JSON.parse(fs.readFileSync(root + 'before-20261112.json', 'utf8'));
const path = root + 'selection-20261112.json';
assert(!fs.existsSync(path), 'Selection capture already exists.');
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const selected = before.topics.flatMap(topic => topic.candidates.filter(candidate => candidate.runtime.clinicAdmissible)
  .map(candidate => ({topic: topic.config.slug, salvage: true, caseId: candidate.case.id,
    rawCaseSha256: digest(candidate.case), runtime: candidate.runtime})));
const nodes = selected.flatMap(item => before.topics.find(topic => topic.config.slug === item.topic)
  .candidates.find(candidate => candidate.case.id === item.caseId).records.map(record => record.node.id));
assert.equal(new Set(nodes).size, nodes.length, 'Exact scored identity occurs once.');
const targets = new Map();
for (const item of selected) {
  const candidate = before.topics.find(topic => topic.config.slug === item.topic).candidates.find(row => row.case.id === item.caseId);
  for (const oldId of candidate.legacyCaseIds) {
    const successors = targets.get(oldId) ?? [];
    successors.push(item.caseId);
    targets.set(oldId, successors);
  }
}
const retirements = [...targets].map(([legacyCaseId, allTargetCaseIds]) => ({legacyCaseId,
  primaryTargetCaseId: allTargetCaseIds[0], allTargetCaseIds, reason: 'Declared source-audit replacement.'}));
const admissionChecks = before.topics.flatMap(topic => topic.candidates.map(candidate => ({caseId: candidate.case.id, runtime: candidate.runtime})));
fs.writeFileSync(path, JSON.stringify({checkedOn: '2026-11-12', selected, duplicates: [], retirements, admissionChecks}, null, 2) + '\n');
console.log(JSON.stringify({cases: selected.length, nodes: nodes.length, retiredCases: retirements.length}));
