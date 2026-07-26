import {
  lstat,
  mkdir,
  readFile,
  rename,
  unlink,
  writeFile,
} from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import {
  dirname,
  isAbsolute,
  join,
  relative,
  resolve,
} from "node:path";

import {
  assertAppendOnlyWorkspaceTransition,
  validateResearchWorkspace,
  type ResearchWorkspace,
} from "@gamify-surgery/clinical-research";

import { createInitialResearchWorkspace } from "./workspace.js";

const HASH_PATTERN = /^[a-f0-9]{64}$/;

export type StoredWorkspace = {
  workspace: ResearchWorkspace;
  etag: string;
  revision: string;
};

export class WorkspaceConflictError extends Error {
  constructor(
    readonly expectedEtag: string,
    readonly actualEtag: string,
  ) {
    super("The workspace changed after it was loaded.");
    this.name = "WorkspaceConflictError";
  }
}

export class WorkspaceCorruptionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkspaceCorruptionError";
  }
}

export class WorkspaceValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WorkspaceValidationError";
  }
}

function validate(candidate: unknown): ResearchWorkspace {
  try {
    return validateResearchWorkspace(candidate);
  } catch (error) {
    throw new WorkspaceValidationError(
      error instanceof Error ? error.message : "Invalid research workspace.",
    );
  }
}

function formatEtag(hash: string): string {
  return `"${hash}"`;
}

function hashContent(content: string): string {
  return createHash("sha256").update(content, "utf8").digest("hex");
}

function hasCode(error: unknown, code: string): boolean {
  return (
    error instanceof Error &&
    "code" in error &&
    (error as NodeJS.ErrnoException).code === code
  );
}

async function assertOrdinaryDirectory(path: string): Promise<void> {
  const details = await lstat(path);
  if (details.isSymbolicLink() || !details.isDirectory()) {
    throw new WorkspaceCorruptionError(
      "Workspace storage directories must be ordinary local directories.",
    );
  }
}

async function ordinaryFileExists(path: string): Promise<boolean> {
  try {
    const details = await lstat(path);
    if (details.isSymbolicLink() || !details.isFile()) {
      throw new WorkspaceCorruptionError(
        "Workspace storage files must be ordinary local files.",
      );
    }
    return true;
  } catch (error) {
    if (hasCode(error, "ENOENT")) return false;
    throw error;
  }
}

export class WorkspaceStore {
  readonly storageBoundary: string;
  readonly root: string;
  readonly revisionsRoot: string;
  readonly currentPointer: string;
  readonly backupPointer: string;
  private tail: Promise<void> = Promise.resolve();

  constructor(storageRoot: string) {
    if (!isAbsolute(storageRoot)) {
      throw new Error("Workspace storage root must be an absolute path.");
    }
    this.root = resolve(storageRoot);
    this.storageBoundary = dirname(this.root);
    this.revisionsRoot = join(this.root, "revisions");
    this.currentPointer = join(this.root, "CURRENT");
    this.backupPointer = join(this.root, "CURRENT.backup");
  }

  read(): Promise<StoredWorkspace> {
    return this.serialized(() => this.readUnlocked());
  }

  save(
    candidate: unknown,
    expectedEtag: string,
  ): Promise<StoredWorkspace> {
    const workspace = validate(candidate);
    return this.serialized(async () => {
      const current = await this.readUnlocked();
      if (current.etag !== expectedEtag) {
        throw new WorkspaceConflictError(expectedEtag, current.etag);
      }
      assertAppendOnlyWorkspaceTransition(current.workspace, workspace);
      return this.persistUnlocked(workspace);
    });
  }

