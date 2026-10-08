// Private diagnostics and controls, appended to the frozen-lab renderer clone.
function paintCandidateDiagnostics(g,P,collected){
 const cross=(x,y,color,label)=>{g.save();g.strokeStyle=color;g.fillStyle=color;g.lineWidth=1.3;g.beginPath();g.moveTo(x-5,y);g.lineTo(x+5,y);g.moveTo(x,y-5);g.lineTo(x,y+5);g.stroke();if(label){g.font='10px system-ui';g.fillText(label,x+6,y-5);}g.restore();};
 for(const d of [...collected.wall,...collected.sorted].filter(d=>d.kind==='fixture')){
  const m=d.prepared;if(state.bases&&m?.anchorKind==='floor'){const b=m.outputOpaqueBounds;g.save();g.strokeStyle='#b45309';g.setLineDash([3,2]);g.strokeRect(d.x+b.left*d.w/m.canvas[0],d.y+(b.bottom-7)*d.h/m.canvas[1],b.width*d.w/m.canvas[0],8*d.h/m.canvas[1]);g.restore();}
  if(state.contacts&&d.rec.worldLocalGround)cross(P.ox+d.rec.worldLocalGround[0]*T,P.oy+d.rec.worldLocalGround[1]*T,'#b45309',d.id);
 }
 if(state.contacts&&state.actors)for(const a of actorPlacements(P))cross(P.ox+a.seat.x*T,P.oy+a.seat.y*T,'#7c3aed',a.id);
 if(state.routes){g.save();g.strokeStyle='#7c3aed';g.setLineDash([4,3]);for(const b of Geometry.fineBlockers(P,navFor(P.room),data.previewBaseClearances)){const f=b.footprint;g.strokeRect(P.ox+f.left*T,P.oy+f.top*T,f.width*T,f.height*T);}g.restore();
  const routes=computeRoutes(P);for(const r of routes.filter(r=>r.seatingTransition)){const t=r.seatingTransition;g.save();g.strokeStyle='#0f766e';g.setLineDash([2,3]);g.beginPath();g.moveTo(P.ox+t.fromWorld[0]*T,P.oy+t.fromWorld[1]*T);g.lineTo(P.ox+t.toWorld[0]*T,P.oy+t.toWorld[1]*T);g.stroke();g.restore();}
 }
}
function contactText(){return 'Real pediatric still .021 sits east on the table; clinician sits west entirely above the derived backless rolling stool.\nThe parent has a designated chair in this room, behind the approved front armrest.\nSolid route lines show radius-clear walking; dotted teal lines show separate static seat contacts.\nTwelve one-tile wall sections use the game model for this 3x3 room. Source-layout fixed furniture pass-through exceptions are shown explicitly.';}
function refreshCandidateControls(){
 buildRoomControls();for(const[id,key]of [['tgActors','actors'],['tgParents','parents'],['tgChildren','children'],['tgClinician','clinicians'],['tgRoutes','routes'],['tgGrid','grid'],['tgContacts','contacts'],['tgBases','bases']])$(id).checked=state[key];
 $('artStatus').textContent='Owner-approved room - backless stool revision ready for manager validation';$('contactStatus').textContent=state.contacts?contactText():'';$('contactStatus').hidden=!state.contacts;
}
for(const[id,key]of [['tgParents','parents'],['tgChildren','children'],['tgClinician','clinicians'],['tgContacts','contacts'],['tgBases','bases']])$(id).onchange=async e=>{state[key]=e.target.checked;refreshCandidateControls();await draw();};
const northSections=()=>roomSegments(rooms.get(state.roomId)).filter(s=>s[0]==='N');
for(const[id,key,all]of [['allDoors','doors',true],['closeDoors','doors',false],['allBacked','backed',true],['clearBacked','backed',false]])$(id).onclick=async()=>{state[key]=new Set(all?(key==='doors'?roomSegments(rooms.get(state.roomId)):northSections()):[]);refreshCandidateControls();await draw();};
document.addEventListener('keydown',async e=>{
 const target=e.target,editing=target?.isContentEditable||/SELECT|TEXTAREA/.test(target?.tagName??'')||(target?.tagName==='INPUT'&&!['checkbox','radio','button'].includes(target.type));if(e.altKey||e.ctrlKey||e.metaKey||e.repeat||editing)return;
 const key=e.key.toLowerCase(),toggles={g:'grid',r:'routes',a:'actors',p:'parents',k:'children',v:'clinicians',c:'contacts',f:'bases'};
 if(toggles[key])state[toggles[key]]=!state[toggles[key]];else if(key==='d')state.doors=state.doors.size===roomSegments(rooms.get(state.roomId)).length?new Set():new Set(roomSegments(rooms.get(state.roomId)));else if(key==='b')state.backed=state.backed.size===northSections().length?new Set():new Set(northSections());else if(key==='escape')Object.assign(state,{doors:new Set(),backed:new Set(),actors:true,parents:true,children:true,clinicians:true,grid:false,routes:false,contacts:false,bases:false});else return;
 e.preventDefault();refreshCandidateControls();await draw();
});
window.__lab.refreshControls=refreshCandidateControls;window.__lab.contactText=contactText;refreshCandidateControls();
