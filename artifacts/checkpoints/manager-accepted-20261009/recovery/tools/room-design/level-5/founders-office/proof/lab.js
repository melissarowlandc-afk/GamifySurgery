// Private snapshot of the approved Level 4 Canvas renderer.
// New proposed Founder Office layout and art exist only in this proof.
// room-touchups.mjs is a preserved renderer support snapshot, not a game edit.
import * as TU from "./room-touchups.mjs";
import * as Geometry from "./geometry.mjs";
import { DESIGN_ASSETS, DESIGN_NAVIGATION, DESIGN_ROOMS, PREPARED_METADATA, ASSET_CONTRACT, DESIGN_TIERS } from "./design-rooms.js";

const T = 120; // shell pixels per tile, same as the game's approved proofs
const ART_ROOT = "../../../../../apps/player/public/";
const LIGHT = "#789173", CREAM = "#efe1bd";
const ACTOR_RADIUS = 0.18;

const state = {
  scene: "room", view: "proposed", roomId: "founders-office", tier: 1,
  visitors: true, founders: true, contacts: false, bases: false,
  doors: new Set(), backed: new Set(),
  actors: true, routes: false, grid: false, imaging: true, occupied: false,
};

const data = await (await fetch("./data.json")).json();
const rooms = new Map(data.rooms.filter((r) => r.proofId !== "hallway").map((r) => [r.proofId, r]));
// Design-only rooms (not in the game yet) render, route and validate the same way.
for (const room of DESIGN_ROOMS) rooms.set(room.proofId, room);
Object.assign(data.navigation, DESIGN_NAVIGATION);
function setTier(level) {
  const tier = DESIGN_TIERS.find(t => t.level === Number(level));
  if (!tier) throw new RangeError('Appearance tier must be 1–5');
  state.tier = tier.level;
  rooms.set(tier.room.proofId, tier.room);
  data.navigation[tier.room.definitionId] = tier.navigation;
  data.founderPresentation = tier.presentation;
  data.previewBaseClearances = tier.bases;
  return tier;
}
setTier(1);
const hallway = data.rooms.find((r) => r.proofId === "hallway");
const images = new Map();

function loadImage(src) {
  if (images.has(src)) return images.get(src);
  const p = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => { console.error("Missing proof image",src); resolve(null); };
    img.src = src;
  });
  images.set(src, p);
  return p;
}
const atlasSrc = (assetId) => DESIGN_ASSETS[assetId] ? DESIGN_ASSETS[assetId].src : ART_ROOT + data.atlases[assetId].raw.relativePath;
const occupancyOk = (item) => !item.occupancy || item.occupancy === (state.occupied ? "occupied" : "empty");

// ---------- geometry helpers ----------
const segId = (side, offset) => side === "N" || side === "S" ? `${side}${offset + 1}` : `${side}${String.fromCharCode(65 + offset)}`;
function roomSegments(room) { return Geometry.roomSegments(room); }

