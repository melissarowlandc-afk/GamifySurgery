import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas,measure} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,tool,hash,rel,verifyRuntimeBaseline} from './build-roster.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8'));
verifyRuntimeBaseline();
const inventoryFile=resolve(root,'comparison/existing-inventory.json'),inventory=json(inventoryFile);
const staging=json(resolve(root,'staging-registry.json'));
assert.equal(staging.entries.length,20);assert.equal(inventory.identities.length,77);
const directory=resolve(root,'comparison');mkdirSync(directory,{recursive:true});
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const pathFrom=(file,base=directory)=>relative(base,resolve(repo,file)).replaceAll('\\','/');
const images=new Map(),vectors=new Map();
async function image(item){if(!images.has(item.id))images.set(item.id,await loadCanvas(resolve(repo,item.path)));return images.get(item.id);}
function fitted(ctx,canvas,x,y,height){const b=measure(canvas).visibleBounds,scale=height/b.height;ctx.imageSmoothingEnabled=false;ctx.drawImage(canvas,x-(b.x+b.width/2)*scale,y-(b.y+b.height)*scale,canvas.width*scale,canvas.height*scale);}
async function vector(item){
  if(vectors.has(item.id))return vectors.get(item.id);
  const canvas=createCanvas(64,128),ctx=canvas.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,64,128);fitted(ctx,await image(item),32,120,112);
  const v=ctx.getImageData(0,0,64,128).data;vectors.set(item.id,v);return v;
}
function rmse(a,b){let sum=0;for(let i=0;i<a.length;i+=4)for(let c=0;c<3;c++)sum+=(a[i+c]-b[i+c])**2;return Math.sqrt(sum/(a.length/4*3));}
const fresh=staging.entries.map(e=>{const m=json(resolve(repo,e.manifest));return {id:e.stableId,number:e.number,sex:m.identity.compatibleSexLabel,ageBand:m.identity.ageBand,age:m.identity.intendedAge,path:m.poses.stand.south.file,sha256:m.poses.stand.south.sha256,sourceSha256:e.sourceSha256,visualBrief:m.identity.visualBrief};});
const prior=inventory.identities.map(e=>({id:e.stillId,sex:e.compatibleSexLabel,ageBand:e.ageBand,age:e.intendedAge,path:e.standSouth.path,sha256:e.standSouth.sha256}));
for(const item of [...fresh,...prior]){assert.equal(hash(resolve(repo,item.path)),item.sha256);await vector(item);}
const rows=[],intra=[],flags=[];
for(const c of fresh){
  const same=prior.filter(p=>p.sex===c.sex&&p.ageBand===c.ageBand);
  const comparisons=same.map(p=>({id:p.id,path:p.path,sha256:p.sha256,rmse:rmse(vectors.get(c.id),vectors.get(p.id))})).sort((a,b)=>a.rmse-b.rmse||a.id.localeCompare(b.id));
  for(const comparison of comparisons)if(comparison.rmse<8)flags.push({id:c.id,...comparison});
  const nearest=comparisons.slice(0,6),panelItems=[c,...nearest.map(n=>prior.find(p=>p.id===n.id))];
  const board=createCanvas(1008,342),ctx=board.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,board.width,board.height);
  for(const [i,item] of panelItems.entries()){
    ctx.fillStyle=i===0?'#ffffff':'#f4f1eb';ctx.fillRect(i*144+3,3,138,336);fitted(ctx,await image(item),i*144+72,270,232);
    ctx.fillStyle='#20252b';ctx.font='12px sans-serif';ctx.fillText(i===0?'NEW '+c.number:'Rank '+i+' · '+nearest[i-1].rmse.toFixed(1),i*144+8,22);
    ctx.font='9px sans-serif';const at=item.id.lastIndexOf('.'),label=at>=0?[item.id.slice(0,at),item.id.slice(at+1)]:[item.id];
    label.forEach((part,j)=>ctx.fillText(part,i*144+7,290+j*14));ctx.fillText(item.sex+' · '+(item.age??item.ageBand),i*144+7,328);
  }
  const boardFile=resolve(directory,c.number+'-nearest-six.png');writeFileSync(boardFile,board.toBuffer('image/png'));
  const htmlFile=resolve(directory,c.number+'-all-same-band.html');
  const priorCards=same.map(p=>'<figure><img src="'+pathFrom(p.path)+'" alt="'+escape(p.id)+' standing south"><figcaption>'+escape(p.id)+'</figcaption></figure>').join('');
  writeFileSync(htmlFile,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+escape(c.id)+' all same-band comparisons</title><style>body{margin:16px;background:#eee9df;color:#20252b;font:15px system-ui}section{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap}.new{position:sticky;top:0;background:#fff;padding:8px}.old{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:4px;flex:1;min-width:min(100%,300px)}figure{margin:0;padding:4px;background:#fff;max-width:180px}img{display:block;width:100%;height:auto;image-rendering:pixelated}figcaption{font-size:10px;overflow-wrap:anywhere}.new figure{width:160px}a{color:#0645ad}</style></head><body><a href="../review/index.html">Main gallery</a><h1>'+escape(c.id)+'</h1><p>'+c.sex+' '+c.ageBand+' · '+same.length+' existing same-band identities. Appearance is visual only. For style comparison, old legacy sprites can have taller source bounds; the nearest-six board fits all figures to a shared visible height.</p><section><div class="new"><h2>New</h2><figure><img src="'+pathFrom(c.path)+'" alt="New '+c.number+' south"><figcaption>'+escape(c.id)+'</figcaption></figure></div><div class="old">'+priorCards+'</div></section></body></html>');
  rows.push({number:c.number,id:c.id,sex:c.sex,ageBand:c.ageBand,sourceSha256:c.sourceSha256,newPose:{path:c.path,sha256:c.sha256},comparedExisting:same.length,comparisons,nearestSix:nearest,board:{path:rel(boardFile),sha256:hash(boardFile)},allSameBandPage:{path:rel(htmlFile),sha256:hash(htmlFile)}});
}
for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++)if(fresh[i].sex===fresh[j].sex&&fresh[i].ageBand===fresh[j].ageBand){const r={first:fresh[i].id,second:fresh[j].id,rmse:rmse(vectors.get(fresh[i].id),vectors.get(fresh[j].id))};intra.push(r);if(r.rmse<8)flags.push(r);}
const manifest={schemaVersion:'patient-gapfill-v6a-comparison/v1',scope:'Every existing same-sex/age-band patient plus every same-band within-batch pair. No diagnosis or selection metadata.',algorithm:'RGB RMSE of 64x128 light-background thumbnails, each fitted to common 112px visible height and centered; threshold <8 flags near-identical silhouettes/palettes for manual review. Ranking is a review aid, not proof that identities differ.',threshold:8,existingInventory:{path:rel(inventoryFile),sha256:hash(inventoryFile)},entries:rows,withinBatch:intra,flags,totalExistingComparisons:rows.reduce((s,r)=>s+r.comparisons.length,0),totalWithinBatchComparisons:intra.length,managerAcceptance:'pending'};
writeFileSync(resolve(directory,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const indexCards=rows.map(r=>'<article><h2>'+r.number+' · '+r.sex+' '+r.ageBand+'</h2><img src="'+r.number+'-nearest-six.png" alt="'+r.number+' against six closest existing same-band patients"><p><a href="'+r.number+'-all-same-band.html">All '+r.comparedExisting+' same-band identities</a></p></article>').join('');
writeFileSync(resolve(directory,'index.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>v6a near-duplicate and style comparisons</title><style>body{margin:16px;background:#eee9df;color:#20252b;font:15px system-ui}img{display:block;width:100%;height:auto}article{background:white;margin:16px 0;padding:12px}h2{font-size:16px}a{color:#0645ad}</style><a href="../review/index.html">Main gallery</a><h1>v6a comparison review</h1><p>Each new design is at the left, beside its six closest existing same-band designs. All '+manifest.totalExistingComparisons+' existing comparisons and '+intra.length+' within-batch pairs are recorded. Ranking does not replace visual review. '+flags.length+' near-identical-thumbnail flags.</p>'+indexCards);
const galleryFile=resolve(root,'review/index.html');let html=readFileSync(galleryFile,'utf8').replace(/<!-- BEGIN V6A COMPARISON \d+ -->[\s\S]*?<!-- END V6A COMPARISON -->/g,'');
for(const r of rows){const needle='<p><a href="../packages/'+r.number+'/manifest.json">';const added='<!-- BEGIN V6A COMPARISON '+r.number+' --><div class="v6a-comparison"><h3>Against existing '+r.sex+' '+r.ageBand+'</h3><img src="../comparison/'+r.number+'-nearest-six.png" alt="New '+r.number+' at left beside six closest existing same-band identities"><p><a href="../comparison/'+r.number+'-all-same-band.html">Compare all '+r.comparedExisting+' existing same-band identities</a></p></div><!-- END V6A COMPARISON -->';assert(html.includes(needle));html=html.replace(needle,added+needle);}
html=html.replace(/<!-- BEGIN V6A REVIEW NOTE -->[\s\S]*?<!-- END V6A REVIEW NOTE -->/g,'');
html=html.replace('Native art is preserved unchanged.','Native art is preserved unchanged.<!-- BEGIN V6A REVIEW NOTE --> Worker source and 80 authored-contact checks complete; manager visual acceptance and browser layout validation pending. <a href="../comparison/index.html">Comparison review</a>.<!-- END V6A REVIEW NOTE -->');
writeFileSync(galleryFile,html);
verifyRuntimeBaseline();
console.log(JSON.stringify({status:'PASS',existingIdentities:prior.length,existingComparisons:manifest.totalExistingComparisons,withinBatchPairs:intra.length,flags:flags.length,comparisonBoards:rows.length,mainGalleryImages:60}));
