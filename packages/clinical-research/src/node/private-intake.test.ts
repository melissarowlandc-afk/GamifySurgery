import {
  mkdtemp,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  acquirePrivateIntakeLock,
  loadPrivateIntakeManifest,
  processPrivateIntake,
  recoverStalePrivateIntakeLock,
  scanPrivateIntake,
  sniffPrivateSourceMediaType,
  validatePrivateIntake,
  type IntakeClock,
  type PrivateIntakeAcknowledgement,
} from "./private-intake.js";
import {
  ensurePrivateIntakePaths,
  resolvePrivateIntakePaths,
} from "./private-paths.js";

const temporaryRoots: string[] = [];

const makeProject = async () => {
  const projectRoot = await mkdtemp(
    join(tmpdir(), "gamify-surgery-private-intake-"),
  );
  temporaryRoots.push(projectRoot);
  const paths = resolvePrivateIntakePaths(projectRoot);
  await ensurePrivateIntakePaths(paths);
  return { projectRoot, paths };
};

const acknowledgement: PrivateIntakeAcknowledgement = {
  id: "ack.test.private-intake",
  noIdentifiablePatientInformation: true,
  authorizedLocalStorageAndProcessing: true,
  sharedAndCopyrightedMaterialConsidered: true,
  acknowledgedBy: "Test reviewer",
  acknowledgedAt: "2026-07-26T12:00:00.000Z",
  scope: "Synthetic test files only",
};

const fixedClock: IntakeClock = {
  now: () => new Date("2026-07-26T12:00:00.000Z"),
  nowMs: () => Date.parse("2026-07-26T12:00:00.000Z"),
};

afterEach(async () => {
  await Promise.all(
    temporaryRoots
      .splice(0)
      .map((root) => rm(root, { recursive: true, force: true })),
  );
});

