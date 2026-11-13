import { readFileSync } from "node:fs";
import { expect, it, vi } from "vitest";

const source = readFileSync(new URL("../../public/startup-recovery.js", import.meta.url), "utf8");
function fixture() {
  const listeners = new Map<string, (event: unknown) => void>();
  const root = { childNodes: [] as unknown[], textContent: "", appendChild(node: unknown) { this.childNodes.push(node); } };
  const reload = vi.fn(), write = vi.fn(), disconnect = vi.fn(); let mutation = () => {}, portal = false;
  const button = { textContent: "", addEventListener: (_type: string, callback: () => void) => { click = callback; } }; let click = () => {};
  const browser = { addEventListener: (type: string, callback: (event: unknown) => void) => listeners.set(type, callback),
    removeEventListener: (type: string) => listeners.delete(type), location: { reload }, localStorage: { setItem: write, removeItem: write } };
  const doc = { getElementById: () => root, querySelector: () => portal ? {} : null, createElement: () => button, body: {} };
  const Observer = class { constructor(callback: () => void) { mutation = callback; } observe() {} disconnect = disconnect; };
  new Function("window", "document", "MutationObserver", source)(browser, doc, Observer);
  return { listeners, root, reload, write, disconnect, button, click: () => click(), mutation: () => mutation(), setPortal: () => { portal = true; } };
}
it.each(["error", "unhandledrejection"])("shows a manual recovery action after %s without changing saves or reloading automatically", type => {
  const f = fixture(), prevented = vi.fn();
  f.listeners.get(type)!({ type, target: { tagName: "SCRIPT" }, preventDefault: prevented });
  expect(f.root.textContent).toContain("Your saves have not changed"); expect(f.button.textContent).toBe("Reload");
  expect(f.reload).not.toHaveBeenCalled(); expect(f.write).not.toHaveBeenCalled();
  expect(f.listeners.size).toBe(0); expect(f.disconnect).toHaveBeenCalledOnce();
  f.click(); expect(f.reload).toHaveBeenCalledOnce();
});
it("releases both startup listeners and its observer after first content, and ignores optional art failures", () => {
  const f = fixture();
  f.listeners.get("error")!({ type: "error", target: { tagName: "IMG" } }); expect(f.root.textContent).toBe("");
  f.root.childNodes.push({}); f.mutation(); expect(f.listeners.size).toBe(0); expect(f.disconnect).toHaveBeenCalledOnce();
  const portal = fixture(); portal.setPortal(); portal.mutation(); expect(portal.listeners.size).toBe(0);
  expect(portal.reload).not.toHaveBeenCalled(); expect(portal.write).not.toHaveBeenCalled();
});
