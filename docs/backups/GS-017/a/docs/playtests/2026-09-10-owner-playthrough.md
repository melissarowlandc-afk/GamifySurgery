# GS-011 — Owner playthrough feedback

Date: 2026-09-10–2026-09-11 (America/New_York)
Status: Open; ongoing owner playthrough. The owner decides when this session is complete.

## Session context

- Purpose: capture, clarify, prioritize, and scope follow-up work as observations arise.
- Owner reports starting a new/fresh campaign. Campaign name, game stage at each observation, build, browser/profile, opening path, and actual `location.origin`: not yet reported or independently inspected.
- Canonical local pathway: `START_GAME.cmd` → exactly `http://127.0.0.1:4173` in the same persistent browser profile. This is guidance, not evidence of the owner's current origin.
- Preserve the live game and saves. Do not reload, reset, change origins/profiles, restart the launcher/server, or modify the running application to investigate feedback.
- `PLAYTEST_PLAN.md` contains older scope/status; current owner reports and newer evidence take precedence. Its reload/reset exercises are not instructions for this session.

## Ordered feedback

Suggested order below is provisional and may be changed by the owner. Patient shortage and inaccessible trash are reported potential blockers; neither has been independently reproduced. Next observation ID: **GS-011-018**. The economy cluster follows; related visual reports are grouped together without assuming a shared cause.

| Order | ID | Observation | Category | Provisional impact | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | GS-011-009 | Patients seem to run out around day 6 | Content / progression report | High: may leave the player with no patients to see | Reported; cause unconfirmed |
| 2 | GS-011-012 | Some locations are inaccessible, leaving trash stuck | Facility usability / pathing report | High: player cannot resolve stuck trash at affected locations | Reported; coverage unconfirmed |
| 3 | GS-011-014 | Complex-patient correct answers need greater rewards | Economy / balance request | High: current rewards may not support desired progression | Reported requirement; no target supplied |
| 4 | GS-011-015 | Level 2 needs more income as the clinic expands | Economy / balance request | High: expansion may outpace income | Reported requirement; no target supplied |
| 5 | GS-011-016 | In-house lab/imaging should earn income when the required capacity is available | Economy / service-design request | High: requested mechanism supports room and employee expenses | Reported requirement; unimplemented status unknown |
| 6 | GS-011-017 | Room upkeep should be lower | Economy / balance request | High: upkeep is perceived as too costly | Reported requirement; no target supplied |
| 7 | GS-011-001 | Examination room already built in a fresh campaign | Bug report: initial campaign state | High: bypasses intended player construction/progression | [GS-016 resolved](../handoffs/GS-016_PREBUILT_EXAMINATION_ROOM.md); owner confirmed 2026-09-17 |
| 8 | GS-011-006 | Alerts & Events notifications arrive too frequently and quickly | Usability / pacing request | High: owner cannot comfortably keep up | Reported; significant reduction requested |
| 9 | GS-011-002 | Brief flashes of older game art | Bug report: visual rendering | Medium: intermittent visual disruption and inconsistent presentation | Reported; cause unverified |
| 10 | GS-011-005 | Employees still look wrong | Bug report / visual quality | Medium: employee appearance remains unsatisfactory | Reported unresolved; owner reports work in progress |
| 11 | GS-011-010 | Furniture is generally too small | Facility visual-design request | Medium: room scale feels wrong | Reported requirement |
| 12 | GS-011-011 | Chairs face the wrong way | Facility visual-design report | Medium: room presentation feels incorrect | Reported requirement |
| 13 | GS-011-013 | Legal door positions are difficult to find and align between rooms | Facility construction usability request | Medium: room connection placement is difficult | Reported; significant improvement requested |
| 14 | GS-011-008 | Wrong-answer chart needs two clicks to close | Interaction usability report | Medium: unnecessary extra interaction interrupts play | Reported; controls unknown |
| 15 | GS-011-003 | Decision result repeats the current update | Usability / presentation request | Medium: repetitive patient narrative obscures the new findings | GS-006 implemented; unit/browser validation and screenshot review passed |
| 16 | GS-011-004 | Correct answer must be obvious after an incorrect choice | Usability / learning-feedback request | Medium: unclear feedback makes the intended answer difficult to learn | GS-006 implemented; unit/browser validation and screenshot review passed |
| 17 | GS-011-007 | Board relevance of tTG-IgA plus total IgA question is uncertain | Clinical content-scope concern | Supplemental scope retained | GS-006 review complete; see September 11 follow-up below |

