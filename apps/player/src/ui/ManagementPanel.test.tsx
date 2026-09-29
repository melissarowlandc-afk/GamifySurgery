import { createPixelAppearance } from "@gamify-surgery/game-domain";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ManagementPanel } from "./ManagementPanel";
import type { ServiceIncomeView, StaffRoleGroupView } from "./types";

const noop = () => undefined;

const roles: StaffRoleGroupView[] = [
  {
    id: "staff.receptionist",
    displayName: "Receptionist",
    currentCount: 1,
    maximumCount: 2,
    canHire: true,
    hiringCostLabel: "$60",
    employees: [
      {
        id: "employee.receptionist",
        displayName: "Avery",
        roleDisplayName: "Receptionist",
        moraleLabel: "92%",
        moralePercent: 92,
        salaryLabel: "$18/hr",
        canDecreaseSalary: true,
        canIncreaseSalary: true,
        avatar: createPixelAppearance(
          "management-panel-test",
          "staff",
          "employee.receptionist",
        ),
      },
    ],
  },
];

const serviceIncome: ServiceIncomeView = {
  appointmentsEnabled: true,
  grossTotalLabel: "$120.00",
  stockCostTotalLabel: "$0.00",
  netTotalLabel: "$120.00",
  catalogLines: [{ id: "service.ultrasound", displayName: "Ultrasound", kind: "clinical", feeLabel: "$120.00", minimumFacilityLevel: 1, requirementLabel: "Ultrasound Room + Imaging Technician", available: true }],
  activeOperations: [{ id: "operation.1", displayName: "Ultrasound", actorLabel: "Taylor", statusLabel: "In Service", quoteFeeLabel: "$120.00" }],
  recentReceipts: [{ id: "receipt.1", displayName: "Ultrasound", actorLabel: "patient", grossLabel: "$120.00", stockCostLabel: "$0.00", netLabel: "$120.00" }],
};

function renderPanel(managementMode: boolean, showInactiveTrigger = true) {
  return renderToStaticMarkup(
    <ManagementPanel
      managementMode={managementMode}
      showInactiveTrigger={showInactiveTrigger}
      roles={roles}
      highlightedRoleId="staff.receptionist"
      highlightedEmployeeId="employee.receptionist"
      serviceIncome={serviceIncome}
      onEnterManagementMode={noop}
      onExitManagementMode={noop}
      onHire={noop}
      onDecreaseSalary={noop}
      onIncreaseSalary={noop}
      onFire={noop}
      onAppointmentsEnabledChange={noop}
    />,
  );
}

describe("ManagementPanel", () => {
  it("renders a matched entry trigger only while the desk is otherwise empty", () => {
    const markup = renderPanel(false);

    expect(markup).toContain("Enter Management Mode");
    expect(markup).toContain('aria-label="Enter Management Mode"');
    expect(renderPanel(false, false)).toBe("");
  });

  it("wraps the complete existing employee UI in a desk-sized mode with Done", () => {
    const markup = renderPanel(true);

    expect(markup).toContain("management-panel");
    expect(markup).toContain("Management Mode");
    expect(markup).toContain(">Done<");
    expect(markup).toContain('data-staff-role-id="staff.receptionist"');
    expect(markup).toContain('data-employee-id="employee.receptionist"');
    expect(markup).toContain("Hire $60");
    expect(markup).toContain("Fire");
    expect(markup).toContain('role="tablist"');
    expect(markup).toContain("Services &amp; income");
    expect(markup).toContain('aria-selected="true"');
    expect(markup).not.toContain("Scheduled appointments");
  });
});
