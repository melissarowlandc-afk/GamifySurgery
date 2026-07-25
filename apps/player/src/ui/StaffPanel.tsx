import { PixelAvatar } from "./PixelAvatar";
import type { StaffRoleGroupView } from "./types";

interface StaffPanelProps {
  roles: StaffRoleGroupView[];
  onHire: (staffRoleDefinitionId: string) => void;
  onDecreaseSalary: (employeeId: string) => void;
  onIncreaseSalary: (employeeId: string) => void;
}

function clampPercent(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.min(100, value));
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
}: StaffPanelProps) {
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
                    <label>
                      <span>
                        Morale <strong>{employee.moraleLabel}</strong>
                      </span>
                      <progress
                        max={100}
                        value={clampPercent(employee.moralePercent)}
                      />
                    </label>
                    <div className="staff-salary-control">
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
