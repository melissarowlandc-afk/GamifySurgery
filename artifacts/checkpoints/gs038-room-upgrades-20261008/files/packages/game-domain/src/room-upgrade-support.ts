import { getRoomUpgradeDurationMultiplier, getRoomUpgradePoints } from "@gamify-surgery/balance-config";
import { isRoomOperationalForFacilityWork } from "./selectors";
import type {
  DomainContext, EmployeeState, GameState, PlacedRoom, RoomUpgradeBreakBenefit,
  RoomUpgradeLevel, RoomUpgradeSupportEffectKind, RoomUpgradeSupportWork,
} from "./types";

const supportRoomIds: Record<RoomUpgradeSupportEffectKind, string> = {
  cleaning_duration_reduction_percent: "room.evs_closet",
  repair_duration_reduction_percent: "room.maintenance_workshop",
  quality_review_duration_reduction_percent: "room.surgeon_office",
  training_duration_reduction_percent: "room.training",
};

/** Freeze installed alternatives before a paid request or queued review waits. */
export function createRoomUpgradeSupportWork(
  state: GameState,
  effectKind: RoomUpgradeSupportEffectKind,
  baselineMinutes: number,
  employeeReductionPercent = 0,
): RoomUpgradeSupportWork {
  return {
    version: "room-upgrade-support.v1", effectKind, baselineMinutes, employeeReductionPercent,
    acceptedRooms: state.rooms.filter((room) => room.roomDefinitionId === supportRoomIds[effectKind])
      .sort((left, right) => left.id.localeCompare(right.id))
      .map((room) => ({ roomInstanceId: room.id, upgradeLevel: room.upgradeLevel })),
    boundRoomInstanceId: null, boundUpgradeLevel: null, durationMinutes: null,
  };
}

function effectiveMinutes(work: RoomUpgradeSupportWork, level: RoomUpgradeLevel): number {
  return Math.max(1, work.baselineMinutes *
    getRoomUpgradeDurationMultiplier(supportRoomIds[work.effectKind], level, work.effectKind) *
    (1 - work.employeeReductionPercent / 100));
}

/** A replacement installed after acceptance contributes no new bonus. */
export function bindRoomUpgradeSupportWork(work: RoomUpgradeSupportWork, roomInstanceId: string): number {
  if (work.durationMinutes !== null) return work.durationMinutes;
  const level = work.acceptedRooms.find((room) => room.roomInstanceId === roomInstanceId)?.upgradeLevel ?? 1;
  work.boundRoomInstanceId = roomInstanceId;
  work.boundUpgradeLevel = level;
  work.durationMinutes = effectiveMinutes(work, level);
  return work.durationMinutes;
}

/** EVS/repairs freeze only the actual worker's operational home room. */
export function createEmployeeRoomUpgradeSupportWork(
  state: GameState, employee: EmployeeState, effectKind: RoomUpgradeSupportEffectKind,
  baselineMinutes: number, employeeReductionPercent: number, context: DomainContext,
): RoomUpgradeSupportWork | null {
  const home = state.rooms.find((room) => room.id === employee.homeRoomInstanceId && room.roomDefinitionId === supportRoomIds[effectKind]);
  if (!home || !isRoomOperationalForFacilityWork(state, home.id, context)) return null;
  const work = createRoomUpgradeSupportWork(state, effectKind, baselineMinutes, employeeReductionPercent);
  bindRoomUpgradeSupportWork(work, home.id);
  return work;
}

/** New breaks use one actual room and retain their accepted gain through upgrades. */
export function createRoomUpgradeBreakBenefit(room: PlacedRoom, baselineMoraleGain: number): RoomUpgradeBreakBenefit {
  return {
    version: "room-upgrade-break.v1", roomInstanceId: room.id, upgradeLevel: room.upgradeLevel,
    baselineMoraleGain,
    moraleGain: baselineMoraleGain + getRoomUpgradePoints("room.staff_break", room.upgradeLevel, "break_morale_points"),
  };
}

