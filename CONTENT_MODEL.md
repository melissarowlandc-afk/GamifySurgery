# Clinical Content Model Proposal

Status: Accepted educational rules and accepted dual-purpose knowledge-base and
scenario-authoring architecture under ADR 0020. Exact implementation details
remain unimplemented. No clinical content has been authored or approved.

Last updated: 2026-07-24

## Goals

- Schedule learning at the concept level.
- Present the same concept through varied fictional patients and questions.
- Preserve clinical truth, sources, provenance, revisions, and approval.
- Prevent draft or unapproved material from reaching players.
- Avoid copying or closely paraphrasing commercial question banks.
- Support safe publishing, rollback, and emergency correction.
- Let Melissa build a comprehensive clinical knowledge base while separately
  producing approved runtime teaching material.
- Let clinical-content authoring proceed in a nontechnical workbook before the
  game and full administrator interface exist.

## Accepted dual-purpose boundary

The authoring system has two related outputs but must not collapse them into
one undifferentiated document:

1. The **clinical knowledge base** preserves comprehensive topic background,
   structured clinical facts, sources, and review history.
2. The **runtime teaching library** contains exact approved concepts, cases,
   clinically meaningful patient variants, templates, questions, answers, and
   explanations that the game may instantiate.

Knowledge-base material supports authoring and AI-assisted drafting. It does
not automatically become a patient-generation rule or ship to the player
application. Runtime content references the exact approved knowledge-base
revisions and sources used to justify it. Updating a topic creates a new
revision and may flag dependent teaching items for review, but it never silently
rewrites them.

This boundary prevents a prevalence statement, risk factor, or narrative note
from becoming a generation probability merely because it appears in the topic
record.

## Accepted hierarchy and entity names

### Clinical Topic

The parent knowledge-base subject. `Clinical Topic` is preferred over
`Diagnosis` because topics may represent diagnoses, procedures, complications,
anatomy, screening, resuscitation, or general principles.

Each topic has:

- A permanent stable identifier
- One primary topic type plus optional search tags
- Preferred name, aliases, and optional external terminology codes
- Mutable draft revisions and immutable approved/published revisions
- Review state, approver, provenance, and change history

### Clinical Topic Revision

An exact revision of a topic. It contains structured sections for:

- Definition and pathophysiology
- Epidemiology
- Age and demographic patterns
- Risk factors
- Typical and atypical presentations
- History and physical findings
- Diagnostic evaluation
- Management
- Complications
- Differential diagnoses
- Prognosis
- Pearls, pitfalls, and notes

Long-form narrative belongs in these sections. Publishing or approving one
revision never edits a prior revision.

### Structured Clinical Fact

A claim or constrained fact that may support searching, drafting, validation,
or scenario design. It records:

- Fact type
- Value, allowed category, range, or distribution description
- Unit and precision when applicable
- Population and clinical context
- Applicability and exceptions
- Claim-specific citations
- Review and approval state
- Whether it is merely descriptive or has been explicitly approved for use in
  a scenario template

Structured facts do not automatically control runtime random selection.

### Tested Concept

The smallest scheduled unit. Each Tested Concept becomes exactly one FSRS card
inside each campaign that includes it.

Each concept has:

- A permanent stable identifier and immutable lineage
- One narrow, plainly stated learning objective
- Exactly one primary Clinical Topic for organization
- Optional related-topic and differential-topic links
- Optional typed confusion relationships to other concepts
- A required earliest facility stage at which it may first generate an
  encounter
- Review, approval, source, and revision history

The facility-stage field means **earliest unlock**, not educational difficulty,
room-upgrade level, employee-training level, or an FSRS level. Once introduced,
a due concept must remain reviewable in later facility stages through at least
one eligible presentation.

If a learning objective changes meaning, it receives a new concept identifier
rather than redefining an existing FSRS card.

### Case Family

