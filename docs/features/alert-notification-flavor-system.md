# Alert, Notification, and Flavor-Text System

Status: Accepted design direction

Last updated: 2026-07-29

This document is the durable message and interaction bank. The Level 0-1
prototype implements only alerts backed by mechanics that currently exist.
Future-system messages remain inactive data until their corresponding gameplay
systems are built.

## Interface and priority contract

- A new arrival enters **Waiting** on the left with an exclamation badge.
- Returned results add an exclamation badge to that patient's chart in
  **Existing Patients**.
- Response-required alerts appear on the right. Selecting one opens its
  patient chart, result, room, employee, or task in the central workspace.
- Informational and flavor messages may enter a lower-right ticker and recent
  event log.
- A delay has a consequence only when the underlying gameplay rule defines
  that consequence.

Priorities:

1. **Critical:** immediate, persistent, unmistakable, and never obscured by
   humor.
2. **Action required:** persists until handled or no longer relevant.
3. **Informational:** brief, nonblocking, and retained in recent events.
4. **Flavor:** humor only; never interrupts play or creates a penalty.

Priority must never depend on color alone. Use a plain-language label plus
icons, borders, motion, or shape appropriate to the approved limited
pixel-art palette.
Useful content always appears plainly. Humor may accompany a noncritical alert
but never replaces a name, problem, timer, consequence, or action.

Suppress flavor while any critical alert is active. Consolidate escalation for
the same target rather than stacking duplicates, and avoid repeating the same
flavor line within a short period.

## Alert data contract

Each definition should eventually support:

- Stable alert ID
- Trigger
- Priority
- Useful title and body
- Optional flavor subtitle
- Relevant patient, room, employee, task, or system target
- Click action
- Escalation conditions
- Expiration or resolution condition
- Cooldown
- Eligible facility levels
- Ticker eligibility
- Whether it may appear while a critical alert is active

Store definitions as data rather than embedding prose throughout reducers and
components. Runtime instances record their stable definition ID, target,
trigger time, priority, and resolution state.

### Current Level 0-1 registry

`PROTOTYPE_ALERT_CONTENT` in
`packages/balance-config/src/prototype-alerts.ts` is the current Level 0-1
registry. It stores stable definition and text-variant IDs, selection weights,
context eligibility, cooldown/once metadata, placeholder fallbacks, optional
interaction routing, and attention-marker behavior.

The current display categories are:

- **Action required:** a player response is needed; this is the only category
  that receives an exclamation attention marker.
- **Guidance:** nonblocking advice tied to a real current mechanic.
- **Success:** immediate confirmation of a completed action or milestone.
- **Ambient flavor:** nonblocking humor selected only when its stated context
  exists.
- **Walkout review:** a cause-aware one- or two-star consequence after a
  patient leaves.

The two introductory encounters exclude ambient flavor. After the Alerts
tutorial, the first ambient line is scheduled 10-20 simulated minutes later.
Later ambient lines are scheduled 45-90 simulated minutes apart, with an
absolute minimum separation of 30 simulated minutes. Pausing play, entering
Build Mode, or leaving active play pauses this simulated-time schedule.
Selection uses persisted shuffle and recent-history state so save/reload does
not repeat or silently reroll recent lines.

## Functional patient and clinical messages

- New patient: `{{patient_name}} has checked in.`
- `{{patient_name}} has been waiting {{minutes}} minutes.`
- `{{patient_name}}'s satisfaction is beginning to decrease.`
- Prolonged wait: `{{patient_name}}'s satisfaction is falling more quickly.`
- `{{patient_name}} may leave soon.`
- `{{patient_name}} left without being seen.`
- New information is available for `{{patient_name}}`.
- Results ready: `{{result_name}}` for `{{patient_name}}`.
- Critical result for `{{patient_name}}`. Review now.
- A clinical decision is required for `{{patient_name}}`.
- `{{patient_name}}` is ready for treatment.
- `{{patient_name}}` is ready for disposition.
- A referral decision is required.
- This treatment requires `{{room_type}}`.
- This action requires `{{staff_role}}`.
- The required room is currently occupied.
- The required employee is currently unavailable.
- The encounter is complete and ready to close.
- Patient payment received: `${{amount}}`.
- Encounter closed: `{{xp}} XP` earned.
- Incorrect decision. Review the explanation before continuing.
- This concept has been scheduled for future review.

