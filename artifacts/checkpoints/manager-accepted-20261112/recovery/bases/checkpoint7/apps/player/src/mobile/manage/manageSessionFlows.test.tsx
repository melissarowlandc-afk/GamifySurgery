import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createInitialGameState } from "@gamify-surgery/game-domain";
import { usePrototypeSession, type PrototypeSession } from "../../session/usePrototypeSession";
import { createFreshProfile, type LoadedPrototypeProfile } from "../../session/prototypeStorage";
import { ManagementPanel } from "../../ui/ManagementPanel";
import type { PrototypeShellProps } from "../../shellContract";
import MobileShell from "../MobileShell";
import { cleanupPhoneTests, phoneTestDom, phoneFixture } from "../screenTestUtils";
import { createManageFixture, employeeFixture, roleFixture } from "./testFixtures";

vi.mock("../map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div data-testid="facility-canvas">Live map</div> }));
afterEach(cleanupPhoneTests);

function profile(paused: boolean): LoadedPrototypeProfile {
  const state = createInitialGameState(); state.paused = paused;
  return { notice: "Fixture profile restored", profile: { ...createFreshProfile(), activeCampaignId: state.campaignId,
    tutorialsEnabled: false, tutorialIntroDismissedCampaignIds: [state.campaignId], campaigns: [{ campaignId: state.campaignId,
      name: "Fixture clinic", createdAtRealMs: 0, updatedAtRealMs: 0, status: "resumable", state }] } };
}

describe("Manage pause/restoration through the real shared session", () => {
  it.each([false, true])("matches desktop with an initially paused=%s clinic for Done, header, tab and browser Back", async (initiallyPaused) => {
    for (const exit of ["desktop Done", "Done", "Close Manage", "Clinic", "browser Back"]) {
      const env = phoneTestDom(); Object.assign(env.doc, { visibilityState: "visible" });
      Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
      const loaded = profile(initiallyPaused); let current: PrototypeSession | null = null;
      function SessionScreen() {
        const session = usePrototypeSession(loaded); current = session;
        const props = { ...createManageFixture(), managementMode: session.managementMode,
          onEnterManagementMode: session.enterManagementMode, onExitManagementMode: session.exitManagementMode };
        return exit === "desktop Done" ? <ManagementPanel managementMode={props.managementMode} roles={props.staffRoles} serviceIncome={props.serviceIncome}
          onEnterManagementMode={session.enterManagementMode} onExitManagementMode={session.exitManagementMode} onHire={session.hireStaff}
          onDecreaseSalary={session.decreaseEmployeeSalary} onIncreaseSalary={session.increaseEmployeeSalary} onFire={session.fireEmployee}
          onAppointmentsEnabledChange={session.setServiceAppointmentsEnabled} onStartLaboratoryProcessing={session.startLaboratoryProcessing} />
          : <MobileShell {...phoneFixture({ ...props, paused: session.state.paused, onTogglePause: session.togglePause,
            onSimulationSpeedChange: session.setSimulationSpeed, buildMode: session.buildMode })} />;
      }
      await env.render(<SessionScreen />);
      const session = () => current as unknown as PrototypeSession;
      const tick = session().state.facilityTick;
      expect(session().state.paused).toBe(initiallyPaused); expect(session().managementMode).toBe(false);
      await env.click(exit === "desktop Done" ? "Enter Management Mode" : "Manage");
      expect(session().managementMode).toBe(true); expect(session().state.paused).toBe(true);
      await env.click("Services"); await env.click("Money"); expect(session().state.paused).toBe(true);
      if (exit !== "desktop Done") expect(env.button("Resume facility time").attributes.disabled).toBe("");
      if (exit === "browser Back") await env.back(); else await env.click(exit === "desktop Done" ? "Done" : exit);
      expect(session().managementMode).toBe(false); expect(session().state.paused).toBe(initiallyPaused);
      expect(session().state.facilityTick).toBe(tick); expect(session().state.simulationSpeed).toBe(1);
      const pauseCommands = Object.values(session().state.operationReceipts).filter((receipt) => receipt.commandType === "SET_PAUSED");
      expect(pauseCommands).toHaveLength(initiallyPaused ? 0 : 2);
      await act(async () => env.root.unmount());
    }
  });
});

describe("MobileShell Manage callback wiring and mode transitions", () => {
  it("wires every native action to its supplied session callback with the original arguments", async () => {
    const actions = { onHireStaff: vi.fn(), onFireEmployee: vi.fn(), onDecreaseEmployeeSalary: vi.fn(), onIncreaseEmployeeSalary: vi.fn(),
      onTrainEmployee: vi.fn(), onPraiseEmployee: vi.fn(), onServiceAppointmentsEnabledChange: vi.fn(), onStartLaboratoryProcessing: vi.fn(), onAdvertisingLevelChange: vi.fn() };
    const env = phoneTestDom(); const props = phoneFixture({ ...createManageFixture(), ...actions, paused: true, managementMode: true,
      advertising: { ...createManageFixture().advertising, currentLevel: 1, canIncrease: true } });
    await env.render(<MobileShell {...props} />); await env.click("Role details for Receptionist"); await env.click("Hire Receptionist"); await env.click(`Employee details for ${employeeFixture.displayName}`);
    await env.click(`Decrease ${employeeFixture.displayName}'s salary`); await env.click(`Increase ${employeeFixture.displayName}'s salary`);
    await env.click(`Praise ${employeeFixture.displayName}`); await env.click(`Train ${employeeFixture.displayName}`);
    await env.clickElement(env.find((node) => node.tagName === "BUTTON" && node.textContent === "Train $500" && node.parentNode?.parentNode?.attributes.role === "dialog"));
    await env.click(`Fire ${employeeFixture.displayName}`); await env.click("Confirm Fire");
    await env.click("Back to Receptionist"); await env.click("Back to employee roles");
    await env.click("Services"); await env.click("Off"); await env.click("On"); await env.click("Queue laboratory work");
    await env.click("Money"); await env.click("Advertising"); await env.click("Increase advertising");
    expect(actions.onHireStaff.mock.calls).toEqual([[roleFixture.id]]);
    for (const action of [actions.onFireEmployee, actions.onDecreaseEmployeeSalary, actions.onIncreaseEmployeeSalary, actions.onTrainEmployee, actions.onPraiseEmployee]) expect(action.mock.calls).toEqual([[employeeFixture.id]]);
    expect(actions.onServiceAppointmentsEnabledChange.mock.calls).toEqual([[false], [true]]);
    expect(actions.onStartLaboratoryProcessing.mock.calls).toEqual([[]]); expect(actions.onAdvertisingLevelChange.mock.calls).toEqual([[2]]);
  });
  it("waits for the session to exit Manage before entering Build and applying the same setup definition", async () => {
    const exit = vi.fn(); const enter = vi.fn(); const place = vi.fn(); const pause = vi.fn(); const env = phoneTestDom();
    let props = phoneFixture({ ...createManageFixture(), paused: true, onExitManagementMode: exit, onEnterBuildMode: enter, onBeginPlacement: place, onTogglePause: pause });
    await env.render(<MobileShell {...props} />); await env.click("Services"); await env.click("Needs setup · 2 services"); await env.click("Service details for Fixture missing setup"); await env.click("Build Laboratory");
    expect(exit.mock.calls).toEqual([[]]); expect(enter).not.toHaveBeenCalled(); expect(place).not.toHaveBeenCalled();
    expect(env.button("Manage").attributes["aria-current"]).toBe("page");
    props = phoneFixture({ ...props, managementMode: false, paused: false }); await env.render(<MobileShell {...props} />);
    expect(enter.mock.calls).toEqual([[]]); expect(place).not.toHaveBeenCalled();
    props = phoneFixture({ ...props, buildMode: true, paused: true }); await env.render(<MobileShell {...props} />);
    expect(place.mock.calls).toEqual([["room.laboratory"]]); expect(pause).not.toHaveBeenCalled();
  });
  it("a service Hire shortcut only highlights the same role, without hiring before the player presses Hire", async () => {
    const hire = vi.fn(); const env = phoneTestDom(); const props = phoneFixture({ ...createManageFixture(), paused: true, managementMode: true,
      staffRoles: [{ ...roleFixture, id: "staff.laboratory_technician", displayName: "Laboratory Technician" }], onHireStaff: hire });
    await env.render(<MobileShell {...props} />); await env.click("Services"); await env.click("Needs setup · 2 services"); await env.click("Service details for Fixture missing setup"); await env.click("Hire Laboratory Technician");
    expect(env.button("Employees").attributes["aria-selected"]).toBe("true"); expect(hire).not.toHaveBeenCalled();
    await env.click("Hire Laboratory Technician"); expect(hire.mock.calls).toEqual([["staff.laboratory_technician"]]);
    await env.click("Services"); await env.click("Needs setup · 2 services"); await env.click("Service details for Fixture missing setup"); await env.click("Hire Laboratory Technician");
    expect(env.button("Employees").attributes["aria-selected"]).toBe("true"); expect(hire.mock.calls).toEqual([["staff.laboratory_technician"]]);
  });
});
