# Data Model Proposal

Status: PARTIALLY APPROVED. The Supabase-managed PostgreSQL foundation and
protected logical-domain separation are accepted in ADR 0008. The hybrid
relational and JSONB physical boundary is accepted in ADR 0019. The expanded
clinical entity relationships are accepted conceptually in ADR 0020; exact
tables, columns, indexes, and migrations remain unimplemented.

Last updated: 2026-07-25

## Principles

- Use stable opaque internal identifiers; names and display labels may change.
- Keep authentication identifiers separate from gameplay and learning records.
- Distinguish definitions from runtime instances.
- Distinguish mutable drafts from immutable releases.
- Pin every campaign to explicit versions.
- Use integer cents for money and explicit units for every duration and probability.
- Store trusted timestamps in UTC and preserve the confirmed IANA timezone,
  applied offset, and immutable derived learning date used for calendar-date
  mastery.
- Preserve provenance and approval history.
- Do not provide fields intended for PHI.
- Give every value one canonical owner; a JSONB snapshot may cache but may not
  compete with normalized immutable evidence.

The database implementation will use version-controlled PostgreSQL migrations,
row-level security for player-accessible records, trusted server-side functions
for sensitive transitions, and owner-controlled logical exports. Supabase Auth
with verified email and a conventional permanent password is accepted in ADR
0009; a long passphrase is encouraged as password-strength guidance.

Normalized PostgreSQL records own identity, authoring, releases, permissions,
audit, ledgers, frozen clinical references, and educational evidence. One
validated, versioned JSONB snapshot owns coherent rapidly changing operational
facility state. This accepted physical boundary is defined by
[ADR 0019](docs/adr/0019-hybrid-relational-and-jsonb-storage.md).

## Accepted physical storage boundary

Normalized tables hold every entity and relationship described in the
identity, clinical authoring, publishing, learning-evidence, finance, audit,
and frozen-runtime-clinical sections below. The JSONB campaign snapshot holds
the facility grid, room and employee operational state, queues, active task
progress, transient patient service state, clocks, random-stream state, and
other coherent facility simulation values.

When one operation affects both, a trusted transaction updates the snapshot and
appends normalized evidence together. The snapshot may reference normalized
IDs and cache reconciled totals, but it cannot rewrite their source records.

## Identity domain

### Account

Represents an authenticated pilot user through a hidden internal ID.

Relationships:

- One authentication identity
- One display profile
- Zero or more campaigns
- Zero or more optional manual feedback submissions

The account ID, not email, owns campaigns and records.

### Authentication identity

Contains or references the verified email and authentication-provider state. It is permission-separated from gameplay and learning data.

### Display profile

Contains the chosen display name and non-sensitive preferences such as the
confirmed IANA learning timezone and accessibility settings. Device detection
may suggest the initial timezone, but the player confirms it and device or
travel changes do not update it automatically.

### Learning-timezone change

Records the account, prior and new IANA timezone identifiers, trusted effective
UTC time, and authorized actor. Changes apply prospectively; no prior review's
derived learning date is recalculated. Self-service changes are rate-limited,
with the exact threshold remaining a lower-level setting.

## Clinical authoring domain

The entity names and relationships in this section are accepted under ADR 0020.
They implement separate but connected clinical knowledge-base and
runtime-teaching domains.

### Controlled vocabulary definition

Stable project-owned definition with an opaque ID, display label, and
description. The local authoring contract keeps separate definition sets for:

- Educational difficulty
- Clinical setting
- Concept-to-topic relationship type
- Facility stage, including an ordinal
- Deferred scope
- Source format
- Structured-fact type
- Distribution type
- Coverage classification

Authoring records store definition IDs rather than repeating mutable labels.
Foreign-key validation rejects unknown IDs, and definition IDs are unique
within each vocabulary.

### Coverage framework

Stable identity for one official curriculum outline and version, bound to one
exact Source Snapshot. It records the framework name, version label, and
trusted recording time; it does not own project coverage claims.

### Coverage framework node

Immutable source-defined node within one Coverage Framework. Stores the
external category ID, parent node when applicable, sibling ordinal, complete
category path, optional controlled source classification, exact citations, and
a note. Parent references must remain within the same framework and form an
acyclic hierarchy whose paths extend correctly.

### Topic coverage mapping

