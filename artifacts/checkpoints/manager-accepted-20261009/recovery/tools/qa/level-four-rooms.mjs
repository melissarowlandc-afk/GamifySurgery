import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

// Separate, opt-in QA entry. The normal player entry/balance/launcher is untouched.
const repo = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const player = resolve(repo, "apps/player");
const qaPath = "/level4-rooms-qa.html";
const check = process.argv.includes("--check");
const bootstrap = `/@fs/${resolve(repo, "tools/qa/level-four-rooms-bootstrap.ts").replaceAll("\\", "/")}`;
const server = await createServer({
  root: player,
  configFile: resolve(player, "vite.config.ts"),
  server: { host: "127.0.0.1", port: 5184, strictPort: true, middlewareMode: check },
  plugins: [{
    name: "level-four-rooms-qa-entry",
    configureServer(vite) {
      vite.middlewares.use(async (request, response, next) => {
        if (request.url?.split("?")[0] !== qaPath) return next();
        try {
          const original = await readFile(resolve(player, "index.html"), "utf8");
          const html = original.replace('src="/src/main.tsx"', `src="${bootstrap}"`);
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end(await vite.transformIndexHtml(qaPath, html));
        } catch (error) { next(error); }
      });
    },
  }],
});
if (check) {
  try {
    const entry = await server.transformRequest(bootstrap);
    if (!entry?.code.includes("Level 4 room QA requires")) throw new Error("QA bootstrap did not transform.");
    console.log("QA entry transform PASS: production Vite config/plugins; dedicated bootstrap; no listener or browser storage.");
  } finally { await server.close(); }
} else {
await server.listen();
console.log("M3 room-only QA: http://127.0.0.1:5184/level4-rooms-qa.html");
console.log("Placed preview: http://127.0.0.1:5184/level4-rooms-qa.html?rooms=placed");
console.log("M4 two-APP appointments: http://127.0.0.1:5184/level4-rooms-qa.html?apps=appointments (press Play; then observe Staff/Services)");
console.log("M5 pediatric families: http://127.0.0.1:5184/level4-rooms-qa.html?apps=pediatrics (press Play; watch child/parent waiting and exam seats)");
console.log("M6 MRI: http://127.0.0.1:5184/level4-rooms-qa.html?apps=mri (press Play; watch acquisition, Reading and Services receipts)");
console.log("M6 wound/ostomy: http://127.0.0.1:5184/level4-rooms-qa.html?apps=wound (press Play; watch APP visits and Services receipts)");
console.log("M8 mature Level 3: http://127.0.0.1:5184/level4-rooms-qa.html?state=l3ready (open Goals; click Advance to Level 4)");
console.log("M8 one witness short: http://127.0.0.1:5184/level4-rooms-qa.html?state=l4almost (press Play; finish the wound visit; check Goals and reload)");
console.log("Disposable origin; separate saves from START_GAME.cmd / http://127.0.0.1:4173.");
console.log("Use only the QA URL for this Level 4 fixture, including reloads. Ctrl+C stops the QA server.");
}
