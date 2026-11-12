// One final source-population correction, not a new fact or external check.
// Preserve the original broad-run snapshot and disclose this exact subsequent edit.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {hash} from './preservation.mjs';
const dir='.local-dev/question-new-n2-round2-20261104';
const path='packages/clinical-content/src/question-new-n2-round2-perioperative.ts';
const before=fs.readFileSync(path,'utf8');
const snapshot=JSON.parse(fs.readFileSync(dir+'/owned-runtime-inputs.json','utf8'));
assert.equal(hash(before),snapshot.files.find(f=>f.path===path).sha256);
let after=before.replace('second procedure requiring fasting','second elective procedure with planned prolonged fasting')
 .replace('ERCP with fasting begins 48 hours after this visit','Elective ERCP with planned prolonged fasting begins 48 hours after this visit')
 .replace('Empagliflozin labeling advises a preprocedure interruption of at least three days when possible.',
  'Empagliflozin labeling advises interruption for at least three days when possible before surgery or a procedure associated with prolonged fasting.')
 .replace('The upcoming procedure is 48 hours away; a dose now cannot preserve a three-day preprocedure interruption.',
  'The elective procedure with planned prolonged fasting is 48 hours away; a dose now cannot preserve the directly supported three-day preprocedure interruption.');
assert.notEqual(after,before);
fs.writeFileSync(dir+'/perioperative-before-final-source-scope.ts',before);
fs.writeFileSync(path,after);
fs.writeFileSync(dir+'/post-snapshot-clarifications.json',JSON.stringify([{path,beforeSha256:hash(before),afterSha256:hash(after),
 changedOn:new Date().toISOString(),item:'sglt2-postoperative-restart',
 reason:'The recorded FDA claim explicitly qualifies procedures by prolonged fasting. Specify the elective prolonged-fasting plan and retain that qualification in the explanation; do not generalize the exact three-day interval to every brief fast.',
 scope:'One question context, explanation and manual check; no choice/ID, concept, demographic, timing, source statement or runtime behavior change.',
 requiredRechecks:['Unmodified cue linter / packet generation','Focused clinical projection/provenance tests','Native N2 admission/supply/frozen-save tests'],
 sourceRecord:'claim.gs028e.sglt2.empagliflozin-preoperative-interruption; original recorded date, no retrieval.'}],null,2)+'\n');
console.log('Specified the source-qualified elective prolonged-fasting context; original broad-run snapshot retained.');