A coherent fictional clinical situation or episode structure. It can contain
one or more decision nodes and one or more clinically meaningful Patient
Presentation Variants.

A Case Family may support several Tested Concepts, but every scored decision
inside it still identifies exactly one primary concept.

### Patient Presentation Variant

A stable, clinically meaningful presentation within a Case Family, such as a
typical presentation, an atypical presentation, or the same management decision
in a meaningfully different context.

It defines:

- Clinical setting and presentation role
- Fixed answer-essential facts
- Required findings
- Approved instantiation profiles and variable slots
- Clinical dependencies and prohibited combinations
- Earliest facility stage and required facility capabilities
- Required post-completion Patient Learning Summary for a scored clinical
  presentation
- Sources, review, approval, and revision history

This stable variant identity—not the generated name, exact age, pronouns, or
other cosmetic values—is the patient-variant identity used by the mastery rule.
Two cosmetic instantiations of one Patient Presentation Variant count as the
same variant.

Changing the clinical meaning or answer-essential profile enough to make it a
meaningfully different mastery exposure requires a new Patient Presentation
Variant identifier.

### Patient Learning Summary

A clinically approved, patient-level summary required for every publishable
scored clinical presentation and available only after all required authored
nodes are complete and the encounter is terminal. It covers the clinical
conclusion; diagnosis and management or next steps when applicable; major
pearls or pitfalls; and claim-linked sources. It complements question-specific
explanations and never creates another scored review.

The summary is revisioned like other runtime clinical content and may use only
compatible approved template slots. The runtime freezes its exact rendered
wording and source revision IDs with the encounter. Reopening a Resolved chart
therefore cannot expose Draft Clinical Topic notes or silently change the
historical patient after a later publication, correction, or withdrawal.

### Concept Presentation Link

A typed link between a Tested Concept and a Patient Presentation Variant. It
states how that presentation tests the concept, whether it is typical,
atypical, contrasting, or remedial, and whether it is eligible to count as a
distinct mastery variant.

This link is many-to-many because one concept needs several patient
presentations and one coherent patient presentation may contain separate
decision nodes testing several concepts.

### Decision Node

A position in a Case Family at which the player makes a scored or unscored
decision. Every scored node has exactly one primary Tested Concept.

Accepted scoring rules remain:

- First submitted answer only updates the node's one primary FSRS concept.
- Incorrect maps to Again.
- Correct maps to Good.
- Correction after feedback is practice, not a second review.
- APP automation is operational, not recall.
- Supporting concept tags do not update FSRS or mastery.

A patient encounter contains one to three independently scored nodes. Each node
must use a different primary Tested Concept within that encounter. The authored
case defines the count and order; the runtime does not append arbitrary scored
questions. Publication preview must verify that feedback or state changes from
one node do not reveal a later scored answer.

### Result Gate

An optional authored transition within a case before terminal completion, used
when the patient must wait for one or more laboratory, imaging, consultation,
procedure, or other operational results. Encounters do not receive automatic
filler delays.

Each immutable Result Gate revision defines:

- Stable result-type references
- Exact approved clinical result payloads or compatible constrained templates
- Whether one result, every result, or an explicit subset makes the next node
  ready
- Permitted in-house and outsourced service routes
- Capability policy: hard required, or in-house preferred with an approved
  outsourced fallback
- Whether completion requires a player action
- Compatible presentations, profiles, stages, and capabilities
- Sources, clinical review, and approval for the result meaning

The clinical model never contains operational turnaround numbers. Stable
result/service definitions in the balance release own time, cost, capacity,
queue, and route modifiers. Operational differences cannot change the
clinically approved result or correct answer.

### Question Variant

An approved alternative question under one Decision Node and therefore exactly
one Tested Concept. It may vary stem wording, compatible patient presentation,
perspective, distractors, answer-choice wording, and explanation while
preserving the same narrow learning objective and correct clinical conclusion.

Each Question Variant has:

