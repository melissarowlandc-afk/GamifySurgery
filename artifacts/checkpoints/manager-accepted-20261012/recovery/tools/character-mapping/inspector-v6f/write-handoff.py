"""Write the worker handoff with the saved, unabridged CLI transcript."""
import json
from pathlib import Path

tool = Path(__file__).resolve().parent
repo = tool.parents[2]
root = repo / "artifacts/character-statics/inspector-v6f"
validation = json.loads((root / "validation/worker-validation.json").read_text(encoding="utf-8"))
assert validation["status"] == "PASS"
transcript = (root / "validation/worker-validation.txt").read_text(encoding="utf-8")
text_result = next(r["records"][0] for r in validation["results"] if r["name"] == "text")
handoff = """# Inspector art v6f worker handoff

Ten identities `inspector-v6f.001`-.010 are complete for manager art review:
80 RGBA poses, 40 manually authored seated contacts, ten authentic Front Desk
chair proofs and the two-existing-staff-above/ten-inspectors-below manager sheet.
All eight CLI validators pass. Manager visual/alpha/contact acceptance and browser
validation remain pending. Nothing is runtime-integrated.

## Owned files and deliverables

Only `tools/character-mapping/inspector-v6f/` and
`artifacts/character-statics/inspector-v6f/` were authored, plus the expressly
authorized append-only v6f progress line in
`docs/execplans/character-gapfill-v6-20261007.md`. The append receipt preserves the
prior plan prefix by byte count and SHA-256. The manager-owned current-thread
handoff and other execution plans were not edited.

- **Main gallery:**
  `artifacts/character-statics/inspector-v6f/review/index.html`
- **Manager comparison sheet:**
  `artifacts/character-statics/inspector-v6f/review/manager/existing-staff-top-ten-inspectors-below.png`
- Manager style and all-pose page: `review/manager/index.html`
- Clipboard page with all 80 exact poses: `review/clipboard-review.html`
- Final eight-pose packages/manifests: `packages/001/` through `packages/010/`
- Native sources, prompts, arguments, tool receipts and edit histories:
  `sources/001/` through `sources/010/`; immutable
  `packages/NNN/review-history/` snapshots
- All-catalog/within-batch evidence: `comparison/all-catalog.html`,
  `comparison/all-catalog-manifest.json`, `comparison/manifest.json`,
  seven catalog inventory boards and twenty nearest comparison boards
- Contacts and overlays: lane tool `authored-contacts.json`,
  `contact-review/index.html`, `worker-review/contact-overlays/`
- Authentic chair proofs: `placement-qa/index.html` and three chair review boards
- Source-bound manual QA: `worker-review/visual-review.json`,
  `worker-review/clipboard-review.json` and lane tool `worker-review-notes.json`
- Validation receipt/transcript/logs: `validation/worker-validation.json`,
  `validation/worker-validation.txt` and eight named stdout/stderr/exit/timing sets

Unprefixed artifact paths above are relative to
`artifacts/character-statics/inspector-v6f/`. Tool `README.md` documents the helpers
and rerun commands. `analysis/scaffold-template-manifest.json` pins the twenty
v6e generation/QA template modules; the shared GS026 pipeline itself is unchanged.

## Production and cast

Built-in image generation only: thirty retained native outputs, comprising ten
standing-cardinal sheets, ten initial eight-pose sheets and ten targeted edits.
Byte-identical native originals remain in `.codex/generated_images/`; lane copies,
exact prompts/tool arguments, original tool results and source SHA-256 receipts
are preserved. No procedural character painting, mirroring, alpha thresholding,
erasing or repainting was used. Normalization uses the same 160x320 canvas,
body axis X80, floor Y287 and 246px south standing height as v6e/v6d.

Five women (001-005) and five men (006-010), intended visual ages 28-65. Exactly
004/008 wear glasses. All have professional office clothing, lanyards and blank
badges; no scrubs, provider coats or readable text. Appearance is visual only.

| ID | Sex / intended age | Visual identity |
| --- | --- | --- |
| 001 | Female / 28 | Deep-brown skin, black pixie, petrol blazer, rust trousers |
| 002 | Female / 36 | Fair skin, ginger low braid, slate cardigan, peach blouse |
| 003 | Female / 44 | Golden-tan skin, black bob, charcoal blazer, burgundy blouse |
| 004 | Female / 56 | Golden-brown skin, silver low bun, amber glasses, terracotta cardigan |
| 005 | Female / 65 | Fair rosy skin, white pixie, moss blazer, lavender blouse |
| 006 | Male / 30 | Olive-tan skin, brown quiff, clean-shaven, cocoa blazer |
| 007 | Male / 39 | Warm-tan skin, bald, black beard, plum cardigan |
| 008 | Male / 48 | Golden-brown skin, black crop/moustache, navy frames, camel blazer |
| 009 | Male / 57 | Fair pink skin, ginger flat crop/silver sides, moustache, sage sleeves/waistcoat |
| 010 | Male / 63 | Deep-brown skin, silver crew cut/moustache, indigo blazer |

The art-pipeline category is `staff`, while the local art role is
`inspection-agent-art`. `eligibleStaffRoleDefinitionIds` is empty and the planned
Inspection agent role is roadmap-only at facility Level 5. No job definition,
hireability or runtime selection rule was invented for this visitor group.

## Clipboard QA and remaining style concerns

Every identity carries the same clipboard at its own RIGHT side: S screen-left,
E near side, W far side and N screen-right. Standing boards are upright at the
waist; seated boards lie across the right lap. Blank cream paper, tan rim and a
small metal clip are retained per identity. The clipboard observations are
manual visual inspection bound to all 80 exact pose hashes. The validator checks
evidence integrity, not automated recognition of anatomy or props.

Nine initial rear seated views carried the board upright. Targeted built-in edits
lowered it to the lap for 001-008 and 010. 009 already had a lap-level rear board.
008 received a second targeted edit to expose its obscured W lap board. The
008/010 first edits also replaced pale sneaker sole bands with black office
shoes. Initial and intermediate sources/receipts were preserved rather than
overwritten without history.

Manager should assess these recorded limitations:

- Rear seated clipboards are mostly occluded by the body/right forearm. Their
  small right-edge slivers can be difficult to recognize at game scale.
- W seated views place the right grip on the far side. The near left hand often
  overlaps the board; the right support cannot be independently proved from
  visible pixels alone. The flat board edge is especially subtle for 004/006.
- Written build differences render moderately. Some inspectors look slimmer or
  have longer-looking legs than the v6e provider references, within the same
  anchored canvas and cel-shaded family. Assess body variety and style fit.
- 004 is warmer/lighter golden-brown with rounder frames than the written brief;
  005 has a tousled pixie, 006 a fuller wavy quiff and 009 stronger silver sides.
  Mature faces remain stylized and relatively youthful; ages are intended cues.
- Alpha report retains 895 source footprint pixels outside the normalized canvas
  across sixteen poses and sixteen border pixels across seven derived poses,
  all maximum alpha 1. No protected-alpha clipping. No cleanup was applied;
  explicit manager alpha acceptance is still required by the precedent pipeline.

Forty contacts were independently authored from the final lower-pelvis/upper-thigh
support line, never from the clipboard, hands or an inferred body ratio. S/E/W/N:

```text
001 238 / 244 / 244 / 247
002 240 / 245 / 245 / 249
003 238 / 241 / 241 / 246
004 242 / 247 / 247 / 251
005 244 / 246 / 246 / 252
006 239 / 243 / 243 / 247
007 234 / 238 / 238 / 243
008 237 / 240 / 240 / 244
009 235 / 238 / 238 / 243
010 238 / 241 / 241 / 247
```

Contact contract SHA-256:
`2c52f14ff139320f24c5a19678d864b0d028efb988449bba54613972d3097b8e`.
All forty overlays and ten chair proofs were visually inspected. The chair
composites use only the authentic south-facing Front Desk fixture with unchanged
runtime geometry; E/W/N proofs are explicitly not rendered as invented fixtures.
Contacts remain worker candidates awaiting manager acceptance.

## Comparison and preservation evidence

Independent recomputation: all 326 catalog identities / 3,260 inspector-to-catalog
comparisons, twenty comparisons against the two v6e style references and all
45 within-batch pairs. Zero near-duplicate threshold flags. Minimum catalog RMSE
55.88144996504039; minimum within-batch RMSE 59.38237104739872. All catalog inventory
boards, all twenty nearest boards, the two style boards and all eighty normalized
poses were visually inspected. These scores screen pixel similarity and do not
automatically establish semantic identity or exact art-style equivalence.

The captured baseline remains exact: 326 prior identities, 2,638 existing assets,
179 selectable patient designs, seven extraction/chair/art controls and 202
accepted native sources. No `apps/` or `packages/` edits, clinical content,
subagents, Git commands, installs, web access, external messages, deployment or
publication occurred. Concurrent Level 5 game/manager work was preserved.

The requested October 11 M0 owner follow-up was absent from the Level 5 plan
version available at intake and remained absent at closeout. The explicit worker
brief supplied the binding inspector request; the Level 5 plan was not edited.

## Browser limitation and manager acceptance

Eight CLI checks passed. Existing-Chrome Playwright validation was attempted
separately and exited 1 with this exact failure:

```text
browserType.launch: spawn EPERM
```

Full exact attempt, stdout, stderr, exit code and timestamps are retained in
`validation/browser-attempt.json`, `browser.stdout.txt`, `browser.stderr.txt` and
`browser.exit.txt`. This is the worker browser-spawn limitation documented in
AGENTS.md, not a browser-gallery PASS. Prepared manager rerun from repo root:

```powershell
node tools/character-mapping/inspector-v6f/validate-gallery.mjs
```

It covers nineteen local pages at desktop/phone sizes (38 views), all image
loads, local links, script errors and horizontal overflow. Fresh ephemeral file
contexts have `location.origin === "null"`; no owner game origin/profile/storage
was accessed. Open the local gallery files for art review. The game opening
pathway remains `START_GAME.cmd` -> exact `http://127.0.0.1:4173` in the same
persistent browser profile; no save pathway changed.

Manager owns actual artifact/receipt review, visual/alpha/contact acceptance,
browser rerun and the separate runtime milestone. The batch is **LOCAL ONLY**;
no GitHub backup exists. After acceptance remind the owner to say **"push to
GitHub"** for the audited checkpoint. This worker did not update the shared
current-thread handoff or make a Git checkpoint.

## Exact CLI validation output

Eight commands exited 0. Full transcript below is copied verbatim from
`validation/worker-validation.txt`. PowerShell preserves Node's experimental
warnings as `NativeCommandError` records; their processes exit successfully.
The machine receipt retains each command, timing, actual output, exit code and
source-bound proof hashes. Earlier validation logs remain in `validation/history/`.

```text
"""
handoff += transcript + "```\n"
(tool / "HANDOFF.md").write_text(handoff, encoding="utf-8", newline="\n")
print(json.dumps({"status": "PASS", "handoff": "tools/character-mapping/inspector-v6f/HANDOFF.md", "exactValidationCommands": len(validation["results"]), "finalTextFiles": text_result["textFiles"]}, separators=(",", ":")))
