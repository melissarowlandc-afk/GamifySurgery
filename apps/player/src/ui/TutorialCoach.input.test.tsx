import { Children, isValidElement, type ReactElement } from "react";
import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { createInitialGameState, gameReducer } from "@gamify-surgery/game-domain";
import { TutorialCoach } from "./TutorialCoach";
import type { TutorialStepView } from "../session/tutorialViewModels";

// Test the actual rendered handlers without a browser. Geometry is covered by
// tutorialPositioning tests and the browser spec; this supplies a settled layout.
const layout = vi.hoisted(() => ({
  signature: ["first-patient-arriving", "waiting-patient", ".patient-folder.is-waiting", "", ""].join("\u001f"),
  position: {top: 20, left: 20, width: 340, maxHeight: 220, arrowOffset: 40, placement: "right", docked: false},
  beacon: {top: 20, left: 380, direction: "right"},
}));
vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useId: () => "tutorial-input-test",
  useRef: () => ({current: null}),
  useState: () => [layout, () => undefined],
  useEffect: () => undefined,
  useLayoutEffect: () => undefined,
}));

const step: TutorialStepView = {
  id: "first-patient-arriving", eyebrow: "First visit", title: "Incoming paperwork",
  body: "Check-in happens automatically at the Front Desk.",
  target: "waiting-patient", targetSelector: ".patient-folder.is-waiting",
};
type ElementProps = {className?: string; children?: React.ReactNode; onClick?: (event: Event) => void;
  onPointerDown?: (event: Event) => void; onPointerUp?: (event: Event) => void};

function findElement(node: React.ReactNode, className: string): ReactElement<ElementProps> {
  const found: ReactElement<ElementProps>[] = [];
  const visit = (child: React.ReactNode) => {
    if (!isValidElement<ElementProps>(child)) return;
    if (child.props.className?.split(" ").includes(className)) found.push(child);
    Children.forEach(child.props.children, visit);
  };
  Children.forEach(node, visit);
  if (!found[0]) throw new Error(`Missing actual rendered ${className}`);
  return found[0];
}

describe("tutorial surfaces absorb map gestures", () => {
  it.each(["tutorial-coach", "tutorial-target-beacon"])("clicking %s never issues a founder move", (className) => {
    const element = findElement(TutorialCoach({step}), className);
    let state = createInitialGameState();
    const original = structuredClone(state.environment);
    const move = vi.fn(() => {
      state = gameReducer(state, {type: "MOVE_FOUNDER", destination: {x: 36, y: 30}, operationId: "overlay-click-move"});
    });
    for (const [handler, eventType] of [["onPointerDown", "pointerdown"], ["onPointerUp", "pointerup"], ["onClick", "click"]] as const) {
      const event = new Event(eventType, {bubbles: true, cancelable: true});
      expect(element.props[handler]).toBeTypeOf("function");
      element.props[handler]!(event);
      if (!event.cancelBubble) move();
      expect(event.defaultPrevented).toBe(false); // Native controls retain their default behavior.
    }
    expect(move).not.toHaveBeenCalled();
    expect(state.environment).toEqual(original);
    expect(state.operationReceipts["overlay-click-move"]).toBeUndefined();
    const css = readFileSync(new URL("../styles/global.css", import.meta.url), "utf8");
    const rules = [...css.matchAll(new RegExp(`\\.${className}\\s*\\{([^}]+)\\}`, "g"))].map((match) => match[1]);
    expect(rules.at(-1)).toMatch(/pointer-events:\s*auto/); // No click-through before handlers can run.
  });

  it("keeps Skip guidance usable while stopping the parent click", () => {
    const disable = vi.fn();
    const tree = TutorialCoach({step, onDisableTutorials: disable});
    const event = new Event("click", {bubbles: true, cancelable: true});
    findElement(tree, "tutorial-disable-button").props.onClick!(event);
    findElement(tree, "tutorial-coach").props.onClick!(event);
    expect(disable).toHaveBeenCalledOnce();
    expect(event.cancelBubble).toBe(true);
    expect(event.defaultPrevented).toBe(false);
  });
});
