import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createCanvas } from "@napi-rs/canvas";

const SIZE = 960;
const OUT = resolve("apps/player/public/art/rooms/examination-v2");
mkdirSync(OUT, { recursive: true });

const C = {
  ink: "#20282a", deepest: "#172023", deep: "#303a3c", wall: "#4b5a5f",
  wallMid: "#5d696b", trim: "#75858b", bright: "#d9dbd6",
  paper: "#f0f0ea", floor: "#e4e1d9", grout: "#b9b6ae", shadow: "#273033",
  high: "#f7f7f0", baseboard: "#303a3c", plaster: "#e7e5df", plasterShade: "#d4d5d1",
};

function rect(ctx, x, y, w, h, fill, stroke = null, line = 0) {
  ctx.fillStyle = fill; ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  if (stroke) { ctx.lineWidth = line; ctx.strokeStyle = stroke; ctx.strokeRect(Math.round(x) + line / 2, Math.round(y) + line / 2, Math.round(w) - line, Math.round(h) - line); }
}

function deterministicNoise(x, y) { return ((x * 1103515245) ^ (y * 12345)) >>> 0; }

function drawFloor(ctx, floor) {
  rect(ctx, floor.x + 12, floor.y + 15, floor.width, floor.height, "rgba(23,32,35,.24)");
  rect(ctx, floor.x, floor.y, floor.width, floor.height, C.floor, C.deepest, 9);
  // Broad clinical tile modules instead of a dense construction-grid effect.
  const tile = Math.max(92, Math.floor(Math.min(floor.width, floor.height) / 4));
  for (let x = floor.x + tile; x < floor.x + floor.width; x += tile) {
    ctx.strokeStyle = C.grout; ctx.globalAlpha = 0.82; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x, floor.y + 7); ctx.lineTo(x, floor.y + floor.height - 7); ctx.stroke();
  }
  for (let y = floor.y + tile; y < floor.y + floor.height; y += tile) {
    ctx.strokeStyle = C.grout; ctx.globalAlpha = 0.82; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(floor.x + 7, y); ctx.lineTo(floor.x + floor.width - 7, y); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  for (let y = floor.y + 11; y < floor.y + floor.height - 11; y += 7) {
    for (let x = floor.x + 9; x < floor.x + floor.width - 9; x += 9) {
      const hash = deterministicNoise(x, y);
      if ((hash & 31) > 4) continue;
      rect(ctx, x, y, 1 + ((hash >>> 9) & 1), 1, (hash & 1) ? "rgba(118,112,102,.13)" : "rgba(255,255,250,.19)");
    }
  }
  rect(ctx, floor.x + 8, floor.y + 8, floor.width - 16, 4, "rgba(247,247,240,.78)");
  rect(ctx, floor.x + 8, floor.y + floor.height - 12, floor.width - 16, 4, "rgba(59,67,67,.28)");
}

