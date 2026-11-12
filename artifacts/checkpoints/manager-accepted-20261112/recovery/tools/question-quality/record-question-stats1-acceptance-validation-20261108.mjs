import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-stats1-acceptance-20261108/';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const text=p=>{const b=fs.readFileSync(p);return(b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8')).replace(/^\ufeff/,'').replace(/\x1b\[[0-9;]*m/g,'');};
const last=(s,re)=>[...s.matchAll(re)].at(-1)?.[1]?.trim()??null;
const titles=s=>{
 const lines=s.split(/\r?\n/),out=[];
 for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s+/.test(lines[i])){
  let title=lines[i].replace(/^\s*FAIL\s+/,'').trim();
  while(i+1<lines.length&&lines[i+1].trim()&&!/^\s*(?:FAIL\s|AssertionError:|Error:|CloudCodecError:|TypeError:|RangeError:|❯)/.test(lines[i+1]))title+=' '+lines[++i].trim();
  out.push(title.replace(/\s+/g,' '));
 }
 return [...new Set(out)];
};
const playerCommand='npm.cmd test -- --pool=threads src/questionShipSaveCompatibility.test.ts src/questionStats1SaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx';
const specs=[
 ['domainBaseline','domain-baseline','packages/game-domain','npm.cmd test -- --pool=threads'],
 ['playerBaseline','player-baseline','apps/player','npm.cmd test -- --pool=threads src/questionShipSaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx'],
 ['clinical','clinical-close','packages/clinical-content','npm.cmd test -- --pool=threads'],
 ['domain','domain-close','packages/game-domain','npm.cmd test -- --pool=threads'],
 ['patientSupplyFocused','patient-supply-focused','packages/game-domain','npm.cmd test -- --pool=threads tests/patient-supply.test.ts'],
 ['typecheck','typecheck-close','.','npm.cmd run typecheck'],
 ['player','player-close','apps/player',playerCommand],
 ['lint','lint-tests','.','npm.cmd run clinical:lint:test'],
];
const results=Object.fromEntries(specs.map(([id,file,cwd,command])=>{
 const log=dir+file+'.log',s=text(log);return[id,{cwd,command,preload:id.startsWith('player')?'tools/question-quality/adversarial-r5-player-preload-20261102.cjs':null,
  logPath:log,logSha256:hash(log),exitCode:Number(text(dir+file+'.exit').trim()),fileSummary:last(s,/^\s*Test Files\s+(.+)$/gm),testSummary:last(s,/^\s*Tests\s+(.+)$/gm),
  duration:last(s,/^\s*Duration\s+(.+)$/gm),failureTitles:titles(s),
  ...(id==='typecheck'?{workspaces:[...s.matchAll(/^> (@gamify-surgery\/[^\s]+)@[^\s]+ typecheck/gm)].map(m=>m[1])}:{}),
  ...(id==='lint'?{tests:Number(last(s,/^.*?tests (\d+)$/gm)),passed:Number(last(s,/^.*?pass (\d+)$/gm)),failed:Number(last(s,/^.*?fail (\d+)$/gm)),durationMs:Number(last(s,/^.*?duration_ms ([\d.]+)$/gm))}:{})}];
}));
const expectedDomain=[
 'tests/approved-clinical-admission.test.ts > approved clinical admission boundaries > keeps the unapproved prototype runtime release limited to explicitly admitted concepts',
 'tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash',
 ...['+0','1','2','3','4'].flatMap(level=>[5,6,7,8,9].map(schema=>`tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level ${level}/schema ${schema}`)),
];
const patientTimeout='tests/patient-supply.test.ts > routine patient supply > records the current clinical inventory and exact unseen-patient boundary by stage';
const expectedPlayer=['src/session/cloud/separateCampaign.test.ts > explicit separate account campaign for a divergent local branch > retains real retired encounters which no longer exist in the playable state'];
assert.deepEqual(results.domainBaseline.failureTitles,[...expectedDomain,patientTimeout]);
const timingFailure=results.domain.failureTitles.includes(patientTimeout);
assert.deepEqual(results.domain.failureTitles,[...expectedDomain,...(timingFailure?[patientTimeout]:[])],'No new domain failure');
assert(results.patientSupplyFocused.failureTitles.every(t=>t===patientTimeout),'Focused patient supply has no new failure');
assert.deepEqual(results.playerBaseline.failureTitles,expectedPlayer);assert.deepEqual(results.player.failureTitles,expectedPlayer,'No new player failure');
assert.equal(results.clinical.exitCode,0);assert.equal(results.typecheck.exitCode,0);assert.equal(results.lint.exitCode,0);assert.equal(results.typecheck.workspaces.length,7);
assert.equal(results.clinical.testSummary,'1566 passed (1566)');assert.equal(results.domain.testSummary,timingFailure?'28 failed | 5220 passed | 1 skipped (5249)':'27 failed | 5221 passed | 1 skipped (5249)');
assert.equal(results.player.testSummary,'1 failed | 334 passed (335)');assert.equal(results.lint.passed,33);assert.equal(results.lint.failed,0);
const report={checkedOn:'2026-11-08',results,addedClinicalTests:93,
 domainTestCountChange:{before:5187,after:5249,added:62,reason:'question-ship-gate.test.ts parameterizes all non-review.n acceptance rows. Replacing two rows with64 adds62 executed data-driven acceptance cases; no domain file was edited.'},
 focusedCoverage:{originalShipSaveTests:31,originalShipSaveFailures:0,newStats1Tests:256,newStats1Failures:0,
  newPatientCaseTests:48,newEmployeeCaseTests:208,acceptedDefaultFormat3Completions:64,legacyWaitingFormat3Completions:64,legacyInProgressFormat3Completions:64,legacyJournalCompletions:64,
  proves:'Exact frozen question/concept IDs, full nodes and shuffled choice order, old histories, idempotent scoring, card ownership, completed reloads and durable journal state. Both patient admission and ordinary NP discussion scheduling are exercised. No codec limit,240-tick bound or timeout increased.'},
 knownFailures:{newDomainFailureTitles:[],newPlayerFailureTitles:[],baselineOnly:timingFailure?[]:[patientTimeout],currentTimingFailures:timingFailure?[patientTimeout]:[],
  domain:{registry:'Static fixture expects585 meanings; before and after this milestone actual606. No registry expectation or domain semantics changed.',
   sourceBinding:'First mismatch is the pre-existing balance guidance-tips.ts input. Three additional existing bound clinical inputs changed in this milestone; no evidence edit/rebind.',
   legacy:'25 pre-existing loaded-state SHA failures for Level0-4 x schema5-9. Exact same titles reproduce before acceptance. Manager owns evidence refresh.',
   timeout:timingFailure?'Patient-supply timed out at10000ms in both baseline and closing full runs. The unchanged file also has a focused diagnostic result in this receipt. No timeout extended or assertion altered.':'Patient-supply baseline timed out at10000ms; closing run passes unchanged. No timeout extended or assertion altered.'},
  player:{error:'CloudCodecError: JSON string exceeds the codec limit at codecJson.ts:63, called by separateCampaign.test.ts:54. Exact same failure before and after; cloud/save code and limits untouched.'}},
 integrationTestAdjustments:{historical:'Exact full-delta epoch adapters retain all old captures and assertions; cache immutable receipt parsing to avoid repeated parsing, without budget changes.',
  presentationOnlyStaffProfiles:'Retain42 PASS bytes. Only exact accepted stats staff cases may have one presentation-only profile with exactly id/chiefComplaint/presentation and no patient demographics or vitals.',
  roundingInstruction:'Pin frozen PASS S47 exact task; it legitimately has an imperative rounding instruction after its question.',
  rawCharacterLength:'Ten explicit accepted statistics versions have a uniquely longest key under the old literal character metric. Pin every whole-case hash and exact manifest decision, require each exception still to be a violation, retain all other old assertions and budgets. No linter rule was suppressed or changed.'},
 reproductionCommands:['node tools/question-quality/author-question-stats1-accepted-20261108.mjs --check','node tools/question-quality/integrate-question-stats1-accepted-20261108.mjs --check',
  'node tools/question-quality/review-question-stats1-accepted-20261108.mjs --check','node tools/question-quality/record-question-stats1-acceptance-source-migration-20261108.mjs --check',
  'node tools/question-quality/check-question-stats1-acceptance-20261108.mjs --check'],
 clinicalApproval:false,fullDomainOrPlayerGreen:false,deployPerformed:false,rebindPerformed:false};
const output='docs/research/question-stats1-acceptance-validation-20261108.json';
if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(output,'utf8')),report);else fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(results).map(([id,r])=>[id,{exit:r.exitCode,files:r.fileSummary,tests:r.testSummary,duration:r.duration,failures:r.failureTitles.length,
 ...(r.workspaces?{workspaces:r.workspaces.length}:{}),...(id==='lint'?{passed:r.passed,failed:r.failed,durationMs:r.durationMs}:{})}])) ,null,2));
