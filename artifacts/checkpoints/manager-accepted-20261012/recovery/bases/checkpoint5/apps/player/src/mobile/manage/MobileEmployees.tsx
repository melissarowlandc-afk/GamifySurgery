import { useEffect, useState } from "react";
import { PROTOTYPE_DOMAIN_CONTEXT } from "@gamify-surgery/game-domain";
import { formatFacilityDuration } from "../../session/facilityDuration";
import { PixelAvatar } from "../../ui/PixelAvatar";
import type { StaffMemberView, StaffRoleGroupView } from "../../ui/types";
import type { MobileManageProps } from "./MobileManage";
import { MobileManageSheet } from "./MobileManageSheet";
import { MobileManageTile } from "./MobileManageTile";

type EmployeesProps = Pick<MobileManageProps, "staffRoles" | "staffTraining" | "facility" | "ownedRooms" | "needsYou" |
  "highlightedRoleId" | "highlightedEmployeeId" | "requestedTraining" | "onHireStaff" | "onDetailBackChange" |
  "onDecreaseEmployeeSalary" | "onIncreaseEmployeeSalary" | "onFireEmployee" | "onTrainEmployee" | "onPraiseEmployee">;
type Confirmation = { employeeId: string; kind: "fire" | "train" } | null;

const ROLE_LABELS: Record<string, [string, string]> = {
  "staff.receptionist": ["Reception", "☎"], "staff.app": ["APP", "⚕"],
  "staff.glp1_np": ["GLP-1 NP", "✚"], "staff.laboratory_technician": ["Lab tech", "⚗"],
  "staff.phlebotomist": ["Phlebotomy", "◉"], "staff.imaging_technician": ["Imaging", "▣"],
  "staff.radiologist": ["Radiology", "▧"], "staff.endoscopy_nurse": ["Endoscopy", "⚕"],
  "staff.or_nurse": ["OR nurse", "✚"], "staff.periop_nurse": ["Peri-op", "✚"],
  "staff.evs_worker": ["EVS", "✧"], "staff.repair_person": ["Repair", "⚒"],
  "staff.qi_manager": ["Quality", "✓"], "staff.pharmacist": ["Pharmacy", "℞"],
};

export function MobileStaffOverview({ staffRoles, staffTraining }: Pick<EmployeesProps, "staffRoles" | "staffTraining">) {
  const employees = staffRoles.flatMap(role => role.employees);
  const payroll = employees.every(employee => employee.salaryPerHour !== undefined)
    ? employees.reduce((sum, employee) => sum + (employee.salaryPerHour ?? 0), 0) : null;
  const morale = employees.length ? Math.round(employees.reduce((sum, employee) => sum + employee.moralePercent, 0) / employees.length) : null;
  return <dl className="mobile-manage-overview" aria-label="Staff overview">
    <div><dt>Staff</dt><dd>{employees.length}</dd></div>
    <div><dt>Payroll</dt><dd>{payroll === null ? "—" : `$${payroll.toLocaleString("en-US")}/hr`}</dd></div>
    <div><dt>Avg morale</dt><dd>{morale === null ? "—" : `${morale}%`}</dd></div>
    <div><dt>Training</dt><dd>{staffTraining ? `${staffTraining.inTrainingCount}/${staffTraining.capacity}` : "No room"}
      {staffTraining?.queuedCount ? <small>{staffTraining.queuedCount} queued</small> : null}</dd></div>
  </dl>;
}