Project-owned many-to-many join between one Coverage Framework Node and one
Clinical Topic. The local beta stores a mutable Draft `missing`, `partial`, or
`complete` proposal, current-game eligibility proposal, optional deferred-scope
ID, author ID, update time, and note. A node/topic pair is unique. Review,
approval, and immutable mapping history remain required in the future
administrator before a mapping can enter a release.

Coverage reports derive only values represented by the current normalized
records. Question-Variant counts cannot be produced until that later authoring
layer exists. No counts are stored on this mapping because stored totals would
drift from their canonical records.

### Clinical topic

Stable parent identity for a diagnosis, procedure, complication, anatomy,
screening topic, resuscitation topic, or general principle.

Key normalized relationships:

- One stored current-working-revision pointer validated to equal the unique
  non-archived leaf
- Many immutable topic revisions
- One primary topic type and many optional tags
- Many aliases and optional external-code mappings
- Many typed self-relationships to other topics
- Many primary Tested Concepts
- Many additional related concepts through a join record

### Clinical topic revision

Exact revision containing the comprehensive narrative sections, provenance,
workflow state, and approval. An approved or published revision is immutable.

### Topic section

One typed section within a topic revision, such as pathophysiology,
epidemiology, presentations, evaluation, management, complications,
differentials, prognosis, or pearls and pitfalls. Long-form content remains
separate from runtime templates.

### Structured clinical fact

An exact revision-scoped claim with fact type, structured value or range, unit,
precision, population, context, applicability, exceptions, approval, and an
explicit flag distinguishing descriptive knowledge from scenario-approved use.

### Topic relationship

Typed many-to-many self-link between Clinical Topics. Examples include
`differential_of`, `complication_of`, `procedure_for`, `anatomy_related_to`,
and `screening_for`. Directionality and inverse display behavior are explicit.

### Tested concept

Stable FSRS-card identity with:

- One primary Clinical Topic
- One narrow learning objective
- Required earliest facility-stage definition
- Stable lineage
- Many immutable revisions
- Many related-topic links
- Many typed confusion links to other concepts
- Many Patient Presentation Variants through Concept Presentation Links
- Zero or more core-concept-set memberships

`earliest_facility_stage` is an unlock reference, not educational difficulty.
It references a stable Facility Stage Definition from a compatible balance
release. Once the concept has an FSRS card, later-stage presentation coverage
must keep it reviewable.

### Concept related-topic link

Many-to-many join between a Tested Concept and additional Clinical Topics. It
stores both the related Topic ID and a controlled relationship-type ID, such as
related topic or differential, and never changes the concept's one primary
topic. The primary topic cannot be repeated as a related-topic link, and each
relationship-type/topic pair is unique for the concept.

### Concept confusion link

Typed self-referential many-to-many link between Tested Concepts for authoring,
selection, and contrast. It does not join their FSRS histories.

### Case family

Stable identity for a coherent fictional episode. It owns ordered Decision
Nodes and Patient Presentation Variants and may link to several topics.

### Patient presentation variant

Stable clinically meaningful mastery-presentation identity within one Case
Family. Its revisions preserve setting, presentation role, answer-essential
facts, required findings, stage and capability eligibility, sources, review,
and approval.

Cosmetic runtime changes never create a new variant identity. A material change
that represents a different mastery exposure creates a new stable variant
instead of relabeling the old one.

### Patient learning summary revision

Required immutable post-completion summary for each scored clinical Patient
Presentation Variant revision. Stores the clinical conclusion; diagnosis and
management or next steps when applicable; pearls or pitfalls; compatible
template-slot references; claim-level citations; clinical approval; and
workflow state. It is unscored and is included in a runtime release only
through exact revision membership.

### Concept presentation link

Many-to-many join between Tested Concept and Patient Presentation Variant. It
stores presentation role, concept-specific rationale, mastery eligibility,
remediation eligibility, approval, and exact compatible revisions.

### Scenario template revision

Immutable approved template belonging to one Patient Presentation Variant. It
contains narrative fragments and references typed Template Slots. It contains
no executable code or unrestricted runtime free text.

### Template slot

Stable slot identity within a template revision. Stores:

- Cosmetic, clinically constrained, or locked safety class
- Typed value kind
- Unit, precision, and grammar metadata
- Approved value-set or fixed value
- Whether it participates in the noncosmetic repetition fingerprint

### Approved value set and value

