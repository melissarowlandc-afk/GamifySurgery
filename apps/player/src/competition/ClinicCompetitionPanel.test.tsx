import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ManagementPanel } from "../ui/ManagementPanel";
import { MobileManage } from "../mobile/manage/MobileManage";
import { createManageFixture } from "../mobile/manage/testFixtures";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../mobile/screenTestUtils";
import { CompetitionClient } from "./competitionClient";
import { CompetitionClientContext } from "./useCompetition";
import { COMPETITION_PRIVACY_NOTICE, type CompetitionBoard } from "./types";
import { fakeTransport } from "./testFixtures";

const access = vi.hoisted(() => ({ casual: false as boolean | null }));
vi.mock("../playtime/UsageProvider", () => ({ useCasualMode: () => access.casual, useUsageTracking: () => null }));
afterEach(() => { access.casual = false; return cleanupPhoneTests(); });
const sampleBoard: CompetitionBoard = { hidden: false, rows: [
  { rank: 1, clinicName: "Other clinic", facilityLevel: 4, averageDailyRevenueCents: 123456, daysCounted: 3, isSelf: false },
  { rank: 2, clinicName: "My clinic", facilityLevel: 2, averageDailyRevenueCents: 10001, daysCounted: 2, isSelf: true },
] };

function Manage({ shell }: { shell: "desktop" | "phone" }) {
  const p = createManageFixture();
  return shell === "phone" ? <MobileManage {...p} /> : <ManagementPanel managementMode roles={p.staffRoles}
    serviceIncome={p.serviceIncome} onEnterManagementMode={p.onEnterManagementMode} onExitManagementMode={p.onExitManagementMode}
    onHire={p.onHireStaff} onDecreaseSalary={p.onDecreaseEmployeeSalary} onIncreaseSalary={p.onIncreaseEmployeeSalary}
    onFire={p.onFireEmployee} onAppointmentsEnabledChange={p.onServiceAppointmentsEnabledChange}
    onStartLaboratoryProcessing={p.onStartLaboratoryProcessing} />;
}
async function open(shell: "desktop" | "phone", client: CompetitionClient | null) {
  const env = phoneTestDom();
  await env.render(<CompetitionClientContext.Provider value={client}><Manage shell={shell} /></CompetitionClientContext.Provider>);
  await env.click("Clinic Competition");
  return env;
}
describe.each(["desktop", "phone"] as const)("%s Management competition tab", shell => {
  it("lets casual accounts view/refresh the board with a note and no entry or ranking toggle", async () => {
    access.casual = true;
    const transport = fakeTransport({ ...sampleBoard, rows: sampleBoard.rows.slice(0, 1) });
    const env = await open(shell, new CompetitionClient(transport, null, "casual"));
    expect(env.element.textContent).toContain("Casual players aren't ranked");
    expect(env.element.textContent).toContain("Other clinic");
    expect(env.element.textContent).not.toContain("Your clinic will appear");
    expect(allElements(env.element, node => node.attributes.role === "switch")).toHaveLength(0);
    await env.click("Refresh competition");
    expect(transport.leaderboard).toHaveBeenCalledTimes(2);
    expect(transport.submit).not.toHaveBeenCalled();
    expect(transport.setHidden).not.toHaveBeenCalled();
  });
  it("shows a sign-in explanation without a network client in prototype mode", async () => {
    const env = await open(shell, null);
    expect(env.element.textContent).toContain("available when signed in");
    expect(allElements(env.element, node => node.attributes.role === "switch")).toHaveLength(0);
  });
  it("refreshes on open/reopen, formats dollars and highlights only the caller's row", async () => {
    const transport = fakeTransport(sampleBoard), env = await open(shell, new CompetitionClient(transport, null, "a"));
    expect(transport.leaderboard).toHaveBeenCalledTimes(1);
    expect(env.element.textContent).toContain("Average daily revenue");
    expect(env.element.textContent).toContain("$1,234.56"); expect(env.element.textContent).toContain("$100.01");
    expect(env.element.textContent).toContain(COMPETITION_PRIVACY_NOTICE);
    expect(allElements(env.element, node => node.attributes.class === "competition-self")).toHaveLength(1);
    expect(allElements(env.element, node => node.attributes.class === "competition-self")[0]!.textContent).toContain("My clinic");
    await env.click("Money"); await env.click("Clinic Competition");
    expect(transport.leaderboard).toHaveBeenCalledTimes(2);
  });
  it("shows loading, an empty board, a recoverable error and manual refresh", async () => {
    const transport = fakeTransport(); let resolve!: (board: CompetitionBoard) => void;
    transport.leaderboard.mockImplementationOnce(() => new Promise(res => { resolve = res; }));
    const env = await open(shell, new CompetitionClient(transport, null, "a"));
    expect(env.element.textContent).toContain("Loading Clinic Competition...");
    await act(async () => resolve({ hidden: false, rows: [] }));
    expect(env.element.textContent).toContain("No clinics yet. Complete a game day");
    transport.leaderboard.mockRejectedValueOnce(new Error("offline")); await env.click("Refresh competition");
    expect(env.element.textContent).toContain("could not be refreshed");
    transport.leaderboard.mockResolvedValue(sampleBoard); await env.click("Refresh competition");
    expect(env.element.textContent).toContain("My clinic");
    expect(allElements(env.element, node => node.attributes.role === "alert")).toHaveLength(0);
  });
  it("confirms hiding and unhiding through the server and keeps a hidden own row visible", async () => {
    const transport = fakeTransport(sampleBoard); let hidden = false;
    transport.setHidden.mockImplementation(async value => { hidden = value; });
    transport.leaderboard.mockImplementation(async () => ({ hidden, rows: sampleBoard.rows.map(row => ({ ...row, rank: row.isSelf && hidden ? null : row.rank })) }));
    const env = await open(shell, new CompetitionClient(transport, null, "a"));
    const toggle = () => env.find(node => node.attributes.role === "switch");
    expect(toggle().attributes["aria-checked"]).toBe("false");
    await env.clickElement(toggle()); expect(transport.setHidden).toHaveBeenLastCalledWith(true);
    expect(toggle().attributes["aria-checked"]).toBe("true"); expect(env.element.textContent).toContain("hidden from other players");
    expect(env.element.textContent).toContain("HiddenMy clinic");
    await env.clickElement(toggle()); expect(transport.setHidden).toHaveBeenLastCalledWith(false);
    expect(toggle().attributes["aria-checked"]).toBe("false");
  });
  it("does not claim a failed visibility write succeeded", async () => {
    const transport = fakeTransport(sampleBoard), env = await open(shell, new CompetitionClient(transport, null, "a"));
    transport.setHidden.mockRejectedValueOnce(new Error("offline"));
    await env.clickElement(env.find(node => node.attributes.role === "switch"));
    expect(env.find(node => node.attributes.role === "switch").attributes["aria-checked"]).toBe("false");
    expect(env.element.textContent).toContain("visibility could not be confirmed");
  });
  it("keeps a confirmed hide switch on if the following refresh fails", async () => {
    const transport = fakeTransport(sampleBoard), env = await open(shell, new CompetitionClient(transport, null, "a"));
    transport.leaderboard.mockRejectedValueOnce(new Error("offline"));
    await env.clickElement(env.find(node => node.attributes.role === "switch"));
    expect(env.find(node => node.attributes.role === "switch").attributes["aria-checked"]).toBe("true");
    expect(env.element.textContent).toContain("HiddenMy clinic");
    expect(env.element.textContent).toContain("visibility could not be confirmed");
  });
});
