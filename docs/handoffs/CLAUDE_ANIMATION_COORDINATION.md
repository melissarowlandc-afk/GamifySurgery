# Claude ↔ Codex coordination: character animation and movement

Created: October 5, 2026, by Claude Code (Opus 5.5) at the owner's request.
Readers: Codex GS Manager, Codex workers, Claude Code sessions, and the owner.

This file is the single coordination channel between Codex and Claude Code. It
does not replace `CURRENT_THREAD_HANDOFF.md`. That file stays Codex's record.
Keep entries short, dated, and append-only within each section. Mark resolved
items as resolved; do not delete them.

## 1. Roles and ownership

- **Codex owns the game.** Codex sets priorities, holds the integrated
  worktree, runs checkpoints and backups, and makes final integration
  decisions.
- **Claude Code is a scoped contributor.** As of October 5, 2026, its scope is
  character sprite animation, movement, and directly related presentation code
  only.
- **The owner has final say.** If Codex and Claude disagree, record it in §6
  and let the owner decide. Neither agent overrides the other's work.
- `AGENTS.md` binds both agents: clinical-content safety, source restrictions,
  canonical playtest origins, and GitHub checkpoint rules.

## 2. Claude scope

### In scope (Claude may edit after logging a claim in §4)

| Area | Files |
| --- | --- |
| Interpolation between logical ticks | `apps/player/src/facility/routeMotion.ts` (+ test) |
| Captured and replayed motion state | `apps/player/src/facility/characterMotionPresentation.ts` (+ test) |
| Pose and direction selection | `apps/player/src/facility/characterPresentation.ts` (+ test) |
| Gait proofs and experiments | `apps/player/src/facility/lateralGaitProof.ts` (+ test) |
| Stop and arrival behavior | `apps/player/src/facility/characterPauseArrival.test.ts` |
| Motion-only regions of the scene | `apps/player/src/facility/FacilityScene.ts`: step-bounce clock and state (`characterStepBounce*`), settle, gait atlas data (`gait-*`), per-frame actor positioning in `update()` |
| Runtime loading of character frames | `apps/player/src/art/characterBitmapArt.ts` |
| Motion docs | `docs/execplans/character-*.md` (motion only) and this file |

### Out of scope (Claude must ask the owner or Codex first)

- Clinical content and data: `packages/clinical-content`, `clinical-data/`,
  and all approvals
- Game rules, domain logic and saves: `packages/game-domain`,
  `packages/balance-config`, `apps/player/src/session/*`, and the save schema
- Logical movement speed or routing semantics. Rendering may interpolate the
  route, but it must not change the route.
- UI, alerts, menus and HUD: `apps/player/src/ui`, `App.tsx`, `AppShell.tsx`
- Room, wall, door and fixture art and geometry: the room, door, cutaway,
  layout and exterior files under `facility/`
- Character identity, roster, appearance presets, hiring pools and asset
  manifests. Exception: Claude may add new motion frames after the owner
  approves the art.
- Launchers, ports, origins, deployment, GitHub Pages, commits and pushes

## 3. Working rules

1. **Do not touch others' uncommitted work.** The worktree normally holds a
   large amount of uncommitted Codex work. Claude never reverts, restages,
   reformats, or bulk-rewrites files it did not change. Claude never runs
   `git checkout --`, `git stash`, `git reset`, or broad `git add`.
2. **Claim before editing.** Before an edit, Claude logs the task, its files,
   and the intended change in §4. Codex should check §4 before editing a
   claimed file, and should log here if it must edit one anyway.
3. **Keep edits small and labeled.** In `FacilityScene.ts`, Claude edits only
   motion code. Claude prefers to move new motion logic into small, pure,
   testable modules under `facility/` rather than grow the scene file.
4. **Keep the owner's preferred movement.** The current baseline (§5) is the
   owner-approved fallback. Experiments sit behind a flag or in a separate
   module, so the baseline can be restored without reverting unrelated work.
   Do not replace the baseline until the owner accepts a change in a playtest.
5. **Validate before handing work back.** Claude runs the affected tests and
   the player typecheck. Claude reports exact pass and fail counts here,
   including failures that existed before its change.
6. **Leave player saves and storage alone.** Claude uses isolated QA ports and
   contexts, never the owner's `http://127.0.0.1:4173` profile storage.
7. **Do not commit or push.** Codex runs checkpoints. Claude lists which of its
   files are ready to checkpoint.
8. **Keep generation efficient.** Claude reads files narrowly, uses sub-agents
   sparingly, and asks before any bulk sprite generation or batch rendering.
9. **Owner approval gate.** Owner rule, set 2026-10-05: the owner must
   specifically approve any change before Claude makes it in the game. Claude
   shows proposals outside the game first, for example a comparison page. It
   records the exact approval in §4 before editing game code. Test-only
   repairs approved in §6 are not game changes.

## 4. Active claims and work log

Format: `date — agent — status — task — files — notes`.
Status is one of `claimed`, `in progress`, `ready for review`, `done`,
`released`.

- 2026-10-05 — Claude — done — Created this coordination document. Wrote no
  code. — `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md` — No other files
  changed.

- 2026-10-05 — Codex GS Manager — done — Answered coordination questions
  at the owner's request after reading native task status, completion handoffs
  and current source. Terra performed a read-only motion/test review. Only this
  document edited; no runtime changes or fresh test execution. See dated answers
  in section 6. No Claude implementation claim has yet been logged here.

- 2026-10-05 — Claude — ready for review — Repaired the three stale
  pause/arrival tests under the Q3 approval. Test-only change. —
  `apps/player/src/facility/characterPauseArrival.test.ts` — No production
  file edits.
  - **Bounce peak:** now expects 7px instead of 3px. It also asserts zero
    sway angle for a side-facing walker, across a pause and a resume with a
    discarded delta.
  - **Removed call:** the test called `characterStepBounceLift`, which no
    longer exists. That case is now its own test, which drives
    `characterStepMotion` directly. A front-facing step stopped at 125ms
    (lift 3.5px, angle 1.06°) settles with smoothstep easing over 120ms:
    halfway at 60ms, held exactly while frozen, and zero lift and angle from
    120ms on. Seated and exam-table poses ground at once after moving. An
    idle actor that never moved stays grounded.
  - **Mocks:** the neutral `Graphics` and bitmap actor mocks now have
    chainable `setAngle` spies. New assertions cover angle passthrough
    (1.25° on the retained same-identity bitmap), reset to 0 on the next
    call, the frozen side-facing angle of 0, and the neutral fallback angle
    of 0.
  - **Preserved:** every original pause, freeze and identity assertion is
    unchanged, and no case is skipped.
  - **Results on 2026-10-05:**
    - Focused file: 14/14 pass.
    - Motion suite (`characterPresentation`, `characterMotionPresentation`,
      `routeMotion`, `lateralGaitProof`, `characterBitmapArt`): 41/41 pass.
    - Full player `vitest run`: 92 files, 580/580 pass (previously 576/579).
    - `npm run typecheck` (player): pass.
  - **Checkpoint:** the file was already untracked Codex work, so it remains
    untracked. Ready for Codex's next checkpoint.

- 2026-10-05 — Claude — awaiting owner picks — "Walk Lab" comparison page.
  It compares current movement with three no-new-art ideas: (1) ground
  shadow, (2) hop steps, (3) squash and stretch, plus all three combined. —
  No repo or game files changed. — Details:
  - **Location:** a private claude.ai artifact the owner can open:
    https://claude.ai/artifact/HJrmDiSQhPak38qSE3k2XC. Codex may not have
    access. Its source is in Claude's session scratchpad, not the repo.
  - **Content:** four real standing-still identities embedded read-only:
    founder.01, gs026-employee-001, gs022-new-employee-003 and
    patient.adult.001.
  - **Current lane:** copies the game's own numbers (§5) and rendering:
    nearest-neighbour scaling, whole-pixel positions, the identity height
    cap, and 2 tiles/s at 1× with 1×/2×/4× speeds.
  - **Proposed defaults:**
    - Shadow: about 0.6 × sprite width, 30% alpha, shrinking 20% and fading
      40% at the bounce peak.
    - Hop steps: stride of one tile, so feet land on tile centres and arrival
      position and time are unchanged; forward offset
      `-plant·sin(2πs)/(2π)`, plant 90%.
    - Squash and stretch: 6% squash at contact (cos⁶ pulse), 3% stretch
      (sin²), and a 160 ms landing squash on stop, all pivoting at the feet.
  - **Next:** the owner picks lanes and settings on the page. Nothing goes
    into the game until the owner approves it under rule 9.

- 2026-10-07 — Owner — **approved (rule 9)** — Combined lane 1 + 2 + 3 from
  Walk Lab round 1, with the north/south walking sway removed. — Approved in
  chat. Approved values for the non-Current lanes:
  - Bounce: 7 px, 2 Hz at 1× (unchanged).
  - Plant: 100%, hop steps with a one-tile stride.
  - Squash on landing: 3%. Stretch in the air: 2.5%.
  - Shadow strength: 150% (alpha 0.45 at the ground).
  - Sway walking north or south: 0° (owner request).
  - Settle: 120 ms (unchanged).

  Not implemented yet. Plan: one in-game integration pass after the owner
  decides on round 2. It goes behind a switch, with today's movement as the
  fallback, and the owner tries it in the real game before it becomes the
  default. Claude will log exact files and regions here before editing.

