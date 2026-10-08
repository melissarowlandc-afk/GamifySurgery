import { useState, type ReactNode } from "react";
import type {
  ServiceIncomeCatalogLineView,
  ServiceIncomeView,
  ServiceSetupActionView,
} from "./types";

interface ServiceIncomePanelProps {
  serviceIncome: ServiceIncomeView;
  onAppointmentsEnabledChange: (enabled: boolean) => void;
  onStartLaboratoryProcessing: () => void;
  onSetupAction?: (action: ServiceSetupActionView) => void;
}

const LABORATORY_LINE_ID = "income.laboratory_processing";

type SectionId = "earning" | "needs" | "future" | "active" | "upkeep" | "reads";

const DEFAULT_OPEN: Record<SectionId, boolean> = {
  earning: true,
  needs: true,
  future: false,
  active: true,
  upkeep: true,
  reads: true,
};

/** Sections the player opened or closed, remembered while the page stays open. */
const sectionMemory: Partial<Record<SectionId, boolean>> = {};

function lineGroup(line: ServiceIncomeCatalogLineView): NonNullable<ServiceIncomeCatalogLineView["group"]> {
  if (line.group) return line.group;
  if (line.available) return "earning";
  return line.unavailableReason?.startsWith("Locked") ? "future" : "needs";
}

const KIND_LABELS: Record<ServiceIncomeCatalogLineView["kind"], string> = {
  clinical: "Clinical",
  retail: "Retail",
  remote: "Remote",
};