## September 11 GS-006 concept-review follow-up

The [board-expansion review receipt](../clinical-workbench/approvals/owner-delegated-board-expansion-2026-09-11.md)
records the reviewed sources, scope, twenty new groups and validation evidence.
This follow-up supersedes the original pending statuses for the items below;
the original owner reports remain preserved as history.

- **GS-011-003/004:** Terra implemented the chart presentation changes under
  Astra review. Completed decisions show answer outcomes without duplicating
  newly returned findings; incorrect-answer feedback explicitly names the key
  only after submission. All427 player tests pass, including focused regressions.
  Isolated browser acceptance passed; Astra reviewed the actual correct-answer
  feedback and distinct returned findings in screenshots. The owner's original
  encounter was not modified or independently reproduced.
- **GS-011-007:** The reviewed public SCORE outline does not explicitly name
  celiac serology. Retain the existing clinically coherent question as
  supplemental content; this does not establish that it is never tested.
  Source and scope rationale are recorded in the receipt and BOARD_CONTENT_SCOPE.
- **GS-011-009:** Twenty additional groups and forty multistep patients are
  implemented. This expands available content but does not diagnose or establish
  a fix for the reported day-six shortage. That report remains open.

Other reports, including chart-exit friction, economy, art and pathing, retain
their existing status. The owner's running campaign and server were not reset.

### GS-011-001 — Examination room present before player construction

- **Owner wording:** "When I started this new/fresh campaign, there was already an examination room built. That should not be in place when the game starts and only gets added when the player builds it."
- **Actual:** Owner saw an examination room already built when starting a campaign they identify as new/fresh.
- **Expected / intent:** A new campaign begins without an examination room; the room appears only after the player builds it.
- **Context / evidence:** Owner report in this task, 2026-09-10. Exact creation steps, opening path/origin, campaign identifier, and timing relative to onboarding are unknown. No screenshot, save inspection, or independent reproduction yet.
- **Impact:** Violates the intended starting state and bypasses a player construction step. Whether it blocks later progression is unknown.
- **Status / next step:** [GS-016](../handoffs/GS-016_PREBUILT_EXAMINATION_ROOM.md) resolved; owner confirmed on 2026-09-17: "The examination room is gone at the start like it's supposed to be. Let's resolve GS-016". A genuinely new campaign starts without the room; normal construction adds it; reload preserves absence or built rooms and progress. Isolated browser and regression tests passed. The owner's campaign was not reset or inspected.

### GS-011-002 — Older art briefly becomes visible

- **Owner wording:** "I also feel like the new art is layered on old art, sometimes there is a glitch and a like a very old version of the game is visible for a moment. I don't want any of those glitches to happen."
- **Actual:** Intermittent momentary visibility of what the owner recognizes as an older game appearance.
- **Expected / intent:** Current intended art remains visually consistent throughout play, with no flashes of older art.
- **Context / evidence:** Owner report in this task, 2026-09-10. Affected objects/screen regions, triggering action, frequency beyond "sometimes," and duration beyond "a moment" are unknown. No screenshot/clip or independent reproduction yet.
- **Impact:** Visible glitches disrupt presentation and confidence in the art update; no gameplay blockage reported.
- **Cause distinction:** New art being layered over old art is the owner's hypothesis, not a confirmed rendering diagnosis.
- **Status / most useful clarification:** Reported visual bug. Ask what the owner is doing when the old-art flash occurs. A screenshot or clip is optional; do not disturb ongoing play to obtain one.

### GS-011-003 — Separate decision outcome from new patient findings

- **Owner wording:** "When there are multiple steps/questions/decisions for one patient, the Decision 1 Result and the CURRENT UPDATE sections have the same information. The Decision 1 Result should just be the result of the question. The CURRENT UPDATE can just be the new findings. I think that will be more natural for the player"
- **Actual:** In a patient encounter with multiple steps/questions/decisions, the owner reports duplicated information in "Decision 1 Result" and "CURRENT UPDATE."
- **Expected / intent:** The completed decision's result section contains only that question's outcome/feedback. CURRENT UPDATE contains only the new findings for the next step, producing a more natural progression through the patient's story.
- **Context / evidence:** Owner report in this task, 2026-09-10. Patient/concept, exact displayed text, and whether every multistep encounter is affected are unknown. No independent reproduction yet.
- **Impact:** Redundant reading blurs the distinction between the previous decision's outcome and newly available clinical information.
- **Status / next step:** Presentation request with clear owner direction. Scope a focused chart-presentation review; do not infer a clinical-content change or approve a new concept/version from this feedback.

