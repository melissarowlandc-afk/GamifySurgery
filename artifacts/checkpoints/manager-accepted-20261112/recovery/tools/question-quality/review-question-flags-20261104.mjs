import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry,specs} from './question-flags-specs-20261104.mjs';
import {inventoryRelease,collectAuthoredMetadata} from './bank.mjs';
import {OWNER_FLAG_RULES} from './owner-flag-rules-20261104.mjs';
import {LINTER_VERSION} from './lint.mjs';

const content=await import('../../packages/clinical-content/src/index.ts');
const live=content.SYNTHETIC_CLINICAL_RELEASE,metadata=collectAuthoredMetadata(content);
const revisions=content.QUESTION_FLAG_REVISIONS;
const options={tutorialCaseIds:[content.FIRST_TUTORIAL_CASE_ID,content.SECOND_TUTORIAL_CASE_ID],pilotRevisions:[...content.QUESTION_QUALITY_CURRENT_REVISIONS,...revisions]};
const before=inventoryRelease(entry.release,metadata,options),after=inventoryRelease(live,metadata,options);
const find=(release,variant)=>{const cs=release.cases.find(c=>c.decisionNodes.some(n=>n.questionVariantId===variant));assert(cs,variant);return {cs,n:cs.decisionNodes.find(n=>n.questionVariantId===variant)};};
const ordered=n=>[n.answerChoices.find(c=>c.isCorrect),...n.answerChoices.filter(c=>!c.isCorrect)];
const lintReview={
  F09:'The token sets are equal but their ordered pressure-phase mechanisms are opposite. The task explicitly asks for the sequence and supplies both observed directions. Retain as an advisory near-duplicate candidate for independent review; no clinical PASS is claimed.',
  F10:'Breast is a general anatomical word in the case and one label. All offered choices concern axillary staging around the same breast operation. Review for a lexical shortcut; the intended discriminator is mastectomy versus delayed staging, not this shared word.',
  F12:'The expanded magnetic-resonance cholangiopancreatography label is not recognized by the lexical option-category heuristic. All three choices are imaging studies; the category warning is a false positive, with clinical appropriateness still requiring review.',
  F14:'Unresolved: the original meets-biopsy-criteria disclosure and FNA abbreviation remain because the source-safe replacement is withheld. This is a hold/retirement proposal, not a repaired or release-ready item.',
  F15:'All alternatives describe venous blood movement and necessarily reuse anatomical components. The convergence finding remains for human review; direction is the intended discriminator. The narrow objective may remain easy, so retirement in favor of the combined F09 item is proposed.',
};
const name=s=>typeof s==='string'?s.replaceAll('{patientName}','Jamie Taylor'):s;
const display=({cs,n})=>({variantId:n.questionVariantId,Presentation:name(cs.presentation),'Current update':name(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:name(n.stem),Options:ordered(n).map(c=>(c.isCorrect?'**KEY:** ':'')+c.label)});
const rationalePairs=({n},questions)=>ordered(n).map(c=>[(c.isCorrect?'**KEY:** ':'')+c.label,
  questions.flatMap(q=>q.answerChoices??[]).find(a=>a.id===c.id)?.rationale??questions.flatMap(q=>q.answerChoices??[]).find(a=>a.id===c.id)?.distractorRationale??c.rationale??'No separate explicit rationale recorded; consult the original explanation.']);
const items=specs.map(s=>{
  const old=find(entry.release,s.variant),r=revisions.find(r=>r.auditId===s.id),now=find(live,r?.questionVariantId??s.variant);
  const flags=entry.flags.filter(f=>f.questionVariantId===s.variant);
  const oldLint=before.variants.find(v=>v.questionVariantId===s.variant),newLint=after.variants.find(v=>v.questionVariantId===now.n.questionVariantId);
  return {id:s.id,title:s.title,reviewStatus:r?'needs_clinician_review':(entry.questions[s.variant][0]?.reviewStatus??'needs_clinician_review'),
    ownerStatus:s.hold?'source_hold_retirement_proposed_not_rewritten':'awaiting_independent_review_and_Melissa_exact_version_signoff',
    keyOrderNotice:'key shown first for review only; runtime options are randomized',
    reviewDisplayNote:'Synthetic canonical profile; patientName is rendered as Jamie Taylor for review only. Before/after fields come from exact assembled versions, including the unchanged held item.',
    caseId:old.cs.id,nodeId:old.n.id,conceptId:now.n.primaryConceptId,previousConceptId:old.n.primaryConceptId,
    flags:flags.map(f=>({id:f.flagId,reviewer:['F16','F17'].includes(s.id)?'Dustin (tester)':'Melissa Rowland (clinical sign-off)',note:f.note})),
    supersededByLiveBatch1:false,batch1Check:{managerReportedLiveBuild:'7b8cff7a',exactFlaggedVersionStillLiveAtEntry:true,
      exactReplacementsAtEntry:flags[0].batch1Revisions,conceptSiblings:flags[0].conceptSiblingRevisions,
      note:s.id==='F12'?'A02 / HIDA v2.r6 is a batch-1 sibling repair, not a replacement for flagged v4.':'No batch-1 replacement of this exact variant was found.'},
    before:display(old),after:display(now),rationalePairs:{before:rationalePairs(old,entry.questions[s.variant]),after:rationalePairs(now,metadata.questions.get(now.n.questionVariantId)??[])},
    inference:s.inference,focus:s.focus,whatChanged:s.change,reviewResponse:flags.map(f=>({flagId:f.flagId,note:f.note,response:s.change,
      disposition:s.hold?'UNRESOLVED_SOURCE_HOLD':'DRAFT_REWRITE_NEEDS_REVIEW'})),
    selfCheck:{cueAttack:s.hold?'Unresolved meets-biopsy-criteria disclosure; no source-safe replacement has been assembled.':'Checked option-alone/generic/feasibility labels, task/case rationale previews, explicit term/length parity, same-category competing choices, and the visible later task where present.',
      difficulty:s.hold?'unassessed pending source verification':(['F04','F11','F15','F16'].includes(s.id)?'narrow application; may remain easy and needs owner difficulty review':'application; predicted moderate pending independent review'),
      oneBestAnswer:s.review,closestDistractor:s.options?.[1]?.[0]??null},
    supportingEvidenceClaimIds:r?.question.supportingEvidenceClaimIds??entry.questions[s.variant].flatMap(q=>q.supportingEvidenceClaimIds),
    sourceVerificationHold:s.sourceVerificationHold??null,scopeDecision:s.scopeDecision??null,sourceDecision:s.sourceDecision??null,retirementProposal:s.retirementProposal??null,
    clinicalMeaning:s.concept?.reason??'Existing scored objective retained. Changed wording does not transfer clinical approval.',
    pipelinePassed:false,releaseReady:false,
    lint:{version:LINTER_VERSION,before:oldLint.findings,after:newLint.findings,beforeCount:oldLint.findings.length,afterCount:newLint.findings.length,
      ownerRuleBeforeCount:oldLint.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length,ownerRuleAfterCount:newLint.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length},
    lintDispositions:newLint.findings.map(f=>({findingId:f.id,rule:f.rule,status:s.hold?'unresolved_source_hold':'author_justification_pending_independent_review',response:lintReview[s.id]??'Requires independent editorial/clinical review; no automated clearance is inferred.'})),
  };
});
const flaggedIds=new Set(specs.map(s=>s.variant)),replacementIds=new Set(revisions.map(r=>r.questionVariantId));
const candidates=after.variants.filter(v=>!flaggedIds.has(v.questionVariantId)&&!replacementIds.has(v.questionVariantId)&&v.findings.some(f=>OWNER_FLAG_RULES.includes(f.rule)))
  .map(v=>({...v,ownerFindings:v.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule))}));
