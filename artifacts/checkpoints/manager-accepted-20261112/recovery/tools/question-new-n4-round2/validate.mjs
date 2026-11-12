// Read existing command receipts; this does not rerun tests or edit product files.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='.local-dev/question-new-n4-round2-20261110';
const hash=x=>createHash('sha256').update(x).digest('hex');
const read=p=>{const b=fs.readFileSync(p);return (b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8')).replace(/^\uFEFF/,'').replace(/\u001b\[[0-9;]*m/g,'');};
const json=p=>JSON.parse(read(p));
const exit=n=>Number(read(root+'/'+n+'.exit.txt').trim());
function vitest(name){
 const text=read(root+'/'+name+'.log');
 const metric=label=>{const m=text.match(new RegExp(label+'\\s+([^\\n]+)\\((\\d+)\\)'));assert.ok(m,label+' summary missing');return {passed:Number(m[1].match(/(\d+) passed/)?.[1]??0),failed:Number(m[1].match(/(\d+) failed/)?.[1]??0),total:Number(m[2])};};
 const failures=text.split(/\n FAIL  /).slice(1).map(block=>({
  test:block.split('AssertionError:')[0].replace(/\s+/g,' ').trim(),
  input:block.match(/AssertionError: ([^:]+):/)?.[1],
  expected:block.match(/Expected: "([a-f0-9]{64})"/)?.[1],
  received:block.match(/Received: "([a-f0-9]{64})"/)?.[1],
 })).sort((a,b)=>a.test.localeCompare(b.test));
 return {exit:exit(name),files:metric('Test Files'),tests:metric('Tests'),durationSeconds:Number(text.match(/Duration\s+([\d.]+)s/)?.[1]),failures,log:root+'/'+name+'.log'};
}
const before=vitest('clinical-before'),after=vitest('clinical-final'),focused=vitest('focused-final');
assert.deepEqual(before.files,{passed:129,failed:3,total:132});assert.deepEqual(before.tests,{passed:1646,failed:3,total:1649});
assert.deepEqual(after.files,{passed:130,failed:3,total:133});assert.deepEqual(after.tests,{passed:1660,failed:3,total:1663});
assert.equal(before.exit,1);assert.equal(after.exit,1);assert.equal(before.failures.length,3);assert.deepEqual(after.failures,before.failures);
assert.deepEqual(focused.tests,{passed:14,failed:0,total:14});assert.equal(focused.exit,0);
const tc=read(root+'/typecheck-handback.log');const workspaces=[...tc.matchAll(/> (@gamify-surgery\/[^@\s]+)@[^\n]+ typecheck/g)].map(m=>m[1]);
assert.equal(exit('typecheck-handback'),0);assert.equal(workspaces.length,7);assert.doesNotMatch(tc,/error TS\d+/);
const lt=read(root+'/lint-tests.log');const lm=label=>Number(lt.match(new RegExp('(?:^|\\n)[^\\n]*?'+label+' (\\d+)\\s*(?:\\n|$)'))?.[1]);
assert.equal(exit('lint-tests'),0);assert.equal(lm('tests'),33);assert.equal(lm('pass'),33);assert.equal(lm('fail'),0);
const lint=json(root+'/lint.json');assert.equal(lint.totals.findings,1);assert.equal(lint.suppressedFindings,0);assert.equal(lint.manualDisposition.suppressed,false);
assert.equal(lint.manualDisposition.rule,'near-duplicate-options');assert.equal(lint.manualDisposition.questionVariantId,'question.n4.bilateral-testis-maintenance-versus-ascent.v2');
const preview=json(root+'/preview.json');assert.equal(exit('preview-handback'),0);assert.equal(preview.testedSourceFlows,12);assert.equal(preview.blockedByCurrentTopicAffinity,3);
assert.equal(preview.newProductionRegistrations,0);assert.equal(preview.temporaryCandidateTimingAndFamilyBindingsRestored,true);assert.equal(preview.defaultReleaseUnchanged,true);
for(const r of preview.rows)for(const k of ['actualSourcePreserved','phaseHeldUntilAnswerAndClose','phaseResumedAfterClose','frozenReopenUnderDefault','correctlyScored','seededReviewRetained','noCircularOperationOrder'])assert.equal(r[k],true,r.caseId+': '+k);
assert.ok(new Set(preview.rows.map(r=>r.keyPosition)).size>1);
const idle=json(root+'/idle-source-probe.json');assert.equal(exit('idle-source-probe'),0);
const packetPath='docs/research/question-new-n4-round2-20261110.json',p=json(packetPath),oldPacketPath='docs/research/question-new-n4-20261110.json';
const frozen=json(root+'/frozen-pass.json');assert.equal(hash(fs.readFileSync(oldPacketPath)),'884d476865e298884e0cf6da246cb30087f4bc68506f777e1514eb78a9a47b2c');
assert.equal(p.variants.filter(v=>v.frozen).length,4);
for(const f of frozen){const v=p.variants.find(v=>v.questionVariantId===f.questionVariantId);assert.equal(v.exactVersionSha256,f.exactVersionSha256);assert.deepEqual(v.after,f.after);}
assert.equal(p.integration.defaultRegistered,false);assert.equal(p.integration.manifestEdited,false);assert.equal(p.counts.newOrRevisedToReview,11);
assert.equal(p.counts.uniqueParkedTopics,17);assert.equal(p.counts.ownerHeld,1);assert.equal(p.sourceMode.newAtomicClaims,26);assert.equal(p.sourceMode.newPermittedSourceRecords,16);
for(const v of p.variants)assert.equal(v.reviewStatus,'needs_clinician_review');
const intake=json(root+'/intake.json');const changes=intake.files.filter(f=>!fs.existsSync(f.path)||hash(fs.readFileSync(f.path))!==f.sha256).map(f=>({path:f.path,before:f.sha256,after:fs.existsSync(f.path)?hash(fs.readFileSync(f.path)):null}));
// Report a concurrent edit without restoring another lane's work. The author must explain any nonempty list in the handoff.
const currentPath='docs/handoffs/CURRENT_THREAD_HANDOFF.md';const currentBefore=fs.readFileSync(root+'/current-handoff-before.bin'),currentNow=fs.readFileSync(currentPath);
assert.ok(currentNow.subarray(0,currentBefore.length).equals(currentBefore),'Thread handoff prefix must be preserved');
const ownedFiles=[...fs.readdirSync('packages/clinical-content/src').filter(n=>n.startsWith('question-new-n4-round2-')).map(n=>'packages/clinical-content/src/'+n),
 ...fs.readdirSync('tools/question-new-n4-round2').map(n=>'tools/question-new-n4-round2/'+n),packetPath,'docs/research/question-new-n4-round2-handoff-20261110.md','docs/execplans/question-new-n4-round2-20261110.md'];
for(const f of ownedFiles)assert.ok(fs.existsSync(f),f);
const receipt={milestone:'N4 round 2',checkedOn:'2026-11-10',packet:{path:packetPath,sha256:hash(fs.readFileSync(packetPath)),counts:p.counts},
 clinicalBefore:before,clinicalAfter:after,introducedClinicalFailures:after.failures.filter(f=>!before.failures.some(b=>JSON.stringify(b)===JSON.stringify(f))).length,
 focused,rootTypecheck:{exit:0,workspaces,log:root+'/typecheck-handback.log'},lintTests:{tests:33,passed:33,failed:0,durationMs:Number(lt.match(/duration_ms ([\d.]+)/)?.[1]),log:root+'/lint-tests.log'},
 cueLint:{...lint.totals,suppressedFindings:0,manualDisposition:lint.manualDisposition},
 sourcePreview:{tested:12,affinityBlocked:preview.blocked,phaseHeldAndResumed:true,frozenReopenScoringAndSeededReview:true,defaultReleaseUnchanged:true,scope:preview.scope,log:root+'/preview-handback.log'},
 idleSourceProbe:{detected:idle.detected,rows:idle.rows.map(r=>({group:r.group,caseId:r.caseId,initialServiceOperations:r.initialServiceOperations,finalServiceOperations:r.finalServiceOperations,unsourcedAdmissions:r.unsourcedAdmissions.length,consults:r.unsourcedAdmissions.map(e=>e.consult)})),receipt:root+'/idle-source-probe.json'},
 frozenPriorPass:4,inheritedRound1PacketUnchanged:true,intake:{compared:intake.files.length,unchanged:intake.files.length-changes.length,changed:changes},
 threadHandoff:{appendOnlyPrefixPreserved:true,appendedBytes:currentNow.length-currentBefore.length},level5BoundInputEdits:[],
 ownedFiles:ownedFiles.map(path=>({path,sha256:hash(fs.readFileSync(path))})),clinicalApproval:false,defaultRegistration:false};
fs.writeFileSync(root+'/validation.json',JSON.stringify(receipt,null,2)+'\n');
console.log(JSON.stringify({packetSha256:receipt.packet.sha256,clinicalAfter:after.tests,introducedClinicalFailures:receipt.introducedClinicalFailures,focused:focused.tests,
 typecheckWorkspaces:workspaces.length,lintTests:receipt.lintTests.passed,cueFindings:lint.totals.findings,sourceFlows:12,affinityBlocked:3,existingFilesUnchanged:receipt.intake.unchanged,concurrentChanges:changes.length,ownedFiles:ownedFiles.length}));
