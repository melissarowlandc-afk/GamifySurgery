import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createCanvas, loadImage } from '@napi-rs/canvas';

const repo = path.resolve(import.meta.dirname, '../../..');
const priorRoot = path.join(repo, 'artifacts/character-movement/gs019-navy-walk/west-candidate-v2');
const outRoot = path.join(repo, 'artifacts/character-movement/gs019-navy-walk/west-candidate-v3');
const phases = ['01','02','03','04','05','06','07','08'];
const sha = value => createHash('sha256').update(value).digest('hex');
const save = (file, canvas) => { const bytes = canvas.toBuffer('image/png'); const target = path.join(outRoot, file); mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, bytes); return { file, sha256: sha(bytes), width: canvas.width, height: canvas.height }; };
const priorBytes = readFileSync(path.join(priorRoot, 'manifest.json'));
const prior = JSON.parse(priorBytes);

function samePixel(a, ai, b, bi) { for (let k = 0; k < 4; k++) if (a[ai + k] !== b[bi + k]) return false; return true; }
function headLike(r, g, b, a) { return a >= 80 && (Math.max(r,g,b) <= 105 || (r > 100 && r - g >= 20 && g - b >= 12)); }
function residueMask(body, frame, placement) {
  const bd = body.getContext('2d').getImageData(0,0,body.width,body.height).data;
  const fd = frame.getContext('2d').getImageData(0,0,160,320).data;
  const hit = new Uint8Array(body.width * Math.min(11, body.height));
  for (let y=0;y<Math.min(11,body.height);y++) for(let x=0;x<body.width;x++) {
    const fx=placement.x+x, fy=placement.y+y, bi=(y*body.width+x)*4, fi=(fy*160+fx)*4;
    if (fx>=0&&fx<78&&fy>=0&&fy<320&&samePixel(bd,bi,fd,fi)&&headLike(bd[bi],bd[bi+1],bd[bi+2],bd[bi+3])) hit[y*body.width+x]=1;
  }
  const seen=new Uint8Array(hit.length), removed=[];
  for(let seed=0;seed<hit.length;seed++) {
    if(!hit[seed]||seen[seed]) continue;
    const q=[seed], group=[]; seen[seed]=1;
    while(q.length){const n=q.pop(),x=n%body.width,y=Math.floor(n/body.width);group.push(n);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy;if(nx<0||nx>=body.width||ny<0||ny>=11)continue;const z=ny*body.width+nx;if(hit[z]&&!seen[z]){seen[z]=1;q.push(z)}}}
    const xs=group.map(n=>n%body.width), ys=group.map(n=>Math.floor(n/body.width)), minY=Math.min(...ys), width=Math.max(...xs)-Math.min(...xs)+1;
    if(minY<=2&&width>=4) for(const n of group) { const i=n*4, y=Math.floor(n/body.width); if(y<=5&&Math.max(bd[i],bd[i+1],bd[i+2])<=105) removed.push(n); }
  }
  if(removed.length){const base=new Set(removed),maxX=Math.max(...removed.map(n=>n%body.width));for(let y=0;y<=5;y++)for(let x=0;x<=maxX-2;x++){const n=y*body.width+x;if(base.has(n))continue;let near=false;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)if(base.has((y+dy)*body.width+x+dx))near=true;if(!near)continue;const fx=placement.x+x,fy=placement.y+y,bi=n*4,fi=(fy*160+fx)*4,r=bd[bi],g=bd[bi+1],b=bd[bi+2],a=bd[bi+3],warm=r>100&&r-g>=20&&g-b>=12;if(a>=24&&!warm&&Math.max(r,g,b)<=180&&samePixel(bd,bi,fd,fi)){base.add(n);removed.push(n)}}}
  return removed.map(n=>({ localX:n%body.width, localY:Math.floor(n/body.width), frameX:placement.x+n%body.width, frameY:placement.y+Math.floor(n/body.width), rgba:Array.from(bd.slice(n*4,n*4+4)) }));
}
function clearedCopy(source, removals, local=true) { const out=createCanvas(source.width,source.height),ctx=out.getContext('2d');ctx.drawImage(source,0,0);const p=ctx.getImageData(0,0,out.width,out.height);for(const r of removals){const x=local?r.localX:r.frameX,y=local?r.localY:r.frameY,i=(y*out.width+x)*4;p.data[i+3]=0;}ctx.putImageData(p,0,0);return out; }
function mirror(source){const out=createCanvas(160,320),ctx=out.getContext('2d');ctx.translate(160,0);ctx.scale(-1,1);ctx.drawImage(source,0,0);return out;}
async function proof(records){const chosen=['01','05','07','08'], crop={x:44,y:92,w:84,h:58}, scale=4, canvas=createCanvas(crop.w*scale*2,(crop.h*scale+24)*chosen.length),ctx=canvas.getContext('2d');ctx.fillStyle='#ded8ce';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#20242a';ctx.font='14px sans-serif';ctx.imageSmoothingEnabled=false;let y=0;for(const phase of chosen){ctx.fillText(`Prior ${phase}`,4,y+16);ctx.fillText(`Clean ${phase}`,crop.w*scale+4,y+16);const a=await loadImage(path.join(priorRoot,prior.frames[phase].file)),b=await loadImage(path.join(outRoot,records[phase].file));ctx.drawImage(a,crop.x,crop.y,crop.w,crop.h,0,y+24,crop.w*scale,crop.h*scale);ctx.drawImage(b,crop.x,crop.y,crop.w,crop.h,crop.w*scale,y+24,crop.w*scale,crop.h*scale);y+=crop.h*scale+24;}return canvas;}
async function all8(records,label){const canvas=createCanvas(1280,344),ctx=canvas.getContext('2d');ctx.fillStyle='#ded8ce';ctx.fillRect(0,0,1280,344);ctx.fillStyle='#20242a';ctx.font='14px sans-serif';ctx.imageSmoothingEnabled=false;for(const [i,p] of phases.entries()){ctx.fillText(`${label} ${p}`,i*160+4,17);ctx.drawImage(await loadImage(path.join(outRoot,records[p].file)),i*160,24);}return canvas;}

const frames={},eastFrames={},authored={},cleanup={};
for(const phase of phases){const body=await loadImage(path.join(priorRoot,prior.authored[phase].file)),west=await loadImage(path.join(priorRoot,prior.frames[phase].file)),placement=prior.frames[phase].bodyPlacement,bc=createCanvas(body.width,body.height),wc=createCanvas(160,320);bc.getContext('2d').drawImage(body,0,0);wc.getContext('2d').drawImage(west,0,0);const removals=residueMask(bc,wc,placement),cleanBody=clearedCopy(bc,removals,true),cleanWest=clearedCopy(wc,removals,false);authored[phase]=save(`authored/west-${phase}.png`,cleanBody);frames[phase]={...save(`frames/west-${phase}.png`,cleanWest),bodyPlacement:placement,headTranslation:prior.frames[phase].headTranslation};eastFrames[phase]={...save(`frames/east-${phase}.png`,mirror(cleanWest)),exactHorizontalMirrorOf:frames[phase].file};cleanup[phase]={removedPixelCount:removals.length,removedPixels:removals,policy:'clear only exposed top-edge donor jaw/neck component outside approved head pixels'};}
const proofs={diagnostic4x:save('proofs/head-cleanup-01-05-07-08-4x.png',await proof(frames)),westAll8:save('proofs/west-all8-native.png',await all8(frames,'West')),eastAll8:save('proofs/east-all8-native.png',await all8(eastFrames,'East'))};
const manifest={schemaVersion:'gs019-navy-walk/west-candidate-v3',status:'prototype-needs-owner-review',characterId:prior.characterId,canvas:prior.canvas,gamePresentation:{width:32,height:64},phaseContract:prior.phaseContract,pins:{priorManifest:{file:path.relative(repo,path.join(priorRoot,'manifest.json')).replaceAll('\\','/'),sha256:sha(priorBytes)},standing:prior.pins.standing,identityHead:prior.pins.identityHead},registration:{policy:'accepted V2 body placements and native-head translations are unchanged',source:prior.registration},cleanupPolicy:'Remove only exposed donor jaw/neck components touching the copied authored layer top edge; retain every other accepted frame pixel.',authored,frames,eastFrames,cleanup,proofs};
const bytes=Buffer.from(JSON.stringify(manifest,null,2)+'\n');writeFileSync(path.join(outRoot,'manifest.json'),bytes);console.log(JSON.stringify({status:'PASS',manifestSha256:sha(bytes),removed:Object.fromEntries(phases.map(p=>[p,cleanup[p].removedPixelCount])),proofs},null,2));
