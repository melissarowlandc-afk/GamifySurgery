# Level 5 room-design worker handoff — 2026-10-08

Sol worker for the Claude Code GamifySurgery manager. **Ready for manager
inspection and owner art review.** Approval remains null; runtime integration
is disabled. New files only in this room lane and
`docs/execplans/level5-room-design-20261008.md`.

## Defined list and chosen room

The existing accepted Level 5 roadmap defines these rooms in order:

1. Founder's Office — chosen first.
2. Executive Office.
3. Gift Shop.
4. Indoor Garden.
5. Staff Gym.

Evidence: `docs/features/facility-levels-and-clinical-release-points.md:182–190`,
`docs/execplans/gs038-all-room-upgrades.md:459–463,697–701`, and
`packages/balance-config/src/room-upgrades.ts:95–99`. Full search coverage,
superseded/deferred boundaries and linked citations are in the new plan.
No Level 5 rooms were invented. Footprints remain deferred in the roadmap;
this **4×4 base-room footprint is proposed**, not an existing definition.

Review URL:
<http://127.0.0.1:4191/tools/room-design/level-5/founders-office/proof/index.html>

The existing manager-owned server serves the page and all sixteen checked
resources at HTTP 200, verified by PowerShell HTTP GET. The worker's Node
`fetch` cannot reach this loopback endpoint (`ECONNREFUSED`); PowerShell's
direct HTTP route works. No server was killed, replaced or launched. HTTP
checks are not browser-render acceptance.

## Delivered implementation and files

- `layout.json`, `proof/layout-baseline.json`, `layout-reconciliation.json`:
  permanent central-left desk/Founder seat, southeast adult visitor armchair,
  north bookcase/plant/print, conservative footprints, all sixteen independent
  one-tile door sections, clear approaches and no pass-through exceptions.
- `stand-in/**`: four original geometry canvases, manifest, frozen prepaint
  layout, route receipt and actual-native empty/all-door pictures. Preserved.
- `ART_BRIEF.md`: layout, camera, scale, anchors, reuse, layering and content
  constraints written before imagegen; final desk reconciliation documented.
- `assets/originals/**`, `assets/prompts/**`: four first generations and the
  targeted desk v2 edit, exact requests and untouched originals. Desk v1 is
  retained with its rejection reason. Selected desk leading worktop rise is
  79.841076 px at 120 px/tile; its floor was moved 0.20 tile north to align the
  seated Founder. Footprints, seats and door ownership stayed unchanged.
- `assets/processed/**`, `assets/reused/**`, generation receipts/manifests and
  `art-provenance.json`/`provenance.md`: native alpha-preserving packing,
  uniform scales, source/prompt/native hashes and approved chair-front reuse.
- `proof/index.html`, private Level 4 renderer snapshots, geometry and room/data
  exports: full door/backing/bulk controls, individual/all adults, routes,
  grid, floor/cushion contacts, opaque-base diagnostics and keyboard. The final
  text check corrected inherited treatment-room template labels and now asserts
  proposed 4×4 office/pending approval text.
- `proof/validate.cjs`, `validate-controls.mjs`, `inspect-native.mjs`,
  `reproduce.mjs`: focused software/art validators, actual-render evidence and
  deterministic rebuild checks. Native pictures are not browser screenshots.
- `proof/validate-browser.cjs`, `capture.cjs`, `browser-errors.cjs`: manager
  browser QA and ten room-state captures plus desktop/320 px. The known Canvas
  readback advisory is ignored even when Chrome labels it console.error.
  Actual page exceptions, console errors, HTTP errors and failed requests fail;
  ordinary warnings are recorded. Both scripts compile; Playwright resolves.
- READMEs, this handoff and `proof/evidence/**`: exact receipts and manager
  instructions. `proof/evidence/owned-files.json` inventories delivered paths.

The real `founder.01` south and `patient.adult.007` west stills remain unedited,
at the approved uniform source scale. Actual opaque foreground overlap is
629 pixels for the Founder chair and 695 for the visitor armrest in the native
layer check. Founder draws behind the desk. Visitor legs hang down; no footrest.
No pediatric occupant or rolling stool is introduced. Floor-standing north
bookcase and plant retain full height under backing. No logos, readable art
text, wounds, blood, new clinical content, operation/economy behavior, base
costs or individual upgrade appearance tiers were authored.

## Exact validation output

From repository root, all commands below exited 0:

