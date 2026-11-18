import { afterEach, expect, it, vi } from "vitest";
import { bindOpeningFrame, CLINIC_PRESENTATION_EVENT, CLINIC_PRESENTATION_RETRY, type ClinicPresentation } from "./clinicPresentation";
import { cleanupPhoneTests, phoneTestDom } from "./testDomHarness";

afterEach(cleanupPhoneTests);
it("requires an art-ready post-render, removes its frame listener, and retries only presentation", () => {
  const env = phoneTestDom(), host = env.element as unknown as HTMLElement;
  const frames = new Set<() => void>(), retry = vi.fn(), notices = vi.fn();
  const events = { on: (event: string, fn: () => void) => { expect(event).toBe("postrender"); frames.add(fn); },
    off: (_event: string, fn: () => void) => frames.delete(fn) };
  let status: ClinicPresentation = "waiting";
  host.addEventListener(CLINIC_PRESENTATION_EVENT, notices);
  const stop = bindOpeningFrame(host, events, () => status, retry);
  expect(notices).toHaveBeenCalledOnce(); // The new canvas invalidates an old frame immediately.
  for (const frame of frames) frame();
  expect(host.getAttribute("data-clinic-frame")).toBe("waiting"); expect(notices).toHaveBeenCalledOnce();
  status = "failed"; for (const frame of frames) frame();
  expect(host.getAttribute("data-clinic-frame")).toBe("failed");
  host.dispatchEvent(new Event(CLINIC_PRESENTATION_RETRY)); expect(retry).toHaveBeenCalledOnce();
  status = "ready"; expect(host.getAttribute("data-clinic-frame")).toBe("failed");
  for (const frame of frames) frame();
  expect(host.getAttribute("data-clinic-frame")).toBe("ready"); expect(frames.size).toBe(0);
  stop(); expect(host.getAttribute("data-clinic-frame")).toBeNull();
  host.dispatchEvent(new Event(CLINIC_PRESENTATION_RETRY)); expect(retry).toHaveBeenCalledOnce();
});
