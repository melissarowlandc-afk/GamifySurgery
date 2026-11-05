import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const c=await import('../../packages/clinical-content/src/index.ts');
const {questionShipManifestIssues}=await import('../../packages/clinical-content/src/question-ship-manifest-validation.ts');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const before=read('tools/question-quality/fixtures/batch2b-acceptance-before-20261105.json');
const change=read('tools/question-quality/batch2b-acceptance-changes-20261105.json');
const digest=v=>crypto.createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
// Intake is serialized data. Optional `undefined` properties cannot appear in
// it; compare the complete saved representation, never ignore clinical fields.
const sameCapture=(value,record,message)=>assert.equal(JSON.stringify(value),JSON.stringify(record),message);
const ownIds=new Set(change.acceptedIds),source=c.QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE;
const ownRows=c.QUESTION_SHIP_MANIFEST.accepted.filter(row=>ownIds.has(row.acceptanceId));
assert.deepEqual(ownRows,change.acceptedRows,'Exact manager-directed rows changed');
const views={legacy:c.QUESTION_FLAGS_PRE_REVISION_RELEASE,'flags-round3':c.QUESTION_NEW_N1_PRE_RELEASE,'batch2a-round3':c.QUESTION_BANK_BATCH2A_ROUND3_RELEASE,'n1-round2':c.QUESTION_BANK_PRE_BATCH2B_RELEASE,'n1-round3':c.QUESTION_NEW_N2_ROUND3_PRE_RELEASE,'n2-round2':c.QUESTION_NEW_N1_ROUND3_PRE_RELEASE,'batch2b-round2':source};
const catalog=c.withAcceptedQuestionBankBatch2bRound2Concepts(c.QUESTION_CATALOG_RELEASE);
assert.deepEqual(questionShipManifestIssues(catalog,c.QUESTION_FLAGS_PRE_REVISION_RELEASE,views),[]);
const introducedCases=new Set(ownRows.map(r=>r.caseId));
const show=s=>typeof s==='string'?s.replaceAll('{patientName}','Jamie Taylor'):s;
const mixed=[];
const cases=ownRows.map(row=>{
 const cs=c.SYNTHETIC_CLINICAL_RELEASE.cases.find(cs=>cs.id===row.caseId);
 const old=before.release.cases.find(cs=>cs.id===row.caseId);
 const authored=source.cases.find(cs=>cs.id===row.caseId);
 const node=cs.decisionNodes.find(n=>n.id===row.nodeId);
 assert.equal(cs.presentation,authored.presentation,'Accepted header missing: '+row.acceptanceId);
 assert.equal(cs.chiefComplaint,authored.chiefComplaint);
 assert.deepEqual(cs.approvedInstantiationProfiles,authored.approvedInstantiationProfiles);
 assert.deepEqual(node,authored.decisionNodes.find(n=>n.id===row.nodeId),'Exact accepted node drift');
 const fallback=cs.decisionNodes.filter(n=>!ownRows.some(r=>r.caseId===cs.id&&r.nodeId===n.id));
 for(const n of fallback)sameCapture(n,old.decisionNodes.find(p=>p.id===n.id),'Fallback node changed');
 if(fallback.length)mixed.push({caseId:cs.id,acceptedNodeId:row.nodeId,fallbackNodeIds:fallback.map(n=>n.id),
  clinicalConsistency:'The header and mapping gate remain noninflammatory, localized disease in the same conservation field; the retained second node still describes feasible margins, radiotherapy eligibility and the same conservation preference.',
  sequenceLimitation:'The accepted first update already establishes breast conservation for the bracketing task. The preserved old follow-up then repeats the local-treatment decision, so it is coherent but rehearsed/easy. This integration does not claim that old node passed independent review; queue a separately versioned follow-up improvement, without altering the current live fallback in this milestone.',
  decision:'Accept B2B24 as directed; preserve the old second node and exact gate bytes. No unaccepted B2b neighbor is imported.'});
 return {caseId:cs.id,acceptanceId:row.acceptanceId,headerSource:c.QUESTION_SHIP_MANIFEST.headerSources[cs.id],runtimeDefinitionSha256:digest(cs),mixed:fallback.length>0,
  beforePresentation:show(old.presentation),Presentation:show(cs.presentation),profiles:cs.approvedInstantiationProfiles?.map(p=>({id:p.id,demographics:p.prototypeDemographics,Presentation:show(p.presentation)})),
  nodes:cs.decisionNodes.map(n=>({nodeId:n.id,questionVariantId:n.questionVariantId,conceptId:n.primaryConceptId,disposition:n.id===row.nodeId?'manager_accepted_2b':'retained_current_live_fallback','Current update':show(n.currentUpdate??null),Exhibit:n.exhibit??null,Task:show(n.stem),Options:[...n.answerChoices].sort((a,b)=>Number(b.isCorrect)-Number(a.isCorrect)).map(a=>(a.isCorrect?'**KEY:** ':'')+a.label),feedback:n.explanation,teachingPoint:n.teachingPoint??null,resultGate:n.resultGateAfter})),
 };
});
for(const cs of c.SYNTHETIC_CLINICAL_RELEASE.cases){
 if(introducedCases.has(cs.id))continue;
 const old=before.release.cases.find(p=>p.id===cs.id);
 // N2 may legitimately move in its concurrently owned lane; every other
 // existing case must stay exact under this bounded acceptance block.
 if(old&&!cs.id.startsWith('case.n2.'))sameCapture(cs,old,'Unrelated live case changed: '+cs.id);
}
const parked=[...change.parkedReviseIds,...change.heldIds].map(id=>{
 const p=before.packet.find(p=>p.id===id),cs=c.SYNTHETIC_CLINICAL_RELEASE.cases.find(c=>c.id===p.caseId),n=cs.decisionNodes.find(n=>n.id===p.nodeId),old=before.release.cases.find(c=>c.id===p.caseId).decisionNodes.find(n=>n.id===p.nodeId);
 sameCapture(n,old,id+' must keep current live version');
 assert(!c.QUESTION_SHIP_MANIFEST.accepted.some(row=>row.questionVariantId===p.after.variantId),id+' draft was accidentally accepted');
 return {id,classification:change.heldIds.includes(id)?'source_held_pass_keep_live':'revise_backlog_keep_live',draftVariantId:p.after.variantId,liveVariantId:n.questionVariantId,caseId:p.caseId,nodeId:p.nodeId};
});
const frozen=before.flags2Paths.map(path=>({path,before:before.files[path],current:hash(path),unchanged:before.files[path]===hash(path)}));
assert(frozen.every(p=>p.unchanged),'A frozen flags2 file changed');
const digestChecks=change.digestReconciliation.files.map(record=>{
 assert.equal(hash(record.path),record.currentSha256,'Reconciled capture changed again');
 return {...record,unchangedSinceReconciliation:true};
});
const manifestText=fs.readFileSync('packages/clinical-content/src/question-ship-manifest.ts','utf8');
const stripped=manifestText.replace(change.manifest.ownAcceptanceBlock,'').replace(change.manifest.ownHeaderBlock,'');
const nonOwnedRows=c.QUESTION_SHIP_MANIFEST.accepted.filter(row=>!ownIds.has(row.acceptanceId));
const unchangedNonN2=before.manifest.accepted.filter(row=>!row.acceptanceId.startsWith('review.n2.')).every(row=>nonOwnedRows.some(current=>JSON.stringify(current)===JSON.stringify(row)));
assert(unchangedNonN2,'Existing non-N2 acceptance changed');
const acceptedConceptIds=new Set(ownRows.map(row=>row.conceptId));
const allNewConcepts=catalog.concepts.filter(concept=>!before.release.concepts.some(old=>old.id===concept.id));
const newConcepts=allNewConcepts.filter(concept=>acceptedConceptIds.has(concept.id));
const controls={checkedOn:'2026-11-05',acceptedCount:ownRows.length,acceptedRows:ownRows,conditionalHeldCount:2,parkedReviseCount:22,parked,
 defaultCases:c.SYNTHETIC_CLINICAL_RELEASE.cases.length,defaultNodes:c.SYNTHETIC_CLINICAL_RELEASE.cases.flatMap(cs=>cs.decisionNodes).length,managerManifestAcceptances:c.QUESTION_SHIP_MANIFEST.accepted.length,
 newRegisteredConcepts:newConcepts.map(c=>c.id),concurrentOtherNewConcepts:allNewConcepts.filter(concept=>!acceptedConceptIds.has(concept.id)).map(c=>c.id),oldConceptsRetained:before.release.concepts.every(old=>catalog.concepts.some(current=>JSON.stringify(old)===JSON.stringify(current))),
 mixedCases:mixed,flags2Frozen:frozen,digestReconciliation:digestChecks,nonOwnedManifest:{otherBytesPreservedAtInsertion:change.manifest.otherBytesPreserved,currentWithoutOwnBlocksMatchesInsertionBefore:digest(stripped)===change.manifest.beforeSha256,existingNonN2RowsPreserved:unchangedNonN2,currentN2Rows:nonOwnedRows.filter(r=>r.acceptanceId.startsWith('review.n2.')),note:'Concurrent N2 changes belong to the N2 writer; these are preserved rather than overwritten.'},
 changedLevel5BoundInputs:[{path:'packages/clinical-content/src/question-ship-manifest.ts',before:before.files['packages/clinical-content/src/question-ship-manifest.ts'],current:hash('packages/clinical-content/src/question-ship-manifest.ts')}],
 clinicalApproval:false,deploy:false,noEvidenceWriteOrRebind:true,
};
assert(controls.oldConceptsRetained);
const preview={generatedOn:'2026-11-05',label:'key shown first for review only; runtime choices are randomized',clinicalApproval:false,releaseAuthorized:false,purpose:'Exact composed source/header/accepted/fallback preview for sixteen manager-directed 2b acceptances; other lanes are preserved.',sourceView:'batch2b-round2',acceptedCount:16,affectedCases:cases.length,mixedCases:mixed,cases};
fs.writeFileSync('docs/research/question-bank-batch2b-composed-preview-20261105.json',JSON.stringify(preview,null,2)+'\n');
fs.writeFileSync('tools/question-quality/batch2b-acceptance-controls-20261105.json',JSON.stringify(controls,null,2)+'\n');
const passTable=ownRows.map(row=>'| '+row.acceptanceId+' | `'+row.questionVariantId+'` | `'+row.conceptId+'` |').join('\n');
const parkedTable=parked.map(row=>'| '+row.id+' | '+row.classification+' | `'+row.liveVariantId+'` | `'+row.draftVariantId+'` |').join('\n');
const decision=`# Batch 2b manager decision — November 5, 2026

Authority: manager direction in this thread following
question-bank-batch2b-review2-20261104.json: eighteen PASS, twenty-two REVISE,
zero FAIL. **Accept sixteen exact variants. Keep B2B32/F13 live because their
unresolved source holds affect the keys. Keep all twenty-two REVISE items at
their current live versions; no 2b round three.** The rejected/held drafts stay
in their retained source view as backlog. Editorial acceptance changes no
clinical review status. Melissa Rowland remains clinical sign-off; all accepted
AI drafts remain needs_clinician_review under the existing unapproved label.

## Accepted exact rows

Each row has sourceView batch2b-round2 and this document as its decision path.
Sixteen separate case/header bindings are in the marked BATCH2B REVIEW2 blocks
of question-ship-manifest.ts. Existing N2 rows and all other bytes were preserved
at insertion. B2B06/B2B10 are the exact earlier PASS versions retained by the
round-two view, not newly rewritten versions.

| Acceptance | Question variant | Concept |
|---|---|---|
${passTable}

## Conditional source-hold dispositions

- **B2B32: hold on key; not accepted.** The numeric albumin-correction aid,
  unit relation and reference comparison are the discriminator leading to the
  keyed etiologic tests. The prior recorded claim explicitly excludes verified
  arithmetic. No recorded adequate direct check resolves that extension, and
  this lane has no network authorization. Removing the aid would withhold the
  reviewed decision criterion rather than repair provenance. Keep
  '${change.holds[0].liveVariantId}'. Claim:
  claim.qbp2b.r2.gap-calculation-aid; original limitation:
  claim.gs028d.acidosis.corrected-gap. No item, threshold, formula or source
  record is edited or claimed freshly verified.
- **F13: hold on key; not accepted.** The awake gas-exchange exception and
  ranked arterial-gas request are the answer, not a non-deciding medicine-list
  detail. Existing sleep-screening claims and the reduced-bicarbonate acidosis
  claim do not establish that raised-total-CO2 investigation comparison.
  Keep '${change.holds[1].liveVariantId}'. Claims:
  claim.qbp2b.r2.osa-awake-gas-exchange and
  claim.gs028d.acidosis.blood-gas. No detail is removed to simulate resolution,
  and no new source verification or clinical approval is inferred from PASS.

These classifications follow the existing source ledger
sources-question-bank-batch2b-round2-20261104.json and its atomic limitations.
No source page, excerpt, proprietary material or clinical value was retrieved.

## Backlog and exact live fallbacks

| Item | Disposition | Retained live variant | Parked draft |
|---|---|---|---|
${parkedTable}

**G03 correction:** B2B36 is REVISE, so the palpable-breast owner flag is not
resolved by an accepted rewrite. Re-queue G03 for the flags2 revision round after
that independent review. The frozen flags2 packet's authorship skip is not a
clinical or pipeline PASS. No flags2 source, packet, tool or prior handoff is
edited in this milestone. B2B36's live v1 remains unchanged.

## Composed preview and history compatibility

[question-bank-batch2b-composed-preview-20261105.json](question-bank-batch2b-composed-preview-20261105.json)
shows all sixteen affected cases and seventeen composed nodes, including
canonical/profile headers, accepted/fallback identities, exhibits, tasks, keys,
feedback and returned gates. Key first is review-only; runtime randomization
is unchanged. The existing accepted-concept helper appends only the accepted
new meanings; all historical concepts remain available for saved FSRS histories.
No source version, old question/choice order, service/timing archive, encounter
object or save format is overwritten.

The one mixed case is B2B24's paired breast encounter. Its accepted first node
and header come from the reviewed view; the second node and imaging gate remain
exactly the pre-acceptance live definitions. The localization map, same quadrant,
noninflammatory presentation and returned localized disease remain coherent.
**Sequence limitation:** the accepted first update already establishes breast
conservation, and the old follow-up repeats that plan. It is coherent but
rehearsed/easy; this acceptance does not claim the legacy follow-up passed the
resident-difficulty rubric. Queue a separately versioned improvement, while
preserving the current fallback as directed. No unaccepted neighboring draft is
imported through the new header.

## Authorized digest reconciliation

Exactly **three scalar entries in two capture files** were changed, matching
.local-dev/question-ship-gate-narrowing-20261105/rewrite-test-digest-followup.json:

1. Original 2b capture: game-domain/tests/question-bank-batch2a-round2-bindings.test.ts.
2. Round-two 2b capture: clinical-content/src/question-bank-batch2a-round3-20261104.test.ts.
3. Round-two 2b capture: game-domain/tests/question-bank-batch2a-round2-bindings.test.ts.

The current test-file hashes were checked against the manager-authorized receipt
before replacement. Every other capture byte/key, protected clinical/source/
packet/image digest and test assertion remains unchanged. Full old/new paths,
hashes and capture hashes are in batch2b-acceptance-changes-20261105.json under
tools/question-quality. No assertion was removed or broadened to hide a failure.

## Validation and handoff status

Acceptance/source/fallback controls pass. Focused manifest/2b tests, typecheck and
full clinical-content results are pending in this initial decision record;
final exact results and logs will be added before handoff. No domain/player full
run is requested. No Git, install, network, agents, external message, deployment,
save/session/cloud/Supabase or Level 5 evidence/pin/rebind change is performed.
`;
fs.writeFileSync('docs/research/question-bank-batch2b-manager-decision-20261105.md',decision);
console.log(JSON.stringify({accepted:ownRows.length,held:2,parked:22,cases:cases.length,composedNodes:cases.flatMap(c=>c.nodes).length,mixed:mixed.map(c=>c.caseId),newRegisteredConcepts:newConcepts.length,flags2FilesFrozen:frozen.length,manifestAcceptances:c.QUESTION_SHIP_MANIFEST.accepted.length,casesInLive:c.SYNTHETIC_CLINICAL_RELEASE.cases.length},null,2));