const parseSeg = (s) => ({ side: s[0], offset: s[0] === "N" || s[0] === "S" ? Number(s.slice(1)) - 1 : s.charCodeAt(1) - 65 });
const css = (c, a = 1) => {
  if (a === 1) return c;
  const m = c.match(/^#([0-9a-f]{6})$/i);
  if (m) { const n = parseInt(m[1], 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; }
  const r = c.match(/^rgba?\(([^)]+)\)$/); if (r) { const p = r[1].split(",").map(Number); return `rgba(${p[0]},${p[1]},${p[2]},${(p[3] ?? 1) * a})`; }
  return c;
};

// ---------- scene construction ----------
// A scene is a list of placed rooms (tile coords) plus corridor tiles.
function buildScene() {
  if (state.scene === "room") {
    const room = rooms.get(state.roomId);
    return { placed: [{ room, tx: 0, ty: 0, doors: state.doors, backed: state.backed }], corridor: [] };
  }
  // Corridor & rooms: a corridor row with three rooms hanging off its south side.
  const base = ["laboratory", "pharmacy", "maintenance-workshop"];
  const picks = (base.includes(state.roomId) ? base : [state.roomId, "laboratory", "pharmacy"]).map((id) => rooms.get(id));
  const placed = []; let x = 1;
  for (const room of picks) {
    const [w] = room.footprint;
    const door = Math.min(w - 1, Math.floor(w / 2));
    placed.push({ room, tx: x, ty: 2, hallNorth: true, doors: new Set([segId("N", door)]), backed: new Set(Array.from({ length: w }, (_, i) => segId("N", i))) });
    x += w;
  }
  const corridor = [];
  for (let cx = 0; cx < x + 1; cx++) corridor.push({ x: cx, y: 1 });
  corridor.push({ x: 0, y: 2 }, { x: 0, y: 3 }); // a short branch going south on the west end
  return { placed, corridor, corridorDoors: placed.map((p) => ({ x: p.tx + parseSeg([...p.doors][0]).offset, y: 1, side: "S" })) };
}

// ---------- painters ----------
function fillRect(g, x, y, w, h, color) { if (w <= 0 || h <= 0) return; g.fillStyle = color; g.fillRect(x, y, w, h); }

function paintFloor(g, room, ox, oy) {
  const k = 120 / room.shell.tilePixels;
  g.save(); g.translate(ox, oy); g.scale(k, k);
  g.beginPath(); g.rect(0, 0, room.footprint[0] * room.shell.tilePixels, room.footprint[1] * room.shell.tilePixels); g.clip();
  for (const p of room.floor) {
    const col = css(p.color, p.alpha ?? 1);
    if (p.shape === "line") {
      g.strokeStyle = col; g.lineWidth = 1; g.beginPath();
      g.moveTo(p.x, p.y); g.lineTo(p.x + p.width, p.y + p.height); g.stroke();
    } else if (p.shape === "ellipse") {
      g.fillStyle = col; g.beginPath();
      // Approved floor ellipses are centre-anchored, like Phaser fillEllipse in the game.
      g.ellipse(p.x, p.y, Math.abs(p.width / 2), Math.abs(p.height / 2), 0, 0, Math.PI * 2); g.fill();
    } else { g.fillStyle = col; g.fillRect(p.x, p.y, p.width, p.height); }
  }
  g.restore();
}

function wallPalette(room, proposed) {
  const s = room.shell, tu = TU.getRoomTouchup(room.definitionId);
  return { wall: s.rearWall, trim: s.baseTrim, dark: s.edgeTrim, wood: s.doorJamb, accent: proposed ? (tu?.accent ?? s.rearWall) : null };
}

// Port of drawApprovedRoomCaps (north wall, side caps, south lip).
// Game room-lab shell model: one tile per wall section, four on each wall.
// Proposed 4x4 floor; established shell proportions and door model.
function paintCaps(g,P,proposed){
 const{room,doors,backed}=P,s=room.shell,[W,H]=room.footprint,pal=wallPalette(room,proposed),unit=s.tilePixels,span=unit,cap=s.sideCapWidthPixels,low=s.southHeightPixels,rear=s.rearWallHeightPixels,inset=s.doorInsetPixels;
 g.save();g.translate(P.ox,P.oy);g.scale(120/unit,120/unit);
 for(let o=0;o<W;o++){
  const left=o*span,isBacked=backed.has(segId('N',o)),height=isBacked?low:rear,top=-height;
  const run=(x,w)=>{if(w<=0)return;if(proposed&&!isBacked)paintProposedWall(g,x,top,w,height,0,pal);else{fillRect(g,x,top,w,height,isBacked?pal.trim:pal.wall);if(!isBacked){fillRect(g,x,-23,w,23,pal.trim);fillRect(g,x,-23,w,4,LIGHT);}else fillRect(g,x,top,w,4,LIGHT);}fillRect(g,x,-7,w,7,pal.dark);};
  if(doors.has(segId('N',o))){run(left,inset);run(left+span-inset,inset);fillRect(g,left+inset-5,top,5,height,pal.wood);fillRect(g,left+span-inset,top,5,height,pal.wood);if(!isBacked)fillRect(g,left+inset-5,top-5,span-inset*2+10,6,pal.wood);}else run(left,span);
  if(!isBacked){fillRect(g,left-1,-rear-9,span+2,9,pal.dark);fillRect(g,left-1,-rear-9,span+2,3,LIGHT);}
 }
 const sideSpan=unit;
 for(const side of ['W','E']){
  const x=side==='W'?-cap+2:W*unit-2,top=backed.has(segId('N',side==='W'?0:W-1))?-low:-rear-9;
  const paint=(y,h)=>{if(h<=0)return;fillRect(g,x,y,cap,h,pal.dark);fillRect(g,x+(side==='W'?cap-3:0),y,3,h,LIGHT);};let cursor=top;
  for(let o=0;o<H;o++){if(!doors.has(segId(side,o)))continue;const doorTop=o*sideSpan+inset,doorH=sideSpan-2*inset;paint(cursor,doorTop-cursor);fillRect(g,x-2,doorTop-3,cap+4,5,pal.wood);fillRect(g,x-2,doorTop+doorH-2,cap+4,5,pal.wood);cursor=doorTop+doorH;}paint(cursor,H*unit+low-cursor);
 }
 g.restore();paintSouth(g,P,proposed);
}


function paintProposedWall(g, x, top, w, height, floorY, pal) {
  for (const [above, h, color] of TU.getTouchupNorthWallBands(pal.accent, height)) fillRect(g, x, floorY - above, w, h, color);
}

function paintSouth(g,P,proposed){
 const{room,doors}=P,s=room.shell,[W,H]=room.footprint,pal=wallPalette(room,proposed),unit=s.tilePixels,span=unit,low=s.southHeightPixels,inset=s.doorInsetPixels,south=H*unit;
 g.save();g.translate(P.ox,P.oy);g.scale(120/unit,120/unit);
 for(let o=0;o<W;o++){const left=o*span,paint=(x,w)=>{fillRect(g,x,south,w,low,CREAM);fillRect(g,x,south+low-8,w,8,pal.trim);fillRect(g,x,south-6,w,8,pal.dark);fillRect(g,x,south-6,w,3,LIGHT);};
  if(doors.has(segId('S',o))){paint(left,inset);paint(left+span-inset,inset);fillRect(g,left+inset-5,south-8,5,low+8,pal.wood);fillRect(g,left+span-inset,south-8,5,low+8,pal.wood);}else paint(left,span);
 }g.restore();
}


// Soft contact shadow where floor meets walls (proposed only).
function paintPrimitives(g, prims, ox, oy, scale = 1) {
  g.save(); g.translate(ox, oy); g.scale(scale, scale);
  for (const p of prims) {
    if (p.shape === "rect") { g.fillStyle = css(p.color, p.alpha); g.fillRect(p.x, p.y, p.width, p.height); continue; }
    g.beginPath();
    if (p.shape === "ellipse") g.ellipse(p.x + p.width / 2, p.y + p.height / 2, Math.abs(p.width / 2), Math.abs(p.height / 2), 0, 0, Math.PI * 2);
    else roundRect(g, p.x, p.y, p.width, p.height, p.radius ?? 0);
    if (p.stroke) { g.strokeStyle = css(p.color, p.alpha); g.lineWidth = p.stroke; g.stroke(); } else { g.fillStyle = css(p.color, p.alpha); g.fill(); }
  }
  g.restore();
}

// ---------- fixtures, decor, actors ----------
function touchupRecords(P, proposed) {
  if (P.room.design) return P.room.records.filter(occupancyOk);
  if (!proposed) return P.room.records.map((r) => ({ ...r, touchupKeepWhenBacked: false }));
  return TU.applyRoomTouchupsToRecords(P.room.definitionId, 0, P.room.footprint[0], P.room.records);
}
function recordVisible(rec, P) { return Geometry.visible(rec, P.doors, P.backed); }
async function resolveSprite(spr) {
  if (!TU.isTouchupFileSprite(spr)) {
    const room = [...rooms.values()].find((x) => x.definitionId === spr.definitionId);
    const r = room?.records.find((x) => x.id === spr.recordId);
    if (!r) { console.warn("no record sprite", spr.definitionId, spr.recordId); return null; }
    return { img: await loadImage(atlasSrc(r.assetId)), src: r.sourceRect };
  }
  const img = await loadImage(`${ART_ROOT}art/rooms/touchup-v1/${spr.file}.png`);
  return img ? { img, src: [0, 0, img.naturalWidth, img.naturalHeight] } : null;
}

function painterY(rec) {
  if (rec.depthPolicy === "authored-layer") return rec.depthKey;
  return rec.worldLocalGround ? rec.worldLocalGround[1] : rec.destinationTopLeftTiles[1] + rec.renderSizeTiles[1];
}

async function collectDrawables(P, proposed) {
  const wall = [], sorted = [], visible = [];
  for (const rec of touchupRecords(P, proposed)) {
    if (!recordVisible(rec, P)) continue;
    visible.push(rec);
    const img = await loadImage(atlasSrc(rec.assetId));
    const [lx, ly] = rec.destinationTopLeftTiles, [w, h] = rec.renderSizeTiles;
    const prepared=PREPARED_METADATA.assets[DESIGN_ASSETS[rec.assetId].preparedId];
    const d={kind:"fixture",id:rec.id,img,src:rec.sourceRect,...Geometry.fixturePlacement(rec,prepared,T,P.ox,P.oy),py:painterY(rec),rec,prepared};
    // Owner direction: kept at full height on a low wall and depth-sorted by
    // its own floor line, so anything north of it draws behind.
    if (TU.isTouchupRecordFloorSortedOnLowWall(rec, P.backed)) { d.py = TU.getTouchupRecordFloorLine(rec); sorted.push(d); }
    else (rec.depthPolicy === "wall" ? wall : sorted).push(d);
  }
  if (proposed) for (const item of TU.getVisibleTouchupDecor(P.room.definitionId, 0, P.room.footprint[0], P.doors, P.backed)) {
    const res = await resolveSprite(TU.TOUCHUP_SPRITES[item.sprite]); if (!res) continue;
    const wT = item.widthTiles, hT = wT * res.src[3] / res.src[2];
    const top = item.kind === "wall" ? item.top : item.y - hT;
    const d = { kind: "decor", id: item.id, img: res.img, src: res.src, x: P.ox + (item.x - wT / 2) * T, y: P.oy + top * T, w: wT * T, h: hT * T, py: item.sortY };
    (item.kind === "wall" ? wall : sorted).push(d);
  }
  if (state.actors) for (const a of actorPlacements(P)) sorted.push(a);
  return { wall, sorted, visible };
}

const CHAR = Object.fromEntries(data.characters.map((c) => [c.id, c]));
function charFor(role) {
  if (/patient|visitor|customer|public|waiting-seat/.test(role)) return /exam|table|procedure|recovery|periop|bed/.test(role) ? "patient.adult.007" : "patient.adult.001";
  if (/surgeon/.test(role)) return "level3-roster-v2.003";
  if (/mri-operator/.test(role)) return "gs026-employee-004";
  if (/nurse|anesth/.test(role)) return "gs026-employee-004";
  return "gs026-employee-001";
}
function actorPlacements(P) { return Geometry.actorPlacements(P,data,state).map(a=>({...a,url:ART_ROOT+a.url})); }

async function drawImageRec(g, d) {
  const img = d.img ?? await loadImage(d.url);
  if (!img) return;
  g.save();
  if (d.alpha) g.globalAlpha = d.alpha;
  if (d.clipTop !== undefined) { g.beginPath(); g.rect(d.x - 2, d.clipTop, d.w + 4, d.y + d.h - d.clipTop + 2); g.clip(); }
  if (d.kind === "actor") g.imageSmoothingEnabled = false;
  if (d.flip) { g.translate(d.x + d.w, d.y); g.scale(-1, 1); }
  const src = d.src ?? [0, 0, img.naturalWidth, img.naturalHeight];
  g.drawImage(img, src[0], src[1], src[2], src[3], d.flip ? 0 : d.x, d.flip ? 0 : d.y, d.w, d.h);
  g.restore();
}

// Generic soft contact shadow for floor furniture (proposed only).

function paintLighting(g, P, drawables) {
  const L = TU.getTouchupLighting(P.room.definitionId, P.room.footprint, P.room.shell, P.doors, P.backed, state.imaging);
  if (!L) return;
  // Back-wall furniture is tinted in full: tint the part above the region.
  for (const d of drawables) {
    if (d.kind !== "fixture" && d.kind !== "decor") continue;
    const cut = P.oy + TU.getTouchupTintTopAt(L, (d.x + d.w / 2 - P.ox) / T);
    if (cut <= d.y + .5) continue;
    const off = document.createElement("canvas"); off.width = Math.ceil(d.w); off.height = Math.ceil(d.h);
    const o = off.getContext("2d"); o.imageSmoothingQuality = "high";
    o.drawImage(d.img, d.src[0], d.src[1], d.src[2], d.src[3], 0, 0, d.w, d.h);
    o.globalCompositeOperation = "multiply"; o.fillStyle = L.color; o.fillRect(0, 0, off.width, off.height);
    o.globalCompositeOperation = "destination-in"; o.drawImage(d.img, d.src[0], d.src[1], d.src[2], d.src[3], 0, 0, d.w, d.h);
    const rows = Math.min(off.height, cut - d.y);
    g.drawImage(off, 0, 0, off.width, rows, d.x, d.y, off.width, rows);
  }
  // Same primitives the game draws: MULTIPLY regions up to the north wall's
  // real height, then SCREEN glows.
  g.save(); g.globalCompositeOperation = "multiply"; paintPrimitives(g, L.regions, P.ox, P.oy); g.restore();
  g.save(); g.globalCompositeOperation = "screen"; paintPrimitives(g, L.glows, P.ox, P.oy); g.restore();
}

// Doors the game refuses today because their inside tile is permanent solid
// furniture. Owner direction (2026-10-07): allow them; that furniture becomes passable.
function passableThroughDoors(P) { return Geometry.passableThroughDoors(P,navFor(P.room)); }

// ---------- routes ----------
function navFor(room) { return data.navigation[room.definitionId]; }
function blockedTiles(P) { const pass=new Set(passableThroughDoors(P).map(x=>x.fixture)); return new Set(navFor(P.room).solidFixtures.filter(f=>!pass.has(f.id)).flatMap(f=>f.blockedTiles.map(t=>t.x+","+t.y))); }

function bfs(P, start, goal, blocked, endpoints) {
  const [W, H] = P.room.footprint, key = (x, y) => `${x},${y}`;
  const prev = new Map([[key(...start), null]]), q = [start];
  while (q.length) {
    const [x, y] = q.shift();
    if (x === goal[0] && y === goal[1]) break;
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = x + dx, ny = y + dy, k = key(nx, ny);
      if (nx < 0 || ny < 0 || nx >= W || ny >= H || prev.has(k)) continue;
      const isGoal = nx === goal[0] && ny === goal[1];
      if (blocked.has(k) && !(isGoal && endpoints.has(k))) continue;
      prev.set(k, [x, y]); q.push([nx, ny]);
    }
  }
  if (!prev.has(key(...goal))) return null;
  const path = []; let cur = goal; while (cur) { path.unshift(cur); cur = prev.get(key(...cur)); }
  return path;
}
function computeRoutes(P) { return Geometry.computeRoutes(P,navFor(P.room),data.previewBaseClearances); }