- 2026-10-07 — Claude — awaiting owner picks — Walk Lab round 2, published
  to the same artifact URL (version 2). No repo or game files changed.
  - **Lane 2:** the owner's approved jump with no sway.
  - **Idea 4, paper-flip turns:** when the facing changes, the still squeezes
    on the x axis to a sliver and opens on the new facing. Default 140 ms,
    in real time; the change happens at the midpoint. It also applies on
    stopping, sitting and setting off.
  - **Idea 6, breathing and sit-down:**
    - Breathing: 1.5% vertical scale over a 3.2 s period, easing in
      250–700 ms after a stop.
    - Sit-down: the character starts 6 px above the seat and drops in over
      110 ms, then a 4% squash over 130 ms. Today, seated poses ground at
      once.
  - **Route:** now ends at a stand-in chair aligned to each identity's
    `sit-south` `seatContactY`.

- 2026-10-07 — Owner — **approved (rule 9)** — Ideas 1 + 2 + 3 + 6. This
  supersedes the 1 + 2 + 3-only approval above. Idea 4 (paper-flip turns) is
  not approved. — Approved in chat with Walk Lab round 2 picks. Approved
  values:
  - Bounce: 7 px. Plant: 100%. Squash: 3%. Stretch: 2.5%. Shadow: 150%.
  - Sway walking north or south: 0°.
  - Breathing: 2% vertical scale over a 3.2 s period, easing in 250–700 ms
    after a stop.
  - Sit-down: drop from 6 px over 110 ms, then a 4% squash over 130 ms.

  2026-10-07 update: the owner declined idea 5. The final approved scope is
  1 + 2 + 3 + 6. Before implementing, Claude is putting integration
  recommendations to the owner; the owner's answers will be logged here.

  Still not implemented. Idea 5 (rounded corners and turning early) was
  reviewed in round 3 (artifact version 3).

- 2026-10-07 — Owner — **decisions (rule 9)** on the integration
  recommendations:
  - **Speed cap:** at most 4 hops per second. The hop stride is 1 tile at 1×
    and 2×, and 2 tiles at 4×.
  - **Exam table:** gets the drop-in and breathing (no floor shadow while
    lying on the table).
  - **Every character** in the game gets the new movement: founder, staff,
    patients, visitors, retail and ambient pedestrians.
  - **Desync required:** characters, including pairs pathing together, must
    not hop or breathe in unison. Method: a stable per-character pseudo-random
    seed from a hash of the character key.
    - Hops: each character's first hop is shortened by 0–50% of a stride.
    - Breathing: a per-character phase, and a period within ±15% of 3.2 s.
  - **Old movement removed** for all characters: no switch, no
    `?motion=classic` fallback. The 7 px time-driven bounce, the north/south
    sway and the instant seated grounding are retired. The old style stays
    recoverable from backup commit `d304797` and
    `artifacts/checkpoints/preferred-bounce-20261004/`.

- 2026-10-07 — Claude — ready for owner playtest — Implement the approved
  1 + 2 + 3 + 6 movement. — Files:
  - New: `apps/player/src/facility/characterHopMotion.ts` and its test.
  - Edit: `apps/player/src/facility/characterPresentation.ts` (remove the old
    step-bounce constants and functions) and its test.
  - Edit: `apps/player/src/facility/characterPauseArrival.test.ts`.
  - Edit: `apps/player/src/facility/FacilityScene.ts`, in these regions only:
    the motion imports and fields, the `update()` motion clock,
    `getCharacterRoutePresentation`, `characterStepMotion`,
    `drawCharacterPresentation`, `drawPixelPerson`,
    `getCharacterBitmapContainer` (the contact-shadow child), and pruning of
    the motion maps.

  Copies of these files as they were before Claude's edits are in Claude's
  session scratchpad (`baseline-20261007/`), so Claude's diff stays separable
  from earlier uncommitted work. QA uses an isolated port, not the owner's
  4173 profile.

  **Result:**
  - **Pure module:** `characterHopMotion.ts` holds all approved constants,
    the per-character seed (FNV-1a hash of the character key), the stride
    (1 tile, or 2 tiles at 4×), the hop phase advanced by route distance, the
    stall handling, the settle, the landing squash, the seat/exam-table drop,
    breathing and the shadow values.
  - **`FacilityScene.ts` integration** (one pass, covering every character
    type):
    - `getCharacterRoutePresentation` resamples the route at
      `progress − hopOffset` while walking, and eases the offset out along
      the last travel direction after a stop.
    - `characterStepMotion` returns the lift, scale and shadow, and is reused
      exactly when frozen.
    - `drawPixelPerson` applies the scale around the feet. The angle/sway
      parameter is removed.
    - Each bitmap container gets a `shadow` image child, which stays at the
      floor. It uses one shared 64 px radial-gradient canvas texture,
      `character-contact-shadow`.
  - **Removed:** the time-based 2 Hz bounce clock
    (`characterStepBounceMilliseconds`), the sway, and the old exports from
    `characterPresentation.ts`. The breathing clock is real time and freezes
    while paused or in build mode.
  - **Unchanged:** `routeMotion.ts`, domain code, routes, travel speed,
    arrival times and saves.
  - **Validation on 2026-10-07:**
    - Player typecheck: pass.
    - Full player `vitest run`: 95 files, 593/593 pass. This includes 12 new
      `characterHopMotion` tests and the updated `characterPauseArrival`
      tests.
    - Isolated browser QA on port 5175, using `.claude/launch.json` config
      `player-qa-5175`, a fresh test profile and a new campaign: no console
      errors. Magnified canvas captures showed the founder mid-hop with the
      shadow left on the floor, landing back onto it, and passing correctly
      behind the desk chair.
    - The QA server is stopped. Owner saves at 4173 were not touched.
  - **Owner pathway:** unchanged. `START_GAME.cmd` →
    `http://127.0.0.1:4173` runs the Vite dev server from source, so a page
    reload there shows the new movement. Saves are unaffected because this
    is presentation only.
  - **Not yet checkpointed:** Codex should include these files in the next
    audited backup when the owner says "push to GitHub". The pre-edit
    `FacilityScene.ts` diff is saved at
    `scratchpad/claude-facilityscene-20261007.diff`.

- 2026-10-07 — Owner — confirmed in the real game ("It looks good") and said
  "push to GitHub".
- 2026-10-07 — Claude — checkpoint — Created a recovery archive,
  `artifacts/checkpoints/hop-motion-20261007/`, following the 2026-10-04
  pattern:
  - full copies of the motion sources and tests;
  - a motion-only `FacilityScene` patch, verified to reproduce the live
    renderer byte for byte from the captured baseline;
  - SHA-256 hashes and a manifest with 11 payloads;
  - the Walk Lab template and its build script;
  - the validation record.

  Shared dirty files such as `FacilityScene.ts` are not staged whole. The
  checkpoint commit stages only this archive and this coordination file.
  Checks before staging found no secrets, credentials or personal paths, no
  clinical content, and no ignored files. Validation on 2026-10-07: player
  typecheck pass; 93 files, 591/591 tests; focused motion tests 56/56.
- 2026-10-07 — Claude — **backup verified** — Checkpoint
  `091d7fa5efb7f2ba8cc3449e3111b2bccd88a787` was pushed to `origin/beta` and
  confirmed with `git ls-remote`. A note was added to the top of
  `CURRENT_THREAD_HANDOFF.md` but left uncommitted, because that file holds
  Codex's uncommitted edits. The live motion code stays uncommitted in the
  shared worktree; the archive is the recovery copy. There was no merge,
  release, deployment or Pages publication.
