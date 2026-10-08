// Measured private seat registrations. Source characters/furniture remain unchanged.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {decode} from '../assets/image-utils.mjs';
const here=path.dirname(fileURLToPath(import.meta.url)),repo=path.resolve(here,'../../../../..');
const read=f=>JSON.parse(fs.readFileSync(path.join(here,f),'utf8'));
const original=read('layout-baseline.json'),actors=read('actor-baseline.json'),waiting=JSON.parse(fs.readFileSync(path.join(here,'../../pediatric-waiting/proof/revision-contract.json'),'utf8'));
const child=actors.characters.find(c=>c.id==='level3-roster-v2.021'),clinician=actors.characters.find(c=>c.id==='gs026-employee-001');
const measured=[];
for(const [c,dir,x,range]of [[child,'east',65,[220,265]],[clinician,'west',90,[210,260]]]){
 const pose=c.poses.sit[dir],im=await decode(path.join(repo,'apps/player/public',pose.url));let last=-1;
 for(let y=range[0];y<=range[1];y++)if(im.pixels.data[(y*pose.width+x)*4+3]>=160)last=y;
 if(last<0||last===range[1])throw Error('Posterior measurement region invalid '+c.id);
 measured.push({id:c.id,contact:[x,last+1],method:'Inspected posterior column, final alpha >=160 edge in bounded hip region.',region:range});
}
const table=original.room.records.find(r=>r.id==='pedsTable'),stool=original.room.records.find(r=>r.id==='stool'),chair=original.room.records.find(r=>r.id==='parentChair');
const stoolPoint=[133,135],chairPoint=[210,223];
const stoolSeat=[stool.worldLocalGround[0]+(stoolPoint[0]-133)*stool.renderSizeTiles[0]/266,stool.worldLocalGround[1]+(stoolPoint[1]-427)*stool.renderSizeTiles[0]/266];
const chairSeat=[chair.destinationTopLeftTiles[0]+chairPoint[0]*chair.renderSizeTiles[0]/315,chair.destinationTopLeftTiles[1]+chairPoint[1]*chair.renderSizeTiles[0]/315];
const contract={schemaVersion:1,date:'2026-10-08',status:'owner_approved_with_requested_stool_revision',sourceScale:waiting.sourceScale,sourceScaleBasis:'Approved waiting-room uniform pediatric source-pixel scale retained.',doorModel:{count:12,perWall:3,spanTiles:1,kind:'game-one-tile',basis:'Manager decision 2026-10-08: use the game model for the frozen 3x3 room, three one-tile sections per wall. Original shared room/navigation unchanged.'},
 actors:[
 {supportId:'table:patient',recordId:'pedsTable',characterId:child.id,category:child.category,group:'children',direction:'east',seat:[.66,1.25],ground:[.66,1.6],painterGround:2.06,seatContactSource:measured[0].contact,sourceScale:waiting.sourceScale,measurement:measured[0],basis:'Authored child seat and painter ground retained; measured real pediatric hip.'},
 {supportId:'stool:clinician',recordId:'stool',characterId:clinician.id,category:clinician.category,group:'clinicians',direction:'west',seat:stoolSeat,ground:stool.worldLocalGround,painterGround:1.7501,seatContactSource:measured[1].contact,sourceScale:waiting.sourceScale,measurement:measured[1],fixtureSeatSource:stoolPoint,basis:'Actual cushion center retained. Owner requested a derived backless stool and the clinician entirely above its single complete layer.'},
 {supportId:'parentChair',recordId:'parentChair',characterId:'patient.adult.007',category:'patient',group:'parents',direction:'west',seat:chairSeat,ground:chair.worldLocalGround,painterGround:2.8801,seatContactSource:[105,222],sourceScale:waiting.sourceScale,fixtureSeatSource:chairPoint,basis:'Approved waiting-room revision2 posterior/cushion contacts reused; parent behind copied front wood.'}
 ],approaches:{'table:patient':[1.10,1.15],'stool:clinician':[1.95,1.8],parentChair:[1.95,2.50]},
 notes:['The child is a real pediatric still and the parent always has a designated same-room place.','Sprite/seat contact registration is private presentation only; all source supports, footprints, placement and navigation remain preserved in layout-baseline.json.','Owner 2026-10-08 approved the room with the requested backless-stool revision: derived stool below the whole clinician, no stool foreground layer.','Original fixed table and parent chair retain the source layout\'s door threshold pass-through exceptions. New wall/corner art hides on its own one-tile sections.','Walking routes use real source footprints plus actual prepared base alpha; static seating transitions are separate from radius-clear walking.']};
fs.writeFileSync(path.join(here,'presentation-contract.json'),JSON.stringify(contract,null,2)+'\n');
console.log(JSON.stringify(contract.actors.map(a=>({id:a.characterId,seat:a.seat,source:a.seatContactSource,painterGround:a.painterGround})),null,2));
console.log('SEAT FIT 3 measured contacts; table east, clinician west, parent west');
