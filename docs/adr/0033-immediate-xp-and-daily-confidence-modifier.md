# ADR 0033: Immediate XP and Daily Confidence Modifier

Status: Accepted

Date: 2026-07-26

Decision owner: Project owner

Severity: YELLOW game-design decision

## Context

The Level 0-1 walkthrough showed that a correct clinical decision needs an
immediate, legible educational reward, while directly ratcheting permanent
facility satisfaction after every answer makes that resource snowball.

## Decision

This ADR refines ADR 0025 without replacing its bounded patient-settlement
model:

- Each correct first scored decision immediately awards the configured
  Learning XP for its one primary concept.
- An incorrect first decision awards no Learning XP and never removes XP.
- Each encounter begins with patient confidence at 50. Correct and incorrect
  decisions change it by +10 and -10 respectively, clamped to 0-100.
- Each decision also changes a campaign-level same-day satisfaction modifier
  by +1 or -1, capped at +3/-3.
- Displayed and progression satisfaction use base facility satisfaction plus
  that modifier, clamped to 0-100.
- The modifier resets to zero at each continuous 8 AM facility-day rollover.
- Clinical decisions do not directly change base facility satisfaction.
- Cash remains a patient-level settlement after encounter completion; no cash
  is paid at the moment an answer is selected.
- Command idempotency prevents duplicate clicks or retries from duplicating XP,
  confidence, satisfaction modifiers, FSRS reviews, or settlement.

Exact XP, confidence, modifier, and settlement amounts remain centralized
prototype balance or domain values.

## Consequences

Correctness receives immediate feedback without permanently overwhelming the
facility-management satisfaction system. The encounter chart can show patient
confidence, while the HUD reports the temporary same-day modifier when active.
Published balance and save migrations must preserve reproducibility.

## Amendment relationship

ADR 0025 remains the historical source for bounded clinical consequences and
one normalized patient settlement. Where ADR 0025 describes XP as part of the
later patient settlement or a lasting answer-driven satisfaction change, this
ADR is the current rule.

## Current amendment

[ADR 0034](0034-july-27-clinical-encounter-amendments.md) changes decision XP
to ten for correct and two for incorrect answers.
[ADR 0035](0035-minute-simulation-and-patient-satisfaction.md) removes Patient
Confidence and the daily campaign modifier in favor of individual patient
satisfaction and a rolling completed-encounter clinic score.
