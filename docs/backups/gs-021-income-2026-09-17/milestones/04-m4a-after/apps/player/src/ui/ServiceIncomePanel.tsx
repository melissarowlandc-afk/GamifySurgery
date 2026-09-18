import type { ServiceIncomeView } from "./types";

interface ServiceIncomePanelProps {
  serviceIncome: ServiceIncomeView;
  onAppointmentsEnabledChange: (enabled: boolean) => void;
}

/** Management-only catalogue and accounting projection. It never changes cash. */
export function ServiceIncomePanel({
  serviceIncome,
  onAppointmentsEnabledChange,
}: ServiceIncomePanelProps) {
  return (
    <section className="service-income-panel" aria-labelledby="service-income-title">
      <header className="service-income-heading">
        <div>
          <h2 id="service-income-title">Services &amp; income</h2>
          <span>Availability, operations, and settled receipts</span>
        </div>
        <label className="service-appointment-toggle">
          <input
            type="checkbox"
            checked={serviceIncome.appointmentsEnabled}
            onChange={(event) => onAppointmentsEnabledChange(event.target.checked)}
          />
          Scheduled appointments
        </label>
      </header>

      <dl className="service-income-totals" aria-label="Service income totals">
        <div><dt>Gross</dt><dd>{serviceIncome.grossTotalLabel}</dd></div>
        <div><dt>Stock</dt><dd>{serviceIncome.stockCostTotalLabel}</dd></div>
        <div><dt>Net cash</dt><dd>{serviceIncome.netTotalLabel}</dd></div>
      </dl>
      <p className="service-income-note">Net is after stock costs, before clinic operating expenses.</p>

      <div className="service-income-scroll">
        <section aria-labelledby="service-catalog-title">
          <h3 id="service-catalog-title">Catalog</h3>
          <ul className="service-income-list">
            {serviceIncome.catalogLines.map((line) => (
              <li key={line.id} className={line.available ? "" : "is-locked"}>
                <div><strong>{line.displayName}</strong><span>{line.kind} · {line.feeLabel}</span></div>
                <small>{line.available ? line.requirementLabel : line.unavailableReason}</small>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="service-active-title">
          <h3 id="service-active-title">Active operations</h3>
          {serviceIncome.activeOperations.length === 0 ? <p className="service-income-empty">No service operations are active.</p> : (
            <ul className="service-income-list">
              {serviceIncome.activeOperations.map((operation) => <li key={operation.id}><div><strong>{operation.displayName}</strong><span>{operation.actorLabel} · {operation.quoteFeeLabel}</span></div><small>{operation.statusLabel}</small></li>)}
            </ul>
          )}
        </section>
        <section aria-labelledby="service-receipts-title">
          <h3 id="service-receipts-title">Recent receipts</h3>
          {serviceIncome.recentReceipts.length === 0 ? <p className="service-income-empty">No service receipts yet.</p> : (
            <ul className="service-income-list">
              {serviceIncome.recentReceipts.map((receipt) => <li key={receipt.id}><div><strong>{receipt.displayName}</strong><span>{receipt.actorLabel}</span></div><small>{receipt.grossLabel} gross · {receipt.stockCostLabel} stock · {receipt.netLabel} net</small></li>)}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