### GS-011-004 — Explicitly identify the correct answer after a wrong choice

- **Owner wording:** "It needs to be obvious what the correct answer is supposed to be in the explanation when an incorrect answer is chosen."
- **Actual / evidence:** Owner flags insufficient clarity about the correct answer in feedback after an incorrect choice. The specific patient/question, selected option, and displayed explanation were not supplied; no independent reproduction.
- **Expected / intent:** After an incorrect answer is submitted, the explanation explicitly identifies the correct answer so the player can immediately tell which answer was intended. A clearly visible "Correct answer: [answer text]" is a proposed presentation, not owner-approved exact copy.
- **Context:** Applies to incorrect-answer explanations generally; do not assume it is limited to multistep encounters or that every current question is affected.
- **Impact / status:** Medium learning-usability concern; owner-reported requirement, awaiting separately scoped investigation and implementation. No clarification is needed to capture the requested behavior.
- **Related:** GS-011-003 concerns separating decision feedback from new findings. Keep this distinct requirement alongside it so an eventual presentation change preserves both. This report does not approve or change a clinical answer key or concept version.

### GS-011-005 — Employees still look wrong

- **Owner wording:** "Employees still look messed up"
- **Actual / evidence:** Owner reports that employee appearance remains visibly wrong during the current playthrough. No employee identity/role, affected body region, posture/action, screenshot, or precise visual defect was supplied. No independent reproduction.
- **Expected / intent:** Employees should have the intended coherent appearance and render correctly during play; the reported appearance problem remains unresolved from the owner's perspective.
- **Impact / status:** Medium visual-quality concern. Owner-reported unresolved issue; the owner reports already working on character appearance, walking, and pathing, without an assumed completed fix or task ownership beyond the existing concept/character boundaries. "Still" does not establish which earlier repair or asset version is involved, or prove a regression.
- **Most useful clarification:** What specifically looks wrong with the employees' appearance? Optional visual evidence can help, but is not required and must not interrupt the playthrough.
- **Related / ownership:** Potentially related to GS-011-002, but neither a duplicate nor a shared cause is confirmed. Coordinate with GS-010 for employee art/asset work and existing graphics work for rendering defects; retain feedback here without taking over character creation.

### GS-011-006 — Significantly reduce Alerts & Events notification frequency

- **Owner wording:** "The number of notifications in the Alerts & Events area is way to frequent and fast so it is hard to keep up on. Need to significantly decrease these"
- **Actual / evidence:** Owner reports too many notifications arriving too rapidly in Alerts & Events, making the stream hard to follow. No measured rate, sample messages, game-speed setting, or specific event types were supplied. No independent reproduction or timing measurement.
- **Expected / intent:** Significantly fewer notifications and a more manageable arrival pace, giving the player time to read and keep up. A minor cosmetic change alone would not address the request. No exact target count or interval was specified.
- **Impact / status:** High usability/pacing concern; notification overload competes with gameplay attention. This is a reported tuning request, not a confirmed event-generation defect.
- **Scope / next step:** Separately inspect the contributing alert categories and their cadence before proposing a substantial reduction. Repetition, event-generation rate, and presentation timing are possible investigation areas, not confirmed causes. No clarification is needed to record the requested reduction.

### GS-011-007 — Owner questions board relevance of tTG-IgA plus total IgA

- **Owner wording:** "I think the tTG-IgA with a total IgA for gluten intolerance question isn’t usually tested on surgery boards, but maybe I’m wrong."
- **Actual / expected:** The owner questions whether this question belongs in the intended surgery-board scope. They explicitly express uncertainty; this is not a claim about clinical correctness or board-testing frequency.
- **Context / evidence:** Reported 2026-09-11. Exact concept/version, stem, answer choices, and clinical tier are unknown. No independent review or reproduction.
- **Impact / status:** Pending GS-006 clinical content-scope review. Keep the current content unchanged from this feedback alone.

### GS-011-008 — Close the wrong-answer chart with one click

