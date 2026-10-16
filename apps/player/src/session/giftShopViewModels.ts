import { isGiftIncomeLineId, LEVEL_FIVE_GIFT_RETAIL, getRoomUpgradeRevenueMultiplier } from "@gamify-surgery/balance-config";
import { isRoomOperationalForFacilityWork, quoteExecutiveStock, PROTOTYPE_DOMAIN_CONTEXT, type GameState } from "@gamify-surgery/game-domain";
import type { GiftShopView } from "../ui/types";

const dollars = (value: number) => `$${value.toFixed(2)}`;
export function giftShopFee(state: GameState, base: number): number {
  const shop = state.rooms.find(room => room.roomDefinitionId === "room.gift_shop");
  return Math.round(base * (shop ? getRoomUpgradeRevenueMultiplier(shop.roomDefinitionId, shop.upgradeLevel) : 1) * 100) / 100;
}

export function createGiftShopView(state: GameState): GiftShopView | undefined {
  if (state.facilityLevel < 5) return undefined;
  const shop = state.rooms.find(room => room.roomDefinitionId === "room.gift_shop");
  const stock = (base: number) => (quoteExecutiveStock(state, base, PROTOTYPE_DOMAIN_CONTEXT)?.costCents ?? base * 100) / 100;
  const receipts = state.serviceIncomeReceipts.filter(receipt => isGiftIncomeLineId(receipt.incomeLineId));
  const gross = receipts.reduce((sum, receipt) => sum + Math.round(receipt.grossAmount * 100), 0);
  const cost = receipts.reduce((sum, receipt) => sum + Math.round(receipt.stockCost * 100), 0);
  const net = receipts.reduce((sum, receipt) => sum + Math.round(receipt.netCashDelta * 100), 0);
  const waiters = state.retailOperations.filter(trip => trip.outletRoomInstanceId === shop?.id &&
    (trip.giftCheckout?.contactId === "queue1" || trip.giftCheckout?.contactId === "queue2")).length;
  const shopperCount = state.retailOperations.filter(trip => isGiftIncomeLineId(trip.incomeLineId) && !["completed", "abandoned", "cancelled"].includes(trip.status)).length;
  return {
    statusLabel: !shop ? "Build a Gift Shop" : isRoomOperationalForFacilityWork(state, shop.id) ? `Room tier ${shop.upgradeLevel} · self-service` : "Gift Shop access unavailable",
    demandLabel: `One gift-only adult opportunity every ${LEVEL_FIVE_GIFT_RETAIL.arrivalCadenceMinutes} game min per facility. Optional idle adults and staff may also shop.`,
    checkoutLabel: `${LEVEL_FIVE_GIFT_RETAIL.checkoutMinutes} min at the counter · ${waiters}/${LEVEL_FIVE_GIFT_RETAIL.queueCapacity} in line · ${shopperCount} active shoppers`,
    normalLabel: `${dollars(giftShopFee(state, 15))} gross − ${dollars(stock(6))} stock = ${dollars(giftShopFee(state, 15) - stock(6))} after stock`,
    premiumLabel: `${dollars(giftShopFee(state, 25))} gross − ${dollars(stock(12))} stock = ${dollars(giftShopFee(state, 25) - stock(12))} after stock`,
    budgetLabel: `$${LEVEL_FIVE_GIFT_RETAIL.recurringBudget} staff/founder per day · $${LEVEL_FIVE_GIFT_RETAIL.ordinaryVisitorBudget} ordinary visitor · $${LEVEL_FIVE_GIFT_RETAIL.visitorBudget} gift-only visitor. Final quoted price must fit. Founder purchases earn $0 gross.`,
    upgradeLabel: "Each accepted shop upgrade adds 6% of base gross; stock is unchanged by shop upgrades.",
    receiptWindowLabel: `Last ${receipts.length} retained Gift Shop receipts. Older payments remain in clinic totals.`,
    purchaseCount: receipts.length, grossLabel: dollars(gross / 100), stockLabel: dollars(cost / 100), netLabel: dollars(net / 100),
  };
}
