import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const log=p=>fs.readFileSync(p,'utf8').replace(/^\uFEFF/,'').replace(/\u001b\[[\d;]*m/g,'');
const save=(p,data)=>{if(process.argv.includes('--check'))assert.equal(fs.readFileSync(p,'utf8'),data,p+' stale');else fs.writeFileSync(p,data);};
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const packet=read('docs/research/question-flags2-round3-20261105.json');
const ledger=read('docs/research/sources-question-flags2-round3-20261105.json');
const cues=read('tools/question-quality/question-flags2-round3-lint-20261105.json');
const controls=read('tools/question-quality/question-flags2-round3-controls-20261105.json');
const clinicalPath='tools/question-quality/question-flags2-round3-clinical-final-20261105.log';
const linterPath='tools/question-quality/question-flags2-round3-linter-tests-final-20261105.log';
const typePath='tools/question-quality/question-flags2-round3-typecheck-final-20261105.log';
const clinical=log(clinicalPath),linter=log(linterPath),types=log(typePath);
assert.match(clinical,/Test Files\s+6 passed \(6\)/);assert.match(clinical,/Tests\s+97 passed \(97\)/);
assert.match(linter,/pass 33/);assert.match(linter,/fail 0/);
const diagnostics=[...types.matchAll(/^src\/[^\r\n]*error TS\d+:[^\r\n]*/gm)].map(m=>m[0]);
assert.equal(diagnostics.length,2);
assert(diagnostics.every(d=>d.startsWith('src/question-new-n3-round2-20261105.ts')&&d.includes("Property 'plausibleMisreading'")));
assert.equal(cues.totals.afterFindings,0);
const publications=new Set(ledger.sources.map(s=>(s.doi??s.officialUrl).toLowerCase()));
const validation={checkedOn:'2026-11-05',scope:'Focused validation requested for flags2. No new full clinical/domain/player run, release authorization or whole-tree-green claim.',
 clinical:{command:'npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2 src/question-flags2-20261105.test.ts src/question-flags2-round2-20261105.test.ts src/question-flags2-round3-20261105.test.ts src/question-ship-manifest.test.ts src/answer-choice-timing.test.ts src/question-bank-batch2b-acceptance-20261105.test.ts',
  nativeExitCode:0,testFiles:{passed:6,failed:0,total:6},tests:{passed:97,failed:0,total:97},durationSeconds:Number(clinical.match(/Duration\s+([\d.]+)s/)[1]),log:clinicalPath},
 linter:{command:'npm.cmd run clinical:lint:test',nativeExitCode:0,tests:{passed:33,failed:0,total:33},log:linterPath},
 typecheck:{command:'npm.cmd run typecheck --workspace @gamify-surgery/clinical-content',nativeExitCode:1,diagnostics,diagnosticCount:2,
  flags2Diagnostics:0,owner:'N3 concurrent lane; untouched by this worker',log:typePath},
 generators:{commands:['node tools/question-quality/build-question-flags2-round3-20261105.mjs --check','node tools/question-quality/review-question-flags2-round3-20261105.mjs --check --require-zero','node tools/question-quality/control-question-flags2-round3-20261105.mjs --check'],nativeExitCode:0},
 cueLint:{...cues.totals,report:'tools/question-quality/question-flags2-round3-lint-20261105.json'},
 sourceRecords:ledger.sources.length,publicationIdentityKeys:publications.size,newAtomicClaims:ledger.claims.length,originalBasisClaims:ledger.basisClaims.length,
 noteResponses:cues.noteResponses,returnedNoteResponses:packet.filter(p=>p.id!=='G06').reduce((n,p)=>n+p.reviewResponse.notes.length,0),
 supportedCandidates:packet.filter(p=>p.status==='draft_awaiting_independent_review').map(p=>p.id),parked:packet.filter(p=>p.holdStatus==='parked').map(p=>p.id),
 acceptedInThisRound:[],priorFilesByteFrozen:controls.priorFilesVerified,liveUnchanged:true,earlierTimingsPreserved:true,
 intermediateResults:{clinical:{passed:95,failed:2,total:97,log:'tools/question-quality/question-flags2-round3-clinical-20261105.log',
  explanation:'New broad snapshot guards initially assumed a quiescent shared tree. Concurrent N3 appended exact timing/source hunks. Replaced that assumption with strict before-byte reconstruction of the known hunks and exact preservation of every preceding timing row; original capture and all prior tests are unchanged.'},
  typecheck:'The same two cross-lane N3 TS2339 diagnostics were present initially and at final focused validation; no N3 edit or synthetic fix was made.'},
};
const validationPath='tools/question-quality/question-flags2-round3-validation-20261105.json';
save(validationPath,JSON.stringify(validation,null,2)+'\n');
const planPath='docs/execplans/question-flags2-round3-20261105.md';
const plan=fs.readFileSync(planPath,'utf8').replace('Progress: intake/review inspection complete; implementation and validation pending.',
 'Progress: authoring, source dispositions, packet, cue lint and focused tests complete.\n97/97 focused clinical and 33/33 linter tests pass. Clinical-content typecheck\nreports two untouched N3 TS2339 diagnostics; no flags2 diagnostic. The scoped\nround-three handoff records the exact source window and integration limitation.');
save(planPath,plan);
const handoffPath='docs/research/question-flags2-round3-handoff-20261105.md';
const newRuntime=controls.newTransitiveRuntimeDependencies.map(r=>'- '+r.path+' — '+r.sha256).join('\n');
const exactIndex=controls.existingBoundInputsChanged[0];
const perItem=packet.map(p=>`| ${p.id} | ${p.holdStatus} | ${p.id==='G06'?'Exact accepted PASS preserved':p.after?p.after.variantId:'No new version emitted'} | ${p.ownerNoteResolution.replaceAll('|','/')} |`).join('\n');
const files=new Set(['packages/clinical-content/src/index.ts',validationPath,handoffPath,'tools/question-quality/question-flags2-round3-files-20261105.json']);
for(const dir of ['packages/clinical-content/src','docs/research','docs/execplans','tools/question-quality','tools/question-quality/fixtures']){
 for(const name of fs.readdirSync(dir))if(name.includes('question-flags2-round3')&&fs.statSync(dir+'/'+name).isFile())files.add(dir+'/'+name);
}
const sorted=[...files].sort();
const handoff=`# Flags2 final round handoff — 2026-11-05

Authoring is complete: **two supported proposed replacements (G03, G05), five
parked items, and G06's exact accepted PASS preserved**. No manifest acceptance,
live question, source hold or clinical approval is inferred from a self-check.
All new questions, concepts, presentation revisions and seven atomic claims
remain **needs_clinician_review**. Melissa Rowland remains clinical sign-off.

The [round-three packet](question-flags2-round3-20261105.json) contains before/
after fields, key-first review-only options, rationale pairs, two-step self-checks,
source dispositions, exact live fallbacks and **93 indexed responses** to review
two: **83 returned-item notes plus 10 unchanged G06 PASS notes**. Parked records
have after=null and no new keyed answer, concept or executable candidate; they
are excluded from the zero-lint count. There is no placeholder replacement.

## Per-item owner-note response and source disposition

| Item | Hold status | Round-three candidate | Owner-note resolution |
| --- | --- | --- | --- |
${perItem}

**G01:** the frozen original audit identifies four paired cases/eight variants:
four-month, six-month, hematology-followup and stable-count. Each original first
node asks for HIV/HCV evaluation; each second node defers elective splenectomy.
None keys marrow. The exact IDs/keys are in the controls receipt. That does not
identify the owner's recollected encounter or prove a universal testing ladder.
The recorded isolated-ITP claim does not support the newer multilineage marrow
ranking. Reverting to initial viral testing would duplicate the siblings without
settling that concern. The historical ASH timing source has an unresolved
bibliographic identity; the live fallback is recorded, **not cleared for new
acceptance**. Manager source/release review must address that existing issue.

**G02:** the existing claim supports trigger-free planning in an MH-prepared
facility. It does not establish the named agents, negative-panel interpretation,
contracture-test timing, exact readiness or prophylaxis ranking. Returning to
routine-versus-trigger-free labels would repeat the owner's easy/generic-choice
problem. The specific round-two comparison stays historical and parked.

**G03:** replaced absent-site bookkeeping with completed imaging of the current
clinical target. Mammographic and sonographic observations explicitly define
the negative studies. The learner must distinguish a separate concordant
fibroadenoma from the current hard, irregular, poorly mobile focus, then choose
tissue assessment despite imaging. MRI and interval examination/ultrasonography
are actual competing pathways, not completed-test or missing-export foils.
Sampling method is left to the breast team, as the recorded claim requires;
there is no new image-guided-device rule. The exact original v1 lineage is
identified; B2B36 is not treated as a repair or an acceptance.

**G04-R:** considered a source-supported urgent specialist-assessment decision,
but that would remain the easy safety recognition already rejected. The ledger
does not verify a trajectory or modality-priority discriminator for a harder
replacement. No hCG threshold, repeat interval, aspiration indication or unsafe
delay competitor is invented. Original G04 stays live; the agreed retirement/
merge requires a harder supported, independently passed and accepted replacement.

**G05:** a pathogenic CASR result now exists; no option is a gene test, so family
history cannot match a sole genetic answer. The player interprets confirmation
in the stable low-clearance phenotype, then decides whether a PHPT-specific age
criterion or a focal localization image supplies an operative indication.
Surveillance, parathyroidectomy and cinacalcet are named management choices.
The key is the directly recorded observation policy for confirmed uncomplicated
FHH; the drug is an unendorsed distractor, with no new indication, efficacy,
dose or threshold taught. A VUS, negative panel, progressive change or separately
established coexisting PHPT would invalidate this confirmation-dependent key.
Normal baseline DXA is not the reason for observation. Referral already happened.

**G05-staging:** the hardware/radial matrix remains parked; the general three-
site claim does not verify that technical comparison. In proposed G05 the
completed baseline study is unscored context after a referral, not a permission
step or mandatory study for confirmed FHH. No basic-purpose approval is invented.

**G07:** a tissue-required claim cannot rank excision over an adequate core or
prescribe fresh/fixed allocation. Explicit whole-formalin wording would not
verify that protocol. No cause of failed flow viability is inferred. A return
to tissue-versus-EBV matching would remain the easy evidence-gap item; the
specific method/handling comparison is parked rather than retained with a held key.

## Source and meaning boundaries

[Source ledger](sources-question-flags2-round3-20261105.json): **6 reused source
records / 5 publication identities, 10 original basis claims and 7 new atomic
applications**. ACR palpable-mass guidance and ASBrS/SBI benign fibroepithelial
guidance support G03. PARAT, the Fifth Workshop and NIDDK support G05's disease
distinction, observation boundary and limits of localization. The two Fifth
Workshop IDs are one publication, not independent corroboration. Original access
dates, complete citations, URLs/DOIs, rights/reuse assessments and medical
authority are retained. No source was re-accessed, no text/snippet was copied,
and no unverified protocol was promoted to a new fact. Historical holds remain
documented in the unchanged round-two ledger; they are not resolved by parking.

G03 changes acquisition selection to clinical-target management, so it uses
concept.palpable-breast.completed-imaging-clinical-target.v1. G05 changes genetic
test selection to management after confirmation, so it uses
concept.phpt.inherited-calcium-before-localization.v2. Previous concept IDs,
exact question definitions and source/timing/order archives remain intact.
Neither new card is registered in the live concept list; no FSRS transfer,
selection, save format or frozen encounter is changed.

## Important integration limitation — no simple node substitution

The retained **flags2-round3** view deliberately has **two one-node cases**.
G03 provides already-completed imaging and omits the old ultrasound gate and
repeated downstream biopsy question. G05 provides completed unscored baseline
assessment and omits the held round-two acquisition task. This is an explicit
proposed merge of case decisions, not an invisible edit to a preserved neighbor.

The current projector uses the legacy case's node list. Adding these two rows
and a header pin by themselves would reintroduce the old neighbors; a header
with one node does not remove legacy nodes. **Do not accept these as simple
partial substitutions.** Manager must review/authorize the proposed case
composition or park them if that is outside the accepted integration scope.
No projector, manifest, legacy binding or routing code was changed here.
The new meaning also overlaps existing biopsy/FHH teaching: manager should
consider the merge/coverage implication instead of adding duplicate learning
cards automatically. This is a proposal, not a retirement or coverage change.

## Validation and shared-tree evidence

| Check | Exact result | Native exit |
| --- | --- | ---: |
| Focused clinical: round 1, round 2, round 3, manifest, timing, accepted 2b | **97/97 tests; 6/6 files** | 0 |
| Cue-linter tests | **33/33** | 0 |
| Clinical-content typecheck | **2 N3 TS2339 diagnostics; 0 flags2 diagnostics** | 1 |
| Candidate lint, every canonical/finite profile | **0 before → 0 after; 2 variants / 8 contexts** | 0 |
| Builder, packet and preservation reproducibility checks | Passed | 0 |

Vitest used --pool=threads --maxWorkers=2. Full commands, native results and logs:
tools/question-quality/question-flags2-round3-validation-20261105.json.
The typecheck errors are both in question-new-n3-round2-20261105.ts at 93:123
and 101:116: N3Choice has no plausibleMisreading property. That lane remains
untouched. No full clinical, game-domain or player suite was newly run; there is
no whole-tree-green claim and no failure from flags2 clinical content.

The initial new snapshot tests saw concurrent N3 changes (95 passed / 2 failed).
The intake was **not refreshed** and no old assertion was edited. The final
checks reconstruct the exact intake bytes after removing only the marked N3
export, exact timing import/spread and exact catalog/helper substitutions.
They also compare every earlier timing row byte-for-byte and permit exactly
the N3 worker's exported new rows. Final controls prove **62 prior files byte-
frozen**, all earlier timing identities retained, and an unchanged live release,
manifest and G06. N3's three shared paths are separately identified in the
controls receipt; they are not attributed to this worker.

Read-only whole-live-bank lint: **1,136 cases / 1,449 nodes / 1,444 unique
variants / 6,091 contexts; 1,988 findings on 939 variants**. These existing
warnings are not a zero-lint result or an authorization to change other items.
No lint rule, severity or suppression changed. The new candidate timing export
has two exact tuples and **four** planned testing-choice order records, all
not_executed/future_planned. Nothing is appended to global execution or waits.

## Exact files

Only one pre-existing file was edited by this worker: the separately marked
three-line export in packages/clinical-content/src/index.ts. Every other file
below is a new flags2-round3 artifact. Machine paths/hashes are in
tools/question-quality/question-flags2-round3-files-20261105.json.

${sorted.map(p=>'- '+p).join('\n')}

## Level 5 bound-input impact

One existing bound runtime input changed **by this lane**:

- ${exactIndex.path}
  - Intake: ${exactIndex.beforeSha256}
  - This lane's export only: ${exactIndex.afterOurHunkOnlySha256}
  - Current combined file (also contains N3 export): ${exactIndex.combinedCurrentSha256}
  - Removing both identified append hunks recovers the intake hash exactly.

New transitive runtime inputs from this lane:

${newRuntime}

Tests, tools, docs and captures are not runtime inputs. N3 independently changed
synthetic-content.ts and answer-choice-timing.ts and appended its own index
block. Their before/after and isolated-original hashes are recorded separately
in question-flags2-round3-controls-20261105.json; this worker edited neither.
No Level 5 evidence, pin, checkpoint, hash expectation or rebind was touched.
The manager owns the actual combined release-tree binding.

## Stop and handoff

Stop for independent review of the two supported candidates; five items remain
parked with the exact live fallbacks in the packet. Resolve the merge/composition
decision before any acceptance, and let N3's owner resolve its type diagnostics.
No manifest row, public release, source/clinical approval, Git operation,
installation, network request, agent, external message, deploy, Supabase,
player/save/cloud or other lane edit occurred. The active write boundary
excludes the shared CURRENT_THREAD_HANDOFF.md; this file is the scoped handoff.
This checkpoint remains local only; the manager owns any later backup/release.
`;
save(handoffPath,handoff);
const filesPath='tools/question-quality/question-flags2-round3-files-20261105.json';
const fileReceipt={checkedOn:'2026-11-05',scope:'Only new flags2-round3 artifacts and one minimal existing index export. Concurrent N3 changes are separately accounted for in controls, not worker edits.',
 existingEdits:[{path:'packages/clinical-content/src/index.ts',purpose:'Separate export of retained, unaccepted round-three candidates only'}],
 files:sorted.map(path=>({path,kind:path==='packages/clinical-content/src/index.ts'?'existing_minimal_hunk':'new',
  sha256:path===filesPath?null:hash(path)})),
 selfHashOmitted:true};
save(filesPath,JSON.stringify(fileReceipt,null,2)+'\n');
console.log(JSON.stringify({handoff:handoffPath,files:sorted.length,clinical:validation.clinical.tests,linter:validation.linter.tests,typecheck:validation.typecheck,
 sourceRecords:validation.sourceRecords,publications:validation.publicationIdentityKeys,newClaims:validation.newAtomicClaims},null,2));
