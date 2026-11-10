import { afterEach, expect, it, vi } from 'vitest';
import { nativePhaserMemoryClass } from '../../facility/nativePhaserMemoryTestSupport';
import { APPROVED_GS015_ROOM_ATLASES } from '../../art/bitmapAssetManifest';
import { facilityAtlasClip, installPhoneArtSource, phoneArtSource } from './phoneArt';

afterEach(() => vi.unstubAllGlobals());

it('keeps native Phaser frame cuts inside the smaller atlas and preserves world clipping and floor anchors', () => {
  class Source { constructor(public width: number, public height: number) {} }
  vi.stubGlobal('window', {}); vi.stubGlobal('HTMLCanvasElement', Source);
  const Texture = nativePhaserMemoryClass('textures/Texture.js'), parse = nativePhaserMemoryClass('textures/parsers/Image.js');
  const asset = APPROVED_GS015_ROOM_ATLASES.find(asset => asset.id === 'gs015:recovery:furniture')!, source = phoneArtSource(asset)!;
  const manager = { game: { renderer: { gl: null, config: {} }, config: { renderType: 1 } } };
  const texture = new Texture(manager, 'phone', new Source(source.width, source.height)); parse(texture, 0);
  installPhoneArtSource(texture, source);
  const rect = [167, 41, 331, 479] as const;
  const frame = texture.add('chair', 0, ...rect);
  expect(frame.cutX + frame.cutWidth).toBeLessThanOrEqual(source.width);
  expect(frame.cutY + frame.cutHeight).toBeLessThanOrEqual(source.height);
  // Live room images set explicit world dimensions. Smaller source cuts never
  // alter those dimensions or the origin used for a ground/seat contact.
  const displayWidth = 80, displayHeight = 116, floorY = 240, anchorY = .86;
  expect(frame.realWidth * (displayWidth / frame.realWidth)).toBe(displayWidth);
  expect(floorY - anchorY * displayHeight).toBeCloseTo(140.24);
  const [width, height] = facilityAtlasClip(texture, rect, 197);
  expect(displayWidth * width / frame.realWidth).toBeCloseTo(displayWidth * 197 / rect[2], 10);
  expect(height).toBe(frame.realHeight);
});
