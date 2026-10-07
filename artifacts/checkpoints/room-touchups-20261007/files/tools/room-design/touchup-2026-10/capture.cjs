// Captures lab canvases to PNG for review. Usage:
//   node capture.cjs <outDir> [room ...]  (needs the lab server on 127.0.0.1:4191)
// Options via env: VIEW=current|proposed (default both), GRID=1, ROUTES=1,
// DOORS="N1,WA", BACKED="N1,N2", SCENE=building
const fs = require("fs"), path = require("path");
const { chromium } = require("@playwright/test");
(async () => {
  const [outDir, ...roomArgs] = process.argv.slice(2);
  fs.mkdirSync(outDir, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") errors.push(m.text()); });
  await page.goto("http://127.0.0.1:4191/tools/room-design/touchup-2026-10/lab/touchup-lab.html");
  await page.waitForFunction(() => document.body.dataset.ready === "1");
  const rooms = roomArgs.length ? roomArgs : await page.evaluate(() => [...window.__lab.rooms.keys()]);
  for (const room of rooms) {
    const result = await page.evaluate(async ({ room, env }) => {
      const lab = window.__lab;
      Object.assign(lab.state, {
        roomId: room, scene: env.SCENE || "room", view: "split",
        grid: env.GRID === "1", routes: env.ROUTES === "1",
        doors: new Set((env.DOORS || "").split(",").filter(Boolean)),
        backed: new Set((env.BACKED || "").split(",").filter(Boolean)),
        occupied: env.OCCUPIED === "1",
      });
      document.body.dataset.ready = "0";
      await lab.draw();
      return {
        a: document.getElementById("canvasA").toDataURL("image/png"),
        b: document.getElementById("canvasB").toDataURL("image/png"),
        status: document.getElementById("status").textContent,
      };
    }, { room, env: process.env });
    const tag = process.env.TAG ? `-${process.env.TAG}` : "";
    if (process.env.VIEW !== "proposed") fs.writeFileSync(path.join(outDir, `${room}${tag}-current.png`), Buffer.from(result.a.split(",")[1], "base64"));
    if (process.env.VIEW !== "current") fs.writeFileSync(path.join(outDir, `${room}${tag}-proposed.png`), Buffer.from(result.b.split(",")[1], "base64"));
    console.log(room, "|", result.status.replace(/\n/g, " | "));
  }
  if (errors.length) console.log("PAGE ERRORS:\n" + [...new Set(errors)].join("\n"));
  await browser.close();
})();