- A permanent stable identifier and exact revisions
- Compatible Patient Presentation Variants
- Stem template; scored answer mode is single-select multiple choice
- Answer choices, correct-answer mapping, and choice-specific rationales
- General explanation
- Answer-order shuffle policy
- Sources, provenance, review, and approval
- Recent-use and remediation eligibility metadata

Question wording differences do not create a new patient mastery variant.

Every scored Question Variant has a finite answer set with exactly one
clinically correct choice. Choice count may vary. Searchable entry, free text,
matching, ordering, and multi-select are not scored clinical modes in the
current design. An unscored Decision Node may use another interaction only when
it is clearly separated from clinical assessment and cannot update FSRS or
mastery.

### Answer Choice

A child of one Question Variant. It preserves exact wording, correctness,
choice-specific rationale, and any grouping or ordering rule.

Answer order is fixed by default. Shuffling requires explicit approval because
ordered choices, numeric ranges, paired choices, and phrases such as “all of
the above” can become invalid when reordered. The runtime instance stores the
exact displayed order.

### Source and Citation

A Source preserves title, publisher or journal, link or identifier, access
date, edition or publication date, relevant licensing notes, and source type.

A Citation is a many-to-many link from a source to an exact topic section,
structured fact, concept, patient variant, Result Gate or Requirement, Patient
Learning Summary, question, answer rationale, or explanation revision. It
identifies the claim or passage supported rather than merely attaching a
bibliography to the topic.

## Accepted relationship summary

| Relationship | Shape | Reason |
|---|---|---|
| Clinical Topic to its primary Tested Concepts | One-to-many | Every concept has one organizing topic |
| Tested Concept to related or differential Clinical Topics | Many-to-many | A concept may involve several related subjects without changing its primary topic |
| Clinical Topic to Clinical Topic | Typed many-to-many | Differentials, complications, procedures, and anatomy form a network rather than a strict tree |
| Case Family to Clinical Topic | Many-to-many | One coherent episode may involve several topics and one topic supports many cases |
| Case Family to Patient Presentation Variant | One-to-many | A variant is one meaningful presentation of a coherent case family |
| Patient Presentation Variant revision to Patient Learning Summary revision | One-to-one for scored presentations | Every scored presentation has one exact approved post-completion summary; viewing it remains optional |
| Patient Presentation Variant to Scenario Template Revision | One-to-many | One meaningful presentation may have several approved template wordings without creating new mastery variants |
| Tested Concept to Patient Presentation Variant | Many-to-many through Concept Presentation Link | Concepts need several presentations, and one patient can support separate concept-specific decisions |
| Decision Node to Tested Concept | Many-to-one | Each scored node updates exactly one concept |
| Case Family to Result Gate | One-to-many ordered transitions | A case may contain several meaningful waits without inserting them between every node |
| Result Gate to Result Requirement | One-to-many | A gate may wait for one or several exact approved results |
| Result Requirement to balance Result/Service Definition | Many-to-one stable reference | Clinical content owns result meaning while the pinned balance release owns operational timing |
| Decision Node to Question Variant | One-to-many | Several approved wordings may test the same node and concept |
| Question Variant to compatible Patient Presentation Variant | Many-to-many | A question may work with several presentations, while a presentation may support several questions |
| Exact content revisions to Sources | Many-to-many through Citation | One source supports several claims and one claim may require several sources |
| Patient Presentation Variant to facility capabilities | Many-to-many | A presentation may require several services, and one capability supports many presentations |
| Clinical Release to exact item revisions | Many-to-many through release membership | Unchanged immutable revisions may appear in several complete releases |

Question Variants are never many-to-many with Tested Concepts: each has exactly
one primary concept through its Decision Node. Topic type is one primary value
plus tags rather than an unrestricted many-to-many classification.

## Accepted facility-stage availability

Melissa's “Level 0” requirement is represented as a required
`earliest_facility_stage` on every Tested Concept.

