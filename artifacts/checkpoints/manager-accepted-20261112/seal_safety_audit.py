"""Verify the final recovery is an unchanged subset of the full audit; rescan metadata."""
from pathlib import Path
from collections import Counter
import json
import subprocess
import sys

sys.dont_write_bytecode = True
from capture_inventory import ROOT, REPO, PREFIX, ENV, sha, write_json
from safety_audit import scan_items, audit


def seal():
    basis=json.loads((ROOT/'validation/full-audit-input-hashes.json').read_bytes())
    report=(ROOT/basis['fullAuditReport']).read_bytes()
    assert sha(report)==basis['fullAuditReportSha256'] and json.loads(report)['status']=='PASS'
    known={e['path']:e for e in basis['physicalRecoveryFiles']}
    logical={e['path']:e for e in basis['logicalTargets']}
    selected=json.loads((ROOT/'validation/selection.json').read_bytes())['files']
    for e in selected:
        assert e['path'] in logical and e['sha256']==logical[e['path']]['sha256'] and e['bytes']==logical[e['path']]['bytes'], 'New/changed logical payload needs full audit'
    matched=0
    final_paths=[]
    contract_index='recovery/patches/patch-verification.json'
    old_contracts={c['path']:c for c in basis['patchVerificationDocument']['contracts']}
    current_contracts=json.loads((ROOT/contract_index).read_bytes())['contracts']
    assert all(c['path'] in old_contracts and c==old_contracts[c['path']] for c in current_contracts), 'Changed/new patch contract needs full audit'
    for p in sorted((ROOT/'recovery').rglob('*')):
        if not p.is_file(): continue
        rel=p.relative_to(ROOT).as_posix();data=p.read_bytes()
        if rel != contract_index:
            assert rel in known and sha(data)==known[rel]['sha256'] and len(data)==known[rel]['bytes'], 'New/changed physical payload needs full audit: '+rel
            matched+=1
        final_paths.append(rel)
    ignored={'manifest.json','validation/final-safety-seal.json'}
    # The manifest and this self-excluded audit result contain only hashes/counts.
    # Every other final metadata file is scanned again.
    def inputs():
        for p in sorted(ROOT.rglob('*')):
            if not p.is_file(): continue
            rel=p.relative_to(ROOT).as_posix()
            if (rel.startswith('recovery/') and rel!=contract_index) or rel in ignored: continue
            yield rel,p.read_bytes(),'physical',rel
    result=scan_items(inputs())
    # Re-run all current logical path/ignore policies, using the same local helper
    # without rescanning unchanged gigabyte payloads a second time.
    from safety_audit import exclusion, generated_output_path
    forbidden=[e['path'] for e in selected if exclusion(e['path']) or generated_output_path(e['path'])]
    probes=sorted(set([PREFIX+p.relative_to(ROOT).as_posix() for p in ROOT.rglob('*') if p.is_file()]
        +[e['path'] for e in selected]))
    check=subprocess.run(['git','check-ignore','--no-index','-z','--stdin'],cwd=REPO,env=ENV,
        input=('\0'.join(probes)+'\0').encode(),capture_output=True)
    assert check.returncode in (0,1)
    ignored_paths=check.stdout.decode('utf-8').strip('\0').split('\0') if check.stdout else []
    require_clean=not result['secretPrivacyFindings'] and not forbidden and not ignored_paths and not any(e['disposition']=='REVIEW' for e in result['encoding'])
    result.update(status='PASS' if require_clean else 'FAIL',
        fullAuditReport=basis['fullAuditReport'],fullAuditReportSha256=basis['fullAuditReportSha256'],
        unchangedAuditedPhysicalRecoveryFiles=matched,unchangedAuditedLogicalTargets=len(selected),
        auditedContractSubset=len(current_contracts),rescannedContractIndex=contract_index,
        omittedAuditedPhysicalFiles=sorted(set(known)-set(final_paths)),
        omittedAuditedLogicalTargets=sorted(set(logical)-{e['path'] for e in selected}),
        forbiddenPayloadPaths=forbidden,
        checkIgnoreProbeCount=len(probes),includedIgnoredPaths=ignored_paths,
        note='Every final payload/base/patch byte is unchanged from the completed full physical/decoded/current audit. Only target omissions and metadata sealing followed. The surviving contract subset is checked and its index rescanned. All substantive final metadata was rescanned; any new/changed payload would fail this seal.')
    write_json(ROOT/'validation/final-safety-seal.json',result)
    print(json.dumps(dict(status=result['status'],unchangedAuditedPhysicalRecoveryFiles=matched,
        unchangedAuditedLogicalTargets=len(selected),metadataFilesRescanned=result['scanned'],
        findings=result['secretPrivacyFindings'],forbiddenPayloadPaths=forbidden),indent=2))
    return result


if __name__=='__main__':
    result=seal();sys.exit(0 if result['status']=='PASS' else 1)
