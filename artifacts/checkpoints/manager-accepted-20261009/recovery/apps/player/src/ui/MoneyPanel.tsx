import { useState } from "react";
import { ManagementSection } from "./ServiceIncomePanel";
import type { ServiceIncomeView } from "./types";
import "./financePresentation.css";

interface MoneyPanelProps {
  serviceIncome: ServiceIncomeView;
}

type SectionId = "costs" | "earnings" | "payments";

const sectionMemory: Partial<Record<SectionId, boolean>> = {};

const COST_FILL_CLASS = {
  staff: "is-staff",
  rooms: "is-rooms",
  advertising: "is-advertising",
  stock: "is-stock",
  relief: "is-relief",
} as const;

/** Management Money tab: recent hourly net and since-opening totals. Read-only. */
export function MoneyPanel({ serviceIncome }: MoneyPanelProps) {
  const [open, setOpen] = useState<Record<SectionId, boolean>>(() => ({ costs: true, earnings: true, payments: true, ...sectionMemory }));
  const toggle = (id: SectionId) => {
    sectionMemory[id] = !open[id];
    setOpen((current) => ({ ...current, [id]: !current[id] }));
  };
  const finances = serviceIncome.finances;
  const totalHourlyBeforeRelief = finances?.hourlyCosts.reduce((total, cost) => total + Math.max(0, cost.amount), 0) ?? 0;

  return (
    <section className="money-panel" aria-label="Money">
      <div className="money-period">{finances?.incomeWindowLabel ?? "Since the clinic opened"}</div>
      <div className="service-income-scroll">
        {finances ? (
          <>
            <div className="money-tiles" aria-label="Hourly finances">
              <div className="money-tile">
                <span>Average income per hour</span>
                <strong>{finances.hourlyIncomeLabel}</strong>
                <small>Actual settled payments before stock</small>
              </div>
              <div className="money-tile">
                <span>Costs per hour</span>
                <strong>{finances.hourlyCostLabel}</strong>
                <small>Current obligations + average stock − relief</small>
              </div>
              <div className="money-tile money-hourly-net">
                <span>Net per hour</span>
                <strong className={`finance-net is-${finances.hourlyNetSign}`}>{finances.hourlyNetLabel}</strong>
                <small>Average income − costs, per game hour</small>
              </div>
            </div>
            <p className="money-window-explanation">{finances.incomeWindowExplanation}</p>
            <ManagementSection id="earnings" title="Average income by source" meta={finances.hourlyIncomeLabel} open={open.earnings} onToggle={toggle}>
              <ul className="money-hourly-breakdown">
                {finances.hourlyIncomeSources.map((source) => (
                  <li key={source.id}>
                    <span>{source.label} <small>({source.count} payment{source.count === 1 ? "" : "s"})</small></span>
                    <b>{source.amountLabel}</b>
                  </li>
                ))}
              </ul>
            </ManagementSection>
          </>
        ) : null}

        {finances ? (
          <ManagementSection id="costs" title="Costs per game hour" meta={finances.hourlyCostLabel} open={open.costs} onToggle={toggle}>
            {totalHourlyBeforeRelief > 0 ? (
              <span className="money-cost-stack" aria-hidden="true">
                {finances.hourlyCosts.filter((cost) => cost.amount > 0).map((cost) => (
                  <i key={cost.id} className={COST_FILL_CLASS[cost.id]} style={{ width: `${(cost.amount / totalHourlyBeforeRelief) * 100}%` }} />
                ))}
              </span>
            ) : null}
            <ul className="money-cost-legend money-hourly-breakdown">
              {finances.hourlyCosts.map((cost) => (
                <li key={cost.id}>
                  <span><i className={COST_FILL_CLASS[cost.id]} aria-hidden="true" /> {cost.label}</span>
                  <b>{cost.amountLabel}</b>
                </li>
              ))}
            </ul>
            <p className="money-runway">Cash on hand <b>{finances.cashLabel}</b>. {finances.runwayLabel}</p>
          </ManagementSection>
        ) : null}

        {finances ? <div className="money-period">Since the clinic opened</div> : null}
        <div className="money-tiles">
          <div className="money-tile">
            <span>Earned</span>
            <strong>{finances?.earnedLabel ?? serviceIncome.netTotalLabel}</strong>
            <small>{finances?.billedLabel ?? serviceIncome.grossTotalLabel} received − {finances?.stockLabel ?? serviceIncome.stockCostTotalLabel} stock</small>
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

        <ManagementSection id="payments" title="Recent service payments" meta={serviceIncome.recentReceipts.length > 0 ? `Last ${serviceIncome.recentReceipts.length}` : undefined} open={open.payments} onToggle={toggle}>
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
