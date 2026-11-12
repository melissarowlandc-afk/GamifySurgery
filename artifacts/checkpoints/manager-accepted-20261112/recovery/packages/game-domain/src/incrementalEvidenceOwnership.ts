import type { GameEvidenceKind } from "./game-evidence";

const any = Symbol("array index / identity key");
type Part = string | readonly string[] | typeof any;
interface Node { kind?: GameEvidenceKind; children: Map<string, Node>; any?: Node }
const root: Node = { children: new Map() };
function own(kind: GameEvidenceKind, parts: readonly Part[], node = root): void {
  if (!parts.length) { node.kind = kind; return; }
  const [part, ...rest] = parts;
  if (part === any) { own(kind, rest, node.any ??= { children: new Map() }); return; }
  for (const key of typeof part === "string" ? [part] : part!) {
    let next = node.children.get(key);
    if (!next) { next = { children: new Map() }; node.children.set(key, next); }
    own(kind, rest, next);
  }
}
const episodes = ["encounters", "employeeDiscussions"];
own("episode-identity", ["encounters", any, ["id", "patientDisplayName", "patientAppearance", "arrivalClass"]]);
own("episode-identity", ["employeeDiscussions", any, ["id", "clinicalReleaseId", "employeeId", "employeeDisplayName", "employeeAppearance", "createdAtFacilityTick"]]);
own("episode-identity", ["encounters", any, "waiting", "arrivedAtTick"]);
own("decision-identity", [episodes, any, "steps", any, ["nodeIndex", "decisionNodeId", "questionVariantId", "primaryConceptId"]]);
own("frozen-result-text", [episodes, any, "pendingResult", "resultNarrative"]);
own("frozen-result-text", [episodes, any, "steps", any, "result", "resultNarrative"]);
own("frozen-work", ["serviceOperations", any, "frozenOperationPhases"]);
own("frozen-order", ["serviceOperations", any, "testChoiceOrder"]);
own("frozen-case", [episodes, any, "frozenCase"]);
own("answer", [episodes, any, "answers", any]);
own("answer", [episodes, any, "steps", any, "answer"]);
own("card-state", ["learningHistories", any, "card"]);
own("review", ["learningHistories", any, "reviews", any]);
for (const [field, kind] of Object.entries({ reviewIntents: "review-intent", settlements: "settlement",
  serviceIncomeReceipts: "income", operationReceipts: "operation", events: "event" } as const)) own(kind, [field, any]);
own("completion-witness", ["levelFourCompletion", ["pediatricVisitWithParent", "woundOstomyCareVisit"]]);
own("inspection-report", ["levelFive", "inspection", ["lastReport", "latestCompletedReport", "bestCompletedReport"]]);
own("inspection-preparation", ["levelFive", "inspection", "preparation"]);
own("inspection-unlock", ["levelFive", "progress", "inspectionUnlocked"]);
own("inspection-report", ["levelFive", "progress", "gameFinished", "firstCompletedReport"]);
own("inspection-question", ["levelFive", "inspection", "run", "accumulators", "presentedQuestions", any]);

function find(path: readonly string[]): Node | undefined {
  let node: Node | undefined = root;
  for (const part of path) { node = node.children.get(part) ?? node.any; if (!node) break; }
  return node;
}

/** Same exact ownership rules as the original kindAt, also indexed by prefix.
 * One policy drives full projection and the pre-retirement fact-only scan.
 */
export function incrementalEvidenceKindAt(path: readonly string[]): GameEvidenceKind | undefined {
  const kind = find(path)?.kind;
  return kind === "inspection-question" && path[5] === undefined ? undefined : kind;
}
export const mayContainEvidence = (path: readonly string[]): boolean => find(path) !== undefined;
