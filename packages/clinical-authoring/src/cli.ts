import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { ZodError } from "zod";

import {
  summarizeClinicalAuthoringWorkspace,
  validateClinicalAuthoringWorkspace,
  validatePublicClinicalAuthoringWorkspace,
} from "./workspace.js";

async function main(): Promise<void> {
  const arguments_ = process.argv.slice(2);
  const publicSafe = arguments_.includes("--public-safe");
  const positionalArguments = arguments_.filter(
    (argument) => argument !== "--public-safe",
  );
  const [inputPath, ...unexpectedArguments] = positionalArguments;
  if (!inputPath || unexpectedArguments.length > 0) {
    console.error(
      "Usage: node dist/cli.js [--public-safe] <clinical-authoring-workspace.json>",
    );
    process.exitCode = 2;
    return;
  }

  try {
    const absolutePath = resolve(inputPath);
    const serialized = await readFile(absolutePath, "utf8");
    const candidate: unknown = JSON.parse(serialized);
    const workspace = publicSafe
      ? validatePublicClinicalAuthoringWorkspace(candidate)
      : validateClinicalAuthoringWorkspace(candidate);
    const summary = summarizeClinicalAuthoringWorkspace(workspace);

    console.log(`Valid clinical-authoring workspace: ${summary.workspaceId}`);
    console.log(
      `Sources ${summary.sourceCount} (${summary.sourceSnapshotCount} snapshots); frameworks ${summary.frameworkCount}; coverage nodes ${summary.coverageNodeCount}; topic mappings ${summary.topicCoverageMappingCount}.`,
    );
    console.log(
      `Topics ${summary.topicCount}; facts ${summary.structuredFactCount}; concepts ${summary.conceptCount}; inbox ${summary.practiceInboxCount}; batches ${summary.extractionBatchCount}.`,
    );
    console.log(
      publicSafe
        ? "Public-fixture guardrails: passed."
        : "Public-fixture guardrails: not requested.",
    );
    console.log(
      summary.unresolvedConflictGroupIds.length === 0
        ? "Unresolved source conflicts: none."
        : `Unresolved source conflicts: ${summary.unresolvedConflictGroupIds.join(", ")}.`,
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      console.error("Clinical-authoring validation failed:");
      for (const issue of error.issues) {
        console.error(`- ${issue.path.join(".") || "<root>"}: ${issue.message}`);
      }
    } else if (error instanceof SyntaxError) {
      console.error(`Clinical-authoring JSON is invalid: ${error.message}`);
    } else if (error instanceof Error) {
      console.error(`Unable to validate clinical-authoring data: ${error.message}`);
    } else {
      console.error("Unable to validate clinical-authoring data.");
    }
    process.exitCode = 1;
  }
}

await main();
