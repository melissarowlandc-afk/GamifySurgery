# GS-011 — Owner playthrough feedback

Date: 2026-09-10–2026-09-17 (America/New_York)
Status: Open; ongoing owner playthrough. The owner decides when this session is complete.

## Session context

- Purpose: capture, clarify, prioritize, and scope follow-up work as observations arise.
- Owner reports starting a new/fresh campaign. Campaign name, game stage at each observation, build, browser/profile, opening path, and actual `location.origin`: not yet reported or independently inspected.
- Canonical local pathway: `START_GAME.cmd` → exactly `http://127.0.0.1:4173` in the same persistent browser profile. This is guidance, not evidence of the owner's current origin.
- Preserve the live game and saves. Do not reload, reset, change origins/profiles, restart the launcher/server, or modify the running application to investigate feedback.
- `PLAYTEST_PLAN.md` contains older scope/status; current owner reports and newer evidence take precedence. Its reload/reset exercises are not instructions for this session.

## Ordered feedback

Suggested order below is provisional and may be changed by the owner. Patient shortage and inaccessible trash are reported potential blockers; neither has been independently reproduced. Next observation ID: **GS-011-038**. The economy cluster follows; related visual reports are grouped together without assuming a shared cause. Added September 17: GS-011-018 is a high-priority tutorial-completion requirement that must be included in tutorial and economy acceptance, regardless of its intake position below.

| Order | ID | Observation | Category | Provisional impact | Status |
| --- | --- | --- | --- | --- | --- |
| 1 | GS-011-009 | Patients seem to run out around day 6 | Content / progression report | High: may leave the player with no patients to see | [GS-017 diagnosis](../handoffs/GS-017_PLAYTHROUGH_BATCH.md): current day-eight supply verified; finite eligibility boundary documented; historical cause unconfirmed |
| 2 | GS-011-012 | Some locations are inaccessible, leaving trash stuck | Facility usability / pathing report | High: player cannot resolve stuck trash at affected locations | Reported; coverage unconfirmed |
| 3 | GS-011-014 | Complex-patient correct answers need greater rewards | Economy / balance request | High: current rewards may not support desired progression | Reported requirement; no target supplied |
| 4 | GS-011-015 | Level 2 needs more income as the clinic expands | Economy / balance request | High: expansion may outpace income | Reported requirement; no target supplied |
| 5 | GS-011-016 | In-house lab/imaging should earn income when the required capacity is available | Economy / service-design request | High: requested mechanism supports room and employee expenses | Reported requirement; unimplemented status unknown |
| 6 | GS-011-017 | Room upkeep should be lower | Economy / balance request | High: upkeep is perceived as too costly | Reported requirement; no target supplied |
| 7 | GS-011-001 | Examination room already built in a fresh campaign | Bug report: initial campaign state | High: bypasses intended player construction/progression | [GS-016 resolved](../handoffs/GS-016_PREBUILT_EXAMINATION_ROOM.md); owner confirmed 2026-09-17 |
| 8 | GS-011-006 | Alerts & Events notifications arrive too frequently and quickly | Usability / pacing request | High: owner cannot comfortably keep up | [GS-017 revision](../handoffs/GS-017_PLAYTHROUGH_BATCH.md): plain-list filtering and specific cadence rules implemented; focused/browser checks passed; owner acceptance pending |
| 9 | GS-011-002 | Brief flashes of older game art | Bug report: visual rendering | Medium: intermittent visual disruption and inconsistent presentation | Reported; cause unverified |
| 10 | GS-011-005 | Employees still look wrong | Bug report / visual quality | Medium: employee appearance remains unsatisfactory | Reported unresolved; owner reports work in progress |
| 11 | GS-011-010 | Furniture is generally too small | Facility visual-design request | Medium: room scale feels wrong | Reported requirement |
| 12 | GS-011-011 | Chairs face the wrong way | Facility visual-design report | Medium: room presentation feels incorrect | Reported requirement |
| 13 | GS-011-013 | Legal door positions are difficult to find and align between rooms | Facility construction usability request | Medium: room connection placement is difficult | Reported; significant improvement requested |
| 14 | GS-011-008 | Wrong-answer chart needs two clicks to close | Interaction usability report | Medium: unnecessary extra interaction interrupts play | [GS-017 implemented](../handoffs/GS-017_PLAYTHROUGH_BATCH.md); isolated browser validation passed; owner acceptance pending |
| 15 | GS-011-003 | Decision result repeats the current update | Usability / presentation request | Medium: repetitive patient narrative obscures the new findings | GS-006 implemented; unit/browser validation and screenshot review passed |
| 16 | GS-011-004 | Correct answer must be obvious after an incorrect choice | Usability / learning-feedback request | Medium: unclear feedback makes the intended answer difficult to learn | GS-006 implemented; unit/browser validation and screenshot review passed |
| 17 | GS-011-007 | Board relevance of tTG-IgA plus total IgA question is uncertain | Clinical content-scope concern | Supplemental scope retained | GS-006 review complete; see September 11 follow-up below |
| 18 | GS-011-018 | Tutorial must remain completable when every answer is wrong | Tutorial progression / economy requirement | High: prevent incorrect answers from blocking tutorial completion | Owner-approved GS-023 exception implemented and technically verified, including natural all-wrong browser graduation/reload; owner playtest pending |
| 19 | GS-011-019 | Explain the management button in the tutorial | Tutorial guidance request | Medium: feature may be missed | GS-023 implemented and technically verified during second-patient send-out wait; owner playtest pending |
| 20 | GS-011-020 | Explain trash in the tutorial | Tutorial guidance request | Medium: trash interaction may be unclear | GS-023 implemented and technically verified during second-patient send-out wait; owner playtest pending |
| 21 | GS-011-021 | Explain the water cooler in the tutorial | Tutorial guidance request | Medium: water-cooler interaction may be unclear | GS-023 implemented and technically verified during second-patient send-out wait; owner playtest pending |
| 22 | GS-011-022 | Founder seats at front desk on click and automatically returns after assigned tasks until secretary hire | Founder interaction request | Medium: repeated desk commands should be unnecessary | GS-023 implemented; domain, rendered seating and isolated browser checks passed. Owner playtest pending |
| 23 | GS-011-023 | Founder can sit in any chair | Founder interaction request | Medium: desired chair interaction is unavailable or unclear | Reported; interaction rules unchosen |
| 24 | GS-011-024 | Recurring review/edit of flagged questions on this computer | Owner workflow request | Workflow: flagged questions need intermittent review | Reported; cadence pending and no reminder scheduled |
| 25 | GS-011-025 | Tentative $50 GLP-1 consult revenue | Economy suggestion | Pending: exact payment not accepted | Reported suggestion; not implemented or verified here |
| 26 | GS-011-026 | Procedure-answer questions require a procedure room before appearing | Facility eligibility gate | High: prevent unavailable procedures from being presented as the correct answer | Reported requirement; not implemented or verified here |
| 27 | GS-011-027 | Review all minor-procedure-room services and pay for eligible performed procedures, including the reported SCC skin biopsy | Economy / service revenue request | High: procedure-room services should support player income | Reported and expanded; catalog review and implementation pending |
| 28 | GS-011-028 | Remove imaging control room; mobile imaging techs and ordinary room-door access | Facility design change | High: simplify imaging construction and staffing for the player | GS-020 technically verified and closed under owner authorization; scoped GitHub backup fdd5bf7 verified. Hands-on acceptance not inferred. Ordinary access, sequential mobile staffing and legacy-save checks passed. See [GS-020 handoff](../handoffs/GS-020_ULTRASOUND_FIRST_IMAGING.md). |
| 29 | GS-011-029 | Shared multistep wait-time table based on available facilities | Gameplay timing / configuration requirement | High: consistent timing and meaningful facility progression | Owner agreement on table required before implementation |
| 30 | GS-011-030 | Room upgrades change function only; founder's office is the visual exception | Room upgrade design | Medium: reduce repeated room-art design work | Firm design direction; not implemented or verified here |
| 31 | GS-011-031 | Progress toward more automation and sustainable income beyond level 1 | Progression / economy goal | High: desired later-game management payoff | Owner goal; later-level behavior not established by this report |
| 32 | GS-011-032 | Secretary automatically refills water during a gap in front-desk patient work, then returns | Staff automation requirement | Medium: reduce manual water-refill management after hiring | GS-023 completed existing automation with patient priority and next-gap empty refill; technical validation passed, owner playtest pending |
| 33 | GS-011-033 | Patient frequency feels very high at the start of level 1, then slows | Patient flow / pacing observation | Medium: potentially uneven workload and income | Owner-reported pattern; cause and desired pace unconfirmed |
| 34 | GS-011-034 | Require an ultrasound room in level 1 in place of the X-ray room | Facility progression / design change | High: improve early usefulness of the required imaging investment | GS-020 technically verified and closed under owner authorization; scoped GitHub backup fdd5bf7 verified. Hands-on acceptance not inferred. Level1 ultrasound advances without X-ray; optional Level2 X-ray and onsite ultrasound checked. See [GS-020 handoff](../handoffs/GS-020_ULTRASOUND_FIRST_IMAGING.md). |
| 35 | GS-011-035 | Scheduled outside visitors receive imaging and generate income without questions | Economy / service-only visitor proposal | Potentially high: income independent of the teaching-question supply | Tentative owner proposal; not implemented or verified here |
| 36 | GS-011-036 | Small green earnings popup above the character whose service/purchase earns money | Revenue feedback / visual requirement | Medium: make earned income visible during play | Owner requirement; amounts shown are examples, implementation pending |
| 37 | GS-011-037 | Non-question blood-draw visits and low-rate outside visitors for coffee, gift shop, and other services | Economy / visitor design | High: broaden service income without extra teaching questions | Owner direction; rates, prices, and prerequisites unchosen |

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

