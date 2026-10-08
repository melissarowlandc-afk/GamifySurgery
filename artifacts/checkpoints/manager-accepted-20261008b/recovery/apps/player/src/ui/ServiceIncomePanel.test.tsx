import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ServiceIncomePanel } from "./ServiceIncomePanel";
import type { ServiceIncomeView } from "./types";

const baseView: ServiceIncomeView = {
  appointmentsEnabled: true,
  catalogLines: [],
  activeOperations: [],
  recentReceipts: [],
  grossTotalLabel: "$0.00",
  stockCostTotalLabel: "$0.00",
  netTotalLabel: "$0.00",
};

describe("ServiceIncomePanel laboratory work queue", () => {
  it("renders the eligible manual laboratory action without a cash shortcut", () => {
    const markup = renderToStaticMarkup(
      <ServiceIncomePanel
        serviceIncome={{ ...baseView, laboratoryWorkQueue: { enabled: true, statusLabel: "Ready to queue processing" } }}
        onAppointmentsEnabledChange={vi.fn()}
        onStartLaboratoryProcessing={vi.fn()}
      />,
    );
    expect(markup).toContain("Queue laboratory work");
    expect(markup).toContain("Ready to queue processing");
    expect(markup).not.toContain("disabled=\"\"");
    expect(markup.indexOf("service-income-scroll")).toBeLessThan(markup.indexOf("Queue laboratory work"));
  });

  it("renders a blocked queue action with its domain-projected reason", () => {
    const markup = renderToStaticMarkup(
      <ServiceIncomePanel
        serviceIncome={{ ...baseView, laboratoryWorkQueue: { enabled: false, statusLabel: "No work queued", disabledReason: "Requires a reachable, operational Laboratory." } }}
        onAppointmentsEnabledChange={vi.fn()}
        onStartLaboratoryProcessing={vi.fn()}
      />,
    );
    expect(markup).toContain("disabled=\"\"");
    expect(markup).toContain("Requires a reachable, operational Laboratory.");
  });

  it("names due, out-of-service, and actively repairing rooms with complete QI and break counts", () => {
    const markup = renderToStaticMarkup(
      <ServiceIncomePanel
        serviceIncome={{
          ...baseView,
          levelThreeSupport: {
            maintenanceDueRoomNames: ["Laboratory"],
            maintenanceOutOfServiceRoomNames: ["Ambulatory OR"],
            maintenanceRepairingRoomNames: ["Ambulatory OR"],
            queuedQiReviewCount: 2,
            inProgressQiReviewCount: 1,
            completedQiReviewCount: 3,
            staffOnBreakCount: 4,
          },
        }}
        onAppointmentsEnabledChange={vi.fn()}
        onStartLaboratoryProcessing={vi.fn()}
      />,
    );
    expect(markup).toMatch(/Maintenance due<\/span><strong>Laboratory</);
    expect(markup).toContain("Out of service: Ambulatory OR");
    expect(markup).toContain("Repairing: Ambulatory OR");
    expect(markup).toContain("2 queued · 1 in progress · 3 completed");
    expect(markup).toMatch(/Staff on break<\/span><strong>4</);
    expect(markup.indexOf("service-income-scroll")).toBeLessThan(markup.indexOf("Level 3 support"));
  });
});

describe("ServiceIncomePanel grouping", () => {
  const line = (overrides: Partial<ServiceIncomeView["catalogLines"][number]>): ServiceIncomeView["catalogLines"][number] => ({
    id: "income.ultrasound", displayName: "Ultrasound", kind: "clinical", feeLabel: "$120.00",
    minimumFacilityLevel: 1, requirementLabel: "Ultrasound Room + Imaging Technician", available: true,
    group: "earning", arrivalLabel: "Booked visitors about every 2 hr", scheduled: true, ...overrides,
  });

  it("groups services, offers setup shortcuts and flags paused income", () => {
    const markup = renderToStaticMarkup(
      <ServiceIncomePanel
        serviceIncome={{
          ...baseView,
          catalogLines: [
            line({}),
            line({ id: "income.xray", displayName: "X-ray", group: "paused", available: false, pausedReason: "Paused: X-ray Room awaiting repair" }),
            line({ id: "income.ct", displayName: "CT", group: "needs", available: false, unavailableReason: "Requires CT Room", setupActions: [{ label: "Build CT Room", target: "room", id: "room.ct" }] }),
            line({ id: "income.mri", displayName: "MRI", group: "future", available: false, minimumFacilityLevel: 4, unavailableReason: "Locked until Facility Level 4" }),
          ],
        }}
        onAppointmentsEnabledChange={vi.fn()}
        onStartLaboratoryProcessing={vi.fn()}
        onSetupAction={vi.fn()}
      />,
    );
    expect(markup).toContain("Earning now");
    expect(markup).toContain("Booked visitors about every 2 hr");
    expect(markup).toContain("Needs a room or staff");
    expect(markup).toContain("Build CT Room");
    expect(markup).toContain("Paused: X-ray Room awaiting repair");
    expect(markup).toContain('aria-label="Needs attention"');
    // Higher levels start collapsed.
    expect(markup).toContain("Higher facility levels");
    expect(markup).not.toContain(">MRI<");
  });

  it("marks booked services paused while appointments are off", () => {
    const markup = renderToStaticMarkup(
      <ServiceIncomePanel
        serviceIncome={{ ...baseView, appointmentsEnabled: false, catalogLines: [line({})] }}
        onAppointmentsEnabledChange={vi.fn()}
        onStartLaboratoryProcessing={vi.fn()}
      />,
    );
    expect(markup).toContain("Booked visitors paused · appointments are off");
    expect(markup).toContain("Scheduled appointments are off.");
    expect(markup).toContain('aria-pressed="true">Off<');
  });
});
