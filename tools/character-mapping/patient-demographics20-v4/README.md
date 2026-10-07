# Patient demographic gap batch4

Twenty new patient identities, each with standing and seated South/East/West/North views. The owner approved all 20 identities / 160 poses on October 7, 2026, and they are integrated locally as `patient-demographics20-v4.001`–`020`. The game now contains 225 identities / 1,830 assets and 116 selectable adult patient designs. No publication has been performed.

The fresh [demographic audit](../../../artifacts/character-statics/patient-demographics20-v4/analysis/demographic-audit.md) follows approved instantiation-profile demographics and the current concept/case selection path. It allocates 5 men 30–44, 7 men 45–64, 3 women 65+, 3 men 65+, and 2 women 45–64. This allocation balances art reuse pressure; it does not change clinical sampling weights or assert population disease prevalence. The existing approved women batch remains useful. Current authored questions do not require additional pediatric art.

`roster.json`, `design-rows.json` and 40 files under `prompts/` define the visual briefs. Every source uses built-in image_gen with the pinned GS026 style reference. Selected native PNGs are copied byte-exact with exact prompt/tool arguments/reference hashes/provenance. Targeted corrections retain immutable history. The unchanged GS026 extraction/normalization workflow creates 160×320 transparent derivative poses.

Root owns `review-acceptance.json`: source hashes, manual direction-specific seat contacts, faint-alpha warning acceptance and visual review. Packaging tools only read that ledger and emit coordinate candidates separately. Chair QA uses the already-approved Front Desk geometry without touching game browser storage.

The demographic audit is historical evidence from the creation state before this integration. Its allocation and source snapshot are deliberately retained; it is not regenerated after adding the new catalog entries.

Run the current integration checks with the configured Node runtime:

```text
node tools/character-mapping/patient-demographics20-v4/build-roster.mjs
node tools/character-mapping/patient-demographics20-v4/validate-roster.mjs --require-root-review
node tools/character-mapping/patient-demographics20-v4/build-placement-qa.mjs
node tools/character-mapping/patient-demographics20-v4/validate-placement-qa.mjs --require-complete
node tools/character-mapping/patient-demographics20-v4/validate-runtime-integration.mjs
node tools/character-mapping/patient-demographics20-v4/validate-promotion-rerun.mjs
node tools/character-mapping/patient-demographics20-v4/validate-gallery.mjs
```

All 20 sources, 80 manually chosen seated contacts and 20 south-facing approved Front Desk chair proofs are root-reviewed. Strict source/correction-chain/contact/alpha validation passes for 160 distinct poses. Desktop and phone gallery checks pass on all four pages. Normalization measures faint alpha loss and border pixels at maximum 1/255; the exact report is explicitly accepted in the root ledger. Native sources remain unchanged.

The historical creation baseline contains 205 runtime identities, 1,670 assets and 96 selectable adult designs. During production, unrelated concurrent work moved four radiologists into staff availability. Root verified an exact two-region catalog change, preserved initial audit and baseline receipts under `analysis/creation-snapshot/`, and recorded [the reviewed source update](../../../artifacts/character-statics/patient-demographics20-v4/analysis/reviewed-source-update.json). All non-source-hash demographic fields were exactly unchanged. Only the catalog fingerprint advanced during that source update; registry, all image bytes and patient metadata guards remained unchanged.

The append-only integration preserves every prior 205 catalog/registry entry, all 1,670 existing image bytes and anchors, and every prior provenance record and input approval claim. Eleven immutable pre-edit snapshots and 234 source/control hashes pin the approval evidence. All 20 additions enter their compatible adult age/sex pools through the existing occupancy and recent-use rotation; saved still IDs remain valid.

[Integration validation](../../../artifacts/character-statics/patient-demographics20-v4/validation/worker-integration-results.json) records passing source/contact/alpha, runtime/provenance, 20 chair proofs, eight gallery page/viewport checks, and promotion idempotence over all 1,830 assets. Focused domain tests pass in three files / 26 tests; player art tests pass in three files / 30 tests. Both workspace typechecks pass. The original overview and all five approved chair boards retain their exact approved hashes. The current gallery shows the local integration status, while its original approval-time version is preserved in the immutable baseline.

The owner also requested a scoped GitHub backup; the parent task records its verified status separately. No clinical data, demographic sampling, saves, motion or launcher changes are part of this integration. A backup does not authorize publication or deployment. Local owner playtesting remains `START_GAME.cmd` → `http://127.0.0.1:4173` in the usual profile.