export function MobileEmployees(props: EmployeesProps) {
  const [roleId, setRoleId] = useState<string | null>(() => props.highlightedRoleId ?? null);
  const [employeeId, setEmployeeId] = useState<string | null>(() => props.requestedTraining?.employeeId ?? props.highlightedEmployeeId ?? null);
  const [lockedOpen, setLockedOpen] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation>(() => props.requestedTraining
    ? { employeeId: props.requestedTraining.employeeId, kind: "train" } : null);
  useEffect(() => {
    const id = props.requestedTraining?.employeeId ?? props.highlightedEmployeeId;
    if (id) {
      const role = props.staffRoles.find(candidate => candidate.employees.some(employee => employee.id === id));
      if (role) { setRoleId(role.id); setEmployeeId(id); setLockedOpen(false); }
    } else if (props.highlightedRoleId) { setRoleId(props.highlightedRoleId); setEmployeeId(null); setLockedOpen(false); }
    if (props.requestedTraining) setConfirmation({ employeeId: props.requestedTraining.employeeId, kind: "train" });
  }, [props.highlightedRoleId, props.highlightedEmployeeId, props.requestedTraining]);

  const allEmployees = props.staffRoles.flatMap(role => role.employees);
  const selectedRole = props.staffRoles.find(role => role.id === roleId) ??
    props.staffRoles.find(role => role.employees.some(employee => employee.id === employeeId));
  const employee = selectedRole?.employees.find(member => member.id === employeeId);
  const locked = props.staffRoles.filter(role => (role.maximumCount === 0 && role.currentCount === 0) || role.blockedReason?.startsWith("Locked"));
  const available = props.staffRoles.filter(role => !locked.includes(role));
  const openRole = (id: string) => { setRoleId(id); setEmployeeId(null); setConfirmation(null); };
  const closeEmployee = () => { setEmployeeId(null); setConfirmation(null); };
  const homeLabel = (id: string) => {
    const member = props.facility.staff.find(candidate => candidate.instanceId === id);
    if (!member) return "Not supplied";
    if (!member.homeRoomInstanceId) return "Not assigned";
    const homeId = member.homeRoomInstanceId;
    const room = props.facility.rooms.find(candidate => candidate.instanceId === homeId);
    return props.ownedRooms?.find(candidate => candidate.id === homeId)?.displayName ?? room?.buildLabel ?? room?.displayName ?? "Room unavailable";
  };
  const employeeStatus = (member: StaffMemberView) => {
    // Reuse the game's configured unhappy-staff boundary for a presentation marker.
    if (member.moralePercent <= PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.patientSatisfaction.unhappyStaffMoraleThreshold) return "Low morale";
    if (member.training && !["idle", "max_level"].includes(member.training.status)) return member.training.statusLabel;
    return props.needsYou?.find(need => need.targetType === "employee" && need.targetId === member.id)?.title ?? null;
  };
  const roleStatus = (role: StaffRoleGroupView): { status: "attention" | "hire" | "running" | "off"; label: string } => {
    const departing = props.facility.staff.some(member => !allEmployees.some(active => active.id === member.instanceId) &&
      (member.staffRoleDefinitionId === role.id || member.roleDisplayName === role.displayName));
    const attention = departing ? "Departing" : role.employees.map(employeeStatus).find(Boolean) ??
      (role.currentCount && props.needsYou?.some(need => need.kind === "payroll") ? "Payroll at risk" : null);
    return attention ? { status: "attention", label: attention } : role.canHire ? { status: "hire", label: "Hire available" }
      : role.currentCount ? { status: "running", label: "Staffed" } : { status: "off", label: "Needs setup" };
  };

  if (employee && selectedRole) return <MobileManageSheet title={employee.displayName} backLabel={`Back to ${selectedRole.displayName}`}
    onBack={closeEmployee} onEscape={() => confirmation ? setConfirmation(null) : closeEmployee()} onDetailBackChange={props.onDetailBackChange}>
    <EmployeeDetails employee={employee} home={homeLabel(employee.id)} highlighted={employee.id === props.highlightedEmployeeId}
      trainingAvailable={Boolean(props.staffTraining)} confirmation={confirmation?.employeeId === employee.id ? confirmation.kind : null}
      onConfirmation={kind => setConfirmation(kind ? { employeeId: employee.id, kind } : null)} callbacks={props} />
    {employeeStatus(employee) ? <p className="mobile-manage-note" role="status">{employeeStatus(employee)}</p> : null}
    {!props.staffTraining ? <p className="mobile-manage-note">Build a Training Room to train employees.</p> : null}
    <p className="mobile-manage-note">Home assignments are managed automatically by the clinic.</p>
  </MobileManageSheet>;

  if (selectedRole) return <MobileManageSheet title={selectedRole.displayName} backLabel={lockedOpen ? "Back to locked roles" : "Back to employee roles"}
    onBack={() => { setRoleId(null); setConfirmation(null); }} onDetailBackChange={props.onDetailBackChange}>
    <section className="mobile-manage-card" data-staff-role-id={selectedRole.id}>
      <div className="mobile-manage-card-heading"><h3>{selectedRole.displayName}</h3><strong>{selectedRole.currentCount}/{selectedRole.maximumCount}</strong></div>
      <div className="mobile-manage-hire"><span>Hire price <b>{selectedRole.hiringCostLabel}</b></span>
        <button type="button" className="mobile-primary" data-phone-anchor="hire" aria-label={`Hire ${selectedRole.displayName}`} data-staff-role-hire
          disabled={!selectedRole.canHire} onClick={() => props.onHireStaff(selectedRole.id)}>Hire {selectedRole.hiringCostLabel}</button></div>
      {!selectedRole.canHire && selectedRole.blockedReason ? <p className="mobile-manage-blocked" role="note">{selectedRole.blockedReason}</p> : null}
      <p>{selectedRole.currentCount} staffed · {selectedRole.maximumCount} positions in built rooms.</p>
      {selectedRole.staffingGuidance ? <p className="mobile-manage-note">{selectedRole.staffingGuidance}</p> : null}
      {props.staffTraining && selectedRole.trainingSummary ? <p>{selectedRole.trainingSummary.averageLevelLabel} · {selectedRole.trainingSummary.averageBenefitLabel}</p> : null}
    </section>
    <h3 className="mobile-manage-section-title">Employees · {selectedRole.employees.length}</h3>
    {!selectedRole.employees.length ? <p>No staff yet.</p> : <div className="mobile-manage-grid mobile-manage-portraits" aria-label={`${selectedRole.displayName} employees`}>
      {selectedRole.employees.map(member => <MobileManageTile key={member.id} label={member.displayName} hint={member.activityLabel ?? member.roleDisplayName}
        data-employee-id={member.id} aria-label={`Employee details for ${member.displayName}`} status={employeeStatus(member) ? "attention" : "running"}
        statusLabel={employeeStatus(member) ?? member.moraleLabel} onClick={() => { setEmployeeId(member.id); setConfirmation(null); }}>
        <PixelAvatar avatar={member.avatar} label={`${member.displayName} portrait`} size="medium" />
      </MobileManageTile>)}
    </div>}
  </MobileManageSheet>;

  if (lockedOpen) return <MobileManageSheet title="Locked / not built yet" backLabel="Back to employee roles"
    onBack={() => setLockedOpen(false)} onDetailBackChange={props.onDetailBackChange}>
    <p>Build compatible rooms to add positions. More roles unlock as your clinic develops.</p>
    <div className="mobile-manage-stack">{locked.map(role => <button type="button" key={role.id} className="mobile-manage-locked-row"
      aria-label={`Role details for ${role.displayName}`} onClick={() => openRole(role.id)}>
      <strong>{role.displayName}</strong><span>{role.currentCount}/{role.maximumCount}</span><small>{role.blockedReason ?? "No positions built yet"}</small>
    </button>)}</div>
  </MobileManageSheet>;

  return <div className="mobile-manage-stack" aria-label="Employee roster">
    <div className="mobile-manage-grid" aria-label="Employee role tiles">{available.map(role => {
      const [label, icon] = ROLE_LABELS[role.id] ?? [role.displayName, "⚕"];
      const status = roleStatus(role);
      return <MobileManageTile key={role.id} label={label} icon={icon} badge={`${role.currentCount}/${role.maximumCount}`}
        data-staff-role-id={role.id} aria-label={`Role details for ${role.displayName}`} status={status.status} statusLabel={status.label}
        onClick={() => openRole(role.id)}>
        {role.employees[0]?.avatar ? <PixelAvatar avatar={role.employees[0].avatar} label={`${role.displayName} portrait`} size="small" /> : undefined}
      </MobileManageTile>;
    })}</div>
    <button type="button" className="mobile-manage-locked-row" aria-label="Locked / not built yet" aria-expanded="false" onClick={() => setLockedOpen(true)}>
      <strong>Locked / not built yet</strong><span>{locked.length ? `${locked.length} roles` : "More roles"}</span>
    </button>
    {!props.staffRoles.length ? <p>Employee roles unlock as the clinic develops.</p> : null}
  </div>;
}