```text
node tools/room-design/level-5/founders-office/proof/validate.cjs
VALIDATION PASS: 4 painted assets; 4 approved chair layers; 2 real stills; 288 door/backing states; 1536 routes; 910752 radius-clear samples at 0.005T; 16 one-tile doors; no pass-through exceptions; contacts/layers/alpha/hashes/UTF-8 checked.

node tools/room-design/level-5/founders-office/proof/validate-controls.mjs
CONTROL VALIDATION PASS 119 Node handler checks; 16 door buttons, 4 backing buttons, 4 bulk buttons, keyboard, real-error/performance-warning discrimination; browser pending

node tools/room-design/level-5/founders-office/proof/inspect-native.mjs
NATIVE INSPECTION PASS: 9 actual-render room states; painted/empty/individual adults/contacts/all doors/backing/owned door hides; browser QA pending.

node tools/room-design/level-5/founders-office/proof/reproduce.mjs
BUILD PASS: painted; four native aspect-preserving assets; four approved reused chair layers; 4x4 proposed base; 16 one-tile doors.
BUILD PASS: painted; four native aspect-preserving assets; four approved reused chair layers; 4x4 proposed base; 16 one-tile doors.
REPRODUCIBILITY PASS: 10 delivered files byte-identical across two native rebuilds.

node --check tools/room-design/level-5/founders-office/proof/validate-browser.cjs
(exit 0, no output)
node --check tools/room-design/level-5/founders-office/proof/capture.cjs
(exit 0, no output)
node -e "require.resolve('@playwright/test'); console.log('BROWSER SCRIPTS COMPILE PASS; installed Playwright resolves; browser execution reserved for manager.')"
BROWSER SCRIPTS COMPILE PASS; installed Playwright resolves; browser execution reserved for manager.

PowerShell HTTP GET resource check
HTTP RESOURCE VALIDATION PASS: 16 resources return HTTP 200 at the requested 4191 origin.

node tools/room-design/level-5/founders-office/assets/write-provenance.mjs
PROVENANCE PASS: 5 originals/prompts, 4 selected sprites, 4 approved chair layers, untouched prepaint stand-ins, exact transforms and SHA-256 receipts.
```

The 288-state matrix is sixteen north-backing combinations × (closed, each of
sixteen single doors, all open). It is not a claim to have enumerated 65,536
door combinations. Every single door route is safe with all other optional
floor objects still present; further doors only remove obstacles. The validator
checks this monotonic obstruction property in 256 comparisons. Backing changes
no floor obstacle. Static seating links are separate from walking samples.

Final visual inspection also removed the inherited generic footprint-bottom
shadow ellipse for this new design. It remained at the desk's former position
after art fitting; the selected furniture's own faint contact shadows now use
its actual floor anchors. All nine native states were regenerated and the
two-build byte-identical check was rerun successfully. Collision footprints
and routes remain unchanged.

## Shared tree and open risks

Twenty-five source hashes were checked. One copied renderer source changed
concurrently: `tools/room-design/level-4/wound-ostomy/proof/lab.js`, intake
`c22c9e83a612181309f5b5519fc9e9ea817539af780ba319014645751026b827`, observed
`d0122d4d6c909de72cbf4679acd1ce99954651100a8c3ab5a541117b98f09929`.
This was recorded as concurrent work, not reverted or treated as our edit.
Reused shared artwork and character source hashes still match. The private
office renderer snapshot is validated independently. Global dirty-tree/Git
inspection was not attempted because the brief forbids Git.

Worker did not spawn a browser. Actual Chrome rendering, CSS at 320 px,
Tab/Space/Enter behavior and owner visual acceptance remain manager checks:

```text
node tools/room-design/level-5/founders-office/proof/validate-browser.cjs
node tools/room-design/level-5/founders-office/proof/capture.cjs
```

## Questions / next action

1. Owner: accept or revise the proposed 4×4 footprint and base appearance?
2. Later art brief: specify the four visual upgrade appearances. The room's
   accepted functional-plus-appearance direction is preserved; no duplicate
   approval of the existing numerical ladder is requested.
3. Before gameplay: define when/for whom the accepted morale benefit applies
   and the Founder's actual office use in a separately scoped task.

Manager should inspect the files/actual-native pictures, run the two browser
commands, and show the room to the owner. Keep the other four Level 5 rooms
for subsequent bounded milestones in existing roadmap order.

Local deliverables only. No Git, agents, install, game/runtime edits, owner save
access, commit, push, merge, deployment or publication. Manager owns acceptance,
the global `CURRENT_THREAD_HANDOFF.md` (outside this lane), and the audited
**"push to GitHub"** checkpoint reminder. Owner play remains `START_GAME.cmd`
→ exact `http://127.0.0.1:4173`, usual persistent profile. The art proof at
port 4191 uses no campaign storage and does not move existing saves.
