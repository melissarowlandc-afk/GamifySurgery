import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { CloudCampaignSummary } from "../session/cloud/transport";
import { CampaignChoices } from "./CampaignChoices";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./testDomHarness";

afterEach(cleanupPhoneTests);
const summaries = (count: number): CloudCampaignSummary[] => Array.from({ length: count }, (_, index) => ({
  campaignId: `clinic.${index}`, revision: "2", writerGeneration: "1", writerActive: false, serverNowMs: Date.now(),
  name: `Clinic ${index + 1}`, status: index ? "archived" : "resumable", acceptedAtMs: Date.now() - 30_000,
}));
const levels = { '["clinic.0","2"]': 1, '["clinic.1","2"]': 2 };

describe("compact whole-row campaign choices", () => {
  it.each([0, 1, 2].flatMap(count => [[390, 844], [375, 667], [1440, 1000], [1280, 720]].map(([width, height]) => ({ count, width: width!, height: height! }))))(
    "$count choices retain two-line row structure at $width x $height", async ({ count, width, height }) => {
      const env = phoneTestDom(), open = vi.fn(); Object.assign(env.browser, { innerWidth: width, innerHeight: height });
      await env.render(<CampaignChoices campaigns={summaries(count)} levels={levels} disabled={false} onOpen={open} />);
      const section = env.find(node => node.tagName === "SECTION");
      expect(section.attributes["data-campaign-count"]).toBe(String(count));
      expect(section.childNodes).toHaveLength(count);
      for (let index = 0; index < count; index++) {
        const row = env.button(`Resume Clinic ${index + 1}`);
        expect(row.tagName).toBe("BUTTON"); expect(row.childNodes).toHaveLength(2);
        expect(row.childNodes[0]!.childNodes).toHaveLength(2); // Name and compact metadata, no extra Resume button.
        expect(allElements(row, node => node.tagName === "BUTTON")).toHaveLength(1);
        expect(row.textContent).toContain(`Level ${index + 1}`); expect(row.textContent).toContain("Saved just now");
        expect(row.textContent).not.toContain("Last saved:");
        expect(row.attributes["aria-describedby"]).toBe(allElements(row, node => node.attributes.id !== undefined)[0]!.attributes.id);
        await env.clickElement(row); expect(open).toHaveBeenLastCalledWith(`clinic.${index}`);
      }
      expect(open).toHaveBeenCalledTimes(count);
      const css = readFileSync(new URL("./CloudCampaignEntry.css", import.meta.url), "utf8");
      expect(css).toContain("height: 3.75rem"); expect(css).toContain("min-height: 44px");
      expect(css).toContain("text-overflow: ellipsis");
    });
  it("preserves disabled gates and their reason while level lookup is unavailable", async () => {
    const env = phoneTestDom(), open = vi.fn(), campaigns = summaries(1);
    await env.render(<CampaignChoices campaigns={campaigns} levels={{}} disabled reasonId="account-reason" onOpen={open} />);
    const row = env.button("Resume Clinic 1"); expect(row.attributes.disabled).toBeDefined();
    expect(row.attributes["aria-describedby"]?.split(" ")).toContain("account-reason");
    expect(row.textContent).toContain("Saved just now"); expect(row.textContent).not.toContain("Checking level"); expect(open).not.toHaveBeenCalled();
    await env.render(<CampaignChoices campaigns={campaigns} levels={{ '["clinic.0","2"]': null }} disabled={false} onOpen={open} />);
    expect(row.textContent).toContain("Saved just now"); expect(row.textContent).not.toContain("Level unavailable"); await env.clickElement(row);
    expect(open).toHaveBeenCalledExactlyOnceWith("clinic.0");
  });
  it("keeps archived/active-writer information and the full accessible clinic name", async () => {
    const env = phoneTestDom(), campaigns = summaries(1), name = "A long clinic name that stays complete for screen readers and the Resume action";
    campaigns[0] = { ...campaigns[0]!, name, status: "archived", writerActive: true };
    await env.render(<CampaignChoices campaigns={campaigns} levels={levels} disabled={false} onOpen={vi.fn()} />);
    const row = env.button(`Resume ${name}`); expect(row.textContent).toContain("Archived"); expect(row.textContent).toContain("Open elsewhere");
  });
});
