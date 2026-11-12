import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import MobileShell from "./MobileShell";
import { MobilePatients } from "./MobilePatients";
import { MobileGlp1ConsultChip } from "./MobileQuickControls";
import { MobileManage } from "./manage/MobileManage";
import { createManageFixture, employeeFixture, roleFixture } from "./manage/testFixtures";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "./screenTestUtils";

vi.mock("./map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div data-testid="facility-canvas">Map</div> }));
afterEach(cleanupPhoneTests);

describe("MB10 map owner feedback", () => {
  it.each([1, 2])("removes the consult chip entirely with automationCapacity=%i, even if an older projection says visible", async capacity => {
    const env = phoneTestDom(); const consult = vi.fn();
    await env.render(<MobileGlp1ConsultChip view={{ ...phoneFixture().emergencyGlp1, visible: true, enabled: true, automationCapacity: capacity }}
      onConsult={consult} blockedReason="Exit Build Mode before running the emergency consultation." />);
    expect(env.element.textContent).toBe(""); expect(allElements(env.element, node => node.tagName === "BUTTON")).toHaveLength(0);
    expect(consult).not.toHaveBeenCalled();
  });
  it("pins the consult to top-left and Goals to top-right, without advertising in the map controls", async () => {
    const env = phoneTestDom(); await env.render(<MobileShell {...phoneFixture()} />);
    expect(env.find(node => node.attributes["data-phone-anchor"] === "emergency").attributes.class).toContain("mobile-map-top-left");
    expect(env.find(node => node.attributes["data-phone-anchor"] === "goals-chip").attributes.class).toContain("mobile-map-top-right");
    const chips = env.find(node => node.attributes.class === "mobile-map-chips");
    expect(allElements(chips, node => node.tagName === "BUTTON")).toHaveLength(2); expect(chips.textContent).not.toContain("Advertising");
    const css = readFileSync(new URL("./mobileShell.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.mobile-map-chips\s*\{[^}]*top: 8px;[^}]*left: 8px;[^}]*right: 8px;/);
    expect(css).toMatch(/\.mobile-map-top-left\s*\{[^}]*grid-column: 1;[^}]*grid-row: 1;[^}]*justify-self: start;/);
    expect(css).toMatch(/\.mobile-map-top-right\s*\{[^}]*grid-column: 2;[^}]*grid-row: 1;[^}]*justify-self: end;/);
  });
  it("keeps covered GLP-1 information reachable in both More and Alerts", async () => {
    const env = phoneTestDom(); const view = { ...phoneFixture().emergencyGlp1, visible: false, automationCapacity: 1, statusLabel: "Fixture staffed coverage" };
    await env.render(<MobileShell {...phoneFixture({ emergencyGlp1: view })} />);
    expect(allElements(env.element, node => node.attributes["data-phone-anchor"] === "emergency")).toHaveLength(0);
    await env.click("More clinic options"); await env.click("GLP-1 consult info"); expect(env.element.textContent).toContain(view.statusLabel);
    await env.click("Close GLP-1 consult"); await env.click("Alerts"); expect(env.element.textContent).toContain(view.statusLabel);
  });
  it("puts Advertising behind Manage's Money tile with the original level step callback", async () => {
    const change = vi.fn(); const env = phoneTestDom();
    const props = phoneFixture({ ...createManageFixture(), paused: true, advertising: { ...createManageFixture().advertising, currentLevel: 1, canIncrease: true }, onAdvertisingLevelChange: change });
    await env.render(<MobileShell {...props} />);
    expect(env.find(node => node.attributes.class === "mobile-map-chips").textContent).not.toContain("Advertising");
    await env.click("Money"); expect(env.button("Advertising").attributes["data-money-tile"]).toBe("advertising");
    expect(allElements(env.element, node => node.attributes["data-advertising-control"] !== undefined)).toHaveLength(0);
    await env.click("Advertising"); await env.click("Increase advertising"); expect(change.mock.calls).toEqual([[2]]);
  });
});

