// Replace only the assigned Executive section; preserve all other plan bytes.
import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(root,'../../../..'),file=path.join(repo,'docs/execplans/level5-room-design-20261008.md'),hash=s=>crypto.createHash('sha256').update(s).digest('hex'),heading='## Step: Executive Office mockup',before=fs.readFileSync(file,'utf8'),start=before.indexOf(heading);
if(start<0||before.indexOf(heading,start+heading.length)>=0)throw Error('Expected one Executive section');
const next=before.indexOf('\n## ',start+heading.length),end=next<0?before.length:next,prefix=before.slice(0,start),suffix=before.slice(end),old=before.slice(start,end),archive=JSON.parse(fs.readFileSync(path.join(root,'history/4x3-20261010/archive-manifest.json'))),section=fs.readFileSync(path.join(root,'EXECPLAN_SECTION.md'),'utf8');
if(hash(old)!==archive.executivePlanSectionSha256)throw Error('Concurrent Executive-section change; inspect before replacing');
if(!section.startsWith(heading+'\n'))throw Error('Wrong revision section');
const after=prefix+section+suffix;fs.writeFileSync(file,after);
const receipt={status:'PASS',date:'2026-10-10',assignedSection:heading,beforeSha256:hash(before),afterSha256:hash(after),unchangedPrefixBytes:Buffer.byteLength(prefix),unchangedSuffixBytes:Buffer.byteLength(suffix),unchangedPrefixSha256:hash(prefix),unchangedSuffixSha256:hash(suffix),oldSectionSha256:hash(old),newSectionSha256:hash(section),historySection:'history/4x3-20261010/EXECPLAN_SECTION.md',scope:'Only the assigned Executive section replaced; Founder and concurrent manager bytes preserved.'};
fs.writeFileSync(path.join(root,'proof/evidence/v3/plan-revision-receipt.json'),JSON.stringify(receipt,null,2)+'\n');
console.log('PLAN REVISION PASS: Executive Office section updated to 3x2; all preceding/following plan bytes preserved.');
