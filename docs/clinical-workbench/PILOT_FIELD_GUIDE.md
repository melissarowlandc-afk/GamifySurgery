# Clinical Authoring Pilot Field Guide

Status: reversible beta contract. This guide supports a small workflow trial;
it does not publish content or finalize the future administration interface.

## Record sequence

Create records in this order:

1. **Source** - stable bibliographic identity: title, edition, publisher,
   source type, scope, and rights review.
2. **Source Snapshot** - exact retrieved artifact: URL, retrieval timestamp,
   upstream modification timestamp, format, and checksum.
3. **Coverage Framework** - an identified ABSITE or SCORE outline snapshot.
4. **Coverage Entry** - a project-owned mapping from one framework node to a
   Clinical Topic. Do not create placeholder mappings merely to copy an entire
   outline.
5. **Clinical Topic and Topic Revision** - the stable topic identity plus
   sourced narrative sections.
6. **Structured Clinical Fact** - one claim with a typed value, population,
   context, applicability, exceptions, scenario-use status, and exact
   citations.
7. **Tested Concept** - one narrow learning objective and one primary Clinical
   Topic. This is the future identity of one campaign-scoped FSRS card.
8. **Practice Question Inbox item** - Melissa's paraphrased tested point,
   answer summary, notes, uncertainty, and exact private source locator.
9. **Extraction Batch** - resumable processing range, input fingerprint,
   checkpoint, output records, conflicts, and review state.

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

## Citation and conflict rules

- Cite the exact Source Snapshot and exact claim-bearing record.
- A Topic Section has its own stable ID; a topic-level bibliography is not a
  substitute for section-level support.
- Preserve conflicting facts separately under one conflict-group ID.
- An unresolved conflict stays descriptive and cannot drive a scenario.
- Only human-verified citations can support clinically approved material.
- AI-assisted batches can emit Draft revisions only and must retain the batch
  ID in provenance.

## Safe first pilot

1. Copy the blank template into `.clinical-workbench/`.
2. Register one legitimately obtained source and one exact chapter or section
   snapshot.
3. Create 5-10 Topic shells, but fully develop only one or two.
4. Capture Melissa's paraphrased takeaways while she studies.
5. Resolve duplicates and source conflicts before drafting scenarios.
6. Validate after every small batch and retain the last completed locator.
7. Review whether the fields are comfortable before adding patient and
   question authoring.

G-002 remains the only owner choice needed before real Level 0/1 integration:
which first topic and smallest concept set should validate the full workflow.

## What validation does not prove

Structural validation cannot determine whether prose was copied, a clinical
claim is correct, a license permits reuse, or a patient detail is PHI. Keep
raw sources and private notes in ignored local directories, paraphrase
commercial question-bank takeaways, and require human rights and clinical
review before anything is tracked or published.
