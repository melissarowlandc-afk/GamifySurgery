import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { cleanupPhoneTests, phoneTestDom, allElements } from "../screenTestUtils";
import { MobileManage } from "./MobileManage";
import { MobileMoney } from "./MobileMoney";
import { createManageFixture, employeeFixture, roleFixture } from "./testFixtures";

afterEach(cleanupPhoneTests);

async function openRole(env: ReturnType<typeof phoneTestDom>) {
  if (allElements(env.element, node => node.attributes["aria-label"] === "Role details for Receptionist").length) await env.click("Role details for Receptionist");
}
async function openEmployee(env: ReturnType<typeof phoneTestDom>) {
  await openRole(env);
  await env.click(`Employee details for ${employeeFixture.displayName}`);
}

describe("phone-native Employees actions", () => {
  it("routes hire, both salary steps and praise with their exact role/employee IDs", async () => {
    const hire = vi.fn(); const decrease = vi.fn(); const increase = vi.fn(); const praise = vi.fn();
    const props = createManageFixture({ onHireStaff: hire, onDecreaseEmployeeSalary: decrease, onIncreaseEmployeeSalary: increase, onPraiseEmployee: praise });
    const env = phoneTestDom(); await env.render(<MobileManage {...props} />);
    expect(env.element.textContent).toContain("1/2"); await openRole(env); expect(env.element.textContent).toContain("Hire price $1,000");
    expect(env.element.textContent).toContain("Fixture setup guidance.");
    await env.click("Hire Receptionist"); expect(hire.mock.calls).toEqual([[roleFixture.id]]);
    await openEmployee(env);
    expect(env.element.textContent).toContain("Home roomFront Desk A"); expect(env.element.textContent).toContain("Training level 1/5");
    await env.click(`Decrease ${employeeFixture.displayName}'s salary`); expect(decrease.mock.calls).toEqual([[employeeFixture.id]]);
    await env.click(`Increase ${employeeFixture.displayName}'s salary`); expect(increase.mock.calls).toEqual([[employeeFixture.id]]);
    await env.click(`Praise ${employeeFixture.displayName}`); expect(praise.mock.calls).toEqual([[employeeFixture.id]]);
  });
  it.each(["Maximum 2 hired for the rooms you have built.", "All approved APP looks are in use; additional APP art is needed.", "Need $900 more.", "Build a compatible room to add hiring capacity."])("shows the existing hire guard: %s", async (reason) => {
    const hire = vi.fn(); const env = phoneTestDom();
    await env.render(<MobileManage {...createManageFixture({ staffRoles: [{ ...roleFixture, canHire: false, blockedReason: reason }], onHireStaff: hire })} />);
    await openRole(env); expect(env.button("Hire Receptionist").attributes.disabled).toBe(""); expect(env.element.textContent).toContain(reason);
    expect(hire).not.toHaveBeenCalled();
  });
  it("preserves both salary disabled flags", async () => {
    const env = phoneTestDom(); await env.render(<MobileManage {...createManageFixture({ staffRoles: [{ ...roleFixture,
      employees: [{ ...employeeFixture, canDecreaseSalary: false, canIncreaseSalary: false }] }] })} />);
    await openEmployee(env);
    for (const direction of ["Decrease", "Increase"]) expect(env.button(`${direction} ${employeeFixture.displayName}'s salary`).attributes.disabled).toBe("");
  });
  it("confirms training after showing the unchanged quote and departure note; Cancel buys nothing", async () => {
    const train = vi.fn(); const env = phoneTestDom(); const props = createManageFixture({ onTrainEmployee: train });
    await env.render(<MobileManage {...props} />); await openEmployee(env);
    await env.click(`Train ${employeeFixture.displayName}`);
    expect(train).not.toHaveBeenCalled(); expect(env.element.textContent).toContain("Lv 2 for $500: Fixture next benefit.");
    expect(env.element.textContent).toContain("keeps working while queued"); expect(env.element.textContent).toContain("Leaves their post");
    expect(env.element.textContent).toContain("Team average after: Fixture team benefit.");
    await env.click("Cancel"); expect(train).not.toHaveBeenCalled();
    await env.click(`Train ${employeeFixture.displayName}`);
    const confirm = env.find((node) => node.tagName === "BUTTON" && node.textContent === "Train $500" && node.parentNode?.parentNode?.attributes.role === "dialog");
    await env.clickElement(confirm); expect(train.mock.calls).toEqual([[employeeFixture.id]]);
  });
  it("shows a blocked training quote and disables its confirm action", async () => {
    const env = phoneTestDom(); const train = vi.fn();
    await env.render(<MobileManage {...createManageFixture({ onTrainEmployee: train, staffRoles: [{ ...roleFixture,
      employees: [{ ...employeeFixture, training: { ...employeeFixture.training!, canTrain: false, blockedReason: "Need $400 more." } }] }] })} />);
    await openEmployee(env); await env.click(`Train ${employeeFixture.displayName}`);
    expect(env.element.textContent).toContain("Need $400 more.");
    expect(env.find((node) => node.tagName === "BUTTON" && node.parentNode?.parentNode?.attributes.role === "dialog" && node.textContent === "Train $500").attributes.disabled).toBe("");
    expect(train).not.toHaveBeenCalled();
  });
  it.each(["queued", "walking", "training", "returning", "max_level"] as const)("retains %s training state and avoids purchasing another level", async (status) => {
    const env = phoneTestDom(); const train = vi.fn();
    await env.render(<MobileManage {...createManageFixture({ onTrainEmployee: train, staffRoles: [{ ...roleFixture, employees: [{ ...employeeFixture,
      training: { ...employeeFixture.training!, status, statusLabel: "Fixture training state", sessionDurationMinutes: 30, canTrain: false, nextLevel: status === "max_level" ? null : 2 } }] }] })} />);
    await openEmployee(env);
    if (status === "max_level") expect(env.button(`Train ${employeeFixture.displayName}`).attributes.disabled).toBe("");
    else { expect(env.element.textContent).toContain("Fixture training state"); expect(env.element.textContent).toContain("30 min session"); }
    expect(train).not.toHaveBeenCalled();
  });
  it("fires only on confirmation, preserves the queued refund note, and Cancel is inert", async () => {
    const fire = vi.fn(); const env = phoneTestDom(); const props = createManageFixture({ onFireEmployee: fire,
      staffRoles: [{ ...roleFixture, employees: [{ ...employeeFixture, training: { ...employeeFixture.training!, status: "queued" } }] }] });
    await env.render(<MobileManage {...props} />); await openEmployee(env);
    await env.click(`Fire ${employeeFixture.displayName}`); expect(fire).not.toHaveBeenCalled();
    expect(env.find((node) => node.attributes.role === "alertdialog").attributes["aria-label"]).toBe(`Confirm firing ${employeeFixture.displayName}`);
    expect(env.element.textContent).toContain("They will leave this clinic immediately."); expect(env.element.textContent).toContain("queued training payment is refunded");
    await env.click("Cancel"); expect(fire).not.toHaveBeenCalled();
    await env.click(`Fire ${employeeFixture.displayName}`); await env.click("Confirm Fire"); expect(fire.mock.calls).toEqual([[employeeFixture.id]]);
    expect(allElements(env.element, (node) => node.attributes.role === "alertdialog")).toHaveLength(0);
  });
  it("opens requested training and employee highlights without dispatching any purchase", async () => {
    const train = vi.fn(); const env = phoneTestDom(); let props = createManageFixture({ onTrainEmployee: train });
    await env.render(<MobileManage {...props} />); await env.click("Money");
    props = { ...props, requestedTraining: { employeeId: employeeFixture.id, requestKey: 1 }, highlightedEmployeeId: employeeFixture.id };
    await env.render(<MobileManage {...props} />);
    expect(env.button("Employees").attributes["aria-selected"]).toBe("true");
    expect(env.find(node => node.attributes.class === "mobile-manage-detail").attributes["aria-label"]).toBe(employeeFixture.displayName);
    expect(env.element.textContent).toContain("Lv 2 for $500"); expect(train).not.toHaveBeenCalled();
  });
  it("keeps training guidance with no room and preserves missing home facts", async () => {
    const env = phoneTestDom(); const props = createManageFixture({ staffTraining: null, facility: { ...createManageFixture().facility, staff: [] } });
    await env.render(<MobileManage {...props} />); await openEmployee(env);
    expect(env.element.textContent).toContain("Build a Training Room"); expect(env.element.textContent).toContain("Home roomNot supplied");
    expect(allElements(env.element, (node) => node.tagName === "BUTTON" && node.attributes["aria-label"] === `Train ${employeeFixture.displayName}`)).toHaveLength(0);
    await env.click("Back to Receptionist");
    expect(env.button(`Employee details for ${employeeFixture.displayName}`).attributes["data-employee-id"]).toBe(employeeFixture.id);
    await env.click("Back to employee roles"); await openEmployee(env);
    expect(env.element.textContent).toContain("Home roomNot supplied");
  });
});

