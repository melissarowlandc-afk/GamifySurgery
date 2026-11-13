import { afterEach, expect, it, vi } from "vitest";
import { yieldRuntimeTask } from "./runtimeCatalogue";

afterEach(() => vi.unstubAllGlobals());
it("closes both temporary ports after each finite boot yield", async () => {
  let opened = 0, closed = 0;
  vi.stubGlobal("MessageChannel", class {
    port1 = { onmessage: (() => {}) as () => void, onmessageerror: null, close: () => closed++ };
    port2 = { postMessage: () => queueMicrotask(() => this.port1.onmessage()), close: () => closed++ };
    constructor() { opened += 2; }
  });
  await Promise.all(Array.from({ length: 20 }, () => yieldRuntimeTask()));
  expect(opened).toBe(40); expect(closed).toBe(opened);
});
it("still yields if channels are unavailable or their construction fails", async () => {
  vi.stubGlobal("MessageChannel", undefined); await yieldRuntimeTask();
  vi.stubGlobal("MessageChannel", class { constructor() { throw Error("unavailable"); } }); await yieldRuntimeTask();
});
