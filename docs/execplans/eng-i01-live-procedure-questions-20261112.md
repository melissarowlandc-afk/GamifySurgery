# ENG-I01: live procedure questions

## Goal, lane and constraints

Implement the owner-approved declarative live ASC procedure route through the
existing founder consult mechanism. OR/endoscopy questions require a matching
actual, staffed procedure; hospital operations use clinic record reviews.
Children aged 5-17 additionally require Level 4 and a purchased accessible,
operational Pediatric Examination Room. Freeze child art, identity, one parent
and procedure family before service; retain consent/update/recovery continuity.

Domain lane: founder-consults, clinical eligibility, service admission/routing,
pediatric family movement and strict optional save readers, related tests.
Only optional backwards-compatible clinical schema additions are authorized;
no content, manifest, balance or progression edits. Keep player changes minimal.
Shared tree: preserve unrelated writers and perf/cloud work. No Git, install,
network, agents, deploy, release-worktree writes or evidence rebind.

## Testable contract

- A new case declares a versioned live context with a supported procedure family,
  active procedure phase, allowed service lines and required capabilities. A
  scheduled visitor freezes a matching supported family/context before arrival.
  Missing/incompatible family, room, capability, provider/nurse or phase means
  no question is offered; it does not hold or change the source's economics.
- New live cases cannot fall through automatic or explicit ordinary admission,
  including cases requiring unsupported result gates/executable services.
  ENG-I02 executed intra-procedure results remain out of scope.
- Existing charts, attention marker, currentUpdate/exhibits, founder attendance,
  answer/feedback/close lifecycle and exactly-once service settlement are reused.
  The admitted consult holds its source until answered/acknowledged and closed.
- Pediatric declared live contexts retain requiresParent and exact authored
  profile/art/family identity. Fresh scheduling/admission requires the real
  operational pediatric room and actual OR/endoscopy/recovery resources.
  Parent attends consent/updates, waits onsite during the procedure, reunites
  for recovery/departure, and never becomes another patient/learning/billing slot.
- Legacy clinic pediatric semantics, diagnostic exclusions, paired movement and
  clinic-only progression witness retain their meanings. Optional procedure
  metadata/flow is strict when present and absent from legacy states.
- Current default gameplay must be byte-exact. Preserve the accepted legacy
  procedural tuples through an explicit compatibility adapter; new tuples use
  the declarative contract. No RNG consumption, new state fields, altered supply
  or patient flow when the default has no declared contexts. Frozen encounters,
  FSRS and saved cross-links remain readable without mutation.

## Audit evidence (captured intake, before ENG-I01 edits)

Spec: docs/research/question-intraop-program-20261112.md:48-241 (R01-R10 and
PED-R01-R06). Current founder-consults.ts:15-28 uses a five-concept endoscopy
allowlist and broad adult OR classifier. Lines 71-89 match only current suite
kind and demographics. service-operations.ts:2339 chooses only adult presentation
ages and does not freeze procedure family. clinical-case-eligibility.ts:28-56
restricts children to clinic semantics; lines 80-83 require the real pediatric
room. pediatric-family.ts:335-394 reconciles legacy paired travel; persistence
readers enforce same-room family/source-kind invariants. Existing N4 and pediatric
tests are protected intent, not disposable expectations.

## Milestones and validation

1. Capture current source/test inputs, actual pacing CLI and complete native
   journey hashes/metrics before edits. Record current default metadata. No Git.
2. Add optional schema and operation family contract; declarative source matching
   and admission guards. Keep the exact accepted legacy behavior isolated.
3. Add narrow pediatric scheduling, family consent/update/wait/reunion flow and
   strict optional save validation. Expose frozen child identity in procedure
   presentation; do not edit unrelated renderer/perf code.
4. Synthetic integration tests: adult OR/endoscopy family matching and negatives,
   pediatric OR/endoscopy gate/resources/art/parent lifecycle, multi-node holds,
   once-only income, repeated reloads/access loss, legacy byte-preserving loads.
5. Compare complete native driver state/checkpoints with captured intake. Run
   full domain/player with npm.cmd and --pool=threads; seven typechecks,
   boundaries and actual content-pacing CLI. Classify known pins separately;
   do not rewrite evidence. Record exact results and scoped files here.

## Progress / completion

Intake captured under .local-dev/eng-i01-live-procedure-questions-20261112/:
2,101 source/test/presentation inputs. Current default is 1,407 cases / 1,109
registered meanings, clinical SHA
`4474bd1722eef6dc7b99d64dd21d4ddf5a907ec8a1dfe3ac4c20047f51d559d8`.
Baseline actual pacing CLI: first finish 26,312, closing 5,731,642 cents,
440 completions, zero walkouts, reference 26,281 (0.1179559% drift).
Full native journey: 35,236 commands, final tick 33,026, closing 6,829,124 cents,
550 completions, zero walkouts. Captured command stream, eight checkpoints,
reports and final serialized state hashes. Initial after capture matches every
field byte-exactly; the final-code capture/CLI also pass identically below.

Implemented optional `procedure-context.v1` case schema (`live` or `chart_review`),
`procedure-visit.v1` frozen source and `pediatric-procedure-flow.v1` optional family
extension. New families are selected from supported eligible presentations at
scheduling, independently of FSRS case reservation, with deterministic identity
hashes and no mutable RNG consumption. Legacy compatibility is limited to exact
23 pre-ENG-I01 nonclinic tuples (12 live, 11 ordinary/record routes). New tuples
need declarations; no clinical data/manifest/balance/progression is edited.

New live admission checks actual phase/suite, matching frozen family/profile,
capabilities, nurse/provider/recovery resources and child/parent context. New
unsupported live cases cannot fall through explicit/automatic clinic admission.
The existing held-source/current-update/answer/close lifecycle is reused. A
cancelled declared source retains its unanswered chart and parent onsite;
optional family-flow references pin the source until the family departs.
Legacy clinic paired movement, diagnostic exclusions and pediatric completion
witness remain intact.

Parents use a reachable non-care checkpoint in reserved Periop for consent,
procedure waiting and updates, then reunion/recovery/departure. No adult-companion
amenity policy is attached. Pediatric-gate removal closes fresh demand without
invalidating an already-admitted child. Save readers validate optional source and
family fields/cross-links, permitting separation only for this explicit flow.

Minimal presentation: new context in existing desktop/phone chart header;
child procedure visits opt out of baked adult occupied-room art and expose their
frozen child sprite with exam-table pose. FacilityScene has one opt-in service
visitor pose line; no renderer/perf refactor or asset/content edits.

- [x] Intake captured; actual before CLI and full native command/checkpoint/save
  hashes recorded.
