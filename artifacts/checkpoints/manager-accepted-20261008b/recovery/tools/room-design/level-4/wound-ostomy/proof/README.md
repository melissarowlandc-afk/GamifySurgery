# Wound/Ostomy interactive art proof

Open <http://127.0.0.1:4191/tools/room-design/level-4/wound-ostomy/proof/index.html>
through the existing manager-owned 4191 room-lab server. No campaign storage.
The owner game remains `START_GAME.cmd` -> `http://127.0.0.1:4173`, same profile.

Owner revision completed October 8: the treatment chair has no leg rest; the
existing patient sits naturally with legs down. The patient contact moved
0.311 proof pixels; clinician placement is identical. Owner visual approval
was conditional on this fix and is now recorded in owner-revision.json.
All four other painted pieces, reused fixtures, twelve doors, controls and
576 walking paths are preserved. The chair retains its 624 x 470 native frame
and reviewed uniform scale with transparent space where the extension was.

Controls include twelve independent game door sections, Open/Close all doors,
three independent north backing sections, Back all/Clear backing, patient and
clinician occupancy, routes, grid, contacts and opaque base diagnostics.
G grid, R routes, A all characters, P patient, V clinician, C contacts,
F bases, D all doors, B all backing, Escape reset. Native Tab/Space/Enter
operate the controls. The CSS supports 320 px; browser rerun for this revision
is pending. The manager's earlier browser PASS and captures pin the prior
manifest and are archived in revisions/20261008-before-leg-rest-removal.

Node checks from repository root:

```text
node tools/room-design/level-4/wound-ostomy/proof/validate.cjs
node tools/room-design/level-4/wound-ostomy/proof/validate-controls.mjs
node tools/room-design/level-4/wound-ostomy/proof/reproduce.mjs
node tools/room-design/level-4/wound-ostomy/proof/inspect-native.mjs
```

The validator checks actual decoded sprites, original/prompt/native hashes,
frozen placements, preserved references, exact reused native backless contract,
real still contacts, painter order and clinician-over-stool compositing. It
checks 112 door/backing states, 576 routes and 93,928 radius-clear walking samples.
Revision checks compare every walking path with the reviewed version, verify
the former leg-rest region is transparent, and compare both occupied and empty
native views: 499,228 pixels outside the chair/patient are byte-identical.
The frozen WB recliner doorway exception is explicit. Static seat transitions
are separate from walking; the door matrix does not claim all 4,096 combinations.

Node-native images in evidence/native-*.png come from the actual paint functions.
They are artwork inspections, not browser captures. Node handler checks execute
the shipped handlers using minimal DOM/native Canvas; browser/CSS/accessibility
acceptance remains the manager's responsibility.

Manager browser commands, with 4191 running:

```text
node tools/room-design/level-4/wound-ostomy/proof/validate-browser.cjs
node tools/room-design/level-4/wound-ostomy/proof/capture.cjs
```

Both scripts pin proof-manifest SHA-256. Browser validation checks real controls,
all routes, native alpha/anchors, actual clinician-over-stool blending, low-wall
shelf height, keyboard and 320 px overflow. Capture saves eleven room states plus
desktop/320 px pages. Chrome willReadFrequently advisories are recorded/ignored;
real page exceptions, console errors and failed requests fail. The worker
compiles these scripts and does not launch a browser or use owner saves.

Rebuild, only if needed: assets/configure-assets.mjs, assets/prepare-assets.mjs,
assets/prepare-reused-stool.mjs, proof/fit-seats.mjs, proof/build.mjs,
assets/write-provenance.mjs, in that order. Existing originals/prompts and the
frozen snapshot remain inputs. scaffold.mjs is an initial, guarded template
copy, not a rebuild command. Runtime integration remains a separate manager
milestone. evidence/browser-revision-status.json identifies the current and
previous manifest hashes; existing wound-* captures and browser reports are
historical until the manager reruns both browser commands.
