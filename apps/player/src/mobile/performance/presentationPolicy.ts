/** This gate owns presentation only. It has no session, timer or command access. */
export class MobileMapPresentationPolicy {
  private covered = false;
  private pageHidden = false;
  private resync = false;

  get hidden(): boolean { return this.covered || this.pageHidden; }

  setCovered(covered: boolean): void {
    if (covered && !this.hidden) this.resync = true;
    this.covered = covered;
  }

  setPageHidden(hidden: boolean): void {
    // Remember even a background interval with no Phaser update at all.
    if (hidden && !this.hidden) this.resync = true;
    this.pageHidden = hidden;
  }

  beginFrame(): { draw: boolean; resync: boolean } {
    if (this.hidden) return { draw: false, resync: false };
    const resync = this.resync;
    this.resync = false;
    return { draw: true, resync };
  }
}

/** A bottom sheet leaves the live map visible, including the Build catalog. */
export function mobileMapIsCovered(tab: string, sheetKind: "full" | "bottom" | null, modal = false): boolean {
  if (modal || sheetKind === "full") return true;
  if (sheetKind === "bottom") return false;
  return tab !== "clinic" && tab !== "build";
}

/**
 * Keep layout and Phaser pointer coordinates in CSS pixels. Only the phone's
 * Canvas renderer transform/backing bitmap uses the capped physical resolution.
 */
export function mobileCanvasSize(width: number, height: number, devicePixelRatio = 1) {
  const logicalWidth = Math.max(1, Math.floor(width));
  const logicalHeight = Math.max(1, Math.floor(height));
  const pixelRatio = Number.isFinite(devicePixelRatio) ? Math.min(2, Math.max(1, devicePixelRatio)) : 1;
  return { width: logicalWidth, height: logicalHeight, pixelRatio,
    backingWidth: Math.round(logicalWidth * pixelRatio), backingHeight: Math.round(logicalHeight * pixelRatio) };
}
