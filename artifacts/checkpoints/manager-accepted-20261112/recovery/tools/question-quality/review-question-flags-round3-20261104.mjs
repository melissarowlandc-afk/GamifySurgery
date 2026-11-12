import fs from 'node:fs';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import '../economy-audit/source-loader.mjs';
import {entry,specs,review} from './question-flags-round3-specs-20261104.mjs';
import {responses} from './responses-question-flags-round3-20261104.mjs';
import {collectAuthoredMetadata,inventoryRelease} from './bank.mjs';
import {OWNER_FLAG_RULES} from './owner-flag-rules-20261104.mjs';
import {LINTER_VERSION} from './lint.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),live=c.SYNTHETIC_CLINICAL_RELEASE,m=collectAuthoredMetadata(c);
const config={tutorialCaseIds:[c.FIRST_TUTORIAL_CASE_ID,c.SECOND_TUTORIAL_CASE_ID],pilotRevisions:[...c.QUESTION_QUALITY_CURRENT_REVISIONS,...c.QUESTION_FLAG_REVISIONS,...c.QUESTION_FLAG_ROUND2_REVISIONS,...c.QUESTION_BANK_BATCH2A_REVISIONS,...c.QUESTION_FLAG_ROUND3_REVISIONS]};
// Include concurrently authored NEW cases on both sides. Only this batch's
// fourteen replacements differ in the comparison, never the new-content lane.
const oldCaseIds=new Set(entry.release.cases.map(c=>c.id)),oldConceptIds=new Set(entry.release.concepts.map(c=>c.id));
const ourNewConcepts=new Set(c.QUESTION_FLAG_ROUND3_TESTED_CONCEPTS.map(c=>c.id));
const control={...entry.release,cases:[...entry.release.cases,...live.cases.filter(c=>!oldCaseIds.has(c.id))],
 concepts:[...entry.release.concepts,...live.concepts.filter(c=>!oldConceptIds.has(c.id)&&!ourNewConcepts.has(c.id))]};
