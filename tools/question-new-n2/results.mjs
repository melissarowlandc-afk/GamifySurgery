// Offline review/source/supply receipts. Never changes N1 or canonical evidence.
import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const content=await import('../../packages/clinical-content/src/index.ts');
const batch=await import('../../packages/clinical-content/src/question-new-n2-20261104.ts');
const {clinicalCaseHasSupportedPatientSemantics}=await import('../../packages/game-domain/src/clinical-case-eligibility.ts');
const dir='.local-dev/question-new-n2-20261104';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=v=>createHash('sha256').update(v).digest('hex');
const baseline=read(`${dir}/baseline.json`),packet=read('docs/research/question-new-n2-20261104.json'),lint=read(`${dir}/lint-n2.json`);
assert.equal(packet.label,'Key shown first for review only');
assert.equal(packet.variants.length,39);assert.equal(lint.totals.findings,0);
assert.equal(packet.reviewStatus,'needs_clinician_review');assert.equal(packet.pipelinePassed,false);
for(const [i,row]of packet.variants.entries()){
  assert.deepEqual(row.authoredTemplate,batch.QUESTION_NEW_N2_CASES[i]);
  assert.equal(row.exactVersionSha256,hash(JSON.stringify(batch.QUESTION_NEW_N2_CASES[i])));
  assert.ok(row.clinicalCase.presentation.includes(row.clinicalCase.patientDisplayName));
  assert.equal(row.clinicalCase.decisionNodes[0].answerChoices[0].isCorrect,true);
}
const n1Freeze=Object.entries(baseline.n1FrozenFiles).map(([p,sha256])=>({path:p,sha256,unchanged:hash(fs.readFileSync(p))===sha256}));
assert.ok(n1Freeze.every(p=>p.unchanged),'N1 data/review artifact changed; preserve concurrent work and report it.');
assert.equal(hash(JSON.stringify(content.QUESTION_NEW_N1_CASES)),baseline.n1CasesSha256);
assert.equal(hash(JSON.stringify(content.QUESTION_NEW_N1_QUESTIONS)),baseline.n1QuestionsSha256);
const before=content.QUESTION_NEW_N2_PRE_RELEASE;
// Isolate this append from concurrent later rewrite projections; record live totals separately.
const {validateSyntheticClinicalRelease}=await import('../../packages/clinical-content/src/schema.ts');
const after=validateSyntheticClinicalRelease({...before,
  concepts:[...before.concepts,...batch.QUESTION_NEW_N2_TESTED_CONCEPTS],
  cases:[...before.cases,...batch.QUESTION_NEW_N2_CASES]});
const integrated=content.SYNTHETIC_CLINICAL_RELEASE;
const supported=(release,level)=>release.cases.filter(c=>c.routineEligible&&!c.participant&&c.earliestFacilityStage<=level&&clinicalCaseHasSupportedPatientSemantics(c));
const ids=cases=>new Set(cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId)));
const variants=cases=>new Set(cases.flatMap(c=>c.decisionNodes.map(n=>n.questionVariantId)));
const stages=[0,1,2,3,4].map(level=>{
  const prior=supported(before,level),current=supported(after,level);
  const priorLevel=ids(supported(before,level-1)),currentPriorLevel=ids(supported(after,level-1));
  return {level,preN2Cases:prior.length,withN2Cases:current.length,preN2PatientConcepts:ids(prior).size,withN2PatientConcepts:ids(current).size,
    preN2Variants:variants(prior).size,withN2Variants:variants(current).size,
    preN2NewlyUnlocked:[...ids(prior)].filter(id=>!priorLevel.has(id)).length,
    withN2NewlyUnlocked:[...ids(current)].filter(id=>!currentPriorLevel.has(id)).length,
    N2NewlyUnlocked:batch.QUESTION_NEW_N2_ITEMS.filter(i=>i.level===level).length};
});
const categories=[...new Set(batch.QUESTION_NEW_N2_ITEMS.map(i=>i.category))].sort().map(category=>({category,
  level3:batch.QUESTION_NEW_N2_ITEMS.filter(i=>i.category===category&&i.level===3).length,
  level4:batch.QUESTION_NEW_N2_ITEMS.filter(i=>i.category===category&&i.level===4).length}));
const publicationKey=s=>s.doi?`doi:${s.doi.trim().toLowerCase()}`:s.officialUrl?`url:${s.officialUrl.split(/[?#]/)[0].replace(/\/$/,'').toLowerCase()}`:`citation:${s.completeCitation.trim().toLowerCase()}`;
const sourceLedger={checkedLocallyOn:'2026-11-04',reviewStatus:'needs_clinician_review',sourceVerification:batch.QUESTION_NEW_N2_BATCH_MANIFEST.sourceVerification,
  independenceNote:'Source-record IDs are not independent publications. DOI/official-URL keys are recorded for transparency, not proof of independent corroboration.',
  coverageSource:read('docs/research/sources-question-new-n1-20261104.json').coverageSource,
  clinicalSources:batch.QUESTION_NEW_N2_SOURCES,atomicClaims:batch.QUESTION_NEW_N2_CLAIMS,inheritedClaimProvenance:batch.QUESTION_NEW_N2_CLAIM_PROVENANCE};