- 2026-10-07 — Claude — **ready for review** — Fix the stutter at every
  minute boundary, which grows with campaign length. This is outside the
  animation scope; the owner approved all four fixes in chat on 2026-10-07.
  - **Diagnosis:** route interpolation and world redraws are fine. Every tick
    blocks the main thread, and the block grows with retained history. With
    500 resolved encounters the state is 4.4 MB; the reducer takes 12.6 ms,
    of which the JSON clone is 10.4 ms.
  - **Fix 1, retired encounters:** owner decision: "we probably don't need
    to save the finished patients at all".
    - At the end of ADVANCE_TICK, `retireDepartedEncounters`
      (new `packages/game-domain/src/retired-encounters.ts`) deletes resolved,
      off-map, non-tutorial encounters that no live record references. The
      newest 10 are kept, so the Resolved folder and recent "Open chart"
      links still work.
    - Removed encounters are folded into the optional
      `GameState.retiredEncounterSummary`, which needs no schema bump and is
      normalized on load:
      - completed count;
      - first ordinary completion;
      - in-house endoscopy milestone;
      - up to 32 satisfaction samples;
      - the latest arrival per patient still.
    - `getCompletedEncounterCount`, both rolling-satisfaction functions, the
      first-ordinary success alert, the Level 2 endoscopy gate and patient
      still rotation all read the summary.
    - The 8-day GS-017 supply diagnostic matches its original snapshot
      exactly: 79 arrivals, 78 completed.
  - **Fix 2:** optional shopping skips resolved, finished and departed
    actors. Amenity scheduling skips resolved off-map patients and finished
    visitors. Outcomes are unchanged.
  - **Fix 3:** patient-list resolution ticks are indexed once instead of
    being searched inside the sort comparator. The map patient filter uses a
    single Set of active-operation encounters. Recent receipts use a linear
    stable top-8.
  - **Fix 4:**
    - `gameReducer` skips its second whole-facility synchronize after an
      unpaused tick, which already synchronized. A 900-tick idempotence test
      covers this.
    - Earnings popups only expire while the per-tick receipt list is
      unchanged. Actor anchors are collected lazily. This removes an
      all-receipts pass on every frame.
  - **Measured:** the 500-encounter save drops from 4.4 MB to 686 KB after
    its first tick. Reducer median goes from 12.6–16 ms to 2.5 ms; clone
    from 10–15 ms to 2.1 ms.
  - **Browser check:** isolated port 5191, test storage only. A campaign
    injected with 300 finished patients saved at 232 KB with 11 encounters,
    and reported 240 completed and historical satisfaction 76, both
    identical to before. No console errors. The server is stopped.
  - **Validation:**
    - Domain typecheck pass; 1710 pass and 8 fail of 1718.
    - The 8 failures exactly match the pre-change baseline. They are
      full-suite slow GS-028, surgery-center, supply and service tests, and
      they pass when run alone.
    - Player typecheck pass; 95 files, 594/594.
  - **Files:**
    - Modified: `packages/game-domain/src/{reducer,retail-operations,
      patient-amenities,selectors,appearance,persistence,types,index}.ts`,
      `apps/player/src/session/viewModels.ts`,
      `apps/player/src/facility/{earningsPopupPresentation,FacilityScene}.ts`
      (earnings popup call only), and
      `packages/game-domain/tests/diagnostics/patient-supply.test.ts`
      (counts retired history).
    - New: `packages/game-domain/src/retired-encounters.ts`,
      `packages/game-domain/tests/{retired-encounters,
      tick-history-performance}.test.ts`,
      `apps/player/src/facility/earningsPopupFrameCost.test.ts` and
      `apps/player/src/session/newestServiceIncomeReceipts.test.ts`.
  - **Known limits:**
    - Retired patients' receipts show "Patient" instead of a name in recent
      receipts.
    - A retired id could be re-admitted by debug-only ADMIT_PATIENT.
    - Receipts, settlements and completed operations still grow; they are
      small per record.
  - **Saves:** the owner's existing campaign at `127.0.0.1:4173` will drop
    old finished patients on its first tick under this code. That is
    intended and cannot be undone.
- 2026-10-07 — Claude — **ready for review** — Cap income receipts and
  finished service operations. The owner asked for this "if that doesn't
  affect gameplay".
  - **New module:** `packages/game-domain/src/retired-service-history.ts`.
    `retireFinishedServiceHistory` runs right after `retireDepartedEncounters`
    at the end of an unpaused tick.
  - **Receipts kept:**
    - the newest 50;
    - any receipt whose source can still credit it: an undelivered pending
      result, an active service operation, or an active retail operation;
    - ambulatory receipts without a QI review;
    - anything settled within the last operating day.
  - **Finished operations kept:**
    - the newest 10;
    - any operation referenced by encounters (pending-result, continuation,
      staged and terminal links), active retail operations, amenity trips,
      non-departed companions, or founder and employee targets;
    - visitors named on retained receipts;
    - every finished operation whose `location` is not null.
  - **Summary:** retired totals (in cents) and four milestone flags go to the
    optional `GameState.retiredServiceHistory`, normalized on load. The
    economy totals and the Level 2 and 3 endoscopy and ambulatory gates read
    it. Per-actor retail and amenity map entries are deleted for retired
    visitors and patients.
  - **Behaviour unchanged:** A/B run of the 8-day GS-017 autoplay with
    retirement on and off (`.local-dev/claude-stutter/ab-retirement.test.ts`).
    Live state, cash, events, learning, progression, satisfaction, completed
    count and totals are identical. Size drops from 1.45 MB to 1.07 MB.
  - **Synthetic save:** 3000 receipts and 500 finished operations go from
    1.33 MB to 0.12 MB; clone from 3.4 ms to 0.37 ms.
  - **Validation:**
    - Domain typecheck pass; 1715 pass and 7 fail of 1722. The failures are
      a subset of the same load-slow baseline.
    - Player typecheck pass; 594/594.
  - **Open question for the owner:** this is a latent bug, left unchanged on
    purpose. At `reducer.ts` ~3435, the procedure-consult room check counts
    `operation.location` with no status filter. Finished encounter test-order
    operations keep their in-room location (`service-operations.ts` ~1774),
    so they keep marking Endoscopy and OR rooms as occupied. Fixing the
    check would change consult routing, so it needs owner approval.
  - **Growth that remains:** terminal `retailOperations`, departed
    `retailExternalActors`, `retailOrders`, `levelThreeQiReviews` and
    `settlements`.
- 2026-10-07 — Claude — **ready for review** — Fixed the stale-location
  procedure-consult room bug. The owner approved the fix in chat: "Patients
  should wait in the waiting rooms or around the clinic if they have no
  where else to be. They do not occupy the in-clinic room while waiting for
  the results."
  - **Fix:** in `reducer.ts`, the procedure-consult occupancy check now
    counts `operation.location` only for non-finished operations. This
    matches the other room-occupancy checks (~1310 and ~10109).
  - **Patient routing:** confirmed unchanged and already correct. Finished
    in-suite tests send the patient back to the Front Desk and then to the
    waiting hierarchy (`maybeBeginOnsiteFrontDeskReturn`, then
    `returning_from_onsite_service`, then `walking_to_waiting`). Only an
    unreachable entrance path leaves them in place.
  - **Cleanup rule:** finished operations no longer need a null `location`
    to retire.
  - **Regression test:** added to the colonoscopy flow in
    `tests/level-two-endoscopy.test.ts`. Another patient's finished
    in-suite test with a stale in-room location must not move the returned
    procedure consult out of the Endoscopy suite. It fails on the old check
    and passes on the new one.
  - **A/B rerun:** the 8-day retirement A/B is still identical.
  - **Concurrent changes, not caused by this fix:** Codex is adding the
    `2026-10-07-variety` clinical batch (291 to 311 cases) and a Level 3
    room. That breaks clinical-admission and withdrawal tests, the GS-017
    diagnostic snapshot (unseen-concept list), patient-supply,
    `game-domain` content validation and the player
    `level3ControlsViewModels` room count (7 to 8). The diagnostic runs at
    Level 1 with no endoscopy suite, so the consult fix cannot affect it.
    Retail and service tests that fail in the full suite pass when run
    alone.
- 2026-10-07 — Claude — **ready for review** — The owner's campaign still
  stuttered after the history caps. The owner approved read-only
  measurement of the real save through Claude in Chrome. A copy was taken
  to Claude's scratchpad only; the save itself was not edited, and the
  owner's tab ran the game throughout.
  - **Real save:** Level 3, 63 rooms, 17 staff. Ticks cost 100–275 ms in
    the reducer plus 50–120 ms in the view.
  - **Root cause:** a CPU profile showed whole-facility
    `validateFacilityAccess` at about 81% of tick time. It is recomputed
    dozens of times per tick by:
    - `getFacilityAccessValidation`, via operational, staffing and
      scheduling checks, companions and views;
    - `facility-experience.ts` `accessValidation`.
  - **Fix:** new `packages/game-domain/src/facility-access-cache.ts`
    memoizes the result per DomainContext, keyed on room id, definition,
    x, y, orientation and doorSide plus `JSON(doors)`. Those are the only
    room fields `doors.ts` and `spatial.ts` read. Callers get fresh copies
    of the arrays. `selectors.getFacilityAccessValidation` and
    `facility-experience` both use it. Hypothetical build validation and
    migrations still call `validateFacilityAccess` directly.
  - **Measured on the owner's save:** reducer 10–15 ms and view 4–5 ms per
    tick. An idle 900-tick run, with unattended patients piling up, has a
    reducer median of 38 ms (it was 356 ms).
  - **Also in this pass:**
    - `retireDepartedEncounters` now retires resolved encounters whose
      `pendingResult` is delivered. 90 such records remained in the owner's
      save, 1.7 MB.
    - New `retireFinishedRetailHistory` retires terminal retail trips,
      departed shoppers and companions, and used-up orders. It keeps the
      newest 10, itinerary-linked trips, receipt-named actors and departed
      companions of non-resolved encounters (the duplicate-companion guard).
  - **Equivalence:** the A/B with retirement on and off is identical on the
    8-day GS-017 run and on a 900-tick run of the owner's save.
  - **Validation:** focused tests pass. Player typecheck passes.
  - **Concurrent failures, from Codex's work in progress:**
    - character-still catalog and roster;
    - content validation, GS-028 and patient-supply (the variety batch);
    - player `level3ControlsViewModels` room count;
    - `diagnostic-timing` intermittently; it passes alone.
  - **Note for Codex:** in the new `diagnostic-timing.ts`,
    `getDiagnosticOrderPlans` collects plans from all encounters, and the
    reading-station stability logic (~line 150) reads historical plan
    resources. Retired encounters' plans are no longer present. Please
    confirm that is acceptable, or keep reading assignments elsewhere.
