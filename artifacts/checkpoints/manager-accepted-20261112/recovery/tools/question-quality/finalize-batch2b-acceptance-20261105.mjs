import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const before=read('tools/question-quality/fixtures/batch2b-acceptance-before-20261105.json');
const changes=read('tools/question-quality/batch2b-acceptance-changes-20261105.json');
const controls=read('tools/question-quality/batch2b-acceptance-controls-20261105.json');
const log=(suffix)=>'tools/question-quality/batch2b-acceptance-'+suffix+'-20261105.log';
const decode=p=>{const b=fs.readFileSync(p);return b.toString(b[0]===255&&b[1]===254?'utf16le':'utf8').replaceAll('\uFEFF','').replace(/\x1b\[[0-9;]*m/g,'');};
function suite(name,suffix,nativeExitCode,command){
 const path=log(suffix),text=decode(path);
 const tally=label=>{
  const line=text.match(new RegExp('^\\s*'+label+'\\s+([^\\r\\n]+)$','m'))?.[1];
  assert(line,name+' has no completed '+label+' summary');
  const counts={passed:0,failed:0,skipped:0};
  for(const m of line.matchAll(/(\d+)\s+(passed|failed|skipped)/g))counts[m[2]]=Number(m[1]);
  return {...counts,total:counts.passed+counts.failed+counts.skipped};
 };
 const tests=tally('Tests'),files=tally('Test Files');
 assert.equal(nativeExitCode,tests.failed?1:0,'Observed native exit must agree with final summary');
 return {name,command,log:path,nativeExitCode,tests,files,startAtLocal:text.match(/Start at\s+([^\r\n]+)/)?.[1],durationSeconds:Number(text.match(/Duration\s+([\d.]+)s/)?.[1]),failures:[...text.matchAll(/^\s*FAIL\s+([^\r\n]+)/gm)].map(m=>m[1])};
}
const clinicalCommand='npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2';
const focusedFiles='src/question-ship-manifest.test.ts src/question-bank-batch2b-20261104.test.ts src/question-bank-batch2b-round2-20261104.test.ts src/question-bank-batch2b-acceptance-20261105.test.ts';
const domainCommand='npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/question-bank-batch2b-bindings.test.ts tests/question-bank-batch2b-round2-bindings.test.ts';
const firstFullText=decode(log('clinical-full'));
const finalFullText=decode(log('clinical-full-final'));
const firstFull=suite('initial full clinical','clinical-full',1,clinicalCommand);
const focused=suite('final focused manifest/2b/narrative','focused-final',0,clinicalCommand+' '+focusedFiles+' src/playable-patient-narrative.test.ts');
const bindings=suite('focused exact 2b domain bindings','bindings',0,domainCommand);
const full=suite('final full clinical','clinical-full-final',/Tests\s+\d+ failed/.test(finalFullText)?1:0,clinicalCommand);
const typecheckPath=log('typecheck-final'),typecheckText=decode(typecheckPath);
assert(typecheckText.includes('tsc --noEmit -p tsconfig.json')&&!/error TS\d|npm error/.test(typecheckText));
assert(firstFullText.includes('src/playable-patient-narrative.test.ts'));
assert(full.failures.every(line=>line.includes('src/answer-choice-timing.test.ts')),'Investigate any final failure beyond the known concurrent N3 archive count');
const ownExistingPaths=[
 'packages/clinical-content/src/question-ship-manifest.ts',
 'packages/clinical-content/src/question-ship-manifest.test.ts',
 'packages/clinical-content/src/playable-patient-narrative.test.ts',
 'tools/question-quality/fixtures/question-bank-batch2b-before-20261104.json',
 'tools/question-quality/fixtures/question-bank-batch2b-round2-before-20261104.json',
];
const ownNewPaths=[
 'packages/clinical-content/src/question-bank-batch2b-acceptance-20261105.test.ts',
 'docs/execplans/question-bank-batch2b-acceptance-20261105.md',
 'docs/research/question-bank-batch2b-manager-decision-20261105.md',
 'docs/research/question-bank-batch2b-composed-preview-20261105.json',
 'tools/question-quality/capture-batch2b-acceptance-20261105.mjs',
 'tools/question-quality/integrate-batch2b-acceptance-20261105.mjs',
 'tools/question-quality/review-batch2b-acceptance-20261105.mjs',
 'tools/question-quality/finalize-batch2b-acceptance-20261105.mjs',
 'tools/question-quality/fixtures/batch2b-acceptance-before-20261105.json',
 'tools/question-quality/batch2b-acceptance-changes-20261105.json',
 'tools/question-quality/batch2b-acceptance-controls-20261105.json',
 'tools/question-quality/batch2b-acceptance-scope-20261105.json',
 'tools/question-quality/batch2b-acceptance-validation-20261105.json',
 ...['focused','typecheck','clinical-full','focused-final','typecheck-final','bindings','clinical-full-final'].map(log),
];
const ownSet=new Set(ownExistingPaths),observedOtherChanges=[];
for(const[path,initial]of Object.entries(before.files)){
 if(ownSet.has(path))continue;
 if(!fs.existsSync(path)){observedOtherChanges.push({path,before:initial,current:null});continue;}
 const current=hash(path);
 if(initial!==current)observedOtherChanges.push({path,before:initial,current});
}
const narrativePath='packages/clinical-content/src/playable-patient-narrative.test.ts';
const narrative=fs.readFileSync(narrativePath,'utf8');
const restored=narrative.replace('is seen|is reviewed|is offered','is seen|is offered');
assert.equal(crypto.createHash('sha256').update(restored).digest('hex'),before.files[narrativePath],'Narrative repair must only add the exact passive verb phrase');
assert.equal(hash('packages/clinical-content/src/question-ship-manifest.ts'),controls.changedLevel5BoundInputs[0].current,'Manifest changed after composed controls; regenerate controls first');
const scope={checkedAt:new Date().toISOString(),ownExistingPaths,ownNewPaths,currentThreadHandoff:'docs/handoffs/CURRENT_THREAD_HANDOFF.md',observedConcurrentChanges:observedOtherChanges,
 caveat:'Observed changes in other lanes are recorded, not attributed to or edited by this worker. New concurrent files absent from intake are not enumerated by this hash comparison.',
 narrativeTestRepair:{path:narrativePath,onlyChange:'Add the exact passive phrase is reviewed to STORY_CUE; patient/multi-patient/complete-task assertions and budgets unchanged.',before:before.files[narrativePath],current:hash(narrativePath)},
 changedLevel5BoundInputs:controls.changedLevel5BoundInputs,
 manifestOtherBytesPreservedAtInsertion:true,manifestOtherBytesStillExact:controls.nonOwnedManifest.currentWithoutOwnBlocksMatchesInsertionBefore,
 flags2Frozen:controls.flags2Frozen,digestKeysReconciled:3,digestCaptureFiles:2,noClinicalDefinitionChange:true,noEvidenceWriteOrRebind:true,
};
fs.writeFileSync('tools/question-quality/batch2b-acceptance-scope-20261105.json',JSON.stringify(scope,null,2)+'\n');
const validation={checkedAt:new Date().toISOString(),acceptedIds:changes.acceptedIds,sourceHeldPassIds:changes.heldIds,parkedReviseIds:changes.parkedReviseIds,
 finalFocused:focused,focusedDomainBindings:bindings,fullClinical:full,initialFullClinical:firstFull,
 typecheck:{command:'npm.cmd run typecheck --workspace @gamify-surgery/clinical-content',log:typecheckPath,nativeExitCode:0},
 digestReconciliation:{scalarKeys:3,captureFiles:2,proof:'Focused original/round-two guards pass; new acceptance test reverses only the three replacements and recovers both original capture hashes.'},
 composedPreview:{affectedCases:16,nodes:17,mixedCases:controls.mixedCases,manifestDiagnostics:[],controls:'tools/question-quality/batch2b-acceptance-controls-20261105.json'},
 remainingFailure:full.tests.failed?'The shared timing test still expects 2130 archived rows after 40 question.n3.* rows were appended by the concurrent content lane (2170 actual). No live 2b timing tuple is missing or mismatched. Leave N3 timing/count integration to its owner; no count assertion changed here.':null,
 runtimeManifestHash:hash('packages/clinical-content/src/question-ship-manifest.ts'),
 validationWindowCaveat:'The working tree is shared and was not frozen: new N3 timing rows appeared during this milestone. Native results describe the actual recorded runs, not a release-tree certification.',
};
fs.writeFileSync('tools/question-quality/batch2b-acceptance-validation-20261105.json',JSON.stringify(validation,null,2)+'\n');
const filesTable=[...ownExistingPaths,...ownNewPaths,'docs/handoffs/CURRENT_THREAD_HANDOFF.md'].map(path=>'- '+path).join('\n');
const status=full.tests.failed?'The full shared-tree suite is **not green**.':'The full clinical-content suite passes.';
const appendix=`
## Final validation and scoped handoff

${status} Every scoped acceptance/digest/composed control passes. Exact native
results (all Vitest commands use --pool=threads --maxWorkers=2):

| Check | Test files | Tests | Native exit |
|---|---|---|---|
| Final focused manifest, original 2b, round-two 2b, acceptance and narrative | ${focused.files.passed}/${focused.files.total} passed | ${focused.tests.passed}/${focused.tests.total} passed | 0 |
| Both exact 2b domain binding files | ${bindings.files.passed}/${bindings.files.total} passed | ${bindings.tests.passed}/${bindings.tests.total} passed | 0 |
| Clinical-content typecheck | n/a | passed | 0 |
| Final full clinical-content | ${full.files.passed} passed / ${full.files.failed} failed (${full.files.total}) | ${full.tests.passed} passed / ${full.tests.failed} failed (${full.tests.total}) | ${full.nativeExitCode} |

Initial full run: ${firstFull.tests.passed} passed / ${firstFull.tests.failed} failed (${firstFull.tests.total}) in
${firstFull.files.total} files. One failure was introduced by newly exposing the
accepted B2B01 header's grammatical phrase "is reviewed" to the old finite verb
checker. The repair adds exactly that phrase to STORY_CUE; the reviewed content
and every patient/task/multi-patient assertion remain unchanged. The final
focused narrative test and the final full narrative test pass.

${validation.remainingFailure??'No final full-suite failure remains.'}
The exact original and round-two digest guards now pass. Only three scalar
entries in two captures changed; the reversal test proves every other byte is
retained. There was no assertion removal, timeout extension or fallback-content
rewrite. Focused timing checks pass for each accepted exact question tuple.

Logs and machine receipts are in tools/question-quality under the
batch2b-acceptance-*20261105 names. The validation JSON records exact commands,
file/test counts, durations, native exits and logs; the scope JSON records
concurrent hash changes separately from this worker's file list. The manifest
still has ${controls.managerManifestAcceptances} acceptances, including the existing 14 N2 rows, and
${controls.defaultCases} live cases / ${controls.defaultNodes} live nodes. Its other bytes were retained at
insertion and ${scope.manifestOtherBytesStillExact?'remain byte-exact after stripping this lane\'s two marked blocks':'subsequent concurrent manifest changes are recorded separately'}.
All nine captured flags2 source/test/packet/handoff/ledger/fixture files retain
their hashes. No frozen flags2 review artifact is regenerated or amended.

### Files written in this milestone

${filesTable}

### Level 5 and remaining decisions

The only runtime/Level-5-bound input changed by this lane is
packages/clinical-content/src/question-ship-manifest.ts. Intake SHA-256:
${controls.changedLevel5BoundInputs[0].before}; current SHA-256:
${controls.changedLevel5BoundInputs[0].current}.
The other edits are tests, capture metadata, offline tools and documents.
No Level 5 evidence, pin, checkpoint, save format, frozen encounter, selector,
route, service, timing/order definition, cloud/session, Supabase or deployment
was changed by this worker. Shared-tree changes from other lanes have separate
ownership and are not included in this lane's Level 5 list. The manager owns any
release-tree evidence/input rebind.

Open: source verification for B2B32/F13 before any later acceptance; G03 rewrite
after flags2 review; a separately versioned B2B24 follow-up to remove rehearsal;
the parked 22 REVISE drafts remain backlog with no 2b round three. Melissa
Rowland remains the clinical sign-off and all accepted rewrites remain
needs_clinician_review. Nothing is deployed, published, committed or pushed.
This checkpoint is local only; the manager owns acceptance and the separately
authorized "push to GitHub" backup checkpoint.
`;
const decisionPath='docs/research/question-bank-batch2b-manager-decision-20261105.md';
let decision=fs.readFileSync(decisionPath,'utf8');
decision=decision.split('\n## Final validation and scoped handoff\n')[0];
decision=decision.replace('Acceptance/source/fallback controls pass. Focused manifest/2b tests, typecheck and\nfull clinical-content results are pending in this initial decision record;\nfinal exact results and logs will be added before handoff.',
 'Acceptance/source/fallback controls pass. Final native results, scoped files and\nremaining shared-tree integration are recorded below.');
fs.writeFileSync(decisionPath,decision+appendix);
const threadHandoff='docs/handoffs/CURRENT_THREAD_HANDOFF.md';
const marker='<!-- BEGIN BATCH2B ACCEPTANCE HANDOFF 20261105 -->';
if(!fs.readFileSync(threadHandoff,'utf8').includes(marker)){
 fs.appendFileSync(threadHandoff,`\n\n${marker}
Batch 2b review-two acceptance integration completed 2026-11-05. Authoritative
decision/full handoff: docs/research/question-bank-batch2b-manager-decision-20261105.md.
Composed preview: docs/research/question-bank-batch2b-composed-preview-20261105.json.
Accepted exactly B2B01/B2B02/B2B06/B2B08/B2B09/B2B10/B2B17/B2B21/B2B23/B2B24/
B2B25/B2B30/B2B33/B2B39/B2B40/B2B42, each from batch2b-round2 with an explicit
header pin. The existing fourteen N2 rows and every other manifest byte are
preserved after removing this lane's marked blocks; manifest now 61 acceptances,
live 1,136 cases / 1,449 nodes. Twelve new accepted meanings are registered through the
existing helper; old concepts, definitions, timing/order histories and saves stay.
All accepted AI versions remain needs_clinician_review; no clinical sign-off is
inferred. Melissa Rowland remains clinical sign-off.

B2B32/F13 are PASS with unresolved holds on the keys, not accepted. The numeric
gap correction/reference and ranked awake arterial-gas investigation lack an
adequate recorded direct verification. Neither can be fixed by deleting an
incidental detail. All 22 REVISE drafts remain backlog with exact live fallbacks;
no round three. G03 CORRECTION supersedes the earlier flags2 handoff's coverage claim:
B2B36 was REVISE, so G03 remains unresolved and goes into flags2 revision after
its independent review. All nine captured flags2 files remain byte-exact.

Exactly three authorized scalar digests in two old 2b captures reconciled; both
original test-source guards now pass. The only extra existing test repair adds
the exact grammatical phrase "is reviewed" to the narrative verb vocabulary;
accepted B2B01 prose and substantive assertions remain unchanged. B2B24 is the
sole mixed case: preserved follow-up/gate exact, clinically coherent but repeats
the conservation decision already established by the accepted first update.
Queue a separate follow-up version rather than altering the legacy node here.

Final focused clinical 91/91 in five files, domain 2b bindings 6/6 in two files and
clinical-content typecheck exit 0. Full clinical 1,170 pass / one fail (1,171) in
114 files (113 pass / one fail), native exit 1. Remaining failure is the concurrently
appended 40 N3 timing rows: shared timing count expects 2,130, actual 2,170. No N3/count
repair in this lane. Initial full was 1,169 pass / two fail; narrative false positive repaired.
Exact commands/logs/counts and concurrent hashes are in
tools/question-quality/batch2b-acceptance-{validation,scope,controls,changes}-20261105.json.

Own runtime/Level 5 bound change only:
packages/clinical-content/src/question-ship-manifest.ts, SHA256
${controls.changedLevel5BoundInputs[0].current}.
Other own files are tests, three-key capture metadata, offline tools and docs;
full file list is in the decision. No evidence/pin/checkpoint rebind, source
rewrite, selector/routing, session/cloud/Supabase, Git, install, network, agents,
external message, deploy or opening-pathway change. Concurrent changes are
preserved and separately recorded. Local only; manager owns source/clinical
resolution, release-tree binding, N3 integration and separately authorized
"push to GitHub" backup. STOP at handoff.
<!-- END BATCH2B ACCEPTANCE HANDOFF 20261105 -->\n`);
}
console.log(JSON.stringify({accepted:16,held:2,parked:22,focused:focused.tests,bindings:bindings.tests,full:full.tests,typecheckExit:0,digestKeys:3,concurrentChangedFiles:observedOtherChanges.length},null,2));
