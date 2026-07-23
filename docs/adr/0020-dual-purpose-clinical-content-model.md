# ADR 0020: Dual-Purpose Clinical Content Model

Status: Accepted

Date: 2026-07-23

Decision owner: Melissa

Severity: RED

## Context

Clinical authoring must support two related jobs:

1. Preserve comprehensive, sourced knowledge about diagnoses, procedures,
   complications, anatomy, screening, resuscitation, and general principles.
2. Produce clinically approved, reproducible patient encounters and questions
   that test narrow educational concepts in the game.

A flat question bank would not preserve the knowledge needed to create and
review varied cases. Embedding questions directly in topic notes would blur
background facts, runtime rules, clinical approval, FSRS identity, and immutable
publication. Completely separate knowledge and question systems would duplicate
sources and make change-impact review unreliable.

The authoring model must also express when a concept becomes appropriate for
the player's facility, permit safe cosmetic and clinical variation without
runtime invention, distinguish meaningful mastery variants from superficial
changes, and support controlled forward clinical releases under ADR 0015.

## Decision

Use a linked, revisioned, dual-purpose clinical model. The clinical knowledge
base informs authoring, but only separately reviewed runtime-teaching items and
explicit generation rules may enter a published clinical release.

### Knowledge-base identities

- A **Clinical Topic** is the stable parent subject. Its type may be diagnosis,
  procedure, complication, anatomy, screening, resuscitation, general
  principle, or another controlled type added later.
- A **Clinical Topic Revision** preserves the topic's reviewed narrative
  sections, including definition, pathophysiology, epidemiology, presentation,
  evaluation, management, complications, differential diagnosis, prognosis,
  pearls, pitfalls, and notes.
- **Structured Clinical Facts** preserve queryable facts that may help
  authoring, such as age ranges, demographic context, risk factors, findings,
  and prevalence. They retain context, units, qualifiers, and citations.
- **Sources and Citations** are reusable records linked to the exact claims and
  runtime items they support. A topic-level bibliography alone is insufficient
  for a scored item.

Descriptive epidemiology and other knowledge-base facts never become runtime
selection weights automatically. Runtime distributions require their own
explicit rationale, constraints, approval, and revision.

### Educational and runtime identities

- A **Tested Concept** is one narrow learning objective and exactly one FSRS
  card identity. It has one primary Clinical Topic and may have many related or
  differential-topic links.
- A **Case Family** optionally groups encounters that share a clinical arc or
  context without becoming an FSRS identity.
- A **Patient Presentation Variant** is a stable, clinically meaningful
  presentation identity. It represents a substantive difference such as a
  typical versus atypical presentation or a different clinical context.
  Cosmetic changes to name, exact age, pronouns, occupation, prose, or answer
  order do not create a mastery variant.
- A **Concept Presentation Link** is the many-to-many relationship between a
  Tested Concept and a compatible Patient Presentation Variant. It records how
  the presentation tests that concept and any eligibility restrictions.
- A **Decision Node** is one scored or unscored decision within a case. Every
  scored Decision Node has exactly one primary Tested Concept and can update
  only that concept's FSRS state.
- A **Question Variant** is an approved way to express a Decision Node. It may
  be compatible with one or more Patient Presentation Variants through an
  explicit many-to-many compatibility relationship.
- **Answer Choices** and **Explanations** belong to an exact Question Variant
  revision. Safe answer-order shuffling is declared rather than assumed.

A Patient Presentation Variant can support several concepts, and a concept can
appear through several presentations. This avoids duplicating a clinically
coherent patient solely because an episode asks more than one question, while
the Decision Node still enforces one FSRS concept per scored answer.

### Facility-stage and capability eligibility

Every Tested Concept has a required **Earliest Facility Stage**. This is the
first facility progression stage at which an appropriate patient encounter may
appear; it is not educational difficulty, room-upgrade level, employee-training
level, or FSRS state.

