import type { GameCommand } from "@gamify-surgery/game-domain";
export type FailureIntent = GameCommand | { type: "BUILD_UNDO"; operationId: string };

export type CommandStage = "capture" | "execute" | "diff" | "projection" | "journal" | "publication" | "followup" | "recovery";
const classes = { error: "Error", type: "TypeError", range: "RangeError", reference: "ReferenceError", syntax: "SyntaxError", uri: "URIError", eval: "EvalError", clone: "DataCloneError" } as const;
const sources = {
  reducer: "packages/game-domain/src/reducer.ts", remodel: "packages/game-domain/src/room-remodel.ts", evidence: "packages/game-domain/src/game-evidence.ts",
  staff: "packages/game-domain/src/staff.ts", selectors: "packages/game-domain/src/selectors.ts",
  spatial: "packages/game-domain/src/spatial.ts", timing: "packages/game-domain/src/diagnostic-timing.ts",
  service: "packages/game-domain/src/service-operations.ts", view: "apps/player/src/session/viewModels.ts",
  processor: "apps/player/src/session/cloud/operationalEngineProcessor.ts", engine: "apps/player/src/session/cloud/operationalSessionEngine.ts",
  projection: "apps/player/src/session/cloud/operationalViewProjection.ts", patch: "apps/player/src/session/cloud/operationalStatePatch.ts",
  session: "apps/player/src/session/cloud/gameSession.ts", publication: "apps/player/src/session/cloud/operationalSessionView.ts",
  coordinator: "apps/player/src/session/cloud/coordinator.ts",
  bundleworker: "bundle/operationalEngine.worker.js", bundleview: "bundle/facilityCameraPreference.js", bundlemain: "bundle/index.js", bundlecodec: "bundle/codecEvidence.js",
} as const;
type Source = keyof typeof sources;
export interface CommandFailureInfo { stage: CommandStage; errorClass: typeof classes[keyof typeof classes]; source: Source; line?: number; column?: number }

// Closed vocabulary: an invalid command.type must never become arbitrary text
// in a persisted problem report. Payloads and operation IDs never enter it.
const commandTypes = new Set<string>([
  "ACKNOWLEDGE_ALERTS_TUTORIAL", "ACKNOWLEDGE_DECISION_FEEDBACK", "ACKNOWLEDGE_EMPLOYEE_DISCUSSION_FEEDBACK",
  "ACKNOWLEDGE_FINISH_PAGE", "ACKNOWLEDGE_TERMINAL_FEEDBACK", "ADMIT_PATIENT", "ADVANCE_TICK", "AUTHORIZE_RETAIL_ORDER",
  "BOOK_INSPECTION", "CANCEL_INSPECTION", "CLOSE_CHART", "CLOSE_EMPLOYEE_DISCUSSION", "COLLECT_LITTER", "DEV_ADD_MONEY",
  "DEV_FAST_FORWARD", "FILE_EMPLOYEE_DISCUSSION", "FIRE_EMPLOYEE", "HIRE_STAFF", "LEVEL_UP", "MOVE_FOUNDER", "MOVE_ROOM",
  "OPEN_CHART", "OPEN_EMPLOYEE_DISCUSSION", "PLACE_DOOR", "PLACE_ROOM", "PRAISE_EMPLOYEE", "RECORD_GUIDANCE_TOPIC_EXPOSURE",
  "REFILL_WATER_COOLER", "REMOVE_DOOR", "ROTATE_ROOM", "SEAT_FOUNDER_AT_FRONT_DESK", "SEAT_FOUNDER_IN_CHAIR", "SELL_ROOM",
  "SET_ADVERTISING_LEVEL", "SET_EMPLOYEE_SALARY", "SET_PAUSED", "SET_SERVICE_APPOINTMENTS_ENABLED", "SET_SIMULATION_SPEED",
  "START_RETAIL_PURCHASE", "START_SERVICE_OPERATION", "SUBMIT_ANSWER", "SUBMIT_EMPLOYEE_DISCUSSION_ANSWER", "TRAIN_EMPLOYEE", "UPGRADE_ROOM",
  "BUILD_UNDO", "APPLY_REMODEL_PLAN",
]);
export const safeCommandType = (type: unknown): string => typeof type === "string" && commandTypes.has(type) ? type : "UNKNOWN";
export const commandSource = (info: CommandFailureInfo): string => sources[info.source] + (info.line ? `:${info.line}:${info.column ?? 0}` : "");

export class CommandExecutionFailure extends Error {
  constructor(readonly info: CommandFailureInfo) { super("Command could not be completed."); this.name = "CommandExecutionFailure"; }
}

