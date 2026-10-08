// Pure room/route/registration math shared by the browser and Node validator.
// Door and coarse-route rules follow the frozen Room Touch-up Lab model.
export const TILE = 120, ACTOR_RADIUS = 0.18;
export const segId = (side, offset) => side === 'N' || side === 'S' ? `${side}${offset + 1}` : `${side}${String.fromCharCode(65 + offset)}`;
export const parseSeg = s => ({ side: s[0], offset: s[0] === 'N' || s[0] === 'S' ? Number(s.slice(1)) - 1 : s.charCodeAt(1) - 65 });
export function roomSegments(room) {
  const [w, h] = room.footprint;
  return ['N', 'S', 'W', 'E'].flatMap(side => Array.from({ length: side === 'N' || side === 'S' ? w : h }, (_, i) => segId(side, i)));
}
export function doorInside(room, segment) {
  const { side, offset } = parseSeg(segment), [w, h] = room.footprint;
  return side === 'N' ? [offset, 0] : side === 'S' ? [offset, h - 1] : side === 'W' ? [0, offset] : [w - 1, offset];
}
export function visible(record, doors, backed) {
  if ((record.doorOwners ?? []).some(x => doors.has(x))) return false;
  return !(record.backedOwners ?? []).some(x => backed.has(x)) || !!record.touchupKeepWhenBacked;
}
export function blockedTiles(room, nav, doors) {
  const blocked = new Set();
  for (const fixture of nav.solidFixtures) {
    if ((fixture.hiddenByDoorSlots ?? []).some(x => doors.has(segId(x.side[0].toUpperCase(), x.offset)))) continue;
    for (const tile of fixture.blockedTiles) blocked.add(`${tile.x},${tile.y}`);
  }
  for (const door of doors) blocked.delete(doorInside(room, door).join(','));
  return blocked;
}
export function bfs(room, start, goal, blocked, endpoints) {
  const [w, h] = room.footprint, key = (x, y) => `${x},${y}`;
  const prev = new Map([[key(...start), null]]), queue = [start];
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i]; if (x === goal[0] && y === goal[1]) break;
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = x + dx, ny = y + dy, k = key(nx, ny), isGoal = nx === goal[0] && ny === goal[1];
      if (nx < 0 || ny < 0 || nx >= w || ny >= h || prev.has(k) || (blocked.has(k) && !(isGoal && endpoints.has(k)))) continue;
      prev.set(k, [x, y]); queue.push([nx, ny]);
    }
  }
  if (!prev.has(key(...goal))) return null;
  const route = []; let current = goal;
  while (current) { route.unshift(current); current = prev.get(key(...current)); }
  return route;
}
export function fineBlockers(P, nav, baseClearances = []) {
  const inside = new Set([...P.doors].map(x => doorInside(P.room, x).join(',')));
  const fixed = nav.solidFixtures.filter(x => !x.blockedTiles.some(t => inside.has(`${t.x},${t.y}`)) && !(x.hiddenByDoorSlots ?? []).some(d => P.doors.has(segId(d.side[0].toUpperCase(), d.offset)))).map(x => ({ id: x.id, footprint: x.footprint }));
  const records = P.room.records.filter(x => x.footprint && visible(x, P.doors, P.backed)).map(x => ({ id: x.id, footprint: x.footprint }));
  const byRecord=new Map();
  for(const item of baseClearances){const record=P.room.records.find(r=>r.id===item.recordId);if(!record||!visible(record,P.doors,P.backed))continue;const f=item.footprint,b=byRecord.get(item.recordId);if(b){b.left=Math.min(b.left,f.left);b.top=Math.min(b.top,f.top);b.right=Math.max(b.right,f.left+f.width);b.bottom=Math.max(b.bottom,f.top+f.height);}else byRecord.set(item.recordId,{left:f.left,top:f.top,right:f.left+f.width,bottom:f.top+f.height});}
  const measured=[...byRecord].map(([id,b])=>({id:id+':actual-base-envelope',footprint:{left:b.left,top:b.top,width:b.right-b.left,height:b.bottom-b.top}}));
  return [...fixed, ...records, ...measured];
}
export function footprintFallback(P, nav, start, target, baseClearances = []) {
  // The frozen grid seals tile (3,0) between bench and armchair, although their
  // authored footprints leave a 0.50-tile gap. Use only that real geometry;
  // never move furniture, modify blockedTiles, or make a solid passable here.
  const step = 0.05, [w, h] = P.room.footprint, blockers = fineBlockers(P, nav, baseClearances);
  // Match the lab's conservative rectangle inflation and also clear measured
  // sprite feet. These are proof-only clearance records, not a nav/layout edit.
  const clear = (x, y) => x >= ACTOR_RADIUS - 1e-9 && y >= ACTOR_RADIUS - 1e-9 && x <= w - ACTOR_RADIUS + 1e-9 && y <= h - ACTOR_RADIUS + 1e-9 && !blockers.some(({footprint:f}) => x > f.left - ACTOR_RADIUS + 1e-9 && x < f.left + f.width + ACTOR_RADIUS - 1e-9 && y > f.top - ACTOR_RADIUS + 1e-9 && y < f.top + f.height + ACTOR_RADIUS - 1e-9);
  const worldStart = start.map(x => x + 0.5), logicalTarget = [target.x + 0.5, target.y + 0.5];
  const waitingIndex = (nav.waitingAnchors ?? []).findIndex(x => x.x === target.x && x.y === target.y);
  const support = waitingIndex >= 0 ? P.room.supports[waitingIndex] : null;
  let walkingGoal = logicalTarget;
  if (support?.id.startsWith('bench:')) walkingGoal = [support.ground.x, support.ground.y + ACTOR_RADIUS + step];
  else if (support?.id === 'kidWest' || support?.id === 'kidEast') walkingGoal = [logicalTarget[0], logicalTarget[1] - ACTOR_RADIUS - step];
  const gridStart = worldStart.map(x => Math.round(x / step)), gridGoal = walkingGoal.map(x => Math.round(x / step));
  if (!clear(...worldStart) || !clear(...walkingGoal) || !clear(...gridGoal.map(x => x * step))) return null;
  const key = (x, y) => `${x},${y}`, prev = new Map([[key(...gridStart), null]]), queue = [gridStart], maxX = Math.round(w / step), maxY = Math.round(h / step);
  const blockedCache = new Map();
  const gridClear = (x, y) => { const k = key(x, y); if (!blockedCache.has(k)) blockedCache.set(k, clear(x * step, y * step)); return blockedCache.get(k); };
  for (let i = 0; i < queue.length; i++) {
    const [x, y] = queue[i]; if (x === gridGoal[0] && y === gridGoal[1]) break;
    for (const [dx, dy] of [[0,-1],[1,0],[0,1],[-1,0]]) {
      const nx = x + dx, ny = y + dy, k = key(nx, ny);
      if (nx < 0 || ny < 0 || nx > maxX || ny > maxY || prev.has(k) || !gridClear(nx, ny) || !clear((x + nx) * step / 2, (y + ny) * step / 2)) continue;
      prev.set(k, [x, y]); queue.push([nx, ny]);
    }
  }
  if (!prev.has(key(...gridGoal))) return null;
  const dense = []; let current = gridGoal;
  while (current) { dense.unshift(current.map(x => x * step)); current = prev.get(key(...current)); }
  const walkingPath = dense.filter((point, i) => i === 0 || i === dense.length - 1 || !((nearAxis(dense[i-1][0], point[0]) && nearAxis(point[0], dense[i+1][0])) || (nearAxis(dense[i-1][1], point[1]) && nearAxis(point[1], dense[i+1][1]))));
  if (Math.hypot(walkingPath.at(-1)[0] - walkingGoal[0], walkingPath.at(-1)[1] - walkingGoal[1]) > 1e-8) walkingPath.push(walkingGoal);
  return { walkingPath, standingApproach: walkingGoal, seatingTransition: support ? { supportId: support.id, fromWorld: walkingGoal, toGrid: [target.x, target.y] } : null, step, actorRadius: ACTOR_RADIUS, reason: 'Original coarse grid cannot leave north-east tile; unchanged authored footprints permit the passage.' };
}
const nearAxis = (a, b) => Math.abs(a - b) < 1e-8;
export function computeRoutes(P, nav, baseClearances = []) {
  if(nav.privateProofRouteModel)return seatingRoutes(P,nav,baseClearances);
  const room = P.room, [w, h] = room.footprint;
  const blocked = blockedTiles(room, nav, P.doors);
  const endpoints = new Set(nav.solidFixtures.flatMap(x => (x.endpointOnlyContacts ?? []).map(t => `${t.x},${t.y}`)));
  const targets = [nav.primaryAnchor, nav.staffAnchor, nav.patientCareAnchor, nav.clinicianCareAnchor, ...(nav.waitingAnchors ?? [])].filter(Boolean);
  const routes = [];
  for (const segment of P.doors) {
    const { side, offset } = parseSeg(segment);
    const outside = side === 'N' ? [offset, -0.6] : side === 'S' ? [offset, h - 0.4] : side === 'W' ? [-0.6, offset] : [w - 0.4, offset];
    for (const target of targets) {
      const path = bfs(room, doorInside(room, segment), [target.x, target.y], blocked, endpoints);
      if (path) routes.push({ door: segment, target, path: [outside, ...path] });
      else {
        const fallback = footprintFallback(P, nav, doorInside(room, segment), target, baseClearances);
        const routePath = fallback ? [outside, ...fallback.walkingPath.map(point => point.map(x => x - 0.5))] : null;
        if (fallback?.seatingTransition) routePath.push([target.x, target.y]);
        routes.push({ door: segment, target, path: routePath, ...(fallback ? { routeModel: 'footprint-fallback', fallback } : {}) });
      }
    }
  }
  return routes;
}
// Expanded owner-review layout: continuous, radius-clear walking for every
// entry and every visible seat. Static seating contacts are separate segments.
export function routeTargets(P){
 const out=[{id:'care',x:0,y:2,world:[.5,2.5],approach:[.5,2.5]}];
 for(const s of P.room.supports){const rec=P.room.records.find(r=>r.id===(s.recordId??(s.id.startsWith('bench:')?'bench':s.id)));if(rec&&!visible(rec,P.doors,P.backed))continue;
 let approach;
 if(s.id.startsWith('bench:'))approach=[s.ground.x,1.2];
 else if(s.id==='armchair')approach=[2.8,2.15];
 else if(s.id==='olderChildChair')approach=[1.15,1.95];
 else if(s.id==='spareAdultChair')approach=[1.15,3.18];
 else if(s.id==='kidWest')approach=[1.15,2.66];
 else if(s.id==='kidEast')approach=[2.85,2.66];
 else if(s.id==='kidNorth')approach=[2,1.85];
 else if(s.id==='kidSouth')approach=[2,3.3];
 else throw Error('Missing explicit seat approach '+s.id);
 out.push({id:s.id,x:Math.floor(s.ground.x),y:Math.floor(s.ground.y),world:[s.seat.x,s.seat.y],approach,supportId:s.id});
 }return out;
}
export function seatingRoutes(P,nav,baseClearances){
 const step=.05,[w,h]=P.room.footprint,blockers=fineBlockers(P,nav,baseClearances),targets=routeTargets(P),cache=new Map();
 const clear=(x,y)=>x>=ACTOR_RADIUS-1e-9&&y>=ACTOR_RADIUS-1e-9&&x<=w-ACTOR_RADIUS+1e-9&&y<=h-ACTOR_RADIUS+1e-9&&!blockers.some(({footprint:f})=>x>f.left-ACTOR_RADIUS+1e-9&&x<f.left+f.width+ACTOR_RADIUS-1e-9&&y>f.top-ACTOR_RADIUS+1e-9&&y<f.top+f.height+ACTOR_RADIUS-1e-9);
 const gridClear=(x,y)=>{const k=x+81*y;if(!cache.has(k))cache.set(k,clear(x*step,y*step));return cache.get(k);};
 const key=(x,y)=>x+81*y,routes=[];
 for(const segment of P.doors){const {side,offset}=parseSeg(segment),start=doorInside(P.room,segment).map(v=>v+.5),startGrid=start.map(v=>Math.round(v/step)),prev=new Map([[key(...startGrid),null]]),queue=[startGrid];
 if(clear(...start))for(let i=0;i<queue.length;i++){const[x,y]=queue[i];for(const[dx,dy]of[[0,-1],[1,0],[0,1],[-1,0]]){const nx=x+dx,ny=y+dy,k=key(nx,ny);if(nx<0||ny<0||nx>80||ny>80||prev.has(k)||!gridClear(nx,ny))continue;prev.set(k,[x,y]);queue.push([nx,ny]);}}
 const outside=side==='N'?[offset,-.6]:side==='S'?[offset,h-.4]:side==='W'?[-.6,offset]:[w-.4,offset];
 for(const target of targets){const goal=target.approach.map(v=>Math.round(v/step));if(!clear(...start)||!clear(...target.approach)||!prev.has(key(...goal))){routes.push({door:segment,target,path:null,routeModel:'private-footprint-seating'});continue;}
 const dense=[];let q=goal;while(q){dense.unshift(q.map(v=>v*step));q=prev.get(key(...q));}
 const walkingPath=dense.filter((p,i)=>i===0||i===dense.length-1||!((nearAxis(dense[i-1][0],p[0])&&nearAxis(p[0],dense[i+1][0]))||(nearAxis(dense[i-1][1],p[1])&&nearAxis(p[1],dense[i+1][1]))));
 if(Math.hypot(...walkingPath.at(-1).map((v,i)=>v-target.approach[i]))>1e-8)walkingPath.push(target.approach);
 const seatingTransition=target.supportId?{supportId:target.supportId,fromWorld:target.approach,toWorld:target.world,kind:'static-seat-contact-not-walking'}:null;
 // Renderer paths use tile index coordinates and include the outside segment.
 const routePath=[outside,...walkingPath.map(p=>p.map(v=>v-.5))];
 routes.push({door:segment,target,path:routePath,walkingPath,standingApproach:target.approach,seatingTransition,routeModel:'private-footprint-seating'});
 }}return routes;
}
export function designBlockers(P, nav) {
  const inside = new Set([...P.doors].map(x => doorInside(P.room, x).join(',')));
  const passable = id => nav.solidFixtures.some(x => x.id === id && x.blockedTiles.some(t => inside.has(`${t.x},${t.y}`)));
  const solids = P.room.solids.filter(x => !x.endpoint && !passable(x.id)).map(x => ({ id: x.id, footprint: x.footprint, owners: [] }));
  const records = P.room.records.filter(x => x.footprint).map(x => ({ id: x.id, footprint: x.footprint, owners: x.doorOwners ?? [] }));
  return [...solids, ...records].filter(x => !x.owners.some(y => P.doors.has(y)));
}
export function sampleRoutes(routes, visitor) {
  let samples = 0;
  for (const route of routes) if (route.path) for (let i = 1; i < route.path.length; i++) {
    const [ax, ay] = route.path[i - 1].map(v => v + 0.5), [bx, by] = route.path[i].map(v => v + 0.5);
    const steps = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / 0.025));
    for (let k = 0; k <= steps; k++) { visitor(ax + (bx - ax) * k / steps, ay + (by - ay) * k / steps, route, i); samples++; }
  }
  return samples;
}
export function decorConflicts(P, nav, routes) {
  const conflicts = new Set(), blockers = nav.privateProofRouteModel?fineBlockers(P,nav):designBlockers(P, nav);
  sampleRoutes(routes, (x, y, route) => {
    for (const item of blockers) {
      const f = item.footprint;
      if (x > f.left - ACTOR_RADIUS && x < f.left + f.width + ACTOR_RADIUS && y > f.top - ACTOR_RADIUS && y < f.top + f.height + ACTOR_RADIUS) conflicts.add(`${item.id} blocks ${route.door}->(${route.target.x},${route.target.y})`);
    }
  });
  return [...conflicts];
}
export function doorZoneViolations(P) {
  const [w, h] = P.room.footprint, bad = [], depth = 0.55;
  for (const record of P.room.records.filter(x => x.footprint || x.depthPolicy === 'wall')) for (const segment of roomSegments(P.room)) {
    if ((record.doorOwners ?? []).includes(segment)) continue;
    const { side, offset } = parseSeg(segment);
    if (record.depthPolicy === 'wall' && !record.footprint) {
      const width = record.renderSizeTiles[0], x = record.destinationTopLeftTiles[0] + width / 2;
      if (side === 'N' && x + width / 2 > offset + 0.08 && x - width / 2 < offset + 0.92) bad.push(`${record.id} on wall ${segment}`);
    } else {
      const f = record.footprint;
      const zone = side === 'N' ? [offset + 0.12, 0, 0.76, depth] : side === 'S' ? [offset + 0.12, h - depth, 0.76, depth] : side === 'W' ? [0, offset + 0.12, depth, 0.76] : [w - depth, offset + 0.12, depth, 0.76];
      if (f.left < zone[0] + zone[2] && f.left + f.width > zone[0] && f.top < zone[1] + zone[3] && f.top + f.height > zone[1]) bad.push(`${record.id} in ${segment} doorway`);
    }
  }
  return bad;
}
export function check(room, nav, doors, backed, baseClearances = []) {
  const P = { room, doors: new Set(doors), backed: new Set(backed) }, routes = computeRoutes(P, nav, baseClearances);
  return { routes: routes.length, unreachable: routes.filter(x => !x.path).map(x => `${x.door}->(${x.target.x},${x.target.y})`), conflicts: decorConflicts(P, nav, routes), doorZone: doorZoneViolations(P) };
}
export function fixturePlacement(record, prepared, tile = TILE, ox = 0, oy = 0) {
  const [width, height] = record.renderSizeTiles.map(x => x * tile);
  let [x, y] = record.destinationTopLeftTiles.map(x => x * tile);
  if (prepared) {
    const world = record.worldLocalGround ?? [record.destinationTopLeftTiles[0] + record.renderSizeTiles[0] / 2, record.destinationTopLeftTiles[1]];
    x = world[0] * tile - prepared.canvasAnchor[0] * width / prepared.canvas[0];
    y = world[1] * tile - prepared.canvasAnchor[1] * height / prepared.canvas[1];
  }
  return { x: ox + x, y: oy + y, w: width, h: height };
}
export function actorPlacements(P, data, state = { parents: true, children: true }) {
  const result = [], characters = Object.fromEntries(data.characters.map(x => [x.id, x]));
  const pediatric = data.pediatricPresentation;
  const sources = { 'bench:seat-1': 'patient.adult.001', armchair: 'patient.adult.007', ...Object.fromEntries((pediatric?.children ?? []).map(c => [c.supportId, c.characterId])) };
  for (const support of P.room.supports) {
    const id = sources[support.id]; if (!id) continue; // Second bench place stays vacant, preserving its support and navigation target.
    const child = !!pediatric.children.find(c=>c.supportId===support.id);
    const record=P.room.records.find(r=>r.id===support.recordId);
    if(record&&!visible(record,P.doors??new Set(),P.backed??new Set()))continue;
    if (child ? !state.children : !state.parents) continue;
    const character = characters[id], pose = character.poses.sit[support.facing], south = character.poses.stand.south;
    const scale = Math.min(1, data.characterMetrics.visibleHeightCap / (south.anchors.floorY - south.visibleBounds.y));
    const fit = child ? pediatric.children.find(c => c.supportId === support.id) : pediatric.parents?.find(c=>c.supportId===support.id);
    const width = child ? pose.width * pediatric.sourceScale : TILE * data.characterMetrics.widthInTiles * scale;
    const height = width * pose.height / pose.width;
    const [contactX, contactY] = fit?.seatContactSource ?? [pose.anchors.bodyAxisX, pose.anchors.seatContactY];
    if (!Number.isFinite(contactY)) throw new Error(`Missing seated hip anchor: ${id}`);
    const x = (P.ox ?? 0) + support.seat.x * TILE - width * contactX / pose.width;
    const y = (P.oy ?? 0) + support.seat.y * TILE - height * contactY / pose.height;
    result.push({ kind: 'actor', id: support.id, characterId: id, group: child ? 'children' : 'parents', pose: 'sit', direction: support.facing, url: pose.url, x, y, w: width, h: height, py: Math.max(support.ground.y, support.fixtureGround?.y ?? support.ground.y) + 0.0001, seat: support.seat, ground: support.ground, sourceAnchors: pose.anchors, renderSeatContact: [contactX, contactY], visibleBounds: pose.visibleBounds, sourceScale: width / pose.width, sourceSize: [pose.width, pose.height] });
  }
  return result;
}
