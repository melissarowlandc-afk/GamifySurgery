# Clinical Workbench

Status: local beta authoring foundation plus an isolated, loopback-only
evidence-review Workbench. This is not a hosted administrator application,
clinical release publisher, clinical-approval service, or unrestricted AI
ingestion system.

## Purpose and boundaries

This workstream supports two linked but separate jobs:

1. `packages/clinical-research` and `apps/clinical-context-workbench` collect
   evidence gaps, exact search provenance, metadata candidates, rights
   decisions, reviewed contributions, expert opinions, syntheses, and proposed
   authoring changes.
2. `packages/clinical-authoring` registers exact source snapshots, official
   coverage frameworks, Clinical Topics, structured facts, Tested Concepts,
   and owner-paraphrased Practice Question Inbox captures.

`packages/clinical-content` remains the small player-safe runtime fixture.
Build-time boundary checks prevent the player and game-domain packages from
importing the research, authoring, or Workbench code. Nothing becomes
clinically approved, published, or player-visible merely because it validates
in either private workspace.

## Public-repository boundary

This repository and its GitHub Pages site are public. Never commit:

- textbooks, chapters, page images, or extracted source passages;
- commercial question-bank stems, answer choices, or explanations;
- PHI or real patient details;
- private notes reproducing protected material;
- API keys, contact addresses, credentials, or source-bearing AI prompts; or
- Workbench state, provider artifacts, private imports, or exports.

Raw legitimately obtained sources belong under `.private-clinical-data/`.
Workbench state and immutable local artifacts belong under
`.clinical-workbench/`. Those roots and the private/import/export directories
under `clinical-data/` are ignored by Git. Back them up only to an
owner-controlled private encrypted location.

Tracked files may contain schemas, blank templates, synthetic examples, public
bibliographic metadata, official links and checksums, and deliberately
public-safe project-owned paraphrases.

## Evidence queue

The Workbench deliberately separates:

`Evidence Gap → Search Run → Metadata Candidate → Screening → Source/Rights → Reviewed Contribution or Expert Opinion → Synthesis Review → Content Change Proposal`

A search hit is not evidence. Candidate titles and citations never appear
under **Known**. The derived brief uses only reviewed contributions and current
expert opinions, and displays separate **Known**, **Needed**, **Blocked**, and
**Next actions** sections. Conflicts and uncertainty remain visible until a
reviewer resolves them.

PubMed and Crossref adapters retrieve bibliographic metadata only. They do not
request or retain abstracts or full text. Scout strategies store literal
queries, filters, provider, cadence, result counts, timestamps, and failures.
No live scout runs until a real contact address is supplied locally.

## First pilot

1. Register one legitimate source and its edition/date, scope, retrieval
   metadata, checksum, and operation-specific rights.
2. Select roughly 5–10 Clinical Topic shells from one bounded source section
   and map them to official coverage nodes.
3. Fully exercise only one or two topics through evidence gaps, reviewed facts,
   and narrow Tested Concepts.
4. Run literal metadata searches, then screen candidates. Promote an included
   candidate only by linking it to a stable Source.
5. Create reviewed evidence contributions with exact locators. Keep competing
   claims distinct and unresolved until Melissa reviews them.
6. Review a synthesis and explicitly hand an accepted or narrowed result to a
   content-change proposal.
7. Validate after each resumable batch and checkpoint only sanitized metadata
   and project-owned drafts.

## Reviewed-concept release-point queue

The 55 owner-authored rows covered by clinician review
`melissa-rowland-md-2026-08-05-rows-2-56` now have a tracked, deliberately
non-runtime review queue:

- `CONCEPT_RELEASE_POINT_REVIEW_QUEUE.md` explains the concept-by-concept
  workthrough and exact question-iteration approval process.
- `concept-release-point-review-queue.json` records all 55 source rows, their
  unchanged evidence dispositions, and each row's exact approval state.
- `approvals/owner-row-023-pulmonary-optimization.md` records the first exact
  clinician-approved revision, including its stable concept, presentation,
  question, claim, and release-point identities.
- `approvals/owner-rows-008-025-direct-inguinal-anatomy.md` records the
  deliberate merger of two source rows into one Level 3 FSRS concept and keeps
  its approved variants deferred until the Ambulatory OR framework exists.
