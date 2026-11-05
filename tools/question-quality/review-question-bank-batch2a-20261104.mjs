import fs from 'node:fs';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
import {entry,specs} from './question-bank-batch2a-specs-20261104.mjs';
import {collectAuthoredMetadata,inventoryRelease,preAnswerFields} from './bank.mjs';
import {LINTER_VERSION} from './lint.mjs';
import {OWNER_FLAG_RULES} from './owner-flag-rules-20261104.mjs';
const c=await import('../../packages/clinical-content/src/index.ts'),live=c.SYNTHETIC_CLINICAL_RELEASE,m=collectAuthoredMetadata(c);
const baselineMetadata={...m,questions:new Map(Object.entries(entry.questions)),claims:new Map(Object.entries(entry.claims)),sources:new Map(Object.entries(entry.sources)),concepts:new Map(Object.entries(entry.conceptMetadata))};
const options={tutorialCaseIds:[c.FIRST_TUTORIAL_CASE_ID,c.SECOND_TUTORIAL_CASE_ID],pilotRevisions:[...c.QUESTION_QUALITY_CURRENT_REVISIONS,...c.QUESTION_FLAG_REVISIONS,...c.QUESTION_FLAG_ROUND2_REVISIONS,...c.QUESTION_BANK_BATCH2A_REVISIONS]};
const before=inventoryRelease(entry.release,baselineMetadata,options),after=inventoryRelease(live,m,options);
const ordered=n=>[n.answerChoices.find(a=>a.isCorrect),...n.answerChoices.filter(a=>!a.isCorrect)];
const name=s=>typeof s==='string'?s.replaceAll('{patientName}','Jamie Taylor'):s;
const display=(cs,n)=>({variantId:n.questionVariantId,Presentation:name(cs.presentation),'Current update':name(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:name(n.stem),Options:ordered(n).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label)});
const lintReasons={
 B2A01:'The actual pressure observations must be available in the image and its equivalent accessible description. The clinical task and option set are retained from the owner-reviewed version; a new image version still needs review.',
 B2A02:'The physiology is necessary to choose a treatment. Every option is a named actual therapy as the owner requested. Foregut review must independently assess procedural candidacy, distractor credibility and the unverified new treatment mappings; no automatic difficulty or source clearance.',
 B2A03:'Separated versus rapid swallows is a necessary acquisition distinction, not a named diagnosis. All alternatives are clinical investigations. The lexical overlap is retained only to state what the proposed repeat study would do; independent review must judge whether it over-signals that choice.',
 B2A04:'The complete four-option matrix balances both components. Raw pressure descriptions are accessible equivalents of the actual schematic and do not name the reserve/outflow interpretation. The technical interpretation still needs independent importance/difficulty and clinical review.',
 B2A05:'The continuing activity limitation and reduction-responsive protrusion are necessary to distinguish elective hernia care from the improved hip complaint. An independently reproduced known hernia should not be contradicted to manufacture difficulty. Review whether a repeat study or rehabilitation is a credible competing choice.',
 B2A06:'The two observations concern different anatomical locations; there is no explicit sentence naming a missing standing/strain protocol. The actual study acquisition must be interpreted. All options are imaging requests; MRI remains a possible later competitor rather than a stipulated routine step.',
 B2A07:'Wording-only continuity revision. Its task, choices, explanation and functional observations are frozen; any pre-existing cue remains for the manager to disposition, not silently rewritten in this companion.',
 B2A08:'Caregiving limitation tracks the reducible protrusion despite improvement in a separate attachment ache. All choices are concrete next plans. A clinically contradictory observation-management key was removed; review the remaining close competitor and difficulty.',
 B2A09:'The sampled pale sector and unsampled darker sector are necessary to limit the benign pathology result. This is a clinical specimen-completion decision rather than a label/provenance quiz; all choices are actual tissue assessment strategies.',
 B2A10:'The lexical finding is Medication in the table header versus medication in the key; the manual alternative also says medication-list, which the tokenizer treats as one different token. This does not establish a key-only clinical rationale. The actual as-needed omission pattern must be interpreted across rows. Independent review must judge application difficulty and the competing workflow changes.',
 B2A11:'Every offered choice is a cortisol study, so the task does not uniquely match a single cortisol option or preclude other indicated hormonal axes. This intentionally prioritizes the owner’s task-clarity flag; it is not claimed to be moderate/hard or granted accepted-basic status.',
};
const packet=specs.map(s=>{
 const r=c.QUESTION_BANK_BATCH2A_REVISIONS.find(r=>r.auditId===s.id),cs=live.cases.find(cs=>cs.id===r.caseId),n=cs.decisionNodes.find(n=>n.id===r.nodeId);
 const a=before.variants.find(v=>v.questionVariantId===r.previousQuestionVariantId),b=after.variants.find(v=>v.questionVariantId===r.questionVariantId);
 const owner=entry.ownerReviews[s.ownerId],flags=s.id==='B2A11'?entry.flags.filter(f=>f.variantId===r.previousQuestionVariantId):[];
 assert(a&&b,s.id);assert(flags.length||owner||s.id==='B2A07',s.id+' missing direction');
 const oldIndex=s.cs.decisionNodes.indexOf(s.node),newIndex=cs.decisionNodes.indexOf(n);
 return {id:s.id,ownerItemId:s.ownerId,title:s.title,reviewStatus:'needs_clinician_review',ownerStatus:'standing_program_in_game_flags_no_owner_review_page_gate',
  keyOrderNotice:'key shown first for review only; runtime options are randomized',reviewDisplayNote:'Jamie Taylor substitutes for patientName in the canonical synthetic profile. Before is the exact batch-entry version; no email or unrelated private feedback is copied.',
  caseId:cs.id,nodeId:n.id,conceptId:n.primaryConceptId,previousConceptId:s.node.primaryConceptId,
  before:display(s.cs,s.node),after:display(cs,n),rationalePairs:{before:ordered(s.node).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale]),after:ordered(n).map(a=>[(a.isCorrect?'**KEY:** ':'')+a.label,a.rationale])},
  inference:s.inference.join(' Then: '),focus:s.construct?.objective??m.concepts.get(n.primaryConceptId)?.learningObjective??live.concepts.find(x=>x.id===n.primaryConceptId).learningObjective,
  whatChanged:s.change,clinicalMeaning:s.construct?.reason??s.meaning,sourceDecision:s.limitation??'Reuse existing locally recorded claim mappings. No new retrieval or numerical clinical cutoff; exact application remains for clinician review.',
  sourceVerificationHold:s.id==='B2A02'?'Three new qualitative treatment mappings require direct permitted-source alignment and foregut review before pipeline release. No treatment section was retrieved in this offline milestone.':null,
  originalOwnerDirection:owner??null,questionFlags:flags,
  reviewResponse:{notes:[...(owner?[{note:owner.note,response:s.change}]:[]),...flags.map(f=>({flagId:f.id,note:f.notes,response:s.change})),...(s.id==='B2A07'?[{note:'B06 imaging chronology continuity',response:s.change}]:[])],
   selfCheck:{reasoningSteps:s.inference,practicalDecision:s.id==='B2A04'?'Interpret a real displayed pressure-response schematic; independent reviewer must judge whether this technical distinction earns its bank coverage.':s.construct?.objective??s.title,
    closestDistractor:n.answerChoices.find(a=>!a.isCorrect)?.label??null,cueAttack:lintReasons[s.id],fairnessBoundary:s.limitation??s.meaning??s.construct?.reason,
    difficulty:s.id==='B2A11'?'Clear important screening selection; likely basic. No accepted-basic or difficulty pass claimed.':s.id==='B2A01'?'Retained owner-reviewed classification; image representation requires review.':'Application intended; independent difficulty assessment pending. No analytics or measured gate.',
    clinicalApproval:'Melissa Rowland (clinical sign-off) must approve the exact version; tests/editorial review do not confer approval.'}},
  visibleHistory:{before:preAnswerFields(s.cs,oldIndex),after:preAnswerFields(cs,newIndex)},
  supportingEvidenceClaimIds:r.question.supportingEvidenceClaimIds,previousEvidenceClaimIds:entry.questions[s.node.questionVariantId].flatMap(q=>q.supportingEvidenceClaimIds),
  conceptVersion:s.construct??null,pipelinePassed:false,basicAccepted:false,releaseReady:false,
  lint:{version:LINTER_VERSION,before:a.findings,after:b.findings,beforeCount:a.findings.length,afterCount:b.findings.length},
  lintDispositions:b.findings.map(f=>({findingId:f.id,rule:f.rule,status:'author_explanation_pending_independent_review',response:lintReasons[s.id]})),
 };
});
assert.equal(packet.length,11);assert.equal(packet.filter(p=>p.conceptVersion).length,2);
const write=(p,data)=>fs.writeFileSync(p,JSON.stringify(data,null,2)+'\n');
write('docs/research/question-bank-batch2a-20261104.json',packet);
write('tools/question-quality/question-bank-batch2a-whole-bank-20261104.json',after);
const ownerCounts=report=>Object.fromEntries(OWNER_FLAG_RULES.map(rule=>[rule,{variants:report.variants.filter(v=>v.findings.some(f=>f.rule===rule)).length,findings:report.variants.reduce((sum,v)=>sum+v.findings.filter(f=>f.rule===rule).length,0)}]));
const summary={checkedOn:'2026-11-04',linterVersion:LINTER_VERSION,policy:'Same v8 advisory linter and unchanged finite contexts/history on both assembled banks. No answer correctness, timing analytics or player data.',
 before:before.totals,after:after.totals,ownerRulesBefore:ownerCounts(before),ownerRulesAfter:ownerCounts(after),selected:{items:11,changedConstructs:2,beforeFindings:packet.reduce((a,p)=>a+p.lint.beforeCount,0),afterFindings:packet.reduce((a,p)=>a+p.lint.afterCount,0)},
 worstOffenders:after.variants.filter(v=>!packet.some(p=>p.after.variantId===v.questionVariantId)).sort((a,b)=>b.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length-a.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule)).length||a.priorityStage-b.priorityStage||b.findings.length-a.findings.length).slice(0,20).map(v=>({questionVariantId:v.questionVariantId,conceptId:v.conceptId,stage:v.priorityStage,findings:v.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule))}))};
