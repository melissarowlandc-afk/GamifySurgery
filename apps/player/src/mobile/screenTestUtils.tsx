import { createInitialGameState } from "@gamify-surgery/game-domain";
import { createPrototypePlayerView } from "../session/viewModels";
import type { PrototypeShellProps } from "../shellContract";
export { allElements, cleanupPhoneTests, phoneTestDom } from "../ui/testDomHarness";

export const noop = () => undefined;
export function phoneFixture(overrides: Partial<PrototypeShellProps> = {}): PrototypeShellProps {
  const view = createPrototypePlayerView(createInitialGameState(), null, false, null);
  return new Proxy({ ...view, paused: false, simulationSpeed: 1, employeeDiscussion: null,
    buildMode: false, managementMode: false, buildUndoCount: 0, buildExitBlockedReason: null, buildExitBlockedIssues: [],
    placementOrientation: 0, campaigns: [], systemNotices: [], questionReviewFlags: [], tutorialsEnabled: false,
    tutorialTargetEncounterId: null, tutorialStep: null, announcement: "", ...overrides,
  }, { get(target, key) { return Reflect.has(target, key) ? Reflect.get(target, key) : typeof key === "string" && key.startsWith("on") ? noop : undefined; } }) as PrototypeShellProps;
}

