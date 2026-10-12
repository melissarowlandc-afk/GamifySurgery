/** Editorial shop demand, queue and customer allowances; no clinical inputs. */
export const LEVEL_FIVE_GIFT_RETAIL = {
  arrivalCadenceMinutes: 120,
  checkoutMinutes: 2,
  queueCapacity: 2,
  visitorBudget: 40,
  ordinaryVisitorBudget: 30,
  recurringBudget: 20,
  normalIncomeLineId: "income.gift_shop",
  premiumIncomeLineId: "income.gift_shop_premium",
} as const;

export function isGiftIncomeLineId(id: string): boolean {
  return id === LEVEL_FIVE_GIFT_RETAIL.normalIncomeLineId || id === LEVEL_FIVE_GIFT_RETAIL.premiumIncomeLineId;
}
