// Exploratory Node-only route matrix. The authoritative validator is validate.cjs.
import fs from'node:fs';import path from'node:path';import{fileURLToPath}from'node:url';
import*as G from'./geometry.mjs';import{DESIGN_ROOMS,DESIGN_NAVIGATION}from'./design-rooms.js';
const here=path.dirname(fileURLToPath(import.meta.url)),data=JSON.parse(fs.readFileSync(path.join(here,'data.json'),'utf8')),room=DESIGN_ROOMS[0],nav=DESIGN_NAVIGATION[room.definitionId],segments=G.roomSegments(room),north=['N1','N2','N3'];
let states=0,routes=0,samples=0;const failures=[];
for(let mask=0;mask<8;mask++)for(const doors of[[],...segments.map(s=>[s]),segments]){
 const backed=north.filter((s,i)=>mask&(1<<i)),P={room,doors:new Set(doors),backed:new Set(backed)},r=G.computeRoutes(P,nav,data.previewBaseClearances),result=G.check(room,nav,doors,backed,data.previewBaseClearances);states++;routes+=r.length;
 samples+=G.sampleWalkingRoutes(r,()=>{});if(result.unreachable.length||result.conflicts.length||result.doorZone.length)failures.push({mask,doors,result});
}
fs.writeFileSync(path.join(here,'evidence/route-probe.json'),JSON.stringify({states,routes,samples,failures},null,2)+'\n');console.log(JSON.stringify({states,routes,samples,failures},null,2));if(failures.length)process.exitCode=1;
