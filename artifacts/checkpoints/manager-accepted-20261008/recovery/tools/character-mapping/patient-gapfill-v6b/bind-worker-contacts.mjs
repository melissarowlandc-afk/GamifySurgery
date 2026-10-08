import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {createCanvas} from '@napi-rs/canvas';
import {loadCanvas} from '../gs026-employee-expansion-v1/pipeline.mjs';
import {repo,root,tool,hash,rel,hashText,directions,contactContractPayload,verifySource} from './build-roster.mjs';
const json=file=>JSON.parse(readFileSync(file,'utf8'));
const roster=json(resolve(tool,'roster.json')), selected=json(resolve(tool,'authored-contacts.json'));
assert.deepEqual(selected.directionOrder,directions);
const ledgerFile=resolve(tool,'review-acceptance.json'),ledger=json(ledgerFile);
assert.equal(ledger.reviewer,'sol-v6b-worker');
const evidenceRoot=resolve(root,'worker-review/contact-overlays');mkdirSync(evidenceRoot,{recursive:true});
ledger.workerContactEvidence={};ledger.workerVisualAcceptance={};
for(const identity of roster.identities){
  const source=verifySource(identity).stage2, coords=selected.coordinates[identity.number];
  assert.equal(coords.length,4);assert(coords.every(y=>Number.isInteger(y)&&y>150&&y<280));
  const contacts={sourceSha256:source.sha256,...Object.fromEntries(directions.map((d,i)=>[d,coords[i]])),approvedDirections:[],workerReviewedDirections:directions,status:'worker-visual-reviewed-authored-contact-pending-manager'};
  ledger.seatContacts[identity.number]=contacts;
  ledger.workerVisualAcceptance[identity.number]={sourceSha256:source.sha256,status:'worker-source-pose-style-QA-pass;manager-acceptance-pending'};
  const canvas=createCanvas(1280,680),ctx=canvas.getContext('2d');
  ctx.fillStyle='#20252b';ctx.fillRect(0,0,1280,680);ctx.imageSmoothingEnabled=false;
  ctx.fillStyle='#fff';ctx.font='17px sans-serif';ctx.fillText(identity.stableId+' — worker-authored contacts — source '+source.sha256.slice(0,16),12,24);
  for(const [i,d] of directions.entries()){
    const image=await loadCanvas(resolve(root,'packages',identity.number,'sit-'+d+'.png'));
    ctx.drawImage(image,i*320,40,320,640);
    for(let y=180;y<=270;y+=5){ctx.strokeStyle=y%10?'rgba(255,45,85,.12)':'rgba(255,45,85,.3)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(i*320,40+y*2);ctx.lineTo(i*320+320,40+y*2);ctx.stroke();ctx.fillStyle='#f5c47a';ctx.font='12px sans-serif';ctx.fillText(String(y),i*320+2,40+y*2+12);}
    ctx.strokeStyle='#22d3ee';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(i*320,40+coords[i]*2);ctx.lineTo(i*320+320,40+coords[i]*2);ctx.stroke();
    ctx.fillStyle='#fff';ctx.font='15px sans-serif';ctx.fillText(d+' y='+coords[i],i*320+12,660);
  }
  const file=resolve(evidenceRoot,identity.number+'.png');writeFileSync(file,canvas.toBuffer('image/png'));
  ledger.workerContactEvidence[identity.number]={file:rel(file),sha256:hash(file),sourceSha256:source.sha256,coordinates:Object.fromEntries(directions.map((d,i)=>[d,coords[i]])),method:selected.method};
}
ledger.seatContactWorkerReview={reviewer:'sol-v6b-worker',status:'complete80-worker-authored;manager-acceptance-pending',authoredCoordinates:{path:rel(resolve(tool,'authored-contacts.json')),sha256:hash(resolve(tool,'authored-contacts.json'))},contractSha256:hashText(JSON.stringify(contactContractPayload(roster,ledger)))};
writeFileSync(ledgerFile,JSON.stringify(ledger,null,2)+'\n');
console.log(JSON.stringify({status:'PASS',identities:20,workerReviewedContacts:80,contactContractSha256:ledger.seatContactWorkerReview.contractSha256,managerAccepted:false}));
