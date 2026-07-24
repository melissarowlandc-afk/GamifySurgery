# ADR 0026: Patient Chart Lifecycle

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: RED game-interaction decision

## Context

Clinical questions must coexist with a live management game. Automatically
opening every chart would repeatedly interrupt construction and staffing, while
an end-of-day question inbox would disconnect decisions from the fictional
patient's care.

The owner specified a chart workflow organized around Waiting, Active, and
Resolved lists, with results returning over facility time and a post-case
learning summary.

## Decision

Use this patient-chart lifecycle:

1. **Waiting:** A newly arrived patient's card/chart appears as a tab in the
   Waiting list. It does not forcibly open.
2. **Open chart:** Selecting the tab opens the chart panel while leaving the
   facility visible. Facility time continues unless the player manually pauses.
3. **Active - action required:** Opening a Waiting chart moves the patient
   logically to Active. While the panel is open, its tab need not also appear
   in the list. When the chart closes, the Active tab is visible; if a scored
   decision is ready and unanswered, it displays an exclamation point plus an
   accessible text label such as "Action required."
4. **Active - pending result:** After a submitted decision that requires a
   result or later step, the patient remains Active without the action-required
   exclamation point. The chart shows the pending status.
5. **Result ready:** When the next authored result or decision becomes
   available, the Active tab gains an exclamation point. Opening it resumes the
   same frozen encounter at the correct node.
6. **Final answer and learning summary:** After all required authored nodes are
   complete and the encounter is terminal, the chart becomes eligible to flip
   or toggle to its required, read-only diagnosis-and-management learning
   summary. Choosing to view it is optional.
7. **Resolved:** Closing the chart after final completion files it in the
   Resolved folder.

Closing a chart never hides an unanswered ready question: it returns to Active
with the exclamation point. A one-question encounter proceeds directly from its
final required node to the learning-summary state.

Resolved charts remain reopenable in read-only form. The player may view the
patient timeline, submitted answers, explanations, diagnosis, management
summary, and sources later, but cannot resubmit answers or create another FSRS
review. Viewing or flipping the summary is optional and unscored.

Care-completion revenue, XP, and patient-level consequences settle exactly once
when the authored encounter becomes terminal. They do not wait for the player
to choose to view the summary or close the chart.

The diagnosis-and-management summary must be an exact clinically approved,
published revision, or be rendered solely from exact approved published
revisions. Draft Clinical Topic notes must never appear through this view. The
runtime freezes the rendered summary so a later publication, adoption,
correction, or withdrawal cannot silently rewrite the resolved encounter.
When ADR 0016 requires a correction or withdrawal notice, the read-only chart
shows that notice alongside the preserved historical material.

The visual "flip" may use an accessible tab or toggle rather than relying on an
animation. Desktop keeps the facility visible beside the chart. Phone layouts
retain facility context through an appropriately sized visible area or compact
facility status rather than removing access to the management state.

## Persisted state

The operational encounter state distinguishes at minimum:

- `waiting_unopened`
- `active_action_required`
- `active_pending_result`
- `resolved_summary_available`
- `resolved`

The derived display mapping is:

- `waiting_unopened` appears in Waiting.
- `active_action_required` appears in Active with `!` and "Action required."
- `active_pending_result` appears in Active with its pending status and no `!`.
- `resolved_summary_available` appears in Active as "Complete - summary
  available" with no `!`.
- `resolved` appears in Resolved.

The state also preserves the current authored node, pending-result gate and
zero or more scheduled result events when applicable, whether feedback is
being withheld to protect a later answer, terminal resolution reason, and the
exact frozen clinical instance. Each scheduled event has a stable operation ID,
originating encounter and node, due facility-time tick, delivery state and
time, and an expected-state guard. An authored result gate defines which
events must arrive before the next decision becomes ready.

Folder membership and the exclamation point are derived from the lifecycle
state rather than stored as separate flags that could disagree. Delivering a
result and advancing the encounter commit atomically and idempotently.
Encounter settlement has its own unique settlement key; review creation
remains uniquely keyed to the scored-decision instance.

The currently open chart is presentation state, separate from the patient's
workflow state. A saved open chart should restore after refresh when safe; at
minimum, refresh must return it to the correct Active or summary state without
losing work or producing duplicate results, rewards, or reviews.

## Consequences

- The player controls when to open charts without losing required clinical
  work.
- Multi-step cases can unfold alongside construction, queues, and staffing.
- The exclamation point has one stable meaning: player action is ready.
- Resolved cases become a useful study reference without producing false recall
  evidence.
- Result timing, active-patient capacity, waiting consequences, and resolved
  chart retention require separate balance or game-design rules.

## Cost of changing later

Moderate to expensive. This lifecycle affects navigation, notifications,
patient queues, simulation events, save state, frozen encounter restoration,
phone layouts, tutorial behavior, accessibility, and end-to-end tests.
