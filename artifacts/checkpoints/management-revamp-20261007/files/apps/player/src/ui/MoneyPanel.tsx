import { useState } from "react";
import { ManagementSection } from "./ServiceIncomePanel";
import type { ServiceIncomeView } from "./types";

interface MoneyPanelProps {
  serviceIncome: ServiceIncomeView;
}

type SectionId = "costs" | "earnings" | "payments";

const sectionMemory: Partial<Record<SectionId, boolean>> = {};

const COST_FILL_CLASS = {
  staff: "is-staff",
  rooms: "is-rooms",
  advertising: "is-advertising",
} as const;

/** Management Money tab: since-opening earnings against running costs. Read-only. */
export function MoneyPanel({ serviceIncome }: MoneyPanelProps) {
  const [open, setOpen] = useState<Record<SectionId, boolean>>(() => ({ costs: true, earnings: true, payments: true, ...sectionMemory }));
  const toggle = (id: SectionId) => {
    sectionMemory[id] = !open[id];
    setOpen((current) => ({ ...current, [id]: !current[id] }));
  };
  const finances = serviceIncome.finances;
  const totalHourly = finances?.hourlyCosts.reduce((total, cost) => total + cost.amount, 0) ?? 0;
  const topEarning = Math.max(1, ...(finances?.recentEarnings.map((entry) => entry.net) ?? [0]));

  return (
    <section className="money-panel" aria-label="Money">
      <div className="money-period">Since the clinic opened</div>
      <div className="service-income-scroll">
        <div className="money-tiles">
          <div className="money-tile">
            <span>Earned</span>
            <strong>{finances?.earnedLabel ?? serviceIncome.netTotalLabel}</strong>
            <small>{finances?.billedLabel ?? serviceIncome.grossTotalLabel} billed − {finances?.stockLabel ?? serviceIncome.stockCostTotalLabel} stock</small>
          </div>
          {finances ? (
            <>
              <div className="money-tile">
                <span>Running costs</span>
                <strong>−{finances.runningCostsLabel}</strong>
                <small>Staff, room upkeep, advertising</small>
              </div>
              <div className={`money-tile is-result${finances.profitPositive ? "" : " is-loss"}`}>
                <span>Profit</span>
                <strong>{finances.profitLabel}</strong>
                <small>Building, hiring and training not included</small>
              </div>
            </>
          ) : null}
        </div>

        {finances ? (
          <ManagementSection id="costs" title="Running costs now" meta={finances.hourlyCostLabel} open={open.costs} onToggle={toggle}>
            {totalHourly > 0 ? (
              <span className="money-cost-stack" aria-hidden="true">
                {finances.hourlyCosts.filter((cost) => cost.amount > 0).map((cost) => (
                  <i key={cost.id} className={COST_FILL_CLASS[cost.id]} style={{ width: `${(cost.amount / totalHourly) * 100}%` }} />
                ))}
              </span>
            ) : null}
            <ul className="money-cost-legend">
              {finances.hourlyCosts.map((cost) => (
                <li key={cost.id}>
                  <i className={COST_FILL_CLASS[cost.id]} aria-hidden="true" />
                  {cost.label} <b>{cost.amountLabel}</b>
                </li>
              ))}
            </ul>
            <p className="money-runway">
              Cash on hand <b>{finances.cashLabel}</b>. {finances.runwayLabel} Running out of cash lowers staff morale.
            </p>
          </ManagementSection>
        ) : null}

        {finances && finances.recentEarnings.length > 0 ? (
          <ManagementSection id="earnings" title="Recent earnings by service" meta={`Last ${finances.recentEarningsReceiptCount} payment${finances.recentEarningsReceiptCount === 1 ? "" : "s"}`} open={open.earnings} onToggle={toggle}>
            <ul className="money-earnings">
              {finances.recentEarnings.map((entry) => (
                <li key={entry.displayName}>
                  <span className="money-earnings-name">{entry.displayName}</span>
                  <span className="money-earnings-track" aria-hidden="true">
                    <i style={{ width: `${Math.max(0, entry.net / topEarning) * 100}%` }} />
                  </span>
                  <span className="money-earnings-value">{entry.netLabel} · {entry.count}×</span>
                </li>
              ))}
            </ul>
          </ManagementSection>
        ) : null}

        <ManagementSection id="payments" title="Recent payments" meta={serviceIncome.recentReceipts.length > 0 ? `Last ${serviceIncome.recentReceipts.length}` : undefined} open={open.payments} onToggle={toggle}>
          {serviceIncome.recentReceipts.length === 0 ? (
            <p className="service-income-empty">No service receipts yet.</p>
          ) : (
            <div className="money-ledger-wrap">
              <table className="money-ledger">
                <thead>
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Service</th>
                    <th scope="col">From</th>
                    <th scope="col" className="is-number">Billed</th>
                    <th scope="col" className="is-number">Stock</th>
                    <th scope="col" className="is-number">Net</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceIncome.recentReceipts.map((receipt) => (
                    <tr key={receipt.id}>
                      <td>{receipt.timeLabel ?? ""}</td>
                      <td>{receipt.displayName}</td>
                      <td>{receipt.actorLabel}</td>
                      <td className="is-number">{receipt.grossLabel}</td>
                      <td className="is-number">{receipt.stockCostLabel}</td>
                      <td className="is-number"><b>{receipt.netLabel}</b></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ManagementSection>
      </div>
    </section>
  );
}
