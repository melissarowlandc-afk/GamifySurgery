/** One accepted order for commands, undo and checkpoint baseline changes.
 * Barriers capture the prefix at invocation; later ticks cannot prolong them.
 */
export class OrderedSessionWork {
  private serial: Promise<void> = Promise.resolve();
  private count = 0;
  get pending(): number { return this.count; }
  run<T>(work: () => T | Promise<T>): Promise<T> {
    this.count++;
    const result = this.serial.then(work).finally(() => { this.count--; });
    this.serial = result.then(() => {}, () => {});
    return result;
  }
  settled(): Promise<void> { return this.serial; }
}
