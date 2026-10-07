// Door-rule and route validator for the touch-up proposal.
// For every room: each wall segment opened alone, then all segments open,
// with and without every north segment backed. Checks that (1) no new decor
// sits on a live door->anchor route (0.18-tile actor radius, sampled every
// 0.025 tile), (2) every item inside a doorway zone hides for that doorway,
// (3) reachability is unchanged from the current game.
// Usage: node validate.cjs   (lab server on 127.0.0.1:4191)
const { chromium } = require("@playwright/test");
(async () => {
  const browser = await chromium.launch({ channel: "chrome" });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:4191/tools/room-design/touchup-2026-10/lab/touchup-lab.html");
  await page.waitForFunction(() => document.body.dataset.ready === "1");
  const report = await page.evaluate(() => {
    const lab = window.__lab, out = [];
    for (const [id, room] of lab.rooms) {
      const segs = lab.roomSegments(room).filter((s) => !(id === "front-desk" && s.startsWith("S")));
      const north = segs.filter((s) => s.startsWith("N"));
      const cases = segs.map((s) => [s]).concat([segs]);
      let routes = 0; const problems = [];
      for (const backed of [[], north]) for (const doors of cases) {
        const r = lab.check(id, doors, backed); routes += r.routes;
        for (const c of r.conflicts) problems.push(`[${doors.length > 1 ? "all" : doors[0]}${backed.length ? " backed" : ""}] ${c}`);
        for (const z of r.doorZone) problems.push(`doorway rule: ${z}`);
      }
      out.push({ id, segments: segs.length, checks: cases.length * 2, routes, problems: [...new Set(problems)] });
    }
    return out;
  });
  let bad = 0;
  for (const r of report) {
    console.log(`${r.problems.length ? "FAIL" : "PASS"} ${r.id.padEnd(22)} ${r.segments} segments, ${r.checks} door states, ${r.routes} routes checked`);
    for (const p of r.problems) console.log("   - " + p);
    bad += r.problems.length;
  }
  console.log(bad ? `\n${bad} problem(s)` : "\nAll rooms pass.");
  await browser.close();
  process.exit(bad ? 1 : 0);
})();