function designBlockers(P) { return Geometry.designBlockers(P,navFor(P.room)); }
function decorConflicts(P,routes) { return Geometry.decorConflicts(P,navFor(P.room),routes,data.previewBaseClearances); }

// Every wall segment must stay a legal door: any decor in a segment's doorway
// zone (segment span x 0.55 tile inward) must list that segment as an owner.
function doorZoneViolations(P) { return Geometry.doorZoneViolations(P); }

// Owner revision: items never overlap a wall. Floor sprites stay 0.06 tile
// inside the side walls and their floor line 0.10 tile above the south wall;
// wall items stay inside the north wall between the corner caps.
function wallClearanceViolations(P) {
  const [W, H] = P.room.footprint, bad = [];
  for (const item of TU.getRoomTouchup(P.room.definitionId)?.decor ?? []) {
    const left = item.x - item.widthTiles / 2, right = item.x + item.widthTiles / 2;
    if (left < .06 || right > W - .06) bad.push(`${item.id} overlaps a side wall`);
    if (item.kind === "floor" && (item.y ?? 0) > H - .10) bad.push(`${item.id} overlaps the south wall`);
  }
  return bad;
}

function paintRoutes(g, P, routes) {
  const blocked = blockedTiles(P);
  for (const k of blocked) { const [x, y] = k.split(",").map(Number); g.fillStyle = "rgba(176,58,46,.16)"; g.fillRect(P.ox + x * T + 2, P.oy + y * T + 2, T - 4, T - 4); }
  g.save(); g.lineWidth = 3; g.lineCap = "round"; g.lineJoin = "round";
  const colors = ["#1f6fb2", "#c2410c", "#15803d", "#7c3aed", "#b45309", "#0f766e"];
  routes.forEach((r, i) => {
    if (!r.path) return;
    g.strokeStyle = css(colors[i % colors.length], .75); g.beginPath();
    r.path.forEach(([x, y], j) => { const px = P.ox + (x + .5) * T + (i % 3 - 1) * 3, py = P.oy + (y + .5) * T + (i % 3 - 1) * 3; j ? g.lineTo(px, py) : g.moveTo(px, py); });
    g.stroke();
  });
  g.restore();
  for (const item of TU.getVisibleTouchupDecor(P.room.definitionId, 0, P.room.footprint[0], P.doors, P.backed)) {
    if (!item.footprint) continue;
    const f = item.footprint; g.strokeStyle = "rgba(124,58,237,.9)"; g.setLineDash([5, 4]); g.lineWidth = 2;
    g.strokeRect(P.ox + f.left * T, P.oy + f.top * T, f.width * T, f.height * T); g.setLineDash([]);
  }
}

