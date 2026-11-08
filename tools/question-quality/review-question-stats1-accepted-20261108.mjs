import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const a=await import('../../packages/clinical-content/src/question-stats1-accepted-20261108.ts');
const s=await import('../../packages/clinical-content/src/question-stats1-20261108.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read('tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json');
const responses=read('docs/research/question-stats1-review-response-20261108.json');
const ledger=read('docs/research/sources-question-stats1-20261108.json');
const digest=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const meta=collectAuthoredMetadata({...c,...s,...a});
const originalLint=inventoryRelease(s.QUESTION_STATS1_RETAINED_INPUT,meta);
const reviewedLint=inventoryRelease(s.QUESTION_STATS1_SOURCE_RELEASE,meta);
const afterLint=inventoryRelease(a.QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE,meta);
assert.equal(afterLint.totals.findings,0,'Candidate lint must be zero, with no suppression');
const visible=v=>typeof v==='string'?[v]:Array.isArray(v)?v.flatMap(visible):v&&typeof v==='object'?Object.entries(v).filter(([k])=>!['kind','assetPath'].includes(k)).flatMap(([,v])=>visible(v)):[];
const words=v=>String(v??'').split(/\s+/).filter(w=>/[A-Za-z0-9]/.test(w)).length;
const render=(v,name)=>typeof v==='string'?v.replaceAll('{patientName}',name):Array.isArray(v)?v.map(x=>render(x,name)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,v])=>[k,render(v,name)])):v;
const display=(cs,n,name)=>({variantId:n.questionVariantId,Presentation:render(cs.presentation,name),'Current update':render(n.currentUpdate??null,name),Exhibit:render(n.exhibit??null,name),
 Task:render(n.stem,name),Options:[...n.answerChoices].sort((x,y)=>Number(y.isCorrect)-Number(x.isCorrect)).map(x=>(x.isCorrect?'**KEY:** ':'')+x.label),Explanation:n.explanation});
const count=f=>{const prose=words([f.Presentation,f['Current update']].filter(Boolean).join(' ')),exhibit=words(visible(f.Exhibit).join(' ')),task=words(f.Task);return {
 proseBeforeTask:prose,exhibit,combinedBeforeTask:prose+exhibit,task,combinedIncludingTask:prose+exhibit+task,explanation:words(f.Explanation),explanationLines:f.Explanation.split('\n').length};};
