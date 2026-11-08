import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-flags3-acceptance-20261107/';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const text=p=>{const b=fs.readFileSync(p);return (b[0]===255&&b[1]===254?b.toString('utf16le'):b.toString('utf8')).replace(/^\ufeff/,'').replace(/\x1b\[[0-9;]*m/g,'');};
const final=(s,pattern)=>[...s.matchAll(pattern)].at(-1)?.[1]?.trim()??null;
const failureTitles=s=>{
 const lines=s.split(/\r?\n/),result=[];
 for(let i=0;i<lines.length;i++)if(/^\s*FAIL\s+/.test(lines[i])){
  let title=lines[i].replace(/^\s*FAIL\s+/,'').trim();
  while(i+1<lines.length&&lines[i+1].trim()&&!/^\s*(?:FAIL\s|AssertionError:|Error:|CloudCodecError:|TypeError:|❯)/.test(lines[i+1]))title+=' '+lines[++i].trim();
  result.push(title.replace(/\s+/g,' '));
 }
 return [...new Set(result)];
};
const specs=[
 ['clinical','clinical-close','packages/clinical-content','npm.cmd test -- --pool=threads'],
 ['domain','domain','packages/game-domain','npm.cmd test -- --pool=threads'],
 ['typecheck','typecheck-close','.','npm.cmd run typecheck'],
 ['player','player','apps/player','npm.cmd test -- --pool=threads src/questionShipSaveCompatibility.test.ts src/session/cloud/separateCampaign.test.ts src/session/flagFreeze.test.tsx'],
 ['lint','lint-tests','.','npm.cmd run clinical:lint:test'],
];
const results=Object.fromEntries(specs.map(([id,file,cwd,command])=>{
 const log=dir+file+'.log',s=text(log),exit=Number(text(dir+file+'.exit').trim());
 return [id,{cwd,command,preload:id==='player'?'tools/question-quality/adversarial-r5-player-preload-20261102.cjs':null,
  logPath:log,logSha256:hash(log),exitCode:exit,
  fileSummary:final(s,/^\s*Test Files\s+(.+)$/gm),testSummary:final(s,/^\s*Tests\s+(.+)$/gm),
  duration:final(s,/^\s*Duration\s+(.+)$/gm),failureTitles:failureTitles(s),
  ...(id==='typecheck'?{workspaces:[...s.matchAll(/^> (@gamify-surgery\/[^\s]+)@[^\s]+ typecheck/gm)].map(m=>m[1])}:{}),
  ...(id==='lint'?{tests:Number(final(s,/^.*?tests (\d+)$/gm)),pass:Number(final(s,/^.*?pass (\d+)$/gm)),fail:Number(final(s,/^.*?fail (\d+)$/gm)),durationMs:Number(final(s,/^.*?duration_ms ([\d.]+)$/gm))}:{})}];
}));
assert.equal(results.clinical.exitCode,0);assert.equal(results.typecheck.exitCode,0);assert.equal(results.lint.exitCode,0);
assert.equal(results.typecheck.workspaces.length,7);assert.equal(results.domain.failureTitles.length,27);assert.equal(results.player.failureTitles.length,1);
const expectedDomain=[
 'tests/approved-clinical-admission.test.ts > approved clinical admission boundaries > keeps the unapproved prototype runtime release limited to explicitly admitted concepts',
 'tests/level-five-integration.test.ts > M9 connected Level 5 reducer journey > binds the actual run to its current game, balance, clinical and driver inputs and reconciles cash',
 ...['+0','1','2','3','4'].flatMap(level=>[5,6,7,8,9].map(schema=>`tests/level-five-integration.test.ts > M9 Level 0-4 intake behavior after the ordinary cap-5 switch > matches the actual pre-M9 load and next 120 minutes for level ${level}/schema ${schema}`)),
];
assert.deepEqual(results.domain.failureTitles,expectedDomain,'No new domain failure title');
assert.deepEqual(results.player.failureTitles,['src/session/cloud/separateCampaign.test.ts > explicit separate account campaign for a divergent local branch > retains real retired encounters which no longer exist in the playable state']);
const report={checkedOn:'2026-11-07',results,
 focusedCoverage:{shipSaveTests:31,shipSaveFailures:0,addedTests:12,acceptedDefaultFormat3Completions:3,legacyWaitingFormat3Completions:3,legacyInProgressFormat3Completions:3,legacyJournalCompletions:3,
  frozenFields:'Original complete node list, question/concept IDs, randomized choice order, earlier histories, idempotent answers, card ownership, completed reload and durable journal state. Tick bound remains 240.'},
 knownFailures:{domain:{previouslyDocumentedIn:'docs/research/endoscopy-ready-stuck-20261105.md',newFailureTitles:[],
  sourceBinding:'First mismatch is the already changed balance guidance-tips.ts input; four additional inputs changed by this milestone are listed in the acceptance scope. No evidence was rebound.',
  legacyEvidence:'25 previously stale loaded-state hashes; release manager owns refresh.',
  admittedConceptFixture:'Expected 585 meanings before this milestone already differed from 605. Actual now 606. Historical fixture left untouched.'},
  player:{previouslyDocumentedIn:'docs/research/question-new-n3-acceptance-handoff-20261105.md',error:'CloudCodecError: JSON string exceeds the codec limit at codecJson.ts:63, separateCampaign.test.ts:54. Cloud implementation and limits untouched.'}},
 finalReproducibilityCommands:['node tools/question-quality/review-question-flags3-accepted-20261107.mjs --check','node tools/question-quality/check-question-flags3-acceptance-20261107.mjs --check'],
 clinicalApproval:false,fullDomainOrPlayerGreen:false};
const output='docs/research/question-flags3-acceptance-validation-20261107.json';
if(process.argv.includes('--check'))assert.deepEqual(JSON.parse(fs.readFileSync(output,'utf8')),report);else fs.writeFileSync(output,JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(Object.fromEntries(Object.entries(results).map(([id,r])=>[id,{exit:r.exitCode,files:r.fileSummary,tests:r.testSummary,duration:r.duration,failures:r.failureTitles.length,...(r.workspaces?{workspaces:r.workspaces.length}:{}),...(id==='lint'?{pass:r.pass,fail:r.fail,durationMs:r.durationMs}:{})}])) ,null,2));
