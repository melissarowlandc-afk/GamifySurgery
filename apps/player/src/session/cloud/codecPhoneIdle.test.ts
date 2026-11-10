import { afterEach, expect, it, vi } from 'vitest';
import { CloudCodecWorker, PHONE_CODEC_IDLE_RELEASE_MS } from './codecWorker';
import { FakeCloudCodecWorker } from './codecWorkerTestSupport';
import { observePhoneClinic } from '../../mobile/performance/phoneMemoryPolicy';

afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

it('idles a large-phone codec only after every accepted task replies; cancels idle release on new work and restarts lazily', async () => {
  vi.useFakeTimers();
  vi.stubGlobal('window', Object.assign(new EventTarget(), { innerWidth: 390, location: { search: '?layout=phone' },
    localStorage: { getItem: () => null, setItem() {} }, matchMedia: () => ({ matches: true }) }));
  vi.stubGlobal('document', Object.assign(new EventTarget(), { visibilityState: 'visible' }));
  observePhoneClinic(5, 87);
  const first = new FakeCloudCodecWorker(), second = new FakeCloudCodecWorker();
  const codec = new CloudCodecWorker(vi.fn().mockReturnValueOnce(first).mockReturnValueOnce(second));
  const answer = (worker: FakeCloudCodecWorker, value: string) => worker.reply({ id: worker.messages.at(-1)!.id, result: value });
  try {
    const a = codec.run({ kind: 'hash', input: 'first' }); first.reply({ ready: true }); answer(first, 'a'); expect(await a).toBe('a');
    await vi.advanceTimersByTimeAsync(PHONE_CODEC_IDLE_RELEASE_MS - 1); expect(first.terminated).toBe(false);
    const b = codec.run({ kind: 'hash', input: 'pending' });
    await vi.advanceTimersByTimeAsync(PHONE_CODEC_IDLE_RELEASE_MS + 1); expect(first.terminated).toBe(false);
    answer(first, 'b'); expect(await b).toBe('b');
    await vi.advanceTimersByTimeAsync(PHONE_CODEC_IDLE_RELEASE_MS); expect(first.terminated).toBe(true);
    expect(codec.health).toMatchObject({ alive: false, idleReleases: 1, restarts: 0 });
    const c = codec.run({ kind: 'hash', input: 'next' }); second.reply({ ready: true }); answer(second, 'c'); expect(await c).toBe('c');
    expect(second.messages.map(row => row.task)).toEqual([{ kind: 'hash', input: 'next' }]);
  } finally { codec.dispose(); }
  expect(vi.getTimerCount()).toBe(0);
});
