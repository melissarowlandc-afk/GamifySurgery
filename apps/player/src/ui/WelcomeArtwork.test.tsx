import { act } from "react";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./testDomHarness";
import { loadingArtwork, ENTRANCE_LANDSCAPE_MEDIA, ENTRANCE_PORTRAIT_MEDIA, LANDSCAPE_ART_MEDIA, PORTRAIT_ART_MEDIA, welcomeArtVariant, welcomeEntranceVariant } from "./loadingArtwork";
import { WelcomeArtwork, welcomeSurfaceStyle } from "./WelcomeArtwork";
import { LoadingScreen, LOADING_DELAY_MS } from "./LoadingScreen";

// These presentation tests do not exercise feedback submission. Its real
// consent/recovery integration remains covered by LoadingScreen/feedback tests.
vi.mock("../feedback/TesterFeedback", () => ({ ProblemReportButton: () => null }));

afterEach(async () => { await cleanupPhoneTests(); vi.unstubAllEnvs(); });

const luminance = (hex: string) => {
  const channels = hex.slice(1).match(/../g)!.map(value => parseInt(value, 16) / 255)
    .map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
  return channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722;
};
const contrast = (first: string, second: string) => {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0]! + 0.05) / (values[1]! + 0.05);
};

describe("owner-selected welcome artwork", () => {
  it.each([[390, 844], [375, 667], [1440, 1000], [1280, 720]] as const)("keeps the sign-in art header shallow at %s x %s", async (width, height) => {
    const env = phoneTestDom(); Object.assign(env.browser, { innerWidth: width, innerHeight: height });
    await env.render(<WelcomeArtwork className="welcome-entrance-art" entrance="wide" />);
    const picture = env.find(node => node.tagName === "PICTURE");
    expect(picture.attributes["data-welcome-composition"]).toBe("entrance-wide");
    expect(allElements(picture, node => node.tagName === "SOURCE")).toHaveLength(0);
    expect(env.find(node => node.tagName === "IMG").attributes.src).toContain(loadingArtwork.variants.landscape.src);
    expect(readFileSync(new URL("./WelcomeArtwork.css", import.meta.url), "utf8")).toContain('.welcome-entrance-art:not([data-welcome-composition="entrance-wide"])');
  });
  it.each([[390, 844, "portrait"], [375, 667, "landscape"], [1440, 1000, "landscape"], [1280, 720, "landscape"]] as const)(
    "uses an edge-to-edge header with room for controls at %s x %s (%s)", async (width, height, expected) => {
      const env = phoneTestDom(); Object.assign(env.browser, { innerWidth: width, innerHeight: height });
      expect(welcomeEntranceVariant(width, height)).toBe(expected);
      await env.render(<WelcomeArtwork className="welcome-entrance-art" entrance />);
      const picture = env.find(node => node.tagName === "PICTURE"), image = env.find(node => node.tagName === "IMG");
      expect(image.attributes.src).toContain(loadingArtwork.variants[expected].src);
      expect(picture.attributes["data-welcome-composition"]).toBe("entrance");
      expect(allElements(picture, node => node.tagName === "SOURCE").map(node => node.attributes.media)).toEqual([ENTRANCE_PORTRAIT_MEDIA, ENTRANCE_LANDSCAPE_MEDIA]);
      expect(ENTRANCE_LANDSCAPE_MEDIA).toBe(`not all and ${ENTRANCE_PORTRAIT_MEDIA}`); // Native resize needs no React rerender.
      expect(picture.style["--welcome-wide-ratio"]).toBe("1672 / 780");
      expect(picture.style["--welcome-tall-ratio"]).toBe("941 / 1260");
      const css = readFileSync(new URL("./WelcomeArtwork.css", import.meta.url), "utf8");
      expect(css).toContain(ENTRANCE_PORTRAIT_MEDIA);
      expect(css).toContain('body[data-phone-entry="true"] .opening-screen.auth-gate-screen.welcome-entrance { padding: 0');
      expect(css).toContain(".welcome-entrance-art img { width: 100%; height: auto;");
    });
  it.each(["portrait", "landscape"] as const)("ships the optimized native %s PNG described in the manifest", variant => {
    const asset = loadingArtwork.variants[variant], bytes = readFileSync(new URL(`../../public/${asset.src}`, import.meta.url));
    expect(bytes.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]).toEqual(variant === "portrait" ? [941, 1672] : [1672, 941]);
    expect([asset.width, asset.height]).toEqual([bytes.readUInt32BE(16), bytes.readUInt32BE(20)]);
    expect(bytes.length).toBe(asset.bytes);
    expect(createHash("sha256").update(bytes).digest("hex")).toBe(asset.sha256);
    expect(bytes[24]).toBe(8); expect(bytes[25]).toBe(2); // Original 8-bit RGB, no palette quantization.
    expect(loadingArtwork.alt).toMatch(/founder.*receptionist/);
  });
  it.each([
    [390, 844, "portrait"], [844, 390, "landscape"], [768, 1024, "portrait"], [1440, 1000, "landscape"],
    [1000, 1000, "portrait"], [1001, 1000, "landscape"], [320, 640, "portrait"], [2560, 1080, "landscape"],
  ] as const)("selects %s x %s by aspect ratio as %s", (width, height, expected) => {
    expect(welcomeArtVariant(width, height)).toBe(expected);
  });
  it.each([[390, 844], [1440, 1000]] as const)("renders eager art with native responsive sources and a base-safe fallback (%s x %s)", async (width, height) => {
    const env = phoneTestDom(); Object.assign(env.browser, { innerWidth: width, innerHeight: height });
    vi.stubEnv("BASE_URL", "/GamifySurgery/");
    await env.render(<WelcomeArtwork />);
    const image = env.find(node => node.tagName === "IMG"), sources = allElements(env.element, node => node.tagName === "SOURCE");
    const variant = loadingArtwork.variants[welcomeArtVariant(width, height)];
    expect(image.attributes.src).toBe(`/GamifySurgery/${variant.src}`);
    expect(image.attributes.alt).toBe(loadingArtwork.alt);
    expect([image.attributes.width, image.attributes.height]).toEqual([String(variant.width), String(variant.height)]);
    expect(image.attributes.loading).toBe("eager"); expect(image.attributes.fetchpriority ?? image.attributes.fetchPriority).toBe("high");
    expect(sources.map(node => node.attributes.media)).toEqual([PORTRAIT_ART_MEDIA, LANDSCAPE_ART_MEDIA]);
    expect(sources.map(node => node.attributes.srcSet ?? node.attributes.srcset)).toEqual([
      `/GamifySurgery/${loadingArtwork.variants.portrait.src}`, `/GamifySurgery/${loadingArtwork.variants.landscape.src}`,
    ]);
  });
  it.each(["index.html", "cloud-saves-qa.html"])("preloads only the matching composition before startup in %s", file => {
    const html = readFileSync(new URL(`../../${file}`, import.meta.url), "utf8").replaceAll("&gt;", ">");
    const links = (html.match(/<link\b(?:"[^"]*"|[^">])*>/g) ?? []).filter(link => link.includes('rel="preload"'));
    expect(links).toHaveLength(2);
    for (const [index, variant] of (["portrait", "landscape"] as const).entries()) {
      expect(links[index]).toContain(`href="%BASE_URL%${loadingArtwork.variants[variant].src}"`);
      expect(links[index]).toContain(`media="${variant === "portrait" ? PORTRAIT_ART_MEDIA : LANDSCAPE_ART_MEDIA}"`);
      expect(links[index]).toContain('as="image"'); expect(links[index]).toContain('fetchpriority="high"');
      expect(html.indexOf(links[index]!)).toBeLessThan(html.indexOf('<script type="module"'));
    }
    expect(html).toContain(`body:has(#root:empty) { background: ${loadingArtwork.palette.background}; }`);
  });
  it("keeps copy and the progress bar contrasting on an opaque surface in either shell theme", () => {
    const palette = loadingArtwork.palette;
    expect(contrast(palette.ink, palette.panel)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(palette.ink, palette.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(palette.barFill, palette.barTrack)).toBeGreaterThanOrEqual(3);
    expect(welcomeSurfaceStyle).toMatchObject({ "--welcome-panel": palette.panel, "--welcome-ink": palette.ink });
    const css = readFileSync(new URL("./WelcomeArtwork.css", import.meta.url), "utf8");
    expect(css).toContain("color-scheme: light"); expect(css).toContain("background: var(--welcome-background)");
    expect(readFileSync(new URL("./CloudCampaignEntry.css", import.meta.url), "utf8")).toContain("background: var(--welcome-panel)");
    expect(css).toContain("object-fit: contain"); expect(css).toContain("image-rendering: pixelated");
    expect(css).not.toContain("object-fit: cover");
  });
  it.each([[390, 844], [844, 390], [1440, 1000]] as const)("keeps the full scene separate from loading copy and uses the shared wordmark (%s x %s)", async (width, height) => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    const env = phoneTestDom(); Object.assign(env.browser, { innerWidth: width, innerHeight: height });
    await env.render(<LoadingScreen status="Opening your clinic…" stage="opening" />);
    await act(async () => { await vi.advanceTimersByTimeAsync(LOADING_DELAY_MS); });
    const screen = allElements(env.doc.body, node => node.attributes["aria-label"] === "Loading clinic")[0]!;
    const scene = screen.childNodes[0]!, copy = screen.childNodes[1]!;
    expect(scene.attributes.class).toBe("loading-screen-scene");
    expect(allElements(scene, node => node.tagName === "PICTURE")).toHaveLength(1);
    expect(copy.attributes.class).toBe("loading-screen-content");
    const title = allElements(copy, node => node.tagName === "H1")[0]!;
    expect(title.attributes.class).toBe("opening-wordmark"); expect(title.textContent).toBe("Stitchin’ Time");
    expect(allElements(copy, node => node.attributes.role === "status")).toHaveLength(1);
    expect(allElements(copy, node => node.attributes.role === "progressbar")).toHaveLength(1);
    expect(allElements(screen, node => node.tagName === "BUTTON")).toHaveLength(0);
    expect(screen.style["--welcome-background"]).toBe(loadingArtwork.palette.background);
  });
});
