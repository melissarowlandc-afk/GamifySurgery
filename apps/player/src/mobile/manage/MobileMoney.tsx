import { useState } from "react";
import { GiftShopFacts } from "../../ui/GiftShopFacts";
import type { AdvertisingView, ResourceBarView, ServiceIncomeView } from "../../ui/types";
import { MobileAdvertising } from "../MobileQuickControls";
import { MobileCashExplanation } from "../MobileTopBar";
import { MobileManageSheet, type ManageBackRegistration } from "./MobileManageSheet";
import { MobileManageTile } from "./MobileManageTile";

type MoneySection = "net" | "income" | "costs" | "advertising" | "gifts";
const TITLES: Record<MoneySection, string> = { net: "Net per game hour", income: "Income per game hour", costs: "Costs per game hour", advertising: "Advertising", gifts: "Gift Shop sales" };

function RecentPayments({ view }: { view: ServiceIncomeView }) {
  return <section className="mobile-manage-card" aria-label="Recent service payments"><h3>Recent service payments</h3>
    {view.recentReceipts.length === 0 ? <p>No service receipts yet.</p> : view.recentReceipts.map(receipt => <article className="mobile-manage-subcard" key={receipt.id}>
      <h4>{receipt.displayName}</h4><dl className="mobile-manage-facts"><div><dt>Time</dt><dd>{receipt.timeLabel ?? "Not supplied"}</dd></div>
        <div><dt>From</dt><dd>{receipt.actorLabel}</dd></div><div><dt>Billed</dt><dd>{receipt.grossLabel}</dd></div>
        <div><dt>Stock</dt><dd>{receipt.stockCostLabel}</dd></div><div><dt>Net</dt><dd>{receipt.netLabel}</dd></div></dl>
    </article>)}
  </section>;
}

