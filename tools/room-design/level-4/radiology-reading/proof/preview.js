(() => {
  const root = document.getElementById('radiology-reading-proof');
  if (!root) return;
  const payload = __ASSET_DATA__, layout = __LAYOUT__, assetContract = __ASSET_CONTRACT__;
  const canvas = root.querySelector('#reading-art'), g = canvas.getContext('2d');
  const scaleCanvas = root.querySelector('#reading-scale-art'), sg = scaleCanvas.getContext('2d');
  const occupancyControl = root.querySelector('#reading-occupancy'), routesControl = root.querySelector('#reading-routes'), scaleControl = root.querySelector('#reading-scale');
  const segmentIds = layout.doorModel.segments, seatIds = layout.seats.map(x => x.id), northIds = layout.doorModel.northBackings;
  const room = { x: 120, y: 120, tile: 120, width: 480, height: 480 };
  const shell = { northTallTop: 52, northLowTop: 91, northLowHeight: 29, sideCapWidth: 22 };
  const defaultState = { selected: 'N1', doors: [], adjacent: [], occupancy: 'empty', routes: false, scale: false };
  const images = {}, state = { ...defaultState, doors: new Set(), adjacent: new Set() }; let assetsReady = false;
  const solids = layout.solidFurniture.map(x => ({ id: x.id, ...x.footprint }));

  function normalize(saved) {
    const source = saved?.privateContent || saved || {};
    const doors = Array.isArray(source.doors) ? source.doors.filter(x => segmentIds.includes(x)) : [];
    const adjacent = Array.isArray(source.adjacent) ? source.adjacent.filter(x => northIds.includes(x)) : [];
    const occupancy = ['all', 'empty', ...seatIds].includes(source.occupancy) ? source.occupancy : defaultState.occupancy;
    return { selected: segmentIds.includes(source.selected) ? source.selected : defaultState.selected, doors, adjacent, occupancy, routes: !!source.routes, scale: !!source.scale };
  }
  function apply(saved) { const next = normalize(saved); state.selected = next.selected; state.doors = new Set(next.doors); state.adjacent = new Set(next.adjacent); state.occupancy = next.occupancy; state.routes = next.routes; state.scale = next.scale; sync(); if (assetsReady) render(); }
  function snapshot() { return { selected: state.selected, doors: [...state.doors], adjacent: [...state.adjacent], occupancy: state.occupancy, routes: state.routes, scale: state.scale }; }
  function save() { window.openai?.setWidgetState?.({ modelContent: { room: 'Radiology Reading Room', proposedSize: '4x4', occupancy: state.occupancy }, privateContent: snapshot() }).catch(() => {}); }

  function drawButtonGrid() {
    const groups = { N: root.querySelector('#reading-door-north'), S: root.querySelector('#reading-door-south'), W: root.querySelector('#reading-door-west'), E: root.querySelector('#reading-door-east') };
    for (const id of segmentIds) { const button = document.createElement('button'); button.type = 'button'; button.className = 'btn cursor-interaction'; button.dataset.segment = id; button.textContent = id; button.setAttribute('aria-label', `Toggle ${id} door`); button.addEventListener('click', () => toggleDoor(id)); groups[id[0]].appendChild(button); }
  }
  function sync() {
    occupancyControl.value = state.occupancy; routesControl.checked = state.routes; scaleControl.checked = state.scale;
    root.querySelectorAll('[data-segment]').forEach(button => button.setAttribute('aria-pressed', String(state.doors.has(button.dataset.segment))));
    root.querySelectorAll('[data-backing]').forEach(input => { input.checked = state.adjacent.has(input.dataset.backing); });
    root.querySelector('#reading-scale-wrap').hidden = !state.scale;
  }
  function toggleDoor(id) { state.selected = id; state.doors.has(id) ? state.doors.delete(id) : state.doors.add(id); sync(); render(); save(); }

  function endpoint(id) {
    if (id[0] === 'N' || id[0] === 'S') { const i = Number(id.slice(1)) - 1; return { x: i + .5, y: id[0] === 'N' ? .2 : 3.8 }; }
    const rows = { A: .5, B: 1.5, C: 2.5, D: 3.5 }; return { x: id[0] === 'W' ? .2 : 3.8, y: rows[id[1]] };
  }
  function valid(point, omitChair) {
    const r = layout.navigation.actorRadius, b = layout.navigation.boundary;
    if (point.x < b || point.y < b || point.x > 4 - b || point.y > 4 - b) return false;
    return !solids.some(s => s.id !== omitChair && point.x >= s.left - r && point.x <= s.left + s.width + r && point.y >= s.top - r && point.y <= s.top + s.height + r);
  }
  function route(target, omitChair) {
    const step = layout.navigation.latticeStep, start = layout.navigation.circulationHub, key = p => `${Math.round(p.x / step)},${Math.round(p.y / step)}`, queue = [start], previous = new Map([[key(start), null]]), values = new Map([[key(start), start]]), finish = key(target);
    while (queue.length) { const p = queue.shift(); if (key(p) === finish) break; for (const [dx, dy] of [[step, 0], [-step, 0], [0, step], [0, -step]]) { const q = { x: Math.round((p.x + dx) * 100) / 100, y: Math.round((p.y + dy) * 100) / 100 }, k = key(q); if (!previous.has(k) && valid(q, omitChair)) { previous.set(k, key(p)); values.set(k, q); queue.push(q); } } }
    if (!previous.has(finish)) return [];
    const out = []; for (let k = finish; k; k = previous.get(k)) out.push(values.get(k)); return out.reverse();
  }
  const routes = { doors: Object.fromEntries(segmentIds.map(id => [id, route(endpoint(id))])), seats: Object.fromEntries(layout.seats.map(s => [s.id, route(s.transition, s.fixture)])) };
  const pxy = p => ({ x: room.x + p.x * room.tile, y: room.y + p.y * room.tile });
  function drawPath(points, color) { if (!points.length) return; g.save(); g.strokeStyle = color; g.lineWidth = 3; g.setLineDash([7, 6]); g.beginPath(); points.forEach((p, i) => { const q = pxy(p); i ? g.lineTo(q.x, q.y) : g.moveTo(q.x, q.y); }); g.stroke(); g.restore(); }

  function drawShell() {
    g.clearRect(0, 0, canvas.width, canvas.height); g.fillStyle = '#101917'; g.fillRect(0, 0, canvas.width, canvas.height);
    g.fillStyle = '#283b33'; g.fillRect(room.x, room.y, room.width, room.height);
    g.save(); g.globalAlpha = .18; g.fillStyle = '#91a56f'; for (let y = room.y + 3; y < room.y + room.height; y += 8) for (let x = room.x + ((y / 8) % 2 ? 3 : 7); x < room.x + room.width; x += 11) g.fillRect(x, y, 1, 1); g.restore();
    const tallTop = shell.northTallTop, lowTop = shell.northLowTop, cap = shell.sideCapWidth;
    for (let i = 0; i < 4; i++) {
      const id = `N${i + 1}`, x = room.x + i * room.tile, top = state.adjacent.has(id) ? lowTop : tallTop;
      g.fillStyle = '#aaa996'; g.fillRect(x, top, room.tile, room.y - top);
      g.fillStyle = '#b9b9a6'; g.fillRect(x, top, room.tile, 4);
      g.fillStyle = '#7d8275'; g.fillRect(x, room.y - 7, room.tile, 7);
    }
    const westTop = state.adjacent.has('N1') ? lowTop : tallTop, eastTop = state.adjacent.has('N4') ? lowTop : tallTop;
    g.fillStyle = '#858a7d'; g.fillRect(room.x - cap, westTop, cap, room.y + room.height + 22 - westTop); g.fillRect(room.x + room.width, eastTop, cap, room.y + room.height + 22 - eastTop); g.fillRect(room.x - cap, room.y + room.height, room.width + cap * 2, 22);
    for (const id of state.doors) {
      if (id[0] === 'N') { const i = Number(id.slice(1)) - 1, x = room.x + i * room.tile, top = state.adjacent.has(id) ? lowTop : tallTop; g.clearRect(x + 8, top, room.tile - 16, room.y - top); }
      else if (id[0] === 'S') { const i = Number(id.slice(1)) - 1, x = room.x + i * room.tile; g.clearRect(x + 8, room.y + room.height, room.tile - 16, 22); g.fillStyle = '#283b33'; g.fillRect(x + 8, room.y + room.height, room.tile - 16, 22); }
      else { const rows = { A: 0, B: 1, C: 2, D: 3 }, y = room.y + rows[id[1]] * room.tile; const x = id[0] === 'W' ? room.x - 22 : room.x + room.width; g.clearRect(x, y + 8, 22, room.tile - 16); g.fillStyle = '#283b33'; g.fillRect(x, y + 8, 22, room.tile - 16); }
    }
    g.fillStyle = 'rgba(4,10,11,.25)'; g.fillRect(room.x, room.y, room.width, room.height);
  }
  function drawImage(id, ground) { const spec = payload.specs[id], image = images[id], x = room.x + ground.x * room.tile - spec.anchor[0] * spec.renderScale, y = room.y + ground.y * room.tile - spec.anchor[1] * spec.renderScale; g.save(); g.filter = 'brightness(.64) saturate(.80)'; g.drawImage(image, x, y, spec.width * spec.renderScale, spec.height * spec.renderScale); g.restore(); return { x, y, width: spec.width * spec.renderScale, height: spec.height * spec.renderScale }; }
  function drawActor(seat) { const id = `actor-${seat.id}`, spec = payload.specs[id], image = images[id], x = room.x + seat.seatContact.x * room.tile - 80 * spec.renderScale, y = room.y + seat.seatContact.y * room.tile - spec.seatContactY * spec.renderScale; g.save(); g.filter = 'brightness(.66) saturate(.78)'; g.drawImage(image, x, y, spec.width * spec.renderScale, spec.height * spec.renderScale); g.restore(); }
  function redrawClip(id, ground, clip) { const spec = payload.specs[id], image = images[id], x = room.x + ground.x * room.tile - spec.anchor[0] * spec.renderScale, y = room.y + ground.y * room.tile - spec.anchor[1] * spec.renderScale; g.save(); g.beginPath(); g.rect(x + clip.x * spec.renderScale, y + clip.y * spec.renderScale, clip.width * spec.renderScale, clip.height * spec.renderScale); g.clip(); g.filter = 'brightness(.64) saturate(.80)'; g.drawImage(image, x, y, spec.width * spec.renderScale, spec.height * spec.renderScale); g.restore(); }
  function occupancySeats() { return state.occupancy === 'all' ? seatIds : state.occupancy === 'empty' ? [] : [state.occupancy]; }
  function render() {
    drawShell();
    if (state.routes) { for (const id of state.doors) drawPath(routes.doors[id], '#c8d7a3'); for (const id of occupancySeats()) drawPath(routes.seats[id], '#8fc7c0'); }
    const islandGround = { x: payload.specs.island.worldGround[0], y: payload.specs.island.worldGround[1] };
    g.save(); g.globalAlpha = .12; g.fillStyle = '#8ee6df'; g.beginPath(); g.ellipse(360, 330, 150, 78, 0, 0, Math.PI * 2); g.fill(); g.restore();
    for (const seat of layout.seats) {
      if (seat.id === 'northwest') redrawClip('chair-northwest', seat.chairGround, { x: 0, y: 0, width: payload.specs['chair-northwest'].width, height: 340 });
      else drawImage(`chair-${seat.id}`, seat.chairGround);
    }
    drawImage('island', islandGround);
    const occupied = new Set(occupancySeats());
    const island = payload.specs.island;
    const nwSeat = layout.seats.find(x => x.id === 'northwest'); if (occupied.has('northwest')) drawActor(nwSeat);
    redrawClip('island', islandGround, { x: 0, y: 235, width: 500, height: island.height - 235 });
    const neSeat = layout.seats.find(x => x.id === 'northeast'); if (occupied.has('northeast')) drawActor(neSeat);
    redrawClip('island', islandGround, { x: 574, y: 355, width: 438, height: 79 });
    const swSeat = layout.seats.find(x => x.id === 'southwest'); if (occupied.has('southwest')) drawActor(swSeat);
    redrawClip('island', islandGround, { x: 200, y: 370, width: 320, height: island.height - 370 });
    const seSeat = layout.seats.find(x => x.id === 'southeast'); if (occupied.has('southeast')) drawActor(seSeat);
    const se = layout.seats.find(x => x.id === 'southeast'); redrawClip('chair-southeast', se.chairGround, { x: 0, y: 0, width: payload.specs['chair-southeast'].width, height: 278 });
    g.fillStyle = 'rgba(3,8,9,.15)'; g.fillRect(room.x, room.y, room.width, room.height);
    if (state.routes) { for (const seat of layout.seats) { const a = pxy(seat.seatContact); g.fillStyle = '#dce8c2'; g.beginPath(); g.arc(a.x, a.y, 4, 0, Math.PI * 2); g.fill(); } }
    const actors = Object.fromEntries(layout.seats.filter(x => occupied.has(x.id)).map(seat => [seat.id, { identity: payload.specs[`actor-${seat.id}`].identity, facing: payload.specs[`actor-${seat.id}`].facing, hipContact: pxy(seat.seatContact) }]));
    const model = { status: assetContract.status, approval: assetContract.approval, runtimeIntegrationAuthorized: assetContract.runtimeIntegrationAuthorized, dimensions: layout.dimensions, segments: segmentIds, doors: [...state.doors], adjacency: [...state.adjacent], hidden: [], fixtures: Object.fromEntries(layout.solidFurniture.map(x => [x.id, { footprint: x.footprint, collision: 'solid', persistence: 'permanent' }])), seats: Object.fromEntries(layout.seats.map(x => [x.id, x])), actors, occupancy: state.occupancy, routes, shell, scaleContract: { tilePixels: 120, deskWorktopRisePixels: 80, chairSeatRisePixels: 45, actorRenderedWidths: Object.fromEntries(seatIds.map(id => [id, payload.specs[`actor-${id}`].renderedWidthPixels])) }, artPlacement: { islandGround, visibleFloorLandmarks: assetContract.sourceLandmarks }, layerOrder: ['shell', 'screen-glow', 'chairs', 'island-base', 'northwest-actor', 'northwest-desk-front', 'northeast-actor', 'southeast-divider-front', 'southwest-actor', 'southwest-desk-front', 'southeast-actor', 'southeast-chair-front', 'ambient-shade'], floorPhase: { origin: [0, 0], fixedToRoom: true }, optionalWallFixtures: [] };
    canvas.dataset.model = JSON.stringify(model); if (state.scale) renderScale();
  }
  function drawComparisonAsset(id, x, groundY) { const spec = payload.comparison.specs[id], image = images[`comparison-${id}`], y = groundY - spec.anchor[1] * spec.renderScale, left = x - spec.anchor[0] * spec.renderScale; sg.drawImage(image, left, y, spec.width * spec.renderScale, spec.height * spec.renderScale); }
  function renderScale() { sg.clearRect(0, 0, 960, 420); sg.fillStyle = '#17201e'; sg.fillRect(0, 0, 960, 420); sg.strokeStyle = '#617167'; sg.beginPath(); sg.moveTo(24, 380); sg.lineTo(936, 380); sg.stroke(); drawImageOnScale('island', 200, 380); drawComparisonAsset('officeDesk', 510, 380); drawComparisonAsset('frontDesk', 790, 380); }
  function drawImageOnScale(id, x, groundY) { const spec = payload.specs[id], image = images[id], y = groundY - spec.anchor[1] * spec.renderScale, left = x - spec.anchor[0] * spec.renderScale; sg.drawImage(image, left, y, spec.width * spec.renderScale, spec.height * spec.renderScale); }
  function load() { const list = [...Object.entries(payload.images), ...Object.entries(payload.comparison.images).map(([id, value]) => [`comparison-${id}`, value])]; return Promise.all(list.map(([id, item]) => new Promise((resolve, reject) => { const image = new Image(); image.onload = () => { images[id] = image; resolve(); }; image.onerror = reject; image.src = item.dataUrl; }))); }

  drawButtonGrid();
  occupancyControl.addEventListener('change', () => { state.occupancy = occupancyControl.value; render(); save(); });
  routesControl.addEventListener('change', () => { state.routes = routesControl.checked; render(); save(); });
  scaleControl.addEventListener('change', () => { state.scale = scaleControl.checked; sync(); render(); save(); });
  root.querySelectorAll('[data-backing]').forEach(input => input.addEventListener('change', () => { input.checked ? state.adjacent.add(input.dataset.backing) : state.adjacent.delete(input.dataset.backing); render(); save(); }));
  window.addEventListener('openai:set_globals', event => { const saved = event.detail?.globals?.widgetState; if (saved) apply(saved); });
  apply(window.openai?.widgetState);
  const ready = load().then(() => { assetsReady = true; render(); return true; });
  window.__radiologyReadingProof = { ready: () => ready, state, render, toggle: toggleDoor, routes: () => routes, valid, model: () => JSON.parse(canvas.dataset.model || '{}') };
})();
