import { createReadStream } from "node:fs";
import { lstat } from "node:fs/promises";
import { createHash } from "node:crypto";

export class SourceFingerprintError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SourceFingerprintError";
  }
}

export type SourceFileFingerprint = {
  sha256: string;
  byteLength: number;
};

/**
 * Fingerprint an owner-local source without copying or retaining its contents.
 *
 * Symbolic links are rejected so a configured workbench path cannot silently
 * resolve to an unintended file. A second metadata read detects common cases
 * where a file changes while it is being hashed.
 */
export async function fingerprintSourceFile(
  path: string,
): Promise<SourceFileFingerprint> {
  const before = await lstat(path);
  if (before.isSymbolicLink() || !before.isFile()) {
    throw new SourceFingerprintError(
      `Source input must be a regular file, not a link or directory: ${path}`,
    );
  }

  const hash = createHash("sha256");
  let byteLength = 0;
  const stream = createReadStream(path);
  for await (const chunk of stream) {
    const bytes = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    byteLength += bytes.byteLength;
    hash.update(bytes);
  }

  const after = await lstat(path);
  if (
    !after.isFile() ||
    after.isSymbolicLink() ||
    after.size !== before.size ||
    after.mtimeMs !== before.mtimeMs ||
    byteLength !== after.size
  ) {
    throw new SourceFingerprintError(
      `Source changed while it was being fingerprinted: ${path}`,
    );
  }

  return {
    sha256: hash.digest("hex"),
    byteLength,
  };
}
