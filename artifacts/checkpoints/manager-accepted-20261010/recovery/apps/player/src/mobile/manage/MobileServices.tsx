import { useState } from "react";
import type { ServiceIncomeCatalogLineView, ServiceIncomeOperationView, ServiceIncomeView, ServiceSetupActionView } from "../../ui/types";
import { MobileManageSheet, type ManageBackRegistration } from "./MobileManageSheet";
import { MobileManageTile } from "./MobileManageTile";

const lineGroup = (line: ServiceIncomeCatalogLineView) => line.group ?? (line.available ? "earning" : line.unavailableReason?.startsWith("Locked") ? "future" : "needs");
const needsSetup = (line: ServiceIncomeCatalogLineView) => ["needs", "future"].includes(lineGroup(line));
const shortFee = (feeLabel: string) => feeLabel.match(/\$[\d,]+(?:\.\d+)?/)?.[0].replace(/\.00$/, "");

export function MobileServiceWork({ operations }: { operations: ServiceIncomeOperationView[] }) {
  return operations.length === 0 ? <p>No service operations are active.</p> : <div className="mobile-manage-stack">{operations.map(operation =>
    <article key={operation.id} className="mobile-manage-card" data-service-operation-id={operation.id}>
      <h4>{operation.displayName}</h4><dl className="mobile-manage-facts">
        <div><dt>From</dt><dd>{operation.actorLabel}</dd></div><div><dt>State</dt><dd>{operation.statusLabel}</dd></div>
        <div><dt>Provider / team</dt><dd>{operation.providerLabel ?? "Not supplied"}</dd></div>
        <div><dt>Fee</dt><dd>{operation.quoteFeeLabel}</dd></div></dl>
    </article>)}</div>;
}