Runtime eligibility requires all of the following:

1. The campaign has reached the concept's earliest facility stage.
2. The concept is part of the campaign's core set or adopted supplemental
   content.
3. At least one linked Patient Presentation Variant is approved and compatible
   with the current facility stage and capabilities.
4. The campaign's pinned balance release defines every referenced capability.
5. Educational selection and recency rules make the concept and presentation
   eligible.

Patient Presentation Variants may add stricter stage or capability
requirements. For example, one concept might unlock early through a triage or
referral presentation while a later variant requires a service the facility
does not yet possess.

Once a concept has appeared and has an FSRS history, reaching a later facility
stage cannot strand its reviews. Publication validation must prove that at
least one approved presentation remains eligible at every later supported
stage, or provide an explicit non-random fallback presentation.

The availability field does not enlarge or shrink an existing campaign's pinned
core mastery denominator. A compatible later clinical release may add a
supplemental concept with an earlier unlock; it becomes eligible without
becoming a new progression or victory requirement.

## Accepted constrained-template model

### Scenario Template Revision

An immutable approved template revision belongs to one Patient Presentation
Variant. It contains narrative fragments and named typed slots. Question
Variants may reference only slots defined by a compatible approved template.

No arbitrary executable code, unrestricted expression, or runtime free-text
generation is permitted.

### Template Slot

Every slot has a stable identifier, type, unit when applicable, grammatical
metadata, and exactly one safety class:

1. **Cosmetic**: may change flavor without changing clinical meaning, such as a
   synthetic name or harmless occupation.
2. **Clinically constrained**: may vary only through approved values, ranges,
   weights, profiles, and dependencies.
3. **Locked clinical fact**: fixed because changing it could alter the answer
   or learning objective.

Supported typed values may include approved name set, pronoun set, integer or
decimal with unit and precision, age, enum, boolean, approved text fragment,
vital sign, laboratory value, risk factor, symptom, and clinical finding.

Pronouns and gender presentation must not be used as proxies for anatomy,
pregnancy capability, or another clinical fact. Clinically relevant biology,
anatomy, pregnancy status, and demographic information are represented
explicitly and linked only through approved constraints.

### Approved Value Set and Distribution

A value set contains exact allowed values or a bounded numeric range with
units, precision, optional author-approved weights, and clinical rationale.
Scenario weights are teaching and variation controls. They are separate from
epidemiologic prevalence facts and never inherit prevalence automatically.

Any variable capable of crossing a diagnostic or management threshold must use
locked values or a finite set of clinically approved profiles. It cannot use an
unrestricted continuous range merely because the endpoints appear safe.

### Clinical Instantiation Profile

An approved profile selects a coherent bundle of interdependent clinical facts.
It is the preferred way to represent combinations such as age, anatomy,
pregnancy status, risk factors, findings, vital signs, and laboratory patterns.
The generator chooses one valid profile first and varies only the slots allowed
inside it.

This avoids creating a large fragile web of independent random fields.

### Constraint Rule

Simple declarative rules may express `requires`, `excludes`, `only when`,
numeric boundary, membership, and paired-value relationships. The
administrator interface presents these as plain-language decision tables, not
code. Circular rules, unreachable profiles, contradictory requirements, and
unbounded values fail validation.

## Accepted runtime instantiation and repetition model

For a new encounter, the runtime:

1. Selects an eligible Tested Concept.
2. Selects an eligible Concept Presentation Link and Patient Presentation
   Variant.
3. Instantiates the authored Decision Node and Result Gate sequence and selects
   compatible Question Variants.
4. Selects one approved Clinical Instantiation Profile.
5. Fills only its approved slots through the campaign's named
   clinical-presentation random stream.
6. Applies approved answer-order shuffling only when the Question Variant
   permits it.
