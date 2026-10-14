"""Restore this recovery layer to an EMPTY directory, without Git writes."""
from pathlib import Path
import argparse
import json
import sys

sys.dont_write_bytecode = True
from verify_archive import recovered_files, require, safe_path, verify


def destination_guard(root, destination):
    destination = destination.resolve()
    require(not destination.exists() or (destination.is_dir() and not any(destination.iterdir())),
        'Destination must be empty')
    require(not destination.is_relative_to(root.resolve()) and not root.resolve().is_relative_to(destination),
        'Destination overlaps archive')
    return destination


def restore(root, destination=None, dry_run=False):
    verify(root)
    files = recovered_files(root)
    if not dry_run:
        require(destination is not None, 'Supply --destination or --dry-run')
        destination = destination_guard(root, destination)
        paths = [(safe_path(destination, rel), data) for rel, data in files.items()]
        destination.mkdir(parents=True, exist_ok=True)
        for path, data in paths:
            path.parent.mkdir(parents=True, exist_ok=True)
            with path.open('xb') as handle:
                handle.write(data)
    return dict(status='PASS', dryRun=dry_run, recoveredFiles=len(files),
        recoveredBytes=sum(map(len, files.values())), gitMutations=0,
        requiresAllFivePriorArchivesAndCompatibleEarlierDependencies=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path)
    parser.add_argument('--dry-run', action='store_true')
    args = parser.parse_args()
    print(json.dumps(restore(Path(__file__).resolve().parent, args.destination, args.dry_run), indent=2))
