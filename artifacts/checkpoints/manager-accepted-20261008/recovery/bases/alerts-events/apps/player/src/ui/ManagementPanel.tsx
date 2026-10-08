import { useEffect, useState } from "react";
import { StaffPanel } from "./StaffPanel";
import { ServiceIncomePanel } from "./ServiceIncomePanel";
import { MoneyPanel } from "./MoneyPanel";
import type {
  ServiceIncomeView,
  ServiceSetupActionView,
  StaffRoleGroupView,
  StaffTrainingOverviewView,
} from "./types";

interface ManagementPanelProps {
  managementMode: boolean;
  showInactiveTrigger?: boolean;
  roles: StaffRoleGroupView[];
  staffTraining?: StaffTrainingOverviewView | null;
  highlightedRoleId?: string | null;
  highlightedEmployeeId?: string | null;
  serviceIncome: ServiceIncomeView;
  onEnterManagementMode: () => void;
  onExitManagementMode: () => void;
  onHire: (staffRoleDefinitionId: string) => void;
  onDecreaseSalary: (employeeId: string) => void;
  onIncreaseSalary: (employeeId: string) => void;
  onFire: (employeeId: string) => void;
  onTrain?: (employeeId: string) => void;
  onAppointmentsEnabledChange: (enabled: boolean) => void;
  onStartLaboratoryProcessing: () => void;
  onSetupAction?: (action: ServiceSetupActionView) => void;
}

type ManagementTab = "employees" | "services" | "money";

const TABS: { id: ManagementTab; label: string }[] = [
  { id: "employees", label: "Employees" },
  { id: "services", label: "Services" },
  { id: "money", label: "Money" },
];

/** Desk-owned staff, services and money views shown while facility time is paused. */
export function ManagementPanel({
  managementMode,
  showInactiveTrigger = true,
  roles,
  staffTraining = null,
  highlightedRoleId,
  highlightedEmployeeId,
  serviceIncome,
  onEnterManagementMode,
  onExitManagementMode,
  onHire,
  onDecreaseSalary,
  onIncreaseSalary,
  onFire,
  onTrain,
  onAppointmentsEnabledChange,
  onStartLaboratoryProcessing,
  onSetupAction,
}: ManagementPanelProps) {
  const [activeTab, setActiveTab] = useState<ManagementTab>("employees");
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
        <strong id="management-mode-title" className="management-mode-title">
          Management Mode
        </strong>
        <span className="management-paused-chip">Clinic paused</span>
        <button
          className="management-done-button"
          type="button"
          onClick={onExitManagementMode}
        >
          Done
        </button>
      </header>
      <div className="management-tabs" role="tablist" aria-label="Management sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "employees" ? (
        <StaffPanel
          roles={roles}
          staffTraining={staffTraining}
          highlightedRoleId={highlightedRoleId}
          highlightedEmployeeId={highlightedEmployeeId}
          onHire={onHire}
          onDecreaseSalary={onDecreaseSalary}
          onIncreaseSalary={onIncreaseSalary}
          onFire={onFire}
          onTrain={onTrain}
        />
      ) : activeTab === "services" ? (
        <ServiceIncomePanel
          serviceIncome={serviceIncome}
          onAppointmentsEnabledChange={onAppointmentsEnabledChange}
          onStartLaboratoryProcessing={onStartLaboratoryProcessing}
          onSetupAction={onSetupAction}
        />
      ) : (
        <MoneyPanel serviceIncome={serviceIncome} />
      )}
    </section>
  );
}
