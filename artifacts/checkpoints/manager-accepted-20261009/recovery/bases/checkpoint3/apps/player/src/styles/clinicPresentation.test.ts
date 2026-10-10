import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./global.css", import.meta.url), "utf8");
const tokens = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");
const goalsCss = readFileSync(new URL("../ui/goalsPanel.css", import.meta.url), "utf8");
const clinicCss = css.slice(css.indexOf("/* Alerts & Events: restrained live cards"));
function declarations(selector: string, source = css) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = source.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1];
  expect(block, selector).toBeDefined();
  return Object.fromEntries(block!.split(";").filter((entry) => entry.includes(":")).map((entry) => entry.trim().split(/:\s*/)));
}
function luminance(token: string) {
  const hex = tokens.match(new RegExp(`${token}:\\s*#([\\da-f]{6})`, "i"))![1]!;
  const rgb = hex.match(/../g)!.map((value) => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * rgb[0]! + 0.7152 * rgb[1]! + 0.0722 * rgb[2]!;
}

describe("clinic presentation contrast and geometry", () => {
  it("protects the day divider from arrival effects and meets AA for all its normal text", () => {
    const day = declarations(".event-message-board .message-board-item.is-day_summary");
    expect(day).toMatchObject({ background: "var(--ink)", color: "var(--paper-raised)", animation: "none", opacity: "1", filter: "none", "box-shadow": "none", "mix-blend-mode": "normal" });
    const ratio = (luminance("--paper-raised") + 0.05) / (luminance("--ink") + 0.05);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(declarations(".message-board-item.is-day_summary small").color).toBe("inherit");
    expect(declarations(".message-board-item.is-day_summary::after").content).toBe("none");
  });
  it("reserves the same headline height when empty, showing or expired at any viewport width", () => {
    const base = declarations(".clinic-headline");
    const active = declarations(".clinic-headline.is-showing");
    expect(base.height).toBe("30px"); expect(base["min-height"]).toBe(base.height); expect(base["max-height"]).toBe(base.height);
    expect(base["white-space"]).toBe("nowrap"); expect(base.overflow).toBe("hidden");
    expect(base.visibility).toBe("hidden"); expect(active.visibility).toBe("visible");
    for (const geometry of ["height", "min-height", "max-height", "padding", "border-top", "margin", "display", "font"]) expect(active[geometry]).toBeUndefined();
  });
});

describe("compact Goals and Alerts spacing", () => {
  it("packs every level's goal rows to their content without shrinking labels, progress or the optional chip", () => {
    expect(declarations(".goals-panel.panel", goalsCss)).toMatchObject({
      "--goal-row-gap": "3px", "--goal-inset-block": "4px", "--goal-inset-inline": "6px",
      "min-height": "0", "padding-bottom": "0",
    });
    const list = declarations(".goals-panel .goal-list", goalsCss);
    expect(list).toMatchObject({ "align-content": "start", "grid-auto-rows": "max-content", flex: "0 1 auto", gap: "var(--goal-row-gap)" });
    expect(list.font).toBeUndefined(); expect(list["font-size"]).toBeUndefined();
    expect(declarations(".goals-panel .goal-label", goalsCss)["row-gap"]).toBe("0");
    expect(declarations(".goals-panel .goal-secondary-chip", goalsCss)).toMatchObject({ padding: "2px 6px", font: "12px/1.3 var(--font-pixel)" });
    expect(declarations(".goals-panel .goals-advance-area", goalsCss).gap).toBe("4px");
  });
  it("gives the quiet zone no card-space floor while keeping a readable single line", () => {
    expect(declarations(".needs-you-zone.is-empty .needs-you-expansion", clinicCss)["grid-template-rows"]).toBe("0fr");
    expect(declarations(".needs-you-cards", clinicCss)).toMatchObject({ "min-height": "0", overflow: "hidden" });
    expect(declarations(".needs-you-cards", clinicCss).padding).toBeUndefined();
    expect(declarations(".needs-you-zone.is-empty .clinic-zone-label", clinicCss)["padding-block"]).toBe("2px");
    expect(declarations(".event-message-board .needs-you-zone.is-empty", clinicCss)["border-bottom-width"]).toBe("1px");
    expect(declarations(".needs-you-calm", clinicCss)).toMatchObject({ margin: "0", font: "14px/1.4 var(--font-read)" });
  });
  it("uses compact feed spacing for both board modes and preserves body/action font sizes and the day divider", () => {
    expect(declarations(".event-message-board", clinicCss)).toMatchObject({
      "--clinic-feed-row-padding": "2px", "--clinic-feed-row-gap": "2px", "--clinic-feed-action-gap": "1px",
    });
    expect(clinicCss).toMatch(/\.event-message-board \.message-board-item,\s*\.event-message-board\.is-ticker \.message-board-item\s*\{/);
    expect(declarations(".event-message-board.is-ticker .message-board-item", clinicCss)).toMatchObject({ "padding-block": "var(--clinic-feed-row-padding)", "row-gap": "var(--clinic-feed-row-gap)" });
    expect(declarations(".event-message-board .message-board-compact-action", clinicCss)["row-gap"]).toBe("var(--clinic-feed-action-gap)");
    expect(declarations(".event-message-board .message-board-compact-action-copy", clinicCss).font).toBe("14px/1.4 var(--font-read)");
    expect(declarations(".event-message-board .message-board-compact-action-label", clinicCss).font).toBe("700 13px/1.4 var(--font-read)");
    expect(declarations(".event-message-board .message-board-item.is-day_summary", clinicCss)).toMatchObject({ padding: "6px 10px", background: "var(--ink)", color: "var(--paper-raised)", opacity: "1", animation: "none" });
  });
  it("allows narrow bylines to wrap while retaining full time labels and 44px touch actions", () => {
    expect(declarations(".clinic-feed-byline", clinicCss)).toMatchObject({ "flex-wrap": "wrap", gap: "0 8px", font: "700 11px/1.4 var(--font-pixel)" });
    expect(declarations(".clinic-feed-byline > span", clinicCss)["overflow-wrap"]).toBe("anywhere");
    expect(declarations(".clinic-feed-byline time", clinicCss)).toMatchObject({ "white-space": "nowrap", "margin-inline-start": "auto", font: "12px/1.4 var(--font-read)" });
    expect(css).toMatch(/@media \(max-width: 760px\)\s*\{\s*\.message-board-compact-action\s*\{[^}]*min-height:\s*44px/);
  });
  it("expands only the inner tray and turns off its transition for reduced motion", () => {
    expect(declarations(".needs-you-expansion", clinicCss)).toMatchObject({ display: "grid", "grid-template-rows": "1fr", transition: "grid-template-rows 160ms ease-out" });
    expect(clinicCss).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{\s*\.needs-you-expansion\s*\{\s*transition:\s*none;/);
    const zone = declarations(".event-message-board .needs-you-zone", clinicCss);
    expect(zone.flex).toBe("0 0 auto");
    for (const dimension of ["height", "min-height", "max-height", "position", "transform"]) expect(zone[dimension]).toBeUndefined();
  });
});
