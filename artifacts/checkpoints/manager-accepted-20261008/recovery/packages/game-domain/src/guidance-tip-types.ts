import type { GuidanceTipFamily, GuidanceTipId } from "@gamify-surgery/balance-config";

/** Serializable intents; every consumer must repeat the live predicate/quote. */
export type GuidanceTipAction =
  | { kind: "open_chart"; encounterId: string }
  | { kind: "collect_litter"; litterId: string }
  | { kind: "refill_water" }
  | { kind: "hire_staff"; roleId: string; expectedCost?: number; requiresMissingCoverage?: boolean }
  | { kind: "upgrade_room"; roomId: string; expectedCost?: number }
  | { kind: "place_room"; definitionId: string; expectedCost?: number }
  | { kind: "restore_access"; roomId: string }
  | { kind: "set_advertising"; level: number; fromLevel?: number }
  | { kind: "emergency_consult" }
  | { kind: "raise_salary"; employeeId: string; salary: number; fromSalary: number }
  | { kind: "praise_employee"; employeeId: string }
  | { kind: "train_employee"; employeeId: string; expectedCost: number }
  | { kind: "open_discussion"; discussionId: string }
  | { kind: "enable_appointments" }
  | { kind: "level_up" }
  | { kind: "show_goals" };

export interface GuidanceTipCandidate {
  id: GuidanceTipId;
  targetKey: string;
  /** A bottleneck can occupy only one family until it is addressed. */
  rootKey: string;
  priority: 0 | 1 | 2;
  speaker: string;
  values: Record<string, string>;
  action?: GuidanceTipAction;
  actionLabel?: string;
  /** Optional improvements start a fresh grace when history is unknown. */
  optional: boolean;
  lastFixTick: number | null;
}

export interface GuidanceTipReceipt {
  id: string;
  tipId: GuidanceTipId;
  targetKey: string;
  rootKey: string;
  emittedAtTick: number;
  variant: "A" | "B";
  message: string;
  speaker: string;
}

export interface GuidanceTipsState {
  version: "guidance-tips.v1";
  initializedAtTick: number;
  introductoryCompletedAtTick: number | null;
  eligibleSince: Record<string, number>;
  lastEmittedById: Partial<Record<GuidanceTipId, number>>;
  lastEmittedByFamily: Partial<Record<GuidanceTipFamily, number>>;
  emissionCounts: Partial<Record<GuidanceTipId, number>>;
  rollingEmissionTicks: number[];
  lastEmittedAtTick: number | null;
  lastDireAtTick: number | null;
  observations: Record<string, { signature: string; changedAtTick: number }>;
  rootLocks: Record<string, { tipId: GuidanceTipId; targetKey: string }>;
  /** One appointments teaching per established supported setup, not per toggle. */
  taughtServiceSetups: string[];
  sequence: number;
  history: GuidanceTipReceipt[];
}
