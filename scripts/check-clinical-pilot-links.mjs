import { readFile } from "node:fs/promises";

const sourceFiles = [
  "packages/clinical-content/src/pilot-data/laceration-abscess-biliary.ts",
  "packages/clinical-content/src/pilot-data/hernia-appendicitis.ts",
];

const sourceTexts = await Promise.all(
  sourceFiles.map((path) => readFile(path, "utf8")),
);
const officialUrls = [
  ...new Set(
    sourceTexts.flatMap((sourceText) =>
      [...sourceText.matchAll(/officialUrl:\s*"([^"]+)"/g)].map(
        (match) => match[1],
      ),
    ),
  ),
];

if (officialUrls.length !== 21) {
  throw new Error(
    `Expected 21 pilot source URLs, but extracted ${officialUrls.length}.`,
  );
}

async function request(url, method) {
  const response = await fetch(url, {
    method,
    redirect: "follow",
    headers: {
      "user-agent": "Stitchin-Time-Source-Check/1.0",
      ...(method === "GET" ? { range: "bytes=0-0" } : {}),
    },
    signal: AbortSignal.timeout(20_000),
  });
  await response.body?.cancel();
  return response;
}

async function checkUrl(url) {
  let lastResult;

  for (const method of ["HEAD", "GET"]) {
    try {
      const response = await request(url, method);
      lastResult = {
        url,
        status: response.status,
        finalUrl: response.url,
      };
      if (response.status < 400) {
        return lastResult;
      }
    } catch (error) {
      lastResult = {
        url,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  return lastResult;
}

const results = await Promise.all(officialUrls.map(checkUrl));
for (const result of results) {
  const outcome =
    "status" in result
      ? `${result.status} ${result.finalUrl}`
      : `ERROR ${result.error}`;
  console.log(`${result.url} -> ${outcome}`);
}

const failures = results.filter(
  (result) => !("status" in result) || result.status >= 400,
);
console.log(
  `Checked ${results.length} source URLs: ${results.length - failures.length} HTTP-success, ${failures.length} requiring manual verification.`,
);

if (failures.length > 0) {
  process.exitCode = 1;
}
