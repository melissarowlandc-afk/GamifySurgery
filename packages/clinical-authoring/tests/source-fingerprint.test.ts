import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, describe, expect, it } from "vitest";

import {
  fingerprintSourceFile,
  SourceFingerprintError,
} from "../src/source-fingerprint.js";

const temporaryDirectories: string[] = [];

async function temporaryDirectory(): Promise<string> {
  const directory = await mkdtemp(
    join(tmpdir(), "gamify-surgery-source-fingerprint-"),
  );
  temporaryDirectories.push(directory);
  return directory;
}

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { force: true, recursive: true }),
    ),
  );
});

describe("source-file fingerprinting", () => {
  it("returns the exact SHA-256 and byte length without retaining contents", async () => {
    const directory = await temporaryDirectory();
    const sourcePath = join(directory, "source.txt");
    await writeFile(sourcePath, "abc", "utf8");

    await expect(fingerprintSourceFile(sourcePath)).resolves.toEqual({
      sha256:
        "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
      byteLength: 3,
    });
  });

  it("rejects directories", async () => {
    const directory = await temporaryDirectory();
    const nestedDirectory = join(directory, "not-a-file");
    await mkdir(nestedDirectory);

    await expect(fingerprintSourceFile(nestedDirectory)).rejects.toBeInstanceOf(
      SourceFingerprintError,
    );
  });
});
