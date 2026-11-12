import fs from 'node:fs';
import assert from 'node:assert/strict';
import {hash} from './preservation.mjs';
const dir='.local-dev/question-new-n2-round2-20261104';
function readLog(name){
 const b=fs.readFileSync(dir+'/'+name+'.log');
 return(b[0]===255&&b[1]===254?b.toString('utf16le').slice(1):b.toString('utf8')).replace(/\u001b\[[0-9;]*m/g,'');
}
function failures(s){
 const lines=s.split(/\r?\n/),starts=lines.flatMap((line,i)=>/^ FAIL\s/.test(line)?[i]:[]);
 return starts.map((start,index)=>{
  const limit=starts[index+1]??lines.length;let headEnd=start+1;
  while(headEnd<limit&&lines[headEnd].trim()&&!/^(?:AssertionError:|Error:|TypeError:|ReferenceError:| \u276f|\u23af|[-+])/.test(lines[headEnd]))headEnd++;
  const header=lines.slice(start,headEnd).join(' ').replace(/\s+/g,' ').trim();
  let error=headEnd;while(error<limit&&!/^(?:AssertionError:|Error:|TypeError:|ReferenceError:)/.test(lines[error]))error++;
  let end=error+1;while(end<limit&&!/^(?: \u276f|\u23af| Test Files)/.test(lines[end]))end++;
  return{file:header.match(/^FAIL\s+([^ ]+\.test\.[a-z]+)/)?.[1]??null,header,
   assertionExcerpt:error<limit?lines.slice(error,end).join('\n').slice(0,3000):null,
   sharedAssertion:error>=limit?'Vitest groups repeated failures; see the following consecutive headers and full native log.':null};
 });
}
const names=['lint-tests','typecheck','typecheck-final','typecheck-latest','typecheck-handoff','typecheck-exact',
 'clinical-full','clinical-final','clinical-latest','clinical-owned','clinical-handoff','clinical-shared-current',
 'domain-focused','domain-focused-final','domain-focused-latest','domain-owned','domain-handoff','domain-inventory-final','domain-supply-final',
 'domain-shared-current','domain-full','player-full','player-full-runner','player-full-native'];
const results=names.filter(n=>fs.existsSync(dir+'/'+n+'.log')).map(name=>{
 const text=readLog(name),exitPath=dir+'/'+name+'.exit.txt';
 return{name,nativeExit:fs.existsSync(exitPath)?Number(fs.readFileSync(exitPath,'utf8')):null,
  nativeExitFile:fs.existsSync(exitPath)?exitPath:null,
  command:[...text.matchAll(/^> (?:vitest run|node --test|npm run typecheck)[^\r\n]*/gm)].map(m=>m[0].slice(2)),
  files:text.match(/^\s*Test Files\s+([^\r\n]+)/m)?.[1]??null,tests:text.match(/^\s*Tests\s+([^\r\n]+)/m)?.[1]??null,
  start:text.match(/^\s*Start at\s+([^\r\n]+)/m)?.[1]??null,duration:text.match(/^\s*Duration\s+([^\r\n]+)/m)?.[1]??null,
  typecheckWorkspaces:[...text.matchAll(/^> (@gamify-surgery\/[^ ]+)@[^ ]+ typecheck/gm)].map(m=>m[1]),
  failures:failures(text),startupError:text.match(/(?:Startup Error[^\n]*\n[\s\S]{0,600})/)?.[0]??null,
  logPath:dir+'/'+name+'.log',logSha256:hash(fs.readFileSync(dir+'/'+name+'.log'))};
});
const byName=new Map(results.map(r=>[r.name,r]));
const domain=byName.get('domain-full'),player=byName.get('player-full-native');
const pending=!domain||domain.nativeExit===null||!player||player.nativeExit===null;
if(!process.argv.includes('--in-progress'))assert.ok(!pending,'Wait for actual full domain and player completion before handoff.');
assert.equal(domain.failures.length,34,'Index every native domain failure.');
assert.equal(byName.get('clinical-handoff').nativeExit,0);
assert.equal(byName.get('domain-handoff').nativeExit,0);
assert.equal(byName.get('domain-inventory-final').nativeExit,0);
assert.equal(byName.get('typecheck-exact').nativeExit,0);
assert.equal(byName.get('typecheck-exact').typecheckWorkspaces.length,7);
assert.equal(byName.get('lint-tests').nativeExit,0);
const ownFailures=results.filter(r=>['clinical-handoff','domain-handoff'].includes(r.name)).flatMap(r=>r.failures);
assert.deepEqual(ownFailures,[]);
const packetPath='docs/research/question-new-n2-round2-20261104.json',packet=JSON.parse(fs.readFileSync(packetPath,'utf8'));
const audit=JSON.parse(fs.readFileSync(dir+'/scope-audit.json','utf8'));
assert.equal(packet.lintTotals.findings,0);
const grouped=list=>list.reduce((o,f)=>{o[f.file]??=[];o[f.file].push(f);return o;},{});
const out={generatedAt:new Date().toISOString(),complete:!pending,
 scope:'37 returned N2 revisions; two exact PASS and all 51 captured N1 files preserved. Original N2 native test has an explicit historical-scope-only adjustment.',
 clinicalReviewStatus:'needs_clinician_review',independentReview:'pending',pipelinePassed:false,clinicalApproval:false,wholeTreeGreen:false,
 packet:{path:packetPath,sha256:hash(fs.readFileSync(packetPath)),items:39,revised:37,frozenPASS:2,selfChecks:37,predictedDifficulty:packet.authorSelfCheckSummary},
 artifacts:[packetPath,'docs/research/question-new-n2-round2-self-check-20261104.json','docs/research/sources-question-new-n2-round2-20261104.json'].map(path=>({path,sha256:hash(fs.readFileSync(path))})),
 lint:{findings:0,variants:39,contexts:78,ruleChanges:0,suppressions:0,exceptions:0},
 sourceLimits:{claims:audit.claims,records:audit.sources,publicationKeys:audit.sourcePublicationKeys,onePublicationClaims:audit.onePublicationClaims,
  localSyntheses:audit.syntheses,clinicalExtensionHolds:audit.clinicalExtensionHolds,noNewRetrieval:true,originalAccessDatesRetained:true},
 preserved:{N1:audit.protectedVersions.N1,originalN2:audit.protectedVersions.originalN2,PASS:audit.frozenPASS,N1RegistryBlocks:audit.protectedVersions.blocks},
 sourceWindows:{broadSnapshot:audit.fullRunInputs,ownRuntime:audit.ownRuntime,
  disclosedClarifications:JSON.parse(fs.readFileSync(dir+'/post-snapshot-clarifications.json','utf8')),
  focusedAfterClarification:['clinical-handoff','domain-handoff'],
  limitation:'Broad tests are not claimed to run against one final immutable shared tree. One final elective prolonged-fasting source qualifier and test-only expected deltas were applied afterward, explicitly recorded and focused checks rerun.'},
 results,
 failureClassification:{
  domain:[
   {count:26,files:['tests/level-five-integration.test.ts'],status:'Raw Level5 binding and legacy loaded-state digest assertions. Manager release-tree rebind/integration required; no evidence written or failure waived.'},
   {count:1,files:['tests/test-choice-order-inventory.test.ts'],status:'Owned expected-count delta +24 previews/+8 keyed previews fixed after full run; final inventory rerun eight/eight passes. The full-run failure is retained in the record.'},
   {count:7,files:Object.keys(grouped(domain.failures)).filter(p=>!['tests/level-five-integration.test.ts','tests/test-choice-order-inventory.test.ts'].includes(p)),status:'Shared earlier count, pool, route and simulation snapshot assertions. Own +21 registered-version delta is explicitly accounted for; latest supply still differs by five concurrent batch2a round3 IDs and a shared simulation snapshot. No unowned snapshot rewritten.'},
  ],
  clinical:{run:'clinical-latest',count:7,files:Object.keys(grouped(byName.get('clinical-latest').failures)),
   status:'Three batch2b tests use the final release/timing instead of their historical stage; one frozen N1 stage test now resolves through the later peer stage; one longest-key guard and two employee-demographic guards identify concurrent batch2a round3 content. No N1/unowned question definition or test changed.'},
  focused:{previousRun:'domain-focused-latest',previousRemaining:1,run:'domain-shared-current',remaining:byName.get('domain-shared-current').failures.length,
   status:'Current shared check: 185 pass / two patient-supply count/snapshot failures. The prototype expected list now passes after the peer update; N2 native/inventory tests also pass. Own +21 versions are explicit; remaining registered-count difference is five peer IDs.'},
  currentClinical:{run:'clinical-shared-current',remaining:byName.get('clinical-shared-current').failures.length,
   status:'Current selected check repeats the same seven shared failures; all 42 N2 clinical checks pass.'},
  player:player?{run:player.name,count:player.failures.length,files:Object.keys(grouped(player.failures)),status:pending?'Full run still active.':'Read exact failure index and native log; cloud/performance files remain outside this lane. No threshold, assertion or application implementation changed.'}:null,
 },
 levelFive:{changedExisting:audit.existingLevelFiveBoundInputsChanged,newRuntime:audit.newRuntimeLevelFiveDependencies,newDisplay:audit.newDisplayDependencies,evidenceWritten:false,rebound:false},
 playerLoader:JSON.parse(fs.readFileSync(dir+'/player-config-loader-receipt.json','utf8')),
 restrictions:audit.restrictions};
fs.writeFileSync(dir+'/'+(pending?'validation-in-progress.json':'validation.json'),JSON.stringify(out,null,2)+'\n');
fs.writeFileSync(dir+'/domain-failure-index.json',JSON.stringify(grouped(domain.failures),null,2)+'\n');
fs.writeFileSync(dir+'/clinical-failure-index.json',JSON.stringify(grouped(byName.get('clinical-latest').failures),null,2)+'\n');
if(player)fs.writeFileSync(dir+'/player-failure-index.json',JSON.stringify(grouped(player.failures),null,2)+'\n');
 console.log(JSON.stringify({complete:out.complete,packet:out.packet,results:results.filter(r=>['clinical-handoff','domain-handoff','domain-inventory-final','typecheck-exact','domain-full','player-full-native','clinical-latest','lint-tests'].includes(r.name)).map(({name,nativeExit,files,tests,duration})=>({name,nativeExit,files,tests,duration})),
 failureCounts:{domain:domain.failures.length,clinical:byName.get('clinical-latest').failures.length,player:player?.failures.length??null}},null,2));
