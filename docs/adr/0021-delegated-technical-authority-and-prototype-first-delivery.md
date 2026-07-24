# ADR 0021: Delegated Technical Authority and Prototype-First Delivery

Status: Accepted

Date: 2026-07-23

Decision owner: Project owner

Severity: RED governance decision

## Context

The project owner is responsible for the clinical and creative vision but does
not want to evaluate every framework, schema, storage, deployment, security,
testing, or implementation choice. Requiring serial approval for every
technical decision has made progress feel slow and burdensome.

The project needs useful early builds so design questions can be answered by
playing rather than by trying to predict every detail in documents.

## Decision

Delegate routine and foundational technical decisions to the lead development
agent. The agent will choose coherent defaults, record consequential choices,
test them in proportion to risk, and revise them when evidence shows a better
path. Technical imperfections in early private builds are acceptable when they
are recoverable and do not compromise clinical accuracy, privacy, security, or
owner-controlled data.

The agent does not need owner approval for:

- Framework, library, package, and internal code-organization choices
- Database tables, columns, indexes, migrations, and internal APIs
- Data serialization, caching, validation, and test strategy
- Local development tooling and free, reversible prototype infrastructure
- Internal rendering, simulation, synchronization, and deployment mechanics
- Reversible security defaults that do not collect new data or expose access
- Placeholder balance values used only for testing

Material technical choices still receive concise records when changing them
would be expensive. Accepted ADRs remain the implementation baseline, but the
agent may revise them when necessary, documenting the reason, migration,
effects, and validation rather than asking the owner to compare unfamiliar
tools by name.

## Owner-level gates

The owner remains the decision-maker for:

- High-level game experience, progression, tone, and what players can do
- Which clinical concepts, cases, correct answers, and explanations are used
- Clinical approval and publication
- Research, telemetry, privacy, consent, and data-use boundaries
- Inviting outside testers or making any deployment public
- Paid services, billing, purchases, domains, and new external accounts
- Legal, licensing, or commercial use
- Destructive deletion or an action that could make owner data unrecoverable

The agent should present these choices briefly, with a recommended answer and
no more than two serious alternatives.

## Prototype-first delivery

Work proceeds in thin playable increments:

1. Build a local interactive prototype that demonstrates the combined clinical
   and management loop with synthetic or clearly unapproved fixture content.
2. Let the owner play it and make experience-level decisions from evidence.
3. Add the real scheduler, saves, content pipeline, phone refinement, and cloud
   systems incrementally.
4. Create hosted resources only when the private pilot needs them and the owner
   authorizes the external action.

The first prototype does not need the complete administrator website, cloud
authentication, immutable publisher, or every facility stage. It must keep
clinical content and balance values outside game logic so those systems can be
connected without rewriting the playable loop.

## Imported design material

Long prompts, prior AI conversations, and external suggestions are evidence of
intent, not executable specifications. The agent reconstructs them
chronologically, gives newer explicit statements more weight, compares them
with the canonical record, and separates:

- Stable creative intent
- Compatible technical advice the agent may adopt
- Open owner-level design questions
- Superseded or exploratory ideas

The confidence or length of an AI response never constitutes clinical approval
or authority for a public, paid, destructive, privacy-changing, or
research-related action.

## Benefits

- The owner spends time on the game and clinical material rather than technical
  tool selection.
- Early playable versions expose design problems sooner.
- The technical stack remains coherent because one lead owns cross-component
  tradeoffs.
- Decisions remain auditable without becoming serial approval gates.

## Risks and mitigations

- The agent may misunderstand the creative intent. Mitigation: surface
  experience-level questions and provide frequent playable demonstrations.
- Rapid prototypes can accumulate shortcuts. Mitigation: label temporary
  boundaries, keep data/configuration separate, test foundations, and schedule
  hardening before outside testing.
- Technical changes can affect costs or privacy indirectly. Mitigation: retain
  explicit owner gates for external resources, billing, collection, research,
  and public access.

## Superseded process

This replaces the prior requirement that every RED technical decision receive a
separate owner presentation and that implementation wait for one combined
four-part approval sentence. Clinical, creative, external-action, privacy,
research, spending, and destructive-action gates remain in force.