- **Owner revision (2026-09-17):** Rejected expandable grouping. Implemented plain-list filtering with no check-in/result-return messages, hour-long condition thresholds, daily water/litter/no-arrival and spaced complaint notices, level-3 room-upgrade complaints every two days, and humor at most every two in-game hours. Persistent cooldowns and legacy migration tested; final alert-domain 33/33 and five isolated browser scenarios passed. Shared-suite limitations and exact operating-day interpretation are recorded in the GS-017 handoff. Owner acceptance remains pending. Earlier grouping evidence below is superseded.

- **GS-017 technical follow-up (2026-09-17):** Implemented expandable groups for repeated routine/flavor history while retaining current actionable warnings. A mixed fixture reduced seven nonpersistent rows to three with all originals accessible. Simulation/event timing is unchanged. Tests passed; isolated browser validation passed; owner acceptance pending. See [scoped handoff](../handoffs/GS-017_PLAYTHROUGH_BATCH.md). Original report follows.

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

- **GS-017 technical follow-up (2026-09-17):** Reproduced separate terminal acknowledgment and filing actions. Deliberate Close now acknowledges displayed feedback and exits once; terminal primary reads “Dismiss and close chart.” Intermediate tests, later decisions, feedback history and scoring are preserved. Tests passed; isolated browser validation passed; owner acceptance pending. See [scoped handoff](../handoffs/GS-017_PLAYTHROUGH_BATCH.md). Original report follows.

- **Owner wording:** "When a question is wrong, you have to click twice to get out of the chart. Okay for it to just be once."
- **Actual / expected:** After a wrong answer, the owner needs two clicks to exit the chart and wants one click. The two controls and whether this affects all wrong-answer flows are unknown.
- **Context / evidence:** Reported 2026-09-11; no independent reproduction.
- **Impact / status:** Medium interaction friction. Related to GS-011-003 and GS-011-004; reported, not reproduced.

### GS-011-009 — Patients appear to run out around day 6

- **GS-017 technical follow-up (2026-09-17):** A prepared current-library level-1 clinic sustained 78 natural arrivals/completions through eight game days, including 10/10/9 arrivals on days six/seven/eight. At the end no reviews were due and selection paused at the finite eligible-content boundary; unseen concepts can be blocked by not-due siblings in multistep cases. No replenishment defect or historical cause was established, and no review rules/content were changed. Exact conditions, counts and actionable GS-006 content-coverage follow-up are in the [scoped handoff](../handoffs/GS-017_PLAYTHROUGH_BATCH.md). This is a diagnosis, not an owner-accepted fix. Original report follows.

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

- **GS-021 closeout status (2026-09-17):** Completed approved income expansion: service-only appointments, eligible performed-service fees, GLP-1 and retail income. Owner accepted GS-021 completion; long-term economy tuning is not claimed. Verified domain/player/clinical/balance suites and isolated browser scenarios; completion authorization is not a claim of separately reported hands-on playtesting. [GS-021 handoff](../handoffs/GS-021_CLINIC_INCOME.md). This supersedes the historical intake status below.

- **Owner wording:** "In level 2 as the clinic is expanding, there need to be more ways to make money."
- **Actual / expected:** The owner wants more income sources in level 2 while the clinic expands.
- **Context / evidence:** Reported 2026-09-11. Current income sources, expenses, and desired revenue mix are unknown. No independent reproduction.
- **Impact / status:** High balance concern; reported requirement.

### GS-011-016 — In-house services should earn revenue when capacity exists

- **GS-021 closeout status (2026-09-17):** Completed eligible onsite completion payments with room/staff/resource checks, durable receipts and no legacy backpay. Future laboratory processing has a gated handler; later-level progression remains separate. Verified domain/player/clinical/balance suites and isolated browser scenarios; completion authorization is not a claim of separately reported hands-on playtesting. [GS-021 handoff](../handoffs/GS-021_CLINIC_INCOME.md). This supersedes the historical intake status below.

- **Owner wording:** "If you choose an answer where the patient can get their imaging or labs done in house because the necessary room/equipment is available then that should make the player money to cover the cost of having these employees and room upkeep."
- **Actual / expected:** When a selected answer uses in-house imaging or labs and the necessary room/equipment is available, the owner expects this service to earn money that helps cover employee and room-upkeep expenses.
- **Context / evidence:** Reported 2026-09-11. Which services, required capacity, accounting timing, and amounts are unknown. No independent reproduction.
- **Impact / status:** High concrete economy mechanism related to GS-011-015; keep it distinct for task acceptance.

### GS-011-017 — Lower room upkeep

- **Owner wording:** "Overall, I think room upkeep cost needs to be lower."
- **Actual / expected:** The owner perceives room upkeep as too expensive and wants it lowered.
- **Context / evidence:** Reported 2026-09-11. Current costs, affected rooms, and target values are unknown. No independent reproduction.
- **Impact / status:** High balance concern; reported requirement.

### GS-011-018 — Guarantee tutorial completion with every question answered incorrectly

- **GS-023 approved implementation (2026-09-18):** Owner approved the narrow exception ("Yes you may"). Both protected tutorial patients completed plus an accessible Examination Room now permits deliberate Level-0 advancement regardless of answer-derived XP/satisfaction. Actual answers, final scores and learning history remain honest; later-level requirements remain unchanged. Parent domain516/player467 tests, all workspace typechecks, boundaries and isolated build passed, including natural all-wrong/mixed/all-correct graduation and reload. Sol's natural browser proof passed1/1: exactly3 wrong answers, ordinary $160 room/door build, honest6/10XP, explicit Level1 advance and reload; parent reviewed result/spec/screenshot. Owner playtest pending. This supersedes the pending-approval status in the historical investigation below.