function paintGrid(g, P) {
  const [W, H] = P.room.footprint; g.strokeStyle = "rgba(30,60,120,.35)"; g.lineWidth = 1;
  for (let x = 0; x <= W; x++) { g.beginPath(); g.moveTo(P.ox + x * T + .5, P.oy); g.lineTo(P.ox + x * T + .5, P.oy + H * T); g.stroke(); }
  for (let y = 0; y <= H; y++) { g.beginPath(); g.moveTo(P.ox, P.oy + y * T + .5); g.lineTo(P.ox + W * T, P.oy + y * T + .5); g.stroke(); }
  g.fillStyle = "rgba(30,60,120,.8)"; g.font = "11px system-ui";
  for (const s of roomSegments(P.room)) {
    const { side, offset } = parseSeg(s);
    const x = side === "N" || side === "S" ? P.ox + (offset + .5) * T - 7 : side === "W" ? P.ox + 3 : P.ox + W * T - 20;
    const y = side === "N" ? P.oy + 12 : side === "S" ? P.oy + H * T - 4 : P.oy + (offset + .5) * T;
    g.fillText(s, x, y);
  }
}

// ---------- corridor ----------
function corridorDecor(S) {
  const tiles = new Set(S.corridor.map((t) => `${t.x},${t.y}`)), has = (x, y) => tiles.has(`${x},${y}`);
  const roomAt = (x, y) => S.placed.some((p) => x >= p.tx && x < p.tx + p.room.footprint[0] && y >= p.ty && y < p.ty + p.room.footprint[1]);
  return S.corridor.flatMap((t) => TU.getTouchupCorridorDecor(t, has,
    !has(t.x, t.y - 1) && !roomAt(t.x, t.y - 1), !has(t.x - 1, t.y) && !roomAt(t.x - 1, t.y),
    { north: false, west: false }));
}
function paintCorridor(g, S, ox0, oy0, proposed) {
  const tileSet = new Set(S.corridor.map((t) => `${t.x},${t.y}`));
  const has = (x, y) => tileSet.has(`${x},${y}`);
  const roomAt = (x, y) => S.placed.some((p) => x >= p.tx && x < p.tx + p.room.footprint[0] && y >= p.ty && y < p.ty + p.room.footprint[1]);
  const shell = hallway.shell;
  for (const t of S.corridor) {
    const ox = ox0 + t.x * T, oy = oy0 + t.y * T;
    paintFloor(g, { ...hallway, footprint: [1, 1], floor: hallwayFloor(t) }, ox, oy);
  }
  if (proposed) for (const t of S.corridor) {
    paintPrimitives(g, TU.getTouchupCorridorFloorPrimitives(!has(t.x, t.y - 1) && !roomAt(t.x, t.y - 1)), ox0 + t.x * T, oy0 + t.y * T);
  }
  // exposed north walls (tall) and west/east caps
  const cap = shell.sideCapWidthPixels, rear = shell.rearWallHeightPixels, low = shell.southHeightPixels;
  for (const t of S.corridor) {
    const ox = ox0 + t.x * T, oy = oy0 + t.y * T;
    if (!has(t.x, t.y - 1) && !roomAt(t.x, t.y - 1)) {
      const top = oy - rear;
      if (proposed) paintProposedWall(g, ox, top, T, rear, oy, { accent: TU.TOUCHUP_CORRIDOR.accent });
      else { fillRect(g, ox, top, T, rear, shell.rearWall); fillRect(g, ox, oy - 24, T, 24, shell.baseTrim); }
      fillRect(g, ox - 1, top - 9, T + 2, 9, shell.edgeTrim); fillRect(g, ox - 1, top - 9, T + 2, 3, LIGHT);
    }
    for (const [dx, side] of [[-1, "W"], [1, "E"]]) {
      if (has(t.x + dx, t.y) || roomAt(t.x + dx, t.y)) continue;
      const x = side === "W" ? ox - cap : ox + T;
      fillRect(g, x, oy - (has(t.x, t.y - 1) ? 0 : rear + 9), cap, T + (has(t.x, t.y - 1) ? 0 : rear + 9), shell.edgeTrim);
      fillRect(g, x + (side === "E" ? 0 : cap - 3), oy, 3, T, LIGHT);
    }
    if (!has(t.x, t.y + 1) && !roomAt(t.x, t.y + 1)) {
      const y = oy + T;
      fillRect(g, ox, y, T, low, CREAM); fillRect(g, ox, y + 21, T, 8, shell.baseTrim);
      fillRect(g, ox, y - 6, T, 8, shell.edgeTrim); fillRect(g, ox, y - 6, T, 3, LIGHT);
    }
  }
}
function hallwayFloor(t) {
  // Port of the game's "hallway-phase" floor: phase comes from absolute tile position.
  const sh = hallway.shell, out = [{ shape: "rect", x: 0, y: 0, width: T, height: T, color: sh.floorBase }];
  const tw = 30, th = 24, ox = t.x * T, oy = t.y * T;
  for (let y = 0; y < T; y += th) for (let x = 0; x < T; x += tw) {
    const n = Math.abs(Math.round((ox + x) * 13 + (oy + y) * 7));
    out.push({ shape: "rect", x: x + 1, y: y + 1, width: tw - 2, height: th - 2, color: sh.floorPalette[1 + n % 2] ?? sh.floorBase, alpha: .24 });
    out.push({ shape: "rect", x: x + 6 + n % 17, y: y + 5 + n % 11, width: 1 + n % 2, height: 1, color: n % 2 ? "#ffffff" : "#756f63", alpha: .13 });
    out.push({ shape: "rect", x: x + 4 + (n * 3) % 21, y: y + 4 + (n * 5) % 15, width: 1, height: 1 + n % 2, color: n % 2 ? "#ffffff" : "#756f63", alpha: .13 });
  }
  for (let x = tw; x < T; x += tw) out.push({ shape: "line", x, y: 0, width: 0, height: T, color: "#524e44", alpha: .13 });
  for (let y = th; y < T; y += th) out.push({ shape: "line", x: 0, y, width: T, height: 0, color: "#524e44", alpha: .13 });
  return out;
}