describe("MB10 compact Manage navigation", () => {
  it("renders role count badges and a compact strip, grouping zero-capacity and locked roles into one collapsed entry", async () => {
    const low = { ...employeeFixture, id: "low", moralePercent: PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction.unhappyStaffMoraleThreshold };
    const training = { ...employeeFixture, id: "training", training: { ...employeeFixture.training!, status: "queued" as const, statusLabel: "Training queued" } };
    const locked = [
      { ...roleFixture, id: "unbuilt.a", displayName: "Unbuilt A", currentCount: 0, maximumCount: 0, employees: [], canHire: false, blockedReason: "Build a compatible room to add hiring capacity." },
      { ...roleFixture, id: "unbuilt.b", displayName: "Unbuilt B", currentCount: 0, maximumCount: 0, employees: [], canHire: false },
      { ...roleFixture, id: "future", displayName: "Future role", currentCount: 0, maximumCount: 2, employees: [], canHire: false, blockedReason: "Locked until Facility Level 5." },
    ];
    const roles = [roleFixture, { ...roleFixture, id: "low.role", displayName: "Low morale role", employees: [low] },
      { ...roleFixture, id: "training.role", displayName: "Training role", employees: [training] }, ...locked];
    const env = phoneTestDom(); await env.render(<MobileManage {...createManageFixture({ staffRoles: roles })} />);
    const tiles = allElements(env.element, node => node.tagName === "BUTTON" && node.attributes["data-staff-role-id"] !== undefined);
    expect(tiles).toHaveLength(3);
    for (const tile of tiles) expect(allElements(tile, node => node.attributes.class === "mobile-manage-badge").map(node => node.textContent)).toEqual(["1/2"]);
    expect(tiles[0]!.textContent).toContain("Hire available"); expect(tiles[1]!.textContent).toContain("Low morale"); expect(tiles[2]!.textContent).toContain("Training queued");
    const strip = env.find(node => node.attributes["aria-label"] === "Staff overview");
    expect(strip.tagName).toBe("DL"); expect(strip.attributes.class).toBe("mobile-manage-overview"); expect(strip.textContent).toContain("Staff3");
    expect(env.button("Locked / not built yet").attributes["aria-expanded"]).toBe("false"); expect(env.button("Locked / not built yet").textContent).toContain("3 roles");
    expect(env.element.textContent).not.toContain("Unbuilt A"); expect(env.element.textContent).not.toContain("Hire price");
    await env.click("Locked / not built yet");
    for (const role of locked) expect(env.element.textContent).toContain(role.displayName);
    await env.click("Role details for Unbuilt A"); expect(env.button("Hire Unbuilt A").attributes.disabled).toBe("");
    await env.click("Back to locked roles"); await env.click("Back to employee roles"); expect(tiles).toHaveLength(3);
  });
  it("keeps staff with zero current capacity visible and uses existing payroll/departure projections for attention", async () => {
    const props = createManageFixture({ staffRoles: [{ ...roleFixture, maximumCount: 0, canHire: false }],
      needsYou: [{ id: "pay", kind: "payroll", title: "Payroll risk", why: "Fixture", sortKey: 1, actionLabel: "Emergency consultation", action: { kind: "emergency_consult" } }] });
    const env = phoneTestDom(); await env.render(<MobileManage {...props} />);
    expect(env.button("Role details for Receptionist").textContent).toContain("1/0"); expect(env.element.textContent).toContain("Payroll at risk");
    await env.render(<MobileManage {...props} facility={{ ...props.facility, staff: [...props.facility.staff,
      { instanceId: "departing", displayName: "Departing fixture", roleDisplayName: roleFixture.displayName, staffRoleDefinitionId: roleFixture.id, homeRoomInstanceId: null }] }} />);
    expect(env.button("Role details for Receptionist").textContent).toContain("Departing");
  });
  it("shows running/off service tiles with fees, groups setup services, and groups work by source identity rather than display name", async () => {
    const props = createManageFixture(); props.serviceIncome.activeOperations.push({ id: "other", incomeLineId: "other.line", displayName: "Fixture booked service", actorLabel: "Other visitor", providerLabel: "Other provider", statusLabel: "Queued", quoteFeeLabel: "$20" });
    const env = phoneTestDom(); await env.render(<MobileManage {...props} />); await env.click("Services");
    const tiles = allElements(env.element, node => node.tagName === "BUTTON" && node.attributes["data-service-line-id"] !== undefined);
    expect(tiles).toHaveLength(2);
    expect(tiles.map(tile => allElements(tile, node => node.attributes.class?.startsWith("mobile-manage-dot") === true)[0]!.attributes.class)).toEqual([
      "mobile-manage-dot is-running", "mobile-manage-dot is-off",
    ]);
    for (const line of props.serviceIncome.catalogLines.filter(line => line.group === "earning" || line.group === "paused")) expect(env.button(`Service details for ${line.displayName}`).textContent).toContain(line.feeLabel);
    expect(env.button("Needs setup · 2 services")).toBeTruthy();
    expect(env.button("In progress now").textContent).toContain("2");
    await env.click("Service details for Fixture booked service"); expect(env.element.textContent).toContain("Queue / active work1");
    expect(env.element.textContent).toContain("Fixture Provider"); expect(env.element.textContent).not.toContain("Other provider");
  });
  it("uses four Money tiles and keeps breakdowns/payments behind their sheets", async () => {
    const env = phoneTestDom(); await env.render(<MobileManage {...createManageFixture()} />); await env.click("Money");
    expect(allElements(env.element, node => node.attributes["data-money-tile"] !== undefined)).toHaveLength(4);
    expect(env.element.textContent).not.toContain("Recent service payments");
    await env.click("Income per game hour"); expect(env.element.textContent).toContain("Average income by source"); expect(env.element.textContent).toContain("Recent service payments");
  });
  it("consumes browser Back inside confirmation/employee/role sheets before using the original Manage exit", async () => {
    const exit = vi.fn(); const fire = vi.fn(); const env = phoneTestDom();
    await env.render(<MobileShell {...phoneFixture({ ...createManageFixture(), paused: true, onExitManagementMode: exit, onFireEmployee: fire })} />);
    await env.click("Role details for Receptionist"); await env.click(`Employee details for ${employeeFixture.displayName}`); await env.click(`Fire ${employeeFixture.displayName}`);
    await env.back(); expect(allElements(env.element, node => node.attributes.role === "alertdialog")).toHaveLength(0); expect(exit).not.toHaveBeenCalled(); expect(fire).not.toHaveBeenCalled();
    await env.back(); expect(env.button(`Employee details for ${employeeFixture.displayName}`)).toBeTruthy(); expect(exit).not.toHaveBeenCalled();
    await env.back(); expect(env.button("Role details for Receptionist")).toBeTruthy(); expect(exit).not.toHaveBeenCalled();
    await env.back(); expect(exit.mock.calls).toEqual([[]]); expect(fire).not.toHaveBeenCalled();
  });
});

