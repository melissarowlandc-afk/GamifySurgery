# ADR 0025: Bounded Clinical-Answer Consequences

Status: Accepted

Date: 2026-07-24

Decision owner: Project owner

Severity: YELLOW game-design decision

## Context

Clinical decisions must matter to the management game, but making accuracy
control most revenue can trap the learners who need the most practice in a
financial decline. Removing all operational consequences would make the
educational and management loops feel disconnected.

Multi-question patients and same-date remediation also create reward-farming
risks if every scored answer independently manufactures patient revenue.

## Decision

Use meaningful but bounded consequences:

- A completed patient encounter earns basic operational revenue based on the
  encounter and services, not on the number of scored questions it contains.
- A correct first submission earns educational XP for its primary concept and
  contributes to a modest, capped patient-level quality or satisfaction bonus.
- An incorrect first submission maps to Again, earns no correctness bonus,
  never removes previously earned XP, and contributes to a small capped
  patient-level satisfaction or financial consequence.
- A patient with two or three questions is settled as one patient. Its quality
  result is normalized and capped rather than multiplying the full patient
  bonus or penalty by question count.
- Exact amounts, caps, and formulas remain versioned balance values tested
  through deterministic simulations.
- Explanation viewing, correction practice, APP automation, withdrawn content,
  and publisher-caused cancellation do not create clinical-answer bonuses.
- A same-date remediation response may update FSRS but cannot award another
  clinical XP or quality bonus for that concept on that learning date.
- The expected operational and progression value of answering deliberately
  incorrectly must never exceed answering correctly.

Tutorial funding is independently guaranteed to cover the first examination
room and an operating buffer even if every tutorial answer is incorrect.
Incorrect tutorial answers still receive normal teaching feedback and bounded
consequences; the guarantee prevents a softlock rather than pretending the
answers were correct.

ADR 0030 now permits one clinically approved minor or major fictional terminal
outcome after an appropriate wrong final answer. Its narrative clinical
severity is separate from the balance effect and cannot increase the accepted
patient-level cap. The first pilot still does not use a single wrong answer to
cause an unrecoverable campaign loss, irreversible progression failure,
tutorial softlock, or punitive learning-state clawback.

## Consequences

- Accuracy visibly benefits the facility without making mistakes end the game.
- Basic revenue keeps the management loop operating while FSRS schedules weak
  concepts for more practice.
- Patient-level normalization avoids making three-question cases inherently
  three times as profitable or dangerous.
- Balance simulation must test worst-case tutorial answers, deliberate
  incorrect-answer strategies, remediation, bankruptcy recovery, and
  satisfaction recovery.

## Cost of changing later

The numerical values are inexpensive to tune because they live in immutable
balance releases. Changing the underlying relationship between clinical
accuracy, revenue, XP, and satisfaction would require meaningful rebalance,
simulation, tutorial, UI-feedback, and progression work.
