import { act } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { AppShell } from "../AppShell";
import MobileShell from "../mobile/MobileShell";
import { AuthAccountContext } from "../auth/AuthAccountContext";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../mobile/screenTestUtils";
import { createFreshProfile } from "../session/prototypeStorage";
import { usePrototypeSession, type PrototypeSession } from "../session/usePrototypeSession";
import { createPrototypePlayerView } from "../session/viewModels";
import { getCommandFeedback, showCommandProblem } from "../diagnostics/problemDiagnostics";
import { restrictedOfficeFixture } from "./roomAccessTestSupport";
import { CloudGameSession } from "../session/cloud/gameSession";
import { CloudSyncCoordinator } from "../session/cloud/coordinator";
import { FakeCloudServer } from "../session/cloud/fakeTransport";
import { MemoryCloudCache } from "../session/cloud/cache";
import { codecTestCampaign } from "../session/cloud/codecTestSupport";
import { snapshotCopy } from "../session/cloud/snapshotCodec";
import { TestCloudClock } from "../session/cloud/syncTestSupport";
import { MobileBuildControls } from "../mobile/build/MobileBuildControls";
import { useMobileBuild } from "../mobile/build/useMobileBuild";
import { previewMobilePlacement } from "../mobile/build/buildSession";
import { ActionFeedbackLayer } from "./ActionFeedbackLayer";

