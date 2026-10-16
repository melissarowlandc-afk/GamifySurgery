import { useCallback, useEffect, useState } from "react";
import type { PrototypeShellProps } from "../../shellContract";
import type { ServiceSetupActionView } from "../../ui/types";
import { MobileEmployees, MobileStaffOverview } from "./MobileEmployees";
import type { ManageBackRegistration } from "./MobileManageSheet";
import { MobileServices } from "./MobileServices";
import { MobileMoney } from "./MobileMoney";
import "./mobileManage.css";

export type MobileManageProps = Pick<PrototypeShellProps,
  "managementMode" | "staffRoles" | "staffTraining" | "facility" | "ownedRooms" |
  "serviceIncome" | "resourceBar" | "advertising" | "needsYou" | "onEnterManagementMode" |
  "onExitManagementMode" | "onHireStaff" | "onDecreaseEmployeeSalary" |
  "onIncreaseEmployeeSalary" | "onFireEmployee" | "onTrainEmployee" |
  "onPraiseEmployee" | "onServiceAppointmentsEnabledChange" |
  "onStartLaboratoryProcessing" | "onAdvertisingLevelChange"
> & {
  highlightedRoleId?: string | null;
  highlightedEmployeeId?: string | null;
  requestedTraining?: { employeeId: string; requestKey: number } | null;
  onDetailBackChange?: ManageBackRegistration;
  onSetupAction: (action: ServiceSetupActionView) => void;
};

const SECTIONS = ["Employees", "Services", "Money"] as const;
type ManageSection = typeof SECTIONS[number];

/** Presentation only: mode entry/exit and all commands belong to the shared session. */
export function MobileManage(props: MobileManageProps) {
  const [section, setSection] = useState<ManageSection>("Employees");
  const [detailOpen, setDetailOpen] = useState(false);
  const registerDetailBack = useCallback<ManageBackRegistration>(handler => {
    setDetailOpen(Boolean(handler)); props.onDetailBackChange?.(handler);
  }, [props.onDetailBackChange]);
  useEffect(() => {
    if (props.highlightedRoleId || props.highlightedEmployeeId || props.requestedTraining) setSection("Employees");
  }, [props.highlightedRoleId, props.highlightedEmployeeId, props.requestedTraining]);

  if (!props.managementMode) return <div className="mobile-manage">
    <button type="button" className="mobile-primary" onClick={props.onEnterManagementMode}>Enter Management Mode</button>
    <p>Pauses the clinic while you manage staff.</p>
  </div>;

  return <section className="mobile-manage" aria-label="Management Mode">
    <div inert={detailOpen} aria-hidden={detailOpen || undefined}>
    <div className="mobile-manage-heading"><span role="status">Clinic paused</span>
      <button type="button" onClick={props.onExitManagementMode}>Done</button>
    </div>
    <MobileStaffOverview staffRoles={props.staffRoles} staffTraining={props.staffTraining} />
    <div className="mobile-manage-segments" role="tablist" aria-label="Management sections">
      {SECTIONS.map((name) => <button key={name} type="button" role="tab" data-phone-anchor={name === "Employees" ? "employees" : undefined} id={`mobile-manage-tab-${name.toLowerCase()}`}
        aria-controls={`mobile-manage-${name.toLowerCase()}`} aria-selected={section === name}
        onClick={() => setSection(name)}>{name}</button>)}
    </div>
    </div>
    <div role="tabpanel" id={`mobile-manage-${section.toLowerCase()}`} aria-labelledby={`mobile-manage-tab-${section.toLowerCase()}`}>
      {section === "Employees" ? <MobileEmployees {...props} onDetailBackChange={registerDetailBack} />
        : section === "Services" ? <MobileServices view={props.serviceIncome}
          onDetailBackChange={registerDetailBack} onAppointmentsEnabledChange={props.onServiceAppointmentsEnabledChange}
          onStartLaboratoryProcessing={props.onStartLaboratoryProcessing} onSetupAction={(action) => {
            if (action.target === "staff") setSection("Employees");
            props.onSetupAction(action);
          }} />
          : <MobileMoney view={props.serviceIncome} resourceBar={props.resourceBar}
            advertising={props.advertising} onAdvertisingLevelChange={props.onAdvertisingLevelChange} onDetailBackChange={registerDetailBack} />}
    </div>
  </section>;
}
