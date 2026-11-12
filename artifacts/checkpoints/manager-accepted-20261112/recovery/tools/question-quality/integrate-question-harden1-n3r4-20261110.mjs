import fs from 'node:fs';
import assert from 'node:assert/strict';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-harden1-n3r4-acceptance-before-20261110.json','utf8'));
const dir='packages/clinical-content/src/',decision='docs/research/question-harden1-n3r4-manager-decision-20261110.md';
const hcase=before.harden1.source.cases.find(c=>c.decisionNodes[0].questionVariantId.endsWith('.v3.r3'));
const ncases=before.n3.source.cases.filter(c=>before.acceptedIds.includes('review.n3.'+c.id.slice(8,-3)+'.v4'));
assert(hcase&&ncases.length===2);
const rows=[{acceptanceId:'H1-03',caseId:hcase.id,nodeId:hcase.decisionNodes[0].id,questionVariantId:hcase.decisionNodes[0].questionVariantId,conceptId:hcase.decisionNodes[0].primaryConceptId,sourceView:'harden1-round1',decision},
 ...ncases.map(cs=>({acceptanceId:'review.n3.'+cs.id.slice(8,-3)+'.v4',caseId:cs.id,nodeId:cs.decisionNodes[0].id,questionVariantId:cs.decisionNodes[0].questionVariantId,conceptId:cs.decisionNodes[0].primaryConceptId,sourceView:'n3-round4',decision}))];
const qs=new Set(rows.map(r=>r.questionVariantId));
const data={n3Source:before.n3.source,n3Questions:before.n3.questions.filter(q=>qs.has(q.id)),n3Reviews:before.n3.reviews.filter(r=>rows.some(x=>x.acceptanceId===r.id)),
 n3Timings:before.n3.timings.filter(t=>qs.has(t.questionVariantId)),n3Orders:before.n3.orders.filter(t=>qs.has(t.questionVariantId)),rows};
fs.writeFileSync(dir+'question-harden1-n3r4-accepted-data-20261110.ts','import type {SyntheticClinicalRelease,AnswerChoiceTimingRegistryEntry} from "./schema";\nimport type {QuestionVariant} from "./pilot-schema";\nimport type {QuestionShipAcceptance} from "./question-ship-manifest";\n/** Exact retained N3 review-four view; static representation avoids a catalog cycle. */\nexport const QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE:SyntheticClinicalRelease='+JSON.stringify(data.n3Source,null,2)+';\nexport const QUESTION_N3R4_ACCEPTED_QUESTIONS:QuestionVariant[]='+JSON.stringify(data.n3Questions,null,2)+';\nexport const QUESTION_N3R4_ACCEPTED_REVIEWS='+JSON.stringify(data.n3Reviews,null,2)+' as const;\nexport const QUESTION_N3R4_ACCEPTED_TIMINGS:AnswerChoiceTimingRegistryEntry[]='+JSON.stringify(data.n3Timings,null,2)+';\nexport const QUESTION_HARDEN1_N3R4_ACCEPTANCE_ROWS:QuestionShipAcceptance[]='+JSON.stringify(rows,null,2)+';\n');
function edit(path,from,to){const t=fs.readFileSync(path,'utf8');assert.equal(t.split(from).length,2,path+' unique patch');fs.writeFileSync(path,t.replace(from,to));}
const manifest=dir+'question-ship-manifest.ts';
edit(manifest,'id: "question-ship.2026-11-08.v7"','id: "question-ship.2026-11-10.v8"');
edit(manifest,'  // END FLAGS4 ACCEPTANCE 20261108','  // END FLAGS4 ACCEPTANCE 20261108\n  // BEGIN HARDEN1 / N3R4 exact PASS acceptances 20261110\n'+rows.map(r=>'  '+JSON.stringify(r)+',').join('\n')+'\n  // END HARDEN1 / N3R4 exact PASS acceptances 20261110');
edit(manifest,'  replacements: [','  replacements: [\n    { replaces: '+JSON.stringify(before.oldCase.id)+', with: '+JSON.stringify(rows[0].questionVariantId)+' },');
edit(manifest,'  headerSources: {','  headerSources: {\n'+rows.map(r=>'    '+JSON.stringify(r.caseId)+': '+JSON.stringify(r.sourceView)+',').join('\n'));
edit(dir+'synthetic-content.ts','/** Default runtime content: exact accepted rewrites/new items plus legacy fallback. */','// BEGIN HARDEN1 / N3R4 accepted exact source integration 20261110\nimport {QUESTION_HARDEN1_ACCEPTANCE_SOURCE,QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE,withAcceptedHarden1N3r4Concepts} from "./question-harden1-n3r4-accepted-20261110";\n// END HARDEN1 / N3R4 accepted exact source integration 20261110\n/** Default runtime content: exact accepted rewrites/new items plus legacy fallback. */');
edit(dir+'synthetic-content.ts','projectManagerAcceptedQuestions(withAcceptedQuestionFlags3Concepts(','projectManagerAcceptedQuestions(withAcceptedHarden1N3r4Concepts(withAcceptedQuestionFlags3Concepts(');
edit(dir+'synthetic-content.ts','QUESTION_NEW_N3_PRE_RELEASE.concepts)))))), QUESTION_FLAGS_PRE_REVISION_RELEASE, {','QUESTION_NEW_N3_PRE_RELEASE.concepts))))))), QUESTION_FLAGS_PRE_REVISION_RELEASE, {\n  "harden1-round1": QUESTION_HARDEN1_ACCEPTANCE_SOURCE,\n  "n3-round4": QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE,');
fs.appendFileSync(dir+'index.ts','\n// BEGIN HARDEN1 / N3R4 exact manager acceptance 20261110\nexport * from "./question-harden1-n3r4-accepted-20261110";\nexport * from "./question-new-n3-round4-20261110";\n// END HARDEN1 / N3R4 exact manager acceptance 20261110\n');
edit(dir+'answer-choice-timing.ts','...QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES].map','...QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES, ...QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES].map');
fs.appendFileSync(dir+'answer-choice-timing.ts','\n// BEGIN HARDEN1 / N3R4 exact accepted timing 20261110\nimport {QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES} from "./question-harden1-n3r4-accepted-20261110";\n// END HARDEN1 / N3R4 exact accepted timing 20261110\n');
edit(dir+'answer-choice-timing.test.ts','QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES.length);','QUESTION_FLAGS4_ACCEPTED_TIMING_ENTRIES.length + QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES.length);');
fs.appendFileSync(dir+'answer-choice-timing.test.ts','\nimport {QUESTION_HARDEN1_N3R4_ACCEPTED_TIMING_ENTRIES} from "./question-harden1-n3r4-accepted-20261110";\n');
edit('packages/game-domain/src/test-choice-orders.ts','  ...QUESTION_NEW_N3_ROUND3_TEST_ORDER_RECORDS,','  ...QUESTION_NEW_N3_ROUND3_TEST_ORDER_RECORDS,\n  ...QUESTION_HARDEN1_N3R4_TEST_ORDER_RECORDS,');
fs.appendFileSync('packages/game-domain/src/test-choice-orders.ts','\n// Exact accepted N3R4 external-only identities; no service execution or acceptance check.\nimport {QUESTION_HARDEN1_N3R4_TEST_ORDER_RECORDS} from "./question-harden1-n3r4-test-orders";\n');
console.log(JSON.stringify({rows,wholeCaseReplacement:before.oldCase.id,newTimingEntries:3,newExternalOrderRecords:data.n3Orders.length}));