const pairs=n=>[...n.answerChoices].sort((x,y)=>Number(y.isCorrect)-Number(x.isCorrect)).map(x=>[(x.isCorrect?'**KEY:** ':'')+x.label,x.rationale]);
assert.equal(digest(s.QUESTION_STATS1_SOURCE_RELEASE),before.reviewedSourceSha256,'Reviewed source changed');
const records=a.QUESTION_STATS1_ACCEPTED_REVISIONS.map(r=>{
 const old=before.packet.find(p=>p.id===r.auditId),review=before.reviews.find(p=>p.id===r.auditId),response=responses.find(p=>p.id===r.auditId);
 const cs=a.QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE.cases.find(cs=>cs.id===r.caseId),node=cs.decisionNodes[0],f=display(cs,node,r.patientName),wc=count(f);
 const reviewedCs=before.reviewedSource.cases.find(cs=>cs.id===r.caseId),reviewedQ=before.reviewedRevisions.find(p=>p.auditId===r.auditId).question;
 const lint=afterLint.variants.find(v=>v.questionVariantId===r.questionVariantId),row=c.QUESTION_SHIP_MANIFEST.accepted.find(v=>v.acceptanceId===r.auditId);
 assert(wc.combinedBeforeTask<=35,r.auditId+' <=35 visible pre-task words');assert.equal(wc.explanationLines,3);
 assert.deepEqual(cs,c.SYNTHETIC_CLINICAL_RELEASE.cases.find(cs=>cs.id===r.caseId));
 assert(row&&row.questionVariantId===r.questionVariantId&&row.sourceView==='stats1-accepted',r.auditId+' exact acceptance');
 if(review.verdict==='PASS'){assert.deepEqual(cs,reviewedCs);assert.deepEqual(r.question,reviewedQ);assert(!response);}else assert(response);
 const repair=response?.summary??'Keep the exact independently PASS question, choices, explanation, header and case unchanged.';
 return {...old,round:review.verdict==='PASS'?1:2,status:'manager_accepted_unapproved_draft',pipelinePassed:review.verdict==='PASS',releaseReady:true,acceptanceAllowed:true,
  reviewStatus:'needs_clinician_review',clinicalApproval:false,sourceView:'stats1-accepted',questionVariantId:r.questionVariantId,
  managerDecision:'docs/research/question-stats1-manager-decision-20261108.md',independentVerdict:review.verdict,reviewedRoundOne:old.after,
  after:f,rationalePairs:{before:old.rationalePairs.before,reviewedRoundOne:old.rationalePairs.after,after:pairs(node)},
  explanation:{before:old.explanation.before,reviewedRoundOne:old.explanation.after,after:node.explanation,workedLines:node.explanation.split('\n')},
  wordCounts:{...old.wordCounts,reviewedRoundOne:old.wordCounts.after,after:wc,removedBeforeTask:old.wordCounts.before.combinedBeforeTask-wc.combinedBeforeTask,target35Met:true,target45Met:true,hardCap60Met:true},
  whatChanged:repair,reviewResponse:response??{id:r.auditId,summary:repair,notes:[],sourceHold:'none',independentVerdict:'PASS'},
  selfCheck:{...old.selfCheck,oneRequestedOutput:node.stem,decidingFinding:r.focus,
   singleDefensibleKey:node.answerChoices.find(x=>x.isCorrect).rationale,closestWrong:{label:node.answerChoices.find(x=>!x.isCorrect).label,reason:node.answerChoices.find(x=>!x.isCorrect).rationale},
   methodAndWorkedApplication:node.explanation.split('\n'),coverTheKey:{result:'One named statistical task; only necessary assumptions, definitions and constructed data. No extra clinical action, majority-component numeric pattern or pre-answer worked rule.',warnings:[]},
   deletionTest:'The entire rendered context, including all exhibit labels/cells, is '+wc.combinedBeforeTask+' words. Each datum supplies the target, pairing, group count, selection basis or a required assumption; no added backstory.',
   revisedFeedbackAudit:repair,originalIndependentVerdict:review.verdict,manualReviewCompleted:true},
  focus:r.focus,supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,
  lint:{version:afterLint.linterVersion,before:old.lint.before,reviewedRoundOne:old.lint.after,after:lint.findings,beforeCount:old.lint.beforeCount,afterCount:lint.findings.length,profileContexts:lint.profileContexts,suppressedFindings:0,dispositions:[]},
  visibleHistory:{before:old.visibleHistory.before,after:render(preAnswerFields(cs,0),r.patientName)},
  proposedAcceptance:{...old.proposedAcceptance,sourceView:'stats1-accepted',acceptanceWritten:true,questionVariantId:r.questionVariantId,requiredHeaderSource:'stats1-accepted',decisionDocument:'docs/research/question-stats1-manager-decision-20261108.md'},
  frozenPreservation:{acceptedCaseSha256:digest(cs),acceptedNodeSha256:digest(node),acceptedQuestionSha256:digest(r.question),reviewedCaseSha256:digest(reviewedCs),reviewedNodeSha256:digest(reviewedCs.decisionNodes[0]),reviewedQuestionSha256:digest(reviewedQ),
   exactReviewedPass:review.verdict==='PASS',retainedLiveCaseSha256:before.default.caseHashes[r.caseId]},
 };
});
const mean=vs=>vs.reduce((n,v)=>n+v,0)/vs.length;
const stats=key=>{const vs=records.map(r=>r.wordCounts[key].combinedBeforeTask),sorted=[...vs].sort((x,y)=>x-y);return {min:Math.min(...vs),max:Math.max(...vs),mean:mean(vs),median:(sorted[31]+sorted[32])/2};};
const lintReport={checkedOn:'2026-11-08',scope:'All64 accepted statistics nodes and128 canonical/finite profile contexts; zero suppressed',
 originalLive:originalLint,reviewedRoundOne:reviewedLint,accepted:afterLint,totals:{originalFindings:originalLint.totals.findings,reviewedFindings:reviewedLint.totals.findings,acceptedFindings:afterLint.totals.findings,variants:64,profileContexts:128,suppressed:0}};