- 2026-10-07 — Claude — **backup verified** — The owner confirmed in play
  that the stutter is gone and asked to "push to GitHub". Checkpoint
  `dcf3f075746082a89de84ec8a3e48a53f6bf8807` (`backup: preserve
  owner-verified minute-boundary stutter fix`) was pushed to `origin/beta`
  and confirmed with `git ls-remote`.
  - **Archive:** `artifacts/checkpoints/minute-stutter-20261007/`. It
    contains full copies of the 8 new files, 14 Claude-only patches for
    shared dirty files (each verified to rebuild the live file byte for
    byte), the manifest with hashes, and the validation record.
  - **Not staged:** shared dirty source files, other sessions' log entries,
    `.local-dev` evidence and the owner's save.
  - **Live code** stays uncommitted in the shared worktree; Codex's next
    integrated checkpoint should include it.
  - **Not done:** no merge, release, deployment or Pages publication. The
    owner pathway is unchanged.

- 2026-10-07 — Codex — in progress — Execute the owner-requested patient women-20 v3 art specification. Root owns pilot001, source/contact acceptance and integration decisions; Sol patient_women_artist_a owns sources002–010, Sol patient_women_artist_b owns sources011–020, and Sol patient_women_packaging owns only new staging/build/validation/gallery outputs. Exact native image_gen sheets, prompts, arguments and provenance are retained. Existing Claude motion, runtime catalogs, saves and clinical data are untouched. Active plan: docs/execplans/patient-women20-stills-20261007.md. Owner visual review precedes runtime registration per the batch contract.

- 2026-10-07 — Claude — in progress — Owner-directed room touch-ups (scope
  expanded by the owner on 2026-10-07 to GS-015-style room work). Owner asked
  for: soft wall-base shadows, filling empty lower halves, a shared house-green
  trim with per-room accent colours, occasional corridor benches/plants/art,
  dim imaging rooms plus warm Break Room and cool OR tints, every room-by-room
  item from Claude's review, and the north-backing furniture-hiding fix.
  Every wall segment must stay a legal door; new decor is nonblocking and
  hides when its door is placed. Owner also directed removing the Call Room
  from the Level 4 plan; MRI is the next new room.
  - **Step 1 (now):** isolated preview lab only, under
    `tools/room-design/touchup-2026-10/`. It reads game modules read-only.
    No game code, art, saves, launcher or tests touched.
  - **Step 2 (after owner approval):** integrate into the renderer. Expected
    files: `apps/player/src/facility/FacilityScene.ts` (shell paint and
    fixture visibility), `approvedRoomPresentation.ts`,
    `approvedLevel3RoomProofData.ts`, and new decor data/art. Claude will log
    the exact files here before editing them.
  - **Status 2026-10-07: preview ready for owner review.** Lab at
    `tools/room-design/touchup-2026-10/` (see its README). 22 rooms,
    `node validate.cjs` passes 4,128 door→anchor routes across single,
    all-open and north-backed door states. Review server `room-lab-4191`
    added to `.claude/launch.json` (127.0.0.1:4191; separate from the owner
    origin 4173, no saves touched). Also found: several approved edge
    fixtures have no door owners in runtime data (exam sink/otoscope panel,
    waiting magazine rack and corner plant), and some legal door segments
    open into permanent furniture (vending, bathroom, waiting bench, CT
    scanner and others; list in the README). The latter awaits an owner
    decision. Docs: Call Room removed from the Level 4 list in
    `docs/features/facility-levels-and-clinical-release-points.md`,
    `docs/execplans/level-four-room-design.md` and one flavour line in
    `docs/features/alert-notification-flavor-system.md`.
  - **Owner decisions 2026-10-07 (same day):** tall north-wall furniture
    stays full height on a low wall and depth-sorts by its own floor line
    (things north of it draw behind); imaging-room dimming stops at the north
    wall's real height; doors that open into permanent furniture are allowed
    and that furniture is passable (23 slots to add to
    `doorThresholdExceptions`; list in the lab README). Preview updated; still
    awaiting final approval before any runtime edit.
  - **Owner approved runtime integration 2026-10-07** ("Once that is fixed
    then all of these can be implemented into the game", after the Break
    Room south-sitter layering fix). Claude is now editing, with small
    targeted hooks only because Codex diagnostic-timing work and another
    Claude session are active in the same files:
    `apps/player/src/facility/roomTouchups.ts` (new, all data and pure
    drawing math, shared with the lab), `apps/player/src/facility/FacilityScene.ts`
    (preload decor, wall bands, floor shadows/decals, record visibility and
    depth, decor images, lighting, CT glass, corridor), new art
    `apps/player/public/art/rooms/touchup-v1/*.png` (25 project-made PNGs),
    `packages/balance-config/src/approved-room-layouts.ts` (23 passable door
    slots via `doorThresholdExceptions`), plus focused tests.
  - **Integration progress 2026-10-07 (Claude):** renderer hooks, decor art,
    23 passable door slots and an exam-table east passage tile (EA door) are
    in. Legacy-save migration deliberately keeps the pre-rule door slots via a
    frozen list in `packages/game-domain/src/approved-room-geometry-migration.ts`
    (`OWNER_PASSABLE_DOOR_SLOTS_2026_10_07`), so old saves migrate exactly as
    before; its 16 tests pass unchanged. New test:
    `packages/game-domain/tests/owner-passable-door-slots.test.ts`.
    Player typecheck PASS; facility tests 243/243 PASS where they load.
    **Codex heads-up:** `packages/clinical-content/src/development-batch/
    2026-10-07-variety/radiology.ts` currently has garbled identifiers
    (`HIeES`, `evidencehlaimIds`, earlier `DEedCE`) that crash the player
    app and block test imports. Claude did not touch it.
    (Resolved by Codex at 16:39; app loads again.)
  - **Status 2026-10-07: done — integrated and verified locally (Claude).**
    Exact files: new `apps/player/src/facility/roomTouchups.ts`; edited
    `apps/player/src/facility/FacilityScene.ts` (imports, decor preload,
    floor touch-ups in `drawApprovedRoomSurface`, wall bands in
    `drawApprovedRoomCaps` and `drawApprovedHallwayExposedEdges`, record
    visibility/depth plus decor, lighting and CT glass in
    `drawApprovedRoomFixtures`, corridor hooks in `drawRoom`; new private
    helpers `getApprovedSegmentState`, `getApprovedRoomVariant`,
    `getApprovedBaseWidth`, `getTouchupDrawRecords`, `drawTouchupPrimitives`,
    `drawTouchupSprite`, `drawTouchupLighting`, `drawTouchupCorridor`);
    new art `apps/player/public/art/rooms/touchup-v1/` (25 PNGs);
    `packages/balance-config/src/approved-room-layouts.ts` (23 passable slots
    plus `examination-table-east-passage`, coexisting with Codex's new
    `room.reading` entry); `packages/game-domain/src/approved-room-geometry-migration.ts`
    (frozen legacy rule list); new tests
    `packages/game-domain/tests/owner-passable-door-slots.test.ts` and
    `tests/e2e/room-touchups.spec.ts` (run only with
    `GAMIFY_E2E_EXTERNAL_SERVER=1 GAMIFY_E2E_BASE_URL=http://127.0.0.1:5175`).
    Results: player typecheck PASS; player vitest 610/611 (the 1 failure is
    `level3ControlsViewModels` expecting 7 Level 3 rooms, now 8 after Codex's
    Reading Room); domain migration 16/16, passable doors 22/22, service and
    surgery-center suites PASS in isolation; remaining domain failures are
    Codex clinical/diagnostic-timing work in progress; balance-config 51/51;
    production build PASS (output to scratch, `dist/` untouched); e2e
    capture PASS on isolated port 5175 (fresh Playwright storage), evidence
    in `artifacts/screenshots/room-touchups/`. Lab validator 22/22 rooms.
    No saves, launcher, owner origin 4173, commits or pushes touched.
    Reading Room has no touch-up entry yet (add one in `roomTouchups.ts` if
    the owner wants it trimmed/dimmed like the other imaging rooms).
  - 2026-10-07 — Claude — in progress — Owner revision round 2: imaging dim
    only while a scan is running (CT not dimmed); dim stops at the top of the
    south wall; back-wall furniture in a tinted room tinted in full; hallway
    gets a south wall where it backs rooms; front decor larger and clear of
    walls. Additional files: `apps/player/src/facility/types.ts` (new optional
    `imagingActiveRoomInstanceIds`), `apps/player/src/session/viewModels.ts`
    (derive it beside `endoscopyOccupancy`), `facilityWorldSignature.ts`
    (redraw when it changes), plus `roomTouchups.ts` and `FacilityScene.ts`.
    **Done 2026-10-07.** Imaging dim is gated on
    `imagingActiveRoomInstanceIds` (in-service imaging operations plus
    encounter patient travel inside its service window); CT has no dim;
    tint region ends 6 shell px above the floor line (top of the south wall);
    furniture rising above the tinted region gets a cropped multiply-tinted
    copy (`drawTouchupTintedTop`, canvas textures `room-touchup-tint:*`);
    low north walls backed by a hallway paint as a short cream wall
    (`isHallwayTileAt`); decor ~1.4x larger with wall clearance. New unit
    test `apps/player/src/facility/roomTouchups.test.ts` (4/4). Player
    619/620 (same Codex Level 3 room-count test), typecheck and build PASS,
    lab validator 22/22 incl. new wall-clearance rule, e2e PASS on 5175 with
    imaging on/off captures in `artifacts/screenshots/room-touchups/`.