Defines enumerated values or a bounded numeric domain. Individual values may
carry author-approved scenario weights and rationale. These weights are
separate from Structured Clinical Fact prevalence.

### Clinical instantiation profile

Finite approved bundle of linked clinical slot values and constraints. It is
the preferred representation for clinically interdependent demographics,
anatomy, pregnancy status, risk factors, findings, vital signs, and laboratory
patterns.

### Constraint rule

Declarative, revisioned `requires`, `excludes`, `only_when`, range, membership,
or paired-value rule. Stores a human-readable explanation and validator
version. Arbitrary script text is prohibited.

### Facility capability definition reference

Stable balance-defined capability such as a service or operational ability.
Patient Presentation Variants link many-to-many to required capabilities.
Compatibility validation proves every reference exists in a supported
campaign's pinned balance release.

### Decision node

Ordered scored or unscored decision within one Case Family. Every scored node
references exactly one primary Tested Concept. A patient encounter contains one
to three scored nodes, and no two scored nodes within it use the same primary
concept. Supporting tags never update another concept's card or mastery.

### Result gate revision

Optional immutable authored transition within a case before terminal
completion. Stores ordered Result Requirement revisions, readiness rule, the
next node or terminal transition, whether completion needs player action,
permitted service routes, capability policy (`hard_required` or
`in_house_preferred_with_fallback`), compatible presentation/profile
references, clinical approval, and sources. No operational duration is stored
here.

### Result requirement revision

One exact approved result within a Result Gate. References a stable
balance-defined result/service type and freezes its clinical payload or
compatible constrained template. The same clinical result must be produced by
every permitted operational route.

### Question variant

Stable alternative under one Decision Node. Its immutable revisions contain
stem template, answer mode, explanation, shuffle policy, sources, approval, and
recent-use metadata. It inherits exactly one primary concept through its node.

### Question-presentation compatibility

Many-to-many join between a Question Variant revision and compatible Patient
Presentation Variant or Scenario Template revisions. It can add profile and
slot restrictions so the runtime never combines independently valid but
mutually incompatible content.

### Answer choice

Ordered child of one Question Variant revision. Stores exact wording,
correctness, choice-specific rationale, and shuffle-group or fixed-position
behavior.

### Terminal outcome disposition

Immutable reviewed mapping for one incorrect Answer Choice on a final scored
Decision Node plus one compatible Patient Presentation Variant or finite
Clinical Instantiation Profile. It stores either
`no_terminal_outcome` or one exact Terminal Clinical Outcome Revision. A unique
constraint permits exactly one disposition per compatible tuple.

### Terminal clinical outcome revision

Exact sourced, clinically approved, unscored terminal vignette with stable
parent identity, `minor` or `major` clinical severity, causal-framing type,
clinical rationale, narrative template, compatible typed slots and profiles,
citations, AI provenance, workflow state, and immutable revision history. It
contains no balance amount, scheduler rating, XP rule, or mastery effect.

### Source

Stable bibliographic identity with title, publisher or journal, link or
identifier, edition or publication date, source type, and relevant licensing
notes. Retrieval/access time belongs to each exact Source Snapshot. Full
copyrighted source text is not presumed safe to store or send to an AI
provider.

Each Source owns one explicit rights-review record containing status, note,
reviewer, review time, basis, and independent permission booleans for private
storage, local processing, external-AI transfer, public source-text reuse, and
publication of project paraphrases. `review_required` is default-deny for all
five uses; permissions are never inferred from a source type or URL.

In the schema-v2 beta, this embedded review is treated as immutable and every
permission-dependent content citation, Practice Inbox capture, AI suggestion,
or started extraction must occur no earlier than its `reviewedAt`. The
production authoring model still requires append-only rights-decision records
with stable IDs, effective times, grants/revocations, and an exact decision
reference on each authorized operation. That work is required before
substantial extraction or publication. Snapshot acquisition or metadata
registration may predate the review, but that earlier timestamp grants no
processing, transfer, reuse, or publication permission.

### Source snapshot

Immutable retrieval of one Source, identified by stable snapshot ID, exact
retrieved URL, retrieval time, upstream modification signal when available,
format, access scope, and content checksum. Citations, coverage frameworks,
capture-inbox items, and extraction batches bind this exact snapshot rather
than a mutable versionless URL. The snapshot stores provenance metadata, not a
presumption that the retrieved copyrighted artifact may be committed or
redistributed. Every actual retrieved artifact requires a lowercase SHA-256;
only metadata-only and explicitly synthetic-fixture snapshots may omit it.

