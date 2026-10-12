import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
let g=fs.readFileSync(path.resolve(root,'../gift-shop/proof/geometry.mjs'),'utf8').replace('// Executive/Founder proof geometry adapted for necessary standing retail contacts.','// Approved Gift Shop fine-grid/radius model, adapted for two necessary seated garden contacts.');
g=g.replace(/export function routeTargets[\s\S]*?\nconst cache = new Map\(\);/,`export function routeTargets(P, nav, fromDoor) {
  const targets = nav.privateProofRouteModel.contacts.map(c => ({ ...c, x:Math.floor(c.approach[0]), y:Math.floor(c.approach[1]) }));
  for(const door of P.doors)if(door!==fromDoor){const approach=doorInsideWorld(P.room,door);targets.push({id:'exit:'+door,label:'Exit '+door,world:approach,approach,x:Math.floor(approach[0]),y:Math.floor(approach[1]),exitDoor:door});}
  return targets;
}
export function doorOutsideWorld(room,segment){const s=segmentSpan(room,segment),mid=(s.start+s.end)/2,[w,h]=room.footprint;return s.side==='N'?[mid,-.2]:s.side==='S'?[mid,h+.2]:s.side==='W'?[-.2,mid]:[w+.2,mid];}
export function clearWalkPoint(P,blockers,x,y,occupied=[]){const[w,h]=P.room.footprint,r=ACTOR_RADIUS,open=(side,v)=>[...P.doors].some(id=>{const s=segmentSpan(P.room,id);return s.side===side&&v-r>=s.start+.12-1e-9&&v+r<=s.end-.12+1e-9;});
 if(x<-.2-1e-9||y<-.2-1e-9||x>w+.2+1e-9||y>h+.2+1e-9)return false;
 if(x<r-1e-9&&!open('W',y)||x>w-r+1e-9&&!open('E',y)||y<r-1e-9&&!open('N',x)||y>h-r+1e-9&&!open('S',x))return false;
 return !blockers.some(({footprint:f})=>x>f.left-r+1e-9&&x<f.left+f.width+r-1e-9&&y>f.top-r+1e-9&&y<f.top+f.height+r-1e-9)&&!occupied.some(a=>Math.hypot(x-a.ground[0],y-a.ground[1])<2*r-1e-9);
}
const cache = new Map();`);
const start=g.indexOf('export function computeRoutes('),end=g.indexOf('export function sampleWalkingRoutes(',start);
g=g.slice(0,start)+`export function computeRoutes(P,nav,bases=[],options={}) {
 const occupied=options.occupied??[],results=[];
 for(const door of P.doors){const start=doorInsideWorld(P.room,door),outside=doorOutsideWorld(P.room,door);
  for(const target of routeTargets(P,nav,door)){const others=occupied.filter(a=>a.supportId!==target.supportId),inside=routeBetween(P,nav,bases,start,target.approach,others),walkingPath=inside?[outside,...inside,...(target.exitDoor?[doorOutsideWorld(P.room,target.exitDoor)]:[])]:null;
   const seatingTransition=target.supportId?{supportId:target.supportId,fromWorld:target.approach,toWorld:target.world,kind:'static-seating-contact-not-walking'}:null;
   results.push({door,target,path:walkingPath?.map(p=>p.map(v=>v-.5))??null,walkingPath,standingApproach:target.approach,seatingTransition,passThrough:[],routeModel:'private-garden-full-portal-seated-contacts'});
  }
 }
 return results;
}
`+g.slice(end);
g=g.replace('if (!clearPoint(P, blockers, x, y)) bad.add','if (!clearWalkPoint(P, blockers, x, y)) bad.add');
g=g.slice(0,g.indexOf('export function actorPlacements('))+`export function actorPlacements(P,data,state={}) {
 const out=[];
 for(const fit of data.indoorGardenPresentation.actors){if(state[fit.group]===false)continue;const c=data.characters.find(c=>c.id===fit.characterId),pose=c.poses.sit[fit.direction],[cx,cy]=fit.seatContactSource,scale=fit.sourceScale;
  out.push({kind:'actor',id:fit.supportId,characterId:c.id,category:fit.category,group:fit.group,pose:'sit',direction:fit.direction,url:pose.url,x:(P.ox??0)+fit.seat[0]*TILE-cx*scale,y:(P.oy??0)+fit.seat[1]*TILE-cy*scale,w:pose.width*scale,h:pose.height*scale,py:fit.painterGround,seat:{x:fit.seat[0],y:fit.seat[1]},ground:{x:fit.ground[0],y:fit.ground[1]},renderSeatContact:[cx,cy],renderFloorContact:fit.floorContactSource,sourceScale:scale,sourceSize:[pose.width,pose.height]});
 }
 return out;
}
`;
fs.writeFileSync(path.join(root,'proof/geometry.mjs'),g);
const G=await import('./proof/geometry.mjs'),layout=JSON.parse(fs.readFileSync(path.join(root,'layout.json')));
for(const p of layout.pieces){const r=layout.room.records.find(r=>r.id===p.id);p.owners=p.classification==='necessary'?[]:G.ownersFor(layout.room,r);p.backed=p.top?[p.id.replace('trellis','N')]:[];r.doorOwners=p.owners;r.backedOwners=p.backed;const front=layout.room.records.find(r=>r.overlayFor===p.id);if(front){front.doorOwners=[];front.backedOwners=[];}}
fs.writeFileSync(path.join(root,'layout.json'),JSON.stringify(layout,null,2)+'\n');fs.writeFileSync(path.join(root,'stand-in/v1/layout-concept.json'),JSON.stringify(layout,null,2)+'\n');
const cases=[[],...G.roomSegments(layout.room).map(s=>[s]),G.roomSegments(layout.room)];let routes=0;
for(const doors of cases){const report=G.check(layout.room,layout.navigation,doors,[]);if(report.unreachable.length||report.conflicts.length||report.doorZone.length)throw Error(JSON.stringify({doors,report}));routes+=report.routes;}
fs.writeFileSync(path.join(root,'stand-in/v1/route-receipt.json'),JSON.stringify({status:'PASS',basis:'Concept-derived declared solid furniture before measured painted-base reconciliation.',states:cases.length,routes,actorRadiusTiles:.18,doors:G.roomSegments(layout.room)},null,2)+'\n');
console.log('CONCEPT GEOMETRY PASS: '+cases.length+' states; '+routes+' full entry/exit/seat-approach routes; two permanent seated contacts; 16 doors.');