- **Owner wording:** "When a question is wrong, you have to click twice to get out of the chart. Okay for it to just be once."
- **Actual / expected:** After a wrong answer, the owner needs two clicks to exit the chart and wants one click. The two controls and whether this affects all wrong-answer flows are unknown.
- **Context / evidence:** Reported 2026-09-11; no independent reproduction.
- **Impact / status:** Medium interaction friction. Related to GS-011-003 and GS-011-004; reported, not reproduced.

### GS-011-009 — Patients appear to run out around day 6

- **Owner wording:** "I seemed to run out of patients to see around day 6 so we need to make much more content."
- **Actual / expected:** The owner seemed to have no patients left to see around game day 6 and wants substantially more content. Whether eligible content was exhausted, arrivals stopped, patients were pending, or another gate applied is unknown.
- **Context / evidence:** Reported 2026-09-11; campaign state, available-patient list, day progression, and exact path are unknown. No independent reproduction.
- **Impact / status:** High potential progression blocker. Link to the owner's reported concept-expansion work; do not assume that work has fixed this report.

### GS-011-010 — Furniture is too small

- **Owner wording:** "The furniture is in general too small."
- **Actual / expected:** Furniture generally appears too small; owner wants room furnishings at a more appropriate visual scale.
- **Context / evidence:** Reported 2026-09-11. Affected furniture, rooms, and desired scale are unknown. No independent reproduction.
- **Impact / status:** Medium facility presentation concern; reported requirement.

### GS-011-011 — Chairs face the wrong way

- **Owner wording:** "Chairs are facing the wrong way."
- **Actual / expected:** Some chairs face the wrong direction; owner expects their orientation to fit the room.
- **Context / evidence:** Reported 2026-09-11. Affected chair types, rooms, and intended orientation are unknown. No independent reproduction.
- **Impact / status:** Medium facility presentation concern; reported requirement.

### GS-011-012 — Trash can become stuck at inaccessible locations

- **Owner wording:** "Some locations are not reachable so trash gets stuck and this is an issue."
- **Actual / expected:** At some inaccessible locations, trash cannot be reached and remains stuck. Trash must be reachable for clearing or prevented from being placed at inaccessible locations.
- **Context / evidence:** Reported 2026-09-11. Room layout, coordinates, actor, and reproduction sequence are unknown. No independent reproduction.
- **Impact / status:** High facility usability concern. It may depend on character pathing; link to GS-012 movement review, but its coverage of this issue is unconfirmed.

### GS-011-013 — Improve legal door-position discovery and alignment

- **Owner wording:** "Legal door spots need to be significantly improved because finding the match up between two rooms where a door could be is really difficult."
- **Actual / expected:** Finding matching legal door locations between two rooms is difficult. The owner requests a significant improvement to make valid connections easier to discover and align.
- **Context / evidence:** Reported 2026-09-11. Specific room pairs, orientation, and exact build interaction are unknown. No independent reproduction.
- **Impact / status:** Medium construction-usability concern; reported requirement.

### GS-011-014 — Increase rewards for correct complex patient questions

- **Owner wording:** "The money for getting more complex patient questions correct needs to go up."
- **Actual / expected:** The owner perceives rewards for correct complex-patient questions as too low and wants them increased.
- **Context / evidence:** Reported 2026-09-11. No reward amounts, complexity definition, patient examples, or balance measurements supplied. No independent reproduction.
- **Impact / status:** High balance concern; retain clinical complexity as distinct from patient acuity and facility progression.

### GS-011-015 — Add level-2 income as the clinic expands

- **Owner wording:** "In level 2 as the clinic is expanding, there need to be more ways to make money."
- **Actual / expected:** The owner wants more income sources in level 2 while the clinic expands.
- **Context / evidence:** Reported 2026-09-11. Current income sources, expenses, and desired revenue mix are unknown. No independent reproduction.
- **Impact / status:** High balance concern; reported requirement.

### GS-011-016 — In-house services should earn revenue when capacity exists

- **Owner wording:** "If you choose an answer where the patient can get their imaging or labs done in house because the necessary room/equipment is available then that should make the player money to cover the cost of having these employees and room upkeep."
- **Actual / expected:** When a selected answer uses in-house imaging or labs and the necessary room/equipment is available, the owner expects this service to earn money that helps cover employee and room-upkeep expenses.
- **Context / evidence:** Reported 2026-09-11. Which services, required capacity, accounting timing, and amounts are unknown. No independent reproduction.
- **Impact / status:** High concrete economy mechanism related to GS-011-015; keep it distinct for task acceptance.

