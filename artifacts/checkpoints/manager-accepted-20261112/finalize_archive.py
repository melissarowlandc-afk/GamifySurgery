"""Refresh manifest, exact stage allowlist, counts and the proposed size split."""
from pathlib import Path
from collections import Counter
import json
import sys

sys.dont_write_bytecode = True
from capture_inventory import ROOT, BASE, PREFIX, sha, write_json


def inventory():
    return sorted((p for p in ROOT.rglob('*') if p.is_file()), key=lambda p:p.relative_to(ROOT).as_posix())


def manifest():
    selection = json.loads((ROOT/'validation/selection.json').read_bytes())['files']
    whole = {e.get('payload', 'recovery/' + e['path']):e for e in selection if e['method']=='whole_owned_current_file'}
    entries = []
    for p in inventory():
        relative = p.relative_to(ROOT).as_posix()
        if relative == 'manifest.json': continue
        data = p.read_bytes()
        if relative in whole:
            e = whole[relative]
            status = dict(kind='whole_owned_accepted_file',repositoryPath=e['path'],acceptedSha256=e['sha256'],
                storageEncoding=e.get('storageEncoding','literal'),proof=e['scopes'])
        elif relative.startswith(('recovery/bases/','recovery/patches/')):
            status = dict(kind='exact_shared_patch_or_base',contract='recovery/patches/patch-verification.json')
        else:
            status = dict(kind='worker_archive_metadata_or_verification_tool',scope='Bounded seventh recovery archive')
        entries.append(dict(path=relative,sha256=sha(data),bytes=len(data),sourceStatus=status))
    write_json(ROOT/'manifest.json',dict(schemaVersion=1,archive='manager-accepted-20261112',manifestSelfExcluded=True,
        sourceScope='All stable manager-accepted development changes since checkpoint six, subject to explicit live/privacy/output exclusions.',
        baseCommit=BASE,gitMutations=0,files=entries))


def refresh():
    for _ in range(8):
        actual = {p.relative_to(ROOT).as_posix() for p in inventory()} | {'manifest.json'}
        (ROOT/'STAGE_PATHS.txt').write_bytes(('\n'.join(PREFIX+p for p in sorted(actual))+'\n').encode('utf-8'))
        # A two-volume transport of ONE archive is proposed, not silently performed.
        # The metadata and exact contract remain common; recombine before verification.
        volumes = {'core-and-fixtures':[], 'research-packets':[]}
        for p in inventory():
            rel = p.relative_to(ROOT).as_posix()
            volume = 'research-packets' if rel.startswith('recovery/docs/research/') else 'core-and-fixtures'
            volumes[volume].append(dict(path=PREFIX+rel,bytes=p.stat().st_size))
        split = dict(sizeFlagRecorded=True,thresholdBytes=1_000_000_000,maximumFileBytes=50_000_000,
            proposedSplit='Two coordinated volumes: core code/patches/fixtures/common metadata, and research packets. Recombine under this same archive path before verification or restoration. The manager may stage both reviewed volumes in consecutive checkpoint commits and push the complete chain. No split or Git action performed by this worker.',
            volumes=[dict(name=k,files=len(v),bytes=sum(e['bytes'] for e in v),paths=[e['path'] for e in v]) for k,v in volumes.items()],
            separatelyRecoverable=False,performed=False)
        write_json(ROOT/'validation/split-plan.json',split)
        manifest()
        files = inventory()
        total = sum(p.stat().st_size for p in files)
        largest = max(files,key=lambda p:p.stat().st_size)
        over = [dict(path=p.relative_to(ROOT).as_posix(),bytes=p.stat().st_size) for p in files if p.stat().st_size>50_000_000]
        previous = (ROOT/'validation/archive-size.json').read_bytes() if (ROOT/'validation/archive-size.json').exists() else None
        size = dict(archiveFiles=len(files),archiveBytes=total,maximumArchiveBytes=1_000_000_000,
            maximumFileBytes=50_000_000,largestFile=largest.relative_to(ROOT).as_posix(),largestFileBytes=largest.stat().st_size,
            filesOver50MB=over,totalOver1GB=total>1_000_000_000,withinLimits=not over and total<=1_000_000_000,
            sizeFlag='TOTAL_OVER_1_GB_SPLIT_PROPOSED' if total>1_000_000_000 else 'WITHIN_LIMITS',
            proposedSplit='validation/split-plan.json',
            note='Decimal byte limits; all prior archives excluded from this layer size. Research and fixtures are retained inputs, not generated build/test output.')
        write_json(ROOT/'validation/archive-size.json',size)
        if previous == (ROOT/'validation/archive-size.json').read_bytes():
            manifest()
            # The split table's total is informational; fixed-point sizes include itself.
            if total == sum(p.stat().st_size for p in inventory()): break
    return json.loads((ROOT/'validation/archive-size.json').read_bytes())


if __name__ == '__main__': print(json.dumps(refresh(),indent=2))
