# Full-bank codec string headroom (2026-11-11)

## Goal / scope

Determine whether the batch-4 separateCampaign failure is a real account-save
risk or a fixture artifact. Preserve every FSRS/review/frozen encounter and old
save compatibility. Main tree only, shared with domain binding/topic writers;
no agents, Git/commits, installs, network, live DB/accounts or private saves.
Own player cloud tests and codec fixes only if a real path requires one. No
clinical, topic, domain, balance, bindings, SQL or game/save-format changes.

## Evidence / repository state

Batch-4 receipt reports one focused-player failure at separateCampaign.test.ts:54,
codecEvidence.ts:75 -> codecJson.ts:63. String cap is 262,144 UTF-8 bytes. Current
default is reported as 1,330 cases / 1,019 meanings. The release test uses a pinned
historical clinical context; it does not establish full-current-bank headroom.
An existing release-only investigation test identifies sourceRecovery.text as an
extra structural property accidentally passed as CloudSourceProvenance. Main
runtime source selects explicit metadata in normal imports/separate branches;
audit remaining callers before classifying risk. Read-only release comparison;
no writes outside main. Original scoped files / runtime guards in
`.local-dev/codec-string-limit-20261111/`.

## Milestones

1. [done] Reproduce current failure; measure offending string and proper
   header/native payloads; audit native/legacy/recovery/journal callers.
2. [done] Correct fixture API usage if artifact, retaining full default bank
   and retirement assertions. Add current full-bank + realistic Level 5 size /
   exact-state guards, including real native and legacy compatibility routes.
3. [done] Focused and cloud-suite threads, typecheck; short measurement/risk
   handoff at docs/research/codec-string-limit-20261111.md and current handoff.

## Acceptance / validation

- Identify exact string path/content/bytes and explain release-versus-main pass.
- Native snapshots and proper format-2 imports/branches must roundtrip full state;
  strict codec limits stay intact. No catalog pin that hides current-bank risk.
- Record raw/compressed snapshot bytes, largest string/headroom and full-bank
  count for fresh/retirement/crowded and real Level 5 fixtures; generous (<80% cap)
  per-string headroom guard. Verify no native evidence pages/history upload.
- Run Vitest with documented sandbox preload / --pool=threads; player typecheck.
  No browser or actual server acceptance claim.

## Next action

Manager reviews the fixture-only diff / size guard and reruns the cloud recovery
browser seed scenario; owns release port/checkpoint. No next milestone started.

## Findings / completed validation

- Fixture artifact: sourceRecovery.text (the complete raw save) was passed as
  header provenance. Proper production metadata is only sha256/utf8Bytes/schema.
- Equivalent full-bank 12-retired text is 405,238 bytes vs 262,144 cap; historical
  pinned control is 211,453 bytes. Added FSRS cards explain the 193,785-byte growth.
  No new codec runtime behavior: eight checked codec paths match release logic.
- Full-bank Level 5 snapshots: raw 1,694,959 / 1,926,968; gzip 140,682 / 158,995;
  largest string 6,118 (97.67% free). Reviews 403 / 553 and frozen encounters exact.
- Preserve the full current bank; no historical pin or larger codec allowance.
  No runtime/domain/clinical/binding/SQL/save-format change.
- Wider suite found the same wrong argument in unrelated-slot fixtures: four
  automaticResolution calls, one App lifecycle, two App async reopen and one
  cloud-recovery e2e call. Correct only metadata inputs; keep all assertions.
- Before targeted test: 11 pass / 1 fail, 18.60 s. Target + guard: 24 pass, 21.43 s.
  Initial wider cloud: 756 pass / 5 same-artifact failures, 256.55 s. Corrected
  fixture files: 72 pass, 46.21 s. Player and affected e2e/QA typechecks PASS.
- Full final cloud + affected App: 77 files / 789 tests PASS, 249.19 s, exit 0.
  Player and cloud e2e/QA typechecks PASS. Eight final measurement rows match
  initial measurements exactly. Artifact environment emits only technical sizes,
  never source save/prose/answers. All 119 session runtime hashes remain at intake.
- Only six test/spec files plus this plan/report/current handoff changed. No
  runtime limit/format/game data/bindings changes; no Level 5 bound inputs changed
  by this lane. The retained Level 5 JSON SHA-256 still matches intake.
