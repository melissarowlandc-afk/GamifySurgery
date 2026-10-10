"""Read-only, dependency-free verification of the third recovery checkpoint."""
from pathlib import Path, PurePosixPath
import argparse
import hashlib
import json
import re


def sha(data):
    return hashlib.sha256(data).hexdigest()


def lf_lines(data):
    pieces = data.split(b'\n')
    return [p + b'\n' for p in pieces[:-1]] + ([pieces[-1]] if pieces[-1] else [])


def safe_path(root, relative):
    rel = PurePosixPath(relative)
    assert relative and not rel.is_absolute() and '..' not in rel.parts
    assert '\\' not in relative and ':' not in relative, 'Unsafe relative path'
    path = root.joinpath(*rel.parts).resolve()
    assert path.is_relative_to(root.resolve()), 'Path escapes its root'
    return path


def apply_patch_bytes(base, patch, reverse=False):
    """Apply exact unified hunks in memory, preserving CRLF and final newlines."""
    prepared = []
    for line in lf_lines(patch):
        if line.startswith(b'\\ No newline at end of file'):
            assert prepared, 'Newline marker has no preceding line'
            prepared[-1] = prepared[-1].removesuffix(b'\n')
        else:
            prepared.append(line)
    original = lf_lines(base)
    result = []
    pos = 0
    i = 0
    hunks = 0
    while i < len(prepared):
        line = prepared[i]
        if line.startswith((b'--- ', b'+++ ', b'diff --git ', b'index ')):
            i += 1
            continue
        match = re.fullmatch(rb'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@[^\n]*\n?', line)
        assert match, 'Invalid unified hunk header'
        start_number = int(match[3] if reverse else match[1])
        count = int((match[4] if reverse else match[2]) or b'1')
        new_count = int((match[2] if reverse else match[4]) or b'1')
        start = start_number - (1 if count else 0)
        new_start_number = int(match[1] if reverse else match[3])
        new_start = new_start_number - (1 if new_count else 0)
        assert pos <= start <= len(original), 'Hunks are out of order'
        result.extend(original[pos:start])
        assert len(result) == new_start, 'Incorrect new hunk location'
        pos = start
        old = []
        new = []
        i += 1
        while len(old) < count or len(new) < new_count:
            assert i < len(prepared), 'Incomplete patch body'
            tag, content = prepared[i][:1], prepared[i][1:]
            assert tag in (b' ', b'+', b'-'), 'Invalid patch body'
            if reverse and tag != b' ':
                tag = b'-' if tag == b'+' else b'+'
            if tag in (b' ', b'-'):
                old.append(content)
            if tag in (b' ', b'+'):
                new.append(content)
            i += 1
        assert len(old) == count and len(new) == new_count, 'Incorrect hunk counts'
        assert old == original[pos:pos+count], f'Context mismatch at line {pos+1}'
        result.extend(new)
        pos += count
        hunks += 1
    assert hunks, 'Patch contains no hunks'
    result.extend(original[pos:])
    return b''.join(result)


