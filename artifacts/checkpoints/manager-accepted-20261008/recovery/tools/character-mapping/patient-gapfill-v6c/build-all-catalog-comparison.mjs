import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas,measure} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,hash,rel,verifyRuntimeBaseline} from './build-roster.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8'));verifyRuntimeBaseline();
const directory=resolve(root,'comparison');mkdirSync(directory,{recursive:true});
const inventoryFile=resolve(directory,'all-catalog-inventory.json'),inventory=json(inventoryFile);
assert.equal(inventory.identities.length,285);assert.equal(inventory.acceptedV6aIdentities,20);
const staging=json(resolve(root,'staging-registry.json'));assert.equal(staging.entries.length, 19);
const fresh=staging.entries.map(entry=>{
  const m=json(resolve(repo,entry.manifest));return {id:entry.stableId,number:entry.number,sex:m.identity.compatibleSexLabel,ageBand:m.identity.ageBand,path:m.poses.stand.south.file,sha256:m.poses.stand.south.sha256};
});
const prior=inventory.identities.map(c=>({id:c.stillId,sex:c.compatibleSexLabel,ageBand:c.ageBand,category:c.category,path:c.standSouth.path,sha256:c.standSouth.sha256}));
const images=new Map(),vectors=new Map();
function fitted(ctx,image,x,y,height){const b=measure(image).visibleBounds,s=height/b.height;ctx.imageSmoothingEnabled=false;ctx.drawImage(image,x-(b.x+b.width/2)*s,y-(b.y+b.height)*s,image.width*s,image.height*s);}
function labelParts(id){const at=Math.max(id.lastIndexOf('.'),id.lastIndexOf('-'));return at<0?[id,'']:[id.slice(0,at),id.slice(at+1)];}
for(const item of [...fresh,...prior]){
  assert.equal(hash(resolve(repo,item.path)),item.sha256);const image=await loadCanvas(resolve(repo,item.path));images.set(item.id,image);
  const t=createCanvas(64,128),ctx=t.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,64,128);fitted(ctx,image,32,120,112);vectors.set(item.id,ctx.getImageData(0,0,64,128).data);
}
function distance(first,second){const a=vectors.get(first),b=vectors.get(second);let s=0;for(let i=0;i<a.length;i+=4)for(let c=0;c<3;c++)s+=(a[i+c]-b[i+c])**2;return Math.sqrt(s/(a.length/4*3));}
const flags=[],entries=[],within=[];
for(const item of fresh){
  const comparisons=prior.map(p=>({id:p.id,path:p.path,sha256:p.sha256,rmse:distance(item.id,p.id)})).sort((a,b)=>a.rmse-b.rmse||a.id.localeCompare(b.id));
  for(const p of comparisons)if(p.rmse<8)flags.push({id:item.id,...p});
  const nearestSix=comparisons.slice(0,6),panel=[item,...nearestSix.map(p=>prior.find(c=>c.id===p.id))];
  const board=createCanvas(1008,342),ctx=board.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,1008,342);
  for(const [i,p] of panel.entries()){
    ctx.fillStyle=i?'#f4f1eb':'#fff';ctx.fillRect(i*144+3,3,138,336);fitted(ctx,images.get(p.id),i*144+72,270,232);
    ctx.fillStyle='#20252b';ctx.font='12px sans-serif';ctx.fillText(i?'Rank '+i+' / '+nearestSix[i-1].rmse.toFixed(1):'NEW '+item.number,i*144+7,22);
    ctx.font='9px sans-serif';labelParts(p.id).forEach((s,j)=>ctx.fillText(s,i*144+7,291+j*14,130));
    ctx.fillText((p.category??'patient')+' / '+(p.sex??'')+' '+(p.ageBand??''),i*144+7,328,130);
  }
  const file=resolve(directory,item.number+'-all-catalog-nearest-six.png');writeFileSync(file,board.toBuffer('image/png'));
  entries.push({...item,comparedExisting:285,comparisons,nearestSix,board:{path:rel(file),sha256:hash(file)}});
}
for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++){
  const p={first:fresh[i].id,second:fresh[j].id,rmse:distance(fresh[i].id,fresh[j].id)};within.push(p);if(p.rmse<8)flags.push(p);
}
const catalogBoards=[];
for(let start=0;start<prior.length;start+=50){
  const items=prior.slice(start,start+50),canvas=createCanvas(1100,Math.ceil(items.length/10)*260+40),ctx=canvas.getContext('2d');
  ctx.fillStyle='#eee9df';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#20252b';ctx.font='18px sans-serif';ctx.fillText('All-catalog reference inventory '+(start+1)+'-'+(start+items.length)+' / 285',10,26);
  for(const [i,p]of items.entries()){
    const x=i%10*110,y=Math.floor(i/10)*260+40;fitted(ctx,images.get(p.id),x+55,y+208,200);
    ctx.fillStyle='#20252b';ctx.font='9px sans-serif';const parts=labelParts(p.id);ctx.fillText(parts[0],x+3,y+224,104);ctx.fillText(parts[1]+' / '+p.category,x+3,y+238,104);
  }
  const file=resolve(directory,'all-catalog-reference-'+String(catalogBoards.length+1).padStart(2,'0')+'.png');writeFileSync(file,canvas.toBuffer('image/png'));
  catalogBoards.push({identities:items.map(p=>p.id),proof:{path:rel(file),sha256:hash(file)}});
}
const manifest={schemaVersion:'patient-gapfill-v6c-all-catalog-comparison/v1',scope:'Every new identity against all 245 pre-v6a catalog identities and all 20 v6a and all 20 v6b identities; every pair within v6c regardless of sex, age or role. Appearance is visual only.',threshold:8,algorithm:'RGB RMSE on 64x128 light-background thumbnails fitted to 112px common visible height. Flagging aid only; semantic identity and style still require visual review.',inventory:{path:rel(inventoryFile),sha256:hash(inventoryFile)},entries,withinBatch:within,catalogBoards,flags,totalCatalogComparisons:5415,totalWithinBatchComparisons:171,managerAcceptance:'pending'};
writeFileSync(resolve(directory,'all-catalog-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
const from=file=>relative(directory,resolve(repo,file)).replaceAll('\\','/');
writeFileSync(resolve(directory,'all-catalog.html'),'<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>v6c all-catalog duplicate checks</title><style>body{margin:16px;background:#eee9df;color:#20252b;font:15px system-ui}article{background:#fff;padding:12px;margin:16px 0}img{display:block;width:100%;height:auto}h2{font-size:16px}a{color:#0645ad}</style><a href="../review/index.html">Main gallery</a><h1>v6c all-catalog comparisons</h1><p>5415 comparisons against 245 original and 40 accepted v6a/v6b identities, plus 171 within-batch pairs. '+flags.length+' flags. Ranking is an aid for visual review.</p><p>'+catalogBoards.map((b,i)=>'<a href="'+from(b.proof.path)+'">Catalog inventory '+(i+1)+'</a>').join(' / ')+'</p>'+entries.map(e=>'<article><h2>'+e.id+'</h2><img src="'+from(e.board.path)+'" alt="'+e.number+' and six closest designs across the complete catalog"><p>Minimum RMSE '+e.nearestSix[0].rmse.toFixed(3)+'</p></article>').join(''));
const gallery=resolve(root,'review/index.html');let html=readFileSync(gallery,'utf8').replace(/<!-- BEGIN ALL CATALOG LINK -->[\s\S]*?<!-- END ALL CATALOG LINK -->/g,'');
html=html.replace('<main>','<!-- BEGIN ALL CATALOG LINK --><p><a href="../comparison/all-catalog.html">All-catalog duplicate comparisons (245 original +20 v6a +20 v6b)</a></p><!-- END ALL CATALOG LINK --><main>');writeFileSync(gallery,html);
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',originalCatalogIdentities:245,acceptedV6aIdentities:20,acceptedV6bIdentities:20,catalogComparisons:5415,withinBatchPairs:171,nearDuplicateFlags:flags.length,catalogReferenceBoards:catalogBoards.length,allCatalogNearestBoards:entries.length,minimumCatalogRmse:Math.min(...entries.map(e=>e.nearestSix[0].rmse))}));
