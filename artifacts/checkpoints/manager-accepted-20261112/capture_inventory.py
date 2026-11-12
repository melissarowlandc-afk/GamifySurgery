"""Local read-only intake; never opens private inputs or generated corpora."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
from collections import Counter
import hashlib
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parent
REPO = ROOT.parents[2]
PREFIX = ROOT.relative_to(REPO).as_posix() + '/'
BASE = '3436c8bbd8359c64c49b082f21e88a8985f594f7'
ENV = dict(os.environ, GIT_OPTIONAL_LOCKS='0')
LIVE_TOPIC = re.compile(r'question-topic-(?:statistics|ethics-professionalism|ostomy-enterocutaneous-fistula|quality-safety-systems)(?:[-.]|$)', re.I)


def git(*args):
    p = subprocess.run(['git', *args], cwd=REPO, env=ENV, capture_output=True)
    if p.returncode:
        raise RuntimeError('Read-only Git command failed: ' + ' '.join(args))
    return p.stdout


def sha(data):
    return hashlib.sha256(data).hexdigest()


def write_json(path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes((json.dumps(data, indent=2, ensure_ascii=False) + '\n').encode('utf-8'))


def exclusion(rel):
    low = rel.lower()
    parts = low.split('/')
    if rel.startswith(PREFIX):
        return 'current_archive'
    if low.startswith(('artifacts/checkpoints/manager-accepted-',)):
        return 'prior_archive_unchanged'
    if any(p in {'.git', '.agents', '.codex', '.aws', '.local-dev', '.clinical-workbench', '.private-clinical-data', 'photos for codex', 'photos for codex 2'} for p in parts):
        return 'private_directory_not_read'
    if low.startswith(('clinical-data/private/', 'clinical-data/imports/', 'clinical-data/exports/')):
        return 'private_directory_not_read'
    if any(p.startswith('.env') and p != '.env.example' for p in parts) or 'beta-admin.env' in parts or low.endswith(('.pem', '.key', '.pfx', '.p12')):
        return 'real_env_or_credentials_not_read'
    if low.startswith('.claude/'):
        return 'machine_local_coordination'
    if any(p in {'node_modules', '.pnpm-store', 'dist', 'coverage', '.vite', 'playwright-report', 'test-results', 'blob-report', '__pycache__'} for p in parts):
        return 'regenerable_dependency_build_test_output'
    if low.startswith(('generated_images/', '.tmp/', 'artifacts/logs/')):
        return 'raw_generation_or_local_scratch'
    if low.endswith(('.pdf', '.epub', '.mobi', '.docx', '.pptx', '.xlsx', '.sqlite', '.sqlite3', '.db', '.har', '.trace', '.zip', '.7z')):
        return 'private_or_source_corpus_container_not_read'
    if any(token in low for token in ['storage-state', 'storagestate', 'browser-data', 'browser-profile', 'resident-roster', 'resident_roster', 'names-to-email', 'tester-roster', 'tester_emails', 'tester-emails']):
        return 'owner_tester_browser_or_roster_not_read'
    if low.startswith('artifacts/'):
        return 'earlier_artifact_or_generated_evidence'
    if low.startswith('tools/room-design/') and any(p in {'history', 'proof', 'renders', 'screenshots', 'node_modules'} for p in parts):
        return 'regenerable_room_render_histories'
    if low.startswith('tools/character-mapping/') and any(p in {'history', 'proof', 'renders', 'screenshots'} for p in parts):
        return 'regenerable_character_review_histories'
    if low.endswith(('.log', '.tmp', '.bak', '.tsbuildinfo')) or parts[-1] in {'.ds_store', 'thumbs.db'}:
        return 'raw_local_logs_or_scratch'
    return None


def collect():
    paths = sorted(set(git('ls-files', '-z', '--cached', '--others', '--exclude-standard').decode('utf-8').strip('\0').split('\0')) - {''})
    files, excluded, errors = [], [], []
    def one(rel):
        path = REPO / rel
        if not path.exists():
            return 'missing', dict(path=rel)
        group = exclusion(rel)
        if path.is_symlink():
            return 'error', dict(path=rel, problem='symlink_not_followed')
        if not path.is_file():
            return 'excluded', dict(path=rel, group='non_file_not_read')
        before = path.stat()
        if group:
            return 'excluded', dict(path=rel, bytes=before.st_size, group=group, contentRead=False)
        digest = hashlib.sha256()
        with path.open('rb') as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b''):
                digest.update(chunk)
        after = path.stat()
        return 'file', dict(path=rel, bytes=after.st_size, sha256=digest.hexdigest(), mtimeNs=after.st_mtime_ns,
            changedWhileHashing=(before.st_size, before.st_mtime_ns) != (after.st_size, after.st_mtime_ns),
            explicitlyLiveOnly=bool(LIVE_TOPIC.search(rel) or rel.startswith(('docs/research/question-flag-d97aa716-', 'docs/research/owner-decision-queue-'))))
    with ThreadPoolExecutor(max_workers=8) as pool:
        for kind, entry in pool.map(one, paths):
            if kind == 'file': files.append(entry)
            elif kind == 'excluded':
                if entry['group'] != 'current_archive': excluded.append(entry)
            else: errors.append(dict(entry, kind=kind))
    index = REPO / git('rev-parse', '--git-path', 'index').decode().strip()
    return dict(capturedAtUtc=datetime.now(timezone.utc).isoformat(), baseCommit=BASE,
        head=git('rev-parse', 'HEAD').decode().strip(), branch=git('branch', '--show-current').decode().strip(),
        indexSha256=sha(index.read_bytes()), files=files, exclusions=excluded, errors=errors,
        gitMutations=0, realEnvRead=False, ownerStorageAccessed=False, proprietaryContainersRead=False)


if __name__ == '__main__':
    name = sys.argv[1] if len(sys.argv) > 1 else 'intake'
    assert name in {'intake', 'final', 'closing'}
    data = collect()
    write_json(ROOT / 'validation' / (name + '-inventory.json'), data)
    print(json.dumps(dict(status='PASS' if not data['errors'] else 'REVIEW', inventory=name,
        files=len(data['files']), bytes=sum(e['bytes'] for e in data['files']), excludedPaths=len(data['exclusions']),
        explicitLiveOnly=sum(e['explicitlyLiveOnly'] for e in data['files']), errors=data['errors'],
        head=data['head'], branch=data['branch'], gitMutations=0), indent=2))