write('tools/question-quality/question-bank-batch2a-lint-20261104.json',summary);
const claimIds=[...new Set(packet.flatMap(p=>[...p.supportingEvidenceClaimIds,...p.previousEvidenceClaimIds]))].sort(),claims=claimIds.map(id=>{assert(m.claims.has(id),id);return m.claims.get(id);});
const sourceIds=[...new Set(claims.flatMap(x=>x.sourceIds))].sort(),sources=sourceIds.map(id=>{assert(m.sources.has(id),id);return {...m.sources.get(id),usedForClaimIdsThisBatch:claims.filter(x=>x.sourceIds.includes(id)).map(x=>x.id),offlineReuseNote:'Original bibliographic, access, license and authority metadata retained. No source text/excerpts stored; no network or new source verification in this milestone.'};});
write('docs/research/sources-question-bank-batch2a-20261104.json',{compiledOn:'2026-11-04',policy:'Original factual synthesis from locally recorded permitted evidence. Existing source-access dates do not imply freshly verified treatment sections; three new qualitative mappings carry a hold. Medical authority is separate from reuse permission.',
 claims,sources,mappings:packet.map(p=>({id:p.id,beforeClaimIds:p.previousEvidenceClaimIds,afterClaimIds:p.supportingEvidenceClaimIds,sourceVerificationHold:p.sourceVerificationHold,limitation:p.sourceDecision})),
 imageProvenance:{creator:'AI-assisted original project schematic, generated offline with System.Drawing',script:'tools/question-quality/draw-question-bank-batch2a-20261104.ps1',assets:['apps/player/public/clinical-exhibits/batch2a-b01-pressure.png','apps/player/public/clinical-exhibits/batch2a-b03-pressure.png'],reuse:'Original qualitative waveforms and labels; no copied source figure, table, tracing or numeric patient measurement. These are teaching schematics, not diagnostic patient recordings. Clinical fidelity remains needs_clinician_review.'}});