Critical clinical alerts remain direct. Do not joke about patient harm,
dangerous results, or deterioration.

## Functional facility and staffing messages

- Construction complete: `{{room_name}}`.
- Invalid placement: this room blocks an entrance or required path.
- Insufficient space for `{{room_name}}`.
- `{{room_name}}` requires `{{staff_role}}` before it can operate.
- `{{employee_name}}` has been hired.
- `{{employee_name}}` needs a work assignment.
- `{{employee_name}}` cannot reach the assigned room.
- The current arrival rate exceeds front-desk capacity.
- The waiting room is full.
- A staffing bottleneck is delaying care.
- `{{room_name}}` requires maintenance.
- `{{room_name}}` is temporarily unavailable.
- Repair complete: `{{room_name}}` is operational.
- No eligible room is available for the next patient.
- A required facility is missing.
- Upkeep charged: `${{amount}}`.
- Payroll charged: `${{amount}}`.

Maintenance, payroll, occupancy, and assignment alerts activate only after
their corresponding mechanics exist.

## Functional finance, progression, and inspection messages

- Low cash: less than the configured emergency-cash threshold remains
  (temporarily `$200` in the current Level 0-1 balance build).
- Emergency GLP-1 consultation is available.
- Emergency consultation unavailable for another `{{time_remaining}}`.
- Insufficient funds: `${{additional_amount}}` more is required.
- Today's clinic income: `${{income}}`.
- Today's clinic expenses: `${{expenses}}`.
- Objective complete: `{{objective}}`.
- One Level `{{level}}` requirement remains.
- All progression requirements are complete.
- Satisfaction must remain above 90% to advance.
- Satisfaction has fallen below the advancement requirement.
- Level `{{level}}` complete.
- New room unlocked: `{{room_name}}`.
- New employee unlocked: `{{staff_role}}`.
- Inspection begins in `{{time_remaining}}`.
- Inspection requirement missing: `{{requirement}}`.
- Inspection paused while required construction is underway.
- Construction complete. Inspection has resumed.
- Facility inspection passed.
- Facility inspection failed: `{{reason}}`.

Inspection messages remain inactive until the inspection system exists.

## Functional save and system messages

- Campaign saved.
- Save failed. Keep the game open and try again.
- Connection lost. Gameplay has been paused to protect progress.
- Connection restored.
- Game paused while the page was hidden.
- Resume when ready.
- New campaign created with fresh learning histories.
- Campaign restored from the most recent save.
- Campaign reset complete.
- Accelerated testing mode enabled.
- Normal game speed restored.

Connection and pause wording must match actual behavior.

## Patient-arrival and waiting-room flavor bank

- A patient has arrived with symptoms and expectations.
- The waiting room has acquired a patient.
- Good news: a patient found the clinic. They would now like care.
- The front desk has produced another chart.
- The clipboard hungers.
- A patient is early. This feels suspicious.
- A patient is late, but their symptoms arrived on time.
- The queue is now clinically significant.
- Your waiting room is beginning to develop a differential.
- The chairs are now practicing population medicine.
- The waiting-room clock has joined the care team.
- This patient has had enough time to develop a second chief complaint.
- The patient has now read the same poster three times.
- The magazine formulary has been exhausted.
- The patient is now Googling their symptoms. Act accordingly.
- A future online review is entering the preoperative phase.
- Leaving without being seen is no longer theoretical.
- The waiting room would like to remind you that time is a vital sign.
- The clinic is popular. Unfortunately, this has created a queue.
- Wait times are down. The magazines are disappointed.

## Result and chart flavor bank

- Radiology has spoken. Please correlate clinically.
- The lab has converted blood into decisions.
- The CBC has opinions.
- A result has returned from its spiritual journey through the EHR.
- The CT scanner generated 1,200 images and one sentence you need.
- Imaging found something. Whether it is helpful remains to be seen.
- A radiology report has arrived wearing its finest hedging language.
- Good news: the result is back. Different news: it requires action.
- The specimen was labeled correctly. A small victory.
- The chart would like a plan.
- Assessment complete. Management remains aspirational.
- The differential has been admired. Please choose something.
- The patient is ready for a disposition, and continue thinking is not one.
- The workup is complete. The answer remains stubbornly answer-shaped.
- A consult has been requested. Somewhere, a pager is vibrating.
- Referral placed. A future problem has been created responsibly.
- You successfully treated the patient instead of merely describing them.
- The chart is signed. Medico-legally, time may resume.
- A learning opportunity has been documented.
- The patient is safe. Your review interval is less impressed.

