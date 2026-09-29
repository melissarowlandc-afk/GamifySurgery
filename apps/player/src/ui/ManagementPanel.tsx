import { useEffect, useState } from "react";
import { StaffPanel } from "./StaffPanel";
import { ServiceIncomePanel } from "./ServiceIncomePanel";
import type { ServiceIncomeView, StaffRoleGroupView } from "./types";

interface ManagementPanelProps {
  managementMode: boolean;
  showInactiveTrigger?: boolean;
  roles: StaffRoleGroupView[];
  highlightedRoleId?: string | null;
  highlightedEmployeeId?: string | null;
  serviceIncome: ServiceIncomeView;
  onEnterManagementMode: () => void;
  onExitManagementMode: () => void;
  onHire: (staffRoleDefinitionId: string) => void;
  onDecreaseSalary: (employeeId: string) => void;
  onIncreaseSalary: (employeeId: string) => void;
  onFire: (employeeId: string) => void;
  onAppointmentsEnabledChange: (enabled: boolean) => void;
}

/** Desk-owned employee roster shown while facility time is paused. */
export function ManagementPanel({
  managementMode,
  showInactiveTrigger = true,
  roles,
  highlightedRoleId,
  highlightedEmployeeId,
  serviceIncome,
  onEnterManagementMode,
  onExitManagementMode,
  onHire,
  onDecreaseSalary,
  onIncreaseSalary,
  onFire,
  onAppointmentsEnabledChange,
}: ManagementPanelProps) {
  const [activeTab, setActiveTab] = useState<"employees" | "services">("employees");
  useEffect(() => {
    if (highlightedRoleId || highlightedEmployeeId) setActiveTab("employees");
  }, [highlightedEmployeeId, highlightedRoleId]);
  if (!managementMode) {
    if (!showInactiveTrigger) {
      return null;
    }
    return (
      <button
        className="button button-primary management-mode-trigger mode-toggle-button"
        type="button"
        onClick={onEnterManagementMode}
        aria-label="Enter Management Mode"
      >
        Enter Management Mode
        <small>Pauses the clinic while you manage staff</small>
      </button>
    );
  }

  return (
    <section className="panel management-panel" aria-labelledby="management-mode-title">
      <header className="management-mode-topbar">
        <div>
          <strong id="management-mode-title" className="management-mode-title">
            Management Mode
          </strong>
          <span>Staff, services &amp; income</span>
        </div>
        <button
          className="button button-primary management-done-button"
          type="button"
          onClick={onExitManagementMode}
        >
          Done
        </button>
      </header>
      <div className="management-tabs" role="tablist" aria-label="Management sections">
        <button type="button" role="tab" aria-selected={activeTab === "employees"} onClick={() => setActiveTab("employees")}>Employees</button>
        <button type="button" role="tab" aria-selected={activeTab === "services"} onClick={() => setActiveTab("services")}>Services &amp; income</button>
      </div>
      {activeTab === "employees" ? <StaffPanel roles={roles} highlightedRoleId={highlightedRoleId} highlightedEmployeeId={highlightedEmployeeId} onHire={onHire} onDecreaseSalary={onDecreaseSalary} onIncreaseSalary={onIncreaseSalary} onFire={onFire} /> : <ServiceIncomePanel serviceIncome={serviceIncome} onAppointmentsEnabledChange={onAppointmentsEnabledChange} />}
    </section>
  );
}