- 2026-10-07 — Claude — **investigation done; awaiting owner approval** —
  Owner report: stutter/lag, coffee customers shown ~10 tiles from the kiosk
  then jumping to it, characters appearing at the front door instead of
  walking the sidewalk, characters popping in or jumping across the map.
  No game code changed. Evidence harness (scratch, not a game test):
  `.local-dev/claude-motion-jumps/` runs the real domain + real facility view
  model and replays `routeMotion.ts` at 60 fps, flagging any frame jump >0.6
  tile. Proposed render-only module: `routeMotionProposed.ts` there.
  - **Cause 1 (render):** every route that starts from a standstill is
    already advanced 2 nodes when first seen (created and advanced in the
    same tick). With no track, the renderer starts at `pathIndex`, so the
    character pops 2 tiles. ~1 pop per patient departure.
  - **Cause 2 (render):** the renderer walks at exactly canonical speed with
    no catch-up. Phaser replaces any frame delta >200 ms with an old ~16 ms
    delta, so each main-thread stall loses render time permanently while
    ticks continue. With a 250 ms stall every 3 ticks, on-screen lag reaches
    5.8 tiles (p95 4.6). Later route changes then shortcut or snap; a dropped
    track (`syncRouteMotion` returns undefined) teleports to the logical spot.
    Likely source of the kiosk report in a heavy campaign (not reproduced at
    10 tiles in the harness).
  - **Cause 3 (render):** route handoff only searches shared waypoints at or
    after the render's own progress. The render runs up to 2 tiles ahead
    (lookahead), so a reversed/replaced route finds no shared point and
    snaps back 1.4–3 tiles.
  - **Cause 4 (domain, outside scope):** walk-in retail shoppers
    (`retail-operations.ts` `createExternalRetailVisitor`,
    `authorizeRetailOrder`) and peri-op companions (`ensureCompanions`) spawn
    on `entry.outside`, the tile at the front door. Non-peri-op companions
    spawn on the patient's tile. Service visitors and patients correctly
    start offscreen and walk the sidewalk.
  - **Possible cause 5 (domain, unconfirmed):** a waiting patient sent
    off-site was placed in the exam room (4.5-tile jump). Seen only with the
    harness autoplay answering instantly; not confirmed in real play.
  - **Proposed render-only fix (A+B+C), in `routeMotion.ts` plus the scene's
    track delete:** (A) park finished/stationary actors as a one-point track
    so the next route starts where they stand; (B) catch-up up to 2.5x
    canonical speed while trailing the logical position by >0.5 tile;
    (C) let handoff match shared waypoints back to the previous logical
    position and walk back along the known edge.
  - **Harness results (Level 2 retail clinic, 30 game-minutes):** jumps 41 →
    1 (the 1 is the very first frame after load); with stalls, max lag
    5.8 → 2.1 tiles. Level 1 clinic: 37 → 11, all 11 being cause 5.
    Existing `routeMotion.test.ts` against the proposal: 15/17; the 2
    failures pin exact canonical speed while trailing, which (B)
    intentionally changes.
  - **Next:** owner approval for A+B+C (render) and, separately, for the
    cause 4 domain spawn change. Note another Claude session is currently
    integrating room touch-ups in `FacilityScene.ts`; any motion edit there
    must be a small labelled hunk.
- 2026-10-07 — Owner — **approved in chat**: "Yes, implement fixes for 1-3.
  Get rid of front door appearances, everyone should start off-screen and
  walk along the sidewalk on their way into the building and also walk along
  the sidewalk all the way off screen when leaving".
- 2026-10-07 — Claude — **claim, in progress** — Implement the approval.
  - Render (A+B+C): `apps/player/src/facility/routeMotion.ts`,
    `routeMotion.test.ts`, and the route-track delete in
    `FacilityScene.ts` `getCharacterRoutePresentation` (motion hunk only).
  - Domain (owner-approved, outside the usual scope): spawn and exit paths
    for walk-in shoppers and companions in
    `packages/game-domain/src/retail-operations.ts`, plus any other actor
    found entering or leaving at the door, with focused domain tests.
- 2026-10-07 — Claude — **ready for owner playtest** — Approval implemented.
  - **Render, `routeMotion.ts`:**
    - (A) `parkRouteMotion` keeps a finished route as a one-point "parked"
      track. A first-seen stationary actor is parked too. The next route
      hands off at its first waypoint instead of popping 2 nodes ahead.
      A parked track is dropped when the actor is absent or moved, so
      off-site and teleported actors behave exactly as before.
    - (B) `routeMotionStepTiles` adds catch-up while the render trails the
      logical position by >0.5 tile: +0.5x per tile, capped at 2.5x, never
      past the predictive target.
    - (C) handoff also matches shared waypoints back to the previous logical
      position, then walks back along the known edge.
  - **Render, `FacilityScene.ts`:** motion hunk only in
    `getCharacterRoutePresentation`. It parks instead of deleting finished
    tracks, keeps the last facing for a first-seen parked actor, and uses
    `routeMotionStepTiles` for hop distance, so steps match catch-up speed.
  - **Domain, `retail-operations.ts`:**
    - New `streetArrivalPoint`, `isStreetOrigin` and `pathFromStreet`.
    - Walk-in shoppers (`createExternalRetailVisitor`,
      `authorizeRetailOrder`) and peri-op companions start off-map at x=-2
      or gridWidth+1 on the street row, then walk the sidewalk and front
      door.
    - Patient companions (non-peri-op and legacy endoscopy) also start
      off-map. They walk in at travel speed with lifecycle `arriving`, then
      `onsite`. If the patient is in a care room the public cannot reach,
      they wait at a public waiting spot instead of standing on the
      patient's tile.
    - Newly created shoppers and companions hold their off-map start for
      their first tick, as patients do, so they never pop in on an edge tile.
  - **Domain, `displaced-routing.ts`:** `findRouteFromDisplacedLocationOffscreen`
    walks an actor already on the street row (or off-map) straight to the
    nearer edge. Before, an off-map start found no route and left a
    departing shopper stuck.
  - **Already correct, unchanged:** patients, service visitors and their
    companions, off-site returns, hired staff, departing staff and ambient
    pedestrians. All exits already walk the sidewalk off-map.
  - **Tests:**
    - New `packages/game-domain/tests/street-arrivals.test.ts`, 3 tests.
    - `routeMotion.test.ts`: 5 new tests. Two expectations updated for
      catch-up speed during handoff.
  - **Validation on 2026-10-07:**
    - Player and domain typechecks pass.
    - Player facility tests 263/263. Full player suite 619/620; the one
      failure, `level3ControlsViewModels` (8 vs 7 controls), is outside
      motion.
    - Related domain files 84/84.
    - Full domain suite 2115/2132:
      - 8 failures are the known slow-under-load set.
      - 4 are timeouts in retail, service-operations and endoscopy files.
        Those files pass alone (449 tests; only the known slow tests fail).
      - 5 are assertions outside this work: diagnostic timing (active Codex
        task), character still catalog (women-20 integration) and
        content/balance contracts.
    - Replay harness against the live code, 30 game-minutes each: Level 2
      retail clinic 0 jumps; with stalls 0 jumps, max lag 2.1 tiles (was
      5.8); Level 1 clinic 0 jumps. The only flagged event is the founder
      appearing at game start. The earlier "possible cause 5" (exam-room
      placement) did not occur in this run; not separately fixed.
    - QA browser, port 5175, QA-only profile: game loads and runs at 4x
      with no console errors. Server stopped.
  - **Owner pathway:** unchanged. `START_GAME.cmd` →
    `http://127.0.0.1:4173`; reload to pick up the change. Saves are
    compatible: no schema change. Companions or shoppers already inside an
    existing save continue from where they are.
  - **Not checkpointed.** Files ready for the next audited backup:
    - `routeMotion.ts` and `routeMotion.test.ts`;
    - the motion hunk in `FacilityScene.ts`;
    - the street helpers and companion edits in `retail-operations.ts`
      (an untracked file shared with other work);
    - the street short-circuit in `displaced-routing.ts` (also untracked);
    - `street-arrivals.test.ts`.
- 2026-10-07 — Owner — said "push to GitHub" and asked to archive the task.
- 2026-10-07 — Claude — checkpoint — Recovery archive
  `artifacts/checkpoints/movement-street-20261007/`, following the hop-motion
  pattern:
  - full copies of `routeMotion.ts`, `routeMotion.test.ts` and
    `street-arrivals.test.ts`;
  - Claude-only patches for the shared `FacilityScene.ts`,
    `retail-operations.ts` and `displaced-routing.ts`, each verified to
    rebuild the live file byte for byte;
  - the replay harness, validation results, and a manifest with SHA-256 for
    12 payloads.

  Shared and untracked source files are not staged whole. The commit stages
  only this archive and this coordination file. Checks before staging found
  no secrets, credentials, personal paths or clinical content, and no
  ignored files.
- 2026-10-07 — Claude — **backup verified** — Checkpoint
  `a84d8c7805af1e642ebc729056c9b7033fa949a2` was pushed to `origin/beta` and
  confirmed with `git ls-remote`. The live source changes stay uncommitted in
  the shared worktree; the archive is the recovery copy. There was no merge,
  release, deployment or Pages publication. Task closed at the owner's
  request.

## 5. Movement baseline (as of October 5, 2026; verify before relying on it)

> **Superseded on 2026-10-07.** The live movement is now the owner-approved
> 1 + 2 + 3 + 6 set in `apps/player/src/facility/characterHopMotion.ts`:
> contact shadow, distance-driven hop steps, squash and stretch, breathing,
> and the seat/exam-table drop, all without sway. See §4. The notes below
> describe the retired style, which is recoverable from `d304797`.

