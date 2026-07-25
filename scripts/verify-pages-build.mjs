import { access, readFile } from "node:fs/promises";
import { resolve } from "node:path";

const expectedBase = process.argv[2] ?? "/GamifySurgery/";

if (!expectedBase.startsWith("/") || !expectedBase.endsWith("/")) {
  throw new Error(
    `Expected a root-relative Pages base ending in "/"; received "${expectedBase}".`,
  );
}

const outputDirectory = resolve("apps/player/dist");
const indexPath = resolve(outputDirectory, "index.html");
const html = await readFile(indexPath, "utf8");
const attributePattern = /(?:href|src)="([^"]+)"/g;
const localReferences = [...html.matchAll(attributePattern)]
  .map((match) => match[1])
  .filter((reference) => reference.startsWith("/"));

if (localReferences.length === 0) {
  throw new Error("The Pages build did not produce any root-relative assets.");
}

const wrongBaseReferences = localReferences.filter(
  (reference) => !reference.startsWith(expectedBase),
);

if (wrongBaseReferences.length > 0) {
  throw new Error(
    `Pages assets escaped "${expectedBase}": ${wrongBaseReferences.join(", ")}`,
  );
}

for (const reference of localReferences) {
  const relativeAssetPath = reference
    .slice(expectedBase.length)
    .split(/[?#]/, 1)[0];

  if (!relativeAssetPath) {
    continue;
  }

  await access(resolve(outputDirectory, relativeAssetPath));
}

console.log(
  `Verified ${localReferences.length} Pages asset reference(s) under ${expectedBase}.`,
);