- **GS-023 investigation (2026-09-18):** Preserve GS-016's passing all-wrong funding, Examination Room/door construction and reload proof. Full graduation is a separate gap: reproducible seed player-built-exam reaches10 XP after an ordinary recovery patient but remains below satisfaction91. Two patients remain queued, so this is not proof every continuation fails. Completed scores cannot be repaired by chores, and new Level0 admissions stop at the XP threshold. Parent independently reproduced the diagnostic. Proposed tutorial-only graduation exception awaits owner agreement; no graduation rules changed. [GS-023 evidence and decision](../handoffs/GS-023_TUTORIAL_DAILY_ROUTINES.md). This supersedes the historical uninspected-status wording below.

- **Owner wording:** "I do need to make sure that the player will still get enough money and experience and everything to make it thorugh the tutorial if they get all the questions wrong"
- **Expected / intent:** A player following the tutorial must be able to finish even with zero correct answers. Available money, experience, and any other required progression resources must cover every mandatory tutorial step and purchase.
- **Actual / evidence:** Requirement supplied 2026-09-17; the owner has not reported an observed all-wrong tutorial failure. Current rewards, expenses, thresholds, and this scenario's completion status have not been inspected or tested here.
- **Impact / status:** High-priority progression safeguard, not an independently confirmed bug. Tutorial completion must not require a correct answer, developer tools, a campaign reset, or manual rescue.
- **Scope / dependencies:** Cover the ordinary tutorial path, its required construction and other costs, ongoing costs incurred during that path, and all experience/unlock gates. This does not establish unlimited funding for arbitrary optional spending or indefinite waiting. Preserve honest incorrect-answer feedback and learning history. No particular reward amounts or funding mechanism have been chosen.
- **Related:** GS-011-001 (player builds the examination room), GS-011-003/004 (decision feedback), and GS-011-014–017 (economy). Preserve the other tasks' recorded implementation/resolution status; this is an additional acceptance scenario.

### GS-011-019 — Explain the management button during the tutorial

- **GS-023 implementation (2026-09-18):** Owner-approved card appears while the second, two-part patient is actually away for the timed service. Explains Employees and Services & income; optional Open Management requires no purchase/hire. Got It advances; pause and progress survive reload. Unit, durable-storage and isolated browser checks passed; owner playtest pending. [GS-023 handoff](../handoffs/GS-023_TUTORIAL_DAILY_ROUTINES.md). Supersedes historical intake status below.

- **Owner wording:** "the management button needs to be explained to the player during the tutorial."
- **Intent / unknowns:** The tutorial should introduce the management button at an appropriate moment and make its player purpose clear. Current tutorial timing, copy, and whether the owner means all management features are unknown.
- **Status:** Reported 2026-09-17; not implemented or verified here.

### GS-011-020 — Explain trash during the tutorial

- **GS-023 implementation (2026-09-18):** During the second-patient send-out wait, explains clicking litter for founder cleanup; highlights existing litter when available, without spawning or requiring a chore. Got It and saved progress prevent a tutorial task gate. Technical validation passed; owner playtest pending. This does not claim to solve the separate GS-011-012 accessibility report. [GS-023 handoff](../handoffs/GS-023_TUTORIAL_DAILY_ROUTINES.md). Supersedes historical intake status below.

- **Owner wording:** "Trash ... should be explained during the tutorial."
- **Intent / unknowns:** The tutorial should explain trash and the ordinary player response. Exact trigger, wording, and relationship to GS-011-012 accessibility are unknown.
- **Status:** Reported 2026-09-17; not implemented or verified here.

### GS-011-021 — Explain the water cooler during the tutorial

- **GS-023 implementation (2026-09-18):** During the second-patient send-out wait, explains manual low-water refill and later secretary empty-cooler automation, with a cooler highlight. No emptying, spending or refill is required to advance. Saved progress/pause and isolated browser checks passed; owner playtest pending. [GS-023 handoff](../handoffs/GS-023_TUTORIAL_DAILY_ROUTINES.md). Supersedes historical intake status below.

- **Owner wording:** "... water cooler should be explained during the tutorial."
- **Intent / unknowns:** The tutorial should explain the water cooler and its ordinary player use. Exact trigger and behavior to teach are unknown.
- **Status:** Reported 2026-09-17; not implemented or verified here.

### GS-011-022 — Seat founder at the front desk before secretary hire

- **GS-023 implementation (2026-09-18):** Visible desk/chair click targets the staff anchor and uses the existing seated pose. Successful assigned chores and released patient/provider work return before any secretary hire; busy/reserved work and newer manual moves take priority. Hiring clears only automatic return. Occupied/unreachable targets do not teleport the founder. Domain, hit-area and live rendered-pose tests passed; parent reviewed corrected seated screenshot. Any-chair seating remains excluded. Owner playtest pending. [GS-023 handoff](../handoffs/GS-023_TUTORIAL_DAILY_ROUTINES.md). Supersedes historical intake status below.

- **Owner wording:** "Clicking on the desk or chair should send the founder to sit at the front desk until a secretary is hired."
- **Follow-up owner wording (2026-09-17):** "Have the founder always walk back to sit down at the front desk after they are done doing whatever they were instructed to do by the player (like pick up trash, fill up water, working with a patient) until a secretary is hired"
- **Intent:** Clicking the front desk or its chair sends the founder to sit there before secretary hire. Also, after completing any player-assigned task, the founder automatically walks back and sits at the front desk without another click. Trash pickup, water refill, and patient work are explicit examples, not an exhaustive task list. This automatic return behavior ends when a secretary is hired.
- **Unknowns / boundaries:** Current behavior has not been inspected. Exact interaction with explicit seating elsewhere (GS-011-023), occupied or inaccessible desk chairs, and task cancellation needs implementation scoping. Return follows task completion and must not interrupt unfinished work or override a newer player command.
- **Status:** Reported 2026-09-17; not implemented or verified here. Related to current movement/seating renderer ownership; preserve GS-013 character-surface work.

### GS-011-023 — Let founder sit in any chair

- **Owner wording:** "Sitting any chair should let the founder sit there."
- **Intent / unknowns:** The owner wants chair interaction to allow the founder to sit in any chair. Chair occupancy, interruption, selection, and pathing rules are unchosen.
- **Status:** Reported 2026-09-17; not implemented or verified here. Related to current movement/seating renderer ownership; preserve GS-013 character-surface work.

### GS-011-024 — Owner flagged-question review workflow

- **Owner wording:** "I need to remember to intermittently be going through all my flagged questions on this computer to edit those."
- **Intent / unknowns:** The owner wants an intermittent local workflow for reviewing and editing flagged questions. Cadence, the exact flagged-question surface, and reminder wording are pending; no reminder is scheduled from this feedback entry.
- **Status:** Reported 2026-09-17; personal workflow request, not implemented or verified here.

### GS-011-025 — Tentative GLP-1 consult revenue

- **GS-021 closeout status (2026-09-17):** Completed at the explicitly approved $50 per consult. Operational room plus NP hides the left-side box; actual completed consults show +$50 above the NP. Verified domain/player/clinical/balance suites and isolated browser scenarios; completion authorization is not a claim of separately reported hands-on playtesting. [GS-021 handoff](../handoffs/GS-021_CLINIC_INCOME.md). This supersedes the historical intake status below.

- **Owner wording:** "Maybe $50 for the GLP-1 consult."
- **Intent / unknowns:** The owner suggests $50 as possible revenue for a GLP-1 consult. This is not an accepted exact price, does not change a clinical claim, and needs scoped economy review.
- **Status:** Reported 2026-09-17; not implemented or verified here. Related to GS-011-014–017 economy work.

### GS-011-026 — Gate eligible procedure-answer questions on procedure-room availability

- **GS-021 closeout status (2026-09-17):** Partially addressed through explicit minor-procedure capability gates for the mapped skin-biopsy, cutaneous-abscess and postoperative-wound cases. Do not mark the broader aspiration/all-procedure eligibility audit complete solely from GS-021. Verified domain/player/clinical/balance suites and isolated browser scenarios; completion authorization is not a claim of separately reported hands-on playtesting. [GS-021 handoff](../handoffs/GS-021_CLINIC_INCOME.md). This supersedes the historical intake status below.

