import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const control=read('tools/question-quality/question-flags2-round2-controls-20261105.json');
const packet=read('docs/research/question-flags2-round2-20261105.json');
const ledger=read('docs/research/sources-question-flags2-round2-20261105.json');
const lint=read('tools/question-quality/question-flags2-round2-lint-20261105.json');
const before=read('tools/question-quality/fixtures/question-flags2-round2-before-20261105.json');
const decode=p=>{const b=fs.readFileSync(p);return b.toString(b[0]===255&&b[1]===254?'utf16le':'utf8').replaceAll('\uFEFF','').replace(/\x1b\[[0-9;]*m/g,'');};
const clinicalLog='tools/question-quality/question-flags2-round2-clinical-final-20261105.log';
const typeLog='tools/question-quality/question-flags2-round2-typecheck-final-20261105.log';
const lintLog='tools/question-quality/question-flags2-round2-linter-tests-final-20261105.log';
const clinical=decode(clinicalLog),types=decode(typeLog),linter=decode(lintLog);
assert.match(clinical,/Test Files\s+5 passed \(5\)/);assert.match(clinical,/Tests\s+80 passed \(80\)/);
assert(!/error TS\d|npm error/.test(types));assert.match(types,/tsc --noEmit/);
assert.match(linter,/pass 33/);assert.match(linter,/fail 0/);assert.equal(lint.totals.afterFindings,0);
const knownOriginalSources=new Map([
 ...Object.values(read('tools/question-quality/fixtures/question-bank-batch2b-round2-before-20261104.json').sources),
 ...before.sources,...read('docs/research/sources-question-flags2-20261105.json').sources,
].map(s=>[s.id,s]));
for(const source of ledger.sources){
 const original=knownOriginalSources.get(source.id);assert(original,'Actual prior source metadata must exist');
 for(const field of ['completeCitation','organizationOrJournal','authors','publicationYear','doi','officialUrl','accessedOn','sourceClass','licenseLabel','reuseStatus','reuseNotes','authorityAssessment'])
  assert.deepEqual(source[field],original[field],source.id+' altered original '+field);
}
const publicationKeys=ledger.sources.map(s=>s.doi?'doi:'+s.doi.toLowerCase():'url:'+s.officialUrl.replace(/\/$/,''));
const validation={checkedAt:new Date().toISOString(),clinical:{command:'npm.cmd run test --workspace @gamify-surgery/clinical-content -- --pool=threads --maxWorkers=2 src/question-flags2-20261105.test.ts src/question-flags2-round2-20261105.test.ts src/question-ship-manifest.test.ts src/answer-choice-timing.test.ts src/question-bank-batch2b-acceptance-20261105.test.ts',
  nativeExitCode:0,testFiles:{passed:5,failed:0,total:5},tests:{passed:80,failed:0,total:80},log:clinicalLog,durationSeconds:Number(clinical.match(/Duration\s+([\d.]+)s/)?.[1])},
 linter:{command:'npm.cmd run clinical:lint:test',nativeExitCode:0,tests:{passed:33,failed:0,total:33},log:lintLog},
 typecheck:{command:'npm.cmd run typecheck --workspace @gamify-surgery/clinical-content',nativeExitCode:0,log:typeLog},
 cueLint:{command:'node tools/question-quality/review-question-flags2-round2-20261105.mjs --check --require-zero',totals:lint.totals,report:'tools/question-quality/question-flags2-round2-lint-20261105.json'},
 focusedScope:'Round-one historical source, round-two source/packet/holds, manifest/projection, complete timing classification and prior batch2b acceptance regressions. No new full clinical/domain/player suite run or whole-tree-green claim.',
 intermediateTypecheck:'One initial test-only discriminated-union caption access error was fixed by narrowing the exhibit kind; final typecheck and all focused tests pass.',
 sourceRecords:ledger.sources.length,publicationIdentityKeys:new Set(publicationKeys).size,newAtomicClaims:control.atomicClaims,noteResponses:packet.filter(p=>p.id!=='G06').reduce((n,p)=>n+p.reviewResponse.notes.length,0),
 acceptedIds:['G06'],unacceptedSourceHeldKeys:control.sourceHoldIds,originalG04KeptLive:true,N3TimingWorkPreserved:true,
 runtimeSourceWindow:control.changedExistingLevel5BoundInputs,newRuntimeDependencies:control.newRuntimeDependencies,
};
fs.writeFileSync('tools/question-quality/question-flags2-round2-validation-20261105.json',JSON.stringify(validation,null,2)+'\n');
const ownExisting=[...control.ownExistingRuntimePaths,...control.ownTestPaths.filter(p=>Object.hasOwn(before.files,p)),'docs/handoffs/CURRENT_THREAD_HANDOFF.md'];
const ownNew=[...control.ownNewRuntimePaths,'packages/clinical-content/src/question-flags2-round2-20261105.test.ts',
 'docs/execplans/question-flags2-round2-20261105.md','docs/research/question-flags2-manager-decision-20261105.md','docs/research/question-flags2-round2-20261105.json',
 'docs/research/sources-question-flags2-round2-20261105.json','docs/research/question-flags2-round2-handoff-20261105.md',
 ...['capture','build','review','control','handoff'].map(n=>'tools/question-quality/'+n+'-question-flags2-round2-20261105.mjs'),
 'tools/question-quality/question-flags2-round2-specs-20261105.mjs','tools/question-quality/integrate-question-flags2-g06-20261105.mjs',
 'tools/question-quality/fixtures/question-flags2-round2-before-20261105.json','tools/question-quality/question-flags2-g06-integration-20261105.json',
 ...['lint','controls','validation','files'].map(n=>'tools/question-quality/question-flags2-round2-'+n+'-20261105.json'),
 ...['clinical','typecheck','linter-tests','clinical-final','typecheck-final','linter-tests-final'].map(n=>'tools/question-quality/question-flags2-round2-'+n+'-20261105.log'),
];
const files={checkedAt:new Date().toISOString(),existing:ownExisting,new:ownNew,sharedIntegration:control.sharedIntegration,observedConcurrentChanges:control.observedConcurrentChanges,
 scope:'Only these owned paths/hunks are attributed to this worker. N3 files, game-domain source/tests, save/cloud, Supabase and Level 5 evidence/pins are not edited by this lane.'};
fs.writeFileSync('tools/question-quality/question-flags2-round2-files-20261105.json',JSON.stringify(files,null,2)+'\n');
const itemTable=control.returnedDrafts.map(row=>{const p=packet.find(p=>p.id===row.id);return '| '+row.id+' | `'+row.variantId+'` | '+p.reviewResponse.notes.length+' | '+(row.sourceHoldOnKey?'Key hold':'Recorded claim application; clinical review required')+' |';}).join('\n');
const fileList=[...ownExisting,...ownNew].map(p=>'- '+p).join('\n');
const existingInputs=control.changedExistingLevel5BoundInputs.map(r=>'- '+r.path+'\n  - Intake SHA-256: '+r.before+'\n  - Current SHA-256: '+r.current).join('\n');
const newInputs=control.newRuntimeDependencies.map(r=>'- '+r.path+' — '+r.sha256).join('\n');
const doc=`# Flags2 round two — handoff, November 5, 2026

**STOP for independent review of seven new drafts. G06 alone is manager
accepted.** The new packet has eight top-level records: seven revised/replacement
items plus the unchanged exact G06 PASS. All new questions, concepts and atomic
claims remain needs_clinician_review; Melissa Rowland remains clinical sign-off.
Editorial acceptance does not clinically approve G06 or the release.

Packet: [question-flags2-round2-20261105.json](question-flags2-round2-20261105.json).
Decision: [question-flags2-manager-decision-20261105.md](question-flags2-manager-decision-20261105.md).
The key is shown first for review only; runtime answers remain randomized.
Jamie Taylor is a review placeholder; actual finite ages/sexes are preserved.

## Dispositions and per-note response index

| Item | New exact variant | Review notes addressed | Evidence disposition |
|---|---|---:|---|
${itemTable}

Each returned cue, fairness and suggestion note is retained with its original
category/index and a specific response in reviewResponse.notes: **86 notes**
across the seven drafts. G06's PASS notes are separately retained with a
preservation response. The packet also includes before/after fields, rationale
pairs, both inference steps, closest credible error, deciding finding,
counterfactual, deletion/cue attack, full visible history and lint before/after.
Before is the reviewed round-one draft, except G03 and G04-R which use the
direct flagged live originals. This is an author check, not another independent
review or clinical sign-off.

- **G01 — reconcile the ITP sequence.** Removed the announced continuing-
  treatment plan, calendar-date key and two surgery-after-preparation foils.
  The new follow-up changes from isolated thrombocytopenia to multiple affected
  lineages and altered morphology. Marrow, blood flow and myeloid sequencing
  now compete as named investigations. This is a new diagnostic-reassessment
  concept, not a new claim that everyone proceeds from negative HIV/HCV tests
  to marrow. All eight old isolated-ITP sibling versions remain unchanged.
  The new marrow-versus-blood-study boundary/ranking is held for direct source
  and hematology confirmation. The old ASH bibliographic problem is not used as
  evidence for the new key; its historical timing versions are preserved.
- **G02 — specific, closer anesthetic plans.** Kept the family contracture
  result and prior uneventful exposure, added the actual uninformative-panel
  premise, and used the same named intravenous agents in every option. The
  decision concerns preoperative testing/prophylaxis sequencing. No option can
  be discarded simply for containing a volatile agent or succinylcholine.
  Preparation, testing and prophylaxis alignment remains a key-level hold.
  No drug dose, workstation duration or improvised crisis protocol is taught.
- **G03 — direct v1 repair.** Bound the new r3 directly to the owner-flagged
  live v1, never to B2B36 r2. Replaced the named ultrasound omission with two
  clinical skin markers and a complete acquisition record. New targeted
  ultrasound competes with retrieval and spot-compression requests. The
  learner must identify acquisition/site discordance; a missing export is not
  assumed to prove an absent study. The ACR site-specific claim supports this
  application with its original single-guideline limitation. The old second
  node and returned gate remain exact. Its later hard/irregular clinical
  characterization is compatible with the initial firm, mobile lump.
- **G04-R — harder replacement; original remains live.** Removed assay-
  identification and CBC/lipase/creatinine foils. The new case combines early
  home testing, persistent/falling hCG, evolving focal symptoms and a limited
  pelvic acquisition. All offered pathways obtain a same-day diagnostic
  assessment: transvaginal imaging, an appendiceal investigation, or uterine
  sampling. Neither the only urgent option nor an announced missing assay can
  reveal the key. This has a new concept and a held exact modality/priority
  comparison. No discriminatory hCG threshold, repeat interval or methotrexate
  rule was invented. **Original G04 cannot be retired/merged until this harder
  replacement passes review and is accepted.** No selection or FSRS change.
- **G05-staging — useful acquisition interpretation.** Removed the weak
  alternative modalities and the basic-item label. A completed lumbar record
  and right-hip prosthesis must be interpreted before choosing among a balanced
  native/prosthetic hip × one-third/ultradistal radius matrix. Every option has
  the same two-site extent and is a new acquisition. The exact radial site is
  named. Hardware/ROI alignment remains held. The referral and requested
  skeletal assessment are recorded before the DXA result; its gate does not
  decide whether referral may begin.
- **G05 — diagnostic clarity before operative localization.** Removed the
  destination/operative nudge and cinacalcet. The manual self-check rejected an
  intermediate operative-approach comparison because different approaches
  could be defended. The final separately versioned objective uses a sourced
  inherited-calcium differential: raw calcium/PTH, an interpretable low urine
  clearance ratio and longstanding family findings require genetic
  clarification before assuming that PHPT localization is the remaining step.
  Sestamibi and a PTH-related-peptide assay represent different workup errors.
  The header is now a provisional biochemical workup, not a claim that
  already-confirmed PHPT must await an abnormal DXA. The old age-criterion card
  remains intact and the referral already exists. The below-0.01 clue and its
  inability to confirm FHH are directly mapped to recorded PARAT/Fifth
  Workshop claims. No new threshold or empiric medication rule is added.
- **G07 — tissue method plus handling.** Removed fluid/debris targets and the
  artificial needle-only restriction. The actual prior target, limited tissue
  pattern and failed flow result are specified. Four balanced plans combine
  excision/core with fresh/fixed or formalin allocation for the same solid
  node. A well-planned core is the explicit closest competitor, not an absurd
  repeat aspiration. The exact accessible-node preference and allocation
  protocol are held for PTLD/hematopathology confirmation; blood EBV does not
  establish a tissue diagnosis or treatment plan.

Review G05 and G05-staging as the composed pair shown in the packet. Their
shared header now describes a provisional biochemical workup, and the later
family/urine data change the diagnostic plan. Any partial acceptance needs its
own mixed-header/feedback preview under step five of the integration contract;
a PASS on one node does not accept the other node or its presentation.

## G06 acceptance and composed live result

Added **one G06 manifest row** plus its corresponding exact G06 header-source
pin. Source view: flags2-round1. Exact question:
question.statistics-ethics.predictive-value-prevalence.v2.r1; concept:
concept.predictive-value.collection-population-denominator.v1. No optional
wording polish, exhibit, feedback, profile or rationale change was applied.

The accepted key has no hold. It is a constructed-data arithmetic exercise:
the pre-admission cohort gives 45/(45+19), about 70%; the other cohort and
denominators supply the numeric alternatives. It teaches no empirical MRSA
performance, infection diagnosis, decolonization or treatment policy.

Controls prove that **only the G06 case changes in the default live projection**
and only its one new history concept is added; every old concept is retained.
The case has one node, so no mixed accepted/fallback composition is introduced.
All other prior acceptances/header bindings are exact, including the 16 batch2b
and 14 N2 rows. Manifest now ${control.manifestRows} acceptances; live
${control.liveCases} cases / ${control.liveNodes} nodes. Six round-one runtime/
packet/source artifacts preserve their intake hashes. The source-view export
does not admit the seven new drafts.

## Sources, claims and holds

[sources-question-flags2-round2-20261105.json](sources-question-flags2-round2-20261105.json)
records **${ledger.sources.length} existing source records**, **${new Set(publicationKeys).size} DOI/URL publication identities** and
**${control.atomicClaims} new atomic mappings**. Full citation, authors, year,
organization/journal, DOI/URL, original access date, source class, rights/reuse,
authority and intended claim use are preserved. No source page or excerpt was
retrieved/stored; offline checking is not a new access date or corroboration.
The two Fifth Workshop IDs share a DOI and are counted as one publication.

The evidence groups are the recorded ITP consensus; JSA/EMHG MH guidance; ACR
palpable-mass guidance; Queensland/NLM/NHS early-pregnancy material; Fifth
Workshop, PARAT and NIDDK calcium guidance; AST/PTLD and selected UK neck-tissue
guidance. G06 retains CDC/FDA statistical definitions and the old incidental
pancreatic-history citations. Those incidental citations do not become evidence
for assay performance or a new management rule. Attribution/rights assessments
remain in the records, separately from medical authority.

**Five keyed holds:** G01, G02, G04-R, G05-staging and G07. The original claims
do not directly verify their new exact workup, preparation, technique or
processing comparisons. G03 and G05 use supported recorded facts with their
original limitations; both still require independent and named clinical review.
No held key is accepted, and no uncertain source comparison is counted as
desirable difficulty. G04-R is predicted lower-moderate; the others moderate,
qualitatively for independent PGY-2/3 review, never measured difficulty.

## Validation

| Check | Exact result | Native exit |
|---|---|---:|
| Focused clinical: round-one, round-two, manifest, timing, prior 2b acceptance | 80/80 tests; 5/5 files | 0 |
| Cue-linter tests | 33/33 tests | 0 |
| Clinical-content typecheck | Passed | 0 |
| New-variant cue lint | 3 before → 0 after; 7 variants / 31 canonical/profile contexts | 0 |

Vitest used --pool=threads --maxWorkers=2. Exact commands, native results and
logs: tools/question-quality/question-flags2-round2-validation-20261105.json.
Builder/packet check commands reproduce the files and require zero lint.
The first test-only typecheck error concerned accessing caption without narrowing
the exhibit union; corrected, then the final source window was rerun successfully.
No assertions, timeouts, clinical content or lint rules were weakened.

The timing check preserves the N3 writer's own count term and adds exactly the
one G06 row. The prior N3 mismatch is not repaired or owned here. No N3 file is
edited. No new full clinical/domain/player suite run or whole-tree-green claim
is made under this focused-validation milestone.

Candidate timing exports cover all seven drafts. There are **21** exact planned
test-choice records: two retained service/result gates and nineteen future-
planned/nonexecuted records. Archive retrieval in G03 is not misclassified as a
new ultrasound order. All old order/timing identities remain, and these draft
records are not added to global execution. G06 alone gets one global no-test
timing row. Manager integration of any later accepted draft must separately bind
its exact header/concept/source/timing/order tuple under the existing contract.

## Exact files

Machine file list and shared-hunk preservation receipts:
tools/question-quality/question-flags2-round2-files-20261105.json.

${fileList}

## Level 5 input impact and stop condition

Changed existing bound runtime inputs, attributable to this lane:

${existingInputs}

New runtime dependencies exported by this lane:

${newInputs}

Tests, offline tools, captures and docs are not runtime inputs. Changes from
other lanes are separately recorded in the controls/file receipt; stripping
this lane's four shared-file integration fragments currently recovers each
insertion-before hash exactly. No evidence, pin, checkpoint or behavioral-
evidence refresh is performed. The manager owns release-tree binding.

No source definition for an old/frozen version, save format, selector/routing,
player session/cloud, Supabase, N3 file, Git operation, install, network request,
agent, external message, deploy or opening pathway change by this worker.
Original G04 remains live; the seven drafts stop here for review. Remaining
actions are independent review, exact keyed-hold verification, clinical review,
then manager acceptance/integration. This checkpoint is local only; the manager
owns the separately authorized "push to GitHub" backup.
`;
const handoffPath='docs/research/question-flags2-round2-handoff-20261105.md';
fs.writeFileSync(handoffPath,doc);
const decisionPath='docs/research/question-flags2-manager-decision-20261105.md';
const decision=fs.readFileSync(decisionPath,'utf8').split('\n## Validation receipt\n')[0];
fs.writeFileSync(decisionPath,decision+'\n## Validation receipt\n\nFocused clinical 80/80 in five files, linter 33/33 and clinical-content typecheck\nall pass, native exit 0. Vitest uses threads/maxWorkers2. Exact composed G06\ncase/header/source/timing and every other old live case are checked. No new\nfull-suite or release-tree certification is claimed. Full receipt and seven-\ndraft review handoff: question-flags2-round2-handoff-20261105.md.\n');
const thread='docs/handoffs/CURRENT_THREAD_HANDOFF.md',marker='<!-- BEGIN FLAGS2 ROUND2 HANDOFF 20261105 -->';
if(!fs.readFileSync(thread,'utf8').includes(marker))fs.appendFileSync(thread,`\n\n${marker}
Flags2 round two complete at independent-review gate. Packet:
docs/research/question-flags2-round2-20261105.json; full per-note/source/hold/file/
validation handoff: docs/research/question-flags2-round2-handoff-20261105.md.
Seven new variants in six cases, seven changed-meaning concept versions and
twenty new atomic claims; all needs_clinician_review. Eight-record packet also
retains exact G06 PASS. All 86 returned cue/fairness/suggestion notes have indexed
responses and concrete manual rubric/counterfactual records. G03 binds directly
to live v1 (new r3), not B2B36. G04-R replaces elementary assay recall with a
pregnancy-location/diagnostic-disposition task; original G04 remains live until
the replacement passes and the manager accepts retirement/merge.

G06 alone accepted via one manifest row and its exact header pin, decision:
docs/research/question-flags2-manager-decision-20261105.md. Exact v2.r1, source
flags2-round1; no keyed hold. One new concept/no-test timing tuple; other live
cases, concepts, rows, headers and old archives preserved. Manifest 62 rows;
live 1,136 cases / 1,449 nodes. Editorial acceptance is not Melissa Rowland
clinical approval. Six round-one source/PASS artifacts remain byte-exact.

Final focused clinical 80/80 in five files, cue-linter 33/33 and clinical typecheck
pass, native exit 0. Vitest threads/maxWorkers2. New cue findings 3 → 0 across
seven variants / 31 contexts. No new full-suite or whole-tree-green claim.
N3 writer's timing-count term preserved; only G06's one new row is accounted for
here. No N3 file edit. Twenty-one draft test-choice records exported (two old
gate routes / nineteen future-planned) without new global execution.

Five new keyed source holds: G01/G02/G04-R/G05-staging/G07. G03 and G05 use recorded
ACR and inherited-calcium facts; all seven still await independent/clinical
review. G05's self-check replaced an ambiguous operative comparison with a
sourced inherited-calcium differential before localization. Referral precedes
DXA; no normal-density permission gate. Ledger: 19 reused records / 18 publication
identities, original dates/rights retained, no retrieval or copied source text.

Own changed existing Level 5 inputs: clinical-content/src/index.ts,
synthetic-content.ts, answer-choice-timing.ts and question-ship-manifest.ts;
five new runtime dependencies and exact hashes are in the controls/handoff.
No evidence/pin rebind, selector/routing, save/session/cloud/Supabase, Git,
install, network, agents, external message, release or opening-pathway change.
Shared hunks preserve unrelated/N3 work. Local only; manager owns independent
review, keyed-source resolution, acceptance/integration, release-tree binding
and a separately authorized "push to GitHub" backup. STOP.
<!-- END FLAGS2 ROUND2 HANDOFF 20261105 -->\n`);
for(const p of [...ownExisting,...ownNew])assert(fs.existsSync(p),p+' missing from handoff');
console.log(JSON.stringify({accepted:['G06'],newDrafts:7,reviewNotes:validation.noteResponses,clinicalTests:80,linterTests:33,typecheckExit:0,lintFindings:0,
 sourceRecords:ledger.sources.length,publicationIdentities:new Set(publicationKeys).size,keyHolds:control.sourceHoldIds,existingFiles:ownExisting.length,newFiles:ownNew.length},null,2));
