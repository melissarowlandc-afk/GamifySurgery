import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n1-round2-20261104';
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readLog=name=>{
  const path=dir+'/'+name+'.log',bytes=fs.readFileSync(path);
  return(bytes[0]===255&&bytes[1]===254?bytes.toString('utf16le').slice(1):bytes.toString('utf8')).replace(/\u001b\[[0-9;]*m/g,'');
};
const names=['clinical-full-final','domain-focused-final-current','lint-tests','typecheck-final',
  'domain-inventory','domain-inventory-final','clinical-full-integrated','clinical-round2-final',
  'domain-focused-integrated','typecheck-integrated','domain-full','player-full'];
for(const name of ['domain-full','player-full'])assert.ok(fs.existsSync(dir+'/'+name+'.exit.txt'),name+' still running; no handoff yet.');
const priorNativeExits={'clinical-full-final':0,'domain-focused-final-current':0,'lint-tests':0,'typecheck-final':0};
function failures(text){
  const lines=text.split(/\r?\n/),result=[];
  for(let i=0;i<lines.length;i++)if(/^ FAIL\s/.test(lines[i])){
    let header=lines[i].trim(),j=i+1;
    while(j<lines.length&&lines[j].trim()&&!/^(?: FAIL|AssertionError:|Error:|TypeError:|SyntaxError:| \u276f|[+\-]|\u23af)/.test(lines[j]))header+=' '+lines[j++].trim();
    const file=header.match(/^FAIL\s+([^ ]+\.test\.[a-z]+)/)?.[1]??null;
    let assertionIndex=j;while(assertionIndex<lines.length&&!/^(?:AssertionError:|Error:|TypeError:|SyntaxError:|\u23af)/.test(lines[assertionIndex]))assertionIndex++;
    let end=assertionIndex+1;while(end<lines.length&&!/^(?: \u276f|\u23af| FAIL)/.test(lines[end]))end++;
    result.push({file,header,assertionExcerpt:lines.slice(assertionIndex,end).join('\n').slice(0,2600)});
  }
  return result;
}
const results=names.filter(name=>fs.existsSync(dir+'/'+name+'.log')).map(name=>{
 const text=readLog(name),exitPath=dir+'/'+name+'.exit.txt';
 const nativeExit=fs.existsSync(exitPath)?Number(fs.readFileSync(exitPath,'utf8')):priorNativeExits[name]??null;
 return{name,command:text.match(/^> (?:vitest run|node --test|npm run typecheck)[^\r\n]*/m)?.[0]?.slice(2)??null,
   nativeExit,nativeExitFile:fs.existsSync(exitPath)?exitPath:null,
   exitEvidence:fs.existsSync(exitPath)?'Wrapper writes actual LASTEXITCODE; native completion read where applicable.':Object.hasOwn(priorNativeExits,name)?'Actual native completion observed earlier in this same task; green summary retained in this log.':'See native run receipts.',
   files:text.match(/^\s*Test Files\s+([^\r\n]+)/m)?.[1]??null,
   tests:text.match(/^\s*Tests\s+([^\r\n]+)/m)?.[1]??null,
   start:text.match(/^\s*Start at\s+([^\r\n]+)/m)?.[1]??null,
   duration:text.match(/^\s*Duration\s+([^\r\n]+)/m)?.[1]??null,
   typecheckWorkspaces:[...text.matchAll(/^> (@gamify-surgery\/[^ ]+)@[^ ]+ typecheck/gm)].map(m=>m[1]),
   lintTests:name==='lint-tests'?{tests:33,passed:33,failed:0,durationMs:1643.7643}:null,
   failures:failures(text),logPath:dir+'/'+name+'.log',logSha256:hash(fs.readFileSync(dir+'/'+name+'.log'))};
});
const domain=results.find(r=>r.name==='domain-full');
assert.equal(domain.failures.length,49,'Full domain failure indexing must be complete.');
const grouped=domain.failures.reduce((o,f)=>{o[f.file]??=[];o[f.file].push(f);return o;},{});
const packetPath='docs/research/question-new-n1-round2-20261104.json';
const packet=JSON.parse(fs.readFileSync(packetPath,'utf8'));
const sourcePath='docs/research/sources-question-new-n1-round2-20261104.json';
const selfPath='docs/research/question-new-n1-round2-self-check-20261104.json';
const audit=JSON.parse(fs.readFileSync(dir+'/scope-audit.json','utf8'));
const ownRuntime=JSON.parse(fs.readFileSync(dir+'/owned-runtime-inputs.json','utf8'));
assert.ok(ownRuntime.files.every(f=>f.unchangedSinceSnapshot&&hash(fs.readFileSync(f.path))===f.sha256),'Own runtime changed after validation snapshot.');
const result={generatedAt:new Date().toISOString(),scope:'38 returned N1 revisions only; two exact PASS and all 20 captured N2 files frozen.',
  reviewStatus:'needs_clinician_review',independentReview:'pending',clinicalApproval:false,pipelinePassed:false,
  packet:{path:packetPath,sha256:hash(fs.readFileSync(packetPath)),items:40,revised:38,frozenPASS:2,manualSelfChecks:38,notesRetained:290,
    predictedDifficulty:packet.authorSelfCheckSummary},
  artifacts:[packetPath,selfPath,sourcePath].map(path=>({path,sha256:hash(fs.readFileSync(path))})),
  lint:{revisedFindings:0,revisedVariants:38,revisedProfileContexts:76,wholePacketFindings:1,retainedFrozenAdvisory:'question.n1.aldosterone-overt-phenotype.v1 key-only-word-overlap; no exception/suppression/overwrite.'},
  sourceLimits:{claims:97,sources:74,publicationKeys:73,singlePublicationClaims:37,newSyntheses:5,noNewRetrieval:true,namedDrugExactSupportHolds:['methimazole','propranolol','enoxaparin']},
  protectedVersions:{N1:audit.frozenN1,N2:audit.frozenN2,PASS:audit.frozenPASS},
  sourceInputs:{ownRuntime,fullSnapshotAt:audit.fullRunInputSnapshotAt,changedSinceSnapshot:audit.changedFullRunInputs,addedSinceSnapshot:audit.addedFullRunInputs,observedUnownedChangesSinceIntake:audit.observedUnownedChanges},
  domainFailureClassification:[
    {count:26,files:['tests/level-five-integration.test.ts'],status:'Unbound raw inputs plus legacy loaded-state digests; changed catalog adds histories including this lane. Not waived. Manager frozen integration/rebind required.'},
    {count:1,files:['tests/question-new-n1-round2-admission.test.ts'],status:'Own fixture assumed no later cohort; repaired to mark all non-N1 identities future-due. Latest focused run passes all85 N1 round-two checks.'},
    {count:22,files:Object.keys(grouped).filter(p=>!['tests/level-five-integration.test.ts','tests/question-new-n1-round2-admission.test.ts'].includes(p)),status:'Shared older content/flow/count/order/supply assertions. Full per-test headers/assertions retained; not corrected in this lane or claimed solely caused by one cohort. Manager/assigned worker owns resolution.'}
  ],
  latestClinicalFullDisposition:'923pass/3fail after concurrent batch2b. Own assembly-scope assertion repaired and final41check rerun passes; two unowned failures are timing-row inventory +40 and nine uniquely longest keys from other cohort.',
  latestFocusedDisposition:'285pass/1fail; all85 new N1,87 original N1,85 frozen N2 pass. Sole failure is seven concurrent unapproved concept IDs absent from prototype allowlist.',
  results,levelFive:{changedExisting:audit.existingLevelFiveBoundInputsChanged,newRuntime:audit.newRuntimeLevelFiveDependencies,newDisplay:audit.newDisplayDependencies,evidenceWritten:false,rebound:false},
  restrictions:'No Git, installs, network, agents, browser, reducer/player runtime-code/cloud/Supabase edits, other question rewrites, external messages, release/deploy or opening-pathway change.'};
fs.writeFileSync(dir+'/validation.json',JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(dir+'/domain-failure-index.json',JSON.stringify(grouped,null,2)+'\n');
console.log(JSON.stringify({packet:result.packet,results:results.map(({name,nativeExit,files,tests,duration})=>({name,nativeExit,files,tests,duration})),domainFailureGroups:result.domainFailureClassification.map(c=>({count:c.count,status:c.status})),playerFailures:results.find(r=>r.name==='player-full').failures},null,2));
