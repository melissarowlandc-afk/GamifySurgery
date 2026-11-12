import '../economy-audit/source-loader.mjs';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-new-n1-round2-20261104';
const baseline=JSON.parse(fs.readFileSync(`${dir}/baseline.json`,'utf8'));
const content=await import('../../packages/clinical-content/src/index.ts');
const batch=await import('../../packages/clinical-content/src/question-new-n1-round2-20261104.ts');
const old=await import('../../packages/clinical-content/src/question-new-n1-20261104.ts');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const paths=root=>fs.readdirSync(root,{withFileTypes:true}).flatMap(e=>e.isDirectory()?paths(`${root}/${e.name}`):[`${root}/${e.name}`]);
const watched=()=>['packages/clinical-content/src','packages/game-domain/src','packages/game-domain/tests','apps/player/src','packages/balance-config/src','tests/fixtures','tools/question-quality']
  .flatMap(paths).filter(p=>/\.(?:ts|tsx|mjs|json)$/.test(p));
const own=[...paths('packages/clinical-content/src').filter(p=>p.includes('/question-new-n1-round2-')),
  ...paths('tools/question-new-n1-round2'),
  'packages/game-domain/src/question-new-n1-round2-test-orders.ts','packages/game-domain/tests/question-new-n1-round2-admission.test.ts',
  'packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
  'packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts',
  'packages/game-domain/tests/question-new-n1-admission.test.ts','packages/game-domain/tests/approved-clinical-admission.test.ts',
  'packages/clinical-content/src/answer-choice-timing.test.ts',
  'packages/game-domain/tests/patient-supply.test.ts','packages/game-domain/tests/test-choice-order-inventory.test.ts',
  'docs/clinical/question-authoring-standard.md',
  'docs/execplans/question-new-n1-round2-20261104.md','docs/research/question-new-n1-round2-20261104.json',
  'docs/research/question-new-n1-round2-self-check-20261104.json','docs/research/sources-question-new-n1-round2-20261104.json',
  'docs/research/question-new-n1-round2-20261104.md','docs/handoffs/CURRENT_THREAD_HANDOFF.md',
  ...['groin','meckel','thorax'].map(slug=>`apps/player/public/clinical-exhibits/question-new-n1-r2-${slug}.png`),
].filter(p=>fs.existsSync(p));
const frozen=set=>Object.entries(set).map(([path,sha256])=>({path,sha256,unchanged:hash(fs.readFileSync(path))===sha256}));
const N1=frozen(baseline.N1Files),N2=frozen(baseline.N2Files);
assert.ok(N1.every(r=>r.unchanged),'Original N1 definitions/packet changed; stop without reverting shared work.');
assert.ok(N2.every(r=>r.unchanged),'N2 changed; stop without reverting shared work.');
const passes=baseline.frozenPasses.map(p=>{
  const index=old.QUESTION_NEW_N1_CASES.findIndex(c=>c.id===p.caseId);
  const current=batch.QUESTION_NEW_N1_ROUND2_CASES[index];
  const caseUnchanged=hash(JSON.stringify(current))===p.caseSha256;
  const questionUnchanged=hash(JSON.stringify(batch.QUESTION_NEW_N1_ROUND2_QUESTIONS[index]))===p.questionSha256;
  assert.ok(caseUnchanged&&questionUnchanged);return{reviewId:p.reviewId,caseId:p.caseId,caseUnchanged,questionUnchanged,caseSha256:p.caseSha256};
});
const normalize=s=>s.replaceAll('\r\n','\n').trim();
const registry=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
  'packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'].map(path=>{
  const before=fs.readFileSync(`${dir}/registry-before/${path.split('/').at(-1)}`,'utf8');
  const current=fs.readFileSync(path,'utf8').replaceAll('\r\n','\n');
  let restored=current.replace(/^[ \t]*\/\/ BEGIN N1 ROUND2 append[^\n]*\n[\s\S]*?^[ \t]*\/\/ END N1 ROUND2 append[^\n]*(?:\n|$)/gm,'')
    .replace('export const QUESTION_NEW_N1_ROUND2_PRE_TIMING_ENTRIES =','export const ANSWER_CHOICE_TIMING_REGISTRY =');
  // Another worker introduced a stable named batch-2a view while retaining this lane's alias.
  if(path.endsWith('synthetic-content.ts'))restored=restored
    .replace('export const QUESTION_BANK_BATCH2A_ROUND2_RELEASE =','export const SYNTHETIC_CLINICAL_RELEASE =')
    .replace(/^\/\/ Stable historical view for this batch's preservation and frozen-order tests\.\nexport const QUESTION_NEW_N1_ROUND2_PRE_RELEASE = QUESTION_BANK_BATCH2A_ROUND2_RELEASE;\n/m,'');
  // Comparison only: a concurrent worker has appended the separately named batch 2b.
  // Keep the literal pre/post comparison above; report this second comparison explicitly.
  let withoutNamedPeer=restored;
  const peerAppends=[];
  if(withoutNamedPeer.includes('BATCH2B')||withoutNamedPeer.includes('question-bank-batch2b-')){
    peerAppends.push('Concurrent batch 2b: named projection, timing, import/export and record append. No peer source edited.');
    withoutNamedPeer=withoutNamedPeer
      .replace(/^\/\/ BEGIN BATCH2B (?:projection|timing|exact orders)[^\n]*\n[\s\S]*?^\/\/ END BATCH2B[^\n]*(?:\n|$)/gm,'')
      .replace(/^export \* from "\.\/question-bank-batch2b-20261104";\n/gm,'')
      .replace(/^  \.\.\.QUESTION_BANK_BATCH2B_TEST_ORDER_RECORDS,\n/gm,'');
  }
  const beforeLines=normalize(before).split('\n').filter(l=>l.trim());
  const peerRemovedLines=normalize(withoutNamedPeer).split('\n').filter(l=>l.trim());
  const remainingLineChanges=beforeLines.length===peerRemovedLines.length?beforeLines.flatMap((line,i)=>line===peerRemovedLines[i]?[]:[{nonblankLine:i+1,before:line,current:peerRemovedLines[i]}]):null;
  return{path,remainingLineChangesAfterRemovingAppends:remainingLineChanges,
    priorBodyRetainedAfterRemovingOwnAppend:normalize(restored)===normalize(before),
    observedNamedPeerAppends:peerAppends,
    priorBodyRetainedAfterRemovingOwnAndNamedPeerAppends:normalize(withoutNamedPeer).replace(/\n{3,}/g,'\n\n')===normalize(before).replace(/\n{3,}/g,'\n\n'),
    priorBodyRetainedIgnoringRepeatedBlankLines:normalize(restored).replace(/\n{3,}/g,'\n\n')===normalize(before).replace(/\n{3,}/g,'\n\n'),
    normalization:'CRLF/LF and outer whitespace; named concurrent stable-view declaration/alias explicitly restored in the comparison only.',
    beforeSha256:hash(normalize(before)),restoredSha256:hash(normalize(restored))};
});
const before=content.QUESTION_NEW_N1_ROUND2_PRE_RELEASE,after=content.SYNTHETIC_CLINICAL_RELEASE;
const isolatedRoundTwo={...before,concepts:[...before.concepts,...batch.QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS],
  cases:batch.applyQuestionNewN1Round2Revisions(before.cases)};
const count=r=>({registered:r.concepts.length,cases:r.cases.length,nodes:r.cases.flatMap(c=>c.decisionNodes).length,
  activePatientConcepts:new Set(r.cases.filter(c=>c.routineEligible&&!c.participant).flatMap(c=>c.decisionNodes.map(n=>n.primaryConceptId))).size});
const sources=batch.QUESTION_NEW_N1_ROUND2_SOURCES;
const pub=s=>s.doi?`doi:${s.doi.toLowerCase()}`:`url:${s.officialUrl?.split(/[?#]/)[0]??s.id}`;
const sensitive=own.flatMap(path=>{
  if(path.endsWith('.png'))return[];const data=fs.readFileSync(path,'utf8');
  return[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\b(?:sk-proj-|sk-live-|ghp_|github_pat_)[A-Za-z0-9_-]{20,}/,
    /\beyJ[A-Za-z0-9_-]{25,}\.[A-Za-z0-9_-]{25,}\.[A-Za-z0-9_-]{20,}/].filter(r=>r.test(data)).map(rule=>({path,rule:String(rule)}));
});
const bound=JSON.parse(fs.readFileSync('tools/qa/level-five-integration-results-20261012.json','utf8')).inputs;
const existingBound=['packages/clinical-content/src/index.ts','packages/clinical-content/src/synthetic-content.ts',
  'packages/clinical-content/src/answer-choice-timing.ts','packages/game-domain/src/test-choice-orders.ts'];
const runtime=own.filter(p=>(p.startsWith('packages/clinical-content/src/question-new-n1-round2-')&&!p.endsWith('.test.ts'))||p==='packages/game-domain/src/question-new-n1-round2-test-orders.ts');
const timed=batch.QUESTION_NEW_N1_ROUND2_TIMING_ENTRIES.flatMap(t=>t.classification.kind==='test_choices'?t.classification.choices.filter(c=>c.timing.kind==='test'):[]).length;
const timingCount=(entries,cases)=>{
  let offered=0,keyed=0;
  for(const e of entries)if(e.classification.kind==='test_choices')for(const choice of e.classification.choices)if(choice.timing.kind==='test'){
    offered++;
    if(cases.find(c=>c.id===e.caseId)?.decisionNodes.find(n=>n.id===e.nodeId)?.answerChoices.find(c=>c.id===choice.choiceId)?.isCorrect)keyed++;
  }
  return{offered,keyed};
};
const replacedIds=new Set(batch.QUESTION_NEW_N1_ROUND2_REVISED_CASES.map(c=>c.id));
const replacedTiming=timingCount(old.QUESTION_NEW_N1_TIMING_ENTRIES.filter(t=>replacedIds.has(t.caseId)),old.QUESTION_NEW_N1_CASES);
const revisedTiming=timingCount(batch.QUESTION_NEW_N1_ROUND2_TIMING_ENTRIES,batch.QUESTION_NEW_N1_ROUND2_CASES);
const result={checkedAt:new Date().toISOString(),method:'Filesystem hashes; no Git, installs or network.',
  frozenN1:N1,frozenN2:N2,frozenPASS:passes,registry,sensitiveFindings:sensitive,
  beforeCounts:count(before),isolatedRoundTwoCounts:count(isolatedRoundTwo),afterCounts:count(after),preReleaseMatchesIntake:hash(JSON.stringify(before))===baseline.releaseSha256,
  exactReleaseSha256:hash(JSON.stringify(after)),revisedCases:38,preservedConceptMeanings:32,newConstructVersions:6,
  claims:batch.QUESTION_NEW_N1_ROUND2_CLAIMS.length,sources:sources.length,publicationKeys:new Set(sources.map(pub)).size,
  claimsWithOnePublication:batch.QUESTION_NEW_N1_ROUND2_CLAIM_PROVENANCE.filter(p=>p.sourcePublicationKeys.length===1).length,
  newSyntheses:batch.QUESTION_NEW_N1_ROUND2_CLAIM_PROVENANCE.filter(p=>!p.statementUnchanged).length,timedChoices:timed,
  exhibits:batch.QUESTION_NEW_N1_ROUND2_REVISED_CASES.filter(c=>c.decisionNodes[0].exhibit).length,
  newImages:3,
  replacedTiming,revisedTiming,timingDelta:{offered:revisedTiming.offered-replacedTiming.offered,keyed:revisedTiming.keyed-replacedTiming.keyed},
  files:own.map(path=>({path,sha256:hash(fs.readFileSync(path)),bytes:fs.statSync(path).size})),
  observedUnownedChanges:Object.entries(baseline.files).filter(([p,sha])=>!own.includes(p)&&fs.existsSync(p)&&hash(fs.readFileSync(p))!==sha).map(([p])=>p),
  existingLevelFiveBoundInputsChanged:existingBound.filter(p=>Object.hasOwn(bound,p)),newRuntimeLevelFiveDependencies:runtime,
  newDisplayDependencies:own.filter(p=>p.endsWith('.png')),
  policy:'No N2 edit or rubric review, original N1/PASS overwrite, reducer/player/cloud/Supabase edit, Level 5 evidence/pin/checkpoint write/rebind, Git, install, network, release or pathway change.',
};
const finalSnapshot=`${dir}/inputs-before-full-final.json`;
const fullSnapshot=process.argv.includes('--freeze-full-final')||fs.existsSync(finalSnapshot)?finalSnapshot:`${dir}/inputs-before-full.json`;
if(process.argv.includes('--freeze-full')||process.argv.includes('--freeze-full-final')){
  assert.ok(!fs.existsSync(fullSnapshot),'Preserve the original broad-run snapshot.');
  fs.writeFileSync(fullSnapshot,JSON.stringify({capturedAt:new Date().toISOString(),files:Object.fromEntries(watched().map(p=>[p,hash(fs.readFileSync(p))]))},null,2)+'\n');
}
if(fs.existsSync(fullSnapshot)){
  const snap=JSON.parse(fs.readFileSync(fullSnapshot,'utf8'));
  result.fullRunInputSnapshotAt=snap.capturedAt;
  result.changedFullRunInputs=Object.entries(snap.files).filter(([p,sha])=>!fs.existsSync(p)||hash(fs.readFileSync(p))!==sha).map(([p])=>p);
  result.addedFullRunInputs=watched().filter(p=>!Object.hasOwn(snap.files,p));
}
fs.writeFileSync(`${dir}/scope-audit.json`,JSON.stringify(result,null,2)+'\n');
fs.writeFileSync(`${dir}/scoped-files.json`,JSON.stringify(own,null,2)+'\n');
console.log(JSON.stringify({ownedFiles:own.length,N1Frozen:N1.every(r=>r.unchanged),N2Frozen:N2.every(r=>r.unchanged),frozenPASS:passes,
  registry,before:result.beforeCounts,after:result.afterCounts,claims:result.claims,sources:result.sources,publicationKeys:result.publicationKeys,
  timedChoices:timed,sensitiveFindings:sensitive,changedFullRunInputs:result.changedFullRunInputs},null,2));