- `approvals/owner-row-029-hcc-milan-criteria.md` records one Level 0 HCC
  disposition concept tested through six patient-to-criteria and four
  criteria-to-patient variants, with bounded approved presentation profiles.
- `approvals/owner-row-030-breast-cyst-pathway.md` and
  `approvals/owner-row-031-ebv-associated-malignancies.md` record the other
  exact owner-approved Level 0/1 revisions currently admitted to the
  development-preview release.
- `approvals/owner-row-036-mondor-disease.md` records the three-concept,
  nine-variant Level 0 pathway for recognition, selective imaging evaluation,
  and supportive management of Mondor disease.
- `approvals/owner-row-037-postoperative-chylous-ascites.md` records the
  three-concept clinic-to-hospital pathway for evaluating postoperative
  ascites, confirming chylous fluid, and initiating inpatient management. It
  remains deferred at Future - Hospital Floor with no numeric level.
- `approvals/owner-row-038-vitamin-c-collagen-hydroxylation.md` records the
  one-concept, four-variant Level 2 applied-science package for vitamin C's
  role in collagen hydroxylation, including the type III-specificity and
  universal-supplementation boundaries.

The accepted release-point vocabulary is maintained separately in
`docs/features/facility-levels-and-clinical-release-points.md`. No queue record
is admitted automatically; an exact approved revision must be integrated and
validated deliberately.

## Starting the tools

- Double-click `START_CLINICAL_WORKBENCH.cmd` to install dependencies if
  needed, start the Workbench on `127.0.0.1`, wait for its health endpoint, and
  open a browser.
- `npm run clinical:context` starts the same loopback-only application without
  the Windows launcher.
- `npm run clinical:context:test` verifies its API, immutable storage,
  optimistic concurrency, and local-request boundary.
- `npm run clinical:research:test` verifies the canonical evidence model,
  conservative brief, private intake/extraction, metadata providers, scout
  coordination, and sanitized authoring bridge.
- `npm run clinical:workbook:init` creates an ignored schema-v2 17-table CSV
  interchange workspace and refuses to replace an existing path.
- `npm run clinical:workbook:compile` compiles that workspace to a new ignored
  canonical JSON file after validation.
- `npm run clinical:workbook -- compile <directory> <output.json> --base <base-workspace.json>`
  merges a validated base workspace without rewriting it.
- `npm run clinical:fingerprint-source -- <local-source-file>` prints SHA-256
  and byte length without copying or retaining source contents.
- `npm run clinical:validate -- <path>` validates a private authoring
  workspace. Use `--public-safe` only for deliberately trackable fixtures.

The normalized CSVs are a technical interchange boundary, not the eventual
nontechnical authoring interface. Melissa should not have to maintain revision
graphs, IDs, or generic relationship tables manually.

## Local private intake

The intake pipeline scans only its fixed ignored inbox. It uses bounded
streaming checksums, byte-level file identification, explicit no-PHI and rights
acknowledgments, an exclusive lock, per-file atomic checkpoints, immutable
extraction artifacts, and a hash-chained audit trail. PDF, DOCX, Markdown, and
text extractors create deterministic bounded chunks with parser/chunker
versions and locators. Image-only PDFs are marked as requiring OCR; OCR is not
performed and those files remain visibly action-required. Routine status reads
do not rehash the complete corpus; the Workbench provides a separate deep
integrity audit.

The current 25 MiB ceiling is for the small pilot, not permission for broad
textbook ingestion. PDF/DOCX parsers now run on an isolated worker event loop
with time, V8 memory/stack, page/block, and extracted-character limits.
This is still not an operating-system malware sandbox, so use one trusted,
legitimately obtained bounded chapter first and review resource behavior before
larger batches.

Source rights are append-only, operation-specific, time-aware decisions. An
unresolved operation is denied by default. Permission to store or process a
source locally does not imply permission to send it to an external AI, quote it
publicly, or publish a paraphrase.

## Deliberately deferred

- automated source acquisition, OCR, unrestricted textbook ingestion, and all
  commercial question-bank ingestion;
- AI provider selection, paid API use, or external transfer of source text;
- Patient Presentation Variant and Question Variant authoring;
- clinical approval, immutable clinical releases, and publication;
- authenticated multi-user roles and hosted administration;
- Supabase migrations, cloud storage, or external deployment; and
- the final owner-friendly protected spreadsheet/database interface.

The local Workbench is review infrastructure. It does not authorize any of
those deferred actions.
