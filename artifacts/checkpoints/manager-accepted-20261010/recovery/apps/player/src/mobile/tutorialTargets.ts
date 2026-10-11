import type { TutorialStepView, TutorialTarget } from "../session/tutorialViewModels";
import type { MobileSheetId, MobileTab } from "./navigation";

export const MOBILE_TAB_LABELS: Record<MobileTab, string> = { clinic: "Clinic", patients: "Patients", alerts: "Alerts", manage: "Manage", build: "Build" };
export type PhoneMapFocus = { kind: "entrance" | "water" | "litter" | "patient" | "room"; id?: string; key: string };
export interface PhoneTutorialTarget {
  kind: "control" | "tab" | "map";
  tab: MobileTab;
  selector: string;
  label: string;
  mapFocus?: PhoneMapFocus;
}
interface TargetSpec { tab: MobileTab; anchors: readonly string[]; label: string; map?: PhoneMapFocus["kind"] }
// Phone markers only. Never fall back to TutorialStepView.targetSelector.
const TARGETS = {
  "waiting-patient": { tab: "patients", anchors: ["patient"], label: "the marked patient card" },
  "existing-patient": { tab: "patients", anchors: ["patient"], label: "the marked patient card" },
  chart: { tab: "patients", anchors: ["chart"], label: "the chart" },
  "answer-choices": { tab: "patients", anchors: ["choice"], label: "an answer choice" },
  "chart-feedback": { tab: "patients", anchors: ["primary", "feedback"], label: "the chart action" },
  "encounter-summary": { tab: "patients", anchors: ["summary", "primary"], label: "the chart summary" },
  "flip-chart": { tab: "patients", anchors: ["summary-toggle", "primary"], label: "More disease information" },
  "resolve-chart": { tab: "patients", anchors: ["primary"], label: "the pinned chart action" },
  "facility-entrance": { tab: "clinic", anchors: ["map"], label: "the Front Desk", map: "entrance" },
  "facility-clock": { tab: "clinic", anchors: ["pause"], label: "the clock controls" },
  alerts: { tab: "alerts", anchors: ["alerts"], label: "Alerts" },
  "waiting-actions": { tab: "clinic", anchors: ["emergency"], label: "GLP-1 consult" },
  goals: { tab: "clinic", anchors: ["goals", "goals-chip"], label: "Goals" },
  "level-up": { tab: "clinic", anchors: ["advance", "goals-chip"], label: "Goals and Advance" },
  "build-mode": { tab: "build", anchors: ["build-catalog"], label: "Build" },
  "exam-room-option": { tab: "build", anchors: ["exam-option", "build-catalog"], label: "Choose Examination Room" },
  "facility-placement": { tab: "build", anchors: ["place"], label: "the ghost and ✓ Place" },
  "room-selection": { tab: "build", anchors: ["exam-owned", "build-catalog"], label: "the Examination Room in My Rooms" },
  "door-tool": { tab: "build", anchors: ["doors-active", "doors", "build-catalog"], label: "Doors: tap a legal wall or an existing door" },
  "exit-build-mode": { tab: "build", anchors: ["build-done"], label: "Done" },
  management: { tab: "manage", anchors: ["hire", "employees"], label: "the Employees hire controls" },
} as const satisfies Record<TutorialTarget, TargetSpec>;

export const phoneAnchorSelector = (anchor: string) => `[data-phone-anchor="${anchor}"]`;
const tabTarget = (tab: MobileTab): PhoneTutorialTarget => ({ kind: "tab", tab,
  selector: `[data-mobile-tab="${tab}"]`, label: MOBILE_TAB_LABELS[tab] });

export function resolveMobileTutorialTarget(step: TutorialStepView | null,
  context: { sheet?: MobileSheetId; buildMode?: boolean } = {}): PhoneTutorialTarget | null {
  if (!step) return null;
  const specialMap = step.id === "sendout-trash" ? "litter" : step.id === "sendout-water" ? "water" : undefined;
  const spec: TargetSpec = specialMap ? { tab: "clinic", anchors: ["map"], label: specialMap === "water" ? "the water cooler" : "the highlighted litter", map: specialMap } : TARGETS[step.target];
  const chartVisible = context.sheet === "chart" || context.sheet === "discussion";
  const mapVisible = context.sheet === undefined || context.sheet === "inspector";
  const buildVisible = context.buildMode && (mapVisible || context.sheet === "room" || context.sheet === "build");
  const alwaysVisible = step.target === "facility-clock";
  const visible = alwaysVisible || (spec.map ? mapVisible : spec.tab === "build" ? buildVisible
    : spec.tab === "patients" ? context.sheet === "patients" || chartVisible
      : spec.tab === "clinic" ? mapVisible || context.sheet === "goals" || context.sheet === "emergency"
        : context.sheet === spec.tab);
  if (!visible) return tabTarget(spec.tab);
  let anchors = spec.anchors;
  if (spec.tab === "patients" && !chartVisible) anchors = ["patient"];
  if (spec.tab === "patients" && chartVisible && (step.target === "waiting-patient" || step.target === "existing-patient")) anchors = ["chart"];
  return { kind: spec.map ? "map" : "control", tab: spec.tab, label: spec.label,
    selector: anchors.map(phoneAnchorSelector).join(", "),
    ...(spec.map ? { mapFocus: { kind: spec.map, key: step.id, id: step.patientEncounterId } } : {}) };
}

/** Only actual, visible phone elements qualify; a missing control falls back to its tab. */
export function findPhoneTutorialAnchor(root: HTMLElement, target: PhoneTutorialTarget, step: TutorialStepView): HTMLElement | null {
  for (const selector of target.selector.split(", ")) {
    const candidates = [...root.querySelectorAll<HTMLElement>(selector)];
    if (step.patientEncounterId) candidates.sort((a, b) => Number(b.dataset.patientId === step.patientEncounterId) - Number(a.dataset.patientId === step.patientEncounterId));
    const element = candidates.find(node => {
      if (node.closest('[hidden], details:not([open]) > :not(summary)')) return false;
      const rect = node.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    });
    if (element) return element;
  }
  return null;
}
