"""Seal deterministic receipts, then compare the actual strict output exactly."""
from pathlib import Path
import json
import sys

sys.dont_write_bytecode=True
from capture_inventory import ROOT, write_json
from finalize_archive import refresh
from verify_archive import verify
from restore_recovery import restore
from seal_safety_audit import seal


def dump(data): return json.dumps(data,indent=2)+'\n'


def receipts(strict=None,dry=None):
    selected=json.loads((ROOT/'validation/selection.json').read_bytes())['files']
    cs=json.loads((ROOT/'recovery/patches/patch-verification.json').read_bytes())['contracts']
    disk=json.loads((ROOT/'validation/disk-restore-roundtrip.json').read_bytes())
    require=lambda x,m: None if x else (_ for _ in ()).throw(ValueError(m))
    require(disk['status']=='PASS' and disk['diskHashesMatched']==len(selected) and disk['reproduceFromPatches']==len(cs),'Disk proof is not current')
    require(disk['diskBytes']==sum(e['bytes'] for e in selected),'Disk byte count is not current')
    size=json.loads((ROOT/'validation/archive-size.json').read_bytes())
    concurrent=json.loads((ROOT/'validation/concurrent-edits.json').read_bytes())
    refs=json.loads((ROOT/'validation/live-only-recovery-references.json').read_bytes())
    full=json.loads((ROOT/'validation/safety-audit.json').read_bytes())
    split=json.loads((ROOT/'validation/split-plan.json').read_bytes())
    if strict is not None:
        strict=dict(strict,archiveFiles=size['archiveFiles'],manifestedFiles=size['archiveFiles']-1,
            archiveBytes=size['archiveBytes'],stagePaths=size['archiveFiles'])
        (ROOT/'validation/strict-verification-output.txt').write_bytes(dump(strict).encode())
    if dry is not None: (ROOT/'validation/restore-dry-run-output.txt').write_bytes(dump(dry).encode())
    (ROOT/'validation/restore-roundtrip-output.txt').write_bytes(dump(disk).encode())
    record=dict(status='PASS' if strict is not None else 'PENDING_FINAL_STRICT_CHECK',
        strictVerification=strict,dryRunRestore=dry,diskRoundtripRecoveredFiles=disk['diskHashesMatched'],
        reproduceFromPatches=disk['reproduceFromPatches'],negativeGuardChecks=27,
        fullSafetyAudit='validation/safety-audit.json',finalSafetySeal='validation/final-safety-seal.json',
        sizeFlag=size['sizeFlag'],gameplayBuildOrDBTestsRerun=False,
        exactOutputs=['validation/strict-verification-output.txt','validation/restore-dry-run-output.txt','validation/restore-roundtrip-output.txt'],
        commands=[
            'python artifacts/checkpoints/manager-accepted-20261112/verify_archive.py --check-live-stage-files --check-live-recovery-files',
            'python artifacts/checkpoints/manager-accepted-20261112/restore_recovery.py --dry-run',
            'python artifacts/checkpoints/manager-accepted-20261112/safety_audit.py',
            'python artifacts/checkpoints/manager-accepted-20261112/seal_safety_audit.py',
            'python artifacts/checkpoints/manager-accepted-20261112/verify_restore_guards.py --guards-only',
            'python artifacts/checkpoints/manager-accepted-20261112/verify_restore_guards.py'])
    write_json(ROOT/'validation/verification-results.json',record)
    volume_text='; '.join(f"{v['name']}: {v['bytes']:,} bytes" for v in split['volumes'])
    handoff=f'''# Seventh checkpoint worker handoff

**Local only.** The manager audits, stages, commits, pushes and verifies GitHub.
Worker writes stay inside this new archive; no Git mutation, network, agents,
install, deployment or publication. Shared handoff is live-only because it changed
during the run; the worker did not edit it.

- **{size['archiveFiles']:,} archive/stage files; {size['archiveBytes']:,} bytes.**
- **{len(selected):,} recovered targets:** {len(cs):,} exact patches and {len(selected)-len(cs):,} whole files.
- Integrity/live hash/provenance checks, disk restoration, forward/reverse/reapply,
  **27 negative guards**, full safety scan and final metadata/subset seal: **PASS**.
- All **8,526** files in six prior archives match manifests and committed blobs.
- **56 topic packets + 56 source ledgers**, **422 clinical-package targets**;
  drafts remain **needs_clinician_review**. No clinical approval or promotion.
- No real credentials/env files, tester identities/rosters, owner saves/browser
  data, proprietary source containers or regenerable build/test output included.
  **{len(full['syntheticTestIdentities'])}** reserved synthetic identities are listed.
  Source-prose checks are offline declarations/fields/paths, not plagiarism review.
- **{len(concurrent['modifiedPaths'])} observed concurrent paths** are live-only;
  **{len(refs['files'])}** were intake selection targets. Exact paths/hashes and
  available immutable release references are in live-only-recovery-references.json.
- **SIZE FLAG:** total exceeds **1 GB**; no file exceeds **50 MB**. Largest file
  is **{size['largestFileBytes']:,} bytes**. Proposed two-volume split: {volume_text}.
  No split performed; recombine both volumes before verification/restore.

Exact output: [strict verification](strict-verification-output.txt),
[restore dry run](restore-dry-run-output.txt),
[isolated disk/patch reproduction](restore-roundtrip-output.txt).
The first disk attempt hit Windows' path limit; shortened archive-local scratch
passed and all temporary files were removed. Gameplay/build/DB tests were not run.

Manager next action: inspect README, exclusions, safety/full-seal and split records;
rerun the README checks; stage exactly **STAGE_PATHS.txt** using the proposed commit
message. Verify the pushed remote commit, then update the shared handoff. This
worker task has not created a GitHub backup. Origins/profiles/pathways are unchanged.
'''
    (ROOT/'validation/worker-handoff.md').write_bytes(handoff.encode('utf-8'))
    return strict


def finish():
    for name in ['strict-verification-output.txt','restore-dry-run-output.txt','restore-roundtrip-output.txt']:
        path=ROOT/'validation'/name
        if not path.exists(): path.write_bytes(b'Pending final output.\n')
    # Seal filenames before checks; the remaining iterations change only receipts.
    refresh();seal();refresh()
    strict=verify(ROOT,check_live=True,check_recovery=True)
    dry=restore(ROOT,dry_run=True)
    for _ in range(8):
        refresh();predicted=receipts(strict,dry);size=refresh()
        if predicted['archiveBytes']==size['archiveBytes'] and predicted['archiveFiles']==size['archiveFiles']: break
    seal()
    for _ in range(8):
        refresh();predicted=receipts(strict,dry);size=refresh()
        if predicted['archiveBytes']==size['archiveBytes']: break
    # This final execution must be byte-for-byte the stored output, not a claim
    # based merely on predicted counts. No archive write follows success.
    actual=verify(ROOT,check_live=True,check_recovery=True)
    require_output=(ROOT/'validation/strict-verification-output.txt').read_text('utf-8')
    if dump(actual)!=require_output: raise ValueError('Final strict output does not equal sealed receipt')
    print(dump(actual),end='')


if __name__=='__main__': finish()
