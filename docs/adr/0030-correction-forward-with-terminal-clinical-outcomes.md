# ADR 0030: Correction-Forward Cases with Terminal Clinical Outcomes

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: RED clinical-content and game-design decision

## Context

An incorrect answer must teach the learner without deleting later questions or
requiring a large tree of alternate clinical paths. The owner also wants a wrong
answer to the final scored question to be able to produce an appropriate minor
or major fictional patient outcome before the encounter closes.

This must preserve one primary FSRS concept per scored decision, immutable
clinical publication, reproducible frozen encounters, bounded management
consequences, and clinical review by Melissa.

## Decision

Use correction-forward continuation with an optional authored terminal outcome:

1. The first submitted answer remains final for scoring. An incorrect answer
   maps to Again, creates exactly one Review Record for its primary concept,
   earns no correctness XP or bonus, and never removes previously earned XP.
2. After an incorrect nonfinal scored node, the case continues from the
   clinically correct state. Correction appears promptly or is deferred only
   when necessary to avoid revealing a later scored answer. The wrong choice
   cannot remove, change, or cue a later question.
3. When the incorrect answer is to the instantiated case's final scored node,
   approved content may show one plausible fictional terminal clinical outcome
   before the corrective explanation, Patient Learning Summary, and chart
   closure.
4. A terminal outcome is a short teaching vignette, not another scored node,
   an extended wrong-care branch, or runtime AI generation. It creates no
   additional FSRS update, mastery evidence, concept exposure, clinical XP, or
   answer opportunity.
5. The outcome maps to the exact incorrect Answer Choice and compatible Patient
   Presentation Variant or finite Clinical Instantiation Profile. Its authored
   clinical severity is `minor` or `major`; a major outcome may include a
   serious complication or death when clinically justified.
6. Every compatible wrong-final-choice tuple has an explicit reviewed
   disposition: one approved Terminal Clinical Outcome Revision or
   `no_terminal_outcome`. Harm is never invented merely to punish the player.
7. Text must distinguish a plausible consequence in this fictional case from
   an outcome that always follows the choice. The outcome revision records its
   causal framing, clinical rationale, claim-linked sources, clinical approval,
   compatible slots, and immutable revision history.
8. The exact outcome mapping, revision, rendered text and slot values, severity,
   causal framing, and citations are frozen in the Runtime Encounter Instance.
   Refresh, clinical-release adoption, and Resolved-chart reopening reproduce
   the same outcome.
9. The terminal chart automatically presents the outcome with corrective
   teaching and requires one acknowledgment before it can be filed. This
   acknowledgment is operational presentation state, not learning evidence.
   The correct explanation and approved diagnosis-and-management summary remain
   available even after a major outcome. Previously deferred feedback is
   released safely at terminal completion.

For the initial pilot, terminal outcome selection is deterministic: at most one
approved outcome exists for a compatible wrong-choice tuple. Weighted or
probabilistic terminal harm is excluded.

## Clinical severity versus management effect

Clinical or narrative severity is authored content. It does not itself set the
money or satisfaction amount. Operational effects continue to use ADR 0025's
small, normalized, patient-level capped consequences.

Even a major terminal clinical outcome cannot cause:

- Unrecoverable campaign loss
- Irreversible progression failure
- Tutorial softlock
- Extra FSRS punishment or review evidence
- XP clawback
- A management penalty above the accepted patient-level cap

Basic completed-encounter revenue remains governed by ADR 0025 unless a future
separately approved decision changes it.

## Authoring and publication

The administrator or workbook must let the clinical author review the final
wrong choice, compatible presentation/profile, terminal outcome, correction,
and Patient Learning Summary together. AI may draft an outcome, but it remains
Draft and cannot publish or enter the game without Melissa's clinical approval.

Publishing validation rejects:

- A terminal outcome attached to a nonfinal scored node
- A missing or ambiguous wrong-choice disposition
- More than one eligible outcome for the same pilot tuple
- Missing severity, causal framing, clinical rationale, source, approval, or
  compatible profile coverage
- Unresolved or invalid template slots
- A clinically implausible or causally overstated outcome
- Contradiction with the correct explanation or Patient Learning Summary
- Any outcome that creates another score or bypasses the operational cap

Published outcomes are never edited in place. Adding or changing a disposition
for an existing published question requires new immutable item revisions and
validated replacement or migration behavior under ADRs 0015 and 0016; it is not
an ordinary additive edit to that item. Already generated encounters remain
frozen.

## Consequences

- Nonfinal mistakes preserve the complete educational sequence.
- Final mistakes can produce memorable, clinically meaningful patient
  consequences without multiplying case branches.
- Melissa must author and approve outcome dispositions for final wrong choices,
  adding bounded work to Level 0 and Level 1 content.
- The runtime needs a reproducible terminal-feedback payload but no general
  branching engine.

## Alternatives rejected

- **Wrong-answer branches that later rejoin:** more immersive, but multiply
  clinical authoring, validation, restoration, and feedback-leak risks.
- **End every case immediately after any wrong answer:** simpler, but punitive
  and removes later learning opportunities.

## Cost of changing later

Expensive after clinical authoring begins. This policy affects Case Family and
Decision Node structure, final-answer mappings, the workbook and administrator
interface, validation, runtime freeze data, terminal chart presentation,
release compatibility, save restoration, and existing clinical cases.