Patient Presentation Variants and their concept links may additionally require
balance-defined facility capabilities, such as an available room or service.
Runtime eligibility requires both the concept's earliest stage and a compatible
presentation whose capability requirements are currently met.

Publishing validation must ensure that advancing the facility cannot strand an
FSRS review. Once a concept has entered scheduling, at least one clinically
appropriate presentation or deterministic fallback remains eligible at later
stages. Newly adopted supplemental concepts follow ADR 0015 and do not enlarge
an existing campaign's fixed core-concept mastery denominator.

### Constrained scenario templates

Each Patient Presentation Variant may have immutable **Scenario Template
Revisions** with named, typed slots. Every slot is classified as:

1. **Cosmetic**: may vary without changing the clinical problem.
2. **Clinically constrained**: may vary only within approved values, ranges,
   units, distributions, or conditional relationships.
3. **Locked clinical fact**: answer-essential and not randomized.

Approved Value Sets and finite **Clinical Instantiation Profiles** define
coherent combinations of interdependent fields. Declarative constraints express
dependencies and prohibited combinations. The pilot will not permit arbitrary
author-written runtime code inside templates.

Prevalence information may inform drafting, but each runtime weight is a
separate approved choice. Names and other synthetic details must remain
fictional; no PHI or real patient record may enter authoring, previews, or
runtime data.

### Runtime freezing, repetition, and reproducibility

The versioned campaign random contract selects an eligible concept,
presentation link, Patient Presentation Variant, Question Variant, approved
profile, slot values, and safe answer order.

When an episode or scored decision is generated, preserve:

- The clinical release and exact immutable item revisions
- The selected concept, presentation, question, profile, and constraint
  identities
- Every resolved value and its provenance
- The exact rendered stem, answer choices, answer order, correct-answer
  mapping, and explanation needed for restoration
- Random-stream identity and counter or equivalent replay evidence
- A checksum of the frozen clinical instance

Generated or started material remains frozen after a clinical-release adoption.
New releases affect only newly generated material unless a separately validated
safe migration exists.

Repetition controls use stable semantic identities and recent-exposure history.
Only distinct Patient Presentation Variant identities satisfy the
different-patient-variant mastery rule. Cosmetic substitutions and answer-order
changes do not. Remediation may use a different Patient Presentation Variant or
a materially different Question Variant, but still updates only the same
primary concept.

### Authoring workflow and administrator interface

The protected administrator application will provide:

- A **Clinical Library** for search, filters, review state, sources, facility
  stage, release use, and change impact
- A **Topic Workspace** for narrative sections, structured facts, citations,
  revision comparison, and linked concepts
- A **Concept Workspace** showing its one learning objective, primary and
  related topics, earliest facility stage, FSRS identity, presentations,
  questions, and later-stage coverage
- A **Case and Variant Studio** for fixed facts, required findings, typed slots,
  approved profiles, dependencies, capability gates, and semantic identity
- A **Question Editor** that visibly identifies the one concept a scored answer
  updates and manages choices, distractors, explanations, citations, and safe
  shuffling
- An **AI Draft Assistant** whose output is always marked Draft and retains its
  inputs and provenance
- A **Preview Lab** that can generate at least 20 seeded examples and also run
  exhaustive finite-profile and boundary checks
- A **Release Center** for validation reports, review, approval, immutable
  publication, compatibility classification, adoption controls, withdrawal,
  correction, export, and restoration

Suggested AI material cannot approve itself, satisfy clinical review, or enter
a release automatically. Melissa retains clinical approval authority. The live
game performs no AI generation. Any later proposal for live AI clinical
generation is a new RED decision.

Topic approval does not approve its derived concepts, presentations, templates,
questions, answers, or explanations. Each publishable revision retains its own
workflow, sources, clinical approval, provenance, and immutable release
membership.

### Publication validation

Publication is blocked unless automated and human review confirms, as
applicable:

