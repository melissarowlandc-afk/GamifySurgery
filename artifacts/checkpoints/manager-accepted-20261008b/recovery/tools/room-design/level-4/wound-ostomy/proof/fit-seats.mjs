// Private, measured presentation only. No character pixels or layout change.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {decode} from '../assets/image-utils.mjs';
import {fixturePlacement} from './geometry.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..'),read=f=>JSON.parse(fs.readFileSync(path.join(here,f),'utf8'));
const layout=read('layout-baseline.json'),actors=read('actor-baseline.json'),metadata=read('../assets/processed/metadata.json'),stool=read('../assets/reused/stool-contract.json');
const revision=read('owner-revision.json');
const measurements=[];
for(const [id,dir,x,region]of [['patient.adult.007','east',50,[195,235]],['gs026-employee-001','west',90,[210,260]]]){
 const c=actors.characters.find(c=>c.id===id),p=c.poses.sit[dir],im=await decode(path.join(repo,'apps/player/public',p.url));let last=-1;
 for(let y=region[0];y<=region[1];y++)if(im.pixels.data[(y*p.width+x)*4+3]>=160)last=y;
 if(last<0||last===region[1])throw Error('Unbounded posterior measurement '+id);
 measurements.push({id,contact:[x,last+1],region,method:'Inspected posterior column and actual final alpha >=160 edge, inside bounded hip region.'});
}
const r=layout.room.records.find(r=>r.id==='recliner'),m=metadata.assets['wound-recliner'],d=fixturePlacement(r,m),point=m.calibratedPoints.seat;
if(!point)throw Error('Recliner actual cushion landmark missing');
const patientSeat=[(d.x+point[0]*d.w/m.canvas[0])/120,(d.y+point[1]*d.h/m.canvas[1])/120];
const s=layout.room.records.find(r=>r.id==='stool'),sp=stool.seatSource,sd=fixturePlacement(s),stoolSeat=[(sd.x+sp[0]*sd.w/stool.canvas[0])/120,(sd.y+sp[1]*sd.h/stool.canvas[1])/120];
const sourceScale=.6865478271728273;
const contract={schemaVersion:1,date:'2026-10-08',status:revision.status==='implemented'?'owner_design_approved':'owner_revision_in_progress',sourceScale,sourceScaleBasis:'Approved Pediatric Waiting/Exam source-pixel scale retained for both existing adult stills.',doorModel:{count:12,perWall:3,spanTiles:1,kind:'game-one-tile',basis:'Owner binding rule: a 3x3 room has twelve one-tile wall sections.'},actors:[
 {supportId:'recliner:patient',recordId:'recliner',characterId:'patient.adult.007',category:'patient',group:'patients',direction:'east',seat:patientSeat,ground:r.worldLocalGround,painterGround:r.depthKey+.0001,seatContactSource:measurements[0].contact,sourceScale,measurement:measurements[0],fixtureSeatSource:m.sourcePoints.seat,fixtureSeatNative:point,basis:'Actual revised chair cushion surface near authored X0.62; existing patient legs hang down, registered at the reviewed scale without stretching.'},
 {supportId:'stool:clinician',recordId:'stool',characterId:'gs026-employee-001',category:'employee',group:'clinicians',direction:'west',seat:stoolSeat,ground:s.worldLocalGround,painterGround:s.depthKey+.0001,seatContactSource:measurements[1].contact,sourceScale,measurement:measurements[1],fixtureSeatSource:sp,basis:'Actual native backless cushion center; entire clinician draws above stool with no foreground stool mask.'}
 ],careApproach:[1.80,2.30],approaches:{'recliner:patient':[.95,2.30],'stool:clinician':[2.65,1.75]},notes:[
 'Five painted pieces, four reused fixtures and two real existing seated character stills; no patient or staff artwork generated.',
 'All source placements, sizes, footprints, shell and navigation are frozen in layout-baseline.json. Measured seat contacts are private presentation registration.',
 'The backless stool consumes the concurrent native backless-v1 contract from approved unchanged atlas pixels; no new stool painting or shared edit.',
 'The frozen recliner WB threshold exception remains explicit. Door-owned corner fixtures and wall decor hide only on their source one-tile sections; shelf stays full height when backed.',
 'Walking uses frozen footprints plus actual opaque base pixels. Dotted seating links are separate static contacts, not walking through furniture.'
 ]};
fs.writeFileSync(path.join(here,'presentation-contract.json'),JSON.stringify(contract,null,2)+'\n');
console.log('SEAT FIT PASS patient east '+patientSeat.map(v=>v.toFixed(6)).join(',')+'; clinician west '+stoolSeat.map(v=>v.toFixed(6)).join(',')+'; both above fixtures');