- **Owner wording:** "Don’t let any questions where the right answer is to perform an abscess I&D or aspiration or anything like that happen until there is a procedure room."
- **Intent / unknowns:** Questions whose correct answer is performing abscess I&D, aspiration, or a comparable procedure must not occur before a procedure room exists. This is an eligibility gate on presenting the question, not merely disabling the correct answer after presentation. Exact procedure membership requires scoping; do not suppress every question that merely mentions an abscess or aspiration.
- **Status:** High-priority reported requirement, not implemented or verified here. Clinical appropriateness remains separate from the facility gate; future work must preserve answered/frozen clinical history rather than rewriting it.

### GS-011-027 — Earn procedure revenue after procedure-room availability

- **GS-021 closeout status (2026-09-17):** Completed the approved minor-procedure catalog and explicit existing action/route mappings, including SCC biopsy. Payment requires actual local work once; no payment merely for answering or reopening a chart. Verified domain/player/clinical/balance suites and isolated browser scenarios; completion authorization is not a claim of separately reported hands-on playtesting. [GS-021 handoff](../handoffs/GS-021_CLINIC_INCOME.md). This supersedes the historical intake status below.

- **Owner wording:** "Once there is a procedure room then those procedures should make money for the player each time they happen."
- **Follow-up owner wording (2026-09-17):** "We should go through all the things that can happen in the minor procedure room and make money. Like one of the questions had a skin biopsy for SCC, that can happen in the minor procedure room once it is built to make money"
- **Intent / unknowns:** Once the procedure room exists, each performed eligible procedure should earn player revenue. Exact eligible procedures and payment values require scoping.
- **Expanded scope:** Review the complete set of applicable question/procedure actions for minor-procedure-room revenue. Include the skin biopsy for SCC from the owner's playthrough as an explicit candidate and intended in-game service once the room is built. Its exact question/concept ID, biopsy type, prerequisites, timing, and payment have not been inspected or agreed here. Preserve the distinction between biopsy and any later treatment; do not infer additional clinical procedures from this example.
- **Review deliverable:** A reviewable service table mapping relevant question/concept IDs to the procedure, room and other capability requirements, timing-table reference (GS-011-029), and proposed revenue, with unresolved inclusion questions marked. Coordinate clinical applicability with GS-006 and retain GS-011-026's pre-room eligibility restriction. This extends the existing procedure-revenue request rather than starting a duplicate task.
- **Status:** High-priority reported requirement, not implemented or verified here. This is distinct from GS-011-026: the room gate controls question eligibility; actual performed eligible procedures yield payment once per performance, not per chart reopen or replay. Future work must preserve answered/frozen clinical history rather than rewriting it.

### GS-011-028 — Simplify imaging rooms, access, and staffing

- **GS-020 closeout status (2026-09-17):** Implemented and regression/browser verified; owner authorized closeout. Scoped reconstruction backup `backup/gs-020-imaging-2026-09-17` at `fdd5bf7cd75d1c4b7926c06447d8ed2dd988ed3d` verified on GitHub; no merge/deployment or inferred hands-on acceptance. New control rooms and their operating/access dependencies are removed, with ordinary reachable doors and sequential shared technicians. Saved control rooms remain inert legacy space without automatic demolition/refunds. Details and compatibility evidence: [GS-020 handoff](../handoffs/GS-020_ULTRASOUND_FIRST_IMAGING.md). Original intake follows.

- **Owner wording:** "My rules about the imaging control room and imaging rooms and everything just really don't work out well for the player. I say that we just remove the imaging control room as part of the game (even though it is part of hospitals) then we just hire imaging techs who can walk between different rooms. Then every room just needs to be accessable by a door and we don't need like the weird rules about the imaging control room door"
- **Actual / intent:** The owner finds the current imaging-control-room arrangement and special door rules poor for the player and directs a replacement design: remove the imaging control room from gameplay; hire imaging techs who can walk between and serve different imaging rooms; require ordinary reachable door access for rooms instead of special control-room door relationships.
- **Status / impact:** Reported 2026-09-17. High-priority design simplification, superseding the owner's earlier imaging-control-room requirements. This is a firm design direction; implementation and current behavior have not been independently checked here.
- **Scope / unknowns:** Remove the control-room dependency rather than merely hiding its UI. Imaging rooms and imaging-tech staffing remain part of the game. Tech scheduling, concurrent service capacity, and treatment of existing saved control rooms need implementation scoping; no automatic demolition, save conversion, refund amount, or staffing ratio is specified by this note. Preserve the owner's current campaign.
- **Related:** GS-011-013 (ordinary door-placement usability), GS-011-015/016/017 (clinic income, in-house services, and upkeep), and current movement/seating renderer work. This is a game-design change, not a clinical or real-world facility standard.

### GS-011-029 — Agree on and centralize multistep question wait times

- **Owner wording:** "Currently questions have (current game time) as the wait for multi step questions. I need to make standardized times for all questions for before and after different things are established in the surgery center. Like how long an x ray should take before and after an x-ray room is made. This will basically be agreeing on a big table and implementing that into the game for the questions to pull from."
- **Actual / expected:** The owner describes the current waits using "(current game time)"; the exact displayed text and underlying timing behavior have not been inspected. They want all applicable question waits to resolve from one agreed reference table, with standardized durations for before and after relevant facility capabilities are established. X-ray before/after an X-ray room is the explicit example.
- **Status / unknowns:** Reported 2026-09-17; high-priority gameplay timing requirement. No durations, complete service list, time units, or capability conditions have been approved. The table must be agreed with the owner before implementation. These are game-balance durations, not asserted real-world clinical turnaround times.
- **Scope / dependencies:** Inventory applicable multistep actions in a separately scoped task, then propose table rows identifying action/service, facility condition, duration, and game-time unit. Define whether equipment/staffing/function upgrades affect capability and how already-pending waits behave. Preserve existing saves and frozen encounter history; do not silently restart waits or reinterpret answers.
- **Related:** GS-011-016/028 (in-house imaging/services), GS-011-026 (procedure-room question eligibility), GS-011-030 (functional upgrades). Timing changes must respect the separate procedure-room gate; do not create a pre-room procedure option merely to fill a timing-table cell.

### GS-011-030 — Keep upgraded room appearance stable except for the founder's office

- **Owner wording:** "I think that since designing rooms is becoming so laborious, upgrading rooms in general shouldn't change the appearance of the room but just the function of the room. The only room that I think should change with upgrades is the founders office so I will need to put extra work into designing that room."
- **Expected / intent:** Upgrades improve room function while retaining the same room appearance. The founder's office is the sole requested exception and should have upgrade-dependent visual changes, with additional design work planned for that room.
- **Status / unknowns:** Reported 2026-09-17; firm design direction, not a reported rendering defect. Functional benefits, office upgrade tiers, and their appearances have not been specified or implemented here.
- **Impact / dependencies:** Reduce the art/design workload for ordinary upgrades. Coordinate with existing room and character-art work; preserve each ordinary room's appearance/layout across upgrades, and scope the founder's office designs separately. Related to GS-011-010/011 (base furniture design) and GS-011-029 (capability-dependent timing); this does not cancel those base-design requests.

### GS-011-031 — Reach a later-game loop with more automation and income

- **GS-021 closeout status (2026-09-17):** Approved current-level automation/income slice complete. Future capability handlers exist; complete Level 3–5 progression and owner observation of the later-game loop remain separate. Verified domain/player/clinical/balance suites and isolated browser scenarios; completion authorization is not a claim of separately reported hands-on playtesting. [GS-021 handoff](../handoffs/GS-021_CLINIC_INCOME.md). This supersedes the historical intake status below.

