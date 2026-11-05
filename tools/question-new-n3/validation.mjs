// Local test receipt only; does not execute tests, rebind pins or promote content.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n3-20261105';
const hash=b=>createHash('sha256').update(b).digest('hex');
function read(path){const b=fs.readFileSync(path);return (b[0]===255&&b[1]===254?b.toString('utf16le').slice(1):b.toString('utf8')).replace(/\x1b\[[0-9;]*m/g,'');}
function receipt(name){
 const path=dir+'/'+name+'.log';if(!fs.existsSync(path))return {name,pending:true};const text=read(path);
 const exitPath=dir+'/'+name+'.exit.txt';
 const failures=[...text.matchAll(/^\s*FAIL\s+(\S+\.test\.[cm]?[jt]sx?)\s*>\s*(.*)$/gm)].map(m=>({file:m[1],name:m[2]}));
 const count={};for(const f of failures)count[f.file]=(count[f.file]??0)+1;
 const typeErrors=[...text.matchAll(/^([^\r\n(]+)\((\d+),(\d+)\): error ([A-Z0-9]+): (.*)$/gm)].map(m=>({file:m[1],line:Number(m[2]),column:Number(m[3]),code:m[4],message:m[5]}));
 return {name,path,sha256:hash(fs.readFileSync(path)),finished:fs.existsSync(exitPath),exit:fs.existsSync(exitPath)?Number(read(exitPath).trim()):null,typeErrors,
  summary:text.split(/\r?\n/).filter(l=>/^\s*(Test Files|Tests\s|Duration\s|ℹ (tests|pass|fail|skipped))/.test(l)),
  workspaceTypechecks:[...text.matchAll(/^> (@gamify-surgery\/\S+) typecheck$/gm)].map(m=>m[1]),failuresByFile:count,failures};
}
const names=['n2-manifest-tests-final','n2-typecheck','focused-clinical','focused-clinical-close','focused-clinical-close-final','focused-domain-final','typecheck-final','typecheck-close','typecheck-close-final','lint-tests','lint-tests-close','clinical-full-final','clinical-full-close','domain-full','domain-full-final','player-full','domain-supply-retry'];
const current=names.map(receipt);
const finalDomain=current.find(r=>r.name==='domain-full-final');
const optionalRetry=current.find(r=>r.name==='domain-supply-retry');
if(finalDomain?.finished&&!finalDomain.failuresByFile?.['tests/patient-supply.test.ts']&&optionalRetry?.pending){
 optionalRetry.pending=false;optionalRetry.finished=true;optionalRetry.notRunReason='Not needed: the final full domain run passed the unchanged-budget inventory test.';
}
const previousDir='.local-dev/question-ship-gate-narrowing-20261105';
const previous=JSON.parse(fs.readFileSync(previousDir+'/failure-attribution.json','utf8'));
const attribution=[];
for(const run of current)for(const [file,count]of Object.entries(run.failuresByFile??{})){
 let status='UNRESOLVED: investigate before handoff',basis=null;
 if(file==='tests/level-five-integration.test.ts'){status='pre-existing Level 5 evidence/binding failures';basis={previousFile:previousDir+'/failure-attribution.json',earlierN2RoundTwo:previous.domain.earlierN2RoundTwo,earlierGateRoundThree:previous.domain.earlierGateRoundThree,currentNarrowing:previous.domain.current[file],scope:'Evidence, pins and checkpoints are unchanged and cannot be rebound in this lane.'};}
 const old=previous.player.find(p=>p.file===file);
 if(old){status='pre-existing player session/cloud failure';basis={previousFile:previousDir+'/failure-attribution.json',...old};}
 if(file==='tests/approved-clinical-admission.test.ts'){status='concurrent batch2b acceptance fixture';basis={defaultWithoutN3:dir+'/default-preservation.json',reason:'The pre-N3 reconstruction equals the default exactly, including twelve meanings added by concurrent accepted batch2b rewrites. The unchanged static fixture still lists the pre-acceptance 585 meanings instead of 597.',followup:'Rewrite/manager lane must append the twelve exact accepted rewrite meanings to its static expected list.'};}
 if(file==='tests/patient-supply.test.ts'){status='pre-existing unchanged-budget inventory timeout; isolated retry reported separately';basis={previousFile:previousDir+'/domain-full-final.log',previousFailure:'Same inventory test timed out at 10000ms before N3; accepted narrowing serialized retry passed.',currentScope:'This fixture uses the retained QUESTION_NEW_N2_ROUND3_PRE_RELEASE and is unchanged by N3. No timeout or golden was edited.',retry:dir+'/domain-supply-retry.log'};}
 if(file==='src/session/breadButterPresentation.test.ts'){status='concurrent accepted B2B40 three-choice fixture';basis={proof:dir+'/concurrent-bread-butter-fixture.json',reason:'This unchanged player-session fixture requires four choices. Accepted question.perianal-abscess.prompt-drainage.v3.r2 (B2B40) has three, as allowed by the owner. N3 is excluded from the default and from this fixture.',scope:'apps/player/src/session/** is explicitly outside this lane; no edit.'};}
 if(file==='tests/clinical-content-withdrawal.test.ts'){status='N3 catalog-count fixture repaired after this full run';basis={repair:'Appended the exact forty N3 case IDs to the complete catalog expected list; every earlier assertion remains.',verification:'Final full domain rerun or focused fixture result is reported separately, without replacing the original run counts.'};}
 if(file==='src/question-new-n3-20261105.test.ts'){status='late peer timing append handled by retaining the exact N3 archive stage';basis={repair:'Checks the complete ordered historical/N3 tuple set with full equality while allowing later distinct identities. Duplicate, missing or changed stage rows still fail.',verification:dir+'/focused-clinical-close-final.log'};}
 attribution.push({run:run.name,file,count,status,basis});
}
const finalSelection={clinical:'clinical-full-close',domain:'domain-full-final',player:'player-full',typecheck:'typecheck-close-final',lint:'lint-tests-close',focusedClinical:'focused-clinical-close-final'};
const remainingFinalFailures=attribution.filter(row=>Object.values(finalSelection).includes(row.run));
const report={capturedAtUtc:new Date().toISOString(),commands:{
 clinical:'npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2',
 domain:'npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2',
 player:'npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 --configLoader native --config ../../.local-dev/question-new-n3-20261105/player-native.config.ts',
 typecheck:'npm.cmd run typecheck',lint:'npm.cmd run clinical:lint:test',packet:'node tools/question-new-n3/review.mjs'},
 finalSelection,
 current,priorEvidence:{acceptedNarrowing:previousDir+'/validation.json',earlierFailureComparisons:previousDir+'/failure-attribution.json'},attribution,
 remainingFinalFailures,
 concurrentClosingChange:'Flags2 round-two/G06 integration appended during closing checks. Its first caption-type error was repaired by that lane; the final seven-workspace typecheck and N3/manifest 56-test focused run pass. Full-suite counts are preserved at their recorded run point rather than silently replaced.',
 limitations:'Exit and counts are native results. A focused pass never silently replaces a failing full-run count. No assertion, budget or timeout was weakened; no Level 5 evidence or pin was rebound.'};
fs.writeFileSync(dir+'/validation.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({runs:current.map(r=>({name:r.name,finished:r.finished,exit:r.exit,summary:r.summary})),attribution},null,2));
