import { getCurrentRoomUpgradeDefinition, getRoomUpgradeRevenueMultiplier } from "@gamify-surgery/balance-config";
import type { GameState, RoomUpgradeLevel, RoomUpgradeRevenueQuote, ServiceOperationState } from "./types";

const money = (amount: number): number => Math.round(amount * 100) / 100;

/** Snapshot installed alternatives at acceptance; future copies cannot backdate a bonus. */
export function createRoomUpgradeRevenueQuote(
  state: Pick<GameState, "rooms">,
  baseFee: number,
  roomDefinitionIds: readonly (string | null)[],
): RoomUpgradeRevenueQuote | undefined {
  const earningDefinitions = [...new Set(roomDefinitionIds.filter((id): id is string =>
    id !== null && getCurrentRoomUpgradeDefinition(id)?.effectKind === "revenue_percent"))];
  if (earningDefinitions.length !== 1) return undefined;
  const roomDefinitionId = earningDefinitions[0]!;
  return {
    version: "room-upgrade-revenue.v1", baseFee, roomDefinitionId,
    candidates: state.rooms.filter((room) => room.roomDefinitionId === roomDefinitionId)
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((room) => ({ roomInstanceId: room.id, upgradeLevel: room.upgradeLevel,
        multiplier: getRoomUpgradeRevenueMultiplier(roomDefinitionId, room.upgradeLevel) })),
    boundRoom: null,
  };
}

/** A quote binds to one actual room. Later transfers retain the accepted payment. */
export function bindRoomUpgradeRevenueQuote(quote: RoomUpgradeRevenueQuote | undefined, roomInstanceId: string): void {
  if (!quote || quote.boundRoom) return;
  quote.boundRoom = { roomInstanceId,
    multiplier: quote.candidates.find((room) => room.roomInstanceId === roomInstanceId)?.multiplier ?? 1 };
}

export function getRoomUpgradeQuotedFee(quote: RoomUpgradeRevenueQuote): number {
  return money(quote.baseFee * (quote.boundRoom?.multiplier ?? 1));
}

export function cloneRoomUpgradeRevenueQuote(quote: RoomUpgradeRevenueQuote | undefined): RoomUpgradeRevenueQuote | undefined {
  return quote ? { ...quote, candidates: quote.candidates.map((room) => ({ ...room })),
    boundRoom: quote.boundRoom ? { ...quote.boundRoom } : null } : undefined;
}

/** Called at actual phase start; reservations for future work are not earning evidence. */
export function bindServiceOperationRoomRevenue(state: Pick<GameState, "rooms">, operation: ServiceOperationState): void {
  const quote = operation.roomUpgradeRevenue;
  if (!quote || quote.boundRoom || operation.diagnosticPhaseWork || operation.diagnosticPhysicalWork?.billing === "none") return;
  if (operation.frozenOperationPhases?.[operation.phaseIndex]?.roomDefinitionId !== quote.roomDefinitionId) return;
  const room = state.rooms.find((candidate) => candidate.roomDefinitionId === quote.roomDefinitionId &&
    operation.reservedRoomInstanceIds.includes(candidate.id));
  if (!room) return;
  bindRoomUpgradeRevenueQuote(quote, room.id);
  operation.quoteFee = getRoomUpgradeQuotedFee(quote);
}

const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const id = (value: unknown): value is string => typeof value === "string" && value.length > 0;
const validMoney = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value) && value >= 0;
const keys = (value: Record<string, unknown>, allowed: readonly string[]): boolean => Object.keys(value).every((key) => allowed.includes(key));

/** Strict marked parsing; never silently drops a malformed upgraded payment into legacy semantics. */
export function normalizeRoomUpgradeRevenueQuote(value: unknown, quotedFee: unknown, roomDefinitionIds?: readonly (string | null)[]): RoomUpgradeRevenueQuote | undefined {
  if (value === undefined) return undefined;
  const invalid = (): never => { throw new Error("The saved room upgrade revenue quote is invalid."); };
  if (!record(value) || !keys(value, ["version", "baseFee", "roomDefinitionId", "candidates", "boundRoom"]) ||
    value.version !== "room-upgrade-revenue.v1" || !validMoney(value.baseFee) || !id(value.roomDefinitionId) ||
    getCurrentRoomUpgradeDefinition(value.roomDefinitionId)?.effectKind !== "revenue_percent" ||
    roomDefinitionIds !== undefined && !roomDefinitionIds.includes(value.roomDefinitionId) || !Array.isArray(value.candidates)) return invalid();
  const seen = new Set<string>();
  const candidates = value.candidates.map((room: unknown) => {
    if (!record(room) || !keys(room, ["roomInstanceId", "upgradeLevel", "multiplier"]) || !id(room.roomInstanceId) ||
      seen.has(room.roomInstanceId) || typeof room.upgradeLevel !== "number" || !Number.isInteger(room.upgradeLevel) ||
      room.upgradeLevel < 1 || room.upgradeLevel > 5 || room.multiplier !== 1 + 6 * (room.upgradeLevel - 1) / 100) return invalid();
    seen.add(room.roomInstanceId);
    return { roomInstanceId: room.roomInstanceId, upgradeLevel: room.upgradeLevel as RoomUpgradeLevel, multiplier: room.multiplier as number };
  });
  const bound = value.boundRoom;
  if (bound !== null && (!record(bound) || !keys(bound, ["roomInstanceId", "multiplier"]) || !id(bound.roomInstanceId) ||
    bound.multiplier !== (candidates.find((room) => room.roomInstanceId === bound.roomInstanceId)?.multiplier ?? 1))) return invalid();
  const quote: RoomUpgradeRevenueQuote = { version: "room-upgrade-revenue.v1", baseFee: value.baseFee,
    roomDefinitionId: value.roomDefinitionId, candidates,
    boundRoom: bound === null ? null : { roomInstanceId: (bound as Record<string, unknown>).roomInstanceId as string,
      multiplier: (bound as Record<string, unknown>).multiplier as number } };
  if (!validMoney(quotedFee) || quotedFee !== getRoomUpgradeQuotedFee(quote)) return invalid();
  return quote;
}

export function isRoomUpgradeRevenueQuoteValid(value: unknown, quotedFee: unknown, roomDefinitionIds?: readonly (string | null)[]): boolean {
  try { normalizeRoomUpgradeRevenueQuote(value, quotedFee, roomDefinitionIds); return true; }
  catch { return false; }
}
