"""Read-only filesystem audit against immutable integration intake; no Git."""
import difflib
import hashlib
import json
from pathlib import Path

tool = Path(__file__).resolve().parent
repo = tool.parents[2]
root = repo / 'artifacts/character-statics' / tool.name
baseline = json.loads((root / 'runtime-integration-baseline/manifest.json').read_text(encoding='utf-8'))
extra = json.loads((root / 'validation/additional-test-intake.json').read_text(encoding='utf-8'))
allowed = {
    'packages/game-domain/src/characterStillCatalog.ts',
    'packages/game-domain/src/characterStillCatalog.test.ts',
    'packages/game-domain/tests/app-staff.test.ts',
    'packages/game-domain/tests/character-variety.test.ts',
    'apps/player/src/art/characterStillRegistry.generated.json',
    'apps/player/src/art/characterStillRegistry.ts',
    'apps/player/src/art/characterStillRegistry.test.ts',
    'apps/player/src/session/appAppointmentsViewModels.test.ts',
    'apps/player/src/session/viewModels.ts',
    'tools/character-mapping/gs026-runtime-stills/provenance-manifest.json',
}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


patches, changes = [], []
for item in [*baseline['files'], extra]:
    before, after = repo / item['copiedTo'], repo / item['path']
    assert digest(before) == item['sha256'], 'immutable snapshot changed'
    after_hash = digest(after)
    if after_hash == item['sha256']:
        continue
    assert item['path'] in allowed, 'out-of-lane mutation: ' + item['path']
    data = after.read_bytes()
    assert not data.startswith(b'\xef\xbb\xbf') and b'\r' not in data, 'UTF-8/no-BOM/LF required'
    diff = list(difflib.unified_diff(
        before.read_text(encoding='utf-8').splitlines(keepends=True),
        data.decode('utf-8').splitlines(keepends=True),
        fromfile='before/' + item['path'], tofile='after/' + item['path'],
    ))
    patches.extend(diff)
    changes.append({'path': item['path'], 'beforeSha256': item['sha256'], 'afterSha256': after_hash,
                    'addedLines': sum(line.startswith('+') and not line.startswith('+++') for line in diff),
                    'removedLines': sum(line.startswith('-') and not line.startswith('---') for line in diff)})
assert {item['path'] for item in changes} == allowed, 'complete exact changed-file lane required'
for item in baseline['approvedInputs']:
    assert digest(repo / item['path']) == item['sha256'], 'frozen source/control/art changed: ' + item['path']
result = {'status': 'PASS', 'batch': tool.name, 'immutableSnapshots': len(baseline['files']),
          'additionalPreEditTestSnapshot': extra, 'unchangedSourceControlArtHashes': len(baseline['approvedInputs']),
          'changedSnapshotPaths': changes, 'utf8WithoutBomLf': True,
          'note': 'Concurrent pediatric route rendering, manager documents and other unowned work are preserved; no Git.'}
(root / 'validation/scoped-source-diff.patch').write_text(''.join(patches), encoding='utf-8', newline='\n')
(root / 'validation/scoped-change-report.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8', newline='\n')
print(json.dumps({'status': 'PASS', 'batch': tool.name, 'changedSnapshotPaths': len(changes),
                  'unchangedSourceControlArtHashes': len(baseline['approvedInputs']), 'utf8WithoutBomLf': True}, separators=(',', ':')))
