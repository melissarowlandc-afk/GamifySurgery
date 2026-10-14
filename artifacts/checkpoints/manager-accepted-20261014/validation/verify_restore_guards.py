"""Verify isolated disk recovery and corruption/path/overwrite rejection.

Run from the repository root with --scratch <new-empty-directory>. Scratch is
retained for review. No live targets, Git state, owner saves or prior archives
are written. Output is a JSON receipt, not an assertion of gameplay acceptance.
"""
from pathlib import Path
import argparse
import base64
import json
import shutil
import sys

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from verify_archive import apply_patch_bytes, contract_bytes, recovered_files, require, safe_path, sha, stored_bytes, verify
from restore_recovery import destination_guard, restore


def check(scratch):
    verify(ROOT)
    scratch = destination_guard(ROOT, scratch)
    scratch.mkdir(parents=True, exist_ok=True)
    copy = scratch/'corruption-copy'
    shutil.copytree(ROOT, copy)
    tests = []

    def rejects(label, operation):
        try:
            operation()
        except ValueError as error:
            tests.append(dict(test=label, status='PASS', rejection=str(error)))
            return
        raise RuntimeError('Guard accepted invalid input: ' + label)

    target = copy/'recovery/apps/player/.env.example'
    original = target.read_bytes()
    target.write_bytes(original+b'# corruption\n')
    rejects('Manifest payload corruption', lambda: verify(copy))
    target.write_bytes(original)

    manifest_path = copy/'manifest.json'
    original_manifest = manifest_path.read_bytes()
    manifest = json.loads(original_manifest)
    manifest['files'].append(manifest['files'][0])
    manifest_path.write_bytes(json.dumps(manifest).encode()+b'\n')
    rejects('Duplicate manifest entry', lambda: verify(copy))
    manifest_path.write_bytes(original_manifest)

    unexpected = copy/'unexpected.txt'
    unexpected.write_bytes(b'unmanifested\n')
    rejects('Unmanifested file', lambda: verify(copy))
    unexpected.unlink()
    for relative in ['../escape', '/absolute', 'C:/escape', 'a\\b', '.', 'a/../b',
                     'a//b', 'CON', 'a/NUL.txt', 'a/trailing.', 'a/trailing ']:
        rejects('Unsafe relative path: ' + relative, lambda rel=relative: safe_path(copy, rel))

    contracts = json.loads((ROOT/'recovery/patches/patch-verification.json').read_bytes())['contracts']
    base, patch = contract_bytes(ROOT, contracts[0])
    rejects('Patch context mismatch', lambda: apply_patch_bytes(b'incorrect\n', patch))
    rejects('Malformed patch', lambda: apply_patch_bytes(base, b'@@ invalid\n'))
    rejects('Incomplete patch hunk', lambda: apply_patch_bytes(b'a\n', b'@@ -1 +1 @@\n-a\n'))
    encoded = scratch/'invalid.base64'
    encoded.write_bytes(b'!invalid!\n')
    rejects('Invalid encoded base', lambda: stored_bytes(scratch, 'invalid.base64', 'base64'))
    rejects('Unknown storage encoding', lambda: stored_bytes(scratch, 'invalid.base64', 'unknown'))

    no_newline = b'--- a/sample\n+++ b/sample\n@@ -1 +1 @@\n-a\n\\ No newline at end of file\n+b\n\\ No newline at end of file\n'
    require(apply_patch_bytes(b'a', no_newline) == b'b', 'Final newline fidelity')
    require(apply_patch_bytes(b'b', no_newline, True) == b'a', 'Reverse final newline fidelity')
    insert = b'--- a/sample\n+++ b/sample\n@@ -0,0 +1 @@\n+value\n'
    require(apply_patch_bytes(b'', insert) == b'value\n', 'Empty-base insertion fidelity')
    require(apply_patch_bytes(b'value\n', insert, True) == b'', 'Empty-base reverse fidelity')
    tests.append(dict(test='Final newline and empty-base round-trips', status='PASS'))

    protected = scratch/'protected'
    protected.mkdir()
    sentinel = protected/'sentinel.txt'
    sentinel.write_bytes(b'preserve existing bytes\n')
    rejects('Nonempty destination overwrite', lambda: restore(ROOT, protected))
    require(sentinel.read_bytes() == b'preserve existing bytes\n', 'Existing destination changed')
    rejects('Archive-overlap destination', lambda: destination_guard(ROOT, ROOT/'must-not-create'))
    require(not (ROOT/'must-not-create').exists(), 'Overlap test created an archive path')

    destination = scratch/'restored'
    disk_result = restore(ROOT, destination)
    files = recovered_files(ROOT)
    actual = {p.relative_to(destination).as_posix(): p.read_bytes()
        for p in destination.rglob('*') if p.is_file()}
    require(actual == files, 'Disk round-trip bytes or inventory mismatch')
    repo = ROOT.parents[2]
    for rel, data in actual.items():
        require(safe_path(repo, rel).read_bytes() == data, 'Live target changed: ' + rel)
    verify(copy)
    return dict(status='PASS', negativeGuardTests=dict(status='PASS', tests=tests, count=len(tests)),
        diskRestoreRoundtrip=dict(status='PASS', recoveredFiles=len(files),
            recoveredBytes=sum(map(len, files.values())), exactInventoryAndBytes=True,
            liveMatches=True, diskRestore=disk_result),
        scratchDirectory=str(scratch), priorArchivesWritten=0, liveTargetsWritten=0,
        gitMutations=0, ownerStorageAccessed=False)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--scratch', type=Path, required=True)
    args = parser.parse_args()
    print(json.dumps(check(args.scratch), indent=2))