function drawShell(path, floor) {
  const canvas = createCanvas(SIZE, SIZE); const ctx = canvas.getContext("2d"); ctx.imageSmoothingEnabled = false;
  const rearH = 145, side = 49, lipH = 68;
  const rearTop = floor.y - rearH;
  // Contact shadow belongs to the visual envelope, never the gameplay floor.
  rect(ctx, floor.x - side + 18, floor.y - rearH + 28, floor.width + side * 2, floor.height + lipH + 20, "rgba(23,32,35,.14)");
  rect(ctx, floor.x - side + 12, floor.y - rearH + 20, floor.width + side * 2, floor.height + lipH + 16, "rgba(23,32,35,.11)");
  drawFloor(ctx, floor);
  // Full rear wall, mapped above rather than into the logical floor.
  rect(ctx, floor.x - side, rearTop, floor.width + side * 2, rearH + 18, C.deepest);
  rect(ctx, floor.x - side + 7, rearTop + 7, floor.width + side * 2 - 14, rearH + 4, C.wall);
  rect(ctx, floor.x - side + 12, rearTop + 13, floor.width + side * 2 - 24, 8, C.bright);
  // The rear wall is a light plaster face nested within the dark dollhouse
  // frame, matching the accepted Front Desk's construction rather than a
  // solid slate panel.
  rect(ctx, floor.x - side + 12, rearTop + 25, floor.width + side * 2 - 24, rearH - 42, C.plaster);
  rect(ctx, floor.x - side + 17, rearTop + 30, floor.width + side * 2 - 34, 4, C.high);
  rect(ctx, floor.x - side + 17, rearTop + rearH - 49, floor.width + side * 2 - 34, 4, C.plasterShade);
  // Fine plaster tone/noise makes the upper wall read as a surface, not a block.
  for (let y = rearTop + 35; y < rearTop + rearH - 30; y += 8) {
    for (let x = floor.x - side + 25; x < floor.x + floor.width + side - 25; x += 11) {
      const hash = deterministicNoise(x, y);
      if ((hash & 15) > 3) continue;
      rect(ctx, x, y, 1 + ((hash >>> 4) & 1), 1, (hash & 1) ? "rgba(255,255,250,.42)" : "rgba(75,90,95,.18)");
    }
  }
  rect(ctx, floor.x - side + 12, rearTop + rearH - 30, floor.width + side * 2 - 24, 7, C.deep);
  rect(ctx, floor.x - side + 12, rearTop + rearH - 22, floor.width + side * 2 - 24, 5, C.baseboard);
  rect(ctx, floor.x - side + 12, rearTop + rearH - 17, floor.width + side * 2 - 24, 4, C.ink);
  // Shallow side returns. They are deliberately behind the floor contact area.
  rect(ctx, floor.x - side, rearTop + 4, side, rearH + floor.height - 4, C.deepest);
  rect(ctx, floor.x - side + 7, rearTop + 12, side - 14, rearH + floor.height - 26, C.wall);
  rect(ctx, floor.x - side + 12, rearTop + 18, 5, rearH + floor.height - 38, C.trim);
  rect(ctx, floor.x + floor.width, rearTop + 4, side, rearH + floor.height - 4, C.deepest);
  rect(ctx, floor.x + floor.width + 7, rearTop + 12, side - 14, rearH + floor.height - 26, C.wall);
  rect(ctx, floor.x + floor.width + side - 17, rearTop + 18, 5, rearH + floor.height - 38, "rgba(247,247,240,.28)");
  // Low south cutaway lip. Static shell stays behind actors; renderer repeats this crop later.
  rect(ctx, floor.x - side, floor.y + floor.height - lipH, floor.width + side * 2, lipH + 18, C.deepest);
  rect(ctx, floor.x - side + 7, floor.y + floor.height - lipH + 7, floor.width + side * 2 - 14, lipH + 1, C.wall);
  rect(ctx, floor.x - side + 10, floor.y + floor.height - lipH + 10, floor.width + side * 2 - 20, 6, C.trim);
  rect(ctx, floor.x - side + 10, floor.y + floor.height - 13, floor.width + side * 2 - 20, 5, C.ink);
  // Corner blocks give the cutaway a sturdy dollhouse silhouette.
  for (const x of [floor.x - side, floor.x + floor.width]) {
    rect(ctx, x, rearTop - 12, side + 18, 36, C.deepest);
    rect(ctx, x + 7, rearTop - 5, side + 4, 20, C.wall);
    rect(ctx, x + 11, rearTop - 1, side - 8, 4, C.trim);
  }
  writeFileSync(resolve(OUT, path), canvas.toBuffer("image/png"));
}

drawShell("examination-shell-horizontal-v2.png", { x: 118, y: 270, width: 724, height: 482 });
drawShell("examination-shell-vertical-v2.png", { x: 237, y: 150, width: 482, height: 724 });
