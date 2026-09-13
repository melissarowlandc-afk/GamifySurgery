# Repair the implemented patient library

## Goal and authorization

Apply the owner's September 13 audit feedback to all implemented patient
concepts. Chief complaints should usually be 1–5 words: a symptom, question or
phrase. Presentations should describe the named patient in the clinic, preserve
the medical teaching point, avoid repeating the complaint, and contain a
complete question. Correct the missing viral-association task in anal HSIL.
Every encounter must display an age and sex coherent with the clinical story,
generated name and selected character. Diagnostic durations remain prototype
placeholders; record a future design task for equipment/rooms/staff/upgrades.

## Constraints and repository state

Shared, heavily dirty local worktree; preserve graphics and other unrelated
changes. Initial library: 123 concepts, 298 cases, 463 decision nodes. Keep
concept IDs/FSRS history, answer keys, result gates, routes and clinical facts.
Do not silently elevate clinical review status. Preserve existing saves and
frozen clinical content; any compatibility display repair must be explicit and
tested. Do not install, commit, push, publish or touch owner browser storage.
The previous audit snapshot remains historical, not overwritten.

## Ownership and milestones

1. Terra patient_library_inventory: read-only inventory of active source modules,
   wording defects and complete-question gaps. Astra inspects identity pipeline.
2. Astra accepts architecture and delegates one bounded content implementation
   milestone to Terra, with explicit source ownership and verification.
3. Delegate runtime identity/display consistency and meaningful tests, preserving
   shared edits. Complete migration behavior only as justified by inspection.
4. Astra reviews actual changes and runs appropriate content/domain/player
   validation and build; return substantive corrections to the worker.
5. Document coverage, corrected examples and future diagnostic timing design in
   handoffs. Deliver results and scoped local-backup reminder.

## Acceptance and validation

Review all active cases, instantiation profiles and decision stems. No abstract
"A patient with" openings, incomplete generic question tasks, full-sentence
chief complaints or unresolved identity tokens in new encounters. Clinical
meaning and all eligible profile-specific findings must survive editing.
Verify deterministic demographics/name/character coherence, including previously
unspecified cases, sex-specific stories and reloads. Verify all testing options
continue using runtime duration previews, without hardcoding durations in prose.
Use targeted regressions and appropriate package suites/build. Record exact
counts, commands and any remaining exceptions rather than claiming coverage
based solely on regex checks.

## Final acceptance

Completed September 13. Sol authored the exact full-library repair and clinical
coverage report; Terra completed inventory, runtime identity and player display
compatibility. Root inspected actual files and scoped pre-edit diffs, read all
changed base narratives and complaint groups, returned editorial/identity
corrections, and independently compared the final release with the pre-task
snapshot. All concepts, non-editorial fields and numerical findings are
preserved, including all stems except the exact HSIL correction.

The final library retains 123 concepts / 298 cases / 463 nodes / 664 profiles.
All 298 complaints are 1–5 words; all 962 base/profile presentations are named.
Changed wording: 298 complaints, 126 base presentations, 30 profile presentations,
one HSIL stem. Unknown/custom saved text is deliberately preserved; exact known
old strings receive display-only corrections, including formerly absent
complaints. Saved clinical content and progress are not replaced.

Validation: clinical-content 339 tests; full domain 264 tests; full player 431
tests (1,034 total). Full build, seven workspace typechecks, dependency boundaries
and launcher contract passed. Root made one tiny acceptance-test correction to
allow a question mark in a short chief complaint, consistent with the owner's
permission to use a question; the seven targeted repair tests then passed.
Build emitted its bundle-size advisory; no build failure. No browser save was
opened or reset, and no launcher/origin change was made. No commit/push/deploy.

Future timing design is recorded in docs/features/diagnostic-timing-future-design.md.
Presentation guidance is durable in AGENTS.md. Deliver the repair report and
future-task note; keep GS-006 open for owner feedback and further review.

## Progress and next action

Terra completed a read-only inventory: 253 complaints, 244 over five words;
298 cases, 463 nodes, 664 profiles; 126 missing base demographics (all profiles
have demographics). Root confirmed FHH evaluation explicitly says age 27 and
FHH results confirmation says young adult; identity completion must honor both.
Terra declined the authoring milestone without edits because it interpreted
literal mapping as requiring already-supplied prose. Root clarified that offline
authoring scripts are permitted and escalated the substantial editorial work to
Sol patient_library_wording, the sole content writer. Exact reviewable mappings
at runtime are required; authoring new wording is explicitly authorized.

Root recorded the future timing design in
docs/features/diagnostic-timing-future-design.md. Identity/appearance inspected:
admission must fill missing demographics before generating name/character;
normalization currently retains any existing roster identity even if mismatched.
Terra patient_identity_consistency now owns domain-only demographic completion,
compatible appearance normalization, persistence and focused tests. This is a
bounded exception to normally one writer: Sol owns clinical-content files and
Terra owns disjoint domain files; neither may edit the other's modules. Runtime
identity does not depend on revised wording. Any wording compatibility migration
waits for the exact revision mappings and root integration review.
Next: review both milestones and run integrated validation. Preserve already-
frozen clinical facts and stable save identity.

Identity milestone completed: Terra's 19 focused domain tests and domain
typecheck pass. Root reviewed actual pre-edit diffs and corrected the design to
fill explicit "Not specified" as well as absent sex (ten active base records).
Explicit Female/Male and authored ages remain unchanged. Existing compatible
roster identities survive reload; FHH age constraints are honored.

Terra now owns player-only exact-match display compatibility using Sol's
exported before/after mappings. This deliberately leaves frozen clinical text,
metadata, answers and progression intact; only known chart strings receive the
revised display wording. Unknown/custom strings remain untouched. Sol continues
the disjoint content milestone. Root caught diagnosis-revealing or truncated
complaints in the first mechanical draft and required individual editorial
review before acceptance.
