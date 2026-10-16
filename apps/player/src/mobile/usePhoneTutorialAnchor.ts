import { useEffect, useState, type RefObject } from "react";
import type { TutorialStepView } from "../session/tutorialViewModels";
import type { PhoneTutorialTarget } from "./tutorialTargets";
import { findPhoneTutorialAnchor } from "./tutorialTargets";
import { revealPhoneControl } from "./phoneScroll";
import type { MobileSheetId } from "./navigation";

export function usePhoneTutorialAnchor(root: RefObject<HTMLElement | null>, step: TutorialStepView | null, target: PhoneTutorialTarget | null, sheet?: MobileSheetId) {
  const key = `${step?.id}:${target?.kind}:${target?.selector}`;
  const [missing, setMissing] = useState<string | null>(null);
  useEffect(() => {
    if (!root.current || !step || !target) { setMissing(null); return; }
    const control = findPhoneTutorialAnchor(root.current, target, step);
    const node = control ?? findPhoneTutorialAnchor(root.current, { ...target, kind: "tab", selector: `[data-mobile-tab="${target.tab}"]` }, step);
    setMissing(control || sheet === target.tab ? null : key);
    if (!node) return;
    node.setAttribute("data-mobile-coach-anchor", "true");
    if (control && target.kind === "control") revealPhoneControl(node);
    return () => node.removeAttribute("data-mobile-coach-anchor");
  }, [root, key, step?.patientEncounterId, sheet]);
  return target?.kind === "tab" || missing === key ? target?.tab ?? null : null;
}
