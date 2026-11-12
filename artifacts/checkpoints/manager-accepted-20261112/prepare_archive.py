"""Prepare checkpoint seven locally. All writes stay inside this archive."""
from pathlib import Path
from collections import Counter, defaultdict
from datetime import datetime, timezone
import base64
import difflib
import hashlib
import importlib.util
import json
import os
import re
import shutil
import subprocess
import sys

sys.dont_write_bytecode = True
from capture_inventory import ROOT, REPO, PREFIX, BASE, ENV, LIVE_TOPIC, exclusion, git, sha, write_json

PRIOR_NAMES = ['20261008', '20261008b', '20261009', '20261010', '20261012', '20261014']
PRIOR6 = REPO / 'artifacts/checkpoints/manager-accepted-20261014'
RELEASE_REPO = Path('C:/Users/rowla/Projects/GS-release')
RELEASE_COMMIT = '3bc237a19a7ae5d965ce07e20afcc3e3c942f5d2'
spec = importlib.util.spec_from_file_location('checkpoint6_verifier', PRIOR6 / 'verify_archive.py')
prior_verifier = importlib.util.module_from_spec(spec)
spec.loader.exec_module(prior_verifier)


def load(path):
    return json.loads(path.read_bytes())


def write(relative, data):
    path = ROOT / relative
    assert path.resolve().is_relative_to(ROOT.resolve())
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