// ---------- main render ----------
async function render(canvas, proposed) {
  const S = buildScene();
  const g = canvas.getContext("2d");
  let minX = 0, minY = 0, maxX = 0, maxY = 0;
  for (const p of S.placed) { maxX = Math.max(maxX, p.tx + p.room.footprint[0]); maxY = Math.max(maxY, p.ty + p.room.footprint[1]); }
  for (const t of S.corridor) { maxX = Math.max(maxX, t.x + 1); maxY = Math.max(maxY, t.y + 1); }
  const marginTop = state.scene === "room" ? 230 : 140, margin = 40, marginBottom = 60;
  canvas.width = Math.round((maxX - minX) * T + margin * 2);
  canvas.height = Math.round((maxY - minY) * T + marginTop + marginBottom);
  const ox0 = margin - minX * T, oy0 = marginTop - minY * T;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.fillStyle = state.scene === "room" ? "#efe7d4" : "#9fb08f"; g.fillRect(0, 0, canvas.width, canvas.height);
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = "high";
  if (S.corridor.length) paintCorridor(g, S, ox0, oy0, proposed);
  const placements = S.placed.map((p) => ({ ...p, ox: ox0 + p.tx * T, oy: oy0 + p.ty * T }));
  const collected = new Map();
  for (const P of placements) collected.set(P, await collectDrawables(P, proposed));
  for (const P of placements) {
    paintFloor(g, P.room, P.ox, P.oy);
    // New art already contains faint contact shadows registered to its real floor
    // anchors. Old generic footprint-bottom ellipses can detach after art fitting.
    if (proposed && !P.room.design) paintPrimitives(g, TU.getTouchupFloorPrimitives(P.room.definitionId, 0, P.room.footprint, P.room.footprint[0], P.doors, collected.get(P).visible), P.ox, P.oy);
  }
  const corridorItems = proposed && S.corridor.length ? corridorDecor(S) : [];
  for (const P of placements) paintCaps(g, P, proposed);
  const sortedAll = [];
  for (const P of placements) {
    const { wall, sorted } = collected.get(P);
    for (const d of wall) await drawImageRec(g, d);
    for (const pr of P.room.procedural ?? []) if (pr.drawPhase === "before-bitmaps" && proceduralVisible(pr, P)) paintProcedural(g, P, pr, proposed);
    for (const d of sorted) sortedAll.push({ ...d, sortY: P.ty + d.py, P });
    for (const pr of P.room.procedural ?? []) if (pr.drawPhase !== "before-bitmaps" && proceduralVisible(pr, P)) sortedAll.push({ kind: "proc", pr, P, sortY: P.ty + pr.depthKey + (pr.drawPhase === "after-scanner-before-console" ? .001 : 0) });
  }
  if (state.actors && S.corridor.length) for (const w of [{ x: 3.55, y: 1.55, dir: "east", id: "patient.adult.001" }, { x: 8.4, y: 1.5, dir: "west", id: "gs026-employee-004" }]) {
    const c = CHAR[w.id], asset = c.poses.stand[w.dir], south = c.poses.stand.south;
    const sc = Math.min(1, data.characterMetrics.visibleHeightCap / (south.anchors.floorY - south.visibleBounds.y));
    const aw = T * data.characterMetrics.widthInTiles * sc, ah = aw * 2;
    sortedAll.push({ kind: "actor", url: ART_ROOT + asset.url, x: ox0 + w.x * T - aw / 2, y: oy0 + w.y * T - ah * (287 / 320), w: aw, h: ah, sortY: w.y + .001, P: null });
  }
  for (const item of corridorItems) {
    const res = await resolveSprite(TU.TOUCHUP_SPRITES[item.sprite]);
    if (!res) continue;
    const wT = item.widthTiles, hT = wT * res.src[3] / res.src[2];
    const top = item.kind === "wall" ? item.top : item.y - hT;
    const d = { kind: "decor", img: res.img, src: res.src, x: ox0 + (item.x - wT / 2) * T, y: oy0 + top * T, w: wT * T, h: hT * T };
    if (item.kind === "wall") await drawImageRec(g, d); else sortedAll.push({ ...d, sortY: item.y, P: null });
  }
  sortedAll.sort((a, b) => a.sortY - b.sortY || (a.kind === "actor") - (b.kind === "actor"));
  for (const d of sortedAll) {
    if (d.kind === "proc") { paintProcedural(g, d.P, d.pr, proposed); continue; }
    await drawImageRec(g, d);
  }
  for (const P of placements) paintSouth(g, P, proposed);
  if (proposed) for (const P of placements) { const c = collected.get(P); paintLighting(g, P, [...c.wall, ...c.sorted]); }
  let statusLines = [], bad = false;
  if (state.scene === "room") for (const P of placements) {
    for (const p of passableThroughDoors(P)) {
      if (p.alreadyAllowed) statusLines.push(`Door ${p.door} uses the frozen layout pass-through rule for ${p.fixture}.`);
      else statusLines.push(proposed ? `Door ${p.door} opens onto the ${p.fixture}: allowed, and characters walk through it.` : `Door ${p.door} is refused in the game today ("conflicts with fixed room furniture").`);
    }
  }
  if (proposed && state.scene === "room") for (const P of placements) {
    const v = doorZoneViolations(P);
    statusLines.push(v.length ? "Door-rule problems: " + v.join("; ") : "Every wall segment can still take a door (new items clear for their doorway)");
    if (v.length) bad = true;
  }
  for (const P of placements) {
    if (state.grid) paintGrid(g, P);
    if (state.routes) {
      const routes = computeRoutes(P); paintRoutes(g, P, routes);
      const missing = routes.filter((r) => !r.path);
      const conflicts = proposed ? decorConflicts(P, routes) : [];
      if (state.scene === "room") {
        statusLines.push(`${routes.length - missing.length}/${routes.length} door→anchor routes reachable`);
        if (missing.length) { bad = true; statusLines.push("Unreachable: " + missing.map((m) => `${m.door}→(${m.target.x},${m.target.y})`).join(", ")); }
        if (proposed) { statusLines.push(conflicts.length ? "Decor conflicts: " + conflicts.join("; ") : "No new decor sits on a live route"); if (conflicts.length) bad = true; }
      }
    }
  }
  if(state.contacts||state.bases||state.routes)for(const P of placements)paintCandidateDiagnostics(g,P,collected.get(P));
  return { statusLines, bad };
}

