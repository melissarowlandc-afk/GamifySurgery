interface Bounds { left: number; top: number; right: number; bottom: number }

/** All build anchors share one tray. Clip its available rectangle, including
 * session links that can protrude above the footer, rather than moving a
 * particular button or covering navigation with a higher stacking order. */
export function mobileBuildControlInsets(workspace: Bounds, viewport: Bounds,
  hud?: Bounds, navigation?: Bounds, sessionStrip?: Bounds) {
  let left = Math.max(workspace.left, viewport.left), right = Math.min(workspace.right, viewport.right);
  let top = Math.max(workspace.top, viewport.top), bottom = Math.min(workspace.bottom, viewport.bottom);
  const overlaps = (box: Bounds) => box.right > box.left && box.bottom > box.top &&
    box.right > left && box.left < right && box.bottom > top && box.top < bottom;
  if (hud && overlaps(hud)) top = Math.max(top, hud.bottom);
  const side = navigation && (navigation.right <= workspace.left || navigation.left >= workspace.right ||
    (navigation.top <= workspace.top && navigation.bottom >= workspace.bottom && navigation.right - navigation.left < workspace.right - workspace.left));
  const onLeft = navigation && navigation.left + navigation.right <= workspace.left + workspace.right;
  for (const box of [navigation, sessionStrip]) {
    if (!box || !overlaps(box)) continue;
    if (side) {
      if (onLeft) left = Math.max(left, box.right);
      else right = Math.min(right, box.left);
    } else bottom = Math.min(bottom, box.top);
  }
  return { left: Math.max(0, left - workspace.left), right: Math.max(0, workspace.right - right),
    bottom: Math.max(0, workspace.bottom - bottom), maxHeight: Math.max(0, bottom - top) };
}

function ancestor(element: HTMLElement, className: string): HTMLElement | null {
  for (let node = element.parentElement; node; node = node.parentElement) {
    if ((node.getAttribute("class") ?? "").split(/\s+/).includes(className)) return node;
  }
  return null;
}

export function observeMobileBuildControls(element: HTMLElement, onHeight: (height: number) => void): () => void {
  const workspace = ancestor(element, "mobile-workspace"), shell = ancestor(element, "mobile-shell");
  const hud = shell?.querySelector<HTMLElement>(".mobile-top-bar");
  const navigation = shell?.querySelector<HTMLElement>(".mobile-navigation");
  const strip = shell?.querySelector<HTMLElement>(".mobile-session-strip");
  const viewport = window.visualViewport;
  const measure = () => {
    let clearance = 0;
    if (workspace) {
      // The workspace already lies within the shell's safe-area padding and
      // below the HUD. Intersect again with the visible viewport (keyboard,
      // browser chrome, pinch/scroll) and actual navigation rectangles.
      const frame = viewport ? { left: viewport.offsetLeft, top: viewport.offsetTop,
        right: viewport.offsetLeft + viewport.width, bottom: viewport.offsetTop + viewport.height }
        : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
      const insets = mobileBuildControlInsets(workspace.getBoundingClientRect(), frame,
        hud?.getBoundingClientRect(), navigation?.getBoundingClientRect(), strip?.getBoundingClientRect());
      element.style.left = `${insets.left}px`; element.style.right = `${insets.right}px`;
      element.style.bottom = `${insets.bottom}px`; element.style.maxHeight = `${insets.maxHeight}px`;
      clearance = insets.bottom;
    }
    const height = element.getBoundingClientRect().height;
    // Map and catalog/room sheets must reserve the same unobstructed tray,
    // including the gap for protruding session links.
    if (height > 0) onHeight(Math.ceil(height + clearance));
  };
  measure();
  const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
  for (const node of [element, workspace, hud, navigation, strip]) if (node) observer?.observe(node);
  window.addEventListener("resize", measure);
  viewport?.addEventListener("resize", measure); viewport?.addEventListener("scroll", measure);
  return () => {
    observer?.disconnect(); window.removeEventListener("resize", measure);
    viewport?.removeEventListener("resize", measure); viewport?.removeEventListener("scroll", measure);
  };
}
