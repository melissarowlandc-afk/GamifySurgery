import { lstat, mkdir, realpath } from "node:fs/promises";
import { isAbsolute, relative, resolve } from "node:path";

export const PRIVATE_CLINICAL_DATA_DIRECTORY = ".private-clinical-data";
export const DEFAULT_PRIVATE_INTAKE_DIRECTORY = "clinical-research/source-intake";

export interface PrivateIntakePaths {
  projectRoot: string;
  privateBoundary: string;
  root: string;
  inbox: string;
  staging: string;
  rightsBlocked: string;
  processed: string;
  duplicates: string;
  quarantine: string;
  extracted: string;
  manifests: string;
  providerDiscovery: string;
  lockFile: string;
  intakeManifest: string;
}

const isWithin = (parent: string, candidate: string): boolean => {
  const pathFromParent = relative(parent, candidate);
  return (
    pathFromParent === "" ||
    (!pathFromParent.startsWith("..") && !isAbsolute(pathFromParent))
  );
};

/**
 * Resolve a private intake root without touching the filesystem.
 *
 * A caller may choose a nested location, but it must remain below the
 * repository's already-gitignored `.private-clinical-data` boundary.
 */
export const resolvePrivateIntakePaths = (
  projectRoot: string,
  requestedRoot?: string,
): PrivateIntakePaths => {
  const resolvedProjectRoot = resolve(projectRoot);
  const privateBoundary = resolve(
    resolvedProjectRoot,
    PRIVATE_CLINICAL_DATA_DIRECTORY,
  );
  const root = requestedRoot
    ? resolve(resolvedProjectRoot, requestedRoot)
    : resolve(privateBoundary, DEFAULT_PRIVATE_INTAKE_DIRECTORY);

  if (!isWithin(privateBoundary, root)) {
    throw new Error(
      "Private clinical source intake must stay below .private-clinical-data.",
    );
  }

  return {
    projectRoot: resolvedProjectRoot,
    privateBoundary,
    root,
    inbox: resolve(root, "inbox"),
    staging: resolve(root, "staging"),
    rightsBlocked: resolve(root, "rights-blocked"),
    processed: resolve(root, "processed"),
    duplicates: resolve(root, "duplicates"),
    quarantine: resolve(root, "quarantine"),
    extracted: resolve(root, "extracted"),
    manifests: resolve(root, "manifests"),
    providerDiscovery: resolve(root, "provider-discovery"),
    lockFile: resolve(root, "manifests", "intake.lock.json"),
    intakeManifest: resolve(root, "manifests", "intake-manifest.json"),
  };
};

const assertOrdinaryDirectory = async (path: string): Promise<void> => {
  const details = await lstat(path);
  if (details.isSymbolicLink() || !details.isDirectory()) {
    throw new Error(
      "Private clinical intake paths must be ordinary local directories, not links.",
    );
  }
};

/**
 * Create and validate the complete private directory chain.
 *
 * Symlinks are rejected so a seemingly private path cannot redirect source
 * bytes into a tracked or externally synchronized location.
 */
export const ensurePrivateIntakePaths = async (
  paths: PrivateIntakePaths,
): Promise<void> => {
  await mkdir(paths.privateBoundary, { recursive: true, mode: 0o700 });
  await assertOrdinaryDirectory(paths.privateBoundary);

  const directories = [
    paths.root,
    paths.inbox,
    paths.staging,
    paths.rightsBlocked,
    paths.processed,
    paths.duplicates,
    paths.quarantine,
    paths.extracted,
    paths.manifests,
    paths.providerDiscovery,
  ];

  for (const directory of directories) {
    if (!isWithin(paths.privateBoundary, directory)) {
      throw new Error("Resolved private intake path escaped its boundary.");
    }
    const segments = relative(paths.privateBoundary, directory)
      .split(/[\\/]/)
      .filter(Boolean);
    let current = paths.privateBoundary;
    for (const segment of segments) {
      current = resolve(current, segment);
      try {
        await assertOrdinaryDirectory(current);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
        await mkdir(current, { mode: 0o700 });
        await assertOrdinaryDirectory(current);
      }
    }
  }

  const actualBoundary = await realpath(paths.privateBoundary);
  const actualRoot = await realpath(paths.root);
  if (!isWithin(actualBoundary, actualRoot)) {
    throw new Error("Private clinical intake root resolved outside its boundary.");
  }
};