describe("phone-native Services and Money", () => {
  it("routes appointment On/Off and contextual On with the desktop booleans, and queues lab with no arguments", async () => {
    const toggle = vi.fn(); const queue = vi.fn(); const env = phoneTestDom(); const props = createManageFixture({
      onServiceAppointmentsEnabledChange: toggle, onStartLaboratoryProcessing: queue,
      serviceIncome: { ...createManageFixture().serviceIncome, appointmentsEnabled: false },
    });
    await env.render(<MobileManage {...props} />); await env.click("Services");
    for (const line of props.serviceIncome.catalogLines.filter(line => line.group === "earning" || line.group === "paused")) expect(env.element.textContent).toContain(line.displayName);
    expect(env.button("Needs setup · 2 services")).toBeTruthy();
    expect(env.element.textContent).toContain("1 queued · 1 working");
    await env.click("On"); await env.click("Off");
    await env.click("Service details for Fixture booked service");
    expect(env.element.textContent).toContain("Booked visitors about every 2 hr"); expect(env.element.textContent).toContain("Fixture Provider");
    expect(env.element.textContent).toContain("Queued · awaiting resources");
    await env.click("Turn on appointments"); expect(toggle.mock.calls).toEqual([[true], [false], [true]]);
    await env.click("Back to services"); await env.click("Queue laboratory work"); expect(queue.mock.calls).toEqual([[]]);
  });
  it("shows the lab disabled reason and routes both setup actions unchanged", async () => {
    const setup = vi.fn(); const queue = vi.fn(); const env = phoneTestDom();
    const props = createManageFixture({ onSetupAction: setup, onStartLaboratoryProcessing: queue, serviceIncome: {
      ...createManageFixture().serviceIncome, laboratoryWorkQueue: { enabled: false, statusLabel: "No work queued", disabledReason: "Laboratory work queue is full." },
    } });
    await env.render(<MobileManage {...props} />); await env.click("Services");
    expect(env.button("Queue laboratory work").attributes.disabled).toBe(""); expect(env.element.textContent).toContain("Laboratory work queue is full.");
    await env.click("Needs setup · 2 services"); await env.click("Service details for Fixture missing setup"); await env.click("Build Laboratory"); await env.click("Hire Laboratory Technician");
    expect(setup.mock.calls).toEqual(props.serviceIncome.catalogLines[1]!.setupActions!.map((action) => [action])); expect(queue).not.toHaveBeenCalled();
  });
  it("renders every projected finance, cost and receipt column, with the real six-hour window and identical advertising level arguments", async () => {
    const change = vi.fn(); const env = phoneTestDom(); const props = createManageFixture({ onAdvertisingLevelChange: change,
      advertising: { ...createManageFixture().advertising, currentLevel: 2, canDecrease: true, canIncrease: true } });
    await env.render(<MobileManage {...props} />); await env.click("Money");
    const finance = props.serviceIncome.finances!;
    expect(env.element.textContent).toContain("Last 6 game hours");
    await env.click("Net per game hour");
    for (const value of [finance.hourlyIncomeLabel, finance.hourlyCostLabel, finance.hourlyNetLabel, finance.incomeWindowExplanation,
      finance.earnedLabel, finance.profitLabel, "Cash explanation"]) expect(env.element.textContent).toContain(value);
    for (const receipt of props.serviceIncome.recentReceipts) for (const value of [receipt.displayName, receipt.timeLabel!, receipt.actorLabel, receipt.grossLabel, receipt.stockCostLabel, receipt.netLabel]) expect(env.element.textContent).toContain(value);
    await env.click("Back to money"); await env.click("Income per game hour");
    for (const row of finance.hourlyIncomeSources) { expect(env.element.textContent).toContain(row.label); expect(env.element.textContent).toContain(row.amountLabel); }
    for (const row of finance.recentEarnings) expect(env.element.textContent).toContain(row.netLabel);
    await env.click("Back to money"); await env.click("Costs per game hour");
    expect(env.element.textContent).toContain(finance.runwayLabel);
    for (const row of finance.hourlyCosts) { expect(env.element.textContent).toContain(row.label); expect(env.element.textContent).toContain(row.amountLabel); }
    await env.click("Back to money"); await env.click("Advertising");
    await env.click("Decrease advertising"); await env.click("Increase advertising"); expect(change.mock.calls).toEqual([[1], [3]]);
  });
  it("preserves legacy finance fallbacks and both advertising bounds", async () => {
    const env = phoneTestDom(); const props = createManageFixture({ serviceIncome: { ...createManageFixture().serviceIncome, finances: undefined },
      advertising: { ...createManageFixture().advertising, canDecrease: false, canIncrease: false } });
    await env.render(<MobileManage {...props} />); await env.click("Money");
    await env.click("Net per game hour");
    for (const value of [props.serviceIncome.netTotalLabel, props.serviceIncome.grossTotalLabel, props.serviceIncome.stockCostTotalLabel]) expect(env.element.textContent).toContain(value);
    await env.click("Back to money"); await env.click("Advertising");
    for (const name of ["Decrease advertising", "Increase advertising"]) expect(env.button(name).attributes.disabled).toBe("");
  });
  it.each([360, 390, 412, 768, 844, 1100])("renders compact Employees/Services/Money tile grids at %i px without desktop tables", async (width) => {
    const env = phoneTestDom(); env.browser.innerWidth = width;
    await env.render(<div className="mobile-shell"><MobileManage {...createManageFixture()} /></div>);
    for (const section of ["Employees", "Services", "Money"]) {
      await env.click(section); expect(allElements(env.element, (node) => node.tagName === "TABLE")).toHaveLength(0);
      expect(env.find((node) => node.attributes.role === "tabpanel").attributes.id).toBe(`mobile-manage-${section.toLowerCase()}`);
      expect(allElements(env.element, (node) => node.attributes.class === "mobile-manage-tile").length).toBeGreaterThan(0);
    }
  });
  it("ships only scoped fluid CSS and minimum 44px controls", () => {
    const css = readFileSync(new URL("./mobileManage.css", import.meta.url), "utf8");
    for (const selector of css.matchAll(/([^{}]+)\{/g)) expect(selector[1]!.replace(/\/\*[\s\S]*?\*\//g, "").trim()).toMatch(/^\.mobile-shell/);
    expect(css).toContain("min-height: 44px !important"); expect(css).toContain("min-width: 44px !important");
    expect(css).toContain("grid-template-columns: repeat(3, minmax(0, 1fr))"); expect(css).toContain("overflow-wrap: anywhere");
    expect(renderToStaticMarkup(<MobileMoney view={createManageFixture().serviceIncome} resourceBar={createManageFixture().resourceBar}
      advertising={createManageFixture().advertising} onAdvertisingLevelChange={() => {}} />)).not.toContain("<table");
  });
});
