// Room Touch-up Lab renderer. Canvas 2D port of the game's approved-room
// shell painter (FacilityScene.drawApprovedRoomCaps and related), fed by the
// game's own exported room data. Touch-ups come from the game's own module
// apps/player/src/facility/roomTouchups.ts (bundled to ../build/room-touchups.mjs),
// so the preview and the game share one source.
import * as TU from "./room-touchups.mjs";
import { DESIGN_ASSETS, DESIGN_NAVIGATION, DESIGN_ROOMS, PREPARED_METADATA, ASSET_CONTRACT } from "./design-rooms.js";

const T = 120; // shell pixels per tile, same as the game's approved proofs
const ART_ROOT = "";
const LIGHT = "#789173", CREAM = "#efe1bd";
const ACTOR_RADIUS = 0.18;

const state = {
  scene: "room", view: "proposed", roomId: "mri",
  operator: true, seatMode: "baseline", contacts: false, bases: false,
  doors: new Set(), backed: new Set(),
  actors: true, routes: false, grid: false, imaging: true, patientSeated: true,
};

const data = await (await fetch("./data.json")).json();
const rooms = new Map(data.rooms.filter((r) => r.proofId !== "hallway").map((r) => [r.proofId, r]));
// Design-only rooms (not in the game yet) render, route and validate the same way.
for (const room of DESIGN_ROOMS) rooms.set(room.proofId, room);
Object.assign(data.navigation, DESIGN_NAVIGATION);
const hallway = data.rooms.find((r) => r.proofId === "hallway");
const images = new Map();

function loadImage(src) {
  if (images.has(src)) return images.get(src);
  const p = new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => { console.warn("missing", src); resolve(null); };
    img.src = src;
  });
  images.set(src, p);
  return p;
}
const atlasSrc = (assetId, proposed = true) => DESIGN_ASSETS[assetId] ? (proposed ? DESIGN_ASSETS[assetId].candidateSrc : DESIGN_ASSETS[assetId].src) : ART_ROOT + data.atlases[assetId].raw.relativePath;
const occupancyOk = (item) => !item.occupancy || item.occupancy === (state.patientSeated ? "seated" : "standing");

// ---------- geometry helpers ----------
const segId = (side, offset) => side === "N" || side === "S" ? `${side}${offset + 1}` : `${side}${String.fromCharCode(65 + offset)}`;
function roomSegments(room) {
  const [w, h] = room.footprint, out = [];
  for (let i = 0; i < w; i++) out.push(segId("N", i));
  for (let i = 0; i < w; i++) out.push(segId("S", i));
  for (let i = 0; i < h; i++) out.push(segId("W", i));
  for (let i = 0; i < h; i++) out.push(segId("E", i));
  return out;
}
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
function paintCaps(g, P, proposed) {
  const { room, doors, backed } = P, s = room.shell, ox = 0, oy = 0, T = s.tilePixels;
  g.save(); g.translate(P.ox, P.oy); g.scale(120 / T, 120 / T);
  const [W, H] = room.footprint;
  const cap = s.sideCapWidthPixels, low = s.southHeightPixels, rear = s.rearWallHeightPixels, inset = s.doorInsetPixels;
  const pal = wallPalette(room, proposed);
  const isFront = room.definitionId === "room.front_desk";
  const nb = 23;
  for (let o = 0; o < W; o++) {
    const left = ox + o * T, isBacked = backed.has(segId("N", o));
    const height = isBacked ? low : rear, top = oy - height;
    const opening = doors.has(segId("N", o));
    const run = (x, w) => {
      if (w <= 0) return;
      if (proposed && isBacked && P.hallNorth) {
        // The hallway's own south wall: dark cap, cream face, green base.
        fillRect(g, x, top, w, height, CREAM);
        fillRect(g, x, oy - 8, w, 8, pal.trim);
        fillRect(g, x, top, w, 8, pal.dark);
        fillRect(g, x, top, w, 3, LIGHT);
        return;
      }
      if (proposed && !isBacked) paintProposedWall(g, x, top, w, height, oy, pal);
      else {
        fillRect(g, x, top, w, height, isBacked && !isFront ? pal.trim : pal.wall);
        if (!isBacked) { fillRect(g, x, oy - nb, w, nb, pal.trim); fillRect(g, x, oy - nb, w, 4, LIGHT); }
        else if (isFront) fillRect(g, x, top, w, 8, pal.trim);
        else fillRect(g, x, top, w, 4, LIGHT);
      }
      fillRect(g, x, oy - 7, w, 7, pal.dark);
    };
    if (opening) {
      run(left, inset); run(left + T - inset, inset);
      fillRect(g, left + inset - 5, top, 5, height, pal.wood);
      fillRect(g, left + T - inset, top, 5, height, pal.wood);
      if (!isBacked) fillRect(g, left + inset - 5, top - 5, T - inset * 2 + 10, 6, pal.wood);
    } else run(left, T);
    if (!isBacked) { fillRect(g, left - 1, oy - rear - 9, T + 2, 9, pal.dark); fillRect(g, left - 1, oy - rear - 9, T + 2, 3, LIGHT); }
  }
  for (const side of ["W", "E"]) {
    const x = side === "W" ? ox - cap + 2 : ox + W * T - 2;
    const top = backed.has(segId("N", side === "W" ? 0 : W - 1)) ? oy - low : oy - rear - 9;
    const paintCap = (y, h) => { if (h <= 0) return; fillRect(g, x, y, cap, h, pal.dark); fillRect(g, x + (side === "W" ? cap - 3 : 0), y, 3, h, LIGHT); };
    let cursor = top;
    for (let o = 0; o < H; o++) {
      if (!doors.has(segId(side, o))) continue;
      const doorTop = oy + o * T + inset, doorH = T - inset * 2;
      paintCap(cursor, doorTop - cursor);
      fillRect(g, x - 2, doorTop - 3, cap + 4, 5, pal.wood);
      fillRect(g, x - 2, doorTop + doorH - 2, cap + 4, 5, pal.wood);
      cursor = doorTop + doorH;
    }
    paintCap(cursor, oy + H * T + low - cursor);
  }
  g.restore();
  paintSouth(g, P, proposed);
}