// Keep every live variant in a durable queue, rather than treating lint-free as reviewed.
const oldCandidates=JSON.parse(fs.readFileSync('tools/question-quality/question-flags-lint-20261104.json','utf8')).batch2Candidates;
assert.equal(oldCandidates.length,179);const candidateIds=new Set(oldCandidates.map(v=>v.questionVariantId));
const selected=new Map(packet.map(p=>[p.after.variantId,p.id])),pending=new Set(entry.flagRound2Revisions.map(r=>r.questionVariantId));
const b1=entry.batchPacket.flatMap(p=>[p,...(p.contextRevisions??[])]),ownerByVariant=new Map();
for(const [id,v]of Object.entries(entry.ownerReviews)){
 if(!id.startsWith('b1-'))continue;
 const row=b1.find(p=>p.id===id.slice(3));if(row)ownerByVariant.set(row.after.variantId,{id,...v});
}
const held='question.thyroid-nodule.fna-selection.v2';
const queue=after.variants.map(v=>{
 const owner=ownerByVariant.get(v.questionVariantId),ownerRules=v.findings.filter(f=>OWNER_FLAG_RULES.includes(f.rule));
 const priority=selected.has(v.questionVariantId)||pending.has(v.questionVariantId)||owner?.decision==='changes'||v.questionVariantId===held?1:candidateIds.has(v.questionVariantId)||ownerRules.length?2:3;
 const state=selected.has(v.questionVariantId)?'batch2a_awaiting_independent_review':pending.has(v.questionVariantId)?'flag_round2_frozen_pending_manager_review':v.questionVariantId===held?'deferred_keep_live_until_exact_criteria_verified':owner?.decision==='approve'||v.reviewStatuses.includes('clinically_approved')?'owner_reviewed_frozen_no_new_change_note':'queued';
 return {questionVariantId:v.questionVariantId,conceptId:v.conceptId,priority,state,batchItem:selected.get(v.questionVariantId)??null,entryStage:v.priorityStage,educationalTier:v.educationalTier,structuralCaseReferences:v.caseReferenceCount,
  tutorialSequence:v.tutorialSequence,tutorialEligible:v.tutorialEligible,educationalIntent:v.educationalIntent,reviewStatuses:v.reviewStatuses,ownerReview:owner??null,exactPilotApproval:entry.approvals.find(a=>a.questionVariantId===v.questionVariantId)??null,original179Candidate:candidateIds.has(v.questionVariantId),lintRuleCounts:Object.fromEntries([...new Set(v.findings.map(f=>f.rule))].map(rule=>[rule,v.findings.filter(f=>f.rule===rule).length])),findings:v.findings.length};
}).sort((a,b)=>a.priority-b.priority||a.entryStage-b.entryStage||b.structuralCaseReferences-a.structuralCaseReferences||b.findings-a.findings||a.questionVariantId.localeCompare(b.questionVariantId));
write('docs/research/question-bank-program-queue-20261104.json',{updatedOn:'2026-11-04',rule:'Per-batch author/lint/review packet/validation then STOP for manager independent review and release. No player correctness or exposure analytics. Entry-stage/case references are structural proxies, not educational tier or patient acuity.',
 baseline179Candidates:oldCandidates.map(v=>({questionVariantId:v.questionVariantId,conceptId:v.conceptId,currentState:queue.find(q=>q.questionVariantId===v.questionVariantId)?.state??'superseded_before_batch2a_or_by_selected_version',replacementVariant:packet.find(p=>p.before.variantId===v.questionVariantId)?.after.variantId??null})),
 ownerNoteCoverage:packet.map(p=>({ownerItemId:p.ownerItemId,batchItem:p.id,previous:p.before.variantId,current:p.after.variantId,state:'awaiting_independent_review'})),
 supersedingManagerDecisions:[{id:'F14',decision:'KEEP; exact live version unchanged until permitted direct criteria verification',applied:true},{id:'F05',decision:'KEEP in general-surgery scope and freeze the round-two clarity fixes pending review',applied:true}],
 totals:{liveVariants:queue.length,selected:packet.length,frozenPendingFlagReview:pending.size,originalCandidates:179,remainingOriginalCandidates:queue.filter(q=>q.original179Candidate&&q.state==='queued').length,byPriority:Object.fromEntries([1,2,3].map(p=>[p,queue.filter(q=>q.priority===p).length])),byState:Object.fromEntries([...new Set(queue.map(q=>q.state))].map(s=>[s,queue.filter(q=>q.state===s).length]))},variants:queue});