describe("MB10 Resolved drawer", () => {
  it("starts as a single count row while Waiting/Existing stay open, and expands/collapses without opening a chart", async () => {
    const open = vi.fn(); const env = phoneTestDom();
    const row = { id: "waiting", name: "Waiting fixture", folder: "waiting" as const, subtitle: "Fixture", selected: false, actionRequired: false, statusLabel: "Waiting", satisfactionPercent: 80 };
    await env.render(<MobilePatients patients={[row, { ...row, id: "existing", name: "Existing fixture", folder: "active" },
      { ...row, id: "resolved", name: "Resolved fixture", folder: "resolved" }]} onOpen={open} onOpenDiscussion={() => {}} />);
    expect(allElements(env.element, node => node.attributes["data-patient-id"] !== undefined).map(node => node.attributes["data-patient-id"])).toEqual(["waiting", "existing"]);
    expect(env.button("Resolved, 1 charts").attributes["aria-expanded"]).toBe("false");
    await env.click("Resolved, 1 charts"); expect(env.button("Resolved, 1 charts").attributes["aria-expanded"]).toBe("true");
    expect(env.element.textContent).toContain("Resolved fixture"); expect(open).not.toHaveBeenCalled();
    await env.clickElement(env.find(node => node.attributes["data-patient-id"] === "resolved")); expect(open.mock.calls).toEqual([["resolved"]]);
    await env.click("Resolved, 1 charts"); expect(env.element.textContent).not.toContain("Resolved fixture");
  });
});
