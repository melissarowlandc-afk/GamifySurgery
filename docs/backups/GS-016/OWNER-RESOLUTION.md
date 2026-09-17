# GS-011-001 resolution excerpt

Extracted from the local owner playthrough log; other feedback is outside this backup.

### GS-011-001 — Examination room present before player construction

- **Owner wording:** "When I started this new/fresh campaign, there was already an examination room built. That should not be in place when the game starts and only gets added when the player builds it."
- **Actual:** Owner saw an examination room already built when starting a campaign they identify as new/fresh.
- **Expected / intent:** A new campaign begins without an examination room; the room appears only after the player builds it.
- **Context / evidence:** Owner report in this task, 2026-09-10. Exact creation steps, opening path/origin, campaign identifier, and timing relative to onboarding are unknown. No screenshot, save inspection, or independent reproduction yet.
- **Impact:** Violates the intended starting state and bypasses a player construction step. Whether it blocks later progression is unknown.
- **Status / next step:** [GS-016](../../handoffs/GS-016_PREBUILT_EXAMINATION_ROOM.md) resolved; owner confirmed on 2026-09-17: "The examination room is gone at the start like it's supposed to be. Let's resolve GS-016". A genuinely new campaign starts without the room; normal construction adds it; reload preserves absence or built rooms and progress. Isolated browser and regression tests passed. The owner's campaign was not reset or inspected.