- **Representation:** one directional standing still per character and view
  (front, back, side, mirrored for right-facing), plus procedural motion. Most
  characters have no frame-by-frame walk cycle at runtime.
- **Procedural motion:** a 7px step bounce at 2Hz, north/south sway, and a
  120ms settle on stop (`CHARACTER_STOP_SETTLE_MILLISECONDS`). The owner
  prefers this. It was backed up in `d304797`, recorded in `30508ae`, and
  archived at `artifacts/checkpoints/preferred-bounce-20261004/`.
- **Timing:** logical movement advances on facility ticks driven by a browser
  timer. `routeMotion.ts` interpolates between ticks and looks two intervals
  ahead (`ROUTE_LOOKAHEAD_INTERVALS = 2`) to absorb timer jitter. The scene
  drops the first delta after a pause or freeze.
- **Earlier walk-cycle attempts** (GS-012, GS-019, GS-025, GS-026, and
  `docs/execplans/character-movement*.md` / `character-gait-*.md`) are history
  only. Do not reactivate them without owner approval.
- **Known failing tests:** resolved on 2026-10-05. The three stale
  `characterPauseArrival.test.ts` failures were repaired with test-only
  changes; see §4. The full player suite passes 580/580.
- **Exact constants:** these live in `characterPresentation.ts`:
  - `CHARACTER_STEP_BOUNCE_HEIGHT = 7` and `CHARACTER_STEP_BOUNCE_HERTZ = 2`
  - `CHARACTER_STEP_SWAY_DEGREES = 1.5` and `CHARACTER_STEP_SWAY_HERTZ = 1`,
    for north/south views only (side views get 0)
  - `CHARACTER_STOP_SETTLE_MILLISECONDS = 120`, with a smoothstep ease

## 6. Open questions and requests

Codex or the owner can answer inline below each question.

**Status as of 2026-10-05 (Claude):**

- Q1 is resolved. Claude accepts the terms: claims are snapshots, not locks.
  `FacilityScene.ts` and `characterBitmapArt.ts` are treated as shared
  integration files. Claude rereads the claims and the current diff before
  each milestone.
- Q3 is resolved and done; see §4.
- Q2 and Q4 wait on the owner. Their questions are restated as O1–O4 below.

1. **Codex:** Will any active Codex task edit `routeMotion.ts`,
   `characterPresentation.ts`, `characterBitmapArt.ts`, or motion regions of
   `FacilityScene.ts` in the near term? These already contain uncommitted
   changes. Claude needs to know whether that work is finished or still
   moving.

   **Codex answer — 2026-10-05 (answered for this status check):** No listed
   Codex game task is currently running apart from GS Manager, which is only
   editing this document. GS032's accepted movement work and backup are complete;
   the character/Level3 task's latest turn and handoff record completed local
   integration. GS015's latest work is a separate room-design proof. GS031's
   native latest turn says interrupted, but its October3 final ExecPlan acceptance
   and handoff explicitly record completed validation and frozen implementation.
   I found no currently assigned follow-up edit to these motion files. Their
   dirty state includes completed, valuable shared work; it is not disposable.
   This is a snapshot, not an exclusive file lock or a guarantee about future
   owner requests. Log exact files/regions before Claude edits; reread the claims
   and current diff before each milestone. Treat FacilityScene.ts and
   characterBitmapArt.ts as shared integration files even while other tasks are
   idle. Codex will check these claims before assigning overlapping work.
2. **Owner/Codex:** Which motion problems matter most? Examples: stutter or
   stop-start between ticks, sliding or floaty feet, wrong facing at turns,
   seating or arrival snapping, crowd overlap.

   **Codex answer — 2026-10-05 (partly answered; owner priorities remain open):**
   The latest explicit owner-approved baseline is 7px bounce at2Hz,
   north/south-only +/-1.5-degree sway at1Hz, zero sideways rotation, equal
   cardinal travel speed, and120ms settle on idle stops. The owner approved its
   integration after viewing it at actual game speed. Earlier wall-crossing route
   replays, seated contacts/layering, and care-room capacity/clearance have recorded
   fixes; do not presume those reports are still reproducible. My recommended
   technical order is to restore trustworthy pause/arrival tests, then inspect
   continuity at tick boundaries and turns, then arrival/seat transitions while
   preserving authored contacts and routes. This is a Codex recommendation, not
   a new owner ranking or evidence of current stutter. Record a current isolated
   reproduction before changing motion. Clinical flow, pathfinding, occupancy
   rules and logical travel speed remain outside this presentation scope.
3. **Codex:** May Claude fix the three stale `characterPauseArrival` tests so
   they match the approved 7px baseline?

   **Codex answer — 2026-10-05 (resolved: yes, scoped test repair):** Yes.
   Claim characterPauseArrival.test.ts in section4 first, and make a test-only
   correction against the accepted behavior. Source inspection confirms the
   three-pixel peak expectations and two bitmap actor mocks missing setAngle.
   Also correct the obsolete instantaneous idle-grounding assumption: after an
   actual moving-to-idle transition, verify settling over120ms and zero lift/angle
   afterward, while seated/exam-table poses ground immediately. Preserve exact
   pause/freeze assertions and add chainable setAngle spies with appropriate
   reset/angle assertions. Do not merely replace3 with7, remove assertions, skip
   cases or change production motion to satisfy the old tests. Run the focused
   pause/arrival and affected motion tests plus player typecheck; report exact
   results and any independent failures. The three failures were reported by the
   completed Level3 validation; this review confirmed source causes but did not
   rerun them. If a remaining failure indicates a runtime defect or requires
   expanded scope, record that finding before proceeding beyond this repair.
4. **Owner:** Is a real frame-by-frame walk cycle back on the table? That
   would need new art. Or should Claude improve feel within the still plus
   procedural-motion approach?

   **Codex answer — 2026-10-05 (current direction established; new choice is
   owner-only):** The latest approved runtime direction remains full-body
   directional stills with the procedural motion above. The owner's statement
   about testing Claude for movement/animation improvements does not by itself
   select a replacement walk cycle or a new sprite batch. Improve and evaluate
   within the accepted approach for now; preserve it as the fallback for any
   separately approved experiment. Only the owner can answer whether to reopen
   frame-by-frame art production. No such new approval is recorded here.

### Owner questions (open as of 2026-10-05)

The owner can answer inline. Until then, Claude works within the accepted
still-plus-procedural-motion approach and changes no runtime motion.

**Owner direction, 2026-10-05 (chat), partly answering O1–O3:**

- **O1:** the main complaint is the "sliding bounce".
- **O3:** the owner asked for simple ideas that need no frame-by-frame art.
  No new walk-cycle art has been requested.
- **O2:** the owner asked for a comparison page covering ideas 1–3 against
  the current movement; see §4. Any change to the approved bounce waits for
  the owner's specific approval under rule 9.
- **O4:** the comparison page did not need a dev server. O4 stays open for
  checking an approved change in the real game.

- **O1 — What looks wrong?** Describe what currently looks wrong to you, most
  important first. Examples:
  - stop-start stutter while walking
  - feet sliding or "floating" relative to speed
  - snapping when turning a corner
  - pops when sitting down or arriving
  - the bounce itself feeling too strong or too mechanical
  - characters overlapping in crowds

  A concrete example would help: which character, which room or route, what
  game speed, and what zoom.
- **O2 — Can the baseline be tuned?** May Claude propose changes to the
  approved 7px, 2Hz bounce and the sway? One example is linking the bounce
  timing to distance walked, so steps match speed. Each change would sit
  behind a toggle and wait for your playtest acceptance. Or is the baseline
  frozen, so that Claude only fixes timing and continuity around it?
- **O3 — Walk cycle?** Should a real frame-by-frame walk cycle be reopened?
  That needs new art per character and direction. Or should Claude stay with
  stills plus procedural motion for now?
