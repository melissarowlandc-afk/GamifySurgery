import { IDBFactory, IDBKeyRange, IDBObjectStore } from "fake-indexeddb";
import { afterEach, expect, it, vi } from "vitest";
import { deleteJournalKeyRange } from "./journalRangeDelete";

const request = <T>(r: IDBRequest<T>) => new Promise<T>((resolve, reject) => { r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
const done = (tx: IDBTransaction) => new Promise<void>((resolve, reject) => { tx.oncomplete = () => resolve(); tx.onabort = () => reject(Error("aborted")); });
const key = (campaign: string, version: number) => JSON.stringify([campaign, String(version).padStart(16, "0")]);
afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

it.each([false, true])("deletes the same9000-row prefix with one native mutation and preserves neighboring campaigns/suffix (fallback=%s)", async fallback => {
  const factory = new IDBFactory(), opening = factory.open("range", 1); opening.onupgradeneeded = () => opening.result.createObjectStore("rows");
  const db = await request(opening), campaign = 'quotes"\\unicode\u2764';
  try {
    let tx = db.transaction("rows", "readwrite"), complete = done(tx);
    for (let n = 0; n <= 9001; n++) tx.objectStore("rows").put({ version: n }, key(campaign, n));
    tx.objectStore("rows").put({ neighbor: true }, key(campaign + "x", 1)); await complete;
    vi.stubGlobal("IDBKeyRange", fallback ? undefined : IDBKeyRange);
    const deletion = vi.spyOn(IDBObjectStore.prototype, "delete");
    tx = db.transaction("rows", "readwrite"); complete = done(tx);
    await deleteJournalKeyRange(tx.objectStore("rows"), key(campaign, 0), key(campaign, 8999), request); await complete;
    expect(deletion).toHaveBeenCalledTimes(fallback ? 9000 : 1);
    tx = db.transaction("rows", "readonly");
    expect(await request(tx.objectStore("rows").getAllKeys())).toEqual([key(campaign, 9000), key(campaign, 9001), key(campaign + "x", 1)].sort());
  } finally { db.close(); }
});

it("rolls back the whole range on transaction abort", async () => {
  vi.stubGlobal("IDBKeyRange", IDBKeyRange);
  const opening = new IDBFactory().open("abort", 1); opening.onupgradeneeded = () => opening.result.createObjectStore("rows"); const db = await request(opening);
  try {
    let tx = db.transaction("rows", "readwrite"), complete = done(tx); tx.objectStore("rows").put("exact", "a"); await complete;
    tx = db.transaction("rows", "readwrite"); complete = done(tx); const failure = expect(complete).rejects.toThrow("aborted");
    await deleteJournalKeyRange(tx.objectStore("rows"), "a", "z", request); tx.abort(); await failure;
    expect(await request(db.transaction("rows").objectStore("rows").get("a"))).toBe("exact");
  } finally { db.close(); }
});