const before=inventoryRelease(control,m,config),after=inventoryRelease(live,m,config);
const ordered=n=>[n.answerChoices.find(x=>x.isCorrect),...n.answerChoices.filter(x=>!x.isCorrect)];
const named=s=>typeof s==='string'?s.replaceAll('{patientName}','Jamie Taylor'):s;
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:named(cs.presentation),'Current update':named(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:named(n.stem),Options:ordered(n).map(x=>(x.isCorrect?'**KEY:** ':'')+x.label)});
const dispositions={
 F02:'The raw continuous duct/controlled cavity observations are necessary to separate endoscopic treatment, drainage and reconstruction; none is a sentence that simply grants permission for the key.',
 F03:'Full-leg scope is shared with a distractor and reflux purpose with another. The four choices balance both components; the actual recurrent anatomical uncertainty remains clinical-review material.',
 F04:'Three specific active drug treatments have four-word labels. No calcium/observation foil, availability phrase or longer cautious key. Comparative ranking has an explicit direct-source-alignment hold.',
 F05:'A vascular projection versus the sampled cyst fluid is decision-critical representation information. The key specifies guided core sampling of that solid component; targeted FNA is acknowledged as another representative approach, not a wrong option.',
 F06:'The complete two-by-two time/target set intentionally repeats all components equally. Ordered biological targets are not duplicates; the current task does not state the preimplantation principle.',
 F07:'Cirrhosis optimization and urgent assessment are competing sequences. The raw obstructive findings are necessary to determine whether the prior elective plan still applies; no exact correction threshold is supplied.',
 F08:'The focal ultrasound findings distinguish cavity, vein and diffuse inflammation. The separate imaging result is not a label naming the treatment; all options propose treatment of a plausible source of symptoms.',
 F09:'Position and ventilation controls are necessary for interpreting filling/plateau observations. Four options balance both components; no calculated difference or positional-change foil remains.',
 F10:'Left/right and breast/axilla words occur across alternatives; the skin-envelope/gland distinction is the clinical inference. The bilateral option is the broadest and is a distractor.',
 F11:'The patient-agreed endpoint is decision-critical in an ethics item. Current findings compare against preoperative baseline; unchanged home oxygen is not stated to be an unresolved anaesthetic effect.',
 F13:'Each alternative is a concrete assessment request. The legitimate probability/sleepiness report contrast is not a diagnostic label; no specific monitor, CPAP or surgery-delay policy is scored.',
 F15:'The necessary pressure/ventilation controls and laboratory-interval relationships establish the limited conclusion. Both acidemia interpretations occur equally, with no invented numeric cutoff.',
 F16:'The needle path is raw specimen-provenance evidence; detectability is not labelled positive. The key does not repeat a uniquely named assay from the task and is not the only concrete workup plan.',
 F17:'The clip and lump are distinct targets at one skin site. Ultrasound and core words recur in both competing sampling plans; clinically interpreted depth, not clock-position matching, matters.',
};
let noteCount=0;
const packet=specs.map(s=>{
 const p=entry.packet.find(p=>p.id===s.id),r=c.QUESTION_FLAG_ROUND3_REVISIONS.find(r=>r.auditId===s.id),rr=review.find(x=>x.id===s.id);
 const cs=live.cases.find(x=>x.id===p.caseId),n=cs.decisionNodes.find(x=>x.id===p.nodeId);
 const a=before.variants.find(x=>x.questionVariantId===p.after.variantId),b=after.variants.find(x=>x.questionVariantId===n.questionVariantId);
 const noteResponses=Object.fromEntries(['cues','fairness','suggestions'].map(key=>{
  assert.equal(responses[s.id][key].length,rr[key].length,s.id+' '+key);
  return [key,rr[key].map((note,i)=>{noteCount++;return {noteIndex:i+1,note,response:responses[s.id][key][i]};})];
 }));
 const original=p.originalBefore??p.before;
 const fallbackCase=c.QUESTION_FLAGS_PRE_REVISION_RELEASE.cases.find(cs=>cs.id===p.caseId);
 assert.equal(fallbackCase?.decisionNodes.find(n=>n.id===p.nodeId)?.questionVariantId,original.variantId,s.id+' retained fallback');
 return {...p,id:s.id,title:s.title,round:3,reviewStatus:'needs_clinician_review',
  ownerStatus:'final_author_round_awaiting_independent_review_and_manager_acceptance',
  keyOrderNotice:'key shown first for review only; runtime options are randomized',
  reviewDisplayNote:'Canonical synthetic profile; Jamie Taylor is a review-only placeholder. Before is the exact round-two draft. The retained originalBefore is the known live flagged fallback, not an asserted release of either pending draft.',
  conceptId:n.primaryConceptId,previousConceptId:p.conceptId,originalBefore:original,before:p.after,after:display(cs,n),
  rationalePairs:{before:p.rationalePairs.after,after:ordered(n).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale])},
  inference:s.steps.join(' Then: '),focus:s.construct?.objective??s.sameConstructReason,whatChanged:s.change,
  originalFlagResponses:p.flags.map(f=>({flagId:f.id,note:f.note,response:s.change,disposition:'FINAL_DRAFT_REWRITE_NEEDS_INDEPENDENT_REVIEW'})),
  reviewResponse:{sourceReviewId:'question-flags-adversarial-review2-20261104.json#'+s.id,originalVerdict:rr.verdict,noteResponses,
   selfCheck:{targetDifficulty:'moderate_PGY2_3_intent_independent_rating_pending',reasoningSteps:s.steps,
    cueAttack:dispositions[s.id],closestDistractor:s.options[1][0],oneBestAnswer:s.limitation,
    limitations:'No author-granted PASS/basic acceptance. Integrated physiology classifications are not described as two consequential treatment steps. All new versions need clinical review; final independent review may reject and retain the live fallback.'}},
  supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,
  sourceDecision:s.limitation,sourceVerificationHold:s.id==='F04'?'Direct UKKA section alignment for the new active-drug comparative ranking is required before release acceptance; no network was authorized.':null,
  ownerRecommendation:s.ownerRecommendation??null,retirementProposed:false,retirementApplied:false,
  clinicalMeaning:s.construct?.reason??s.sameConstructReason,pipelinePassed:false,basicAccepted:false,releaseReady:false,
  fallback:{lastKnownLiveVariantId:original.variantId,entryRound2VariantId:p.after.variantId,sourceExport:'QUESTION_FLAGS_PRE_REVISION_RELEASE',sourceFile:'packages/clinical-content/src/synthetic-content.ts',caseId:p.caseId,nodeId:p.nodeId,
   retainedCaseSha256:crypto.createHash('sha256').update(JSON.stringify(fallbackCase)).digest('hex'),
   policy:'If final independent review rejects this draft, retain the currently released version. The known live flagged ID is from the recorded live-build check; neither pending draft is claimed shipped. Manager must reconcile any intervening release before applying a fallback.'},
  lint:{version:LINTER_VERSION,before:a.findings,after:b.findings,beforeCount:a.findings.length,afterCount:b.findings.length,
   ownerRuleBeforeCount:a.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length,ownerRuleAfterCount:b.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length},
  lintDispositions:b.findings.map(f=>({findingId:f.id,rule:f.rule,status:'author_response_pending_independent_review',response:dispositions[s.id]})),
 };
});
assert.equal(packet.length,14);
fs.writeFileSync('docs/research/question-flags-round3-review-20261104.json',JSON.stringify(packet,null,2)+'\n');
// Preserve both PASS packet entries and the source-held F14 entry exactly.
const aggregate=entry.packet.map(p=>packet.find(x=>x.id===p.id)??p);
fs.writeFileSync('docs/research/question-flags-review-20261104.json',JSON.stringify(aggregate,null,2)+'\n');
const allClaims={...entry.claims,...Object.fromEntries(c.QUESTION_FLAG_ROUND3_CLAIMS.map(x=>[x.id,x]))};
const claimIds=new Set(packet.flatMap(p=>[...p.supportingEvidenceClaimIds,...entry.packet.find(x=>x.id===p.id).supportingEvidenceClaimIds]));
for(const id of [...claimIds])for(const b of allClaims[id].basisClaimIds??[])claimIds.add(b);
const claims=[...claimIds].sort().map(id=>{assert(allClaims[id],id);return allClaims[id];});
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))].sort();
const sources=sourceIds.map(id=>{assert(entry.sources[id],id);return {...entry.sources[id],usedForClaimIdsThisRound:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),verificationNote:'Existing source metadata/access date; no new retrieval or claim of currentness verification.'};});
fs.writeFileSync('docs/research/sources-question-flags-round3-20261104.json',JSON.stringify({compiledOn:'2026-11-04',policy:'Offline reuse of recorded bibliographic metadata/rights; no source prose, private inputs, emails or network. New applications have basis IDs and explicit source-alignment limitations.',
 claims,sources,mappings:packet.map(p=>({id:p.id,beforeClaimIds:entry.packet.find(x=>x.id===p.id).supportingEvidenceClaimIds,afterClaimIds:p.supportingEvidenceClaimIds,limitation:p.sourceDecision,hold:p.sourceVerificationHold}))},null,2)+'\n');
