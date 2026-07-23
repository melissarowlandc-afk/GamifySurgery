# ADR 0017: Browser-Authoritative Facility Simulation

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

The facility must continue operating while the visible game is open and
unpaused, including while the player reads a clinical decision. Its outcomes
must be reproducible for tests and saved campaigns, but the initial pilot does
not need competitive anti-cheat protection or a server process continuously
running every facility.

Browsers render at inconsistent frame rates and may briefly stall, throttle, or
sleep. Animation timing therefore cannot determine salaries, queues, arrivals,
construction, satisfaction, breakdowns, or other game truth.

## Decision

- The active, visible, unpaused browser holding the campaign writer lease
  computes facility progress.
- A renderer-independent pure TypeScript state machine owns facility state and
  rules. React and Phaser may display and request changes but do not determine
  simulation outcomes.
- The simulation advances through fixed logical steps and explicitly scheduled
  events, never through animation frames.
- Facility time and foundational quantities use deterministic integer or
  explicitly fixed-precision representations rather than accumulating
  frame-dependent floating-point error.
- Rendering may interpolate visually between logical states, but interpolation
  cannot alter game truth.
- Probabilities are evaluated only for a documented eligible task, entity, or
  unit of facility time and never once per rendered frame.
- A clinical decision does not pause facility operations unless the player
  selects Pause or the accepted lifecycle rule in ADR 0007 pauses the page.
- Hidden time and unexpectedly large unobserved gaps are not simulated or
  caught up. Exact fixed-step size, visible speed choices, and bounded
  visible-stall handling remain versioned balance and implementation decisions.
- The cloud stores the latest accepted save for cross-device synchronization.
  It validates authentication, ownership, writer lease, expected revision,
  idempotency, version pins, payload shape, trusted timestamps, immutable
  evidence, and basic invariants, but it does not continuously execute the
  facility or replay every ordinary game command during the pilot.
- The shared simulation boundary must remain portable so a future approved
  server-authoritative mode can reuse its rules rather than rewriting them
  inside the renderer.

“Cloud state is authoritative” in ADR 0011 means that the latest
server-accepted revision is the source for synchronization and recovery. It
does not mean that the server independently computes every facility transition.

## Integrity boundary

A determined player who controls their browser can potentially alter their own
facility state before submitting a save. This is accepted for the private,
single-player, nonresearch, noncompetitive pilot.

This model must be reopened as a new RED decision before using facility results
for leaderboards, prizes, competitive comparison, assessment, credentialing,
research-quality outcome measurement, or another purpose that depends on
tamper-resistant gameplay.

Authentication, authorization, administrator actions, published releases,
clinical withdrawals, immutable scored-review evidence, and cross-account data
isolation remain server-enforced. Browser authority is not permission to trust
the browser with secrets or protected administrative actions.

## Benefits

- Facility play remains responsive without a network request for every step.
- The pilot avoids the cost and complexity of a continuously running simulation
  service.
- The same deterministic rules can drive the game, automated tests, balance
  simulations, and save validation.
- Frame rate, animation speed, and device performance do not change economic or
  operational truth.
- The accepted hidden-page and one-active-writer rules fit cleanly.

## Risks and limitations

- The pilot cannot claim strong anti-cheat integrity for facility outcomes.
- Long visible browser stalls require carefully bounded handling so a slow
  device cannot create a large catch-up burst.
- Determinism requires pinned rule, balance, save-schema, and random-generator
  versions plus cross-browser fixtures.
- Server validation can reject impossible shapes and stale writes but cannot
  prove that every submitted ordinary facility action occurred through the
  intended interface.
- A later competitive or research-grade use may require server execution or a
  trusted command-validation architecture.

## Alternatives considered

1. Run every facility continuously and authoritatively on the server.
2. Send every player command to the server and have the server reproduce and
   validate each resulting facility transition.

Both alternatives provide stronger tamper resistance but add latency,
infrastructure, synchronization complexity, operational cost, and substantially
more pilot implementation work.

## Cost and maintenance

There is no separate simulation-server cost during the pilot. Development
burden is moderate: deterministic state transitions, fixed-step and scheduled
event handling, version pins, save invariants, headless tests, stall handling,
and cross-browser fixtures all require maintenance.

## Cost of changing later

Expensive. Moving authority to the server would change the runtime protocol,
hosting, command model, save validation, latency handling, recovery,
observability, testing, and potentially every existing campaign. The pure
TypeScript boundary reduces the rules rewrite, but it does not remove the
backend and migration work.
