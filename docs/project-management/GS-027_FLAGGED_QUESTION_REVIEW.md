# GS-027 — Review questions flagged on this computer

Owner request, September 28, 2026: "Start a new thread that will just review
questions I have flagged on this computer." Prepared by GS Manager; no native
task created because task-management tools are unavailable. No flags have yet
been retrieved, counted or reviewed by the manager.

## Scope

Review only the owner's flagged questions on this computer, together with the
owner. Do not expand into general question-bank review, new concept production,
GS-006 takeover, gameplay repairs, reminders or automation. Begin with inventory
and the first owner-selected flagged question. No implementation is authorized
by this review-only request. Propose corrections for discussion; edit content
only when the owner explicitly requests it.

## Retrieve the actual queue

Read AGENTS.md, CURRENT_THREAD_HANDOFF.md and PROJECT_BOARD.md in
C:/Users/rowla/Projects/GamifySurgery; inspect dirty Git state before any edits.
Use this shared local project, preserving others' changes.

The current implementation uses browser-local storage key
`gamify-surgery.question-review-flags.v1` (schema 1). Source:
apps/player/src/session/questionReviewFlags.ts. The game exposes a
"Question flags" button and a queue/export dialog in
apps/player/src/ui/QuestionReviewQueueDialog.tsx. JSON exports are named
`stitchin-time-question-flags-YYYY-MM-DD.json` and identify format
`stitchin-time.question-review-flags`.

Prefer an existing local export or suitable direct read capability. If necessary,
use the intended persistent browser profile and existing game tab, verifying
location.origin before reading flags. Canonical local pathway is START_GAME.cmd
at exactly http://127.0.0.1:4173; other origins/profiles, including remote Pages,
have separate queues. Do not assume which profile the owner used or interpret
an empty different profile as no flags. Do not start a separate guest/test
profile to find owner flags. If direct access is unavailable, ask for the game's
JSON queue export. Do not scrape unrelated browser data or operate campaign
progression. Opening the queue pauses/resumes game time according to its UI;
preserve prior state and avoid unnecessary gameplay interaction.

Read the actual queue before claiming counts. Preserve all entries and their
open/reviewed status; do not clear flags, mark reviewed, reset saves or change
browser storage without an explicit owner decision. Use only necessary context;
do not publish campaign names or other local metadata. No cloud upload implied.

## Review flow

1. List open flags concisely using questionVariantId, concept ID, short stem and
   occurrence count. Keep already-reviewed flags distinguishable, not deleted.
2. Review the owner's selected flag (otherwise start with the most recent open
   flag). Show the frozen patient presentation, complete task, answer choices,
   keyed answer and explanation. A review display may reveal the key, but label
   it clearly. Ask what prompted the flag if no reason is stored; do not invent one.
3. Trace the exact question/concept/version and compare the frozen encounter
   with current authored source. Distinguish an old frozen question from current
   content rather than rewriting saves or assuming a live regression.
4. Discuss clinical accuracy, ambiguity, distractor quality, wording and whether
   the explanation answers the task. Separate confirmed problems from questions
   needing evidence. For clinical verification use current permitted authoritative
   sources and provenance rules from AGENTS.md, browsing when needed. Do not use
   prohibited/paywalled corpora, copy protected prose or fabricate citations.
5. Keep a concise review decision for that exact variant: concern, proposed
   correction, supporting sources/limits and owner's decision. AI-assisted
   clinical changes remain needs_clinician_review until a named clinician
   explicitly approves that version. General owner agreement is not automatic
   clinical approval. Preserve stable concept IDs and FSRS history; material
   clinical meaning changes require versioning under repository rules.

## Deliverable and boundaries

Maintain a scoped review log only when useful, under
docs/clinical-workbench/reviews/gs-027-flagged-questions.md, omitting unnecessary
local personal/campaign metadata. Findings must link to actual flags and source
variants; do not prepopulate fictional findings. Current request needs no game
tests because it authorizes no runtime edits. If edits are later requested,
create a bounded ExecPlan and delegate substantive work per AGENTS.md; preserve
concurrent content work and existing saves. No install, commit, push, deployment,
publication, reminders or automated recurrence is implied.

Acceptance: actual local flags identified, chosen questions reviewed with the
owner, decisions and unresolved clinical checks accurately recorded, queue and
saves preserved. A review session does not close ongoing GS-006 or the manager.