function proceduralVisible(pr, P) { return !pr.doorOwners.some((o) => P.doors.has(o)) && !pr.backedOwners.some((o) => P.backed.has(o)); }
function paintProcedural(g, P, pr, proposed) {
  const k = T / P.room.shell.tilePixels, r = pr.screenRect, x = P.ox + r.left * k, y = P.oy + r.top * k, w = r.width * k, h = r.height * k, st = pr.style;
  if (st.kind === "design-glass") { paintPrimitives(g, TU.getTouchupGlassPartitionPrimitives({ left: x, top: y, width: w, height: h }), 0, 0); return; }
  if (st.kind === "ct-observation-partition") {
    if (proposed && TU.getRoomTouchup(P.room.definitionId)?.glassPartition) { paintPrimitives(g, TU.getTouchupGlassPartitionPrimitives({ left: x, top: y, width: w, height: h }), 0, 0); return; }
    fillRect(g, x, y, w, h, st.body); fillRect(g, x, y, w, st.highlightHeightPixels, st.topHighlight); fillRect(g, x, y, w, st.darkHeightPixels, st.topDark);
    const wy = y + h * st.windowTopFraction, wh = h * st.windowHeightFraction;
    fillRect(g, x - st.windowOuterHorizontalBleedPixels, wy, w + st.windowOuterHorizontalBleedPixels * 2, wh, st.windowOuter);
    fillRect(g, x - st.windowInnerHorizontalBleedPixels, wy + st.windowInnerVerticalInsetPixels, w + st.windowInnerHorizontalBleedPixels * 2, wh - st.windowInnerVerticalInsetPixels * 2, st.windowInner);
  } else if (st.kind === "recovery-top-cap") {
    fillRect(g, x, y, w, h, st.dark); fillRect(g, x, y, st.lightHeightPixels, h, st.light);
  } else {
    fillRect(g, x, y, w, h, st.face); fillRect(g, x, y + h - st.darkHeightPixels, w, st.darkHeightPixels, st.dark); fillRect(g, x, y + h - st.darkHeightPixels, w, st.lightHeightPixels, st.light);
  }
}
function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }

