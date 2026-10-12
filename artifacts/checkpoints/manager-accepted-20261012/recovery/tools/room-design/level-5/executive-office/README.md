# Executive Office - retained occupied seats, 2026-10-11

Existing **room-lab-4191**:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html>

Exact path: `/tools/room-design/level-5/executive-office/proof/index.html`.

The 3x2 Office keeps its corporate art and one fixed appearance at upgrades 1-5. **N2/S2 retain both chairs, sitters and original chair foregrounds.** Executive stays north facing south at its previous anchor. Visitor stays south facing north; its fixed placement moves 0.14T toward the desk for a valid S2 route at the unchanged 0.18T character radius.

Keep dual-monitor desk, occupied desk seats, nonverbal KPI, window, plant, compact credenza and rug. Meeting table and both meeting placements stay dropped because a separate bay crowds desk approaches and door clearances. The room is smaller than the approved 3x3 Founder.

Ten legal one-tile doors: N1-N3, S1-S3, WA-WB, EA-EB. Three north backing controls. Full portal paths pass around solid chairs and measured furniture bases. Prior item visibility remains: KPI N1/N2; window N3; plant N1/WA; credenza N2/N3/EA. Backing retains full-height floor furniture and both sitters.

Enable **Show passing adult**, then scrub progress, step and reverse. It opens N2/S2 and retains both seated characters. Approved adult .007 standing stills change direction and sort by floor depth with furniture. Closing either portal stops only this example walker. W toggles; Escape resets; upgrade switching preserves inspection state.

[Occupied middle doors](proof/evidence/v4/native-level-1-occupied-middle-doors.png) |
[Behind Executive](proof/evidence/v4/native-level-1-walk-behind-executive.png) |
[In front of visitor](proof/evidence/v4/native-level-1-walk-in-front-visitor.png).

Zero new imagegen calls; eight originals from ten prior built-in calls and two exact-source foregrounds. **All ten prepared sprites are byte-identical to v3.** Active freeze/preparation/evidence: `v4`; untouched originals/prompts/receipts: `v2`. Full 4x3 reference: [history/4x3-20261010/reference.html](history/4x3-20261010/reference.html). Prior 3x2 code/docs: `history/3x2-seat-hiding-20261011/`; v3 art/evidence are untouched.

Repository-root checks, existing dependencies:

```text
node tools/room-design/level-5/executive-office/proof/build.mjs
node tools/room-design/level-5/executive-office/proof/validate.cjs
node tools/room-design/level-5/executive-office/proof/validate-walking.mjs
node tools/room-design/level-5/executive-office/proof/validate-controls.mjs
node tools/room-design/level-5/executive-office/proof/inspect-native.mjs
node tools/room-design/level-5/executive-office/proof/reproduce.mjs
node tools/room-design/level-5/executive-office/proof/check-helpers.cjs
node tools/room-design/level-5/executive-office/assets/write-provenance-v4.mjs
```

One-time archive/revision/plan scripts have intake guards; retain them as construction records. Neutral replay requires `build.mjs --stand-in`, then `stand-in/v4/replay.mjs`; restore the painted build immediately.

Current browser launch is blocked by sandbox `spawn EPERM`. Manager reruns `proof/validate-browser.cjs` and `proof/capture.cjs`, then writes the conditional approval receipt. [WORKER_HANDOFF.md](WORKER_HANDOFF.md) has exact outputs and manager actions; [assets/provenance.md](assets/provenance.md) records hashes.

Port 4191 is isolated art proof without campaign storage. Gameplay stays `START_GAME.cmd` at exact `http://127.0.0.1:4173` in the usual profile; saves do not transfer. No runtime, balance, server or launcher change.
