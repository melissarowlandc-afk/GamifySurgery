/** Independent, one-row auxiliary database. It contains no identity, campaign,
 * authentication or save bytes. Origin-wide eviction can still remove it. */
export interface PhoneHealthStorage {
  read(): Promise<string | null>;
  write(text: string): Promise<void>;
  close(): void;
}
export const PHONE_HEALTH_DATABASE = "gamify-surgery.phone-health.v1";
const store = "health", key = "restart", timeoutMs = 2_000;

export function phoneHealthStorage(factory: IDBFactory): PhoneHealthStorage {
  let opening: Promise<IDBDatabase> | undefined, closed = false;
  function database(): Promise<IDBDatabase> {
    if (closed) return Promise.reject(Error("Phone health storage closed"));
    return opening ??= new Promise((done, fail) => {
      const request = factory.open(PHONE_HEALTH_DATABASE, 1);
      let finished = false;
      const timer = setTimeout(() => { finished = true; fail(Error("Phone health storage timeout")); }, timeoutMs);
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains(store)) request.result.createObjectStore(store); };
      request.onerror = () => { clearTimeout(timer); if (!finished) { finished = true; fail(Error("Phone health storage unavailable")); } };
      request.onblocked = () => { clearTimeout(timer); if (!finished) { finished = true; fail(Error("Phone health storage blocked")); } };
      request.onsuccess = () => {
        clearTimeout(timer);
        const db = request.result;
        if (finished || closed) { db.close(); if (!finished) fail(Error("Phone health storage closed")); return; }
        finished = true; db.onversionchange = () => db.close(); done(db);
      };
    });
  }
  const timestamp = (text: unknown): number => {
    if (typeof text !== "string" || text.length > 1024) return 0;
    try { const at: unknown = JSON.parse(text)?.updatedAt; return typeof at === "number" && Number.isFinite(at) ? at : 0; } catch { return 0; }
  };
  async function transact(text?: string): Promise<string | null> {
    const db = await database();
    if (closed) throw Error("Phone health storage closed");
    return new Promise((done, fail) => {
      const tx = db.transaction(store, text === undefined ? "readonly" : "readwrite"), table = tx.objectStore(store), request = table.get(key);
      let value: string | null = null, finished = false;
      const timer = setTimeout(() => { finished = true; try { tx.abort(); } catch { /* Already complete. */ } fail(Error("Phone health transaction timeout")); }, timeoutMs);
      request.onsuccess = () => {
        if (finished) return;
        try {
          value = typeof request.result === "string" && request.result.length <= 1024 ? request.result : null;
          // A delayed old document must not overwrite a newer page's marker.
          if (text !== undefined && timestamp(text) >= timestamp(value)) table.put(text, key);
        } catch {
          finished = true; clearTimeout(timer); try { tx.abort(); } catch { /* Already aborted. */ }
          fail(Error("Phone health transaction failed"));
        }
      };
      tx.oncomplete = () => { if (finished) return; finished = true; clearTimeout(timer); done(value); };
      tx.onabort = tx.onerror = () => { finished = true; clearTimeout(timer); fail(Error("Phone health transaction failed")); };
    });
  }
  return {
    read: () => transact(),
    async write(text) { if (text.length > 1024) throw Error("Phone health marker too large"); await transact(text); },
    close() { closed = true; void opening?.then(db => db.close(), () => {}); },
  };
}
