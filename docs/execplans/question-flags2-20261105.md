# Owner flags round two: retained draft view

## Goal and scope

Resolve the seven owner flags received November 4, 2026. Melissa Rowland is the
clinical sign-off; her flags are editorial instructions, not approval of a new
version. Use the authoring standard, independently passed batch-one exemplars,
the five-part manual rubric and unmodified cue linter. Every new clinical record
remains `needs_clinician_review`. Nothing ships from this worker.

G01: reconcile all eight ITP siblings and the diagnostic/surgical sequence.
G02: concrete competing anaesthetic plans. G03: inspect the exact B2B36 candidate
and skip if already addressed. G04: resident-level application or a supported
retirement/merge proposal. G05: distinguish surgical eligibility from skeletal
assessment. G06: concrete clinical numeracy, with constructed data identified.
G07: specific named tissue-diagnosis choices with adequate decision criteria.

## Ownership and constraints

Own only `question-flags2-*` clinical source, tests, tooling, fixtures and research
artifacts, this plan, and a minimal separate export hunk in clinical `index.ts`.
Supply a retained `flags2-round1` source view for later manager integration.
Preserve every historic question/concept, finite patient profile and frozen save.
Use a new concept version only when the scored clinical meaning changes.

Do not edit batch 2b, new-question files, manifest/projection/gate files, game
selector/routing modules, player session/performance/cloud, Supabase, Level 5
evidence/pins, deployment or the colon timer UI. No Git, installations, network,
agents or external messages. Shared files are concurrent user work. Append a
scoped handoff without replacing other workers' reports.

## Evidence and representation

Read existing bibliographic metadata and original atomic syntheses only. Retain
the original source access dates; a local metadata check is not new source
verification. Never invent an exact guideline threshold, claim verification,
source citation or source agreement. Record source-alignment gaps as holds for
manager/clinician resolution. No source prose or private feedback is stored.

Retain immutable intake at
`tools/question-quality/fixtures/question-flags2-before-20261105.json`. It records
the seven live tuples, eight ITP definitions, related claims/source metadata,
timings and file hashes. An initial import encountered the concurrently edited
gate's missing export; a subsequent read-only import succeeded and produced the
intake. No gate file was changed to obtain it.

## Acceptance and validation

Each authored candidate: exact new identity, named patient and valid finite
age/sex contexts, complete neutral task, 3–4 randomized parallel options,
consequential interpretation, closest credible resident error, one defensible
key, source/claim mappings, honest scope/holds, zero advisory findings across
its entire visible sequence. Record manual self-check and before/after lint in
`docs/research/question-flags2-20261105.json`, key first for review only.

Focused validation only (gate-lane full suites currently red): new-view clinical
tests with `--pool=threads --maxWorkers=2`, cue-linter tests and clinical-content
typecheck. Record exact counts/commands, any failure attributable to this lane,
protected-file hash results and changed Level 5 bound inputs. Do not rebind.

## Progress and next action

- Read AGENTS, standard, integration contract and existing batch-one exemplars.
- Captured live intake; G03 exactly belongs to the frozen B2B36 round-two view.
- Audited eight ITP siblings: four diagnostic HIV/HCV tasks and four subsequent
  deferral tasks; no keyed routine marrow-after-serology sequence exists.
- Completed: authored the bounded candidates, recorded source limitations,
  regenerated the retained view/packet and passed focused validation.
- Next action belongs to the manager: independent review, source-hold resolution
  and exact acceptance/integration. This authoring lane stops at that gate.


<!-- FLAGS2 completed 20261105 -->
Authored six exact variants in five scoped cases, retained old input/version identities and supplied a self-contained flags2-round1 view. G03 coverage skipped; G04 retirement/merge proposal keeps live unchanged. Three new meanings use separate concepts; nineteen atomic claims and fifteen recorded source records retain original access dates. G01/G02/G07 source holds are explicit. Linked G05 baseline staging is disclosed as foundational. Packet and manual rubric regenerated; cue lint11before/0after across30contexts. Focused clinical21/21, lint33/33, clinical typecheck passes. Final runtime/hash/live controls pass;14 batch2b files unchanged. Full handoff and exact Level5 paths: docs/research/question-flags2-handoff-20261105.md. All acceptance/clinical approval/release/evidence rebind decisions remain with manager/clinical sign-off. STOP at independent review.