candidates.sort((a,b)=>a.priorityStage-b.priorityStage||b.ownerFindings.length-a.ownerFindings.length||b.caseReferenceCount-a.caseReferenceCount||a.questionVariantId.localeCompare(b.questionVariantId));
const findingCounts=r=>Object.fromEntries(OWNER_FLAG_RULES.map(rule=>[rule,{variants:r.variants.filter(v=>v.findings.some(f=>f.rule===rule)).length,findings:r.variants.reduce((n,v)=>n+v.findings.filter(f=>f.rule===rule).length,0)}]));
const summary={schemaVersion:1,checkedOn:'2026-11-04',linterVersion:LINTER_VERSION,scope:'Whole default assembled bank, every node and canonical/finite presentation, including prior visible feedback. Static authoring only; no player data or network.',
  before:before.totals,after:after.totals,newRulesBefore:findingCounts(before),newRulesAfter:findingCounts(after),
  selected:{variants:items.length,rewritten:revisions.length,held:items.filter(i=>i.sourceVerificationHold).map(i=>i.id),
    beforeFindings:items.reduce((n,i)=>n+i.lint.beforeCount,0),afterFindings:items.reduce((n,i)=>n+i.lint.afterCount,0),
    beforeOwnerFindings:items.reduce((n,i)=>n+i.lint.ownerRuleBeforeCount,0),afterOwnerFindings:items.reduce((n,i)=>n+i.lint.ownerRuleAfterCount,0)},
  batch2Candidates:candidates.map(v=>({questionVariantId:v.questionVariantId,conceptId:v.conceptId,entry:v.priorityStage,tier:v.educationalTier,caseReferences:v.caseReferenceCount,
    educationalIntent:v.educationalIntent,tutorialSequence:v.tutorialSequence,tutorialEligible:v.tutorialEligible,reviewStatuses:v.reviewStatuses,ownerFindings:v.ownerFindings})),
  worstByOwnerFindingCount:[...candidates].sort((a,b)=>b.ownerFindings.length-a.ownerFindings.length||a.priorityStage-b.priorityStage).slice(0,20).map(v=>({questionVariantId:v.questionVariantId,entry:v.priorityStage,findings:v.ownerFindings})),
};
fs.writeFileSync('docs/research/question-flags-review-20261104.json',JSON.stringify(items,null,2)+'\n');
fs.writeFileSync('tools/question-quality/question-flags-lint-20261104.json',JSON.stringify(summary,null,2)+'\n');
fs.writeFileSync('tools/question-quality/question-flags-whole-bank-20261104.json',JSON.stringify(after,null,2)+'\n');
const cell=x=>String(x??'unknown').replaceAll('|','\\|').replaceAll('\n',' ');
const lines=['# Voluntary question-flag cue scan — 2026-11-04','',
  'Advisory lexical candidates, not proof of clinical invalidity or measured difficulty. All counts use the same updated v6 linter before and after. No player correctness, answer frequencies or exposure analytics are collected. Entry stage and case references are structural priority proxies.','',
  `The 18 flags concern 17 variants. None was already replaced by batch 1 at entry. Sixteen have new drafts; F14 is unchanged with a source-verification/retirement hold. Whole bank: ${before.totals.uniqueVariants} variants; ${before.totals.findings} → ${after.totals.findings} findings, ${before.totals.variantsWithFindings} → ${after.totals.variantsWithFindings} flagged variants. Selected 17: ${summary.selected.beforeFindings} → ${summary.selected.afterFindings}; new owner-rule findings ${summary.selected.beforeOwnerFindings} → ${summary.selected.afterOwnerFindings}.`,'',
  '| New advisory rule | Before variants / findings | After variants / findings |','|---|---:|---:|',...OWNER_FLAG_RULES.map(rule=>`| ${rule} | ${summary.newRulesBefore[rule].variants} / ${summary.newRulesBefore[rule].findings} | ${summary.newRulesAfter[rule].variants} / ${summary.newRulesAfter[rule].findings} |`),'',
  'The remaining selected owner-rule finding is the held F14 meets-biopsy-criteria label; it is unresolved. Clean heuristics do not validate anatomy, selection criteria, alternatives or difficulty. Detailed per-item old/new findings are in the review JSON; complete current-bank spans are in tools/question-quality/question-flags-whole-bank-20261104.json.','',
  '## Worst unedited offenders','',
  '| Variant | Entry | New-rule findings (exact examples) |','|---|---:|---|',
  ...summary.worstByOwnerFindingCount.map(v=>'| '+[v.questionVariantId,v.entry,v.findings.map(f=>f.rule+': '+f.evidence[0].field+' = '+f.evidence[0].text).join('; ')].map(cell).join(' | ')+' |'),'',
  '## Batch 2 candidate list — no rewrites in this milestone','',
  'All unedited variants flagged by at least one new rule are listed below, ordered by entry stage, finding count and case references. This is a candidate backlog, not authorization to edit or a claim of actual exposure. Keep tutorials/accepted-basic roles and exact clinical approvals distinct at review.','',
  '| Variant | Concept | Entry / tier | Cases | Intent / review | New-rule findings |','|---|---|---|---:|---|---|',
  ...summary.batch2Candidates.map(v=>'| '+[v.questionVariantId,v.conceptId,v.entry+' / '+(v.tier??'unknown'),v.caseReferences,
    (v.tutorialSequence?'tutorial sequence; ':v.educationalIntent+'; ')+(v.tutorialEligible?'tutorial eligible; ':'')+v.reviewStatuses.join(', '),
    [...new Set(v.ownerFindings.map(f=>f.rule))].join(', ')].map(cell).join(' | ')+' |'),'',
  'F05 has a separate ABSITE-scope hold; F10 replaces the disputed oncoplastic exception with a new, narrower mastectomy concept version. See the review packet and source ledger. No evidence, save, cloud, routing or unflagged content was edited.',''];
