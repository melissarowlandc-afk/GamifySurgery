# Sol worker handback — second recovery archive

Bounded milestone complete locally. Only the new archive and ignored worker-owned
preparation/restore scratch were written. No live implementation, manager
coordination record, first archive, index, commit, branch, browser storage or owner
save was changed. No delegation, dependency install, commit, push, deployment or
external message occurred.

## Deliverables

`artifacts/checkpoints/manager-accepted-20261008b/` follows the first archive's
structure: README, manifest, whole-file recovery, exact shared-file patches and
bundled bases, patch verification, exclusions, validation, exact staging list,
proposed commit message, independent verifier, clinical audit and restore script.
`validation/archive-size.json` gives the exact final size and file count.

Recovered scope: 860 accepted targets, consisting of 786 whole files and 74 patch
contracts. Bases are 20 first-archive latest accepted patch results, 10 earlier
whole-file recoveries and 44 HEAD files. The archive closes both earlier gaps at
the current accepted Canvas and approved Pediatric Waiting revision-2 state.
All five Level 4 design approvals are preserved or already in HEAD; all 40 pinned
approval hashes match. Founder's Office stays **design pending**.

The staging list contains this archive plus 49 wholly new owned docs/records.
Shared owner-requests/current-handoff records and live runtime are not staged.
Whole files absent from both HEAD and the first archive represent their first
recoverable accepted state; the source-selection receipt makes that explicit.

## Validation performed by this worker

```text
python artifacts/checkpoints/manager-accepted-20261008b/verify_archive.py --check-live-stage-files --check-live-recovery-files
PASS: manifest hashes/sizes/member set; all 74 forward/reverse/reapply contracts;
860 accepted live targets; 49 original staging-record hashes; exact stage list.

python artifacts/checkpoints/manager-accepted-20261008b/restore_recovery.py --dry-run
PASS: 860 files / 112528082 reconstructed source bytes.

python artifacts/checkpoints/manager-accepted-20261008b/restore_recovery.py --destination .local-dev/manager-accepted-20261008b/restore-check
PASS: actual empty-directory restore, all 860 files independently compared
byte-for-byte by length and SHA-256; no missing or unlisted file.

node artifacts/checkpoints/manager-accepted-20261008b/clinical_review_audit.mjs
PASS: 182 authoring concepts, 728 questions, 364 claims, 186 sources and 620 case
reviews are needs_clinician_review; no clinician approval; eight manifests forbid
public release. Statistics/ethics 28/112/63/30/108 unchanged.

git check-ignore --no-index --stdin -z
Exit 1, no ignored physical stage or logical recovery path.
```

Additional checks: UTF-8 without BOM for archive text; nine patch/newline/CRLF
edge cases and five rejected path escapes; no credential/key/token matches,
personal identifier/email contacts or campaign-shaped JSON payloads; no private
clinical/source corpus/PDF, browser export, owner save or raw scratch tree.
First archive independently verifies (2,456 files / 60 contracts); its manifest,
the Git index and tracked diff retain their intake hashes. No gameplay test suite
was rerun for this artifact-only task. Small historical worker test outputs retain
both source and archive hashes and clear encoding-conversion labels.

## Exclusions and manager decisions

- Economy audit: docs/design/room-economy-audit-20261008.md and tools/economy-audit/**.
  This known active lane is excluded by prefix, including future files; captured
  per-file sizes are evidence at the archive cutoff.
- 532 scoped regenerable proof-history/comparison files, totaling 45,715,342 bytes,
  are omitted and listed individually. Current proofs, originals, prompts,
  provenance, validators, JSON receipts and representative views remain.
- Earlier unrelated dirty work, caches and first-archive duplicates are omitted.
  The much larger overall exclusion byte total measures those inventoried
  candidates, not missing accepted recovery requirements.
- No recovery gap or size exception requires a packaging decision. The manager
  retains final scope/staging audit and approval of original-record staging.
- Founder's Office still requires owner design review; this does not block a
  backup that labels it as pending.
- Historical latest gameplay validation: domain 3508/3508 and root typecheck pass;
  player 1114 passed / 1 pre-existing external-thyroid pending-label assertion.
  Keep that limitation explicit; do not describe this as an entirely green suite.

Immediately before staging, rerun the verifier with both live flags and re-audit
any drift. After audit, stage only STAGE_PATHS.txt, inspect staged hashes/content,
use PROPOSED_COMMIT_MESSAGE.txt, commit/push the current branch and verify the remote
commit. Then add the pushed branch/commit and this archive's recovery/size receipt
to docs/handoffs/CURRENT_THREAD_HANDOFF.md. Owner authorization already exists;
the worker has not created a GitHub backup itself.

Owner pathway is unchanged: START_GAME.cmd → exact http://127.0.0.1:4173 in the
usual persistent profile. Local/remote campaigns remain separate.
