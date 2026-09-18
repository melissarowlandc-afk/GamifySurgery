import { StaffPanel } from "./StaffPanel";
import type { StaffRoleGroupView } from "./types";

interface ManagementPanelProps {
  managementMode: boolean;
  showInactiveTrigger?: boolean;
  roles: StaffRoleGroupView[];
  highlightedRoleId?: string | null;
  highlightedEmployeeId?: string | null;
  onEnterManagementMode: () => void;
  onExitManagementMode: () => void;
  onHire: (staffRoleDefinitionId: string) => void;
  onDecreaseSalary: (employeeId: string) => void;
  onIncreaseSalary: (employeeId: string) => void;
  onFire: (employeeId: string) => void;
}

/** Desk-owned employee roster shown while facility time is paused. */
export function ManagementPanel({
  managementMode,
  showInactiveTrigger = true,
  roles,
  highlightedRoleId,
  highlightedEmployeeId,
  onEnterManagementMode,
  onExitManagementMode,
  onHire,
  onDecreaseSalary,
  onIncreaseSalary,
  onFire,
}: ManagementPanelProps) {
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
          <span>Employees &amp; morale</span>
        </div>
        <button
          className="button button-primary management-done-button"
          type="button"
          onClick={onExitManagementMode}
        >
          Done
        </button>
      </header>
      <StaffPanel
        roles={roles}
        highlightedRoleId={highlightedRoleId}
        highlightedEmployeeId={highlightedEmployeeId}
        onHire={onHire}
        onDecreaseSalary={onDecreaseSalary}
        onIncreaseSalary={onIncreaseSalary}
        onFire={onFire}
      />
    </section>
  );
}
