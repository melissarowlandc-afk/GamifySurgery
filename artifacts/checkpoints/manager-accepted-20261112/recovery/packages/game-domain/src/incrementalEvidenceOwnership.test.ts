import { expect, it } from "vitest";
import { incrementalEvidenceKindAt, mayContainEvidence } from "./incrementalEvidenceOwnership";
import type { GameEvidenceKind } from "./game-evidence";

// Literal delivered rule; independent of the compiled production trie.
function reference(path: readonly string[]): GameEvidenceKind | undefined {
  const [root, second, third, fourth, fifth, sixth] = path;
  if (root === "encounters" || root === "employeeDiscussions") {
    const identity = root === "encounters" ? ["id", "patientDisplayName", "patientAppearance", "arrivalClass"]
      : ["id", "clinicalReleaseId", "employeeId", "employeeDisplayName", "employeeAppearance", "createdAtFacilityTick"];
    if (path.length === 3 && identity.includes(third ?? "") || root === "encounters" && path.length === 4 && third === "waiting" && fourth === "arrivedAtTick") return "episode-identity";
    if (third === "steps" && path.length === 5 && ["nodeIndex", "decisionNodeId", "questionVariantId", "primaryConceptId"].includes(fifth ?? "")) return "decision-identity";
    if (path.at(-1) === "resultNarrative" && (third === "pendingResult" && path.length === 4 || third === "steps" && fifth === "result" && path.length === 6)) return "frozen-result-text";
  }
  if (root === "serviceOperations" && path.length === 3) {
    if (third === "frozenOperationPhases") return "frozen-work";
    if (third === "testChoiceOrder") return "frozen-order";
  }
  if ((root === "encounters" || root === "employeeDiscussions") && path.length === 3 && third === "frozenCase") return "frozen-case";
  if ((root === "encounters" || root === "employeeDiscussions") &&
    (path.length === 4 && third === "answers" || path.length === 5 && third === "steps" && fifth === "answer")) return "answer";
  if (root === "learningHistories" && path.length === 3 && third === "card") return "card-state";
  if (root === "learningHistories" && path.length === 4 && third === "reviews") return "review";
  if (path.length === 2) {
    const top: Record<string, GameEvidenceKind> = { reviewIntents: "review-intent", settlements: "settlement",
      serviceIncomeReceipts: "income", operationReceipts: "operation", events: "event" };
    if (root && Object.hasOwn(top, root)) return top[root];
    if (root === "levelFourCompletion" && ["pediatricVisitWithParent", "woundOstomyCareVisit"].includes(second ?? "")) return "completion-witness";
  }
  if (root === "levelFive") {
    if (second === "inspection" && path.length === 3) {
      if (["lastReport", "latestCompletedReport", "bestCompletedReport"].includes(third ?? "")) return "inspection-report";
      if (third === "preparation") return "inspection-preparation";
    }
    if (second === "progress" && third === "inspectionUnlocked" && path.length === 3) return "inspection-unlock";
    if (second === "progress" && third === "gameFinished" && fourth === "firstCompletedReport" && path.length === 4) return "inspection-report";
    if (second === "inspection" && third === "run" && fourth === "accumulators" && fifth === "presentedQuestions" && sixth !== undefined && path.length === 6) return "inspection-question";
  }
  return undefined;
}

it("matches every delivered ownership path and rejects collateral paths/prefixes", () => {
  const paths = [
    ["encounters", "x", "frozenCase"], ["encounters", "x", "id"], ["encounters", "x", "patientDisplayName"],
    ["encounters", "x", "waiting", "arrivedAtTick"], ["employeeDiscussions", "x", "createdAtFacilityTick"],
    ["employeeDiscussions", "x", "steps", "2", "answer"], ["encounters", "x", "steps", "1", "decisionNodeId"],
    ["encounters", "x", "pendingResult", "resultNarrative"], ["encounters", "x", "steps", "1", "result", "resultNarrative"],
    ["serviceOperations", "1", "frozenOperationPhases"], ["serviceOperations", "2", "testChoiceOrder"],
    ["learningHistories", "x", "card"], ["learningHistories", "x", "reviews", "1"],
    ["events", "1"], ["operationReceipts", "x"], ["serviceIncomeReceipts", "1"], ["settlements", "1"], ["reviewIntents", "1"],
    ["levelFourCompletion", "pediatricVisitWithParent"], ["levelFourCompletion", "woundOstomyCareVisit"],
    ["levelFive", "inspection", "lastReport"], ["levelFive", "inspection", "latestCompletedReport"],
    ["levelFive", "inspection", "bestCompletedReport"], ["levelFive", "inspection", "preparation"],
    ["levelFive", "progress", "inspectionUnlocked"], ["levelFive", "progress", "gameFinished", "firstCompletedReport"],
    ["levelFive", "inspection", "run", "accumulators", "presentedQuestions", "1"],
  ];
  const tokens = [...new Set(paths.flat()), "unknown", "employees", "rooms", "diagnosticTiming", "0", ""];
  for (const path of paths) {
    expect(incrementalEvidenceKindAt(path)).toBe(reference(path));
    for (let size = 0; size <= path.length; size++) expect(mayContainEvidence(path.slice(0, size))).toBe(true);
    for (let i = 0; i < path.length; i++) for (const token of tokens) {
      const varied = path.map((part, index) => index === i ? token : part);
      expect(incrementalEvidenceKindAt(varied)).toBe(reference(varied));
      expect(incrementalEvidenceKindAt([...varied, "extra"])).toBe(reference([...varied, "extra"]));
    }
  }
});
