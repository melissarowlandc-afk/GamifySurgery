// Probe frozen source footprints, real opaque base contacts and private approaches.
import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import * as G from './geometry.mjs';import {DESIGN_ROOMS,DESIGN_NAVIGATION} from './design-rooms.js';
const here=path.dirname(fileURLToPath(import.meta.url)),data=JSON.parse(fs.readFileSync(path.join(here,'data.json'),'utf8')),room=DESIGN_ROOMS[0],nav=DESIGN_NAVIGATION[room.definitionId],segments=G.roomSegments(room),north=['N1','N2','N3'];
let states=0,routes=0,samples=0,seatingTransitions=0;const failures=[];
for(let mask=0;mask<8;mask++)for(const doors of [[],...segments.map(s=>[s]),segments]){
 const backed=north.filter((_,i)=>mask&(1<<i)),P={room,doors:new Set(doors),backed:new Set(backed)},r=G.computeRoutes(P,nav,data.previewBaseClearances),blockers=G.fineBlockers(P,nav,data.previewBaseClearances),check=G.check(room,nav,doors,backed,data.previewBaseClearances);states++;routes+=r.length;seatingTransitions+=r.filter(r=>r.seatingTransition).length;
 samples+=G.sampleWalkingRoutes(r,(x,y,route)=>{if(!G.clearPoint(P,blockers,x,y))failures.push({mask,doors,badSample:[x,y],route:route.target.id});});
 if(check.unreachable.length||check.conflicts.length||check.doorZone.length)failures.push({mask,doors,check});
}
let monotonicDoorPairs=0;
for(let a=0;a<segments.length;a++)for(let b=a+1;b<segments.length;b++){
 const closed={room,doors:new Set(),backed:new Set()},pair={...closed,doors:new Set([segments[a],segments[b]])},before=G.fineBlockers(closed,nav,data.previewBaseClearances),after=G.fineBlockers(pair,nav,data.previewBaseClearances);
 if(after.some(x=>!before.some(y=>JSON.stringify(x)===JSON.stringify(y))))failures.push({pair:[segments[a],segments[b]],reason:'Combined doors added blocker'});monotonicDoorPairs++;
}
const report={status:failures.length?'FAIL':'PASS',doorModel:data.woundPresentation.doorModel,states,routes,samples,seatingTransitions,monotonicDoorPairs,actorRadius:G.ACTOR_RADIUS,step:G.STEP,limitations:'Closed, every single door and all-door states across 8 backing masks; monotonic pairs. Not exhaustive 4096 door subsets. Frozen WB recliner threshold pass-through exception is explicit; static seating is not a walking-circle route.',failures};
fs.writeFileSync(path.join(here,'evidence/route-probe.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(failures.length)process.exitCode=1;
