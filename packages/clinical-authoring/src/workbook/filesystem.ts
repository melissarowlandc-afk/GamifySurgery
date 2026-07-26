import {
  link,
  lstat,
  mkdir,
  mkdtemp,
  readFile,
  rm,
  rmdir,
  unlink,
  writeFile,
} from "node:fs/promises";
import { basename, dirname, isAbsolute, join, normalize, sep } from "node:path";

export class WorkbookFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkbookFileError";
  }
}

export type WorkbookTemplateFile = {
  relativePath: string;
  contents: string;
};

function assertSafeRelativePath(relativePath: string): void {
  const normalized = normalize(relativePath);
  if (
    relativePath.length === 0 ||
    isAbsolute(relativePath) ||
    normalized === ".." ||
    normalized.startsWith(`..${sep}`)
  ) {
    throw new WorkbookFileError(
      `Workbook template path must remain inside its directory: ${relativePath || "<empty>"}`,
    );
  }
}

async function pathExists(path: string): Promise<boolean> {
  try {
    await lstat(path);
    return true;
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return false;
    }
    throw error;
  }
}

/**
 * Create a workbook directory without ever replacing an existing path.
 *
 * Files are first written to a new sibling temporary directory. The final
 * target directory and every child directory are then claimed exclusively,
 * and staged files are published with exclusive hard links. Cleanup removes
 * only file identities created by this operation, so a concurrent addition is
 * never overwritten or recursively deleted.
 */
export async function initializeWorkbookDirectory(
  targetDirectory: string,
  files: readonly WorkbookTemplateFile[],
): Promise<void> {
  if (files.length === 0) {
    throw new WorkbookFileError(
      "A workbook initializer must contain at least one template file.",
    );
  }
  if (await pathExists(targetDirectory)) {
    throw new WorkbookFileError(
      `Refusing to overwrite existing workbook path: ${targetDirectory}`,
    );
  }

  const seen = new Set<string>();
  for (const file of files) {
    assertSafeRelativePath(file.relativePath);
    const key = normalize(file.relativePath).toLocaleLowerCase("en-US");
    if (seen.has(key)) {
      throw new WorkbookFileError(
        `Duplicate workbook template path: ${file.relativePath}`,
      );
    }
    seen.add(key);
  }

  const parentDirectory = dirname(targetDirectory);
  await mkdir(parentDirectory, { recursive: true });
  const temporaryDirectory = await mkdtemp(
    join(parentDirectory, `.${basename(targetDirectory)}.init-`),
  );
  const createdDirectories: {
    path: string;
    device: number;
    inode: number;
  }[] = [];
  const createdFiles: {
    stagedPath: string;
    destinationPath: string;
  }[] = [];
  const createdDirectoryPaths = new Set<string>();

  try {
    for (const file of files) {
      const destination = join(temporaryDirectory, file.relativePath);
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, file.contents, {
        encoding: "utf8",
        flag: "wx",
      });
    }
    await mkdir(targetDirectory);
    const targetMetadata = await lstat(targetDirectory);
    createdDirectories.push({
      path: targetDirectory,
      device: targetMetadata.dev,
      inode: targetMetadata.ino,
    });
    createdDirectoryPaths.add(normalize(targetDirectory));

    for (const file of files) {
      const relativeParent = dirname(file.relativePath);
      if (relativeParent !== ".") {
        let currentDirectory = targetDirectory;
        for (const segment of normalize(relativeParent).split(sep)) {
          currentDirectory = join(currentDirectory, segment);
          const normalizedDirectory = normalize(currentDirectory);
          if (createdDirectoryPaths.has(normalizedDirectory)) {
            continue;
          }
          await mkdir(currentDirectory);
          const metadata = await lstat(currentDirectory);
          createdDirectories.push({
            path: currentDirectory,
            device: metadata.dev,
            inode: metadata.ino,
          });
          createdDirectoryPaths.add(normalizedDirectory);
        }
      }

      const stagedPath = join(temporaryDirectory, file.relativePath);
      const destinationPath = join(targetDirectory, file.relativePath);
      await link(stagedPath, destinationPath);
      createdFiles.push({ stagedPath, destinationPath });
    }
    await rm(temporaryDirectory, { recursive: true });
  } catch (error: unknown) {
    for (const file of createdFiles.reverse()) {
      try {
        const [stagedMetadata, destinationMetadata] = await Promise.all([
          lstat(file.stagedPath),
          lstat(file.destinationPath),
        ]);
        if (
          stagedMetadata.dev === destinationMetadata.dev &&
          stagedMetadata.ino === destinationMetadata.ino
        ) {
          await unlink(file.destinationPath);
        }
      } catch {
        // Preserve the original initialization failure. Any path whose
        // identity cannot be proven remains untouched.
      }
    }
    for (const directory of createdDirectories.reverse()) {
      try {
        const metadata = await lstat(directory.path);
        if (
          metadata.dev === directory.device &&
          metadata.ino === directory.inode
        ) {
          await rmdir(directory.path);
        }
      } catch {
        // Preserve the original initialization failure and leave nonempty,
        // replaced, or otherwise unprovable paths untouched.
      }
    }
    await rm(temporaryDirectory, { force: true, recursive: true });
    if (createdDirectories.length === 0 && (await pathExists(targetDirectory))) {
      throw new WorkbookFileError(
        `Refusing to overwrite existing workbook path: ${targetDirectory}`,
      );
    }
    throw error;
  }
}

/**
 * Write generated workspace JSON only when the destination does not exist.
 */
export async function writeNewWorkbookOutput(
  outputPath: string,
  contents: string,
): Promise<void> {
  await mkdir(dirname(outputPath), { recursive: true });
  try {
    await writeFile(outputPath, contents, {
      encoding: "utf8",
      flag: "wx",
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      "code" in error &&
      error.code === "EEXIST"
    ) {
      throw new WorkbookFileError(
        `Refusing to overwrite existing output: ${outputPath}`,
      );
    }
    throw error;
  }
}

export async function readRegularWorkbookFile(path: string): Promise<Buffer> {
  const metadata = await lstat(path);
  if (metadata.isSymbolicLink() || !metadata.isFile()) {
    throw new WorkbookFileError(
      `Workbook input must be a regular file, not a link or directory: ${path}`,
    );
  }
  const maximumCsvBytes = 25 * 1024 * 1024;
  if (metadata.size > maximumCsvBytes) {
    throw new WorkbookFileError(
      `Workbook input exceeds the 25 MiB per-table limit: ${path}`,
    );
  }
  return readFile(path);
}
