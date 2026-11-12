import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import '../economy-audit/source-loader.mjs';
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/batch2b-acceptance-before-20261105.json','utf8'));
const c=await import('../../packages/clinical-content/src/index.ts');
const acceptedIds=['B2B01','B2B02','B2B06','B2B08','B2B09','B2B10','B2B17','B2B21','B2B23','B2B24','B2B25','B2B30','B2B33','B2B39','B2B40','B2B42'];
const heldIds=['B2B32','F13'];
const rows=acceptedIds.map(id=>{
 const p=before.packet.find(p=>p.id===id),review=before.review.find(r=>r.id===id);
 assert.equal(review.verdict,'PASS',id);
 assert(!p.sourceVerificationHold,id+' is not unconditionally eligible');
 const cs=c.QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE.cases.find(cs=>cs.id===p.caseId);
 const node=cs?.decisionNodes.find(n=>n.id===p.nodeId);
 assert.equal(node?.questionVariantId,p.after.variantId,id+' exact retained variant');
 assert.equal(node?.primaryConceptId,p.conceptId,id+' exact retained concept');
 assert(!c.QUESTION_SHIP_MANIFEST.accepted.some(row=>row.caseId===p.caseId&&row.nodeId===p.nodeId),id+' already has an acceptance; do not duplicate');
 assert(!Object.hasOwn(c.QUESTION_SHIP_MANIFEST.headerSources,p.caseId),id+' already has a header; review before replacing');
 return {acceptanceId:id,caseId:p.caseId,nodeId:p.nodeId,questionVariantId:node.questionVariantId,conceptId:node.primaryConceptId,sourceView:'batch2b-round2',decision:'docs/research/question-bank-batch2b-manager-decision-20261105.md'};
});
for(const id of heldIds)assert(before.packet.find(p=>p.id===id).sourceVerificationHold,id+' lost its explicit hold');
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
// Only the three scalar digests authorized by the manager. Every other byte in
// both large captures is preserved; no test assertion or clinical hash changes.
const receipt=before.requiredDigestReconciliation,byCapture=new Map(),reconciled=[];
for(const row of receipt.rows){
 assert(row.testFixtureOnly&&row.wasExactAtNarrowingIntake);
 assert.equal(hash(row.path),row.actual,'Authorized test fixture changed again: '+row.path);
 const text=byCapture.get(row.capture)?.text??fs.readFileSync(row.capture,'utf8');
 const original=byCapture.get(row.capture)?.original??text;
 const needle=JSON.stringify(row.path)+': '+JSON.stringify(row.expected);
 assert.equal(text.split(needle).length-1,1,'Digest key must match exactly once: '+row.path);
 const next=text.replace(needle,JSON.stringify(row.path)+': '+JSON.stringify(row.actual));
 byCapture.set(row.capture,{original,text:next});reconciled.push(row);
}
assert.equal(reconciled.length,3);assert.equal(byCapture.size,2);
for(const[path,{original,text}]of byCapture){
 const expected=JSON.parse(original);
 for(const row of reconciled.filter(r=>r.capture===path))expected.files[row.path]=row.actual;
 assert.deepEqual(JSON.parse(text),expected,'Only authorized .files keys may change');
 assert.equal(fs.readFileSync(path,'utf8'),original,'Capture changed concurrently');
 fs.writeFileSync(path,text);
}
const manifestPath='packages/clinical-content/src/question-ship-manifest.ts';
const original=fs.readFileSync(manifestPath,'utf8');
assert(!original.includes('// BEGIN BATCH2B REVIEW2 ACCEPTANCES'),'Do not insert twice');
const nl=original.includes('\r\n')?'\r\n':'\n';
const format=row=>JSON.stringify(row,null,2).split('\n').map(line=>'  '+line).join(nl);
const block='  // BEGIN BATCH2B REVIEW2 ACCEPTANCES 20261105'+nl+rows.map(row=>format(row)+',').join(nl)+nl+'  // END BATCH2B REVIEW2 ACCEPTANCES 20261105'+nl;
const headerBlock='  // BEGIN BATCH2B REVIEW2 HEADERS 20261105'+nl+rows.map(row=>'  '+JSON.stringify(row.caseId)+': "batch2b-round2",').join(nl)+nl+'  // END BATCH2B REVIEW2 HEADERS 20261105'+nl;
const anchor='  accepted: ['+nl,headerAnchor='  headerSources: {'+nl;
assert.equal(original.split(anchor).length-1,1);assert.equal(original.split(headerAnchor).length-1,1);
const next=original.replace(anchor,anchor+block).replace(headerAnchor,headerAnchor+headerBlock);
assert.equal(next.replace(block,'').replace(headerBlock,''),original,'Existing manifest bytes must be retained');
assert.equal(fs.readFileSync(manifestPath,'utf8'),original,'Manifest changed concurrently; reread instead of overwriting N2');
fs.writeFileSync(manifestPath,next);
const changes={checkedOn:'2026-11-05',acceptedIds,heldIds,acceptedRows:rows,parkedReviseIds:before.review.filter(r=>r.verdict==='REVISE').map(r=>r.id),
 holds:[
  {id:'B2B32',classification:'hold_on_key',accepted:false,itemEdited:false,reason:'The held albumin-correction equation/units and reference comparison are necessary to uncover the gap and select the keyed cause tests. The prior recorded claim explicitly excludes arithmetic. Removing the aid does not verify it or preserve the reviewed fair inference; no adequate direct check was recorded and network is prohibited.',claimIds:['claim.qbp2b.r2.gap-calculation-aid'],liveVariantId:before.release.cases.find(c=>c.id===before.packet.find(p=>p.id==='B2B32').caseId).decisionNodes[0].questionVariantId},
  {id:'F13',classification:'hold_on_key',accepted:false,itemEdited:false,reason:'The held awake gas-exchange exception/ranked arterial-gas investigation is the keyed decision. Existing screening and reduced-bicarbonate metabolic-acidosis claims do not establish this raised-total-CO2 comparison. Removing a medicine-list detail would not resolve the hold. No adequate direct check was recorded and network is prohibited.',claimIds:['claim.qbp2b.r2.osa-awake-gas-exchange'],liveVariantId:before.release.cases.find(c=>c.id===before.packet.find(p=>p.id==='F13').caseId).decisionNodes[0].questionVariantId},
 ],
 digestReconciliation:{count:3,captures:2,rows:reconciled,files:[...byCapture].map(([path,{original,text}])=>({path,beforeSha256:crypto.createHash('sha256').update(original).digest('hex'),currentSha256:hash(path),onlyAuthorizedScalarReplacements:JSON.parse(text).files!==undefined}))},
 manifest:{path:manifestPath,ownAcceptanceBlock:block,ownHeaderBlock:headerBlock,beforeSha256:crypto.createHash('sha256').update(original).digest('hex'),afterSha256:hash(manifestPath),otherBytesPreserved:true},
 flags2Followup:{id:'G03',status:'unresolved_requeue_after_flags2_review',reviewedCandidate:'B2B36',verdict:'REVISE',liveRule:'Keep the existing live v1. The frozen flags2 packet skipped duplicate authorship; that does not establish accepted coverage. No flags2 file is edited.'},
};
fs.writeFileSync('tools/question-quality/batch2b-acceptance-changes-20261105.json',JSON.stringify(changes,null,2)+'\n');
console.log(JSON.stringify({accepted:rows.length,held:heldIds,parked:changes.parkedReviseIds.length,digestKeys:3,captures:2,manifestRowsInserted:rows.length,headerRowsInserted:rows.length,otherManifestBytesPreserved:true},null,2));
