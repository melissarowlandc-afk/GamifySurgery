import { readFile } from "node:fs/promises";

import {
  compileClinicalWorkbook,
  initializeClinicalWorkbook,
  writeCompiledClinicalWorkbook,
} from "./workbook/index.js";

function usage(): void {
  console.error(
    [
      "Usage:",
      "  node dist/workbook-cli.js init <directory>",
      "  node dist/workbook-cli.js compile <directory> <output.json> [--base <workspace.json>]",
    ].join("\n"),
  );
}
async function main(): Promise<void> {
  const [command, ...arguments_] = process.argv.slice(2);
  if (command === "init" && arguments_.length === 1) {
    await initializeClinicalWorkbook(arguments_[0]!);
    console.log(`Initialized clinical workbook: ${arguments_[0]}`);
    return;
  }

  if (command === "compile") {
    const [directory, outputPath, ...options] = arguments_;
    if (!directory || !outputPath) {
      usage();
      process.exitCode = 2;
      return;
    }
    let baseWorkspace: unknown;
    if (options.length === 0) {
      baseWorkspace = undefined;
    } else if (options.length === 2 && options[0] === "--base") {
      baseWorkspace = JSON.parse(await readFile(options[1]!, "utf8"));
    } else {
      usage();
      process.exitCode = 2;
      return;
    }

    const compiled = await compileClinicalWorkbook(directory, {
      ...(baseWorkspace === undefined ? {} : { baseWorkspace }),
    });
    await writeCompiledClinicalWorkbook(outputPath, compiled);
    console.log(`Compiled valid clinical workspace: ${outputPath}`);
    for (const warning of compiled.reviewWarnings) {
      console.warn(`Review warning: ${warning}`);
    }
    return;
  }

  usage();
  process.exitCode = 2;
}

try {
  await main();
} catch (error: unknown) {
  console.error(
    error instanceof Error
      ? `Clinical workbook operation failed: ${error.message}`
      : "Clinical workbook operation failed.",
  );
  process.exitCode = 1;
}
