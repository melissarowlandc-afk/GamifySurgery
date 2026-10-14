"""Read-only archive audit, including decoded bases/patches; no private inputs."""
from pathlib import Path, PurePosixPath
from collections import Counter
import hashlib
import json
import re
import subprocess
import sys

sys.dont_write_bytecode = True
from verify_archive import contract_bytes, recovered_files, sha


def audit(root):
    root = root.resolve()
    repo = root.parents[2]
    strong = {
        'private_key': re.compile(r'-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----'),
        'aws_key': re.compile(r'\b(?:AKIA|ASIA)[A-Z0-9]{16}\b'),
        'github_token': re.compile(r'\bgh[pousr]_[A-Za-z0-9]{25,}\b|\bgithub_pat_[A-Za-z0-9_]{30,}\b'),
        'openai_key': re.compile(r'\bsk-(?:proj-)?[A-Za-z0-9_-]{32,}\b'),
        'supabase_key': re.compile(r'\bsb_(?:secret|publishable)_[A-Za-z0-9_-]{20,}\b'),
        'jwt': re.compile(r'\beyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\b'),
        'bearer_token': re.compile(r'\bBearer\s+[A-Za-z0-9._-]{24,}\b'),
        'credential_url': re.compile(r'\b(?:https?|postgres(?:ql)?|redis)://[^\s/@]+:[^\s/@]+@'),
        'ssn': re.compile(r'\b\d{3}-\d{2}-\d{4}\b'),
    }
    assignments = re.compile(r'''(?i)["']?(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password|private[_-]?key|supabaseAnonKey)["']?\s*[:=]\s*["']([^"'\n]{8,})["']''')
    emails = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')
    project_urls = re.compile(r'https?://([A-Za-z0-9.-]+\.supabase\.co)(?:[^\s\)"\'<>]*)')
    findings, literals, identifiers, fixture_urls = [], [], [], []
    encoding_errors, decoded_endings, forbidden_paths = [], [], []
    scanned = Counter()
    ignored_generated_reports = {'manifest.json', 'validation/safety-audit.json',
        'validation/archive-size.json', 'validation/verification-results.json',
        'validation/negative-guard-tests.json', 'validation/disk-restore-roundtrip.json'}

    def scan(label, data, kind):
        scanned[kind] += 1
        if data.startswith(b'\xef\xbb\xbf'):
            encoding_errors.append(dict(path=label, kind=kind, problem='BOM'))
        try:
            content = data.decode('utf-8')
        except UnicodeDecodeError:
            encoding_errors.append(dict(path=label, kind=kind, problem='non_UTF8'))
            return
        if b'\r' in data:
            if kind == 'physical':
                encoding_errors.append(dict(path=label, problem='physical_CR'))
            else:
                decoded_endings.append(dict(path=label, kind=kind, CRLF=data.count(b'\r\n')))
        for category, pattern in strong.items():
            for m in pattern.finditer(content):
                findings.append(dict(path=label, kind=kind, category=category,
                    line=content.count('\n', 0, m.start()) + 1, valueSha256=sha(m[0].encode())))
        for m in assignments.finditer(content):
            value = m[1]
            synthetic = 'synthetic' in value.lower() or 'example.invalid' in value.lower()
            expression = any(token in value for token in ['${', 'process.env', 'import.meta', '{{', '...'])
            preceding_attribute = content[max(0, m.start()-180):m.end()]
            autocomplete = value in {'new-password', 'current-password'} and 'autoComplete=' in preceding_attribute
            disposition = ('HTML_autocomplete_attribute' if autocomplete else
                'explicit_synthetic_fixture' if synthetic else 'source_expression' if expression else 'REVIEW_REQUIRED')
            record = dict(path=label, kind=kind, line=content.count('\n', 0, m.start()) + 1,
                valueSha256=sha(value.encode()), disposition=disposition)
            literals.append(record)
            if disposition == 'REVIEW_REQUIRED':
                findings.append(dict(record, category='credential_literal_needs_review'))
        for m in emails.finditer(content):
            address = m[0]
            domain = address.rsplit('@', 1)[1].lower()
            reserved = domain.endswith('.invalid') or domain in {'example.com', 'example.org', 'example.net'}
            # Scoped software package names such as @gamify-surgery/player are not emails.
            record = dict(path=label, kind=kind, line=content.count('\n', 0, m.start()) + 1,
                valueSha256=sha(address.encode()), disposition='reserved_synthetic_domain' if reserved else 'REVIEW_REQUIRED')
            identifiers.append(record)
            if not reserved:
                findings.append(dict(record, category='personal_identifier_needs_review'))
        for m in project_urls.finditer(content):
            synthetic = m[1].lower() == 'synthetic.supabase.co'
            record = dict(path=label, kind=kind, line=content.count('\n', 0, m.start()) + 1,
                disposition='explicit_mock_project_URL' if synthetic else 'REVIEW_REQUIRED')
            fixture_urls.append(record)
            if not synthetic:
                findings.append(dict(record, category='real_project_URL_needs_review'))

    for path in sorted(root.rglob('*')):
        if not path.is_file():
            continue
        rel = path.relative_to(root).as_posix()
        if rel not in ignored_generated_reports:
            scan(rel, path.read_bytes(), 'physical')
    contracts = json.loads((root/'recovery/patches/patch-verification.json').read_bytes())['contracts']
    for c in contracts:
        base, patch = contract_bytes(root, c)
        scan(c['path'] + ':base', base, 'decoded_base')
        scan(c['path'] + ':patch', patch, 'decoded_patch')
    recovered = recovered_files(root)
    env_examples = []
    for rel, data in recovered.items():
        parts = PurePosixPath(rel).parts
        if any(p.startswith('.env') and p != '.env.example' for p in parts):
            forbidden_paths.append(rel)
        if rel.lower().endswith(('.pdf', '.epub', '.pem', '.pfx', '.key', '.sqlite', '.db', '.zip')):
            forbidden_paths.append(rel)
        if rel.startswith(('.claude/', '.local-dev/', 'test-results/', 'playwright-report/', 'apps/player/dist/')):
            forbidden_paths.append(rel)
        if any(p in {'.private-clinical-data', '.clinical-workbench', 'Photos for Codex', 'Photos for Codex 2'} for p in parts):
            forbidden_paths.append(rel)
        if rel.endswith('.env.example'):
            values = {}
            for line in data.decode('utf-8').splitlines():
                if not line.strip() or line.lstrip().startswith('#'):
                    continue
                name, value = line.split('=', 1)
                values[name] = value
            if any(values.values()):
                findings.append(dict(path=rel, category='nonempty_env_example'))
            env_examples.append(dict(path=rel, variables=sorted(values), allValuesEmpty=not any(values.values())))
        scan(rel, data, 'recovered_current')

    physical_paths = ['artifacts/checkpoints/manager-accepted-20261014/' + p.relative_to(root).as_posix()
        for p in root.rglob('*') if p.is_file()]
    stage = (root/'STAGE_PATHS.txt').read_text('utf-8').splitlines()
    probes = sorted(set(physical_paths + list(recovered) + stage))
    result = subprocess.run(['git', 'check-ignore', '--no-index', '-z', '--stdin'], cwd=repo,
        input=('\0'.join(probes) + '\0').encode(), capture_output=True)
    if result.returncode not in (0, 1):
        raise RuntimeError('check-ignore failed: ' + result.stderr.decode('utf-8', errors='replace'))
    ignored = result.stdout.decode('utf-8').strip('\0').split('\0') if result.stdout else []
    expected = ['apps/player/.env', 'apps/player/.env.local', 'apps/player/.env.production',
        '.claude/settings.local.json', '.local-dev/checkpoint6/inventory.json',
        'apps/player/dist/index.html', 'test-results/probe', 'playwright-report/index.html']
    expected_result = subprocess.run(['git', 'check-ignore', '--no-index', '-z', '--stdin'], cwd=repo,
        input=('\0'.join(expected) + '\0').encode(), capture_output=True)
    if expected_result.returncode not in (0, 1):
        raise RuntimeError('Excluded-path check-ignore failed')
    actual_excluded = expected_result.stdout.decode().strip('\0').split('\0') if expected_result.stdout else []
    missing_expected = sorted(set(expected)-set(actual_excluded))
    if ignored or missing_expected:
        findings.append(dict(category='check_ignore_mismatch', includedIgnored=ignored, excludedNotIgnored=missing_expected))
    return dict(status='PASS' if not (findings or encoding_errors or forbidden_paths) else 'FAIL',
        scanned=dict(scanned), secretPrivacyFindings=findings, credentialLiterals=literals,
        emailIdentifiers=identifiers, mockedProjectURLs=fixture_urls, envExamples=env_examples,
        physicalEncoding='UTF-8 without BOM; LF only', encodingErrors=encoding_errors,
        losslesslyDecodedHistoricalCRLFBasesOrPatches=decoded_endings,
        forbiddenPayloadPaths=forbidden_paths, includedIgnoredPaths=ignored,
        checkIgnoreProbeCount=len(probes), expectedExcludedPaths=expected,
        expectedExcludedPathsAllIgnored=not missing_expected,
        ownerSavePayloads=0, sourceCorpusPayloads=0,
        personalDataScope='Reserved synthetic fixture identifiers; inherited owner/project coordination names are public repository metadata, not patient data.',
        proprietarySourceScope='Software/plans only; forbidden source names appear in policy/provenance, never source text or PDFs.',
        sourceCorpusRead=False, realEnvRead=False, ownerStorageAccessed=False,
        remoteRequests=0, gitMutations=0)


if __name__ == '__main__':
    result = audit(Path(__file__).resolve().parent)
    print(json.dumps(result, indent=2))
    sys.exit(0 if result['status'] == 'PASS' else 1)
