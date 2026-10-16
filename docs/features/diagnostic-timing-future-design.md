# Surgery-center diagnostic timing

Owner request, September 13, 2026; concrete timing decisions agreed October 7, 2026.

Implementation is tracked in `docs/execplans/facility-diagnostic-timing.md`.
The table below records owner-approved editorial game settings, not real-world
clinical turnaround claims or clinical approval. The GS034 runtime integration
is implemented and validated locally; acceptance evidence and the shared-tree
validation limits are recorded in `../handoffs/GS-034_DIAGNOSTIC_TIMING.md`.

| Test phase | External / offsite | Functional onsite route |
| --- | --- | --- |
| Bladder scan | 30 game minutes | 5 game minutes; no radiologist reading phase |
| US, duplex, X-ray, contrast swallow, ABI, CT, CTA interpretation | 30 game minutes | 5 game minutes with an operational reading room and radiologist |
| Basic, genetic, serology, aldosterone, breath: entire external test | 120 game minutes | Separate collection and processing phases below |
| Local specimen collection | Not an added phase on the entire external test | 15 game minutes per phlebotomist, one collection at a time |
| Processing after local collection | 60 game minutes | 15 game minutes with an operational staffed laboratory |
| Biopsy pathology | 60 game minutes | 30 game minutes with an operational staffed laboratory |
| Endoscopy pathology when a specimen is collected | Same pathology rule | Same pathology rule |
| Endoscopy visual finding | Finding is available during the procedure | Finding is available during the procedure |

Preserve already approved acquisition/procedure work times and the completed
prep/procedure/recovery flow. Acquisition, interpretation, specimen processing,
result readiness and physical care/recovery completion are separate events.
Staff process only one assigned study/collection/job at a time; busy installed
resources queue. Missing onsite room or staff criteria use a valid external
route. A reading-room queue must not send the patient into the reading room;
likewise, collected specimens may be processed without a patient laboratory visit.
Temporarily away installed staff wait locally under the separately approved
GS037 training rules. New accepted work freezes approved employee benefits;
an unknown return time suppresses a finite ETA until coverage is available.

The owner selected total estimates that include resource queues and walking.
Every testing answer choice, including distractors, must obtain its estimate
from the same runtime plan used for an accepted order and result-ready state.
Forecasts do not allocate resources or mutate gameplay state. Existing saved
frozen orders retain their timing/route/phase contracts after facility changes
and reload. Unsupported specialist work and external components of combined
orders retain their exact authored operational dispositions.

The owner approved a Level 3 radiologist reading room: $1,800 construction,
$24/hour upkeep, $300 per radiologist hire and $26/hour salary. An independently
approved 4x4 room proof already exists at
`tools/room-design/level-4/radiology-reading/approval-2026-10-07.md` and must be
preserved. All four workstations are functional, with one active study per
radiologist and a separate queue for each.
For older undivided offsite biopsy/endoscopy totals, the owner approved keeping
the inclusive total: sampled work splits its last 60 minutes into pathology.
Visual-only work has no pathology phase. Processing may overlap recovery;
the total is the final completion time, without adding overlapping waits twice.
Do not add image-reading payouts or change progression gates without separate
authorization. The specified phase times do not implicitly approve generic
room-upgrade speed multipliers.

## Historical September 13 design note

The current ultrasound, laboratory and other diagnostic durations are prototype
placeholders, not final balance values or real-world clinical turnaround times.
Eventually, the estimate shown for each testing answer choice and the duration
used for its resulting service must come from the same runtime calculation,
based on the player's surgery center.

At that time the owner had not decided how equipment, rooms, staffing and
upgrades would affect the calculation. The October 7 decisions above supersede
those open questions for the named testing phases. Further upgrade-tier benefits
remain separate product decisions.

Current integration to build on: `getAnswerChoiceServicePreview` in
`packages/game-domain/src/selectors.ts`, service routing and timing in the domain
balance context, and chart duration formatting in
`apps/player/src/session/viewModels.ts`. Retain estimates for every testing
choice, including distractors; do not put fixed durations inside authored
question prose or use timing availability to reveal the correct answer.

The September 13 presentation repair documents this follow-up. It does not
choose upgrade effects, replace timing balance values or implement the future
facility timing design.