const cell=x=>String(x??'').replaceAll('|','\\|').replaceAll('\n',' ');
const next=queue.filter(q=>q.state==='queued'&&q.priority===2).slice(0,40);
fs.writeFileSync('docs/research/question-bank-batch2b-proposal-20261104.md',[
 '# Next linter-candidate batch: proposal only, 2026-11-04','',
 'Forty candidates for the next bounded batch after the manager returns batch-2a review/release direction. None are rewritten here. Owner/tester corrections returned by independent review take priority over this list. F14 is held; sixteen flag-round-two drafts are frozen; exact reviewed/clinically-approved versions are protected without a new owner change note.','',
 'Order is entry stage, then structural case references and cue findings. This is not measured exposure or resident difficulty, and stage is not educational tier. Existing concepts with low practical value belong on the retire/merge proposal list for manager consideration.','',
 '| Order | Variant ID | Concept | Entry stage / tier | Case references | Findings driving selection |','|---:|---|---|---|---:|---|',
 ...next.map((q,i)=>'| '+[i+1,q.questionVariantId,q.conceptId,q.entryStage+' / '+(q.educationalTier??'unknown'),q.structuralCaseReferences,Object.entries(q.lintRuleCounts).map(([rule,count])=>rule+' ('+count+')').join('; ')].map(cell).join(' | ')+' |'),' ',
 'Full queue and original-179 lineage: question-bank-program-queue-20261104.json. All linter warnings require author/clinician judgment; this priority list does not authorize deletion, source inventions or an automatic clinical rewrite.','',
 ].join('\n'));
