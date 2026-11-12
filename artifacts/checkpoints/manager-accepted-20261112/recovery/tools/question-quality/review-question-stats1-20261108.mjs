import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
import {intake,specs,methods} from './question-stats1-specs-20261108.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const s=await import('../../packages/clinical-content/src/question-stats1-20261108.ts');
const meta=collectAuthoredMetadata({...c,...s}),view=s.QUESTION_STATS1_SOURCE_RELEASE;
const beforeLint=inventoryRelease(s.QUESTION_STATS1_RETAINED_INPUT,meta),afterLint=inventoryRelease(view,meta);
const sha=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const fileSha=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const words=text=>String(text??'').trim().split(/\s+/).filter(w=>/[A-Za-z0-9]/.test(w)).length;
const visible=v=>typeof v==='string'?[v]:Array.isArray(v)?v.flatMap(visible):v&&typeof v==='object'?Object.entries(v).filter(([k])=>!['kind','assetPath'].includes(k)).flatMap(([,v])=>visible(v)):[];
const render=(v,name)=>typeof v==='string'?v.replaceAll('{patientName}',name):Array.isArray(v)?v.map(x=>render(x,name)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,render(x,name)])):v;
const display=(cs,node,name)=>({variantId:node.questionVariantId,Presentation:render(cs.presentation,name),'Current update':render(node.currentUpdate??null,name),
 Exhibit:render(node.exhibit??null,name),Task:render(node.stem,name),Options:[...node.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label),
 Explanation:node.explanation});
