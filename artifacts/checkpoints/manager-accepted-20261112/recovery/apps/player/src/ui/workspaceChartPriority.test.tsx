import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { AppShell } from "../AppShell";
import { showCommandProblem } from "../diagnostics/problemDiagnostics";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { createFreshProfile, type LoadedPrototypeProfile } from "../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../session/usePrototypeSession";
import { createPrototypePlayerView } from "../session/viewModels";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div data-testid="facility-canvas">Map</div> }));
afterEach(async () => { await cleanupPhoneTests(); showCommandProblem(null); });

describe("desktop patient tabs with the real Management session", () => {
  it.each(["approaching", "checked_in"] as const)("honors check-in=%s rather than hiding a chart behind Management", async checkInStatus => {
    const env = phoneTestDom();
    Object.assign(env.browser, { innerWidth: 1280, innerHeight: 720, setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
    Object.assign(env.doc, { visibilityState: "visible" });
    const state = createInitialGameState();
    const patient = Object.values(state.encounters)[0]!;
    patient.checkInStatus = checkInStatus;
    patient.checkInWaitingSinceTick = null;
    patient.patientMovement = null;
    patient.lifecycle = "active_action_required";
    state.openChartEncounterId = null;
    state.paused = true;
    const loaded: LoadedPrototypeProfile = { notice: "Chart-priority fixture", profile: {
      ...createFreshProfile(), activeCampaignId: state.campaignId, tutorialsEnabled: false,
      tutorialIntroDismissedCampaignIds: [state.campaignId], campaigns: [{ campaignId: state.campaignId,
        name: "Chart priority clinic", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable", state }],
    } };
    let session!: PrototypeSession;
    function Screen() {
      session = usePrototypeSession(loaded);
      const view = createPrototypePlayerView(session.state, session.state.openChartEncounterId, session.summaryVisible, null);
      return <AppShell {...phoneFixture({ ...view, managementMode: session.managementMode,
        paused: session.state.paused, announcement: session.announcement,
        onEnterManagementMode: session.enterManagementMode, onExitManagementMode: session.exitManagementMode,
        onOpenPatient: session.openPatient, onCloseChart: session.closeChart })} />;
    }
    await env.render(<Screen />);
    await env.click("Enter Management Mode");
    expect(session.managementMode).toBe(true);
    await env.click("Show clinic panels");
    await env.clickElement(env.find(node => node.attributes["data-patient-chart-id"] === patient.id));
    expect(session.managementMode).toBe(false);
    if (checkInStatus === "checked_in") {
      expect(session.state.openChartEncounterId).toBe(patient.id);
      const sheets = allElements(env.doc.body, node => node.attributes.class?.split(" ").includes("chart-sheet") === true);
      expect(sheets).toHaveLength(1);
      expect(env.element.textContent).not.toContain("Enter Management Mode");
      await env.clickElement(allElements(sheets[0]!, node => node.attributes["aria-label"] === "Close patient chart")[0]!);
      expect(session.state.openChartEncounterId).toBeNull();
      expect(env.button("Enter Management Mode")).toBeDefined();
    } else {
      expect(session.state.openChartEncounterId).toBeNull();
      const feedback = env.doc.body.textContent;
      expect(feedback).toContain("The patient has not checked in at the Front Desk yet.");
      expect(feedback).toContain("Can't do that yet");
    }
    expect(session.state.paused).toBe(true);
    expect(session.state.facilityTick).toBe(state.facilityTick);
  });
});
