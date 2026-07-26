import { access, readdir, readFile } from "node:fs/promises";
import { extname, relative, resolve } from "node:path";

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

const forbiddenBundleMarkers = [
  "apps/clinical-context-workbench",
  "packages/clinical-authoring",
  "packages/clinical-research",
  ".clinical-workbench",
  ".private-clinical-data",
  "clinical-data/private",
  "clinical-data/imports",
  "clinical-data/exports",
  "@gamify-surgery/clinical-authoring",
  "@gamify-surgery/clinical-research",
  "@gamify-surgery/clinical-context-workbench",
];
const privateSourceExtensions = new Set([".doc", ".docx", ".pdf"]);
const scannableExtensions = new Set([
  ".css",
  ".html",
  ".js",
  ".json",
  ".map",
  ".svg",
  ".txt",
]);

async function listBuildFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      return entry.isDirectory() ? listBuildFiles(path) : [path];
    }),
  );
  return nested.flat();
}

const buildFiles = await listBuildFiles(outputDirectory);
for (const buildFile of buildFiles) {
  const extension = extname(buildFile).toLowerCase();
  if (privateSourceExtensions.has(extension)) {
    throw new Error(
      `Pages build contains a private-source file type: ${relative(outputDirectory, buildFile)}.`,
    );
  }
  if (!scannableExtensions.has(extension)) {
    continue;
  }
  const contents = (await readFile(buildFile, "utf8")).replaceAll("\\", "/");
  const marker = forbiddenBundleMarkers.find((candidate) =>
    contents.includes(candidate),
  );
  if (marker) {
    throw new Error(
      `Pages build contains authoring-only marker "${marker}" in ${relative(outputDirectory, buildFile)}.`,
    );
  }
}

console.log(
  `Verified ${localReferences.length} Pages asset reference(s) and ${buildFiles.length} public build file(s) under ${expectedBase}.`,
);