fs.writeFileSync('docs/research/sources-question-new-n2-20261104.json',JSON.stringify(sourceLedger,null,2)+'\n');
const result={checkedOn:'2026-11-04',basis:'Offline code/catalog verification, no owner save, telemetry, network, Git or fresh source retrieval.',
  registeredConcepts:after.concepts.length,cases:after.cases.length,nodes:after.cases.flatMap(c=>c.decisionNodes).length,
  activePatientConcepts:ids(supported(after,4)).size,activeEmployeeConcepts:ids(after.cases.filter(c=>c.routineEligible&&c.participant)).size,
  preN2ReleaseStillMatchesBaseline:hash(JSON.stringify(before))===baseline.releaseSha256,
  censusAssembly:'Pre-N2 preserved release plus the N2 append, before concurrent later rewrite projections.',
  currentReleaseSha256:hash(JSON.stringify(after)),
  currentIntegratedRelease:{sha256:hash(JSON.stringify(integrated)),registeredConcepts:integrated.concepts.length,
    cases:integrated.cases.length,nodes:integrated.cases.flatMap(c=>c.decisionNodes).length,
    activePatientConcepts:ids(supported(integrated,4)).size,
    activeEmployeeConcepts:ids(integrated.cases.filter(c=>c.routineEligible&&c.participant)).size,
    stages:[0,1,2,3,4].map(level=>({level,patientConcepts:ids(supported(integrated,level)).size}))},
  N2Concepts:batch.QUESTION_NEW_N2_TESTED_CONCEPTS.length,N2Variants:packet.variants.length,
  N2Levels:{3:batch.QUESTION_NEW_N2_ITEMS.filter(i=>i.level===3).length,4:batch.QUESTION_NEW_N2_ITEMS.filter(i=>i.level===4).length},
  stages,categories,claims:batch.QUESTION_NEW_N2_CLAIMS.length,sourceRecords:batch.QUESTION_NEW_N2_SOURCES.length,
  distinctSourcePublicationKeys:new Set(batch.QUESTION_NEW_N2_SOURCES.map(publicationKey)).size,
  claimsWithOnePublication:batch.QUESTION_NEW_N2_CLAIM_PROVENANCE.filter(p=>p.sourcePublicationKeys.length===1).length,
  newMathematicalMappings:batch.QUESTION_NEW_N2_CLAIM_PROVENANCE.filter(p=>!p.statementUnchanged).length,
  exhibits:batch.QUESTION_NEW_N2_CASES.filter(c=>c.decisionNodes[0].exhibit).length,
  timedTestingChoices:batch.QUESTION_NEW_N2_TIMING_ENTRIES.reduce((n,t)=>n+(t.classification.kind==='test_choices'?t.classification.choices.filter(c=>c.timing.kind==='test').length:0),0),
  keyedTerminalTestingChoices:batch.QUESTION_NEW_N2_TIMING_ENTRIES.reduce((n,t)=>n+(t.classification.kind==='test_choices'?t.classification.choices.filter(c=>c.timing.kind==='test'&&batch.QUESTION_NEW_N2_CASES.find(cs=>cs.id===t.caseId).decisionNodes[0].answerChoices.find(a=>a.id===c.choiceId).isCorrect).length:0),0),
  cueLinter:{version:lint.linterVersion,findings:lint.totals.findings,variants:lint.totals.uniqueVariants,finiteProfileContexts:lint.totals.profileContexts},
  N1Freeze:{files:n1Freeze,runtimeCasesUnchanged:true,authoringQuestionsUnchanged:true,questionCount:40},
  withheldCandidates:[{slug:'esophageal-motor-study-after-structural-assessment',reason:'Matches the already registered stable concept.achalasia.high-resolution-manometry. Not admitted or re-IDed merely to create unseen supply.'}],
  limitations:['Every new decision boundary and difficulty remains an author proposal for independent clinical/editorial review, including overlap with listed existing objectives.',
    'Stage census assumes compatible capabilities operational; it is not the actual owner campaign or a measured typical player.',
    'Source freshness is not verified; five mathematical mappings are explicit derivations, not new empirical clinical facts.',
    'No new medical execution, hospital service, scheduler, FSRS, progression or save format. Full-suite concurrency and failures are reported separately.']};
fs.writeFileSync(`${dir}/artifact-verification.json`,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync('docs/research/question-new-n2-coverage-20261104.json',JSON.stringify({coverageSource:sourceLedger.coverageSource,
  censusAssembly:result.censusAssembly,currentIntegratedRelease:result.currentIntegratedRelease,stages,categories,
  mappings:batch.QUESTION_NEW_N2_ITEMS.map(i=>({conceptId:i.conceptId,level:i.level,category:i.category,nearestExistingConceptIds:i.nearestExistingConceptIds,novelty:i.novelty,constructReviewStatus:'pending_independent_review'})),
  withheldCandidates:result.withheldCandidates},null,2)+'\n');
function files(root){return fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(root,e.name)):[path.join(root,e.name).replaceAll('\\','/')]);}
if(process.argv.includes('--freeze-validation-inputs')){
  const target=`${dir}/inputs-before-full.json`;if(fs.existsSync(target))throw new Error('Full-run input snapshot already captured; preserve it.');
  const watched=['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','apps/player/src','packages/balance-config/src','tools/question-quality','tests/fixtures']
    .flatMap(files).filter(p=>/\.(ts|tsx|mjs|json)$/.test(p));
  fs.writeFileSync(target,JSON.stringify({capturedAt:new Date().toISOString(),files:Object.fromEntries(watched.map(p=>[p,hash(fs.readFileSync(p))]))},null,2)+'\n');
}
console.log(JSON.stringify({concepts:result.N2Concepts,levels:result.N2Levels,claims:result.claims,sourceRecords:result.sourceRecords,
  distinctSourcePublicationKeys:result.distinctSourcePublicationKeys,claimsWithOnePublication:result.claimsWithOnePublication,
  mathematicalMappings:result.newMathematicalMappings,exhibits:result.exhibits,timedTestingChoices:result.timedTestingChoices,
  lintFindings:result.cueLinter.findings,N1FrozenFilesUnchanged:n1Freeze.length,preN2MatchesBaseline:result.preN2ReleaseStillMatchesBaseline,stages},null,2));
