import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { FRONTAGE_V2_ASSETS, resolvePublicArtAssetUrl } from "./bitmapAssetManifest";

describe("frontage v2 authored kit", () => {
  it("ships all eleven standalone native PNGs with base-path-safe descriptors", () => {
    expect(Object.values(FRONTAGE_V2_ASSETS)).toHaveLength(11);
    for (const asset of Object.values(FRONTAGE_V2_ASSETS)) {
      const path = asset.relativePath!;
      const png = readFileSync(new URL(`../../public/${path}`, import.meta.url));
      expect(Array.from(png.subarray(0,8))).toEqual([137,80,78,71,13,10,26,10]);
      expect(png.readUInt32BE(16)).toBe(asset.nativeWidth);
      expect(png.readUInt32BE(20)).toBe(asset.nativeHeight);
      expect(asset.kind).toBe("environment");
      expect(resolvePublicArtAssetUrl(path,"/GamifySurgery/")).toBe(`/GamifySurgery/${path}`);
    }
  });

  it("preserves measured prop contacts and exact uniform aspect ratios", () => {
    for (const side of ["west","east"] as const) {
      const bed = FRONTAGE_V2_ASSETS[`frontage:bed-${side}-v3`];
      expect(bed.anchor).toEqual({ x: 256, y: 160 });
      expect(1.55*bed.nativeHeight/bed.nativeWidth).toBe(0.484375);
    }
    expect(FRONTAGE_V2_ASSETS["frontage:grass-low-v2"].anchor).toEqual({ x: 32, y: 28 });
    expect(FRONTAGE_V2_ASSETS["frontage:lawn-sage-v2"].anchor).toEqual({ x: 128, y: 64 });
    expect(FRONTAGE_V2_ASSETS["frontage:entry-inset-v2"].anchor).toEqual({ x: 0, y: 0 });
  });
});
