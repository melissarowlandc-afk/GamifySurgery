export interface AnimationFrameHandle {
  current: number | null;
}

export interface AnimationFrameScheduler {
  request: (callback: FrameRequestCallback) => number;
  cancel: (frameId: number) => void;
}

function browserAnimationFrameScheduler(): AnimationFrameScheduler {
  return {
    request: (callback) => window.requestAnimationFrame(callback),
    cancel: (frameId) => window.cancelAnimationFrame(frameId),
  };
}

/**
 * Keeps at most one deferred DOM task alive for a component.
 *
 * Alert targets use a frame so React can commit a highlight before focus and
 * scrolling run. Replacing the prior frame prevents rapid alert clicks from
 * retaining stale callbacks, while the matching cancel helper gives unmount a
 * deterministic cleanup boundary.
 */
export function scheduleLatestAnimationFrame(
  handle: AnimationFrameHandle,
  callback: FrameRequestCallback,
  scheduler: AnimationFrameScheduler = browserAnimationFrameScheduler(),
): void {
  if (handle.current !== null) {
    scheduler.cancel(handle.current);
  }
  handle.current = scheduler.request((timestamp) => {
    handle.current = null;
    callback(timestamp);
  });
}

export function cancelScheduledAnimationFrame(
  handle: AnimationFrameHandle,
  scheduler: AnimationFrameScheduler = browserAnimationFrameScheduler(),
): void {
  if (handle.current === null) {
    return;
  }
  scheduler.cancel(handle.current);
  handle.current = null;
}