- **Owner wording:** "I need to get to the point where the player can automate stuff more and make money. I think part of the reason I'm not there yet Is that I'm really just playing through level 1 over and over so I can understand why I'm not quite seeing the automated money situation yet"
- **Expected / context:** The owner wants progression toward more automation and income, and recognizes that repeatedly playing level 1 may explain why they have not seen that payoff. This is a product goal and a playtest-coverage limitation, not evidence that later-level automation is missing or broken.
- **Status / unknowns:** Reported 2026-09-17; high-priority progression/economy goal. Desired automated activities, unlock points, income targets, and observed later-level behavior remain unspecified. Do not infer a request to automate answering clinical questions.
- **Dependencies:** In a separately scoped review, assess existing later-level automation and earnings, define the intended player experience, then identify actual gaps. Coordinate with GS-011-014–017, GS-011-022, GS-011-027/028, and GS-011-029/030. Preserve the current playthrough; do not advance/reset it or create a duplicate implementation effort just to inspect this goal.

### GS-011-032 — Secretary refills the water cooler automatically between patients

- **GS-023 implementation (2026-09-18):** Extended existing refill/return logic: empty-only refill begins at the next idle gap, without the old60-minute delay. Approaching/waiting/returning patients prevent or interrupt refill before water credit, including same-tick admission; retry after the gap returns. Full, missing or inaccessible cooler cannot credit refill. Reserved work and one-owner protection remain. Domain and isolated refill-to100%-then-desk browser checks passed; owner playtest pending. [GS-023 handoff](../handoffs/GS-023_TUTORIAL_DAILY_ROUTINES.md). Supersedes historical intake status below.

- **Owner wording:** "I do want the secretary to start refilling the water cooler on their own when their isn't a patient there and then they return to their desk."
- **Expected / intent:** When the cooler needs refilling and no patient is at the front desk requiring the secretary, the secretary initiates the refill without a player command, then returns to their desk. "There" is interpreted in this desk-work context; the owner has not required the entire clinic to be empty.
- **Status / impact:** Reported 2026-09-17; medium-priority staff automation requirement. This is a requested behavior, not evidence that an existing implementation is absent or broken; no independent gameplay/code check here.
- **Unknowns / dependencies:** Refill trigger/threshold, what happens if a patient arrives during the refill, and handling of an inaccessible cooler remain to be scoped. Starting a refill must respect patients already awaiting front-desk service. Preserve normal staff movement and desk availability.
- **Related:** GS-011-031 (concrete automation goal), GS-011-021 (water-cooler tutorial), and GS-011-022 (front-desk roles before/after secretary hire). This is distinct from founder click-to-refill and return behavior.

### GS-011-033 — Level-1 patient frequency starts high and then slows

- **Owner wording:** "I feel like the frequency of patients is very high at the beginning of level 1 and then slows down"
- **Actual / evidence:** The owner perceives a high patient frequency at the beginning of level 1 followed by a slowdown. Exact arrival counts, game-time intervals, slowdown onset, queue state, and campaign conditions are unknown. This pattern has not been independently reproduced here.
- **Intent / impact:** Review the pacing across level 1; workload and income may feel uneven. The owner has not yet specified a target rate, requested a constant rate, or said whether the initial rush, later slowdown, or both should change.
- **Status / related evidence:** Medium-priority pacing observation, separate from GS-011-009's reported day-six shortage. GS-017's existing controlled supply diagnosis and finite eligible-content finding remain recorded under GS-011-009; they do not establish the cause of this newly reported pacing pattern. Coordinate with that work and GS-011-031's automation/income goals rather than duplicating the investigation.
- **Most useful clarification:** About when during level 1 does the slowdown become noticeable? Do not disturb the live campaign to obtain measurements.

### GS-011-034 — Make ultrasound the required level-1 imaging room

- **GS-020 closeout status (2026-09-17):** Implemented and regression/browser verified; owner authorized closeout. Scoped reconstruction backup `backup/gs-020-imaging-2026-09-17` at `fdd5bf7cd75d1c4b7926c06447d8ed2dd988ed3d` verified on GitHub; no merge/deployment or inferred hands-on acceptance. Ultrasound replaces X-ray in the Level1 objective; X-ray becomes optional at Level2. Existing clinical orders, timing/rewards, unlocked levels and saved rooms are preserved. GS-011-029 timing redesign remains excluded. Details: [GS-020 handoff](../handoffs/GS-020_ULTRASOUND_FIRST_IMAGING.md). Original intake follows.

- **Owner wording:** "I think I need to make the room required in level 1 an ultrasound room, not an x-ray room. We use ultrasound much more than x-ray in surgery so it will be utilized more sooner than an x-ray room"
- **Expected / intent:** Replace the level-1 X-ray-room requirement with an ultrasound-room requirement. The owner's rationale is that ultrasound is more useful for the intended early surgical cases, making the investment useful sooner. This records their design rationale rather than independently verifying a general clinical-use claim.
- **Status / impact:** Reported 2026-09-17; high-priority progression design change. The existing requirement, applicable objectives, and implementation have not been inspected here.
- **Scope / unknowns:** Scope this to which imaging room is required in level 1. X-ray's optional/later availability, costs, staffing, and exact progression conditions remain to be defined. Do not infer removal of X-ray from the game, a change to the examination-room requirement, or automatic replacement/demolition of a player's existing room.
- **Dependencies:** Coordinate GS-011-028's imaging-control-room removal and shared techs, GS-011-029's timing table, and GS-011-015/016's progression/in-house revenue. Align early question/service availability with actual ultrasound capability while preserving clinical meaning and frozen encounter history. Check GS-011-018's all-wrong tutorial completion requirement wherever this change touches its path or costs.

### GS-011-035 — Scheduled imaging-only visitors provide non-question income

- **GS-021 closeout status (2026-09-17):** Completed scheduled service-only visitors with actual travel, shared resources, work, receipts and departure, without learning questions or XP. Verified domain/player/clinical/balance suites and isolated browser scenarios; completion authorization is not a claim of separately reported hands-on playtesting. [GS-021 handoff](../handoffs/GS-021_CLINIC_INCOME.md). This supersedes the historical intake status below.

- **Owner wording:** "Maybe once you build imaging rooms, then people from outside can just come in for an ultrasound or an XR or something that is scheduled. This can make money for the player without resulting in patients with questions/concepts being tested"
- **Intent:** Once the relevant imaging rooms are built, outside visitors could attend scheduled ultrasound, X-ray, or other eligible imaging appointments and generate revenue. These visits would not present clinical questions or test concepts; they provide a service-only income stream alongside educational patient encounters.
- **Status / impact:** Reported 2026-09-17 as a tentative proposal ("Maybe"), not an accepted final mechanic or observed bug. Could support the owner's automation/income goal without relying on the available teaching-question pool. No independent implementation check here.
- **Unknowns / dependencies:** Appointment generation, modality eligibility, staffing/equipment requirements, room capacity, visitor routing, scheduling interface, prices, expenses, and any non-question rewards need scoping. Do not invent rates, payments, XP, or a scheduling UI. Coordinate GS-011-015/016/031 (economy/automation), GS-011-028 (mobile imaging techs), GS-011-029 (timing), and GS-011-034/GS-020 (ultrasound-first progression). Preserve their separately recorded status.

### GS-011-036 — Show a small green earned-money popup over the character

- **GS-021 closeout status (2026-09-17):** Completed small character-head earnings popups from new receipts, including actual NP and retail shoppers, with expiry and no reload replay. Verified domain/player/clinical/balance suites and isolated browser scenarios; completion authorization is not a claim of separately reported hands-on playtesting. [GS-021 handoff](../handoffs/GS-021_CLINIC_INCOME.md). This supersedes the historical intake status below.

