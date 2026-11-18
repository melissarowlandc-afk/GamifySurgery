import { readFileSync } from "node:fs";
import { afterEach, expect, it, vi } from "vitest";
import { INTRO_TAGLINES } from "../content/introTaglines";
import { loadingArtwork } from "./loadingArtwork";
import { ContinuousLoading, LOADING_SURFACE_ID } from "./ContinuousLoading";
import { LoadingScreen } from "./LoadingScreen";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./testDomHarness";

afterEach(cleanupPhoneTests);
const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");
const script = readFileSync(new URL("../../public/startup-recovery.js", import.meta.url), "utf8");
it("shares the exact art, palette, fonts, subtitle rotation and progress structure before React", () => {
  const lines = JSON.parse(html.match(/id="clinic-loading-taglines">([^<]+)</)![1]!);
  expect(lines).toEqual(INTRO_TAGLINES);
  for (const asset of Object.values(loadingArtwork.variants)) expect(html).toContain(`%BASE_URL%${asset.src}`);
  expect(html).toContain(`alt="${loadingArtwork.alt}"`);
  expect(html.indexOf('id="clinic-loading-screen"')).toBeLessThan(html.indexOf('id="root"'));
  expect(html).toContain('role="progressbar"'); expect(html).toContain('aria-valuenow="2"');
  expect(html).toContain('href="/src/ui/loadingBootstrap.css"');
  const css = readFileSync(new URL("./loadingBootstrap.css", import.meta.url), "utf8");
  for (const color of Object.values(loadingArtwork.palette)) expect(css).toContain(color);
  expect(JSON.parse(readFileSync(new URL("../../public/manifest.webmanifest", import.meta.url), "utf8")).background_color).toBe(loadingArtwork.palette.background);
  expect(css).toContain("OpeningWordmark.css"); expect(css).toContain("LoadingScreen.css");
});

it("keeps the very same decoded bootstrap picture and section across the React handoff", async () => {
  const env = phoneTestDom(), host = env.doc.createElement("section"), bootstrap = env.doc.createElement("div"), picture = env.doc.createElement("picture");
  host.setAttribute("id", LOADING_SURFACE_ID); host.setAttribute("data-loading-tagline", INTRO_TAGLINES[3]);
  bootstrap.setAttribute("data-loading-bootstrap", ""); bootstrap.appendChild(picture); host.appendChild(bootstrap); env.doc.body.appendChild(host);
  Object.assign(host, { querySelector: (selector: string) => selector === "[data-loading-bootstrap] picture" ? picture : selector === "[data-loading-bootstrap]" ? bootstrap : null });
  await env.render(<ContinuousLoading><LoadingScreen phase="auth" status="Connecting" /></ContinuousLoading>);
  expect(env.doc.getElementById(LOADING_SURFACE_ID)).toBe(host);
  expect(host.contains(picture)).toBe(true); expect(host.contains(bootstrap)).toBe(false);
  expect(allElements(host, node => node.tagName === "PICTURE")).toEqual([picture]);
  expect(allElements(host, node => node.attributes["data-testid"] === "intro-tagline")[0]!.textContent).toBe(INTRO_TAGLINES[3]);
});

it("keeps early root content covered until React adopts it, and exposes one bounded preboot recovery action", () => {
  const env = phoneTestDom(), host = env.doc.createElement("section"), status = env.doc.createElement("p"), actions = env.doc.createElement("div"), tagline = env.doc.createElement("p");
  Object.defineProperty(host, "id", { value: LOADING_SURFACE_ID }); host.setAttribute("id", LOADING_SURFACE_ID);
  env.element.setAttribute("id", "root"); env.doc.body.appendChild(host);
  const lines = env.doc.createElement("script"); lines.setAttribute("id", "clinic-loading-taglines"); lines.textContent = JSON.stringify(INTRO_TAGLINES); env.doc.body.appendChild(lines);
  Object.assign(host, { querySelector: (selector: string) => selector === "#clinic-loading-status" ? status : selector === "[data-loading-boot-actions]" ? actions : tagline });
  let changed!: () => void, deadline!: () => void;
  const disconnect = vi.fn(), reload = vi.fn(), write = vi.fn();
  Object.assign(env.browser, { setTimeout: (callback: () => void, ms: number) => { expect(ms).toBe(30_000); deadline = callback; return 1; }, clearTimeout: vi.fn(),
    sessionStorage: { getItem: () => INTRO_TAGLINES[0], setItem: write }, location: { reload } });
  const Observer = class { constructor(callback: () => void) { changed = callback; } observe() {} disconnect = disconnect; };
  new Function("window", "document", "MutationObserver", script)(env.browser, env.doc, Observer);
  expect(tagline.textContent).not.toBe(INTRO_TAGLINES[0]);
  env.element.appendChild(env.doc.createElement("main")); changed(); expect(disconnect).not.toHaveBeenCalled();
  deadline(); expect(status.textContent).toContain("Your saves have not changed");
  expect(actions.children.map(node => node.textContent)).toEqual(["Reload"]);
  expect(reload).not.toHaveBeenCalled(); expect(write).not.toHaveBeenCalled();
  expect(disconnect).toHaveBeenCalledOnce();
});