function EmployeeDetails({ employee, home, highlighted, trainingAvailable, confirmation, onConfirmation, callbacks }: {
  employee: StaffMemberView; home: string; highlighted: boolean; trainingAvailable: boolean;
  confirmation: "fire" | "train" | null; onConfirmation: (kind: "fire" | "train" | null) => void; callbacks: EmployeesProps;
}) {
  const training = employee.training;
  const activeTraining = training && training.status !== "idle" && training.status !== "max_level";
  const bodyId = `mobile-employee-${employee.id}`;
  return <article data-employee-id={employee.id} tabIndex={-1} className={`mobile-employee${highlighted ? " is-highlighted" : ""}`}>
    <div className="mobile-employee-toggle">
      <PixelAvatar avatar={employee.avatar} label={`${employee.displayName} portrait`} size="medium" />
      <span className="mobile-employee-identity"><strong>{employee.displayName}</strong>
        <span>{employee.activityLabel ?? employee.roleDisplayName}</span>
        <small>{employee.moraleLabel}{training ? ` · Lv ${training.level}/5` : ""}</small></span>
    </div>
    <div id={bodyId} className="mobile-employee-body">
      <dl className="mobile-manage-facts"><div><dt>Role</dt><dd>{employee.roleDisplayName}</dd></div>
        {employee.activityLabel ? <div><dt>Activity</dt><dd>{employee.activityLabel}</dd></div> : null}
        <div><dt>Home room</dt><dd>{home}</dd></div><div><dt>Morale</dt><dd>{employee.moraleLabel}</dd></div></dl>
      <div className="mobile-manage-salary"><span>Salary</span><div className="mobile-manage-stepper">
        <button type="button" disabled={!employee.canDecreaseSalary} aria-label={`Decrease ${employee.displayName}'s salary`}
          onClick={() => callbacks.onDecreaseEmployeeSalary(employee.id)}>−</button>
        <strong>{employee.salaryLabel}</strong>
        <button type="button" disabled={!employee.canIncreaseSalary} aria-label={`Increase ${employee.displayName}'s salary`}
          onClick={() => callbacks.onIncreaseEmployeeSalary(employee.id)}>+</button>
      </div></div>
      {training ? <div className="mobile-manage-training"><strong>Training level {training.level}/5</strong>
        <p>{training.currentBenefitLabel}</p>
        {trainingAvailable && activeTraining ? <p role="status">{training.statusLabel}
          {training.sessionDurationMinutes !== null ? ` · ${formatFacilityDuration(training.sessionDurationMinutes)} session` : ""}</p> : null}
      </div> : null}
      <div className="mobile-manage-actions">
        {trainingAvailable && training && !activeTraining && callbacks.onTrainEmployee ? <button type="button"
          aria-label={`Train ${employee.displayName}`} disabled={training.status === "max_level"} onClick={() => onConfirmation("train")}>
          {training.status === "max_level" ? "Max level" : `Train ${training.costLabel ?? ""}`}</button> : null}
        <button type="button" aria-label={`Praise ${employee.displayName}`} onClick={() => callbacks.onPraiseEmployee(employee.id)}>Praise</button>
        <button type="button" aria-label={`Fire ${employee.displayName}`} onClick={() => onConfirmation("fire")}>Fire</button>
      </div>
      {confirmation === "train" && trainingAvailable && training && training.nextLevel !== null ? <div className="mobile-manage-confirmation" role="dialog" aria-label={`Train ${employee.displayName}`}>
        <strong>Train {employee.displayName}</strong><p>Now Lv {training.level}/5: {training.currentBenefitLabel}.</p>
        <p>Lv {training.nextLevel} for {training.costLabel}: {training.nextBenefitLabel}.</p>
        {employee.trainingTeamAverageAfterLabel ? <p>Team average after: {employee.trainingTeamAverageAfterLabel}.</p> : null}
        <p>{training.sessionDurationMinutes === null ? "Duration depends on the assigned Training Room; keeps working while queued."
          : `Training session: ${formatFacilityDuration(training.sessionDurationMinutes)}; keeps working while queued.`}</p>
        <p>Leaves their post for the training session, then returns to work.</p>
        {!training.canTrain && training.blockedReason ? <p className="mobile-manage-blocked">{training.blockedReason}</p> : null}
        <div className="mobile-manage-actions"><button type="button" className="mobile-primary" disabled={!training.canTrain}
          onClick={() => { callbacks.onTrainEmployee?.(employee.id); onConfirmation(null); }}>Train {training.costLabel}</button>
          <button type="button" onClick={() => onConfirmation(null)}>Cancel</button></div>
      </div> : null}
      {confirmation === "fire" ? <div className="mobile-manage-confirmation" role="alertdialog" aria-label={`Confirm firing ${employee.displayName}`}>
        <strong>Fire {employee.displayName}?</strong><p>They will leave this clinic immediately.</p>
        {training?.status === "queued" ? <p>Their queued training payment is refunded.</p> : null}
        <div className="mobile-manage-actions"><button type="button" className="mobile-manage-danger"
          onClick={() => { callbacks.onFireEmployee(employee.id); onConfirmation(null); }}>Confirm Fire</button>
          <button type="button" onClick={() => onConfirmation(null)}>Cancel</button></div>
      </div> : null}
    </div>
  </article>;
}