- **Owner wording:** "When someone gets something done in the surgery center that generates money, they should have a small green +$240 or whatever the amount is, pop up over their head." Also: "Any character gets a coffee from the coffee kiosk and a +$5 over the character's head."
- **Intent:** When a character's service or purchase generates money for the player, show a small, transient green `+$<amount>` popup above that character. Use the actual amount earned for that transaction. This applies across revenue-generating services and purchases, including any character buying coffee, rather than only educational patients or a specific character type.
- **Status / unknowns:** Reported 2026-09-17; medium-priority visual feedback requirement, not implemented or inspected here. The $240, blood-draw $20, and coffee $5 examples illustrate the intended behavior; exact economy values, display duration, animation, and handling simultaneous earnings remain to be scoped.
- **Dependencies:** Tie the display to actual credited revenue once per transaction; reopening a chart or rerendering must not grant money or replay an old earning. Coordinate GS-011-016/027/035/037 and existing character rendering. Keep the feedback small and readable in light of GS-011-006's notification overload concern.

### GS-011-037 — Broaden non-question visits to labs and low-rate retail/service walk-ins

- **GS-021 closeout status (2026-09-17):** Completed collection visits and low-rate retail visitors, plus purchases by existing employees, eligible waiting patients and companions. Approved 32-entry catalog includes gated future outlets; no cafeteria. Verified domain/player/clinical/balance suites and isolated browser scenarios; completion authorization is not a claim of separately reported hands-on playtesting. [GS-021 handoff](../handoffs/GS-021_CLINIC_INCOME.md). This supersedes the historical intake status below.

- **Owner wording:** "So like a random person comes in to get their blood drawn, the player doesn't get a question or anything, but they get a +$20 over the characters head." And: "People can come in off the street to visit the gift shop or the coffee kiosk or other things at a low rate and +$ pops up over their head"
- **Intent:** Allow outside visitors to receive services such as blood draws without clinical questions or concept testing, earning money for the player. Also allow a low rate of people entering from the street for the gift shop, coffee kiosk, or other eligible services; their purchases earn money and show the GS-011-036 popup above the visitor. Ordinary revenue-generating coffee purchases by any character also receive that feedback.
- **Status / unknowns:** Reported 2026-09-17; high-priority economy/visitor direction. No numeric arrival rate, complete service list, staffing/equipment prerequisites, capacity rules, retail prices, or lab payment has been chosen. The owner explicitly specifies a low rate for retail/other street visits; the exact lab-visit cadence remains unspecified.
- **Related / boundaries:** Extends GS-011-035's service-only income idea beyond scheduled imaging while retaining the distinction between scheduled appointments and walk-in retail visits. Coordinate GS-011-015/016/031 (income/automation), GS-011-029 (service timing), and GS-011-033 (patient pacing). Keep these visitors distinct from teaching encounters; do not consume concepts or fabricate learning reviews. New visitor traffic must be scoped alongside room, staff, and routing capacity.

## Proposed follow-up tasks

Proposals only: none dispatched or implemented. The owner will tell GS Manager when this feedback is ready for task selection. Listed in the same provisional order as the observations.

1. **GS-011-009: Diagnose and restore sustainable patient availability.** Bound work to the day-6 availability path and its content/admission/progression conditions. Acceptance: an isolated representative campaign retains eligible patients to see beyond the reported point, with the reason for any intentional pause visible to the player; distinguish exhaustion of eligible content from arrival, pending, or gating behavior. Dependencies: capture baseline state without touching the owner's campaign; coordinate with the owner's concept-expansion work but do not duplicate it.
2. **GS-011-012: Make trash locations reachable or prevent inaccessible placement.** Bound work to the reported trash placement and movement/accessibility path. Acceptance: trash at identified locations can be reached and cleared, or cannot be placed at inaccessible locations, in an isolated layout; the change does not create unreachable destinations. Dependencies: obtain an affected layout/reproduction context; coordinate with GS-012 movement review because this may be a pathing dependency, while retaining a separate trash-coverage check.
3. **GS-011-014**, **GS-011-015**, **GS-011-016**, and **GS-011-017: Rebalance expansion economy.** Bound work to rewards for correct complex questions, level-2 revenue sources, in-house lab/imaging revenue when required capacity exists, and room upkeep. Acceptance: the scoped economy explicitly addresses all four owner requirements; eligible in-house service use earns revenue only when its required room/equipment is available; existing saves and progression remain valid; the owner reviews the resulting pace. Dependencies: measure representative baseline income and expenses, choose targets during bounded task scoping, and preserve clinical complexity separately from acuity and facility progression. No numerical targets are approved by this log.
4. **GS-011-001: Correct the fresh-campaign examination-room starting state.** Bound the investigation to campaign creation/onboarding and examination-room construction. Acceptance: a genuinely new campaign starts without this room; normal player construction adds it; existing campaigns retain their built rooms and progress. Validate in an isolated campaign/test context. Dependency: confirm the actual fresh-campaign path; coordinate with GS-001/GS-002 if save restoration or migration is implicated. Do not take over general persistence work.
5. **GS-011-006: Substantially reduce the Alerts & Events notification load.** Bound work to notification volume and delivery cadence. Acceptance: a representative isolated play sequence produces substantially fewer visible notifications than its measured baseline; spacing permits comfortable reading; essential action-required information remains discoverable; the owner confirms that the resulting pace is manageable. Dependencies: inspect current alert categories and cadence, establish a baseline without touching the live campaign, and choose concrete tuning targets during task scoping. Preserve ordinary game progression; no overall simulation-speed change is requested.
6. **GS-011-002: Identify and eliminate the reported old-art flash.** First capture the affected visual region and triggering sequence, then scope the responsible renderer/transition. Acceptance: the identified sequence consistently displays current intended art without a visible older-art frame, and affected transitions remain visually stable. Dependencies: reproduction context is still missing; coordinate file ownership with existing graphics work and GS-010 character integration. Do not assume the remedy is deleting old assets or broadly replacing art.
7. **GS-011-005: Identify and correct the employee appearance defect.** First establish which employees and visible defects the owner means, then bound ownership to the implicated asset or renderer. Acceptance: affected employees display the intended appearance in the reported viewing/action context and the owner confirms the defect is gone. Dependencies: the owner reports character appearance/walk/path work already in progress; coordinate with GS-010 and GS-012 before implementation. Do not assume a specific fix is complete or create competing character work.
8. **GS-011-010** and **GS-011-011: Correct facility furniture scale and chair orientation.** Bound work to the reported furniture and chair presentation. Acceptance: identified furniture renders at the approved visual scale, affected chairs face their intended direction, and representative rooms retain usable placements. Dependencies: identify affected assets/rooms and coordinate with current facility-art ownership; no universal scale or direction is defined yet.
9. **GS-011-013: Improve legal door-position affordance.** Bound work to discovering and aligning valid door positions for adjacent rooms. Acceptance: a player can readily identify matching legal positions for representative adjacent rooms and place a door through the normal build interaction. Dependencies: inspect existing placement rules and capture representative difficult pairs; preserve valid current layouts.
10. **GS-011-008: Close wrong-answer chart with one action.** Bound work to the post-wrong-answer chart exit flow. Acceptance: the identified flow returns from the chart after one deliberate close action, without skipping required feedback or affecting correct-answer flow. Dependencies: identify the current two-click controls and coordinate with GS-011-003/GS-011-004 if they share chart components.
11. **GS-011-003: Separate multistep decision feedback and current findings.** Bound work to how the patient chart presents the completed decision and the next available update. Acceptance: each decision-result section contains that question's outcome/feedback; CURRENT UPDATE shows only newly available findings; those findings are not repeated in the prior result section; future findings are not exposed early; prior answer history and frozen encounters remain intact. Dependency: inspect a representative affected encounter and current chart data flow. Coordinate with GS-006 only if the clinical meaning or an exact approved concept/version must change.
12. **GS-011-004: Make the correct answer explicit in incorrect-answer explanations.** Bound work to post-submission answer feedback. Acceptance: after an incorrect choice, the explanation visibly names the correct answer using its text, remains accurate when options are randomized, and clearly distinguishes the correct answer from the player's selected answer; unanswered or future decisions are not revealed. Use the existing answer key and explanation rather than inventing clinical content. Dependencies: inspect the feedback data/rendering path and coordinate with GS-011-003 if they share components; any disputed key or changed clinical meaning stays with GS-006.
13. **GS-011-007: Review tTG-IgA plus total-IgA question against approved surgery-board scope.** Bound work to identifying the concept/version and reviewing its fit through GS-006. Acceptance: the item is either retained with documented approved scope rationale, revised through the clinical workflow, or removed/withheld from the applicable release; no conclusion follows from this playtest note alone. Dependencies: exact concept/version and clinical review evidence; no board-frequency or clinical-correctness assertion is authorized here.

