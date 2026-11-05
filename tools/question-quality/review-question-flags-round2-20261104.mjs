import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry,specs,review} from './question-flags-round2-specs-20261104.mjs';
import {responses} from './responses-question-flags-round2-20261104.mjs';
import {claims as inferenceClaims} from './evidence-question-flags-round2-20261104.mjs';
import {collectAuthoredMetadata,inventoryRelease} from './bank.mjs';
import {OWNER_FLAG_RULES} from './owner-flag-rules-20261104.mjs';
import {LINTER_VERSION} from './lint.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),live=c.SYNTHETIC_CLINICAL_RELEASE,m=collectAuthoredMetadata(c);
const options={tutorialCaseIds:[c.FIRST_TUTORIAL_CASE_ID,c.SECOND_TUTORIAL_CASE_ID],pilotRevisions:[...c.QUESTION_QUALITY_CURRENT_REVISIONS,...c.QUESTION_FLAG_REVISIONS,...c.QUESTION_FLAG_ROUND2_REVISIONS]};
const before=inventoryRelease(entry.release,m,options),after=inventoryRelease(live,m,options);
const ordered=n=>[n.answerChoices.find(a=>a.isCorrect),...n.answerChoices.filter(a=>!a.isCorrect)];
const name=s=>typeof s==='string'?s.replaceAll('{patientName}','Jamie Taylor'):s;
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:name(cs.presentation),'Current update':name(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:name(n.stem),Options:ordered(n).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const lintReasons={
 F03:'All three labels are specific venous investigation requests. The lexical category classifier does not consistently recognize duplex and CT-venogram terminology; the actual decision category is homogeneous. Clinical appropriateness still needs independent review.',
 F06:'The two serum results reverse donor and recipient roles. Bag-of-words equality cannot assess those ordered biological roles; the distinction is intentional, not an identical option. It remains an advisory candidate for independent review.',
 F08:'Heel, calf and groin all appear as actual findings and as competing targets. The key is not uniquely related to a site mentioned in the record; the necessary localization must be interpreted. Removing the distal source would make the request unfair.',
 F09:'The matched phrases are actual acquisition settings and measured pressure variables, not an interpretation or explanatory teaching sentence before the answer. These controls are required to distinguish compliance from resistance. The complete 2x2 options balance component frequencies.',
 F10:'The core observation concerns currently sampled tissue; the distractor condition concerns future final pathology. Absence of invasion in the core does not eliminate occult invasion, so this is necessary context rather than a logical exclusion.',
 F12:'All three alternatives are next biliary diagnostic studies. Expanded modality names confuse the lexical nominal/investigation classifier; no category clearance or clinical PASS is inferred.',
 F14:'Unresolved old eligibility disclosure and abbreviation. The exact variant is recommended for retirement, remains unchanged and is not submitted as a repaired draft.',
};
let noteCount=0;
const packet=specs.map(s=>{
 const prior=entry.packet.find(p=>p.id===s.id),r=c.QUESTION_FLAG_ROUND2_REVISIONS.find(r=>r.auditId===s.id),rr=review.find(r=>r.id===s.id);
 const cs=live.cases.find(cs=>cs.id===prior.caseId),n=cs.decisionNodes.find(n=>n.id===prior.nodeId);
 const oldLint=before.variants.find(v=>v.questionVariantId===prior.after.variantId),newLint=after.variants.find(v=>v.questionVariantId===n.questionVariantId);
 const noteResponses={};
 for(const key of ['cues','fairness','suggestions']){
  assert.equal(responses[s.id][key].length,rr[key].length,s.id+' '+key+' response count');
  noteResponses[key]=rr[key].map((note,index)=>{noteCount++;return {noteIndex:index+1,note,response:responses[s.id][key][index]};});
 }
 return {id:s.id,title:s.title,round:2,reviewStatus:r?'needs_clinician_review':prior.reviewStatus,
  ownerStatus:s.hold?'retirement_recommended_not_rewritten':'awaiting_independent_re_review_and_Melissa_exact_version_signoff',
  keyOrderNotice:'key shown first for review only; runtime options are randomized',
  reviewDisplayNote:'Canonical synthetic profile; patientName is Jamie Taylor for review only. Before is the exact round-one draft; originalBefore retains the initially flagged version. No author-granted pipeline pass.',
  caseId:prior.caseId,nodeId:prior.nodeId,conceptId:n.primaryConceptId,previousConceptId:prior.conceptId,
  originalFlaggedVariantId:prior.before.variantId,originalBefore:prior.before,flags:prior.flags,
  supersededByLiveBatch1:prior.supersededByLiveBatch1,batch1Check:prior.batch1Check,
  before:prior.after,after:display(cs,n),
  rationalePairs:{before:prior.rationalePairs.after,after:r?ordered(n).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale]):prior.rationalePairs.after},
  inference:s.steps?.join(' Then: ')??'No replacement proposed without a source-supported selection profile.',
  focus:s.construct?.objective??s.sameConstructReason??s.ownerRecommendation,whatChanged:s.change,
  originalFlagResponses:prior.flags.map(f=>({flagId:f.id,note:f.note,response:s.change,disposition:s.hold?'RETIREMENT_RECOMMENDED':'DRAFT_REWRITE_NEEDS_REVIEW'})),
  reviewResponse:{sourceReviewId:'question-flags-adversarial-review-20261104.json#'+s.id,originalVerdict:rr.verdict,noteResponses,
   selfCheck:{targetDifficulty:s.hold?'not_submitted':'moderate_or_hard_PGY2_3_requires_independent_rating',reasoningSteps:s.steps??[],
    cueAttack:s.hold?'Original disclosure is unresolved; retire this exact variant.':'Checked neutral task, required raw observations, same-stage options, key-only overlap, completeness, actual repeated-protocol/sample needs and preceding feedback.',
    closestDistractor:s.options?.[1]?.[0]??null,oneBestAnswer:s.limitation,
    remainingReview:'Independent adversarial review and Melissa Rowland clinical sign-off of the exact version; automated tests do not approve clinical content.'}},
  supportingEvidenceClaimIds:r?.question.supportingEvidenceClaimIds??prior.supportingEvidenceClaimIds,
  sourceVerificationHold:s.hold?s.limitation:null,ownerRecommendation:s.ownerRecommendation??null,
  retirementProposed:!!s.hold||s.id==='F05',retirementApplied:false,
  clinicalMeaning:s.construct?.reason??s.sameConstructReason??s.limitation,sourceDecision:s.limitation,
  pipelinePassed:false,basicAccepted:false,releaseReady:false,
  lint:{version:LINTER_VERSION,before:oldLint.findings,after:newLint.findings,beforeCount:oldLint.findings.length,afterCount:newLint.findings.length,
   ownerRuleBeforeCount:oldLint.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length,ownerRuleAfterCount:newLint.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length},
  lintDispositions:newLint.findings.map(f=>({findingId:f.id,rule:f.rule,status:s.hold?'retirement_recommended_unresolved':'author_justification_pending_independent_review',response:lintReasons[s.id]??'Independent review required; no automated clinical clearance.'})),
 };
});
assert.equal(packet.length,17);assert.equal(noteCount,177);assert.equal(packet.filter(p=>!p.sourceVerificationHold).length,16);
fs.writeFileSync('docs/research/question-flags-review-20261104.json',JSON.stringify(packet,null,2)+'\n');
fs.writeFileSync('docs/research/question-flags-round2-review-20261104.json',JSON.stringify(packet,null,2)+'\n');
const counts=report=>Object.fromEntries(OWNER_FLAG_RULES.map(rule=>[rule,{variants:report.variants.filter(v=>v.findings.some(f=>f.rule===rule)).length,findings:report.variants.reduce((n,v)=>n+v.findings.filter(f=>f.rule===rule).length,0)}]));
const selectedIds=new Set(packet.map(p=>p.after.variantId));
const backlog=after.variants.filter(v=>!selectedIds.has(v.questionVariantId)&&v.findings.some(f=>OWNER_FLAG_RULES.includes(f.rule)))
 .sort((a,b)=>a.priorityStage-b.priorityStage||b.findings.length-a.findings.length||a.questionVariantId.localeCompare(b.questionVariantId));