class GitObjects:
    def __init__(self, repo=REPO):
        self.proc = subprocess.Popen(['git', 'cat-file', '--batch'], cwd=repo, env=ENV,
            stdin=subprocess.PIPE, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    def read(self, obj):
        self.proc.stdin.write(obj.encode('utf-8') + b'\n')
        self.proc.stdin.flush()
        line = self.proc.stdout.readline().rstrip(b'\n')
        if line.endswith(b' missing'):
            return None
        oid, kind, length = line.split()
        data = self.proc.stdout.read(int(length))
        assert len(data) == int(length) and self.proc.stdout.read(1) == b'\n'
        return data
    def close(self):
        self.proc.stdin.close()
        self.proc.wait()
        assert self.proc.returncode == 0


def tree(commit=BASE, repo=REPO):
    data = subprocess.check_output(['git', 'ls-tree', '-r', '-z', commit], cwd=repo, env=ENV)
    entries = {}
    for line in data.split(b'\0'):
        if not line: continue
        meta, rel = line.split(b'\t', 1)
        mode, kind, oid = meta.decode().split()
        if kind == 'blob': entries[rel.decode('utf-8')] = oid
    return entries


def prior_targets():
    result = {}
    unchanged = load(PRIOR6 / 'validation/unchanged-prior-targets.json')['files']
    selection = load(PRIOR6 / 'validation/selection.json')
    for e in unchanged + selection.get('unchangedAlreadyPreserved', []):
        provenance = e.get('baselineProvenance') or e.get('baseProvenance')
        result[e['path']] = dict(path=e['path'], sha256=e['sha256'], bytes=e['bytes'], provenance=provenance)
    contracts = {c['path']: c for c in load(PRIOR6 / 'recovery/patches/patch-verification.json')['contracts']}
    for e in selection['files']:
        provenance = dict(kind='prior_archive_latest_accepted_whole_file',
            archive=PRIOR6.relative_to(REPO).as_posix(), payload='recovery/' + e['path'])
        if e['method'] == 'patch':
            c = contracts[e['path']]
            provenance = dict(kind='prior_archive_latest_accepted_patch_result',
                archive=PRIOR6.relative_to(REPO).as_posix(), contractId=c['id'])
        result[e['path']] = dict(path=e['path'], sha256=e['sha256'], bytes=e['bytes'], provenance=provenance)
    return result


def prior_bytes(entry):
    provenance = entry['provenance']
    archive = REPO / provenance['archive']
    if provenance['kind'].endswith('patch_result'):
        cs = load(archive / 'recovery/patches/patch-verification.json')['contracts']
        c = next(c for c in cs if c['id'] == provenance['contractId'])
        base, patch = prior_verifier.contract_bytes(archive, c)
        data = prior_verifier.apply_patch_bytes(base, patch)
    else:
        payload = provenance.get('payload') or ('recovery/' + provenance['copyFrom'])
        data = (archive / payload).read_bytes()
    assert sha(data) == entry['sha256'] and len(data) == entry['bytes'], entry['path']
    return data


def prior_integrity():
    baseline_tree = tree()
    archives = []
    count = 0
    for name in PRIOR_NAMES:
        rel = 'artifacts/checkpoints/manager-accepted-' + name
        root = REPO / rel
        manifest_bytes = (root / 'manifest.json').read_bytes()
        manifest = json.loads(manifest_bytes)
        entries = manifest['files'] + [dict(path='manifest.json', bytes=len(manifest_bytes), sha256=sha(manifest_bytes))]
        assert {p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()} == {e['path'] for e in entries}
        for e in entries:
            data = (root / e['path']).read_bytes()
            assert len(data) == e['bytes'] and sha(data) == e['sha256'], rel + '/' + e['path']
            oid = hashlib.sha1(b'blob ' + str(len(data)).encode() + b'\0' + data).hexdigest()
            assert baseline_tree[rel + '/' + e['path']] == oid, 'Committed Git blob differs: ' + rel + '/' + e['path']
            count += 1
        archives.append(dict(path=rel, manifestSha256=sha(manifest_bytes), files=len(entries),
            bytes=sum(e['bytes'] for e in entries), allManifestHashesMatch=True, committedGitBlobsMatch=True))
    return dict(status='PASS', archives=archives, filesComparedToCommittedGitBlobs=count,
        allSixPriorArchivesByteUnchanged=True, gitMutations=0)


def generated_tool_output(rel):
    path = Path(rel)
    if not rel.startswith(('tools/', 'scripts/qa/')): return False
    if path.suffix.lower() in {'.cpuprofile', '.heapsnapshot'}: return True
    if rel.startswith('tools/qa/') and path.suffix.lower() == '.json' and any(s in path.name.lower() for s in ['results','report','validation']):
        return True
    if rel.startswith('tools/question-quality/') and '/fixtures/' not in rel and path.suffix in {'.json', '.txt', '.svg'}:
        return True
    return False


def plan():
    intake = load(ROOT / 'validation/intake-inventory.json')
    assert intake['head'] == BASE and intake['branch'] == 'beta'
    prior = prior_targets()
    old_excluded = {e['path']: e for e in load(PRIOR6 / 'exclusions.json')['files']}
    baseline_time = int(git('show', '-s', '--format=%ct', BASE).strip())
    baseline_tree = tree()
    objects = GitObjects()
    selected, unchanged, exclusions, references = [], [], [], []
    for e in intake['files']:
        rel = e['path']
        old = prior.get(rel)
        reason = None
        if e['explicitlyLiveOnly'] or 'question-flag-d97aa716-' in rel or 'owner-decision-queue-' in rel:
            reason = 'explicit_in_flight_lane_live_only'
        elif e['changedWhileHashing']:
            reason = 'concurrent_worker_changed_during_intake_live_only'
        elif old and e['sha256'] == old['sha256']:
            unchanged.append(dict(path=rel, bytes=e['bytes'], sha256=e['sha256'], baselineProvenance=old['provenance']))
            continue
        elif generated_tool_output(rel):
            reason = 'regenerable_tool_test_or_analysis_output'
        elif not old and rel in old_excluded and e['bytes'] == old_excluded[rel].get('bytes') and e['mtimeNs'] <= baseline_time * 1_000_000_000:
            reason = 'earlier_out_of_lane_metadata_unchanged_since_checkpoint6'
        elif not old and rel in baseline_tree:
            data = objects.read(baseline_tree[rel])
            if sha(data) == e['sha256']:
                references.append(dict(path=rel, bytes=e['bytes'], sha256=e['sha256'], gitObject=BASE + ':' + rel))
                continue
        if reason:
            exclusions.append(dict(path=rel, bytes=e['bytes'], sha256=e['sha256'], group=reason, contentCaptured=False))
            continue
        provenance = old['provenance'] if old else (dict(kind='baseline_HEAD_blob', baselineCommit=BASE, gitObject=BASE + ':' + rel)
            if rel in baseline_tree else dict(kind='new_to_baseline_HEAD_and_all_six_prior_archives', baselineCommit=BASE))
        selected.append(dict(path=rel, bytes=e['bytes'], sha256=e['sha256'], hasBase=bool(old or rel in baseline_tree),
            baseProvenance=provenance, ownership='shared_accepted_target' if old or rel in baseline_tree else 'wholly_owned_accepted_target',
            scopes=['Manager dispatch 2026-11-12: accepted development state since checkpoint six']))
    objects.close()
    write_json(ROOT / 'validation/selection-plan.json', dict(baseCommit=BASE, files=selected,
        unchangedAlreadyPreserved=unchanged, baselineReferences=references, exclusions=exclusions))
    write_json(ROOT / 'validation/prior-archive-integrity.json', prior_integrity())
    print(json.dumps(dict(status='PASS', selectedTargets=len(selected), selectedBytes=sum(e['bytes'] for e in selected),
        unchangedPriorTargets=len(unchanged), baselineReferences=len(references), excludedTargets=len(exclusions),
        exclusionGroups=dict(Counter(e['group'] for e in exclusions)), priorArchives=6), indent=2))


def exact_diff(base, current, rel):
    lines = list(difflib.diff_bytes(difflib.unified_diff, prior_verifier.lf_lines(base),
        prior_verifier.lf_lines(current), fromfile=('a/' + rel).encode(), tofile=('b/' + rel).encode(), n=3))
    marked = []
    for line in lines:
        marked.append(line)
        if not line.endswith(b'\n'):
            marked[-1] += b'\n'
            marked.append(b'\\ No newline at end of file\n')
    patch = b''.join(marked)
    assert prior_verifier.apply_patch_bytes(base, patch) == current, rel
    assert prior_verifier.apply_patch_bytes(current, patch, reverse=True) == base, rel
    return patch


def store_encoded(relative, data):
    try: data.decode('utf-8')
    except UnicodeDecodeError: encoded = True
    else: encoded = b'\r' in data or data.startswith(b'\xef\xbb\xbf')
    if encoded:
        relative += '.base64'
        write(relative, base64.b64encode(data) + b'\n')
    else: write(relative, data)
    return relative, 'base64' if encoded else 'literal'


def build():
    selection = load(ROOT / 'validation/selection-plan.json')
    recovery_root = (ROOT / 'recovery').resolve()
    assert recovery_root == ROOT.resolve() / 'recovery' and recovery_root.is_relative_to(ROOT.resolve())
    if recovery_root.exists():
        assert not recovery_root.is_symlink()
        shutil.rmtree(recovery_root)
    prior = prior_targets()
    objects = GitObjects()
    contracts, files = [], []
    exclusions = selection['exclusions'][:]
    # Exclude every path observed changing, including changes that return to the intake hash.
    intake = {e['path']: e for e in load(ROOT / 'validation/intake-inventory.json')['files']}
    previous_concurrency = ROOT / 'validation/concurrent-edits.json'
    observed = set(load(previous_concurrency).get('modifiedPaths', [])) if previous_concurrency.exists() else set()
    for name in ['final', 'closing']:
        q = ROOT / 'validation' / (name + '-inventory.json')
        if not q.exists(): continue
        current = {e['path']: e for e in load(q)['files']}
        for rel in set(intake) | set(current):
            a, b = intake.get(rel), current.get(rel)
            if a is None or b is None or a['sha256'] != b['sha256'] or a['mtimeNs'] != b['mtimeNs'] or b['changedWhileHashing']:
                observed.add(rel)
    privacy = load(ROOT / 'validation/preflight-audit.json') if (ROOT / 'validation/preflight-audit.json').exists() else {}
    private_paths = set(privacy.get('excludedSourcePaths', []))
    for e in selection['files']:
        rel = e['path']
        if rel in observed or rel in private_paths:
            group = 'concurrent_worker_modified_during_run_live_only' if rel in observed else 'privacy_or_secret_content_live_only'
            exclusions.append(dict(path=rel, bytes=e['bytes'], sha256=e['sha256'], group=group, contentCaptured=False))
            continue
        current = (REPO / rel).read_bytes()
        if sha(current) != e['sha256']:
            observed.add(rel)
            exclusions.append(dict(path=rel, bytes=e['bytes'], group='concurrent_worker_modified_during_run_live_only', contentCaptured=False))
            continue
        e = dict(e)
        if e['hasBase']:
            base = prior_bytes(prior[rel]) if rel in prior else objects.read(e['baseProvenance']['gitObject'])
            assert base is not None and base != current, rel
            # Runtime art is captured whole; text uses the inherited exact patch contract.
            if b'\0' in base or b'\0' in current:
                e['method'] = 'whole_owned_current_file'
                write('recovery/' + rel, current)
            else:
                patch = exact_diff(base, current, rel)
                base_rel, base_encoding = store_encoded('recovery/bases/checkpoint7/' + rel, base)
                patch_rel = 'recovery/patches/checkpoint7__' + rel.replace('/', '__') + '.patch'
                stored_patch, patch_encoding = store_encoded(patch_rel, patch)
                if stored_patch != patch_rel:
                    # Checkpoint six keeps the patch suffix even for encoded patches.
                    (ROOT / stored_patch).rename(ROOT / patch_rel)
                contract = dict(id='checkpoint7__' + rel.replace('/', '__'), scope='Manager-accepted since checkpoint six',
                    path=rel, base=base_rel, patch=patch_rel, baseStorageEncoding=base_encoding,
                    patchStorageEncoding=patch_encoding, baseSha256=sha(base), patchSha256=sha(patch),
                    acceptedSha256=sha(current), acceptedBytes=len(current), baseProvenance=e['baseProvenance'],
                    forwardExact=True, reverseExact=True, reapplyExact=True,
                    proof=dict(acceptance=e['scopes'], currentAcceptedCaptureSha256=sha(current)))
                contracts.append(contract)
                e['method'] = 'patch'
        else:
            e['method'] = 'whole_owned_current_file'
            # Preserve original current bytes, encoding unusual text just as historical bases.
            if Path(rel).suffix.lower() not in {'.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2', '.ttf'}:
                payload, encoding = store_encoded('recovery/' + rel, current)
                if encoding != 'literal': e.update(payload=payload, storageEncoding=encoding)
            else:
                write('recovery/' + rel, current)
        files.append(e)
    objects.close()
    write_json(ROOT / 'recovery/patches/patch-verification.json', dict(schemaVersion=1, contracts=contracts,
        patchEngine='Exact unified hunks applied in memory; forward/reverse/reapply; no Git writes'))
    write_json(ROOT / 'recovery/aliases.json', dict(files=[]))
    write_json(ROOT / 'validation/selection.json', dict(createdAtUtc=datetime.now(timezone.utc).isoformat(),
        baseCommit=BASE, files=files, unchangedAlreadyPreserved=[]))
    write_json(ROOT / 'validation/unchanged-prior-targets.json', dict(files=[e for e in selection['unchangedAlreadyPreserved'] if e['path'] not in observed],
        purpose='Accepted previous-layer targets already preserved; never duplicated in checkpoint seven'))
    write_json(ROOT / 'validation/baseline-references.json', dict(files=[e for e in selection['baselineReferences'] if e['path'] not in observed]))
    # New concurrent paths were absent from the initial plan; retain exact
    # exclusion metadata for them as well, without capturing their contents.
    latest_path = ROOT / 'validation/closing-inventory.json'
    latest = {e['path']:e for e in load(latest_path)['files']} if latest_path.exists() else intake
    existing_exclusions = {e['path'] for e in exclusions}
    for rel in sorted(observed-existing_exclusions):
        e=latest.get(rel) or intake.get(rel) or dict(path=rel,bytes=0)
        exclusions.append(dict(path=rel,bytes=e.get('bytes',0),sha256=e.get('sha256'),
            group='concurrent_worker_modified_during_run_live_only',contentCaptured=False))
    intake_exclusions = load(ROOT / 'validation/intake-inventory.json')['exclusions']
    write_json(ROOT / 'exclusions.json', dict(createdAtUtc=datetime.now(timezone.utc).isoformat(), files=intake_exclusions + exclusions,
        unenumeratedProhibitedCategories=['.local-dev/**', 'real env and beta-admin.env contents', 'owner/tester browser data and saves',
            'private clinical inputs', 'dependency/build/test caches'], privateOrProprietaryContentsRead=False,
        note='Excluded candidate files were hashed for concurrency only when not private/proprietary; private categories never opened.'))
    write_json(ROOT / 'validation/concurrent-edits.json', dict(status='PASS', comparedInventories=['intake', 'final', 'closing'],
        modifiedPaths=sorted(observed), capturedModifiedPaths=sorted(set(observed) & {e['path'] for e in files}),
        explicitLiveOnlyPaths=[e['path'] for e in intake.values() if e['explicitlyLiveOnly']],
        capturedExplicitLiveOnlyPaths=sorted(e['path'] for e in files if LIVE_TOPIC.search(e['path']) or 'question-flag-d97aa716-' in e['path'] or 'owner-decision-queue-' in e['path'])))
    print(json.dumps(dict(status='PASS', recoveredTargets=len(files), patchContracts=len(contracts),
        wholeTargets=len(files)-len(contracts), concurrentModifiedPaths=len(observed), privacyExcludedPaths=len(private_paths)), indent=2))


if __name__ == '__main__':
    {'plan': plan, 'build': build}[sys.argv[1]]()
