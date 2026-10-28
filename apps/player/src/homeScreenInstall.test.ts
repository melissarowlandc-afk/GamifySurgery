import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { build, normalizePath } from "vite";
import { describe, expect, it } from "vitest";

const playerRoot = fileURLToPath(new URL("..", import.meta.url));
const entry = normalizePath(fileURLToPath(new URL("./main.tsx", import.meta.url)));
const tokens = readFileSync(new URL("./styles/tokens.css", import.meta.url), "utf8");

function tag(html: string, name: "meta" | "link", key: string, value: string) {
  const attributes = [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "g"))]
    .map(([element]) => Object.fromEntries(
      [...element.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, attribute, content]) => [attribute, content]),
    ))
    .find(element => element[key] === value);
  expect(attributes, `${name}[${key}="${value}"]`).toBeDefined();
  return attributes!;
}

function publicFile(url: URL, app: URL) {
  expect(url.origin).toBe(app.origin);
  expect(url.pathname.startsWith(app.pathname)).toBe(true);
  return new URL(`../public/${url.pathname.slice(app.pathname.length)}`, import.meta.url);
}

describe("Home Screen install metadata", () => {
  it.each([
    ["/", "http://127.0.0.1:4173/"],
    ["/", "http://127.0.0.1:5184/"],
    ["/GamifySurgery/", "https://melissarowlandc-afk.github.io/GamifySurgery/"],
  ])("builds standalone HTML with working public URLs at %s (%s)", async (base, location) => {
    // Run Vite's real HTML/public-asset transforms without bundling gameplay,
    // reading local environment files, writing dist or opening a network port.
    const result = await build({
      root: playerRoot,
      base,
      configFile: false,
      envFile: false,
      logLevel: "silent",
      plugins: [{
        name: "install-metadata-entry",
        enforce: "pre",
        load(id) { if (normalizePath(id) === entry) return "export {};"; },
      }],
      build: { write: false, minify: false, reportCompressedSize: false },
    });
    if (Array.isArray(result) || !("output" in result)) throw new Error("Expected a single HTML build");
    const asset = result.output.find(item => item.type === "asset" && item.fileName === "index.html");
    if (asset?.type !== "asset") throw new Error("Vite did not emit index.html");
    const html = String(asset.source);

    expect(tag(html, "meta", "name", "apple-mobile-web-app-capable").content).toBe("yes");
    expect(tag(html, "meta", "name", "mobile-web-app-capable").content).toBe("yes");
    expect(tag(html, "meta", "name", "apple-mobile-web-app-status-bar-style").content).toBe("default");
    expect(tag(html, "meta", "name", "apple-mobile-web-app-title").content).toBe("Stitchin' Time");
    const viewport = tag(html, "meta", "name", "viewport").content;
    expect(viewport).toBe("width=device-width, initial-scale=1.0, viewport-fit=cover");
    expect(viewport).not.toMatch(/user-scalable|maximum-scale|minimum-scale/);

    const app = new URL(location);
    const manifestHref = tag(html, "link", "rel", "manifest").href;
    expect(manifestHref).toBe(`${base}manifest.webmanifest`);
    const manifestUrl = new URL(manifestHref!, app);
    const manifest = JSON.parse(readFileSync(publicFile(manifestUrl, app), "utf8"));
    expect(manifest).toMatchObject({
      name: "Stitchin' Time", short_name: "Stitchin' Time", display: "standalone",
      id: "./", start_url: "./", scope: "./",
    });
    expect(manifest).not.toHaveProperty("orientation");
    for (const field of ["start_url", "scope"]) {
      expect(new URL(manifest[field], manifestUrl).href).toBe(app.href);
    }
    expect(manifest.background_color).toBe(tokens.match(/--paper:\s*(#[\da-f]+)/i)![1]);
    expect(manifest.theme_color).toBe(tokens.match(/--panel:\s*(#[\da-f]+)/i)![1]);
    expect(tag(html, "meta", "name", "theme-color").content).toBe(manifest.theme_color);

    expect(manifest.icons).toHaveLength(2);
    for (const size of [192, 512]) {
      const icon = manifest.icons.find((candidate: { sizes: string }) => candidate.sizes === `${size}x${size}`);
      expect(icon).toEqual({ src: `./app-icon/icon-${size}.png`, sizes: `${size}x${size}`, type: "image/png", purpose: "any" });
      const png = readFileSync(publicFile(new URL(icon.src, manifestUrl), app));
      expect(png.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
      expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([size, size]);
    }
    for (const [rel, file] of [["icon", "favicon-32.png"], ["apple-touch-icon", "apple-touch-icon.png"]]) {
      const href = tag(html, "link", "rel", rel!).href;
      expect(href).toBe(`${base}app-icon/${file}`);
      expect(readFileSync(publicFile(new URL(href!, app), app)).length).toBeGreaterThan(0);
    }
  });
});
