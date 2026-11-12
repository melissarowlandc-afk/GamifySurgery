import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-harden1-n3r4-acceptance-before-20261110.json','utf8'));
const texts=JSON.parse(fs.readFileSync('.local-dev/question-harden1-n3r4-acceptance-20261110/before-source-texts.json','utf8'));
const expansion=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-harden1-n3r4-source-expansion-20261110.json','utf8'));
const sha=s=>createHash('sha256').update(s).digest('hex');
const paths=['packages/clinical-content/src/question-ship-manifest.ts','packages/clinical-content/src/synthetic-content.ts','packages/clinical-content/src/index.ts',
 'packages/clinical-content/src/answer-choice-timing.ts','packages/clinical-content/src/answer-choice-timing.test.ts','packages/game-domain/src/test-choice-orders.ts',
 'packages/clinical-content/src/question-flags4-acceptance-test-support.ts','packages/clinical-content/src/question-flags4-acceptance-20261108.test.ts',
 'packages/clinical-content/src/question-harden1-20261110.test.ts','apps/player/src/questionFlags4SaveCompatibility.test.ts',
 'packages/clinical-content/src/question-ship-manifest.test.ts','packages/clinical-content/src/pilot-content.test.ts',
 ...expansion.files.map(f=>f.path)];
const files=paths.map(path=>{const extra=expansion.files.find(f=>f.path===path),text=texts[path]??extra?.beforeText,expected=before.files[path]??extra?.beforeSha256;
 assert.equal(sha(text),expected);return {path,beforeSha256:expected,afterSha256:sha(fs.readFileSync(path)),beforeText:text};});
assert(files.every(f=>f.beforeSha256!==f.afterSha256));
fs.writeFileSync('tools/question-quality/fixtures/question-harden1-n3r4-acceptance-source-migration-20261110.json',JSON.stringify({checkedOn:'2026-11-10',scope:'Eighteen explicit authorized source deltas, including stale acceptance fixtures exposed by full validation. Preimages are immutable; all clinical reviewed definitions stay exact. No capture removed or budget relaxed.',files},null,2)+'\n');
console.log(JSON.stringify({authorizedDeltaCount:files.length,paths}));