- [x] Optional declaration, family scheduling/source checks and ordinary-admission
  guards implemented; no clinical, balance or progression changes.
- [x] Narrow pediatric semantics, one-parent flow, strict saved extensions and
  minimal child-art/context presentation implemented.
- [x] Final focused domain 143/143 (44 new plus 99 affected existing tests);
  affected player 12/12 including preparation/recovery child stills.
- [x] Full suites run and every failure classified. Owned test mistakes corrected
  and rechecked; remaining failures reproduced or matched intake baselines.
- [x] Final seven typechecks 7/7; boundaries pass with the complete checksummed
  read-only index inventory (22,539 paths), no Git process or guard edits.
- [x] Final native state/commands/checkpoints byte-exact; actual pacing CLI PASS
  at 26,312 with the unchanged round-2 reference/band. No rebind/evidence edit.

Engineering work is complete for manager review. Next actions belong to the
manager: inspect the scoped hunks, rerun desktop/phone browser checks, reconcile
the source-binding gate in the release tree and coordinate later content
integration. ENG-I02 is out of scope. No Git, network, agents or release writes.

## Implementation handoff

### Source contract and admission

`schema.ts:335-366` adds only an optional strict discriminated union. Omitted
metadata has no default and is not inserted into old frozen cases. The live
shape is:

```ts
procedureContext: {
  version: "procedure-context.v1",
  mode: "live",
  familyId: "procedure.groin_hernia_repair",
  kind: "operation", // or "endoscopy"
  phase: "procedure",
  allowedIncomeLineIds: ["income.ambulatory_operation"],
  requiredCapabilityIds: [],
  // A child additionally supplies the exact authored profile/family identity:
  // pediatricFamilyContext: {
  //   profileId, childName, childStillId, parentName, parentRelationship
  // }
}
```

This metadata is not a clinical indication, a demographic weight, a new question,
a duration, or a fee. Required setting, release point, stage, pediatric profile,
acuity and authored capabilities retain their independent checks.
`procedure-context.ts:12-29` recognizes these simulation families:

- OR: `procedure.laparoscopic_cholecystectomy`,
  `procedure.groin_hernia_repair`, `procedure.ventral_hernia_repair`,
  `procedure.soft_tissue_excision`, `procedure.umbilical_hernia_repair`,
  `procedure.orchiopexy`, `procedure.hydrocele_repair`,
  `procedure.circumcision`, `procedure.pilonidal_excision`.
- Endoscopy: `procedure.colonoscopy_polypectomy`, `procedure.egd`.

The declared line must belong to the existing OR/extended-OR or routine
endoscopy line group. The advanced line's existing EUS/ERCP route is not proof of
an EGD/colonoscopy family: new contexts cannot use that generic source. Its old
untagged behavior is retained by the compatibility adapter. Unsupported families (including ERCP,
thyroid/parathyroid and hospital operations) do not acquire a live route from a
room label. Extra declared equipment/capability IDs must actually be present;
the generic suite never grants frozen section, cholangiography, endocrine assay
or nerve-monitoring support.

`founder-consults.ts:48` schedules a unique eligible family/demographic
presentation using the existing deterministic identity hash. Repeating identical
question/profile rows does not weight that presentation. It reserves neither a
case nor a learning concept and consumes no mutable RNG. `service-operations.ts:2346`
freezes `procedure-visit.v1` before arrival. The subsequent existing
due/unseen/FSRS selector chooses a compatible case at the normal question clock.