### Extraction batch

Resumable processing record for one exact Source Snapshot and bounded source
range. It records method and tool version, input fingerprint, unit counts,
checkpoint, outputs, contemporaneous conflicts, errors, start/update/completion
times, and human-review state. A batch cannot predate its snapshot. Every
listed revision output must be created within the batch window, cite the exact
processed snapshot, and point back to the batch when its provenance is not
manual. A listed conflict must occur on at least one Structured Fact revision
emitted by that batch. Framework nodes and Topic Coverage Mappings remain
ineligible as batch outputs until they gain exact import provenance.

### Citation

Claim-specific many-to-many join from an exact Source snapshot to an exact
topic section, structured fact, concept, patient-variant, Result Gate or
Requirement, Patient Learning Summary, question, answer, explanation, or
Terminal Clinical Outcome revision. Stores supported claim, locator, and
author verification state. It also records whether the target uses
bibliographic metadata, project paraphrase, source excerpt, or synthetic
content. Human verification and conflict-identification states require a
verifier ID and time. A Citation cannot predate its Source Snapshot. Clinical
approval requires a human-verified content-bearing citation recorded and
verified no later than approval; bibliographic metadata alone is insufficient.
These fields support audit and rights validation; the local beta still cannot
authenticate those IDs or enforce approver roles.

### Content revision

Shared revision envelope or equivalent per-entity fields containing stable
identity, revision ID, parent revision, `authorId`, trusted time, workflow
state, change summary, provenance, and immutable status. Parent references
must belong to the same stable entity, cannot form cycles, and cannot point
from an older child to a newer parent.

For Topic revisions, Structured Clinical Facts, Tested Concepts, and Practice
Question Inbox items, every stable entity that has a non-archived revision has
exactly one non-archived leaf. This gives the editor one unambiguous current
working branch without discarding archived history. Published relationships
always reference exact revision IDs rather than `latest` or the current leaf.

Current conflict reporting uses only the unique active Structured Clinical Fact
leaves, while historical extraction batches retain the conflicts that were
unresolved when that batch completed. A separate append-only
conflict-resolution record with reviewer, rationale, and selected evidence is
deferred and required before substantial extraction or publication.

### Clinical approval

Append-only approval or revocation record tied to one exact revision, reviewer,
trusted time, checklist version, and scope. Topic approval never implicitly
approves derived runtime items. Only Melissa can provide pilot clinical
approval.

The local beta validates approval-record shape and references only; it has no
authenticated identity or role registry. The protected administrator and
publisher must enforce Melissa's role before any approval has authority.

### AI authoring job

Append-only provenance for one administrative drafting request. Stores
requester, provider/model and configuration, prompt-template version, exact
input revision IDs, output, trusted times, and disposition. Its output can
create only a Draft revision and has no approval or publishing authority.

## Published-content domain

### Clinical release

An immutable numbered, logically complete manifest of exact clinical item
revisions with schema version, validation result, approver, timestamp, and
checksum. Several releases may reference the same unchanged immutable item
revision without duplicating or editing it.

The runtime bundle contains only approved player-required material. It does not
automatically include comprehensive topic narratives, internal notes, rejected
drafts, AI prompts, or licensed source text.

### Clinical-release item membership

Many-to-many join from a Clinical Release to exact approved revisions of
concepts, case families, patient variants, templates, profiles, constraints,
decision nodes, Result Gates, Result Requirements, questions, answers,
explanations, Terminal Outcome Dispositions, Terminal Clinical Outcomes,
Patient Learning Summaries, and allowed citations. Relationship rows preserve
dependency role and manifest ordering where needed.

### Publication validation report

Immutable report containing validator versions and results for structural
integrity, constraint satisfiability, profile and boundary coverage,
answer-invariance checks, source and approval completeness, mastery-variant
coverage, facility-stage availability, repetition simulation, dependency
closure, and predecessor compatibility.

### Clinical-release compatibility edge

A directed record from one complete clinical release to a later release. Stores
the compatibility classification, allowed adoption modes, validator report and
version, migration version, approver, and checksums. Compatibility is never
inferred merely because release numbers are consecutive.

### Core-concept set

The exact concept identifiers used for a campaign's mastery denominator. It remains stable for that campaign.

