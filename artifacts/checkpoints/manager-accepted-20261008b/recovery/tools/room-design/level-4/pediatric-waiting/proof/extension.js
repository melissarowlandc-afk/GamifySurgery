// Private candidate controls and contact inspection, appended by build.mjs.
function paintCandidateDiagnostics(g, P, collected) {
  function cross(x, y, color, label) {
    g.save(); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 1.3;
    g.beginPath(); g.moveTo(x - 5, y); g.lineTo(x + 5, y); g.moveTo(x, y - 5); g.lineTo(x, y + 5); g.stroke();
    if (label) { g.font = '10px system-ui'; g.fillText(label, x + 6, y - 5); } g.restore();
  }
  const fixtures = [...collected.wall, ...collected.sorted].filter(x => x.kind === 'fixture');
  for (const drawable of fixtures) {
    const prepared = drawable.prepared;
    if (state.bases && prepared?.anchorKind === 'floor') {
      const b = prepared.outputOpaqueBounds, scale = drawable.w / prepared.canvas[0];
      g.save(); g.strokeStyle = '#b45309'; g.setLineDash([3, 2]);
      g.strokeRect(drawable.x + b.left * scale, drawable.y + (b.bottom - 7) * scale, b.width * scale, 8 * scale); g.restore();
    }
    if (!state.contacts) continue;
    const record = drawable.rec;
    const ground = record.worldLocalGround;
    if (ground) cross(P.ox + ground[0] * T, P.oy + ground[1] * T, '#b45309', record.id);
    if (prepared) for (const [name, point] of Object.entries(prepared.calibratedPoints)) cross(drawable.x + point[0] * drawable.w / prepared.canvas[0], drawable.y + point[1] * drawable.h / prepared.canvas[1], '#0f766e', name);
  }
  if (state.contacts && state.actors) for (const actor of actorPlacements(P)) {
    cross(P.ox + actor.seat.x * T, P.oy + actor.seat.y * T, '#7c3aed', actor.id);
    cross(P.ox + actor.ground.x * T, P.oy + actor.ground.y * T, '#c2410c', 'ground');
  }
  if (state.routes) {
    g.save(); g.strokeStyle = '#7c3aed'; g.setLineDash([4, 3]);
    for (const blocker of Geometry.designBlockers(P, navFor(P.room))) {
      const f = blocker.footprint; g.strokeRect(P.ox + f.left * T, P.oy + f.top * T, f.width * T, f.height * T);
    }
    g.restore();
  }
}
function contactText() {
  const p = data.pediatricPresentation;
  return `Stools: ages 5 and 9 (184 / 211 source pixels). Ordinary chair: age 14 (234 source pixels).\nFive ordinary seats and four kid stools. Only under-10 children use stools.\nMeasured stool seat rise: ${p.stool.seatRiseProofPixels.toFixed(3)} px; contacts use actual opaque hip edges.\nThe two table children draw over its edge; all three blocks stay readable.\nWest-facing parent sits on the cushion, behind copied front armrest wood. Chest faces east; book bin faces west.\nApproved furniture and character source pixels remain unchanged.`;
}
function refreshCandidateControls() {
  buildRoomControls();
  for (const [id, key] of [['tgActors','actors'], ['tgParents','parents'], ['tgChildren','children'], ['tgRoutes','routes'], ['tgGrid','grid'], ['tgContacts','contacts'], ['tgBases','bases']]) $(id).checked = state[key];
  $('artStatus').textContent = 'Seven painted sprites · five ordinary seats · four kid stools · ages 5, 9 and 14';
  $('contactStatus').textContent = state.contacts ? contactText() : '';
  $('contactStatus').hidden = !state.contacts;
}
for (const [id, key] of [['tgParents','parents'], ['tgChildren','children'], ['tgContacts','contacts'], ['tgBases','bases']]) {
  $(id).onchange = async e => { state[key] = e.target.checked; refreshCandidateControls(); await draw(); };
}
// These buttons are proof-only additions; the shared lab never bound them.
for (const [id, key, all] of [['allDoors','doors',true], ['closeDoors','doors',false], ['allBacked','backed',true], ['clearBacked','backed',false]]) {
  $(id).onclick = async () => {
    const segments = key === 'doors' ? roomSegments(rooms.get(state.roomId)) : ['N1','N2','N3','N4'];
    state[key] = new Set(all ? segments : []);
    refreshCandidateControls(); await draw();
  };
}
document.addEventListener('keydown', async event => {
  const target = event.target;
  const editing = target?.isContentEditable || /SELECT|TEXTAREA/.test(target?.tagName ?? '') || (target?.tagName === 'INPUT' && !['checkbox','radio','button'].includes(target.type));
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat || editing) return;
  const toggles = { g: 'grid', r: 'routes', a: 'actors', p: 'parents', k: 'children', c: 'contacts', f: 'bases' };
  const key = event.key.toLowerCase();
  if (toggles[key]) state[toggles[key]] = !state[toggles[key]];
  else if (key === 'd') state.doors = state.doors.size === 16 ? new Set() : new Set(roomSegments(rooms.get(state.roomId)));
  else if (key === 'b') state.backed = state.backed.size === 4 ? new Set() : new Set(['N1','N2','N3','N4']);
  else if (key === 'escape') Object.assign(state, { doors: new Set(), backed: new Set(), actors: true, parents: true, children: true, grid: false, routes: false, contacts: false, bases: false });
  else return;
  event.preventDefault(); refreshCandidateControls(); await draw();
});
window.__lab.refreshControls = refreshCandidateControls;
window.__lab.contactText = contactText;
refreshCandidateControls();
