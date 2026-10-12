# Inspector stills v6f

Art review package for `inspector-v6f.001` through `.010`: ten identities,
80 standing/seated S/E/W/N PNGs, five women and five men, intended visual ages
28-65. Exactly 004 and 008 wear glasses. Appearance is visual only.

## Review entry points

- Main gallery: `artifacts/character-statics/inspector-v6f/review/index.html`
- Two existing staff above all ten inspectors:
  `review/manager/existing-staff-top-ten-inspectors-below.png`
- Manager style/all-pose gallery: `review/manager/index.html`
- Clipboard page, all 80 exact poses: `review/clipboard-review.html`
- Authored contacts: `contact-review/index.html`,
  `worker-review/contact-overlays/`, and the manager contact atlases
- Authentic chair proofs: `placement-qa/index.html`
- Full catalog comparison: `comparison/all-catalog.html`
- Exact validation: `validation/worker-validation.txt` and
  `validation/worker-validation.json`

Paths without a prefix above are relative to the artifact lane. Open the local
HTML files directly for review. They are static files; no game launcher or
persistent profile is needed. The browser validator uses fresh ephemeral
contexts at `location.origin === "null"` (`file:`), with no game storage.
The owner game pathway remains `START_GAME.cmd` -> exact
`http://127.0.0.1:4173` in the same persistent browser profile.

## Production and evidence

Mirrors the v6e generation/QA lane and retains the unchanged GS026 extractor and
normalizer: 160x320 canvas, X80 body axis, Y287 floor, 246px south standing height.
Character pixels are generated only with the built-in image tool. No procedural
character drawing, mirroring, alpha cleanup or repainting is used.

Thirty native image outputs are preserved: ten standing-cardinal identity sheets,
ten initial eight-pose sheets and ten targeted eight-pose corrections. Selected
source PNGs, historical sources, exact prompts, tool arguments, original tool
results/native paths and SHA-256 provenance remain in `sources/` and
`packages/NNN/review-history/`. Native originals in `.codex/generated_images/`
are preserved.
Do not replace source files without the explicit correction helper and receipt.

All clipboards use anatomical RIGHT carriage, with the same tan board, cream
blank paper and small metal clip per identity. S is screen-left, E is near side,
W is far side and N is screen-right. Seated clipboards lie on the right lap.
Nine targeted edits lowered initially upright rear seated boards; 009 was
already correct. 008 received a second edit exposing the W lap clipboard. The
008/010 rear-board edits also replaced pale sneaker sole bands with black office
shoes. W/N grips are partly occluded; rear seated boards expose only a thin edge.
`worker-review-notes.json` records the manual observations and remaining concerns.
The clipboard validator checks evidence binding, not automated hand recognition.

Forty contacts are independently authored after inspecting the final poses.
`authored-contacts.json` gives S/E/W/N coordinates. The ledger binds each set to
the selected source and proves it with an exact overlay. Only the actual
south-facing Front Desk chair is used for placement; E/W/N are not invented
runtime chair proofs. Worker contacts and visual QA are not manager acceptance.

The all-catalog screen covers all 326 existing identities (3,260 comparisons),
20 comparisons with the two named v6e staff references and all 45 inspector
pairs. No threshold flags occurred. RMSE is a similarity-screen measurement,
not semantic proof of distinctness; the saved boards were visually inspected.

The legacy art category is `staff`, but `eligibleStaffRoleDefinitionIds` is empty.
`inspection-agent-art` is a local art-review label, and Inspection agent is
roadmap-only at facility Level 5. No runtime job, hireability or gameplay selection
rule is created. Integration belongs to a separate accepted milestone.

## Validation

Run from the repository root, using existing dependencies:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/character-mapping/inspector-v6f/run-validation.ps1
```

The eight commands in `validation-commands.json` preserve stdout, stderr, exit
codes and timestamps. Previous runs are archived before a rerun. PowerShell's
native experimental-warning records remain in the exact transcript.

The existing Chrome browser check was attempted in this worker environment and
failed at launch with `browserType.launch: spawn EPERM`. Exact error evidence is
in `validation/browser-attempt.json` and `browser.stderr.txt`. Manager rerun:

```powershell
node tools/character-mapping/inspector-v6f/validate-gallery.mjs
```

It checks 19 pages at desktop and phone widths (38 views), image loading, local
links, script errors and horizontal overflow. No install is needed or authorized.
Manager visual/alpha/contact acceptance and browser validation remain pending.
Art is local only; no GitHub backup or publication is claimed.
