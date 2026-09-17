# GS-017 scoped backup audit

## Conclusion

GS-017 cannot be represented as a conventional runnable change against clean
HEAD `c26c96a111103d8665e33c9258ef54071d729f14`. Its chart/session, alert-state,
persistence and browser fixtures depend on inherited uncommitted foundations.
Copying that foundation would mix unrelated milestones into this backup.

This package instead preserves the task baseline and a deterministic GS-017
reconstruction. Shared alert files were reconstructed over the captured task
baseline. Concurrent GS-020 imaging changes were subtracted with the separately
audited GS-020 reconstruction patch. Later GS-017 owner follow-ups remain in
scope: staff-hired and praise suppression, daily low-cash behavior, and
clinic-wide complaint wording with narrow legacy display normalization.

## Exact accepted scope

`manifest.json` is authoritative and records 34 accepted paths:

- 10 player session/UI source and focused-test paths for plain alert history
  and one-action chart close.
- 1 alert catalog path; 6 domain source paths; 7 domain regression/diagnostic
  paths.
- 1 combined Playwright specification.
- The GS-017 ExecPlan and handoff snapshots plus only the three GS-011-006,
  GS-011-008 and GS-011-009 feedback updates from the shared playtest log.
- 6 reviewed GS-017 browser screenshots. The superseded grouping screenshot
  and both GS-016 screenshots are excluded.

The reconstruction covers plain feed presentation; check-in/result and staff
noise suppression; persistent alert thresholds, cooldowns, staggering and
migration; 120-minute humor cadence; no-arrival timing; one-action chart close;
and the bounded day-six patient-supply diagnosis.

## Mixed-file reconstruction and exclusions

The following accepted files deliberately differ from the complete current
shared-tree bytes because unrelated hunks were removed or the document was
narrowed: `alertViewModels.ts`, `viewModels.ts`, `prototype-alerts.ts`,
`facility-experience.ts`, `persistence.ts`, `reducer.ts`, `types.ts`,
`facility-experience.test.ts`, and the shared owner playtest log.

Excluded material includes GS-020 ultrasound-first imaging, mobile imaging
workers, room/control requirements and imaging guidance; unrelated balance,
clinical, staff-routing, facility, art, renderer and graphics work; GS-016
artifacts; the superseded grouped-alert screenshot; owner saves/browser data;
build outputs; local result directories; PM-board state; and later unrelated
feedback-log intake.

## Applicability and dependencies

The `a/` files are the ignored task baseline captured from the integrated dirty
tree, not clean HEAD. They contain prerequisites from earlier persistence,
facility, chart and alert foundations. Consequently this package is evidence
and reconstruction only; it is not merge-ready or independently runnable.

The backup branch may start at clean HEAD solely to store this durable package.
It must not claim that applying the runtime patch to that HEAD yields a working
game. The backup-branch push is outside the Pages workflow's `main`-only push
trigger and job condition; no deployment is implied.

## Validation provenance

Parent-integrated validation before packaging reports alert-focused domain
33/33; player alert/UI/chart 46/46; player typecheck; all workspace typechecks
and boundaries. The sustained patient diagnostic passed and documented 78
arrivals/completions through eight game days with a finite eligibility boundary.
Browser validation reports production 4/4, development fresh-campaign 1/1, and
a latest-bundle plain-alert smoke 1/1. Six GS-017 screenshots were reviewed.
Full shared suites retain unrelated known failures documented in the handoff.

The shared beta checkout, index, branch, owner server and saves remain outside
this package and must remain untouched.

## Package verification

The binary patch passed preflight against a fresh copy of `a/`. The restore
script reproduced all 34 accepted SHA-256 hashes and refused a second restore
into the populated target. The manifest contains no malformed HEAD blob IDs;
the scoped source diff passes whitespace checking; and a common credential
pattern scan returned no matches. Patch stat is 34 paths, 2,955 insertions and
356 deletions. Final patch SHA-256 is
`72efcb37b1679c52c62d883e5b6a7f4540519eccdc36b969f3991df970da9a82`.