### Emergency withdrawal

Append-only safety directive targeting exact release and item revisions. Stores
reason, severity, trusted effective time, Melissa's approval, prior-scoring
impact classification, directive version, status, and supersession history. It
prevents new selection without altering the historical release.

### Clinical correction package

References the withdrawal, new approved item revisions, new complete clinical
release, replacement or migration edge, affected releases and campaigns,
historical-evidence classification, FSRS repair version, availability-waiver
rules, player notice, validation report, approver, and checksums.

### Review-validity annotation

Append-only record associated with an immutable review. Classifies the original
evidence as still valid, invalid, or affected by a concept redefinition and
records the clinical authority, correction package, reason, and trusted time.
It never changes the submitted answer or original scheduler transition.

### Learning-state repair

Versioned transaction that replays remaining valid review history through the
campaign's pinned scheduler when invalid evidence contaminated current state.
Stores excluded review identifiers, replay input checksum, prior and rebuilt
card states, prior and recalculated mastery status, operation identifier,
migration version, approver, and trusted time.

### Core-concept availability waiver

Audited temporary gate treatment used only when publisher withdrawal leaves a
core concept with no valid presentation. It retains the concept in the fixed
denominator, does not mark mastery or enable APP automation, identifies affected
gates, and preserves previously completed outcomes when it closes
prospectively.

## Balance domain

### Balance key

A stable, documented identifier with value type, unit, default, validation range, explanation, and category.

### Balance release

An immutable numbered set of balance values and referenced game definitions.

### Facility-stage definition

Defines accomplishments, XP requirements, satisfaction threshold, unlocks, and dependencies.

### Room-type definition

Defines footprint rules, allowed doors, build requirements, capacities, work areas, upgrade track, modifiers, and costs.

### Staff-role definition

Defines permitted tasks and work areas, salary rules, training track, capacity, and operational modifiers.

### Task definition

Defines requirements, duration, priority rules, outcomes, and eligible staff or rooms.

### Result/service definition

Stable operational definition referenced by clinical Result Requirements.
Stores display label, facility-time base turnaround, approved outsourced and
in-house routes, required capabilities, eligible tasks/staff/rooms, capacity
and queue modifiers, cost or revenue effects, required ETA format/precision
policy, and optional bounded seeded-variation settings. The pilot begins with
variation disabled.

### Event definition

Defines eligibility, probability unit, cooldown, guarantees, outcomes, and whether it is progression-critical.

## Campaign domain

### Campaign

Owned by an account and permanently pinned to:

- Core-concept set
- Balance release
- Save-schema version
- FSRS integration version
- FSRS package and algorithm versions
- FSRS resolved parameter-set version
- Randomness-contract version
- 128-bit campaign root seed

The campaign also stores an initial and current clinical release. The current
clinical release can advance only through a validated compatibility edge and an
audited adoption transaction; this does not alter any permanent pin above.

A campaign has an explicit lifecycle state such as active or archived. Start
Over archives the original read-only and creates a new campaign ID with the
same seed and permanent pins but fresh operational and campaign-learning state.
The retry uses the original campaign's current clinical release as its initial
clinical release. Restoring an archive resumes that campaign and its adoption
history; histories never merge. Permanent deletion is a separate
retention-policy operation.

### Campaign clinical-adoption record

Immutable record of prior and new clinical releases, trusted adoption
timestamp, automatic/player-approved/administrator-initiated mode, actor or
protected process, campaign revision, unique operation identifier, and the
compatibility validator and migration versions used.

### Campaign concept membership

Identifies whether a concept is part of the campaign's permanently pinned core
set or was added later as supplemental content. A newly adopted supplemental
concept begins with no FSRS history and cannot become a new mastery,
progression, inspection, or victory requirement for that campaign.

### Campaign snapshot

Captures validated current operational state, save-schema version, and an
increasing revision number. A snapshot is written transactionally with any new
immutable review or money evidence. Tested sequential migrations preserve the
previous snapshot if conversion fails.

One device at a time holds a campaign writer lease. Expected-revision checks
reject stale saves, explicit takeover revokes the prior writer, and automatic
merge or last-write-wins behavior is prohibited. A bounded local recovery copy
never supersedes acknowledged cloud state.

