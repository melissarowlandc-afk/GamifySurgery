import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { getOperationalGlp1AutomationCapacity, PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext } from "../../../../../tests/fixtures/level-four-rooms";
import { createAppAppointmentsQaState } from "../../../../../tests/fixtures/app-appointments";
import { createPrototypePlayerView } from "../../session/viewModels";
import { MobileGlp1ConsultChip, MobileGlp1ConsultInfo } from "../MobileQuickControls";
import { withGlp1NpHiredQaState } from "./glp1QaFixture";

describe("MB10 GLP-1-NP-hired disposable QA state", () => {
  it("uses real build/door/hire receipts, has operational coverage, hides the chip and retains information", () => {
    const context = createLevelFourRoomsQaContext();
    const original = createAppAppointmentsQaState(context);
    const before = JSON.stringify(original);
    const state = withGlp1NpHiredQaState(original, context);
    expect(JSON.stringify(original)).toBe(before);
    for (const id of ["mb10.qa.glp1.suite", "mb10.qa.glp1.door", "mb10.qa.glp1.hire"]) expect(state.operationReceipts[id]?.status).toBe("applied");
    expect(getOperationalGlp1AutomationCapacity(state, context)).toBe(1);
    const balance = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
    try {
      PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease;
      const view = createPrototypePlayerView(state, null, false, null).emergencyGlp1;
      expect(view.automationCapacity).toBe(1);
      expect(renderToStaticMarkup(<MobileGlp1ConsultChip view={view} onConsult={() => {}} />)).toBe("");
      expect(renderToStaticMarkup(<MobileGlp1ConsultInfo view={view} />)).toContain(view.statusLabel);
    } finally { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = balance; }
  });
});
