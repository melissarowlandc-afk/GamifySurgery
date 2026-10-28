import { CloudSyncError } from "./transport";

export const CLOUD_CHECK_TIMEOUT_MS = 30_000;

/** A missing browser/transport completion must reach recovery UI. Callers
 * fence late continuations; a timeout never authorizes play or a replacement. */
export function cloudCheckDeadline<T>(work: Promise<T>, timeoutMs = CLOUD_CHECK_TIMEOUT_MS, onTimeout?: () => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { onTimeout?.(); reject(new CloudSyncError("network")); }, timeoutMs);
    work.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}
