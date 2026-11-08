import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';

const dir='.local-dev/question-flags4-acceptance-20261108/';
const hash=path=>createHash('sha256').update(fs.readFileSync(path)).digest('hex');
const read=path=>{const b=fs.readFileSync(path);return (b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8')).replace(/^\uFEFF/,'').replace(/\x1b\[[0-9;]*m/g,'');};
const titles=text=>[...text.matchAll(/^ FAIL\s+([\s\S]*?)(?=^ FAIL\s|^(?:AssertionError|Error|TypeError|CloudCodecError|ReferenceError):|^⎯|^ ❯)/gm)]
 .map(m=>m[1].replace(/\s+/g,' ').trim());
function vitest(name,cwd,command,exitCode,preload=null){
 const path=dir+name,text=read(path),files=text.match(/Test Files\s+([^\r\n]+)/)?.[1],tests=text.match(/^\s*Tests\s+([^\r\n]+)/m)?.[1];
 assert(files&&tests,name+' incomplete');
 const count=(line,kind)=>Number(line.match(new RegExp('(\\d+) '+kind))?.[1]??0);
 return {cwd,command,preload,exitCode,files:{passed:count(files,'passed'),failed:count(files,'failed'),skipped:count(files,'skipped'),total:Number(files.match(/\((\d+)\)/)?.[1])},
  tests:{passed:count(tests,'passed'),failed:count(tests,'failed'),skipped:count(tests,'skipped'),total:Number(tests.match(/\((\d+)\)/)?.[1])},
  duration:text.match(/Duration\s+([^\r\n]+)/)?.[1],failureTitles:titles(text),log:path,logSha256:hash(path),exactSummary:'Test Files  '+files+'\nTests  '+tests};
}
const preload='tools/question-quality/adversarial-r5-player-preload-20261102.cjs';
const clinical=vitest('clinical-full-final.log','packages/clinical-content','npm.cmd test -- --pool=threads',1);
const domain=vitest('domain-full.log','packages/game-domain','npm.cmd test -- --pool=threads',1);
const player=vitest('player-focused-final.log','apps/player','npm.cmd test -- --pool=threads --maxWorkers=2 src/questionShipSaveCompatibility.test.ts src/questionFlags4SaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx',1,preload);
const flags4Player=vitest('player-flags4-focused.log','apps/player','npm.cmd test -- --pool=threads src/questionFlags4SaveCompatibility.test.ts',0,preload);
const playerFirst=vitest('player-focused.log','apps/player',player.command.replace(' --maxWorkers=2',''),1,preload);
const clinicalFocused=vitest('clinical-focused-final.log','packages/clinical-content','npm.cmd test -- --pool=threads question-flags4-acceptance-20261108.test.ts question-flags4-20261108.test.ts answer-choice-timing.test.ts',0);
const typeText=read(dir+'typecheck-seven-final.log'),workspaces=[...typeText.matchAll(/> (@gamify-surgery\/[\w-]+)@[^\r\n]+ typecheck/g)].map(m=>m[1]);
assert.equal(workspaces.length,7);assert(!/error TS\d+|Lifecycle script .* failed/.test(typeText));
const lintText=read(dir+'linter-tests.log');assert.match(lintText,/pass 33/);assert.match(lintText,/fail 0/);
const before=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags4-acceptance-before-20261108.json','utf8'));
const author=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-flags4-before-20261108.json','utf8'));
const stats=JSON.parse(fs.readFileSync('tools/question-quality/fixtures/question-stats1-acceptance-before-20261108.json','utf8'));
const outsidePaths=['packages/game-domain/src/diagnostic-timing.ts','apps/player/src/session/cloud/codecJson.ts'];
const priorDomain=JSON.parse(fs.readFileSync('docs/research/question-stats1-acceptance-validation-20261108.json','utf8')).results.domain;
const record={checkedOn:'2026-11-08',clinicalApproval:false,results:{clinical,clinicalFocused,domain,player,flags4Player,playerInitialConcurrent:playerFirst,
 typecheck:{cwd:'.',command:'npm.cmd run typecheck',exitCode:0,workspaceCount:7,workspaces,log:dir+'typecheck-seven-final.log',logSha256:hash(dir+'typecheck-seven-final.log'),exactOutput:typeText.trim()},
 cueLinterTests:{cwd:'.',command:'npm.cmd run clinical:lint:test',exitCode:0,passed:33,failed:0,durationMilliseconds:Number(lintText.match(/duration_ms ([\d.]+)/)[1]),log:dir+'linter-tests.log',logSha256:hash(dir+'linter-tests.log')}},
 sourceDriftOutsideThisLane:outsidePaths.map(path=>({path,ownedOrEditedByFlags4:false,currentSha256:hash(path),flags4AcceptanceIntakeSha256:before.files[path]??null,flags4AuthoringIntakeSha256:author.files[path]??null,stats1IntakeSha256:stats.files[path]??null,
  disposition:'Existing historical assertion retained. No capture refresh, source adapter absorption, budget change or edit of the other lane.'})),
 domainComparison:{reference:'docs/research/question-stats1-acceptance-validation-20261108.json#results.domain',referenceIsContemporaneousBaseline:false,
  previousFailureCount:priorDomain.failureTitles.length,currentFailureCount:domain.failureTitles.length,
  newFailureTitles:domain.failureTitles.filter(t=>!priorDomain.failureTitles.includes(t)),previousTitlesNoLongerFailing:priorDomain.failureTitles.filter(t=>!domain.failureTitles.includes(t))},
 preservation:{acceptedViewCueFindings:0,suppressedCueFindings:0,changedCases:1,newManifestRows:1,newTimingRows:1,oldCasesAndMeaningsPreserved:true,oldTimingsAndManifestRowsPreserved:true},
 notes:[
  'All four new accepted-default/legacy format-3/journal tests pass. The original frozen four-choice order and stable FSRS history survive reopening and completion.',
  'The full clinical suite is not green: three historical source-preservation tests detect diagnostic-timing.ts or codecJson.ts changes outside this lane. Those assertions remain intact.',
  'The initial concurrent focused player run had two existing 5000ms questionShipSaveCompatibility timeouts; the final run keeps all83 tests in the same four files, uses --maxWorkers=2 after the full domain/clinical jobs, and changes no test, timeout or budget.',
  'The separateCampaign codec-size failure was already recorded in the preceding stats1 acceptance; cloud worker owns its implementation.',
  'Domain failure titles are reported exactly; Level 5 evidence and loaded-state baselines are not rebound or refreshed here.',
  'No earlier result is represented as a new passing full suite. Raw logs and SHA-256 values are retained.',
 ],
};
const path='docs/research/question-flags4-acceptance-validation-20261108.json';fs.writeFileSync(path,JSON.stringify(record,null,2)+'\n');
console.log(JSON.stringify({path,clinical:clinical.exactSummary,domain:domain.exactSummary,player:player.exactSummary,flags4Player:flags4Player.exactSummary,typecheckWorkspaces:7,cueLinterTests:33},null,2));
