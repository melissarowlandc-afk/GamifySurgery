import { GUIDANCE_TIP_CATALOG, type GuidanceTipId } from "@gamify-surgery/balance-config";
import type { GameCommand, GameState } from "./types";
import type { GuidanceTipAction } from "./guidance-tip-types";

export const FIRST_SHIFT_TOPIC_IDS = ["patient-folders", "chart-decisions", "terminal-filing", "plan-enactment", "returned-result", "pause-speed", "exam-placement", "exam-access", "manual-advancement", "management", "litter", "water", "paid-consult"] as const;
const validTopics = new Set<string>([...FIRST_SHIFT_TOPIC_IDS, ...GUIDANCE_TIP_CATALOG.map((tip) => tip.id)]);
export const isGuidanceTopicId = (id: string): boolean => validTopics.has(id);

/** One persisted record is shared by coach exposure, tip exposure and usage. */
export function recordGuidanceTopicExposure(state: GameState, ids: readonly string[]): void {
  const tips = state.alertHumor.guidanceTips;
  if (!tips || ids.length === 0) return;
  const activity = tips.topicActivity ??= {};
  for (const id of ids) if (isGuidanceTopicId(id)) activity[id] = {
    exposedAtTick: activity[id]?.exposedAtTick ?? state.facilityTick,
    ...(activity[id]?.usedAtTick === undefined ? {} : { usedAtTick: activity[id]!.usedAtTick }),
  };
}

export function guidanceTopicsForTip(state: GameState, id: GuidanceTipId, action?: GuidanceTipAction): string[] {
  const topics: string[] = [id];
  if (id === "tip.water.manual") topics.push("water");
  if (id === "tip.litter.manual") topics.push("litter");
  if (id === "tip.cash.manual-consult") topics.push("paid-consult");
  if (id === "tip.progression.next-step") topics.push("manual-advancement");
  if (action?.kind === "place_room" && action.definitionId === "room.examination") topics.push("exam-placement");
  if (action?.kind === "restore_access" && state.rooms.some((room) => room.id === action.roomId && room.roomDefinitionId === "room.examination")) topics.push("exam-access");
  if (action?.kind === "hire_staff" || action?.kind === "train_employee" || action?.kind === "enable_appointments") topics.push("management");
  return topics;
}

/** Record successful native use, never a read receipt or a failed attempt. */
export function recordGuidanceTopicUsage(state: GameState, command: GameCommand): void {
  if (state.operationReceipts[command.operationId]?.status !== "applied") return;
  let ids: string[] = [];
  if (command.type === "OPEN_CHART") ids = ["patient-folders"];
  if (command.type === "SUBMIT_ANSWER") ids = ["chart-decisions", ...(state.encounters[command.encounterId]?.currentNodeIndex ? ["returned-result"] : [])];
  if (command.type === "ACKNOWLEDGE_DECISION_FEEDBACK") ids = ["plan-enactment"];
  if (command.type === "CLOSE_CHART" && state.encounters[command.encounterId]?.lifecycle === "resolved") ids = ["terminal-filing"];
  if (command.type === "SET_PAUSED" || command.type === "SET_SIMULATION_SPEED") ids = ["pause-speed"];
  if (command.type === "PLACE_ROOM" && command.roomDefinitionId === "room.examination") ids = ["exam-placement"];
  if (command.type === "PLACE_DOOR" && state.rooms.some((room) => room.id === command.roomId && room.roomDefinitionId === "room.examination")) ids = ["exam-access"];
  if (command.type === "LEVEL_UP") ids = ["manual-advancement"];
  if (command.type === "HIRE_STAFF" || command.type === "TRAIN_EMPLOYEE") ids = ["management"];
  if (command.type === "COLLECT_LITTER") ids = ["litter"];
  if (command.type === "REFILL_WATER_COOLER") ids = ["water"];
  if (command.type === "RUN_EMERGENCY_GLP1_CONSULTATION") ids = ["paid-consult"];
  const tips = state.alertHumor.guidanceTips;
  if (!tips || ids.length === 0) return;
  const activity = tips.topicActivity ??= {};
  for (const id of ids) (activity[id] ??= {}).usedAtTick ??= state.facilityTick;
}
