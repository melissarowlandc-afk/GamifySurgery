import { describe, expect, it, vi } from "vitest";
import {
  cancelScheduledAnimationFrame,
  scheduleLatestAnimationFrame,
  type AnimationFrameHandle,
  type AnimationFrameScheduler,
} from "./animationFrameTask";

function testScheduler() {
  let nextFrameId = 0;
  const callbacks = new Map<number, FrameRequestCallback>();
  const scheduler: AnimationFrameScheduler = {
    request: vi.fn((callback: FrameRequestCallback) => {
      nextFrameId += 1;
      callbacks.set(nextFrameId, callback);
      return nextFrameId;
    }),
    cancel: vi.fn((frameId: number) => {
      callbacks.delete(frameId);
    }),
  };
  return { scheduler, callbacks };
}

describe("animation-frame task lifecycle", () => {
  it("replaces stale work so only the latest deferred action runs", () => {
    const handle: AnimationFrameHandle = { current: null };
    const { scheduler, callbacks } = testScheduler();
    const first = vi.fn();
    const second = vi.fn();

    scheduleLatestAnimationFrame(handle, first, scheduler);
    const firstFrameId = handle.current;
    scheduleLatestAnimationFrame(handle, second, scheduler);
    const secondFrameId = handle.current;

    expect(firstFrameId).not.toBeNull();
    expect(secondFrameId).not.toBe(firstFrameId);
    expect(scheduler.cancel).toHaveBeenCalledWith(firstFrameId);
    expect(callbacks.has(firstFrameId!)).toBe(false);

    callbacks.get(secondFrameId!)?.(16);
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
    expect(handle.current).toBeNull();
  });

  it("cancels pending work at the component cleanup boundary", () => {
    const handle: AnimationFrameHandle = { current: null };
    const { scheduler, callbacks } = testScheduler();
    const callback = vi.fn();

    scheduleLatestAnimationFrame(handle, callback, scheduler);
    const frameId = handle.current;
    cancelScheduledAnimationFrame(handle, scheduler);

    expect(scheduler.cancel).toHaveBeenCalledWith(frameId);
    expect(handle.current).toBeNull();
    expect(callbacks.has(frameId!)).toBe(false);
    expect(callback).not.toHaveBeenCalled();
  });
});
