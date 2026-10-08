// Read-only catalog inventory with stable accepted art paths across integration.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas,loadImage} from '@napi-rs/canvas';
import {repo,root,hash,rel,captureRuntimeBaseline} from './build-roster.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8')),base=captureRuntimeBaseline(),byId=new Map(base.priorRegistry.map(c=>[c.id,c]));
const original=base.priorCatalog.map(c=>{const p=byId.get(c.stillId).poses.stand.south,f=resolve(repo,'apps/player/public',p.url.replace(/^\//,''));return {...c,standSouth:{path:rel(f),sha256:hash(f),anchors:p.anchors,visibleBounds:p.visibleBounds}};});
const accepted=['patient-gapfill-v6a','patient-gapfill-v6b'].flatMap(batch=>json(resolve(repo,'tools/character-mapping',batch,'roster.json')).identities.map(c=>{const m=json(resolve(repo,'artifacts/character-statics',batch,'packages',c.number,'manifest.json')),p=m.poses.stand.south;return {...c,stillId:c.stableId,standSouth:{path:p.file,sha256:p.sha256,anchors:p.anchors,visibleBounds:p.visibleBounds},comparisonCohort:'accepted-'+batch.slice(-3)};}));
const allCatalog=[...original,...accepted],inventory=allCatalog.filter(c=>c.category==='patient'&&['adult','older_adult'].includes(c.ageBand));
assert.equal(allCatalog.length,285);assert.equal(new Set(allCatalog.map(c=>c.stillId)).size,285);assert.equal(inventory.length,75);
mkdirSync(resolve(root,'comparison'),{recursive:true});const boards=[];
for(const sex of ['Female','Male'])for(const ageBand of ['older_adult','adult']){
  const identities=inventory.filter(c=>c.compatibleSexLabel===sex&&c.ageBand===ageBand),canvas=createCanvas(1100,Math.ceil(identities.length/10)*260+42),ctx=canvas.getContext('2d');
  ctx.fillStyle='#eee9df';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.fillStyle='#20252b';ctx.font='20px sans-serif';ctx.fillText(sex+' '+ageBand+' — all '+identities.length+' existing patients',12,28);ctx.imageSmoothingEnabled=false;
  for(const [i,c]of identities.entries()){const image=await loadImage(resolve(repo,c.standSouth.path)),b=c.standSouth.visibleBounds,s=200/b.height,x=i%10*110,y=Math.floor(i/10)*260+42;ctx.drawImage(image,x+55-(b.x+b.width/2)*s,y+208-(b.y+b.height)*s,image.width*s,image.height*s);ctx.fillStyle='#20252b';ctx.font='9px sans-serif';const at=Math.max(c.stillId.lastIndexOf('.'),c.stillId.lastIndexOf('-'));ctx.fillText(c.stillId.slice(0,at),x+3,y+225,104);ctx.fillText(c.stillId.slice(at+1)+(c.intendedAge?' / age '+c.intendedAge:''),x+3,y+239,104);}
  const f=resolve(root,'comparison',sex.toLowerCase()+'-'+ageBand+'-existing.png');writeFileSync(f,canvas.toBuffer('image/png'));boards.push({sex,ageBand,identities:identities.map(c=>c.stillId),file:rel(f),sha256:hash(f)});
}
writeFileSync(resolve(root,'comparison/existing-inventory.json'),JSON.stringify({schemaVersion:'patient-gapfill-v6c-existing-inventory/v1',scope:'All adult/older-adult patients from the original 245 catalog and accepted v6a/v6b; appearance is visual only.',identities:inventory,boards},null,2)+'\n');
writeFileSync(resolve(root,'comparison/all-catalog-inventory.json'),JSON.stringify({schemaVersion:'patient-gapfill-v6c-all-catalog-inventory/v1',scope:'All 245 original identities plus 20 accepted v6a and 20 accepted v6b. Cross-band checks are visual only.',originalCatalogIdentities:245,acceptedV6aIdentities:20,acceptedV6bIdentities:20,identities:allCatalog},null,2)+'\n');
console.log(JSON.stringify({status:'PASS',originalCatalogIdentities:245,acceptedV6aIdentities:20,acceptedV6bIdentities:20,allCatalogIdentities:285,sameBandExistingPatients:inventory.length,bands:boards.map(b=>({sex:b.sex,ageBand:b.ageBand,identities:b.identities.length}))}));
