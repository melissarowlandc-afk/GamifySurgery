/** Presentation-only guard bands. Actor routes still advance outside this
 * window; only decoded poses/display payloads are culled. */
export function phoneActorInWindow(point: { x: number; y: number },
  viewport: { width: number; height: number }, tileSize: number): boolean {
  const margin = Math.max(48, tileSize * 2);
  return point.x >= -margin && point.x <= viewport.width + margin &&
    point.y >= -margin && point.y <= viewport.height + margin;
}
export function phoneActorWindowKey(layout: { originX: number; originY: number; tileSize: number },
  viewport: { width: number; height: number }): string {
  const size = Math.max(1, layout.tileSize);
  return [Math.floor(-layout.originX / size), Math.floor(-layout.originY / size),
    Math.ceil((viewport.width - layout.originX) / size), Math.ceil((viewport.height - layout.originY) / size)].join(":");
}