7. Validates the completed instance before display.
8. Freezes and saves the exact revisions, Result Gates and approved result
   payloads, slot values, rendered wording, displayed answer order,
   correct-answer mapping, explanation, randomness provenance, and a canonical
   checksum.

The result is a Runtime Encounter Instance, not a new content revision.

Recent-use tracking distinguishes:

- Tested Concept
- Patient Presentation Variant
- Question Variant
- Noncosmetic instantiation fingerprint
- Exact rendered instance

Changing only a name, pronouns, or another cosmetic slot does not evade
duplicate detection or count as a new mastery variant. Selection first applies
overdue priority, interleaving, clustering limits, and content guarantees, then
uses the accepted seeded stream among stable-sorted eligible choices.

### Same-date remediation

After Again, the accepted same-date remediation may use one later scored
encounter after 30 real-world minutes. It must use either a different approved
Patient Presentation Variant or a materially distinct approved Question
Variant, consistent with the earlier accepted rule. A cosmetic instantiation or
answer-order change alone is not enough. Only Patient Presentation Variant
identity counts toward the separate mastery-variant requirement. If no suitable
presentation is eligible, the concept remains due for later. The selector does
not manufacture an extra patient arrival.

## Confusion and contrast

Concepts may have explicit confusion relationships. These relationships allow the selector to occasionally contrast easily confused diagnoses without changing their independent FSRS schedules.

Contrast should not force a non-due concept to become a scored review merely to create a pair. An optional unscored contrast or a pairing of two already-eligible concepts is safer.

## Workflow states

Accepted conceptual revision states:

1. Draft
2. Needs clinical review
3. Changes requested or rejected
4. Clinically approved
5. Included in release candidate
6. Published
7. Archived, superseded, retired, or withdrawn

Topic approval and runtime-item approval are separate. An approved Clinical
Topic does not automatically approve a concept, patient variant, template,
question, answer, or explanation derived from it. Only Melissa may provide
clinical approval for the pilot.

Recommended authoring sequence:

1. Create or revise a Clinical Topic and its structured facts.
2. Attach claim-specific sources and complete clinical review.
3. Define a Tested Concept, learning objective, earliest facility stage, and
   related topics.
4. Create or associate Case Families and Patient Presentation Variants.
5. Define locked facts, instantiation profiles, slots, distributions, and
   constraints.
6. Create Decision Nodes and Question Variants.
7. Create the patient-level diagnosis-and-management learning summary.
8. Run structural validation, constraint analysis, and preview coverage.
9. Clinically approve exact revisions.
10. Assemble and validate a complete release candidate.
11. Review compatibility, simulation, and dependency reports.
12. Publish an immutable release.

### AI-assisted drafting boundary

From the administrator application, an authorized editor may select approved
topic sections, structured facts, concepts, and sources and request draft
patient variants, templates, constraints, questions, distractors, or
explanations.

Every AI authoring job records:

- Requesting administrator and trusted time
- Selected exact input revisions
- Provider, model, system/template version, and relevant settings
- Generated draft and provenance
- Human edits, rejection, or acceptance into a draft revision

AI output:

- Enters only the Draft state
- Cannot clinically approve, publish, alter an immutable revision, or choose its
  own sources
- Must display unverified-citation and no-PHI warnings
- Cannot copy or closely paraphrase commercial question-bank material
- Must be compared with selected sources and reviewed by Melissa

The authoring system should send only the source material and owner-authored
notes that Melissa is authorized to use with the selected AI provider.
Provider selection, API account ownership, cost, data retention, copyright
handling, and secrets require a separate approval before AI authoring is
enabled.

The live game performs no AI generation. Any later live-AI proposal is a new
RED decision covering clinical safety, reproducibility, versioning, privacy,
cost, outage behavior, and correction.

## Accepted administrator workflow and interface structure

### Clinical Library

A searchable table with filters for topic type, workflow state, facility stage,
source completeness, AI involvement, release, and validation status. Separate
views show Topics, Concepts, Case Families, Patient Variants, Questions,
Sources, and Releases.