`founder-consults.ts:78` additionally requires matching frozen family/kind/line,
actual in-service patient position inside the reserved operational suite, the
reserved procedure nurse, provider, recovery bed and peri-op staffing. Pediatric
sources also require their exact linked family/parent checkpoint. Wrong family,
phase, room, staff or capability offers no chart. Controls with an unavailable
family/capability compare the entire 450-tick serialized gameplay state (excluding
the test commands' differently named receipt keys) with the candidate removed:
identical timing, cash, one completion and one income receipt.

`reducer.ts:6109,9850` excludes new live/source-only cases from both automatic and
explicit ordinary admission. Null/missing family, unsupported families,
executable service choices or result gates cannot escape into clinic arrivals.
This milestone does not implement ENG-I02. Existing currentUpdate/exhibit,
attention marker, chart controls, founder standing position, held source phase,
feedback/close release and exactly-once service settlement are reused.

Hospital/record questions declare `mode: "chart_review"`, `familyId`,
`recordKind` (`operative_note`, `anesthesia_record` or `endoscopy_report`) and a
`recordCheckpoint`. They require clinic framing and observation-only choices;
they use ordinary clinic attendance without manufacturing a live operation.
Desktop and phone show the record/checkpoint in the existing patient-details
header. Current updates and exhibits already use both chart surfaces.

### Pediatric flow and saved state

`clinical-case-eligibility.ts:14-92` retains the actual Level 4/operational
Pediatric Examination Room gate and narrows the semantics exception to supported
declared live cases. A fake capability, ordinary exam room, disconnected or
outage room does not substitute. `release.l4.pediatrics`, requiresParent, exactly
one authored profile, exact name/parent/age/sex/still and supported ages 5-17 are
required. Ordinary clinic pediatric/record semantics keep their prior contract;
procedure-only children cannot become pediatric clinic handoffs or earn the
clinic-only progression witness.

One family/parent is created before arrival. `pediatric-procedure-flow.ts` places
the parent at a reachable non-care checkpoint in the real reserved Periop room
for consent, waits onsite for updates, and rejoins recovery/departure. Its chosen
spot avoids beds and the bed's adjacent care contacts. Public arrival travel
uses the existing visitor path; it does not try an indoor-only path from outside
the clinic. The existing `pediatric-family.v1` adds optional
`pediatric-procedure-flow.v1`, allowing declared procedure-phase separation
without weakening legacy clinic paired travel. No adult companion amenity or
retail contract, duplicate patient, learning slot or bill is created.

`service-operations.ts:1109,1376,1635` and the corresponding reducer/family hooks
apply this opt-in flow instead of clinic exam pairing. Preparation/recovery waits
for the parent checkpoint. Loss of the pediatric gate stops fresh child demand
while preserving admitted care. Sale/cancellation of the actual source suite
keeps an unanswered frozen chart and its parent onsite, releases its procedure
hold, and uses the existing encounter attendance route. A cancelled source stays
pinned by the active family (`retired-service-history.ts:185`) until departure.

`persistence.ts:145-295,1328` strictly validates the optional visit/family flow,
source/profile/parent/art cross-links, allowed phase separation and checkpoint
rooms. Absent fields stay absent. The main save schema version is unchanged.
Round-trip tests cover before preparation, consent, active separation, open
two-node consult, recovery, departure and source cancellation; malformed links,
art, flow versions, adult companion adoption and unmarked separation are rejected.
Existing source-consult satisfaction-clock normalization is asserted separately
in tests rather than mistaken for new migration behavior.

### Compatibility adapter

The intake contains 23 nonclinic-labelled tuples: 12 existing live cases
(four OR/eight endoscopy) and 11 ordinary/record routes. To satisfy the explicit
byte-exact-current-content requirement, `legacy-procedure-contexts.ts` preserves
only those captured case/setting/node/question-version/concept tuples. It is an
identity compatibility adapter, not an extensible concept allowlist. A future
question version with the same concept is not grandfathered. The old frames
flagged in R08 stay untouched for the clinical writers' exact-version review.
All new/revised live tuples must declare their source contract. Already-frozen
unsourced charts and FSRS records are not reclassified on load.

### Minimal player hook

`procedureContextPresentation.ts` adds optional source/family/parent or hospital
record details to the existing shared chart header. New child sources opt out
of baked adult occupied-room art (`viewModels.ts:2031`) and expose the frozen
child still with `exam-table` pose (`pediatricFamilyPresentation.ts:7`). The
service visitor type gains optional pose. `FacilityScene.ts` has exactly one
opt-in pose-expression change in `drawServiceVisitor`; no renderer/perf refactor,
asset, cloud/save UI, launcher or browser-origin change.

### Files owned by ENG-I01

Runtime domain/schema (13): schema.ts; procedure-context.ts (new);
legacy-procedure-contexts.ts (new); founder-consults.ts;
clinical-case-eligibility.ts; types.ts; service-operations.ts;
pediatric-family.ts; pediatric-procedure-flow.ts (new); procedure-companions.ts;
reducer.ts; persistence.ts; retired-service-history.ts. Paths are under
packages/game-domain/src except packages/clinical-content/src/schema.ts.

Tests (four): game-domain/tests/eng-i01-live-procedure.test.ts and its new fixture;
founder-consults.fixture.ts (declare a family for its existing mechanical OR
case/source); level-four-persistence.test.ts (keep its legacy clinic-kind fixture
explicitly exhaustive; new procedure kinds have separate strict tests).

Player (six): session/procedureContextPresentation.ts (new),
session/engI01ProcedurePresentation.test.ts (new), session/viewModels.ts,
session/pediatricFamilyPresentation.ts, facility/types.ts and
facility/FacilityScene.ts. This plan and an appended current-thread handoff are
the only durable documentation changes for this milestone.

Scoped preimages/hashes and unified hunks are in the private receipt directory:
`owned-files.json`, `owned.diff`, `intake-hashes.json`, `before/`. Intake hashes,
not later diagnostic snapshot discovery, determine whether a path is new.
No question-intraop/question-topic module, manifest, clinical prose,
balance/progression, diagnostic binding, evidence/results file or release tree
is edited by ENG-I01.

## Default-content CHECK: unchanged

The before/after source reader runs the ordinary native journey with captured
intake clinical/balance/fixture inputs. It reads checked-in TypeScript through
the existing source loader. It neither changes driver commands/answer policy
nor permits writes to canonical evidence. Only private observational receipts
are written. Every one of the 13 final runtime files is byte-identical to its
after snapshot (`native-comparison-final.json`). The actual public pacing CLI
was also run before and after without a modified loader or policy.

| Measure | Before ENG-I01 | Final ENG-I01 | Difference |
| --- | ---: | ---: | ---: |
| Pacing first finish | 26,312 | 26,312 | 0 |
| Pacing closing cents | 5,731,642 | 5,731,642 | 0 |
| Pacing completions / walkouts | 440 / 0 | 440 / 0 | 0 / 0 |
| Full native commands | 35,236 | 35,236 | 0 |
| Full native final tick | 33,026 | 33,026 | 0 |
| Full native closing cents | 6,829,124 | 6,829,124 | 0 |
| Full native completions / walkouts | 550 / 0 | 550 / 0 | 0 / 0 |

Actual `node tools/qa/content-pacing-check.mjs`: exit 0, reference 26,281,
band 23,653-28,909, drift +0.11795593774970303%. Both runs use 1,407 cases /
1,109 meanings and the same clinical SHA listed above. This is the default
captured for this milestone; no new intraop packet is accepted by this lane.
Node's experimental TypeScript-transform warning is informational.

Full native command stream SHA256:
`1f2583259c7ccb3a12cd6d07378a5e4f1959865cff426d7201f4072b24e83518`.
Final serialized state SHA256:
`59345223ec83673174d65be1adc3f0a2877b5c21f7b53a5e0da684622e6b3f87`.
Inspection reports SHA256:
`ed0c7c7b9b821e877cbf11ce9e8e8dbcd7be9e6fd4607895a5281b72c644ca8a`.
Each is identical before/after, so this comparison covers command identities,
cash, frozen encounters, learning histories and every serialized runtime field,
not merely aggregate finish totals.

All eight checkpoint byte hashes are also identical:

| Checkpoint | Tick before = after | SHA256 before = after |
| --- | ---: | --- |
| integration-l4 | 4,868 | `65a985fedac323d190d72dafb62d56d18c5da5e3596147e046f962f9e7d475a1` |
| integration-build | 4,868 | `f4e92153a86987a8feadc1b3f2bf446941ee32dfd6ab7b17b3367539285708b1` |
| integration-preparing | 23,255 | `8a6131f3d517e53e120f6b5cee5b6cd1a10184b001756a873d952a2ee2eccb3f` |
| integration-running | 23,392 | `1a8ed009b686290db2329d32bfe2db72ae52a3a60205362da78f8399dff82a7b` |
| integration-final | 26,311 | `e4277b4f1a5e86f8cb97eafa45934bb434eef90605bb4faec0eee91e6ad3c605` |
| integration-finish | 26,312 | `82e2389d0fcdb71e9afaf2702ba63c05a525e3f88f70b40cf6594f1097e1aad9` |
| integration-repeat-final | 29,968 | `2976b56cb0bfc5009bb22132d6ccc8b2dda48e9fba6c6327e6c533f28f65f557` |
| integration-repeat | 29,969 | `8037913edead5aa621d6073e61eeb5fe3de51cd8e3db1e1bb4b10a15f0f4ff06` |

### Level 5 binding inventory

Nine ENG-I01 files are directly listed in the retained results' `inputs`:

- packages/clinical-content/src/schema.ts
- packages/game-domain/src/clinical-case-eligibility.ts
- packages/game-domain/src/types.ts
- packages/game-domain/src/service-operations.ts
- packages/game-domain/src/pediatric-family.ts
- packages/game-domain/src/procedure-companions.ts
- packages/game-domain/src/reducer.ts
- packages/game-domain/src/persistence.ts
- packages/game-domain/src/retired-service-history.ts

Four additional changed runtime dependencies are transitive inputs:
founder-consults.ts (existing, not named in the retained direct list), plus new
procedure-context.ts, legacy-procedure-contexts.ts and pediatric-procedure-flow.ts.
These source bytes change while current-default behavior does not. The retained
results/checkpoints/legacy-capture hashes match intake exactly; no rebind or pin
edit was made. The manager owns source binding reconciliation in the release
tree even though the observational native replay is byte-exact.

## Validation receipts and failure classification

PowerShell, `npm.cmd`, `CI=1`, `--pool=threads --maxWorkers=2`. All logs are under
`.local-dev/eng-i01-live-procedure-questions-20261112/`. The player commands set
`NODE_OPTIONS=--require=C:/Users/rowla/Projects/GamifySurgery/.local-dev/restroom-reception-refill-20261104/validation-preload.cjs`.
That pre-existing process-local accommodation converts only a synchronous
sandbox EPERM from `net use` into the normal asynchronous error callback and
blocks Git before spawn; it does not replace game/cloud implementations or
assertions.

```text
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/eng-i01-live-procedure.test.ts tests/founder-procedure-consults.test.ts tests/n4-consult-integration.test.ts tests/pediatric-clinic-admission.test.ts tests/pediatric-family.test.ts tests/pediatric-identity.test.ts tests/level-four-persistence.test.ts
Test Files  7 passed (7)
Tests       143 passed (143)
Duration    29.66s
exit 0
log: domain-final-source.log

npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
Test Files  2 failed | 219 passed (221)
Tests       27 failed | 6025 passed | 1 skipped (6053)
Duration    1133.81s
exit 1
log: domain-full.log

npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
Test Files  5 failed | 445 passed (450)
Tests       9 failed | 5465 passed (5474)
Duration    1836.58s
exit 1
log: player-full.log

npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2 src/session/engI01ProcedurePresentation.test.ts src/session/founderProcedureConsults.test.ts src/session/founderConsultAttendance.test.ts src/session/pediatricFamilyPresentation.test.ts
Test Files  4 passed (4)
Tests       12 passed (12)
Duration    11.14s
exit 0
log: player-final-beds.log
```

The full domain run collected 39 new scenarios. Five more final guard/control
scenarios were added afterwards; the final focused run above includes all 44
new scenarios plus all 99 affected existing tests. Full-domain failures exactly
match the 27-failure intake baseline:

- One explicit admission concept census expects 587, receives 1,109.
- One Level 5 input binding test first stops on the existing employee-training
  source pin from the accepted cost lane.
- Twenty-five retained pre-M9 load hashes (Levels 0-4 by schemas 5-9) differ from
  their historical capture. These were already failing before ENG-I01. No
  capture, guard or pin was weakened; before/after native hashes above isolate
  this lane's absence of default gameplay changes.

The full player run cached two mistakes in the new presentation test before
their correction (`decisionSteps`/`answerChoices`, rather than nonexistent
properties). They are resolved, with the affected-test rerun above; no
production workaround was needed. Two additional child preparation/recovery
presentation scenarios were then added and pass in the final 12-test run. The
remaining seven player failures all
reproduce against the captured pre-ENG runtime, using a private Vite read-only
source loader (`intake-player.config.ts`), with the same current clinical data
and unchanged tests/config. No canonical source was temporarily swapped.

- Batch 3 accepted-array equality fails for
  `case.topic.esophagus-gerd-barrett-hiatal.hernia-anemia.v1`,
  `case.topic.bowel-ibd-malabsorption-short-bowel.crohn-surveillance-review.v2`
  and `case.topic.fluids-electrolytes-acid-base.current-corrected-gap.r2`.
  The first two now have revised current definitions; the third is retired from
  the current default. Each fails the equality assertion before admission.
- Batch 4 accepted-array equality fails for
  `case.topic.colorectal-polyps-cancer.persistent-rectal-wall-focus.v1` and
  `case.topic.anesthesia-analgesia-pharmacology.mh-testing-sequence-pass.v1`.
  These also compare historical exported rows with revised current definitions
  before admission. The complete two-file intake-runtime run reproduces exactly
  five failures / 1,005 passes / 1,010 tests in 425.91s.
- `topicRuntimeBindings.test.ts:35` iterates batch 3 timing metadata for the
  retired case, obtains undefined from the current release and accesses its
  decisionNodes. This is a historical-inventory/test-context mismatch, rather
  than an offered current testing choice losing its runtime estimate.
- `levelFourRoomsViewModels.test.ts:34` expects MRI $2,760; actual $3,040 reflects
  the already-accepted round-2 cost pass. Intake-runtime comparison reproduces
  one failure / two passes / three tests in 12.53s.

The targeted intake-runtime reproduction of the five equality failures plus
the timing-label failure reports six failures / 35 passes / 975 skipped / 1,016
tests in 23.17s (`player-failures-baseline-focused.log`). The broad two-file
comparison above additionally runs their actual frozen-save and journal tests;
no frozen-load/journal-completion regression appears. Historical clinical test
rows and the prior-lane price assertion were deliberately left untouched here.

Boundaries run the unchanged canonical command `npm.cmd run test:boundaries`.
Its normal Git inventory spawn was initially blocked by the sandbox before
Git ran. The final command sets NODE_OPTIONS to the private
`boundary-index-preload.cjs`, which supplies ONLY `git ls-files -z`'s inventory
from the read-only index. The inventory parser verifies DIRC v2, full entries,
no split index and the index SHA1 footer; the preload rechecks its SHA256 before
using 22,539 actual paths and rejects other Git requests. No Git process runs,
no production script/assertion changes, and no empty/partial inventory is used:

```text
npm.cmd run test:boundaries
Using verified read-only index inventory; no Git process invoked.
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
exit 0
log: boundaries-final-source.log
```

Seven-workspace `npm.cmd run typecheck` passed in `typecheck-final-all.log`.
An intermediate rerun after the EUS/ERCP guard observed 12
concurrent TS2339 diagnostics in the unowned
`question-intraop-suspicious-polyps-retrieval-and-tattoo-20261112.test.ts:263-282`
(`never`-typed author-response rows). No owned diagnostic is present; the writer's
file was not edited. The writer resolved those diagnostics; the final root
command `npm.cmd run typecheck` passes all seven workspaces, exit 0
(`typecheck-last.log`): clinical-context-workbench (client and server), player,
balance-config, clinical-authoring, clinical-content, clinical-research and
game-domain. Earlier missing-source/type-inference draft errors are also
resolved, with no owned production diagnostic.

## Remaining review / risks

- Manager reruns desktop/phone browser checks, including child stills on the
  empty OR/endoscopy table, one waiting parent in Periop, source/family header,
  current update and chart-close release. Headless view-model tests cover both
  suites, child/parent counts, still/pose, occupied-art suppression and existing
  actionable charts; browser raster review is not claimed.
- Existing chart answer availability still allows answers during founder travel,
  as specified in R04; no new physical-arrival lock was introduced.
- Fresh live authoring needs the exact contract above. Special equipment,
  hospital/ERCP families and executed results are not inferred from a setting
  label or prose; unsupported metadata is held. ENG-I02 is deferred.
- Optional saved extensions are strict and versioned. Old frozen identity/FSRS
  fields and absent extensions remain unchanged. The byte-exact proof covers
  the current default/public native journey; future accepted declared content
  will intentionally create new family-specific demand/consults and needs its
  own clinical acceptance, pacing and browser review.
- Historical catalog/census/price assertions and Level 5 source bindings need
  manager reconciliation in their respective lanes. No evidence rebind, Git,
  installs, network, agents, deploy or GS-release writes. This remains a local
  working-tree checkpoint; the manager owns the later GitHub backup gate.

## ENG-I01b - standard procedure-room equipment (2026-11-12)

Manager-approved policy: operational existing ambulatory OR/endoscopy rooms
include the standard equipment needed by eight skipped batch9 PASS nodes. No new
purchase, employee gate, menu, price, duration or economic change. Preserve current
default gameplay byte-for-byte and all ENG-I01 source/family/staff/room guards.
Add the authored `procedure.central_venous_port_insertion` OR family. ENG-I02 and
clinical/manifest acceptance stay out of scope; no question/prose edits.

Ownership for this follow-up: game-domain installed-capability derivation and
procedure-family registry, a small stage-aware integration-fixture improvement,
new domain integration tests, this appended section and current-thread handoff.
Shared sources/clinical writers are preserved; no Git/install/network/agents/
deploy, release writes or evidence rebind.

Intake is captured in `.local-dev/eng-i01b-20261112/before/` with 2,155 file hashes.
The default now includes accepted batch9 (1,421 cases / 1,126 meanings); compare
against this intake, not the older ENG-I01 bank. Actual before pacing CLI and
full native byte-hash capture are running before implementation.

Planned implementation:

- Derive OR equipment: existing `capability.fluoroscopy`, plus
  `capability.intraoperative_cholangiography` and
  `capability.transcystic_exploration`.
- Derive endoscopy equipment: `capability.endoscopic_closure`,
  `capability.endoscopic_rescue` and `capability.chromoendoscopy` (standard
  dye/virtual assessment equipment). These are simulation equipment bundles,
  not new clinical claims, exact clinical thresholds or executed test routes.
- Grant equipment only from accessible operational rooms. Preserve actual
  in-service source location, family, nurse/provider/recovery and case-specific
  capability checks; no question hold when admission fails.
- Explicitly import the eight skipped nodes' six whole authored cases for tests;
  add only test-context routine/declarative metadata. Check real procedure
  admission, all contained node identities, missing/wrong room/family/equipment,
  save round trips and once-only settlement/no-hold controls.
- Run focused and full domain/player thread suites, seven typechecks, boundaries,
  actual pacing CLI and native before/after command/checkpoint/save comparison.

Implementation and full-suite validation complete. Focused domain
73/73 passes (13 new ENG-I01b tests, 44 ENG-I01 and 16 batch9 integration tests).
Seven typechecks and boundaries pass. Actual before/after pacing and full native
command/checkpoint/save comparison are identical; full receipts follow below.

### ENG-I01b design and exact coverage

This manager decision supersedes ENG-I01's earlier statement that generic rooms
do not establish cholangiography/closure/chromo equipment. Other unsupported
families/equipment (for example endocrine assays and ERCP) retain their gates.
No clinical readiness or clinical approval is inferred from this simulation
policy.

`procedure-room-capabilities.ts` is a 15-line installed-equipment policy table.
`selectors.ts` adds its room's capabilities inside the existing operational-room
loop, after the same access/maintenance check as existing room equipment.
Fluoroscopy reuses the existing capability ID; the other five IDs are additive.
There are no saved flags, equipment purchases, new staff requirements, upgrade
requirements, menus, routes, durations or fees. Existing rooms in existing saves
receive this derived equipment immediately; no save migration is required.

`procedure-context.ts` adds exactly the authored family
`procedure.central_venous_port_insertion` to the OR set. It uses existing
ordinary/extended ambulatory-operation lines and the existing optional frozen
visit reader, with no format change. Actual room/phase/family, nurse/provider,
recovery and pediatric rules remain in force. An unavailable candidate imposes
no hold or economics change; valid admitted consults retain ENG-I01's existing
answer-and-chart-close hold.

All requested nodes are covered through real scheduled, staffed source operations
in `eng-i01b-procedure-equipment.test.ts`. Full node IDs retain the
`node.intraop.` prefix below; the test imports the exact four authoring modules
explicitly. The normalized test clone adds routine/declarative metadata only,
retains every original scored sibling and never enters the default release.

| Requested node suffix | Declared source family | Extra installed capability IDs |
| --- | --- | --- |
| asc-access.anterior-port-course.20261112.v1 | procedure.central_venous_port_insertion | capability.fluoroscopy |
| biliary-safety.major-injury-transfer.20261112.v1 | procedure.laparoscopic_cholecystectomy | capability.fluoroscopy; capability.intraoperative_cholangiography |
| biliary-safety.stone-clearance-route.20261112.v1 | procedure.laparoscopic_cholecystectomy | preceding two; capability.transcystic_exploration |
| biliary-safety.unexplained-bile.20261112.v1 | procedure.laparoscopic_cholecystectomy | capability.fluoroscopy; capability.intraoperative_cholangiography |
| endoscopic-perforation-and-injury.fresh-sigmoid-closure.v1 | procedure.colonoscopy_polypectomy | capability.endoscopic_closure; capability.endoscopic_rescue |
| endoscopic-perforation-and-injury.observed-esophageal-primary-closure.v1 | procedure.egd | capability.endoscopic_closure; capability.endoscopic_rescue |
| endoscopic-perforation-and-injury.postclip-tension-rescue.v1 | procedure.colonoscopy_polypectomy | capability.endoscopic_closure; capability.endoscopic_rescue |
| suspicious-polyps.deep-pattern-before-resection.20261112.v1 | procedure.colonoscopy_polypectomy | capability.chromoendoscopy |

The eight rows are six whole cases: port-course, new-bile (two nodes),
stone-clearance, sigmoid-defect-and-reassessment (two nodes),
dilation-observed-defect and new-descending-colon-focus. Every row verifies actual
source admission and frozen node/question/concept identities, ordinary-admission
rejection, missing/nonoperational source room, wrong family, missing nurse,
unknown extra capability, source/frozen-case reload and unchanged FSRS histories.
Two additional tests check absent/disconnected/outage room equipment; two
450-tick controls prove no rejected-candidate hold and identical full serialized
gameplay (apart from differently named test-command receipts), one completion
and one income receipt. A final test validates port-family saved-context round
trip and rejection on the endoscopy line.

The existing integration fixture now raises its test clinic to the authored
case's stage, so the new-bile case keeps its authored Level 4 minimum instead of
weakening it to fit a Level 3 OR fixture. A TypeScript union annotation was fixed
after the first typecheck; runtime behavior was unchanged by that correction.

These are engineering admission tests, not question acceptance or clinical
approval. In particular, the biliary sidecar's proposed executed IOC follow-on
still belongs to ENG-I02; this task neither manufactures its result nor changes
its null executable gates. The author/acceptance lane owns any remaining
sequence/context/timing acceptance before publication. The other skipped nodes
and whole-case review decisions are untouched.

### ENG-I01b replay and source gate

The actual unmodified pacing CLI passes before and after on the same default:
1,421 cases / 1,126 registered meanings, clinical SHA256
`3cca07abdb08699e4de7cb06715a830a5d170dd8558a1ba67e29231bd901d3f0`.

| Measurement | Before | After | Change |
| --- | ---: | ---: | ---: |
| Pacing first finish | 26,281 | 26,281 | 0 |
| Pacing closing cents | 5,887,602 | 5,887,602 | 0 |
| Pacing completions / walkouts | 440 / 0 | 440 / 0 | 0 / 0 |
| Full native commands | 35,207 | 35,207 | 0 |
| Full native final tick | 32,995 | 32,995 | 0 |
| Full native closing cents | 6,944,740 | 6,944,740 | 0 |
| Full native completions / walkouts | 549 / 0 | 549 / 0 | 0 / 0 |

Guard reference remains 26,281, band 23,653-28,909; drift 0%, exit 0. Native
measurement uses the original driver/answer policy and source loader, with
captured before inputs and only the three owned runtime files overlaid after.
Canonical writes are disabled. All final runtime bytes match the after inputs.
Command stream SHA256 is identical:
`2130b0b2d99f54d28e2de20dcbe266cf78bb45f73a14472ec468f60dc8ca9141`.
Final serialized save SHA256 is identical:
`f09b979987125502415b491c87b8ab933874dd718129d8aa798a4955f3e2a632`.
Inspection reports SHA256 is identical:
`a90fd43f7dcc8431c5287af7fb75e1bee8b52f230fe4ee990cc410b44ccdd0d9`.
All eight checkpoint byte hashes/ticks are identical (full digests in
`native-comparison.json`): 5,227; 5,227; 23,224; 23,361; 26,280; 26,281;
29,937; 29,938. Thus frozen encounters, FSRS, movement, timing, cash, command
identities and every serialized field at these checkpoints/final state match,
not just the finish aggregate.

Level 5 input changes for ENG-I01b only: `packages/game-domain/src/selectors.ts`
is directly recorded in the retained input list. Changed
`packages/game-domain/src/procedure-context.ts` and new
`packages/game-domain/src/procedure-room-capabilities.ts` are transitive runtime
dependencies. No other runtime file, balance/progression input, clinical content,
manifest, evidence/results/checkpoint or pacing reference is edited by this
lane. Retained evidence and all captured balance source hashes match intake.
Source hashes still need the manager's release binding review; no rebind here.

Scoped file/hunk receipts are `owned-files.json` and `owned.diff` under the private
ENG-I01b directory. Five source/test files changed: the three runtime paths above,
`packages/game-domain/tests/eng-i01-live-procedure.fixture.ts` (one line), and new
`packages/game-domain/tests/eng-i01b-procedure-equipment.test.ts`. There are no
player, schema, save-reader, clinical-content or question-prose edits.

### ENG-I01b validation

PowerShell, CI=1, npm.cmd and thread pool. Complete logs reside under
`.local-dev/eng-i01b-20261112/`.

```text
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/eng-i01b-procedure-equipment.test.ts tests/eng-i01-live-procedure.test.ts tests/question-program-batch9-integration.test.ts
Test Files  3 passed (3)
Tests       73 passed (73)
Duration    18.23s
exit 0
log: focused-domain.log

npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
Test Files  2 failed | 221 passed (223)
Tests       27 failed | 6076 passed | 1 skipped (6104)
Duration    904.28s
exit 1
log: domain-full.log
```

Exactly the batch9 intake baseline remains: one explicit 587-versus-1,126 concept
census, one retained source-binding check and 25 pre-M9 load/capture pins
(Levels 0-4 by schemas 5-9). The other 6,076 tests pass, including all 13 new
ENG-I01b tests and existing source/pediatric/save contracts. No historical
assertion/capture is changed. Full native replay above isolates unchanged
default outcomes despite the new source bytes.

`npm.cmd run typecheck`: all seven workspaces pass, exit 0
(`typecheck-final.log`): clinical-context-workbench client/server, player,
balance-config, clinical-authoring, clinical-content, clinical-research,
game-domain. The initial fixture Math.max-to-level-union diagnostic was corrected
with its schema-bounded fixture annotation; there are no remaining owned errors.
The final post-suite root rerun also passes all seven (`typecheck-handoff.log`,
exit 0), after preserving the concurrent authoring edits. A fresh default import
still matches the same 1,421-case clinical hash (`current-default-check.log`).

`npm.cmd run test:boundaries`: exit 0 (`boundaries.log`):

```text
Using verified read-only index inventory; no Git process invoked.
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
```

As in ENG-I01, NODE_OPTIONS requires the private checksummed-index preload for
this command. It verifies the captured index SHA256 and supplies the complete
actual inventory only to the unchanged guard's `git ls-files -z` request. It
does not spawn Git, change production scripts, provide an empty inventory or
remove assertions. Other Git requests are rejected.

Actual `node tools/qa/content-pacing-check.mjs`: exit 0 both before and after
(`pacing-before.log`, `pacing-after.log`); exact numbers in the table above.
`native-capture.mjs --phase=before/after`: exit 0 both; `native-comparison.json`
asserts every captured field and all three final runtime source hashes match.
The Node experimental-transform warning is informational.

Full player passes. Its command uses the same process-local sandbox preload
documented in ENG-I01, with no application implementation/assertion replacement:

```text
npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
Test Files  455 passed (455)
Tests       5520 passed (5520)
Duration    1507.32s
exit 0
log: player-full.log
```

### ENG-I01b handoff / remaining work

Engineering complete. No new domain failure, no player failure and no changed
default replay byte. The current-thread handoff links this section; private
`validation-summary.json`, `owned.diff`, `owned-files.json` and
`native-comparison.json` retain the scoped receipts. Concurrent clinical author
source/test changes are observed separately and preserved, not folded into this
lane. No implementation or test guard outside the five owned source/test files
is changed here.

The manager/acceptance lane can now reference the six capability IDs and authored
port family above when integrating the eight requested node versions. This
task has not accepted/published them or modified their clinical bodies, timing
rows or review status. Executed IOC follow-on remains ENG-I02; source admission
does not generate a real executed result. Browser/clinical review and release
source-binding reconciliation remain manager responsibilities. No new
presentation work, purchase, menu, balance change, save format, origin/pathway,
Git/install/network/agent/deploy/rebind or GS-release write. Local checkpoint
only; manager owns the GitHub backup/release gate.

## ENG-I01c - EUA and endocrine procedure families (2026-11-13)

Goal: enable admission of the three exact cases withheld in batch10's "Skipped
node" table through the existing equipped, operational ambulatory OR. Preserve
ENG-I01 source/family/staff/save semantics and byte-exact current-default replay.
No new purchase, staffing/level gate, menu, duration, fee or other economics.

The table and reviewed case make a distinction omitted by the brief's shorthand:
gland-preservation-salvage declares `procedure.thyroidectomy` and describes total
thyroidectomy, while missing-gland-salvage declares `procedure.parathyroidectomy`.
To satisfy the explicit three-case goal without relabeling clinical content,
this lane preserves and supports all three exact authored families:

- `procedure.anorectal_eua`: Crohn EUA/fistula checkpoint salvage.
- `procedure.parathyroidectomy`: missing-gland salvage.
- `procedure.thyroidectomy`: gland-preservation salvage.

The endocrine proposals specify `capability.endocrine_surgery`,
`capability.intraoperative_pth`, `capability.intraoperative_ultrasound` and
`capability.intraoperative_frozen_pathology`. Following the approved properly
equipped OR policy, provide these as standard operational OR capability bundles
through ENG-I01b's existing table, with the existing actual reserved team. EUA's
proposal has no additional capability IDs; its standard instruments are part
of the supported family. These are simulation assumptions, not clinical claims.

Owned: procedure-context.ts, procedure-room-capabilities.ts, a new focused domain
test and this appended handoff/current-thread pointer. No clinical/schema,
manifest, question, balance/progression, source-reader, player or release-tree
edits. No Git/install/network/agents/deploy/rebind. Preserve concurrent work.

Acceptance: explicitly import the exact three standalone salvage cases, preserving
all node/question/concept identities and review status; verify matching real
staffed in-service OR admission, missing/wrong family/room/staff/capability
rejection, no ordinary fallback, source/frozen-case/FSRS reload, saved family
compatibility and no rejected-candidate hold/income change. Keep actual source
consult answer/close semantics intact. No new executed test/result machinery.

Intake captured in `.local-dev/eng-i01c-20261113/`: 2,163 input files, including
the accepted batch10 default (1,432 cases / 1,138 meanings). Actual before pacing
CLI and full native hashes are running against this intake. After implementation:
focused/full domain and full player thread suites, seven typechecks, boundaries,
actual pacing CLI and complete native command/checkpoint/save comparison.

Progress: implementation complete. Focused domain 84/84 passes (12 new ENG-I01c,
13 ENG-I01b, 44 ENG-I01 and 15 accepted-batch10 integration tests). Seven
typechecks and boundaries pass. Actual pacing before/after matches exactly at
26,377 ticks, 5,913,995 cents, 442 completions and zero walkouts. Final native
capture/source hash comparison is byte-exact and complete. Full domain finishes
with 6,116 passes, the 27 intake baseline failures and one existing skip. Full
player passes all 5,543 tests. All required validation is complete; the scoped
receipt and current-thread handoff identify manager review/release follow-up.

### ENG-I01c implementation and case evidence

Production hunks are one family-list line in `procedure-context.ts` and four
capability IDs plus a comment in `procedure-room-capabilities.ts`. The existing
selector already derives these only from an accessible, operational placed OR;
there is no selector, service/reservation, balance, progression or persistence
change. The ordinary/extended OR income lines, existing provider/OR nurse/
Periop requirements and strict optional saved visit format are reused.

| Exact reviewed case | Exact family | Proposed extra capabilities supplied by standard OR |
| --- | --- | --- |
| case.intraop.anorectal-eua.crohn-checkpoints.20261112-salvage.v1 | procedure.anorectal_eua | No extra IDs in the authored proposal; standard EUA/fistula instruments/team |
| case.intraop.parathyroid.missing-gland-salvage.v1 | procedure.parathyroidectomy | capability.endocrine_surgery; capability.intraoperative_pth; capability.intraoperative_ultrasound |
| case.intraop.parathyroid.gland-preservation-salvage.v1 | procedure.thyroidectomy | capability.endocrine_surgery; capability.intraoperative_frozen_pathology |

`eng-i01c-procedure-families.test.ts` explicitly imports the exact standalone
salvage exports from the two authoring modules. Test activation adds routine/
declarative context metadata only, including every authored proposed capability.
It retains whole cases and all scored node/question/concept identities, source
prose, review status and authored stage. No case is accepted into the manifest
or default supply by this task.

Each case reaches a real staffed in-service OR source before admission. Tests
reject ordinary unsourced admission, missing/wrong/outage room, wrong family
(including thyroidectomy-versus-parathyroidectomy), wrong phase, missing nurse/
provider and an unavailable additional capability. Source, frozen question and
FSRS state survive reload. Three equipment tests reject absent, disconnected
and out-of-service ORs; three 450-tick controls compare whole serialized
gameplay against the same run without the unavailable candidate (excluding the
test commands' differently named receipt keys), with identical timing/cash,
one completion and one income receipt. Three saved-context tests accept the
new families on the OR line and reject the endoscopy line.

The new capabilities are deliberately scoped: intraoperative ultrasound does
not grant an outpatient ultrasound room, and intraoperative frozen pathology
does not add a laboratory or pathology-result route. The selected endocrine
team and equipment are simulation policy under the manager's approval; no new
credentialing/training gate, procedure duration or exact clinical rule is added.
The reviewed cases are single observation checkpoints with completed antecedent
findings and null executed gates. No new PTH/ultrasound/frozen-section result is
generated. Existing admitted-consult answer/close holds remain intact; an
unavailable candidate adds no hold or economic effect.

The thyroidectomy distinction is intentional, evidenced by both the batch10
table and the reviewed case's total-thyroidectomy presentation. It is not an
alias or a clinical wording correction. All three cases remain withheld from
the default until their separate acceptance/timing/clinical review work.

### ENG-I01c default-content replay proof

Current batch10 context: 1,432 cases / 1,138 registered meanings, SHA256
`ae1c880a6997bbd93b497bfb19fb7b19500ad54010fcce980ede60e358bb9280`.
Both actual unmodified `node tools/qa/content-pacing-check.mjs` invocations pass,
exit 0, with the same reference 26,281 and band 23,653-28,909. Its +0.3652829%
reference drift is already present before ENG-I01c; this lane adds zero drift.

| Measurement | Before ENG-I01c | After ENG-I01c | Difference |
| --- | ---: | ---: | ---: |
| Pacing first finish | 26,377 | 26,377 | 0 |
| Pacing closing cents | 5,913,995 | 5,913,995 | 0 |
| Pacing completions / walkouts | 442 / 0 | 442 / 0 | 0 / 0 |
| Native commands | 35,342 | 35,342 | 0 |
| Native final tick | 33,091 | 33,091 | 0 |
| Native closing cents | 6,966,492 | 6,966,492 | 0 |
| Native completions / walkouts | 551 / 0 | 551 / 0 | 0 / 0 |

The native before/after observational harness uses the original journey/answer
policy, captured intake data and only the two changed runtime files overlaid
after. It forbids canonical writes and captures exact command bytes, serialized
states and reports. Every final runtime source hash matches the after input;
all comparison fields are identical (`native-comparison.json`).

- Command stream SHA256:
  `43b445231a9fb51c6847e425043d434c15ef4985931e949869320dc05362b2a3`.
- Final serialized save SHA256:
  `f94dd7369edc7d9eaefc1e7c3c0adc3034a6e454b423c4198ba00316ad473608`.
- Reports SHA256:
  `d514699938bd01e3b916131bfdc833ed4763f2c7ec323db8b64e46cc5bbeb0ef`.
- All eight checkpoint byte hashes/ticks match: 5,227; 5,227; 23,320; 23,457;
  26,376; 26,377; 30,033; 30,034. Full digests are retained in the comparison
  receipt. Frozen cases, FSRS and all serialized fields at these states match.

No evidence/results/checkpoint or pacing reference is rewritten. The changed
Level 5 runtime inputs are exactly procedure-context.ts and
procedure-room-capabilities.ts under packages/game-domain/src; their exact
hashes/hunks are in `owned-files.json`/`owned.diff`. The manager owns later
release source-binding reconciliation, even though current default outcomes
are identical. The only other source/test path is the new
eng-i01c-procedure-families.test.ts. No player or fixture edit was needed.

### ENG-I01c validation receipts

PowerShell, `CI=1`, npm.cmd and `--pool=threads --maxWorkers=2`; private logs
under `.local-dev/eng-i01c-20261113/` retain complete native output.

```text
npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2 tests/eng-i01c-procedure-families.test.ts tests/eng-i01b-procedure-equipment.test.ts tests/eng-i01-live-procedure.test.ts tests/question-program-batch10-integration.test.ts
Test Files  4 passed (4)
Tests       84 passed (84)
Duration    22.65s
exit 0
log: focused-domain.log

npm.cmd test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=2
Test Files  2 failed | 223 passed (225)
Tests       27 failed | 6116 passed | 1 skipped (6144)
Duration    915.45s
exit 1
log: domain-full.log
```

All 27 domain failures match the batch10 intake baseline: explicit 587-versus-
1,138 concept census (one), retained source binding (one), and historical pre-M9
load/capture pins across five levels and five schemas (25). No new domain
failure and no change to a protected assertion, capture, budget or pin.

`npm.cmd run typecheck`: 7/7 workspaces, exit 0 (`typecheck.log`): clinical-
context-workbench client/server, player, balance-config, clinical-authoring,
clinical-content, clinical-research, game-domain. There was no owned type error.

`npm.cmd run test:boundaries`: exit 0 (`boundaries.log`):

```text
Using verified read-only index inventory; no Git process invoked.
Verified runtime dependency boundaries and 22539 tracked path(s).
Verified launcher health contract gamify-surgery-player protocol 1.
```

As documented for ENG-I01/b, the process-local NODE_OPTIONS preload verifies the
actual index checksum and supplies its complete filesystem-read inventory only
to the unchanged boundary script's `git ls-files -z` request; it never spawns
Git or replaces/removes production assertions. Player uses the existing sandbox
`net use` error-callback preload, also without application/assertion changes.
No Git, install, network, agents or deployment command is run.

Both actual pacing CLI runs and both native full-journey captures exit 0.
The Node experimental TypeScript-transform warning is informational. Current
scope is three source/test files; `owned-files.json` and `owned.diff` isolate
these hunks from all existing unrelated work. Clinical and balance source,
manifest, evidence/results/checkpoints, save/cloud and player files are untouched.

```text
npm.cmd test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=2
Test Files  456 passed (456)
Tests       5543 passed (5543)
Duration    1435.16s
exit 0
log: player-full.log
```

A fresh default import after the suites matches the same 1,432-case clinical
hash (`current-default-check.log`, exit 0). Both modified runtime files are
transitive dependencies not named in the retained old direct input list;
their source bytes changed, while all replay bytes above did not. No directly
recorded runtime input was edited in ENG-I01c. All captured balance source and
retained evidence/results/checkpoint hashes remain exact.

### ENG-I01c handoff / remaining work

Engineering complete for all three exact cases. The interpretation of the
brief's shorthand is recorded above: the table and source require thyroidectomy
for gland-preservation, so all three distinct authored families are supported;
none is aliased or relabeled. No clinical content or default acceptance changed.
The manager/acceptance lane still owns their manifest/projection/timing and
clinical disposition before publication, plus browser review and release source
binding reconciliation. No new presentation work is needed for these adult OR
families. Existing current-update, founder attendance and answer/chart-close
flow is reused.

Final receipts: `.local-dev/eng-i01c-20261113/owned.diff`, `owned-files.json`,
`validation-summary.json`, `native-comparison.json`, intake hashes/preimages and
full logs. Source ownership is limited to the two policy files and new test
listed above; this appended section and current-thread handoff are the durable
documentation changes. No Git, install, network, agents, deploy, rebind,
GS-release, balance/progression, save/cloud, UI or pathway/origin change. Local
working-tree checkpoint only; manager owns backup and release.