14. **GS-011-018: Verify and guarantee an all-wrong tutorial completion path.** High-priority prerequisite for accepting tutorial/economy changes. In an isolated fresh campaign, choose an incorrect answer for every tutorial question, follow the ordinary required actions, and prove the tutorial reaches its normal completion state with sufficient money, experience, and any other required resources at each gate. Include required construction/purchases and costs incurred during the sequence; no developer grants, reset, manual intervention, or substitution of a correct answer. If blocked, scope a targeted reward/progression correction while retaining accurate wrong-answer feedback and learning records. Acceptance: the entire all-wrong path completes, plus representative mixed-answer and all-correct paths still work; existing saves remain intact. Dependencies: identify current tutorial boundaries, gates, and economy rules, and coordinate with their active owners and GS-011-014–017. Do not touch the owner's running game or save to validate this.
15. **GS-011-019**, **GS-011-020**, and **GS-011-021: Add tutorial guidance for management, trash, and water cooler.** Bound work to timely tutorial prompts and ordinary player actions. Acceptance: the tutorial clearly introduces each requested item before its use matters, allows progression without ambiguity, and retains the all-wrong completion path. Dependencies: choose trigger moments and exact copy; coordinate trash guidance with GS-011-012 without assuming its accessibility issue is resolved.
16. **GS-011-022** and **GS-011-023: Define and implement founder seating interactions.** Bound work to click-to-seat behavior for the front desk/chair and ordinary chairs, plus automatic front-desk return after player-assigned tasks before secretary hire. Acceptance: a desk or its chair sends the founder to sit at the desk while no secretary is hired; completing trash pickup, water refill, patient work, or another assigned task makes the founder walk back and sit without an extra player click; automatic return ends when a secretary is hired; unfinished work and newer commands take precedence; an eligible chair can seat the founder. Validate representative task completion and the secretary-hire boundary. Dependencies: scope occupancy, explicit seating elsewhere, interruption, and movement rules; coordinate with current movement/seating renderer ownership while preserving GS-013 character-surface work.
17. **GS-011-024: Establish the owner's flagged-question review reminder/workflow.** Acceptance: an owner-approved intermittent cadence and local flagged-question review/edit route are documented or scheduled. Dependencies: the owner's answer to the pending cadence question; no reminder is scheduled by this log.
18. **GS-011-025: Scope GLP-1 consult revenue.** Acceptance: the economy owner either accepts a value with its conditions or records a different value/deferral; the result does not change clinical content or claim support. Dependencies: balance review with GS-011-014–017; $50 is only a tentative suggestion.
19. **GS-011-026** and **GS-011-027: Review, gate, and monetize minor-procedure-room services.** First review applicable question/procedure actions and agree on a service table covering procedure identity, question/concept mapping, capability requirements, timing reference, and revenue. Explicitly include review of the owner's reported skin biopsy for SCC alongside the previously identified I&D/aspiration examples. Acceptance: the inventory accounts for all relevant current question actions, with exclusions or uncertain applicability documented; before a procedure room exists, questions whose correct answer requires a scoped eligible procedure do not appear; after it exists, each actual performance of an eligible procedure yields one payment, never extra payment from chart reopen/replay. Existing answered/frozen clinical history remains intact. Dependencies: clinical applicability review through GS-006 as needed, agreed procedure membership and payment values, shared timing work GS-011-029, and economy scope. Keep clinical appropriateness separate from facility availability; do not suppress questions merely mentioning a procedure or conflate diagnostic biopsy with subsequent treatment.

20. **GS-011-028: Replace imaging-control-room rules with mobile imaging-tech staffing and ordinary access.** Bound implementation to the imaging room catalog, service prerequisites, door/access rules, tech work routing, and affected player guidance. Acceptance: new play does not offer or require an imaging control room; imaging rooms can operate with their appropriate equipment and tech staffing through ordinary reachable doors; an imaging tech can travel between different imaging rooms to perform assigned work; no control-room-specific doorway or adjacency requirement remains in validation, service eligibility, or instructions. Validate a representative multi-room layout and preserve normal reachability checks. Dependencies: coordinate with current movement ownership and economy scope, define scheduling/capacity behavior, and choose a safe compatibility/migration policy for existing saved control rooms before changing saves. Existing campaigns must remain usable. This is a proposed separately scoped task; no live-game changes or dispatch from this feedback entry.

21. **GS-011-029: Agree on a shared service/action timing table, then integrate it.** First inventory applicable multistep waits and propose one reviewable table covering before/after relevant facility capabilities; all duration values and conditions remain proposals until owner agreement. Acceptance after that agreement: applicable questions use the shared table consistently, equivalent service/capability combinations resolve to the same approved duration, the approved pre/post X-ray-room example works, and pending encounters/saves retain defined compatible behavior. Dependencies: define game-time units, capability transitions, procedure eligibility, and affected upgrade behavior. No timing-table values are approved by this feedback entry.
22. **GS-011-030: Decouple ordinary room upgrades from visual redesign.** Acceptance: upgrades change defined functional benefits while ordinary room appearance/layout remains stable; only the founder's office has explicitly designed upgrade-dependent appearance changes. Dependencies: identify current upgrade effects and choose functional benefits; separately scope and review founder's-office upgrade designs. Preserve valid saved room states and coordinate active art ownership.
23. **GS-011-031: Review and scope the later-level automation/income loop.** Acceptance: document what is already available beyond level 1, identify where the player gains meaningful automation and revenue, and review that experience against owner goals before proposing any missing features. Dependencies: define the intended automated activities and progression milestone, coordinate existing economy/staffing tasks, and use isolated evidence or the owner's naturally progressed playthrough. Repeated level-1 play alone is not proof of a later-game defect.

24. **GS-011-032: Verify and complete autonomous secretary water refill and desk return.** Inspect the existing behavior first, then scope any gap. Acceptance: with a hired secretary, a cooler that needs refilling, and no front-desk patient needing service, the secretary automatically travels to refill the cooler and returns to the desk without player commands; pending front-desk work prevents initiating the chore; a full cooler does not cause repeat refill trips. Dependencies: define the refill trigger and patient-arrival-during-refill behavior, coordinate current staff scheduling/pathing ownership, and verify in an isolated scenario without touching the owner's campaign. Do not assume the feature must be implemented from scratch.

25. **GS-011-033: Assess early-versus-later level-1 patient pacing.** Bound review to comparable game-time windows at level-1 entry and later play, accounting for actual arrivals, waiting/pending patients, and eligible-content availability. Start from GS-017's existing diagnosis. Acceptance: establish whether the observed pattern is reproducible and explain its supported cause; agree on the intended pace with the owner before choosing tuning values. If changes are warranted, validate the agreed early/later behavior without overriding learning-review eligibility or introducing new clinical content. Dependencies: approximate slowdown context, current patient-flow ownership, and income/progression balance. Preserve the owner's campaign and existing GS-011-009 findings.

