# Flags2 final authoring round — 2026-11-05

Goal: respond to review two without retaining a held keyed teaching point.
Only new flags2-round3 files and one separate `index.ts` export are owned here.
No acceptance, runtime projection, evidence rebind, network, Git, installations,
agents or edits to prior versions. The release port and N3 lane are concurrent.

Inputs: `question-flags2-review2-20261105.json`, round-two packet/source ledger,
the authoring standard, retained original source claims and ship integration
contract. G06 is an exact frozen PASS and already accepted. All new content
remains `needs_clinician_review`.

Plan and decisions:

1. Capture exact intake and source-file hashes. Preserve the review notes.
2. Park G01, G02, G04-R, G05-staging and G07: the existing ledger cannot support
   their comparative keys. Record the supported alternative considered, why it
   cannot meet the owner note and resident-level task fairly, and the live fallback.
3. Re-aim G03 at clinical/imaging concordance after completed site-correct imaging;
   re-aim G05 at management after an established pathogenic calcium-sensing result,
   rather than family-history-to-genetic-test matching. Use only direct recorded
   facts. Baseline DXA is unscored context after an already placed referral.
4. Keep the two candidate encounters standalone in the retained draft view so
   neither contains a held adjacent key or rehearses the same downstream decision.
   This is an explicit draft composition change, requiring manager composition
   review before any acceptance. All original paired encounters remain exact.
5. Regenerate packet, atomic source ledger and before/after lint; manually attack
   every new option set and record every returned note response.
6. Run focused clinical tests (`--pool=threads --maxWorkers=2`), linter tests and
   clinical-content typecheck. Prove the default live release/manifest/timing and
   all prior flag files are unchanged. List exact bound inputs and stop for review.

Progress: authoring, source dispositions, packet, cue lint and focused tests complete.
97/97 focused clinical and 33/33 linter tests pass. Clinical-content typecheck
reports two untouched N3 TS2339 diagnostics; no flags2 diagnostic. The scoped
round-three handoff records the exact source window and integration limitation.
The scoped round-three handoff will contain the final state. The newest explicit
write boundary excludes updating the shared current-thread handoff.
