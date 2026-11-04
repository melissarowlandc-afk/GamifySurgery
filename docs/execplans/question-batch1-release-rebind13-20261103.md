# Question batch 1 release port and Level 5 rebind 13

## Goal and authorization

Port the manager-accepted question-batch-1 lane through authoring round seven
from the read-only live tree into GS-release, then regenerate actual Level 5
and legacy behavioral evidence. The owner explicitly permits the rewritten
questions to ship to beta as drafts pending her clinical review. Preserve all
eleven exact owner-approved versions and their approvals. Keep every other new
version `needs_clinician_review`. Keep B05-context, B07-context, B08-context,
B12-context and B36 as their current round-seven drafts, flagged for owner review.
Do not author, revise or clinically approve content.

## Repository state and constraints

- Writable root: `C:/Users/rowla/Projects/GS-release` only.
- Read-only source: `C:/Users/rowla/Projects/GamifySurgery`.
- Initial metadata HEAD: `5a688e2774851bc1f8d118bd4ecf816a43ee38d9` on
  `release/beta1-20261016`; owner reports a clean release tree.
- Initial rebind-12 evidence: 380 bound inputs, 261 clinical inputs, thirteen
  history entries, 28,804 commands and 6,010,006 closing cents. All recorded
  input hashes match current release files before porting.
- No Git commands, installs, network, agents, commits, external messages,
  deployment or publication. Preserve the shared tree and manager-owned handoff.
- Exclude session/cloud, Supabase, beta-backup scripts, character art and facility
  character implementation, and every other unreleased lane.
- Use explicit handoff/owned-file manifests and content diffs. For shared files,
  port only question-lane hunks; package changes are limited to lint scripts.

## Ownership

The port manifest will list every authorized question-lane path from the round
handoff chain, plus the manager-requested APP assertion scoping in
`packages/game-domain/tests/level-four-integration.test.ts`. Generated evidence
ownership covers the existing Level 5 results/checkpoints and established legacy
behavioral-evidence artifact, with no guard/assertion weakening. This plan and
the final append to `docs/execplans/gs028-stats-ethics-overhaul-20261007.md` are
coordination records. All diagnostics, source snapshots and staging stay under
`.local-dev/question-batch1-release-rebind13-20261103/`.

## Milestones and acceptance

1. Capture the release/source baseline, derive and inspect the complete port
   manifest/content diff, and locate preservation and legacy generators.
2. Port only the authorized lane, verify exact draft/approval/frozen-content
   preservation, and independently classify the initial full-domain failures.
3. Run the unchanged original-seed Level 5 journey and lower helper into private
   staging. STOP before publication for nonzero walkouts, failed cash
   reconciliation, any changed frozen encounter or approved version, or any
   assertion requiring weakening. Otherwise append previous hashes/history and
   apply only the established liveCap metadata correction before publication.
4. Independently reproduce the 25 legacy comparison diagnoses against release
   content, regenerate with the established generator, and prove every changed
   path is confined to new concept histories/newly admitted encounters.
5. Validate full game-domain and full player in threads, all seven typechecks,
   clinical-content and lint tests. Classify timeouts honestly; keep native exits
   and exact output. Append the rebind-13 handoff with every path, hashes,
   clinical-input changes, run numbers and remaining risks.

## Progress and next action

- Initial instructions, round-seven handoff, final independent review and APP
  diagnosis inspected. Review seven records 68 PASS / five REVISE / zero FAIL.
- Release metadata and all 380 current bindings verified read-only.
- Captured and content-diffed 513 explicitly owned lane files; 468 are new and
  45 replace existing question-only files/hunks. Copied their frozen incoming
  bytes with source SHA checks and package/player dependency closure checks.
  Every latest code ownership hash matches the source. No prohibited lane was
  touched. Complete paths and before/after hashes are in the staged port receipt.
- Preservation passed: original assembled clinical release data is exact;
  105 frozen encounters across all nine recorded saves load exactly; eleven
  approved versions and their sign-off metadata are exact; five returned items
  remain current round-seven drafts; all 26 new authoring concepts remain pending.
  Retained all 1,423 original timing rows and all 269 original service bindings.
- Independently replayed the established legacy-capture loop on all 25 frozen
  level/schema inputs, comparing captured release content with the ported bank.
  The original content reproduces all recorded loads and 120-minute continuations.
  Each new load differs only by 26 empty concept histories. Further differences
  are confined to newly admitted encounters; existing input encounters are exact.
  Actual generated replacement rows remain privately staged.
- Initial full domain suite and fresh unchanged native Level 5 journey are
  running, with all canonical evidence still unwritten. Full player and clinical
  validation are also running. Seven typechecks and 21 lint tests have passed.
- Next: classify initial failures, finish both native generators, apply all stop
  gates, then publish generated evidence with complete provenance and validate
  the final tree. Never resume a partial journey after interruption.

Initial full-domain classification is complete: 4,347 passed, 26 failed,
one existing optional skip, 1,884.51 seconds. Exactly one binding guard and
25 legacy load comparisons fail; no timeout, import error or other failure.
The JSON reporter's signed `+0` formatting and abbreviated hashes are handled
only by the private classifier; full hashes from the default reporter match
all independently generated before/after pairs. No test/assertion was edited
for this classification. The current staged journey is still running; all
canonical evidence remains unwritten.

## Completed

All five milestones completed. 26362 native commands, 6056335 closing cents and zero walkouts; 409 inputs (290 clinical); fourteen preserved history entries. Full domain/player/clinical suites, seven typechecks and lint tests passed. Canonical artifacts were published only after all staged gates. The complete final handoff and paths are appended to GS028; public audit records are linked there. No unrelated baseline file changed.
