import { execFileSync } from "node:child_process";
import { readdir, readFile } from "node:fs/promises";
import { extname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const forbiddenPackageNames = new Set([
  "@gamify-surgery/clinical-authoring",
  "@gamify-surgery/clinical-research",
  "@gamify-surgery/clinical-context-workbench",
]);
const protectedRuntimePackages = [
  "apps/player",
  "packages/game-domain",
];
const forbiddenSourceMarkers = [
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
const forbiddenTrackedPrefixes = [
  ".clinical-workbench/",
  ".private-clinical-data/",
  "clinical-data/private/",
  "clinical-data/imports/",
  "clinical-data/exports/",
];
const textExtensions = new Set([
  ".cjs",
  ".css",
  ".html",
  ".js",
  ".json",
  ".jsx",
  ".mjs",
  ".scss",
  ".ts",
  ".tsx",
]);

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => entry.name !== "dist" && entry.name !== "node_modules")
      .map(async (entry) => {
        const path = join(directory, entry.name);
        return entry.isDirectory() ? listFiles(path) : [path];
      }),
  );
  return nested.flat();
}

const failures = [];
const workspaceDirectories = (
  await Promise.all(
    ["apps", "packages"].map(async (root) => {
      const entries = await readdir(resolve(repositoryRoot, root), {
        withFileTypes: true,
      });
      return entries
        .filter((entry) => entry.isDirectory())
        .map((entry) => `${root}/${entry.name}`);
    }),
  )
).flat();
const workspaceByName = new Map();
for (const workspaceDirectory of workspaceDirectories) {
  const manifest = await readJson(
    resolve(repositoryRoot, workspaceDirectory, "package.json"),
  );
  workspaceByName.set(manifest.name, {
    directory: workspaceDirectory,
    manifest,
  });
}

for (const packageDirectory of protectedRuntimePackages) {
  const absoluteDirectory = resolve(repositoryRoot, packageDirectory);
  const manifest = await readJson(join(absoluteDirectory, "package.json"));
  const dependencyNames = Object.keys({
    ...manifest.dependencies,
    ...manifest.optionalDependencies,
    ...manifest.peerDependencies,
  });

  for (const dependencyName of dependencyNames) {
    if (forbiddenPackageNames.has(dependencyName)) {
      failures.push(
        `${packageDirectory} depends on authoring-only package ${dependencyName}.`,
      );
    }
  }

  const visited = new Set();
  const pending = dependencyNames.map((name) => ({
    name,
    chain: [manifest.name, name],
  }));
  while (pending.length > 0) {
    const current = pending.shift();
    if (!current || visited.has(current.name)) {
      continue;
    }
    visited.add(current.name);
    if (forbiddenPackageNames.has(current.name)) {
      failures.push(
        `${packageDirectory} reaches authoring-only package through ${current.chain.join(" -> ")}.`,
      );
      continue;
    }
    const localWorkspace = workspaceByName.get(current.name);
    if (!localWorkspace) {
      continue;
    }
    const nestedDependencyNames = Object.keys({
      ...localWorkspace.manifest.dependencies,
      ...localWorkspace.manifest.optionalDependencies,
      ...localWorkspace.manifest.peerDependencies,
    });
    for (const nestedDependencyName of nestedDependencyNames) {
      pending.push({
        name: nestedDependencyName,
        chain: [...current.chain, nestedDependencyName],
      });
    }
  }

  for (const path of await listFiles(absoluteDirectory)) {
    if (!textExtensions.has(extname(path))) {
      continue;
    }
    const contents = (await readFile(path, "utf8")).replaceAll("\\", "/");
    for (const marker of forbiddenSourceMarkers) {
      if (contents.includes(marker)) {
        failures.push(
          `${relative(repositoryRoot, path)} contains forbidden boundary marker "${marker}".`,
        );
      }
    }
  }
}

let trackedPaths = [];
try {
  trackedPaths = execFileSync("git", ["ls-files", "-z"], {
    cwd: repositoryRoot,
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean)
    .map((path) => path.replaceAll("\\", "/"));
} catch (error) {
  failures.push(
    `Could not inspect tracked paths: ${error instanceof Error ? error.message : String(error)}`,
  );
}

for (const trackedPath of trackedPaths) {
  const forbiddenPrefix = forbiddenTrackedPrefixes.find((prefix) =>
    trackedPath.startsWith(prefix),
  );
  if (forbiddenPrefix) {
    failures.push(
      `Git tracks private workbench path ${trackedPath} (forbidden prefix ${forbiddenPrefix}).`,
    );
  }
}

if (failures.length > 0) {
  throw new Error(`Application boundary verification failed:\n- ${failures.join("\n- ")}`);
}

console.log(
  `Verified runtime dependency boundaries and ${trackedPaths.length} tracked path(s).`,
);
