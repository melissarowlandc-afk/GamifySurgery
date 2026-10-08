// Pure private proof geometry. Private 4x4 proposed office layout; no shared navigation changes.
export const TILE=120,ACTOR_RADIUS=.18,STEP=.025;
export const segId=(side,o)=>side==='N'||side==='S'?side+(o+1):side+String.fromCharCode(65+o);
export const parseSeg=s=>({side:s[0],offset:s[0]==='N'||s[0]==='S'?Number(s.slice(1))-1:s.charCodeAt(1)-65});
export const roomSegments=room=>['N','S','W','E'].flatMap(s=>Array.from({length:room.footprint['NS'.includes(s)?0:1]},(_,i)=>segId(s,i)));
export function segmentSpan(room,segment){const{side,offset}=parseSeg(segment),count=room.footprint['NS'.includes(side)?0:1];if(!'NSWE'.includes(side)||offset<0||offset>=count||!Number.isInteger(offset))throw Error('Invalid room door section: '+segment);return{side,offset,length:1,start:offset,end:offset+1};}
export function doorInsideWorld(room,segment){const s=segmentSpan(room,segment),mid=(s.start+s.end)/2,[w,h]=room.footprint;return s.side==='N'?[mid,.5]:s.side==='S'?[mid,h-.5]:s.side==='W'?[.5,mid]:[w-.5,mid];}
export const doorInside=(room,s)=>doorInsideWorld(room,s).map(Math.floor);
export const visible=(r,doors,backed)=>!(r.doorOwners??[]).some(s=>doors.has(s))&&(!(r.backedOwners??[]).some(s=>backed.has(s))||!!r.touchupKeepWhenBacked);
const intersects=(a,b)=>a.left<b.left+b.width-1e-9&&a.left+a.width>b.left+1e-9&&a.top<b.top+b.height-1e-9&&a.top+a.height>b.top+1e-9;
export function doorwayZone(room,segment){const s=segmentSpan(room,segment),[w,h]=room.footprint,inset=.12,span=s.length-2*inset,depth=.55;return s.side==='N'?{left:s.start+inset,top:0,width:span,height:depth}:s.side==='S'?{left:s.start+inset,top:h-depth,width:span,height:depth}:s.side==='W'?{left:0,top:s.start+inset,width:depth,height:span}:{left:w-depth,top:s.start+inset,width:depth,height:span};}
export function ownersFor(room,r){if(r.footprint)return roomSegments(room).filter(s=>intersects(r.footprint,doorwayZone(room,s)));if(r.depthPolicy==='wall')return roomSegments(room).filter(s=>{const span=segmentSpan(room,s),left=r.destinationTopLeftTiles[0],right=left+r.renderSizeTiles[0];return span.side==='N'&&left<span.end-.08&&right>span.start+.08;});return[];}
export function passableThroughDoors(P,nav){const out=[];for(const s of P.doors){const{side}=parseSeg(s),tile=doorInside(P.room,s),offset='NS'.includes(side)?tile[0]:tile[1];
 const allowed=(nav.doorThresholdExceptions??[]).some(e=>e.side[0].toUpperCase()===side&&e.offset===offset);
 for(const f of nav.solidFixtures)if(allowed&&f.blockedTiles.some(t=>t.x===tile[0]&&t.y===tile[1]))out.push({door:s,fixture:f.id,alreadyAllowed:true,basis:'Frozen source layout doorThresholdExceptions on the original one-tile wall section.'});
 }return out;}
export function fineBlockers(P,nav,bases=[]){const pass=new Set(passableThroughDoors(P,nav).map(x=>x.fixture));
 const fixed=nav.solidFixtures.filter(f=>!pass.has(f.id)).map(f=>({id:f.id,footprint:f.footprint,basis:'Frozen source footprint'}));
 const records=P.room.records.filter(r=>r.footprint&&visible(r,P.doors,P.backed)).map(r=>({id:r.id,footprint:r.footprint,basis:'Frozen source new-prop footprint'}));
 const measured=bases.filter(b=>!pass.has(b.recordId)&&visible(P.room.records.find(r=>r.id===b.recordId),P.doors,P.backed));
 return [...fixed,...records,...measured];}
export const designBlockers=(P,nav)=>fineBlockers(P,nav);
export function clearPoint(P,blockers,x,y){const[w,h]=P.room.footprint;return x>=ACTOR_RADIUS-1e-9&&y>=ACTOR_RADIUS-1e-9&&x<=w-ACTOR_RADIUS+1e-9&&y<=h-ACTOR_RADIUS+1e-9&&!blockers.some(({footprint:f})=>x>f.left-ACTOR_RADIUS+1e-9&&x<f.left+f.width+ACTOR_RADIUS-1e-9&&y>f.top-ACTOR_RADIUS+1e-9&&y<f.top+f.height+ACTOR_RADIUS-1e-9);}
export function routeTargets(P,nav){const model=nav.privateProofRouteModel;const targets=[{id:'care',x:1,y:0,approach:model.careApproach,world:model.careApproach}];
 for(const s of P.room.supports){const fit=model.actors.find(a=>a.supportId===s.id),r=P.room.records.find(r=>r.id===fit.recordId);if(!visible(r,P.doors,P.backed))continue;const approach=model.approaches[s.id];targets.push({id:s.id,x:Math.floor(s.ground.x),y:Math.floor(s.ground.y),approach,world:fit.seat,supportId:s.id});}return targets;}
