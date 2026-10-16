import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { createPixelAppearance } from "@gamify-surgery/game-domain";
import { StaffPanel } from "./StaffPanel";

describe("StaffPanel", () => {
  it("shows morale beside its label and keeps Fire away from the salary controls", () => {
    const markup = renderToStaticMarkup(
      <StaffPanel
        highlightedRoleId="staff.receptionist"
        highlightedEmployeeId="employee.receptionist"
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

    expect(markup).toMatch(/>Morale<\/span><strong[^>]*>75%</);
    expect(markup).not.toContain("<progress");
    // Salary reads "Salary − $18/hr +": the steppers sit directly around the amount.
    expect(markup).toMatch(/>Salary<\/span><button[^>]*aria-label="Decrease Morgan&#x27;s salary"[^>]*>−<\/button><strong[^>]*>\$18\/hr<\/strong><button[^>]*aria-label="Increase Morgan&#x27;s salary"/);
    expect(markup.indexOf(">Fire<")).toBeGreaterThan(
      markup.indexOf("Increase Morgan"),
    );
    expect(markup).toContain('aria-expanded="true"');
    expect(markup).not.toContain("Train");
    expect(markup).not.toContain("Lv ");
    expect(markup).toContain("is-alert-highlighted");
    expect(markup).toContain(
      'data-staff-role-id="staff.receptionist"',
    );
    expect(markup).toContain("data-staff-role-hire");
    expect(markup).toContain(
      'data-employee-id="employee.receptionist"',
    );
  });

  it("renders role-specific staffing guidance when the role is opened", () => {
    const markup = renderToStaticMarkup(
      <StaffPanel
        highlightedRoleId="staff.glp1_np"
        roles={[{
          id: "staff.glp1_np", displayName: "GLP-1 NP", currentCount: 2,
          maximumCount: 10, hiringCostLabel: "$600", canHire: true,
          staffingGuidance: "Up to two NPs can staff each GLP-1 Telehealth Suite. Each staffed NP earns $50 per facility hour.",
          employees: [],
        }]}
        onHire={vi.fn()}
        onDecreaseSalary={vi.fn()}
        onIncreaseSalary={vi.fn()}
        onFire={vi.fn()}
      />,
    );

    expect(markup).toContain("Up to two NPs can staff each GLP-1 Telehealth Suite.");
    expect(markup).toContain("Each staffed NP earns $50 per facility hour.");
  });
});

describe("StaffPanel training and layout", () => {
  const trainingView = {
    level: 2,
    nextLevel: 3,
    cost: 150,
    costLabel: "$150",
    canTrain: true,
    blockedReason: null,
    status: "idle" as const,
    statusLabel: "Level 2",
    minutesRemaining: null,
    sessionDurationMinutes: 60,
    currentBenefitLabel: "Reduces scan time 10%",
    nextBenefitLabel: "Reduces scan time 20%",
    incrementBenefitLabel: "Reduces scan time 10%",
  };
  const role = {
    id: "staff.imaging_technician",
    displayName: "Imaging Technician",
    currentCount: 1,
    maximumCount: 3,
    hiringCostLabel: "$300",
    canHire: true,
    trainingSummary: { averageLevelLabel: "Avg Lv 2", averageBenefitLabel: "Reduces scan time 10%" },
    employees: [{
      id: "employee.tech",
      displayName: "Kofi",
      roleDisplayName: "Imaging Technician",
      salaryLabel: "$30/hr",
      salaryPerHour: 30,
      moraleLabel: "72%",
      moralePercent: 72,
      canDecreaseSalary: true,
      canIncreaseSalary: true,
      training: trainingView,
      trainingTeamAverageAfterLabel: "Reduces scan time 20%",
    }],
  };
  const render = (staffTraining: Parameters<typeof StaffPanel>[0]["staffTraining"]) => renderToStaticMarkup(
    <StaffPanel
      roles={[role]}
      staffTraining={staffTraining}
      onHire={vi.fn()}
      onDecreaseSalary={vi.fn()}
      onIncreaseSalary={vi.fn()}
      onFire={vi.fn()}
      onTrain={vi.fn()}
    />,
  );

  it("hides every training element until a Training Room is built", () => {
    const markup = render(null);
    expect(markup).not.toContain("Train");
    expect(markup).not.toContain("Avg Lv");
    expect(markup).not.toContain("staff-training-pips");
  });

  it("shows the role's average training and each card's level once built", () => {
    const markup = render({ inTrainingCount: 1, queuedCount: 2, capacity: 2, summaryLabel: "1/2 training · 2 queued" });
    expect(markup).toContain("Avg Lv 2");
    expect(markup).toContain("Reduces scan time 10%");
    expect(markup).toContain('aria-label="Training level 2 of 5"');
    expect(markup).toContain("Lv 2/5");
    expect(markup).toContain(">Train<");
    expect(markup).toContain("1/2 training · 2 queued");
  });

  it("opens a tip's named, priced training confirmation without purchasing before confirmation", () => {
    const train = vi.fn();
    const markup = renderToStaticMarkup(<StaffPanel roles={[role]}
      staffTraining={{ inTrainingCount: 0, queuedCount: 0, capacity: 2, summaryLabel: "0/2 training" }}
      requestedTraining={{ employeeId: "employee.tech", requestKey: 1 }}
      onHire={vi.fn()} onDecreaseSalary={vi.fn()} onIncreaseSalary={vi.fn()} onFire={vi.fn()} onTrain={train} />);
    expect(markup).toContain('role="dialog" aria-label="Train Kofi"');
    expect(markup).toContain("Train $150"); expect(markup).toContain("Lv 3 for $150");
    expect(markup).toContain("Reduces scan time 20%"); expect(markup).toContain("Cancel");
    expect(train).not.toHaveBeenCalled();
  });

  it("fills open positions with dashed hire slots and keeps one alert hire target", () => {
    const markup = render(null);
    expect(markup.match(/staff-open-slot/g)).toHaveLength(2);
    expect(markup.match(/data-staff-role-hire/g)).toHaveLength(1);
    expect(markup).toContain("Payroll");
    expect(markup).toContain("$30/hr");
  });

  it("shows the active frozen 36-minute session without rounding it to an hour", () => {
    const upgradedRole: Parameters<typeof StaffPanel>[0]["roles"][number] = structuredClone(role);
    upgradedRole.employees[0]!.training = {
      ...trainingView, status: "training", statusLabel: "Training · 24 min left",
      minutesRemaining: 24, sessionDurationMinutes: 36,
    };
    const markup = renderToStaticMarkup(<StaffPanel roles={[upgradedRole]}
      staffTraining={{ inTrainingCount: 1, queuedCount: 0, capacity: 2, summaryLabel: "1/2 training" }}
      onHire={vi.fn()} onDecreaseSalary={vi.fn()} onIncreaseSalary={vi.fn()} onFire={vi.fn()} onTrain={vi.fn()} />);
    expect(markup).toContain("Training · 24 min left");
    expect(markup).toContain("36 min session");
    expect(markup).not.toContain("1 hr");
  });

  it("keeps queued work neutral about its unbound duration", () => {
    const queuedRole: Parameters<typeof StaffPanel>[0]["roles"][number] = structuredClone(role);
    queuedRole.employees[0]!.training = { ...trainingView, status: "queued", statusLabel: "Queued · working", sessionDurationMinutes: null };
    const markup = renderToStaticMarkup(<StaffPanel roles={[queuedRole]}
      staffTraining={{ inTrainingCount: 0, queuedCount: 1, capacity: 2, summaryLabel: "0/2 training · 1 queued" }}
      onHire={vi.fn()} onDecreaseSalary={vi.fn()} onIncreaseSalary={vi.fn()} onFire={vi.fn()} onTrain={vi.fn()} />);
    expect(markup).toContain("Queued · working");
    expect(markup).not.toMatch(/60 min|1 hr|1 hour/);
  });
});
