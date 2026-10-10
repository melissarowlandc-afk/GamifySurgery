import { useEffect, useState } from "react";
import { PixelAvatar } from "./PixelAvatar";
import { formatFacilityDuration } from "../session/facilityDuration";
import type {
  StaffMemberView,
  StaffRoleGroupView,
  StaffTrainingOverviewView,
} from "./types";

interface StaffPanelProps {
  roles: StaffRoleGroupView[];
  /** Null until a Training Room is built; then training UI appears. */
  staffTraining?: StaffTrainingOverviewView | null;
  highlightedRoleId?: string | null;
  highlightedEmployeeId?: string | null;
  requestedTraining?: { employeeId: string; requestKey: number } | null;
  onHire: (staffRoleDefinitionId: string) => void;
  onDecreaseSalary: (employeeId: string) => void;
  onIncreaseSalary: (employeeId: string) => void;
  onFire: (employeeId: string) => void;
  onTrain?: (employeeId: string) => void;
}

/** Open open-position slots shown per role before summarising the rest. */
const MAX_OPEN_SLOTS = 4;

/** Player-toggled role sections, remembered while the page stays open. */
const roleOpenMemory = new Map<string, boolean>();

function averageMorale(employees: StaffMemberView[]): number | null {
  return employees.length === 0
    ? null
    : Math.round(employees.reduce((total, employee) => total + employee.moralePercent, 0) / employees.length);
}

function payroll(employees: StaffMemberView[]): number | null {
  return employees.every((employee) => employee.salaryPerHour !== undefined)
    ? employees.reduce((total, employee) => total + (employee.salaryPerHour ?? 0), 0)
    : null;
}

/**
 * Employee roster. Hiring, salary, firing and training remain domain
 * commands; this panel does not calculate caps, salary, morale or prices.
 */