During the private pilot, the active browser computes the proposed operational
snapshot through the pinned deterministic simulation. The server validates
ownership, writer lease, expected revision, idempotency, version references,
shape, trusted evidence, and basic invariants before accepting it. The snapshot
must preserve exact logical facility time and enough versioned simulation and
randomness state to continue reproducibly. The server does not continuously
run the facility or certify every ordinary client action.

### Random stream state

For each initialized stable stream, stores its randomness-contract version,
stream identifier, exact four-word `xoshiro128**` state, draw counter, and
snapshot revision. The root seed derives initial states through the contract's
canonical SHA-256 procedure; it does not replace persisted current state.

Durable generated entities store their selected outcomes rather than drawing
again when reopened. Material random events may also store stream identifier
and draw counter as operational save provenance. These fields support
restoration and defect diagnosis and are not gameplay analytics.

### Room instance

References a room-type definition and records placement, construction, upgrade, condition, cleanliness, capacity, and occupants.

### Employee

References a staff-role definition and records salary, morale, training, home room, work permissions, task queue, and current task.

### Runtime encounter instance

Represents one instantiated fictional patient encounter. At generation it
freezes:

- Current clinical release and exact item revision IDs
- Tested Concept, Concept Presentation Link, Case Family, Patient Presentation
  Variant, Scenario Template, Clinical Instantiation Profile, Decision Node,
  Result Gate, Result Requirement, Question Variant, Answer Choice,
  explanation, Terminal Outcome Disposition, any Terminal Clinical Outcome,
  Patient Learning Summary, and constraint revisions
- Every chosen slot value and its safety class
- Exact rendered patient text, stem, answer-choice order, correct-answer
  mapping, explanation, and applicable terminal-outcome text, severity, causal
  framing, and citations
- Campaign randomness-contract version, relevant stream identifier and
  counters, generation seed provenance, and canonical checksum
- Noncosmetic repetition fingerprint
- Facility stage, required-capability eligibility, and generation time

The normalized instance owns frozen clinical identity and audit fields. The
JSONB operational snapshot may reference the encounter ID and own transient
queue, location, service-progress, and operational state.

A later clinical adoption cannot mutate the instance. Withdrawal may mark it
for unscored bypass or cancellation under ADR 0016 while preserving the frozen
payload.

The operational encounter snapshot has one canonical `workflow_state`:

- `waiting_unopened`
- `active_action_required`
- `active_pending_result`
- `resolved_summary_available`
- `resolved`

Opening a Waiting chart advances it to the appropriate Active state even while
the panel remains open. The Waiting, Active, and Resolved lists and the
action-required exclamation point are derived from `workflow_state`; they are
not separately writable flags.

The snapshot also preserves the current Decision Node, pending-result gate
identifier, scheduled-result event IDs, statuses, and due facility-time ticks,
deferred-feedback state, terminal-feedback presentation state, completion and
resolution timestamps, and terminal resolution reason. Terminal presentation
state includes `terminal_feedback_required` and an idempotent
`terminal_feedback_acknowledged` operation when an incorrect final answer has
corrective or outcome content. Because chart attendance suppresses one delay
consequence,
the snapshot owns one `attended_encounter_id` as simulation interaction state;
`open_chart_panel_id`, panel geometry, animation, and scroll position remain
presentation/navigation state. At most one encounter is attended; it belongs
to the campaign and is in an unresolved Active state. A Resolved/History chart
never grants an attention exemption. Attendance cannot override encounter
workflow truth.

The exact derived folder mapping is `waiting_unopened` to Waiting;
`active_action_required`, `active_pending_result`, and
`resolved_summary_available` to Active; and `resolved` to Resolved. Only
`active_action_required` displays `!`. The summary-available state instead
displays an accessible Complete or Summary Available label.

While `waiting_unopened`, the snapshot stores the patience start tick,
departure due tick, stable departure-event ID, warning bands already emitted,
and tutorial-exemption flag. First chart opening stores `first_opened_tick`,
cancels the departure event, sets attendance, and advances atomically through a
compare-and-set. If Open and departure share a tick, the documented event
priority applies Open first; a stale Open after committed departure is rejected.
The final warning due tick must precede departure by a positive, observable
facility-time interval at every supported speed.

Waiting abandonment transitions to `resolved` with
`resolution_reason = left_before_seen`. The read-only entry preserves its
operational arrival, warning, and departure history but renders no unanswered
clinical payload, answer, explanation, or Patient Learning Summary. It creates
no Concept Presentation Exposure, Review Record, Mastery Evidence, clinical XP,
or completion-revenue entry. Departure, queue/resource release, and transition
are idempotent and bypass generic encounter-completion settlement.

