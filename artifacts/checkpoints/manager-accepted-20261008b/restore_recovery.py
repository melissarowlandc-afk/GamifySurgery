"""Materialize checkpoint targets into an EMPTY directory, without Git writes."""
from pathlib import Path
import argparse
import json
import sys

sys.dont_write_bytecode=True
from verify_archive import apply_patch_bytes, safe_path, sha, verify


def materialize(root):
    recovered={}
    entries=json.loads((root/'validation/selection.json').read_bytes())['files']
    contracts={c['path']:c for c in json.loads((root/'recovery/patches/patch-verification.json').read_bytes())['contracts']}
    for entry in entries:
        rel=entry['path']
        if entry['method']=='patch':
            c=contracts[rel]
            content=apply_patch_bytes(safe_path(root,c['base']).read_bytes(),safe_path(root,c['patch']).read_bytes())
        else:
            content=safe_path(root/'recovery',rel).read_bytes()
        assert sha(content)==entry['sha256'] and len(content)==entry['bytes']
        assert rel not in recovered
        recovered[rel]=content
    return recovered


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination',type=Path)
    parser.add_argument('--dry-run',action='store_true')
    args=parser.parse_args()
    root=Path(__file__).resolve().parent
    verify(root)
    files=materialize(root)
    if not args.dry_run:
        assert args.destination is not None,'Supply --destination or --dry-run'
        destination=args.destination.resolve()
        assert not destination.exists() or (destination.is_dir() and not any(destination.iterdir())),'Destination must be empty'
        assert not destination.is_relative_to(root) and not root.is_relative_to(destination),'Destination overlaps archive'
        destination.mkdir(parents=True,exist_ok=True)
        for rel,content in files.items():
            path=safe_path(destination,rel)
            path.parent.mkdir(parents=True,exist_ok=True)
            path.write_bytes(content)
    print(json.dumps({'status':'PASS','dryRun':args.dry_run,'recoveredFiles':len(files),
        'recoveredBytes':sum(map(len,files.values())),'gitMutations':0,
        'requiresFirstArchiveAndCompatibleEarlierDependencies':True},indent=2))