## Staff and administrative flavor bank

- The founder is covering the front desk again. Leadership.
- Your receptionist is doing the work of three people and judging you accordingly.
- A staff member is idle. Payroll is not.
- You hired a person. They now expect a place to work.
- The imaging technician cannot operate a room that exists only in your imagination.
- Staff morale has entered the differential.
- Your staff would like functioning equipment. Bold.
- Someone has asked when lunch is. There is no correct answer.
- The break room remains theoretical.
- The surgeon is currently available, which feels like a scheduling error.
- The nurse has identified a problem you were about to notice.
- The repair person has been summoned from wherever repair people wait.
- A meeting has been scheduled to discuss reducing meetings.
- Someone replied all. Morale has been affected.
- A new policy has been uploaded. It is 83 pages.
- An EHR alert has warned you about alert fatigue.
- An alert about alert fatigue has generated another alert.
- The phrase quick question has caused a 45-minute delay.
- The printer has sensed urgency and gone offline.
- The fax machine has completed another successful experiment in time travel.
- Central supply confirms the missing item is both in stock and unavailable.
- The coffee has achieved therapeutic levels.
- An administrator has asked whether throughput could simply be higher.
- Compliance training is complete. Compliance remains under observation.

## Construction and facility flavor bank

- Construction complete. The dust is now somebody else's problem.
- You built a room. Healthcare expands.
- This room contains four walls and a billing opportunity.
- The exam room is ready for awkward paper-gown conversations.
- The X-ray room is ready. Please add photons and staff.
- The imaging control room is operational. Buttons now have consequences.
- The minor-procedure room is open for business and consent forms.
- The bathroom is complete. Patient satisfaction has discovered plumbing.
- The waiting room now has more chairs than answers.
- A room is empty. Its upkeep is not.
- Something is beeping. It is now a facilities issue.
- The equipment has chosen an excellent time to stop working.
- The repair estimate has been generated with confidence.
- You cannot place a CT scanner in the bathroom. The game appreciates the ambition.
- That placement blocks a door. Even healthcare has fire codes.
- The room requires staff. Staffing remains tragically nonarchitectural.
- Your clinic has become a hallway with aspirations.
- The facility has reached maximum tasteful rectangle.
- The maintenance workshop is complete. The equipment looks nervous.
- Environmental services now has a closet. Cleanliness has acquired square footage.

## Financial flavor bank

- Cash is low. Your vision remains expensive.
- The clinic has entered the check every invoice twice phase.
- You cannot afford this. The purchase button remains optimistic.
- Payroll is due. Employees continue to favor money.
- Upkeep paid. The building has agreed to remain a building.
- A patient payment has arrived. Revenue cycle celebrates.
- Income increased. Please resist buying another hallway.
- The budget is stable, a temporary and suspicious condition.
- You are one broken X-ray tube away from a character-building experience.
- The facility is profitable. Administration has scheduled a meeting to discuss it.
- Your cash reserve has achieved the structural integrity of wet tissue paper.
- The balance sheet is asking for a consult.
- Patients are happy. Finance is investigating.
- Revenue is up. Clinical identity remains under review.

## XP, FSRS, and progression flavor bank

- XP gained. Expertise remains nonrefundable.
- You have leveled up. The patients did not become simpler.
- A new room is unlocked. Your floor plan has developed needs.
- Satisfaction is above 90%. Do not make sudden movements.
- All objectives are complete. The bureaucracy accepts your progress.
- One requirement remains. It knows what it did.
- The tutorial is over. Liability continues.
- Core mastery increased. Forgetting has been rescheduled.
- The scheduler has decided you should see this again. It is probably right.
- This concept is due. Your brain filed an appeal; denied.
- Review complete. The algorithm will be in touch.
- A new campaign begins. Learning history is blank and optimism is fully stocked.
- You remembered the answer. Neuroscience celebrates quietly.
- You forgot the answer. Neuroscience remains unsurprised.
- A difficult concept has returned for follow-up.
- Mastery achieved. Eternal retention remains outside the warranty.

## Inspection flavor bank