Active state may store `action_ready_since_tick`, operational-delay and
response-grace threshold IDs already applied,
`response_delay_accrued_ticks`, `response_delay_unattended_since_tick`, and the
patient-level satisfaction-consequence total and cap. Each threshold
application has a unique operation ID. Open, close, and chart-switch commands
atomically settle the prior patient's accrued unattended time and update the
attended encounter under the writer lease; a switch has no intermediate gap.
Attendance suppresses response-delay accrual for that patient only. If a result
becomes action-ready while its chart is attended, response accrual begins
suspended. Operational result-delay accrual remains independent and references
the frozen service target or ETA. Refresh or device takeover restores and shows
a valid attended chart while paused, or clears attendance at the unchanged
facility tick before Resume. Stale-writer attention commands fail lease and
revision checks. All delay accrual and attendance stop at
`resolved_summary_available`, and answer-related plus delay-related
satisfaction effects share the patient-level cap.

### Clinic workload and arrival gate

`clinic_workload_occupancy` is a derived count of encounters in
`waiting_unopened`, `active_action_required`, or `active_pending_result`.
`resolved_summary_available`, `resolved`, and `left_before_seen` do not count.
Opening a chart is count-neutral; terminal completion or departure releases a
slot in the same transaction as its workflow transition. If an effective
capacity decrease puts occupancy above the limit, existing encounter records
remain unchanged.

The campaign-pinned balance release defines the stable
`routine_workload_limit` inputs and `critical_reserved_slots`. Effective
capacity is derived deterministically from current functioning rooms, staff,
upgrades, and resolved modifier IDs. Routine admissions cannot consume the
protected reserve. A protected guarantee that cannot yet be admitted remains
pending; a progression-critical encounter that leaves unseen does not satisfy
that guarantee.

Each admitted encounter stores its arrival class
(`routine`, `tutorial`, or `progression_critical`), any protected guarantee ID,
and the admission operation ID. The campaign snapshot preserves the protected
guarantee's pending or satisfied state so departure, retry, and reload cannot
lose or duplicate it.

The campaign snapshot stores one routine-arrival gate with remaining
facility-time ticks, blocked status and start tick, stable event/operation ID,
routine-arrival definition ID, and any already-consumed randomness provenance.
The gate pauses before clinical selection or patient instantiation when
routine capacity is full, resumes once when eligible, and cannot accumulate a
catch-up backlog. Occupancy is rederived and capacity is revalidated on load.
Admission uses writer-lease, expected-revision, capacity, and idempotency
checks.

A pending transition owns one result gate and one or more unresolved scheduled
result/service events or queued service requests. A gate with no remaining
work advances immediately rather than persisting in `active_pending_result`.
Each event stores a stable operation ID, originating encounter and node, due
facility-time tick, delivery status and time, and expected-state guard. It also
stores the selected route, exact result/service-definition version, applied
modifier IDs and resolved inputs, effective integer duration, scheduled tick,
due tick, and any named-stream draw provenance. ETA is derived from the
authoritative due and current facility ticks rather than stored as another
clock. The authored gate defines whether all or a specified subset of results
must arrive before the next node becomes ready. Event delivery and lifecycle
advancement commit atomically.

Node completion, reward settlement, and review creation are idempotent so
refresh or retry cannot duplicate them. Settlement is uniquely keyed by
encounter and settlement type; review evidence is uniquely keyed by
scored-decision instance.

For an incorrect nonfinal node, the frozen correct transition determines the
next state. For an incorrect final node, the frozen disposition
deterministically provides `no_terminal_outcome` or one exact rendered outcome.
The terminal view presents any outcome and correction before filing, releases
safely deferred feedback, requires one persisted acknowledgment, and then
offers the summary. The acknowledgment creates no second decision or
educational evidence.

The frozen payload includes the exact rendered, clinically approved
post-completion diagnosis-and-management summary and its source revision IDs.
It never reads mutable Draft topic notes. Terminal outcome and summary viewing
are unscored, read-only educational presentation and remain reproducible from a
reopened Resolved chart.

### Runtime scored-decision instance

