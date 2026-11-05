import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry,specs} from './question-bank-batch2a-round2-specs-20261104.mjs';
import {responses,checks} from './responses-question-bank-batch2a-round2-20261104.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
import {LINTER_VERSION} from './lint.mjs';
import {OWNER_FLAG_RULES} from './owner-flag-rules-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),m=collectAuthoredMetadata(c),live=c.SYNTHETIC_CLINICAL_RELEASE;
// Roll back only this batch's eight cases. Later independent new-content stages
// remain identical on both sides rather than contaminating this batch's delta.
const touched=new Set(c.QUESTION_BANK_BATCH2A_ROUND2_REVISIONS.map(r=>r.caseId)),ours=new Set(c.QUESTION_BANK_BATCH2A_ROUND2_TESTED_CONCEPTS.map(c=>c.id));
const beforeRelease={...live,concepts:live.concepts.filter(c=>!ours.has(c.id)),cases:live.cases.map(cs=>touched.has(cs.id)?c.QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE.cases.find(old=>old.id===cs.id):cs)};
const config={tutorialCaseIds:[c.FIRST_TUTORIAL_CASE_ID,c.SECOND_TUTORIAL_CASE_ID],pilotRevisions:[...c.QUESTION_QUALITY_CURRENT_REVISIONS,...c.QUESTION_FLAG_REVISIONS,...c.QUESTION_FLAG_ROUND2_REVISIONS,...c.QUESTION_BANK_BATCH2A_REVISIONS,...c.QUESTION_FLAG_ROUND3_REVISIONS,...c.QUESTION_BANK_BATCH2A_ROUND2_REVISIONS]};
const before=inventoryRelease(beforeRelease,m,config),after=inventoryRelease(live,m,config);
const ordered=n=>[n.answerChoices.find(a=>a.isCorrect),...n.answerChoices.filter(a=>!a.isCorrect)];
const named=s=>typeof s==='string'?s.replaceAll('{patientName}','Jamie Taylor'):s;
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:named(cs.presentation),'Current update':named(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:named(n.stem),Options:ordered(n).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const frozen=structuredClone(entry.packet.find(p=>p.id==='B2A01'));
const passReview=entry.review.find(r=>r.id==='B2A01');assert.equal(passReview.verdict,'PASS');
Object.assign(frozen,{pipelinePassed:true,basicAccepted:true,independentReview:{file:'docs/research/question-bank-batch2a-review-20261104.json',verdict:'PASS',exactVariantId:frozen.after.variantId,scope:'Accepted foundational image interpretation only; clinical approval remains pending.'}});
const packets=specs.map(s=>{
 const r=c.QUESTION_BANK_BATCH2A_ROUND2_REVISIONS.find(r=>r.auditId===s.id),cs=live.cases.find(c=>c.id===r.caseId),n=cs.decisionNodes.find(n=>n.id===r.nodeId),oldCs=beforeRelease.cases.find(c=>c.id===r.caseId),oldNode=oldCs.decisionNodes.find(n=>n.id===r.nodeId);
 assert.deepEqual(display(oldCs,oldNode),s.prior.after,'Exact reviewed before '+s.id);
 const noteResponses={};for(const kind of ['cues','fairness','suggestions']){
  assert.equal(responses[s.id][kind].length,s.review[kind].length,s.id+' '+kind);
  noteResponses[kind]=s.review[kind].map((note,i)=>({id:s.id+'.review1.'+kind+'.'+(i+1),note,response:responses[s.id][kind][i],disposition:'addressed_in_author_draft_pending_independent_review'}));
 }
 const a=before.variants.find(v=>v.questionVariantId===oldNode.questionVariantId),b=after.variants.find(v=>v.questionVariantId===n.questionVariantId);assert(a&&b);
  const check={reviewedBy:'author self-check; not independent or clinical sign-off',rubric:'cover-the-key cue attack; same decision stage/category; interpret then apply; PGY-2/3 moderate/hard intent; one defensible best answer with adequate visible context',status:'author_pass_pending_independent_review',...checks[s.id],reasoningSteps:s.steps,clinicalReview:'needs_clinician_review; Melissa Rowland is the named clinical sign-off',initialDraftCorrections:s.id==='B2A04'?['Removed the explicit missing contrast-test sentence.','Added software integral analysis; qualitative peak height does not measure reserve.','Returned contrast observations and later pressure-study chronology are explicit; the following passed item is unchanged.']:s.id==='B2A07'?['Changed referral-only task to a complete care-plan task so continued modified activity also answers it.']:s.id==='B2A08'?['Made all three plan openings parallel to remove component-frequency convergence.']:s.id==='B2A09'?['Removed a superficial-biopsy error adjective and replaced it with a genuine surveillance competitor.']:s.id==='B2A10'?['Removed uniquely comprehensive either-method language from the key.']:s.id==='B2A11'?['Removed the sentence explicitly naming the missing corticotropin result.']:[]};
 return {...s.prior,id:s.id,title:s.title,reviewStatus:'needs_clinician_review',ownerStatus:'standing_program_in_game_flags_no_owner_review_page_gate',keyOrderNotice:'key shown first for review only; runtime options are randomized',reviewDisplayNote:'Before is the exact version assessed in batch-2a review one; after is this additive round-two draft. Jamie Taylor substitutes for patientName in the canonical synthetic profile.',
  caseId:cs.id,nodeId:n.id,conceptId:n.primaryConceptId,previousConceptId:oldNode.primaryConceptId,before:display(oldCs,oldNode),after:display(cs,n),rationalePairs:{before:ordered(oldNode).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale]),after:ordered(n).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale])},
  inference:s.steps.join(' Then: '),focus:s.construct?.objective??live.concepts.find(c=>c.id===n.primaryConceptId).learningObjective,whatChanged:s.change,clinicalMeaning:s.construct?.reason??s.meaning,sourceDecision:s.limitation,
  sourceVerificationHold:null,retainedPriorVersionSourceHold:s.prior.sourceVerificationHold??null,
  reviewResponse:{sourceReview:'docs/research/question-bank-batch2a-review-20261104.json',previousVerdict:s.review.verdict,notes:[...(s.prior.originalOwnerDirection?[{note:s.prior.originalOwnerDirection.note,response:s.change}]:[]),...(s.prior.questionFlags??[]).map(f=>({flagId:f.id,note:f.notes,response:s.change}))],noteResponses,selfCheck:check},
  visibleHistory:{before:preAnswerFields(oldCs,oldCs.decisionNodes.indexOf(oldNode)),after:preAnswerFields(cs,cs.decisionNodes.indexOf(n))},
  encounterContinuity:{beforeGate:oldNode.resultGateAfter,afterGate:n.resultGateAfter,unchangedFollowingVariant:cs.decisionNodes[cs.decisionNodes.indexOf(n)+1]?.questionVariantId??null,note:s.id==='B2A04'?'The corroborating contrast result is raw and does not name the next diagnosis or medication plan. The following item receives a separately identified later full pressure report; its question and current update are byte-preserved.':s.id==='B2A08'?'Current anatomical observations explicitly revise the earlier report label; the preceding item and its result narrative are retained.':'Read the full before/after history; no following task or feedback is rewritten.'},
  supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,previousEvidenceClaimIds:s.prior.supportingEvidenceClaimIds,conceptVersion:s.construct??null,pipelinePassed:false,basicAccepted:false,releaseReady:false,
  lint:{version:LINTER_VERSION,before:a.findings,after:b.findings,beforeCount:a.findings.length,afterCount:b.findings.length},
  lintDispositions:b.findings.map(f=>({findingId:f.id,rule:f.rule,status:'retained_advisory_author_review_pending_independent_review',response:check.cueAttack+' '+check.oneBest})),
  fallback:{entryVariantId:oldNode.questionVariantId,entryConceptId:oldNode.primaryConceptId,retainedSource:'packages/clinical-content/src/synthetic-content.ts#QUESTION_BANK_PRE_BATCH2A_ROUND2_RELEASE',policy:'Manager reconciles actual live release; no worker release or fallback migration is performed.'},
 };
});
const packet=[frozen,...packets];assert.equal(packet.length,11);
const write=(p,x)=>fs.writeFileSync(p,JSON.stringify(x,null,2)+'\n');
write('docs/research/question-bank-batch2a-round2-20261104.json',packet);write('docs/research/question-bank-batch2a-20261104.json',packet);
write('tools/question-quality/question-bank-batch2a-round2-whole-bank-20261104.json',after);
const owner=report=>Object.fromEntries(OWNER_FLAG_RULES.map(rule=>[rule,{variants:report.variants.filter(v=>v.findings.some(f=>f.rule===rule)).length,findings:report.variants.reduce((n,v)=>n+v.findings.filter(f=>f.rule===rule).length,0)}]));
const lint={checkedAt:new Date().toISOString(),linterVersion:LINTER_VERSION,comparison:'Same current N1/N2 definitions on both sides; only ten additive batch-2a replacements differ. No per-player, correctness or time analytics.',before:before.totals,after:after.totals,ownerRulesBefore:owner(before),ownerRulesAfter:owner(after),selected:{items:10,beforeFindings:packets.reduce((n,p)=>n+p.lint.beforeCount,0),afterFindings:packets.reduce((n,p)=>n+p.lint.afterCount,0),beforeOwnerFindings:packets.reduce((n,p)=>n+p.lint.before.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length,0),afterOwnerFindings:packets.reduce((n,p)=>n+p.lint.after.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length,0)}};
write('tools/question-quality/question-bank-batch2a-round2-lint-20261104.json',lint);
const claimIds=new Set(packets.flatMap(p=>[...p.supportingEvidenceClaimIds,...p.previousEvidenceClaimIds]));
for(const id of [...claimIds])for(const b of m.claims.get(id)?.basisClaimIds??[])claimIds.add(b);
const claims=[...claimIds].sort().map(id=>{assert(m.claims.has(id),id);return m.claims.get(id);});
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))].sort(),sources=sourceIds.map(id=>{assert(m.sources.has(id),id);return {...m.sources.get(id),supportedEvidenceClaimIdsThisRound:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),offlineReuseNote:'Retained bibliographic/access/license/authority metadata; no new source text, retrieval or access-date advance.'};});
write('docs/research/sources-question-bank-batch2a-round2-20261104.json',{compiledAt:new Date().toISOString(),policy:'Original offline synthesis using recorded permitted guidance; source authority and reuse status remain separate. Exact applications require clinician review; no source prose/excerpts are stored.',claims,sources,mappings:packets.map(p=>({id:p.id,beforeClaimIds:p.previousEvidenceClaimIds,afterClaimIds:p.supportingEvidenceClaimIds,limitations:p.sourceDecision,retainedPriorVersionHold:p.retainedPriorVersionSourceHold})),imageProvenance:{creator:'Original project schematic generated offline with System.Drawing',asset:'apps/player/public/clinical-exhibits/batch2a-r2-b04-pressure.png',script:'tools/question-quality/draw-question-bank-batch2a-round2-20261104.ps1',reuse:'Original project drawing; no copied figure or patient tracing. Old B01/B03 assets remain byte-exact. Clinical fidelity pending review.'}});
const cell=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
fs.writeFileSync('docs/research/question-bank-batch2a-round2-cue-audit-20261104.md',[
 '# Batch 2a round two: cue audit and author rubric','',
 'B2A01 is frozen after independent PASS in its accepted foundational role. B2A02–B2A11 have additive drafts; all remain needs_clinician_review. Key shown first for review only. An author self-check is not independent review, measured difficulty or clinical approval.','',
 `Same ${LINTER_VERSION}: ${before.totals.uniqueVariants} variants; ${before.totals.profileContexts} / ${after.totals.profileContexts} finite contexts. Whole-bank findings ${before.totals.findings} to ${after.totals.findings}; selected ten ${lint.selected.beforeFindings} to ${lint.selected.afterFindings}. Owner-rule findings among selected ten ${lint.selected.beforeOwnerFindings} to ${lint.selected.afterOwnerFindings}. Concurrent N1/N2 content is identical on both sides.`, '',
 '| Item | Change | Findings before / after |','|---|---|---:|',...packets.map(p=>'| '+[p.id,p.whatChanged,p.lint.beforeCount+' / '+p.lint.afterCount].map(cell).join(' | ')+' |'),'',
 '## Five-part author check','',
 ...packets.flatMap(p=>['### '+p.id,'',...['cueAttack','stageCategory','twoSteps','difficulty','oneBest'].map(k=>'- '+k+': '+p.reviewResponse.selfCheck[k]),'']),
 '## Retained warnings','',...packets.filter(p=>p.lint.after.length).map(p=>'- '+p.id+': '+[...new Set(p.lint.after.map(f=>f.rule))].join(', ')+'. Exact phrases, fields and author dispositions remain in the packet.'),'',
 'The linter remains advisory and unchanged. No warning is suppressed or treated as proof of clinical weakness, fairness, difficulty or approval. No correctness collection or analytics is added.','',
 'All review notes have indexed responses in the JSON. The older treatment-source hold is retained on its old version; the new B2A02 construct assesses a secondary junction process using previously directly checked guidance. No network retrieval or fresh treatment verification is claimed. Source/application limits and image provenance are in sources-question-bank-batch2a-round2-20261104.json.','',
].join('\n'));
console.log(JSON.stringify({items:packet.length,rewritten:packets.length,newConcepts:c.QUESTION_BANK_BATCH2A_ROUND2_TESTED_CONCEPTS.length,notes:packets.reduce((n,p)=>n+Object.values(p.reviewResponse.noteResponses).reduce((n,a)=>n+a.length,0),0),claims:claims.length,sources:sources.length,selected:lint.selected,before:before.totals.findings,after:after.totals.findings}));
