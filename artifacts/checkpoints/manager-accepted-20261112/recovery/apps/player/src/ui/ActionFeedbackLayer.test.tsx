import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { ActionFeedbackLayer, actionFeedbackPosition } from "./ActionFeedbackLayer";
import { allElements, cleanupPhoneTests, phoneTestDom } from "./testDomHarness";
import { getCommandFeedback, getCommandProblem, showCommandProblem } from "../diagnostics/problemDiagnostics";
import { testElementProps, type TestElement } from "../mobile/testDom";

vi.mock("../feedback/TesterFeedback", () => ({ ProblemReportButton: () => <button type="button">Send a problem report</button> }));
afterEach(async () => { showCommandProblem(null); await cleanupPhoneTests(); vi.restoreAllMocks(); });

function press(doc: ReturnType<typeof phoneTestDom>["doc"], target: TestElement, kind: "click" | "keydown" | "pointerdown" = "click") {
  const event = new Event(kind); Object.defineProperty(event, "target", { value: target });
  if (kind === "keydown") Object.defineProperty(event, "key", { value: "Enter" });
  doc.dispatchEvent(event);
}

it.each(["phone", "desktop"] as const)("shows a repeated rejection at the clicked %s control with a live region and no report suggestion", async shell => {
  const env = phoneTestDom(); env.browser.innerWidth = shell === "phone" ? 390 : 1280;
  const reject = () => showCommandProblem("The Surgeon can't reach the Surgeon's Office. Give it a door to a hallway.", "rejection");
  await env.render(<><section role="dialog" aria-label="Employees"><button type="button" onClick={reject}>Hire Surgeon</button></section><ActionFeedbackLayer shell={shell} /></>);
  const hire = env.button("Hire Surgeon"); hire.getBoundingClientRect = () => ({ x: 80, y: 220, top: 220, left: 80, right: 240, bottom: 264, width: 160, height: 44 });
  await act(async () => press(env.doc, hire)); await env.clickElement(hire);
  const messages = () => allElements(env.doc.body, element => element.attributes["data-action-feedback"] === "rejection");
  expect(messages()).toHaveLength(1); expect(messages()[0]!.attributes.role).toBe("alert");
  expect(messages()[0]!.attributes["aria-live"]).toBe("assertive"); expect(messages()[0]!.textContent).toContain("Surgeon's Office");
  expect(messages()[0]!.textContent).not.toContain("Send a problem report");
  const first = getCommandFeedback()!.id;
  const dismiss = allElements(env.doc.body, element => element.attributes["aria-label"] === "Dismiss action message")[0]!;
  await act(async () => { (testElementProps(dismiss).onClick as () => void)(); });
  expect(messages()).toHaveLength(0);
  await act(async () => press(env.doc, hire, "keydown")); await env.clickElement(hire);
  expect(messages()).toHaveLength(1); expect(getCommandFeedback()!.id).toBeGreaterThan(first);
  expect(getCommandProblem()).toContain("Surgeon");
});

it("keeps genuine errors reportable above an open panel and warnings free of report buttons", async () => {
  const env = phoneTestDom(); await env.render(<ActionFeedbackLayer shell="phone" />);
  await act(async () => showCommandProblem("Device saving could not start. Keep the app open and send a problem report."));
  let message = allElements(env.doc.body, element => element.attributes["data-action-feedback"] !== undefined)[0]!;
  expect(message.textContent).toContain("Send a problem report");
  await act(async () => showCommandProblem("Staff can't walk through the OR.", "warning"));
  message = allElements(env.doc.body, element => element.attributes["data-action-feedback"] !== undefined)[0]!;
  expect(message.textContent).toContain("Check room access"); expect(message.textContent).not.toContain("Send a problem report");
});

it("keeps a canvas placement warning through pointerup/click of the same gesture", async () => {
  let now = 0; vi.spyOn(Date, "now").mockImplementation(() => now);
  const env = phoneTestDom();
  await env.render(<><canvas onPointerDown={() => showCommandProblem("Staff can't walk through the OR.", "warning")} /><ActionFeedbackLayer shell="desktop" /></>);
  const canvas = env.find(element => element.tagName === "CANVAS");
  await act(async () => { press(env.doc, canvas, "pointerdown"); (testElementProps(canvas).onPointerDown as () => void)(); });
  expect(allElements(env.doc.body, element => element.attributes["data-action-feedback"] === "warning")).toHaveLength(1);
  now = 2_500; // A long press is still the same gesture; no elapsed-time guess.
  await act(async () => press(env.doc, canvas));
  expect(allElements(env.doc.body, element => element.attributes["data-action-feedback"] === "warning")).toHaveLength(1);
});

it("dismisses the old local message on the next action, and Escape clears feedback without sending a command", async () => {
  const env = phoneTestDom(); const command = vi.fn();
  await env.render(<><button type="button" onClick={command}>Another action</button><ActionFeedbackLayer shell="desktop" /></>);
  await act(async () => showCommandProblem("Not enough cash.", "rejection"));
  await act(async () => press(env.doc, env.button("Another action")));
  expect(allElements(env.doc.body, element => element.attributes["data-action-feedback"] !== undefined)).toHaveLength(0);
  await act(async () => showCommandProblem("Not enough cash.", "rejection"));
  await act(async () => env.doc.dispatchEvent(Object.assign(new Event("keydown"), { key: "Escape" })));
  expect(getCommandProblem()).toBeNull(); expect(command).not.toHaveBeenCalled();
});

it.each([[390, 844], [375, 667], [1280, 720], [1440, 1000]])("places the message beside its control and within a %s x %s viewport", (width, height) => {
  const anchor = { left: width - 180, right: width - 20, top: height - 72, bottom: height - 28 };
  const position = actionFeedbackPosition(anchor, width, height, 180);
  expect(position.left).toBeGreaterThanOrEqual(12); expect(position.left + position.width).toBeLessThanOrEqual(width - 12);
  expect(position.top).toBeGreaterThanOrEqual(12); expect(position.top + 180).toBeLessThanOrEqual(anchor.top);
  const below = actionFeedbackPosition({ left: 24, right: 160, top: 80, bottom: 124 }, width, height, 100);
  expect(below.top).toBe(132);
});