### GS-011-017 — Lower room upkeep

- **Owner wording:** "Overall, I think room upkeep cost needs to be lower."
- **Actual / expected:** The owner perceives room upkeep as too expensive and wants it lowered.
- **Context / evidence:** Reported 2026-09-11. Current costs, affected rooms, and target values are unknown. No independent reproduction.
- **Impact / status:** High balance concern; reported requirement.

## Proposed follow-up tasks

Proposals only: none dispatched or implemented. The owner will tell GS Manager when this feedback is ready for task selection. Listed in the same provisional order as the observations.

1. **GS-011-009: Diagnose and restore sustainable patient availability.** Bound work to the day-6 availability path and its content/admission/progression conditions. Acceptance: an isolated representative campaign retains eligible patients to see beyond the reported point, with the reason for any intentional pause visible to the player; distinguish exhaustion of eligible content from arrival, pending, or gating behavior. Dependencies: capture baseline state without touching the owner's campaign; coordinate with the owner's concept-expansion work but do not duplicate it.
2. **GS-011-012: Make trash locations reachable or prevent inaccessible placement.** Bound work to the reported trash placement and movement/accessibility path. Acceptance: trash at identified locations can be reached and cleared, or cannot be placed at inaccessible locations, in an isolated layout; the change does not create unreachable destinations. Dependencies: obtain an affected layout/reproduction context; coordinate with GS-012 movement review because this may be a pathing dependency, while retaining a separate trash-coverage check.
3. **GS-011-014, GS-011-015, GS-011-016, and GS-011-017: Rebalance expansion economy.** Bound work to rewards for correct complex questions, level-2 revenue sources, in-house lab/imaging revenue when required capacity exists, and room upkeep. Acceptance: the scoped economy explicitly addresses all four owner requirements; eligible in-house service use earns revenue only when its required room/equipment is available; existing saves and progression remain valid; the owner reviews the resulting pace. Dependencies: measure representative baseline income and expenses, choose targets during bounded task scoping, and preserve clinical complexity separately from acuity and facility progression. No numerical targets are approved by this log.
4. **GS-011-001: Correct the fresh-campaign examination-room starting state.** Bound the investigation to campaign creation/onboarding and examination-room construction. Acceptance: a genuinely new campaign starts without this room; normal player construction adds it; existing campaigns retain their built rooms and progress. Validate in an isolated campaign/test context. Dependency: confirm the actual fresh-campaign path; coordinate with GS-001/GS-002 if save restoration or migration is implicated. Do not take over general persistence work.
5. **GS-011-006: Substantially reduce the Alerts & Events notification load.** Bound work to notification volume and delivery cadence. Acceptance: a representative isolated play sequence produces substantially fewer visible notifications than its measured baseline; spacing permits comfortable reading; essential action-required information remains discoverable; the owner confirms that the resulting pace is manageable. Dependencies: inspect current alert categories and cadence, establish a baseline without touching the live campaign, and choose concrete tuning targets during task scoping. Preserve ordinary game progression; no overall simulation-speed change is requested.
6. **GS-011-002: Identify and eliminate the reported old-art flash.** First capture the affected visual region and triggering sequence, then scope the responsible renderer/transition. Acceptance: the identified sequence consistently displays current intended art without a visible older-art frame, and affected transitions remain visually stable. Dependencies: reproduction context is still missing; coordinate file ownership with existing graphics work and GS-010 character integration. Do not assume the remedy is deleting old assets or broadly replacing art.
7. **GS-011-005: Identify and correct the employee appearance defect.** First establish which employees and visible defects the owner means, then bound ownership to the implicated asset or renderer. Acceptance: affected employees display the intended appearance in the reported viewing/action context and the owner confirms the defect is gone. Dependencies: the owner reports character appearance/walk/path work already in progress; coordinate with GS-010 and GS-012 before implementation. Do not assume a specific fix is complete or create competing character work.
8. **GS-011-010 and GS-011-011: Correct facility furniture scale and chair orientation.** Bound work to the reported furniture and chair presentation. Acceptance: identified furniture renders at the approved visual scale, affected chairs face their intended direction, and representative rooms retain usable placements. Dependencies: identify affected assets/rooms and coordinate with current facility-art ownership; no universal scale or direction is defined yet.
9. **GS-011-013: Improve legal door-position affordance.** Bound work to discovering and aligning valid door positions for adjacent rooms. Acceptance: a player can readily identify matching legal positions for representative adjacent rooms and place a door through the normal build interaction. Dependencies: inspect existing placement rules and capture representative difficult pairs; preserve valid current layouts.
10. **GS-011-008: Close wrong-answer chart with one action.** Bound work to the post-wrong-answer chart exit flow. Acceptance: the identified flow returns from the chart after one deliberate close action, without skipping required feedback or affecting correct-answer flow. Dependencies: identify the current two-click controls and coordinate with GS-011-003/GS-011-004 if they share chart components.
11. **GS-011-003: Separate multistep decision feedback and current findings.** Bound work to how the patient chart presents the completed decision and the next available update. Acceptance: each decision-result section contains that question's outcome/feedback; CURRENT UPDATE shows only newly available findings; those findings are not repeated in the prior result section; future findings are not exposed early; prior answer history and frozen encounters remain intact. Dependency: inspect a representative affected encounter and current chart data flow. Coordinate with GS-006 only if the clinical meaning or an exact approved concept/version must change.
12. **GS-011-004: Make the correct answer explicit in incorrect-answer explanations.** Bound work to post-submission answer feedback. Acceptance: after an incorrect choice, the explanation visibly names the correct answer using its text, remains accurate when options are randomized, and clearly distinguishes the correct answer from the player's selected answer; unanswered or future decisions are not revealed. Use the existing answer key and explanation rather than inventing clinical content. Dependencies: inspect the feedback data/rendering path and coordinate with GS-011-003 if they share components; any disputed key or changed clinical meaning stays with GS-006.
13. **GS-011-007: Review tTG-IgA plus total-IgA question against approved surgery-board scope.** Bound work to identifying the concept/version and reviewing its fit through GS-006. Acceptance: the item is either retained with documented approved scope rationale, revised through the clinical workflow, or removed/withheld from the applicable release; no conclusion follows from this playtest note alone. Dependencies: exact concept/version and clinical review evidence; no board-frequency or clinical-correctness assertion is authorized here.