function paintProposedWall(g, x, top, w, height, floorY, pal) {
  for (const [above, h, color] of TU.getTouchupNorthWallBands(pal.accent, height)) fillRect(g, x, floorY - above, w, h, color);
}

function paintSouth(g, P, proposed) {
  const { room, doors } = P, s = room.shell, ox = 0, oy = 0, T = s.tilePixels;
  g.save(); g.translate(P.ox, P.oy); g.scale(120 / T, 120 / T);
  const [W, H] = room.footprint, low = s.southHeightPixels, inset = s.doorInsetPixels;
  const pal = wallPalette(room, proposed), southY = oy + H * T;
  const backedSouth = P.backedSouth ?? new Set();
  for (let o = 0; o < W; o++) {
    if (backedSouth.has(o)) continue;
    if (room.definitionId === "room.front_desk" && o === 2) continue;
    const left = ox + o * T;
    const paint = (x, w) => {
      fillRect(g, x, southY, w, low, CREAM);
      fillRect(g, x, southY + low - 8, w, 8, pal.trim);
      fillRect(g, x, southY - 6, w, 8, pal.dark);
      fillRect(g, x, southY - 6, w, 3, LIGHT);
    };
    if (doors.has(segId("S", o))) {
      paint(left, inset); paint(left + T - inset, inset);
      fillRect(g, left + inset - 5, southY - 8, 5, low + 8, pal.wood);
      fillRect(g, left + T - inset, southY - 8, 5, low + 8, pal.wood);
    } else paint(left, T);
  }
  if (room.definitionId === "room.front_desk") {
    const entryLeft = ox + T * 2;
    fillRect(g, entryLeft + 5, southY - 2, T - 10, 5, "#ccb783");
    for (const jx of [entryLeft - 12, entryLeft + T]) {
      fillRect(g, jx, southY - 13, 12, 42, CREAM);
      fillRect(g, jx, southY + 20, 12, 9, pal.trim);
      fillRect(g, jx - 2, southY - 16, 16, 7, pal.dark);
    }
  }
  g.restore();
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
function recordVisible(rec, P) { return TU.isTouchupRecordVisible(rec, P.doors, P.backed); }
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
    const img = await loadImage(atlasSrc(rec.assetId, proposed));
    const [lx, ly] = rec.destinationTopLeftTiles, [w, h] = rec.renderSizeTiles;
    const d = { kind: "fixture", id: rec.id, img, src: rec.sourceRect, x: P.ox + lx * T, y: P.oy + ly * T, w: w * T, h: h * T, py: painterY(rec), rec };
    const prepared = PREPARED_METADATA.assets[rec.assetId.split(":").at(-1)];
    if (proposed && prepared && rec.worldLocalGround) {
      d.x = P.ox + rec.worldLocalGround[0] * T - prepared.canvasAnchor[0] * d.w / prepared.canvas[0];
      d.y = P.oy + rec.worldLocalGround[1] * T - prepared.canvasAnchor[1] * d.h / prepared.canvas[1];
      d.nativeGroundAnchor = prepared.canvasAnchor;
    }
    // Owner direction: kept at full height on a low wall and depth-sorted by
    // its own floor line, so anything north of it draws behind.
    if (TU.isTouchupRecordFloorSortedOnLowWall(rec, P.backed)) { d.py = prepared && rec.worldLocalGround ? rec.worldLocalGround[1] : TU.getTouchupRecordFloorLine(rec); sorted.push(d); }
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
function actorPlacements(P) {
  const out = [];
  const sups = (Array.isArray(P.room.supports) ? P.room.supports : []).filter(occupancyOk);
  for (const s of sups) {
    if (s.id === "operator" && !state.operator) continue;
    const seat = s.id === "operator" && state.seatMode === "brief" ? { ...s.seat, y: s.ground.y - .375 } : s.seat;
    const id = s.character ?? charFor(s.role);
    const c = CHAR[id]; if (!c) continue;
    const pose = s.pose === "standing" ? "stand" : "sit";
    const dir = s.facing ?? "south";
    const asset = c.poses[pose]?.[dir] ?? c.poses.stand.south;
    const south = c.poses.stand.south;
    const scale = Math.min(1, data.characterMetrics.visibleHeightCap / (south.anchors.floorY - south.visibleBounds.y));
    const w = T * data.characterMetrics.widthInTiles * scale, h = w * 2;
    const anchorY = pose === "sit" && asset.anchors.seatContactY ? asset.anchors.seatContactY : asset.anchors.floorY;
    const x = P.ox + seat.x * T - w * (asset.anchors.bodyAxisX / 160);
    const y = P.oy + seat.y * T - h * (anchorY / 320);
    const py = s.painterDepth ?? (s.pose === "standing" ? s.ground.y : Math.max(s.ground.y, s.fixtureGround?.y ?? s.ground.y));
    out.push({ kind: "actor", id: s.id, url: ART_ROOT + asset.url, x, y, w, h, py: py + 0.0001, shadow: { x: P.ox + s.ground.x * T, y: P.oy + s.ground.y * T, r: w * .28 } });
  }
  return out;
}

async function drawImageRec(g, d) {
  const img = d.img ?? await loadImage(d.url);
  if (!img) return;
  g.save();
  if (d.alpha) g.globalAlpha = d.alpha;
  if (d.clipTop !== undefined) { g.beginPath(); g.rect(d.x - 2, d.clipTop, d.w + 4, d.y + d.h - d.clipTop + 2); g.clip(); }
  if (d.rec?.clipRightWorld !== undefined) {
    const right=d.x+(d.rec.clipRightWorld-d.rec.destinationTopLeftTiles[0])*T;
    g.beginPath(); g.rect(d.x-2,d.y-2,Math.max(0,right-d.x+2),d.h+4); g.clip();
  }
  if (d.kind === "actor") g.imageSmoothingEnabled = false;
  if (d.flip) { g.translate(d.x + d.w, d.y); g.scale(-1, 1); }
  const src = d.src ?? [0, 0, img.naturalWidth, img.naturalHeight];
  g.drawImage(img, src[0], src[1], src[2], src[3], d.flip ? 0 : d.x, d.flip ? 0 : d.y, d.w, d.h);
  g.restore();
}

// Generic soft contact shadow for floor furniture (proposed only).

function paintLighting(g, P, drawables) {
  if (P.room.definitionId === "room.mri") return; // Owner: MRI never dims.
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
function passableThroughDoors(P) {
  const nav = navFor(P.room); if (!nav) return [];
  const [W, H] = P.room.footprint, out = [];
  const exc = new Set((nav.doorThresholdExceptions ?? []).map((e) => segId(e.side[0].toUpperCase(), e.offset)));
  for (const s of P.doors) {
    const { side, offset } = parseSeg(s);
    const t = side === "N" ? [offset, 0] : side === "S" ? [offset, H - 1] : side === "W" ? [0, offset] : [W - 1, offset];
    for (const f of nav.solidFixtures) {
      if (!f.blockedTiles.some((b) => b.x === t[0] && b.y === t[1])) continue;
      if ((f.hiddenByDoorSlots ?? []).some((d) => segId(d.side[0].toUpperCase(), d.offset) === s)) continue;
      out.push({ door: s, fixture: f.id, alreadyAllowed: exc.has(s) });
    }
  }
  return out;
}

// ---------- routes ----------
function navFor(room) { return data.navigation[room.definitionId]; }
function blockedTiles(P) {
  const nav = navFor(P.room); const set = new Set();
  if (!nav) return set;
  for (const f of nav.solidFixtures) {
    if ((f.hiddenByDoorSlots ?? []).some((d) => P.doors.has(segId(d.side[0].toUpperCase(), d.offset)))) continue;
    for (const t of f.blockedTiles) set.add(`${t.x},${t.y}`);
  }
  for (const s of P.doors) { const { side, offset } = parseSeg(s); const [W, H] = P.room.footprint; const t = side === "N" ? [offset, 0] : side === "S" ? [offset, H - 1] : side === "W" ? [0, offset] : [W - 1, offset]; set.delete(t.join(",")); }
  return set;
}
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
function computeRoutes(P) {
  const nav = navFor(P.room); if (!nav) return [];
  const blocked = blockedTiles(P), [W, H] = P.room.footprint;
  const endpoints = new Set(nav.solidFixtures.flatMap((f) => (f.endpointOnlyContacts ?? []).map((t) => `${t.x},${t.y}`)));
  const targets = [nav.primaryAnchor, nav.staffAnchor, nav.patientCareAnchor, nav.clinicianCareAnchor, ...(nav.waitingAnchors ?? []), ...(nav.careStations ?? []).map((c) => c.patientAnchor)].filter(Boolean);
  const out = [];
  for (const s of P.doors) {
    const { side, offset } = parseSeg(s);
    const inside = side === "N" ? [offset, 0] : side === "S" ? [offset, H - 1] : side === "W" ? [0, offset] : [W - 1, offset];
    const outside = side === "N" ? [offset, -0.6] : side === "S" ? [offset, H - 0.4] : side === "W" ? [-0.6, offset] : [W - 0.4, offset];
    for (const t of targets) {
      const p = bfs(P, inside, [t.x, t.y], blocked, endpoints);
      out.push({ door: s, target: t, path: p ? [[outside[0], outside[1]], ...p] : null });
    }
  }
  return out;
}
function designBlockers(P) {
  if (!P.room.design) return [];
  // Owner rule: furniture standing in an open doorway is walked through, so a
  // solid whose blocked tile is an open door's inside tile is passable.
  const [W, H] = P.room.footprint, nav = navFor(P.room);
  const doorInside = new Set([...P.doors].map((s) => { const { side, offset } = parseSeg(s); return (side === "N" ? [offset, 0] : side === "S" ? [offset, H - 1] : side === "W" ? [0, offset] : [W - 1, offset]).join(","); }));
  const passable = (id) => (nav?.solidFixtures ?? []).some((f) => f.id === id && f.blockedTiles.some((t) => doorInside.has(`${t.x},${t.y}`)));
  const solids = P.room.solids.filter((x) => !x.endpoint && !passable(x.id)).map((x) => ({ id: x.id, footprint: x.footprint, owners: [] }));
  const items = P.room.records.filter((r) => r.footprint && occupancyOk(r)).map((r) => ({ id: r.id, footprint: r.footprint, owners: r.doorOwners }));
  return [...solids, ...items].filter((x) => !x.owners.some((o) => P.doors.has(o)));
}
function decorConflicts(P, routes) {
  const bad = [];
  for (const item of [...TU.getVisibleTouchupDecor(P.room.definitionId, 0, P.room.footprint[0], P.doors, P.backed), ...designBlockers(P)]) {
    if (!item.footprint) continue;
    const f = item.footprint, l = f.left - ACTOR_RADIUS, r = f.left + f.width + ACTOR_RADIUS, t = f.top - ACTOR_RADIUS, b = f.top + f.height + ACTOR_RADIUS;
    for (const route of routes) {
      if (!route.path) continue;
      for (let i = 1; i < route.path.length; i++) {
        const [ax, ay] = route.path[i - 1].map((v) => v + .5), [bx, by] = route.path[i].map((v) => v + .5);
        for (let k = 0; k <= 40; k++) { /* 0.025-tile steps along each 1-tile leg */
          const x = ax + (bx - ax) * k / 40, y = ay + (by - ay) * k / 40;
          if (x > l && x < r && y > t && y < b) { bad.push(`${item.id} blocks ${route.door}→(${route.target.x},${route.target.y})`); k = 41; i = 1e9; }
        }
      }
    }
  }
  return [...new Set(bad)];
}

// Every wall segment must stay a legal door: any decor in a segment's doorway
// zone (segment span x 0.55 tile inward) must list that segment as an owner.
function doorZoneViolations(P) {
  const [W, H] = P.room.footprint, bad = [];
  const DEPTH = .55;
  const designItems = P.room.design ? P.room.records.filter((r) => r.footprint || r.depthPolicy === "wall").map((r) => ({
    id: r.id, kind: r.depthPolicy === "wall" && !r.footprint ? "wall" : "floor", owners: r.doorOwners, footprint: r.footprint,
    x: r.destinationTopLeftTiles[0] + r.renderSizeTiles[0] / 2, widthTiles: r.renderSizeTiles[0],
  })) : [];
  for (const item of [...(TU.getRoomTouchup(P.room.definitionId)?.decor ?? []), ...designItems]) {
    for (const seg of roomSegments(P.room)) {
      if ((item.owners ?? []).includes(seg)) continue;
      const { side, offset } = parseSeg(seg);
      if (item.kind === "wall") {
        if (side !== "N") continue;
        const w = item.widthTiles;
        if (item.x + w / 2 > offset + .08 && item.x - w / 2 < offset + .92) bad.push(`${item.id} on wall ${seg}`);
        continue;
      }
      const f = item.footprint; if (!f) continue;
      const z = side === "N" ? [offset + .12, 0, .76, DEPTH] : side === "S" ? [offset + .12, H - DEPTH, .76, DEPTH]
        : side === "W" ? [0, offset + .12, DEPTH, .76] : [W - DEPTH, offset + .12, DEPTH, .76];
      if (f.left < z[0] + z[2] && f.left + f.width > z[0] && f.top < z[1] + z[3] && f.top + f.height > z[1]) bad.push(`${item.id} in ${seg} doorway`);
    }
  }
  return bad;
}

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
    if (proposed) paintPrimitives(g, TU.getTouchupFloorPrimitives(P.room.design ? "room.evs_closet" : P.room.definitionId, 0, P.room.footprint, P.room.footprint[0], P.doors, collected.get(P).visible), P.ox, P.oy);
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
      if (p.alreadyAllowed) statusLines.push(`Door ${p.door} opens onto the ${p.fixture}; the game already allows it.`);
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
  if (state.contacts || state.bases) for (const P of placements) paintCandidateDiagnostics(g, P, proposed);
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
const order = ["mri", "pediatric-waiting", "pediatric-exam", "wound-ostomy", "front-desk", "waiting", "examination", "bathroom", "phlebotomy", "telehealth", "evs", "coffee", "minor-procedure", "ultrasound", "xray", "ct", "endoscopy", "recovery", "training", "ambulatory-or", "laboratory", "pharmacy", "maintenance-workshop", "staff-break-room", "surgeons-office", "vending"];
const label = { "front-desk": "Front Desk", waiting: "Waiting Room", examination: "Examination", bathroom: "Bathroom", phlebotomy: "Phlebotomy", telehealth: "GLP-1 Telehealth", evs: "EVS Closet", coffee: "Coffee Kiosk", "minor-procedure": "Minor Procedure", ultrasound: "Ultrasound", xray: "X-ray", ct: "CT", endoscopy: "Endoscopy", recovery: "Recovery", training: "Training", "ambulatory-or": "Ambulatory OR (L3)", laboratory: "Laboratory (L3)", pharmacy: "Pharmacy (L3)", "maintenance-workshop": "Maintenance Workshop (L3)", "staff-break-room": "Staff Break Room (L3)", "surgeons-office": "Surgeon's Office (L3)", vending: "Vending (L3)", "radiology-reading": "Radiology Reading (L3)", mri: "MRI Room (Level 4 design)", "pediatric-waiting": "Pediatric Waiting (Level 4 design)", "pediatric-exam": "Pediatric Exam (Level 4 design)", "wound-ostomy": "Wound/Ostomy Clinic (Level 4 design)" };
if (!order.includes("radiology-reading")) order.push("radiology-reading");
for (const id of order) if (rooms.has(id)) { const o = document.createElement("option"); o.value = id; o.textContent = `${label[id]} — ${rooms.get(id).footprint.join("×")}`; $("roomSelect").append(o); }
const params = new URLSearchParams(location.search);
if (params.get("room") && rooms.has(params.get("room"))) state.roomId = params.get("room");
// MRI candidate stays a single room; north backing is independently controlled.
if (params.get("view")) state.view = params.get("view");
if (params.get("routes") === "1") state.routes = true;
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
  $("patientRow").style.display = room.design ? "" : "none";
  for (const n of (room.design ? room.notes : TU.getRoomTouchup(room.definitionId)?.notes ?? [])) { const li = document.createElement("li"); li.textContent = n; notes.append(li); }
  if (state.scene === "building") for (const n of CORRIDOR_NOTES) { const li = document.createElement("li"); li.textContent = n; notes.append(li); }
}
function setPressed(segEl, attr, value) { for (const b of segEl.querySelectorAll("button")) b.setAttribute("aria-pressed", b.dataset[attr] === value); }
$("roomSelect").onchange = (e) => { state.roomId = e.target.value; if (rooms.get(state.roomId)?.design) { state.view = "proposed"; setPressed($("viewSeg"), "view", "proposed"); } state.doors = new Set(); state.backed = new Set(); if (state.roomId === "front-desk") state.doors = new Set(); buildRoomControls(); draw(); };
$("sceneSeg").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; state.scene = b.dataset.scene; setPressed($("sceneSeg"), "scene", state.scene); buildRoomControls(); draw(); };
$("viewSeg").onclick = (e) => { const b = e.target.closest("button"); if (!b) return; state.view = b.dataset.view; setPressed($("viewSeg"), "view", state.view); draw(); };
for (const [id, key] of [["tgActors", "actors"], ["tgRoutes", "routes"], ["tgGrid", "grid"], ["tgImaging", "imaging"], ["tgPatientSeated", "patientSeated"]]) { $(id).checked = state[key]; $(id).onchange = (e) => { state[key] = e.target.checked; draw(); }; }
setPressed($("sceneSeg"), "scene", state.scene); setPressed($("viewSeg"), "view", state.view);

let drawToken = 0;
async function draw() {
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
function check(roomId, doors, backed) {
  const room = rooms.get(roomId);
  const P = { room, tx: 0, ty: 0, ox: 0, oy: 0, doors: new Set(doors), backed: new Set(backed) };
  const routes = computeRoutes(P);
  return { unreachable: routes.filter((r) => !r.path).map((r) => `${r.door}->(${r.target.x},${r.target.y})`), conflicts: decorConflicts(P, routes), doorZone: [...doorZoneViolations(P), ...wallClearanceViolations(P)], routes: routes.length };
}
window.__lab = { assets: DESIGN_ASSETS, paintCaps, paintFloor, actorPlacements, collectDrawables, recordVisible, painterY, metadata: PREPARED_METADATA, contract: ASSET_CONTRACT, check, passableThroughDoors, state, draw, rooms, data, computeRoutes, decorConflicts, doorZoneViolations, buildScene, roomSegments };

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
