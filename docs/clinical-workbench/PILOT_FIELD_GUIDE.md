# Clinical Authoring Pilot Field Guide

Status: reversible beta contract. This guide supports a small workflow trial;
it does not publish content or finalize the future administration interface.

## Record sequence

Create records in this order:

1. **Controlled Vocabulary Definitions** - stable IDs and readable labels for
   difficulty, clinical setting, concept-topic relationship, facility stage,
   deferred scope, source format, fact type, distribution type, and coverage
   classification. Content rows reference these IDs rather than inventing
   labels.
2. **Source** - stable bibliographic identity: title, edition, publisher,
   source type, scope, and explicit rights review.
3. **Source Snapshot** - exact retrieved artifact: URL, retrieval timestamp,
   upstream modification timestamp, format ID, access scope, and checksum.
4. **Coverage Framework** - an identified ABSITE or SCORE outline snapshot.
5. **Coverage Framework Node** - one exact cited node in that framework's
   hierarchy. The node preserves the official structure without asserting that
   one project-owned topic covers it.
6. **Clinical Topic and Topic Revision** - the stable topic identity plus
   sourced narrative sections and an authored revision lineage.
7. **Topic Coverage Mapping** - a project-owned many-to-many Draft join from
   one framework node to one Clinical Topic. It records a working proposal,
   author, and update time; it is not reviewed or publishable. Do not create
   placeholder mappings merely to copy an entire outline.
8. **Structured Clinical Fact** - one claim with a typed value, population,
   context, applicability, exceptions, scenario-use status, and exact
   citations.
9. **Tested Concept** - one narrow learning objective and one primary Clinical
   Topic. This is the future identity of one campaign-scoped FSRS card.
10. **Practice Question Inbox item** - Melissa's paraphrased tested point,
    answer summary, notes, uncertainty, and exact private source locator.
11. **Extraction Batch** - resumable processing range, input fingerprint,
    checkpoint, output records, conflicts, and review state. The canonical
    schema supports this record, but CSV v1 does not author or edit it.
12. **Evidence Gap** - one exact clinical question, why the answer is needed,
    target record IDs, acceptance criteria, preferred source types, literal
    provider queries, and search-refresh cadence. This is maintained in the
    separate local Clinical Context Workbench.
13. **Search Run and Candidate** - an immutable metadata-search receipt and
    unscreened bibliographic result. A Candidate is not a Source, Citation,
    clinical conclusion, or approval.
14. **Evidence Contribution** - a reviewed project-authored statement linked
    to exact human-verified Citations and classified as supporting,
    challenging, qualifying, or contextual. Explicit clinician opinion uses a
    separate record type.
15. **Synthesis Decision and Content Change Proposal** - the reviewer accepts,
    narrows, rejects, defers, or requests more evidence before a separate
    proposal enters ordinary clinical authoring. Neither record publishes.

Create claim-specific **Citation** records alongside their target records.
Each Citation binds an exact Source Snapshot to an exact target and locator.

One framework node may map to many Clinical Topics, and one Clinical Topic may
map to many ABSITE or SCORE nodes. Coverage status belongs to each mapping.
Reports may derive topic, fact, concept, and source values represented by the
current normalized records; do not type duplicate totals into mapping rows.
Question counts remain unavailable until Question Variant authoring is added.

Patient Presentation Variants, Decision Nodes, Question Variants, information
sheets, release manifests, and runtime publishing remain the next layer. They
are not represented by shortcuts in this first contract.

## Separate classification axes

Never use a single `level` field for all classification. A Tested Concept keeps
these independent:

- `educationalDifficultyId` - expected knowledge or learner stage;
- `earliestFacilityStageId` - earliest game-facility level at which it may
  appear;
- `requiredClinicalSettingIds` - clinic, ambulatory surgery, emergency
  department, ward, ICU, or another reviewed vocabulary value;
- `currentGameEligibility` - unclassified, eligible, deferred, or excluded;
- `deferredScope` - the future setting or expansion and a plain-language
  reason.

The temporary `unclassified` vocabulary is not a clinical judgment. It exists
so collection can begin without quietly converting an AI recommendation into
an owner-approved classification.

Related topics are typed links, not an unlabelled list. Each one records a
`topicId` and a controlled `relationshipTypeId` such as a related topic or
differential relationship. Do not repeat the concept's primary topic in that
list.

## Revision rules

- Every revision records `authorId`, creation time, provenance, workflow state,
  change summary, and its parent revision when it has one.
