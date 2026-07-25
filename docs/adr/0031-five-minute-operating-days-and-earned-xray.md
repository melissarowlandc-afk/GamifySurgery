# ADR 0031: Five-Minute Operating Days and Earned On-Site X-ray

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: YELLOW game-design and pacing decision

## Context

The first playable prototype advanced too quickly to read charts, understand
alerts, and make construction decisions. Patients also arrived too frequently.
The X-ray room, imaging control room, and imaging technician need a clear
operational purpose rather than acting only as progression checkboxes.

## Decision

- One operating day covers 8 AM through 6 PM and takes approximately five
  minutes of real time while the facility is running.
- Prototype facility time advances in one-hour logical steps every 30 real
  seconds. The interface displays whole hours rather than minutes.
- At 6 PM, show a brief day-complete transition and continue at 8 AM on the
  next facility day. Do not require a separate Continue action.
- Target routine Level 1 intake at approximately one patient per real minute,
  subject to workload capacity, protected-arrival rules, pause state, and the
  availability of eligible content.
- Level 0 diagnostics use approved off-site routes.
- In Level 1, X-ray remains off-site until the campaign has a functioning
  X-ray room, imaging control room, and eligible imaging technician. Once all
  requirements are present and accessible, X-ray uses the faster on-site
  route and may improve operational satisfaction.
- Freeze the selected service route and due facility tick when the service is
  scheduled, consistent with ADR 0027.

Exact costs, route durations, satisfaction effects, and capacity values remain
centralized prototype balance settings.

## Consequences

- The player has time to read and observe the facility without constant
  arrivals.
- A full diagnostic wait can be expressed in understandable facility hours.
- Building and staffing imaging produces a visible speed and satisfaction
  benefit.
- Automated pacing tests must use a controllable clock so they do not require
  five real minutes per simulated day.

## Cost of changing later

Moderate. Values are configurable, but a different day rhythm would require
new balance testing, tutorial timing, alert pacing, result timing, animation
speed, and player-expectation work.
