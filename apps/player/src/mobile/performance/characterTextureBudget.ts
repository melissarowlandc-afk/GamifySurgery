import { phoneMemoryProfile } from "./phoneMemoryPolicy";

/** Phone-only decoded texture lifetime. Live/queued textures are always pinned;
 * retired identities/poses compete for a bounded LRU instead of accumulating
 * the entire character catalogue. No character or gameplay data is changed. */
export class CharacterTextureBudget {
  private readonly rows = new Map<string, { bytes: number; family?: string }>();
  private bytes = 0;
  constructor(private readonly maxBytes?: number,
    private readonly maxTextures?: number,
    private readonly keepLiveFamilies?: boolean) {}
  get retainedBytes(): number { return this.bytes; }
  get size(): number { return this.rows.size; }
  register(key: string, width: number, height: number): void {
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;
    const family = this.rows.get(key)?.family;
    this.bytes -= this.rows.get(key)?.bytes ?? 0;
    this.rows.delete(key); const bytes = width * height * 4;
    this.rows.set(key, { bytes, family }); this.bytes += bytes;
  }
  touch(key: string, family?: string): void {
    const row = this.rows.get(key);
    if (row === undefined) return;
    if (family) row.family = family;
    this.rows.delete(key); this.rows.set(key, row);
  }
  trim(pinned: ReadonlySet<string>, remove: (key: string) => void, liveFamilies: ReadonlySet<string> = new Set()): void {
    const profile = phoneMemoryProfile(), maxBytes = this.maxBytes ?? profile.textureBytes,
      maxTextures = this.maxTextures ?? profile.textureCount, keepLiveFamilies = this.keepLiveFamilies ?? profile.keepLiveFamilies;
    if (this.bytes <= maxBytes && this.rows.size <= maxTextures) return;
    for (const [key, row] of this.rows) {
      if (pinned.has(key) || keepLiveFamilies && row.family && liveFamilies.has(row.family)) continue;
      remove(key); this.rows.delete(key); this.bytes -= row.bytes;
      if (this.bytes <= maxBytes && this.rows.size <= maxTextures) break;
    }
  }
}
