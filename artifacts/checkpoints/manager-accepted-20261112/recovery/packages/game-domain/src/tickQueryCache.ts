/** Share a pure query only inside one unchanged simulation snapshot. The
 * caller owns this closure; nothing survives a tick, mutation or context. */
export function memoizeSnapshotQuery<K, V>(query: (key: K) => V): (key: K) => V {
  const values = new Map<K, V>();
  return key => {
    if (values.has(key)) return values.get(key)!;
    const value = query(key); values.set(key, value); return value;
  };
}
