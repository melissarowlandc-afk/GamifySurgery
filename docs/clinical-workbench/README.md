# Clinical Content Pilot Workspace

Status: local beta foundation. This is not the full administrator application,
a clinical release publisher, or an AI ingestion service.

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

## Local commands

- `npm run clinical:validate:example` validates the complete synthetic
  end-to-end example.
- `npm run clinical:validate:frameworks` validates the tracked official-source
  registry with the additional public-fixture guardrails.
- `npm run clinical:validate:template` validates the blank starter workspace.
- `npm run clinical:validate -- <path>` validates a private local workspace.
  Add `--public-safe` before the path only when the file is deliberately safe
  to track publicly.

The blank starter is
`clinical-data/templates/authoring-workspace.template.json`. Copy it into the
ignored `.clinical-workbench/` directory before entering private source
references or study notes.

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
- Database migrations and Supabase storage
- The complete protected browser administration application

These remain later increments after the basic collection and validation round
trip proves usable.
