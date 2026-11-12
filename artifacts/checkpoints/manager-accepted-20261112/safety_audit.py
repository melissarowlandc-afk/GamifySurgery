"""Offline secret, privacy, corpus, output and encoding audit; no private inputs."""
from pathlib import Path, PurePosixPath
from collections import Counter, defaultdict
import argparse
import bisect
import json
import re
import subprocess
import sys

sys.dont_write_bytecode = True
from capture_inventory import ROOT, REPO, PREFIX, ENV, sha, write_json, exclusion

STRONG = {
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
EMAIL = re.compile(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b')
IDENTITY_ORG = re.compile(r'corewellhealth|corewell\s+health|beaumont\.org|spectrumhealth\.org', re.I)
ASSIGNMENT = re.compile(r'''(?i)(?:"(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password|passphrase|private[_-]?key|supabaseAnonKey)"|'(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password|passphrase|private[_-]?key|supabaseAnonKey)'|\b(?:api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password|passphrase|private[_-]?key|supabaseAnonKey))\s*[:=]\s*(["'])([^"'\n]{8,})\1''')
PROJECT = re.compile(r'https?://([A-Za-z0-9.-]+\.supabase\.co)')
BINARY_SUFFIXES = {'.png', '.jpg', '.jpeg', '.webp', '.ico', '.woff', '.woff2', '.ttf'}
EXCLUDED_CATEGORIES = ['.local-dev/** (never read or captured)', 'beta-admin.env (never read or captured)',
    'all real env files and credential containers', 'tester email lists, resident rosters and name/email mappings',
    'owner/tester saves, browser storage, profiles and exports', 'proprietary PDFs, paid corpora and full source articles',
    'dependency/build/test output and regenerable image histories']


def load(path):
    return json.loads(path.read_bytes())


def scan_items(items, preflight=False):
    findings, assignments, emails, projects, source_declarations = [], [], [], [], []
    binary_files, encoding, scanned = [], [], Counter()
    identities = defaultdict(set)
    reviewed_path = ROOT / 'validation/reviewed-audit-literals.json'
    reviewed = load(reviewed_path)['findings'] if reviewed_path.exists() else []
    allowed = {(e['target'], e['category'], e['valueSha256']): e['reviewDisposition'] for e in reviewed}
    for label, data, kind, target in items:
        scanned[kind] += 1
        if Path(target.split(':', 1)[0]).suffix.lower() in BINARY_SUFFIXES:
            # Accepted runtime raster/font bytes; no owner/tester screenshots are selected.
            binary_files.append(dict(path=label, bytes=len(data), sha256=sha(data),
                disposition='runtime_asset_not_owner_browser_export'))
            continue
        try:
            text = data.decode('utf-8')
        except UnicodeDecodeError:
            findings.append(dict(path=label, target=target, category='unexpected_non_UTF8_payload'))
            continue
        if data.startswith(b'\xef\xbb\xbf') or b'\r' in data:
            encoding.append(dict(path=label, kind=kind, BOM=data.startswith(b'\xef\xbb\xbf'), CRLF=data.count(b'\r\n'),
                disposition='lossless_encoded_historical_or_current_bytes' if kind != 'physical' else 'REVIEW'))
        line_starts = None
        def record(m, category, **extra):
            nonlocal line_starts
            if line_starts is None:
                line_starts = [m.start() for m in re.finditer('\n', text)]
            return dict(path=label, target=target, kind=kind, category=category,
                line=bisect.bisect_left(line_starts, m.start()) + 1, valueSha256=sha(m[0].encode('utf-8')), **extra)
        def disposition_for(m, category):
            return allowed.get((target, category, sha(m[0].encode('utf-8'))))
        indicators = {'private_key': ('PRIVATE KEY',), 'aws_key': ('AKIA', 'ASIA'),
            'github_token': ('ghp_', 'gho_', 'ghu_', 'ghs_', 'ghr_', 'github_pat_'),
            'openai_key': ('sk-',), 'supabase_key': ('sb_secret_', 'sb_publishable_'),
            'jwt': ('eyJ',), 'bearer_token': ('Bearer',), 'credential_url': ('://',), 'ssn': ('-',)}
        for category, pattern in STRONG.items():
            if not any(token in text for token in indicators[category]): continue
            for m in pattern.finditer(text):
                value = m[0]
                # Explicitly marked mock strings remain reviewable and listed by hash.
                synthetic = 'synthetic' in value.lower() or 'example.invalid' in value.lower()
                reviewed_disposition = disposition_for(m, category)
                if synthetic or reviewed_disposition:
                    assignments.append(record(m, category, disposition=reviewed_disposition or 'explicit_synthetic_fixture'))
                else:
                    findings.append(record(m, category))
        for m in ASSIGNMENT.finditer(text):
            value = m[2]
            context = text[max(0, m.start()-180):m.end()]
            synthetic = any(t in value.lower() for t in ['synthetic', 'example.invalid', 'your_', 'your-', 'placeholder'])
            expression = any(t in value for t in ['${', 'process.env', 'import.meta', '{{', '...', '\\s', '\\b'])
            autocomplete = value in {'new-password', 'current-password'} and 'autoComplete=' in context
            source_template = value.startswith('<') and value.endswith('>')
            disposition = disposition_for(m, 'credential_literal') or ('explicit_synthetic_fixture' if synthetic else 'source_expression' if expression else
                'HTML_autocomplete_attribute' if autocomplete else 'documentation_placeholder' if source_template else 'REVIEW_REQUIRED')
            rec = record(m, 'credential_literal', disposition=disposition)
            assignments.append(rec)
            if disposition == 'REVIEW_REQUIRED': findings.append(rec)
        # Scan bounded windows around @. Long encoded/source-fixture strings
        # cannot make an unbounded email regex repeatedly rescan megabytes.
        class OffsetMatch:
            def __init__(self, match, offset): self.match, self.offset = match, offset
            def start(self): return self.match.start() + self.offset
            def __getitem__(self, key): return self.match[key]
        def email_matches():
            for at in re.finditer('@', text):
                offset = max(0, at.start()-320)
                window = text[offset:at.start()+321]
                for match in EMAIL.finditer(window):
                    if match.start() <= at.start()-offset < match.end():
                        yield OffsetMatch(match, offset)
        for m in email_matches():
            address = m[0]
            domain = address.rsplit('@', 1)[1].lower()
            reserved = domain.endswith(('.invalid', '.test', '.example')) or domain in {'example.com', 'example.org', 'example.net', 'localhost'}
            rec = record(m, 'email_address', disposition='reserved_synthetic_identity' if reserved else 'REVIEW_REQUIRED')
            if reserved:
                identities[address].add(target)
                rec['syntheticIdentity'] = address
            emails.append(rec)
            if not reserved: findings.append(rec)
        lowered = text.lower()
        has_institution = any(token in lowered for token in ['corewell', 'beaumont.org', 'spectrumhealth.org'])
        for m in IDENTITY_ORG.finditer(text) if has_institution else ():
            # Scanner policy code is not an identity dataset.
            if target.endswith('safety_audit.py') or target.startswith('validation/'):
                continue
            findings.append(record(m, 'tester_institution_or_identifier'))
        for m in PROJECT.finditer(text) if '.supabase.co' in text else ():
            mock = m[1].lower() in {'synthetic.supabase.co', 'example.supabase.co', 'your-project.supabase.co', 'project-ref.supabase.co'}
            disposition = disposition_for(m, 'project_URL') or ('explicit_mock_project_URL' if mock else 'REVIEW_REQUIRED')
            rec = record(m, 'project_URL', disposition=disposition)
            projects.append(rec)
            if disposition == 'REVIEW_REQUIRED': findings.append(rec)
        # Check captured ledgers' declarations without consulting any external source corpus.
        for m in re.finditer(r'"(?:sourceTextStored|fullTextStored|excerptsStored|sourceCorpusStored)"\s*:\s*(true|false)', text):
            rec = record(m, 'source_retention_declaration', value=m[1])
            source_declarations.append(rec)
            if m[1] == 'true': findings.append(rec)
        for m in re.finditer(r'"(?:fullArticleText|sourceExcerpt|verbatimSourceText|copiedSourceProse)"\s*:\s*"([^"\n]{100,})"', text):
            findings.append(record(m, 'stored_source_prose_requires_review'))
    return dict(status='PASS' if not findings else 'REVIEW_REQUIRED', scanned=dict(scanned),
        secretPrivacyFindings=findings, credentialLiterals=assignments, emailIdentifiers=emails,
        syntheticTestIdentities=[dict(identity=k, paths=sorted(v)) for k,v in sorted(identities.items())],
        mockedProjectURLs=projects, sourceRetentionDeclarations=source_declarations, encoding=encoding,
        binaryRuntimeAssets=binary_files, prohibitedCategories=EXCLUDED_CATEGORIES,
        sourceCorpusRead=False, realEnvRead=False, ownerStorageAccessed=False, gitMutations=0, remoteRequests=0)


def preflight():
    selection = load(ROOT / 'validation/selection-plan.json')['files']
    from prepare_archive import prior_targets, prior_bytes, GitObjects
    prior = prior_targets()
    objects = GitObjects()
    def inputs():
        for e in selection:
            rel = e['path']
            yield rel, (REPO / rel).read_bytes(), 'candidate_current', rel
            if e['hasBase']:
                data = prior_bytes(prior[rel]) if rel in prior else objects.read(e['baseProvenance']['gitObject'])
                yield rel + ':base', data, 'candidate_base', rel
    result = scan_items(inputs(), preflight=True)
    objects.close()
    result['excludedSourcePaths'] = sorted({e['target'] for e in result['secretPrivacyFindings']})
    write_json(ROOT / 'validation/preflight-audit.json', result)
    print(json.dumps(dict(status=result['status'], scanned=result['scanned'], findings=len(result['secretPrivacyFindings']),
        excludedSourcePaths=result['excludedSourcePaths'], syntheticTestIdentities=len(result['syntheticTestIdentities']),
        categories=dict(Counter(e['category'] for e in result['secretPrivacyFindings']))), indent=2))


def audit():
    from verify_archive import recovered_files, contract_bytes
    contracts = load(ROOT / 'recovery/patches/patch-verification.json')['contracts']
    physical_targets = {c[key]:c['path'] for c in contracts for key in ('base','patch')}
    for e in load(ROOT / 'validation/selection.json')['files']:
        if e['method']=='whole_owned_current_file': physical_targets[e.get('payload','recovery/'+e['path'])]=e['path']
    recovery = recovered_files(ROOT)
    ignored_reports = {'manifest.json', 'validation/safety-audit.json', 'validation/preflight-audit.json',
        'validation/archive-size.json', 'validation/verification-results.json', 'validation/negative-guard-tests.json',
        'validation/disk-restore-roundtrip.json', 'validation/split-plan.json'}
    def inputs():
        for p in sorted(ROOT.rglob('*')):
            if not p.is_file(): continue
            rel = p.relative_to(ROOT).as_posix()
            if rel not in ignored_reports and rel.startswith('recovery/'):
                yield rel, p.read_bytes(), 'physical', physical_targets.get(rel,rel.removeprefix('recovery/'))
            elif rel not in ignored_reports:
                yield rel, p.read_bytes(), 'physical', rel
        for c in contracts:
            base, patch = contract_bytes(ROOT, c)
            yield c['path'] + ':base', base, 'decoded_base', c['path']
            yield c['path'] + ':patch', patch, 'decoded_patch', c['path']
        for rel, data in recovery.items():
            yield rel, data, 'recovered_current', rel
    result = scan_items(inputs())
    forbidden = []
    examples = []
    for rel, data in recovery.items():
        if exclusion(rel) or generated_output_path(rel): forbidden.append(rel)
        if rel.endswith(('.env.example', 'beta-admin.env.example')):
            values = [line.split('=', 1)[1] for line in data.decode('utf-8').splitlines()
                if line.strip() and not line.lstrip().startswith('#') and '=' in line]
            examples.append(dict(path=rel, allValuesEmpty=not any(values)))
            if any(values): forbidden.append(rel)
    physical = [PREFIX + p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file()]
    stage = (ROOT / 'STAGE_PATHS.txt').read_text('utf-8').splitlines()
    probes = sorted(set(physical + list(recovery) + stage))
    p = subprocess.run(['git', 'check-ignore', '--no-index', '-z', '--stdin'], cwd=REPO, env=ENV,
        input=('\0'.join(probes) + '\0').encode(), capture_output=True)
    assert p.returncode in (0,1)
    ignored = p.stdout.decode('utf-8').strip('\0').split('\0') if p.stdout else []
    expected = ['.local-dev/beta-admin.env', 'apps/player/.env', 'apps/player/.env.local', '.claude/settings.local.json',
        'apps/player/dist/index.html', 'test-results/probe', 'playwright-report/index.html', 'node_modules/probe']
    p = subprocess.run(['git', 'check-ignore', '--no-index', '-z', '--stdin'], cwd=REPO, env=ENV,
        input=('\0'.join(expected) + '\0').encode(), capture_output=True)
    assert p.returncode in (0,1)
    actual = p.stdout.decode('utf-8').strip('\0').split('\0') if p.stdout else []
    missing = sorted(set(expected) - set(actual))
    result.update(forbiddenPayloadPaths=forbidden, envExamples=examples, includedIgnoredPaths=ignored,
        checkIgnoreProbeCount=len(probes), expectedExcludedPaths=expected, expectedExcludedPathsAllIgnored=not missing,
        physicalEncoding='UTF-8 without BOM and LF for text; literal runtime binary assets',
        ownerSavePayloads=0, testerIdentityPayloads=0, sourceCorpusPayloads=0,
        corpusCheckLimitation='Offline declaration/field/path review only; no external plagiarism comparison or clinical approval claimed.')
    physical_errors = [e for e in result['encoding'] if e['kind'] == 'physical' and e['disposition'] == 'REVIEW']
    result['status'] = 'PASS' if not (result['secretPrivacyFindings'] or forbidden or ignored or missing or physical_errors) else 'FAIL'
    return result


def generated_output_path(rel):
    from prepare_archive import generated_tool_output
    return generated_tool_output(rel)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--preflight', action='store_true')
    args = parser.parse_args()
    if args.preflight: preflight()
    else:
        result = audit()
        print(json.dumps(result, indent=2))
        sys.exit(0 if result['status'] == 'PASS' else 1)
