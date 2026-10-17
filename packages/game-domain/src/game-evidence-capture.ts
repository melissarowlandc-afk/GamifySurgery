import type { DomainEvent, GameState, OperationReceipt } from "./types";

/** Synchronous, opt-in read-only observations. No GameState fields or save bytes change. */
interface EvidenceObserver {
  beforeRetirement: (state: GameState) => void;
  event: (event: DomainEvent) => void;
  receipt: (receipt: OperationReceipt) => void;
}
let active: EvidenceObserver | undefined;

export function withGameEvidenceObserver<T>(observer: EvidenceObserver, operation: () => T): T {
  if (active) throw new Error("Nested game evidence capture is not supported.");
  active = observer;
  try { return operation(); } finally { active = undefined; }
}

export const captureBeforeGameRetirement = (state: GameState): void => active?.beforeRetirement(state);
export const captureGameEvent = (event: DomainEvent): void => active?.event(event);
export const captureGameReceipt = (receipt: OperationReceipt): void => active?.receipt(receipt);
