// Approved Gift Shop fine-grid/radius model, adapted for two necessary gym contacts.
// Native Canvas + browser share this module; no runtime navigation modifications.
export const TILE = 120, ACTOR_RADIUS = .18, STEP = .025;
export const segId = (side, o) => 'NS'.includes(side) ? side + (o + 1) : side + String.fromCharCode(65 + o);
export const parseSeg = s => ({ side: s[0], offset: 'NS'.includes(s[0]) ? Number(s.slice(1)) - 1 : s.charCodeAt(1) - 65 });
export const roomSegments = room => ['N', 'S', 'W', 'E'].flatMap(s => Array.from({ length: room.footprint['NS'.includes(s) ? 0 : 1] }, (_, i) => segId(s, i)));
export function segmentSpan(room, segment) {
  const { side, offset } = parseSeg(segment), count = room.footprint['NS'.includes(side) ? 0 : 1];
  if (!'NSWE'.includes(side) || offset < 0 || offset >= count || !Number.isInteger(offset)) throw Error('Invalid one-tile door section: ' + segment);
  return { side, offset, length: 1, start: offset, end: offset + 1 };
}
export function doorInsideWorld(room, segment) {
  const s = segmentSpan(room, segment), mid = (s.start + s.end) / 2, [w, h] = room.footprint;
  return s.side === 'N' ? [mid, .5] : s.side === 'S' ? [mid, h - .5] : s.side === 'W' ? [.5, mid] : [w - .5, mid];
}
export const doorInside = (room, s) => doorInsideWorld(room, s).map(Math.floor);
export const visible = (r, doors, backed) => !(r.doorOwners ?? []).some(s => doors.has(s)) && (!(r.backedOwners ?? []).some(s => backed.has(s)) || !!r.touchupKeepWhenBacked);
const intersects = (a, b) => a.left < b.left + b.width - 1e-9 && a.left + a.width > b.left + 1e-9 && a.top < b.top + b.height - 1e-9 && a.top + a.height > b.top + 1e-9;
// Every declared fixture floor footprint owns its area exclusively. Touching
// edges are legal; no pair, door state or classification receives an exception.
// Wall art, the walkable floor/mat and the bench's source-pixel foreground do
// not declare independent floor footprints, so they do not own duplicate area.
export function fixtureFloorFootprintOverlaps(P) {
  const fixtures=P.room.records.filter(r=>r.footprint&&visible(r,P.doors,P.backed)),overlaps=[];
  for(let i=0;i<fixtures.length;i++)for(let j=i+1;j<fixtures.length;j++){
    const a=fixtures[i],b=fixtures[j];if(!intersects(a.footprint,b.footprint))continue;
    const left=Math.max(a.footprint.left,b.footprint.left),top=Math.max(a.footprint.top,b.footprint.top),width=Math.min(a.footprint.left+a.footprint.width,b.footprint.left+b.footprint.width)-left,height=Math.min(a.footprint.top+a.footprint.height,b.footprint.top+b.footprint.height)-top;
    overlaps.push({a:a.id,b:b.id,intersection:{left,top,width,height,area:width*height}});
  }
  return overlaps;
}
export function doorwayZone(room, segment) {
  const s = segmentSpan(room, segment), [w, h] = room.footprint, inset = .12, span = 1 - 2 * inset, depth = .55;
  return s.side === 'N' ? { left: s.start + inset, top: 0, width: span, height: depth } : s.side === 'S' ? { left: s.start + inset, top: h - depth, width: span, height: depth } : s.side === 'W' ? { left: 0, top: s.start + inset, width: depth, height: span } : { left: w - depth, top: s.start + inset, width: depth, height: span };
}
export function ownersFor(room, r) {
  // The owner requires south planting to stay when a west/east doorway opens.
  // Its shallow footprint leaves those full portals clear; each bed belongs to
  // its one south section rather than the coarse corner doorway zone.
  if (r.southPlanterSection) {
    const s = segmentSpan(room, r.southPlanterSection);
    if (s.side !== 'S' || !r.footprint || Math.abs(r.footprint.left - s.start) > 1e-9 || Math.abs(r.footprint.width - 1) > 1e-9) throw Error('Invalid south planter section');
    return [r.southPlanterSection];
  }
  if (r.footprint) return roomSegments(room).filter(s => intersects(r.footprint, doorwayZone(room, s)));
  if (r.depthPolicy === 'wall') return roomSegments(room).filter(s => { const span = segmentSpan(room, s), left = r.destinationTopLeftTiles[0], right = left + r.renderSizeTiles[0]; return span.side === 'N' && left < span.end - .08 && right > span.start + .08; });
  return [];
}
export const passableThroughDoors = () => []; // Characters walk around visible furniture.
export function fineBlockers(P, nav, bases = []) {
  const shown = r => r.classification === 'necessary' || visible(r, P.doors, P.backed);
  const byId = new Map(P.room.records.map(r => [r.id, r]));
  return [
    ...nav.solidFixtures.map(f => ({ id: f.id, footprint: f.footprint, basis: 'Frozen source footprint' })),
    ...P.room.records.filter(r => r.footprint && !r.walkable && shown(r)).map(r => ({ id: r.id, footprint: r.footprint, basis: r.classification + ' visible fixture footprint' })),
    ...bases.filter(b => !byId.has(b.recordId) || shown(byId.get(b.recordId))).map(b => ({ ...b, basis: 'Measured opaque floor-contact band' })),
  ];
}
export const designBlockers = (P, nav) => fineBlockers(P, nav);
export function clearPoint(P, blockers, x, y, occupied = []) {
  const [w, h] = P.room.footprint;
  return x >= ACTOR_RADIUS - 1e-9 && y >= ACTOR_RADIUS - 1e-9 && x <= w - ACTOR_RADIUS + 1e-9 && y <= h - ACTOR_RADIUS + 1e-9
    && !blockers.some(({ footprint: f }) => x > f.left - ACTOR_RADIUS + 1e-9 && x < f.left + f.width + ACTOR_RADIUS - 1e-9 && y > f.top - ACTOR_RADIUS + 1e-9 && y < f.top + f.height + ACTOR_RADIUS - 1e-9)
    && !occupied.some(a => Math.hypot(x - a.ground[0], y - a.ground[1]) < 2 * ACTOR_RADIUS - 1e-9);
}
export function routeTargets(P, nav, fromDoor) {
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
const cache = new Map();
const near = (a, b) => Math.abs(a - b) < 1e-9;
export function routeBetween(P, nav, bases, start, goal, occupied = []) {
  const blockers = fineBlockers(P, nav, bases), signature = JSON.stringify([P.room.footprint, blockers.map(b => b.footprint), start, goal, occupied.map(a => a.ground)]);
  if (cache.has(signature)) return cache.get(signature);
  const [w, h] = P.room.footprint, maxX = Math.round(w / STEP), maxY = Math.round(h / STEP), stride = maxX + 1, length = stride * (maxY + 1);
  const key = (x, y) => x + stride * y, grid = start.map(v => Math.round(v / STEP)), end = goal.map(v => Math.round(v / STEP));
  const clear = (x, y) => clearPoint(P, blockers, x, y, occupied), prev = new Int32Array(length).fill(-2), queue = new Int32Array(length), clearCache = new Int8Array(length);
  if (!clear(...start) || !clear(...goal)) { cache.set(signature, null); return null; }
  let head = 0, tail = 0; queue[tail++] = key(...grid); prev[key(...grid)] = -1;
  const gridClear = (x, y) => { const k = key(x, y); if (!clearCache[k]) clearCache[k] = clear(x * STEP, y * STEP) ? 1 : -1; return clearCache[k] === 1; };
  while (head < tail && prev[key(...end)] === -2) {
    const k = queue[head++], x = k % stride, y = Math.floor(k / stride);
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = x + dx, ny = y + dy, n = key(nx, ny);
      if (nx < 0 || ny < 0 || nx > maxX || ny > maxY || prev[n] !== -2 || !gridClear(nx, ny) || !clear((nx + x) * STEP / 2, (ny + y) * STEP / 2)) continue;
      prev[n] = k; queue[tail++] = n;
    }
  }
  if (prev[key(...end)] === -2) { cache.set(signature, null); return null; }
  const dense = []; for (let k = key(...end); k >= 0; k = prev[k]) dense.push([k % stride * STEP, Math.floor(k / stride) * STEP]); dense.reverse();
  const walking = dense.filter((p, i) => i === 0 || i === dense.length - 1 || !((near(dense[i - 1][0], p[0]) && near(p[0], dense[i + 1][0])) || (near(dense[i - 1][1], p[1]) && near(p[1], dense[i + 1][1]))));
  walking[0] = [...start]; walking[walking.length - 1] = [...goal]; cache.set(signature, walking); return walking;
}
export function computeRoutes(P,nav,bases=[],options={}) {
 const occupied=options.occupied??[],results=[];
 for(const door of P.doors){const start=doorInsideWorld(P.room,door),outside=doorOutsideWorld(P.room,door);
  for(const target of routeTargets(P,nav,door)){const others=occupied.filter(a=>a.supportId!==target.supportId),inside=routeBetween(P,nav,bases,start,target.approach,others),walkingPath=inside?[outside,...inside,...(target.exitDoor?[doorOutsideWorld(P.room,target.exitDoor)]:[])]:null;
   const seatingTransition=target.pose==='sit'?{supportId:target.supportId,fromWorld:target.approach,toWorld:target.world,kind:'static-seating-contact-not-walking'}:null;
   results.push({door,target,path:walkingPath?.map(p=>p.map(v=>v-.5))??null,walkingPath,standingApproach:target.approach,seatingTransition,passThrough:[],routeModel:'private-gym-full-portal-standing-seated-contacts'});
  }
 }
 return results;
}
export function sampleWalkingRoutes(routes, visitor, spacing = .005) {
  let count = 0;
  for (const r of routes) if (r.walkingPath) for (let i = 1; i < r.walkingPath.length; i++) {
    const a = r.walkingPath[i - 1], b = r.walkingPath[i], steps = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / spacing));
    for (let k = 0; k <= steps; k++) { visitor(a[0] + (b[0] - a[0]) * k / steps, a[1] + (b[1] - a[1]) * k / steps, r); count++; }
  }
  return count;
}
export function decorConflicts(P, nav, routes, bases = []) {
  const blockers = fineBlockers(P, nav, bases), bad = new Set();
  sampleWalkingRoutes(routes, (x, y, r) => { if (!clearWalkPoint(P, blockers, x, y)) bad.add(r.door + '->' + r.target.id); }); return [...bad];
}
export function doorZoneViolations(P) {
  const bad = [];
  for (const r of P.room.records) {
    if (r.classification === 'necessary' && ((r.doorOwners ?? []).length || (r.backedOwners ?? []).length)) bad.push(r.id + ' necessary furniture must never hide');
    for (const s of ownersFor(P.room, r)) if (!(r.doorOwners ?? []).includes(s)) bad.push(r.id + ' in ' + s);
  }
  return bad;
}
export function check(room, nav, doors, backed, bases = []) {
  const P = { room, doors: new Set(doors), backed: new Set(backed) }, routes = computeRoutes(P, nav, bases);
  const floorOverlaps=fixtureFloorFootprintOverlaps(P);
  return { routes: routes.length, unreachable: routes.filter(r => !r.path).map(r => r.door + '->' + r.target.id), conflicts: [...decorConflicts(P, nav, routes, bases),...floorOverlaps.map(o=>'Overlapping floor footprints: '+o.a+' / '+o.b)], floorOverlaps, doorZone: doorZoneViolations(P), passThrough: [] };
}
export function fixturePlacement(r, prepared, tile = TILE, ox = 0, oy = 0) {
  const [w, h] = r.renderSizeTiles.map(v => v * tile); let [x, y] = r.destinationTopLeftTiles.map(v => v * tile);
  if (prepared) { const world = r.worldLocalGround ?? [r.destinationTopLeftTiles[0] + r.renderSizeTiles[0] / 2, r.destinationTopLeftTiles[1]]; x = world[0] * tile - prepared.canvasAnchor[0] * w / prepared.canvas[0]; y = world[1] * tile - prepared.canvasAnchor[1] * h / prepared.canvas[1]; }
  return { x: ox + x, y: oy + y, w, h };
}
export function actorPlacements(P,data,state={}){
 const out=[];
 for(const fit of data.staffGymPresentation.actors){if(state[fit.group]===false)continue;const c=data.characters.find(c=>c.id===fit.characterId),pose=c.poses[fit.pose][fit.direction],anchor=fit.pose==='sit'?fit.seat:fit.ground,[cx,cy]=fit.pose==='sit'?fit.seatContactSource:fit.floorContactSource,scale=fit.sourceScale;
 out.push({kind:'actor',id:fit.supportId,characterId:c.id,category:fit.category,group:fit.group,pose:fit.pose,direction:fit.direction,url:pose.url,x:(P.ox??0)+anchor[0]*TILE-cx*scale,y:(P.oy??0)+anchor[1]*TILE-cy*scale,w:pose.width*scale,h:pose.height*scale,py:fit.painterGround,seat:{x:anchor[0],y:anchor[1]},ground:{x:fit.ground[0],y:fit.ground[1]},renderSeatContact:[cx,cy],renderFloorContact:fit.floorContactSource,sourceScale:scale,sourceSize:[pose.width,pose.height]});}
 return out;
}