// ---------- UI ----------
const CORRIDOR_NOTES = [
  "Corridor: deep-green wayfinding stripe, soft wall shadow, two-tone wall.",
  "Benches, plants, art and sanitizer stands hug walls without a doorway on a fixed rhythm keyed to each tile's position, so painting more hallway never reshuffles them. Corridor ends and corners stay clear.",
  "Tall north-wall furniture in the rooms below stays full height and draws in front of anyone walking the corridor beyond it.",
];
const $ = (id) => document.getElementById(id);
const order = ["founders-office", "mri", "pediatric-waiting", "pediatric-exam", "wound-ostomy", "front-desk", "waiting", "examination", "bathroom", "phlebotomy", "telehealth", "evs", "coffee", "minor-procedure", "ultrasound", "xray", "ct", "endoscopy", "recovery", "training", "ambulatory-or", "laboratory", "pharmacy", "maintenance-workshop", "staff-break-room", "surgeons-office", "vending"];
const label = { "founders-office": "Founder's Office (Level 5 design)", "front-desk": "Front Desk", waiting: "Waiting Room", examination: "Examination", bathroom: "Bathroom", phlebotomy: "Phlebotomy", telehealth: "GLP-1 Telehealth", evs: "EVS Closet", coffee: "Coffee Kiosk", "minor-procedure": "Minor Procedure", ultrasound: "Ultrasound", xray: "X-ray", ct: "CT", endoscopy: "Endoscopy", recovery: "Recovery", training: "Training", "ambulatory-or": "Ambulatory OR (L3)", laboratory: "Laboratory (L3)", pharmacy: "Pharmacy (L3)", "maintenance-workshop": "Maintenance Workshop (L3)", "staff-break-room": "Staff Break Room (L3)", "surgeons-office": "Surgeon's Office (L3)", vending: "Vending (L3)", "radiology-reading": "Radiology Reading (L3)", mri: "MRI Room (Level 4 design)", "pediatric-waiting": "Pediatric Waiting (Level 4 design)", "pediatric-exam": "Pediatric Exam (Level 4 design)", "wound-ostomy": "Wound/Ostomy Clinic (Level 4 design)" };
if (!order.includes("radiology-reading")) order.push("radiology-reading");
for (const id of order) if (rooms.has(id)) { const o = document.createElement("option"); o.value = id; o.textContent = `${label[id]} — ${rooms.get(id).footprint.join("×")}`; $("roomSelect").append(o); }
const params = new URLSearchParams(location.search);
if (params.get("room") && rooms.has(params.get("room"))) state.roomId = params.get("room");
// Isolated single-room proof.
// Always painted view.
if (params.get("routes") === "1") state.routes = true;
if (/^[1-5]$/.test(params.get("level") ?? '')) setTier(Number(params.get("level")));
$("roomSelect").value = state.roomId;

function buildRoomControls() {
  const room = rooms.get(state.roomId), [W, H] = room.footprint;
  const bc = $("backedChips"); bc.innerHTML = "";
  for (let i = 0; i < W; i++) {
    const s = segId("N", i), b = document.createElement("button"); b.className = "chip"; b.textContent = s; b.setAttribute("aria-pressed", state.backed.has(s));
    b.onclick = () => { state.backed.has(s) ? state.backed.delete(s) : state.backed.add(s); b.setAttribute("aria-pressed", state.backed.has(s)); draw(); };
    bc.append(b);
  }
  const dg = $("doorGrid"); dg.innerHTML = "";
  for (const [side, name, n] of [["N", "North", W], ["S", "South", W], ["W", "West", H], ["E", "East", H]]) {
    const l = document.createElement("div"); l.className = "lbl"; l.textContent = name; dg.append(l);
    const c = document.createElement("div"); c.className = "chips";
    for (let i = 0; i < n; i++) {
      const s = segId(side, i), b = document.createElement("button"); b.className = "chip"; b.textContent = s; b.setAttribute("aria-pressed", state.doors.has(s));
      if (room.proofId === "front-desk" && side === "S") { b.disabled = true; b.title = "Fixed sidewalk entry wall"; }
      b.onclick = () => { state.doors.has(s) ? state.doors.delete(s) : state.doors.add(s); b.setAttribute("aria-pressed", state.doors.has(s)); draw(); };
      c.append(b);
    }
    dg.append(c);
  }
  $("roomControls").style.display = state.scene === "room" ? "" : "none";
  const notes = $("notes"); notes.innerHTML = "";
  $("occupiedRow").style.display = room.design ? "" : "none";
  for (const n of (room.design ? room.notes : TU.getRoomTouchup(room.definitionId)?.notes ?? [])) { const li = document.createElement("li"); li.textContent = n; notes.append(li); }
  if (state.scene === "building") for (const n of CORRIDOR_NOTES) { const li = document.createElement("li"); li.textContent = n; notes.append(li); }
}
function setPressed(segEl, attr, value) { for (const b of segEl.querySelectorAll("button")) b.setAttribute("aria-pressed", b.dataset[attr] === value); }
$("roomSelect").onchange = (e) => { state.roomId = e.target.value; if (rooms.get(state.roomId)?.design) { state.view = "proposed"; setPressed($("viewSeg"), "view", "proposed"); } state.doors = new Set(); state.backed = new Set(); if (state.roomId === "front-desk") state.doors = new Set(); buildRoomControls(); draw(); };
$("sceneSeg").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; state.scene = b.dataset.scene; setPressed($("sceneSeg"), "scene", state.scene); buildRoomControls(); draw(); };
$("viewSeg").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; state.view = b.dataset.view; setPressed($("viewSeg"), "view", state.view); draw(); };
for (const [id, key] of [["tgActors", "actors"], ["tgRoutes", "routes"], ["tgGrid", "grid"], ["tgImaging", "imaging"], ["tgOccupied", "occupied"]]) { $(id).checked = state[key]; $(id).onchange = (e) => { state[key] = e.target.checked; draw(); }; }
setPressed($("sceneSeg"), "scene", state.scene); setPressed($("viewSeg"), "view", state.view);