export function StaffPanel({
  roles,
  staffTraining = null,
  highlightedRoleId,
  highlightedEmployeeId,
  requestedTraining,
  onHire,
  onDecreaseSalary,
  onIncreaseSalary,
  onFire,
  onTrain,
}: StaffPanelProps) {
  const [popover, setPopover] = useState<{ employeeId: string; kind: "fire" | "train" } | null>(() =>
    requestedTraining ? { employeeId: requestedTraining.employeeId, kind: "train" } : null,
  );
  const [openRoles, setOpenRoles] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(roles.map((role) => [
      role.id,
      role.id === highlightedRoleId ||
        role.employees.some((employee) => employee.id === highlightedEmployeeId) ||
        (roleOpenMemory.get(role.id) ?? role.employees.length > 0),
    ])),
  );
  const trainingAvailable = staffTraining !== null;

  useEffect(() => {
    if (!requestedTraining) return;
    setPopover({ employeeId: requestedTraining.employeeId, kind: "train" });
    const role = roles.find((item) => item.employees.some((employee) => employee.id === requestedTraining.employeeId));
    if (role) setOpenRoles((current) => ({ ...current, [role.id]: true }));
  }, [requestedTraining]);

  useEffect(() => {
    const highlightedRole = highlightedRoleId ??
      roles.find((role) => role.employees.some((employee) => employee.id === highlightedEmployeeId))?.id;
    if (highlightedRole) setOpenRoles((current) => current[highlightedRole] ? current : { ...current, [highlightedRole]: true });
  }, [highlightedEmployeeId, highlightedRoleId, roles]);

  useEffect(() => {
    if (!popover) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setPopover(null); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [popover]);

  const isOpen = (role: StaffRoleGroupView) => openRoles[role.id] ?? role.employees.length > 0;
  const setRoleOpen = (roleId: string, open: boolean) => {
    roleOpenMemory.set(roleId, open);
    setOpenRoles((current) => ({ ...current, [roleId]: open }));
  };
  const setAllOpen = (open: boolean) => {
    for (const role of roles) roleOpenMemory.set(role.id, open);
    setOpenRoles(Object.fromEntries(roles.map((role) => [role.id, open])));
  };

  const allEmployees = roles.flatMap((role) => role.employees);
  const totalPayroll = payroll(allEmployees);
  const overallMorale = averageMorale(allEmployees);

  return (
    <section className="panel staff-panel" aria-label="Employees">
      <div className="staff-summary">
        <span className="staff-summary-stat"><span>Staff</span><strong>{allEmployees.length}</strong></span>
        {totalPayroll !== null ? (
          <span className="staff-summary-stat"><span>Payroll</span><strong>${totalPayroll.toLocaleString("en-US")}/hr</strong></span>
        ) : null}
        {overallMorale !== null ? (
          <span className="staff-summary-stat"><span>Avg morale</span><strong>{overallMorale}%</strong></span>
        ) : null}
        {staffTraining ? (
          <span className="staff-summary-stat"><span>Training Room</span><strong>{staffTraining.summaryLabel}</strong></span>
        ) : null}
        <span className="staff-summary-actions">
          <button type="button" className="staff-mini-button" onClick={() => setAllOpen(true)}>Expand all</button>
          <button type="button" className="staff-mini-button" onClick={() => setAllOpen(false)}>Collapse all</button>
        </span>
      </div>

      <div className="staff-role-list">
        {roles.length === 0 ? (
          <p className="empty-state">
            Employee roles unlock as the clinic develops.
          </p>
        ) : (
          roles.map((role) => {
            const open = isOpen(role);
            const morale = averageMorale(role.employees);
            const rolePayroll = payroll(role.employees);
            const openSlots = Math.max(0, role.maximumCount - role.currentCount);
            const full = role.maximumCount > 0 && role.currentCount >= role.maximumCount;
            const bodyId = `staff-role-body-${role.id.replace(/[^a-z0-9_-]/gi, "-")}`;
            return (
              <section
                className={`staff-role-group${open ? " is-open" : ""}${
                  role.id === highlightedRoleId ? " is-alert-highlighted" : ""
                }`}
                key={role.id}
                data-staff-role-id={role.id}
                tabIndex={-1}
              >
                <div className="staff-role-heading">
                  <button
                    type="button"
                    className="staff-role-toggle"
                    aria-expanded={open}
                    aria-controls={bodyId}
                    onClick={() => setRoleOpen(role.id, !open)}
                  >
                    <span className="staff-role-chevron" aria-hidden="true" />
                    <h3>{role.displayName}</h3>
                    <span className={`staff-role-count${full ? " is-full" : ""}`}>
                      {role.currentCount}/{role.maximumCount}
                    </span>
                    <span className="staff-role-meta">
                      {trainingAvailable && role.trainingSummary ? (
                        <span className="staff-role-training">
                          <b>{role.trainingSummary.averageLevelLabel}</b> · {role.trainingSummary.averageBenefitLabel}
                        </span>
                      ) : null}
                      {morale !== null ? <span>Morale <b>{morale}%</b></span> : null}
                      {rolePayroll !== null && role.employees.length > 0 ? <span><b>${rolePayroll.toLocaleString("en-US")}</b>/hr</span> : null}
                      {role.employees.length === 0 ? <span>No staff yet</span> : null}
                    </span>
                  </button>
                  <button
                    className="staff-hire-button"
                    type="button"
                    onClick={() => onHire(role.id)}
                    disabled={!role.canHire}
                    title={role.blockedReason}
                    data-staff-role-hire
                  >
                    Hire {role.hiringCostLabel}
                  </button>
                </div>

                {open ? (
                  <div className="staff-role-body" id={bodyId}>
                    {role.blockedReason && !role.canHire && !full ? (
                      <p className="staff-role-note is-blocked">{role.blockedReason}</p>
                    ) : null}
                    {role.staffingGuidance ? (
                      <p className="staff-role-note">{role.staffingGuidance}</p>
                    ) : null}
                    {role.employees.length > 0 || openSlots > 0 ? (
                      <div className="staff-card-grid">
                        {role.employees.map((employee) => (
                          <StaffMemberCard
                            key={employee.id}
                            employee={employee}
                            highlighted={employee.id === highlightedEmployeeId}
                            trainingAvailable={trainingAvailable}
                            popover={popover?.employeeId === employee.id ? popover.kind : null}
                            onOpenPopover={(kind) => setPopover({ employeeId: employee.id, kind })}
                            onClosePopover={() => setPopover(null)}
                            onDecreaseSalary={onDecreaseSalary}
                            onIncreaseSalary={onIncreaseSalary}
                            onFire={onFire}
                            onTrain={onTrain}
                          />
                        ))}
                        {Array.from({ length: Math.min(openSlots, MAX_OPEN_SLOTS) }, (_, index) => (
                          <div className="staff-open-slot" key={`open-${index}`}>
                            <span>Open position</span>
                            <button
                              className="staff-hire-button"
                              type="button"
                              onClick={() => onHire(role.id)}
                              disabled={!role.canHire}
                              title={role.blockedReason}
                            >
                              Hire {role.hiringCostLabel}
                            </button>
                          </div>
                        ))}
                        {openSlots > MAX_OPEN_SLOTS ? (
                          <div className="staff-open-slot is-summary">
                            <span>+{openSlots - MAX_OPEN_SLOTS} more open positions</span>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </section>
            );
          })
        )}
      </div>
    </section>
  );
}

interface StaffMemberCardProps {
  employee: StaffMemberView;
  highlighted: boolean;
  trainingAvailable: boolean;
  popover: "fire" | "train" | null;
  onOpenPopover: (kind: "fire" | "train") => void;
  onClosePopover: () => void;
  onDecreaseSalary: (employeeId: string) => void;
  onIncreaseSalary: (employeeId: string) => void;
  onFire: (employeeId: string) => void;
  onTrain?: (employeeId: string) => void;
}

function StaffMemberCard({
  employee,
  highlighted,
  trainingAvailable,
  popover,
  onOpenPopover,
  onClosePopover,
  onDecreaseSalary,
  onIncreaseSalary,
  onFire,
  onTrain,
}: StaffMemberCardProps) {
  const training = trainingAvailable ? employee.training : undefined;
  const inTrainingFlow = training && training.status !== "idle" && training.status !== "max_level";
  return (
    <article
      className={`staff-member-card${highlighted ? " is-alert-highlighted" : ""}`}
      data-employee-id={employee.id}
      tabIndex={-1}
    >
      <div className="staff-member-identity">
        <PixelAvatar
          avatar={employee.avatar}
          label={`${employee.displayName} portrait`}
          size="medium"
        />
        <div className="staff-member-name">
          <h4>{employee.displayName}</h4>
          {training ? (
            <span className="staff-training-pips" aria-label={`Training level ${training.level} of 5`}>
              {[1, 2, 3, 4, 5].map((level) => (
                <i key={level} className={level <= training.level ? "is-filled" : undefined} />
              ))}
              <small>Lv {training.level}/5</small>
            </span>
          ) : null}
        </div>
      </div>

      <div className="staff-stat-row">
        <span className="staff-stat-label">Morale</span>
        <strong className="staff-morale-value">{employee.moraleLabel}</strong>
        <span className="staff-morale-bar" aria-hidden="true">
          <i style={{ width: `${Math.max(0, Math.min(100, employee.moralePercent))}%` }} />
        </span>
      </div>

      <div className="staff-stat-row">
        <span className="staff-stat-label">Salary</span>
        <button
          type="button"
          className="staff-salary-step"
          onClick={() => onDecreaseSalary(employee.id)}
          disabled={!employee.canDecreaseSalary}
          aria-label={`Decrease ${employee.displayName}'s salary`}
        >
          −
        </button>
        <strong className="staff-salary-value">{employee.salaryLabel}</strong>
        <button
          type="button"
          className="staff-salary-step"
          onClick={() => onIncreaseSalary(employee.id)}
          disabled={!employee.canIncreaseSalary}
          aria-label={`Increase ${employee.displayName}'s salary`}
        >
          +
        </button>
      </div>

      <div className="staff-card-actions">
        {training && inTrainingFlow ? (
          <span className="staff-training-status">
            {training.statusLabel}
            {training.sessionDurationMinutes !== null ? (
              <small> · {formatFacilityDuration(training.sessionDurationMinutes)} session</small>
            ) : null}
          </span>
        ) : training && onTrain ? (
          <button
            type="button"
            className="staff-train-button"
            onClick={() => onOpenPopover("train")}
            disabled={training.status === "max_level"}
          >
            {training.status === "max_level" ? "Max level" : "Train"}
          </button>
        ) : null}
        <button
          className="staff-fire-button"
          type="button"
          onClick={() => onOpenPopover("fire")}
        >
          Fire
        </button>
      </div>

      {popover === "train" && training && training.nextLevel !== null ? (
        <div className="staff-card-popover" role="dialog" aria-label={`Train ${employee.displayName}`}>
          <strong>Train {employee.displayName}</strong>
          <span>Now Lv {training.level}/5: {training.currentBenefitLabel}.</span>
          <span>Lv {training.nextLevel} for {training.costLabel}: {training.nextBenefitLabel}.</span>
          {employee.trainingTeamAverageAfterLabel ? (
            <span>Team average after: {employee.trainingTeamAverageAfterLabel}.</span>
          ) : null}
          <small>
            {training.sessionDurationMinutes === null
              ? "Duration depends on the assigned Training Room; keeps working while queued."
              : `Training session: ${formatFacilityDuration(training.sessionDurationMinutes)}; keeps working while queued.`}
          </small>
          {!training.canTrain && training.blockedReason ? (
            <small className="staff-popover-blocked">{training.blockedReason}</small>
          ) : null}
          <div className="staff-popover-actions">
            <button
              type="button"
              className="button button-primary"
              disabled={!training.canTrain}
              onClick={() => {
                onTrain?.(employee.id);
                onClosePopover();
              }}
            >
              Train {training.costLabel}
            </button>
            <button type="button" className="text-button" onClick={onClosePopover}>Cancel</button>
          </div>
        </div>
      ) : null}

      {popover === "fire" ? (
        <div
          className="staff-card-popover"
          role="alertdialog"
          aria-label={`Confirm firing ${employee.displayName}`}
        >
          <strong>Fire {employee.displayName}?</strong>
          <span>They will leave this clinic immediately.</span>
          {employee.training?.status === "queued" ? (
            <small>Their queued training payment is refunded.</small>
          ) : null}
          <div className="staff-popover-actions">
            <button
              className="button button-danger"
              type="button"
              onClick={() => {
                onFire(employee.id);
                onClosePopover();
              }}
            >
              Confirm Fire
            </button>
            <button type="button" className="text-button" onClick={onClosePopover}>Cancel</button>
          </div>
        </div>
      ) : null}
    </article>
  );
}