  private serialized<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.tail.then(operation, operation);
    this.tail = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  }

  private async ensureDirectories(): Promise<void> {
    await mkdir(this.storageBoundary, { recursive: true, mode: 0o700 });
    await assertOrdinaryDirectory(this.storageBoundary);
    await mkdir(this.root, { mode: 0o700 }).catch((error: unknown) => {
      if (!hasCode(error, "EEXIST")) throw error;
    });
    await assertOrdinaryDirectory(this.root);
    await mkdir(this.revisionsRoot, { mode: 0o700 }).catch(
      (error: unknown) => {
        if (!hasCode(error, "EEXIST")) throw error;
      },
    );
    await assertOrdinaryDirectory(this.revisionsRoot);
  }

  private revisionPath(hash: string): string {
    if (!HASH_PATTERN.test(hash)) {
      throw new WorkspaceCorruptionError(
        "The current revision identifier is invalid.",
      );
    }
    const target = resolve(this.revisionsRoot, `${hash}.json`);
    const relation = relative(this.revisionsRoot, target);
    if (
      relation.startsWith("..") ||
      isAbsolute(relation) ||
      target === this.revisionsRoot
    ) {
      throw new WorkspaceCorruptionError(
        "A revision resolved outside the storage root.",
      );
    }
    return target;
  }

  private async readUnlocked(): Promise<StoredWorkspace> {
    await this.ensureDirectories();
    let hash: string;
    try {
      if (!(await ordinaryFileExists(this.currentPointer))) {
        throw Object.assign(new Error("Missing current pointer."), {
          code: "ENOENT",
        });
      }
      hash = (await readFile(this.currentPointer, "utf8")).trim();
    } catch (error) {
      if (!hasCode(error, "ENOENT")) {
        throw error;
      }
      try {
        if (!(await ordinaryFileExists(this.backupPointer))) {
          throw Object.assign(new Error("Missing backup pointer."), {
            code: "ENOENT",
          });
        }
        await rename(this.backupPointer, this.currentPointer);
        hash = (await readFile(this.currentPointer, "utf8")).trim();
      } catch (backupError) {
        if (!hasCode(backupError, "ENOENT")) {
          throw backupError;
        }
        return this.persistUnlocked(createInitialResearchWorkspace());
      }
    }
    const path = this.revisionPath(hash);
    if (!(await ordinaryFileExists(path))) {
      throw new WorkspaceCorruptionError(
        "The current pointer references a missing immutable revision.",
      );
    }
    let content: string;
    try {
      content = await readFile(path, "utf8");
    } catch (error) {
      if (hasCode(error, "ENOENT")) {
        throw new WorkspaceCorruptionError(
          "The current pointer references a missing immutable revision.",
        );
      }
      throw error;
    }
    if (hashContent(content) !== hash) {
      throw new WorkspaceCorruptionError(
        "The current revision does not match its content hash.",
      );
    }
    let decoded: unknown;
    try {
      decoded = JSON.parse(content);
    } catch {
      throw new WorkspaceCorruptionError(
        "The current revision is not valid JSON.",
      );
    }
    return {
      workspace: validate(decoded),
      etag: formatEtag(hash),
      revision: hash,
    };
  }

  private async persistUnlocked(
    candidate: ResearchWorkspace,
  ): Promise<StoredWorkspace> {
    await this.ensureDirectories();
    const workspace = validate(candidate);
    const content = `${JSON.stringify(workspace, null, 2)}\n`;
    const hash = hashContent(content);
    const revisionPath = this.revisionPath(hash);
    try {
      await writeFile(revisionPath, content, {
        encoding: "utf8",
        flag: "wx",
      });
    } catch (error) {
      if (!hasCode(error, "EEXIST")) {
        throw error;
      }
      await ordinaryFileExists(revisionPath);
      const existing = await readFile(revisionPath, "utf8");
      if (existing !== content) {
        throw new WorkspaceCorruptionError(
          "An immutable revision hash collision was detected.",
        );
      }
    }

    const temporaryPointer = join(
      this.root,
      `CURRENT.${process.pid}.${randomUUID()}.tmp`,
    );
    try {
      await writeFile(temporaryPointer, `${hash}\n`, {
        encoding: "utf8",
        flag: "wx",
      });
      let movedCurrentToBackup = false;
      try {
        if (!(await ordinaryFileExists(this.currentPointer))) {
          throw Object.assign(new Error("Missing current pointer."), {
            code: "ENOENT",
          });
        }
        if (await ordinaryFileExists(this.backupPointer)) {
          await unlink(this.backupPointer);
        }
        await rename(this.currentPointer, this.backupPointer);
        movedCurrentToBackup = true;
      } catch (error) {
        if (!hasCode(error, "ENOENT")) throw error;
      }
      try {
        await rename(temporaryPointer, this.currentPointer);
      } catch (error) {
        if (movedCurrentToBackup) {
          await rename(this.backupPointer, this.currentPointer);
        }
        throw error;
      }
      if (movedCurrentToBackup) {
        await unlink(this.backupPointer);
      }
    } finally {
      await unlink(temporaryPointer).catch((error: unknown) => {
        if (!hasCode(error, "ENOENT")) {
          throw error;
        }
      });
    }
    return {
      workspace,
      etag: formatEtag(hash),
      revision: hash,
    };
  }
}
