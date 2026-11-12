import { expect,it } from "vitest";
import { gameReducer } from "@gamify-surgery/game-domain";
import { scoredPatientFixture } from "../playtime/usageTestFixtures";
import { learningReviewCount } from "./learningReviewCount";

it("counts changed histories and never treats a shallow-frozen mutable QA history as immutable",()=>{
  const before=scoredPatientFixture(),encounter=before.encounters[before.openChartEncounterId!]!,node=encounter.frozenCase.decisionNodes[encounter.currentNodeIndex]!;
  const after=gameReducer(before,{type:"SUBMIT_ANSWER",encounterId:encounter.id,decisionNodeId:node.id,answerChoiceId:node.answerChoices[0]!.id,
    reviewedAtMs:1800000000000,operationId:"review.count.public"});
  expect(learningReviewCount(after.learningHistories)).toBe(learningReviewCount(before.learningHistories)+1);
  const histories=after.learningHistories,history=histories[node.primaryConceptId]!;
  Object.freeze(histories);const count=learningReviewCount(histories);
  history.reviews.push(history.reviews[0]!);
  expect(learningReviewCount(histories)).toBe(count+1);
});
