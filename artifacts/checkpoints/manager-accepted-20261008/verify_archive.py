"""Read-only, dependency-free verification of this recovery checkpoint."""
from pathlib import Path
import argparse
import hashlib
import json
import re


def sha(data):
    return hashlib.sha256(data).hexdigest()


def lf_lines(data):
    pieces = data.split(b'\n')
    return [p + b'\n' for p in pieces[:-1]] + ([pieces[-1]] if pieces[-1] else [])


def apply_patch_bytes(base, patch, reverse=False):
    """Apply exact unified hunks in memory, without Git or a working-tree write."""
    prepared = []
    for line in lf_lines(patch):
        if line.startswith(b'\\ No newline at end of file'):
            prepared[-1] = prepared[-1].removesuffix(b'\n')
        else:
            prepared.append(line)
    original = lf_lines(base)
    result = []
    pos = 0
    i = 0
    while i < len(prepared):
        if not prepared[i].startswith(b'@@ '):
            i += 1
            continue
        match = re.match(rb'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@', prepared[i])
        assert match, 'Invalid unified hunk header'
        start_number = int(match[3] if reverse else match[1])
        count = int((match[4] if reverse else match[2]) or b'1')
        start = start_number - (1 if count else 0)
        assert pos <= start <= len(original), 'Hunks are out of order'
        result.extend(original[pos:start])
        pos = start
        old = []
        new = []
        i += 1
        while i < len(prepared) and not prepared[i].startswith((b'@@ ', b'--- ', b'diff --git ')):
            tag, content = prepared[i][:1], prepared[i][1:]
            assert tag in (b' ', b'+', b'-'), 'Invalid patch body'
            if reverse and tag != b' ':
                tag = b'-' if tag == b'+' else b'+'
            if tag in (b' ', b'-'):
                old.append(content)
            if tag in (b' ', b'+'):
                new.append(content)
            i += 1
        assert old == original[pos:pos + len(old)], f'Context mismatch at line {pos + 1}'
        assert len(old) == count, 'Incorrect old hunk count'
        expected_new = int((match[2] if reverse else match[4]) or b'1')
        assert len(new) == expected_new, 'Incorrect new hunk count'
        result.extend(new)
        pos += len(old)
    result.extend(original[pos:])
    return b''.join(result)


def verify(root, check_live=False):
    root = root.resolve()
    manifest = json.loads((root / 'manifest.json').read_bytes())
    listed = set()
    total = 0
    for entry in manifest['files']:
        path = (root / entry['path']).resolve()
        assert path.is_relative_to(root), 'Manifest path escapes archive'
        data = path.read_bytes()
        assert len(data) == entry['bytes'], f'Size mismatch: {entry["path"]}'
        assert sha(data) == entry['sha256'], f'Hash mismatch: {entry["path"]}'
        assert len(data) <= 50_000_000, f'File exceeds 50 MB: {entry["path"]}'
        listed.add(entry['path'])
        total += len(data)
    actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
    assert actual == listed | {'manifest.json'}, f'Unmanifested or missing archive files: {actual ^ (listed | {"manifest.json"})}'
    contracts = json.loads((root / 'recovery/patches/patch-verification.json').read_bytes())['contracts']
    for contract in contracts:
        base = (root / contract['base']).read_bytes()
        patch = (root / contract['patch']).read_bytes()
        assert sha(base) == contract['baseSha256']
        assert sha(patch) == contract['patchSha256']
        after = apply_patch_bytes(base, patch)
        assert sha(after) == contract['acceptedSha256'], f'Forward mismatch: {contract["id"]}'
        assert len(after) == contract['acceptedBytes']
        reverted = apply_patch_bytes(after, patch, reverse=True)
        assert reverted == base, f'Reverse mismatch: {contract["id"]}'
        assert apply_patch_bytes(reverted, patch) == after, f'Reapply mismatch: {contract["id"]}'
    stage = (root / 'STAGE_PATHS.txt').read_text(encoding='utf-8').splitlines()
    assert len(stage) == len(set(stage)), 'Duplicate stage paths'
    repo = root.parents[2]
    archive_prefix = root.relative_to(repo).as_posix() + '/'
    staged_archive = {p.removeprefix(archive_prefix) for p in stage if p.startswith(archive_prefix)}
    assert staged_archive == actual, 'Stage list does not enumerate the complete archive'
    live_checked = 0
    if check_live:
        receipt = json.loads((root / 'validation/stage-sources.json').read_bytes())
        for entry in receipt['files']:
            data = (repo / entry['path']).read_bytes()
            assert sha(data) == entry['sha256'], f'Live stage source drifted; manager must re-audit: {entry["path"]}'
            live_checked += 1
    return {'status': 'PASS', 'manifestedFiles': len(listed), 'archiveFiles': len(actual),
            'manifestedBytes': total, 'archiveBytes': total + (root / 'manifest.json').stat().st_size,
            'patchContracts': len(contracts), 'forwardReverseReapply': len(contracts),
            'stagePaths': len(stage), 'liveStageSourcesChecked': live_checked,
            'gitMutations': 0, 'workingTreeWrites': 0}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check-live-stage-files', action='store_true')
    args = parser.parse_args()
    print(json.dumps(verify(Path(__file__).resolve().parent, args.check_live_stage_files), indent=2))
