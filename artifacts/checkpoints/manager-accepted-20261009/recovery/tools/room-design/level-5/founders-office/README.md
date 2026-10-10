# Founder's Office — 3×3, five complete appearance tiers

Review: <http://127.0.0.1:4191/tools/room-design/level-5/founders-office/proof/index.html>

The owner-directed layout has 12 one-tile door sections, a south-facing founder
north of the desk and a north-facing visitor south of it. Desk art shows the
visitor-side face; visitor chairs are viewed from behind. Both real seated
adults appear in every tier, with measured cushions and foreground chair layers.
All five tiers share floor/seat anchors, footprints, ownership and clear routes.

| Appearance | Furniture and decor |
| --- | --- |
| Level 1 — Startup | Basic table, simple office chair, folding visitor chair, wire rack, plain mat, small print |
| Level 2 — Established | Plain wood desk, padded chairs, wooden shelf, rug, unreadable diploma, plant |
| Level 3 — Refined | Paneled wood desk/lamp, leather founder chair, upholstered visitor chair, bookcase, patterned rug, art |
| Level 4 — Executive | Carved executive desk, high-back leather founder chair, leather guest chair, glass awards cabinet, rich rug, statement art, plant |
| Level 5 — Grand | Gold-trim carved desk, throne, velvet guest chair, ornate gold bookcase, luxurious rug, gilded art, generic classical bust |

**35 built-in imagegen calls, 33 selected originals, 10 source-pixel chair
foregrounds.** Exact prompts, untouched outputs, receipts, registrations and
SHA-256 hashes live in `assets/`; current prepared art is `assets/processed/v2/`.
Provenance: [assets/provenance.md](assets/provenance.md). The two revisions and
prior 4×4 candidate are preserved; earlier browser captures are superseded.

The accepted facility Level 5 room order is Founder's Office, Executive Office,
Gift Shop, Indoor Garden, Staff Gym; citations are in
[the plan](../../../../docs/execplans/level5-room-design-20261008.md).
Facility level and appearance tier are separate. Morale stays undecided;
owner art approval is pending and runtime integration is false.

Buttons select Level 1–5; keys 1–5 and left/right arrows cycle them. Tier changes
preserve doors, backing and inspection options. Existing controls cover every
door, three north backing sections, bulk actions, individual/all occupants,
grid, routes, contacts and measured bases. G/R/A/P/V/C/F/D/B toggle those
controls; Escape resets to Level 1. Native Tab/Space/Enter remains available.

`stand-in/v2/` retains the prepaint layout, sources and route receipt. Later
native replay images use the frozen originals without replacing the painted
proof. Documented post-art fit in `layout-reconciliation-v2.json` is shared by
all tiers and retains seat/floor anchors. See [ART_BRIEF.md](ART_BRIEF.md).

Run from the repository root with existing dependencies:

```text
node tools/room-design/level-5/founders-office/proof/validate.cjs
node tools/room-design/level-5/founders-office/proof/validate-controls.mjs
node tools/room-design/level-5/founders-office/proof/inspect-native.mjs
node tools/room-design/level-5/founders-office/proof/reproduce.mjs
node tools/room-design/level-5/founders-office/proof/check-helpers.cjs
node tools/room-design/level-5/founders-office/assets/write-provenance-v2.mjs
```

Manager browser QA with the existing port 4191 server:

```text
node tools/room-design/level-5/founders-office/proof/validate-browser.cjs
node tools/room-design/level-5/founders-office/proof/capture.cjs
```

The browser validator checks every tier, 560 door/backing states, 2,880 routes,
actual alpha/hashes, seated contacts/layers, keyboard and 320 px layout. Capture
writes all five tiers: 50 room states, five desktop pages and five narrow pages.
Known Canvas readback performance advisories are recorded separately. Real
page exceptions, console errors, HTTP errors and failed requests fail.
Worker syntax/dependency checks pass; browser execution remains with the manager.

Current evidence: `proof/evidence/v2/`. The five-tier comparison
`native-all-five-levels.png` and 45 individual native views are actual-render
inspections, not browser screenshots. Full outputs and manager commands are in
[WORKER_HANDOFF.md](WORKER_HANDOFF.md). Root evidence and
`history/4x4-base-20261008/` are historical.

This is a private room-art proof using no campaign storage. Owner gameplay stays
`START_GAME.cmd` → exact `http://127.0.0.1:4173` in the usual profile; no game save
is transferred to port 4191. No Git, install, gameplay, balance, runtime, save or
publication action. Local deliverables only; manager owns acceptance and backup.