export function MobileServices({ view, onAppointmentsEnabledChange, onStartLaboratoryProcessing, onSetupAction, onDetailBackChange }: {
  view: ServiceIncomeView; onAppointmentsEnabledChange: (enabled: boolean) => void;
  onStartLaboratoryProcessing: () => void; onSetupAction: (action: ServiceSetupActionView) => void;
  onDetailBackChange?: ManageBackRegistration;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [returnToSetup, setReturnToSetup] = useState(false);
  const lab = view.laboratoryWorkQueue;
  const support = view.levelThreeSupport;
  const setupLines = view.catalogLines.filter(needsSetup);
  const line = view.catalogLines.find(candidate => `line:${candidate.id}` === selected);
  const back = () => setSelected(line && returnToSetup ? "setup" : null);
  const openLine = (line: ServiceIncomeCatalogLineView, fromSetup = false) => {
    setReturnToSetup(fromSetup);
    setSelected(`line:${line.id}`);
  };
  const appointments = (label: string) => <div className="mobile-manage-switch" role="group" aria-label={label}>
    <button type="button" aria-pressed={view.appointmentsEnabled} onClick={() => onAppointmentsEnabledChange(true)}>On</button>
    <button type="button" aria-pressed={!view.appointmentsEnabled} onClick={() => onAppointmentsEnabledChange(false)}>Off</button>
  </div>;

  if (line) {
    const group = lineGroup(line);
    const appointmentsPaused = group === "earning" && line.scheduled && !view.appointmentsEnabled;
    const status = group === "future" ? `Locked until Facility Level ${line.minimumFacilityLevel}` : group === "paused"
      ? line.pausedReason ?? "Paused" : group === "needs" ? line.unavailableReason ?? "Needs a room or staff"
        : appointmentsPaused ? "Booked visitors paused · appointments are off" : "Earning now";
    const operations = view.activeOperations.filter(operation => operation.incomeLineId !== undefined
      ? operation.incomeLineId === line.id : operation.displayName === line.displayName);
    return <MobileManageSheet title={line.displayName} backLabel={returnToSetup ? "Back to setup services" : "Back to services"} onBack={back} onDetailBackChange={onDetailBackChange}>
      <section className="mobile-manage-card" data-service-line-id={line.id}>
        <div className="mobile-manage-card-heading"><h3>{line.displayName}</h3><span className="mobile-manage-tag">{line.kind === "clinical" ? "Clinical" : line.kind === "retail" ? "Retail" : "Remote"}</span></div>
        <p role="status">{status}</p>
        <dl className="mobile-manage-facts"><div><dt>Fee</dt><dd>{line.feeLabel}</dd></div>
          {line.stockCostLabel ? <div><dt>Stock</dt><dd>{line.stockCostLabel}</dd></div> : null}
          {line.contributionLabel ? <div><dt>After stock</dt><dd>{line.contributionLabel}</dd></div> : null}
          <div><dt>Cadence</dt><dd>{line.arrivalLabel ?? line.requirementLabel}</dd></div>
          <div><dt>Setup / provider</dt><dd>{line.requirementLabel}</dd></div>
          <div><dt>Queue / active work</dt><dd>{operations.length}</dd></div>
          <div><dt>Provider / team</dt><dd>{operations.length ? [...new Set(operations.map(operation => operation.providerLabel ?? "Not supplied"))].join(", ") : "No provider assigned to active work"}</dd></div>
        </dl>
        {group === "needs" && line.setupActions?.length ? <div className="mobile-manage-actions">{line.setupActions.map(action =>
          <button type="button" key={`${action.target}:${action.id}`} onClick={() => onSetupAction(action)}>{action.label}</button>)}</div> : null}
        {line.scheduled ? <><h4>Scheduled appointments</h4>{appointments(`Scheduled appointments for ${line.displayName}`)}
          <p>Outside visitors book services when the room and staff are free.</p></> : null}
        {appointmentsPaused ? <button type="button" onClick={() => onAppointmentsEnabledChange(true)}>Turn on appointments</button> : null}
      </section>
      <h3 className="mobile-manage-section-title">In progress · {operations.length}</h3><MobileServiceWork operations={operations} />
    </MobileManageSheet>;
  }

  if (selected === "setup") {
    return <MobileManageSheet title={`Needs setup · ${setupLines.length} services`} backLabel="Back to services" onBack={back} onDetailBackChange={onDetailBackChange}>
      <div className="mobile-manage-stack" aria-label="Services needing setup">{setupLines.map(line =>
        <button type="button" className="mobile-manage-setup-row" key={line.id} data-service-line-id={line.id}
          aria-label={`Service details for ${line.displayName}`} onClick={() => openLine(line, true)}>
          <strong>{line.displayName}</strong><small>{shortFee(line.feeLabel)}</small>
        </button>)}</div>
    </MobileManageSheet>;
  }

  if (selected) {
    const title = selected === "lab" ? "Laboratory queue" : selected === "work" ? "In progress now" : selected === "reads" ? "Radiologist reads" : "Upkeep & quality";
    return <MobileManageSheet title={title} backLabel="Back to services" onBack={back} onDetailBackChange={onDetailBackChange}>
      {selected === "lab" && lab ? <section className="mobile-manage-card">
        <p role="status">{lab.statusLabel}</p><button type="button" className="mobile-primary" disabled={!lab.enabled}
          onClick={onStartLaboratoryProcessing}>Queue laboratory work</button>
        {lab.disabledReason ? <p className="mobile-manage-blocked">{lab.disabledReason}</p> : null}
      </section> : null}
      {selected === "work" ? <>
        {view.periopNurseQueueLength !== undefined ? <p>Peri-op nurse queue · {view.periopNurseQueueLength} waiting</p> : null}
        <MobileServiceWork operations={view.activeOperations} />
      </> : null}
      {selected === "reads" && view.radiologistReads ? <section className="mobile-manage-card">
        {(["today", "thisLevel"] as const).map(period => { const reads = view.radiologistReads![period]; return <div className="mobile-manage-subcard" key={period}>
          <h4>{period === "today" ? "Today" : "This facility level"}</h4>
          <dl className="mobile-manage-facts"><div><dt>In-house</dt><dd>{reads.inHouseReads} reads · {reads.inHouseIncomeLabel}</dd></div>
            <div><dt>Outside</dt><dd>{reads.outsideReads} reads · {reads.outsideIncomeLabel}</dd></div></dl></div>; })}
        <p>Imaging fees stay unchanged. Each completed in-house read adds its fee. Idle radiologists read outside studies automatically.</p>
      </section> : null}
      {selected === "support" && support ? <section className="mobile-manage-card">
        <dl className="mobile-manage-facts"><div><dt>Equipment</dt><dd>{support.maintenanceOutOfServiceRoomNames.length
          ? `Out of service: ${support.maintenanceOutOfServiceRoomNames.join(", ")}` : "Equipment operational"}</dd></div>
          {support.maintenanceRepairingRoomNames.length ? <div><dt>Repairing</dt><dd>{support.maintenanceRepairingRoomNames.join(", ")}</dd></div> : null}
          <div><dt>Maintenance due</dt><dd>{support.maintenanceDueRoomNames.join(", ") || "None"}</dd></div>
          <div><dt>Quality reviews</dt><dd>{support.queuedQiReviewCount} queued · {support.inProgressQiReviewCount} in progress · {support.completedQiReviewCount} completed</dd></div>
          <div><dt>Staff on break</dt><dd>{support.staffOnBreakCount}</dd></div></dl>
      </section> : null}
    </MobileManageSheet>;
  }

  return <div className="mobile-manage-stack" aria-label="Service lines">
    <div className="mobile-manage-service-controls">
      <div className="mobile-manage-service-control"><strong>Scheduled appointments</strong>{appointments("Scheduled appointments")}</div>
      {!view.appointmentsEnabled ? <small role="status">Scheduled appointments are off. Booked visitors will not arrive.</small> : null}
      {lab ? <div className="mobile-manage-service-control">
        <button type="button" className="mobile-manage-lab-summary" aria-label="Laboratory queue details" onClick={() => setSelected("lab")}>
          <strong>Lab queue</strong><small>{lab.statusLabel}</small></button>
        <button type="button" className="mobile-primary" disabled={!lab.enabled} onClick={onStartLaboratoryProcessing} aria-label="Queue laboratory work">Queue</button>
      </div> : null}
      {lab?.disabledReason ? <small className="mobile-manage-blocked">{lab.disabledReason}</small> : null}
    </div>
    {!view.catalogLines.length ? <p>Build rooms and hire staff to add services.</p> : null}
    <div className="mobile-manage-grid mobile-manage-service-grid" aria-label="Service tiles">{view.catalogLines.filter(line => !needsSetup(line)).map(line => {
      const group = lineGroup(line);
      const running = group === "earning" && !(line.scheduled && !view.appointmentsEnabled);
      return <MobileManageTile key={line.id} label={line.displayName} icon={line.kind === "clinical" ? "✚" : line.kind === "retail" ? "♧" : "⌁"}
        hint={shortFee(line.feeLabel)} status={running ? "running" : "off"}
        statusLabel={running ? "Running" : "Off"} data-service-line-id={line.id}
        aria-label={`Service details for ${line.displayName}`} onClick={() => openLine(line)} />;
    })}
      {setupLines.length ? <MobileManageTile label={`Needs setup · ${setupLines.length} services`} icon="⚒" badge={setupLines.length} status="attention"
        aria-label={`Needs setup · ${setupLines.length} services`} onClick={() => setSelected("setup")} /> : null}
      <MobileManageTile label="In progress" icon="◷" badge={view.activeOperations.length} aria-label="In progress now" onClick={() => setSelected("work")} />
      {view.radiologistReads ? <MobileManageTile label="Read totals" icon="▧" aria-label="Radiologist reads" onClick={() => setSelected("reads")} /> : null}
      {support ? <MobileManageTile label="Upkeep & quality" icon="⚒" aria-label="Upkeep & quality" onClick={() => setSelected("support")} /> : null}
    </div>
  </div>;
}
