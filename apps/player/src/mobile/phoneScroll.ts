/** Scroll only the owning phone surface, never the document or desktop workspace. */
export function revealPhoneControl(element: HTMLElement): void {
  const scroller = element.closest?.<HTMLElement>(".mobile-chart-scroll, .mobile-sheet-body");
  if (!scroller) return;
  const target = element.getBoundingClientRect();
  const viewport = scroller.getBoundingClientRect();
  if (target.top < viewport.top) scroller.scrollTop += target.top - viewport.top - 8;
  else if (target.bottom > viewport.bottom) scroller.scrollTop += Math.min(target.top - viewport.top - 8, target.bottom - viewport.bottom + 8);
}
