# Level 5 room design — 2026-10-08

## Goal and authorized scope

Sol worker for the Claude Code **GamifySurgery manager**. Trace the defined
Level 5 room inventory without inventing rooms, then make the first room's
isolated painted interactive mockup. Owner direction relayed by the manager:
after the last Level 4 approval, move to the next room, including the next
facility level if Level 4 is complete.

Owned lane: `tools/room-design/level-5/**` and this plan. Shared working tree:
preserve concurrent manager, Claude, owner and worker changes. No Git commands,
agents, installs, game/runtime/balance edits, saves, commits, push or deployment.
All authored text is UTF-8 without BOM. The current handoff was read; its
active October 8 work remains outside this lane. This new plan and the Level 5
directory were absent at intake; no existing Level 5 artifacts are replaced.

## Step 1 — defined room inventory and citations

The accepted roadmap **does define Level 5**, titled *Optimized ASC / Prestige*.
Use its existing list order:

| Order | Defined room | Roadmap evidence | Independent repository cross-check |
| --- | --- | --- | --- |
| 1 | Founder's Office | [Accepted facility roadmap, lines 182–190](../features/facility-levels-and-clinical-release-points.md#level-5---optimized-asc--prestige) | [GS-038 accepted future upgrade table, line 459](gs038-all-room-upgrades.md#simple-owner-review-table---october-7); `packages/balance-config/src/room-upgrades.ts:95`, `room.founder_office`, status `future`, appearance changes enabled |
| 2 | Executive Office | Same roadmap, line 187 | GS-038 line 460; `room-upgrades.ts:96`, `room.executive_office`, status `future` |
| 3 | Gift Shop | Same roadmap, line 188 | GS-038 line 461; `room-upgrades.ts:97`, `room.gift_shop`, status `future` |
| 4 | Indoor Garden | Same roadmap, line 189 | GS-038 line 462; `room-upgrades.ts:98`, `room.indoor_garden`, status `future` |
| 5 | Staff Gym | Same roadmap, line 190 | GS-038 line 463; `room-upgrades.ts:99`, `room.staff_gym`, status `future` |

GS-038's future inventory separately lists exactly these five Level 5 categories
at lines 697–701. Its older open-benefit discussion is superseded by the
accepted numerical table (lines 412–426 and 497–500): future upgrade ladders are
catalog metadata until base room behavior exists. They do not define a room
footprint or authorize gameplay integration.

The roadmap says Level 5 adds no clinical setting (lines 196–197), with
hospital/ED/ICU progression deliberately deferred without invented numeric
levels (lines 25–38 and 272). Call Room is removed (lines 170–171); it is not a
Level 5 candidate. Reading Room's later move to Level 3 is explicitly recorded
in GS-038 lines 703–707 and does not change this Level 5 list.

Search coverage: `docs/project-management/PROJECT_BOARD.md`, `docs/features/**`,
`docs/execplans/**` including `level-four-room-design.md` and
`gs038-all-room-upgrades.md`, `packages/balance-config/**`, and
`tools/room-design/**`. The board's GS-015 records establish owner-led standalone
room design, without supplying another Level 5 list. The Level 4 plan lines
35–37 supplies the prior room inventory. No alternative Level 5 inventory or
Founder Office footprint was found. `rg` is unavailable in this shell; native
PowerShell file enumeration and `Select-String` were used instead.

**Step 1 result:** five defined rooms; Step 2 is authorized. Chosen room:
**Founder's Office**, first in roadmap order.

## Step 2 — design requirements and decisions

- Isolated proof at
  `http://127.0.0.1:4191/tools/room-design/level-5/founders-office/proof/index.html`.
  This is the manager's room-art review origin and uses no campaign storage.
  Owner gameplay remains `START_GAME.cmd` → exact `http://127.0.0.1:4173` in
  the usual persistent profile; game saves do not follow to port 4191.
- Roadmap lines 265–275 defer exact future footprints. GS-038 line 697 confirms
  there is no current Founder Office room definition or mapped seat. A **4×4
  proposed proof footprint** is therefore a reviewable geometry choice, not a
  discovered/approved definition. Preserve a clear perimeter route and a
  central desk/seating zone. Confirm this footprint at owner review.
- Established GS-015 elevated-front orthographic painted style, shared
  120 px/tile proof scale, real existing character stills and measured contacts.
- Every one-tile wall section is usable as an independent door. Door-owned
  optional fixtures hide only on their own sections; permanent furniture stays
  clear. Floor-standing north furniture retains full height under low backing.
- Layout and stand-ins precede art. Preserve stand-ins; store exact prompts,
  untouched built-in imagegen originals, processed sprites, provenance and
  SHA-256 hashes inside this room. No logos or readable text.
- Adults seated in armchairs render behind foreground armrests. No back on any
  rolling clinician stool; seated figures draw over stool cushions. Patients'
  legs hang down, with no leg rests. No pediatric patient is introduced; if a
  later variant introduces one, their parent must remain in the same room.
  No wounds, blood or exposed clinical body detail.
