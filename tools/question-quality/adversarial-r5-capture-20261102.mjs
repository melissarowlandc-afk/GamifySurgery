import fs from "node:fs";
import crypto from "node:crypto";
import "../economy-audit/source-loader.mjs";
import {collectAuthoredMetadata} from "./bank.mjs";

const target="tools/question-quality/fixtures/adversarial-r5-before-20261102.json";
if(fs.existsSync(target))throw Error("Immutable entry snapshot already exists");
const c=await import("../../packages/clinical-content/src/index.ts");
const read=p=>JSON.parse(fs.readFileSync(p,"utf8"));
const review=read("docs/research/question-batch1-adversarial-review4-20261102.json");
const revisions=c.QUESTION_QUALITY_CURRENT_REVISIONS;
const ids=new Set(revisions.map(r=>r.caseId));
const metadata=collectAuthoredMetadata(c);
const paths=[
  "packages/clinical-content/src/question-quality-pilot-20261028.ts",
  "packages/clinical-content/src/question-quality-adversarial-20261102.ts",
  "packages/clinical-content/src/question-quality-adversarial-20261102-data.ts",
  "packages/clinical-content/src/question-quality-adversarial-evidence-20261102.ts",
  "packages/clinical-content/src/question-quality-clinical-approvals-20261102.ts",
  "packages/clinical-content/src/question-quality-adversarial.test.ts",
  "packages/clinical-content/src/question-quality-adversarial-r4.test.ts",
  "packages/game-domain/tests/patient-supply.test.ts",
  "packages/game-domain/tests/diagnostics/patient-supply.test.ts",
  "packages/clinical-content/src/answer-choice-timing.ts",
  "packages/clinical-content/src/answer-choice-timing.test.ts",
  "packages/clinical-content/src/index.ts",
  "packages/clinical-content/src/synthetic-content.ts",
  "packages/game-domain/src/test-choice-orders.ts",
  "packages/game-domain/tests/test-choice-order-inventory.test.ts",
  "packages/game-domain/tests/answer-choice-timing.test.ts",
  "packages/game-domain/tests/gs028-20261007-level3-batch.test.ts",
  "apps/player/src/session/variety3ChartsViewModels.test.ts",
  "apps/player/src/session/earlyLevelsPresentation.test.ts",
  "tools/question-quality/report.mjs",
  "tools/question-quality/review-round3-batch1-20261102.mjs",
  "tools/question-quality/verify-review-20261102.mjs",
  "tools/question-quality/README.md",
  "docs/clinical/question-authoring-standard.md",
  "docs/execplans/question-bank-rewrite-20261102.md",
];
const protectedPaths=[
  "packages/clinical-content/src/question-quality-adversarial-r4-20261102.ts",
  "packages/clinical-content/src/question-quality-adversarial-r4-20261102-data.ts",
  "packages/clinical-content/src/question-quality-adversarial-r4-evidence-20261102.ts",
  "tests/fixtures/level-five-legacy-behavior-20261012.json",
  "packages/clinical-content/src/question-quality-adversarial-r3-20261102-data.ts",
  "packages/clinical-content/src/question-quality-adversarial-r3-evidence-20261102.ts",
  "packages/clinical-content/src/question-quality-clinical-approvals-20261102.ts",
  "packages/game-domain/src/spatial.ts",
  "packages/game-domain/src/game-evidence-json.ts",
  "packages/game-domain/src/game-evidence.ts",
  "packages/game-domain/src/game-evidence-index.ts",
  "packages/game-domain/tests/level-five-integration.test.ts",
  "packages/game-domain/tests/level-five-latent-bugs.test.ts",
  "tools/qa/level-five-integration-results-20261012.json",
  "tests/fixtures/level-five-integration-checkpoints-20261012.json",
  "tools/perf/evidence-incremental.mjs",
];
const sha256=b=>crypto.createHash("sha256").update(b).digest("hex");
const snapshot={capturedOn:"2026-11-02",scope:"Project-owned synthetic authoring baseline for fifth author revision, before any clinical/source edit. No player data or external source text.",
  review,revisions,cases:c.SYNTHETIC_CLINICAL_RELEASE.cases.filter(x=>ids.has(x.id)),concepts:c.SYNTHETIC_CLINICAL_RELEASE.concepts,
  timings:c.ANSWER_CHOICE_TIMING_REGISTRY,approvals:c.QUESTION_QUALITY_CLINICAL_APPROVALS,
  questionMetadata:[...metadata.questions],pilotPacket:read("docs/research/question-round3-20261102.json"),batchPacket:read("docs/research/question-batch1-20261102.json"),
  sources:[...metadata.sources.values()],claims:[...metadata.claims.values()],
  files:Object.fromEntries(paths.map(p=>[p,{text:fs.readFileSync(p,"utf8"),sha256:sha256(fs.readFileSync(p))}])),
  protected:Object.fromEntries(protectedPaths.map(p=>[p,sha256(fs.readFileSync(p))])),
};
fs.writeFileSync(target,JSON.stringify(snapshot,null,2)+"\n");
console.log(JSON.stringify({cases:snapshot.cases.length,revisions:revisions.length,timings:snapshot.timings.length,pass:review.filter(x=>x.verdict==="PASS").length,revise:review.filter(x=>x.verdict==="REVISE").length,bytes:fs.statSync(target).size}));
