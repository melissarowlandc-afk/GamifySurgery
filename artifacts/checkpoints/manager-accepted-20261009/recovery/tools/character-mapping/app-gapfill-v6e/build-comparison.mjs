// Read-only art comparison; generated PNGs are never modified here.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve,relative} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas,measure} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,hash,rel,verifyRuntimeBaseline} from './build-roster.mjs';
import {roles} from './role-contract.mjs';
const base=verifyRuntimeBaseline(),json=f=>JSON.parse(readFileSync(f,'utf8'));
const directory=resolve(root,'comparison');mkdirSync(directory,{recursive:true});
const roleInventoryFile=resolve(directory,'existing-inventory.json'),allInventoryFile=resolve(directory,'all-catalog-inventory.json');
const roleInventory=json(roleInventoryFile),allInventory=json(allInventoryFile),staging=json(resolve(root,'staging-registry.json'));
assert.equal(roleInventory.identities.length,2);assert.equal(allInventory.identities.length,318);assert.equal(staging.entries.length,8);
const fresh=staging.entries.map(c=>{
  const m=json(resolve(repo,c.manifest)),p=m.poses.stand.south;
  return {id:c.stableId,number:c.number,category:'staff',role:m.identity.eligibleStaffRoleDefinitionIds[0],sex:m.identity.compatibleSexLabel,age:m.identity.intendedAge,ageBand:m.identity.ageBand,path:p.file,sha256:p.sha256,sourceSha256:c.sourceSha256,sitEast:m.poses.sit.east};
});
const old=allInventory.identities.map(c=>({id:c.stillId,category:c.category,roles:c.eligibleStaffRoleDefinitionIds??[],sex:c.compatibleSexLabel,age:c.intendedAge,ageBand:c.ageBand,path:c.standSouth.path,sha256:c.standSouth.sha256}));
const images=new Map(),vectors=new Map();
function fitted(ctx,image,x,y,height){const b=measure(image).visibleBounds,s=height/b.height;ctx.imageSmoothingEnabled=false;ctx.drawImage(image,x-(b.x+b.width/2)*s,y-(b.y+b.height)*s,image.width*s,image.height*s);}
function parts(id){const at=Math.max(id.lastIndexOf('.'),id.lastIndexOf('-'));return at<0?[id,'']:[id.slice(0,at),id.slice(at+1)];}
for(const c of [...old,...fresh]){
  assert.equal(hash(resolve(repo,c.path)),c.sha256);const image=await loadCanvas(resolve(repo,c.path));images.set(c.id,image);
  const canvas=createCanvas(64,128),ctx=canvas.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,64,128);fitted(ctx,image,32,120,112);vectors.set(c.id,ctx.getImageData(0,0,64,128).data);
}
function distance(aId,bId){const a=vectors.get(aId),b=vectors.get(bId);let squared=0;for(let i=0;i<a.length;i+=4)for(let c=0;c<3;c++)squared+=(a[i+c]-b[i+c])**2;return Math.sqrt(squared/(a.length/4*3));}
const receipt=file=>({path:rel(file),sha256:hash(file)}),from=file=>relative(directory,resolve(repo,file)).replaceAll('\\','/');
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const shell=(title,body)=>'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><style>body{margin:16px;background:#eee9df;color:#20252b;font:15px system-ui}article{background:#fff;padding:12px;margin:16px 0}img{display:block;width:100%;height:auto;image-rendering:pixelated}h1,h2{overflow-wrap:anywhere}h2{font-size:16px}a{color:#0645ad}figure{margin:4px;background:white;padding:4px}figcaption{font-size:11px;overflow-wrap:anywhere}.looks{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr));gap:4px}.looks img{width:160px;max-width:100%}</style></head><body><a href="../review/index.html">Main gallery</a><h1>'+esc(title)+'</h1>'+body+'</body></html>';
function scores(c,candidates){return candidates.map(p=>({id:p.id,path:p.path,sha256:p.sha256,rmse:distance(c.id,p.id)})).sort((a,b)=>a.rmse-b.rmse||a.id.localeCompare(b.id));}
async function nearestBoard(c,comparisons,suffix){
  const panel=[c,...comparisons.slice(0,6).map(p=>old.find(o=>o.id===p.id))],canvas=createCanvas(1008,342),ctx=canvas.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,1008,342);
  for(const [i,p]of panel.entries()){
    ctx.fillStyle=i?'#f4f1eb':'#fff';ctx.fillRect(i*144+3,3,138,336);fitted(ctx,images.get(p.id),i*144+72,270,232);
    ctx.fillStyle='#20252b';ctx.font='12px sans-serif';ctx.fillText(i?'Rank '+i+' / '+comparisons[i-1].rmse.toFixed(1):'NEW '+c.number,i*144+7,22);
    ctx.font='9px sans-serif';parts(p.id).forEach((s,j)=>ctx.fillText(s,i*144+7,291+j*14,130));ctx.fillText((p.role??p.roles?.[0]??p.category).replace('staff.',''),i*144+7,328,130);
  }
  const file=resolve(directory,c.number+'-'+suffix+'.png');writeFileSync(file,canvas.toBuffer('image/png'));return receipt(file);
}
const roleRows=[],allRows=[],roleFlags=[],allFlags=[];
for(const c of fresh){
  const same=old.filter(p=>p.roles.includes(c.role)),comparisons=scores(c,same),all=scores(c,old);
  for(const p of comparisons)if(p.rmse<8)roleFlags.push({id:c.id,...p});for(const p of all)if(p.rmse<8)allFlags.push({id:c.id,...p});
  const board=await nearestBoard(c,comparisons,'nearest-six'),allBoard=await nearestBoard(c,all,'all-catalog-nearest-six');
  const page=resolve(directory,c.number+'-all-same-role.html');
  writeFileSync(page,shell(c.id+' / '+c.role,'<p>All '+same.length+' existing eligible looks for this role. Same 160x320 canvas, no appearance-based selection semantics.</p><div class="looks">'+[c,...same].map(p=>'<figure><img src="'+from(p.path)+'" alt="'+esc(p.id)+' standing south"><figcaption>'+esc(p.id)+'</figcaption></figure>').join('')+'</div><p><a href="roles.html">Existing role pools beside both new identities</a></p>'));
  roleRows.push({number:c.number,id:c.id,role:c.role,sex:c.sex,ageBand:c.ageBand,sourceSha256:c.sourceSha256,newPose:{path:c.path,sha256:c.sha256},comparedExisting:same.length,comparisons,nearestSix:comparisons.slice(0,6),board,allSameRolePage:receipt(page)});
  const {sitEast,...data}=c;allRows.push({...data,comparedExisting:318,comparisons:all,nearestSix:all.slice(0,6),board:allBoard});
}
const roleWithin=[],allWithin=[];
for(let i=0;i<fresh.length;i++)for(let j=i+1;j<fresh.length;j++){
  const p={first:fresh[i].id,second:fresh[j].id,rmse:distance(fresh[i].id,fresh[j].id)};allWithin.push(p);if(p.rmse<8)allFlags.push(p);
  if(fresh[i].role===fresh[j].role){roleWithin.push(p);if(p.rmse<8)roleFlags.push(p);}
}
const roleBoards=[],combined=createCanvas(1600,384),combinedCtx=combined.getContext('2d');combinedCtx.fillStyle='#eee9df';combinedCtx.fillRect(0,0,800,combined.height);combinedCtx.imageSmoothingEnabled=false;
const byId=new Map(base.priorRegistry.map(c=>[c.id,c]));
for(const [ri,role]of roles.entries()){
  const prior=old.filter(p=>p.roles.includes(role)),added=fresh.filter(p=>p.role===role),looks=[...prior,...added];
  const board=createCanvas(looks.length*160,732),ctx=board.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,board.width,732);ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#20252b';ctx.font='18px sans-serif';ctx.fillText(role.replace('staff.','').replaceAll('_',' ')+' / existing left, new eight right',8,24);
  combinedCtx.fillStyle='#20252b';combinedCtx.font='17px sans-serif';combinedCtx.fillText(role+' / existing left, new eight right',8,ri*384+24);
  const inputs=[];
  for(const [i,p]of looks.entries()){
    ctx.fillStyle=i<prior.length?'#f4f1eb':'#fff';ctx.fillRect(i*160+2,32,156,696);ctx.drawImage(images.get(p.id),i*160,32);combinedCtx.drawImage(images.get(p.id),i*160,ri*384+32);
    const seated=p.sitEast??byId.get(p.id).poses.sit.east,file=p.sitEast?resolve(repo,seated.file):resolve(repo,'apps/player/public',seated.url.replace(/^\//,''));
    assert.equal(hash(file),seated.sha256);ctx.drawImage(await loadCanvas(file),i*160,384);
    ctx.fillStyle='#20252b';ctx.font='10px sans-serif';ctx.fillText((i<prior.length?'OLD ':'NEW ')+parts(p.id).join('.'),i*160+4,370,152);ctx.fillText('seated east',i*160+4,718);
    combinedCtx.fillStyle='#20252b';combinedCtx.font='9px sans-serif';combinedCtx.fillText((i<prior.length?'OLD ':'NEW ')+parts(p.id).join('.'),i*160+4,ri*384+370,152);
    inputs.push({id:p.id,standing:receipt(resolve(repo,p.path)),seated:receipt(file)});
  }
  const file=resolve(directory,role.replace('staff.','')+'-old-and-new.png');writeFileSync(file,board.toBuffer('image/png'));roleBoards.push({role,existing:prior.map(c=>c.id),new:added.map(c=>c.id),inputs,proof:receipt(file)});
}
const overview=resolve(directory,'per-role-old-and-new-overview.png');writeFileSync(overview,combined.toBuffer('image/png'));
const catalogBoards=[];
for(let start=0;start<old.length;start+=50){
  const rows=old.slice(start,start+50),canvas=createCanvas(1100,Math.ceil(rows.length/10)*260+40),ctx=canvas.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#20252b';ctx.font='18px sans-serif';ctx.fillText('All-catalog inventory '+(start+1)+'-'+(start+rows.length)+' / 318',10,26);
  for(const [i,p]of rows.entries()){const x=i%10*110,y=Math.floor(i/10)*260+40;fitted(ctx,images.get(p.id),x+55,y+208,200);ctx.fillStyle='#20252b';ctx.font='9px sans-serif';parts(p.id).forEach((s,j)=>ctx.fillText(s,x+3,y+224+j*8,104));}
  const file=resolve(directory,'all-catalog-reference-'+String(catalogBoards.length+1).padStart(2,'0')+'.png');writeFileSync(file,canvas.toBuffer('image/png'));catalogBoards.push({identities:rows.map(c=>c.id),proof:receipt(file)});
}
const algorithm='RGB RMSE of 64x128 light-background thumbnails fitted to common 112px visible height. Threshold <8 flags possible copies; ranking is a visual-review aid, not identity or style approval.';
const roleManifest={schemaVersion:'app-gapfill-v6e-comparison/v1',scope:'Every new staff identity against all existing eligible looks for its assigned role, and every new same-role pair.',threshold:8,algorithm,existingInventory:receipt(roleInventoryFile),entries:roleRows,withinBatch:roleWithin,flags:roleFlags,totalExistingComparisons:16,totalWithinBatchComparisons:28,roleBoards,roleOverview:receipt(overview),managerAcceptance:'pending'};
const allManifest={schemaVersion:'app-gapfill-v6e-all-catalog-comparison/v1',scope:'Every new staff identity against all 318 prior runtime identities. All 28 within-batch pairs regardless of role, age or sex.',threshold:8,algorithm,inventory:receipt(allInventoryFile),entries:allRows,withinBatch:allWithin,catalogBoards,flags:allFlags,totalCatalogComparisons:2544,totalWithinBatchComparisons:28,managerAcceptance:'pending'};
writeFileSync(resolve(directory,'manifest.json'),JSON.stringify(roleManifest,null,2)+'\n');writeFileSync(resolve(directory,'all-catalog-manifest.json'),JSON.stringify(allManifest,null,2)+'\n');
writeFileSync(resolve(directory,'index.html'),shell('v6e same-role comparisons','<p>16 existing APP comparisons and 28 within-batch pairs; '+roleFlags.length+' flags. <a href="roles.html">The two approved APPs beside the eight additions</a>.</p>'+roleRows.map(r=>'<article><h2>'+r.id+' / '+r.role+'</h2><img src="'+from(r.board.path)+'" alt="'+r.number+' against all existing same-role looks"><p><a href="'+from(r.allSameRolePage.path)+'">All '+r.comparedExisting+' existing same-role identities</a></p></article>').join('')));
writeFileSync(resolve(directory,'roles.html'),shell('v6e per-role old/new review','<p>The two approved APPs at left and eight new APP identities at right. Standing south above and seated east below; identical 160x320 canvases and anchors. <a href="per-role-old-and-new-overview.png">APP overview</a>.</p>'+roleBoards.map(r=>'<article><h2>'+r.role+'</h2><img src="'+from(r.proof.path)+'" alt="'+r.role+' existing looks beside new eight"></article>').join('')));
writeFileSync(resolve(directory,'all-catalog.html'),shell('v6e all-catalog duplicate review','<p>2544 comparisons against 318 prior runtime identities and 28 within-batch pairs. '+allFlags.length+' flags. Ranking requires visual review.</p><p>'+catalogBoards.map((b,i)=>'<a href="'+from(b.proof.path)+'">Catalog inventory '+(i+1)+'</a>').join(' / ')+'</p>'+allRows.map(r=>'<article><h2>'+r.id+'</h2><img src="'+from(r.board.path)+'" alt="'+r.number+' and six closest designs across the whole catalog"><p>Minimum RMSE '+r.nearestSix[0].rmse.toFixed(3)+'</p></article>').join('')));
const galleryFile=resolve(root,'review/index.html');let html=readFileSync(galleryFile,'utf8').replace(/<!-- BEGIN V6E COMPARISON \d+ -->[\s\S]*?<!-- END V6E COMPARISON -->/g,'').replace(/<!-- BEGIN V6E COMPARISON LINKS -->[\s\S]*?<!-- END V6E COMPARISON LINKS -->/g,'');
for(const row of roleRows){const needle='<p><a href="../packages/'+row.number+'/manifest.json">';assert(html.includes(needle));html=html.replace(needle,'<!-- BEGIN V6E COMPARISON '+row.number+' --><img src="../comparison/'+row.number+'-nearest-six.png" alt="'+row.number+' versus all existing same-role looks"><p><a href="../comparison/'+row.number+'-all-same-role.html">All '+row.comparedExisting+' existing '+row.role+' looks</a></p><!-- END V6E COMPARISON -->'+needle);}
html=html.replace('<main>','<!-- BEGIN V6E COMPARISON LINKS --><p><a href="../comparison/roles.html">Per-role old/new sheets</a> / <a href="../comparison/index.html">Same-role comparisons</a> / <a href="../comparison/all-catalog.html">Whole-catalog comparisons</a> / <a href="manager/index.html">Accepted style and all normalized poses</a></p><!-- END V6E COMPARISON LINKS --><main>');writeFileSync(galleryFile,html);
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',identities:8,existingRoleLooks:2,sameRoleComparisons:16,sameRoleNewPairs:28,perRoleSheets:1,allCatalogIdentities:318,allCatalogComparisons:2544,withinBatchPairs:28,nearDuplicateFlags:allFlags.length,minimumCatalogRmse:Math.min(...allRows.map(c=>c.nearestSix[0].rmse)),minimumWithinBatchRmse:Math.min(...allWithin.map(c=>c.rmse))}));
