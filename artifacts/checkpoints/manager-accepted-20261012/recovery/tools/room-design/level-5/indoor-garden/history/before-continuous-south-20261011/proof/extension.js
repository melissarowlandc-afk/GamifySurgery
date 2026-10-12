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
    if (c.supportId) { cross(P.ox + c.world[0] * T, P.oy + c.world[1] * T, '#7c3aed', c.id + ' cushion'); g.beginPath(); g.moveTo(P.ox + approach[0] * T, P.oy + approach[1] * T); g.lineTo(P.ox + c.world[0] * T, P.oy + c.world[1] * T); g.stroke(); }
    g.restore();
  }
  if (state.routes) {
    g.save(); g.strokeStyle = '#7c3aed'; g.setLineDash([4, 3]);
    for (const b of Geometry.fineBlockers(P, navFor(P.room), data.previewBaseClearances)) { const f = b.footprint; g.strokeRect(P.ox + f.left * T, P.oy + f.top * T, f.width * T, f.height * T); }
    g.restore();
  }
}
function contactText(){return "Two unchanged approved adult seated stills: .001 faces east and .007 faces west into the garden.\nCushion contact is calibrated to each source's registered seat/floor anchors. Chairs draw first, sitters next, original-pixel front arms/legs last.\nPurple rings mark separate standing approaches; dashed purple links are static seating transitions, not walking through furniture.\nRoutes include the full doorway threshold and exits, with the other seated visitor and all visible furniture retained.\nBoth chairs, sitters, foregrounds, seated contacts and the stone aisle stay for every door/backing state.";}
const gardenToggles=[['tgActors','actors'],['tgLeft','leftVisitors'],['tgRight','rightVisitors'],['tgRoutes','routes'],['tgGrid','grid'],['tgContacts','contacts'],['tgBases','bases']];
function refreshCandidateControls(){buildRoomControls();for(const[id,key]of gardenToggles)$(id).checked=state[key];const tier=DESIGN_TIERS.find(t=>t.level===state.tier);for(let n=1;n<=5;n++)$('tier'+n).setAttribute('aria-pressed',n===state.tier);$('tierDescription').textContent=tier.summary;$('tierHeading').textContent='Upgrade '+state.tier+' · fixed garden appearance · owner review pending';$('artStatus').textContent='Room-first 4 × 4 Indoor Garden · two permanent visitor seats · owner approval pending';$('contactStatus').textContent=state.contacts?contactText():'';$('contactStatus').hidden=!state.contacts;}
for(let n=1;n<=5;n++)$('tier'+n).onclick=async()=>{setTier(n);refreshCandidateControls();await draw();};
for(const[id,key]of gardenToggles)$(id).onchange=async e=>{state[key]=e.target.checked;refreshCandidateControls();await draw();};
const northSections=()=>roomSegments(rooms.get(state.roomId)).filter(s=>s[0]==='N');
for(const[id,key,all]of [['allDoors','doors',true],['closeDoors','doors',false],['allBacked','backed',true],['clearBacked','backed',false]])$(id).onclick=async()=>{state[key]=new Set(all?(key==='doors'?roomSegments(rooms.get(state.roomId)):northSections()):[]);refreshCandidateControls();await draw();};
document.addEventListener('keydown',async e=>{const target=e.target,editing=target?.isContentEditable||/SELECT|TEXTAREA/.test(target?.tagName??'')||(target?.tagName==='INPUT'&&!['checkbox','radio','button'].includes(target.type));if(e.altKey||e.ctrlKey||e.metaKey||e.repeat||editing)return;const key=e.key.toLowerCase(),toggles={g:'grid',r:'routes',a:'actors',l:'leftVisitors',v:'rightVisitors',c:'contacts',f:'bases'};
if(/^[1-5]$/.test(key))setTier(Number(key));else if(key==='arrowright'||key==='arrowdown')setTier(state.tier%5+1);else if(key==='arrowleft'||key==='arrowup')setTier((state.tier+3)%5+1);else if(toggles[key])state[toggles[key]]=!state[toggles[key]];else if(key==='d')state.doors=state.doors.size===16?new Set():new Set(roomSegments(rooms.get(state.roomId)));else if(key==='b')state.backed=state.backed.size===4?new Set():new Set(northSections());else if(key==='escape'){setTier(1);Object.assign(state,{doors:new Set(),backed:new Set(),actors:true,leftVisitors:true,rightVisitors:true,grid:false,routes:false,contacts:false,bases:false});}else return;e.preventDefault();refreshCandidateControls();await draw();});
window.__lab.refreshControls=refreshCandidateControls;window.__lab.contactText=contactText;refreshCandidateControls();