vi.mock("../facility", () => ({ FacilityCanvas: () => <div>Map</div> }));
vi.mock("../mobile/map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Map</div> }));
afterEach(async () => { await cleanupPhoneTests(); showCommandProblem(null); vi.restoreAllMocks(); });

it.each(["phone", "desktop"] as const)("keeps a real hire rejection visible over the %s management panel for local and hosted play", async layout => {
  for (const hosted of [false, true]) {
    const env = phoneTestDom(), { state } = restrictedOfficeFixture(); state.paused = true;
    Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
    let cloud: CloudGameSession | null = null;
    if (hosted) {
      const clock = new TestCloudClock(), server = new FakeCloudServer(clock.wallNow), campaign = codecTestCampaign(JSON.stringify(state));
      server.setAccess("account-a", { snapshotSaves: true });
      server.seed("account-a", await snapshotCopy(state, campaign, "1", clock.wall, { branchId: "action.feedback", sequence: 0, parents: [] }));
      const coordinator = new CloudSyncCoordinator({ scope: { backendId: "test", accountId: "account-a", campaignId: state.campaignId }, cache: new MemoryCloudCache(), transport: server.transport("account-a"), clock, enabled: true });
      expect(await coordinator.open()).toBe(true); expect(await coordinator.startWriter()).toBe(true); expect(coordinator.resume()).toBe(true);
      cloud = await CloudGameSession.create(coordinator);
    }
    const profile = { ...createFreshProfile(), tutorialsEnabled: false, activeCampaignId: state.campaignId,
      tutorialGuidanceByCampaign: { [state.campaignId]: { version: 2 as const, mode: "off" as const, exposedTopicIds: [] } },
      campaigns: [{ campaignId: state.campaignId, name: "Access test", status: "resumable" as const, createdAtRealMs: state.createdAtRealMs, updatedAtRealMs: state.createdAtRealMs, state }] };
    let current!: PrototypeSession;
    function Game() {
      current = usePrototypeSession({ profile, notice: "Synthetic test" }, cloud ?? undefined);
      const view = createPrototypePlayerView(current.state, null, false, current.selectedRoomDefinitionId, current.buildMode, current.selectedRoomInstanceId);
      const props = phoneFixture({ ...view, paused: current.state.paused, managementMode: current.managementMode,
        buildMode: current.buildMode, onEnterManagementMode: current.enterManagementMode, onExitManagementMode: current.exitManagementMode,
        onHireStaff: current.hireStaff, onDecreaseEmployeeSalary: current.decreaseEmployeeSalary, onIncreaseEmployeeSalary: current.increaseEmployeeSalary,
        onFireEmployee: current.fireEmployee, announcement: current.announcement });
      return layout === "phone" ? <MobileShell {...props} /> : <AppShell {...props} />;
    }
    try {
      await env.render(<AuthAccountContext.Provider value={hosted ? "account-a" : null}><Game /></AuthAccountContext.Provider>);
      if (layout === "phone") { await env.click("Manage"); await env.click("Role details for Surgeon"); }
      else await env.click("Enter Management Mode");
      const hire = env.find(element => element.tagName === "BUTTON" && element.attributes["data-staff-role-hire"] !== undefined && (element.attributes["aria-label"] ?? "").includes("Surgeon"));
      if (layout === "desktop") expect(hire.attributes["aria-label"]).toMatch(/^Hire \$/);
      await act(async () => { const click = new Event("click"); Object.defineProperty(click, "target", { value: hire }); env.doc.dispatchEvent(click); });
      await env.clickElement(hire);
      const message = allElements(env.doc.body, element => element.attributes["data-action-feedback"] === "rejection")[0]!;
      expect(message?.attributes["aria-live"]).toBe("assertive"); expect(message.textContent).toContain("Surgeon's Office");
      expect(message.textContent).toContain("Ambulatory OR"); expect(message.textContent).toContain("hallway or waiting area");
      expect(message.textContent).not.toContain("Send a problem report");
      expect(current.state.employees).toHaveLength(0); expect(current.state.cashCents).toBe(state.cashCents);
      expect(Object.values(current.state.operationReceipts).some(row => row.commandType === "HIRE_STAFF" && row.status === "rejected")).toBe(true);
      if (cloud) { expect(cloud.canExecute).toBe(true); expect(await cloud.durable()).toBe(true); }
      expect(getCommandFeedback()?.kind).toBe("rejection");
    } finally { await act(async () => env.root.unmount()); cloud?.dispose(); showCommandProblem(null); }
  }
});

it("shows a collapsed desktop role's disabled Hire reason beside its control", async () => {
  const { state, office } = restrictedOfficeFixture(); state.rooms = state.rooms.filter(room => room.id !== office.id);
  const env = phoneTestDom();
  await env.render(<AppShell {...phoneFixture({ ...createPrototypePlayerView(state, null, false, null), managementMode: true })} />);
  const reason = env.find(element => element.attributes.class === "staff-role-hire-reason" && element.textContent.includes("Surgeon's Office"));
  const hire = env.find(element => element.attributes["aria-describedby"] === reason.attributes.id);
  expect(hire.attributes.disabled).toBeDefined(); expect(reason.textContent).toContain("hire a Surgeon");
});

it("shows the restricted access warning beside the phone's Place confirmation before committing anything", async () => {
  const env = phoneTestDom(), f = restrictedOfficeFixture();
  f.state.rooms = f.state.rooms.filter(room => room.id !== f.office.id); f.state.doors = f.state.doors.filter(door => door.roomId !== f.office.id);
  const original = JSON.stringify(f.state), placed = vi.fn();
  const props = phoneFixture({ ...createPrototypePlayerView(f.state, null, false, "room.surgeon_office", true), buildMode: true,
    onPlaceRoom: placed, mobileBuildActions: {
      previewPlacement: (x, y, orientation) => previewMobilePlacement(f.state, "room.surgeon_office", null, x, y, orientation),
      previewDoor: () => ({ valid: false, reason: "unused", cost: 0 }), previewHallway: () => ({ cells: [], buildCells: [], cost: 0, reason: null }), commitHallway: () => false,
    } });
  let build!: ReturnType<typeof useMobileBuild>;
  function Preview() { build = useMobileBuild(props, null, () => {}); return <MobileBuildControls props={props} build={build} onCatalog={() => {}} />; }
  await env.render(<Preview />);
  await act(async () => build.map!.onIntent({ kind: "ghost", point: { x: f.office.x, y: f.office.y } }));
  const warning = env.find(element => element.attributes.class === "room-access-warning");
  expect(warning.attributes.role).toBe("status"); expect(warning.textContent).toContain("Ambulatory OR");
  const confirm = env.find(element => element.attributes["data-phone-build-confirm"] === "placement");
  expect(confirm.attributes.disabled).toBeUndefined(); expect(placed).not.toHaveBeenCalled(); expect(JSON.stringify(f.state)).toBe(original);
});

it.each(["phone", "desktop"] as const)("warns at the successful %s room placement without changing its accepted command", async layout => {
  const env = phoneTestDom(), f = restrictedOfficeFixture();
  f.state.rooms = f.state.rooms.filter(room => room.id !== f.office.id); f.state.doors = f.state.doors.filter(door => door.roomId !== f.office.id);
  f.state.paused = true; Object.assign(env.browser, { setInterval: vi.fn(() => 1), clearInterval: vi.fn() });
  const profile = { ...createFreshProfile(), tutorialsEnabled: false, activeCampaignId: f.state.campaignId,
    campaigns: [{ campaignId: f.state.campaignId, name: "Build access test", status: "resumable" as const, createdAtRealMs: f.state.createdAtRealMs, updatedAtRealMs: f.state.createdAtRealMs, state: f.state }] };
  let current!: PrototypeSession;
  function Game() {
    current = usePrototypeSession({ profile, notice: "Test" });
    return <><button type="button" onClick={() => current.placeRoom(f.office.x, f.office.y)}>Confirm room</button><ActionFeedbackLayer shell={layout} /></>;
  }
  await env.render(<Game />); await act(async () => current.enterBuildMode()); await act(async () => current.beginPlacement("room.surgeon_office"));
  const button = env.button("Confirm room");
  await act(async () => { const click = new Event("click"); Object.defineProperty(click, "target", { value: button }); env.doc.dispatchEvent(click); });
  await env.clickElement(button);
  const warning = allElements(env.doc.body, element => element.attributes["data-action-feedback"] === "warning")[0]!;
  expect(warning.textContent).toContain("Ambulatory OR"); expect(warning.textContent).not.toContain("Send a problem report");
  expect(current.state.rooms.some(room => room.roomDefinitionId === "room.surgeon_office")).toBe(true);
  expect(Object.values(current.state.operationReceipts).some(row => row.commandType === "PLACE_ROOM" && row.status === "applied")).toBe(true);
});