/** Only built-in programming exceptions. Named evidence, codec, journal,
 * catalogue and authority errors keep their existing failure policy. */
export function commandProgrammingFailure(error: unknown, stage: CommandStage, fallback: Source): CommandExecutionFailure | null {
  if (error instanceof CommandExecutionFailure) return error;
  try {
    const cloneFailure = typeof DOMException !== "undefined" && error instanceof DOMException && error.name === "DataCloneError";
    if (!(error instanceof Error) && !cloneFailure) return null;
    if ((!cloneFailure && ("code" in error || "reason" in error)) || !Object.values(classes).includes(error.name as CommandFailureInfo["errorClass"])) return null;
    const info: CommandFailureInfo = { stage, errorClass: error.name as CommandFailureInfo["errorClass"], source: fallback };
    const stack = typeof error.stack === "string" ? error.stack.replaceAll("\\", "/").slice(0, 12_000) : "";
    for (const frame of stack.split("\n").slice(1, 10)) {
      for (const [source, path] of Object.entries(sources)) {
        if (source.startsWith("bundle")) continue;
        const at = frame.indexOf("/" + path + ":");
        const position = at < 0 ? null : frame.slice(at + path.length + 2).match(/^(\d{1,7}):(\d{1,7})(?:\)|\s|$)/);
        if (position) return new CommandExecutionFailure({ ...info, source: source as Source, line: Number(position[1]), column: Number(position[2]) });
      }
      const asset = frame.match(/\/assets\/(operationalEngine\.worker|facilityCameraPreference|codecEvidence|index)-[a-zA-Z0-9_-]{6,20}\.js:(\d{1,7}):(\d{1,7})(?:\)|\s|$)/);
      if (asset) return new CommandExecutionFailure({ ...info, source: asset[1] === "operationalEngine.worker" ? "bundleworker" : asset[1] === "index" ? "bundlemain" : asset[1] === "codecEvidence" ? "bundlecodec" : "bundleview", line: Number(asset[2]), column: Number(asset[3]) });
    }
    return new CommandExecutionFailure(info);
  } catch { return null; }
}

/** Uses the existing private failure-code field (client limit80 chars); no
 * cloud/save format, worker payload or arbitrary exception text is added. */
export function encodeCommandFailure(failure: CommandExecutionFailure): string {
  const info = failure.info, kind = Object.entries(classes).find(([, name]) => name === info.errorClass)![0];
  return `cf-${info.stage}-${kind}-${info.source}${info.line ? `-${info.line}-${info.column ?? 0}` : ""}`;
}
export function decodeCommandFailure(code: string): CommandExecutionFailure | null {
  const match = code.match(/^cf-(capture|execute|diff|projection|journal|publication|followup|recovery)-(error|type|range|reference|syntax|uri|eval|clone)-([a-z]+)(?:-(\d{1,7})-(\d{1,7}))?$/);
  if (!match || !Object.hasOwn(sources, match[3]!)) return null;
  return new CommandExecutionFailure({ stage: match[1] as CommandStage, errorClass: classes[match[2] as keyof typeof classes], source: match[3] as Source,
    ...(match[4] ? { line: Number(match[4]), column: Number(match[5]) } : {}) });
}

/** One bounded in-memory failure entry. Normal commands do no serialization.
 * Retrying a clock intent changes neither its key nor the published prefix. */
export class CommandFailureBackoff {
  private fault: { version: number; type: string; key: string; attempts: number; until: number } | null = null;
  skipped = 0;
  constructor(private readonly now = () => Date.now()) {}
  private key(command: FailureIntent): string {
    try {
      const value = JSON.stringify({ ...command, operationId: undefined, ...(command.type === "ADVANCE_TICK" ? { advancedAtRealMs: undefined } : {}) });
      return value.length <= 4096 ? value : command.operationId;
    } catch { return command.operationId; }
  }
  blocked(command: FailureIntent, version: number): boolean {
    const fault = this.fault;
    if (!fault || fault.version !== version || fault.type !== command.type || this.now() >= fault.until || fault.key !== this.key(command)) return false;
    this.skipped++; return true;
  }
  failed(command: FailureIntent, version: number): boolean {
    const key = this.key(command), old = this.fault, same = old?.version === version && old.type === command.type && old.key === key;
    const attempts = same ? old.attempts + 1 : 1;
    this.fault = { version, type: command.type, key, attempts, until: this.now() + Math.min(60_000, 1000 * 2 ** Math.min(attempts - 1, 6)) };
    return !same;
  }
  success(): void { this.fault = null; }
}