/** The existing daily clinic witness remains the sole coffee application guard. */
export function getBestOperationalCoffeeUpgradeMorale(state: GameState, context: DomainContext): number {
  const kiosk = state.rooms.filter((room) => room.roomDefinitionId === "room.coffee_kiosk" && isRoomOperationalForFacilityWork(state, room.id, context))
    .sort((left, right) => right.upgradeLevel - left.upgradeLevel || left.id.localeCompare(right.id))[0];
  return kiosk ? getRoomUpgradePoints(kiosk.roomDefinitionId, kiosk.upgradeLevel, "daily_coffee_morale_points") : 0;
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function only(raw: Record<string, unknown>, fields: readonly string[]): boolean {
  return Object.keys(raw).every((key) => fields.includes(key));
}

function level(value: unknown): value is RoomUpgradeLevel {
  return value === 1 || value === 2 || value === 3 || value === 4 || value === 5;
}

function id(value: unknown): value is string { return typeof value === "string" && value.length > 0; }

/** Legacy unbound employee work used this integer duration before room binding. */
export function getUnboundRoomUpgradeSupportMinutes(work: RoomUpgradeSupportWork): number {
  const minutes = work.baselineMinutes * (1 - work.employeeReductionPercent / 100);
  return Math.max(1, Math.ceil(minutes - Number.EPSILON * Math.max(1, Math.abs(minutes)) * 4));
}

export function isRoomUpgradeSupportRemaining(work: RoomUpgradeSupportWork, remaining: unknown, allowZero = false): remaining is number {
  return typeof remaining === "number" && Number.isFinite(remaining) &&
    remaining >= (allowZero ? 0 : Number.MIN_VALUE) &&
    remaining <= (work.durationMinutes ?? getUnboundRoomUpgradeSupportMinutes(work));
}

/** New opt-in markers are strict; malformed accepted work must not disappear. */
export function normalizeRoomUpgradeSupportWork(value: unknown, expectedEffectKind: RoomUpgradeSupportEffectKind): RoomUpgradeSupportWork | undefined {
  if (value === undefined) return undefined;
  const invalid = (): never => { throw new Error("The saved room upgrade support work is invalid."); };
  if (!record(value) || !only(value, ["version", "effectKind", "baselineMinutes", "employeeReductionPercent", "acceptedRooms", "boundRoomInstanceId", "boundUpgradeLevel", "durationMinutes"]) ||
    value.version !== "room-upgrade-support.v1" || value.effectKind !== expectedEffectKind ||
    typeof value.baselineMinutes !== "number" || !Number.isSafeInteger(value.baselineMinutes) || value.baselineMinutes < 1 ||
    typeof value.employeeReductionPercent !== "number" || !Number.isFinite(value.employeeReductionPercent) || value.employeeReductionPercent < 0 || value.employeeReductionPercent > 40 ||
    ((expectedEffectKind === "cleaning_duration_reduction_percent" || expectedEffectKind === "training_duration_reduction_percent") && value.employeeReductionPercent !== 0) ||
    !Array.isArray(value.acceptedRooms)) return invalid();
  const acceptedRooms = value.acceptedRooms.map((room: unknown) => {
    if (!record(room) || !only(room, ["roomInstanceId", "upgradeLevel"]) || !id(room.roomInstanceId) || !level(room.upgradeLevel)) return invalid();
    return { roomInstanceId: room.roomInstanceId, upgradeLevel: room.upgradeLevel };
  });
  if (new Set(acceptedRooms.map((room) => room.roomInstanceId)).size !== acceptedRooms.length) return invalid();
  const work: RoomUpgradeSupportWork = {
    version: "room-upgrade-support.v1", effectKind: expectedEffectKind,
    baselineMinutes: value.baselineMinutes, employeeReductionPercent: value.employeeReductionPercent,
    acceptedRooms, boundRoomInstanceId: null, boundUpgradeLevel: null, durationMinutes: null,
  };
  if (value.boundRoomInstanceId === null && value.boundUpgradeLevel === null && value.durationMinutes === null) return work;
  if (!id(value.boundRoomInstanceId) || !level(value.boundUpgradeLevel) ||
    typeof value.durationMinutes !== "number" || !Number.isFinite(value.durationMinutes) || value.durationMinutes < 1 ||
    value.boundUpgradeLevel !== (acceptedRooms.find((room) => room.roomInstanceId === value.boundRoomInstanceId)?.upgradeLevel ?? 1) ||
    value.durationMinutes !== effectiveMinutes(work, value.boundUpgradeLevel)) return invalid();
  work.boundRoomInstanceId = value.boundRoomInstanceId;
  work.boundUpgradeLevel = value.boundUpgradeLevel;
  work.durationMinutes = value.durationMinutes;
  return work;
}

export function normalizeRoomUpgradeBreakBenefit(value: unknown, targetRoomId: unknown): RoomUpgradeBreakBenefit | undefined {
  if (value === undefined) return undefined;
  const invalid = (): never => { throw new Error("The saved room upgrade break benefit is invalid."); };
  if (!record(value) || !only(value, ["version", "roomInstanceId", "upgradeLevel", "baselineMoraleGain", "moraleGain"]) ||
    value.version !== "room-upgrade-break.v1" || !id(value.roomInstanceId) || value.roomInstanceId !== targetRoomId || !level(value.upgradeLevel) ||
    typeof value.baselineMoraleGain !== "number" || !Number.isSafeInteger(value.baselineMoraleGain) || value.baselineMoraleGain < 0 ||
    typeof value.moraleGain !== "number" || !Number.isSafeInteger(value.moraleGain) ||
    value.moraleGain !== value.baselineMoraleGain + getRoomUpgradePoints("room.staff_break", value.upgradeLevel, "break_morale_points")) return invalid();
  return { version: "room-upgrade-break.v1", roomInstanceId: value.roomInstanceId, upgradeLevel: value.upgradeLevel,
    baselineMoraleGain: value.baselineMoraleGain, moraleGain: value.moraleGain };
}
