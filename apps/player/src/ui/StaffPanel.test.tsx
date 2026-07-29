import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createPixelAppearance } from "@gamify-surgery/game-domain";
import { StaffPanel } from "./StaffPanel";

describe("StaffPanel", () => {
  it("shows morale as a percentage and places Fire before salary without a morale bar", () => {
    const markup = renderToStaticMarkup(
      <StaffPanel
        roles={[
          {
            id: "staff.receptionist",
            displayName: "Receptionist",
            currentCount: 1,
            maximumCount: 1,
            hiringCostLabel: "$180",
            canHire: false,
            blockedReason: "Maximum 1 hired.",
            employees: [
              {
                id: "employee.receptionist",
                displayName: "Morgan",
                roleDisplayName: "Receptionist",
                salaryLabel: "$18/hr",
                moraleLabel: "75%",
                moralePercent: 75,
                avatar: createPixelAppearance(
                  "staff-panel-test",
                  "staff",
                  "employee.receptionist",
                ),
                canDecreaseSalary: true,
                canIncreaseSalary: true,
              },
            ],
          },
        ]}
        onHire={vi.fn()}
        onDecreaseSalary={vi.fn()}
        onIncreaseSalary={vi.fn()}
        onFire={vi.fn()}
      />,
    );

    expect(markup).toContain("Morale");
    expect(markup).toContain("75%");
    expect(markup).not.toContain("<progress");
    expect(markup.indexOf(">Fire<")).toBeLessThan(
      markup.indexOf("Salary"),
    );
  });
});
