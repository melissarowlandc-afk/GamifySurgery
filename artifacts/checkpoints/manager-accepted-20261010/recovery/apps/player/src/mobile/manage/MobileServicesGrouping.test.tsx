import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { createAppAppointmentsQaState } from "../../../../../tests/fixtures/app-appointments";
import { createLevelFourRoomsQaContext } from "../../../../../tests/fixtures/level-four-rooms";
import { createPrototypePlayerView } from "../../session/viewModels";
import MobileShell from "../MobileShell";
import { allElements, cleanupPhoneTests, phoneFixture, phoneTestDom } from "../screenTestUtils";
import { MobileManage } from "./MobileManage";
import { createManageFixture } from "./testFixtures";

vi.mock("../map/MobileFacilityMap", () => ({ MobileFacilityMap: () => <div>Map</div> }));
afterEach(cleanupPhoneTests);

describe("MB10b compact Services", () => {
  it("groups the real Level 4 appointment fixture's setup services into one counted tile and keeps each detail reachable", async () => {
    const previous = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
    try {
      const context = createLevelFourRoomsQaContext(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease;
      const state = createAppAppointmentsQaState(context); const before = JSON.stringify(state);
      const view = createPrototypePlayerView(state, null, false, null);
      const setup = view.serviceIncome.catalogLines.filter(line => line.group === "needs" || line.group === "future");
      const ready = view.serviceIncome.catalogLines.filter(line => line.group === "earning" || line.group === "paused");
      expect(setup.length).toBeGreaterThan(10);
      const env = phoneTestDom(); await env.render(<MobileManage {...createManageFixture({ ...view })} />); await env.click("Services");
      const tiles = allElements(env.element, node => node.tagName === "BUTTON" && node.attributes["data-service-line-id"] !== undefined);
      expect(tiles.map(tile => tile.attributes["data-service-line-id"])).toEqual(ready.map(line => line.id));
      const group = env.button(`Needs setup · ${setup.length} services`);
      expect(allElements(group, node => node.attributes.class === "mobile-manage-badge")[0]!.textContent).toBe(String(setup.length));
      expect(allElements(group, node => node.attributes.class === "mobile-manage-dot is-attention")).toHaveLength(1);
      for (const line of setup) expect(tiles.some(tile => tile.attributes["data-service-line-id"] === line.id)).toBe(false);
      await env.click(`Needs setup · ${setup.length} services`);
      expect(allElements(env.element, node => node.attributes.class === "mobile-manage-setup-row")).toHaveLength(setup.length);
      for (const line of setup) {
        await env.click(`Service details for ${line.displayName}`);
        expect(env.element.textContent).toContain(line.feeLabel);
        expect(env.element.textContent).toContain(line.requirementLabel);
        for (const action of line.setupActions ?? []) expect(env.button(action.label)).toBeTruthy();
        await env.click("Back to setup services");
      }
      await env.click("Back to services"); expect(env.button(`Needs setup · ${setup.length} services`)).toBeTruthy();
      expect(JSON.stringify(state)).toBe(before);
    } finally { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = previous; }
  });

  it("keeps later-level services in the compact setup list with their original unlock details", async () => {
    const env = phoneTestDom(); await env.render(<MobileManage {...createManageFixture()} />); await env.click("Services");
    expect(env.element.textContent).not.toContain("Fixture missing setup"); expect(env.element.textContent).not.toContain("Fixture future service");
    await env.click("Needs setup · 2 services"); await env.click("Service details for Fixture future service");
    expect(env.element.textContent).toContain("Locked until Facility Level 4"); expect(env.element.textContent).toContain("Stock$3");
    expect(env.element.textContent).toContain("After stock$7");
  });

  it("omits the setup group when all services are running or off, including appointments switched off", async () => {
    const props = createManageFixture(); props.serviceIncome = { ...props.serviceIncome, appointmentsEnabled: false,
      catalogLines: props.serviceIncome.catalogLines.filter(line => line.group === "earning" || line.group === "paused") };
    const env = phoneTestDom(); await env.render(<MobileManage {...props} />); await env.click("Services");
    expect(env.element.textContent).not.toContain("Needs setup");
    for (const line of props.serviceIncome.catalogLines) expect(env.button(`Service details for ${line.displayName}`).textContent).toContain("Off");
  });

  it.each([
    ["$600.00 per scheduled visitor · $450.00 question-ordered", "$600"],
    ["$1,234.50 per scheduled visitor · $900.00 question-ordered", "$1,234.50"],
    ["$120.00–$160.00 by APP training", "$120"],
    ["$0.00", "$0"],
  ])("shortens the tile fee %s while preserving its full detail", async (fullFee, hint) => {
    const props = createManageFixture(); props.serviceIncome.catalogLines[0] = { ...props.serviceIncome.catalogLines[0]!, feeLabel: fullFee };
    const env = phoneTestDom(); await env.render(<MobileManage {...props} />); await env.click("Services");
    const tile = env.button("Service details for Fixture booked service");
    expect(allElements(tile, node => node.attributes.class === "mobile-manage-tile-hint")[0]!.textContent).toBe(hint);
    await env.click("Service details for Fixture booked service"); expect(env.element.textContent).toContain(fullFee);
  });

  it("keeps the grouped setup list's fee compact while its service detail retains both fee routes", async () => {
    const props = createManageFixture(); const fullFee = "$600.00 per scheduled visitor · $450.00 question-ordered";
    props.serviceIncome.catalogLines[1] = { ...props.serviceIncome.catalogLines[1]!, feeLabel: fullFee };
    const env = phoneTestDom(); await env.render(<MobileManage {...props} />); await env.click("Services"); await env.click("Needs setup · 2 services");
    const row = env.button("Service details for Fixture missing setup");
    expect(allElements(row, node => node.tagName === "SMALL")[0]!.textContent).toBe("$600");
    await env.click("Service details for Fixture missing setup"); expect(env.element.textContent).toContain(fullFee);
    expect(env.button("Build Laboratory")).toBeTruthy(); expect(env.button("Hire Laboratory Technician")).toBeTruthy();
  });

  it("unwinds service detail, setup list and Services root before browser Back exits Manage", async () => {
    const exit = vi.fn(); const setup = vi.fn(); const env = phoneTestDom();
    await env.render(<MobileShell {...phoneFixture({ ...createManageFixture(), paused: true, onExitManagementMode: exit, onBeginPlacement: setup, onHireStaff: setup })} />);
    await env.click("Services"); await env.click("Needs setup · 2 services"); await env.click("Service details for Fixture missing setup");
    await env.back(); expect(env.button("Service details for Fixture missing setup")).toBeTruthy(); expect(exit).not.toHaveBeenCalled();
    await env.back(); expect(env.button("Needs setup · 2 services")).toBeTruthy(); expect(exit).not.toHaveBeenCalled();
    await env.back(); expect(exit.mock.calls).toEqual([[]]); expect(setup).not.toHaveBeenCalled();
  });

  it("uses scoped single-line fee hints and compact setup rows with the existing 44px button minimum", () => {
    const css = readFileSync(new URL("./mobileManage.css", import.meta.url), "utf8");
    expect(css).toMatch(/\.mobile-shell \.mobile-manage-service-grid \.mobile-manage-tile-hint[^{}]*\{[^}]*white-space: nowrap;[^}]*overflow: hidden;[^}]*text-overflow: ellipsis;/);
    expect(css).toMatch(/\.mobile-shell \.mobile-manage-setup-row\s*\{[^}]*grid-template-columns: minmax\(0, 1fr\) auto;/);
    expect(css).toMatch(/\.mobile-shell \.mobile-manage button\s*\{[^}]*min-height: 44px !important;/);
  });
});