/** Management Services tab: what the clinic can sell and what blocks the rest. It never changes cash. */
export function ServiceIncomePanel({
  serviceIncome,
  onAppointmentsEnabledChange,
  onStartLaboratoryProcessing,
  onSetupAction,
}: ServiceIncomePanelProps) {
  const [open, setOpen] = useState<Record<SectionId, boolean>>(() => ({ ...DEFAULT_OPEN, ...sectionMemory }));
  const toggle = (id: SectionId) => {
    sectionMemory[id] = !open[id];
    setOpen((current) => ({ ...current, [id]: !current[id] }));
  };
  const lines = serviceIncome.catalogLines;
  const earning = lines.filter((line) => lineGroup(line) === "earning" || lineGroup(line) === "paused");
  const needs = lines.filter((line) => lineGroup(line) === "needs");
  const future = lines.filter((line) => lineGroup(line) === "future")
    .sort((a, b) => a.minimumFacilityLevel - b.minimumFacilityLevel);
  const paused = lines.filter((line) => lineGroup(line) === "paused");
  const labQueue = serviceIncome.laboratoryWorkQueue;
  const hasLabLine = lines.some((line) => line.id === LABORATORY_LINE_ID);

  const labControls = labQueue ? (
    <span className="service-row-side is-wide">
      <span>{labQueue.statusLabel}</span>
      <button
        type="button"
        className="service-action-button is-primary"
        onClick={onStartLaboratoryProcessing}
        disabled={!labQueue.enabled}
        title={labQueue.disabledReason}
      >
        Queue laboratory work
      </button>
      {labQueue.disabledReason ? <small className="blocked-reason">{labQueue.disabledReason}</small> : null}
    </span>
  ) : null;

  const renderLine = (line: ServiceIncomeCatalogLineView) => {
    const group = lineGroup(line);
    const appointmentsPaused = group === "earning" && line.scheduled && !serviceIncome.appointmentsEnabled;
    const how = group === "paused"
      ? line.pausedReason
      : appointmentsPaused
        ? "Booked visitors paused · appointments are off"
        : line.arrivalLabel ?? line.requirementLabel;
    return (
      <li key={line.id} className={`service-row${group === "future" ? " is-locked" : ""}`}>
        <span className="service-row-name">
          <strong>{line.displayName}</strong>
          <span className="service-kind">{KIND_LABELS[line.kind]}</span>
          {group === "future" ? <span className="service-level-tag">Level {line.minimumFacilityLevel}</span> : null}
        </span>
        <span className="service-row-price">
          {line.feeLabel}
          {line.contributionLabel ? <small> · {line.contributionLabel} after stock</small> : null}
        </span>
        <span className={`service-row-how${group === "paused" || appointmentsPaused ? " is-paused" : ""}`}>{how}</span>
        {line.id === LABORATORY_LINE_ID && labControls && group !== "needs" && group !== "future" ? labControls : group === "needs" ? (
          <span className="service-row-side is-wide">
            {line.unavailableReason && !line.setupActions?.length ? <span>{line.unavailableReason}</span> : null}
            {line.setupActions?.map((action) => (
              <button
                key={`${action.target}:${action.id}`}
                type="button"
                className="service-action-button"
                onClick={() => onSetupAction?.(action)}
                disabled={!onSetupAction}
              >
                {action.label}
              </button>
            ))}
          </span>
        ) : null}
      </li>
    );
  };

  const support = serviceIncome.levelThreeSupport;

  return (
    <section className="service-income-panel" aria-label="Services">
      <div className="service-appointments-row">
        <p>
          <strong>Scheduled appointments</strong> · outside visitors book services when the room and staff are free.
        </p>
        <span className="management-switch" role="group" aria-label="Scheduled appointments">
          <button type="button" aria-pressed={serviceIncome.appointmentsEnabled} onClick={() => onAppointmentsEnabledChange(true)}>On</button>
          <button type="button" aria-pressed={!serviceIncome.appointmentsEnabled} onClick={() => onAppointmentsEnabledChange(false)}>Off</button>
        </span>
      </div>

      <div className="service-income-scroll">
        {paused.length > 0 || !serviceIncome.appointmentsEnabled ? (
          <div className="service-attention" aria-label="Needs attention">
            {paused.map((line) => (
              <p key={line.id} className="service-attention-line">
                <span><b>{line.displayName}</b> · {line.pausedReason}</span>
              </p>
            ))}
            {!serviceIncome.appointmentsEnabled ? (
              <p className="service-attention-line">
                <span>Scheduled appointments are off. Booked visitors will not arrive.</span>
                <button type="button" className="service-action-button" onClick={() => onAppointmentsEnabledChange(true)}>Turn on</button>
              </p>
            ) : null}
          </div>
        ) : null}

        <ManagementSection id="earning" title="Earning now" meta={`${earning.length} services`} open={open.earning} onToggle={toggle}>
          {earning.length === 0 && !(labQueue && !hasLabLine) ? (
            <p className="service-income-empty">Nothing is earning yet. Build rooms and hire staff to add services.</p>
          ) : (
            <ul className="service-list">
              {earning.map(renderLine)}
              {labQueue && !hasLabLine ? (
                <li className="service-row">
                  <span className="service-row-name"><strong>Onsite laboratory processing</strong></span>
                  <span className="service-row-how">Work you queue</span>
                  {labControls}
                </li>
              ) : null}
            </ul>
          )}
        </ManagementSection>

        {needs.length > 0 ? (
          <ManagementSection id="needs" title="Needs a room or staff" meta={`${needs.length} services`} open={open.needs} onToggle={toggle}>
            <ul className="service-list">{needs.map(renderLine)}</ul>
          </ManagementSection>
        ) : null}

        {future.length > 0 ? (
          <ManagementSection id="future" title="Higher facility levels" meta={`${future.length} services`} open={open.future} onToggle={toggle}>
            <ul className="service-list">{future.map(renderLine)}</ul>
          </ManagementSection>
        ) : null}

        {serviceIncome.radiologistReads ? (
          <ManagementSection id="reads" title="Radiologist reads" open={open.reads} onToggle={toggle}>
            <div className="service-facts">
              {(["today", "thisLevel"] as const).map((period) => {
                const reads = serviceIncome.radiologistReads![period];
                return (
                  <div key={period} className="service-fact">
                    <span>{period === "today" ? "Today" : "This facility level"}</span>
                    <strong>In-house: {reads.inHouseReads} reads · {reads.inHouseIncomeLabel}</strong>
                    <strong>Outside: {reads.outsideReads} reads · {reads.outsideIncomeLabel}</strong>
                  </div>
                );
              })}
            </div>
            <p className="service-income-empty">Imaging fees stay unchanged. Each completed in-house read adds its fee. Idle radiologists read outside studies automatically.</p>
          </ManagementSection>
        ) : null}

        <ManagementSection id="active" title="In progress now" meta={`${serviceIncome.activeOperations.length} active`} open={open.active} onToggle={toggle}>
          {serviceIncome.periopNurseQueueLength !== undefined ? (
            <p className="service-income-empty">Peri-op nurse queue · {serviceIncome.periopNurseQueueLength} waiting</p>
          ) : null}
          {serviceIncome.activeOperations.length === 0 ? (
            <p className="service-income-empty">No service operations are active.</p>
          ) : (
            <ul className="service-list">
              {serviceIncome.activeOperations.map((operation) => (
                <li key={operation.id} className="service-row">
                  <span className="service-row-name"><strong>{operation.displayName}</strong></span>
                  <span className="service-row-price">{operation.quoteFeeLabel}</span>
                  <span className="service-row-how">{operation.actorLabel}</span>
                  <span className="service-row-side"><span className="service-status-tag">{operation.statusLabel}</span></span>
                </li>
              ))}
            </ul>
          )}
        </ManagementSection>

        {support ? (
          <ManagementSection id="upkeep" title="Upkeep & quality" meta="Level 3 support" open={open.upkeep} onToggle={toggle}>
            <div className="service-facts">
              <div className="service-fact">
                <span>Equipment</span>
                <strong>
                  {support.maintenanceOutOfServiceRoomNames.length > 0
                    ? `Out of service: ${support.maintenanceOutOfServiceRoomNames.join(", ")}`
                    : "Equipment operational"}
                </strong>
                {support.maintenanceRepairingRoomNames.length > 0 ? (
                  <small>Repairing: {support.maintenanceRepairingRoomNames.join(", ")}</small>
                ) : null}
              </div>
              <div className="service-fact">
                <span>Maintenance due</span>
                <strong>
                  {support.maintenanceDueRoomNames.length > 0
                    ? support.maintenanceDueRoomNames.join(", ")
                    : "None"}
                </strong>
              </div>
              <div className="service-fact">
                <span>Quality reviews</span>
                <strong>{support.queuedQiReviewCount} queued · {support.inProgressQiReviewCount} in progress · {support.completedQiReviewCount} completed</strong>
              </div>
              <div className="service-fact">
                <span>Staff on break</span>
                <strong>{support.staffOnBreakCount}</strong>
              </div>
            </div>
          </ManagementSection>
        ) : null}
      </div>
    </section>
  );
}

interface ManagementSectionProps<Id extends string> {
  id: Id;
  title: string;
  meta?: string;
  open: boolean;
  onToggle: (id: Id) => void;
  children: ReactNode;
}

/** Collapsible Management section shared by the Services and Money tabs. */
export function ManagementSection<Id extends string>({ id, title, meta, open, onToggle, children }: ManagementSectionProps<Id>) {
  const bodyId = `management-section-${id}`;
  return (
    <section className={`management-section${open ? " is-open" : ""}`}>
      <button type="button" className="management-section-toggle" aria-expanded={open} aria-controls={bodyId} onClick={() => onToggle(id)}>
        <span className="staff-role-chevron" aria-hidden="true" />
        <h3>{title}</h3>
        {meta ? <span className="management-section-meta">{meta}</span> : null}
      </button>
      {open ? <div className="management-section-body" id={bodyId}>{children}</div> : null}
    </section>
  );
}
