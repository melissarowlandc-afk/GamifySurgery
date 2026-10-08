import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {execFileSync} from 'node:child_process';

const archive=path.dirname(fileURLToPath(import.meta.url));
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const canonical=s=>s.replace(/\r\n/g,'\n');
const decoder=new TextDecoder('utf-8',{fatal:true});
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>{
  if(e.isSymbolicLink())throw Error(`Symlink forbidden: ${e.name}`);
  return e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)];
});
function safe(relative){
  if(relative.includes('\\')||path.isAbsolute(relative)||relative.split('/').some(p=>p==='..'||p===''||p==='.' ))throw Error(`Unsafe path ${relative}`);
  const resolved=path.resolve(archive,relative);
  if(!resolved.startsWith(archive+path.sep))throw Error(`Outside archive ${relative}`);
  return resolved;
}
const manifest=JSON.parse(fs.readFileSync(path.join(archive,'manifest.json'),'utf8'));
const payloads=new Map();
const forbidden=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\b(?:ghp_|github_pat_)[A-Za-z0-9_]{20,}\b/,/\bAKIA[A-Z0-9]{16}\b/,/\bsk-(?:proj-)?[A-Za-z0-9_-]{24,}\b/];
for(const entry of manifest.payloads){
  const absolute=safe(entry.path);if(payloads.has(entry.path))throw Error('Duplicate payload');
  const bytes=fs.readFileSync(absolute),text=decoder.decode(bytes);
  if(bytes.length!==entry.bytes||sha(bytes)!==entry.sha256)throw Error(`Payload mismatch ${entry.path}`);
  if(text.includes('\u0000')||forbidden.some(rule=>rule.test(text)))throw Error(`Prohibited payload ${entry.path}`);
  payloads.set(entry.path,{bytes,text});
}
const actual=walk(archive).map(p=>path.relative(archive,p).split(path.sep).join('/')).filter(p=>p!=='manifest.json');
if(actual.length!==payloads.size||actual.some(p=>!payloads.has(p)))throw Error('Unlisted archive file');
const contracts=JSON.parse(payloads.get('recovery/PATCH_CONTRACTS.json').text);
const groups=Map.groupBy(contracts,c=>c.patchPath);
let hunks=0;
for(const [patchPath,entries] of groups){
  const patch=payloads.get(patchPath)?.text;if(!patch)throw Error('Missing patch');
  const headers=[...patch.matchAll(/^\+\+\+ b\/(.+)$/gm)].map(m=>m[1]);
  if(JSON.stringify(headers)!==JSON.stringify(entries.map(e=>e.target)))throw Error(`Patch targets ${patchPath}`);
  for(const target of headers)if(!/^(?:packages\/(?:game-domain|balance-config)\/(?:src|tests)\/|apps\/player\/src\/|tests\/e2e\/)/.test(target)||target.includes('..')||target.includes('\\'))throw Error(`Forbidden target ${target}`);
  for(const match of patch.matchAll(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@[^\n]*\n([\s\S]*?)(?=^@@ |^diff --git |$(?![\s\S]))/gm)){
    const lines=match[5].replace(/\n$/,'').split('\n');
    const old=lines.filter(l=>l[0]===' '||l[0]==='-').length,next=lines.filter(l=>l[0]===' '||l[0]==='+').length;
    if(old!==Number(match[2]??1)||next!==Number(match[4]??1))throw Error(`Hunk counts ${patchPath}`);
    hunks++;
  }
}
if(hunks!==contracts.reduce((sum,c)=>sum+c.hunks,0))throw Error('Hunk inventory mismatch');
for(const e of JSON.parse(payloads.get('recovery/OWNED_FILE_STATUS.json').text)){
  if(sha(payloads.get(`files/${e.target}`).bytes)!==e.archiveCanonicalSha256)throw Error(`Owned file contract ${e.target}`);
}
let fixtureFiles=0;
if(process.argv.length>2){
  if(process.argv[2]!=='--private-contracts'||process.argv.length!==4)throw Error('Only --private-contracts <file> is supported');
  const privatePath=path.resolve(process.argv[3]);
  if(!privatePath.split(path.sep).includes('.local-dev'))throw Error('Fixtures must stay under .local-dev');
  const privateEntries=JSON.parse(fs.readFileSync(privatePath,'utf8'));
  if(privateEntries.length!==contracts.length)throw Error('Private contract count');
  const scratch=fs.mkdtempSync(path.join(path.dirname(privatePath),'backup-verification-'));
  for(const [patchPath,entries] of groups){
    const dir=path.join(scratch,path.basename(patchPath,'.patch'));fs.mkdirSync(dir);
    // A private empty repository prevents Git from filtering these paths by the
    // active repository's ignored scratch-directory prefix.
    execFileSync('git',['init','--quiet'],{cwd:dir,stdio:'pipe'});
    for(const e of entries){
      const privateEntry=privateEntries.find(p=>p.patchPath===patchPath&&p.target===e.target);
      if(!privateEntry)throw Error('Missing private comparator');
      let before='';
      if(privateEntry.beforeImage){
        const image=path.resolve(privateEntry.beforeImage);
        if(!image.startsWith(path.resolve('.local-dev')+path.sep))throw Error('Comparator outside private evidence');
        before=canonical(decoder.decode(fs.readFileSync(image)));
      }else if(!e.newFile)throw Error('Existing target without comparator');
      if(sha(before)!==e.beforeCanonicalSha256)throw Error(`Comparator hash ${e.target}`);
      if(!e.newFile){const dest=path.join(dir,e.target);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,before);}
    }
    const patch=safe(patchPath);
    const git=args=>execFileSync('git',['-c','core.autocrlf=false','apply','--whitespace=nowarn',...args,patch],{cwd:dir,stdio:'pipe'});
    git(['--check']);git([]);
    for(const e of entries)if(sha(fs.readFileSync(path.join(dir,e.target)))!==e.afterCanonicalSha256)throw Error(`Forward contract ${e.target}`);
    git(['--reverse','--check']);git(['--reverse']);
    for(const e of entries){const target=path.join(dir,e.target);if(e.newFile){if(fs.existsSync(target))throw Error('Reverse creation');}else if(sha(fs.readFileSync(target))!==e.beforeCanonicalSha256)throw Error('Reverse comparator');}
    git(['--check']);git([]);
    for(const e of entries)if(sha(fs.readFileSync(path.join(dir,e.target)))!==e.afterCanonicalSha256)throw Error('Reapply contract');
    fixtureFiles+=entries.length;
  }
}
console.log(JSON.stringify({status:'PASS',payloads:payloads.size,payloadBytes:manifest.payloads.reduce((sum,e)=>sum+e.bytes,0),patches:groups.size,patchTargets:contracts.length,hunks,gitForwardReverseReapplyFiles:fixtureFiles,manifestSha256:sha(fs.readFileSync(path.join(archive,'manifest.json')))},null,2));
