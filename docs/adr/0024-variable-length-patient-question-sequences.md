# ADR 0024: Variable-Length Patient Question Sequences

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: RED game-design decision

## Context

After selecting multiple-choice assessment for every scored clinical concept,
the game still needs a rule for how many scored questions can occur during one
fictional patient encounter. Exactly one question per patient is simple but can
make the experience feel like a question bank with rapid cosmetic patient
turnover. Long mandatory clinical chains increase realism but also reading
load, authoring burden, feedback dependencies, and queue disruption.

## Decision

A published patient encounter contains between one and three sequential scored
multiple-choice Decision Nodes.

- Each scored node tests exactly one primary Tested Concept and creates its own
  answer, explanation, review evidence, and FSRS update.
- The same Tested Concept cannot be scored twice within one patient encounter.
- The clinically authored case sequence determines whether the encounter has
  one, two, or three scored nodes; the runtime does not append arbitrary extra
  questions.
- Simple cases may contain one question. Appropriate cases may progress through
  two or three distinct decisions such as evaluation, diagnosis, management,
  timing, or complication response.
- Feedback appears promptly unless it would reveal or materially cue a later
  scored answer. Dependent feedback is then held until the affected later node
  is submitted or the encounter safely ends.
- Under ADR 0030, an incorrect nonfinal answer then continues from the
  clinically correct state. A wrong final answer may add one unscored,
  clinically approved terminal outcome vignette; it does not add another node
  or shorten a remaining sequence.
- Unscored narrative, operational updates, and ordinary management actions do
  not count toward the three-question limit.
- A clinical sequence needing more than three scored decisions must be divided
  into separately generated linked encounters or reconsidered during clinical
  authoring.

Publishing validation rejects zero-question scored encounters, more than three
scored nodes, duplicate primary concepts within one encounter, unresolved
ordering dependencies, or feedback that reveals a later correct answer.

## Consequences

- Short patients remain quick while selected cases can create a meaningful
  clinical arc.
- One encounter may produce learning evidence for up to three different
  concepts.
- Content authoring, runtime state, frozen instances, and restoration must
  preserve node order and feedback-release conditions.
- Economy, XP, satisfaction, and remediation rewards require separate rules so
  multi-question patients are not over-rewarded or disproportionately punitive.

## Cost of changing later

Moderate to expensive after content authoring. The limit affects case design,
runtime state, feedback timing, reward calculations, patient queues, frozen
instances, validators, previews, and save compatibility.

## Current amendment

[ADR 0034](0034-july-27-clinical-encounter-amendments.md) raises the absolute
maximum to four only for rare encounters eligible at Level 3 or later.
Levels 0 through 2 remain capped at three.
