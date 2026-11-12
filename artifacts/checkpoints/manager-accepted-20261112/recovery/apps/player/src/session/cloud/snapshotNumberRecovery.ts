import { forecastDiagnosticOrderPlan, getDiagnosticOrderPlans, normalizeDiagnosticOrderPlan, type DiagnosticOrderPlan, type GameState } from "@gamify-surgery/game-domain";
import { CloudCodecError, parseCodecJson } from "./codecJson";

export const SNAPSHOT_NUMBER_REPAIR = "snapshot-diagnostic-forecast-number-repaired";
const record = (value: unknown): value is Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value);
const invalid = (value: unknown) => typeof value !== "number" || !Number.isFinite(value) ||
  Number.isInteger(value) && !Number.isSafeInteger(value) || Object.is(value, -0) || value < 0;
const forecastFields = ["readyAtTick", "startsAtTick", "endsAtTick", "queueMinutes", "walkingMinutes"] as const;
const dueFields = ["dueTick", "durationTicks", "serviceDurationTicks"] as const;

function carriers(state: GameState): Record<string, unknown>[] {
  const rows: Record<string, unknown>[] = [];
  const add = (value: unknown) => {
    if (!record(value)) return;
    rows.push(value);
    if (record(value.remainder)) rows.push(value.remainder);
    if (Array.isArray(value.components)) for (const component of value.components) if (record(component)) rows.push(component);
  };
  for (const encounter of Object.values(state.encounters)) {
    for (const value of [encounter.pendingResult, encounter.testOnlyContinuation, encounter.terminalTestOrder, encounter.stagedResultOrder]) add(value);
    for (const step of encounter.steps) add(step.result);
  }
  for (const operation of state.serviceOperations) add(operation);
  return rows;
}

/** Only derived diagnostic clocks may cross the temporary recovery parse.
 * Duplicate keys, text/structure bounds and every other numeric field retain
 * the strict parser. Learning, money, actual work/reached clocks never qualify.
 */
function derivedPath(path: readonly (string | number)[]): boolean {
  const parts = path[0] === "gameState" ? path.slice(1) : path;
  let tail: readonly (string | number)[];
  if (parts[0] === "serviceOperations" && typeof parts[1] === "number") tail = parts.slice(2);
  else if (parts[0] === "encounters" && typeof parts[1] === "string") {
    if (["pendingResult", "testOnlyContinuation", "terminalTestOrder"].includes(String(parts[2]))) tail = parts.slice(3);
    else if (parts[2] === "steps" && typeof parts[3] === "number" && parts[4] === "result") tail = parts.slice(5);
    else if (parts[2] === "stagedResultOrder") {
      tail = parts[3] === "remainder" ? parts.slice(4) : parts[3] === "components" && typeof parts[4] === "number" ? parts.slice(5) : parts.slice(3);
    } else return false;
  } else return false;
  if (tail[0] === "diagnosticTiming") {
    tail = tail.slice(1);
    return tail.length === 4 && tail[0] === "phases" && typeof tail[1] === "number" && tail[2] === "forecast" && forecastFields.includes(tail[3] as typeof forecastFields[number]) ||
      tail.length === 2 && (tail[0] === "resultReady" || tail[0] === "careComplete") && tail[1] === "forecastAtTick";
  }
  return parts[0] === "encounters" && tail.length === 1 && dueFields.includes(tail[0] as typeof dueFields[number]);
}

/** Reject unknown nonfinite/oversized values before JSON.stringify can replace
 * NaN/Infinity with null. Signed zero has the existing JSON meaning of zero. */
export function serializeSnapshotState(state: GameState): string {
  return JSON.stringify(state, (_key, value: unknown) => {
    if (typeof value === "number" && (!Number.isFinite(value) || Number.isInteger(value) && !Number.isSafeInteger(value))) {
      throw new CloudCodecError("unsafe_number", "A non-repairable clinic number cannot be saved safely.");
    }
    return value;
  });
}

export function parseSnapshotJson(text: string) {
  try { return { value: parseCodecJson(text), repairForecasts: false }; }
  catch (error) {
    if (!(error instanceof CloudCodecError) || error.code !== "unsafe_number") throw error;
    const repairs: (readonly (string | number)[])[] = [];
    const value = parseCodecJson(text, { allowUnsafeNumber: path => {
      const allowed = derivedPath(path); if (allowed) repairs.push(path); return allowed;
    } });
    for (const path of repairs) {
      const timing = path.indexOf("diagnosticTiming");
      let plan: unknown = value;
      for (const key of path.slice(0, timing >= 0 ? timing + 1 : -1)) {
        if (plan === null || typeof plan !== "object" || !Object.hasOwn(plan, key)) throw error;
        plan = (plan as Record<string | number, unknown>)[key];
      }
      if (timing < 0) plan = record(plan) ? plan.diagnosticTiming : undefined;
      // A legacy carrier without a real diagnostic plan is not a repairable
      // forecast. Never round an unrelated due/duration token via JSON.parse.
      if (!record(plan) || typeof plan.orderId !== "string" || !plan.orderId || !Array.isArray(plan.phases)) throw error;
    }
    return { value, repairForecasts: repairs.length > 0 };
  }
}

