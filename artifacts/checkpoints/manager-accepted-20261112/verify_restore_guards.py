"""Negative guards and an isolated archive-only disk reproduce-from-patches check."""
from pathlib import Path
import json
import os
import shutil
import sys

sys.dont_write_bytecode = True
from capture_inventory import ROOT, sha, write_json
from verify_archive import safe_path, require, apply_patch_bytes, stored_bytes, contract_bytes, verify
from restore_recovery import restore, destination_guard


def clean(path):
    path = path.resolve()
    require(path.is_relative_to(ROOT.resolve()) and path.name in {'guard-scratch','restore-scratch','_restore'}, 'Unsafe scratch cleanup')
    require(not path.is_symlink(), 'Scratch symlink')
    if path.exists(): shutil.rmtree(path)


def guard_tests():
    scratch = ROOT/'validation/guard-scratch'
    clean(scratch)
    scratch.mkdir()
    passed = []
    def rejects(name, fn):
        try: fn()
        except (ValueError,UnicodeError,FileNotFoundError): passed.append(name)
        else: raise ValueError('Guard accepted invalid input: '+name)
    try:
        for rel in ['../escape','/absolute','C:/absolute','a\\escape','a//empty','./dot','a/../escape',
            'NUL','aux.txt','a/con','a/trailing.','a/trailing ','a?.txt','a:stream']:
            rejects('unsafe_path_'+rel, lambda rel=rel:safe_path(scratch,rel))
        base=b'alpha\nbeta\n'; patch=b'--- a/x\n+++ b/x\n@@ -1,2 +1,2 @@\n alpha\n-beta\n+gamma\n'
        require(apply_patch_bytes(base,patch)==b'alpha\ngamma\n','Positive patch control')
        require(apply_patch_bytes(b'alpha\ngamma\n',patch,reverse=True)==base,'Positive reverse control')
        rejects('patch_wrong_context',lambda:apply_patch_bytes(b'alpha\nwrong\n',patch))
        rejects('patch_corruption',lambda:apply_patch_bytes(base,patch.replace(b' alpha',b'?alpha')))
        rejects('patch_wrong_counts',lambda:apply_patch_bytes(base,patch.replace(b'-1,2',b'-1,3')))
        rejects('patch_missing_body',lambda:apply_patch_bytes(base,patch[:-8]))
        rejects('patch_no_hunks',lambda:apply_patch_bytes(base,b'--- a/x\n+++ b/x\n'))
        rejects('patch_out_of_order',lambda:apply_patch_bytes(base,patch+patch))
        (scratch/'bad.base64').write_bytes(b'!not-base64!\n')
        rejects('bad_base64',lambda:stored_bytes(scratch,'bad.base64','base64'))
        (scratch/'bad.base64').write_bytes(b'YWxwaGE=\r\n')
        rejects('base64_CRLF',lambda:stored_bytes(scratch,'bad.base64','base64'))
        rejects('unknown_storage_encoding',lambda:stored_bytes(scratch,'bad.base64','unknown'))
        rejects('restore_archive_overlap',lambda:destination_guard(ROOT,ROOT/'recovery'))
        rejects('restore_ancestor_overlap',lambda:destination_guard(ROOT,ROOT.parent))
        nonempty=scratch/'nonempty';nonempty.mkdir();(nonempty/'preserved.txt').write_bytes(b'keep\n')
        rejects('restore_nonempty_destination',lambda:destination_guard(ROOT,nonempty))
        # Corrupt only a small synthetic archive, never an original archive or hardlink.
        tiny=scratch/'tiny';tiny.mkdir();(tiny/'manifest.json').write_text('{"archive":"wrong","baseCommit":"wrong"}',encoding='utf-8')
        rejects('wrong_manifest_baseline',lambda:verify(tiny))
        write_json(ROOT/'validation/negative-guard-tests.json',dict(status='PASS',checks=len(passed),passed=passed,
            positivePatchControls=2,originalArchiveOrSourceMutations=0,gitMutations=0))
    finally: clean(scratch)


def roundtrip():
    # Verify the sealed source first. Copy only manifested files into a sibling
    # isolated input inside this worker's permitted output tree.
    sealed = verify(ROOT)
    manifest=json.loads((ROOT/'manifest.json').read_bytes())
    entries=manifest['files']+[dict(path='manifest.json',bytes=(ROOT/'manifest.json').stat().st_size)]
    # Keep the already long archive paths below Windows' ordinary path limit.
    scratch=ROOT/'_restore'
    clean(scratch)
    source=scratch/'a';destination=scratch/'o'
    source.mkdir(parents=True)
    linked=copied=0
    try:
        for e in entries:
            origin=safe_path(ROOT,e['path']);target=safe_path(source,e['path'])
            target.parent.mkdir(parents=True,exist_ok=True)
            try: os.link(origin,target);linked+=1
            except OSError: shutil.copyfile(origin,target);copied+=1
        result=restore(source,destination=destination)
        selection=json.loads((source/'validation/selection.json').read_bytes())['files']
        require({p.relative_to(destination).as_posix() for p in destination.rglob('*') if p.is_file()}=={e['path'] for e in selection},'Unexpected restored disk files')
        total=0
        for e in selection:
            data=safe_path(destination,e['path']).read_bytes()
            require(sha(data)==e['sha256'] and len(data)==e['bytes'],'Disk restoration mismatch: '+e['path'])
            total+=len(data)
        cs=json.loads((source/'recovery/patches/patch-verification.json').read_bytes())['contracts']
        for c in cs:
            base,patch=contract_bytes(source,c)
            current=safe_path(destination,c['path']).read_bytes()
            require(apply_patch_bytes(base,patch)==current,'Patch reproduction mismatch')
            require(apply_patch_bytes(current,patch,reverse=True)==base,'Disk reverse mismatch')
        result.update(status='PASS',diskHashesMatched=len(selection),diskBytes=total,
            reproduceFromPatches=len(cs),reverseFromDisk=len(cs),
            archiveOnlyInputs=True,liveSourcesReadByRestore=False,gitObjectsReadByRestore=False,
            isolatedArchiveHardlinks=linked,isolatedArchiveCopies=copied,
            allScratchInsideAssignedArchive=True,scratchRemoved=True,
            resolvedEnvironmentIssue='Initial deeply nested temporary input exceeded Windows path length; the shortened archive-local scratch path passed.',
            note='Whole new files are restored as exact archive payloads; shared targets are reconstructed solely from bundled bases and patches. Six prior layers and baseline dependencies are still required for the full project.')
    finally: clean(scratch)
    write_json(ROOT/'validation/disk-restore-roundtrip.json',result)
    print(json.dumps(result,indent=2))


if __name__=='__main__':
    if '--guards-only' in sys.argv:
        guard_tests();print((ROOT/'validation/negative-guard-tests.json').read_text('utf-8'))
    else: roundtrip()
