/** A synchronous presentation projection may ask the same pure question many
 * times. This scope never survives that projection and is never installed by a
 * reducer, so mutable simulation phases and subsequent reads remain fresh.
 * Callers must include every argument and only memoize pure, read-only results.
 */
interface Entries { children: Map<unknown, Entries>; hasValue: boolean; value?: unknown }
const entries = (): Entries => ({ children: new Map(), hasValue: false });
let scope: Map<symbol, Entries> | null = null;

export function withReadonlyProjectionMemo<T>(read: () => T): T {
  const previous = scope; scope = new Map();
  try { return read(); } finally { scope = previous; }
}

export function readonlyProjectionMemo<T>(namespace: symbol, args: readonly unknown[], read: () => T): T {
  if (!scope) return read();
  let root = scope.get(namespace);
  if (!root) { root = entries(); scope.set(namespace, root); }
  let node: Entries = root;
  for (const arg of args) {
    let next: Entries | undefined = node.children.get(arg);
    if (!next) { next = entries(); node.children.set(arg, next); }
    node = next;
  }
  if (!node.hasValue) { const value = read(); node.value = value; node.hasValue = true; }
  return node.value as T;
}
