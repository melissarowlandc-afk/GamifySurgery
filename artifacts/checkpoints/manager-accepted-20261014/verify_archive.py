"""Read-only, dependency-free verification of the sixth recovery checkpoint."""
from pathlib import Path, PurePosixPath
import argparse
import base64
import hashlib
import json
import re
import subprocess
import sys

sys.dont_write_bytecode = True
BASE_COMMIT = '10e3c228b361df59b60494b2033678b1ce094eed'
ARCHIVE_NAME = 'manager-accepted-20261014'


def sha(data):
    return hashlib.sha256(data).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def safe_path(root, relative):
    require(isinstance(relative, str) and bool(relative), 'Empty relative path')
    rel = PurePosixPath(relative)
    require(not rel.is_absolute() and all(part not in ('', '.', '..')
        for part in relative.split('/')), 'Unsafe relative path: ' + relative)
    require('\\' not in relative and ':' not in relative, 'Unsafe path syntax')
    require(all(not part.endswith(('.', ' ')) for part in rel.parts), 'Unsafe Windows path')
    reserved = {'CON', 'PRN', 'AUX', 'NUL'} | {f'{kind}{i}' for kind in ('COM', 'LPT') for i in range(1, 10)}
    require(all(part.split('.', 1)[0].upper() not in reserved for part in rel.parts), 'Reserved Windows path')
    require(not any(char in relative for char in '<>"|?*\x00'), 'Invalid path character')
    path = root.joinpath(*rel.parts).resolve()
    require(path.is_relative_to(root.resolve()), 'Path escapes its root')
    return path


def lf_lines(data):
    pieces = data.split(b'\n')
    return [p + b'\n' for p in pieces[:-1]] + ([pieces[-1]] if pieces[-1] else [])


def apply_patch_bytes(base, patch, reverse=False):
    """Apply exact unified hunks in memory, including CRLF and final newlines."""
    prepared = []
    for line in lf_lines(patch):
        if line.startswith(b'\\ No newline at end of file'):
            require(bool(prepared), 'Newline marker without preceding line')
            prepared[-1] = prepared[-1].removesuffix(b'\n')
        else:
            prepared.append(line)
    original = lf_lines(base)
    result, pos, i, hunks = [], 0, 0, 0
    while i < len(prepared):
        line = prepared[i]
        if line.startswith((b'--- ', b'+++ ', b'diff --git ', b'index ')):
            i += 1
            continue
        match = re.fullmatch(rb'@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@[^\n]*\n?', line)
        require(match is not None, 'Invalid unified hunk header')
        number = int(match[3] if reverse else match[1])
        count = int((match[4] if reverse else match[2]) or b'1')
        new_count = int((match[2] if reverse else match[4]) or b'1')
        start = number - (1 if count else 0)
        new_number = int(match[1] if reverse else match[3])
        new_start = new_number - (1 if new_count else 0)
        require(pos <= start <= len(original), 'Hunks are out of order')
        result.extend(original[pos:start])
        require(len(result) == new_start, 'Incorrect new hunk location')
        pos = start
        old, new = [], []
        i += 1
        while len(old) < count or len(new) < new_count:
            require(i < len(prepared), 'Incomplete patch body')
            tag, content = prepared[i][:1], prepared[i][1:]
            require(tag in (b' ', b'+', b'-'), 'Invalid patch body')
            if reverse and tag != b' ':
                tag = b'-' if tag == b'+' else b'+'
            if tag in (b' ', b'-'):
                old.append(content)
            if tag in (b' ', b'+'):
                new.append(content)
            i += 1
        require(len(old) == count and len(new) == new_count, 'Incorrect hunk counts')
        require(old == original[pos:pos+count], f'Context mismatch at line {pos+1}')
        result.extend(new)
        pos += count
        hunks += 1
    require(hunks > 0, 'Patch contains no hunks')
    result.extend(original[pos:])
    return b''.join(result)


def stored_bytes(root, relative, encoding='literal'):
    data = safe_path(root, relative).read_bytes()
    if encoding == 'literal':
        return data
    require(encoding == 'base64', 'Unknown storage encoding')
    require(data.endswith(b'\n') and b'\r' not in data, 'Encoded payload must be LF')
    return base64.b64decode(data[:-1], validate=True)


def contract_bytes(root, contract):
    base = stored_bytes(root, contract['base'], contract.get('baseStorageEncoding', 'literal'))
    patch = stored_bytes(root, contract['patch'], contract.get('patchStorageEncoding', 'literal'))
    require(sha(base) == contract['baseSha256'], 'Decoded base hash mismatch')
    require(sha(patch) == contract['patchSha256'], 'Decoded patch hash mismatch')
    return base, patch


