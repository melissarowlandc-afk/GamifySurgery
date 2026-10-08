"""Read-only checkpoint audit; optional replay writes only new ignored scratch."""
from pathlib import Path
import argparse,hashlib,json,os,re,subprocess,tempfile
root=Path(__file__).resolve().parent;repo=root.parents[2]
arg=argparse.ArgumentParser();arg.add_argument('--baseline-root');args=arg.parse_args()
sha=lambda b:hashlib.sha256(b).hexdigest()
def inside(base,name):
 p=Path(name)
 if p.is_absolute() or '..' in p.parts:raise ValueError('Unsafe path '+name)
 target=(base/p).resolve()
 if not target.is_relative_to(base.resolve()) or target==base.resolve():raise ValueError(name)
 return target
manifest=json.loads((root/'manifest.json').read_text(encoding='utf8'))
records=json.loads((root/'recovery/SOURCE_HASHES.json').read_text(encoding='utf8'))['patches']
assert manifest['recoveryOnly'] and not manifest['cleanRunnableCheckout']
assert manifest['clinicalReviewStatus']=='needs_clinician_review' and manifest['publicReleaseAuthorized'] is False
expected={x['archivePath'] for x in manifest['payloads']}
actual={p.relative_to(root).as_posix() for p in root.rglob('*') if p.is_file()}
assert actual==expected|{'manifest.json'},'Payload inventory mismatch'
assert manifest['payloadCount']==len(expected)
assert manifest['payloadBytes']==sum(x['bytes'] for x in manifest['payloads'])
secrets=[r'(?:ghp_|github_pat_)[A-Za-z0-9_]{25,}',r'(?<![A-Za-z0-9_-])sk-[A-Za-z0-9_-]{24,}',r'-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----',r'AKIA[A-Z0-9]{16}',r'Bearer\s+[A-Za-z0-9_-]{30,}']
for x in manifest['payloads']:
 p=inside(root,x['archivePath']);assert not p.is_symlink();data=p.read_bytes()
 assert len(data)==x['bytes'] and sha(data)==x['sha256'],x['archivePath']
 assert p.suffix.lower() not in ['.pdf','.png','.jpg','.zip','.db','.sqlite','.env']
 assert not any(t in Path(x['archivePath']).parts for t in ['node_modules','dist','.local-dev','.clinical-workbench','.private-clinical-data'])
 assert not any(re.search(pattern,data.decode('utf8')) for pattern in secrets),'Potential credential '+x['archivePath']
 if x.get('exactByteCopy'):assert x['archivePath']=='files/'+x['originalPath'] and x['originalSha256']==sha(data)
assert sum(bool(x.get('exactByteCopy')) for x in manifest['payloads'])==15
assert len(records)==23 and len({x['targetPath'] for x in records})==23
for x in records:
 text=inside(root,x['patchPath']).read_text(encoding='utf8')
 assert text.startswith(f"diff --git a/{x['targetPath']} b/{x['targetPath']}\n--- a/{x['targetPath']}\n+++ b/{x['targetPath']}\n")
 assert len(re.findall(r'^diff --git ',text,re.M))==1
 assert sha(inside(root,x['patchPath']).read_bytes())==x['patchSha256']
 assert [s for s in text.splitlines() if s[:1] in ['+','-'] and not s.startswith(('+++','---'))]==x['changedLines']
 assert re.findall(r'^@@.*@@.*$',text,re.M)==x['hunks']
 assert x['preimageKind']==('captured_exact_pre_edit' if x['historicalPreEditSourceCaptured'] else 'inferred_compatible_counterfactual_preserving_concurrent_edits')
scratch=None
if args.baseline_root:
 baseline=Path(args.baseline_root).resolve();inputs={}
 for x in records:
  p=inside(baseline,x['targetPath']);assert not p.is_symlink();data=p.read_bytes()
  assert len(data)==x['baselineBytes'] and sha(data)==x['baselineSha256'],'Baseline divergence '+x['targetPath']
  inputs[x['targetPath']]=data
 parent=repo/'.local-dev/gs028-20261007-level3/backup';parent.mkdir(parents=True,exist_ok=True)
 scratch=Path(tempfile.mkdtemp(prefix='verified-roundtrip-',dir=parent))
 for name,data in inputs.items():
  p=inside(scratch,name);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
 env={k:v for k,v in os.environ.items() if k not in ['GIT_DIR','GIT_WORK_TREE','GIT_INDEX_FILE']};env['GIT_CEILING_DIRECTORIES']=str(parent)
 def git(*command):subprocess.run(['git','-c','core.autocrlf=false','-c','core.safecrlf=false',*command],cwd=scratch,env=env,check=True,capture_output=True)
 def matches(field):
  for x in records:assert sha(inside(scratch,x['targetPath']).read_bytes())==x[field],x['targetPath']
 for x in records:git('apply','--check',str(inside(root,x['patchPath'])));git('apply',str(inside(root,x['patchPath'])))
 matches('targetSha256')
 for x in reversed(records):git('apply','--reverse',str(inside(root,x['patchPath'])))
 matches('baselineSha256')
 for x in records:git('apply',str(inside(root,x['patchPath'])))
 matches('targetSha256')
 for x in manifest['payloads']:
  if x.get('exactByteCopy'):
   p=inside(scratch,x['originalPath']);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(inside(root,x['archivePath']).read_bytes());assert sha(p.read_bytes())==x['originalSha256']
print(json.dumps({'status':'pass','payloads':len(expected),'patches':23,'exactCopies':15,'forwardReverseReapplyPass':bool(scratch),'scratch':str(scratch) if scratch else None},indent=2))
