import { describe, expect, it } from "vitest";
import { compressCloudEvidencePages, decompressCloudEvidencePages } from "./codecEvidencePages";

describe("sealed immutable evidence pages", () => {
  it("keeps an accepted partial page unchanged and stores every appended logical row exactly once", async () => {
    const rows = Array.from({ length: 160 }, (_, index) => ({ id: `e${(index + 1).toString(36)}`, kind: "event", origin: "observed-transition",
      value: { sequence: index, text: "synthetic repeated storage text ".repeat(30) } }));
    const first = await compressCloudEvidencePages(rows.slice(0, 85).map(row => JSON.stringify(row)));
    const second = await compressCloudEvidencePages(rows.slice(85).map(row => JSON.stringify(row)), 85);
    const accepted = JSON.stringify(first), combined = [...first, ...second];
    expect(await decompressCloudEvidencePages(combined)).toEqual(rows);
    expect(JSON.stringify(first)).toBe(accepted);
    expect(second[0]!.firstRecord).toBe(85);
    expect(new Set(combined.map(page => page.firstRecord)).size).toBe(combined.length);
  });
  it("rejects reordered, duplicate and missing pages, IDs and aggregate decoded size overflow", async () => {
    const first = await compressCloudEvidencePages([JSON.stringify({ id: "e1", value: "one" })]);
    const second = await compressCloudEvidencePages([JSON.stringify({ id: "e2", value: "two" })], 1);
    await expect(decompressCloudEvidencePages([...second, ...first])).rejects.toMatchObject({ code: "page_order" });
    await expect(decompressCloudEvidencePages([...first, ...first])).rejects.toMatchObject({ code: "page_order" });
    await expect(compressCloudEvidencePages([JSON.stringify({ id: "e2" })])).rejects.toMatchObject({ code: "page_order" });
    await expect(decompressCloudEvidencePages([{ ...first[0]!, content: { ...first[0]!.content, uncompressedBytes: 6_000_001 } }]))
      .rejects.toMatchObject({ code: "evidence_size" });
  });
});