fs.writeFileSync('docs/research/question-flags-cue-audit-20261104.md',lines.join('\n'));
const claimIds=[...new Set(items.flatMap(i=>i.supportingEvidenceClaimIds))].sort(),claims=claimIds.map(id=>entry.claims[id]);
const sourceIds=[...new Set(claims.flatMap(c=>c.sourceIds))].sort(),sources=sourceIds.map(id=>entry.sources[id]?{...entry.sources[id],
  usedForClaimIdsThisMilestone:claims.filter(c=>c.sourceIds.includes(id)).map(c=>c.id),
  mappingNote:'Reverse index derived from existing project claim.sourceIds, not fresh source verification; recorded evidenceClaimIds and authority limitations are retained unchanged.'}:null);
for(const [i,s]of sources.entries())assert(s,'Missing existing source record '+sourceIds[i]);
const ledger={schemaVersion:1,compiledOn:'2026-11-04',verification:'Offline reuse of previously recorded permitted source metadata and independently worded atomic claims. No fresh retrieval/currentness check, article text, email or proprietary question corpus. Original access/check dates and rights limitations are retained; an additional document alias is not an independent source.',
  holds:items.filter(i=>i.sourceVerificationHold||i.scopeDecision).map(i=>({id:i.id,sourceVerificationHold:i.sourceVerificationHold,scopeDecision:i.scopeDecision})),
  mappings:items.map(i=>({id:i.id,variantId:i.after.variantId,claimIds:i.supportingEvidenceClaimIds,limitation:specs.find(s=>s.id===i.id).review})),claims,sources};
fs.writeFileSync('docs/research/sources-question-flags-20261104.json',JSON.stringify(ledger,null,2)+'\n');
console.log(JSON.stringify({linterVersion:LINTER_VERSION,before:summary.before,after:summary.after,selected:summary.selected,newRulesAfter:summary.newRulesAfter,batch2Candidates:candidates.length,sources:sources.length,claims:claims.length},null,2));
