# Room economy research model

Analysis/proposals only for the October 8, 2026 room-economy audit. No production code or balance edits, installs, Git, browser, network, clinical content or saved-campaign access.

From the repository root with the existing Node v24.19.0:

```powershell
node --disable-warning=ExperimentalWarning tools/economy-audit/run.mjs --write
node --check tools/economy-audit/run.mjs
```

Without `--write` the run is read-only; `--diagnostics` also prints the per-room checks. `--write` refreshes only `results-20261008.json` here, as UTF-8 without BOM. It does not regenerate the narrative report; the manager should reconcile that report after input changes.

The script reads actual source data and selected pure domain helpers, then runs a small fixed-roster numerical model. Each of 45 scenario groups has 20 campaign seeds and five ten-hour operating days: one warm-up day and four measured days. Current, targeted and stronger values use identical demand. Cases cover Levels 1–3, baseline/half demand, specified outages and all-room Level 5 upgrades. The report defines assumed teaching/retail/manual workload, staffing, shared resources, payment timing and limits.

After a first cash shortfall, reported margins remain fixed-roster liabilities; the model does not simulate staff quitting or stock-purchase failures. A positive average also does not guarantee enough cash before the first payment. Use startup reserve and idle-runway results alongside profit. It is not a full reducer replay or browser/owner-save validation.

See [room-economy-audit-20261008.md](../../docs/design/room-economy-audit-20261008.md) for complete current values, exact proposals, sources, validation output and manager decisions. Full assumptions and source fingerprints are in the JSON result. Numerical assertions fail if a production input changes during a run.