## Ownership and boundaries

- GS-011 owns this log and feedback scoping. Code fixes require explicit bounded scope; do not silently implement reports.
- GS Manager coordinates separate implementation tasks; do not alter shared PM documents or send external messages from feedback intake.
- GS-006 retains clinical concept/version review and approval; clinical observations may be captured here.
- GS-010 retains patient/employee character creation.
- GS-012 retains movement review and selected improvements. GS-011-012 may feed that task, but no coverage or ownership transfer is assumed.
- Existing shared worktree changes are unrelated to log initialization and must be preserved.
- Keep this task open throughout the playthrough. An individual logged or resolved issue does not authorize push or archival. After the owner agrees the task is complete, follow the standing scoped documentation audit/backup/remote-verification/archival instruction unless they request it remain open.

## Intake record

- 2026-09-10: Initialized the log after reading repository instructions and relevant project-board, current-handoff, and playtest-plan sections. No gameplay inspection or intervention. No observations independently reproduced. No follow-up tasks dispatched.
- 2026-09-10: Recorded the owner's first three observations as GS-011-001 through GS-011-003, with provisional priorities and proposed bounded follow-ups. This was a small direct documentation update; no worker, code investigation, gameplay intervention, or fix. All three observations remain owner-reported rather than independently reproduced or resolved.
- 2026-09-10: Added GS-011-004 for explicit correct-answer identification after an incorrect choice, linked to GS-011-003 while retaining a separate acceptance requirement. Small direct log update, read back for verification; no worker, code change, or gameplay intervention.
- 2026-09-10: Added GS-011-005 (employee appearance still wrong) and GS-011-006 (significantly reduce Alerts & Events notifications). Prioritized alert overload second and grouped visual reports without merging their unknown causes. Small direct log update, read back for verification; no worker, code investigation, gameplay intervention, task dispatch, or fix.
- 2026-09-11: Added GS-011-007 through GS-011-017 from the owner's current playthrough: one clinical scope concern, chart-exit friction, apparent patient shortage, furniture/chair presentation, inaccessible trash, door-placement usability, and four economy requests. Reordered provisional priorities with patient availability and inaccessible trash first, followed by the economy cluster. The owner reports concept expansion and character appearance/walk/path work already in progress; those reports are linked as boundaries only, with no assumed completion, task assignment, or independent reproduction. Documentation-only update; no gameplay intervention, investigation, task dispatch, or fix.