26. **GS-011-034: Replace the level-1 X-ray-room requirement with ultrasound.** Acceptance: level-1 objectives, build/unlock requirements, and player guidance consistently require ultrasound in place of X-ray; meeting the ultrasound-room requirement advances the intended objective without an additional X-ray requirement; appropriate early cases can use the new in-house capability under agreed staffing, timing, and revenue rules. Dependencies: inspect the current level-1 progression gates and early case/service coverage, preserve clinical appropriateness, coordinate GS-011-028/029 and economy work, and define compatibility for existing campaigns without removing built rooms or invalidating progress. Preserve the all-wrong tutorial path where affected. No implementation or live-save changes are authorized by this log update alone.

27. **GS-011-035: Scope scheduled imaging-only visits as a separate income stream.** First agree on the service-only visitor model and appointment/capacity rules with the owner. Acceptance if selected for implementation: eligible built imaging facilities can receive scheduled outside visitors for supported services; completing a service earns its agreed payment once; visits require no clinical question/answer and create no concept-test or learning-review record; ordinary educational encounters remain available. Dependencies: define staffing, equipment, timing, scheduling, room/tech sharing, and financial balance alongside current imaging/economy ownership. Validate both service-only and educational visits in an isolated campaign, preserving existing saves. No implementation or dispatch from this tentative feedback entry.

28. **GS-011-036: Display per-character earned-money feedback.** Acceptance: every supported revenue-generating service/purchase displays one small green `+$<actual credited amount>` popup over the recipient/customer character, including service-only visitors and coffee buyers; its amount matches the ledger and it creates no extra payment. Define transient display behavior and validate concurrent events and save/load or chart reopen without replaying old income. Dependencies: authoritative revenue events, associated character identity/location, and current renderer ownership; amounts in this report are illustrative.
29. **GS-011-037: Add non-question lab visits and low-rate retail/service walk-ins.** First scope supported services, prerequisites, prices, traffic rates, and capacity. Acceptance: a supported blood-draw visitor completes their service and generates the agreed income without any question/concept test; low-rate outside visitors can use available gift-shop/coffee/other scoped services; paid transactions show GS-011-036 feedback; educational patients and their learning records remain unaffected. Dependencies: coordinate scheduled imaging GS-011-035, economy/timing work, front-desk and movement capacity, and existing patient-pacing work. No exact dollar value or numeric arrival rate is approved by this note.

## Ownership and boundaries

- GS-011 owns this log and feedback scoping. Code fixes require explicit bounded scope; do not silently implement reports.
- GS Manager coordinates separate implementation tasks; do not alter shared PM documents or send external messages from feedback intake.
- GS-006 retains clinical concept/version review and approval; clinical observations may be captured here.
- GS-010 retains patient/employee character creation.
- GS-012 retains movement review and selected improvements. GS-011-012 may feed that task, but no coverage or ownership transfer is assumed.
- Existing shared worktree changes are unrelated to log initialization and must be preserved.
- Keep this task open throughout the playthrough. An individual logged or resolved issue does not authorize push or archival. After the owner agrees the task is complete, follow the standing scoped documentation audit/backup/remote-verification/archival instruction unless they request it remain open.

## Intake record

- 2026-09-17: Added GS-011-036/037 for small green per-character earnings popups, non-question blood-draw visits, and low-rate outside retail/service visitors. Preserved the example amounts without treating them as finalized prices. Small direct log update, read back for verification; no worker, implementation, visitor generation, or gameplay/save changes.
- 2026-09-17: Added GS-011-035 for the tentative scheduled imaging-only visitor/revenue idea, explicitly separate from clinical question/concept testing. Small direct log update, read back for verification; no worker, implementation, appointments created, gameplay intervention, or save changes. Preserved externally recorded GS-020 progress.
- 2026-09-17: Added GS-011-034 for the owner's preferred level-1 ultrasound-room requirement replacing X-ray, with the early-usefulness rationale and related imaging/timing/economy dependencies. Small direct log update, read back for verification; no worker, clinical verification, code change, or gameplay/save intervention.
- 2026-09-17: Expanded GS-011-027 and its existing proposed task with a full minor-procedure-room service/revenue review and the owner's specific SCC skin-biopsy example. No duplicate observation ID created. Small direct log update, read back for verification; no worker, clinical-content review, catalog inventory, code change, or gameplay/save intervention performed.
- 2026-09-17: Added GS-011-033 for the owner's perceived early level-1 patient rush followed by a slowdown. Linked the existing GS-017/GS-011-009 evidence without treating it as a proven cause or assuming a target arrival rate. Small direct log update, read back for verification; no worker, code investigation, tuning, or gameplay/save changes.
- 2026-09-17: Added GS-011-032 for automatic secretary water refill between front-desk patients and return to the desk. Linked to automation, tutorial, and founder/secretary role requirements. Small direct log update, read back for verification; no worker, code investigation, implementation, or gameplay/save changes.
- 2026-09-17: Added GS-011-029–031 for an owner-agreed shared timing table, functional room upgrades with a founder's-office visual exception, and later-level automation/income goals. Preserved uncertainty about what repeated level-1 play reveals. Small direct log-only update, read back for verification; no worker, timing values, implementation, art changes, or gameplay intervention.
- 2026-09-17: Extended GS-011-022 with automatic walk-back and seating at the front desk after each completed player-assigned task, until secretary hire. Preserved the existing ID and manual seating requirement; no duplicate task created. Small direct log update, read back for verification; no worker, implementation, or gameplay/save changes.
- 2026-09-17: Added GS-011-028 as the owner's replacement imaging design: remove the control room, share mobile imaging techs across rooms, and use ordinary reachable door access. Small direct log update, read back for verification; no worker, code investigation, implementation, gameplay intervention, or save modification.
- 2026-09-17: Added GS-011-019 through GS-011-027 for tutorial guidance, founder seating, the owner's flagged-question review workflow, tentative GLP-1 consult revenue, and procedure-room eligibility/revenue requirements. Documentation-only update; no reminder scheduled, code investigation, gameplay intervention, task dispatch, implementation, or verification. Preserved existing externally recorded resolutions.
- 2026-09-17: Added GS-011-018 as the owner's explicit all-wrong tutorial completion requirement, including money, experience, required purchases, and other progression gates. Small direct documentation update; no worker, gameplay intervention, implementation, or all-wrong test. Preserved externally recorded resolutions and follow-ups in this shared log.

- 2026-09-10: Initialized the log after reading repository instructions and relevant project-board, current-handoff, and playtest-plan sections. No gameplay inspection or intervention. No observations independently reproduced. No follow-up tasks dispatched.
- 2026-09-10: Recorded the owner's first three observations as GS-011-001 through GS-011-003, with provisional priorities and proposed bounded follow-ups. This was a small direct documentation update; no worker, code investigation, gameplay intervention, or fix. All three observations remain owner-reported rather than independently reproduced or resolved.
- 2026-09-10: Added GS-011-004 for explicit correct-answer identification after an incorrect choice, linked to GS-011-003 while retaining a separate acceptance requirement. Small direct log update, read back for verification; no worker, code change, or gameplay intervention.
- 2026-09-10: Added GS-011-005 (employee appearance still wrong) and GS-011-006 (significantly reduce Alerts & Events notifications). Prioritized alert overload second and grouped visual reports without merging their unknown causes. Small direct log update, read back for verification; no worker, code investigation, gameplay intervention, task dispatch, or fix.
- 2026-09-11: Added GS-011-007 through GS-011-017 from the owner's current playthrough: one clinical scope concern, chart-exit friction, apparent patient shortage, furniture/chair presentation, inaccessible trash, door-placement usability, and four economy requests. Reordered provisional priorities with patient availability and inaccessible trash first, followed by the economy cluster. The owner reports concept expansion and character appearance/walk/path work already in progress; those reports are linked as boundaries only, with no assumed completion, task assignment, or independent reproduction. Documentation-only update; no gameplay intervention, investigation, task dispatch, or fix.
