"""Materialize recovered files into an EMPTY directory, without changing Git."""
from pathlib import Path
import argparse
import json
import sys

sys.dont_write_bytecode = True
from verify_archive import apply_patch_bytes, sha, verify


def materialize(root):
    recovered = {}
    for source in (root / 'recovery').rglob('*'):
        if not source.is_file():
            continue
        rel = source.relative_to(root / 'recovery').as_posix()
        if rel.startswith(('bases/', 'patches/')) or rel == 'aliases.json':
            continue
        recovered[rel] = source.read_bytes()
    contracts = json.loads((root / 'recovery/patches/patch-verification.json').read_bytes())['contracts']
    for contract in contracts:
        # Listed chronologically per target. Later accepted contracts supersede
        # earlier font/label states of the same file.
        base = (root / contract['base']).read_bytes()
        after = apply_patch_bytes(base, (root / contract['patch']).read_bytes())
        assert sha(after) == contract['acceptedSha256']
        recovered[contract['path']] = after
    aliases = json.loads((root / 'recovery/aliases.json').read_bytes())['files']
    for entry in aliases:
        assert entry['copyFrom'] in recovered, f'Missing alias input {entry["copyFrom"]}'
        content = recovered[entry['copyFrom']]
        assert sha(content) == entry['sha256']
        assert len(content) == entry['bytes']
        assert entry['path'] not in recovered or recovered[entry['path']] == content
        recovered[entry['path']] = content
    return recovered


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path)
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    root = Path(__file__).resolve().parent
    verify(root)
    files = materialize(root)
    if not args.dry_run:
        assert args.destination is not None, 'Supply --destination or use --dry-run'
        destination = args.destination.resolve()
        assert not destination.exists() or (destination.is_dir() and not any(destination.iterdir())), 'Destination must be empty'
        assert not destination.is_relative_to(root) and not root.is_relative_to(destination), 'Destination overlaps the archive'
        destination.mkdir(parents=True, exist_ok=True)
        for rel, data in files.items():
            path = (destination / rel).resolve()
            assert path.is_relative_to(destination), 'Recovery path escapes destination'
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(data)
    print(json.dumps({'status':'PASS', 'dryRun':args.dry_run, 'recoveredFiles':len(files),
                      'recoveredBytes':sum(len(x) for x in files.values()),
                      'gitMutations':0, 'requiresCompatibleEarlierDependencies':True}, indent=2))