- An inspector is coming. Arrange the clinic into its least alarming configuration.
- Inspection begins tomorrow. Hide nothing; label everything.
- The clipboard approaches.
- The inspector has entered the building and immediately noticed the building.
- Your compliance is currently more of a mood than a state.
- A policy has been discovered where a policy should have been.
- The emergency exit remains refreshingly exit-shaped.
- All required rooms are present. Some are even functional.
- The facility passed inspection. The clipboard has been appeased.
- The facility failed inspection. The clipboard remembers.
- Construction has paused the inspection clock.
- You cannot postpone the final result by building forever.
- The inspection is complete. Everyone may begin breathing normally.

## Saving and testing flavor bank

- Campaign saved. Your questionable decisions are now durable.
- Game paused. The clinic has entered an unprecedented state of calm.
- Welcome back. The waiting room remembered you.
- Connection lost. The clinic is temporarily protected from management.
- Connection restored. Consequences have resumed.
- The charts have not forgiven your absence.
- Time acceleration enabled. Mistakes will now happen more efficiently.
- Developer balance mode enabled. Economic reality has been suspended.
- Reset complete. The patients have agreed to forget.
- Autosave complete. Accountability preserved.

## Future room-specific bank

Keep these inactive until the associated room exists:

- The coffee kiosk is operational. Productivity has been pharmacologically optimized.
- The vending machine has achieved passive income and active humming.
- The gift shop has converted anxiety into branded merchandise.
- The indoor garden has reduced stress and increased watering obligations.
- The staff gym is open. Attendance remains aspirational.
- The call room is available. Sleep not included.
- The surgeon's office is complete. Email has already found it.
- The executive office is furnished. Clinical throughput is unchanged.
- The radiology reading room now contains four desks and one atmosphere of corporate dread.
- The pharmacy has restocked automatically. Someone planned ahead.
- The laboratory is operational. Tiny tubes, large consequences.
- The endoscopy suite is ready. The scope has opinions.
- The MRI is operational. Ferromagnetism has been formally warned.
- The wound and ostomy clinic is open. Tape inventory is now a strategic asset.
- The children's waiting room is ready. The toys will never return to their original bins.

## GLP-1 emergency-clicker sarcasm

Retain these four lines exactly:

- Your commitment to comprehensive metabolic care has been noted.
- Another individualized 90-second consultation completed.
- Prior authorization remains someone elses problem.
- At this point, this is less of a safety net and more of a business model.

Additional lines eligible after the fifth manual consultation in one facility
day:

- This was supposed to be an emergency measure.
- One more visit and we have to call this a service line.
- The safety net has developed a revenue forecast.
- Another highly individualized visit has emerged from the same dropdown menu.
- Your surgical clinic has developed a suspiciously scalable side hustle.
- The patients goals were reviewed at remarkable speed.
- The intake form has completed most of the visit.
- The algorithm has recommended continued use of the algorithm.
- Continuity of care is limited. Continuity of revenue is excellent.
- A business-school case study is beginning to form.
- The cash balance has improved. The clinics identity is less certain.
- You are now one ring light away from vertical integration.
- The safety net now has a logo.
- At this rate, surgery will become the side business.
- The emergency button would like to discuss its promotion.
- Another cash-pay consultation has restored the clinics faith in liquidity.
- The telehealth suite reports record access and remarkably little hallway traffic.
- The founder has discovered recurring revenue.
- This is becoming less of a contingency plan and more of a lifestyle.
- Even the algorithm has standards.

At the maximum of five GLP-1 NPs:

- Five NPs is the maximum. Even the algorithm has standards.

Humor targets bureaucracy, incentives, equipment, administration, and the
player's management choices—not patients or serious clinical harm.

## Level 0-1 activation boundary

The current prototype may activate only:

- Patient arrival and Waiting badges
- Waiting/patience escalation already supported by the patience rules
- Result-ready and clinical-decision alerts
- Encounter completion, cash, XP, and FSRS scheduling information
- Room placement/connectivity and staff-hiring alerts
- Existing upkeep/payroll charges
- Low cash and the bounded emergency GLP-1 action if included
- Save, hidden-page pause, restart, and testing-mode notices
- Flavor categories whose underlying objects already exist

Maintenance, breakdowns, repair, inspection, connection recovery, future room
types, and automated Level 2 telehealth messages remain inactive.
