// Proof-only diagnostics, controls and review wording.
function paintCandidateDiagnostics(g, P, collected) {
  const cross = (x, y, color, label) => { g.save(); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 1.3; g.beginPath(); g.moveTo(x - 5, y); g.lineTo(x + 5, y); g.moveTo(x, y - 5); g.lineTo(x, y + 5); g.stroke(); g.font = '10px system-ui'; g.fillText(label, x + 6, y - 5); g.restore(); };
  for (const d of [...collected.wall, ...collected.sorted].filter(d => d.kind === 'fixture')) {
    const m = d.prepared;
    if (state.bases && m?.anchorKind === 'floor') { const b = m.outputOpaqueBounds; g.save(); g.strokeStyle = '#b45309'; g.setLineDash([3, 2]); g.strokeRect(d.x + b.left * d.w / m.canvas[0], d.y + (b.bottom - 8) * d.h / m.canvas[1], b.width * d.w / m.canvas[0], 9 * d.h / m.canvas[1]); g.restore(); }
    if (state.contacts && d.rec.worldLocalGround) cross(P.ox + d.rec.worldLocalGround[0] * T, P.oy + d.rec.worldLocalGround[1] * T, '#b45309', d.id);
  }
  if (state.contacts) for (const c of Geometry.routeTargets(P, navFor(P.room))) {
    cross(P.ox + c.world[0] * T, P.oy + c.world[1] * T, '#7c3aed', c.id);
    g.save(); g.strokeStyle = '#7c3aed'; g.setLineDash([2, 2]); g.beginPath(); g.arc(P.ox + c.world[0] * T, P.oy + c.world[1] * T, Geometry.ACTOR_RADIUS * T, 0, 2 * Math.PI); g.stroke(); g.restore();
  }
  if (state.routes) {
    g.save(); g.strokeStyle = '#7c3aed'; g.setLineDash([4, 3]);
    for (const b of Geometry.fineBlockers(P, navFor(P.room), data.previewBaseClearances)) { const f = b.footprint; g.strokeRect(P.ox + f.left * T, P.oy + f.top * T, f.width * T, f.height * T); }
    g.restore();
  }
}
function contactText() {
  return "Unchanged approved adult standing stills, with runtime body axis and floor contacts.\nBrowser .007 faces north; payer .001 faces north toward the kiosk screen.\nQueued shopper .004 faces east; second queued adult .006 proves both waiting spots.\nPurple rings show the 0.18-tile standing radius; brown crosses mark furniture bases.\nSix necessary retail contacts plus contacts for visible optional displays; four necessary standing spots.\nNecessary furniture isn't removed by doors. Optional threshold decor and wall items hide for their owned sections.\nRoutes avoid visible furniture and the shoppers currently shown. Waiting shoppers advance after the next spot clears; exits remain available.";
}
function refreshCandidateControls() {
  buildRoomControls();
  for (const [id, key] of [['tgActors', 'actors'], ['tgBrowser', 'browsers'], ['tgPayer', 'payers'], ['tgQueue1', 'queueOne'], ['tgQueue2', 'queueTwo'], ['tgRoutes', 'routes'], ['tgGrid', 'grid'], ['tgContacts', 'contacts'], ['tgBases', 'bases']]) $(id).checked = state[key];
  const tier = DESIGN_TIERS.find(t => t.level === state.tier);
  for (let n = 1; n <= 5; n++) $('tier' + n).setAttribute('aria-pressed', n === state.tier);
  $('tierDescription').textContent = tier.summary;
  $('tierHeading').textContent = 'Upgrade ' + state.tier + ' · fixed Gift Shop appearance · owner review pending';
  $('artStatus').textContent = PREPARED_METADATA.mode === 'stand-in' ? 'Prepaint geometry stand-ins · shared 3 × 3 layout' : 'One fixed Gift Shop look · self-service · owner approval pending';
  $('contactStatus').textContent = state.contacts ? contactText() : ''; $('contactStatus').hidden = !state.contacts;
}
for (let n = 1; n <= 5; n++) $('tier' + n).onclick = async () => { setTier(n); refreshCandidateControls(); await draw(); };
for (const [id, key] of [['tgActors', 'actors'], ['tgBrowser', 'browsers'], ['tgPayer', 'payers'], ['tgQueue1', 'queueOne'], ['tgQueue2', 'queueTwo'], ['tgRoutes', 'routes'], ['tgGrid', 'grid'], ['tgContacts', 'contacts'], ['tgBases', 'bases']]) $(id).onchange = async e => { state[key] = e.target.checked; refreshCandidateControls(); await draw(); };
const northSections = () => roomSegments(rooms.get(state.roomId)).filter(s => s[0] === 'N');
for (const [id, key, all] of [['allDoors', 'doors', true], ['closeDoors', 'doors', false], ['allBacked', 'backed', true], ['clearBacked', 'backed', false]]) $(id).onclick = async () => { state[key] = new Set(all ? (key === 'doors' ? roomSegments(rooms.get(state.roomId)) : northSections()) : []); refreshCandidateControls(); await draw(); };
document.addEventListener('keydown', async e => {
  const target = e.target, editing = target?.isContentEditable || /SELECT|TEXTAREA/.test(target?.tagName ?? '') || (target?.tagName === 'INPUT' && !['checkbox', 'radio', 'button'].includes(target.type));
  if (e.altKey || e.ctrlKey || e.metaKey || e.repeat || editing) return;
  const key = e.key.toLowerCase(), toggles = { g: 'grid', r: 'routes', a: 'actors', p: 'payers', v: 'browsers', q: 'queueOne', w: 'queueTwo', c: 'contacts', f: 'bases' };
  if (/^[1-5]$/.test(key)) setTier(Number(key));
  else if (key === 'arrowright' || key === 'arrowdown') setTier(state.tier % 5 + 1);
  else if (key === 'arrowleft' || key === 'arrowup') setTier((state.tier + 3) % 5 + 1);
  else if (toggles[key]) state[toggles[key]] = !state[toggles[key]];
  else if (key === 'd') state.doors = state.doors.size === 12 ? new Set() : new Set(roomSegments(rooms.get(state.roomId)));
  else if (key === 'b') state.backed = state.backed.size === 3 ? new Set() : new Set(northSections());
  else if (key === 'escape') { setTier(1); Object.assign(state, { doors: new Set(), backed: new Set(), actors: true, browsers: true, payers: true, queueOne: true, queueTwo: false, grid: false, routes: false, contacts: false, bases: false }); }
  else return;
  e.preventDefault(); refreshCandidateControls(); await draw();
});
window.__lab.refreshControls = refreshCandidateControls; window.__lab.contactText = contactText; refreshCandidateControls();
