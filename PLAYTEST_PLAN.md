# Playtest Plan

Status: MELISSA/HUSBAND LOCAL WALKTHROUGH IS THE CURRENT INTERNAL STEP. Outside
tester recruitment, deployment, new data collection, and research remain
unauthorized.

Last updated: 2026-07-24

## Purpose

The immediate walkthrough evaluates whether the local Level 0/1 candidate is
understandable and enjoyable enough to justify further content and cloud work.
It is product development, not human-subjects research.

## Current local walkthrough

Participants:

- Melissa, evaluating clinical intent, learning flow, gameplay, and balance
- Melissa's husband, primarily evaluating usability, clarity, and technical
  friction

Double-click `START_GAME.cmd`; it installs or refreshes dependencies, starts
the local game, and opens the browser. Use the in-game **Help** button for
beginner instructions. No account, invitation, or internet deployment is
needed. Campaigns remain only in that browser.

### Suggested sequence

1. Melissa starts a fresh campaign without developer explanation.
2. She completes both introductory patients, builds the examination room, and
   advances to Level 1.
3. She plays the routine Level 1 loop long enough to see patient waiting, an
   Active chart, one result delay, one expense interval, and at least one new
   arrival.
4. She places or attempts several Level 1 rooms and hires or attempts the
   available staff so dependency messages can be evaluated.
5. She reloads the page and confirms that the same campaign returns.
6. She creates another campaign and verifies that its facility and FSRS
   histories are fresh, then reopens the first campaign.
7. She repeats the most important interactions at a phone-width window.
8. Her husband attempts the opening and Level 0 flow with minimal coaching.

Use optional written notes or an owner-led conversation. Do not enter real
patient information or copy commercial question-bank material into feedback.
The prototype sends no gameplay telemetry.

## Questions for the walkthrough

### First minutes and comprehension

- Is it obvious which patient needs attention and why?
- Does the automatic first-run coach make the first chart unmistakable without
  getting in the way?
- Is the in-game Help guide sufficient without referring to project files?
- Can a new player distinguish Waiting, Active pending, Active
  action-required, summary available, and Resolved?
- Does the chart leave enough of the facility visible while answering?
- Is facility time continuing during a chart clear without creating reading
  pressure?
- Does correction-forward feedback teach the point without making an early
  mistake feel punitive?

### Pacing and management

- Are the first two patients paced too quickly, too slowly, or about right?
- Does earning and spending separate money from clinical XP clearly?
- Is the first examination-room price achievable without feeling automatic or
  grindy?
- Does the Level 0 progress display make every requirement understandable?
- At Level 1, are arrivals and waits frequent enough to create clinic pressure
  without producing an unmanageable chart pile?
- Are patience warnings fair and noticeable with sound off?
- Are outsourced waits meaningful without creating boring dead time?
- Do room and staff prerequisites teach a sensible build order?
- Are ongoing expenses noticeable and understandable?
- Can satisfaction recover and stay above the level requirement?

### Learning and campaigns

- Is the clinical-question frequency compatible with feeling like a management
  game rather than a question bank?
- Is the explanation concise enough to read during play?
- Does the FSRS card inspection make its state and due time understandable, and
  make clear that reviews belong only to the current campaign?
- Does creating a fresh campaign visibly start at zero reviews while preserving
  the older campaign?

### Desktop and phone

- Are ordinary text, buttons, tabs, and room-placement targets comfortable at
  both widths?
- Is any information hidden, clipped, or dependent on hover?
- Can the whole loop be used with sound off?
- On phone width, does the facility retain enough context when the chart is
  open?

### Fun and next investment

- Which moment is most satisfying?
- Which moment is confusing or boring?
- Does Level 1 create a reason to continue for another 10-20 minutes?
- Which single balance change and which single interface change would most
  improve the next walkthrough?

## What this walkthrough does not test

- Clinical accuracy or educational efficacy: fixture content is unapproved
- Email registration, password recovery, cloud save, or cross-device behavior
- Outside-user onboarding, monitoring, backup restoration, or deployment
- Long-term FSRS workload, mastery, or 21-day scheduling
- Comprehensive content variety
- Research outcomes or engagement metrics

## Later invited pilot

The eventual invited pilot remains a separate owner-gated stage for adult
surgery residents only. Final count, recruitment, duration, consent language,
and permitted data remain open. A three-to-four-week duration is a reasonable
planning estimate, not an authorization.

Before outside access:

- Melissa approves every included clinical item.
- Verified-email/password identity, password recovery, cloud save, conflict
  handling, and permission tests pass.
- Privacy, no-PHI, educational-use, retention, backup, recovery, and rollback
  procedures are reviewed.
- Desktop and phone smoke tests pass in the staged environment.
- The owner explicitly authorizes the selected testers and any feedback fields.

No automatic gameplay telemetry or detailed clinical-answer export is
authorized. If quantitative playtest metrics are later desired, the exact
fields, notice or consent, retention, security, and any institutional review
must be approved first.

## Stop conditions for any hosted pilot

Pause or end outside testing for:

- Materially incorrect clinical content
- Unauthorized data collection or exposure
- Account cross-access or save corruption
- Administrator-interface exposure
- A progression-blocking defect affecting multiple testers
- Inability to restore pilot data from backup
