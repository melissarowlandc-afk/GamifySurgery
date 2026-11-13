import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const output='tools/question-quality/fixtures/question-topic-acceptance-batch8-before-20261112.json';
assert(!fs.existsSync(output),'Do not overwrite an immutable intake');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=b=>createHash('sha256').update(b).digest('hex');
const digest=v=>sha(JSON.stringify(v));
const file=p=>({path:p,sha256:sha(fs.readFileSync(p))});
const content=await import('../../packages/clinical-content/src/index.ts');
const source=await import('../../packages/clinical-content/src/question-owner-decisions-20261112.ts');
const packetPath='docs/research/question-owner-decisions-20261112.json';
const packet=read(packetPath);
const reviews=['review','review2'].map(stage=>{
  const path=`docs/research/question-owner-decisions-${stage}-20261112.json`;
  return {...file(path),records:read(path)};
});
const latest=new Map(reviews.flatMap(r=>r.records.map(record=>[record.id,{path:r.path,record}])));
const second=new Set(['B2B32','B2B34','F13','G07']);
const expected=[
  'question.metabolic-acidosis.albumin-corrected-anion-gap.v1.r4',
  'question.metabolic-acidosis.albumin-corrected-anion-gap.v3.r4',
  'question.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence.v2',
  'question.malignant-hyperthermia-susceptibility.dantrolene-readiness.v1',
  'question.topic.colorectal-polyps-cancer.residual-despite-negative-biopsy.v2',
  'question.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance.v3',
  'question.topic.esophagus-gerd-barrett-hiatal.repair-with-reflux-control.v2',
  'question.gs028f.gynecology.symptomatic-falling-hcg-localization.v2',
  'question.topic.perioperative-risk-recovery.awake-ventilation-assessment.v4',
  'question.ptld.tissue-diagnosis-coordination.v4.r4',
];
assert.deepEqual(source.QUESTION_OWNER_DECISIONS_QUESTIONS.map(q=>q.id),expected);
const live=content.SYNTHETIC_CLINICAL_RELEASE;
const candidates=source.QUESTION_OWNER_DECISIONS_REVISIONS.map(r=>{
  const question=source.QUESTION_OWNER_DECISIONS_QUESTIONS.find(q=>q.id===r.questionVariantId);
  const cs=source.QUESTION_OWNER_DECISIONS_CASES.find(c=>c.id===r.caseId);
  const evidence=latest.get(r.decisionId);
  assert.equal(evidence.record.verdict,'PASS',r.decisionId);
  assert.equal(evidence.record.variantId,question.id,r.decisionId+' reviewed exact version');
  assert(evidence.path.includes(second.has(r.decisionId)?'-review2-':'-review-'));
  assert.equal(cs.decisionNodes.length,1,'Whole incoming reviewed case');
  assert.equal(question.reviewStatus,'needs_clinician_review');
  assert.equal(question.lastClinicianReview,null);
  const previous=live.cases.filter(c=>c.id===cs.id||c.decisionNodes.some(n=>r.previousQuestionVariantIds.includes(n.questionVariantId)));
  return {id:r.decisionId,revision:r,question,case:cs,evidence,
    questionSha256:digest(question),caseSha256:digest(cs),nodeSha256:digest(cs.decisionNodes[0]),
    predecessors:previous,predecessorRows:content.QUESTION_SHIP_MANIFEST.accepted.filter(row=>previous.some(c=>c.id===row.caseId)),
    timing:source.QUESTION_OWNER_DECISIONS_TIMING_ENTRIES.find(t=>t.caseId===cs.id&&t.questionVariantId===question.id)};
});
const neonatalIds=[
  'question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1',
  'question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2',
];
const neonatal=neonatalIds.map(id=>{
  const matches=live.cases.filter(c=>c.decisionNodes.some(n=>n.questionVariantId===id));
  assert.equal(matches.length,1,id);assert.equal(matches[0].decisionNodes.length,1);
  return matches[0];
});
const observed={};
for(const directory of ['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','packages/balance-config/src','apps/player/src']){
  function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){
    const child=p+'/'+e.name;if(e.isDirectory())walk(child);
    else if(/\.(?:ts|tsx)$/.test(e.name))observed[child]=sha(fs.readFileSync(child));
  }}walk(directory);
}
const paths=[
  ...['question-ship-manifest.ts','synthetic-content.ts','index.ts','answer-choice-timing.ts',
    'answer-choice-timing.test.ts','question-ship-manifest.test.ts','pilot-content.test.ts',
    'question-program-batch7-acceptance-test-support.ts','question-program-batch7-acceptance-20261112.test.ts',
    'patient-library-wording-repair.test.ts','playable-patient-narrative.test.ts']
    .map(n=>'packages/clinical-content/src/'+n),
  'packages/game-domain/src/test-choice-orders.ts','packages/game-domain/tests/question-ship-gate.test.ts',
  'apps/player/src/questionProgramBatch7SaveCompatibility.test.ts',
  'apps/player/src/questionProgramBatch7StatisticsAdmission.test.ts',
];
const sourcePreimages=paths.map(path=>({path,beforeSha256:sha(fs.readFileSync(path)),beforeText:fs.readFileSync(path,'utf8')}));
const shared=fs.readFileSync('docs/handoffs/CURRENT_THREAD_HANDOFF.md');
const intake={capturedOn:'2026-11-12',candidates,neonatal,sourceView:source.QUESTION_OWNER_DECISIONS_SOURCE_RELEASE,
  sourceInputs:[file('packages/clinical-content/src/question-owner-decisions-20261112.ts'),file(packetPath),
    file('docs/research/question-owner-decisions-20261112.md'),file('docs/research/owner-decision-answers-20261112.md'),
    ...reviews.map(({records,...r})=>r)],reviews,ownerDirection:packet.clinicalDecisionApplication,
  claims:source.QUESTION_OWNER_DECISIONS_CLAIMS,sources:source.QUESTION_OWNER_DECISIONS_SOURCES,
  timings:source.QUESTION_OWNER_DECISIONS_TIMING_ENTRIES,orders:source.QUESTION_OWNER_DECISIONS_CANDIDATE_TEST_ORDER_RECORDS,
  defaultRelease:live,defaultSha256:digest(live),manifest:content.QUESTION_SHIP_MANIFEST,
  manifestSha256:digest(content.QUESTION_SHIP_MANIFEST),catalogSha256:digest(content.QUESTION_CATALOG_RELEASE),
  timing:content.ANSWER_CHOICE_TIMING_REGISTRY,timingSha256:digest(content.ANSWER_CHOICE_TIMING_REGISTRY),
  observed,sourcePreimages,sharedHandoff:{bytes:shared.length,sha256:sha(shared)}};
fs.writeFileSync(output,JSON.stringify(intake,null,2)+'\n');
fs.mkdirSync('.local-dev/question-topic-acceptance-batch8-20261112',{recursive:true});
console.log(JSON.stringify({captured:output,candidates:candidates.length,sourceCases:intake.sourceView.cases.length,
  sourceNodes:intake.sourceView.cases.flatMap(c=>c.decisionNodes).length,neonatal:neonatal.map(c=>c.id),
  waits:intake.orders.length,defaultCases:live.cases.length,rows:intake.manifest.accepted.length,preimages:sourcePreimages.length}));
