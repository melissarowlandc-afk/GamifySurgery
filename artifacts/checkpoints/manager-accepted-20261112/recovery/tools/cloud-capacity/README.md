# Beta 2 local capacity harness

Run from the repository root with installed Node 24. The existing source loader
imports the actual TypeScript codec and domain source, with no build/install.
The harness refuses fetch, reads only checked-in synthetic fixtures, and writes
only the explicitly named report. It never modifies fixtures, game state on
disk, cloud settings or owner/browser saves.

```powershell
node tools/cloud-capacity/capacity.mjs --days 1 --seal-every-minutes 60 --max-wall-seconds 180 --out tools/cloud-capacity/results-20261017.json
node --test --test-isolation=none tools/cloud-capacity/capacity.test.mjs
```

Without `--out`, JSON goes to stdout. Progress goes to stderr. `--days N` asks
for N ten-hour facility operating days, reusing the integration journey's chart
selection, tick/review clock and day boundaries. Every command passes through
the real append-only evidence reducer. `--minutes-per-day N` changes the declared
day length; `--seal-every-minutes N` changes simulated upload batches, preserving
every sealed partial page. Default 60 facility minutes approximates a 60-second
ordinary checkpoint at 1x. This changes no production cadence.

The wall/codec bound returns an explicitly partial result. A requested day is
not called completed if it stops early. The report records its stop reason and
size-only diagnostics; it never truncates history, increases codec limits or
rebinds fixtures to obtain a pass. Integration fixture SHA-256 receipts identify
the actual shared-tree inputs read during a concurrent Level 5 rebind.

Each fixture uses current plus an equal-size prior for conservative enrollment
planning. Continued play uses the previous measured snapshot for its prior.
The report includes gzip payloads; actual base64/hash/page load shape; SQL's
12.5% + 2 KiB row reservation; 8-day operation estimates; one/eight-day cleanup
pressure; the 50 MB shared allowance; 300/400/500 MB project thresholds; and
monthly loads, small RPC replies and five private exports. Upload estimates are
ingress and never added to egress. The 50 MB noncampaign export JSON allowance
and small-reply assumptions are explicit estimates, not measurements.

Run [capacity-monitor.sql](capacity-monitor.sql) read-only in the live game SQL
Editor for actual per-account reservations and physical table/database totals.
No local number here proves PostgreSQL TOAST/index/bloat/peak allocation,
provider billing or a live 30-account load. Those remain manager gates.
