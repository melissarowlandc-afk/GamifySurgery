// The source file is read only. Generates this lane's native integration tests.
import fs from 'node:fs';
let s=fs.readFileSync('packages/game-domain/tests/question-new-n2-round2-admission.test.ts','utf8');
s=s.replaceAll('QUESTION_NEW_N2_ROUND2','QUESTION_NEW_N1_ROUND3').replaceAll('QUESTION_NEW_N2_CASES','QUESTION_NEW_N1_ROUND2_CASES')
 .replaceAll('N2 round two','N1 round three').replaceAll('n2r2','n1r3').replaceAll('case.n2.','case.n1.').replaceAll('question.n2.','question.n1.')
 .replaceAll('21','17').replaceAll('16 preserved','14 preserved').replaceAll('sixteen','fourteen');
s=s.replace('case.n1.factor-assays-without-mixing-gate.v1','case.n1.postoperative-ascites-ct.v1')
 .replaceAll('question.n1.factor-assays-without-mixing-gate.v1','question.n1.postoperative-ascites-ct.v2');
s=s.replace('["sglt2-postoperative-restart", "naloxone-response-recurrence", "refeeding-baseline-phosphate-attribution", "bile-leak-duct-continuity-boundary", "positive-likelihood-ratio"]',
 '["direct-inguinal-anatomy", "breast-calcification", "lymphedema-new-swelling", "respiratory-acidosis", "vka-pcc-selection"]');
s=s.replace('pervious','previous');
fs.writeFileSync('packages/game-domain/tests/question-new-n1-round3-admission.test.ts',s,{flag:'wx'});