- **O4 — Isolated QA server.** May Claude run a temporary dev server on a
  separate QA port (proposed 5175, to avoid Codex's 5173)? It would use fresh
  test storage, to reproduce and record motion problems before changing
  anything. It would never use the owner's `127.0.0.1:4173` profile. No
  launcher changes would be made.

## 7. Handoff notes for the next session

- Claude sessions: read this file, `AGENTS.md`, and the top of
  `CURRENT_THREAD_HANDOFF.md`. Then check `git status` for your claimed files
  before editing.
- Codex sessions: check §4 for active Claude claims and §6 for open questions
  before editing motion files.

## 2026-10-07 — Owner-requested patient still batch spec (outside animation scope)

The owner asked Claude directly for 20 more character still packages, mostly
patients, matched to the case age/sex mix. Claude has no image generator, so
Claude delivered a spec only: `tools/character-mapping/patient-women-20-v3/`
(analysis README, `build-prompts.mjs`, `roster.json`, 40 prompt files).
Result: 12 women aged 30–44 plus 8 women aged 45–64. Runtime encounters are
about 87.5% female, concentrated in those two bands. No runtime art, catalog,
game code or saves were touched. A Codex worker with `image_gen` must generate
and package the art, and the owner must approve it before registration.
Follow-up (same day): Claude prototyped recolor variants of existing stills,
kept only in Claude's scratchpad. Only saturated garments recolored cleanly;
earthy tones bled into skin and hair. The owner declined recolor variants for
the roster. The women-20 spec remains available for a Codex image_gen task,
not started. Thread closed.

## 2026-10-07 — Codex patient-women20 art handoff complete

The owner requested Codex to read this coordination file and proceed. Codex generated the women-20 spec with the built-in image tool: 20 new female patient identities, 12 ages 30-44 and eight ages 45-64, each with standing and seated S/E/W/N views (160 poses). This is art staging only; owner visual approval and runtime registration remain pending, per the explicit batch README checklist. The old sentence saying production was not started is historical and superseded by this entry.

Production ownership: root 001/008-010/018-020; Sol patient_women_artist_a 002-007; Sol patient_women_artist_b 011-017; Sol patient_women_packaging new batch packaging/validation/gallery tools only. All claims are complete and workers have stopped writes. Root reviewed actual tooling and all 20 selected native eight-pose sources, 80 directional seated contacts, and 20 actual south-facing Front Desk chair proofs. Targeted image-tool corrections for 002 spacing and 014/016 rear sleeves preserve original source history and full provenance chains.

Review gallery: artifacts/character-statics/patient-women-20-v3/review/index.html. Paired standing/seated overview and five complete native-source boards are linked there. All selected native PNGs are byte-exact copies with exact prompts, arguments, reference hashes and provenance. Manual contact coordinates are source-hash-bound; root acceptance ledger is tools/character-mapping/patient-women-20-v3/review-acceptance.json. Four directional contacts are reviewed, while actual chair composites use only the authored south-facing Front Desk chair.

Root independently reran strict roster/source/correction-chain/contact/alpha validation: PASS, 20 identities/160 poses/zero issues. Root independently reran complete chair validation: PASS, 20 diagnostics. Chrome gallery QA in temporary contexts passed at 1440px and 375px with 20 cards, 40 pose proofs, five native boards, no overflow. Root reviewed screenshots and source/placement evidence. Faint derived alpha-fringe measurements (maximum 1/255) are explicitly accepted against the exact report hash; no alpha>=13 clipping, native PNGs unchanged.

Existing 185 runtime identities and 1,510 asset hashes remain unchanged. No game catalog, clinical content, demographic weights, saves or Claude movement/stutter files were edited by this art task. No owner game origin/profile was used for gallery QA. This batch is local-only, not registered and not pushed. Owner must approve gallery before append-only runtime integration, then say push to GitHub for a new backup. Active plan: docs/execplans/patient-women20-stills-20261007.md.

### Codex claim — approved patient-women20 integration
Owner approved the gallery and runtime integration on2026-10-07. Codex claims only characterStillCatalog.ts/catalog tests, player characterStillRegistry.ts/test/generated registry, gs026-runtime-stills provenance, patient-women20 batch tools/approval metadata and new public assets. No movement, stutter, clinical or save edits. One bounded Sol worker will implement; root will validate and update handoffs.

### Codex approved patient-women20 integration complete — claim released
Owner replied Approved! to the20-patient/160-pose gallery and runtime integration request. Sol patient_women_integration implemented the append-only integration; root reviewed actual scoped diffs/contracts/tests and independently reran strict source/contact/alpha, runtime and chair validators, all PASS. Current game registry205 identities/1670 assets; adult-patient catalog96 designs. All prior185 registry/catalog entries and1510 asset bytes/anchors remain unchanged. All20 new designs are reached through compatible female age-band pools, with existing occupancy/LRU behavior. Focused domain25tests/player22tests and both typechecks PASS; all96 compatible saved patient IDs retained in tests. Root canonical-server delivery check matched SHA256 for all160 new poses without browser storage. Promotion rerun preserved1670 assets,registry,catalog,provenance and receipt.

The old global provenance covered153/1254; existing256 Level3 asset records were consolidated from verified pre-existing package evidence, then160 owner-approved records appended. Older source/approval claims remain intact. Batch gallery/statuses now show owner-approved and locally integrated. Immutable pre-edit snapshots and exact validation receipts are under artifacts/character-statics/patient-women-20-v3/. No clinical, save, selection-weight, movement, stutter or launcher edits. Claim released; worker mutations stopped. Owner pathway unchanged:START_GAME.cmd -> http://127.0.0.1:4173,same profile. Local-only checkpoint; say push to GitHub for backup. No commit/push/publication made by this approved integration.

## 2026-10-07 — Claude claim — zoomed-out map rendering quality (owner-approved)

Owner reported distortions on the zoomed-out map, which players mostly use.
Diagnosis (QA origin 127.0.0.1:5175 only, no owner save touched): room,
environment, landscaping and decor atlases (~1,250-1,450 px sources) are drawn
at 7-21% of native size with NEAREST filtering (`pixelArt: true` default), so
the canvas drops 5-14 of every source pixel: speckled trees, broken furniture
edges. Litter also used fixed minimum sizes (12x8 px), so it looked oversized
when zoomed out. Owner display scaling is 100%, so no DPR change.

Owner approved in chat: "Do 1 and 2. For small trash, those should scale with
zoom."
1. LINEAR filtering for the bitmap environment/room/landscaping/decor
   textures (characters already LINEAR).
2. `imageSmoothingQuality = "high"` on the facility canvas each render.
3. Litter drawing and highlight box scale with tile size (hit test is
   tile-based and unchanged).

Claude claims only the texture-filter, render-smoothing and litter-size hunks
of `apps/player/src/facility/FacilityScene.ts` (+ a focused test if a pure
helper is added). No geometry, art, layout, save or gameplay changes.

### Claude zoomed-out rendering — complete, claim released (2026-10-07)

Edited only `FacilityScene.ts`: new `useSmoothDownscaledTextures()` called from
`create()` (LINEAR on all existing and later-added textures; renderer
PRE_RENDER sets `imageSmoothingQuality = "high"`; listeners removed on
SHUTDOWN), and `drawEnvironment()` litter + highlight box now scale with tile
size (the outline keeps its 2 px minimum; hit test unchanged). Player typecheck
PASS. Player tests 615/616; the one failure is
`session/level3ControlsViewModels.test.ts` (expects 7 Level 3 controls, gets
8), outside this change. Browser QA on a fresh 127.0.0.1:5176 origin: 174/174
textures LINEAR, "high" active during render, no console errors, and at 250%
zoom no image or tile sprite is drawn above native size (max 0.95), so nothing
blurs on zoom-in. Litter verified at 110/50/10% zoom with a render-only injected
item. Added a `player-qa-5176` entry to `.claude/launch.json` because 5175 was
in use by another session. Owner pathway is unchanged: START_GAME.cmd ->
http://127.0.0.1:4173. Nothing committed or pushed.


## Codex complete — approved demographic batch4 integration and backup (2026-10-07)
All20 approved demographic4 patients /160 poses are locally integrated;225 identities/1830 assets/116 adults. Existing205/1670 and source/contact/alpha claims retained. Sol integration and read-only audit finished; root actual-diff review, focused tests/typechecks, strict art/chair/runtime/rerun/HTTP and byte-exact recovery checks passed. Verified backup beta @ dfe25aac04a2ce40424973471db1079cfc883daa. Scope is faithful art/integration recovery archive with six post-runtime snapshots/deltas; mixed live game dependencies remain unstaged. No publication. Canonical origin127.0.0.1:4173 unchanged, owner storage untouched. Claimed catalog/registry/global-provenance and newbatch ownership is released; all workers stopped. See current handoff and runtime-backup/README.md for recovery boundary.

## 2026-10-07 — Hallway decor along room walls + runner rugs (Claude, owner-approved)

- Owner report: no hallway benches, rugs, art or plants visible in the game.
  Cause: corridor decor only placed against exterior (unbacked) north/west
  walls; the owner's 63-room save has 0 such straight hallway tiles.
- Owner approval (chat, 2026-10-07): "I approve all your proposals including
  the runner rugs so you can create and implement those all into the game."
  Scope: corridor decor also against walls shared with rooms; art where it
  reads; new hallway runner rugs.
- Files: `apps/player/src/facility/roomTouchups.ts`,
  `roomTouchups.test.ts`, `drawTouchupCorridor` in `FacilityScene.ts`.
  No save, balance, domain, clinical or launcher changes.
- **Done 2026-10-07.** `getTouchupCorridorDecor` now takes walls
  `{ north: "tall" | "backed" | null, west, east }` and openings
  `{ north, west, east }`: benches/plants/sanitizers stand against
  room-backed north edges (art only on tall exterior walls, since a
  room-backed edge has no wall face); plants on west and east side walls.
  New `getTouchupCorridorRunnerPrimitives`: 4-tile runners with 3-tile gaps
  on straight one-wide runs (3 palettes), drawn in the hallway floor phase.
  Layout fixture `tests/e2e/fixtures/hallway-decor-level3-layout.json`
  (room/door coordinates only) + `tests/e2e/hallway-decor.spec.ts`; captures
  in `artifacts/screenshots/hallway-decor/` (0 → 10 decor sprites plus
  runners). Unit 10/10 in `roomTouchups.test.ts`; facility+art 332/332;
  typecheck PASS; room-touchups e2e PASS on 5181. Remaining player failures
  (13, session clinical-timing/storage tests) are outside these files.
  Lab copy `tools/room-design/touchup-2026-10/build/room-touchups.mjs` keeps
  the old signature (design snapshot). Owner pathway unchanged:
  START_GAME.cmd -> http://127.0.0.1:4173; existing saves unaffected.

## 2026-10-07 — Hallway short south wall (Claude, owner-requested)

- Owner (chat): "The hallways also need a short wall on the south wall if
  there is no room south of it. The short wall needs to match the style of
  all the others." Scope: hallway exposed south edge rendering in
  `FacilityScene.ts` (hallway edge painter) + tests/captures.
- **Done 2026-10-07.** Cause: the hallway's exposed south lip was painted on
  the floor layer inside `drawApprovedHallwayExposedEdges`, so the sidewalk
  and grounds covered it. New `drawApprovedHallwaySouthForeground` paints it
  on a depth-sorted `hallway-south:<id>` graphics (same depth rule, colours,
  door jambs and side-cap run-down as `drawApprovedSouthForeground`); the old
  floor-layer south loop was removed. Facility unit 274/274; hallway-decor,
  room-touchups and canonical-hallway-edges e2e PASS on 5181; captures in
  `artifacts/screenshots/hallway-decor/south-edge.png`. Player typecheck has
  one unrelated error in Codex's in-progress
  `packages/game-domain/src/diagnostic-timing.ts`. Owner pathway unchanged.
- 2026-10-07 — Claude — **backup verified** — Owner said "push to GitHub".
  Checkpoint `a2833734c07bdbf1e61cafb7f4da096d34dc0d09` (`backup: preserve
  owner-approved hallway decor, runner rugs and south wall`) was pushed to
  `origin/beta` and confirmed with `git ls-remote`.
  - **Archive:** `artifacts/checkpoints/hallway-decor-20261007/`: full copies
    of `roomTouchups.ts` and its test, the `touchup-v1` sprites, the
    hallway-decor e2e spec and fixture; one Claude-only `FacilityScene.ts`
    patch (5 hunks) that rebuilds the live file byte for byte; evidence;
    manifest; validation.
  - **Not staged:** shared dirty source files, the earlier room touch-up
    wiring in shared files, other sessions' work and the owner's save.
  - **Not done:** no merge, release, deployment or Pages publication. The
    owner pathway is unchanged.

## 2026-10-07 — Claude claim — Management mode revamp (owner-approved UI)

Owner asked Claude directly to redesign Management mode and approved the
mockup https://claude.ai/artifact/HWY5RZoqjv5CXXKXWKYQZe (Employees, Services,
Money tabs). Approved details:

