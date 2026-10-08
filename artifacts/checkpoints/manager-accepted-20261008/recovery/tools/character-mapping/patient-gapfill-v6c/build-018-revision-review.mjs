// Review-only composites: all character pixels come from saved packages.
import assert from 'node:assert/strict';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,tool,hash,rel} from './build-roster.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8')),b=json(resolve(tool,'analysis/018-regeneration/intake.json'));
const before=resolve(root,'packages/018/review-history',b.before.manifestSha256),after=resolve(root,'packages/018');
assert.equal(hash(resolve(before,'manifest.json')),b.before.manifestSha256);
const directory=resolve(root,'review/manager');mkdirSync(directory,{recursive:true});
const receipt=f=>({path:rel(f),sha256:hash(f)}),proofs=[];
const full=createCanvas(1280,688),f=full.getContext('2d');f.fillStyle='#eee9df';f.fillRect(0,0,1280,688);f.imageSmoothingEnabled=false;
f.fillStyle='#20252b';f.font='18px sans-serif';f.fillText('018 original — manager rejected teen appearance',12,26);f.fillText('018 revised — adult 33, trousers and stubble',652,26);
for(const [i,d]of [before,after].entries())f.drawImage(await loadCanvas(resolve(d,'full-poses-light.png')),i*640,48);
const fullFile=resolve(directory,'018-original-left-revised-right.png');writeFileSync(fullFile,full.toBuffer('image/png'));proofs.push(receipt(fullFile));
const placement=json(resolve(root,'placement-qa/placement-manifest.json')).diagnostics.find(x=>x.number==='018');
const {renderedWidth:w,renderedHeight:h}=placement.runtimeGeometry;assert.equal(w,55);assert.equal(h,110);
const refs=[{label:'018 original (rejected)',path:resolve(before,'stand-south.png')},{label:'018 revised, Male 33',path:resolve(after,'stand-south.png')},{label:'Accepted v6b.015, Male 34',path:resolve(repo,'artifacts/character-statics/patient-gapfill-v6b/packages/015/stand-south.png')},{label:'Accepted v6a.019, Male 37',path:resolve(repo,'artifacts/character-statics/patient-gapfill-v6a/packages/019/stand-south.png')}];
const small=createCanvas(1280,700),s=small.getContext('2d');s.fillStyle='#eee9df';s.fillRect(0,0,1280,700);s.imageSmoothingEnabled=false;
for(const [i,r]of refs.entries()){const x=i*320;s.fillStyle='#fff';s.fillRect(x+4,4,312,692);s.fillStyle='#20252b';s.font='15px sans-serif';s.fillText(r.label,x+10,26);const src=await loadCanvas(r.path);s.drawImage(src,x+(320-w)/2,52,w,h);s.font='13px sans-serif';s.fillText('Actual 55x110 frame',x+10,186);s.fillText('4x inspection below',x+10,206);s.drawImage(src,x+(320-w*4)/2,222,w*4,h*4);}
const scaleFile=resolve(directory,'018-adult-before-after-game-scale.png');writeFileSync(scaleFile,small.toBuffer('image/png'));proofs.push(receipt(scaleFile));
const manifest={schemaVersion:'patient-gapfill-v6c-018-revision-review/v1',scope:'Saved original left / revised right; native package pixels unchanged. Game-scale board uses actual 55x110 frame derived from approved Front Desk runtime geometry, followed by 4x nearest-pixel inspection and accepted adult references.',managerStatus:'other18-accepted;revised018-pending',originalSourceSha256:b.before.sourceSha256,selectedSource:receipt(resolve(root,'sources/018/source.png')),originalPackageSnapshot:receipt(resolve(before,'manifest.json')),contacts:placement.candidateContacts,proofs,gameScale:{width:w,height:h,identityScale:placement.runtimeGeometry.identityScale},referenceFrames:refs.map(r=>({label:r.label,...receipt(r.path)}))};
const manifestFile=resolve(directory,'018-revision-review-manifest.json');writeFileSync(manifestFile,JSON.stringify(manifest,null,2)+'\n');
const gallery=resolve(root,'review/index.html');let html=readFileSync(gallery,'utf8').replace(/<!-- BEGIN 018 REVISION REVIEW -->[\s\S]*?<!-- END 018 REVISION REVIEW -->/g,'');
html=html.replace('<main>','<!-- BEGIN 018 REVISION REVIEW --><p>Manager requested adult revision of 018; other 18 identities accepted. <a href="manager/018-original-left-revised-right.png">018 original/revised all eight poses</a> · <a href="manager/018-adult-before-after-game-scale.png">018 at actual game frame size beside accepted adults</a>.</p><!-- END 018 REVISION REVIEW --><main>');
html=html.replace('../sources/018/stage1-standing-cardinals.png">standing identity reference','../sources/018/stage1-standing-cardinals.png">original standing seed (historical)');
writeFileSync(gallery,html);
console.log(JSON.stringify({status:'PASS',identity:'patient-gapfill-v6c.018',allEightPoseBeforeAfter:true,actualRuntimeFrame:{width:w,height:h},proofs:proofs.length,sourceSha256:manifest.selectedSource.sha256,managerReview:'pending'}));

