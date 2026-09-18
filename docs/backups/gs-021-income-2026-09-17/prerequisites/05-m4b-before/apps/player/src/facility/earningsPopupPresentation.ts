export type EarningsReceiptActorKind =
  | "patient"
  | "employee"
  | "founder"
  | "remote"
  | "visitor";

/** The small receipt projection consumed by the facility presentation layer. */
export interface FacilityEarningsReceipt {
  transactionKey: string;
  actorKind: EarningsReceiptActorKind;
  actorId: string;
  grossAmount: number;
}

/**
 * A receipt can only create a popup when the credited actor has an honest
 * visible anchor. `remote` deliberately has no inferred patient fallback;
 * a future workstation/panel adapter may supply one explicitly.
 */
export interface EarningsPopupActorAnchors {
  patient?: Readonly<Record<string, boolean>>;
  employee?: Readonly<Record<string, boolean>>;
  founder?: Readonly<Record<string, boolean>>;
  remote?: Readonly<Record<string, boolean>>;
  /** Reserved for the M2 visitor projection; never aliases an encounter. */
  visitor?: Readonly<Record<string, boolean>>;
}

export interface EarningsPopup {
  transactionKey: string;
  actorKind: EarningsReceiptActorKind;
  actorId: string;
  grossAmount: number;
  expiresAtMilliseconds: number;
}

export interface EarningsPopupState {
  campaignId: string | null;
  observedTransactionKeys: readonly string[];
  activePopups: readonly EarningsPopup[];
}

export const EARNINGS_POPUP_DURATION_MILLISECONDS = 1_500;

function hasVisibleActor(
  receipt: FacilityEarningsReceipt,
  anchors: EarningsPopupActorAnchors,
): boolean {
  return anchors[receipt.actorKind]?.[receipt.actorId] === true;
}

/** A display-only label. Cash is already owned by the domain receipt. */
export function formatEarningsPopupAmount(grossAmount: number): string {
  const cents = Math.round(grossAmount * 100);
  const absolute = Math.abs(cents) / 100;
  const amount = Number.isInteger(absolute)
    ? absolute.toString()
    : absolute.toFixed(2);
  return `+$${amount}`;
}

/** Keeps multiple fresh credits for one actor legible above the same head. */
export function getEarningsPopupLabelY(
  headY: number,
  tileSize: number,
  stackIndex: number,
): number {
  const padding = Math.max(4, tileSize * 0.14);
  const stackSpacing = Math.max(14, tileSize * 0.45);
  return headY - padding - Math.max(0, stackIndex) * stackSpacing;
}

/**
 * Reconciles durable receipts into finite, local-only presentation events.
 * The first observation of a campaign seeds the cursor from its loaded
 * history, intentionally preventing a scene mount or reload from replaying
 * old income. Later receipts each produce at most one popup.
 */
export function reconcileEarningsPopups(
  previous: EarningsPopupState | undefined,
  input: {
    campaignId: string;
    receipts: readonly FacilityEarningsReceipt[];
    actorAnchors: EarningsPopupActorAnchors;
    nowMilliseconds: number;
  },
): EarningsPopupState {
  const receiptKeys = [...new Set(input.receipts.map((receipt) => receipt.transactionKey))];
  if (!previous || previous.campaignId !== input.campaignId) {
    return {
      campaignId: input.campaignId,
      observedTransactionKeys: receiptKeys,
      activePopups: [],
    };
  }

  const observedTransactionKeys = new Set(previous.observedTransactionKeys);
  const activePopups = previous.activePopups.filter(
    (popup) => popup.expiresAtMilliseconds > input.nowMilliseconds,
  );
  const activeTransactionKeys = new Set(
    activePopups.map((popup) => popup.transactionKey),
  );

  for (const receipt of input.receipts) {
    if (observedTransactionKeys.has(receipt.transactionKey)) continue;
    observedTransactionKeys.add(receipt.transactionKey);
    if (!hasVisibleActor(receipt, input.actorAnchors)) continue;
    if (activeTransactionKeys.has(receipt.transactionKey)) continue;
    activeTransactionKeys.add(receipt.transactionKey);
    activePopups.push({
      transactionKey: receipt.transactionKey,
      actorKind: receipt.actorKind,
      actorId: receipt.actorId,
      grossAmount: receipt.grossAmount,
      expiresAtMilliseconds:
        input.nowMilliseconds + EARNINGS_POPUP_DURATION_MILLISECONDS,
    });
  }

  return {
    campaignId: previous.campaignId,
    observedTransactionKeys: [...observedTransactionKeys],
    activePopups,
  };
}
