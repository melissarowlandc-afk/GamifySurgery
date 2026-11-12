import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const s=await import('../../packages/clinical-content/src/question-stats1-20261108.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const words=v=>String(v??'').split(/\s+/).filter(w=>/[A-Za-z0-9]/.test(w)).length;
const visible=v=>typeof v==='string'?[v]:Array.isArray(v)?v.flatMap(visible):v&&typeof v==='object'?Object.entries(v).filter(([k])=>!['kind','assetPath'].includes(k)).flatMap(([,v])=>visible(v)):[];
const before=read('tools/question-quality/fixtures/question-stats1-before-20261108.json');
const packet=read('docs/research/question-stats1-20261108.json');
const migration=read('tools/question-quality/fixtures/question-stats1-source-migration-20261108.json');
assert.equal(digest(c.SYNTHETIC_CLINICAL_RELEASE),before.live.sha256);
assert.equal(digest(c.QUESTION_CATALOG_RELEASE),before.catalogSha256);
assert.equal(digest(c.QUESTION_SHIP_MANIFEST),before.manifestSha256);
assert.equal(digest(c.ANSWER_CHOICE_TIMING_REGISTRY),before.timingSha256);
const changed=Object.entries(before.files).filter(([p,h])=>hash(p)!==h).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:hash(path)}));
assert.deepEqual(changed.map(r=>r.path).sort(),migration.files.map(r=>r.path).sort());
for(const row of migration.files){assert.equal(hash(row.path),row.afterSha256);assert.equal(createHash('sha256').update(row.beforeText).digest('hex'),row.beforeSha256);assert.equal(before.files[row.path],row.beforeSha256);}
// Demonstrate that the standard change is exactly one section plus its version
// line, not a broad relaxation of earlier owner rules.
const standard=fs.readFileSync('docs/clinical/question-authoring-standard.md','utf8');
const withoutSection=standard.replace(/## Statistics items\r?\n[\s\S]*?(?=## The decision to test)/,'')
 .replace('Version: `question-authoring.2026-11-08.v15` (owner statistics house style).','Version: `question-authoring.2026-11-04.v14` (owner author self-review gate after N1 independent review).');
assert.equal(withoutSection,before.standardBeforeText);
for(const r of s.QUESTION_STATS1_REVISIONS){
 const p=packet.find(p=>p.id===r.auditId),cs=s.QUESTION_STATS1_SOURCE_RELEASE.cases.find(cs=>cs.id===r.caseId),node=cs.decisionNodes[0];
 assert.equal(digest(cs),p.frozenPreservation.candidateCaseSha256);assert.equal(digest(node),p.frozenPreservation.candidateNodeSha256);
 assert.equal(digest(r.question),p.frozenPreservation.candidateQuestionSha256);
 assert.equal(r.question.reviewStatus,'needs_clinician_review');assert.equal(r.question.lastClinicianReview,null);
 assert.equal(p.conceptId,before.targets.find(t=>t.id===r.auditId).node.primaryConceptId);
 assert(p.wordCounts.target45Met&&p.wordCounts.hardCap60Met);assert.equal(p.holdStatus,'none');
 assert.equal(p.lint.afterCount,0);assert.equal(p.lint.suppressedFindings,0);
 assert(!c.QUESTION_SHIP_MANIFEST.accepted.some(a=>a.questionVariantId===node.questionVariantId));
}
const inventory={capturedOn:'2026-11-08',scope:'All 64 exact live nodes in the sixteen enumerated statistics families. Four additional N2 concepts inventoried separately, not silently included in the named scope.',
 wordCountDefinition:packet[0].wordCounts.definition,keyOrderNotice:'key shown first for review only; runtime choices are randomized',
 rows:packet.map(p=>({id:p.id,family:s.QUESTION_STATS1_REVISIONS.find(r=>r.auditId===p.id).family,
  caseId:p.caseId,nodeId:p.nodeId,conceptId:p.conceptId,currentVariantId:p.originalVariantId,
  currentStemWords:p.wordCounts.before.combinedBeforeTask,currentProseWords:p.wordCounts.before.proseBeforeTask,currentTaskWords:p.wordCounts.before.task,
  currentTask:p.before.Task,currentOptions:p.before.Options,currentExhibit:p.before.Exhibit,
  proposedVariantId:p.questionVariantId,afterStemWords:p.wordCounts.after.combinedBeforeTask,singleSkill:p.inference,whatChanged:p.whatChanged})),
 additionalStatistics:before.additional.map(t=>({id:t.id,caseId:t.clinicalCase.id,nodeId:t.node.id,conceptId:t.node.primaryConceptId,questionVariantId:t.node.questionVariantId,
  task:t.node.stem,options:t.node.answerChoices.map(a=>({label:a.label,isKey:a.isCorrect})),status:'Inventoried; outside the sixteen explicitly enumerated families; unchanged.',
  currentPreTaskWords:words([t.clinicalCase.presentation,t.node.currentUpdate,...visible(t.node.exhibit)].filter(Boolean).join(' ').replaceAll('{patientName}',t.clinicalCase.patientDisplayName.includes('{')?'Jordan Ellis':t.clinicalCase.patientDisplayName)),
  currentTaskWords:words(t.node.stem.replaceAll('{patientName}','Jordan Ellis')),
  reason:'Current N2 objective includes a separate protocol or implementation decision. Extending the one-skill pass to these concepts needs an explicit scope and meaning/version review; no approval requirement is inferred.',
  learningObjective:t.concept.learningObjective})),
};
const integration={checkedOn:'2026-11-08',status:'proposal_only_not_acceptance',sourceView:'stats1-round1',exportName:'QUESTION_STATS1_SOURCE_RELEASE',
 modulePath:'packages/clinical-content/src/question-stats1-20261108.ts',sourceViewSha256:digest(s.QUESTION_STATS1_SOURCE_RELEASE),
 instructions:['Run independent review; accept only exact directed versions, leaving the current live fallback for other items.',
  'For accepted rows, supply the real manager-decision document. This proposal is neither an acceptance nor a placeholder clinical citation.',
  'Add the explicit source view to the existing default projector, pin each accepted header, and replace any superseded acceptance for that case/node rather than duplicate it.',
  'Append exact accepted no_test timing rows; these are statistical analyses, not patient test orders.',
  'All cases remain single-node; no whole-case relation, new concept, selector or history migration is required. Keep all historical bindings/cases/questions.'],
 rows:packet.map(p=>({...p.proposedAcceptance,
  supersedesAcceptanceIds:c.QUESTION_SHIP_MANIFEST.accepted.filter(a=>a.caseId===p.caseId&&a.nodeId===p.nodeId).map(a=>a.acceptanceId),
  frozenPreservation:p.frozenPreservation,reviewStatus:'needs_clinician_review'})),
 timing:s.QUESTION_STATS1_TIMING_ENTRIES,concepts:{stable:18,newIds:[],meaningNotes:packet.filter(p=>['S42','S54'].includes(p.id)).map(p=>({id:p.id,conceptId:p.conceptId,reason:p.conceptVersion.reason}))},
};
const evidence=read('tools/qa/level-five-integration-results-20261012.json');
assert(changed.every(r=>!Object.hasOwn(evidence.inputs,r.path)),'Unexpected bound input edit');
const report={checkedOn:'2026-11-08',liveUnchanged:true,liveSha256:before.live.sha256,manifestUnchanged:true,manifestSha256:before.manifestSha256,
 catalogUnchanged:true,catalogSha256:before.catalogSha256,globalTimingUnchanged:true,globalTimingSha256:before.timingSha256,
 sourceView:'stats1-round1',sourceViewSha256:digest(s.QUESTION_STATS1_SOURCE_RELEASE),candidateCases:64,candidateNodes:64,stableConcepts:18,newConceptIds:[],
 protectedFiles:Object.keys(before.files).length,protectedUnchanged:Object.keys(before.files).length-changed.length,existingChanges:changed,
 standardDeltaExact:true,noExistingRuntimeFilesChanged:true,noDefaultOrBarrelImportAdded:true,noDomainPlayerCloudOrSaveEdit:true,
 levelFive:{evidencePath:'tools/qa/level-five-integration-results-20261012.json',evidenceUnchanged:hash('tools/qa/level-five-integration-results-20261012.json')===before.files['tools/qa/level-five-integration-results-20261012.json'],changedExistingBoundInputs:[],rebound:false},
 additionalScope:'Four additional N2 methods are recorded in the inventory, outside the sixteen enumerated families; no changes applied.',
};
assert(report.levelFive.evidenceUnchanged);
for(const[path,value]of [
 ['docs/research/question-stats1-inventory-20261108.json',inventory],
 ['docs/research/question-stats1-integration-proposal-20261108.json',integration],
 ['docs/research/question-stats1-preservation-20261108.json',report],
]){if(process.argv.includes('--check'))assert.deepEqual(read(path),value,path+' stale');else fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');}
console.log(JSON.stringify({candidates:packet.length,source:report.sourceViewSha256,protectedUnchanged:report.protectedUnchanged,changes:changed.map(r=>r.path),
 supersededRows:integration.rows.filter(r=>r.supersedesAcceptanceIds.length).map(r=>({id:r.acceptanceId,supersedes:r.supersedesAcceptanceIds})),liveUnchanged:report.liveUnchanged,levelFiveInputsChanged:[]},null,2));
