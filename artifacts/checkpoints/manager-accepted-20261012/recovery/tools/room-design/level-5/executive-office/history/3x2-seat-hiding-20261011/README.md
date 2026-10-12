# Executive Office ? owner-directed 3?2 mockup

Existing **room-lab-4191** URL:
<http://127.0.0.1:4191/tools/room-design/level-5/executive-office/proof/index.html>

Exact path: `/tools/room-design/level-5/executive-office/proof/index.html`.
[Current painted view](proof/evidence/v3/native-level-1-painted.png).

Owner review, 2026-10-10: ?The executive office should be 3x2 (can't be bigger than the founder [3x3]), but the rest of it looks good.? The active room is **three wide, two deep**, smaller than the approved 3?3 Founder. The complete former 4?3 room and its plan section are preserved byte for byte in [history/4x3-20261010/](history/4x3-20261010/WORKER_HANDOFF.md). Use the archived native PNGs for comparison; archived relative proof URLs retain their original paths.

Keep the dual-monitor desk, Executive/visitor chairs with both real seated stand-ins, nonverbal KPI board, window, plant, compact credenza and flat walkable rug. **Drop the round meeting table and its two chairs**: a second seating bay crowds the real desk approaches and door clearances. The credenza fits the right rear corner.

Executive sits north facing south; visitor sits south facing north. Desk presents its south panel and monitor backs. Adult scale, source contacts, 45 px cushion rise and original-pixel chair foregrounds stay the same; room anchors change.

Ten independent one-tile doors: **N1?N3, S1?S3, WA?WB, EA?EB**. Three north backing controls. N2 clears the Executive chair, sitter and armrest foreground; S2 clears the visitor chair, sitter and rear foreground. Closing restores each. Desk stays present at every door selection. KPI/window hide on owned doors/backing; plant/credenza hide on owned doors. Low backing keeps floor furniture full height. No pass-through exceptions.

`room.executive_office` has `appearanceChanges=false`: upgrades 1?5 share one corporate appearance. No costs, administrative effects, runtime integration or campaign storage. Compact-layout approval awaits manager browser QA and owner review.

Eight objects reuse the originals from ten prior built-in imagegen calls; **zero new calls**. Active geometry/preparation/evidence use `v3`; raw originals/prompts/receipts remain `v2`. Historical `v2` construction records remain in this folder as well as the complete archive.

Repository-root rebuild/checks, existing dependencies only:

```text
node tools/room-design/level-5/executive-office/assets/write-generation-v3.mjs
node tools/room-design/level-5/executive-office/proof/build.mjs
node tools/room-design/level-5/executive-office/proof/validate.cjs
node tools/room-design/level-5/executive-office/proof/validate-controls.mjs
node tools/room-design/level-5/executive-office/proof/inspect-native.mjs
node tools/room-design/level-5/executive-office/proof/reproduce.mjs
node tools/room-design/level-5/executive-office/proof/check-helpers.cjs
node tools/room-design/level-5/executive-office/assets/write-provenance-v3.mjs
```

Archive/draft/freeze/tool-adaptation scripts record one-time construction; do not rerun them over delivered files. Neutral replay requires a stand-in build; restore the painted build afterward. Manager runs `proof/validate-browser.cjs` and `proof/capture.cjs`. Browser status is explicitly pending.

Exact outputs and open owner questions: [WORKER_HANDOFF.md](WORKER_HANDOFF.md). Art receipt: [assets/provenance.md](assets/provenance.md). Port 4191 is isolated art proof. Gameplay remains `START_GAME.cmd` ? exact `http://127.0.0.1:4173` in the usual persistent profile; saves do not transfer. No server, launcher, runtime or balance change.