### Clinical Topic workspace

Header:

- Stable ID, preferred name, topic type, aliases, status, and current revision
- Clinical approval, approver, last review, and source-completeness indicators

Tabs:

1. Overview and comprehensive narrative sections
2. Structured Clinical Facts
3. Tested Concepts
4. Topic relationships, differentials, and complications
5. Sources and claim-level citations
6. Dependency and change-impact report
7. Revision and approval history

### Tested Concept workspace

The primary concept and its FSRS meaning remain visible at the top. The page
shows:

- One-sentence learning objective
- Primary and related topics
- Earliest facility stage and required presentation coverage
- Core-set memberships
- Linked Patient Presentation Variants
- Decision Nodes and Question Variants
- Confusion relationships and remediation coverage
- Source, approval, release, and validation status

Every scored-question row visibly states: “Updates FSRS concept: [concept
name and stable ID].”

### Case and Patient Variant Studio

The left panel shows locked clinical facts and approved instantiation profiles.
The middle panel provides a no-code slot table:

| Slot | Safety class | Type/unit | Allowed values or range | Weight | Dependencies |
|---|---|---|---|---|---|

A plain-language rules builder supports `requires`, `excludes`, `only when`,
and boundary rules. The right panel shows compatible concepts, questions,
facility stages, capabilities, sources, and approval status.

A Result Flow panel lets the editor place a Result Gate within the authored
case, select exact approved result payloads, define readiness and player-action
behavior, and mark the capability policy as hard required or eligible for an
approved outsourced fallback. It displays read-only turnaround previews from a
selected compatible balance release; clinical content never stores those
timing numbers.

### Question Variant editor

Shows the single primary concept, compatible patient variants, templated stem,
answer choices, correct mapping, shuffle policy, choice-specific rationales,
general explanation, citations, AI provenance, and change history.

Changing the primary concept after clinical approval creates a new draft and
invalidates prior approval. A published revision is never edited.

The Case and Patient Variant Studio also previews the patient-level learning
summary that becomes available after the encounter is terminal. It displays the
exact sources and approved revisions that will be frozen into the Resolved
chart.

### AI Draft assistant

An optional side panel lets the editor select exact approved context, request a
specific draft type, review a source-linked result, and accept parts into a new
draft. It has no Approve or Publish authority.

### Preview Lab

The standard preview generates 20 seeded examples, but 20 random examples are
not treated as proof of safety. The report also includes:

- Every finite Clinical Instantiation Profile at least once
- Minimum, maximum, and threshold-adjacent numeric cases
- Rare or low-weight combinations
- Grammar and unresolved-slot warnings
- Exact answer mapping and shuffled order
- Exact rendered Patient Learning Summary for every scored presentation
- Result Gate readiness, hard-capability or fallback coverage, and route/ETA
  previews against each supported balance release
- Noncosmetic fingerprints and duplicate analysis
- Facility-stage and capability eligibility
- The source and revision chain

Melissa can pin a preview seed, regenerate it later, and approve the exact
template revision only after reviewing validation results.

### Release Center

Shows dependency closure, unresolved drafts, clinical approvals, source
coverage, combinatorial tests, mastery-variant coverage, stage availability,
content-selection simulations, predecessor compatibility, exact manifest,
checksum, and rollback target. Publishing is a separate Melissa-authorized
action after validation succeeds.

## Publication validation

A clinical release candidate should fail validation when, at minimum:

### Structure and identity

- A scored decision lacks a primary concept.
- A scored decision identifies more than one primary concept.
- A Question Variant's concept differs from its Decision Node.
- A Tested Concept lacks one clear learning objective, primary topic, or
  earliest facility stage.
- A referenced topic, case, variant, template, slot, profile, question, answer,
  Result Gate, result type, capability, source, or exact revision is missing.
- Stable identifiers or revision identifiers are duplicated.
- A published identity is reused for a changed concept meaning or materially
  different mastery presentation.

