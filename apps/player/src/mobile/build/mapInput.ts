import type { GridPoint } from "@gamify-surgery/game-domain";
import { rasterizeGridLine } from "../../facility/hallwayPainting";
import { MAP_TOUCH_THRESHOLDS, type TouchPoint } from "../map/gestures";
import type { MobileBuildMapState } from "./types";

export interface BuildGrid { originX: number; originY: number; tileSize: number; columns?: number; rows?: number }
interface Contact { id: number; start: TouchPoint; point: TouchPoint; grab: TouchPoint; now: number; ghost: GridPoint | null; before: readonly GridPoint[]; cells: GridPoint[]; last: GridPoint | null; ownsDrag: boolean }

/** Phone input only: it emits preview intents and has no purchase/door commands. */
export class PhoneBuildMapInput {
  private contact: Contact | null = null;
  constructor(private read: () => MobileBuildMapState | null, private grid: () => BuildGrid,
    private footprint: () => { width: number; height: number } | null,
    private viewport?: () => { width: number; height: number }) {}

  down(id: number, point: TouchPoint, now: number): void {
    const state = this.read(); const grid = this.grid(); const size = this.footprint();
    const ghost = state?.ghost ?? null;
    const nearGhost = Boolean(ghost && size && point.x >= grid.originX + ghost.x * grid.tileSize - 22 &&
      point.y >= grid.originY + ghost.y * grid.tileSize - 22 &&
      point.x <= grid.originX + (ghost.x + size.width) * grid.tileSize + 22 &&
      point.y <= grid.originY + (ghost.y + size.height) * grid.tileSize + 22);
    this.contact = { id, start: { x: point.x, y: point.y }, point: { x: point.x, y: point.y },
      grab: { x: (point.x - grid.originX) / grid.tileSize - (ghost?.x ?? 0), y: (point.y - grid.originY) / grid.tileSize - (ghost?.y ?? 0) }, now, ghost: ghost ? { x: ghost.x, y: ghost.y } : null,
      before: state?.hallway?.cells.map(({ x, y }) => ({ x, y })) ?? [], cells: [], last: null,
      ownsDrag: Boolean(state?.hallway || nearGhost) };
    if (state?.hallway) this.paint(point);
  }
  get ownsDrag(): boolean { return this.contact?.ownsDrag === true; }
  get ghostDrag() { const contact = this.contact; return contact?.ownsDrag && contact.ghost && !this.read()?.hallway &&
    Math.hypot(contact.point.x - contact.start.x, contact.point.y - contact.start.y) >= MAP_TOUCH_THRESHOLDS.movement
    ? { id: contact.id, point: contact.point } : null; }
  move(id: number, point: TouchPoint): void {
    const contact = this.contact; const state = this.read();
    if (!contact || contact.id !== id || !state) return;
    contact.point = { x: point.x, y: point.y };
    if (state.hallway) this.paint(point);
    else if (contact.ownsDrag && contact.ghost) {
      const grid = this.grid();
      const viewport = this.viewport?.(); const size = this.footprint();
      // At an edge the virtual grab point stays inside the whole footprint.
      // Camera drift then moves across world tiles without clipping the ghost.
      const bounded = (value: number, grab: number, extent: number, screen: number) => {
        const margin = grid.tileSize;
        const low = grab * grid.tileSize + margin;
        const high = screen - (extent - grab) * grid.tileSize - margin;
        return low <= high ? Math.max(low, Math.min(high, value)) : screen / 2;
      };
      const x = viewport && size ? bounded(point.x, contact.grab.x, size.width, viewport.width) : point.x;
      const y = viewport && size ? bounded(point.y, contact.grab.y, size.height, viewport.height) : point.y;
      state.onIntent({ kind: "ghost", point: { x: Math.round((x - grid.originX) / grid.tileSize - contact.grab.x),
        y: Math.round((y - grid.originY) / grid.tileSize - contact.grab.y) } });
    }
  }
  up(id: number, point: TouchPoint, now: number): boolean {
    const contact = this.contact;
    if (!contact || contact.id !== id) return false;
    this.move(id, point); this.contact = null;
    return !contact.ownsDrag && now - contact.now <= MAP_TOUCH_THRESHOLDS.tapDuration &&
      Math.hypot(point.x - contact.start.x, point.y - contact.start.y) < MAP_TOUCH_THRESHOLDS.movement;
  }
  /** A second finger or cancellation discards only the current unconfirmed drag. */
  cancel(restore = true): void {
    const contact = this.contact; this.contact = null;
    const state = this.read();
    if (!restore || !contact || !state) return;
    if (state.hallway) state.onIntent({ kind: "hallway", cells: contact.before });
    else if (contact.ownsDrag && contact.ghost) state.onIntent({ kind: "ghost", point: contact.ghost });
  }
  private paint(point: TouchPoint): void {
    const contact = this.contact; const state = this.read(); if (!contact || !state) return;
    const grid = this.grid();
    const tile = { x: Math.floor((point.x - grid.originX) / grid.tileSize), y: Math.floor((point.y - grid.originY) / grid.tileSize) };
    // Match desktop gridPointAtPointer: off-site samples do not advance a stroke.
    if (tile.x < 0 || tile.y < 0 || tile.x >= (grid.columns ?? Infinity) || tile.y >= (grid.rows ?? Infinity)) return;
    const line = contact.last ? rasterizeGridLine(contact.last, tile) : [tile];
    contact.last = tile;
    const visited = new Set(contact.cells.map(cell => `${cell.x}:${cell.y}`));
    for (const cell of line) if (!visited.has(`${cell.x}:${cell.y}`)) {
      visited.add(`${cell.x}:${cell.y}`); contact.cells.push(cell);
    }
    state.onIntent({ kind: "hallway", cells: [...contact.cells] });
  }
}