/** All amounts/window labels remain supplied by managementViewModels. */
export function MobileMoney({ view, resourceBar, advertising, onAdvertisingLevelChange, onDetailBackChange }: {
  view: ServiceIncomeView; resourceBar: ResourceBarView; advertising: AdvertisingView; onAdvertisingLevelChange: (level: number) => void;
  onDetailBackChange?: ManageBackRegistration;
}) {
  const [selected, setSelected] = useState<MoneySection | null>(null);
  const finances = view.finances;
  if (!selected) return <div className="mobile-manage-grid" aria-label="Money tiles">
    <MobileManageTile label="Net / hr" icon="↗" hint={finances?.hourlyNetLabel ?? "See totals"} data-money-tile="net"
      aria-label={TITLES.net} status={finances?.hourlyNetSign === "negative" ? "attention" : "running"} statusLabel={finances?.incomeWindowLabel ?? "Since opening"} onClick={() => setSelected("net")} />
    <MobileManageTile label="Income / hr" icon="+" hint={finances?.hourlyIncomeLabel ?? "See income"} data-money-tile="income"
      aria-label={TITLES.income} onClick={() => setSelected("income")} />
    <MobileManageTile label="Costs / hr" icon="−" hint={finances?.hourlyCostLabel ?? "See costs"} data-money-tile="costs"
      aria-label={TITLES.costs} onClick={() => setSelected("costs")} />
    <MobileManageTile label="Advertising" icon="⚑" hint={advertising.hourlyCostLabel} badge={advertising.currentLevel} data-money-tile="advertising"
      aria-label="Advertising" onClick={() => setSelected("advertising")} />
    {view.giftShop ? <MobileManageTile label="Gift Shop" icon="♧" hint={view.giftShop.netLabel} badge={view.giftShop.purchaseCount} data-money-tile="gifts"
      aria-label="Gift Shop sales" onClick={() => setSelected("gifts")} /> : null}
  </div>;

  return <MobileManageSheet title={TITLES[selected]} backLabel="Back to money" onBack={() => setSelected(null)} onDetailBackChange={onDetailBackChange}>
    <div className="mobile-manage-stack" aria-label="Clinic finances">
      {selected === "advertising" ? <MobileAdvertising view={advertising} onLevelChange={onAdvertisingLevelChange} /> : null}
      {selected === "gifts" ? <GiftShopFacts view={view.giftShop} /> : null}
      {selected === "net" ? <>
        {finances ? <section className="mobile-manage-card"><h3>Net per game hour</h3><p>{finances.incomeWindowLabel}</p>
          <strong className={`mobile-manage-net is-${finances.hourlyNetSign}`}>{finances.hourlyNetLabel}</strong>
          <dl className="mobile-manage-facts"><div><dt>Average income</dt><dd>{finances.hourlyIncomeLabel}</dd></div>
            <div><dt>Costs per hour</dt><dd>{finances.hourlyCostLabel}</dd></div></dl><p>{finances.incomeWindowExplanation}</p>
        </section> : null}
        <section className="mobile-manage-card"><h3>Since the clinic opened</h3>
          <dl className="mobile-manage-facts"><div><dt>Earned</dt><dd>{finances?.earnedLabel ?? view.netTotalLabel}</dd></div>
            <div><dt>Received</dt><dd>{finances?.billedLabel ?? view.grossTotalLabel}</dd></div>
            <div><dt>Stock</dt><dd>{finances?.stockLabel ?? view.stockCostTotalLabel}</dd></div>
            {finances ? <><div><dt>Running costs</dt><dd>−{finances.runningCostsLabel}</dd></div>
              <div><dt>Profit</dt><dd>{finances.profitLabel}</dd></div></> : null}</dl>
          <p>Running costs include staff, room upkeep and advertising. Building, hiring and training are excluded from profit.</p>
        </section>
        <section className="mobile-manage-card"><h3>Cash explanation</h3><MobileCashExplanation view={resourceBar} /></section>
      </> : null}
      {selected === "income" ? <>
        {finances ? <section className="mobile-manage-card"><h3>Average income by source</h3><p>{finances.incomeWindowLabel}</p>
          <strong className="mobile-manage-net">{finances.hourlyIncomeLabel}</strong><p>{finances.incomeWindowExplanation}</p>
          <dl className="mobile-manage-facts">{finances.hourlyIncomeSources.map(source => <div key={source.id}>
            <dt>{source.label}<small>{source.count} payment{source.count === 1 ? "" : "s"}</small></dt><dd>{source.amountLabel}</dd></div>)}</dl>
        </section> : <p>Received since opening: {view.grossTotalLabel}.</p>}
        <section className="mobile-manage-card"><h3>Income by service line</h3>
          {finances ? <p>From {finances.recentEarningsReceiptCount} recorded service payments.</p> : null}
          {finances?.recentEarnings.length ? <dl className="mobile-manage-facts">{finances.recentEarnings.map(line => <div key={line.displayName}>
            <dt>{line.displayName}<small>{line.count} recorded payment{line.count === 1 ? "" : "s"}</small></dt><dd>{line.netLabel}</dd></div>)}</dl>
            : <p>{finances ? "No service receipts yet." : "Service totals are shown above."}</p>}
        </section>
      </> : null}
      {selected === "costs" ? finances ? <section className="mobile-manage-card"><h3>Costs per game hour</h3>
        <strong className="mobile-manage-net">{finances.hourlyCostLabel}</strong>
        <dl className="mobile-manage-facts">{finances.hourlyCosts.map(cost => <div key={cost.id}><dt>{cost.label}</dt><dd>{cost.amountLabel}</dd></div>)}</dl>
        {finances.supplierSavingsLabel ? <p>{finances.supplierSavingsLabel}</p> : null}
        <p>Cash on hand <b>{finances.cashLabel}</b>. {finances.runwayLabel}</p>
      </section> : <p>Stock since opening: {view.stockCostTotalLabel}.</p> : null}
      {selected !== "advertising" ? <RecentPayments view={view} /> : null}
    </div>
  </MobileManageSheet>;
}