### Template and clinical safety

- A template token lacks a typed slot definition.
- A slot lacks a safety class, type, unit, allowed domain, or grammatical
  behavior.
- An answer-essential fact is variable rather than locked or contained in an
  approved finite Clinical Instantiation Profile.
- A numeric clinical range lacks units, precision, or boundary behavior.
- A constraint is contradictory, circular, unreachable, or permits a prohibited
  combination.
- A Question Variant references a slot or Patient Presentation Variant with
  which it is not compatible.
- Any finite approved profile produces a different correct-answer mapping.
- Boundary and threshold-adjacent tests change the correct answer unexpectedly.
- The rendered template contains an unresolved token, broken grammar, invalid
  unit, or inconsistent linked facts.
- Answer-order shuffling can change meaning, reveal correctness, or break an
  ordering-dependent choice.
- Correctness is missing or internally inconsistent.
- A required explanation is absent.
- A scored clinical presentation's Patient Learning Summary is absent,
  unapproved, references an incompatible slot, lacks required sources, or
  exposes non-runtime Topic notes.
- A Result Gate is unsatisfiable, lacks an exact approved result payload,
  references an unavailable route, has no valid readiness rule, or changes
  clinical truth across permitted operational routes.
- A required result has neither an available facility capability nor an
  approved outsourced fallback for a supposedly eligible presentation.
- Any Question Variant does not genuinely test the concept's narrow learning
  objective.
- Earlier-node feedback reveals the answer to a later scored node in the same
  case.
- A scored patient encounter contains fewer than one or more than three scored
  Decision Nodes.
- Two scored Decision Nodes in one patient encounter use the same primary
  Tested Concept.

Automated checks can exhaust finite profiles and deterministic decision tables.
They cannot prove the clinical meaning of arbitrary prose or an unrestricted
continuous range. Melissa's explicit clinical attestation remains required.
Twenty random previews supplement exhaustive profile and boundary tests; they
do not replace them.

### Sources, provenance, and approval

- Required source information is absent.
- A claim-level citation points to an unavailable or unapproved source record.
- Required exact revisions are not clinically approved by Melissa.
- An AI-created or AI-modified revision has unresolved provenance, an
  unverified citation, or any workflow state other than clinically approved.
- A draft, changes-requested, rejected, or archived revision is present in the
  runtime manifest.

### Availability, mastery, and repetition

- A concept has no eligible presentation.
- A core concept lacks at least two clinically meaningful mastery-eligible
  Patient Presentation Variants when two variants are required for mastery.
- A concept becomes due after unlock but has no eligible presentation at a
  later supported facility stage.
- A Patient Presentation Variant requires a capability absent from the
  campaign's compatible pinned balance release.
- Variant eligibility could prevent required content from appearing.
- Cosmetic changes can be miscounted as a new mastery variant or evade
  noncosmetic duplicate detection.
- Same-date remediation can repeat the same Patient Presentation Variant,
  Question Variant, and noncosmetic fingerprint combination or rely only on a
  cosmetic difference.
- Selection simulation shows supplemental content starving overdue or core
  content.
- A release would unexpectedly change a pinned campaign's mastery denominator.

When a release is proposed for existing campaigns, compatibility is evaluated
against each supported predecessor release. An automatic additive
classification also fails when:

- Any predecessor item revision is changed, removed, or redefined.
- An existing clinical concept changes meaning or lineage.
- New content requires an unavailable schema, mechanic, balance key, room, or
  progression rule.
- The predecessor campaign's core-concept denominator or eligibility changes.
- Supplemental material can starve required reviews or create an obvious
  reward exploit.
- An already-generated episode would need to change.
- The exact compatibility validator and migration versions are not recorded.

## Published releases

Published releases are immutable complete manifests of exact immutable item
revisions. Unchanged revisions may be referenced by several complete releases
without being copied or edited.

