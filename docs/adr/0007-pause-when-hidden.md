# ADR 0007: Pause Facility Operations When Hidden

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

Facility operations run only while the game is open and unpaused, while FSRS
uses real-world time. Browsers may throttle, freeze, discard, or terminate
hidden pages, especially on phones. The project needs one predictable meaning
for switching tabs, minimizing a browser, locking a phone, changing mobile
applications, and sleeping a computer.

## Decision

- Treat the page as available for facility simulation only while its browser
  visibility state is visible and the player has not paused.
- Automatically pause facility operations when the page becomes hidden,
  including tab switches, browser minimization, phone locks, and mobile
  application switches.
- Do not automatically pause merely because the page loses keyboard focus while
  it remains visible.
- Do not simulate or catch up hidden elapsed facility time.
- Keep the facility paused when the page becomes visible again until the player
  explicitly selects Resume.
- Treat an unexpectedly large unobserved scheduling gap, including computer
  sleep, as paused time rather than facility progress.
- Preserve any unanswered clinical decision across the automatic pause.
- Continue the real-world FSRS clock while facility operations are paused.
- Capture current state and begin best-effort persistence when the page becomes
  hidden, but do not depend on a network request completing at that moment.
  Exact save and recovery behavior remains a separate decision.

ADR 0017 later assigns facility execution to the active browser. Its
fixed-step/event model remains subject to every hidden-page and unobserved-gap
rule above.

## Benefits

- Facility state cannot deteriorate while the player is unable to observe or
  respond.
- Desktop and phone behavior remain consistent despite browser lifecycle
  differences.
- The rule preserves the deliberate separation between facility time and
  real-world learning time.
- Balance does not need to account for unattended overnight facility operation.
- The behavior is visible, explainable, and testable.

## Risks and limitations

- Briefly switching tabs adds an explicit Resume action.
- Browser closure may occur before a cloud save finishes, requiring a separate
  local recovery and save-revision strategy.
- Facility time and learning time may diverge substantially.
- Visibility behavior must be tested across supported desktop and phone
  browsers.

## Alternatives considered

1. Calculate hidden elapsed time and simulate catch-up upon return.
2. Run facility operations continuously on a server.

## Cost and maintenance

This lifecycle rule has no direct recurring infrastructure cost. Maintenance is
low to moderate and includes cross-browser lifecycle, pause, resume, and
save-recovery testing.

## Cost of changing later

Expensive. A change would affect salaries, arrivals, queues, breakdowns,
satisfaction, clinical-decision behavior, timestamps, save recovery,
randomness, cross-device synchronization, tutorials, balance, and existing
player expectations.