- A parent must be an earlier revision of the same stable entity.
- Revision histories cannot contain cycles.
- Each topic, fact, concept, and inbox item with active work has exactly one
  non-archived leaf. Archive an abandoned branch rather than leaving two
  competing current versions.
- Approvals and releases refer to exact revision IDs, never an implicit
  `latest` record.

## Citation and conflict rules

- Cite the exact Source Snapshot and exact claim-bearing record.
- Classify Citation use as bibliographic metadata, project paraphrase, source
  excerpt, or synthetic content. Public-safe validation applies the matching
  rights permission.
- Human-verified and conflict-identified Citations record verifier and time.
- An actual retrieved artifact requires a SHA-256 checksum. A metadata-only
  record must stay explicitly metadata-only.
- A Topic Section has its own stable ID; a topic-level bibliography is not a
  substitute for section-level support.
- Preserve conflicting facts separately under one conflict-group ID.
- An unresolved conflict stays descriptive and cannot drive a scenario.
- Only human-verified citations can support clinically approved material.
- AI-assisted batches can emit Draft revisions only and must retain the batch
  ID in provenance.
- Framework nodes and coverage mappings cannot be listed as extraction-batch
  outputs until their exact import provenance is represented.
- A batch cannot predate its exact Source Snapshot. Every listed revision
  output must be created inside the batch window and cite that exact snapshot.
- A conflict listed by a batch must appear on at least one Structured Fact
  revision emitted by that batch; unrelated historical conflicts cannot be
  borrowed into its audit record.

## Source rights and private-data boundary

Rights are reviewed per Source, with a reviewer, review time, basis, and
separate yes/no permissions for:

- Private storage
- Local processing
- Transfer to an external AI provider
- Public reuse of source text
- Publication of an original project paraphrase

`review_required` means no to every use until a human records a different
review. Permission in one category never implies permission in another.

The embedded Source review remains the schema-v2 registration summary. The
Clinical Context Workbench now adds an append-only operation ledger with stable
decision IDs, effective/expiration times, supersession, a fingerprint of the
exact decision used, legal/license conditions, and distinct permissions for
metadata, private storage, extraction, indexing, external AI, derived content,
paraphrase publication, source-text reuse, runtime redistribution, and
commercial distribution. Effective permissions default to deny. Revoking or
narrowing a decision appends a successor; it never edits history or revives an
older grant after a later decision expires.

Snapshot metadata may predate a rights decision, but it grants no storage,
processing, reuse, clinical approval, or publication permission. Every private
intake operation also requires an affirmative no-PHI/local-processing
acknowledgment and binds its manifest to the exact rights-decision hash.

Raw textbook files, commercial question-bank references, workbook exports,
owner notes, and extraction outputs belong only in ignored local/private
directories. Back them up to a separate owner-controlled private and encrypted
location. The public GitHub repository is not a backup destination for these
materials, even when a file contains only a "temporary" draft. Only schemas,
public-safe metadata, and deliberately synthetic fixtures belong in Git.

## Safe first pilot

1. Run `npm run clinical:workbook:init` to create the ignored CSV interchange,
   or copy the blank canonical-JSON template into `.clinical-workbench/`.
2. Open the local Clinical Context Workbench and create one or two precise
   Evidence Gaps for the bounded pilot.
3. Scout bibliographic metadata, screen Candidates, and register only Sources
   that warrant full review.
4. Register one legitimately obtained source and one exact chapter or section
   snapshot; record the operation-specific rights decision before private
   intake or extraction.
5. Create 5-10 Topic shells, but fully develop only one or two.
6. Capture Melissa's original paraphrased takeaways while she studies.
7. Verify exact Citations, preserve conflicts, and accept or reject Evidence
   Contributions before drafting scenarios.
8. Validate after every small batch and retain the last completed locator.
9. Make a private encrypted backup of the workbook and source checkpoint.
10. Review whether the fields, queues, and Known-versus-needed brief are
    comfortable before adding patient and question authoring.

G-002 remains the only owner choice needed before real Level 0/1 integration:
which first topic and smallest concept set should validate the full workflow.

## What validation does not prove

Structural validation cannot determine whether prose was copied, a clinical
claim is correct, a license permits reuse, or a patient detail is PHI. Keep
raw sources and private notes in ignored local directories, paraphrase
commercial question-bank takeaways, and require human rights and clinical
review before anything is tracked or published. A successful validation does
not make a workbook or source file safe to commit to this public repository.
The beta validates audit-ID shape, not real identity or role membership; only
the future protected administrator can authenticate Melissa's clinical
approval. Conflict resolution currently uses successor fact revisions; an
append-only resolution record with reviewer and rationale is required before
substantial extraction.
