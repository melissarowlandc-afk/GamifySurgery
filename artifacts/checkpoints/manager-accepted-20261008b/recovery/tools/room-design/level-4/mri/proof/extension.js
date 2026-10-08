// Private candidate diagnostics and controls. No shared renderer/layout changes.
function marker(g, x, y, label, color) {
  g.save(); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(x - 5, y); g.lineTo(x + 5, y); g.moveTo(x, y - 5); g.lineTo(x, y + 5); g.stroke();
  g.font = '10px system-ui'; g.fillText(label, x + 6, y - 4); g.restore();
}
function paintCandidateDiagnostics(g, P, proposed) {
  const records = touchupRecords(P, proposed).filter(r => recordVisible(r, P));
  for (const rec of records) {
    const id = rec.assetId.split(':').at(-1), spec = PREPARED_METADATA.assets[id];
    const [lx, ly] = rec.destinationTopLeftTiles, [w, h] = rec.renderSizeTiles;
    let x = P.ox + lx * T, y = P.oy + ly * T;
    if (proposed && spec && rec.worldLocalGround) { x = P.ox + rec.worldLocalGround[0] * T - spec.canvasAnchor[0] * w * T / spec.canvas[0]; y = P.oy + rec.worldLocalGround[1] * T - spec.canvasAnchor[1] * h * T / spec.canvas[1]; }
    if (state.contacts && rec.worldLocalGround) marker(g, P.ox + rec.worldLocalGround[0] * T, P.oy + rec.worldLocalGround[1] * T, rec.id + ' floor', '#c2410c');
    if (state.contacts && proposed && spec) for (const [name, xy] of Object.entries(spec.calibratedPoints || {})) marker(g, x + xy[0] * w * T / spec.canvas[0], y + xy[1] * h * T / spec.canvas[1], `${id} ${name}`, '#7c3aed');
    if (state.bases && proposed && spec && rec.worldLocalGround) {
      const band = ASSET_CONTRACT.baseBandNativePixels, bottom = spec.opaqueBottom;
      g.save(); g.strokeStyle = '#c2410c'; g.fillStyle = 'rgba(194,65,12,.12)';
      const bx = x, by = y + (bottom - band + 1) * h * T / spec.canvas[1], bw = w * T, bh = band * h * T / spec.canvas[1];
      g.fillRect(bx, by, bw, bh); g.strokeRect(bx, by, bw, bh); g.restore();
    }
  }
  if (state.contacts && state.operator) {
    const support = P.room.supports.find(s => s.id === 'operator');
    const sy = state.seatMode === 'brief' ? support.ground.y - .375 : support.seat.y;
    marker(g, P.ox + support.seat.x * T, P.oy + sy * T, 'operator seat', '#1f6fb2');
    marker(g, P.ox + support.ground.x * T, P.oy + support.ground.y * T, 'operator floor', '#1f6fb2');
  }
  if (state.contacts && state.actors && state.patientSeated) {
    const patient = P.room.supports.find(s => s.id === 'patient-seated');
    marker(g, P.ox + patient.seat.x * T, P.oy + patient.seat.y * T, 'patient hip / cushion', '#1f6fb2');
    marker(g, P.ox + patient.ground.x * T, P.oy + patient.ground.y * T, 'patient source feet', '#1f6fb2');
  }
}
function contactText() {
  const c = CHAR['gs026-employee-004'], south = c.poses.stand.south, asset = c.poses.sit.north;
  const sc = Math.min(1, data.characterMetrics.visibleHeightCap / (south.anchors.floorY - south.visibleBounds.y));
  const actorRise = T * data.characterMetrics.widthInTiles * sc * (asset.anchors.floorY - asset.anchors.seatContactY) / 160;
  const supportRise = state.seatMode === 'brief' ? 45 : 39.6;
  const lines = [`Current actor seat-to-feet: ${actorRise.toFixed(3)} px. ${state.seatMode === 'brief' ? 'Brief' : 'Baseline'} support: ${supportRise} px; actor feet ${(supportRise - actorRise).toFixed(3)} px above floor anchor.`];
  for (const [id, name] of [['operator-chair', 'Chair seat'], ['table-empty', 'Couch top'], ['gantry-side', 'Bore centre']]) {
    const spec = PREPARED_METADATA.assets[id];
    if (spec) lines.push(`${name}: ${spec.measuredRiseProofPixels == null ? 'uncalibrated' : spec.measuredRiseProofPixels.toFixed(2) + ' px above actual foot/base contact'}; target ${spec.expectedRiseNativePixels / 2} px.`);
  }
  const desk = PREPARED_METADATA.assets.console;
  if (desk) for (const [key, label] of [['worktopRear', 'Console rear tabletop'], ['worktopFront', 'Console projected front lip']]) {
    const point = desk.calibratedPoints[key];
    if (point) lines.push(`${label}: ${((desk.canvasAnchor[1] - point[1]) * desk.proofScale).toFixed(2)} px above feet${key === 'worktopRear' ? '; enlarged target ' + desk.expectedRiseNativePixels / 2 + ' px' : ''}.`);
  }
  const p = CHAR['patient.adult.001'], ps = p.poses.stand.south, pw = p.poses.sit.west;
  const patientScale = Math.min(1, data.characterMetrics.visibleHeightCap / (ps.anchors.floorY - ps.visibleBounds.y));
  const patientWidth = T * data.characterMetrics.widthInTiles * patientScale;
  const support = rooms.get('mri').supports.find(s => s.id === 'patient-seated');
  lines.push(`Patient sit west: unchanged source width ${patientWidth.toFixed(3)} px; source hipY ${pw.anchors.seatContactY}; seat (${support.seat.x.toFixed(2)}, ${support.seat.y.toFixed(6)}) on the empty cushion.`);
  return lines.join('\n');
}
function refreshCandidateControls() {
  for (const [id,key] of [['tgActors','actors'],['tgOperator','operator'],['tgPatientSeated','patientSeated'],['tgRoutes','routes'],['tgGrid','grid'],['tgContacts','contacts'],['tgBases','bases']]) document.getElementById(id).checked = state[key];
  document.getElementById('seatMode').value = state.seatMode;
  const firstNote = document.getElementById('notes').firstElementChild;
  if (firstNote?.textContent.includes('stand-in art')) firstNote.textContent = 'Owner-revised private MRI candidate. Design approval and runtime integration remain separate.';
  document.getElementById('artStatus').textContent = PREPARED_METADATA.complete ? 'Tech faces north south of the larger desk. Patient sits west at the bed end and draws in front of the bed and MRI. Bed enters the center of the opening.' : `Incomplete artwork: ${Object.keys(PREPARED_METADATA.assets).length}/9. Sources missing: ${(PREPARED_METADATA.missing || []).join(', ')}.`;
  document.getElementById('artStatus').classList.toggle('bad', !PREPARED_METADATA.complete);
  document.getElementById('contactStatus').textContent = contactText();
}
for (const [id, key] of [['tgOperator', 'operator'], ['tgContacts', 'contacts'], ['tgBases', 'bases']]) document.getElementById(id).onchange = e => { state[key] = e.target.checked; refreshCandidateControls(); draw(); };
document.getElementById('seatMode').onchange = e => { state.seatMode = e.target.value; refreshCandidateControls(); draw(); };
for (const [id, key, all] of [['allDoors', 'doors', true], ['closeDoors', 'doors', false], ['allBacked', 'backed', true], ['clearBacked', 'backed', false]]) document.getElementById(id).onclick = () => { state[key] = new Set(all ? (key === 'doors' ? roomSegments(rooms.get('mri')) : ['N1', 'N2', 'N3', 'N4']) : []); buildRoomControls(); draw(); };
window.__lab.contactText = contactText;
window.__lab.refreshControls = () => { buildRoomControls(); refreshCandidateControls(); };
refreshCandidateControls();