const summary={checkedOn:'2026-11-04',linterVersion:LINTER_VERSION,scope:'Same v7 linter over both round-one and current banks, every canonical/finite context including prior feedback. No player statistics.',
 before:before.totals,after:after.totals,selected:{items:17,rewritten:16,retirementRecommended:['F14'],noteResponses:noteCount,
  beforeFindings:packet.reduce((n,p)=>n+p.lint.beforeCount,0),afterFindings:packet.reduce((n,p)=>n+p.lint.afterCount,0),
  beforeOwnerFindings:packet.reduce((n,p)=>n+p.lint.ownerRuleBeforeCount,0),afterOwnerFindings:packet.reduce((n,p)=>n+p.lint.ownerRuleAfterCount,0)},
 newRulesBefore:counts(before),newRulesAfter:counts(after),batch2Candidates:backlog.map(v=>({questionVariantId:v.questionVariantId,conceptId:v.conceptId,entry:v.priorityStage,tier:v.educationalTier,
  ownerFindings:v.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule)),reviewStatuses:v.reviewStatuses,tutorialSequence:v.tutorialSequence,educationalIntent:v.educationalIntent})),
 linterChange:'v7 narrowly excludes complete 2x2 paired component matrices from convergence. Other convergence checks remain; all old tests plus the complete/incomplete/arbitrary-four-option regression pass.'};
