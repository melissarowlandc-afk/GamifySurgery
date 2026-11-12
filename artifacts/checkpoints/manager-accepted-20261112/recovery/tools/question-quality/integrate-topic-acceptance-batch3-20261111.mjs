import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {PROGRAM_BATCH3_ROWS as rows, PROGRAM_BATCH3_REPLACEMENTS as replacements,
  PROGRAM_BATCH3_CONSOLIDATIONS as consolidations} from '../../packages/clinical-content/src/question-program-batch3-accepted-data-20261111.ts';
const directory = 'packages/clinical-content/src/';
function replaceOnce(source, anchor, replacement) {
  assert.equal(source.split(anchor).length, 2, 'Unique integration anchor ' + anchor);
  return source.replace(anchor, replacement);
}
const manifestPath = directory + 'question-ship-manifest.ts';
let manifest = fs.readFileSync(manifestPath, 'utf8');
assert(manifest.includes('question-ship.2026-11-11.v11'), 'One-shot integration already completed');
manifest = replaceOnce(manifest, 'question-ship.2026-11-11.v11', 'question-ship.2026-11-11.v12');
manifest = replaceOnce(manifest, '\n] satisfies QuestionShipAcceptance[],',
  '\n  // Manager-accepted complete topic cases, batch 3.\n' + JSON.stringify(rows, null, 2).slice(1,-1).trimStart() + ',\n] satisfies QuestionShipAcceptance[],');
manifest = replaceOnce(manifest, '  replacements: [', '  replacements: [\n' + replacements.map(row => '    ' + JSON.stringify(row) + ',').join('\n'));
manifest = replaceOnce(manifest, '  topicConsolidations: [', '  topicConsolidations: [\n' + consolidations.map(row => '    ' + JSON.stringify(row) + ',').join('\n'));
manifest = replaceOnce(manifest, '  headerSources: {', '  headerSources: {\n' +
  [...new Map(rows.map(row => [row.caseId, row.sourceView]))].map(([id, view]) => '    ' + JSON.stringify(id) + ': ' + JSON.stringify(view) + ',').join('\n'));
fs.writeFileSync(manifestPath, manifest);
const sourcePath = directory + 'synthetic-content.ts';
let source = 'import {QUESTION_PROGRAM_BATCH3_ACCEPTED_SOURCE_VIEWS,withAcceptedQuestionProgramBatch3Concepts} from "./question-program-batch3-accepted-20261111";\n' + fs.readFileSync(sourcePath, 'utf8');
const start = source.indexOf('projectManagerAcceptedQuestions(') + 'projectManagerAcceptedQuestions('.length;
let depth = 0, end = start;
for (; end < source.length; end++) {
  if (source[end] === '(') depth++;
  else if (source[end] === ')') depth--;
  else if (source[end] === ',' && depth === 0) break;
}
assert(start > 50 && end < source.length);
source = source.slice(0,start) + 'withAcceptedQuestionProgramBatch3Concepts(' + source.slice(start,end) + ')' + source.slice(end);
source = replaceOnce(source, ', QUESTION_FLAGS_PRE_REVISION_RELEASE, {', ', QUESTION_FLAGS_PRE_REVISION_RELEASE, {\n  ...QUESTION_PROGRAM_BATCH3_ACCEPTED_SOURCE_VIEWS,');
fs.writeFileSync(sourcePath, source);
fs.appendFileSync(directory + 'index.ts', '\nexport * from "./question-program-batch3-accepted-20261111";\n');
fs.appendFileSync(directory + 'answer-choice-timing.ts', '\nimport {QUESTION_PROGRAM_BATCH3_ACCEPTED_TIMING_ENTRIES} from "./question-program-batch3-accepted-20261111";\nANSWER_CHOICE_TIMING_REGISTRY.push(...QUESTION_PROGRAM_BATCH3_ACCEPTED_TIMING_ENTRIES);\n');
console.log(JSON.stringify({rows:rows.length, replacements:replacements.length, consolidations:consolidations.length}));
