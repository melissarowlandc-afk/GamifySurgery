// One-shot new-module construction from the existing batch infrastructure.
import fs from 'node:fs';import assert from 'node:assert/strict';
const dir='.local-dev/question-new-n2-round3-ship-gate-20261104';
const rows=JSON.parse(fs.readFileSync(`${dir}/intake-items.json`));
const path='packages/clinical-content/src/question-new-n2-round3-20261104.ts';assert.ok(!fs.existsSync(path));
let s=fs.readFileSync('packages/clinical-content/src/question-new-n1-round3-20261104.ts','utf8')
 .replaceAll('QUESTION_NEW_N1','QUESTION_NEW_N2').replaceAll('question-new-n1','question-new-n2')
 .replaceAll('QuestionNewN1','QuestionNewN2').replaceAll('question.n1.','question.n2.').replaceAll('choice.n1r3.','choice.n2r3.')
 .replaceAll('presentation.n1.','presentation.n2.').replaceAll('profile.n1.','profile.n2.').replaceAll('review.n1.','review.n2.')
 .replaceAll('link.n1r3.','link.n2r3.').replaceAll('Missing N1','Missing N2').replaceAll('N1 round-three','N2 round-three');
s=s.replace('import { QUESTION_NEW_N2_ROUND3_BREAST } from "./question-new-n2-round3-breast";',
 'import { QUESTION_NEW_N2_ROUND3_NUTRITION } from "./question-new-n2-round3-nutrition";\nimport { QUESTION_NEW_N2_ROUND3_SPECIALTY } from "./question-new-n2-round3-specialty";\nimport { QUESTION_NEW_N2_ROUND3_RESEARCH } from "./question-new-n2-round3-research";');
s=s.replace('...QUESTION_NEW_N2_ROUND3_BREAST, ...QUESTION_NEW_N2_ROUND3_PERIOPERATIVE',
 '...QUESTION_NEW_N2_ROUND3_NUTRITION, ...QUESTION_NEW_N2_ROUND3_PERIOPERATIVE, ...QUESTION_NEW_N2_ROUND3_SPECIALTY, ...QUESTION_NEW_N2_ROUND3_RESEARCH');
s=s.replace(/export const QUESTION_NEW_N2_ROUND3_FROZEN_PASS_IDS = \[[\s\S]*?\] as const;/,
 `export const QUESTION_NEW_N2_ROUND3_FROZEN_PASS_IDS = ${JSON.stringify(rows.filter(r=>r.review.verdict==='PASS').map(r=>r.review.id),null,2)} as const;`);
s=s.replace('priorReviewCounts:{PASS:9,REVISE:31},variantCount:40,revisedVariantCount:31,frozenPassCount:9',
 'priorReviewCounts:{PASS:12,REVISE:26,FAIL:1},variantCount:39,revisedVariantCount:27,frozenPassCount:12');
s=s.replace('for the 31 revisions','for the 27 revisions');
s=s.replace('Only 31 returned N1 definitions projected. Nine exact PASS cases/questions/metadata retained; N2 definitions, review packets and assets frozen.',
 'Only 27 returned N2 definitions projected. Twelve exact PASS cases/questions/metadata retained; all N1 definitions, review packets and assets frozen. The ship manifest admits only exact manager-accepted versions.');
fs.writeFileSync(path,s);
const order=fs.readFileSync('packages/game-domain/src/question-new-n1-round3-test-orders.ts','utf8').replaceAll('QUESTION_NEW_N1','QUESTION_NEW_N2');
fs.writeFileSync('packages/game-domain/src/question-new-n2-round3-test-orders.ts',order);
console.log('Created new N2 round-three assembly and exact-order helper.');
