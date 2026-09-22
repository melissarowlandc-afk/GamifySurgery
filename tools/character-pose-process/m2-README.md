# M2 fixed synthetic compositor runner

This runner executes exactly one reviewed procedural proposal against
`https://cortan.taile197db.ts.net`. It has no URL, graph, class, input, output,
or run-directory arguments. It cannot load or upload images and its pinned graph
contains no model node. The private-art processing boundary remains unchanged.

Pinned inputs:

- proposal SHA-256: `e2585246c2cdd59e615afff998002e5ddb0c2e5d452b85f1614f98350a96f1ba`
- schema SHA-256: `3617e7c67f799dc4f223a3b5e1a5a926f87f2cb2d48da1a12a7f69192c3e217a`
- endpoint: `https://cortan.taile197db.ts.net`
- client ID: `gamifysurgery-pose-process-m2-run-001`
- graph: exactly 84 nodes from the seven M1 synthetic classes
- downloaded outputs: only SaveImage nodes `83` and `84`, one strict PNG each
- local evidence destination: `pose-process-proof-v1/m2-run-001/`

The offline command performs no fetch:

```powershell
node tools\character-pose-process\m2-runner.mjs --validate-only
node --test tools\character-pose-process\m2-runner.test.mjs
```

After parent review explicitly releases the first network call, the exact
planned command is:

```powershell
node tools\character-pose-process\m2-runner.mjs --execute
```

If a trusted receipt exists and the first process stopped after submission,
resume only that prompt with:

```powershell
node tools\character-pose-process\m2-runner.mjs --resume
```

`--execute` first revalidates the pinned bytes and deterministic re-emission. It
GETs only the seven used `/object_info/<class>` records and `/queue`. Queue
evidence stores counts only. A nonempty queue prevents POST. Before POST, the
runner exclusively writes the exact request and an immutable attempt marker.
It then POSTs `/prompt` with only `{prompt,client_id}`. Any uncertain response
leaves the guard in place and can never cause an automatic resubmission. A valid
prompt receipt is written immediately.

The runner polls only `/history/<own-prompt-id>` with a five-minute bound. It
requires completed success, exact graph equality, and exactly one output image
from each SaveImage node. Intermediate outputs are tolerated only from graph
nodes whose pinned class is `ImageCompositor`; they are never downloaded.
Remote destination metadata must match the owned synthetic output subfolder and
expected filename stem. Fetch uses normal TLS and rejects redirects. Downloads
must be bounded PNG bytes and are saved unchanged.

The separate M2 ledger records server execution time only from the own history's
`execution_start` and `execution_success` timestamps. Download time uses a local
monotonic clock. Queue and operator effort remain null unless separately
measured; the runner makes no savings claim. Every request, attempt, receipt,
history, output and audit hash is retained. A resume verifies existing evidence
instead of overwriting it.

This runner establishes mechanics only. The calculated bboxes, pixel counts and
noncentral-pivot prediction in `m2-expected-observations.json` remain expected
values until the output is measured. Rotation may introduce fractional alpha.
Because AddLayer masks multiply existing alpha, the binary fixture is suitable;
future fractional-alpha pieces require a separate review.
