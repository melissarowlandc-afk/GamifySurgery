import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const css = readFileSync(new URL("./global.css", import.meta.url), "utf8");
const tokens = readFileSync(new URL("./tokens.css", import.meta.url), "utf8");
function declarations(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const block = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`))?.[1];
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
