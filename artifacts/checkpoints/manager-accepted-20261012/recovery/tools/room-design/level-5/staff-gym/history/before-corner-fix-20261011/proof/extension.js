// Proof-only diagnostics, controls and review wording.
function paintCandidateDiagnostics(g, P, collected) {
  const cross = (x, y, color, label) => { g.save(); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 1.3; g.beginPath(); g.moveTo(x - 5, y); g.lineTo(x + 5, y); g.moveTo(x, y - 5); g.lineTo(x, y + 5); g.stroke(); g.font = '10px system-ui'; g.fillText(label, x + 6, y - 5); g.restore(); };
  for (const d of [...collected.wall, ...collected.sorted].filter(d => d.kind === 'fixture')) {
    const m = d.prepared;
    if (state.bases && m?.anchorKind === 'floor') { const b = m.outputOpaqueBounds; g.save(); g.strokeStyle = '#b45309'; g.setLineDash([3, 2]); g.strokeRect(d.x + b.left * d.w / m.canvas[0], d.y + (b.bottom - 8) * d.h / m.canvas[1], b.width * d.w / m.canvas[0], 9 * d.h / m.canvas[1]); g.restore(); }
    if (state.contacts && d.rec.worldLocalGround && !d.rec.overlayFor) cross(P.ox + d.rec.worldLocalGround[0] * T, P.oy + d.rec.worldLocalGround[1] * T, '#b45309', d.id);
  }
  if (state.contacts) for (const c of Geometry.routeTargets(P, navFor(P.room))) {
    const approach = c.approach ?? c.world;
    cross(P.ox + approach[0] * T, P.oy + approach[1] * T, '#7c3aed', c.id + (c.supportId ? ' approach' : ''));
    g.save(); g.strokeStyle = '#7c3aed'; g.setLineDash([2, 2]); g.beginPath(); g.arc(P.ox + approach[0] * T, P.oy + approach[1] * T, Geometry.ACTOR_RADIUS * T, 0, 2 * Math.PI); g.stroke();
    if (c.pose==='sit') { cross(P.ox + c.world[0] * T, P.oy + c.world[1] * T, '#7c3aed', c.id + (c.pose==='sit'?' cushion':' floor')); g.beginPath(); g.moveTo(P.ox + approach[0] * T, P.oy + approach[1] * T); g.lineTo(P.ox + c.world[0] * T, P.oy + c.world[1] * T); g.stroke(); }
    g.restore();
  }
  if (state.routes) {
    g.save(); g.strokeStyle = '#7c3aed'; g.setLineDash([4, 3]);
    for (const b of Geometry.fineBlockers(P, navFor(P.room), data.previewBaseClearances)) { const f = b.footprint; g.strokeRect(P.ox + f.left * T, P.oy + f.top * T, f.width * T, f.height * T); }
    g.restore();
  }
}
function contactText(){return "Two unchanged approved staff stills in scrubs: gs026-employee-001 sits south on the bench; gs026-employee-004 stands south on the mat.\nThe bench cushion uses the source seated/floor anchors; the standing contact uses the source floor anchor.\nBench draws first, real sitter next, exact-source camera-side rail and legs last. Ball is behind the mat occupant; foam roller is in front by floor depth.\nPurple rings show clear approaches; the dashed bench link is a static seating transition. The mat contact is reached by a walking route.\nAll 16 one-tile doors retain the bench, mat, ball, roller, both staff contacts and the rubber aisle."; }
const gymToggles=[['tgActors','actors'],['tgLeft','benchStaff'],['tgRight','matStaff'],['tgRoutes','routes'],['tgGrid','grid'],['tgContacts','contacts'],['tgBases','bases']];
function refreshCandidateControls(){buildRoomControls();for(const[id,key]of gymToggles)$(id).checked=state[key];const tier=DESIGN_TIERS.find(t=>t.level===state.tier);for(let n=1;n<=5;n++)$('tier'+n).setAttribute('aria-pressed',n===state.tier);$('tierDescription').textContent=tier.summary;$('tierHeading').textContent='Upgrade '+state.tier+' · fixed gym appearance · owner review pending';$('artStatus').textContent='Room-first 4 × 4 Staff Gym · two permanent staff contacts · owner approval pending';$('contactStatus').textContent=state.contacts?contactText():'';$('contactStatus').hidden=!state.contacts;}
for(let n=1;n<=5;n++)$('tier'+n).onclick=async()=>{setTier(n);refreshCandidateControls();await draw();};
for(const[id,key]of gymToggles)$(id).onchange=async e=>{state[key]=e.target.checked;refreshCandidateControls();await draw();};
const northSections=()=>roomSegments(rooms.get(state.roomId)).filter(s=>s[0]==='N');
for(const[id,key,all]of [['allDoors','doors',true],['closeDoors','doors',false],['allBacked','backed',true],['clearBacked','backed',false]])$(id).onclick=async()=>{state[key]=new Set(all?(key==='doors'?roomSegments(rooms.get(state.roomId)):northSections()):[]);refreshCandidateControls();await draw();};
document.addEventListener('keydown',async e=>{const target=e.target,editing=target?.isContentEditable||/SELECT|TEXTAREA/.test(target?.tagName??'')||(target?.tagName==='INPUT'&&!['checkbox','radio','button'].includes(target.type));if(e.altKey||e.ctrlKey||e.metaKey||e.repeat||editing)return;const key=e.key.toLowerCase(),toggles={g:'grid',r:'routes',a:'actors',l:'benchStaff',v:'matStaff',c:'contacts',f:'bases'};
if(/^[1-5]$/.test(key))setTier(Number(key));else if(key==='arrowright'||key==='arrowdown')setTier(state.tier%5+1);else if(key==='arrowleft'||key==='arrowup')setTier((state.tier+3)%5+1);else if(toggles[key])state[toggles[key]]=!state[toggles[key]];else if(key==='d')state.doors=state.doors.size===16?new Set():new Set(roomSegments(rooms.get(state.roomId)));else if(key==='b')state.backed=state.backed.size===4?new Set():new Set(northSections());else if(key==='escape'){setTier(1);Object.assign(state,{doors:new Set(),backed:new Set(),actors:true,benchStaff:true,matStaff:true,grid:false,routes:false,contacts:false,bases:false});}else return;e.preventDefault();refreshCandidateControls();await draw();});
window.__lab.refreshControls=refreshCandidateControls;window.__lab.contactText=contactText;refreshCandidateControls();
