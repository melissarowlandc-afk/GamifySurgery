import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease} from './bank.mjs';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');
const raw=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before=read('tools/question-quality/fixtures/question-harden1-n3r4-acceptance-before-20261110.json');
const intake=read('tools/question-quality/fixtures/question-harden1-before-20261110.json');
const migration=read('tools/question-quality/fixtures/question-harden1-n3r4-acceptance-source-migration-20261110.json');
const c=await import('../../packages/clinical-content/src/index.ts');
const accepted=await import('../../packages/clinical-content/src/question-harden1-n3r4-accepted-20261110.ts');
const preview=await import('../../packages/clinical-content/src/question-harden1-round2-20261110.ts');
const rows=accepted.QUESTION_HARDEN1_N3R4_ACCEPTED_ROWS,cases=accepted.QUESTION_HARDEN1_N3R4_ACCEPTED_CASES;
const q=accepted.QUESTION_HARDEN1_N3R4_ACCEPTED_QUESTIONS;
const current=c.SYNTHETIC_CLINICAL_RELEASE;
assert.equal(sha(current),'01d239ea464a3cbdffd345b107a4035576922a4b143ea57f5c49f0752123ebf4');
assert.equal(sha(c.QUESTION_SHIP_MANIFEST),'164db3d76d2f380d8ef3035e981dc703f05e2e6cf820a483cdd4dc7660946eaa');
assert.equal(sha(c.QUESTION_CATALOG_RELEASE),before.catalogSha256);
assert.equal(sha(accepted.QUESTION_HARDEN1_ACCEPTANCE_SOURCE),before.harden1.sourceSha256);
assert.equal(sha(accepted.QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE),before.n3.sourceSha256);
for(const cs of current.cases.filter(cs=>before.default.caseIds.includes(cs.id)))assert.equal(sha(cs),before.default.caseHashes[cs.id],cs.id+' changed');
for(const co of current.concepts.filter(co=>before.default.conceptIds.includes(co.id)))assert.equal(sha(co),before.default.conceptHashes[co.id],co.id+' changed');
assert.equal(current.cases.some(cs=>cs.id===before.oldCase.id),false);
assert.deepEqual(current.cases.filter(cs=>!before.default.caseIds.includes(cs.id)),cases);
for(const question of q){assert.equal(question.reviewStatus,'needs_clinician_review');assert.equal(question.lastClinicianReview,null);
 assert.deepEqual(question,[...before.harden1.questions,...before.n3.questions].find(old=>old.id===question.id));}