const near=(a,b)=>Math.abs(a-b)<1e-9;
export function computeRoutes(P,nav,bases=[]){const[w,h]=P.room.footprint,maxX=Math.round(w/STEP),maxY=Math.round(h/STEP),stride=maxX+1,blockers=fineBlockers(P,nav,bases),targets=routeTargets(P,nav),cache=new Map(),key=(x,y)=>x+stride*y;
 const clear=(x,y)=>clearPoint(P,blockers,x,y),gridClear=(x,y)=>{const k=key(x,y);if(!cache.has(k))cache.set(k,clear(x*STEP,y*STEP));return cache.get(k);};const result=[];
 for(const s of P.doors){const start=doorInsideWorld(P.room,s),grid=start.map(v=>Math.round(v/STEP)),prev=new Map([[key(...grid),null]]),queue=[grid];
 if(clear(...start))for(let i=0;i<queue.length;i++){const[x,y]=queue[i];for(const[dx,dy]of[[0,-1],[1,0],[0,1],[-1,0]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(nx<0||ny<0||nx>maxX||ny>maxY||prev.has(k)||!gridClear(nx,ny)||!clear((nx+x)*STEP/2,(ny+y)*STEP/2))continue;prev.set(k,[x,y]);queue.push([nx,ny]);}}
 const span=segmentSpan(P.room,s),mid=(span.start+span.end)/2,outside=span.side==='N'?[mid,-.1]:span.side==='S'?[mid,h+.1]:span.side==='W'?[-.1,mid]:[w+.1,mid];
 for(const target of targets){const goal=target.approach.map(v=>Math.round(v/STEP));if(!clear(...start)||!clear(...target.approach)||!prev.has(key(...goal))){result.push({door:s,target,path:null,routeModel:'private-footprint-seating'});continue;}
 const dense=[];let q=goal;while(q){dense.unshift(q.map(v=>v*STEP));q=prev.get(key(...q));}
 const walkingPath=dense.filter((p,i)=>i===0||i===dense.length-1||!((near(dense[i-1][0],p[0])&&near(p[0],dense[i+1][0]))||(near(dense[i-1][1],p[1])&&near(p[1],dense[i+1][1]))));
 walkingPath[0]=[...start];walkingPath[walkingPath.length-1]=[...target.approach];
 const transition=target.supportId?{supportId:target.supportId,fromWorld:target.approach,toWorld:target.world,kind:'static-seating-contact-not-walking'}:null;
 result.push({door:s,target,path:[outside,...walkingPath].map(p=>p.map(v=>v-.5)),walkingPath,standingApproach:target.approach,seatingTransition:transition,routeModel:'private-footprint-seating',passThrough:passableThroughDoors(P,nav).filter(x=>x.door===s)});
 }}return result;}
export function sampleWalkingRoutes(routes,visitor){let count=0;for(const r of routes)if(r.walkingPath)for(let i=1;i<r.walkingPath.length;i++){const a=r.walkingPath[i-1],b=r.walkingPath[i],steps=Math.max(1,Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/.0125));for(let k=0;k<=steps;k++){visitor(a[0]+(b[0]-a[0])*k/steps,a[1]+(b[1]-a[1])*k/steps,r);count++;}}return count;}
export function decorConflicts(P,nav,routes,bases=[]){const b=fineBlockers(P,nav,bases),bad=new Set();sampleWalkingRoutes(routes,(x,y,r)=>{if(!clearPoint(P,b,x,y))bad.add(r.door+'->'+r.target.id);});return[...bad];}
export function doorZoneViolations(P){const bad=[];for(const r of P.room.records.filter(r=>r.footprint||r.depthPolicy==='wall'))for(const s of ownersFor(P.room,r))if(!(r.doorOwners??[]).includes(s))bad.push(r.id+' in '+s);return bad;}
export function check(room,nav,doors,backed,bases=[]){const P={room,doors:new Set(doors),backed:new Set(backed)},r=computeRoutes(P,nav,bases);return{routes:r.length,unreachable:r.filter(x=>!x.path).map(x=>x.door+'->'+x.target.id),conflicts:decorConflicts(P,nav,r,bases),doorZone:doorZoneViolations(P),passThrough:passableThroughDoors(P,nav)};}
export function fixturePlacement(r,prepared,tile=TILE,ox=0,oy=0){const[w,h]=r.renderSizeTiles.map(v=>v*tile);let[x,y]=r.destinationTopLeftTiles.map(v=>v*tile);if(prepared){const world=r.worldLocalGround??[r.destinationTopLeftTiles[0]+r.renderSizeTiles[0]/2,r.destinationTopLeftTiles[1]];x=world[0]*tile-prepared.canvasAnchor[0]*w/prepared.canvas[0];y=world[1]*tile-prepared.canvasAnchor[1]*h/prepared.canvas[1];}return{x:ox+x,y:oy+y,w,h};}
export function actorPlacements(P,data,state={visitors:true,founders:true}){const out=[];for(const fit of data.founderPresentation.actors){if(state[fit.group]===false)continue;const s=P.room.supports.find(s=>s.id===fit.supportId),r=P.room.records.find(r=>r.id===fit.recordId);if(!visible(r,P.doors??new Set(),P.backed??new Set()))continue;const c=data.characters.find(c=>c.id===fit.characterId),pose=c.poses.sit[fit.direction],scale=fit.sourceScale,[cx,cy]=fit.seatContactSource;out.push({kind:'actor',id:s.id,characterId:c.id,category:c.category,group:fit.group,pose:'sit',direction:fit.direction,url:pose.url,x:(P.ox??0)+fit.seat[0]*TILE-cx*scale,y:(P.oy??0)+fit.seat[1]*TILE-cy*scale,w:pose.width*scale,h:pose.height*scale,py:fit.painterGround,seat:{x:fit.seat[0],y:fit.seat[1]},ground:s.ground,renderSeatContact:[cx,cy],sourceScale:scale,sourceSize:[pose.width,pose.height]});}return out;}