const sourceLedger={...ledger,scope:'Accepted statistics source: 42 exact PASS plus22 directed repairs; no clinical approval.',sources:a.QUESTION_STATS1_ACCEPTED_SOURCES,
 claims:[...ledger.claims,...a.QUESTION_STATS1_REPAIRED_CLAIMS],mappings:a.QUESTION_STATS1_ACCEPTED_STATEMENT_MAPPINGS,
 additionalProvenance:a.QUESTION_STATS1_REPAIRED_CLAIMS.map(cl=>({claimId:cl.id,basisClaimIds:cl.basisClaimIds,sourceIds:cl.sourceIds,sourceAccessDatesUnchanged:true})),
 archivedClaimPolicy:'Earlier application claims remain in the retained round-one source; repaired versions point at their own new atomic application. No external text or source-currentness claim.',
};
const esc=v=>String(v).replaceAll('|','\\|').replaceAll('\n','<br>');
const table=(hs,rs)=>'| '+hs.join(' | ')+' |\n| '+hs.map(()=> '---').join(' | ')+' |\n'+rs.map(r=>'| '+r.map(esc).join(' | ')+' |').join('\n')+'\n';
const decision=[
 '# Stats1 manager decision - 2026-11-08','',
 'Manager directs acceptance of all64 statistics drafts after the specified22 repairs:42 independent PASS and22 independent REVISE accepted after repair. Neither REVISE nor author self-check is relabelled independent PASS. All remain `needs_clinician_review`, with no named clinical approval implied. Melissa Rowland is clinical sign-off. No deployment or release worktree operation is authorized here.','',
 'Reviews: [A](question-stats1-review-A-20261108.json), [B](question-stats1-review-B-20261108.json). All keyed calculations were independently verified. Scope is the16 explicitly named families; the four additional N2 statistics items remain exact and untouched. The owner statistics style takes precedence over general two-step/moderate-hard targets.','',
 '## Exact acceptance','',
 'Source view `stats1-accepted` / `QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE`; SHA-256 of JSON.stringify: `'+digest(a.QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE)+'`. The reviewed source remains exact: `'+before.reviewedSourceSha256+'`. Per-question, node and complete-case hashes are in [the accepted packet](question-stats1-accepted-20261108.json). Key shown first for review only; runtime choices remain randomized.','',
 table(['ID','Independent verdict','Accepted exact variant','Stable concept'],records.map(r=>[r.id,r.independentVerdict,'`'+r.questionVariantId+'`','`'+r.conceptId+'`'])),
 '## The22 directed revisions','',
 table(['ID','What changed'],responses.map(r=>[r.id,r.summary])),
 'Every individual cue, fairness, explanation and suggestion note has an explicit response in [question-stats1-review-response-20261108.json](question-stats1-review-response-20261108.json) and the packet. The42 PASS case/node/question objects are byte-exact against the immutable reviewed source. Round-one source, claims, packet, intake captures and reviewer files were not refreshed.','',
 '## Integration and residual notes','',
 '- All64 use ordinary one-node overrides and exact header pins; no new whole-case relation or concept. Existing G06 and F3-01 rows are superseded by S42 and S44, yielding71 -2 +64 =133 accepted rows. Every other69 prior row and all1423 legacy bindings stay exact.','- The manager accepts focused/easy practice. Conventional ANOVA/Fisher option-family outliers were explicitly judged acceptable by the reviewer; they remain named statistical procedures, without explanatory qualifiers or filler. Necessary pairing/data-structure overlap on PASS items is retained.','- New total visible pre-task mean '+stats('after').mean.toFixed(4)+' words, range '+stats('after').min+'-'+stats('after').max+'; all64 <=35. All explanations are3lines. Candidate cue lint0 with no suppressions; no gameplay correctness collection or difficulty gate.','- Integration preserves the exact reviewed staff presentation-only profiles (no demographic/vital fields) and the frozen S47 task with its separate rounding instruction. General presentation tests now pin those exact owner-style cases instead of changing PASS content.',
 '- The older literal-character-length check has10 exact accepted statistics residuals: S01-S04, S32, S33, S35, S53, S54 and S57. Conventional names and single-character wording differences remain; each full accepted case and decision is pinned, every residual must still be an actual violation, and no family-wide budget or cue-linter suppression was added.',
 '- The22 repairs are not re-reviewed independent PASS. They are admitted by this manager instruction after author self-check. Sources and clinical sign-off remain separate from editorial acceptance.','- Existing permitted methods ledger supports the23 added atomic claims (22 repaired applications plus the expected-cell formula). Access dates are retained; no network or new empirical clinical rule. No key has a source hold.','',
 'No Git, agents, installs, network, deploy, evidence edit or rebind. The acceptance handoff records closing counts, hashes, tests, known failures and changed Level5 inputs.',''
].join('\n');
for(const[p,v]of [
 ['docs/research/question-stats1-accepted-20261108.json',records],['docs/research/sources-question-stats1-accepted-20261108.json',sourceLedger],
 ['tools/question-quality/question-stats1-accepted-lint-20261108.json',lintReport],
 ['docs/research/question-stats1-manager-decision-20261108.md',decision],
]){const text=typeof v==='string'?v:JSON.stringify(v,null,2)+'\n';if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),text,p+' stale');else fs.writeFileSync(p,text);}
console.log(JSON.stringify({accepted:records.length,exactPass:42,repaired:22,wordCounts:{before:stats('before'),reviewed:stats('reviewedRoundOne'),after:stats('after')},lint:lintReport.totals,sourceViewSha256:digest(a.QUESTION_STATS1_ACCEPTED_SOURCE_RELEASE),manifestSha256:digest(c.QUESTION_SHIP_MANIFEST),liveSha256:digest(c.SYNTHETIC_CLINICAL_RELEASE)},null,2));
