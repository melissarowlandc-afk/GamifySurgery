import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

// Read-only checks of the recorded runs and owned outputs. This is not a
// clinical approval, an independent editorial review, or a runtime gate.
const dir='.local-dev/question-new-n4-20261110/';
const sha=v=>createHash('sha256').update(v).digest('hex');
const read=path=>{
 const bytes=fs.readFileSync(path);
 return (bytes[0]===255&&bytes[1]===254?bytes.subarray(2).toString('utf16le'):bytes.toString('utf8'))
  .replace(/^\uFEFF/,'').replace(/\x1b\[[0-9;]*m/g,'').replace(/\r/g,'');
};
const json=path=>JSON.parse(read(path));
const exitCode=name=>Number(read(dir+name+'.exit.txt').trim());
function vitest(name){
 const output=read(dir+name+'.log');
 const counts=kind=>{
  const line=output.split('\n').find(line=>new RegExp('^\\s*'+kind+'\\s+').test(line));
  assert(line,'Missing '+kind+' summary in '+name);
  return {passed:Number(line.match(/(\d+) passed/)?.[1]??0),failed:Number(line.match(/(\d+) failed/)?.[1]??0),
   total:Number(line.match(/\((\d+)\)/)?.[1]),exact:line.trim()};
 };
 const failures=output.split('\n FAIL ').slice(1).map(part=>{
  const block=part.split('\n⎯')[0];
  const header=block.split('\nAssertionError:')[0].replace(/\s+/g,' ').trim();
  const [file,...title]=header.split(' > ');
  return {file,title:title.join(' > '),assertion:block.match(/AssertionError: ([\s\S]*?)(?=\n\n)/)?.[1].replace(/\s+/g,' '),
   expected:block.match(/Expected: "([a-f0-9]{64})"/)?.[1],received:block.match(/Received: "([a-f0-9]{64})"/)?.[1]};
 });
 return {command:'npm.cmd run test --workspace @gamify-surgery/clinical-content -- '+
  (name.includes('focused')?'src/question-new-n4-20261110.test.ts ':'')+'--pool=threads --maxWorkers=2',
  log:dir+name+'.log',exit:exitCode(name),files:counts('Test Files'),tests:counts('Tests'),
  duration:output.match(/Duration\s+([^\n]+)/)?.[1],failures};
}
const before=vitest('clinical-before'),after=vitest('clinical-handback'),focused=vitest('clinical-focused-final');
assert.equal(before.tests.total,1621);assert.equal(before.tests.failed,3);
assert.deepEqual(after.failures,before.failures,'A newly failing assertion requires fresh attribution, not a baseline label');
assert.equal(after.tests.total,1649);assert.equal(after.tests.failed,3);assert.equal(after.tests.passed-before.tests.passed,28);
assert.equal(focused.tests.passed,28);assert.equal(focused.tests.failed,0);assert.equal(focused.exit,0);
assert.equal(after.tests.total-before.tests.total,28);
const typeLog=read(dir+'typecheck-handback.log');
const workspaces=[...typeLog.matchAll(/^> (@gamify-surgery\/[^ ]+)@[^ ]+ typecheck$/gm)].map(m=>m[1]);
assert.equal(workspaces.length,7);assert.equal(exitCode('typecheck-handback'),0);
const lintLog=read(dir+'lint-tests.log');
assert.match(lintLog,/\btests 33\b/);assert.match(lintLog,/\bpass 33\b/);assert.match(lintLog,/\bfail 0\b/);
assert.equal(exitCode('lint-tests'),0);
const packetPath='docs/research/question-new-n4-20261110.json',packet=json(packetPath),receipt=json(dir+'packet-receipt.json');
assert.equal(receipt.sha256,sha(fs.readFileSync(packetPath)));
assert.equal(packet.completionClaim,false);assert.equal(packet.counts.provisionalCandidates,21);
assert.deepEqual(packet.counts.byGroup,{intra_op:6,intra_endoscopy:7,wound_ostomy:6,pediatric:2});
assert.equal(packet.parkedDrafts.length,3);assert.equal(packet.pendingUnkeyedSlots.length,10);
assert.equal(packet.lintTotals.findings,0);assert.equal(packet.lintTotals.profileContexts,42);
assert.equal(packet.integration.defaultRegistered,false);assert.equal(packet.integration.manifestEdited,false);
for(const item of packet.variants){
 assert.equal(item.reviewStatus,'needs_clinician_review');assert.equal(item.managerAdmittedToLive,false);
 assert.equal(item.selfCheck.independent,false);assert.equal(item.selfCheck.clinicalApproval,false);
 assert.notEqual(item.selfCheck.authorVerdict,'PASS');assert.deepEqual(item.directKeySupport.heldKeyClaims,[]);
}
const preview=json(dir+'preview.json');
assert.equal(exitCode('preview-handback'),0);assert.equal(preview.testedSourceFlows,13);
assert.equal(preview.blockedByCurrentTopicAffinity,8);assert.equal(preview.newProductionRegistrations,0);
assert.equal(preview.temporaryCandidateTimingAndFamilyBindingsRestored,true);assert.equal(preview.defaultReleaseUnchanged,true);
for(const r of preview.rows)for(const k of ['actualSourcePreserved','phaseHeldUntilAnswerAndClose','frozenReopenUnderDefault','correctlyScored','oldReviewPreserved','noCircularOperationOrder'])assert.equal(r[k],true,r.caseId+':'+k);
assert.deepEqual([...new Set(preview.rows.map(r=>r.keyPosition))].sort(),[0,1,2]);
const probe=json(dir+'idle-source-probe.json'),orProbe=probe.rows.find(r=>r.group==='intra_op');
assert.equal(orProbe.initialServiceOperations,0);assert.equal(orProbe.finalServiceOperations,0);
assert.equal(orProbe.unsourcedAdmissions.length,1);assert.equal(orProbe.unsourcedAdmissions[0].consult,null);
const intake=json(dir+'intake.json'),current=path=>fs.existsSync(path)?sha(fs.readFileSync(path)):null;
const changedExisting=intake.files.filter(f=>current(f.path)!==f.sha256).map(f=>({...f,currentSha256:current(f.path)}));
const clinical=intake.files.filter(f=>f.path.startsWith('packages/clinical-content/src/'));
assert.equal(clinical.length,560);
assert.deepEqual(changedExisting.filter(f=>f.path.startsWith('packages/clinical-content/src/')),[],
 'All previously existing clinical source files must remain byte-exact in this new-file lane');
const sourceFiles=fs.readdirSync('packages/clinical-content/src').filter(n=>n.startsWith('question-new-n4-')).map(n=>'packages/clinical-content/src/'+n);
const toolFiles=fs.readdirSync('tools/question-new-n4').filter(n=>n.endsWith('.mjs')).map(n=>'tools/question-new-n4/'+n);
const docs=['docs/execplans/question-new-n4-20261110.md',packetPath,'docs/research/question-new-n4-handoff-20261110.md'];
const newFiles=[...sourceFiles,...toolFiles,...docs].sort();
assert.equal(sourceFiles.length,11);assert.equal(toolFiles.length,7);assert.equal(newFiles.length,21);
for(const file of newFiles){assert(fs.existsSync(file),file);assert(!intake.files.some(f=>f.path===file),file+' must be a new owned file');}
const oldHandoff=fs.readFileSync(dir+'current-handoff-before.bin'),handoff=fs.readFileSync('docs/handoffs/CURRENT_THREAD_HANDOFF.md');
const exactHandoffPrefix=handoff.subarray(0,oldHandoff.length).equals(oldHandoff);
// Another lane normalized older LF sections to CRLF before this worker's
// append. Never restore the intake copy over its later text or appends.
const normalizedHandoffPrefix=handoff.toString('utf8').replace(/\r\n/g,'\n')
 .startsWith(oldHandoff.toString('utf8').replace(/\r\n/g,'\n'));
assert(normalizedHandoffPrefix,'Every original handoff character must remain in order; only concurrent line-ending changes are tolerated');
assert(handoff.includes(Buffer.from('N4 partial checkpoint — 2026-11-10')),'Record remaining work instead of claiming completion');
const result={scope:'N4 authored partial checkpoint; clinical approval and milestone completion are not claimed',
 milestoneComplete:false,packet:receipt,clinical:{before,after,focused,remainingFailures:'The same three files/assertions/hashes fail before and after N4. No assertion, budget, timeout or protected pin was changed.'},
 typecheck:{command:'npm.cmd run typecheck',exit:0,workspaces,log:dir+'typecheck-handback.log'},
 lintTests:{command:'npm.cmd run clinical:lint:test',exit:0,passed:33,failed:0,durationMs:Number(lintLog.match(/duration_ms ([\d.]+)/)?.[1]),log:dir+'lint-tests.log'},
 preview:{command:'node --disable-warning=ExperimentalWarning tools/question-new-n4/preview.mjs',exit:0,passedSourceFlows:13,affinityBlockedCases:8,
  limitation:'The standalone Node preview temporarily installs exact candidate timing/family rows and restores them. It checks domain frozen-state reopen under the default projection while those overlays exist; it is not a full player format-3 or journal replay test.'},
 defaultRegistration:false,level5BoundInputEdits:[],sourceRetrievals:0,newAtomicFacts:0,
 existingClinicalSourceFilesUnchanged:clinical.length,changedExistingUnowned:changedExisting.filter(f=>f.path!=='docs/handoffs/CURRENT_THREAD_HANDOFF.md'),
 files:newFiles.map(path=>({path,sha256:current(path)})),
 handoffAppend:{path:'docs/handoffs/CURRENT_THREAD_HANDOFF.md',intakePrefixBytes:oldHandoff.length,intakePrefixSha256:sha(oldHandoff),
  exactIntakeBytePrefix:exactHandoffPrefix,allIntakeTextPreservedIgnoringCrLf:normalizedHandoffPrefix,
  note:'This worker used fs.appendFileSync only. Concurrent LF-to-CRLF normalization of older sections is retained, together with all later appends.'},
 followUp:'N4 is short of the requested supply. Resolve the earlier no-network constraint before targeted source verification for ten unwritten slots; independently review provisional candidates and resolve domain source-only/affinity integration before live acceptance.'};
fs.writeFileSync(dir+'validation.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({milestoneComplete:false,clinical:after.tests,focused:focused.tests,typecheckWorkspaces:workspaces.length,lintTests:33,
 candidateLintFindings:packet.lintTotals.findings,sourceFlows:13,affinityBlockedCases:8,unchangedExistingClinicalFiles:clinical.length,
 changedExistingUnowned:changedExisting.map(f=>f.path),newOwnedFiles:newFiles.length,validation:dir+'validation.json'}));
