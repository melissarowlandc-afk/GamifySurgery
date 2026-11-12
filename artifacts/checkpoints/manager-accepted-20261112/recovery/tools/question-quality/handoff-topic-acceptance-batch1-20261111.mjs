import fs from 'node:fs';
import {createHash} from 'node:crypto';
const dir='.local-dev/question-topic-acceptance-batch1-20261111/';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const packet=read('docs/research/question-topic-acceptance-batch1-packet-20261111.json');
const before=read('tools/question-quality/fixtures/question-topic-acceptance-batch1-before-20261111.json');
const digest=v=>createHash('sha256').update(v).digest('hex');
function result(name){
 const p=dir+name+'.json';if(!fs.existsSync(p))return {name,status:'not_finished'};
 const j=read(p),bytes=fs.readFileSync(dir+name+'.log'),log=bytes[0]===255?bytes.toString('utf16le'):bytes.toString('utf8');
 const failed=j.testResults.flatMap(r=>r.assertionResults.filter(a=>a.status==='failed').map(a=>({file:r.name.replaceAll('\\','/').replace(/^.*\/GamifySurgery\//,''),title:a.fullName,message:a.failureMessages[0]??''})));
 return {name,status:j.success?'passed':'failed',tests:j.numTotalTests,passed:j.numPassedTests,failed:j.numFailedTests,skipped:j.numPendingTests,
  files:j.testResults.length,failedFiles:j.testResults.filter(r=>r.status==='failed').length,
  duration:log.match(/Duration\s+([^\r\n]+)/)?.[1]?.replace(/\u001b\[[0-9;]*m/g,'')??null,
  command:log.split('\n').find(l=>l.startsWith('> vitest run'))?.trim()??null,reportSha256:digest(fs.readFileSync(p)),failures:failed};
}
const runs=['clinical-baseline-guards','clinical-focused-integration','clinical-own-focused','clinical-final','domain-full','domain-final','player-final','player-admission-final'].map(result);
for(const r of runs)if(r.name.endsWith('-final')&&r.status==='not_finished')throw new Error('Finish '+r.name+' before the handoff');
const textlog=p=>{const b=fs.readFileSync(p);return b[0]===255?b.toString('utf16le').replace(/^\uFEFF/,''):b.toString('utf8');};
const type=textlog(dir+'typecheck-final.log'),lint=textlog(dir+'lint-tests.log');
if(/error TS\d+/.test(type))throw new Error('typecheck still failing');
const validation={checkedOn:'2026-11-11',runs,typechecks:{command:'npm.cmd run typecheck (root)',workspaces:7,errors:0,success:true,logSha256:digest(fs.readFileSync(dir+'typecheck-final.log'))},
 lintTests:{command:"$env:NODE_NO_WARNINGS='1'; npm.cmd run clinical:lint:test",passed:Number(lint.match(/pass\s+(\d+)/)?.[1]),failed:Number(lint.match(/fail\s+(\d+)/)?.[1]),
  duration:lint.match(/duration_ms\s+([^\r\n]+)/)?.[1],logSha256:digest(fs.readFileSync(dir+'lint-tests.log'))},
 playerPreload:'tools/question-quality/adversarial-r5-player-preload-20261102.cjs; only Vite optional Windows drive probe. Actual codec, journals, saves, assertions and budgets unchanged.',
 note:'Every Vitest invocation uses --pool=threads --maxWorkers=2. Source/authority tests owned by concurrent topic workers remain untouched. Exact failed titles/messages are retained rather than dismissed as a green run.'};
fs.writeFileSync('docs/research/question-topic-acceptance-batch1-validation-20261111.json',JSON.stringify(validation,null,2)+'\n');
const cell=s=>String(s??'none').replaceAll('|','\\|').replaceAll('\n',' ');
const table=(heads,rows)=>['| '+heads.join(' | ')+' |','| '+heads.map(()=> '---').join(' | ')+' |',...rows.map(row=>'| '+row.map(cell).join(' | ')+' |')].join('\n');
const acceptanceList=table(['Accepted exact variant','Case','Meaning','Review','Pending runtime binding'],packet.accepted.map(a=>['`'+a.questionVariantId+'`','`'+a.caseId+'`','`'+a.conceptId+'`','PASS; needs_clinician_review',a.runtime.testChoiceOrdersPending.length+' exact order records; no affinity/timing edit']));
const skipped=table(['Skipped exact variant','Reason / unlisted scored siblings'],packet.skipped.map(s=>['`'+s.questionVariantId+'`',s.reason+(s.unlistedSiblingIds?.length?' Siblings: '+s.unlistedSiblingIds.map(id=>'`'+id+'`').join(', '):'')]));
const sources=table(['Accepted-only view','Cases / nodes','SHA-256'],packet.sourceViews.map(v=>['`'+v.name+'`',v.cases+' / '+v.nodes,'`'+v.sha256+'`']));
const orders=table(['Case / node / question','Choice ID and exact label','Timing profile'],packet.pendingRuntimeOrders.map(o=>[
 '`'+o.caseId+'`<br>`'+o.nodeId+'`<br>`'+o.questionVariantId+'`','`'+o.choiceId+'`: '+o.choiceLabel,'`'+o.timingProfileId+'`']));
const counts=table(['Measure','Before','After'],Object.keys(packet.counts.before).map(k=>[k,packet.counts.before[k],packet.counts.after[k]]));
const validationTable=table(['Run','Files passed / failed (total)','Tests pass / fail / skip','Duration'],[...runs.filter(r=>r.status!=='not_finished').map(r=>[r.name,`${r.files-r.failedFiles} / ${r.failedFiles} (${r.files})`,`${r.passed} / ${r.failed} / ${r.skipped}`,r.duration]),['7 typechecks','7 workspaces','7 pass / 0 fail','see log'],['cue lint tests','1 tool',`${validation.lintTests.passed} / ${validation.lintTests.failed} / 0`,validation.lintTests.duration+'ms']]);
const failures=runs.filter(r=>r.name.endsWith('-final')).flatMap(r=>r.failures.map(f=>`- **${r.name}: ${f.file}** — ${f.title}. First failure: ${f.message.split('\n')[0]}`)).join('\n');
const l5=table(['Changed bound input','Intake SHA-256','After SHA-256'],packet.levelFiveInputs.map(r=>['`'+r.path+'`','`'+r.beforeSha256+'`','`'+r.afterSha256+'`']));
const clinicalFiles=packet.integrationFiles.map(r=>'- `'+r.path+'`').join('\n');
const lines=`# Topic program acceptance batch1 — 2026-11-11

Integrated **22 exact PASS nodes in 18 complete cases** from 41 requested nodes.
**19 requested nodes remain unaccepted**:17 share a reviewed case with unlisted
scored companions, and2 require an unsupported four-to-one live-case consolidation.
No returned, held or parked question is admitted. All 22 remain
**needs_clinician_review**; no Melissa Rowland clinical approval is implied.

The two SBO rewrites withhold their old cases from fresh selection. Original
frozen cases, old question definitions and all 610 prior registered meanings are
retained. All 18 actual default cases admit in the existing clinic with an
operational Examination Room. No new ICU, dialysis or trauma service is invented.

## Acceptance authority and exact versions

Manager's named suffix list and independent PASS records are matched in the
[disposition receipt](question-topic-acceptance-batch1-dispositions-20261111.json).
The [accepted packet](question-topic-acceptance-batch1-packet-20261111.json)
contains each exact row/node/meaning/source hash, review record, claim/source
mapping, runtime needs and review-only key-first fields. Runtime choices shuffle.

${acceptanceList}

### Skipped nodes

${skipped}

Two retained-context details are important:

- Appendix interval-appendectomy.v1 survives in
  \`case.topic.appendix-appendicitis.post-abscess-lesion.v1\` with unlisted
  \`question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1\`.
  The current source uses a different revised case. The exact retained PASS
  has not been extracted or composed with new feedback.
- Respiratory planned-extubation.v1 survives in the explicitly held full case
  \`case.topic.critical-respiratory-ventilation.niv.v1\` with unlisted/returned
  \`copd-niv.v1\` and \`copd-niv-failure.v1\` nodes. Its source's
  \`frozen_pass_context_only\` hold requires context-specific re-review before
  recomposition or standalone admission. Requested copd-niv.v2 belongs to a
  separate revised case with unlisted copd-niv-failure.v2.

### Parked four-to-one rewrite

The complete PASS pair \`persistent-pain-exploration.v1\` /
\`invasive-adenocarcinoma-resection.v2\` declares replacement of four live CT
cases: \`case.gs028c.appendicitis.a-atypical-older-adult\`,
\`case.gs028c.appendicitis.a-competing-diagnoses\`,
\`case.gs028c.appendicitis.a-equivocal-exam\` and
\`case.gs028c.appendicitis.a-nondiagnostic-ultrasound\` (questions CT v2/v4/v3/v1).
The current resolver rejects multiple legacy cases targeting one source case,
and the projector would otherwise duplicate that source. This milestone uses
existing mechanisms; neither resolver nor projector was changed. The pair is
parked pending a manager decision on a narrow many-to-one integration extension.
No approval is inferred from the unanswered async scope question. All four live
cases remain exact and selectable. Accepting it as an unrelated new case would
silently disregard its declared rewrite mapping, so that was not done.

## Exact replacement relations and source views

- \`case.gs028.small-bowel-obstruction.b-stable-no-red-flags\`
  (\`question.small-bowel-obstruction.urgent-surgical-escalation.v3\`)
  is replaced by the closed-loop-normal-lactate.v1 case.
- \`case.gs028.small-bowel-obstruction.b-peritoneal-signs\`
  (\`question.small-bowel-obstruction.urgent-surgical-escalation.v1\`)
  is replaced by the postcontrast-deterioration.v1 case.

Those sources declare meaning \`concept.small-bowel-obstruction.urgent-surgical-escalation.v2\`.
The old unversioned meaning and its histories remain registered and unchanged;
they are not migrated. Other declared new meaning versions are copied exactly
from the topic packet. Twenty-one meanings are appended, none of the old 610
definitions changes. Old frozen answers still score the old meaning.

${sources}

Accepted-only static views insulate live content from concurrent wave2–3 draft
edits. No topic-worker module is imported by the live wrapper. Original worker
sources, packets, review records and ledgers for all six accepted topics match
their intake hashes. The accepted archive retains70 existing atomic claims and
30 existing source records, including original bibliographic/reuse metadata;
no medical prose, source or fact was added here and no network was used.

Two technical presentation adaptations are explicit and reversible:

1. The existing projector's learning-summary rule joins scored explanations;
   retained views use that same value so projected cases match their source.
2. The two respiratory source cases hard-code names in presentation/profiles,
   tasks and one update. Seven exact substitutions replace only those names
   with the existing \`{patientName}\` token in the runtime view. Original
   question records, raw cases and raw node hashes remain archived. No other
   word, finding, option, rationale, ID or clinical meaning changes. Tests
   independently reconstruct this exact allowlist and admit different patient
   names, proving the chart and task agree. The topic-worker files are untouched.

## What moved

${counts}

- Manifest: \`${packet.manifestId}\`, **167 accepted rows**,6 whole-case relations
  (old 4 plus 2),1423 unchanged legacy bindings.
- Manifest SHA-256: \`${packet.hashes.manifestAfter}\`.
- Default SHA-256: \`${packet.hashes.defaultAfter}\`.
- Prior default SHA-256: \`${packet.hashes.defaultBefore}\`.
- Unchanged full question catalog SHA-256: \`${packet.hashes.catalogAfter}\`.
-18 admitted cases replace2 old cases: net +16cases/+20nodes/+21registered
  meanings. All other 1149 default case definitions remain byte-exact.
-22 timing-registry entries append to 2295 (now 2317); no old entry changes.

The acceptance inverse asserts the entire authorized case/meaning/manifest/
timing/source delta before reconstructing the old 1151/1462/610 epoch. Negative
tests prove unrelated drift still fails. Historical captures and assertions are
not refreshed. The prior N4 test epoch is adapted through this exact inverse.

## Runtime follow-up — list only

All 22 accepted nodes are existing **clinic chart-review** decisions. Every
case matches \`clinicCaseMatchesLine(..., "income.app_consult")\`; each has
\`procedureConsultKind === null\`. No endoscopic-finding, OR eligibility,
wound/ostomy topic-affinity or new clinic-setting entry is needed. Facility
entry indices and required capabilities are recorded per item in the packet.
Eight cases require the existing examination capability; the real QA fixture
builds \`room.examination\` at 35,24 with a south door offset 1. The initial
immutable probe had no examination room and is retained as evidence; its
follow-up supplies that existing room through real placement commands.

The domain owner must append exactly **15 diagnostic-choice tuples** to
\`packages/game-domain/src/test-choice-orders.ts\` /
\`EXACT_TEST_CHOICE_ORDER_RECORDS\`, using exported
\`QUESTION_PROGRAM_BATCH1_ACCEPTED_TEST_ORDER_RECORDS\`. Every tuple is
\`{kind:"not_executed", reason:"future_planned"}\`: these historical decisions
do not start physical tests or result gates. Existing timing profiles are used.
All 22 estimated-choice timing classifications are already installed in clinical
content. No domain-side acceptance check or runtime implementation changed.

${orders}

## Cue lint and review residuals

Raw advisory lint: **${packet.lint.accepted.findings} findings across${packet.lint.accepted.variantsWithFindings}/${packet.counts.acceptedNodes} accepted variants**.
These are unsuppressed exact phrase/field results in the
[lint receipt](question-topic-acceptance-batch1-lint-20261111.json), alongside
whole-bank totals. The independent PASS versions were preserved; lexical flags
are not treated as new editorial failures or silently cleared. Eight keys are
slightly longest by raw character count. Each residual is explicitly pinned
to its measured lengths, exact accepted case hash and authority decision in
the pre-existing character-length test. No general threshold or linter rule
was weakened. Difficulty remains the independent reviewer's qualitative judgment.

## Validation

All Vitest commands use \`--pool=threads --maxWorkers=2\`. Clinical and domain
full suites ran from their packages. Root \`npm.cmd run typecheck\` ran all seven
workspace scripts. Focused player uses the existing optional Windows drive-probe
preload only; no runtime, codec, assertion or budget is replaced.

${validationTable}

The [validation receipt](question-topic-acceptance-batch1-validation-20261111.json)
retains exact commands, report hashes, failed titles/messages and durations.
The21 new player tests cover18 actual default admissions/completion of all 22
nodes, both610-meaning historical format3 saves, and one committed historical
admission journal. Different displayed patient names test real materialization.
They verify shuffled frozen choice order survives reopen, original FSRS IDs
score once, prior cards remain exact, unrelated new cards stay blank, and
completed saves reopen unchanged. No timeout was extended.

Full suites are not reported green. Acceptance-related failures in concurrent
topic sidecar tests still pin old counts/manifest/source hashes or assume no
topic question can be accepted. Those files belong to active workers and remain
untouched. They can use the new exact epoch helper; do not simply replace an
old capture. An early colon packet/code mismatch disappeared during its owner's
concurrent revision; final failures instead include a new surgical-infection
sidecar that captured the intermediate pre-name-template default. Existing
source guards, the older concept-coverage fixture and historical-load/evidence
mismatches are recorded separately. The 15 pending domain order tuples are a new deferred dependency
from this milestone. The unchanged separateCampaign codec-limit failure stays
with the save lane. See every final failed title below rather than inferring
that all failures are pre-existing.

- Clinical 12: four source guards already mismatch untouched runtime inputs at
  intake (app-appointments twice, codecJson and test-choice-orders); eight topic
  assertions need their owners' exact epoch integration for this acceptance.
- Domain 29: one Level5 input check plus 25 historical level 0–4/schema5–9 load
  hashes; one old concept fixture expects 587 versus 631 (23 omissions predate
  intake, 21 meanings are new here); one unchanged historical N2 supply test
  times out at its existing 10000ms limit; and one new order-inventory failure.
  The N2 author-stage pool is frozen independently of this default projection.
  Five balance/goal/retail assertions failed in the initial domain run and pass
  in the final repeat after concurrent owner edits; this lane did not fix them.
- Player 1: separateCampaign retains the same JSON-string codec-limit failure.
  All 29 new clinical/save tests and all other focused player tests pass.

${failures}

## Level5 bound inputs changed

Exact intersection with the unchanged canonical Level5 \`inputs\` map:

${l5}

All three already differed from recorded evidence before intake. The packet
also preserves the recorded hashes so earlier drift is not attributed to this
task. Manifest changes are outside that older map. New transitive inputs are
the accepted-data and accepted-wrapper modules; their exact hashes are in the
file receipt. No Level5 evidence, pin, result, release tree or rebind was edited.
Concurrent balance/domain changes have their own separate receipts.

## Files and next action

Nine existing clinical files changed:

${clinicalFiles}

New accepted snapshot/wrapper, acceptance epoch helper and 8-test suite, 21-test
player witness, intake/probe/build/check/receipt tools and documentation are
listed in the [file receipt](question-topic-acceptance-batch1-files-20261111.json).
No topic-worker source/packet/test, domain/balance runtime, cloud/session code,
evidence, save format or release-tree file was edited. The shared handoff is
append-only. Concurrent changes observed after intake are listed separately
in the packet and are not claimed as this worker's edits.

Manager next: install the 15 exact order records via the domain owner; arrange
strict historical-epoch updates with the topic-test owners; decide whether to
authorize the parked four-to-one consolidation and whether to obtain re-review
for the 17 mixed-case nodes. No unlisted companions or partial cases were accepted.
The one-shot intake/integration tools must not be rerun to refresh preimages.
Build/check and receipt tools are repeatable against the immutable intake.

This checkpoint is **working-tree only**. No Git, commit, push, install, network,
agent, deploy or rebind occurred. A later explicit **"push to GitHub"** request
is required for a manager-owned backup; this handoff makes no release claim.
`;
fs.writeFileSync('docs/research/question-topic-acceptance-batch1-20261111.md',lines);
console.log(JSON.stringify({runs:runs.map(({failures,...r})=>r),typechecks:validation.typechecks,lintTests:validation.lintTests}));
