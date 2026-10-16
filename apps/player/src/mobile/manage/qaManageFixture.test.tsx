import { afterEach, describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { PROTOTYPE_DOMAIN_CONTEXT, gameReducer } from "@gamify-surgery/game-domain";
import { createLevelFourRoomsQaContext } from "../../../../../tests/fixtures/level-four-rooms";
import { createMriAppointmentsQaState } from "../../../../../tests/fixtures/mri-appointments";
import { createPrototypePlayerView } from "../../session/viewModels";
import { MobileManage } from "./MobileManage";
import { MobileServices } from "./MobileServices";
import { MobileMoney } from "./MobileMoney";
import { createManageFixture } from "./testFixtures";
import { allElements, cleanupPhoneTests, phoneTestDom } from "../screenTestUtils";

afterEach(cleanupPhoneTests);

describe("existing Level 4 QA fixture on the phone Manage screens", () => {
  it("projects a several-staff/service QA clinic through all three native sections without changing the fixture", async () => {
    const original = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease;
    try {
      const context = createLevelFourRoomsQaContext(); PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = context.balanceRelease;
      const state = gameReducer(createMriAppointmentsQaState(context), { type: "HIRE_STAFF", operationId: "phone.qa.hire.reader",
        employeeId: "phone.qa.second.reader", staffRoleDefinitionId: "staff.radiologist" }, context);
      expect(state.operationReceipts["phone.qa.hire.reader"]?.status).toBe("applied");
      const before = JSON.stringify(state);
      const view = createPrototypePlayerView(state, null, false, null);
      expect(state.employees.length).toBeGreaterThanOrEqual(3); expect(view.serviceIncome.catalogLines.length).toBeGreaterThan(5);
      const props = createManageFixture({ ...view });
      const employees = renderToStaticMarkup(<MobileManage {...props} />);
      for (const role of view.staffRoles.filter(role => role.currentCount > 0)) expect(employees).toContain(`${role.currentCount}/${role.maximumCount}`);
      const env = phoneTestDom(); await env.render(<MobileManage {...props} />);
      for (const role of view.staffRoles.filter(role => role.currentCount > 0)) {
        await env.click(`Role details for ${role.displayName}`);
        expect(allElements(env.element, node => node.attributes["data-employee-id"] !== undefined)).toHaveLength(role.employees.length);
        for (const employee of role.employees) expect(env.element.textContent).toContain(employee.displayName);
        await env.click("Back to employee roles");
      }
      const services = renderToStaticMarkup(<MobileServices view={view.serviceIncome} onAppointmentsEnabledChange={() => {}} onStartLaboratoryProcessing={() => {}} onSetupAction={() => {}} />);
      for (const line of view.serviceIncome.catalogLines.filter(line => line.group === "earning" || line.group === "paused")) expect(services).toContain(line.displayName.replaceAll("&", "&amp;"));
      const setupLines = view.serviceIncome.catalogLines.filter(line => line.group === "needs" || line.group === "future");
      expect(services).toContain(`Needs setup · ${setupLines.length} services`);
      await env.click("Services"); await env.click(`Needs setup · ${setupLines.length} services`);
      for (const line of setupLines) expect(env.element.textContent).toContain(line.displayName);
      await env.click("Back to services");
      const money = renderToStaticMarkup(<MobileMoney view={view.serviceIncome} resourceBar={view.resourceBar} advertising={view.advertising} onAdvertisingLevelChange={() => {}} />);
      expect(money).toContain(view.serviceIncome.finances!.hourlyNetLabel); expect(money).toContain('data-money-tile="advertising"');
      await env.click("Money"); await env.click("Net per game hour"); expect(env.element.textContent).toContain("Recent service payments");
      expect(JSON.stringify(state)).toBe(before);
    } finally { PROTOTYPE_DOMAIN_CONTEXT.balanceRelease = original; }
  });
});