- The accepted Founder Office row is +2 staff morale points per upgrade plus
  improved appearance (GS-038 line 459, lines 465–466; October 7 decision at
  line 867). This mockup authors a **base appearance only**. It does not invent
  the four later appearances, operating behavior, morale attribution, base
  construction/upkeep values, clinical content or a public release.
- Keep approval `null`, runtime integration `false`; automated checks are
  engineering evidence, not owner art approval or clinician approval.

## Milestones, ownership and acceptance

1. **Roadmap trace** — this worker, this plan. Complete: defined list above.
2. **Layout/stand-ins/brief** — this worker, `level-5/founders-office/**`.
   Stand-in plan, anchors, footprints, 16 door sections, seated contacts and
   all-door radius-clear routes. Write ART_BRIEF before generation.
3. **Paint/provenance** — built-in imagegen through this worker. Inspect each
   output, preserve originals/prompts, prepare sprites without distortion,
   record transforms and hashes. Reuse approved furniture/stills where fitting.
4. **Interactive proof/validation** — same lane. Door/backing, occupancy, grid,
   routes, floor/seat contacts, base diagnostics, keyboard and 320 px controls.
   Node validation of assets, ownership, routes, contact/layering and encoding.
   Ship `validate-browser.cjs` and `capture.cjs` for manager browser QA. Ignore
   Canvas readback performance advisories; fail real exceptions, console errors
   and failed application requests. Do not claim a browser pass if sandbox
   browser spawning is unavailable.
5. **Worker handback** — this plan and room handoff: exact validation output,
   room list, chosen room, review URL, files, risks and concrete owner questions.
   Manager owns acceptance, current global handoff, owner review and any scoped
   GitHub checkpoint reminder. Deliverables remain local; no backup is claimed.

## Validation commands

Planned commands (final implementation and outputs recorded below):

```text
node tools/room-design/level-5/founders-office/proof/validate.cjs
node tools/room-design/level-5/founders-office/proof/validate-controls.mjs
node tools/room-design/level-5/founders-office/proof/inspect-native.mjs
node tools/room-design/level-5/founders-office/proof/validate-browser.cjs
node tools/room-design/level-5/founders-office/proof/capture.cjs
```

## Progress, discoveries and next action

- 2026-10-08: read root AGENTS.md and current handoff. No nested AGENTS.md was
  found in docs, room-design or balance-config. Inspected Level 4 handoff,
  Pediatric Exam and Wound/Ostomy briefs/stand-in contracts and proof workflow.
- 2026-10-08: Step 1 complete. Level 5 inventory is defined; no invention needed.
  Footprint and distinct upgrade appearances remain undefined.
- 2026-10-08: Step 2 complete for manager review. Proposed 4×4 Founder Office
  base room, stand-ins/brief before painting, four selected pieces from five
  built-in imagegen calls, originals/prompts/hashes/native provenance preserved.
  Native assembly required a compact taller desk (v2) and a 0.20-tile northward
  desk registration; footprints, seats and door ownership remained unchanged.
  Prepaint layout and stand-in files are frozen as evidence.
- 2026-10-08: all focused checks pass: 288 door/backing states, 1,536 routes,
  910,752 samples at 0.005 tile and 0.18-tile actor radius, four painted assets,
  approved chair-front reuse, two real stills and 119 actual-handler checks.
  Nine actual-native render states inspected; ten delivered files reproduce
  byte-for-byte across two builds. Sixteen resources return HTTP 200 through
  PowerShell at the requested 4191 origin. Node loopback fetch is unavailable
  (`ECONNREFUSED`); no server was changed.
- 2026-10-08: browser/capture scripts compile and installed Playwright resolves.
  Worker did not spawn a browser; Chrome rendering, mobile CSS and owner art
  approval remain manager responsibilities. Page text now asserts proposed
  office footprint/pending approval; inherited treatment-room labels were
  corrected during final review.
- 2026-10-08: shared Wound/Ostomy lab.js changed concurrently; record in the
  receipt, preserve it. Reused art/still hashes match. No other lane was edited.
  Exact output, paths, evidence and questions:
  [worker handoff](../../tools/room-design/level-5/founders-office/WORKER_HANDOFF.md).
  Next: manager diff/art inspection, browser validation/captures and owner review.

- 2026-10-08: final visual inspection removed the inherited generic floor-shadow
  ellipse left at the desk's old footprint bottom. Selected sprites retain their
  own faint contact shadows at actual floor anchors. Regenerated all nine native
  states and reran deterministic rebuilds; footprint and route geometry unchanged.

## Questions for manager/owner review

1. Is the proposed 4×4 base Founder Office footprint/layout acceptable?
2. After base-room approval, what visual progression should its four purchased
   upgrades have? The room category and functional-plus-appearance direction
   are already accepted; individual tier designs are still open.
3. Base Founder Office use and morale attribution still need a separately
   scoped gameplay design before runtime integration.
