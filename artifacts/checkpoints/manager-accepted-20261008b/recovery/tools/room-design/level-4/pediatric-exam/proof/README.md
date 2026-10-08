# Pediatric Examination proof

Review URL:
<http://127.0.0.1:4191/tools/room-design/level-4/pediatric-exam/proof/index.html>
Use the existing manager-owned room-lab server rooted at the repository.
No campaign storage. Owner game remains `START_GAME.cmd` ->
`http://127.0.0.1:4173` in the same persistent profile.

Five painted native sprites, real pediatric child .021 facing east on the
table, clinician .001 facing west entirely above the derived backless rolling stool, and parent .007
facing west in the reused armchair behind its approved front-armrest overlay.
Twelve one-tile door controls, three independent north backing controls, working bulk
buttons, character groups, routes/clearances, grid and contact/base diagnostics.
Keyboard: G grid, R routes, A characters, P parent, K child, V clinician,
C contacts, F bases, D all doors, B all backing, Escape reset.

Owner (2026-10-08) approved the room with the requested backless-stool revision.
`../assets/derived/stool-backless.png` is a 266 x 427 derivative of the approved
stool crop. Its original seat contact/ground/render rectangle are preserved.
The backrest and post are removed; a narrow cushion strip is repaired from
intact approved cushion pixels. Source/output hashes, exact mask/repair and
reason are in `../assets/derived/stool-backless-manifest.json` and provenance.
Stool painter ground 1.75 precedes clinician 1.7501. There is one complete
stool layer, zero foreground stool layers, and readable seat/column/base.
Parent front-armrest layering is unchanged.

From repository root, Node-only checks:

```text
node tools/room-design/level-4/pediatric-exam/proof/validate.cjs
node tools/room-design/level-4/pediatric-exam/proof/validate-controls.mjs
node tools/room-design/level-4/pediatric-exam/proof/reproduce.mjs
node tools/room-design/level-4/pediatric-exam/proof/inspect-native.mjs
```

Manager-only browser commands (not executed by worker):

```text
node tools/room-design/level-4/pediatric-exam/proof/validate-browser.cjs
node tools/room-design/level-4/pediatric-exam/proof/capture.cjs
```

Optional `PEDIATRIC_EXAM_PROOF_URL` changes the scripts' URL; record an altered
opening pathway explicitly. Default is the exact 4191 URL above. Browser
scripts use installed `@playwright/test` and Chrome; no install is needed.
`browser-errors.cjs` ignores/records Chrome `willReadFrequently` performance
advisories, while true page exceptions, console errors and failed requests fail.

The game door labels are N1-N3, S1-S3, WA-WC and EA-EC. Wall items hide for
their own sections: scale counter N3/EA, growth chart N2, animal print N1,
toy bin S1/WC. Fixed table/chair remain in place.

The 112-state matrix covers closed, each single door and all doors across
all eight north-backing masks: 768 routes. Every one of 66 door pairs can only
remove blockers, checking the route model's combination monotonicity. This
does not claim exhaustive testing of all 4,096 doorway combinations.
Existing fixed table/chair threshold pass-through exceptions stay explicit;
other routes clear original footprints and measured base alpha. Walking ends
at a clear standing approach; dotted seat contact segments are static seating.

`evidence/native-*.png` are Node/native Canvas art inspection, not browser
captures. Node handler validation executes shipped handlers in a minimal DOM;
CSS, real browser keyboard/accessibility and 320 px still need manager checks.
Generated source prompts, native hashes, 1,243 protected references and 24
actor poses are guarded. Node validation checks the backless mask/repair,
approved retained pixels, clinician-above-stool compositing and readable parts.
`presentation-contract.json` documents the retained seat registration, revised
clinician painter order and manager-directed game door model; `layout-baseline.json`
retains the original 3 x 3 room/supports/navigation. Entry points use game
inside-tile centers; the reviewed fine clearance model and seat links remain.

The prior 16-door candidate passed manager browser validation with page
errors 0. Its reports, captures and reviewed contracts are preserved in
`revisions/door-model-16-reviewed/`. Existing `evidence/exam-*.png/json`,
`browser-validation-report.json` and `capture-report.json` describe that
preceding candidate until the manager reruns the two browser commands above.
The preceding twelve-door/stool-with-back version is preserved in
`revisions/stool-with-back-reviewed/`. All five updated native views differ
only inside the stool rectangle. The current proof manifest records the
owner's approval with requested revision and marks fresh browser validation
pending. Updated browser scripts assert the twelve-door model, backless
sprite, single stool layer, clinician order and readable seat/column/base;
reports record proof/derivation manifest hashes. Manager rerun remains.
