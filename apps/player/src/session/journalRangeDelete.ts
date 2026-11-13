/** Same inclusive string-key interval in one IndexedDB mutation. Transactions
 * and their completion/abort acknowledgment remain owned by the journal. */
export async function deleteJournalKeyRange(store: IDBObjectStore, lower: string, upper: string,
  request: <T>(value: IDBRequest<T>) => Promise<T>): Promise<void> {
  if (lower > upper) return;
  if (typeof IDBKeyRange !== "undefined") {
    await request(store.delete(IDBKeyRange.bound(lower, upper)));
    return;
  }
  // Older test/embedded hosts without the global key-range constructor.
  for (const key of await request(store.getAllKeys()))
    if (typeof key === "string" && key >= lower && key <= upper) await request(store.delete(key));
}
