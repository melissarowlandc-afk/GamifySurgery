export interface TouchPoint { x: number; y: number }
export type MapGesture =
  | { kind: "pan"; from: TouchPoint; to: TouchPoint }
  | { kind: "pinch"; from: TouchPoint; to: TouchPoint; scale: number }
  | { kind: "tap"; point: TouchPoint };

export const MAP_TOUCH_THRESHOLDS = {
  movement: 8,
  tapDuration: 250,
} as const;

interface Contact {
  start: TouchPoint;
  point: TouchPoint;
  startedAt: number;
  moved: boolean;
}
const distance = (a: TouchPoint, b: TouchPoint) => Math.hypot(a.x - b.x, a.y - b.y);
const midpoint = (a: TouchPoint, b: TouchPoint): TouchPoint => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
// Phaser x/y are prototype getters backed by a mutable Vector2, not own fields.
const copyPoint = (point: TouchPoint): TouchPoint => ({ x: point.x, y: point.y });

/** CSS-pixel intent only. No simulation, DOM, camera, or command dependencies. */
export class MapTouchGestures {
  private contacts = new Map<number, Contact>();
  private multiple = false;

  get activeCount() { return this.contacts.size; }
  get hadMultipleTouches() { return this.multiple; }

  down(id: number, point: TouchPoint, now: number): MapGesture[] {
    if (this.contacts.has(id)) return [];
    if (this.contacts.size === 0) this.multiple = false;
    this.contacts.set(id, { start: copyPoint(point), point: copyPoint(point), startedAt: now, moved: false });
    if (this.contacts.size > 1) {
      this.multiple = true;
    }
    return [];
  }

  move(id: number, point: TouchPoint): MapGesture[] {
    const contact = this.contacts.get(id);
    if (!contact) return [];
    const before = [...this.contacts.values()].map((item) => item.point);
    const previous = contact.point;
    contact.point = copyPoint(point);
    if (this.contacts.size >= 2) {
      const after = [...this.contacts.values()].map((item) => item.point);
      const oldDistance = distance(before[0]!, before[1]!);
      const nextDistance = distance(after[0]!, after[1]!);
      return [{ kind: "pinch", from: midpoint(before[0]!, before[1]!),
        to: midpoint(after[0]!, after[1]!), scale: oldDistance > 0 && nextDistance > 0 ? nextDistance / oldDistance : 1 }];
    }
    // A remaining finger after a pinch cannot become a tap or a Build stroke.
    if (this.multiple) return [];
    const wasMoving = contact.moved;
    if (distance(contact.start, point) >= MAP_TOUCH_THRESHOLDS.movement) contact.moved = true;
    if (!contact.moved) return [];
    return [{ kind: "pan", from: wasMoving ? previous : contact.start, to: copyPoint(point) }];
  }

  up(id: number, point: TouchPoint, now: number): MapGesture[] {
    const contact = this.contacts.get(id);
    if (!contact) return [];
    const gestures = this.move(id, point);
    this.contacts.delete(id);
    if (this.multiple || contact.moved || now - contact.startedAt > MAP_TOUCH_THRESHOLDS.tapDuration) {
      if (this.contacts.size === 0) this.multiple = false;
      return gestures;
    }
    return [{ kind: "tap", point: copyPoint(point) }];
  }

  cancel() {
    this.contacts.clear();
    this.multiple = false;
  }
}