def verify(root, check_live=False, check_recovery=False):
    root = root.resolve()
    manifest = json.loads((root/'manifest.json').read_bytes())
    listed = set()
    total = 0
    for entry in manifest['files']:
        assert entry['path'] not in listed, 'Duplicate manifest entry'
        path = safe_path(root, entry['path'])
        data = path.read_bytes()
        assert len(data) == entry['bytes'], f'Size mismatch: {entry["path"]}'
        assert sha(data) == entry['sha256'], f'Hash mismatch: {entry["path"]}'
        assert len(data) <= 50_000_000, f'File exceeds 50 MB: {entry["path"]}'
        listed.add(entry['path'])
        total += len(data)
    actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
    assert actual == listed | {'manifest.json'}, f'Unmanifested or missing files: {actual ^ (listed | {"manifest.json"})}'
    archive_bytes = total + (root/'manifest.json').stat().st_size
    assert archive_bytes < 400_000_000, 'Archive exceeds 400 MB'
    assert (root/'.gitattributes').read_bytes() == b'* -text\n'
    contracts = json.loads((root/'recovery/patches/patch-verification.json').read_bytes())['contracts']
    contract_paths = set()
    for c in contracts:
        assert c['path'] not in contract_paths, 'Duplicate target contract'
        contract_paths.add(c['path'])
        base = safe_path(root,c['base']).read_bytes()
        patch = safe_path(root,c['patch']).read_bytes()
        assert sha(base) == c['baseSha256']
        assert sha(patch) == c['patchSha256']
        after = apply_patch_bytes(base,patch)
        assert sha(after) == c['acceptedSha256'], f'Forward mismatch: {c["id"]}'
        assert len(after) == c['acceptedBytes']
        reverted = apply_patch_bytes(after,patch,reverse=True)
        assert reverted == base, f'Reverse mismatch: {c["id"]}'
        assert apply_patch_bytes(reverted,patch) == after, f'Reapply mismatch: {c["id"]}'
    repo = root.parents[2]
    selection = json.loads((root/'validation/selection.json').read_bytes())['files']
    source_paths = set()
    for e in selection:
        assert e['path'] not in source_paths
        source_paths.add(e['path'])
        if e['method']=='patch':
            assert e['path'] in contract_paths
            c=next(c for c in contracts if c['path']==e['path'])
            assert c['acceptedSha256']==e['sha256'] and c['acceptedBytes']==e['bytes']
        else:
            data=safe_path(root/'recovery',e['path']).read_bytes()
            assert len(data)==e['bytes'] and sha(data)==e['sha256']
        assert not e['path'].startswith(('.local-dev/', '.claude/', '.pnpm-store/'))
        assert e['path'] != 'docs/design/mobile-discovery-20261009.md'
    assert len(selection) == len(contract_paths) + sum(e['method'] != 'patch' for e in selection)
    assert manifest['baseCommit'] == 'ed638d2c7444f4f587c347234881d7c7c631fc79'
    aliases = json.loads((root/'recovery/aliases.json').read_bytes())['files']
    assert aliases==[], 'This checkpoint retains all selected whole files directly'
    stage=(root/'STAGE_PATHS.txt').read_text('utf-8').splitlines()
    assert len(stage)==len(set(stage)), 'Duplicate stage paths'
    prefix=root.relative_to(repo).as_posix()+'/'
    staged_archive={p.removeprefix(prefix) for p in stage if p.startswith(prefix)}
    assert staged_archive==actual, 'Stage list does not enumerate the archive exactly'
    receipt=json.loads((root/'validation/stage-sources.json').read_bytes())
    live_paths={e['path'] for e in receipt['files']}
    assert {p for p in stage if not p.startswith(prefix)}==live_paths
    assert all(e['ownership'] == 'wholly_owned_accepted_doc_or_approval_record' for e in receipt['files'])
    assert json.loads((root/'validation/safety-audit.json').read_bytes())['status'] == 'PASS'
    live_checked=0
    if check_live:
        for e in receipt['files']:
            data=safe_path(repo,e['path']).read_bytes()
            assert sha(data)==e['sha256'] and len(data)==e['bytes'], f'Live stage source drifted: {e["path"]}'
            live_checked+=1
    recovery_checked=0
    if check_recovery:
        for e in selection:
            data=safe_path(repo,e['path']).read_bytes()
            assert sha(data)==e['sha256'] and len(data)==e['bytes'], f'Live recovery target drifted: {e["path"]}'
            recovery_checked+=1
    return {'status':'PASS','manifestedFiles':len(listed),'archiveFiles':len(actual),
            'archiveBytes':archive_bytes,'patchContracts':len(contracts),
            'forwardReverseReapply':len(contracts),'recoveredTargets':len(selection),
            'wholeOwnedTargets':len(selection)-len(contracts),'stagePaths':len(stage),
            'liveStageSourcesChecked':live_checked,'liveRecoveryTargetsChecked':recovery_checked,
            'gitMutations':0,'workingTreeWrites':0}


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check-live-stage-files',action='store_true')
    parser.add_argument('--check-live-recovery-files',action='store_true')
    args=parser.parse_args()
    print(json.dumps(verify(Path(__file__).resolve().parent,args.check_live_stage_files,args.check_live_recovery_files),indent=2))