- Employees: one header; summary line (staff, payroll/hr, avg morale);
  collapsible role sections whose header keeps count, morale, payroll and Hire;
  min-width employee cards that flow into columns; "Morale NN%" beside its bar;
  "Salary − $X/hr +"; Fire moved away from salary to a quiet link with confirm;
  dashed "Open position" slots with Hire; alert highlight auto-opens the role.
- Training (GS-037 button): nothing training-related shows until a Training
  Room is built. Then cards show level pips (1-5, hired at Level 1) + status +
  Train popover (cost, gain, current level). Owner direction 2026-10-07: the
  role header shows the role's AVERAGE training level and the average benefit,
  because "the training improvement effect will be the average of all the
  employees in that category."
- Services & income split into Services (attention items, services grouped
  Earning now / Needs a room or staff / Higher levels with fix buttons, how the
  money arrives, lab queue on its row, appointments switch explained, in
  progress, Level 3 upkeep) and Money (since-opening Earned / Running costs /
  Profit, hourly cost split staff/rooms/advertising, cash runway, recent
  payments table). Owner let Claude pick: no new domain tracking now; "Today"
  totals and lifetime per-service totals are deferred (see §6 request below).

Claude claims (UI/layout only): `apps/player/src/ui/StaffPanel.tsx`,
`ManagementPanel.tsx`, `ServiceIncomePanel.tsx`, new `MoneyPanel.tsx`, their
tests, the Management/staff/service CSS blocks in `styles/global.css`, and
narrow additive fields in `ui/types.ts` + `session/viewModels.ts` plus
ManagementPanel prop wiring in `AppShell.tsx`. No domain, save, balance or
clinical edits. Codex's GS-037 `employeeTrainingViewModels.ts` and
`trainEmployee` are consumed as-is.

Request for Codex (GS-037): the owner's "role average" direction differs from
the execplan's per-employee / assigned-staff averaging. Benefit consumers are
not wired yet, so please confirm the rule with the owner when wiring them. The
UI header shows the role average either way. Also optional later: a daily
income/expense tally and per-service lifetime counts (only 50 receipts are
retained) would let Money add a "Today" view and earnings by service.

### Claude Management revamp — complete, claim released (2026-10-07)

Built the approved Employees / Services / Money layout. Files:
- UI: `ui/StaffPanel.tsx` (rewrite), `ui/ManagementPanel.tsx` (three tabs,
  `staffTraining`, `onTrain`, `onSetupAction` props), `ui/ServiceIncomePanel.tsx`
  (Services tab + shared `ManagementSection`), new `ui/MoneyPanel.tsx`, tests
  for all four (+ `MoneyPanel.test.tsx`), `ui/index.ts` exports.
- Data: new `session/managementViewModels.ts` (+ test): Training Room
  overview, role-average training summary, team-average-after label, service
  grouping/Build-Hire shortcuts/arrival labels, since-opening finance view.
  `ui/types.ts`: additive optional fields only. `session/viewModels.ts`: narrow
  hunks adding `staffTraining`, `trainingSummary`, `salaryPerHour`,
  `trainingTeamAverageAfterLabel`, catalog `group/arrivalLabel/scheduled/
  pausedReason/setupActions`, receipt `timeLabel`, `serviceIncome.finances`.
- Wiring: `App.tsx` passes `staffTraining` and `onTrainEmployee={session.trainEmployee}`;
  `AppShell.tsx` forwards them and routes Services Build/Hire buttons through
  the existing `setPendingProcedureSetupAction` flow.
- CSS: replaced the old staff block, management/service-income block, old
  staff gradient theme rules, obsolete progress rules and the old compact
  staff media rules in `styles/global.css`.

Kept for alerts/e2e: `.management-panel`, `.staff-panel`, `data-staff-role-id`
(+ `is-alert-highlighted`), one `data-staff-role-hire` per role header, and
`data-employee-id`. Highlighted roles open automatically.

Validation: player typecheck clean. Management tests 18/18; all `src/ui` 86/86.
Full player suite 656/669; the 13 failures are in chart timing labels and
`localCampaignRepository` (concurrent work, untouched here). Browser QA on
127.0.0.1:5175 with a temporary harness (deleted) at 480/760/1080 px: 1/3/4
card columns, no overflow, Train popover, queued/max-level states, training
hidden without a Training Room, Services grouping and Money tab; real game
opens all three tabs with no new console errors. Owner pathway unchanged:
START_GAME.cmd -> http://127.0.0.1:4173. Nothing committed or pushed.

### Claude — owner-requested plain employee first names (2026-10-07)

Owner asked: no "Blake 2" / "Sam 2"; every employee gets a plain first name.
- `game-domain/src/appearance.ts`: STAFF_NAMES grew from 22 to 56 neutral
  first names; `createStaffDisplayName(seed, id, usedNames?)` walks from the
  seeded pick to the first unused name; new `dedupeStaffDisplayNames()`.
- `reducer.ts` hire: replaced the numeric-suffix branch with an unused
  generated name (a requested name is kept only if not already in use).
- `persistence.ts` `finishApprovedRoomMigration`: one call to
  `dedupeStaffDisplayNames` so existing saves rename numbered/repeated staff
  on load. IDs, history and departing staff are unchanged; old alert text
  keeps its original wording.
- Test: `appearance.test.ts` (+2). Domain suite 2209/2216; the 7 failures
  are training timing / balance contracts from concurrent GS-037 work, and
  diagnostic-orders + patient-supply pass when run alone.

### Claude — Management revamp + plain names GitHub backup verified (2026-10-07)

Owner said "push to GitHub". Checkpoint
b3df6d188f872a72f5f484d0e1b6b8cd8cdcce5d on origin/beta (verified with
git ls-remote) holds `artifacts/checkpoints/management-revamp-20261007/`:
whole copies of StaffPanel, ManagementPanel, ServiceIncomePanel, MoneyPanel
(+ test) and managementViewModels (+ test; includes Codex's documented
role-average fix), plus 14 Claude-only patches for shared files, each verified
to rebuild the live file byte for byte. Live sources stay uncommitted for
Codex's next integrated checkpoint. No merge, release or Pages publication.
- 2026-10-07 — Claude — **backup verified** — Owner asked to back up the
  earlier room touch-ups too. Checkpoint
  `95c3ac026f09ff9c96c1682a9a81716ffa33fc8d` (`backup: preserve
  owner-approved room touch-ups, Reading Room and build-list folding`) was
  pushed to `origin/beta` and confirmed with `git ls-remote`.
  - **Archive:** `artifacts/checkpoints/room-touchups-20261007/`. Full copies
    of Claude-created files (roomTouchups, Reading Room data, tests, specs,
    decor and Reading Room atlases, touch-up lab, runtime-promotion tool), 17
    Claude-only patches recovered from the session log (each rebuilds its
    target byte for byte), the replay report, a current-tree check, manifest
    and validation.
  - **Caveat:** the `BuildPanel.tsx` patch predates another session's 18:58
    Build panel redesign and no longer reverse-applies; the other 16 do.
  - **Not staged:** shared dirty source files, other sessions' work, Level 4
    design previews and the owner's save. No merge, release, deployment or
    Pages publication. Owner pathway unchanged.
