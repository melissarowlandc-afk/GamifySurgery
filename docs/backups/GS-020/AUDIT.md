# GS-020 scoped backup audit

## Conclusion

GS-020 cannot be represented as a conventional runnable change against clean
HEAD `c26c96a111103d8665e33c9258ef54071d729f14`. Its mobile-worker scheduling,
pending-result migration and browser fixtures depend on inherited uncommitted
routing, persistence and UI foundations. Copying that foundation would mix
other milestones into this backup.

The package instead preserves the task baseline and a deterministic GS-020-only
reconstruction. Seven paths changed again after the baseline for concurrent
GS-017 alert and patient-attention work. Those files were reconstructed hunk by
hunk: accepted hashes deliberately differ from the full current shared-tree
hashes while retaining the exact GS-020 imaging changes.

## Exact accepted scope

`manifest.json` is authoritative and records 23 accepted paths:

- 4 balance catalog/schema/test files.
- 8 domain source files plus 4 updated domain fixtures and the dedicated
  ultrasound-first regression suite.
- 3 player guidance/view-model files.
- 1 dedicated Playwright specification.
- 2 browser screenshots from disposable fictional fixtures.

The reconstruction covers ultrasound at Level 1, optional X-ray at Level 2,
inert legacy control rooms, ordinary reachable imaging doors, OR-room staffing
prerequisites, concrete mobile technician reservation and movement, delayed
feedback, sequential reuse, fire guards and save/reload reconciliation.

## Mixed-file reconstruction and exclusions

The following accepted files contain only their GS-020 hunks over the preserved
baseline:

- `prototype-alerts.ts`: imaging guidance text and Level-1 eligibility; excludes
  the later water-cooler feed-policy edit.
- `types.ts`: imaging worker identity and `perform_imaging`; excludes the later
  ambient-cadence migration marker.
- `reducer.ts`: imaging scheduling, task ticking and catalog/staff guards;
  excludes later patient-attention and ambient-cadence changes.
- `persistence.ts`: imaging identity/task normalization and reconciliation;
  excludes later alert-cadence, missing-examination-room and arrival-tick work.
- `facility-experience.ts`: mobile technician and ordinary-door behavior;
  excludes the later missing-examination-room cadence policy.
- `facility-experience.test.ts`: Level-1 imaging expectations; excludes the
  later water-condition persistence case.
- `alertViewModels.ts`: Level-1 imaging guidance only; excludes later patient
  attention, cadence and persistent-feed changes.

The entire concurrent `alertViewModels.test.ts` diff, GS-017 patient-attention
and alert persistence, all unrelated art/renderer/animation work, clinical
content, project-management material, broad handoff/log snapshots, owner saves,
browser storage, build outputs and local result directories are excluded.

## Applicability and dependencies

The `a/` files are the ignored task baseline captured from the integrated dirty
tree, not clean HEAD. They already contain prerequisite work from earlier
milestones. Consequently this package is evidence and reconstruction only; it
must not be called merge-ready or independently runnable.

The backup branch starts at clean HEAD solely to store this durable package.
It does not claim that applying the runtime patch to that HEAD yields a working
game. The backup-branch push is outside the Pages workflow's `main`-only push
trigger and job condition; no deployment is implied.

## Safety and provenance

- No clinical content path or clinical claim was changed or copied.
- No proprietary corpus, ignored clinical-workbench input, credential, owner
  profile/save, browser userdata or build output is included.
- The PNGs show only the game UI and disposable fictional test state. They do
  not embed private raster sources or personal data.
- Catalog timing, rewards and clinical meanings remain unchanged.
- Generated binary evidence is explicitly inventoried and hash-locked.

## Final package validation

The binary patch passed `git apply --check -p1` against a fresh copy of `a/`.
The restore script independently verifies the patch hash and all baseline
hashes before application, then reproduced all 23 accepted SHA-256 hashes. A
second run refused the populated destination. The parent independently repeated
the exact 23-file reconstruction and non-empty-target refusal. The final patch
SHA-256 is `09858610ee8631672f3b9b95b902e23e40466dc886ac9d9d1b612c592d8cc023`.

Credential-pattern scans by both the package author and parent returned no
matches. The package contains 19 scoped baseline files plus six support files;
the redundant accepted-byte `b/` snapshot is excluded. Patch-stat review reports
23 reconstructed paths, 1,176 insertions and 167 deletions. The isolated branch
remains at the required source HEAD with only `docs/backups/GS-020/` untracked.
Integrated runtime, typecheck, unit, build and browser evidence is recorded in
the live GS-020 handoff and compactly repeated below without broad logs.

The compact durable validation receipt is: direct imaging regressions 10/10;
focused imaging/timing/tutorial rerun 40/40; balance 13/13; all seven workspace
typechecks; player 438/438; production build 368 transformed modules; domain
342/343 with the sole loaded-suite five-second inventory timeout immediately
passing 3/3 in isolation; Sol browser acceptance 2/2 and independent parent
browser rerun 2/2. Both browser screenshots were visually reviewed. Owner
hands-on gameplay acceptance was not inferred; the owner explicitly authorized
this closeout after technical verification.

The shared `beta` checkout, index, branch, owner server and saves are outside
this isolated package and must remain untouched.
Parent staged-payload review confirmed only this package. Staged whitespace
checking passes with the patch artifact excluded: its reported trailing spaces
are required unified-diff blank context lines. The reconstructed source diff
passes whitespace checking. Package restore and nonempty-target refusal passed
independently before commit.
