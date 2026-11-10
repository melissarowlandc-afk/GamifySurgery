import { afterEach, expect, it, vi } from "vitest";
import { BitmapDecodeQueue, PHONE_BITMAP_DEADLINE_MS, PHONE_BITMAP_DECODE_DEADLINE_MS } from "./bitmapDecodeQueue";
import { MobileBitmapCache } from "./roomAssets";
import { ENVIRONMENT_ATLAS_V1 } from "../../art/bitmapAssetManifest";

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

it("expires every queued promise even when all four network requests never fire an event", async () => {
  vi.useFakeTimers(); const images: any[] = [];
  const cache = new MobileBitmapCache(() => { const image = {}; images.push(image); return image as HTMLImageElement; });
  const requests = Array.from({ length: 40 }, (_, n) => cache.load({ ...ENVIRONMENT_ATLAS_V1, id: `hung.${n}` }, "/fixture.png"));
  const late = images.map(image => image.onload);
  expect(cache.health).toMatchObject({ activeDecodes: 4, queuedDecodes: 36 });
  await vi.advanceTimersByTimeAsync(PHONE_BITMAP_DEADLINE_MS);
  expect(await Promise.all(requests)).toEqual(Array(40).fill(null));
  for (const load of late) load();
  expect(cache.health).toMatchObject({ activeDecodes: 0, queuedDecodes: 0, pending: 0, decodeTimeouts: 40 });
  expect(images.every(image => image.onload === null && image.onerror === null && image.src === "")).toBe(true);
  expect(vi.getTimerCount()).toBe(0);
});

it("releases hung and rejected raster decodes once, then services the waiting source", async () => {
  vi.useFakeTimers(); const images: any[] = []; let finish!: () => void;
  const queue = new BitmapDecodeQueue();
  const rows = Array.from({ length: 5 }, (_, n) => queue.load(() => {
    const image = { decode: () => n === 1 ? Promise.reject(Error("decode rejected")) : new Promise<void>(resolve => { if (n === 0) finish = resolve; }) };
    images.push(image); return image as unknown as HTMLImageElement;
  }, "/fixture.png", 1));
  images[0].onload(); images[1].onload(); await rows[1]!.promise;
  expect(images).toHaveLength(5);
  images[2].onload(); images[3].onload(); images[4].onerror();
  await vi.advanceTimersByTimeAsync(PHONE_BITMAP_DECODE_DEADLINE_MS);
  finish(); await Promise.resolve();
  expect(await Promise.all(rows.map(row => row.promise))).toEqual(Array(5).fill(null));
  expect(queue.health).toEqual({ activeDecodes: 0, queuedDecodes: 0, decodeTimeouts: 3 });
  expect(vi.getTimerCount()).toBe(0);
});

it("promotes a deduplicated visible request ahead of background work and preserves FIFO ties", async () => {
  const images: any[] = [], starts: string[] = [];
  const cache = new MobileBitmapCache(() => {
    const image = { set src(value: string) { if (value) starts.push(value); } };
    images.push(image); return image as HTMLImageElement;
  });
  const requests = Array.from({ length: 8 }, (_, n) => cache.load({ ...ENVIRONMENT_ATLAS_V1, id: `priority.${n}` }, `/image.${n}`, 1));
  expect(cache.load({ ...ENVIRONMENT_ATLAS_V1, id: "priority.7" }, "/image.7", 0)).toBe(requests[7]);
  images[0].onload(); await requests[0];
  expect(starts[4]).toBe("/image.7");
  images[1].onload(); await requests[1]; expect(starts[5]).toBe("/image.4");
  for (let n = 2; n < 8; n++) images[n].onload();
  await Promise.all(requests); expect(cache.health.pending).toBe(0);
});

it("serves the oldest background job under continuous higher-priority arrivals without increasing concurrency", async () => {
  vi.useFakeTimers(); const queue = new BitmapDecodeQueue(), images: any[] = [], starts: string[] = [], rows: Promise<unknown>[] = [];
  const add = (url: string, priority: number) => rows.push(queue.load(() => {
    const image = { set src(value: string) { if (value) starts.push(value); } }; images.push(image); return image as HTMLImageElement;
  }, url, priority).promise);
  for (let n = 0; n < 4; n++) add(`/active.${n}`, 0);
  add("/oldest-background", 1);
  for (let n = 0; n < 12; n++) add(`/visible.${n}`, 0);
  for (let n = 0; n < 8; n++) { images[n].onload(); expect(queue.health.activeDecodes).toBeLessThanOrEqual(4); }
  expect(starts.indexOf("/oldest-background")).toBeLessThan(8);
  await vi.advanceTimersByTimeAsync(PHONE_BITMAP_DEADLINE_MS); await Promise.all(rows);
  expect(queue.health.activeDecodes).toBe(0);
});

it("drains synchronous image-construction failures without recursion or an unhandled rejection", async () => {
  vi.useFakeTimers(); const queue = new BitmapDecodeQueue(), images: any[] = [];
  const create = () => { if (images.length >= 4) throw Error("Image unavailable"); const image = {}; images.push(image); return image as HTMLImageElement; };
  const rows = Array.from({ length: 2000 }, () => queue.load(create, "/fixture.png", 1).promise);
  for (const image of images) image.onerror();
  expect(await Promise.all(rows)).toEqual(Array(2000).fill(null));
  expect(queue.health).toMatchObject({ activeDecodes: 0, queuedDecodes: 0 });
  expect(vi.getTimerCount()).toBe(0);
});
