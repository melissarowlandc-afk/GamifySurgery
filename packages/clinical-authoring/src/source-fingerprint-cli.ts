import { resolve } from "node:path";

import {
  fingerprintSourceFile,
  SourceFingerprintError,
} from "./source-fingerprint.js";

async function main(): Promise<void> {
  const [inputPath, ...unexpectedArguments] = process.argv.slice(2);
  if (!inputPath || unexpectedArguments.length > 0) {
    console.error(
      "Usage: node dist/source-fingerprint-cli.js <owner-local-source-file>",
    );
    process.exitCode = 2;
    return;
  }

  try {
    const fingerprint = await fingerprintSourceFile(resolve(inputPath));
    console.log(JSON.stringify(fingerprint, null, 2));
  } catch (error: unknown) {
    if (error instanceof SourceFingerprintError || error instanceof Error) {
      console.error(`Unable to fingerprint source: ${error.message}`);
    } else {
      console.error("Unable to fingerprint source.");
    }
    process.exitCode = 1;
  }
}

await main();
