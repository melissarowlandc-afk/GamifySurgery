import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, it, vi } from 'vitest';
import { drawFacilityAtlasCrop, facilityAtlasClip, installPhoneArtSource, phoneArtSource } from './phoneArt';
import variants from './phoneArt.generated.json';
import { DESKTOP_FACILITY_ASSETS, selectFacilityAssets } from './roomAssets';
import { APPROVED_LEVEL5_BITMAP_ASSETS } from '../../art/bitmapAssetManifest';
import checkpoints from '../../../../../tests/fixtures/level-five-integration-checkpoints-20261012.json';

const assets = [...DESKTOP_FACILITY_ASSETS, ...APPROVED_LEVEL5_BITMAP_ASSETS];
const publicRoot = resolve(import.meta.dirname, '../../../public');
const hash = (value: Uint8Array) => createHash('sha256').update(value).digest('hex');

it('binds every phone derivative to its unchanged public source and bounds every texture at 2048 pixels', () => {
  expect(Object.keys(variants)).toHaveLength(142);
  for (const [id, row] of Object.entries(variants)) {
    const asset = assets.find(candidate => candidate.id === id)!;
    expect(asset, id).toBeDefined();
    expect(phoneArtSource(asset)).toBe(row);
    expect(hash(readFileSync(resolve(publicRoot, asset.relativePath!))), id).toBe(row.sourceSha256);
    const bytes = readFileSync(resolve(publicRoot, row.path));
    expect(hash(bytes), id).toBe(row.sha256);
    expect([bytes.readUInt32BE(16), bytes.readUInt32BE(20)], id).toEqual([row.width, row.height]);
    expect(Math.max(row.width, row.height), id).toBeLessThanOrEqual(2048);
    expect(row.width * row.height, id).toBeLessThanOrEqual(Math.ceil(row.sourceWidth / 2) * Math.ceil(row.sourceHeight / 2));
    expect(phoneArtSource({ ...asset, nativeWidth: asset.nativeWidth + 1 })).toBeUndefined();
  }
});

it.each([[4, 'integration-l4'], [5, 'integration-build']] as const)('keeps Level %s selected room/decor sources within the phone decoded budget', (level, key) => {
  const builtRoomIds = checkpoints[key].rooms.map(room => room.roomDefinitionId);
  const selected = selectFacilityAssets({ mobile: true, facilityLevel: level, builtRoomIds });
  const bytes = selected.reduce((sum, asset) => { const row = phoneArtSource(asset); return sum + (row?.width ?? asset.nativeWidth) * (row?.height ?? asset.nativeHeight) * 4; }, 0);
  expect(bytes).toBeLessThan(level === 4 ? 65_000_000 : 110_000_000);
  for (const asset of selected) { const row = phoneArtSource(asset); expect(Math.max(row?.width ?? asset.nativeWidth, row?.height ?? asset.nativeHeight), asset.id).toBeLessThanOrEqual(2048); }
});

it('changes source cuts only, keeps native-coordinate derivative masks, and never resamples a whole atlas at runtime', () => {
  const source = { path: 'phone.png', width: 100, height: 50, sourceWidth: 400, sourceHeight: 200 };
  const add = vi.fn(), image = {}, texture = { add, getSourceImage: () => image } as any;
  installPhoneArtSource(texture, source); installPhoneArtSource(texture, source);
  texture.add('chair', 0, 80, 40, 200, 120);
  expect(add).toHaveBeenCalledExactlyOnceWith('chair', 0, 20, 10, 50, 30);
  expect(facilityAtlasClip(texture, [80, 40, 200, 120], 100)).toEqual([25, 30]);
  const context = { drawImage: vi.fn() } as unknown as CanvasRenderingContext2D;
  drawFacilityAtlasCrop(context, texture, 80, 40, 200, 120);
  expect(context.drawImage).toHaveBeenCalledExactlyOnceWith(image, 20, 10, 50, 30, 0, 0, 200, 120);
  const native = { getSourceImage: () => image } as any;
  drawFacilityAtlasCrop(context, native, 80, 40, 200, 120);
  expect(context.drawImage).toHaveBeenLastCalledWith(image, 80, 40, 200, 120, 0, 0, 200, 120);
  expect(facilityAtlasClip(native, [80, 40, 200, 120], 100)).toEqual([100, 120]);
});
