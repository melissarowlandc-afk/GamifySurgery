import type { GiftShopView } from "./types";
import "./giftShop.css";

/** One shared display contract; phone roots keep their compact tiles. */
export function GiftShopFacts({ view }: { view?: GiftShopView }) {
  if (!view) return null;
  return <section className="gift-shop-facts" aria-label="Gift Shop sales">
    <p>{view.statusLabel}</p><p>{view.checkoutLabel}</p>
    <dl><div><dt>Normal gift</dt><dd>{view.normalLabel}</dd></div>
      <div><dt>Premium gift</dt><dd>{view.premiumLabel}</dd></div>
      <div><dt>Recorded gross / stock / net</dt><dd>{view.grossLabel} / {view.stockLabel} / {view.netLabel}</dd></div></dl>
    <p>{view.receiptWindowLabel}</p><p>{view.demandLabel}</p>
    <details><summary>Budgets & upgrades</summary><p>{view.budgetLabel}</p><p>{view.upgradeLabel}</p></details>
  </section>;
}