const counts=r=>Object.fromEntries(OWNER_FLAG_RULES.map(rule=>[rule,{variants:r.variants.filter(v=>v.findings.some(f=>f.rule===rule)).length,findings:r.variants.reduce((n,v)=>n+v.findings.filter(f=>f.rule===rule).length,0)}]));
const summary={linterVersion:LINTER_VERSION,before:before.totals,after:after.totals,selected:{rewritten:14,noteResponses:noteCount,beforeFindings:packet.reduce((n,p)=>n+p.lint.beforeCount,0),afterFindings:packet.reduce((n,p)=>n+p.lint.afterCount,0),beforeOwnerFindings:packet.reduce((n,p)=>n+p.lint.ownerRuleBeforeCount,0),afterOwnerFindings:packet.reduce((n,p)=>n+p.lint.ownerRuleAfterCount,0)},ownerRulesBefore:counts(before),ownerRulesAfter:counts(after),frozen:['F01','F12','F14','all eleven batch-2a versions','all exact clinical approvals']};
fs.writeFileSync('tools/question-quality/question-flags-round3-lint-20261104.json',JSON.stringify(summary,null,2)+'\n');
fs.writeFileSync('tools/question-quality/question-flags-round3-whole-bank-20261104.json',JSON.stringify(after,null,2)+'\n');
const cell=s=>String(s??'').replaceAll('|','\\|').replaceAll('\n',' ');
fs.writeFileSync('docs/research/question-flags-round3-cue-audit-20261104.md',[
 '# Flag rewrites: final author round, 2026-11-04','',
 'Fourteen additive r4 drafts only. F01/F12 PASS versions, held F14 and eleven batch-2a versions are unchanged. Key shown first for review only in the JSON packet; runtime choices remain randomized. No independent PASS or clinical approval is self-granted.','',
 `Indexed responses cover all ${noteCount} review-two notes. Same ${LINTER_VERSION} comparison: ${before.totals.findings} to ${after.totals.findings} whole-bank findings; selected fourteen ${summary.selected.beforeFindings} to ${summary.selected.afterFindings}, owner-rule findings ${summary.selected.beforeOwnerFindings} to ${summary.selected.afterOwnerFindings}.`,'',
 '| Item | Change | Lint before / after |','|---|---|---:|',...packet.map(p=>'| '+[p.id,p.whatChanged,p.lint.beforeCount+' / '+p.lint.afterCount].map(cell).join(' | ')+' |'),'',
 '## Evidence and final-review boundary','',
 'No fresh network verification was authorized. Existing records retain their actual access dates and rights. Thirteen independently written draft applications record their basis claims and limitations. F04 specifically requires direct UKKA section alignment for its new comparative drug ranking before release acceptance. F14 remains core content on its prior source hold, and neck-mass evaluation remains in scope by the explicit owner/manager decision. Neither is recommended for retirement here.','',
 'If final review rejects a replacement, retain its live version; both pending draft stages and their old concepts/orders remain available. The packet records the known live flagged ID and the round-entry draft separately so a draft is not misrepresented as shipped.','',
 '## Remaining advisory findings','',...packet.filter(p=>p.lint.afterCount).map(p=>'- '+p.id+': '+p.lint.after.map(f=>f.rule).join(', ')+'. '+dispositions[p.id]),'',
 '| Owner rule | Whole-bank variants / findings |','|---|---:|',...Object.entries(summary.ownerRulesAfter).map(([k,v])=>`| ${k} | ${v.variants} / ${v.findings} |`),'',
 'The scan is a census of authored/finite contexts, including prior visible feedback; it collects no player correctness or time data. Other candidates remain queued and are not rewritten in this milestone.','',
 ].join('\n'));
console.log(JSON.stringify({items:packet.length,noteCount,claims:claims.length,sources:sources.length,newConcepts:c.QUESTION_FLAG_ROUND3_AUTHORING_CONCEPTS.length,...summary.selected,wholeBankBefore:before.totals.findings,wholeBankAfter:after.totals.findings}));
