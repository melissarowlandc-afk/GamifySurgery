import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const migration=read('tools/question-quality/fixtures/question-harden1-n3r4-acceptance-source-migration-20261110.json');
const before=read('tools/question-quality/fixtures/question-harden1-n3r4-acceptance-before-20261110.json');
const hash=buffer=>createHash('sha256').update(buffer).digest('hex');
const groups=[
 ['Accepted runtime / tests','packages/clinical-content/src/',[
  'question-harden1-n3r4-accepted-20261110.ts','question-harden1-n3r4-accepted-data-20261110.ts',
  'question-harden1-n3r4-acceptance-test-support.ts','question-harden1-n3r4-acceptance-20261110.test.ts']],
 ['Exact external-only timing bindings','packages/game-domain/src/',['question-harden1-n3r4-test-orders.ts']],
 ['Format3 / journal witnesses','apps/player/src/',['questionHarden1N3r4SaveCompatibility.test.ts']],
 ['Isolated hernia round2 draft','packages/clinical-content/src/',[
  'question-harden1-round2-20261110.ts','question-harden1-round2-20261110-data.ts','question-harden1-round2-20261110.test.ts']],
 ['Offline capture / generation / checking','tools/question-quality/',[
  'capture-question-harden1-n3r4-acceptance-20261110.mjs','integrate-question-harden1-n3r4-20261110.mjs',
  'record-question-harden1-n3r4-source-migration-20261110.mjs','review-question-harden1-n3r4-acceptance-20261110.mjs',
  'author-question-harden1-round2-20261110.mjs','record-question-harden1-n3r4-validation-20261110.mjs',
  'record-question-harden1-n3r4-files-20261110.mjs']],
 ['Immutable intake and exact migration','tools/question-quality/fixtures/',[
  'question-harden1-n3r4-acceptance-before-20261110.json','question-harden1-n3r4-source-expansion-20261110.json',
  'question-harden1-n3r4-acceptance-source-migration-20261110.json']],
 ['Raw lint / scope receipts','tools/question-quality/',[
  'question-harden1-n3r4-acceptance-lint-20261110.json','question-harden1-n3r4-acceptance-scope-20261110.json',
  'question-harden1-round2-lint-20261110.json']],
 ['Plan','docs/execplans/',['question-harden1-n3r4-acceptance-20261110.md']],
 ['Decision / handoffs / review / provenance','docs/research/',[
  'question-harden1-n3r4-manager-decision-20261110.md','question-harden1-n3r4-accepted-20261110.json',
  'question-harden1-n3r4-acceptance-handoff-20261110.md','question-harden1-n3r4-validation-20261110.json',
  'question-harden1-round2-20261110.json','question-harden1-round2-handoff-20261110.md','sources-question-harden1-round2-20261110.json']],
];
const fileReceipt='docs/research/question-harden1-n3r4-files-20261110.json';
const rows=[...migration.files.map(({path,beforeSha256,afterSha256})=>({path,status:'modified',role:'Exact authorized existing-file delta; immutable preimage in migration fixture.',beforeSha256,expectedAfter:afterSha256})),
 ...groups.flatMap(([role,root,names])=>names.map(name=>({path:root+name,status:'new',role}))),
 {path:before.sharedHandoffPrefix.path,status:'appended',role:'Shared handoff: preserve entire captured prefix.',beforeSha256:before.sharedHandoffPrefix.sha256},
 {path:fileReceipt,status:'new',role:'This file; self-hash intentionally omitted.'}];
assert.equal(new Set(rows.map(r=>r.path)).size,rows.length);
for(const row of rows){if(row.path===fileReceipt)continue;const bytes=fs.readFileSync(row.path);row.bytes=bytes.length;row.afterSha256=hash(bytes);
 if(row.expectedAfter){assert.equal(row.afterSha256,row.expectedAfter,row.path);delete row.expectedAfter;}}
assert.equal(hash(fs.readFileSync(before.sharedHandoffPrefix.path).subarray(0,before.sharedHandoffPrefix.bytes)),before.sharedHandoffPrefix.sha256);
const receipt={checkedOn:'2026-11-10',scope:'Explicit owned file list only. No Git used. Private local logs/pretext scratch are excluded; exact public-safe test summaries are in the validation receipt.',
 counts:{modified:rows.filter(r=>r.status==='modified').length,new:rows.filter(r=>r.status==='new').length,appended:1,total:rows.length},
 files:rows,originalHandoffPrefix:{...before.sharedHandoffPrefix,preserved:true},
 preservedLanes:['apps/player/src/session/cloud/**','supabase/**','Level5 evidence/pins/tests','statistics questions','N3 writer source files','GS-release/perf/port work'],
 selfHashPolicy:'The receipt has no self-hash. All other owned outputs are hashed after the final handoff append.'};
fs.writeFileSync(fileReceipt,JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify(receipt.counts));