/** One-time, copy-on-write repair of ETA metadata, never gameplay/FSRS values.
 * The unsafe original journal rows/copy remain hash-checked and intact until
 * the ordinary atomic journal rebase/confirmed snapshot replaces their tail.
 */
function recoverSnapshotNumbers(state: GameState, forceForecasts: boolean): { state: GameState; numberRepairs?: readonly string[] } {
  const bad = new Set<string>();
  for (const row of carriers(state)) {
    const plan = row.diagnosticTiming as DiagnosticOrderPlan | undefined;
    if (!plan || !Array.isArray(plan.phases)) continue;
    if (forceForecasts || plan.phases.some(phase => forecastFields.some(key => invalid(phase.forecast?.[key]))) ||
      invalid(plan.resultReady?.forecastAtTick) || invalid(plan.careComplete?.forecastAtTick) ||
      dueFields.some(key => Object.hasOwn(row, key) && invalid(row[key]))) bad.add(plan.orderId);
  }
  if (!bad.size) {
    if (forceForecasts) throw new CloudCodecError("domain_validation", "No repairable diagnostic plan was found.");
    return { state };
  }
  if (!Number.isSafeInteger(state.facilityTick) || state.facilityTick < 0) throw new CloudCodecError("domain_validation", "Invalid clinic clock.");
  const repaired = structuredClone(state), rows = carriers(repaired);
  const plans = new Map(getDiagnosticOrderPlans(repaired).filter(plan => bad.has(plan.orderId)).map(plan => [plan.orderId, plan]));
  for (const row of rows) {
    const plan = row.diagnosticTiming as DiagnosticOrderPlan | undefined;
    if (!plan || !bad.has(plan.orderId)) continue;
    // Replace only forecasts before validating the accepted frozen contract.
    // Actual starts/completions, remaining work, sources, charges and paths stay.
    for (const phase of plan.phases) {
      const starts = phase.startedAtTick ?? plan.createdAtTick;
      phase.forecast = { ...phase.forecast, readyAtTick: starts, startsAtTick: starts,
        endsAtTick: phase.completedAtTick ?? starts + phase.durationMinutes, queueMinutes: 0, walkingMinutes: 0 };
    }
    for (const milestone of [plan.resultReady, plan.careComplete]) {
      milestone.forecastAtTick = Math.max(plan.createdAtTick, ...milestone.afterPhaseIds.map(id => plan.phases.find(phase => phase.id === id)!.forecast.endsAtTick));
    }
    if (!normalizeDiagnosticOrderPlan(plan)) throw new CloudCodecError("domain_validation", "The frozen diagnostic contract is invalid.");
  }
  // All calendars see finite placeholders before any forecast is recomputed.
  for (const [id, plan] of plans) {
    const next = forecastDiagnosticOrderPlan(repaired, plan).plan;
    if (!normalizeDiagnosticOrderPlan(next)) throw new CloudCodecError("domain_validation", "The diagnostic forecast could not be repaired.");
    for (const row of rows) if ((row.diagnosticTiming as DiagnosticOrderPlan | undefined)?.orderId === id) {
      row.diagnosticTiming = structuredClone(next);
      if (Object.hasOwn(row, "dueTick") && (row.deliveredAtTick === null || invalid(row.dueTick))) {
        const due = Math.ceil(Math.max(next.resultReady.forecastAtTick, next.careComplete.forecastAtTick));
        if (typeof row.scheduledAtTick !== "number" || invalid(row.scheduledAtTick)) throw new CloudCodecError("domain_validation", "Invalid diagnostic acceptance clock.");
        row.dueTick = due; row.durationTicks = Math.max(0, due - row.scheduledAtTick);
        if (Object.hasOwn(row, "serviceDurationTicks") && invalid(row.serviceDurationTicks)) row.serviceDurationTicks = row.durationTicks;
      }
    }
  }
  return { state: repaired, numberRepairs: [SNAPSHOT_NUMBER_REPAIR] };
}

export function repairSnapshotNumbers(state: GameState, forceForecasts = false): { state: GameState; numberRepairs?: readonly string[] } {
  try { return recoverSnapshotNumbers(state, forceForecasts); }
  catch (error) {
    if (error instanceof CloudCodecError) throw error;
    throw new CloudCodecError("domain_validation", "The frozen diagnostic contract could not be repaired.");
  }
}