- Every scored Decision Node has exactly one primary Tested Concept
- Stable identities and exact revisions resolve without ambiguity
- Every template field is defined, typed, classified, and used consistently
- Required clinical constraints and capability rules are present
- Finite profiles are exhaustively checked and numeric/range boundaries are
  tested
- No prohibited combination can be generated
- Every permitted combination preserves the intended correct answer
- Question Variants genuinely test the same narrow concept
- Mastery-eligible presentation differences are clinically meaningful
- Later-stage coverage prevents scheduled concepts from becoming unavailable
- Sources, required explanations, clinical approval, and AI provenance are
  complete
- No unresolved or AI-generated Draft enters a release
- Runtime bundles exclude comprehensive notes, rejected drafts, prompts,
  unnecessary source text, and other administrator-only data
- Release contents obey ADRs 0015 and 0016 for compatibility, adoption,
  correction, and withdrawal

The 20-example preview is a human quality-review aid, not mathematical proof of
safety. Automated exhaustive and boundary tests remain required where the
allowed state space can be enumerated.

## Benefits

- Melissa can build a reusable sourced knowledge base while creating varied,
  concept-specific game content from it.
- Stable semantic identities make FSRS evidence, mastery, repetition control,
  correction, and audit reliable.
- Facility-stage and capability rules align clinical encounters with what the
  player's center can reasonably do without conflating progression systems.
- Typed templates produce variety without unrestricted runtime invention.
- Exact revisions and frozen instances support restoration and controlled
  forward releases.
- A protected, nontechnical workflow can support early clinical collection and
  later evolve into the full administrator application.

## Risks and limitations

- The linked model has more records and relationships than a simple question
  spreadsheet and requires a carefully designed authoring interface.
- Automated rules cannot prove that differently worded questions test the same
  concept or that every clinical answer remains sound; Melissa's clinical review
  remains indispensable.
- Poorly chosen variant boundaries could inflate mastery or make repetition
  feel artificial.
- Declarative constraints and finite profiles trade some authoring freedom for
  safety, testability, and reproducibility.
- AI-provider choice, source-data handling, cost, retention, and outage behavior
  remain separately unapproved.
- Exact table names, columns, indexes, visual styling, and vertical-slice admin
  scope remain implementation-level or later scope decisions.

## Alternatives considered

1. Use topic documents with embedded questions and template text. This is easy
   to start but weakens stable identities, relational validation, versioning,
   targeted corrections, and mastery evidence.
2. Maintain a separate knowledge base and flat question bank. This lowers
   initial relationship complexity but duplicates sources, obscures provenance,
   and makes authoring and impact analysis unreliable.
3. Permit unrestricted runtime AI generation. This conflicts with clinical
   approval, reproducibility, immutable releases, deterministic campaigns, cost
   control, and the pilot's safety boundary.

## Cost and maintenance

Prototype workbook preparation is low cost but requires careful controlled
lists and data validation. Building the complete authoring interface and
publisher is substantial work. Ongoing maintenance includes controlled
vocabularies, validators, review queues, source upkeep, immutable revisions,
release manifests, compatibility checks, preview fixtures, and restoration
tests. Runtime AI service charges are avoided.

## Cost of changing later

Very expensive. Replacing these identities or relationship boundaries would
require migrating authored content, FSRS card links, mastery evidence, release
manifests, campaign histories, frozen clinical instances, correction targets,
administrator workflows, imports, exports, and validation tests. Existing
learner history might be impossible to reinterpret safely if meaningful
Patient Presentation Variant or Tested Concept identity changed.

## Related decisions

- ADR 0014: One Primary Concept per Scored Decision
- ADR 0015: Controlled Forward Clinical Releases
- ADR 0016: Clinical Withdrawal and Correction
- ADR 0018: Versioned Named Random Streams
- ADR 0019: Hybrid Relational and JSONB Storage
