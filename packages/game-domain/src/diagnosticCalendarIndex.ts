/** Forecast-local index only. Updating interval values retains insertion order;
 * adding/removing keys invalidates every prefix, including same-size changes.
 * No state, forecast result or history survives the owning calendar. */
export class DiagnosticCalendarIndex<T> extends Map<string, T> {
  private readonly prefixes = new Map<string, string[]>();
  constructor(entries?: Iterable<readonly [string, T]>) {
    super();
    if (entries) for (const [key, value] of entries) super.set(key, value);
  }
  override set(key: string, value: T): this {
    if (!this.has(key)) this.prefixes.clear();
    return super.set(key, value);
  }
  override delete(key: string): boolean {
    const removed = super.delete(key); if (removed) this.prefixes.clear(); return removed;
  }
  override clear(): void { super.clear(); this.prefixes.clear(); }
  keysWithPrefix(prefix: string): readonly string[] {
    let keys = this.prefixes.get(prefix);
    if (!keys) {
      keys = [...this.keys()].filter(key => key.startsWith(prefix));
      this.prefixes.set(prefix, keys);
      if (this.prefixes.size > 512) this.prefixes.delete(this.prefixes.keys().next().value!);
    }
    return keys;
  }
}
