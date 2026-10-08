# Map click info boxes, founder seats and no idle standing: recovery archive (2026-10-07)

The owner asked for this in chat and approved the plan (staff: box first,
Praise on a second click; seats: Waiting Room, patient-side Front Desk chair,
Break Room; Claude does the rule changes too; shop-trip rates unchanged), then
said "push to GitHub". Full log: `docs/handoffs/CLAUDE_ANIMATION_COORDINATION.md`
(sections "Claude claim — map click info boxes…" and "…implemented").

## What it changes

1. **Click a character → info box above the head** with "Name · Role" and
   what they are doing (e.g. "Waiting for clinician", "Waiting for CT
   abdomen", "Walking to the bathroom", "In line at the coffee kiosk",
   "Cleaning the CT Suite", "On break"). It follows the person, updates live,
   and fades after 5 s or on any other click. First click on an employee
   shows the box; a second click while it is up opens Praise.
2. **Founder seats.** The founder can sit in free Waiting Room chairs, the
   patient-side Front Desk chair and Break Room seats. A taken seat shows
   "Seat occupied". Opening a chart still interrupts; automatic founder shop
   trips no longer pull the founder out of a seat the player chose.
3. **No idle standing.** A standing or hallway patient (including one walking
   back from the bathroom or a shop) takes a free waiting chair, closest
   first. With every chair full, hallway patients move every 2–4 game
   minutes (editorial pacing). The idle founder chains to the next idle choice
   instead of standing still. Patients with a pending result are left alone
   so frozen test travel is unchanged. Shop-trip rates and income unchanged.
4. **Performance.** The hallway-wander and founder idle pickers now route only
   to the chosen spot instead of every candidate (tick median 22.7 → 3.0 ms in
   the overflow harness).

No clinical content, save schema or balance-config changes. The founder's
Break Room seat is stored in the existing `sit_in_chair` targetId as
`break-seat:<roomId>:<seatId>`.

## Contents

- `files/`: complete copies of files that are wholly this work
  (`founder-seats.ts`, `characterActivityPresentation.ts` + test,
  `characterInspect.ts`, the domain test, the e2e spec and its fixture).
- `recovery/patches/`: unified diffs of only Claude's hunks in 15 shared,
  dirty files. Each baseline was rebuilt by reversing exactly these edits
  (every reversal had to match once). `recovery/patch-verification.json`
  records that `git apply` of each patch to its baseline reproduces the live
  file byte for byte (SHA-256 included).
- `evidence/`: browser captures from the e2e run (separate QA origin 5183).
- `validation/results.json`: typecheck, tests, e2e and performance record.
- `manifest.json`: SHA-256 of every archived file.

## Restore

Copy `files/` over the repository root, then apply each patch:

```
git -c core.autocrlf=false apply recovery/patches/<file>.patch
```

Patches need surrounding code compatible with the shared tree at this
checkpoint (Codex's uncommitted Level 3 support, amenity, retail and
reducer work). If a hunk no longer applies, re-apply it by hand from the
patch text. Run the e2e only against a separate server, e.g.
`GAMIFY_E2E_EXTERNAL_SERVER=1 GAMIFY_E2E_BASE_URL=http://127.0.0.1:5183`.
