# Owner requests batch — 2026-10-08

Owner message to the Claude manager thread, 2026-10-08. Decisions recorded here
are owner direction; implementation is delegated to Codex Sol workers with the
lanes below. Manager reviews each diff and checks the result in a QA origin.

## Decisions and requests
1. Seated layering. Patients seated facing south on endoscopy beds draw their
   legs behind the bed; anyone seated south on a bed draws entirely on top of
   it. Adults in east/west-facing armchairs draw fully in front of the chair;
   they should sit on the chair, behind its front armrest. Audit every east- and
   west-facing chair and bench in the game.
2. Chart placement. When the chart is smaller than the desk, pin it to the top
   middle of the desk; when it is larger, keep the current pinning.
3. Stats/ethics questions: owner says they look much better (accepted).
   Pending from the GS-028 brief: render `exhibit`, `teachingPoint` and
   per-choice `rationale` in the chart.
4. Pediatric Waiting Room mockup: approved overall, with revisions: fix the
   west-facing armchair layering; only children under 10 use kid stools (older
   children use the room's ordinary chairs); add more adult chairs and more
   kid stools; make the toy chest and book bin larger, toy chest facing east and
   book bin facing west. Future pediatric rooms keep the parent in the same room
   as the child at all times, with a designed parent spot.
5. Guidance tips proposal: owner approved (already implemented as M3).
6. Tutorial redesign: owner said yes to all five decisions in
   `docs/design/tutorial-revamp-proposal.md` section 6.
7. Level 3 goals: the secondary objective "Complete the first administrative
   quality review" crowds out the main goals. Show it within (or attached to)
   the Advance button area instead, keeping the main goals readable.
8. Bug: two GLP-1 NPs cannot train ("an operational, reachable training room
   is required") while everyone else can, even after adding doors.
9. Companions and waiting:
   - Patients stand in one Waiting Room instead of using another Waiting Room
     with free seats.
   - Companions only for endoscopy, surgery and pediatric patients; remove
     them for everyone else.
   - Procedure companions: during pre-op they sit in the peri-op room near the
     patient; during the procedure they may leave for an amenity (bathroom,
     coffee, vending, garden, gift shop, whatever exists); when the procedure is
     done they return to peri-op and wait until the patient leaves PACU.
   - Peri-op gets armchairs in its corners facing into the room: two per
     corner, eight total, each hidden when a door occupies its spot; a
     companion without a free chair stands in peri-op until one opens.
   - Pediatric patients: the parent stays in the same room as the child at all
     times (rooms will be designed with a parent spot).

## Workers and lanes
| Worker | Scope | Lane (files) |
| --- | --- | --- |
| layering | 1 | facility rendering/layering: `apps/player/src/facility/**` presentation and draw order, furniture overlay data; no domain |
| chart-goals | 2, 3 (chart rendering), 7 | `ChartPanel.tsx`, `ui/chartSheet.css`, chart view models/types, `GoalsPanel.tsx` and its styles |
| tutorial | 6 | tutorial/opening/help files and session tutorial state per the proposal's milestones |
| training | 8 | `packages/game-domain` training eligibility/reachability and tests |
| companions | 9 | `packages/game-domain` companion, waiting allocation and peri-op seating logic, balance room layouts; rendering needs reported to manager (no FacilityScene edits until the layering worker finishes) |
| pediatric | 4 | `tools/room-design/level-4/pediatric-waiting/**` (resume of the existing mockup worker) |

Shared files (`AppShell.tsx`, `global.css`, `reducer.ts`) take minimal exact
edits only; each worker re-reads before editing and never reverts others.

## Progress
- 2026-10-08: plan recorded; workers launched.
- 2026-10-08: launched: layering 01a11b8d-77b4-7412, chart-goals 01a11b8d-77b3-7f53, tutorial 01a11b8d-77a1-7a43, training 01a11b8d-77b3-7f50, companions 01a11b8d-77b4-7a81, pediatric resume 01a1191c-6ec1-7063.
- 2026-10-08: owner request: radiologists earn per in-house read and do paid outside reads when idle; Sol worker launched (rad-income).

## Radiologist read income

### Step 1: baseline traced before implementation (2026-10-08)

Current diagnostic plans create an interpretation phase after imaging acquisition.
An assigned radiologist walks to a fixed Reading Room station, then the service
engine completes the read. New Reading work freezes base 5 minutes multiplied
by the radiologist category training factor and the accepted room's upgrade
factor, with a 1-minute minimum. Exact fractional completions and continuous
same-station handoffs are already supported. Each room has four stable stations.
Training, other duties, walking and inaccessible rooms prevent execution.

Diagnostic processing is currently marked `billing: none`, has `quoteFee: 0`,
and is excluded from the credit hook. Acquisition receives the entire imaging
fee through one service-operation receipt. Thus there is no distinct diagnostic
read income today. The separate manual `income.image_read` queue is $40 for
30 minutes, with category training but no new Reading upgrade timing; it is a
legacy contract and will remain compatible. There is no automatic outside work.

| Existing economy item | Current value |
| --- | --- |
| Ultrasound / X-ray / CT / MRI fee | $120 / $90 / $180 / $240 |
| Diagnostic local interpretation baseline | 5 game minutes |
| Legacy manual image-read fee / duration | $40 / 30 game minutes |
| Radiologist hiring / default salary | $300 / $26 per game hour |
| Radiologist adjustable hourly salary | $20-$42, $2 steps |
| Reading Room construction / hourly upkeep | $1,800 / $24 |
| Reading Room Level 2-5 purchases | $450 / $675 / $990 / $1,350 |
| Reading upgrade reductions at Levels 2-5 | 10% / 20% / 30% / 40% |
| Radiologist training reductions at Levels 2-5 | 10% / 20% / 30% / 40% |
| Radiologist training prices at Levels 2-5 | $75 / $150 / $225 / $300 |

Implementation decision: reserve $5 of a newly accepted imaging bundle for each
local diagnostic interpretation; acquisition receives the remaining fee and the
read pays the reserved portion at completion. This changes payment timing, not
the bundle's total. Older already-accepted bundles retain their old payment
contract and do not acquire retroactive read income. Outside-read defaults are
$5 per 5 game minutes: 12 reads/hour x $5 = $60/hour; one untrained reader in a
base room nets $60 - $26 - $24 = $10/hour while fully busy. Four fully busy
readers net $240 - $104 - $24 = $112/hour. These are tunable gameplay economy
values, not clinical billing or turnaround claims. No sources or clinical prose
will be changed. The canonical launcher/origin remains unchanged.

### Implementation and validation

In progress. Owned lane: reading/radiologist modules, read payment hook,
balance-config values, Services presentation/view model, and focused tests.
Shared reducer/types/persistence edits will be narrow and re-read before changes.

## chart-goals Sol worker handoff - 2026-10-08

Worker: chart-goals, thread `01a11b8d-77b3-7f53`, items 2, 3 (chart rendering),
and 7. Implementation is complete locally; manager diff/browser acceptance and
aggregate-suite reconciliation remain. No Git, installs, dependency edits,
clinical-content edits, browser execution, owner-save changes, agents, or
external messages. The manager retains `CURRENT_THREAD_HANDOFF.md` and the
reviewed GitHub-checkpoint reminder.

### What the quality-review objective means

`secondary.level_three_first_qi_review` is an optional Level 3+ objective.
`session/viewModels.ts` marks it complete when
`getLevelThreeSupportStatus(state).completedQiReviewCount > 0` (display capped
at 1/1). It is separate from the primary progression requirements and does not
change `canLevelUp` or `prototypeComplete`.

In plain terms: finish one automatic administrative review of an ambulatory
operation. `packages/game-domain/src/level-three-support.ts` queues a review
for each unreviewed `income.ambulatory_operation` or
`income.ambulatory_operation_extended` receipt. An idle hired **Surgeon** with
no care demand performs it in their reachable, operational **Surgeon Office**.
The founder completing an operation does not alone complete this optional
review. It is not an Administrative Assistant task. This worker's early
commentary named the wrong role; the source investigation corrected that.
No review scheduling or progression rules were changed.

### Files changed

All source/test files are in `apps/player`:

- `src/ui/ChartPanel.tsx`: natural-content placement, content/size observers,
  three exhibit renderers, teaching-point-first feedback, selected-answer
  rationale, and native per-choice rationale reveals after Show all choices.
- `src/ui/chartSheet.css`: scoped exhibit/table/key/value/abstract and rationale
  styling using the existing read/pixel font tokens.
- `src/ui/types.ts`: optional structured chart/discussion/choice fields; the
  exhibit uses the existing `CaseExhibit` type without a competing schema.
- `src/session/viewModels.ts`: frozen node exhibits reach chart/discussion
  views; teaching points and choice rationales reach feedback only after an
  answer exists. Existing pending-label/timing/progression logic is unchanged.
- `src/ui/EmployeeDiscussionPanel.tsx`: two exact adapter additions carrying
  the exhibit and answered teaching point onto the shared chart sheet.
- `src/ui/GoalsPanel.tsx`: one main goal list plus a compact optional quality
  review chip in the Advance/completion area; full label on hover/focus.
- `src/ui/goalsPanel.css` (new): compact footer/chip and focus/hover tooltip.
- `src/ui/GoalsPanel.test.tsx`: compact secondary objective, keyboard tooltip
  association, non-gating Advance, completion, and earlier-level behavior.
- `src/ui/chartPlacement.test.ts` (new): short/tall/equal-height pinning,
  narrow-desk horizontal behavior, edge clamping, and content growth/collapse.
- `src/ui/chartStructuredFeedback.test.tsx` (new): all exhibit shapes, story
  placement, visited-node labels, correct/wrong/legacy/past feedback, discussion
  adapter, and all-choice rationale reveals.
- `src/session/chartStructuredFields.test.tsx` (new): actual frozen GS-028
  patient cases through admission/submission/projection, plus all three frozen
  discussion exhibit kinds and legacy-field omissions; no pre-answer leakage.
- This handoff append.

`AppShell.tsx`, `global.css`, `reducer.ts`, clinical source files and other
workers' lanes were not edited. Existing `ChartPanel.test.tsx` is unchanged.
A no-Git baseline comparison of the seven changed existing files was reviewed;
receipt: `%TEMP%/gs-chart-goals-20261008/chart-goals-scoped-review.diff`.
The four new files were reviewed directly and exercised by the focused tests.

### Presentation decisions

- Desktop natural height includes header, full scroll content, and sheet
  borders. Strictly shorter than the desk uses its top center, clamped to the
  play-area edges. Equal/taller content retains the previous width, left-edge
  preference, bottom pin, and maximum-height calculations. No fixed height or
  pause behavior was added. Content resizing, native details expansion,
  front/back replacement and window/desk changes recalculate placement.
- Exhibits are labelled **Teaching dataset** in the story column. Table
  captions and row/column headers are semantic; the table region can scroll
  horizontally and take keyboard focus on narrow screens. Key/value fields
  use a definition list; abstract fields use their authored title/body.
  Visited nodes' exhibits remain available with their decision headings when
  the encounter has multiple visible steps; locked/unseen nodes are withheld.
- Feedback shows `teachingPoint` first, then the selected choice's rationale.
  Wrong picks use **Why not your pick**; correct picks use **Why this answer**.
  `feedbackBody`/saved `explanation` remains the fallback when the teaching
  point is absent. Show all choices exposes a closed **Why this choice**
  details control beneath each choice that has a rationale. Unselected
  rationale prose stays at full opacity for readability.
- The optional review chip reads **Optional: Quality review 0/1** (or 1/1 with
  a completion mark). Its full original objective text is in a described,
  hover/focus tooltip. It consumes one compact line rather than a second goal
  section/list. Level 3 currently has no implemented Advance to Level 4
  action, so this same footer holds the chip before main completion and the
  existing prototype-completion notice afterward. No new disabled Advance
  control or progression requirement was introduced.

### Exact validation

Default player-config startup failed before any test ran:

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/ui/chartPlacement.test.ts src/ui/chartStructuredFeedback.test.tsx src/ui/ChartPanel.test.tsx src/ui/EmployeeDiscussionPanel.test.tsx src/ui/GoalsPanel.test.tsx src/session/chartStructuredFields.test.tsx src/session/chartFeedbackPresentation.test.tsx src/session/employeeDiscussionView.test.tsx src/session/level3GoalsViewModels.test.ts src/session/level3ControlsViewModels.test.ts --pool=threads --maxWorkers=1 --reporter=default --reporter=json --outputFile="$env:TEMP/gs-chart-goals-focused-20261008.json"
failed to load config from apps/player/vite.config.ts
[plugin externalize-deps] Error: spawn EPERM
at optimizeSafeRealPathSync ... exec("net use", ...)
Exit 1 (startup only)
```

A temporary native-loaded config avoids Vite's optional Windows drive-mapping
subprocess by setting `resolve.preserveSymlinks: true`. It keeps both player
plugins (React and the private-module guard), changes no repository config or
dependency, and grants no new permissions. File:
`C:/Users/rowla/AppData/Local/Temp/gs-chart-goals-tests-20261008.mjs`:

```js
import react from "file:///C:/Users/rowla/Projects/GamifySurgery/node_modules/@vitejs/plugin-react/dist/index.js";
import { forbidPrivateModules } from "file:///C:/Users/rowla/Projects/GamifySurgery/scripts/vite/forbid-private-modules.ts";
export default {
  plugins: [react(), forbidPrivateModules()],
  resolve: { preserveSymlinks: true },
};
```

Successful focused run, then the FULL suite of the only edited package:

```text
npm.cmd run test --workspace @gamify-surgery/player -- src/ui/chartPlacement.test.ts src/ui/chartStructuredFeedback.test.tsx src/ui/ChartPanel.test.tsx src/ui/EmployeeDiscussionPanel.test.tsx src/ui/GoalsPanel.test.tsx src/session/chartStructuredFields.test.tsx src/session/chartFeedbackPresentation.test.tsx src/session/employeeDiscussionView.test.tsx src/session/level3GoalsViewModels.test.ts src/session/level3ControlsViewModels.test.ts --pool=threads --maxWorkers=1 --config "$env:TEMP/gs-chart-goals-tests-20261008.mjs" --configLoader native --reporter=default --reporter=json --outputFile="$env:TEMP/gs-chart-goals-focused-20261008.json"
 Test Files  10 passed (10)
      Tests  57 passed (57)
   Start at  08:58:48
   Duration  8.76s (transform 1.92s, setup 0ms, import 4.86s, tests 2.90s, environment 1ms)
Exit 0

npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 --config "$env:TEMP/gs-chart-goals-tests-20261008.mjs" --configLoader native --reporter=default --reporter=json --outputFile="$env:TEMP/gs-chart-goals-player-full-20261008.json"
 Test Files  5 failed | 119 passed (124)
      Tests  11 failed | 951 passed (962)
   Start at  08:59:35
   Duration  41.30s (transform 2.71s, setup 0ms, import 22.07s, tests 9.06s, environment 7ms)
Exit 1

npm.cmd run typecheck
> gamify-surgery@0.0.1 typecheck
> npm run typecheck --workspaces --if-present
> @gamify-surgery/clinical-context-workbench@0.0.1 typecheck
> tsc --noEmit -p tsconfig.client.json && tsc --noEmit -p tsconfig.server.json
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/balance-config@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-authoring@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/clinical-research@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
> @gamify-surgery/game-domain@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
Exit 0 (final run; all eight workspace typeconfigs passed)
```

Earlier typecheck runs caught `procedure-companions.ts(109,55): TS18048:
state.patientAmenityTrips is possibly undefined` while that concurrent lane was
in progress. The companion worker subsequently added optional chaining; the
final full typecheck above passed. This worker did not alter that module.

Full-player failures at the snapshot above (all owned tests passed):

- Layering lane, `src/facility/approvedRoomPresentation.test.ts:405`: care
  facing assertion, expected false to be true (one failure).
- Layering lane, `src/facility/approvedSideChairLayers.test.ts:18,52,74,90`:
  mask/seat catalog comparison; an unsplit-seat assertion; mask foreground
  size expected 80522 < 39011.333333333336; recovery-mask count expected eight,
  received six (four failures). The worker was changing chair/bed layering.
- Tutorial lane, `src/session/tutorialViewModels.test.ts:124,150`:
  expected "File the completed chart", received the new "Read the feedback
  and rewards ... Resolve Completed Chart files the visit" wording (two).
- Tutorial lane, `src/ui/visualComponents.test.tsx:227,257,285`: old Got It,
  Close tutorial, and Complete tutorial control expectations (three).
- Existing pending-label mismatch,
  `src/session/surgeryCenterServicePreviews.test.ts:85`: expects the pending
  label to include "Off-site thyroid fine-needle aspiration"; the existing
  dynamic label describes pending care/return and phase timing instead (one).
  This mismatch was also recorded in earlier handoffs. The scoped view-model
  diff only adds structured fields; no pending-label code was changed.

JSON receipts are in `%TEMP%` under the exact names above. The temporary
native config emits a Node MODULE_TYPELESS_PACKAGE_JSON warning for the
existing TypeScript guard file; no assertion is affected. Manager should rerun
with the normal player config in its environment after the concurrent lanes
land. No out-of-lane assertion was changed or weakened.

### Manager browser checks and fresh QA setup

No browser was run in the worker sandbox. Use a NEW disposable campaign in the
manager's QA origin/profile, record `location.origin`, and enable development
tools with `/?prototype-tools=1`. A separate QA host/port/profile has separate
storage; it does not inherit the owner's campaign. The owner opening pathway
is unchanged: `START_GAME.cmd` -> **http://127.0.0.1:4173** in the usual
persistent profile. Do not replace/clear that owner's saves for these checks.

For normal play setup, open Prototype tools, turn off **Tutorial guidance**,
and use **Add $100** repeatedly for the desired rooms/staff. Use
**Fast-forward 10 min** for arrival, service and automatic administrative work;
keep charts closed while waiting for an arrival. Advance through the main
level goals to reach Level 2 discussions and Level 3 goals. Existing staff
hosts such as a GLP-1 NP can host methods discussions once their setup is
operational. Discussion rows share the existing Waiting/Active/Resolved list.

For deterministic visual states, reuse `startClinic`/`getActiveState` from
`tests/e2e/helpers.ts` and the fresh-campaign `installState` pattern in
`tests/e2e/level-three-goals.spec.ts`. The exact admission/room and saved
employee-discussion recipes are in the new
`src/session/chartStructuredFields.test.tsx`. Select current release cases
with ID prefix `case.gs028se.` and first-node `exhibit.kind` equal to table,
keyValue or abstract; ordinary patients have no `participant`, and discussions
have `participant.kind === "employee_discussion"`. This avoids waiting for a
random arrival to supply each exhibit shape. Legacy QA is a copy of such a
frozen encounter omitting its optional exhibit/teachingPoint/rationale fields,
as covered by the new integration tests; do this only in the disposable QA
campaign. The Level 3 goal spec's fixture sets Level 3 without weeks of play.

Check at 1366x768 and 1024x768 laptop widths, then 390x844 phone width:

1. **Placement/time:** open a short chart; increase desktop viewport height
   if needed until its natural content is shorter than the desk. Its top
   should align with the desk top and its center with the desk center, subject
   to play-area edge clamping. Reduce available height or reveal feedback/
   all-choice rationales until content is taller than the desk: it should
   retain the previous bottom pin and grow upward over the map. Close the
   reveals/flip front-back/switch patients and resize: no stale pin, stretching,
   jumping between pins, or ResizeObserver loop errors. The sheet remains
   content-sized on desktop, with one vertical scroll. With tutorials off and
   facility time running, opening or revealing the chart must leave time
   running. Existing phone full-sheet behavior is retained.
2. **Exhibits:** reach each of table/keyValue/abstract in the patient and team
   scenarios above. Confirm Teaching dataset appears in the story column;
   captions, table row/column labels, values and abstract prose remain readable.
   At phone width the story stacks above decisions and the table scrolls
   locally if needed, without page overflow or clipped labels. Prose uses the
   read font; labels/controls use the pixel font. If multiple visited nodes
   have datasets, their decision headings distinguish them.
3. **Feedback:** answer one item incorrectly: question/answered rows remain,
   teaching point comes first, then Why not your pick and its rationale.
   Show all choices reveals every choice; each Why this choice opens/closes
   its own rationale. Hide other choices restores the compact rows. Repeat
   with a correct answer (Why this answer), reopened past chart, team
   discussion Continue/File discussion, and legacy QA (saved explanation and
   no empty rationale controls). No answer-key/rationale text appears before
   submission. Existing number keys, Enter, Escape and focus remain usable.
4. **Goals:** in the fresh Level 3 fixture, confirm all four main goals are
   readable, the operation setup disclosure still works, and the optional
   quality-review chip occupies only one line in the bottom control area.
   Hover and keyboard-focus the chip: the full original objective and
   progress appear in an unclipped tooltip; also check phone touch focus.
   For the real completion path, build/connect a Surgeon Office, hire its
   Surgeon, complete an ambulatory operation, then Fast-forward 10 min while
   the Surgeon is idle until the queued review completes. The chip changes
   0/1 -> 1/1 with its mark, without changing main goals/advancement gating.
   Main completion with the review still at 0/1 must remain valid; the current
   Level 4 preview notice is still shown instead of an implemented Level 4
   Advance action. At Level 1/2, existing Advance controls remain usable.

### Open work for manager acceptance

No product/schema question remains in this lane. Browser layout, touch/focus
and actual observer behavior still need the manager checks above. Reconcile
other lanes' full-suite failures and the pre-existing pending-label mismatch,
rerun the normal-config aggregate checks, inspect the actual shared-tree diff,
and update the central handoff/checkpoint only after acceptance. Work remains
local only.

Existing browser-test follow-up: `tests/e2e/patient-chart-density.spec.ts`
currently requires `box.left >= desk.left` whenever there is enough room on
the right, without checking content height. That is still the tall-chart
contract; a short chart now follows the owner's centered placement instead.
The manager should make that assertion conditional on natural height and add
the new top-center assertion when reviewing its browser test. That e2e file
was not edited in this worker lane. Its existing play-area/footer bounds and
content-size checks remain applicable.

## Worker handoff - training (Item 8, Sol, 2026-10-08)

### Scope and files

Completed the training lane. Changed:

- `packages/game-domain/src/employee-training.ts`
- `packages/game-domain/tests/employee-training-reachability.test.ts` (new)
- This appended handoff in `docs/execplans/owner-requests-20261008.md`

No player, shared reducer, balance, clinical-content, dependency, or save-schema
edits. The existing employee-training view model and StaffPanel already display
the domain's blockedReason, so the specific refusal copy needs no player patch.
No Git, installs, browser execution, deployment, publication, or owner browser
storage access. All work is local; the manager retains acceptance and the scoped
GitHub-backup reminder after accepting this integrated checkpoint.

### Diagnosis, reproduction, and decisions

The original quote checked a route from the employee's **current location** to
a training stool, using care-aware routing with only their **home room** allowed.
It did not substitute their assignment or home station as the starting point.
GLP-1 NPs have physical, distinct staff/primary workstation anchors in their
assigned telehealth suite; remote consultations do not make the employee remote.
Their current consultation only defers departure to the payout tick after
payment; it is not the reason for the eligibility refusal.

A realistic layout reproduces the owner's exact refusal before the fix:
Front Desk -> hallway -> Phlebotomy Room -> GLP-1 Telehealth Suite, with a
Training Room on the public hallway. Both NPs are assigned to their actual,
distinct suite workstations. Facility access is valid, both relevant rooms
are operational, the control employee can train, and the ordinary tile graph
finds a physical route. Care-aware training routing nevertheless removes the
intervening Phlebotomy Room, cutting off the suite. More doors into the same
intervening care room cannot correct that policy mismatch.

The first examination-room probe was rejected by the real fixture mask before
reaching the eligibility assertion; it was not used as bug evidence. The final
Phlebotomy Room reproduction has a verified real tile route and failed at the
training quote with exactly:
`canTrain: false, blockedReason: "An operational, reachable Training Room is required."`
The red run was captured before any implementation edit.

Training now prefers its existing public/care-aware route. If none exists,
this explicit staff assignment can traverse other built rooms through actual
doors using the same physical tile graph and fixture masks. This is a
training-only fallback: the shared care-room policy is unchanged. Quotes,
outbound movement, forecasts, and return travel use the same helper; no
NP-specific exemption, teleport, or home-location substitution was added.

Quotes and queued departure selection also require a real return route to the
assigned home station. A connected current corridor cannot conceal a disconnected
home suite, and losing the home connection after payment keeps the employee
queued rather than sending them on a trip they cannot complete.

Refusals now distinguish: no Training Room, no accessible Training Room,
accessible rooms out of service, the named employee's inaccessible current
area, no home assignment, and an inaccessible return to the named home-room
type. Unpaid refusals retain cash. Existing cash/role/max-level/duplicate guards
retain their priority.

The 15 new regressions cover both NP positions, both legal suite orientations,
payment and consultation-boundary departure, two seats, continuous physical
paths, save/reload, one level increase and return to each original workstation,
public-route preference, a current blocked fixture tile, disconnected current
areas, an isolated hallway that cannot use grass re-entry, missing/disconnected
homes, lost access after payment, and the distinct refusal messages.

### Exact validation

Only game-domain was modified among executable packages. Logs, captured intake
source, baseline-relative review diff, and source hashes are under the ignored
`.local-dev/owner-requests-20261008-training/` directory.

Pre-fix reproduction (exit 1; `reproduction-before.log`):

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/employee-training-reachability.test.ts --pool=threads --maxWorkers=1
Test Files  1 failed (1)
     Tests  1 failed (1)
  Start at  08:51:31
  Duration  2.15s (transform 1.53s, setup 0ms, import 2.04s, tests 14ms, environment 0ms)
```

Post-fix original reproduction (exit 0; `reproduction-after.log`):

```text
Test Files  1 passed (1)
     Tests  1 passed (1)
  Start at  08:53:50
  Duration  2.00s (transform 1.42s, setup 0ms, import 1.90s, tests 14ms, environment 0ms)
```

Final focused suite (exit 0; `focused-final.log`):

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- tests/employee-training-reachability.test.ts tests/employee-training.test.ts tests/employee-training-benefits.test.ts tests/employee-training-np-queue.test.ts tests/employee-training-persistence.test.ts tests/room-upgrade-support.test.ts tests/owner-passable-door-slots.test.ts --pool=threads --maxWorkers=1
Test Files  7 passed (7)
     Tests  168 passed (168)
  Start at  08:56:25
  Duration  12.75s (transform 1.58s, setup 0ms, import 4.74s, tests 7.31s, environment 0ms)
```

Full package suite (exit 1; `domain-full.log`):

```text
npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1
Test Files  1 failed | 102 passed (103)
     Tests  3 failed | 3288 passed (3291)
  Start at  08:57:35
  Duration  391.95s (transform 3.01s, setup 0ms, import 43.53s, tests 338.88s, environment 6ms)
```

All three full-suite failures belong to the concurrently edited Item 9
`tests/companions.test.ts` / procedure-companion lane:

- Line 135: waitingReservation.roomInstanceId was undefined instead of "periop.qa".
- Line 165: amenityDecisionPhaseIndex was undefined instead of null.
- Line 197: procedureCompanion was undefined instead of the expected waiting_in_periop object.

These fixtures contain no employees or training requests and call retail
advancement, not the modified training quote/travel functions. No companion
files were edited here; the manager/companions worker owns these failures.

The initial workspace typecheck (exit 1; `typecheck.log`) caught the concurrent
`src/procedure-companions.ts(109,55): error TS18048: 'state.patientAmenityTrips' is possibly 'undefined'.`
That file was subsequently updated by its own lane. Both the next typecheck and
the final **post-full-suite** `npm.cmd run typecheck` passed (exit 0,
`typecheck-final.log` and `typecheck-after-full.log`). All seven workspace
packages completed their typecheck scripts without errors in the final run.

Reviewed the actual baseline-relative source diff. Both owned file hashes
remained unchanged from full-suite start through post-suite typecheck:

- employee-training.ts: `79A2A04843EDF275ED054926CFBDC7F6D6EF36D267A79178C5B1262B1B759777`
- employee-training-reachability.test.ts: `5C15A6F944F46124F34FDDF94C19EC9B3C1ADB432C3F4920FA69845C8F4D4E33`

### Manager browser QA: fresh campaign and exact checks

This worker cannot run a browser. Use a fresh campaign named **Training Item 8
QA** on the manager's separate QA origin/profile, and record `location.origin`.
For example, the manager's existing `http://127.0.0.1:5183` has separate saves.
The owner's opening pathway is unchanged: `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the usual persistent browser profile. Do not replace
or reset the owner's campaign.

Reach Level 2 through Goals: Level 0 needs 10 Clinical XP, the Examination Room,
and satisfaction above 90; Level 1 needs 150 Clinical XP, Ultrasound and Minor
Procedure Rooms, an imaging technician, and satisfaction above 90. Keep these
prerequisite rooms in the north/east area so the layout below remains clear.
Use **Prototype tools -> Add $100** as needed for the displayed build, hire,
and training prices. Alternatively the manager may seed a newly created,
synthetic Level-2 QA campaign using its established browser-test fixture route;
the new domain test provides the exact state recipe.

Pause and build this tested layout (coordinates are top-left grid tiles):

| Object | Placement / connections |
| --- | --- |
| Existing Front Desk | Keep its original (33,28) placement and exterior entrance; add west door offset 0. |
| Public hallway | Six individual hallway tiles at x=32, y=25 through 30. |
| Training Room | (29,24), orientation 0; east door offset 1. |
| Phlebotomy Room | (29,29), orientation 0; east door offset 1 to the hallway. |
| GLP-1 Telehealth Suite | (26,29), orientation 0; east door offset 1 into Phlebotomy. No other suite exit for the first check. |

Hire **two GLP-1 NPs** into this suite; hiring should place them at the two
distinct posts. Let one facility minute run to start their first automated
consultations, then pause before requesting training. An optional receptionist
supplies the control employee.

1. Open Staff -> each NP -> Train. Each Level-1 quote must show an enabled
   **Train $150** confirmation, despite the intervening Phlebotomy Room.
   Confirm both: cash falls by $150 per request once, both show Queued / working,
   and each finishes their ongoing consultation before leaving.
2. Use **Fast-forward 10 min** during consultation waiting (at most one
   current 60-minute interval), then observe actual walking with the running
   clock. Both NPs must leave through the suite's real east door and the
   Phlebotomy Room's east door; no wall crossing, teleport, or indefinite
   refusal. They occupy distinct Training Room stools. Fast-forward through
   the baseline 60-minute seated work, then watch both return to their own
   distinct suite posts. Each becomes Level 2 once; NP income resumes when
   their next consultation completes. Room upgrades may shorten the session.
3. Repeat in another fresh QA campaign with the suite at **(27,29),
   orientation 270** and its world-east door at offset 1. Both distinct posts,
   both routes, and both returns must work in this orientation.
4. Reload once while queued and once while walking/seated. Each paid request,
   remaining seated work, seat identity and home assignment must persist;
   neither payment nor the level increase repeats.
5. After both return and their paid flows clear, pause and remove **every
   suite exit**. Ensure cash covers the displayed next training price so the
   cash guard does not mask access. Each Train popover must name the actual NP
   and say they cannot reach a Training Room from the GLP-1 Telehealth Suite;
   its confirmation is disabled, while the control employee remains eligible.
   Restore the suite east door: the NP quote should immediately recover.
6. Remove the Training Room east door: the refusal must say no Training Room
   has usable access to the clinic. Restore it to recover. In a fresh QA
   campaign with no Training Room, it must instead say to build one.
   Verify these messages wrap visibly in the confirmation without clipping.
7. Add public hallway tiles at **(26..31,28)** plus a suite north door offset 0
   in the orientation-0 layout. On the next paid training trip, both NPs must
   prefer this public route instead of traversing Phlebotomy.

Unit tests additionally verify out-of-service Training Rooms, blocked fixture
origins, a disconnected current room despite a reachable home, a disconnected
home despite a reachable current corridor, and loss of a home connection after
payment. These synthetic guards do not require inspection of an owner save.

### Open questions / acceptance

No implementation blocker remains in this lane. The exact owner's campaign
was not inspected; the manager should confirm whether its suite route crosses
another care room, then run the QA matrix and review the training-only transit
fallback. If the reported failure persists in the updated build, the needed
owner-provided debug subset is: room IDs/definitions/coordinates/orientations,
doors with room ID/side/offset/exterior, facility tick, each affected NP's
ID/role/homeRoomInstanceId/location/path/pathIndex/facilityTask/training, and
GLP-1 automation slots. No clinical encounter contents are needed.

The manager retains the three concurrent companion failures, default-config
test/browser acceptance, and the owner report. Preserve all other lanes.
- 2026-10-08: owner request: exterior frontage (grass, trees/flowers, sidewalk, planters, entrance) redesign proposal; Sol design worker launched (exterior).
- 2026-10-08: owner request: remember map zoom/pan per campaign across reloads; Sol worker launched (camera).


## Severance radiologists first

Sol worker, 2026-10-08. Completed the owner's bounded hiring-order request.
Changed only `packages/game-domain/src/characterStillCatalog.ts` (ordered
`PREFERRED_STAFF_STILL_IDS_BY_ROLE` data), `packages/game-domain/src/appearance.ts`
(staff selection), and two new regression files:
`packages/game-domain/tests/radiologist-hiring-order.test.ts` and
`apps/player/src/session/radiologistHiringOrder.test.tsx`.

New radiologists take the first free `level3-roster-v2.001` through `.004`
(Mark, Helly, Irving, Dylan). Current and departing employees reserve their
looks. A compatible saved look is retained before checking preferences; once
all four are occupied, the original seeded fallback is unchanged. Other roles,
art, saves, capacity, and clinical content are unchanged. Firing currently
removes an employee immediately and frees their look; room-sale departing
actors retain theirs until departure completes. The fifth-hire regression uses
a synthetic departing actor to preserve the existing four-reader capacity.

Hiring audit: Management > Employees renders StaffPanel; its role and open-slot
buttons dispatch the same HIRE_STAFF command. Needs-you and tip hire actions
also dispatch HIRE_STAFF through clinicAlertCommand. These surfaces have no
pre-hire candidate portraits (open slots are placeholders), so no UI source
change was needed. Tests compare selection predictions with actual hires across
all three entry points and verify Management/StaffPanel renders the assigned
avatar. Existing saved radiologists retain all 16 eligible looks.

Validation (all Vitest runs used `--pool=threads --maxWorkers=1`):
- Focused domain: **6 files / 72 tests PASS**, including 10 new regressions.
- Focused player: **4 files / 26 tests PASS**, including 3 new regressions.
- `npm.cmd run test --workspace @gamify-surgery/game-domain -- --pool=threads --maxWorkers=1`:
  **101 files / 3307 tests passed; 4 failures across 3 files** (451.63s).
- `npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1`:
  **126 files / 977 tests passed; 1 failure** (54.50s).
- Post-suite `npm.cmd run typecheck`: **all seven workspaces PASS** (exit 0).

Attribution: domain failures at guidance-tip-predicates.test.ts:56 and
approved-room-geometry-migration.test.ts:110 reproduced using intake appearance
and catalog snapshots through a read-only Vite loader. The later current-tree
rerun of these plus waiting-destination-routing.test.ts passed **73/74**: geometry
and both routing failures had resolved during concurrent work; only the tip
predicate remained. Player surgeryCenterServicePreviews.test.ts:85 reproduced
identically with both intake snapshots (**12 passed / 1 failed**). These failures
belong to the shared tree, not this selection delta. No unrelated files were
reverted or fixed. The four owned source/test hashes stayed unchanged through
validation; baseline-relative source comparison permits only the preference
and staff-selection additions.

Player commands used the existing command-local
`.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs` preload via
`NODE_OPTIONS=--import=<file URL>` for Vite's optional Windows `net use` probe.
No dependency or config changes. Exact commands/output, source.diff, control
configs, intake snapshots and hash/scope evidence are in ignored
`artifacts/logs/severance-radiologists-20261008/`.

Manager next: inspect the tiny source delta and new tests, retain the two
remaining unrelated failures, and check four sequential hires plus one rehire
in a synthetic Level-3 Reading Room. This worker used no browser or owner save.
Owner pathway remains `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the
usual persistent profile; manager QA origins/profiles have separate saves.
Local only: no Git commands, installs, art changes, push, deployment or
publication. After acceptance, the manager owns the scoped backup checkpoint
and the reminder to say **"push to GitHub"**.


## Layering worker handoff - item 1 (2026-10-08)

Status: implementation complete locally; presentation lane released for manager
review and the item 9 rendering handoff. Sol worker performed this bounded
milestone directly. No agents spawned, Git commands, dependency installs,
browser launches, publication, deployment, clinical edits or save changes.

### Files changed

- `apps/player/src/facility/approvedSideChairLayers.ts`: crop-local foreground
  polygons and partition data; 18 chair/bench crops plus six non-south recovery
  bed bands. South bed bands N3/N4 removed. Separate arms/posts share one
  complementary foreground image, so overlapping regions never double alpha.
- `apps/player/src/facility/approvedRoomPresentation.ts`: attach the same
  furniture bindings to Level 3 and fallback supports; honor explicitly
  authored painter layers for Reading Room and the rotated north NP chair.
  Front Desk public chair now uses its existing north-facing art direction.
- `apps/player/src/facility/FacilityScene.ts`: feed additional polygons into
  the existing pixel partition; carry the furniture mask binding through
  actor/support presentation, including renamed idle staff supports. Add the
  missing Front Desk room-instance attachment so its occupied layers reconcile.
- `apps/player/src/facility/roomTouchups.ts`: the south-facing massage recliner's
  existing front sprite now sorts with its base, below the whole sitter.
- `apps/player/src/facility/approvedSideChairLayers.test.ts`: updated crop,
  seat, pixel-partition and remaining non-south bed-band contracts.
- New `apps/player/src/facility/furnitureSeatLayering.test.ts`: ten Node tests,
  including real FacilityScene reconciliation with display-object doubles,
  bitmap/fallback occupants, multiple bench occupants, unrelated rooms,
  vacated furniture, Front Desk, renamed idle staff, and before/after evidence.
- New `apps/player/src/facility/furnitureSeatLayering.before.fixture.json`:
  56 original actor seat/floor contacts and 64 seating-related furniture
  crops/positions across 24 views, plus the 15 original mask/seat bindings.
  Mask metadata comes from the byte-exact pre-edit source snapshot; tests
  preserve the original contacts, source crops, destinations and sizes.
- This append-only plan handoff and a short append-only current-thread receipt.

### Decisions and audit findings

- Reused the existing seat-contact and furniture-split system; no art sources,
  pixels, seat coordinates, room/furniture positions, navigation, movement,
  domain state or saved encounters changed.
- South-facing recovery bed sitters N3/N4 now draw wholly above the bed,
  including legs. North/east/west beds retain the prior hanging-leg bands;
  those bands remain clear of their separate monitors.
- Verified south-facing examination/minor-procedure/ultrasound surfaces and CT
  couch already sort beneath their actors. The regression test covers all six
  south bed/table contacts at three scales and three world origins.
- Endoscopy and Ambulatory OR active procedure patients are the approved
  occupied-covered table variant, with the separate actor hidden. Endoscopy's
  seated pre/post-procedure patients use the Peri-op/Recovery beds; the N3/N4
  fix applies there. This existing occupancy policy was preserved.
- Every current rendered east/west chair or bench support was audited:
  13 supports, comprising nine armrest/bench bindings and four armless stools
  or wooden Break Room side chairs. The latter remain unsplit. Laboratory and
  maintenance benches are work surfaces with standing actors, not seats.
- Extended the existing waiting/phlebotomy/telehealth side-arm masks to include
  the near arm's support posts. Added missing Reading Room east/west arm masks.
  Added arm/back regions for Waiting Room north/south seats, the south waiting
  bench, both Front Desk chairs, south phlebotomy chair, rotated telehealth
  chairs, Surgeon Office chair and south Reading Room chair. Existing Break
  Room north chair-back layers and Reading Room southeast chair-back layer
  already provide the correct occlusion and were retained.
- South-facing massage recliner: both its base and front sprite are below
  every actor pixel. Ordinary armchairs/collection chairs retain their near
  arms in front; no central cushion or footrest region was added to their masks.
- Furniture ownership is carried by mask identity as well as the existing
  semantic support ID. Reusing a clinician seat as a staff-idle seat therefore
  retains the same mask even when its support ID changes.
- Before/after evidence: the captured N3 bed binding previously overwrote a leg
  sample at source pixel (120.5, 510.5); it is now absent. Reading northeast had
  no foreground binding; its arm/post samples now show chair pixels while the
  central body/cushion sample remains an actor. RGBA values are preserved in
  the complementary layers. These are Node evidence, not browser acceptance.

### Exact validation

Only the player package was touched. Full player suites used the unmodified
player Vite configuration and the requested threads/single-worker flags.
The initial ordinary invocation failed before tests with Vite's optional
Windows `exec("net use")` throwing `spawn EPERM`. Final runs used the already
documented command-local preload from the Alerts & Events plan:

```powershell
$env:NODE_OPTIONS='--import=file:///C:/Users/rowla/Projects/GamifySurgery/.local-dev/alerts-events-validation/ignore-net-use-eperm.mjs'
npm.cmd run test --workspace @gamify-surgery/player -- src/facility/furnitureSeatLayering.test.ts src/facility/approvedSideChairLayers.test.ts src/facility/approvedRoomPresentation.test.ts src/facility/approvedRoomRenderer.test.ts src/facility/staffIdleSupports.test.ts src/facility/roomTouchups.test.ts src/facility/characterPauseArrival.test.ts --pool=threads --maxWorkers=1
```

Final focused output, exit 0 (`focused-final.log`):

```text
Test Files  7 passed (7)
     Tests  80 passed (80)
  Start at  09:13:15
  Duration  3.99s (transform 1.80s, setup 0ms, import 2.91s, tests 519ms, environment 0ms)
```

Full touched-package command (same command-local preload):

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

Final full output, exit 1 (`player-full-final.log`):

```text
Test Files  1 failed | 127 passed (128)
     Tests  1 failed | 978 passed (979)
  Start at  09:13:37
  Duration  55.84s (transform 3.35s, setup 0ms, import 29.15s, tests 14.01s, environment 8ms)
```

Sole failure, outside this lane:
`src/session/surgeryCenterServicePreviews.test.ts:85:52`,
"ignores the retired concealment flag and preserves the scheduled external
service after an answer". Expected pending label to contain
`Off-site thyroid fine-needle aspiration`; received the current dynamic
`The result is pending. Patient care and return are still in progress...`
label with stage timings. This failure was already recorded in the Alerts &
Events/current handoff before this work. All facility tests passed.

```powershell
npm.cmd run typecheck
```

Final root typecheck, exit 1 (`typecheck-final.log`): the player and five other
workspaces pass; game-domain alone reports:

```text
tests/tutorial-guidance-integration.test.ts(3,29): error TS2307: Cannot find module './guidance-tip-fixtures' or its corresponding type declarations.
```

That tutorial test is concurrently authored outside this lane; the referenced
fixture was absent when checked. An earlier shared-tree typecheck temporarily
reported reducer.ts TS2366; that error cleared on subsequent runs. No facility
type errors. The manager should rerun root typecheck after the tutorial handoff.

Exact logs and the pre-edit source copies are available locally:
`.local-dev/owner-layering-20261008/{focused-final,player-full-final,typecheck-final}.log`
and `%TEMP%/gamifysurgery-layering-20261008/`. No test-side file writes remain
in the final tests. The manager should also rerun ordinary/default-pool tests
in its browser-capable environment.

### Manager visual QA - fresh campaign

Browser checks were not run in this sandbox. Use a new disposable QA campaign
with Tutorial guidance off in Prototype tools, preserving the owner's campaign.
Owner opening pathway is unchanged: `START_GAME.cmd` ->
`http://127.0.0.1:4173` in the usual persistent profile. A separate QA origin
or browser profile has separate storage; it does not inherit that owner save
or the GitHub Pages save. Record the actual QA origin/profile with captures.

Use **Add $100** repeatedly to fund rooms/hiring and **Fast-forward 10 min**
to advance arrivals and services. Advance through the current Goals/Advance
requirements to Levels 1, 2 and 3; no level-unlock behavior was changed here.
Put every room on a reachable hallway with a legal door. After actors finish
walking, allow the 180 ms seat-settle to finish, then pause and zoom in.
Fast-forward can skip a desired pre-op pose, so use normal play speed when an
actor is approaching the target seat.

| State to reach | How to reach it in the fresh QA campaign | Exact visual check |
| --- | --- | --- |
| Front Desk staff/public chairs | At Level 0, seat the free founder in the public chair; hire a receptionist for the staff chair. | Public sitter faces north behind the blue chair back; receptionist sits behind the green chair's arms. Heads/shoulders remain visible. Empty chairs return to the original whole sprite. |
| Waiting Room 0, 4x3 | Unlock Level 1, build an unrotated Waiting Room; click each free chair/bench seat with the founder. Repeat with incoming adult patients/companions. | East and west adults sit on the cushion behind the horizontal near arm and its posts. Both south bench sitters remain on the cushion between the arms. |
| Waiting Room 270, 3x4 | Build a second Waiting Room using Rotate for the portrait layout; use both bench slots and the north/south armchairs. | Both east bench occupants are behind its near arm; the upper occupant stays above the bench's rear layer. North sitter is behind the chair back, south sitter behind the side arms. No full cushion crosses a torso. |
| South Endoscopy pre/post-op beds N3/N4 | At Level 2 build reachable Endoscopy and Peri-op/Recovery rooms and enable/serve endoscopy visitors. Keep north door segments N3/N4 free so both beds exist. Observe patients allocated to those beds during pre-op/recovery; fill other beds through additional procedure arrivals if needed. | Head, torso and both legs are entirely above the bed. Separate monitors may retain their own depth. Check during arrival settle, paused redraw and departure. |
| Other Peri-op bed facings | Continue procedure arrivals until S3/S4, WC/WD and EC/ED are occupied. | Their previous north/east/west hanging-leg treatment remains; no band overlaps a monitor. Opening a bed-owned door removes its bed/overlay, and closing it restores it. |
| Examination/minor-procedure/ultrasound/CT beds | Rotate Examination to 270 for its south patient seat; use ordinary care/test flows in Minor Procedure, Ultrasound and CT after their level unlocks. | The whole south sitter, including feet, remains above the table/couch. Unrotated Examination's west-facing support remains unchanged. |
| Phlebotomy 0 and 270 | At Level 2 build both 3x2 and rotated 2x3 stations and run an incoming collection service in each. | East patient's near arm/posts cover only the matching side of the body; south patient's arms are beside/in front of the body, while the central cushion/footrest stays behind. Armless clinician stool has no foreground mask. |
| Telehealth 0 and 270 | Build each suite orientation at Level 2; hire/assign two GLP-1 NPs and wait for each to reach its workstation. | East/west arms cover the seated body at the near side; rotated north NP stays behind the chair back, south NP behind the arms. Neither actor is hidden by the entire chair. |
| Break Room table seats and massage recliner | At Level 3 build Staff Break Room; click each free founder seat, including both side chairs and the massage seat. | Wooden east/west chairs are armless; table edges retain their prior depth. North chair backs remain in front. South massage sitter, including both legs, draws entirely above the recliner and its footrest/front sprite. |
| Surgeon Office normal and idle seat | At Level 3 hire/assign a surgeon to the office; observe the office seat and the idle desk seat after the route finishes. | Both support identities put the surgeon on the same cushion behind the chair arms, with no shift in seat contact. |
| Reading Room four seats | At Level 3 build the Reading Room and assign radiologists to occupy all four workstation slots. | Northeast west-facing and southwest east-facing sitters are behind the near arm/posts. Northwest south arms cover the sides only. Southeast retains its chair-back layer. Approved desk/island edges still cover the appropriate body portions; no arm rectangle paints desk/background over a head. |

Repeat the side-chair checks with average and larger adult identities, and the
Waiting Room with a smaller identity. Compare at default zoom and close zoom.
Check occupied/empty transitions, Pause/resume, room redraw/rotation, and a
walker passing beside an occupied chair: there should be no doubled outlines,
missing arm edges, mask left on an empty chair, room-to-room ownership leak,
or sudden seat/contact shift.

### Remaining integration notes / questions

- Visual mask acceptance remains with the manager; this sandbox cannot verify
  actual browser texture loading, character-width intersections or lighting.
- The pediatric Waiting Room mockup is the pediatric worker's separate lane.
  It does not use these runtime approved-room draw records.
- The concurrent companions worker has now defined eight
  `companion.NW.north/.west, NE.north/.east, SW.west/.south, SE.east/.south`
  armchairs in balance data. They are not yet furniture draws/supports in this
  runtime presentation. When item 9 gets its rendering handoff, bind those new
  furniture instances to this same crop/polygon system; this audit covers the
  currently rendered seats, not unseen future instances.
- No design approval is requested by this worker. Manager acceptance includes
  inspecting the actual scoped diff, resolving the shared tutorial typecheck
  failure, and the visual matrix above. The milestone remains local only;
  the manager owns the GitHub checkpoint reminder and any authorized backup.
- 2026-10-08: Severance radiologists first ACCEPTED by manager: diff is the ordered PREFERRED_STAFF_STILL_IDS_BY_ROLE list plus a 4-line preference check after the saved-look branch in selectStaffStillId; focused 72+26 PASS; full-suite failures attributed to concurrent work (recheck after the batch lands, incl. guidance-tip-predicates.test.ts:56).


## Remember map camera

Sol camera worker, 2026-10-08. Implementation complete in the assigned
canvas/session lane; manager diff review and browser acceptance remain.

### Files and behavior

- `apps/player/src/session/facilityCameraPreference.ts` (new): versioned,
  origin-local presentation preferences keyed by campaign ID;
  `gamify-surgery.prototype.facility-camera.v1:<encoded campaign ID>` stores
  only `{schemaVersion: 1, camera: {zoom, panX, panY}}`. Writes debounce for
  250 ms and flush synchronously on pagehide, beforeunload, hidden visibility,
  unmount, Save and pause, and campaign switching. A small in-memory cache
  preserves switching even when browser preference storage is unavailable.
- `apps/player/src/session/usePrototypeSession.ts`: initializes from the
  campaign preference or the existing default, routes both scene gestures and
  existing header zoom buttons through the preference writer, restores the
  selected campaign, and discards pending camera writes before campaign reset.
  Exact camera hunks only; concurrent tutorial replay/pause edits preserved.
- `apps/player/src/facility/FacilityCanvas.tsx`: uses Phaser's existing
  POST_STEP event to reconcile the requested camera after the scene is active
  and the host has positive dimensions. Rechecks on camera/campaign changes,
  resizing, and relevant facility/founder geometry changes. Sends a clamped
  camera back through the existing callback and cleans up the event listener.
- `apps/player/src/facility/facilityCameraBounds.ts` (new): finite-data guard
  and bounds derived from current scene geometry, current viewport, current
  grid size, founder focus, wall envelope and exterior bands. Retains legal
  fractional pan and clamps zoom to the existing 0.1--2.5 range.
- `apps/player/src/facility/defaultCamera.ts`: documentation only; the default
  function's behavior is unchanged (isolated Level 0 desk: 1.1, others: 1;
  zero pan). Missing, malformed, unsupported-version or nonfinite camera data
  uses that same default without rewriting the malformed stored entry.
- `apps/player/src/session/facilityCameraPreference.test.ts` (new): round
  trip per campaign, latest-value debounce, switching before debounce,
  missing/invalid fallback, immutable snapshots, independent origin stores,
  blocked/quota storage, pagehide/beforeunload/hidden/unmount flushing, and
  pending-write discard on reset. Asserts camera writes leave whole-profile
  storage and serialized game/FSRS bytes unchanged.
- `apps/player/src/facility/facilityCameraBounds.test.ts` (new): legal camera
  preservation, limits, resized/grown/small facilities and missing-founder
  focus. Compares the helper against the actual current
  `FacilityScene.calculateLayout` using a DOM-free Phaser Scene mock.

`FacilityScene.ts` was never edited by this worker. No deterministic domain,
FSRS, save-schema, clinical content, tutorial guidance, art, launcher, or
origin changes. `prototypeStorage.ts` and `localCampaignRepository.ts` were
read to verify conventions; neither needed edits. The camera is intentionally
an independent small UI-preference entry (like the existing workspace split),
so moving it cannot serialize/rewrite whole campaigns or merge another
campaign's preference metadata. No migration is necessary; archive/resume
retains the preference through the stable campaign ID. Other origins/profiles
use separate localStorage; no synchronization is attempted.

### Validation and exact output

Commands ran from the repository root; no installs or Git commands.

The unmodified focused test invocation first failed before tests loaded with
Vite's Windows `optimizeSafeRealPathSync -> exec("net use") -> spawn EPERM`.
As in prior worker handoffs, subsequent Vitest commands used an ignored,
command-local NODE_OPTIONS preload, not a configuration/dependency change:
`artifacts/logs/remember-map-camera-20261008/vite-net-use-preload.cjs`.
It preserves normal exec calls and only turns synchronous EPERM on that
optional probe into Vite's already-supported asynchronous error callback.
The prior NODE_OPTIONS value was restored after each invocation. The manager
should rerun tests without this preload in its ordinary environment.

Focused final command:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1 src/session/facilityCameraPreference.test.ts src/facility/facilityCameraBounds.test.ts src/facility/defaultCamera.test.ts src/session/prototypeStorage.test.ts src/session/localCampaignRepository.test.ts
```

Exact final summary (exit 0):

```text
 Test Files  5 passed (5)
      Tests  93 passed (93)
   Start at  09:23:39
   Duration  4.29s (transform 1.69s, setup 0ms, import 3.23s, tests 597ms, environment 0ms)
```

Full required player command:

```powershell
npm.cmd run test --workspace @gamify-surgery/player -- --pool=threads --maxWorkers=1
```

Exact final summary (exit 1):

```text
 Test Files  1 failed | 130 passed (131)
      Tests  1 failed | 1024 passed (1025)
   Start at  09:24:14
   Duration  56.13s (transform 3.06s, setup 0ms, import 29.64s, tests 13.90s, environment 9ms)
```

The sole failure is the previously recorded unrelated pending-label
expectation at `apps/player/src/session/surgeryCenterServicePreviews.test.ts:85:52`:

```text
Expected: "Off-site thyroid fine-needle aspiration"
Received: "The result is pending. Patient care and return are still in progress. The next decision waits for care completion. Game time: Travelling to the outside service (onsite): 20 min remaining (20 min walking); Procedure (offsite): 140 min remaining; Pathology (offsite): 200 min remaining; Returning to Front Desk (onsite): 159 min remaining (19 min walking)."
```

This same assertion/failure is attributed in the prior Alerts & Events and
layering handoffs. The camera lane did not edit this test, chart viewModels,
clinical/service timing, or its domain fixtures. All new camera tests pass.

Required root command `npm.cmd run typecheck` was run twice; final exit 1.
Player and the other five non-domain workspaces have no errors. Sole final
compiler error in the concurrent radiologist-income lane:

```text
tests/radiologist-read-income.test.ts(274,5): error TS2322: Type '4' is not assignable to type '0 | 1 | 2 | 3'.
```

The actual current line assigns `f.state.facilityLevel = 4`; the domain level
union stops at 3. This worker did not alter that file. Dedicated player command
`npm.cmd run typecheck --workspace @gamify-surgery/player` exited 0 with:

```text
> @gamify-surgery/player@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Full captured output, initial baselines, camera-only delta and final source
hashes are in ignored `artifacts/logs/remember-map-camera-20261008/`:
`focused-tests.log`, `full-player-tests.log`, `typecheck-final.log`,
`player-typecheck.log`, `camera-only.diff`, `final-source-hashes.json`.
`scoped-baseline.diff` also shows concurrent tutorial changes since intake;
those changes are excluded from `camera-only.diff` and were preserved.
No tests/default configuration or unrelated failures were changed to force
passing results.

### Manager browser verification

Use a synthetic campaign in the manager's established separate QA origin,
for example `http://127.0.0.1:5183`, in one persistent browser profile. Record
`location.origin`. QA 5183 has its own saves and camera entries; it does not
restore the owner's 4173 storage. The owner opening pathway is unchanged:
`START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the usual persistent profile.
The worker did not open a browser or access the owner's browser storage.

1. With no camera key, open an isolated Level 0 desk and an expanded/later
   clinic: their existing defaults should look unchanged. Pan and zoom using
   both the wheel/gesture and header buttons. Reload/resume after 250 ms;
   the same view should return without a jump to the default.
2. Pan/zoom again and refresh immediately (before 250 ms), then repeat with
   Save and pause and closing/reopening the tab. The latest view must survive.
   Switching the page to hidden must flush too, with no unload confirmation.
3. Give campaign A and campaign B visibly different views. Switch A -> B -> A,
   including immediately after a change, and reload each; each must retain
   its own camera. New campaigns must begin with the existing default.
4. Save near a pan limit, change window dimensions/map split, reload, and
   return to the campaign. Repeat after expanding the synthetic facility or
   moving the founder desk. The view must stay within current bounds, and
   zoom/drag controls must remain responsive at both limits.
5. On the synthetic campaign only, replace its camera entry with malformed
   JSON or `{schemaVersion:1,camera:{zoom:1,panX:null,panY:0}}`: reload must
   use today's default and remain playable. Then try a valid finite camera
   with zoom 99 and large pan: after scene readiness it must clamp to zoom
   2.5 and the current site edges. Repeat with zoom 0.001 (clamps to 0.1).
6. Test the same campaign ID at another QA origin/profile only if desired:
   it must not inherit the first origin's camera. Keep the owner's saves
   and profile intact.

### Open risks / next action

No camera implementation blocker remains. The bounds helper mirrors scene
layout math to keep out of the active rendering lane; its regression tests
compare the two directly and will detect future drift. Manager acceptance
still requires the browser matrix, actual scoped-diff review, ordinary test
rerun, and tracking/fixing the two unrelated validation failures above.
This lane is released for review. Local-only checkpoint; the manager owns the
GitHub backup reminder (owner says **"push to GitHub"**) and any authorized
backup. No push, publication, deployment, cross-origin sync or install occurred.
