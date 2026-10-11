import type { ReactNode } from "react";

export function MobileManageTile({ label, icon, badge, hint, status, statusLabel, onClick, children, ...hooks }: {
  label: string; icon?: string; badge?: string | number; hint?: string;
  status?: "running" | "attention" | "off" | "hire"; statusLabel?: string;
  onClick: () => void; children?: ReactNode;
  "data-staff-role-id"?: string; "data-service-line-id"?: string; "data-money-tile"?: string;
  "data-employee-id"?: string; "aria-label"?: string;
}) {
  return <button type="button" className="mobile-manage-tile" onClick={onClick} {...hooks}>
    <span className="mobile-manage-tile-art">{children ?? <span aria-hidden="true">{icon ?? "◇"}</span>}
      {badge !== undefined ? <span className="mobile-manage-badge">{badge}</span> : null}
    </span>
    <strong>{label}</strong>
    {hint ? <small className="mobile-manage-tile-hint">{hint}</small> : null}
    {status ? <span className="mobile-manage-tile-status"><i className={`mobile-manage-dot is-${status}`} aria-hidden="true" />{statusLabel}</span> : null}
  </button>;
}
