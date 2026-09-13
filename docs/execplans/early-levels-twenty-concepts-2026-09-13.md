# Twenty early-level concept groups — September 13

## Goal and authority

Create, independently editorially approve, and implement 20 new scored concept
groups for the first three surgery-center levels (runtime levels 0–2). Continue
GS-006 under the owner's autonomous authoring authorization. Clinical records
remain needs_clinician_review in the explicitly unapproved prototype; editorial
acceptance does not assert named-clinician approval.

## State and constraints

Baseline: 123 concepts, 298 cases, 463 decision nodes. The repository is heavily
dirty with earlier clinical, graphics, and persistence work. Preserve unrelated
edits, stable IDs, frozen saves, and the September 13 historical wording overlay.
No commit, push, deployment, dependencies, Drive edits, or campaign reset.

Use 1–5-word chief complaints, named clinic presentations, explicit coherent
age/sex, parallel randomized options, complete question tasks, and no answer
leaks. Every testing choice receives a runtime timing estimate, including
distractors. Game durations remain configurable placeholders. Prefer meaningful
diagnostic result gates; never postpone emergency escalation for an artificial
test. First levels may outsource diagnostics and refer definitive treatment;
never imply unavailable onsite capabilities.

## Research and decisions

Read the owner's live concept sheet, Sheet1!A1:B180, on September 13; modification
time September 11 16:55:56.499Z. Use entries as ideas, not clinical evidence.
Map new objectives to public ABS/SCORE categories without claims of frequency.
Use permitted current guidance, short original atomic claims, complete source
metadata and explicit reuse limits. No proprietary corpus or copied prose.

Accepted families: duct stones, postcholecystectomy bile leak, pseudocyst,
preoperative reflux evaluation, postbariatric hypoglycemia, Lynch tumor triage,
chronic fissure, cutaneous SCC, venous ulcer, and splenectomy infection prevention.
Four variants per concept (80 questions); case count follows clinical sequencing.
Lynch objectives are tumor screening and subsequent genetics evaluation, not
two versions of the same referral. Fissure treatment and failed-treatment visits,
and pre-splenectomy vaccination and later fever, are separate encounters.
Pseudocyst imaging precedes its returned characterization and drainage decision.

Root verified the official SCORE PDF on September 13: 27 pages, 2025–26 edition,
SHA-256 2b98112b218e0b612fe6ea2f8ad5cf7c6f4555d79289c2f569234aa6b5748c09.
Its explicitly named families cover all ten selected families; individual
diagnostic choices and postoperative complications are inferred applications,
not separately named exam topics. Postbariatric hypoglycemia is mapped within
Bariatric Surgery, with that limitation explicit. Skin maps to Nonmelanoma Skin
Cancers (printed 11 / physical 12). ABSITE public outline rechecked September 13.

## Milestones and ownership

1. [x] Terra read-only inventory: level capabilities and integration seams.
2. [x] Source contracts: Sol foregut/biliary families; Terra clinic families;
   root board-scope verification, final roster and acceptance decisions.
3. [x] Worker authoring in dated development-batch/2026-09-13 files.
4. [x] Worker integration of services, timing, registries, meaningful tests,
   and hash-bound editorial receipt.
5. [x] Root actual-diff and clinical review, regression/build validation,
   handoff updates and final results.

Normally one production writer at a time. Workers own explicit bounded files,
do not spawn or alter this plan, and preserve others' edits. Root owns product
decisions, acceptance, planning, integration review, and final communication.
After the shared helper landed, the two independent content halves use disjoint
file ownership: Sol owns helper/foregut files and Terra reads the helper while
authoring only clinic files. Neither edits shared registries or balance. This
limited parallel authoring has no shared write surface; integration remains a
single-writer milestone after root review.

## Acceptance and validation

Exactly 20 distinct additional scored groups and 80 original variants. New
patients eligible within runtime stages 0–2, with honest route/capability gates.
Source/claim/review schema valid; no unsupported exact medical rules. Tests
cover all new pathways, result withholding/delivery, timing completeness,
pending-save identity, and one concept review per answered node. Run focused
checks, then affected content/domain/player/balance suites and build/typechecks.
Review scoped diffs against pre-edit copies. Browser checks, if needed, use an
isolated context at canonical http://127.0.0.1:4173 and preserve owner storage.

## Progress and next action

Completed September 13. Root accepted the final authored versions and inspected
the actual scoped implementation and test diffs. Sol completed foregut authoring,
clinic corrections, integration, and regression fixture updates; Terra completed
level inventory, clinic sourcing, and clinic authoring. No qualifying production
implementation milestone was left undelegated. Root authored planning, acceptance,
handoff documentation and independent validation scripts.

Final independent validation: clinical 354/354, player 432/432, balance 13/13.
Domain initially 318/319; one stale exact admission allowlist was corrected by
Sol (two additions only, preserving all exclusions); root reviewed and reran
that file, 4/4 passing. All 1,118 distinct covered tests now pass. Production
build, boundaries/launcher contract, and seven workspace typechecks pass, with
the existing large-bundle advisory. Runtime preservation audit and all 80 timing
registry checks pass. No browser test was needed for these data/service changes;
all 52 reducer flows and 80 node presentations have direct test coverage.

Final release: 143 concepts / 350 cases / 543 nodes. Added 20 concepts, 80
questions, 52 cases (28 gated, 24 single), 208 demographic profiles, four external
services. Old 123 concepts and 298 cases are deep-equal to the saved baseline.
Final editorial receipt includes exact ordered IDs and 12 authored-file hashes.
Clinical approval remains pending in the explicitly unapproved prototype.
Handoffs updated; GS-006 stays open. No commit, push, deployment, dependency
installation or owner-save changes. Next action is owner feedback or an explicit
"push to GitHub" request for a scoped backup.

### Historical implementation notes

Both content halves drafted: Sol 10 concepts/40 variants/24 cases, Terra 10/40/28.
Root read every family and requested corrections for valid alternative answers,
timing misclassification, premature result disclosures, patient grammar, and
answer-length clues. Foregut accepted after 7 passing focused checks and clean
length audit. Terra handed back known final clinic corrections; Sol now owns
the single-writer integration milestone, including those corrections, aggregate,
services/timing, registry seams, receipt hashes and focused flow tests. Clinic
substance has been reviewed; final authored-version acceptance remains pending.

Expected full release after integration: 143 concepts, 350 cases, 543 nodes.
New batch: 52 cases, 28 two-node diagnostic pathways and 24 single-node visits.
Baseline .local-dev/early-levels-runtime-baseline-2026-09-13.json preserves all
123 concepts and 298 cases. Eleven shared-file pre-edit copies are saved under
.local-dev/early-levels-preintegration; worker must copy additional shared files
before changes. Root validation scripts .local-dev/early-levels-qa.mjs and
early-levels-clinic-review.mjs support exact preservation and rendered review.
