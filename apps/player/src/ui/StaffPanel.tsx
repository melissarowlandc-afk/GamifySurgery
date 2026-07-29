import { useState } from "react";
import { PixelAvatar } from "./PixelAvatar";
import type { StaffRoleGroupView } from "./types";

interface StaffPanelProps {
  roles: StaffRoleGroupView[];
  onHire: (staffRoleDefinitionId: string) => void;
  onDecreaseSalary: (employeeId: string) => void;
  onIncreaseSalary: (employeeId: string) => void;
  onFire: (employeeId: string) => void;
}

/**
 * Normal-play employee roster. Hiring and salary changes remain domain
 * commands; this panel does not calculate caps, salary, or morale.
 */
export function StaffPanel({
  roles,
  onHire,
  onDecreaseSalary,
  onIncreaseSalary,
  onFire,
}: StaffPanelProps) {
  const [fireCandidateId, setFireCandidateId] = useState<string | null>(
    null,
  );

  return (
    <aside className="panel staff-panel" aria-labelledby="staff-panel-title">
      <div className="panel-heading">
        <span id="staff-panel-title">Employees</span>
        <small>Staff &amp; morale</small>
      </div>

      <div className="staff-role-list">
        {roles.length === 0 ? (
          <p className="empty-state">
            Employee roles unlock as the clinic develops.
          </p>
        ) : (
          roles.map((role) => (
            <section className="staff-role-group" key={role.id}>
              <div className="staff-role-heading">
                <div>
                  <h3>{role.displayName}</h3>
                  <span>
                    {role.currentCount}/{role.maximumCount}
                  </span>
                </div>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => onHire(role.id)}
                  disabled={!role.canHire}
                  title={role.blockedReason}
                >
                  Hire {role.hiringCostLabel}
                </button>
              </div>
              {role.blockedReason && !role.canHire ? (
                <p className="staff-blocked-reason">
                  {role.blockedReason}
                </p>
              ) : null}

              {role.employees.map((employee) => (
                <article className="staff-member-card" key={employee.id}>
                  <PixelAvatar
                    avatar={employee.avatar}
                    label={`${employee.displayName} portrait`}
                    size="medium"
                  />
                  <div className="staff-member-details">
                    <h4>{employee.displayName}</h4>
                    <small>{employee.roleDisplayName}</small>
                    <div className="staff-morale">
                      <span>Morale</span>
                      <strong>{employee.moraleLabel}</strong>
                    </div>
                    <div className="staff-salary-control">
                      <button
                        className="staff-fire-button"
                        type="button"
                        onClick={() => setFireCandidateId(employee.id)}
                      >
                        Fire
                      </button>
                      <span>
                        Salary <strong>{employee.salaryLabel}</strong>
                      </span>
                      <span className="staff-salary-buttons">
                        <button
                          type="button"
                          onClick={() =>
                            onDecreaseSalary(employee.id)
                          }
                          disabled={!employee.canDecreaseSalary}
                          aria-label={`Decrease ${employee.displayName}'s salary`}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onIncreaseSalary(employee.id)
                          }
                          disabled={!employee.canIncreaseSalary}
                          aria-label={`Increase ${employee.displayName}'s salary`}
                        >
                          +
                        </button>
                      </span>
                    </div>
                    {fireCandidateId === employee.id ? (
                      <div
                        className="staff-fire-confirmation"
                        role="alertdialog"
                        aria-label={`Confirm firing ${employee.displayName}`}
                      >
                        <strong>Fire {employee.displayName}?</strong>
                        <span>
                          They will leave this clinic immediately.
                        </span>
                        <div>
                          <button
                            className="button button-danger"
                            type="button"
                            onClick={() => {
                              onFire(employee.id);
                              setFireCandidateId(null);
                            }}
                          >
                            Confirm Fire
                          </button>
                          <button
                            className="text-button"
                            type="button"
                            onClick={() => setFireCandidateId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </article>
              ))}
            </section>
          ))
        )}
      </div>
    </aside>
  );
}