The runtime manifest contains only the approved material needed by the game.
Comprehensive knowledge-base narrative, internal notes, rejected drafts,
licensed source text, and AI prompts do not automatically ship to player
browsers.

Every runtime item retains its exact source, topic, concept, patient-variant,
template, constraint, Result Gate, Result Requirement, question, answer,
explanation, and Patient Learning Summary revision dependencies. A later Topic
Revision does not alter the item. Instead, a change-impact report flags
dependent material for review when an underlying fact changes. A material
correction follows the accepted withdrawal and correction process.

Campaigns keep one current complete clinical release rather than combining a
base release with an ordered expansion stack. A validated adoption edge records
which predecessor may advance, its compatibility classification, permitted
distribution modes, validator report, and migration version.

A campaign permanently retains its core-concept set and records every clinical
release adoption. Newly added concepts are supplemental for that existing
campaign and begin with no FSRS history. Generated episodes and scored reviews
retain their exact release and item-revision references.

### Withdrawal and correction

An append-only withdrawal targets exact immutable releases and item revisions.
It preserves reason, severity, trusted time, Melissa's approval, potential
effect on prior scoring, directive version, and supersession history.

The game never mutates frozen generated material. It suppresses ungenerated
content, bypasses undisplayed affected nodes without scoring, disables a visible
unanswered item, and preserves already-submitted responses.

A correction package includes:

- New Melissa-approved immutable item revisions
- A new complete clinical release
- A validated replacement or campaign-migration edge
- Historical-evidence classification
- Affected-release, campaign, and review identification
- FSRS repair behavior when evidence is invalid
- Mastery and availability-waiver behavior
- Player correction-notice wording
- Simulation, restoration, and audit tests

If an existing concept's meaning changes, the correction creates a new concept
identifier. It cannot redefine the old identifier.

## Reversibility and implementation risks

### RED: expensive to change after authoring begins

- Stable identity versus immutable revision model
- Clinical Topic, Tested Concept, Case Family, Patient Presentation Variant,
  Decision Node, Result Gate, and Question Variant boundaries
- Meaning of Patient Presentation Variant for mastery evidence
- Many-to-many Concept Presentation and question-compatibility relationships
- Typed slot, finite profile, value-set, and declarative constraint contract
- Earliest facility-stage and facility-capability eligibility model
- Separation of clinical result meaning/readiness from balance-defined service
  timing and route behavior
- Exact frozen Runtime Encounter and Runtime Scored-Decision payload
- Claim-level citation, provenance, approval, and release dependency model
- Separation between authoring AI and the live runtime

Changing these later would require workbook conversion, database migration,
admin-interface redesign, content revalidation, release migration, save and
review-evidence repair, and possibly reclassification of mastery history.

### YELLOW: manageable but meaningful rework

- Initial workbook tab layout and import mapping
- Required source minimums and clinical review cadence
- Which typed slot kinds and rule-builder operations appear in the first admin
  version
- Whether the vertical slice includes a multi-decision Case Family
- Exact recency windows and presentation weighting
- Initial topic taxonomy and optional external terminology mappings

### GREEN: inexpensive to adjust

- Default preview count, currently proposed as 20
- Topic-page tab order and visual layout
- Filter labels, help text, and field tooltips
- Optional cosmetic name and occupation lists

## No-PHI rule

- All patients are fictional.
- No user interface or administrator field should invite real patient details.
- Free-text administrator notes must display a no-PHI warning.
- Imported files must be reviewed for PHI before upload.
- Production logs must not capture free-text clinical drafts unnecessarily.

## Open content decisions

- Pilot concepts and categories
- Exact number of cases and variants
- Variant difficulty labels and eligibility
- Retired concept behavior in old campaigns
- Source minimums and review cadence
- Exact first facility-stage definitions, capability vocabulary, and
  result/service types
- AI authoring provider, data handling, cost, and source-use policy