fs.writeFileSync('tools/question-quality/question-flags-round2-lint-20261104.json',JSON.stringify(summary,null,2)+'\n');
fs.writeFileSync('tools/question-quality/question-flags-round2-whole-bank-20261104.json',JSON.stringify(after,null,2)+'\n');
const allClaims={...entry.claims,...Object.fromEntries(inferenceClaims.map(c=>[c.id,c]))};
const ids=[...new Set(packet.flatMap(p=>[...p.supportingEvidenceClaimIds,...(entry.packet.find(e=>e.id===p.id).supportingEvidenceClaimIds??[])]))].sort();
const claims=ids.map(id=>{assert(allClaims[id],id);return allClaims[id];});
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))].sort();
const sources=sourceIds.map(id=>{assert(entry.sources[id],id);return {...entry.sources[id],usedForClaimIdsThisRound:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),
  verificationNote:'Existing recorded source metadata and access date. Reverse claim index is an author mapping; no new source retrieval or currentness verification.'};});
fs.writeFileSync('docs/research/sources-question-flags-round2-20261104.json',JSON.stringify({compiledOn:'2026-11-04',policy:'Offline reuse; no article text, excerpts, proprietary material or emails. New qualitative application claims are explicitly marked as draft inferences with their basis IDs and verification limitations.',
 claims,sources,mappings:packet.map(p=>({id:p.id,beforeClaimIds:entry.packet.find(e=>e.id===p.id).supportingEvidenceClaimIds,afterClaimIds:p.supportingEvidenceClaimIds,
  newInferenceClaimIds:p.supportingEvidenceClaimIds.filter(id=>inferenceClaims.some(c=>c.id===id)),limitation:p.sourceDecision})),
 sourceDecisions:packet.filter(p=>p.ownerRecommendation).map(p=>({id:p.id,recommendation:p.ownerRecommendation,applied:false}))},null,2)+'\n');
const cell=x=>String(x??'').replaceAll('|','\\|').replaceAll('\n',' ');
const lines=['# Question flags: round-two application review, 2026-11-04','',
 'Sixteen additive `.r3` drafts; F14 exact variant recommended for retirement, not rewritten. All drafts remain needs_clinician_review and pipelinePassed is false. Melissa Rowland is clinical sign-off; Dustin is a tester. Nothing is shipped by this worker.','',
 `All ${noteCount} independent-review notes have indexed author responses in the packet. Before fields show exact round-one drafts; originalBefore retains the original flagged versions. Key shown first for review only; runtime choices are randomized.`, '',
 '| Item | Decision/inference | Change | Lint before / after |','|---|---|---|',
 ...packet.map(p=>'| '+[p.id,p.inference,p.whatChanged,p.lint.beforeCount+' / '+p.lint.afterCount].map(cell).join(' | ')+' |'),'',
 '## Evidence and owner decisions','',
 'F14: recommend retirement of the exact unsupported variant until permitted direct size/morphology verification and a new review. It remains unchanged in the current source; no selector edit is hidden. F05: recommend retirement from an ABSITE-labelled bank pending permitted public scope verification; a clinical guideline does not establish exam coverage. The revised F05 candidate is available for owner consideration as general clinical reasoning, not verified ABSITE material.','',
 'Fourteen materially changed scored constructs receive new IDs with parent links; all 398 prior definitions remain. F06 and F10 retain their clinical mechanism/mastectomy objective. Three new qualitative inference claims explicitly record their existing claim basis and offline verification limits; source access dates are not advanced. These are draft claims, not newly verified guidelines.','',
 '## Same-linter bank scan','',
 `v7 before/after: ${summary.before.uniqueVariants} variants and ${summary.before.profileContexts} contexts; ${summary.before.findings} → ${summary.after.findings} findings, ${summary.before.variantsWithFindings} → ${summary.after.variantsWithFindings} flagged variants. Selected 17: ${summary.selected.beforeFindings} → ${summary.selected.afterFindings}; new owner rules ${summary.selected.beforeOwnerFindings} → ${summary.selected.afterOwnerFindings}. The held F14 warning is unresolved.`, '',
 'The linter now recognizes a complete 2x2 component matrix as frequency-balanced; incomplete and arbitrary four-option convergence candidates remain tested. All other rules are advisory. A higher raw warning count can reflect necessary acquisition/context findings; indexed human dispositions are not pipeline clearance.','',
 `${backlog.length} unedited variants remain new-owner-rule batch-2 candidates. No further questions are rewritten. The complete current spans and backlog are in question-flags-round2-whole-bank-20261104.json and question-flags-round2-lint-20261104.json.`, '',
 '| New owner rule | Remaining variants / findings |','|---|---:|',...Object.entries(summary.newRulesAfter).map(([k,v])=>`| ${k} | ${v.variants} / ${v.findings} |`),'',
 '## Remaining lint candidates','',...packet.filter(p=>p.lintDispositions.length).map(p=>'- '+p.id+': '+p.lintDispositions.map(d=>d.rule+' — '+d.response).join(' ')),''];
fs.writeFileSync('docs/research/question-flags-round2-cue-audit-20261104.md',lines.join('\n'));
console.log(JSON.stringify({items:packet.length,notes:noteCount,rewrites:16,newConcepts:c.QUESTION_FLAG_ROUND2_AUTHORING_CONCEPTS.length,newInferenceClaims:inferenceClaims.length,sources:sources.length,claims:claims.length,
 before:summary.before.findings,after:summary.after.findings,selected:summary.selected,backlog:backlog.length}));