assert.equal(current.cases.some(cs=>cs.id===preview.QUESTION_HARDEN1_ROUND2_CASES[0].id),false);
for(const f of migration.files){assert.equal(raw(f.path),f.afterSha256,f.path+' unauthorized postimage');assert.equal(createHash('sha256').update(f.beforeText).digest('hex'),f.beforeSha256);}
const prefix=fs.readFileSync(before.sharedHandoffPrefix.path).subarray(0,before.sharedHandoffPrefix.bytes);
assert.equal(createHash('sha256').update(prefix).digest('hex'),before.sharedHandoffPrefix.sha256);
const metadata=collectAuthoredMetadata(c),lint=inventoryRelease({...current,cases},metadata);
const keyFirst=(cs,n)=>({variantId:n.questionVariantId,Presentation:cs.presentation.replaceAll('{patientName}',cs.patientDisplayName),
 'Current update':n.currentUpdate??null,Exhibit:n.exhibit??null,Task:n.stem.replaceAll('{patientName}',cs.patientDisplayName),
 Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const packet=rows.map((r,i)=>{const cs=cases[i],n=cs.decisionNodes[0],question=q.find(q=>q.id===r.questionVariantId);
 const source=r.sourceView==='harden1-round1'?accepted.QUESTION_HARDEN1_ACCEPTANCE_SOURCE:accepted.QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE;
 return {...r,questionVariantId:n.questionVariantId,reviewStatus:'needs_clinician_review',clinicalApproval:false,
  authority:'Manager exact editorial acceptance, 2026-11-10; no clinician approval conferred.',keyOrderNotice:'key shown first for review only; runtime answer choices are randomized',
  relation:i===0?{replaces:before.oldCase.id,with:r.questionVariantId}:null,
  before:i===0?keyFirst(before.oldCase,before.oldCase.decisionNodes[0]):null,after:keyFirst(cs,n),explanation:question.explanation,
  supportingEvidenceClaimIds:question.supportingEvidenceClaimIds,
  sourceReview:i===0?'docs/research/question-harden1-review-20261110.json':'docs/research/question-new-n3-round4-review-20261110.json',
  lint:lint.variants.find(v=>v.questionVariantId===n.questionVariantId)?.findings??[],
  frozenPreservation:{sourceView:r.sourceView,sourceReleaseSha256:sha(source),acceptedCaseSha256:sha(cs),acceptedQuestionSha256:sha(question),
   previousDefaultSha256:before.default.sha256,previousManifestSha256:before.manifestSha256},
  preservation:'Only fresh projection changes. Existing frozen questions and FSRS identities are not rewritten; format3 snapshot/journal witnesses exercise the actual new default.',
 };});
const bound=read('tools/qa/level-five-integration-results-20261012.json').inputs;
const boundChanges=migration.files.filter(f=>Object.hasOwn(bound,f.path)).map(f=>({path:f.path,recordedEvidenceSha256:bound[f.path],beforeMilestoneSha256:f.beforeSha256,afterSha256:f.afterSha256,
 alreadyDifferentBefore:bound[f.path]!==f.beforeSha256}));
const changedElsewhere=Object.entries(before.files).filter(([p,h])=>fs.existsSync(p)&&raw(p)!==h&&!migration.files.some(f=>f.path===p)).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:raw(path),scope:'Observed shared work only; not edited or reconciled by this milestone.'}));
const counts=release=>({cases:release.cases.length,nodes:release.cases.flatMap(c=>c.decisionNodes).length,registeredMeanings:release.concepts.length,
 scoredMeanings:new Set(release.cases.flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size,questionVersions:new Set(release.cases.flatMap(c=>c.decisionNodes.map(n=>n.questionVariantId))).size});
const previousCases=[...current.cases.filter(cs=>!cases.some(a=>a.id===cs.id)),before.oldCase];
const scope={checkedOn:'2026-11-10',before:{...counts({cases:previousCases,concepts:before.default.conceptIds}),
  defaultSha256:before.default.sha256,manifestSha256:before.manifestSha256,acceptedRows:before.manifest.accepted.length,timingRows:before.timing.length},
 after:{...counts(current),defaultSha256:sha(current),manifestId:c.QUESTION_SHIP_MANIFEST.id,manifestSha256:sha(c.QUESTION_SHIP_MANIFEST),acceptedRows:c.QUESTION_SHIP_MANIFEST.accepted.length,
  legacyBindings:c.QUESTION_SHIP_MANIFEST.legacyBindings.length,wholeCaseRelations:c.QUESTION_SHIP_MANIFEST.replacements.length,timingRows:c.ANSWER_CHOICE_TIMING_REGISTRY.length},
 acceptedRows:rows,oldCaseWithheldFromFresh:true,catalogUnchanged:true,oldCasesExact:current.cases.filter(cs=>before.default.caseIds.includes(cs.id)).length,
 oldRegisteredMeaningsExact:before.default.conceptIds.length,liveHerniaPairUnchanged:true,newHerniaAccepted:false,
 statisticsCasesChecked:Object.keys(intake.statisticsCaseHashes).length,statisticsCasesUnchanged:Object.entries(intake.statisticsCaseHashes).every(([id,h])=>sha(current.cases.find(cs=>cs.id===id))===h),
 reviewHashes:{harden1:raw('docs/research/question-harden1-review-20261110.json'),n3round4:raw('docs/research/question-new-n3-round4-review-20261110.json')},
 sourceHashes:{harden1:sha(accepted.QUESTION_HARDEN1_ACCEPTANCE_SOURCE),n3round4:sha(accepted.QUESTION_N3R4_RETAINED_ACCEPTANCE_SOURCE)},
 migrationDeltas:migration.files.map(({beforeText,...r})=>r),changedElsewhere,sharedHandoffPrefixUnchanged:true,
 levelFiveBoundInputsChanged:boundChanges,newRuntimeInputs:['packages/clinical-content/src/question-harden1-n3r4-accepted-20261110.ts','packages/clinical-content/src/question-harden1-n3r4-accepted-data-20261110.ts','packages/game-domain/src/question-harden1-n3r4-test-orders.ts'],
 newlyReferencedExistingSources:['question-harden1-20261110.ts','question-harden1-20261110-data.ts','question-harden1-evidence-20261110.ts','question-harden1-retained-input-20261110.ts',
  'question-new-n3-round4-20261110.ts','question-new-n3-round4-candidates.ts','question-new-n3-round4-evidence-20261110.ts','question-new-n3-round4-types.ts'].map(name=>{
   const path='packages/clinical-content/src/'+name;assert.equal(raw(path),before.files[path]);return {path,sha256:raw(path),unchanged:true,listedInPriorEvidenceInputs:Object.hasOwn(bound,path)};}),
 rebindPerformed:false,rawAcceptanceLintFindings:lint.totals.findings};
const write=(p,value)=>{const text=JSON.stringify(value,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),text,p+' stale');else fs.writeFileSync(p,text);};
write('docs/research/question-harden1-n3r4-accepted-20261110.json',packet);
write('tools/question-quality/question-harden1-n3r4-acceptance-lint-20261110.json',lint);
write('tools/question-quality/question-harden1-n3r4-acceptance-scope-20261110.json',scope);
console.log(JSON.stringify({counts:scope.after,boundChanges,changedElsewhere,acceptanceLint:lint.totals.findings,herniaDraftSource:sha(preview.QUESTION_HARDEN1_ROUND2_SOURCE_RELEASE)}));
