// One-time, byte-preserving archive before the owner-directed 3x2 revision.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const target=path.resolve(root,'history/4x3-20261010');
if(!target.startsWith(root+path.sep))throw Error('Archive outside owned lane');
if(fs.existsSync(target))throw Error('Archive already exists; preserve it');
const hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const files=[];
function collect(dir){for(const ent of fs.readdirSync(dir,{withFileTypes:true})){if(dir===root&&(ent.name==='history'||ent.name==='archive-4x3.mjs'))continue;const source=path.join(dir,ent.name);if(ent.isDirectory())collect(source);else if(ent.isFile())files.push(source);else throw Error('Unexpected non-file '+source);}}
collect(root);
const manifest=[];
for(const source of files){const relative=path.relative(root,source),dest=path.join(target,relative),bytes=fs.readFileSync(source);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,bytes);if(hash(fs.readFileSync(dest))!==hash(bytes))throw Error('Archive mismatch '+relative);manifest.push({file:relative.replaceAll('\\','/'),bytes:bytes.length,sha256:hash(bytes)});}
const repo=path.resolve(root,'../../../../'),planPath=path.join(repo,'docs/execplans/level5-room-design-20261008.md'),plan=fs.readFileSync(planPath,'utf8'),heading='## Step: Executive Office mockup',start=plan.indexOf(heading);
if(start<0)throw Error('Executive plan section missing');
const next=plan.indexOf('\n## ',start+heading.length),end=next<0?plan.length:next;
fs.writeFileSync(path.join(target,'EXECPLAN_SECTION.md'),plan.slice(start,end));
fs.writeFileSync(path.join(target,'archive-manifest.json'),JSON.stringify({schemaVersion:1,sourceFootprint:[4,3],ownerRevisionDate:'2026-10-10',files:manifest,executivePlanSectionSha256:hash(plan.slice(start,end)),planPrefixSha256:hash(plan.slice(0,start)),planSuffixSha256:hash(plan.slice(end)),note:'Original 4x3 files copied byte-for-byte before the 3x2 revision; static native PNGs are the reference. Relative shared-asset URLs in the archived proof are the original URLs.'},null,2)+'\n');
console.log(`ARCHIVE PASS: ${manifest.length} original 4x3 files copied byte-identically to history/4x3-20261010/; prior Executive plan section preserved.`);