const countFields=fields=>{
 const prose=words([fields.Presentation,fields['Current update']].filter(Boolean).join(' ')),exhibit=words(visible(fields.Exhibit).join(' ')),task=words(fields.Task);
 return {proseBeforeTask:prose,exhibit,combinedBeforeTask:prose+exhibit,task,combinedIncludingTask:prose+exhibit+task,
  explanation:words(fields.Explanation),explanationLines:fields.Explanation.split(/\n/).filter(Boolean).length};
};
const rationalePairs=node=>[...node.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale??node.explanation]);
function disposition(f){
 const reason=f.rule==='unique-key-test-name'?'All three choices are named statistical tests. The small clinical lexicon recognizes chi-square but omits McNemar and analysis of variance; this is not a sole-test option set.':
 f.rule==='option-length-disparity'?'All labels are the standard names of comparable statistical procedures. The longest label is the fully written analysis-of-variance name, a distractor here; there is no causal clause or unequal scope. Keep this conservative word-count warning visible for independent review.':
 f.rule==='unique-key-abbreviation'?'Roman II and Roman I use the same conventional type-number notation; the lexicon detects II as an abbreviation but cannot detect one-character I. Type I is keyed in the sibling. No added information is unique to the key.':
 'Manual review still required; warning remains visible and is not suppressed.';
 return {id:f.id,rule:f.rule,status:'advisory_retained_for_independent_review',reason};
}
const records=specs.map(spec=>{
 const old=intake.targets.find(t=>t.id===spec.id),r=s.QUESTION_STATS1_REVISIONS.find(r=>r.auditId===spec.id),cs=view.cases.find(cs=>cs.id===r.caseId),node=cs.decisionNodes[0];
 const name=r.patientName,beforeName=old.clinicalCase.patientDisplayName.includes('{')?'Jordan Ellis':old.clinicalCase.patientDisplayName;
 const b=display(old.clinicalCase,old.node,beforeName),a=display(cs,node,name),bc=countFields(b),ac=countFields(a);
 assert(ac.combinedBeforeTask<=60,spec.id+' hard cap');assert(ac.proseBeforeTask<=45,spec.id+' prose target');
 assert.equal(node.primaryConceptId,old.node.primaryConceptId,spec.id+' stable concept');
 const before=beforeLint.variants.find(v=>v.questionVariantId===old.node.questionVariantId),after=afterLint.variants.find(v=>v.questionVariantId===node.questionVariantId);
 const removed=bc.combinedBeforeTask-ac.combinedBeforeTask;
 const whatChanged=spec.id==='S54'?'Keep the existing target-benefit interval objective, but ask only its classification. Remove the redundant null-test result and downstream study-plan choice.':
  spec.id==='S42'?'Keep the collection-before-transfer population discriminator; one compact positive-result table replaces the audit narrative. Ask only for PPV.':
  `Isolate ${spec.skill.toLowerCase()}; remove the clinical/research backstory and unused data, and teach the method in three short feedback lines.`;
 return {id:spec.id,title:spec.title,round:1,status:'draft_awaiting_independent_review',reviewStatus:'needs_clinician_review',pipelinePassed:false,releaseReady:false,acceptanceAllowed:false,
  ownerDirectionDate:'2026-11-08',sourceView:'stats1-round1',caseId:cs.id,nodeId:node.id,questionVariantId:node.questionVariantId,originalVariantId:old.node.questionVariantId,
  conceptId:node.primaryConceptId,conceptVersion:{meaning:'same',previousConceptId:old.node.primaryConceptId,newConceptId:node.primaryConceptId,reason:spec.versionReason,historyMigration:'None'},
  keyOrderNotice:'key shown first for review only; runtime choices are randomized',
  reviewDisplayNote:'Before is the exact live template at intake; Jordan Ellis renders an unresolved name token. After retains employee versus patient identity and uses the stated review name. No clinical approval implied.',
  before:b,after:a,rationalePairs:{before:rationalePairs(old.node),after:rationalePairs(node)},explanation:{before:old.node.explanation,after:node.explanation,workedLines:spec.explanationLines},
  wordCounts:{definition:'Whitespace-separated tokens containing an ASCII letter or digit. Counts use rendered names. Pre-task prose is Presentation plus Current update; combined counts add all visible exhibit captions, headers, labels and cells, excluding only kind/assetPath. Complaint/header chrome is not a hidden vignette.',
   before:bc,after:ac,removedBeforeTask:removed,target45Met:ac.combinedBeforeTask<=45,hardCap60Met:ac.combinedBeforeTask<=60},
  inference:spec.skill,focus:spec.focus,whatChanged,
  reviewResponse:{ownerNote:'Long, confusing, vague and exhausting statistics questions; use minimal information and one reusable skill.',response:whatChanged,
   independentReview:'Pending. The author one-skill self-check grants neither independent PASS nor clinical sign-off.'},
  selfCheck:{manualReviewCompleted:true,statisticsOwnerException:true,oneConcept:spec.skill,oneRequestedOutput:node.stem,
   coverTheKey:{result:'The task names one quantity, interpretation or method. Apply the stated data structure or definition; no answer uses a missing clinical step.',warnings:after.findings.map(disposition)},
   sameCategory:spec.family==='study-design'?'Named study designs':['independent-t','paired-t','one-way-anova','rank-sum','signed-rank','chi-square','fisher-exact'].includes(spec.family)?'Named statistical tests':
    ['bias-confounding','errors-power'].includes(spec.family)&&spec.number<3?'Named method/error classifications':spec.family==='bias-confounding'?'Named sources of bias':
    spec.options.every(([label])=>/^\d/.test(label))?'Numerical values with a shared requested scale/unit':'Parallel conclusions about the stated statistical target',
   closestWrong:{label:spec.options[1][0],reason:spec.options[1][1]},decidingFinding:spec.focus,singleDefensibleKey:spec.options[0][1],
   methodAndWorkedApplication:spec.explanationLines,unusedInformationReview:'Every value defines the target, assumptions, comparison or a credible denominator/scale error. No secondary clinical management choice or study trivia.',
   deletionTest:`Removed ${removed} pre-task words. Existing participant kind and necessary assumption/denominator context retained; prior clinical stories and jokes are absent.`,
   difficultyIntent:'Focused rule application, intended under one minute for a prepared resident. Qualitative author intent, not a timer or correctness gate. No moderate/hard or independent PASS claim.',
   twoStepRequirement:'Superseded for statistics by owner direction; one method may have ordinary arithmetic operations but no second scored concept.',
   meaningCheck:spec.versionReason,sourceCheck:'Existing permitted ledger facts, source dates unchanged; all numerical observations are labelled constructed.',
  },
  educationalIntent:'focused_statistics_practice',holdStatus:spec.holdStatus,sourceVerificationHold:null,sourceHoldScope:null,
  supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,
  lint:{version:afterLint.linterVersion,before:before.findings,after:after.findings,beforeCount:before.findings.length,afterCount:after.findings.length,profileContexts:after.profileContexts,
   dispositions:after.findings.map(disposition),suppressedFindings:0},
  visibleHistory:{before:render(preAnswerFields(old.clinicalCase,0),beforeName),after:render(preAnswerFields(cs,0),name)},
  encounterContinuity:{previousNodeIds:[old.node.id],candidateNodeIds:[node.id],participantUnchanged:JSON.stringify(cs.participant)===JSON.stringify(old.clinicalCase.participant),
   composition:'Same one-node case and participant eligibility. New exact header/question/timing identity; no result gate, test order or secondary node.',requiresManagerCompositionReview:true},
  proposedAcceptance:{acceptanceId:spec.id,caseId:cs.id,nodeId:node.id,questionVariantId:node.questionVariantId,conceptId:node.primaryConceptId,sourceView:'stats1-round1',
   acceptanceWritten:false,requiredHeaderSource:'stats1-round1',wholeCaseReplacementRequired:false,decisionDocument:'Manager decision after independent review; no acceptance row has been written.'},
  frozenPreservation:{candidateNodeSha256:sha(node),candidateQuestionSha256:sha(r.question),candidateCaseSha256:sha(cs)},
  fallback:{variantId:old.node.questionVariantId,conceptId:old.node.primaryConceptId,caseId:old.clinicalCase.id,nodeId:old.node.id,policy:'Keep this exact live version until manager acceptance; old frozen encounters/cards remain attached to their original identity.'},
 };
});
const summary=values=>({min:Math.min(...values),max:Math.max(...values),mean:values.reduce((n,v)=>n+v,0)/values.length,
 median:[...values].sort((a,b)=>a-b).slice(values.length/2-1,values.length/2+1).reduce((n,v)=>n+v,0)/2});