fs.writeFileSync('docs/research/question-bank-batch2a-cue-audit-20261104.md',[
 '# Batch 2a cue audit: 2026-11-04','',
 'Eleven draft versions: nine owner-review targets, one new adrenal question flag, one necessary B06 ultrasound chronology companion. Runtime answers randomized; key shown first for review only in the JSON packet. All new versions remain needs_clinician_review. No clinical/editorial pass is inferred from this audit.','',
 `Same ${LINTER_VERSION} before/after: ${before.totals.uniqueVariants} variants / ${before.totals.profileContexts} finite contexts. Findings ${before.totals.findings} → ${after.totals.findings}; variants with warnings ${before.totals.variantsWithFindings} → ${after.totals.variantsWithFindings}. Selected eleven ${summary.selected.beforeFindings} → ${summary.selected.afterFindings}.`,'',
 '| Item / owner ID | Change | Findings before / after |','|---|---|---:|',...packet.map(p=>'| '+[p.id+' / '+p.ownerItemId,p.whatChanged,p.lint.beforeCount+' / '+p.lint.afterCount].map(cell).join(' | ')+' |'),' ',
 'v8 adds unnamed-treatment-action for generic treatment/management assessment/discussion/planning labels. It inspects actual image captions and accessible descriptions and excludes nonvisible asset paths. It cannot judge clinical realism, importance, source validity or actual difficulty. All findings remain advisory.','',
 '| Owner rule | Variants before / after | Findings before / after |','|---|---:|---:|',...OWNER_FLAG_RULES.map(rule=>`| ${rule} | ${summary.ownerRulesBefore[rule].variants} / ${summary.ownerRulesAfter[rule].variants} | ${summary.ownerRulesBefore[rule].findings} / ${summary.ownerRulesAfter[rule].findings} |`),'',
 '## Retained warnings','',...packet.filter(p=>p.lintDispositions.length).map(p=>'- '+p.id+': '+[...new Set(p.lintDispositions.map(d=>d.rule))].join(', ')+'. '+lintReasons[p.id]),'',
 '## Unedited owner-rule candidates','',
 'The whole-bank queue retains every live identity and all original 179 candidates. Sixteen flag-round-two drafts are frozen until the manager returns independent review; F14 stays live and deferred. The prior F14/neck-node retirement recommendations are superseded by KEEP decisions. No further linter candidates are rewritten in this batch.','',
 '| Variant | Stage | Owner-rule findings |','|---|---:|---:|',...summary.worstOffenders.map(v=>'| '+[v.questionVariantId,v.stage,v.findings.length].map(cell).join(' | ')+' |'),'',
 '## Source and release limitations','',
 'No network was used. Three new qualitative achalasia treatment claims use existing real guideline records but need direct treatment-section alignment and foregut review before release. This is an explicit sourceVerificationHold in B2A02. Source metadata/atomic mappings and original-image provenance are in sources-question-bank-batch2a-20261104.json. Other tasks use existing locally mapped evidence; every new version remains draft.','',
 'Queue: question-bank-program-queue-20261104.json. Complete exact cue spans: tools/question-quality/question-bank-batch2a-whole-bank-20261104.json. Manager independent review and release follow the batch stop; no owner page review is requested.','',
 ].join('\n'));
console.log(JSON.stringify({items:packet.length,claims:claims.length,sources:sources.length,before:before.totals.findings,after:after.totals.findings,selected:summary.selected,queue:queue.length,queueStates:queue.reduce((a,q)=>(a[q.state]=(a[q.state]||0)+1,a),{})}));
