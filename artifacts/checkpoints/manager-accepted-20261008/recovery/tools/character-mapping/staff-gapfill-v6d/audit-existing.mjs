import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,hash,rel,directions} from './build-roster.mjs';
import {captureRuntimeBaseline,verifyRuntimeBaseline} from './runtime-baseline.mjs';
import {roles} from './role-contract.mjs';
const json=f=>JSON.parse(readFileSync(f,'utf8')),base=captureRuntimeBaseline();
const artById=new Map(base.priorRegistry.map(c=>[c.id,c]));
const original=base.priorCatalog.map(c=>{
  const p=artById.get(c.stillId).poses.stand.south,file=resolve(repo,'apps/player/public',p.url.replace(/^\//,''));
  return {...c,standSouth:{path:rel(file),sha256:hash(file),anchors:p.anchors,visibleBounds:p.visibleBounds}};
});
const accepted=json(resolve(toolRoot(),'../patient-gapfill-v6b/roster.json')).identities.map(c=>{
  const m=json(resolve(repo,'artifacts/character-statics/patient-gapfill-v6b/packages',c.number,'manifest.json')),p=m.poses.stand.south;
  return {...c,stillId:c.stableId,standSouth:{path:p.file,sha256:p.sha256,anchors:p.anchors,visibleBounds:p.visibleBounds},comparisonCohort:'accepted-v6b'};
});
function toolRoot(){return resolve(repo,'tools/character-mapping/staff-gapfill-v6d');}
const directory=resolve(root,'comparison'),refs=resolve(root,'references');mkdirSync(directory,{recursive:true});mkdirSync(refs,{recursive:true});
const identities=original.filter(c=>c.category==='staff'&&c.eligibleStaffRoleDefinitionIds.some(r=>roles.includes(r)));
assert.equal(identities.length,16);
const boards=[];
for(const role of roles){
  const looks=identities.filter(c=>c.eligibleStaffRoleDefinitionIds.includes(role));assert(looks.length>=2);
  const canvas=createCanvas(looks.length*160,352),ctx=canvas.getContext('2d');ctx.fillStyle='#eee9df';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.imageSmoothingEnabled=false;
  for(const [i,c]of looks.entries()){
    ctx.drawImage(await loadCanvas(resolve(repo,c.standSouth.path)),i*160,0);ctx.fillStyle='#20252b';ctx.font='10px sans-serif';ctx.fillText(c.stillId,i*160+4,334,152);
    const sheet=createCanvas(1280,1280),s=sheet.getContext('2d');s.imageSmoothingEnabled=false;
    const inputs=[];
    for(const [pi,p]of ['stand','sit'].entries())for(const [di,d]of directions.entries()){
      const pose=artById.get(c.stillId).poses[p][d],file=resolve(repo,'apps/player/public',pose.url.replace(/^\//,''));
      assert.equal(hash(file),pose.sha256);s.drawImage(await loadCanvas(file),di*320,pi*640,320,640);inputs.push({pose:p,direction:d,path:rel(file),sha256:hash(file)});
    }
    const file=resolve(refs,c.stillId+'-eight-poses.png');writeFileSync(file,sheet.toBuffer('image/png'));
    c.referenceSheet={path:rel(file),sha256:hash(file),policy:'Read-only exact existing-art composite at 2x; no new or altered character pixels.',inputs};
  }
  const file=resolve(directory,role.replace('staff.','')+'-existing.png');writeFileSync(file,canvas.toBuffer('image/png'));
  boards.push({role,identities:looks.map(c=>c.stillId),file:rel(file),sha256:hash(file)});
}
writeFileSync(resolve(directory,'existing-inventory.json'),JSON.stringify({schemaVersion:'staff-gapfill-v6d-existing-inventory/v1',scope:'All existing eligible looks for the seven assigned roles. Eligibility follows staffStillEligibleEntries catalog metadata.',identities,boards},null,2)+'\n');
writeFileSync(resolve(directory,'all-catalog-inventory.json'),JSON.stringify({schemaVersion:'staff-gapfill-v6d-all-catalog-inventory/v1',scope:'All 265 prior runtime identities plus 20 accepted v6b candidates, independently of concurrent v6b integration; appearance is visual only.',priorRuntimeIdentities:265,acceptedV6bIdentities:20,identities:[...original,...accepted]},null,2)+'\n');
verifyRuntimeBaseline();console.log(JSON.stringify({status:'PASS',existingRoleLooks:identities.length,roles:boards.map(c=>({role:c.role,existing:c.identities.length})),allCatalogIdentities:original.length+accepted.length,exactExistingRoleReferenceSheets:identities.length}));