const lintReport={checkedOn:'2026-11-08',linterVersion:afterLint.linterVersion,scope:'Every candidate node and canonical/finite profile; no suppression, source exclusions or gameplay analytics.',
 before:beforeLint,after:afterLint,totals:{beforeFindings:beforeLint.totals.findings,afterFindings:afterLint.totals.findings,afterVariantsWithFindings:afterLint.totals.variantsWithFindings,
  cases:afterLint.totals.cases,nodes:afterLint.totals.nodeOccurrences,profiles:afterLint.totals.profileContexts,suppressedFindings:0},
 dispositions:records.filter(r=>r.lint.afterCount).map(r=>({id:r.id,questionVariantId:r.questionVariantId,dispositions:r.lint.dispositions}))};
const ledger={checkedOn:'2026-11-08',scope:'Original single-skill methods applications and constructed data; no external article text, question-bank corpus, empirical clinical performance or new medical rule.',
 verification:'Offline reuse of existing records and independent arithmetic/assumption checks. Source accessedOn and basis lastCheckedOn remain their recorded dates; this is not new retrieval or source-currentness verification.',
 clinicianSignoff:'Melissa Rowland; all new versions/applications remain needs_clinician_review.',
 sources:s.QUESTION_STATS1_SOURCES,basisClaims:s.QUESTION_STATS1_BASIS_CLAIMS,claims:s.QUESTION_STATS1_CLAIMS,
 provenance:s.QUESTION_STATS1_CLAIMS.map(cl=>({claimId:cl.id,basis:cl.basisClaimIds.map(id=>{const old=s.QUESTION_STATS1_BASIS_CLAIMS.find(c=>c.id===id);return {claimId:id,sourceIds:old.sourceIds,lastCheckedOn:old.lastCheckedOn,reviewStatus:old.reviewStatus};}),sourceAccessDatesUnchanged:true})),
 methods:Object.fromEntries(Object.entries(methods).map(([id,m])=>[id,{claimId:'claim.stats1.20261108.'+id,basisClaimIds:m.basisClaimIds}])),mappings:s.QUESTION_STATS1_STATEMENT_MAPPINGS,
 independenceLimitation:'Several method claims have one adequate government or handbook source, not multiple independent corroborations. Repeated source records for a URL do not constitute independent sources.',
 uniqueOfficialUrls:new Set(s.QUESTION_STATS1_SOURCES.map(s=>s.officialUrl).filter(Boolean)).size,
};
const scope={checkedOn:'2026-11-08',namedFamilies:intake.families,nodes:records.length,cases:view.cases.length,concepts:view.concepts.length,
 liveBeforeSha256:intake.live.sha256,liveAfterSha256:sha(c.SYNTHETIC_CLINICAL_RELEASE),catalogUnchanged:sha(c.QUESTION_CATALOG_RELEASE)===intake.catalogSha256,
 manifestUnchanged:sha(c.QUESTION_SHIP_MANIFEST)===intake.manifestSha256,globalTimingUnchanged:sha(c.ANSWER_CHOICE_TIMING_REGISTRY)===intake.timingSha256,
 sourceView:'stats1-round1',sourceViewSha256:sha(view),newVariants:records.length,newConceptIds:[],defaultOrBarrelImportsNewModules:false,
 wordCounts:{beforeProse:summary(records.map(r=>r.wordCounts.before.proseBeforeTask)),afterProse:summary(records.map(r=>r.wordCounts.after.proseBeforeTask)),
  beforeCombined:summary(records.map(r=>r.wordCounts.before.combinedBeforeTask)),afterCombined:summary(records.map(r=>r.wordCounts.after.combinedBeforeTask)),
  beforeOver60:records.filter(r=>r.wordCounts.before.combinedBeforeTask>60).length,afterOver45:records.filter(r=>!r.wordCounts.target45Met).length,afterOver60:records.filter(r=>!r.wordCounts.hardCap60Met).length},
 employeeCases:records.filter(r=>s.QUESTION_STATS1_REVISIONS.find(q=>q.auditId===r.id).employeeDiscussion).length,patientCases:records.filter(r=>!s.QUESTION_STATS1_REVISIONS.find(q=>q.auditId===r.id).employeeDiscussion).length,
 existingSourceChanges:Object.entries(intake.files).filter(([p,h])=>fileSha(p)!==h).map(([path,beforeSha256])=>({path,beforeSha256,afterSha256:fileSha(path)})),
 additionalStatistics:intake.additional.map(t=>({id:t.id,caseId:t.clinicalCase.id,questionVariantId:t.node.questionVariantId,conceptId:t.node.primaryConceptId,
  status:'Outside the sixteen explicitly named families; inventoried and unchanged under the stated named-family scope assumption. No content, concept, acceptance or live change.'})),
 changedExistingLevelFiveBoundInputs:[],shipManifestEdited:false,holds:records.filter(r=>r.holdStatus!=='none').map(r=>({id:r.id,reason:r.sourceVerificationHold})),
};
assert.equal(scope.liveAfterSha256,scope.liveBeforeSha256);assert(scope.catalogUnchanged&&scope.manifestUnchanged&&scope.globalTimingUnchanged);
for(const[path,value]of [
 ['docs/research/question-stats1-20261108.json',records],['docs/research/sources-question-stats1-20261108.json',ledger],
 ['tools/question-quality/question-stats1-lint-20261108.json',lintReport],['docs/research/question-stats1-scope-20261108.json',scope],
]){if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(path,'utf8')),value,path+' stale');else fs.writeFileSync(path,JSON.stringify(value,null,2)+'\n');}
console.log(JSON.stringify({scope:{nodes:scope.nodes,concepts:scope.concepts,sourceView:scope.sourceView,sourceViewSha256:scope.sourceViewSha256},wordCounts:scope.wordCounts,
 lint:lintReport.totals,findings:records.filter(r=>r.lint.afterCount).map(r=>({id:r.id,rules:r.lint.after.map(f=>f.rule)})),holds:scope.holds,existingSourceChanges:scope.existingSourceChanges.map(r=>r.path)},null,2));
