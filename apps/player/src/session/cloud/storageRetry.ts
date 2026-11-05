import { CloudCacheError } from "./codecCache";
import { isStorageQuotaError } from "../storagePressure";
import { problemDiagnostics } from "../../diagnostics/problemDiagnostics";

export const STORAGE_RETRY_DELAYS_MS = [250, 1_000] as const;
export const STORAGE_REQUEST_TIMEOUT_MS = 10_000;
/** Retain the existing enclosing cache deadline (including its retries), so a
 * cancelled opening releases its queue promptly. Classify it as browser delay,
 * never as a network failure or a quota failure. */
export function storageDeadline<T>(work: Promise<T>, timeoutMs = 30_000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new CloudCacheError("timeout")), timeoutMs);
    work.then(value => { clearTimeout(timer); resolve(value); }, error => { clearTimeout(timer); reject(error); });
  });
}
const timedOut = new WeakSet<IDBTransaction>();
export function storageTransactionError(tx: IDBTransaction): CloudCacheError {
  return new CloudCacheError(isStorageQuotaError(tx.error) ? "quota" : timedOut.has(tx) ? "timeout" : "transaction");
}
export function storageRequest<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new CloudCacheError("timeout")), STORAGE_REQUEST_TIMEOUT_MS);
    req.onsuccess = () => { clearTimeout(timer); resolve(req.result); };
    req.onerror = () => { clearTimeout(timer); reject(new CloudCacheError(isStorageQuotaError(req.error) ? "quota" : "transaction")); };
  });
}
export function storageCompletion(tx: IDBTransaction): Promise<boolean> {
  return new Promise(resolve => {
    const timer = setTimeout(() => { timedOut.add(tx); try { tx.abort(); } catch { /* Already terminal. */ } resolve(false); }, STORAGE_REQUEST_TIMEOUT_MS);
    tx.oncomplete = () => { clearTimeout(timer); resolve(true); };
    tx.onabort = () => { clearTimeout(timer); resolve(false); };
    tx.onerror = () => {};
  });
}
/** A deadline says the browser did not answer, not that its quota is full. */
export function isTransientStorageError(error: unknown): boolean {
  return error instanceof CloudCacheError && error.reason === "timeout";
}

/** Only idempotent/transactional operations may use this helper. The caller
 * retains the exact owner, immutable rows and expected high-water on retry. */
export async function retrySlowStorage<T>(work: () => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await work(); }
    catch (error) {
      if (!isTransientStorageError(error) || attempt >= STORAGE_RETRY_DELAYS_MS.length) throw error;
      problemDiagnostics.event("storage", "retry:timeout");
      await new Promise(resolve => setTimeout(resolve, STORAGE_RETRY_DELAYS_MS[attempt]));
    }
  }
}