describe("private clinical source intake", () => {
  it("refuses a configured intake path outside the ignored private boundary", () => {
    expect(() =>
      resolvePrivateIntakePaths("C:\\project", "clinical-data/public"),
    ).toThrow(/\.private-clinical-data/);
  });

  it("sniffs allowed bytes instead of trusting the filename alone", () => {
    expect(
      sniffPrivateSourceMediaType(Buffer.from("%PDF-1.7\n"), "wrong.txt"),
    ).toBe("application/pdf");
    expect(
      sniffPrivateSourceMediaType(
        Buffer.from([0x50, 0x4b, 0x03, 0x04]),
        "chapter.docx",
      ),
    ).toBe(
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    expect(
      sniffPrivateSourceMediaType(Buffer.from("plain text"), "payload.bin"),
    ).toBeNull();
  });

  it("checkpoints queued, duplicate, rights-blocked, and quarantined files", async () => {
    const { paths } = await makeProject();
    await writeFile(join(paths.inbox, "a-primary.txt"), "same safe bytes");
    await writeFile(join(paths.inbox, "blocked.txt"), "rights blocked");
    await writeFile(join(paths.inbox, "no-storage.txt"), "must not be opened");
    await writeFile(join(paths.inbox, "unknown.bin"), Buffer.from([0, 1, 2, 3]));
    await writeFile(join(paths.inbox, "z-copy.txt"), "same safe bytes");

    const report = await scanPrivateIntake({
      paths,
      acknowledgement,
      clock: fixedClock,
      tokenFactory: () => "fixed-token",
      resolveRights: (filename) => {
        if (filename === "no-storage.txt") return null;
        return {
          sourceId: `source.${filename}`,
          rightsDecisionId: `rights.${filename}`,
          rightsDecisionSha256: "a".repeat(64),
          rightsDecisionEffectiveAt: "2026-07-25T12:00:00.000Z",
          rightsDecisionExpiresAt: null,
          reviewedAt: "2026-07-25T12:00:00.000Z",
          privateStoragePermitted: true,
          localProcessingPermitted: filename !== "blocked.txt",
        };
      },
    });

    expect(report).toMatchObject({
      queued: 1,
      duplicates: 1,
      rightsBlocked: 2,
      quarantined: 1,
    });
    const manifest = await loadPrivateIntakeManifest(paths, fixedClock);
    expect(manifest.entries).toHaveLength(5);
    const primary = manifest.entries.find(
      (entry) => entry.originalFilename === "a-primary.txt",
    )!;
    const duplicate = manifest.entries.find(
      (entry) => entry.originalFilename === "z-copy.txt",
    )!;
    expect(primary.status).toBe("queued");
    expect(primary.id).toContain(primary.sha256);
    expect(duplicate).toMatchObject({
      status: "duplicate",
      duplicateOfId: primary.id,
      sha256: primary.sha256,
    });
    expect(
      manifest.entries.find(
        (entry) => entry.originalFilename === "blocked.txt",
      ),
    ).toMatchObject({
      status: "rights_blocked",
      errorCode: "LOCAL_PROCESSING_NOT_PERMITTED",
    });
    const noStorage = manifest.entries.find(
      (entry) => entry.originalFilename === "no-storage.txt",
    )!;
    expect(noStorage).toMatchObject({
      status: "rights_blocked",
      sha256: null,
      errorCode: "PRIVATE_STORAGE_NOT_PERMITTED",
    });
    expect(
      await readFile(join(paths.inbox, "no-storage.txt"), "utf8"),
    ).toBe("must not be opened");
    await expect(readFile(paths.lockFile, "utf8")).rejects.toMatchObject({
      code: "ENOENT",
    });
  });

  it("quarantines an oversized file before hashing it", async () => {
    const { paths } = await makeProject();
    await writeFile(join(paths.inbox, "oversized.txt"), "123456");
    const report = await scanPrivateIntake({
      paths,
      acknowledgement,
      maxBytes: 5,
      clock: fixedClock,
      tokenFactory: () => "fixed-token",
      resolveRights: () => ({
        sourceId: "source.oversized",
        rightsDecisionId: "rights.oversized",
        rightsDecisionSha256: "b".repeat(64),
        rightsDecisionEffectiveAt: "2026-07-25T12:00:00.000Z",
        rightsDecisionExpiresAt: null,
        reviewedAt: "2026-07-25T12:00:00.000Z",
        privateStoragePermitted: true,
        localProcessingPermitted: true,
      }),
    });
    expect(report.quarantined).toBe(1);
    const completedManifest = await loadPrivateIntakeManifest(paths);
    const [entry] = completedManifest.entries;
    expect(entry).toMatchObject({
      status: "quarantined",
      sha256: null,
      errorCode: "SOURCE_TOO_LARGE",
    });
  });

  it("writes an immutable parser-versioned artifact and validates it", async () => {
    const { paths } = await makeProject();
    await writeFile(join(paths.inbox, "chapter.md"), "# Heading\n\nBody");
    await scanPrivateIntake({
      paths,
      acknowledgement,
      clock: fixedClock,
      tokenFactory: () => "fixed-token",
      resolveRights: () => ({
        sourceId: "source.chapter",
        rightsDecisionId: "rights.chapter",
        rightsDecisionSha256: "c".repeat(64),
        rightsDecisionEffectiveAt: "2026-07-25T12:00:00.000Z",
        rightsDecisionExpiresAt: null,
        reviewedAt: "2026-07-25T12:00:00.000Z",
        privateStoragePermitted: true,
        localProcessingPermitted: true,
      }),
    });

    const report = await processPrivateIntake({
      paths,
      clock: fixedClock,
      tokenFactory: () => "fixed-token",
      extract: async (filePath) => ({
        parserId: "test-markdown-parser",
        parserVersion: "1",
        chunkerVersion: "1",
        payload: {
          normalizedText: await readFile(filePath, "utf8"),
        },
      }),
    });

    expect(report).toMatchObject({ extracted: 1, quarantined: 0 });
    const completedManifest = await loadPrivateIntakeManifest(paths);
    const [entry] = completedManifest.entries;
    expect(entry).toMatchObject({
      status: "extracted",
      parserId: "test-markdown-parser",
      parserVersion: "1",
      chunkerVersion: "1",
    });
    expect(entry?.extractionArtifactId).toContain(entry?.sha256);
    expect(
      completedManifest.events
        .filter((event) => event.entryId === entry?.id)
        .map((event) => event.toStatus),
    ).toEqual(["discovered", "queued", "extracting", "extracted"]);
    expect(completedManifest.acknowledgements).toEqual([acknowledgement]);
    await expect(validatePrivateIntake(paths)).resolves.toEqual({
      valid: true,
      issues: [],
    });
  });

  it("serializes writers and redacts private extraction failures", async () => {
    const { paths } = await makeProject();
    const lock = await acquirePrivateIntakeLock(paths, {
      clock: fixedClock,
      tokenFactory: () => "owner-token",
    });
    await expect(
      acquirePrivateIntakeLock(paths, {
        clock: fixedClock,
        tokenFactory: () => "other-token",
      }),
    ).rejects.toMatchObject({ code: "INTAKE_LOCKED" });
    await lock.release();

    await writeFile(join(paths.inbox, "failure.txt"), "safe test text");
    await scanPrivateIntake({
      paths,
      acknowledgement,
      clock: fixedClock,
      tokenFactory: () => "fixed-token",
      resolveRights: () => ({
        sourceId: "source.failure",
        rightsDecisionId: "rights.failure",
        rightsDecisionSha256: "d".repeat(64),
        rightsDecisionEffectiveAt: "2026-07-25T12:00:00.000Z",
        rightsDecisionExpiresAt: null,
        reviewedAt: "2026-07-25T12:00:00.000Z",
        privateStoragePermitted: true,
        localProcessingPermitted: true,
      }),
    });
    await processPrivateIntake({
      paths,
      clock: fixedClock,
      tokenFactory: () => "fixed-token",
      extract: () => {
        throw new Error(
          "C:\\private\\chapter.pdf reviewer@example.com?token=secret",
        );
      },
    });
    const [entry] = (await loadPrivateIntakeManifest(paths)).entries;
    expect(entry).toMatchObject({
      status: "quarantined",
      errorCode: "EXTRACTION_FAILED",
    });
    expect(entry?.errorMessage).not.toContain("reviewer@example.com");
    expect(entry?.errorMessage).not.toContain("secret");
    expect(entry?.errorMessage).not.toContain("chapter.pdf");
  });

  it("recovers only an explicitly confirmed old lock whose process is gone", async () => {
    const { paths } = await makeProject();
    await acquirePrivateIntakeLock(paths, {
      clock: fixedClock,
      tokenFactory: () => "abandoned-owner-token",
    });
    const recoveryClock: IntakeClock = {
      now: () => new Date("2026-07-26T12:20:00.000Z"),
      nowMs: () => Date.parse("2026-07-26T12:20:00.000Z"),
    };

    await expect(
      recoverStalePrivateIntakeLock(paths, {
        confirmed: true,
        recoveredBy: "author.local.workbench",
        reason: "Confirmed abandoned test process.",
        minimumAgeMilliseconds: 30 * 60 * 1000,
        clock: recoveryClock,
        isProcessAlive: () => false,
      }),
    ).rejects.toMatchObject({ code: "INTAKE_LOCK_NOT_STALE" });
    await expect(
      recoverStalePrivateIntakeLock(paths, {
        confirmed: true,
        recoveredBy: "author.local.workbench",
        reason: "Confirmed abandoned test process.",
        clock: recoveryClock,
        isProcessAlive: () => true,
      }),
    ).rejects.toMatchObject({ code: "INTAKE_LOCK_OWNER_ACTIVE" });

    const recovery = await recoverStalePrivateIntakeLock(paths, {
      confirmed: true,
      recoveredBy: "author.local.workbench",
      reason: "Confirmed abandoned test process.",
      clock: recoveryClock,
      isProcessAlive: () => false,
    });
    expect(recovery).toMatchObject({
      schemaVersion: 1,
      recoveredAt: "2026-07-26T12:20:00.000Z",
      recoveredBy: "author.local.workbench",
      reason: "Confirmed abandoned test process.",
      previousAcquiredAt: "2026-07-26T12:00:00.000Z",
    });
    await expect(readFile(paths.lockFile, "utf8")).rejects.toMatchObject({
      code: "ENOENT",
    });
    const manifests = await readdir(paths.manifests);
    expect(
      manifests.some((name) => name === recovery.archivedLockFilename),
    ).toBe(true);
    expect(
      manifests.some((name) => name === `${recovery.recoveryId}.json`),
    ).toBe(true);

    const nextLock = await acquirePrivateIntakeLock(paths, {
      clock: recoveryClock,
      tokenFactory: () => "new-owner-token",
    });
    await nextLock.release();
  });
});
