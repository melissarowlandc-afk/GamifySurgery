# Clinical Content Pilot Workspace

Status: local beta schema-v2 foundation. This is not the owner-facing Google
Sheet, full administrator application, clinical release publisher, or AI
ingestion service.

## Purpose

This workspace begins the approved clinical-authoring workflow without mixing
draft knowledge, source material, or private notes into the player runtime. It
supports four early jobs:

1. Register public and legitimately obtained sources by metadata and exact
   locator.
2. Track curriculum coverage without pretending there is one definitive list
   of every ABSITE diagnosis.
3. Collect draft Clinical Topics, structured facts, Tested Concepts, and
   owner-paraphrased practice-question takeaways.
4. Validate references, stable identities, workflow state, and resumable batch
   progress before any clinical publication work begins.

The authoring contract lives in `packages/clinical-authoring`. The existing
`packages/clinical-content` package remains the small player-safe runtime
fixture. The player and game-domain packages must not import the authoring
package.

## Public-repository boundary

This repository is public. Never place any of the following in a tracked path
or a GitHub branch:

- Textbooks, chapters, page images, or extracted source passages
- Commercial question-bank stems, answer choices, or explanations
- Real patient details or PHI
- Private study notes that reproduce protected material
- API keys, provider credentials, or AI prompt payloads containing source text

Use `.private-clinical-data/` for local source files and working notes. That
directory, `.clinical-workbench/`, and the private/import/export directories
under `clinical-data/` are ignored by Git.

Tracked files may contain schemas, blank templates, synthetic examples,
public bibliographic metadata, and short project-owned paraphrases that are
deliberately safe to publish.

## First pilot workflow

1. Register one source and its edition/date, scope, rights note, and retrieval
   metadata.
2. Create a small set of coverage nodes from an official framework.
3. Select roughly 5–10 Clinical Topic shells from one chapter or bounded
   source section.
4. Fully exercise only one or two topics through facts and Tested Concepts.
5. Record competing claims separately and leave their conflict unresolved
   until Melissa reviews them.
6. Run structural validation after every batch.
7. Export or checkpoint only sanitized metadata and project-owned drafts.

## CSV interchange boundary

The local initializer creates 17 normalized CSV tables. They are a strict,
auditable interchange subset for proving the manual-authoring import mapping;
they are not the nontechnical authoring interface promised by D-038. They
intentionally expose IDs, revision lineage, timestamps, provenance, and
relationship rows.

CSV v1 authors manual Sources, snapshots, citations, framework records, topic
mappings, Topic/fact/concept revisions, and Practice Inbox captures. It does
not author AI suggestions, extraction batches, patient variants, questions, or
releases. A validated base workspace may preserve existing extraction records,
but the CSV compiler cannot create or edit them.

The future owner-controlled Google Sheet should place readable authoring tabs
in front of this interchange, protect or auto-generate technical fields, use
dropdowns for controlled values, and export the same validated records. Do not
ask Melissa to maintain revision graphs or generic relationship fields by hand
as the normal long-term workflow.

## Local commands

- `npm run clinical:workbook:init` creates a new ignored
  `.clinical-workbench/pilot` CSV workspace and refuses to replace an existing
  path.
- `npm run clinical:workbook:compile` compiles that workspace to a new ignored
  canonical JSON file only after complete schema validation. It refuses to
  overwrite an existing output.
- `npm run clinical:workbook -- compile <directory> <output.json> --base <base-workspace.json>`
  compiles a custom directory while merging a validated base workspace without
  rewriting it. The tracked official-source registry is a suitable base:
  `clinical-data/public/official-frameworks.json`.
- `npm run clinical:fingerprint-source -- <local-source-file>` prints the
  file's SHA-256 for a Source Snapshot record and its byte length as a local
  integrity diagnostic. The current schema stores the checksum, not the byte
  length. The command does not copy or retain the source contents.
- `npm run clinical:validate:example` validates the complete synthetic
  end-to-end example.
- `npm run clinical:validate:frameworks` validates the tracked official-source
  registry with the additional public-fixture guardrails.
- `npm run clinical:validate:template` validates the blank starter workspace.
- `npm run clinical:validate -- <path>` validates a private local workspace.
  Add `--public-safe` before the path only when the file is deliberately safe
  to track publicly.

The blank canonical-JSON starter remains
`clinical-data/templates/authoring-workspace.template.json`. The safer default
for new local work is the initializer above because it creates the complete
manual-authoring CSV subset through staged, no-clobber writes and refuses to
replace an existing path.

Authoring schema v2 replaces the short-lived local beta v1 shape. No real
clinical workspace was migrated. If an early v1 template copy exists, retain
it as a private audit artifact and create a fresh v2 workspace rather than
silently editing its version number.

The first contract deliberately separates a stable bibliographic Source from
an immutable Source Snapshot. Citations, framework records, inbox captures,
and extraction batches reference the exact snapshot so a versionless PDF can
change later without corrupting historical provenance.

Selecting the first real Level 0/1 topic and concept set remains owner decision
G-002. The framework can be built before that choice, but no draft becomes
clinically approved or enters the game merely because it validates.

## Deliberately deferred

- Textbook ingestion and commercial question-bank ingestion
- AI provider selection or paid API use
- Patient Presentation Variants and Question Variant authoring
- Clinical approval, immutable releases, and publishing
- Authenticated author/reviewer identities and role enforcement
- Append-only structured conflict-resolution records
- Append-only versioned Source-rights decisions with stable decision IDs,
  effective times, revocations, and exact operation bindings
- Owner-friendly protected Google Sheet tabs and dropdowns
- Database migrations and Supabase storage
- The complete protected browser administration application

These remain later increments after the basic collection and validation round
trip proves usable.