One exact scored or unscored decision inside a Runtime Encounter Instance.
Stores the single primary concept, displayed answer order, first submitted
choice, correctness mapping, Again/Good mapping when scored, review-evidence
identifier, answer timestamp, terminal-node flag, resolved Terminal Outcome
Disposition and outcome revision when applicable, and publisher-correction
status.

Only the first scored submission updates its one Tested Concept. Practice,
explanation viewing, and APP automation use distinct event types.

### Concept-presentation exposure

Operational learning record keyed by campaign, concept, Patient Presentation
Variant, Question Variant, noncosmetic fingerprint, and time. It supports
mastery-variant evidence and recent-repetition avoidance without treating
cosmetic changes as new clinical exposures. It is gameplay state required for
scheduling, not optional analytics.

Creation occurs when the learner first opens and is actually shown the clinical
presentation, not when the encounter is generated or enters Waiting. Therefore
`left_before_seen` never creates exposure evidence.

### Runtime task

References a task definition and records queue, eligibility, assignment, progress, and completion.

### Money ledger entry

Records each economic change with integer amount, reason code, facility time, and related entity. Current cash is derived or reconciled from the ledger.

### Progression state

Records XP, satisfaction, objectives, facility stage, accomplishments, unlocks, and level-up attempts.

### Inspection attempt

Records eligibility snapshot, scoring-rule version, component scores, recognition tier, and completion date.

## Campaign learning domain

### Concept card

One card per campaign and concept. Stores a project-owned canonical card state,
current due time, current interval, and the campaign-pinned scheduler
integration reference. Library-specific state is contained at the scheduler
adapter boundary rather than exposed throughout the game.

A concept's required earliest facility stage controls when it may first create
an encounter and active card. Once review history exists, stage progression
cannot delete or reset the card; at least one later-stage-compatible
presentation must remain available.

### Review record

Immutable record of the first scored response, including concept, case and
clinically meaningful Patient Presentation Variant, Runtime Encounter Instance,
Runtime Scored-Decision Instance, correctness, Again/Good rating, UTC timestamp,
pre-review and
post-review card states, resulting due time, and the scheduler integration,
package, algorithm, and parameter versions used. A unique operation identifier
prevents a retried network request from applying the same review twice. A
review-kind field distinguishes an ordinary eligible encounter from the one
permitted same-date remediation encounter so the limit is reproducible and
auditable. The record also preserves the confirmed IANA timezone identifier,
UTC offset applied at the review instant, immutable derived learning date,
clinical release active when the episode was generated, and exact scored
decision, template, profile, question, answer-order, and explanation revisions
seen.

### Mastery evidence

Derived from review history, distinct calendar dates, distinct clinically
meaningful Patient Presentation Variant identities, and current interval.
Names, pronouns, ages within one approved profile, Question Variants, and other
cosmetic instantiations do not manufacture distinct mastery variants. A cached
mastery flag may exist but must be reproducible.

### Non-review educational event

Separately records optional practice, explanation viewing, or APP automation when operationally useful. It must not alter FSRS.

## Operational records

Only essential security/error records are authorized. No gameplay telemetry is currently authorized.

Security/error records should minimize personal data, use a documented retention period, and not become a hidden playtest analytics system.

Runtime encounters, scored decisions, concept cards, review records, and
presentation-exposure history are required game/save state rather than optional
analytics. They are not authorized for research export or behavioral
measurement.

## Accepted foundational clinical boundaries

ADR 0020 accepts:

- The dual-purpose clinical knowledge-base and runtime-teaching hierarchy
- The stable meaning of Patient Presentation Variant for mastery
- Typed slots, finite profiles, and declarative constraint representation
- Facility-stage and capability availability relationships
- Result Gate and Result Requirement identities, including hard capability
  versus approved outsourced-fallback semantics
- Separation of clinical result truth from balance-defined service timing,
  route, queue, capacity, and cost
- The exact runtime-instantiation freeze and provenance boundary

ADR 0030 additionally accepts Terminal Outcome Disposition and Terminal
Clinical Outcome identities, deterministic final-wrong-choice mapping, and
separation from operational penalties.

Exact physical table and column names, indexes, administrator presentation,
import mappings, and migration mechanics remain lower-level design work. They
must preserve these accepted identities and boundaries.

Exact snapshot fields, writer-lease duration, connection-loss grace period, and
wording of the already-approved takeover warning remain lower-level decisions.
