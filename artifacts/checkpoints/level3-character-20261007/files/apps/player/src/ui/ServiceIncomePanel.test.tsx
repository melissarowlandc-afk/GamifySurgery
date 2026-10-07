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
    expect(markup).toContain("Maintenance due: Laboratory");
    expect(markup).toContain("Out of service: Ambulatory OR");
    expect(markup).toContain("Repairing: Ambulatory OR");
    expect(markup).toContain("2 queued · 1 in progress · 3 completed");
    expect(markup).toContain("Staff on break: 4");
    expect(markup.indexOf("service-income-scroll")).toBeLessThan(markup.indexOf("Level 3 support"));
  });
});