let drawToken = 0;
async function draw() {
  document.body.dataset.ready="0";
  const token = ++drawToken;
  $("views").className = "views" + (state.view === "split" ? " split" : "");
  $("canvasA").parentElement.style.display = state.view === "proposed" ? "none" : "";
  $("canvasB").parentElement.style.display = state.view === "current" ? "none" : "";
  const offA = document.createElement("canvas"), offB = document.createElement("canvas");
  const [resA, resB] = await Promise.all([render(offA, false), render(offB, true)]);
  if (token !== drawToken) return;
  for (const [c, off] of [[$("canvasA"), offA], [$("canvasB"), offB]]) { c.width = off.width; c.height = off.height; c.getContext("2d").drawImage(off, 0, 0); }
  const st = $("status");
  const backedTxt = state.backed.size ? `room north of ${[...state.backed].join(", ")}` : "no room to the north";
  const lines = state.scene === "room" ? [`${label[state.roomId]} · doors: ${state.doors.size ? [...state.doors].join(", ") : "none"} · ${backedTxt}`] : ["Corridor with three rooms on its south side; each room's north wall is low."];
  lines.push(...(state.view === "current" ? resA.statusLines : resB.statusLines));
  st.textContent = lines.join("\n"); st.className = "status" + (resB.bad ? " bad" : "");
  document.body.dataset.ready = "1";
}
buildRoomControls();
draw();
function check(roomId,doors,backed) { const room=rooms.get(roomId);return Geometry.check(room,navFor(room),doors,backed,data.previewBaseClearances); }
window.__lab={check,state,draw,setTier,tiers:DESIGN_TIERS,rooms,data,assets:DESIGN_ASSETS,metadata:PREPARED_METADATA,contract:ASSET_CONTRACT,computeRoutes,actorPlacements,collectDrawables,recordVisible,painterY,buildScene,roomSegments,buildRoomControls,paintCaps,paintFloor,render,drawImageRec};
// Private diagnostics and controls, appended to the frozen-lab renderer clone.
// Proof-only diagnostics, controls and review wording.
function paintCandidateDiagnostics(g,P,collected){
 const cross=(x,y,color,label)=>{g.save();g.strokeStyle=color;g.fillStyle=color;g.lineWidth=1.3;g.beginPath();g.moveTo(x-5,y);g.lineTo(x+5,y);g.moveTo(x,y-5);g.lineTo(x,y+5);g.stroke();g.font='10px system-ui';g.fillText(label,x+6,y-5);g.restore();};
 for(const d of [...collected.wall,...collected.sorted].filter(d=>d.kind==='fixture'&&!d.rec.overlayFor)){
  const m=d.prepared;if(state.bases&&m?.anchorKind==='floor'){const b=m.outputOpaqueBounds;g.save();g.strokeStyle='#b45309';g.setLineDash([3,2]);g.strokeRect(d.x+b.left*d.w/m.canvas[0],d.y+(b.bottom-7)*d.h/m.canvas[1],b.width*d.w/m.canvas[0],8*d.h/m.canvas[1]);g.restore();}
  if(state.contacts&&d.rec.worldLocalGround)cross(P.ox+d.rec.worldLocalGround[0]*T,P.oy+d.rec.worldLocalGround[1]*T,'#b45309',d.id);
 }
 if(state.contacts&&state.actors)for(const a of actorPlacements(P))cross(P.ox+a.seat.x*T,P.oy+a.seat.y*T,'#7c3aed',a.id);
 if(state.routes){g.save();g.strokeStyle='#7c3aed';g.setLineDash([4,3]);for(const b of Geometry.fineBlockers(P,navFor(P.room),data.previewBaseClearances)){const f=b.footprint;g.strokeRect(P.ox+f.left*T,P.oy+f.top*T,f.width*T,f.height*T);}g.restore();for(const r of computeRoutes(P).filter(r=>r.seatingTransition)){const t=r.seatingTransition;g.save();g.strokeStyle='#0f766e';g.setLineDash([2,3]);g.beginPath();g.moveTo(P.ox+t.fromWorld[0]*T,P.oy+t.fromWorld[1]*T);g.lineTo(P.ox+t.toWorld[0]*T,P.oy+t.toWorld[1]*T);g.stroke();g.restore();}}
}
function contactText(){return 'Real founder.01 faces south behind the desk; real adult visitor .007 faces north.\nBoth use the same 45 px cushion rise and fixed anchors in all five tiers.\nFounder renders behind armrests and desk; visitor renders behind the camera-side chair back.\nSolid lines are radius-clear walks; dotted teal links are static seat contacts.\nTwelve one-tile wall sections; no furniture pass-through exceptions.';}
function refreshCandidateControls(){
 buildRoomControls();for(const[id,key]of [['tgActors','actors'],['tgVisitor','visitors'],['tgFounder','founders'],['tgRoutes','routes'],['tgGrid','grid'],['tgContacts','contacts'],['tgBases','bases']])$(id).checked=state[key];
 const tier=DESIGN_TIERS.find(t=>t.level===state.tier);for(let n=1;n<=5;n++)$('tier'+n).setAttribute('aria-pressed',n===state.tier);
 $('tierDescription').textContent=tier.summary;$('tierHeading').textContent='Level '+state.tier+' · '+tier.name+' · owner review pending';
 $('artStatus').textContent=PREPARED_METADATA.mode==='stand-in'?'Prepaint geometry stand-ins · shared 3 × 3 layout':'Level '+state.tier+' of 5 · '+tier.name+' · complete painted appearance · owner approval pending';$('contactStatus').textContent=state.contacts?contactText():'';$('contactStatus').hidden=!state.contacts;
}
for(let n=1;n<=5;n++)$('tier'+n).onclick=async()=>{setTier(n);refreshCandidateControls();await draw();};
for(const[id,key]of [['tgVisitor','visitors'],['tgFounder','founders'],['tgContacts','contacts'],['tgBases','bases']])$(id).onchange=async e=>{state[key]=e.target.checked;refreshCandidateControls();await draw();};
const northSections=()=>roomSegments(rooms.get(state.roomId)).filter(s=>s[0]==='N');
for(const[id,key,all]of [['allDoors','doors',true],['closeDoors','doors',false],['allBacked','backed',true],['clearBacked','backed',false]])$(id).onclick=async()=>{state[key]=new Set(all?(key==='doors'?roomSegments(rooms.get(state.roomId)):northSections()):[]);refreshCandidateControls();await draw();};
document.addEventListener('keydown',async e=>{
 const target=e.target,editing=target?.isContentEditable||/SELECT|TEXTAREA/.test(target?.tagName??'')||(target?.tagName==='INPUT'&&!['checkbox','radio','button'].includes(target.type));if(e.altKey||e.ctrlKey||e.metaKey||e.repeat||editing)return;
 const key=e.key.toLowerCase(),toggles={g:'grid',r:'routes',a:'actors',p:'visitors',v:'founders',c:'contacts',f:'bases'};
 if(/^[1-5]$/.test(key))setTier(Number(key));else if(key==='arrowright'||key==='arrowdown')setTier(state.tier%5+1);else if(key==='arrowleft'||key==='arrowup')setTier((state.tier+3)%5+1);else if(toggles[key])state[toggles[key]]=!state[toggles[key]];else if(key==='d')state.doors=state.doors.size===roomSegments(rooms.get(state.roomId)).length?new Set():new Set(roomSegments(rooms.get(state.roomId)));else if(key==='b')state.backed=state.backed.size===northSections().length?new Set():new Set(northSections());else if(key==='escape'){setTier(1);Object.assign(state,{doors:new Set(),backed:new Set(),actors:true,visitors:true,founders:true,grid:false,routes:false,contacts:false,bases:false});}else return;
 e.preventDefault();refreshCandidateControls();await draw();
});
window.__lab.refreshControls=refreshCandidateControls;window.__lab.contactText=contactText;refreshCandidateControls();