def recovered_files(root):
    entries = json.loads((root/'validation/selection.json').read_bytes())['files']
    contracts = {c['path']: c for c in json.loads(
        (root/'recovery/patches/patch-verification.json').read_bytes())['contracts']}
    recovered = {}
    for entry in entries:
        relative = entry['path']
        safe_path(root/'recovery', relative)
        require(relative not in recovered, 'Duplicate recovery target')
        if entry['method'] == 'patch':
            base, patch = contract_bytes(root, contracts[relative])
            data = apply_patch_bytes(base, patch)
        else:
            require(entry['method'] == 'whole_owned_current_file', 'Unknown recovery method')
            data = safe_path(root/'recovery', relative).read_bytes()
        require(sha(data) == entry['sha256'] and len(data) == entry['bytes'],
            'Recovery mismatch: ' + relative)
        recovered[relative] = data
    return recovered


def verify(root, check_live=False, check_recovery=False):
    root = root.resolve()
    manifest = json.loads((root/'manifest.json').read_bytes())
    require(manifest['archive'] == ARCHIVE_NAME and manifest['baseCommit'] == BASE_COMMIT, 'Wrong baseline')
    require(manifest['manifestSelfExcluded'] is True and manifest['gitMutations'] == 0, 'Invalid manifest contract')
    listed, total = set(), 0
    for entry in manifest['files']:
        require(entry['path'] not in listed, 'Duplicate manifest entry')
        path = safe_path(root, entry['path'])
        require(not root.joinpath(*PurePosixPath(entry['path']).parts).is_symlink(), 'Archive symlink')
        data = path.read_bytes()
        require(len(data) == entry['bytes'] and sha(data) == entry['sha256'], 'Manifest mismatch: ' + entry['path'])
        require(len(data) <= 50_000_000, 'File exceeds 50 MB')
        # This incremental package contains only text, including lossless encoded bases.
        require(not data.startswith(b'\xef\xbb\xbf') and b'\r' not in data, 'BOM/CR in physical archive text')
        data.decode('utf-8')
        listed.add(entry['path'])
        total += len(data)
    actual = {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
    require(actual == listed | {'manifest.json'}, 'Unmanifested or missing archive files')
    manifest_data = (root/'manifest.json').read_bytes()
    require(b'\r' not in manifest_data and not manifest_data.startswith(b'\xef\xbb\xbf'), 'Manifest encoding')
    archive_bytes = total + len(manifest_data)
    require(len(manifest_data) <= 50_000_000 and archive_bytes < 400_000_000, 'Archive exceeds size limits')
    require((root/'.gitattributes').read_bytes() == b'* -text\n', 'Missing literal byte attributes')
    contracts = json.loads((root/'recovery/patches/patch-verification.json').read_bytes())['contracts']
    contract_paths = set()
    for c in contracts:
        require(c['path'] not in contract_paths, 'Duplicate patch target')
        safe_path(root/'recovery', c['path'])
        contract_paths.add(c['path'])
        base, patch = contract_bytes(root, c)
        after = apply_patch_bytes(base, patch)
        require(sha(after) == c['acceptedSha256'] and len(after) == c['acceptedBytes'], 'Forward patch mismatch')
        reverted = apply_patch_bytes(after, patch, reverse=True)
        require(reverted == base and apply_patch_bytes(reverted, patch) == after, 'Reverse/reapply mismatch')
    selection = json.loads((root/'validation/selection.json').read_bytes())
    recovery = recovered_files(root)
    require({e['path'] for e in selection['files'] if e['method'] == 'patch'} == contract_paths, 'Unreferenced patch')
    for relative, data in recovery.items():
        lower = relative.lower()
        require(not lower.startswith(('.local-dev/', '.claude/', 'test-results/', 'playwright-report/', 'apps/player/dist/')), 'Forbidden target')
        require(not lower.endswith(('.pdf', '.epub', '.pem', '.pfx', '.key', '.sqlite', '.db')), 'Forbidden payload type')
        require(not any(part.startswith('.env') and part != '.env.example' for part in PurePosixPath(relative).parts), 'Real env payload')
        require(not data.startswith(b'\xef\xbb\xbf') and b'\r' not in data, 'Recovered current source encoding')
        data.decode('utf-8')
    require(json.loads((root/'recovery/aliases.json').read_bytes())['files'] == [], 'Unexpected aliases')
    for name in ['requirement-coverage', 'prior-archive-integrity', 'clinical-source-invariance', 'safety-audit',
                 'clinical-review-audit', 'baseline-reconciliation']:
        require(json.loads((root/f'validation/{name}.json').read_bytes())['status'] == 'PASS', name + ' failed')
    require(json.loads((root/'validation/clinical-review-audit.json').read_bytes())['clinicalApprovalClaimed'] is False, 'Clinical promotion')
    stage = (root/'STAGE_PATHS.txt').read_text('utf-8').splitlines()
    require(len(stage) == len(set(stage)), 'Duplicate stage paths')
    prefix = 'artifacts/checkpoints/' + ARCHIVE_NAME + '/'
    require({p[len(prefix):] for p in stage if p.startswith(prefix)} == actual, 'Incomplete archive staging list')
    stage_sources = json.loads((root/'validation/stage-sources.json').read_bytes())['files']
    require({p for p in stage if not p.startswith(prefix)} == {e['path'] for e in stage_sources}, 'Stage ownership mismatch')
    require(all(e['ownership'] == 'wholly_owned_accepted_doc_or_record' for e in stage_sources), 'Shared stage target')
    repo = root.parents[2]
    for p in stage:
        safe_path(repo, p)
    live_checked = recovery_checked = prior_checked = bases_checked = clinical_checked = 0
    if check_live:
        for e in stage_sources:
            data = safe_path(repo, e['path']).read_bytes()
            require(sha(data) == e['sha256'] and len(data) == e['bytes'], 'Live stage drift: ' + e['path'])
            live_checked += 1
    if check_recovery:
        live_targets = {e['path']: e for e in selection['files'] + selection['unchangedAlreadyPreserved']
            + json.loads((root/'validation/unchanged-prior-targets.json').read_bytes())['files']}
        for e in live_targets.values():
            data = safe_path(repo, e['path']).read_bytes()
            require(sha(data) == e['sha256'] and len(data) == e['bytes'], 'Live target drift: ' + e['path'])
            recovery_checked += 1
        for e in json.loads((root/'validation/prior-archive-integrity.json').read_bytes())['archives']:
            prior_root = safe_path(repo, e['path'])
            data = (prior_root/'manifest.json').read_bytes()
            require(sha(data) == e['manifestSha256'], 'Prior manifest drift')
            prior_manifest = json.loads(data)
            prior_paths = set()
            for prior_entry in prior_manifest['files']:
                physical = safe_path(prior_root, prior_entry['path']).read_bytes()
                require(sha(physical) == prior_entry['sha256'] and len(physical) == prior_entry['bytes'],
                    'Prior archive payload drift: ' + e['path'] + '/' + prior_entry['path'])
                prior_paths.add(prior_entry['path'])
                prior_checked += 1
            require({p.relative_to(prior_root).as_posix() for p in prior_root.rglob('*') if p.is_file()}
                == prior_paths | {'manifest.json'}, 'Prior archive file inventory drift')
        for c in contracts:
            provenance = c['baseProvenance']
            if provenance['kind'] == 'baseline_HEAD_blob':
                result = subprocess.run(['git', 'show', provenance['gitObject']], cwd=repo, capture_output=True)
                require(result.returncode == 0, 'Cannot read baseline Git blob')
                historical = result.stdout
            else:
                prior_root = safe_path(repo, provenance['archive'])
                if provenance['kind'] == 'prior_archive_latest_accepted_patch_result':
                    historical = apply_patch_bytes(safe_path(prior_root, provenance['base']).read_bytes(),
                        safe_path(prior_root, provenance['patch']).read_bytes())
                else:
                    payload = provenance.get('payload') or 'recovery/' + provenance['copyFrom']
                    historical = safe_path(prior_root, payload).read_bytes()
            require(sha(historical) == c['baseSha256'], 'Historical patch base provenance drift')
            bases_checked += 1
        clinical_receipt = json.loads((root/'validation/clinical-source-invariance.json').read_bytes())
        clinical_targets = {e['path']: e for e in clinical_receipt['files'] + clinical_receipt['completeClinicalPackagePreBetaIntake']}
        for e in clinical_targets.values():
            require(sha(safe_path(repo, e['path']).read_bytes()) == e['sha256'], 'Live clinical source drift')
            clinical_checked += 1
    return dict(status='PASS', manifestedFiles=len(listed), archiveFiles=len(actual),
        archiveBytes=archive_bytes, patchContracts=len(contracts), forwardReverseReapply=len(contracts),
        recoveredTargets=len(recovery), wholeOwnedTargets=len(recovery)-len(contracts),
        stagePaths=len(stage), liveStageSourcesChecked=live_checked,
        liveRecoveryTargetsChecked=recovery_checked, priorArchivePayloadsChecked=prior_checked,
        historicalPatchBasesChecked=bases_checked, liveClinicalSourcesChecked=clinical_checked,
        gitMutations=0, workingTreeWrites=0)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check-live-stage-files', action='store_true')
    parser.add_argument('--check-live-recovery-files', action='store_true')
    args = parser.parse_args()
    print(json.dumps(verify(Path(__file__).resolve().parent,
        args.check_live_stage_files, args.check_live_recovery_files), indent=2))
